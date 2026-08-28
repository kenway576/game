// 去除"假透明棋盘格"背景（AI 生成器把透明棋盘画成了实际像素）。
// 自动从图片边缘取样两种主导中性色，再从边缘泛洪清除这两种颜色。
// 用法: node scripts/remove-checker-bg.mjs <子目录名> [容差=10]
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const subdir = process.argv[2];
const TOL = Number(process.argv[3] || 12);
// 棋盘格可能带色调（如棕灰），放宽通道差判定；默认 26
const NEUTRAL_DIFF = Number(process.argv[4] || 26);
if (!subdir) { console.error('usage: node scripts/remove-checker-bg.mjs <subdir> [tolerance] [maxChannelDiff]'); process.exit(1); }

const dir = path.join(path.resolve('public/images/characters'), subdir);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

for (const name of files) {
  const file = path.join(dir, name);
  const png = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = png;
  const N = width * height;

  // 1) 边缘 60px 带内统计中性色（r≈g≈b），聚类出两种主导背景色
  const counts = new Map();
  const tally = (x, y) => {
    const i = (y * width + x) * 4;
    if (data[i + 3] === 0) return;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) > NEUTRAL_DIFF) return; // 统计低饱和色
    const lum = Math.round((r + g + b) / 3 / 6) * 6;
    counts.set(lum, (counts.get(lum) || 0) + 1);
  };
  const band = Math.min(60, Math.floor(Math.min(width, height) / 8));
  for (let y = 0; y < height; y++) {
    if (y < band || y >= height - band) { for (let x = 0; x < width; x += 2) tally(x, y); }
    else { for (let x = 0; x < band; x += 2) tally(x, y); for (let x = width - band; x < width; x += 2) tally(x, y); }
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) { console.log(`SKIP (no neutral border colors) ${name}`); continue; }
  const bg1 = sorted[0][0];
  // 第二背景色：与 bg1 距离超过容差的下一个高频色
  const second = sorted.find(([c]) => Math.abs(c - bg1) > TOL * 2);
  const bg2 = second ? second[0] : bg1;

  // 背景 = 两种格子色之间的整个低饱和亮度区间（含方块间的抗锯齿过渡像素）
  const lo = Math.min(bg1, bg2) - TOL;
  const hi = Math.max(bg1, bg2) + TOL;
  const isBg = (p) => {
    const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
    if (data[p * 4 + 3] === 0) return false;
    if (Math.max(r, g, b) - Math.min(r, g, b) > NEUTRAL_DIFF) return false;
    const lum = (r + g + b) / 3;
    return lum >= lo && lum <= hi;
  };

  // 2) 从边缘 + 已透明区域邻接处泛洪
  const visited = new Uint8Array(N);
  const stack = [];
  const seed = (p) => { if (!visited[p] && isBg(p)) { visited[p] = 1; stack.push(p); } };
  for (let x = 0; x < width; x++) { seed(x); seed((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { seed(y * width); seed(y * width + width - 1); }
  for (let p = 0; p < N; p++) {
    if (data[p * 4 + 3] !== 0) continue;
    const x = p % width, y = (p / width) | 0;
    if (x > 0) seed(p - 1);
    if (x < width - 1) seed(p + 1);
    if (y > 0) seed(p - width);
    if (y < height - 1) seed(p + width);
  }

  let removed = 0;
  while (stack.length) {
    const p = stack.pop();
    data[p * 4 + 3] = 0;
    removed++;
    const x = p % width, y = (p / width) | 0;
    if (x > 0) seed(p - 1);
    if (x < width - 1) seed(p + 1);
    if (y > 0) seed(p - width);
    if (y < height - 1) seed(p + width);
  }

  // 3) 去边：紧邻透明区且接近背景色的像素再清两轮（放宽容差）
  for (let pass = 0; pass < 2; pass++) {
    const toClear = [];
    for (let p = 0; p < N; p++) {
      if (data[p * 4 + 3] === 0) continue;
      const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
      if (Math.max(r, g, b) - Math.min(r, g, b) > NEUTRAL_DIFF + 4) continue;
      const lum = (r + g + b) / 3;
      if (lum < lo - 8 || lum > hi + 8) continue;
      const x = p % width, y = (p / width) | 0;
      const nearT =
        (x > 0 && data[(p - 1) * 4 + 3] === 0) || (x < width - 1 && data[(p + 1) * 4 + 3] === 0) ||
        (y > 0 && data[(p - width) * 4 + 3] === 0) || (y < height - 1 && data[(p + width) * 4 + 3] === 0);
      if (nearT) toClear.push(p);
    }
    for (const p of toClear) data[p * 4 + 3] = 0;
    removed += toClear.length;
  }

  fs.writeFileSync(file, PNG.sync.write(png, { deflateLevel: 6 }));
  console.log(`OK ${name}: bg colors ${bg1}/${bg2} — cleared ${(100 * removed / N).toFixed(1)}%`);
}
console.log('done.');
