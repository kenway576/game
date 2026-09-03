import React from 'react';
import { Language, UserState, N3GrammarTopic } from '../types';
import { AVAILABLE_MODELS, CUSTOM_MODEL_VALUE } from '../constants';
import { audioManager } from '../services/audioManager';
import { useAudioSettings } from '../hooks/useAudioSettings';

interface Props {
  T: Record<string, string>;
  language: Language;
  wordCount: number;
  showExitToLobby: boolean;   // 仅在聊天中显示"返回休息室"
  hasAnySave: boolean;
  isSyncing: boolean;
  onClose: () => void;
  onOpenWordbook: () => void;
  onOpenHistory: () => void;
  onOpenCgGallery: () => void;
  onOpenProtagonistProfile: () => void;
  onOpenCalendar: () => void;
  onOpenInventory: () => void;
  onExitToLobby: () => void;
  onReturnTitle: () => void;
  onSaveRequest: () => void;
  onLoadRequest: () => void;
  onExportJson: () => void;
  onSyncCloud: () => void;
  // 登记表拿掉后，这些设置搬到了系统菜单里
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  customApiKey: string;
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customModel: string;
  onModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  customBaseUrl: string;
  onBaseUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customModelName: string;
  onModelNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 可折叠的设置分区。菜单项已经不少了，
// 全展开的话一屏装不下，而且平时根本用不到。
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mt-2 md:mt-4 pt-4 border-t border-white/10">
      <button
        onClick={() => setOpen(o => !o)}
        data-sfx-silent
        className="w-full flex items-center justify-between text-[10px] md:text-xs text-cyan-400 font-bold uppercase tracking-widest mb-2"
      >
        <span>{title}</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 bg-white/[0.03] border border-white/10 p-3 md:p-4 rounded-sm animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const fieldCls = 'w-full bg-black/50 border-2 border-white/10 text-yellow-400 text-xs px-3 py-2.5 font-mono focus:border-yellow-400 outline-none transition-all placeholder-white/20';
const labelCls = 'text-[10px] font-black uppercase tracking-wider text-white/50 mb-1 block';

// 🔊 音效设置面板：唯一订阅 audioManager 的地方（useSyncExternalStore）
const AudioSettingsPanel: React.FC<{ T: Record<string, string> }> = ({ T }) => {
  const s = useAudioSettings();
  const [open, setOpen] = React.useState(false);

  const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void; disabled?: boolean }> = ({ label, value, onChange, disabled }) => (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-40' : ''}`}>
      <span className="text-[10px] md:text-xs text-white/70 font-bold uppercase tracking-wider w-20 shrink-0">{label}</span>
      <input
        type="range" min={0} max={1} step={0.01} value={value} disabled={disabled}
        data-sfx-silent
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-cyan-400 h-1"
      />
      <span className="text-[10px] text-white/40 font-mono w-8 text-right">{Math.round(value * 100)}</span>
    </label>
  );

