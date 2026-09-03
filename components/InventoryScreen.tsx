import React, { useMemo, useState } from 'react';
import { Language, LifeState, StoryFlags } from '../types';
import {
  buildInventory, InventoryRow, ItemKind, KIND_ORDER, KIND_LABELS
} from '../data/itemCatalog';
import { audioManager } from '../services/audioManager';
import ItemIcon from './ItemIcon';

// ---------------------------------------------------------
// 🎒 物品栏 —— 随时能打开的「持ち物」
//
// 以前东西只能在用得上它的界面里看见：种子在店里，鱼在厨房，
// 学生证要走回房间点桌子。玩家问"我现在都有什么"，游戏答不上来。
//
// 【为什么不是一个网格弹窗】
// 女神异闻录的物品栏是一条斜着切过屏幕的列表，选中的那一行会往外
// 顶出去，右边一整块讲这件东西是什么。照这个做有个实际好处：
// 这个游戏的物品自带一段文字（鱼有图鉴介绍、纪念品有一段回忆），
// 网格塞不下，非要塞就得再点一次才能看见——那还不如列表。
//
// 进场时每一行错开 24ms 依次滑进来。这不是为了炫技：
// 一次性全出现的话，斜切的版面看上去就是一堆歪掉的方块；
// 错开之后视线会自己从上往下走一遍，才知道这是一列东西。
// ---------------------------------------------------------

interface Props {
  language: Language;
  life: LifeState;
  storyFlags: StoryFlags;
  onClose: () => void;
}

const yen = (n: number) => '¥' + n.toLocaleString('ja-JP');

// 每一类给一个色，选中和角标都跟着它走。
// 颜色是有分工的：黄色只留给纪念品——它们是唯一不能卖也不会消耗的东西。
const KIND_COLOR: Record<ItemKind, { text: string; bg: string; border: string }> = {
  keepsake: { text: 'text-yellow-300', bg: 'bg-yellow-400', border: 'border-yellow-400/60' },
  fish:     { text: 'text-cyan-300',   bg: 'bg-cyan-400',   border: 'border-cyan-400/60' },
  crop:     { text: 'text-lime-300',   bg: 'bg-lime-400',   border: 'border-lime-400/60' },
  seed:     { text: 'text-amber-300',  bg: 'bg-amber-400',  border: 'border-amber-400/60' },
  gear:     { text: 'text-white/70',   bg: 'bg-white/70',   border: 'border-white/40' }
};

