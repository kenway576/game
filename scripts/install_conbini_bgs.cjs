const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploads = [
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788195170266.jpg',
    target: 'public/images/backgrounds/bg_convenience_store_night.webp',
    name: 'Kitano 24h Convenience Store Exterior (Night)'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788195170223.jpg',
    target: 'public/images/backgrounds/bg_convenience_store_interior.webp',
    name: 'Convenience Store Interior (Oden & Shelves)'
  }
];

async function processConbini() {
  console.log('Installing Convenience Store exterior and interior backgrounds...');
  for (const item of uploads) {
    const inputBuf = fs.readFileSync(item.src);
    const meta = await sharp(inputBuf).metadata();
    console.log(`\nProcessing ${item.name} (${meta.width}x${meta.height})...`);

    const targetHeight = Math.round(meta.width * (9 / 16));
    const topOffset = Math.round((meta.height - targetHeight) / 3);

    const outBuf = await sharp(inputBuf)
      .extract({
        left: 0,
        top: Math.max(0, topOffset),
        width: meta.width,
        height: Math.min(meta.height, targetHeight)
      })
      .resize(1280, 720, { fit: 'cover' })
      .webp({ quality: 92 })
      .toBuffer();

    fs.writeFileSync(item.target, outBuf);
    console.log(`  -> Saved ${item.target} (1280x720, ${(outBuf.length / 1024).toFixed(1)} KB) successfully!`);
  }
  console.log('\nBoth convenience store backgrounds installed perfectly!');
}

processConbini();
