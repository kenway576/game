import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Language, PracticeTier } from '../types';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🏀 投篮机（一分間シュート）
//
// 游戏厅那种篮球机的玩法：限时内投进够数就晋级下一关，
// 越往后计量条越快、绿区越窄、要进的越多。
//
// 【怎么投】
// 右边那根计量条一直上下走。点屏幕 / 按空格把它停住：
//   停在绿区里  → 进
//   停在中间那条白线上 → 空心（スウィッシュ）
//   差一点      → 砸筐，看运气
//   差得远      → 太近（短）或者太远（砸篮板）
// 球要"回到手里"才能投下一个（跟真机器一样有回球时间），
// 所以不是狂点就行，得等计量条走到绿区。
//
// 【两种玩法】
//   solo    一个人。过几关是几关。
//   vs_sora 空在隔壁那台机器上一起投。最后比总进球数。
//
// 【第一次】
// 第一次玩的时候空在旁边讲规则、让你先空投一个练手——
// 跟钓鱼有源さん、做饭有奈绪是一个道理。
// ---------------------------------------------------------

export type BasketballMode = 'solo' | 'vs_sora';

export interface BasketballResult {
  mode: BasketballMode;
  made: number;          // 一共进了几个
  shots: number;
  swishes: number;
  stageReached: number;  // 打到第几关（1 起）
  cleared: boolean;      // 三关全过
  soraMade?: number;
  won: boolean;          // vs：比空多；solo：至少过了第一关
}

interface Props {
  language: Language;
  mode: BasketballMode;
  tutorial: boolean;
  venue?: 'gym' | 'arcade';
  tier?: PracticeTier;
  onFinish: (r: BasketballResult) => void;
  // 剧情里调用时不给：这一局不能逃
  onCancel?: () => void;
}

const STAGES = [
  { time: 30, target: 8,  speed: 1.0,  zone: 0.26 },
  { time: 30, target: 11, speed: 1.32, zone: 0.19 },
  { time: 25, target: 12, speed: 1.7,  zone: 0.14 }
];
const RELOAD_MS = 950;       // 回球时间
const FLIGHT_MS = 640;
const POST_MS = 520;
const RIM = { x: 50, y: 27.4 };   // 篮筐在背景图上的位置（%）
const START = { x: 50, y: 94 };

// 空隔壁那台机器的手感：越往后的档位越准
const SORA_SKILL: Record<PracticeTier, { acc: number; every: number }> = {
  1: { acc: 0.5, every: 1750 },
  2: { acc: 0.62, every: 1620 },
  3: { acc: 0.72, every: 1500 }
};

const S = '/images/characters/sora/';

// 三关全过一共要进几个。练习进度按"进了几个 / 这么多"来升档。
export const BB_FULL_RUN = STAGES.reduce((n, s) => n + s.target, 0);

type Outcome = 'swish' | 'in' | 'rimIn' | 'rimOut' | 'short' | 'long';
interface Ball { id: number; kind: Outcome; t0: number; ex: number; ey: number; side: number; counted: boolean }

type Say = { jp: string; zh: string; en: string };
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const SORA_MAKE: Say[] = [
  { jp: 'ナイッシュー、ウチ！', zh: '好球，我自己！', en: 'Nice shot, me!' },
  { jp: 'まだまだいくで！', zh: '还早着呢！', en: 'Not done yet!' },
  { jp: 'ほいっと。', zh: '嘿咻。', en: 'Easy.' }
];
const SORA_MISS: Say[] = [
  { jp: 'あっ、くそっ！', zh: '啊，可恶！', en: 'Ah, dammit!' },
  { jp: '今のナシ！', zh: '刚才那个不算！', en: 'That one does not count!' }
];
const SORA_YOU: Say[] = [
  { jp: 'やるやん！', zh: '可以啊你！', en: 'Not bad!' },
  { jp: 'え、今の空心？', zh: '诶，刚才那个是空心？', en: 'Wait, was that a swish?' }
];

