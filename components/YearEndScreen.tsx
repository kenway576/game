import React from 'react';
import {
  Language, CharacterId, StoryFlags, AffectionMap, FamiliarityMap,
  ProtagonistStats, CollectedWord
} from '../types';
import { CHARACTERS, VISIBLE_CHARACTER_IDS, SCHOOL_YEAR_LENGTH } from '../constants';
import CharacterAvatar from './CharacterAvatar';
import { ENDINGS, endingsFor, isEndingUnlocked, unlockedCount, clearedRouteCount, TOTAL_ENDINGS } from '../data/endingsData';

interface Props {
  language: Language;
  playerName: string;
  stats: ProtagonistStats;
  storyFlags: StoryFlags;
  affectionMap: AffectionMap;
  familiarityMap: FamiliarityMap;
  words: CollectedWord[];
  unlockedCgs: string[];
  onClose: () => void;
}

// ---------------------------------------------------------
// 🎓 学年结算
//
// 修了式演完之后的那一屏。它要回答的问题只有一个：
// **这一年，你到底和谁一起过的。**
//
// 所以主体不是数值，是名单：按親密度排，谁在最上面，
// 谁到最后还只是"面熟"。数值放在下面，小字。
// ---------------------------------------------------------
const YearEndScreen: React.FC<Props> = ({
  language, playerName, stats, storyFlags, affectionMap, familiarityMap,
  words, unlockedCgs, onClose
}) => {
  const en = language === 'en';

  const people = VISIBLE_CHARACTER_IDS
    .filter(id => ENDINGS.some(e => e.char === id))
    .map(id => ({
      id: id as CharacterId,
      c: CHARACTERS[id as CharacterId],
      fam: familiarityMap[id as CharacterId] || 0,
      aff: affectionMap[id as CharacterId] || 0,
      ending: endingsFor(id as CharacterId).find(e => isEndingUnlocked(e, storyFlags)) || null
    }))
    .sort((a, b) => (b.fam + b.aff) - (a.fam + a.aff));

  const closest = people[0];
  const statRows: { k: keyof ProtagonistStats; zh: string; en: string }[] = [
    { k: 'knowledge', zh: '学识', en: 'Knowledge' },
    { k: 'charm', zh: '魅力', en: 'Charm' },
    { k: 'guts', zh: '胆识', en: 'Guts' },
    { k: 'kindness', zh: '体贴', en: 'Kindness' },
    { k: 'proficiency', zh: '熟练', en: 'Proficiency' }
  ];

  return (
    <div className="fixed inset-0 z-[240] overflow-y-auto bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="min-h-full flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-3xl">
          {/* 标题 */}
          <div className="mb-8 border-b-4 border-red-600 pb-4">
            <div className="text-[10px] font-black tracking-[0.35em] text-yellow-400 mb-2">
              {en ? 'END OF THE SCHOOL YEAR' : '学年修了'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
              {en ? 'ONE YEAR IN KOBE' : '神户的一年'}
            </h1>
            <p className="text-white/45 text-sm mt-3">
              {en
                ? `${playerName} · ${SCHOOL_YEAR_LENGTH} days · 11 April to 24 March`
                : `${playerName} · ${SCHOOL_YEAR_LENGTH} 天 · 四月十一日到三月二十四日`}
            </p>
          </div>

          {/* 谁陪你走完的 */}
          <div className="mb-8">
            <h2 className="text-sm font-black text-yellow-400 tracking-[0.2em] mb-3">
              {en ? 'WHO YOU SPENT IT WITH' : '这一年和谁一起过的'}
            </h2>
            {closest && (
              <p className="text-white/55 text-xs mb-4 leading-relaxed">
                {en
                  ? `Of everybody in this city, the one who ended up closest was ${closest.c?.nameEn}.`
                  : `这一整座城市里，最后离你最近的那个人是${closest.c?.name}。`}
              </p>
            )}
            <div className="space-y-1.5">
              {people.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-black/50 border border-white/10 rounded px-3 py-2">
                  <CharacterAvatar charId={p.id} size="w-8 h-8" />
                  <div className="text-white text-sm font-bold w-24 shrink-0 truncate">
                    {en ? p.c?.nameEn : p.c?.name}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="h-1 bg-white/10 rounded overflow-hidden">
                      <div className="h-full bg-sky-500" style={{ width: `${Math.min(100, (p.fam / 250) * 100)}%` }} />
                    </div>
                    <div className="h-1 bg-white/10 rounded overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${Math.min(100, (p.aff / 250) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="text-[10px] font-bold w-28 text-right shrink-0">
                    {p.ending ? (
                      <span className="text-yellow-300">
                        {p.ending.kind === 'love' ? '💗 ' : '🤝 '}
                        {en ? p.ending.titleEn : p.ending.titleZh}
                      </span>
                    ) : (
                      <span className="text-white/25">{en ? 'no ending' : '未走到结局'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 数字 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: en ? 'Routes cleared' : '通关的线', value: `${clearedRouteCount(storyFlags)}/8` },
              { label: en ? 'Endings seen' : '看到的结局', value: `${unlockedCount(storyFlags)}/${TOTAL_ENDINGS}` },
              { label: en ? 'Words collected' : '单词本', value: `${words.length}` },
              { label: en ? 'Memories' : '回忆 CG', value: `${unlockedCgs.length}` }
            ].map(x => (
              <div key={x.label} className="bg-black/50 border border-white/10 rounded p-3">
                <div className="text-2xl font-black text-white">{x.value}</div>
                <div className="text-[10px] text-white/40 tracking-wider uppercase mt-0.5">{x.label}</div>
              </div>
            ))}
          </div>

          {/* 五维 */}
          <div className="mb-10">
            <h2 className="text-sm font-black text-yellow-400 tracking-[0.2em] mb-3">
              {en ? 'WHO YOU BECAME' : '你变成了什么样的人'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {statRows.map(r => (
                <div key={r.k} className="flex items-center gap-3 bg-black/40 border border-white/10 rounded px-3 py-2">
                  <span className="text-white/60 text-xs w-16 shrink-0">{en ? r.en : r.zh}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${Math.min(100, ((stats[r.k] || 0) / 60) * 100)}%` }} />
                  </div>
                  <span className="text-white font-mono text-xs w-8 text-right">{stats[r.k] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/35 text-xs leading-relaxed mb-6">
            {en
              ? 'The year is over, but the save is not closed: keep playing, or load a save from before the third chapter to take somebody down the other branch.'
              : '学年结束了，但存档没有关：可以继续玩下去，也可以读一份第③段之前的存档，把某个人带去另一条分岔。'}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black tracking-[0.2em] uppercase py-4 transition-colors"
          >
            {en ? 'Continue' : '继续'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearEndScreen;
