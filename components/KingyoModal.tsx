import React, { useEffect, useRef, useState } from 'react';
import { Language, PracticeProgress, PracticeTier, StoryWord } from '../types';
import { TIER_RULES } from '../data/drillData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🐟 夜店捞金鱼
//
// 【怎么玩】
// 按住＝纸网（ポイ）下水；拖着走；松手＝抬起来。
// 抬起的那一下，网里有鱼就捞上来了。
//
// 【为什么它跟钓鱼不是一回事】
// 钓鱼考的是"在对的时机按"。这个考的是"忍"：
//   · 网一直泡在水里，纸会越来越软——泡得越久、拖得越快，湿得越快
//   · 鱼越稀有越重，捞它要消耗的纸也越多
//   · 纸破了就结束，一张网三百日元
// 所以真正的手法跟现实一样：别一直泡着，等鱼游到网上方，快速抄一下就起。
//
// 【三档】鱼越游越快，上级的鱼会躲网；纸也越来越薄。
// 一条都没捞到，老板也会塞你一条——关西夜店的规矩。
// ---------------------------------------------------------

export interface KingyoResult {
  caught: number;
  rare: number;         // 捞到了几条琉金
  consolation: boolean; // 一条没捞到，老板送的
  words: StoryWord[];
}

interface Props {
  language: Language;
  progress?: PracticeProgress;
  onFinish: (r: KingyoResult) => void;
  onCancel: () => void;
}

const W = 900, H = 520;
const POI_R = 46;

type Kind = 'koaka' | 'demekin' | 'ryukin';
const KINDS: Record<Kind, { zh: string; en: string; jp: string; weight: number; size: number; body: string; fin: string; speed: number }> = {
  koaka:   { jp: '小赤', zh: '小红金鱼', en: 'little red', weight: 16, size: 1.0, body: '#f25c2a', fin: '#ff9a6b', speed: 1.0 },
  demekin: { jp: '出目金', zh: '黑出目金', en: 'black demekin', weight: 24, size: 1.15, body: '#262229', fin: '#4a4450', speed: 0.8 },
  ryukin:  { jp: '琉金', zh: '琉金', en: 'ryukin', weight: 36, size: 1.35, body: '#f7f1ea', fin: '#e8442e', speed: 0.65 }
};

interface Fish { id: number; kind: Kind; x: number; y: number; vx: number; vy: number; wob: number }

const TIER_CFG: Record<PracticeTier, { speed: number; flee: number; drain: number; move: number }> = {
  1: { speed: 55, flee: 0, drain: 7, move: 0.035 },
  2: { speed: 78, flee: 60, drain: 10, move: 0.05 },
  3: { speed: 100, flee: 130, drain: 13, move: 0.065 }
};

const spawn = (id: number, kind: Kind): Fish => {
  const a = Math.random() * Math.PI * 2;
  return { id, kind, x: 80 + Math.random() * (W - 160), y: 70 + Math.random() * (H - 140), vx: Math.cos(a), vy: Math.sin(a), wob: Math.random() * 10 };
};
const initialFish = (): Fish[] => {
  const kinds: Kind[] = [...Array(9).fill('koaka'), ...Array(3).fill('demekin'), 'ryukin'];
  return kinds.map((k, i) => spawn(i, k));
};

