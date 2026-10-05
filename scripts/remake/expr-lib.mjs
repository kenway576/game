// ---------------------------------------------------------
// 🙂 换表情：共用的提示词和"把新脸贴回去"
// outfit-pipeline.mjs（新衣服）和 redo-expression.mjs（修已经装好的图）都用这里
// ---------------------------------------------------------
import sharp from 'sharp';
import { gray } from './blink-lib.mjs';

export const emotionText = (neutralFace) => ({
  neutral:   neutralFace,
  happy:     'a bright, genuinely happy smile: eyes curved warmly with joy but still open, cheeks lifted, mouth open in a cheerful smile showing a little of the upper teeth',
  angry:     'visibly angry: eyebrows sharply furrowed down toward the nose, eyes narrowed in a glare, mouth in a tight scowl showing clenched teeth, a faint flush on the cheeks',
  sad:       'clearly sad and about to cry: inner ends of the eyebrows raised in a worried slant, eyes glistening with welling tears, gaze slightly lowered, corners of the mouth turned down',
  shy:       'bashful and flustered: a strong pink blush across both cheeks and the nose, eyes glancing away to the side, mouth in a small embarrassed wavy line',
  surprised: 'startled surprise: BOTH eyes equally wide open with small pupils, eyebrows raised high, mouth open in a small round "o"',
  smug:      'smug and teasing: one eyebrow slightly raised, eyes half-lidded with confidence, a small crooked smirk',
  pout:      'a sulky tsundere pout: cheeks slightly puffed, eyebrows drawn together, eyes looking away to the side, lips pushed into a small pout, light blush',
  smile:     'a soft, gentle closed-mouth smile: relaxed eyebrows, warm kind eyes, corners of the mouth gently lifted',
  thinking:  'thoughtful and pondering: eyes glancing up to the side, one eyebrow slightly raised, lips pressed together in concentration',
  lecturing: 'explaining something with quiet confidence: eyebrows slightly raised, eyes focused and bright, mouth open mid-sentence',
  curious:   'curious and interested: eyes bright and wide with attention, eyebrows raised a little, mouth in a small open "oh"',
  laugh:     'laughing out loud: both eyes squeezed shut into matching happy upward arcs, mouth wide open in laughter, cheeks flushed',
  love:      'lovestruck and affectionate: a soft warm blush, eyes gentle and half-lidded looking at the viewer, a tender shy smile',
  jealous:   'jealous and sulky: eyes narrowed and glancing sideways, eyebrows drawn down, a small displeased frown, faint blush',
  sly:       'sly and knowing: eyes narrowed playfully, a mischievous sidelong glance, a small sly smile curling one corner of the mouth',
  cool:      'cool and confident: eyes calm and half-lidded, eyebrows relaxed, a small self-assured smirk'
});

export const exprPrompt = (text) => `This is a close-up crop of the head of a finished anime character illustration. Return the SAME image with ONE change.

THE CHANGE: change ONLY her facial expression to ${text}.

Both eyes must match each other: the same size, the same openness and the same style. The mouth is cleanly drawn with crisp lines.
Everything else must stay exactly the same: identical framing and crop, identical head position, angle and size, every strand of hair in the same place, the same hair accessories and clothes, the same art style, line quality and colouring, the same flat grey background. Do not move, redraw or restyle anything outside the eyebrows, eyes, mouth and cheeks. Eye colour stays the same. No sparkles, no effects, no symbols.`;

