const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.resolve('.incoming-gdrive');
const bgDir = path.resolve('public/images/backgrounds');
const distDir = path.resolve('dist/images/backgrounds');
const backupDir = path.resolve('.backup-originals/backgrounds');

[bgDir, distDir, backupDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const map = [
  {
    src: '1788453525717.jpg',
    targets: ['bg_kaisei_cafeteria_hall.webp', 'bg_kaisei_cafeteria.webp'],
    desc: 'Kaisei Student Cafeteria Hall & Meal Counter'
  },
  {
    src: '1788453602223.jpg',
    targets: ['bg_kaisei_courtyard_rain.webp', 'bg_school_courtyard_rain.webp'],
    desc: 'School Courtyard in Rain (Asuka emotional scene)'
  },
  {
    src: '1788453647768.jpg',
    targets: ['bg_kaisei_courtyard_spring.webp', 'bg_school_courtyard_spring.webp', 'bg_school_courtyard.webp'],
    desc: 'School Courtyard in Spring Sun with Cherry Blossom'
  },
  {
    src: '1788453695954.jpg',
    targets: ['bg_kaisei_art_room.webp', 'bg_art_club_room.webp'],
    desc: 'Kaisei Art Club Room with Harbor Painting & Easels'
  },
  {
    src: '1788453743680.jpg',
    targets: ['bg_kaisei_gym_interior.webp', 'gym.webp'],
    desc: 'Kaisei Main Gymnasium Interior'
  },
  {
    src: '1788453793345.jpg',
    targets: ['bg_kaisei_music_room.webp'],
    desc: 'Kaisei Music Room with Grand Piano & Portraits'
  }
];

async function run() {
  for (const item of map) {
    const srcPath = path.join(dir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn('Source file missing:', srcPath);
      continue;
    }
    const buf = await sharp(srcPath)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toBuffer();

    for (const target of item.targets) {
      fs.writeFileSync(path.join(bgDir, target), buf);
      fs.writeFileSync(path.join(distDir, target), buf);
      console.log(`Saved ${target} (${(buf.length / 1024).toFixed(1)} KB) - ${item.desc}`);
    }

    // backup
    fs.copyFileSync(srcPath, path.join(backupDir, item.src));
  }

  // clean check_new6 sheet
  const temp = path.join(dir, '_sheet_new6.jpg');
  if (fs.existsSync(temp)) fs.unlinkSync(temp);

  console.log('Successfully converted and installed 6 new high-res backgrounds!');
}

run().catch(console.error);
