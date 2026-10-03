import { isSchoolDay } from './calendarLife';
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

// 午休排班只在上学日成立。周末、节假日、寒暑假都没有午休这一格——
// 以前只挡了周末，于是黄金周和暑假里她还照常"在图书室"。
export const noLunchRota = (cal: GameCalendar) => !isSchoolDay(cal);

// 一个人一周的午休去处。key 是星期几（0=日 … 6=土），value 是地点 id。
// 没写的那天她不在校内任何一个能碰到的地方。
type Week = Partial<Record<number, string>>;

export interface LunchSpot {
  char: CharacterId;
  week: Week;
  // 她在那儿干什么。空转时用这一句，让"看见她"本身就有内容。
  atZh: string; atEn: string;
  // 她一周跑好几个地方的，每个地方各写一句。以前只有一句——
  // 光那句「一个人占了六个人的桌子」是写食堂的，结果去国际交流室也是这一句。
  atBy?: Record<string, { zh: string; en: string }>;
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
    atEn: 'She has her lunch open on the teacher’s desk and is marking something while she eats.',
    atBy: {
      school_library: {
        zh: '她占着图书室靠门的那张桌子在整理委员会的文件，便当盒压在一摞表格上，盖子都没打开。',
        en: 'She has the table by the library door and is sorting committee paperwork. Her lunch box is weighing down a pile of forms, lid still on.'
      }
    }
  },
  {
    char: CharacterId.HIKARI,
    // 她哪天都在，但地方一直换——她是去找人的，不是去待着的。
    week: { 1: 'school_terrace', 2: 'courtyard_rain', 3: 'school_terrace', 4: 'international_office', 5: 'rooftop_sunset' },
    atZh: '她一个人占了六个人的桌子，正在朝你挥手，挥得整个食堂都看得见。',
    atEn: 'She has a six-person table to herself and is waving at you hard enough for the entire hall to notice.',
    atBy: {
      courtyard_rain: {
        zh: '她坐在中庭的长椅上，跟两个你不认识的人聊得正开心。看见你，她把手举得老高。',
        en: 'She is on a courtyard bench, deep in conversation with two people you do not know. When she spots you, her hand goes straight up.'
      },
      international_office: {
        zh: '她在国际交流室里，拿着一张留学生交流会的海报，正缠着老师问能不能再多贴几张。',
        en: 'She is in the international office with a poster for the exchange-student mixer, pestering the teacher about putting up a few more.'
      },
      rooftop_sunset: {
        zh: '她靠在天台的栏杆上啃面包，风把她的头发吹得乱七八糟，她一点也不在乎。',
        en: 'She is leaning on the rooftop rail eating a bread roll. The wind has made a mess of her hair and she could not care less.'
      }
    }
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
    atEn: 'You can hear the ball through the door. She is shooting alone; her lunch is on the bench, unopened.',
    atBy: {
      school_terrace: {
        zh: '食堂角落里，她面前摆着两份定食，第一份已经见底了。',
        en: 'In a corner of the cafeteria she has two set lunches in front of her. The first is already gone.'
      }
    }
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
    atZh: '她坐在那块石头上，手里拿着一个不知道从哪儿来的三明治。九条尾巴摊在四月的落叶上。',
    atEn: 'She is sitting on that rock with a sandwich that has come from somewhere unspecified. Nine tails spread out across the April leaf litter.'
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
// 以前是 (日期 × 常数 + salt × 常数) 再移一次位——salt 挨得近的两个地方，
// 掷出来的数也挨得近，于是同一天好几个地方像是串通好了。现在两边各自充分搅匀再合。
const mix32 = (x: number) => {
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  return (x ^ (x >>> 16)) >>> 0;
};
const dayHash = (cal: GameCalendar, salt: number) => {
  const day = ((cal.year ?? 1) * 400 + cal.month * 32 + cal.day) | 0;
  return (mix32(mix32(day) ^ mix32((salt | 0) + 0x9e3779b9)) % 10000) / 10000;
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
  if (noLunchRota(cal)) return null;
  const d = weekdayIndex(cal);
  for (const s of LUNCH_SCHEDULE) {
    if (s.week[d] !== locationId) continue;
    if (!met.includes(s.char)) continue;          // 没认识的人不会在你眼里"在那儿"
    if (dayHash(cal, s.char.length * 17) < 0.14) return null;   // 今天她不在
    const here = s.atBy?.[locationId];
    return { char: s.char, locationId, atZh: here?.zh ?? s.atZh, atEn: here?.en ?? s.atEn };
  }
  return null;
};

// 今天午休排了她、但她不在的时候，给的那句说明
export const lunchAwayNote = (
  locationId: string, cal: GameCalendar, language: 'zh' | 'en'
): string | null => {
  if (noLunchRota(cal)) return null;
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
  if (noLunchRota(cal)) return [];
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
//
// 【城市是活的】
// 以前只有"常客"才可能在：铃只会在 Book Off 和图书室，空只会在体育馆。
// 于是每个地方只有一两个人，城市像一组布景，每个布景里站着固定的演员。
// 现在**认识的人哪儿都可能碰上**——放学后谁都会去便利店、去商店街、去海边。
// 常客仍然更容易碰到（×3 权重），越熟的人也越容易碰到，
// 所以"记住她常去哪儿"依然有用，只是不再是唯一的答案。
//
// 两条常识：深雪是隔壁的大人、稻荷不是学生——她们不会出现在学校里面。
// ---------------------------------------------------------
const NOT_AT_SCHOOL: CharacterId[] = [CharacterId.MIYUKI, CharacterId.INARI];

// 地点 id 混进种子里。以前用的是 id 的长度——长度一样的地点（体育馆和别的四个字母的地方）
// 同一天会掷出一模一样的结果。
const strSalt = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 9973;
};

const SLOT_SALT: Record<string, number> = { morning: 1, lunch: 2, afternoon: 3, night: 5 };

// 今天已经碰见过的人，再在别的地方撞上的权重（不是 0：一天碰见两次也是城市的一部分，只是少见）
const SEEN_TODAY_WEIGHT = 0.15;

export const encounterAt = (
  locationId: string, regulars: CharacterId[] | undefined,
  cal: GameCalendar, met: CharacterId[], familiarity: Record<string, number>,
  district?: string, seenToday: CharacterId[] = []
): CharacterId | null => {
  const pool = met.filter(c => !(district === 'school' && NOT_AT_SCHOOL.includes(c)));
  if (!pool.length) return null;
  const salt = strSalt(locationId) * 7 + (SLOT_SALT[cal.timeSlot] || 0) * 7919;
  const regs = (regulars || []).filter(c => pool.includes(c));
  const famOf = (c: CharacterId) => Math.max(0, familiarity[c] ?? 0);
  // 碰不碰得上人：基础三成五；这地方有常客再加一成；最熟的那个人越熟越容易碰上一点
  const topFam = Math.max(...pool.map(famOf));
  const chance = 0.35 + (regs.length ? 0.1 : 0) + Math.min(0.1, topFam / 260 * 0.1);
  if (dayHash(cal, salt) >= chance) return null;
  // 碰上的是谁：常客 ×2，越熟略多一点；今天已经见过的人很少再撞上
  const weightOf = (c: CharacterId) =>
    (regs.includes(c) ? 2 : 1) * (1 + famOf(c) / 400) * (seenToday.includes(c) ? SEEN_TODAY_WEIGHT : 1);
  const total = pool.reduce((n, c) => n + weightOf(c), 0);
  let r = dayHash(cal, salt + 11) * total;
  for (const c of pool) {
    r -= weightOf(c);
    if (r <= 0) return c;
  }
  return pool[pool.length - 1];
};

// 午休没排在这儿的人，偶尔也会晃过来——
// 但排在别处的人不会同时出现在这儿（她在图书室，就不会也在中庭）。
const lunchWandererAt = (
  locationId: string, district: string | undefined, cal: GameCalendar, met: CharacterId[],
  familiarity: Record<string, number>, seenToday: CharacterId[]
): CharacterId | null => {
  const d = weekdayIndex(cal);
  const busyElsewhere = (c: CharacterId) =>
    LUNCH_SCHEDULE.some(s => s.char === c && !!s.week[d] && s.week[d] !== locationId
      && dayHash(cal, s.char.length * 17) >= 0.14);
  const pool = met.filter(c => !busyElsewhere(c) && !(district === 'school' && NOT_AT_SCHOOL.includes(c)));
  if (!pool.length) return null;
  const salt = strSalt(locationId) + 7;
  if (dayHash(cal, salt) >= 0.3) return null;
  const weightOf = (c: CharacterId) =>
    (1 + Math.max(0, familiarity[c] ?? 0) / 400) * (seenToday.includes(c) ? SEEN_TODAY_WEIGHT : 1);
  const total = pool.reduce((n, c) => n + weightOf(c), 0);
  let r = dayHash(cal, salt + 13) * total;
  for (const c of pool) {
    r -= weightOf(c);
    if (r <= 0) return c;
  }
  return pool[pool.length - 1];
};

// 这一趟在这个地方碰见谁。出门、进店、食堂都走这一个口子。
//   上学日午休：先看作息表；作息表上这儿没人，偶尔有人晃过来。
//   其余时间：认识的人谁都可能在（见 encounterAt）。
export const whoIsHere = (
  loc: { id: string; regulars?: CharacterId[]; district?: string },
  cal: GameCalendar, flags: StoryFlags, met: CharacterId[], familiarity: Record<string, number>,
  // 今天已经碰见过的人（见 App 的 metTodayRef）
  seenToday: CharacterId[] = []
): { char: CharacterId; atZh: string; atEn: string } | null => {
  if (cal.timeSlot === 'lunch' && !noLunchRota(cal)) {
    const p = lunchPresenceAt(loc.id, cal, flags, met);
    if (p) return { char: p.char, atZh: p.atZh, atEn: p.atEn };
    // 排在这儿、但今天请假了的那个人，不该被别人顶上——那句"今天不在"已经说了
    if (lunchAwayNote(loc.id, cal, 'zh')) return null;
    const w = lunchWandererAt(loc.id, loc.district, cal, met, familiarity, seenToday);
    return w ? { char: w, atZh: '', atEn: '' } : null;
  }
  const c = encounterAt(loc.id, loc.regulars, cal, met, familiarity, loc.district, seenToday);
  return c ? { char: c, atZh: '', atEn: '' } : null;
};
