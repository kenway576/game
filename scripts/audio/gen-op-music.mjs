// ---------------------------------------------------------
// 🎸 OP 曲的素材：Lyria 一次只出 30 秒，所以先要一批同一种风格的候选，
// 再由 scripts/audio/build_op_music.py 挑调性、速度一致的两段，按小节拼成一首完整的 OP。
//
//   node scripts/audio/gen-op-music.mjs [--n 8] [--from 1]
// 输出 .generated/op_music/raw_<seed>.wav
// ---------------------------------------------------------
import fs from 'fs';
import https from 'https';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const N = Number(arg('n', 8)), FROM = Number(arg('from', 1));
const KEY = process.env.GEMINI_API_KEY;
const PROJECT = process.env.GEMINI_VERTEX_PROJECT || '389812341416';
const PROMPT = arg('prompt', 'Japanese anime TV opening theme song, instrumental. Energetic, bright J-rock band: crunchy distorted electric guitars playing a catchy melodic lead, driving live drums with crash cymbals, melodic bass, sparkling piano and string stabs. Uplifting major key, 168 BPM, youthful, emotional, a big catchy chorus, tight polished studio production, like a 2010s school-life anime opening.');
const NEG = arg('negative', 'vocals, singing, voice, speech, choir, lo-fi, ambient, slow tempo, sad, minor key, orchestral only, EDM drops, noise');

const post = (urlPath, body) => new Promise((resolve, reject) => {
  const payload = JSON.stringify(body);
  const req = https.request({ hostname: 'us-central1-aiplatform.googleapis.com', path: urlPath, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-goog-api-key': KEY } }, res => {
    let b = ''; res.on('data', d => b += d); res.on('end', () => { try { resolve({ status: res.statusCode, json: JSON.parse(b) }); } catch { reject(new Error(`HTTP ${res.statusCode}: ${b.slice(0, 300)}`)); } });
  });
  req.on('error', reject); req.setTimeout(300000, () => req.destroy(new Error('超时')));
  req.write(payload); req.end();
});

fs.mkdirSync('.generated/op_music', { recursive: true });
for (let seed = FROM; seed < FROM + N; seed++) {
  const out = `.generated/op_music/raw_${seed}.wav`;
  if (fs.existsSync(out)) { console.log(`${out} 已有`); continue; }
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await post(`/v1/projects/${PROJECT}/locations/us-central1/publishers/google/models/lyria-002:predict`, {
      instances: [{ prompt: PROMPT, negative_prompt: NEG, seed }], parameters: {}
    }).catch(e => ({ status: 0, json: { error: { message: e.message } } }));
    const p = r.json?.predictions?.[0];
    const b64 = p?.bytesBase64Encoded || p?.audioContent;
    if (b64) {
      fs.writeFileSync(out, Buffer.from(b64, 'base64'));
      fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\top_music/raw_${seed}\tlyria-002\t30s\n`);
      console.log(out);
      break;
    }
    console.log(`seed ${seed} 第 ${attempt + 1} 次失败：${r.status} ${JSON.stringify(r.json).slice(0, 200)}`);
    await new Promise(res => setTimeout(res, 30000 * (attempt + 1)));
  }
}
console.log('DONE');
