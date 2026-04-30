import React, { useState, useEffect, useMemo } from 'react';
import { Character, DialoguePage, WordReading } from '../types';

interface Props {
  character: Character;
  pages: DialoguePage[];
  vocabulary: WordReading[];
  onFinish: () => void;
}

interface Step { narration: string; speech: string; }

const DialogueBox: React.FC<Props> = ({ character, pages, vocabulary, onFinish }) => {
  const steps = useMemo(() => {
    const paired: Step[] = [];
    let curN = '';
    pages.forEach(p => {
      if (p.type === 'narration' || p.type === 'action') curN += (curN ? ' ' : '') + p.text;
      else { paired.push({ narration: curN, speech: p.text }); curN = ''; }
    });
    if (curN) paired.push({ narration: curN, speech: '' });
    return paired;
  }, [pages]);

  const [idx, setIdx] = useState(0);
  const [dispN, setDispN] = useState('');
  const [dispS, setDispS] = useState('');
  const [typing, setTyping] = useState(true);
  
  // 🔥 新出单词列表默认折叠（隐藏）
  const [showVocab, setShowVocab] = useState(false);

  const step = steps[idx];

  useEffect(() => {
    if (!step) return;
    setTyping(true); setDispN(''); setDispS(''); 
    setShowVocab(false); // 每次翻页时重置为隐藏状态

    let nStr = step.narration || '', sStr = step.speech || '';
    let nPos = 0, sPos = 0;

    const tick = () => {
      if (nPos < nStr.length) {
        if (nStr[nPos] === '<') { nPos = nStr.indexOf('>', nPos) + 1; } else { nPos++; }
        setDispN(nStr.substring(0, nPos));
        return true;
      } else if (sPos < sStr.length) {
        if (sStr[sPos] === '<') { sPos = sStr.indexOf('>', sPos) + 1; } else { sPos++; }
        setDispS(sStr.substring(0, sPos));
        return true;
      }
      return false;
    };

    const timer = setInterval(() => { if (!tick()) { clearInterval(timer); setTyping(false); } }, 25);
    return () => clearInterval(timer);
  }, [idx, step]);

  const next = (e?: React.MouseEvent) => {
    // 🔥 防误触：如果有选中文本（正在划词），直接返回，不翻页
    if (window.getSelection()?.toString().trim()) return;
    
    if (typing) { setDispN(step.narration); setDispS(step.speech); setTyping(false); }
    else if (idx < steps.length - 1) setIdx(idx + 1);
    else onFinish();
  };

  if (!step) return null;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3 md:gap-5 animate-in fade-in slide-in-from-bottom-4">
      {step.narration && (
        <div className="w-11/12 md:w-5/6 bg-slate-900/60 backdrop-blur-sm border border-blue-400/20 rounded-lg p-3 md:p-5 shadow-xl text-center cursor-pointer select-text" onClick={next}>
          <p className="text-xs md:text-lg text-blue-100/80 font-medium italic tracking-wide leading-relaxed" dangerouslySetInnerHTML={{ __html: dispN }} />
        </div>
      )}

      <div className={`relative w-full bg-black/85 backdrop-blur-2xl border-t-4 border-white/10 p-6 md:p-12 shadow-2xl rounded-t-xl transition-all ${!step.speech ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
        {step.speech && (
          <div className="cursor-pointer select-text" onClick={next}>
            <div className={`absolute top-0 left-0 w-full h-1.5 ${character.color}`} />
            <div className={`absolute -top-7 md:-top-10 left-6 md:left-12 px-8 md:px-12 py-2 ${character.color} text-white font-black italic text-lg md:text-2xl shadow-2xl transform -skew-x-12 border-2 border-white/20 pointer-events-none`}>
              <span className="block transform skew-x-12">{character.name}</span>
            </div>
            <div className="w-full min-h-[100px] md:min-h-[140px] pt-4">
              <p className="text-xl md:text-4xl text-white font-bold leading-[1.8] md:leading-[1.6] tracking-wider" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.9)' }} dangerouslySetInnerHTML={{ __html: dispS }} />
            </div>
          </div>
        )}

        {/* 📚 隐藏式生词本 */}
        {!typing && idx === steps.length - 1 && vocabulary?.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-yellow-500 font-black tracking-widest uppercase">▶ VOCABULARY</span>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setShowVocab(!showVocab); }} 
                className="bg-yellow-600/30 hover:bg-yellow-600/60 text-yellow-400 border border-yellow-500/50 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase transition-all flex items-center gap-2"
              >
                <span>{showVocab ? 'Hide' : 'Show'}</span>
                <span className={`transform transition-transform duration-300 ${showVocab ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>
            
            {showVocab && (
              <div className="flex flex-wrap gap-3 animate-in slide-in-from-top-2 duration-300 pb-2">
                {vocabulary.map((v, i) => (
                  <div key={i} className="bg-white/5 px-4 py-2 rounded-sm border border-white/10 flex items-baseline gap-2">
                    <span className="text-white font-bold text-base">{v.word}</span>
                    <span className="text-yellow-400/70 text-xs">{v.reading}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!typing && <div className="absolute right-8 bottom-6 animate-bounce text-yellow-400 text-2xl md:text-4xl pointer-events-none">▼</div>}
      </div>
    </div>
  );
};

export default DialogueBox;