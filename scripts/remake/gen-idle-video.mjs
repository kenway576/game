// ---------------------------------------------------------
// 🎞️ 角色待机小视频（试做）：Veo 3.1 图生视频，首尾帧都是这张立绘 → 可以无缝循环
//
//   node scripts/remake/gen-idle-video.mjs --src hikari/school_neutral [--model veo-3.1-fast-generate-001] [--seconds 4]
//
// 立绘铺到纯绿底（9:16）上送去，游戏里播放时再实时抠绿（PuppetSprite 不用改图片，视频自己带不了透明通道）。
// 输出：public/videos/idle/<角色>_<立绘名>.mp4 + 同名 .json（立绘在画面里的位置，用来对齐）
// 走 Vertex（us-central1），按秒收费：fast 版大约每秒 $0.10–0.15
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const SRC = arg('src');
const MODEL = arg('model', 'veo-3.1-fast-generate-001');
const SECONDS = Number(arg('seconds', 4));
const KEY = process.env.GEMINI_API_KEY;
const PROJECT = process.env.GEMINI_VERTEX_PROJECT || '389812341416';
const LOC = 'us-central1';
if (!SRC || !KEY) { console.error('用法：--src <角色>/<立绘名>，需要 GEMINI_API_KEY'); process.exit(1); }

const [c, name] = SRC.split('/');
const DIR = `.generated/remake2-video/${c}_${name}`;
fs.mkdirSync(DIR, { recursive: true });
const GREEN = { r: 0, g: 177, b: 64 };   // 标准抠像绿

const post = (urlPath, body) => new Promise((resolve, reject) => {
  const payload = JSON.stringify(body);
  const req = https.request({ hostname: `${LOC}-aiplatform.googleapis.com`, path: urlPath, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-goog-api-key': KEY } }, res => {
    let b = ''; res.on('data', d => b += d); res.on('end', () => { try { resolve(JSON.parse(b)); } catch { reject(new Error(`HTTP ${res.statusCode}: ${b.slice(0, 300)}`)); } });
  });
  req.on('error', reject); req.setTimeout(300000, () => req.destroy(new Error('超时')));
  req.write(payload); req.end();
});

// 1. 立绘铺到 9:16 绿底中间，人物占画面高度的 92%
const W = 1080, H = 1920;
const meta = await sharp(`public/images/characters/${c}/${name}.webp`).metadata();
const sh = Math.round(H * 0.92), sw = Math.round(meta.width * sh / meta.height);
const left = Math.round((W - sw) / 2), top = Math.round((H - sh) * 0.6);
const sprite = await sharp(`public/images/characters/${c}/${name}.webp`).resize(sw, sh).png().toBuffer();
const frame = await sharp({ create: { width: W, height: H, channels: 4, background: { ...GREEN, alpha: 1 } } })
  .composite([{ input: sprite, left, top }]).flatten({ background: GREEN }).png().toBuffer();
fs.writeFileSync(path.join(DIR, 'first.png'), frame);
const img = { bytesBase64Encoded: frame.toString('base64'), mimeType: 'image/png' };

const prompt = `A subtle, gentle idle animation of this anime character standing still, like a living character portrait in a visual novel.
She breathes softly (chest and shoulders rise and fall slightly), blinks naturally once, and her long hair, hair ends and skirt sway very slightly as if in a soft breeze. A tiny natural weight shift.
She does NOT walk, turn, wave, talk or change her pose, hands or expression. Keep her face, outfit, colours and art style exactly the same as the image in every frame; flat 2D anime cel shading, crisp lineart.
The camera is completely static: no zoom, no pan, no camera movement. The background stays a perfectly flat, uniform solid green screen for the whole video, with no shadows, no light changes and no effects.
The video ends in exactly the same pose as it starts, so it can loop seamlessly.`;

// 2. 提交（首帧、尾帧都是同一张图）
const base = `/v1/projects/${PROJECT}/locations/${LOC}/publishers/google/models/${MODEL}`;
let opName = fs.existsSync(path.join(DIR, 'op.txt')) ? fs.readFileSync(path.join(DIR, 'op.txt'), 'utf8') : null;
if (!opName) {
  const r = await post(`${base}:predictLongRunning`, {
    instances: [{ prompt, image: img, lastFrame: img }],
    parameters: { aspectRatio: '9:16', durationSeconds: SECONDS, sampleCount: 1, generateAudio: false, resolution: '1080p', personGeneration: 'allow_all' }
  });
  if (!r.name) { console.error('提交失败：', JSON.stringify(r).slice(0, 600)); process.exit(1); }
  opName = r.name;
  fs.writeFileSync(path.join(DIR, 'op.txt'), opName);
  fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tvideo/${c}_${name}\t${MODEL}\t${SECONDS}s\n`);
  console.log('已提交，等生成…');
}

// 3. 等结果
for (let i = 0; i < 60; i++) {
  await new Promise(r => setTimeout(r, 10000));
  const r = await post(`${base}:fetchPredictOperation`, { operationName: opName });
  if (r.error) { console.error('出错：', JSON.stringify(r.error).slice(0, 600)); process.exit(1); }
  if (!r.done) { process.stdout.write('.'); continue; }
  if (r.response?.raiMediaFilteredCount) console.log('\n被安全过滤了：', JSON.stringify(r.response.raiMediaFilteredReasons));
  const v = r.response?.videos?.[0];
  if (!v?.bytesBase64Encoded) { console.error('\n没拿到视频：', JSON.stringify(r).slice(0, 600)); process.exit(1); }
  const outDir = 'public/videos/idle';
  fs.mkdirSync(outDir, { recursive: true });
  const out = `${outDir}/${c}_${name}.mp4`;
  fs.writeFileSync(out, Buffer.from(v.bytesBase64Encoded, 'base64'));
  // 立绘在视频画面里的位置（比例），游戏里用来跟静态立绘对齐
  fs.writeFileSync(`${outDir}/${c}_${name}.json`, JSON.stringify({ frame: [W, H], sprite: [left / W, top / H, sw / W, sh / H], key: GREEN }));
  console.log(`\n完成：${out}  ${(fs.statSync(out).size / 1024 / 1024).toFixed(1)} MB`);
  process.exit(0);
}
console.error('等了 10 分钟还没好，稍后重跑同一条命令会接着等');
