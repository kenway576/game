// ============================================================================
// 🧹 大厅立绘：把边缘收干净
//
// AI 出图 + 抠图之后常见的三种毛病，这里一次处理：
//
//   1. 身体内部被"抠薄了"——白衬衫、浅色头发、深色领结跟背景色相近，
//      抠图时 alpha 被压低，在深色大厅里就透出背景，整个人发灰发糊。
//      → 离外轮廓 3px 以上的像素一律补成不透明。
//   2. 零碎的小洞（几十个像素那种）。大的缝（胳膊和身体之间）是真的背景，保留。
//      → 小洞按周围颜色补上。
//   3. 发梢一圈软边：半透明、而且颜色里混着原来的背景色。
//      → 颜色从里面往外推（去污染），alpha 收紧一点，边就利落了。
//   另外顺手删掉跟人不连着的孤立杂点。
//
// 用法：
//   node scripts/clean-lobby-edges.mjs rei miyuki hikari          # 处理 public/images/ui/lobby/ 下这几张
//   node scripts/clean-lobby-edges.mjs rei --dry                   # 只出对比图到 .generated/edges/
// 原图会先备份到 .backup-originals/lobby/
// ============================================================================
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Windows 上 sharp 会缓存打开过的文件句柄，原地覆盖时会报 UNKNOWN open 错误
sharp.cache(false);

const DIR = 'public/images/ui/lobby';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const names = args.filter(a => !a.startsWith('--'));
const HOLE_MAX = 25;      // 小于这个像素数的封闭透明区算破洞（针孔）。再大就可能是手指和镜框之间那种真缝，留着
const EDGE = 3;           // 外轮廓往里这么多像素算"边"
const SPECK_MAX = 60;     // 跟主体不连着、小于这个的不透明块算杂点

const N4 = (p, W, H) => {
  const x = p % W, y = (p / W) | 0, r = [];
  if (x > 0) r.push(p - 1); if (x < W - 1) r.push(p + 1);
  if (y > 0) r.push(p - W); if (y < H - 1) r.push(p + W);
  return r;
};

