import React, { useState, useMemo } from 'react';
import { GameCalendar, Language, RoomHotspot, StoryFlags, ViewSpot } from '../types';
import { ROOM_HOTSPOTS, ROOM_VIEW_LINES, WINDOW_VIEW_SPOTS, getRoomBackground } from '../constants';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🏠 海风庄 201 室 —— 可互动的自己的房间
//
// 背景按 gameCalendar 的时段 / 天气自动换成同一个房间的对应变体
// （晴 / 阴 / 夕阳 / 雨 / 夜，家具和镜头完全一致）。
//
// 热区坐标用百分比，跟着背景一起缩放；背景本身用 object-cover 铺满，
// 所以热区和画面上的家具在任何屏幕比例下都对得上。
//
// 随剧情解锁：带 requiresFlag 的热区一开始不存在，
// 玩家推到那一步之后房间里能点的东西才变多。
// ---------------------------------------------------------

interface Props {
  language: Language;
  calendar: GameCalendar;
  storyFlags: StoryFlags;
  onClose: () => void;
  onOpenWordbook: () => void;
  onSleep: () => void;
  // 🏺 阳台上的花盆。买了盆才有得点，没有盆就不显示这个按钮——
  // 一个点进去说"你什么都没有"的入口只会让人白跑一趟。
  plotCount: number;
  onOpenBalcony: () => void;
  onOpenKitchen: () => void;
}

