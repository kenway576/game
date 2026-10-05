// ---------------------------------------------------------
// 🦴 把流水线装好的换装登记进游戏
//
//   node scripts/remake/build-rigs.mjs [--prune]
//
// 扫 .generated/remake2/<角色>/<衣服>/rig.json（outfit-pipeline 装图那一步写的）：
//   1. 骨骼 + 眨眼帧 → data/puppetRigsAuto.ts（整个文件重写）
//   2. constants.ts 里这个角色的 emotionMap：<衣服>_* 的键全部指向新图。
//      旧键名一个不丢（AI 和剧本可能还在用 casual_tea、sport_tennis 这种），
//      按意思指到最接近的新表情上
//   3. --prune：这套衣服里没人再引用的旧图删掉
// 可以反复跑，结果只取决于当前装好了哪些衣服。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';

const PRUNE = process.argv.includes('--prune');
const ROOT = '.generated/remake2';
const rigs = [];
for (const c of fs.readdirSync(ROOT)) {
  const cd = path.join(ROOT, c);
  if (!fs.statSync(cd).isDirectory()) continue;
  for (const o of fs.readdirSync(cd)) {
    const f = path.join(cd, o, 'rig.json');
    if (fs.existsSync(f)) rigs.push(JSON.parse(fs.readFileSync(f, 'utf8')));
  }
}
rigs.sort((a, b) => (a.char + a.outfit).localeCompare(b.char + b.outfit));

// ---------------- 1. 骨骼
const entries = [];
for (const r of rigs) {
  for (const [name, info] of Object.entries(r.files)) {
    const rig = { ...r.rig };
    if (info.closed) delete rig.eyes;          // 笑眯眼：不眨
    if (info.blink) rig.blink = info.blink;
    entries.push(`  '/images/characters/${r.char}/${name}.webp': ${JSON.stringify(rig)},`);
  }
}
fs.writeFileSync('data/puppetRigsAuto.ts', `// ⚙️ 自动生成，别手改：node scripts/remake/build-rigs.mjs
// 第二轮重制的换装立绘的木偶骨骼 + 眨眼过渡帧（scripts/remake/outfit-pipeline.mjs 标的）
import type { PuppetRig } from './puppetRigs';

export const AUTO_RIGS: Record<string, PuppetRig> = {
${entries.join('\n')}
};
`, 'utf8');
console.log(`骨骼：${rigs.length} 套衣服，${entries.length} 张图 → data/puppetRigsAuto.ts`);

// ---------------- 2. emotionMap
// 旧键的后缀 → 意思最接近的表情（按顺序试，第一个这套衣服有的就用）
const ALIAS = {
  tea: ['neutral'], tennis: ['neutral'], elegant: ['neutral'], reading: ['neutral'], camera: ['neutral'],
  umbrella: ['neutral'], serious: ['neutral'], majestic: ['neutral'], cold: ['neutral'],
  yawn: ['neutral'], blush: ['shy'], cute: ['happy', 'smile'], cheer: ['happy'], eating: ['happy'], eat: ['happy'],
  bangdream: ['happy'], sparkle: ['happy'], snow: ['happy'], ok: ['happy'], tired: ['sad'],
  smile: ['smile', 'happy'], happy: ['happy', 'smile', 'laugh'], laugh: ['laugh', 'happy'],
  love: ['love', 'shy'], jealous: ['jealous', 'pout', 'shy'], pout: ['pout', 'shy'],
  smug: ['smug', 'sly', 'cool', 'happy'], sly: ['sly', 'smug', 'cool'], cool: ['cool', 'smug', 'sly', 'neutral'],
  game: ['smug'], hate: ['angry'], shock: ['surprised'], surprised: ['surprised', 'curious'],
  curious: ['curious', 'surprised', 'happy'], thinking: ['thinking', 'curious', 'neutral'], lecturing: ['lecturing', 'neutral'],
  sad: ['sad'], angry: ['angry', 'pout'], shy: ['shy']
};
const resolve = (suffix, have) => {
  const base = suffix.replace(/_alt\d*$/, '');
  if (have.includes(base)) return base;
  for (const s of ALIAS[base] || []) if (have.includes(s)) return s;
  return have[0];   // 底图那张（neutral）
};

let src = fs.readFileSync('constants.ts', 'utf8');
const byChar = {};
for (const r of rigs) (byChar[r.char] ||= []).push(r);
const removedFiles = [];
for (const [c, list] of Object.entries(byChar)) {
  const anchor = `avatarUrl: '/images/characters/${c}/`;
  const a = src.indexOf(anchor);
  if (a < 0) { console.log(`${c}: constants.ts 里找不到`); continue; }
  const mapStart = src.indexOf('emotionMap: {', a);
  const mapEnd = src.indexOf('\n    }', mapStart);
  let block = src.slice(mapStart, mapEnd);
  for (const r of list) {
    const have = Object.keys(r.files).map(n => n.slice(r.outfit.length + 1));
    const prefix = `${r.outfit}_`;
    // 现有的这套衣服的键
    const lineRe = new RegExp(`\\n\\s*'(${prefix}[a-z0-9_]+)'\\s*:\\s*'([^']+)',?[^\\n]*`, 'g');
    const oldKeys = [];
    block = block.replace(lineRe, (m, k, v) => { oldKeys.push([k, v]); return ''; });
    const keys = new Map();
    for (const e of have) keys.set(`${prefix}${e}`, `${prefix}${e}`);
    for (const [k] of oldKeys) if (!keys.has(k)) keys.set(k, `${prefix}${resolve(k.slice(prefix.length), have)}`);
    // 换装后默认要有 <衣服>_neutral
    if (!keys.has(`${prefix}neutral`)) keys.set(`${prefix}neutral`, `${prefix}${have[0]}`);
    const lines = [...keys.entries()].sort().map(([k, f]) =>
      `      '${k}'${' '.repeat(Math.max(1, 18 - k.length))}: '/images/characters/${c}/${f}.webp',`);
    // 反复跑时先去掉上次插的注释行；constants.ts 是 CRLF，插进去的行也用 CRLF
    block = block.replace(new RegExp(`\\r?\\n[ \\t]*// ↓ ${r.outfit}：立绘重制第二轮[^\\n]*`, 'g'), '');
    block = block.replace('emotionMap: {', `emotionMap: {\r\n      // ↓ ${r.outfit}：立绘重制第二轮（scripts/remake/build-rigs.mjs）\r\n${lines.join('\r\n')}`);
    for (const [, v] of oldKeys) removedFiles.push(v);
  }
  src = src.slice(0, mapStart) + block + src.slice(mapEnd);
}
fs.writeFileSync('constants.ts', src, 'utf8');
console.log(`emotionMap：${Object.keys(byChar).join(' ')} 已更新`);

// ---------------- 3. 删掉没人用的旧图
if (PRUNE) {
  const code = ['constants.ts', 'App.tsx', ...['components', 'story', 'data', 'services'].flatMap(d =>
    fs.readdirSync(d, { recursive: true }).filter(f => /\.(ts|tsx)$/.test(f)).map(f => path.join(d, f)))]
    .map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let n = 0;
  for (const r of rigs) {
    const dir = `public/images/characters/${r.char}`;
    for (const f of fs.readdirSync(dir)) {
      if (!f.startsWith(`${r.outfit}_`) || !f.endsWith('.webp')) continue;
      if (r.files[f.slice(0, -5)]) continue;
      if (code.includes(`/images/characters/${r.char}/${f}`)) continue;
      fs.unlinkSync(path.join(dir, f)); n++;
    }
  }
  console.log(`删掉没人引用的旧图 ${n} 张`);
}
