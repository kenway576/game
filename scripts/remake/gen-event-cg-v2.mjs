// ---------------------------------------------------------
// 🎴 剧情 CG 第二版：只学 P5X，两遍出图（构图 → 精修）
//
//   node scripts/remake/gen-event-cg-v2.mjs --id miyuki1_dinner [--n 2]
//
// 第一版的问题（用户反馈"不精致"）：参考图压到 1600 宽看不到质感；角色卡的平涂被当成画风学；
// 提示里写了邦多利；人物在画面里太小、平视构图；只出一遍 2K。这一版：
//   1. 画风参考 = P5X 壁纸**原分辨率的局部**（脸、头发、衣服、背景的笔触）+ 两张整图（构图和光）
//   2. 角色参考 = 角色卡左边那张半身像，明说"只认长相，别学画法"
//   3. 构图：人物占画面一半以上、倾斜镜头、前景压近
//   4. 第一遍 2K 出构图；第二遍把第一遍的图 + 质感参考一起送回去，4K "按 P5X 的质感重新精绘"
// 输出 .generated/event-cg/<id>/v2_<n>_pass1.png、v2_<n>.png（4K）
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const REF = '.generated/event-cg/v2refs/';
const cost = (id, what, size) => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tevent-cg-v2/${id}\t${what}\tgemini-3-pro-image\t${size}\n`);

const LOOK = `ART STYLE — this must look like an official key-visual illustration from "Persona 5: The Phantom X", exactly like the STYLE REFERENCE images (study the close-up crops carefully):
- refined, mature anime illustration with realistic proportions: a slender oval face, natural-sized eyes (NOT big round moe eyes) with detailed irises and fine lashes, a defined nose bridge, delicate lips;
- very fine, crisp, thin lineart with subtle weight variation; hair drawn as many fine strands with soft painterly shading and sharp thin highlights;
- painterly, softly blended shading on skin and cloth (not flat cel shading), realistic fabric folds and knit texture, materials that read as real (ceramic, wood grain, glass, steam);
- a fully painted, highly detailed background with depth: atmospheric perspective, soft depth of field, bokeh on far lights;
- cinematic lighting: a clear motivated key light, warm/cool colour contrast, glowing light spill, soft bloom, rim light on hair and shoulders, bounce light on the face;
- rich but natural colour, high dynamic range, polished like a high-budget game wallpaper.
Do NOT copy any character, face, outfit, logo, text or watermark from the style references. NO text, NO logos, NO watermark, NO signature anywhere in the image.`;

const SCENES = {
  miyuki1_dinner: {
    face: 'miyuki_face.jpg', outfit: 'public/images/characters/miyuki/cardigan_neutral.webp',
    styleFull: ['cafe_full.jpg', 'street_full.jpg'],
    who: 'Miyuki: a gentle young woman in her early twenties with softly wavy, shoulder-length silver-white hair, one thin braid on the left side, a small pink flower hair clip, pale lavender eyes, a kind face. She wears an oversized cream cable-knit cardigan with wooden buttons over a pale pink blouse with a frilled round collar.',
    scene: `SCENE ("Dinner in 202"): night, a small Japanese apartment dining kitchen. Miyuki leans across the little wooden table toward the viewer, holding a steaming bowl of miso soup out to them with both hands, smiling warmly with a faint blush — she has just said "I made too much again".