const clean = async (name) => {
  const file = path.join(DIR, `${name}.webp`);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const A = i => data[i * 4 + 3];

  // ---- 外面：从四边灌进来的透明区 ----
  const out = new Uint8Array(N); const q = [];
  const seed = p => { if (!out[p] && A(p) < 16) { out[p] = 1; q.push(p); } };
  for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
  while (q.length) for (const n of N4(q.pop(), W, H)) seed(n);

  // ---- 封闭透明区：分大小 ----
  const lab = new Int32Array(N); const sizes = [0];
  for (let p = 0; p < N; p++) {
    if (out[p] || lab[p] || A(p) >= 16) continue;
    const id = sizes.length; let n = 0; const st = [p]; lab[p] = id;
    while (st.length) { const c = st.pop(); n++; for (const nb of N4(c, W, H)) if (!out[nb] && !lab[nb] && A(nb) < 16) { lab[nb] = id; st.push(nb); } }
    sizes.push(n);
  }
  const bigHole = p => lab[p] && sizes[lab[p]] > HOLE_MAX;
  const smallHole = p => lab[p] && sizes[lab[p]] <= HOLE_MAX;

  // ---- 到"真背景"（外面 + 大洞）的距离 ----
  const dist = new Uint16Array(N).fill(999); const bq = [];
  for (let p = 0; p < N; p++) if (out[p] || bigHole(p)) { dist[p] = 0; bq.push(p); }
  for (let i = 0; i < bq.length; i++) {
    const p = bq[i]; if (dist[p] >= 20) continue;
    for (const nb of N4(p, W, H)) if (dist[nb] > dist[p] + 1) { dist[nb] = dist[p] + 1; bq.push(nb); }
  }

  let filledInterior = 0, filledHoles = 0, edgeFixed = 0, specks = 0;
  const res = Buffer.from(data);

  // 1) 内部补实（颜色不动：webp 里存的是未预乘的颜色，抠薄的地方原色还在）
  for (let p = 0; p < N; p++) {
    if (dist[p] > EDGE && !smallHole(p) && res[p * 4 + 3] < 255) { res[p * 4 + 3] = 255; filledInterior++; }
  }

  // 1.5) 绿幕残渣：亮绿、原本就偏透明 → 那是背景，删掉；
  //      边缘附近的亮绿溢色 → 把 G 压回 max(R,B)。
  //      领结、格裙是暗绿（G 到不了 120），不会被当成绿幕。
  let chroma = 0;
  for (let p = 0; p < N; p++) {
    const r = res[p * 4], g = res[p * 4 + 1], b = res[p * 4 + 2];
    if (!(g > 120 && g - r > 45 && g - b > 35)) continue;
    if (data[p * 4 + 3] < 160) { res[p * 4 + 3] = 0; chroma++; }
    else if (dist[p] <= EDGE + 2) { res[p * 4 + 1] = Math.max(r, b); chroma++; }
  }

  // 2) 小洞：从洞边往里一圈圈用已知颜色补
  let pending = [];
  for (let p = 0; p < N; p++) if (smallHole(p)) pending.push(p);
  filledHoles = pending.length;
  const known = new Uint8Array(N); for (let p = 0; p < N; p++) if (!smallHole(p) && res[p * 4 + 3] >= 200) known[p] = 1;
  for (let round = 0; round < 40 && pending.length; round++) {
    const next = []; const done = [];
    for (const p of pending) {
      let r = 0, g = 0, b = 0, n = 0;
      for (const nb of N4(p, W, H)) if (known[nb]) { r += res[nb * 4]; g += res[nb * 4 + 1]; b += res[nb * 4 + 2]; n++; }
      if (n) { res[p * 4] = r / n; res[p * 4 + 1] = g / n; res[p * 4 + 2] = b / n; res[p * 4 + 3] = 255; done.push(p); } else next.push(p);
    }
    for (const p of done) known[p] = 1;
    pending = next;
  }

  // 3) 边：颜色从里往外推，alpha 收紧
  //    推三轮：每个半透明边缘像素取周围"比它更实"的像素的平均色。
  for (let round = 0; round < 3; round++) {
    const snap = Buffer.from(res);
    for (let p = 0; p < N; p++) {
      const a = snap[p * 4 + 3];
      if (a === 0 || a >= 250 || dist[p] > EDGE) continue;
      let r = 0, g = 0, b = 0, w = 0;
      const x = p % W, y = (p / W) | 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const np = ny * W + nx, na = snap[np * 4 + 3];
        if (na <= a + 20) continue;
        const ww = na / 255;
        r += snap[np * 4] * ww; g += snap[np * 4 + 1] * ww; b += snap[np * 4 + 2] * ww; w += ww;
      }
      if (w > 0) { res[p * 4] = r / w; res[p * 4 + 1] = g / w; res[p * 4 + 2] = b / w; }
    }
  }
  for (let p = 0; p < N; p++) {
    const a = res[p * 4 + 3];
    if (a === 0 || a >= 255 || dist[p] > EDGE) continue;
    // 软边收紧：低于 ~30 的直接去掉（那是背景残影），中间段拉陡
    const t = Math.max(0, Math.min(1, (a - 30) / 170));
    res[p * 4 + 3] = Math.round(t * t * (3 - 2 * t) * 255);
    edgeFixed++;
  }

  // 4) 孤立杂点
  const solid = new Int32Array(N); const ssz = [0];
  for (let p = 0; p < N; p++) {
    if (solid[p] || res[p * 4 + 3] < 16) continue;
    const id = ssz.length; const st = [p]; solid[p] = id; let n = 0;
    while (st.length) { const c = st.pop(); n++; for (const nb of N4(c, W, H)) if (!solid[nb] && res[nb * 4 + 3] >= 16) { solid[nb] = id; st.push(nb); } }
    ssz.push(n);
  }
  for (let p = 0; p < N; p++) if (solid[p] && ssz[solid[p]] < SPECK_MAX) { res[p * 4 + 3] = 0; specks++; }

  const cleaned = await sharp(res, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toBuffer();

  // 对比图：上排原图，下排清理后，深色 / 洋红两种底
  fs.mkdirSync('.generated/edges', { recursive: true });
  const h = 600;
  const row = async buf => Promise.all(['#14161c', '#ff00ff'].map(bg => sharp(buf).resize({ height: h }).flatten({ background: bg }).png().toBuffer()));
  const [a1, a2] = await row(await sharp(file).toBuffer());
  const [b1, b2] = await row(cleaned);
  const w = (await sharp(a1).metadata()).width;
  await sharp({ create: { width: w * 2 + 8, height: h * 2 + 8, channels: 3, background: '#444' } })
    .composite([{ input: a1, left: 0, top: 0 }, { input: a2, left: w + 8, top: 0 }, { input: b1, left: 0, top: h + 8 }, { input: b2, left: w + 8, top: h + 8 }])
    .png().toFile(`.generated/edges/${name}_compare.png`);

  console.log(`${name.padEnd(7)} 内部补实 ${filledInterior}  绿幕残渣 ${chroma}  补洞 ${filledHoles}  边缘 ${edgeFixed}  杂点 ${specks}`);
  if (DRY) { fs.writeFileSync(`.generated/edges/${name}.webp`, cleaned); return; }
  fs.mkdirSync('.backup-originals/lobby', { recursive: true });
  const bak = `.backup-originals/lobby/${name}_before_edgeclean.webp`;
  if (!fs.existsSync(bak)) fs.copyFileSync(file, bak);
  fs.writeFileSync(file, cleaned);
};

for (const n of names.length ? names : ['rei', 'miyuki', 'hikari']) await clean(n);
