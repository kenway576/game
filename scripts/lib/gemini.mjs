// ---------------------------------------------------------
// 🔌 生图脚本共用的 Gemini 调用
//
// 两种 Key 都认：
//   · Vertex AI（Google Cloud）的 Key，形如 AQ.xxxx → aiplatform.googleapis.com
//   · AI Studio 的 Key，形如 AIzaxxxx            → generativelanguage.googleapis.com
// 用哪个看 GEMINI_BACKEND（vertex / studio），不写就按 Key 的样子猜。
//
// Key 从环境变量读，没有的话读项目根目录的 .env.local（已在 .gitignore 里）。
// Key 一律放请求头，不拼进网址——网址会进日志。
//
// 默认模型 gemini-3-pro-image（Nano Banana Pro）。整个立绘重制项目只用这一个，
// 混用 Flash 版是旧立绘画风不统一的原因之一。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const loadEnvLocal = () => {
  const f = path.join(ROOT, '.env.local');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
};
loadEnvLocal();

export const DEFAULT_IMAGE_MODEL = 'gemini-3-pro-image';

const keyAndBackend = () => {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('没有 GEMINI_API_KEY（环境变量或 .env.local）');
  const backend = process.env.GEMINI_BACKEND || (key.startsWith('AIza') ? 'studio' : 'vertex');
  // 用户走 Google Cloud 赠金，必须是 Vertex AI。.env.local 里写了 GEMINI_REQUIRE_VERTEX=1
  // 就把这条锁死：配置不对宁可报错，也不能悄悄发到 AI Studio 去另外计费。
  if (process.env.GEMINI_REQUIRE_VERTEX === '1' && backend !== 'vertex') {
    throw new Error(`要求走 Vertex AI，但当前配置是 ${backend}。检查 .env.local 的 GEMINI_BACKEND`);
  }
  return { key, backend };
};

const post = (hostname, urlPath, key, payload) => new Promise((resolve, reject) => {
  const req = https.request({
    hostname, path: urlPath, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-goog-api-key': key }
  }, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 400)}`)); }
    });
  });
  req.on('error', reject);
  req.setTimeout(300000, () => req.destroy(new Error('请求超时（5 分钟）')));
  req.write(payload);
  req.end();
});

export const imagePart = (file) => {
  const ext = path.extname(file).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  return { inlineData: { mimeType, data: fs.readFileSync(file).toString('base64') } };
};

// parts: [{ text }, imagePart(...)]。返回 { images: Buffer[], text, usage, raw }
export const generate = async ({ parts, model = DEFAULT_IMAGE_MODEL, aspectRatio, imageSize, textOnly = false }) => {
  const { key, backend } = keyAndBackend();
  const generationConfig = textOnly ? {} : { responseModalities: ['TEXT', 'IMAGE'] };
  if (aspectRatio || imageSize) {
    generationConfig.imageConfig = {};
    if (aspectRatio) generationConfig.imageConfig.aspectRatio = aspectRatio;
    if (imageSize) generationConfig.imageConfig.imageSize = imageSize;
  }
  const payload = JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig });
  // 不写项目的话 Vertex 按就近原则分到某个区域（实测是 asia-southeast1），那里画图模型很容易 429。
  // 写了 GEMINI_VERTEX_PROJECT 就走 global 端点（或 GEMINI_VERTEX_LOCATION 指定的区域），容量大得多
  const proj = process.env.GEMINI_VERTEX_PROJECT;
  const vertexPath = proj
    ? `/v1/projects/${proj}/locations/${process.env.GEMINI_VERTEX_LOCATION || 'global'}/publishers/google/models/${model}:generateContent`
    : `/v1/publishers/google/models/${model}:generateContent`;
  const call = () => backend === 'vertex'
    ? post('aiplatform.googleapis.com', vertexPath, key, payload)
    : post('generativelanguage.googleapis.com', `/v1beta/models/${model}:generateContent`, key, payload);
  // 429 = 每分钟的配额满了（Vertex 的画图模型限速比较紧），等一会儿再试；被拒的请求不收费
  let j = await call();
  // 批量跑的时候几路并发一起抢每分钟的额度，多等几轮总能排上
  for (const wait of [30, 60, 90, 120, 180, 240, 300, 300, 300]) {
    if (j.error?.code !== 429) break;
    console.log(`[gemini] 429 配额暂满，${wait} 秒后重试…`);
    await new Promise(r => setTimeout(r, wait * 1000));
    j = await call();
  }
  if (j.error) throw new Error(`${j.error.code} ${j.error.status}: ${j.error.message}`);
  // usageMetadata.trafficType 只有 Vertex AI 会返回：拿它当"这次确实走了 Vertex"的回执
  const via = backend === 'vertex' ? `Vertex AI（aiplatform.googleapis.com, trafficType=${j.usageMetadata?.trafficType ?? '缺失!'}）` : 'AI Studio';
  console.log(`[gemini] ${model} via ${via}`);
  if (backend === 'vertex' && !j.usageMetadata?.trafficType) console.warn('[gemini] ⚠️ 返回里没有 trafficType，确认一下是不是真的走了 Vertex');
  const out = j.candidates?.[0]?.content?.parts || [];
  const images = out.filter(p => p.inlineData || p.inline_data)
    .map(p => Buffer.from((p.inlineData || p.inline_data).data, 'base64'));
  const text = out.filter(p => p.text).map(p => p.text).join('\n');
  return { images, text, usage: j.usageMetadata, finishReason: j.candidates?.[0]?.finishReason, raw: j };
};
