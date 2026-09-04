const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f';
const pubProtagonistDir = path.resolve('public/images/characters/protagonist');
const distProtagonistDir = path.resolve('dist/images/characters/protagonist');
const pubBgDir = path.resolve('public/images/backgrounds');
const distBgDir = path.resolve('dist/images/backgrounds');

[pubProtagonistDir, distProtagonistDir, pubBgDir, distBgDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const protagonistSprites = [
  {
    src: path.join(brainDir, 'protagonist_school_sprite_1788502063834.jpg'),
    target: 'school_neutral.webp',
    name: 'Protagonist School Uniform'
  },
  {
    src: path.join(brainDir, 'protagonist_casual_sprite_1788502086244.jpg'),
    target: 'casual_neutral.webp',
    name: 'Protagonist Casual Date Outfit'
  },
  {
    src: path.join(brainDir, 'protagonist_home_sprite_1788502108781.jpg'),
    target: 'home_neutral.webp',
    name: 'Protagonist Home Loungewear'
  },
  {
    src: path.join(brainDir, 'protagonist_summer_sprite_1788502135679.jpg'),
    target: 'summer_neutral.webp',
    name: 'Protagonist Summer Resort'
  }
];

const kansaiBgs = [
  {
    src: path.join(brainDir, 'bg_osaka_shinsekai_tsutenkaku_1788502164987.jpg'),
    target: 'bg_osaka_shinsekai_tsutenkaku.webp',
    name: 'Osaka Shinsekai & Tsutenkaku'
  },
  {
    src: path.join(brainDir, 'bg_kyoto_fushimi_inari_torii_1788502185983.jpg'),
    target: 'bg_kyoto_fushimi_inari_torii.webp',
    name: 'Kyoto Fushimi Inari Torii'
  },
  {
    src: path.join(brainDir, 'bg_osaka_dotonbori_canal_1788502222178.jpg'),
    target: 'bg_osaka_dotonbori_canal.webp',
    name: 'Osaka Dotonbori Canal Walkway'
  },
  {
    src: path.join(brainDir, 'bg_kyoto_arashiyama_bamboo_1788502242268.jpg'),
    target: 'bg_kyoto_arashiyama_bamboo.webp',
    name: 'Kyoto Arashiyama Bamboo Forest'
  },
  {
    src: path.join(brainDir, 'bg_kyoto_kamogawa_river_1788502260000.jpg'),
    target: 'bg_kyoto_kamogawa_river.webp',
    name: 'Kyoto Kamogawa River & Stepping Stones'
  }
];

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const sat = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

async function cleanSprite(item) {
  const srcBuf = fs.readFileSync(item.src);
  const { data, info } = await sharp(srcBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;

  // Sample corner background color
  const sampleCorners = [
    0, 1, 2, 3, W - 1, W - 2, W - 3,
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

    if (dR <= 22 && dG <= 22 && dB <= 22 && s <= 18) return true;
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

      if ((bgL >= 235 && l >= 170) || (bgL < 235 && dR < 40 && dG < 40 && dB < 40 && s < 20)) {
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

async function processBackground(item) {
  console.log(`Processing background: ${item.name} ...`);
  const srcBuf = fs.readFileSync(item.src);
  const webpBuf = await sharp(srcBuf)
    .resize(1280, 720, { fit: 'cover' })
    .webp({ quality: 92 })
    .toBuffer();

  fs.writeFileSync(path.join(pubBgDir, item.target), webpBuf);
  fs.writeFileSync(path.join(distBgDir, item.target), webpBuf);
  console.log(`Saved background: ${item.target} (size: ${(webpBuf.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('--- Step 1: Processing Kansai Backgrounds ---');
  for (const bg of kansaiBgs) {
    await processBackground(bg);
  }

  console.log('\n--- Step 2: Processing Protagonist Sprites (Defringing & WebP) ---');
  const previewComposites = [];
  const cellW = 320, cellH = 580;
  const cols = 4, rows = 1;
  const totalW = cols * cellW, totalH = rows * (cellH + 40);

  for (let idx = 0; idx < protagonistSprites.length; idx++) {
    const item = protagonistSprites[idx];
    console.log(`Processing sprite [${idx + 1}/${protagonistSprites.length}] ${item.target} (${item.name}) ...`);
    const webpBuf = await cleanSprite(item);

    // Save to public and dist
    fs.writeFileSync(path.join(pubProtagonistDir, item.target), webpBuf);
    fs.writeFileSync(path.join(distProtagonistDir, item.target), webpBuf);
    console.log(`Saved sprite: ${item.target} (size: ${(webpBuf.length / 1024).toFixed(1)} KB)`);

    // Add to verification preview on dark navy background
    const left = idx * cellW;
    const top = 0;

    const cellResized = await sharp(webpBuf)
      .resize(cellW - 20, cellH - 20, { fit: 'contain', background: { r: 13, g: 37, b: 53, alpha: 0 } })
      .toBuffer();

    previewComposites.push({ input: cellResized, left: left + 10, top: top + 10 });

    const svgText = Buffer.from(`
      <svg width="${cellW}" height="40">
        <rect width="100%" height="100%" fill="#091428"/>
        <text x="50%" y="25" font-size="13" font-family="sans-serif" fill="#64ffda" text-anchor="middle" font-weight="bold">
          ${item.target} (${item.name.replace('Protagonist ', '')})
        </text>
      </svg>
    `);
    previewComposites.push({ input: svgText, left, top: cellH });
  }

  // Create audit verification sheet on dark background
  const auditPath = path.join(brainDir, 'audit_protagonist_sprites.jpg');
  await sharp({
    create: { width: totalW, height: totalH, channels: 4, background: { r: 10, g: 25, b: 47, alpha: 1 } }
  })
  .composite(previewComposites)
  .jpeg({ quality: 95 })
  .toFile(auditPath);

  console.log(`\nAudit sheet saved to: ${auditPath}`);
  console.log('All protagonist sprites and Kansai backgrounds processed successfully!');
}

main().catch(err => {
  console.error('Error processing:', err);
  process.exit(1);
});