const TUTORIAL: { img: string; jp: string; zh: string; en: string; focus?: 'meter' | 'hud' | 'sora' }[] = [
  { img: 'happy', jp: 'ほな、ルール説明するで！ウチの特訓メニュー「一分間シュート」や。', zh: '那我来说明规则！这是我的特训菜单「一分钟投篮」。', en: 'Right, rules! This is my training drill — the one-minute shootout.' },
  { img: 'neutral', jp: '右のゲージ見てみ。上下に動いとるやろ？緑のとこで止めたら入る。', zh: '看右边的计量条。在上下动吧？停在绿色那段就能进。', en: 'See the gauge on the right going up and down? Stop it in the green and it goes in.', focus: 'meter' },
  { img: 'cute', jp: '真ん中の白い線ピッタリで止めたら、空心（スウィッシュ）や！気持ちええで〜。', zh: '正好停在中间那条白线上，就是空心球！超爽的～', en: 'Stop it right on the white line in the middle and it is a swish. Feels amazing.', focus: 'meter' },
  { img: 'neutral', jp: '画面をタップするか、スペースキーで投げる。球が手元に戻るまで次は投げられへんからな。', zh: '点屏幕，或者按空格键投篮。球回到手里之前投不了下一个。', en: 'Tap the screen or hit Space to shoot. You cannot throw again until the ball comes back.' },
  { img: 'happy', jp: '時間内に目標の本数入れたら次のステージ。上がるたびにゲージ速なるで。', zh: '在时间内投进目标数量就进下一关。每升一关计量条都会变快。', en: 'Make the target before time runs out and you move up a stage. The gauge speeds up each time.', focus: 'hud' },
  { img: 'cute', jp: 'まず一本、練習してみ。時間は気にせんでええから。', zh: '先来一球练练手。不用管时间。', en: 'Take a practice shot first. No clock.' }
];

