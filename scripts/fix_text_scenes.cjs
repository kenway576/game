const https = require('https');
const fs = require('fs');
const path = require('path');

const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');

function generateGoogleImage(prompt, destPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    });

    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(key),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(body);
            const part = json.candidates[0].content.parts.find(p => p.inlineData);
            if (part && part.inlineData) {
              const buffer = Buffer.from(part.inlineData.data, 'base64');
              fs.writeFileSync(destPath, buffer);
              resolve(buffer.length);
            } else {
              reject(new Error('No inlineData in parts'));
            }
          } catch (e) {
            reject(new Error('JSON Parse Error: ' + e.message));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 250)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const fixList = [
  {
    name: 'bg_school_gate_sakura.jpg',
    prompt: 'Makoto Shinkai anime visual novel background, prestigious Kaisei high school main wrought iron gate on a gentle uphill slope, massive blooming pink sakura cherry blossom trees forming a natural pink canopy arch, falling cherry petals in spring morning breeze, golden morning sunbeams, clean stone paved road, highly detailed anime scenery, 16:9 widescreen wallpaper, completely clean background without any text, no letters, no characters, no words, no signs, no logos, no watermark.'
  },
  {
    name: 'bg_koshien_stadium_sunset.jpg',
    prompt: 'Makoto Shinkai anime visual novel background, iconic Hanshin Koshien baseball stadium exterior covered with thick green ivy vines, vintage red brick arches, dramatic golden hour orange and purple sunset sky, nostalgic youth sports atmosphere, highly detailed anime scenery, 16:9 widescreen wallpaper, completely clean background without any text, no letters, no words, no signs, no numbers, no logos, no watermark, no characters.'
  }
];

async function runFix() {
  console.log('Regenerating School Gate and Koshien without any text...');
  for (let i = 0; i < fixList.length; i++) {
    const item = fixList[i];
    const dest = path.join(targetDir, item.name);
    console.log(`[${i + 1}/${fixList.length}] Generating clean ${item.name}...`);
    try {
      const size = await generateGoogleImage(item.prompt, dest);
      console.log(`  -> SUCCESS: Saved clean ${item.name} (${(size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`  -> FAILED ${item.name}:`, e.message);
    }
    await sleep(2500);
  }
  console.log('Done!');
}

runFix();
