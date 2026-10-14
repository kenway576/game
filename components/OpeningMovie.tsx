import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OP_MUSIC, OP_SHOTS, OpShot } from '../data/opening';
import { audioManager } from '../services/audioManager';
import { Language } from '../types';

// ---------------------------------------------------------
// 🎬 开场动画（OP）
//
// 素材是 18 个镜头：每个镜头一张 Gemini 画的首帧 + 一段 Veo 图生视频（8 秒）。
// 切点卡在曲子的小节线上（每 4 小节一刀，见 scripts/op/gen-op.mjs data）。
//
// 【为什么画在 canvas 上，而不是直接放 <video>】
// Veo 出来的是 24 帧顺滑运动，跟"日式 TV 动画一拍三"正好相反。
// 所以视频只当素材：每秒只采 8 张（= 24 帧里每 3 帧取 1 张）画到 canvas 上，
// 中间那两帧就停在原画上——这就是"跳帧感"。没有视频的镜头（定格、还没生成的）
// 用首帧做推镜，推镜本身也按 8 fps 一格一格地走。
//
// 结尾标题字的动画也用 steps()，同一个节拍。
// 不打人名卡：用户要的是纯粹的动漫 OP，人物让画面自己介绍。
//
// 【后日谈也用它】shots / music / subtitles 都能从外面传进来（不传就是 OP）。
// 后日谈最后那一镜她转过来对着镜头说话——Veo 不出声音，所以台词是按时间点
// 叠在画面上的字幕（subtitles），跟一拍三一样按格出现。
// ---------------------------------------------------------

const FPS = 8;                 // 一拍三：24 / 3
const FLASH_FRAMES = 2;        // 每一刀开头白闪两格
const TAIL = 1.6;              // 最后一个镜头结束后，留给音乐收尾的秒数

// 一句字幕：start/end 是从音乐开头算的秒数
export interface MovieLine { start: number; end: number; jp?: string; zh: string; en: string }

interface Props {
  language: Language;
  onClose: () => void;
  shots?: OpShot[];
  music?: string;
  subtitles?: MovieLine[];
  // 跳过按钮上的字、点一下才能放时按钮上的字
  playLabelZh?: string;
  playLabelEn?: string;
  // 字幕里的 {name} 换成玩家名（后日谈里她会叫主角的名字，也会叫屏幕前的你）
  playerName?: string;
}

