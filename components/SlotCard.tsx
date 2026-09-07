import React, { useEffect, useState } from 'react';
import { GameCalendar, Language } from '../types';
import { isSchoolDay } from '../data/calendarLife';

// ---------------------------------------------------------
// 🕐 时段翻页的那一张卡
//
// 大厅角落一直写着"午休""放学后"，但那是**状态**，不是**通知**：
// 第一次玩的人不会注意到它变了，只会觉得自己好像错过了什么。
// 一天里最要紧的两个转折——上午的课上完了、今天的课全上完了——
// 应该有人明确地说一句。
//
// 【为什么不做成要点确认的弹窗】
// 一天翻三次，每次都要点一下，第三天就开始烦。
// 所以它自己进、自己出：两秒半，点一下可以提前收掉。
// ---------------------------------------------------------

interface Props {
  calendar: GameCalendar;
  language: Language;
  onDone: () => void;
}

const SlotCard: React.FC<Props> = ({ calendar, language, onDone }) => {
  const en = language === 'en';
  const school = isSchoolDay(calendar);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const a = window.setTimeout(() => setLeaving(true), 2400);
    const b = window.setTimeout(onDone, 2900);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, [onDone]);

  const copy = (() => {
    const s = calendar.timeSlot;
    if (s === 'lunch') {
      return school
        ? {
            tag: en ? 'LUNCH BREAK' : '午休',
            time: '12:40',
            line: en
              ? 'Morning lessons are over. There are two more periods after this — stay on the grounds and you can still make them.'
              : '上午的课上完了。午休之后还有两节——人在学校里，就还赶得上。'
          }
        : {
            tag: en ? 'MIDDAY' : '白天',
            time: '12:40',
            line: en ? 'The morning is gone. The rest of it is yours.' : '上午过去了。剩下的都是你的。'
          };
    }
    if (s === 'afternoon') {
      return school
        ? {
            tag: en ? 'AFTER SCHOOL' : '放学后',
            time: '16:10',
            line: en
              ? 'That is the day’s lessons done. Two slots left before you have to be home.'
              : '今天的课全上完了。回家之前还剩两格时间。'
          }
        : {
            tag: en ? 'AFTERNOON' : '下午',
            time: '15:00',
            line: en ? 'Afternoon. The light is starting to go sideways.' : '下午了。光开始斜着走了。'
          };
    }
    return {
      tag: en ? 'NIGHT' : '夜里',
      time: '20:30',
      line: en
        ? 'The lights are on outside. One slot left in today.'
        : '外面的灯亮了。今天还剩最后一格。'
    };
  })();

  return (
    <div
      className={`fixed inset-x-0 top-24 z-[130] flex justify-center px-6 pointer-events-auto transition-all duration-500 ${
        leaving ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      onClick={onDone}
    >
      <div className="max-w-lg w-full bg-black/85 backdrop-blur-md border-l-4 border-yellow-400 px-5 py-3.5 shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform -skew-x-6 cursor-pointer">
        <div className="transform skew-x-6">
          <div className="flex items-baseline gap-3">
            <span className="text-yellow-400 text-lg font-black italic tracking-tight">{copy.tag}</span>
            <span className="text-white/40 text-xs font-mono">{copy.time}</span>
          </div>
          <p className="text-white/75 text-[13px] leading-relaxed mt-1">{copy.line}</p>
        </div>
      </div>
    </div>
  );
};

export default SlotCard;
