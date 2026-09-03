import React, { useMemo, useState } from 'react';
import { Language, GameCalendar, StoryFlags, StoryEffect } from '../types';
import { CAFETERIA_MENU, CafeteriaItem, isSoldOut, tastedFlag } from '../data/cafeteriaData';
import { audioManager } from '../services/audioManager';
import ItemIcon from './ItemIcon';

// ---------------------------------------------------------
// 🍜 学生食堂
//
// 界面照着真食堂来：左边是墙上的菜单牌，右边是选中那一样的详情。
// 卖光的不藏起来，划掉——「今天没有炸鸡」本身就是今天的一条信息，
// 藏起来的话玩家只会以为这个游戏的菜单每天随机。
//
// 【吃完那一下】
// 每样东西第一次吃都有一句主角的话。这是这个界面真正的内容：
// 属性只给 1 点，来这儿的理由是"想看看这个第一口是什么感觉"。
// 所以吃下去之后不是弹个 toast 就完事，是把那句话整段推上来。
// ---------------------------------------------------------

interface Props {
  language: Language;
  calendar: GameCalendar;
  storyFlags: StoryFlags;
  yen: number;
  slotsLeft: number;
  onClose: () => void;
  onEat: (item: CafeteriaItem, firstTime: boolean) => void;
}

const yenStr = (n: number) => '¥' + n.toLocaleString('ja-JP');

