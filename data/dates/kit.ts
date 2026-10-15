import { DateVariant, VarietyOption } from '../varietyTypes';
export { say, joke, act } from '../reveals/kit';

// 约会的一套专属内容：两拍描写 + 一个选择（三个选项用 reveals/kit 的 say / joke / act 写）
// b1：你到的时候她在干什么；b2：一起待着的时候，只有她会做的一件小事
export const D = (b1: [string, string], b2: [string, string], prompt: [string, string], options: VarietyOption[]): DateVariant => ({
  beat1: { zh: b1[0], en: b1[1] },
  beat2: { zh: b2[0], en: b2[1] },
  promptZh: prompt[0], promptEn: prompt[1],
  options
});
