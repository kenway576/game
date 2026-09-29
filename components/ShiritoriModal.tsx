import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language, PracticeProgress, PracticeTier } from '../types';
import { SHIRITORI_WORDS, ShiritoriWord, tailOf, headOf, endsInN, lookalikesOf } from '../data/shiritoriWords';
import { TIER_RULES } from '../data/drillData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🔤 跟光玩接龙
//
// 【为什么不让玩家打字】
// 不是每个玩家都会用日语输入法。所以每轮给四张词卡，挑一张接上。
// 难点不在"想出一个词"，而在"读出这张卡的第一个假名"——
//   初级  卡上带注音
//   中级  汉字不带注音了：「鍵」和「傘」哪个是か开头？（都是。但「影」不在这里）
//   上级  时限更短，还会混进刚才已经说过的词；光开始玩「る攻め」
// 四张卡里总会埋着：浊音不对的（か／が）、以「ん」结尾的（说了就输）。
//
// 【输赢】
// 说了「ん」结尾的词直接输；接错、说重复的、超时各扣一条命，两条命。
// 光接不上来就是你赢；撑满十二轮算平手。
// ---------------------------------------------------------

export interface ShiritoriResult {
  turns: number;        // 你成功接了几轮
  maxTurns: number;
  outcome: 'win' | 'draw' | 'lose';
}

interface Props {
  language: Language;
  progress?: PracticeProgress;
  onFinish: (r: ShiritoriResult) => void;
  onCancel: () => void;
}

const MAX_TURNS = 12;
const LIVES = 2;
const TURN_MS: Record<PracticeTier, number> = { 1: 16000, 2: 12000, 3: 8500 };
const TICK = 50;

const HIKARI = {
  neutral: '/images/characters/hikari/neutral.webp',
  happy: '/images/characters/hikari/happy.webp',
  smug: '/images/characters/hikari/smug.webp',
  surprised: '/images/characters/hikari/surprised.webp',
  sad: '/images/characters/hikari/sad.webp'
};

type Entry = { who: 'me' | 'her'; word: ShiritoriWord };
type Say = { jp: string; zh: string; en: string };

