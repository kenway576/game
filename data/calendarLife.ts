import { GameCalendar, Language } from '../types';
import { weekdayFor } from '../constants';

// ---------------------------------------------------------
// 🗓️ 不上学的日子
//
// 以前一年三百多天全是同一个形状：早上上课（玩家不能动），
// 然后午休、午后、夜里三格。周末只做了两件事——学校关门、
// 午休那格变成白天——除此之外和周三没有区别。
//
// 这个文件把"日子的种类"这件事补上：
//   平日 / 周末 / 节假日 / 长假（暑假寒假）
// 有了种类，才谈得上"今天要干什么"这个问题；
// 而"今天要干什么"是这套玩法里唯一属于放假的选择。
//
// 节假日按日本的实际情况写。移动祝日（海の日、敬老の日、スポーツの日、
// 成人の日）算第 N 个星期一，不写死日期——因为日历本来就是会走的。
// ---------------------------------------------------------

export type DayKind = 'school' | 'weekend' | 'holiday' | 'vacation';

const WEEK_HEAD = ['日', '月', '火', '水', '木', '金', '土'];

export const weekdayNum = (cal: GameCalendar): number => {
  const i = WEEK_HEAD.indexOf((cal.dayOfWeek || '').charAt(0));
  return i < 0 ? 1 : i;
};

// 任意一天是星期几（0=日）。weekdayFor 已经把「1~3 月属于次年」算进去了。
const weekdayOf = (month: number, day: number): number =>
  WEEK_HEAD.indexOf(weekdayFor(month, day).charAt(0));

// 某月第 n 个星期一是几号
const nthMonday = (month: number, n: number): number => {
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    if (weekdayOf(month, d) === 1) {
      count += 1;
      if (count === n) return d;
    }
  }
  return 1;
};

interface HolidayDef {
  nameJp: string;
  nameZh: string;
  nameEn: string;
  // 固定日期
  month: number;
  day?: number;
  // 移动祝日：某月第 n 个星期一
  nthMon?: number;
  // 这一天在游戏里意味着什么：给日程面板当小标题用
  moodZh: string;
  moodEn: string;
}

export const JP_HOLIDAYS: HolidayDef[] = [
  { month: 1, day: 1, nameJp: '元日', nameZh: '元旦', nameEn: "New Year's Day",
    moodZh: '街上安静得不像神户。只有神社那边有人。', moodEn: 'The city is quieter than Kobe ever is. Only the shrine has anybody in it.' },
  { month: 1, nthMon: 2, nameJp: '成人の日', nameZh: '成人节', nameEn: 'Coming of Age Day',
    moodZh: '三宫到处是穿振袖的人，在冷风里拍照。', moodEn: 'Sannomiya is full of furisode and people photographing each other in the cold.' },
  { month: 2, day: 11, nameJp: '建国記念の日', nameZh: '建国纪念日', nameEn: 'National Foundation Day',
    moodZh: '一个没有人特别在意的假日。', moodEn: 'A holiday nobody particularly marks.' },
  { month: 2, day: 23, nameJp: '天皇誕生日', nameZh: '天皇诞生日', nameEn: "The Emperor's Birthday",
    moodZh: '还很冷。但风里有一点别的东西了。', moodEn: 'Still cold. Something else in the wind, though.' },
  { month: 3, day: 20, nameJp: '春分の日', nameZh: '春分', nameEn: 'Vernal Equinox',
    moodZh: '白天和夜里一样长。今天之后夜就短了。', moodEn: 'Day and night the same length. After today the nights get shorter.' },
  { month: 4, day: 29, nameJp: '昭和の日', nameZh: '昭和之日', nameEn: 'Shōwa Day',
    moodZh: '黄金周的第一天。电车上全是背包。', moodEn: 'First day of Golden Week. The trains are all rucksacks.' },
  { month: 5, day: 3, nameJp: '憲法記念日', nameZh: '宪法纪念日', nameEn: 'Constitution Day',
    moodZh: '黄金周正中间。哪儿都是人。', moodEn: 'The middle of Golden Week. Everywhere is people.' },
  { month: 5, day: 4, nameJp: 'みどりの日', nameZh: '绿之日', nameEn: 'Greenery Day',
    moodZh: '六甲山上今天大概会堵车。', moodEn: 'There will be traffic all the way up Rokko today.' },
  { month: 5, day: 5, nameJp: 'こどもの日', nameZh: '儿童节', nameEn: "Children's Day",
    moodZh: '河边挂着鲤鱼旗。黄金周最后一天。', moodEn: 'Carp streamers over the river. The last day of Golden Week.' },
  { month: 7, nthMon: 3, nameJp: '海の日', nameZh: '海之日', nameEn: 'Marine Day',
    moodZh: '须磨的海滩今天开始正式挤起来。', moodEn: 'Suma beach starts being properly crowded today.' },
  { month: 8, day: 11, nameJp: '山の日', nameZh: '山之日', nameEn: 'Mountain Day',
    moodZh: '暑假里的假日。听起来没什么意义，但确实是。', moodEn: 'A holiday inside the summer holiday. Meaningless, and real.' },
  { month: 9, nthMon: 3, nameJp: '敬老の日', nameZh: '敬老节', nameEn: 'Respect for the Aged Day',
    moodZh: '商店街今天有免费的茶。', moodEn: 'The shotengai is giving away tea today.' },
  { month: 9, day: 23, nameJp: '秋分の日', nameZh: '秋分', nameEn: 'Autumnal Equinox',
    moodZh: '暑气退了。傍晚开始变短。', moodEn: 'The heat has let go. The evenings are shortening.' },
  { month: 10, nthMon: 2, nameJp: 'スポーツの日', nameZh: '体育之日', nameEn: 'Sports Day',
    moodZh: '公园里全是在跑的人。', moodEn: 'The parks are full of people running.' },
  { month: 11, day: 3, nameJp: '文化の日', nameZh: '文化之日', nameEn: 'Culture Day',
    moodZh: '美术馆今天免费。', moodEn: 'The museums are free today.' },
  { month: 11, day: 23, nameJp: '勤労感謝の日', nameZh: '勤劳感谢日', nameEn: 'Labour Thanksgiving Day',
    moodZh: '有马那边今天泡汤的人会很多。', moodEn: 'The baths at Arima will be heaving today.' }
];