COMPOSITION: an intimate medium close-up from the viewer's seat, camera slightly tilted (dutch angle). Miyuki fills most of the frame, framed from the waist up, her face in the upper-right third. In the blurred foreground: the edge of the table with a pair of matching rice bowls and two pairs of chopsticks on rests, a cup of green tea with rising steam. Behind her, softly out of focus: the kitchen with a hanging copper pendant lamp, pans, a rice cooker, a shopping list on the fridge, and a window showing Kobe's night skyline with the red Port Tower.
LIGHT: the warm orange pendant lamp directly above-left is the key light, glowing on her silver hair and the steam; cool deep-blue night light from the window rims her right side; warm bounce light on her face from the soup bowl and table.`
  }
};

const ID = arg('id'), N = Number(arg('n', 1));
const sc = SCENES[ID];
if (!sc) { console.error('没有这一幕：' + ID); process.exit(1); }
const DIR = `.generated/event-cg/${ID}`;
fs.mkdirSync(DIR, { recursive: true });
const outfitRef = path.join(DIR, '_v2_outfit.jpg');
if (!fs.existsSync(outfitRef)) await sharp(sc.outfit).flatten({ background: '#e6e6e6' }).resize({ height: 1600 }).jpeg({ quality: 92 }).toFile(outfitRef);

const crops = ['cafe_face.jpg', 'sea_face.jpg', 'street_face.jpg', 'beach_face.jpg'].map(f => REF + f);
const pass1Parts = () => [
  { text: 'STYLE REFERENCE — close-up crops at full resolution (study the rendering quality: faces, eyes, hair strands, fabric, background brushwork):' },
  ...crops.map(imagePart),
  { text: 'STYLE REFERENCE — full illustrations (study composition, depth and lighting):' },
  ...sc.styleFull.map(f => imagePart(REF + f)),
  { text: 'CHARACTER REFERENCE — use ONLY for who she is (face shape, hair colour and style, eye colour, accessories). It is a simplified model sheet: do NOT copy its flat drawing style.' },
  imagePart(REF + sc.face),
  { text: 'OUTFIT REFERENCE — the clothes she wears in this scene (again: copy the design, not the drawing style):' },
  imagePart(outfitRef),
  { text: `${LOOK}\n\nCHARACTER: ${sc.who}\n\n${sc.scene}` }
];

for (let i = 0; i < N; i++) {
  const n = fs.readdirSync(DIR).filter(f => /^v2_\d+\.png$/.test(f)).length + 1;
  const p1 = path.join(DIR, `v2_${n}_pass1.png`);
  let t0 = Date.now();
  const r1 = await generate({ parts: pass1Parts(), aspectRatio: '16:9', imageSize: '2K' });
  cost(ID, 'pass1', '2K');
  if (!r1.images.length) { console.log('第一遍没拿到图：' + r1.finishReason); continue; }
  await sharp(r1.images[0]).png().toFile(p1);
  console.log(`${p1}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  // 第二遍：同一张图，按 P5X 的质感重新精绘，4K
  t0 = Date.now();
  const r2 = await generate({
    parts: [
      { text: 'STYLE REFERENCE — target rendering quality (full-resolution crops from official "Persona 5: The Phantom X" key visuals):' },
      ...crops.map(imagePart),
      { text: 'CHARACTER REFERENCE (identity only):' },
      imagePart(REF + sc.face),
      { text: 'THE IMAGE TO REFINE:' },
      imagePart(p1),
      { text: `Repaint THE IMAGE TO REFINE as a final, masterpiece-quality key visual at much higher detail, matching the rendering quality of the style references.
Keep exactly the same composition, camera angle, pose, expression, outfit, props, lighting direction and colours — do not move or add anything.
Upgrade only the rendering: finer and crisper lineart; a more refined, mature face with realistic proportions and detailed eyes (identity must still match the character reference); individual hair strands with soft painterly shading and thin sharp highlights; real fabric and knit texture; realistic materials (ceramic glaze, wood grain, steam, glass); a richer, painterly, deeper background with atmospheric depth and bokeh; stronger, more cinematic light with bloom and rim light.
NO text, NO logos, NO watermark.` }
    ],
    aspectRatio: '16:9', imageSize: '4K'
  });
  cost(ID, 'pass2', '4K');
  if (!r2.images.length) { console.log('第二遍没拿到图：' + r2.finishReason); continue; }
  const out = path.join(DIR, `v2_${n}.png`);
  await sharp(r2.images[0]).png().toFile(out);
  console.log(`${out}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
