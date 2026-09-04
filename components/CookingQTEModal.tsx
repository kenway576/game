import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, RecipeDef, StoryEffect } from '../types';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🍳 烹饪 QTE 交互系统 (Cooking QTE Minigame)
//
// 核心原则：
// 1. 拒绝廉价 emoji —— 全部采用游戏原画立绘与日系动漫手绘 UI（砧板、铸铁锅、砂锅热气、真实料理 WebP）
// 2. 每次进入都是随机的 —— 动态洗牌 QTE 阶段（节奏切配 / 黄金控火 / 沸腾揭盖 / 关键点睛），目标区间与摆动速度随机扰动
// 3. 结果决断 —— 触发成功（完美/良好）才能做成美味料理并获得完整属性；翻车失败则产生焦糊料理且无法获得主属性
// ---------------------------------------------------------

export type CookingResult = 'perfect' | 'success' | 'failed';

interface Props {
  recipe: RecipeDef;
  language: Language;
  firstTime: boolean;
  onFinish: (result: CookingResult) => void;
  onCancel: () => void;
}

type StageType = 'chop' | 'heat' | 'boil' | 'finish';

interface StageConfig {
  type: StageType;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  bgImg: string;
}

// 简单音频合成器（利用 Web Audio API 实时合成砧板切菜、热锅滋滋、金光开盖特效音）
class KitchenAudioSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 刀切砧板的清脆木质打击声
  chop() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // 降级使用 audioManager
      audioManager.playSfx('click');
    }
  }

  // 油温滋滋声（白噪声爆发）
  sizzle() {
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3500;
      filter.Q.value = 3;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // ignore
    }
  }

  // 完美命中金属清音 (叮~)
  ding() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, t); // C6
      osc.frequency.setValueAtTime(2093, t + 0.04); // C7
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    } catch {
      audioManager.playSfx('confirm');
    }
  }
}

const synth = new KitchenAudioSynth();

