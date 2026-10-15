// ---------------------------------------------------------
// 🎨 把游戏里用到的每一个 emoji 换成专门画的图标
//
//   node scripts/audit-emoji.mjs --json               # 先收集 emoji 清单 → .generated/icons/emoji_list.json
//   node scripts/icons/gen-emoji-icons.mjs sheets      # 每 16 个一张 4×4 图集（gemini-3-pro-image）
//   node scripts/icons/gen-emoji-icons.mjs cut         # 切格、去白底、装进 public/images/icons/emoji/，写 data/emojiIcons.ts
//   node scripts/icons/gen-emoji-icons.mjs sheets --only 3,7 --n 2     # 重画某几张（存成 sheet_03_2.png，不覆盖原图）
//
// 画风：可爱精致的日系手游 / galgame UI 图标——圆润、一圈均匀的深色描边、柔和的赛璐璐阴影。
// 描边是去背景的关键：从每一格的四边往里"灌水"，把连通的白底抠掉，被描边围住的白色（米饭、牛奶、云）不会被误抠。
// 文件名是码位：🍙 → u1f359.webp（变体选择符 U+FE0F 不算）。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate } from '../lib/gemini.mjs';
import { cutCell } from './keyout.mjs';
sharp.cache(false);

const STAGE = process.argv[2];
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const OUT = '.generated/icons';
const PUB = 'public/images/icons/emoji';
const LIST = JSON.parse(fs.readFileSync(`${OUT}/emoji_list.json`, 'utf8'));
const NAMES = Object.fromEntries(fs.readFileSync(`${OUT}/names.txt`, 'utf8').trim().split('\n').map(l => { const i = l.indexOf(' '); return [l.slice(0, i), l.slice(i + 1).trim()]; }));
const PER = 16, COLS = 4;
// 最后一张不满 16 个：按 4 列排是扁扁的 4×2，模型会自己改成 3×2 还画上格线。6 个以内就用 3 列、3:2 的画布
const colsOf = g => g.length <= 6 ? 3 : COLS;
const aspectOf = g => colsOf(g) === 3 && g.length > 3 ? '3:2' : '1:1';

export const codeOf = e => [...e.replace(/\uFE0F/g, '')].map(c => c.codePointAt(0).toString(16)).join('-');

