import {
  MapEventDef, MapLocation, StoryFlags, StoryNode,
  GameCalendar, AffectionMap, FamiliarityMap, CharacterId, TimeSlot
} from '../types';
import { AFTERSCHOOL_EVENTS } from './afterschoolEvents';
import { GROUP_EVENTS } from './groupEvents';
import { getInitialFamiliarity } from '../constants';
import { isSchoolDay, slotsForDay } from '../data/calendarLife';

export const MAP_EVENTS: MapEventDef[] = [...AFTERSCHOOL_EVENTS, ...GROUP_EVENTS];

// 事件 id 同时就是"演过了"的 flag。不用另起一套命名，
// 也就不会出现 id 和 flag 对不上的那类 bug。
export const eventPlayed = (ev: MapEventDef, flags: StoryFlags) => !!flags[ev.id];

export interface EventContext {
  flags: StoryFlags;
  calendar: GameCalendar;
  affection: AffectionMap;
  familiarity: FamiliarityMap;
  // 已经正式认识的人。不传 = 老调用点，一律按"都认识"处理，
  // 免得漏改一个地方就把所有事件都锁死。
  met?: CharacterId[];
}

// 没见过的人親密度按 0 算，不能拿设定表里的初始值。
// 那些数字（光 95、真希 100）说的是"认识之后有多熟"，
// 不是"素不相识时有多熟"——拿它去过門槛，就会出现
// 三个人的合照里站着一个你还没打过招呼的人。
const famOf = (ctx: EventContext, id: CharacterId) => {
  if (ctx.met && !ctx.met.includes(id)) return 0;
  return ctx.familiarity[id] ?? getInitialFamiliarity(id);
};

export const eventAvailable = (ev: MapEventDef, ctx: EventContext): boolean => {
  if (!ev.repeatable && eventPlayed(ev, ctx.flags)) return false;
  // 出场的人必须都认识。introduces 是给"这一场就是初次见面"留的口子。
  if (ctx.met && !ev.introduces && ev.chars.length
      && !ev.chars.every(c => ctx.met!.includes(c))) return false;
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

// 周末的两条规矩：
//   一、学校关门。周六周日整栋楼都进不去——这是"周末"最起码的样子。
//   二、"午休"那一格变成白天。平日的午休只走得到校内，
//      周末没有课，那一格就该是能出门的一整个上午。
// 于是周末不是"少了一格午休"，而是**多了一格能出门的白天**，
// 三格全部能往市区走。这才是放假。
export const isLocationOpenNow = (loc: MapLocation, calendar: GameCalendar): boolean => {
  // 「休息日」= 周末 + 日本的节假日 + 寒暑假。以前只认周末，
  // 于是黄金周和暑假里学校照常开门、午休照常只能待在校内。
  const weekend = !isSchoolDay(calendar);
  if (weekend && loc.district === 'school') return false;
  if (!loc.timeSlots) return true;
  if (weekend && calendar.timeSlot === 'lunch') {
    // 周末白天：按"午后开不开"来判断
    return loc.timeSlots.includes('afternoon') || loc.timeSlots.includes('lunch');
  }
  return loc.timeSlots.includes(calendar.timeSlot);
};

// ---------------------------------------------------------
// ⏳ 放学后的时间预算
//
// 一天放学后只有两格：午后和夜里。早上是上学，不作为外出时段。
// 每个地方按"实际会耗掉多久"标价：顺路拐进便利店是 1 格，
// 坐下吃一碗二郎系拉面、跑一趟有马温泉是 2 格——去完就只能回家了。
// 剩余格数不够时地图上照样列出来，但灰掉并写明"今天来不及了"。
// ---------------------------------------------------------
// 一天里玩家真正能动的三格。午休那一格只有校内开门，
// 靠每个地点自己的 timeSlots 卡住，不需要另写一套规则。
export const AFTERSCHOOL_SLOTS: TimeSlot[] = ['lunch', 'afternoon', 'night'];

// 今天还剩几格。早上视为一整天都还没用（第 1 章之后正常不会停在早上）。
export const slotsLeftToday = (calendar: GameCalendar): number => {
  // 寒暑假一天四格：假期真正的样子是"时间变多了"，不是"少了一节课"。
  const total = slotsForDay(calendar);
  const i = AFTERSCHOOL_SLOTS.indexOf(calendar.timeSlot);
  return i < 0 ? total : total - i;
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
// 白跑一趟的时候碰上了谁。碰上了就把这几句接在旁白后面。
export interface AmbientMeeting {
  met: string | null;      // CharacterId
  atZh: string; atEn: string;      // 她在那儿干什么
  awayNote: string | null;         // 排了她但她今天不在时的那句说明
  nameZh: string; nameEn: string;
}

export const buildAmbientScript = (
  loc: MapLocation, language: 'zh' | 'en', calendar: GameCalendar, meet?: AmbientMeeting
): StoryNode[] => {
  const zh = loc.ambientZh && loc.ambientZh.length
    ? loc.ambientZh
    : ['你在这儿待了一会儿。今天没有什么特别的事发生。'];
  const en = loc.ambientEn && loc.ambientEn.length
    ? loc.ambientEn
    : ['You spend a while here. Nothing in particular happens today.'];
  const i = Math.floor(Math.random() * zh.length);
  const out: StoryNode[] = [
    { type: 'scene', scene: sceneFor(loc, calendar), bgm: 'town', titleZh: loc.nameZh, titleEn: loc.nameEn },
    { type: 'narration', zh: zh[i] || zh[0], en: en[i] || en[0] }
  ];

  // 排了她、但今天她不在。扑空必须给理由——
  // 没理由的话玩家会以为是 bug，而不是"她今天真的不在"。
  if (!meet?.met && meet?.awayNote) {
    out.push({ type: 'narration', zh: meet.awayNote, en: meet.awayNote });
  }

  // 碰上了。这里只负责"看见她"，说话是这段播完之后的事。
  if (meet?.met) {
    if (meet.atZh) out.push({ type: 'narration', zh: meet.atZh, en: meet.atEn });
    out.push({
      type: 'narration',
      zh: `你走了过去。${meet.nameZh}抬起头。`,
      en: `You go over. ${meet.nameEn} looks up.`
    });
  }

  out.push({
    type: 'effect',
    effects: [{
      stat: 'knowledge', amount: 1,
      reasonZh: '你又多认识了这座城市的一点',
      reasonEn: 'You know this city slightly better than you did'
    }]
  });
  return out;
};
