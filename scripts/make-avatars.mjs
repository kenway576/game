// 从全身立绘里裁出头像。
//
// 圆形头像框里以前直接放的是立绘本身：立绘是 528×1400 的全身图，
// 塞进一个正方形的圆框、再 object-cover 一下，看到的就是**胸口**。
// 加 object-top 会好一点，但头顶还是只占圆框的上面一半——
// 因为头在整张图里只有 15% 高。
//
// 所以正确的做法不是调 CSS，是真的裁一张头像出来。
//
// 怎么找到头：
//   立绘是站姿，肩膀一定比头宽。逐行量不透明像素的横向跨度，
//   从上往下第一次"明显变宽"的那一行就是肩线。
//   头 = 内容顶端到肩线，再往下带一点脖子和领口。
//
// 用法： node scripts/make-avatars.mjs [--out public/images/avatars] [--size 256]

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => a.replace(/^--/, '').split('='))
);
const OUT = args.out || 'public/images/avatars';
const SIZE = Number(args.size || 256);
const ALPHA = 30;          // 算不算"有东西"的透明度门槛

const rowSpan = (data, w, y) => {
  let left = -1, right = -1;
  for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > ALPHA) { if (left < 0) left = x; right = x; }
  }
  return left < 0 ? null : { left, right, width: right - left + 1, cx: (left + right) / 2 };
};

// 头在整张立绘里占多高。
//
// 第一版是"逐行量宽度，第一次变宽的地方就是肩线"。这招在六个人身上好用，
// 在光身上不行：她头顶那根呆毛只有一百多像素宽，被当成了整个头，
// 于是裁出来的是一撮头发。稻荷也不行——她那张是横构图，肩线在很下面。
//
// 所以改成按比例：站姿立绘里头就是内容高度的两成出头，这个比例比
// "肩膀比头宽"稳得多。宽度方向的中心也不从最顶上取——呆毛、狐耳、
// 发簪都在最顶上，而且都是偏的——取头那一整段的中位数。
const HEAD_FRAC = 0.24;

const headBox = (data, w, h) => {
  let top = -1, bottom = -1;
  for (let y = 0; y < h; y++) if (rowSpan(data, w, y)) { if (top < 0) top = y; bottom = y; }
  if (top < 0) return null;

  const contentH = bottom - top + 1;
  const side = Math.round(contentH * HEAD_FRAC);

  // 头那一段的横向中心：按行取中位数，避开单侧的呆毛/耳朵/发饰
  const cxs = [];
  for (let y = top; y < Math.min(h, top + side); y++) {
    const s = rowSpan(data, w, y);
    // 太窄的行（呆毛那种）不参与定心
    if (s && s.width > side * 0.25) cxs.push(s.cx);
  }
  cxs.sort((a, b) => a - b);
  const cx = cxs.length ? cxs[Math.floor(cxs.length / 2)] : w / 2;

  const realSide = Math.min(side, Math.min(w, h));
  let left = Math.round(cx - realSide / 2);
  left = Math.max(0, Math.min(w - realSide, left));
  // 往上留一点余量，免得头顶贴着圆框边
  let topC = Math.max(0, Math.round(top - realSide * 0.06));
  topC = Math.min(h - realSide, topC);
  return { left, top: topC, width: realSide, height: realSide };
};

const run = async () => {
  const src = fs.readFileSync('constants.ts', 'utf8');
  const entries = [...src.matchAll(/\[CharacterId\.(\w+)\]:\s*\{[\s\S]{0,4000}?avatarUrl:\s*'([^']+)'/g)]
    .map(m => ({ id: m[1].toLowerCase(), url: m[2] }));

  fs.mkdirSync(OUT, { recursive: true });
  for (const { id, url } of entries) {
    const p = path.join('public', url);
    if (!fs.existsSync(p)) { console.log(`${id}: 立绘不存在 ${url}`); continue; }
    // Windows 下 sharp 会一直握着源文件，先读进内存再处理
    const buf = fs.readFileSync(p);
    const im = sharp(buf).ensureAlpha();
    const { data, info } = await im.raw().toBuffer({ resolveWithObject: true });
    const box = headBox(data, info.width, info.height);
    if (!box) { console.log(`${id}: 整张图都是透明的？`); continue; }
    const out = path.join(OUT, `${id}.webp`);
    await sharp(buf)
      .extract({ left: box.left, top: box.top, width: box.width, height: box.height })
      .resize(SIZE, SIZE, { fit: 'cover' })
      .webp({ quality: 92 })
      .toFile(out);
    console.log(`${id}: ${info.width}x${info.height} → 头 ${box.width}px @ (${box.left},${box.top}) → ${out}`);
  }
};

run().catch(e => { console.error(e); process.exit(1); });
