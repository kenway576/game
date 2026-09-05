import React from 'react';
import { STAMINA_MAX, STAMINA_TIRED, staminaBand } from '../data/staminaData';

// ---------------------------------------------------------
// 🔋 体力条
//
// 大厅右上角那排按钮的下面。做得比日期矮一号，因为它是**参考**，
// 不是玩家要点的东西。
//
// 刻意不写数字在最显眼的位置：玩家真正要判断的是"还够不够再去一趟"，
// 那是个是非题，一条彩条比 "43 / 100" 回答得快。数字放在条子右边，
// 想细算的人自己看。
// ---------------------------------------------------------
const StaminaBar: React.FC<{ cur: number; en?: boolean; compact?: boolean }> = ({
  cur, en, compact
}) => {
  const v = Math.max(0, Math.min(STAMINA_MAX, cur));
  const band = staminaBand(v);

  return (
    <div className={`transform -skew-x-12 bg-black/80 backdrop-blur-md border border-white/15 ${
      compact ? 'px-2.5 py-1.5' : 'px-3 md:px-3.5 py-2'
    }`}>
      <div className="transform skew-x-12 flex items-center gap-2 whitespace-nowrap">
        <span className="text-[10px]">🔋</span>
        <span className="relative block h-1.5 w-16 md:w-24 bg-white/12 overflow-hidden">
          <span
            className="absolute inset-y-0 left-0 transition-[width] duration-500"
            style={{ width: `${(v / STAMINA_MAX) * 100}%`, background: band.color }}
          />
          {/* 「累了」那条线画在条子上，玩家一眼看得出自己离它多远 */}
          <span
            className="absolute inset-y-0 w-px bg-black/60"
            style={{ left: `${(STAMINA_TIRED / STAMINA_MAX) * 100}%` }}
          />
        </span>
        <span className="text-[10px] font-bold tracking-wider" style={{ color: band.color }}>
          {en ? band.en : band.zh}
        </span>
        <span className="text-[9px] font-mono text-white/35">{v}</span>
      </div>
    </div>
  );
};

export default StaminaBar;
