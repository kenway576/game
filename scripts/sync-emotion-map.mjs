/**
 * 🔗 emotionMap 同步：扫描 public/images/characters/ 重建 constants.ts 里的 emotionMap
 *
 * 手工维护 emotionMap 在只有几十张立绘时还行，一次新增上百张就不现实了——
 * 漏登记一个键，那张图在游戏里永远不会出现。这里以磁盘为准反向生成。
 *
 * ⚠️ 实现要点：`[CharacterId.ASUKA]` 在 constants.ts 里出现在五张表中
 * （CHARACTER_ROOMS / CHARACTERS / WARDROBE / OUTFIT_UNLOCKS / CHARACTER_CGS…），
 * 直接用正则找会抓错位置。所以先框定 CHARACTERS 块，只在块内定位，
 * 并按绝对下标**倒序**替换，避免前面的改动让后面的下标失效。
 *
 * 用法：
 *   node scripts/sync-emotion-map.mjs            # 预演
 *   node scripts/sync-emotion-map.mjs --write    # 写回
 */
import fs from 'fs';
import path from 'path';

const WRITE = process.argv.includes('--write');
const FILE = path.resolve('constants.ts');
const CHARS_ROOT = path.resolve('public/images/characters');

const src = fs.readFileSync(FILE, 'utf8');

// 1) 框定 CHARACTERS 对象的范围（按花括号配平，别用正则猜）
const startMarker = 'export const CHARACTERS';
const objStart = src.indexOf('{', src.indexOf(startMarker));
if (objStart < 0) { console.error('找不到 CHARACTERS 定义'); process.exit(1); }
let depth = 0, objEnd = -1;
for (let i = objStart; i < src.length; i++) {
  if (src[i] === '{') depth++;
  else if (src[i] === '}') { depth--; if (depth === 0) { objEnd = i; break; } }
}
if (objEnd < 0) { console.error('CHARACTERS 花括号不配平'); process.exit(1); }

// 2) 在块内逐个定位「[CharacterId.X]: {  …  emotionMap: { … }」
const edits = [];   // {char, from, to, existing}
const charRe = /\[CharacterId\.(\w+)\]:\s*\{/g;
charRe.lastIndex = objStart;
let m;
while ((m = charRe.exec(src)) !== null && m.index < objEnd) {
  const char = m[1].toLowerCase();
  const emIdx = src.indexOf('emotionMap:', m.index);
  if (emIdx < 0 || emIdx > objEnd) continue;
  const braceStart = src.indexOf('{', emIdx);
  let d = 0, braceEnd = -1;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === '{') d++;
    else if (src[i] === '}') { d--; if (d === 0) { braceEnd = i; break; } }
  }
  if (braceEnd < 0) continue;
  const body = src.slice(braceStart + 1, braceEnd);
  // 连值一起取：有些键是**故意的别名**（如 'yukata_neutral' 指向 yukata_shy.webp，
  // 让"穿浴衣时返回 neutral"能落到浴衣立绘上）。这类键磁盘上没有同名文件，
  // 但绝不能删——删了服装保持逻辑就破了。
  const entries = [...body.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)].map(x => ({ key: x[1], val: x[2] }));
  edits.push({ char, from: braceStart + 1, to: braceEnd, entries, existing: entries.map(e => e.key) });
}

// 3) 比对磁盘，生成新内容
let totalAdded = 0, totalRemoved = 0;
for (const e of edits) {
  const dir = path.join(CHARS_ROOT, e.char);
  if (!fs.existsSync(dir)) { e.skip = true; continue; }
  const keys = fs.readdirSync(dir).filter(f => f.endsWith('.webp')).map(f => f.replace('.webp', '')).sort();
  if (!keys.length) { e.skip = true; continue; }

  const fileExists = v => fs.existsSync(path.resolve('public' + v));
  // 保留：目标文件仍存在的旧条目（含别名）；丢弃：指向已消失文件的死链
  const kept = e.entries.filter(en => fileExists(en.val));
  const dead = e.entries.filter(en => !fileExists(en.val));
  const keptKeys = new Set(kept.map(en => en.key));
  const added = keys.filter(k => !keptKeys.has(k));
  const aliases = kept.filter(en => !keys.includes(en.key)).map(en => en.key);

  totalAdded += added.length; totalRemoved += dead.length;
  // 最终 = 保留的旧条目（含别名，原样保值） + 新文件（键=文件名）
  e.final = [...kept, ...added.map(k => ({ key: k, val: `/images/characters/${e.char}/${k}.webp` }))]
    .sort((a, b) => a.key.localeCompare(b.key));

  console.log(`${e.char.padEnd(9)} 磁盘 ${String(keys.length).padStart(3)} / 已登记 ${String(e.entries.length).padStart(3)}` +
    (added.length ? `  ➕${added.length}` : '') + (dead.length ? `  ➖死链${dead.length}` : '') +
    (aliases.length ? `  🔗别名${aliases.length}(保留)` : '') +
    (!added.length && !dead.length ? '  ✓ 已同步' : ''));
  if (added.length) console.log(`          新增: ${added.slice(0, 8).join(', ')}${added.length > 8 ? ` …等 ${added.length} 个` : ''}`);
  if (dead.length) console.log(`          死链(目标文件已不存在): ${dead.map(d => d.key).join(', ')}`);
}

if (!WRITE) {
  console.log(`\n预演：将新增 ${totalAdded} 个键，移除 ${totalRemoved} 个。确认无误后加 --write。`);
  process.exit(0);
}

// 4) 倒序替换：从文件末尾往回改，前面的下标才不会被打乱
let out = src;
for (const e of [...edits].reverse()) {
  if (e.skip) continue;
  const pad = Math.max(...e.final.map(en => en.key.length)) + 2;
  const body = '\n' + e.final.map(en =>
    `      ${(`'${en.key}'`).padEnd(pad)}: '${en.val}',`).join('\n') + '\n    ';
  out = out.slice(0, e.from) + body + out.slice(e.to);
}
fs.writeFileSync(FILE, out, 'utf8');
console.log(`\n✅ 已写回 constants.ts（新增 ${totalAdded}，移除 ${totalRemoved}）`);
