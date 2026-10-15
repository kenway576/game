// 找出所有会显示在画面上的 emoji（注释里的不算）
//   node scripts/audit-emoji.mjs [--list]
import fs from 'fs';
import path from 'path';

const ROOTS = ['components', 'data', 'story', 'services', 'hooks'];
const FILES = ['App.tsx', 'constants.ts', 'types.ts'];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = [...FILES, ...ROOTS.flatMap(walk)].filter(f => /\.(tsx?|mjs)$/.test(f));

// emoji：图形符号 + 可选的变体选择符 / ZWJ 组合
const EMO = /(?:\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*)/gu;
const stripComments = src => src
  .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, p) => p + ' '.repeat(m.length - p.length))
  .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, m => m.replace(/[^\n]/g, ' '));

const byEmoji = new Map();
const byFile = new Map();
for (const f of files) {
  const src = stripComments(fs.readFileSync(f, 'utf8'));
  const lines = src.split('\n');
  lines.forEach((ln, i) => {
    for (const m of ln.matchAll(EMO)) {
      const e = m[0];
      if (!byEmoji.has(e)) byEmoji.set(e, []);
      byEmoji.get(e).push(`${f}:${i + 1}`);
      byFile.set(f, (byFile.get(f) || 0) + 1);
    }
  });
}
console.log(`不同的 emoji：${byEmoji.size}，出现 ${[...byEmoji.values()].reduce((a, b) => a + b.length, 0)} 次`);
console.log([...byFile].sort((a, b) => b[1] - a[1]).map(([f, n]) => `  ${String(n).padStart(4)}  ${f}`).join('\n'));
// --json：去掉变体选择符（U+FE0F）之后的去重清单，给图标生成用
if (process.argv.includes('--json')) {
  const uniq = [...new Set([...byEmoji.keys()].map(e => e.replace(/\uFE0F/g, '')))];
  fs.mkdirSync('.generated/icons', { recursive: true });
  // 图集是按这份清单的顺序一格一格画的：清单一变，切图就整体错位。
  // 所以已有清单时只追加新出现的 emoji（排在最后，下一张图集再画），不重排。
  const f = '.generated/icons/emoji_list.json';
  const old = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  const added = uniq.filter(e => !old.includes(e));
  fs.writeFileSync(f, JSON.stringify([...old, ...added]));
  console.log('清单', old.length, '个，新增', added.length, '个', added.join(''), '→', f);
}
if (process.argv.includes('--list')) {
  for (const [e, where] of [...byEmoji].sort((a, b) => b[1].length - a[1].length)) console.log(`${e}  ×${where.length}  ${where.slice(0, 3).join(' ')}`);
}
