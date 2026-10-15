import { DateVariant } from './varietyTypes';
import { ROOFTOP } from './dates/rooftop';
import { LAB } from './dates/lab';
import { GYM } from './dates/gym';
import { ARCADE } from './dates/arcade';
import { CAFE } from './dates/cafe';
import { PANCAKE } from './dates/pancake';
import { NANKINMACHI } from './dates/nankinmachi';
import { KARAOKE } from './dates/karaoke';
import { HARBOR } from './dates/harbor';
import { ZOO } from './dates/zoo';
import { AQUARIUM } from './dates/aquarium';
import { SHRINE } from './dates/shrine';
import { BEACH } from './dates/beach';
import { SUMMER_FESTIVAL } from './dates/summer_festival';
import { SETTLEMENT } from './dates/settlement';
import { JAZZ } from './dates/jazz';
import { COOK } from './dates/cook';
import { MOVIENIGHT } from './dates/movienight';
import { NIGHTVIEW } from './dates/nightview';
import { ONSEN } from './dates/onsen';
import { LUMINARIE } from './dates/luminarie';
import { TEPPANYAKI } from './dates/teppanyaki';

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
  rooftop: one(ROOFTOP), lab: one(LAB), gym: one(GYM), arcade: one(ARCADE), cafe: one(CAFE), pancake: one(PANCAKE),
  nankinmachi: one(NANKINMACHI), karaoke: one(KARAOKE),
  harbor: one(HARBOR), zoo: one(ZOO), aquarium: one(AQUARIUM),
  shrine: one(SHRINE), beach: one(BEACH), summer_festival: one(SUMMER_FESTIVAL),
  settlement: one(SETTLEMENT), jazz: one(JAZZ), cook: one(COOK), movienight: one(MOVIENIGHT),
  nightview: one(NIGHTVIEW), onsen: one(ONSEN), luminarie: one(LUMINARIE), teppanyaki: one(TEPPANYAKI)
};
