import { spawnSync } from 'child_process';
// ---------------------------------------------------------
// 🎬 一拍三动画：首帧 → 视频 → 装进游戏
//
//   node scripts/op/gen-op.mjs keys   [--set op] [--only id1,id2] [--n 1]   # 首帧（gemini-3-pro-image，带角色卡）
//   node scripts/op/gen-op.mjs videos [--set op] [--only ...] [--pick id=2,...]   # Veo 3.1 图生视频，8 秒
//   node scripts/op/gen-op.mjs data   [--set op] [--pick ...]                    # 转码 + 装进 public + 写数据
//
// --set（三套镜头表，同一条管线）：
//   op        开场动画。分镜在 scripts/op/shots.mjs；data 写 data/opening.ts（切点卡曲子的小节）
//   story     第④⑤段剧情里的那一个镜头（每段一个）。分镜在 scripts/op/sets/story.mjs；
//             data 装成 public/images/cg/cg_ev_<id>.webp + public/videos/anime/cg_ev_<id>.webm（登记在 data/eventCgs.ts）
//   epilogue  后日谈的一分钟（每人 8 个镜头）。分镜在 scripts/op/sets/epilogue.mjs；
//             data 写 data/epilogueFilms.ts（每 8 秒一刀）
//   op2       开场动画第二版（镜头动、人不乱动，专门的 OP 曲）。分镜在 scripts/op/sets/op2.mjs；
//             reuse 的镜头直接拷第一版的首帧；data 按 .generated/op_music/op_beats.json 的小节切，写 data/opening.ts
//
// 画风锚定在 scripts/op/shots.mjs。用户给的画风/帧数提示词原样放在每条提示词的结尾。
// Veo 单次最长 8 秒（Vertex 只给 4/6/8），所以一分钟 = 8 个镜头剪起来。
// 走 Vertex（GEMINI_API_KEY + GEMINI_VERTEX_PROJECT），按秒收费，记在 .generated/remake2/_cost.log。
// 中途断了重跑同一条命令：已有的首帧/视频跳过，已提交的 Veo 任务接着等。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
import { CARDS } from '../remake/cards.mjs';
import { IDENTITY_EXTRA } from '../remake/outfits.mjs';
import { SHOTS as OP_SHOTS, STYLE_ANCHOR_ZH, FRAME_ANCHOR_ZH, STYLE_ANCHOR_EN } from './shots.mjs';
sharp.cache(false);

