// 检查所有角色立绘：是否已有透明背景、四角像素颜色
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const root = path.resolve('public/images/characters');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : (e.name.endsWith('.png') ? [path.join(dir, e.name)] : [])
);

const files = walk(root);
console.log(`total ${files.length} png files\n`);

for (const file of files) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = png;
  const px = (x, y) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  // 统计边框一圈的像素：透明比例 / 近白比例
  let transparent = 0, nearWhite = 0, total = 0;
  const check = (x, y) => {
    const [r, g, b, a] = px(x, y);
    total++;
    if (a < 128) transparent++;
    else if (r > 235 && g > 235 && b > 235) nearWhite++;
  };
  for (let x = 0; x < width; x += 4) { check(x, 0); check(x, height - 1); }
  for (let y = 0; y < height; y += 4) { check(0, y); check(width - 1, y); }

  const tag = transparent / total > 0.8 ? 'TRANSPARENT' : (nearWhite / total > 0.8 ? 'WHITE_BG' : 'OTHER_BG');
  const rel = path.relative(root, file);
  console.log(`${tag.padEnd(12)} ${String(width).padStart(5)}x${String(height).padEnd(5)} border: ${Math.round(100*transparent/total)}% alpha, ${Math.round(100*nearWhite/total)}% white | ${rel}`);
}
