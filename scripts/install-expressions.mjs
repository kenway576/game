// ---------------------------------------------------------
// 📦 立绘重制：把做好的一套表情装进游戏
//
// 所有表情按**底图**的轮廓统一裁切、统一缩放——同一套身体的每张图坐标完全一致，
// 木偶骨骼（data/puppetRigs.ts）写一份就能给整套用。
// 覆盖前把 public 里的旧图备份到 .generated/remake/<角色>/old_backup/。
//
// 用法：
//   node scripts/install-expressions.mjs --char asuka --dir .generated/remake/asuka \
//     --base base_v3_cut.png --map "neutral=school_neutral,happy=school_happy,smug=base_v3_cut"
//   --height 2000   输出高度（默认 2000，够 2 倍屏用）
//
// 输出最后会打印裁切框，用来把底图上量的坐标换算成骨骼坐标。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const CHAR = arg('char'), DIR = arg('dir'), BASE = arg('base'), MAP = arg('map');
const HEIGHT = Number(arg('height', 2000));
if (!CHAR || !DIR || !BASE || !MAP) { console.error('用法：--char <id> --dir <目录> --base <抠好的底图> --map "游戏文件名=源文件名,..."'); process.exit(1); }

const dest = path.join('public/images/characters', CHAR);
const backup = path.join(DIR, 'old_backup');
fs.mkdirSync(backup, { recursive: true });

// 底图的不透明范围 + 一圈留白
const { data, info } = await sharp(path.join(DIR, BASE)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (data[(y * W + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
}
const pad = Math.round(H * 0.01);
const box = { left: Math.max(0, x0 - pad), top: Math.max(0, y0 - pad) };
box.width = Math.min(W, x1 + pad) - box.left;
box.height = Math.min(H, y1 + pad) - box.top;

for (const pair of MAP.split(',')) {
  const [name, src] = pair.split('=').map(s => s.trim());
  const out = path.join(dest, `${name}.webp`);
  if (fs.existsSync(out) && !fs.existsSync(path.join(backup, `${name}.webp`))) fs.copyFileSync(out, path.join(backup, `${name}.webp`));
  const file = path.join(DIR, src.endsWith('.png') ? src : `${src}.png`);
  await sharp(file).extract(box).resize({ height: HEIGHT }).webp({ quality: 90, alphaQuality: 100 }).toFile(out);
  const m = await sharp(out).metadata();
  console.log(`${out}  ${m.width}x${m.height}  ← ${path.basename(file)}`);
}
console.log(`裁切框（底图 ${W}x${H} 上的像素）：left ${box.left} top ${box.top} width ${box.width} height ${box.height}`);
console.log(`换算：x' = (x*${W} - ${box.left}) / ${box.width}，y' = (y*${H} - ${box.top}) / ${box.height}`);
console.log(`旧图备份在 ${backup}`);
