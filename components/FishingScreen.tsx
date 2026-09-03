import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, LifeState, GameCalendar, FishDef } from '../types';
import {
  rollFish, rollSize, findFish, findRod, FISH, BAIT_ITEM,
  MAX_FISH_PER_DAY, dayIndex, fishValue
} from '../data/lifeData';
import { SCENE_MAP, SCENE_FALLBACK } from '../constants';
import { audioManager } from '../services/audioManager';
import ItemIcon from './ItemIcon';

// ---------------------------------------------------------
// 🎣 钓鱼
//
// 四个阶段：抛竿 → 等 → 咬钩的那一下 → 收线拉锯 → 结算。
//
// 【收线为什么做成"把标记按在区间里"】
// 二游那套钓鱼小游戏基本都是这个结构，好用是有原因的：
//   · 一根手指就能玩，手机上不用两只手
//   · 难度可以只靠"区间多宽、鱼跑多快"两个数调，不用改玩法
//   · 失败是渐进的（进度条掉一点），不是一击毙命，所以不挫败
// 稀有度越高，安全区越窄、鱼窜得越凶。
//
// 每天有次数上限，钓完了就得等第二天——这是休闲系统，不该能通宵刷钱。
// ---------------------------------------------------------

type Phase = 'idle' | 'waiting' | 'bite' | 'reeling' | 'caught' | 'lost';

interface Props {
  spot: string;
  spotNameZh: string;
  spotNameEn: string;
  language: Language;
  life: LifeState;
  calendar: GameCalendar;
  onClose: () => void;
  onCatch: (fish: FishDef, cm: number) => void;
  onSpendBait: () => void;
  onOpenDex: () => void;
}

