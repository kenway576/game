import { Mood } from './outfitContext';

// 生成出来的约会 / 换装选项（data/dateVariety.ts、data/revealChoices.ts）共用的形状
export interface VarietyOption {
  labelZh: string; labelEn: string;
  hintZh: string; hintEn: string;
  // 主角说出口的那句日语（有的话就走「日语作答」）
  jp?: string;
  // 这句日语的两个说错的版本（跟 data/grammarChoices.ts 同一种格式）
  variant?: { minor: string; minorZh: string; minorEn: string; major: string; majorZh: string; majorEn: string };
  aff: number; fam: number;
  mood: Mood;
  reply: { jp: string; zh: string; en: string };
  after?: { zh: string; en: string };
  // 换装那一组里"真心夸她"的那一个：她会记得，以后自己穿来
  praise?: boolean;
}
