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
// 长假
//
// 日本的公立高中是三学期制，长假就是学期之间的缝，一共三段：
//   夏休み  7/21 – 8/31   四十二天
//   冬休み  12/26 – 1/7   十三天
//   春休み  3/25 – 4/7    十四天（在 4/11 开学之前，玩不到）
// 没有"春假秋假"那种东西——秋天最长的一段是十月体育之日
// 前后连出来的三连休，那是节假日不是学期假。
//
// 所以玩家在这一年里真正会过到的是两段：暑假四十二天，寒假十三天。
// 春休み照样写在这儿，因为 dayLabel 要能认出学年之外的日子，
// 也因为漏掉它这张表就不是真的日本校历了。
//
// 长假期间学校关门，但社团照常——所以"去学校"这件事在暑假里
// 反而是有内容的：只有社团的人在。
// ---------------------------------------------------------
interface VacationDef { nameZh: string; nameEn: string; nameJp: string; from: [number, number]; to: [number, number] }

export const VACATIONS: VacationDef[] = [
  { nameZh: '暑假', nameEn: 'Summer holiday', nameJp: '夏休み', from: [7, 21], to: [8, 31] },
  { nameZh: '寒假', nameEn: 'Winter holiday', nameJp: '冬休み', from: [12, 26], to: [1, 7] },
  { nameZh: '春假', nameEn: 'Spring holiday', nameJp: '春休み', from: [3, 25], to: [4, 7] }
];

// ---------------------------------------------------------
// 学期与考试
//
// 三学期制的节奏是：始业式 → 上课 → 期末考 → 终业式 → 放假。
// 期末考排在放假前一周，这一周是塾最挤的时候——
// 补习班这个东西在这个游戏里之所以有意义，全靠这三个星期。
// ---------------------------------------------------------
export interface TermExam {
  id: string;
  nameZh: string; nameEn: string; nameJp: string;
  from: [number, number]; to: [number, number];
}

export const TERM_EXAMS: TermExam[] = [
  { id: 'exam_1', nameZh: '第一学期期末考', nameEn: 'First-term finals', nameJp: '一学期期末考査', from: [7, 8],  to: [7, 14] },
  { id: 'exam_2', nameZh: '第二学期期末考', nameEn: 'Second-term finals', nameJp: '二学期期末考査', from: [12, 12], to: [12, 18] },
  { id: 'exam_3', nameZh: '学年末考试',     nameEn: 'Year-end exams',     nameJp: '学年末考査',     from: [2, 20],  to: [2, 26] }
];

export const examOn = (cal: GameCalendar): TermExam | null =>
  TERM_EXAMS.find(e => {
    const cur = cal.month * 100 + cal.day;
    return cur >= e.from[0] * 100 + e.from[1] && cur <= e.to[0] * 100 + e.to[1];
  }) || null;

// 离下一场考试还有几天。没有下一场（或者已经在考）返回 null。
// 塾的收益按这个数放大：临考前一周去补习，比十月里去有用得多。
export const daysToExam = (cal: GameCalendar): number | null => {
  const cur = cal.month * 100 + cal.day;
  let best: number | null = null;
  for (const e of TERM_EXAMS) {
    const a = e.from[0] * 100 + e.from[1];
    if (a <= cur) continue;
    // 粗略按"月差 × 30 + 日差"算，够用了：这只是用来分档的
    const d = (e.from[0] - cal.month) * 30 + (e.from[1] - cal.day);
    if (d > 0 && (best === null || d < best)) best = d;
  }
  return best;
};

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
  if (v) return en ? v.nameEn : `${v.nameZh}（${v.nameJp}）`;
  // 考试周照常上学，但它得有个名字——不然玩家不知道这一周为什么忽然不一样
  const ex = examOn(cal);
  if (ex && !isWeekend(cal)) return en ? ex.nameEn : `${ex.nameZh}（${ex.nameJp}）`;
  if (isWeekend(cal)) return en ? (weekdayNum(cal) === 6 ? 'Saturday' : 'Sunday') : (weekdayNum(cal) === 6 ? '周六' : '周日');
  return '';
};

export const dayMood = (cal: GameCalendar, language: Language): string => {
  const en = language === 'en';
  const h = holidayOn(cal);
  if (h) return en ? h.moodEn : h.moodZh;
  const v = vacationOn(cal);
  if (v) {
    if (v.nameEn === 'Summer holiday')
      return en ? 'No lessons. The gym is open and somebody is always in it.' : '没有课。体育馆开着，里面永远有人。';
    if (v.nameEn === 'Winter holiday')
      return en ? 'No lessons. The city is cold and the shrine is busy.' : '没有课。街上很冷，神社那边很挤。';
    return en ? 'Between school years. The classrooms upstairs are being cleared out.' : '学年和学年之间。楼上的教室在搬东西。';
  }
  const ex = examOn(cal);
  if (ex && !isWeekend(cal)) {
    return en
      ? 'Exam week. Half days, and the cram school in Sannomiya is full by four.'
      : '考试周。上半天课，三宫那家塾四点就坐满了。';
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