const FishingScreen: React.FC<Props> = ({
  spot, spotNameZh, spotNameEn, language, life, calendar, onClose, onCatch, onSpendBait, onOpenDex
}) => {
  const en = language === 'en';
  const rod = findRod(life.rodId);
  const bait = life.items[BAIT_ITEM] || 0;
  const today = dayIndex(calendar);
  const usedToday = life.fishedOn === today ? life.fishedToday : 0;
  const left = MAX_FISH_PER_DAY - usedToday;

  const [phase, setPhase] = useState<Phase>('idle');
  const [hooked, setHooked] = useState<{ fish: FishDef; cm: number } | null>(null);

  // 收线阶段的状态。用 ref 跑动画，state 只负责渲染。
  const [bar, setBar] = useState(0);        // 0..1 收线进度
  const [markerY, setMarkerY] = useState(0.5);
  const [fishY, setFishY] = useState(0.5);
  const holdRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const stateRef = useRef({ bar: 0, markerY: 0.5, markerV: 0, fishY: 0.5, fishV: 0, t: 0 });

  const clearTimers = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    rafRef.current = null; timerRef.current = null;
  };
  useEffect(() => clearTimers, []);

  const bg = SCENE_MAP[spot] || SCENE_FALLBACK[spot] || SCENE_MAP['kobe_harbor'];

  // ---------- 抛竿 ----------
  const cast = () => {
    if (!rod || left <= 0) return;
    audioManager.playSfx('click');
    setPhase('waiting');
    setHooked(null);
    const wait = 1200 + Math.random() * 3200;
    timerRef.current = window.setTimeout(() => {
      const f = rollFish(spot, calendar, rod.power, bait > 0);
      const cm = rollSize(f, rod.power);
      setHooked({ fish: f, cm });
      setPhase('bite');
      audioManager.playSfx('confirm');
      // 咬钩之后有个窗口，没反应就跑了。稀有鱼给的时间更短。
      // 一开始定在 1.5 秒，实测太紧——这是休闲系统，反应窗口不该是它的难度来源，
      // 难度应该全部落在后面的收线上。
      timerRef.current = window.setTimeout(
        () => setPhase(p => (p === 'bite' ? 'lost' : p)),
        2600 - f.rarity * 150
      );
    }, wait);
  };

  // ---------- 中鱼，进入收线 ----------
  const strike = () => {
    if (phase !== 'bite' || !hooked) return;
    clearTimers();
    audioManager.playSfx('click');
    if (bait > 0) onSpendBait();
    // 杂物不用拉锯，直接上来
    if (hooked.fish.junk) { setPhase('caught'); onCatch(hooked.fish, hooked.cm); return; }
    stateRef.current = { bar: 0.28, markerY: 0.5, markerV: 0, fishY: 0.5, fishV: 0, t: 0 };
    setBar(0.28); setMarkerY(0.5); setFishY(0.5);
    setPhase('reeling');
  };

  // ---------- 收线循环 ----------
  // 下面这几个数是离线跑模拟调出来的，不是拍脑袋。
  // 第一版稀有度只影响带宽，结果任何鱼在"完美操作"下都是 100% 通过——
  // 稀有度等于没有难度。现在鱼本身会随稀有度抖得更凶、并且会突然猛窜。
  // 完美操作下的通过率（★1→★5，便宜竿 / 最贵的竿）：
  //   100/100 · 99/100 · 94/99 · 69/90 · 29/61
  // 也就是：常见鱼稳拿，极品鱼得靠那根一万九的竿。
  const zoneH = hooked ? Math.max(0.14, 0.33 - hooked.fish.rarity * 0.030) : 0.24;
  const power = rod?.power || 1;

  const step = useCallback((now: number) => {
    const s = stateRef.current;
    const dt = s.t ? Math.min(0.05, (now - s.t) / 1000) : 0.016;
    s.t = now;
    const f = hooked?.fish;
    if (!f) return;

    // 鱼：持续抖动 + 偶发猛窜。猛窜才是难度的来源——
    // 只有持续抖动的话，玩家跟着走就行了，跟不跟得上只取决于手速。
    const jitter = 1.5 + f.rarity * 1.35;
    s.fishV += (Math.random() - 0.5) * jitter * dt;
    if (Math.random() < (0.5 + f.rarity * 0.5) * dt) {
      s.fishV += (Math.random() < 0.5 ? -1 : 1) * (0.28 + f.rarity * 0.085);
    }
    s.fishV *= 0.975;
    s.fishY += s.fishV * dt;
    if (s.fishY < 0.04) { s.fishY = 0.04; s.fishV = Math.abs(s.fishV) * 0.5; }
    if (s.fishY > 0.96) { s.fishY = 0.96; s.fishV = -Math.abs(s.fishV) * 0.5; }

    // 标记：按住往上，松开往下。好竿更跟手。
    s.markerV += (holdRef.current ? -2.05 : 1.65) * (0.8 + 0.22 * power) * dt;
    s.markerV *= 0.90;
    s.markerY += s.markerV * dt;
    if (s.markerY < 0) { s.markerY = 0; s.markerV = 0; }
    if (s.markerY > 1) { s.markerY = 1; s.markerV = 0; }

    // 鱼在安全区里 → 收线；不在 → 掉，但掉得比涨得慢
    const inZone = Math.abs(s.fishY - s.markerY) < zoneH / 2;
    s.bar += (inZone ? 0.30 : -0.225) * dt;
    s.bar = Math.max(0, Math.min(1, s.bar));

    setBar(s.bar); setMarkerY(s.markerY); setFishY(s.fishY);

    if (s.bar >= 1) {
      clearTimers();
      audioManager.playSfx('confirm');
      setPhase('caught');
      if (hooked) onCatch(hooked.fish, hooked.cm);
      return;
    }
    if (s.bar <= 0 && now > 0) {
      clearTimers();
      setPhase('lost');
      return;
    }
    rafRef.current = requestAnimationFrame(step);
  }, [hooked, zoneH, power, onCatch]);

  useEffect(() => {
    if (phase !== 'reeling') return;
    stateRef.current.t = 0;
    rafRef.current = requestAnimationFrame(step);
    return clearTimers;
  }, [phase, step]);

  const reset = () => { clearTimers(); setPhase('idle'); setHooked(null); holdRef.current = false; };

  // 空格 / 点击都能用
  const down = () => { if (phase === 'bite') strike(); else holdRef.current = true; };
  const up = () => { holdRef.current = false; };
  useEffect(() => {
    const kd = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); down(); } };
    const ku = (e: KeyboardEvent) => { if (e.code === 'Space') up(); };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  });

  const dexCount = Object.keys(life.fishDex).length;
  const dexTotal = FISH.filter(f => !f.junk).length;

  return (
    <div className="fixed inset-0 z-[125] bg-black select-none flex flex-col overflow-hidden">
      <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/40" />

      {/* 顶栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
        <div>
          <div className="text-sm md:text-lg font-black text-cyan-300 tracking-wide">
            {en ? spotNameEn : spotNameZh}
          </div>
          <div className="text-[10px] font-mono text-white/40">
            {rod ? `${rod.emoji} ${en ? rod.nameEn : rod.nameZh}` : (en ? 'no rod' : '没有鱼竿')}
            <span className="ml-3">🐛 {bait}</span>
            <span className="ml-3">{en ? `${left} casts left today` : `今天还能钓 ${left} 次`}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { audioManager.playSfx('click'); onOpenDex(); }}
            className="bg-black/70 hover:bg-cyan-400 hover:text-black text-white/80 border border-white/25 px-3 py-1.5 text-[11px] font-black tracking-widest transform -skew-x-12 transition-all">
            <span className="block transform skew-x-12">📖 {dexCount}/{dexTotal}</span>
          </button>
          <button onClick={() => { clearTimers(); audioManager.playSfx('click'); onClose(); }}
            className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all">
            <span className="block transform skew-x-12">{en ? '◀ Back' : '◀ 返回'}</span>
          </button>
        </div>
      </div>

      {/* 主区 */}
      <div
        className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-6"
        onPointerDown={down} onPointerUp={up} onPointerLeave={up}
      >
        {!rod && (
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">🎣</div>
            <p className="text-white/70 text-sm leading-relaxed">
              {en
                ? 'You have no rod. Minato Tackle, down by the harbour, sells them.'
                : '你没有鱼竿。港边的「みなと釣具」有卖。'}
            </p>
          </div>
        )}

        {rod && left <= 0 && phase === 'idle' && (
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">🌙</div>
            <p className="text-white/70 text-sm leading-relaxed">
              {en ? 'That is enough for today. The fish have stopped biting.' : '今天就到这儿吧。鱼不咬了。'}
            </p>
          </div>
        )}

        {rod && left > 0 && phase === 'idle' && (
          <div className="text-center">
            <div className="text-7xl mb-5">🎣</div>
            <button onClick={cast}
              className="px-10 py-3 bg-cyan-400 text-black text-sm font-black uppercase tracking-widest transform -skew-x-12 hover:bg-white transition-all">
              <span className="block transform skew-x-12">{en ? 'Cast' : '抛竿'}</span>
            </button>
            <p className="mt-4 text-[11px] text-white/40">
              {bait > 0
                ? (en ? 'Baited. Anything could take it.' : '挂了饵。什么都可能上。')
                : (en ? 'No bait — expect rubbish.' : '没挂饵——多半是垃圾。')}
            </p>
          </div>
        )}

        {phase === 'waiting' && (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">〰️</div>
            <p className="text-white/50 text-sm">{en ? 'Waiting...' : '等着……'}</p>
          </div>
        )}

        {phase === 'bite' && (
          <button onClick={strike} className="text-center focus:outline-none">
            <div className="text-8xl mb-2 animate-bounce">❗</div>
            <p className="text-yellow-400 font-black text-xl tracking-widest">
              {en ? 'NOW!' : '就是现在！'}
            </p>
            <p className="mt-2 text-[11px] text-white/50">{en ? 'tap / space' : '点一下 / 空格'}</p>
          </button>
        )}

        {phase === 'reeling' && hooked && (
          <div className="flex items-center gap-8">
            {/* 竖轨：安全区跟着标记走，鱼在里面乱窜 */}
            <div className="relative w-16 h-[46dvh] md:h-[52dvh] bg-black/60 border border-white/20 overflow-hidden">
              <div
                className="absolute left-0 right-0 bg-cyan-400/25 border-y border-cyan-300/70 transition-none"
                style={{ height: `${zoneH * 100}%`, top: `${(markerY - zoneH / 2) * 100}%` }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 text-3xl leading-none transition-none"
                style={{ top: `calc(${fishY * 100}% - 0.6em)` }}
              >
                {hooked.fish.emoji}
              </div>
            </div>
            {/* 收线进度 */}
            <div className="w-6 h-[46dvh] md:h-[52dvh] bg-black/60 border border-white/20 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-emerald-300"
                   style={{ height: `${bar * 100}%` }} />
            </div>
            <div className="max-w-[10rem]">
              <p className="text-white font-black text-lg">{en ? 'Hold!' : '按住！'}</p>
              <p className="mt-2 text-[11px] text-white/55 leading-relaxed">
                {en
                  ? 'Hold to raise the band, release to let it fall. Keep the fish inside it.'
                  : '按住让蓝带上升，松开让它落下。把鱼一直圈在带子里。'}
              </p>
            </div>
          </div>
        )}

        {(phase === 'caught' || phase === 'lost') && (
          <div className="text-center max-w-md">
            {phase === 'caught' && hooked ? (
              <>
                <ItemIcon id={hooked.fish.id} emoji={hooked.fish.emoji} size={128} className="mb-3 mx-auto" />
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  {en ? hooked.fish.nameEn : hooked.fish.nameZh}
                </h2>
                <div className="mt-1 text-base font-mono text-cyan-300/90">
                  {hooked.fish.nameJp}<span className="ml-2 text-[11px] text-white/40">{hooked.fish.reading}</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                  <span className="text-white/80 tabular-nums">{hooked.cm} cm</span>
                  {!hooked.fish.junk && (
                    <span className="text-yellow-400 font-black tabular-nums">
                      ¥{fishValue(hooked.fish, hooked.cm).toLocaleString('ja-JP')}
                    </span>
                  )}
                  {!hooked.fish.junk && (
                    <span className="text-white/40">{'★'.repeat(hooked.fish.rarity)}</span>
                  )}
                </div>
                <p className="mt-4 text-sm text-white/60 leading-relaxed">
                  {en ? hooked.fish.noteEn : hooked.fish.noteZh}
                </p>
                {hooked.fish.word && (
                  <div className="mt-4 inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5">
                    <span className="text-emerald-300 font-bold text-sm">{hooked.fish.word.jp}</span>
                    <span className="text-[10px] text-white/40 font-mono">{hooked.fish.word.reading}</span>
                    <span className="text-[11px] text-white/60">{en ? hooked.fish.word.en : hooked.fish.word.zh}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-7xl mb-3">💨</div>
                <h2 className="text-xl font-black text-white/70">{en ? 'It got away.' : '跑了。'}</h2>
                <p className="mt-3 text-sm text-white/45">
                  {en ? 'The line goes slack. Somewhere out there it is telling the others.' : '线一下子松了。它大概正在跟同伴讲这件事。'}
                </p>
              </>
            )}
            <div className="mt-7 flex justify-center gap-3">
              <button onClick={reset} disabled={left <= 0}
                className={`px-8 py-2.5 text-sm font-black uppercase tracking-widest transform -skew-x-12 transition-all ${
                  left > 0 ? 'bg-cyan-400 text-black hover:bg-white' : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}>
                <span className="block transform skew-x-12">
                  {left > 0 ? (en ? 'Again' : '再来') : (en ? 'Done for today' : '今天钓完了')}
                </span>
              </button>
              <button onClick={() => { clearTimers(); onClose(); }}
                className="px-6 py-2.5 border border-white/25 text-white/70 text-xs font-black uppercase tracking-widest transform -skew-x-12 hover:bg-white/10 transition-all">
                <span className="block transform skew-x-12">{en ? 'Pack up' : '收竿'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FishingScreen;
