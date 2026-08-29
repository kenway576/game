// ============================================================================
// 🔊 AudioManager —— 全局音效 / BGM 单例（零依赖，纯 Web Audio API 手写）
//
// 设计要点（见 public/audio/README.md）：
//  - 单例：触发点大多在 App.tsx 的普通函数里（applyRelationship / handleQuizAnswer
//    / handleSendMessage / enterChat / leaveChat），不是 React 组件，所以核心
//    必须是可在任意模块 import 的单例，不能做成 hook。
//  - React 组件想读音量 / 静音状态时，用 hooks/useAudioSettings.ts
//    （useSyncExternalStore 订阅本单例）。仅设置面板需要。
//  - 两层降级：
//      1) 有真实素材 → public/audio/manifest.json 里登记，运行时 fetch + decode，
//         用 AudioBufferSourceNode 播放；
//      2) 没有素材 → 用 OscillatorNode / 噪声实时合成一个占位音。
//    把真素材丢进 public/audio/ 并更新 manifest.json 即自动切换，代码不用动。
//  - 自动播放策略：浏览器要求首次用户手势后才能出声。unlock() 之前 BGM 只记
//    pendingBgm，绝不启动；unlock() 里 resume() AudioContext 再补上。
//  - StrictMode：init() / unlock() / crossfadeBgm(同曲) 全部幂等。
//  - 素材缺失 / 解码失败：只 console.info 一次，播放静默降级，绝不抛错、绝不卡游戏。
// ============================================================================

import type React from 'react';

export type AudioBus = 'bgm' | 'sfx' | 'typing';
export type BgmTrack = 'title' | 'lobby' | 'chat';

export interface AudioSettings {
  master: number;        // 0..1 总音量
  bgm: number;           // 0..1
  sfx: number;           // 0..1
  typing: number;        // 0..1
  muted: boolean;
  typingEnabled: boolean; // 打字音单独可关
}

const STORAGE_KEY = 'kobe_study_audio_v1';
const AUDIO_BASE = '/audio';

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  master: 0.9,
  bgm: 0.2,        // 决策：BGM 默认 20%（不是默认关）
  sfx: 0.7,
  typing: 0.35,
  muted: false,
  typingEnabled: true,
};

// ---- SFX 注册表：name -> { 相对音量, 总线, 是否循环 } -----------------------
interface SfxDef { vol: number; bus?: AudioBus; loop?: boolean; }

const SFX_DEFS: Record<string, SfxDef> = {
  // UI
  click:        { vol: 0.35 },
  page:         { vol: 0.40 },
  type:         { vol: 1.0, bus: 'typing' },
  send:         { vol: 0.55 },
  receive:      { vol: 0.50 },
  collect:      { vol: 0.55 },
  error:        { vol: 0.50 },
  modal_open:   { vol: 0.40 },
  modal_close:  { vol: 0.35 },
  confirm:      { vol: 0.50 },
  // 关系反馈（好感=暖音色，親密=冷音色，两者刻意做出区别）
  affection_up:        { vol: 0.60 },
  familiarity_up:      { vol: 0.55 },
  relation_down:       { vol: 0.55 },
  levelup_affection:   { vol: 0.80 },
  levelup_familiarity: { vol: 0.75 },
  unlock:              { vol: 0.70 },
  // 答题
  quiz_correct: { vol: 0.65 },
  quiz_wrong:   { vol: 0.55 },
  // 骰子
  dice_rattle:    { vol: 0.40, loop: true },
  dice_land_low:  { vol: 0.60 },
  dice_land_mid:  { vol: 0.62 },
  dice_land_high: { vol: 0.72 },
  // 场景转换
  enter_chat: { vol: 0.55 },
  leave_chat: { vol: 0.50 },
};

export type SfxName = keyof typeof SFX_DEFS | string;

interface AudioManifest {
  sfx?: Record<string, string>;   // "click" -> "mp3" | "ogg" | "wav" | "audio/x/click.mp3"
  bgm?: Record<string, string>;   // "lobby" -> "mp3" | ...
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

type AnyWindow = Window & { webkitAudioContext?: typeof AudioContext };

// ============================================================================

class AudioManager {
  private settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
  private listeners = new Set<() => void>();