const shuffle = <T,>(a: T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const START: ShiritoriWord = { r: 'しりとり', w: 'しりとり', zh: '接龙', en: 'shiritori' };

const ShiritoriModal: React.FC<Props> = ({ language, progress, onFinish, onCancel }) => {
  const en = language === 'en';
  const tier: PracticeTier = progress?.tier ?? 1;

  const [chain, setChain] = useState<Entry[]>([{ who: 'her', word: START }]);
  const used = useMemo(() => new Set(chain.map(e => e.word.r)), [chain]);
  const need = tailOf(chain[chain.length - 1].word.r);
  const [lives, setLives] = useState(LIVES);
  const [turns, setTurns] = useState(0);
  const [phase, setPhase] = useState<'mine' | 'hers' | 'done'>('mine');
  const [outcome, setOutcome] = useState<ShiritoriResult['outcome'] | null>(null);
  const [say, setSay] = useState<Say>({ jp: 'ほな、いくで！「しりとり」の「り」！', zh: '那开始咯！「しりとり」的「り」！', en: 'Here we go! "Shiritori" — so, "ri"!' });
  const [face, setFace] = useState(HIKARI.happy);
  const [left, setLeft] = useState(TURN_MS[tier]);
  const [flash, setFlash] = useState<string | null>(null);
  // 第几轮出牌。扣命重来、光接完轮到你，都算新的一轮——发牌和计时都跟着它重置
  const [round, setRound] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }); }, [chain]);

  // 还没用过、能合法接上 k 的词
  const validFor = (k: string, usedSet: Set<string>) =>
    SHIRITORI_WORDS.filter(w => headOf(w.r) === k && !usedSet.has(w.r) && !endsInN(w.r));

  // 这一轮给玩家的四张卡
  const cards = useMemo(() => {
    if (phase !== 'mine') return [];
    const valid = shuffle(validFor(need, used));
    const out: ShiritoriWord[] = valid.slice(0, tier === 1 ? 2 : 1);
    // 以「ん」结尾的陷阱
    const nTrap = shuffle(SHIRITORI_WORDS.filter(w => headOf(w.r) === need && endsInN(w.r) && !used.has(w.r)))[0];
    if (nTrap) out.push(nTrap);
    // 上级：混一个已经说过的
    if (tier === 3) {
      const rep = chain.map(e => e.word).find(w => headOf(w.r) === need && w.r !== START.r);
      if (rep) out.push(rep);
    }
    // 浊音清音看走眼的
    const alikes = lookalikesOf(need);
    const fakes = shuffle(SHIRITORI_WORDS.filter(w => alikes.includes(headOf(w.r)) && !used.has(w.r) && !endsInN(w.r)));
    for (const f of fakes) { if (out.length >= 4) break; if (!out.includes(f)) out.push(f); }
    // 还不够就随便找几个开头不对的
    const others = shuffle(SHIRITORI_WORDS.filter(w => headOf(w.r) !== need && !used.has(w.r)));
    for (const o of others) { if (out.length >= 4) break; if (!out.includes(o)) out.push(o); }
    return shuffle(out.slice(0, 4));
  }, [phase, need, round]);

  // 计时
  useEffect(() => {
    if (phase !== 'mine') return;
    setLeft(TURN_MS[tier]);
    const t = setInterval(() => setLeft(v => Math.max(0, v - TICK)), TICK);
    return () => clearInterval(t);
  }, [phase, round]);
  useEffect(() => {
    if (phase === 'mine' && left <= 0) miss({ jp: 'はい、時間切れ〜。', zh: '好，时间到～', en: 'Aaand time’s up.' });
  }, [left]);

  const end = (o: ShiritoriResult['outcome']) => {
    setOutcome(o);
    setPhase('done');
  };

  const miss = (s: Say) => {
    audioManager.playSfx('error');
    setSay(s);
    setFace(HIKARI.smug);
    const l = lives - 1;
    setLives(l);
    if (l <= 0) { end('lose'); return; }
    // 扣了命但还能继续：这一轮重来（换一组卡、重新计时）
    setRound(r => r + 1);
  };

  const pick = (w: ShiritoriWord) => {
    if (phase !== 'mine') return;
    setFlash(w.r);
    setTimeout(() => setFlash(null), 400);
    if (headOf(w.r) !== need) {
      miss({ jp: `それ「${need}」から始まってへんで？`, zh: `那个不是「${need}」开头的吧？`, en: `That doesn’t start with "${need}"!` });
      return;
    }
    if (used.has(w.r)) {
      miss({ jp: 'それ、さっき出たやん。', zh: '那个刚才说过了啦。', en: 'That one’s been said already.' });
      return;
    }
    const nextChain = [...chain, { who: 'me' as const, word: w }];
    setChain(nextChain);
    if (endsInN(w.r)) {
      audioManager.playSfx('quiz_wrong');
      setSay({ jp: 'あーっ！「ん」ついた！うちの勝ちー！', zh: '啊——！以「ん」结尾了！我赢啦——！', en: 'Aaah! It ends in "n"! I win!' });
      setFace(HIKARI.happy);
      end('lose');
      return;
    }
    audioManager.playSfx('collect');
    const t = turns + 1;
    setTurns(t);
    if (t >= MAX_TURNS) {
      setSay({ jp: 'もう十二回やん！ほな、引き分けな。', zh: '都十二轮了！那就算平手吧。', en: 'That’s twelve already! Call it a draw.' });
      setFace(HIKARI.happy);
      end('draw');
      return;
    }
    setPhase('hers');
    setSay({ jp: 'おっ、やるやん。えーっと……', zh: '哦，不错嘛。嗯……', en: 'Ooh, nice. Um...' });
    setFace(HIKARI.surprised);
    // 光想一下
    setTimeout(() => herMove(nextChain), 900 + Math.random() * 900);
  };

  const herMove = (c: Entry[]) => {
    const usedNow = new Set(c.map(e => e.word.r));
    const k = tailOf(c[c.length - 1].word.r);
    let options = validFor(k, usedNow);
    if (!options.length) {
      audioManager.playSfx('levelup_affection');
      setSay({ jp: `「${k}」……？……あかん、思いつかへん！負けた〜！`, zh: `「${k}」……？……不行，想不出来！我输啦～！`, en: `"${k}"...? ...Nope, I’ve got nothing! I lose!` });
      setFace(HIKARI.sad);
      end('win');
      return;
    }
    // 她不会故意把你逼进死胡同（那是词库的问题，不是你的问题）：
    // 只挑那些接完之后你还有路可走的词。
    const fair = options.filter(w => validFor(tailOf(w.r), new Set([...usedNow, w.r])).length > 0);
    if (fair.length) options = fair;
    // 上级：「る攻め」——专挑以る结尾的词，る开头的词本来就少
    if (tier === 3) {
      const ru = options.filter(w => tailOf(w.r) === 'る');
      if (ru.length) options = ru;
    }
    const w = options[Math.floor(Math.random() * options.length)];
    setChain([...c, { who: 'her', word: w }]);
    setSay({ jp: `「${w.w}」！次、「${tailOf(w.r)}」やで。`, zh: `「${w.w}」！下一个，「${tailOf(w.r)}」哦。`, en: `"${w.w}"! Next up: "${tailOf(w.r)}".` });
    setFace(tier === 3 && tailOf(w.r) === 'る' ? HIKARI.smug : HIKARI.happy);
    setRound(r => r + 1);
    setPhase('mine');
  };

  // ================== 结算 ==================
  if (phase === 'done' && outcome) {
    return (
      <div className="fixed inset-0 z-[160] bg-[#0b0b10] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5">
          <img src={face} alt="" className="h-48 mx-auto object-contain" />
          <h3 className="text-white text-2xl font-black italic">
            {outcome === 'win' ? (en ? 'You win!' : '你赢了！') : outcome === 'draw' ? (en ? 'A draw' : '平手') : (en ? 'Hikari wins' : '光赢了')}
          </h3>
          <p className="text-white/70 text-sm">「{say.jp}」<span className="block text-white/40 text-xs mt-1">{en ? say.en : say.zh}</span></p>
          <p className="text-white/55 text-xs">{en ? `You kept the chain going ${turns} time(s).` : `你一共接了 ${turns} 次。`}</p>
          <button
            onClick={() => { audioManager.playSfx('confirm'); onFinish({ turns: outcome === 'win' ? MAX_TURNS : turns, maxTurns: MAX_TURNS, outcome }); }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12"
          >
            <span className="block transform skew-x-12">{en ? 'Done' : '不玩了'}</span>
          </button>
        </div>
      </div>
    );
  }

  const pct = Math.max(0, Math.min(100, (left / TURN_MS[tier]) * 100));

  return (
    <div className="fixed inset-0 z-[160] flex flex-col bg-black">
      <img src="/images/backgrounds/bg_kaisei_cafeteria_hall.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />

      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-xs font-black tracking-widest">{en ? 'SHIRITORI' : '接龙'}</span>
          <span className="text-[10px] px-2 py-0.5 border border-white/25 text-white/70">
            {en ? TIER_RULES[tier].labelEn : TIER_RULES[tier].labelZh}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">{'❤️'.repeat(lives)}<span className="opacity-25">{'🖤'.repeat(LIVES - lives)}</span></span>
          <span className="text-white/40 text-[10px] font-black">{turns} / {MAX_TURNS}</span>
          <button onClick={onCancel} className="text-white/35 hover:text-white/70 text-[10px] font-black tracking-widest">{en ? 'LEAVE' : '不玩了'}</button>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center px-4 py-3 gap-3 max-w-3xl w-full mx-auto">
        <div className="flex items-end gap-3 w-full">
          <img src={face} alt="" className="h-28 md:h-40 object-contain shrink-0" />
          <div className="pb-2 min-w-0">
            <p className="text-yellow-300/90 text-xs font-black">{en ? 'Hikari' : '光'}</p>
            <p className="text-white text-base md:text-lg font-bold">「{say.jp}」</p>
            <p className="text-white/45 text-xs">{en ? say.en : say.zh}</p>
          </div>
        </div>

        {/* 接龙的链 */}
        <div ref={logRef} className="w-full flex flex-wrap items-center gap-1.5 max-h-28 overflow-y-auto py-2 px-3 bg-black/40 border border-white/10">
          {chain.map((e, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-white/25 text-xs">→</span>}
              <span className={`text-sm px-2 py-0.5 ${e.who === 'me' ? 'bg-yellow-400/15 text-yellow-100' : 'bg-white/8 text-white/75'}`}
                title={`${e.word.r} · ${en ? e.word.en : e.word.zh}`}>
                {e.word.w}
              </span>
            </React.Fragment>
          ))}
        </div>

        {phase === 'mine' ? (
          <>
            <div className="w-full flex items-center gap-3">
              <span className="text-white/60 text-sm shrink-0">{en ? 'Starts with' : '要以'}</span>
              <span className="text-4xl font-black text-yellow-300 leading-none">{need}</span>
              <span className="text-white/60 text-sm shrink-0">{en ? '' : '开头'}</span>
              <div className="flex-1 h-1 bg-white/10 overflow-hidden">
                <div className={`h-full transition-[width] duration-75 ${pct < 25 ? 'bg-rose-400' : 'bg-yellow-400'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              {cards.map(w => (
                <button key={w.r} onClick={() => pick(w)}
                  className={`py-4 px-3 border-2 text-center transition-all ${
                    flash === w.r ? 'border-yellow-300 bg-yellow-400/20' : 'border-white/15 bg-white/[0.05] hover:border-yellow-400/60 hover:bg-white/[0.1]'}`}>
                  <span className="block text-white text-2xl md:text-3xl font-black">{w.w}</span>
                  {/* 注音只在初级给；片假名词本来就读得出来，汉字才是考点 */}
                  {tier === 1 && w.w !== w.r && <span className="block text-white/50 text-xs mt-1">{w.r}</span>}
                </button>
              ))}
            </div>
            <p className="text-white/35 text-[11px] text-center">
              {en ? 'Words ending in ん lose on the spot. Voiced and unvoiced kana (か / が) are different letters.' : '以「ん」结尾的词说了就输。浊音和清音（か／が）算不同的假名。'}
            </p>
          </>
        ) : (
          <p className="text-white/50 text-sm py-6 animate-pulse">{en ? 'Hikari is thinking...' : '光在想……'}</p>
        )}
      </div>
    </div>
  );
};

export default ShiritoriModal;
