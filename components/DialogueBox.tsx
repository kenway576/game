import React, { useState, useEffect, useMemo } from 'react';
import { Character, DialoguePage, WordReading } from '../types';

interface Props {
  character: Character;
  pages: DialoguePage[];
  vocabulary: WordReading[];
  onFinish: () => void;
}

interface Step {
  narration: string;
  speech: string;
}

const DialogueBox: React.FC<Props> = ({ character, pages, vocabulary, onFinish }) => {
  
  // 智能组合算法：将动作描写与紧随其后的台词打包，减少点击次数
  const steps = useMemo(() => {
    const pairedSteps: Step[] = [];
    let currentNarration = '';
    let currentSpeech = '';

    pages.forEach(p => {
      if (p.type === 'narration' || p.type === 'action') {
        if (currentSpeech) {
          pairedSteps.push({ narration: currentNarration, speech: currentSpeech });
          currentNarration = '';
          currentSpeech = '';
        }
        currentNarration += (currentNarration ? ' ' : '') + p.text;
      } else {
        currentSpeech += (currentSpeech ? ' ' : '') + p.text;
        pairedSteps.push({ narration: currentNarration, speech: currentSpeech });
        currentNarration = '';
        currentSpeech = '';
      }
    });
    if (currentNarration || currentSpeech) {
      pairedSteps.push({ narration: currentNarration, speech: currentSpeech });
    }
    return pairedSteps;
  }, [pages]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedNarration, setDisplayedNarration] = useState('');
  const [displayedSpeech, setDisplayedSpeech] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // 🔥 新增：控制单词列表显示的 State，默认不显示
  const [showVocab, setShowVocab] = useState(false);

  const step = steps[currentStepIndex];

  // 📝 双轨打字机特效
  useEffect(() => {
    if (!step) return;
    
    let nText = '';
    let sText = '';
    let nIndex = 0;
    let sIndex = 0;
    setIsTyping(true);
    setDisplayedNarration('');
    setDisplayedSpeech('');
    
    // 切换到新的一组对话时，重置单词显示状态
    setShowVocab(false);

    const targetNarration = step.narration || '';
    const targetSpeech = step.speech || '';

    const interval = setInterval(() => {
      let updated = false;
      if (nIndex < targetNarration.length) {
        nText += targetNarration.charAt(nIndex);
        setDisplayedNarration(nText);
        nIndex++;
        updated = true;
      } 
      else if (sIndex < targetSpeech.length) {
        sText += targetSpeech.charAt(sIndex);
        setDisplayedSpeech(sText);
        sIndex++;
        updated = true;
      }

      if (!updated) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentStepIndex, step]);

  const handleNext = (e: React.MouseEvent) => {
    // 划词翻译保护：如果玩家正在高亮选词，不要翻页
    if (window.getSelection()?.toString()) return;

    if (isTyping) {
      setDisplayedNarration(step?.narration || '');
      setDisplayedSpeech(step?.speech || '');
      setIsTyping(false);
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  if (!step) return null;

  return (
    <div className="w-full max-w-4xl mx-auto relative font-sans animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col items-center gap-2 md:gap-4">
      
      {/* 🎬 顶部：动作描写栏 */}
      {step.narration && (
        <div className="w-11/12 md:w-3/4 bg-slate-900/70 backdrop-blur-sm border border-blue-400/30 rounded-lg p-3 md:p-4 shadow-lg text-center animate-in fade-in zoom-in-95 duration-500 cursor-pointer" onClick={handleNext}>
          <p className="text-xs md:text-base text-blue-100/90 font-medium italic tracking-wider leading-relaxed">
            {displayedNarration}
          </p>
        </div>
      )}

      {/* 💬 底部：角色对话栏 */}
      <div className={`relative w-full bg-black/85 backdrop-blur-xl border-t-2 border-white/20 p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-sm transition-all duration-300 ${!step.speech ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'}`}>
         
        {step.speech && (
          <div className="cursor-pointer" onClick={handleNext}>
            {/* 角色主题色顶边 */}
            <div className={`absolute top-0 left-0 w-full h-1 ${character.color} opacity-80`} />
            
            {/* 名字牌 */}
            <div className={`absolute -top-6 md:-top-8 left-4 md:left-8 px-6 md:px-8 py-1 md:py-1.5 ${character.color} text-white font-black italic text-base md:text-xl shadow-[4px_0_0_rgba(0,0,0,0.5)] border-t-2 border-l-2 border-white/30 z-20 transform -skew-x-6`}>
              <span className="block transform skew-x-6 tracking-widest">{character.name}</span>
            </div>

            {/* 台词内容 */}
            <div className="w-full min-h-[80px] md:min-h-[100px] flex flex-col justify-start pt-2">
              <p className="text-lg md:text-3xl text-white font-bold leading-loose tracking-wider md:tracking-widest drop-shadow-md" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                {displayedSpeech}
              </p>
            </div>
          </div>
        )}

        {/* 📚 生词本展示区（带折叠切换功能） */}
        {!isTyping && currentStepIndex === steps.length - 1 && vocabulary && vocabulary.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] md:text-xs text-yellow-500 font-bold uppercase tracking-widest">New Words / 新出単語</span>
                {/* 🔥 切换按钮：点击此按钮仅切换显示状态，不触发翻页 */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowVocab(!showVocab); }}
                  className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500 border border-yellow-500/50 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2"
                >
                  <span>{showVocab ? 'Hide' : 'Show'}</span>
                  <span className={`transform transition-transform duration-300 ${showVocab ? 'rotate-180' : ''}`}>▼</span>
                </button>
            </div>
            
            {showVocab && (
              <div className="flex flex-wrap gap-2 md:gap-3 animate-in slide-in-from-top-2 duration-300">
                {vocabulary.map((v, idx) => (
                  <div key={idx} className="group relative bg-white/5 hover:bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-sm border border-white/10 transition-colors flex items-baseline gap-2">
                    <span className="text-white font-bold text-sm md:text-base">{v.word}</span>
                    <span className="text-yellow-400/80 text-[10px] md:text-xs">{v.reading}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🔽 闪烁光标（不响应点击，仅作为提示） */}
        {!isTyping && (
          <div className={`absolute right-4 md:right-8 bottom-4 md:bottom-6 animate-pulse text-yellow-400 font-black text-xl md:text-3xl pointer-events-none`}>
            {currentStepIndex === steps.length - 1 ? '■' : '▶'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;