import { GameCalendar, StoryFlags } from '../types';
import { dayIndex } from '../data/lifeData';

// ---------------------------------------------------------
// 🩹 防死档：把"按理说一定该有"的 flag 补回来
//
// 地图是一条链：day1_done → 三宫 → ev_sannomiya_first(map_harbor) → ev_portliner_first(map_far)。
// 链头那个 day1_done 一丢，整座城就只剩学校和北野，后面的事件一个都触发不了。
//
// 真遇到过：存档里 day1Done 是 true（第一天确实过完了），storyFlags 里却没有 day1_done
// 和任何 day1_met_x——老版本跳过第 1 章时不补 flag，存档就一直带着这个洞。
// finishDay1 现在会补，但已经过了第一天的存档不会再走一遍 finishDay1。
//
// 所以这里不靠"某个时刻有人记得置上"，而是每次状态变化都对一遍：
// 缺了就补。读档、跨天、甚至内存里的当前进度都能自己修好。
// ---------------------------------------------------------

// 第 1 章走完一定会有的那批 flag（跳没跳过都一样）。finishDay1 也用这一份。
export const DAY1_GUARANTEED_FLAGS: StoryFlags = {
  day1_done: true,
  day1_met_asuka: true, day1_met_hikari: true, day1_met_sora: true,
  day1_met_rei: true, day1_met_maki: true, day1_met_inari: true, day1_met_nao: true
};

// 地图的保底：本来靠"你真的走到过那儿"解锁，这个不改。
// 但玩家要是一直没想起来去三宫站、去轻轨站，地图就永远那么大——
// 所以过了这个日期还没开，就当他早晚会摸过去，直接打开。
// 第一次走到那儿的探索剧情照样会演（事件只认"演没演过"，不认 map_ flag 是谁给的）。
const MAP_FALLBACKS: { flag: string; requires: string; month: number; day: number }[] = [
  { flag: 'map_harbor', requires: 'day1_done', month: 5, day: 6 },   // 黄金周过完
  { flag: 'map_far',    requires: 'map_harbor', month: 6, day: 1 }    // 来了快两个月
];

// 返回需要补上的 flag；什么都不缺就返回 null（调用方据此决定要不要 setState）
export const missingSafetyFlags = (
  flags: StoryFlags,
  opts: { day1Done: boolean },
  calendar: GameCalendar
): StoryFlags | null => {
  const add: StoryFlags = {};
  if (opts.day1Done) {
    for (const k of Object.keys(DAY1_GUARANTEED_FLAGS)) if (!flags[k]) add[k] = true;
  }
  const has = (k: string) => !!flags[k] || !!add[k];
  const today = dayIndex(calendar);
  for (const fb of MAP_FALLBACKS) {
    if (has(fb.flag) || !has(fb.requires)) continue;
    if (today >= dayIndex({ ...calendar, year: 1, month: fb.month, day: fb.day })) add[fb.flag] = true;
  }
  return Object.keys(add).length ? add : null;
};
