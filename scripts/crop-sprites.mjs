// 按 alpha 边界框裁剪透明立绘的空白边缘（保留少量边距）
// 用法: node scripts/crop-sprites.mjs <子目录名> [边距像素=24]
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const subdir = process.argv[2];
const MARGIN = Number(process.argv[3] || 24);
if (!subdir) { console.error('usage: node scripts/crop-sprites.mjs <subdir> [margin]'); process.exit(1); }

const dir = path.join(path.resolve('public/images/characters'), subdir);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

for (const name of files) {
  const file = path.join(dir, name);
  const png = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = png;

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) { console.log(`SKIP (fully transparent?) ${name}`); continue; }

  minX = Math.max(0, minX - MARGIN);
  minY = Math.max(0, minY - MARGIN);
  maxX = Math.min(width - 1, maxX + MARGIN);
  maxY = Math.min(height - 1, maxY + MARGIN);
  const w = maxX - minX + 1, h = maxY - minY + 1;

  if (w >= width - 4 && h >= height - 4) { console.log(`SKIP (no blank margin) ${name}`); continue; }

  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, minX, minY, w, h, 0, 0);
  fs.writeFileSync(file, PNG.sync.write(out, { deflateLevel: 6 }));
  console.log(`OK ${name}: ${width}x${height} -> ${w}x${h}`);
}
console.log('done.');
