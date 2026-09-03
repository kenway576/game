// ============================================================================
// 立绘白边清理
//
// 【病因】不是"没抠"。462 张立绘全都有 alpha，外圈也确实透明。
// 剩下的白是**被角色自己围住的背景**：双马尾和头之间、马尾和身体之间、
// 腋下那几个三角。上一版抠图是"从画布边缘做洪水填充"，
// 这些口袋四面都被不透明的头发和身体挡着，洪水永远到不了，于是整块留了下来。
// 放到深色背景上，就是脑袋两边那两坨白。
// （两腿之间反而是干净的——那块通到画布下边缘，洪水够得着。）
//
// 【怎么把"漏掉的背景"和"白衬衫"分开】
// 试过几个都不行：
//   · 按亮度分 —— 不行，两者都能到 255
//   · 按连通性分 —— 不行，口袋和衬衫都是封闭区域
// 真正管用的是**平整度**：原始背景是一块死白，没有任何明暗；
// 而画出来的白布一定有褶皱和阴影。实测（明日香 · 制服）：
//
//   口袋（发丝之间、头两侧）   亮度 >250 的像素占 76% ~ 93%
//   衬衫（袖子、前襟）          同一指标只有 2% ~ 5%
//
// 所以判据是：一个"又亮又中性"的连通块，如果绝大部分像素都是纯白，
// 它就是没抠干净的背景；只要带着明显的明暗层次，它就是衣服，不许动。
//
// 【三步】
//   1. 从画布四边 + 所有已透明像素洪水填充，清掉够得着的背景
//   2. 按上面的平整度判据，清掉够不着的封闭口袋
//   3. 对所有新暴露出来的边缘做羽化 + 去白（un-premultiply）：
//      紧贴透明区的几像素按"掺了多少白"降 alpha 并把白色除掉，
//      否则边缘会留下一圈被白冲淡过的发色，而且锯齿很硬
//
// 用法：
//   node scripts/clean-sprite-matte.mjs                    # 全部，就地改写
//   node scripts/clean-sprite-matte.mjs asuka              # 只处理路径含 asuka 的
//   node scripts/clean-sprite-matte.mjs asuka/neutral --preview
//        # 不改原图，另存 _preview_*.png（青底合成，用来肉眼验收）
//
// 原图都在 git 里，就地改写随时可以 git checkout 回滚。
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHARS = path.join(ROOT, 'public', 'images', 'characters');

// —— 判据参数 ——
// 洪水填充的门槛必须**很严**。松了会出事：第一版用 lum>=200 / sat<=34，
// 结果真希的白礼服和深雪的白背心裙被整片吃掉——那些衣服本身就是又亮又中性的，
// 只要衣服和背景之间有一处没画深色描边，洪水就直接灌进去了。
// 原始背景是死白（几乎正好 255,255,255），而画出来的白布一定带褶皱阴影，
// 所以门槛卡在"接近纯白"上，洪水就迈不进衣服里。
// 至于轮廓外那圈 200~245 的淡灰辉光，不靠洪水解决，交给第 3 步的羽化带。
const BG_LUM   = 246;  // 洪水填充：亮度高于此（接近纯白）
const BG_SAT   = 12;   // 洪水填充：三通道极差低于此
const PK_LUM   = 185;  // 口袋检测：连通块的成员门槛
const PK_SAT   = 38;
const PK_PURE  = 250;  // "纯白"的界线
const PK_RATIO = 0.60; // 纯白占比高于此 → 判定为漏掉的背景
// 下限必须比"一张嘴"大。第一版定在 120px，结果把张嘴立绘的口腔
// （牙齿是一块被围住的、几乎全白的区域）当成漏抠的背景抠穿了，
// 游戏里看上去就是一张黑嘴。实测：光的嘴 459~524px，
// 而真正要清的背景口袋（头和马尾之间）是 2600~6900px，中间隔得很开。
const PK_MIN_PCT = 0.002;  // 占全图的比例，约 1500px（528x1400 的图）
const PK_MAXPCT= 0.12; // 大于整图这个比例的块不动（宁可留着也不敢吃衣服）
const FEATHER  = 5;    // 羽化带宽（辉光靠它，不靠洪水）
const FEATHER_LUM = 196;

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const sat = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

