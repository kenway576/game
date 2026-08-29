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
        return reject(new Error('Status: ' + res.statusCode));
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

const scenes = [
  {
    name: 'bg_kobe_harbor_dusk.jpg',
    prompt: 'masterpiece, anime visual novel background, breathtaking Kobe Harbor at golden hour dusk, red Kobe Port Tower standing tall, Harborland Mosaic Ferris Wheel lit up, sparkling sea with reflection, cherry blossom trees on the coast, Makoto Shinkai style, high quality, sharp focus, clean lines, vibrant colors, 4k wallpaper, no humans'
  },
  {
    name: 'bg_kitano_sakura_slope.jpg',
    prompt: 'masterpiece, anime visual novel background, Kobe Kitano Ijinkan slope, traditional European style brick houses with ivy, stone paved upward slope road, falling pink cherry blossom petals, spring morning sunshine, Makoto Shinkai style, highly detailed, vibrant colors, 4k wallpaper, no humans'
  },
  {
    name: 'bg_kyoto_inari_torii.jpg',
    prompt: 'masterpiece, anime visual novel background, Kyoto Fushimi Inari shrine thousand red torii gates corridor, dappled golden sunlight through green forest trees, ancient stone lanterns, mystical atmosphere, Kyoto Animation style, high quality, clean line art, 4k wallpaper, no humans'
  },
  {
    name: 'bg_tatami_tea_garden.jpg',
    prompt: 'masterpiece, anime visual novel background, elegant traditional Japanese tatami tea ceremony room, sliding shoji paper doors open to a serene Zen rock and bamboo garden with red maple leaves, soft morning sunbeams, cozy and tranquil, highly detailed anime background, 4k wallpaper, no humans'
  },
  {
    name: 'bg_kobe_jazz_livehouse.jpg',
    prompt: 'masterpiece, anime visual novel background, retro underground jazz livehouse in Kobe, wooden bar counter, vintage red brick wall, warm neon stage lights and spotlights, drum set and guitar amplifiers on cozy wooden stage, atmospheric lighting, anime aesthetic, 4k wallpaper, no humans'
  },
  {
    name: 'bg_koshien_stadium_sunset.jpg',
    prompt: 'masterpiece, anime visual novel background, iconic Hanshin Koshien baseball stadium exterior covered with green ivy, empty stadium bleachers under a dramatic golden hour orange sunset sky, youthful nostalgic atmosphere, high quality anime scenery, 4k wallpaper, no humans'
  }
];

async function run() {
  console.log(`Starting generation of ${scenes.length} authentic Kansai game backgrounds...`);
  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const dest = path.join(targetDir, sc.name);
    console.log(`[${i + 1}/${scenes.length}] Generating ${sc.name}...`);
    const encoded = encodeURIComponent(sc.prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${100 + i * 37}`;
    
    try {
      await downloadImage(url, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`  -> Saved ${sc.name} (${size} KB) successfully!`);
    } catch (e) {
      console.error(`  -> Failed to generate ${sc.name}:`, e.message);
    }
    await sleep(2500); // 间隔防频控
  }
  console.log('ALL BACKGROUND GENERATION COMPLETE!');
}

run();
