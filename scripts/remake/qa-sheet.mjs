// 质检用：把已经做好的底图（抠好的）拼成一张，按角色/衣服排
//   node scripts/remake/qa-sheet.mjs <输出.jpg> [角色...]
import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const [out, ...only] = process.argv.slice(2);
const tiles = [];
for (const c of fs.readdirSync('.generated/remake2')) {
  if (only.length && !only.includes(c)) continue;
  const cd = path.join('.generated/remake2', c);
  if (!fs.statSync(cd).isDirectory()) continue;
  for (const o of fs.readdirSync(cd)) {
    const f = path.join(cd, o, 'base_cut.png');
    if (!fs.existsSync(f)) continue;
    const img = await sharp(f).flatten({ background: '#9aa' }).resize(360, 640, { fit: 'contain', background: '#9aa' }).png().toBuffer();
    const label = Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="#222"/><text x="8" y="21" font-size="18" fill="#fff">${c}/${o}</text></svg>`);
    tiles.push(await sharp({ create: { width: 360, height: 670, channels: 3, background: '#9aa' } }).composite([{ input: img, top: 30, left: 0 }, { input: label, top: 0, left: 0 }]).png().toBuffer());
  }
}
const cols = Math.min(6, tiles.length);
const rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: cols * 360, height: rows * 670, channels: 3, background: '#000' } })
  .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * 360, top: Math.floor(i / cols) * 670 }))).jpeg({ quality: 82 }).toFile(out);
console.log(`${tiles.length} 套 → ${out}`);
