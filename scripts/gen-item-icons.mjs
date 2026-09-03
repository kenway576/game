// ============================================================================
// 🎨 休闲系统的物品图标（鱼 / 菜 / 料理 / 渔具）
//
// 【为什么是拼版而不是一张一张出】
// 一共 44 个图标。一张一张生成 = 44 次调用，大约 2 美元。
// 改成"一张大图里画 4×4 的格子，本地再切开"，只要 3 次调用，约 12 美分。
// 便宜十几倍，而且同一张里出来的东西风格天然一致——
// 分 44 次抽，光是把画风对齐就得重抽好几轮。
//
// 代价是：格子偶尔会串位或者少画一个。所以流程是
//   1. 先出拼版（--sheets）
//   2. 人眼看一遍 .generated/icons/sheet_*.png 对不对得上
//   3. 确认无误再切（--slice）
// 别把这两步合成一步自动跑——切错了会静默地把错的图标铺进游戏里。
//
// 用法：
//   node scripts/gen-item-icons.mjs --sheets        # 出三张拼版（key 从 .env.local 读）
//   node scripts/gen-item-icons.mjs --sheets fish   # 只重出某一张
//   node scripts/gen-item-icons.mjs --slice         # 切开并抠底，不调 API，不花钱
// ============================================================================
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, '.generated', 'icons');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'items');

// key 的来源：先看环境变量，再退回 .env.local。
// 和 gen-title-art / gen-shop-items / gen-room-weather 保持一致——
// 有一个脚本不读 .env.local 的话，就会出现"别的脚本都能跑，就这个说没 key"。
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

// 三张拼版共用的画风。和便利店那批商品图是同一套，游戏里摆在一起才不打架。
const STYLE = [
  'A 4 by 4 grid of 16 separate game item icons, evenly spaced, on a PURE FLAT WHITE background.',
  'Each icon sits alone inside its own cell, centred, at the same scale, with generous white margin around it,',
  'and NO icon touches or overlaps another. Cells are strictly aligned in 4 straight rows and 4 straight columns.',
  'Anime / light-novel illustration style with clean bold line art and soft cel shading, matching a visual novel inventory screen.',
  'Bright, appetising, high clarity, readable at small size.',
  'ABSOLUTELY NO TEXT, no numbers, no labels, no captions, no grid lines, no frames, no borders, no shadows on the background.'
].join(' ');

