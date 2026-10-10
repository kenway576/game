// 把源码里引用老立绘的地方全部换成重制后的立绘（一次性迁移，可重复跑）
//   node scripts/remap-old-sprites.mjs [--dry]
//
// 老立绘 = 2026-10-04 重制前留下的文件（见 scripts/audit-sprites.mjs）。
// 默认那一身是校服，所以无前缀的老表情 → school_<表情>；奈绪老的 casual_* → 她现在的私服 knit_*。
// 老立绘里有、新校服没有的表情，换成最接近的那一个（下面每条都写了）。
import fs from 'fs';
import path from 'path';

const MAP = {
  hikari: { angry: 'school_angry', happy: 'school_happy', neutral: 'school_neutral', sad: 'school_sad', shy: 'school_shy', smug: 'school_smug', surprised: 'school_surprised' },
  inari: {
    angry: 'school_angry', happy: 'school_happy', neutral: 'school_neutral', sad: 'school_sad', shy: 'school_shy',
    sly: 'school_sly', smug: 'school_smug', surprised: 'school_surprised',
    curious: 'school_surprised',   // 好奇 → 睁大眼
    majestic: 'school_smug'        // 威严 → 从容的笑
  },
  maki: {
    angry: 'school_angry', angry_alt: 'school_angry', happy: 'school_happy', happy_alt: 'school_happy', laugh: 'school_laugh',
    neutral: 'school_neutral', neutral_alt: 'school_neutral', pout: 'school_pout', shy: 'school_shy', shy_alt: 'school_shy',
    smug: 'school_smug', sleepy_alt: 'school_neutral'
  },
  sora: {
    angry: 'school_angry', happy: 'school_happy', neutral: 'school_neutral', sad: 'school_sad', shy: 'school_shy', love: 'school_love',
    cute: 'school_happy', love_alt: 'school_love', neutral_alt: 'school_neutral_alt', shock: 'school_shock'
  },
  miyuki: { casual_bangdream: 'cardigan_happy', happy_alt: 'cardigan_happy_alt', neutral_alt: 'cardigan_neutral' },
  nao: {
    casual_angry: 'knit_angry', casual_curious: 'knit_curious', casual_happy: 'knit_happy', casual_love: 'knit_love',
    casual_neutral: 'knit_neutral', casual_shy: 'knit_shy', casual_cold: 'knit_neutral', jacket_angry: 'knit_angry'
  },
  rei: { school_bangdream: 'neutral' }
};

const dry = process.argv.includes('--dry');
const DIR = 'public/images/characters/';
// 新图都得在
for (const [c, m] of Object.entries(MAP)) for (const n of Object.values(m)) if (!fs.existsSync(`${DIR}${c}/${n}.webp`)) { console.error(`缺新图 ${c}/${n}.webp`); process.exit(1); }

let total = 0;
const files = [];
const walk = d => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.generated', 'public', 'release', 'dist', '.git', 'scripts'].includes(e.name)) walk(p); continue; }
    if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  }
};
walk('.');
for (const p of files) {
  let s = fs.readFileSync(p, 'utf8');
  const before = s;
  // 这个文件里 const X = '/images/characters/<c>/' 这种前缀
  const consts = {};
  for (const m of s.matchAll(/const\s+([A-Za-z_]\w*)\s*=\s*['"`]\/images\/characters\/([a-z]+)\/['"`]/g)) consts[m[1]] = m[2];
  let n = 0;
  // 1) 完整路径
  s = s.replace(/\/images\/characters\/([a-z]+)\/([a-z0-9_]+)\.webp/g, (all, c, f) => (MAP[c]?.[f] ? (n++, `/images/characters/${c}/${MAP[c][f]}.webp`) : all));
  // 2) ${H}happy.webp
  s = s.replace(/\$\{([A-Za-z_]\w*)\}([a-z0-9_]+)\.webp/g, (all, v, f) => { const c = consts[v]; return c && MAP[c]?.[f] ? (n++, `\${${v}}${MAP[c][f]}.webp`) : all; });
  if (s !== before) {
    total += n;
    console.log(`${p}: ${n} 处`);
    if (!dry) fs.writeFileSync(p, s);
  }
}
console.log(`${dry ? '（试跑）' : ''}共 ${total} 处`);
