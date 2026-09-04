import { CharacterId, GameCalendar, StoryFlags, StoryNode, FamiliarityMap } from '../types';
import { DayKind, dayKindOf } from './calendarLife';
import {
  seasonOf, HOME_DAY, STUDY_DAY, PART_TIME, CHORES_DAY,
  CLUB_BASKETBALL, CLUB_ASTRONOMY, CLUB_COUNCIL, CLUB_MUSIC,
  OUTING_BY_SEASON, OUTING_CAST,
  SKIP_SLEEP, SKIP_WANDER, TRIP_OSAKA, TRIP_KYOTO
} from '../story/restDayScenes';
import { getInitialFamiliarity } from '../constants';

// ---------------------------------------------------------
// 🗓️ 今天怎么过
//
// 休息日早上，大厅弹一次这个面板。选一个，那一天就按那个走。
// 有几条规矩：
//
//   一、"出门逛逛"永远在。不想被安排的时候，地图照旧。
//   二、社团要认识那个人，而且得熟到她愿意在休息日看见你。
//   三、郊游要两个人都认识 —— 一整天的约，不能带生人去。
//   四、每样一年只演一次（郊游按季节，一年四次各一次）。
//       演过的不再出现在面板上，位置留给别的。
//
// 面板不列"你还没解锁"的灰条：能选的才显示。
// 玩家看到的是"今天可以做这些"，不是"你还差多少"。
// ---------------------------------------------------------

export interface RestPlanCtx {
  calendar: GameCalendar;
  flags: StoryFlags;
  met: CharacterId[];
  familiarity: FamiliarityMap;
}

export interface RestPlan {
  id: string;
  icon: string;
  titleZh: string; titleEn: string;
  descZh: string; descEn: string;
  // 这一趟花掉一整天（true）还是只花一格（false）
  wholeDay: boolean;
  // 哪几种日子给这个选项
  kinds: DayKind[];
  script: (ctx: RestPlanCtx) => StoryNode[];
  // 能不能选
  available: (ctx: RestPlanCtx) => boolean;
  // 演过一次就不再出现
  doneFlag: (ctx: RestPlanCtx) => string;
}

const famOf = (ctx: RestPlanCtx, id: CharacterId) =>
  ctx.familiarity[id] ?? getInitialFamiliarity(id);

const knows = (ctx: RestPlanCtx, id: CharacterId, min: number) =>
  ctx.met.includes(id) && famOf(ctx, id) >= min;

const ALL: DayKind[] = ['weekend', 'holiday', 'vacation'];
// 有课的那些日子。翘课这件事只在这里成立——
// 周末不上学不叫翘课，叫周末。
const SCHOOL: DayKind[] = ['school'];
const ANY: DayKind[] = ['school', 'weekend', 'holiday', 'vacation'];

// 社团：一个人一个部。休息日的社团是自愿的，
// 所以门槛不低——親密度 90（朋友）才谈得上"休息日专门去看她练球"。
const CLUBS: { id: string; char: CharacterId; icon: string; zh: string; en: string; descZh: string; descEn: string; script: StoryNode[] }[] = [
  { id: 'club_basketball', char: CharacterId.SORA, icon: '🏀', zh: '篮球部的休日练习', en: 'Basketball, weekend practice',
    descZh: '体育馆只开一半的灯，来的人都是自愿的。', descEn: 'Half the lights on, and everybody there chose to be.',
    script: CLUB_BASKETBALL },
  { id: 'club_astronomy', char: CharacterId.REI, icon: '🔭', zh: '天文部的观测日', en: 'Astronomy, observation night',
    descZh: '通知只有一行：「今夜、快晴。二十時。」', descEn: 'The notice was one line: clear tonight, eight o\'clock.',
    script: CLUB_ASTRONOMY },
  { id: 'club_council', char: CharacterId.ASUKA, icon: '📋', zh: '学生会室的灯还亮着', en: 'The council room light is on',
    descZh: '放假也开着。里面只有一个人。', descEn: 'On a day off. With one person inside.',
    script: CLUB_COUNCIL },
  { id: 'club_music', char: CharacterId.MAKI, icon: '🎸', zh: '音乐室里有很吵的声音', en: 'Something loud in the music room',
    descZh: '走近了才听出来是有人在弹，不是在放。', descEn: 'Up close you realise somebody is playing it, not playing it back.',
    script: CLUB_MUSIC }
];

