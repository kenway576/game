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
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-5xl h-[90dvh] md:h-[85dvh] flex flex-col p-4 md:p-8">
        <div className="flex items-center justify-between mb-6 md:mb-8 border-b-4 border-red-600 pb-2 md:pb-4"><h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase transform -skew-x-6">{mode === 'SAVE' ? T.saveData : T.loadData}</h2><button onClick={onClose} className="bg-white text-black font-black px-4 py-1 md:px-6 md:py-2 text-sm md:text-base uppercase hover:bg-red-600 hover:text-white transition-colors transform -skew-x-12">{T.close}</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto pb-10">
          {slots.map((slot) => (
            <div key={slot.index} onClick={() => {
              if (mode === 'SAVE') {
                if (slot.index === 0) { alert(T.autoSaveWarning); return; }
                onSaveSlot(slot.index);
              } else if (slot.data) {
                onLoadSlot(slot.index);
              }
            }} className={`relative h-40 md:h-48 border-2 md:border-4 transform transition-all duration-200 cursor-pointer overflow-hidden group ${!slot.data ? 'border-white/20 bg-white/5 hover:border-white/50' : 'border-white bg-zinc-900 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-xl'}`}>
              <div className="absolute -right-2 -bottom-4 md:-right-4 md:-bottom-8 text-7xl md:text-9xl font-black text-white/5 italic select-none pointer-events-none">{slot.index + 1}</div>
              <div className="p-4 md:p-6 h-full flex flex-col justify-between relative z-10">
                {slot.data ? (<><div className="flex justify-between items-start"><div><div className="text-[10px] md:text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">{slot.index === 0 ? T.autoSaveSlot : `${T.file} ${slot.index + 1}`}</div><div className="text-xl md:text-2xl font-black text-white uppercase italic">{slot.data.meta.playerName}</div></div><div className="text-right"><div className="text-[8px] md:text-[10px] text-white/50 font-mono">{new Date(slot.data.meta.timestamp).toLocaleDateString()}</div><div className="text-[8px] md:text-[10px] text-white/50 font-mono">{new Date(slot.data.meta.timestamp).toLocaleTimeString()}</div></div></div><div className="space-y-1"><div className="text-[10px] md:text-xs text-white/70 font-bold bg-white/10 inline-block px-2 py-1">{slot.data.meta.topic}</div><div className="text-[8px] md:text-[10px] text-white/40 italic truncate" dangerouslySetInnerHTML={{__html: `"${slot.data.meta.previewText}"`}}></div></div></>) : (<div className="h-full flex items-center justify-center flex-col text-white/20"><span className="text-3xl md:text-4xl mb-1 md:mb-2">∅</span><span className="font-black uppercase tracking-widest text-xs md:text-sm">{T.noData}</span></div>)}
              </div>
              <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaveLoadScreen;
