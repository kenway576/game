import { CharacterId, GameCalendar, StoryFlags, StoryNode, FamiliarityMap } from '../types';
import { SKETCHES, QUIZZES, CLASS_EVENTS, Quiz, ClassEventDef } from './classScenes';
import { findSubject, subjectToday, subjectsIn, timetableFor } from '../data/classData';
import { getInitialFamiliarity } from '../constants';

// ==========================================================
// 🏫 把"今天早上这节课"组装成一段剧本
//
// 早上只演一节。演哪一节、演什么，全部由日期决定——
// 读档、刷新、退出重进，看到的都是同一节课。
// 这一点是刻意的：如果小测能靠读档重刷，它就不是小测了。
//
// 【今天演什么，按这个顺序问】
//   1. 有没有条件满足的教室事件？（有人在场的那种）—— 大约五天一次
//   2. 今天这门课有没有小测？—— 大约七天一次
//   3. 都没有 → 一段两三句的课堂速写
//
// 频率是用 dayHash 卡的，不是随机数：同一天问几次都是同一个答案。
// ==========================================================

const dayHash = (cal: GameCalendar, salt: number) => {
  // 两轮混合。只做一轮的话，相隔七天的两个日期（也就是连着几个星期五）
  // 会落进同一个桶里——实测连着三个星期五抽中的是同一节课。
  let h = ((cal.year ?? 1) * 372 + cal.month * 31 + cal.day) ^ (salt * 0x9e3779b9);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h = (h ^ (h >>> 16)) >>> 0;
  return (h % 10000) / 10000;
};

export interface ClassCtx {
  flags: StoryFlags;
  familiarity: FamiliarityMap;
  met: CharacterId[];
}

const famOf = (ctx: ClassCtx, id: string) => {
  const cid = id as CharacterId;
  if (!ctx.met.includes(cid)) return 0;
  return ctx.familiarity[cid] ?? getInitialFamiliarity(cid);
};

// 演过的教室事件不再演。事件 id 直接当 flag 用，和地图事件一个规矩。
const eventOpen = (ev: ClassEventDef, cal: GameCalendar, ctx: ClassCtx): boolean => {
  if (ctx.flags[ev.id]) return false;
  if (!ctx.met.includes(ev.char as CharacterId)) return false;
  if (ev.minFamiliarity && famOf(ctx, ev.char) < ev.minFamiliarity) return false;
  if (ev.subject) {
    const s = subjectToday(cal);
    if (!s || s.id !== ev.subject) return false;
  }
  return true;
};

// ---- 教室事件 → 节点表 ----
const buildEvent = (ev: ClassEventDef, subjectScene: string): StoryNode[] => {
  const nodes: StoryNode[] = [
    {
      type: 'scene', scene: subjectScene, bgm: 'chat',
      titleZh: ev.titleZh, titleEn: ev.titleEn
    },
    { type: 'narration', zh: ev.introZh, en: ev.introEn, characterImage: ev.sprite ? `/images/characters/${ev.sprite}` : undefined },
    {
      type: 'choice',
      promptZh: ev.promptZh,
      promptEn: ev.promptEn,
      options: ev.options.map(o => ({
        id: o.id,
        labelZh: o.labelZh, labelEn: o.labelEn, jp: o.jp,
        hintZh: o.hintZh, hintEn: o.hintEn,
        words: o.word ? [o.word] : undefined,
        relations: [{
          char: ev.char as CharacterId,
          familiarity: o.familiarity || 0,
          affection: o.affection || 0,
          reasonZh: o.reasonZh, reasonEn: o.reasonEn
        }],
        then: [{ type: 'narration', zh: o.thenZh, en: o.thenEn }]
      }))
    },
    { type: 'effect', setFlags: [ev.id] }
  ];
  return nodes;
};

// ---- 小测 → 节点表 ----
const buildQuiz = (q: Quiz, cal: GameCalendar, subjectScene: string): StoryNode[] => {
  // 正确答案的位置也由日期决定，不然玩家两天就发现"永远选第一个"。
  const all = [q.right, ...q.wrong];
  const shift = Math.floor(dayHash(cal, q.id.length * 17) * all.length);
  const ordered = all.map((_, i) => all[(i + shift) % all.length]);

  return [
    { type: 'scene', scene: subjectScene, bgm: 'chat', titleZh: '小测', titleEn: 'Pop Quiz' },
    {
      type: 'choice',
      promptZh: q.promptZh,
      promptEn: q.promptEn,
      options: ordered.map((a, i) => {
        const correct = a === q.right;
        return {
          id: `${q.id}_${i}`,
          labelZh: a.zh, labelEn: a.en, jp: a.jp,
          words: correct && q.word ? [q.word] : undefined,
          effects: correct
            ? [{ stat: 'knowledge' as const, amount: 3, reasonZh: '答对了', reasonEn: 'Correct' }]
            // 答错也给一点。这是学日语的游戏，不是考试——
            // 记住一个自己答错过的词，比记住一个蒙对的词牢。
            : [{ stat: 'knowledge' as const, amount: 1, reasonZh: '错了一次的东西记得最牢', reasonEn: 'You remember best the ones you got wrong' }],
          then: [
            {
              type: 'narration' as const,
              zh: correct ? '你在答题纸上画了一个圈，收笔的时候手很稳。' : `不对。正确答案是「${q.right.zh}」。`,
              en: correct ? 'You circle it on the answer sheet, and your hand is steady.' : `Wrong. The answer is "${q.right.en}".`
            },
            { type: 'narration' as const, zh: q.afterZh, en: q.afterEn, words: q.word ? [q.word] : undefined }
          ]
        };
      })
    }
  ];
};