const STAGE = process.argv[2];
// 转码用的 ffmpeg：本机 Python 的 imageio_ffmpeg 带了一个；也可以用环境变量 FFMPEG 指定
const FFMPEG = process.env.FFMPEG || 'C:/Users/adm/AppData/Local/Programs/Python/Python312/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const SET = String(arg('set', 'op'));
const SETMOD = SET === 'op' ? null : await import(`./sets/${SET}.mjs`);
const SHOTS = SETMOD ? SETMOD.SHOTS : OP_SHOTS;
const ONLY = arg('only') ? String(arg('only')).split(',') : null;
const PICK = Object.fromEntries(String(arg('pick', '')).split(',').filter(Boolean).map(kv => kv.split('=')));
const OUT = SET === 'op' ? '.generated/op' : SET === 'op2' ? '.generated/op2' : `.generated/anime/${SET}`;
const KEY = process.env.GEMINI_API_KEY;
const PROJECT = process.env.GEMINI_VERTEX_PROJECT || '389812341416';
const VEO = arg('model', 'veo-3.1-fast-generate-001');
const cost = (what, model, size) => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\t${SET}/${what}\t${model}\t${size}\n`);
const shots = SHOTS.filter(s => !s.from && (!ONLY || ONLY.includes(s.id) || (s.group && ONLY.includes(s.group))));
const keyOf = s => path.join(OUT, s.id, `key_${PICK[s.id] || 1}.png`);
// OP 是"开场动画的一格"；剧情和后日谈是"TV 动画正片里的一格"
const FRAME_KIND = SET === 'op' || SET === 'op2' ? 'a Japanese TV anime opening sequence' : 'a Japanese TV anime episode';

// 角色卡（长相的唯一标准）
const cardOf = c => [`public/images/character_cards/${c}/school_blazer_remake.webp`, `public/images/character_cards/${c}/cardigan_remake.webp`].find(f => fs.existsSync(f));
// 几个并发任务会同时要同一张卡：同一个文件只生成一次（不然有人会读到写了一半的空文件，
// Gemini 报 "empty inlineData"）
const making = new Map();
const once = (o, make) => {
  if (!making.has(o)) making.set(o, fs.existsSync(o) && fs.statSync(o).size > 0 ? Promise.resolve() : make());
  return making.get(o).then(() => o);
};
const smallCard = async c => {
  fs.mkdirSync(OUT, { recursive: true });
  const o = path.join(OUT, `_card_${c}.jpg`);
  return once(o, () => sharp(cardOf(c)).flatten({ background: '#e6e6e6' }).resize({ width: 1600 }).jpeg({ quality: 88 }).toFile(o));
};
// 这一镜穿的那套衣服的立绘（剧情和后日谈里衣服是写死的：浴衣、便服、冬装……）
const outfitRef = async (c, outfit) => {
  const d = `public/images/characters/${c}/`;
  const f = [`${outfit}_neutral`, `${outfit}_smile`, `${outfit}_happy`].map(n => d + n + '.webp').find(x => fs.existsSync(x));
  if (!f) return null;
  const o = path.join(OUT, `_outfit_${c}_${outfit}.jpg`);
  return once(o, () => sharp(f).flatten({ background: '#e6e6e6' }).resize({ height: 1400 }).jpeg({ quality: 88 }).toFile(o));
};

async function keys() {
  const N = Number(arg('n', 1));
  let next = 0;
  const run = async s => {
    const dir = path.join(OUT, s.id); fs.mkdirSync(dir, { recursive: true });
    if (!arg('n') && fs.readdirSync(dir).some(f => /^key_\d+\.png$/.test(f))) { console.log(`${s.id} 已有首帧`); return; }
    // 第二版 OP：长相已经验证过的首帧直接拿第一版的
    if (s.reuse) { fs.copyFileSync(path.join('.generated/op', s.reuse), path.join(dir, 'key_1.png')); console.log(`${s.id} ← 复用 ${s.reuse}`); return; }
    const parts = [];
    for (const c of s.chars) {
      const card = CARDS.find(x => x.id === c);
      parts.push({ text: `CHARACTER REFERENCE for ${c} — copy the face, hairstyle, hair colour, eye colour, skin tone, accessories and body proportions exactly (only the design; redraw it in the art style below):` }, imagePart(await smallCard(c)));
      const o = s.outfits?.[c] && await outfitRef(c, s.outfits[c]);
      if (o) parts.push({ text: `OUTFIT REFERENCE for ${c} — in this frame ${c} wears exactly these clothes:` }, imagePart(o));
      parts.push({ text: `${c}: ${card.identity}${IDENTITY_EXTRA[c] ? ' ' + IDENTITY_EXTRA[c] : ''}` });
    }
    parts.push({ text: `Draw one frame of ${FRAME_KIND}, 16:9, full-bleed: the picture runs to all four edges — no border, no frame line, no paper margin, no letterbox. No text, no numbers, no timecode, no captions, no watermark anywhere in the picture.\n\nSCENE: ${s.image}\n\n${STYLE_ANCHOR_EN}\n\n${STYLE_ANCHOR_ZH}` });
    for (let i = 0; i < N; i++) {
      const k = fs.readdirSync(dir).filter(f => /^key_\d+\.png$/.test(f)).length + 1;
      try {
        const r = await generate({ parts, aspectRatio: '16:9', imageSize: '2K' });
        cost(`${s.id}/key`, 'gemini-3-pro-image', '2K');
        if (!r.images.length) { console.log(`${s.id} 没拿到首帧：${r.finishReason} ${JSON.stringify(r.raw?.promptFeedback || {})}`); continue; }
        await sharp(r.images[0]).png().toFile(path.join(dir, `key_${k}.png`));
        console.log(`${s.id}/key_${k}.png`);
      } catch (e) { console.log(`${s.id} 出错：${e.message.slice(0, 160)}`); }
    }
  };
  await Promise.all(Array.from({ length: Number(arg('jobs', 3)) }, async () => { while (next < shots.length) await run(shots[next++]); }));
}

const post = (urlPath, body) => new Promise((resolve, reject) => {
  const payload = JSON.stringify(body);
  const req = https.request({ hostname: 'us-central1-aiplatform.googleapis.com', path: urlPath, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-goog-api-key': KEY } }, res => {
    let b = ''; res.on('data', d => b += d); res.on('end', () => { try { resolve(JSON.parse(b)); } catch { reject(new Error(`HTTP ${res.statusCode}: ${b.slice(0, 300)}`)); } });
  });
  req.on('error', reject); req.setTimeout(300000, () => req.destroy(new Error('超时')));
  req.write(payload); req.end();
});

async function videos() {
  const base = `/v1/projects/${PROJECT}/locations/us-central1/publishers/google/models/${VEO}`;
  const todo = shots.filter(s => !s.still);
  // 先全部提交（Veo 是异步任务，一起等更快），再轮询
  const ops = [];
  for (const s of todo) {
    const dir = path.join(OUT, s.id);
    const out = path.join(dir, `clip_${PICK[s.id] || 1}.mp4`);
    if (fs.existsSync(out)) { console.log(`${s.id} 已有视频`); continue; }
    const opF = path.join(dir, `op_${PICK[s.id] || 1}.txt`);
    if (fs.existsSync(opF)) { ops.push({ s, out, op: fs.readFileSync(opF, 'utf8') }); continue; }
    const kf = keyOf(s);
    if (!fs.existsSync(kf)) { console.log(`${s.id} 没有首帧，先跑 keys`); continue; }
    const jpg = await sharp(kf).resize({ width: 1920 }).jpeg({ quality: 92 }).toBuffer();
    const prompt = `A shot from ${FRAME_KIND}. ${s.motion} Keep every character's face, hair, outfit and colours exactly as in the first frame. Limited animation on threes: held drawings, snappy pose-to-pose motion, no smooth interpolation. No text, no logos, no subtitles.\n\n${STYLE_ANCHOR_ZH}\n${FRAME_ANCHOR_ZH}`;
    const r = await post(`${base}:predictLongRunning`, {
      instances: [{ prompt, image: { bytesBase64Encoded: jpg.toString('base64'), mimeType: 'image/jpeg' } }],
      parameters: { aspectRatio: '16:9', durationSeconds: SETMOD?.DURATION || 8, sampleCount: 1, generateAudio: false, resolution: '1080p', personGeneration: 'allow_all',
        ...(SETMOD?.NEGATIVE ? { negativePrompt: SETMOD.NEGATIVE } : {}) }
    });
    if (!r.name) { console.log(`${s.id} 提交失败：${JSON.stringify(r).slice(0, 300)}`); continue; }
    fs.writeFileSync(opF, r.name);
    cost(`${s.id}/clip`, VEO, `${SETMOD?.DURATION || 8}s`);
    ops.push({ s, out, op: r.name });
    console.log(`${s.id} 已提交`);
    await new Promise(r => setTimeout(r, 2000));
  }
  for (let round = 0; round < 120 && ops.some(o => !o.done); round++) {
    await new Promise(r => setTimeout(r, 15000));
    for (const o of ops.filter(o => !o.done)) {
      const r = await post(`${base}:fetchPredictOperation`, { operationName: o.op }).catch(e => ({ error: { message: e.message } }));
      if (r.error) { console.log(`${o.s.id} 出错：${JSON.stringify(r.error).slice(0, 200)}`); o.done = true; continue; }
      if (!r.done) continue;
      o.done = true;
      const v = r.response?.videos?.[0];
      if (!v?.bytesBase64Encoded) { console.log(`${o.s.id} 没拿到视频：${JSON.stringify(r.response || r).slice(0, 300)}`); fs.rmSync(path.join(OUT, o.s.id, `op_${PICK[o.s.id] || 1}.txt`), { force: true }); continue; }
      fs.writeFileSync(o.out, Buffer.from(v.bytesBase64Encoded, 'base64'));
      console.log(`${o.s.id} 完成 ${(fs.statSync(o.out).size / 1048576).toFixed(1)}MB`);
    }
  }
}

