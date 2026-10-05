// 质检：一套衣服拼一张——左边全身，右边每个表情的脸 + 半闭 + 全闭眼
//   node scripts/remake/qa-outfit.mjs <角色> <衣服> <输出.jpg>
import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const [c, o, out] = process.argv.slice(2);
const dir = `.generated/remake2/${c}/${o}`;
const rig = JSON.parse(fs.readFileSync(`${dir}/rig.json`, 'utf8'));
const pub = `public/images/characters/${c}`;
const names = Object.keys(rig.files);
const full = await sharp(`${pub}/${names[0]}.webp`).flatten({ background: '#9aa' }).resize({ height: 900 }).png().toBuffer();
const fm = await sharp(full).metadata();
const [hx, hy] = rig.rig.headC, [hrx, hry] = rig.rig.headR;
const tiles = [];
for (const n of names) {
  const img = sharp(`${pub}/${n}.webp`);
  const m = await img.metadata();
  const box = { left: Math.max(0, Math.round((hx - hrx * 0.75) * m.width)), top: Math.max(0, Math.round((hy - hry * 0.6) * m.height)), width: Math.round(hrx * 1.5 * m.width), height: Math.round(hry * 1.7 * m.height) };
  box.width = Math.min(box.width, m.width - box.left); box.height = Math.min(box.height, m.height - box.top);
  const row = [await sharp(`${pub}/${n}.webp`).extract(box).flatten({ background: '#9aa' }).resize(220, 220, { fit: 'contain', background: '#9aa' }).png().toBuffer()];
  const b = rig.files[n].blink;
  if (b) {
    const bi = await sharp('public' + b.src).metadata();
    for (const k of [0, 1]) row.push(await sharp('public' + b.src).extract({ left: 0, top: k * (bi.height / 2), width: bi.width, height: bi.height / 2 }).flatten({ background: '#9aa' }).resize(220, 110, { fit: 'contain', background: '#9aa' }).png().toBuffer());
  }
  const label = Buffer.from(`<svg width="220" height="24"><rect width="220" height="24" fill="#222"/><text x="6" y="17" font-size="15" fill="#fff">${n}</text></svg>`);
  tiles.push(await sharp({ create: { width: 220, height: 24 + 220 + 220, channels: 3, background: '#9aa' } })
    .composite([{ input: label, top: 0, left: 0 }, { input: row[0], top: 24, left: 0 }, ...(row[1] ? [{ input: row[1], top: 244, left: 0 }, { input: row[2], top: 354, left: 0 }] : [])]).png().toBuffer());
}
const cols = 4, rows = Math.ceil(tiles.length / cols);
const W = fm.width + cols * 224, H = Math.max(900, rows * 468);
await sharp({ create: { width: W, height: H, channels: 3, background: '#556' } })
  .composite([{ input: full, left: 0, top: 0 }, ...tiles.map((t, i) => ({ input: t, left: fm.width + 4 + (i % cols) * 224, top: Math.floor(i / cols) * 468 }))])
  .jpeg({ quality: 85 }).toFile(out);
console.log(out);
