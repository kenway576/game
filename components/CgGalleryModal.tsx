import React, { useState } from 'react';
import { CharacterId, Language } from '../types';
import { CHARACTERS, CHARACTER_CGS, CharacterCgDef } from '../constants';

interface Props {
  language: Language;
  affectionMap: Record<CharacterId, number>;
  onClose: () => void;
}

const CgGalleryModal: React.FC<Props> = ({ language, affectionMap, onClose }) => {
  const [selectedCg, setSelectedCg] = useState<CharacterCgDef | null>(null);

  const cgList = Object.values(CHARACTER_CGS);

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4" onClick={onClose}>
      <div className="w-full max-w-5xl bg-zinc-950/95 border-2 border-yellow-500/40 rounded-xl p-6 md:p-8 shadow-[0_0_80px_rgba(234,179,8,0.2)] max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between border-b border-yellow-500/30 pb-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 tracking-wider">
              {language === 'en' ? '🌸 MEMORIES & EVENT CG GALLERY' : '🌸 特别回忆 · 事件 CG 画廊'}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              {language === 'en' ? 'Unlocked through romantic affection progression with heroines' : '通过与女主角们增进好感度解锁专属心动回忆事件'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* CG 画廊网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {cgList.map((cg) => {
            const char = CHARACTERS[cg.charId];
            const currentAff = affectionMap[cg.charId] || 0;
            const isUnlocked = currentAff >= cg.unlockAffection;
            const charName = language === 'en' ? char.nameEn : char.name;
            const title = language === 'en' ? cg.titleEn : cg.titleZh;

            return (
              <div
                key={cg.id}
                onClick={() => isUnlocked && setSelectedCg(cg)}
                className={`group relative rounded-lg overflow-hidden border-2 transition-all duration-300 aspect-[16/9] flex flex-col justify-end p-3 ${
                  isUnlocked
                    ? 'border-yellow-500/60 hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] cursor-pointer'
                    : 'border-white/10 bg-zinc-900/60 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* 背景图 */}
                {isUnlocked ? (
                  <img
                    src={cg.cgUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // 占位预览图
                      e.currentTarget.src = char.avatarUrl;
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <span className="text-3xl">🔒</span>
                    <span className="text-[10px] text-white/50">
                      {language === 'en' ? `Requires Affection Lv.2+ (${cg.unlockAffection})` : `好感度达标解锁 (需 ${cg.unlockAffection} 点)`}
                    </span>
                  </div>
                )}

                {/* 渐变遮罩与信息 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-black/60 px-2 py-0.5 rounded border border-yellow-500/30">
                    {charName}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 drop-shadow-md truncate">
                    {isUnlocked ? title : '??? (未解锁)'}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

        {/* 大图预览弹窗 */}
        {selectedCg && (
          <div
            className="fixed inset-0 z-[250] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedCg(null)}
          >
            <div className="relative max-w-5xl w-full flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
              <img
                src={selectedCg.cgUrl}
                alt={selectedCg.titleZh}
                className="w-full max-h-[75vh] object-contain rounded-lg border-2 border-yellow-400/80 shadow-[0_0_50px_rgba(234,179,8,0.4)]"
                onError={(e) => {
                  e.currentTarget.src = CHARACTERS[selectedCg.charId].avatarUrl;
                }}
              />
              <div className="w-full bg-zinc-900/90 border border-white/20 p-4 rounded-lg flex flex-col gap-1 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-yellow-400">
                    {language === 'en' ? selectedCg.titleEn : selectedCg.titleZh}
                  </h3>
                  <span className="text-xs text-white/50 font-mono">
                    {CHARACTERS[selectedCg.charId].name}
                  </span>
                </div>
                <p className="text-sm text-white/80 italic">
                  {selectedCg.quote}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  {language === 'en' ? selectedCg.descEn : selectedCg.descZh}
                </p>
              </div>
              <button
                onClick={() => setSelectedCg(null)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-full border border-white/30 text-sm font-bold"
              >
                ✕ {language === 'en' ? 'Close' : '关闭'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CgGalleryModal;