  private initialized = false;
  private unlocked = false;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private busGain: Record<AudioBus, GainNode> | null = null;

  private manifest: AudioManifest | null = null;
  private manifestTried = false;

  // 已解码的素材缓存（缺失时值为 null，表示"用合成音"）
  private sfxBuffers = new Map<string, AudioBuffer | null>();
  private bgmBuffers = new Map<BgmTrack, AudioBuffer | null>();
  private warned = new Set<string>();

  // BGM 运行时
  private currentBgm: { track: BgmTrack; gain: GainNode; stop: () => void } | null = null;
  private pendingBgm: BgmTrack | null = null;
  private bgmDucked = false;

  // 节流 / 循环句柄
  private lastTypeAt = 0;
  private diceRattleTimer: number | null = null;
  private diceRattleStop: (() => void) | null = null;

  // ---- 生命周期 ---------------------------------------------------------

  /** App 挂载时调用一次。幂等。不会自己出声（等 unlock）。 */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.loadSettings();

    try {
      const Ctor = window.AudioContext || (window as AnyWindow).webkitAudioContext;
      if (!Ctor) {
        this.infoOnce('no-audiocontext', '[audio] 浏览器不支持 Web Audio API，音效已禁用');
        return;
      }
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.busGain = {
        bgm: this.ctx.createGain(),
        sfx: this.ctx.createGain(),
        typing: this.ctx.createGain(),
      };
      this.busGain.bgm.connect(this.masterGain);
      this.busGain.sfx.connect(this.masterGain);
      this.busGain.typing.connect(this.masterGain);
      this.applyVolumes(true);
    } catch {
      this.ctx = null;
      this.infoOnce('audio-init-failed', '[audio] AudioContext 初始化失败，音效已禁用');
      return;
    }

    // manifest 是可选的：没有它就纯合成占位音（零网络请求、零 404）。
    void this.loadManifest();
  }

