// 探一下 Vertex 上有哪些音乐模型能用（只发一个最小请求看返回码；404 = 没有这个模型，不计费）
import https from 'https';
const KEY = process.env.GEMINI_API_KEY;
const PROJECT = process.env.GEMINI_VERTEX_PROJECT || '389812341416';
const head = (path, body) => new Promise(res => {
  const payload = JSON.stringify(body);
  const req = https.request({ hostname: 'us-central1-aiplatform.googleapis.com', path, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-goog-api-key': KEY } }, r => {
    let b = ''; r.on('data', d => b += d); r.on('end', () => res({ status: r.statusCode, body: b.slice(0, 220) }));
  });
  req.on('error', e => res({ status: 0, body: e.message })); req.write(payload); req.end();
});
// 故意发一个缺字段的请求：模型存在会回 400（参数错），不存在回 404，两种都不会真的生成
for (const m of (process.argv[2] || 'lyria-002,lyria-003,lyria-3,lyria-3-preview,lyria-realtime-exp,lyria-2').split(',')) {
  const r = await head(`/v1/projects/${PROJECT}/locations/us-central1/publishers/google/models/${m}:predict`, { instances: [{}], parameters: {} });
  console.log(m.padEnd(22), r.status, r.body.replace(/\s+/g, ' '));
}
