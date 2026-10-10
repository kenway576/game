import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Language, PracticeTier } from '../types';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🕹️ ビートクラッシュ —— 游戏厅里的节奏机台，跟 Maki 比
//
// 四条轨道，音符落到底下那条线的时候按对应的键（D F J K，或者直接点轨道）。
// 时间用的是 Web Audio 的时钟，不是画面帧——音乐和判定不会随着掉帧漂移。
// 伴奏（鼓、贝斯、琶音）是现场合成的，每一档一首不同的曲子，不依赖任何音频文件。
//
//   PERFECT ±60ms   GOOD ±115ms   更差的算 MISS
//   连击越多，分数加成越高（每 10 连 +5%，最多 +50%）
//
// Maki 跟你同时在打：她的每个音符是提前掷好的结果，
// 所以分差是真的在一点点拉开或追回来，不是最后随便报个数。
// ---------------------------------------------------------

export interface RhythmResult {
  mine: number;
  hers: number;
  won: boolean;
  notes: number;
  perfect: number;
  good: number;
  miss: number;
  maxCombo: number;
  rank: 'S' | 'A' | 'B' | 'C';
  acc: number;         // 0..1
}

interface Props {
  language: Language;
  tier?: PracticeTier;
  introSeen: Record<string, boolean>;
  onSeenIntro: (key: string) => void;
  onFinish: (r: RhythmResult) => void;
  onCancel: () => void;
}

const BG = '/images/backgrounds/bg_sannomiya_shopping_arcade.webp';
const MAKI = (n: string) => `/images/characters/maki/${n}.webp`;

const LANES = 4;
const KEYS = [['d', 'arrowleft'], ['f', 'arrowdown'], ['j', 'arrowup'], ['k', 'arrowright']];
const KEY_LABEL = ['D', 'F', 'J', 'K'];
const LANE_COLOR = ['#22d3ee', '#e879f9', '#fde047', '#4ade80'];
const PERFECT_WIN = 0.06;
const GOOD_WIN = 0.115;
const MISS_WIN = 0.15;

// ---- 每一档一首歌 ----
interface Song {
  title: string; bpm: number; bars: number; density: number; doubles: number; speedSec: number;
  chords: { root: number; minor: boolean }[];
  lane: number[];   // 轨道音高（MIDI）
}
const SONGS: Record<PracticeTier, Song> = {
  1: { title: 'NEON ARCADE', bpm: 104, bars: 24, density: 0.45, doubles: 0.0, speedSec: 1.9,
       chords: [{ root: 57, minor: true }, { root: 53, minor: false }, { root: 60, minor: false }, { root: 55, minor: false }], lane: [72, 74, 76, 79] },
  2: { title: 'CENTER GAI RUSH', bpm: 126, bars: 28, density: 0.6, doubles: 0.06, speedSec: 1.6,
       chords: [{ root: 62, minor: true }, { root: 58, minor: false }, { root: 65, minor: false }, { root: 60, minor: false }], lane: [74, 77, 79, 81] },
  3: { title: 'LAST COIN LOVER', bpm: 148, bars: 32, density: 0.72, doubles: 0.12, speedSec: 1.35,
       chords: [{ root: 64, minor: true }, { root: 60, minor: false }, { root: 67, minor: false }, { root: 62, minor: false }], lane: [76, 79, 81, 83] }
};
const LEAD_BARS = 2;

interface Note { id: number; lane: number; t: number; hit: boolean; judged: 'perfect' | 'good' | 'miss' | null; }

// 小型确定性随机数，同一档位每次谱面一样（玩家能练熟），Maki 的发挥则每次不同
const rng = (seed: number) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

const buildChart = (tier: PracticeTier): Note[] => {
  const song = SONGS[tier];
  const rand = rng(tier * 7919 + 13);
  const beat = 60 / song.bpm;
  const notes: Note[] = [];
  let last = -1; let id = 0;
  for (let bar = LEAD_BARS; bar < song.bars - 1; bar++) {
    const ramp = bar < LEAD_BARS + 4 ? 0.7 : bar > song.bars - 6 ? 1.1 : 1;
    for (let slot = 0; slot < 8; slot++) {
      const strong = slot % 2 === 0;
      const p = (strong ? song.density + 0.25 : song.density - 0.1) * ramp;
      if (rand() > p) continue;
      const t = (bar * 4 + slot / 2) * beat;
      let lane = Math.floor(rand() * LANES);
      if (lane === last) lane = (lane + 1 + Math.floor(rand() * (LANES - 1))) % LANES;
      last = lane;
      notes.push({ id: id++, lane, t, hit: false, judged: null });
      if (strong && slot % 4 === 0 && rand() < song.doubles) {
        let l2 = (lane + 2) % LANES;
        notes.push({ id: id++, lane: l2, t, hit: false, judged: null });
      }
    }
  }
  return notes.sort((a, b) => a.t - b.t);
};

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Maki 每个音符的发挥：提前掷好
const MAKI_ODDS: Record<PracticeTier, [number, number]> = { 1: [0.35, 0.35], 2: [0.5, 0.3], 3: [0.62, 0.28] };

