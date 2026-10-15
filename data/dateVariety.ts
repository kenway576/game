// 自动生成：node scripts/grammar/gen-variety.mjs write —— 别手改（改 .generated/variety/dates.json 再写）
// 约会：每个地点 × 每个人的专属版本（她在这儿会做什么、一个只属于这次的选择）。用法见 data/dateData.ts。
import { VarietyOption } from './varietyTypes';
export interface DateVariant { beat1: { zh: string; en: string }; beat2: { zh: string; en: string }; promptZh: string; promptEn: string; options: VarietyOption[] }
export const DATE_VARIETY: Record<string, Record<string, DateVariant[]>> = {};
