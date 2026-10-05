// ---------------------------------------------------------
// 🩹 补回被抠图挖掉的白衣服
//
//   node scripts/remake/fix-clothing-holes.mjs [--only nao/maid,hikari/gym]
//
// 白围裙、白背心、毛巾、和服的白毛领……它们的阴影跟浅灰底色太接近，
// cutout-flat-bg.mjs 的"封闭空洞"一步把这些地方当成背景挖掉了，放到深色场景上就是一道道黑斑。
//
// 分辨办法（在带灰底的原图 base.png 上量的）：
//   · 真的背景空隙（手臂和身体之间、发丝之间）：颜色跟底色几乎一样（色差 < 3.5），而且很平
//   · 衣服上被挖掉的洞：颜色差一点（≥ 4.5）或者有明暗变化（标准差 ≥ 7.5）
// 只把后一种补回来：透明度改成不透明，颜色用 base.png 的原色。
// 改 base_cut.png 和每张表情 <表情>.png，然后重新装图（outfit-pipeline 只会重跑装图那一步）。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { spawnSync } from 'child_process';
import { OUTFITS, EMOTIONS } from './outfits.mjs';
sharp.cache(false);

const i = process.argv.indexOf('--only');
const ONLY = i > -1 ? process.argv[i + 1].split(',') : null;

const fixOne = async (c, o) => {
  const d = `.generated/remake2/${c}/${o}`;
  if (!fs.existsSync(`${d}/base.png`) || !fs.existsSync(`${d}/rig.json`)) return;
  const { data: cut, info } = await sharp(`${d}/base_cut.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const base = await sharp(`${d}/base.png`).removeAlpha().raw().toBuffer();
  const W = info.width, H = info.height, N = W * H;
  const bd = []; for (let x = 0; x < W; x += 7) bd.push(x, (H - 1) * W + x); for (let y = 0; y < H; y += 7) bd.push(y * W, y * W + W - 1);
  const med = k => { const v = bd.map(p => base[p * 3 + k]).sort((a, b) => a - b); return v[v.length >> 1]; };
  const bg = [med(0), med(1), med(2)];
  // 外部：从四边泛洪，只走透明的地方
  const out = new Uint8Array(N), st = [];
  const push = p => { if (!out[p] && cut[p * 4 + 3] < 128) { out[p] = 1; st.push(p); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (st.length) { const p = st.pop(), x = p % W; if (x > 0) push(p - 1); if (x < W - 1) push(p + 1); if (p >= W) push(p - W); if (p < N - W) push(p + W); }
  // 被包住的透明块，逐块判断
  const restore = new Uint8Array(N);
  const seen = new Uint8Array(N);
  let restored = 0, kept = 0;
  for (let s = 0; s < N; s++) {
    if (out[s] || seen[s] || cut[s * 4 + 3] >= 128) continue;
    const comp = []; st.push(s); seen[s] = 1;
    while (st.length) { const p = st.pop(), x = p % W; comp.push(p); for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p >= W ? p - W : -1, p < N - W ? p + W : -1]) if (q >= 0 && !out[q] && !seen[q] && cut[q * 4 + 3] < 128) { seen[q] = 1; st.push(q); } }
    let m = [0, 0, 0];
    for (const p of comp) for (let k = 0; k < 3; k++) m[k] += base[p * 3 + k];
    m = m.map(x => x / comp.length);
    let v = 0;
    for (const p of comp) { let dd = 0; for (let k = 0; k < 3; k++) dd += (base[p * 3 + k] - m[k]) ** 2; v += dd; }
    const dist = Math.hypot(m[0] - bg[0], m[1] - bg[1], m[2] - bg[2]), std = Math.sqrt(v / comp.length);
    if (dist >= 4.5 || std >= 7.5) { for (const p of comp) restore[p] = 1; restored += comp.length; } else kept++;
  }
  if (!restored) return;
  // 洞边上那圈半透明（抗锯齿）也补上
  for (let p = 0; p < N; p++) {
    if (restore[p] || cut[p * 4 + 3] >= 250 || out[p]) continue;
    const x = p % W;
    for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p >= W ? p - W : -1, p < N - W ? p + W : -1]) if (q >= 0 && restore[q] === 1) { restore[p] = 2; break; }
  }
  const apply = async f => {
    const { data } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let p = 0; p < N; p++) if (restore[p]) { for (let k = 0; k < 3; k++) data[p * 4 + k] = base[p * 3 + k]; data[p * 4 + 3] = 255; }
    fs.writeFileSync(f, await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer());
  };
  await apply(`${d}/base_cut.png`);
  for (const e of EMOTIONS[c]) if (fs.existsSync(`${d}/${e}.png`)) await apply(`${d}/${e}.png`);
  // 重新装图（其它步骤都有缓存，只会重写 webp 和骨骼）
  const r = spawnSync(process.execPath, ['scripts/remake/outfit-pipeline.mjs', '--char', c, '--outfit', o, '--until', 'install'], { encoding: 'utf8', env: process.env });
  console.log(`${c}/${o}：补回 ${restored} 像素（真空隙 ${kept} 块不动）${r.status === 0 ? '' : '  装图失败 ' + r.stderr.slice(-200)}`);
};

for (const [c, outfits] of Object.entries(OUTFITS)) for (const o of Object.keys(outfits)) {
  if (ONLY && !ONLY.includes(`${c}/${o}`)) continue;
  try { await fixOne(c, o); } catch (e) { console.log(`✘ ${c}/${o}: ${e.message}`); }
}
console.log('完成');
