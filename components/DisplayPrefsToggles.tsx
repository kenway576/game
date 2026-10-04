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
              <div className="text-xs md:text-sm text-white font-bold">{en ? r.labelEn : r.labelZh}</div>
              <div className="text-[10px] text-white/40 leading-snug">{en ? r.descEn : r.descZh}</div>
            </div>
            <button
              onClick={() => { audioManager.playSfx('click'); toggleDisplayPref(r.key); }}
              data-sfx-silent
              className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-colors ${on ? 'bg-cyan-600/70 border-cyan-400 text-white' : 'bg-white/10 border-white/20 text-white/50'}`}
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
