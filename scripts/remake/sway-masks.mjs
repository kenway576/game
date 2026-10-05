// ---------------------------------------------------------
// 🎐 木偶"可以摆动的地方"蒙版
//
//   node scripts/remake/sway-masks.mjs [--only nao,hikari] [--force]
//
// 【为什么要有这个】
// PuppetSprite 原来按区域摆：躯干两侧、腰线以上的一整片都跟着双马尾/尾巴晃。
// 举起来的手、捏着马尾的手、袖子正好落在那片区域里，于是被一起拉弯——
// 截图里奈绪的袖子莫名鼓起来、光挥手那只胳膊扭曲，都是这个原因。
//
// 【做法】只让"真的是头发（或尾巴）"的像素摆：
//   1. 让 gemini-3-flash-preview 框出垂下来的头发、尾巴在哪（只要框，便宜；框不需要很准）
//   2. 头发颜色从头顶取样（尾巴从尾巴框最外侧取样），统计出这个角色的发色范围
//   3. 框里、颜色在发色范围内的像素 = 可以摆；袖子、手、衣服颜色不同，一律不动
//   4. 稍微羽化，存成 1/4 分辨率的灰度图 → public/images/characters/<角色>/mask/<那套>.webp
// 同一套身体的各个表情共用一张蒙版。结果汇总到 data/puppetMaskAuto.ts。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { buildSync } from 'esbuild';
import { pathToFileURL } from 'url';
import { generate, imagePart } from '../lib/gemini.mjs';
import { parseBoxes, align } from './blink-lib.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const ONLY = arg('only') ? String(arg('only')).split(',') : null;
const FORCE = process.argv.includes('--force');
const ROOT = '.generated/remake2-mask';
fs.mkdirSync(ROOT, { recursive: true });

