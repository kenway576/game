// ============================================================================
// 立绘总体检
//
// 之前每种毛病一个脚本：白边一个、空洞一个、裁剪一个。结果是修完一种
// 就得记住还有哪几种没查，而且"这张到底过没过"没有一个地方能回答。
// 这个脚本一次把所有已知的毛病量一遍，每张给一行结论。
//
// 查的六件事：
//   halo   边缘那圈半透明像素是不是偏白/偏亮 —— 抠图没抠干净的白边
//   hole   内部封闭的透明块 —— 被抠穿的洞（深色背景下就是黑斑）
//   smear  大面积同色死板块 —— 之前补洞补糊了，或者被涂过
//   crop   人物贴着画布边缘 —— 裁掉了手脚
//   pad    人物只占画布很小一块 —— 四周全是空的，游戏里显得很小
//   off    人物左右不居中 —— 大厅里排一列会看出来歪
//
// 用法：
//   node scripts/audit-sprites.mjs              全部
//   node scripts/audit-sprites.mjs hikari       只看某个人
//   node scripts/audit-sprites.mjs --bad        只列有问题的
// ============================================================================
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = 'public/images/characters';
const args = process.argv.slice(2);
const ONLY_BAD = args.includes('--bad');
const filter = args.find(a => !a.startsWith('--')) || '';

// 门槛。定得比"看得见"稍微松一点，宁可多报几张让人去看，
// 也不要漏掉一张真的坏了的。
const HALO_LUM = 205;      // 边缘像素平均亮度超过这个算白边
const HALO_PCT = 0.12;     // 且这么亮的边缘像素占比超过这个
const HOLE_MIN = 0.0004;   // 内部洞大于全图这个比例才算（小于就是抗锯齿噪点）
const CROP_EDGE = 0.004;   // 贴边像素占该边长度超过这个算裁到了
const PAD_MIN = 0.42;      // 人物高度占画布不到这个比例算留白太多
const OFF_MAX = 0.06;      // 人物中心偏离画布中线超过这个比例算歪

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.webp')) files.push(p);
  }
})(ROOT);

const targets = files.filter(f =>
  path.relative(ROOT, f).replace(/\\/g, '/').includes(filter));

const rows = [];

