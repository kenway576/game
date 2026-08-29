import React from 'react';
import { Language } from '../types';
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
  onExitToLobby: () => void;
  onReturnTitle: () => void;
  onSaveRequest: () => void;
  onLoadRequest: () => void;
  onExportJson: () => void;
  onSyncCloud: () => void;
}

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
          <Slider label={T.volBgm || '音乐'} value={s.bgm} disabled={s.muted} onChange={v => audioManager.setBusVolume('bgm', v)} />
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
  onClose, onOpenWordbook, onOpenHistory, onOpenCgGallery, onOpenProtagonistProfile, onOpenCalendar,
  onExitToLobby, onReturnTitle,
  onSaveRequest, onLoadRequest, onExportJson, onSyncCloud
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4" onClick={onClose}>
    <div className="w-full max-w-lg bg-zinc-900 border-2 border-white/10 p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform -skew-x-2 overflow-y-auto max-h-[95dvh]" onClick={e => e.stopPropagation()}>
      <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter mb-4 border-b-4 border-red-600 pb-2 uppercase">{T.system}</h2>

      <div className="flex flex-col gap-3 md:gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-2">
          <button onClick={onOpenWordbook} className="bg-yellow-600/90 hover:bg-yellow-500 text-black font-black py-3 md:py-3.5 rounded-sm text-[10px] md:text-xs uppercase transition-colors shadow-md">📖 {T.wordbook} ({wordCount})</button>
          <button onClick={onOpenHistory} className="bg-indigo-600/90 hover:bg-indigo-500 text-white font-black py-3 md:py-3.5 rounded-sm text-[10px] md:text-xs uppercase transition-colors shadow-md">📜 {T.logs}</button>
          <button onClick={onOpenCgGallery} className="bg-rose-600/90 hover:bg-rose-500 text-white font-black py-3 md:py-3.5 rounded-sm text-[10px] md:text-xs uppercase transition-colors shadow-md">🌸 {language === 'en' ? 'CGs' : '画廊'}</button>
          <button onClick={onOpenProtagonistProfile} className="bg-red-700/90 hover:bg-red-600 text-white font-black py-3 md:py-3.5 rounded-sm text-[10px] md:text-xs uppercase transition-colors shadow-md border border-red-500/40">👤 {language === 'en' ? 'PROFILE' : '人格参数'}</button>
          <button onClick={onOpenCalendar} className="bg-amber-600/90 hover:bg-amber-500 text-white font-black py-3 md:py-3.5 rounded-sm text-[10px] md:text-xs uppercase transition-colors shadow-md border border-amber-400/40">📅 {language === 'en' ? 'CALENDAR' : '关西行事历'}</button>
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
