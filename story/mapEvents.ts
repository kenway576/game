import {
  MapEventDef, MapLocation, StoryFlags, StoryNode,
  GameCalendar, AffectionMap, FamiliarityMap, CharacterId
} from '../types';
import { AFTERSCHOOL_EVENTS } from './afterschoolEvents';
import { GROUP_EVENTS } from './groupEvents';
import { getInitialFamiliarity } from '../constants';

export const MAP_EVENTS: MapEventDef[] = [...AFTERSCHOOL_EVENTS, ...GROUP_EVENTS];

// 事件 id 同时就是"演过了"的 flag。不用另起一套命名，
// 也就不会出现 id 和 flag 对不上的那类 bug。
export const eventPlayed = (ev: MapEventDef, flags: StoryFlags) => !!flags[ev.id];

export interface EventContext {
  flags: StoryFlags;
  calendar: GameCalendar;
  affection: AffectionMap;
  familiarity: FamiliarityMap;
}

const famOf = (ctx: EventContext, id: CharacterId) =>
  ctx.familiarity[id] ?? getInitialFamiliarity(id);

export const eventAvailable = (ev: MapEventDef, ctx: EventContext): boolean => {
  if (!ev.repeatable && eventPlayed(ev, ctx.flags)) return false;
  if (ev.timeSlots && !ev.timeSlots.includes(ctx.calendar.timeSlot)) return false;
  if (ev.weather && !ev.weather.includes(ctx.calendar.weather)) return false;
  if (ev.requiresFlags && !ev.requiresFlags.every(f => ctx.flags[f])) return false;
  if (ev.forbidsFlags && ev.forbidsFlags.some(f => ctx.flags[f])) return false;
  if (ev.minAffection) {
    for (const [id, min] of Object.entries(ev.minAffection)) {
      if ((ctx.affection[id as CharacterId] || 0) < (min as number)) return false;
    }
  }
  if (ev.minFamiliarity) {
    for (const [id, min] of Object.entries(ev.minFamiliarity)) {
      if (famOf(ctx, id as CharacterId) < (min as number)) return false;
    }
  }
  return true;
};

// 去一个地方时演什么：条件都满足的事件里挑 priority 最高的。
// 探索事件（解锁新区域的那种）priority 给得最高，
// 因为"第一次走到这儿"必须排在任何偶遇前面。
export const pickEventFor = (locationId: string, ctx: EventContext): MapEventDef | null => {
  const pool = MAP_EVENTS
    .filter(ev => ev.locationId === locationId && eventAvailable(ev, ctx))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  return pool[0] || null;
};

// 地图上给这个地方标的角标：今天来这儿有没有戏。
// 只说"有"，不说是谁、不说是什么——否则地图就变成任务列表了。
export const locationHasEvent = (locationId: string, ctx: EventContext): boolean =>
  MAP_EVENTS.some(ev => ev.locationId === locationId && eventAvailable(ev, ctx));

export const isLocationUnlocked = (loc: MapLocation, flags: StoryFlags): boolean =>
  !loc.requiresFlag || !!flags[loc.requiresFlag];

export const isLocationOpenNow = (loc: MapLocation, calendar: GameCalendar): boolean =>
  !loc.timeSlots || loc.timeSlots.includes(calendar.timeSlot);

// 白跑一趟也得有东西看。没有事件可演时，用这个地方自己的空转旁白
// 拼一小段——一句景，一点点属性，然后回大厅。
export const buildAmbientScript = (loc: MapLocation, language: 'zh' | 'en'): StoryNode[] => {
  const zh = loc.ambientZh && loc.ambientZh.length
    ? loc.ambientZh
    : ['你在这儿待了一会儿。今天没有什么特别的事发生。'];
  const en = loc.ambientEn && loc.ambientEn.length
    ? loc.ambientEn
    : ['You spend a while here. Nothing in particular happens today.'];
  const i = Math.floor(Math.random() * zh.length);
  return [
    { type: 'scene', scene: loc.id, bgm: 'town', titleZh: loc.nameZh, titleEn: loc.nameEn },
    { type: 'narration', zh: zh[i] || zh[0], en: en[i] || en[0] },
    {
      type: 'effect',
      effects: [{
        stat: 'knowledge', amount: 1,
        reasonZh: '你又多认识了这座城市的一点',
        reasonEn: 'You know this city slightly better than you did'
      }]
    }
  ];
};