// 把模型改好的脸贴回去。
// 以前只贴一个脸部椭圆：眼睛的外眼角正好落在椭圆羽化的边上，新旧两只眼叠在一起——
// 笑眯眼、smug 的半睁眼最明显（一只眼闭上了、外侧还露着半只睁开的睫毛）。
// 现在贴"真的变了的地方"：脸部 1.45 倍椭圆里、新旧图差得多的像素，往外扩一圈再羽化；
// 核心的 0.85 倍椭圆总是贴。椭圆外一律不碰，头发、轮廓、透明度都跟原图一样。
//   cut: 原图 RGBA（W×H）  region: 裁切方块  ref/edit: 方块里的 RGB（FR×FR，ref 是原图铺灰底）
//   a: 对齐位移 {dx,dy}  ell: 方块里的脸椭圆 {cx,cy,rx,ry}
export const pasteFace = async ({ cut, W, H, region, FR, ref, edit, a, ell }) => {
  const inE = (x, y, k) => ((x - ell.cx) / (ell.rx * k)) ** 2 + ((y - ell.cy) / (ell.ry * k)) ** 2 < 1;
  const m = new Uint8Array(FR * FR);
  for (let y = 0; y < FR; y++) for (let x = 0; x < FR; x++) {
    if (!inE(x, y, 1.45)) continue;
    if (inE(x, y, 0.85)) { m[y * FR + x] = 255; continue; }
    const ex = x + a.dx, ey = y + a.dy;
    if (ex < 0 || ey < 0 || ex >= FR || ey >= FR) continue;
    if (Math.abs(gray(ref, y * FR + x) - gray(edit, ey * FR + ex)) > 28) m[y * FR + x] = 255;
  }
  // 扩一圈（方块的 2%）再羽化（σ ≈ 方块的 0.8%），在 1.45 倍椭圆边上收住
  const R = Math.max(2, Math.round(FR * 0.02));
  const dil = new Uint8Array(FR * FR);
  const rowMax = new Uint8Array(FR * FR);
  for (let y = 0; y < FR; y++) for (let x = 0; x < FR; x++) { let v = 0; for (let k = -R; k <= R && !v; k++) { const xx = x + k; if (xx >= 0 && xx < FR && m[y * FR + xx]) v = 255; } rowMax[y * FR + x] = v; }
  for (let y = 0; y < FR; y++) for (let x = 0; x < FR; x++) { let v = 0; for (let k = -R; k <= R && !v; k++) { const yy = y + k; if (yy >= 0 && yy < FR && rowMax[yy * FR + x]) v = 255; } dil[y * FR + x] = v; }
  const soft = await sharp(Buffer.from(dil), { raw: { width: FR, height: FR, channels: 1 } }).blur(Math.max(1, FR * 0.008)).extractChannel(0).raw().toBuffer();
  const out = Buffer.from(cut);
  for (let y = 0; y < FR; y++) for (let x = 0; x < FR; x++) {
    let w = soft[y * FR + x] / 255;
    // 1.45 倍椭圆外沿再渐隐一下，保证不碰到外面
    const e = Math.sqrt(((x - ell.cx) / ell.rx) ** 2 + ((y - ell.cy) / ell.ry) ** 2);
    if (e > 1.3) w *= Math.max(0, (1.45 - e) / 0.15);
    if (w <= 0.003) continue;
    const ex = x + a.dx, ey = y + a.dy;
    if (ex < 0 || ey < 0 || ex >= FR || ey >= FR) continue;
    const gx = x + region.left, gy = y + region.top;
    if (gx < 0 || gy < 0 || gx >= W || gy >= H) continue;
    const p = gy * W + gx, q = ey * FR + ex;
    if (cut[p * 4 + 3] < 250) continue;
    for (let k = 0; k < 3; k++) out[p * 4 + k] = Math.round(cut[p * 4 + k] * (1 - w) + edit[q * 3 + k] * w);
  }
  return out;
};

// 眼睛是睁着的吗（笑眯眼、大笑是闭着的，这种不做眨眼）。eyeCrop：眼睛那一块的图片文件
export const eyesOpen = async (generate, imagePart, eyeCrop) => {
  const r = await generate({ model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(eyeCrop), { text: 'Look at the eyes of this anime character. Answer with exactly one word: "open" if the irises/pupils are visible (including half-lidded or narrowed eyes), or "closed" if both eyes are shut (closed eyelid lines or happy upward arcs, no iris visible).' }] });
  return !/closed/i.test(r.text || '');
};
