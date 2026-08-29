import React, { useState, useEffect } from 'react';
import { Character, Message, QuizData, UserState, CollectedWord, RelationshipAxis } from '../types';
import { AFFECTION_LEVELS, FAMILIARITY_LEVELS, OUTFIT_UNLOCKS, SCENE_UNLOCKS_BY_LEVEL, FAMILIARITY_GATED_OUTFIT_LEVELS, ROMANCE_GATED_OUTFIT_LEVELS } from '../constants';
import CharacterSprite from './CharacterSprite';
import DialogueBox from './DialogueBox';
import RelationshipMeter from './AffectionMeter';
import { audioManager } from '../services/audioManager';

export interface AffectionToast {
  delta: number;       // 好感度变化
  famDelta: number;    // 親密度变化
  key: number;
}

export interface DiceRoll {
  value: number;
  key: number;
}

export interface LevelUpEvent {
  axis: RelationshipAxis;
  level: number;
  key: number;
}

interface Props {
  T: Record<string, string>;
  userState: UserState;
  character: Character;            // 已应用当前表情/服装的动态角色
  displayName: string;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  isDialogueFinished: boolean;
  currentQuiz: QuizData | null;
  quizFeedback: string | null;
  inputText: string;
  setInputText: (v: string) => void;
  showAutoSave: boolean;
  affection: number;
  familiarity: number;
  affectionToast: AffectionToast | null;
  diceRoll: DiceRoll | null;
  levelUpEvent: LevelUpEvent | null;
  onLevelUpContinue: () => void;
  onSend: () => void;
  onDialogueFinished: () => void;
  onQuizAnswer: (index: number) => void;
  onCloseQuiz: () => void;
  onContinueAfterFeedback: () => void;
  onOpenSystemMenu: () => void;
  translate: (text: string) => Promise<string>;
  onCollectWord: (word: CollectedWord) => void;
  background: React.ReactNode;
}