for (const file of targets) {
  const src = fs.readFileSync(file);
  const { data, info } = await sharp(src).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const A = p => data[p * 4 + 3];

  // ---- 外部透明区（从画布边缘灌进来的才算外面）----
  const outside = new Uint8Array(N);
  const st = [];
  const push = p => { if (!outside[p] && A(p) < 40) { outside[p] = 1; st.push(p); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (st.length) {
    const p = st.pop(), x = p % W, y = (p - x) / W;
    if (x + 1 < W) push(p + 1);
    if (x > 0) push(p - 1);
    if (y + 1 < H) push(p + W);
    if (y > 0) push(p - W);
  }

  // ---- halo：紧贴外部的那一圈半透明像素偏不偏白 ----
  let edgeN = 0, edgeBright = 0;
  for (let p = 0; p < N; p++) {
    if (outside[p] || A(p) >= 250 || A(p) < 20) continue;
    const x = p % W, y = (p - x) / W;
    let touchesOut = false;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (outside[ny * W + nx]) { touchesOut = true; break; }
    }
    if (!touchesOut) continue;
    edgeN++;
    const i = p * 4;
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum > HALO_LUM) edgeBright++;
  }
  const haloPct = edgeN ? edgeBright / edgeN : 0;

  // ---- hole：内部封闭的透明块 ----
  const seen = new Uint8Array(N);
  let holes = 0, holePx = 0, biggestHole = 0;
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || outside[p0] || A(p0) >= 40) continue;
    const s2 = [p0]; seen[p0] = 1; let n = 0;
    while (s2.length) {
      const p = s2.pop(); n++;
      const x = p % W, y = (p - x) / W;
      for (const q of [x + 1 < W ? p + 1 : -1, x > 0 ? p - 1 : -1,
                       y + 1 < H ? p + W : -1, y > 0 ? p - W : -1]) {
        if (q >= 0 && !seen[q] && !outside[q] && A(q) < 40) { seen[q] = 1; s2.push(q); }
      }
    }
    if (n > N * HOLE_MIN) { holes++; holePx += n; biggestHole = Math.max(biggestHole, n); }
  }

  // ---- smear：一块面积不小、颜色几乎不变的死板块 ----
  // 补洞补糊了会留下这种块。抽样比逐像素聚类便宜得多，够用。
  let smear = 0;
  const BS = 12;                       // 12x12 一格
  for (let by = 0; by + BS <= H; by += BS) {
    for (let bx = 0; bx + BS <= W; bx += BS) {
      let n = 0, sr = 0, sg = 0, sb = 0, mn = 999, mx = -1;
      for (let y = by; y < by + BS; y++) for (let x = bx; x < bx + BS; x++) {
        const p = y * W + x;
        if (A(p) < 250) { n = 0; y = by + BS; break; }   // 有半透明就跳过这格
        const i = p * 4;
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        mn = Math.min(mn, lum); mx = Math.max(mx, lum);
        sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; n++;
      }
      // 整格不透明、亮度几乎没有起伏 = 一块死色
      if (n === BS * BS && mx - mn < 3) smear++;
    }
  }
  const blocks = Math.floor(H / BS) * Math.floor(W / BS);
  const smearPct = blocks ? smear / blocks : 0;

  // ---- bbox：裁剪、留白、居中 ----
  let x0 = W, x1 = -1, y0 = H, y1 = -1;
  for (let p = 0; p < N; p++) {
    if (A(p) < 40) continue;
    const x = p % W, y = (p - x) / W;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;

  // 贴边：数每条边上有多少不透明像素
  const edgeCount = (fn, len) => { let c = 0; for (let i = 0; i < len; i++) if (fn(i)) c++; return c / len; };
  const topHit = edgeCount(i => A(i) >= 40, W);
  const botHit = edgeCount(i => A((H - 1) * W + i) >= 40, W);
  const leftHit = edgeCount(i => A(i * W) >= 40, H);
  const rightHit = edgeCount(i => A(i * W + W - 1) >= 40, H);
  // 底边贴住是正常的：立绘就是站在画面底下的，脚该贴边
  const cropped = [
    topHit > CROP_EDGE ? 'top' : '',
    leftHit > CROP_EDGE ? 'left' : '',
    rightHit > CROP_EDGE ? 'right' : ''
  ].filter(Boolean);

  const fillH = bh / H;
  const cx = (x0 + x1) / 2 / W;
  const off = Math.abs(cx - 0.5);

  const bad = [];
  if (haloPct > HALO_PCT) bad.push(`白边 ${(haloPct * 100).toFixed(0)}%`);
  if (holes) bad.push(`洞 ${holes}个/${holePx}px`);
  if (smearPct > 0.02) bad.push(`死色块 ${(smearPct * 100).toFixed(0)}%`);
  if (cropped.length) bad.push(`裁到 ${cropped.join('+')}`);
  if (fillH < PAD_MIN) bad.push(`留白 高只占${(fillH * 100).toFixed(0)}%`);
  if (off > OFF_MAX) bad.push(`偏心 ${((cx - 0.5) * 100).toFixed(0)}%`);

  rows.push({ file: path.relative(ROOT, file).replace(/\\/g, '/'), bad, haloPct, holes, fillH, cx });
}

const badRows = rows.filter(r => r.bad.length);
for (const r of (ONLY_BAD ? badRows : rows)) {
  const tag = r.bad.length ? r.bad.join('  ') : 'ok';
  console.log(`${r.file.padEnd(38)} ${tag}`);
}

// 按毛病分类汇总，好知道该先修哪一类
const tally = {};
for (const r of badRows) for (const b of r.bad) {
  const k = b.split(' ')[0];
  tally[k] = (tally[k] || 0) + 1;
}
console.log(`\n${rows.length} 张，${badRows.length} 张有问题`);
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${v} 张`);
}
