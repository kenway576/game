// ---------------------------------------------------------
// 🎮 小游戏的美术：Beat Crash（真希，节奏机台）和句会（铃，百人一首 + 俳句）
//
//   node scripts/remake/gen-minigame-art.mjs [--only a,b] [--n 1]
//
// 输出 .generated/minigames/<key>_<n>.png，挑好的用 --install 装进 public/images/minigames/<key>.webp
//   node scripts/remake/gen-minigame-art.mjs --install key=2,key2=1
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const OUT = '.generated/minigames';
const PUB = 'public/images/minigames';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PUB, { recursive: true });

const BGSTYLE = 'Japanese visual novel background art in the style of the STYLE REFERENCE: Makoto Shinkai-like anime background, clean detailed linework, rich saturated colours, cinematic light, bloom. Absolutely NO people. NO readable text, NO logos, NO watermark (signs show only blurred unreadable shapes).';
const JACKET = 'A square album-cover illustration for a rhythm game song, vivid anime illustration style like BanG Dream! song jackets: bold composition, saturated colours, glowing light, sparkles, graphic shapes mixed with scenery. NO people, NO text, NO letters, NO logos, NO watermark.';
const STYLE_REFS = ['public/images/backgrounds/bg_classroom_morning.webp', 'public/images/backgrounds/bg_kobe_harbor_dusk.webp'];

const JOBS = [
  // ---- Beat Crash ----
  { key: 'beatcrash_bg', ar: '16:9', size: '2K', refs: true, out: 1920, prompt: `${BGSTYLE}\nSCENE: Inside a Japanese game center (arcade) under the elevated railway at night. In the centre stands a large rhythm-game cabinet: a tall screen showing four glowing coloured note lanes (cyan, magenta, yellow, green) falling toward a bright hit line, four big round arcade buttons on the deck below, magenta and cyan neon strips framing the cabinet, smoke-haze in the light. Rows of other cabinets and crane games glow in the background in soft bokeh. Floor reflects the neon. Moody, electric, exciting.` },
  { key: 'beatcrash_logo', ar: '16:9', size: '2K', out: 1600, prompt: 'A rhythm arcade game title logo on a pure black background: the words "BEAT CRASH" in big bold italic letters, glowing hot-pink and cyan neon tubes with a chrome bevel, a lightning-bolt slash through the middle, small sparkles and equalizer bars around it. Spell the text exactly BEAT CRASH, nothing else. Centered, with plenty of black margin. No other text.' },
  { key: 'jacket_velvet_pavement', ar: '1:1', size: '1K', out: 640, prompt: `${JACKET}\nTHEME "Velvet Pavement": a rain-wet Kobe street at night, deep velvet purple and crimson, glowing shop lights reflected in the pavement like liquid jewels, smooth jazzy mood.` },
  { key: 'jacket_stroll_through_the_arcade', ar: '1:1', size: '1K', out: 640, prompt: `${JACKET}\nTHEME "Stroll through the Arcade": the artwork fills the ENTIRE square edge to edge with no frame or margin. A covered Japanese shopping arcade (shotengai) under a glass roof, bright afternoon light, colourful paper lanterns and shop banners (no text), cheerful bouncy mood, confetti-like light specks.` },
  { key: 'jacket_opening_the_blinds', ar: '1:1', size: '1K', out: 640, prompt: `${JACKET}\nTHEME "Opening the Blinds": morning sunlight bursting through half-opened window blinds into a small apartment room, golden light stripes, a view of the harbour and blue sky, fresh and hopeful.` },
  { key: 'jacket_asphalt_tip_off', ar: '1:1', size: '1K', out: 640, prompt: `${JACKET}\nTHEME "Asphalt Tip-Off": an outdoor street basketball court at sunset, a basketball frozen mid-air above the hoop, orange and teal light, motion streaks, energetic and sporty.` },
  { key: 'jacket_three_oclock_in_kobe', ar: '1:1', size: '1K', out: 640, prompt: `${JACKET}\nTHEME "Three O'clock in Kobe": Kobe harbour at three in the afternoon, the red Port Tower and the white Maritime Museum roof, big summer clouds, sparkling sea, seagulls, breezy and bright.` },
  { key: 'jacket_arcade_high_score', ar: '1:1', size: '1K', out: 640, prompt: `${JACKET}\nTHEME "Arcade High Score": retro arcade neon explosion, pixel-art stars and a glowing joystick, magenta and electric-blue light beams, a giant shining high-score medal shape (no digits), intense and celebratory.` },
  // ---- 句会 ----
  { key: 'kukai_bg', ar: '16:9', size: '2K', refs: true, out: 1920, prompt: `${BGSTYLE}\nSCENE: A quiet tatami corner of a Japanese high school library set up for a poetry circle (句会) in late afternoon: a low wooden table with a spread of hyakunin-isshu karuta cards, a few long paper poem strips (tanzaku), an inkstone and a brush, a cup of green tea steaming, tall bookshelves behind, a big window with autumn maple leaves glowing gold in the sunlight, soft dust in the light beams.` },
  { key: 'washi_card', ar: '3:4', size: '1K', out: 600, prompt: 'Flat front view of a single blank traditional Japanese karuta card filling the whole frame edge to edge: cream-coloured washi paper with visible soft fibres and a few tiny gold flecks, a thin dark green border line inset from the edge. Completely empty in the middle — NO text, NO characters, NO illustration. Even, flat lighting, no shadow, no background visible.' },
  { key: 'tanzaku_strip', ar: '21:9', size: '1K', out: 1400, prompt: 'Flat top-down view of a long horizontal strip of elegant Japanese washi paper filling the whole frame edge to edge: pale ivory with subtle fibres, faint drifting gold leaf flecks and a soft wash of pale indigo at one end. Completely blank — NO text, NO characters. Even flat lighting, no shadow, no background visible.' },
  { key: 'menu_hyakunin', ar: '4:3', size: '1K', out: 800, prompt: 'A beautiful anime illustration, no people: hyakunin-isshu karuta cards fanned out on a tatami mat, cards with elegant unreadable calligraphy and small courtly illustrations, a red and gold card box lid beside them, warm afternoon light and soft shadows, a few red maple leaves. No readable text.' },
  { key: 'menu_haiku', ar: '4:3', size: '1K', out: 800, prompt: 'A beautiful anime illustration, no people: a calligraphy brush resting on an inkstone beside blank long paper tanzaku strips, a branch of cherry blossom and a few falling petals, a tiny cup of green tea, soft spring light on a wooden table. No readable text.' }
];

