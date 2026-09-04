// ============================================================================
// 🎴 大厅选人界面的专属立绘
//
// 大厅那张卡是竖的、满高、底部对齐，用的是每个人的 neutral 立绘——
// 而那批立绘是"表情差分"用的：正面、站直、手垂着，为的是好换表情，
// 不是为了好看。选人界面是玩家每次进游戏都要看的第一屏，
// 用差分图当门面太亏了。
//
// 所以这里单出一套：每人一张，穿符合角色的衣服、给一个能立住人设的姿势，
// 画风对齐 P5X / bestdori 卡面。只给大厅用，不碰剧情里那 462 张。
//
// 【为什么是绿幕】
// 大厅卡需要透明背景。白底抠图在这个项目上翻过两次车——
// 明日香的白衬衫、深雪的米色开衫、女仆围裙，都会被"白=背景"的判据啃掉。
// 绿幕从根上避开：背景色和人身上的颜色不冲突。
// 抠图直接用现成的 scripts/key-greenscreen.mjs。
//
// 用法：
//   node scripts/gen-lobby-portraits.mjs              # 全部八个人
//   node scripts/gen-lobby-portraits.mjs asuka rei    # 只重出指定的
//   node scripts/gen-lobby-portraits.mjs --list
//
// 出到 .generated/lobby/，然后：
//   node scripts/key-greenscreen.mjs .generated/lobby -d public/images/characters/_lobby --height 1200
// ============================================================================
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, '.generated', 'lobby');

function readKey() {
  const NAMES = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'VITE_GEMINI_API_KEY', 'VITE_GOOGLE_API_KEY'];
  for (const k of NAMES) if (process.env[k]) return process.env[k];
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return '';
  const found = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const val = m[2].trim().replace(/^["']|["']$/g, '');
    if (val) found[m[1]] = val; else delete found[m[1]];
  }
  for (const k of NAMES) if (found[k]) return found[k];
  return '';
}

// 画风 + 绿幕。这一段八个人共用，改它等于改整套。
const STYLE = [
  'A single full-body anime character standing on a completely uniform flat chroma-key GREEN background (pure #00B140).',
  'Nothing else is in the image: no floor, no shadow on the background, no props on the ground, no scenery, no border.',
  'Drawn as premium gacha-game character art in the style of Persona 5: The Phantom X and Bandori card illustrations:',
  'bold clean confident line art, high-saturation limited palette, hard-edged cel shading, glossy anime finish,',
  'and an extremely detailed, beautiful face - crisp eyelash line work, sharp catchlights, clear irises, delicate brows.',
  'Full length: the whole body from the top of the head to the shoes is inside the frame, with a little green margin at every edge.',
  'Slight low camera angle so the character reads as confident and poster-like. Vertical 9:16 composition.',
  'PROPORTIONS: a realistically proportioned teenager, head about one seventh of total height, long legs, slim build.',
  'This is NOT chibi, NOT super-deformed, NOT a big-head cute style - it must stand alongside the rest of the set.',
  'RENDERING: bold confident dark outlines of even weight and hard-edged cel shadows with clear terminator lines.',
  'Do not drift into a soft pastel, thin-lined or airbrushed look.',
  'Nothing is beneath the feet: no floor, no ground, no ellipse, no contact shadow, no shadow of any kind.',
  'ABSOLUTELY NO TEXT, no letters, no logos, no watermark, no signature, no UI, no frame.'
].join(' ');

