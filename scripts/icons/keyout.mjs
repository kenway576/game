// 图集切格 + 去白底（gen-emoji-icons / gen-profile-art 共用）
import sharp from 'sharp';
sharp.cache(false);

// 从格子四边往里灌水：和白底连通的近白像素变透明；描边围住的白色保留
function keyOut(data, w, h) {
  const idx = (x, y) => (y * w + x);
  const near = i => { const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]; return r > 232 && g > 232 && b > 232 && Math.max(r, g, b) - Math.min(r, g, b) < 18; };
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) { stack.push(idx(x, 0), idx(x, h - 1)); }
  for (let y = 0; y < h; y++) { stack.push(idx(0, y), idx(w - 1, y)); }
  while (stack.length) {
    const i = stack.pop();
    if (seen[i] || !near(i)) continue;
    seen[i] = 1;
    const x = i % w, y = (i - x) / w;
    if (x > 0) stack.push(i - 1); if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w); if (y < h - 1) stack.push(i + w);
  }
  // 抠掉的地方 alpha=0；紧贴着抠掉区域的那一圈半透明，边缘不发白
  for (let i = 0; i < w * h; i++) if (seen[i]) data[i * 4 + 3] = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = idx(x, y);
    if (seen[i]) continue;
    const n = seen[i - 1] + seen[i + 1] + seen[i - w] + seen[i + w];
    if (n) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      const light = Math.min(r, g, b) / 255;            // 越白的边缘像素越透明
      data[i * 4 + 3] = Math.round(255 * Math.max(0.25, 1 - light * 0.75 * n / 4));
    }
  }
  return seen;
}

// 从图集里切出一格：去白底 → 裁到内容外接框 → 补成正方形（四周留 6%）→ size×size 透明 webp
export async function cutCell(file, rect, out, size = 160) {
  const { data, info } = await sharp(file).ensureAlpha().extract(rect).raw().toBuffer({ resolveWithObject: true });
  keyOut(data, info.width, info.height);
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 24) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  if (x1 <= x0) return false;
  const side = Math.max(Math.round(Math.max(x1 - x0, y1 - y0) * 1.12), x1 - x0 + 3, y1 - y0 + 3);
  if (process.env.ICON_DEBUG) console.log('   bbox', x1 - x0, y1 - y0, 'of', info.width, info.height);
  const crop = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer();
  // 分两步：sharp 在一条管线里总是先 resize 再 composite，写在一起会拿大图往缩小的底上贴
  const square = await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: crop, gravity: 'center' }]).png().toBuffer();
  await sharp(square).resize(size, size).webp({ quality: 90, alphaQuality: 100 }).toFile(out);
  return true;
}
