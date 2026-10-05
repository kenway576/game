// ---------------------------------------------------------
// 👁 眨眼过渡帧：共用的几样工具（blink-installed.mjs 用）
// outfit-pipeline.mjs 里有同一套逻辑，改一边记得看另一边。
// ---------------------------------------------------------
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';

export const gray = (buf, p) => buf[p * 3] * 0.3 + buf[p * 3 + 1] * 0.59 + buf[p * 3 + 2] * 0.11;

// ref、edit 都是 S×S 的 RGB；只比较 sampleMask 为真的点，找最佳平移
export const align = (ref, edit, S, sampleMask) => {
  const samples = [];
  for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2) if (sampleMask(x, y)) samples.push([x, y]);
  const score = (dx, dy) => {
    let s = 0;
    for (const [x, y] of samples) {
      const ex = x + dx, ey = y + dy;
      if (ex < 0 || ey < 0 || ex >= S || ey >= S) { s += 255; continue; }
      s += Math.abs(gray(ref, y * S + x) - gray(edit, ey * S + ex));
    }
    return s / samples.length;
  };
  let best = { dx: 0, dy: 0, s: score(0, 0) };
  const s0 = best.s;
  for (const step of [4, 1]) {
    const c = { ...best };
    const range = step === 4 ? 24 : 4;
    for (let dy = c.dy - range; dy <= c.dy + range; dy += step)
      for (let dx = c.dx - range; dx <= c.dx + range; dx += step) {
        const s = score(dx, dy);
        if (s < best.s) best = { dx, dy, s };
      }
  }
  return { ...best, s0 };
};

export const parseBoxes = text => {
  const m = text.replace(/```json|```/g, '').match(/[[{][\s\S]*[\]}]/);
  if (!m) return [];
  let j; try { j = JSON.parse(m[0]); } catch {
    // 模型偶尔漏个括号（"box_2d": [1, 2, 3, 4}）：按 { 切开，每块里找 label 和四个数
    return m[0].split('{').map(chunk => {
      const label = chunk.match(/"label"\s*:\s*"([^"]+)"/)?.[1];
      const nums = chunk.match(/"box_2d"\s*:\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
      return nums ? { label, box_2d: nums.slice(1, 5).map(Number) } : null;
    }).filter(Boolean);
  }
  const out = [];
  const walk = v => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { if (Array.isArray(v.box_2d) && v.box_2d.length === 4) out.push(v); else Object.values(v).forEach(walk); } };
  walk(j);
  return out;
};

export const BLINK_TEXT = {
  half: 'her eyes HALF CLOSED, as in the middle of a natural blink: the upper eyelids lowered to cover the top half of each iris, the lash line lowered with it, the lower half of the iris still visible. Keep the eyebrows exactly as they are',
  closed: 'her eyes GENTLY CLOSED, as at the bottom of a natural blink: each eye is a soft closed eyelid line with the lashes pointing down, the same width as the open eye and at the height of the lower lash line. Keep the eyebrows exactly as they are'
};
export const blinkPrompt = k => `This is a close-up crop of the eyes of a finished anime character illustration. Return the SAME image with ONE change.

THE CHANGE: draw ${BLINK_TEXT[k]}.

Everything else stays exactly the same: identical framing and crop, the same eyebrows, bangs, hair strands, glasses, blush, mouth, skin, art style, line quality and colouring. Do not move or redraw anything except the eyes themselves.`;

// 标两只眼睛（放大图上标，准）。返回 crop 像素坐标的 [{cx,cy,w,h}]，按 x 排好
export const detectEyes = async (cropFile, S, onCost) => {
  const small = cropFile.replace(/\.png$/, '_det.png');
  await sharp(cropFile).resize(1024, 1024).png().toFile(small);
  const r = await generate({ model: 'gemini-3-flash-preview', textOnly: true, parts: [imagePart(small), { text: 'This is a close-up of an anime character face. Return ONLY a JSON array of {"label": string, "box_2d": [ymin, xmin, ymax, xmax]} normalized to 0-1000 for exactly two labels: "eye_a" and "eye_b" (the two eyes; each box tightly encloses the whole eye: upper lash line, lower lash line, inner and outer corners, including any eyelashes, but not the eyebrow and not the glasses frame). eye_a is the one on the left of the image.' }] });
  onCost?.('detect-eyes', 'gemini-3-flash-preview', '-');
  const eb = parseBoxes(r.text);
  if (eb.length !== 2) throw new Error('标眼睛没标出两只：' + r.text.slice(0, 200));
  return eb.map(d => {
    const [y0, x0, y1, x1] = d.box_2d.map(v => v / 1000 * S);
    return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
  }).sort((a, b) => a.cx - b.cx);
};

