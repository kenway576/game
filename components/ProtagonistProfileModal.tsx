import React, { useState } from 'react';
import { ProtagonistStats, StatKey, Language } from '../types';
import { STAT_METADATA, getStatRankInfo } from '../constants';

interface Props {
  stats: ProtagonistStats;
  playerName: string;
  language: Language;
  onClose: () => void;
}

export const ProtagonistProfileModal: React.FC<Props> = ({
  stats,
  playerName,
  language,
  onClose
}) => {
  const [selectedStat, setSelectedStat] = useState<StatKey>('knowledge');
  const statKeys: StatKey[] = ['knowledge', 'guts', 'kindness', 'charm', 'proficiency'];
  const activeStatInfo = getStatRankInfo(selectedStat, stats[selectedStat]);
  const activeMeta = STAT_METADATA[selectedStat];

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-2 border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.25)] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* P5 风格顶部装饰条 */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-zinc-900 px-6 py-3.5 flex items-center justify-between border-b border-red-500/40">
          <div className="flex items-center gap-3">
            <span className="bg-black text-red-400 text-xs font-black px-2.5 py-1 rounded tracking-widest uppercase border border-red-500/50">
              CONFIDANT // STATUS
            </span>
            <h2 className="text-xl font-black text-white tracking-wide drop-shadow-md">
              {language === 'en' ? 'PROTAGONIST PROFILE & SOCIAL STATS' : '主人公档案 · 五维人格参数'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-red-600/80 text-white/80 hover:text-white flex items-center justify-center font-bold transition-colors border border-white/20"
          >
            ✕
          </button>
        </div>

        {/* 内容主体 */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* 左侧：主角官方卡面与基本档案 */}
          <div className="md:col-span-5 flex flex-col items-center gap-4 bg-zinc-950/80 border border-white/10 p-4 rounded-xl shadow-inner">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.2)] group">
              {/* 同样是后缀写错：卡面是 .webp。退路那张 asuka/neutral.png
              也不存在（立绘全是 .webp），所以这个面板从来没显示出过图。
              退路换成主角自己的立绘——这里本来就该是他。 */}
              <img
                src="/images/ui/protagonist_card.webp"
                alt="Protagonist"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = '/images/characters/protagonist/school_neutral.webp';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                    KOBE EXCHANGE STUDENT
                  </span>
                  <span className="text-lg font-black text-white drop-shadow">
                    {playerName || '主人公'}
                  </span>
                </div>
                <span className="bg-red-600/90 text-white text-xs font-black px-2 py-0.5 rounded shadow">
                  Lv.2 B-Class
                </span>
              </div>
            </div>

            {/* 档案描述 */}
            <div className="w-full bg-zinc-900/90 border border-white/10 rounded-lg p-3 text-xs flex flex-col gap-1.5 text-zinc-300">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-zinc-500">{language === 'en' ? 'Affiliation' : '就读学园'}</span>
                <span className="text-zinc-200 font-medium">私立神户海星学园 · 高二B班</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-zinc-500">{language === 'en' ? 'Residence' : '现居住所'}</span>
                <span className="text-zinc-200 font-medium">神户市中央区「海风庄」201室</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-zinc-500">{language === 'en' ? 'Japanese Level' : '日语水平'}</span>
                <span className="text-amber-400 font-bold">JLPT N4 突破 N3 冲刺期</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{language === 'en' ? 'Core Goal' : '主线目标'}</span>
                <span className="text-emerald-400 font-medium">神户大学推荐 & 关西手记溯源</span>
              </div>
            </div>
          </div>

          {/* 右侧：五维人格参数与详情 */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* 五维卡片选择网格 */}
            <div className="grid grid-cols-5 gap-2">
              {statKeys.map((key) => {
                const meta = STAT_METADATA[key];
                const info = getStatRankInfo(key, stats[key]);
                const isSelected = selectedStat === key;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedStat(key)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-zinc-800 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)] scale-105'
                        : 'bg-zinc-950/70 border-white/10 hover:border-white/30 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 relative shadow">
                      <img
                        src={meta.badgeUrl}
                        alt={meta.nameZh}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white tracking-tight">
                      {language === 'en' ? meta.nameEn : meta.nameZh.split(' ')[0]}
                    </span>
                    <span
                      className="text-[10px] font-extrabold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
                    >
                      Rank {info.rank}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 选中的属性详细解读卡片 (P5 风格) */}
            <div className="bg-zinc-950/90 border-2 border-white/15 rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden shadow-xl">
              <div
                className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full pointer-events-none opacity-20"
                style={{ backgroundColor: activeMeta.color }}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
                    <img
                      src={activeMeta.badgeUrl}
                      alt={activeMeta.nameZh}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>{language === 'en' ? activeMeta.nameEn : activeMeta.nameZh}</span>
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${activeMeta.color}25`,
                          borderColor: `${activeMeta.color}60`,
                          color: activeMeta.color
                        }}
                      >
                        Rank {activeStatInfo.rank} · {language === 'en' ? activeStatInfo.nameEn : activeStatInfo.nameZh}
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {language === 'en' ? activeStatInfo.descEn : activeStatInfo.descZh}
                    </p>
                  </div>
                </div>
              </div>

              {/* 经验进度条 */}
              <div className="flex flex-col gap-1.5 bg-black/60 p-3 rounded-lg border border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-medium">{language === 'en' ? 'Stat Growth Point' : '属性成长经验'}</span>
                  <span className="text-white font-mono font-bold">
                    {activeStatInfo.currentValue} / {activeStatInfo.nextThreshold} pts
                  </span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${activeStatInfo.progressPercent}%`,
                      backgroundColor: activeMeta.color
                    }}
                  />
                </div>
              </div>

              {/* 5个 Rank 阶梯一览 */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {language === 'en' ? 'Rank Thresholds & Perks' : '阶梯称号与解锁特权'}
                </span>
                <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {activeMeta.ranks.map((r) => {
                    const isReached = stats[selectedStat] >= r.threshold;
                    return (
                      <div
                        key={r.rank}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs border transition-colors ${
                          isReached
                            ? 'bg-zinc-900/90 border-white/20 text-zinc-100'
                            : 'bg-zinc-950/40 border-white/5 text-zinc-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                              isReached ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'
                            }`}
                          >
                            {r.rank}
                          </span>
                          <span className="font-bold">
                            {language === 'en' ? r.nameEn : r.nameZh}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                          {language === 'en' ? r.descEn : r.descZh}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
