// 把 .generated/fix 里选中的一张，抠掉白底、裁边、缩放，装进 public。
//
// 白底只从画布四边往里泛洪 —— 角色身上的白（狐火的高光、和服的白鹤）
// 是被包围的，泛洪进不去，所以不会被误伤。
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const [, , SRC, DST, HEIGHT = '1400'] = process.argv;
if (!SRC || !DST) { console.error('用法: node adopt.mjs <源png> <目标webp> [高度]'); process.exit(1); }

const { data, info } = await sharp(fs.readFileSync(SRC)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;
const at = (x, y) => (y * W + x) * 4;

const isWhite = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return Math.min(r, g, b) >= 236 && (Math.max(r, g, b) - Math.min(r, g, b)) <= 26;
};

// 四边泛洪
const bg = new Uint8Array(N);
const q = [];
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const k = y * W + x;
  if (bg[k]) return;
  if (!isWhite(at(x, y))) return;
  bg[k] = 1; q.push(k);
};
for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
while (q.length) {
  const k = q.pop(), x = k % W, y = (k / W) | 0;
  push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
}

const out = Buffer.from(data);
for (let k = 0; k < N; k++) if (bg[k]) out[k * 4 + 3] = 0;

// 羽化：贴着背景的那一圈按"离白有多远"给半透明，边缘才不会像剪刀剪的
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  const k = y * W + x;
  if (bg[k] || out[k * 4 + 3] === 0) continue;
  let touches = false;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (bg[(y + dy) * W + (x + dx)]) touches = true;
  if (!touches) continue;
  const i = at(x, y);
  const lum = Math.min(data[i], data[i + 1], data[i + 2]);
  out[i + 3] = Math.max(0, Math.min(255, Math.round(255 * (1 - Math.max(0, (lum - 200) / 55)))));
}

// 按内容裁边
let top = H, bot = 0, left = W, right = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (out[at(x, y) + 3] > 24) { if (y < top) top = y; if (y > bot) bot = y; if (x < left) left = x; if (x > right) right = x; }
}
const pad = 6;
top = Math.max(0, top - pad); left = Math.max(0, left - pad);
bot = Math.min(H - 1, bot + pad); right = Math.min(W - 1, right + pad);

await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left, top, width: right - left + 1, height: bot - top + 1 })
  .resize({ height: Number(HEIGHT), fit: 'inside', withoutEnlargement: false })
  .webp({ quality: 94, alphaQuality: 100 })
  .toFile(DST);

const m = await sharp(DST).metadata();
console.log(`${path.basename(SRC)} → ${DST}  ${m.width}x${m.height}`);