const InventoryScreen: React.FC<Props> = ({ language, life, storyFlags, onClose }) => {
  const en = language === 'en';
  const [filter, setFilter] = useState<ItemKind | 'all'>('all');
  const [pick, setPick] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);

  const all = useMemo(() => buildInventory(life, storyFlags), [life, storyFlags]);

  // 同一类排在一起，类内按拿到的顺序。排序放在这儿而不是 buildInventory 里，
  // 因为别的地方（厨房算材料）要的是原始顺序。
  const rows = useMemo(() => {
    const sorted = [...all].sort(
      (a, b) => KIND_ORDER.indexOf(a.item.kind) - KIND_ORDER.indexOf(b.item.kind)
    );
    return filter === 'all' ? sorted : sorted.filter(r => r.item.kind === filter);
  }, [all, filter]);

  const counts = useMemo(() => {
    const c: Partial<Record<ItemKind, number>> = {};
    for (const r of all) c[r.item.kind] = (c[r.item.kind] || 0) + 1;
    return c;
  }, [all]);

  const sel: InventoryRow | undefined =
    rows.find(r => r.item.key === pick) || rows[0];

  const choose = (key: string) => {
    audioManager.playSfx('click');
    setPick(key);
  };

  const tab = (id: ItemKind | 'all', label: string, n: number) => {
    const on = filter === id;
    return (
      <button
        key={id}
        onClick={() => { audioManager.playSfx('page'); setFilter(id); setPick(null); }}
        disabled={n === 0}
        className={`relative px-3 md:px-4 py-1.5 transform -skew-x-12 transition-all duration-200 ${
          on ? 'bg-yellow-400 text-black' : n ? 'bg-black/60 text-white/60 hover:text-white hover:bg-white/10' : 'bg-black/30 text-white/20 cursor-not-allowed'
        } border ${on ? 'border-yellow-300' : 'border-white/15'}`}
      >
        <span className="block transform skew-x-12 text-[10px] md:text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
          {label}
          <span className={`ml-1.5 font-mono ${on ? 'text-black/50' : 'text-white/30'}`}>{n}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[210] bg-[#0a0a0f] overflow-hidden select-none flex flex-col">
      {/* 背景：一道斜着扫过去的红，女神异闻录那种。纯装饰，不挡任何东西 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          background:
            'repeating-linear-gradient(115deg, #e11d48 0px, #e11d48 2px, transparent 2px, transparent 30px)'
        }}
      />
      {/* 这块红是给左边那列垫底的。宽度要盖过整屏：只盖 70vw 的话，
          斜切的右边缘会在屏幕中间留下一道竖着的亮边，看着像没渲染完。 */}
      <div className="pointer-events-none absolute -left-40 -right-40 top-0 bottom-0 bg-gradient-to-r from-rose-700/20 via-rose-700/8 to-transparent transform -skew-x-12" />

      {/* 顶栏 */}
      <div className="relative flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
        <div className="bg-yellow-400 text-black px-4 py-1.5 transform -skew-x-12 shadow-[6px_6px_0_rgba(0,0,0,0.6)]">
          <span className="block transform skew-x-12 text-[11px] md:text-sm font-black tracking-widest">
            {en ? 'WHAT YOU HAVE' : '持ち物'}
            <span className="ml-2 text-black/45 font-mono text-[10px]">{all.length}</span>
          </span>
        </div>
        <div className="hidden sm:block text-[11px] font-mono text-white/35">{yen(life.yen)}</div>
        <button
          onClick={() => { audioManager.playSfx('click'); onClose(); }}
          className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
        >
          <span className="block transform skew-x-12">{en ? '◀ Back' : '◀ 返回'}</span>
        </button>
      </div>

      {/* 分类 */}
      <div className="relative flex items-center gap-1.5 px-4 md:px-6 py-2.5 border-b border-white/10 shrink-0 overflow-x-auto">
        {tab('all', en ? 'All' : '全部', all.length)}
        {KIND_ORDER.map(k => tab(k, en ? KIND_LABELS[k].en : KIND_LABELS[k].jp, counts[k] || 0))}
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col md:flex-row">
        {/* 左：斜切的一列 */}
        <div className="w-full md:w-[380px] shrink-0 overflow-y-auto py-3 pl-2 pr-4 md:pr-6 max-h-[40dvh] md:max-h-none">
          {rows.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-white/30">
              {en ? 'Nothing in this pocket.' : '这一格是空的。'}
            </p>
          )}
          {rows.map((r, i) => {
            const on = sel?.item.key === r.item.key;
            const c = KIND_COLOR[r.item.kind];
            return (
              <button
                key={r.item.key}
                onClick={() => choose(r.item.key)}
                style={{ animationDelay: `${Math.min(i, 20) * 24}ms` }}
                className={`group w-full mb-1.5 flex items-center gap-3 pl-3 pr-3 py-2 transform -skew-x-12 border transition-all duration-200 animate-in fade-in slide-in-from-left-6 fill-mode-backwards ${
                  on
                    ? `bg-white text-black ${c.border} translate-x-2 shadow-[6px_6px_0_rgba(0,0,0,0.5)]`
                    : 'bg-black/55 border-white/10 hover:bg-black/80 hover:translate-x-1'
                }`}
              >
                <span className="block transform skew-x-12 flex items-center gap-3 w-full min-w-0">
                  <span className={`w-1.5 self-stretch shrink-0 ${on ? c.bg : 'bg-white/10'}`} />
                  <ItemIcon id={r.item.iconId} emoji={r.item.emoji} size={30} className="shrink-0" />
                  <span className="min-w-0 flex-1 text-left">
                    <span className={`block text-[13px] font-bold truncate ${on ? 'text-black' : 'text-white/90'}`}>
                      {en ? r.item.nameEn : r.item.nameZh}
                    </span>
                    <span className={`block text-[10px] font-mono truncate ${on ? 'text-black/50' : c.text + ' opacity-70'}`}>
                      {r.item.nameJp}
                      {r.item.subZh && <span className="ml-1.5">{en ? r.item.subEn : r.item.subZh}</span>}
                    </span>
                  </span>
                  {r.n > 1 && (
                    <span className={`shrink-0 font-mono text-sm font-black ${on ? 'text-black' : 'text-white/50'}`}>
                      ×{r.n}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* 右：这件东西是什么 */}
        <div className="flex-1 min-h-0 overflow-y-auto border-t md:border-t-0 md:border-l border-white/10">
          {sel && (
            <div key={sel.item.key} className="p-5 md:p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-start gap-4 md:gap-6">
                <div className={`shrink-0 w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-black/60 border-2 transform -skew-x-6 ${KIND_COLOR[sel.item.kind].border}`}>
                  <span className="block transform skew-x-6">
                    <ItemIcon id={sel.item.iconId} emoji={sel.item.emoji} size={64} />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${KIND_COLOR[sel.item.kind].text}`}>
                    {en ? KIND_LABELS[sel.item.kind].en : KIND_LABELS[sel.item.kind].zh}
                  </p>
                  <h2 className="mt-1 text-2xl md:text-4xl font-black text-white leading-tight">
                    {en ? sel.item.nameEn : sel.item.nameZh}
                  </h2>
                  <p className="mt-0.5 text-sm md:text-lg font-mono text-yellow-400/85">
                    {sel.item.nameJp}
                    <span className="ml-2 text-[10px] md:text-xs text-white/35">{sel.item.reading}</span>
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm md:text-base text-white/75 leading-relaxed">
                {en ? sel.item.descEn : sel.item.descZh}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {sel.n > 1 && (
                  <span className="text-[11px] px-2.5 py-1 border border-white/20 text-white/60">
                    {en ? `You have ${sel.n}` : `手上有 ${sel.n} 个`}
                  </span>
                )}
                {sel.item.subZh && (
                  <span className="text-[11px] px-2.5 py-1 border border-white/20 text-white/60">
                    {en ? sel.item.subEn : sel.item.subZh}
                  </span>
                )}
                {sel.item.worth ? (
                  <span className="text-[11px] px-2.5 py-1 border border-white/20 text-white/60">
                    {en ? 'Sells for ' : '能卖 '}{yen(sel.item.worth)}
                  </span>
                ) : null}
                {sel.item.kind === 'keepsake' && (
                  <span className="text-[11px] px-2.5 py-1 border border-yellow-400/50 text-yellow-300/90">
                    {en ? 'Not for selling' : '这个不卖'}
                  </span>
                )}
              </div>

              {/* 挂着生词的东西顺手教一个 */}
              {sel.item.word && (
                <div className="mt-6 inline-flex items-baseline gap-3 bg-black/60 border-l-4 border-yellow-400 px-4 py-2.5">
                  <span className="text-lg md:text-2xl font-black text-white">{sel.item.word.jp}</span>
                  <span className="text-[11px] font-mono text-yellow-400/80">{sel.item.word.reading}</span>
                  <span className="text-xs md:text-sm text-white/65">
                    {en ? sel.item.word.en : sel.item.word.zh}
                  </span>
                </div>
              )}

              {/* 有大图的（学生证）能点开看 */}
              {sel.item.image && (
                <div className="mt-6">
                  <button
                    onClick={() => { audioManager.playSfx('page'); setZoom(true); }}
                    className="bg-yellow-400 hover:bg-white text-black px-5 py-2 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
                  >
                    <span className="block transform skew-x-12">{en ? 'Take a look' : '拿出来看看'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {zoom && sel?.item.image && (
        <div
          className="absolute inset-0 z-10 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoom(false)}
        >
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={sel.item.image} alt="" className="w-full border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.7)]" />
            <button
              onClick={() => { audioManager.playSfx('click'); setZoom(false); }}
              className="mt-4 bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-5 py-2 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
            >
              <span className="block transform skew-x-12">{en ? 'Put it away' : '收起来'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryScreen;
