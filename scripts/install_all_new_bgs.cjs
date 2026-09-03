const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bgMap = [
  // 1-7 校园日常实景系列
  { src: '1788390073991.jpg', name: 'bg_school_gym_storage.webp', desc: 'School Gym Equipment Storage' },
  { src: '1788390128529.jpg', name: 'bg_school_entrance_lockers.webp', desc: 'School Entrance Shoe Lockers (Getabako)' },
  { src: '1788390174821.jpg', name: 'bg_school_infirmary.webp', desc: 'School Infirmary (Hokenshitsu)' },
  { src: '1788390225201.jpg', name: 'bg_kaisei_cafeteria_sunlight.webp', desc: 'Kaisei Cafeteria Sunlit Courtyard View' },
  { src: '1788390276408.jpg', name: 'bg_school_science_lab.webp', desc: 'School Science Chemistry Lab' },
  { src: '1788390318966.jpg', name: 'bg_school_bicycle_parking.webp', desc: 'School Bicycle Parking at Sunset' },
  { src: '1788390364611.jpg', name: 'bg_school_faculty_office.webp', desc: 'School Faculty Teachers Office' },

  // 8-12 序章关键补全与海星/北野核心地标
  { src: '1788390835259.jpg', name: 'bg_umikaze_apartment_exterior.webp', desc: 'Umikaze Apartment Exterior (Kaifuso)' },
  { src: '1788390900462.jpg', name: 'bg_sannomiya_shopping_arcade.webp', desc: 'Sannomiya Center Gai Shopping Arcade & Takoyaki Stand' },
  { src: '1788390951492.jpg', name: 'bg_kaisei_intl_salon.webp', desc: 'Kaisei Academy International Exchange Salon' },
  { src: '1788391019018.jpg', name: 'bg_kaisei_classroom_morning.webp', desc: 'Kaisei Academy Class 2-B Morning Classroom' },
  { src: '1788391060125.jpg', name: 'bg_kitano_kazamidori_square.webp', desc: 'Kitano Weathercock House & Plaza' },

  // 13-15 须磨海滨与防波堤垂钓
  { src: '1788402837129.jpg', name: 'bg_suma_beach_coast.webp', desc: 'Suma Beach Panoramic Coast & Breakwater' },
  { src: '1788402839657.jpg', name: 'bg_suma_beach_coast_alt.webp', desc: 'Suma Beach Coast Alternate' },
  { src: '1788402882344.jpg', name: 'bg_suma_fishing_pier.webp', desc: 'Suma Breakwater Fishing Pier with Rods & Sodas' },

  // 16-17 商店街百元店
  { src: '1788402943341.jpg', name: 'bg_hundred_yen_shop_exterior.webp', desc: '100-Yen Shop Arcade Storefront' },
  { src: '1788402995024.jpg', name: 'bg_hundred_yen_shop_interior.webp', desc: '100-Yen Shop Interior Shelves & Aisles' },

  // 18-19 元町复古吃茶店
  { src: '1788403051141.jpg', name: 'bg_retro_kissaten_exterior.webp', desc: 'Motomachi Retro Kissaten Storefront & Display' },
  { src: '1788403092392.jpg', name: 'bg_retro_kissaten_interior.webp', desc: 'Retro Kissaten Velvet Booth with Melon Soda Float' },

  // 20-21 沿海平交道
  { src: '1788403180898.jpg', name: 'bg_seaside_railroad_crossing.webp', desc: 'Coastal Railroad Crossing with Falling Sakura' },
  { src: '1788403234117.jpg', name: 'bg_seaside_railroad_crossing_train.webp', desc: 'Coastal Railroad Crossing with Approaching Train' },

  // 22-23 王子动物园与樱花摩天轮
  { src: '1788404248072.jpg', name: 'bg_oji_zoo_entrance.webp', desc: 'Kobe Oji Zoo Sakura Entrance Gate' },
  { src: '1788404295427.jpg', name: 'bg_oji_zoo_ferris_wheel.webp', desc: 'Oji Zoo Retro Ferris Wheel above Cherry Blossoms' },

  // 24-25 滩温泉
  { src: '1788404363106.jpg', name: 'bg_nada_onsen_exterior.webp', desc: 'Natural Hot Spring Nada Onsen Storefront' },
  { src: '1788404399920.jpg', name: 'bg_nada_onsen_interior.webp', desc: 'Nada Onsen Indoor Steaming Stone Bath' },

  // 26-27 有马温泉
  { src: '1788404463043.jpg', name: 'bg_arima_onsen_kin_no_yu.webp', desc: 'Arima Onsen Kin no Yu & Steaming Footbath' },
  { src: '1788404503264.jpg', name: 'bg_arima_onsen_street_slope.webp', desc: 'Arima Onsen Historic Yumotozaka Slope Ryokan Street' },

  // 28-29 六甲山掬星台千万美元夜景
  { src: '1788404548498.jpg', name: 'bg_rokko_kikuseidai_night_view.webp', desc: 'Mount Rokko Kikuseidai Luminescent Path & Night View' },
  { src: '1788404596963.jpg', name: 'bg_rokko_kikuseidai_pavilion.webp', desc: 'Kikuseidai Viewing Pavilion & Telescope at Night' },

  // 30-31 料理系统：海风庄201厨房与料理台
  { src: '1788405027568.jpg', name: 'bg_umikaze_room_kitchen.webp', desc: 'Umikaze Room 201 Cozy Kitchenette' },
  { src: '1788405073517.jpg', name: 'bg_cooking_counter_bento.webp', desc: 'Cooking Counter Preparing Bento & Ginger Pork' },

  // 32-33 六甲道「ラーメン荘 歴史を刻め」
  { src: '1788405134990.jpg', name: 'bg_ramen_rekishi_exterior.webp', desc: 'Rokkomichi Ramen Rekishi wo Kizame Blue Storefront' },
  { src: '1788405204005.jpg', name: 'bg_ramen_rekishi_bowl.webp', desc: 'Rekishi wo Kizame Jiro-Style Mountain Ramen on Red Counter' },

  // 34-35 神户牛铁板烧与元町百年洋食格里尔一平
  { src: '1788405261264.jpg', name: 'bg_kobe_beef_teppanyaki.webp', desc: 'Sannomiya Kobe Beef Teppanyaki Teppan Grill' },
  { src: '1788405323186.jpg', name: 'bg_grill_ippei_motomachi.webp', desc: 'Motomachi Legendary Grill Ippei Beef Cutlet Dinner' }
];

