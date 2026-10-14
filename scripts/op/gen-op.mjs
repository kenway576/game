import { spawnSync } from 'child_process';
// ---------------------------------------------------------
// 🎬 开场动画：首帧 → 视频 → 播放数据
//
//   node scripts/op/gen-op.mjs keys [--only op04_hikari,...] [--n 1]   # 首帧（gemini-3-pro-image，带角色卡）
//   node scripts/op/gen-op.mjs videos [--only ...] [--pick op04_hikari=2,...]   # Veo 3.1 图生视频，8 秒
//   node scripts/op/gen-op.mjs data [--pick ...]                         # 写 data/opening.ts + 装首帧/视频
//
// 分镜和画风锚定在 scripts/op/shots.mjs。用户给的画风/帧数提示词原样放在每条提示词的结尾。
// 走 Vertex（GEMINI_API_KEY + GEMINI_VERTEX_PROJECT），视频按秒收费，记在 .generated/remake2/_cost.log。
// 中途断了重跑同一条命令：已有的首帧/视频跳过，已提交的 Veo 任务接着等。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
import { CARDS } from '../remake/cards.mjs';
import { IDENTITY_EXTRA } from '../remake/outfits.mjs';
import { SHOTS, STYLE_ANCHOR_ZH, FRAME_ANCHOR_ZH, STYLE_ANCHOR_EN } from './shots.mjs';
sharp.cache(false);

