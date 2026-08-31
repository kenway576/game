const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');

function generateGoogleImage(prompt) {
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
              resolve(buffer);
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

const scenes = [
  // 1. 电车靠海窗景（坐电车经过海面）
  {
    webpName: 'bg_jr_train_interior.webp',
    prompt: 'Makoto Shinkai style anime visual novel background, inside a quiet modern Japanese JR express commuter train carriage, looking through the large panoramic train window at the breathtaking sparkling blue ocean of Akashi Strait under bright April spring afternoon sunshine, Rokko green mountains in distance, warm sunlight streaming across the empty train seats, soft reflections on the window glass, lens flare, pristine clean 2D anime linework, high saturation vibrant colors, 16:9 widescreen wallpaper composition, pure scenery, no humans, no text, no watermark.'
  },
  // 2. 主角家里（海风庄201室房间内部）
  {
    webpName: 'bg_umikaze_room_201.webp',
    prompt: 'Makoto Shinkai style anime visual novel background, cozy Japanese 1K retro-modern apartment room interior (Kaifuso 201), warm natural wooden flooring, neat wooden study desk with a classic brass desk lamp and open notebook, tidy bed, an open unpacked travel luggage on the tatami corner, open glass balcony door with sheer white curtains fluttering in the gentle afternoon sea breeze, warm golden sunlight flooding the room, peaceful and nostalgic youth atmosphere, high quality clean anime linework, 16:9 widescreen wallpaper composition, no characters, no text, no watermark.'
  },
  // 3. 从家里看向外面（海风庄201室阳台远眺神户港）
  {
    webpName: 'bg_umikaze_balcony_harbor.webp',
    prompt: 'Makoto Shinkai style anime visual novel background, first-person view looking out from a 2nd floor wooden apartment balcony in Kobe Kitano hillside slope, panoramic scenic overlook of Kobe Port at golden hour sunset, iconic red Kobe Port Tower and illuminated Mosaic Ferris Wheel in the distance, sparkling golden shimmering sea with cargo ships, lush green trees and blooming pink cherry blossom branches framing the balcony view, dramatic sunset clouds with volumetric god rays, breathtaking cinematic anime scenery, 16:9 widescreen wallpaper composition, no characters, no text, no watermark.'
  }
];

async function run() {
  console.log(`Starting generation of 3 core prologue backgrounds for User's script...`);
  
  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const finalWebpPath = path.join(targetDir, sc.webpName);
    console.log(`\n[${i + 1}/${scenes.length}] Generating ${sc.webpName}...`);
    
    let rawBuf = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        rawBuf = await generateGoogleImage(sc.prompt);
        console.log(`  -> Generated raw image successfully (${(rawBuf.length / 1024).toFixed(1)} KB)`);
        break;
      } catch (err) {
        console.error(`  -> [Attempt ${attempt}/3 Failed]:`, err.message);
        await sleep(5000);
      }
    }

    if (!rawBuf) {
      console.error(`  -> CRITICAL: Failed to generate ${sc.webpName}`);
      continue;
    }

    // 标准化裁剪为 16:9 (1280x720) 并导出为超清 WebP
    const meta = await sharp(rawBuf).metadata();
    const targetHeight = Math.round(meta.width * (9 / 16));
    const topOffset = Math.round((meta.height - targetHeight) / 3);

    const webpBuffer = await sharp(rawBuf)
      .extract({ left: 0, top: Math.max(0, topOffset), width: meta.width, height: Math.min(meta.height, targetHeight) })
      .resize(1280, 720, { fit: 'cover' })
      .webp({ quality: 92 })
      .toBuffer();

    fs.writeFileSync(finalWebpPath, webpBuffer);
    console.log(`  -> SUCCESS! Saved ${sc.webpName} as 16:9 WebP (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
    
    await sleep(3500); // 间隔防频控
  }

  console.log('\n=============================================');
  console.log('ALL 3 PROLOGUE SCENES GENERATED & OPTIMIZED!');
  console.log('=============================================');
}

run();