interface Say { jp: string; zh: string; en: string }
const L = {
  start: { jp: 'ほな、いくで！負けたらジュースおごりやで〜？', zh: '那就来吧！输了要请喝饮料哦～？', en: 'Alright, here we go! Loser buys the juice, yeah?' },
  youLead: { jp: 'えっ、ウチより上手いん？ちょっとマジになるで！', zh: '诶，你比我厉害？我要认真了哦！', en: 'Huh, you are ahead? Now I am getting serious!' },
  sheLead: { jp: 'ほらほら、センパイ、遅れてるで〜♪', zh: '喂喂，前辈，掉队了哦～♪', en: 'Hey hey, Senpai, you are falling behind~♪' },
  late: { jp: 'ラスト！ここで逆転できるか見ものやな！', zh: '最后一段了！看看你能不能逆转！', en: 'Final stretch! Let\'s see if you can turn it around!' },
  win: { jp: 'うそやろ……ウチが負けた……？もっかい！もっかい勝負や！', zh: '不会吧……我输了……？再来一次！再来一次！', en: 'No way... I lost...? Again! One more round!' },
  lose: { jp: 'へへん、ウチの勝ちやな！センパイ、ジュース、ごちそうさん♪', zh: '嘿嘿，我赢啦！前辈，饮料就多谢款待啦♪', en: 'Heh, I win! Thanks for the juice, Senpai♪' },
  draw: { jp: '同点やて！？……こんなん、もう一回やるしかないやん。', zh: '平局！？……这种情况只能再来一局了吧。', en: 'A tie!? ...We have to go again after that.' }
};

type Phase = 'intro' | 'ready' | 'countdown' | 'play' | 'done';

const INTRO: { face: string; jp: string; zh: string; en: string; demo?: 'keys' | 'judge' }[] = [
  { face: 'smug', jp: 'センパイ、ビートクラッシュ知らんの？ゲーセンの定番やで！', zh: '前辈，居然不知道节奏机台“Beat Crash”？这可是游戏厅的经典啊！', en: 'Senpai, you do not know Beat Crash? It is an arcade staple!' },
  { face: 'happy', jp: '光る四本のレーンに、音符が上から落ちてくる。下の線に重なった瞬間に、そのレーンのキーを押す！', zh: '四条发光的轨道，音符从上面落下来。在它碰到底下那条线的瞬间，按对应轨道的键！', en: 'Notes fall down four glowing lanes. Press the lane\'s key at the exact moment a note touches the line!', demo: 'keys' },
  { face: 'neutral', jp: 'キーは D・F・J・K。スマホなら、レーンを直接タップや。', zh: '按键是 D、F、J、K。手机的话，直接点轨道。', en: 'Keys are D, F, J and K. On a phone, just tap the lane.' },
  { face: 'smug', jp: 'ピッタリなら PERFECT、ちょっとズレたら GOOD、外したら MISS。連続で当てると、点数にボーナスがつくで！', zh: '正好就是 PERFECT，稍微偏一点是 GOOD，没按到是 MISS。连续命中分数还有加成！', en: 'Spot on is PERFECT, a little off is GOOD, a whiff is MISS. Chain hits for a score bonus!', demo: 'judge' },
  { face: 'laugh', jp: 'ウチも同じ曲を一緒に叩く。最後に点数が高い方の勝ちや。手加減はせえへんからな〜！', zh: '我会和你同时打同一首曲子。最后分数高的赢。我可不会手下留情哦～！', en: 'I play the same song right next to you. Higher score wins. No going easy on you!' }
];

