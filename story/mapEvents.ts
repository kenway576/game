import {
  MapEventDef, MapLocation, StoryFlags, StoryNode,
  GameCalendar, AffectionMap, FamiliarityMap, CharacterId, TimeSlot
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

// ---------------------------------------------------------
// ⏳ 放学后的时间预算
//
// 一天放学后只有两格：午后和夜里。早上是上学，不作为外出时段。
// 每个地方按"实际会耗掉多久"标价：顺路拐进便利店是 1 格，
// 坐下吃一碗二郎系拉面、跑一趟有马温泉是 2 格——去完就只能回家了。
// 剩余格数不够时地图上照样列出来，但灰掉并写明"今天来不及了"。
// ---------------------------------------------------------
export const AFTERSCHOOL_SLOTS: TimeSlot[] = ['afternoon', 'night'];

// 今天还剩几格。早上视为一整天都还没用（第 1 章之后正常不会停在早上）。
export const slotsLeftToday = (calendar: GameCalendar): number => {
  const i = AFTERSCHOOL_SLOTS.indexOf(calendar.timeSlot);
  return i < 0 ? AFTERSCHOOL_SLOTS.length : AFTERSCHOOL_SLOTS.length - i;
};

// 这一趟要花几格。事件可以覆盖地点的默认值；市外(far)默认就是 2 格。
export const getTimeCost = (loc: MapLocation, ev?: MapEventDef | null): number =>
  ev?.timeCost ?? loc.timeCost ?? (loc.district === 'far' ? 2 : 1);

// 今天的时间还够不够去这一趟
export const canAffordLocation = (
  loc: MapLocation, calendar: GameCalendar, ctx?: EventContext
): boolean => {
  const ev = ctx ? pickEventFor(loc.id, ctx) : null;
  return getTimeCost(loc, ev) <= slotsLeftToday(calendar);
};

// 这一趟该看见哪张图。
// 夜里有专门的夜景就用夜景；否则在这个地方的几张图里随机挑一张。
// 挑图和挑旁白是分开随机的：同一句话配不同的画面，重复去的观感差别更大。
export const sceneFor = (loc: MapLocation, calendar: GameCalendar): string => {
  if (calendar.timeSlot === 'night' && loc.nightScene) return loc.nightScene;
  const pool = [loc.id, ...(loc.extraScenes || [])];
  return pool[Math.floor(Math.random() * pool.length)];
};

// 地图上预览用哪张。挑地方的时候看的是门脸，不是屋里。
export const mapSceneFor = (loc: MapLocation): string => loc.mapScene || loc.id;

// 白跑一趟也得有东西看。没有事件可演时，用这个地方自己的空转旁白
// 拼一小段——一句景，一点点属性，然后回大厅。
export const buildAmbientScript = (loc: MapLocation, language: 'zh' | 'en', calendar: GameCalendar): StoryNode[] => {
  const zh = loc.ambientZh && loc.ambientZh.length
    ? loc.ambientZh
    : ['你在这儿待了一会儿。今天没有什么特别的事发生。'];
  const en = loc.ambientEn && loc.ambientEn.length
    ? loc.ambientEn
    : ['You spend a while here. Nothing in particular happens today.'];
  const i = Math.floor(Math.random() * zh.length);
  return [
    { type: 'scene', scene: sceneFor(loc, calendar), bgm: 'town', titleZh: loc.nameZh, titleEn: loc.nameEn },
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
