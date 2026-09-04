// 🎫 拼一张学生证。
//
// 【为什么不整张交给模型画】
// 因为卡上有字。图像模型写不对日文汉字——现在 public 里那张学生证上
// 的「港見高校」就是一堆看着像字的乱码，凑近看全是假的。
//
// 所以照片交给模型（那是它擅长的），卡面自己拼：
// 圆角、校名条、照片框、栏位线全部用 SVG 画，字是真的字。
//
// 姓名那一栏**故意留空**：玩家的名字是序章里自己输的，
// 烤进图片就写死了。留白之后由界面用 CSS 叠上去，
// 这样同一张底图对每个存档都成立。
//
// 用法：
//   node scripts/build-student-id.mjs --photo .generated/misc/idphoto_1.png \
//     --out public/images/ui/student_id.webp

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };

const PHOTO = arg('photo');
const OUT = arg('out', 'public/images/ui/student_id.webp');
if (!PHOTO || !fs.existsSync(PHOTO)) { console.error('缺 --photo'); process.exit(1); }

// 卡片按真实学生证的比例：85.6 × 54 mm，放大到 1200 宽
const W = 1200, H = Math.round(1200 * 54 / 85.6);   // 1200 × 757
const PAD = 46;
const PHOTO_W = 300, PHOTO_H = Math.round(PHOTO_W * 4 / 3);

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// 照片：裁成 3:4 的证件照比例
const photo = await sharp(fs.readFileSync(PHOTO))
  .resize(PHOTO_W, PHOTO_H, { fit: 'cover', position: 'top' })
  .toBuffer();

const HEADER_H = 108;
const row = (i) => HEADER_H + 92 + i * 96;      // 右侧栏位的基线

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fdfdfb"/><stop offset="100%" stop-color="#f0efe9"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1e3a5f"/><stop offset="100%" stop-color="#2c5282"/>
    </linearGradient>
    <clipPath id="round"><rect x="0" y="0" width="${W}" height="${H}" rx="34" ry="34"/></clipPath>
  </defs>

  <g clip-path="url(#round)">
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#card)"/>

    <!-- 校名条 -->
    <rect x="0" y="0" width="${W}" height="${HEADER_H}" fill="url(#bar)"/>
    <text x="${PAD}" y="52" font-family="Yu Gothic, Meiryo, MS Gothic, sans-serif"
          font-size="27" fill="#a8c6e8" letter-spacing="5">兵庫県立</text>
    <text x="${PAD}" y="90" font-family="Yu Gothic, Meiryo, MS Gothic, sans-serif"
          font-size="42" font-weight="bold" fill="#ffffff" letter-spacing="7">港見高等学校</text>
    <text x="${W - PAD}" y="70" text-anchor="end"
          font-family="Yu Gothic, Meiryo, MS Gothic, sans-serif"
          font-size="24" fill="#8fb4de" letter-spacing="4">学 生 証</text>

    <!-- 照片框 -->
    <rect x="${PAD}" y="${HEADER_H + 40}" width="${PHOTO_W}" height="${PHOTO_H}"
          fill="#e8e8e2" stroke="#c8c8c0" stroke-width="3"/>

    <!-- 右侧栏位 -->
    ${[
      ['氏　　名', ''],
      ['学年・組', '二年 B 組'],
      ['生徒番号', '2 - B - 34'],
      ['有効期限', '令和八年三月三十一日']
    ].map(([label, value], i) => `
      <text x="${PAD + PHOTO_W + 56}" y="${row(i)}"
            font-family="Yu Gothic, Meiryo, MS Gothic, sans-serif"
            font-size="24" fill="#7a7a72" letter-spacing="3">${esc(label)}</text>
      <line x1="${PAD + PHOTO_W + 200}" y1="${row(i) + 10}" x2="${W - PAD}" y2="${row(i) + 10}"
            stroke="#c9c9c0" stroke-width="2"/>
      <text x="${PAD + PHOTO_W + 216}" y="${row(i)}"
            font-family="Yu Gothic, Meiryo, MS Gothic, sans-serif"
            font-size="30" fill="#22303f" letter-spacing="2">${esc(value)}</text>
    `).join('')}

    <!-- 校徽（简单的锚 + 圈，港口的学校） -->
    <g transform="translate(${W - 128}, ${H - 128})" opacity="0.28">
      <circle cx="0" cy="0" r="62" fill="none" stroke="#1e3a5f" stroke-width="5"/>
      <path d="M0,-34 L0,34 M-24,10 A24,24 0 0 0 24,10 M-16,-24 L16,-24"
            fill="none" stroke="#1e3a5f" stroke-width="6" stroke-linecap="round"/>
      <circle cx="0" cy="-40" r="8" fill="#1e3a5f"/>
    </g>

    <!-- 塑封的一道反光 -->
    <path d="M ${W * 0.52} 0 L ${W * 0.74} 0 L ${W * 0.30} ${H} L ${W * 0.08} ${H} Z"
          fill="#ffffff" opacity="0.10"/>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="34" ry="34"
        fill="none" stroke="#d8d8d0" stroke-width="2"/>
</svg>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
await sharp(Buffer.from(svg))
  .composite([{ input: photo, left: PAD + 3, top: HEADER_H + 43 }])
  .webp({ quality: 95 })
  .toFile(OUT);

const m = await sharp(OUT).metadata();
console.log(`学生证 → ${OUT}  ${m.width}x${m.height}`);
console.log('姓名栏留空，界面上用 CSS 叠玩家的名字。');
