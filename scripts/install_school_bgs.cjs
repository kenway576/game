const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bgDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');

const schoolAssets = [
  // 1. 高二 B 班教室晨光大景
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788366268920.jpg',
    targets: ['bg_classroom_morning.webp', 'school.webp'],
    name: 'Class 2-B Morning Classroom'
  },
  // 2. 教学楼二楼阳光走廊 (2-B门牌/与明日香相撞)
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788366269849.jpg',
    targets: ['bg_school_hallway.webp', 'school_hallway.webp'],
    name: 'School Hallway 2-B Class Entrance'
  },
  // 3. 教学楼储物柜走廊 (备选/走廊特写)
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788366270188.jpg',
    targets: ['bg_school_lockers_hallway.webp'],
    name: 'School Hallway Lockers View'
  },
  // 4. 国际交流室 203 (与光初识)
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788366270232.jpg',
    targets: ['bg_international_office.webp'],
    name: 'International Exchange Office 203'
  },
  // 5. 学校天台放学夕阳远眺神户港
  {
    src: 'C:/Users/adm/.gemini/antigravity/brain/7067a92b-54aa-4bc9-bfc4-aa9a64f16b16/.user_uploaded/media_1788366270280.jpg',
    targets: ['bg_school_rooftop_sunset.webp', 'school_roof.webp'],
    name: 'School Rooftop Sunset Overlook'
  }
];

async function processSchoolAssets() {
  console.log('Installing Makoto Shinkai Kaisei Academy School backgrounds...');
  for (const item of schoolAssets) {
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

    for (const targetName of item.targets) {
      const destPath = path.join(bgDir, targetName);
      fs.writeFileSync(destPath, outBuf);
      console.log(`  -> Saved ${targetName} (${(outBuf.length / 1024).toFixed(1)} KB) successfully!`);
    }
  }
  console.log('\nAll Kaisei Academy School backgrounds installed perfectly!');
}

processSchoolAssets();
