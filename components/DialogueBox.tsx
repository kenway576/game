import React, { useState, useEffect, useMemo } from 'react';
import { Character, DialoguePage, WordReading } from '../types';
import { audioManager } from '../services/audioManager';
import { emojiHtml } from './Emo';

interface Props {
  character: Character;
  pages: DialoguePage[];
  vocabulary: WordReading[];
  streaming?: boolean; // 🌊 流式接收中：页面还在陆续到达
  onFinish: () => void;
}

interface Step { narration: string; speech: string; }

const DialogueBox: React.FC<Props> = ({ character, pages, vocabulary, streaming = false, onFinish }) => {
  // 配对规则：每步最多一段旁白 + 一句台词（只追加、不修改已有步，
  // 保证流式追加页面时不打断当前打字动画）。
  // 流式期间末尾的孤立旁白先押后，等它的台词到了再一起成步。
  const steps = useMemo(() => {
    const paired: Step[] = [];
    let pendingN: string | null = null;
    pages.forEach(p => {
      if (p.type === 'narration' || p.type === 'action') {
        if (pendingN !== null) paired.push({ narration: pendingN, speech: '' });
        pendingN = p.text;
      } else {
        paired.push({ narration: pendingN || '', speech: p.text });
        pendingN = null;
      }
    });
    if (pendingN !== null && !streaming) paired.push({ narration: pendingN, speech: '' });
    return paired;
  }, [pages, streaming]);

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
        audioManager.playTypeBlip(); // 🔊 打字音（单例内部节流 + 随机 pitch）
        return true;
      } else if (sPos < sStr.length) {
        if (sStr[sPos] === '<') { sPos = sStr.indexOf('>', sPos) + 1; } else { sPos++; }
        setDispS(sStr.substring(0, sPos));
        audioManager.playTypeBlip();
        return true;
      }
      return false;
    };

    const timer = setInterval(() => { if (!tick()) { clearInterval(timer); setTyping(false); } }, 25);
    return () => clearInterval(timer);
    // 依赖内容而非对象引用：流式追加页面重建 steps 数组时，当前步内容未变则不重打
  }, [idx, step?.narration, step?.speech]);

  const next = (e?: React.MouseEvent) => {
    // 🔥 防误触：如果有选中文本（正在划词），直接返回，不翻页
    if (window.getSelection()?.toString().trim()) return;

    if (typing) { setDispN(step.narration); setDispS(step.speech); setTyping(false); }
    else if (idx < steps.length - 1) { audioManager.playSfx('page'); setIdx(idx + 1); } // 🔊 翻页
    else if (!streaming) onFinish();
    // 流式接收中且已读到最后一页：忽略点击，等待后续页面到达
  };

  // 流式刚开始、第一步尚未凑齐时显示等待点
  if (!step) {
    return streaming ? (
      <div className="w-full max-w-4xl mx-auto flex justify-center py-10">
        <span className="ui-chip !text-pink-500 text-xl tracking-[0.5em] animate-pulse">●●●</span>
      </div>
    ) : null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3 md:gap-5 animate-in fade-in slide-in-from-bottom-4">
      {step.narration && (
        <div className="ui-panel w-11/12 md:w-5/6 px-5 py-3 md:px-8 md:py-5 text-center cursor-pointer select-text" onClick={next}>
          <p className="font-story text-xs md:text-lg text-[#2b3152] tracking-wide leading-relaxed" dangerouslySetInnerHTML={{ __html: emojiHtml(dispN) }} />
        </div>
      )}

      <div className={`w-full transition-all ${!step.speech ? 'h-0 overflow-hidden opacity-0' : 'ui-panel px-6 py-6 md:px-12 md:py-10 pt-9 md:pt-12 opacity-100'}`}>
        {step.speech && (
          <div className="cursor-pointer select-text" onClick={next}>
            <div className={`absolute top-0 left-8 right-8 h-1 rounded-b-full opacity-80 ${character.color}`} />
            <div className={`ui-name absolute -top-5 md:-top-6 left-6 md:left-12 px-6 md:px-10 py-1 md:py-1.5 ${character.color} text-base md:text-xl pointer-events-none`}>
              <span className="opacity-80 mr-1.5 text-[0.7em]">✦</span>{character.name}
            </div>
            <div className="w-full min-h-[100px] md:min-h-[140px] pt-4">
              <p className="text-xl md:text-[2rem] text-[#1f2440] font-bold leading-[1.8] md:leading-[1.6] tracking-wider" dangerouslySetInnerHTML={{ __html: emojiHtml(dispS) }} />
            </div>
          </div>
        )}

        {/* 📚 隐藏式生词本 */}
        {!typing && !streaming && idx === steps.length - 1 && vocabulary?.length > 0 && (
          <div className="mt-6 pt-5 border-t border-dashed border-[#1f2440]/15">
            <div className="flex justify-between items-center mb-4">
              <span className="font-ui text-xs text-emerald-600 font-bold tracking-widest uppercase">✦ VOCABULARY</span>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setShowVocab(!showVocab); }} 
                className="ui-chip !text-emerald-700 uppercase"
              >
                <span>{showVocab ? 'Hide' : 'Show'}</span>
                <span className={`transform transition-transform duration-300 ${showVocab ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>
            
            {showVocab && (
              <div className="flex flex-wrap gap-3 animate-in slide-in-from-top-2 duration-300 pb-2">
                {vocabulary.map((v, i) => (
                  <div key={i} className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 flex items-baseline gap-2">
                    <span className="text-emerald-700 font-bold text-base">{v.word}</span>
                    <span className="text-emerald-600/70 text-xs">{v.reading}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!typing && (
          streaming && idx === steps.length - 1
            ? <div className="absolute right-8 bottom-4 text-pink-400 text-lg md:text-xl tracking-[0.3em] animate-pulse pointer-events-none">●●●</div>
            : <div className="absolute right-8 bottom-4 ui-next text-lg md:text-xl pointer-events-none">▼</div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;