// 游戏里的意思和 Unicode 名字不一样、或者照名字画会画错的，单独写
const OVERRIDE = {
  '🗺': 'a folded paper town map with a red location pin',
  '🐛': 'a cute little green caterpillar (fishing bait)',
  '🗼': 'the red steel lattice Kobe Port Tower (hourglass-shaped red tower)',
  '🎌': 'two small crossed festival pennant flags in red and white (no national flags)',
  '🌉': 'a suspension bridge lit up at night over the sea',
  '▶': 'a rounded play button triangle pointing right', '◀': 'a rounded triangle pointing left',
  '⏭': 'a skip-forward button (double triangle with a bar)', '⏸': 'a pause button (two rounded bars)',
  '🔽': 'a small rounded triangle pointing down', '⬆': 'a thick rounded arrow pointing up', '⬇': 'a thick rounded arrow pointing down',
  '🔝': 'a rounded badge with a thick arrow pointing up', '🔄': 'two curved arrows forming a circle (refresh)',
  '〰': 'a short wavy line', '⚪': 'a plain white circle token', '🔤': 'three alphabet letter blocks (A, B, C on toy blocks)',
  '❌': 'a soft red rounded X mark', '✅': 'a green rounded square with a white check mark', '❓': 'a rounded question mark', '❗': 'a rounded red exclamation mark',
  '⚠': 'a yellow rounded triangle warning sign with an exclamation mark', '💢': 'a red anime anger vein symbol',
  '💦': 'two blue sweat droplets', '💨': 'a small white puff of wind dash', '💤': 'three floating Z letters for sleep', '💥': 'a starburst collision spark',
  '♥': 'a glossy pink heart', '❤': 'a glossy red heart', '🖤': 'a glossy dark navy heart',
  '🙂': 'a cute round chibi face sticker, gentle smile', '😊': 'a cute round chibi face sticker, happy closed-eye smile with blush',
  '😴': 'a cute round chibi face sticker, sleeping', '🤣': 'a cute round chibi face sticker, laughing with tears', '😭': 'a cute round chibi face sticker, crying waterfall tears',
  '😅': 'a cute round chibi face sticker, awkward smile with a sweat drop', '🤔': 'a cute round chibi face sticker, thinking with hand on chin', '😷': 'a cute round chibi face sticker wearing a white medical mask',
  '🧍': 'a simple standing person silhouette figure', '🚶': 'a simple walking person silhouette figure', '🏃': 'a simple running person silhouette figure',
  '👤': 'a simple person bust silhouette avatar', '🗣': 'a person head silhouette speaking with sound lines',
  '🙇': 'a small chibi person bowing deeply', '🙆': 'a small chibi girl making a big circle with her arms (OK)', '🙅': 'a small chibi girl crossing her arms in an X (no)', '💇': 'a small chibi girl getting a haircut with scissors',
  '🎽': 'a running tank top with a sash', '📛': 'a tulip-shaped Japanese kindergarten name badge (blank, no text)', '🚸': 'a yellow children-crossing road sign (silhouettes, no text)',
  '🎴': 'a hanafuda flower playing card', '🃏': 'a joker playing card (no letters)', '🍢': 'oden skewer (triangle konnyaku, round fish cake, daikon)',
  '🔪': 'a Japanese kitchen knife (hocho)', '🫕': 'a small fondue pot', '🛢': 'an oil drum barrel', '🗿': 'a moai stone head statue',
  '🦄': 'a cute unicorn head', '💴': 'a Japanese yen banknote (no readable text)', '🎫': 'a ticket stub (no text)', '🔋': 'a full green battery',
  '📕': 'a closed red book', '📘': 'a closed blue book', '📗': 'a closed green book', '📒': 'a yellow ledger notebook', '📓': 'a black composition notebook', '📔': 'a decorated notebook',
  '📜': 'a rolled parchment scroll', '📝': 'a memo pad with a pencil', '📋': 'a clipboard with a blank sheet', '📰': 'a folded newspaper (no readable text)',
  '💾': 'a floppy disk', '💿': 'a shiny CD', '📀': 'a golden DVD disc', '🎬': 'a film clapperboard (no text)',
  '♨': 'the hot spring symbol: three wavy steam lines rising from a bowl', '⚗': 'a glass alembic flask', '🫛': 'a green pea pod', '🫧': 'a few iridescent soap bubbles',
};

const desc = e => OVERRIDE[e] || (NAMES[e] || e).toLowerCase().replace(/ symbol$/, '').replace(/^black /, '').replace(/^heavy /, '');

const STYLE = `Cute, polished Japanese mobile-game UI icons in the style of a galgame / otome game item set:
soft rounded shapes, a clean dark navy-brown outline of even medium thickness around every icon, soft cel shading with one gentle highlight, pastel but saturated colours, a thin white inner rim light.
Each icon is ONE single object, shown whole, centred in its cell, filling about 70% of the cell, with clear empty space around it so no icon touches another or the cell edge.
Background: perfectly flat pure white (#FFFFFF) everywhere, no gradients, no cast shadows on the background, no grid lines, no borders, no cell frames, no rounded-square tiles or app-icon backgrounds behind the icons.
Absolutely no text, letters, numbers, captions or labels anywhere (except where an icon itself is letters on toy blocks).`;

