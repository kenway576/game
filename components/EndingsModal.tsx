import React from 'react';
import { CharacterId, Language, StoryFlags, AffectionMap, FamiliarityMap } from '../types';
import { CHARACTERS, VISIBLE_CHARACTER_IDS, getRomanceCeiling } from '../constants';
import CharacterAvatar from './CharacterAvatar';
import {
  ENDINGS, endingsFor, isEndingUnlocked, unlockedCount, clearedRouteCount,
  endingGateFor, TOTAL_ENDINGS, TOTAL_ROUTES
} from '../data/endingsData';

interface Props {
  language: Language;
  storyFlags: StoryFlags;
  affectionMap: AffectionMap;
  familiarityMap: FamiliarityMap;
  onClose: () => void;
}

const bar = (value: number, goal: number) => Math.max(0, Math.min(100, Math.round((value / goal) * 100)));

const EndingsModal: React.FC<Props> = ({ language, storyFlags, affectionMap, familiarityMap, onClose }) => {
  const en = language === 'en';
  const got = unlockedCount(storyFlags);
  const cleared = clearedRouteCount(storyFlags);
  const all = got >= TOTAL_ENDINGS;

  const chars = VISIBLE_CHARACTER_IDS.filter(id => ENDINGS.some(e => e.char === id));

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl bg-zinc-950/95 border-2 border-yellow-500/40 rounded-xl p-6 md:p-8 shadow-[0_0_80px_rgba(234,179,8,0.2)] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-yellow-500/30 pb-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 tracking-wider">
              {en ? '🏁 ENDING RECORD' : '🏁 结局记录'}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              {en
                ? `${cleared}/${TOTAL_ROUTES} routes cleared · ${got}/${TOTAL_ENDINGS} endings seen`
                : `已通关 ${cleared}/${TOTAL_ROUTES} 条线 · 已看到 ${got}/${TOTAL_ENDINGS} 个结局`}
            </p>
            <p className="text-[11px] text-white/35 mt-1 leading-relaxed max-w-xl">
              {en
                ? 'Every route ends two different ways, and a single save can only take one of them.'
                : '每条线都有两种走法，而一份存档只走得到其中一种。'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {all && (
          <div className="mb-6 border border-yellow-400/50 bg-yellow-400/10 px-4 py-3 rounded">
            <div className="text-yellow-300 font-black tracking-widest text-sm">
              {en ? 'ALL ENDINGS SEEN' : '全结局达成'}
            </div>
            <div className="text-white/60 text-xs mt-1">
              {en
                ? 'Sixteen endings across eight people, on however many saves it took.'
                : '八个人，十六个结局，不管用了几份存档。'}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {chars.map(id => {
            const c = CHARACTERS[id as CharacterId];
            const aff = affectionMap[id as CharacterId] || 0;
            const fam = familiarityMap[id as CharacterId] || 0;
            const list = endingsFor(id as CharacterId);
            const gate = endingGateFor(id as CharacterId);
            const AFF_GOAL = gate.splitAxis === 'affection' ? gate.splitValue : gate.triggerValue;
            const FAM_GOAL = gate.splitAxis === 'familiarity' ? gate.splitValue : gate.triggerValue;
            const ceiling = getRomanceCeiling(fam);
            // 好感度顶到天花板了但親密度还没跟上 —— 玩家最容易卡的地方，直说。
            const capped = aff >= ceiling && aff < AFF_GOAL;

            return (
              <div key={id} className="border border-white/10 bg-black/40 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CharacterAvatar charId={id as CharacterId} size="w-10 h-10" />
                  <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate">{en ? c?.nameEn : c?.name}</div>
                    <div className="text-[10px] text-white/40 font-mono">
                      {en ? 'AFF' : '好感'} {aff}/{AFF_GOAL} · {en ? 'FAM' : '親密'} {fam}/{FAM_GOAL}
                    </div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {list.map(e => (
                      <span
                        key={e.flag}
                        className={`w-2.5 h-2.5 rounded-full ${isEndingUnlocked(e, storyFlags) ? 'bg-yellow-400' : 'bg-white/15'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* 两条进度：触发那条轴 + 分岔那条轴，各人的门槛不一样，读 endingGateFor */}
                <div className="space-y-1 mb-3">
                  <div className="h-1 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: `${bar(aff, AFF_GOAL)}%` }} />
                  </div>
                  <div className="h-1 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${bar(fam, FAM_GOAL)}%` }} />
                  </div>
                </div>

                {capped && (
                  <div className="text-[11px] text-amber-300/80 mb-2">
                    {en
                      ? 'Affection is against its ceiling — familiarity has to come up before it can move again.'
                      : '好感度已经顶到天花板了 —— 得先把親密度处上去，好感度才能继续涨。'}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {list.map(e => {
                    const open = isEndingUnlocked(e, storyFlags);
                    return (
                      <div
                        key={e.flag}
                        className={`px-3 py-2 rounded border text-xs ${
                          open
                            ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-200'
                            : 'border-white/10 bg-white/[0.03] text-white/35'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{e.kind === 'love' ? '💗' : '🤝'}</span>
                          <span className="font-bold tracking-wide">
                            {open ? (en ? e.titleEn : e.titleZh) : '— — — —'}
                          </span>
                        </div>
                        {/* 没解锁的不给提示。
                            本来这里写着"第③段触发时好感度 200 以上"——
                            等于把两条分岔的开关直接印在收集册上，
                            玩家还没走到就已经知道该怎么走了，神秘感没了。
                            现在只留一个空位：你知道那儿有东西，不知道是什么。 */}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EndingsModal;
