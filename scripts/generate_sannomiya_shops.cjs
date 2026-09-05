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

const SHOPS = [
  {
    id: 'bookoff_exterior',
    filename: 'bg_bookoff_exterior.webp',
    prompt: "Japanese visual novel anime background of the storefront of a BOOK OFF second-hand bookstore located inside the bustling Kobe Sannomiya Center Gai shopping arcade (三宮センター街). The storefront features the iconic bold blue and yellow sign with authentic Japanese text 'BOOK・OFF', '本を売ってください', '本・CD・DVD・GAME', 'ブックオフ'. Outside on the paved promenade of the shopping street are rolling wire discount bargain carts and stands packed with used manga books and bunko paperbacks with yellow 110-yen price tags. Modern high glass-vaulted ceiling of the shopping arcade overhead letting in daytime light. Anime visual novel background art style in the aesthetic of Makoto Shinkai and Kyoto Animation, vibrant colors, clean lines, cinematic lighting, no people in foreground, empty wide angle street view."
  },
  {
    id: 'bookoff_interior',
    filename: 'bg_bookoff_interior.webp',
    prompt: "Japanese visual novel anime background of the interior of a BOOK OFF second-hand bookstore in Kobe Sannomiya. A deep perspective down a clean aisle lined with tall metal bookshelves packed with thousands of neatly organized used manga volumes, bunko paperbacks, light novels, and retro video game cases. Category hanging signs overhead reading '少年コミック', '少女コミック', '文庫本', '100円〜200円コーナー'. Bright clean fluorescent ceiling lights reflecting on the polished linoleum floor. Blue plastic shopping baskets stacked near the aisle entrance. Cozy and organized otaku bookstore atmosphere, anime background art style, Makoto Shinkai aesthetic, detailed and crisp, empty room view."
  },
  {
    id: 'surugaya_exterior',
    filename: 'bg_surugaya_exterior.webp',
    prompt: "Japanese visual novel anime background of the storefront of Surugaya (駿河屋 神戸三宮店) hobby and anime goods specialty shop inside Sannomiya Center Plaza shopping mall in Kobe. Distinctive dark blue and white signage with the red and white logo reading '駿河屋', 'フィギュア・アニメグッズ・トレカ・レトロゲーム 高価買取'. Glass showcase display cabinets outside along the wall filled with colorful anime figures, plastic Gundam models, and rare collectible trading cards. A neat row of capsule toy Gachapon machines along the entrance. Indoor commercial shopping corridor, bright anime lighting, vibrant otaku atmosphere, Makoto Shinkai and Kyoto Animation aesthetic, detailed, no people in foreground, wide view."
  },
  {
    id: 'surugaya_interior',
    filename: 'bg_surugaya_interior.webp',
    prompt: "Japanese visual novel anime background of the interior of Surugaya (駿河屋) anime and hobby goods store in Sannomiya. Packed but neatly arranged aisles with illuminated glass display cabinets showcasing anime scale figures, Nendoroids, and prize figurines. Wire grid racks hung with hundreds of transparent plastic blister bags containing character acrylic stands, anime keychains, rubber straps, and badges. Overhead category signs in Japanese reading 'フィギュア', 'キャラクターグッズ', 'レトロゲーム', 'TCG トレーディングカード'. Colorful, dense, treasure-hunting anime hobby store atmosphere, Makoto Shinkai style, crisp details, empty room view."
  },
  {
    id: 'uniqlo_exterior',
    filename: 'bg_uniqlo_exterior.webp',
    prompt: "Japanese visual novel anime background of the grand multi-story flagship storefront of UNIQLO (ユニクロ) located in Kobe Sannomiya Center Gai shopping arcade. Prominent glowing square red and white UNIQLO logos (both English 'UNIQLO' and Japanese 'ユニクロ'). Huge clear glass display windows showing fashionable mannequins dressed in clean, stylish Japanese casual wear (cashmere knits, Ultra Light Down jackets, fleece, and graphic tees). Modern high-ceiling glass arcade roof of Sannomiya shopping street above, clean paved promenade. Modern Japanese minimalist aesthetic, Makoto Shinkai and Kyoto Animation anime visual novel background art style, bright, inviting, no people in foreground, wide view."
  },
  {
    id: 'uniqlo_interior',
    filename: 'bg_uniqlo_interior.webp',
    prompt: "Japanese visual novel anime background of the interior of a flagship UNIQLO (ユニクロ) apparel store in Kobe Sannomiya. A spacious, bright, minimalist modern retail floor with light wood floors and clean white walls. Low wooden display tables and tall wall shelves neatly organized with colorful, meticulously folded stacks of casual clothing (UT graphic tees, sweaters, linen shirts, jeans). Mannequins styled in coordinated clean seasonal outfits. Overhead directional signs reading 'MEN', 'WOMEN', 'UT COLLECTION'. Bright warm recessed ceiling lighting, peaceful and stylish shopping atmosphere, Makoto Shinkai anime aesthetic, crisp lines, empty wide angle view."
  }
];

function generateImage(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        imageConfig: {
          aspectRatio: '16:9'
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
  const publicDir = path.resolve(__dirname, '../public/images/backgrounds');
  const distDir = path.resolve(__dirname, '../dist/images/backgrounds');
  const brainDir = path.resolve('C:/Users/adm/.gemini/antigravity/brain/5aeade40-c8de-4530-87d0-a4afd6a5657f');

  for (let i = 0; i < SHOPS.length; i++) {
    const shop = SHOPS[i];
    console.log(`\n[${i + 1}/${SHOPS.length}] Generating ${shop.id} (${shop.filename})...`);
    try {
      const rawBuf = await generateImage(shop.prompt);
      const pubPath = path.join(publicDir, shop.filename);
      const distPath = path.join(distDir, shop.filename);
      const brainPath = path.join(brainDir, `${shop.id}.jpg`);

      fs.writeFileSync(brainPath, rawBuf);

      await sharp(rawBuf)
        .resize(1920, 1080, { fit: 'cover' })
        .webp({ quality: 88 })
        .toFile(pubPath);

      if (fs.existsSync(distDir)) {
        fs.copyFileSync(pubPath, distPath);
      }

      console.log(`  -> Saved: ${pubPath}`);
    } catch (err) {
      console.error(`  -> Failed ${shop.id}:`, err.message);
    }

    if (i < SHOPS.length - 1) {
      console.log('  Waiting 3s before next request...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\nAll shop backgrounds processed!');
}

run().catch(console.error);
