// 找代码里引用了、但重制后的那套衣服里没有的换装图（比如 knit_thinking.webp）。
// 两种写法都认：完整路径，和 `${NAO}knit_curious.webp` 这种拼接（会先找 const NAO = '/images/characters/nao/'）。
// constants.ts 的 emotionMap 由 build-rigs 管，不在这里查。
//   node scripts/remake/find-stale-refs.mjs
import fs from 'fs'; import path from 'path';
const sets = {};
for (const c of fs.readdirSync('.generated/remake2')) {
  const cd = path.join('.generated/remake2', c);
  if (!fs.statSync(cd).isDirectory()) continue;
  for (const o of fs.readdirSync(cd)) {
    const f = path.join(cd, o, 'rig.json');
    if (fs.existsSync(f)) { const r = JSON.parse(fs.readFileSync(f, 'utf8')); (sets[c] ||= {})[o] = Object.keys(r.files); }
  }
}
const files = ['App.tsx', ...['components', 'story', 'data', 'services'].flatMap(d => fs.readdirSync(d, { recursive: true }).filter(f => /\.(ts|tsx)$/.test(f)).map(f => path.join(d, f)))];
const out = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const prefix = {};
  for (const m of src.matchAll(/const\s+([A-Z_]+)\s*=\s*['`]\/images\/characters\/([a-z]+)\/['`]/g)) prefix[m[1]] = m[2];
  const refs = [...src.matchAll(/\/images\/characters\/([a-z]+)\/([a-z0-9_]+)\.webp/g)].map(m => [m[1], m[2]])
    .concat([...src.matchAll(/\$\{([A-Z_]+)\}([a-z0-9_]+)\.webp/g)].filter(m => prefix[m[1]]).map(m => [prefix[m[1]], m[2]]));
  for (const [c, name] of refs) {
    const o = name.split('_')[0];
    const set = sets[c]?.[o];
    if (set && !set.includes(name)) out.push(`${f}\t${c}/${name}`);
  }
}
const count = {};
for (const l of out) count[l] = (count[l] || 0) + 1;
for (const [l, n] of Object.entries(count).sort()) console.log(n, l);
