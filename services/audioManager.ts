import { Howl, Howler } from 'howler';

// ============================================================================
// 🔊 AudioManager —— 全局音效 / BGM 单例
//
// 设计要点（见 public/audio/README.md）：
//  - 单例：触发点大多在 App.tsx 的普通函数里（applyRelationship / handleQuizAnswer
//    等），无法用 hook，所以核心必须是可在任意模块 import 的单例。
//  - React 组件想读音量/静音状态时，用 hooks/useAudioSettings.ts（useSyncExternalStore）。
//  - 自动播放策略：浏览器要求首次用户手势后才能出声。BGM 在 unlock() 之前只记
//    pendingBgm，绝不 play()。SFX 在 unlock 前调用也安全（howler 内部会排队 /
//    Howler.autoUnlock 兜底），只是可能被浏览器丢弃。
//  - StrictMode：init() / unlock() / crossfadeBgm(同曲) 全部幂等。
//  - 素材缺失：加载失败只 console.warn 一次，播放变 no-op，绝不抛错、绝不卡游戏。
// ============================================================================

export type AudioBus = 'bgm' | 'sfx' | 'typing';
export type BgmTrack = 'title' | 'lobby' | 'chat';

export interface AudioSettings {
  master: number;        // 0..1 总音量
  bgm: number;           // 0..1
  sfx: number;           // 0..1
  typing: number;        // 0..1
  muted: boolean;
  typingEnabled: boolean;
}

const STORAGE_KEY = 'kobe_study_audio_v1';
const AUDIO_BASE = '/audio';
// 缺 manifest 时的探测顺序：真实素材是 .mp3，合成占位音是 .wav
const PROBE_EXTS = ['mp3', 'wav'] as const;

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  master: 1,
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
  click:        { vol: 0.45 },
  page:         { vol: 0.40 },
  type:         { vol: 1.0, bus: 'typing' },
  send:         { vol: 0.55 },
  receive:      { vol: 0.50 },
  collect:      { vol: 0.55 },
  error:        { vol: 0.55 },
  modal_open:   { vol: 0.45 },
  confirm:      { vol: 0.50 },
  // 关系反馈
  affection_up:        { vol: 0.65 },
  familiarity_up:      { vol: 0.65 },
  relation_down:       { vol: 0.55 },
  levelup_affection:   { vol: 0.80 },
  levelup_familiarity: { vol: 0.80 },
  unlock:              { vol: 0.70 },
  // 答题
  quiz_correct: { vol: 0.70 },
  quiz_wrong:   { vol: 0.60 },
  // 骰子
  dice_rattle:    { vol: 0.45, loop: true },
  dice_land_low:  { vol: 0.60 },
  dice_land_mid:  { vol: 0.60 },
  dice_land_high: { vol: 0.70 },
  // 场景转换
  enter_chat: { vol: 0.55 },
  leave_chat: { vol: 0.50 },
};

export type SfxName = keyof typeof SFX_DEFS | string;

interface LoadedSfx {
  howl: Howl | null;
  def: SfxDef;
  status: 'loading' | 'ready' | 'error';
  candidates: string[];
  idx: number;
}

interface LoadedBgm {
  howl: Howl;
  status: 'loading' | 'ready' | 'error';
}

interface AudioManifest {
  files?: Record<string, string>; // "sfx/click" -> "mp3" | "wav" | ...
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

class AudioManager {
  private settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
  private listeners = new Set<() => void>();

  private initialized = false;
  private unlocked = false;

  private manifest: AudioManifest | null = null;
  private manifestLoaded = false;

  private sfx = new Map<string, LoadedSfx>();
  private bgm = new Map<BgmTrack, LoadedBgm>();

  private currentBgm: { track: BgmTrack; id: number } | null = null;
  private pendingBgm: BgmTrack | null = null;
  private bgmDucked = false;

  private lastTypeAt = 0;
  private diceRattleId: number | null = null;

  // ---- 生命周期 -----------------------------------------------------------

  /** App 挂载时调用一次。幂等。 */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.loadSettings();
    Howler.volume(this.settings.master);
    Howler.mute(this.settings.muted);

    // manifest 是可选优化：有它就只按清单加载（占位模式下零 404）；
    // 没有就退化为 mp3→wav 探测（真实素材齐全时同样零 404）。
    this.loadManifest().then(() => {
      for (const name of Object.keys(SFX_DEFS)) this.ensureSfx(name);
    });
  }

  /** 首次用户手势时调用（App.tsx 监听 pointerdown/keydown）。幂等。 */
  unlock(): void {
    if (this.unlocked) return;
    this.unlocked = true;
    try {
      const ctx: AudioContext | undefined = (Howler as unknown as { ctx?: AudioContext }).ctx;
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    } catch { /* ignore */ }
    if (this.pendingBgm) {
      const t = this.pendingBgm;
      this.pendingBgm = null;
      this.crossfadeBgm(t, 700);
    }
  }

