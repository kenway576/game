// 🩹 拿一张已有的图当输入，只改指定的那一处。
//
// 【为什么不是重画一张】
// 背景图从零生成会漂：构图、光线、时间、季节全都可能变。
// 而背景最常见的毛病是**汉字写错**——生图模型画中日文几乎必错，
// 一张构图和光线都很好的图，往往只是横幅上四个字是乱码。
// 为这四个字重掷十次，得到的是十张构图不同的新图。
//
// 所以这里做的是编辑：原图进去，"只改这一处"出来。
//
// 用法：
//   GEMINI_API_KEY=... node scripts/edit-image.mjs \
//     --in .generated/juku/juku_night_2.png \
//     --out .generated/juku/fixed.png \
//     --n 3 \
//     --edit "The banner above the whiteboard must read exactly 合格祈願"
//
//   --adopt <目标路径>   满意的话直接写到 public（默认只写 .generated/）
//
// 需要 GEMINI_API_KEY。

import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };

const IN = arg('in');
const OUT = arg('out');
const EDIT = arg('edit');
const N = Number(arg('n', 1));
const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!IN || !OUT || !EDIT) {
  console.error('用法：--in <原图> --out <输出> --edit "只改什么" [--n 3]');
  process.exit(1);
}
if (!KEY) { console.error('缺 GEMINI_API_KEY'); process.exit(1); }

// 「什么都别动」这一段是这个脚本的全部意义所在，写得越硬越好。
const PROMPT = `You are editing an existing image. Return the SAME image with ONE change.

THE CHANGE: ${EDIT}

Everything else must be byte-for-byte the same idea as the input: identical
camera angle, identical perspective, identical composition and framing,
identical furniture placement, identical lighting direction and colour
temperature, identical time of day and weather, identical art style, identical
level of detail. Do not redraw the scene. Do not move anything. Do not add or
remove any object. Do not change the palette.

If the change involves Japanese or Chinese characters, render them correctly
and legibly, with correct stroke counts, in a style that matches the surface
they are written on.`;

const post = (payload) => new Promise((resolve, reject) => {
  const req = https.request({
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(KEY),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
  }, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error(body.slice(0, 400))); }
    });
  });
  req.on('error', reject);
  req.write(payload);
  req.end();
});

const run = async () => {
  const raw = fs.readFileSync(IN);
  const mime = IN.endsWith('.png') ? 'image/png' : IN.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const payload = JSON.stringify({
    contents: [{
      parts: [
        { inlineData: { mimeType: mime, data: raw.toString('base64') } },
        { text: PROMPT }
      ]
    }]
  });

  for (let i = 1; i <= N; i++) {
    const j = await post(payload);
    const part = (j.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
    const d = part && (part.inlineData || part.inline_data);
    if (!d) {
      console.error(`#${i} 没拿到图：`, JSON.stringify(j).slice(0, 300));
      continue;
    }
    const buf = Buffer.from(d.data, 'base64');
    const dest = N === 1 ? OUT : OUT.replace(/(\.[a-z]+)$/, `_${i}$1`);
    await sharp(buf).toFile(dest);
    const m = await sharp(dest).metadata();
    console.log(`${path.basename(dest)} ... OK ${m.width}x${m.height}`);
  }
};

run().catch(e => { console.error(e.message); process.exit(1); });
