import { CharacterId, GameCalendar, StoryFlags } from '../types';

// ---------------------------------------------------------
// 🕛 谁什么时候在哪儿
//
// 【为什么要有作息表】
// 加了午休时段之后，第一个要决定的事是"这一格谁在场"。
// 随机的话，玩家只会反复进出午休刷到想见的人为止——那不是选择，是抽奖。
// 固定作息不一样：空周三在体育馆、铃每天在图书室、真希只在放学后的高架下。
// 这份表是可以被**学会**的，而"记住她哪天在哪儿"本身就是玩法，
// 也是这个游戏里唯一一处"你了解她"能变成机制的地方。
//
// 【少量意外】
// 全固定会变成打卡。所以每天按日期算一个稳定的随机数，
// 大约七分之一的日子有人不在原地——社团去客场、被老师叫走、请假。
// 关键是**不在的时候要给一句说明**：扑空可以，但不能没有理由，
// 否则玩家会以为是 bug 而不是那天她真的不在。
//
// 意外是按日期定的，所以同一天重开游戏结果一样。这一条很重要：
// 玩家扑了个空，重开一次就能改，那这套表就白做了。
// ---------------------------------------------------------

// 周一到周日。GameCalendar.dayOfWeek 存的是「月 (Mon)」这种，取首字。
export const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'] as const;

export const weekdayIndex = (cal: GameCalendar): number => {
  const c = (cal.dayOfWeek || '').charAt(0);
  const i = (WEEKDAY_JP as readonly string[]).indexOf(c);
  return i < 0 ? 1 : i;   // 认不出来就当周一，至少不会崩
};

export const isWeekend = (cal: GameCalendar) => {
  const d = weekdayIndex(cal);
  return d === 0 || d === 6;
};

// 一个人一周的午休去处。key 是星期几（0=日 … 6=土），value 是地点 id。
// 没写的那天她不在校内任何一个能碰到的地方。
type Week = Partial<Record<number, string>>;

export interface LunchSpot {
  char: CharacterId;
  week: Week;
  // 她在那儿干什么。空转时用这一句，让"看见她"本身就有内容。
  atZh: string; atEn: string;
}

// ---------------------------------------------------------
// 午休作息（周一～周五）
//
// 排的时候有两条规矩：
//   一、每个人的地点要符合她是谁——空在体育馆，铃在图书室，
//       稻荷在神社（她根本不是学生，只是那片林子挨着学校）。
//   二、每一天都得有人可见，但**没有哪一天所有人都在**。
//       否则午休就变成"随便挑一个"，又回到菜单了。
// ---------------------------------------------------------
export const LUNCH_SCHEDULE: LunchSpot[] = [
  {
    char: CharacterId.ASUKA,
    // 委员长的午休不是休息时间。周二周四在委员会的活儿上。
    week: { 1: 'classroom_morning', 2: 'school_library', 4: 'school_library', 5: 'classroom_morning' },
    atZh: '她把便当摊在讲台上批东西，一边吃一边写。',
    atEn: 'She has her lunch open on the teacher’s desk and is marking something while she eats.'
  },
  {
    char: CharacterId.HIKARI,
    // 她哪天都在，但地方一直换——她是去找人的，不是去待着的。
    week: { 1: 'school_terrace', 2: 'courtyard_rain', 3: 'school_terrace', 4: 'international_office', 5: 'rooftop_sunset' },
    atZh: '她一个人占了六个人的桌子，正在朝你挥手，挥得整个食堂都看得见。',
    atEn: 'She has a six-person table to herself and is waving at you hard enough for the entire hall to notice.'
  },
  {
    char: CharacterId.REI,
    // 每天同一个位置。她这个人的作息本身就是一条常数。
    week: { 1: 'school_library', 2: 'school_library', 3: 'school_library', 4: 'school_library', 5: 'school_library' },
    atZh: '靠窗最里面那张桌子。她面前摊着六本书，午饭没动过。',
    atEn: 'The far table by the window. Six books open in front of her, lunch untouched.'
  },
  {
    char: CharacterId.SORA,
    // 周三周五是自主练习日，其余时间她在食堂吃两份。
    week: { 1: 'school_terrace', 3: 'gym', 5: 'gym' },
    atZh: '球撞地板的声音隔着门就听得见。她一个人在投篮，午饭放在场边没拆。',
    atEn: 'You can hear the ball through the door. She is shooting alone; her lunch is on the bench, unopened.'
  },
  {
    char: CharacterId.NAO,
    // 她会主动来找你，所以位置跟着你走——中庭是两个人默认的会合点。
    week: { 2: 'courtyard_rain', 3: 'school_terrace', 4: 'courtyard_rain' },
    atZh: '她已经坐在那儿了，旁边空着一个位置，书包放在上面占着。',
    atEn: 'She is already sitting there with the place beside her kept, her bag on it.'
  },
  {
    char: CharacterId.MAKI,
    // 一年级的午休不在这栋楼。她只在自行车棚出现——因为那儿没人管。
    week: { 3: 'school_bicycle_parking', 5: 'school_bicycle_parking' },
    atZh: '她蹲在车棚最里面打游戏，看见你就把手机往身后一藏，藏得非常明显。',
    atEn: 'She is crouched at the back of the bike shed on her phone, and hides it behind her the moment she sees you, extremely visibly.'
  },
  {
    char: CharacterId.INARI,
    // 她不是学生。她只是碰巧住在学校旁边那片林子里一千年了。
    week: { 1: 'ikuta_shrine', 4: 'ikuta_shrine' },
    atZh: '她赤着脚坐在石头上，手里拿着一个不知道从哪儿来的三明治。',
    atEn: 'She is sitting barefoot on the rock with a sandwich that has come from somewhere unspecified.'
  },
  {
    char: CharacterId.MIYUKI,
    // 深雪不在学校。午休见不到她——这本身就是设定的一部分：
    // 她是隔壁那个大人，只有回家才见得到。
    week: {},
    atZh: '', atEn: ''
  }
];

