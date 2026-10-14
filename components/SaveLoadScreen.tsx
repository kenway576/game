import React from 'react';
import { SAVE_SLOT_PREFIX, MAX_SLOTS } from '../constants';

interface Props {
  T: Record<string, string>;
  mode: 'SAVE' | 'LOAD';
  onClose: () => void;
  onSaveSlot: (index: number) => void;
  onLoadSlot: (index: number) => void;
}

const SaveLoadScreen: React.FC<Props> = ({ T, mode, onClose, onSaveSlot, onLoadSlot }) => {
  const slots = Array.from({ length: MAX_SLOTS }).map((_, i) => {
    const raw = localStorage.getItem(`${SAVE_SLOT_PREFIX}${i}`);
    return { index: i, data: raw ? JSON.parse(raw) : null };
  });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#141a33]/60 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-300" onClick={onClose}>
      <div className="ui-panel w-full max-w-5xl h-[90dvh] md:h-[85dvh] flex flex-col p-5 md:p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 md:mb-7 pb-3 border-b border-dashed border-[#1f2440]/15">
          <div>
            <div className="font-ui text-[10px] md:text-xs font-bold tracking-[0.4em] text-pink-500">{mode === 'SAVE' ? 'SAVE' : 'LOAD'}</div>
            <h2 className="font-ui text-2xl md:text-4xl font-black text-[#1f2440] tracking-wide">{mode === 'SAVE' ? T.saveData : T.loadData}</h2>
          </div>
          <button onClick={onClose} className="ui-chip !px-6">{T.close}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 overflow-y-auto pb-4 pr-1">
          {slots.map((slot) => (
            <div key={slot.index} onClick={() => {
              if (mode === 'SAVE') {
                if (slot.index === 0) { alert(T.autoSaveWarning); return; }
                onSaveSlot(slot.index);
              } else if (slot.data) {
                onLoadSlot(slot.index);
              }
            }} className={`relative h-40 md:h-44 rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden group ${!slot.data ? 'border-dashed border-[#1f2440]/15 bg-white/50 hover:border-pink-300' : 'border-[#1f2440]/10 bg-white hover:border-pink-300 hover:-translate-y-1 shadow-[0_4px_0_rgba(31,36,64,0.08)] hover:shadow-[0_10px_24px_rgba(236,72,153,0.18)]'}`}>
              <div className="absolute -right-1 -bottom-5 md:-bottom-7 font-ui text-7xl md:text-8xl font-black text-[#1f2440]/[0.05] select-none pointer-events-none">{String(slot.index + 1).padStart(2, '0')}</div>
              {slot.data && <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${slot.index === 0 ? 'bg-sky-300' : 'bg-gradient-to-r from-pink-400 to-amber-300'}`} />}
              <div className="p-4 md:p-5 h-full flex flex-col justify-between relative z-10">
                {slot.data ? (<>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-ui text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${slot.index === 0 ? 'text-sky-500' : 'text-pink-500'}`}>{slot.index === 0 ? T.autoSaveSlot : `${T.file} ${slot.index + 1}`}</div>
                      <div className="font-ui text-xl md:text-2xl font-black text-[#1f2440]">{slot.data.meta.playerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] md:text-[10px] text-[#5b6286] font-mono">{new Date(slot.data.meta.timestamp).toLocaleDateString()}</div>
                      <div className="text-[9px] md:text-[10px] text-[#5b6286] font-mono">{new Date(slot.data.meta.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[10px] md:text-xs text-[#4b5375] font-bold bg-[#f1eefc] inline-block px-3 py-1 rounded-full">{slot.data.meta.topic}</div>
                    <div className="font-story text-[10px] md:text-[11px] text-[#7a7fa0] truncate" dangerouslySetInnerHTML={{__html: `"${slot.data.meta.previewText}"`}}></div>
                  </div>
                </>) : (
                  <div className="h-full flex items-center justify-center flex-col text-[#1f2440]/25">
                    <span className="text-3xl md:text-4xl mb-1 md:mb-2">✧</span>
                    <span className="font-ui font-bold uppercase tracking-widest text-xs md:text-sm">{T.noData}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaveLoadScreen;
