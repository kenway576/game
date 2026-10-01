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
//      2) 没有素材 → 音效用 OscillatorNode / 噪声实时合成一个占位音；
//         BGM 不合成（以前那个单音节垫音删掉了），没有文件就安静。
//    把真素材丢进 public/audio/ 并更新 manifest.json 即自动切换，代码不用动。
//  - 自动播放策略：浏览器要求首次用户手势后才能出声。被拦下的那首 BGM 留着，
//    unlock() 里补放；BGM 同一时刻只会有一首在响（见 crossfadeBgm）。
//  - StrictMode：init() / unlock() / crossfadeBgm(同曲) 全部幂等。
//  - 素材缺失 / 解码失败：只 console.info 一次，播放静默降级，绝不抛错、绝不卡游戏。
// ============================================================================

import type React from 'react';
import type { StoryBgmTrack } from '../types';

export type AudioBus = 'bgm' | 'sfx' | 'typing';
// 剧本能点名的轨与这里是同一套（types.StoryBgmTrack 是单一事实来源）。
// train/town/store/night 是序章分场景用的：整段序章共用一首大厅曲太平了。
export type BgmTrack = StoryBgmTrack;

export interface AudioSettings {
  master: number;        // 0..1 总音量
  bgm: number;           // 0..1
  sfx: number;           // 0..1
  typing: number;        // 0..1
  muted: boolean;
  typingEnabled: boolean; // 打字音单独可关
  bgmEnabled: boolean;    // 背景音乐单独可关（区别于把音量拉到 0：音量值会留着）
}