// 当天的稳定随机：同一天重开结果一样。
const dayHash = (cal: GameCalendar, salt: number) => {
  let h = (cal.month * 31 + cal.day) * 2654435761 + salt * 40503;
  h = (h ^ (h >>> 13)) >>> 0;
  return (h % 1000) / 1000;
};

// 今天她不在原地的理由。给得出理由，扑空才是剧情，不是 bug。
const AWAY_ZH = [
  '今天不在。听说社团去客场了。',
  '今天不在。有人说她被老师叫去帮忙了。',
  '今天不在。桌上留着没喝完的牛奶。',
  '今天不在。请假了，没说为什么。'
];
const AWAY_EN = [
  'Not here today. The club is away, apparently.',
  'Not here today. Someone says a teacher pulled her in to help with something.',
  'Not here today. There is a half-finished milk on the desk.',
  'Not here today. Off sick, with no reason given.'
];

export interface LunchPresence {
  char: CharacterId;
  locationId: string;
  atZh: string; atEn: string;
}

// 今天午休，某个地方有谁。
// 周末没有午休（学校不开），返回 null。
export const lunchPresenceAt = (
  locationId: string, cal: GameCalendar, flags: StoryFlags, met: CharacterId[]
): LunchPresence | null => {
  if (isWeekend(cal)) return null;
  const d = weekdayIndex(cal);
  for (const s of LUNCH_SCHEDULE) {
    if (s.week[d] !== locationId) continue;
    if (!met.includes(s.char)) continue;          // 没认识的人不会在你眼里"在那儿"
    if (dayHash(cal, s.char.length * 17) < 0.14) return null;   // 今天她不在
    return { char: s.char, locationId, atZh: s.atZh, atEn: s.atEn };
  }
  return null;
};

// 今天午休排了她、但她不在的时候，给的那句说明
export const lunchAwayNote = (
  locationId: string, cal: GameCalendar, language: 'zh' | 'en'
): string | null => {
  if (isWeekend(cal)) return null;
  const d = weekdayIndex(cal);
  const s = LUNCH_SCHEDULE.find(x => x.week[d] === locationId);
  if (!s) return null;
  if (dayHash(cal, s.char.length * 17) >= 0.14) return null;
  const i = Math.floor(dayHash(cal, s.char.length * 23) * AWAY_ZH.length);
  return language === 'en' ? AWAY_EN[i] : AWAY_ZH[i];
};

// 今天午休，哪些地方有人。地图上给这些地方打个人影角标，
// 让玩家在挑之前就能看出"今天值得去哪儿"——但不写是谁。
// 写了是谁，午休就变成任务列表；不写，玩家才会去记那张表。
export const lunchSpotsToday = (
  cal: GameCalendar, flags: StoryFlags, met: CharacterId[]
): string[] => {
  if (isWeekend(cal)) return [];
  const d = weekdayIndex(cal);
  return LUNCH_SCHEDULE
    .filter(s => s.week[d] && met.includes(s.char) && dayHash(cal, s.char.length * 17) >= 0.14)
    .map(s => s.week[d] as string);
};

// ---------------------------------------------------------
// 放学后的偶遇
//
// 去一个地方，如果没有专门的剧情事件，这地方的"常客"有可能在。
// 概率跟关系走：越熟越容易碰上，因为你越熟就越知道她什么时候在哪儿——
// 这是把"了解一个人"直接写成了概率。
// 同样按日期定，扑空了重开也没用。
// ---------------------------------------------------------
export const encounterAt = (
  locationId: string, regulars: CharacterId[] | undefined,
  cal: GameCalendar, met: CharacterId[], familiarity: Record<string, number>
): CharacterId | null => {
  if (!regulars || !regulars.length) return null;
  const pool = regulars.filter(c => met.includes(c));
  if (!pool.length) return null;
  // 时段也算进去：夜里在学校碰不到人
  const salt = locationId.length * 7 + (cal.timeSlot === 'night' ? 3 : 0);
  const roll = dayHash(cal, salt);
  const who = pool[Math.floor(dayHash(cal, salt + 11) * pool.length)];
  const fam = familiarity[who] ?? 0;
  // 生疏 25%，熟到顶 55%
  const chance = 0.25 + Math.min(0.3, fam / 260 * 0.3);
  return roll < chance ? who : null;
};