// 半闭眼：把睁眼图里的眼睛往下眼睑压扁（上眼皮下来一半），上面那一小条皮肤拉下来补。
// 跟 PuppetSprite 着色器里的 blinkEye 同一个算法，只是在这里先算好存成一帧——
// 模型画"半闭"很不稳（常常画成全闭或者还睁着），压扁出来的一定是真正的中间态。
// rgba：整张图（W×H×4），eyes：[{cx,cy,w,h}]（整张图的像素坐标），只改 rect 范围内
export const squashEyes = (rgba, W, H, eyes, amount, rect) => {
  const out = Buffer.from(rgba);
  const [rx0, ry0, rw, rh] = rect;
  const sample = (x, y, c) => {
    const x0 = Math.max(0, Math.min(W - 1, Math.floor(x))), y0 = Math.max(0, Math.min(H - 1, Math.floor(y)));
    const x1 = Math.min(W - 1, x0 + 1), y1 = Math.min(H - 1, y0 + 1), fx = x - x0, fy = y - y0;
    const g = (xx, yy) => rgba[(yy * W + xx) * 4 + c];
    return g(x0, y0) * (1 - fx) * (1 - fy) + g(x1, y0) * fx * (1 - fy) + g(x0, y1) * (1 - fx) * fy + g(x1, y1) * fx * fy;
  };
  for (let y = ry0; y < ry0 + rh; y++) for (let x = rx0; x < rx0 + rw; x++) {
    let sy = y;
    for (const e of eyes) {
      const r = { x: e.w / 2, y: e.h / 2 };
      const u = (x - e.cx) / (r.x * 1.25);
      const a = Math.abs(u);
      if (a >= 1) continue;
      const t = Math.min(1, Math.max(0, (a - 0.7) / 0.3));
      const amt = amount * (1 - t * t * (3 - 2 * t));
      if (amt <= 0.001) continue;
      const k = 1 - 0.9 * amt, piv = e.cy + 0.5 * r.y, dy = y - piv;
      const R = dy < 0 ? piv - (e.cy - 1.0 * r.y) : (e.cy + 1.0 * r.y) - piv;
      const m = 0.45, ad = Math.abs(dy);
      let s;
      if (ad <= R * k) s = ad / k;
      else if (ad <= R * (1 + m)) s = R + (ad - R * k) * (R * m) / (R * (1 + m) - R * k);
      else continue;
      sy = piv + Math.sign(dy) * s;
      break;
    }
    if (sy === y) continue;
    const p = (y * W + x) * 4;
    for (let c = 0; c < 4; c++) out[p + c] = Math.round(sample(x, sy, c));
  }
  return out;
};

// 眼睛椭圆遮罩（羽化）：盖住上下眼睑和睫毛
export const ellipseSize = () => ({ kx: 0.68, ky: 0.9 });
// 戴眼镜的角色：不做半闭帧（压扁会把镜片里的东西一起拉弯），睁 → 全闭 → 睁
export const GLASSES_CHARS = ['rei'];
// 戴眼镜的角色：镜框像素一律保留原图——模型重画的镜框总会挪一点，叠上去就是重影；
// 压扁半闭帧时镜框也不能跟着弯。按颜色认镜框（玲是红框）。
const FRAME_TEST = { rei: (r, g, b) => r > 110 && r - g > 70 && r > g * 1.7 && r > b * 1.5 };
// 模型那张图里"是镜框颜色"的像素：它把镜框画歪了的地方，贴上去就是第二副镜框
export const isFrameColor = (char, r, g, b) => !!FRAME_TEST[char]?.(r, g, b);
// 返回 Uint8Array(W*H)，1 = 镜框（往外扩 2 像素）。没有眼镜的角色返回 null。只扫 rect 范围
export const frameMask = (char, rgba, W, H, rect, channels = 4) => {
  const test = FRAME_TEST[char];
  if (!test) return null;
  const [x0, y0, w, h] = rect;
  const m = new Uint8Array(W * H);
  for (let y = Math.max(0, y0 - 2); y < Math.min(H, y0 + h + 2); y++) for (let x = Math.max(0, x0 - 2); x < Math.min(W, x0 + w + 2); x++) {
    const p = (y * W + x) * channels;
    if (!test(rgba[p], rgba[p + 1], rgba[p + 2])) continue;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < W && yy < H) m[yy * W + xx] = 1;
    }
  }
  return m;
};
export const eyeEllipses = (eyes, char) => { const { kx, ky } = ellipseSize(char); return eyes.map(e => ({ x: e.cx, y: e.cy + e.h * 0.05, rx: e.w * kx, ry: e.h * ky })); };
export const ellDist = (ells, x, y) => Math.min(...ells.map(e => Math.hypot((x - e.x) / e.rx, (y - e.y) / e.ry)));
