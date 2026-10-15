import { VarietyOption } from '../varietyTypes';
import { Mood } from '../outfitContext';

// ---------------------------------------------------------
// 换装亮相的三个回应（手写）的简写工具。每套衣服三个：
//   say(...)  用日语说出口的那一句（真心夸她）——走「日语作答」，带两个说错的版本；她会记得，以后自己穿来
//   joke(...) 开个玩笑 / 逗她（不说日语，只写意思）——好感少、亲密多
//   act(...)  不说话的那一个：一个动作
// 她的回答 reply = [表情, 日语, 中文, 英文]，按她自己的口吻和日语难度写（见 data/jpLevels.ts）。
// ---------------------------------------------------------

type Reply = [Mood, string, string, string];
type Wrong = [string, string, string];   // 说错的句子、错在哪（中）、错在哪（英）

const r = (x: Reply) => ({ mood: x[0], reply: { jp: x[1], zh: x[2], en: x[3] } });

export const say = (jp: string, zh: string, en: string, hintZh: string, hintEn: string, reply: Reply, minor: Wrong, major: Wrong): VarietyOption => ({
  labelZh: `「${zh}」`, labelEn: `"${en}"`, jp, hintZh, hintEn, aff: 6, fam: 2, ...r(reply),
  variant: { minor: minor[0], minorZh: minor[1], minorEn: minor[2], major: major[0], majorZh: major[1], majorEn: major[2] },
  praise: true
});

export const joke = (zh: string, en: string, hintZh: string, hintEn: string, reply: Reply): VarietyOption =>
  ({ labelZh: zh, labelEn: en, hintZh, hintEn, aff: 1, fam: 6, ...r(reply) });

export const act = (zh: string, en: string, hintZh: string, hintEn: string, reply: Reply): VarietyOption =>
  ({ labelZh: zh, labelEn: en, hintZh, hintEn, aff: 4, fam: 3, ...r(reply) });
