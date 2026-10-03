import fs from 'fs';
import os from 'os';
import path from 'path';
import type { Plugin, Connect } from 'vite';

// ---------------------------------------------------------
// 💾 本地存档：把浏览器里的存档同步成这台电脑上的文件
//
// 游戏的存档本来只在浏览器的 localStorage 里。那东西有两个坑：
//   · 它认的是"网址"。端口一变（3000 被占了，Vite 自己换成 3001），
//     就是另一个网站，存档看起来全没了。
//   · 清一次浏览器数据、换一个浏览器，存档也就没了。
//
// 这里在开发服务器上开一个小接口，前端每写一次存档就顺手存一份到磁盘：
//   默认位置：%USERPROFILE%\Saved Games\KobeStudy（可用环境变量 KOBE_SAVE_DIR 改）
// 「Saved Games / 保存的游戏」是 Windows 专门给游戏存档留的文件夹。
// 不用「文档」：很多电脑的文档被 OneDrive 同步，存档频繁写入时会被锁、会冒出冲突副本。
// 也不放在项目文件夹里——这个项目有自动同步到 GitHub 的脚本，存档不该被推上网。
//
// 每个键一个文件：<键>.json = { value, savedAt }。覆盖前留一份 .bak，
// 删除的不真删，挪进「已删除」文件夹。
// ---------------------------------------------------------

export const SAVE_DIR = process.env.KOBE_SAVE_DIR || path.join(os.homedir(), 'Saved Games', 'KobeStudy');
// 第一版放在「文档\KobeStudy存档」。新位置还空着的话，从那儿搬过来一次（只复制，旧文件留着）。
const LEGACY_DIR = path.join(os.homedir(), 'Documents', 'KobeStudy存档');

const migrateLegacy = () => {
  try {
    if (process.env.KOBE_SAVE_DIR || !fs.existsSync(LEGACY_DIR)) return;
    fs.mkdirSync(SAVE_DIR, { recursive: true });
    if (fs.readdirSync(SAVE_DIR).some(n => n.endsWith('.json'))) return;
    for (const name of fs.readdirSync(LEGACY_DIR)) {
      const from = path.join(LEGACY_DIR, name);
      if (fs.statSync(from).isFile()) fs.copyFileSync(from, path.join(SAVE_DIR, name));
    }
    fs.writeFileSync(
      path.join(LEGACY_DIR, '存档已搬到 Saved Games 了.txt'),
      `存档现在在：${SAVE_DIR}\r\n这个文件夹里是搬家前的旧副本，确认新位置能正常读档后可以删掉。\r\n`,
      'utf8'
    );
  } catch { /* 搬不动就算了：旧文件还在原处，不会丢 */ }
};
const TRASH_DIR = path.join(SAVE_DIR, '已删除');
const ROUTE = '/__local_saves';

// 只认游戏自己的键，而且文件名里不能有奇怪字符
const KEY_OK = /^kobe_[A-Za-z0-9_\-.]{1,120}$/;
// API Key 永远不落盘
const NEVER = new Set(['kobe_study_user_api_key']);

const fileOf = (key: string) => path.join(SAVE_DIR, `${key}.json`);

const readBody = (req: Connect.IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', c => chunks.push(c as Buffer));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

const writeAtomic = (file: string, text: string) => {
  if (fs.existsSync(file)) fs.copyFileSync(file, file.replace(/\.json$/, '.bak'));
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, text, 'utf8');
  fs.renameSync(tmp, file);
};

const readAll = (): Record<string, { value: string; savedAt: number }> => {
  const out: Record<string, { value: string; savedAt: number }> = {};
  if (!fs.existsSync(SAVE_DIR)) return out;
  for (const name of fs.readdirSync(SAVE_DIR)) {
    if (!name.endsWith('.json')) continue;
    const key = name.slice(0, -5);
    if (!KEY_OK.test(key) || NEVER.has(key)) continue;
    try {
      const rec = JSON.parse(fs.readFileSync(path.join(SAVE_DIR, name), 'utf8'));
      if (typeof rec?.value === 'string') out[key] = { value: rec.value, savedAt: Number(rec.savedAt) || 0 };
    } catch { /* 坏掉的文件跳过，.bak 还在 */ }
  }
  return out;
};

const handler: Connect.NextHandleFunction = async (req, res, next) => {
  if (!req.url || !req.url.startsWith(ROUTE)) return next();
  const send = (code: number, body: unknown) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
  };
  // 开发服务器监听的是 0.0.0.0（局域网也连得上），存档接口只给这台电脑自己用
  const ip = req.socket.remoteAddress || '';
  if (!/^(127\.|::1$|::ffff:127\.)/.test(ip)) return send(403, { error: 'local only' });
  try {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
    const key = decodeURIComponent(req.url.slice(ROUTE.length).replace(/^\//, '').split('?')[0]);

    if (req.method === 'GET' && !key) return send(200, { dir: SAVE_DIR, saves: readAll() });

    if (!KEY_OK.test(key) || NEVER.has(key)) return send(400, { error: 'bad key' });

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = JSON.parse(await readBody(req));
      if (typeof body?.value !== 'string') return send(400, { error: 'value must be a string' });
      writeAtomic(fileOf(key), JSON.stringify({ value: body.value, savedAt: Number(body.savedAt) || Date.now() }));
      return send(200, { ok: true });
    }

    if (req.method === 'DELETE') {
      const f = fileOf(key);
      if (fs.existsSync(f)) {
        fs.mkdirSync(TRASH_DIR, { recursive: true });
        fs.renameSync(f, path.join(TRASH_DIR, `${key}.${Date.now()}.json`));
      }
      return send(200, { ok: true });
    }

    return send(405, { error: 'method not allowed' });
  } catch (e: any) {
    return send(500, { error: String(e?.message || e) });
  }
};

export const localSaves = (): Plugin => ({
  name: 'kobe-local-saves',
  configureServer(server) {
    migrateLegacy();
    server.middlewares.use(handler);
    server.httpServer?.once('listening', () => {
      server.config.logger.info(`  💾 本地存档目录: ${SAVE_DIR}`);
    });
  },
  configurePreviewServer(server) {
    migrateLegacy();
    server.middlewares.use(handler);
  }
});