  isUnlocked(): boolean { return this.unlocked; }

  // ---- 设置 / 订阅 ------------------------------------------------------

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  };

  getSnapshot = (): AudioSettings => this.settings;

  setBusVolume(bus: AudioBus | 'master', v: number): void {
    this.update({ [bus]: clamp01(v) } as Partial<AudioSettings>);
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings)); } catch { /* 隐私模式等 */ }
  }

  private busVol(bus: AudioBus): number {
    if (bus === 'bgm') return this.settings.bgm;
    if (bus === 'typing') return this.settings.typing;
    return this.settings.sfx;
  }

  private applyVolumes(): void {
    try {
      Howler.volume(this.settings.master);
      Howler.mute(this.settings.muted);
    } catch { /* ignore */ }
    for (const loaded of this.sfx.values()) {
      if (loaded.howl) {
        const bus = loaded.def.bus ?? 'sfx';
        loaded.howl.volume(this.busVol(bus) * loaded.def.vol);
      }
    }
    if (this.currentBgm) {
      const b = this.bgm.get(this.currentBgm.track);
      if (b) b.howl.volume(this.settings.bgm * (this.bgmDucked ? 0.3 : 1), this.currentBgm.id);
    }
  }

  // ---- manifest ---------------------------------------------------------

  private async loadManifest(): Promise<void> {
    if (this.manifestLoaded) return;
    this.manifestLoaded = true;
    try {
      const res = await fetch(`${AUDIO_BASE}/manifest.json`, { cache: 'no-cache' });
      if (res.ok) this.manifest = await res.json();
    } catch { /* 无 manifest：走探测 */ }
  }

  private candidatesFor(category: 'sfx' | 'bgm', name: string): string[] {
    const key = `${category}/${name}`;
    const ext = this.manifest?.files?.[key];
    if (ext) return [`${AUDIO_BASE}/${category}/${name}.${ext}`];
    // 无 manifest 条目：按 PROBE_EXTS 依次探测
    return PROBE_EXTS.map(e => `${AUDIO_BASE}/${category}/${name}.${e}`);
  }

  // ---- SFX ------------------------------------------------------------

  private ensureSfx(name: string): void {
    if (this.sfx.has(name)) return;
    const def = SFX_DEFS[name] ?? { vol: 0.5 };
    const candidates = this.candidatesFor('sfx', name);
    if (candidates.length === 0) {
      this.sfx.set(name, { howl: null, def, status: 'error', candidates, idx: 0 });
      return;
    }
    const loaded: LoadedSfx = { howl: null, def, status: 'loading', candidates, idx: 0 };
    this.sfx.set(name, loaded);
    this.loadSfxCandidate(name);
  }

  private loadSfxCandidate(name: string): void {
    const l = this.sfx.get(name);
    if (!l) return;
    const src = l.candidates[l.idx];
    const bus = l.def.bus ?? 'sfx';
    const howl = new Howl({
      src: [src],
      volume: this.busVol(bus) * l.def.vol,
      loop: !!l.def.loop,
      preload: true,
      onload: () => { l.status = 'ready'; },
      onloaderror: () => {
        try { l.howl?.unload(); } catch { /* ignore */ }
        if (l.idx < l.candidates.length - 1) {
          l.idx += 1;
          this.loadSfxCandidate(name);
        } else {
          l.status = 'error';
          l.howl = null;
          console.warn(
            `[audio] 缺少音效 "${name}"（尝试过 ${l.candidates.join(', ')}）— ` +
            `放入真实素材或运行 npm run audio:placeholders`
          );
        }
      },
    });
    l.howl = howl;
  }

  /** 播放一次短音效。素材缺失时静默返回。 */
  playSfx(name: SfxName, opts?: { volume?: number; rate?: number }): number | undefined {
    if (this.settings.muted) return undefined;
    let l = this.sfx.get(name);
    if (!l) { this.ensureSfx(name); l = this.sfx.get(name); }
    if (!l || l.status === 'error' || !l.howl) return undefined;
    try {
      const id = l.howl.play();
      if (opts?.volume != null) l.howl.volume(clamp01(opts.volume), id);
      if (opts?.rate != null) l.howl.rate(Math.max(0.5, Math.min(4, opts.rate)), id);
      return id;
    } catch {
      return undefined;
    }
  }

  /** 打字音：内部节流 + 随机 pitch，避免机关枪感。 */
  playTypeBlip(): void {
    if (!this.settings.typingEnabled || this.settings.muted) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastTypeAt < 45) return;
    this.lastTypeAt = now;
    this.playSfx('type', { rate: 0.9 + Math.random() * 0.35 });
  }

  startDiceRattle(): void {
    if (this.settings.muted) return;
    if (this.diceRattleId != null) return; // 幂等
    const l = this.sfx.get('dice_rattle');
    if (!l || l.status === 'error' || !l.howl) return;
    try { this.diceRattleId = l.howl.play(); } catch { this.diceRattleId = null; }
  }

  stopDiceRattle(): void {
    const l = this.sfx.get('dice_rattle');
    if (l?.howl && this.diceRattleId != null) {
      try { l.howl.stop(this.diceRattleId); } catch { /* ignore */ }
    }
    this.diceRattleId = null;
  }

  playDiceLand(face: number): void {
    this.stopDiceRattle();
    const name = face >= 5 ? 'dice_land_high' : face >= 3 ? 'dice_land_mid' : 'dice_land_low';
    this.playSfx(name);
  }

  // ---- BGM ------------------------------------------------------------

  private ensureBgm(track: BgmTrack): LoadedBgm | null {
    const existing = this.bgm.get(track);
    if (existing) return existing.status === 'error' ? null : existing;

    const candidates = this.candidatesFor('bgm', track);
    if (candidates.length === 0) return null;

    const state: LoadedBgm = { howl: null as unknown as Howl, status: 'loading' };
    const tryLoad = (idx: number) => {
      const howl = new Howl({
        src: [candidates[idx]],
        loop: true,
        html5: true,           // 长音乐走 <audio> 流式，省内存
        preload: true,
        volume: 0,
        onload: () => { state.status = 'ready'; },
        onloaderror: () => {
          try { howl.unload(); } catch { /* ignore */ }
          if (idx < candidates.length - 1) {
            tryLoad(idx + 1);
          } else {
            state.status = 'error';
            console.warn(
              `[audio] 缺少 BGM "${track}"（尝试过 ${candidates.join(', ')}）— ` +
              `放入真实素材或运行 npm run audio:placeholders`
            );
          }
        },
      });
      state.howl = howl;
    };
    tryLoad(0);
    this.bgm.set(track, state);
    return state;
  }

  /** 切换 BGM，交叉淡入淡出。解锁前只记 pendingBgm。幂等（同曲不重播）。 */
  crossfadeBgm(track: BgmTrack, ms = 800): void {
    if (!this.unlocked) { this.pendingBgm = track; return; }
    if (this.currentBgm?.track === track) return;

    const next = this.ensureBgm(track);
    const prev = this.currentBgm;
    this.currentBgm = null;
    this.bgmDucked = false;

    // 淡出旧曲
    if (prev) {
      const prevState = this.bgm.get(prev.track);
      if (prevState?.howl) {
        const h = prevState.howl;
        const pid = prev.id;
        try {
          h.fade(h.volume(pid) as number, 0, ms, pid);
          window.setTimeout(() => { try { h.stop(pid); } catch { /* ignore */ } }, ms + 80);
        } catch { /* ignore */ }
      }
    }

    if (!next || !next.howl) return;

    try {
      const id = next.howl.play();
      next.howl.loop(true, id);
      next.howl.volume(0, id);
      next.howl.fade(0, this.settings.bgm, ms, id);
      this.currentBgm = { track, id };
    } catch { /* ignore */ }
  }

  /** 升级庆祝时压低 BGM。 */
  duckBgm(ms = 300): void {
    if (!this.currentBgm) return;
    this.bgmDucked = true;
    const b = this.bgm.get(this.currentBgm.track);
    if (b?.howl) {
      try { b.howl.fade(b.howl.volume(this.currentBgm.id) as number, this.settings.bgm * 0.3, ms, this.currentBgm.id); } catch { /* ignore */ }
    }
  }

  restoreBgm(ms = 600): void {
    if (!this.currentBgm) { this.bgmDucked = false; return; }
    this.bgmDucked = false;
    const b = this.bgm.get(this.currentBgm.track);
    if (b?.howl) {
      try { b.howl.fade(b.howl.volume(this.currentBgm.id) as number, this.settings.bgm, ms, this.currentBgm.id); } catch { /* ignore */ }
    }
  }

  stopBgm(ms = 400): void {
    if (!this.currentBgm) return;
    const cur = this.currentBgm;
    this.currentBgm = null;
    const b = this.bgm.get(cur.track);
    if (b?.howl) {
      const h = b.howl;
      try {
        h.fade(h.volume(cur.id) as number, 0, ms, cur.id);
        window.setTimeout(() => { try { h.stop(cur.id); } catch { /* ignore */ } }, ms + 80);
      } catch { /* ignore */ }
    }
  }
}

export const audioManager = new AudioManager();

// onClickCapture 用的通用 UI 点击音：给屏幕根元素挂上即可覆盖其中所有按钮。
// 用 data-sfx="confirm" 覆盖音色；data-sfx-silent 关闭该元素的点击音。
export const handleUiClickSfx = (e: React.MouseEvent): void => {
  const target = e.target as HTMLElement | null;
  if (!target || typeof target.closest !== 'function') return;
  const el = target.closest('button, a[role="button"], [data-sfx]') as HTMLElement | null;
  if (!el) return;
  if (el.hasAttribute('data-sfx-silent')) return;
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
  audioManager.playSfx(el.getAttribute('data-sfx') || 'click');
};
