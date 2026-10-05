import React from 'react';
import { Language, GameCalendar } from '../types';
import { dayLabel, dayMood, dayKindOf, cultureFestivalDay } from '../data/calendarLife';
import { RestPlan } from '../data/restDayPlans';

// ---------------------------------------------------------
// 📋 行动
//
// 以前「今天怎么过」只在早上弹一次：点了「待会儿再说」就再也找不回来；
// 午休翘课在地图底部、夜里出门在大厅按钮、睡觉在房间里——同一类决定散在四个地方。
//
// 现在是一个随时能从大厅打开的面板，内容跟着时段变：
//   上面「现在」——此刻能做的事（出门、回教室、翘课、回房间睡觉…），做不了的灰着、写明原因
//   下面「安排」——还来得及的整天 / 半天安排（早上最多，下午只剩半天的）
// 早上第一次睁眼时它会自己弹出来，那一次前面多两句醒来的旁白。
// ---------------------------------------------------------

export interface QuickAction {
  id: string;
  icon: string;
  titleZh: string; titleEn: string;
  descZh: string; descEn: string;
  // 有值 = 现在做不了，灰着并显示这句
  blockedZh?: string; blockedEn?: string;
  primary?: boolean;
  onSelect: () => void;
}

interface Props {
  language: Language;
  calendar: GameCalendar;
  plans: RestPlan[];
  actions: QuickAction[];
  // 是早上自动弹出来的那一次（带醒来旁白）
  wakeUp?: boolean;
  onPick: (plan: RestPlan) => void;
  onSkip: () => void;
}