const OpeningMovie: React.FC<Props> = ({ language, onClose, shots = OP_SHOTS, music = OP_MUSIC, subtitles = [], playLabelZh = '播放开场动画', playLabelEn = 'PLAY OPENING', playerName = '' }) => {
  const fillName = (t?: string) => (t ? t.replace(/\{name\}/g, playerName || (language === 'en' ? 'you' : '你')) : t);
  const SHOTS = shots;
  const en = language === 'en';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videos = useRef<Map<string, HTMLVideoElement>>(new Map());
  const images = useRef<Map<string, HTMLImageElement>>(new Map());
  const [shotIdx, setShotIdx] = useState(-1);
  const [subIdx, setSubIdx] = useState(-1);
  const [needTap, setNeedTap] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const closed = useRef(false);

  const finish = useCallback(() => {
    if (closed.current) return;
    closed.current = true;
    setLeaving(true);
    const a = audioRef.current;
    // 音乐不硬切：0.6 秒淡出
    if (a) {
      const v0 = a.volume;
      const t0 = performance.now();
      const fade = () => {
        const k = Math.min(1, (performance.now() - t0) / 600);
        a.volume = v0 * (1 - k);
        if (k < 1) requestAnimationFrame(fade); else a.pause();
      };
      fade();
    }
    window.setTimeout(() => { audioManager.resumeBgm(); onClose(); }, 650);
  }, [onClose]);

  // 素材：图先全部挂上（小），视频只预取当前和后两个
  const ensureMedia = useCallback((i: number) => {
    for (let k = i; k < Math.min(SHOTS.length, i + 3); k++) {
      const s = SHOTS[k];
      if (s.video && !videos.current.has(s.id)) {
        const v = document.createElement('video');
        v.src = s.video; v.muted = true; v.playsInline = true; v.preload = 'auto';
        v.load();
        videos.current.set(s.id, v);
      }
    }
  }, []);

  useEffect(() => {
    SHOTS.forEach(s => {
      const im = new Image();
      im.src = s.image;
      images.current.set(s.id, im);
    });
    ensureMedia(0);

    const a = new Audio(music);
    a.volume = Math.max(0, Math.min(1, audioManager.effectiveVolume('bgm') || 0));
    a.preload = 'auto';
    audioRef.current = a;
    audioManager.suspendBgm();
    // 只有"浏览器不让自动放声音"（NotAllowedError）才要玩家点一下。
    // AbortError 是 play() 被随后的 pause() 打断（开发模式下组件会挂两次），不算。
    a.play().catch(e => { if (e?.name === 'NotAllowedError') setNeedTap(true); });
    a.addEventListener('ended', finish);

    return () => {
      a.pause();
      a.removeEventListener('ended', finish);
      videos.current.forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
      videos.current.clear();
      if (!closed.current) audioManager.resumeBgm();
    };
  }, [ensureMedia, finish]);

  // 键盘：Esc / Enter / 空格 跳过
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  // 主循环：只在"格"变了的时候重画
  useEffect(() => {
    let raf = 0;
    let lastFrame = -1;
    let lastShot = -1;
    const cv = canvasRef.current!;
    const ctx = cv.getContext('2d')!;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.min(1920, Math.round(window.innerWidth * dpr));
      const h = Math.round(w * window.innerHeight / window.innerWidth);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; lastFrame = -1; }
    };

    // cover 铺满；zoom > 1 时以 (fx, fy) 为中心推近
    const drawCover = (src: CanvasImageSource, sw: number, sh: number, zoom = 1, fx = 0.5, fy = 0.45) => {
      const W = cv.width, H = cv.height;
      const s = Math.max(W / sw, H / sh) * zoom;
      const dw = sw * s, dh = sh * s;
      ctx.drawImage(src, (W - dw) * fx, (H - dh) * fy, dw, dh);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const a = audioRef.current;
      if (!a) return;
      fit();
      const t = a.currentTime;
      const frame = Math.floor(t * FPS);
      if (frame === lastFrame) return;
      lastFrame = frame;
      setSubIdx(subtitles.findIndex(l => t >= l.start && t < l.end));

      const i = SHOTS.findIndex(s => t >= s.start && t < s.end);
      const last = SHOTS[SHOTS.length - 1];
      if (i === -1 && t >= last.end + TAIL) { finish(); return; }

      if (i !== lastShot) {
        // 换镜头：上一段停掉，这一段从镜头内的时间点开始走
        const prev = SHOTS[lastShot];
        if (prev) videos.current.get(prev.id)?.pause();
        lastShot = i;
        setShotIdx(i);
        if (i >= 0) {
          ensureMedia(i);
          const v = videos.current.get(SHOTS[i].id);
          if (v) { try { v.currentTime = Math.max(0, t - SHOTS[i].start); } catch { /* 还没加载好 */ } v.play().catch(() => {}); }
        }
      }

      ctx.fillStyle = '#0b0e1f';
      ctx.fillRect(0, 0, cv.width, cv.height);
      const shot: OpShot | undefined = SHOTS[i] ?? (t >= last.end ? last : undefined);
      if (!shot) return; // 第一刀之前：黑场

      const local = t - shot.start;
      const v = videos.current.get(shot.id);
      const im = images.current.get(shot.id);
      // 推镜的进度也取整到格：一格一格地推
      const q = Math.floor(local * FPS) / FPS;
      const dur = shot.end - shot.start;
      if (v && v.readyState >= 2 && !shot.still) {
        drawCover(v, v.videoWidth, v.videoHeight);
      } else if (im && im.complete && im.naturalWidth) {
        const zoom = shot.still ? 1 + 0.07 * Math.min(1, q / dur) : 1 + 0.035 * Math.min(1, q / dur);
        drawCover(im, im.naturalWidth, im.naturalHeight, zoom);
      }

      // 每一刀的开头白闪
      const fr = Math.floor(local * FPS);
      if (fr < FLASH_FRAMES && shot === SHOTS[i]) {
        ctx.fillStyle = `rgba(255,250,245,${fr === 0 ? 0.85 : 0.35})`;
        ctx.fillRect(0, 0, cv.width, cv.height);
      }
      // 收尾：最后一个镜头之后慢慢压黑
      if (t >= last.end) {
        ctx.fillStyle = `rgba(11,14,31,${Math.min(1, (t - last.end) / TAIL)})`;
        ctx.fillRect(0, 0, cv.width, cv.height);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ensureMedia, finish]); // eslint-disable-line react-hooks/exhaustive-deps

  const shot = shotIdx >= 0 ? SHOTS[shotIdx] : null;
  const line = subIdx >= 0 ? subtitles[subIdx] : null;
  const isTitle = shot?.id === 'op18_title';

  return (
    <div
      className={`fixed inset-0 z-[600] bg-[#0b0e1f] select-none overflow-hidden transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}
    >
      <style>{`
        @keyframes op-slide { 0% { transform: translateX(-60px); opacity: 0 } 100% { transform: translateX(0); opacity: 1 } }
        @keyframes op-pop { 0% { transform: scale(1.35); opacity: 0 } 60% { transform: scale(0.96); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
        .op-title { animation: op-pop 0.75s steps(6, end) 1.2s both; }
        .op-sub { animation: op-slide 0.5s steps(4, end) 2.2s both; }
        @keyframes op-fade { 0% { opacity: 0 } 100% { opacity: 1 } }
        .op-line { animation: op-fade 0.375s steps(3, end) both; }
      `}</style>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 最后一镜：标题 */}
      {isTitle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-ui">
          <h1 className="op-title text-6xl md:text-[9rem] font-black leading-[0.9] text-center text-white" style={{ textShadow: '0 6px 30px rgba(10,14,40,0.6)' }}>
            KOBE<br />
            <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">STUDY</span>
          </h1>
          <p className="op-sub mt-4 font-story text-pink-100 text-sm md:text-xl tracking-[0.5em] drop-shadow">神戸で過ごす、一年の物語</p>
        </div>
      )}

      {/* 字幕：后日谈最后那一镜她对着镜头说的话 */}
      {line && (
        <div key={subIdx} className="absolute inset-x-0 bottom-[7%] flex flex-col items-center px-6 pointer-events-none op-line">
          {line.jp && (
            <p className="font-story text-white text-xl md:text-4xl font-bold tracking-wide text-center leading-snug" style={{ textShadow: '0 2px 10px rgba(5,8,25,0.95), 0 0 2px rgba(5,8,25,1)' }}>{fillName(line.jp)}</p>
          )}
          <p className="mt-2 font-ui text-pink-100 text-sm md:text-xl text-center" style={{ textShadow: '0 2px 8px rgba(5,8,25,0.95)' }}>{fillName(en ? line.en : line.zh)}</p>
        </div>
      )}

      <button onClick={finish} className="absolute top-4 right-4 ui-chip !bg-white/20 !text-white !border-white/40 hover:!bg-white/40">
        {en ? 'SKIP' : '跳过'} ▸▸
      </button>

      {needTap && (
        <button
          onClick={() => { setNeedTap(false); audioRef.current?.play().catch(() => finish()); }}
          className="absolute inset-0 flex items-center justify-center bg-[#0b0e1f]/70"
        >
          <span className="ui-btn-primary px-10 py-4 text-lg">▶ {en ? playLabelEn : playLabelZh}</span>
        </button>
      )}
    </div>
  );
};

export default OpeningMovie;
