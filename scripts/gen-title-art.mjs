// ============================================================================
// 标题画面主视觉
//
// 参考画风：Persona 5: The Phantom X 的官方壁纸（粗而干净的线、高饱和有限色、
// 黑红对角色块 + 网点、强对角构图）。游戏本身的 UI 就是 P5 那一套，
// 封面跟 UI 不是一个语言的话，第一屏就散了。
//
// 硬约束（比"好看"更重要的那几条）：
//   · 16:9，标题画面是横的
//   · **左侧三分之一必须是空的**——KOBE STUDY 的标题块和两个大按钮压在那儿。
//     生成的图再好看，主体压在左边就白做了。
//   · 画面里不能有任何文字。logo 是 UI 画的，图里再冒出假字只会打架。
//
// 用法：
//   GEMINI_API_KEY=xxx node scripts/gen-title-art.mjs          # 出全部候选
//   GEMINI_API_KEY=xxx node scripts/gen-title-art.mjs group    # 只出指定的
//   GEMINI_API_KEY=xxx node scripts/gen-title-art.mjs --list
//
// 出到 .generated/title/，挑中哪张再手动拷进 public/images/ui/。
// .generated/ 不进版本库。
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

// 画风。这一段所有候选共用，改它等于改整套。
const STYLE = [
  'Key visual illustration for a Japanese romance visual novel, drawn in the style of Persona 5: The Phantom X promotional art.',
  'Bold clean confident linework, high-saturation limited palette, flat graphic cel shading with hard shadow edges.',
  'Graphic design elements woven into the artwork: sharp diagonal colour blocks, halftone dot fields, angular geometric shards.',
  'Strong diagonal composition, dramatic contrast, glossy anime finish, extremely high detail on faces and hair.',
  'Cinematic 16:9 widescreen game title screen.',
  'ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks, no signature anywhere in the image.'
].join(' ');

// 构图约束。这段也是所有候选共用的——它保护的是 UI，不是画面。
const LAYOUT = [
  'CRITICAL LAYOUT REQUIREMENT: the LEFT THIRD of the frame must stay visually calm and uncluttered',
  '- only sky, distant water or a soft colour field there, with no faces and no busy detail,',
  'because a large game logo and two big menu buttons will be placed over that area.',
  'All characters and all busy detail belong in the CENTRE and RIGHT of the frame.'
].join(' ');

// 神户。这座城市是这个游戏真正的主角，封面必须一眼认得出来。
const KOBE = [
  'The setting is Kobe, Japan, seen from the top of the Kitano slope looking down toward the sea:',
  'Western-style hillside houses with green copper roofs and ivy lining a steep street,',
  'the dense lights of the Sannomiya downtown below, the harbour beyond it,',
  'the red lattice Kobe Port Tower and a large illuminated ferris wheel on the waterfront,',
  'and the Rokko mountain ridge behind. Late April, cherry blossom petals drifting through the air.',
  'The hour is the ten minutes between sunset and night: a deep orange-to-violet sky, the city lights just switched on.'
].join(' ');

// 角色设定。描述必须精确到"一眼能认出是谁"的那几个特征，
// 形容词堆多了模型反而会糊成一团。
const CAST = {
  asuka:  'a proud girl with long crimson-red twin tails tied with red ribbons, sharp red eyes, in a white school shirt with a red bow tie and a navy pleated skirt with black knee socks, arms folded',
  hikari: 'a bright cheerful girl with long golden-blonde hair and amber eyes, in orange dungarees over a white tee, laughing with one arm thrown up',
  rei:    'a quiet girl with pale ice-blue chin-length hair and glasses, in a navy blazer and a green plaid skirt, holding a book against her chest, expressionless',
  // 立绘里空是小麦色（日焼け），不是黑人。
  // 第一版写成 dark-skinned，四张候选全部把她画成了黑人——写提示词时
  // “肤色”这种词得把范围卡死，模型不会往中间取。
  sora:   'an athletic Japanese tomboy with short brown hair and a LIGHT SUN-TANNED complexion - lightly bronzed from outdoor sport, definitely NOT dark-skinned and NOT black - in an orange basketball jersey, spinning a basketball on one finger, grinning',
  maki:   'a small pink-haired girl with a side ponytail and a black cat-ear headband, pink headphones round her neck, denim vest over a purple tee and white shorts, smirking',
  nao:    'a girl with brown hair in a ponytail in a school blazer uniform, hands behind her back, warm familiar smile',
  miyuki: 'an elegant older woman with very long straight silver-white hair, in a soft beige cardigan and a long dark skirt, calm and gentle',
  inari:  'a fox deity with long orange hair, fox ears and several large fox tails, in an ornate teal and gold crane-patterned kimono, holding a gold folding fan, pale blue fox-fire floating around her'
};