// Veo 出来的是 1080p、24 帧顺滑运动、一段 7–30MB。转成 720p VP9，
// 并且在转码时就烘焙成「一拍三」：先抽成 8 帧/秒，再每张停三格回到 24 帧。
// 停住的帧几乎不占码率，一段只剩一两 MB。
// 仓库的提交钩子拦 5MB 以上的文件：画面动得多的镜头先按 crf 34 转，超了就一档一档往上压。
const LIMIT = 4.8 * 1048576;
const transcode = (clip, out, id) => {
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(clip).mtimeMs && fs.statSync(out).size <= LIMIT) return true;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  for (const crf of [34, 38, 42, 46]) {
    const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', clip, '-an', '-vf', 'fps=8,fps=24,scale=1280:-2',
      '-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', out]);
    if (r.status !== 0) { console.log(`${id} 转码失败：${String(r.stderr).slice(0, 200)}`); return false; }
    console.log(`${id} crf ${crf} → ${(fs.statSync(out).size / 1048576).toFixed(1)}MB`);
    if (fs.statSync(out).size <= LIMIT) return true;
  }
  return true;
};
// crop：四周各裁掉多少（比例）。Gemini 的首帧偶尔会画出一圈画纸边框
const still = async (kf, out, crop = 0) => {
  fs.mkdirSync(path.dirname('public' + out), { recursive: true });
  let img = sharp(kf);
  if (crop) {
    const { width: W, height: H } = await sharp(kf).metadata();
    const x = Math.round(W * crop), y = Math.round(H * crop);
    img = sharp(await sharp(kf).extract({ left: x, top: y, width: W - 2 * x, height: H - 2 * y }).png().toBuffer());
  }
  await img.resize({ width: 1920, height: 1080, fit: 'cover' }).webp({ quality: 86 }).toFile('public' + out);
};

