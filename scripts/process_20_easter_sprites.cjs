const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('.incoming-gdrive');
const charDir = path.resolve('public/images/characters');
const distCharDir = path.resolve('dist/images/characters');
const backupDir = path.resolve('.backup-originals/characters');
const brainDir = 'C:\\Users\\adm\\.gemini\\antigravity\\brain\\5aeade40-c8de-4530-87d0-a4afd6a5657f';

[charDir, distCharDir, backupDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const characters = [
  {
    src: '1788520789299.jpg',
    target: 'easter_hachiman.webp',
    name: '比企谷八幡 (Hachiman - MAX Coffee Dead Fish Eyes)'
  },
  {
    src: '1788520829459.jpg',
    target: 'easter_yukino.webp',
    name: '雪之下雪乃 (Yukino - Ice Queen Bookworm)'
  },
  {
    src: '1788520945057.jpg',
    target: 'easter_shizuka.webp',
    name: '平冢静 (Shizuka - Cool Labcoat Ramen Teacher)'
  },
  {
    src: '1788520999922.jpg',
    target: 'easter_anna.webp',
    name: '八奈见杏菜 (Anna - Voracious Eater Losing Heroine)'
  },
  {
    src: '1788521072230.jpg',
    target: 'easter_lemon.webp',
    name: '烧盐柠檬 (Lemon - Athletic Track Tomboy)'
  },
  {
    src: '1788521160833.jpg',
    target: 'easter_nukumizu.webp',
    name: '温水和彦 (Nukumizu - Snack Receipt Observer)'
  },
  {
    src: '1788521202503.jpg',
    target: 'easter_setsuna.webp',
    name: '小木曾雪菜 (Setsuna - School Idol Melancholy Smile)'
  },
  {
    src: '1788521246885.jpg',
    target: 'easter_kazusa.webp',
    name: '冬马和纱 (Kazusa - Aloof Pianist Prodigy)'
  },
  {
    src: '1788521303705.jpg',
    target: 'easter_haruki.webp',
    name: '北原春希 (Haruki - Serious Class Leader with Guitar)'
  },
  {
    src: '1788521429988.jpg',
    target: 'easter_haruhi.webp',
    name: '凉宫春日 (Haruhi - Confident SOS Brigade Chief)'
  },
  {
    src: '1788521476010.jpg',
    target: 'easter_yuki_nagato.webp',
    name: '长门有希 (Nagato - Silent Interface Reading Book)'
  },
  {
    src: '1788521513007.jpg',
    target: 'easter_megumi.webp',
    name: '加藤惠 (Megumi - White Beret Hillside Turn)'
  },
  {
    src: '1788521519818.jpg',
    target: 'easter_megumi_alt.webp',
    name: '加藤惠 (Megumi - White Beret Gentle Smile)'
  },
  {
    src: '1788521736017.jpg',
    target: 'easter_shirou.webp',
    name: '卫宫士郎 (Shirou - High Jump Pole & Muddy PE Uniform)'
  },
  {
    src: '1788521791790.jpg',
    target: 'easter_okabe.webp',
    name: '冈部伦太郎 (Okabe - Mad Scientist on Phone with Dr Pepper)'
  },
  {
    src: '1788521859349.jpg',
    target: 'easter_kurisu.webp',
    name: '牧濑红莉栖 (Kurisu - Tsundere Genius in Pantyhose)'
  },
  {
    src: '1788521968675.jpg',
    target: 'easter_mai.webp',
    name: '樱岛麻衣 (Mai - Bunny Barrette Actress with Sunglasses)'
  },
  {
    src: '1788522206719.jpg',
    target: 'easter_mai_alt.webp',
    name: '樱岛麻衣 (Mai - Elegant School Uniform)'
  },
  {
    src: '1788522249623.jpg',
    target: 'easter_sakuta.webp',
    name: '梓川咲太 (Sakuta - Hands in Pockets Master)'
  },
  {
    src: '1788522287703.jpg',
    target: 'easter_nagisa.webp',
    name: '古河渚 (Nagisa - Dango Plushie & Twin Ahoge)'
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

  // Seed from outer borders
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }

  while (stack.length > 0) {
    const p = stack.pop();
    for (const q of nbrs(p)) {
      push(q);
    }
  }

  // Enclosed background pockets (between arms and waist, inside hair strands)
  // Protected: do NOT clear regions that are part of central torso (white shirts, labcoats)
  const isPocketCandidate = p => {
    if (bg[p]) return false;
    const x = p % W, y = Math.floor(p / W);

    // Torso safety box: if inside middle chest (0.35W..0.65W, 0.22H..0.52H), protect white clothing!
    if (x >= W * 0.35 && x <= W * 0.65 && y >= H * 0.22 && y <= H * 0.52) {
      return false;
    }

    const i = p * 4;
    const r = data[i], g = data[i+1], b = data[i+2];
    const dR = Math.abs(r - bgR), dG = Math.abs(g - bgG), dB = Math.abs(b - bgB);
    return dR <= 16 && dG <= 16 && dB <= 16 && S(p) <= 12;
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

    // A valid background pocket is relatively small (< 8% of image) and has high pure white ratio
    if (cells.length >= 30 && cells.length <= N * 0.08) {
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

  // Extra manual pocket seeds for specific complex poses
  // e.g. for Shirou pole vault: triangular hole under right arm
  if (item.target === 'easter_shirou.webp') {
    const leftArmSeed = Math.floor(0.40 * H) * W + Math.floor(0.33 * W);
    if (isBgSeed(leftArmSeed)) {
      const st = [leftArmSeed];
      bg[leftArmSeed] = 1;
      while (st.length) {
        const p = st.pop();
        for (const q of nbrs(p)) {
          if (!bg[q] && isBgSeed(q)) {
            bg[q] = 1;
            st.push(q);
          }
        }
      }
    }
  }

  // Distance transform for defringing (feathering & un-premultiply)
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

  // Output buffer with defringing
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

async function run() {
  const previewComposites = [];
  const cellW = 240, cellH = 460;
  const cols = 5, rows = Math.ceil(characters.length / cols);
  const totalW = cols * cellW, totalH = rows * (cellH + 30);

  for (let idx = 0; idx < characters.length; idx++) {
    const item = characters[idx];
    console.log(`Processing [${idx + 1}/${characters.length}] ${item.target} (${item.name}) ...`);
    const webpBuf = await cleanSprite(item);

    // Save to public and dist
    fs.writeFileSync(path.join(charDir, item.target), webpBuf);
    fs.writeFileSync(path.join(distCharDir, item.target), webpBuf);

    // Backup original
    fs.copyFileSync(path.join(srcDir, item.src), path.join(backupDir, item.src));

    // Prepare preview cell on dark teal background
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
  const auditPath = path.join(brainDir, 'audit_20_easter_sprites.jpg');
  await sharp({
    create: { width: totalW, height: totalH, channels: 4, background: { r: 10, g: 25, b: 47, alpha: 1 } }
  })
  .composite(previewComposites)
  .jpeg({ quality: 92 })
  .toFile(auditPath);

  console.log(`\nAll 20 Easter Egg character sprites processed, defringed, cropped and saved!`);
  console.log(`Saved audit sheet: ${auditPath}`);
}

run().catch(console.error);
