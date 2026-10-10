// 立绘盘点（开发用）：源码里还在引用哪些"老立绘"
//   node scripts/audit-sprites.mjs [--json out.json]
//
// "老"的定义：public/images/characters/<角色>/ 下 2026-10-04 重制之前的文件
// （重制后的校服是 school_*，各套衣服是 <outfit>_*；老的是无前缀的 neutral.webp 之类、nao 的 casual_* 等）。
// 也会列出引用了已经不存在的立绘文件的地方。
import fs from 'fs';
import path from 'path';

const CHARS = ['asuka', 'hikari', 'rei', 'inari', 'miyuki', 'sora', 'nao', 'maki'];
const CUTOFF = new Date('2026-10-04T00:00:00+09:00').getTime();
const DIR = 'public/images/characters/';
const old = new Set(), present = new Set();
for (const c of CHARS) for (const f of fs.readdirSync(DIR + c)) {
  if (!f.endsWith('.webp')) continue;
  present.add(`${c}/${f}`);
  if (fs.statSync(DIR + c + '/' + f).mtimeMs < CUTOFF) old.add(`${c}/${f}`);
}

const hits = [];
const walk = d => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.generated', 'public', 'release', 'dist', '.git', 'scripts'].includes(e.name)) walk(p); continue; }
    if (!/\.(ts|tsx)$/.test(e.name)) continue;
    const s = fs.readFileSync(p, 'utf8');
    // const H = '/images/characters/hikari/'
    const consts = {};
    for (const m of s.matchAll(/const\s+([A-Za-z_]\w*)\s*=\s*['"`]\/images\/characters\/([a-z]+)\/['"`]/g)) consts[m[1]] = m[2];
    const lines = s.split('\n');
    lines.forEach((l, i) => {
      for (const m of l.matchAll(/\/images\/characters\/([a-z]+)\/([a-z0-9_]+\.webp)/g)) hits.push({ file: p, line: i + 1, key: `${m[1]}/${m[2]}` });
      for (const m of l.matchAll(/\$\{([A-Za-z_]\w*)\}([a-z0-9_]+\.webp)/g)) if (consts[m[1]]) hits.push({ file: p, line: i + 1, key: `${consts[m[1]]}/${m[2]}` });
    });
  }
};
walk('.');

const oldHits = hits.filter(h => old.has(h.key));
const missing = hits.filter(h => CHARS.includes(h.key.split('/')[0]) && !present.has(h.key));
const by = (arr) => { const o = {}; for (const h of arr) (o[h.key] = o[h.key] || []).push(`${h.file}:${h.line}`); return o; };
console.log(`老立绘文件 ${old.size} 个；源码引用老立绘 ${oldHits.length} 处；引用不存在的立绘 ${missing.length} 处`);
for (const [k, ws] of Object.entries(by(oldHits)).sort()) console.log(`  老  ${k.padEnd(28)} ×${ws.length}  ${ws.slice(0, 3).join(' ')}`);
for (const [k, ws] of Object.entries(by(missing)).sort()) console.log(`  缺  ${k.padEnd(28)} ×${ws.length}  ${ws.slice(0, 3).join(' ')}`);
const i = process.argv.indexOf('--json');
if (i > -1) fs.writeFileSync(process.argv[i + 1], JSON.stringify({ old: [...old], oldHits, missing }, null, 1));
