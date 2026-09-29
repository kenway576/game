import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language, PracticeProgress, PracticeTier } from '../types';
import {
  LANDMARKS, landmark, MAP_W, MAP_H, STREETS_H, STREETS_V, MICHI_SCENARIOS, MichiScenario,
  Leg, walk, sentenceOf, Node, Dir
} from '../data/michiMap';
import { TIER_RULES } from '../data/drillData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🗺️ 在三宫站前给游客指路
//
// 游客问"〇〇在哪儿"。你一段一段拼出指路的日语：
//   まっすぐ行って、二つ目の角を右に曲がって、一つ目の角に大丸があります。
// 说完，游客照着你的话走——走到了就算成功，走丢了你会看着他走丢。
//
// 【它跟别的小游戏不一样的地方】
// 其他的都是"认"：在几个选项里挑对的。这个是"说"：
// 句子是你自己拼出来的。左右还得站在游客的朝向上想——
// 面朝海的时候，右手边是西边。
//
//   初级  地图上实时画出你这句话会把人带到哪儿，句子下面有中文
//   中级  换了出口、换了朝向，没有中文了
//   上级  不再实时画路线——说出口之前，你得自己在脑子里走一遍
// ---------------------------------------------------------

export interface MichiResult {
  score: number;     // 一次就指对算 1，第二次才对算 0.5
  total: number;
}

interface Props {
  language: Language;
  progress?: PracticeProgress;
  onFinish: (r: MichiResult) => void;
  onCancel: () => void;
}

const PER_SESSION = 4;
const TOURISTS = [
  { sprite: '/images/characters/npc_tourist_backpacker.webp', zh: '背着大包的游客', en: 'A backpacker' },
  { sprite: '/images/characters/npc_tourist_taiwan.webp', zh: '拖着行李箱的游客', en: 'A tourist with a suitcase' },
  { sprite: '/images/characters/npc_bus_obaa.webp', zh: '从外地来的老奶奶', en: 'An old lady from out of town' }
];

// 地图坐标
const CELL = 96, PAD = 56;
const px = (n: Node) => ({ x: PAD + n.x * CELL, y: PAD + n.y * CELL });
const ARROW: Record<Dir, number> = { N: 0, E: 90, S: 180, W: 270 };
const DIR_ZH: Record<Dir, string> = { N: '山側（北）', E: '东', S: '海側（南）', W: '西' };
const DIR_EN: Record<Dir, string> = { N: 'mountain side (N)', E: 'east', S: 'sea side (S)', W: 'west' };

