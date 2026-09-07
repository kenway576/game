// 🩹 只把编辑图上的**一小块**贴回原图。
//
// 整张换 RGB 会出事：编辑接口把背景涂成白的，而人物边缘那一圈半透明像素
// 会连白一起带过来，于是头发外面镶一道白边。
// 可我们要的其实只有领口那几十行像素。所以按矩形取，边缘做羽化，
// 轮廓和 alpha 一律用原图的，一个像素都不动。
//
// 用法: node scripts/graft-region.mjs <原webp> <编辑png> <输出webp> x0 y0 x1 y1 [更多矩形...]
//   坐标是 0~1 的比例
import sharp from 'sharp';

const [, , ORIG, EDIT, OUT, ...rest] = process.argv;
if (!ORIG || !EDIT || !OUT || rest.length < 4) {
  console.error('用法: <原图> <编辑图> <输出> x0 y0 x1 y1 [x0 y0 x1 y1 ...]'); process.exit(1);
}
const boxes = [];
for (let i = 0; i + 3 < rest.length; i += 4) boxes.push(rest.slice(i, i + 4).map(Number));

const o = await sharp(ORIG).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = o.info.width, H = o.info.height;
const e = await sharp(EDIT).resize(W, H, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const out = Buffer.from(o.data);
const FEATHER = 12;   // 边界羽化，免得贴出一条缝
let n = 0;
for (const [bx0, by0, bx1, by1] of boxes) {
  const x0 = Math.round(W * bx0), x1 = Math.round(W * bx1);
  const y0 = Math.round(H * by0), y1 = Math.round(H * by1);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * W + x) * 4;
    if (o.data[i + 3] < 8) continue;           // 原来就是透明的地方不管
    const d = Math.min(x - x0, x1 - x, y - y0, y1 - y);
    const w = Math.max(0, Math.min(1, d / FEATHER));
    if (w <= 0) continue;
    for (let k = 0; k < 3; k++) out[i + k] = Math.round(o.data[i + k] * (1 - w) + e.data[i + k] * w);
    n++;
  }
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 92 }).toFile(OUT);
console.log(OUT.split(/[\/]/).pop(), '贴了', n, '个像素');
