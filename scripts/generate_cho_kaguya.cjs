const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function getApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  return '';
}

const KEY = getApiKey();

const ASSETS = [
  {
    type: 'bg',
    id: 'pancake_exterior',
    filename: 'bg_pancake_exterior.webp',
    aspectRatio: '16:9',
    prompt: "Japanese visual novel anime background of the storefront of 'A Happy Pancake' (幸せのパンケーキ 神戸三宮店) cafe located near Sannomiya Center Gai in Kobe. Charming cafe entrance with a warm wooden sign reading '幸せのパンケーキ A Happy Pancake'. Beside the entrance is a chalkboard menu stand featuring colorful hand-drawn illustrations of three tall, ultra-fluffy soufflé pancakes topped with whipped honey butter and berries, with text 'ふわふわ 焼きたてパンケーキ'. Warm brick and light wood exterior, glass door, paved street, soft pleasant afternoon sunlight. Makoto Shinkai and Kyoto Animation anime visual novel background art style, clean lines, cinematic lighting, inviting atmosphere, no people in foreground, empty wide view."
  },
  {
    type: 'bg',
    id: 'pancake_interior',
    filename: 'bg_pancake_interior.webp',
    aspectRatio: '16:9',
    prompt: "Japanese visual novel anime background of the cozy interior of 'A Happy Pancake' (幸せのパンケーキ) soufflé pancake cafe in Kobe Sannomiya. Warm, airy, modern Japanese cafe with blonde wooden tables, comfortable light-grey fabric chairs, and white brick accents. Soft amber pendant lights hanging from the ceiling. On a wooden table in the cozy corner sits an appetizing plate of three golden, fluffy soufflé pancakes dusted with powdered sugar and topped with melting honey butter, next to a small glass pitcher of maple syrup and a white ceramic teacup. Open kitchen counter visible in the background where pancake griddles steam gently. Soft afternoon sunlight through large windows. Makoto Shinkai and Kyoto Animation anime visual novel aesthetic, crisp details, cozy peaceful atmosphere, empty room view."
  },
  {
    type: 'sprite',
    id: 'easter_iroha',
    filename: 'easter_iroha.jpg',
    aspectRatio: '9:16',
    prompt: "Full-body Japanese anime visual novel character sprite of Sakayori Iroha, a 17-year-old female high school student and dedicated producer. She has straight, neat dark charcoal-black hair with soft bangs framing her face, and calm, earnest, mature dark brown eyes with a gentle, slightly weary, caring expression. She is wearing a neat high school uniform: a dark navy-blue school blazer jacket over a crisp white button-down collared shirt with a simple dark red ribbon tie, a dark pleated school skirt, dark grey tights, and dark brown loafers. She stands in a polite, thoughtful pose, with one hand holding a student planner notebook against her side. Studio Colorido and Kyoto Animation clean anime line art, refined cel shading. STRICT NEGATIVE: ABSOLUTELY NO GREEN ON THE CHARACTER, no green clothing, no green accessories, no green eyes, no green hair. BACKGROUND: A completely flat, seamless, solid bright neon green chroma key background (#00FF00) with zero shadows, zero gradients, zero patterns, perfectly even plain green screen."
  },
  {
    type: 'sprite',
    id: 'easter_kaguya',
    filename: 'easter_kaguya.jpg',
    aspectRatio: '9:16',
    prompt: "Full-body Japanese anime visual novel character sprite of Kaguya, a mysterious energetic celestial teenage girl. She has translucent, waist-length platinum-blonde flowing hair with a prominent bouncing ahoge (single expressive cowlick hair) on the top of her head. She has striking reddish-pink drooping eyes (タレ目) with an energetic, slightly mischievous, joyful expression, cheeks slightly flushed. She is dressed in stylish oversized modern street clothes: an oversized dark charcoal-grey boxy graphic t-shirt with minimalist white cyber-kanji print, dark navy denim shorts underneath, white sports ankle socks, and chunky white and black sneakers. She holds a small dessert fork casually in one hand, looking playful and free-spirited. Studio Colorido anime art style, vibrant cel shading, clean line art. STRICT NEGATIVE: ABSOLUTELY NO GREEN ON THE CHARACTER, no green clothing, no green accessories, no green hair, no green eyes. BACKGROUND: A completely flat, seamless, solid bright neon green chroma key background (#00FF00) with zero shadows, zero gradients, zero patterns, perfectly even plain green screen."
  }
];

function generateImage(prompt, aspectRatio) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(KEY),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 300)}`));
        }
        try {
          const j = JSON.parse(body);
          const part = (j.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
          const d = part && (part.inlineData || part.inline_data);
          if (!d) return reject(new Error('No image in response: ' + body.slice(0, 200)));
          resolve(Buffer.from(d.data, 'base64'));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  const publicBgDir = path.resolve(__dirname, '../public/images/backgrounds');
  const distBgDir = path.resolve(__dirname, '../dist/images/backgrounds');
  const brainDir = path.resolve('C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f');

  for (let i = 0; i < ASSETS.length; i++) {
    const item = ASSETS[i];
    console.log(`\n[${i + 1}/${ASSETS.length}] Generating ${item.id} (${item.type})...`);
    try {
      const rawBuf = await generateImage(item.prompt, item.aspectRatio);
      const brainPath = path.join(brainDir, `${item.id}.jpg`);
      fs.writeFileSync(brainPath, rawBuf);
      console.log(`  -> Saved raw to brain: ${brainPath}`);

      if (item.type === 'bg') {
        const pubPath = path.join(publicBgDir, item.filename);
        const distPath = path.join(distBgDir, item.filename);
        await sharp(rawBuf)
          .resize(1920, 1080, { fit: 'cover' })
          .webp({ quality: 88 })
          .toFile(pubPath);

        if (fs.existsSync(distBgDir)) {
          fs.copyFileSync(pubPath, distPath);
        }
        console.log(`  -> Converted to webp: ${pubPath}`);
      }
    } catch (err) {
      console.error(`  -> Failed ${item.id}:`, err.message);
    }

    if (i < ASSETS.length - 1) {
      console.log('  Waiting 3s before next request...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\nAll assets generated!');
}

run().catch(console.error);