const CafeteriaScreen: React.FC<Props> = ({
  language, calendar, storyFlags, yen, slotsLeft, onClose, onEat
}) => {
  const en = language === 'en';
  const [pickId, setPickId] = useState<string>(CAFETERIA_MENU[0].id);
  // 刚吃完的那一样：详情面板换成主角的感想
  const [ate, setAte] = useState<{ item: CafeteriaItem; first: boolean } | null>(null);

  const stock = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const it of CAFETERIA_MENU) m[it.id] = isSoldOut(it, calendar, slotsLeft);
    return m;
  }, [calendar, slotsLeft]);

  const sel = CAFETERIA_MENU.find(i => i.id === pickId) || CAFETERIA_MENU[0];
  const soldOut = stock[sel.id];
  const tasted = !!storyFlags[tastedFlag(sel.id)];
  const canAfford = yen >= sel.price;
  const soldOutCount = CAFETERIA_MENU.filter(i => stock[i.id]).length;

  const buy = () => {
    if (soldOut || !canAfford) { audioManager.playSfx('error'); return; }
    audioManager.playSfx('confirm');
    const first = !storyFlags[tastedFlag(sel.id)];
    onEat(sel, first);
    setAte({ item: sel, first });
  };

  return (
    <div className="fixed inset-0 z-[140] bg-[#0a0a0f] overflow-hidden select-none flex flex-col">
      <img
        src="/images/backgrounds/bg_kaisei_cafeteria.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/40" />

      {/* 顶栏 */}
      <div className="relative flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
        <div className="bg-black/75 border border-white/20 px-4 py-1.5 transform -skew-x-12">
          <span className="block transform skew-x-12 text-[11px] md:text-sm font-black text-white tracking-widest">
            {en ? 'CAFETERIA' : '学生食堂'}
            <span className="ml-3 text-white/40 font-mono text-[10px]">学生食堂</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {soldOutCount > 0 && (
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-rose-300/80 border border-rose-500/40 px-2 py-1">
              {en ? `${soldOutCount} sold out` : `${soldOutCount} 样卖完了`}
            </span>
          )}
          <span className="text-[11px] font-mono text-yellow-400/80">{yenStr(yen)}</span>
        </div>
        <button
          onClick={() => { audioManager.playSfx('click'); onClose(); }}
          className="bg-black/70 hover:bg-yellow-400 hover:text-black text-white/80 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
        >
          <span className="block transform skew-x-12">{en ? '◀ Leave' : '◀ 离开'}</span>
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col md:flex-row">
        {/* 左：墙上的菜单牌 */}
        <div className="w-full md:w-[400px] shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 max-h-[42dvh] md:max-h-none">
          {CAFETERIA_MENU.map(it => {
            const out = stock[it.id];
            const on = it.id === pickId;
            const had = !!storyFlags[tastedFlag(it.id)];
            return (
              <button
                key={it.id}
                onClick={() => { audioManager.playSfx('click'); setPickId(it.id); setAte(null); }}
                className={`w-full text-left px-3 py-2.5 border-b border-white/5 flex items-center gap-3 transition-colors ${
                  on ? 'bg-yellow-400/15' : 'hover:bg-white/5'
                }`}
              >
                <span className={`w-1 self-stretch shrink-0 ${on ? 'bg-yellow-400' : 'bg-transparent'}`} />
                <ItemIcon id={it.id} emoji={it.emoji} size={34} className={`shrink-0 ${out ? 'opacity-30 grayscale' : ''}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-bold truncate ${out ? 'text-white/30 line-through' : 'text-white'}`}>
                    {en ? it.nameEn : it.nameZh}
                  </span>
                  <span className="block text-[10px] font-mono text-white/35 truncate">{it.nameJp}</span>
                </span>
                {/* 吃过的打个点，方便看还剩哪几样没试过 */}
                {had && !out && <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400/70" />}
                <span className={`shrink-0 font-mono text-xs ${out ? 'text-rose-300/60' : 'text-yellow-400/80'}`}>
                  {out ? (en ? 'SOLD OUT' : '売り切れ') : yenStr(it.price)}
                </span>
              </button>
            );
          })}
        </div>

        {/* 右：详情 / 吃完的感想 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-8">
          {ate ? (
            <div key={ate.item.id} className="animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center gap-4">
                <ItemIcon id={ate.item.id} emoji={ate.item.emoji} size={56} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400/80">
                    {ate.first ? (en ? 'First time' : '第一次吃') : (en ? 'Again' : '又吃了一次')}
                  </p>
                  <h2 className="text-xl md:text-3xl font-black text-white">{en ? ate.item.nameEn : ate.item.nameZh}</h2>
                </div>
              </div>

              {ate.item.firstJp && (
                <p className="mt-6 text-lg md:text-2xl font-bold text-white leading-relaxed">{ate.item.firstJp}</p>
              )}
              <p className="mt-3 max-w-2xl text-sm md:text-base text-white/75 leading-relaxed">
                {en ? ate.item.firstEn : ate.item.firstZh}
              </p>

              {ate.item.word && (
                <div className="mt-6 inline-flex items-baseline gap-3 bg-black/60 border-l-4 border-yellow-400 px-4 py-2.5">
                  <span className="text-lg md:text-2xl font-black text-white">{ate.item.word.jp}</span>
                  <span className="text-[11px] font-mono text-yellow-400/80">{ate.item.word.reading}</span>
                  <span className="text-xs md:text-sm text-white/65">{en ? ate.item.word.en : ate.item.word.zh}</span>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => { audioManager.playSfx('page'); setAte(null); }}
                  className="bg-yellow-400 hover:bg-white text-black px-6 py-2 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all"
                >
                  <span className="block transform skew-x-12">{en ? 'Back to the board' : '再看看菜单'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div key={sel.id} className="animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-start gap-4 md:gap-6">
                <div className={`shrink-0 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-black/60 border-2 transform -skew-x-6 ${
                  soldOut ? 'border-rose-500/40' : 'border-yellow-400/50'
                }`}>
                  <span className="block transform skew-x-6">
                    <ItemIcon id={sel.id} emoji={sel.emoji} size={78} className={soldOut ? 'opacity-30 grayscale' : ''} />
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                    {en ? sel.nameEn : sel.nameZh}
                  </h2>
                  <p className="mt-0.5 text-sm md:text-lg font-mono text-yellow-400/85">
                    {sel.nameJp}
                    <span className="ml-2 text-[10px] md:text-xs text-white/35">{sel.reading}</span>
                  </p>
                  <p className="mt-2 text-xl md:text-2xl font-black text-white/90">{yenStr(sel.price)}</p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm md:text-base text-white/75 leading-relaxed">
                {en ? sel.descEn : sel.descZh}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {sel.effects.map((e: StoryEffect, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 border border-white/20 text-white/60">
                    {en ? e.reasonEn : e.reasonZh}
                  </span>
                ))}
                {tasted && (
                  <span className="text-[11px] px-2.5 py-1 border border-emerald-400/40 text-emerald-300/80">
                    {en ? 'You have had this' : '吃过了'}
                  </span>
                )}
                {sel.popularity === 3 && !soldOut && (
                  <span className="text-[11px] px-2.5 py-1 border border-yellow-400/50 text-yellow-300/90">
                    {en ? 'Goes fast' : '手慢就没'}
                  </span>
                )}
              </div>

              {soldOut && (
                <p className="mt-5 text-sm text-rose-300/80">
                  {en
                    ? 'The tray for this one is already empty, and the lady behind the counter shakes her head before you finish pointing.'
                    : '这一格的盘子已经空了。你手还没指完，柜台后面的阿姨就摇了摇头。'}
                </p>
              )}

              <div className="mt-7">
                <button
                  onClick={buy}
                  disabled={soldOut || !canAfford}
                  className={`px-8 md:px-12 py-3 text-sm font-black uppercase tracking-widest transform -skew-x-12 transition-all ${
                    !soldOut && canAfford
                      ? 'bg-yellow-400 text-black hover:bg-white'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span className="block transform skew-x-12">
                    {soldOut
                      ? (en ? 'Sold out' : '卖完了')
                      : !canAfford
                        ? (en ? 'Not enough' : '钱不够')
                        : (en ? 'Buy and eat' : '买来吃 ▶')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative shrink-0 px-4 md:px-6 py-2.5 border-t border-white/10">
        <span className="text-[11px] text-white/40">
          {en
            ? 'The good things go first. Come straight from class and there is still karaage; take a detour and there is not.'
            : '好东西先没。下课直接过来还有炸鸡，中间拐一趟就没了。'}
        </span>
      </div>
    </div>
  );
};

export default CafeteriaScreen;
