import React, { useMemo, useState } from 'react';
import { Language, RecipeDef } from '../types';
import { RECIPE_CARDS, RecipeStepAction } from '../data/recipeCards';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🍳 做菜：读日文菜谱，按顺序动手
//
// 左边是菜谱卡（日语），右边是一桌动作（你的语言）。
// 读懂一句，点一步。点错顺序或者点了菜谱明说不要做的事，算一次失误。
//   零失误、没看翻译 → 完美
//   失误一两次       → 成功
//   失误三次         → 糊了
// 看翻译随时可以，但看了就拿不到完美——跟情景对答"看译文算半分"一个道理。
//
// 接口跟原来的 QTE 一模一样，厨房和结算都不用改。
// ---------------------------------------------------------

export type CookingResult = 'perfect' | 'success' | 'failed';

interface Props {
  recipe: RecipeDef;
  language: Language;
  firstTime: boolean;
  // pack = 装进盒子带走，不当场吃掉。做成功了才给这条路。
  onFinish: (result: CookingResult, pack?: boolean) => void;
  onCancel: () => void;
}

const MAX_MISTAKES = 3;

const statName = (k: string, en: boolean) => en
  ? k
  : ({ knowledge: '知识', guts: '勇气', kindness: '体贴', charm: '魅力', proficiency: '灵巧' } as Record<string, string>)[k] || k;

