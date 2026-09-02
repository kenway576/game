// ============================================================================
// 主角房间的天气 / 时段变体（图生图）
//
// 目标：**同一个房间**，只换窗外的景色和照进来的光。
// 家具、布局、镜头角度、桌上摊开的书、软木板上的地图、行李箱……全部不能动，
// 否则切换时间段时玩家会觉得自己换了个房间。
//
// 所以用图生图（把原图一起送进去）而不是纯文生图：
// 让模型改的是"这张图"，不是"照描述再画一张"。
//
// key 从 .env.local 里读（脚本自己解析，不需要 dotenv 依赖），
// 也可以直接 export GEMINI_API_KEY 覆盖。
//
// 用法：
//   node scripts/gen-room-weather.mjs              # 生成全部变体
//   node scripts/gen-room-weather.mjs night rain   # 只生成指定的
//   node scripts/gen-room-weather.mjs --list       # 看有哪些变体
// ============================================================================
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BG = path.join(ROOT, 'public', 'images', 'backgrounds');
const SOURCE = path.join(BG, 'bg_umikaze_room_201.webp');

// ---- API key：环境变量优先，其次 .env.local ----
function readKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
  if (process.env.VITE_GOOGLE_API_KEY) return process.env.VITE_GOOGLE_API_KEY;
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return '';
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?(VITE_GOOGLE_API_KEY|VITE_GEMINI_API_KEY|GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*(.+)\s*$/);
    if (m) return m[2].trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

// 每条 instruction 只描述**变化**，不重述房间——重述反而会诱导模型重画。
const VARIANTS = {
  cloudy: {
    label: '阴天',
    instruction:
      'Change ONLY the weather and lighting. Outside the window: an overcast grey sky, flat diffuse light, the sea gone steel-grey and dull, the distant hills hazy and desaturated. Inside: no sun patches on the floor or walls, soft shadowless ambient light, slightly cooler and greyer colour temperature. The bright sunlight patches on the floorboards and bed must be gone.'
  },
  sunset: {
    label: '夕阳',
    instruction:
      'Change ONLY the weather and lighting. Outside the window: a late-afternoon sunset, the sky in warm orange and pink gradients, the sea catching a bright band of golden light, hills in blue-purple silhouette, a few lit windows in the town below. Inside: long low warm orange sunlight streaming through the balcony doors, elongated shadows stretching across the floorboards, everything bathed in golden-hour amber.'
  },
  night: {
    label: '夜晚',
    instruction:
      'Change ONLY the weather and time of day to night. Outside the window: full darkness, a deep navy sky, the town below and the harbour glittering with thousands of small warm lights, the sea nearly black with reflected light, the ferris wheel and port lit up in the distance. Inside: the room is lit only by the warm pool of light from the brass desk lamp, which is now switched ON and glowing; everything away from the desk falls into cool blue shadow. No daylight anywhere.'
  },
  rain: {
    label: '雨天',
    // 从阴天那张接着改：底图已经是平光、无阳光斑，
    // 只剩"加雨"一件事要做，模型就不会顺手把整张重画一遍
    from: 'cloudy',
    instruction:
      'The room in this image is already lit for an overcast day. Add RAIN, and change nothing else. '
      + 'The rain is visible ONLY through the balcony door opening and the window panes: heavy grey rain falling against the sky, '
      + 'the sea and town veiled in rain and mist, wet glistening rooftops, water running down the glass. '
      + 'The balcony boards immediately outside the doors are wet and reflective. '
      + 'The room interior must stay EXACTLY as it is in this image - do not draw rain streaks, droplets or wet sheen over the desk, '
      + 'the walls, the bed, the bookshelf, the corkboard, the suitcase or the indoor floorboards. This is a dry room seen from inside.'
  }
};

const args = process.argv.slice(2);
if (args.includes('--list')) {
  Object.entries(VARIANTS).forEach(([k, v]) => console.log(`${k.padEnd(8)} ${v.label}`));
  process.exit(0);
}

const key = readKey();
if (!key) {
  console.error('找不到 API key。请在 .env.local 里加一行：');
  console.error('  GEMINI_API_KEY=你的key');
  console.error('或者 export GEMINI_API_KEY=... 之后再跑。');
  process.exit(1);
}
if (!fs.existsSync(SOURCE)) {
  console.error('找不到原图:', SOURCE);
  process.exit(1);
}

const wanted = args.filter(a => !a.startsWith('--'));
const targets = wanted.length ? wanted : Object.keys(VARIANTS);
for (const t of targets) {
  if (!VARIANTS[t]) { console.error('未知变体:', t, '（--list 看全部）'); process.exit(1); }
}

const readB64 = f => fs.readFileSync(f).toString('base64');
const srcB64 = readB64(SOURCE);
const variantPath = n => path.join(BG, `bg_umikaze_room_201_${n}.webp`);

// 每次都重申"别动房间"：这是整个脚本成败的关键
const KEEP = [
  'This is a background illustration for a visual novel.',
  'Keep the room EXACTLY as it is: identical camera angle and framing, identical furniture in identical positions',
  '(the wooden desk with the brass lamp and open notebook, the bookshelf, the corkboard with the map and photos,',
  'the single bed with the striped blue blanket, the open balcony doors with white curtains, the potted plant,',
  'the open suitcase on the floor, the wooden floorboards).',
  'Do not move, add, remove, or redesign any object. Do not change the art style or the line work.',
  'The result must read as the SAME room at a different time of day.'
].join(' ');

function editImage(instruction, baseB64) {
  const payload = JSON.stringify({
    contents: [{
      parts: [
        { inline_data: { mime_type: 'image/webp', data: baseB64 } },
        { text: `${KEEP}\n\n${instruction}` }
      ]
    }]
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(key),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 300)}`));
        try {
          const json = JSON.parse(body);
          const part = (json.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
          const data = part && (part.inlineData || part.inline_data);
          if (!data) return reject(new Error('返回里没有图片：' + body.slice(0, 300)));
          resolve(Buffer.from(data.data, 'base64'));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const name of targets) {
  const v = VARIANTS[name];
  const out = path.join(BG, `bg_umikaze_room_201_${name}.webp`);
  process.stdout.write(`${v.label.padEnd(4)} (${name}) ... `);
  try {
    // v.from 指定了就以那个变体为底（要求它已经生成过）
    let base = srcB64;
    if (v.from) {
      const bp = variantPath(v.from);
      if (!fs.existsSync(bp)) throw new Error(`需要先生成 ${v.from}（本变体以它为底）`);
      base = readB64(bp);
    }
    const raw = await editImage(v.instruction, base);
    // 统一转成和其它背景一致的 webp，并对齐原图尺寸
    const meta = await sharp(fs.readFileSync(SOURCE)).metadata();
    const buf = await sharp(raw)
      .resize(meta.width, meta.height, { fit: 'cover' })
      .webp({ quality: 88 })
      .toBuffer();
    fs.writeFileSync(out, buf);
    console.log(`OK  ${(buf.length / 1024).toFixed(0)} KB  → ${path.basename(out)}`);
  } catch (e) {
    console.log('失败:', e.message);
  }
  await sleep(1200); // 免费额度对速率敏感，别打太快
}

console.log('\n完成。天气变体在 public/images/backgrounds/ 下。');
