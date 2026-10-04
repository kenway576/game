import { useSyncExternalStore } from 'react';

// ---------------------------------------------------------
// 文本显示偏好：台词下面那些小字要不要显示
//
// 本作是学日语的，所以默认什么都给：译文、选项下的语气提示、生词卡片。
// 但读熟了之后这些东西反而出戏——想自己硬啃日语的人也不想被译文剧透。
// 这里只管"显不显示"，生词照样进单词本，回想（Backlog）里也照样留着译文，
// 关掉之后想查还有地方查。
//
// 和 audioManager 一样做成模块级单例 + useSyncExternalStore：
// 剧情、手机、NPC 搭话几个互不相干的界面都要读它，设置面板改了要立刻生效。
// ---------------------------------------------------------

export interface DisplayPrefs {
  showTranslation: boolean; // 日语原文下面的中/英译文
  showHints: boolean;       // 选项下方的斜体小字提示
  showWordChips: boolean;   // 台词下方的生词卡片
}

const KEY = 'kobe_display_prefs_v1';
const DEFAULTS: DisplayPrefs = { showTranslation: true, showHints: true, showWordChips: true };

const load = (): DisplayPrefs => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw);
    return {
      showTranslation: typeof p.showTranslation === 'boolean' ? p.showTranslation : DEFAULTS.showTranslation,
      showHints: typeof p.showHints === 'boolean' ? p.showHints : DEFAULTS.showHints,
      showWordChips: typeof p.showWordChips === 'boolean' ? p.showWordChips : DEFAULTS.showWordChips
    };
  } catch { return DEFAULTS; }
};

let state: DisplayPrefs = load();
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const getSnapshot = () => state;

export const toggleDisplayPref = (key: keyof DisplayPrefs) => {
  state = { ...state, [key]: !state[key] };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach(fn => fn());
};

export function useDisplayPrefs(): DisplayPrefs {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// 设置面板里那三行开关。剧情内的 ⚙ 和系统菜单共用，免得两边文案走样。
export const DISPLAY_PREF_ROWS: { key: keyof DisplayPrefs; labelZh: string; labelEn: string; descZh: string; descEn: string }[] = [
  { key: 'showTranslation', labelZh: '显示译文', labelEn: 'Translations', descZh: '日语原文下面的中文翻译', descEn: 'The line under the Japanese' },
  { key: 'showHints',       labelZh: '选项提示', labelEn: 'Choice hints', descZh: '选项下方的语气 / 代价小字', descEn: 'Small italic notes under choices' },
  { key: 'showWordChips',   labelZh: '生词卡片', labelEn: 'Word chips',   descZh: '台词下方的生词（仍会进单词本）', descEn: 'Vocab under lines (still saved to wordbook)' }
];
