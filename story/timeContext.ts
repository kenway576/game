import { GameCalendar, StoryNode, TimeSlot } from '../types';
import { isSchoolDay } from '../data/calendarLife';

// ---------------------------------------------------------
// 🕰️ 一段戏"写的是什么时候"，现在是不是那个时候
//
// 出门能撞上的戏（地点事件、好感度剧情、街头小景）都是**事先写好**的，
// 写的时候就定了时间：标题卡上写着「傍晚 6:20」「放学后 · 体育馆」「夜 · 天台」，
// 正文里写着夕阳、写着下课铃。可以前播不播只看地点，不看时间——
// 于是周末早上去咖啡店，标题卡上是「傍晚 6:20」；午休去图书室，正文说「放学后」。
//
// 这里从剧本自己的标题卡（没有标题卡就看第一句旁白）里读出它要的时间，
// 跟现在的日历对一下。对不上就不演，等对的时候。
// 规则全写在一处：以后新写的戏只要标题卡写对了，播出时间就自动对。
// ---------------------------------------------------------

export interface TimeNeed {
  slots?: TimeSlot[];
  schoolDay?: boolean;          // 「放学后」「午休」只在上学日成立
  months?: number[];            // 「夏」「初雪」
  weather?: GameCalendar['weather'][];
  weekday?: string;             // 「周日」→ '日'
}

const SUMMER = [6, 7, 8], AUTUMN = [9, 10, 11], WINTER = [12, 1, 2], SPRING = [3, 4, 5];

// 把一段描写时间的文字读成要求。顺序有讲究：先认最具体的词。
// fromCard = 这段文字是标题卡（短、专门写时间地点）。旁白里「青春」「冬天的事」这种词太多，
// 所以季节、天气、星期只从标题卡里读；旁白只读最明确的时段词。
export const parseTimeNeed = (text: string, fromCard = true): TimeNeed => {
  const t = text || '';
  const need: TimeNeed = {};
  // 时段
  if (/午休/.test(t)) { need.slots = ['lunch']; need.schoolDay = true; }
  else if (/放学后|放課後/.test(t)) { need.slots = ['afternoon']; need.schoolDay = true; }
  else if (/清晨|早上|早晨/.test(t)) need.slots = ['morning'];
  // 傍晚排在夜前面：「傍晚 6:40」里也有一个「晚」。夏夜、今晚这种不含傍晚的照旧算夜。
  else if (/傍晚|黄昏|夕方|夕阳/.test(t)) need.slots = ['afternoon'];
  else if (/夜|晚上|深夜|今晚|晚\s?\d|末班/.test(t)) need.slots = ['night'];
  else if (/下午/.test(t)) need.slots = ['afternoon'];
  else {
    // 只写了钟点的（「8:40」「下午 4:20」上面已经接住了）
    const m = t.match(/(\d{1,2})[:：]\d{2}/);
    if (m) {
      const h = Number(m[1]);
      need.slots = h < 11 ? ['morning'] : h < 14 ? ['lunch'] : h < 19 ? ['afternoon'] : ['night'];
    }
  }
  if (!fromCard) return need;
  // 星期
  if (/周日|星期日|日曜/.test(t)) need.weekday = '日';
  else if (/周六|星期六|土曜/.test(t)) need.weekday = '土';
  // 季节
  if (/初雪|冬/.test(t)) need.months = WINTER;
  else if (/夏/.test(t)) need.months = SUMMER;
  else if (/秋/.test(t)) need.months = AUTUMN;
  else if (/春/.test(t)) need.months = SPRING;
  // 天气
  if (/雨后/.test(t)) need.weather = ['rainy', 'cloudy'];
  else if (/雨/.test(t)) need.weather = ['rainy'];
  return need;
};

export const fitsNow = (need: TimeNeed, cal: GameCalendar): boolean => {
  // 周末没有「午休」「放学后」：那两格在周末叫白天、下午，
  // 但写着「放学后」的戏里有下课铃和书包，周末演就是错的。
  if (need.schoolDay && !isSchoolDay(cal)) return false;
  if (need.slots) {
    // 周末的"白天"占的是 lunch 那一格
    if (!need.slots.includes(cal.timeSlot)) return false;
  }
  if (need.weekday && (cal.dayOfWeek || '').charAt(0) !== need.weekday) return false;
  if (need.months && !need.months.includes(cal.month)) return false;
  if (need.weather && !need.weather.includes(cal.weather)) return false;
  return true;
};

// 剧本自己说它是什么时候：第一张带副标题的场景卡；没有的话看第一句旁白。
export const scriptTimeText = (script: StoryNode[] | undefined): { text: string; fromCard: boolean } => {
  const card = (script || []).find(n => n.type === 'scene' && !!(n as any).subtitleZh) as any;
  if (card) return { text: String(card.subtitleZh), fromCard: true };
  const first = (script || []).find(n => n.type === 'narration') as any;
  return { text: first ? String(first.zh || '') : '', fromCard: false };
};

export const scriptNeed = (script: StoryNode[] | undefined): TimeNeed => {
  const { text, fromCard } = scriptTimeText(script);
  return parseTimeNeed(text, fromCard);
};

export const scriptFitsNow = (script: StoryNode[] | undefined, cal: GameCalendar): boolean =>
  fitsNow(scriptNeed(script), cal);
