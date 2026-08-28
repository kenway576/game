// 拆分多合一立绘拼图（前提：背景已透明）。
// 模式 components：每个大连通域=一个人物，小特效就近归属（适合不规则排布）
// 模式 grid：按不透明像素密度最低的行/列切成 2x2 网格（适合规则四合一）
// 用法: node scripts/split-sheet.mjs <子目录名> <文件名> <输出前缀> [components|grid]
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const [subdir, fileName, outPrefix, mode = 'components'] = process.argv.slice(2);
if (!subdir || !fileName || !outPrefix) { console.error('usage: node scripts/split-sheet.mjs <subdir> <file> <outPrefix> [components|grid]'); process.exit(1); }

const dir = path.join(path.resolve('public/images/characters'), subdir);
const png = PNG.sync.read(fs.readFileSync(path.join(dir, fileName)));
const { width, height, data } = png;
const N = width * height;
const MARGIN = 12;

const saveCrop = (name, minX, minY, maxX, maxY, keep) => {
  minX = Math.max(0, minX - MARGIN); minY = Math.max(0, minY - MARGIN);
  maxX = Math.min(width - 1, maxX + MARGIN); maxY = Math.min(height - 1, maxY + MARGIN);
  const w = maxX - minX + 1, h = maxY - minY + 1;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sp = (minY + y) * width + (minX + x);
    if (keep && !keep(sp)) continue;
    const si = sp * 4, di = (y * w + x) * 4;
    out.data[di] = data[si]; out.data[di + 1] = data[si + 1]; out.data[di + 2] = data[si + 2]; out.data[di + 3] = data[si + 3];
  }
  fs.writeFileSync(path.join(dir, name), PNG.sync.write(out, { deflateLevel: 6 }));
  console.log(`OK ${name}: ${w}x${h}`);
};

if (mode === 'grid') {
  // 在 35%-65% 区间找不透明像素最少的行与列作为切割线
  const colDensity = new Array(width).fill(0);
  const rowDensity = new Array(height).fill(0);
  for (let p = 0; p < N; p++) {
    if (data[p * 4 + 3] === 0) continue;
    colDensity[p % width]++; rowDensity[(p / width) | 0]++;
  }
  const argminIn = (arr, lo, hi) => {
    let best = lo;
    for (let i = lo; i <= hi; i++) if (arr[i] < arr[best]) best = i;
    return best;
  };
  const cutX = argminIn(colDensity, Math.floor(width * 0.35), Math.floor(width * 0.65));
  const cutY = argminIn(rowDensity, Math.floor(height * 0.35), Math.floor(height * 0.65));
  console.log(`grid cut at x=${cutX} (density ${colDensity[cutX]}), y=${cutY} (density ${rowDensity[cutY]})`);
  const quads = [
    [0, 0, cutX, cutY], [cutX + 1, 0, width - 1, cutY],
    [0, cutY + 1, cutX, height - 1], [cutX + 1, cutY + 1, width - 1, height - 1]
  ];
  quads.forEach(([x0, y0, x1, y1], i) => {
    // 收紧到象限内实际内容
    let minX = x1, minY = y1, maxX = x0, maxY = y0, found = false;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (data[(y * width + x) * 4 + 3] === 0) continue;
      found = true;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    if (!found) { console.log(`quad ${i + 1}: empty, skipped`); return; }
    const inQuad = (sp) => { const x = sp % width, y = (sp / width) | 0; return x >= x0 && x <= x1 && y >= y0 && y <= y1; };
    saveCrop(`${outPrefix}_part${i + 1}.png`, minX, minY, maxX, maxY, inQuad);
  });
  console.log('done (grid).');
} else {
  // 连通域标记（8 连通）
  const label = new Int32Array(N);
  let next = 1;
  const stack = [];
  const comps = [null];
  for (let start = 0; start < N; start++) {
    if (label[start] !== 0 || data[start * 4 + 3] === 0) continue;
    const cur = next++;
    const c = { size: 0, minX: width, minY: height, maxX: 0, maxY: 0 };
    comps.push(c);
    label[start] = cur;
    stack.push(start);
    while (stack.length) {
      const p = stack.pop();
      c.size++;
      const x = p % width, y = (p / width) | 0;
      if (x < c.minX) c.minX = x; if (x > c.maxX) c.maxX = x;
      if (y < c.minY) c.minY = y; if (y > c.maxY) c.maxY = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const q = ny * width + nx;
        if (label[q] === 0 && data[q * 4 + 3] > 0) { label[q] = cur; stack.push(q); }
      }
    }
  }

  const largest = Math.max(...comps.slice(1).map(c => c.size));
  const figures = []; // { ids:Set, bbox }
  for (let i = 1; i < comps.length; i++) {
    if (comps[i].size >= largest * 0.2) figures.push({ ids: new Set([i]), bbox: { ...comps[i] } });
  }
  // 小特效归入中心距离最近的人物
  const center = (c) => [(c.minX + c.maxX) / 2, (c.minY + c.maxY) / 2];
  for (let i = 1; i < comps.length; i++) {
    if (figures.some(f => f.ids.has(i))) continue;
    const [cx, cy] = center(comps[i]);
    let best = null, bestD = Infinity;
    for (const f of figures) {
      const [fx, fy] = center(f.bbox);
      const d = (cx - fx) ** 2 + (cy - fy) ** 2;
      if (d < bestD) { bestD = d; best = f; }
    }
    if (best) best.ids.add(i);
  }
  // 阅读顺序：先上后左
  figures.sort((a, b) => {
    const rowA = Math.round(a.bbox.minY / 400), rowB = Math.round(b.bbox.minY / 400);
    return rowA !== rowB ? rowA - rowB : a.bbox.minX - b.bbox.minX;
  });
  figures.forEach((f, idx) => {
    let { minX, minY, maxX, maxY } = f.bbox;
    for (const id of f.ids) {
      const c = comps[id];
      minX = Math.min(minX, c.minX); minY = Math.min(minY, c.minY);
      maxX = Math.max(maxX, c.maxX); maxY = Math.max(maxY, c.maxY);
    }
    saveCrop(`${outPrefix}_part${idx + 1}.png`, minX, minY, maxX, maxY, (sp) => f.ids.has(label[sp]));
  });
  console.log(`done (components): ${figures.length} figures`);
}