const ChatScreen: React.FC<Props> = ({
  T, userState, character, displayName, messages, isLoading, isStreaming, isDialogueFinished,
  currentQuiz, quizFeedback, inputText, setInputText, showAutoSave,
  affection, familiarity, affectionToast, diceRoll, levelUpEvent, onLevelUpContinue,
  onSend, onDialogueFinished, onQuizAnswer, onCloseQuiz, onContinueAfterFeedback,
  onOpenSystemMenu, translate, onCollectWord, background
}) => {
  // 🎲 骰子配色：高点数金色（命运眷顾），中间白色，低点数冷灰
  const diceStyle = diceRoll
    ? diceRoll.value >= 5
      ? 'bg-yellow-500/90 border-yellow-200 text-black'
      : diceRoll.value >= 3
        ? 'bg-white/90 border-white text-black'
        : 'bg-slate-700/90 border-slate-400 text-slate-100'
    : '';

  // 🎲 掷骰动画：数字快速翻滚约 1.2 秒后定格在真实点数
  const [displayFace, setDisplayFace] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (!diceRoll) { setDisplayFace(null); setIsRolling(false); return; }
    setIsRolling(true);
    audioManager.startDiceRattle(); // 🔊 骰子翻滚 loop
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      if (ticks >= 15) {
        clearInterval(interval);
        setDisplayFace(diceRoll.value);
        setIsRolling(false);
        audioManager.playDiceLand(diceRoll.value); // 🔊 落定音（按点数分三档）
      } else {
        setDisplayFace(1 + Math.floor(Math.random() * 6));
      }
    }, 80);
    return () => { clearInterval(interval); audioManager.stopDiceRattle(); };
  }, [diceRoll?.key]);
  // 划词菜单与翻译弹窗属于聊天界面的局部交互，状态收在组件内部
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, text: string } | null>(null);
  const [translationResult, setTranslationResult] = useState<{ original: string, translation: string } | null>(null);
  const [, setIsTranslating] = useState(false);

  const lastModelMsg = [...messages].reverse().find(m => m.role === 'model');
  const lastSpeechTextRaw = lastModelMsg?.pages?.filter(p => p.type === 'speech').pop()?.text || lastModelMsg?.text || '';
  const safePreviewText = lastSpeechTextRaw.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');

  const handleTextSelection = (e: React.MouseEvent | React.TouchEvent) => {
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text) {
        let clientX = 0;
        let clientY = 0;

        if ('changedTouches' in e && e.changedTouches.length > 0) {
          clientX = e.changedTouches[0].clientX;
          clientY = e.changedTouches[0].clientY;
        } else if ('clientX' in e) {
          clientX = (e as React.MouseEvent).clientX;
          clientY = (e as React.MouseEvent).clientY;
        }

        const safeX = Math.min(Math.max(clientX, 20), window.innerWidth - 160);
        const safeY = Math.min(Math.max(clientY, 20), window.innerHeight - 100);

        setContextMenu({ x: safeX, y: safeY, text: text });
      }
    }, 50);
  };

  const handleGlobalClick = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) return;
    if (contextMenu) setContextMenu(null);
  };

  const handleTranslateSelection = async () => {
    if (!contextMenu) return;
    const text = contextMenu.text;
    setContextMenu(null);
    window.getSelection()?.removeAllRanges();
    setIsTranslating(true);
    try {
      const translation = await translate(text);
      setTranslationResult({ original: text, translation });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCollectSelection = async () => {
    if (!contextMenu) return;
    const text = contextMenu.text;
    setContextMenu(null);
    window.getSelection()?.removeAllRanges();
    setIsTranslating(true);
    try {
      const translation = await translate(text);
      onCollectWord({ id: Date.now().toString(), original: text, translation, timestamp: Date.now() });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col select-auto"
      onMouseUp={handleTextSelection}
      onTouchEnd={handleTextSelection}
      onClick={handleGlobalClick}
    >
      {background}

      <div className={`absolute top-4 right-4 z-[200] bg-black/60 px-3 py-1.5 rounded-sm border border-yellow-500/30 transition-opacity duration-500 pointer-events-none ${showAutoSave ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[10px] md:text-xs font-bold text-yellow-500 tracking-widest uppercase animate-pulse">{T.autoSaving}</span>
      </div>

      {/* 💗 关系变化提示：两条轴各自冒泡，同回合都动时上下并排 */}
      {affectionToast && (affectionToast.delta !== 0 || affectionToast.famDelta !== 0) && (
        <div key={affectionToast.key} className="absolute top-16 right-4 z-[200] pointer-events-none flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {affectionToast.famDelta !== 0 && (
            <div className={`px-4 py-2 rounded-full border shadow-2xl font-black text-sm md:text-base ${affectionToast.famDelta > 0 ? 'bg-sky-600/90 border-sky-300 text-white' : 'bg-slate-800/90 border-slate-400 text-slate-200'}`}>
              🤝 {affectionToast.famDelta > 0 ? `+${affectionToast.famDelta}` : affectionToast.famDelta}
            </div>
          )}
          {affectionToast.delta !== 0 && (
            <div className={`px-4 py-2 rounded-full border shadow-2xl font-black text-sm md:text-base ${affectionToast.delta > 0 ? 'bg-pink-600/90 border-pink-300 text-white' : 'bg-slate-800/90 border-slate-400 text-slate-200'}`}>
              ♥ {affectionToast.delta > 0 ? `+${affectionToast.delta}` : affectionToast.delta}
            </div>
          )}
        </div>
      )}

      <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-6 flex justify-between items-start pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={onOpenSystemMenu} className="bg-black/80 px-5 py-3 rounded-sm text-white font-black text-[10px] md:text-xs border border-white/20 hover:border-yellow-500 transition-colors uppercase tracking-[0.2em] shadow-xl">⚙️ {T.system}</button>
        </div>
        <div className="flex flex-wrap justify-end gap-2 max-w-[70%] pointer-events-auto">
          <div className="bg-black/80 px-4 py-3 text-white/50 text-[10px] font-mono border-b-2 border-red-500 w-full md:w-auto text-right shadow-xl">N3: {userState.playerName.toUpperCase()} | {userState.grammarTopic}</div>
          <RelationshipMeter
            familiarity={familiarity}
            affection={affection}
            language={userState.language}
            familiarityLabel={T.familiarity}
            affectionLabel={T.affection}
            cappedLabel={T.romanceCappedHint}
            compact
          />
          {diceRoll && displayFace !== null && (
            <div className={`px-4 py-2 border-2 rounded-sm shadow-xl font-black flex items-center gap-2 transition-colors duration-200 ${isRolling ? 'bg-slate-800/90 border-white/50 text-white' : `${diceStyle} dice-landed`}`}>
              <span className={`text-lg leading-none ${isRolling ? 'dice-rolling' : ''}`}>🎲</span>
              <span className={`text-sm md:text-base leading-none font-mono ${isRolling ? 'opacity-70' : ''}`}>{displayFace}<span className="opacity-50 text-[10px]"> /6</span></span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none pb-0 overflow-hidden">
        <div className="relative h-[55dvh] md:h-[80vh] max-h-[85dvh] flex items-end justify-center pointer-events-auto transition-all duration-500">
          <CharacterSprite character={character} emotion={lastModelMsg?.emotion} isSpeaking={lastModelMsg?.role === 'model' && !isLoading && !isDialogueFinished} fit="height" className="h-full" />
        </div>
      </div>

      {/* 💞 关系升级庆祝画面：親密度（冷色·更熟了）与好感度（暖色·心动了）观感分明 */}
      {levelUpEvent && (() => {
        const isFam = levelUpEvent.axis === 'familiarity';
        const lv = levelUpEvent.level;
        const levelDef = (isFam ? FAMILIARITY_LEVELS : AFFECTION_LEVELS)[lv - 1];
        const label = userState.language === 'en' ? levelDef.labelEn : levelDef.labelZh;
        // 解锁内容按轴归属：親密度给场景与日常服装，好感度给亲密服装
        const outfitLevels = isFam ? FAMILIARITY_GATED_OUTFIT_LEVELS : ROMANCE_GATED_OUTFIT_LEVELS;
        const newOutfits = outfitLevels.includes(lv) ? (OUTFIT_UNLOCKS[character.id]?.[lv] || []) : [];
        const newScenes = isFam ? (SCENE_UNLOCKS_BY_LEVEL[lv] || []) : [];
        const skin = isFam
          ? {
              icon: '🤝', title: T.levelUpFamiliarity,
              panel: 'from-sky-950/95 to-slate-950/95 border-sky-400/60 shadow-[0_0_80px_rgba(56,189,248,0.35)]',
              accent: 'text-sky-300', name: 'text-sky-400', glow: 'drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]',
              button: 'bg-sky-600 hover:bg-sky-500'
            }
          : {
              icon: '💞', title: T.levelUpAffection,
              panel: 'from-pink-950/95 to-slate-950/95 border-pink-400/60 shadow-[0_0_80px_rgba(236,72,153,0.4)]',
              accent: 'text-pink-300', name: 'text-pink-400', glow: 'drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]',
              button: 'bg-pink-600 hover:bg-pink-500'
            };
        return (
          <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-500">
            <div className={`relative w-full max-w-lg mx-4 bg-gradient-to-b ${skin.panel} border-2 rounded-sm p-8 md:p-12 text-center animate-in zoom-in-90 duration-500`}>
              <div className="text-5xl md:text-6xl mb-4 animate-bounce">{skin.icon}</div>
              <p className={`${skin.accent} font-black uppercase tracking-[0.4em] text-xs md:text-sm mb-2`}>{skin.title || T.levelUpTitle}</p>
              <h2 className={`text-4xl md:text-5xl font-black italic text-white mb-6 ${skin.glow}`}>Lv.{lv} <span className={skin.name}>{label}</span></h2>
              {(newOutfits.length > 0 || newScenes.length > 0) && (
                <div className="mb-8 space-y-2 text-left bg-black/40 border border-white/10 rounded-sm p-4">
                  {newOutfits.length > 0 && (
                    <p className="text-[11px] md:text-xs text-white/80"><span className="text-yellow-400 font-black uppercase tracking-widest mr-2">👗 {T.unlockOutfits}</span>{newOutfits.join(' / ')}</p>
                  )}
                  {newScenes.length > 0 && (
                    <p className="text-[11px] md:text-xs text-white/80"><span className="text-cyan-400 font-black uppercase tracking-widest mr-2">🗺️ {T.unlockScenes}</span>{newScenes.join(' / ')}</p>
                  )}
                </div>
              )}
              <button onClick={onLevelUpContinue} className={`w-full ${skin.button} text-white font-black py-4 uppercase tracking-[0.3em] text-sm transition-all shadow-xl rounded-sm`}>{T.levelUpContinue}</button>
            </div>
          </div>
        );
      })()}

      {/* 🔥 安全的测验弹窗 UI */}
      {currentQuiz && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-2xl bg-white p-6 md:p-10 rounded-xl shadow-2xl border-l-[12px] border-red-600 flex flex-col overflow-y-auto max-h-[90dvh]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-base md:text-lg font-black text-red-600 uppercase tracking-widest">{T.quizHeader} - {userState.grammarTopic}</h3>
              <button onClick={onCloseQuiz} className="text-gray-400 hover:text-red-600 text-sm font-black uppercase">✕ {T.close}</button>
            </div>
            <p className="text-xl md:text-3xl text-gray-900 mb-8 font-black leading-relaxed" dangerouslySetInnerHTML={{ __html: String(currentQuiz.question || '') }} />
            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(currentQuiz.options) && currentQuiz.options.map((opt: any, idx: number) => (
                <button key={idx} onClick={() => onQuizAnswer(idx)} className="bg-gray-50 hover:bg-red-50 text-gray-900 font-bold py-5 px-6 rounded-lg border-2 border-gray-200 hover:border-red-600 text-left text-base md:text-xl transition-all shadow-sm">
                  <span className="text-red-600 mr-4 italic font-black text-xl">{["A", "B", "C", "D"][idx] || "?"}.</span>
                  <span dangerouslySetInnerHTML={{ __html: String(opt || '') }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 w-full min-h-[40vh] bg-gradient-to-t from-black via-black/90 to-transparent z-40 pb-32 md:pb-24 px-4 md:px-8 flex flex-col items-center justify-end pointer-events-none overflow-y-auto">

        {/* 🔥 答题反馈面板 */}
        {quizFeedback && (
          <div className="mb-6 bg-slate-900/95 backdrop-blur-xl text-white px-8 py-6 rounded-sm shadow-2xl border-l-8 border-yellow-500 max-w-2xl z-[110] border-2 border-white/10 w-full pointer-events-auto">
            <div className="flex items-start gap-4"><span className="text-4xl">💡</span><div className="flex-1"><p className="text-sm md:text-lg leading-relaxed whitespace-pre-wrap">{quizFeedback}</p></div></div>
            <button onClick={onContinueAfterFeedback} className="mt-6 w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-black uppercase tracking-widest transition-all rounded-sm shadow-lg">CONTINUE</button>
          </div>
        )}

        <div className="pointer-events-auto w-full max-w-5xl flex flex-col items-center">
          {!isLoading && lastModelMsg?.pages && !isDialogueFinished && !currentQuiz && (
            <DialogueBox key={lastModelMsg.id} character={character} pages={lastModelMsg.pages} vocabulary={lastModelMsg.vocabulary || []} streaming={isStreaming} onFinish={onDialogueFinished} />
          )}

          {isLoading && (
            <div className="w-full bg-slate-900/90 backdrop-blur-md border-t-2 border-indigo-500 p-8 min-h-[160px] animate-pulse flex flex-col items-center justify-center shadow-2xl">
              <div className="text-indigo-400 font-black tracking-[1em] text-lg md:text-2xl">{T.generating}</div>
            </div>
          )}

          {(isDialogueFinished || isLoading) && !currentQuiz && !quizFeedback && (
            <div className={`w-full flex flex-col gap-4 mt-6 transition-all duration-700 ${isDialogueFinished ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {lastModelMsg && (
                <div className="w-full px-4 flex flex-col items-start opacity-60">
                  <span className="text-[10px] text-yellow-500 font-bold uppercase mb-1">▶ {displayName}</span>
                  <span className="text-xs text-white italic truncate w-full" title={safePreviewText}>{safePreviewText}</span>
                </div>
              )}
              <div className="relative flex w-full gap-2 md:gap-4 px-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSend()} placeholder={T.chatPlaceholder} disabled={isLoading} className="w-full bg-slate-900/95 border-2 border-white/20 rounded-full px-6 py-4 md:px-10 md:py-6 text-white text-base md:text-xl focus:outline-none focus:border-yellow-500 transition-all shadow-2xl pointer-events-auto" />
                <button onClick={onSend} disabled={isLoading || !inputText.trim()} className="bg-yellow-600 hover:bg-yellow-500 px-8 py-4 md:px-14 text-gray-900 font-black uppercase tracking-widest transition-all shadow-xl rounded-full text-sm md:text-lg pointer-events-auto">SEND</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div className="fixed z-[300] bg-slate-900 border-2 border-yellow-500 shadow-2xl p-1.5 md:p-2 min-w-[120px] md:min-w-[150px] transform -skew-x-2 animate-in fade-in zoom-in-95 duration-100 pointer-events-auto" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={(e) => { e.stopPropagation(); handleTranslateSelection(); }} className="w-full text-left px-3 py-1.5 md:px-4 md:py-2 text-white font-black uppercase text-[10px] md:text-xs hover:bg-yellow-500 hover:text-black transition-colors border-b border-white/10">{T.translateBtn}</button>
          <button onClick={(e) => { e.stopPropagation(); handleCollectSelection(); }} className="w-full text-left px-3 py-1.5 md:px-4 md:py-2 text-white font-black uppercase text-[10px] md:text-xs hover:bg-indigo-600 transition-colors">{T.collectBtn}</button>
        </div>
      )}

      {translationResult && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pointer-events-auto" onClick={() => setTranslationResult(null)}>
          <div className="w-full max-w-lg bg-slate-900 border-2 border-yellow-500 p-6 md:p-8 shadow-2xl transform skew-x-1" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 md:mb-6"><h4 className="text-yellow-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">{T.analysisResult}</h4><button onClick={() => setTranslationResult(null)} className="text-white/40 hover:text-white transition-colors">✕</button></div>
            <div className="space-y-4 md:space-y-6">
              <div><p className="text-white/50 text-[8px] md:text-[10px] uppercase font-bold mb-1 tracking-widest">Japanese</p><p className="text-white text-base md:text-xl font-bold leading-relaxed">{translationResult.original}</p></div>
              <div className="h-px bg-white/10 w-full" />
              <div><p className="text-yellow-500/50 text-[8px] md:text-[10px] uppercase font-bold mb-1 tracking-widest">{T.meaning}</p><p className="text-yellow-400 text-lg md:text-2xl font-black leading-tight">{translationResult.translation}</p></div>
            </div>
            <button onClick={() => setTranslationResult(null)} className="mt-6 md:mt-10 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 md:py-4 text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all shadow-lg">{T.gotIt}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
