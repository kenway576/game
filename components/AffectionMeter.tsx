import React from 'react';
import { Language } from '../types';
import { AFFECTION_LEVELS, getAffectionLevel, getLevelProgress, getLevelSpan } from '../constants';

interface Props {
  value: number;
  language: Language;
  label: string;          // UI_TEXT.affection
  compact?: boolean;      // 紧凑模式：用于聊天界面顶栏
}

const AffectionMeter: React.FC<Props> = ({ value, language, label, compact = false }) => {
  const level = getAffectionLevel(value);
  const levelIndex = AFFECTION_LEVELS.indexOf(level); // 0-based
  const levelLabel = `Lv.${levelIndex + 1} ${language === 'en' ? level.labelEn : level.labelZh}`;
  // 进度条显示当前等级内的进度（各级区间大小不同，前难后易）
  const span = getLevelSpan(value);
  const progress = getLevelProgress(value);
  const percent = Math.max(0, Math.min(100, (progress / span) * 100));

  if (compact) {
    return (
      <div className="bg-black/80 px-4 py-2 border-b-2 border-pink-500 shadow-xl flex items-center gap-2">
        <span className="text-pink-400 text-sm">♥</span>
        <span className="text-pink-300 text-[10px] md:text-xs font-bold uppercase tracking-widest">{levelLabel}</span>
        <div className="w-16 md:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all duration-700" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-white/80 text-[10px] md:text-xs font-mono">{progress}/{span}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-pink-400 text-[10px] md:text-xs font-black uppercase tracking-widest">♥ {label}</span>
        <span className="text-white/70 text-[10px] md:text-xs font-mono"><span className="text-pink-300 font-bold">{levelLabel}</span> · {progress} / {span}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
        <div className="h-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default AffectionMeter;