if (arg('install')) {
  for (const kv of String(arg('install')).split(',')) {
    const [key, n] = kv.split('=');
    const j = JOBS.find(x => x.key === key); if (!j) { console.log('没有', key); continue; }
    const src = path.join(OUT, `${key}_${n || 1}.png`);
    let img = sharp(src);
    if (key === 'beatcrash_logo') img = img.trim({ threshold: 18 });   // 去掉多余的黑边
    if (key === 'tanzaku_strip') img = sharp(await sharp(src).trim({ background: '#ffffff', threshold: 14 }).toBuffer());   // 生成图四周有一圈白边
    await img.resize({ width: j.out, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(PUB, `${key}.webp`));
    console.log('装好', key);
  }
  process.exit(0);
}

const only = arg('only') ? String(arg('only')).split(',') : null;
const N = Number(arg('n', 1));
const small = async f => { const o = path.join(OUT, '_ref_' + path.basename(f).replace(/\.[a-z]+$/i, '.jpg')); if (!fs.existsSync(o)) await sharp(f).resize({ width: 1280 }).jpeg({ quality: 88 }).toFile(o); return o; };
const run = async j => {
  const parts = [];
  if (j.refs) { parts.push({ text: 'STYLE REFERENCE backgrounds:' }); for (const f of STYLE_REFS) parts.push(imagePart(await small(f))); }
  parts.push({ text: j.prompt });
  for (let i = 0; i < N; i++) {
    const k = fs.readdirSync(OUT).filter(f => f.startsWith(j.key + '_') && /_\d+\.png$/.test(f)).length + 1;
    try {
      const r = await generate({ parts, aspectRatio: j.ar, imageSize: j.size });
      fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tminigame/${j.key}\tgemini-3-pro-image\t${j.size}\n`);
      if (!r.images.length) { console.log(`${j.key} 没拿到图：${r.finishReason}`); continue; }
      const out = path.join(OUT, `${j.key}_${k}.png`);
      await sharp(r.images[0]).png().toFile(out);
      console.log(out);
    } catch (e) { console.log(`${j.key} 出错：${e.message.slice(0, 160)}`); }
  }
};
const list = JOBS.filter(j => !only || only.includes(j.key));
let next = 0;
await Promise.all(Array.from({ length: Number(arg('jobs', 3)) }, async () => { while (next < list.length) await run(list[next++]); }));
