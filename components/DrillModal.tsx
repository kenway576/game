import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DrillPack, DrillRound, DrillLine, Language, PracticeProgress, StoryWord } from '../types';
import { TIER_RULES, settlePractice, PROMOTE_AFTER } from '../data/drillData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🗣️ 情景对答
//
// 便利店收银那一套的通用版：对方说一句，你在时限里挑一句回应。
//
// 【三件跟老版不一样的事】
// 1. 选项答题前**不给译文**。老版选项下面直接挂着中文——那不是在考日语，
//    是在考找中文。译文现在答完才出来，而且错的那几句也翻，让你看见
//    "你刚才其实说了什么"。
// 2. 答完不自动跳。讲解就在那一刻最有用，所以停下来等你看完再点下一题。
// 3. 二档起题目本身也不给译文；可以点"看译文"，但这一题只算半分。
//    给你留一条路，但走这条路有代价。
// ---------------------------------------------------------

export interface DrillResult {
  correct: number;      // 答对几题
  score: number;        // 计入达标的分数（看了译文的题只算半分）
  total: number;
  bestCombo: number;
  words: StoryWord[];
  seenIds: string[];
}

interface Props {
  pack: DrillPack;
  rounds: DrillRound[];
  progress?: PracticeProgress;
  language: Language;
  playerName: string;
  background?: string;
  // 'shift' = 便利店那种：显示排队的人和连击
  variant?: 'talk' | 'shift';
  // 结算页上额外的一行（打工的工钱），以及结束按钮上的字
  summaryExtra?: (r: DrillResult) => { line?: string; button?: string };
  onFinish: (r: DrillResult) => void;
  onCancel: () => void;
}

const TICK = 50;

