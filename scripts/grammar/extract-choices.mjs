// ---------------------------------------------------------
// 把剧本里所有"主角开口说的日语选项"抽出来（选项对象上写了 jp 的那些）
//   node scripts/grammar/extract-choices.mjs   → .generated/grammar/choices.json
// 用 TypeScript 语法树找：同时有 labelZh 和 jp（字符串字面量）的对象字面量。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const ROOTS = ['story', 'data'];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = ROOTS.flatMap(walk).filter(f => f.endsWith('.ts'));

const lit = n => n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null;
const out = new Map();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true);
  const visit = node => {
    if (ts.isObjectLiteralExpression(node)) {
      const props = {};
      for (const p of node.properties) if (ts.isPropertyAssignment(p) && p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) props[p.name.text] = p.initializer;
      // 选项有两种写法：剧本里直接写的 { labelZh, jp }，和 _kit.ts 的 { zh, hintZh, jp }（④⑤段）
      const kitOpt = !props.labelZh && props.hintZh && props.zh;
      const jp = lit(props.jp), zh = lit(kitOpt ? props.zh : props.labelZh), en = lit(kitOpt ? props.en : props.labelEn);
      if (jp && zh !== null && jp.trim()) {
        const k = jp.trim();
        if (!out.has(k)) out.set(k, { jp: k, zh, en, files: [] });
        out.get(k).files.push(`${f.replace(/\\/g, '/')}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}
const list = [...out.values()];
fs.mkdirSync('.generated/grammar', { recursive: true });
fs.writeFileSync('.generated/grammar/choices.json', JSON.stringify(list, null, 1));
const byFile = {};
list.forEach(x => x.files.forEach(p => { const f = p.split(':')[0]; byFile[f] = (byFile[f] || 0) + 1; }));
console.log(list.length, '条不重复的日语选项');
console.log(Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([f, n]) => `  ${n}  ${f}`).join('\n'));
