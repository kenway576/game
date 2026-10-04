// ---------------------------------------------------------
// 🪪 立绘重制：按统一画风生成角色设定卡
//
// 角色卡是后面所有立绘的"形象标准"：半身特写 + 正面 / 侧面 / 背面全身。
// 模型同时看两类图：
//   · 画风参考（art/style_refs/，用户自己生成的图）——只学画法，不学人和衣服
//   · 角色参考（旧角色卡或旧立绘）——只学长相和衣服，不学画法
// 旧角色卡是简单平涂，直接拿它当唯一参考，模型会连画法一起抄，所以要分开说清楚。
//
// 用法：
//   node scripts/gen-character-card.mjs --ref public/images/character_cards/asuka/school_blazer.jpg \
//     --out .generated/remake/cards/asuka_school_blazer.png \
//     --identity "..." --outfit "..." [--style a.png,b.png] [--size 4K]
//
// 用的是 gemini-3-pro-image，按张收费：一次只跑一张。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from './lib/gemini.mjs';
import { STYLE } from './lib/spriteStyle.mjs';
import { CARDS } from './remake/cards.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
// --char asuka：从 scripts/remake/cards.mjs 取这个角色的设定（推荐用法）。命令行参数可以覆盖。
const SPEC = arg('char') ? CARDS.find(c => c.id === arg('char')) : null;
if (arg('char') && !SPEC) { console.error(`cards.mjs 里没有 ${arg('char')}`); process.exit(1); }
const REFS = String(arg('ref', SPEC?.ref ?? '')).split(',').filter(Boolean);
const STYLE_REFS = String(arg('style', 'art/style_refs/uniform_blonde_drills.png,art/style_refs/uniform_silver_cape.png')).split(',').filter(Boolean);
const OUT = arg('out', SPEC ? `.generated/remake/cards/${SPEC.id}_${SPEC.outfit}.png` : undefined);
const IDENTITY = arg('identity', SPEC?.identity ?? '');
const OUTFIT = arg('outfit', SPEC?.uniform ?? '');
const SIZE = arg('size', '4K');
if (!OUT) { console.error('用法：--char <id> 或 --ref <角色参考[,更多]> --out <输出.png> [--identity] [--outfit] [--style a,b] [--size 4K]'); process.exit(1); }
if (fs.existsSync(OUT) && !process.argv.includes('--force')) { console.error(`${OUT} 已存在，不覆盖（要重做加 --force）`); process.exit(1); }

const PROMPT_HEAD = `You will create a professional character model sheet.

The STYLE REFERENCE images show the exact drawing and colouring style to use: their lineart density, line quality, hair rendering, eye rendering, shading and colour treatment. Copy that rendering style as closely as possible.
Do NOT copy anything else from the style references: not the characters, faces, hairstyles, hair colours, outfits, accessories, poses or body types.

The CHARACTER REFERENCE images show who to draw: copy the face, hairstyle, hair colour and signature accessories. Where the text below specifies eye colour, hair or clothing, the TEXT wins. The outfit is defined ONLY by the OUTFIT text below; if the reference wears different clothes, ignore them.
The character reference is drawn in a simpler, flatter style. Do NOT copy its drawing style; redraw this character entirely in the style of the STYLE REFERENCE images.`;

// 不给角色参考图时（--ref 留空）：长相和衣服全靠文字，画法只从画风参考里学。
// 旧角色卡画风太强，会把画法一起带过来，这是绕开它的办法。
const PROMPT_HEAD_NOREF = `You will create a professional character model sheet of an ORIGINAL character described in text below.

The STYLE REFERENCE images show the exact drawing and colouring style to use: their lineart density, line quality, hair rendering, eye rendering, shading and colour treatment. Copy that rendering style as closely as possible, at the same level of detail.
Do NOT copy anything else from the style references: not the characters, faces, hairstyles, hair colours, outfits, accessories, poses or body types. The character must look exactly as described in the text.`;

const PROMPT_TAIL = `CHARACTER: ${IDENTITY}
OUTFIT: ${OUTFIT}

${STYLE}

LAYOUT (a clean model sheet, wide 16:9 canvas, four views side by side, all the same character at the same scale and proportions):
1. Left: a waist-up portrait, slightly larger, with a pose and expression that show the character's personality; hands clearly away from the face.
2. Full body, front view: standing straight and relaxed, facing the viewer, arms hanging naturally with a small gap from the torso, calm expression.
3. Full body, side view (profile facing left).
4. Full body, back view.
All full-body views show the whole figure from the top of the hair to the soles of the shoes. Consistent design across all four views.
Plain flat light grey (#E6E6E6) background, no text, no labels, no colour swatches, no props, no effects.`;

const run = async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const head = REFS.length ? PROMPT_HEAD : PROMPT_HEAD_NOREF;
  const parts = [{ text: head }];
  STYLE_REFS.forEach((f, i) => { parts.push({ text: `STYLE REFERENCE ${i + 1}:` }, imagePart(f)); });
  REFS.forEach((f, i) => { parts.push({ text: `CHARACTER REFERENCE ${i + 1}:` }, imagePart(f)); });
  parts.push({ text: PROMPT_TAIL });

  const t0 = Date.now();
  const r = await generate({ parts, aspectRatio: '16:9', imageSize: SIZE });
  if (!r.images.length) { console.error('没拿到图：', r.finishReason, r.text.slice(0, 500)); process.exit(1); }
  await sharp(r.images[0]).png().toFile(OUT);
  fs.writeFileSync(OUT.replace(/\.png$/, '.prompt.txt'),
    `${head}\n\n[style refs] ${STYLE_REFS.join(', ')}\n[character refs] ${REFS.join(', ')}\n\n${PROMPT_TAIL}`, 'utf8');
  const m = await sharp(OUT).metadata();
  console.log(`${OUT} ... OK ${m.width}x${m.height}  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log('usage:', JSON.stringify(r.usage));
};

run().catch(e => { console.error(e.message); process.exit(1); });
