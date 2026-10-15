// ---------------------------------------------------------
// 🎼 Lyria（Vertex AI 的音乐生成）：生成真乐器的独奏素材，给 UI 音效切音用
//
//   node scripts/audio/lyria.mjs --id celesta --prompt "..." [--negative "..."] [--seed 1]
//
// 输出 .generated/sfx3/raw/<id>.wav（48kHz、约 30 秒）。纯合成的 UI 音效听起来"廉价"，
// 根本原因是没有真乐器的泛音和琴体共鸣；这里先要一批真乐器的录音质感，再由 make_sfx3.py 切音、拼装。
// 走 Vertex（GEMINI_API_KEY + GEMINI_VERTEX_PROJECT，us-central1），按次计费，记在 .generated/remake2/_cost.log。
// ---------------------------------------------------------
import fs from 'fs';
import https from 'https';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const ID = arg('id'), PROMPT = arg('prompt'), NEG = arg('negative', 'vocals, drums, percussion loops, bass, distortion, noise, crowd, speech');
const SEED = Number(arg('seed', 7));
const KEY = process.env.GEMINI_API_KEY;
const PROJECT = process.env.GEMINI_VERTEX_PROJECT || '389812341416';
if (!ID || !PROMPT || !KEY) { console.error('用法：--id <名字> --prompt "<描述>"，需要 GEMINI_API_KEY'); process.exit(1); }

const post = (urlPath, body) => new Promise((resolve, reject) => {
  const payload = JSON.stringify(body);
  const req = https.request({ hostname: 'us-central1-aiplatform.googleapis.com', path: urlPath, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-goog-api-key': KEY } }, res => {
    let b = ''; res.on('data', d => b += d); res.on('end', () => { try { resolve({ status: res.statusCode, json: JSON.parse(b) }); } catch { reject(new Error(`HTTP ${res.statusCode}: ${b.slice(0, 400)}`)); } });
  });
  req.on('error', reject); req.setTimeout(300000, () => req.destroy(new Error('超时')));
  req.write(payload); req.end();
});

fs.mkdirSync('.generated/sfx3/raw', { recursive: true });
const r = await post(`/v1/projects/${PROJECT}/locations/us-central1/publishers/google/models/lyria-002:predict`, {
  instances: [{ prompt: PROMPT, negative_prompt: NEG, seed: SEED }],
  parameters: {}
});
const pred = r.json?.predictions?.[0];
const b64 = pred?.bytesBase64Encoded || pred?.audioContent;
if (!b64) { console.error('没拿到音频：', r.status, JSON.stringify(r.json).slice(0, 600)); process.exit(1); }
fs.writeFileSync(`.generated/sfx3/raw/${ID}.wav`, Buffer.from(b64, 'base64'));
fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tsfx3/${ID}\tlyria-002\t30s\n`);
console.log(`.generated/sfx3/raw/${ID}.wav ${(fs.statSync(`.generated/sfx3/raw/${ID}.wav`).size / 1024).toFixed(0)}KB`);
