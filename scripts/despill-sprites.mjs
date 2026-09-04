// 去溢色（despill）。
//
// 【和白边不是同一个毛病】
// 白边是抠图残留的**白底**，贴在轮廓上，一像素，虚线状。
// 溢色是绿幕/蓝幕的颜色**透过半透明的抗锯齿圈渗进来**：
// 头发丝、手指边缘、衣角这些半透明的地方，会整体偏向背景色。
//
// 序章那个便利店女店员就是这个：她的发丝和手指外圈是黄绿色的。
//
// 【为什么之前的扫描漏了】
// 第一版判据是「绿通道比红蓝的最大值高 30 以上」，而且只看不透明像素。
// 溢色恰恰两条都不满足：它在**半透明**圈上，而且是偏黄的绿
// （红绿都高、蓝低），g - max(r,b) 根本到不了 30。
//
// 正确的指标是**绿偏移** gc = g - (r+b)/2，
// 并且要拿边缘圈的平均值和内部的平均值比——
// 角色身上真有绿色物体（扫码枪、工牌）的话，内部也会绿，差值就不大。
//
// 【怎么修：绿限幅】
// 影视业的标准做法：gc 超过容差的部分，把绿压回 (r+b)/2 + 容差。
// 这个操作只会降绿，不会加绿，所以对非绿的地方是恒等变换。
// 再加一条保险：只在边缘带里做，而且内侧参考色不能是绿的——
// 这样那把绿色扫码枪不会被洗掉。
//
// 用法：
//   node scripts/despill-sprites.mjs --report
//   node scripts/despill-sprites.mjs --dir=public/images/characters --glob=clerk_
//   node scripts/despill-sprites.mjs --key=magenta      # 品红幕
//   node scripts/despill-sprites.mjs --all              # 递归所有子目录

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);

const ROOT = args.dir || 'public/images/characters';
const PREFIX = args.glob === true ? '' : (args.glob ?? '');
const KEY = args.key || 'green';        // green | blue | magenta
const TOL = Number(args.tol || 2);      // 容差：允许边缘比内部绿多少
const BAND = Number(args.band || 4);    // 边缘带宽度（像素）
const SWING = Number(args.swing || 3.5);// 边缘-内部 差多少才算这张有溢色
const RIM_MIN = Number(args.rim || 1.5); // 边缘自己至少要往溢色方向偏这么多
const REPORT = !!args.report;
const RECURSE = !!args.all;
const THIN = !!args.thin;   // 连没有内侧参照的细结构（发梢、指缝）一起处理

// 溢色通道，以及用来当基准的另外两个通道
const CH = { green: 1, blue: 2, magenta: -1 }[KEY];

// 某个像素在「溢色方向」上偏了多少
const cast = (r, g, b) => {
  if (KEY === 'green') return g - (r + b) / 2;
  if (KEY === 'blue') return b - (r + g) / 2;
  return (r + b) / 2 - g;              // magenta：红蓝一起高、绿低
};

const listFiles = (dir) => {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (RECURSE) out.push(...listFiles(p)); continue; }
    if (e.name.endsWith('.webp') && e.name.startsWith(PREFIX)) out.push(p);
  }
  return out;
};

