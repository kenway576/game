import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CollectedWord, Language, PracticeProgress, PracticeTier, StoryWord } from '../types';
import { buildDeck, KarutaCard } from '../data/karutaDeck';
import { TIER_RULES, settlePractice } from '../data/drillData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🎴 歌留多：跟明日香抢牌
//
// 桌上摆八张牌。念一张，谁先拍到算谁的；拍错了叫"お手つき"，这一张直接归对方。
// 一共念十张。
//
// 【三档念法】
//   初级  念意思 → 找日语牌（牌上有注音）
//   中级  念读音 → 找汉字牌（没注音了）
//   上级  念一句挖空的例句 → 找填进去的那张
// 中级和上级会用浏览器的日语语音真的"念"出来——
// 歌留多本来就是听的游戏，只看字就少了一半。
//
// 明日香的手速跟档位走：初级她让着你，上级她不让。
// ---------------------------------------------------------

export interface KarutaResult {
  mine: number;
  hers: number;
  total: number;
  words: StoryWord[];
}

interface Props {
  language: Language;
  wordbook: CollectedWord[];
  progress?: PracticeProgress;
  onFinish: (r: KarutaResult) => void;
  onCancel: () => void;
}

const BOARD = 8;
const READS = 10;
const TYPE_MS = 55;
// 明日香从开始念到出手要多久（毫秒，区间内随机）
const HER_SPEED: Record<PracticeTier, [number, number]> = { 1: [5800, 7800], 2: [4200, 5800], 3: [3000, 4400] };

const ASUKA = {
  neutral: '/images/characters/asuka/neutral.webp',
  smug: '/images/characters/asuka/smug.webp',
  angry: '/images/characters/asuka/angry.webp',
  surprised: '/images/characters/asuka/surprised.webp',
  shy: '/images/characters/asuka/shy.webp'
};

type Say = { jp: string; zh: string; en: string };
const HER_TAKE: Say[] = [
  { jp: 'はい。', zh: '拿到。', en: 'Mine.' },
  { jp: '遅いわよ。', zh: '太慢了。', en: 'Too slow.' },
  { jp: 'ぼーっとしてたら、全部取るわよ。', zh: '发呆的话，我就全拿走了。', en: 'Keep daydreaming and I’ll take the lot.' }
];
const YOU_TAKE: Say[] = [
  { jp: '……っ。今のはまぐれよ。', zh: '……唔。刚才那是运气。', en: '...Tch. That was luck.' },
  { jp: 'へえ、やるじゃない。', zh: '哦？有两下子嘛。', en: 'Huh. Not bad.' },
  { jp: '……ちょっと、手が速いんだけど。', zh: '……喂，你手也太快了吧。', en: '...Hey, your hands are fast.' }
];
const FOUL: Say[] = [
  { jp: 'お手つき。ルールも知らないの？', zh: '拍错了。连规则都不知道吗？', en: 'Otetsuki. Don’t you know the rules?' },
  { jp: '焦りすぎよ。', zh: '太急了。', en: 'You’re rushing.' }
];
const pickSay = (a: Say[]) => a[Math.floor(Math.random() * a.length)];

// 找一个日语语音。没有就不念，只显示字。
const jaVoice = (): SpeechSynthesisVoice | null => {
  try {
    const vs = window.speechSynthesis?.getVoices?.() || [];
    return vs.find(v => v.lang === 'ja-JP') || vs.find(v => v.lang.startsWith('ja')) || null;
  } catch { return null; }
};

