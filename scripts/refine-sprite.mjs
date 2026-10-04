// ---------------------------------------------------------
// ✨ 立绘重制：精修一张已有的底图
//
// 构图、姿势、角色设计、背景都不动，只把"画得怎么样"往上推：
// 眼睛、头发、配色、光影、线条、锐度。生成一张新图常常姿势好但画得糙，
// 重掷又会丢掉好姿势——所以把这一步拆出来单独做。
//
// 用法：
//   node scripts/refine-sprite.mjs --in .generated/remake/asuka/base_v2.png \
//     --out .generated/remake/asuka/base_v2_refined.png --size 4K
//
// 用的是 gemini-3-pro-image，按张收费：一次只跑一张。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from './lib/gemini.mjs';
import { STYLE, BACKGROUND } from './lib/spriteStyle.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const IN = arg('in');
const OUT = arg('out');
const SIZE = arg('size', '4K');
if (!IN || !OUT) { console.error('用法：--in <底图> --out <输出.png> [--size 4K]'); process.exit(1); }

const PROMPT = `You are repainting the attached character illustration at a much higher level of finish.

KEEP EXACTLY THE SAME: the pose, the body position and proportions, the framing and where everything sits in the frame, the character design (face, hairstyle, hair colour, eye colour, outfit design and colours), and the flat background colour. Do not move, add or remove anything.

UPGRADE THE RENDERING to match this target style:
${STYLE}

Priorities, in order: 1) the eyes, which must become jewel-like with layered iris gradients and sharp sparkle highlights; 2) richer, more colourful lighting with coloured shadows and a bright rim light; 3) hair with crisp highlight bands and fine strands; 4) sharper, crisper lineart and edges everywhere, no blur or waxy smoothing.

${BACKGROUND}`;

const run = async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const t0 = Date.now();
  const src = await sharp(IN).metadata();
  const r = await generate({ parts: [imagePart(IN), { text: PROMPT }], aspectRatio: '9:16', imageSize: SIZE });
  if (!r.images.length) { console.error('没拿到图：', r.finishReason, r.text.slice(0, 500)); process.exit(1); }
  await sharp(r.images[0]).png().toFile(OUT);
  const m = await sharp(OUT).metadata();
  console.log(`${OUT} ... OK ${m.width}x${m.height}（原图 ${src.width}x${src.height}）  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log('usage:', JSON.stringify(r.usage));
};

run().catch(e => { console.error(e.message); process.exit(1); });
