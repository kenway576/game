// ---------------------------------------------------------
// 一次性改写：JSX 里直接显示的 emoji → <Emo> / <EmoText>（components/Emo.tsx）
//
//   node scripts/icons/codemod-emoji.mjs          # 只列出要改的地方
//   node scripts/icons/codemod-emoji.mjs --write  # 真的改
//
// 规则：
//   R1  JSX 文本里的 emoji           📅 {x}        → <Emo e="📅" /> {x}
//   R2  {表达式} 里的字符串带 emoji  {en ? '🔒 A' : '🔒 甲'} → <EmoText text={...} />
//   R3  {xx.icon} / {xx.emoji}                     → <Emo e={xx.icon} />
// 改不了的（属性、SVG <text>、表达式里夹着 JSX）列出来手动处理。
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const WRITE = process.argv.includes('--write');
const EMO = /(?:\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*)/gu;
const KEEP = new Set(['▶', '◀', '✔']);
const iconish = s => [...(s || '').matchAll(EMO)].some(m => !KEEP.has(m[0].replace(/\uFE0F/g, '')));
// 这些标签里只能放文字
const TEXT_ONLY = new Set(['text', 'tspan', 'title', 'option', 'textarea']);

const files = ['App.tsx', ...fs.readdirSync('components').filter(f => f.endsWith('.tsx') && f !== 'Emo.tsx').map(f => `components/${f}`)];
const manual = [];
let total = 0;

const tagOf = el => {
  const open = ts.isJsxElement(el) ? el.openingElement : null;
  return open ? open.tagName.getText() : '';
};
const hasJsx = node => {
  let found = false;
  const visit = n => { if (found) return; if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) { found = true; return; } ts.forEachChild(n, visit); };
  visit(node);
  return found;
};
const literalHasEmoji = node => {
  let found = false;
  const visit = n => {
    if (found) return;
    if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) && iconish(n.text)) { found = true; return; }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
};
const quote = s => JSON.stringify(s);

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const used = new Set();
  const line = pos => sf.getLineAndCharacterOfPosition(pos).line + 1;

  const visit = node => {
    // R1
    if (ts.isJsxText(node) && iconish(node.text)) {
      const parent = node.parent;
      if (TEXT_ONLY.has(tagOf(parent))) { manual.push(`${file}:${line(node.getStart())}  <${tagOf(parent)}> 文本 ${node.text.trim()}`); return; }
      const raw = src.slice(node.pos, node.end);
      const out = raw.replace(EMO, m => KEEP.has(m.replace(/\uFE0F/g, '')) ? m : (used.add('Emo'), `<Emo e=${quote(m)} />`));
      edits.push([node.pos, node.end, out]);
      return;
    }
    if (ts.isJsxExpression(node) && node.expression && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) {
      const ex = node.expression;
      const parentTag = tagOf(node.parent);
      // R3
      if (ts.isPropertyAccessExpression(ex) && ['icon', 'emoji'].includes(ex.name.text)) {
        if (TEXT_ONLY.has(parentTag)) { manual.push(`${file}:${line(node.getStart())}  <${parentTag}> {${ex.getText()}}`); return; }
        used.add('Emo');
        edits.push([node.getStart(), node.end, `<Emo e={${ex.getText()}} />`]);
        return;
      }
      // R2
      if (literalHasEmoji(ex)) {
        if (TEXT_ONLY.has(parentTag)) { manual.push(`${file}:${line(node.getStart())}  <${parentTag}> ${ex.getText().slice(0, 80)}`); return; }
        if (hasJsx(ex)) { manual.push(`${file}:${line(node.getStart())}  表达式里有 JSX：${ex.getText().replace(/\s+/g, ' ').slice(0, 100)}`); ts.forEachChild(node, visit); return; }
        used.add('EmoText');
        edits.push([node.getStart(), node.end, `<EmoText text={${ex.getText()}} />`]);
        return;
      }
    }
    if (ts.isJsxAttribute(node) && node.initializer && literalHasEmoji(node.initializer)) {
      manual.push(`${file}:${line(node.getStart())}  属性 ${node.getText().replace(/\s+/g, ' ').slice(0, 100)}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!edits.length) continue;
  total += edits.length;
  console.log(`${file}: ${edits.length} 处 (${[...used].join(', ')})`);
  if (!WRITE) continue;

  let out = src;
  for (const [a, b, r] of edits.sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + r + out.slice(b);
  // import：已经有就补名字，没有就加一行在最后一个 import 后面
  const rel = path.relative(path.dirname(file), 'components/Emo').replace(/\\/g, '/');
  const spec = rel.startsWith('.') ? rel : './' + rel;
  const re = new RegExp(`import \\{([^}]*)\\} from '${spec.replace(/[.\/]/g, m => '\\' + m)}';`);
  const m = out.match(re);
  if (m) {
    const have = m[1].split(',').map(s => s.trim()).filter(Boolean);
    out = out.replace(re, `import { ${[...new Set([...have, ...used])].join(', ')} } from '${spec}';`);
  } else {
    const imports = [...out.matchAll(/^import [^;]+;\s*$/gm)];
    const at = imports.length ? imports[imports.length - 1].index + imports[imports.length - 1][0].length : 0;
    out = out.slice(0, at) + `\nimport { ${[...used].join(', ')} } from '${spec}';` + out.slice(at);
  }
  fs.writeFileSync(file, out);
}
console.log(`\n共 ${total} 处${WRITE ? '已改' : '（--write 才会改）'}`);
console.log(`\n要手动处理 ${manual.length} 处：\n` + manual.join('\n'));