async function installAll() {
  const bgDir = path.resolve('public/images/backgrounds');
  const distDir = path.resolve('dist/images/backgrounds');
  const backupDir = path.resolve('.backup-originals/backgrounds');

  [bgDir, distDir, backupDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  console.log(`Starting conversion of ${bgMap.length} backgrounds...`);

  for (let i = 0; i < bgMap.length; i++) {
    const item = bgMap[i];
    const srcPath = path.join(bgDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[Skip] File not found: ${srcPath}`);
      continue;
    }

    const inputBuf = fs.readFileSync(srcPath);
    const webpBuf = await sharp(inputBuf)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toBuffer();

    // Write to public & dist
    const targetPublic = path.join(bgDir, item.name);
    const targetDist = path.join(distDir, item.name);
    fs.writeFileSync(targetPublic, webpBuf);
    fs.writeFileSync(targetDist, webpBuf);

    // Backup original jpg to .backup-originals and remove from public
    const backupPath = path.join(backupDir, item.src);
    fs.copyFileSync(srcPath, backupPath);
    fs.unlinkSync(srcPath);

    console.log(`[${i + 1}/${bgMap.length}] ${item.src} -> ${item.name} (${(webpBuf.length / 1024).toFixed(1)} KB) - ${item.desc}`);
  }

  // Also clean up _sheet_*.jpg if present
  ['build_contact_sheet.cjs'].forEach(f => {});
  const tempSheets = fs.readdirSync(bgDir).filter(f => f.startsWith('_sheet_'));
  tempSheets.forEach(f => fs.unlinkSync(path.join(bgDir, f)));

  console.log('All 35 backgrounds converted, installed, and archived cleanly!');
}

installAll().catch(console.error);
