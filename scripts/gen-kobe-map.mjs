// ============================================================================
// 外公那张神户地图
//
// 房间软木板上钉着的那张。之前是我用 SVG 画的示意图，能用，但很糙。
// 这一版拿模型出一张真正画出来的旧纸质地图，图钉还是用 SVG 叠在上面——
// 底图是画的，标记是活的，两边各干各的事。
//
// 【为什么地理必须写死到这个程度】
// 模型对"神户"的印象是"日本某座海边城市"，随手画就是一张通用海岸线。
// 而这张图在游戏里要和地图系统的十七个图钉对上，玩家又是照着真神户认路的。
// 所以提示词里把神户真实的形状一条一条写出来：
//   · 城市是夹在六甲山和大阪湾之间的一条**又窄又长**的带子，东西走向
//   · 山几乎顶到海边，市区最窄处只有两三公里——这是神户最好认的特征
//   · 港岛和六甲岛是海上填出来的两块**四方形**人工岛，不是自然岛屿
//   · 西端须磨有沙滩，东端出了市界是芦屋、西宫、大阪
//   · 有马温泉在山的**另一面**（北侧），不在海这边
// 这几条不写，出来的图放进游戏就是错的。
//
// 【为什么不要文字】
// 模型写不对日文地名，写出来全是似是而非的假字。地名一律由 SVG 图钉负责，
// 底图只画地形。这条得反复强调，模型很爱在地图上写字。
//
// 用法：
//   GEMINI_API_KEY=xxx node scripts/gen-kobe-map.mjs          # 出 3 张候选
//   GEMINI_API_KEY=xxx node scripts/gen-kobe-map.mjs 2        # 只出第 2 张
//
// 出到 .generated/map/（不进版本库），挑中的再拷进 public/images/ui/。
// ============================================================================
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, '.generated', 'map');

function readKey() {
  const NAMES = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'VITE_GEMINI_API_KEY', 'VITE_GOOGLE_API_KEY'];
  for (const k of NAMES) if (process.env[k]) return process.env[k];
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

// 真实地理。这一段是这张图的骨架，三个候选共用。
const GEOGRAPHY = [
  'This is a map of KOBE, JAPAN, and its real geography must be respected exactly:',
  'Kobe is a very long, very NARROW strip of city squeezed between a mountain range and the sea, running WEST to EAST across the image.',
  'Along the TOP of the map runs the MOUNT ROKKO range - a continuous green forested ridge with peaks, filling roughly the top third.',
  'Along the BOTTOM is OSAKA BAY, open blue water filling roughly the bottom third.',
  'Between them, the built-up city is only a thin ribbon - at its narrowest the mountains come almost down to the shoreline.',
  'That squeezed ribbon is the single most recognisable thing about Kobe and must be obvious at a glance.',
  'The coastline runs from the lower LEFT up to the RIGHT in a long shallow curve.',
  'At the WEST end (left) is SUMA, with a pale sandy beach and a small headland.',
  'In the CENTRE is the port: docks and piers, and TWO large RECTANGULAR MAN-MADE ISLANDS sitting offshore in the bay,',
  'clearly artificial with straight edges and squared-off corners - Port Island nearer the centre, Rokko Island further east.',
  'A slender causeway connects the mainland to Port Island.',
  'Behind the port, on the lower slopes, is the dense downtown grid, and above it on the hillside the KITANO quarter.',
  'Toward the EAST end (right) the strip continues through NADA and out past the city boundary.',
  'ARIMA ONSEN sits on the FAR SIDE of the mountains, in a valley on the northern slope, beyond the ridge - not on the sea side.',
  'Small marks show the rail lines running east-west along the whole strip, and one tunnel road crossing the mountains northward.'
].join(' ');

// 纸的质感。这张图在设定里是外公折了很多年的一张旧地图。
const PAPER = [
  'It is a hand-drawn paper map, the kind an amateur cartographer would ink and watercolour by hand,',
  'printed decades ago and folded and refolded until the creases are furred:',
  'warm cream and pale ochre paper, soft brown ink linework, muted watercolour washes -',
  'sage green for the mountains, dusty blue-grey for the bay, pale buff for the built-up land.',
  'Faint horizontal and vertical fold lines cross the sheet. Slight foxing and age-spotting at the corners.',
  'Fine hatching on the mountain slopes, tiny wave marks on the water, a delicate compass rose in one corner.',
  'The style is elegant, detailed and restrained - beautiful and legible, never garish, never a modern digital road atlas.',
  'Flat overhead top-down view, north at the top. No perspective, no 3D, no isometric buildings.'
].join(' ');

// 不许写字。模型极爱在地图上写地名，而它写出来的日文全是假字。
const NO_TEXT = [
  'CRITICAL: there must be ABSOLUTELY NO TEXT anywhere in the image.',
  'No place names, no labels, no letters, no Japanese characters, no numbers, no legend, no scale bar, no title,',
  'no signature and no watermark. Every name will be added separately afterwards.',
  'The compass rose must be a pure drawn symbol with no letters on it.'
].join(' ');

const CANDIDATES = {
  1: [GEOGRAPHY, PAPER, NO_TEXT,
      'Overall tone: warm and inviting, like the endpaper of an old travel book. Generous open water and open sky-coloured margin.'
     ].join(' '),
  2: [GEOGRAPHY, PAPER, NO_TEXT,
      'Overall tone: cooler and more precise, closer to a surveyor’s chart - finer linework, more contour detail on the ridge,',
      'the artificial islands drawn with crisp engineered edges, the port basins carefully outlined.'
     ].join(' '),
  3: [GEOGRAPHY, PAPER, NO_TEXT,
      'Overall tone: softer and more painterly - looser watercolour bleeding at the edges of the washes,',
      'the mountains a deeper green, the bay a warmer blue, the paper more visibly aged and handled.'
     ].join(' ')
};

const args = process.argv.slice(2);
const key = readKey();
if (!key) {
  console.error('找不到 API key：GEMINI_API_KEY=... node scripts/gen-kobe-map.mjs');
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

const wanted = args.filter(a => !a.startsWith('--'));
const targets = wanted.length ? wanted : Object.keys(CANDIDATES);
fs.mkdirSync(OUT_DIR, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const t of targets) {
  if (!CANDIDATES[t]) { console.error('未知候选:', t); continue; }
  process.stdout.write(`map ${t} ... `);
  try {
    const raw = await post(JSON.stringify({
      contents: [{ parts: [{ text: CANDIDATES[t] }] }],
      generationConfig: { imageConfig: { aspectRatio: '16:9' } }
    }));
    const out = path.join(OUT_DIR, `kobe_map_${t}.webp`);
    await sharp(raw).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 94 }).toFile(out);
    console.log('OK →', path.relative(ROOT, out));
  } catch (e) {
    console.log('失败:', e.message);
  }
  await sleep(1500);
}
