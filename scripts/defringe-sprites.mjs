// 去白边。
//
// 【为什么不能只看"边上是不是白的"】
// 直接统计"轮廓像素里有多少接近纯白"，白大褂、白贝雷帽、白衬衫全部中枪。
// 这类误判上一轮已经吃过一次亏了。
//
// 白边真正的特征是**它和它里面那一层不一样**：
// 抠图残留的白比它内侧的颜色亮一大截，而且几乎没有饱和度。
// 白大褂不会——白大褂的内侧也是白的。
//
// 所以判据是「这个边缘像素比它内侧的参考色亮多少」，不是「它有多白」。
//
// 【怎么修】
//   ① 半透明那一圈（alpha 20~230）是重灾区：它是原图和白底混出来的。
//      按 alpha 反混合回去（unpremultiply against white），
//      混合比例越低的像素，被白污染得越狠，拉回来的力度也越大。
//   ② 完全不透明但明显偏白的那一两圈：直接换成内侧参考色。
//   ③ 最后把 alpha 边缘收一像素，吃掉那些怎么修都不干净的孤立点。
//
// 用法：
//   node scripts/defringe-sprites.mjs                    # 处理 characters/ 下所有 easter_*
//   node scripts/defringe-sprites.mjs --glob=easter_     # 前缀过滤
//   node scripts/defringe-sprites.mjs --report           # 只报告，不写文件
//   node scripts/defringe-sprites.mjs --band=3 --lift=26 # 调参

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);

const DIR = args.dir || 'public/images/characters';
// 注意是 ?? 不是 ||：--glob= （空前缀，表示整个目录）会被 || 判成假值，
// 于是又退回 easter_，一个文件都不处理。
const PREFIX = args.glob === true ? '' : (args.glob ?? 'easter_');
const BAND = Number(args.band || 3);      // 往里几圈算"边缘带"
const LIFT = Number(args.lift || 24);     // 比内侧亮多少算白边
const SAT_MAX = Number(args.sat || 40);   // 白边几乎没有饱和度
const REPORT = !!args.report;

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const sat = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

const run = async () => {
  const files = fs.readdirSync(DIR).filter(f => f.startsWith(PREFIX) && f.endsWith('.webp'));
  let touched = 0;

  for (const f of files) {
    const p = path.join(DIR, f);
    // Windows 上 sharp 会一直握着源文件，先整个读进内存
    const buf = fs.readFileSync(p);
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height, N = W * H;
    const at = (x, y) => (y * W + x) * 4;

    // ---- 到透明区的距离（只算到 BAND+2 就够）----
    const MAXD = BAND + 2;
    const dist = new Uint8Array(N).fill(255);
    let queue = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const a = data[at(x, y) + 3];
      if (a < 16) { dist[y * W + x] = 0; queue.push(y * W + x); }
    }
    for (let d = 1; d <= MAXD && queue.length; d++) {
      const next = [];
      for (const idx of queue) {
        const x = idx % W, y = (idx / W) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const ni = ny * W + nx;
          if (dist[ni] !== 255) continue;
          dist[ni] = d;
          next.push(ni);
        }
      }
      queue = next;
    }

    // ---- 每个边缘像素的"内侧参考色"：沿离开边界的方向取 BAND+2 那一圈 ----
    const refOf = (x, y) => {
      let best = null, bestD = -1;
      const R = BAND + 2;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (data[at(nx, ny) + 3] < 250) continue;
        const d = dist[ni];
        if (d === 255 || d <= BAND) continue;      // 参考色必须来自带子之外
        if (d > bestD) { bestD = d; best = at(nx, ny); }
      }
      return best;
    };

    let fixedSoft = 0, fixedHard = 0, edgeTotal = 0;
    const out = Buffer.from(data);

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = at(x, y);
      const a = data[i + 3];
      if (a < 8) continue;
      const d = dist[y * W + x];
      if (d === 255 || d > BAND) continue;
      edgeTotal++;

      const ri = refOf(x, y);
      if (ri === null) continue;
      const rr = data[ri], rg = data[ri + 1], rb = data[ri + 2];
      const r = data[i], g = data[i + 1], b = data[i + 2];

      const brighter = lum(r, g, b) - lum(rr, rg, rb);
      const flat = sat(r, g, b) <= SAT_MAX;

      if (a < 230) {
        // ① 半透明的一圈：原图 = (混合色 - (1-α)·白) / α
        // 只在它确实比内侧亮的时候才拉；否则那是正常的抗锯齿。
        if (brighter > LIFT * 0.5 && flat) {
          const al = a / 255;
          for (let c = 0; c < 3; c++) {
            const mixed = data[i + c];
            const un = (mixed - 255 * (1 - al)) / Math.max(0.08, al);
            // 拉回来之后仍然要贴近内侧色，避免过冲成黑边
            out[i + c] = Math.max(0, Math.min(255, Math.round(un * 0.65 + data[ri + c] * 0.35)));
          }
          fixedSoft++;
        }
      } else if (brighter > LIFT && flat) {
        // ② 不透明但明显偏白：直接换成内侧色
        out[i] = rr; out[i + 1] = rg; out[i + 2] = rb;
        fixedHard++;
      }
    }

    // ---- ③ 最外面那一圈 alpha 收一点，吃掉修不干净的孤立点 ----
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = at(x, y);
      if (dist[y * W + x] === 1 && out[i + 3] > 0) {
        out[i + 3] = Math.round(out[i + 3] * 0.55);
      }
    }

    const pct = edgeTotal ? ((fixedSoft + fixedHard) / edgeTotal * 100) : 0;
    console.log(
      `${f.padEnd(26)} 边缘 ${String(edgeTotal).padStart(6)}  ` +
      `半透明修 ${String(fixedSoft).padStart(5)}  实色修 ${String(fixedHard).padStart(5)}  → ${pct.toFixed(1)}%`
    );

    if (!REPORT && (fixedSoft + fixedHard) > 0) {
      await sharp(out, { raw: { width: W, height: H, channels: 4 } })
        .webp({ quality: 95, alphaQuality: 100 })
        .toFile(p);
      touched++;
    }
  }
  console.log(REPORT ? '\n（只报告，没有写文件）' : `\n改写了 ${touched} 张。`);
};

run().catch(e => { console.error(e); process.exit(1); });
