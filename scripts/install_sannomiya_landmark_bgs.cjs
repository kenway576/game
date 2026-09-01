const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bgs = [
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f/.user_uploaded/media_1788281121002.jpg',
    name: 'bg_ikuta_shrine_gate.webp',
    desc: 'Ikuta Shrine Vermilion Torii Gate & Inscribed Monument'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f/.user_uploaded/media_1788281121133.jpg',
    name: 'bg_ikuta_shrine_forest.webp',
    desc: 'Ikuta no Mori Sacred Camphor Forest & Red Taiko Bridge'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f/.user_uploaded/media_1788281121070.jpg',
    name: 'bg_kitano_tenman_shrine_lookout.webp',
    desc: 'Kitano Tenman Shrine Sunset Torii Overlook over Kazamidori & Kobe'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f/.user_uploaded/media_1788281121090.jpg',
    name: 'bg_portliner_sannomiya_platform.webp',
    desc: 'Port Liner Sannomiya Station Elevated Platform Sunset View'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f/.user_uploaded/media_1788281121189.jpg',
    name: 'bg_sannomiya_junkudo_bookstore.webp',
    desc: 'Junkudo Bookstore Sannomiya Interior Grand Bookshelves'
  }
];

async function processImages() {
  const dirs = [
    path.join(__dirname, '..', 'public', 'images', 'backgrounds'),
    path.join(__dirname, '..', 'dist', 'images', 'backgrounds')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  for (const item of bgs) {
    if (!fs.existsSync(item.src)) {
      console.log('Skipping missing file:', item.src);
      continue;
    }
    console.log('Processing:', item.desc, '->', item.name);
    const inputBuf = fs.readFileSync(item.src);
    const webpBuf = await sharp(inputBuf)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toBuffer();

    for (const dir of dirs) {
      const outPath = path.join(dir, item.name);
      fs.writeFileSync(outPath, webpBuf);
      console.log('  Saved', outPath, (webpBuf.length / 1024).toFixed(1), 'KB');
    }
  }
  console.log('All backgrounds processed successfully!');
}

processImages().catch(console.error);
