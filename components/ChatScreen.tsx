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
  // 今天她已经道过别了：输入框换成一句说明，不是变灰的按钮
  dayClosed?: boolean;
  dayClosedNote?: string;
  onLeaveChat?: () => void;
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
  onSend, dayClosed, dayClosedNote, onLeaveChat, onDialogueFinished, onQuizAnswer, onCloseQuiz, onContinueAfterFeedback,
  onOpenSystemMenu, translate, onCollectWord, background
}) => {
  // 🎲 骰子配色：高点数金色（命运眷顾），中间白色，低点数冷灰
  const diceStyle = diceRoll
    ? diceRoll.value >= 5
      ? 'bg-gradient-to-br from-amber-300 to-pink-400 border-white text-white'
      : diceRoll.value >= 3
        ? 'bg-white/90 border-white text-[#1f2440]'
        : 'bg-slate-300/90 border-white text-slate-600'
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
  // 结束对话：点一下变成"确定？"，再点才走——误触就白聊了
  const [confirmLeave, setConfirmLeave] = useState(false);
  useEffect(() => {
    if (!confirmLeave) return;
    const t = setTimeout(() => setConfirmLeave(false), 3000);
    return () => clearTimeout(t);
  }, [confirmLeave]);
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

      <div className={`absolute top-4 right-4 z-[200] ui-chip !py-1.5 transition-opacity duration-500 pointer-events-none ${showAutoSave ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[10px] md:text-xs font-bold text-pink-500 tracking-widest uppercase animate-pulse">{T.autoSaving}</span>
      </div>

      {/* 💗 关系变化提示：两条轴各自冒泡，同回合都动时上下并排 */}
      {affectionToast && (affectionToast.delta !== 0 || affectionToast.famDelta !== 0) && (
        <div key={affectionToast.key} className="absolute top-16 right-4 z-[200] pointer-events-none flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {affectionToast.famDelta !== 0 && (
            <div className={`font-ui px-4 py-2 rounded-full border-2 shadow-[0_6px_18px_rgba(16,20,44,0.3)] font-black text-sm md:text-base ${affectionToast.famDelta > 0 ? 'bg-sky-400 border-white text-white' : 'bg-white/85 border-white text-slate-500'}`}>
              🤝 {affectionToast.famDelta > 0 ? `+${affectionToast.famDelta}` : affectionToast.famDelta}
            </div>
          )}
          {affectionToast.delta !== 0 && (
            <div className={`font-ui px-4 py-2 rounded-full border-2 shadow-[0_6px_18px_rgba(16,20,44,0.3)] font-black text-sm md:text-base ${affectionToast.delta > 0 ? 'bg-gradient-to-r from-pink-400 to-rose-400 border-white text-white' : 'bg-white/85 border-white text-slate-500'}`}>
              ♥ {affectionToast.delta > 0 ? `+${affectionToast.delta}` : affectionToast.delta}
            </div>
          )}
        </div>
      )}

      <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-6 flex justify-between items-start pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={onOpenSystemMenu} className="ui-chip !px-5 !py-2.5 uppercase tracking-[0.15em]">⚙️ {T.system}</button>
          {onLeaveChat && !dayClosed && (
            <button
              onClick={() => (confirmLeave ? onLeaveChat() : setConfirmLeave(true))}
              disabled={isLoading}
              className={`ui-chip !px-5 !py-2.5 tracking-[0.1em] disabled:opacity-40 ${confirmLeave ? '!bg-rose-500 !text-white' : ''}`}
            >
              {confirmLeave
                ? (userState.language === 'en' ? 'Leave? Tap again' : '确定结束？再点一次')
                : (userState.language === 'en' ? '👋 End chat' : '👋 结束对话')}
            </button>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-2 max-w-[70%] pointer-events-auto">
          <div className="ui-chip !py-2 !text-[#5b6286] !text-[10px] font-mono w-full md:w-auto justify-end">N3: {userState.playerName.toUpperCase()} | {userState.grammarTopic}</div>
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
            <div className={`px-4 py-2 border-2 rounded-full shadow-xl font-black flex items-center gap-2 transition-colors duration-200 ${isRolling ? 'bg-white/80 border-white text-[#1f2440]' : `${diceStyle} dice-landed`}`}>
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
              panel: 'from-white/95 to-sky-50/95 border-white shadow-[0_0_80px_rgba(56,189,248,0.45)]',
              accent: 'text-sky-500', name: 'text-sky-500', glow: 'drop-shadow-[0_0_14px_rgba(56,189,248,0.45)]',
              button: 'bg-gradient-to-r from-sky-400 to-indigo-400 hover:brightness-105'
            }
          : {
              icon: '💞', title: T.levelUpAffection,
              panel: 'from-white/95 to-pink-50/95 border-white shadow-[0_0_80px_rgba(236,72,153,0.45)]',
              accent: 'text-pink-500', name: 'text-pink-500', glow: 'drop-shadow-[0_0_14px_rgba(236,72,153,0.45)]',
              button: 'bg-gradient-to-r from-pink-400 to-amber-300 hover:brightness-105'
            };
        return (
          <div className="absolute inset-0 z-[150] flex items-center justify-center bg-[#141a33]/55 backdrop-blur-md pointer-events-auto animate-in fade-in duration-500">
            <div className={`relative w-full max-w-lg mx-4 bg-gradient-to-b ${skin.panel} border-2 rounded-[28px] p-8 md:p-12 text-center animate-in zoom-in-90 duration-500`}>
              <div className="text-5xl md:text-6xl mb-4 animate-bounce">{skin.icon}</div>
              <p className={`font-ui ${skin.accent} font-black uppercase tracking-[0.4em] text-xs md:text-sm mb-2`}>{skin.title || T.levelUpTitle}</p>
              <h2 className={`font-ui text-4xl md:text-5xl font-black text-[#1f2440] mb-6 ${skin.glow}`}>Lv.{lv} <span className={skin.name}>{label}</span></h2>
              {/* 这里以前列的是「解锁了 casual / ikuta_shrine_gate」——
                  那是文件名，不是给玩家看的东西。而且把"关系变近了"
                  翻译成一张清单，本身就把这件事变小了。
                  现在只说发生了什么，剩下的让玩家自己撞见。 */}
              {(newOutfits.length > 0 || newScenes.length > 0) && (
                <p className="mb-8 font-story text-[11px] md:text-xs text-[#5b6286] leading-relaxed">
                  {isFam
                    ? (userState.language === 'en' ? 'She talks to you differently now. You will notice where.' : '她跟你说话的方式变了。在哪儿变的，你自己会发现。')
                    : (userState.language === 'en' ? 'Something has moved. She has not said so.' : '有什么东西动了一下。她没有说。')}
                </p>
              )}
              <button onClick={onLevelUpContinue} className={`w-full ${skin.button} text-white font-ui font-black py-4 uppercase tracking-[0.3em] text-sm transition-all shadow-xl rounded-full`}>{T.levelUpContinue}</button>
            </div>
          </div>
        );
      })()}

      {/* 🔥 安全的测验弹窗 UI */}
      {currentQuiz && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-[#141a33]/55 backdrop-blur-md pointer-events-auto">
          <div className="ui-panel w-full max-w-2xl p-6 md:p-10 flex flex-col overflow-y-auto max-h-[90dvh]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-ui text-base md:text-lg font-black text-pink-500 uppercase tracking-widest">{T.quizHeader} - {userState.grammarTopic}</h3>
              <button onClick={onCloseQuiz} className="ui-chip">✕ {T.close}</button>
            </div>
            <p className="text-xl md:text-3xl text-[#1f2440] mb-8 font-black leading-relaxed" dangerouslySetInnerHTML={{ __html: String(currentQuiz.question || '') }} />
            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(currentQuiz.options) && currentQuiz.options.map((opt: any, idx: number) => (
                <button key={idx} onClick={() => onQuizAnswer(idx)} className="ui-choice font-bold py-5 pl-8 pr-6 text-left text-base md:text-xl">
                  <span className="font-ui text-pink-500 mr-4 font-black text-xl">{["A", "B", "C", "D"][idx] || "?"}.</span>
                  <span dangerouslySetInnerHTML={{ __html: String(opt || '') }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 w-full min-h-[40vh] bg-gradient-to-t from-[#121834]/85 via-[#121834]/45 to-transparent z-40 pb-32 md:pb-24 px-4 md:px-8 flex flex-col items-center justify-end pointer-events-none overflow-y-auto">

        {/* 🔥 答题反馈面板 */}
        {quizFeedback && (
          <div className="ui-panel mb-6 px-8 py-6 max-w-2xl z-[110] w-full pointer-events-auto">
            <div className="flex items-start gap-4"><span className="text-4xl">💡</span><div className="flex-1"><p className="text-sm md:text-lg leading-relaxed whitespace-pre-wrap">{quizFeedback}</p></div></div>
            <button onClick={onContinueAfterFeedback} className="mt-6 w-full py-3 ui-btn-primary uppercase">CONTINUE</button>
          </div>
        )}

        <div className="pointer-events-auto w-full max-w-5xl flex flex-col items-center">
          {!isLoading && lastModelMsg?.pages && !isDialogueFinished && !currentQuiz && (
            <DialogueBox key={lastModelMsg.id} character={character} pages={lastModelMsg.pages} vocabulary={lastModelMsg.vocabulary || []} streaming={isStreaming} onFinish={onDialogueFinished} />
          )}

          {isLoading && (
            <div className="ui-panel w-full p-8 min-h-[160px] animate-pulse flex flex-col items-center justify-center">
              <div className="font-ui text-pink-400 font-black tracking-[1em] text-lg md:text-2xl">{T.generating}</div>
            </div>
          )}

          {(isDialogueFinished || isLoading) && !currentQuiz && !quizFeedback && (
            <div className={`w-full flex flex-col gap-4 mt-6 transition-all duration-700 ${isDialogueFinished ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {lastModelMsg && (
                <div className="w-full px-4 flex flex-col items-start opacity-60">
                  <span className="font-ui text-[10px] text-pink-300 font-bold uppercase mb-1">✦ {displayName}</span>
                  <span className="text-xs text-white italic truncate w-full" title={safePreviewText}>{safePreviewText}</span>
                </div>
              )}
              {dayClosed ? (
                /* 她今天说完了。这里不放一个变灰的输入框——
                   变灰的输入框是在告诉玩家"系统不让你说"，
                   而实际发生的事是"她走了"。 */
                <div className="relative flex w-full flex-col items-center gap-3 px-2 pointer-events-auto">
                  <div className="ui-panel w-full max-w-2xl px-6 py-4 text-center">
                    <p className="font-story text-[#2b3152] text-sm md:text-base leading-relaxed">{dayClosedNote}</p>
                  </div>
                  <button
                    onClick={onLeaveChat}
                    className="ui-btn-ghost px-8 py-3 text-xs md:text-sm"
                  >
                    {userState.language === 'en' ? 'Leave' : '离开'}
                  </button>
                </div>
              ) : (
                <div className="relative flex w-full gap-2 md:gap-4 px-2">
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSend()} placeholder={T.chatPlaceholder} disabled={isLoading} className="w-full bg-white/90 backdrop-blur border-2 border-white rounded-full px-6 py-4 md:px-10 md:py-5 text-[#1f2440] placeholder-[#1f2440]/35 text-base md:text-xl focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-300/30 transition-all shadow-[0_10px_30px_rgba(16,20,44,0.35)] pointer-events-auto" />
                  <button onClick={onSend} disabled={isLoading || !inputText.trim()} className="ui-btn-primary px-8 py-4 md:px-14 uppercase text-sm md:text-lg pointer-events-auto">SEND</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div className="fixed z-[300] ui-panel !rounded-2xl p-1.5 md:p-2 min-w-[120px] md:min-w-[150px] animate-in fade-in zoom-in-95 duration-100 pointer-events-auto" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={(e) => { e.stopPropagation(); handleTranslateSelection(); }} className="w-full text-left px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-ui text-[#1f2440] font-bold text-[11px] md:text-xs hover:bg-pink-50 hover:text-pink-500 transition-colors">{T.translateBtn}</button>
          <button onClick={(e) => { e.stopPropagation(); handleCollectSelection(); }} className="w-full text-left px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-ui text-[#1f2440] font-bold text-[11px] md:text-xs hover:bg-emerald-50 hover:text-emerald-600 transition-colors">{T.collectBtn}</button>
        </div>
      )}

      {translationResult && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[#141a33]/50 backdrop-blur-sm p-4 pointer-events-auto" onClick={() => setTranslationResult(null)}>
          <div className="ui-panel w-full max-w-lg p-6 md:p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 md:mb-6"><h4 className="font-ui text-pink-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">{T.analysisResult}</h4><button onClick={() => setTranslationResult(null)} className="text-[#1f2440]/40 hover:text-pink-500 transition-colors">✕</button></div>
            <div className="space-y-4 md:space-y-6">
              <div><p className="text-[#5b6286] text-[8px] md:text-[10px] uppercase font-bold mb-1 tracking-widest">Japanese</p><p className="text-[#1f2440] text-base md:text-xl font-bold leading-relaxed">{translationResult.original}</p></div>
              <div className="h-px bg-[#1f2440]/10 w-full" />
              <div><p className="text-[#5b6286] text-[8px] md:text-[10px] uppercase font-bold mb-1 tracking-widest">{T.meaning}</p><p className="text-pink-500 text-lg md:text-2xl font-black leading-tight">{translationResult.translation}</p></div>
            </div>
            <button onClick={() => setTranslationResult(null)} className="mt-6 md:mt-10 w-full ui-btn-primary py-3 md:py-4 text-sm md:text-base">{T.gotIt}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
