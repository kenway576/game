import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Language, PracticeProgress, PracticeTier, StoryWord } from '../types';
import { buildPoemQuestions, PoemQuestion } from '../data/hyakuninIsshu';
import { PUZZLES, Chunk, HaikuPuzzle, FAMOUS_SETS, countMora, scoreHaiku, HaikuScore } from '../data/haikuData';
import { audioManager } from '../services/audioManager';
import { Emo, EmoText } from './Emo';

// ---------------------------------------------------------
// 🍵 句会：跟铃玩两样东西
//
//  ① 百人一首   念「上の句」，四张里选对「下の句」。
//               初级给译文和读音；中级只给读音、限时；上级什么都不给、限时更短。
//  ② 俳句づくり  把词块拼成 5-7-5。要有季语、要用切れ字、不能季重なり。
//               初级显示每行的音拍数；中级起要自己数。
//
// 第一次玩每一种，铃会先讲规则（跟钓鱼、做饭、投篮一个规矩）。
// ---------------------------------------------------------

export interface HaikuResult {
  mode: 'hyakunin' | 'haiku';
  score: number;       // 得分
  total: number;       // 满分
  best: boolean;       // 是否拿到了“特别好”的成绩（全对 / 名句 / 90+）
  famous: boolean;     // 俳句拼出了芭蕉的原句
  words: StoryWord[];
  seenIds: string[];   // 这次出过的题（poem:xxx / haiku:xxx），下次尽量避开
}

interface Props {
  language: Language;
  progress?: PracticeProgress;
  introSeen: Record<string, boolean>;
  onSeenIntro: (key: string) => void;
  onFinish: (r: HaikuResult) => void;
  onCancel: () => void;
}

const REI = {
  neutral: '/images/characters/rei/casual_neutral.webp',
  smile: '/images/characters/rei/casual_smile.webp',
  thinking: '/images/characters/rei/casual_thinking.webp',
  surprised: '/images/characters/rei/casual_surprised.webp',
  shy: '/images/characters/rei/casual_shy.webp',
  sad: '/images/characters/rei/casual_sad.webp'
};
// 句会专用的美术（scripts/remake/gen-minigame-art.mjs）：图书馆里铺了榻榻米的一角、和纸的歌牌和短册
const ART = '/images/minigames/';
const BG = ART + 'kukai_bg.webp';
// 和纸纹理：歌牌（取り札 / 読み札）用 washi_card，俳句那三行用 tanzaku_strip
const WASHI = { backgroundImage: `url(${ART}washi_card.webp)`, backgroundSize: '100% 100%' } as const;
const TANZAKU = { backgroundImage: `url(${ART}tanzaku_strip.webp)`, backgroundSize: '100% 100%' } as const;

type Say = { jp: string; zh: string; en: string };
const pickOf = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

const P_RIGHT: Say[] = [
  { jp: '正解です。……よく覚えていましたね。', zh: '正确。……记得很牢嘛。', en: 'Correct. ...You remembered well.' },
  { jp: 'ええ。その通りです。', zh: '嗯。就是这样。', en: 'Yes. Exactly.' },
  { jp: '……少し、驚きました。', zh: '……有点意外。', en: '...I am a little surprised.' }
];
const P_WRONG: Say[] = [
  { jp: '惜しい。でも、ここは覚えておいてください。', zh: '可惜。不过这一首请记住。', en: 'Close. But please remember this one.' },
  { jp: '大丈夫です。間違えた歌ほど、忘れませんから。', zh: '没关系。错过的歌，反而不会忘。', en: 'It is fine. The poems you miss are the ones you keep.' }
];
const P_TIME: Say = { jp: '時間切れです。……焦らないで。', zh: '时间到了。……别急。', en: 'Time is up. ...Do not rush.' };

