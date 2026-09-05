// ============================================================================
// 绿幕立绘抠像 (chroma key)
//
// 为什么不用 remove-white-bg / defringe 那套：
// 那些脚本是按「白 = 背景」判定的，而便利店店员穿白衬衫白鞋——
// 每跑一次就啃掉一圈衣服边缘，跑几次人物轮廓就糊了（这次返工的直接原因）。
// 绿幕从根上避开了这个问题：背景色和角色身上的颜色不冲突。
//
// 做四件事：
//   1) 绿度判定 g = G - max(R,B)。背景绿 g 很大，皮肤/深蓝制服 g 是负的，
//      分离度极高，不需要手调阈值。
//   2) **只删和画布边缘连通的绿**（从四边 flood fill）。
//      角色身上真的有绿色（工牌）时不会被一起抠掉。
//   3) 去溢色 (despill)：边缘半透明像素会被绿幕染绿，把 G 压回 max(R,B)。
//      不做这步，人物边缘会镶一圈荧光绿。
//   4) 按 alpha 包围盒裁掉多余画布，再统一缩放到目标高度。
//      生图工具给的画幅忽大忽小（有 768×1408 也有 1408×768），
//      不裁的话同一个人在游戏里一会儿大一会儿小。
//
// 用法：
//   node scripts/key-greenscreen.mjs <输入> -o <输出.webp> [选项]
//   node scripts/key-greenscreen.mjs <输入目录> -d <输出目录> [选项]
// 选项：
//   --height N     输出高度，默认 1024（和现有立绘一致）
//   --lo N         绿度下限，低于它完全不透明（默认 24）
//   --hi N         绿度上限，高于它完全透明（默认 72）
//   --despill N    去溢色强度 0~1，默认 1（完全压掉）
//   --pad N        裁切后四周留白像素，默认 8
//   --dry          只报告不写文件
// ============================================================================
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARGS = process.argv.slice(2);
const num = (flag, dflt) => {
  const i = ARGS.indexOf(flag);
  return i >= 0 && ARGS[i + 1] !== undefined ? Number(ARGS[i + 1]) : dflt;
};
const str = (flag, dflt = null) => {
  const i = ARGS.indexOf(flag);
  return i >= 0 && ARGS[i + 1] !== undefined ? ARGS[i + 1] : dflt;
};

const OUT_FILE = str('-o');
const OUT_DIR = str('-d');
const HEIGHT = num('--height', 1024);
const LO = num('--lo', 24);
const HI = num('--hi', 72);
const DESPILL = num('--despill', 1);
const PAD = num('--pad', 8);
const DRY = ARGS.includes('--dry');
const HOLES = ARGS.includes('--holes');

const VALUE_FLAGS = new Set(['-o', '-d', '--height', '--lo', '--hi', '--despill', '--pad']);
const valueIdx = new Set(
  ARGS.map((a, i) => (VALUE_FLAGS.has(a) ? i + 1 : -1)).filter(i => i >= 0)
);
const TARGETS = ARGS.filter((a, i) => !a.startsWith('-') && !valueIdx.has(i));

if (!TARGETS.length || (!OUT_FILE && !OUT_DIR)) {
  console.error('用法: node scripts/key-greenscreen.mjs <输入> -o <输出.webp>');
  console.error('      node scripts/key-greenscreen.mjs <输入目录> -d <输出目录>');
  process.exit(1);
}

const collect = (t) => {
  const st = fs.statSync(t);
  if (st.isFile()) return /\.(jpe?g|png|webp)$/i.test(t) ? [t] : [];
  return fs.readdirSync(t).flatMap(n => collect(path.join(t, n)));
};

const files = TARGETS.flatMap(collect);
if (!files.length) { console.error('没有找到图片'); process.exit(1); }

for (const file of files) {
  const srcBuf = fs.readFileSync(file);
  const { data, info } = await sharp(srcBuf).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;

  // ---- 1) 绿度 ----
  const green = new Int16Array(W * H);
  for (let p = 0; p < W * H; p++) {
    const i = p * 4;
    green[p] = data[i + 1] - Math.max(data[i], data[i + 2]);
  }

  // ---- 2) 从四边 flood fill，只标记「和边缘连通的绿」 ----
  const isBg = new Uint8Array(W * H);      // 1 = 判定为背景
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (isBg[p] || green[p] < LO) return;
    isBg[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W, y = (p - x) / W;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  // 角色身上完全没有绿色时，允许一并清理被手臂/腰部围住的内侧绿幕洞
  if (HOLES) {
    for (let p = 0; p < W * H; p++) {
      if (!isBg[p] && green[p] >= LO) isBg[p] = 1;
    }
  }

  // ---- 3) 由绿度算 alpha + 去溢色 ----
  let cleared = 0, softened = 0, despilled = 0;
  for (let p = 0; p < W * H; p++) {
    const i = p * 4;
    if (isBg[p]) {
      const g = green[p];
      if (g >= HI) { data[i + 3] = 0; cleared++; continue; }
      // LO..HI 之间：抗锯齿边缘，给一个渐变 alpha，保住柔边
      const a = Math.round(255 * (1 - (g - LO) / (HI - LO)));
      data[i + 3] = Math.max(0, Math.min(255, a));
      softened++;
    }
    // 去溢色：边缘被绿幕染绿的像素，把 G 压回 max(R,B)
    if (data[i + 3] > 0) {
      const cap = Math.max(data[i], data[i + 2]);
      if (data[i + 1] > cap) {
        data[i + 1] = Math.round(data[i + 1] + (cap - data[i + 1]) * DESPILL);
        despilled++;
      }
    }
  }

  // ---- 4) 按 alpha 包围盒裁切 ----
  let minX = W, maxX = -1, minY = H, maxY = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] > 8) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) { console.warn(`${path.basename(file)}: 全透明，跳过`); continue; }
  const left = Math.max(0, minX - PAD), top = Math.max(0, minY - PAD);
  const cw = Math.min(W - left, maxX - minX + 1 + PAD * 2);
  const ch = Math.min(H - top, maxY - minY + 1 + PAD * 2);

  const base = path.basename(file).replace(/\.(jpe?g|png|webp)$/i, '');
  const outPath = OUT_FILE || path.join(OUT_DIR, base + '.webp');

  const line = `${path.basename(file).padEnd(24)} ${W}x${H} → 裁 ${cw}x${ch} → 高 ${HEIGHT}` +
    `  (透明 ${cleared}, 柔边 ${softened}, 去溢色 ${despilled})`;
  if (DRY) { console.log('[dry] ' + line); continue; }

  if (OUT_DIR) fs.mkdirSync(OUT_DIR, { recursive: true });
  const buf = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left, top, width: cw, height: ch })
    .resize({ height: HEIGHT, fit: 'inside', withoutEnlargement: false })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
  fs.writeFileSync(outPath, buf);
  console.log(line + `  → ${outPath}`);
}

if (!DRY) console.log('\n✅ 完成');
