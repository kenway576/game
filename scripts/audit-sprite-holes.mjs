// ============================================================================
// 查立绘里"被围在人物内部的透明洞"
//
// 起因：clean-sprite-matte.mjs 会清掉"被围住的纯白块"，本意是双马尾和身体
// 之间那种漏抠的背景。但张嘴的立绘里，口腔内部（牙齿 + 亮色）同样是
// 一块被围住的、几乎全白的区域——于是嘴被抠穿了，游戏里看上去是一张黑嘴。
//
// 这个脚本只做检测：从画布四边灌"透明"，灌不到的透明区域就是内部空洞。
// 用它确认修复前后的差别，别再靠肉眼一张张翻。
//
// 用法：node scripts/audit-sprite-holes.mjs [路径片段]
// ============================================================================
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = 'public/images/characters';
const filter = process.argv[2] || '';

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.webp')) files.push(p);
  }
})(ROOT);

const targets = files.filter(f => path.relative(ROOT, f).replace(/\\/g, '/').includes(filter));

let bad = 0;
const sizes = [];
const shown = [];

for (const f of targets) {
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const tr = p => data[p * 4 + 3] < 40;

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

  const seen = new Uint8Array(N);
  const holes = [];
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || outside[p0] || !tr(p0)) continue;
    const s2 = [p0]; seen[p0] = 1;
    let n = 0, minY = H;
    while (s2.length) {
      const p = s2.pop(); n++;
      const x = p % W, y = (p - x) / W;
      if (y < minY) minY = y;
      for (const q of [x + 1 < W ? p + 1 : -1, x > 0 ? p - 1 : -1,
                       y + 1 < H ? p + W : -1, y > 0 ? p - W : -1]) {
        if (q >= 0 && !seen[q] && !outside[q] && tr(q)) { seen[q] = 1; s2.push(q); }
      }
    }
    if (n > 40) holes.push({ n, yPct: Math.round(minY / H * 100) });
  }

  if (holes.length) {
    bad++;
    holes.sort((a, b) => b.n - a.n);
    sizes.push(...holes.map(h => h.n));
    if (shown.length < 15) {
      shown.push(`${path.relative(ROOT, f).replace(/\\/g, '/').padEnd(30)} ` +
        holes.slice(0, 3).map(h => `${h.n}px@y${h.yPct}%`).join('  '));
    }
  }
}

shown.forEach(l => console.log(l));
sizes.sort((a, b) => a - b);
const q = p => sizes.length ? sizes[Math.floor(sizes.length * p)] : 0;
console.log(`\n${targets.length} 张里 ${bad} 张有内部空洞，共 ${sizes.length} 个洞`);
if (sizes.length) {
  console.log(`洞的大小：p10 ${q(0.1)}  中位 ${q(0.5)}  p90 ${q(0.9)}  最大 ${sizes[sizes.length - 1]}`);
}