// ---- 课堂速写 → 节点表 ----
const buildSketch = (cal: GameCalendar, subjectId: string, subjectScene: string, salt = 0): StoryNode[] => {
  const pool = SKETCHES.filter(s => s.subject === subjectId);
  if (!pool.length) return [];
  const s = pool[Math.floor(dayHash(cal, 23 + salt * 101) * pool.length) % pool.length];
  const subj = findSubject(subjectId);
  return [
    {
      type: 'scene', scene: s.scene || subjectScene, bgm: 'chat',
      titleZh: `${subj.emoji} ${subj.nameZh}`, titleEn: `${subj.emoji} ${subj.nameEn}`,
      subtitleZh: subj.nameJp, subtitleEn: subj.reading
    },
    { type: 'narration', zh: s.zh, en: s.en, words: s.word ? [s.word] : undefined },
    {
      type: 'effect',
      effects: [{
        stat: subj.stat, amount: 1,
        reasonZh: `${subj.nameZh}课听下来的那一点`,
        reasonEn: `What one period of ${subj.nameEn.toLowerCase()} leaves you with`
      }]
    }
  ];
};

const sceneForSubject = (subjectId: string): string =>
  subjectId === 'taiiku' ? 'gym'
    : subjectId === 'kagaku' ? 'school_science_lab'
    : subjectId === 'bijutsu' ? 'art_room'
    : 'classroom_morning';

// 一格里的两节课。
//
// 以前一天只演一节，而且是随机抽的，于是"我明明上过日本史了怎么还是日本史"。
// 现在按课表顺序走：上午第一二节，下午第三四节，一天四节全上完。
// 教室事件和小测只挂在其中一节上，另一节是速写——
// 两节都是大事的话，这一天就太满了。
export const buildClassSlot = (cal: GameCalendar, ctx: ClassCtx, slot: string): StoryNode[] => {
  const subs = subjectsIn(cal, slot);
  if (!subs.length) return [];

  // 这一格里，哪一节上有事
  const special = dayHash(cal, 3) < 0.22 ? 0 : dayHash(cal, 17) < 0.22 ? 1 : -1;
  const nodes: StoryNode[] = [];

  subs.forEach((subj, i) => {
    const scene = sceneForSubject(subj.id);
    if (i === special) {
      const open = CLASS_EVENTS.filter(e => eventOpen(e, cal, ctx));
      if (open.length) {
        nodes.push(...buildEvent(open[Math.floor(dayHash(cal, 5) * open.length) % open.length], scene));
        return;
      }
      const pool = QUIZZES.filter(q => q.subject === subj.id);
      if (pool.length) {
        nodes.push(...buildQuiz(pool[Math.floor(dayHash(cal, 13) * pool.length) % pool.length], cal, scene));
        return;
      }
    }
    nodes.push(...buildSketch(cal, subj.id, scene, i));
  });

  // 两节之间的下课。没有这一下，两节课会黏成一段读不出分界的东西。
  if (nodes.length && subs.length > 1) {
    const mid = nodes.findIndex((n, k) => k > 0 && n.type === 'scene');
    if (mid > 0) nodes.splice(mid, 0, BREAK_NODE(slot));
  }
  return nodes;
};

// 下课十分钟。写成一句，是为了让两节课之间有个呼吸。
const BREAK_NODE = (slot: string): StoryNode => ({
  type: 'narration',
  zh: slot === 'morning'
    ? '下课铃响的时候，全班像被谁按了开关一样同时松了口气。有人趴下，有人冲出去，有人开始翻下一节课的书。十分钟，够干的事其实不多。'
    : '下午这个点最难熬。铃一响，前排那位直接把额头搁在了桌上，搁得很响。老师看了一眼，什么也没说就走了。',
  en: slot === 'morning'
    ? 'When the bell goes the whole class exhales at once, as though somebody had thrown a switch. Some put their heads down, some bolt for the door, some start getting the next book out. Ten minutes is not really enough for any of it.'
    : 'This is the worst hour of the afternoon. The bell goes and the boy in front puts his forehead straight down on the desk, audibly. The teacher looks over and leaves without saying anything.'
});

// 兼容旧调用
export const buildClassMorning = (cal: GameCalendar, ctx: ClassCtx): StoryNode[] =>
  buildClassSlot(cal, ctx, 'morning');

// 大厅上那一行"今天上什么"。不剧透有没有小测——
// 剧透了玩家就会挑日子上学。
export const classHeadline = (cal: GameCalendar, en: boolean): string => {
  const t = timetableFor(cal);
  if (!t.length) return '';
  return t.map(id => {
    const s = findSubject(id);
    return en ? s.nameEn : s.nameZh;
  }).join(' · ');
};
