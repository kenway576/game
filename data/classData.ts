import { CharacterId, GameCalendar, StatKey, StoryNode, StoryWord } from '../types';
import { weekdayIndex } from './scheduleData';

// ==========================================================
// 🏫 上课
//
// 【为什么要做这个】
// 这游戏一天有四格时间，但"早晨"那一格在上课日是空的：玩家醒来，
// 什么都点不了，只能等它过去。也就是说一周里有五个早晨是不存在的。
//
// 而这是一个**学日语的游戏**，教语言的地方却只有聊天和剧情里
// 顺手挂的生词。课堂是这套系统缺掉的那一块：它是全游戏唯一一个
// 可以正大光明地"讲一个语法点"而不显得突兀的场合。
//
// 【怎么不让它变烦】
// 一学年有两百个上课日。所以：
//   · 早上只演**一节课**，不是四节。四节全演一遍，第三天就想跳过了。
//   · 演哪一节由日期决定（dayHash），刷新读档都是同一节，
//     所以"今天第二节有小测"是一件可以被记住的事。
//   · 三分之二的日子只有一段两三句的课堂速写，不给选项、不打断节奏。
//     真正会停下来的是小测和教室事件。
//
// 【课程表是真的】
// 星期几上什么课是固定的，玩家可以记住。丽的补习、明日香的值日、
// 昴的体育课都挂在这张表上——"周三下午体育课"这种事在这个游戏里
// 是可以拿来约人的。
// ==========================================================

export interface SubjectDef {
  id: string;
  nameJp: string; reading: string;
  nameZh: string; nameEn: string;
  emoji: string;
  // 这门课主要涨什么。课堂速写的属性从这儿取，不必每条自己写。
  stat: StatKey;
}

export const SUBJECTS: SubjectDef[] = [
  { id: 'kokugo',  nameJp: '国語',   reading: 'こくご',    nameZh: '国语',   nameEn: 'Japanese',   emoji: '📖', stat: 'knowledge' },
  { id: 'suugaku', nameJp: '数学',   reading: 'すうがく',  nameZh: '数学',   nameEn: 'Maths',      emoji: '📐', stat: 'knowledge' },
  { id: 'eigo',    nameJp: '英語',   reading: 'えいご',    nameZh: '英语',   nameEn: 'English',    emoji: '🔤', stat: 'knowledge' },
  { id: 'nihonshi',nameJp: '日本史', reading: 'にほんし',  nameZh: '日本史', nameEn: 'History',    emoji: '🏯', stat: 'knowledge' },
  { id: 'kagaku',  nameJp: '化学',   reading: 'かがく',    nameZh: '化学',   nameEn: 'Chemistry',  emoji: '⚗️', stat: 'proficiency' },
  { id: 'taiiku',  nameJp: '体育',   reading: 'たいいく',  nameZh: '体育',   nameEn: 'PE',         emoji: '🏃', stat: 'guts' },
  { id: 'bijutsu', nameJp: '美術',   reading: 'びじゅつ',  nameZh: '美术',   nameEn: 'Art',        emoji: '🎨', stat: 'charm' },
  { id: 'katei',   nameJp: '家庭科', reading: 'かていか',  nameZh: '家政',   nameEn: 'Home Ec',    emoji: '🧵', stat: 'kindness' }
];

export const findSubject = (id: string) => SUBJECTS.find(s => s.id === id)!;

// 周一到周五，每天四节。星期六不上课。
// 这张表是死的，因为玩家要能记住它。
export const TIMETABLE: Record<number, string[]> = {
  1: ['kokugo',  'suugaku', 'eigo',     'nihonshi'],  // 月
  2: ['eigo',    'kagaku',  'kokugo',   'taiiku'],    // 火
  3: ['suugaku', 'nihonshi','taiiku',   'bijutsu'],   // 水
  4: ['kokugo',  'eigo',    'kagaku',   'katei'],     // 木
  5: ['nihonshi','suugaku', 'bijutsu',  'eigo']       // 金
};

export const timetableFor = (cal: GameCalendar): string[] =>
  TIMETABLE[weekdayIndex(cal)] || [];

const dayHash = (cal: GameCalendar, salt: number) => {
  // 两轮混合。只做一轮的话，相隔七天的两个日期（也就是连着几个星期五）
  // 会落进同一个桶里——实测连着三个星期五抽中的是同一节课。
  let h = ((cal.year ?? 1) * 372 + cal.month * 31 + cal.day) ^ (salt * 0x9e3779b9);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h = (h ^ (h >>> 16)) >>> 0;
  return (h % 10000) / 10000;
};

// 一天四节课，上午两节、下午两节。
//
// 以前一天只演一节，那一节还是按日期随机抽的——于是同一门课
// 可能连着两天出现，玩家会觉得"我明明听完日本史了怎么还是日本史"。
// 现在整张课表都会走完，顺序就是课表的顺序，不随机。
export const MORNING_PERIODS = [0, 1];
export const AFTERNOON_PERIODS = [2, 3];

export const periodsFor = (slot: string): number[] =>
  slot === 'morning' ? MORNING_PERIODS : AFTERNOON_PERIODS;

// 这一格该上的那几门课
export const subjectsIn = (cal: GameCalendar, slot: string): SubjectDef[] => {
  const t = timetableFor(cal);
  if (!t.length) return [];
  return periodsFor(slot).map(i => findSubject(t[i] || t[0]));
};

// 兼容旧调用：给"今天早上第一节"
export const periodToday = (cal: GameCalendar): number => 0;

export const subjectToday = (cal: GameCalendar): SubjectDef | null => {
  const t = timetableFor(cal);
  if (!t.length) return null;
  return findSubject(t[0]);
};
