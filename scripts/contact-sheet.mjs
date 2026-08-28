// 生成联络表：把指定角色的立绘缩小拼到一张深色底图上，便于一次目检
// 用法: node scripts/contact-sheet.mjs <子目录名> <输出路径> [每行数量=7]
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

const subdir = process.argv[2];
const outPath = process.argv[3];
const COLS = Number(process.argv[4] || 7);
const FILE_FILTER = process.argv[5] || ''; // 只包含文件名含该子串的文件
if (!subdir || !outPath) { console.error('usage: node scripts/contact-sheet.mjs <subdir> <out.png> [cols] [filter]'); process.exit(1); }

const dir = path.join(path.resolve('public/images/characters'), subdir);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') && !f.includes('_alt') && (!FILE_FILTER || f.includes(FILE_FILTER))).sort();

const CELL_W = 200, CELL_H = 440, LABEL_H = 0;
const rows = Math.ceil(files.length / COLS);
const sheet = new PNG({ width: COLS * CELL_W, height: rows * (CELL_H + LABEL_H) });
// 深灰蓝底色，衬托浅色残留
for (let p = 0; p < sheet.width * sheet.height; p++) {
  sheet.data[p * 4] = 30; sheet.data[p * 4 + 1] = 34; sheet.data[p * 4 + 2] = 48; sheet.data[p * 4 + 3] = 255;
}

files.forEach((name, idx) => {
  const img = PNG.sync.read(fs.readFileSync(path.join(dir, name)));
  const scale = Math.min((CELL_W - 8) / img.width, (CELL_H - 8) / img.height);
  const dw = Math.floor(img.width * scale), dh = Math.floor(img.height * scale);
  const ox = (idx % COLS) * CELL_W + ((CELL_W - dw) >> 1);
  const oy = Math.floor(idx / COLS) * (CELL_H + LABEL_H) + (CELL_H - dh);
  for (let y = 0; y < dh; y++) {
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(img.width - 1, Math.floor(x / scale));
      const sy = Math.min(img.height - 1, Math.floor(y / scale));
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
console.log(`sheet: ${files.length} sprites -> ${outPath}`);
console.log(files.map((f, i) => `${i + 1}.${f.replace('.png', '')}`).join('  '));
