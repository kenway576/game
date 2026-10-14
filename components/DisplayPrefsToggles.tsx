import React from 'react';
import { useDisplayPrefs, toggleDisplayPref, DISPLAY_PREF_ROWS } from '../services/displayPrefs';
import { audioManager } from '../services/audioManager';

// 译文 / 选项提示 / 生词卡片的三个开关。剧情 ⚙ 面板和系统菜单都用这一份。
const DisplayPrefsToggles: React.FC<{ en: boolean }> = ({ en }) => {
  const prefs = useDisplayPrefs();
  return (
    <div className="flex flex-col gap-2.5">
      {DISPLAY_PREF_ROWS.map(r => {
        const on = prefs[r.key];
        return (
          <div key={r.key} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-ui text-xs md:text-sm text-[#1f2440] font-bold">{en ? r.labelEn : r.labelZh}</div>
              <div className="text-[10px] text-[#5b6286]/80 leading-snug">{en ? r.descEn : r.descZh}</div>
            </div>
            <button
              onClick={() => { audioManager.playSfx('click'); toggleDisplayPref(r.key); }}
              data-sfx-silent
              className={`shrink-0 !text-[10px] ${on ? 'ui-chip ui-chip-on' : 'ui-chip !text-[#1f2440]/45'}`}
            >
              {on ? 'ON' : 'OFF'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayPrefsToggles;
