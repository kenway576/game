import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Language, PracticeTier } from '../types';
import { audioManager } from '../services/audioManager';
import { RHYTHM_SONGS, RhythmSong } from '../data/rhythmCharts';

// ---------------------------------------------------------
// 🕹️ ビートクラッシュ —— 游戏厅里的节奏机台，跟 Maki 比
//
// 四条轨道，音符落到底下那条线的时候按对应的键（D F J K，或者直接点轨道）。
// 曲子就是游戏自己的 BGM：谱面是 scripts/rhythm/make_charts.py 用 librosa 从音频里扒的
// （拍点 + 四个频段的起音：低音在左、高音在右），所以按下去的时候，正好是鼓和旋律落下来的地方。
// 时间用的是 Web Audio 的时钟（音频播到哪儿就是哪儿），不跟画面帧走，掉帧也不会漂。
//
//   PERFECT ±60ms   GOOD ±115ms   更差的算 MISS
//   连击越多，分数加成越高（每 10 连 +5%，最多 +50%）
//
// 难度跟着练习等级（tier 1/2/3 = 三份谱面），歌自己挑。
// Maki 跟你同时在打：她的每个音符是提前掷好的结果，分差是真的在一点点拉开或追回来。
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

const ART = '/images/minigames/';
const BG = ART + 'beatcrash_bg.webp';
const LOGO = ART + 'beatcrash_logo.webp';
const jacketOf = (s: RhythmSong) => `${ART}jacket_${s.id.replace(/_o_clock/, '_oclock')}.webp`;
// 放学后的游戏厅：真希穿校服
const MAKI = (n: string) => `/images/characters/maki/school_${n}.webp`;

const LANES = 4;
const KEYS = [['d', 'arrowleft'], ['f', 'arrowdown'], ['j', 'arrowup'], ['k', 'arrowright']];
const KEY_LABEL = ['D', 'F', 'J', 'K'];
const LANE_COLOR = ['#22d3ee', '#e879f9', '#fde047', '#4ade80'];
const PERFECT_WIN = 0.06;
const GOOD_WIN = 0.115;
const MISS_WIN = 0.15;
// 音符从出现到落线要几秒（难度越高越快）
const SPEED: Record<PracticeTier, number> = { 1: 1.9, 2: 1.55, 3: 1.25 };
const TIER_NAME = (t: PracticeTier, en: boolean) => [en ? 'BEGINNER' : '初级', en ? 'INTERMEDIATE' : '中级', en ? 'ADVANCED' : '上级'][t - 1];

interface Note { id: number; lane: number; t: number; hit: boolean; judged: 'perfect' | 'good' | 'miss' | null; }
const chartOf = (s: RhythmSong, tier: PracticeTier): Note[] =>
  (s.charts[String(tier)] || []).map(([t, lane], id) => ({ id, lane, t, hit: false, judged: null }));

// 解码过的歌留着，换歌、重开不用再下一遍
const bufferCache = new Map<string, Promise<AudioBuffer>>();
const loadSong = (ctx: AudioContext, s: RhythmSong) => {
  let p = bufferCache.get(s.file);
  if (!p) {
    p = fetch(`/audio/${s.file}`).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.arrayBuffer(); })
      .then(b => ctx.decodeAudioData(b));
    p.catch(() => bufferCache.delete(s.file));
    bufferCache.set(s.file, p);
  }
  return p;
};

// Maki 每个音符的发挥：提前掷好
const MAKI_ODDS: Record<PracticeTier, [number, number]> = { 1: [0.35, 0.35], 2: [0.5, 0.3], 3: [0.62, 0.28] };

