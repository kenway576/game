// ---------------------------------------------------------
// ✂️ 立绘重制：去掉纯色背景（浅灰底图专用）
//
// 新底图都是在均匀的浅灰底上生成的（见 lib/spriteStyle.mjs 的 BACKGROUND），
// 人物外面一圈是深色线条，所以不需要 AI 抠图：
//   1. 取四条边的像素中位数当背景色
//   2. 从边缘泛洪：和背景连通、颜色接近的像素才算背景（白衬衫这种封闭区域不会被误删）
//   3. 被身体围住的背景空洞（叉腰时手臂和腰之间）：颜色非常接近背景、面积够大的连通块也删掉
//   4. 边缘按色差做半透明过渡，并把混进来的灰色反推掉（去溢色），放到任何场景上都不会有灰边
//
// 用法：node scripts/cutout-flat-bg.mjs --in base.png --out base_cut.png [--lo 14 --hi 34]
// 同时输出 *_check.jpg：放在深色和亮色底上的检查图。
// ---------------------------------------------------------
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const IN = arg('in'), OUT = arg('out');
const LO = Number(arg('lo', 14));       // 色差小于它：完全透明
const HI = Number(arg('hi', 34));       // 色差大于它：完全不透明；中间做过渡
const HOLE = Number(arg('hole', 9));    // 封闭空洞要更严格，免得把灰白衣服挖掉
const HOLE_MIN = Number(arg('holeMin', 80));   // 空洞最小面积（像素）。发丝之间的小缝也要清掉；衣服高光离背景色远，靠 HOLE 卡住
if (!IN || !OUT) { console.error('用法：--in <图> --out <输出.png>'); process.exit(1); }

const { data, info } = await sharp(IN).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;

// 1. 背景色 = 边缘像素中位数
const border = [];
for (let x = 0; x < W; x += 4) border.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y += 4) border.push(y * W, y * W + W - 1);
const med = c => { const v = border.map(p => data[p * 3 + c]).sort((a, b) => a - b); return v[v.length >> 1]; };
const bg = [med(0), med(1), med(2)];

const dist = new Float32Array(N);
for (let p = 0; p < N; p++) {
  const dr = data[p * 3] - bg[0], dg = data[p * 3 + 1] - bg[1], db = data[p * 3 + 2] - bg[2];
  dist[p] = Math.sqrt(dr * dr + dg * dg + db * db);
}

// 2. 从边缘泛洪
const isBg = new Uint8Array(N);
const stack = new Int32Array(N);
let sp = 0;
const seed = p => { if (!isBg[p] && dist[p] < HI) { isBg[p] = 1; stack[sp++] = p; } };
for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
while (sp) {
  const p = stack[--sp], x = p % W;
  if (x > 0) seed(p - 1);
  if (x < W - 1) seed(p + 1);
  if (p >= W) seed(p - W);
  if (p < N - W) seed(p + W);
}

// 3. 封闭空洞
const seen = new Uint8Array(N);
let holes = 0;
// 生成图的背景带一点噪点（色差 9~12 的像素夹在里面），只按"色差 < HOLE"连通的话，
// 发丝间的小缝会被切成碎块、每块都不够大而漏掉。所以按"色差 < HI"连成一块，
// 再看这一块里大多数像素是不是真的贴近背景色——是就整块当背景。
// 衣服的亮部和背景色差得远，就算连进来，整块的"背景占比"也上不去，不会被误删。
for (let s = 0; s < N; s++) {
  if (isBg[s] || seen[s] || dist[s] >= HOLE) continue;
  const comp = [];
  let close = 0;
  sp = 0; stack[sp++] = s; seen[s] = 1;
  while (sp) {
    const p = stack[--sp], x = p % W;
    comp.push(p);
    if (dist[p] < HOLE + 4) close++;
    for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p >= W ? p - W : -1, p < N - W ? p + W : -1]) {
      if (q >= 0 && !seen[q] && !isBg[q] && dist[q] < HI) { seen[q] = 1; stack[sp++] = q; }
    }
  }
  if (comp.length >= HOLE_MIN && close / comp.length > 0.6) {
    holes++;
    for (const p of comp) isBg[p] = 1;   // 过渡像素在第 4 步按色差做半透明
  }
}

// 4. 透明度 + 去溢色
const out = Buffer.alloc(N * 4);
for (let p = 0; p < N; p++) {
  let a = 1;
  if (isBg[p]) { const t = Math.min(1, Math.max(0, (dist[p] - LO) / (HI - LO))); a = t * t * (3 - 2 * t); }
  for (let c = 0; c < 3; c++) {
    const v = data[p * 3 + c];
    out[p * 4 + c] = a > 0.02 && a < 1 ? Math.max(0, Math.min(255, Math.round((v - (1 - a) * bg[c]) / a))) : v;
  }
  out[p * 4 + 3] = Math.round(a * 255);
}

// 5. 清碎点：背景噪点偶尔有一两个像素色差超过阈值，留下孤零零的小点。
// 它们会把装图时算的裁切框撑到整张图那么宽。只保留面积够大的不透明连通块。
let specks = 0;
{
  const vis = new Uint8Array(N);
  for (let s = 0; s < N; s++) {
    if (vis[s] || out[s * 4 + 3] <= 8) continue;
    const comp = [];
    sp = 0; stack[sp++] = s; vis[s] = 1;
    while (sp) {
      const p = stack[--sp], x = p % W;
      comp.push(p);
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p >= W ? p - W : -1, p < N - W ? p + W : -1]) {
        if (q >= 0 && !vis[q] && out[q * 4 + 3] > 8) { vis[q] = 1; stack[sp++] = q; }
      }
    }
    if (comp.length < 400) { specks++; for (const p of comp) out[p * 4 + 3] = 0; }
  }
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);

// 检查图：左边深色底、右边亮色底，缩小拼一起
const small = await sharp(OUT).resize({ height: 1400 }).png().toBuffer();
const sm = await sharp(small).metadata();
const onBg = color => sharp({ create: { width: sm.width, height: sm.height, channels: 3, background: color } })
  .composite([{ input: small }]).png().toBuffer();
const [dark, light] = await Promise.all([onBg('#1d2333'), onBg('#ffd7e8')]);
await sharp({ create: { width: sm.width * 2, height: sm.height, channels: 3, background: '#000' } })
  .composite([{ input: dark, left: 0, top: 0 }, { input: light, left: sm.width, top: 0 }])
  .jpeg({ quality: 88 }).toFile(OUT.replace(/\.png$/, '_check.jpg'));

console.log(`${OUT}  背景色 rgb(${bg.join(',')})  封闭空洞 ${holes} 个  清掉碎点 ${specks} 个`);
