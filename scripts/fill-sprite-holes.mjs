// ============================================================================
// 补立绘上被抠穿的小洞
//
// 奈绪的头发里有一片一片的透明块，游戏里深色背景透上来就是"黑斑"。
// 这些洞比我设的口袋下限（1500px）小，所以不是清白边那一轮造成的，
// 是更早的处理留下的——原始颜色已经没了，只能按周围的颜色补回去。
//
// 【为什么只补小洞】
// 大的封闭透明区是**故意**抠掉的背景（双马尾和头之间那种），补回去等于
// 把白边又请回来。所以门槛和 clean-sprite-matte 用同一个：
// 小于全图 0.2% 的内部洞算破损，补；大于的算背景，不动。
//
// 补法是从洞的边界往里一圈圈推，每个像素取已知邻居的平均色，补完再糊几遍。
//
// 【只从完全不透明的像素取色】
// 洞的边上有一圈半透明的抗锯齿像素，它们的颜色里掺着当初被抠掉的
// 那个背景（奈绪这批原图的背景是粉紫的）。第一版拿它们当色源，
// 补出来的是一片紫色斜条纹，比原来的洞还难看。所以半透明的一圈
// 不但不能当色源，还得跟着洞一起重补。
//
// 用法：
//   node scripts/fill-sprite-holes.mjs            # 全部
//   node scripts/fill-sprite-holes.mjs nao        # 只处理路径含 nao 的
//   node scripts/fill-sprite-holes.mjs nao --dry  # 只报告，不写
//   ... --not=maid_,swim_                         # 跳过这些
//
// 【--not 不是可选项，是必须先想清楚的一步】
// 有些立绘本身画了道具：奈绪的女仆装那套连咖啡厅的椅子一起画进去了，
// 泳装那套地上摆着藤篮和海星。椅子背横档之间、篮子提手底下那些洞
// 是画面本来就该透的，补上去就是一坨糊掉的棕色。这类整套跳过。
// ============================================================================
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = 'public/images/characters';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const filter = args.find(a => !a.startsWith('--')) || '';
const skip = (args.find(a => a.startsWith('--not=')) || '').slice(6).split(',').filter(Boolean);
const MAX_PCT = 0.002;   // 大于这个比例的内部透明区当作"故意抠掉的背景"，不动

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.webp')) files.push(p);
  }
})(ROOT);

const targets = files.filter(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  return rel.includes(filter) && !skip.some(k => rel.includes(k));
});
let touched = 0, totalHoles = 0, totalPx = 0;

for (const file of targets) {
  // 先整个读进内存再交给 sharp：直接 sharp(路径) 会占着文件，写回时 Windows 报 UNKNOWN
  const src = fs.readFileSync(file);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const tr = p => data[p * 4 + 3] < 40;

  // 画布边缘灌进来的透明 = 真正的外部
  const outside = new Uint8Array(N);
  const st = [];
  const push = p => { if (!outside[p] && tr(p)) { outside[p] = 1; st.push(p); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (st.length) {
    const p = st.pop(), x = p % W, y = (p - x) / W;
    if (x + 1 < W) push(p + 1);
    if (x > 0) push(p - 1);
    if (y + 1 < H) push(p + W);
    if (y > 0) push(p - W);
  }

  // 内部洞
  const seen = new Uint8Array(N);
  const toFill = [];
  let holes = 0;
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || outside[p0] || !tr(p0)) continue;
    const s2 = [p0]; seen[p0] = 1; const cells = [];
    while (s2.length) {
      const p = s2.pop(); cells.push(p);
      const x = p % W, y = (p - x) / W;
      for (const q of [x + 1 < W ? p + 1 : -1, x > 0 ? p - 1 : -1,
                       y + 1 < H ? p + W : -1, y > 0 ? p - W : -1]) {
        if (q >= 0 && !seen[q] && !outside[q] && tr(q)) { seen[q] = 1; s2.push(q); }
      }
    }
    if (cells.length <= N * MAX_PCT) { toFill.push(...cells); holes++; }
  }

  if (!holes) continue;
  totalHoles += holes; totalPx += toFill.length;
  touched++;
  if (DRY) {
    console.log(`${path.relative(ROOT, file).replace(/\\/g, '/').padEnd(32)} ${holes} 个洞 ${toFill.length}px`);
    continue;
  }

  // 把洞周围那圈半透明像素也划进要补的范围（它们的颜色是脏的）
  const bad = new Uint8Array(N);
  for (const p of toFill) bad[p] = 1;
  for (let r = 0; r < 2; r++) {
    const add = [];
    for (let p = 0; p < N; p++) {
      if (!bad[p]) continue;
      const x = p % W, y = (p - x) / W;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (!bad[q] && !outside[q] && data[q * 4 + 3] < 250) add.push(q);
      }
    }
    for (const q of add) bad[q] = 1;
  }

  // 从洞的边界一圈圈往里补：每个像素取已知邻居的平均色
  const known = new Uint8Array(N);
  for (let p = 0; p < N; p++) known[p] = (!bad[p] && data[p * 4 + 3] >= 250) ? 1 : 0;
  const pending = new Set();
  for (let p = 0; p < N; p++) if (bad[p]) pending.add(p);
  const filled = [...pending];
  let guard = 0;
  while (pending.size && guard++ < 400) {
    const ring = [];
    for (const p of pending) {
      const x = p % W, y = (p - x) / W;
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (!known[q]) continue;
        const i = q * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; a += data[i + 3]; n++;
      }
      if (n) ring.push([p, Math.round(r / n), Math.round(g / n), Math.round(b / n), Math.round(a / n)]);
    }
    if (!ring.length) break;
    for (const [p, r, g, b] of ring) {
      const i = p * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
      known[p] = 1; pending.delete(p);
    }
  }

  // 一圈圈推出来的颜色会留下斜条纹（推进方向看得出来），
  // 在补过的范围内糊几遍把它抹平。邻居可以取洞外的真实像素，
  // 所以糊完的色调是跟着周围走的。
  for (let pass = 0; pass < 8; pass++) {
    const out = [];
    for (const p of filled) {
      const x = p % W, y = (p - x) / W;
      let r = 0, g = 0, b = 0, n = 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (!known[q]) continue;
        const i = q * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
      if (n) out.push([p, Math.round(r / n), Math.round(g / n), Math.round(b / n)]);
    }
    for (const [p, r, g, b] of out) {
      const i = p * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b;
    }
  }

  const buf = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 }).toBuffer();
  fs.writeFileSync(file, buf);
  console.log(`${path.relative(ROOT, file).replace(/\\/g, '/').padEnd(32)} 补了 ${holes} 个洞 ${toFill.length}px`);
}

console.log(`\n${targets.length} 张里 ${touched} 张有破损，共补 ${totalHoles} 个洞 / ${totalPx}px${DRY ? '（未写入）' : ''}`);
