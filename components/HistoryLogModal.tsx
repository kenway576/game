import React, { useEffect, useRef } from 'react';
import { CharacterId, Language, Message } from '../types';
import { CHARACTERS, VISIBLE_CHARACTER_IDS } from '../constants';

interface Props {
  T: Record<string, string>;
  language: Language;
  chatHistories: Record<CharacterId, Message[]>;
  activeTab: CharacterId;
  setActiveTab: (id: CharacterId) => void;
  onClose: () => void;
}

const HistoryLogModal: React.FC<Props> = ({ T, language, chatHistories, activeTab, setActiveTab, onClose }) => {
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [activeTab]);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-2 md:p-0" onClick={onClose}>
      <div className="w-full max-w-5xl h-[95dvh] md:h-[85dvh] bg-zinc-900 border-2 border-indigo-500/50 shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 md:px-6 py-3 md:py-4"><h2 className="text-indigo-400 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic text-sm md:text-base">{T.logs}</h2><button onClick={onClose} className="text-white/30 hover:text-red-500 font-black">✕</button></div>
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <div className="w-full md:w-64 bg-black/20 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0">{VISIBLE_CHARACTER_IDS.map(id => (<button key={id} onClick={() => setActiveTab(id)} className={`p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-3 transition-all border-b-4 md:border-b-0 md:border-l-4 ${activeTab === id ? `bg-white/5 ${CHARACTERS[id].color.replace('bg-', 'border-')}` : 'border-transparent opacity-50 hover:opacity-100'}`}><div className={`w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0 bg-black/30`}><img src={CHARACTERS[id].emotionMap['neutral']} className="w-full h-full object-cover object-top" alt="" /></div><span className="font-bold text-white text-[10px] md:text-sm uppercase tracking-wider truncate">{language === 'en' ? CHARACTERS[id].nameEn : CHARACTERS[id].name}</span></button>))}</div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-900/50">
            {chatHistories[activeTab].length === 0 ? (<div className="h-full flex items-center justify-center text-white/20 italic font-medium text-sm">No history found.</div>) : (chatHistories[activeTab].map((msg) => (<div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}><div className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/30 mb-1 px-1">{msg.senderName || (msg.role === 'user' ? 'You' : CHARACTERS[activeTab].name)}</div><div className={`max-w-[90%] md:max-w-[80%] p-3 md:p-4 rounded-sm text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-white/10 text-white border border-white/5' : 'bg-indigo-900/20 text-indigo-100 border border-indigo-500/30'}`} dangerouslySetInnerHTML={{ __html: msg.text }}></div></div>)))}
            <div ref={historyEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryLogModal;