async function clean(file) {
  // 先整个读进内存再交给 sharp。直接 sharp(路径) 的话，
  // Windows 上源文件会被占着，后面 rename 覆盖自己就 EPERM。
  const src = fs.readFileSync(file);
  const { data, info } = await sharp(src).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const bg = new Uint8Array(N);

  const L = p => { const i = p * 4; return lum(data[i], data[i + 1], data[i + 2]); };
  const S = p => { const i = p * 4; return sat(data[i], data[i + 1], data[i + 2]); };
  const nbrs = p => {
    const x = p % W, y = (p - x) / W;
    const out = [];
    if (x + 1 < W) out.push(p + 1);
    if (x > 0)     out.push(p - 1);
    if (y + 1 < H) out.push(p + W);
    if (y > 0)     out.push(p - W);
    return out;
  };

  // ---- 1. 够得着的背景 ----
  const reachable = p => data[p * 4 + 3] < 8 || (L(p) >= BG_LUM && S(p) <= BG_SAT);
  const stack = [];
  const push = p => { if (!bg[p] && reachable(p)) { bg[p] = 1; stack.push(p); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  for (let p = 0; p < N; p++) if (data[p * 4 + 3] < 8) push(p);
  while (stack.length) for (const q of nbrs(stack.pop())) push(q);

  let flooded = 0;
  for (let p = 0; p < N; p++) if (bg[p] && data[p * 4 + 3] > 0) flooded++;

  // ---- 2. 够不着的封闭口袋 ----
  const memberOf = p => !bg[p] && data[p * 4 + 3] > 200 && L(p) >= PK_LUM && S(p) <= PK_SAT;
  const seen = new Uint8Array(N);
  let pockets = 0, pocketPx = 0;
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || !memberOf(p0)) continue;
    const st = [p0]; seen[p0] = 1; const cells = [];
    while (st.length) {
      const p = st.pop(); cells.push(p);
      for (const q of nbrs(p)) if (!seen[q] && memberOf(q)) { seen[q] = 1; st.push(q); }
    }
    if (cells.length < N * PK_MIN_PCT || cells.length > N * PK_MAXPCT) continue;
    let pure = 0;
    for (const p of cells) if (L(p) > PK_PURE) pure++;
    if (pure / cells.length < PK_RATIO) continue;   // 有明暗层次 = 衣服，放过
    for (const p of cells) bg[p] = 1;
    pockets++; pocketPx += cells.length;
  }

  // ---- 3. 羽化 + 去白 ----
  const dist = new Int16Array(N).fill(-1);
  let frontier = [];
  for (let p = 0; p < N; p++) {
    if (!bg[p]) continue;
    for (const q of nbrs(p)) if (!bg[q] && dist[q] === -1) { dist[q] = 1; frontier.push(q); }
  }
  for (let d = 2; d <= FEATHER && frontier.length; d++) {
    const next = [];
    for (const p of frontier)
      for (const q of nbrs(p)) if (!bg[q] && dist[q] === -1) { dist[q] = d; next.push(q); }
    frontier = next;
  }

  const out = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    if (bg[p]) continue;                               // 全 0 = 透明
    let r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    const d = dist[p];
    if (d > 0) {
      const whiteness = Math.min(1, Math.max(0, (lum(r, g, b) - FEATHER_LUM) / (255 - FEATHER_LUM)));
      const nearness = (FEATHER - d + 1) / FEATHER;
      const alpha = Math.max(0, 1 - whiteness * nearness);
      if (alpha < 0.02) continue;
      if (alpha < 0.999) {
        const un = c => Math.max(0, Math.min(255, Math.round((c - (1 - alpha) * 255) / alpha)));
        r = un(r); g = un(g); b = un(b);
        a = Math.round(a * alpha);
      }
    }
    out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = a;
  }

  return { out, W, H, flooded, pockets, pocketPx };
}

const args = process.argv.slice(2);
const preview = args.includes('--preview');
const filter = args.find(a => !a.startsWith('--')) || '';

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.webp')) files.push(p);
  }
})(CHARS);

const targets = files.filter(f => path.relative(CHARS, f).replace(/\\/g, '/').includes(filter));
if (!targets.length) { console.error('没有匹配的文件:', filter); process.exit(1); }
console.log(`${targets.length} 张${preview ? '（预览，不改原图）' : '（就地改写）'}\n`);
console.log('file'.padEnd(34), 'flood', 'pocket', 'px');

let touched = 0;
for (const f of targets) {
  const rel = path.relative(CHARS, f).replace(/\\/g, '/');
  try {
    const { out, W, H, flooded, pockets, pocketPx } = await clean(f);
    const png = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
    if (preview) {
      const name = '_preview_' + rel.replace(/\//g, '_').replace(/\.webp$/, '.png');
      await sharp({ create: { width: W, height: H, channels: 4, background: '#0d3b45' } })
        .composite([{ input: png }]).png().toFile(path.join(ROOT, name));
    } else {
      const webp = await sharp(png).webp({ quality: 92, alphaQuality: 100 }).toBuffer();
      fs.writeFileSync(f, webp);
    }
    if (flooded + pocketPx > 0) touched++;
    console.log(rel.padEnd(34), String(flooded).padStart(5), String(pockets).padStart(6), String(pocketPx).padStart(7));
  } catch (e) {
    console.log(rel.padEnd(34), '失败:', e.message);
  }
}
console.log(`\n${targets.length} 张，其中 ${touched} 张有白边被清掉。`);
