// ============================================================================
// 立绘白边清理 (de-fringe)
//
// 症状：立绘已经有 alpha 了，但贴到深色背景上，头发丝、手指、裙摆边缘还是
// 镶着一圈白毛。原因不是"抠得不够"，而是这些半透明像素的 RGB 是
// **在白底上合成过的**——它们记录的是 (前景×α + 白×(1-α))，白色被烤进颜色里了。
// 单纯再抠一次 alpha 没用，得把白色从颜色里除回去。
//
// 做三件事：
//   1) 去白底预乘 (un-premultiply against white)
//        c' = (c - 255·(1-α)) / α
//      这一步把边缘半透明像素的真实颜色还原出来，白毛立刻消失，
//      而柔和的抗锯齿边缘完整保留（不是靠腐蚀硬砍掉的）。
//   2) α 太低的像素直接归零。这些点几乎看不见，但除法会把压缩噪点放大成彩边。
//   3) 紧贴透明区、又几乎纯白的**不透明**像素清掉一圈——抠像残留的硬白线。
//      只清一圈，白衬衫/白鞋这类"本来就是白的"部位最多掉 1px，肉眼无感。
//
// 用法：
//   node scripts/defringe-sprites.mjs <文件或目录> [...更多] [--dry] [--backup <dir>]
// 例：
//   node scripts/defringe-sprites.mjs public/images/characters
//   node scripts/defringe-sprites.mjs public/images/characters/clerk_misaki_welcome.webp --dry
// ============================================================================
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry');
const backupIdx = ARGS.indexOf('--backup');
const BACKUP_DIR = backupIdx >= 0 ? ARGS[backupIdx + 1] : null;
const VALUE_FLAGS = ['--backup', '--depth', '--min-ch', '--contrast'];
const valueIdx = new Set(
  VALUE_FLAGS.map(f => ARGS.indexOf(f)).filter(i => i >= 0).map(i => i + 1)
);
const TARGETS = ARGS.filter((a, i) => !a.startsWith('--') && !valueIdx.has(i));

// α 低于这个值的像素直接丢弃：除法会把它们的压缩噪点放大成彩色脏边
const ALPHA_FLOOR = 24;
// "几乎纯白"的判定阈值（三通道都要超过）
const WHITE_CUT = 236;
// 白描边修复（可用命令行覆盖）：
//   --depth N     往里修几圈（默认 3；白描边常有 2px 厚，再加一圈抗锯齿）
//   --min-ch N    描边像素的最低通道值，低于此不当描边（默认 150）
//   --contrast N  与内侧一格的亮度差门槛，差得不够多就不动（默认 34）
// 真正的判据是 contrast：白衬衫/白鞋往里一格同样是白的，差值不够，不会被误伤。
const num = (flag, dflt) => {
  const i = ARGS.indexOf(flag);
  return i >= 0 && ARGS[i + 1] ? Number(ARGS[i + 1]) : dflt;
};
const OUTLINE_DEPTH = num('--depth', 3);
const OUTLINE_MIN_CH = num('--min-ch', 150);
const OUTLINE_CONTRAST = num('--contrast', 34);

if (!TARGETS.length) {
  console.error('用法: node scripts/defringe-sprites.mjs <文件或目录> [--dry] [--backup <dir>]');
  process.exit(1);
}

const collect = (target) => {
  const st = fs.statSync(target);
  if (st.isFile()) return /\.(webp|png)$/i.test(target) ? [target] : [];
  return fs.readdirSync(target).flatMap(name => collect(path.join(target, name)));
};

const files = TARGETS.flatMap(collect);
if (!files.length) {
  console.error('没有找到 .webp / .png 文件');
  process.exit(1);
}

let totalFixed = 0;

