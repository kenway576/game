const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploads = [
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f/.user_uploaded/media_1788197570823.jpg',
    targets: [
      'public/images/backgrounds/bg_convenience_store_night.webp',
      'dist/images/backgrounds/bg_convenience_store_night.webp'
    ],
    name: 'Kitano 24h Convenience Store Exterior (Night)'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788195170223.jpg',
    targets: [
      'public/images/backgrounds/bg_convenience_store_interior.webp',
      'dist/images/backgrounds/bg_convenience_store_interior.webp'
    ],
    name: 'Convenience Store Interior (Oden & Shelves)'
  }
];

async function processConbini() {
  console.log('Installing Convenience Store exterior and interior backgrounds...');
  for (const item of uploads) {
    if (!fs.existsSync(item.src)) {
      console.log(`Skipping missing source: ${item.src}`);
      continue;
    }
    const inputBuf = fs.readFileSync(item.src);
    const meta = await sharp(inputBuf).metadata();
    console.log(`\nProcessing ${item.name} (${meta.width}x${meta.height})...`);

    const outBuf = await sharp(inputBuf)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toBuffer();

    for (const target of item.targets) {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(target, outBuf);
      console.log(`  -> Saved ${target} (1280x720, ${(outBuf.length / 1024).toFixed(1)} KB) successfully!`);
    }
  }
  console.log('\nConvenience store backgrounds installed perfectly!');
}

processConbini();