  /** 首次用户手势时调用（App.tsx 监听 pointerdown / keydown）。幂等。 */
  unlock(): void {
    if (this.unlocked) return;
    this.unlocked = true;
    const ctx = this.ctx;
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    } catch { /* ignore */ }
    if (this.pendingBgm) {
      const t = this.pendingBgm;
      this.pendingBgm = null;
      this.crossfadeBgm(t, 800);
    }
  }

  isUnlocked(): boolean { return this.unlocked; }

  // ---- 设置 / 订阅 -----------------------------------------------------

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  };

  getSnapshot = (): AudioSettings => this.settings;

  setBusVolume(bus: AudioBus | 'master', v: number): void {
    this.update({ [bus]: clamp01(v) } as unknown as Partial<AudioSettings>);
  }

  setMuted(muted: boolean): void { this.update({ muted }); }
  toggleMuted(): void { this.update({ muted: !this.settings.muted }); }
  setTypingEnabled(enabled: boolean): void { this.update({ typingEnabled: enabled }); }
  toggleTyping(): void { this.update({ typingEnabled: !this.settings.typingEnabled }); }

  private update(patch: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...patch };
    this.persist();
    this.applyVolumes();
    this.listeners.forEach(l => l());
  }

  private loadSettings(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AudioSettings>;
        this.settings = { ...DEFAULT_AUDIO_SETTINGS, ...parsed };
      }
    } catch { /* 用默认值 */ }
  }

  private persist(): void {
    try {
      // 只存这几个键，跟约定一致
      const { master, bgm, sfx, typing, muted, typingEnabled } = this.settings;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ master, bgm, sfx, typing, muted, typingEnabled }));
    } catch { /* 隐私模式等 */ }
  }

  private applyVolumes(immediate = false): void {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain || !this.busGain) return;
    const t = ctx.currentTime;
    const ramp = (g: GainNode, target: number) => {
      try {
        g.gain.cancelScheduledValues(t);
        if (immediate) g.gain.setValueAtTime(target, t);
        else g.gain.setTargetAtTime(target, t, 0.03);
      } catch { try { g.gain.value = target; } catch { /* ignore */ } }
    };
    ramp(this.masterGain, this.settings.muted ? 0 : this.settings.master);
    ramp(this.busGain.bgm, this.settings.bgm * (this.bgmDucked ? 0.35 : 1));
    ramp(this.busGain.sfx, this.settings.sfx);
    ramp(this.busGain.typing, this.settings.typing);
  }

  private infoOnce(key: string, msg: string): void {
    if (this.warned.has(key)) return;
    this.warned.add(key);
    try { console.info(msg); } catch { /* ignore */ }
  }

  // ---- manifest / 素材加载 -------------------------------------------

  private async loadManifest(): Promise<void> {
    if (this.manifestTried) return;
    this.manifestTried = true;
    try {
      const res = await fetch(`${AUDIO_BASE}/manifest.json`, { cache: 'no-cache' });
      if (res.ok) {
        this.manifest = (await res.json()) as AudioManifest;
        this.infoOnce('manifest-ok', '[audio] 已加载 public/audio/manifest.json，将使用真实素材（缺失项回退合成音）');
      } else {
        this.infoOnce('manifest-none', '[audio] 未找到 public/audio/manifest.json —— 占位模式：全部音效实时合成');
      }
    } catch {
      this.infoOnce('manifest-none', '[audio] 未找到 public/audio/manifest.json —— 占位模式：全部音效实时合成');
    }
  }

  private urlFor(category: 'sfx' | 'bgm', name: string): string | null {
    const entry = this.manifest?.[category]?.[name];
    if (!entry) return null;
    if (entry.includes('/') || entry.includes('.')) {
      // 完整相对路径写法
      return entry.startsWith('/') ? entry : `${AUDIO_BASE}/${entry}`;
    }
    // 只写了扩展名
    return `${AUDIO_BASE}/${category}/${name}.${entry}`;
  }

  private async decode(url: string): Promise<AudioBuffer | null> {
    const ctx = this.ctx;
    if (!ctx) return null;
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) return null;
      const arr = await res.arrayBuffer();
      return await ctx.decodeAudioData(arr);
    } catch {
      return null;
    }
  }

  private async ensureSfxBuffer(name: string): Promise<AudioBuffer | null> {
    if (this.sfxBuffers.has(name)) return this.sfxBuffers.get(name) ?? null;
    this.sfxBuffers.set(name, null); // 占位，避免并发重复请求
    const url = this.urlFor('sfx', name);
    if (!url) return null;
    const buf = await this.decode(url);
    this.sfxBuffers.set(name, buf);
    if (!buf) this.infoOnce(`sfx:${name}`, `[audio] 音效素材 "${name}" 加载失败，改用合成音（检查 ${url}）`);
    return buf;
  }

  private async ensureBgmBuffer(track: BgmTrack): Promise<AudioBuffer | null> {
    if (this.bgmBuffers.has(track)) return this.bgmBuffers.get(track) ?? null;
    this.bgmBuffers.set(track, null);
    const url = this.urlFor('bgm', track);
    if (!url) return null;
    const buf = await this.decode(url);
    this.bgmBuffers.set(track, buf);
    if (!buf) this.infoOnce(`bgm:${track}`, `[audio] BGM 素材 "${track}" 加载失败，改用合成氛围音（检查 ${url}）`);
    return buf;
  }

  // ---- 底层合成原语 -------------------------------------------------

  private busNode(bus: AudioBus): AudioNode | null {
    return this.busGain ? this.busGain[bus] : null;
  }

  /** 一个带 ADSR 的振荡器音。相对时间，单位秒。 */
  private tone(opts: {
    freq: number; dur: number; type?: OscillatorType; gain?: number;
    attack?: number; release?: number; bus?: AudioBus; when?: number;
    slideTo?: number; detune?: number; vibrato?: { rate: number; depth: number };
    filter?: { type: BiquadFilterType; freq: number; q?: number; sweepTo?: number };
  }): void {
    const ctx = this.ctx;
    const dest = this.busNode(opts.bus ?? 'sfx');
    if (!ctx || !dest) return;
    const t0 = ctx.currentTime + (opts.when ?? 0);
    const dur = Math.max(0.02, opts.dur);
    const atk = Math.min(opts.attack ?? 0.005, dur * 0.5);
    const rel = Math.min(opts.release ?? 0.08, dur);
    const peak = opts.gain ?? 0.5;

    const osc = ctx.createOscillator();
    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.slideTo), t0 + dur);
    if (opts.detune) osc.detune.setValueAtTime(opts.detune, t0);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.setValueAtTime(peak, t0 + Math.max(atk, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    let tail: AudioNode = g;
    let filterNode: BiquadFilterNode | null = null;
    if (opts.filter) {
      filterNode = ctx.createBiquadFilter();
      filterNode.type = opts.filter.type;
      filterNode.frequency.setValueAtTime(opts.filter.freq, t0);
      if (opts.filter.q != null) filterNode.Q.setValueAtTime(opts.filter.q, t0);
      if (opts.filter.sweepTo) filterNode.frequency.exponentialRampToValueAtTime(Math.max(20, opts.filter.sweepTo), t0 + dur);
      g.connect(filterNode);
      tail = filterNode;
    }

    osc.connect(g);
    tail.connect(dest);

    let lfo: OscillatorNode | null = null;
    let lfoGain: GainNode | null = null;
    if (opts.vibrato) {
      lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(opts.vibrato.rate, t0);
      lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(opts.vibrato.depth, t0);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t0);
      lfo.stop(t0 + dur + 0.02);
    }

    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
    osc.onended = () => {
      try { osc.disconnect(); g.disconnect(); filterNode?.disconnect(); lfo?.disconnect(); lfoGain?.disconnect(); } catch { /* ignore */ }
    };
  }

  /** 一段滤波噪声。 */
  private noise(opts: {
    dur: number; gain?: number; bus?: AudioBus; when?: number;
    type?: BiquadFilterType; freq?: number; q?: number; sweepTo?: number;
    attack?: number; release?: number;
  }): void {
    const ctx = this.ctx;
    const dest = this.busNode(opts.bus ?? 'sfx');
    if (!ctx || !dest) return;
    const t0 = ctx.currentTime + (opts.when ?? 0);
    const dur = Math.max(0.02, opts.dur);
    const peak = opts.gain ?? 0.4;
    const atk = Math.min(opts.attack ?? 0.004, dur * 0.5);
    const rel = Math.min(opts.release ?? 0.06, dur);

    const frames = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = opts.type ?? 'bandpass';
    filter.frequency.setValueAtTime(opts.freq ?? 1200, t0);
    if (opts.q != null) filter.Q.setValueAtTime(opts.q, t0);
    if (opts.sweepTo) filter.frequency.exponentialRampToValueAtTime(Math.max(20, opts.sweepTo), t0 + dur);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.setValueAtTime(peak, t0 + Math.max(atk, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
    src.onended = () => { try { src.disconnect(); filter.disconnect(); g.disconnect(); } catch { /* ignore */ } };
  }

  private chord(freqs: number[], opts: { dur: number; type?: OscillatorType; gain?: number; bus?: AudioBus; stagger?: number; slide?: number; vibrato?: { rate: number; depth: number } }): void {
    freqs.forEach((f, i) => this.tone({
      freq: f, dur: opts.dur, type: opts.type, gain: (opts.gain ?? 0.4) / Math.sqrt(freqs.length),
      bus: opts.bus, when: i * (opts.stagger ?? 0), release: opts.dur * 0.5,
      slideTo: opts.slide ? f * opts.slide : undefined, vibrato: opts.vibrato,
    }));
  }

  // ---- 每个 SFX 的合成配方 ----------------------------------------

  private synth(name: string, rate = 1): void {
    const r = rate;
    switch (name) {
      case 'click':
        this.noise({ dur: 0.05, gain: 0.28, type: 'highpass', freq: 2000, release: 0.04 });
        this.tone({ freq: 660 * r, dur: 0.045, type: 'triangle', gain: 0.16, release: 0.04 });
        break;
      case 'page':
        this.noise({ dur: 0.16, gain: 0.30, type: 'bandpass', freq: 900, q: 0.7, sweepTo: 2600 });
        break;
      case 'type':
        this.tone({ freq: (520 + Math.random() * 120) * r, dur: 0.028, type: 'square', gain: 0.10, attack: 0.002, release: 0.02, bus: 'typing', filter: { type: 'lowpass', freq: 2400 } });
        break;
      case 'send':
        this.noise({ dur: 0.22, gain: 0.30, type: 'bandpass', freq: 500, q: 1.2, sweepTo: 3200 });
        this.tone({ freq: 300, dur: 0.22, type: 'sine', gain: 0.14, slideTo: 900, release: 0.14 });
        break;
      case 'receive':
        this.chord([523.25, 659.25], { dur: 0.26, type: 'sine', gain: 0.30, stagger: 0.06, slide: 1.0 });
        break;
      case 'collect':
        // 亮闪：三音上行小分解和弦 + 铃感
        this.chord([784, 988, 1319], { dur: 0.4, type: 'triangle', gain: 0.34, stagger: 0.05 });
        this.tone({ freq: 2637, dur: 0.5, type: 'sine', gain: 0.08, when: 0.1, release: 0.45 });
        break;
      case 'error':
        this.tone({ freq: 220, dur: 0.22, type: 'sawtooth', gain: 0.24, slideTo: 150, release: 0.16, filter: { type: 'lowpass', freq: 1200, sweepTo: 500 } });
        break;
      case 'modal_open':
        this.tone({ freq: 320, dur: 0.18, type: 'sine', gain: 0.24, slideTo: 520, release: 0.12 });
        break;
      case 'modal_close':
        this.tone({ freq: 520, dur: 0.16, type: 'sine', gain: 0.20, slideTo: 300, release: 0.11 });
        break;
      case 'confirm':
        this.chord([440, 660], { dur: 0.22, type: 'sine', gain: 0.30, stagger: 0.05 });
        break;

      // 好感度 = 暖：正弦/三角，大三度上行，带轻微揉音，圆润
      case 'affection_up':
        this.tone({ freq: 523.25, dur: 0.34, type: 'sine', gain: 0.34, release: 0.26, vibrato: { rate: 6, depth: 4 } });
        this.tone({ freq: 659.25, dur: 0.4, type: 'triangle', gain: 0.26, when: 0.09, release: 0.32, vibrato: { rate: 6, depth: 4 } });
        break;
      case 'levelup_affection':
        // 暖：C–E–G–C 大调上行琶音，尾音留长
        this.chord([523.25, 659.25, 783.99, 1046.5], { dur: 0.9, type: 'sine', gain: 0.4, stagger: 0.11, vibrato: { rate: 5.5, depth: 5 } });
        this.tone({ freq: 1567.98, dur: 1.0, type: 'triangle', gain: 0.10, when: 0.44, release: 0.9 });
        break;

      // 親密度 = 冷：三角/方波偏硬，纯四度，更高更短，无揉音，"电子风铃"
      case 'familiarity_up':
        this.tone({ freq: 880, dur: 0.16, type: 'triangle', gain: 0.28, release: 0.12, detune: 4 });
        this.tone({ freq: 1174.66, dur: 0.22, type: 'triangle', gain: 0.22, when: 0.07, release: 0.17, detune: -4 });
        break;
      case 'levelup_familiarity':
        // 冷：纯四度堆叠 A–D–A，短促、清脆、带一点点失谐
        this.chord([880, 1174.66, 1760], { dur: 0.5, type: 'triangle', gain: 0.34, stagger: 0.08 });
        this.tone({ freq: 2349.32, dur: 0.4, type: 'square', gain: 0.05, when: 0.16, release: 0.34, filter: { type: 'lowpass', freq: 4000 } });
        break;

      case 'relation_down':
        // 下行小三度，滤波向下扫
        this.tone({ freq: 440, dur: 0.5, type: 'triangle', gain: 0.3, slideTo: 262, release: 0.4, filter: { type: 'lowpass', freq: 1800, sweepTo: 400 } });
        break;
      case 'unlock':
        this.chord([392, 523.25, 659.25, 783.99], { dur: 0.7, type: 'sine', gain: 0.36, stagger: 0.09 });
        this.tone({ freq: 1046.5, dur: 0.8, type: 'triangle', gain: 0.12, when: 0.34, release: 0.7 });
        break;

      case 'quiz_correct':
        this.chord([659.25, 987.77], { dur: 0.32, type: 'sine', gain: 0.36, stagger: 0.09, slide: 1.0 });
        break;
      case 'quiz_wrong':
        // 柔和：两下低音"咚咚"，不做惩罚感
        this.tone({ freq: 300, dur: 0.16, type: 'sine', gain: 0.28, release: 0.12 });
        this.tone({ freq: 240, dur: 0.26, type: 'sine', gain: 0.26, when: 0.15, release: 0.2 });
        break;

      case 'dice_land_low':
        this.tone({ freq: 130, dur: 0.28, type: 'sine', gain: 0.4, slideTo: 90, release: 0.22 });
        this.noise({ dur: 0.12, gain: 0.18, type: 'lowpass', freq: 400 });
        break;
      case 'dice_land_mid':
        this.tone({ freq: 190, dur: 0.26, type: 'triangle', gain: 0.4, slideTo: 150, release: 0.2 });
        this.noise({ dur: 0.1, gain: 0.16, type: 'bandpass', freq: 1200, q: 0.8 });
        break;
      case 'dice_land_high':
        this.tone({ freq: 260, dur: 0.24, type: 'triangle', gain: 0.4, slideTo: 210, release: 0.18 });
        this.chord([1319, 1760], { dur: 0.4, type: 'sine', gain: 0.16, when: 0.05, stagger: 0.04 });
        break;

      case 'enter_chat':
        this.tone({ freq: 330, dur: 0.6, type: 'sine', gain: 0.26, slideTo: 495, release: 0.5, filter: { type: 'lowpass', freq: 700, sweepTo: 2400 } });
        break;
      case 'leave_chat':
        this.tone({ freq: 495, dur: 0.55, type: 'sine', gain: 0.24, slideTo: 300, release: 0.45, filter: { type: 'lowpass', freq: 2200, sweepTo: 600 } });
        break;

      default:
        // 未知名字：给一个中性的轻 tick，绝不静默失败得莫名其妙
        this.tone({ freq: 600 * r, dur: 0.05, type: 'triangle', gain: 0.12 });
    }
  }

  // ---- 对外播放 API -------------------------------------------------

  /** 播放一次短音效。素材缺失时用合成音，再不行就静默返回。 */
  playSfx(name: SfxName, opts?: { volume?: number; rate?: number }): void {
    if (this.settings.muted || !this.ctx) return;
    const def = SFX_DEFS[name] ?? { vol: 0.5 };
    const rate = opts?.rate ?? 1;

    const buf = this.sfxBuffers.get(name);
    if (buf) {
      this.playBuffer(buf, def, opts);
      return;
    }
    if (buf === undefined) {
      // 还没查过：异步查一次；本次先用合成音，之后自动切素材
      void this.ensureSfxBuffer(name);
    }
    try { this.synth(name, rate); } catch { /* 绝不冒泡 */ }
  }

  private playBuffer(buffer: AudioBuffer, def: SfxDef, opts?: { volume?: number; rate?: number }): number | void {
    const ctx = this.ctx;
    const dest = this.busNode(def.bus ?? 'sfx');
    if (!ctx || !dest) return;
    try {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = !!def.loop;
      if (opts?.rate) src.playbackRate.value = Math.max(0.5, Math.min(4, opts.rate));
      const g = ctx.createGain();
      g.gain.value = def.vol * (opts?.volume ?? 1);
      src.connect(g);
      g.connect(dest);
      src.start();
      src.onended = () => { try { src.disconnect(); g.disconnect(); } catch { /* ignore */ } };
    } catch { /* ignore */ }
  }

  /** 打字音：内部节流 + 随机 pitch ±5%，避免机关枪感。 */
  playTypeBlip(): void {
    if (!this.settings.typingEnabled || this.settings.muted || !this.ctx) return;
    const t = now();
    if (t - this.lastTypeAt < 55) return;      // 约每 2~3 字符
    this.lastTypeAt = t;
    this.playSfx('type', { rate: 0.95 + Math.random() * 0.1 }); // ±5%
  }

  // ---- 骰子 ---------------------------------------------------------

  startDiceRattle(): void {
    if (this.settings.muted || !this.ctx) return;
    if (this.diceRattleTimer != null || this.diceRattleStop) return; // 幂等

    const loopedBuf = this.sfxBuffers.get('dice_rattle');
    if (loopedBuf) {
      const ctx = this.ctx;
      const dest = this.busNode('sfx');
      if (ctx && dest) {
        try {
          const src = ctx.createBufferSource();
          src.buffer = loopedBuf;
          src.loop = true;
          const g = ctx.createGain();
          g.gain.value = SFX_DEFS.dice_rattle.vol;
          src.connect(g); g.connect(dest);
          src.start();
          this.diceRattleStop = () => { try { src.stop(); src.disconnect(); g.disconnect(); } catch { /* ignore */ } };
          return;
        } catch { /* 落到合成 */ }
      }
    }
    if (this.sfxBuffers.get('dice_rattle') === undefined) void this.ensureSfxBuffer('dice_rattle');

    // 合成：密集的短噪声"咔哒"，模拟骰子在杯里翻滚
    const tick = () => {
      this.noise({ dur: 0.03 + Math.random() * 0.02, gain: 0.16 + Math.random() * 0.1, type: 'bandpass', freq: 800 + Math.random() * 1600, q: 1.5 });
    };
    tick();
    this.diceRattleTimer = window.setInterval(tick, 55 + Math.random() * 30);
  }

  stopDiceRattle(): void {
    if (this.diceRattleTimer != null) { clearInterval(this.diceRattleTimer); this.diceRattleTimer = null; }
    if (this.diceRattleStop) { this.diceRattleStop(); this.diceRattleStop = null; }
  }

  playDiceLand(face: number): void {
    this.stopDiceRattle();
    const name = face >= 5 ? 'dice_land_high' : face >= 3 ? 'dice_land_mid' : 'dice_land_low';
    this.playSfx(name);
  }

  // ---- BGM --------------------------------------------------------

  /** 切换 BGM，交叉淡入淡出。解锁前只记 pendingBgm。幂等（同曲不重播）。 */
  crossfadeBgm(track: BgmTrack, ms = 800): void {
    if (!this.ctx || !this.busGain) { this.pendingBgm = track; return; }
    if (!this.unlocked) { this.pendingBgm = track; return; }
    if (this.currentBgm?.track === track) return;

    const ctx = this.ctx;
    const tNow = ctx.currentTime;
    const fade = Math.max(0.05, ms / 1000);

    // 淡出旧曲
    const prev = this.currentBgm;
    this.currentBgm = null;
    this.bgmDucked = false;
    if (prev) {
      try {
        prev.gain.gain.cancelScheduledValues(tNow);
        prev.gain.gain.setValueAtTime(prev.gain.gain.value, tNow);
        prev.gain.gain.linearRampToValueAtTime(0.0001, tNow + fade);
      } catch { /* ignore */ }
      window.setTimeout(() => { try { prev.stop(); } catch { /* ignore */ } }, ms + 120);
    }

    // 淡入新曲：trackGain（0..1 的淡入/duck 系数）→ busGain.bgm（音量）→ master
    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.0001, tNow);
    trackGain.gain.linearRampToValueAtTime(1, tNow + fade);
    trackGain.connect(this.busGain.bgm);

    let stopFn: () => void = () => { try { trackGain.disconnect(); } catch { /* ignore */ } };

    const startSynthOrBuffer = () => {
      const buf = this.bgmBuffers.get(track);
      if (buf) {
        try {
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          src.connect(trackGain);
          src.start();
          stopFn = () => { try { src.stop(); src.disconnect(); trackGain.disconnect(); } catch { /* ignore */ } };
          return;
        } catch { /* 落合成 */ }
      }
      const pad = this.startPad(track, trackGain);
      stopFn = () => { pad(); try { trackGain.disconnect(); } catch { /* ignore */ } };
    };

    if (this.bgmBuffers.get(track) === undefined) {
      // 先用合成音起播，素材到位后下次切歌自然换成文件
      void this.ensureBgmBuffer(track);
    }
    startSynthOrBuffer();

    this.currentBgm = { track, gain: trackGain, stop: () => stopFn() };
    this.applyVolumes();
  }

  /** 合成氛围 BGM：3 个 gameMode 三种情绪。返回 stop 函数。 */
  private startPad(track: BgmTrack, out: AudioNode): () => void {
    const ctx = this.ctx;
    if (!ctx) return () => {};

    // 三种情绪的和弦 / 音色
    const presets: Record<BgmTrack, { chord: number[]; type: OscillatorType; lp: number; lfoRate: number; beat?: number }> = {
      title:  { chord: [130.81, 196.00, 261.63, 392.00], type: 'sine',     lp: 900,  lfoRate: 0.05 },   // 沉静、开阔
      lobby:  { chord: [146.83, 220.00, 293.66, 440.00], type: 'triangle', lp: 1400, lfoRate: 0.08, beat: 0.5 }, // 明亮、日常
      chat:   { chord: [110.00, 164.81, 220.00, 329.63], type: 'sine',     lp: 700,  lfoRate: 0.04 },   // 温柔、贴近
    };
    const p = presets[track];
    const nodes: Array<{ stop: () => void }> = [];

    // 铺底和弦：每个音一对轻微失谐的振荡器
    p.chord.forEach((f, i) => {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = p.lp;
      lp.Q.value = 0.3;

      const vGain = ctx.createGain();
      vGain.gain.value = (i === 0 ? 0.16 : 0.09) / Math.sqrt(p.chord.length);
      lp.connect(vGain);
      vGain.connect(out);

      const oscA = ctx.createOscillator();
      oscA.type = p.type;
      oscA.frequency.value = f;
      oscA.detune.value = -5;
      const oscB = ctx.createOscillator();
      oscB.type = p.type;
      oscB.frequency.value = f;
      oscB.detune.value = 6;
      oscA.connect(lp); oscB.connect(lp);

      // 缓慢的音量起伏，让铺底"呼吸"
      const lfo = ctx.createOscillator();
      lfo.frequency.value = p.lfoRate * (1 + i * 0.15);
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = vGain.gain.value * 0.5;
      lfo.connect(lfoGain);
      lfoGain.connect(vGain.gain);

      oscA.start(); oscB.start(); lfo.start();
      nodes.push({ stop: () => { try { oscA.stop(); oscB.stop(); lfo.stop(); oscA.disconnect(); oscB.disconnect(); lfo.disconnect(); lfoGain.disconnect(); lp.disconnect(); vGain.disconnect(); } catch { /* ignore */ } } });
    });

    // lobby 多一层很轻的脉冲，制造一点"生活感"
    let beatTimer: number | null = null;
    if (p.beat) {
      const root = p.chord[2];
      beatTimer = window.setInterval(() => {
        if (this.settings.muted) return;
        this.tone({ freq: root * 2, dur: 0.18, type: 'sine', gain: 0.05, bus: 'bgm', release: 0.16 });
      }, p.beat * 1000 * 4);
    }

    return () => {
      nodes.forEach(n => n.stop());
      if (beatTimer != null) clearInterval(beatTimer);
    };
  }

  /** 升级庆祝时压低 BGM。 */
  duckBgm(): void {
    this.bgmDucked = true;
    this.applyVolumes();
  }

  restoreBgm(ms = 600): void {
    void ms;
    this.bgmDucked = false;
    this.applyVolumes();
  }

  stopBgm(ms = 400): void {
    const cur = this.currentBgm;
    if (!cur || !this.ctx) return;
    this.currentBgm = null;
    try {
      const t = this.ctx.currentTime;
      cur.gain.gain.cancelScheduledValues(t);
      cur.gain.gain.setValueAtTime(cur.gain.gain.value, t);
      cur.gain.gain.linearRampToValueAtTime(0.0001, t + Math.max(0.05, ms / 1000));
    } catch { /* ignore */ }
    window.setTimeout(() => { try { cur.stop(); } catch { /* ignore */ } }, ms + 120);
  }
}

export const audioManager = new AudioManager();

// onClickCapture 用的通用 UI 点击音：给屏幕根元素挂上即可覆盖其中所有按钮。
// 用 data-sfx="confirm" 覆盖音色；data-sfx-silent 关闭该元素的点击音。
export const handleUiClickSfx = (e: React.MouseEvent): void => {
  const target = e.target as HTMLElement | null;
  if (!target || typeof target.closest !== 'function') return;
  const el = target.closest('button, a[role="button"], [role="button"], [data-sfx]') as HTMLElement | null;
  if (!el) return;
  if (el.hasAttribute('data-sfx-silent')) return;
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
  audioManager.playSfx(el.getAttribute('data-sfx') || 'click');
};
