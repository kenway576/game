// ============================================================================
// 标题画面主视觉（一套，轮播用）
//
// 参考画风：Persona 5: The Phantom X 的官方壁纸——粗而干净的线、高饱和有限色、
// 黑红蓝斜切色块 + 网点、强对角构图。游戏本身的 UI 就是 P5 那一套。
//
// 【为什么是一套而不是一张】
// 模型出图是 1344x768。八个人塞进这个分辨率，一张脸只剩不到一百像素宽，
// 五官就是糊的——再怎么调提示词也救不回来，那是像素不够，不是画得不好。
// 所以除了一张全员海报，其余几张各只放一到三个人：同样的画布，
// 每张脸能分到三到五倍的像素，脸才画得出来。
// 顺便每张换一个游戏里真实存在的地点，标题轮播时也顺手展示了地图。
//
// 【硬约束】
//   · 16:9
//   · 左侧 45% 必须干净——KOBE STUDY 的标题块和两个按钮压在那儿。
//     这条得用百分比写死，"左三分之一保持安静"模型完全不当回事。
//   · 画面里不能有任何文字。
//
// 【不要用 --edit 修脸】
// 图生图会把整张图重渲染一遍，线条一轮比一轮糊，改一个小地方也是全图重画。
// 发色、肤色这类问题的正确做法是改 CAST 里的描述然后重出，不是拿成品去修。
// --edit 留着，但只适合"我认了这张会掉一档画质"的场合。
//
// 用法：
//   GEMINI_API_KEY=xxx node scripts/gen-title-art.mjs              # 出全部
//   GEMINI_API_KEY=xxx node scripts/gen-title-art.mjs ensemble     # 只出指定的
//   GEMINI_API_KEY=xxx node scripts/gen-title-art.mjs --list
//   GEMINI_API_KEY=xxx node scripts/gen-title-art.mjs --edit <图> "<改什么>"
//
// 出到 .generated/title/（不进版本库），挑中的再拷进 public/images/ui/title/。
// ============================================================================
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, '.generated', 'title');