const run = async () => {
  const files = listFiles(ROOT);
  let touched = 0, scanned = 0;

  for (const p of files) {
    scanned++;
    const buf = fs.readFileSync(p);   // Windows 上 sharp 会握住源文件，先读进内存
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height, N = W * H;
    const at = (x, y) => (y * W + x) * 4;

    // ---- 先量一遍：这张到底有没有溢色 ----
    let rimSum = 0, rimN = 0, inSum = 0, inN = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 20) continue;
      const c = cast(data[i], data[i + 1], data[i + 2]);
      if (a < 235) { rimSum += c; rimN++; } else { inSum += c; inN++; }
    }
    const rim = rimSum / Math.max(1, rimN);
    const inner = inSum / Math.max(1, inN);
    const swing = rim - inner;

    // 光有"边比内部绿"还不够。空那一身橙色球衣的内部 cast 是 -24，
    // 边缘抗锯齿一冲淡就变成 -14，差值 +10，看着像溢色，其实边缘
    // 离绿还差得远。所以再加一条绝对条件：**边缘本身必须是往绿偏的**。
    // 内部本身就往溢色方向偏 = 这个角色身上真有这个颜色（稻荷的狐火、
    // 铃的绿格裙），整张跳过，别拿溢色的名义去洗她的衣服。
    if (swing <= SWING || rim <= RIM_MIN || inner > 0.5) {
      if (REPORT) console.log(`${path.relative(ROOT, p).padEnd(34)} 边${rim.toFixed(1).padStart(6)} 内${inner.toFixed(1).padStart(6)} 差${swing.toFixed(1).padStart(5)}  —— 干净`);
      continue;
    }

    // ---- 到透明区的距离，用来圈出边缘带 ----
    const dist = new Uint8Array(N).fill(255);
    let q = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (data[at(x, y) + 3] < 16) { dist[y * W + x] = 0; q.push(y * W + x); }
    }
    for (let d = 1; d <= BAND + 2 && q.length; d++) {
      const nx2 = [];
      for (const idx of q) {
        const x = idx % W, y = (idx / W) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const a = x + dx, b2 = y + dy;
          if (a < 0 || b2 < 0 || a >= W || b2 >= H) continue;
          const ni = b2 * W + a;
          if (dist[ni] !== 255) continue;
          dist[ni] = d; nx2.push(ni);
        }
      }
      q = nx2;
    }

    // ---- 内侧参考：带子外面那一圈的平均溢色。它本身就绿的话，
    //      说明这地方真有绿色物体（扫码枪、工牌），跳过不动。 ----
    const refCast = (x, y) => {
      let s = 0, n = 0;
      const R = BAND + 3;
      for (let dy = -R; dy <= R; dy += 2) for (let dx = -R; dx <= R; dx += 2) {
        const a = x + dx, b2 = y + dy;
        if (a < 0 || b2 < 0 || a >= W || b2 >= H) continue;
        const i = at(a, b2);
        if (data[i + 3] < 250) continue;
        const d = dist[b2 * W + a];
        if (d === 255 || d <= BAND) continue;
        s += cast(data[i], data[i + 1], data[i + 2]); n++;
      }
      return n ? s / n : null;
    };

    const out = Buffer.from(data);
    let fixed = 0;

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = at(x, y);
      if (data[i + 3] < 8) continue;
      const d = dist[y * W + x];
      if (d === 255 || d > BAND) continue;

      const r = data[i], g = data[i + 1], b = data[i + 2];
      const c = cast(r, g, b);
      if (c <= TOL) continue;

      const rc = refCast(x, y);
      // 内侧本来就往这个方向偏 → 这儿真有这个颜色的东西，别动。
      // rc 为 null 说明这块结构太细，整根都在边缘带里、根本没有"内侧"——
      // 稻荷那簇绿色狐火、发梢的细丝都是这种。没有参照就不敢动，
      // 宁可留一点溢色，也不能把真的绿色物体洗淡。
      // --thin：明确知道这张图里没有真的绿色物体时，连细结构一起洗。
      // 默认不开：发梢、狐火这类东西没有参照，误伤代价比留一点溢色高。
      if (rc === null ? !THIN : rc > TOL) continue;

      // 绿限幅：把超出容差的部分压回去
      const excess = c - TOL;
      if (KEY === 'magenta') {
        out[i] = Math.round(r - excess);
        out[i + 2] = Math.round(b - excess);
      } else {
        out[i + CH] = Math.max(0, Math.round(data[i + CH] - excess));
      }
      fixed++;
    }

    console.log(
      `${path.relative(ROOT, p).padEnd(34)} 边${rim.toFixed(1).padStart(6)} 内${inner.toFixed(1).padStart(6)} ` +
      `差${swing.toFixed(1).padStart(5)}  → 修 ${fixed}`
    );

    if (!REPORT && fixed > 0) {
      await sharp(out, { raw: { width: W, height: H, channels: 4 } })
        .webp({ quality: 95, alphaQuality: 100 })
        .toFile(p);
      touched++;
    }
  }
  console.log(`\n扫了 ${scanned} 张，${REPORT ? '（只报告）' : `改写了 ${touched} 张。`}`);
};

run().catch(e => { console.error(e); process.exit(1); });
