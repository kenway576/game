// 🩹 拿编辑过的 RGB，配上原图的 alpha。
//
// 图片编辑接口返回的图**没有透明通道**——它会自己给背景涂上黑色，
// 或者干脆把透明用的马赛克格子当成图案画出来。
// 但编辑的前提是"别的都不许动"，所以人物的轮廓和原图是重合的，
// 那就直接把原图的 alpha 扣回去：颜色用新的，形状用旧的。
//
// 用法: node scripts/recombine-alpha.mjs <原webp> <新png> <输出png>
import sharp from 'sharp';

const [, , ORIG, EDIT, OUT] = process.argv;
if (!ORIG || !EDIT || !OUT) { console.error('用法: <原图> <编辑图> <输出>'); process.exit(1); }

const o = await sharp(ORIG).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = o.info.width, H = o.info.height;
// 编辑图缩放到原图尺寸，长宽比可能略有出入，用 fill 顶满
const e = await sharp(EDIT).resize(W, H, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const a = o.data[i * 4 + 3];
  out[i * 4]     = e.data[i * 4];
  out[i * 4 + 1] = e.data[i * 4 + 1];
  out[i * 4 + 2] = e.data[i * 4 + 2];
  out[i * 4 + 3] = a;
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);
console.log('→', OUT, W + 'x' + H);
