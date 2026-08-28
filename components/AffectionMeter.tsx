import React from 'react';
import { Language, RelationshipAxis } from '../types';
import {
  AFFECTION_LEVELS, FAMILIARITY_LEVELS,
  getAffectionLevel, getFamiliarityLevel,
  getLevelProgress, getLevelSpan, isRomanceCapped
} from '../constants';

// 一条轴的样式：親密度偏冷色（认识程度），好感度偏暖色（恋爱线）
const AXIS_STYLE: Record<RelationshipAxis, { icon: string; text: string; bar: string; border: string }> = {
  familiarity: {
    icon: '🤝',
    text: 'text-sky-300',
    bar: 'bg-gradient-to-r from-sky-600 to-sky-400',
    border: 'border-sky-500'
  },
  affection: {
    icon: '♥',
    text: 'text-pink-300',
    bar: 'bg-gradient-to-r from-pink-600 to-pink-400',
    border: 'border-pink-500'
  }
};

interface BarProps {
  axis: RelationshipAxis;
  value: number;
  language: Language;
  label: string;
  compact?: boolean;
  capped?: boolean;      // 好感度被親密度卡住 → 显示锁定提示
  cappedLabel?: string;
}

const Bar: React.FC<BarProps> = ({ axis, value, language, label, compact, capped, cappedLabel }) => {
  const levels = axis === 'familiarity' ? FAMILIARITY_LEVELS : AFFECTION_LEVELS;
  const level = axis === 'familiarity' ? getFamiliarityLevel(value) : getAffectionLevel(value);
  const levelIndex = levels.indexOf(level);
  const levelLabel = `Lv.${levelIndex + 1} ${language === 'en' ? level.labelEn : level.labelZh}`;
  // 进度条显示当前等级内的进度（各级区间大小不同）
  const span = getLevelSpan(value, axis);
  const progress = getLevelProgress(value, axis);
  const percent = Math.max(0, Math.min(100, (progress / span) * 100));
  const style = AXIS_STYLE[axis];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className={`${style.text} text-xs`}>{style.icon}</span>
        <span className={`${style.text} text-[10px] md:text-xs font-bold uppercase tracking-wider`}>{levelLabel}</span>
        <div className="w-12 md:w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full ${style.bar} transition-all duration-700`} style={{ width: `${percent}%` }} />
        </div>
        {capped && <span className="text-white/40 text-[10px]" title={cappedLabel}>🔒</span>}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className={`${style.text} text-[10px] md:text-xs font-black uppercase tracking-widest`}>{style.icon} {label}</span>
        <span className="text-white/70 text-[10px] md:text-xs font-mono">
          <span className={`${style.text} font-bold`}>{levelLabel}</span> · {progress} / {span}
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${style.bar} transition-all duration-700`} style={{ width: `${percent}%` }} />
      </div>
      {capped && cappedLabel && (
        <span className="text-white/40 text-[9px] md:text-[10px] tracking-wide">🔒 {cappedLabel}</span>
      )}
    </div>
  );
};

interface Props {
  familiarity: number;
  affection: number;
  language: Language;
  familiarityLabel: string;   // UI_TEXT.familiarity
  affectionLabel: string;     // UI_TEXT.affection
  cappedLabel?: string;       // UI_TEXT.romanceCappedHint
  compact?: boolean;          // 紧凑模式：用于聊天界面顶栏
}

// 双轴关系计：上面是"有多熟"，下面是"有多喜欢"。
// 两条独立——幼馴染开局親密度满格，好感度依然是零。
const RelationshipMeter: React.FC<Props> = ({
  familiarity, affection, language, familiarityLabel, affectionLabel, cappedLabel, compact = false
}) => {
  const capped = isRomanceCapped(affection, familiarity);

  if (compact) {
    return (
      <div className="bg-black/80 px-4 py-2 border-b-2 border-pink-500 shadow-xl flex items-center gap-3 md:gap-5">
        <Bar axis="familiarity" value={familiarity} language={language} label={familiarityLabel} compact />
        <div className="w-px h-4 bg-white/15" />
        <Bar axis="affection" value={affection} language={language} label={affectionLabel} compact capped={capped} cappedLabel={cappedLabel} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <Bar axis="familiarity" value={familiarity} language={language} label={familiarityLabel} />
      <Bar axis="affection" value={affection} language={language} label={affectionLabel} capped={capped} cappedLabel={cappedLabel} />
    </div>
  );
};

export default RelationshipMeter;
