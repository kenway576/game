// 把 .generated/grammar/variants.json 里已经生成好的写进 data/grammarChoices.ts（不调用模型）
//   node scripts/grammar/write-variants.mjs
import fs from 'fs';
const list = JSON.parse(fs.readFileSync('.generated/grammar/choices.json', 'utf8'));
const done = JSON.parse(fs.readFileSync('.generated/grammar/variants.json', 'utf8'));
const final = {};
const F = ['minor', 'minorZh', 'minorEn', 'major', 'majorZh', 'majorEn'];
for (const x of list) {
  const v = done[x.jp];
  // 中文的"错在哪"是必须的（玩家看的就是它）；英文缺了就留空
  if (!v || !v.minor || !v.major || !v.minorZh || !v.majorZh) continue;
  final[x.jp] = Object.fromEntries(F.map(k => [k, String(v[k] ?? '')]));
}
fs.writeFileSync('data/grammarChoices.ts', `// 自动生成：node scripts/grammar/gen-variants.mjs（或 write-variants.mjs）—— 别手改（要改就改 .generated/grammar/variants.json 再重写）
// 剧情选项的日语原句 → 两个说错的版本 + 错在哪。用法见 components/StoryScreen.tsx 的「日语作答」。
// 没收进来的句子照旧直接显示日语原句（不走作答）。
export interface GrammarVariant { minor: string; minorZh: string; minorEn: string; major: string; majorZh: string; majorEn: string }
export const GRAMMAR_VARIANTS: Record<string, GrammarVariant> = ${JSON.stringify(final, null, 1)};
`);
console.log('data/grammarChoices.ts', Object.keys(final).length, '/', list.length);
