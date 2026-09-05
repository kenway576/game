import React, { useState } from 'react';
import { RECIPE_BOOKS } from '../data/cookData';
import { Language, LifeState, GameCalendar, StoryFlags, StoryEffect, CharacterId } from '../types';
import {
  SEEDS, RODS, POT_ITEM, POT_PRICE, MAX_PLOTS, BAIT_ITEM, BAIT_PRICE, BAIT_PER_PACK,
  findSeed, findFish
} from '../data/lifeData';
import { audioManager } from '../services/audioManager';
import ItemIcon from './ItemIcon';
import NpcTalkPanel from './NpcTalkPanel';

// ---------------------------------------------------------
// 🏪 店。百元店和渔具店共用这一个组件。
//
// 两家店的差别只有"卖什么"和"招牌上写什么"，界面逻辑是同一套：
// 左边货架，右边选中商品的详情 + 买卖。所以不拆成两个组件。
//
// 右边同时是**卖东西**的地方：收获的菜和钓到的鱼都在这儿出手。
// 百元店收农产品（老板娘自己也种），渔具店收鱼。分开收是有道理的：
// 不然玩家会把所有东西都堆到一家店，另一家就没人去了。
// ---------------------------------------------------------

export type StoreKind = 'hyakkin' | 'tackle';

interface Props {
  kind: StoreKind;
  language: Language;
  life: LifeState;
  calendar: GameCalendar;
  onClose: () => void;
  onBuy: (cost: number, apply: (life: LifeState) => LifeState) => void;
  onSell: (gain: number, apply: (life: LifeState) => LifeState) => void;
  storyFlags: StoryFlags;
  metChars: CharacterId[];
  onEffects: (fx: StoryEffect[]) => void;
  onFlags: (flags: string[]) => void;
}

const yen = (n: number) => '¥' + n.toLocaleString('ja-JP');