// 每张拼版的 16 格。顺序 = 从左到右、从上到下，切图时按这个顺序对应。
// 不足 16 个的用 null 占位（那一格让它画一个不用的小东西，切的时候丢掉）。
const SHEETS = {
  fish: {
    prompt: [
      'The 16 items are Japanese seafood, each drawn in side view, whole and uncooked, as a clean catalogue illustration:',
      '1 a small goby, 2 a sardine, 3 a horse mackerel, 4 a mackerel with striped back,',
      '5 a dark rockfish with big eyes, 6 a slender silver Japanese whiting, 7 a spiny brown scorpionfish, 8 a large silver Japanese seabass,',
      '9 a deep-bodied black sea bream, 10 a long brown conger eel curled once, 11 a cuttlefish, 12 a long thin silver beltfish curled into an S,',
      '13 an octopus, 14 a young yellowtail, 15 a bright red-pink sea bream, 16 a single dark green rubber boot.'
    ].join(' '),
    ids: [
      'fish_haze', 'fish_iwashi', 'fish_aji', 'fish_saba',
      'fish_mebaru', 'fish_kisu', 'fish_kasago', 'fish_suzuki',
      'fish_chinu', 'fish_anago', 'fish_kouika', 'fish_tachiuo',
      'fish_tako', 'fish_buri', 'fish_madai', 'junk_boot'
    ]
  },
  garden: {
    prompt: [
      'The 16 items are gardening things and vegetables:',
      '1 a bunch of small round red radishes with green tops, 2 a sprig of green basil leaves, 3 a stack of three flat green shiso leaves, 4 a cluster of red cherry tomatoes on the vine,',
      '5 a bundle of thin green spring onions, 6 a blue-purple morning glory flower, 7 an orange marigold flower, 8 a single yellow sunflower head,',
      '9 an empty terracotta plant pot, 10 a small paper seed packet, 11 a tub of fishing bait worms in sawdust, 12 a simple short fishing rod,',
      '13 a long thin black fishing rod, 14 an elaborate fishing rod with a reel, 15 a crumpled empty drink can, 16 a clump of dark green seaweed.'
    ].join(' '),
    ids: [
      'crop_radish', 'crop_basil', 'crop_shiso', 'crop_tomato',
      'crop_negi', 'crop_asagao', 'crop_marigold', 'crop_himawari',
      'item_pot', 'item_seed', 'item_bait', 'rod_cheap',
      'rod_seabass', 'rod_akashi', 'junk_can', 'junk_weed'
    ]
  },
  dishes: {
    // 盘子底下都有柔和的投影，用默认阈值整张会连成一块（实测只找出 1 个物件）。
    // 把"算墨"的门槛提高、粘连距离调小，才分得开。
    detect: { lum: 190, sat: 60, gap: 0.008 },
    prompt: [
      'The 16 items are Japanese home-cooked dishes, each plated and seen from a slightly elevated three-quarter angle:',
      '1 a lacquer bowl of miso soup with spring onion, 2 a small plate of radish and basil salad, 3 a plate of shiso leaf tempura, 4 a bowl of tomato pasta with basil,',
      '5 a whole grilled fish on a rectangular plate, 6 a dish of small fried fish in vinegar with onion, 7 a tray of takoyaki with sauce, 8 a covered clay pot of sea bream rice with the lid off,',
      '9 an open Japanese bento box with compartments, 10 a small bowl of roasted sunflower seeds,',
      '11 a bowl of white rice, 12 a teapot, 13 a cup of green tea, 14 a pair of chopsticks on a rest,',
      '15 a small dish of soy sauce, 16 an empty white plate.'
    ].join(' '),
    // 实际画出来是 4/3/4/4 共 15 个（原计划的第 8 格空了），
    // 所以这里按**画出来的顺序**列，而不是按理想的 16 格。
    // ids 的长度必须等于检测到的物件数——对不上时脚本拒绝切图并让人回去数一遍，
    // 不会闷头把错位的图标铺进游戏里。
    ids: [
      'dish_misoshiru', 'dish_salad', 'dish_ooba_tempura', 'dish_pasta',
      'dish_yakizakana', 'dish_nanban', 'dish_takoyaki',
      'dish_bento', 'dish_himawari_seeds', null, 'dish_taimeshi',
      null, null, null, null
    ]
  }
};