const KarutaModal: React.FC<Props> = ({ language, wordbook, progress, onFinish, onCancel }) => {
  const en = language === 'en';
  const tier: PracticeTier = progress?.tier ?? 1;

  const deck = useMemo(() => buildDeck(wordbook, BOARD + READS + 2), []);
  const [board, setBoard] = useState<KarutaCard[]>(() => deck.slice(0, BOARD));
  const reserve = useRef<KarutaCard[]>(deck.slice(BOARD));

  const [readNo, setReadNo] = useState(0);
  const [target, setTarget] = useState<KarutaCard | null>(null);
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<'intro' | 'reading' | 'taken' | 'done'>('intro');
  const [takenBy, setTakenBy] = useState<'me' | 'her' | 'foul' | null>(null);
  const [wrongCard, setWrongCard] = useState<string | null>(null);
  const [mine, setMine] = useState(0);
  const [hers, setHers] = useState(0);
  const [say, setSay] = useState<Say | null>(null);
  const [face, setFace] = useState(ASUKA.neutral);
  const [voiceOn, setVoiceOn] = useState(true);
  const [hasVoice, setHasVoice] = useState(false);
  const won = useRef<StoryWord[]>([]);
  const herTimer = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setHasVoice(!!jaVoice());
    check();
    window.speechSynthesis?.addEventListener?.('voiceschanged', check);
    return () => {
      window.speechSynthesis?.removeEventListener?.('voiceschanged', check);
      window.speechSynthesis?.cancel?.();
      if (herTimer.current) clearTimeout(herTimer.current);
    };
  }, []);

  // 这一档念什么
  const clueOf = (c: KarutaCard): { text: string; speak?: string } => {
    if (tier === 1 || (tier === 2 && !c.reading) || (tier === 3 && !c.ex && !c.reading)) {
      return { text: en ? c.en : c.zh };
    }
    if (tier === 2 || !c.ex) return { text: c.reading!, speak: c.reading };
    return { text: c.ex, speak: c.ex.replace('＿＿', c.reading || c.jp) };
  };

  const startRead = () => {
    if (readNo >= READS || board.length === 0) { setPhase('done'); return; }
    const t = board[Math.floor(Math.random() * board.length)];
    setTarget(t);
    setTyped('');
    setTakenBy(null);
    setWrongCard(null);
    setSay(null);
    setFace(ASUKA.neutral);
    phaseRef.current = 'reading';
    setPhase('reading');
    const clue = clueOf(t);
    // 念出来
    if (voiceOn && clue.speak && hasVoice) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(clue.speak);
        const v = jaVoice(); if (v) u.voice = v;
        u.lang = 'ja-JP'; u.rate = tier === 3 ? 1.0 : 0.9;
        window.speechSynthesis.speak(u);
      } catch { /* 念不了就算了，字还在 */ }
    }
    // 明日香出手
    const [lo, hi] = HER_SPEED[tier];
    if (herTimer.current) clearTimeout(herTimer.current);
    herTimer.current = window.setTimeout(() => take('her', t), lo + Math.random() * (hi - lo));
  };

  // 念的字一个一个出来
  useEffect(() => {
    if (phase !== 'reading' || !target) return;
    const full = clueOf(target).text;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, TYPE_MS);
    return () => clearInterval(t);
  }, [phase, target]);

  // 用 ref 守门：明日香的计时器和玩家的手可能在同一瞬间都想"拿到"这张牌，
  // 只能有一个算数。别把这段逻辑塞进 setPhase 的 updater——StrictMode 会跑两遍。
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const take = (who: 'me' | 'her' | 'foul', card: KarutaCard) => {
    if (phaseRef.current !== 'reading') return;
    phaseRef.current = 'taken';
    if (herTimer.current) clearTimeout(herTimer.current);
    setTakenBy(who);
    if (who === 'me') {
      audioManager.playSfx('collect');
      setMine(m => m + 1);
      setSay(pickSay(YOU_TAKE));
      setFace(Math.random() < 0.5 ? ASUKA.surprised : ASUKA.shy);
      won.current.push({ jp: card.jp, reading: card.reading, zh: card.zh, en: card.en });
    } else {
      audioManager.playSfx(who === 'foul' ? 'error' : 'click');
      setHers(h => h + 1);
      setSay(pickSay(who === 'foul' ? FOUL : HER_TAKE));
      setFace(who === 'foul' ? ASUKA.angry : ASUKA.smug);
    }
    // 这张牌离场，从备用里补一张
    const add = reserve.current.shift();
    setBoard(b => {
      const rest = b.filter(x => x.jp !== card.jp);
      return add ? [...rest, add] : rest;
    });
    setReadNo(n => n + 1);
    setPhase('taken');
  };

  const slap = (c: KarutaCard) => {
    if (phase !== 'reading' || !target) return;
    if (c.jp === target.jp) { take('me', target); return; }
    // お手つき：这一张直接归对方
    setWrongCard(c.jp);
    take('foul', target);
  };

  const outcome = useMemo(
    () => (phase === 'done' ? settlePractice(progress, mine, READS, []) : null),
    [phase]
  );

  // ================== 结算 ==================
  if (phase === 'done') {
    const iWon = mine > hers;
    return (
      <div className="fixed inset-0 z-[160] bg-[#0b0b10] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5">
          <img src={iWon ? ASUKA.shy : ASUKA.smug} alt="" className="h-48 mx-auto object-contain" />
          <h3 className="text-white text-2xl font-black italic">
            {iWon ? (en ? 'You win' : '你赢了') : mine === hers ? (en ? 'A draw' : '平手') : (en ? 'Asuka wins' : '明日香赢了')}
            <span className="ml-3 text-yellow-300">{mine} : {hers}</span>
          </h3>
          <p className="text-white/70 text-sm">
            「{iWon ? '……今日は、あなたの勝ちってことにしといてあげる。' : 'ふん。出直してきなさい。'}」
            <span className="block text-white/40 text-xs mt-1">
              {iWon ? (en ? '...Fine. We’ll call today yours.' : '……今天就算你赢吧。') : (en ? 'Hmph. Come back when you’re ready.' : '哼。练好了再来。')}
            </span>
          </p>
          {outcome?.promoted && (
            <p className="text-emerald-300 text-sm font-black">
              {en ? `Next time: ${TIER_RULES[outcome.progress.tier].labelEn}` : `下次开始：${TIER_RULES[outcome.progress.tier].labelZh}`}
            </p>
          )}
          <button
            onClick={() => { audioManager.playSfx('confirm'); onFinish({ mine, hers, total: READS, words: won.current }); }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12"
          >
            <span className="block transform skew-x-12">{en ? 'Done' : '收牌'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[160] flex flex-col bg-black">
      <img src="/images/backgrounds/bg_school_sahoushitsu.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />

      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-xs font-black tracking-widest">{en ? 'KARUTA' : '歌留多'}</span>
          <span className="text-[10px] px-2 py-0.5 border border-white/25 text-white/70">
            {en ? TIER_RULES[tier].labelEn : TIER_RULES[tier].labelZh}
            {' · '}
            {tier === 1 ? (en ? 'meaning is read' : '念意思') : tier === 2 ? (en ? 'reading is read' : '念读音') : (en ? 'a sentence is read' : '念例句')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm font-black">
            {en ? 'You' : '你'} <span className="text-yellow-300">{mine}</span>
            <span className="text-white/30 mx-2">:</span>
            <span className="text-rose-300">{hers}</span> {en ? 'Asuka' : '明日香'}
          </span>
          <span className="text-white/40 text-[10px] font-black">{Math.min(readNo + (phase === 'reading' ? 1 : 0), READS)} / {READS}</span>
          {hasVoice && tier > 1 && (
            <button onClick={() => setVoiceOn(v => !v)} className="text-white/50 hover:text-white text-sm" title={en ? 'Voice' : '朗读'}>
              {voiceOn ? '🔊' : '🔇'}
            </button>
          )}
          <button onClick={onCancel} className="text-white/35 hover:text-white/70 text-[10px] font-black tracking-widest">
            {en ? 'LEAVE' : '不玩了'}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto flex flex-col items-center px-4 py-4 gap-4">
        {/* 明日香和"念牌" */}
        <div className="flex items-end gap-4 w-full max-w-4xl">
          <img src={face} alt="" className="h-36 md:h-52 object-contain shrink-0" />
          <div className="flex-1 min-w-0 pb-2">
            {phase === 'intro' ? (
              <div className="space-y-3">
                <p className="text-white/85 text-sm leading-relaxed">
                  {en
                    ? 'Asuka reads nothing — the club recording does. Hear a card, slap it before she does. Slap the wrong one and it goes to her.'
                    : '念牌的是社团的录音。听到哪张，赶在她前面拍下去。拍错了，那张直接归她。'}
                </p>
                <p className="text-white/50 text-xs">
                  「{'……手加減はしないわよ。'}」 {en ? '...I’m not going easy on you.' : '……我可不会放水。'}
                </p>
                <button onClick={() => { audioManager.playSfx('confirm'); startRead(); }}
                  className="bg-yellow-400 hover:bg-white text-black px-8 py-2.5 text-xs font-black tracking-widest transform -skew-x-12">
                  <span className="block transform skew-x-12">{en ? 'Begin ▶' : '开始 ▶'}</span>
                </button>
              </div>
            ) : (
              <div className="bg-black/60 border-l-4 border-yellow-400 px-4 py-3 min-h-[76px]">
                <p className="text-[10px] text-yellow-400/80 font-black tracking-widest mb-1">{en ? 'READ' : '念'}</p>
                <p className="text-white text-xl md:text-2xl font-bold leading-snug">{typed}<span className="animate-pulse text-white/40">{phase === 'reading' ? '▍' : ''}</span></p>
                {phase === 'taken' && target && (
                  <p className="text-white/55 text-xs mt-2">
                    {target.jp}{target.reading ? `（${target.reading}）` : ''} — {en ? target.en : target.zh}
                  </p>
                )}
              </div>
            )}
            {say && (
              <p className={`mt-2 text-sm ${takenBy === 'me' ? 'text-emerald-300' : 'text-rose-200'}`}>
                <b className="mr-2">{en ? 'Asuka' : '明日香'}</b>「{say.jp}」<span className="text-white/40 ml-1">{en ? say.en : say.zh}</span>
              </p>
            )}
          </div>
        </div>

        {/* 牌桌 */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 w-full max-w-4xl">
          {board.map(c => {
            const isTarget = phase === 'taken' && target?.jp === c.jp;
            const isWrong = wrongCard === c.jp;
            return (
              <button key={c.jp} onClick={() => slap(c)} disabled={phase !== 'reading'}
                className={`relative aspect-[3/4] max-h-40 bg-[#f7f1e1] border-[3px] rounded-sm flex flex-col items-center justify-center px-1 transition-all shadow-[0_6px_16px_rgba(0,0,0,0.45)] ${
                  isTarget ? (takenBy === 'me' ? 'border-emerald-500 scale-95 opacity-60' : 'border-rose-500 scale-95 opacity-60')
                    : isWrong ? 'border-rose-500 animate-[shake_0.4s]'
                    : phase === 'reading' ? 'border-[#2f6b3a] hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(0,0,0,0.55)] active:translate-y-0'
                    : 'border-[#2f6b3a]'}`}>
                <span className="text-[#2a2118] text-lg md:text-2xl font-black leading-tight text-center break-all">{c.jp}</span>
                {tier === 1 && c.reading && <span className="text-[#6b5a45] text-[10px] md:text-xs mt-1">{c.reading}</span>}
                {c.mine && <span className="absolute top-1 right-1.5 text-[9px] text-[#b4552d]" title={en ? 'From your wordbook' : '来自你的单词本'}>📒</span>}
              </button>
            );
          })}
        </div>

        {phase === 'taken' && (
          <button onClick={() => { audioManager.playSfx('page'); startRead(); }}
            className="bg-yellow-400 hover:bg-white text-black px-8 py-2.5 text-xs font-black tracking-widest transform -skew-x-12">
            <span className="block transform skew-x-12">
              {readNo >= READS ? (en ? 'See result ▶' : '看结果 ▶') : (en ? 'Next card ▶' : '下一张 ▶')}
            </span>
          </button>
        )}
      </div>
      <style>{`@keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }`}</style>
    </div>
  );
};

export default KarutaModal;
