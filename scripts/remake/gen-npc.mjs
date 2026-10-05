// ---------------------------------------------------------
// 🧑‍🤝‍🧑 给剧情里没有立绘的人画立绘（名单在 npcs.mjs）
//
//   node scripts/remake/gen-npc.mjs [--only hk_obaa,dr_pharmacist] [--jobs 2]
//
// 画风参考 = 两张主角的新角色卡（只学画法，不学人和衣服），所以 NPC 跟主角站在一起不违和。
// 生成 → 抠灰底 → 按轮廓裁 → 1400 高 → public/images/characters/npc_<id>.webp
// 已经装好的跳过（要重画就删掉 .generated/remake2/npc/<id>/）。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { spawnSync } from 'child_process';
import { generate, imagePart } from '../lib/gemini.mjs';
import { STYLE, BACKGROUND } from '../lib/spriteStyle.mjs';
import { NPCS } from './npcs.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const ONLY = arg('only') ? String(arg('only')).split(',') : null;
const JOBS = Number(arg('jobs', 2));
const STYLE_REFS = ['public/images/character_cards/hikari/school_blazer_remake.webp', 'public/images/character_cards/rei/school_blazer_remake.webp'];

const prompt = n => `Create a full-body standing illustration of an ORIGINAL supporting character described in the text below.

The two STYLE REFERENCE images (character model sheets) show the exact drawing and colouring style to use: line density and quality, eye and hair rendering, shading and colour treatment. Match that style exactly, at the same level of detail, so this character looks like they belong in the same game.
Do NOT copy anything else from the style references: not the characters, faces, hairstyles, hair colours, uniforms or poses. The character must look exactly as described in the text.

CHARACTER: ${n.look}

${STYLE}

POSE AND FRAMING:
Full body from the top of the head to the soles of the shoes, all inside the frame with a small margin; the character fills most of the frame height. Facing the viewer or turned at most a quarter, natural relaxed weight shift.
Pose: ${n.pose}.
Hands clearly visible and well drawn with the correct number of fingers. Nothing covers the face. A single character only, unless the text explicitly includes a second person (such as a child holding a hand).

${BACKGROUND}`;

const doOne = async n => {
  const dir = `.generated/remake2/npc/${n.id}`;
  fs.mkdirSync(dir, { recursive: true });
  const out = `public/images/characters/npc_${n.id}.webp`;
  if (fs.existsSync(path.join(dir, 'done'))) return;
  const raw = path.join(dir, 'raw.png');
  if (!fs.existsSync(raw)) {
    const r = await generate({ parts: [...STYLE_REFS.map(imagePart), { text: prompt(n) }], aspectRatio: '9:16', imageSize: '2K' });
    fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tnpc/${n.id}\tbase\tgemini-3-pro-image\t2K\n`);
    if (!r.images.length) throw new Error(`${n.id} 没拿到图：${r.finishReason}`);
    await sharp(r.images[0]).png().toFile(raw);
  }
  const cut = path.join(dir, 'cut.png');
  const c = spawnSync(process.execPath, ['scripts/cutout-flat-bg.mjs', '--in', raw, '--out', cut], { encoding: 'utf8' });
  if (c.status !== 0) throw new Error(`${n.id} 抠图失败 ${c.stderr}`);
  // 按不透明范围裁，留一点边
  const { data, info } = await sharp(cut).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const pad = Math.round(info.height * 0.01);
  const box = { left: Math.max(0, x0 - pad), top: Math.max(0, y0 - pad) };
  box.width = Math.min(info.width, x1 + pad) - box.left;
  box.height = Math.min(info.height, y1 + pad) - box.top;
  await sharp(cut).extract(box).resize({ height: 1400 }).webp({ quality: 90, alphaQuality: 100 }).toFile(out);
  fs.writeFileSync(path.join(dir, 'done'), out);
  console.log(`${n.id} → ${out}`);
};

const queue = NPCS.filter(n => !ONLY || ONLY.includes(n.id));
await Promise.all(Array.from({ length: JOBS }, async () => {
  while (queue.length) {
    const n = queue.shift();
    try { await doOne(n); } catch (e) { console.log(`✘ ${n.id}: ${e.message}`); }
  }
}));
console.log('完成');
