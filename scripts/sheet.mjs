// 把一个角色的全部立绘拼成一张深色底的联络表，用来肉眼验收。
// 深色底是必须的：白边、没抠干净的光晕、被抠穿的洞，在浅色底上全看不见。
//   node scripts/sheet.mjs asuka [每格宽] [列数]
import fs from 'fs';
import sharp from 'sharp';

const who = process.argv[2];
const CW = Number(process.argv[3]) || 150;
const COLS = Number(process.argv[4]) || 10;
const CH = Math.round(CW * 1.7);

const dir = `public/images/characters/${who}`;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp')).sort();
const rows = Math.ceil(files.length / COLS);
const comp = [];
for (let i = 0; i < files.length; i++) {
  const png = await sharp(dir + '/' + files[i]).resize(CW - 8, CH - 8, { fit: 'inside' }).png().toBuffer();
  const m = await sharp(png).metadata();
  comp.push({
    input: png,
    left: (i % COLS) * CW + Math.floor((CW - m.width) / 2),
    top: Math.floor(i / COLS) * CH + 4
  });
}
await sharp({ create: { width: CW * COLS, height: CH * rows, channels: 4, background: '#191033' } })
  .composite(comp).png().toFile(`_sheet_${who}.png`);
console.log(who, files.length, '张 →', `_sheet_${who}.png`);
console.log(files.join(' '));