interface Say { jp: string; zh: string; en: string }
const L = {
  pick: { jp: 'どれにする？ウチはどれでも勝つけどな〜。', zh: '选哪首？反正哪首我都能赢～。', en: 'Which one? Not that it matters, I win them all~.' },
  start: { jp: 'ほな、いくで！負けたらジュースおごりやで〜？', zh: '那就来吧！输了要请喝饮料哦～？', en: 'Alright, here we go! Loser buys the juice, yeah?' },
  youLead: { jp: 'えっ、ウチより上手いん？ちょっとマジになるで！', zh: '诶，你比我厉害？我要认真了哦！', en: 'Huh, you are ahead? Now I am getting serious!' },
  sheLead: { jp: 'ほらほら、センパイ、遅れてるで〜♪', zh: '喂喂，前辈，掉队了哦～♪', en: 'Hey hey, Senpai, you are falling behind~♪' },
  late: { jp: 'ラスト！ここで逆転できるか見ものやな！', zh: '最后一段了！看看你能不能逆转！', en: 'Final stretch! Let\'s see if you can turn it around!' },
  win: { jp: 'うそやろ……ウチが負けた……？もっかい！もっかい勝負や！', zh: '不会吧……我输了……？再来一次！再来一次！', en: 'No way... I lost...? Again! One more round!' },
  lose: { jp: 'へへん、ウチの勝ちやな！センパイ、ジュース、ごちそうさん♪', zh: '嘿嘿，我赢啦！前辈，饮料就多谢款待啦♪', en: 'Heh, I win! Thanks for the juice, Senpai♪' },
  draw: { jp: '同点やて！？……こんなん、もう一回やるしかないやん。', zh: '平局！？……这种情况只能再来一局了吧。', en: 'A tie!? ...We have to go again after that.' },
  noAudio: { jp: 'あれ、音出えへんな……ま、リズムは目で見たらええねん！', zh: '咦，没声音……算了，节奏用眼睛看就行！', en: 'Huh, no sound... eh, just follow the notes with your eyes!' }
};

type Phase = 'intro' | 'select' | 'loading' | 'countdown' | 'play' | 'done';

const INTRO: { face: string; jp: string; zh: string; en: string; demo?: 'keys' | 'judge' }[] = [
  { face: 'smug', jp: 'センパイ、ビートクラッシュ知らんの？ゲーセンの定番やで！', zh: '前辈，居然不知道节奏机台“Beat Crash”？这可是游戏厅的经典啊！', en: 'Senpai, you do not know Beat Crash? It is an arcade staple!' },
  { face: 'happy', jp: '光る四本のレーンに、音符が上から落ちてくる。下の線に重なった瞬間に、そのレーンのキーを押す！', zh: '四条发光的轨道，音符从上面落下来。在它碰到底下那条线的瞬间，按对应轨道的键！', en: 'Notes fall down four glowing lanes. Press the lane\'s key at the exact moment a note touches the line!', demo: 'keys' },
  { face: 'neutral', jp: 'キーは D・F・J・K。スマホなら、レーンを直接タップや。音符は曲のドラムとメロディに合わせて降ってくるで。', zh: '按键是 D、F、J、K。手机的话，直接点轨道。音符是跟着歌里的鼓点和旋律落下来的。', en: 'Keys are D, F, J and K. On a phone, just tap the lane. The notes follow the drums and melody of the song.' },
  { face: 'smug', jp: 'ピッタリなら PERFECT、ちょっとズレたら GOOD、外したら MISS。連続で当てると、点数にボーナスがつくで！', zh: '正好就是 PERFECT，稍微偏一点是 GOOD，没按到是 MISS。连续命中分数还有加成！', en: 'Spot on is PERFECT, a little off is GOOD, a whiff is MISS. Chain hits for a score bonus!', demo: 'judge' },
  { face: 'laugh', jp: 'ウチも同じ曲を一緒に叩く。最後に点数が高い方の勝ちや。手加減はせえへんからな〜！', zh: '我会和你同时打同一首曲子。最后分数高的赢。我可不会手下留情哦～！', en: 'I play the same song right next to you. Higher score wins. No going easy on you!' }
];

