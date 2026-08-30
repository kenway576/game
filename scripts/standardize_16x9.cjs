const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bgDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');
const files = fs.readdirSync(bgDir).filter(f => f.endsWith('.webp') && f.startsWith('bg_'));

async function standardizeTo16x9() {
  console.log(`Standardizing ${files.length} background files to 16:9 (1280x720) widescreen...`);
  for (const f of files) {
    const filePath = path.join(bgDir, f);
    const inputBuf = fs.readFileSync(filePath);
    const meta = await sharp(inputBuf).metadata();
    
    // 如果不是标准的 1.78 (16:9)
    const ratio = meta.width / meta.height;
    if (Math.abs(ratio - 16 / 9) > 0.05) {
      console.log(`Cropping ${f} from ${meta.width}x${meta.height} (ratio ${ratio.toFixed(2)}) to 1280x720 (16:9)...`);
      const targetHeight = Math.round(meta.width * (9 / 16));
      const topOffset = Math.round((meta.height - targetHeight) / 3);
      
      const buffer = await sharp(inputBuf)
        .extract({ left: 0, top: Math.max(0, topOffset), width: meta.width, height: Math.min(meta.height, targetHeight) })
        .resize(1280, 720, { fit: 'cover' })
        .webp({ quality: 90 })
        .toBuffer();
        
      fs.writeFileSync(filePath, buffer);
      console.log(`  -> ${f} updated to 1280x720!`);
    } else {
      console.log(`  -> ${f} is already 16:9 (${meta.width}x${meta.height})`);
    }
  }
  console.log('All backgrounds standardized to 16:9 widescreen successfully!');
}

standardizeTo16x9();