export const REST_PLANS: RestPlan[] = [
  // ---- 出门。永远在，也永远不算"用掉了今天"。 ----
  {
    id: 'go_out', icon: '🚶', kinds: ALL, wholeDay: false,
    titleZh: '出门逛逛', titleEn: 'Just go out',
    descZh: '不定计划。地图上今天开着的地方都能去。', descEn: 'No plan. Everywhere open today is on the map.',
    script: () => [],
    available: () => true,
    doneFlag: () => ''
  },

  // ---- 翘课。只有上学日才有。 ----
  {
    id: 'skip_sleep', icon: '🛏️', kinds: SCHOOL, wholeDay: true,
    titleZh: '今天不去了，睡一天', titleEn: 'Not today. Sleep through it.',
    descZh: '闹钟响两次，你两次都按掉了。学识会掉——课是真的没上。',
    descEn: 'Two alarms, both dismissed. Knowledge will drop; the lessons really did happen without you.',
    script: () => SKIP_SLEEP,
    available: ctx => !!ctx.flags['day1_done'],
    doneFlag: () => 'skip_school_slept'
  },
  {
    id: 'skip_wander', icon: '🚃', kinds: SCHOOL, wholeDay: true,
    titleZh: '翘课，坐反方向的电车', titleEn: 'Skip. Take the train the other way.',
    descZh: '穿着制服在工作日的白天到处走。学识会掉，别的东西会涨。',
    descEn: 'A school uniform out in the city on a weekday. Knowledge drops. Other things do not.',
    script: () => SKIP_WANDER,
    available: ctx => !!ctx.flags['day1_done'],
    doneFlag: () => 'skip_school_wandered'
  },

  // ---- 在家。四季各一段。上学日也能选——请假在家这件事，
  //      本来就跟今天是不是周末没关系。 ----
  {
    id: 'stay_home', icon: '🏠', kinds: ANY, wholeDay: true,
    titleZh: '一整天不出门', titleEn: 'Stay in all day',
    descZh: '不见任何人，不做任何事。这个游戏其他任何时候都不给你这个。',
    descEn: 'Nobody, nothing. The game does not offer this at any other time.',
    script: ctx => HOME_DAY[seasonOf(ctx.calendar)],
    available: () => true,
    doneFlag: ctx => `restday_home_${seasonOf(ctx.calendar)}`
  },

  // ---- 郊游。一年四次，一次两个人。 ----
  {
    id: 'outing', icon: '🚌', kinds: ALL, wholeDay: true,
    titleZh: '约人出去一整天', titleEn: 'A whole day out with people',
    descZh: '花見、海、紅葉、初詣——一年四次，各有各的人。',
    descEn: 'Blossom, sea, autumn colour, the New Year visit. Four a year, each with its own people.',
    script: ctx => OUTING_BY_SEASON[seasonOf(ctx.calendar)],
    available: ctx => OUTING_CAST[seasonOf(ctx.calendar)].every(c => knows(ctx, c, 90)),
    doneFlag: ctx => `restday_outing_${seasonOf(ctx.calendar)}`
  },

  // ---- 远门。人多，门槛也高：一个只见过两次面的人，
  //      不能带去坐一个小时的电车。 ----
  {
    id: 'trip_osaka', icon: '🚄', kinds: ALL, wholeDay: true,
    titleZh: '四个人去一趟大阪', titleEn: 'Four of you, a day in Osaka',
    descZh: '新世界的串炸，通天阁底下的一场僵持，道顿堀六点集合。',
    descEn: 'Kushikatsu in Shinsekai, a stand-off under Tsutenkaku, and six at Dotonbori.',
    script: () => TRIP_OSAKA,
    available: ctx => [CharacterId.ASUKA, CharacterId.HIKARI, CharacterId.SORA, CharacterId.MAKI]
      .every(c => knows(ctx, c, 110)),
    doneFlag: () => 'restday_trip_osaka'
  },
  {
    id: 'trip_kyoto', icon: '⛩️', kinds: ALL, wholeDay: true,
    titleZh: '五个人去一趟京都', titleEn: 'Five of you, a day in Kyoto',
    descZh: '伏见稻荷的一万座鸟居、岚山的竹林、傍晚鸭川等间隔的那一排。',
    descEn: 'Ten thousand gates at Fushimi, the bamboo at Arashiyama, and the evenly spaced row on the Kamo at dusk.',
    script: () => TRIP_KYOTO,
    available: ctx => [CharacterId.MIYUKI, CharacterId.REI, CharacterId.NAO, CharacterId.INARI]
      .every(c => knows(ctx, c, 110)),
    doneFlag: () => 'restday_trip_kyoto'
  },

  // ---- 用功 / 打工 / 大扫除。数值向，但都有一段。 ----
  {
    id: 'study_day', icon: '📚', kinds: ALL, wholeDay: true,
    titleZh: '在图书馆坐一整天', titleEn: 'A whole day in the library',
    descZh: '休息日的市立图书馆比平日空。三楼靠窗那排全是空的。',
    descEn: 'The city library is emptier on a day off. The whole window row is free.',
    script: () => STUDY_DAY,
    available: () => true,
    doneFlag: () => 'restday_study_done'
  },
  {
    id: 'part_time', icon: '💴', kinds: ALL, wholeDay: true,
    titleZh: '去便利店顶一天班', titleEn: 'Cover a shift at the convenience store',
    descZh: '时薪一千零五十日元。「いらっしゃいませ」说两百四十次。',
    descEn: 'A thousand and fifty yen an hour, and the welcome line two hundred and forty times.',
    script: () => PART_TIME,
    available: ctx => !!ctx.flags['day1_done'],
    doneFlag: () => 'restday_parttime_done'
  },
  {
    id: 'chores', icon: '🧹', kinds: ALL, wholeDay: false,
    titleZh: '把屋子彻底收拾一遍', titleEn: 'Clean the flat properly',
    descZh: '上一次这么做是搬进来那天。', descEn: 'The last time was the day you moved in.',
    script: () => CHORES_DAY,
    available: () => true,
    doneFlag: () => 'restday_chores_done'
  },

  // ---- 社团。四个部，各挂一个人。 ----
  ...CLUBS.map<RestPlan>(c => ({
    id: c.id, icon: c.icon, kinds: ALL, wholeDay: false,
    titleZh: c.zh, titleEn: c.en, descZh: c.descZh, descEn: c.descEn,
    script: () => c.script,
    available: ctx => knows(ctx, c.char, 90),
    doneFlag: () => `restday_${c.id}`
  }))
];

// 今天能选的那些。演过的不再出现。
export const plansFor = (ctx: RestPlanCtx): RestPlan[] => {
  const kind = dayKindOf(ctx.calendar);
  return REST_PLANS.filter(p => {
    if (!p.kinds.includes(kind)) return false;
    if (!p.available(ctx)) return false;
    const f = p.doneFlag(ctx);
    return !f || !ctx.flags[f];
  });
};

// 今天已经定过计划了吗。一天只问一次。
export const plannedFlag = (cal: GameCalendar) =>
  `restplan_${cal.year ?? 1}_${cal.month}_${cal.day}`;
