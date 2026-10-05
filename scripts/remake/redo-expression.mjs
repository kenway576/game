// ---------------------------------------------------------
// 🔁 重做已经装进游戏的立绘的表情（第一轮重制留下的坏脸）
//
//   node scripts/remake/redo-expression.mjs --char hikari --base school_neutral --prefix school_ \
//        --emos neutral,happy,angry,sad,shy,smug,surprised,pout
//
// 以 --base 那张（游戏里的成品图）为底，按 expr-lib 的新办法换脸，输出跟原图一样大，
// 所以木偶骨骼、眨眼帧的位置都不用动。原图备份在 .generated/remake2-redo/<角色>/。
// 换过的图，它们的眨眼帧记录会被删掉——之后跑 blink-installed.mjs 重做。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
import { align, parseBoxes } from './blink-lib.mjs';
import { emotionText, exprPrompt, pasteFace } from './expr-lib.mjs';
import { NEUTRAL_FACE } from './outfits.mjs';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const CHAR = arg('char'), BASE = arg('base'), PREFIX = arg('prefix', ''), EMOS = String(arg('emos', '')).split(',').filter(Boolean);
if (!CHAR || !BASE || !EMOS.length) { console.error('用法：--char <角色> --base <底图名> [--prefix school_] --emos a,b,c'); process.exit(1); }
const PUB = `public/images/characters/${CHAR}`;
const DIR = `.generated/remake2-redo/${CHAR}/${PREFIX || 'root_'}`;
fs.mkdirSync(DIR, { recursive: true });
const P = f => path.join(DIR, f);
const cost = (what, model, size) => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tredo/${CHAR}/${PREFIX}\t${what}\t${model}\t${size}\n`);

// 底图：备份一份原样的，之后都从备份读（重跑时不会拿已经改过的当底）
const baseBak = P(`orig_${BASE}.webp`);
if (!fs.existsSync(baseBak)) fs.copyFileSync(`${PUB}/${BASE}.webp`, baseBak);
const { data: cut, info } = await sharp(baseBak).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const flat = await sharp(baseBak).flatten({ background: '#E6E6E6' }).png().toBuffer();

// 找脸：先在整张图上粗找，再放大头部精找
if (!fs.existsSync(P('face.json'))) {
  const small = await sharp(flat).resize({ height: 1400 }).png().toBuffer();
  fs.writeFileSync(P('_s.png'), small);
  let r = await generate({ model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(P('_s.png')), { text: 'Return ONLY a JSON array of {"label": string, "box_2d": [ymin, xmin, ymax, xmax]} normalized to 0-1000 with one entry labelled "face": the face of this anime character from the top of the eyebrows to the chin, cheek to cheek.' }] });
  cost('detect', 'gemini-3-flash-preview', '-');
  const f0 = parseBoxes(r.text)[0];
  if (!f0) throw new Error('没找到脸：' + r.text.slice(0, 200));
  const [y0, x0, y1, x1] = f0.box_2d.map((v, i) => v / 1000 * (i % 2 ? W : H));
  const S0 = Math.round(Math.max(x1 - x0, y1 - y0) * 2.2);
  const reg = { left: Math.max(0, Math.min(W - S0, Math.round((x0 + x1) / 2 - S0 / 2))), top: Math.max(0, Math.min(H - S0, Math.round((y0 + y1) / 2 - S0 / 2))), width: S0, height: S0 };
  await sharp(flat).extract(reg).resize(1024, 1024).png().toFile(P('_z.png'));
  r = await generate({ model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(P('_z.png')), { text: 'Close-up of an anime character head. Return ONLY a JSON array of {"label": string, "box_2d": [ymin, xmin, ymax, xmax]} normalized to 0-1000 for exactly one label "face": the face from the top of the eyebrows to the bottom of the chin and from cheek edge to cheek edge.' }] });
  cost('detect-face', 'gemini-3-flash-preview', '-');
  const f1 = parseBoxes(r.text)[0];
  if (!f1) throw new Error('放大后没找到脸：' + r.text.slice(0, 200));
  const [a0, b0, a1, b1] = f1.box_2d.map(v => v / 1000 * S0);
  fs.writeFileSync(P('face.json'), JSON.stringify({ x0: b0 + reg.left, y0: a0 + reg.top, x1: b1 + reg.left, y1: a1 + reg.top }));
}
const fj = JSON.parse(fs.readFileSync(P('face.json'), 'utf8'));
const face = { ...fj, cx: (fj.x0 + fj.x1) / 2, cy: (fj.y0 + fj.y1) / 2, w: fj.x1 - fj.x0, h: fj.y1 - fj.y0 };
const S = Math.round(Math.max(face.w, face.h) * 2.4);
const region = { left: Math.max(0, Math.min(W - S, Math.round(face.cx - S / 2))), top: Math.max(0, Math.min(H - S, Math.round(face.cy - S / 2))), width: S, height: S };
const FR = region.width;
const ell = { cx: face.cx - region.left, cy: face.cy - region.top, rx: face.w / 2 * 1.02, ry: face.h / 2 * 1.02 };
await sharp(flat).extract(region).png().toFile(P('_face_in.png'));
// 模型的输入放大到 1024：原图里脸只有两三百像素宽，太小了模型画不细
await sharp(P('_face_in.png')).resize(1024, 1024, { kernel: 'lanczos3' }).png().toFile(P('_face_in_big.png'));
const ref = await sharp(P('_face_in.png')).removeAlpha().raw().toBuffer();
const TEXT = emotionText(NEUTRAL_FACE[CHAR]);

const blinksF = '.generated/remake2-blink/blinks.json';
const blinks = fs.existsSync(blinksF) ? JSON.parse(fs.readFileSync(blinksF, 'utf8')) : {};

for (const emo of EMOS) {
  const raw = P(`${emo}_raw.png`);
  if (!fs.existsSync(raw)) {
    console.log(`${CHAR}/${PREFIX}${emo}：生成…`);
    const r = await generate({ parts: [imagePart(P('_face_in_big.png')), { text: exprPrompt(TEXT[emo]) }], aspectRatio: '1:1', imageSize: '2K' });
    cost(`expr:${emo}`, 'gemini-3-pro-image', '2K');
    if (!r.images.length) { console.log(`  没拿到图：${r.finishReason}`); continue; }
    await sharp(r.images[0]).png().toFile(raw);
  }
  const edit = await sharp(raw).resize(FR, FR, { fit: 'fill', kernel: 'lanczos3' }).removeAlpha().raw().toBuffer();
  const inF = (x, y) => ((x - ell.cx) / ell.rx) ** 2 + ((y - ell.cy) / ell.ry) ** 2;
  const a = align(ref, edit, FR, (x, y) => { const e = inF(x, y); return e > 1.5 && e < 5; });
  const out = await pasteFace({ cut, W, H, region, FR, ref, edit, a, ell });
  const name = `${PREFIX}${emo}`;
  const dst = `${PUB}/${name}.webp`;
  if (fs.existsSync(dst) && !fs.existsSync(P(`orig_${name}.webp`))) fs.copyFileSync(dst, P(`orig_${name}.webp`));
  fs.writeFileSync(dst, await sharp(out, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toBuffer());
  // 检查图：原来 | 现在
  const box = { left: Math.max(0, Math.round(face.x0 - face.w * 0.3)), top: Math.max(0, Math.round(face.y0 - face.h * 0.3)), width: Math.round(face.w * 1.6), height: Math.round(face.h * 1.5) };
  box.width = Math.min(box.width, W - box.left); box.height = Math.min(box.height, H - box.top);
  const before = fs.existsSync(P(`orig_${name}.webp`)) ? P(`orig_${name}.webp`) : baseBak;
  const tiles = await Promise.all([before, dst].map(f => sharp(f).extract(box).flatten({ background: '#9aa' }).resize({ height: 360 }).png().toBuffer()));
  const tw = (await sharp(tiles[0]).metadata()).width;
  await sharp({ create: { width: tw * 2 + 6, height: 360, channels: 3, background: '#fff' } }).composite([{ input: tiles[0], left: 0, top: 0 }, { input: tiles[1], left: tw + 6, top: 0 }]).jpeg().toFile(P(`${emo}_check.jpg`));
  // 眨眼帧作废
  const key = `/images/characters/${CHAR}/${name}.webp`;
  if (key in blinks) { delete blinks[key]; fs.rmSync(`.generated/remake2-blink/${CHAR}/${name}`, { recursive: true, force: true }); }
  console.log(`${CHAR}/${name}  对齐 (${a.dx},${a.dy}) 差异 ${a.s0.toFixed(1)}→${a.s.toFixed(1)}`);
}
fs.writeFileSync(blinksF, JSON.stringify(blinks, null, 1));
console.log('完成。眨眼帧：node scripts/remake/blink-installed.mjs --only ' + CHAR);