function post(payload, key) {
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
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 250)}`));
        const json = JSON.parse(body);
        const part = (json.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
        const d = part && (part.inlineData || part.inline_data);
        if (!d) return reject(new Error('返回里没有图片'));
        resolve(Buffer.from(d.data, 'base64'));
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// 白底抠成透明 + 裁到内容。
//
// 除了从边缘往里灌之外，还要处理**被物件围住的白**：
// 星鳗盘成一圈，圈心那块白是背景，但洪水从外面进不去。
// 判据和立绘那套一样——原始背景是死白没有明暗，画出来的白（米饭、盘子）
// 一定带阴影。所以"小块 + 几乎全是纯白"的封闭区域才清掉，
// 盘子和米饭那种又大又有层次的一律不动。
async function cutWhite(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const lum = p => { const i = p * 4; return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; };
  const sat = p => { const i = p * 4; return Math.max(data[i], data[i+1], data[i+2]) - Math.min(data[i], data[i+1], data[i+2]); };
  const bgLike = p => lum(p) > 233 && sat(p) < 16;
  const nbrs = p => {
    const x = p % W, y = (p - x) / W, o = [];
    if (x + 1 < W) o.push(p + 1);
    if (x > 0) o.push(p - 1);
    if (y + 1 < H) o.push(p + W);
    if (y > 0) o.push(p - W);
    return o;
  };

  const bg = new Uint8Array(N);
  const st = [];
  const push = p => { if (!bg[p] && bgLike(p)) { bg[p] = 1; st.push(p); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (st.length) for (const q of nbrs(st.pop())) push(q);

  // 被围住的小块死白
  const seen = new Uint8Array(N);
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || bg[p0] || !bgLike(p0)) continue;
    const stack = [p0]; seen[p0] = 1; const cells = [];
    while (stack.length) {
      const p = stack.pop(); cells.push(p);
      for (const q of nbrs(p)) if (!seen[q] && !bg[q] && bgLike(q)) { seen[q] = 1; stack.push(q); }
    }
    // 上限放到 35%：星鳗盘成一圈，圈心那块白占的比例不小。
    // 米饭、盘子这类"真的是白的"东西靠下面的纯度判据挡住，不靠面积挡。
    if (cells.length < 30 || cells.length > N * 0.35) continue;
    let pure = 0;
    for (const p of cells) if (lum(p) > 249) pure++;
    if (pure / cells.length < 0.75) continue;
    for (const p of cells) bg[p] = 1;
  }

  for (let p = 0; p < N; p++) if (bg[p]) data[p * 4 + 3] = 0;

  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let p = 0; p < N; p++) {
    if (data[p * 4 + 3] < 16) continue;
    const x = p % W, y = (p - x) / W;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  if (maxX < 0) return null;
  return sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100 }).toBuffer();
}

// 找出拼版里每一个物件的位置。
//
// 一开始是"把画布平均切四刀"，菜那张行高不均，切出来上下各带半个邻居。
// 改成"按墨迹的投影找行列"也不行——菜那张有几行在竖直方向根本没有空隙，
// 投影上是连在一起的，怎么都分不出 4 段。
//
// 所以改成直接找连通块：每个物件是一块墨，量出它自己的外接框，
// 再按"先上后下、先左后右"排成阅读顺序。行高不均、某一格空着，都不影响。
// 唯一要处理的是一个物件被拆成几块（筷子和筷架），所以挨得近的框先并起来。
async function findItems(src, opt = {}) {
  const LUM = opt.lum ?? 235, SAT = opt.sat ?? 18, GAPPCT = opt.gap ?? 0.025;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const ink = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const sat = Math.max(data[i], data[i+1], data[i+2]) - Math.min(data[i], data[i+1], data[i+2]);
    ink[p] = (l < LUM || sat > SAT) ? 1 : 0;
  }

  const seen = new Uint8Array(N);
  let boxes = [];
  const minArea = Math.round(N * 0.0004);
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || !ink[p0]) continue;
    const st = [p0]; seen[p0] = 1;
    let n = 0, x0 = W, y0 = H, x1 = -1, y1 = -1;
    while (st.length) {
      const p = st.pop(); n++;
      const x = p % W, y = (p - x) / W;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (!seen[q] && ink[q]) { seen[q] = 1; st.push(q); }
      }
    }
    if (n >= minArea) boxes.push({ x0, y0, x1, y1 });
  }

  // 挨得近的并起来（同一个物件被拆成几块）
  const gap = Math.round(Math.min(W, H) * GAPPCT);
  let merged = true;
  while (merged) {
    merged = false;
    outer:
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        const dx = Math.max(0, Math.max(a.x0 - b.x1, b.x0 - a.x1));
        const dy = Math.max(0, Math.max(a.y0 - b.y1, b.y0 - a.y1));
        if (dx <= gap && dy <= gap) {
          boxes[i] = { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0),
                       x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) };
          boxes.splice(j, 1); merged = true; break outer;
        }
      }
    }
  }

  // 排成阅读顺序：按中心 y 分行，行内按 x
  const h = boxes.map(b => b.y1 - b.y0).sort((a, b) => a - b)[Math.floor(boxes.length / 2)] || 1;
  boxes.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const rows = [];
  for (const b of boxes) {
    const cy = (b.y0 + b.y1) / 2;
    const row = rows.find(r => Math.abs(r.cy - cy) < h * 0.6);
    if (row) { row.items.push(b); row.cy = (row.cy * (row.items.length - 1) + cy) / row.items.length; }
    else rows.push({ cy, items: [b] });
  }
  const out = [];
  for (const r of rows) {
    r.items.sort((a, b) => (a.x0 + a.x1) - (b.x0 + b.x1));
    out.push(...r.items);
  }
  return { boxes: out, W, H };
}

const args = process.argv.slice(2);
fs.mkdirSync(RAW_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

if (args.includes('--sheets')) {
  const key = readKey();
  if (!key) { console.error('缺 API key：把 GEMINI_API_KEY=... 写进项目根目录的 .env.local'); process.exit(1); }
  const only = args.filter(a => !a.startsWith('--'));
  const names = only.length ? only : Object.keys(SHEETS);
  for (const n of names) {
    if (!SHEETS[n]) { console.error('未知拼版:', n); process.exit(1); }
    process.stdout.write(`${n.padEnd(8)} ... `);
    try {
      const raw = await post(JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE}\n\n${SHEETS[n].prompt}` }] }],
        generationConfig: { imageConfig: { aspectRatio: '1:1' } }
      }), key);
      const out = path.join(RAW_DIR, `sheet_${n}.png`);
      await sharp(raw).png().toFile(out);
      const m = await sharp(raw).metadata();
      console.log(`OK ${m.width}x${m.height} → ${path.relative(ROOT, out)}`);
    } catch (e) { console.log('失败:', e.message); }
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log('\n先看一眼 .generated/icons/sheet_*.png 格子对不对得上，再跑 --slice');
  process.exit(0);
}

