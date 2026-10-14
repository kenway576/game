import React from 'react';
import { Language, UserState, N3GrammarTopic } from '../types';
import { AVAILABLE_MODELS, CUSTOM_MODEL_VALUE } from '../constants';
import { audioManager } from '../services/audioManager';
import { useAudioSettings } from '../hooks/useAudioSettings';
import DisplayPrefsToggles from './DisplayPrefsToggles';

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
  onOpenEndings: () => void;
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
    <div className="mt-2 md:mt-3 pt-4 border-t border-dashed border-[#1f2440]/15">
      <button
        onClick={() => setOpen(o => !o)}
        data-sfx-silent
        className="w-full flex items-center justify-between font-ui text-[11px] md:text-xs text-[#5b6286] hover:text-pink-500 font-bold uppercase tracking-widest mb-2"
      >
        <span>{title}</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 bg-[#f6f3ff] border border-[#1f2440]/10 p-3 md:p-4 rounded-2xl animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const fieldCls = 'w-full bg-white border-2 border-[#1f2440]/12 rounded-xl text-[#1f2440] text-xs px-3 py-2.5 font-mono focus:border-pink-400 outline-none transition-all placeholder-[#1f2440]/30';
const labelCls = 'font-ui text-[10px] font-bold uppercase tracking-wider text-[#5b6286] mb-1 block';

// 🔊 音效设置面板：唯一订阅 audioManager 的地方（useSyncExternalStore）
const AudioSettingsPanel: React.FC<{ T: Record<string, string> }> = ({ T }) => {
  const s = useAudioSettings();
  const [open, setOpen] = React.useState(false);

  const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void; disabled?: boolean }> = ({ label, value, onChange, disabled }) => (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-40' : ''}`}>
      <span className="font-ui text-[10px] md:text-xs text-[#4b5375] font-bold uppercase tracking-wider w-20 shrink-0">{label}</span>
      <input
        type="range" min={0} max={1} step={0.01} value={value} disabled={disabled}
        data-sfx-silent
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-pink-400 h-1"
      />
      <span className="text-[10px] text-[#5b6286] font-mono w-8 text-right">{Math.round(value * 100)}</span>
    </label>
  );

  return (
    <div className="mt-2 md:mt-3 pt-4 border-t border-dashed border-[#1f2440]/15">
      <button
        onClick={() => setOpen(o => !o)}
        data-sfx-silent
        className="w-full flex items-center justify-between font-ui text-[11px] md:text-xs text-[#5b6286] hover:text-pink-500 font-bold uppercase tracking-widest mb-2"
      >
        <span>🔊 {T.audioSettings || '音效设置'}</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2.5 bg-[#f6f3ff] border border-[#1f2440]/10 p-3 md:p-4 rounded-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="font-ui text-xs md:text-sm text-[#1f2440] font-bold uppercase tracking-wider">{T.audioMute || '静音'}</span>
            <button
              onClick={() => audioManager.toggleMuted()}
              data-sfx-silent
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-colors ${s.muted ? 'bg-rose-500 border-rose-400 text-white' : 'bg-white border-[#1f2440]/15 text-[#5b6286]'}`}
            >
              {s.muted ? 'OFF' : 'ON'}
            </button>
          </div>

          <Slider label={T.volMaster || '总音量'} value={s.master} disabled={s.muted} onChange={v => audioManager.setBusVolume('master', v)} />
          <div className="flex items-center justify-between">
            <span className="font-ui text-[10px] md:text-xs text-[#4b5375] font-bold uppercase tracking-wider">{T.bgmToggle || '背景音乐'}</span>
            <button
              onClick={() => audioManager.toggleBgm()}
              data-sfx-silent
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-colors ${s.bgmEnabled ? 'bg-pink-400 border-pink-300 text-white' : 'bg-white border-[#1f2440]/15 text-[#5b6286]'}`}
            >
              {s.bgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <Slider label={T.volBgm || '音乐'} value={s.bgm} disabled={s.muted || !s.bgmEnabled} onChange={v => audioManager.setBusVolume('bgm', v)} />
          <Slider label={T.volSfx || '音效'} value={s.sfx} disabled={s.muted} onChange={v => audioManager.setBusVolume('sfx', v)} />
          <Slider label={T.volTyping || '打字音'} value={s.typing} disabled={s.muted || !s.typingEnabled} onChange={v => audioManager.setBusVolume('typing', v)} />

          <div className="flex items-center justify-between pt-1">
            <span className="font-ui text-[10px] md:text-xs text-[#4b5375] font-bold uppercase tracking-wider">{T.typingSound || '打字音效'}</span>
            <button
              onClick={() => audioManager.toggleTyping()}
              data-sfx-silent
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-colors ${s.typingEnabled ? 'bg-pink-400 border-pink-300 text-white' : 'bg-white border-[#1f2440]/15 text-[#5b6286]'}`}
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
  onClose, onOpenWordbook, onOpenHistory, onOpenCgGallery, onOpenEndings, onOpenProtagonistProfile, onOpenCalendar, onOpenInventory,
  onExitToLobby, onReturnTitle,
  onSaveRequest, onLoadRequest, onExportJson, onSyncCloud,
  userState, setUserState,
  customApiKey, onApiKeyChange, customModel, onModelChange,
  customBaseUrl, onBaseUrlChange, customModelName, onModelNameChange
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#141a33]/55 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
    <div className="ui-panel w-full max-w-lg p-6 md:p-9 overflow-y-auto max-h-[95dvh]" onClick={e => e.stopPropagation()}>
      <div className="mb-5 text-center">
        <h2 className="font-ui text-2xl md:text-3xl font-black text-[#1f2440] tracking-[0.2em] uppercase">{T.system}</h2>
        <div className="mt-2 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        {/* ---------------------------------------------------------
            这一格原来是五个各自挑了颜色的按钮：黄、靛、玫红、正红、
            琥珀。挤在一个小弹窗里，谁也不比谁重要，看上去只是很吵。
            现在全部统一成白色圆角小卡，鼠标移上去泛粉。
            颜色不再用来区分功能，图标和文字就够了。
            --------------------------------------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2 mb-2">
          {([
            { icon: '📖', label: `${T.wordbook} (${wordCount})`, on: onOpenWordbook },
            { icon: '🎒', label: language === 'en' ? 'ITEMS' : '持ち物', on: onOpenInventory },
            { icon: '📜', label: T.logs, on: onOpenHistory },
            { icon: '🌸', label: language === 'en' ? 'CGS' : '画廊', on: onOpenCgGallery },
            { icon: '👤', label: language === 'en' ? 'PROFILE' : '人格参数', on: onOpenProtagonistProfile },
            { icon: '📅', label: language === 'en' ? 'CALENDAR' : '行事历', on: onOpenCalendar },
            { icon: '🏁', label: language === 'en' ? 'ENDINGS' : '结局记录', on: onOpenEndings }
          ] as { icon: string; label: string; on: () => void }[]).map(b => (
            <button
              key={b.label}
              onClick={b.on}
              className="rounded-2xl bg-white/85 border-2 border-[#1f2440]/10 hover:border-pink-300 hover:bg-pink-50 text-[#1f2440] py-3 md:py-3.5 px-2 shadow-[0_3px_0_rgba(31,36,64,0.08)] transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="block font-ui text-[10px] md:text-[11px] font-bold uppercase tracking-wider leading-tight">
                <span className="block text-lg mb-0.5">{b.icon}</span>
                {b.label}
              </span>
            </button>
          ))}
        </div>

        {showExitToLobby && (
          <button onClick={onExitToLobby} className="group flex items-center justify-between rounded-2xl bg-white/80 hover:bg-pink-50 border-2 border-[#1f2440]/10 hover:border-pink-300 px-5 py-3.5 transition-all hover:!border-rose-300 hover:!bg-rose-50">
            <span className="font-ui text-[#1f2440] font-bold tracking-widest text-xs md:text-sm">🚪 {T.exit} {language === 'en' ? '' : '(返回休息室)'}</span>
          </button>
        )}
        <button onClick={onReturnTitle} className="group flex items-center justify-between rounded-2xl bg-white/80 hover:bg-pink-50 border-2 border-[#1f2440]/10 hover:border-pink-300 px-5 py-3.5 transition-all hover:!border-rose-300 hover:!bg-rose-50">
          <span className="font-ui text-[#1f2440] font-bold tracking-widest text-xs md:text-sm">⌂ {language === 'en' ? 'RETURN TO TITLE' : '返回标题画面'}</span>
        </button>

        <div className="h-px bg-[#1f2440]/10 my-1" />

        <button onClick={onSaveRequest} className="group flex items-center justify-between rounded-2xl bg-white/80 hover:bg-pink-50 border-2 border-[#1f2440]/10 hover:border-pink-300 px-5 py-3.5 transition-all"><span className="font-ui text-[#1f2440] font-bold tracking-widest text-xs md:text-sm">{T.saveData}</span><span className="text-pink-400 text-xl leading-none font-bold group-hover:translate-x-1 transition-transform">›</span></button>
        <button onClick={onLoadRequest} disabled={!hasAnySave} className="group flex items-center justify-between rounded-2xl bg-white/80 hover:bg-pink-50 border-2 border-[#1f2440]/10 hover:border-pink-300 px-5 py-3.5 transition-all disabled:opacity-40 disabled:hover:bg-white/80 disabled:hover:border-[#1f2440]/10"><span className="font-ui text-[#1f2440] font-bold tracking-widest text-xs md:text-sm">{T.loadData}</span><span className="text-pink-400 text-xl leading-none font-bold group-hover:translate-x-1 transition-transform">›</span></button>

        <AudioSettingsPanel T={T} />

        <Section title={`💬 ${T.textDisplay || '文本显示'}`}>
          <DisplayPrefsToggles en={language === 'en'} />
        </Section>

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

        <div className="mt-2 md:mt-3 pt-4 border-t border-dashed border-[#1f2440]/15">
          <p className="font-ui text-[11px] md:text-xs text-[#5b6286] font-bold mb-2 md:mb-3 uppercase tracking-widest">{T.expDataTools}</p>
          <button onClick={onExportJson} className="w-full group flex items-center justify-between rounded-2xl bg-white/80 hover:bg-pink-50 border-2 border-[#1f2440]/10 hover:border-pink-300 px-5 py-3.5 transition-all mb-2">
            <span className="font-ui text-[#1f2440] font-bold tracking-widest text-[10px] md:text-xs">{T.exportJson}</span>
          </button>
          <button onClick={onSyncCloud} disabled={isSyncing} className="w-full group flex items-center justify-between rounded-2xl bg-white/80 hover:bg-pink-50 border-2 border-[#1f2440]/10 hover:border-pink-300 px-5 py-3.5 transition-all disabled:opacity-50">
            <span className="font-ui text-[#1f2440] font-bold tracking-widest text-[10px] md:text-xs">{isSyncing ? T.syncing : T.syncCloud}</span>
          </button>
        </div>

        <button onClick={onClose} className="mt-3 self-center ui-chip !px-10">{T.cancel}</button>
      </div>
    </div>
  </div>
);

export default SystemMenu;
