// ---------------------------------------------------------
// 🎴 剧情事件 CG（专属剧情 / 多人事件 / 恋爱事件）
//
//   node scripts/remake/gen-event-cg.mjs --id hikari3_harbor [--n 2]
//   node scripts/remake/gen-event-cg.mjs --list
//
// 画风：用户壁纸文件夹（D:\壁纸\壁纸，《女神异闻录：夜幕魅影》P5X 的宣传插画）+ 邦多利（BanG Dream! 少女乐团派对）卡面。
// 模型同时看三类图：
//   · 画风参考：几张壁纸（按场景挑相近的：海边、夜景、室内……）——只学画法、光影、构图、配色
//   · 角色参考：重制后的角色卡（长相的唯一标准）+ 这一幕穿的那套衣服的立绘
//   · 文字：这一幕发生了什么（从剧本里摘的）
// 输出：.generated/event-cg/<id>/v<N>.png（2K，16:9），满意了再装进 public/images/cg/
// 用的是 gemini-3-pro-image（走 Vertex），按张收费。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const WALL = 'D:/壁纸/壁纸/';
// 壁纸里挑出来的画风参考（按场景用途分组）
const W = {
  beach: '1fb5d3584442e5164541e91c274dc99e1606210274.jpg',     // 海之家，烈日，多人
  sea: '804a3edf37976c81084922a1ca8a95661606210274.jpg',       // 海边礁石，清透的水
  night: '5d564fd6ad44a350b771a046c09ba6161606210274.jpg',     // 夜景烟火，仰拍，多人
  cafe: '61a69e22dc111e7dc549a0d9cbf2d6a11606210274.jpg',      // 室内，暖光，静物
  street: 'cf78f23a05ed52922a0d17631b820f8e1606210274.jpg',    // 日常街道，晴天
  nightbeach: 'ff9ab027aa7f9ae53b3d7a51624e66a81606210274.jpg' // 夜晚海滩，灯串，多人
};
const card = c => [`public/images/character_cards/${c}/school_blazer_remake.webp`, `public/images/character_cards/${c}/cardigan_remake.webp`].find(f => fs.existsSync(f));
const sprite = (c, f) => `public/images/characters/${c}/${f}.webp`;

const STYLE = `ART STYLE — match the STYLE REFERENCE images (official key-visual illustrations from "Persona 5: The Phantom X"), blended with the bright, sparkling card-art look of "BanG Dream! Girls Band Party":
- a masterpiece-level, highly detailed modern anime key visual, the kind printed as an official wallpaper;
- refined semi-realistic anime rendering: crisp fine lineart, soft painterly shading with rich gradients, glossy detailed hair with bright highlight bands, luminous expressive eyes;
- cinematic, physically convincing lighting: a clear key light, strong warm-and-cool colour contrast, rim light separating the characters from the background, bloom and light rays where the light source is, reflections and bounce light that tint skin and clothes;
- rich, saturated but harmonious colour, deep shadows and bright highlights (high dynamic range);
- a dynamic camera: a slightly tilted or low/high angle, strong perspective, depth of field, foreground elements framing the shot;
- a fully rendered, densely detailed background environment (not blurred into nothing), with small story props.
Do NOT copy any character, outfit, logo, text or watermark from the style references. NO text, NO logos, NO watermark, NO signature, NO UI anywhere in the image.`;