export const CookingQTEModal: React.FC<Props> = ({
  recipe,
  language,
  firstTime,
  onFinish,
  onCancel
}) => {
  const en = language === 'en';

  // -------------------------------------------------------------
  // 1. 难度 + 随机编排
  //
  // 以前每道菜的流程是写死的：切 → 火候（或沸腾）→ 也许收尾，
  // 顺序永远一样，游标速度、黄金区宽度这些也全是常量。
  // 结果是打过三次之后每道菜都变成肌肉记忆，没有第四次的必要。
  //
  // 现在两件事都随机：
  //   ① 难度 —— 由这道菜给的属性总量和材料数推出来（好东西不好做），
  //      再加一点当次抖动，同一道菜两次也不一样。
  //   ② 编排 —— 从四种关卡里抽 2~4 关，顺序打乱，而且同一关
  //      可能出现两次（切两轮、两次收尾）。
  // 参数（速度、窗口宽度、刀数）全部由难度算出来，并且逐关递增：
  // 越往后越紧，最后一关最难——这才有"撑到最后"的感觉。
  // -------------------------------------------------------------
  const [diff] = useState(() => {
    const weight = (recipe.effects || []).reduce((n, e) => n + Math.abs(e.amount || 0), 0);
    const parts = (recipe.needs?.length || 0) + (recipe.anyFish || 0) + (recipe.needFish?.length || 0);
    // 0（最容易）~ 1（最难）。抖动 ±0.12，所以同一道菜每次手感都不同。
    const base = Math.min(1, (weight / 14) * 0.6 + (parts / 4) * 0.4);
    return Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.24));
  });

  // 逐关递增：第 n 关的实际难度 = 基础难度 + 关卡序号带来的加压
  const stageDiff = (idx: number, total: number) =>
    Math.min(1, diff + (total > 1 ? (idx / (total - 1)) * 0.28 : 0));

  const [stages] = useState<StageConfig[]>(() => {
    const id = recipe.id;
    const POOL: Record<StageType, StageConfig> = {
      chop: {
        type: 'chop',
        titleZh: '刀工切配 · 节奏下刀',
        titleEn: 'Prep & Knife Work',
        descZh: '在准星游走至食材焦点时精准落刀！',
        descEn: 'Strike when the blade indicator aligns with the target slice!',
        bgImg: '/images/ui/cooking_cutting_board.webp'
      },
      heat: {
        type: 'heat',
        titleZh: '热锅煎炒 · 黄金火候',
        titleEn: 'Heat & Sizzle Control',
        descZh: '长按加热踏板，把锅温压在黄金区间里——而且这口灶的火不稳。',
        descEn: 'Hold the heat inside the golden band. This hob does not hold steady.',
        bgImg: '/images/ui/cooking_frying_pan.webp'
      },
      boil: {
        type: 'boil',
        titleZh: '文火慢煨 · 沸腾揭盖',
        titleEn: 'Simmer & Lid Timing',
        descZh: '观察气孔与白雾，在蒸汽达到峰顶的瞬间关火掀盖！',
        descEn: 'Watch the steam and lift the lid at the peak!',
        bgImg: '/images/ui/cooking_pot_steam.webp'
      },
      finish: {
        type: 'finish',
        titleZh: '收汁颠锅 · 调味点睛',
        titleEn: 'Seasoning & Perfect Toss',
        descZh: '收缩环与圆环重合的刹那按下，完成最后一击！',
        descEn: 'Press the instant the shrinking ring matches the core!',
        bgImg: '/images/ui/cooking_frying_pan.webp'
      }
    };

    // 这道菜"必须有"的那一关：汤和焖饭一定要掀盖，其余一定要下锅。
    const signature: StageType = (id === 'dish_misoshiru' || id === 'dish_taimeshi') ? 'boil' : 'heat';
    // 备选池：不切东西的菜（葵花籽）不抽切配
    const optional: StageType[] = id === 'dish_himawari_seeds'
      ? ['finish', signature]
      : ['chop', 'finish', 'chop', signature];

    // 抽几关：难度越高越长（2~4）
    const count = 2 + (Math.random() < 0.35 + diff * 0.45 ? 1 : 0) + (Math.random() < diff * 0.5 ? 1 : 0);

    const picked: StageType[] = [signature];
    const bag = [...optional];
    while (picked.length < count && bag.length) {
      picked.push(bag.splice(Math.floor(Math.random() * bag.length), 1)[0]);
    }
    // 顺序打乱，但"收尾"这一关如果抽到了，永远放最后——它就是收尾。
    const tail = picked.filter(t => t === 'finish');
    const body = picked.filter(t => t !== 'finish');
    for (let i = body.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [body[i], body[j]] = [body[j], body[i]];
    }
    return [...body, ...tail].map(t => POOL[t]);
  });

  // -------------------------------------------------------------
  // 状态机
  // -------------------------------------------------------------
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]); // 每一关得分 (0..100)
  const [isDone, setIsDone] = useState(false);
  const [finalResult, setFinalResult] = useState<CookingResult>('success');
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string; key: number } | null>(null);

  const showFeedback = (text: string, color: string) => {
    setFeedbackText({ text, color, key: Date.now() });
  };

  // -------------------------------------------------------------
  // QTE 1: 切配节奏 (Chop)
  // -------------------------------------------------------------
  const [chopPos, setChopPos] = useState(0); // 0..100
  const [chopDir, setChopDir] = useState(1);
  // 刀数按难度给 3~5 刀，位置也不再是"三段各自小范围抖动"，
  // 而是整条线上随机撒点再排序——所以会出现两刀挨得很近的情况。
  const [chopTargets] = useState(() => {
    const n = 3 + (diff > 0.4 ? 1 : 0) + (diff > 0.72 ? 1 : 0);
    const pts: number[] = [];
    let guard = 0;
    while (pts.length < n && guard++ < 200) {
      const v = Math.round(12 + Math.random() * 76);
      if (pts.every(p => Math.abs(p - v) > 8)) pts.push(v);
    }
    return pts.sort((a2, b2) => a2 - b2);
  });
  const [chopIndex, setChopIndex] = useState(0);
  const [chopHits, setChopHits] = useState<number[]>([]);

  // -------------------------------------------------------------
  // QTE 2: 火候维持 (Heat)
  // -------------------------------------------------------------
  const [heatVal, setHeatVal] = useState(30); // 0..100
  const [heatProgress, setHeatProgress] = useState(0); // 0..100%
  const isHoldingHeat = useRef(false);
  // 黄金火候区间：难度越高越窄（26% → 12%），起点也随机。
  const [goldenZone0] = useState(() => {
    const w = Math.round(26 - diff * 14);
    const start = 28 + Math.random() * (66 - w);
    return { min: Math.round(start), max: Math.round(start) + w };
  });
  // 🔥 这口灶的火不稳：黄金区间会缓慢漂移。
  // 难度越高漂得越快，低难度下几乎察觉不到。
  //
  // 漂移量存在 ref 里，state 只是为了让进度条跟着画。
  // 一开始两份都放 state，结果 goldenZone 进了那个 RAF effect 的依赖数组——
  // 区间每帧都在动，于是 effect 每帧重建一次，dt 被重置成 0，
  // 整个小游戏的推进速度直接垮掉。循环只读 ref，就不会重建。
  const driftRef = useRef(0);
  const [zoneDrift, setZoneDrift] = useState(0);
  const driftDir = useRef(Math.random() < 0.5 ? -1 : 1);
  const zoneAt = (d: number) => ({
    min: Math.max(0, Math.round(goldenZone0.min + d)),
    max: Math.min(100, Math.round(goldenZone0.max + d))
  });
  const goldenZone = zoneAt(zoneDrift);

  // -------------------------------------------------------------
  // QTE 3: 沸腾揭盖 (Boil)
  // -------------------------------------------------------------
  const [boilPos, setBoilPos] = useState(0); // 0..100
  // 掀盖窗口：难度越高越窄，位置也更靠后（越接近扑锅）。
  const [boilZone] = useState(() => {
    const w = Math.round(17 - diff * 8);
    const min = 58 + Math.random() * 20 + diff * 6;
    return { min: Math.round(min), max: Math.round(min) + w };
  });
  // 🫧 假沸：中途气泡会窜一下，看着像到了峰值，其实还早。
  // 抽到的时候才有，所以不能靠背时间点。
  const [fakeBoilAt] = useState(() => (Math.random() < 0.3 + diff * 0.4 ? 30 + Math.random() * 20 : -1));
  const [fakeBoilShown, setFakeBoilShown] = useState(false);

  // -------------------------------------------------------------
  // QTE 4: 收尾收缩环 (Finish)
  // -------------------------------------------------------------
  const [ringScale, setRingScale] = useState(2.8); // 3.0 -> 1.0

  const activeStage = stages[currentStageIdx];

  // -------------------------------------------------------------
  // 阶段主循环 (RAF)
  // -------------------------------------------------------------
  // 这一关实际用的那几个数。全部从难度推出来，所以同一道菜
  // 每次进来手感都不一样，而且越到后面越紧。
  const curDiff = stageDiff(currentStageIdx, stages.length);
  const chopSpeed = 62 + curDiff * 78;              // 游标来回的速度
  const heatRise = 55 + curDiff * 45;               // 长按升温
  const heatFall = 32 + curDiff * 40;               // 松手降温
  const heatFill = 34 - curDiff * 16;               // 停在黄金区里的进度增速（越难越慢）
  const boilSpeed = 24 + curDiff * 26;              // 沸腾推进
  const ringSpeed = 0.85 + curDiff * 1.1;           // 收缩环
  const chopWindow = 6.5 - curDiff * 3.4;           // 完美判定半宽
  const ringWindow = 0.22 - curDiff * 0.12;

  useEffect(() => {
    if (isDone) return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (activeStage?.type === 'chop') {
        // 游标来回摆动。速度由难度和第几关一起决定，越往后越快。
        setChopPos(p => {
          const speed = chopSpeed;
          let next = p + chopDir * speed * dt;
          if (next >= 100) {
            next = 100;
            setChopDir(-1);
          } else if (next <= 0) {
            next = 0;
            setChopDir(1);
          }
          return next;
        });
      } else if (activeStage?.type === 'heat') {
        // 火候控制：长按升温，松开降温
        // 火候区间漂移：难度越高漂得越快，碰到边就折返。
        // 真值走 ref，state 只是拿去画条。
        {
          const speed = 2 + curDiff * 12;
          let next = driftRef.current + driftDir.current * speed * dt;
          const lo = -goldenZone0.min, hi = 100 - goldenZone0.max;
          if (next > hi) { next = hi; driftDir.current = -1; }
          if (next < lo) { next = lo; driftDir.current = 1; }
          driftRef.current = next;
          setZoneDrift(next);
        }
        setHeatVal(h => {
          const delta = isHoldingHeat.current ? heatRise * dt : -heatFall * dt;
          return Math.max(0, Math.min(100, h + delta));
        });

        // 检验是否在黄金温区
        setHeatVal(curH => {
          const z = zoneAt(driftRef.current);
          if (curH >= z.min && curH <= z.max) {
            synth.sizzle();
            setHeatProgress(p => {
              const next = p + heatFill * dt;
              if (next >= 100) {
                // 完成火候阶段。难度高的灶更难压住，压住了给的分也更高。
                finishStage(Math.round(78 + curDiff * 22));
                return 100;
              }
              return next;
            });
          }
          return curH;
        });
      } else if (activeStage?.type === 'boil') {
        // 沸腾进度稳步向前
        setBoilPos(p => {
          const next = p + boilSpeed * dt;
          // 假沸：窜一下又落回去，看着像峰值。只提示，不改判定。
          if (fakeBoilAt > 0 && !fakeBoilShown && p < fakeBoilAt && next >= fakeBoilAt) {
            setFakeBoilShown(true);
            synth.sizzle();
            showFeedback(en ? 'a surge...' : '气泡窜了一下……', '#94a3b8');
          }
          if (next >= 100) {
            // 溢锅超时没掀盖
            showFeedback(en ? 'BOILED OVER!' : '扑锅溢出了！', '#ef4444');
            audioManager.playSfx('error');
            finishStage(15);
            return 100;
          }
          return next;
        });
      } else if (activeStage?.type === 'finish') {
        // 收缩环缩小
        setRingScale(s => {
          const next = s - ringSpeed * dt;
          if (next <= 0.8) {
            // 超时未按
            showFeedback(en ? 'TOO LATE!' : '错失良机！', '#ef4444');
            audioManager.playSfx('error');
            finishStage(20);
            return 0.8;
          }
          return next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeStage, chopDir, isDone, goldenZone0.min, goldenZone0.max, curDiff, fakeBoilShown]);

  // 完成当前小节，推进到下一节或结算
  const finishStage = (score: number) => {
    const nextScores = [...scores, score];
    setScores(nextScores);

    if (currentStageIdx + 1 < stages.length) {
      // 进入下一个阶段
      setCurrentStageIdx(i => i + 1);
      // 重置火候状态
      isHoldingHeat.current = false;
      setHeatProgress(0);
      setHeatVal(30);
      setBoilPos(0);
      setRingScale(2.8);
      setZoneDrift(0);
      driftRef.current = 0;
      setFakeBoilShown(false);
      driftDir.current = Math.random() < 0.5 ? -1 : 1;
    } else {
      // 全部阶段完成，计算综合评级
      const totalAvg = nextScores.reduce((a, b) => a + b, 0) / nextScores.length;
      let res: CookingResult = 'success';
      // 难度高的菜及格线放低一点：不然好料理永远做不成，
      // 玩家学到的只会是"别碰那道菜"。
      const perfectAt = 78 - diff * 10;
      const passAt = 48 - diff * 10;
      if (totalAvg >= perfectAt) {
        res = 'perfect';
        audioManager.playSfx('quiz_correct');
      } else if (totalAvg >= passAt) {
        res = 'success';
        audioManager.playSfx('confirm');
      } else {
        res = 'failed';
        audioManager.playSfx('error');
      }
      setFinalResult(res);
      setIsDone(true);
    }
  };

  // -------------------------------------------------------------
  // 操作交互处理
  // -------------------------------------------------------------
  const handleAction = useCallback(() => {
    if (isDone) return;
    const stage = stages[currentStageIdx];
    if (!stage) return;

    if (stage.type === 'chop') {
      synth.chop();
      const target = chopTargets[chopIndex];
      const diff = Math.abs(chopPos - target);

      let pts = 0;
      if (diff <= chopWindow) {
        pts = 100;
        showFeedback(en ? 'PERFECT CUT!' : '极准神刀！', '#fbbf24');
        synth.ding();
      } else if (diff <= chopWindow * 2.2) {
        pts = 75;
        showFeedback(en ? 'GREAT!' : '干脆利落！', '#34d399');
      } else {
        pts = 25;
        showFeedback(en ? 'OFF TARGET!' : '偏了一点！', '#94a3b8');
      }

      const nextHits = [...chopHits, pts];
      setChopHits(nextHits);

      if (chopIndex + 1 < chopTargets.length) {
        setChopIndex(i => i + 1);
      } else {
        // 切菜完成
        const avg = nextHits.reduce((a, b) => a + b, 0) / nextHits.length;
        finishStage(avg);
      }
    } else if (stage.type === 'boil') {
      // 沸腾揭盖
      const targetCenter = (boilZone.min + boilZone.max) / 2;
      const diff = Math.abs(boilPos - targetCenter);
      const halfZone = (boilZone.max - boilZone.min) / 2;

      if (diff <= halfZone * 0.45) {
        showFeedback(en ? 'PERFECT TIMING!' : '神仙火候！揭盖喷香！', '#fbbf24');
        synth.ding();
        finishStage(100);
      } else if (diff <= halfZone) {
        showFeedback(en ? 'GREAT!' : '时机刚刚好！', '#34d399');
        audioManager.playSfx('confirm');
        finishStage(75);
      } else {
        showFeedback(en ? 'RAW / COLD!' : '火候尚未透底！', '#ef4444');
        audioManager.playSfx('error');
        finishStage(20);
      }
    } else if (stage.type === 'finish') {
      // 调味颠锅收尾
      const diff = Math.abs(ringScale - 1.0);
      if (diff <= ringWindow) {
        showFeedback(en ? 'PERFECT TOSS!' : '绝妙颠锅！完美入盘！', '#fbbf24');
        synth.ding();
        finishStage(100);
      } else if (diff <= ringWindow * 2.3) {
        showFeedback(en ? 'NICE FINISH!' : '稳稳落盘！', '#34d399');
        audioManager.playSfx('confirm');
        finishStage(75);
      } else {
        showFeedback(en ? 'MISSED!' : '稍显仓促！', '#ef4444');
        audioManager.playSfx('error');
        finishStage(30);
      }
    }
  }, [chopIndex, chopPos, chopTargets, chopHits, boilPos, boilZone, ringScale, currentStageIdx, stages, isDone, en, chopWindow, ringWindow]);

  // 键盘快捷键监听（空格键 / 回车键）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (activeStage?.type === 'heat') {
          isHoldingHeat.current = true;
        } else {
          handleAction();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (activeStage?.type === 'heat') {
          isHoldingHeat.current = false;
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [activeStage, handleAction]);

  const statName = (k: StoryEffect['stat']) => en
    ? k
    : ({ knowledge: '知识', guts: '勇气', kindness: '体贴', charm: '魅力', proficiency: '灵巧' } as const)[k];

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md select-none flex items-center justify-center p-3 md:p-6">
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col">
        
        {/* P5 风格顶部标题栏 */}
        <div className="bg-gradient-to-r from-red-700 via-amber-600 to-zinc-900 px-5 py-3 flex items-center justify-between border-b border-amber-500/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/30 bg-black/40 p-0.5 shadow">
              <img
                src={`/images/items/${recipe.id}.webp`}
                alt={recipe.nameZh}
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black text-amber-300 text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase border border-amber-500/50">
                  COOKING // QTE
                </span>
                <span className="text-white font-black text-base drop-shadow tracking-wide">
                  {en ? recipe.nameEn : recipe.nameZh}
                </span>
              </div>
              <div className="text-[11px] font-mono text-amber-200/70">
                {recipe.nameJp} · {recipe.reading}
              </div>
            </div>
          </div>

          {!isDone && (
            <button
              onClick={() => { audioManager.playSfx('click'); onCancel(); }}
              className="px-3 py-1 bg-black/60 hover:bg-red-600 text-white/80 hover:text-white rounded text-xs font-bold transition-colors border border-white/20"
            >
              {en ? 'Give Up' : '放弃下厨'}
            </button>
          )}
        </div>

        {/* 主体游戏画布区域 */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[55vh] overflow-hidden bg-zinc-900 flex items-center justify-center">
          
          {/* 真实手绘场景大图背景 */}
          <img
            src={activeStage?.bgImg || '/images/ui/cooking_cutting_board.webp'}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/35 backdrop-brightness-95" />

          {/* 实时反馈浮动大字 */}
          {feedbackText && (
            <div
              key={feedbackText.key}
              className="absolute z-40 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-black italic tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] animate-bounce"
              style={{ color: feedbackText.color }}
            >
              {feedbackText.text}
            </div>
          )}

          {/* ==================== 阶段 1: 切配节奏 ==================== */}
          {!isDone && activeStage?.type === 'chop' && (
            <div className="relative z-10 w-4/5 flex flex-col items-center gap-6">
              <div className="bg-black/80 border border-amber-400/40 rounded-xl p-4 w-full backdrop-blur-sm shadow-2xl text-center">
                <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">
                  {en ? `SLICE ${chopIndex + 1} OF ${chopTargets.length}` : `第 ${chopIndex + 1} 刀（共 ${chopTargets.length} 刀）`}
                </div>
                <div className="text-sm font-medium text-white/90">
                  {en ? activeStage.descEn : activeStage.descZh}
                </div>

                {/* 游标长条轨道 */}
                <div className="relative w-full h-8 bg-zinc-950/90 rounded-full mt-5 overflow-hidden border-2 border-white/25 shadow-inner">
                  {/* 目标绿区 */}
                  {chopTargets.map((pos, idx) => (
                    <div
                      key={idx}
                      className={`absolute top-0 bottom-0 transition-all ${
                        idx === chopIndex ? 'bg-amber-400/50 border-x-2 border-amber-300' : 'bg-white/10'
                      }`}
                      style={{
                        left: `${pos - 6}%`,
                        width: '12%'
                      }}
                    />
                  ))}

                  {/* 游走的刀刃准星 */}
                  <div
                    className="absolute top-0 bottom-0 w-3 bg-red-500 shadow-[0_0_15px_#ef4444] rounded -ml-1.5 transition-transform"
                    style={{ left: `${chopPos}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-white/40 mt-2 px-1">
                  <span>◀ SLOW</span>
                  <span className="text-amber-300 font-bold">{en ? 'SPACE / TAP TO CHOP' : '按空格 或 点击下方按钮落刀'}</span>
                  <span>FAST ▶</span>
                </div>
              </div>

              {/* 动作交互大按钮 */}
              <button
                onClick={handleAction}
                className="w-48 py-3.5 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-black font-black text-lg uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transform active:scale-95 transition-all border border-amber-200"
              >
                {en ? '🔪 CHOP!' : '🔪 落刀！'}
              </button>
            </div>
          )}

          {/* ==================== 阶段 2: 黄金火候 ==================== */}
          {!isDone && activeStage?.type === 'heat' && (
            <div className="relative z-10 w-4/5 flex flex-col items-center gap-6">
              <div className="bg-black/80 border border-amber-400/40 rounded-xl p-4 w-full backdrop-blur-sm shadow-2xl text-center">
                <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">
                  {en ? 'HEAT MOMENTUM CONTROL' : '火候温度保持'}
                </div>
                <div className="text-sm font-medium text-white/90">
                  {en ? activeStage.descEn : activeStage.descZh}
                </div>

                {/* 温度表 */}
                <div className="relative w-full h-8 bg-zinc-950/90 rounded-full mt-5 overflow-hidden border-2 border-white/25 shadow-inner">
                  {/* 黄金火候区间 */}
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-500/45 border-x-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                    style={{
                      left: `${goldenZone.min}%`,
                      width: `${goldenZone.max - goldenZone.min}%`
                    }}
                  />

                  {/* 实时温度游标 */}
                  <div
                    className="absolute top-0 bottom-0 w-3 bg-amber-400 shadow-[0_0_15px_#f59e0b] rounded -ml-1.5"
                    style={{ left: `${heatVal}%` }}
                  />
                </div>

                {/* 烹饪熟成进度 */}
                <div className="mt-4 flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-bold text-white/70">
                    <span>{en ? 'Cooking Progress' : '熟成火候累积'}</span>
                    <span className="font-mono text-amber-300">{Math.round(heatProgress)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-75"
                      style={{ width: `${heatProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 加热按键 (支持长按与触摸) */}
              <button
                onMouseDown={() => { isHoldingHeat.current = true; }}
                onMouseUp={() => { isHoldingHeat.current = false; }}
                onTouchStart={() => { isHoldingHeat.current = true; }}
                onTouchEnd={() => { isHoldingHeat.current = false; }}
                className="w-56 py-3.5 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 hover:brightness-110 text-white font-black text-lg uppercase tracking-widest rounded-xl shadow-[0_0_35px_rgba(239,68,68,0.6)] transform active:scale-95 transition-all border border-orange-300"
              >
                {en ? '🔥 HOLD HEAT' : '🔥 按住升温控火'}
              </button>
            </div>
          )}

          {/* ==================== 阶段 3: 沸腾揭盖 ==================== */}
          {!isDone && activeStage?.type === 'boil' && (
            <div className="relative z-10 w-4/5 flex flex-col items-center gap-6">
              <div className="bg-black/80 border border-amber-400/40 rounded-xl p-4 w-full backdrop-blur-sm shadow-2xl text-center">
                <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">
                  {en ? 'BOIL & LIFT LID TIMING' : '文火慢煮 · 沸腾决断'}
                </div>
                <div className="text-sm font-medium text-white/90">
                  {en ? activeStage.descEn : activeStage.descZh}
                </div>

                {/* 沸腾进度 */}
                <div className="relative w-full h-8 bg-zinc-950/90 rounded-full mt-5 overflow-hidden border-2 border-white/25 shadow-inner">
                  {/* 目标掀盖区间 */}
                  <div
                    className="absolute top-0 bottom-0 bg-amber-400/50 border-x-2 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
                    style={{
                      left: `${boilZone.min}%`,
                      width: `${boilZone.max - boilZone.min}%`
                    }}
                  />

                  {/* 沸腾气泡指针 */}
                  <div
                    className="absolute top-0 bottom-0 w-3 bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded -ml-1.5"
                    style={{ left: `${boilPos}%` }}
                  />
                </div>

                <div className="text-[11px] font-mono text-amber-200/70 mt-2">
                  {en ? 'PRESS AT THE GOLDEN STEAM MOMENT' : '在指针进入金色高光时掀盖关火！'}
                </div>
              </div>

              <button
                onClick={handleAction}
                className="w-52 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-lg uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.6)] transform active:scale-95 transition-all border border-amber-200"
              >
                {en ? '💨 LIFT LID!' : '💨 关火掀盖！'}
              </button>
            </div>
          )}

          {/* ==================== 阶段 4: 颠锅收尾 (Ring) ==================== */}
          {!isDone && activeStage?.type === 'finish' && (
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* 目标圆环 */}
                <div className="w-24 h-24 rounded-full border-4 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center">
                  <span className="text-amber-300 text-xs font-black tracking-widest">
                    {en ? 'TOSS' : '出锅'}
                  </span>
                </div>

                {/* 动态收缩环 */}
                <div
                  className="absolute w-24 h-24 rounded-full border-2 border-cyan-400 pointer-events-none shadow-[0_0_15px_#22d3ee]"
                  style={{
                    transform: `scale(${ringScale})`,
                    opacity: Math.max(0.2, 1 - (ringScale - 1) * 0.4)
                  }}
                />
              </div>

              <button
                onClick={handleAction}
                className="px-8 py-3 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black font-black text-base uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95 transition-transform"
              >
                {en ? '✨ SEASON & FLIP!' : '✨ 调味颠锅！'}
              </button>
            </div>
          )}

          {/* ==================== 最终料理出锅结算 (无廉价 Emoji) ==================== */}
          {isDone && (
            <div className="relative z-20 w-full h-full p-6 bg-zinc-950/95 flex flex-col items-center justify-center text-center animate-fadeIn">
              
              {/* 料理大图展示 */}
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 p-2 shadow-2xl mb-3 flex items-center justify-center"
                   style={{
                     borderColor: finalResult === 'failed' ? '#ef4444' : '#f59e0b',
                     backgroundColor: finalResult === 'failed' ? '#1c1917' : '#0c0a09'
                   }}>
                <img
                  src={finalResult === 'failed' ? '/images/items/dish_burnt.webp' : `/images/items/${recipe.id}.webp`}
                  alt={recipe.nameZh}
                  className={`w-full h-full object-contain ${
                    finalResult === 'failed' ? 'brightness-75 contrast-125' : 'drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  }`}
                  onError={(e) => {
                    if (finalResult !== 'failed') e.currentTarget.src = '/images/items/dish_burnt.webp';
                  }}
                />
              </div>

              {/* 评级徽章 */}
              <div className="mb-2">
                {finalResult === 'perfect' && (
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-sm md:text-base px-4 py-1 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] uppercase tracking-widest">
                    ★ {en ? 'SUPERB DELUXE · MASTERPIECE' : '绝妙火候 · 极品料理'}
                  </span>
                )}
                {finalResult === 'success' && (
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm md:text-base px-4 py-1 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)] uppercase tracking-widest">
                    ☆ {en ? 'DELICIOUS SUCCESS' : '美味完成 · 色香味俱全'}
                  </span>
                )}
                {finalResult === 'failed' && (
                  <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-sm md:text-base px-4 py-1 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] uppercase tracking-widest">
                    ✕ {en ? 'BURNT & OVERCOOKED' : '火候失控 · 烧焦了'}
                  </span>
                )}
              </div>

              {/* 结算文案 */}
              <p className="max-w-md text-xs md:text-sm text-zinc-300 leading-relaxed mb-4">
                {finalResult === 'perfect' && (
                  en
                    ? 'Flawless heat and knife work! The aroma fills the whole kitchen, releasing the peak natural flavor of the ingredients.'
                    : '每一处火候与刀工皆至臻境！热气袅袅升腾，食材的本味在唇齿间全然绽放！'
                )}
                {finalResult === 'success' && (
                  en
                    ? 'A steaming, fragrant plate of comforting home cooking. Just what a hardworking student needs.'
                    : '香气扑鼻的暖心家常菜顺利出锅！恰到好处的滋味抚平了一整天的求学疲惫。'
                )}
                {finalResult === 'failed' && (
                  en
                    ? 'The heat went out of control... You salvaged a charred lump. But facing failure takes courage.'
                    : '锅底冒出了一缕呛人的黑烟……食材变成了焦黑的硬块。虽然没能做成，但至少吸取了下厨的教训。'
                )}
              </p>

              {/* 属性变动预览 */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {finalResult !== 'failed' ? (
                  <>
                    {recipe.effects.map(e => (
                      <span key={e.stat} className="px-3 py-1 bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-xs font-bold rounded">
                        {statName(e.stat)} +{e.amount}
                      </span>
                    ))}
                    {finalResult === 'perfect' && (
                      <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-bold rounded shadow">
                        {en ? 'Mastery · Proficiency +1' : '极品火候 · 灵巧 +1'}
                      </span>
                    )}
                    {firstTime && (
                      <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 text-xs font-bold rounded shadow">
                        {en ? 'First Time · Knowledge +1' : '初次研习 · 知识 +1'}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="px-3 py-1 bg-zinc-800 border border-red-500/40 text-rose-300 text-xs font-bold rounded">
                    {en ? 'Burnt Consolation · Guts +1' : '越挫越勇 · 勇气 +1'}
                  </span>
                )}
              </div>

              {/* 确认完成按键 */}
              <button
                onClick={() => {
                  audioManager.playSfx('confirm');
                  onFinish(finalResult);
                }}
                className="px-10 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transform active:scale-95 transition-all"
              >
                {finalResult === 'failed' ? (en ? 'Toss it out' : '收拾灶台') : (en ? 'Bon Appétit / Eat' : '趁热品尝！')}
              </button>
            </div>
          )}
        </div>

        {/* 底部小提示条 */}
        <div className="bg-zinc-950 px-5 py-2.5 flex items-center justify-between border-t border-white/10 text-[11px] text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{en ? 'Step' : '阶段'} {currentStageIdx + 1} / {stages.length}：{en ? activeStage?.titleEn : activeStage?.titleZh}</span>
          </div>
          <div className="font-mono">
            {en ? 'KEYBOARD: SPACE / ENTER' : '键盘提示：空格键 / 回车均可操作'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CookingQTEModal;