function readKey() {
  for (const k of ['GEMINI_API_KEY', 'VITE_GEMINI_API_KEY', 'VITE_GOOGLE_API_KEY', 'GOOGLE_API_KEY']) {
    if (process.env[k]) return process.env[k];
  }
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return '';
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?(VITE_GOOGLE_API_KEY|VITE_GEMINI_API_KEY|GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*(.+)\s*$/);
    if (m) return m[2].trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

// 画风。这一段所有图共用，改它等于改整套。
const STYLE = [
  'Key visual illustration for a Japanese romance visual novel, drawn in the style of Persona 5: The Phantom X promotional art.',
  'Bold clean confident linework, high-saturation limited palette, flat graphic cel shading with hard shadow edges.',
  'Graphic design elements woven into the artwork: sharp diagonal colour blocks, halftone dot fields, angular geometric shards.',
  'Strong diagonal composition, dramatic contrast, glossy anime finish.',
  'THE FACES MATTER MOST: draw every face large, clean and beautiful - crisp eyelash linework, sharp catchlights in the eyes,',
  'clear pupils and irises, delicate eyebrows, smooth even skin shading. No smudged, muddy or blurred features.',
  'Cinematic 16:9 widescreen game title screen.',
  'ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks, no signature anywhere in the image.'
].join(' ');

// 构图约束。保护的是 UI，不是画面。
const LAYOUT = [
  'HARD COMPOSITION RULE, obey this before anything else: the leftmost 45 percent of the image is background only',
  '- sky, distant scenery, or a soft colour field. No person, no face and no bright busy detail may enter that area,',
  'because a large game logo and two big menu buttons sit there. The nearest character begins at 48 percent from the left edge.'
].join(' ');

// 角色设定。只写"一眼能认出是谁"的那几个特征——形容词堆多了模型反而糊成一团。
const CAST = {
  asuka:  'a proud girl with long crimson-red twin tails tied with red ribbons and sharp red eyes, in a white school shirt with a big red bow tie and a navy pleated skirt',
  hikari: 'a bright cheerful girl with long golden-blonde hair, one stray ahoge and warm amber eyes, in orange dungarees over a white tee',
  rei:    'a quiet girl with pale ice-blue chin-length hair, thin glasses and pale grey-blue eyes, in a navy blazer and a green plaid skirt, holding a book',
  // 立绘里空是小麦色（日焼け），不是黑人。第一版写成 dark-skinned，
  // 四张候选全部把她画成了黑人——肤色这种词必须把范围卡死，模型不会往中间取。
  // “假小子”写成 tomboy 的后果是模型直接画个男生。
  // 得把“她是女孩”和“她帅”分开说：面部先锁成少女，气质再给到中性。
  sora:   'a seventeen-year-old JAPANESE GIRL who plays basketball - unmistakably feminine: a soft rounded jawline, big bright eyes with long lashes, delicate brows, a small nose - with short tousled brown hair in a boyish cut and a LIGHT SUN-TANNED complexion, lightly bronzed from outdoor sport, definitely NOT dark-skinned and NOT black, in an orange basketball jersey. She reads as a cheerful sporty schoolgirl, never as a boy',
  maki:   'a small pink-haired girl with a side ponytail, a black cat-ear headband and pink headphones round her neck, denim vest over a purple tee and white shorts',
  nao:    'a girl with warm brown hair in a ponytail and brown eyes, in a navy school blazer with a red ribbon tie',
  // “older woman” 被画成了四十多岁。她是年上的邻居お姉さん，不是中年人。
  miyuki: 'a graceful young woman of about twenty-four - a smooth youthful face with no wrinkles and no heavy makeup, gentle grey eyes, a soft quiet smile - with very long straight silver-white hair, in a soft beige cardigan and a long dark skirt',
  // 稻荷的头发反复被画成银色，要写死，而且要和深雪的银发拉开距离。
  inari:  'a fox deity with long BRIGHT ORANGE hair (never white, never silver), golden eyes, fox ears and several large orange fox tails, in a vivid teal and gold kimono patterned with white cranes, holding a gold folding fan, pale blue fox-fire drifting around her'
};

const c = (...ids) => ids.map(id => CAST[id]).join('; ');

// 一套五张。第一张是海报，其余四张是"少人多脸"。
const CANDIDATES = {
  // ① 全员海报。人最多、脸最小，但一套里必须有一张把八个人都摆出来。
  ensemble: [
    LAYOUT,
    'The setting is Kobe, Japan, from the top of the Kitano slope looking down to the sea:',
    'Western hillside houses with green copper roofs, the lights of downtown below, the harbour beyond,',
    'the red lattice Kobe Port Tower and a lit ferris wheel on the waterfront, the Rokko ridge behind.',
    'Late April, cherry petals in the air, the ten minutes between sunset and night: deep orange-to-violet sky, city lights just on.',
    'EXACTLY EIGHT girls stand on the slope in the right 55 percent, staggered in depth so their heads sit at different heights - not a flat row.',
    'All eight faces are clearly drawn and beautiful. Nearest:', c('asuka', 'maki'), '.',
    'Behind them:', c('hikari', 'nao'), '. Behind those:', c('sora', 'rei'), '.',
    'Furthest, still fully drawn:', c('miyuki', 'inari'), '.',
    'A cherry tree in full bloom leans in from the top right. They are turned back up the hill toward the viewer.'
  ].join(' '),

  // ② 校门的早上。三个人，脸能画大。
  school: [
    LAYOUT,
    'Morning at a Japanese high school gate in Kobe under a huge cherry tree in full bloom, petals falling thickly,',
    'the sea visible far below between the buildings, clean spring light, blue sky.',
    'EXACTLY THREE girls in the right 55 percent, close to the viewer, seen from the waist up, faces large and beautifully rendered:',
    c('asuka', 'hikari', 'nao'), '.',
    'They walk toward the viewer together, mid-conversation: one laughing, one exasperated, one warm and amused.'
  ].join(' '),

  // ③ 夜里的高架下。两个人，霓虹，最像 bestdori 卡面的一张。
  night: [
    LAYOUT,
    'Night under a railway viaduct in Sannomiya, Kobe: a narrow arcade of tiny shops, game cabinets glowing,',
    'wet asphalt reflecting pink and cyan neon, a train blurring past overhead, steam rising from a ramen counter.',
    'The left 45 percent is that alley itself, fully painted in depth - shopfronts, glowing signs, the wet road running away from the viewer.',
    'It must be a real painted street, NOT a flat block of graphic colour.',
    'EXACTLY TWO girls stand in the right 55 percent, seen from the WAIST UP - a medium shot, not a head-and-shoulders close-up,',
    'so their whole upper bodies and the street behind them are both visible. Faces beautifully rendered, lit from below by the neon:',
    c('sora', 'maki'), '.',
    'The small pink-haired one smirks up at the taller one, who is laughing with her head tipped back.'
  ].join(' '),

  // ④ 安静的下午。两个人，暖光，整套里最柔的一张。
  quiet: [
    LAYOUT,
    'Late afternoon inside an old Kobe coffee house on the Kitano slope: dark wood panelling, brass lamps, tall windows,',
    'low honey-coloured sunlight cutting the room in long bars, dust turning in the light, cups and saucers on the tables.',
    'The left 45 percent is the rest of that room, fully painted - empty tables, the panelled wall, a window with the slope outside',
    '- softly lit and out of focus. It must be a real painted interior, not a flat gradient or an empty colour field.',
    'EXACTLY TWO people in the right 55 percent, seated at a window table, CROPPED CLOSE - heads and shoulders only,',
    'their faces filling much of the right half of the frame, beautifully rendered and rim-lit by the window:', c('rei', 'miyuki'), '.',
    'The younger one is reading; the older one watches her, faintly amused.',
    'Even though this is the calmest image of the set, KEEP THE FULL PERSONA 5 GRAPHIC STYLE:',
    'thick confident black linework, high-saturation colour, hard-edged cel shadows, halftone dot fields and diagonal colour shards.',
    'Do NOT drift into a soft, thin-lined, pastel, watercolour or painterly look - it must match the other posters in the set.'
  ].join(' '),

  // ⑤ 神社的夜。单人，脸最大，整套里最贵气的一张。
  shrine: [
    LAYOUT,
    'Night at Ikuta Shrine in the middle of downtown Kobe: a vermilion torii gate, ancient camphor trees,',
    'stone lanterns lit, a gravel path, the neon of the city glowing faintly through the trees behind.',
    'EXACTLY ONE character in the right 55 percent, large, close to the viewer, seen from the knees up,',
    'her face rendered in the highest detail in the whole set:', CAST.inari, '.',
    'She stands on the gravel looking straight at the viewer with a sly knowing smile, fan half raised,',
    'her tails fanned out behind her, the pale blue fox-fire lighting her face from below.'
  ].join(' ')
};

const args = process.argv.slice(2);
if (args.includes('--list')) {
  Object.keys(CANDIDATES).forEach(k => console.log(k));
  process.exit(0);
}

const key = readKey();
if (!key) {
  console.error('找不到 API key：GEMINI_API_KEY=... node scripts/gen-title-art.mjs');
  process.exit(1);
}

function post(payload) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(key),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, res => {
      let body = '';
      res.on('data', ch => body += ch);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 300)}`));
        try {
          const json = JSON.parse(body);
          const part = (json.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
          const d = part && (part.inlineData || part.inline_data);
          if (!d) return reject(new Error('返回里没有图片：' + body.slice(0, 200)));
          resolve(Buffer.from(d.data, 'base64'));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function generate(prompt, refPath) {
  const parts = refPath
    ? [
        { inline_data: { mime_type: 'image/webp', data: fs.readFileSync(refPath).toString('base64') } },
        { text: prompt }
      ]
    : [{ text: `${STYLE}\n\n${prompt}` }];
  return post(JSON.stringify({
    contents: [{ parts }],
    generationConfig: { imageConfig: { aspectRatio: '16:9' } }
  }));
}

// --edit <源图> <指令>：图生图。会掉画质，见文件头的说明。
const editIdx = args.indexOf('--edit');
if (editIdx >= 0) {
  const src = args[editIdx + 1];
  const instruction = args.slice(editIdx + 2).join(' ');
  if (!src || !instruction) { console.error('用法: --edit <源图路径> <改什么>'); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, path.basename(src, path.extname(src)) + '_edit.webp');
  process.stdout.write('editing ... ');
  const raw = await generate(instruction, src);
  await sharp(raw).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 94 }).toFile(out);
  console.log('OK →', path.relative(ROOT, out));
  process.exit(0);
}

const wanted = args.filter(a => !a.startsWith('--'));
const targets = wanted.length ? wanted : Object.keys(CANDIDATES);
for (const t of targets) {
  if (!CANDIDATES[t]) { console.error('未知候选:', t, '（--list 看全部）'); process.exit(1); }
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const name of targets) {
  process.stdout.write(`${name.padEnd(10)} ... `);
  try {
    const raw = await generate(CANDIDATES[name], null);
    const meta = await sharp(raw).metadata();
    // 放大一档：标题画面是铺满的，1344 宽在 1080p 屏上会看出软
    await sharp(raw).resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 94 }).toFile(path.join(OUT_DIR, `${name}.webp`));
    console.log(`OK  ${meta.width}x${meta.height} → 1920x1080`);
  } catch (e) {
    console.log('失败:', e.message);
  }
  await sleep(1500);
}

console.log(`\n出到 ${path.relative(ROOT, OUT_DIR)}/`);
