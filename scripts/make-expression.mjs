// ---------------------------------------------------------
// 🙂 立绘重制：从底图生成一个表情
//
// 所有表情共用同一张身体，这样木偶骨骼只标一次、换表情时身体纹丝不动。
// 做法：
//   1. 把底图（带灰底的原图）发给模型，只改表情
//   2. 模型回来的图常常整体挪了几个像素：在脸周围一圈（头发、领口）里搜最佳位移对齐
//   3. 只取脸部椭圆那一块（眉眼口、腮红），羽化贴到已经抠好图的底图上
// 脸以外的像素一个都不用编辑图的，所以身体、头发、轮廓、透明度都和底图完全一样。
//
// 用法：
//   node scripts/make-expression.mjs --base .generated/remake/asuka/base_v3.png \
//     --cut .generated/remake/asuka/base_v3_cut.png --face 0.452,0.172,0.075,0.042 \
//     --emotion happy --out .generated/remake/asuka/school_happy.png
//
// --face 中心 x, 中心 y, 半宽, 半高（相对整张图的比例）
// 用的是 gemini-3-pro-image（走 Vertex），按张收费：一次只跑一张。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from './lib/gemini.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const BASE = arg('base'), CUT = arg('cut'), OUT = arg('out'), EMO = arg('emotion');
const FACE = String(arg('face', '')).split(',').map(Number);
const RAW = arg('raw');   // 已经有编辑图了（比如重新对齐），就不再调模型
if (!BASE || !CUT || !OUT || !EMO || FACE.length !== 4) {
  console.error('用法：--base <灰底底图> --cut <抠好的底图> --face cx,cy,rx,ry --emotion <情绪> --out <输出.png> [--raw <已有编辑图>]');
  process.exit(1);
}

// 情绪 → 怎么改脸。写得具体一点，模型才会改得明显
const EMOTIONS = {
  neutral:   'a calm, composed neutral expression: relaxed eyebrows, eyes open normally, mouth closed in a soft straight line',
  happy:     'a bright, genuinely happy smile: eyes curved warmly with joy, cheeks lifted, mouth open in a cheerful smile showing a little of the upper teeth',
  angry:     'visibly angry: eyebrows sharply furrowed down toward the nose, eyes narrowed in a glare, mouth in a tight scowl showing clenched teeth, a faint flush on the cheeks',
  sad:       'clearly sad and about to cry: inner ends of the eyebrows raised in a worried slant, eyes glistening with welling tears, gaze slightly lowered, corners of the mouth turned down',
  shy:       'bashful and flustered: a strong pink blush across both cheeks and the nose, eyes glancing away to the side, mouth in a small embarrassed pout',
  surprised: 'startled surprise: eyes wide open with small pupils, eyebrows raised high, mouth open in a small round "o"',
  smug:      'smug and teasing: one eyebrow slightly raised, eyes half-lidded with confidence, a small crooked smirk',
  pout:      'a sulky tsundere pout: cheeks slightly puffed, eyebrows drawn together, eyes looking away to the side, lips pushed into a small pout, light blush',
  smile:     'a soft, gentle closed-mouth smile: relaxed eyebrows, warm kind eyes, corners of the mouth gently lifted',
  thinking:  'thoughtful and pondering: eyes glancing up to the side, one eyebrow slightly raised, lips pressed together in concentration',
  curious:   'curious and interested: eyes bright and wide with attention, eyebrows raised a little, mouth in a small open "oh"',
  laugh:     'laughing out loud: eyes squeezed shut into happy arcs, mouth wide open in laughter, cheeks flushed',
  love:      'lovestruck and affectionate: a soft warm blush, eyes gentle and half-lidded looking at the viewer, a tender shy smile',
  jealous:   'jealous and sulky: eyes narrowed and glancing sideways, eyebrows drawn down, a small displeased frown, faint blush',
  sly:       'sly and knowing: eyes narrowed playfully, a mischievous sidelong glance, a small sly smile curling one corner of the mouth',
  cool:      'cool and confident: eyes calm and half-lidded, eyebrows relaxed, a small self-assured smirk'
};
if (!EMOTIONS[EMO]) { console.error('不认识的情绪：' + EMO + '，可选：' + Object.keys(EMOTIONS).join(' ')); process.exit(1); }