const jaVoice = (): SpeechSynthesisVoice | null => {
  try {
    const vs = window.speechSynthesis?.getVoices?.() || [];
    return vs.find(v => v.lang === 'ja-JP') || vs.find(v => v.lang.startsWith('ja')) || null;
  } catch { return null; }
};
const speak = (text: string) => {
  try {
    const v = jaVoice();
    if (!v || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = v; u.lang = 'ja-JP'; u.rate = 0.7; u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  } catch { /* ignore */ }
};

// ---- 规则讲解卡 ----
interface Card { face: keyof typeof REI; jp: string; zh: string; en: string; demo?: 'poem' | 'haiku' | 'mora' }
const INTRO: Record<'hyakunin' | 'haiku', Card[]> = {
  hyakunin: [
    { face: 'neutral', jp: '百人一首は、百人の歌人の和歌を一首ずつ集めた歌集です。', zh: '百人一首，是各收一首、共一百位歌人和歌的选集。', en: 'The Hyakunin Isshu gathers one waka each from a hundred poets.' },
    { face: 'thinking', jp: '和歌は五・七・五・七・七。前半の三句が「上の句」、後半の二句が「下の句」です。', zh: '和歌是 5-7-5-7-7。前三句叫「上の句」，后两句叫「下の句」。', en: 'A waka runs 5-7-5-7-7. The first three lines are the kami-no-ku, the last two the shimo-no-ku.', demo: 'poem' },
    { face: 'smile', jp: '私が上の句を読みます。あなたは、続きの下の句を四枚の札から選んでください。', zh: '我念上の句，你从四张札里选出接下去的下の句。', en: 'I read the first half. You pick the matching second half from four cards.' },
    { face: 'neutral', jp: '初級は意味と読みがつきます。中級は読みだけ、上級は何もなし。時間制限もあります。', zh: '初级会给意思和读音；中级只给读音；上级什么都没有，还限时。', en: 'Beginner shows meaning and reading. Intermediate shows reading only. Advanced gives nothing, and a timer.' },
    { face: 'shy', jp: '十首出します。……全部当てられたら、少しだけ、見直してあげます。', zh: '一共十首。……要是全对，我会稍微对你刮目相看。', en: 'Ten poems. ...Get them all, and I might think a little better of you.' }
  ],
  haiku: [
    { face: 'neutral', jp: '俳句は五・七・五の十七音。「音」は拍で数えます。', zh: '俳句是 5-7-5 共十七音，按“拍”来数。', en: 'A haiku is 17 sounds in 5-7-5, counted in morae.' },
    { face: 'thinking', jp: '「きゃ」「しゅ」のような小さい「ゃゅょ」は前の字と合わせて一拍。「っ」「ん」「ー」はそれぞれ一拍です。', zh: '像「きゃ」「しゅ」这样的小字「ゃゅょ」跟前一个假名合起来算一拍；「っ」「ん」「ー」各算一拍。', en: 'Small ゃゅょ join the kana before them as one beat. っ, ん and ー each count as one.', demo: 'mora' },
    { face: 'smile', jp: '画面の言葉の札を、三つの行に並べてください。札をタップすると入って、もう一度タップすると戻ります。', zh: '把画面上的词块放进三行里。点词块放进去，再点一次就取出来。', en: 'Place word chunks into the three lines. Tap a chunk to add it, tap it again to take it back.' },
    { face: 'neutral', jp: '良い句の条件は三つ。季節を表す言葉「季語」を入れること。「や」「かな」「けり」のような切れ字を使うこと。季語を二つ入れる「季重なり」は避けること。', zh: '好句有三个条件：放进表示季节的词「季語」；用「や」「かな」「けり」这样的“切れ字”；不要同时放两个不同季节的季语（季重なり）。', en: 'Three things make a good haiku: a season word (kigo), a cutting word like や, かな or けり, and no clash of two seasons.', demo: 'haiku' },
    { face: 'surprised', jp: '初級は音数が表示されます。中級からは自分で数えてください。……始めましょう。', zh: '初级会显示音数；中级开始要自己数。……开始吧。', en: 'Beginner shows the count. From intermediate, you count yourself. ...Shall we begin?' }
  ]
};

const HaikuKukaiModal: React.FC<Props> = ({ language, progress, introSeen, onSeenIntro, onFinish, onCancel }) => {
  const en = language === 'en';
  const tier: PracticeTier = progress?.tier ?? 1;

  const [mode, setMode] = useState<null | 'hyakunin' | 'haiku'>(null);
  const [introFor, setIntroFor] = useState<null | 'hyakunin' | 'haiku'>(null);
  const [introStep, setIntroStep] = useState(0);
  const [face, setFace] = useState<keyof typeof REI>('neutral');
  const [say, setSay] = useState<Say | null>({ jp: '今日は、何をしましょうか。', zh: '今天，做点什么呢？', en: 'What shall we do today?' });
  const [hasVoice, setHasVoice] = useState(false);

  useEffect(() => {
    audioManager.duckBgm();
    const check = () => setHasVoice(!!jaVoice());
    check();
    window.speechSynthesis?.addEventListener?.('voiceschanged', check);
    return () => {
      audioManager.restoreBgm();
      window.speechSynthesis?.removeEventListener?.('voiceschanged', check);
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  const startMode = (m: 'hyakunin' | 'haiku') => {
    audioManager.playSfx('confirm');
    if (!introSeen[`minigame_intro_${m}`]) { setIntroFor(m); setIntroStep(0); setFace(INTRO[m][0].face); return; }
    setMode(m);
  };

  const nextIntro = () => {
    if (!introFor) return;
    audioManager.playSfx('page');
    const cards = INTRO[introFor];
    if (introStep < cards.length - 1) { setIntroStep(introStep + 1); setFace(cards[introStep + 1].face); return; }
    onSeenIntro(`minigame_intro_${introFor}`);
    const m = introFor;
    setIntroFor(null);
    setMode(m);
  };

  // ---------------- 百人一首 ----------------
  const [qs, setQs] = useState<PoemQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const limit = tier === 1 ? 0 : tier === 2 ? 15 : 9;
  const answeredRef = useRef(false);

  useEffect(() => {
    if (mode === 'hyakunin') {
      const recent = (progress?.recent || []).filter(id => id.startsWith('poem:')).map(id => id.slice(5));
      setQs(buildPoemQuestions(10, tier, recent));
      setQi(0); setPicked(null); setRevealed(false); setCorrect(0); setStreak(0);
      setSay({ jp: 'では、始めます。', zh: '那么，开始了。', en: 'Then, we begin.' }); setFace('neutral');
    }
    if (mode === 'haiku') startHaikuRound(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const q = qs[qi];

  useEffect(() => {
    if (mode !== 'hyakunin' || !q || revealed) return;
    answeredRef.current = false;
    if (hasVoice) speak(q.poem.kami.replace(/ /g, ''));
    if (!limit) return;
    setTimeLeft(limit);
    const t = window.setInterval(() => {
      setTimeLeft(v => {
        if (v <= 1) { window.clearInterval(t); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi, mode, qs.length]);

  // 倒计时归零
  const prevLeft = useRef<number>(0);
  useEffect(() => {
    if (mode === 'hyakunin' && limit && !revealed && prevLeft.current === 1 && timeLeft === 0) answer(-1);
    prevLeft.current = timeLeft;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const answer = (idx: number) => {
    if (!q || answeredRef.current) return;
    answeredRef.current = true;
    window.speechSynthesis?.cancel?.();
    setPicked(idx); setRevealed(true);
    const ok = idx === q.answer;
    if (ok) {
      audioManager.playSfx('quiz_correct');
      setCorrect(c => c + 1); setStreak(s => s + 1);
      setFace('smile'); setSay(pickOf(P_RIGHT));
    } else {
      audioManager.playSfx('quiz_wrong');
      setStreak(0);
      setFace(idx === -1 ? 'sad' : 'thinking'); setSay(idx === -1 ? P_TIME : pickOf(P_WRONG));
    }
  };

  const nextQuestion = () => {
    audioManager.playSfx('page');
    if (qi + 1 >= qs.length) { finishHyakunin(); return; }
    setQi(qi + 1); setPicked(null); setRevealed(false); setFace('neutral'); setSay(null);
  };

  const [finished, setFinished] = useState<HaikuResult | null>(null);

  const finishHyakunin = () => {
    const words: StoryWord[] = [];
    setFinished({ mode: 'hyakunin', score: correct, total: qs.length, best: correct === qs.length, famous: false, words, seenIds: qs.map(x => `poem:${x.poem.id}`) });
  };

  // ---------------- 俳句づくり ----------------
  const puzzleOrder = useMemo(() => {
    const seen = (progress?.recent || []).filter(id => id.startsWith('haiku:')).map(id => id.slice(6));
    const fresh = PUZZLES.filter(p => !seen.includes(p.id));
    const base = (fresh.length >= 2 ? fresh : PUZZLES).slice().sort(() => Math.random() - 0.5);
    return base.slice(0, 2);
  }, [mode]);
  const [round, setRound] = useState(0);
  const [lines, setLines] = useState<string[][]>([[], [], []]);
  const [active, setActive] = useState(0);
  const [verdict, setVerdict] = useState<HaikuScore | null>(null);
  const [points, setPoints] = useState<number[]>([]);
  const [famousHit, setFamousHit] = useState(false);
  const puzzle: HaikuPuzzle | undefined = puzzleOrder[round];

  const startHaikuRound = (r: number) => {
    setRound(r); setLines([[], [], []]); setActive(0); setVerdict(null);
    setFace('neutral');
    setSay({ jp: '季節を感じて、並べてみてください。', zh: '感受季节，试着排一排。', en: 'Feel the season and arrange them.' });
  };

  const chunkOf = (id: string): Chunk | undefined => puzzle?.chunks.find(c => c.id === id);
  const used = new Set(lines.flat());
  const moraOf = (ids: string[]) => ids.reduce((n, id) => n + countMora(chunkOf(id)?.r || ''), 0);
  const TARGET = [5, 7, 5];

  const placeChunk = (id: string) => {
    if (verdict) return;
    audioManager.playSfx('click');
    setLines(ls => {
      const next = ls.map(l => l.slice());
      next[active].push(id);
      return next;
    });
  };
  const takeBack = (li: number, id: string) => {
    if (verdict) return;
    audioManager.playSfx('modal_close');
    setLines(ls => ls.map((l, i) => (i === li ? l.filter(x => x !== id) : l)));
  };

  const submitHaiku = () => {
    if (!puzzle || verdict) return;
    const built = lines.map(l => l.map(id => chunkOf(id)!).filter(Boolean));
    if (built.every(l => l.length === 0)) return;
    const s = scoreHaiku(puzzle, built);
    setVerdict(s);
    setPoints(p => [...p, s.score]);
    if (s.famous) setFamousHit(true);
    audioManager.playSfx(s.score >= 70 ? 'quiz_correct' : 'quiz_wrong');
    if (s.famous) { setFace('surprised'); setSay({ jp: '……芭蕉の句、そのままです。見事です。', zh: '……这就是芭蕉的原句。漂亮。', en: '...That is Bashō\'s verse itself. Superb.' }); }
    else if (s.score >= 90) { setFace('smile'); setSay({ jp: 'とても良い句です。……少し、感心しました。', zh: '很好的一句。……我有点佩服。', en: 'A very good verse. ...I am a little impressed.' }); }
    else if (s.score >= 60) { setFace('neutral'); setSay({ jp: '形は整っています。もう一歩、ですね。', zh: '形是齐的。再差一步。', en: 'The form holds. One step more.' }); }
    else { setFace('thinking'); setSay({ jp: '……音数を、もう一度数えてみましょう。', zh: '……再数一遍音数吧。', en: '...Let us count the beats once more.' }); }
  };

  const nextHaiku = () => {
    audioManager.playSfx('page');
    if (round + 1 >= puzzleOrder.length) {
      const total = puzzleOrder.length * 100;
      const sum = points.reduce((a, b) => a + b, 0);
      setFinished({ mode: 'haiku', score: sum, total, best: famousHit || sum >= total * 0.9, famous: famousHit, words: [], seenIds: puzzleOrder.map(x => `haiku:${x.id}`) });
      return;
    }
    startHaikuRound(round + 1);
  };

  // ---------------- 画面 ----------------
  const tierLabel = [en ? 'Beginner' : '初级', en ? 'Intermediate' : '中级', en ? 'Advanced' : '上级'][tier - 1];

  const stage = (children: React.ReactNode) => createPortal(
    <div className="fixed inset-0 z-[400] bg-black text-white select-none overflow-y-auto">
      <img src={BG} alt="" className="fixed inset-0 w-full h-full object-cover opacity-70" draggable={false} />
      <div className="fixed inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/55" />
      <div className="relative min-h-full max-w-5xl mx-auto px-4 py-5 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <p className="text-amber-300 text-[11px] font-black tracking-[0.3em]"><Emo e="🍵" /> {en ? 'POETRY CIRCLE' : '句会'} · {tierLabel}</p>
          <button onClick={() => { audioManager.playSfx('modal_close'); onCancel(); }} className="text-white/45 hover:text-white text-[11px] font-black tracking-widest">{en ? 'LEAVE' : '离开'}</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );

  const reiBox = (
    <div className="flex items-end gap-3 mb-4">
      <img src={REI[face]} alt="" className="h-40 md:h-56 object-contain drop-shadow-2xl" draggable={false} />
      {say && (
        <div className="bg-black/75 border border-amber-300/30 rounded px-4 py-3 max-w-md mb-3">
          <p className="text-amber-200 text-[10px] font-black tracking-widest mb-1">{en ? 'REI' : '铃'}</p>
          <p className="text-white text-sm md:text-base leading-relaxed">{say.jp}</p>
          <p className="text-white/50 text-xs mt-1">{en ? say.en : say.zh}</p>
        </div>
      )}
    </div>
  );

  // 说明卡
  if (introFor) {
    const card = INTRO[introFor][introStep];
    return stage(
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <img src={REI[card.face]} alt="" className="h-52 md:h-72 object-contain drop-shadow-2xl" draggable={false} />
        <div className="bg-black/80 border border-amber-300/40 rounded max-w-xl w-full px-6 py-5">
          <p className="text-amber-300 text-[10px] font-black tracking-widest mb-2">
            {introFor === 'hyakunin' ? (en ? 'HOW TO PLAY · HYAKUNIN ISSHU' : '玩法说明 · 百人一首') : (en ? 'HOW TO PLAY · HAIKU' : '玩法说明 · 俳句')} · {introStep + 1}/{INTRO[introFor].length}
          </p>
          <p className="text-white text-base md:text-lg leading-relaxed">{card.jp}</p>
          <p className="text-white/55 text-sm mt-2">{en ? card.en : card.zh}</p>
          {card.demo === 'poem' && (
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
              <div className="bg-sky-900/50 border border-sky-300/40 p-3"><div className="text-sky-200 text-[10px] font-black">上の句</div>秋の田の / かりほの庵の / 苫をあらみ</div>
              <div className="bg-rose-900/50 border border-rose-300/40 p-3"><div className="text-rose-200 text-[10px] font-black">下の句</div>わが衣手は / 露にぬれつつ</div>
            </div>
          )}
          {card.demo === 'mora' && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              {[['きょう', 2], ['がっこう', 4], ['ラーメン', 4]].map(([w, n]) => (
                <div key={String(w)} className="bg-white/10 border border-white/20 p-2"><div className="text-lg">{w}</div><div className="text-amber-300 text-xs font-black">{n} {en ? 'beats' : '拍'}</div></div>
              ))}
            </div>
          )}
          {card.demo === 'haiku' && (
            <div className="mt-4 bg-white/10 border border-white/20 p-3 text-center text-sm leading-7">
              古池<span className="text-emerald-300 font-black">や</span><span className="text-white/40 text-[10px] ml-1">(切れ字)</span><br />
              <span className="text-amber-300 font-black">蛙</span>飛びこむ<span className="text-white/40 text-[10px] ml-1">(季語·春)</span><br />
              水の音
            </div>
          )}
          <button onClick={nextIntro} className="mt-4 w-full bg-amber-400 hover:bg-amber-300 text-black font-black py-3 tracking-widest text-sm">
            {introStep < INTRO[introFor].length - 1 ? (en ? 'NEXT ▶' : '下一页 ▶') : (en ? 'START' : '开始')}
          </button>
        </div>
      </div>
    );
  }

  // 结算
  if (finished) {
    const r = finished;
    const hy = r.mode === 'hyakunin';
    const rate = r.total ? r.score / r.total : 0;
    return stage(
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <img src={REI[rate >= 0.8 ? 'smile' : rate >= 0.5 ? 'neutral' : 'thinking']} alt="" className="h-48 md:h-64 object-contain drop-shadow-2xl" draggable={false} />
        <p className="text-amber-300 text-[11px] font-black tracking-[0.3em]">{hy ? (en ? 'HYAKUNIN ISSHU' : '百人一首') : (en ? 'HAIKU' : '俳句づくり')}</p>
        <h3 className="text-4xl font-black font-ui">
          {hy ? `${r.score} / ${r.total}` : `${r.score} ${en ? 'pts' : '点'}`}
        </h3>
        <p className="text-white/80 max-w-md text-sm leading-relaxed">
          {hy
            ? (r.best ? '……全問正解。見直しました。' : rate >= 0.6 ? '悪くありません。また、やりましょう。' : '間違えた歌ほど、忘れないものです。')
            : (r.famous ? '……芭蕉と同じ句に辿り着くとは。' : rate >= 0.8 ? '詠み手の才能がありますね。' : '季語と切れ字、もう一度意識してみてください。')}
          <span className="block text-white/45 text-xs mt-1">
            {hy
              ? (r.best ? (en ? '...Perfect. I have revised my opinion of you.' : '……全部答对了。我对你刮目相看。') : rate >= 0.6 ? (en ? 'Not bad. Let us do it again.' : '不错。下次再来。') : (en ? 'The poems you miss are the ones you keep.' : '错过的歌，反而不会忘。'))
              : (r.famous ? (en ? '...You reached the very same verse as Bashō.' : '……居然拼出了和芭蕉一样的句子。') : rate >= 0.8 ? (en ? 'You have a poet\'s touch.' : '有诗人的天分呢。') : (en ? 'Think again about the season word and the cutting word.' : '再留意一下季语和切れ字。'))}
          </span>
        </p>
        <button onClick={() => { audioManager.playSfx('confirm'); onFinish(r); }} className="bg-amber-400 hover:bg-amber-300 text-black px-10 py-3 text-xs font-black tracking-widest rounded-xl">
          <span className="block">{en ? 'Done' : '收工'}</span>
        </button>
      </div>
    );
  }

  // 菜单
  if (!mode) {
    return stage(
      <div className="flex-1 flex flex-col">
        {reiBox}
        <div className="grid md:grid-cols-2 gap-4">
          {([
            ['hyakunin', '🎴', '百人一首', en ? 'Hyakunin Isshu' : '百人一首', en ? 'Hear the first half of a waka, pick the second half. Ten poems.' : '念出和歌的上の句，选出下の句。一共十首。'],
            ['haiku', '🌸', '俳句づくり', en ? 'Compose a haiku' : '俳句创作', en ? 'Arrange word chunks into a 5-7-5 with a season word. Two rounds.' : '把词块拼成 5-7-5，要有季语。一共两题。']
          ] as const).map(([k, ic, jp, title, blurb]) => (
            <button key={k} onClick={() => startMode(k)} className="group text-left bg-black/70 hover:bg-black/55 border border-amber-300/30 hover:border-amber-300 overflow-hidden transition-colors">
              <div className="aspect-[4/3] max-h-44 w-full overflow-hidden">
                <img src={`${ART}menu_${k}.webp`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" draggable={false} />
              </div>
              <div className="p-5 pt-3">
              <div className="text-3xl mb-1"><Emo e={ic} /></div>
              <div className="text-xl font-black">{jp} <span className="text-white/40 text-sm font-bold">{title}</span></div>
              <p className="text-white/60 text-sm mt-1">{blurb}</p>
              <p className="text-amber-300/80 text-[10px] font-black tracking-widest mt-3">
                {introSeen[`minigame_intro_${k}`] ? (en ? 'PLAY' : '开始') : (en ? 'FIRST TIME · REI WILL EXPLAIN' : '第一次 · 铃会先讲规则')}
              </p>
              </div>
            </button>
          ))}
        </div>
        {!hasVoice && <p className="text-white/35 text-[11px] mt-4">{en ? 'No Japanese voice found on this device — poems will be shown, not read aloud.' : '这台设备没找到日语语音——和歌只会显示，不会朗读。'}</p>}
      </div>
    );
  }

  // 百人一首
  if (mode === 'hyakunin') {
    if (!q) return stage(<div className="flex-1 flex items-center justify-center text-white/50">…</div>);
    const kamiLines = q.poem.kami.split(' ');
    return stage(
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-black tracking-widest text-white/60">
          <span>{qi + 1} / {qs.length}</span>
          <span className="text-emerald-300">✓ {correct}<EmoText text={streak >= 3 ? ` · 🔥${streak}` : ''} /></span>
          {limit > 0 && <span className={`tabular-nums ${timeLeft <= 3 && !revealed ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}><Emo e="⏱" /> {revealed ? '--' : timeLeft}</span>}
        </div>
        <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
          <div className="hidden md:block">{reiBox}</div>
          {/* 読み札：和纸的歌牌，墨色的字 */}
          <div className="p-5 md:p-6 text-center text-stone-900 shadow-[0_10px_30px_rgba(0,0,0,0.6)] rounded-sm" style={WASHI}>
            <p className="text-emerald-900 text-[10px] font-black tracking-[0.3em] mb-2">読み札 · 上の句 {q.poem.author && revealed ? `· ${q.poem.author}` : ''}</p>
            <div className="text-2xl md:text-3xl font-black leading-[2.2] font-serif">{kamiLines.map((l, i) => <div key={i}>{l}</div>)}</div>
            {tier <= 2 && <p className="text-stone-600 text-sm mt-2">{q.poem.kamiR}</p>}
            {tier === 1 && <p className="text-stone-500 text-xs mt-2">{en ? q.poem.en : q.poem.zh}</p>}
            {hasVoice && (
              <button onClick={() => speak(q.poem.kami.replace(/ /g, ''))} className="mt-3 text-[11px] font-black text-emerald-900 hover:text-black tracking-widest"><Emo e="🔊" /> {en ? 'READ AGAIN' : '再念一遍'}</button>
            )}
          </div>
        </div>
        <div className="md:hidden">{reiBox}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {q.options.map((o, i) => {
            const isAns = i === q.answer;
            const isPick = i === picked;
            // 取り札：和纸歌牌，翻开答案时用外框颜色和整张的透明度表示对错
            const cls = !revealed
              ? 'ring-0 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.7)]'
              : isAns ? 'ring-4 ring-emerald-400' : isPick ? 'ring-4 ring-rose-500 opacity-60' : 'opacity-35';
            return (
              <button key={o.id} disabled={revealed} onClick={() => answer(i)}
                      className={`text-left p-4 text-stone-900 rounded-sm shadow-[0_8px_20px_rgba(0,0,0,0.55)] transition-all ${cls}`} style={WASHI}>
                <p className="text-emerald-900 text-[10px] font-black tracking-widest mb-1">{['一', '二', '三', '四'][i]} · 取り札 · 下の句</p>
                <p className="text-lg font-black leading-relaxed font-serif">{o.shimo.split(' ').map((l, k) => <span key={k} className="block">{l}</span>)}</p>
                {tier <= 2 && <p className="text-stone-600 text-xs mt-1">{o.shimoR}</p>}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="bg-black/80 border border-amber-300/40 p-4">
            <p className="text-amber-300 text-[10px] font-black tracking-widest mb-1">{q.poem.author}</p>
            <p className="text-white text-sm leading-relaxed">{q.poem.kami.replace(/ /g, '')}　{q.poem.shimo.replace(/ /g, '')}</p>
            <p className="text-white/55 text-xs mt-1">{en ? q.poem.en : q.poem.zh}</p>
            <button onClick={nextQuestion} className="mt-3 w-full bg-amber-400 hover:bg-amber-300 text-black font-black py-2.5 tracking-widest text-sm">
              {qi + 1 >= qs.length ? (en ? 'SEE RESULT' : '看结果') : (en ? 'NEXT ▶' : '下一首 ▶')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 俳句づくり
  if (!puzzle) return stage(<div className="flex-1 flex items-center justify-center text-white/50">…</div>);
  const showCount = tier === 1;
  return stage(
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-black tracking-widest text-white/60">
        <span>{round + 1} / {puzzleOrder.length}</span>
        <span className="text-amber-300">{en ? puzzle.titleEn : puzzle.titleZh}{puzzle.season !== 'any' ? ` · ${({ spring: en ? 'spring' : '春', summer: en ? 'summer' : '夏', autumn: en ? 'autumn' : '秋', winter: en ? 'winter' : '冬' } as const)[puzzle.season]}` : ''}</span>
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="hidden md:block">{reiBox}</div>
        <div className="bg-black/70 border border-white/15 p-4">
          <p className="text-white/70 text-sm leading-relaxed">{en ? puzzle.sceneEn : puzzle.sceneZh}</p>
          <div className="mt-3 space-y-2">
            {lines.map((l, li) => {
              const m = moraOf(l);
              const ok = m === TARGET[li];
              return (
                <div key={li} onClick={() => !verdict && setActive(li)}
                     style={TANZAKU}
                     className={`flex items-center gap-2 px-3 py-2 min-h-[52px] cursor-pointer transition-all text-stone-900 rounded-sm shadow-[0_6px_16px_rgba(0,0,0,0.5)] ${active === li && !verdict ? 'ring-2 ring-amber-400' : ''}`}>
                  <span className="text-stone-500 text-xs font-black w-10 shrink-0">{li + 1}/{TARGET[li]}</span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {l.length === 0 && <span className="text-stone-400 text-xs">{en ? 'tap a chunk below' : '点下面的词块'}</span>}
                    {l.map(id => (
                      <button key={id} onClick={e => { e.stopPropagation(); takeBack(li, id); }} className="text-stone-900 font-black px-1 py-1 text-lg font-serif hover:text-rose-700">
                        {chunkOf(id)?.t}
                      </button>
                    ))}
                  </div>
                  {(showCount || verdict) && (
                    <span className={`text-xs font-black tabular-nums shrink-0 ${ok ? 'text-emerald-700' : m > TARGET[li] ? 'text-rose-600' : 'text-stone-500'}`}>{m}/{TARGET[li]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="md:hidden">{reiBox}</div>

      {!verdict && (
        <>
          <div className="flex flex-wrap gap-2">
            {puzzle.chunks.map(ch => (
              <button key={ch.id} disabled={used.has(ch.id)} onClick={() => placeChunk(ch.id)}
                      style={WASHI}
                      className={`px-3 py-2 font-black text-base font-serif text-stone-900 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all ${used.has(ch.id) ? 'opacity-25' : 'hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.6)]'}`}>
                {ch.t}
                {tier === 1 && <span className="block text-[9px] font-bold text-stone-500">{ch.r}</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { audioManager.playSfx('modal_close'); setLines([[], [], []]); }} className="px-4 py-2.5 border border-white/25 text-white/70 hover:text-white text-xs font-black tracking-widest">{en ? 'CLEAR' : '清空'}</button>
            <button onClick={submitHaiku} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-black py-2.5 tracking-widest text-sm">{en ? 'SUBMIT TO REI' : '请铃点评'}</button>
          </div>
        </>
      )}

      {verdict && (
        <div className="bg-black/80 border border-amber-300/40 p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-amber-300 text-[10px] font-black tracking-widest">{en ? 'REI\'S REVIEW' : '铃的点评'}</p>
            <p className="text-3xl font-black text-amber-300 tabular-nums">{verdict.score}<span className="text-white/40 text-sm"> /100</span></p>
          </div>
          <ul className="text-sm space-y-1">
            <li className={verdict.lineOk.every(Boolean) ? 'text-emerald-300' : 'text-white/70'}>
              {verdict.lineOk.every(Boolean) ? '✓' : '✗'} {en ? 'Beats' : '音数'}　{verdict.moras.join(' · ')}　<span className="text-white/40">(5 · 7 · 5)</span>
            </li>
            <li className={verdict.seasonMatch ? 'text-emerald-300' : 'text-white/70'}>
              {verdict.seasonMatch ? '✓' : '✗'} {en ? 'Season word' : '季語'}　{verdict.hasKigo ? (verdict.seasonMatch ? (en ? 'matches the season' : '和这一题的季节吻合') : (en ? 'wrong season' : '季节对不上')) : (en ? 'none' : '没有')}
            </li>
            <li className={verdict.cut ? 'text-emerald-300' : 'text-white/70'}>{verdict.cut ? '✓' : '✗'} {en ? 'Cutting word (や・かな・けり)' : '切れ字（や・かな・けり）'}</li>
            <li className={verdict.noOverlap && verdict.hasKigo ? 'text-emerald-300' : 'text-white/70'}>{verdict.noOverlap && verdict.hasKigo ? '✓' : '✗'} {en ? 'No season clash' : '没有季重なり'}</li>
          </ul>
          <div className="border-t border-white/15 pt-2">
            <p className="text-white/45 text-[10px] font-black tracking-widest mb-1">{en ? 'REI\'S VERSION' : '铃的参考句'}</p>
            <p className="text-white text-base">{puzzle.sample.map(l => l.map(id => chunkOf(id)?.t).join('')).join('　')}</p>
            {puzzle.famous && <p className="text-white/50 text-xs mt-1">{FAMOUS_SETS.map(s => s.zh).join(' / ')}　—— {puzzle.famous.author}</p>}
          </div>
          <button onClick={nextHaiku} className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black py-2.5 tracking-widest text-sm">
            {round + 1 >= puzzleOrder.length ? (en ? 'SEE RESULT' : '看结果') : (en ? 'NEXT PUZZLE ▶' : '下一题 ▶')}
          </button>
        </div>
      )}
    </div>
  );
};

export default HaikuKukaiModal;
