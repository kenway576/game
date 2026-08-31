/**
 * 🎨 立绘表情批量生成（Novita · Qwen-Image Edit）
 *
 * 原理：拿角色**已有的**立绘当输入，只让模型改表情。画风、发型、服装、姿势
 * 全部由原图决定，所以不存在"画风漂移"或"越画越不像"的问题。
 *
 * 流水线：挑源图 → 合成白底 → Qwen Edit → 下载 → 泛洪去白底 → 去白边
 *         → 按 alpha 裁边 → 缩放 → WebP → 存入暂存区 → 生成联络表
 *
 * ⚠️ 永远只写入 .generated/，绝不覆盖 public/ 里的现有立绘。
 *    你看过联络表点头后，再用 --adopt 把选中的搬进去。
 *
 * 用法：
 *   node scripts/gen-sprites.mjs --plan                      # 只列出缺哪些，不花钱
 *   node scripts/gen-sprites.mjs --char asuka --limit 6      # 生成 asuka 的 6 个缺口
 *   node scripts/gen-sprites.mjs --char asuka --candidates 2 # 每个缺口出 2 个候选
 *   node scripts/gen-sprites.mjs --adopt asuka               # 把 .generated/asuka 里的搬进 public
 *
 * 需要环境变量 NOVITA_KEY（放 .env.local，别写进代码）。
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PNG } from 'pngjs';

// ---------- 参数 ----------
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const has = (n) => process.argv.includes(`--${n}`);

const CHARS_ROOT = path.resolve('public/images/characters');
const STAGE = path.resolve('.generated');
const KEY = process.env.NOVITA_KEY;
const API = 'https://api.novita.ai/v3/async/qwen-image-edit';
const RESULT = 'https://api.novita.ai/v3/async/task-result';
const OUT_HEIGHT = 1400;   // 与 compress-assets 的立绘预设一致

// ---------- 表情提示词 ----------
// 每条都以「只改表情、其余完全不动」为主轴——这是保持一致性的关键。
const KEEP = 'Keep the exact same character, identical hairstyle and hair color, identical clothing and accessories, identical body pose and hand positions, identical art style, line art and coloring, identical framing and camera angle, plain solid white background. Change nothing except the face.';

// 🔒 身份锁：实测发现模型改表情时会顺手改瞳色（红瞳变蓝瞳/灰瞳），
// 所以把每个角色的瞳色发色显式写死，作为提示词的硬约束。
// 新增角色时照着他的 neutral 立绘补一行。
const LOCKS = {
  asuka:  'Her eyes MUST stay crimson red and her hair MUST stay bright red in twin tails.',
  hikari: 'Her eyes MUST stay golden amber and her hair MUST stay blonde.',
  rei:    'Her eyes MUST stay deep blue behind her glasses, which MUST remain on her face, and her hair MUST stay pale mint green.',
  nao:    'Her eyes MUST stay warm brown and her hair MUST stay chestnut brown in a side ponytail.',
  miyuki: 'Her eyes MUST stay pale lavender and her hair MUST stay long silver-white.',
  sora:   'Her eyes MUST stay bright amber and her hair MUST stay short dark brown.',
  maki:   'Her eyes MUST stay green and her hair MUST stay pink.',
  inari:  'Her eyes MUST stay golden yellow, her hair MUST stay long orange-red, and her fox ears and tails MUST remain unchanged.',
};
const lockFor = c => LOCKS[c] || 'The eye colour and hair colour MUST stay exactly as in the source image.';

const EMOTIONS = {
  happy:     'Change her facial expression to a bright genuine happy smile, eyes curved with joy, mouth open in a cheerful grin.',
  // 实测：温和的措辞会被模型忽略，输出一张面无表情。必须把五官动作写死。
  sad:       'Change her facial expression to clearly, unmistakably sad and about to cry: inner ends of both eyebrows pulled sharply upward into a steep worried slant, upper eyelids drooping, eyes wet and shining with welling tears, gaze cast downward, corners of the mouth pulled distinctly down into a trembling frown. The sadness must be obvious at a glance.',
  angry:     'Change her facial expression to visibly angry, eyebrows sharply furrowed downward, eyes narrowed and glaring, mouth pressed into a tight scowl.',
  shy:       'Change her facial expression to bashful and flustered, a strong pink blush across both cheeks, eyes glancing away to the side, mouth in a small embarrassed wobble.',
  surprised: 'Change her facial expression to startled surprise, both eyes wide open, eyebrows raised high, mouth open in a small round gasp.',
  smug:      'Change her facial expression to smug and teasing, one eyebrow raised, eyes half-lidded with confidence, a small crooked smirk on one side of the mouth.',
  pout:      'Change her facial expression to sulking and pouting, cheeks slightly puffed, eyebrows drawn together, lips pushed out in a childish pout.',
  curious:   'Change her facial expression to curious and interested, head-tilt expression, eyes bright and attentive, eyebrows slightly raised, mouth in a small open "oh".',
  serious:   'Change her facial expression to calm and serious, eyes steady and focused, eyebrows level, mouth in a neutral straight line.',
  laugh:     'Change her facial expression to laughing out loud, eyes shut into happy arcs, mouth wide open in laughter.',
  cold:      'Change her facial expression to cold and unimpressed, eyes half-lidded and flat, eyebrows slightly lowered, mouth in a thin indifferent line.',
  love:      'Change her facial expression to lovestruck and affectionate, soft warm blush, eyes gentle and half-lidded looking at the viewer, a tender smile.',
};

// 优先补齐的核心表情（对话里出现频率最高）
const CORE = ['happy', 'sad', 'angry', 'shy', 'surprised', 'smug'];

// ---------- 工具 ----------
const readWardrobe = () => {
  const src = fs.readFileSync(path.resolve('constants.ts'), 'utf8');
  const block = src.match(/export const WARDROBE[\s\S]*?\n\};/)[0];
  const out = {};
  for (const m of block.matchAll(/CharacterId\.(\w+)\]:\s*\[([^\]]*)\]/g))
    out[m[1].toLowerCase()] = [...m[2].matchAll(/'([^']+)'/g)].map(x => x[1]);
  return out;
};

// 列出所有缺口：{char, outfit, emotion, srcFile, outName}
const buildPlan = (wardrobe, filterChar) => {
  const plan = [];
  for (const char of fs.readdirSync(CHARS_ROOT)) {
    if (filterChar && char !== filterChar) continue;
    const files = fs.readdirSync(path.join(CHARS_ROOT, char))
      .filter(f => f.endsWith('.webp')).map(f => f.replace('.webp', ''));
    const outfits = wardrobe[char] || [];
    // 每套装束（'' = 默认装）分别看缺哪些核心表情
    for (const outfit of ['', ...outfits]) {
      const pre = outfit ? outfit + '_' : '';
      const belongs = f => outfit
        ? f.startsWith(pre)
        : !outfits.some(o => f.startsWith(o + '_'));
      const have = files.filter(belongs).map(f => outfit ? f.slice(pre.length) : f);
      // 必须有一张 neutral 当源图，否则这套装束无从改起
      const srcName = have.includes('neutral') ? pre + 'neutral' : (have.length ? pre + have[0] : null);
      if (!srcName) continue;
      for (const emo of CORE) {
        if (have.includes(emo)) continue;
        plan.push({
          char, outfit, emotion: emo,
          srcFile: path.join(CHARS_ROOT, char, srcName + '.webp'),
          outName: pre + emo,
        });
      }
    }
  }
  return plan;
};

// 泛洪去白底 + 两轮去白边（移植自 scripts/remove-white-bg.mjs，逻辑一致）
const removeWhiteBg = (pngBuffer, MIN_BRIGHT = 238, MAX_DIFF = 40) => {
  const png = PNG.sync.read(pngBuffer);
  const { width, height, data } = png;
  const N = width * height;
  const FRINGE = Math.max(200, MIN_BRIGHT - 12);
  const isWhite = p => {
    const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    return data[p * 4 + 3] > 0 && mn >= MIN_BRIGHT && (mx - mn) <= MAX_DIFF;
  };
  const visited = new Uint8Array(N);
  const stack = [];
  const seed = p => { if (!visited[p] && isWhite(p)) { visited[p] = 1; stack.push(p); } };
  for (let x = 0; x < width; x++) { seed(x); seed((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { seed(y * width); seed(y * width + width - 1); }
  while (stack.length) {
    const p = stack.pop();
    data[p * 4 + 3] = 0;
    const x = p % width, y = (p / width) | 0;
    if (x > 0) seed(p - 1);
    if (x < width - 1) seed(p + 1);
    if (y > 0) seed(p - width);
    if (y < height - 1) seed(p + width);
  }
  for (let pass = 0; pass < 2; pass++) {
    const clear = [];
    for (let p = 0; p < N; p++) {
      if (data[p * 4 + 3] === 0) continue;
      const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
      if (r < FRINGE || g < FRINGE || b < FRINGE) continue;
      const x = p % width, y = (p / width) | 0;
      if ((x > 0 && data[(p - 1) * 4 + 3] === 0) || (x < width - 1 && data[(p + 1) * 4 + 3] === 0) ||
          (y > 0 && data[(p - width) * 4 + 3] === 0) || (y < height - 1 && data[(p + width) * 4 + 3] === 0))
        clear.push(p);
    }
    for (const p of clear) data[p * 4 + 3] = 0;
  }
  return PNG.sync.write(png);
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

const submit = async (b64, prompt, seed) => {
  const r = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, image: b64, output_format: 'png', seed }),
  });
  if (!r.ok) throw new Error(`submit HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  if (!j.task_id) throw new Error(`no task_id: ${JSON.stringify(j).slice(0, 200)}`);
  return j.task_id;
};

const await_result = async (taskId, timeoutMs = 180000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    await sleep(3000);
    const r = await fetch(`${RESULT}?task_id=${taskId}`, { headers: { Authorization: `Bearer ${KEY}` } });
    const j = await r.json();
    const st = j?.task?.status;
    if (st === 'TASK_STATUS_SUCCEED') return j.images?.[0]?.image_url;
    if (st === 'TASK_STATUS_FAILED') throw new Error(`task failed: ${j?.task?.reason || 'unknown'}`);
  }
  throw new Error('task timeout');
};

// ---------- 联络表：裁上部脸区平铺，一眼比对表情与一致性 ----------
if (has('sheet')) {
  const char = arg('sheet');
  const gen = path.join(STAGE, char);
  if (!fs.existsSync(gen)) { console.error(`没有 ${gen}`); process.exit(1); }
  const CELL = 300, COLS = 5, PAD = 6;
  const items = [];
  // ★ 开头的是现有立绘，当作比对基准放在最前
  const live = path.join(CHARS_ROOT, char);
  for (const n of fs.readdirSync(live).filter(f => f.endsWith('neutral.webp')).slice(0, 3))
    items.push({ label: '★' + n.replace('.webp', ''), file: path.join(live, n) });
  for (const f of fs.readdirSync(gen).filter(f => f.endsWith('.webp')).sort())
    items.push({ label: f.replace('.webp', ''), file: path.join(gen, f) });

  const cells = [];
  for (const it of items) {
    const m = await sharp(it.file).metadata();
    const buf = await sharp(it.file)
      .extract({ left: 0, top: 0, width: m.width, height: Math.round(m.height * 0.38) })
      .resize({ width: CELL, height: CELL, fit: 'contain', background: '#1a1a1a' })
      .png().toBuffer();
    const lbl = Buffer.from(
      `<svg width="${CELL}" height="26"><rect width="100%" height="100%" fill="#000c"/>` +
      `<text x="6" y="18" font-family="monospace" font-size="15" fill="${it.label.startsWith('★') ? '#ffd447' : '#8fe3ff'}">${it.label}</text></svg>`);
    cells.push(await sharp({ create: { width: CELL, height: CELL + 26, channels: 3, background: '#1a1a1a' } })
      .composite([{ input: buf, top: 0, left: 0 }, { input: lbl, top: CELL, left: 0 }]).png().toBuffer());
  }
  const rows = Math.ceil(cells.length / COLS);
  const out = path.join(STAGE, `${char}_sheet.jpg`);
  await sharp({ create: { width: COLS * (CELL + PAD) + PAD, height: rows * (CELL + 26 + PAD) + PAD, channels: 3, background: '#0d0d0d' } })
    .composite(cells.map((input, i) => ({ input, left: PAD + (i % COLS) * (CELL + PAD), top: PAD + Math.floor(i / COLS) * (CELL + 26 + PAD) })))
    .jpeg({ quality: 88 }).toFile(out);
  console.log(`联络表: ${path.relative(process.cwd(), out)}  (${items.length} 格)`);
  process.exit(0);
}

// ---------- 采纳：把暂存区的图搬进 public ----------
if (has('adopt')) {
  // 来源是 qc-sprites --pick 产出的 _picked/ 目录（已择优）。
  // 不传角色名则采纳全部角色。
  const only = arg('adopt');
  const chars = (only === true || !only)
    ? fs.readdirSync(STAGE, { withFileTypes: true }).filter(e => e.isDirectory() && e.name !== 'cg').map(e => e.name)
    : [only];

  let total = 0, skipped = 0;
  for (const char of chars) {
    const from = path.join(STAGE, char, '_picked');
    if (!fs.existsSync(from)) { console.log(`${char}: 没有 _picked/，先跑 node scripts/qc-sprites.mjs --pick`); continue; }
    const dest = path.join(CHARS_ROOT, char);
    let n = 0;
    for (const f of fs.readdirSync(from).filter(f => f.endsWith('.webp'))) {
      // 绝不覆盖已有的原始立绘——那些是人工确认过的资产
      if (fs.existsSync(path.join(dest, f))) { skipped++; continue; }
      fs.copyFileSync(path.join(from, f), path.join(dest, f));
      n++;
    }
    console.log(`${char.padEnd(9)} 采纳 ${n} 张`);
    total += n;
  }
  console.log(`\n✅ 共采纳 ${total} 张${skipped ? `（跳过 ${skipped} 张已存在的，不覆盖原有立绘）` : ''}`);
  console.log('下一步：node scripts/sync-emotion-map.mjs --write   把新键登记进 constants.ts');
  process.exit(0);
}

// ---------- 主流程 ----------
const wardrobe = readWardrobe();
const filterChar = arg('char');
let plan = buildPlan(wardrobe, filterChar);

if (has('plan')) {
  const byChar = {};
  for (const p of plan) (byChar[p.char] ??= []).push(`${p.outfit || '(默认装)'}/${p.emotion}`);
  for (const [c, items] of Object.entries(byChar))
    console.log(`${c.padEnd(9)} 缺 ${String(items.length).padStart(3)} 张  ${items.slice(0, 6).join(', ')}${items.length > 6 ? ' …' : ''}`);
  console.log(`\n合计 ${plan.length} 张，Qwen Edit 约 $${(plan.length * 0.02).toFixed(2)}`);
  process.exit(0);
}

if (!KEY) { console.error('缺少环境变量 NOVITA_KEY'); process.exit(1); }

const LIMIT = Number(arg('limit', 0));
const CANDIDATES = Number(arg('candidates', 1));
if (LIMIT) plan = plan.slice(0, LIMIT);

console.log(`计划生成 ${plan.length} 个缺口 × ${CANDIDATES} 候选 = ${plan.length * CANDIDATES} 张`);
console.log(`预计花费 $${(plan.length * CANDIDATES * 0.02).toFixed(2)}\n`);

// 展开成一个个任务（缺口 × 候选），并发跑——API 是异步的，串行纯属浪费
const tasks = [];
for (const job of plan)
  for (let c = 1; c <= CANDIDATES; c++)
    tasks.push({ ...job, cand: c, name: `${job.outName}${CANDIDATES > 1 ? `_c${c}` : ''}.webp` });

// 跳过已经生成过的（断点续跑：中途挂了直接重跑同一条命令即可）
const todo = tasks.filter(t => !fs.existsSync(path.join(STAGE, t.char, t.name)));
if (todo.length < tasks.length)
  console.log(`跳过 ${tasks.length - todo.length} 张已存在的，实际生成 ${todo.length} 张\n`);

const CONC = Number(arg('concurrency', 6));
let ok = 0, fail = 0, done = 0;
const failures = [];

const runOne = async (t) => {
  const outDir = path.join(STAGE, t.char);
  fs.mkdirSync(outDir, { recursive: true });
  try {
    // 源图合成到纯白底再送进去：Qwen 本来就返回白底，给它干净白底最可控
    const inputPng = await sharp(t.srcFile)
      .resize({ height: 1024, withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .png().toBuffer();
    const prompt = `${EMOTIONS[t.emotion]} ${KEEP} ${lockFor(t.char)}`;
    const url = await await_result(await submit(inputPng.toString('base64'), prompt, Math.floor(Math.random() * 2e9)));
    const raw = Buffer.from(await (await fetch(url)).arrayBuffer());
    // 统一转成 RGBA PNG 再去底（Qwen 可能回 jpeg/无 alpha）
    const rgba = await sharp(raw).ensureAlpha().png().toBuffer();
    const final = await sharp(removeWhiteBg(rgba))
      .trim({ threshold: 1 })                                  // 按 alpha 裁掉空白边
      .resize({ height: OUT_HEIGHT, withoutEnlargement: true })
      .webp({ quality: 86, alphaQuality: 90 }).toBuffer();
    fs.writeFileSync(path.join(outDir, t.name), final);
    ok++;
  } catch (e) {
    fail++;
    failures.push(`${t.char}/${t.name}: ${e.message}`);
  }
  done++;
  if (done % 10 === 0 || done === todo.length)
    console.log(`  ${done}/${todo.length}  成功 ${ok}  失败 ${fail}`);
};

// 简单的并发池
const queue = [...todo];
await Promise.all(Array.from({ length: Math.min(CONC, queue.length) }, async () => {
  while (queue.length) await runOne(queue.shift());
}));

console.log(`\n完成：成功 ${ok}，失败 ${fail}`);
if (failures.length) {
  console.log('失败明细（重跑同一命令会自动续跑这些）：');
  failures.slice(0, 20).forEach(f => console.log('  ' + f));
}
console.log(`结果在 ${path.relative(process.cwd(), STAGE)}/ —— 现在生成联络表：`);
console.log(`  node scripts/gen-sprites.mjs --sheet ${filterChar || ''}`);
