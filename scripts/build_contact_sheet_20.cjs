const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const files = [
  '1788520789299.jpg', '1788520829459.jpg', '1788520945057.jpg', '1788520999922.jpg',
  '1788521072230.jpg', '1788521160833.jpg', '1788521202503.jpg', '1788521246885.jpg',
  '1788521303705.jpg', '1788521429988.jpg', '1788521476010.jpg', '1788521513007.jpg',
  '1788521519818.jpg', '1788521736017.jpg', '1788521791790.jpg', '1788521859349.jpg',
  '1788521968675.jpg', '1788522206719.jpg', '1788522249623.jpg', '1788522287703.jpg'
];

async function run() {
  const cols = 5;
  const rows = Math.ceil(files.length / cols);
  const cellW = 240, cellH = 420;
  const totalW = cols * cellW;
  const totalH = rows * (cellH + 30);

  const composites = [];

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const src = path.join('.incoming-gdrive', f);
    const meta = await sharp(src).metadata();
    console.log(`[${i+1}/${files.length}] ${f}: ${meta.width}x${meta.height}`);

    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = col * cellW;
    const top = row * (cellH + 30);

    const resized = await sharp(src)
      .resize(cellW - 10, cellH - 10, { fit: 'contain', background: { r: 20, g: 20, b: 20, alpha: 1 } })
      .toBuffer();

    composites.push({ input: resized, left: left + 5, top: top + 5 });

    const svg = Buffer.from(`
      <svg width="${cellW}" height="30">
        <rect width="100%" height="100%" fill="#111827"/>
        <text x="50%" y="20" font-size="11" font-family="sans-serif" fill="#38bdf8" text-anchor="middle" font-weight="bold">
          ${i+1}. ${f}
        </text>
      </svg>
    `);
    composites.push({ input: svg, left, top: top + cellH });
  }

  const outPath = 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\contact_sheet_20_new.jpg';
  await sharp({
    create: { width: totalW, height: totalH, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 1 } }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(outPath);

  console.log('Saved contact sheet to:', outPath);
}

run().catch(console.error);