export const holidayOn = (cal: GameCalendar): HolidayDef | null => {
  for (const h of JP_HOLIDAYS) {
    if (h.month !== cal.month) continue;
    const d = h.nthMon ? nthMonday(h.month, h.nthMon) : h.day;
    if (d === cal.day) return h;
  }
  return null;
};

// ---------------------------------------------------------
// 长假。学年从 4/11 到次年 3/24，中间三段：
//   暑假 7/21 – 8/31、寒假 12/26 – 1/7、学年末 3/25 起（已在学年之外）
// 长假期间学校关门，但社团照常——所以"去学校"这件事在暑假里
// 反而是有内容的：只有社团的人在。
// ---------------------------------------------------------
interface VacationDef { nameZh: string; nameEn: string; from: [number, number]; to: [number, number] }

export const VACATIONS: VacationDef[] = [
  { nameZh: '暑假', nameEn: 'Summer holiday', from: [7, 21], to: [8, 31] },
  { nameZh: '寒假', nameEn: 'Winter holiday', from: [12, 26], to: [1, 7] }
];

const inRange = (cal: GameCalendar, v: VacationDef): boolean => {
  const cur = cal.month * 100 + cal.day;
  const a = v.from[0] * 100 + v.from[1];
  const b = v.to[0] * 100 + v.to[1];
  return a <= b ? cur >= a && cur <= b : cur >= a || cur <= b;   // 跨年那段
};

export const vacationOn = (cal: GameCalendar): VacationDef | null =>
  VACATIONS.find(v => inRange(cal, v)) || null;

export const isWeekend = (cal: GameCalendar): boolean => {
  const d = weekdayNum(cal);
  return d === 0 || d === 6;
};

export const dayKindOf = (cal: GameCalendar): DayKind => {
  if (vacationOn(cal)) return 'vacation';
  if (holidayOn(cal)) return 'holiday';
  if (isWeekend(cal)) return 'weekend';
  return 'school';
};

export const isSchoolDay = (cal: GameCalendar): boolean => dayKindOf(cal) === 'school';

// 这一天叫什么。日历、大厅角标、日程面板共用一句。
export const dayLabel = (cal: GameCalendar, language: Language): string => {
  const en = language === 'en';
  const h = holidayOn(cal);
  if (h) return en ? h.nameEn : `${h.nameZh}（${h.nameJp}）`;
  const v = vacationOn(cal);
  if (v) return en ? v.nameEn : v.nameZh;
  if (isWeekend(cal)) return en ? (weekdayNum(cal) === 6 ? 'Saturday' : 'Sunday') : (weekdayNum(cal) === 6 ? '周六' : '周日');
  return '';
};

export const dayMood = (cal: GameCalendar, language: Language): string => {
  const en = language === 'en';
  const h = holidayOn(cal);
  if (h) return en ? h.moodEn : h.moodZh;
  const v = vacationOn(cal);
  if (v) {
    return v.nameEn === 'Summer holiday'
      ? (en ? 'No lessons. The gym is open and somebody is always in it.' : '没有课。体育馆开着，里面永远有人。')
      : (en ? 'No lessons. The city is cold and the shrine is busy.' : '没有课。街上很冷，神社那边很挤。');
  }
  return en
    ? 'No school today. The whole day is yours to spend.'
    : '今天不上学。一整天都是你的。';
};

// 休息日多一格：平日午休只能待在校内，休息日那一格是一整个上午。
// 长假再多一格——一天四格，这是假期真正的样子。
export const slotsForDay = (cal: GameCalendar): number => {
  const k = dayKindOf(cal);
  return k === 'vacation' ? 4 : 3;
};
