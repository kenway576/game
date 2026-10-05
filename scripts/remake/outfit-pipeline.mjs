// ---------------------------------------------------------
// 🏭 立绘重制第二轮：一套衣服从头做到装进游戏
//
//   node scripts/remake/outfit-pipeline.mjs --char asuka --outfit casual [--until base|expr|blink|install]
//
// 每一步的产物都存在 .generated/remake2/<角色>/<衣服>/，已经有的就跳过——
// 中途断了（额度用完、网络）重跑同一条命令，从断点接着做，不会重复花钱。
//
//  1. base.png      底图：角色卡当长相参考，换上 outfits.mjs 里的衣服和动作（2K，9:16）
//  2. base_cut.png  抠掉浅灰底（cutout-flat-bg.mjs）
//  3. detect.json   让 gemini-2.5-flash 标出脸、头、手、躯干、垂下来的头发（便宜，几乎不花钱）
//  4. <表情>.png    只改脸：把头部裁成方块送去改表情（2K，比整张图清楚也更便宜），对齐后只贴回脸部椭圆
//  5. blink/        眨眼过渡帧：每张睁眼的表情各做一张"半闭"一张"全闭"，只贴回眼睛那一块
//  6. 装进 public/images/characters/<角色>/<衣服>_<表情>.webp，眨眼小图在 blink/ 子目录，
//     骨骼写进 data/puppetRigsAuto.ts（scripts/remake/build-rigs.mjs 汇总）
//
// 用的是 gemini-3-pro-image（走 Vertex），按张收费。每次调用记在 .generated/remake2/_cost.log
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { spawnSync } from 'child_process';
import { generate, imagePart } from '../lib/gemini.mjs';
import { STYLE, BACKGROUND } from '../lib/spriteStyle.mjs';
import { CARDS } from './cards.mjs';
import { OUTFITS, EMOTIONS, NEUTRAL_FACE, IDENTITY_EXTRA } from './outfits.mjs';
import { parseBoxes, squashEyes, ellipseSize, frameMask, isFrameColor, GLASSES_CHARS } from './blink-lib.mjs';
import { emotionText, exprPrompt, pasteFace, eyesOpen } from './expr-lib.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const CHAR = arg('char'), OUTFIT = arg('outfit');
const UNTIL = arg('until', 'install');
const ONLY = arg('only');   // 只做这几个表情（逗号分隔），调试用
const SPEC = OUTFITS[CHAR]?.[OUTFIT];
const CARD_SPEC = CARDS.find(c => c.id === CHAR);
if (!SPEC || !CARD_SPEC) { console.error(`outfits.mjs 里没有 ${CHAR}/${OUTFIT}`); process.exit(1); }
const EMOS = (ONLY ? String(ONLY).split(',') : EMOTIONS[CHAR]);
const DIR = `.generated/remake2/${CHAR}/${OUTFIT}`;
fs.mkdirSync(path.join(DIR, 'blink'), { recursive: true });
const P = f => path.join(DIR, f);
const has = f => fs.existsSync(P(f));
const log = (...a) => console.log(`[${CHAR}/${OUTFIT}]`, ...a);
// v3：半闭帧的压扁只在眼睛椭圆里生效；戴眼镜的椭圆收窄。版本不对的记录用缓存的全闭原图重算
const BLINK_V = 7;
const BLINK_MODEL = process.env.BLINK_MODEL || 'gemini-2.5-flash-image';
const STAGES = ['base', 'expr', 'blink', 'install'];
const stop = s => STAGES.indexOf(UNTIL) < STAGES.indexOf(s);

// 角色卡：长相的唯一标准
const CARD = ['school_blazer_remake.webp', 'cardigan_remake.webp']
  .map(f => `public/images/character_cards/${CHAR}/${f}`).find(f => fs.existsSync(f));

const costLog = (what, model, size) => fs.appendFileSync('.generated/remake2/_cost.log',
  `${new Date().toISOString()}\t${CHAR}/${OUTFIT}\t${what}\t${model}\t${size}\n`);

const gen = async (what, opts) => {
  const model = opts.model || 'gemini-3-pro-image';
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await generate(opts);
    costLog(what, model, opts.imageSize || '-');
    if (r.images.length) return r.images[0];
    log(`${what} 第 ${attempt} 次没拿到图：${r.finishReason} ${r.text?.slice(0, 200)}`);
  }
  throw new Error(`${what} 三次都没拿到图`);
};