export const CookingRecipeModal: React.FC<Props> = ({ recipe, language, firstTime, onFinish, onCancel }) => {
  const en = language === 'en';
  const card = RECIPE_CARDS[recipe.id];

  // 桌上的动作：正确步骤＋陷阱，打乱摆
  const tiles = useMemo<(RecipeStepAction & { trap?: boolean })[]>(() => {
    if (!card) return [];
    const all = [...card.steps, ...card.traps.map(t => ({ ...t, trap: true }))];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [recipe.id]);

  const [done, setDone] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [hinted, setHinted] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; zh: string; en: string } | null>(null);
  const [result, setResult] = useState<CookingResult | null>(null);

  // 没有菜谱卡的菜（以后加了新菜忘了写卡）直接算成功，别把人卡在厨房里
  if (!card) {
    return (
      <div className="fixed inset-0 z-[170] bg-black/90 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-white">{en ? recipe.nameEn : recipe.nameZh}</p>
          <button onClick={() => onFinish('success')} className="bg-yellow-400 text-black px-8 py-2 font-black text-xs">
            {en ? 'Done' : '做好了'}
          </button>
        </div>
      </div>
    );
  }

  const next = card.steps[done.length];

  const tap = (t: RecipeStepAction & { trap?: boolean }) => {
    if (result || done.includes(t.id)) return;
    if (next && t.id === next.id) {
      audioManager.playSfx('collect');
      const nd = [...done, t.id];
      setDone(nd);
      setFeedback({ ok: true, zh: `${t.emoji} ${t.zh}`, en: `${t.emoji} ${t.en}` });
      if (nd.length === card.steps.length) {
        setTimeout(() => {
          audioManager.playSfx('levelup_affection');
          setResult(mistakes === 0 && !hinted ? 'perfect' : 'success');
        }, 450);
      }
      return;
    }
    // 失误
    audioManager.playSfx('error');
    setShake(t.id);
    setTimeout(() => setShake(null), 450);
    const laterStep = card.steps.findIndex(s => s.id === t.id) > done.length;
    setFeedback(t.trap
      ? { ok: false, zh: '菜谱里可没这么说——再读一遍。', en: 'The recipe says nothing of the kind. Read it again.' }
      : laterStep
        ? { ok: false, zh: '这一步还早。先看看句子里真正的顺序。', en: 'Too early for that. Check the real order in the sentence.' }
        : { ok: false, zh: '不是这个。', en: 'Not that one.' });
    const m = mistakes + 1;
    setMistakes(m);
    if (m >= MAX_MISTAKES) {
      setTimeout(() => setResult('failed'), 500);
    }
  };

  // ================== 结果 ==================
  if (result) {
    return (
      <div className="fixed inset-0 z-[170] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-6xl">{result === 'failed' ? '💨' : recipe.emoji}</div>
          <h3 className={`text-2xl font-black italic ${result === 'perfect' ? 'text-amber-300' : result === 'success' ? 'text-white' : 'text-rose-300'}`}>
            {result === 'perfect'
              ? (en ? 'Perfect!' : '完美出锅！')
              : result === 'success'
                ? (en ? 'Done' : '做好了')
                : (en ? 'Burnt' : '糊了')}
          </h3>
          <p className="text-white/65 text-sm leading-relaxed">
            {result === 'perfect'
              ? (en ? 'You read every line right the first time. The recipe card goes back in the drawer, not needed next time.'
                    : '每一句都一次读对。这张菜谱卡可以收进抽屉了，下次不用看。')
              : result === 'success'
                ? (en ? 'A step or two out of order, but it came out fine.' : '顺序错了一两步，不过出锅还是像样的。')
                : (en ? 'Somewhere in the second line you lost the thread. What is left in the pan is not dinner.'
                      : '读到第二句的时候就乱了。锅里剩下的东西，算不上晚饭。')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {result !== 'failed' ? (
              <>
                {recipe.effects.map(e => (
                  <span key={e.stat} className="px-3 py-1 bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-xs font-bold">
                    {statName(e.stat, en)} +{e.amount}
                  </span>
                ))}
                {result === 'perfect' && (
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-bold">
                    {en ? 'Perfect · Proficiency +1' : '一次读对 · 灵巧 +1'}
                  </span>
                )}
                {firstTime && (
                  <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 text-xs font-bold">
                    {en ? 'First time · Knowledge +1' : '第一次做 · 知识 +1'}
                  </span>
                )}
              </>
            ) : (
              <span className="px-3 py-1 bg-zinc-800 border border-rose-500/40 text-rose-300 text-xs font-bold">
                {en ? 'Learned the hard way · Guts +1' : '吃一堑 · 勇气 +1'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => { audioManager.playSfx('confirm'); onFinish(result); }}
              className="px-10 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-widest transform -skew-x-12"
            >
              <span className="block transform skew-x-12">
                {result === 'failed' ? (en ? 'Clean up' : '收拾灶台') : (en ? 'Eat it hot' : '趁热吃')}
              </span>
            </button>
            {result !== 'failed' && (
              <button
                onClick={() => { audioManager.playSfx('confirm'); onFinish(result, true); }}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/25 text-white/85 font-black text-sm tracking-widest transform -skew-x-12"
              >
                <span className="block transform skew-x-12">🍱 {en ? 'Pack it in a box' : '装进盒子带走'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================== 进行中 ==================
  return (
    <div className="fixed inset-0 z-[170] bg-black/92 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{recipe.emoji}</span>
          <span className="text-white font-black">{recipe.nameJp}</span>
          <span className="text-white/40 text-xs">{en ? recipe.nameEn : recipe.nameZh}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/50">
            {en ? 'Mistakes' : '失误'}{' '}
            {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
              <span key={i} className={i < mistakes ? 'text-rose-400' : 'text-white/20'}>●</span>
            ))}
          </span>
          <button onClick={onCancel} className="text-white/35 hover:text-white/70 text-[10px] font-black tracking-widest">
            {en ? 'STOP' : '不做了'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 max-w-6xl w-full mx-auto">
        {/* 菜谱卡：纸的样子 */}
        <div className="bg-[#f6efe0] text-[#3b2f24] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-5 md:p-7 relative self-start">
          <div className="absolute top-3 right-4 text-[10px] tracking-widest text-[#8a7560] font-black">RECIPE</div>
          <h3 className="font-black text-xl md:text-2xl mb-1">{recipe.nameJp}</h3>
          <p className="text-[11px] text-[#8a7560] mb-4">{recipe.reading}</p>
          <ol className="space-y-3">
            {card.lines.map((l, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-black text-[#b4552d] shrink-0">{i + 1}.</span>
                <span className="min-w-0">
                  <span className="block text-base md:text-lg leading-relaxed">{l.jp}</span>
                  {hinted && <span className="block text-xs text-[#7a6a58] mt-1">{en ? l.en : l.zh}</span>}
                </span>
              </li>
            ))}
          </ol>
          {!hinted && (
            <button
              onClick={() => { audioManager.playSfx('click'); setHinted(true); }}
              className="mt-5 text-[11px] text-[#8a7560] hover:text-[#3b2f24] border-b border-dashed border-[#8a7560]"
            >
              {en ? 'Show translation (no Perfect after this)' : '看翻译（看了就拿不到完美）'}
            </button>
          )}
        </div>

        {/* 灶台 */}
        <div className="flex flex-col gap-4">
          {/* 已经做完的步骤排成一行，像一条流水线 */}
          <div className="relative rounded-sm overflow-hidden border border-white/10 min-h-[92px]">
            <img src="/images/ui/cooking_cutting_board.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="relative flex flex-wrap items-center gap-2 p-3">
              {card.steps.map((s, i) => (
                <div key={s.id}
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl border-2 rounded-sm transition-all ${
                    i < done.length ? 'bg-amber-400/25 border-amber-300/70 scale-100' : 'bg-black/40 border-white/15 border-dashed'}`}>
                  {i < done.length ? s.emoji : <span className="text-white/25 text-xs font-black">{i + 1}</span>}
                </div>
              ))}
            </div>
          </div>

          <p className={`min-h-[1.25rem] text-sm ${feedback?.ok ? 'text-emerald-300' : 'text-rose-300'}`}>
            {feedback ? (en ? feedback.en : feedback.zh) : (en ? 'Read the card. Tap the next step.' : '读菜谱，点下一步要做的事。')}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {tiles.map(t => {
              const used = done.includes(t.id);
              return (
                <button key={t.id} disabled={used} onClick={() => tap(t)}
                  className={`text-left px-3 py-3 border flex items-center gap-2 transition-all ${
                    used
                      ? 'opacity-25 border-white/5 bg-white/[0.02]'
                      : shake === t.id
                        ? 'border-rose-400 bg-rose-500/20 animate-[shake_0.4s]'
                        : 'border-white/15 bg-white/[0.05] hover:bg-white/[0.1] hover:border-yellow-400/50'}`}>
                  <span className="text-xl shrink-0">{t.emoji}</span>
                  <span className="text-white text-sm font-bold">{en ? t.en : t.zh}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`@keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }`}</style>
    </div>
  );
};

export default CookingRecipeModal;
