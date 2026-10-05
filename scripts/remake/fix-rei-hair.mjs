// ---------------------------------------------------------
// 💇 修玲第一轮校服立绘后脑勺的"斑"
//
//   node scripts/remake/fix-rei-hair.mjs
//
// 冰蓝的浅色头发跟浅灰底太像，抠图时后脑勺那片被挖成了半透明，放到深色场景上一块块发黑。
// 做法：
//   1. neutral 铺到深藏青底上（跟浅色头发反差大），裁出头部
//   2. 让模型只把那片斑驳的头发补成正常的头发，别的不动，底色保持纯深藏青
//   3. 用深藏青底重新抠（反差大，这次抠得干净）
//   4. 九张校服立绘共用一套头发：脸部椭圆以外、头部这一块，换成修好的像素
// 原图备份在 .generated/remake2/_rei_orig_*.webp（第一次跑时存的）
// ---------------------------------------------------------
import fs from 'fs';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
import { align } from './blink-lib.mjs';
sharp.cache(false);

const NAMES = ['neutral', 'lecturing', 'school_lecturing', 'smile', 'shy', 'thinking', 'surprised', 'sad', 'angry'];
const DIR = '.generated/remake2-redo/rei_hair';
fs.mkdirSync(DIR, { recursive: true });
const bak = n => `.generated/remake2/_rei_orig_${n}.webp`;
for (const n of NAMES) if (!fs.existsSync(bak(n))) fs.copyFileSync(`public/images/characters/rei/${n}.webp`, bak(n));

const NAVY = { r: 38, g: 43, b: 64 };
const { data: base, info } = await sharp(bak('neutral')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
// 头部方块：上 33%，整个宽度（玲的立绘比较窄）
const S = Math.min(W, Math.round(H * 0.33));
const region = { left: Math.max(0, Math.round(W * 0.5 - S / 2)), top: 0, width: S, height: S };
const crop = `${DIR}/crop.png`;
await sharp(bak('neutral')).flatten({ background: NAVY }).extract(region).png().toFile(crop);
await sharp(crop).resize(1024, 1024, { kernel: 'lanczos3' }).png().toFile(`${DIR}/crop_big.png`);

const raw = `${DIR}/raw.png`;
if (!fs.existsSync(raw)) {
  const r = await generate({ parts: [imagePart(`${DIR}/crop_big.png`), { text: `This is a crop of a finished anime character illustration on a flat dark navy background. The back of her pale icy-blue hair (the part behind her head on the right side, and a few places along the outer edge of the hair) has ugly dark patchy blotches where the dark background shows through, like holes.

Return the SAME image with ONE change: repaint those blotchy, see-through areas as normal, solid, clean pale icy-blue hair that matches the rest of her hair (same colour, same shading style, flowing strands). The hair silhouette stays the same shape.

Everything else must stay exactly the same: the face, glasses, eyes, ahoge, the clothes, the framing, and the flat dark navy background (keep it perfectly flat and dark). No sparkles, no effects.` }], aspectRatio: '1:1', imageSize: '2K' });
  fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tredo/rei_hair\tfix\tgemini-3-pro-image\t2K\n`);
  if (!r.images.length) throw new Error('没拿到图：' + r.finishReason);
  await sharp(r.images[0]).png().toFile(raw);
}
const ref = await sharp(crop).removeAlpha().raw().toBuffer();
const edit = await sharp(raw).resize(S, S, { fit: 'fill', kernel: 'lanczos3' }).removeAlpha().raw().toBuffer();
// 对齐：比较衣服和脸（不变的地方）——头部方块下半部分
const a = align(ref, edit, S, (x, y) => y > S * 0.55);
console.log(`对齐 (${a.dx},${a.dy}) 差异 ${a.s0.toFixed(1)}→${a.s.toFixed(1)}`);

// 深藏青底重新抠：跟底色的色差决定透明度
const alphaAt = (r, g, b) => {
  const d = Math.sqrt((r - NAVY.r) ** 2 + (g - NAVY.g) ** 2 + (b - NAVY.b) ** 2);
  const t = Math.min(1, Math.max(0, (d - 18) / (60 - 18)));
  return t * t * (3 - 2 * t);
};
// 脸部椭圆（各表情不同的地方，不碰）：按 neutral 的眼睛大致位置估，宁大勿小
const faceEll = { cx: W * 0.33 - region.left, cy: H * 0.145 - region.top, rx: W * 0.12, ry: H * 0.055 };
const inFace = (x, y) => ((x - faceEll.cx) / faceEll.rx) ** 2 + ((y - faceEll.cy) / faceEll.ry) ** 2 < 1;

for (const n of NAMES) {
  const { data } = await sharp(bak(n)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  let k = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (inFace(x, y) || y > S * 0.8) continue;
    const gx = x + region.left, gy = y + region.top;
    if (gx >= W || gy >= H) continue;
    const p = (gy * W + gx) * 4;
    if (data[p + 3] >= 250) continue;            // 原来就是实心的，不动
    const ex = x + a.dx, ey = y + a.dy;
    if (ex < 0 || ey < 0 || ex >= S || ey >= S) continue;
    const q = (ey * S + ex) * 3;
    const al = alphaAt(edit[q], edit[q + 1], edit[q + 2]);
    if (al <= data[p + 3] / 255) continue;       // 只补，不挖
    // 去掉混进来的藏青色
    for (let c = 0; c < 3; c++) {
      const bg = [NAVY.r, NAVY.g, NAVY.b][c];
      out[p + c] = Math.max(0, Math.min(255, Math.round((edit[q + c] - (1 - al) * bg) / Math.max(al, 0.05))));
    }
    out[p + 3] = Math.round(al * 255);
    k++;
  }
  fs.writeFileSync(`public/images/characters/rei/${n}.webp`, await sharp(out, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toBuffer());
  console.log(`${n}：补了 ${k} 像素`);
}
// 检查图：深底上 修前 | 修后
const tiles = await Promise.all([bak('neutral'), 'public/images/characters/rei/neutral.webp'].map(f => sharp(f).extract(region).flatten({ background: '#223' }).resize(500, 500).png().toBuffer()));
await sharp({ create: { width: 1006, height: 500, channels: 3, background: '#fff' } }).composite([{ input: tiles[0], left: 0, top: 0 }, { input: tiles[1], left: 506, top: 0 }]).jpeg().toFile(`${DIR}/check.jpg`);
console.log(`检查图：${DIR}/check.jpg`);
