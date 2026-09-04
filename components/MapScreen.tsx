import React, { useState, useMemo, useEffect } from 'react';
import {
  GameCalendar, Language, StoryFlags, MapLocation,
  AffectionMap, FamiliarityMap, CharacterId
} from '../types';
import { SCENE_MAP, SCENE_FALLBACK, CHARACTERS } from '../constants';
import { MAP_LOCATIONS, DISTRICT_LABELS, DISTRICT_ORDER } from '../story/mapLocations';
import {
  EventContext, isLocationUnlocked, isLocationOpenNow, locationHasEvent,
  pickEventFor, getTimeCost, slotsLeftToday, AFTERSCHOOL_SLOTS, mapSceneFor
} from '../story/mapEvents';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🗺️ 出门 —— 去哪儿
//
// 女神异闻录的目的地选择是「左边一列地名，右边一大张图」，
// 不是在一张手绘地图上戳图钉。这里照这个做，因为：
//   · 我们没有一张手绘的神户地图，硬做只会做出一张很丑的
//   · 分区列表能一眼看出"哪一片还没开"，图钉做不到
//   · 手机上竖着一列比缩放一张图好用得多
//
// 没解锁的地方**照样列出来**，只是灰着、给一句不剧透的提示。
// 全藏起来的话，玩家不知道这游戏还有多大；
// 全说清楚的话，地图就变成任务清单了。
// ---------------------------------------------------------

// 新解锁的地点要打 NEW 角标。存到本地，看过一次就不再打。
const SEEN_KEY = 'kobe_map_seen_v1';

