// ---------------------------------------------------------
// 👁 给已经装进游戏的木偶立绘补眨眼过渡帧
//
//   node scripts/remake/blink-installed.mjs [--only asuka,hikari] [--jobs 2]
//
// 第一轮重制的校服（以及 Miyuki 的开衫）眼睛位置已经在 data/puppetRigs.ts 里手标过，
// 这里直接在游戏里的图上做：以两眼为中心裁一块 → 放大送去生成"半闭""全闭"两帧 →
// 只把眼睛椭圆贴回去 → 两帧竖着拼成小图放进 public/images/characters/<角色>/blink/。
// 结果汇总到 data/puppetBlinkAuto.ts，puppetRigs.ts 读它给对应的骨骼挂上 blink。
// 第二轮的换装由 outfit-pipeline.mjs 自己做眨眼，这里跳过。
// 中间产物在 .generated/remake2-blink/，断了重跑会接着做。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { buildSync } from 'esbuild';
import { pathToFileURL } from 'url';
import { generate, imagePart } from '../lib/gemini.mjs';
import { align, gray, blinkPrompt, detectEyes, eyeEllipses, ellDist, squashEyes, frameMask, isFrameColor } from './blink-lib.mjs';
import { OUTFITS } from './outfits.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const ONLY = arg('only') ? String(arg('only')).split(',') : null;
const JOBS = Number(arg('jobs', 2));
const OUT_TS = 'data/puppetBlinkAuto.ts';
const ROOT = '.generated/remake2-blink';
// 眨眼帧用 Flash 画图模型：只改眼睛、每帧只露 0.1 秒，够用；配额跟 Pro 分开
const BLINK_MODEL = process.env.BLINK_MODEL || 'gemini-2.5-flash-image';
fs.mkdirSync(ROOT, { recursive: true });