// 每一幕：谁、穿什么、在哪儿、什么光、发生了什么
const SCENES = {
  hikari3_harbor: {
    titleZh: '二年目の海', chars: [['hikari', 'school_neutral']], style: ['sea', 'street'],
    text: `SCENE (from the story "The Sea, Second Year"): Kobe harbour at golden hour, late spring. Hikari — the cheerful blonde exchange student with a high side ponytail, daisy hair clips and amber eyes, in her navy school blazer uniform — leans with both forearms on the old iron railing of Meriken Park, turned back over her shoulder toward the viewer. She has just told the viewer she is going home in March and there is no second year for her. Her smile is bright but her eyes are glistening; the sea wind lifts her long ponytail and loose strands across the low sun.
Behind her: the sparkling sea, the red lattice Kobe Port Tower and the white Maritime Museum roof catching the sunset, gulls, a ferry trail. Low warm sun behind her right shoulder: strong golden rim light on her hair, lens bloom, long shadows, the sea glittering orange and blue. A bittersweet, beautiful, unforgettable moment. Wide 16:9 composition, Hikari from the thighs up on the right third, the railing leading the eye into the harbour.`
  },
  inari3_snow: {
    titleZh: '人の時間', chars: [['inari', 'knit_neutral']], style: ['cafe', 'night'],
    text: `SCENE (from the story "Human Time"): the first snow of the year in Kobe, six in the morning, at Ikuta Shrine. Not a single footprint on the approach. Inari — the thousand-year-old fox goddess with very long orange-red hair, upright fox ears, golden eyes, a golden knotted-cord ornament with teal tassels, and nine huge fluffy golden-orange tails with cream tips — sits alone on the wooden steps of the vermilion main hall, wearing her modern black oversized chunky knit sweater and short beige skirt (as in the outfit reference). An old hand-bound ledger of names lies open on her knees at the last page, with one empty line. She looks up at the viewer who has just walked in through the torii, a small, quiet, almost-tearful smile. Snowflakes rest on her hair, ears and tails.
Lighting: soft blue-violet dawn, the first pale gold sunlight breaking through the snowfall from the side, warm lantern glow on the vermilion pillars, cold blue shadows in the snow, glittering falling snow in the light. Hushed, sacred, tender. Wide 16:9, low angle from the approach, the steps and pillars framing her, her tails fanned across the steps.`
  },
  miyuki1_dinner: {
    titleZh: '二〇二号室の夕飯', chars: [['miyuki', 'cardigan_neutral']], style: ['cafe', 'street'],
    text: `SCENE (from the story "Dinner in 202"): a small, cosy Japanese apartment kitchen-dining room at night. Miyuki — the kind older neighbour in her early twenties with softly wavy silver-white hair, one thin side braid, a pink flower hair clip and pale lavender eyes, in her cream cable-knit cardigan over a pale pink frilled blouse — leans over the small dining table, ladling miso soup into a bowl for the viewer, smiling warmly, a faint blush. On the table: steaming rice, nikujaga, tamagoyaki, pickles — and everything in matching PAIRS: two bowls, two cups, two pairs of chopsticks on rests. A shopping list on the fridge, a rice cooker, plants on the windowsill, the city lights of Kobe through the window behind her.
Lighting: a warm orange pendant lamp over the table, soft steam glowing in the light, cool blue night through the window, warm bounce light on her face and hair. Homely, gentle, a little lonely. Wide 16:9, a slightly high angle from the viewer's seat across the table, the food in the foreground.`
  },
  group_halloween: {
    titleZh: '北野坂のハロウィン', chars: [['hikari', 'school_neutral'], ['asuka', 'neutral'], ['inari', 'school_neutral'], ['maki', 'school_neutral'], ['nao', 'neutral']], style: ['night', 'nightbeach'],
    text: `SCENE (special event "Halloween on Kitano-zaka"): Halloween night on the steep Kitano-zaka slope in Kobe, among the Western-style ijinkan houses decorated with pumpkins, purple and orange string lights and paper bats. Five girls from the class in Halloween costumes, posing together for the viewer's camera with lots of energy:
- Hikari (blonde high side ponytail, daisy clips, amber eyes) as a cheerful witch with a big pointed hat, waving a candy bag, in the centre, jumping;
- Asuka (long crimson twin tails, crimson eyes) as a proud vampire in a black-and-red cape, arms crossed, pretending not to enjoy it, slight blush;
- Inari (long orange-red hair, real fox ears and nine fluffy tails) dressed as… a fox spirit, holding a fox mask beside her face, sly grin — "I didn't even need a costume";
- Maki (pink messy short twin tails, purple cat-ear headphones, small fang) as a devil with little horns and a pitchfork, making a peace sign at the camera;
- Nao (long chestnut hair in a side ponytail, brown eyes) as a pumpkin-themed fairy, laughing, holding a carved jack-o'-lantern.
Faces, hair colours and hairstyles must match the character reference sheets exactly.
Lighting: deep indigo night sky with a big full moon and a few fireworks over the harbour far below, warm orange lantern and pumpkin light from below, purple string lights, strong colourful rim light on everyone, sparkles of confetti. Dynamic low-angle wide shot looking up the slope, strong perspective, festive and exciting. 16:9.`
  }
};

