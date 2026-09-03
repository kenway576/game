import React, { useState } from 'react';
import { Language, LifeState, StoryEffect, RecipeDef } from '../types';
import { RECIPES, canCook, consumeFor, fishCounts } from '../data/cookData';
import { SEEDS, findFish } from '../data/lifeData';
import { audioManager } from '../services/audioManager';
import ItemIcon from './ItemIcon';

// ---------------------------------------------------------
// 🍳 厨房
//
// 菜谱**全部列出来**，做不了的灰着并标出缺什么。
// 藏起来做不了的会让玩家不知道该去种什么、钓什么——
// 而"为了那道鲷めし去攒一条明石鲷"正是想要的动机。
//
// 做完直接吃掉结算属性，不进背包。理由是这游戏没有物品栏管理，
// 多一层"做好了放着"只会多一次点击，不会多出任何决策。
// ---------------------------------------------------------

interface Props {
  language: Language;
  life: LifeState;
  onClose: () => void;
  onCook: (recipe: RecipeDef, firstTime: boolean) => void;
}

const KitchenScreen: React.FC<Props> = ({ language, life, onClose, onCook }) => {
  const en = language === 'en';
  const [selId, setSelId] = useState<string | null>(null);
  const sel = RECIPES.find(r => r.id === selId) || RECIPES[0];
  const dex = life.cookedDex || {};
  const madeCount = Object.keys(dex).length;

  const fc = fishCounts(life.items);

  // 缺什么，说清楚。只说"材料不够"等于没说。
  const missing = (r: RecipeDef): string[] => {
    const out: string[] = [];
    for (const need of r.needs || []) {
      const have = life.items[need.itemId] || 0;
      if (have < need.n) {
        const seed = SEEDS.find(s => s.cropId === need.itemId);
        const name = seed ? (en ? seed.cropNameEn : seed.cropNameZh) : need.itemId;
        out.push(`${name} ${have}/${need.n}`);
      }
    }
    for (const nf of r.needFish || []) {
      const have = fc.byId[nf.fishId] || 0;
      if (have < nf.n) {
        const f = findFish(nf.fishId);
        out.push(`${f ? (en ? f.nameEn : f.nameZh) : nf.fishId} ${have}/${nf.n}`);
      }
    }
    if (r.anyFish) {
      const reserved = (r.needFish || []).reduce((s, x) => s + x.n, 0);
      const have = fc.total - reserved;
      if (have < r.anyFish) out.push(`${en ? 'any fish' : '任意鱼'} ${Math.max(0, have)}/${r.anyFish}`);
    }
    return out;
  };

  const ingredientLine = (r: RecipeDef): string => {
    const parts: string[] = [];
    for (const need of r.needs || []) {
      const seed = SEEDS.find(s => s.cropId === need.itemId);
      parts.push(`${seed ? (en ? seed.cropNameEn : seed.cropNameZh) : need.itemId} ×${need.n}`);
    }
    for (const nf of r.needFish || []) {
      const f = findFish(nf.fishId);
      parts.push(`${f ? (en ? f.nameEn : f.nameZh) : nf.fishId} ×${nf.n}`);
    }
    if (r.anyFish) parts.push(`${en ? 'any fish' : '任意鱼'} ×${r.anyFish}`);
    return parts.join(en ? ' + ' : ' ＋ ');
  };

  const statName = (k: StoryEffect['stat']) => en
    ? k
    : ({ knowledge: '知识', guts: '勇气', kindness: '体贴', charm: '魅力', proficiency: '灵巧' } as const)[k];

  const cook = () => {
    if (!sel || !canCook(sel, life)) return;
    audioManager.playSfx('confirm');
    onCook(sel, !dex[sel.id]);
  };

  const ok = sel && canCook(sel, life);
  const lack = sel ? missing(sel) : [];

  return (
    <div className="fixed inset-0 z-[125] bg-black select-none flex flex-col">
      <img src="/images/backgrounds/kitchen.webp" alt=""
           className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40" />

      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
        <div>
          <div className="text-sm md:text-lg font-black text-amber-300 tracking-wide">
            {en ? 'Kitchen' : '厨房'}
          </div>
          <div className="text-[10px] font-mono text-white/35">
            台所 <span className="text-white/25">だいどころ</span>
            <span className="ml-3 text-white/30">{en ? 'learned' : '学会'} {madeCount}/{RECIPES.length}</span>
          </div>
        </div>
        <button
          onClick={() => { audioManager.playSfx('click'); onClose(); }}
          className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
        >
          <span className="block transform skew-x-12">{en ? '◀ Back' : '◀ 返回'}</span>
        </button>
      </div>

      <div className="relative z-10 flex-1 min-h-0 flex flex-col md:flex-row">
        {/* 菜谱 */}
        <div className="md:w-[340px] shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 max-h-[38dvh] md:max-h-none">
          {RECIPES.map(r => {
            const can = canCook(r, life);
            const made = !!dex[r.id];
            return (
              <button key={r.id}
                onClick={() => { audioManager.playSfx('click'); setSelId(r.id); }}
                className={`w-full text-left px-4 py-2.5 border-b border-white/5 flex items-center gap-3 transition-colors ${
                  sel?.id === r.id ? 'bg-amber-400/15' : 'hover:bg-white/5'
                }`}>
                <ItemIcon id={r.id} emoji={r.emoji} size={30}
                  className={`shrink-0 ${can ? '' : 'grayscale brightness-50'}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-bold truncate ${can ? 'text-white' : 'text-white/35'}`}>
                    {en ? r.nameEn : r.nameZh}
                  </span>
                  <span className="block text-[10px] font-mono text-white/30 truncate">{r.nameJp}</span>
                </span>
                {made && <span className="text-[10px] text-amber-400/80 shrink-0">×{dex[r.id]}</span>}
                {can && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* 详情 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-8">
          {sel && (
            <>
              <ItemIcon id={sel.id} emoji={sel.emoji} size={104} className="mb-3" />
              <h2 className="text-2xl md:text-3xl font-black text-white">{en ? sel.nameEn : sel.nameZh}</h2>
              <div className="mt-1 text-base font-mono text-amber-300/85">
                {sel.nameJp}<span className="ml-2 text-[11px] text-white/35">{sel.reading}</span>
              </div>

              <p className="mt-4 max-w-xl text-sm text-white/70 leading-relaxed">
                {en ? sel.descEn : sel.descZh}
              </p>

              <div className="mt-5">
                <div className="text-[11px] text-white/40 mb-1">{en ? 'Ingredients' : '材料'}</div>
                <div className={`text-sm ${ok ? 'text-white/80' : 'text-white/45'}`}>{ingredientLine(sel)}</div>
                {!ok && lack.length > 0 && (
                  <div className="mt-2 text-[11px] text-rose-300/85">
                    {en ? 'short of' : '还差'}：{lack.join('、')}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-white/40 mb-1.5">{en ? 'Eating it gives' : '吃掉之后'}</div>
                <div className="flex flex-wrap gap-2">
                  {sel.effects.map(e => (
                    <span key={e.stat} className="px-2.5 py-1 border border-emerald-500/45 bg-emerald-500/10 text-emerald-300 text-xs font-bold">
                      {statName(e.stat)} +{e.amount}
                    </span>
                  ))}
                  {!dex[sel.id] && (
                    <span className="px-2.5 py-1 border border-amber-500/45 bg-amber-500/10 text-amber-300 text-xs font-bold">
                      {en ? 'first time · knowledge +1' : '初次 · 知识 +1'}
                    </span>
                  )}
                </div>
              </div>

              {sel.word && (
                <div className="mt-5 inline-flex items-center gap-2 border border-white/20 px-3 py-1.5">
                  <span className="text-amber-200 font-bold text-sm">{sel.word.jp}</span>
                  <span className="text-[10px] text-white/40 font-mono">{sel.word.reading}</span>
                  <span className="text-[11px] text-white/60">{en ? sel.word.en : sel.word.zh}</span>
                </div>
              )}

              <div className="mt-7">
                <button onClick={cook} disabled={!ok}
                  className={`px-9 py-3 text-sm font-black uppercase tracking-widest transform -skew-x-12 transition-all ${
                    ok ? 'bg-amber-400 text-black hover:bg-white' : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}>
                  <span className="block transform skew-x-12">
                    {ok ? (en ? 'Cook & eat' : '做来吃') : (en ? 'Missing ingredients' : '材料不够')}
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

export default KitchenScreen;