// 读 TS 写的骨骼表：esbuild 打成临时 mjs 再 import
const tmp = path.join(os.tmpdir(), `rigs_${Date.now()}.mjs`);
buildSync({ entryPoints: ['data/puppetRigs.ts'], bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error' });
const { PUPPET_RIGS } = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

const existing = fs.existsSync(path.join(ROOT, 'blinks.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'blinks.json'), 'utf8')) : {};
const save = () => {
  fs.writeFileSync(path.join(ROOT, 'blinks.json'), JSON.stringify(existing, null, 1));
  const lines = Object.entries(existing).filter(([, v]) => v).sort().map(([k, v]) => `  '${k}': ${JSON.stringify({ src: v.src, rect: v.rect })},`);
  fs.writeFileSync(OUT_TS, `// ⚙️ 自动生成，别手改：node scripts/remake/blink-installed.mjs
// 第一轮重制立绘的眨眼过渡帧（上半闭、下全闭），rect 是在整张立绘上的位置（比例）
export const AUTO_BLINKS: Record<string, { src: string; rect: [number, number, number, number] }> = {
${lines.join('\n')}
};
`, 'utf8');
};

const targets = Object.entries(PUPPET_RIGS).filter(([src, rig]) => {
  const [, , , c, file] = src.split('/');
  if (ONLY && !ONLY.includes(c)) return false;
  // rig.blink 可能就是上一轮这里补的（AUTO_BLINKS），不能拿它判断做没做过——看 blinks.json 里的版本
  if (!rig.eyes) return false;
  // v2 = 半闭帧是程序压扁的；老记录用缓存的全闭原图重算，不再调模型
  if (existing[src] === null || existing[src]?.v === 6) return false;
  // 第二轮要换掉的衣服不做（新图自带眨眼帧）
  const name = file.replace('.webp', '');
  if (Object.keys(OUTFITS[c] || {}).some(o => name.startsWith(o + '_'))) return false;
  return fs.existsSync('public' + src);
}).map(([src, rig]) => ({ src, rig }));
console.log(`要补眨眼帧的：${targets.length} 张`);

const costLog = (what, model, size) => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tblink-installed\t${what}\t${model}\t${size}\n`);

const doOne = async ({ src, rig }) => {
  const [, , , c, file] = src.split('/');
  const name = file.replace('.webp', '');
  const dir = path.join(ROOT, c, name);
  fs.mkdirSync(dir, { recursive: true });
  const P = f => path.join(dir, f);
  const pub = 'public' + src;
  const { data: full, info } = await sharp(pub).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const [e0, e1] = [...rig.eyes].sort((a, b) => a[0] - b[0]);
  const mx = (e0[0] + e1[0]) / 2 * W, my = (e0[1] + e1[1]) / 2 * H;
  const dist = Math.abs(e1[0] - e0[0]) * W;
  const S = Math.min(W, Math.round(dist * 2.8));
  const region = { left: Math.max(0, Math.min(W - S, Math.round(mx - S / 2))), top: Math.max(0, Math.min(H - S, Math.round(my - S / 2))), width: S, height: S };
  // 原图上的眼睛只有一两百像素宽：放大到 1024 再送去，模型才画得细
  const crop = P('crop.png');
  await sharp(pub).flatten({ background: '#E6E6E6' }).extract(region).resize(1024, 1024, { kernel: 'lanczos3' }).png().toFile(crop);
  const eyesF = P('eyes.json');
  if (!fs.existsSync(eyesF)) fs.writeFileSync(eyesF, JSON.stringify(await detectEyes(crop, S, costLog)));
  const eyes = JSON.parse(fs.readFileSync(eyesF, 'utf8'));
  const ref = await sharp(pub).flatten({ background: '#E6E6E6' }).extract(region).removeAlpha().raw().toBuffer();
  const ells = eyeEllipses(eyes, c);
  const ecx = mx - region.left, ecy = my - region.top;
  const frames = {};
  // 只让模型画全闭；半闭帧用程序把睁眼图压扁（模型画半闭很不稳）
  // 画歪了（整体挪位、差异过大）就重画：Flash 再试一次，还不行换 Pro（阈值见 outfit-pipeline.mjs）
  for (const k of ['closed']) {
    const raw = P(`${k}_raw.png`);
    const badOnes = () => fs.readdirSync(dir).filter(f => f.startsWith(`${k}_bad`)).length;
    let edit, a;
    for (;;) {
      if (!fs.existsSync(raw)) {
        const model = badOnes() >= 2 ? 'gemini-3-pro-image' : BLINK_MODEL;
        const r = await generate({ model, parts: [imagePart(crop), { text: blinkPrompt(k) }], aspectRatio: '1:1', ...(model === BLINK_MODEL ? {} : { imageSize: '2K' }) });
        costLog(`blink:${c}/${name}:${k}`, model, model === BLINK_MODEL ? '1K' : '2K');
        if (!r.images.length) throw new Error(`${name} ${k} 没拿到图`);
        await sharp(r.images[0]).png().toFile(raw);
      }
      edit = await sharp(raw).resize(S, S, { fit: 'fill', kernel: 'lanczos3' }).removeAlpha().raw().toBuffer();
      a = align(ref, edit, S, (x, y) => { const d = Math.hypot((x - ecx) / (S * 0.42), (y - ecy) / (S * 0.16)); return d > 1.2 && d < 2.6; });
      if ((Math.abs(a.dx) > S * 0.025 || Math.abs(a.dy) > S * 0.025 || a.s > 30) && badOnes() < 3) {
        console.log(`${src}：全闭帧画歪了（偏移 ${a.dx},${a.dy} 差异 ${a.s.toFixed(1)}），重画`);
        fs.renameSync(raw, P(`${k}_bad${badOnes()}.png`));
        continue;
      }
      break;
    }
    frames[k] = { edit, a };
  }
  // 本来就闭着眼：椭圆里几乎没变
  let n = 0, tot = 0;
  const { edit: ce, a: ca } = frames.closed;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (ellDist(ells, x, y) > 0.8) continue;
    const ex = x + ca.dx, ey = y + ca.dy;
    if (ex < 0 || ey < 0 || ex >= S || ey >= S) continue;
    tot++;
    if (Math.abs(gray(ref, y * S + x) - gray(ce, ey * S + ex)) > 40) n++;
  }
  if (n / Math.max(1, tot) < 0.06) { existing[src] = null; save(); console.log(`${src}：本来就闭着眼`); return; }
  const rx0 = Math.max(0, Math.floor(Math.min(...ells.map(e => e.x - e.rx)))), rx1 = Math.min(S - 1, Math.ceil(Math.max(...ells.map(e => e.x + e.rx))));
  const ry0 = Math.max(0, Math.floor(Math.min(...ells.map(e => e.y - e.ry)))), ry1 = Math.min(S - 1, Math.ceil(Math.max(...ells.map(e => e.y + e.ry))));
  const rw = rx1 - rx0 + 1, rh = ry1 - ry0 + 1;
  const stacked = Buffer.alloc(rw * rh * 2 * 4);
  // 半闭：整张图坐标里的眼睛框
  const fullEyes = eyes.map(e => ({ cx: e.cx + region.left, cy: e.cy + region.top, w: e.w, h: e.h }));
  const halfImg = squashEyes(full, W, H, fullEyes, 0.55, [region.left + rx0, region.top + ry0, rw, rh]);
  const frame = frameMask(c, full, W, H, [region.left + rx0, region.top + ry0, rw, rh]);
  ['half', 'closed'].forEach((k, fi) => {
    const { edit, a } = frames.closed;
    for (let y = ry0; y <= ry1; y++) for (let x = rx0; x <= rx1; x++) {
      const p = (y + region.top) * W + (x + region.left);
      const o = ((fi * rh + (y - ry0)) * rw + (x - rx0)) * 4;
      for (let ch = 0; ch < 4; ch++) stacked[o + ch] = (k === 'half' ? halfImg : full)[p * 4 + ch];
      if (frame?.[p]) { for (let ch = 0; ch < 4; ch++) stacked[o + ch] = full[p * 4 + ch]; continue; }   // 镜框保留原图
      if (k === 'half') {
        // 压扁只在眼睛椭圆里生效（羽化）：镜框、刘海不跟着弯
        const d = ellDist(ells, x, y);
        const w = d < 0.72 ? 1 : d > 1 ? 0 : (1 - d) / 0.28;
        for (let ch = 0; ch < 4; ch++) stacked[o + ch] = Math.round(full[p * 4 + ch] * (1 - w) + halfImg[p * 4 + ch] * w);
        continue;
      }
      const d = ellDist(ells, x, y);
      const w = d < 0.72 ? 1 : d > 1 ? 0 : (1 - d) / 0.28;
      const ex = x + a.dx, ey = y + a.dy;
      if (w <= 0 || ex < 0 || ey < 0 || ex >= S || ey >= S || full[p * 4 + 3] < 250) continue;
      const q = ey * S + ex;
      if (isFrameColor(c, edit[q * 3], edit[q * 3 + 1], edit[q * 3 + 2])) continue;
      for (let ch = 0; ch < 3; ch++) stacked[o + ch] = Math.round(full[p * 4 + ch] * (1 - w) + edit[q * 3 + ch] * w);
    }
  });
  const outDir = `public/images/characters/${c}/blink`;
  fs.mkdirSync(outDir, { recursive: true });
  await sharp(stacked, { raw: { width: rw, height: rh * 2, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${outDir}/${name}.webp`);
  // 检查图：睁 / 半 / 闭，放大看
  await sharp(stacked, { raw: { width: rw, height: rh * 2, channels: 4 } }).flatten({ background: '#ccc' }).resize({ width: 500 }).jpeg().toFile(P('check.jpg'));
  existing[src] = {
    v: 6,
    src: `/images/characters/${c}/blink/${name}.webp`,
    rect: [(region.left + rx0) / W, (region.top + ry0) / H, rw / W, rh / H].map(v => +v.toFixed(4))
  };
  save();
  console.log(`${src}  OK  全闭帧对齐 (${frames.closed.a.dx},${frames.closed.a.dy})`);
};

const queue = [...targets];
await Promise.all(Array.from({ length: JOBS }, async () => {
  while (queue.length) {
    const t = queue.shift();
    try { await doOne(t); } catch (e) { console.log(`✘ ${t.src}: ${e.message}`); }
  }
}));
save();
console.log('完成');
