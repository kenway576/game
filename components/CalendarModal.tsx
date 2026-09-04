import React, { useState } from 'react';
import { GameCalendar, Language, CharacterId } from '../types';
import { KANSAI_CALENDAR_EVENTS, CHARACTERS } from '../constants';

interface Props {
  calendar: GameCalendar;
  language: Language;
  onClose: () => void;
}

export const CalendarModal: React.FC<Props> = ({
  calendar,
  language,
  onClose
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(calendar.month);

  const months = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

  const monthNamesZh: Record<number, string> = {
    4: '4月 · 卯月 (樱花开学)',
    5: '5月 · 皋月 (神户狂欢)',
    6: '6月 · 水无月 (梅雨初夏)',
    7: '7月 · 文月 (京都祇园)',
    8: '8月 · 壮月 (花火与甲子园)',
    9: '9月 · 长月 (新凉初秋)',
    10: '10月 · 神无月 (学园祭&爵士)',
    11: '11月 · 霜月 (古寺红叶)',
    12: '12月 · 师走 (光之雕刻)',
    1: '1月 · 睦月 (初诣新年)',
    2: '2月 · 如月 (情人节修罗场)',
    3: '3月 · 弥生 (春之誓约)'
  };

  const monthNamesEn: Record<number, string> = {
    4: 'April (Spring Entrance)',
    5: 'May (Kobe Matsuri)',
    6: 'June (Early Summer Rain)',
    7: 'July (Kyoto Gion Festival)',
    8: 'August (Fireworks & Koshien)',
    9: 'September (Autumn Wind)',
    10: 'October (Jazz Street & Arts)',
    11: 'November (Autumn Leaves)',
    12: 'December (Kobe Luminarie)',
    1: 'January (New Year Hatsumode)',
    2: 'February (Valentine Shuraba)',
    3: 'March (Spring Covenant)'
  };

  const eventsInSelectedMonth = KANSAI_CALENDAR_EVENTS.filter(e => e.month === selectedMonth);

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-2 border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.25)] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部标题条 */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-zinc-900 px-6 py-3.5 flex items-center justify-between border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <span className="bg-black text-amber-400 text-xs font-black px-2.5 py-1 rounded tracking-widest uppercase border border-amber-500/50">
              KANSAI // SCHEDULE
            </span>
            <h2 className="text-xl font-black text-white tracking-wide drop-shadow-md">
              {language === 'en' ? 'KANSAI ACADEMIC & FESTIVAL CALENDAR' : '关西学园行事历 · 真实四季盛典'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-amber-600/80 text-white/80 hover:text-white flex items-center justify-center font-bold transition-colors border border-white/20"
          >
            ✕
          </button>
        </div>

        {/* 头部实景大图 Banner */}
        <div className="relative w-full h-44 overflow-hidden border-b border-white/10 flex-shrink-0">
          {/* 后缀是 .webp。以前这里写的 .jpg，主图 404 之后退到的那张
              room_asuka.jpg 同样不存在，结果日历顶上一直挂着个碎图标。
              退路也换成实际存在的一张神户全景。 */}
          <img
            src="/images/ui/calendar_header.webp"
            alt="Kobe City Panorama"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/backgrounds/bg_kobe_harbor_dusk.webp';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          {/* 当前时间与天气胶囊 */}
          <div className="absolute bottom-3 left-6 flex items-center gap-3">
            <div className="bg-black/80 border border-amber-500/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
              <span className="text-amber-400 font-black text-sm">
                📅 {calendar.month}月{calendar.day}日 ({calendar.dayOfWeek})
              </span>
              <span className="text-white/40">|</span>
              <span className="text-zinc-200 text-xs font-bold uppercase">
                {calendar.timeSlot === 'morning' ? '早晨 / Morning' : calendar.timeSlot === 'afternoon' ? '放学后 / After School' : '夜晚 / Night'}
              </span>
              <span className="text-white/40">|</span>
              <span className="text-amber-300 text-xs">
                ☀️ 晴空万里 (Fine)
              </span>
            </div>
          </div>
        </div>

        {/* 月份横向选择滑块 */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-950 border-b border-white/10 overflow-x-auto no-scrollbar">
          {months.map((m) => {
            const isCurrentMonth = m === calendar.month;
            const isSelected = m === selectedMonth;
            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                    : isCurrentMonth
                    ? 'bg-zinc-800 border border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>{m}月</span>
                {isCurrentMonth && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* 选定月份的事件列表 */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
              <span>{language === 'en' ? monthNamesEn[selectedMonth] : monthNamesZh[selectedMonth]}</span>
            </h3>
            <span className="text-xs text-zinc-400">
              {eventsInSelectedMonth.length} {language === 'en' ? 'Major Event(s)' : '个重大行事事件'}
            </span>
          </div>

          {eventsInSelectedMonth.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-950/60 rounded-xl border border-white/5 text-zinc-500 gap-2">
              <span className="text-3xl">☕</span>
              <p className="text-xs">
                {language === 'en' ? 'No major regional festivals scheduled. Ideal for daily study & free talk.' : '本月主要为常规学园日常与自由行动，适合在图书馆复习或与女孩们漫步神户。'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {eventsInSelectedMonth.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col gap-2 ${
                    ev.isMajorFestival
                      ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 border-amber-500/40 shadow-lg'
                      : 'bg-zinc-950/80 border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="bg-amber-500/20 text-amber-400 font-mono font-bold text-xs px-2.5 py-1 rounded border border-amber-500/30">
                        {ev.month}月{ev.day}日
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-white">
                          {language === 'en' ? ev.titleEn : ev.titleZh}
                        </h4>
                        <span className="text-[11px] text-amber-300/80 font-medium">
                          📍 {ev.city} · {ev.location}
                        </span>
                      </div>
                    </div>
                    {ev.isMajorFestival && (
                      <span className="bg-red-600/80 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow">
                        MAJOR FESTIVAL
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                    {language === 'en' ? ev.descriptionEn : ev.descriptionZh}
                  </p>

                  {/* 关联的女主角头像 */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {language === 'en' ? 'Key Characters Involved:' : '关联核心女主角：'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {ev.relatedCharIds.map((charId) => {
                        const char = CHARACTERS[charId];
                        if (!char) return null;
                        return (
                          <div
                            key={charId}
                            title={char.name}
                            className="w-6 h-6 rounded-full overflow-hidden border border-amber-400/60 shadow"
                          >
                            <img
                              src={`/images/avatars/${charId}.webp`}
                              alt={char.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