if (args.includes('--slice')) {
  const only = args.filter(a => !a.startsWith('--'));
  const names = only.length ? only : Object.keys(SHEETS);
  let n = 0;
  for (const name of names) {
    const src = path.join(RAW_DIR, `sheet_${name}.png`);
    if (!fs.existsSync(src)) { console.log(`${name}: 还没生成，跳过`); continue; }
    const { boxes, W, H } = await findItems(src, SHEETS[name].detect);
    const ids = SHEETS[name].ids;
    console.log(`${name}: 找到 ${boxes.length} 个物件，映射表有 ${ids.length} 项`);
    if (boxes.length !== ids.length) {
      console.log(`  数量对不上，跳过。去看一眼 .generated/icons/sheet_${name}.png，`);
      console.log(`  数一下画了几个东西，把 ids 数组按"从左到右、从上到下"改成一样长。`);
      continue;
    }
    for (let i = 0; i < boxes.length; i++) {
      const id = ids[i];
      if (!id) continue;
      const b = boxes[i], m = 8;
      const left = Math.max(0, b.x0 - m), top = Math.max(0, b.y0 - m);
      const cell = await sharp(src).extract({
        left, top,
        width: Math.min(W - left, b.x1 - b.x0 + 1 + m * 2),
        height: Math.min(H - top, b.y1 - b.y0 + 1 + m * 2)
      }).png().toBuffer();
      const icon = await cutWhite(cell);
      if (!icon) continue;
      fs.writeFileSync(path.join(OUT_DIR, `${id}.webp`), icon);
      n++;
    }
  }
  console.log(`\n共 ${n} 个图标 → public/images/items/`);
  process.exit(0);
}

console.log('用法: --sheets [名字...]  或  --slice [名字...]');
console.log('拼版:', Object.keys(SHEETS).join(', '));