const RhythmArcadeModal: React.FC<Props> = ({ language, tier = 1, introSeen, onSeenIntro, onFinish, onCancel }) => {
  const en = language === 'en';
  const [songIdx, setSongIdx] = useState(0);
  const song = RHYTHM_SONGS[songIdx];

  const [phase, setPhase] = useState<Phase>(introSeen['minigame_intro_rhythm'] ? 'select' : 'intro');
  const [introStep, setIntroStep] = useState(0);
  const [count, setCount] = useState(3);
  const [hud, setHud] = useState({ mine: 0, hers: 0, combo: 0, judge: '', jkey: 0, progress: 0 });
  const [face, setFace] = useState('smug');
  const [say, setSay] = useState<Say | null>(L.pick);
  const [result, setResult] = useState<RhythmResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const sfxGainRef = useRef<GainNode | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const previewRef = useRef<{ src: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const bufRef = useRef<AudioBuffer | null>(null);
  const startAtRef = useRef(0);
  // 浏览器若不让 AudioContext 出声（没有用户手势、被系统静音策略挡住），或者歌加载失败，
  // 就退回到系统时钟计时——游戏照样能玩，只是没有音乐。
  const perfStartRef = useRef(0);
  const audioClockRef = useRef(true);
  const phaseRef = useRef<Phase>(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const chart = useMemo(() => chartOf(song, tier), [song, tier]);
  const notes = useRef<Note[]>(chart.map(n => ({ ...n })));
  const g = useRef({ mine: 0, combo: 0, maxCombo: 0, perfect: 0, good: 0, miss: 0, flash: [0, 0, 0, 0], judge: '', judgeAt: 0, jcolor: '#fff', fx: [] as { x: number; y: number; t: number; c: string }[], lead: 0 });

  // Maki 的发挥：提前掷好，按时间累积（每局重掷，所以 key 里带一个局数）
  const [roundNo, setRoundNo] = useState(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, tier, roundNo]);
  const makiScoreAt = (t: number) => {
    let s = 0;
    for (let i = 0; i < maki.length && maki[i].t <= t; i++) s = maki[i].score;
    return s;
  };

  // ---------------- 音频 ----------------
  const initAudio = () => {
    if (ctxRef.current) return ctxRef.current;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const music = ctx.createGain(); music.gain.value = audioManager.effectiveVolume('bgm'); music.connect(ctx.destination);
    const sfx = ctx.createGain(); sfx.gain.value = audioManager.effectiveVolume('sfx') * 0.5; sfx.connect(ctx.destination);
    ctxRef.current = ctx; musicGainRef.current = music; sfxGainRef.current = sfx;
    return ctx;
  };

  // 打中时一声很短的"嗒"，压在歌下面，只是让手知道按到了
  const tick = (strong: boolean) => {
    const ctx = ctxRef.current, out = sfxGainRef.current; if (!ctx || !out) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); const gn = ctx.createGain(); const f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(strong ? 1900 : 1500, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.04);
    f.type = 'highpass'; f.frequency.value = 600;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(strong ? 0.35 : 0.22, t + 0.003); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(f); f.connect(gn); gn.connect(out); o.start(t); o.stop(t + 0.08);
  };

  const stopPreview = () => {
    const p = previewRef.current; previewRef.current = null;
    if (!p || !ctxRef.current) return;
    const t = ctxRef.current.currentTime;
    p.gain.gain.cancelScheduledValues(t); p.gain.gain.setValueAtTime(p.gain.gain.value, t); p.gain.gain.linearRampToValueAtTime(0, t + 0.25);
    try { p.src.stop(t + 0.3); } catch { /* 已经停了 */ }
  };

  // 选歌时放一小段试听（副歌那一段的开头）
  const preview = async (s: RhythmSong) => {
    const ctx = initAudio(); if (!ctx) return;
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    stopPreview();
    try {
      const buf = await loadSong(ctx, s);
      if (RHYTHM_SONGS[songIdxRef.current] !== s || phaseRef.current !== 'select') return;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const gain = ctx.createGain(); gain.connect(musicGainRef.current!);
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.85, t + 0.6);
      gain.gain.setValueAtTime(0.85, t + 9); gain.gain.linearRampToValueAtTime(0, t + 10.5);
      src.connect(gain); src.start(t, s.playFrom + 2, 11);
      previewRef.current = { src, gain };
    } catch { /* 试听失败就不试听 */ }
  };
  const songIdxRef = useRef(songIdx);
  useEffect(() => { songIdxRef.current = songIdx; }, [songIdx]);

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
    const t = songTime();
    g.current.flash[lane] = performance.now();
    let best: Note | null = null; let bd = 9;
    for (const n of notes.current) {
      if (n.lane !== lane || n.hit) continue;
      const d = Math.abs(n.t - t);
      if (d < bd) { bd = d; best = n; }
      if (n.t - t > MISS_WIN) break;
    }
    // 空按：不扣连击（街机的规矩：乱按不罚，但也不加分）
    if (!best || bd > MISS_WIN) return;
    best.hit = true;
    const el = canvasRef.current;
    const w = el ? el.clientWidth : 0;
    const fx = { x: laneX(lane, w), y: 0, t: performance.now(), c: LANE_COLOR[lane] };
    if (bd <= PERFECT_WIN) { best.judged = 'perfect'; addScore('perfect'); popJudge('PERFECT', '#fde047'); tick(true); }
    else if (bd <= GOOD_WIN) { best.judged = 'good'; addScore('good'); popJudge('GOOD', '#67e8f9'); tick(false); }
    else { best.judged = 'miss'; breakCombo(); }
    g.current.fx.push(fx);
    syncHud();
  };

  const syncHud = () => {
    const t = Math.max(0, songTime());
    const s = g.current;
    setHud({ mine: s.mine, hers: makiScoreAt(t), combo: s.combo, judge: s.judge, jkey: s.judgeAt, progress: Math.min(1, t / song.length) });
  };

  const laneX = (lane: number, w: number) => {
    const pw = Math.min(w, 460); const x0 = (w - pw) / 2;
    return x0 + pw / LANES * (lane + 0.5);
  };

  // 这一局放游戏自己的 BGM，场景 BGM 先静音；离开时放回来，并关掉自己的 AudioContext
  useEffect(() => {
    audioManager.suspendBgm();
    return () => {
      audioManager.resumeBgm();
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

  // ---------------- 选歌 / 开始 / 主循环 ----------------
  const pickSong = (i: number) => {
    audioManager.playSfx('click');
    setSongIdx(i);
    void preview(RHYTHM_SONGS[i]);
  };

  const startGame = async () => {
    audioManager.playSfx('confirm');
    stopPreview();
    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') await ctx.resume().catch(() => {});
    setPhase('loading');
    bufRef.current = null;
    if (ctx) {
      try { bufRef.current = await loadSong(ctx, song); } catch { bufRef.current = null; }
    }
    notes.current = chart.map(n => ({ ...n }));
    g.current = { mine: 0, combo: 0, maxCombo: 0, perfect: 0, good: 0, miss: 0, flash: [0, 0, 0, 0], judge: '', judgeAt: 0, jcolor: '#fff', fx: [], lead: 0 };
    setRoundNo(n => n + 1);
    setHud({ mine: 0, hers: 0, combo: 0, judge: '', jkey: 0, progress: 0 });
    if (bufRef.current) { setFace('smug'); setSay(L.start); } else { setFace('pout'); setSay(L.noAudio); }
    setCount(3); setPhase('countdown');
  };

  useEffect(() => {
    if (phase !== 'countdown') return;
    let n = 3;
    const t = window.setInterval(() => {
      n -= 1;
      if (n <= 0) { window.clearInterval(t); beginSong(); }
      else setCount(n);
    }, 650);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const beginSong = () => {
    const ctx = ctxRef.current;
    const buf = bufRef.current;
    audioClockRef.current = !!ctx && ctx.state === 'running' && !!buf;
    perfStartRef.current = performance.now() + 150;
    if (ctx && buf && audioClockRef.current) {
      const at = ctx.currentTime + 0.15;
      startAtRef.current = at;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const gn = ctx.createGain();
      // 前奏淡入、尾巴淡出：截的是整首歌中间的一段
      gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(1, at + 0.8);
      gn.gain.setValueAtTime(1, at + song.length - 1.6); gn.gain.linearRampToValueAtTime(0, at + song.length);
      src.connect(gn); gn.connect(musicGainRef.current!);
      src.start(at, song.playFrom, song.length + 0.1);
      srcRef.current = src;
    }
    setPhase('play');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    let raf = 0;
    let lastHud = 0;
    let lastLead = 0;
    const endT = song.length;

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
        } else if (t > endT - 14 && lastLead !== -1 && now - lastLead > 3000) {
          lastLead = -1; setFace('laugh'); setSay(L.late);
        }
      }
      if (t > endT) { finish(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const stopSong = () => { try { srcRef.current?.stop(); } catch { /* 已经停了 */ } srcRef.current = null; };

  const finish = () => {
    stopSong();
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
    const speed = hitY / SPEED[tier];
    const now = performance.now();

    // 轨道底：半透明，能透出后面的机台
    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(10,6,30,0.35)'); grad.addColorStop(1, 'rgba(40,10,60,0.78)');
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

    // 拍线：用的是从音频里检测出来的拍点，每四拍一条亮线
    for (let i = 0; i < song.beats.length; i++) {
      const y = hitY - (song.beats[i] - t) * speed;
      if (y < 0) break;
      if (y > h) continue;
      c.strokeStyle = i % 4 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)';
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + pw, y); c.stroke();
    }

    // 判定线：跟着拍子轻轻跳一下
    let pulse = 0;
    for (const b of song.beats) { const d = t - b; if (d >= 0 && d < 0.18) { pulse = 1 - d / 0.18; break; } if (b > t) break; }
    c.shadowColor = '#f0abfc'; c.shadowBlur = 16 + pulse * 18;
    c.strokeStyle = '#f5d0fe'; c.lineWidth = 3 + pulse * 2;
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
      if (y < -30) break;
      if (y > h + 30) continue;
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
  // 打歌的时候背景虚化压暗：背景里那台机器自己也画着轨道，不压下去会跟真的音符混在一起
const stage = (children: React.ReactNode, dim = 0.5, blur = 0) => createPortal(
    <div className="fixed inset-0 z-[400] bg-black text-white select-none overflow-hidden">
      <img src={BG} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 1 - dim, filter: blur ? `blur(${blur}px)` : undefined, transform: blur ? 'scale(1.05)' : undefined }} draggable={false} />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      <div className="absolute inset-0 pointer-events-none border-[6px] md:border-[10px] border-fuchsia-500/50 shadow-[inset_0_0_50px_rgba(217,70,239,0.5)]" />
      <div className="relative w-full h-full">{children}</div>
    </div>,
    document.body
  );

  const sayBubble = () => say && (
    <div className="bg-black/75 border border-fuchsia-300/40 rounded px-3 py-2 max-w-[260px] backdrop-blur-sm">
      <p className="text-fuchsia-300 text-[10px] font-black tracking-widest">MAKI</p>
      <p className="text-white text-xs md:text-sm leading-snug">{say.jp}</p>
      <p className="text-white/50 text-[10px] md:text-xs mt-0.5">{en ? say.en : say.zh}</p>
    </div>
  );

  if (phase === 'intro') {
    const card = INTRO[introStep];
    return stage(
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-5">
        <img src={LOGO} alt="BEAT CRASH" className="h-16 md:h-24 object-contain mix-blend-screen" draggable={false} />
        <img src={MAKI(card.face)} alt="" className="h-48 md:h-64 object-contain drop-shadow-2xl" draggable={false} />
        <div className="bg-black/80 border border-fuchsia-300/50 max-w-xl w-full px-6 py-5 backdrop-blur-sm">
          <p className="text-fuchsia-300 text-[10px] font-black tracking-widest mb-2">{en ? 'HOW TO PLAY' : '玩法说明'} · {introStep + 1}/{INTRO.length}</p>
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
              else { onSeenIntro('minigame_intro_rhythm'); setFace('smug'); setSay(L.pick); setPhase('select'); }
            }}
            className="mt-4 w-full bg-fuchsia-400 hover:bg-fuchsia-300 text-black font-black py-3 tracking-widest text-sm"
          >
            {introStep < INTRO.length - 1 ? (en ? 'NEXT ▶' : '下一页 ▶') : (en ? 'GOT IT' : '明白了')}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'select' || phase === 'loading') {
    return stage(
      <div className="w-full h-full overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center gap-4 p-4 md:p-6">
          <img src={LOGO} alt="BEAT CRASH" className="h-14 md:h-20 object-contain mix-blend-screen" draggable={false} />
          <p className="text-cyan-200 text-[11px] font-black tracking-[0.35em]">{en ? 'SELECT A SONG' : '选一首歌'} · {TIER_NAME(tier, en)}</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 w-full max-w-5xl">
            {RHYTHM_SONGS.map((s, i) => {
              const on = i === songIdx;
              return (
                <button key={s.id} onClick={() => pickSong(i)} disabled={phase === 'loading'}
                        className={`group text-left transition-transform ${on ? 'scale-105' : 'opacity-75 hover:opacity-100'}`}>
                  <div className={`aspect-square overflow-hidden border-2 ${on ? 'border-fuchsia-300 shadow-[0_0_24px_rgba(232,121,249,0.8)]' : 'border-white/20'}`}>
                    <img src={jacketOf(s)} alt="" className="w-full h-full object-cover" draggable={false} />
                  </div>
                  <p className={`mt-1 text-[11px] md:text-xs font-black leading-tight ${on ? 'text-white' : 'text-white/70'}`}>{s.title}</p>
                  <p className="text-[9px] md:text-[10px] text-white/45 font-bold">{s.bpm} BPM</p>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
            <div className="flex items-end gap-3 shrink-0">
              <img src={MAKI(face)} alt="" className="h-40 md:h-56 object-contain drop-shadow-2xl" draggable={false} />
              {sayBubble()}
            </div>
            <div className="flex-1 bg-black/70 border border-fuchsia-300/40 p-4 backdrop-blur-sm w-full">
              <p className="text-fuchsia-300 text-[10px] font-black tracking-[0.3em]">NOW SELECTED</p>
              <p className="text-2xl md:text-3xl font-black italic">{song.title}</p>
              <p className="text-white/60 text-xs mt-1">{song.bpm} BPM · {chart.length} NOTES · {TIER_NAME(tier, en)} · {Math.round(song.length)}s</p>
              <div className="flex gap-2 mt-3">{KEY_LABEL.map((k, i) => <span key={k} className="w-9 h-9 flex items-center justify-center font-black border-2 rounded-lg" style={{ color: LANE_COLOR[i], borderColor: LANE_COLOR[i] }}>{k}</span>)}</div>
              <p className="text-white/40 text-[11px] mt-2">{en ? 'Tap a jacket to hear a preview. Or tap the lanes on a phone.' : '点封面可以试听。手机上直接点轨道。'}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { audioManager.playSfx('click'); stopPreview(); setIntroStep(0); setPhase('intro'); }} className="px-4 py-3 border border-white/25 text-white/70 hover:text-white text-xs font-black tracking-widest">{en ? 'RULES' : '规则'}</button>
                <button onClick={startGame} disabled={phase === 'loading'} className="flex-1 bg-fuchsia-400 hover:bg-fuchsia-300 disabled:opacity-60 text-black px-6 py-3 text-sm font-black tracking-widest transform -skew-x-12">
                  <span className="block transform skew-x-12">{phase === 'loading' ? (en ? 'LOADING…' : '加载中…') : (en ? 'START (¥100)' : '开始（¥100）')}</span>
                </button>
                <button onClick={() => { audioManager.playSfx('modal_close'); stopPreview(); onCancel(); }} className="px-4 py-3 border border-white/25 text-white/70 hover:text-white text-xs font-black tracking-widest">{en ? 'LEAVE' : '离开'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done' && result) {
    const r = result;
    return stage(
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-5 text-center overflow-y-auto">
        <div className="flex items-center gap-3">
          <img src={jacketOf(song)} alt="" className="w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-fuchsia-300/60" draggable={false} />
          <div className="text-left">
            <p className="text-white/50 text-[10px] font-black tracking-widest">{TIER_NAME(tier, en)}</p>
            <p className="text-xl md:text-2xl font-black italic">{song.title}</p>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <img src={MAKI(face)} alt="" className="h-40 md:h-56 object-contain drop-shadow-2xl" draggable={false} />
          {sayBubble()}
        </div>
        <p className="text-cyan-300 text-[11px] font-black tracking-[0.3em]">{r.won ? (en ? 'YOU WIN' : '你赢了') : r.mine === r.hers ? (en ? 'DRAW' : '平局') : (en ? 'MAKI WINS' : 'MAKI 赢了')}</p>
        <div className="flex items-center gap-8">
          <div><div className="text-4xl font-black text-fuchsia-300 tabular-nums">{r.mine.toLocaleString()}</div><div className="text-[10px] text-white/50 tracking-widest">{en ? 'YOU' : '你'}</div></div>
          <div className="text-6xl font-black italic text-yellow-300 drop-shadow-[0_0_16px_rgba(253,224,71,0.8)]">{r.rank}</div>
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
          <span className="flex items-center gap-2 text-white/60"><img src={jacketOf(song)} alt="" className="w-6 h-6 object-cover" draggable={false} />{song.title}</span>
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
          <div className="hidden sm:block">{sayBubble()}</div>
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
        <button onClick={() => { stopSong(); ctxRef.current?.close().catch(() => {}); onCancel(); }} className="absolute left-2 bottom-2 z-20 text-white/35 hover:text-white/80 text-[10px] font-black tracking-widest">{en ? 'QUIT' : '放弃'}</button>
      </div>
    </div>,
    0.62, 7
  );
};

export default RhythmArcadeModal;
