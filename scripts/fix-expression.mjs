// 🩹 修一张崩掉的表情立绘。
//
// 【为什么不是重新生成一张】
// 从零生成会漂：发色、瞳色、服装、构图、画风，每一样都可能变。
// 一套立绘里只要有一张漂了，切换表情的时候就会看见"换了个人"。
//
// 所以这里做的是**编辑**：拿同一个角色**已经画对的**那张当输入，
// 只让模型改脸。其余一切由原图决定，漂不了。
//
// 用法：
//   node scripts/fix-expression.mjs --char inari --from neutral --to surprised \
//     --desc "genuinely startled: eyes wide, eyebrows up, mouth slightly open"
//
//   --n 3            出 3 个候选
//   --adopt          直接写进 public（默认只写 .generated/fix/）
//
// 需要 GEMINI_API_KEY。

import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const has = (n) => process.argv.includes(`--${n}`);

const CHAR = arg('char');
const FROM = arg('from');
const TO = arg('to');
const DESC = arg('desc', '');
const N = Number(arg('n', 2));
const ADOPT = has('adopt');
const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!CHAR || !FROM || !TO) {
  console.error('用法：--char <角色> --from <源表情> --to <目标表情> --desc "<描述>" [--n 2] [--adopt]');
  process.exit(1);
}
if (!KEY) { console.error('缺 GEMINI_API_KEY'); process.exit(1); }

const DIR = path.resolve('public/images/characters', CHAR);
const SRC = path.join(DIR, `${FROM}.webp`);
if (!fs.existsSync(SRC)) { console.error('源图不存在：', SRC); process.exit(1); }

const OUT = path.resolve('.generated/fix', CHAR);
fs.mkdirSync(OUT, { recursive: true });

// 只改脸。这一段是整个脚本的核心，越啰嗦越安全。
const KEEP = [
  'This is an existing anime character sprite. Edit it, do not redraw it.',
  'Keep EVERYTHING identical: the same character, the exact same hairstyle and hair colour, the exact same eye colour,',
  'the same clothing, the same accessories and headpiece, the same body pose and hand positions,',
  'the same art style, line weight, cel shading and colour palette, the same framing, crop and camera angle,',
  'the same canvas size, and the same plain white background.',
  'Change ONLY the facial expression.',
  'Do NOT make the face cartoonish, chibi, super-deformed or comedic. Do NOT enlarge the eyes.',
  'Do NOT add drawn tears, sweat drops, blush marks, emotion symbols, speed lines or any manga effect symbols.',
  'Keep the face at the same size and in the same position, drawn at the same level of detail as the source.',
  'ABSOLUTELY NO TEXT anywhere in the image.'
].join(' ');

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
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 220)}`));
      const j = JSON.parse(body);
      const part = (j.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
      const d = part && (part.inlineData || part.inline_data);
      if (!d) return reject(new Error('返回里没有图片'));
      resolve(Buffer.from(d.data, 'base64'));
    });
  });
  req.on('error', reject);
  req.write(payload); req.end();
});

const run = async () => {
  // 立绘是透明底，先压到白底上——模型对透明通道的处理不稳定
  const meta = await sharp(SRC).metadata();
  const flat = await sharp(SRC).flatten({ background: { r: 255, g: 255, b: 255 } }).png().toBuffer();
  console.log(`源 ${CHAR}/${FROM}.webp  ${meta.width}x${meta.height} → ${TO}，${N} 个候选\n`);

  for (let i = 1; i <= N; i++) {
    process.stdout.write(`候选 ${i} ... `);
    try {
      const raw = await post(JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'image/png', data: flat.toString('base64') } },
            { text: `${KEEP}\n\nNew facial expression: ${DESC || TO}.` }
          ]
        }]
      }));
      const p = path.join(OUT, `${TO}_${i}.png`);
      await sharp(raw).png().toFile(p);
      const m = await sharp(raw).metadata();
      console.log(`OK ${m.width}x${m.height} → ${path.relative(process.cwd(), p)}`);
    } catch (e) { console.log('失败:', e.message); }
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n看过之后再决定用哪张：');
  console.log(`  node scripts/remove-white-bg.mjs .generated/fix/${CHAR}/${TO}_1.png`);
  console.log(`  然后覆盖到 public/images/characters/${CHAR}/${TO}.webp`);
};

run().catch(e => { console.error(e); process.exit(1); });
