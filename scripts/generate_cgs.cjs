const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'sk_oiPgLvwrPpRJy0ziPiCsl_n3rsqcE8DWfnEhu3J4wis';

const CHAR_CGS = [
  {
    charId: 'asuka',
    outputFile: 'cg_asuka.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style, Goddess of Victory Nikke art style. A beautiful teenage anime girl with reddish-orange twintails tied with black ribbons and expressive blue eyes. Sitting on a wooden school desk in an empty classroom at golden hour sunset, warm amber sunlight and lens flares illuminating her face and hair. She leans slightly forward towards the viewer, fingers nervously twisting her hair ribbon, biting her lip with a flustered vulnerable tsundere blush, staring directly into the viewer eyes with sparkling pupils. Volumetric lighting, soft skin rendering, rich clothing textures, cinematic depth of field, 16:9 widescreen anime illustration.'
  },
  {
    charId: 'hikari',
    outputFile: 'cg_hikari.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style. A cheerful energetic anime girl with bright blonde hair, orange flower hairpin, and amber eyes. On a sparkling summer beach at twilight sunset, golden waves crashing gently on the shore. Ocean wind blowing her blonde hair across her smiling flushed face, holding a glowing sparkler in one hand and reaching out her other hand towards the viewer with a radiant, loving beaming smile. Volumetric sunset light, glistening sea spray, cinematic depth of field, 16:9 widescreen anime illustration.'
  },
  {
    charId: 'rei',
    outputFile: 'cg_rei.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style. A quiet intellectual anime girl with sleek dark navy hair and red-framed spectacles. Sitting by an open bay window of a cozy observatory library at midnight, deep blue night sky filled with a glowing Milky Way and shooting stars outside. Warm candlelight and cool starlight illuminating her delicate face. She gently lowers her glasses with slender fingers, gazing up at the viewer with an earnest, tender, vulnerable romantic smile and soft blush. Volumetric lighting, soft shadows, 16:9 widescreen anime illustration.'
  },
  {
    charId: 'nao',
    outputFile: 'cg_nao.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style. A lovely childhood friend anime girl with chestnut-brown hair in a side ponytail with a floral scrunchie and warm brown eyes. Wearing a vibrant scarlet goldfish-patterned festival yukata, sitting shoulder to shoulder with the viewer on a traditional wooden engawa porch at night. Distant fireworks bursting in the dark sky reflecting in her sparkling eyes, holding a chilled sweet drink, leaning intimately close with flushed cheeks and a loving, nostalgic smile. 16:9 widescreen anime illustration.'
  },
  {
    charId: 'miyuki',
    outputFile: 'cg_miyuki.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style. An elegant gentle young woman with long cascading snow-white hair and soft emerald-green eyes. In a cozy sunlit apartment sunroom after a soft rain, lush green plants around. She wears a soft cream off-shoulder knit sweater, holding a steaming porcelain cup of tea with both hands, leaning forward to hand it to the viewer with a deeply tender, comforting, affectionate smile and rosy blushing cheeks. Soft glowing atmospheric light, 16:9 widescreen anime illustration.'
  },
  {
    charId: 'inari',
    outputFile: 'cg_inari.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style. An ancient fox deity anime girl with silver-white fox ears, nine fluffy white tails, and glowing crimson-gold eyes. Relaxing on a red lacquered shrine bridge under an enormous glowing full moon, floating spirit embers and falling red maple leaves on water. Holding a golden ceremonial sake cup, her divine nine tails swaying around her, offering a seductive, intoxicating, playful sly smile towards the viewer. Luxurious celestial robes, breathtaking fantasy lighting, 16:9 widescreen anime illustration.'
  },
  {
    charId: 'sora',
    outputFile: 'cg_sora.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style. A sporty tomboy anime girl with short dynamic brown hair, honey skin, and energetic amber eyes. Sitting on the wooden bleachers of an empty gymnasium at sunset, golden sunbeams casting long shadows across the court. She has a white towel draped around her neck, sweat glistening on her collarbone, handing a cold sports drink bottle to the viewer while blushing furiously and trying to look away with an endearing flustered pout. 16:9 widescreen anime illustration.'
  },
  {
    charId: 'maki',
    outputFile: 'cg_maki.jpg',
    prompt: 'masterpiece, best quality, ultra-detailed 2D anime visual novel event CG illustration, Brown Dust 2 art style. A sassy stylish rocker gyaru anime girl with dark purple asymmetrical bob hair and violet eyes. In a backstage dressing room lit by glowing magenta and cyan neon LED lights, resting a cherry red electric guitar on her lap. Leaning in intimately close to the viewer, wearing DJ headphones around her neck, winking playfully with a mischievous, alluring smirk and blushing cheeks. Cyberpunk anime aesthetic, dynamic composition, 16:9 widescreen anime illustration.'
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
  const outputDir = path.resolve('public/images/cg');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const item of CHAR_CGS) {
    const targetFile = path.join(outputDir, item.outputFile);
    console.log('\n========================================');
    console.log(Generating CG for [] -> ...);

    try {
      const initRes = await post('https://api.novita.ai/v3/async/qwen-image-txt2img', {
        prompt: item.prompt,
        size: '1280*720'
      });

      if (!initRes.task_id) {
        console.error(Failed to create task for :, initRes);
        continue;
      }

      console.log(Task created: . Polling for result...);
      let imgUrl = null;

      for (let attempt = 0; attempt < 50; attempt++) {
        await new Promise(r => setTimeout(r, 2500));
        const poll = await get('https://api.novita.ai/v3/async/task-result?task_id=' + initRes.task_id);
        const status = poll.task ? poll.task.status : 'PENDING';
        process.stdout.write('.');

        if (status === 'TASK_STATUS_SUCCEED' && poll.images && poll.images[0]) {
          imgUrl = poll.images[0].image_url;
          console.log(\n[SUCCESS] Image generated for !);
          break;
        }

        if (status === 'TASK_STATUS_FAILED') {
          console.error(\n[FAILED] Task failed for :, poll.task ? poll.task.reason : 'Unknown');
          break;
        }
      }

      if (imgUrl) {
        console.log(Downloading to ...);
        await downloadImage(imgUrl, targetFile);
        console.log(Saved  successfully! Size:  KB);
      } else {
        console.error(Timeout or failure generating );
      }
    } catch (err) {
      console.error(Error generating :, err.message);
    }
  }

  console.log('\n========================================');
  console.log('ALL CGs PROCESSING COMPLETE!');
}

run();
