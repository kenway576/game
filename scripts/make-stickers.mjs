// ============================================================================
// 📱 手机聊天用的表情包（スタンプ）
//
// 一张不花钱：直接从每个人现有的表情差分里裁出胸像，
// 外面描一圈粗白边——LINE 贴图那种"剪下来贴上去"的样子。
// 字（「ナイス！」「むっ」）不烧进图里，交给 CSS 叠在上面：
// 改一句台词不用重出一遍图，中日文也都清楚。
//
// 用法：
//   node scripts/make-stickers.mjs          # 全部
//   node scripts/make-stickers.mjs sora     # 只出某个人
//
// 输出：public/images/stickers/<角色>_<表情>.webp（256×256，透明底）
// ============================================================================
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = 'public/images/characters';
const OUT = 'public/images/stickers';
const SIZE = 256;
const OUTLINE = 9;          // 白边粗细（输出像素）

// 每个人拿哪几张表情做贴图。只用默认服装那一套（不带前缀的文件）。
const SETS = {
  asuka:  ['angry', 'happy', 'sad', 'shy', 'smug', 'surprised'],
  hikari: ['angry', 'happy', 'sad', 'shy', 'smug', 'surprised'],
  rei:    ['lecturing', 'neutral', 'shy', 'smile', 'thinking'],
  inari:  ['angry', 'curious', 'happy', 'sly', 'smug', 'surprised', 'sad'],
  miyuki: ['angry', 'happy', 'love', 'shy', 'thinking'],
  sora:   ['angry', 'cute', 'happy', 'love', 'sad', 'shock', 'shy'],
  nao:    ['angry', 'curious', 'happy', 'shy', 'smile'],
  maki:   ['angry', 'happy', 'laugh', 'pout', 'shy', 'smug']
};

// 胸像框占全身高度的比例。真希年纪最小、头身比最大，框要放大，不然只剩头顶和猫耳。
const SCALE = { maki: 0.4, inari: 0.32 };

const only = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const makeOne = async (char, expr) => {
  const file = path.join(SRC, char, `${expr}.webp`);
  if (!fs.existsSync(file)) { console.log(`  跳过 ${char}/${expr}（没有这张）`); return; }
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const A = (x, y) => data[(y * W + x) * 4 + 3];

  // 人从哪一行开始（头顶 / 马尾尖）
  let top = 0;
  outer: for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (A(x, y) > 40) { top = y; break outer; }

  // 脸在哪一列：取头顶往下 5%~14% 那一段（大致是脸）不透明像素的中位数。
  // 用中位数不用平均：马尾、举起来的手会把平均值拽偏。
  const xs = [];
  for (let y = Math.floor(top + H * 0.05); y < Math.floor(top + H * 0.14); y++)
    for (let x = 0; x < W; x++) if (A(x, y) > 128) xs.push(x);
  xs.sort((a, b) => a - b);
  const cx = xs.length ? xs[Math.floor(xs.length / 2)] : W / 2;

  // 胸像：边长取全身高度的 29%，从头顶上面一点开始
  const S = Math.round(H * (SCALE[char] || 0.29));
  const x0 = Math.round(cx - S / 2);
  const y0 = Math.max(0, Math.round(top - H * 0.012));

  // 越界的部分用透明补齐，再裁
  const pad = S;
  const padded = await sharp(file).ensureAlpha()
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  const inner = SIZE - OUTLINE * 2 - 6;
  const bust = await sharp(padded)
    .extract({ left: x0 + pad, top: y0 + pad, width: S, height: S })
    .resize(inner, inner)
    .extend({ top: OUTLINE + 3, bottom: OUTLINE + 3, left: OUTLINE + 3, right: OUTLINE + 3, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw().toBuffer({ resolveWithObject: true });

  // 白边：把 alpha 膨胀一圈（圆形结构元素），涂白，垫在下面
  const bw = bust.info.width, bh = bust.info.height;
  const src = bust.data;
  const mask = new Uint8Array(bw * bh);
  for (let i = 0; i < bw * bh; i++) mask[i] = src[i * 4 + 3] > 60 ? 1 : 0;
  const out = Buffer.alloc(bw * bh * 4);
  const r = OUTLINE, r2 = r * r;
  const offs = [];
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r2) offs.push([dx, dy]);
  for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
    let hit = false;
    for (const [dx, dy] of offs) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= bw || ny >= bh) continue;
      if (mask[ny * bw + nx]) { hit = true; break; }
    }
    const i = (y * bw + x) * 4;
    if (hit) { out[i] = 255; out[i + 1] = 255; out[i + 2] = 255; out[i + 3] = 255; }
    // 人叠上去
    const a = src[i + 3] / 255;
    if (a > 0) {
      out[i]     = Math.round(src[i] * a + out[i] * (1 - a));
      out[i + 1] = Math.round(src[i + 1] * a + out[i + 1] * (1 - a));
      out[i + 2] = Math.round(src[i + 2] * a + out[i + 2] * (1 - a));
      out[i + 3] = Math.max(out[i + 3], src[i + 3]);
    }
  }
  const dest = path.join(OUT, `${char}_${expr}.webp`);
  await sharp(out, { raw: { width: bw, height: bh, channels: 4 } })
    .resize(SIZE, SIZE)
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(dest);
  console.log(`  ${path.basename(dest)}`);
};

for (const [char, exprs] of Object.entries(SETS)) {
  if (only && only !== char) continue;
  console.log(char);
  for (const e of exprs) await makeOne(char, e);
}
console.log('✅ 完成');
