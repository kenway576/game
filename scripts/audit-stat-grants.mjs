import fs from 'fs';
import path from 'path';

// 数一下属性是从哪儿来的：
//   选项里的  effects  → 玩家做了选择才拿到，合理
//   独立 effect 节点里的 → 什么都没做，读到就涨，这才是"随随便便"
const walk = d => fs.readdirSync(d, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

const files = process.argv.slice(2).length ? process.argv.slice(2) : walk('story').filter(f => f.endsWith('.ts'));

let choiceN = 0, nodeN = 0;
const nodeHits = [];

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/stat:\s*'/.test(lines[i])) continue;
    // 往回找最近的 type: '...' 或 id: '...'
    let kind = '?';
    for (let j = i; j >= Math.max(0, i - 40); j--) {
      if (/type:\s*'effect'/.test(lines[j])) { kind = 'effect节点'; break; }
      if (/^\s*id:\s*'/.test(lines[j])) { kind = '选项'; break; }
      if (/type:\s*'(narration|speech|scene|choice|cg)'/.test(lines[j])) { kind = 'other'; break; }
    }
    const amt = (lines[i].match(/amount:\s*(-?\d+)/) || [, '?'])[1];
    const st = (lines[i].match(/stat:\s*'(\w+)'/) || [, '?'])[1];
    if (kind === '选项') choiceN++;
    else { nodeN++; nodeHits.push(`${path.basename(f)}:${i + 1}  ${st} ${amt >= 0 ? '+' : ''}${amt}`); }
  }
}

console.log(`选项里挣的: ${choiceN}`);
console.log(`effect 节点白送的: ${nodeN}`);
console.log('\n白送的（前 30 条）:');
for (const h of nodeHits.slice(0, 30)) console.log('  ' + h);
