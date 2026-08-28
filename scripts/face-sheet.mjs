// 生成"脸部特写"联络表：裁每张立绘顶部区域并放大平铺，便于快速辨认表情。
// 用法: node scripts/face-sheet.mjs <子目录> <输出.png> [每行数=8] [文件名过滤]
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const [subdir, outPath, colsArg, filter] = process.argv.slice(2);
const COLS = Number(colsArg || 8);
if (!subdir || !outPath) { console.error('usage: node scripts/face-sheet.mjs <subdir> <out.png> [cols] [filter]'); process.exit(1); }

const dir = path.join(path.resolve('public/images/characters'), subdir);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') && (!filter || f.includes(filter))).sort();

const CELL = 260;
const rows = Math.ceil(files.length / COLS);
const sheet = new PNG({ width: COLS * CELL, height: rows * CELL });
for (let p = 0; p < sheet.width * sheet.height; p++) {
  sheet.data[p * 4] = 28; sheet.data[p * 4 + 1] = 32; sheet.data[p * 4 + 2] = 46; sheet.data[p * 4 + 3] = 255;
}

files.forEach((name, idx) => {
  const img = PNG.sync.read(fs.readFileSync(path.join(dir, name)));
  // 取顶部 38% 作为脸部区域，居中裁成正方形
  const faceH = Math.floor(img.height * 0.38);
  const side = Math.min(img.width, faceH);
  const sx0 = Math.floor((img.width - side) / 2);
  const sy0 = 0;
  const scale = CELL / side;
  const ox = (idx % COLS) * CELL;
  const oy = Math.floor(idx / COLS) * CELL;
  for (let y = 0; y < CELL; y++) {
    for (let x = 0; x < CELL; x++) {
      const sx = sx0 + Math.min(side - 1, Math.floor(x / scale));
      const sy = sy0 + Math.min(faceH - 1, Math.floor(y / scale));
      const si = (sy * img.width + sx) * 4;
      const a = img.data[si + 3] / 255;
      if (a === 0) continue;
      const di = ((oy + y) * sheet.width + (ox + x)) * 4;
      sheet.data[di] = Math.round(img.data[si] * a + sheet.data[di] * (1 - a));
      sheet.data[di + 1] = Math.round(img.data[si + 1] * a + sheet.data[di + 1] * (1 - a));
      sheet.data[di + 2] = Math.round(img.data[si + 2] * a + sheet.data[di + 2] * (1 - a));
    }
  }
});

fs.writeFileSync(outPath, PNG.sync.write(sheet, { deflateLevel: 6 }));
console.log(`face sheet: ${files.length} sprites, ${COLS} cols -> ${outPath}`);
files.forEach((f, i) => console.log(`${i + 1}. ${f.replace('.png', '')}`));