async function sheets() {
  fs.mkdirSync(`${OUT}/sheets`, { recursive: true });
  const groups = [];
  for (let i = 0; i < LIST.length; i += PER) groups.push(LIST.slice(i, i + PER));
  const only = arg('only') ? String(arg('only')).split(',').map(Number) : null;
  let next = 0;
  const run = async gi => {
    // --n 2：重画存成 sheet_XX_2.png，不覆盖原来那张；切的时候用 --pick<XX> 2 选它
    const out = `${OUT}/sheets/sheet_${String(gi).padStart(2, '0')}${arg('n') ? '_' + arg('n') : ''}.png`;
    if (fs.existsSync(out)) { console.log(`sheet ${gi} 已有`); return; }
    const g = groups[gi];
    const C = colsOf(g), R = Math.ceil(g.length / C);
    const cells = g.map((e, i) => `Row ${Math.floor(i / C) + 1}, column ${(i % C) + 1}: ${desc(e)}`).join('\n');
    const prompt = `Draw an icon sheet: a ${C}×${R} grid of ${g.length} separate icons, arranged in ${R} rows and ${C} columns of equal square cells, reading left to right, top to bottom.\n\n${cells}\n\n${STYLE}`;
    try {
      const r = await generate({ parts: [{ text: prompt }], aspectRatio: aspectOf(g), imageSize: '2K' });
      fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\ticons/sheet_${gi}\tgemini-3-pro-image\t2K\n`);
      if (!r.images.length) { console.log(`sheet ${gi} 没拿到图：${r.finishReason}`); return; }
      await sharp(r.images[0]).png().toFile(out);
      console.log(out);
    } catch (e) { console.log(`sheet ${gi} 出错：${e.message.slice(0, 160)}`); }
  };
  const todo = groups.map((_, i) => i).filter(i => !only || only.includes(i));
  await Promise.all(Array.from({ length: Number(arg('jobs', 3)) }, async () => { while (next < todo.length) await run(todo[next++]); }));
}

async function cut() {
  fs.mkdirSync(PUB, { recursive: true });
  const map = {};
  const groups = [];
  for (let i = 0; i < LIST.length; i += PER) groups.push(LIST.slice(i, i + PER));
  for (let gi = 0; gi < groups.length; gi++) {
    const pick = arg(`pick${gi}`);
    const f = `${OUT}/sheets/sheet_${String(gi).padStart(2, '0')}${pick ? '_' + pick : ''}.png`;
    if (!fs.existsSync(f)) { console.log(`sheet ${gi} 还没有`); continue; }
    const img = sharp(f).ensureAlpha();
    const { width: W, height: H } = await img.metadata();
    const C = colsOf(groups[gi]), rows = Math.ceil(groups[gi].length / C);
    const cw = Math.floor(W / C), ch = Math.floor(H / rows);
    for (let k = 0; k < groups[gi].length; k++) {
      const e = groups[gi][k];
      const cx = (k % C) * cw, cy = Math.floor(k / C) * ch;
      const code = codeOf(e);
      // 四边各收 2.5%：有的图集在格子交界处画了淡淡的格线，不收进来就会被当成图标的一部分
      const ix = Math.round(cw * 0.025), iy = Math.round(ch * 0.025);
      if (!(await cutCell(f, { left: cx + ix, top: cy + iy, width: cw - 2 * ix, height: ch - 2 * iy }, `${PUB}/u${code}.webp`))) { console.log(`  ${e} 空格`); continue; }
      map[e] = `u${code}`;
    }
    console.log(`sheet ${gi} 切好了`);
  }
  fs.writeFileSync('data/emojiIcons.ts', `// 自动生成：node scripts/icons/gen-emoji-icons.mjs cut —— 别手改
// emoji（去掉 U+FE0F）→ public/images/icons/emoji/<文件名>.webp。用法见 components/Emo.tsx
export const EMOJI_ICONS: Record<string, string> = ${JSON.stringify(map, null, 1)};
`);
  console.log('写好了 data/emojiIcons.ts', Object.keys(map).length, '个');
}

if (STAGE === 'sheets') await sheets();
else if (STAGE === 'cut') await cut();
else console.log('用法：sheets | cut');
