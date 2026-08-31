const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bgDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');
const cgDir = path.join(__dirname, '..', 'public', 'images', 'cg');
const charDir = path.join(__dirname, '..', 'public', 'images', 'characters');

[bgDir, cgDir, charDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function processWidescreen(srcPath, destPath) {
  const inputBuf = fs.readFileSync(srcPath);
  const meta = await sharp(inputBuf).metadata();
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

  fs.writeFileSync(destPath, outBuf);
  console.log(`Saved widescreen ${destPath} (${(outBuf.length / 1024).toFixed(1)} KB)`);
}

// 自动将纯白底立绘转为透明通道 WebP (Transparent Alpha Sprite)
async function processTransparentSprite(srcPath, destPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const len = data.length;

  for (let i = 0; i < len; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 检测纯白/近白色背景进行平滑透明化
    if (r > 240 && g > 240 && b > 240) {
      const avg = (r + g + b) / 3;
      if (avg > 250) {
        data[i + 3] = 0; // 完全透明
      } else {
        // 边缘羽化
        data[i + 3] = Math.round((255 - avg) * 25.5);
      }
    }
  }

  const transparentBuf = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .webp({ quality: 95, lossless: false })
  .toBuffer();

  fs.writeFileSync(destPath, transparentBuf);
  console.log(`Saved transparent sprite ${destPath} (${(transparentBuf.length / 1024).toFixed(1)} KB)`);
}

async function run() {
  console.log('Installing complete Prologue visual pack...');

  // 1. 收银柜台纯背景 (16:9 无人物)
  await processWidescreen(
    'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788197271311.jpg',
    path.join(bgDir, 'bg_convenience_store_counter.webp')
  );

  // 2. 外祖父泛黄手账与神户老地图特写 CG (16:9)
  await processWidescreen(
    'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788197271316.jpg',
    path.join(cgDir, 'cg_prologue_grandfather_journal.webp')
  );
  // 也复制一份到 backgrounds 方便统一引用
  fs.copyFileSync(
    path.join(cgDir, 'cg_prologue_grandfather_journal.webp'),
    path.join(bgDir, 'bg_grandfather_journal.webp')
  );

  // 3. 三宫站递还画册给年轻母亲与小孩插画 (16:9)
  await processWidescreen(
    'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788197271319.jpg',
    path.join(bgDir, 'bg_sannomiya_station_gate.webp')
  );

  // 4. 收银员小姐姐透明立绘 (Transparent Sprite)
  await processTransparentSprite(
    'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788197271308.jpg',
    path.join(charDir, 'clerk_misaki_smile.webp')
  );

  console.log('\nAll visual pack assets installed successfully!');
}

run();