  return (
    <div className="mt-2 md:mt-4 pt-4 border-t border-white/10">
      <button
        onClick={() => setOpen(o => !o)}
        data-sfx-silent
        className="w-full flex items-center justify-between text-[10px] md:text-xs text-cyan-400 font-bold uppercase tracking-widest mb-2"
      >
        <span>🔊 {T.audioSettings || '音效设置'}</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2.5 bg-white/[0.03] border border-white/10 p-3 md:p-4 rounded-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-white font-bold uppercase tracking-wider">{T.audioMute || '静音'}</span>
            <button
              onClick={() => audioManager.toggleMuted()}
              data-sfx-silent
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-colors ${s.muted ? 'bg-red-600/80 border-red-400 text-white' : 'bg-white/10 border-white/20 text-white/60'}`}
            >
              {s.muted ? 'OFF' : 'ON'}
            </button>
          </div>

          <Slider label={T.volMaster || '总音量'} value={s.master} disabled={s.muted} onChange={v => audioManager.setBusVolume('master', v)} />
          <div className="flex items-center justify-between">
            <span className="text-[10px] md:text-xs text-white/70 font-bold uppercase tracking-wider">{T.bgmToggle || '背景音乐'}</span>
            <button
              onClick={() => audioManager.toggleBgm()}
              data-sfx-silent
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-colors ${s.bgmEnabled ? 'bg-cyan-600/70 border-cyan-400 text-white' : 'bg-white/10 border-white/20 text-white/50'}`}
            >
              {s.bgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <Slider label={T.volBgm || '音乐'} value={s.bgm} disabled={s.muted || !s.bgmEnabled} onChange={v => audioManager.setBusVolume('bgm', v)} />
          <Slider label={T.volSfx || '音效'} value={s.sfx} disabled={s.muted} onChange={v => audioManager.setBusVolume('sfx', v)} />
          <Slider label={T.volTyping || '打字音'} value={s.typing} disabled={s.muted || !s.typingEnabled} onChange={v => audioManager.setBusVolume('typing', v)} />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] md:text-xs text-white/70 font-bold uppercase tracking-wider">{T.typingSound || '打字音效'}</span>
            <button
              onClick={() => audioManager.toggleTyping()}
              data-sfx-silent
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-colors ${s.typingEnabled ? 'bg-cyan-600/70 border-cyan-400 text-white' : 'bg-white/10 border-white/20 text-white/50'}`}
            >
              {s.typingEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SystemMenu: React.FC<Props> = ({
  T, language, wordCount, showExitToLobby, hasAnySave, isSyncing,
  onClose, onOpenWordbook, onOpenHistory, onOpenCgGallery, onOpenProtagonistProfile, onOpenCalendar, onOpenInventory,
  onExitToLobby, onReturnTitle,
  onSaveRequest, onLoadRequest, onExportJson, onSyncCloud,
  userState, setUserState,
  customApiKey, onApiKeyChange, customModel, onModelChange,
  customBaseUrl, onBaseUrlChange, customModelName, onModelNameChange
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4" onClick={onClose}>
    <div className="w-full max-w-lg bg-zinc-900 border-2 border-white/10 p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform -skew-x-2 overflow-y-auto max-h-[95dvh]" onClick={e => e.stopPropagation()}>
      <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter mb-4 border-b-4 border-red-600 pb-2 uppercase">{T.system}</h2>

      <div className="flex flex-col gap-3 md:gap-4">
        {/* ---------------------------------------------------------
            这一格原来是五个各自挑了颜色的按钮：黄、靛、玫红、正红、
            琥珀。挤在一个小弹窗里，谁也不比谁重要，看上去只是很吵。
            现在全部统一：黑底、斜切、鼠标移上去翻成黄底黑字。
            颜色不再用来区分功能，图标和文字就够了。
            --------------------------------------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2 mb-2">
          {([
            { icon: '📖', label: `${T.wordbook} (${wordCount})`, on: onOpenWordbook },
            { icon: '🎒', label: language === 'en' ? 'ITEMS' : '持ち物', on: onOpenInventory },
            { icon: '📜', label: T.logs, on: onOpenHistory },
            { icon: '🌸', label: language === 'en' ? 'CGS' : '画廊', on: onOpenCgGallery },
            { icon: '👤', label: language === 'en' ? 'PROFILE' : '人格参数', on: onOpenProtagonistProfile },
            { icon: '📅', label: language === 'en' ? 'CALENDAR' : '行事历', on: onOpenCalendar }
          ] as { icon: string; label: string; on: () => void }[]).map(b => (
            <button
              key={b.label}
              onClick={b.on}
              className="group relative overflow-hidden bg-black/70 border border-white/15 hover:border-yellow-400 text-white/80 hover:text-black py-3 md:py-3.5 px-2 transform -skew-x-12 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 w-0 bg-yellow-400 transition-all duration-200 group-hover:w-full" />
              <span className="relative block transform skew-x-12 text-[10px] md:text-[11px] font-black uppercase tracking-wider leading-tight">
                <span className="block text-base mb-0.5">{b.icon}</span>
                {b.label}
              </span>
            </button>
          ))}
        </div>

        {showExitToLobby && (
          <button onClick={onExitToLobby} className="group flex items-center justify-between bg-red-900/30 hover:bg-red-800/60 p-4 border border-red-500/30 transition-all">
            <span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">🚪 {T.exit} {language === 'en' ? '' : '(返回休息室)'}</span>
          </button>
        )}
        <button onClick={onReturnTitle} className="group flex items-center justify-between bg-red-900/30 hover:bg-red-800/60 p-4 border border-red-500/30 transition-all">
          <span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">⌂ {language === 'en' ? 'RETURN TO TITLE' : '返回标题画面'}</span>
        </button>

        <div className="h-px bg-white/10 my-2" />

        <button onClick={onSaveRequest} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 border border-white/10 transition-all"><span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">{T.saveData}</span><span className="text-yellow-500 text-xs font-mono group-hover:translate-x-1 transition-transform">{'>>>'}</span></button>
        <button onClick={onLoadRequest} disabled={!hasAnySave} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 border border-white/10 transition-all disabled:opacity-20"><span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">{T.loadData}</span><span className="text-yellow-500 text-xs font-mono group-hover:translate-x-1 transition-transform">{'>>>'}</span></button>

        <AudioSettingsPanel T={T} />

        <Section title={`🎯 ${T.studySettings || '学习设置'}`}>
          <div>
            <span className={labelCls}>{T.missionObj}</span>
            <input
              type="text"
              value={userState.learningGoal}
              data-sfx-silent
              onChange={e => setUserState(p => ({ ...p, learningGoal: e.target.value }))}
              placeholder={T.enterGoal}
              className={fieldCls}
            />
          </div>
          <div>
            <span className={labelCls}>{T.targetGrammar}</span>
            <select
              value={userState.grammarTopic}
              data-sfx-silent
              onChange={e => setUserState(p => ({ ...p, grammarTopic: e.target.value as N3GrammarTopic }))}
              className={`${fieldCls} cursor-pointer appearance-none`}
            >
              {Object.values(N3GrammarTopic).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </Section>

        <Section title={`🔑 ${T.apiSettings || 'API 设置'}`}>
          <div>
            <span className={labelCls}>API Key</span>
            <input
              type="password"
              value={customApiKey}
              data-sfx-silent
              onChange={onApiKeyChange}
              placeholder={language === 'en' ? 'Leave blank to use the built-in key' : '留空则使用内置 API Key'}
              className={fieldCls}
            />
          </div>
          <div>
            <span className={labelCls}>Model</span>
            <select value={customModel} onChange={onModelChange} data-sfx-silent className={`${fieldCls} cursor-pointer appearance-none`}>
              {AVAILABLE_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          {customModel === CUSTOM_MODEL_VALUE && (
            <>
              <div>
                <span className={labelCls}>API Base URL</span>
                <input type="text" value={customBaseUrl} onChange={onBaseUrlChange} data-sfx-silent placeholder="https://api.openai.com/v1" className={fieldCls} />
              </div>
              <div>
                <span className={labelCls}>Model ID</span>
                <input type="text" value={customModelName} onChange={onModelNameChange} data-sfx-silent placeholder="gpt-4o-mini / qwen-plus ..." className={fieldCls} />
              </div>
            </>
          )}
        </Section>

        <div className="mt-2 md:mt-4 pt-4 border-t border-white/10">
          <p className="text-[10px] md:text-xs text-yellow-500 font-bold mb-2 md:mb-3 uppercase tracking-widest">{T.expDataTools}</p>
          <button onClick={onExportJson} className="w-full group flex items-center justify-between bg-blue-900/30 hover:bg-blue-800/60 p-3 md:p-4 border border-blue-500/30 transition-all mb-2">
            <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">{T.exportJson}</span>
          </button>
          <button onClick={onSyncCloud} disabled={isSyncing} className="w-full group flex items-center justify-between bg-green-900/30 hover:bg-green-800/60 p-3 md:p-4 border border-green-500/30 transition-all disabled:opacity-50">
            <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">{isSyncing ? T.syncing : T.syncCloud}</span>
          </button>
        </div>

        <button onClick={onClose} className="mt-2 text-center text-white/40 hover:text-white font-black uppercase text-[10px] md:text-xs tracking-[0.5em] transition-colors">{T.cancel}</button>
      </div>
    </div>
  </div>
);

export default SystemMenu;
