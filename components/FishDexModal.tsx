import React, { useState } from 'react';
import { Language, LifeState } from '../types';
import { FISH } from '../data/lifeData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 📖 鱼图鉴
//
// 没钓到的**照样列出来**，只是打成剪影 —— 玩家得看得见还差几条，
// 否则收集就没有目标。但不剧透在哪儿钓：那是自己去撞出来的部分。
// 钓到之后才显示地点、时段和那段介绍。
//
// 杂物（长靴、空罐）不进图鉴，所以总数不会被垃圾撑大。
// ---------------------------------------------------------

interface Props {
  language: Language;
  life: LifeState;
  onClose: () => void;
}

const FishDexModal: React.FC<Props> = ({ language, life, onClose }) => {
  const en = language === 'en';
  const list = FISH.filter(f => !f.junk);
  const [sel, setSel] = useState<string | null>(null);
  const pick = list.find(f => f.id === sel) || null;
  const got = (id: string) => !!life.fishDex[id];
  const owned = list.filter(f => got(f.id)).length;

  const slotName = (s: string) => en ? s : s === 'morning' ? '早晨' : s === 'afternoon' ? '午后' : '夜里';
  const spotName: Record<string, { zh: string; en: string }> = {
    meriken_park: { zh: '美利坚公园', en: 'Meriken Park' },
    kobe_harbor: { zh: '港湾乐园', en: 'Harborland' },
    portliner_platform: { zh: 'Port Liner 沿线', en: 'along the Port Liner' }
  };

  return (
    <div className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-sm flex flex-col select-none"
         onClick={onClose}>
      <div className="m-auto w-full max-w-5xl max-h-[92dvh] bg-[#0b0b10] border border-white/15 flex flex-col overflow-hidden"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
          <div>
            <span className="text-lg font-black text-cyan-300">{en ? 'Fish Guide' : '鱼图鉴'}</span>
            <span className="ml-3 text-[11px] font-mono text-white/40">魚図鑑 さかなずかん</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-yellow-400 tabular-nums">{owned} / {list.length}</span>
            <button onClick={() => { audioManager.playSfx('click'); onClose(); }}
              className="w-8 h-8 border border-white/25 text-white/70 hover:bg-yellow-400 hover:text-black transition-all font-black">✕</button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          <div className="md:w-[300px] shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 max-h-[38dvh] md:max-h-none">
            {list.map(f => {
              const has = got(f.id);
              const rec = life.fishDex[f.id];
              return (
                <button key={f.id}
                  onClick={() => { audioManager.playSfx('click'); setSel(f.id); }}
                  className={`w-full text-left px-4 py-2.5 border-b border-white/5 flex items-center gap-3 transition-colors ${
                    pick?.id === f.id ? 'bg-cyan-400/15' : 'hover:bg-white/5'
                  }`}>
                  <span className={`text-xl w-7 text-center ${has ? '' : 'grayscale brightness-[0.35]'}`}>{f.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-bold truncate ${has ? 'text-white' : 'text-white/25'}`}>
                      {has ? (en ? f.nameEn : f.nameZh) : '???'}
                    </span>
                    <span className="block text-[10px] font-mono text-white/30 truncate">
                      {has ? f.nameJp : '—'}
                    </span>
                  </span>
                  <span className="text-[10px] text-white/35 shrink-0">
                    {has ? `${rec.bestCm}cm` : '★'.repeat(f.rarity)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            {!pick ? (
              <p className="text-sm text-white/35">{en ? 'Pick one.' : '挑一条看看。'}</p>
            ) : !got(pick.id) ? (
              <div className="text-center pt-10">
                <div className="text-6xl grayscale brightness-[0.3] mb-4">{pick.emoji}</div>
                <p className="text-white/35 text-sm">
                  {en ? 'Not caught yet.' : '还没钓到。'}
                </p>
                <p className="mt-2 text-[11px] text-white/25">{'★'.repeat(pick.rarity)}</p>
              </div>
            ) : (
              <>
                <div className="text-6xl mb-3">{pick.emoji}</div>
                <h3 className="text-2xl font-black text-white">{en ? pick.nameEn : pick.nameZh}</h3>
                <div className="mt-1 text-base font-mono text-cyan-300/85">
                  {pick.nameJp}<span className="ml-2 text-[11px] text-white/35">{pick.reading}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-1 border border-white/20 text-white/60">{'★'.repeat(pick.rarity)}</span>
                  <span className="px-2 py-1 border border-white/20 text-white/60">
                    {en ? 'best' : '最大'} {life.fishDex[pick.id].bestCm} cm
                  </span>
                  <span className="px-2 py-1 border border-white/20 text-white/60">
                    {en ? 'caught' : '钓到'} ×{life.fishDex[pick.id].count}
                  </span>
                  <span className="px-2 py-1 border border-white/20 text-white/60">
                    {en ? 'first' : '初次'} {life.fishDex[pick.id].firstMonth}/{life.fishDex[pick.id].firstDay}
                  </span>
                </div>
                <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xl">
                  {en ? pick.noteEn : pick.noteZh}
                </p>
                <div className="mt-5 text-[11px] text-white/45 space-y-1">
                  <div>{en ? 'Where' : '钓点'}：{pick.spots.map(s => (en ? spotName[s]?.en : spotName[s]?.zh) || s).join(en ? ', ' : '、')}</div>
                  {pick.timeSlots && <div>{en ? 'When' : '时段'}：{pick.timeSlots.map(slotName).join(en ? ', ' : '、')}</div>}
                  {pick.months && <div>{en ? 'Season' : '季节'}：{pick.months.join('/')} {en ? '' : '月'}</div>}
                </div>
                {pick.word && (
                  <div className="mt-5 inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5">
                    <span className="text-emerald-300 font-bold text-sm">{pick.word.jp}</span>
                    <span className="text-[10px] text-white/40 font-mono">{pick.word.reading}</span>
                    <span className="text-[11px] text-white/60">{en ? pick.word.en : pick.word.zh}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishDexModal;