const STORAGE_KEY = 'kobe_study_audio_v1';
const AUDIO_BASE = '/audio';

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  master: 0.9,
  bgm: 0.6,        // 决策：BGM 默认 60%，清晰动听
  sfx: 0.7,
  typing: 0.35,
  muted: false,
  typingEnabled: true,
  bgmEnabled: true,
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
  // "lobby" -> "bgm/xxx.mp3"，或者一组文件（曲库）：
  // 一首自然放完（这批曲子结尾都是淡出）就接同一组里的下一首，
  // 不会每三分钟一段静音再从头来。
  bgm?: Record<string, string | string[]>;
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
  private warned = new Set<string>();

  // BGM 运行时
  private currentBgm: { track: BgmTrack; url: string; audio: HTMLAudioElement } | null = null;
  // 场景想放哪首。BGM 关着的时候也记着，打开时接上。
  private wantedBgm: BgmTrack | null = null;
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
    // 清单最先拉：BGM 用的是 <audio>，不依赖下面的 Web Audio。
    // 放在后面的话，AudioContext 一初始化失败就提前 return，BGM 会永远等清单。
    void this.loadManifest();

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
    }
  }

  /** 首次用户手势时调用（App.tsx 监听 pointerdown / keydown）。幂等。 */
  unlock(): void {
    const ctx = this.ctx;
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }
    this.unlocked = true;
    // 被浏览器拦下来的那一首：现在补放（只放当前这一首，旧的早就停了）
    if (this.settings.bgmEnabled && this.currentBgm && this.currentBgm.audio.paused) {
      this.startBgmAudio(this.currentBgm.audio, this.bgmGen, 800);
    } else if (this.settings.bgmEnabled && !this.currentBgm && this.wantedBgm) {
      this.crossfadeBgm(this.wantedBgm, 800);
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

  setBgmEnabled(enabled: boolean): void {
    this.update({ bgmEnabled: enabled });
    if (!enabled) this.stopBgm(400);
    else this.crossfadeBgm(this.wantedBgm || 'lobby', 600);
  }
  toggleBgm(): void { this.setBgmEnabled(!this.settings.bgmEnabled); }

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
        // 存坏了（不是数字）才纠正。玩家自己关掉的 BGM、调低的音量、静音都原样保留——
        // 以前这里每次启动都强制打开 BGM、取消静音，设置里关掉的东西一刷新又响了。
        if (typeof this.settings.bgm !== 'number' || isNaN(this.settings.bgm)) {
          this.settings.bgm = DEFAULT_AUDIO_SETTINGS.bgm;
        }
      }
    } catch { /* 用默认值 */ }
  }

  private persist(): void {
    try {
      // 只存这几个键，跟约定一致
      const { master, bgm, sfx, typing, muted, typingEnabled, bgmEnabled } = this.settings;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ master, bgm, sfx, typing, muted, typingEnabled, bgmEnabled }));
    } catch { /* 隐私模式等 */ }
  }

  private getTargetBgmVolume(): number {
    if (this.settings.muted || !this.settings.bgmEnabled) return 0;
    const duckFactor = this.bgmDucked ? 0.35 : 1.0;
    return clamp01(this.settings.master * this.settings.bgm * duckFactor);
  }

  private applyVolumes(immediate = false): void {
    const ctx = this.ctx;
    if (ctx && this.masterGain && this.busGain) {
      const t = ctx.currentTime;
      const ramp = (g: GainNode, target: number) => {
        try {
          g.gain.cancelScheduledValues(t);
          if (immediate) g.gain.setValueAtTime(target, t);
          else g.gain.setTargetAtTime(target, t, 0.03);
        } catch { try { g.gain.value = target; } catch { /* ignore */ } }
      };
      ramp(this.masterGain, this.settings.muted ? 0 : this.settings.master);
      ramp(this.busGain.bgm, this.settings.bgmEnabled ? this.settings.bgm * (this.bgmDucked ? 0.35 : 1) : 0);
      ramp(this.busGain.sfx, this.settings.sfx);
      ramp(this.busGain.typing, this.settings.typing);
    }

    if (this.currentBgm && !this.currentBgm.audio.paused) {
      this.rampAudioVolume(this.currentBgm.audio, this.getTargetBgmVolume(), immediate ? 50 : 150);
    }
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
    // 清单到了：启动时那首（标题曲）是在清单到之前点的，现在才知道它对应哪个文件
    this.manifestDone = true;
    if (this.wantedBgm && !this.currentBgm) this.crossfadeBgm(this.wantedBgm, 800);
  }

  private urlFor(category: 'sfx' | 'bgm', name: string): string | null {
    const raw = this.manifest?.[category]?.[name];
    const entry = Array.isArray(raw) ? raw[0] : raw;
    if (entry) {
      if (entry.startsWith('/')) return entry;
      if (entry.startsWith(`${category}/`)) return `${AUDIO_BASE}/${entry}`;
      if (entry.includes('/')) return `${AUDIO_BASE}/${entry}`;
      if (entry.includes('.')) return `${AUDIO_BASE}/${category}/${entry}`;
      return `${AUDIO_BASE}/${category}/${name}.${entry}`;
    }
    return `${AUDIO_BASE}/${category}/${name}.mp3`;
  }

  /** 这个曲目名对应的整组文件（曲库）。只写了一个文件的就是一组一首。 */
  private bgmPool(track: string): string[] {
    const raw = this.manifest?.bgm?.[track];
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const urls = list.map(e =>
      e.startsWith('/') ? e
      : e.includes('/') ? `${AUDIO_BASE}/${e}`
      : `${AUDIO_BASE}/bgm/${e}`);
    if (!urls.length) { const u = this.urlFor('bgm', track); if (u) urls.push(u); }
    return urls;
  }

  /** 从曲库里挑一首：尽量别跟刚才那首一样 */
  private pickFromPool(pool: string[], avoid?: string): string | null {
    if (!pool.length) return null;
    const rest = pool.length > 1 && avoid ? pool.filter(u => u !== avoid) : pool;
    return rest[Math.floor(Math.random() * rest.length)];
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

  private chord(freqs: number[], opts: { dur: number; type?: OscillatorType; gain?: number; bus?: AudioBus; when?: number; stagger?: number; slide?: number; vibrato?: { rate: number; depth: number } }): void {
    freqs.forEach((f, i) => this.tone({
      freq: f, dur: opts.dur, type: opts.type, gain: (opts.gain ?? 0.4) / Math.sqrt(freqs.length),
      // when 是整个和弦的起始偏移，stagger 是弦内各音的错开量——两者叠加
      bus: opts.bus, when: (opts.when ?? 0) + i * (opts.stagger ?? 0), release: opts.dur * 0.5,
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
  //
  // 规矩只有一条：任何时刻最多一首在响。
  //
  //   · 每次点歌 bgmGen + 1。播放成功的回调里先对代号，过期的（中途又点了别的）直接停掉——
  //     以前这种情况会报 AbortError，被当成"自动播放被拦截"记下来，
  //     下次点屏幕时又被拉起来，跟当前那首一起响。
  //   · 淡入淡出用 setInterval，不用 requestAnimationFrame：标签页切到后台 rAF 就停了，
  //     旧曲既淡不出去、也走不到 pause 那一步。
  //   · 旧曲到点一律 pause，不管音量渐变有没有走完（兜底计时器）。
  //   · 两个曲目名指向同一个文件（大厅和街道都是 Velvet Pavement）就接着放，不从头来。
  //   · 没有文件就安静。以前会退回合成器垫音——那个"单音节"的嗡嗡声，
  //     而且文件晚到一步时两样会叠在一起响。

  private bgmGen = 0;
  private manifestDone = false;
  private bgmRamps = new WeakMap<HTMLAudioElement, number>();

  private rampAudioVolume(audio: HTMLAudioElement, targetVol: number, ms: number, onDone?: () => void): void {
    const prevTimer = this.bgmRamps.get(audio);
    if (prevTimer) window.clearInterval(prevTimer);
    const startVol = audio.volume;
    const t0 = now();
    const duration = Math.max(50, ms);
    const id = window.setInterval(() => {
      const p = Math.min(1, (now() - t0) / duration);
      try { audio.volume = clamp01(startVol + (targetVol - startVol) * p); } catch { /* ignore */ }
      if (p >= 1) {
        window.clearInterval(id);
        this.bgmRamps.delete(audio);
        onDone?.();
      }
    }, 30);
    this.bgmRamps.set(audio, id);
  }

  /** 让一首退场：淡出，到点必停。 */
  private retireBgm(audio: HTMLAudioElement, ms: number): void {
    let done = false;
    const kill = () => {
      if (done) return;
      done = true;
      const t = this.bgmRamps.get(audio);
      if (t) window.clearInterval(t);
      this.bgmRamps.delete(audio);
      try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch { /* ignore */ }
    };
    if (ms <= 0 || audio.paused) { kill(); return; }
    this.rampAudioVolume(audio, 0, ms, kill);
    window.setTimeout(kill, ms + 200);
  }

  private startBgmAudio(audio: HTMLAudioElement, gen: number, ms: number): void {
    audio.play().then(() => {
      // 这期间又点了别的歌：这一首作废
      if (gen !== this.bgmGen || this.currentBgm?.audio !== audio) { this.retireBgm(audio, 0); return; }
      this.unlocked = true;
      this.rampAudioVolume(audio, this.getTargetBgmVolume(), ms);
    }).catch((err: unknown) => {
      if (gen !== this.bgmGen) return;   // 被后来的点歌顶掉了，不是被拦截
      const e = err as { name?: string };
      if (e?.name === 'NotAllowedError') {
        this.infoOnce('bgm-autoplay-blocked', '[audio] 浏览器拦截了自动播放，点一下页面后开始放 BGM');
      } else {
        this.infoOnce(`bgm-err:${this.currentBgm?.track}`, `[audio] BGM 播放失败：${String(e?.name || err)}`);
      }
    });
  }

  /** 切换 BGM，交叉淡入淡出。幂等：同一首（或同一个文件）不重播。 */
  crossfadeBgm(track: BgmTrack, ms = 800): void {
    this.wantedBgm = track;
    if (!this.settings.bgmEnabled) { this.stopBgm(ms); return; }
    // 清单还没到：不知道这首对应哪个文件，先记着，清单一到就放（见 loadManifest）
    if (!this.manifestDone) return;

    const pool = this.bgmPool(track);
    const cur = this.currentBgm;
    // 正在放的这首也在新场景的曲库里（大厅 → 聊天、街上 → 地图）：接着放，不换歌
    if (cur && pool.includes(cur.url)) {
      cur.track = track;
      if (cur.audio.paused && this.unlocked) this.startBgmAudio(cur.audio, this.bgmGen, ms);
      return;
    }

    const gen = ++this.bgmGen;
    this.currentBgm = null;
    this.bgmDucked = false;
    if (cur) this.retireBgm(cur.audio, ms);
    const url = this.pickFromPool(pool);
    if (!url) return;
    this.playBgmFile(track, url, gen, ms);
  }

  /** 起一首。不循环：放完（结尾自带淡出）由 nextInPool 接下一首。 */
  private playBgmFile(track: BgmTrack, url: string, gen: number, ms: number): void {
    const audio = new Audio(url);
    audio.loop = false;
    audio.volume = 0;
    audio.preload = 'auto';
    audio.addEventListener('error', () => {
      if (gen === this.bgmGen) this.infoOnce(`bgm-load-err:${url}`, `[audio] BGM 文件加载失败（${url}），这段先安静着`);
    });
    audio.addEventListener('ended', () => this.nextInPool(audio));
    this.currentBgm = { track, url, audio };
    this.startBgmAudio(audio, gen, ms);
  }

  /** 一首放完了：同一组里换一首接上。期间切过场景的话，这首早就不是"当前"了，什么都不做。 */
  private nextInPool(finished: HTMLAudioElement): void {
    const cur = this.currentBgm;
    if (!cur || cur.audio !== finished || !this.settings.bgmEnabled) return;
    const gen = ++this.bgmGen;
    this.retireBgm(finished, 0);
    const url = this.pickFromPool(this.bgmPool(cur.track), cur.url) || cur.url;
    this.playBgmFile(cur.track, url, gen, 1500);
  }

  /** 升级庆祝或重要对白时压低 BGM。 */
  duckBgm(): void {
    this.bgmDucked = true;
    if (this.currentBgm) this.rampAudioVolume(this.currentBgm.audio, this.getTargetBgmVolume(), 150);
  }

  restoreBgm(ms = 600): void {
    this.bgmDucked = false;
    if (this.currentBgm) this.rampAudioVolume(this.currentBgm.audio, this.getTargetBgmVolume(), ms);
  }

  stopBgm(ms = 400): void {
    this.bgmGen++;
    const cur = this.currentBgm;
    this.currentBgm = null;
    if (cur) this.retireBgm(cur.audio, ms);
  }
}

export const audioManager = new AudioManager();

// onClickCapture 用的通用 UI 点击音：给屏幕根元素挂上即可覆盖其中所有按钮。
// 用 data-sfx="confirm" 覆盖音色；data-sfx-silent 关闭该元素的点击音。
export const handleUiClickSfx = (e: React.MouseEvent): void => {
  audioManager.unlock();
  const target = e.target as HTMLElement | null;
  if (!target || typeof target.closest !== 'function') return;
  const el = target.closest('button, a[role="button"], [role="button"], [data-sfx]') as HTMLElement | null;
  if (!el) return;
  if (el.hasAttribute('data-sfx-silent')) return;
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
  audioManager.playSfx(el.getAttribute('data-sfx') || 'click');
};
