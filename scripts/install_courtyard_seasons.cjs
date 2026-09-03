const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('.incoming-gdrive');
const bgDir = path.resolve('public/images/backgrounds');
const distDir = path.resolve('dist/images/backgrounds');
const backupDir = path.resolve('.backup-originals/backgrounds');

[bgDir, distDir, backupDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const mappings = [
  {
    src: '1788454328290.jpg',
    targets: ['bg_courtyard_spring_sunny.webp', 'bg_school_courtyard_spring.webp', 'bg_kaisei_courtyard_spring.webp'],
    desc: 'Courtyard Spring Sunny (Cherry Blossom)'
  },
  {
    src: '1788454376488.jpg',
    targets: ['bg_courtyard_spring_rainy.webp', 'bg_kaisei_courtyard_rain.webp', 'bg_school_courtyard_rain.webp'],
    desc: 'Courtyard Spring Rainy (Petals & Mist)'
  },
  {
    src: '1788454426037.jpg',
    targets: ['bg_courtyard_summer_sunny.webp'],
    desc: 'Courtyard Summer Sunny (Dense Foliage)'
  },
  {
    src: '1788454474850.jpg',
    targets: ['bg_courtyard_summer_rainy.webp'],
    desc: 'Courtyard Summer Downpour (Thunderstorm Mist)'
  },
  {
    src: '1788454524676.jpg',
    targets: ['bg_courtyard_autumn_sunny.webp'],
    desc: 'Courtyard Autumn Sunny (Golden & Red Foliage)'
  },
  {
    src: '1788454568198.jpg',
    targets: ['bg_courtyard_autumn_rainy.webp'],
    desc: 'Courtyard Autumn Rainy (Cold Rain & Fallen Leaves)'
  },
  {
    src: '1788454617875.jpg',
    targets: ['bg_courtyard_winter_sunny.webp'],
    desc: 'Courtyard Winter Sunny (Bare Branches & Frost)'
  },
  {
    src: '1788454669958.jpg',
    targets: ['bg_courtyard_winter_rainy.webp'],
    desc: 'Courtyard Winter Snow / Sleet (Snow Dusting)'
  }
];

async function run() {
  for (const item of mappings) {
    const srcPath = path.join(srcDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn('Missing:', srcPath);
      continue;
    }
    const buf = await sharp(srcPath)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toBuffer();

    for (const t of item.targets) {
      fs.writeFileSync(path.join(bgDir, t), buf);
      fs.writeFileSync(path.join(distDir, t), buf);
      console.log(`Saved ${t} (${(buf.length / 1024).toFixed(1)} KB) - ${item.desc}`);
    }

    // backup original
    fs.copyFileSync(srcPath, path.join(backupDir, item.src));
  }

  // clean temp sheet
  const sheet = path.join(srcDir, '_sheet_new9.jpg');
  if (fs.existsSync(sheet)) fs.unlinkSync(sheet);

  console.log('Successfully installed courtyard 4 seasons x 2 weathers!');
}

run().catch(console.error);