const PROMPT = `You are editing an existing character illustration. Return the SAME image with ONE change.

THE CHANGE: change ONLY her facial expression to ${EMOTIONS[EMO]}.

Everything else must stay exactly the same: identical pose, hands, body, outfit, hair (every strand in the same place), head position, head angle and head size, identical framing, identical art style, line quality and colouring, identical flat grey background. Do not move, redraw or restyle anything outside the eyes, eyebrows, mouth and cheek blush. Eye colour stays the same.`;

const raw = RAW || OUT.replace(/\.png$/, '_raw.png');
if (!RAW) {
  const r = await generate({ parts: [imagePart(BASE), { text: PROMPT }], aspectRatio: '9:16', imageSize: '4K' });
  if (!r.images.length) { console.error('没拿到图：', r.finishReason, r.text.slice(0, 400)); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await sharp(r.images[0]).png().toFile(raw);
}

// ---------- 对齐：在脸周围一圈里找位移 ----------
const baseImg = await sharp(BASE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = baseImg.info.width, H = baseImg.info.height;
const edit = await sharp(raw).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer();
const [cx, cy, rx, ry] = [FACE[0] * W, FACE[1] * H, FACE[2] * W, FACE[3] * H];

const gray = (buf, p) => buf[p * 3] * 0.3 + buf[p * 3 + 1] * 0.59 + buf[p * 3 + 2] * 0.11;
// 比较区域：脸椭圆外、2.2 倍椭圆内（头发、耳朵、领口），步长取样
const samples = [];
for (let y = Math.max(0, cy - ry * 2.2); y < Math.min(H, cy + ry * 2.2); y += 3) {
  for (let x = Math.max(0, cx - rx * 2.2); x < Math.min(W, cx + rx * 2.2); x += 3) {
    const e = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
    if (e > 1.4 && e < 4.8) samples.push([x | 0, y | 0]);
  }
}
const score = (dx, dy) => {
  let s = 0;
  for (const [x, y] of samples) {
    const ex = x + dx, ey = y + dy;
    if (ex < 0 || ey < 0 || ex >= W || ey >= H) { s += 255; continue; }
    s += Math.abs(gray(baseImg.data, y * W + x) - gray(edit, ey * W + ex));
  }
  return s / samples.length;
};
let best = { dx: 0, dy: 0, s: score(0, 0) };
const s0 = best.s;
for (let step of [8, 2, 1]) {
  const c = { ...best };
  const range = step === 8 ? 48 : step * 4;
  for (let dy = c.dy - range; dy <= c.dy + range; dy += step) {
    for (let dx = c.dx - range; dx <= c.dx + range; dx += step) {
      const s = score(dx, dy);
      if (s < best.s) best = { dx, dy, s };
    }
  }
}

// ---------- 贴脸 ----------
const cut = await sharp(CUT).ensureAlpha().raw().toBuffer();
const out = Buffer.from(cut);
for (let y = Math.floor(cy - ry * 1.1); y < cy + ry * 1.1; y++) {
  for (let x = Math.floor(cx - rx * 1.1); x < cx + rx * 1.1; x++) {
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const e = Math.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2);
    const w = e < 0.8 ? 1 : e > 1.05 ? 0 : 1 - (e - 0.8) / 0.25;
    if (w <= 0) continue;
    const p = y * W + x, ex = x + best.dx, ey = y + best.dy;
    if (ex < 0 || ey < 0 || ex >= W || ey >= H || cut[p * 4 + 3] < 250) continue;
    const q = ey * W + ex;
    for (let k = 0; k < 3; k++) out[p * 4 + k] = Math.round(cut[p * 4 + k] * (1 - w) + edit[q * 3 + k] * w);
  }
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);

// 检查图：底图脸 | 新表情脸
const box = { left: Math.max(0, Math.round(cx - rx * 2)), top: Math.max(0, Math.round(cy - ry * 3)), width: Math.round(rx * 4), height: Math.round(ry * 6) };
const a = await sharp(CUT).extract(box).flatten({ background: '#ccc' }).resize({ height: 500 }).png().toBuffer();
const b = await sharp(OUT).extract(box).flatten({ background: '#ccc' }).resize({ height: 500 }).png().toBuffer();
const m = await sharp(a).metadata();
await sharp({ create: { width: m.width * 2 + 8, height: 500, channels: 3, background: '#fff' } })
  .composite([{ input: a, left: 0, top: 0 }, { input: b, left: m.width + 8, top: 0 }]).jpeg({ quality: 90 })
  .toFile(OUT.replace(/\.png$/, '_check.jpg'));
console.log(`${OUT}  对齐位移 (${best.dx}, ${best.dy})  差异 ${s0.toFixed(1)} → ${best.s.toFixed(1)}`);
