import React from 'react';
import { Language, GameCalendar } from '../types';
import { dayLabel, dayMood, dayKindOf } from '../data/calendarLife';
import { RestPlan } from '../data/restDayPlans';

interface Props {
  language: Language;
  calendar: GameCalendar;
  plans: RestPlan[];
  onPick: (plan: RestPlan) => void;
  onSkip: () => void;
}

// 休息日早上弹一次。一天只弹一次，选完就不再打扰。
const RestDayPanel: React.FC<Props> = ({ language, calendar, plans, onPick, onSkip }) => {
  const en = language === 'en';
  // 醒来那一下先给两句话，再摊开选项。
  // 以前是睁眼直接看见六个按钮，像被人塞了一张表格让你填。
  const [woke, setWoke] = React.useState(calendar.timeSlot !== 'morning');
  const kind = dayKindOf(calendar);
  const label = dayLabel(calendar, language);

  const kindTag = en
    ? { weekend: 'WEEKEND', holiday: 'PUBLIC HOLIDAY', vacation: 'SCHOOL HOLIDAY', school: 'SCHOOL DAY' }[kind]
    : { weekend: '周末', holiday: '祝日', vacation: '长假', school: '上学日' }[kind];

  // 上学日问的不是"今天怎么过"，是"今天还去不去"。
  const heading = kind === 'school'
    ? (en ? 'Are you going in today?' : '今天还去学校吗？')
    : (en ? 'What are you doing today?' : '今天要怎么过？');
  const mood = kind === 'school'
    ? (en
        ? 'There are lessons today. Nothing is stopping you from not going, except what it costs.'
        : '今天有课。没有人拦着你不去，只有代价。')
    : dayMood(calendar, language);

  // 早上那两句。点一下翻过去。
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-zinc-950/95 border-2 border-yellow-500/40 rounded-xl shadow-[0_0_80px_rgba(234,179,8,0.18)] max-h-[92vh] overflow-y-auto">
        {/* 标题 */}
        <div className="px-6 md:px-8 pt-6 pb-5 border-b border-yellow-500/25">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-black bg-yellow-400 px-2 py-0.5 -skew-x-12">
              {kindTag}
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

        {/* 选项 */}
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    {p.wholeDay && (
                      <span className="text-[9px] font-bold tracking-wider text-yellow-400/70 border border-yellow-400/30 px-1.5 py-px rounded">
                        {en ? 'ALL DAY' : '一整天'}
                      </span>
                    )}
                  </div>
                  <div className="text-white/45 text-[11px] leading-relaxed">
                    {en ? p.descEn : p.descZh}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onSkip}
            className="w-full text-white/35 hover:text-white/70 text-xs tracking-widest uppercase py-3 transition-colors"
          >
            {kind === 'school'
              ? (en ? 'Go in as usual' : '照常去上学')
              : (en ? 'Decide later' : '待会儿再说')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestDayPanel;