// ---------------------------------------------------------------- 1. 底图
const BASE_PROMPT = `Create a new full-body standing illustration of the character shown in the attached character reference sheet, wearing a DIFFERENT outfit.

IDENTITY (copy exactly from the reference sheet): the same face shape, eye shape and eye colour, hairstyle, hair length, bangs, hair colour, hair accessories, skin tone and body proportions. ${CARD_SPEC.identity} ${IDENTITY_EXTRA[CHAR] || ''}
IGNORE the clothes in the reference sheet (that is her school uniform). She now wears this outfit instead:
OUTFIT: ${SPEC.outfit}
Draw every item of the outfit exactly as written, including the colours, accessories, the legwear (colour and length) and the footwear. No real-world brand logos or trademarks anywhere (no swoosh, no stripes logos, no brand names); clothing and shoes are generic, original designs.

The reference sheet is drawn in the exact target style: match its drawing and colouring exactly (line density, hair and eye rendering, shading, colours), at the same level of detail or higher.

${STYLE}

POSE AND FRAMING:
Full body from the top of the head (including hair tips, ahoge, ears) to the soles of the shoes, all inside the frame with a small margin on every side. The character fills most of the frame height.
A natural, charming standing pose full of personality: body turned slightly (no more than a quarter turn) but the face and chest face the viewer, weight on one leg with a natural hip shift, head tilted only a little.
Arms: ${SPEC.gesture}.
Rules that must hold (the sprite will be animated as a puppet, head and body moving separately): both hands are clearly visible and well drawn with the correct number of fingers; no hand, arm or held object covers or touches the face, the eyes or the neck; keep clear empty space around the head and neck; the whole body including both feet stays inside the frame.
Expression: ${NEUTRAL_FACE[CHAR]}, looking at the viewer, eyes clearly open.

${BACKGROUND}`;

