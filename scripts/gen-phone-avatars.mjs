// ============================================================================
// 手机通讯录里那八个头像
//
// 【为什么不是裁一张脸】
// 头像是**她自己挑的图**。十七岁的人不会把自己的证件照设成头像——
// 她会设一样"代表我"的东西：空设的是球，铃设的是土星，
// 稻荷设的是神社门口那只石狐狸。这比八张脸更能说明这八个人是谁，
// 而且列表里一眼扫过去，认的是形状和颜色，不是五官。
//
// 【颜色跟着对话框走】
// 每个人在剧本里的 speech color 是固定的（明日香红、光天蓝、铃靛……）。
// 头像的主色照抄那一套，于是通讯录里的色块和对话里的名字牌是同一个人。
//
// 【一次拼版出完】
// 九宫格一张图，八个头像加一格占位，一次 API 调用。
// 头像是满格出血的（不像道具图标要抠白底），所以直接按三等分切，
// 不需要做物件检测——但切之前还是要先看一眼格子对不对得齐。
//
// 用法：
//   node scripts/gen-phone-avatars.mjs --sheet     出拼版
//   node scripts/gen-phone-avatars.mjs --slice     切成 8 张（不花钱）
// ============================================================================
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, '.generated', 'phone');
const OUT = path.join(ROOT, 'public', 'images', 'phone');

function readKey() {
  const NAMES = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'VITE_GEMINI_API_KEY', 'VITE_GOOGLE_API_KEY'];
  for (const k of NAMES) if (process.env[k]) return process.env[k];
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return '';
  const found = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const val = m[2].trim().replace(/^["']|["']$/g, '');
    if (val) found[m[1]] = val; else delete found[m[1]];
  }
  for (const k of NAMES) if (found[k]) return found[k];
  return '';
}

// 从左到右、从上到下。第九格是占位，切完丢掉。
const IDS = ['asuka', 'hikari', 'rei', 'inari', 'nao', 'sora', 'miyuki', 'maki', null];

const PROMPT = [
  'A 3 by 3 grid of 9 square social-media profile pictures, edge to edge, no gaps and no margins between cells.',
  'Each cell is a complete square image that fills its cell entirely, in a soft anime illustration style',
  'with clean lines and gentle lighting - the kind of picture a Japanese high-school girl would set as her chat icon.',
  'Every cell has ONE clear subject, centred, large, readable at thumbnail size, on a simple uncluttered background.',
  'NO people, NO faces, NO hands anywhere. NO text, letters, numbers, logos or watermarks anywhere.',
  'The nine cells, in order left to right, top to bottom:',
  '1 a crisp scarlet hair ribbon tied in a precise bow on a deep navy surface, cool and tidy;',
  '2 a single sunflower head against a bright summer sky, warm yellow, very cheerful;',
  '3 the planet Saturn with its rings against a deep indigo star field, quiet and precise;',
  '4 a weathered stone fox statue wearing a red bib, framed by a vermilion torii pillar, amber evening light;',
  '5 a small worn hand-drawn cat sticker on the corner of an old emerald-green notebook, childish and much loved;',
  '6 an orange basketball resting on a polished wooden gym floor, warm side light;',
  '7 a porcelain teacup of tea with steam rising, on a saucer by a window, soft violet-grey morning light;',
  '8 a glowing arcade cabinet screen in the dark, hot pink and magenta neon, with a pair of headphones hooked over the corner;',
  '9 a plain smooth grey square, completely empty.'
].join(' ');

const args = process.argv.slice(2);

function post(payload, key) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(key),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 250)}`));
        const json = JSON.parse(body);
        const part = (json.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
        const d = part && (part.inlineData || part.inline_data);
        if (!d) return reject(new Error('返回里没有图片'));
        resolve(Buffer.from(d.data, 'base64'));
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

if (args.includes('--sheet')) {
  const key = readKey();
  if (!key) { console.error('缺 API key'); process.exit(1); }
  fs.mkdirSync(RAW, { recursive: true });
  process.stdout.write('avatars ... ');
  const raw = await post(JSON.stringify({
    contents: [{ parts: [{ text: PROMPT }] }],
    generationConfig: { imageConfig: { aspectRatio: '1:1' } }
  }), key);
  const out = path.join(RAW, 'sheet.png');
  await sharp(raw).png().toFile(out);
  const m = await sharp(raw).metadata();
  console.log(`OK ${m.width}x${m.height} → ${path.relative(ROOT, out)}`);
  console.log('先看一眼格子齐不齐，再跑 --slice');
  process.exit(0);
}

if (args.includes('--slice')) {
  const src = path.join(RAW, 'sheet.png');
  if (!fs.existsSync(src)) { console.error('还没有拼版，先跑 --sheet'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const { width: W, height: H } = await sharp(src).metadata();
  // 头像是满格出血的，所以按三等分直接切，不做物件检测。
  // 往里收一点是为了躲开相邻格之间那条被模型画出来的白接缝——
  // 实测那条缝有四五个像素宽，收 1% 不够，2.2% 才干净。
  const cw = Math.floor(W / 3), ch = Math.floor(H / 3);
  const inset = Math.round(Math.min(cw, ch) * 0.022);
  let n = 0;
  for (let i = 0; i < 9; i++) {
    const id = IDS[i];
    if (!id) continue;
    const left = (i % 3) * cw + inset, top = Math.floor(i / 3) * ch + inset;
    await sharp(src)
      .extract({ left, top, width: cw - inset * 2, height: ch - inset * 2 })
      .resize(256, 256, { fit: 'cover' })
      .webp({ quality: 88 })
      .toFile(path.join(OUT, `${id}.webp`));
    n++;
  }
  console.log(`切出 ${n} 张 → ${path.relative(ROOT, OUT)}`);
  process.exit(0);
}

console.log('用法: --sheet  或  --slice');