const BasketballModal: React.FC<Props> = ({ language, mode, tutorial, venue = 'gym', tier = 1, onFinish, onCancel }) => {
  const en = language === 'en';
  const vs = mode === 'vs_sora';
  const skill = SORA_SKILL[tutorial ? 1 : tier];

  const [phase, setPhase] = useState<'tutorial' | 'practice' | 'countdown' | 'play' | 'stageClear' | 'done'>(tutorial ? 'tutorial' : 'countdown');
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 剧情里打开时 App 不管 BGM，这里按场地自己点：游戏厅那台机器放 Arcade High Score
    audioManager.crossfadeBgm(venue === 'arcade' ? 'arcade' : 'sports', 600);
  }, []);
  const [practiceLine, setPracticeLine] = useState<Say | null>(null);
  const [stage, setStage] = useState(0);
  const [count, setCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(STAGES[0].time);
  const [meter, setMeter] = useState(0);
  const [zoneC, setZoneC] = useState(0.62);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [made, setMade] = useState(0);
  const [stageMade, setStageMade] = useState(0);
  const [swishes, setSwishes] = useState(0);
  const [shots, setShots] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pop, setPop] = useState<{ text: string; good: boolean; key: number } | null>(null);
  const [soraMade, setSoraMade] = useState(0);
  const [soraSay, setSoraSay] = useState<Say | null>(null);
  const [ready, setReady] = useState(true);
  const [result, setResult] = useState<BasketballResult | null>(null);

  const meterRef = useRef(0);
  const phaseRef = useRef(phase);
  const stageRef = useRef(0);
  const lastTs = useRef<number | null>(null);
  const meterPhase = useRef(0);
  const ballId = useRef(0);
  const soraClock = useRef(0);
  const timeRef = useRef(STAGES[0].time * 1000);
  const readyRef = useRef(true);
  const stageMadeRef = useRef(0);
  const practiceShots = useRef(0);
  const totals = useRef({ made: 0, shots: 0, swishes: 0, sora: 0 });
  // 球和绿区放 ref：主循环和按键回调都要读到最新值。
  // ⚠️ 进球结算不能写在 setBalls 的 updater 里——StrictMode 会把 updater 跑两遍，一个球算两分。
  const ballsRef = useRef<Ball[]>([]);
  const zoneRef = useRef(0.62);
  const setZone = (z: number) => { zoneRef.current = z; setZoneC(z); };

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const cfg = STAGES[stage];

  // ---------- 主循环：计量条 / 计时 / 球 / 空的机器 ----------
  useEffect(() => {
    let raf = 0;
    const loop = (ts: number) => {
      const dt = lastTs.current === null ? 0 : Math.min(50, ts - lastTs.current);
      lastTs.current = ts;
      const ph = phaseRef.current;
      const st = STAGES[stageRef.current];
      if (ph === 'play' || ph === 'practice' || ph === 'tutorial') {
        // 三角波：一个来回 1.5 秒（第一关），越往后越快
        meterPhase.current += dt / 750 * (ph === 'play' ? st.speed : 0.9);
        const p = meterPhase.current % 2;
        const m = p < 1 ? p : 2 - p;
        meterRef.current = m;
        setMeter(m);
      }
      if (ph === 'play') {
        timeRef.current -= dt;
        setTimeLeft(Math.max(0, Math.ceil(timeRef.current / 1000)));
        if (vs) {
          soraClock.current -= dt;
          if (soraClock.current <= 0) {
            soraClock.current = skill.every * (0.8 + Math.random() * 0.4);
            if (Math.random() < skill.acc * (1 - stageRef.current * 0.06)) {
              totals.current.sora += 1;
              setSoraMade(totals.current.sora);
              if (Math.random() < 0.18) setSoraSay(pick(SORA_MAKE));
            } else if (Math.random() < 0.15) setSoraSay(pick(SORA_MISS));
          }
        }
        if (timeRef.current <= 0) endStage();
      }
      // 球：到筐的那一刻结算
      if (ballsRef.current.length) {
        const now = performance.now();
        for (const b of ballsRef.current) {
          if (!b.counted && now - b.t0 >= FLIGHT_MS) { b.counted = true; land(b); }
        }
        ballsRef.current = ballsRef.current.filter(b => now - b.t0 < FLIGHT_MS + POST_MS);
        setBalls(ballsRef.current.slice());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 球落地（或者说落筐）
  const land = (b: Ball) => {
    const scored = b.kind === 'swish' || b.kind === 'in' || b.kind === 'rimIn';
    const inPlay = phaseRef.current === 'play';
    if (scored) {
      audioManager.playSfx(b.kind === 'swish' ? 'levelup_familiarity' : 'collect');
      if (inPlay) {
        totals.current.made += 1;
        if (b.kind === 'swish') totals.current.swishes += 1;
        stageMadeRef.current += 1;
        setMade(totals.current.made);
        setStageMade(stageMadeRef.current);
        setSwishes(totals.current.swishes);
        setCombo(c => c + 1);
        if (vs && b.kind === 'swish' && Math.random() < 0.4) setSoraSay(pick(SORA_YOU));
      }
      setPop({
        text: b.kind === 'swish' ? (en ? 'SWISH!' : '空心！') : b.kind === 'rimIn' ? (en ? 'LUCKY!' : '滚进去了！') : (en ? 'NICE!' : '进了！'),
        good: true, key: Date.now()
      });
    } else {
      audioManager.playSfx('error');
      if (inPlay) setCombo(0);
      setPop({
        text: b.kind === 'rimOut' ? (en ? 'RIM OUT' : '砸筐了') : b.kind === 'short' ? (en ? 'SHORT' : '太近了') : (en ? 'TOO LONG' : '太远了'),
        good: false, key: Date.now()
      });
    }
    if (phaseRef.current === 'practice') {
      practiceShots.current += 1;
      if (scored || practiceShots.current >= 3) {
        setPracticeLine(scored
          ? { jp: 'ナイス！その感じや。ほな、本番いくで！', zh: '漂亮！就是这个感觉。那，来真的了！', en: 'Nice! That is the feel. Right — for real now!' }
          : { jp: 'まあええわ、本番で取り返し！いくで！', zh: '算了，正式比赛里找回来！走！', en: 'Never mind, make it up in the real thing! Here we go!' });
        phaseRef.current = 'countdown';
        setTimeout(() => setPhase('countdown'), 1500);
      }
    }
  };

  const shoot = () => {
    const ph = phaseRef.current;
    if (ph !== 'play' && ph !== 'practice') return;
    if (!readyRef.current) return;
    readyRef.current = false; setReady(false);
    setTimeout(() => { readyRef.current = true; setReady(true); }, RELOAD_MS);
    audioManager.playSfx('click');

    const st = STAGES[stageRef.current];
    const m = meterRef.current;
    const zc = zoneRef.current;
    const d = Math.abs(m - zc);
    const half = (ph === 'practice' ? 0.3 : st.zone) / 2;
    let kind: Outcome;
    if (d <= half * 0.22) kind = 'swish';
    else if (d <= half) kind = 'in';
    else if (d <= half + 0.07) kind = Math.random() < 0.4 ? 'rimIn' : 'rimOut';
    else kind = m < zc ? 'short' : 'long';

    const side = Math.random() < 0.5 ? -1 : 1;
    const ex = kind === 'rimOut' ? RIM.x + side * 3.2
      : kind === 'short' ? RIM.x + (Math.random() - 0.5) * 6
      : kind === 'long' ? RIM.x + (Math.random() - 0.5) * 5
      : kind === 'rimIn' ? RIM.x + side * 1.6 : RIM.x;
    const ey = kind === 'short' ? RIM.y + 7 : kind === 'long' ? RIM.y - 9 : RIM.y;
    ballsRef.current = [...ballsRef.current, { id: ++ballId.current, kind, t0: performance.now(), ex, ey, side, counted: false }];
    setBalls(ballsRef.current.slice());
    if (ph === 'play') { totals.current.shots += 1; setShots(totals.current.shots); }
    // 第二关起绿区每投一次换个位置
    if (ph === 'play' && stageRef.current >= 1) setZone(0.42 + Math.random() * 0.4);
  };

  // 空格键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); shoot(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 倒数
  useEffect(() => {
    if (phase !== 'countdown') return;
    setCount(3);
    let n = 3;
    const t = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(t);
        timeRef.current = STAGES[stageRef.current].time * 1000;
        stageMadeRef.current = 0; setStageMade(0);
        setTimeLeft(STAGES[stageRef.current].time);
        setZone(stageRef.current === 0 ? 0.62 : 0.42 + Math.random() * 0.4);
        soraClock.current = 900;
        setPracticeLine(null);
        audioManager.playSfx('confirm');
        setPhase('play');
      } else {
        audioManager.playSfx('page');
        setCount(n);
      }
    }, 750);
    return () => clearInterval(t);
  }, [phase]);

  const finishGame = (stageReached: number, cleared: boolean) => {
    const t = totals.current;
    const r: BasketballResult = {
      mode, made: t.made, shots: t.shots, swishes: t.swishes, stageReached, cleared,
      soraMade: vs ? t.sora : undefined,
      won: vs ? t.made > t.sora : stageReached >= 2 || cleared
    };
    setResult(r);
    setPhase('done');
    audioManager.playSfx(r.won ? 'levelup_affection' : 'modal_close');
  };

  const endStage = () => {
    if (phaseRef.current !== 'play') return;
    const s = stageRef.current;
    if (stageMadeRef.current >= STAGES[s].target) {
      if (s >= STAGES.length - 1) { phaseRef.current = 'done'; finishGame(s + 1, true); return; }
      phaseRef.current = 'stageClear';
      setPhase('stageClear');
      audioManager.playSfx('unlock');
      setTimeout(() => {
        stageRef.current = s + 1;
        setStage(s + 1);
        // 下一关的计数和时间在倒数的时候就该显示出来，别挂着上一关的「13/11」
        stageMadeRef.current = 0; setStageMade(0);
        setTimeLeft(STAGES[s + 1].time);
        setPhase('countdown');
      }, 1800);
    } else {
      phaseRef.current = 'done';
      finishGame(s + 1, false);
    }
  };

  // ---------- 球的位置 ----------
  const ballStyle = (b: Ball, now: number): React.CSSProperties => {
    const t = now - b.t0;
    if (t <= FLIGHT_MS) {
      const u = t / FLIGHT_MS;
      const x = START.x + (b.ex - START.x) * u;
      const peak = b.kind === 'short' ? 20 : 34;
      const y = START.y + (b.ey - START.y) * u - peak * 4 * u * (1 - u);
      const sc = 1 - 0.64 * u;
      return { left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) scale(${sc}) rotate(${u * 540}deg)`, zIndex: 20 };
    }
    const v = Math.min(1, (t - FLIGHT_MS) / POST_MS);
    const scored = b.kind === 'swish' || b.kind === 'in' || b.kind === 'rimIn';
    if (scored) {
      return { left: `${b.ex + (RIM.x - b.ex) * v}%`, top: `${b.ey + v * 10}%`, transform: `translate(-50%,-50%) scale(${0.36 - v * 0.04})`, opacity: 1 - v * 0.9, zIndex: 10 };
    }
    const dx = b.kind === 'rimOut' ? b.side * 12 * v : (b.kind === 'long' ? b.side * 4 * v : 0);
    const dy = b.kind === 'long' ? -4 * v + 40 * v * v : 6 * v + 36 * v * v;
    return { left: `${b.ex + dx}%`, top: `${b.ey + dy}%`, transform: `translate(-50%,-50%) scale(${0.36 + v * 0.18}) rotate(${v * 300}deg)`, opacity: 1 - v * 0.6, zIndex: 20 };
  };

  const now = performance.now();
  const dropping = balls.some(b => now - b.t0 > FLIGHT_MS * 0.9 && (b.kind === 'swish' || b.kind === 'in' || b.kind === 'rimIn'));
  const half = (phase === 'practice' || phase === 'tutorial' ? 0.3 : cfg.zone) / 2;
  const tut = TUTORIAL[step];
  // 篮筐坐标是照着这张图量的，所以游戏厅也用它，外面套一圈机台的霓虹框
  const bg = '/images/backgrounds/bg_basketball_court_hoop.webp';

  // ---------- 结算 ----------
  if (phase === 'done' && result) {
    const r = result;
    const bigWin = vs ? r.won : r.cleared;
    // 挂到 body 上：从剧情里打开时，剧情那一层的顶栏（跳过 / 自动）不能压在上面——
    // 打到一半点了「跳过」，这一局就不结算了。
    return createPortal(
      <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center p-5">
        <img src={bigWin ? '/images/cg/cg_basketball_swish.webp' : '/images/backgrounds/bg_basketball_gym_sunset.webp'} alt=""
             className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="relative max-w-md w-full text-center space-y-4">
          {vs && <img src={`${S}${r.won ? 'shock' : 'happy'}.webp`} alt="" className="h-44 md:h-56 mx-auto object-contain drop-shadow-2xl" />}
          <p className="text-yellow-400 text-[11px] font-black tracking-[0.3em]">
            {r.cleared ? (en ? 'ALL STAGES CLEAR' : '全关通过') : (en ? `REACHED STAGE ${r.stageReached}` : `打到第 ${r.stageReached} 关`)}
          </p>
          <h3 className="text-white text-3xl md:text-4xl font-black italic">
            {vs
              ? (r.won ? (en ? 'You win!' : '你赢了！') : r.made === r.soraMade ? (en ? 'A draw' : '平手') : (en ? 'Sora wins' : '空赢了'))
              : (r.cleared ? (en ? 'Perfect run!' : '完美通关！') : r.won ? (en ? 'Good run' : '不错嘛') : (en ? 'Time up' : '时间到'))}
          </h3>
          <div className="flex justify-center gap-6 text-white">
            <div><div className="text-3xl font-black text-yellow-300">{r.made}</div><div className="text-[10px] text-white/50 tracking-widest">{en ? 'MADE' : '进球'}</div></div>
            {vs && <div><div className="text-3xl font-black text-orange-300">{r.soraMade}</div><div className="text-[10px] text-white/50 tracking-widest">{en ? 'SORA' : '空'}</div></div>}
            <div><div className="text-3xl font-black text-sky-300">{r.swishes}</div><div className="text-[10px] text-white/50 tracking-widest">{en ? 'SWISH' : '空心'}</div></div>
            <div><div className="text-3xl font-black text-white/80">{r.shots ? Math.round(r.made / r.shots * 100) : 0}%</div><div className="text-[10px] text-white/50 tracking-widest">{en ? 'ACC' : '命中率'}</div></div>
          </div>
          {vs && (
            <p className="text-white/80 text-sm">
              「{r.won ? 'うそやろ……次は絶対負けへんからな！' : 'へへん、まだまだやな。でも筋はええで！'}」
              <span className="block text-white/45 text-xs mt-1">
                {r.won ? (en ? 'No way... I am not losing next time!' : '不会吧……下次绝对不会输！') : (en ? 'Heh, not yet. But you have got the knack!' : '嘿嘿，还差得远呢。不过底子不错！')}
              </span>
            </p>
          )}
          <button
            onClick={() => { audioManager.playSfx('confirm'); onFinish(r); }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12"
          >
            <span className="block transform skew-x-12">{en ? 'Done' : '收工'}</span>
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[400] bg-black flex flex-col items-center justify-center select-none"
         onPointerDown={e => { if ((e.target as HTMLElement).closest('button')) return; shoot(); }}>
      {/* 舞台：固定 16:9，篮筐的坐标才对得上背景图 */}
      <div className="relative w-full max-w-[177.78vh] aspect-video overflow-hidden">
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45 pointer-events-none" />
        {venue === 'arcade' && (
          <>
            <div className="absolute inset-0 pointer-events-none mix-blend-color bg-gradient-to-b from-fuchsia-700/40 via-indigo-800/30 to-cyan-700/30" />
            <div className="absolute inset-0 pointer-events-none border-[10px] md:border-[16px] border-fuchsia-500/70 shadow-[inset_0_0_40px_rgba(217,70,239,0.7)] rounded-sm" />
            <div className="absolute top-[11%] left-1/2 -translate-x-1/2 px-3 py-0.5 bg-black/70 border border-cyan-300/70 text-cyan-200 text-[10px] md:text-sm font-black tracking-[0.35em] shadow-[0_0_12px_rgba(34,211,238,0.7)] pointer-events-none">
              ★ STAR SLAM ★
            </div>
          </>
        )}

        {/* HUD */}
        <div className={`absolute top-[3%] left-1/2 -translate-x-1/2 flex items-stretch gap-1.5 ${tut?.focus === 'hud' && phase === 'tutorial' ? 'ring-2 ring-yellow-300 rounded animate-pulse' : ''}`}>
          <div className="bg-black/80 border border-white/20 px-3 py-1 transform -skew-x-12">
            <span className="block transform skew-x-12 text-[10px] md:text-xs font-black text-yellow-400 tracking-widest">
              STAGE {stage + 1}
            </span>
          </div>
          <div className="bg-black/80 border border-white/20 px-3 py-1 transform -skew-x-12 min-w-[64px] text-center">
            <span className={`block transform skew-x-12 text-lg md:text-3xl font-black tabular-nums ${timeLeft <= 5 && phase === 'play' ? 'text-rose-400' : 'text-white'}`}>
              {phase === 'practice' || phase === 'tutorial' ? '--' : timeLeft}
            </span>
          </div>
          <div className="bg-black/80 border border-white/20 px-3 py-1 transform -skew-x-12">
            <span className="block transform skew-x-12 text-[10px] md:text-xs font-black text-white/80">
              {en ? 'GOAL' : '目标'} <span className={stageMade >= cfg.target ? 'text-emerald-300' : 'text-white'}>{stageMade}</span>/{cfg.target}
            </span>
            <span className="block transform skew-x-12 h-1 mt-0.5 bg-white/15">
              <span className="block h-full bg-emerald-400 transition-all" style={{ width: `${Math.min(100, stageMade / cfg.target * 100)}%` }} />
            </span>
          </div>
        </div>

        {/* 总进球 & 连进 */}
        <div className="absolute top-[3%] left-[2%] text-white">
          <div className="text-[9px] md:text-[10px] text-white/55 font-black tracking-widest">{en ? 'TOTAL' : '总进球'}</div>
          <div className="text-xl md:text-4xl font-black text-yellow-300 tabular-nums drop-shadow">{made}</div>
          {combo >= 3 && phase === 'play' && <div className="text-[10px] md:text-xs font-black text-orange-300 animate-pulse">🔥 {combo} {en ? 'IN A ROW' : '连进'}</div>}
        </div>

        {onCancel && phase !== 'tutorial' && (
          <button onClick={onCancel} className="absolute top-[3%] right-[2%] text-white/40 hover:text-white/80 text-[10px] font-black tracking-widest">
            {en ? 'QUIT' : '不玩了'}
          </button>
        )}

        {/* 球进网时盖在球上面的那半圈前筐和网：球看起来是从网里掉下去的 */}
        {dropping && (
          <svg className="absolute pointer-events-none" style={{ left: `${RIM.x - 3.6}%`, top: `${RIM.y - 0.6}%`, width: '7.2%', height: '9%', zIndex: 15 }} viewBox="0 0 72 60" preserveAspectRatio="none">
            <path d="M2 4 Q36 14 70 4" stroke="#d9441f" strokeWidth="3.5" fill="none" />
            {[8, 20, 32, 44, 56, 66].map((x, i) => <path key={i} d={`M${x} ${6 + (i % 2)} L${36 + (x - 36) * 0.55} 56`} stroke="white" strokeOpacity="0.75" strokeWidth="1.2" />)}
            {[18, 32, 46].map(y => <path key={y} d={`M${6 + y * 0.18} ${y} Q36 ${y + 6} ${66 - y * 0.18} ${y}`} stroke="white" strokeOpacity="0.6" strokeWidth="1" fill="none" />)}
          </svg>
        )}

        {/* 飞着的球 */}
        {balls.map(b => (
          <img key={b.id} src="/images/ui/basketball_ball.webp" alt="" draggable={false}
               className="absolute w-[11%] aspect-square pointer-events-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
               style={ballStyle(b, now)} />
        ))}

        {/* 手里那一个 */}
        {(phase === 'play' || phase === 'practice') && (
          <img src="/images/ui/basketball_ball.webp" alt="" draggable={false}
               className={`absolute left-1/2 bottom-[-4%] w-[11%] aspect-square -translate-x-1/2 transition-all duration-200 pointer-events-none ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} />
        )}

        {/* 进没进 */}
        {pop && (
          <div key={pop.key} className={`absolute left-1/2 top-[38%] -translate-x-1/2 text-2xl md:text-5xl font-black italic pointer-events-none ${pop.good ? 'text-yellow-300' : 'text-white/70'}`}
               style={{ animation: 'bbPop 700ms ease-out forwards', WebkitTextStroke: '2px #1b1b1b', paintOrder: 'stroke fill' }}>
            {pop.text}
          </div>
        )}

        {/* 计量条 */}
        <div className={`absolute right-[4%] top-[18%] h-[62%] w-[3.2%] min-w-[18px] rounded-full bg-black/70 border-2 border-white/30 overflow-hidden ${tut?.focus === 'meter' && phase === 'tutorial' ? 'ring-4 ring-yellow-300 animate-pulse' : ''}`}>
          {/* 绿区：从下往上量 */}
          <div className="absolute left-0 right-0 bg-emerald-400/70" style={{ bottom: `${(zoneC - half) * 100}%`, height: `${half * 2 * 100}%` }} />
          <div className="absolute left-0 right-0 h-[3px] bg-white" style={{ bottom: `calc(${zoneC * 100}% - 1.5px)` }} />
          {/* 指针 */}
          <div className="absolute -left-1 -right-1 h-[6px] bg-yellow-300 shadow-[0_0_10px_3px_rgba(250,204,21,0.8)] rounded" style={{ bottom: `calc(${meter * 100}% - 3px)` }} />
        </div>
        <div className="absolute right-[2.2%] top-[81.5%] text-[9px] md:text-[10px] font-black text-white/60 tracking-widest">POWER</div>

        {/* 隔壁那台：空 */}
        {vs && phase !== 'tutorial' && (
          <div className="absolute left-[2%] bottom-[4%] flex items-end gap-2">
            <img src="/images/stickers/sora_happy.webp" alt="" className="w-[64px] md:w-[96px] drop-shadow-xl" draggable={false} />
            <div className="mb-1">
              <div className="bg-orange-500 text-black text-[10px] md:text-xs font-black px-2 py-0.5 transform -skew-x-12 inline-block">
                <span className="block transform skew-x-12">{en ? 'SORA' : '空'} {soraMade}</span>
              </div>
              {soraSay && (
                <div key={soraSay.jp} className="mt-1 bg-white/90 text-black rounded-lg px-2 py-1 text-[10px] md:text-xs max-w-[160px]" style={{ animation: 'bbPop2 2.4s ease-out forwards' }}>
                  {soraSay.jp}<span className="block text-black/50 text-[9px]">{en ? soraSay.en : soraSay.zh}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作提示 */}
        {(phase === 'play' || phase === 'practice') && (
          <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 translate-x-[30%] text-[10px] md:text-xs text-white/70 font-bold bg-black/50 px-3 py-1 rounded-full pointer-events-none">
            {ready ? (en ? 'Tap / Space to shoot' : '点击 / 空格 投篮') : (en ? 'Ball coming back…' : '回球中…')}
          </div>
        )}

        {/* 倒数 & 过关 */}
        {phase === 'countdown' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 pointer-events-none">
            <div className="text-[11px] md:text-sm font-black tracking-[0.3em] text-yellow-300 mb-2">
              STAGE {stage + 1} · {en ? `MAKE ${cfg.target} IN ${cfg.time}s` : `${cfg.time} 秒内投进 ${cfg.target} 个`}
            </div>
            <div key={count} className="text-7xl md:text-9xl font-black italic text-white" style={{ animation: 'bbZoom 600ms ease-out' }}>{count}</div>
            {practiceLine && <p className="mt-3 text-white/80 text-xs md:text-sm">{practiceLine.jp}<span className="ml-2 text-white/50">{en ? practiceLine.en : practiceLine.zh}</span></p>}
          </div>
        )}
        {phase === 'stageClear' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 pointer-events-none">
            <div className="text-4xl md:text-7xl font-black italic text-yellow-300" style={{ animation: 'bbZoom 600ms ease-out', WebkitTextStroke: '2px #000', paintOrder: 'stroke fill' }}>
              STAGE CLEAR!
            </div>
            <div className="mt-2 text-white/80 text-xs md:text-sm font-bold">{en ? 'Gauge speeds up. The green moves around now.' : '计量条要变快了，绿区也会到处跑。'}</div>
          </div>
        )}

        {/* 练习那一球的提示 */}
        {phase === 'practice' && practiceLine && (
          <div className="absolute left-1/2 top-[56%] -translate-x-1/2 bg-black/75 border-l-4 border-orange-400 px-4 py-2 text-white text-xs md:text-sm max-w-[80%]">
            <b className="text-orange-300 mr-2">{en ? 'Sora' : '空'}</b>{practiceLine.jp}
            <span className="block text-white/55 text-[11px]">{en ? practiceLine.en : practiceLine.zh}</span>
          </div>
        )}
      </div>

      {/* 空讲规则：视觉小说式的对话框压在舞台下面 */}
      {phase === 'tutorial' && tut && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center p-3 md:p-6 pointer-events-none">
          <div className="relative w-full max-w-4xl flex items-end gap-3 pointer-events-auto">
            <img src={`${S}${tut.img}.webp`} alt="" className="h-40 md:h-72 object-contain drop-shadow-2xl shrink-0 -mb-3" draggable={false} />
            <div className="flex-1 bg-black/85 border-2 border-orange-400/70 rounded-sm px-4 md:px-6 py-3 md:py-4 mb-2">
              <p className="text-orange-300 text-[11px] font-black tracking-widest mb-1">{en ? 'SORA' : '空'} · {step + 1}/{TUTORIAL.length}</p>
              <p className="text-white text-sm md:text-lg font-bold leading-snug">{tut.jp}</p>
              <p className="text-white/60 text-xs md:text-sm mt-1">{en ? tut.en : tut.zh}</p>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => {
                    audioManager.playSfx('page');
                    if (step < TUTORIAL.length - 1) setStep(s => s + 1);
                    else { setPracticeLine(null); practiceShots.current = 0; setPhase('practice'); }
                  }}
                  className="bg-orange-400 hover:bg-orange-300 text-black px-5 py-1.5 text-xs font-black tracking-widest transform -skew-x-12"
                >
                  <span className="block transform skew-x-12">{step < TUTORIAL.length - 1 ? (en ? 'Next ▶' : '下一句 ▶') : (en ? 'Practice shot ▶' : '练一球 ▶')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 竖屏手机：舞台下面再放一个大按钮，拇指够得着 */}
      {(phase === 'play' || phase === 'practice') && (
        <button onClick={shoot} className="md:hidden mt-4 w-40 h-14 rounded-full bg-orange-500 active:bg-orange-400 text-black font-black text-lg shadow-xl">
          {en ? 'SHOOT' : '投！'}
        </button>
      )}

      <style>{`
        @keyframes bbPop { 0% { transform: translate(-50%, 8px) scale(0.6); opacity: 0; } 25% { transform: translate(-50%, 0) scale(1.1); opacity: 1; } 100% { transform: translate(-50%, -12px) scale(1); opacity: 0; } }
        @keyframes bbPop2 { 0% { opacity: 0; transform: translateY(4px); } 10% { opacity: 1; transform: none; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes bbZoom { 0% { transform: scale(0.5); opacity: 0; } 35% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>,
    document.body
  );
};

export default BasketballModal;