const c = (...ids) => ids.map(id => CAST[id]).join('; ');

const CANDIDATES = {
  // A. 全员群像。热闹、像发售海报。风险是八张脸都会变小。
  group: [
    KOBE,
    'Eight anime girls are arranged down the slope in depth, NOT in a straight row:',
    'in the foreground on the right, large and fully detailed,', c('asuka', 'hikari'), '.',
    'A step behind them, slightly smaller,', c('sora', 'maki'), '.',
    'Further down the slope, smaller again and softly out of focus,', c('rei', 'nao'), '.',
    'Furthest away, near the bottom of the slope, small and half in silhouette against the city lights,', c('miyuki', 'inari'), '.',
    'They are looking back up the hill toward the viewer, as if waiting for someone to catch up.',
    LAYOUT
  ].join(' '),

  // A2. group 的修版。第一版里稻荷的头发跑成了银色、奈绪和深雪远到看不清，
  //     而"看不清"对恋爱游戏的封面是致命的——每个人都得卖得出去。
  //     所以这版把八个人压进三层而不是四层，最远的一层也保留五官。
  group2: [
    KOBE,
    'Eight anime girls are arranged down the slope in three layers of depth, NOT in a straight row.',
    'They are ALL clearly visible with readable faces - none of them is a distant dot.',
    'FRONT LAYER, right side, large and fully detailed:', c('asuka', 'hikari'), '.',
    'MIDDLE LAYER, just behind and to their left, three quarters that size but still fully detailed faces:',
    c('sora', 'maki', 'nao'), '.',
    'BACK LAYER, a few steps further down the slope, half that size, softly lit by the city behind them but with faces still drawn:',
    c('rei', 'miyuki', 'inari'), '.',
    'IMPORTANT character corrections: the fox deity has BRIGHT ORANGE hair, not white and not silver,',
    'and her kimono is vivid teal and gold. The basketball player is unmistakably a girl, athletic and feminine.',
    'The whole group is looking back up the hill toward the viewer, as if waiting for someone to catch up.',
    LAYOUT
  ].join(' '),

  // A3. 定稿方向。group 的纵深 + group2 的"八个人都看得清"，
  //     再把左侧留白说成一条硬边界——前两版都把人画进了标题要压的位置，
  //     "左三分之一保持安静"这种说法模型显然不当回事，得给百分比。
  group3: [
    KOBE,
    'HARD COMPOSITION RULE, obey this before anything else: the leftmost 40 percent of the image contains',
    'ONLY the sunset sky, the distant harbour and the city lights far below. No person, no tree, no roof,',
    'no bright graphic shape may enter that area. The nearest character begins at 45 percent from the left edge.',
    'Everything else is packed into the right 55 percent of the frame.',
    'Eight anime girls stand on the slope in that right-hand area, staggered in depth so their heads sit at different heights,',
    'nearer ones larger and lower, further ones smaller and higher - not a flat straight line.',
    'There must be EXACTLY EIGHT girls - count them - and all eight have clearly drawn, readable faces.',
    'Nearest, at the front:', c('asuka', 'maki'), '.',
    'Immediately behind them:', c('hikari', 'nao'), '.',
    'The girl with the brown ponytail and the school blazer must NOT be omitted; she stands shoulder to shoulder with the blonde one.',
    'Behind that pair:', c('sora', 'rei'), '.',
    'Furthest back, still fully drawn:', c('miyuki', 'inari'), '.',
    'IMPORTANT: the fox deity has BRIGHT ORANGE hair, never white or silver.',
    'The basketball player is unmistakably a teenage GIRL with a clearly feminine face and figure, not a boy.',
    'The girl with the book wears glasses.',
    'A cherry tree in full bloom leans in from the top right corner, petals blowing left across the empty sky.',
    'They are turned back up the hill toward the viewer, as if waiting for someone to catch up.'
  ].join(' '),

  // B. 四人前景 + 四人剪影。脸少一半，每张脸就能大一倍。
  four: [
    KOBE,
    'Four anime girls stand together in the centre-right foreground, large and fully detailed, at slightly different distances:',
    c('asuka', 'hikari', 'sora', 'inari'), '.',
    'Behind and below them, four more distant figures are rendered only as backlit silhouettes against the city lights,',
    'their shapes readable but their faces not shown: one with very long straight hair, one with a ponytail,',
    'one small one with a side ponytail and headphones, one with a book held to her chest.',
    LAYOUT
  ].join(' '),

  // C. 主角背影 + 全员剪影。零一致性风险，最"开场"，但认不出是谁。
  silhouette: [
    KOBE,
    'In the lower left foreground, seen from behind and in near silhouette, a schoolboy with a shoulder bag stands at the top of the slope, small against the view, one hand on the railing.',
    'Down the slope ahead of him, eight girls stand scattered at different distances, all rendered as clean backlit silhouettes rimmed in orange light against the city below, faces not visible;',
    'their outlines are distinct from one another: twin tails, a ponytail, a bob with glasses, an athletic short crop,',
    'a small one with a side ponytail and headphones, very long straight hair, a dungaree girl with one arm raised, and one with fox ears and several tails.',
    'The mood is the first evening of something, expansive and a little lonely.',
    LAYOUT
  ].join(' '),

  // D. 双人主视觉。最接近 bestdori 卡面的密度，最好看，但只卖两个人。
  duo: [
    KOBE,
    'Two anime girls dominate the centre-right of the frame, large, close to the viewer, fully detailed and beautifully rendered:',
    c('asuka', 'hikari'), '.',
    'They are mid-motion on the slope, one turning back toward the viewer, cherry petals blowing across them.',
    'Far below on the slope, six much smaller distant figures walk on ahead, rendered as soft backlit silhouettes with no visible faces.',
    LAYOUT
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

// --edit <源图> <指令>：拿现成的图改，不重新抽
const editIdx = args.indexOf('--edit');
if (editIdx >= 0) {
  const src = args[editIdx + 1];
  const instruction = args.slice(editIdx + 2).join(' ');
  if (!src || !instruction) { console.error('用法: --edit <源图路径> <改什么>'); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, path.basename(src, path.extname(src)) + '_edit.webp');
  process.stdout.write('editing ... ');
  const raw = await generate(instruction, src);
  await sharp(raw).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 92 }).toFile(out);
  console.log('OK →', path.relative(ROOT, out));
  process.exit(0);
}

