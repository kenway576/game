import { DateVariant } from './varietyTypes';
import { ROOFTOP } from './dates/rooftop';
import { LAB } from './dates/lab';
import { GYM } from './dates/gym';
import { ARCADE } from './dates/arcade';
import { CAFE } from './dates/cafe';
import { PANCAKE } from './dates/pancake';

export type { DateVariant } from './varietyTypes';

// ---------------------------------------------------------
// 约会：每个地点 × 每个人一套专属内容（手写，data/dates/<地点>.ts）
//
// 以前到场描写、两段情节和中间那个选择都是按地点写的一套，用 {her} 换个名字——
// 跟谁去天台，读到的都是同一段话。现在每个人在每个地方都有她自己会做的事、只属于这一次的选择，
// 她的回答按她自己的口吻和日语难度写（data/jpLevels.ts）。
// 同一个人第二次去同一个地方，会在她的专属版本和原来的通用版之间轮换（见 data/dateData.ts）。
// ---------------------------------------------------------
const one = (m: Record<string, DateVariant>): Record<string, DateVariant[]> =>
  Object.fromEntries(Object.entries(m).map(([c, v]) => [c, [v]]));

export const DATE_VARIETY: Record<string, Record<string, DateVariant[]>> = {
  rooftop: one(ROOFTOP), lab: one(LAB), gym: one(GYM), arcade: one(ARCADE), cafe: one(CAFE), pancake: one(PANCAKE)
};
