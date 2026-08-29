const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP Status: ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const baseAnimeStyle = "masterpiece, anime visual novel background, Makoto Shinkai style, Persona 5 key visual atmosphere, BanG Dream high saturation card art aesthetic, cinematic lighting, volumetric god rays, reflective surfaces, clean detailed linework, vibrant rich colors, 4k wallpaper, 16:9, no humans";

const backgroundList = [
  // --- Round 1: 神户名胜与都市浪漫 ---
  {
    name: 'bg_kobe_meriken_park.jpg',
    key: 'meriken_park',
    prompt: `Kobe Meriken Park seaside promenade, giant white BE KOBE monument, wooden boardwalk by the sparkling ocean, seagulls flying, fluffy cumulus clouds in bright blue summer sky, lens flare, ${baseAnimeStyle}`
  },
  {
    name: 'bg_kobe_mosaic_ferris_night.jpg',
    key: 'mosaic_night',
    prompt: `Kobe Harborland Mosaic open-air shopping terrace at night, illuminated colorful giant Ferris wheel, romantic warm lantern lights, glittering sea reflection, cozy romantic date atmosphere, ${baseAnimeStyle}`
  },
  {
    name: 'bg_rokko_night_view.jpg',
    key: 'rokko_night',
    prompt: `Mt. Rokko Tenran Observatory overlooking Kobe and Osaka Bay 10-million-dollar night view, vast sea of glittering city lights below, deep indigo starry night sky with Milky Way, crisp mountain air, ${baseAnimeStyle}`
  },
  {
    name: 'bg_arima_onsen_street.jpg',
    key: 'arima_onsen',
    prompt: `Arima Onsen retro hot spring village street, traditional wooden hot spring ryokan with red lanterns, ancient red arched bridge over steaming rocky river, brilliant autumn red maple leaves, ${baseAnimeStyle}`
  },
  {
    name: 'bg_ikuta_shrine_main.jpg',
    key: 'ikuta_shrine',
    prompt: `Kobe Ikuta Shrine sacred main red vermilion hall, giant ancient green cedar trees, stone paved courtyard with falling cherry blossom petals, gentle morning sunbeams, peaceful spiritual sanctuary, ${baseAnimeStyle}`
  },
  {
    name: 'bg_nankinmachi_chinatown.jpg',
    key: 'nankinmachi',
    prompt: `Kobe Nankinmachi Chinatown ornate red Chinese gateway and vibrant street, hanging glowing red lanterns in twilight, steaming street food stalls, cobblestone ground with reflections, lively bustling atmosphere, ${baseAnimeStyle}`
  },

  // --- Round 2: 海星学园与唯美校园角落 ---
  {
    name: 'bg_kaisei_library_sunlight.jpg',
    key: 'school_library',
    prompt: `Grand classical high school library, towering dark mahogany bookshelves filled with antique books, golden afternoon sunbeams piercing through stained glass arched windows, floating dust motes, quiet scholarly atmosphere, ${baseAnimeStyle}`
  },
  {
    name: 'bg_kaisei_music_room.jpg',
    key: 'music_room',
    prompt: `School music room overlooking the bay, shiny black grand piano by the open window, fluttering white sheer curtains, warm golden hour sunset glow, acoustic wood panels on wall, nostalgic emotional vibe, ${baseAnimeStyle}`
  },
  {
    name: 'bg_school_gate_sakura.jpg',
    key: 'school_gate',
    prompt: `Prestigious high school wrought iron gate on a steep slope, massive blooming sakura cherry blossom trees forming a pink archway, falling pink petals in morning breeze, blue spring sky, ${baseAnimeStyle}`
  },
  {
    name: 'bg_art_club_room.jpg',
    key: 'art_room',
    prompt: `School art club studio atelier, wooden easels with colorful canvas paintings, white plaster bust statues, paint tubes on wooden tables, dramatic sunset light pouring in from large atelier windows, ${baseAnimeStyle}`
  },
  {
    name: 'bg_kaisei_cafeteria.jpg',
    key: 'school_terrace',
    prompt: `Modern school cafeteria rooftop terrace with parasols and white tables overlooking Kobe blue harbor, sparkling sea view, bright midday sun, vibrant youthful high school campus, ${baseAnimeStyle}`
  },
  {
    name: 'bg_school_courtyard_rain.jpg',
    key: 'courtyard_rain',
    prompt: `School courtyard garden under gentle spring rain, rain ripples on stone puddles reflecting green maple trees, wooden covered corridor, cool moody atmosphere, poetic Makoto Shinkai rain aesthetic, ${baseAnimeStyle}`
  },

  // --- Round 3: 关西四季盛典与名胜 ---
  {
    name: 'bg_osaka_dotonbori_neon.jpg',
    key: 'dotonbori',
    prompt: `Osaka Dotonbori canal at night, giant dazzling neon billboards and illuminated signs reflecting on dark water, bustling bridge promenade, electric cyberpunk-meets-traditional-Japan night energy, ${baseAnimeStyle}`
  },
  {
    name: 'bg_kyoto_kiyomizu_autumn.jpg',
    key: 'kiyomizu_stage',
    prompt: `Kyoto Kiyomizu-dera wooden grand stage overlooking a vast mountain ocean of glowing red and fiery orange autumn foliage, mystical evening purple twilight sky, breathtaking panorama, ${baseAnimeStyle}`
  },
  {
    name: 'bg_kobe_luminarie_illumination.jpg',
    key: 'luminarie',
    prompt: `Kobe Luminarie winter festival of light, majestic towering Italian light arches with thousands of golden and white glowing lanterns forming a glowing cathedral tunnel, light snow falling, magical winter confession night, ${baseAnimeStyle}`
  },
  {
    name: 'bg_coastal_train_platform.jpg',
    key: 'coastal_platform',
    prompt: `Seaside retro train station platform overlooking the vast ocean, vintage green and beige local train stopped at platform, clear blue sea with white waves below, coastal breeze, summer vacation nostalgia, ${baseAnimeStyle}`
  }
];

async function runMassiveGeneration() {
  console.log(`====================================================`);
  console.log(`Starting generation of ${backgroundList.length} Makoto Shinkai / P5 style backgrounds...`);
  console.log(`====================================================`);

  let successCount = 0;

  for (let i = 0; i < backgroundList.length; i++) {
    const item = backgroundList[i];
    const dest = path.join(targetDir, item.name);
    console.log(`\n[${i + 1}/${backgroundList.length}] Generating: ${item.name} (${item.key})...`);

    const encodedPrompt = encodeURIComponent(item.prompt);
    const seed = 500 + i * 43;
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}`;

    let downloaded = false;
    for (let retry = 0; retry < 3; retry++) {
      try {
        await downloadImage(url, dest);
        const stats = fs.statSync(dest);
        if (stats.size > 10000) {
          console.log(`  -> [SUCCESS] Saved ${item.name} (${(stats.size / 1024).toFixed(1)} KB)`);
          downloaded = true;
          successCount++;
          break;
        } else {
          console.log(`  -> [WARN] File too small (${stats.size}b), retrying...`);
        }
      } catch (err) {
        console.error(`  -> [RETRY ${retry + 1}/3] Error:`, err.message);
        await sleep(3000);
      }
    }

    if (!downloaded) {
      console.error(`  -> [FAILED] Could not download ${item.name} after 3 retries.`);
    }

    await sleep(2500); // 间隔 2.5s 防限流
  }

  console.log(`\n====================================================`);
  console.log(`BATCH GENERATION COMPLETED: ${successCount}/${backgroundList.length} backgrounds saved!`);
  console.log(`====================================================`);
}

runMassiveGeneration();