const readSeen = (): string[] => {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

interface Props {
  language: Language;
  calendar: GameCalendar;
  storyFlags: StoryFlags;
  affection: AffectionMap;
  familiarity: FamiliarityMap;
  onClose: () => void;
  onTravel: (loc: MapLocation) => void;
}

// CHARACTERS 里只有罗马字名，中文界面上写 "Asuka 常在" 很出戏。
// 剧本里一直用的是这一组中文名，这里跟着对齐。
const NAME_ZH: Record<string, string> = {
  asuka: '明日香', hikari: '光', rei: '铃', inari: '稻荷',
  miyuki: '深雪', sora: '空', nao: '奈绪', maki: '真希'
};

// 地图上给哪张图：优先用这个地方登记的"门脸"。
// 挑去哪儿的时候，玩家想看的是外观——决定去不去的是门脸，不是屋里长什么样。
const bgOf = (id: string) => SCENE_MAP[id] || SCENE_FALLBACK[id] || SCENE_MAP['street'];

const MapScreen: React.FC<Props> = ({
  language, calendar, storyFlags, affection, familiarity, onClose, onTravel
}) => {
  const en = language === 'en';
  const ctx: EventContext = useMemo(
    () => ({ flags: storyFlags, calendar, affection, familiarity }),
    [storyFlags, calendar, affection, familiarity]
  );

  const unlocked = useMemo(
    () => MAP_LOCATIONS.filter(l => isLocationUnlocked(l, storyFlags)),
    [storyFlags]
  );

  const [seen, setSeen] = useState<string[]>(readSeen);
  const [selectedId, setSelectedId] = useState<string>(() => unlocked[0]?.id || MAP_LOCATIONS[0].id);
  const selected = MAP_LOCATIONS.find(l => l.id === selectedId) || MAP_LOCATIONS[0];

  // 进地图就把当前解锁的一批记下来，下次再来这些就不是"新"的了
  useEffect(() => {
    const ids = unlocked.map(l => l.id);
    const merged = Array.from(new Set([...seen, ...ids]));
    if (merged.length !== seen.length) {
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(merged)); } catch { /* 隐私模式 */ }
    }
    // seen 故意不进依赖：这里要的是"进屏时的那一份快照"，
    // 更新完 localStorage 之后本轮渲染仍然用旧的 seen 来打角标。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  const isNew = (id: string) => !seen.includes(id);

  const pick = (loc: MapLocation) => {
    audioManager.playSfx('click');
    setSelectedId(loc.id);
  };

  const go = () => {
    if (!isLocationUnlocked(selected, storyFlags)) return;
    if (!isLocationOpenNow(selected, calendar)) return;
    if (!affordable(selected)) { audioManager.playSfx('error'); return; }
    audioManager.playSfx('confirm');
    onTravel(selected);
  };

  // ⏳ 今天放学后还剩几格，以及每个地方要花几格
  const slotsLeft = slotsLeftToday(calendar);
  const costOf = (loc: MapLocation) => getTimeCost(loc, pickEventFor(loc.id, ctx));
  const affordable = (loc: MapLocation) => costOf(loc) <= slotsLeft;
  // 这个时段真正还能去的地方：解锁了、没打烊、今天的时间也还够
  const openNowCount = unlocked.filter(
    l => isLocationOpenNow(l, calendar) && affordable(l)
  ).length;
  // 时间用小方块画出来：实心 = 还剩，空心 = 已经用掉
  const slotPips = (used: number, total: number, cls = '') =>
    Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        className={`inline-block w-2.5 h-2.5 border ${
          i < total - used ? 'bg-yellow-400 border-yellow-300' : 'border-white/30 bg-transparent'
        } ${cls}`}
      />
    ));

  const timeLabel = en
    ? `${calendar.month}/${calendar.day} · ${calendar.timeSlot}`
    : `${calendar.month} 月 ${calendar.day} 日 · ${
        calendar.timeSlot === 'morning' ? '早晨'
          : calendar.timeSlot === 'lunch' ? '午休'
          : calendar.timeSlot === 'afternoon' ? '午后' : '夜里'
      }`;

  const slotLabel = (s: string) =>
    en ? s
      : s === 'morning' ? '早晨'
      : s === 'lunch' ? '午休'
      : s === 'afternoon' ? '午后' : '夜里';

  const selUnlocked = isLocationUnlocked(selected, storyFlags);
  const selOpen = isLocationOpenNow(selected, calendar);
  const selHasEvent = selUnlocked && selOpen && locationHasEvent(selected.id, ctx);

  return (
    <div className="fixed inset-0 z-[120] bg-[#0b0b10] overflow-hidden select-none flex flex-col">
      {/* 顶栏 */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
        <div className="bg-black/70 border border-white/20 px-4 py-1.5 transform -skew-x-12">
          <span className="block transform skew-x-12 text-[11px] md:text-sm font-black text-white tracking-widest">
            {en ? 'WHERE TO' : '去哪儿'}
            <span className="ml-3 text-yellow-400/80 font-mono text-[10px] md:text-xs">{timeLabel}</span>
          </span>
        </div>
        {/* 今天放学后还剩多少时间，以及这个点还有几处能去。
            光给两个小方块的话，玩家不会去数列表里灰掉了多少——
            直接写个数，"午后 32 处 / 夜里 14 处"这件事才有存在感。 */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 border border-white/15 bg-black/50">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/45">
            {en ? 'Time left' : '今天还剩'}
          </span>
          <span className="flex items-center gap-1">
            {slotPips(AFTERSCHOOL_SLOTS.length - slotsLeft, AFTERSCHOOL_SLOTS.length)}
          </span>
          <span className="w-px h-3.5 bg-white/15" />
          <span className="text-[10px] font-mono text-white/45">
            {en ? `${openNowCount} open` : `${openNowCount} 处开着`}
          </span>
        </div>
        <button
          onClick={() => { audioManager.playSfx('click'); onClose(); }}
          className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
        >
          <span className="block transform skew-x-12">{en ? '◀ Back' : '◀ 返回'}</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* 左：分区 + 地点列表 */}
        <div className="w-full md:w-[340px] shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 max-h-[42dvh] md:max-h-none">
          {DISTRICT_ORDER.map(d => {
            const inDistrict = MAP_LOCATIONS.filter(l => l.district === d);
            if (!inDistrict.length) return null;
            const anyOpen = inDistrict.some(l => isLocationUnlocked(l, storyFlags));
            const label = DISTRICT_LABELS[d];
            return (
              <div key={d}>
                <div className="sticky top-0 z-10 bg-[#0b0b10]/95 backdrop-blur-sm px-4 py-2 border-b border-white/10 flex items-baseline gap-2">
                  <span className={`text-[11px] font-black tracking-widest ${anyOpen ? 'text-yellow-400' : 'text-white/25'}`}>
                    {en ? label.en : label.zh}
                  </span>
                  <span className="text-[10px] font-mono text-white/25">{label.jp}</span>
                  {!anyOpen && <span className="ml-auto text-[10px] text-white/25">🔒</span>}
                </div>
                {inDistrict.map(loc => {
                  const open = isLocationUnlocked(loc, storyFlags);
                  const now = isLocationOpenNow(loc, calendar);
                  const has = open && now && locationHasEvent(loc.id, ctx);
                  const active = loc.id === selectedId;
                  const cost = costOf(loc);
                  const tooLate = open && now && cost > slotsLeft;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => pick(loc)}
                      className={`w-full text-left px-4 py-2.5 border-b border-white/5 transition-colors flex items-center gap-2 ${
                        active ? 'bg-yellow-400/15' : 'hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-1 self-stretch shrink-0 ${active ? 'bg-yellow-400' : 'bg-transparent'}`} />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-bold truncate ${
                          open ? (now && !tooLate ? 'text-white' : 'text-white/45') : 'text-white/30'
                        }`}>
                          {open ? (en ? loc.nameEn : loc.nameZh) : (en ? '???' : '？？？')}
                        </span>
                        <span className="block text-[10px] font-mono text-white/30 truncate">
                          {open ? loc.nameJp : (en ? 'not yet' : '尚未抵达')}
                        </span>
                      </span>
                      {open && isNew(loc.id) && (
                        <span className="shrink-0 text-[9px] font-black text-black bg-yellow-400 px-1.5 py-0.5 tracking-widest">NEW</span>
                      )}
                      {has && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_2px_rgba(244,63,94,0.6)]" />
                      )}
                      {/* 要花两格的地方标出来，免得玩家点进去才发现今天去不了 */}
                      {open && now && cost > 1 && (
                        <span className={`shrink-0 flex items-center gap-0.5 ${tooLate ? 'opacity-40' : ''}`}>
                          {slotPips(0, cost)}
                        </span>
                      )}
                      {tooLate && <span className="shrink-0 text-[10px] text-rose-300/70">⌛</span>}
                      {/* 关门的理由要对：白天去不了的是夜场，晚上去不了的才是打烊。
                          一律画月亮的话，午后看见铁板烧挂着月亮，像是在说"晚上再来"，
                          可它本来就只开晚上——玩家会以为自己看错了。 */}
                      {open && !now && (
                        <span className="shrink-0 text-[10px] text-white/30">
                          {loc.timeSlots && !loc.timeSlots.includes('afternoon') ? '🌙' : '🌇'}
                        </span>
                      )}
                      {!open && <span className="shrink-0 text-[10px] text-white/25">🔒</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 右：选中地点的大图 + 说明 */}
        <div className="flex-1 min-h-0 relative flex flex-col">
          <div className="relative flex-1 min-h-0">
            <img
              key={selected.id}
              src={bgOf(mapSceneFor(selected))}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                selUnlocked ? '' : 'grayscale brightness-[0.25]'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-[#0b0b10]/45 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                  {selUnlocked ? (en ? selected.nameEn : selected.nameZh) : (en ? 'Not yet' : '还去不了')}
                </h2>
                {selUnlocked && (
                  <span className="text-sm md:text-base font-mono text-yellow-400/80">
                    {selected.nameJp}
                    <span className="ml-2 text-[10px] text-white/40">{selected.reading}</span>
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-2xl text-sm md:text-base text-white/75 leading-relaxed">
                {selUnlocked
                  ? (en ? selected.blurbEn : selected.blurbZh)
                  : (en
                      ? (selected.lockedHintEn || 'You have not found your way here yet.')
                      : (selected.lockedHintZh || '你还没找到去那儿的路。'))}
              </p>

              {selUnlocked && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {selected.timeSlots && (
                    <span className={`text-[11px] px-2 py-1 border ${
                      selOpen ? 'border-white/20 text-white/60' : 'border-rose-500/50 text-rose-300'
                    }`}>
                      {selected.timeSlots.map(slotLabel).join(' / ')}
                      {!selOpen && (en ? ' · closed now' : ' · 现在去不了')}
                    </span>
                  )}
                  {(selected.regulars || []).map(id => (
                    <span key={id} className="text-[11px] px-2 py-1 border border-white/15 text-white/55">
                      {en ? CHARACTERS[id as CharacterId].nameEn : (NAME_ZH[id] || CHARACTERS[id as CharacterId].name)}
                      <span className="ml-1 text-white/30">{en ? 'often here' : '常在'}</span>
                    </span>
                  ))}
                  {selHasEvent && (
                    <span className="text-[11px] px-2 py-1 border border-rose-500/60 text-rose-300 font-bold">
                      {en ? '● something today' : '● 今天有点什么'}
                    </span>
                  )}
                  {/* 这一趟要花掉多少时间 */}
                  <span className={`text-[11px] px-2 py-1 border flex items-center gap-1.5 ${
                    affordable(selected) ? 'border-white/20 text-white/60' : 'border-rose-500/50 text-rose-300'
                  }`}>
                    {en ? 'Takes' : '要花'}
                    <span className="flex items-center gap-0.5">{slotPips(0, costOf(selected))}</span>
                    {!affordable(selected) && (en ? ' · no time left today' : ' · 今天来不及了')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 出发 */}
          <div className="shrink-0 px-4 md:px-6 py-3 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-[11px] text-white/40">
              {en
                ? 'After school you have two blocks of time. A quick stop costs one; sitting down to a giant bowl of ramen or heading out of town costs both — after that you go home.'
                : '放学后一共两格时间。顺路拐一下花 1 格；坐下来吃碗二郎系拉面、或者跑一趟市外要 2 格——去完就只能回家了。'}
            </span>
            <button
              onClick={go}
              disabled={!selUnlocked || !selOpen || !affordable(selected)}
              className={`px-6 md:px-10 py-2.5 text-sm font-black uppercase tracking-widest transform -skew-x-12 transition-all ${
                selUnlocked && selOpen && affordable(selected)
                  ? 'bg-yellow-400 text-black hover:bg-white'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span className="block transform skew-x-12">
                {!selUnlocked
                  ? (en ? 'Locked' : '未解锁')
                  : !selOpen
                    ? (en ? 'Not now' : '现在不行')
                    : !affordable(selected)
                      ? (en ? 'Too late' : '来不及了')
                      : (en ? 'Go ▶' : '出发 ▶')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
