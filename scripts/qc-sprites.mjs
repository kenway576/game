/**
 * 🔍 生成立绘自动质检 + 候选择优
 *
 * 人工逐张看 342 张不现实，先用机器把明显坏的挑出来。三项客观指标：
 *   1. alpha 覆盖率  —— 抠图是否失败（过低=人物被抠掉，过高=白底没去干净）
 *   2. 宽高比偏差    —— 构图有没有跑偏（模型有时会把人物拉近或改成半身）
 *   3. 头部色相差    —— 瞳色/发色有没有漂移（取上部 35% 区域的主色调对比源图）
 *
 * 每个缺口的多个候选按总分排序，胜出者写成最终名，其余留作备选。
 *
 * 用法：
 *   node scripts/qc-sprites.mjs                 # 全部角色，只报告
 *   node scripts/qc-sprites.mjs --pick          # 报告 + 择优改名
 *   node scripts/qc-sprites.mjs --char asuka --pick
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const has = (n) => process.argv.includes(`--${n}`);

const CHARS_ROOT = path.resolve('public/images/characters');
const STAGE = path.resolve('.generated');

// 取图像某个纵向区间的平均 HSL 色相/饱和度/明度（只统计不透明像素）
const regionStats = async (file, topFrac = 0, bottomFrac = 0.35) => {
  const img = sharp(file);
  const m = await img.metadata();
  const top = Math.round(m.height * topFrac);
  const h = Math.max(1, Math.round(m.height * (bottomFrac - topFrac)));
  const { data, info } = await img
    .extract({ left: 0, top, width: m.width, height: h })
    .resize({ width: 96 })                       // 缩小加速，统计量足够
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let n = 0, sr = 0, sg = 0, sb = 0;
  const hueHist = new Array(36).fill(0);
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 128) continue;             // 只看不透明像素
    const r = data[i], g = data[i + 1], b = data[i + 2];
    n++; sr += r; sg += g; sb += b;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (d < 30) continue;                        // 灰白像素没有可靠色相，跳过
    let hue = 0;
    if (mx === r) hue = ((g - b) / d) % 6;
    else if (mx === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue = (hue * 60 + 360) % 360;
    hueHist[Math.floor(hue / 10)]++;
  }
  return { n, avg: n ? [sr / n, sg / n, sb / n] : [0, 0, 0], hueHist, width: m.width, height: m.height };
};

// 两个色相直方图的重合度（0~1，越大越像）
const hueOverlap = (a, b) => {
  const sa = a.reduce((s, v) => s + v, 0) || 1, sb = b.reduce((s, v) => s + v, 0) || 1;
  let ov = 0;
  for (let i = 0; i < a.length; i++) ov += Math.min(a[i] / sa, b[i] / sb);
  return ov;
};

const alphaCoverage = async (file) => {
  const { data, info } = await sharp(file).resize({ width: 96 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let opaque = 0, total = 0;
  for (let i = 0; i < data.length; i += info.channels) { total++; if (data[i + 3] > 128) opaque++; }
  return opaque / total;
};

const onlyChar = arg('char');
const chars = fs.readdirSync(STAGE, { withFileTypes: true })
  .filter(e => e.isDirectory() && e.name !== 'cg' && (!onlyChar || e.name === onlyChar))
  .map(e => e.name);

let picked = 0, flagged = 0;
for (const char of chars) {
  const dir = path.join(STAGE, char);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
  if (!files.length) continue;

  // 按缺口分组：casual_sad_c1 / casual_sad_c2 → casual_sad
  const groups = {};
  for (const f of files) {
    const base = f.replace(/_c\d+\.webp$/, '').replace(/\.webp$/, '');
    (groups[base] ??= []).push(f);
  }

  console.log(`\n■ ${char}  ${Object.keys(groups).length} 个缺口 / ${files.length} 张候选`);
  const problems = [];

  for (const [base, cands] of Object.entries(groups)) {
    // 源图 = 该套装束的 neutral
    const outfit = base.includes('_') ? base.slice(0, base.lastIndexOf('_')) : '';
    const srcName = outfit ? `${outfit}_neutral.webp` : 'neutral.webp';
    const srcPath = path.join(CHARS_ROOT, char, srcName);
    if (!fs.existsSync(srcPath)) continue;
    // 源图必须先按 alpha 裁边再比宽高比——生成图是裁过的，
    // 拿它去比一张四周留白的源图，量到的是源图的留白，不是生成质量。
    const srcTrimmed = await sharp(srcPath).trim({ threshold: 1 }).webp().toBuffer();
    const srcMeta = await sharp(srcTrimmed).metadata();
    const src = await regionStats(srcPath);
    const srcAspect = srcMeta.width / srcMeta.height;

    const scored = [];
    for (const f of cands) {
      const p = path.join(dir, f);
      try {
        const st = await regionStats(p);
        const cov = await alphaCoverage(p);
        const hue = hueOverlap(src.hueHist, st.hueHist);              // 1 = 色相完全一致
        const aspectDev = Math.abs((st.width / st.height) - srcAspect) / srcAspect;
        // 抠图正常范围大致 0.15~0.75；越出说明抠坏了
        const covPenalty = (cov < 0.12 || cov > 0.8) ? 1 : 0;
        const score = hue * 100 - aspectDev * 120 - covPenalty * 60;
        scored.push({ f, score, hue, cov, aspectDev });
      } catch (e) {
        scored.push({ f, score: -999, err: e.message });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    const win = scored[0];

    // 低于阈值的标记出来让人过目
    if (win.hue < 0.62 || win.aspectDev > 0.18 || win.cov < 0.12 || win.cov > 0.8) {
      problems.push(`${base}: 色相吻合 ${(win.hue * 100).toFixed(0)}% / 比例偏差 ${(win.aspectDev * 100).toFixed(0)}% / 覆盖 ${(win.cov * 100).toFixed(0)}%`);
      flagged++;
    }

    if (has('pick')) {
      // 胜出者改成最终名，其余候选加 _alt 保留
      const finalPath = path.join(dir, `${base}.webp`);
      if (win.f !== `${base}.webp`) {
        fs.copyFileSync(path.join(dir, win.f), finalPath);
        for (const s of scored.slice(1)) {
          const alt = path.join(dir, s.f.replace(/_c(\d+)\.webp$/, '_alt$1.webp'));
          if (s.f !== win.f) fs.renameSync(path.join(dir, s.f), alt);
        }
        if (fs.existsSync(path.join(dir, win.f)) && win.f !== `${base}.webp`) fs.unlinkSync(path.join(dir, win.f));
      }
      picked++;
    }
  }

  if (problems.length) {
    console.log(`  ⚠️ ${problems.length} 个需人工过目：`);
    problems.slice(0, 8).forEach(p => console.log('     ' + p));
    if (problems.length > 8) console.log(`     …还有 ${problems.length - 8} 个`);
  } else {
    console.log('  ✅ 全部通过自动质检');
  }
}

console.log(`\n${has('pick') ? `已择优 ${picked} 个缺口，` : ''}标记待查 ${flagged} 个`);
if (!has('pick')) console.log('确认无误后加 --pick 执行择优改名');
