// 批量去除立绘白色背景：
// 从图片边缘的近白像素做泛洪填充（4 连通），只清除与边缘连通的白色区域，
// 人物身上的白色衣物等封闭区域不受影响。之后做两轮去白边（defringe）。
// 已部分透明的图会从透明区边缘继续扩展（可用更宽松的阈值补刀）。
// 用法: node scripts/remove-white-bg.mjs [子目录名|all] [最低亮度=240] [最大色差=45]
//   例: node scripts/remove-white-bg.mjs asuka 200 28   （清除偏奶白的背景）
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const onlyDir = process.argv[2] && process.argv[2] !== 'all' ? process.argv[2] : undefined;
const MIN_BRIGHT = Number(process.argv[3] || 240); // RGB 最小通道值 >= 该值
const MAX_DIFF = Number(process.argv[4] || 45);    // 最大通道差（排除有色彩的像素）
const FILE_FILTER = process.argv[5] || '';         // 只处理文件名含该子串的文件
const FRINGE_THRESH = Math.max(200, MIN_BRIGHT - 12); // 去白边阈值

const root = path.resolve('public/images/characters');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : (e.name.endsWith('.png') ? [path.join(dir, e.name)] : [])
);

const files = walk(onlyDir ? path.join(root, onlyDir) : root).filter(f => !FILE_FILTER || path.basename(f).includes(FILE_FILTER));
console.log(`processing ${files.length} files...`);

for (const file of files) {
  const t0 = Date.now();
  const png = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = png;
  const N = width * height;

  const isWhite = (p) => {
    const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
    const min = Math.min(r, g, b), max = Math.max(r, g, b);
    return data[p * 4 + 3] > 0 && min >= MIN_BRIGHT && (max - min) <= MAX_DIFF;
  };

  // BFS 泛洪填充，种子 = 边缘白色像素 + 紧邻已透明区域的白色像素（补刀模式）
  const visited = new Uint8Array(N);
  const stack = [];
  const seed = (p) => { if (!visited[p] && isWhite(p)) { visited[p] = 1; stack.push(p); } };
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

  // 去白边：紧邻透明像素的高亮像素再清两轮，消除抗锯齿残留的白圈
  for (let pass = 0; pass < 2; pass++) {
    const toClear = [];
    for (let p = 0; p < N; p++) {
      if (data[p * 4 + 3] === 0) continue;
      const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
      if (r < FRINGE_THRESH || g < FRINGE_THRESH || b < FRINGE_THRESH) continue;
      const x = p % width, y = (p / width) | 0;
      const nearTransparent =
        (x > 0 && data[(p - 1) * 4 + 3] === 0) || (x < width - 1 && data[(p + 1) * 4 + 3] === 0) ||
        (y > 0 && data[(p - width) * 4 + 3] === 0) || (y < height - 1 && data[(p + width) * 4 + 3] === 0);
      if (nearTransparent) toClear.push(p);
    }
    for (const p of toClear) data[p * 4 + 3] = 0;
    removed += toClear.length;
  }

  fs.writeFileSync(file, PNG.sync.write(png, { deflateLevel: 6 }));
  console.log(`OK ${path.relative(root, file)} — cleared ${(100 * removed / N).toFixed(1)}% px in ${Date.now() - t0}ms`);
}
console.log('done.');
