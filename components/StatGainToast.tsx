import React, { useEffect } from 'react';
import { StatGainEvent, Language } from '../types';
import { STAT_METADATA } from '../constants';

interface Props {
  event: StatGainEvent | null;
  language: Language;
  // 当前该属性的总值。只显示 "+1" 的话，玩家会把增量当成总数，
  // 然后奇怪自己"勇气只有 1"为什么能选需要 2 的选项。
  total?: number;
  onDismiss: () => void;
}

export const StatGainToast: React.FC<Props> = ({ event, language, total, onDismiss }) => {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [event, onDismiss]);

  if (!event) return null;

  const meta = STAT_METADATA[event.stat];
  if (!meta) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[400] pointer-events-none animate-bounce flex items-center gap-3 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-2 border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.4)] px-5 py-2.5 rounded-full backdrop-blur-md">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40 shadow">
        <img src={meta.badgeUrl} alt={meta.nameZh} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-red-400">
            {language === 'en' ? 'STAT UP!' : '人格参数提升！'}
          </span>
          <span className="text-xs font-black text-white" style={{ color: meta.color }}>
            {language === 'en' ? meta.nameEn : meta.nameZh.split(' ')[0]} +{event.amount}
          </span>
          {typeof total === 'number' && (
            <span className="text-[11px] font-bold text-zinc-400 tabular-nums">
              {language === 'en' ? `now ${total}` : `当前 ${total}`}
            </span>
          )}
        </div>
        <span className="text-[11px] text-zinc-300">
          {language === 'en' ? event.reasonEn : event.reasonZh}
        </span>
      </div>
    </div>
  );
};
