const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('.incoming-gdrive');
const charDir = path.resolve('public/images/characters');
const distCharDir = path.resolve('dist/images/characters');
const backupDir = path.resolve('.backup-originals/characters');

[charDir, distCharDir, backupDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const memeList = [
  {
    src: '1788486858453.jpg',
    target: 'easter_anya.webp',
    name: '阿尼亚 (Anya Forger - SPY×FAMILY)'
  },
  {
    src: '1788486904668.jpg',
    target: 'easter_aqua.webp',
    name: '阿克娅 (Aqua - KonoSuba)'
  },
  {
    src: '1788486949563.jpg',
    target: 'easter_kira.webp',
    name: '吉良吉影 (Yoshikage Kira - JoJo Part 4)'
  },
  {
    src: '1788487062281.jpg',
    target: 'easter_chika.webp',
    name: '藤原千花 (Chika Fujiwara - Kaguya-sama)'
  },
  {
    src: '1788487103715.jpg',
    target: 'easter_jotaro.webp',
    name: '空条承太郎 (Jotaro Kujo - JoJo Part 4)'
  },
  {
    src: '1788487184418.jpg',
    target: 'easter_hayasaka.webp',
    name: '早坂爱 (Ai Hayasaka - Kaguya-sama)'
  },
  {
    src: '1788487253365.jpg',
    target: 'easter_sakamoto.webp',
    name: '坂本 (Sakamoto - Sakamoto desu ga?)'
  },
  {
    src: '1788487302479.jpg',
    target: 'easter_mao.webp',
    name: '刘昴星 (Mao - Cooking Master Boy)'
  }
];

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const sat = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

async function cleanSprite(item) {
  const srcPath = path.join(srcDir, item.src);
  const src = fs.readFileSync(srcPath);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;

  // Sample corner background color
  const sampleCorners = [
    0, 1, 2, W - 1, W - 2, W - 3,
    (H - 1) * W, (H - 1) * W + 1, (H - 1) * W + W - 1
  ];
  let bgR = 0, bgG = 0, bgB = 0;
  for (const idx of sampleCorners) {
    bgR += data[idx * 4];
    bgG += data[idx * 4 + 1];
    bgB += data[idx * 4 + 2];
  }
  bgR /= sampleCorners.length;
  bgG /= sampleCorners.length;
  bgB /= sampleCorners.length;
  const bgL = lum(bgR, bgG, bgB);

  const bg = new Uint8Array(N);
  const L = p => { const i = p * 4; return lum(data[i], data[i+1], data[i+2]); };
  const S = p => { const i = p * 4; return sat(data[i], data[i+1], data[i+2]); };

  const nbrs = p => {
    const x = p % W, y = Math.floor(p / W);
    const out = [];
    if (x + 1 < W) out.push(p + 1);
    if (x > 0) out.push(p - 1);
    if (y + 1 < H) out.push(p + W);
    if (y > 0) out.push(p - W);
    return out;
  };

  const isBgSeed = p => {
    const i = p * 4;
    const r = data[i], g = data[i+1], b = data[i+2];
    const dR = Math.abs(r - bgR), dG = Math.abs(g - bgG), dB = Math.abs(b - bgB);
    const s = S(p);

    if (dR <= 20 && dG <= 20 && dB <= 20 && s <= 18) return true;
    if (bgL >= 240 && L(p) >= 242 && s <= 15) return true;
    return false;
  };

  const stack = [];
  const push = p => {
    if (!bg[p] && isBgSeed(p)) {
      bg[p] = 1;
      stack.push(p);
    }
  };

  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }

  while (stack.length > 0) {
    const p = stack.pop();
    for (const q of nbrs(p)) {
      push(q);
    }
  }

  // 2. Enclosed background pockets
  const isPocketCandidate = p => {
    if (bg[p]) return false;
    const i = p * 4;
    const r = data[i], g = data[i+1], b = data[i+2];
    const dR = Math.abs(r - bgR), dG = Math.abs(g - bgG), dB = Math.abs(b - bgB);
    return dR <= 15 && dG <= 15 && dB <= 15 && S(p) <= 12;
  };

  const seen = new Uint8Array(N);
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || !isPocketCandidate(p0)) continue;
    const st = [p0];
    seen[p0] = 1;
    const cells = [];
    while (st.length) {
      const p = st.pop();
      cells.push(p);
      for (const q of nbrs(p)) {
        if (!seen[q] && isPocketCandidate(q)) {
          seen[q] = 1;
          st.push(q);
        }
      }
    }

    if (cells.length >= 40 && cells.length <= N * 0.15) {
      let pureCount = 0;
      for (const p of cells) {
        const i = p * 4;
        if (Math.abs(data[i] - bgR) <= 6 && Math.abs(data[i+1] - bgG) <= 6 && Math.abs(data[i+2] - bgB) <= 6) {
          pureCount++;
        }
      }
      if (pureCount / cells.length >= 0.70) {
        for (const p of cells) bg[p] = 1;
      }
    }
  }

  // 3. Distance transform for defringing (feathering & un-premultiply)
  const FEATHER = 4;
  const dist = new Int16Array(N).fill(-1);
  let frontier = [];

  for (let p = 0; p < N; p++) {
    if (!bg[p]) continue;
    for (const q of nbrs(p)) {
      if (!bg[q] && dist[q] === -1) {
        dist[q] = 1;
        frontier.push(q);
      }
    }
  }

  for (let d = 2; d <= FEATHER && frontier.length; d++) {
    const next = [];
    for (const p of frontier) {
      for (const q of nbrs(p)) {
        if (!bg[q] && dist[q] === -1) {
          dist[q] = d;
          next.push(q);
        }
      }
    }
    frontier = next;
  }

  // 4. Output buffer with defringing
  const out = Buffer.alloc(N * 4);
  let minX = W, maxX = 0, minY = H, maxY = 0;

  for (let p = 0; p < N; p++) {
    const i = p * 4;
    if (bg[p]) {
      out[i + 3] = 0;
      continue;
    }

    let r = data[i], g = data[i + 1], b = data[i + 2], a = 255;
    const d = dist[p];

    if (d > 0) {
      const l = lum(r, g, b);
      const s = S(p);
      const dR = Math.abs(r - bgR), dG = Math.abs(g - bgG), dB = Math.abs(b - bgB);

      if ((bgL >= 235 && l >= 175) || (bgL < 235 && dR < 40 && dG < 40 && dB < 40 && s < 20)) {
        const bgDiff = Math.sqrt(dR*dR + dG*dG + dB*dB);
        const whiteness = Math.max(0, 1 - bgDiff / 70);
        const nearness = (FEATHER - d + 1) / FEATHER;
        const alpha = Math.max(0, 1 - whiteness * nearness * 0.95);

        if (alpha < 0.08) {
          out[i + 3] = 0;
          continue;
        }

        const un = (c, bgC) => Math.max(0, Math.min(255, Math.round((c - (1 - alpha) * bgC) / alpha)));
        r = un(r, bgR);
        g = un(g, bgG);
        b = un(b, bgB);
        a = Math.round(255 * alpha);
      }
    }

    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = a;

    if (a > 20) {
      const x = p % W, y = Math.floor(p / W);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  // Bounding box with 16px padding
  const pad = 16;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(W - cropX, maxX - minX + pad * 2);
  const cropH = Math.min(H - cropY, maxY - minY + pad * 2);

  const cropped = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .resize({ height: 1024, fit: 'inside' })
    .webp({ quality: 95, alphaQuality: 100 })
    .toBuffer();

  return cropped;
}

async function run() {
  const previewComposites = [];
  const cellW = 240, cellH = 460;
  const cols = 4, rows = 2;
  const totalW = cols * cellW, totalH = rows * (cellH + 30);

  for (let idx = 0; idx < memeList.length; idx++) {
    const item = memeList[idx];
    console.log(`Processing [${idx + 1}/${memeList.length}] ${item.target} (${item.name}) ...`);
    const webpBuf = await cleanSprite(item);

    // Save to public and dist
    fs.writeFileSync(path.join(charDir, item.target), webpBuf);
    fs.writeFileSync(path.join(distCharDir, item.target), webpBuf);

    // Backup original
    fs.copyFileSync(path.join(srcDir, item.src), path.join(backupDir, item.src));

    // Prepare preview cell on dark background
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const left = col * cellW;
    const top = row * (cellH + 30);

    const cellResized = await sharp(webpBuf)
      .resize(cellW - 20, cellH - 20, { fit: 'contain', background: { r: 13, g: 37, b: 53, alpha: 0 } })
      .toBuffer();

    previewComposites.push({ input: cellResized, left: left + 10, top: top + 10 });

    const svgText = Buffer.from(`
      <svg width="${cellW}" height="30">
        <rect width="100%" height="100%" fill="#0a192f"/>
        <text x="50%" y="20" font-size="11" font-family="sans-serif" fill="#64ffda" text-anchor="middle" font-weight="bold">
          ${item.target}
        </text>
      </svg>
    `);
    previewComposites.push({ input: svgText, left, top: top + cellH });
  }

  // Create audit verification sheet on dark teal background
  await sharp({
    create: { width: totalW, height: totalH, channels: 4, background: { r: 10, g: 25, b: 47, alpha: 1 } }
  })
  .composite(previewComposites)
  .jpeg({ quality: 92 })
  .toFile(path.join(srcDir, '_audit_8_meme_npcs.jpg'));

  console.log('\nAll 8 meme easter egg sprites processed, defringed, cropped and saved!');
  console.log('Saved audit sheet: _audit_8_meme_npcs.jpg');
}

run().catch(console.error);