for (const file of files) {
  // 先把文件读成 Buffer 再交给 sharp：直接传路径的话 sharp 会占住句柄，
  // 之后原地覆写同一个文件在 Windows 上会 UNKNOWN: open failed。
  const srcBuf = fs.readFileSync(file);
  const { data, info } = await sharp(srcBuf).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  // 统计：处理前有多少"发白的半透明像素"
  let before = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a > 10 && a < 245 && (data[i] + data[i + 1] + data[i + 2]) / 3 > 225) before++;
  }

  // ---- 1) + 2) 去白底预乘 / 丢弃过低的 α ----
  let unpremul = 0, dropped = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0 || a === 255) continue;
    if (a < ALPHA_FLOOR) { data[i + 3] = 0; dropped++; continue; }
    const alpha = a / 255;
    for (let c = 0; c < 3; c++) {
      const v = (data[i + c] - 255 * (1 - alpha)) / alpha;
      data[i + c] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
    unpremul++;
  }

  // ---- 3) 削掉贴着透明区的那一圈硬白线 ----
  // 先记下原始 alpha，避免边削边扩散（一次只削一圈）
  const alpha0 = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) alpha0[p] = data[p * 4 + 3];

  let ringCut = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x, i = p * 4;
      if (alpha0[p] < 250) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < WHITE_CUT || g < WHITE_CUT || b < WHITE_CUT) continue;
      let touchesVoid = false;
      for (let dy = -1; dy <= 1 && !touchesVoid; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) { touchesVoid = true; break; }
          if (alpha0[ny * W + nx] < 20) { touchesVoid = true; break; }
        }
      }
      if (touchesVoid) { data[i + 3] = 0; ringCut++; }
    }
  }

  // ---- 4) 抹掉烤进画面里的白色描边 ----
  // 这一圈是**不透明**的，所以前三步都碰不到它：生成立绘时常见的"贴纸白描边"。
  // 做法不是把它削掉（那会让人物缩水、边缘变硬），而是把它的颜色换成
  // 沿着轮廓往里一格的真实颜色——白线消失，剪影尺寸和柔边都保持原样。
  // 白衬衫、白鞋这些"本来就白"的地方不会被误伤：它们往里一格同样是白的，
  // 亮度差不够大，规则不触发。
  const alphaNow = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) alphaNow[p] = data[p * 4 + 3];

  // 到最近透明像素的切比雪夫距离（画布外按透明算）
  const INF = 32000;
  const D = new Int32Array(W * H);
  for (let p = 0; p < W * H; p++) D[p] = alphaNow[p] < 20 ? 0 : INF;
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : D[y * W + x];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x; if (D[p] === 0) continue;
    let m = D[p];
    for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0]]) {
      const nd = at(x + dx, y + dy) + 1; if (nd < m) m = nd;
    }
    D[p] = m;
  }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
    const p = y * W + x; if (D[p] === 0) continue;
    let m = D[p];
    for (const [dx, dy] of [[1, 1], [0, 1], [-1, 1], [1, 0]]) {
      const nd = at(x + dx, y + dy) + 1; if (nd < m) m = nd;
    }
    D[p] = m;
  }

  const lum = (i) => (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  let outlineFixed = 0;
  // ⚠️ 必须**由内向外**修：白描边往往有 2px 厚。
  // 如果先修最外圈 d=1，它拿来当参考的 d=2 自己还是白的，亮度差不够，判定就不触发。
  // 反过来先修 d=2（参考已经干净的 d=3），再修 d=1（参考已修好的 d=2），才推得动。
  for (let d = OUTLINE_DEPTH; d >= 1; d--) {
    const snapshot = Uint8Array.from(data);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (D[p] !== d) continue;
      const i = p * 4;
      // 半透明的边缘像素同样要修：它们的 α 是对的，脏的是颜色。
      // 只换 RGB、不动 α，柔边的形状完全保留。
      if (data[i + 3] < 60) continue;
      if (Math.min(data[i], data[i + 1], data[i + 2]) < OUTLINE_MIN_CH) continue;
      // 往里一格：邻居里 D 最大的那个
      let best = -1, bestD = d;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (D[q] > bestD) { bestD = D[q]; best = q; }
      }
      if (best < 0) continue;
      const j = best * 4;
      if (snapshot[j + 3] < 200) continue;
      if (lum(i) - (snapshot[j] * 0.299 + snapshot[j + 1] * 0.587 + snapshot[j + 2] * 0.114) < OUTLINE_CONTRAST) continue;
      data[i] = snapshot[j]; data[i + 1] = snapshot[j + 1]; data[i + 2] = snapshot[j + 2];
      outlineFixed++;
    }
  }

  let after = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a > 10 && a < 245 && (data[i] + data[i + 1] + data[i + 2]) / 3 > 225) after++;
  }

  const name = path.basename(file);
  const line = `${name.padEnd(30)} 发白边缘 ${String(before).padStart(5)} → ${String(after).padStart(5)}` +
    `  (去预乘 ${unpremul}, 丢弃 ${dropped}, 削白线 ${ringCut}, 修描边 ${outlineFixed})`;

  if (DRY) { console.log('[dry] ' + line); continue; }

  if (BACKUP_DIR) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    fs.copyFileSync(file, path.join(BACKUP_DIR, name));
  }

  const out = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  const buf = /\.png$/i.test(file)
    ? await out.png({ compressionLevel: 9 }).toBuffer()
    : await out.webp({ quality: 92, alphaQuality: 100 }).toBuffer();
  fs.writeFileSync(file, buf);

  console.log(line);
  totalFixed++;
}

if (!DRY) console.log(`\n✅ 处理完成：${totalFixed} 张`);
