// 深度清理：保留最大的不透明连通域（人物本体），清除残留的背景孤岛。
// 孤岛删除条件：面积过小（噪点）或 大部分像素为低饱和灰白（棋盘格残留）。
// 彩色的悬浮特效（爱心、狐火等）会被保留。
// 用法: node scripts/keep-main-component.mjs <子目录名>
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const subdir = process.argv[2];
if (!subdir) { console.error('usage: node scripts/keep-main-component.mjs <subdir>'); process.exit(1); }

const dir = path.join(path.resolve('public/images/characters'), subdir);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

for (const name of files) {
  const file = path.join(dir, name);
  const png = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = png;
  const N = width * height;

  // 连通域标记（8 连通，保住细发丝等抗锯齿连接）
  const label = new Int32Array(N); // 0 = 未标记
  const sizes = [0];
  const grayish = [0]; // 每个域中低饱和灰白像素数
  let nextLabel = 1;
  const stack = [];

  for (let start = 0; start < N; start++) {
    if (label[start] !== 0 || data[start * 4 + 3] === 0) continue;
    const cur = nextLabel++;
    sizes.push(0); grayish.push(0);
    label[start] = cur;
    stack.push(start);
    while (stack.length) {
      const p = stack.pop();
      sizes[cur]++;
      const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
      const lum = (r + g + b) / 3;
      if (Math.max(r, g, b) - Math.min(r, g, b) <= 28 && lum >= 95) grayish[cur]++;
      const x = p % width, y = (p / width) | 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const q = ny * width + nx;
          if (label[q] === 0 && data[q * 4 + 3] > 0) { label[q] = cur; stack.push(q); }
        }
      }
    }
  }

  if (nextLabel <= 2) { console.log(`OK ${name}: single component, nothing to clean`); continue; }

  let main = 1;
  for (let c = 2; c < nextLabel; c++) if (sizes[c] > sizes[main]) main = c;

  // 删除条件：面积 < 主体的 0.3%（噪点）或 灰白占比 > 55%（棋盘格残留）
  const removeSet = new Uint8Array(nextLabel);
  let removedComponents = 0, removedPx = 0, keptExtras = 0;
  for (let c = 1; c < nextLabel; c++) {
    if (c === main) continue;
    const tiny = sizes[c] < sizes[main] * 0.003;
    const checkerish = grayish[c] / sizes[c] > 0.55;
    if (tiny || checkerish) { removeSet[c] = 1; removedComponents++; removedPx += sizes[c]; }
    else keptExtras++;
  }

  for (let p = 0; p < N; p++) {
    if (removeSet[label[p]]) data[p * 4 + 3] = 0;
  }

  fs.writeFileSync(file, PNG.sync.write(png, { deflateLevel: 6 }));
  console.log(`OK ${name}: removed ${removedComponents} islands (${(100 * removedPx / N).toFixed(1)}%), kept ${keptExtras} colored effects`);
}
console.log('done.');
