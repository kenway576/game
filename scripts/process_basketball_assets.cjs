const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\wang\\.gemini\\antigravity\\brain\\a16b9145-5a46-4244-be6a-6eafd2c484b3';

const f1 = path.join(brainDir, 'gym_basketball_hoop_1790843793588.jpg');
const f2 = path.join(brainDir, 'gym_sunset_court_1790843869423.jpg');
const f3 = path.join(brainDir, 'basketball_swish_cg_1790843896878.jpg');
const f4 = path.join(brainDir, 'basketball_item_icon_1790843933518.jpg');

async function processImages() {
  // 1. Hoop view (投篮主背景)
  await sharp(f1)
    .resize({ width: 1920, height: 1080, fit: 'cover' })
    .webp({ quality: 88 })
    .toFile('public/images/backgrounds/bg_basketball_court_hoop.webp');
  console.log('Saved bg_basketball_court_hoop.webp');

  // 2. Sunset gym court (球馆夕阳全景)
  await sharp(f2)
    .resize({ width: 1920, height: 1080, fit: 'cover' })
    .webp({ quality: 88 })
    .toFile('public/images/backgrounds/bg_basketball_gym_sunset.webp');
  console.log('Saved bg_basketball_gym_sunset.webp');

  // 3. Swish CG (空心入网高光 CG)
  await sharp(f3)
    .resize({ width: 1920, height: 1080, fit: 'cover' })
    .webp({ quality: 88 })
    .toFile('public/images/backgrounds/bg_basketball_swish_cg.webp');
  await sharp(f3)
    .resize({ width: 1920, height: 1080, fit: 'cover' })
    .webp({ quality: 88 })
    .toFile('public/images/cg/cg_basketball_swish.webp');
  console.log('Saved bg_basketball_swish_cg.webp & cg_basketball_swish.webp');

  // 4. Basketball item icon
  await sharp(f4)
    .resize(256, 256)
    .webp({ quality: 90 })
    .toFile('public/images/items/basketball.webp');
  console.log('Saved items/basketball.webp');

  // 5. Basketball transparent cutout for minigame animation
  const size = 678;
  const left = 173;
  const top = 171;
  const r = Math.floor(size / 2);
  const svgCircle = '<svg width="' + size + '" height="' + size + '"><circle cx="' + r + '" cy="' + r + '" r="' + (r - 2) + '" fill="white"/></svg>';
  const mask = Buffer.from(svgCircle);

  const cropped = await sharp(f4)
    .extract({ left, top, width: size, height: size })
    .toBuffer();

  await sharp(cropped)
    .composite([{ input: mask, blend: 'dest-in' }])
    .resize(256, 256)
    .webp({ quality: 92, alphaQuality: 95 })
    .toFile('public/images/ui/basketball_ball.webp');
  console.log('Saved ui/basketball_ball.webp');
}

processImages().catch(console.error);