if (!has('base.png')) {
  log('生成底图…');
  const t0 = Date.now();
  // 2K 就够：游戏里立绘 2000 高，2K 底图 2752 高；表情是对脸部单独放大生成的，不受底图分辨率影响。比 4K 每张省 $0.1
  const img = await gen('base', { parts: [imagePart(CARD), { text: BASE_PROMPT }], aspectRatio: '9:16', imageSize: '2K' });
  await sharp(img).png().toFile(P('base.png'));
  fs.writeFileSync(P('base.prompt.txt'), BASE_PROMPT, 'utf8');
  log(`底图 OK ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
if (!has('base_cut.png')) {
  const r = spawnSync(process.execPath, ['scripts/cutout-flat-bg.mjs', '--in', P('base.png'), '--out', P('base_cut.png')], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('抠图失败');
}

// ---------------------------------------------------------------- 3. 定位
// 模型回的 JSON 偶尔包一层对象、多一段说明文字：parseBoxes 只认带 box_2d 的条目（blink-lib.mjs）
const meta = await sharp(P('base.png')).metadata();
const W = meta.width, H = meta.height;
// 缓存的结果缺脸或缺头（模型偶尔只回一半）就当没有，重新标
const detectOk = () => { try { const j = JSON.parse(fs.readFileSync(P('detect.json'), 'utf8')); return ['face', 'head', 'torso'].every(l => j.some(d => d.label === l)); } catch { return false; } };
for (let attempt = 1; !detectOk(); attempt++) {
  if (attempt > 3) throw new Error('定位三次都缺脸/头/躯干');
  log(`定位脸和手…${attempt > 1 ? `（第 ${attempt} 次）` : ''}`);
  const small = P('_detect_in.png');
  await sharp(P('base.png')).resize({ height: 1600 }).png().toFile(small);
  const r = await generate({
    model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(small), {
      text: `Detect parts of this anime character. Return ONLY a JSON array of {"label": string, "box_2d": [ymin, xmin, ymax, xmax]} with coordinates normalized to 0-1000. Labels, use exactly these:
"head" (the whole head including all hair on top and animal ears, but NOT hair hanging below the chin),
"face" (skin area from the hairline/bangs down to the chin, cheek to cheek),
"left_eye", "right_eye" (each eye including lashes; left = the one on the image's left),
"mouth",
"neck",
"torso" (shoulders to hips, without arms),
"hand" (one entry per visible hand, include anything held in it),
"hanging_hair" (one entry per twin tail, ponytail or long lock of hair hanging beside the body below the chin; omit if the hair is short),
"tails" (all animal tails together, if any),
"feet" (both feet/shoes together).`
    }]
  });
  costLog('detect', 'gemini-3-flash-preview', '-');
  const json = parseBoxes(r.text);
  fs.writeFileSync(P('detect.json'), JSON.stringify(json, null, 1));
  fs.unlinkSync(small);
}
const det = JSON.parse(fs.readFileSync(P('detect.json'), 'utf8'));
// box_2d → 底图像素 {x0,y0,x1,y1,cx,cy,w,h}
const box = b => {
  const [y0, x0, y1, x1] = b.box_2d.map((v, i) => v / 1000 * (i % 2 ? W : H));
  return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
};
const all = label => det.filter(d => d.label === label).map(box);
const one = label => all(label)[0];
const face0 = one('face');
if (!face0) throw new Error('detect.json 里没有 face');
// 全身图里脸只占一小块，框会飘几十像素。把头部放大再标一次脸
if (!has('detect_face.json')) {
  const S0 = Math.round(Math.max(face0.w, face0.h) * 2.2);
  const reg = { left: Math.max(0, Math.round(face0.cx - S0 / 2)), top: Math.max(0, Math.round(face0.cy - S0 / 2)), width: S0, height: S0 };
  reg.left = Math.min(reg.left, W - S0); reg.top = Math.min(reg.top, H - S0);
  const small = P('_face_det.png');
  await sharp(P('base.png')).extract(reg).resize(1024, 1024).png().toFile(small);
  const r = await generate({ model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(small), { text: 'Close-up of an anime character head. Return ONLY a JSON array of {"label": string, "box_2d": [ymin, xmin, ymax, xmax]} normalized to 0-1000 for exactly one label "face": the face from the top of the eyebrows to the bottom of the chin and from cheek edge to cheek edge (the area that changes with facial expression: eyebrows, eyes, nose, mouth, cheeks).' }] });
  costLog('detect-face', 'gemini-3-flash-preview', '-');
  const j = parseBoxes(r.text);
  if (!j.length) throw new Error('放大标脸没标出来：' + r.text.slice(0, 200));
  const [y0, x0, y1, x1] = j[0].box_2d.map(v => v / 1000 * S0);
  fs.writeFileSync(P('detect_face.json'), JSON.stringify({ x0: x0 + reg.left, y0: y0 + reg.top, x1: x1 + reg.left, y1: y1 + reg.top }));
  fs.unlinkSync(small);
}
const face = (() => {
  const f = JSON.parse(fs.readFileSync(P('detect_face.json'), 'utf8'));
  return { ...f, cx: (f.x0 + f.x1) / 2, cy: (f.y0 + f.y1) / 2, w: f.x1 - f.x0, h: f.y1 - f.y0 };
})();
const eyes = all('left_eye').concat(all('right_eye'));
const eyeMid = eyes.length === 2
  ? { x: (eyes[0].cx + eyes[1].cx) / 2, y: (eyes[0].cy + eyes[1].cy) / 2 }
  : { x: face.cx, y: face.y0 + face.h * 0.45 };

// ---------------------------------------------------------------- 对齐 / 贴图工具
const rgbOf = async (file, region) => {
  const img = sharp(file).flatten({ background: '#E6E6E6' });
  return (region ? img.extract(region) : img).removeAlpha().raw().toBuffer();
};
const gray = (buf, p) => buf[p * 3] * 0.3 + buf[p * 3 + 1] * 0.59 + buf[p * 3 + 2] * 0.11;
// 在 ref 和 edit（同尺寸 S×S 的 RGB）之间找最佳平移；只比较 sampleMask 为真的点
const align = (ref, edit, S, sampleMask) => {
  const samples = [];
  for (let y = 0; y < S; y += 3) for (let x = 0; x < S; x += 3) if (sampleMask(x, y)) samples.push([x, y]);
  const score = (dx, dy) => {
    let s = 0;
    for (const [x, y] of samples) {
      const ex = x + dx, ey = y + dy;
      if (ex < 0 || ey < 0 || ex >= S || ey >= S) { s += 255; continue; }
      s += Math.abs(gray(ref, y * S + x) - gray(edit, ey * S + ex));
    }
    return s / samples.length;
  };
  let best = { dx: 0, dy: 0, s: score(0, 0) };
  const s0 = best.s;
  for (const step of [6, 2, 1]) {
    const c = { ...best };
    const range = step === 6 ? 36 : step * 4;
    for (let dy = c.dy - range; dy <= c.dy + range; dy += step)
      for (let dx = c.dx - range; dx <= c.dx + range; dx += step) {
        const s = score(dx, dy);
        if (s < best.s) best = { dx, dy, s };
      }
  }
  return { ...best, s0 };
};
const square = (cx, cy, side) => {
  const S = Math.round(side);
  const left = Math.max(0, Math.min(W - S, Math.round(cx - S / 2)));
  const top = Math.max(0, Math.min(H - S, Math.round(cy - S / 2)));
  return { left, top, width: S, height: S };
};

// ---------------------------------------------------------------- 4. 表情
const EMOTION_TEXT = emotionText(NEUTRAL_FACE[CHAR]);

const faceRegion = square(face.cx, face.cy, Math.max(face.w, face.h) * 2.4);
const FR = faceRegion.width;
const fcx = face.cx - faceRegion.left, fcy = face.cy - faceRegion.top;
const frx = face.w / 2 * 1.02, fry = face.h / 2 * 1.02;
const inFace = (x, y, k = 1) => ((x - fcx) / (frx * k)) ** 2 + ((y - fcy) / (fry * k)) ** 2;

// v2：贴回去的范围从"脸部椭圆"改成"脸附近真的变了的地方"（expr-lib 的 pasteFace），
// 修外眼角新旧两只眼叠在一起的问题。旧版本的表情用缓存的模型原图重新贴，不再调模型；
// 眼睛那一块变了的，它的眨眼帧作废重做
const EXPR_V = 3;   // v3：v2 的羽化蒙版读错了通道，贴上去的脸几乎没变
const changedEmos = new Set();
const makeExpression = async emo => {
  const stamp = P(`${emo}.v`);
  const cur = fs.existsSync(stamp) ? Number(fs.readFileSync(stamp, 'utf8')) : 1;
  if (has(`${emo}.png`) && (cur >= EXPR_V || emo === EMOTIONS[CHAR][0])) return;
  if (emo === EMOTIONS[CHAR][0]) { fs.copyFileSync(P('base_cut.png'), P(`${emo}.png`)); fs.writeFileSync(stamp, String(EXPR_V)); return; }
  const crop = P(`_face_in.png`);
  await sharp(P('base.png')).extract(faceRegion).png().toFile(crop);
  const raw = P(`${emo}_raw.png`);
  if (!fs.existsSync(raw)) {
    log(`表情 ${emo}…`);
    const img = await gen(`expr:${emo}`, { parts: [imagePart(crop), { text: exprPrompt(EMOTION_TEXT[emo]) }], aspectRatio: '1:1', imageSize: '2K' });
    await sharp(img).png().toFile(raw);
  }
  const ref = await sharp(crop).removeAlpha().raw().toBuffer();
  const edit = await sharp(raw).resize(FR, FR, { fit: 'fill' }).removeAlpha().raw().toBuffer();
  // 对齐看脸外面一圈（头发、耳朵、脖子）
  const a = align(ref, edit, FR, (x, y) => { const e = inFace(x, y); return e > 1.5 && e < 5; });
  const cut = await sharp(P('base_cut.png')).ensureAlpha().raw().toBuffer();
  const old = has(`${emo}.png`) ? await sharp(P(`${emo}.png`)).ensureAlpha().raw().toBuffer() : null;
  const out = await pasteFace({ cut, W, H, region: faceRegion, FR, ref, edit, a, ell: { cx: fcx, cy: fcy, rx: frx, ry: fry } });
  await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(P(`${emo}.png`));
  fs.writeFileSync(stamp, String(EXPR_V));
  // 跟旧版比，眼睛那一带（脸的上半）变了多少：变得多的，眨眼帧重做
  if (old) {
    let d = 0, n = 0;
    for (let y = Math.round(face.y0); y < face.y0 + face.h * 0.55; y += 2) for (let x = Math.round(face.x0 - face.w * 0.15); x < face.x1 + face.w * 0.15; x += 2) {
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      const p = (y * W + x) * 4; n++;
      d += Math.abs(out[p] - old[p]) + Math.abs(out[p + 1] - old[p + 1]) + Math.abs(out[p + 2] - old[p + 2]);
    }
    if (d / Math.max(1, n) > 6) changedEmos.add(emo);
  }
  log(`表情 ${emo} 对齐 (${a.dx},${a.dy}) 差异 ${a.s0.toFixed(1)}→${a.s.toFixed(1)}${changedEmos.has(emo) ? '（眼睛那块变了，眨眼帧重做）' : ''}`);
};

if (!stop('expr')) for (const emo of EMOS) await makeExpression(emo);

// ---------------------------------------------------------------- 5. 眨眼过渡帧
// 半闭（上眼皮盖住一半瞳孔）和全闭各一张。只把"和睁眼图不一样的那一块"（眼睛）贴回去。
// 裁切区以脸为准；眼睛的准确位置在每张表情的放大图上单独标（全身图里眼睛太小，标得飘）
const eyeRegion = square(face.cx, face.y0 + face.h * 0.42, face.w * 1.3);
const ER = eyeRegion.width;
const BLINK_TEXT = {
  half: 'her eyes HALF CLOSED, as in the middle of a natural blink: the upper eyelids lowered to cover the top half of each iris, the lash line lowered with it, the lower half of the iris still visible. Keep the eyebrows exactly as they are',
  closed: 'her eyes GENTLY CLOSED, as at the bottom of a natural blink: each eye is a soft closed eyelid line with the lashes pointing down, the same width as the open eye and at the height of the lower lash line. Keep the eyebrows exactly as they are'
};
const blinkPrompt = k => `This is a close-up crop of the eyes of a finished anime character illustration. Return the SAME image with ONE change.

THE CHANGE: draw ${BLINK_TEXT[k]}.

Everything else stays exactly the same: identical framing and crop, the same eyebrows, bangs, hair strands, blush, mouth, skin, art style, line quality and colouring. Do not move or redraw anything except the eyes themselves.`;

// 眨眼帧信息：{ emo: { rect:[x,y,w,h] 底图像素, frames:[half.png, closed.png] } | null(本来就闭着) }
const blinkInfoFile = P('blink/info.json');
const blinkInfo = fs.existsSync(blinkInfoFile) ? JSON.parse(fs.readFileSync(blinkInfoFile, 'utf8')) : {};

const makeBlink = async emo => {
  // v2：半闭帧改成程序压扁（老版本是模型画的，常常画成全闭）。旧记录会用缓存的全闭原图重算，不再调模型
  // 这张表情的脸刚重贴过、眼睛那块变了：旧的眨眼帧（连同全闭原图、眼睛位置）作废
  if (changedEmos.has(emo)) {
    delete blinkInfo[emo];
    for (const f of [`blink/${emo}_closed_raw.png`, `blink/${emo}_eyes.json`, `blink/${emo}_open.txt`]) if (has(f)) fs.unlinkSync(P(f));
  }
  if (emo in blinkInfo && blinkInfo[emo]?.v === BLINK_V) return;
  if (emo in blinkInfo && blinkInfo[emo] === null && has(`blink/${emo}_open.txt`)) return;
  const src = P(`${emo}.png`);
  const crop = P('_eye_in.png');
  await sharp(src).flatten({ background: '#E6E6E6' }).extract(eyeRegion).png().toFile(crop);
  // 先问一句眼睛是不是睁着：笑眯眼、大笑本来就闭着，硬做眨眼帧会把闭眼的弧线换成另一种闭眼，看着像出 bug
  const openF = P(`blink/${emo}_open.txt`);
  if (!fs.existsSync(openF)) {
    fs.writeFileSync(openF, (await eyesOpen(generate, imagePart, crop)) ? 'open' : 'closed');
    costLog('eyes-open', 'gemini-3-flash-preview', '-');
  }
  if (fs.readFileSync(openF, 'utf8') === 'closed') {
    blinkInfo[emo] = null;
    log(`眨眼 ${emo}：本来就闭着眼，不做`);
    fs.writeFileSync(blinkInfoFile, JSON.stringify(blinkInfo, null, 1));
    return;
  }
  const ref = await sharp(crop).removeAlpha().raw().toBuffer();
  const ecx = face.cx - eyeRegion.left, ecy = face.y0 + face.h * 0.42 - eyeRegion.top;
  const eyesFile = P(`blink/${emo}_eyes.json`);
  if (!fs.existsSync(eyesFile)) {
    const small = P('_eye_det.png');
    await sharp(crop).resize(1024, 1024).png().toFile(small);
    const r = await generate({ model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(small), { text: 'This is a close-up of an anime character face. Return ONLY a JSON array of {"label": string, "box_2d": [ymin, xmin, ymax, xmax]} normalized to 0-1000 for exactly two labels: "eye_a" and "eye_b" (the two eyes; each box tightly encloses the whole eye: upper lash line, lower lash line, inner and outer corners, including any eyelashes, but not the eyebrow). eye_a is the one on the left of the image.' }] });
    costLog('detect-eyes', 'gemini-3-flash-preview', '-');
    const eb = parseBoxes(r.text);
    if (eb.length !== 2) throw new Error('标眼睛没标出两只：' + r.text.slice(0, 200));
    fs.writeFileSync(eyesFile, JSON.stringify(eb));
  }
  const eyeBoxes = JSON.parse(fs.readFileSync(eyesFile, 'utf8')).map(d => {
    const [y0, x0, y1, x1] = d.box_2d.map(v => v / 1000 * ER);
    return { cx: (x0 + x1) / 2 + eyeRegion.left, cy: (y0 + y1) / 2 + eyeRegion.top, w: x1 - x0, h: y1 - y0 };
  });
  const frames = {};
  // 全闭帧：模型偶尔整张画歪（整体挪了几十像素、镜框跑位）。对齐后偏移或差异太大就重画：
  // 先用 Flash 再试一次，还不行换 Pro。坏图改名留着备查
  for (const k of ['closed']) {
    const raw = P(`blink/${emo}_${k}_raw.png`);
    const badOnes = () => fs.readdirSync(P('blink')).filter(f => f.startsWith(`${emo}_${k}_bad`)).length;
    for (;;) {
      if (!fs.existsSync(raw)) {
        const model = badOnes() >= 2 ? 'gemini-3-pro-image' : BLINK_MODEL;
        log(`眨眼 ${emo} ${k}…${badOnes() ? `（第 ${badOnes() + 1} 次，${model}）` : ''}`);
        // 眨眼帧默认用 Flash 画图模型：只改眼睛、每帧只露 0.1 秒，够用；而且它的配额跟 Pro 分开，整体快一倍
        const img = await gen(`blink:${emo}:${k}`, { model, parts: [imagePart(crop), { text: blinkPrompt(k) }], aspectRatio: '1:1', ...(model === BLINK_MODEL ? {} : { imageSize: '2K' }) });
        await sharp(img).png().toFile(raw);
      }
      const edit = await sharp(raw).resize(ER, ER, { fit: 'fill' }).removeAlpha().raw().toBuffer();
      // 对齐看眼睛外面（眉毛以上、脸颊、刘海）
      const a = align(ref, edit, ER, (x, y) => {
        const d = Math.hypot((x - ecx) / (ER * 0.42), (y - ecy) / (ER * 0.16));
        return d > 1.2 && d < 2.6;
      });
      // 阈值是量出来的：正常的全闭帧差异 5~15、偏移 0~1 像素；画歪的差异 37 以上或整体挪了十几像素
      const bad = Math.abs(a.dx) > ER * 0.025 || Math.abs(a.dy) > ER * 0.025 || a.s > 30;
      if (bad && badOnes() < 3) {
        log(`眨眼 ${emo}：全闭帧画歪了（偏移 ${a.dx},${a.dy} 差异 ${a.s.toFixed(1)}），重画`);
        fs.renameSync(raw, P(`blink/${emo}_${k}_bad${badOnes()}.png`));
        continue;
      }
      frames[k] = { edit, a };
      break;
    }
  }
  // 眼睛在哪：用定位出来的两只眼睛，各画一个椭圆（盖住上下眼睑和睫毛），边缘羽化。
  // 不按"哪里变了"来圈：模型常顺手把刘海、眉毛也改一点，按差异圈会把这些也贴回去，留下接缝。
  const ells = (eyeBoxes.length === 2 ? eyeBoxes : [
    { cx: eyeMid.x - face.w * 0.2, cy: eyeMid.y, w: face.w * 0.22, h: face.h * 0.12 },
    { cx: eyeMid.x + face.w * 0.2, cy: eyeMid.y, w: face.w * 0.22, h: face.h * 0.12 }
  ]).map(e => ({ x: e.cx - eyeRegion.left, y: e.cy - eyeRegion.top + e.h * 0.05, rx: e.w * ellipseSize(CHAR).kx, ry: e.h * ellipseSize(CHAR).ky }));
  const ellD = (x, y) => Math.min(...ells.map(e => Math.hypot((x - e.x) / e.rx, (y - e.y) / e.ry)));
  // 本来就闭着眼（笑眯眼、大笑）：椭圆里几乎没变化
  const { edit: ce, a: ca } = frames.closed;
  let n = 0, tot = 0;
  for (let y = 0; y < ER; y += 2) for (let x = 0; x < ER; x += 2) {
    if (ellD(x, y) > 0.8) continue;
    const ex = x + ca.dx, ey = y + ca.dy;
    if (ex < 0 || ey < 0 || ex >= ER || ey >= ER) continue;
    tot++;
    if (Math.abs(gray(ref, y * ER + x) - gray(ce, ey * ER + ex)) > 40) n++;
  }
  if (n / Math.max(1, tot) < 0.06) {
    blinkInfo[emo] = null;
    log(`眨眼 ${emo}：本来就闭着眼，不做`);
    fs.writeFileSync(blinkInfoFile, JSON.stringify(blinkInfo, null, 1));
    return;
  }
  const rx0 = Math.max(0, Math.floor(Math.min(...ells.map(e => e.x - e.rx)))), rx1 = Math.min(ER - 1, Math.ceil(Math.max(...ells.map(e => e.x + e.rx))));
  const ry0 = Math.max(0, Math.floor(Math.min(...ells.map(e => e.y - e.ry)))), ry1 = Math.min(ER - 1, Math.ceil(Math.max(...ells.map(e => e.y + e.ry))));
  const mask = new Float32Array(ER * ER);
  for (let y = ry0; y <= ry1; y++) for (let x = rx0; x <= rx1; x++) {
    const d = ellD(x, y);
    mask[y * ER + x] = d < 0.72 ? 1 : d > 1 ? 0 : (1 - d) / 0.28;
  }
  // 两帧都按同一个遮罩贴到这张表情上
  const full = await sharp(src).ensureAlpha().raw().toBuffer();
  const rect = [eyeRegion.left + rx0, eyeRegion.top + ry0, rx1 - rx0 + 1, ry1 - ry0 + 1];
  const outFrames = [];
  // 镜框像素：两帧都保留原图
  const frame = frameMask(CHAR, full, W, H, rect);
  if (frame) for (let y = ry0; y <= ry1; y++) for (let x = rx0; x <= rx1; x++) if (frame[(y + eyeRegion.top) * W + x + eyeRegion.left]) mask[y * ER + x] = 0;
  for (const k of ['half', 'closed']) {
    const out = Buffer.from(full);
    if (k === 'half' && GLASSES_CHARS.includes(CHAR)) {
      outFrames.push(path.basename(P(`blink/${emo}_closed.png`)));   // 下一轮 closed 会写这个文件
      continue;
    }
    if (k === 'half') {
      // 压扁只在眼睛椭圆里生效（羽化），镜框、刘海不跟着弯
      const sq = squashEyes(full, W, H, eyeBoxes, 0.55, rect);
      for (let y = ry0; y <= ry1; y++) for (let x = rx0; x <= rx1; x++) {
        const w = mask[y * ER + x];
        if (w <= 0) continue;
        const p = ((y + eyeRegion.top) * W + (x + eyeRegion.left)) * 4;
        for (let c = 0; c < 4; c++) out[p + c] = Math.round(full[p + c] * (1 - w) + sq[p + c] * w);
      }
    }
    for (let y = ry0; k === 'closed' && y <= ry1; y++) for (let x = rx0; x <= rx1; x++) {
      const { edit, a } = frames.closed;
      const w = mask[y * ER + x];
      if (w <= 0) continue;
      const ex = x + a.dx, ey = y + a.dy;
      if (ex < 0 || ey < 0 || ex >= ER || ey >= ER) continue;
      const p = (y + eyeRegion.top) * W + (x + eyeRegion.left), q = ey * ER + ex;
      if (full[p * 4 + 3] < 250) continue;
      if (isFrameColor(CHAR, edit[q * 3], edit[q * 3 + 1], edit[q * 3 + 2])) continue;
      for (let c = 0; c < 3; c++) out[p * 4 + c] = Math.round(full[p * 4 + c] * (1 - w) + edit[q * 3 + c] * w);
    }
    const f = P(`blink/${emo}_${k}.png`);
    await sharp(out, { raw: { width: W, height: H, channels: 4 } })
      .extract({ left: rect[0], top: rect[1], width: rect[2], height: rect[3] }).png().toFile(f);
    outFrames.push(path.basename(f));
  }
  blinkInfo[emo] = { v: BLINK_V, rect, frames: outFrames };
  fs.writeFileSync(blinkInfoFile, JSON.stringify(blinkInfo, null, 1));
  // 检查图：睁 | 半 | 闭
  const tiles = await Promise.all([
    sharp(src).extract({ left: rect[0], top: rect[1], width: rect[2], height: rect[3] }).flatten({ background: '#ccc' }).resize({ width: 600 }).png().toBuffer(),
    ...outFrames.map(f => sharp(P(`blink/${f}`)).flatten({ background: '#ccc' }).resize({ width: 600 }).png().toBuffer())
  ]);
  const th = (await sharp(tiles[0]).metadata()).height;
  await sharp({ create: { width: 600, height: th * 3 + 8, channels: 3, background: '#fff' } })
    .composite(tiles.map((t, i) => ({ input: t, left: 0, top: i * (th + 4) }))).jpeg({ quality: 88 }).toFile(P(`blink/${emo}_check.jpg`));
  log(`眨眼 ${emo} OK（全闭帧对齐 ${frames.closed.a.dx},${frames.closed.a.dy} 差异 ${frames.closed.a.s.toFixed(1)}，半闭帧程序压扁）`);
};

if (!stop('blink')) for (const emo of EMOS) await makeBlink(emo);

// ---------------------------------------------------------------- 6. 装进游戏 + 骨骼
if (!stop('install')) {
  const GAME_H = 2000;
  const { data, info } = await sharp(P('base_cut.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let bx0 = W, by0 = H, bx1 = 0, by1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] > 8) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
  }
  const padPx = Math.round(H * 0.01);
  const crop = { left: Math.max(0, bx0 - padPx), top: Math.max(0, by0 - padPx) };
  crop.width = Math.min(W, bx1 + padPx) - crop.left;
  crop.height = Math.min(H, by1 + padPx) - crop.top;
  const scale = GAME_H / crop.height;
  const gameW = Math.round(crop.width * scale);
  const dest = `public/images/characters/${CHAR}`;
  fs.mkdirSync(`${dest}/blink`, { recursive: true });
  // 底图像素 → 游戏图比例
  const X = x => +((x - crop.left) / crop.width).toFixed(4);
  const Y = y => +((y - crop.top) / crop.height).toFixed(4);
  const RX = r => +(r / crop.width).toFixed(4);
  const RY = r => +(r / crop.height).toFixed(4);

  const files = {};
  for (const emo of EMOS) {
    const name = `${OUTFIT}_${emo}`;
    await sharp(P(`${emo}.png`)).extract(crop).resize({ height: GAME_H }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${dest}/${name}.webp`);
    const b = blinkInfo[emo];
    let blink;
    if (b) {
      // 两帧竖着拼成一张小图：上半闭、下全闭
      const [rx, ry, rw, rh] = b.rect;
      const gw = Math.max(1, Math.round(rw * scale)), gh = Math.max(1, Math.round(rh * scale));
      const frames = await Promise.all(b.frames.map(f => sharp(P(`blink/${f}`)).resize(gw, gh, { fit: 'fill' }).png().toBuffer()));
      await sharp({ create: { width: gw, height: gh * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite(frames.map((f, i) => ({ input: f, left: 0, top: i * gh })))
        .webp({ quality: 92, alphaQuality: 100 }).toFile(`${dest}/blink/${name}.webp`);
      blink = { src: `/images/characters/${CHAR}/blink/${name}.webp`, rect: [X(rx), Y(ry), RX(rw), RY(rh)] };
    }
    files[name] = { blink, closed: b === null };
  }

  // 骨骼：头、脖子、身体、手、垂下来的头发
  const head = one('head') || { cx: face.cx, cy: face.cy - face.h * 0.3, w: face.w * 1.6, h: face.h * 1.8, y0: face.y0 - face.h * 0.6, y1: face.y1 };
  const torso = one('torso');
  const neckBox = one('neck');
  const neckY = neckBox ? neckBox.y1 - neckBox.h * 0.35 : face.y1 + face.h * 0.25;
  const hands = all('hand');
  const hair = all('hanging_hair');
  const bodyX = torso ? torso.cx : face.cx;
  const rig = {
    headC: [X(head.cx), Y(head.cy)],
    headR: [RX(head.w / 2 * 0.95), RY(head.h / 2 * 0.95)],
    neck: [X(face.cx), Y(neckY)],
    // 眼睛椭圆：没有眨眼帧时退回到压扁的老办法
    eyes: eyes.length === 2 ? eyes.sort((p, q) => p.cx - q.cx).map(e => [X(e.cx), Y(e.cy + e.h * 0.1), RX(e.w * 0.42), RY(e.h * 0.28)]) : undefined,
    body: [X(bodyX), RX(torso ? torso.w / 2 : face.w), Y(torso ? torso.y1 : face.y1 + face.h * 3), 0.985],
    exclude: hands.slice(0, 4).map(h => [X(h.cx), Y(h.cy), RX(h.w * 0.6), RY(h.h * 0.6)])
  };
  if (all('tails').length) {
    // 尾巴：默认支点在胯部（PuppetSprite 不写 sway 就是这样）
  } else if (hair.length) {
    const top = Math.min(...hair.map(h => h.y0));
    const bottom = Math.max(...hair.map(h => h.y1));
    const dx = hair.reduce((s, h) => s + Math.abs(h.cx - bodyX), 0) / hair.length;
    rig.sway = { pivotY: Y(Math.max(head.y0 + head.h * 0.15, top - head.h * 0.1)), pivotDX: RX(dx), amp: 0.45, maxY: Y(bottom) };
  } else {
    rig.sway = { pivotY: 0.1, pivotDX: 0.1, amp: 0 };
  }
  fs.writeFileSync(P('rig.json'), JSON.stringify({ char: CHAR, outfit: OUTFIT, size: [gameW, GAME_H], rig, files }, null, 1));
  log(`装好了：${Object.keys(files).length} 张 → ${dest}，骨骼写在 ${P('rig.json')}（跑 build-rigs.mjs 汇总）`);
}
