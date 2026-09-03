// ============================================================================
// 便利店商品立绘
//
// 16 件商品各出一张小图，风格必须统一——它们是并排显示在货架网格里的，
// 有一张跑偏整排就散了。所以：
//   · 每张都用同一段风格前缀（干净白底、俯视微斜、柔和棚拍光、无文字）
//   · 统一裁成正方形、512px
//   · 白底当场抠成透明，商品卡上才不会有一块白方块
//
// 用的是 gemini-2.5-flash-image，Google 这边最便宜的图像模型。
//
// 用法：
//   node scripts/gen-shop-items.mjs            # 全部（跳过已存在的）
//   node scripts/gen-shop-items.mjs onigiri    # 只做指定的
//   node scripts/gen-shop-items.mjs --force    # 重做已存在的
//   node scripts/gen-shop-items.mjs --list
// ============================================================================
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'items');

function readKey() {
  const NAMES = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'VITE_GEMINI_API_KEY', 'VITE_GOOGLE_API_KEY'];
  for (const k of NAMES) if (process.env[k]) return process.env[k];

  // 按**变量名的优先级**取，不是按文件里出现的先后。
  // .env.local 里同一个名字可能写了两次（上面是作废的旧 key，下面是故意留空的），
  // 所以：同名取最后一次，空值跳过，再按 NAMES 的顺序挑。
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return '';
  const found = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const val = m[2].trim().replace(/^["']|["']$/g, '');
    if (val) found[m[1]] = val; else delete found[m[1]];
  }
  for (const k of NAMES) if (found[k]) return found[k];
  return '';
}

// 统一风格。这段不动，16 张才会像一套。
const STYLE = [
  'A single Japanese convenience store product, photographed as a clean product shot for a game UI.',
  'Anime / light-novel illustration style with soft cel shading and clean line art, matching a visual novel art direction.',
  'Centred, seen from a slightly elevated three-quarter angle, filling most of the frame.',
  'Pure flat WHITE background, no shadow on the background, no table, no props, no hands, no people.',
  'No text, no logos, no lettering, no packaging copy of any kind.',
  'Soft even studio lighting, appetising and slightly glossy where appropriate.'
].join(' ');

const ITEMS = {
  onigiri:    'A triangular Japanese rice ball (onigiri) wrapped in a crisp dark nori seaweed sheet, with a visible mentaiko filling at the top.',
  oden:       'A clear plastic convenience-store oden cup holding a large white daikon radish round and a whole boiled egg in pale broth.',
  karaage:    'A small paper tray of golden-brown Japanese fried chicken pieces (karaage), crisp and glistening.',
  croquette:  'One deep-fried Japanese beef croquette, golden breadcrumb crust, cut open at the corner showing the potato and beef filling.',
  bento:      'A Japanese makunouchi bento box, open, with compartments of grilled fish, rolled omelette, pickles and white rice.',
  noodle:     'A plain instant cup noodle container with a foil lid partly peeled back, seafood ramen inside.',
  coffee:     'A slim black canned coffee, a plain matte aluminium can with no lettering.',
  tea:        'A carton of Japanese milk tea, a small paper drink carton with a straw attached, warm beige colour, no lettering.',
  pudding:    'A Japanese custard pudding in a small clear plastic cup, glossy caramel sauce on top.',
  towel:      'A neatly folded stack of small white travel face towels, tied with a plain paper band.',
  soap:       'A plain plastic bottle of Japanese dish soap with a pump nozzle, pale green, no lettering.',
  umbrella:   'A folded compact umbrella in its sleeve, plain navy blue.',
  clipper:    'A small nail clipper set in a clear case, stainless steel.',
  lipbalm:    'A lip balm stick standing beside a small round tin of hand cream, both plain and unlabelled.',
  stationery: 'A black gel pen lying across a slim notebook with a plain cover.',
  magazine:   'A folded city guide magazine, plain cover with an abstract photo of a harbour, no readable text.'
};

const args = process.argv.slice(2);
if (args.includes('--list')) {
  Object.keys(ITEMS).forEach(k => console.log(k));
  process.exit(0);
}
const FORCE = args.includes('--force');

const key = readKey();
if (!key) {
  console.error('找不到 API key：在 .env.local 里加 GEMINI_API_KEY=... 或先 export。');
  process.exit(1);
}

const wanted = args.filter(a => !a.startsWith('--'));
const targets = wanted.length ? wanted : Object.keys(ITEMS);
for (const t of targets) {
  if (!ITEMS[t]) { console.error('未知商品:', t, '（--list 看全部）'); process.exit(1); }
}
fs.mkdirSync(OUT_DIR, { recursive: true });

function generate(prompt) {
  const payload = JSON.stringify({ contents: [{ parts: [{ text: `${STYLE}\n\n${prompt}` }] }] });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(key),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
        try {
          const json = JSON.parse(body);
          const part = (json.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
          const d = part && (part.inlineData || part.inline_data);
          if (!d) return reject(new Error('返回里没有图片'));
          resolve(Buffer.from(d.data, 'base64'));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// 白底抠成透明：商品卡是深色的，留着白方块会很难看。
// 只删和画布边缘连通的白，商品自己身上的白（米饭、毛巾）不受影响。
async function cutWhite(raw) {
  const { data, info } = await sharp(raw).ensureAlpha().resize(512, 512, { fit: 'contain', background: '#ffffff' }).raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const isWhite = p => {
    const i = p * 4;
    return data[i] > 238 && data[i + 1] > 238 && data[i + 2] > 238;
  };
  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (bg[p] || !isWhite(p)) return;
    bg[p] = 1; stack.push(p);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const p = stack.pop(), x = p % W, y = (p - x) / W;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  for (let p = 0; p < W * H; p++) if (bg[p]) data[p * 4 + 3] = 0;
  return sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 100 }).toBuffer();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
let made = 0, skipped = 0;

for (const name of targets) {
  const out = path.join(OUT_DIR, `${name}.webp`);
  if (!FORCE && fs.existsSync(out)) { console.log(`${name.padEnd(12)} 已存在，跳过（--force 重做）`); skipped++; continue; }
  process.stdout.write(`${name.padEnd(12)} ... `);
  try {
    const raw = await generate(ITEMS[name]);
    const buf = await cutWhite(raw);
    fs.writeFileSync(out, buf);
    console.log(`OK  ${(buf.length / 1024).toFixed(0)} KB`);
    made++;
  } catch (e) {
    console.log('失败:', e.message);
  }
  await sleep(1200);
}

console.log(`\n完成：新生成 ${made} 张，跳过 ${skipped} 张 → public/images/items/`);