const tmp = path.join(os.tmpdir(), `rigs_${Date.now()}.mjs`);
buildSync({ entryPoints: ['data/puppetRigs.ts'], bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error' });
const { PUPPET_RIGS } = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

// 同一套身体：同一角色 + 骨骼里除了眼睛/眨眼以外都一样
const sets = new Map();
for (const [src, rig] of Object.entries(PUPPET_RIGS)) {
  const c = src.split('/')[3];
  if (ONLY && !ONLY.includes(c)) continue;
  if (!fs.existsSync('public' + src)) continue;
  const { eyes, blink, mask, ...body } = rig;
  const key = c + JSON.stringify(body);
  if (!sets.has(key)) sets.set(key, { c, rig, files: [] });
  sets.get(key).files.push(src);
}
console.log(`${sets.size} 套身体`);

const outFile = path.join(ROOT, 'masks.json');
const done = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};

for (const { c, rig, files } of sets.values()) {
  // 用这一套里"最平常"的那张命名/取样
  const ref = files.find(f => /neutral\.webp$/.test(f)) || files[0];
  const name = path.basename(ref, '.webp');
  const maskSrc = `/images/characters/${c}/mask/${name}.webp`;
  if (!FORCE && files.every(f => done[f] === maskSrc) && fs.existsSync('public' + maskSrc)) continue;
  const { data, info } = await sharp('public' + ref).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;

  // 1. 框：垂下来的头发、尾巴
  const detF = path.join(ROOT, `${c}_${name}.json`);
  // 长头发的角色（除了短发的空、玲）标出来是空的 = 模型漏标了，重标，最多三次
  const LONG_HAIR = !['sora', 'rei'].includes(c);
  const detEmpty = () => { try { return JSON.parse(fs.readFileSync(detF, 'utf8')).length === 0; } catch { return true; } };
  for (let attempt = 0; attempt < 3 && (!fs.existsSync(detF) || (LONG_HAIR && detEmpty())); attempt++) {
    const small = path.join(ROOT, '_in.png');
    await sharp('public' + ref).flatten({ background: '#E6E6E6' }).resize({ height: 1400 }).png().toFile(small);
    const r = await generate({ model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(small), { text: `Detect parts of this anime character. Return ONLY a JSON array of {"label": string, "box_2d": [ymin, xmin, ymax, xmax]} normalized to 0-1000. Labels:
"hanging_hair": each lock of hair that hangs down below the chin (twin tails, ponytail, long side hair, braid), one entry per lock, from where it starts at the head to its tip;
"tails": each big group of animal tails, if any.
If the hair is short and nothing hangs below the chin, return an empty array.` }] });
    fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tmask/${c}/${name}\tdetect\tgemini-3-flash-preview\t-\n`);
    fs.writeFileSync(detF, JSON.stringify(parseBoxes(r.text)));
  }
  const boxes = JSON.parse(fs.readFileSync(detF, 'utf8')).map(d => {
    const [y0, x0, y1, x1] = d.box_2d.map((v, i) => v / 1000 * (i % 2 ? W : H));
    return { label: d.label, x0, y0, x1, y1 };
  });

  // 2. 发色：头顶那一片（头部椭圆的上 40%）不透明像素的颜色分布
  const q = (r, g, b) => ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);   // 16 级量化
  // 取样区域里每个颜色格子的占比
  const histOf = (pick) => {
    const hist = new Map(); let n = 0;
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
      if (!pick(x, y)) continue;
      const p = (y * W + x) * 4;
      if (data[p + 3] < 250) continue;
      const k = q(data[p], data[p + 1], data[p + 2]);
      hist.set(k, (hist.get(k) || 0) + 1); n++;
    }
    for (const [k, v] of hist) hist.set(k, v / Math.max(1, n));
    return hist;
  };
  // 占比够高的颜色格子 + 邻格（头发有高光和阴影，颜色是一条带）。
  // against：这些区域（脸、躯干正中）里明显更常见的颜色不算——不然脸、手腕、
  // 跟发色接近的衣服（光的黄卫衣）都会跟着摆；但刘海遮在脸上的那点发色不能被扣掉，所以比的是占比
  const palette = (hist, thr = 0.004, against = []) => {
    const keep = new Set();
    const isOther = k => against.some(h => (h.get(k) || 0) > 0.02 && (h.get(k) || 0) > (hist.get(k) || 0) * 1.5);
    for (const [k, v] of hist) if (v > thr) {
      const r = k >> 8, g = (k >> 4) & 15, bl = k & 15;
      for (let dr = -1; dr <= 1; dr++) for (let dg = -1; dg <= 1; dg++) for (let db = -1; db <= 1; db++) {
        const rr = r + dr, gg = g + dg, bb = bl + db;
        if (rr < 0 || gg < 0 || bb < 0 || rr > 15 || gg > 15 || bb > 15) continue;
        const kk = (rr << 8) | (gg << 4) | bb;
        if (!isOther(kk)) keep.add(kk);
      }
    }
    return keep;
  };
  const [hcx, hcy] = [rig.headC[0] * W, rig.headC[1] * H], [hrx, hry] = [rig.headR[0] * W, rig.headR[1] * H];
  const neckY = rig.neck[1] * H, bodyX = rig.body[0] * W, bodyHW = rig.body[1] * W, waistY = rig.body[2] * H;
  const eyeY = rig.eyes ? (rig.eyes[0][1] + rig.eyes[1][1]) / 2 * H : hcy;
  const eyeXs = rig.eyes ? rig.eyes.map(e => e[0] * W) : [hcx - hrx * 0.3, hcx + hrx * 0.3];
  const skinHist = histOf((x, y) => y > eyeY + (neckY - eyeY) * 0.25 && y < neckY - (neckY - eyeY) * 0.15 && x > Math.min(...eyeXs) && x < Math.max(...eyeXs));
  const torsoHist = histOf((x, y) => y > neckY + (waistY - neckY) * 0.15 && y < waistY && Math.abs(x - bodyX) < bodyHW * 0.3);
  const hairPal = palette(histOf((x, y) => y < hcy - hry * 0.2 && ((x - hcx) / hrx) ** 2 + ((y - hcy) / hry) ** 2 < 1), 0.004, [skinHist, torsoHist]);
  // 不补阴影色：试过把发色压暗几档也算头发，结果同色的衣服（红和服、黑裙）会被带进来。宁可少摆一点
  // 尾巴：尾巴框最外侧 15% 的两条竖带里几乎全是尾巴
  const tails = boxes.filter(b => b.label === 'tails');
  const tailPal = tails.length ? palette(histOf((x, y) => tails.some(b => y > b.y0 && y < b.y1 && (x < b.x0 + (b.x1 - b.x0) * 0.15 || x > b.x1 - (b.x1 - b.x0) * 0.15))), 0.004, [skinHist, torsoHist]) : null;

  // 3. 蒙版（1/4 分辨率）
  const S = 4, MW = Math.ceil(W / S), MH = Math.ceil(H / S);
  const m = new Uint8Array(MW * MH);
  const pad = 0.06;
  const inBox = (x, y, b) => x > b.x0 - (b.x1 - b.x0) * pad && x < b.x1 + (b.x1 - b.x0) * pad && y > b.y0 - (b.y1 - b.y0) * pad && y < b.y1 + (b.y1 - b.y0) * pad;
  const hairBoxes = boxes.filter(b => b.label !== 'tails');
  // 连通判定：从"肯定是头发"的地方（头顶）、"肯定是尾巴"的地方（尾巴框最外侧）出发，
  // 只沿着同色像素往外长。衣服、腿、袖子跟头发/尾巴之间都隔着一圈深色描线，
  // 颜色再接近也长不过去——稻荷奶油色的尾巴尖和腿、白袍就是这么分开的
  const grow = (pal, seedOk, allowed) => {
    const hit = new Uint8Array(W * H);
    const stack = [];
    const ok = (x, y) => {
      const p = (y * W + x) * 4;
      return data[p + 3] >= 200 && pal.has(q(data[p], data[p + 1], data[p + 2])) && allowed(x, y);
    };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (seedOk(x, y) && ok(x, y)) { hit[y * W + x] = 1; stack.push(y * W + x); }
    while (stack.length) {
      const p = stack.pop(), x = p % W, y = (p - x) / W;
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || hit[ny * W + nx]) continue;
        if (ok(nx, ny)) { hit[ny * W + nx] = 1; stack.push(ny * W + nx); }
      }
    }
    return hit;
  };
  const inHeadWide = (x, y) => ((x - hcx) / (hrx * 1.1)) ** 2 + ((y - hcy) / (hry * 1.1)) ** 2 < 1;
  const hairHit = grow(hairPal,
    (x, y) => y < hcy - hry * 0.2 && ((x - hcx) / hrx) ** 2 + ((y - hcy) / hry) ** 2 < 1,
    // 头发不需要框（AI 偶尔漏框一条马尾）：头发和衣服之间隔着描线，长不过去；只挡住腰线以下的大片区域以防万一
    (x, y) => inHeadWide(x, y) || hairBoxes.some(b => inBox(x, y, b)) || y < rig.body[2] * H * 1.15);
  const tailHit = tailPal ? grow(tailPal,
    (x, y) => tails.some(b => y > b.y0 && y < b.y1 && (x < b.x0 + (b.x1 - b.x0) * 0.15 || x > b.x1 - (b.x1 - b.x0) * 0.15)),
    (x, y) => tails.some(b => inBox(x, y, b))) : null;
  // 语义把关：让 Flash 画图模型把"垂下来的头发"涂成品红、"尾巴"涂成青色。它分得清袖子和马尾、
  // 白袍和尾巴，但会顺手重画几笔、位置不完全对——所以只拿它圈"大概范围"（对齐后再放宽一圈），
  // 真正的像素边界还是上面的颜色连通结果。两者取交集：黑裙、白袍、开衫这些同色的衣服就漏不进来了
  const paintF = path.join(ROOT, `${c}_${name}_paint.png`);
  const PW = 576, PH = Math.round(576 * H / W);
  if (!fs.existsSync(paintF)) {
    const inp = path.join(ROOT, '_paint_in.png');
    await sharp('public' + ref).flatten({ background: '#E6E6E6' }).resize(PW, PH, { fit: 'fill' }).png().toFile(inp);
    for (let attempt = 0; attempt < 2 && !fs.existsSync(paintF); attempt++) {
      try {
        const r = await generate({ model: 'gemini-2.5-flash-image', parts: [imagePart(inp), { text: `Return the SAME image with ONE change: paint flat solid colours over certain parts, like a segmentation map.
- Every lock of HAIR that hangs below the chin (twin tails, ponytail, long side hair, braids), from where it leaves the head down to its tips: paint it solid pure magenta #FF00FF.
- Any ANIMAL TAILS: paint them solid pure cyan #00FFFF.
Do NOT paint the head, face, ears, bangs, hands, arms, sleeves, clothes, accessories or anything else; they must stay exactly as they are. Keep the framing, pose and every pixel position identical.` }] });
        fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}	mask/${c}/${name}	paint	gemini-2.5-flash-image	-
`);
        if (r.images.length) await sharp(r.images[0]).resize(PW, PH, { fit: 'fill' }).png().toFile(paintF);
      } catch (e) { console.log(`  涂色失败：${e.message.slice(0, 120)}`); }
    }
  }
  let paintOk = null;   // 1/4 分辨率的"语义允许范围"；涂色失败就为 null，只用颜色结果
  if (fs.existsSync(paintF)) {
    const pr = await sharp(paintF).removeAlpha().raw().toBuffer();
    const orig = await sharp('public' + ref).flatten({ background: '#E6E6E6' }).resize(PW, PH, { fit: 'fill' }).removeAlpha().raw().toBuffer();
    // 模型常常只是给头发罩一层品红色调，不是纯色平涂：按"比原图更偏品红/青色多少"判断
    const mag = (buf, i) => Math.min(buf[i * 3], buf[i * 3 + 2]) - buf[i * 3 + 1];
    const cya = (buf, i) => Math.min(buf[i * 3 + 1], buf[i * 3 + 2]) - buf[i * 3];
    const paintedAt = (pi, oi) => mag(pr, pi) - mag(orig, oi) > 45 || cya(pr, pi) - cya(orig, oi) > 45;
    // 对齐：比较没被涂的地方（两张图的宽高比一样，按较长边做方块比较）
    const SQ = Math.max(PW, PH), toSq = buf => { const o = Buffer.alloc(SQ * SQ * 3, 230); for (let y = 0; y < PH; y++) buf.copy(o, y * SQ * 3, y * PW * 3, (y + 1) * PW * 3); return o; };
    const a = align(toSq(orig), toSq(pr), SQ, (x, y) => x < PW && y < PH && !paintedAt(y * PW + x, y * PW + x));
    const pm = new Uint8Array(MW * MH);
    for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
      const sx = x + a.dx, sy = y + a.dy;
      if (sx < 0 || sy < 0 || sx >= PW || sy >= PH || !paintedAt(sy * PW + sx, y * PW + x)) continue;
      pm[Math.min(MH - 1, Math.floor(y * H / PH / S)) * MW + Math.min(MW - 1, Math.floor(x * W / PW / S))] = 1;
    }
    // 放宽一圈（宽度的 1.5%）：模型画的发梢位置会差一点
    const R = Math.max(2, Math.round(W * 0.015 / S));
    const tmpRow = new Uint8Array(MW * MH);
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { let v = 0; for (let k = -R; k <= R && !v; k++) { const xx = x + k; if (xx >= 0 && xx < MW && pm[y * MW + xx]) v = 1; } tmpRow[y * MW + x] = v; }
    paintOk = new Uint8Array(MW * MH);
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { let v = 0; for (let k = -R; k <= R && !v; k++) { const yy = y + k; if (yy >= 0 && yy < MH && tmpRow[yy * MW + x]) v = 1; } paintOk[y * MW + x] = v; }
  }
  for (let my = 0; my < MH; my++) for (let mx = 0; mx < MW; mx++) {
    let hit = 0, tot = 0;
    for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) {
      const x = mx * S + dx, y = my * S + dy;
      if (x >= W || y >= H) continue;
      tot++;
      if (hairHit[y * W + x] || tailHit?.[y * W + x]) hit++;
    }
    const cx = mx * S + S / 2, cy = my * S + S / 2;
    const inHead = ((cx - hcx) / (hrx * 0.85)) ** 2 + ((cy - hcy) / (hry * 0.85)) ** 2 < 1;   // 头有自己的转动，这里摆只会把脸带歪
    m[my * MW + mx] = tot && !inHead && (!paintOk || paintOk[my * MW + mx]) ? Math.round(255 * hit / tot) : 0;
  }
  // 透明像素：周围有可摆像素就跟着摆（发梢外面那圈抗锯齿边）
  const out = Buffer.from(m);
  for (let my = 1; my < MH - 1; my++) for (let mx = 1; mx < MW - 1; mx++) {
    if (m[my * MW + mx]) continue;
    let s = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s = Math.max(s, m[(my + dy) * MW + mx + dx]);
    const x = mx * S, y = my * S, p = (Math.min(H - 1, y) * W + Math.min(W - 1, x)) * 4;
    if (data[p + 3] < 40) out[my * MW + mx] = s;
  }
  const dir = `public/images/characters/${c}/mask`;
  fs.mkdirSync(dir, { recursive: true });
  // 羽化：摆和不摆之间有过渡。半截马尾只摆上半截时，羽化宽一点才看不出折痕
  await sharp(out, { raw: { width: MW, height: MH, channels: 1 } }).blur(3).webp({ quality: 90 }).toFile('public' + maskSrc);
  // 检查图：原图上把可摆的地方染蓝
  const tint = await sharp(out, { raw: { width: MW, height: MH, channels: 1 } }).resize(W, H).extractChannel(0).raw().toBuffer();
  const chk = Buffer.from(data);
  for (let i = 0; i < W * H; i++) { const t = tint[i] / 255 * 0.6; chk[i * 4] = chk[i * 4] * (1 - t); chk[i * 4 + 1] = chk[i * 4 + 1] * (1 - t) + 120 * t; chk[i * 4 + 2] = chk[i * 4 + 2] * (1 - t) + 255 * t; }
  await sharp(chk, { raw: { width: W, height: H, channels: 4 } }).flatten({ background: '#888' }).resize({ height: 700 }).jpeg().toFile(path.join(ROOT, `${c}_${name}_check.jpg`));
  for (const f of files) done[f] = maskSrc;
  fs.writeFileSync(outFile, JSON.stringify(done, null, 1));
  console.log(`${c}/${name}：${files.length} 张共用，框 ${boxes.length} 个${tails.length ? '（含尾巴）' : ''}`);
}

const lines = Object.entries(done).sort().map(([k, v]) => `  '${k}': '${v}',`);
fs.writeFileSync('data/puppetMaskAuto.ts', `// ⚙️ 自动生成，别手改：node scripts/remake/sway-masks.mjs
// 每张木偶立绘"可以摆动的地方"（只有头发、尾巴）的蒙版。没有蒙版的立绘按老办法整片区域摆
export const AUTO_MASKS: Record<string, string> = {
${lines.join('\n')}
};
`, 'utf8');
console.log(`共 ${Object.keys(done).length} 张立绘有蒙版 → data/puppetMaskAuto.ts`);
