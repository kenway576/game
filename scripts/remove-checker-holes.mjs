// 清除"封闭孔洞"里的棋盘格残留（被人物/道具包围、边缘泛洪够不到的区域）。
// 判定：低饱和连通区域，且同时含明显的亮带(~252)与灰带(~194)两种格子色。
// 纯白衣物/纸张只有亮带、木椅有饱和度，均不会被误判。
// 用法: node scripts/remove-checker-holes.mjs <子目录名> [亮带中心=252] [灰带中心=194]
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const subdir = process.argv[2];
const LIGHT = Number(process.argv[3] || 252);
const GRAY = Number(process.argv[4] || 194);
if (!subdir) { console.error('usage: node scripts/remove-checker-holes.mjs <subdir> [light] [gray]'); process.exit(1); }

const dir = path.join(path.resolve('public/images/characters'), subdir);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

for (const name of files) {
  const file = path.join(dir, name);
  const png = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = png;
  const N = width * height;

  // 候选像素：不透明、低饱和、亮度在灰带下缘以上
  const isCandidate = (p) => {
    if (data[p * 4 + 3] === 0) return false;
    const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) > 30) return false;
    return (r + g + b) / 3 >= GRAY - 20;
  };

  const label = new Int32Array(N);
  let next = 1;
  const stack = [];
  let removedPx = 0, removedRegions = 0;

  for (let start = 0; start < N; start++) {
    if (label[start] !== 0 || !isCandidate(start)) continue;
    const cur = next++;
    label[start] = cur;
    stack.push(start);
    const members = [];
    let lightBand = 0, grayBand = 0;
    while (stack.length) {
      const p = stack.pop();
      members.push(p);
      const lum = (data[p * 4] + data[p * 4 + 1] + data[p * 4 + 2]) / 3;
      if (Math.abs(lum - LIGHT) <= 12) lightBand++;
      else if (Math.abs(lum - GRAY) <= 14) grayBand++;
      const x = p % width, y = (p / width) | 0;
      const tryQ = (q) => { if (label[q] === 0 && isCandidate(q)) { label[q] = cur; stack.push(q); } };
      if (x > 0) tryQ(p - 1);
      if (x < width - 1) tryQ(p + 1);
      if (y > 0) tryQ(p - width);
      if (y < height - 1) tryQ(p + width);
    }
    // 棋盘格区域：足够大 且 两个色带都占比明显
    if (members.length >= 300 && lightBand / members.length > 0.18 && grayBand / members.length > 0.18) {
      for (const p of members) data[p * 4 + 3] = 0;
      removedPx += members.length;
      removedRegions++;
    }
  }

  if (removedRegions > 0) {
    fs.writeFileSync(file, PNG.sync.write(png, { deflateLevel: 6 }));
    console.log(`OK ${name}: removed ${removedRegions} checker holes (${(100 * removedPx / N).toFixed(1)}%)`);
  } else {
    console.log(`-- ${name}: no checker holes found`);
  }
}
console.log('done.');
