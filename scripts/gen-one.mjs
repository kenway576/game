// 🖼️ 按一段提示词出一张图（Gemini · gemini-2.5-flash-image）。
//
// 项目里已经有一堆专用生成脚本（大厅立绘、手机头像、道具图标…），
// 但偶尔就是需要单出一张：学生证上的照片、某个道具的特写、一张补的背景。
// 为这种事再写一个专用脚本不值当，所以留一个通用的。
//
// 用法：
//   GEMINI_API_KEY=... node scripts/gen-one.mjs \
//     --out .generated/misc/idphoto.png \
//     --ratio 3:4 --n 3 \
//     --prompt "..."
//
//   --promptFile <路径>   提示词太长时从文件读，免得被 shell 的引号折腾
//
// 只写进 .generated/，不碰 public。

import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };

const OUT = arg('out');
const RATIO = arg('ratio', '1:1');
const N = Number(arg('n', 1));
const PROMPT_FILE = arg('promptFile');
const PROMPT = PROMPT_FILE ? fs.readFileSync(PROMPT_FILE, 'utf8') : arg('prompt');
const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!OUT || !PROMPT) { console.error('用法：--out <路径> --prompt "..." [--ratio 3:4] [--n 2]'); process.exit(1); }
if (!KEY) { console.error('缺 GEMINI_API_KEY'); process.exit(1); }

const post = (payload) => new Promise((resolve, reject) => {
  const req = https.request({
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(KEY),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
  }, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 220)}`));
      const j = JSON.parse(body);
      const part = (j.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
      const d = part && (part.inlineData || part.inline_data);
      if (!d) return reject(new Error('返回里没有图片'));
      resolve(Buffer.from(d.data, 'base64'));
    });
  });
  req.on('error', reject);
  req.write(payload); req.end();
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const ext = path.extname(OUT) || '.png';
const base = OUT.slice(0, OUT.length - ext.length);

for (let i = 1; i <= N; i++) {
  const target = N === 1 ? OUT : `${base}_${i}${ext}`;
  process.stdout.write(`${path.basename(target)} ... `);
  try {
    const raw = await post(JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }] }],
      generationConfig: { imageConfig: { aspectRatio: RATIO } }
    }));
    await sharp(raw).toFile(target);
    const m = await sharp(target).metadata();
    console.log(`OK ${m.width}x${m.height}`);
  } catch (e) { console.log('失败:', e.message); }
  if (i < N) await new Promise(r => setTimeout(r, 1200));
}
