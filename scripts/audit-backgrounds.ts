// 背景图盘点（开发用）：剧本 / 地图里用到的场景，哪些没图、哪些借别人的图、哪些一张图被很多场景共用
//   node scripts/audit-backgrounds.mjs [--json out.json]
import fs from 'fs';
import path from 'path';
import { SCENE_MAP, SCENE_FALLBACK, DEFAULT_SCENE } from '../constants';
import { MAP_LOCATIONS } from '../story/mapLocations';

const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : undefined; };

// 1. 源码里出现过的场景键：scene: 'x' / mapScene: 'x'，记下出现次数和出现在哪个文件
const used = new Map<string, { n: number; files: Set<string> }>();
const add = (k: string, f: string) => { const u = used.get(k) || { n: 0, files: new Set() }; u.n++; u.files.add(f); used.set(k, u); };
const walk = (d: string) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.generated', 'public', 'release', 'dist', '.git', 'scripts'].includes(e.name)) walk(p); continue; }
    if (!/\.(ts|tsx)$/.test(e.name)) continue;
    const s = fs.readFileSync(p, 'utf8');
    for (const m of s.matchAll(/\b(?:scene|mapScene)\s*:\s*['"]([a-z0-9_]+)['"]/g)) add(m[1], path.relative('.', p));
  }
};
walk('.');
// 地图上的每个地点：进去的时候背景用 mapScene || id
for (const l of MAP_LOCATIONS as any[]) add(l.mapScene || l.id, 'story/mapLocations.ts(地点)');

const exists = (url?: string) => !!url && fs.existsSync('public' + url);
// 2. 每个键的状态
type Row = { key: string; n: number; files: string[]; status: string; url?: string };
const rows: Row[] = [];
for (const [key, u] of used) {
  const url = SCENE_MAP[key], fb = SCENE_FALLBACK[key];
  let status: string;
  if (url && exists(url)) status = 'ok';
  else if (fb && exists(fb)) status = 'borrowed';        // 借了别的场景的图
  else if (url) status = 'file-missing';                 // 表里有，文件没交付
  else status = 'no-entry';                              // 表里都没有 → 退回默认场景
  rows.push({ key, n: u.n, files: [...u.files], status, url: url || fb });
}
// 3. 共用：同一个文件被多少个"不同地点"用（别名不算，只看用到的键）
const byFile = new Map<string, string[]>();
for (const r of rows) if (r.status === 'ok' || r.status === 'borrowed') { const a = byFile.get(r.url!) || []; a.push(r.key); byFile.set(r.url!, a); }

const bad = rows.filter(r => r.status !== 'ok').sort((a, b) => b.n - a.n);
console.log(`用到的场景键 ${rows.length} 个；默认场景 ${DEFAULT_SCENE}`);
console.log(`\n== 没有自己的图（${bad.length}）==`);
for (const r of bad) console.log(`${r.status.padEnd(12)} ${r.key.padEnd(34)} ×${r.n}  ${r.url ? '→ ' + path.basename(r.url) : ''}  [${r.files.slice(0, 3).join(', ')}]`);
console.log(`\n== 一张图被多个场景共用 ==`);
for (const [f, ks] of [...byFile].filter(([, ks]) => ks.length > 1).sort((a, b) => b[1].length - a[1].length))
  console.log(`${path.basename(f).padEnd(44)} ${ks.length}: ${ks.join(', ')}`);
const out = arg('json');
if (out) fs.writeFileSync(out, JSON.stringify({ bad, shared: Object.fromEntries([...byFile].filter(([, ks]) => ks.length > 1)) }, null, 1));