if (arg('list')) { for (const [k, v] of Object.entries(SCENES)) console.log(k, v.titleZh, v.chars.map(c => c[0]).join('+')); process.exit(0); }
const ID = arg('id');
// --look p5x：画风更偏 P5X（半写实厚涂、强明暗、电影感）；默认 mix = P5X + 邦多利各半
const LOOK = arg('look', 'mix');
const P5X = `ART STYLE — closely match the STYLE REFERENCE images: official key-visual illustrations from "Persona 5: The Phantom X":
- semi-realistic, mature anime rendering with painterly soft shading, NOT flat cel shading: refined realistic facial proportions, detailed glossy eyes and lips, subtle skin gradients with warm subsurface tones;
- dramatic cinematic lighting with strong chiaroscuro: a bright key light, deep rich shadows, saturated coloured light (golden sun, neon, lanterns) wrapping around the figure, strong rim light, light shafts, bloom, lens flare;
- dense, near-photographic detail in the environment (materials, reflections, weathering), like a high-budget game key visual;
- a dynamic, slightly dutch-angled camera with strong perspective and foreground framing elements;
- vivid, high-contrast, magazine-cover colour grading.
Do NOT copy any character, outfit, logo, text or watermark from the style references. NO text, NO logos, NO watermark, NO signature, NO UI anywhere in the image.`;
const N = Number(arg('n', 1));
const sc = SCENES[ID];
if (!sc) { console.error('没有这一幕：' + ID); process.exit(1); }

const DIR = `.generated/event-cg/${ID}`;
fs.mkdirSync(DIR, { recursive: true });
// 参考图缩小一点再送（壁纸原图 4K，没必要）
const small = async (f, w = 1600) => {
  const out = path.join(DIR, '_ref_' + path.basename(f).replace(/\.[a-z]+$/i, '.jpg'));
  if (!fs.existsSync(out)) await sharp(f).resize({ width: w, withoutEnlargement: true }).flatten({ background: '#e6e6e6' }).jpeg({ quality: 90 }).toFile(out);
  return out;
};

const parts = [{ text: 'STYLE REFERENCE images (copy only the drawing, lighting, colour and composition style):' }];
for (const k of sc.style) parts.push(imagePart(await small(WALL + W[k])));
parts.push({ text: 'CHARACTER REFERENCE images (copy faces, hair, eyes, body proportions; the outfit is shown by the outfit references):' });
for (const [c, f] of sc.chars) {
  parts.push(imagePart(await small(card(c), 1800)));
  parts.push(imagePart(await small(sprite(c, f), 1000)));
}
parts.push({ text: `${LOOK === 'p5x' ? P5X : STYLE}\n\n${sc.text}` });

for (let i = 0; i < N; i++) {
  const n = fs.readdirSync(DIR).filter(f => /^v\d+/.test(f) && f.endsWith('.png')).length + 1;
  const t0 = Date.now();
  const r = await generate({ parts, aspectRatio: '16:9', imageSize: '2K' });
  fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tevent-cg/${ID}\tgemini-3-pro-image\t2K\n`);
  if (!r.images.length) { console.log(`没拿到图：${r.finishReason} ${r.text?.slice(0, 200)}`); continue; }
  const out = path.join(DIR, `v${n}${LOOK === 'p5x' ? '_p5x' : ''}.png`);
  await sharp(r.images[0]).png().toFile(out);
  console.log(`${out}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
