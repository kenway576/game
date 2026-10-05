// 从**当前**立绘里裁头像（public/images/avatars/<角色>.webp）。
//
// 立绘重画过一轮之后，旧头像还是旧画风（make-avatars.mjs 那一批），
// 跟游戏里站着的人对不上。这一版每个人手调一个框：
//   src   用哪张立绘（睁着眼、表情中性偏开心的那张）
//   frac  头像边长 = 内容高度 × frac（头 + 一点肩膀）
//   dx    横向微调（边长的比例，负数往左）。呆毛、马尾、狐耳都会把自动找的中心拽偏。
//   dy    纵向微调（边长的比例，正数往下）
//
// 用法：node scripts/make-avatars-v2.mjs [--sheet 预览图路径]
import sharp from 'sharp';
import fs from 'fs';

const OUT = 'public/images/avatars';
const SIZE = 320;
export const AVATAR_BOXES = {
  asuka:  { src: 'asuka/smug',          frac: 0.20, dx: 0.00, dy: 0.02 },
  hikari: { src: 'hikari/school_happy', frac: 0.20, dx: -0.10, dy: 0.15 },
  rei:    { src: 'rei/smile',           frac: 0.20, dx: 0.04, dy: 0.10 },
  inari:  { src: 'inari/school_sly',    frac: 0.22, dx: 0.02, dy: 0.20 },
  miyuki: { src: 'miyuki/neutral',      frac: 0.20, dx: -0.02, dy: 0.06 },
  sora:   { src: 'sora/school_happy',   frac: 0.19, dx: 0.00, dy: 0.04 },
  nao:    { src: 'nao/happy',           frac: 0.20, dx: -0.04, dy: 0.03 },
  maki:   { src: 'maki/school_smug',    frac: 0.20, dx: 0.00, dy: 0.03 }
};

const box = async (file, { frac, dx, dy }) => {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const span = y => { let l = -1, r = -1; for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 30) { if (l < 0) l = x; r = x; } return l < 0 ? null : { w: r - l + 1, cx: (l + r) / 2 }; };
  let top = -1, bot = -1;
  for (let y = 0; y < H; y++) if (span(y)) { if (top < 0) top = y; bot = y; }
  const side = Math.round((bot - top + 1) * frac);
  // 横向中心：头那一段下半部分（脸）的中位数，避开呆毛和发饰
  const cxs = [];
  for (let y = top + side * 0.35; y < top + side * 0.8; y++) { const s = span(Math.round(y)); if (s && s.w > side * 0.3) cxs.push(s.cx); }
  cxs.sort((a, b) => a - b);
  const cx = (cxs.length ? cxs[cxs.length >> 1] : W / 2) + dx * side;
  const left = Math.max(0, Math.min(W - side, Math.round(cx - side / 2)));
  const t = Math.max(0, Math.min(H - side, Math.round(top - side * 0.03 + dy * side)));
  return { left, top: t, width: side, height: side };
};

const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')));
const tiles = [];
let i = 0;
for (const [id, cfg] of Object.entries(AVATAR_BOXES)) {
  const file = `public/images/characters/${cfg.src}.webp`;
  const b = await box(file, cfg);
  const img = sharp(file).extract(b).resize(SIZE, SIZE);
  if (args.sheet) tiles.push({ input: await img.clone().png().toBuffer(), left: (i % 8) * (SIZE + 10), top: 0 });
  else await img.webp({ quality: 90 }).toFile(`${OUT}/${id}.webp`);
  console.log(id, JSON.stringify(b));
  i++;
}
if (args.sheet) {
  await sharp({ create: { width: 8 * (SIZE + 10), height: SIZE, channels: 4, background: '#444' } })
    .composite(tiles).png().toFile(args.sheet);
}