const KingyoModal: React.FC<Props> = ({ language, progress, onFinish, onCancel }) => {
  const en = language === 'en';
  const tier: PracticeTier = progress?.tier ?? 1;
  const cfg = TIER_CFG[tier];

  const fish = useRef<Fish[]>(initialFish());
  const poi = useRef({ x: W / 2, y: H / 2, down: false, lastX: W / 2, lastY: H / 2 });
  const paper = useRef(100);
  const [, setFrame] = useState(0);
  const [caught, setCaught] = useState<Kind[]>([]);
  const [torn, setTorn] = useState(false);
  const [msg, setMsg] = useState<{ jp: string; zh: string; en: string } | null>({ jp: 'はい、ポイ一本三百円！がんばりや！', zh: '来，纸网一张三百日元！加油啊！', en: 'One poi, three hundred yen! Give it a go!' });
  const [ended, setEnded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const splash = useRef<{ x: number; y: number; t: number }[]>([]);

  // 主循环
  useEffect(() => {
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = poi.current;
      for (const f of fish.current) {
        const k = KINDS[f.kind];
        // 随便游：方向慢慢转
        f.wob += dt;
        const turn = (Math.sin(f.wob * 1.3 + f.id) * 0.9) * dt;
        const c = Math.cos(turn), s = Math.sin(turn);
        [f.vx, f.vy] = [f.vx * c - f.vy * s, f.vx * s + f.vy * c];
        // 上级的鱼会躲下水的网
        if (cfg.flee && p.down) {
          const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy);
          if (d < POI_R + 70 && d > 0.1) { f.vx += (dx / d) * cfg.flee * dt / 40; f.vy += (dy / d) * cfg.flee * dt / 40; }
        }
        const n = Math.hypot(f.vx, f.vy) || 1;
        f.vx /= n; f.vy /= n;
        const sp = cfg.speed * k.speed;
        f.x += f.vx * sp * dt;
        f.y += f.vy * sp * dt;
        // 碰到盆边就掉头
        if (f.x < 40 || f.x > W - 40) { f.vx *= -1; f.x = Math.max(40, Math.min(W - 40, f.x)); }
        if (f.y < 40 || f.y > H - 40) { f.vy *= -1; f.y = Math.max(40, Math.min(H - 40, f.y)); }
      }
      // 纸在水里会泡软：待着就掉，拖得快掉得更多
      if (p.down && !torn) {
        const moved = Math.hypot(p.x - p.lastX, p.y - p.lastY);
        paper.current -= cfg.drain * dt + moved * cfg.move;
        if (paper.current <= 0) {
          paper.current = 0;
          p.down = false;
          setTorn(true);
          audioManager.playSfx('relation_down');
          setMsg({ jp: 'あー、破れてもうたな！', zh: '啊——，破了呢！', en: 'Ahh, it’s torn!' });
        }
      }
      p.lastX = p.x; p.lastY = p.y;
      splash.current = splash.current.filter(sp => now - sp.t < 600);
      setFrame(fr => (fr + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [torn]);

  const toLocal = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const onDown = (e: React.PointerEvent) => {
    if (torn || ended) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const q = toLocal(e);
    Object.assign(poi.current, { ...q, lastX: q.x, lastY: q.y, down: true });
    splash.current.push({ ...q, t: performance.now() });
    audioManager.playSfx('page');
  };
  const onMove = (e: React.PointerEvent) => {
    const q = toLocal(e);
    poi.current.x = q.x; poi.current.y = q.y;
  };
  const onUp = () => {
    const p = poi.current;
    if (!p.down || torn) { p.down = false; return; }
    p.down = false;
    // 抬起来的一瞬间，网中心附近有没有鱼
    const inNet = fish.current
      .map(f => ({ f, d: Math.hypot(f.x - p.x, f.y - p.y) }))
      .filter(o => o.d < POI_R * 0.72)
      .sort((a, b) => a.d - b.d)[0];
    if (!inNet) return;
    const k = KINDS[inNet.f.kind];
    if (paper.current > k.weight) {
      paper.current -= k.weight;
      audioManager.playSfx(inNet.f.kind === 'ryukin' ? 'unlock' : 'collect');
      setCaught(c => [...c, inNet.f.kind]);
      setMsg(inNet.f.kind === 'ryukin'
        ? { jp: 'うわっ、琉金や！やるなあ！', zh: '哇，是琉金！厉害啊！', en: 'Whoa, a ryukin! Nice one!' }
        : inNet.f.kind === 'demekin'
          ? { jp: 'お、出目金！ええやん！', zh: '哦，出目金！不错嘛！', en: 'Oh, a demekin! Nice!' }
          : { jp: 'はい、一匹！', zh: '好，一条！', en: 'That’s one!' });
      // 捞走一条，补一条小赤游进来——盆里不会越捞越空
      fish.current = fish.current.filter(f => f.id !== inNet.f.id).concat(spawn(Date.now(), 'koaka'));
    } else {
      // 纸不够结实：鱼的重量把网捅破了
      paper.current = 0;
      setTorn(true);
      audioManager.playSfx('relation_down');
      setMsg({ jp: `あちゃー、${k.jp}は重たいからなあ。`, zh: `哎呀，${k.jp}可重着呢。`, en: `Ah, a ${k.en} is a heavy one.` });
    }
  };

  const finish = () => {
    const rare = caught.filter(k => k === 'ryukin').length;
    const consolation = caught.length === 0;
    const words: StoryWord[] = [
      { jp: '金魚すくい', reading: 'きんぎょすくい', zh: '捞金鱼', en: 'goldfish scooping' },
      { jp: 'ポイ', zh: '（捞金鱼用的）纸网', en: 'paper scoop' }
    ];
    if (caught.includes('demekin')) words.push({ jp: '出目金', reading: 'でめきん', zh: '出目金（凸眼金鱼）', en: 'demekin (pop-eyed goldfish)' });
    if (rare) words.push({ jp: '琉金', reading: 'りゅうきん', zh: '琉金', en: 'ryukin goldfish' });
    onFinish({ caught: consolation ? 1 : caught.length, rare, consolation, words });
  };

  const stop = () => {
    audioManager.playSfx('confirm');
    setEnded(true);
    setMsg(caught.length === 0
      ? { jp: '残念！ほな、一匹おまけや。持って帰り！', zh: '可惜！那送你一条，拿回去吧！', en: 'Unlucky! Here, have one on the house!' }
      : { jp: 'まいど！袋に入れとくわな。', zh: '多谢惠顾！给你装袋里啦。', en: 'Cheers! I’ll bag them up for you.' });
  };

  // 纸破了：停一下让玩家看见破掉的网，再结算。一条没捞到的，老板照样塞一条。
  useEffect(() => {
    if (!torn) return;
    const t = setTimeout(() => {
      setEnded(true);
      if (caught.length === 0) {
        setMsg({ jp: '残念！ほな、一匹おまけや。持って帰り！', zh: '可惜！那送你一条，拿回去吧！', en: 'Unlucky! Here, have one on the house!' });
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [torn]);

  const p = poi.current;
  const paperPct = Math.max(0, paper.current);

  return (
    <div className="fixed inset-0 z-[160] flex flex-col bg-black select-none">
      <img src="/images/backgrounds/bg_ikuta_shrine_summer_night.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />

      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-xs font-black tracking-widest">{en ? 'GOLDFISH SCOOPING' : '捞金鱼'}</span>
          <span className="text-[10px] px-2 py-0.5 border border-white/25 text-white/70">{en ? TIER_RULES[tier].labelEn : TIER_RULES[tier].labelZh}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">🪣 {caught.length}</span>
          {!ended && <button onClick={stop} className="text-white/60 hover:text-white text-[10px] font-black tracking-widest border border-white/25 px-2 py-1">{en ? 'That’s enough' : '够了，不捞了'}</button>}
          <button onClick={onCancel} className="text-white/35 hover:text-white/70 text-[10px] font-black tracking-widest">{en ? 'LEAVE' : '走了'}</button>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row items-center justify-center gap-4 p-3 md:p-4">
        <div className="flex lg:flex-col items-center gap-3 lg:w-56 shrink-0">
          <img src="/images/characters/npc_kingyo_oyaji.webp" alt="" className="h-28 lg:h-72 object-contain" />
          {msg && (
            <div className="max-w-xs">
              <p className="text-yellow-300/90 text-[11px] font-black">{en ? 'Stall owner' : '摊主大叔'}</p>
              <p className="text-white text-sm font-bold">「{msg.jp}」</p>
              <p className="text-white/45 text-xs">{en ? msg.en : msg.zh}</p>
            </div>
          )}
        </div>

        <div className="relative w-full max-w-4xl">
          {/* 纸还剩多少 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/60 text-xs shrink-0">{en ? 'Paper' : '纸网'}</span>
            <div className="flex-1 h-2 bg-white/10 overflow-hidden">
              <div className={`h-full transition-[width] duration-100 ${paperPct < 30 ? 'bg-rose-400' : paperPct < 60 ? 'bg-amber-300' : 'bg-white'}`} style={{ width: `${paperPct}%` }} />
            </div>
            <span className="text-white/40 text-[10px] w-40 text-right">
              {en ? 'Hold = in the water · release = scoop' : '按住＝下水 · 松手＝抄起'}
            </span>
          </div>

          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
            className={`w-full h-auto rounded-md touch-none ${torn || ended ? 'cursor-default' : 'cursor-none'}`}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
            <defs>
              <radialGradient id="water" cx="50%" cy="45%" r="75%">
                <stop offset="0%" stopColor="#bfe6f7" />
                <stop offset="70%" stopColor="#7fc3e6" />
                <stop offset="100%" stopColor="#4f9cc9" />
              </radialGradient>
              <pattern id="caustic" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M0 60 Q30 40 60 60 T120 60 M60 0 Q40 30 60 60 T60 120" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="3" fill="none">
                  <animateTransform attributeName="transform" type="translate" values="0 0; 12 8; 0 0" dur="6s" repeatCount="indefinite" />
                </path>
              </pattern>
            </defs>
            {/* 蓝色的盆 */}
            <rect x={0} y={0} width={W} height={H} rx={26} fill="#3f8fc0" />
            <rect x={14} y={14} width={W - 28} height={H - 28} rx={18} fill="url(#water)" />
            <rect x={14} y={14} width={W - 28} height={H - 28} rx={18} fill="url(#caustic)" />
            {/* 水花 */}
            {splash.current.map((s, i) => {
              const age = (performance.now() - s.t) / 600;
              return <circle key={i} cx={s.x} cy={s.y} r={POI_R + age * 30} fill="none" stroke="#fff" strokeOpacity={0.5 * (1 - age)} strokeWidth={2} />;
            })}
            {/* 金鱼 */}
            {fish.current.map(f => {
              const k = KINDS[f.kind];
              const ang = (Math.atan2(f.vy, f.vx) * 180) / Math.PI;
              const tail = Math.sin(f.wob * 10) * 12;
              return (
                <g key={f.id} transform={`translate(${f.x} ${f.y}) rotate(${ang}) scale(${k.size})`}>
                  <ellipse cx={1} cy={2} rx={17} ry={9} fill="#000" opacity={0.12} />
                  <path d={`M-12,0 L-30,${-11 + tail / 3} Q-24,0 -30,${11 + tail / 3} Z`} fill={k.fin} opacity={0.9} />
                  <ellipse cx={0} cy={0} rx={16} ry={8.5} fill={k.body} />
                  {f.kind === 'ryukin' && <ellipse cx={4} cy={-1} rx={7} ry={5} fill="#e8442e" opacity={0.85} />}
                  <path d="M-2,-7 Q2,-13 7,-7 Z" fill={k.fin} />
                  <circle cx={10} cy={f.kind === 'demekin' ? -5.5 : -3} r={f.kind === 'demekin' ? 3.6 : 1.8} fill={f.kind === 'demekin' ? '#111' : '#111'} stroke={f.kind === 'demekin' ? '#555' : 'none'} />
                  <circle cx={10} cy={f.kind === 'demekin' ? 5.5 : 3} r={f.kind === 'demekin' ? 3.6 : 1.8} fill="#111" stroke={f.kind === 'demekin' ? '#555' : 'none'} />
                </g>
              );
            })}
            {/* 纸网 */}
            {!ended && (
              <g transform={`translate(${p.x} ${p.y})`} style={{ pointerEvents: 'none' }}>
                <circle r={POI_R} fill={torn ? 'none' : '#ffffff'} fillOpacity={p.down ? 0.28 + (paperPct / 100) * 0.2 : 0.62} stroke="#e8e0d0" strokeWidth={6} />
                {torn && <path d={`M${-POI_R * 0.6},-10 L-6,6 L8,-8 L${POI_R * 0.6},12`} stroke="#fff" strokeWidth={3} fill="none" />}
                <rect x={POI_R - 2} y={-5} width={60} height={10} rx={4} fill="#d64545" transform="rotate(35)" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {ended && (
        <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">{caught.length ? '🐟' : '🎐'}</div>
            <h3 className="text-white text-2xl font-black italic">
              {caught.length
                ? (en ? `${caught.length} goldfish` : `捞到 ${caught.length} 条`)
                : (en ? 'Not a single one' : '一条都没捞到')}
            </h3>
            {caught.length > 0 && (
              <p className="text-white/60 text-sm">
                {(['koaka', 'demekin', 'ryukin'] as Kind[]).filter(k => caught.includes(k))
                  .map(k => `${KINDS[k].jp} ×${caught.filter(c => c === k).length}`).join('　')}
              </p>
            )}
            {msg && <p className="text-white/80 text-sm">「{msg.jp}」<span className="block text-white/40 text-xs">{en ? msg.en : msg.zh}</span></p>}
            <button onClick={() => { audioManager.playSfx('confirm'); finish(); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12">
              <span className="block transform skew-x-12">{en ? 'Carry them home' : '拎回家'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KingyoModal;
