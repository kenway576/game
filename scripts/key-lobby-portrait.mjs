// ============================================================================
// 大厅立绘专用抠像
//
// key-greenscreen.mjs 是"从画布四边灌绿"，对普通站姿够用。但大厅这批立绘
// 有叉腰、抱臂的姿势，胳膊和身体之间会围出一个**封闭的绿色口袋**，
// 洪水从外面进不去，于是真希和空的腰侧各留了一块绿。
//
// 而且每张图的左上角都留了一小块没抠掉的背景。它本身不显眼，
// 但它把 alpha 的外接框一路撑到 x=0——按外接框裁切之后，
// 人就被推到画面右边去了。铃看起来"没居中"就是这么来的，
// 不是姿势的问题。
//
// 所以这里换一套判据：
//   1. 从四角采样背景色（生成出来的绿是一整片均匀色，不是纯 #00B140）
//   2. 按**与背景色的距离**删，不管连不连通——封闭口袋一并解决。
//      角色身上的绿（铃的格裙）颜色和背景差得远，不会被误伤。
//   3. 去溢色：边缘半透明像素被绿幕染绿，把 G 压回 max(R,B)
//   4. 删掉贴着画布边缘的小碎块（就是左上角那种），再按干净的外接框裁切
//
// 用法：
//   node scripts/key-lobby-portrait.mjs <输入目录> -d <输出目录> [--height 1200] [--tol 46]
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const SRC = args.find(a => !a.startsWith('-') && args[args.indexOf(a) - 1] !== '-d'
  && args[args.indexOf(a) - 1] !== '--height' && args[args.indexOf(a) - 1] !== '--tol');
const DST = flag('-d', null);
const HEIGHT = Number(flag('--height', 1200));
const TOL = Number(flag('--tol', 46));      // 与背景色的距离，小于它算背景
const SOFT = Number(flag('--soft', 26));    // 再往外这一段做羽化

if (!SRC || !DST) {
  console.error('用法: node scripts/key-lobby-portrait.mjs <输入目录> -d <输出目录> [--height 1200] [--tol 46]');
  process.exit(1);
}
fs.mkdirSync(DST, { recursive: true });

const files = fs.statSync(SRC).isDirectory()
  ? fs.readdirSync(SRC).filter(f => /\.(png|webp|jpg)$/i.test(f)).map(f => path.join(SRC, f))
  : [SRC];

for (const file of files) {
  const name = path.basename(file).replace(/\.[^.]+$/, '');
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;

  // ---- 1. 采样背景色：四角各取一小块，取中位数 ----
  const samples = [];
  const corner = (cx, cy) => {
    for (let y = cy; y < cy + 12; y++) for (let x = cx; x < cx + 12; x++) {
      const i = (y * W + x) * 4;
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
  };
  corner(2, 2); corner(W - 15, 2); corner(2, H - 15); corner(W - 15, H - 15);
  const med = k => {
    const v = samples.map(s => s[k]).sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)];
  };
  const BG = [med(0), med(1), med(2)];

  // ---- 2. 按颜色距离删背景（连通与否都算）----
  const dist = p => {
    const i = p * 4;
    const dr = data[i] - BG[0], dg = data[i + 1] - BG[1], db = data[i + 2] - BG[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };
  const alpha = new Float32Array(N);
  for (let p = 0; p < N; p++) {
    const d = dist(p);
    alpha[p] = d <= TOL ? 0 : d >= TOL + SOFT ? 1 : (d - TOL) / SOFT;
  }

  // ---- 3. 去溢色 + 写回 ----
  const out = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    const a = alpha[p];
    if (a <= 0.004) continue;
    let r = data[i], g = data[i + 1], b = data[i + 2];
    const cap = Math.max(r, b);
    if (g > cap) g = cap;                 // 绿溢色压回去
    out[i] = r; out[i + 1] = g; out[i + 2] = b;
    out[i + 3] = Math.round(a * data[i + 3]);
  }

  // ---- 3.5 脚下那摊影子 ----
  // 模型不听"不要投影"，在地上画了一圈椭圆。它是背景绿被压暗的结果——
  // 色相还是背景那个色相，只是更暗，所以按绝对 RGB 距离判不出来。
  // 改看**色度**（归一化之后的颜色），暗一档的背景色照样能对上。
  // 只在图像下方那一小条里做，鞋子和裙子不会被波及。
  const chroma = (r, g, b) => { const t = r + g + b || 1; return [r / t, g / t, b / t]; };
  const BGC = chroma(BG[0], BG[1], BG[2]);
  const bandTop = Math.floor(H * 0.80);
  for (let y = bandTop; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x, i = p * 4;
      if (out[i + 3] === 0) continue;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const bgLum = 0.299 * BG[0] + 0.587 * BG[1] + 0.114 * BG[2];
      if (lum > bgLum) continue;                 // 比背景亮的不是影子
      const c = chroma(data[i], data[i + 1], data[i + 2]);
      const cd = Math.hypot(c[0] - BGC[0], c[1] - BGC[1], c[2] - BGC[2]);
      if (cd < 0.075) out[i + 3] = 0;
    }
  }

  // ---- 4. 删掉贴边的小碎块 ----
  const op = p => out[p * 4 + 3] > 40;
  const seen = new Uint8Array(N);
  const blobs = [];
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || !op(p0)) continue;
    const st = [p0]; seen[p0] = 1; const cells = [];
    let touchesEdge = false;
    while (st.length) {
      const p = st.pop(); cells.push(p);
      const x = p % W, y = (p - x) / W;
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touchesEdge = true;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (!seen[q] && op(q)) { seen[q] = 1; st.push(q); }
      }
    }
    blobs.push({ cells, touchesEdge });
  }
  blobs.sort((a, b) => b.cells.length - a.cells.length);
  const mainSize = blobs[0] ? blobs[0].cells.length : 0;
  let dropped = 0;
  for (let i = 1; i < blobs.length; i++) {
    // 贴着画布边、又比主体小得多的 —— 就是没抠干净的角落，删掉。
    // 不贴边的小块留着：稻荷脚下的狐火本来就是飘着的，不能一起删。
    if (blobs[i].touchesEdge && blobs[i].cells.length < mainSize * 0.02) {
      for (const p of blobs[i].cells) out[p * 4 + 3] = 0;
      dropped++;
    }
  }

  // ---- 5. 按干净的外接框裁切 ----
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let p = 0; p < N; p++) {
    if (out[p * 4 + 3] < 12) continue;
    const x = p % W, y = (p - x) / W;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const pad = 6;
  const left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
  const w = Math.min(W - left, x1 - x0 + 1 + pad * 2);
  const h = Math.min(H - top, y1 - y0 + 1 + pad * 2);

  const buf = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left, top, width: w, height: h })
    .resize({ height: HEIGHT })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
  fs.writeFileSync(path.join(DST, `${name}.webp`), buf);

  const meta = await sharp(buf).metadata();
  console.log(`${name.padEnd(8)} 背景色 rgb(${BG})  裁 ${w}x${h} → ${meta.width}x${meta.height}  删碎块 ${dropped}`);
}
console.log('\n完成');
