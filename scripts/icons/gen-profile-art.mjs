// ---------------------------------------------------------
// 🪪 主人公档案的美术：学生证上的证件照 + 五维徽章
//
//   node scripts/icons/gen-profile-art.mjs photo     # 证件照（照旧证件照的长相，画成立绘的画风）
//   node scripts/icons/gen-profile-art.mjs badges    # 五维徽章（和 emoji 图标同一套画风，透明底）
//
// 输出 public/images/ui/student_photo.webp 和 public/images/ui/stat_<key>.webp（覆盖旧的暗色徽章）
// ---------------------------------------------------------
import fs from 'fs';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
import { cutCell } from './keyout.mjs';
sharp.cache(false);

const STAGE = process.argv[2];
const OUT = '.generated/icons';
fs.mkdirSync(OUT, { recursive: true });
const cost = what => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tprofile/${what}\tgemini-3-pro-image\t2K\n`);

async function photo() {
  // 旧学生证左边那张照片：主角的长相以它为准（寸头、朴素、体格壮硕）
  const ref = `${OUT}/_old_photo.jpg`;
  await sharp('public/images/ui/student_id.webp').extract({ left: 30, top: 95, width: 205, height: 275 }).resize(600).jpeg({ quality: 92 }).toFile(ref);
  const hikari = 'public/images/character_cards/hikari/school_blazer_remake.webp';
  const style = `${OUT}/_style_ref.jpg`;
  await sharp(hikari).resize({ width: 1400 }).flatten({ background: '#e6e6e6' }).jpeg({ quality: 88 }).toFile(style);
  const parts = [
    { text: 'IDENTITY REFERENCE — this is the protagonist. Keep his face, buzz-cut hair, plain honest look and sturdy build exactly:' }, imagePart(ref),
    { text: 'ART STYLE REFERENCE — draw him in exactly this polished anime art style (lineart, cel shading, colouring), but do NOT copy this girl:' }, imagePart(style),
    { text: `A Japanese high-school student ID photo of the protagonist: a 17-year-old Chinese exchange student boy with a short buzz cut, plain kind face, calm straight eyebrows, dark eyes, sturdy broad-shouldered build. He wears the navy school blazer with a white shirt and a red striped tie, facing the camera straight on, head and shoulders, a small honest closed-mouth smile.
Plain flat pale sky-blue ID-photo background, even soft studio lighting. Portrait 3:4. Polished anime illustration, clean lineart, soft cel shading. No text, no frame, no border.` }
  ];
  const r = await generate({ parts, aspectRatio: '3:4', imageSize: '2K' });
  cost('photo');
  if (!r.images.length) throw new Error('没拿到图：' + r.finishReason);
  await sharp(r.images[0]).png().toFile(`${OUT}/student_photo_raw.png`);
  await sharp(r.images[0]).resize(600, 800, { fit: 'cover' }).webp({ quality: 90 }).toFile('public/images/ui/student_photo.webp');
  console.log('public/images/ui/student_photo.webp');
}

const BADGES = [
  ['knowledge', 'an open book with a glowing blue quill pen and a tiny star (knowledge)'],
  ['guts', 'a small fierce orange flame inside a round shield (courage)'],
  ['kindness', 'a soft pink heart with little angel wings and a sprig of cherry blossom (kindness)'],
  ['charm', 'a sparkling pink-violet gem with a red rose ribbon (charm)'],
  ['proficiency', 'a fountain pen writing on a page with a speech bubble (language skill)'],
  ['blank', 'a round gold medal with a ribbon']
];

async function badges() {
  const cells = BADGES.map(([, d], i) => `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}: ${d}`).join('\n');
  const prompt = `Draw an icon sheet: a 3×2 grid of 6 separate round emblem badges for a galgame character stat screen, each emblem a circular medallion with a soft pastel coloured rim, in 2 rows and 3 columns of equal cells.\n\n${cells}\n\n` +
    `Cute, polished Japanese mobile-game UI icon style: soft rounded shapes, a clean dark navy-brown outline of even thickness, soft cel shading with one gentle highlight, pastel but saturated colours. Each badge centred in its cell with clear empty space around it. Background: perfectly flat pure white (#FFFFFF), no shadows, no grid lines, no borders. No text, letters or numbers anywhere.`;
  const r = await generate({ parts: [{ text: prompt }], aspectRatio: '3:2', imageSize: '2K' });
  cost('badges');
  if (!r.images.length) throw new Error('没拿到图：' + r.finishReason);
  await sharp(r.images[0]).png().toFile(`${OUT}/badges.png`);
  console.log(`${OUT}/badges.png（用 gen-emoji-icons 同一套去底逻辑切：node scripts/icons/gen-profile-art.mjs cut）`);
}

// 徽章图集 3×2 → public/images/ui/stat_<key>.webp（透明底，覆盖旧的暗色徽章）
async function cut() {
  const f = `${OUT}/badges.png`;
  const { width: W, height: H } = await sharp(f).metadata();
  const cw = Math.floor(W / 3), ch = Math.floor(H / 2);
  for (let i = 0; i < 5; i++) {
    const key = BADGES[i][0];
    await cutCell(f, { left: (i % 3) * cw, top: Math.floor(i / 3) * ch, width: cw, height: ch }, `public/images/ui/stat_${key}.webp`, 256);
    console.log(key);
  }
}

if (STAGE === 'photo') await photo();
else if (STAGE === 'cut') await cut();
else if (STAGE === 'badges') await badges();
else console.log('用法：photo | badges | cut');
