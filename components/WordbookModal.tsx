import React from 'react';
import { CollectedWord } from '../types';

interface Props {
  T: Record<string, string>;
  words: CollectedWord[];
  onClose: () => void;
  onClear: () => void;
  onRemove: (id: string) => void;
  onMove: (index: number, action: 'up' | 'down' | 'top') => void;
}

const WordbookModal: React.FC<Props> = ({ T, words, onClose, onClear, onRemove, onMove }) => (
  <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-2 md:p-4" onClick={onClose}>
    <div className="w-full max-w-4xl h-[95dvh] md:h-[80dvh] bg-zinc-900 border-2 border-yellow-500/50 shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 md:px-8 py-3 md:py-4"><h2 className="text-yellow-500 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic text-sm md:text-base">{T.wordbook}</h2><div className="flex gap-3 md:gap-4"><button onClick={() => { if(confirm(T.confirmClear)) { onClear(); }}} className="text-white/20 hover:text-red-500 font-black text-[10px] md:text-xs uppercase tracking-widest">{T.clearAll}</button><button onClick={onClose} className="text-white/30 hover:text-red-500 font-black">✕</button></div></div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-3 md:space-y-4 bg-slate-900/50 scrollbar-hide">
        {words.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-white/20 italic font-medium"><span className="text-4xl md:text-6xl mb-4">📓</span><p className="text-sm md:text-base">{T.emptyWordbook}</p><p className="text-[8px] md:text-[10px] mt-2 uppercase tracking-widest text-center">{T.emptyWordbookSub}</p></div>) : (words.map((word, index) => (<div key={word.id} className="group relative bg-white/5 border border-white/10 p-4 md:p-6 rounded-sm hover:border-yellow-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4"><div className="flex-1"><p className="text-white text-lg md:text-xl font-bold mb-1">{word.original}</p><p className="text-yellow-400 font-medium text-sm md:text-base">{word.translation}</p></div><div className="flex items-center justify-between sm:justify-end gap-4"><div className="flex sm:flex-col gap-2 sm:gap-1 sm:mr-4 opacity-100 sm:opacity-30 group-hover:opacity-100 transition-opacity"><button onClick={() => onMove(index, 'top')} className="text-white/50 hover:text-yellow-400 text-sm md:text-xs" title="Pin to top" disabled={index === 0}>🔝</button><div className="flex gap-2 sm:gap-1"><button onClick={() => onMove(index, 'up')} className="text-white/50 hover:text-white text-sm md:text-xs" title="Move Up" disabled={index === 0}>⬆</button><button onClick={() => onMove(index, 'down')} className="text-white/50 hover:text-white text-sm md:text-xs" title="Move Down" disabled={index === words.length - 1}>⬇</button></div></div><span className="text-[8px] md:text-[10px] text-white/20 font-mono">{new Date(word.timestamp).toLocaleDateString()}</span><button onClick={() => onRemove(word.id)} className="text-white/20 hover:text-red-500 transition-colors p-2" title="Remove from wordbook"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div></div>)))}
      </div>
    </div>
  </div>
);

export default WordbookModal;
