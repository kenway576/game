// 把一批立绘的肤色对齐到同一个基准。
//
// 【为什么需要】
// 空有 58 张立绘，其中 50 张是健康的小麦色，只有 school_* 那 8 张是浅肤色——
// 同一个人换上校服就白了一个色号，切换表情时非常明显。
//
// 【怎么做】
// 不是整张图调色（那会把橙色球衣、深蓝校服一起带偏），
// 而是只挑出**皮肤像素**，按"源的平均肤色 → 基准的平均肤色"求一个
// 每通道的增益，只对这些像素乘上去。
//
// 皮肤的判据：红 > 绿 > 蓝，红蓝差在一个区间内，亮度也在区间内。
// 这条判据会漏掉阴影里最深的那一块，但不会误伤蓝色和橙色——
// 宁可少修一点，也不能把衣服调花。
//
// 用法：
//   node scripts/match-skin-tone.mjs --dir=public/images/characters/sora \
//        --ref=neutral --glob=school_ [--report]

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);

const DIR = args.dir;
const REF = args.ref;
const PREFIX = args.glob === true ? '' : (args.glob ?? '');
const REPORT = !!args.report;
const STRENGTH = Number(args.strength || 1);   // 1 = 完全对齐，0.5 = 只走一半

if (!DIR || !REF) {
  console.error('用法：--dir=<目录> --ref=<基准文件名，不含 .webp> [--glob=前缀]');
  process.exit(1);
}

const isSkin = (r, g, b) => {
  if (!(r > g && g > b)) return false;
  const d = r - b;
  if (d < 20 || d > 110) return false;          // 太灰或太艳都不是皮肤
  const l = 0.299 * r + 0.587 * g + 0.114 * b;
  return l > 60 && l < 245;
};

// 取**受光面**的肤色，不是全部皮肤的平均。
//
// 平均值会被"这张图里有多少阴影"带着走：同一个人，蹲着的那张阴影多、
// 平均就暗，看起来像换了个肤色，其实没有。所以先按亮度排序，
// 只取最亮的那 40% 求中位数——那一段就是"打光打到的皮肤"，
// 在不同姿势不同构图之间稳定得多。
const skinTone = async (file) => {
  const { data } = await sharp(fs.readFileSync(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (!isSkin(r, g, b)) continue;
    px.push([0.299 * r + 0.587 * g + 0.114 * b, r, g, b]);
  }
  if (px.length < 400) return null;
  px.sort((a, b) => a[0] - b[0]);
  const lit = px.slice(Math.floor(px.length * 0.6));      // 最亮的 40%
  const mid = lit[Math.floor(lit.length / 2)];
  return { r: mid[1], g: mid[2], b: mid[3], n: px.length };
};
const skinMean = skinTone;

const run = async () => {
  const ref = await skinMean(path.join(DIR, REF + '.webp'));
  if (!ref) { console.error('基准图里找不到皮肤像素'); process.exit(1); }
  console.log(`基准 ${REF}: 肤色 rgb(${ref.r.toFixed(0)}, ${ref.g.toFixed(0)}, ${ref.b.toFixed(0)})  样本 ${ref.n}\n`);

  const files = fs.readdirSync(DIR).filter(f => f.startsWith(PREFIX) && f.endsWith('.webp'));
  let touched = 0;

  for (const f of files) {
    const p = path.join(DIR, f);
    const src = await skinMean(p);
    if (!src || src.n < 400) { console.log(`${f.padEnd(26)} 皮肤像素太少，跳过`); continue; }

    // 每通道增益，再按 STRENGTH 收一收
    const gain = {
      r: 1 + (ref.r / src.r - 1) * STRENGTH,
      g: 1 + (ref.g / src.g - 1) * STRENGTH,
      b: 1 + (ref.b / src.b - 1) * STRENGTH
    };
    const drift = Math.abs(gain.r - 1) + Math.abs(gain.g - 1) + Math.abs(gain.b - 1);
    console.log(
      `${f.padEnd(26)} rgb(${src.r.toFixed(0)}, ${src.g.toFixed(0)}, ${src.b.toFixed(0)}) ` +
      `→ 增益 ${gain.r.toFixed(3)}/${gain.g.toFixed(3)}/${gain.b.toFixed(3)}`
    );
    if (drift < 0.03) { console.log('   （已经很接近，不动）'); continue; }
    if (REPORT) continue;

    const buf = fs.readFileSync(p);
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.from(data);
    let n = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 8) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (!isSkin(r, g, b)) continue;
      out[i] = Math.max(0, Math.min(255, Math.round(r * gain.r)));
      out[i + 1] = Math.max(0, Math.min(255, Math.round(g * gain.g)));
      out[i + 2] = Math.max(0, Math.min(255, Math.round(b * gain.b)));
      n++;
    }
    await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 95, alphaQuality: 100 })
      .toFile(p);
    touched++;
    console.log(`   改了 ${n} 个像素`);
  }
  console.log(REPORT ? '\n（只报告）' : `\n改写了 ${touched} 张。`);
};

run().catch(e => { console.error(e); process.exit(1); });