const wanted = args.filter(a => !a.startsWith('--'));
const targets = wanted.length ? wanted : Object.keys(CANDIDATES);
for (const t of targets) {
  if (!CANDIDATES[t]) { console.error('未知候选:', t, '（--list 看全部）'); process.exit(1); }
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// 图生图。整张重抽的代价是“这次对了那次又错了”——八个人里修一个人的发色，
// 重抽等于把另外七个人也重新赌一遍。所以局部改就走这条路：
//   node scripts/gen-title-art.mjs --edit .generated/title/group3.webp "<改什么>"
function generate(prompt, refPath) {
  if (refPath) {
    const payload = JSON.stringify({
      contents: [{ parts: [
        { inline_data: { mime_type: 'image/webp', data: fs.readFileSync(refPath).toString('base64') } },
        { text: prompt }
      ] }],
      generationConfig: { imageConfig: { aspectRatio: '16:9' } }
    });
    return post(payload);
  }
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: `${STYLE}\n\n${prompt}` }] }],
    generationConfig: { imageConfig: { aspectRatio: '16:9' } }
  });
  return post(payload);
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

const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const name of targets) {
  process.stdout.write(`${name.padEnd(12)} ... `);
  try {
    const raw = await generate(CANDIDATES[name], null);
    const meta = await sharp(raw).metadata();
    // 生成分辨率通常不到 1080p，标题画面是铺满的，放大一档观感好不少
    const out = path.join(OUT_DIR, `${name}.webp`);
    await sharp(raw).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 92 }).toFile(out);
    console.log(`OK  ${meta.width}x${meta.height} → 1920x1080`);
  } catch (e) {
    console.log('失败:', e.message);
  }
  await sleep(1500);
}

console.log(`\n出到 ${path.relative(ROOT, OUT_DIR)}/`);
