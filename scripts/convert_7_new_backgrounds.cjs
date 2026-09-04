const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const mappings = [
  {
    src: 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\kobe_motomachi_arcade_1788525766919.jpg',
    dest: 'bg_kobe_motomachi_arcade.webp',
    name: '神户元町商店街 (Kobe Motomachi Shopping Arcade)'
  },
  {
    src: 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\kobe_daimaru_settlement_1788525784650.jpg',
    dest: 'bg_kobe_daimaru_settlement.webp',
    name: '神户大丸前·旧居留地仲町通 (Daimaru Kobe & Former Foreign Settlement)'
  },
  {
    src: 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\kobe_ikuta_road_night_1788525804782.jpg',
    dest: 'bg_kobe_ikuta_road_night.webp',
    name: '三宫生田路·东门街夜市 (Sannomiya Ikuta Road & Higashimon-gai Night)'
  },
  {
    src: 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\kitano_slope_foot_dusk_1788525825021.jpg',
    dest: 'bg_kitano_slope_foot_dusk.webp',
    name: '北野住宅区坡道口·海风庄前 (Kitano Residential Slope Foot at Dusk)'
  },
  {
    src: 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\sannomiya_karaoke_room_1788525865679.jpg',
    dest: 'bg_sannomiya_karaoke_room.webp',
    name: '三宫卡拉OK包厢 (Sannomiya Karaoke Box Interior)'
  },
  {
    src: 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\ikuta_shrine_summer_festival_1788525888324.jpg',
    dest: 'bg_ikuta_shrine_summer_festival.webp',
    name: '生田神社夏祭夜景参道 (Ikuta Shrine Summer Festival Night)'
  },
  {
    src: 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f\\kyoto_kamogawa_delta_1788525906696.jpg',
    dest: 'bg_kyoto_kamogawa_delta.webp',
    name: '京都鸭川三角洲跳乌龟石 (Kyoto Kamogawa Delta Stepping Stones)'
  }
];

async function run() {
  const publicDir = path.resolve(__dirname, '../public/images/backgrounds');
  const distDir = path.resolve(__dirname, '../dist/images/backgrounds');

  for (const item of mappings) {
    if (!fs.existsSync(item.src)) {
      console.error(`Source not found: ${item.src}`);
      continue;
    }
    console.log(`Converting ${item.name} -> ${item.dest}...`);
    const pubDest = path.join(publicDir, item.dest);
    const distDest = path.join(distDir, item.dest);

    await sharp(item.src)
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 88 })
      .toFile(pubDest);

    if (fs.existsSync(distDir)) {
      fs.copyFileSync(pubDest, distDest);
    }
    console.log(`Saved: ${pubDest}`);
  }
  console.log('All 7 backgrounds converted successfully!');
}

run().catch(console.error);