const RestDayPanel: React.FC<Props> = ({ language, calendar, plans, actions, wakeUp = false, onPick, onSkip }) => {
  const en = language === 'en';
  // 醒来那一下先给两句话，再摊开选项。
  // 以前是睁眼直接看见六个按钮，像被人塞了一张表格让你填。
  const [woke, setWoke] = React.useState(!wakeUp);
  const kind = dayKindOf(calendar);
  const school = kind === 'school';
  const slot = calendar.timeSlot;
  const label = dayLabel(calendar, language);

  const kindTag = en
    ? { weekend: 'WEEKEND', holiday: 'PUBLIC HOLIDAY', vacation: 'SCHOOL HOLIDAY', school: 'SCHOOL DAY' }[kind]
    : { weekend: '周末', holiday: '祝日', vacation: '长假', school: '上学日' }[kind];
  const slotTag = en
    ? ({ morning: 'MORNING', lunch: school ? 'LUNCH BREAK' : 'DAYTIME', afternoon: school ? 'AFTER SCHOOL' : 'AFTERNOON', night: 'NIGHT' } as Record<string, string>)[slot]
    : ({ morning: '早晨', lunch: school ? '午休' : '白天', afternoon: school ? '放学后' : '下午', night: '夜里' } as Record<string, string>)[slot];

  const fest = cultureFestivalDay(calendar);
  const heading =
    fest && slot === 'morning'
      ? (en ? 'Festival day. No lessons.' : '港见祭。今天不上课。')
    : slot === 'morning'
      ? (school ? (en ? 'Are you going in today?' : '今天还去学校吗？') : (en ? 'What are you doing today?' : '今天要怎么过？'))
    : slot === 'lunch'
      ? (school ? (en ? 'Lunch break. What now?' : '午休做什么？') : (en ? 'What now?' : '白天做什么？'))
    : slot === 'afternoon'
      ? (school ? (en ? 'School is out. What now?' : '放学后做什么？') : (en ? 'The afternoon. What now?' : '下午做什么？'))
      : (en ? 'Tonight?' : '今晚做什么？');
  const mood =
    fest && slot === 'morning'
      ? (fest === 1
          ? (en ? 'The school has become another place for two days. Your class opens at nine.' : '学校在这两天里变成了另一个地方。你们班九点开张。')
          : (en ? 'Open to the public today. Tonight there is a bonfire on the field.' : '今天对外开放。晚上操场中间会点起篝火。'))
    : slot === 'morning'
      ? (school
          ? (en ? 'There are lessons today. Nothing is stopping you from not going, except what it costs.' : '今天有课。没有人拦着你不去，只有代价。')
          : dayMood(calendar, language))
    : slot === 'lunch' && school
      ? (en ? 'Two more periods after lunch. You can wander the campus, or walk out the gate and miss both.' : '午休之后还有两节。可以在学校里转转，也可以走出校门——那两节就没了。')
    : slot === 'night'
      ? (en ? 'One trip out at most tonight. After that it is home and bed.' : '夜里最多出去一趟。回来就该睡了。')
      : (en ? 'Whatever is left of the day is yours.' : '今天剩下的时间是你的。');

  if (!woke) {
    const L1 = en
      ? 'You wake up before the alarm again, and lie there for a while looking at the grain in the ceiling.'
      : '又比闹钟早醒了。你在床上躺了一会儿，看着天花板上的木纹，那几道纹路你现在已经很熟了。';
    const L2 = en
      ? 'Right. Another day. The question is what to do with it.'
      : '好吧。又是新的一天。问题是今天要怎么过呢。';
    return (
      <div
        className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55 backdrop-blur-[2px] p-4 pb-16 cursor-pointer"
        onClick={() => setWoke(true)}
      >
        <div className="w-full max-w-3xl bg-slate-900/85 border border-white/15 rounded-sm px-6 py-5 shadow-2xl">
          <p className="text-base md:text-lg text-white/90 leading-relaxed">{L1}</p>
          <p className="mt-3 text-base md:text-lg text-white/90 leading-relaxed">{L2}</p>
          <p className="mt-4 text-[10px] tracking-widest text-white/30 text-right uppercase">
            {en ? 'tap' : '点一下'} ▼
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4" onClick={onSkip}>
      <div
        className="w-full max-w-3xl bg-zinc-950/95 border-2 border-yellow-500/40 rounded-xl shadow-[0_0_80px_rgba(234,179,8,0.18)] max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="px-6 md:px-8 pt-6 pb-5 border-b border-yellow-500/25">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-black bg-yellow-400 px-2 py-0.5 -skew-x-12">
              {kindTag}
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-yellow-300 border border-yellow-400/50 px-2 py-0.5 -skew-x-12">
              {slotTag}
            </span>
            <span className="text-white/40 text-xs font-mono">
              {calendar.month}/{calendar.day} {calendar.dayOfWeek}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">
            {heading}
          </h2>
          {label && <p className="text-yellow-400/80 text-sm font-bold mt-1">{label}</p>}
          <p className="text-white/45 text-xs mt-2 leading-relaxed">{mood}</p>
        </div>

        {/* 现在能做的事 */}
        {actions.length > 0 && (
          <div className="px-4 md:px-6 pt-4">
            <p className="text-[10px] font-black tracking-[0.25em] text-white/40 mb-2">{en ? 'RIGHT NOW' : '现在'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {actions.map(a => {
                const blocked = !!(en ? a.blockedEn : a.blockedZh);
                return (
                  <button
                    key={a.id}
                    disabled={blocked}
                    onClick={() => !blocked && a.onSelect()}
                    className={`group text-left rounded-lg p-4 border transition-all ${
                      blocked
                        ? 'bg-white/[0.02] border-white/10 opacity-55 cursor-not-allowed'
                        : a.primary
                          ? 'bg-yellow-400/15 border-yellow-400/60 hover:bg-yellow-400/25 hover:-translate-y-0.5'
                          : 'bg-black/50 border-white/12 hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl leading-none shrink-0">{a.icon}</span>
                      <div className="min-w-0">
                        <div className="text-white font-black text-sm tracking-wide mb-1">{en ? a.titleEn : a.titleZh}</div>
                        <div className="text-white/45 text-[11px] leading-relaxed">{en ? a.descEn : a.descZh}</div>
                        {blocked && (
                          <div className="text-rose-300/80 text-[11px] mt-1">{en ? a.blockedEn : a.blockedZh}</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 今天的安排 */}
        {plans.length > 0 && (
          <div className="px-4 md:px-6 pt-5">
            <p className="text-[10px] font-black tracking-[0.25em] text-white/40 mb-2">
              {slot === 'morning' ? (en ? 'PLANS FOR TODAY' : '今天的安排') : (en ? 'STILL TIME FOR' : '还来得及的安排')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plans.map(p => (
                <button
                  key={p.id}
                  onClick={() => onPick(p)}
                  className="group text-left bg-black/50 hover:bg-yellow-400/10 border border-white/12 hover:border-yellow-400/60 rounded-lg p-4 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none shrink-0">{p.icon}</span>
                    <div className="min-w-0">
                      <div className="text-white font-black text-sm tracking-wide mb-1 flex items-center gap-2">
                        {en ? p.titleEn : p.titleZh}
                        <span className="text-[9px] font-bold tracking-wider text-yellow-400/70 border border-yellow-400/30 px-1.5 py-px rounded">
                          {p.wholeDay ? (en ? 'ALL DAY' : '一整天') : (en ? 'HALF DAY' : '半天')}
                        </span>
                      </div>
                      <div className="text-white/45 text-[11px] leading-relaxed">
                        {en ? p.descEn : p.descZh}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 pb-6 pt-4">
          <button
            onClick={onSkip}
            className="w-full text-white/35 hover:text-white/70 text-xs tracking-widest uppercase py-3 transition-colors"
          >
            {slot === 'morning'
              ? (en ? 'Decide later — you can reopen this from the lobby' : '待会儿再说（随时可以从大厅再打开）')
              : (en ? 'Close' : '关闭')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestDayPanel;