const shuffle = <T,>(a: T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const MichiModal: React.FC<Props> = ({ language, progress, onFinish, onCancel }) => {
  const en = language === 'en';
  const tier: PracticeTier = progress?.tier ?? 1;
  const showPreview = tier < 3;
  const showGloss = tier === 1;

  // 这一轮的四个游客：本档为主，没到三档的话最后一个来自下一档
  const scenarios = useMemo<MichiScenario[]>(() => {
    const cur = shuffle(MICHI_SCENARIOS.filter(s => s.tier === tier));
    const next = shuffle(MICHI_SCENARIOS.filter(s => s.tier === Math.min(3, tier + 1) && s.tier !== tier));
    return [...cur.slice(0, next.length ? PER_SESSION - 1 : PER_SESSION), ...next.slice(0, 1)].slice(0, PER_SESSION);
  }, []);
  const [qi, setQi] = useState(0);
  const sc = scenarios[qi];
  const start = landmark(sc.start).at;
  const dest = landmark(sc.dest);
  const tourist = TOURISTS[qi % TOURISTS.length];

  const [legs, setLegs] = useState<Leg[]>([{ n: 1, turn: 'end' }]);
  const [tries, setTries] = useState(0);
  const [walking, setWalking] = useState<Node[] | null>(null);
  const [step, setStep] = useState(0);
  const [verdict, setVerdict] = useState<'ok' | 'lost' | null>(null);
  const score = useRef(0);
  const [done, setDone] = useState(false);

  const preview = useMemo(() => walk(start, sc.facing, legs), [legs, qi]);
  const sentence = sentenceOf(legs, dest.jp);

  const setLeg = (i: number, patch: Partial<Leg>) => {
    audioManager.playSfx('click');
    setLegs(ls => {
      const next = ls.map((l, j) => (j === i ? { ...l, ...patch } : l));
      // "到了"只能是最后一段；中间某段改成"到了"就把后面的都去掉
      const endAt = next.findIndex(l => l.turn === 'end');
      return endAt >= 0 ? next.slice(0, endAt + 1) : next;
    });
  };
  const addLeg = () => {
    audioManager.playSfx('click');
    setLegs(ls => {
      if (ls.length >= 3) return ls;
      const cp = ls.map(l => (l.turn === 'end' ? { ...l, turn: 'R' as const } : l));
      return [...cp, { n: 1, turn: 'end' }];
    });
  };
  const removeLeg = () => {
    audioManager.playSfx('click');
    setLegs(ls => {
      if (ls.length <= 1) return ls;
      const cp = ls.slice(0, -1);
      cp[cp.length - 1] = { ...cp[cp.length - 1], turn: 'end' };
      return cp;
    });
  };

  // 说出口：游客开始走
  const tell = () => {
    if (walking || legs[legs.length - 1].turn !== 'end') return;
    audioManager.playSfx('confirm');
    const r = walk(start, sc.facing, legs);
    setWalking(r.path);
    setStep(0);
    setVerdict(null);
  };

  useEffect(() => {
    if (!walking) return;
    if (step < walking.length - 1) {
      const t = setTimeout(() => { audioManager.playSfx('page'); setStep(s => s + 1); }, 420);
      return () => clearTimeout(t);
    }
    const r = walk(start, sc.facing, legs);
    const ok = !r.offMap && r.end.x === dest.at.x && r.end.y === dest.at.y;
    const t = setTimeout(() => {
      setVerdict(ok ? 'ok' : 'lost');
      audioManager.playSfx(ok ? 'quiz_correct' : 'quiz_wrong');
      if (ok) score.current += tries === 0 ? 1 : 0.5;
    }, 300);
    return () => clearTimeout(t);
  }, [walking, step]);

  // 每位游客两次机会（初级三次）
  const maxTries = tier === 1 ? 3 : 2;
  const afterVerdict = () => {
    if (verdict === 'lost' && tries + 1 < maxTries) {
      setTries(t => t + 1);
      setWalking(null); setVerdict(null);
      return;
    }
    if (qi + 1 >= scenarios.length) { setDone(true); return; }
    setQi(q => q + 1);
    setLegs([{ n: 1, turn: 'end' }]);
    setTries(0); setWalking(null); setVerdict(null);
  };

  if (done) {
    const s = score.current;
    return (
      <div className="fixed inset-0 z-[160] bg-[#0b0b10] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="text-5xl">🗺️</div>
          <h3 className="text-white text-2xl font-black italic">
            {s >= scenarios.length ? (en ? 'Every one of them got there' : '每个人都找到了') : s >= scenarios.length / 2 ? (en ? 'Most of them got there' : '大部分人找到了') : (en ? 'A few wanderers' : '有几个人还在转圈')}
          </h3>
          <p className="text-white/65 text-sm">{en ? `Directions given: ${s} / ${scenarios.length}` : `指路成功：${s} / ${scenarios.length}`}</p>
          <p className="text-white/40 text-xs leading-relaxed">
            {en ? 'Kobe people often say 山側 (mountain side) and 海側 (sea side) instead of north and south. The mountains are always north here.'
                : '神户人指路常说「山側」（靠山那边）和「海側」（靠海那边），不说北和南——在这座城市，山永远在北边。'}
          </p>
          <button onClick={() => { audioManager.playSfx('confirm'); onFinish({ score: s, total: scenarios.length }); }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12">
            <span className="block transform skew-x-12">{en ? 'Done' : '回去了'}</span>
          </button>
        </div>
      </div>
    );
  }

  const W = PAD * 2 + (MAP_W - 1) * CELL;
  const H = PAD * 2 + (MAP_H - 1) * CELL;
  const walkerAt = walking ? walking[Math.min(step, walking.length - 1)] : start;
  const shownPath = walking ? walking.slice(0, step + 1) : (showPreview ? preview.path : [start]);
  const complete = legs[legs.length - 1].turn === 'end';

  return (
    <div className="fixed inset-0 z-[160] flex flex-col bg-black">
      <img src="/images/backgrounds/bg_sannomiya_ticket_gates.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-xs font-black tracking-widest">{en ? 'GIVING DIRECTIONS' : '指路'}</span>
          <span className="text-[10px] px-2 py-0.5 border border-white/25 text-white/70">{en ? TIER_RULES[sc.tier].labelEn : TIER_RULES[sc.tier].labelZh}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-[10px] font-black">{qi + 1} / {scenarios.length}</span>
          <button onClick={onCancel} className="text-white/35 hover:text-white/70 text-[10px] font-black tracking-widest">{en ? 'LEAVE' : '不帮了'}</button>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto grid lg:grid-cols-[1fr_1.1fr] gap-4 p-4 max-w-6xl w-full mx-auto">
        {/* 地图 */}
        <div className="bg-[#eef0e6] rounded-sm p-2 self-start">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* 山和海 */}
            <rect x={0} y={0} width={W} height={PAD * 0.55} fill="#cfe2c3" />
            <text x={W - 8} y={16} textAnchor="end" fontSize={12} fill="#4d6b3c" fontWeight={700}>⛰ 山側</text>
            <rect x={0} y={H - PAD * 0.55} width={W} height={PAD * 0.55} fill="#bcd9ee" />
            <text x={W - 8} y={H - 6} textAnchor="end" fontSize={12} fill="#2f5d82" fontWeight={700}>🌊 海側</text>
            {/* 街道 */}
            {Array.from({ length: MAP_H }).map((_, y) => (
              <g key={`h${y}`}>
                <line x1={PAD} y1={PAD + y * CELL} x2={PAD + (MAP_W - 1) * CELL} y2={PAD + y * CELL} stroke="#b9b3a3" strokeWidth={14} strokeLinecap="round" />
                {STREETS_H[y] && <text x={PAD - 8} y={PAD + y * CELL - 10} fontSize={10} fill="#8a8272">{STREETS_H[y]}</text>}
              </g>
            ))}
            {Array.from({ length: MAP_W }).map((_, x) => (
              <g key={`v${x}`}>
                <line x1={PAD + x * CELL} y1={PAD} x2={PAD + x * CELL} y2={PAD + (MAP_H - 1) * CELL} stroke="#b9b3a3" strokeWidth={14} strokeLinecap="round" />
                {STREETS_V[x] && (
                  <text x={PAD + x * CELL + 10} y={PAD + CELL * 0.5} fontSize={10} fill="#8a8272" transform={`rotate(90 ${PAD + x * CELL + 10} ${PAD + CELL * 0.5})`}>{STREETS_V[x]}</text>
                )}
              </g>
            ))}
            {/* 路口 */}
            {Array.from({ length: MAP_W * MAP_H }).map((_, i) => {
              const p = px({ x: i % MAP_W, y: Math.floor(i / MAP_W) });
              return <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#9c9585" />;
            })}
            {/* 路线 */}
            {shownPath.length > 1 && (
              <polyline points={shownPath.map(n => { const p = px(n); return `${p.x},${p.y}`; }).join(' ')}
                fill="none" stroke={walking ? '#e8a317' : '#e8a31799'} strokeWidth={6} strokeDasharray={walking ? '0' : '10 8'} strokeLinecap="round" strokeLinejoin="round" />
            )}
            {/* 地标 */}
            {LANDMARKS.map(l => {
              const p = px(l.at);
              const isDest = l.id === dest.id;
              return (
                <g key={l.id}>
                  {isDest && <circle cx={p.x} cy={p.y} r={22} fill="none" stroke="#e23d3d" strokeWidth={3}><animate attributeName="r" values="18;26;18" dur="1.6s" repeatCount="indefinite" /></circle>}
                  <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize={20}>{l.emoji}</text>
                  <text x={p.x} y={p.y + 30} textAnchor="middle" fontSize={12} fontWeight={800} fill={isDest ? '#c02626' : '#3b3428'}>{l.jp}</text>
                </g>
              );
            })}
            {/* 游客 */}
            {(() => {
              const p = px(walkerAt);
              // 直接用坐标，不加 CSS transition：SVG 的 transform 属性配 CSS 过渡，Chrome 会卡在起点不动
              return (
                <g>
                  <circle cx={p.x} cy={p.y} r={13} fill="#2563eb" stroke="#fff" strokeWidth={3} />
                  {!walking && <path d="M0,-22 L7,-10 L-7,-10 Z" fill="#2563eb" transform={`translate(${p.x} ${p.y}) rotate(${ARROW[sc.facing]})`} />}
                </g>
              );
            })()}
          </svg>
          <p className="text-[#5b5446] text-[11px] px-1 pt-1">
            {en ? `You are at: ${sc.whereEn}.` : `你在：${sc.whereZh}。`}
            {' '}
            {en ? `Facing ${DIR_EN[sc.facing]} — so your right hand points ${DIR_EN[({ N: 'E', E: 'S', S: 'W', W: 'N' } as Record<Dir, Dir>)[sc.facing]]}.`
                : `面朝${DIR_ZH[sc.facing]}——右手边是${DIR_ZH[({ N: 'E', E: 'S', S: 'W', W: 'N' } as Record<Dir, Dir>)[sc.facing]]}。`}
          </p>
        </div>

        {/* 对话和拼句子 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <img src={tourist.sprite} alt="" className="h-32 md:h-40 object-contain shrink-0" />
            <div className="pb-2">
              <p className="text-white/45 text-[11px]">{en ? tourist.en : tourist.zh}</p>
              <p className="text-white text-lg md:text-xl font-bold">「すみません、{dest.jp}はどこですか。」</p>
              {showGloss && <p className="text-white/45 text-xs">{en ? `Excuse me, where is ${dest.en}?` : `不好意思，${dest.zh}在哪里？`}</p>}
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/10 p-3 space-y-2">
            {legs.map((leg, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="text-white/30 text-xs font-black w-4">{i + 1}</span>
                <span className="text-white/70 text-sm">{i === 0 ? 'まっすぐ行って、' : ''}</span>
                <select value={leg.n} disabled={!!walking} onChange={e => setLeg(i, { n: Number(e.target.value) })}
                  className="bg-black border border-white/25 text-white text-sm px-2 py-1">
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{['', '一つ目', '二つ目', '三つ目', '四つ目', '五つ目'][n]}</option>)}
                </select>
                <span className="text-white/70 text-sm">の角</span>
                <select value={leg.turn} disabled={!!walking} onChange={e => setLeg(i, { turn: e.target.value as Leg['turn'] })}
                  className="bg-black border border-white/25 text-white text-sm px-2 py-1">
                  <option value="R">を右に曲がって</option>
                  <option value="L">を左に曲がって</option>
                  <option value="end">に{dest.jp}があります</option>
                </select>
                {showGloss && (
                  <span className="text-white/35 text-[11px]">
                    {leg.turn === 'end'
                      ? (en ? `(at corner #${leg.n}: arrive)` : `（第 ${leg.n} 个路口就到了）`)
                      : (en ? `(turn ${leg.turn === 'R' ? 'right' : 'left'} at corner #${leg.n})` : `（在第 ${leg.n} 个路口${leg.turn === 'R' ? '右' : '左'}转）`)}
                  </span>
                )}
              </div>
            ))}
            {!walking && (
              <div className="flex gap-2 pt-1">
                {legs.length < 3 && <button onClick={addLeg} className="text-[11px] text-white/60 hover:text-white border border-white/20 px-2 py-1">＋ {en ? 'another turn' : '再拐一个弯'}</button>}
                {legs.length > 1 && <button onClick={removeLeg} className="text-[11px] text-white/60 hover:text-white border border-white/20 px-2 py-1">－ {en ? 'one fewer' : '少拐一个'}</button>}
              </div>
            )}
          </div>

          {/* 你说出口的那句 */}
          <div className="border-l-4 border-yellow-400 bg-black/50 px-4 py-3">
            <p className="text-[10px] text-yellow-400/80 font-black tracking-widest mb-1">{en ? 'WHAT YOU SAY' : '你说'}</p>
            <p className="text-white text-base md:text-lg font-bold leading-relaxed">「{sentence}」</p>
          </div>

          {!walking ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-white/40 text-[11px]">
                {showPreview
                  ? (en ? 'The dotted line shows where your sentence leads.' : '虚线是你这句话会把人带去的地方。')
                  : (en ? 'No preview at this level — walk it in your head first.' : '这一档不预览路线——说之前先在脑子里走一遍。')}
                {tries > 0 && <span className="text-rose-300 ml-2">{en ? `Attempt ${tries + 1} of ${maxTries}` : `第 ${tries + 1} 次（共 ${maxTries} 次）`}</span>}
              </p>
              <button onClick={tell} disabled={!complete}
                className="bg-yellow-400 hover:bg-white disabled:opacity-30 text-black px-8 py-2.5 text-xs font-black tracking-widest transform -skew-x-12 shrink-0">
                <span className="block transform skew-x-12">{en ? 'Tell them ▶' : '告诉他 ▶'}</span>
              </button>
            </div>
          ) : verdict ? (
            <div className="space-y-3">
              <p className={`text-sm ${verdict === 'ok' ? 'text-emerald-300' : 'text-rose-200'}`}>
                {verdict === 'ok'
                  ? <>「あ、見えました！ありがとうございます！」<span className="text-white/40 ml-1">{en ? 'Oh, I can see it! Thank you!' : '啊，看到了！谢谢！'}</span></>
                  : <>「……あれ？ここ、どこでしょう……」<span className="text-white/40 ml-1">{en ? '...Huh? Where am I...?' : '……咦？这是哪儿……'}</span></>}
              </p>
              <button onClick={afterVerdict}
                className="bg-yellow-400 hover:bg-white text-black px-8 py-2.5 text-xs font-black tracking-widest transform -skew-x-12">
                <span className="block transform skew-x-12">
                  {verdict === 'lost' && tries + 1 < maxTries ? (en ? 'Try again' : '再说一次') : (en ? 'Next ▶' : '下一位 ▶')}
                </span>
              </button>
            </div>
          ) : (
            <p className="text-white/50 text-sm animate-pulse">{en ? 'They set off...' : '他照着你的话走了……'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MichiModal;
