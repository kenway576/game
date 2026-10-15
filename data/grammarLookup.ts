import { GRAMMAR_VARIANTS, GrammarVariant } from './grammarChoices';
import { DATE_VARIETY } from './dateVariety';
import { REVEAL_CHOICES } from './revealChoices';

// 「日语作答」查一句话的两个错误版本：
// 手写剧情的选项在 grammarChoices 里；生成出来的约会 / 换装选项，错误版本跟着内容一起存。
let extra: Record<string, GrammarVariant> | null = null;
const build = () => {
  const m: Record<string, GrammarVariant> = {};
  for (const byChar of Object.values(DATE_VARIETY)) for (const vs of Object.values(byChar)) for (const v of vs)
    for (const o of v.options) if (o.jp && o.variant) m[o.jp.trim()] = o.variant;
  for (const byOutfit of Object.values(REVEAL_CHOICES)) for (const opts of Object.values(byOutfit))
    for (const o of opts) if (o.jp && o.variant) m[o.jp.trim()] = o.variant;
  return m;
};

export const grammarVariantOf = (jp?: string): GrammarVariant | undefined => {
  if (!jp) return undefined;
  const k = jp.trim();
  if (GRAMMAR_VARIANTS[k]) return GRAMMAR_VARIANTS[k];
  extra ||= build();
  return extra[k];
};
