// ============================================================================
// 抠掉立绘上没清干净的背景光晕
//
// 稻荷那六张的问题不是"白边"——是整片背景没抠掉。原图背景是一团白里
// 透蓝的光，之前那轮抠图只削掉了最外面一圈就停了，剩下一大块留在图里，
// 边界还是锯齿状的。放到游戏的深色场景上，她整个人罩在一块白斑里。
//
// 【为什么不能直接按亮度阈值削】
// 她的狐火是亮蓝的、尾巴尖是奶白的、扇面是米白的、袖子上的鹤是白的。
// 一刀切下去这些全没了。
//
// 所以用**从外面往里灌**：只有从画布外面能连通过来的像素才可能是背景。
// 灌的条件是"又亮又不鲜艳"——光晕是发白的，而狐火是饱和的蓝、
// 线稿是深色的，两者都会把水挡住。她身上的白因为被线稿围着，
// 外面的水根本流不进去。
//
// 灌完还剩一些孤立的小白点（原图里的散景光斑）。它们既然和人物不相连，
// 单独浮在深色背景上就是几粒灰尘，一起去掉。
//
// 用法：
//   node scripts/deglow-sprites.mjs inari            处理路径含 inari 的
//   node scripts/deglow-sprites.mjs inari --dry      只报告，不写
// ============================================================================
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = 'public/images/characters';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const filter = args.find(a => !a.startsWith('--')) || '';

// 门槛可以从命令行调：--lum=186 --sat=0.30 --feather=14
//
// 【这里试错过两次，两次都是同一个教训】
// 一、只削 186 以上的：白斑没了，但光晕暗的那半圈留下来变成一圈脏灰边。
// 二、于是把亮度下限压到 110、靠彩度区分：灰边没了，
//     可是她尾巴尖是奶白的、也不鲜艳、外面的水直接灌进去，尾巴被啃烂了。
//
// 结论是**颜色分不开"白光晕"和"白尾巴尖"**，因为它们确实是同一种颜色。
// 能分开它们的是位置：光晕是一整片连通的亮区，灰边只是这片亮区的边缘，
// 厚度就那么十几个像素。所以改成：
//   1. 先用保守的亮度门槛灌出光晕的主体，那块直接抠掉；
//   2. 再从这块的边界**往里羽化固定的距离**，把灰边渐隐掉。
// 羽化距离是写死的，水再也漫不进尾巴深处——最多啃掉尾巴最外面十几个像素，
// 而那本来就该是软的。
const LUM_MIN = Number((args.find(a => a.startsWith('--lum=')) || '').slice(6)) || 186;
const SAT_MAX = Number((args.find(a => a.startsWith('--sat=')) || '').slice(6)) || 0.30;
const FEATHER = Number((args.find(a => a.startsWith('--feather=')) || '').slice(10)) || 14;
const SPECK = 0.0015;   // 剩下的孤立块小于全图这个比例就当散景光斑扔掉
// 灌出来的这块必须"厚"到一定程度才动它。
// 每张立绘的轮廓外面都有一圈抗锯齿像素，也是又亮又不鲜艳，照样会被灌到。
// 但那只是一圈皮，厚度两三个像素——对它做羽化等于把每个人都削瘦一圈。
// 真正的残留背景（稻荷那团光晕、真希长椅底下那块地）是**一大块**，
// 内接半径几十个像素。用厚度把这两种情况分开。
const MIN_THICK = Number((args.find(a => a.startsWith('--thick=')) || '').slice(8)) || 8;

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.webp')) files.push(p);
  }
})(ROOT);

const targets = files.filter(f =>
  path.relative(ROOT, f).replace(/\\/g, '/').includes(filter));

