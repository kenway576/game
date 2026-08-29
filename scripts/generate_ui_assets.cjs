const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'sk_oiPgLvwrPpRJy0ziPiCsl_n3rsqcE8DWfnEhu3J4wis';

const UI_ASSETS = [
  {
    name: 'protagonist_card.jpg',
    size: '1024*1024',
    prompt: 'masterpiece, best quality, ultra-detailed anime character illustration, Persona 5 Joker aesthetic, modern anime game protagonist. A handsome 17-year-old high school boy with wavy black hair, deep intelligent dark eyes, wearing stylish black thin-frame glasses and a sleek navy school blazer uniform with a white collared shirt. He is holding a leather notebook and fountain pen, with a confident, gentle, charismatic slight smile. Soft volumetric sunlight streaming from the window of an old European-style library, floating dust particles, elegant cinematic lighting, highly polished anime key visual.'
  },
  {
    name: 'calendar_header.jpg',
    size: '1280*720',
    prompt: 'masterpiece, best quality, ultra-detailed anime landscape illustration, Makoto Shinkai and Persona 5 aesthetic. A breathtaking panoramic view of Kobe city and Kansai coast: the iconic red Kobe Port Tower, Harborland Ferris wheel, blooming cherry blossom trees on the hill slope, retro green streetcar passing by, azure ocean bay with gentle waves and sparkling lens flare under blue sky with fluffy white clouds. Cinematic lighting, vibrant saturated colors, 16:9 widescreen game UI banner masterpiece.'
  },
  {
    name: 'stat_knowledge.jpg',
    size: '512*512',
    prompt: 'masterpiece, best quality, ultra-detailed game UI emblem icon, Persona 5 aesthetic. An ornate golden antique grimoire book open with glowing celestial star charts, golden feather quill pen floating above, glowing soft blue mystical aura and orbiting constellation rings, sleek dark metallic crest frame, crisp clean render, game asset icon.'
  },
  {
    name: 'stat_guts.jpg',
    size: '512*512',
    prompt: 'masterpiece, best quality, ultra-detailed game UI emblem icon, Persona 5 aesthetic. A fierce roaring lion crest with burning crimson flames, crossed steel daggers, vibrant red lightning sparks, polished obsidian and gold shield frame, bold dynamic composition, game asset icon.'
  },
  {
    name: 'stat_kindness.jpg',
    size: '512*512',
    prompt: 'masterpiece, best quality, ultra-detailed game UI emblem icon, Persona 5 aesthetic. Gentle glowing pink and emerald crystal heart surrounded by blooming sakura blossoms and delicate angel wings, warm golden halo light, soft pastel sparkles, ornate silver filigree crest, game asset icon.'
  },
  {
    name: 'stat_charm.jpg',
    size: '512*512',
    prompt: 'masterpiece, best quality, ultra-detailed game UI emblem icon, Persona 5 aesthetic. A brilliant sparkling prism diamond crystal surrounded by velvet red rose petals, golden theater stage spotlights and glittering champagne sparkles, royal purple and gold crest frame, game asset icon.'
  },
  {
    name: 'stat_proficiency.jpg',
    size: '512*512',
    prompt: 'masterpiece, best quality, ultra-detailed game UI emblem icon, Persona 5 aesthetic. Intricate golden clockwork gears, vintage brass compass and precision craftsman fountain pen, glowing cyan clockwork energy lines, sleek bronze steampunk crest frame, game asset icon.'
  }
];

function post(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let text = '';
      res.on('data', d => text += d);
      res.on('end', () => {
        try { resolve(JSON.parse(text)); } catch (e) { resolve(text); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + API_KEY
      }
    }, res => {
      let text = '';
      res.on('data', d => text += d);
      res.on('end', () => {
        try { resolve(JSON.parse(text)); } catch (e) { resolve(text); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    }).on('error', err => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  const outputDir = path.resolve('public/images/ui');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const item of UI_ASSETS) {
    const targetFile = path.join(outputDir, item.name);
    console.log('\n========================================');
    console.log('Generating UI Asset: ' + item.name + '...');

    try {
      const initRes = await post('https://api.novita.ai/v3/async/qwen-image-txt2img', {
        prompt: item.prompt,
        size: item.size
      });

      if (!initRes.task_id) {
        console.error('Failed to create task for ' + item.name + ':', initRes);
        continue;
      }

      console.log('Task ID: ' + initRes.task_id + '. Waiting for result...');
      let imgUrl = null;

      for (let attempt = 0; attempt < 50; attempt++) {
        await new Promise(r => setTimeout(r, 2500));
        const poll = await get('https://api.novita.ai/v3/async/task-result?task_id=' + initRes.task_id);
        const status = poll.task ? poll.task.status : 'PENDING';
        process.stdout.write('.');

        if (status === 'TASK_STATUS_SUCCEED' && poll.images && poll.images[0]) {
          imgUrl = poll.images[0].image_url;
          console.log('\n[SUCCESS] Image generated for ' + item.name + '!');
          break;
        }

        if (status === 'TASK_STATUS_FAILED') {
          console.error('\n[FAILED] Task failed for ' + item.name + ':', poll.task ? poll.task.reason : 'Unknown');
          break;
        }
      }

      if (imgUrl) {
        console.log('Downloading to ' + targetFile + '...');
        await downloadImage(imgUrl, targetFile);
        const sizeKb = (fs.statSync(targetFile).size / 1024).toFixed(1);
        console.log('Saved ' + item.name + ' successfully! Size: ' + sizeKb + ' KB');
      } else {
        console.error('Timeout generating ' + item.name);
      }
    } catch (err) {
      console.error('Error generating ' + item.name + ':', err.message);
    }
  }

  console.log('\n========================================');
  console.log('ALL UI ASSETS GENERATED SUCCESSFULLY!');
}

run();