async function dataOp() {
  const beats = JSON.parse(fs.readFileSync('.generated/op_beats.json', 'utf8'));
  const cuts = beats.bars.filter((_, i) => i % 4 === 0).slice(0, SHOTS.length + 1);
  const rows = [];
  for (let i = 0; i < SHOTS.length; i++) {
    const s = SHOTS[i];
    const kf = keyOf(s);
    const img = `/images/op/${s.id}.webp`;
    if (fs.existsSync(kf)) await still(kf, img);
    let video = null;
    const clip = path.join(OUT, s.id, `clip_${PICK[s.id] || 1}.mp4`);
    if (!s.still && fs.existsSync(clip)) {
      video = `/videos/op/${s.id}.webm`;
      if (!transcode(clip, 'public' + video, s.id)) video = null;
    }
    const name = null; // 不打人名卡（纯动漫 OP）
    rows.push({ id: s.id, start: cuts[i], end: cuts[i + 1] ?? cuts[i] + 6.6, image: img, video, still: !!s.still, name });
  }
  const body = JSON.stringify(rows, null, 1);
  fs.writeFileSync('data/opening.ts', `// 自动生成：node scripts/op/gen-op.mjs data —— 别手改
// 开场动画：曲子 Three O'clock in Kobe 的 0–${Math.ceil(rows[rows.length - 1].end)} 秒，每 4 小节一个镜头（切点来自 librosa 量的小节）
export interface OpShot { id: string; start: number; end: number; image: string; video: string | null; still: boolean; name: [string, string, string] | null }
export const OP_MUSIC = '/audio/bgm/Three_O_clock_in_Kobe.mp3';
export const OP_BEATS: number[] = ${JSON.stringify(beats.beats)};
export const OP_SHOTS: OpShot[] = ${body};
`);
  console.log('写好了 data/opening.ts', rows.filter(r => r.video).length, '段视频');
}

