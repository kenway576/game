import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language, StoryWord } from '../types';
import { KONBINI_ROUNDS, KonbiniRound, shiftPay, shiftGrade } from '../data/konbiniData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🏪 收银台前的八小时
//
// 客人说一句日语，你有几秒钟挑一句回应。答对队伍前进，答错或者超时，
// 队伍变长。连击直接进时薪。
//
// 【为什么倒计时条在客人那句话下面而不是屏幕顶上】
// 因为压力的来源是那句话本身——你在读它，同时时间在走。
// 条放在顶上，眼睛得在两个地方来回跳，那就变成了考反应，不是考听懂。
// ---------------------------------------------------------

export interface ShiftResult {
  correct: number;
  total: number;
  bestCombo: number;
  pay: number;
  grade: 'ace' | 'fine' | 'rough';
  words: StoryWord[];
}

interface Props {
  language: Language;
  onFinish: (r: ShiftResult) => void;
  onCancel: () => void;
}

const ROUND_MS = 6500;
const TICK = 50;

const KonbiniShiftModal: React.FC<Props> = ({ language, onFinish, onCancel }) => {
  const en = language === 'en';
  // 每次上班客人不一样，但顺序固定成一轮，免得同一个客人来两次
  const rounds = useMemo<KonbiniRound[]>(() => {
    const a = [...KONBINI_ROUNDS];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, 6);
  }, []);

  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(ROUND_MS);
  const [picked, setPicked] = useState<number | null>(null);
  const [queue, setQueue] = useState(4);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const words = useRef<StoryWord[]>([]);

  const round = rounds[idx];
  // 选项每一轮重新洗，正确答案不会总在第一个
  const order = useMemo(() => {
    const o = round ? round.options.map((_, i) => i) : [];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    return o;
  }, [round]);

  // 倒计时。选完之后停表。
  useEffect(() => {
    if (done || picked !== null) return;
    const t = setInterval(() => {
      setLeft(v => {
        if (v <= TICK) { clearInterval(t); answer(-1); return 0; }
        return v - TICK;
      });
    }, TICK);
    return () => clearInterval(t);
  }, [idx, picked, done]);

  const answer = (optIdx: number) => {
    if (picked !== null || !round) return;
    setPicked(optIdx);
    const ok = optIdx >= 0 && !!round.options[optIdx]?.ok;
    if (ok) {
      audioManager.playSfx('collect');
      setCorrect(c => c + 1);
      setCombo(c => { const n = c + 1; setBest(b => Math.max(b, n)); return n; });
      setQueue(q => Math.max(0, q - 1));
      if (round.word) words.current = [...words.current, round.word];
    } else {
      audioManager.playSfx('error');
      setCombo(0);
      setQueue(q => Math.min(9, q + 1));
    }
    setTimeout(() => {
      if (idx + 1 >= rounds.length) { setDone(true); return; }
      setIdx(i => i + 1);
      setPicked(null);
      setLeft(ROUND_MS);
    }, 1500);
  };

  if (done) {
    const grade = shiftGrade(correct, rounds.length);
    const pay = shiftPay(correct, rounds.length, best);
    return (
      <div className="fixed inset-0 z-[160] bg-black/92 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="text-5xl">{grade === 'ace' ? '🏅' : grade === 'fine' ? '🍙' : '😵'}</div>
          <h3 className="text-white text-2xl font-black italic tracking-tight">
            {grade === 'ace'
              ? (en ? 'The manager asks when you are free again' : '店长问你下周还有没有空')
              : grade === 'fine'
                ? (en ? 'A shift, got through' : '一天班，上完了')
                : (en ? 'A long eight hours' : '很长的八个小时')}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {grade === 'ace'
              ? (en ? 'Nobody in the queue had to repeat themselves. That has not happened to you before.'
                    : '队里没有一个人需要把话说第二遍。这是第一次。')
              : grade === 'fine'
                ? (en ? 'Some of them had to say it twice. Most of them did not mind.'
                      : '有几个人说了两遍。大部分人不在意。')
                : (en ? 'You spent most of it half a sentence behind. The tin of coffee still turned up at the end.'
                      : '你大半天都慢半句。收工的时候那罐咖啡还是放到了你手边。')}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="text-white/70">{en ? 'Correct' : '答对'} <b className="text-white">{correct}/{rounds.length}</b></span>
            <span className="text-white/70">{en ? 'Best run' : '最长连击'} <b className="text-white">{best}</b></span>
            <span className="text-emerald-300 font-black">¥{pay.toLocaleString('ja-JP')}</span>
          </div>
          <button
            onClick={() => onFinish({ correct, total: rounds.length, bestCombo: best, pay, grade, words: words.current })}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12"
          >
            <span className="block transform skew-x-12">{en ? 'Clock off' : '下班'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!round) return null;
  const pct = Math.max(0, Math.min(100, (left / ROUND_MS) * 100));
  const chosenOk = picked !== null && picked >= 0 && !!round.options[picked]?.ok;

  return (
    <div className="fixed inset-0 z-[160] bg-black/92 backdrop-blur-sm flex flex-col">
      {/* 队伍和连击 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-[10px] font-black tracking-widest">{en ? 'QUEUE' : '队'}</span>
          <span className="text-lg tracking-tight">{'🧍'.repeat(Math.max(1, queue))}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-[10px] font-black tracking-widest">
            {idx + 1} / {rounds.length}
          </span>
          {combo > 1 && (
            <span className="text-yellow-300 text-sm font-black">{combo} {en ? 'in a row' : '连'}</span>
          )}
          <button onClick={onCancel}
            className="text-white/35 hover:text-white/70 text-[10px] font-black tracking-widest">
            {en ? 'GIVE UP' : '不干了'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center px-6 max-w-3xl w-full mx-auto">
        <p className="text-white/35 text-[11px] font-bold tracking-widest mb-2">
          {en ? round.whoEn : round.whoZh}
        </p>
        <p className="text-white text-2xl md:text-3xl font-bold leading-snug">{round.jp}</p>
        <p className="text-white/45 text-sm mt-2">{en ? round.en : round.zh}</p>

        {/* 倒计时贴着那句话 */}
        <div className="h-1 bg-white/10 mt-4 mb-6 overflow-hidden">
          <div className="h-full bg-yellow-400 transition-[width] duration-75"
               style={{ width: `${picked === null ? pct : 0}%` }} />
        </div>

        <div className="space-y-2">
          {order.map(oi => {
            const o = round.options[oi];
            const isPick = picked === oi;
            const reveal = picked !== null;
            return (
              <button key={oi}
                disabled={reveal}
                onClick={() => answer(oi)}
                className={`w-full text-left px-4 py-3 border transition-all ${
                  reveal && o.ok
                    ? 'bg-emerald-500/15 border-emerald-400/60'
                    : isPick
                      ? 'bg-rose-500/15 border-rose-400/60'
                      : 'bg-white/[0.03] border-white/12 hover:bg-white/[0.08] hover:border-yellow-400/40'}`}
              >
                <span className="block text-white text-base font-bold">{o.jp}</span>
                <span className="block text-white/40 text-xs mt-0.5">{en ? o.en : o.zh}</span>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <p className={`mt-5 text-sm ${chosenOk ? 'text-emerald-300' : 'text-white/60'}`}>
            {chosenOk
              ? (round.word
                  ? `「${round.word.jp}」— ${en ? round.word.en : round.word.zh}`
                  : (en ? 'Next.' : '下一位。'))
              : (en ? round.missEn : round.missZh)}
          </p>
        )}
      </div>
    </div>
  );
};

export default KonbiniShiftModal;
