import React, { useState } from 'react';
import { Language, LifeState, GameCalendar, PlantPlot } from '../types';
import { SEEDS, findSeed, dayIndex, plantStage, STAGE_EMOJI, MAX_PLOTS } from '../data/lifeData';
import { audioManager } from '../services/audioManager';
import ItemIcon from './ItemIcon';

// ---------------------------------------------------------
// 🏺 花盆。阳台（家）和天台（学校）是同一套界面的两个场地。
//
// 【为什么要两个条件都满足才能收】
// 成熟需要「天数够了」**并且**「浇够了次数」，而不是二选一。
// 只看天数的话，种完就可以扔在那儿不管，那这个系统等于一个计时器；
// 只看浇水的话，一天猛点几十下就能收，那它等于一个点击器。
// 两个都要，才会变成"每天回来看一眼"——这正好是休闲系统该有的节奏。
//
// 一天只能浇一次（lastWaterOn 记的是绝对日序），所以催不了。
// 太久不浇会蔫，但不会死：收成减半而已。这游戏不该因为你三天没上线就惩罚你。
// ---------------------------------------------------------

interface Props {
  site: 'balcony' | 'rooftop';
  language: Language;
  life: LifeState;
  calendar: GameCalendar;
  onClose: () => void;
  onUpdate: (apply: (life: LifeState) => LifeState) => void;
  onHarvest: (cropNameZh: string, cropNameEn: string, n: number, care: 'perfect' | 'ok' | 'poor') => void;
}

const SITE = {
  balcony: {
    zh: '201 室 · 阳台', en: 'Room 201 · Balcony', jp: 'ベランダ', reading: 'ベランダ',
    bg: '/images/backgrounds/bg_umikaze_balcony_harbor.webp',
    lineZh: '铁栏杆外面就是港。风大，盆得往里挪一点。',
    lineEn: 'The harbour starts on the other side of the rail. It is windy; the pots have to sit further in.'
  },
  rooftop: {
    zh: '学校 · 天台', en: 'School · Rooftop', jp: '屋上', reading: 'おくじょう',
    bg: '/images/backgrounds/bg_school_rooftop_sunset.webp',
    lineZh: '没人管这块地方。你把盆摆在水塔背风的那一侧。',
    lineEn: 'Nobody supervises up here. You line the pots up on the sheltered side of the water tank.'
  }
};