const DrillModal: React.FC<Props> = ({
  pack, rounds, progress, language, playerName, background,
  variant = 'talk', summaryExtra, onFinish, onCancel
}) => {
  const en = language === 'en';
  const fill = (s: string) => s.split('{name}').join(playerName || (en ? 'me' : '我'));

  const [idx, setIdx] = useState(0);
  const round = rounds[idx];
  const rule = TIER_RULES[round?.tier ?? 1];

  const [left, setLeft] = useState(rule.ms);
  const [picked, setPicked] = useState<number | null>(null);   // -1 = 超时
  const [hinted, setHinted] = useState(false);
  const [reaction, setReaction] = useState<DrillLine | null>(null);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [queue, setQueue] = useState(4);
  const [done, setDone] = useState(false);
  const tally = useRef({ correct: 0, score: 0, words: [] as StoryWord[] });

  // 选项每题重新洗，正确答案不会总在同一个位置
  const order = useMemo(() => {
    const o = round ? round.options.map((_, i) => i) : [];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    return o;
  }, [round]);

  // 倒计时：答了就停。
  // 判超时放在另一个 effect 里——在 setLeft 的 updater 里直接调 answer，
  // StrictMode 下 updater 会跑两遍，一次超时会被记成两次答错。
  useEffect(() => {
    if (done || picked !== null || !round) return;
    const t = setInterval(() => setLeft(v => Math.max(0, v - TICK)), TICK);
    return () => clearInterval(t);
  }, [idx, picked, done]);
  useEffect(() => {
    if (left <= 0 && picked === null && !done && round) answer(-1);
  }, [left]);

  const answer = (optIdx: number) => {
    if (picked !== null || !round) return;
    setPicked(optIdx);
    const ok = optIdx >= 0 && !!round.options[optIdx]?.ok;
    const pool = ok ? pack.onRight : pack.onWrong;
    setReaction(pool[Math.floor(Math.random() * pool.length)]);
    if (ok) {
      audioManager.playSfx('quiz_correct');
      tally.current.correct += 1;
      tally.current.score += hinted ? 0.5 : 1;
      if (round.word) tally.current.words.push(round.word);
      // 看了译文答对的不算连击：连击是"听懂了"的奖励
      if (!hinted) setCombo(c => { const n = c + 1; setBest(b => Math.max(b, n)); return n; });
      else setCombo(0);
      setQueue(q => Math.max(0, q - 1));
    } else {
      audioManager.playSfx('quiz_wrong');
      setCombo(0);
      setQueue(q => Math.min(9, q + 1));
    }
  };

  const next = () => {
    if (picked === null) return;
    audioManager.playSfx('page');
    if (idx + 1 >= rounds.length) { setDone(true); return; }
    const nr = rounds[idx + 1];
    setIdx(i => i + 1);
    setPicked(null);
    setHinted(false);
    setReaction(null);
    setLeft(TIER_RULES[nr.tier].ms);
  };

  // 键盘：1-4 选，回车 / 空格下一题
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (picked === null) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= order.length) answer(order[n - 1]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const result = (): DrillResult => ({
    correct: tally.current.correct,
    score: tally.current.score,
    total: rounds.length,
    bestCombo: best,
    words: tally.current.words,
    seenIds: rounds.map(r => r.id)
  });

  // ================== 结算 ==================
  if (done) {
    const r = result();
    const outcome = settlePractice(progress, r.score, r.total, r.seenIds);
    const extra = summaryExtra?.(r) || {};
    const rate = Math.round(outcome.rate * 100);
    const tierLabel = (t: 1 | 2 | 3) => en ? TIER_RULES[t].labelEn : TIER_RULES[t].labelZh;
    return (
      <div className="fixed inset-0 z-[160] bg-[#0b0b10] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5">
          <img src={outcome.cleared ? pack.sprites.happy : pack.sprites.neutral} alt=""
               className="h-48 mx-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]" />
          <h3 className="text-white text-2xl font-black italic tracking-tight">
            {outcome.promoted
              ? (en ? `Up to ${tierLabel(outcome.progress.tier)}!` : `升到${tierLabel(outcome.progress.tier)}了！`)
              : outcome.cleared
                ? (en ? 'Cleared' : '达标')
                : (en ? 'Not quite yet' : '还差一点')}
          </h3>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="text-white/70">{en ? 'Correct' : '答对'} <b className="text-white">{r.correct}/{r.total}</b></span>
            <span className="text-white/70">{en ? 'Score' : '得分'} <b className={outcome.cleared ? 'text-emerald-300' : 'text-white'}>{rate}%</b></span>
            {r.bestCombo > 1 && <span className="text-white/70">{en ? 'Best run' : '最长连对'} <b className="text-yellow-300">{r.bestCombo}</b></span>}
          </div>
          {/* 离升档还有多远。这一行是整套分档机制唯一露在玩家面前的地方 */}
          <p className="text-white/55 text-xs leading-relaxed">
            {outcome.progress.tier >= 3 && !outcome.promoted
              ? (en ? `Advanced. Best score so far: ${outcome.progress.best}%.` : `已经是上级了。目前最好成绩 ${outcome.progress.best}%。`)
              : outcome.promoted
                ? (en ? 'The next session starts at the new level.' : '下次开始按新的难度出题。')
                : (en
                    ? `${tierLabel(outcome.progress.tier)} · clear ${PROMOTE_AFTER - outcome.progress.clears} more time(s) at ${Math.round(0.75 * 100)}%+ to move up`
                    : `${tierLabel(outcome.progress.tier)} · 再有 ${PROMOTE_AFTER - outcome.progress.clears} 次答对 75% 以上就升档`)}
          </p>
          {r.score < r.correct && (
            <p className="text-white/35 text-[11px]">
              {en ? 'Questions where you peeked at the translation count for half.' : '看了译文的题只算半分。'}
            </p>
          )}
          {extra.line && <p className="text-emerald-300 font-black">{extra.line}</p>}
          {r.words.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {r.words.map((w, i) => (
                <span key={i} className="text-[11px] px-2 py-1 border border-white/15 text-white/70">
                  {w.jp}{w.reading ? `（${w.reading}）` : ''} · {en ? w.en : w.zh}
                </span>
              ))}
            </div>
          )}
          <button
            onClick={() => { audioManager.playSfx('confirm'); onFinish(r); }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12"
          >
            <span className="block transform skew-x-12">{extra.button || (en ? 'Done' : '结束')}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!round) return null;

  const pct = Math.max(0, Math.min(100, (left / rule.ms) * 100));
  const answered = picked !== null;
  const chosenOk = answered && picked! >= 0 && !!round.options[picked!]?.ok;
  const showPromptTr = rule.showPromptTranslation || hinted || answered;
  const sprite = !answered ? pack.sprites.neutral : chosenOk ? pack.sprites.happy : pack.sprites.miss;
  const isPreview = progress && round.tier > progress.tier;

  return (
    <div className="fixed inset-0 z-[160] flex flex-col bg-black">
      {background && (
        <img src={background} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

      {/* 顶栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-yellow-400 text-[10px] md:text-xs font-black tracking-widest shrink-0">
            {en ? pack.grammarEn : pack.grammarZh}
          </span>
          <span className={`text-[10px] px-2 py-0.5 border shrink-0 ${
            round.tier === 3 ? 'border-rose-400/60 text-rose-300'
              : round.tier === 2 ? 'border-amber-400/60 text-amber-300'
              : 'border-emerald-400/50 text-emerald-300'}`}>
            {en ? TIER_RULES[round.tier].labelEn : TIER_RULES[round.tier].labelZh}
            {isPreview && (en ? ' · next level' : ' · 进阶题')}
          </span>
          {variant === 'shift' && (
            <span className="text-sm tracking-tight truncate" title={en ? 'Queue' : '排队'}>{'🧍'.repeat(Math.max(1, queue))}</span>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-white/40 text-[10px] font-black tracking-widest">{idx + 1} / {rounds.length}</span>
          {combo > 1 && <span className="text-yellow-300 text-sm font-black">{combo} {en ? 'in a row' : '连'}</span>}
          <button onClick={onCancel} className="text-white/35 hover:text-white/70 text-[10px] font-black tracking-widest">
            {variant === 'shift' ? (en ? 'GIVE UP' : '不干了') : (en ? 'LEAVE' : '先不练了')}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 flex items-end md:items-center justify-center gap-6 px-4 md:px-8 pb-4 overflow-y-auto">
        {/* 对面的人 */}
        <img src={sprite} alt=""
             className="hidden md:block h-[70vh] max-h-[620px] object-contain self-end drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-300" />

        <div className="w-full max-w-2xl py-4">
          <div className="flex items-center gap-3 mb-2">
            <img src={sprite} alt="" className="md:hidden h-20 object-contain" />
            <div>
              <p className="text-yellow-400/90 text-xs font-black tracking-widest">{en ? pack.partnerEn : pack.partnerZh}</p>
              {(round.ctxZh || round.ctxEn) && (
                <p className="text-white/45 text-[11px] md:text-xs mt-0.5">{fill(en ? (round.ctxEn || '') : (round.ctxZh || ''))}</p>
              )}
            </div>
          </div>

          <p className="text-white text-xl md:text-3xl font-bold leading-snug">「{fill(round.jp)}」</p>
          <div className="min-h-[1.5rem] mt-1.5">
            {showPromptTr
              ? <p className="text-white/50 text-sm">{fill(en ? round.en : round.zh)}</p>
              : (
                <button onClick={() => { audioManager.playSfx('click'); setHinted(true); }}
                  className="text-[11px] text-white/35 hover:text-white/70 border-b border-dashed border-white/25">
                  {en ? 'Show translation (this question counts half)' : '看译文（这题只算半分）'}
                </button>
              )}
          </div>

          {/* 倒计时贴着那句话：压力来自那句话本身 */}
          <div className="h-1 bg-white/10 mt-3 mb-5 overflow-hidden">
            <div className={`h-full transition-[width] duration-75 ${pct < 25 ? 'bg-rose-400' : 'bg-yellow-400'}`}
                 style={{ width: `${answered ? 0 : pct}%` }} />
          </div>

          <div className="space-y-2">
            {order.map((oi, n) => {
              const o = round.options[oi];
              const isPick = picked === oi;
              return (
                <button key={oi} disabled={answered} onClick={() => answer(oi)}
                  className={`w-full text-left px-4 py-3 border transition-all flex gap-3 ${
                    answered && o.ok
                      ? 'bg-emerald-500/15 border-emerald-400/60'
                      : isPick
                        ? 'bg-rose-500/15 border-rose-400/60'
                        : answered
                          ? 'bg-white/[0.02] border-white/8 opacity-70'
                          : 'bg-white/[0.04] border-white/15 hover:bg-white/[0.09] hover:border-yellow-400/50'}`}>
                  <span className="text-white/30 text-xs font-black mt-1 shrink-0">{n + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-white text-base md:text-lg font-bold">{fill(o.jp)}</span>
                    {/* 答完才出译文——错的那几句也翻，让你看见自己刚才说了什么 */}
                    {answered && <span className="block text-white/45 text-xs mt-0.5">{fill(en ? o.en : o.zh)}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {reaction && (
                <p className={`text-sm ${chosenOk ? 'text-emerald-300' : 'text-rose-200'}`}>
                  <b className="mr-2">{en ? pack.partnerEn : pack.partnerZh}</b>「{reaction.jp}」
                  <span className="text-white/40 ml-2">{en ? reaction.en : reaction.zh}</span>
                </p>
              )}
              {picked === -1 && <p className="text-white/50 text-xs">{en ? 'Time ran out.' : '时间到了。'}</p>}
              {!chosenOk && (round.missZh || round.missEn) && (
                <p className="text-white/55 text-xs italic">{fill(en ? (round.missEn || '') : (round.missZh || ''))}</p>
              )}
              <div className="border-l-2 border-yellow-400/70 bg-white/[0.04] px-4 py-3">
                <p className="text-white/80 text-sm leading-relaxed">{fill(en ? round.noteEn : round.noteZh)}</p>
                {round.word && (
                  <p className="text-yellow-200/80 text-xs mt-2">
                    📒 {round.word.jp}{round.word.reading ? `（${round.word.reading}）` : ''} — {en ? round.word.en : round.word.zh}
                    {chosenOk && <span className="text-white/35 ml-2">{en ? '→ wordbook' : '→ 已记进单词本'}</span>}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button onClick={next}
                  className="bg-yellow-400 hover:bg-white text-black px-8 py-2.5 text-xs font-black tracking-widest transform -skew-x-12">
                  <span className="block transform skew-x-12">
                    {idx + 1 >= rounds.length ? (en ? 'Finish ▶' : '结束 ▶') : (en ? 'Next ▶' : '下一题 ▶')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrillModal;