// 第二版 OP：曲子是专门拼的 OP 曲（scripts/audio/build_op_music.py），每个镜头占 bars 小节，
// 视频只取其中一段（clipIn 起），所以一个 8 秒的片段可以只用最稳的那两三秒。
async function dataOp2() {
  const song = JSON.parse(fs.readFileSync(SETMOD.SONG, 'utf8'));
  const db = song.downbeats;
  const at = b => (b < 0 || b >= db.length) ? song.seconds : db[b];
  const rows = [];
  for (const s of SHOTS) {
    const start = +at(s.at[0]).toFixed(3), end = +at(s.at[1]).toFixed(3);
    const src = s.from ? SHOTS.find(x => x.id === s.from) : s;
    const kf = keyOf(src);
    const img = `/images/op/${src.id}.webp`;
    if (!s.from && fs.existsSync(kf)) await still(kf, img, s.crop || 0);
    let video = null;
    const clip = path.join(OUT, src.id, `clip_${PICK[src.id] || 1}.mp4`);
    if (!s.still && fs.existsSync(clip)) {
      video = `/videos/op/${src.id}.webm`;
      if (!s.from && !transcode(clip, 'public' + video, src.id)) video = null;
    }
    // 片段入点：默认跳过开头那半秒（Veo 起步常有一下顿挫）；快切的那几镜各自写了更靠后的入点
    const clipIn = s.clipIn ?? 0.5;
    rows.push({ id: s.id, start, end, image: img, video, still: !!s.still, name: null, clipIn, ...(s.title ? { title: true } : {}) });
  }
  fs.writeFileSync('data/opening.ts', `// 自动生成：node scripts/op/gen-op.mjs data --set op2 —— 别手改
// 开场动画第二版：用户的 OP 曲「一年だけの物語」（${song.tempo} BPM，${song.seconds}s），镜头卡在小节线上（分镜 scripts/op/sets/op2.mjs）
export interface OpShot { id: string; start: number; end: number; image: string; video: string | null; still: boolean; name: [string, string, string] | null; clipIn?: number; title?: boolean }
export const OP_MUSIC = '${SETMOD.MUSIC}';
export const OP_BEATS: number[] = ${JSON.stringify(song.beats)};
export const OP_SHOTS: OpShot[] = ${JSON.stringify(rows, null, 1)};
`);
  console.log('写好了 data/opening.ts', rows.filter(r => r.video).length, '镜用视频，', rows.length, '镜');
}

// 剧情里那一个镜头：首帧当 CG（图鉴缩略图），视频放进 /videos/anime/
async function dataStory() {
  for (const s of shots) {
    const kf = keyOf(s);
    if (!fs.existsSync(kf)) { console.log(`${s.id} 还没有首帧`); continue; }
    await still(kf, `/images/cg/cg_ev_${s.id}.webp`);
    const clip = path.join(OUT, s.id, `clip_${PICK[s.id] || 1}.mp4`);
    if (fs.existsSync(clip)) transcode(clip, `public/videos/anime/cg_ev_${s.id}.webm`, s.id);
    else console.log(`${s.id} 还没有视频（剧情里先放静帧）`);
  }
}

// 后日谈：每人一组，每 8 秒一刀，开头留一点黑场等音乐进来
async function dataEpilogue() {
  const LEAD = 1.2, CUT = 8;
  const films = {};
  for (const s of SHOTS) {
    const g = s.group;
    films[g] = films[g] || { music: SETMOD.MUSIC[g], shots: [] };
    const i = films[g].shots.length;
    const img = `/images/epilogue/${s.id}.webp`;
    const kf = keyOf(s);
    if (fs.existsSync(kf)) await still(kf, img);
    let video = null;
    const clip = path.join(OUT, s.id, `clip_${PICK[s.id] || 1}.mp4`);
    if (!s.still && fs.existsSync(clip)) {
      video = `/videos/epilogue/${s.id}.webm`;
      if (!transcode(clip, 'public' + video, s.id)) video = null;
    }
    films[g].shots.push({ id: s.id, start: +(LEAD + i * CUT).toFixed(2), end: +(LEAD + (i + 1) * CUT).toFixed(2), image: img, video, still: !!s.still, name: null });
  }
  fs.writeFileSync('data/epilogueFilms.ts', `// 自动生成：node scripts/op/gen-op.mjs data --set epilogue —— 别手改
// 后日谈的一分钟：每人 8 个镜头、每 8 秒一刀（Veo 单次最长 8 秒）。字幕和剧本在 story/epilogue.ts
import type { OpShot } from './opening';
export interface EpilogueFilm { music: string; shots: OpShot[] }
export const EPILOGUE_FILMS: Record<string, EpilogueFilm> = ${JSON.stringify(films, null, 1)};
`);
  console.log('写好了 data/epilogueFilms.ts', Object.keys(films).length, '人');
}

if (STAGE === 'keys') await keys();
else if (STAGE === 'videos') await videos();
else if (STAGE === 'data') await (SET === 'op' ? dataOp() : SET === 'op2' ? dataOp2() : SET === 'story' ? dataStory() : dataEpilogue());
else console.log('用法：keys | videos | data  [--set op|story|epilogue]');
