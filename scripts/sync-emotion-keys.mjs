// 把 public/images/characters/<角色>/ 里有、但 constants.ts 的 emotionMap 里没登记的图补进去。
// 键名 = 文件名去掉 .webp。只加不改：已有的键（包括故意指向别的图的别名）一律不动。
// 只补最近 2 小时内改过的文件（也就是这次装进来的），别把旧服装顺手登记进去。
// 用法：node scripts/sync-emotion-keys.mjs hikari rei ...
import fs from 'fs';
const F = 'constants.ts';
let src = fs.readFileSync(F, 'utf8');
for (const c of process.argv.slice(2)) {
  const anchor = `avatarUrl: '/images/characters/${c}/`;
  const a = src.indexOf(anchor);
  if (a < 0) { console.log(`${c}: 找不到角色`); continue; }
  const mapStart = src.indexOf('emotionMap: {', a);
  const mapEnd = src.indexOf('\n    }', mapStart);
  const block = src.slice(mapStart, mapEnd);
  const have = new Set([...block.matchAll(/'([a-z0-9_]+)'\s*:/g)].map(m => m[1]));
  const files = fs.readdirSync(`public/images/characters/${c}`).filter(f => f.endsWith('.webp') && Date.now() - fs.statSync(`public/images/characters/${c}/${f}`).mtimeMs < 2 * 3600e3).map(f => f.slice(0, -5));
  const add = files.filter(k => !have.has(k)).sort();
  if (!add.length) { console.log(`${c}: 无需补`); continue; }
  const lines = add.map(k => `      '${k}'${' '.repeat(Math.max(1, 18 - k.length))}: '/images/characters/${c}/${k}.webp',`).join('\n');
  const insertAt = mapStart + 'emotionMap: {'.length;
  src = src.slice(0, insertAt) + `\n      // ↓ 立绘重制补登记（scripts/sync-emotion-keys.mjs）\n${lines}` + src.slice(insertAt);
  console.log(`${c}: 补了 ${add.join(' ')}`);
}
fs.writeFileSync(F, src, 'utf8');