const RhythmArcadeModal: React.FC<Props> = ({ language, tier = 1, introSeen, onSeenIntro, onFinish, onCancel }) => {
  const en = language === 'en';
  const song = SONGS[tier];
  const beat = 60 / song.bpm;

  const [phase, setPhase] = useState<Phase>(introSeen['minigame_intro_rhythm'] ? 'ready' : 'intro');
  const [introStep, setIntroStep] = useState(0);
  const [count, setCount] = useState(3);
  const [hud, setHud] = useState({ mine: 0, hers: 0, combo: 0, judge: '', jkey: 0, progress: 0 });
  const [face, setFace] = useState('smug');
  const [say, setSay] = useState<Say | null>(L.start);
  const [result, setResult] = useState<RhythmResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const outRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const startAtRef = useRef(0);
  // 浏览器若不让 AudioContext 出声（没有用户手势、被系统静音策略挡住），就退回到系统时钟计时——
  // 游戏照样能玩，只是没有伴奏。
  const perfStartRef = useRef(0);
  const audioClockRef = useRef(true);
  const phaseRef = useRef<Phase>(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const chart = useMemo(() => buildChart(tier), [tier]);
  const notes = useRef<Note[]>(chart.map(n => ({ ...n })));
  const g = useRef({ mine: 0, combo: 0, maxCombo: 0, perfect: 0, good: 0, miss: 0, flash: [0, 0, 0, 0], judge: '', judgeAt: 0, jcolor: '#fff', fx: [] as { x: number; y: number; t: number; c: string }[], lead: 0 });

  // Maki 的发挥：提前掷好，按时间累积
  const maki = useMemo(() => {
    const [pf, gd] = MAKI_ODDS[tier];
    let score = 0; let combo = 0;
    const seen = new Set<number>();
    const out: { t: number; score: number }[] = [];
    chart.forEach(n => {
      const key = Math.round(n.t * 1000);
      // 同一时刻的双押，她当成一个音符（手只有两只，她嘴硬也要讲道理）
      if (seen.has(key) && Math.random() < 0.5) return;
      seen.add(key);
      const r = Math.random();
      if (r < pf) { combo += 1; score += 1000 * (1 + Math.min(0.5, Math.floor(combo / 10) * 0.05)); }
      else if (r < pf + gd) { combo += 1; score += 600 * (1 + Math.min(0.5, Math.floor(combo / 10) * 0.05)); }
      else combo = 0;
      out.push({ t: n.t, score: Math.round(score) });
    });
    return out;
  }, [chart, tier]);
  const makiScoreAt = (t: number) => {
    let s = 0;
    for (let i = 0; i < maki.length && maki[i].t <= t; i++) s = maki[i].score;
    return s;
  };

  // ---------------- 音频 ----------------
  const vol = () => {
    const s = audioManager.getSnapshot();
    return s.muted ? 0 : Math.max(0, Math.min(1, s.master * Math.max(s.sfx, 0.35)));
  };

  const initAudio = () => {
    if (ctxRef.current) return;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const out = ctx.createGain();
    out.gain.value = vol() * 0.8;
    out.connect(ctx.destination);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    ctxRef.current = ctx; outRef.current = out; noiseRef.current = buf;
  };

  const tone = (t: number, f: number, dur: number, type: OscillatorType, gain: number, slideTo?: number, lp?: number) => {
    const ctx = ctxRef.current, out = outRef.current; if (!ctx || !out) return;
    const o = ctx.createOscillator(); const gn = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime(gain, t + 0.005);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node: AudioNode = o;
    if (lp) { const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = lp; o.connect(f2); node = f2; }
    node.connect(gn); gn.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
  };
  const noise = (t: number, dur: number, gain: number, hp: number) => {
    const ctx = ctxRef.current, out = outRef.current, nb = noiseRef.current; if (!ctx || !out || !nb) return;
    const s = ctx.createBufferSource(); s.buffer = nb;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
    const gn = ctx.createGain();
    gn.gain.setValueAtTime(gain, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(gn); gn.connect(out);
    s.start(t); s.stop(t + dur + 0.02);
  };
  const kick = (t: number) => tone(t, 150, 0.16, 'sine', 0.9, 42);
  const snare = (t: number) => { noise(t, 0.14, 0.45, 1400); tone(t, 200, 0.08, 'triangle', 0.25, 120); };
  const hat = (t: number, open: boolean) => noise(t, open ? 0.09 : 0.03, open ? 0.14 : 0.1, 7000);

  // 预先排好整首曲子的伴奏事件（相对歌曲时间，秒）
  const backing = useMemo(() => {
    const ev: { t: number; fn: (at: number) => void }[] = [];
    for (let bar = 0; bar < song.bars; bar++) {
      const ch = song.chords[bar % song.chords.length];
      const triad = ch.minor ? [0, 3, 7] : [0, 4, 7];
      const b0 = bar * 4 * beat;
      for (let b = 0; b < 4; b++) {
        const t = b0 + b * beat;
        if (b % 2 === 0 || tier === 3) ev.push({ t, fn: kick });
        if (b % 2 === 1) ev.push({ t, fn: snare });
      }
      for (let s = 0; s < 8; s++) {
        const t = b0 + s * beat / 2;
        ev.push({ t, fn: at => hat(at, s % 2 === 1) });
        if (bar >= LEAD_BARS) {
          const m = ch.root + 12 + triad[(s * (tier + 1)) % 3] + (s === 7 ? 12 : 0);
          ev.push({ t, fn: at => tone(at, midi(m), beat / 2.4, 'triangle', 0.1) });
        }
      }
      // 贝斯：每拍一下，低八度
      if (bar >= 1) for (let b = 0; b < 4; b++) {
        const t = b0 + b * beat;
        ev.push({ t, fn: at => tone(at, midi(ch.root - 24 + (b === 3 ? 7 : 0)), beat * 0.9, 'sawtooth', 0.22, undefined, 380) });
      }
    }
    return ev.sort((a, b) => a.t - b.t);
  }, [tier]);

  // ---------------- 判定 ----------------
  const popJudge = (txt: string, color: string) => { g.current.judge = txt; g.current.judgeAt = performance.now(); g.current.jcolor = color; };
  const addScore = (kind: 'perfect' | 'good') => {
    const s = g.current;
    s.combo += 1; s.maxCombo = Math.max(s.maxCombo, s.combo);
    s.mine += Math.round((kind === 'perfect' ? 1000 : 600) * (1 + Math.min(0.5, Math.floor(s.combo / 10) * 0.05)));
    if (kind === 'perfect') s.perfect += 1; else s.good += 1;
  };
  const breakCombo = () => { g.current.combo = 0; g.current.miss += 1; popJudge('MISS', '#f87171'); };

  const songTime = () => {
    const ctx = ctxRef.current;
    if (audioClockRef.current && ctx) return ctx.currentTime - startAtRef.current;
    return (performance.now() - perfStartRef.current) / 1000;
  };

  const press = (lane: number) => {
    if (phaseRef.current !== 'play') return;
    const ctx = ctxRef.current; if (!ctx) return;
    const t = songTime();
    g.current.flash[lane] = performance.now();
    let best: Note | null = null; let bd = 9;
    for (const n of notes.current) {
      if (n.lane !== lane || n.hit) continue;
      const d = Math.abs(n.t - t);
      if (d < bd) { bd = d; best = n; }
      if (n.t - t > MISS_WIN) break;
    }
    // 空按：只发出声音，不扣连击（街机的规矩：乱按不罚，但也不加分）
    tone(ctx.currentTime, midi(song.lane[lane]), 0.12, 'square', 0.12, undefined, 2600);
    if (!best || bd > MISS_WIN) return;
    best.hit = true;
    const el = canvasRef.current;
    const w = el ? el.clientWidth : 0;
    const fx = { x: laneX(lane, w), y: 0, t: performance.now(), c: LANE_COLOR[lane] };
    if (bd <= PERFECT_WIN) { best.judged = 'perfect'; addScore('perfect'); popJudge('PERFECT', '#fde047'); }
    else if (bd <= GOOD_WIN) { best.judged = 'good'; addScore('good'); popJudge('GOOD', '#67e8f9'); }
    else { best.judged = 'miss'; breakCombo(); }
    g.current.fx.push(fx);
    syncHud();
  };

  const syncHud = () => {
    const t = Math.max(0, songTime());
    const s = g.current;
    setHud({ mine: s.mine, hers: makiScoreAt(t), combo: s.combo, judge: s.judge, jkey: s.judgeAt, progress: Math.min(1, t / (song.bars * 4 * beat)) });
  };

  const laneX = (lane: number, w: number) => {
    const pw = Math.min(w, 460); const x0 = (w - pw) / 2;
    return x0 + pw / LANES * (lane + 0.5);
  };

  // 自己合成伴奏，所以把场景 BGM 压低；离开时放回来，并关掉自己的 AudioContext
  useEffect(() => {
    audioManager.duckBgm();
    return () => {
      audioManager.restoreBgm();
      const c = ctxRef.current;
      ctxRef.current = null;
      c?.close().catch(() => {});
    };
  }, []);

  // ---------------- 输入 ----------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      const lane = KEYS.findIndex(a => a.includes(k));
      if (lane >= 0) { e.preventDefault(); press(lane); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointer = (e: React.PointerEvent) => {
    const el = canvasRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const w = r.width; const pw = Math.min(w, 460); const x0 = (w - pw) / 2;
    const x = e.clientX - r.left - x0;
    if (x < 0 || x > pw) return;
    press(Math.min(LANES - 1, Math.floor(x / (pw / LANES))));
  };

  // ---------------- 开始 / 主循环 ----------------
  const startGame = () => {
    audioManager.playSfx('confirm');
    initAudio();
    const ctx = ctxRef.current;
    if (ctx && ctx.state === 'suspended') void ctx.resume();
    notes.current = chart.map(n => ({ ...n }));
    g.current = { mine: 0, combo: 0, maxCombo: 0, perfect: 0, good: 0, miss: 0, flash: [0, 0, 0, 0], judge: '', judgeAt: 0, jcolor: '#fff', fx: [], lead: 0 };
    setHud({ mine: 0, hers: 0, combo: 0, judge: '', jkey: 0, progress: 0 });
    setFace('smug'); setSay(L.start);
    setCount(3); setPhase('countdown');
  };

  useEffect(() => {
    if (phase !== 'countdown') return;
    let n = 3;
    const t = window.setInterval(() => {
      n -= 1;
      if (n <= 0) { window.clearInterval(t); beginSong(); }
      else setCount(n);
    }, 700);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const beginSong = () => {
    const ctx = ctxRef.current;
    audioClockRef.current = !!ctx && ctx.state === 'running';
    perfStartRef.current = performance.now() + 350;
    if (ctx) startAtRef.current = ctx.currentTime + 0.35;
    setPhase('play');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    const ctx = ctxRef.current;
    let idx = 0;
    let raf = 0;
    let lastHud = 0;
    let lastLead = 0;
    const endT = (song.bars - 1) * 4 * beat + 1.2;

    // 伴奏调度：提前 0.25 秒排好
    const sched = window.setInterval(() => {
      if (!ctx || !audioClockRef.current) return;
      const ahead = ctx.currentTime - startAtRef.current + 0.25;
      while (idx < backing.length && backing[idx].t < ahead) {
        backing[idx].fn(Math.max(ctx.currentTime, startAtRef.current + backing[idx].t));
        idx++;
      }
    }, 25);

    const draw = () => {
      const cv = canvasRef.current; const wrap = wrapRef.current;
      if (cv && wrap) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = wrap.clientWidth, h = wrap.clientHeight;
        if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
        const c = cv.getContext('2d');
        if (c) { c.setTransform(dpr, 0, 0, dpr, 0, 0); render(c, w, h, songTime()); }
      }
    };

    const loop = () => {
      const t = songTime();
      // 过时没按的音符：自动 MISS
      for (const n of notes.current) {
        if (!n.hit && t - n.t > MISS_WIN) { n.hit = true; n.judged = 'miss'; breakCombo(); }
      }
      draw();
      const now = performance.now();
      if (now - lastHud > 120) { lastHud = now; syncHud(); }
      // Maki 嘴上不饶人：领先 / 落后换了就说一句
      if (now - lastLead > 6000) {
        const mine = g.current.mine; const hers = makiScoreAt(Math.max(0, t));
        const lead = mine > hers + 1500 ? 1 : hers > mine + 1500 ? -1 : 0;
        if (lead !== g.current.lead && lead !== 0) {
          g.current.lead = lead; lastLead = now;
          if (lead > 0) { setFace('angry'); setSay(L.youLead); } else { setFace('smug'); setSay(L.sheLead); }
        } else if (t > endT - 12 && lastLead !== -1 && now - lastLead > 3000) {
          lastLead = -1; setFace('laugh'); setSay(L.late);
        }
      }
      if (t > endT) { finish(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.clearInterval(sched); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finish = () => {
    const s = g.current;
    const total = notes.current.length;
    const hers = maki.length ? maki[maki.length - 1].score : 0;
    const acc = total ? (s.perfect + 0.6 * s.good) / total : 0;
    const rank: RhythmResult['rank'] = acc >= 0.92 ? 'S' : acc >= 0.8 ? 'A' : acc >= 0.6 ? 'B' : 'C';
    const r: RhythmResult = { mine: s.mine, hers, won: s.mine > hers, notes: total, perfect: s.perfect, good: s.good, miss: total - s.perfect - s.good, maxCombo: s.maxCombo, rank, acc };
    if (r.won) { setFace('pout'); setSay(L.win); } else if (r.mine === r.hers) { setFace('shy'); setSay(L.draw); } else { setFace('laugh'); setSay(L.lose); }
    audioManager.playSfx(r.won ? 'levelup_affection' : 'quiz_wrong');
    setResult(r); setPhase('done');
  };

  // ---------------- 画布 ----------------
  const render = (c: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    c.clearRect(0, 0, w, h);
    const pw = Math.min(w, 460); const x0 = (w - pw) / 2; const lw = pw / LANES;
    const hitY = h * 0.84;
    const speed = hitY / song.speedSec;
    const now = performance.now();

    // 轨道底
    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(10,6,30,0.55)'); grad.addColorStop(1, 'rgba(40,10,60,0.8)');
    c.fillStyle = grad; c.fillRect(x0, 0, pw, h);
    for (let i = 0; i < LANES; i++) {
      const fl = Math.max(0, 1 - (now - g.current.flash[i]) / 160);
      if (fl > 0) {
        const lg = c.createLinearGradient(0, hitY, 0, 0);
        lg.addColorStop(0, LANE_COLOR[i] + 'aa'); lg.addColorStop(1, LANE_COLOR[i] + '00');
        c.globalAlpha = fl * 0.7; c.fillStyle = lg; c.fillRect(x0 + i * lw, 0, lw, hitY); c.globalAlpha = 1;
      }
      c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x0 + i * lw, 0); c.lineTo(x0 + i * lw, h); c.stroke();
    }
    c.beginPath(); c.moveTo(x0 + pw, 0); c.lineTo(x0 + pw, h); c.stroke();

    // 拍线
    const first = Math.max(0, Math.floor((t - 0.2) / beat));
    for (let b = first; b < first + Math.ceil(song.speedSec / beat) + 3; b++) {
      const y = hitY - (b * beat - t) * speed;
      if (y < 0 || y > h) continue;
      c.strokeStyle = b % 4 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)';
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + pw, y); c.stroke();
    }

    // 判定线
    c.shadowColor = '#f0abfc'; c.shadowBlur = 16;
    c.strokeStyle = '#f5d0fe'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x0, hitY); c.lineTo(x0 + pw, hitY); c.stroke();
    c.shadowBlur = 0;

    // 键帽
    for (let i = 0; i < LANES; i++) {
      const down = now - g.current.flash[i] < 110;
      c.fillStyle = down ? LANE_COLOR[i] : 'rgba(0,0,0,0.65)';
      c.strokeStyle = LANE_COLOR[i]; c.lineWidth = 2;
      const kx = x0 + i * lw + 5, ky = hitY + 12, kw = lw - 10, kh = Math.min(46, h - hitY - 18);
      c.beginPath(); c.roundRect(kx, ky, kw, kh, 8); c.fill(); c.stroke();
      c.fillStyle = down ? '#000' : LANE_COLOR[i];
      c.font = '900 20px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(KEY_LABEL[i], kx + kw / 2, ky + kh / 2);
    }

    // 音符
    for (const n of notes.current) {
      const y = hitY - (n.t - t) * speed;
      if (n.hit && n.judged !== 'miss') continue;
      if (y < -30 || y > h + 30) continue;
      c.globalAlpha = n.judged === 'miss' ? 0.25 : 1;
      c.fillStyle = LANE_COLOR[n.lane]; c.shadowColor = LANE_COLOR[n.lane]; c.shadowBlur = 12;
      c.beginPath(); c.roundRect(x0 + n.lane * lw + 6, y - 11, lw - 12, 22, 7); c.fill();
      c.shadowBlur = 0;
      c.fillStyle = 'rgba(255,255,255,0.7)';
      c.beginPath(); c.roundRect(x0 + n.lane * lw + 10, y - 7, lw - 20, 6, 3); c.fill();
      c.globalAlpha = 1;
    }

    // 命中火花
    g.current.fx = g.current.fx.filter(f => now - f.t < 380);
    for (const f of g.current.fx) {
      const k = (now - f.t) / 380;
      c.globalAlpha = 1 - k; c.strokeStyle = f.c; c.lineWidth = 3;
      c.beginPath(); c.arc(f.x, hitY, 10 + k * 34, 0, Math.PI * 2); c.stroke();
      c.globalAlpha = 1;
    }
  };

  // ---------------- 画面 ----------------
  const stage = (children: React.ReactNode) => createPortal(
    <div className="fixed inset-0 z-[400] bg-black text-white select-none overflow-hidden">
      <img src={BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" draggable={false} />
      <div className="absolute inset-0 pointer-events-none mix-blend-color bg-gradient-to-b from-fuchsia-700/40 via-indigo-800/30 to-cyan-700/30" />
      <div className="absolute inset-0 pointer-events-none border-[8px] md:border-[14px] border-fuchsia-500/60 shadow-[inset_0_0_50px_rgba(217,70,239,0.6)]" />
      <div className="relative w-full h-full">{children}</div>
    </div>,
    document.body
  );

  const sayBubble = (side: 'left' | 'right') => say && (
    <div className={`bg-black/75 border border-fuchsia-300/40 rounded px-3 py-2 max-w-[240px] ${side === 'right' ? 'text-left' : ''}`}>
      <p className="text-fuchsia-300 text-[10px] font-black tracking-widest">MAKI</p>
      <p className="text-white text-xs md:text-sm leading-snug">{say.jp}</p>
      <p className="text-white/50 text-[10px] md:text-xs mt-0.5">{en ? say.en : say.zh}</p>
    </div>
  );

  if (phase === 'intro') {
    const card = INTRO[introStep];
    return stage(
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-5">
        <img src={MAKI(card.face)} alt="" className="h-52 md:h-72 object-contain drop-shadow-2xl" draggable={false} />
        <div className="bg-black/80 border border-fuchsia-300/50 max-w-xl w-full px-6 py-5">
          <p className="text-fuchsia-300 text-[10px] font-black tracking-widest mb-2">{en ? 'HOW TO PLAY · BEAT CRASH' : '玩法说明 · BEAT CRASH'} · {introStep + 1}/{INTRO.length}</p>
          <p className="text-white text-base md:text-lg leading-relaxed">{card.jp}</p>
          <p className="text-white/55 text-sm mt-2">{en ? card.en : card.zh}</p>
          {card.demo === 'keys' && (
            <div className="mt-4 relative h-28 bg-black/60 border border-white/15 overflow-hidden">
              <style>{`@keyframes bcfall{0%{transform:translateY(-30px);opacity:0}10%{opacity:1}100%{transform:translateY(100px);opacity:1}}`}</style>
              <div className="absolute inset-0 grid grid-cols-4">
                {LANE_COLOR.map((col, i) => (
                  <div key={i} className="relative border-l border-white/10">
                    <div className="absolute left-2 right-2 h-4 rounded" style={{ background: col, boxShadow: `0 0 10px ${col}`, animation: `bcfall 1.8s linear ${i * 0.35}s infinite` }} />
                    <div className="absolute bottom-1 left-1 right-1 text-center text-xs font-black rounded border" style={{ color: col, borderColor: col }}>{KEY_LABEL[i]}</div>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 right-0 bottom-8 h-0.5 bg-fuchsia-200 shadow-[0_0_8px_#f0abfc]" />
            </div>
          )}
          {card.demo === 'judge' && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black">
              <div className="bg-yellow-300/15 border border-yellow-300/50 text-yellow-300 p-2">PERFECT<div className="text-white/50 font-bold">±60ms · 1000</div></div>
              <div className="bg-cyan-300/15 border border-cyan-300/50 text-cyan-200 p-2">GOOD<div className="text-white/50 font-bold">±115ms · 600</div></div>
              <div className="bg-rose-400/15 border border-rose-400/50 text-rose-300 p-2">MISS<div className="text-white/50 font-bold">{en ? 'combo breaks' : '连击中断'}</div></div>
            </div>
          )}
          <button
            onClick={() => {
              audioManager.playSfx('page');
              if (introStep < INTRO.length - 1) setIntroStep(introStep + 1);
              else { onSeenIntro('minigame_intro_rhythm'); setPhase('ready'); }
            }}
            className="mt-4 w-full bg-fuchsia-400 hover:bg-fuchsia-300 text-black font-black py-3 tracking-widest text-sm"
          >
            {introStep < INTRO.length - 1 ? (en ? 'NEXT ▶' : '下一页 ▶') : (en ? 'GOT IT' : '明白了')}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'ready') {
    return stage(
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-5 text-center">
        <p className="text-cyan-300 text-[11px] font-black tracking-[0.4em]">★ BEAT CRASH ★</p>
        <h2 className="text-4xl md:text-6xl font-black italic text-white drop-shadow-[0_0_18px_rgba(232,121,249,0.8)]">{song.title}</h2>
        <p className="text-white/60 text-sm">{song.bpm} BPM · {chart.length} NOTES · {['', en ? 'BEGINNER' : '初级', en ? 'INTERMEDIATE' : '中级', en ? 'ADVANCED' : '上级'][tier]}</p>
        <div className="flex items-end gap-3">
          <img src={MAKI('smug')} alt="" className="h-44 md:h-60 object-contain drop-shadow-2xl" draggable={false} />
          {sayBubble('right')}
        </div>
        <div className="flex gap-2">{KEY_LABEL.map((k, i) => <span key={k} className="w-12 h-12 flex items-center justify-center font-black text-xl border-2 rounded-lg" style={{ color: LANE_COLOR[i], borderColor: LANE_COLOR[i] }}>{k}</span>)}</div>
        <p className="text-white/45 text-xs">{en ? 'Or tap the lanes. Best with sound on.' : '或者直接点轨道。开着声音玩更好。'}</p>
        <div className="flex gap-3">
          <button onClick={() => { audioManager.playSfx('click'); setIntroStep(0); setPhase('intro'); }} className="px-5 py-3 border border-white/25 text-white/70 hover:text-white text-xs font-black tracking-widest">{en ? 'RULES' : '规则'}</button>
          <button onClick={startGame} className="bg-fuchsia-400 hover:bg-fuchsia-300 text-black px-10 py-3 text-sm font-black tracking-widest transform -skew-x-12"><span className="block transform skew-x-12">{en ? 'START (¥100)' : '开始（¥100）'}</span></button>
          <button onClick={() => { audioManager.playSfx('modal_close'); onCancel(); }} className="px-5 py-3 border border-white/25 text-white/70 hover:text-white text-xs font-black tracking-widest">{en ? 'LEAVE' : '离开'}</button>
        </div>
      </div>
    );
  }

  if (phase === 'done' && result) {
    const r = result;
    return stage(
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-5 text-center overflow-y-auto">
        <div className="flex items-end gap-3">
          <img src={MAKI(face)} alt="" className="h-44 md:h-60 object-contain drop-shadow-2xl" draggable={false} />
          {sayBubble('right')}
        </div>
        <p className="text-cyan-300 text-[11px] font-black tracking-[0.3em]">{r.won ? (en ? 'YOU WIN' : '你赢了') : r.mine === r.hers ? (en ? 'DRAW' : '平局') : (en ? 'MAKI WINS' : 'MAKI 赢了')}</p>
        <div className="flex items-center gap-8">
          <div><div className="text-4xl font-black text-fuchsia-300 tabular-nums">{r.mine.toLocaleString()}</div><div className="text-[10px] text-white/50 tracking-widest">{en ? 'YOU' : '你'}</div></div>
          <div className="text-6xl font-black italic text-yellow-300">{r.rank}</div>
          <div><div className="text-4xl font-black text-cyan-300 tabular-nums">{r.hers.toLocaleString()}</div><div className="text-[10px] text-white/50 tracking-widest">MAKI</div></div>
        </div>
        <div className="flex gap-5 text-xs font-black">
          <span className="text-yellow-300">PERFECT {r.perfect}</span><span className="text-cyan-200">GOOD {r.good}</span><span className="text-rose-300">MISS {r.miss}</span><span className="text-white/70">MAX COMBO {r.maxCombo}</span>
        </div>
        <button onClick={() => { audioManager.playSfx('confirm'); onFinish(r); }} className="mt-2 bg-fuchsia-400 hover:bg-fuchsia-300 text-black px-10 py-3 text-xs font-black tracking-widest transform -skew-x-12"><span className="block transform skew-x-12">{en ? 'Done' : '收工'}</span></button>
      </div>
    );
  }

  // countdown / play
  const lead = hud.mine - hud.hers;
  const total = Math.max(1, hud.mine + hud.hers);
  const mult = 1 + Math.min(0.5, Math.floor(hud.combo / 10) * 0.05);
  return stage(
    <div className="w-full h-full flex flex-col">
      {/* 顶栏：分数对比 */}
      <div className="px-3 pt-3 md:px-6 md:pt-5">
        <div className="flex items-center justify-between text-[10px] md:text-xs font-black tracking-widest">
          <span className="text-fuchsia-300">YOU <span className="text-white text-base md:text-2xl tabular-nums ml-1">{hud.mine.toLocaleString()}</span></span>
          <span className="text-white/40">{song.title}</span>
          <span className="text-cyan-300"><span className="text-white text-base md:text-2xl tabular-nums mr-1">{hud.hers.toLocaleString()}</span> MAKI</span>
        </div>
        <div className="h-2 bg-white/10 mt-1 flex overflow-hidden rounded-sm">
          <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-300 transition-all duration-300" style={{ width: `${(hud.mine / total) * 100}%` }} />
          <div className="bg-gradient-to-l from-cyan-500 to-cyan-300 transition-all duration-300" style={{ width: `${(hud.hers / total) * 100}%` }} />
        </div>
        <div className="h-0.5 bg-white/10 mt-1"><div className="h-full bg-white/60" style={{ width: `${hud.progress * 100}%` }} /></div>
      </div>

      <div className="flex-1 relative min-h-0">
        {/* Maki */}
        <div className="absolute right-1 md:right-6 bottom-0 flex flex-col items-end gap-1 pointer-events-none z-10 opacity-95">
          <div className="hidden sm:block">{sayBubble('right')}</div>
          <img src={MAKI(face)} alt="" className="h-36 sm:h-56 md:h-[55vh] object-contain drop-shadow-2xl" draggable={false} />
        </div>
        {/* 玩家侧提示 */}
        <div className="absolute left-2 md:left-8 top-4 z-10 pointer-events-none">
          <div className="text-[10px] font-black tracking-widest text-white/50">COMBO</div>
          <div className={`text-5xl md:text-7xl font-black italic tabular-nums ${hud.combo >= 10 ? 'text-yellow-300 drop-shadow-[0_0_14px_rgba(253,224,71,0.9)]' : 'text-white/80'}`}>{hud.combo}</div>
          {hud.combo >= 10 && <div className="text-xs font-black text-yellow-300">×{mult.toFixed(2)}</div>}
          <div className={`mt-2 text-[11px] font-black tracking-widest ${lead >= 0 ? 'text-fuchsia-300' : 'text-cyan-300'}`}>{lead >= 0 ? '▲' : '▼'} {Math.abs(lead).toLocaleString()}</div>
        </div>

        <div ref={wrapRef} className="absolute inset-0 touch-none" onPointerDown={onPointer}>
          <canvas ref={canvasRef} className="w-full h-full block" />
          {/* 判定文字 */}
          {hud.judge && phase === 'play' && (
            <div key={hud.jkey} className="absolute left-1/2 top-[56%] -translate-x-1/2 text-3xl md:text-5xl font-black italic pointer-events-none"
                 style={{ color: hud.judge === 'PERFECT' ? '#fde047' : hud.judge === 'GOOD' ? '#67e8f9' : '#f87171', textShadow: '0 0 14px currentColor', opacity: 0.95 }}>
              {hud.judge}
            </div>
          )}
          {phase === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span key={count} className="text-8xl md:text-9xl font-black italic text-white drop-shadow-[0_0_24px_rgba(232,121,249,0.9)]">{count}</span>
            </div>
          )}
        </div>
        <button onClick={() => { ctxRef.current?.close().catch(() => {}); onCancel(); }} className="absolute left-2 bottom-2 z-20 text-white/35 hover:text-white/80 text-[10px] font-black tracking-widest">{en ? 'QUIT' : '放弃'}</button>
      </div>
    </div>
  );
};

export default RhythmArcadeModal;
