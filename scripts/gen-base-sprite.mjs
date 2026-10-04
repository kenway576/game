// ---------------------------------------------------------
// 🧍 立绘重制：从角色卡生成底图
//
// 整个重制项目的第一步。每个角色先有一张底图，之后换装只改衣服、
// 换表情只改脸，头和身体的位置不动——形象天然一致，木偶骨骼每套身体只标一次。
//
// 【画风统一靠这里】STYLE 和 POSES 是写死的常量，八个角色共用同一份。
// 要调画风就改这里，然后所有角色重新跑；不要在命令行里给单个角色加画风描述。
// 角色自己的东西（长相、衣服、那个招牌动作）走 --identity / --outfit / --gesture。
//
// 用法：
//   node scripts/gen-base-sprite.mjs \
//     --card public/images/character_cards/asuka/school_blazer.jpg \
//     --out  .generated/remake/asuka/base_school_blazer.png \
//     --identity "red twin tails, red eyes, ..." \
//     --outfit   "navy school blazer with a gold crest, ..." \
//     --pose lively --gesture "one hand on her hip, ..." --size 4K
//
//   --pose standard  正面站直、手垂下（木偶最省事）
//   --pose lively    有动感但站得稳：重心在一条腿、头微歪、一只手做动作（默认）
//   --size 1K / 2K / 4K
//
// 输出只写 .generated/（已在 .gitignore 里），满意了再收进 public。
// 用的是 gemini-3-pro-image，按张收费：一次只跑一张。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from './lib/gemini.mjs';
import { STYLE, BACKGROUND } from './lib/spriteStyle.mjs';
import { CARDS } from './remake/cards.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
// --char hikari：从 scripts/remake/cards.mjs 取设定，参考图用重制好的新角色卡。命令行参数可覆盖。
const SPEC = arg('char') ? CARDS.find(c => c.id === arg('char')) : null;
const CARD = arg('card', SPEC ? `.generated/remake/cards/${SPEC.id}_${SPEC.outfit}.png` : undefined);
const OUT = arg('out', SPEC ? `.generated/remake/${SPEC.id}/base_v1.png` : undefined);
const IDENTITY = arg('identity', SPEC?.identity ?? '');
const OUTFIT = arg('outfit', SPEC?.uniform ?? '');
const GESTURE = arg('gesture', '');
const POSE_KIND = arg('pose', 'lively');
const SIZE = arg('size', '2K');

if (!CARD || !OUT) {
  console.error('用法：--card <角色卡> --out <输出.png> [--identity] [--outfit] [--pose lively|standard] [--gesture] [--size 2K|4K]');
  process.exit(1);
}

const POSES = {
  standard: `POSE AND FRAMING:
Full body from the top of the head (including hair tips and ahoge) to the soles of the shoes, all inside the frame with a small margin.
Facing the viewer directly, front view, body symmetric, standing straight and relaxed, weight on both feet, feet slightly apart.
Both arms hang naturally at the sides with a small visible gap between each arm and the torso; hands relaxed and open, not holding anything.
Head level, looking straight at the viewer. Calm, gentle, relaxed expression: relaxed eyebrows, eyes open and soft, mouth softly closed. NOT angry, NOT frowning.
Hair falls naturally and does not cover the face.`,
  // 有动感，但木偶还能做：脸不被挡、头和身体分得开、整个人在画面里站得稳
  lively: `POSE AND FRAMING:
Full body from the top of the head (including hair tips and ahoge) to the soles of the shoes, all inside the frame with a small margin.
An energetic, charming standing pose full of personality, like a character introduction card: body turned slightly (no more than a quarter turn) but the face and chest still face the viewer, weight on one leg with a natural hip shift, the other leg relaxed with the knee slightly bent, head tilted a little, hair and skirt with a slight sense of motion as if a soft breeze passed.
Arms: ${GESTURE || 'one hand makes a lively gesture near the shoulder, the other rests on the hip'}.
Rules that must hold (the sprite will be animated as a puppet, head and body moving separately): both hands are clearly visible and well drawn with correct finger count; no hand, arm or object covers or touches the face, the neck or the hair; keep clear empty space around the head and neck, with hands at least a hand-width away from the head; the head is tilted only slightly; the whole body, including both feet, stays inside the frame.
Expression: bright and lively, looking at the viewer, matching the character's personality.`
};
const POSE = POSES[POSE_KIND] || POSES.lively;

const PROMPT = `Create a new illustration of the character shown in the attached character reference sheet.

IDENTITY (copy exactly from the reference sheet): keep the same face shape, eye shape and eye colour, hairstyle, hair length, bangs, hair colour and hair accessories, and body proportions. ${IDENTITY}
OUTFIT (copy exactly from the reference sheet, same design, colours and details): ${OUTFIT}
The character design must stay identical to the reference; only the pose changes.
The reference sheet is already drawn in the target style: match its drawing and colouring exactly (line density, hair and eye rendering, shading, colours), at the same level of detail or higher.

${STYLE}

${POSE}

${BACKGROUND}`;

const run = async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const t0 = Date.now();
  const r = await generate({ parts: [imagePart(CARD), { text: PROMPT }], aspectRatio: '9:16', imageSize: SIZE });
  if (!r.images.length) {
    console.error('没拿到图：', r.finishReason, r.text.slice(0, 500));
    process.exit(1);
  }
  await sharp(r.images[0]).png().toFile(OUT);
  fs.writeFileSync(OUT.replace(/\.png$/, '.prompt.txt'), PROMPT, 'utf8');
  const m = await sharp(OUT).metadata();
  console.log(`${OUT} ... OK ${m.width}x${m.height}  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log('usage:', JSON.stringify(r.usage));
  if (r.text) console.log('model text:', r.text.slice(0, 300));
};

run().catch(e => { console.error(e.message); process.exit(1); });
