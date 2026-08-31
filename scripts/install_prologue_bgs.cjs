const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploads = [
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788193787268.jpg',
    target: 'public/images/backgrounds/bg_jr_train_interior.webp',
    name: 'JR Train Interior Window Scene'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788193787212.jpg',
    target: 'public/images/backgrounds/bg_umikaze_room_201.webp',
    name: 'Kaifuso Room 201 Interior'
  },
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788193787206.jpg',
    target: 'public/images/backgrounds/bg_umikaze_balcony_harbor.webp',
    name: 'Balcony Overlook of Kobe Port'
  }
];

async function processUploads() {
  console.log('Processing user uploaded Makoto Shinkai backgrounds...');
  for (const item of uploads) {
    const inputBuf = fs.readFileSync(item.src);
    const meta = await sharp(inputBuf).metadata();
    console.log(`\nProcessing ${item.name} (Source: ${meta.width}x${meta.height})...`);

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
  console.log('\nAll 3 prologue backgrounds installed perfectly!');
}

processUploads();
