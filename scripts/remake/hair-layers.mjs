// ---------------------------------------------------------
// 💇 头发 / 尾巴分层：让垂下来的头发和尾巴能摆，身体（手、袖子）一点都不变形
//
//   node scripts/remake/hair-layers.mjs [--only hikari,inari] [--jobs 2]
//
// 一张立绘是一整层，头发和手臂、衣服挤在同一层里：只让头发动，总会把旁边的东西一起拉歪。
// 所以拆成两层：
//   1. 让 gemini-3-pro-image 把"垂下来的头发 / 尾巴"从图上去掉，补画出它们后面的东西
//      （背、肩膀、手臂、衣服、背景）→ 身体层
//   2. 原图和身体层差得多的地方 = 被拿掉的头发 → 头发蒙版
//   3. 游戏里：身体层 = 原图在蒙版处换成补画的身体，只做整体的呼吸、晃动；
//      头发层 = 原图 × 蒙版，在身体上面绕扎头发的地方摆。手和袖子在身体层，永远不会被拉弯。
// 同一套身体的各个表情共用一份（换表情只改脸，垂下来的头发不变）。
// 产物：public/images/characters/<角色>/layer/<那套>_body.webp、_hair.webp（蒙版）
//       data/puppetLayerAuto.ts（哪张立绘用哪份）
// 中间文件在 .generated/remake2-layer/，断点续跑。
//
// ⚠️ 2026-10-05 试做光、稻荷后暂停（PuppetSprite 里 LAYERS_ON = false）：
//   · 垂在身体前面、或从手臂后面穿过的头发，一摆就跟头部那段断开，碎发飘在旁边
//   · 头发拿掉后补画出来的身体有污迹（稻荷毛衣上一块灰、裙边一道黑线），头发摆开就露出来
//   · 蒙版边缘的发丝轮廓留在身体层里，像残影
//   AI 补画 + 差分蒙版做不到干净的分层；真要做得用专门的分层工具（See-through）或人工拆层
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { buildSync } from 'esbuild';
import { pathToFileURL } from 'url';
import { generate, imagePart } from '../lib/gemini.mjs';
import { align } from './blink-lib.mjs';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const ONLY = arg('only') ? String(arg('only')).split(',') : null;
const JOBS = Number(arg('jobs', 2));
const ROOT = '.generated/remake2-layer';
fs.mkdirSync(ROOT, { recursive: true });
const cost = (what, model, size) => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tlayer/${what}\t${model}\t${size}\n`);

// 短发、没有垂下来的东西的角色不做
const SKIP_CHARS = ['sora', 'rei'];

const tmp = path.join(os.tmpdir(), `rigs_${Date.now()}.mjs`);
buildSync({ entryPoints: ['data/puppetRigs.ts'], bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error' });
const { PUPPET_RIGS } = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

// 同一套身体：同角色 + 骨骼里除了眼睛/眨眼/蒙版以外都一样
const TEST = arg('test') ? String(arg('test')).split(',') : null;   // 只做这几张底图所在的那套（试效果用）
const sets = new Map();
for (const [src, rig] of Object.entries(PUPPET_RIGS)) {
  const c = src.split('/')[3];
  if (SKIP_CHARS.includes(c) || (ONLY && !ONLY.includes(c))) continue;
  if (!fs.existsSync('public' + src)) continue;
  const { eyes, blink, mask, layer, ...body } = rig;
  const key = c + JSON.stringify(body);
  if (!sets.has(key)) sets.set(key, { c, rig, files: [] });
  sets.get(key).files.push(src);
}
const outFile = path.join(ROOT, 'layers.json');
const done = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};
const save = () => {
  fs.writeFileSync(outFile, JSON.stringify(done, null, 1));
  const lines = Object.entries(done).filter(([, v]) => v).sort().map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`);
  fs.writeFileSync('data/puppetLayerAuto.ts', `// ⚙️ 自动生成，别手改：node scripts/remake/hair-layers.mjs
// 头发 / 尾巴分层：body = 去掉垂发后补画的身体，hair = 垂发蒙版（灰度）。有它的立绘，头发单独摆、身体不变形
export const AUTO_LAYERS: Record<string, { body: string; hair: string }> = {
${lines.join('\n')}
};
`, 'utf8');
};
console.log(`${sets.size} 套身体要分层`);

