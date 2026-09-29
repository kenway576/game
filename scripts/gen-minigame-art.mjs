/**
 * 🎨 小游戏用的背景和立绘（Gemini 图像模型）
 *
 * 【为什么每一张都带参考图】
 * 纯文生图，哪怕 prompt 写得一模一样，画风也会漂。这游戏已经有几十张背景、
 * 几十个 NPC，新图一张不对味就会很扎眼。所以：
 *   · 背景：拿现有的同一地点（或同一栋楼）的图当参考，让模型"换个时间/角度再画一次"
 *   · 立绘：拿一个现有 NPC 当画风参考，只换人
 *
 * 流水线：Gemini 出图 → 原图存 raw/ → 背景裁 16:9 缩 1280×720 / 立绘去白底、按 alpha 裁边、
 *         高度缩到 1100 → WebP → out/
 *
 * ⚠️ 只写 .generated/minigame-art/，绝不碰 public/。看过之后再手动搬。
 *
 * 用法：
 *   node scripts/gen-minigame-art.mjs                   # 全部，每张 2 个候选
 *   node scripts/gen-minigame-art.mjs --only kingyo     # 名字里含 kingyo 的
 *   node scripts/gen-minigame-art.mjs --n 3 --model gemini-2.5-flash-image
 *
 * 需要 .env.local 里的 GEMINI_API_KEY（不带 VITE_，不进前端打包）。
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PNG } from 'pngjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const ONLY = arg('only', '');
const N = Number(arg('n', 2));
const MODEL = arg('model', 'gemini-3-pro-image');
const FALLBACK_MODEL = 'gemini-2.5-flash-image';

const OUT = path.resolve('.generated/minigame-art');
const RAW = path.join(OUT, 'raw');
fs.mkdirSync(RAW, { recursive: true });

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter(l => /^[A-Z_]+=/.test(l))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).trim()]; })
);
const KEY = env.GEMINI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY missing in .env.local'); process.exit(1); }

const BG = 'public/images/backgrounds';
const CH = 'public/images/characters';

// 跟现有背景同一句画风描述（scripts/generate_massive_bgs.cjs 里那句的精简版）
const BG_STYLE = 'anime visual novel background, Makoto Shinkai style, cinematic lighting, volumetric light, clean detailed linework, rich saturated colors, 16:9 widescreen, no people, no characters, absolutely no text, no letters, no signage writing';
const SPRITE_RULES = 'Full body from head to shoes, standing, facing the viewer, whole figure inside the frame with margin, on a pure flat white background (#FFFFFF), no shadow on the ground, no background objects, no text, no watermark. Match the reference image exactly in line weight, cel shading, color saturation, eye style and proportions — it must look like it was drawn by the same artist for the same game.';

const JOBS = [
  // ---------------- 背景 ----------------
  {
    name: 'bg_ikuta_shrine_summer_night',
    kind: 'bg',
    ref: `${BG}/bg_ikuta_shrine_gate.webp`,
    prompt: `The reference image is Ikuta Shrine in Sannomiya, Kobe, by day. Redraw THIS SAME PLACE from the same viewpoint on a hot summer festival night (natsu matsuri): keep the vermilion torii, the stone lanterns and the vermilion fence and shrine buildings, but it is now deep indigo night. Rows of glowing red and white paper chochin lanterns are strung overhead along the stone approach. Along both sides of the approach stand yatai festival stalls with striped awnings: a goldfish-scooping stall with shallow light-blue tubs of water, a yakisoba griddle with rising steam, a shaved-ice stall. Warm orange lantern light pools on the paving stones. Beyond the shrine trees, the lit windows of Sannomiya office buildings. Summer, green leaves, no cherry blossoms. The stone pillar may keep its carved name, but no other text anywhere. ${BG_STYLE}`
  },
  {
    name: 'bg_school_sahoushitsu',
    kind: 'bg',
    ref: `${BG}/bg_kaisei_classroom_morning.webp`,
    prompt: `The reference image is a classroom of this game's school (a private high school in Kobe). Draw a DIFFERENT room in the SAME school and the same art style: the sahoushitsu — a traditional Japanese tatami room used by the tea ceremony and competitive karuta clubs. Twelve clean tatami mats, sliding shoji screens glowing with warm late-afternoon sunlight, a tokonoma alcove with a hanging scroll (blank, no writing) and a small ikebana arrangement, a stack of flat zabuton cushions in one corner, a low wooden table pushed against the wall, a polished wooden corridor visible through a half-open fusuma. The middle of the tatami floor is open and empty. Quiet, focused atmosphere, dust motes floating in golden light. ${BG_STYLE}`
  },
  {
    name: 'bg_kingyo_tank',
    kind: 'bg',
    // 不给参考图：拿生田神社当参考时，模型会把灯笼画进水里，橙色的倒影跟金鱼撞色
    prompt: `Perfectly top-down orthographic view looking straight down at the water inside a large rectangular shallow goldfish-scooping tub. The pale sky-blue plastic bottom fills almost the entire frame; only a thin light-blue plastic rim is visible along the very edges. Clear water with gentle ripples and soft white-gold caustic light patterns on the bottom, evenly lit. ABSOLUTELY NO reflections of lanterns, no orange or red shapes anywhere, no fish, no bubbles, no leaves, no objects, no hands. Calm, clean, cool blue tones only. Painterly anime texture. ${BG_STYLE}`
  },
  // ---------------- 立绘 ----------------
  {
    name: 'npc_kingyo_oyaji',
    kind: 'sprite',
    ref: `${CH}/npc_ramen_oyaji.webp`,
    prompt: `A new character: a cheerful Kansai festival stall owner in his fifties who runs the goldfish-scooping stall at Ikuta Shrine's summer festival. Tanned skin, short greying hair under a twisted white hachimaki headband, big friendly grin with laugh lines, navy blue happi coat over a white undershirt, a dark haramaki belly band, rolled-up sleeves, wooden geta sandals. He holds a round paper goldfish-scooping poi in one hand and a small clear plastic bag with one orange goldfish in water in the other. ${SPRITE_RULES}`
  },
  {
    name: 'npc_minh',
    kind: 'sprite',
    ref: `${CH}/npc_kenta.webp`,
    prompt: `A new character for the same school: Minh, a 16-year-old first-year exchange student from Vietnam who arrived in Japan only a month ago. Slim, neat short black hair with a side part, warm brown eyes, slightly nervous but friendly smile. He wears EXACTLY the same school uniform as the reference boy (navy blazer with the same gold crest, white shirt, dark grey trousers, brown loafers), worn very neatly with the top button done up and a navy tie. He hugs a thick textbook to his chest with both arms, a few colourful sticky-note tabs poking out of its pages. The book cover is a plain solid dark green with NO title, NO letters and NO writing of any kind. ${SPRITE_RULES}`
  },
  {
    name: 'npc_tourist_backpacker',
    kind: 'sprite',
    ref: `${CH}/npc_bus_obaa.webp`,
    prompt: `A new character: a young European backpacker tourist woman in her mid twenties visiting Kobe. Blonde hair in a ponytail, light freckles, a canvas sun hat, a light khaki outdoor jacket over a t-shirt, cargo shorts, hiking sneakers, a large travel backpack on her back. She holds a folded paper city map in one hand and a smartphone in the other, with a puzzled but friendly expression, as if about to ask someone for directions. ${SPRITE_RULES}`
  },
  {
    name: 'npc_tourist_taiwan',
    kind: 'sprite',
    ref: `${CH}/npc_bus_obaa.webp`,
    prompt: `A new character: a young Taiwanese tourist woman in her early twenties on her first trip to Kobe. Short chestnut bob haircut, round glasses, a loose pastel summer blouse and a pleated midi skirt, white sneakers, a small crossbody bag, pulling a small carry-on suitcase with one hand while holding up a smartphone showing a map in the other, slightly lost, hopeful expression. ${SPRITE_RULES}`
  }
];

// ---------------- Gemini ----------------
const toPngB64 = async (file) => {
  // 参考图统一压成白底 PNG：透明底的立绘直接喂进去，模型会把透明当成黑色
  const buf = await sharp(file).flatten({ background: '#ffffff' }).png().toBuffer();
  return buf.toString('base64');
};

async function generate(job, model) {
  const parts = [];
  if (job.ref) parts.push({ inlineData: { mimeType: 'image/png', data: await toPngB64(job.ref) } });
  parts.push({ text: job.prompt });
  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: job.kind === 'bg' ? '16:9' : '9:16' }
    }
  };
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(KEY)}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  const j = await r.json();
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
  const part = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!part) throw new Error(`no image in response: ${JSON.stringify(j).slice(0, 300)}`);
  return Buffer.from(part.inlineData.data, 'base64');
}

// ---------------- 后处理 ----------------
async function processBg(raw, dest) {
  await sharp(raw).resize(1280, 720, { fit: 'cover', position: 'attention' }).webp({ quality: 90 }).toFile(dest);
}

// 从边缘泛洪去白底：只清掉跟画布边缘连通的近白像素，衣服上的白色不受影响
async function processSprite(raw, dest) {
  const pngBuf = await sharp(raw).ensureAlpha().png().toBuffer();
  const png = PNG.sync.read(pngBuf);
  const { width: W, height: H, data } = png;
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return Math.min(r, g, b) >= 232 && Math.max(r, g, b) - Math.min(r, g, b) <= 28;
  };
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
  for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (!isBg(p * 4)) continue;
    data[p * 4 + 3] = 0;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W);
    if (y < H - 1) stack.push(p + W);
  }
  // 去白边：贴着透明区、又偏白的一圈像素做半透明，免得人物周围一道白线
  for (let pass = 0; pass < 2; pass++) {
    const clear = new Uint8Array(W * H);
    for (let p = 0; p < W * H; p++) if (data[p * 4 + 3] === 0) clear[p] = 1;
    for (let p = 0; p < W * H; p++) {
      if (clear[p]) continue;
      const x = p % W, y = (p / W) | 0;
      const nearClear = (x > 0 && clear[p - 1]) || (x < W - 1 && clear[p + 1]) || (y > 0 && clear[p - W]) || (y < H - 1 && clear[p + W]);
      if (!nearClear) continue;
      const i = p * 4;
      const lum = Math.min(data[i], data[i + 1], data[i + 2]);
      if (lum >= 205) data[i + 3] = Math.round(data[i + 3] * 0.35);
    }
  }
  const cleaned = PNG.sync.write(png);
  await sharp(cleaned).trim({ threshold: 1 }).resize({ height: 1100 }).webp({ quality: 90, alphaQuality: 100 }).toFile(dest);
}

// ---------------- main ----------------
const sleep = ms => new Promise(r => setTimeout(r, ms));
const jobs = JOBS.filter(j => !ONLY || j.name.includes(ONLY));
console.log(`${jobs.length} jobs × ${N} candidates, model ${MODEL}`);

for (const job of jobs) {
  for (let c = 1; c <= N; c++) {
    const tag = `${job.name}_${c}`;
    let raw = null;
    for (const model of [MODEL, FALLBACK_MODEL]) {
      try {
        raw = await generate(job, model);
        console.log(`✓ ${tag} (${model})`);
        break;
      } catch (e) {
        console.log(`✗ ${tag} (${model}): ${e.message}`);
        await sleep(2000);
      }
    }
    if (!raw) continue;
    const rawPath = path.join(RAW, `${tag}.png`);
    fs.writeFileSync(rawPath, raw);
    const dest = path.join(OUT, `${tag}.webp`);
    try {
      if (job.kind === 'bg') await processBg(raw, dest); else await processSprite(raw, dest);
      console.log(`  → ${path.relative(process.cwd(), dest)}`);
    } catch (e) {
      console.log(`  ! post-process failed: ${e.message}`);
    }
    await sleep(1500);
  }
}
console.log('done');
