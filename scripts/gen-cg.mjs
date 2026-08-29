/**
 * 🌸 事件 CG 生成（Novita · Qwen-Image Edit）
 *
 * 为什么不用文生图：现有 CG 跟立绘对不上——Asuka 立绘是红瞳亮红发白衬衫，
 * CG 里却是蓝瞳橙发棕开衫，玩家对话时看到一个人、进画廊看到另一个人。
 * 所以这里拿**角色自己的立绘**当输入，让模型把她放进场景里，
 * 人物特征由原图锁定，只有场景和构图是新画的。
 *
 * 画风参考 Brown Dust 2 的渲染语言（见 BD2_STYLE）：半写实厚涂、
 * 环境光染色、强边缘光、发丝高光带、细腻可变线条、景深背景。
 *
 * 用法：
 *   node scripts/gen-cg.mjs --list                  # 看 CG 清单与场景描述
 *   node scripts/gen-cg.mjs --char asuka            # 生成单个角色的 CG
 *   node scripts/gen-cg.mjs --all --candidates 2    # 全部角色，每张 2 个候选
 *   node scripts/gen-cg.mjs --sheet                 # 生成对比联络表
 *
 * 输出到 .generated/cg/，不覆盖 public。
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const has = (n) => process.argv.includes(`--${n}`);

const KEY = process.env.NOVITA_KEY;
const API = 'https://api.novita.ai/v3/async/qwen-image-edit';
const RESULT = 'https://api.novita.ai/v3/async/task-result';
const CHARS_ROOT = path.resolve('public/images/characters');
const STAGE = path.resolve('.generated/cg');

// ---------- 画风：BD2 的渲染语言 ----------
// 拆自 Brown Dust 2 官方 KV 的共同特征，只取渲染手法，不涉及题材。
const BD2_STYLE =
  'Rendered in the polished semi-realistic anime style of a high-end mobile game key visual: ' +
  'soft airbrushed gradient shading on skin with warm subsurface tones rather than flat cel shading, ' +
  'strong cinematic rim lighting separating the figure from the background, ' +
  'the whole figure colour-graded by the scene lighting so light and shadow feel physically connected to the environment, ' +
  'glossy banded specular highlights running through the hair, ' +
  'painterly hair rendered as distinct strand clumps with root-to-tip gradients, ' +
  'fine variable-width coloured line art rather than uniform black outlines, ' +
  'rich saturated colour with deep contrasty shadows and glowing highlights, ' +
  'atmospheric background with shallow depth of field and visible bokeh, ' +
  'detailed fabric folds and material definition. Masterpiece quality, 16:9 cinematic composition.';

// 人物必须与输入立绘一致——这是这套方案的全部意义
const KEEP_CHAR =
  'The girl in the output MUST be the exact same character as in the input image: ' +
  'identical face, identical eye colour, identical hairstyle and hair colour, identical outfit and accessories. ' +
  'Do not restyle her, do not change her colours. Only the pose, the framing and the background scene are new.';

// ---------- CG 场景脚本 ----------
// 场景取自 constants.ts 的 CHARACTER_CGS（标题/描述），这里写成绘画指令。
const SCENES = {
  asuka:  'Redraw her as a cinematic 16:9 event illustration: she sits sideways at a school desk in an empty classroom drenched in golden sunset light streaming through tall windows, twisting a lock of her hair, cheeks flushed, glancing back at the viewer with a flustered tsundere expression. Warm orange backlight, long shadows across the desks, dust motes glowing in the air.',
  hikari: 'Redraw her as a cinematic 16:9 event illustration: she stands at the edge of a summer beach at golden hour, sea breeze lifting her hair, turning toward the viewer mid-laugh with both arms open. Sparkling ocean bokeh behind her, warm rim light along her shoulders, spray catching the sunlight.',
  rei:    'Redraw her as a cinematic 16:9 event illustration: she sits alone in a quiet library at night surrounded by tall bookshelves, a single warm desk lamp lighting her face from below as she looks up from a book toward the viewer, her expression softening. Deep blue shadows, floating dust in the lamp beam, shallow depth of field.',
  nao:    'Redraw her as a cinematic 16:9 event illustration: an ordinary evening in a warm home kitchen, she turns from the stove toward the viewer with a spoon in hand and an exasperated fond smile, steam rising, low warm lamplight, the comfortable intimacy of two people who grew up next door.',
  miyuki: 'Redraw her as a cinematic 16:9 event illustration: she sits on a sunlit balcony in the late afternoon with a tea tray beside her, looking over her shoulder at the viewer with a gentle knowing smile, hair drifting in the breeze, laundry and potted plants softly out of focus behind her.',
  inari:  'Redraw her as a cinematic 16:9 event illustration: she reclines on the veranda of a moonlit Shinto shrine, nine fox tails fanned around her glowing faintly, golden eyes fixed on the viewer with ancient amusement, floating blue foxfire orbs drifting through the night air, torii gate silhouetted behind.',
  sora:   'Redraw her as a cinematic 16:9 event illustration: on a school rooftop at dusk after practice, towel around her neck, she leans on the railing and grins sideways at the viewer, sweat catching the last orange light, the city skyline glowing out of focus behind her.',
  maki:   'Redraw her as a cinematic 16:9 event illustration: inside a neon-lit arcade at night, she leans back against an arcade cabinet with headphones around her neck, smirking up at the viewer, saturated pink and cyan neon reflecting off her hair and face, blurred game screens glowing behind her.',
  ren:    'Redraw her as a cinematic 16:9 event illustration: in a candle-lit abandoned clubroom that she has declared her secret headquarters, she stands with her cloak flaring dramatically, one hand raised in a grand theatrical gesture, eyes gleaming with chuunibyou conviction, candlelight throwing enormous shadows up the walls.',
  haku:   'Redraw him as a cinematic 16:9 event illustration: a butler in an elegant manor drawing room at dusk, caught mid-bow with one hand over his heart, warm chandelier light behind him, his composed expression softening for just a moment as he looks up at the viewer.',
};

// 与立绘生成共用的身份锁
const LOCKS = {
  asuka:  'Her eyes MUST be crimson red and her hair MUST be bright red in twin tails.',
  hikari: 'Her eyes MUST be golden amber and her hair MUST be blonde.',
  rei:    'Her eyes MUST be deep blue, she MUST keep her glasses, and her hair MUST be pale mint green.',
  nao:    'Her eyes MUST be warm brown and her hair MUST be chestnut brown.',
  miyuki: 'Her eyes MUST be pale lavender and her hair MUST be long silver-white.',
  sora:   'Her eyes MUST be bright amber and her hair MUST be short dark brown.',
  maki:   'Her eyes MUST be green and her hair MUST be pink.',
  inari:  'Her eyes MUST be golden yellow, her hair MUST be long orange-red, and she MUST keep her fox ears and multiple tails.',
  ren:    'Her eye colour and hair colour MUST match the input image exactly.',
  haku:   'His eye colour and hair colour MUST match the input image exactly.',
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
  if (!j.task_id) throw new Error('no task_id');
  return j.task_id;
};

const awaitResult = async (id, timeoutMs = 240000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    await sleep(3000);
    const j = await (await fetch(`${RESULT}?task_id=${id}`, { headers: { Authorization: `Bearer ${KEY}` } })).json();
    if (j?.task?.status === 'TASK_STATUS_SUCCEED') return j.images?.[0]?.image_url;
    if (j?.task?.status === 'TASK_STATUS_FAILED') throw new Error(j?.task?.reason || 'failed');
  }
  throw new Error('timeout');
};

if (has('list')) {
  for (const [c, s] of Object.entries(SCENES)) console.log(`\n■ ${c}\n  ${s}`);
  process.exit(0);
}

if (has('sheet')) {
  const files = fs.existsSync(STAGE) ? fs.readdirSync(STAGE).filter(f => f.endsWith('.webp')).sort() : [];
  if (!files.length) { console.error('暂存区没有 CG'); process.exit(1); }
  const W = 560, COLS = 3, PAD = 6;
  const cells = [];
  for (const f of files) {
    const img = await sharp(path.join(STAGE, f)).resize({ width: W }).png().toBuffer();
    const h = (await sharp(img).metadata()).height;
    const lbl = Buffer.from(`<svg width="${W}" height="24"><rect width="100%" height="100%" fill="#000c"/><text x="6" y="17" font-family="monospace" font-size="14" fill="#8fe3ff">${f.replace('.webp','')}</text></svg>`);
    cells.push({ buf: await sharp({ create: { width: W, height: h + 24, channels: 3, background: '#111' } })
      .composite([{ input: img, top: 0, left: 0 }, { input: lbl, top: h, left: 0 }]).png().toBuffer(), h: h + 24 });
  }
  const rowH = Math.max(...cells.map(c => c.h));
  const rows = Math.ceil(cells.length / COLS);
  const out = path.join(STAGE, '_cg_sheet.jpg');
  await sharp({ create: { width: COLS * (W + PAD) + PAD, height: rows * (rowH + PAD) + PAD, channels: 3, background: '#0d0d0d' } })
    .composite(cells.map((c, i) => ({ input: c.buf, left: PAD + (i % COLS) * (W + PAD), top: PAD + Math.floor(i / COLS) * (rowH + PAD) })))
    .jpeg({ quality: 86 }).toFile(out);
  console.log(`联络表: ${path.relative(process.cwd(), out)} (${files.length} 张)`);
  process.exit(0);
}

if (!KEY) { console.error('缺少 NOVITA_KEY'); process.exit(1); }

const only = arg('char');
const chars = only ? [only] : Object.keys(SCENES);
const CANDIDATES = Number(arg('candidates', 1));
fs.mkdirSync(STAGE, { recursive: true });

const tasks = [];
for (const c of chars)
  for (let i = 1; i <= CANDIDATES; i++)
    tasks.push({ char: c, cand: i, name: `cg_${c}${CANDIDATES > 1 ? `_c${i}` : ''}.webp` });

const todo = tasks.filter(t => !fs.existsSync(path.join(STAGE, t.name)));
console.log(`生成 ${todo.length} 张 CG，约 $${(todo.length * 0.02).toFixed(2)}\n`);

let ok = 0, fail = 0;
const run = async (t) => {
  try {
    // 用该角色最"标准"的立绘当人物参考
    const dir = path.join(CHARS_ROOT, t.char);
    const src = ['neutral.webp', 'casual_neutral.webp', 'school_neutral.webp']
      .map(f => path.join(dir, f)).find(f => fs.existsSync(f))
      || path.join(dir, fs.readdirSync(dir).filter(f => f.endsWith('.webp'))[0]);

    const input = await sharp(src).resize({ height: 1024, withoutEnlargement: true })
      .flatten({ background: '#ffffff' }).png().toBuffer();
    const prompt = `${SCENES[t.char]} ${KEEP_CHAR} ${LOCKS[t.char] || ''} ${BD2_STYLE}`;
    const url = await awaitResult(await submit(input.toString('base64'), prompt, Math.floor(Math.random() * 2e9)));
    const raw = Buffer.from(await (await fetch(url)).arrayBuffer());
    // CG 是有背景的整图，不抠底；按 16:9 裁到 1600x900
    const out = await sharp(raw).resize(1600, 900, { fit: 'cover', position: 'attention' })
      .webp({ quality: 88 }).toBuffer();
    fs.writeFileSync(path.join(STAGE, t.name), out);
    console.log(`✅ ${t.name}  ${(out.length / 1024).toFixed(0)}KB`);
    ok++;
  } catch (e) {
    console.log(`❌ ${t.name}: ${e.message}`);
    fail++;
  }
};

const q = [...todo];
await Promise.all(Array.from({ length: Math.min(4, q.length) }, async () => { while (q.length) await run(q.shift()); }));
console.log(`\n完成：成功 ${ok}，失败 ${fail}`);
console.log('看联络表：node scripts/gen-cg.mjs --sheet');