const PROMPT = (hasTails) => `This is a finished full-body anime character illustration on a flat light grey background. Return the SAME image with ONE change:

REMOVE ${hasTails ? 'all of her big fluffy animal tails, and every lock of her long hair that hangs down' : 'every lock of her long hair that hangs down'} below the chin — twin tails, ponytails, long side hair, braids — from where it leaves the head all the way to its tips. Keep the hair on top of the head, the bangs, the short hair framing the face, the ears and all hair accessories exactly as they are.

Where the removed ${hasTails ? 'hair and tails were' : 'hair was'}, paint what was hidden behind ${hasTails ? 'them' : 'it'}: her shoulders, back, arms, sleeves, clothes and legs drawn naturally and completely in the same style, and the same flat light grey background everywhere else.

Everything else must stay exactly the same, pixel for pixel where possible: identical pose, face, expression, hands, clothes, colours, art style, line quality, framing and size. Do not move or redraw anything that was not covered by the removed ${hasTails ? 'hair and tails' : 'hair'}.`;

const doOne = async ({ c, rig, files }) => {
  const ref = files.find(f => /neutral\.webp$/.test(f)) || files[0];
  const name = path.basename(ref, '.webp');
  const key = `${c}_${name}`;
  const bodyPub = `/images/characters/${c}/layer/${name}_body.webp`, hairPub = `/images/characters/${c}/layer/${name}_hair.webp`;
  if (files.every(f => done[f]?.body === bodyPub) && fs.existsSync('public' + bodyPub)) return;
  const D = path.join(ROOT, key);
  fs.mkdirSync(D, { recursive: true });
  const P = f => path.join(D, f);
  const { data: orig, info } = await sharp('public' + ref).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;

  // 1. 铺到 9:16 的灰底画布中间（模型只吃固定比例），2K
  const CH = 2752, CW = 1536;
  const sc = Math.min(CW / W, CH / H) * 0.96;
  const sw = Math.round(W * sc), sh = Math.round(H * sc);
  const ox = Math.round((CW - sw) / 2), oy = Math.round((CH - sh) / 2);
  const inp = P('in.png');
  if (!fs.existsSync(inp)) {
    const scaled = await sharp('public' + ref).resize(sw, sh).png().toBuffer();
    await sharp({ create: { width: CW, height: CH, channels: 4, background: '#E6E6E6' } }).composite([{ input: scaled, left: ox, top: oy }]).flatten({ background: '#E6E6E6' }).png().toFile(inp);
  }
  const hasTails = c === 'inari';
  const raw = P('raw.png');
  if (!fs.existsSync(raw)) {
    console.log(`${key}：补画身体…`);
    const r = await generate({ parts: [imagePart(inp), { text: PROMPT(hasTails) }], aspectRatio: '9:16', imageSize: '2K' });
    cost(`${key}`, 'gemini-3-pro-image', '2K');
    if (!r.images.length) throw new Error(`${key} 没拿到图：${r.finishReason}`);
    await sharp(r.images[0]).png().toFile(raw);
  }

  // 2. 对齐（看头部和下半身——一般不会被改）、放回原图坐标
  const rawFit = await sharp(raw).resize(CW, CH, { fit: 'fill' }).png().toBuffer();
  const back = await sharp(rawFit).extract({ left: ox, top: oy, width: sw, height: sh }).resize(W, H, { fit: 'fill', kernel: 'lanczos3' }).removeAlpha().raw().toBuffer();
  const origFlat = await sharp('public' + ref).flatten({ background: '#E6E6E6' }).removeAlpha().raw().toBuffer();
  // align 需要正方形：按高度取方块，宽度不够的地方填灰
  const SQ = Math.max(W, H);
  const toSq = buf => { const o = Buffer.alloc(SQ * SQ * 3, 230); for (let y = 0; y < H; y++) buf.copy(o, y * SQ * 3, y * W * 3, (y + 1) * W * 3); return o; };
  const [hx, hy] = [rig.headC[0] * W, rig.headC[1] * H], [hrx, hry] = [rig.headR[0] * W, rig.headR[1] * H];
  const a = align(toSq(origFlat), toSq(back), SQ, (x, y) => x < W && y < H && ((((x - hx) / hrx) ** 2 + ((y - hy) / hry) ** 2 < 0.8) || y > H * 0.8));
  const shifted = Buffer.alloc(W * H * 3, 230);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const sx = x + a.dx, sy = y + a.dy;
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
    back.copy(shifted, (y * W + x) * 3, (sy * W + sx) * 3, (sy * W + sx) * 3 + 3);
  }

  // 3. 身体层的透明度：跟灰底的色差（浅色头发不在身体层里，所以这里不怕把头发抠成洞）
  const BG = [230, 230, 230];
  const body = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    const r = shifted[p * 3], g = shifted[p * 3 + 1], b = shifted[p * 3 + 2];
    const d = Math.sqrt((r - BG[0]) ** 2 + (g - BG[1]) ** 2 + (b - BG[2]) ** 2);
    const t = Math.min(1, Math.max(0, (d - 10) / 22)), al = t * t * (3 - 2 * t);
    for (let c2 = 0; c2 < 3; c2++) body[p * 4 + c2] = al > 0.02 ? Math.max(0, Math.min(255, Math.round((shifted[p * 3 + c2] - (1 - al) * BG[c2]) / al))) : shifted[p * 3 + c2];
    body[p * 4 + 3] = Math.round(al * 255);
  }

  // 4. 头发蒙版 = 原图里有、身体层里变了的地方（被拿掉的垂发）。头部核心不算（那里本来就不该动）
  const diff = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) {
    const x = p % W, y = (p - x) / W;
    if (((x - hx) / (hrx * 0.8)) ** 2 + ((y - hy) / (hry * 0.8)) ** 2 < 1) continue;
    const oa = orig[p * 4 + 3];
    if (oa < 40) continue;
    const dc = Math.abs(origFlat[p * 3] - shifted[p * 3]) + Math.abs(origFlat[p * 3 + 1] - shifted[p * 3 + 1]) + Math.abs(origFlat[p * 3 + 2] - shifted[p * 3 + 2]);
    // 原图不透明、身体层却是背景（透明）= 拿掉的是背景前面的头发/尾巴（浅色的尾巴尖跟灰底色差小，只看颜色会漏）
    // 两边都不透明：颜色差得多 = 拿掉的是身体前面的头发
    if ((oa >= 128 && body[p * 4 + 3] < 110) || dc > 45) diff[p] = 1;
  }
  // 开运算去掉零碎的小点（模型顺手改的几笔），再闭运算把发丝之间的缝补上
  const morph = (src, r, dilate) => {
    const tmpB = new Uint8Array(W * H), out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let v = dilate ? 0 : 1; for (let k = -r; k <= r; k++) { const xx = x + k; const s = xx >= 0 && xx < W ? src[y * W + xx] : 0; if (dilate ? s : !s) { v = dilate ? 1 : 0; break; } } tmpB[y * W + x] = v; }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let v = dilate ? 0 : 1; for (let k = -r; k <= r; k++) { const yy = y + k; const s = yy >= 0 && yy < H ? tmpB[yy * W + x] : 0; if (dilate ? s : !s) { v = dilate ? 1 : 0; break; } } out[y * W + x] = v; }
    return out;
  };
  const r1 = Math.max(1, Math.round(W * 0.004)), r2 = Math.max(2, Math.round(W * 0.01));
  let m = morph(morph(diff, r1, false), r1, true);
  m = morph(morph(m, r2, true), r2, false);
  // 只留够大的连通块
  {
    const seen = new Uint8Array(W * H), st = [];
    for (let s = 0; s < W * H; s++) {
      if (!m[s] || seen[s]) continue;
      const comp = []; st.push(s); seen[s] = 1;
      while (st.length) { const p = st.pop(), x = p % W; comp.push(p); for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p >= W ? p - W : -1, p < W * H - W ? p + W : -1]) if (q >= 0 && m[q] && !seen[q]) { seen[q] = 1; st.push(q); } }
      if (comp.length < W * H * 0.002) for (const p of comp) m[p] = 0;
    }
  }
  const area = m.reduce((s, v) => s + v, 0) / (W * H);
  if (area < 0.004) { console.log(`${key}：没找到可以摆的头发（${(area * 100).toFixed(2)}%），不分层`); for (const f of files) done[f] = null; save(); return; }
  const mask = Buffer.from(m.map(v => v * 255));
  const maskSoft = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).blur(1).extractChannel(0).raw().toBuffer();

  // 身体层只在蒙版附近用补画的像素，别处直接用原图（原图更干净）
  const near = morph(m, Math.max(3, Math.round(W * 0.02)), true);
  const bodyOut = Buffer.from(orig);
  for (let p = 0; p < W * H; p++) if (near[p]) for (let k = 0; k < 4; k++) bodyOut[p * 4 + k] = body[p * 4 + k];

  const outDir = `public/images/characters/${c}/layer`;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync('public' + bodyPub, await sharp(bodyOut, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toBuffer());
  fs.writeFileSync('public' + hairPub, await sharp(maskSoft, { raw: { width: W, height: H, channels: 1 } }).webp({ quality: 92, lossless: false }).toBuffer());
  // 检查图：原图 | 身体层 | 头发层（深色底）
  const hairOnly = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) { for (let k = 0; k < 3; k++) hairOnly[p * 4 + k] = orig[p * 4 + k]; hairOnly[p * 4 + 3] = Math.round(orig[p * 4 + 3] * maskSoft[p] / 255); }
  const tiles = await Promise.all([
    sharp('public' + ref).flatten({ background: '#334' }).resize({ height: 700 }).png().toBuffer(),
    sharp(bodyOut, { raw: { width: W, height: H, channels: 4 } }).flatten({ background: '#334' }).resize({ height: 700 }).png().toBuffer(),
    sharp(hairOnly, { raw: { width: W, height: H, channels: 4 } }).flatten({ background: '#334' }).resize({ height: 700 }).png().toBuffer()
  ]);
  const tw = (await sharp(tiles[0]).metadata()).width;
  await sharp({ create: { width: tw * 3 + 12, height: 700, channels: 3, background: '#fff' } }).composite(tiles.map((t, i) => ({ input: t, left: i * (tw + 6), top: 0 }))).jpeg().toFile(P('check.jpg'));
  for (const f of files) done[f] = { body: bodyPub, hair: hairPub };
  save();
  console.log(`${key}：对齐 (${a.dx},${a.dy})，头发占 ${(area * 100).toFixed(1)}%，${files.length} 张共用`);
};

const queue = [...sets.values()].filter(s => !TEST || s.files.some(f => TEST.some(t => f.endsWith('/' + t + '.webp') && f.includes('/' + s.c + '/'))));
await Promise.all(Array.from({ length: JOBS }, async () => {
  while (queue.length) { const s = queue.shift(); try { await doOne(s); } catch (e) { console.log(`✘ ${s.c}: ${e.message}`); } }
}));
save();
console.log('完成');