let touched = 0;
for (const file of targets) {
  const src = fs.readFileSync(file);
  const { data, info } = await sharp(src).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;

  const lumOf = p => {
    const i = p * 4;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };
  const satOf = p => {
    const i = p * 4;
    const mx = Math.max(data[i], data[i + 1], data[i + 2]);
    const mn = Math.min(data[i], data[i + 1], data[i + 2]);
    return mx ? (mx - mn) / mx : 0;
  };
  // 光晕：亮、不鲜艳。已经透明的当然也算"外面"。
  const glowy = p => data[p * 4 + 3] < 40 || (lumOf(p) >= LUM_MIN && satOf(p) <= SAT_MAX);

  // 从画布四边往里灌
  const out = new Uint8Array(N);
  const st = [];
  const push = p => { if (!out[p] && glowy(p)) { out[p] = 1; st.push(p); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (st.length) {
    const p = st.pop(), x = p % W, y = (p - x) / W;
    if (x + 1 < W) push(p + 1);
    if (x > 0) push(p - 1);
    if (y + 1 < H) push(p + W);
    if (y > 0) push(p - W);
  }

  // 量这块有多厚：从它的边界一圈圈往里剥，剥得动几层就是几厚。
  //
  // 量的必须是**本来不透明、现在要被抠掉**的那部分，不能把画布上本来就
  // 空着的透明区算进去。第一版把整片透明画布也当成"这块"，
  // 于是每张图都量出一百多像素厚，护栏等于没装。
  const kill = new Uint8Array(N);
  for (let p = 0; p < N; p++) if (out[p] && data[p * 4 + 3] >= 40) kill[p] = 1;

  let thick = 0;
  {
    const seenT = new Uint8Array(N);
    let front = [];
    for (let p = 0; p < N; p++) {
      if (!kill[p]) continue;
      const x = p % W, y = (p - x) / W;
      let edge = x === 0 || y === 0 || x === W - 1 || y === H - 1;
      if (!edge) for (const q of [p + 1, p - 1, p + W, p - W]) if (!kill[q]) { edge = true; break; }
      if (edge) { seenT[p] = 1; front.push(p); }
    }
    while (front.length && thick <= 400) {
      thick++;
      const next = [];
      for (const p of front) {
        const x = p % W, y = (p - x) / W;
        for (const q of [x + 1 < W ? p + 1 : -1, x > 0 ? p - 1 : -1,
                         y + 1 < H ? p + W : -1, y > 0 ? p - W : -1]) {
          if (q >= 0 && kill[q] && !seenT[q]) { seenT[q] = 1; next.push(q); }
        }
      }
      front = next;
    }
  }

  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (thick < MIN_THICK) {
    // 只有薄薄一圈抗锯齿。本来就该是这样，碰它只会把人削瘦一圈。
    if (DRY) console.log(`${rel.padEnd(34)} 抗锯齿边 ${thick}px，跳过`);
    continue;
  }

  let removed = 0;
  for (let p = 0; p < N; p++) {
    if (!out[p] || data[p * 4 + 3] < 40) continue;
    data[p * 4 + 3] = 0; removed++;
  }

  // 从抠掉那块的边界往里推 FEATHER 圈，每圈把 alpha 按距离压一点。
  // 只压不透明度、不动颜色：灰边本来就是背景色，压透明就没了；
  // 而尾巴尖被压到的只有最外面那十几像素，看上去是正常的软边。
  const dist = new Int16Array(N).fill(-1);
  let ring = [];
  for (let p = 0; p < N; p++) if (out[p]) { dist[p] = 0; ring.push(p); }
  for (let d = 1; d <= FEATHER && ring.length; d++) {
    const next = [];
    for (const p of ring) {
      const x = p % W, y = (p - x) / W;
      for (const q of [x + 1 < W ? p + 1 : -1, x > 0 ? p - 1 : -1,
                       y + 1 < H ? p + W : -1, y > 0 ? p - W : -1]) {
        if (q < 0 || dist[q] >= 0 || data[q * 4 + 3] < 40) continue;
        dist[q] = d; next.push(q);
        // 越靠近光晕压得越狠：贴着边的几乎全透，推到第 FEATHER 圈就不动了
        const k = d / (FEATHER + 1);
        const a = Math.round(data[q * 4 + 3] * k);
        if (a < data[q * 4 + 3]) { data[q * 4 + 3] = a; removed++; }
      }
    }
    ring = next;
  }

  // 剩下的孤立小块（散景光斑）：跟主体不相连就扔掉
  const seen = new Uint8Array(N);
  const comps = [];
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || data[p0 * 4 + 3] < 40) continue;
    const s2 = [p0]; seen[p0] = 1; const cells = [];
    while (s2.length) {
      const p = s2.pop(); cells.push(p);
      const x = p % W, y = (p - x) / W;
      for (const q of [x + 1 < W ? p + 1 : -1, x > 0 ? p - 1 : -1,
                       y + 1 < H ? p + W : -1, y > 0 ? p - W : -1]) {
        if (q >= 0 && !seen[q] && data[q * 4 + 3] >= 40) { seen[q] = 1; s2.push(q); }
      }
    }
    comps.push(cells);
  }
  comps.sort((a, b) => b.length - a.length);
  let specks = 0;
  for (const c of comps.slice(1)) {
    if (c.length > N * SPECK) continue;
    for (const p of c) { data[p * 4 + 3] = 0; specks++; }
  }

  if (!removed && !specks) continue;
  touched++;
  console.log(`${rel.padEnd(34)} 厚 ${String(thick).padStart(3)}px  抠掉 ${removed}px  散景 ${specks}px`);
  if (DRY) continue;

  const buf = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 }).toBuffer();
  fs.writeFileSync(file, buf);
}

console.log(`\n${targets.length} 张里 ${touched} 张有残留背景${DRY ? '（未写入）' : ''}`);