// 每个人：外形（要和现有立绘对得上）+ 衣服 + 姿势 + 表情。
// 姿势和表情是这次的重点——差分立绘全是站直手垂着，那个才是要换掉的东西。
const CAST = {
  asuka: [
    'A proud seventeen-year-old girl with very long crimson-red twin tails tied with red ribbons and sharp red eyes.',
    'She wears a crisp white school shirt with a large red bow tie, a navy pleated skirt, black knee socks and brown loafers.',
    'Pose: standing with her arms folded and her weight on one hip, chin lifted, body turned three-quarters away',
    'but her eyes cutting back to the viewer - caught between scolding you and not minding that you came.',
    'A faint blush she would deny. Confident, sharp, unmistakably the class president.'
  ].join(' '),

  hikari: [
    'A bright cheerful girl with long golden-blonde hair, one stray ahoge and warm amber eyes.',
    'She wears orange dungarees over a white tee, sleeves pushed up, colourful trainers.',
    'Pose: caught mid-stride walking toward the viewer, one arm thrown up in a big wave, the other swinging,',
    'body leaning forward, hair and straps in motion. Mouth wide open in a laugh, eyes squeezed happy.',
    'Pure forward momentum - she is about to talk at you whether you are ready or not.'
  ].join(' '),

  rei: [
    'A quiet girl with pale ice-blue chin-length hair, thin round glasses and pale grey-blue eyes.',
    'She wears a navy blazer over a white shirt with a green ribbon, a green plaid skirt, black tights and loafers.',
    'Pose: standing very straight and still, a thick hardback book held against her chest with both arms,',
    'her free hand raised to push her glasses up one finger at the bridge - the glasses catching a flash of light.',
    'Expression completely neutral, looking directly and unblinkingly at the viewer. Composed, contained, slightly uncanny.'
  ].join(' '),

  inari: [
    'A fox deity with very long BRIGHT ORANGE hair (never white, never silver), golden eyes with slit pupils,',
    'orange fox ears and several large orange-and-white fox tails fanned out behind her.',
    'She wears an ornate vivid teal and gold kimono patterned with white cranes, a red and gold obi, and geta.',
    'Pose: standing with her weight back and her chin slightly down, a gold folding fan half open covering the lower',
    'half of her face so only her eyes show, which are amused and far too knowing. Tails spread wide.',
    'Pale blue fox-fire floats around her and lights her from below. Ancient, playful, entirely in control.'
  ].join(' '),

  miyuki: [
    'A graceful young woman of about twenty-four with very long straight silver-white hair and gentle grey eyes,',
    'a smooth youthful face with no wrinkles and no heavy makeup.',
    'She wears a soft cream cardigan over a simple top, a long dark skirt, and house slippers.',
    'Pose: standing with her head tilted a little to one side, holding a steaming mug in both hands at chest height,',
    'shoulders relaxed, a small warm smile aimed straight at the viewer, as if she has been waiting a while and does not mind.',
    'Calm, unhurried, the older neighbour who always has something on the stove.'
  ].join(' '),

  sora: [
    'A tall athletic seventeen-year-old JAPANESE SCHOOLGIRL who plays basketball, long-limbed and slim.',
    'Unmistakably feminine but not childish: a soft jawline, bright eyes with long lashes, delicate brows',
    '- with short tousled brown hair in a boyish cut',
    // 上一版写的是 LIGHT SUN-TANNED，模型给出来的还是偏深的小麦色，
    // 和其余七个人不在一个色阶上。这里改成明确的"浅"，
    // 并且直接给出参照：和同一批里其他女生同一个肤色。
    'and a FAIR, LIGHT skin tone - the same fair complexion as the other girls in this set,'
    + ' with at most a very faint healthy warmth; NOT tanned, NOT bronzed, NOT olive, NOT dark-skinned.',
    'She wears an orange basketball jersey and shorts, wristband, and high-top trainers.',
    'Pose: a basketball spinning on one raised index finger, her other hand on her hip, weight on one leg,',
    'leaning slightly toward the viewer with a huge open confident grin, eyebrows up in a challenge.',
    'She reads as a cheerful sporty schoolgirl, never as a boy.',
    // 身份锁：上一版模型把她的瞳色改成了蓝色、还在球衣上印了 ACE。
    // 瞳色和号码是她和立绘之间唯一的对得上的凭据，必须写死。
    'HER EYES MUST BE WARM AMBER-BROWN, never blue, never green.',
    'Her jersey is plain: the only marking is the number 67. No words, no lettering, no team name anywhere on it.'
  ].join(' '),

  nao: [
    'A girl with warm brown hair in a ponytail tied with a small ribbon, and warm brown eyes.',
    'She wears a navy school blazer over a white shirt with a red ribbon tie, a plaid skirt, loafers, a shoulder bag.',
    'Pose: leaning forward toward the viewer from the waist with both hands clasped behind her back,',
    'ponytail swinging, head tipped to one side, looking up at the viewer with a warm teasing smile',
    'and one eyebrow slightly raised - the look of someone who has known you far too long to be impressed.'
  ].join(' '),

  maki: [
    'A fifteen-year-old pink-haired girl - the youngest of the cast, so slightly shorter than the others,',
    'but drawn with the same realistic teenage proportions, NOT chibi - with a side ponytail,',
    'a black cat-ear headband and large pink headphones round her neck.',
    'She wears an open denim vest over a purple tee, white shorts, black thigh-high socks and pink trainers.',
    'Pose: standing with one hip pushed out, both hands shoved in her vest pockets, shoulders raised,',
    'chin down and eyes up at the viewer in a sideways smug look, one corner of her mouth curled.',
    'Small, cocky, entirely aware of how annoying she is being.'
  ].join(' ')
};

const args = process.argv.slice(2);
if (args.includes('--list')) { Object.keys(CAST).forEach(k => console.log(k)); process.exit(0); }

const key = readKey();
if (!key) { console.error('缺 API key：写进项目根目录的 .env.local'); process.exit(1); }

function post(payload) {
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
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 250)}`));
        const json = JSON.parse(body);
        const part = (json.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
        const d = part && (part.inlineData || part.inline_data);
        if (!d) return reject(new Error('返回里没有图片'));
        resolve(Buffer.from(d.data, 'base64'));
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const wanted = args.filter(a => !a.startsWith('--'));
const targets = wanted.length ? wanted : Object.keys(CAST);
for (const t of targets) if (!CAST[t]) { console.error('未知角色:', t); process.exit(1); }
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const name of targets) {
  process.stdout.write(`${name.padEnd(8)} ... `);
  try {
    const raw = await post(JSON.stringify({
      contents: [{ parts: [{ text: `${STYLE}\n\n${CAST[name]}` }] }],
      generationConfig: { imageConfig: { aspectRatio: '9:16' } }
    }));
    const out = path.join(OUT_DIR, `${name}.png`);
    await sharp(raw).png().toFile(out);
    const m = await sharp(raw).metadata();
    console.log(`OK ${m.width}x${m.height}`);
  } catch (e) { console.log('失败:', e.message); }
  await new Promise(r => setTimeout(r, 1500));
}

console.log(`\n出到 ${path.relative(ROOT, OUT_DIR)}/`);
console.log('抠像：node scripts/key-greenscreen.mjs .generated/lobby -d public/images/characters/_lobby --height 1200');