const GardenScreen: React.FC<Props> = ({ site, language, life, calendar, onClose, onUpdate, onHarvest }) => {
  const en = language === 'en';
  const today = dayIndex(calendar);
  const meta = SITE[site];

  const here = life.plots.filter(p => p.site === site);
  const elsewhere = life.plots.length - here.length;
  const [selId, setSelId] = useState<string | null>(null);
  const sel = here.find(p => p.id === selId) || here[0] || null;

  const ownedSeeds = SEEDS.filter(s => (life.items[s.id] || 0) > 0);

  const patch = (id: string, fn: (p: PlantPlot) => PlantPlot) =>
    onUpdate(l => ({ ...l, plots: l.plots.map(p => (p.id === id ? fn(p) : p)) }));

  const plant = (seedId: string) => {
    if (!sel) return;
    audioManager.playSfx('confirm');
    onUpdate(l => ({
      ...l,
      items: { ...l.items, [seedId]: (l.items[seedId] || 0) - 1 },
      plots: l.plots.map(p => p.id === sel.id
        ? { ...p, seedId, plantedOn: today, watered: 0, lastWaterOn: null, wilted: false, missedWater: 0 }
        : p)
    }));
  };

  const water = () => {
    if (!sel || !sel.seedId || sel.lastWaterOn === today) return;
    audioManager.playSfx('click');
    patch(sel.id, p => ({ ...p, watered: p.watered + 1, lastWaterOn: today, wilted: false }));
  };

  // 收成看的是"照顾得好不好"，具体就是有几天该浇没浇。
  // 一天没漏 = 上物，多给一份，而且额外长属性；
  // 漏过就只是普通收成。这条是整个种植系统真正的钩子——
  // 不然浇水只是个每天点一下的仪式，没有好坏之分。
  const careOf = (p: PlantPlot): 'perfect' | 'ok' | 'poor' => {
    const missed = p.missedWater || 0;
    if (missed === 0) return 'perfect';
    if (missed <= 2) return 'ok';
    return 'poor';
  };

  const harvest = () => {
    if (!sel || !sel.seedId) return;
    const seed = findSeed(sel.seedId);
    if (!seed) return;
    audioManager.playSfx('confirm');
    const care = careOf(sel);
    const n = care === 'perfect' ? 3 : care === 'ok' ? 2 : 1;
    onUpdate(l => ({
      ...l,
      items: { ...l.items, [seed.cropId]: (l.items[seed.cropId] || 0) + n },
      plots: l.plots.map(p => p.id === sel.id
        ? { ...p, seedId: null, plantedOn: null, watered: 0, lastWaterOn: null, wilted: false, missedWater: 0 }
        : p)
    }));
    onHarvest(seed.cropNameZh, seed.cropNameEn, n, care);
  };

  const move = () => {
    if (!sel) return;
    audioManager.playSfx('click');
    patch(sel.id, p => ({ ...p, site: p.site === 'balcony' ? 'rooftop' : 'balcony' }));
    setSelId(null);
  };

  const stage = sel ? plantStage(sel, today) : 0;
  const seed = sel?.seedId ? findSeed(sel.seedId) : null;
  const canWater = !!sel?.seedId && sel.lastWaterOn !== today && stage < 4;
  const daysLeft = seed && sel?.plantedOn != null ? Math.max(0, seed.growDays - (today - sel.plantedOn)) : 0;
  const waterLeft = seed ? Math.max(0, seed.needWater - (sel?.watered || 0)) : 0;

  return (
    <div className="fixed inset-0 z-[125] bg-black select-none flex flex-col">
      <img src={meta.bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      {/* 顶栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
        <div>
          <div className="text-sm md:text-lg font-black text-emerald-300 tracking-wide">
            {en ? meta.en : meta.zh}
          </div>
          <div className="text-[10px] font-mono text-white/35">
            {meta.jp} <span className="text-white/25">{meta.reading}</span>
            <span className="ml-3 text-white/30">{calendar.month}/{calendar.day}</span>
          </div>
        </div>
        <button
          onClick={() => { audioManager.playSfx('click'); onClose(); }}
          className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
        >
          <span className="block transform skew-x-12">{en ? '◀ Back' : '◀ 返回'}</span>
        </button>
      </div>

      <p className="relative z-10 px-4 md:px-6 py-2 text-[11px] md:text-xs text-white/45 shrink-0">
        {en ? meta.lineEn : meta.lineZh}
      </p>

      <div className="relative z-10 flex-1 min-h-0 flex flex-col md:flex-row gap-4 p-4 md:p-6">
        {/* 盆 */}
        <div className="md:w-[420px] shrink-0">
          {here.length === 0 ? (
            <div className="border border-dashed border-white/20 p-6 text-center">
              <div className="text-4xl mb-3">🏺</div>
              <p className="text-sm text-white/50 leading-relaxed">
                {elsewhere > 0
                  ? (en
                      ? `Your ${elsewhere} pot(s) are at the other site. Go there and use "move" to bring one over.`
                      : `你的 ${elsewhere} 个花盆都在另一边。去那边用「搬过去」把盆挪过来。`)
                  : (en
                      ? 'No pots yet. The hundred-yen shop in Sannomiya sells them.'
                      : '还没有花盆。三宫的百元店有卖。')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {here.map(p => {
                const st = plantStage(p, today);
                const sd = p.seedId ? findSeed(p.seedId) : null;
                const thirsty = !!p.seedId && p.lastWaterOn !== today && st < 4;
                return (
                  <button
                    key={p.id}
                    onClick={() => { audioManager.playSfx('click'); setSelId(p.id); }}
                    className={`aspect-square border flex flex-col items-center justify-center gap-1 transition-all ${
                      sel?.id === p.id ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/15 bg-black/40 hover:bg-white/5'
                    }`}
                  >
                    {st === 4 && sd
                      ? <ItemIcon id={sd.cropId} emoji={sd.cropEmoji} size={40} />
                      : st > 0
                        ? <span className="text-3xl leading-none">{STAGE_EMOJI[st]}</span>
                        : <ItemIcon id="item_pot" emoji="🏺" size={40} className="opacity-70" />}
                    <span className="text-[9px] text-white/45 px-1 truncate max-w-full">
                      {sd ? (en ? sd.nameEn.replace(/ Seeds?| Seedling/, '') : sd.nameZh.replace(/种子|苗/, '')) : (en ? 'empty' : '空着')}
                    </span>
                    <span className="h-3 flex items-center gap-1">
                      {st === 4 && <span className="text-[9px] font-black text-emerald-400">{en ? 'READY' : '可收'}</span>}
                      {st > 0 && st < 4 && thirsty && <span className="text-[10px]">💧</span>}
                      {p.wilted && <span className="text-[10px]">🥀</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {here.length > 0 && (
            <p className="mt-3 text-[10px] text-white/30">
              {en
                ? `${life.plots.length}/${MAX_PLOTS} pots owned · ${elsewhere} at the other site`
                : `共有花盆 ${life.plots.length}/${MAX_PLOTS} · 另一边还有 ${elsewhere} 个`}
            </p>
          )}
        </div>

        {/* 详情 / 操作 */}
        <div className="flex-1 min-h-0 overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 md:pl-6 pt-4 md:pt-0">
          {!sel ? (
            <p className="text-sm text-white/35">{en ? 'Nothing here yet.' : '这里还没有东西。'}</p>
          ) : !sel.seedId ? (
            <>
              <h3 className="text-lg font-black text-white mb-1">{en ? 'Empty pot' : '空花盆'}</h3>
              <p className="text-xs text-white/45 mb-4">
                {en ? 'Pick something to plant.' : '挑一样种下去。'}
              </p>
              {ownedSeeds.length === 0 ? (
                <p className="text-sm text-white/35">
                  {en ? 'No seeds. The hundred-yen shop has them.' : '没有种子。百元店有卖。'}
                </p>
              ) : (
                <div className="space-y-2">
                  {ownedSeeds.map(s => {
                    const offSeason = s.months && !s.months.includes(calendar.month);
                    return (
                      <button
                        key={s.id}
                        onClick={() => !offSeason && plant(s.id)}
                        disabled={!!offSeason}
                        className={`w-full text-left border px-3 py-2.5 flex items-center gap-3 transition-colors ${
                          offSeason ? 'border-white/10 opacity-40 cursor-not-allowed' : 'border-white/15 hover:bg-white/5'
                        }`}
                      >
                        <ItemIcon id="item_seed" emoji={s.emoji} size={26} className="shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-white truncate">{en ? s.nameEn : s.nameZh}</span>
                          <span className="block text-[10px] text-white/40">
                            {en
                              ? `${s.growDays}d · ${s.needWater} waterings`
                              : `${s.growDays} 天 · 浇 ${s.needWater} 次`}
                            {offSeason && (en ? ' · out of season' : ' · 不是季节')}
                          </span>
                        </span>
                        <span className="text-[11px] text-white/40">×{life.items[s.id]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              {stage === 4 && seed
                ? <ItemIcon id={seed.cropId} emoji={seed.cropEmoji} size={96} className="mb-3" />
                : <div className="text-6xl mb-3">{STAGE_EMOJI[stage]}</div>}
              <h3 className="text-xl md:text-2xl font-black text-white">{en ? seed?.nameEn : seed?.nameZh}</h3>
              <div className="text-sm font-mono text-emerald-300/80 mt-1">
                {seed?.nameJp}<span className="ml-2 text-[11px] text-white/35">{seed?.reading}</span>
              </div>

              {/* 进度：两条，因为成熟要两个条件都满足 */}
              <div className="mt-5 space-y-3 max-w-md">
                {[
                  { k: en ? 'days' : '天数', now: seed ? Math.min(seed.growDays, seed.growDays - daysLeft) : 0, max: seed?.growDays || 1, color: 'bg-amber-400' },
                  { k: en ? 'water' : '浇水', now: sel.watered, max: seed?.needWater || 1, color: 'bg-sky-400' }
                ].map(b => (
                  <div key={b.k}>
                    <div className="flex justify-between text-[11px] text-white/50 mb-1">
                      <span>{b.k}</span><span className="tabular-nums">{Math.min(b.now, b.max)} / {b.max}</span>
                    </div>
                    <div className="h-2 bg-white/10">
                      <div className={`h-full ${b.color} transition-all duration-500`}
                           style={{ width: `${Math.min(100, b.now / b.max * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm text-white/60 max-w-md leading-relaxed">
                {stage === 4
                  ? (en ? 'Ready. Pick it.' : '熟了。可以收了。')
                  : sel.lastWaterOn === today
                    ? (en ? 'Watered today. Nothing more to do until tomorrow.' : '今天浇过了。明天再来。')
                    : (en ? 'It wants water.' : '该浇水了。')}
              </p>
              {(() => {
                const missed = sel.missedWater || 0;
                const care = careOf(sel);
                return (
                  <p className={`mt-2 text-xs ${care === 'perfect' ? 'text-emerald-400/90' : care === 'ok' ? 'text-white/45' : 'text-amber-400/85'}`}>
                    {care === 'perfect'
                      ? (en ? 'Not one day missed. This will come out well — three of them, and you will have learned something.'
                            : '一天都没落下。会长得很好——收三份，而且你自己也长了点东西。')
                      : care === 'ok'
                        ? (en ? `${missed} day(s) without water. Two of them, then.`
                              : `漏浇了 ${missed} 天。那就是两份。`)
                        : (en ? `${missed} days without water. One, and you got off lightly.`
                              : `漏浇了 ${missed} 天。收一份，还算便宜你了。`)}
                  </p>
                );
              })()}

              <div className="mt-6 flex flex-wrap gap-3">
                {stage === 4 ? (
                  <button onClick={harvest}
                    className="px-7 py-2.5 bg-emerald-500 text-black text-sm font-black uppercase tracking-widest transform -skew-x-12 hover:bg-white transition-all">
                    <span className="block transform skew-x-12">{en ? 'Harvest' : '收获'}</span>
                  </button>
                ) : (
                  <button onClick={water} disabled={!canWater}
                    className={`px-7 py-2.5 text-sm font-black uppercase tracking-widest transform -skew-x-12 transition-all ${
                      canWater ? 'bg-sky-400 text-black hover:bg-white' : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}>
                    <span className="block transform skew-x-12">
                      {canWater ? (en ? 'Water' : '浇水') : (en ? 'Done today' : '今天已浇')}
                    </span>
                  </button>
                )}
                <button onClick={move}
                  className="px-5 py-2.5 border border-white/25 text-white/70 text-xs font-black uppercase tracking-widest transform -skew-x-12 hover:bg-white/10 transition-all">
                  <span className="block transform skew-x-12">
                    {site === 'balcony' ? (en ? 'Move to roof' : '搬去天台') : (en ? 'Move to balcony' : '搬回阳台')}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GardenScreen;
