// ---------------------------------------------------------
// 🎴 剧情 CG 第三版：邦多利卡面画风，按分镜表批量出图
//
//   node scripts/remake/gen-event-cg-v3.mjs --id hikari1 [--n 2]
//   node scripts/remake/gen-event-cg-v3.mjs --all [--n 1] [--jobs 3]     # 分镜表里还没出过图的都跑
//
// 分镜表 = .generated/event-cg/plan.json（plan-event-cg.mjs 读剧本生成，人工改过）。
// 用户定的方向：继续用 Gemini，画风改成「BanG Dream! 少女乐团派对」的卡面——精致、细节多、光影丰富。
// 第二版试过的"P5X 质感 + 4K 精修"提升不了渲染，这里不再做第二遍；靠构图和光的设计取胜：
// 人物要大、镜头要有角度、光要有明确的来源和冷暖对比。
// 参考图：角色卡（长相的唯一标准）+ 这一幕那套衣服的立绘。不再给 P5X 壁纸，免得两种画风打架。
// 输出 .generated/event-cg/<id>/b<N>.png（2K，16:9）+ 预览 .generated/event-cg/preview3/<id>_b<N>.jpg
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
import { CARDS } from './cards.mjs';
import { IDENTITY_EXTRA } from './outfits.mjs';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const PLAN = JSON.parse(fs.readFileSync('.generated/event-cg/plan.json', 'utf8'));
const PREVIEW = '.generated/event-cg/preview3';
fs.mkdirSync(PREVIEW, { recursive: true });

const STYLE = `ART STYLE — the official card illustration style of "BanG Dream! Girls Band Party!" (its special, trained-rank card art): a polished, bright, premium Japanese mobile-game illustration, masterpiece quality, extremely detailed.
- clean, confident anime lineart, lines tinted with colour where light hits; large luminous gem-like eyes with layered irises and sparkling catchlights; glossy hair with bright highlight bands and fine individual strands; soft blush on the cheeks;
- refined cel shading blended with soft gradients, two-tone shadows tinted warm or cool by the light, crisp specular highlights on hair, eyes, lips, fabric, metal and glass; clothes with real folds, seams, buttons and texture;
- a fully painted, richly detailed background full of small story props, with depth: foreground elements, atmospheric perspective, depth of field and bokeh;
- dazzling, motivated lighting: a clear key light, a contrasting coloured rim light outlining the girls, bloom and glow around light sources, light rays, floating sparkles or particles that suit the scene (petals, snow, dust in the light, sparks, spray);
- vivid, saturated but harmonious colour; the girls' faces are the brightest, most beautiful part of the image.
The player is the camera and is never drawn (at most a hand or sleeve at the very edge). Every prop appears once — no duplicated or floating objects; hands have five fingers.
The girls must match their CHARACTER REFERENCE exactly (face, hairstyle, hair colour, eye colour, hair accessories, ears/tails) and wear exactly the clothes in their OUTFIT REFERENCE. Do not copy the plain grey background or the flat standing pose of the references.
Papers, notebooks, screens and signs show only soft, unreadable marks — never real words or numbers. School scenes take place in a modern Japanese high school (concrete buildings, sliding classroom doors), not a temple.
NO text, NO letters, NO logos, NO watermark, NO signature, NO UI, NO speech bubbles anywhere in the image.`;

// 出图时额外强调的地方（第一批里画偏了的）
const CG_EXTRA = {
  sora: 'Her skin is only LIGHTLY sun-kissed — a fair Japanese skin tone with a faint golden warmth, exactly as light as in her reference, NOT dark or brown. Soft girlish face with long lashes.'
};
const cardOf = c => [`public/images/character_cards/${c}/school_blazer_remake.webp`, `public/images/character_cards/${c}/cardigan_remake.webp`].find(f => fs.existsSync(f));
const spriteOf = (c, o) => {
  const d = `public/images/characters/${c}/`;
  const tries = o === 'school' ? ['school_neutral', 'neutral'] : [`${o}_neutral`, 'neutral'];
  return tries.map(t => d + t + '.webp').find(f => fs.existsSync(f));
};
const small = async (f, w, dir) => {
  const out = path.join(dir, '_ref_' + path.basename(path.dirname(f)) + '_' + path.basename(f).replace(/\.[a-z]+$/i, '.jpg'));
  if (!fs.existsSync(out)) await sharp(f).flatten({ background: '#e6e6e6' }).resize({ width: w, withoutEnlargement: true }).jpeg({ quality: 90 }).toFile(out);
  return out;
};

async function render(id, n) {
  const sc = PLAN[id];
  const dir = `.generated/event-cg/${id}`;
  fs.mkdirSync(dir, { recursive: true });
  const parts = [];
  const who = [];
  for (const { id: c, outfit } of sc.chars) {
    const card = CARDS.find(x => x.id === c);
    parts.push({ text: `CHARACTER REFERENCE for ${c} (identity: face, hair, eyes, accessories):` }, imagePart(await small(cardOf(c), 1800, dir)));
    parts.push({ text: `OUTFIT REFERENCE for ${c} (the clothes she wears in this scene):` }, imagePart(await small(spriteOf(c, outfit), 1000, dir)));
    who.push(`- ${card.identity}${IDENTITY_EXTRA[c] ? ' ' + IDENTITY_EXTRA[c] : ''}${CG_EXTRA[c] ? ' ' + CG_EXTRA[c] : ''}`);
  }
  parts.push({ text: `${STYLE}\n\nCHARACTERS:\n${who.join('\n')}\n\nSCENE: ${sc.scene}\n\nLIGHT: ${sc.light}\n\nCAMERA: ${sc.camera}\n\nWide 16:9 event CG.` });

  for (let i = 0; i < n; i++) {
    const k = fs.readdirSync(dir).filter(f => /^b\d+\.png$/.test(f)).length + 1;
    const t0 = Date.now();
    let r;
    try { r = await generate({ parts, aspectRatio: '16:9', imageSize: '2K' }); }
    catch (e) { console.log(`${id} 出错：${e.message.slice(0, 160)}`); continue; }
    fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tevent-cg-v3/${id}\tgemini-3-pro-image\t2K\n`);
    if (!r.images.length) { console.log(`${id} 没拿到图：${r.finishReason} ${JSON.stringify(r.raw?.promptFeedback || {})} ${r.text?.slice(0, 160) || ''}`); continue; }
    const out = path.join(dir, `b${k}.png`);
    await sharp(r.images[0]).png().toFile(out);
    await sharp(r.images[0]).resize({ width: 1600 }).jpeg({ quality: 88 }).toFile(path.join(PREVIEW, `${id}_b${k}.jpg`));
    console.log(`${out}  ${((Date.now() - t0) / 1000).toFixed(0)}s  ${sc.titleZh}`);
  }
}

const N = Number(arg('n', 1));
if (arg('all')) {
  const ids = Object.keys(PLAN).filter(id => !fs.existsSync(`.generated/event-cg/${id}`) || !fs.readdirSync(`.generated/event-cg/${id}`).some(f => /^b\d+\.png$/.test(f)));
  const JOBS = Number(arg('jobs', 3));
  console.log(`要出 ${ids.length} 幕 × ${N}`);
  let next = 0;
  await Promise.all(Array.from({ length: JOBS }, async () => { while (next < ids.length) await render(ids[next++], N); }));
} else {
  for (const id of String(arg('id')).split(',')) {
    if (!PLAN[id]) { console.error('分镜表里没有：' + id); continue; }
    await render(id, N);
  }
}