const StoreScreen: React.FC<Props> = ({ kind, language, life, calendar, onClose, onBuy, onSell, storyFlags, metChars, onEffects, onFlags }) => {
  const en = language === 'en';
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [pickId, setPickId] = useState<string | null>(null);

  // 站柜台的人。这两句招呼语在文案里早就有了，现在配上人。
  const clerkSprite = kind === 'hyakkin'
    ? '/images/characters/npc_city_takahashi.webp'
    : '/images/characters/npc_city_gensan.webp';

  const shop = kind === 'hyakkin'
    ? {
        nameZh: '百元店 ダイソー 三宫店', nameEn: 'Hundred-Yen Shop',
        nameJp: '百円ショップ', readingJp: 'ひゃくえんショップ',
        lineZh: '「なんでも百円……ではないんですけどね」老板娘一边说一边把标着 550 的花盆推过来。',
        lineEn: '"Everything is a hundred yen... except when it is not," says the owner, pushing a pot marked 550 across the counter.',
        accent: 'text-rose-400', ring: 'border-rose-500/60'
      }
    : {
        nameZh: '渔具店 みなと釣具', nameEn: 'Minato Tackle',
        nameJp: '釣具店', readingJp: 'つりぐてん',
        lineZh: '店里有一股干海藻和机油的味道。老板背对着你在修一个卷线器，头也不回地说「見てって」。',
        lineEn: 'The shop smells of dried seaweed and machine oil. The owner, back turned, repairing a reel, says to have a look without turning round.',
        accent: 'text-cyan-400', ring: 'border-cyan-500/60'
      };

  // ---- 货架 ----
  type Row = { id: string; emoji: string; icon?: string; nameZh: string; nameEn: string; nameJp: string;
               reading: string; price: number; descZh: string; descEn: string; owned?: number; note?: string };

  const buyRows: Row[] = kind === 'hyakkin'
    ? [
        {
          id: POT_ITEM, emoji: '🏺', icon: POT_ITEM, nameZh: '素烧花盆', nameEn: 'Terracotta Pot',
          nameJp: '素焼き鉢', reading: 'すやきばち', price: POT_PRICE,
          descZh: `买一个多一个能种的位置。阳台和天台加起来最多摆 ${MAX_PLOTS} 个。`,
          descEn: `One more pot is one more place to plant. Balcony and rooftop take ${MAX_PLOTS} between them.`,
          owned: life.plots.length, note: `${life.plots.length}/${MAX_PLOTS}`
        },
        // 📖 料理本。放在种子前面：它是这家店里唯一一件"买了就永久多点东西"的货，
        // 而不是消耗品。买过的会标"已有"，不会重复卖给你。
        ...RECIPE_BOOKS.map(b => ({
          id: b.id, emoji: b.emoji, icon: 'item_book', nameZh: b.nameZh, nameEn: b.nameEn,
          nameJp: b.nameJp, reading: b.reading, price: b.price,
          descZh: b.descZh, descEn: b.descEn,
          owned: life.items[b.id] || 0,
          note: (life.items[b.id] || 0) > 0 ? (en ? 'owned' : '已有') : undefined
        })),
        ...SEEDS.map(s => ({
          // 八种种子共用一张纸袋图——袋子长得都一样，没必要为此多切八张
          id: s.id, emoji: s.emoji, icon: 'item_seed', nameZh: s.nameZh, nameEn: s.nameEn,
          nameJp: s.nameJp, reading: s.reading, price: s.price,
          descZh: s.descZh, descEn: s.descEn, owned: life.items[s.id] || 0,
          note: s.months && !s.months.includes(calendar.month)
            ? (en ? 'out of season' : '不是季节')
            : undefined
        }))
      ]
    : [
        {
          id: BAIT_ITEM, emoji: '🐛', icon: BAIT_ITEM, nameZh: `青虫饵（${BAIT_PER_PACK} 份）`, nameEn: `Bait (${BAIT_PER_PACK})`,
          nameJp: '青イソメ', reading: 'あおイソメ', price: BAIT_PRICE,
          descZh: '装在木屑里，还在动。没有饵也能下竿，但上来的多半是空罐子。',
          descEn: 'Packed in sawdust, still moving. You can fish without it, but mostly you will pull up cans.',
          owned: life.items[BAIT_ITEM] || 0
        },
        ...RODS.map(r => ({
          id: r.id, emoji: r.emoji, icon: r.id, nameZh: r.nameZh, nameEn: r.nameEn,
          nameJp: r.nameJp, reading: r.reading, price: r.price,
          descZh: r.descZh, descEn: r.descEn,
          owned: life.rodId === r.id ? 1 : 0,
          note: life.rodId === r.id ? (en ? 'equipped' : '使用中') : undefined
        }))
      ];

  // ---- 收购台 ----
  const sellRows: Row[] = kind === 'hyakkin'
    ? SEEDS.filter(s => (life.items[s.cropId] || 0) > 0).map(s => ({
        id: s.cropId, emoji: s.cropEmoji, icon: s.cropId, nameZh: s.cropNameZh, nameEn: s.cropNameEn,
        nameJp: s.nameJp.replace(/の(種|苗)$/, ''), reading: s.reading.replace(/の(たね|なえ)$/, ''),
        price: s.sellPrice, descZh: '你自己种的。', descEn: 'Grown by you.',
        owned: life.items[s.cropId] || 0
      }))
    // 鱼篓里的每一条都带着尺寸，所以 key 是 "catch|鱼id|厘米"。
    // 不这么存的话，一条 80 公分的鲈鱼和一条 35 公分的会卖同一个价。
    : Object.keys(life.items)
        .filter(k => k.startsWith('catch|') && (life.items[k] || 0) > 0)
        .map(k => {
          const [, id, cm] = k.split('|');
          return { key: k, f: findFish(id), cm: Number(cm) };
        })
        .filter(x => !!x.f)
        .sort((a, b) => b.f!.yenPerCm * b.cm - a.f!.yenPerCm * a.cm)
        .map(x => ({
          id: x.key,
          emoji: x.f!.emoji, icon: x.f!.id, nameZh: `${x.f!.nameZh} ${x.cm}cm`, nameEn: `${x.f!.nameEn} ${x.cm}cm`,
          nameJp: x.f!.nameJp, reading: x.f!.reading,
          price: Math.round(x.f!.yenPerCm * x.cm),
          descZh: `${x.cm} 公分。${x.f!.noteZh}`, descEn: `${x.cm} cm. ${x.f!.noteEn}`,
          owned: life.items[x.key] || 0
        }));

  const rows = tab === 'buy' ? buyRows : sellRows;
  const pick = rows.find(r => r.id === pickId) || rows[0] || null;

  const canBuy = pick && tab === 'buy' && life.yen >= pick.price
    && !(pick.id === POT_ITEM && life.plots.length >= MAX_PLOTS)
    && !(kind === 'tackle' && pick.id.startsWith('rod_') && life.rodId === pick.id)
    // 📖 书买过就不再卖第二本。它不是消耗品，第二本没有任何用处。
    && !(pick.id.startsWith('book_') && (life.items[pick.id] || 0) > 0);

  const doBuy = () => {
    if (!pick || !canBuy) return;
    audioManager.playSfx('confirm');
    onBuy(pick.price, l => {
      const next = { ...l, items: { ...l.items } };
      if (pick.id === POT_ITEM) {
        next.plots = [...l.plots, {
          id: 'plot_' + Date.now().toString(36),
          site: 'balcony', seedId: null, plantedOn: null, watered: 0, lastWaterOn: null
        }];
      } else if (pick.id.startsWith('rod_')) {
        next.rodId = pick.id;
      } else if (pick.id === BAIT_ITEM) {
        next.items[BAIT_ITEM] = (next.items[BAIT_ITEM] || 0) + BAIT_PER_PACK;
      } else {
        next.items[pick.id] = (next.items[pick.id] || 0) + 1;
      }
      return next;
    });
  };

  const doSell = () => {
    if (!pick || tab !== 'sell') return;
    audioManager.playSfx('confirm');
    onSell(pick.price, l => {
      const items = { ...l.items };
      items[pick.id] = (items[pick.id] || 0) - 1;
      if (items[pick.id] <= 0) delete items[pick.id];
      return { ...l, items };
    });
  };

  return (
    <div className="fixed inset-0 z-[125] bg-[#0b0b10] flex flex-col select-none">
      {/* 站柜台的那个人。百元店是高桥，渔具店是源老爹——
          "老板背对着你在修卷线器"那句话写的就是他，只是一直没有脸。
          放在右下角、屏幕窄的时候不显示：他是气氛，不该挡住货架。 */}
      <img
        src={clerkSprite}
        alt=""
        className="pointer-events-none absolute right-0 bottom-0 h-[70%] object-contain opacity-25 hidden xl:block"
      />
      {/* 顶栏 */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
        <div>
          <div className={`text-sm md:text-lg font-black tracking-wide ${shop.accent}`}>
            {en ? shop.nameEn : shop.nameZh}
          </div>
          <div className="text-[10px] font-mono text-white/35">
            {shop.nameJp} <span className="text-white/25">{shop.readingJp}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-black/60 border border-yellow-500/50 px-3 py-1.5 transform -skew-x-12">
            <span className="block transform skew-x-12 text-yellow-400 font-black text-sm md:text-base tabular-nums">
              {yen(life.yen)}
            </span>
          </div>
          <button
            onClick={() => { audioManager.playSfx('click'); onClose(); }}
            className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
          >
            <span className="block transform skew-x-12">{en ? '◀ Leave' : '◀ 离开'}</span>
          </button>
        </div>
      </div>

      <p className="px-4 md:px-6 py-2 text-[11px] md:text-xs text-white/45 border-b border-white/5 shrink-0">
        {en ? shop.lineEn : shop.lineZh}
      </p>

      {/* 买 / 卖 */}
      <div className="flex gap-2 px-4 md:px-6 py-2 shrink-0">
        {(['buy', 'sell'] as const).map(t => (
          <button
            key={t}
            onClick={() => { audioManager.playSfx('click'); setTab(t); setPickId(null); }}
            className={`px-5 py-1.5 text-[11px] font-black tracking-widest transform -skew-x-12 transition-all ${
              tab === t ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            <span className="block transform skew-x-12">
              {t === 'buy' ? (en ? 'BUY' : '买') : (en ? 'SELL' : '卖')}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* 货架 */}
        <div className="w-full md:w-[380px] shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 max-h-[40dvh] md:max-h-none">
          {rows.length === 0 && (
            <p className="p-6 text-sm text-white/35">
              {kind === 'hyakkin'
                ? (en ? 'Nothing to sell. Grow something first.' : '没有可卖的东西。先种点什么。')
                : (en ? 'No fish in your cooler.' : '鱼篓是空的。')}
            </p>
          )}
          {rows.map(r => (
            <button
              key={r.id}
              onClick={() => { audioManager.playSfx('click'); setPickId(r.id); }}
              className={`w-full text-left px-4 py-3 border-b border-white/5 flex items-center gap-3 transition-colors ${
                pick?.id === r.id ? 'bg-yellow-400/15' : 'hover:bg-white/5'
              }`}
            >
              <ItemIcon id={r.icon} emoji={r.emoji} size={34} className="shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white truncate">{en ? r.nameEn : r.nameZh}</span>
                <span className="block text-[10px] font-mono text-white/35 truncate">{r.nameJp}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-black text-yellow-400 tabular-nums">{yen(r.price)}</span>
                {!!r.owned && <span className="block text-[10px] text-white/40">{r.note || `×${r.owned}`}</span>}
                {!r.owned && r.note && <span className="block text-[10px] text-white/40">{r.note}</span>}
              </span>
            </button>
          ))}
        </div>

        {/* 详情 */}
        <div className="flex-1 min-h-0 p-5 md:p-8 flex flex-col">
          {pick ? (
            <>
              <ItemIcon id={pick.icon} emoji={pick.emoji} size={132} className="mb-4" />
              <h2 className="text-2xl md:text-3xl font-black text-white">{en ? pick.nameEn : pick.nameZh}</h2>
              <div className="mt-1 text-sm font-mono text-yellow-400/80">
                {pick.nameJp}<span className="ml-2 text-[11px] text-white/35">{pick.reading}</span>
              </div>
              <p className="mt-4 max-w-xl text-sm md:text-base text-white/70 leading-relaxed">
                {en ? pick.descEn : pick.descZh}
              </p>
              <div className="mt-auto pt-6 flex items-center gap-4">
                <button
                  onClick={tab === 'buy' ? doBuy : doSell}
                  disabled={tab === 'buy' ? !canBuy : !(pick.owned && pick.owned > 0)}
                  className={`px-8 py-3 text-sm font-black uppercase tracking-widest transform -skew-x-12 transition-all ${
                    (tab === 'buy' ? canBuy : (pick.owned || 0) > 0)
                      ? 'bg-yellow-400 text-black hover:bg-white'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span className="block transform skew-x-12">
                    {tab === 'buy'
                      ? (canBuy ? (en ? `Buy · ${yen(pick.price)}` : `买下 · ${yen(pick.price)}`)
                               : (pick.id === POT_ITEM && life.plots.length >= MAX_PLOTS
                                    ? (en ? 'No room' : '摆不下了')
                                    : (kind === 'tackle' && life.rodId === pick.id
                                        ? (en ? 'Already yours' : '已经有了')
                                        : (en ? 'Not enough' : '钱不够'))))
                      : (en ? `Sell · ${yen(pick.price)}` : `卖掉 · ${yen(pick.price)}`)}
                  </span>
                </button>
                {tab === 'sell' && (pick.owned || 0) > 1 && (
                  <span className="text-[11px] text-white/40">{en ? `you have ${pick.owned}` : `手上有 ${pick.owned} 份`}</span>
                )}
              </div>
            </>
          ) : (
            <p className="m-auto text-white/30 text-sm">{en ? 'Nothing here.' : '这儿什么也没有。'}</p>
          )}
        </div>
      </div>

      {/* 站柜台的那个人。百元店的高桥知道今天哪一排贴了新标签，
          渔具店的源老爹知道今天潮动不动——这两条都是能换到东西的情报。 */}
      <NpcTalkPanel
        npcId={kind === 'hyakkin' ? 'takahashi' : 'gensan'}
        calendar={calendar} storyFlags={storyFlags}
        metChars={metChars} en={en} onEffects={onEffects} onFlags={onFlags}
      />
    </div>
  );
};

export default StoreScreen;