const STAGE = process.argv[2];
// 转码用的 ffmpeg：本机 Python 的 imageio_ffmpeg 带了一个；也可以用环境变量 FFMPEG 指定
const FFMPEG = process.env.FFMPEG || 'C:/Users/adm/AppData/Local/Programs/Python/Python312/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const ONLY = arg('only') ? String(arg('only')).split(',') : null;
const PICK = Object.fromEntries(String(arg('pick', '')).split(',').filter(Boolean).map(kv => kv.split('=')));
const OUT = '.generated/op';
const KEY = process.env.GEMINI_API_KEY;
const PROJECT = process.env.GEMINI_VERTEX_PROJECT || '389812341416';
const VEO = arg('model', 'veo-3.1-fast-generate-001');
const cost = (what, model, size) => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\top/${what}\t${model}\t${size}\n`);
const shots = SHOTS.filter(s => !ONLY || ONLY.includes(s.id));
const keyOf = s => path.join(OUT, s.id, `key_${PICK[s.id] || 1}.png`);

// 角色卡（长相的唯一标准）
const cardOf = c => [`public/images/character_cards/${c}/school_blazer_remake.webp`, `public/images/character_cards/${c}/cardigan_remake.webp`].find(f => fs.existsSync(f));
const smallCard = async c => {
  const o = path.join(OUT, `_card_${c}.jpg`);
  if (!fs.existsSync(o)) await sharp(cardOf(c)).flatten({ background: '#e6e6e6' }).resize({ width: 1600 }).jpeg({ quality: 88 }).toFile(o);
  return o;
};

async function keys() {
  const N = Number(arg('n', 1));
  let next = 0;
  const run = async s => {
    const dir = path.join(OUT, s.id); fs.mkdirSync(dir, { recursive: true });
    const parts = [];
    for (const c of s.chars) {
      const card = CARDS.find(x => x.id === c);
      parts.push({ text: `CHARACTER REFERENCE for ${c} — copy the face, hairstyle, hair colour, eye colour, skin tone, accessories and body proportions exactly (only the design; redraw it in the art style below):` }, imagePart(await smallCard(c)));
      parts.push({ text: `${c}: ${card.identity}${IDENTITY_EXTRA[c] ? ' ' + IDENTITY_EXTRA[c] : ''}` });
    }
    parts.push({ text: `Draw one frame of a Japanese TV anime opening sequence, 16:9, full-bleed: the picture runs to all four edges — no border, no frame line, no paper margin, no letterbox. No text, no numbers, no timecode, no captions, no watermark anywhere in the picture.\n\nSCENE: ${s.image}\n\n${STYLE_ANCHOR_EN}\n\n${STYLE_ANCHOR_ZH}` });
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
    const prompt = `A shot from a Japanese TV anime opening. ${s.motion} Keep every character's face, hair, outfit and colours exactly as in the first frame. Limited animation on threes: held drawings, snappy pose-to-pose motion, no smooth interpolation. No text, no logos.\n\n${STYLE_ANCHOR_ZH}\n${FRAME_ANCHOR_ZH}`;
    const r = await post(`${base}:predictLongRunning`, {
      instances: [{ prompt, image: { bytesBase64Encoded: jpg.toString('base64'), mimeType: 'image/jpeg' } }],
      parameters: { aspectRatio: '16:9', durationSeconds: 8, sampleCount: 1, generateAudio: false, resolution: '1080p', personGeneration: 'allow_all' }
    });
    if (!r.name) { console.log(`${s.id} 提交失败：${JSON.stringify(r).slice(0, 300)}`); continue; }
    fs.writeFileSync(opF, r.name);
    cost(`${s.id}/clip`, VEO, '8s');
    ops.push({ s, out, op: r.name });
    console.log(`${s.id} 已提交`);
    await new Promise(r => setTimeout(r, 2000));
  }
  for (let round = 0; round < 90 && ops.some(o => !o.done); round++) {
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

// 播放数据：切点（每 4 小节）、文件、名字卡
const NAMES = {
  hikari: ['光', 'HIKARI', 'ひかり'], asuka: ['明日香', 'ASUKA', 'あすか'], rei: ['铃', 'REI', 'れい'], nao: ['奈绪', 'NAO', 'なお'],
  miyuki: ['深雪', 'MIYUKI', 'みゆき'], sora: ['空', 'SORA', 'そら'], maki: ['真希', 'MAKI', 'まき'], inari: ['稻荷', 'INARI', 'いなり'],
  kai: ['金城カイ', 'KAI KINJO', 'きんじょう かい']
};
async function data() {
  const beats = JSON.parse(fs.readFileSync('.generated/op_beats.json', 'utf8'));
  const cuts = beats.bars.filter((_, i) => i % 4 === 0).slice(0, SHOTS.length + 1);
  fs.mkdirSync('public/videos/op', { recursive: true });
  fs.mkdirSync('public/images/op', { recursive: true });
  const rows = [];
  for (let i = 0; i < SHOTS.length; i++) {
    const s = SHOTS[i];
    const kf = keyOf(s);
    const img = `/images/op/${s.id}.webp`;
    if (fs.existsSync(kf)) await sharp(kf).resize({ width: 1920 }).webp({ quality: 86 }).toFile('public' + img);
    let video = null;
    const clip = path.join(OUT, s.id, `clip_${PICK[s.id] || 1}.mp4`);
    if (!s.still && fs.existsSync(clip)) {
      // Veo 出来的是 1080p、24 帧顺滑运动、一段 7–30MB。转成 720p VP9，
      // 并且在转码时就烘焙成「一拍三」：先抽成 8 帧/秒，再每张停三格回到 24 帧。
      // 停住的帧几乎不占码率，一段只剩一两 MB。
      video = `/videos/op/${s.id}.webm`;
      const out = 'public' + video;
      // 仓库的提交钩子拦 5MB 以上的文件：画面动得多的镜头（烟花、天台奔跑）先按 crf 34 转，
      // 超了就一档一档往上压，直到 4.8MB 以内
      const LIMIT = 4.8 * 1048576;
      if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(clip).mtimeMs || fs.statSync(out).size > LIMIT) {
        for (const crf of [34, 38, 42, 46]) {
          const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', clip, '-an', '-vf', 'fps=8,fps=24,scale=1280:-2',
            '-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', out]);
          if (r.status !== 0) { console.log(`${s.id} 转码失败：${String(r.stderr).slice(0, 200)}`); video = null; break; }
          console.log(`${s.id} crf ${crf} → ${(fs.statSync(out).size / 1048576).toFixed(1)}MB`);
          if (fs.statSync(out).size <= LIMIT) break;
        }
      }
    }
    // 只有单人镜头打名字卡
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

if (STAGE === 'keys') await keys();
else if (STAGE === 'videos') await videos();
else if (STAGE === 'data') await data();
else console.log('用法：keys | videos | data');