const RoomScreen: React.FC<Props> = ({
  language, calendar, storyFlags, onClose, onOpenWordbook, onSleep, plotCount, onOpenBalcony, onOpenKitchen
}) => {
  const en = language === 'en';
  const [active, setActive] = useState<{ hotspot: RoomHotspot; text: string } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  // 点下去那一发扩散环：key 变化即重放动画
  const [burst, setBurst] = useState<{ id: string; key: number } | null>(null);
  // 窗外地标面板
  const [viewOpen, setViewOpen] = useState(false);
  // 学生证：点开是一张卡的大图，不是一句旁白
  const [cardOpen, setCardOpen] = useState(false);
  const [spot, setSpot] = useState<ViewSpot | null>(null);

  const bg = getRoomBackground(calendar);

  // 解锁了的热区才出现
  const spots = useMemo(
    () => ROOM_HOTSPOTS.filter(h => !h.requiresFlag || storyFlags[h.requiresFlag]),
    [storyFlags]
  );
  const lockedCount = ROOM_HOTSPOTS.length - spots.length;

  const pick = (h: RoomHotspot) => {
    audioManager.playSfx(h.action === 'sleep' ? 'confirm' : 'click');
    setBurst({ id: h.id, key: Date.now() });

    if (h.action === 'card') { setCardOpen(true); return; }
    if (h.action === 'view') {
      // 看窗外：打开地标面板。先给一句当下天气的观感，再让玩家一个个认地方。
      setViewOpen(true);
      return;
    }
    setActive({ hotspot: h, text: en ? h.linesEn[0] : h.linesZh[0] });
  };

  const confirmAction = () => {
    const h = active?.hotspot;
    setActive(null);
    if (!h) return;
    if (h.action === 'wordbook') onOpenWordbook();
    if (h.action === 'sleep') onSleep();
  };

  const timeLabel = en
    ? `${calendar.month}/${calendar.day} · ${calendar.timeSlot}`
    : `${calendar.month} 月 ${calendar.day} 日 · ${
        calendar.timeSlot === 'morning' ? '早晨' : calendar.timeSlot === 'afternoon' ? '午后' : '夜里'
      }`;

  return (
    <div className="fixed inset-0 z-[120] bg-black overflow-hidden select-none">
      {/* 背景：同一个房间的当前时段变体 */}
      <img
        key={bg}
        src={bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />

      {/* 顶栏 */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-6 py-3">
        <div className="bg-black/70 backdrop-blur-sm border border-white/20 px-4 py-1.5 transform -skew-x-12">
          <span className="block transform skew-x-12 text-[11px] md:text-sm font-black text-white tracking-widest">
            {en ? 'ROOM 201' : '海风庄 201 室'}
            <span className="ml-3 text-yellow-400/80 font-mono text-[10px] md:text-xs">{timeLabel}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { audioManager.playSfx('click'); onOpenKitchen(); }}
            className="bg-black/70 hover:bg-amber-400 hover:text-black text-amber-300 border border-amber-500/40 px-3 py-1.5 text-[11px] font-black tracking-widest transform -skew-x-12 transition-all backdrop-blur-sm"
          >
            <span className="block transform skew-x-12">🍳 {en ? 'Kitchen' : '厨房'}</span>
          </button>
          {plotCount > 0 && (
            <button
              onClick={() => { audioManager.playSfx('click'); onOpenBalcony(); }}
              className="bg-black/70 hover:bg-emerald-400 hover:text-black text-emerald-300 border border-emerald-500/40 px-3 py-1.5 text-[11px] font-black tracking-widest transform -skew-x-12 transition-all backdrop-blur-sm"
            >
              <span className="block transform skew-x-12">🏺 {en ? 'Balcony' : '阳台'} {plotCount}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all backdrop-blur-sm"
          >
            <span className="block transform skew-x-12">{en ? 'Out ▶' : '出门 ▶'}</span>
          </button>
        </div>
      </div>

      {/* 热区：不画框，只用光。家具不是矩形，光斑也不该是 */}
      {spots.map(h => {
        const on = hovered === h.id;
        return (
          <button
            key={h.id}
            onClick={() => pick(h)}
            onMouseEnter={() => setHovered(h.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
            className="absolute z-20 group focus:outline-none"
            aria-label={en ? h.labelEn : h.labelZh}
          >
            {/* 柔光：椭圆径向渐变，边缘自然散掉，没有可见边界 */}
            <span
              aria-hidden
              className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
              style={{
                opacity: on ? 1 : 0,
                background:
                  'radial-gradient(ellipse at center, rgba(255,244,214,0.30) 0%, rgba(255,226,150,0.14) 42%, rgba(255,214,130,0.05) 62%, transparent 76%)'
              }}
            />

            {/* 指示器：待机时是一个很轻的呼吸点，悬停时张开成环 */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <span className="relative block">
                {/* 缓慢扩散的涟漪，告诉玩家这里可以点 */}
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/50 room-ping"
                  style={{ width: 14, height: 14 }}
                />
                {/* 光点本体 */}
                <span
                  className="block rounded-full room-breathe transition-all duration-300 ease-out"
                  style={{
                    width: on ? 12 : 7,
                    height: on ? 12 : 7,
                    background: on
                      ? 'radial-gradient(circle, #fffdf5 0%, #ffe9b0 60%, rgba(255,214,130,0) 100%)'
                      : 'radial-gradient(circle, rgba(255,253,245,0.92) 0%, rgba(255,233,176,0.55) 65%, rgba(255,214,130,0) 100%)',
                    boxShadow: on
                      ? '0 0 18px 4px rgba(255,224,160,0.55)'
                      : '0 0 8px 1px rgba(255,224,160,0.28)'
                  }}
                />
              </span>
            </span>

            {/* 点击冲击环 */}
            {burst?.id === h.id && (
              <span
                key={burst.key}
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-100/80 room-burst pointer-events-none"
                style={{ width: 18, height: 18 }}
              />
            )}

            {/* 标签卡：只在悬停时从下方浮起 */}
            <span
              aria-hidden
              className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1 whitespace-nowrap transition-all duration-300 ease-out ${
                on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5 pointer-events-none'
              }`}
            >
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/55 backdrop-blur-md px-3 py-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
                <span className="text-sm md:text-base leading-none">{h.icon}</span>
                <span className="text-[11px] md:text-xs font-semibold tracking-wide text-amber-50/95">
                  {en ? h.labelEn : h.labelZh}
                </span>
              </span>
            </span>
          </button>
        );
      })}

      {/* 学生证 */}
      {cardOpen && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
             onClick={() => setCardOpen(false)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src="/images/ui/student_id.webp" alt=""
                 className="w-full border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.7)]" />
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              {en
                ? 'Kaisei Gakuen. Your photograph, taken in the booth outside the consulate. The name line sits under the lamination glare and your own thumb, and you keep not moving either of them.'
                : '海星学園。照片是上周在领事馆门口那台机器里拍的。名字那一行压在覆膜的反光和你自己的拇指底下，你一直没挪开。'}
            </p>
            <button
              onClick={() => { audioManager.playSfx('click'); setCardOpen(false); }}
              className="mt-4 bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-5 py-2 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
            >
              <span className="block transform skew-x-12">{en ? 'Put it away' : '收起来'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 窗外：地标一览 + 单个地标的详解 */}
      {viewOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex flex-col animate-in fade-in duration-200"
          onClick={() => { setSpot(null); setViewOpen(false); }}
        >
          <div
            className="m-auto w-full max-w-5xl max-h-[88dvh] overflow-y-auto p-4 md:p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* 当下这一刻的观感，按天气取 */}
            <p className="text-sm md:text-lg text-amber-50/85 italic leading-relaxed mb-5 text-center">
              {(() => {
                const key = calendar.timeSlot === 'night' ? 'night' : calendar.weather;
                const line = ROOM_VIEW_LINES[key] || ROOM_VIEW_LINES.sunny;
                return en ? line.en : line.zh;
              })()}
            </p>

            {!spot ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {WINDOW_VIEW_SPOTS
                  .filter(v => !v.requiresFlag || storyFlags[v.requiresFlag])
                  .map(v => (
                    <button
                      key={v.id}
                      onClick={() => { audioManager.playSfx('page'); setSpot(v); }}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/15 hover:border-amber-200/70 transition-all duration-300 shadow-lg"
                    >
                      <img src={v.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      <span className="absolute bottom-0 left-0 right-0 p-2 text-left">
                        <span className="block text-[11px] md:text-sm font-bold text-white leading-tight">{v.nameJp}</span>
                        <span className="block text-[9px] md:text-[10px] text-amber-200/70 font-mono">{v.reading}</span>
                      </span>
                    </button>
                  ))}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-white/15 shadow-2xl">
                  <img src={spot.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-5">
                    <p className="text-xl md:text-3xl font-black text-white">{spot.nameJp}</p>
                    <p className="text-[11px] md:text-sm text-amber-200/80 font-mono">{spot.reading}</p>
                    <p className="text-xs md:text-sm text-white/70 mt-0.5">{en ? spot.nameEn : spot.nameZh}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm md:text-lg text-white/90 leading-relaxed">
                  {en ? spot.descEn : spot.descZh}
                </p>
                {spot.word && (
                  <span className="mt-3 inline-flex items-baseline gap-2 bg-emerald-500/15 border border-emerald-400/40 rounded px-3 py-1.5">
                    <span className="text-base font-bold text-emerald-200">{spot.word.jp}</span>
                    {spot.word.reading && <span className="text-[10px] text-emerald-300/60">{spot.word.reading}</span>}
                    <span className="text-xs text-white/65">{en ? spot.word.en : spot.word.zh}</span>
                  </span>
                )}
                <div className="mt-5">
                  <button
                    onClick={() => setSpot(null)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-white/25 px-6 py-2 font-black italic tracking-widest transform -skew-x-12 transition-all"
                  >
                    <span className="block transform skew-x-12">{en ? '◀ ALL' : '◀ 看别处'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 点开之后的文字 */}
      {active && (
        <div
          className="absolute inset-0 z-40 flex items-end justify-center pb-8 md:pb-14 px-4 bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-200"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-3xl bg-black/90 backdrop-blur-xl border-t-4 border-yellow-400/70 rounded-t-xl p-6 md:p-9 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl md:text-2xl">{active.hotspot.icon}</span>
              <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                {en ? active.hotspot.labelEn : active.hotspot.labelZh}
              </span>
            </div>
            <p className="text-base md:text-2xl text-white font-medium leading-relaxed" style={{ textShadow: '0 3px 8px rgba(0,0,0,0.9)' }}>
              {active.text}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              {active.hotspot.action === 'sleep' && (
                <button
                  onClick={confirmAction}
                  className="bg-indigo-600 hover:bg-yellow-400 hover:text-black text-white border-2 border-black px-7 py-2.5 font-black italic tracking-widest transform -skew-x-12 shadow-[5px_5px_0px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-none transition-all"
                >
                  <span className="block transform skew-x-12">{en ? 'SLEEP ▶' : '睡下 ▶'}</span>
                </button>
              )}
              {active.hotspot.action === 'wordbook' && (
                <button
                  onClick={confirmAction}
                  className="bg-yellow-500 hover:bg-yellow-300 text-black border-2 border-black px-7 py-2.5 font-black italic tracking-widest transform -skew-x-12 shadow-[5px_5px_0px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-none transition-all"
                >
                  <span className="block transform skew-x-12">{en ? 'OPEN ▶' : '翻开 ▶'}</span>
                </button>
              )}
              <button
                onClick={() => setActive(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-white/25 px-7 py-2.5 font-black italic tracking-widest transform -skew-x-12 transition-all"
              >
                <span className="block transform skew-x-12">{en ? 'BACK' : '收回视线'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 还没解锁的东西：只提示有，不剧透是什么 */}
      {lockedCount > 0 && !active && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="text-[10px] md:text-xs text-white/40 tracking-wider">
            {en
              ? `${lockedCount} more thing${lockedCount > 1 ? 's' : ''} here will matter later.`
              : `这个房间里还有 ${lockedCount} 样东西，以后才会有意义。`}
          </span>
        </div>
      )}
    </div>
  );
};

export default RoomScreen;
