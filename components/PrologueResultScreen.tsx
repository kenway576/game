import React from 'react';
import { Language, PrologueResult, StatKey, CharacterId, FamiliarityMap } from '../types';
import { CHARACTERS, STAT_METADATA, FAMILIARITY_LEVELS, getFamiliarityLevelIndex } from '../constants';
import { PROLOGUE_FLAG_LABELS, PROLOGUE_PURCHASE_LABELS, PROLOGUE_FLAG_SUPERSEDED } from '../story/prologueMeta';

interface Props {
  language: Language;
  result: PrologueResult;
  familiarityMap: FamiliarityMap;
  onContinue: () => void;
}

const STAT_ORDER: StatKey[] = ['knowledge', 'guts', 'kindness', 'charm', 'proficiency'];

// 序章结算屏。
// 之前是「晚安，神户」→ 直接切大厅，玩家做过的一百多个决定连个交代都没有。
// 这一屏的作用只有一个：让玩家亲眼看见"我的选择被记住了"，再推进正篇。
const PrologueResultScreen: React.FC<Props> = ({ language, result, familiarityMap, onContinue }) => {
  const en = language === 'en';
  const { flags, statsBefore, statsAfter, wordsLearned, skipped } = result;

  // 被更具体的选择盖过的 flag 不再单独列一行（关西腔 vs 标准日语）
  const activeFlags = Object.keys(flags).filter(f => {
    if (!flags[f]) return false;
    const superseder = PROLOGUE_FLAG_SUPERSEDED[f];
    return !(superseder && flags[superseder]);
  });

  const choices = activeFlags
    .map(f => ({ flag: f, def: PROLOGUE_FLAG_LABELS[f] }))
    .filter(x => x.def && x.def.group === 'attitude');

  const encounters = activeFlags
    .map(f => ({ flag: f, def: PROLOGUE_FLAG_LABELS[f] }))
    .filter(x => x.def && x.def.group === 'encounter');

  const purchases = activeFlags
    .map(f => PROLOGUE_PURCHASE_LABELS[f])
    .filter(Boolean);

  const totalGain = STAT_ORDER.reduce(
    (sum, k) => sum + Math.max(0, (statsAfter[k] || 0) - (statsBefore[k] || 0)), 0
  );

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-zinc-950 via-black to-slate-950 overflow-y-auto animate-in fade-in duration-700">
      {/* 斜纹底 */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 14px)' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col gap-8">

        {/* ---------- 标题 ---------- */}
        <div className="animate-in slide-in-from-bottom-6 duration-700">
          <div className="inline-block bg-red-600 px-5 py-1 transform -skew-x-12 shadow-[6px_6px_0px_rgba(0,0,0,0.7)]">
            <span className="block transform skew-x-12 text-[11px] md:text-xs font-black uppercase tracking-[0.35em] text-white">
              {en ? 'Chapter 0 · Cleared' : '第 0 章 · 通关'}
            </span>
          </div>
          <h1 className="mt-4 text-3xl md:text-6xl font-black italic text-white tracking-tight leading-none">
            {en ? 'Day of the Sea Breeze' : '海风起航之日'}
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/50 italic">
            {skipped
              ? (en
                ? 'You skipped ahead. Only what you actually saw was counted.'
                : '你跳过了余下的部分。只有真正看到的那些被记了下来。')
              : (en
                ? 'April 10. Tomorrow morning, the door of Class 2-B opens.'
                : '4 月 10 日。明天清晨，海星学园高二 B 班的教室门就将向你敞开。')}
          </p>
        </div>

        {/* ---------- 五维属性 ---------- */}
        <section className="bg-black/60 border-2 border-white/15 backdrop-blur-sm p-5 md:p-7 animate-in slide-in-from-bottom-6 duration-700 delay-100">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-base md:text-xl font-black italic text-yellow-400 tracking-wide">
              {en ? 'WHO YOU BECAME' : '你把自己养成了什么样的人'}
            </h2>
            <span className="text-[11px] md:text-sm text-white/40 font-black tabular-nums">
              {en ? 'Total' : '合计'} +{totalGain}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {STAT_ORDER.map(key => {
              const meta = STAT_METADATA[key];
              const before = statsBefore[key] || 0;
              const after = statsAfter[key] || 0;
              const delta = after - before;
              const rank = [...meta.ranks].reverse().find(r => after >= r.threshold) || meta.ranks[0];
              return (
                <div key={key} className="flex items-center gap-3 md:gap-4">
                  <div className="w-20 md:w-28 shrink-0 text-[11px] md:text-sm font-black" style={{ color: meta.color }}>
                    {en ? meta.nameEn : meta.nameZh.split(' ')[0]}
                  </div>
                  <div className="flex-1 h-3 md:h-4 bg-white/8 border border-white/10 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 opacity-40"
                      style={{ width: `${Math.min(100, before)}%`, backgroundColor: meta.color }}
                    />
                    <div
                      className="absolute inset-y-0 transition-all duration-1000 ease-out"
                      style={{
                        left: `${Math.min(100, before)}%`,
                        width: `${Math.min(100 - Math.min(100, before), delta)}%`,
                        backgroundColor: meta.color,
                        boxShadow: `0 0 12px ${meta.color}`
                      }}
                    />
                  </div>
                  <div className="w-20 md:w-24 shrink-0 text-right tabular-nums">
                    <span className="text-sm md:text-lg font-black text-white">{after}</span>
                    {delta > 0 && (
                      <span className="ml-1.5 text-[11px] md:text-sm font-black" style={{ color: meta.color }}>
                        +{delta}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block w-28 shrink-0 text-[11px] text-white/45 truncate">
                    {en ? rank.nameEn : rank.nameZh}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- 遇见的人 ---------- */}
        {encounters.length > 0 && (
          <section className="bg-black/60 border-2 border-sky-400/25 backdrop-blur-sm p-5 md:p-7 animate-in slide-in-from-bottom-6 duration-700 delay-200">
            <h2 className="text-base md:text-xl font-black italic text-sky-300 tracking-wide mb-5">
              {en ? 'WHO YOU MET' : '你遇见的人'}
            </h2>
            <div className="flex flex-col gap-4">
              {encounters.map(({ flag, def }) => {
                const charId = def.char as CharacterId | undefined;
                const char = charId ? CHARACTERS[charId] : null;
                const fam = charId ? (familiarityMap[charId] || 0) : 0;
                const level = FAMILIARITY_LEVELS[getFamiliarityLevelIndex(fam)];
                return (
                  <div key={flag} className="flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full overflow-hidden border-2 border-sky-400/40 bg-black/50">
                      {char && (
                        <img
                          src={`/images/avatars/${charId}.webp`}
                          alt={char.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm md:text-lg font-black text-white">
                        {char ? (en ? char.nameEn : char.name) : '???'}
                        <span className="ml-2 text-[10px] md:text-xs font-bold text-sky-300/70 uppercase tracking-widest">
                          {en ? level.labelEn : level.labelZh}
                        </span>
                      </div>
                      <div className="text-[11px] md:text-sm text-white/55 leading-snug">
                        {def.icon} {en ? def.en : def.zh}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[9px] md:text-[10px] text-white/35 font-black uppercase tracking-widest">
                        {en ? 'Familiarity' : '親密度'}
                      </div>
                      <div className="text-lg md:text-2xl font-black text-sky-300 tabular-nums">{fam}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 pt-4 border-t border-white/10 text-[11px] md:text-xs text-white/40 leading-relaxed">
              {en
                ? 'This is remembered. When you talk to them for the first time, they will already know exactly this much about you — no more, no less.'
                : '这一段会被记住。第一次和她们说话时，她们对你的了解正好就是这么多——不多，也不少。'}
            </p>
          </section>
        )}

        {/* ---------- 关键选择 ---------- */}
        {choices.length > 0 && (
          <section className="bg-black/60 border-2 border-white/15 backdrop-blur-sm p-5 md:p-7 animate-in slide-in-from-bottom-6 duration-700 delay-300">
            <h2 className="text-base md:text-xl font-black italic text-white/90 tracking-wide mb-4">
              {en ? 'WHAT YOU DID' : '你做过的选择'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
              {choices.map(({ flag, def }) => (
                <div key={flag} className="flex items-start gap-2.5 text-[12px] md:text-sm text-white/70 leading-snug">
                  <span className="shrink-0 text-base leading-none mt-0.5">{def.icon}</span>
                  <span>{en ? def.en : def.zh}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- 生词 & 战利品 ---------- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-6 duration-700 delay-500">
          <div className="bg-black/60 border-2 border-emerald-400/30 backdrop-blur-sm p-5 flex items-center gap-4">
            <span className="text-4xl md:text-5xl">📖</span>
            <div>
              <div className="text-2xl md:text-4xl font-black text-emerald-300 tabular-nums leading-none">
                {wordsLearned}
              </div>
              <div className="text-[11px] md:text-xs text-white/50 mt-1 leading-snug">
                {en
                  ? 'Japanese words from tonight went into your wordbook'
                  : '今晚听到的日语词已经进了单词本'}
              </div>
            </div>
          </div>

          <div className="bg-black/60 border-2 border-amber-400/25 backdrop-blur-sm p-5">
            <div className="text-[11px] font-black uppercase tracking-widest text-amber-300/80 mb-2">
              {en ? 'Carried home' : '拎回家的东西'}
            </div>
            {purchases.length === 0 ? (
              <p className="text-[11px] md:text-xs text-white/40 italic">
                {en ? 'You walked out of the store empty-handed.' : '你空着手走出了便利店。'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {purchases.map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white/8 border border-white/15 rounded px-2 py-0.5 text-[11px] md:text-xs text-white/70">
                    <span>{p.icon}</span>{en ? p.en : p.zh}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------- 进入正篇 ---------- */}
        <div className="flex flex-col items-center gap-4 pt-2 pb-6 animate-in slide-in-from-bottom-6 duration-700 delay-700">
          <p className="text-center text-sm md:text-base text-white/45 italic max-w-lg leading-relaxed">
            {en
              ? '"Good night, Kobe. ...See you tomorrow."'
              : '「晚安，神户。……明天见。」'}
          </p>
          <button
            onClick={onContinue}
            className="group relative bg-red-600 hover:bg-yellow-400 text-white hover:text-black border-4 border-black px-12 md:px-20 py-4 md:py-5 font-black italic text-lg md:text-2xl tracking-[0.2em] transform -skew-x-12 shadow-[10px_10px_0px_rgba(0,0,0,0.7)] active:translate-y-1.5 active:shadow-[4px_4px_0px_rgba(0,0,0,0.7)] transition-all"
          >
            <span className="block transform skew-x-12">
              {en ? 'CHAPTER 1 ▶' : '进入第 1 章 ▶'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrologueResultScreen;
