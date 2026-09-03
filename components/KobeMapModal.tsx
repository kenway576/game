import React, { useMemo, useState } from 'react';
import { Language, StoryFlags } from '../types';
import { MAP_LOCATIONS } from '../story/mapLocations';
import { KOBE_SITES, KobeSite, beenFlag, siteRevealed, siteVisited, visitTally } from '../story/kobeMap';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🗺 软木板上那张地图
//
// 底图是画出来的一张旧纸质神户地图（scripts/gen-kobe-map.mjs 生成），
// 图钉是 DOM 元素按百分比叠在上面。
//
// 【为什么图钉不画进底图】
// 这张图存在的意义是"去过的地方会被打上钩"——它得随着剧情长出东西来。
// 底图是死的，标记必须是活的，所以只能分成两层。
//
// 三种状态，一眼要能分开：
//   没解锁     不画。纸上那块地方是空的。
//   解锁没去过 空心圈，名字浅浅一行。你知道有这么个地方了。
//   去过       红圈 + 铅笔打的钩 + 名字加深。
//
// 打开时去过的钉子依次盖上去（从 0.55 倍弹到 1 倍），一个隔 60ms。
// 这是这张图唯一的动效，也是它想说的那件事：这些是你自己走出来的。
//
// 【标签为什么用 DOM 不用 SVG text】
// 名字要在一张米黄的纸上读得清，得有描边。SVG 的 paint-order 描边缩放时
// 会跟着糊，而 DOM 上一层四向 text-shadow 在任何尺寸下都干净。
// ---------------------------------------------------------

interface Props {
  language: Language;
  storyFlags: StoryFlags;
  onClose: () => void;
}

// 米黄纸上的墨色。整张图只用这一套颜色。
const INK = '#4a3728';
const RED = '#b3261e';
const PAPER = '#efe4c8';

// 名字压在纸上，四向描边保证任何底色上都读得清
const LABEL_SHADOW =
  `1px 1px 0 ${PAPER}, -1px 1px 0 ${PAPER}, 1px -1px 0 ${PAPER}, -1px -1px 0 ${PAPER},` +
  `0 2px 0 ${PAPER}, 0 -2px 0 ${PAPER}, 2px 0 0 ${PAPER}, -2px 0 0 ${PAPER}`;

const KobeMapModal: React.FC<Props> = ({ language, storyFlags, onClose }) => {
  const en = language === 'en';
  const [pick, setPick] = useState<KobeSite | null>(null);

  const sites = useMemo(
    () => KOBE_SITES.filter(s => siteRevealed(s, storyFlags)),
    [storyFlags]
  );
  const tally = useMemo(() => visitTally(storyFlags), [storyFlags]);

  // 选中的那片里，具体去过哪几个地方
  const detail = useMemo(() => {
    if (!pick) return [];
    return pick.covers
      .map(id => MAP_LOCATIONS.find(l => l.id === id))
      .filter((l): l is NonNullable<typeof l> => !!l)
      .map(l => ({ loc: l, been: !!storyFlags[beenFlag(l.id)] }));
  }, [pick, storyFlags]);

  return (
    <div
      className="fixed inset-0 z-[215] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[94dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 纸 */}
        <div className="relative shadow-[0_24px_70px_rgba(0,0,0,0.75)] select-none">
          <img src="/images/ui/kobe_map.webp" alt="" className="w-full block" draggable={false} />

          {/* 图钉 */}
          {sites.map((s, i) => {
            const been = siteVisited(s, storyFlags);
            const on = pick?.id === s.id;
            const side = s.side || 'right';
            // 名字摆在钉子的哪一边。只有位移不同，其余样式一样，
            // 所以用一个 style 算出来，不写四套 class。
            const labelPos: React.CSSProperties =
              side === 'left'  ? { right: '100%', top: '50%', transform: 'translate(-8px,-50%)' }
            : side === 'right' ? { left: '100%',  top: '50%', transform: 'translate(8px,-50%)' }
            : side === 'above' ? { left: '50%',   bottom: '100%', transform: 'translate(-50%,-6px)' }
            :                    { left: '50%',   top: '100%',    transform: 'translate(-50%,6px)' };

            return (
              <button
                key={s.id}
                onClick={() => { audioManager.playSfx('click'); setPick(s); }}
                className="absolute group"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: 'translate(-50%,-50%)',
                  // 热区比圈大得多，手机上才戳得中
                  width: 40, height: 40,
                  animation: been
                    ? `kobepin 380ms cubic-bezier(.34,1.56,.64,1) ${i * 60}ms backwards`
                    : undefined
                }}
              >
                {/* 圈 */}
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 group-hover:scale-125"
                  style={
                    been
                      ? { width: 13, height: 13, background: RED, border: '2px solid #7a1a13' }
                      : { width: 11, height: 11, border: `2px solid ${INK}`, opacity: 0.55 }
                  }
                />
                {/* 铅笔打的钩 */}
                {been && (
                  <svg className="absolute pointer-events-none" style={{ left: 19, top: 3, width: 16, height: 16 }} viewBox="0 0 18 18">
                    <path d="M2,9 l4,5 l10,-13" fill="none" stroke="#3f6b3a" strokeWidth="2.6"
                          strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                  </svg>
                )}
                {/* 选中时的呼吸环 */}
                {on && (
                  <span
                    className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                    style={{ width: 30, height: 30, border: `2px solid ${RED}`, animation: 'kobering 1.6s ease-in-out infinite' }}
                  />
                )}
                {/* 名字 */}
                <span
                  className="absolute whitespace-nowrap pointer-events-none"
                  style={{
                    ...labelPos,
                    color: been ? '#33241a' : INK,
                    opacity: been ? 1 : 0.62,
                    fontWeight: been ? 800 : 600,
                    fontSize: 'clamp(9px, 1.05vw, 15px)',
                    textShadow: LABEL_SHADOW,
                    letterSpacing: '0.02em'
                  }}
                >
                  {en ? s.nameEn : s.nameJp}
                </span>
              </button>
            );
          })}

          {/* 纸上的角标 */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#3a2c22]/90 text-[#efe6cf] px-3 py-1.5 transform -skew-x-12">
            <span className="block transform skew-x-12 text-[10px] md:text-[11px] font-black tracking-widest">
              {en ? "GRANDFATHER'S MAP" : '外公的神户地图'}
              <span className="ml-2 font-mono text-[#e0c88a]">{tally.been}/{tally.total}</span>
            </span>
          </div>
          <button
            onClick={() => { audioManager.playSfx('click'); onClose(); }}
            className="absolute top-2 right-2 md:top-3 md:right-3 bg-[#3a2c22]/90 hover:bg-[#b3261e] text-[#efe6cf] px-3 py-1.5 text-[10px] md:text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-colors"
          >
            <span className="block transform skew-x-12">{en ? 'Close' : '收起来'}</span>
          </button>
        </div>

        {/* 选中的那一片：里面具体有哪几个地方，去过的打钩 */}
        <div className="mt-3 bg-black/80 border border-white/12 p-4">
          {!pick ? (
            <p className="text-sm text-white/45">
              {en
                ? 'Places you have been are circled in red and ticked in pencil. Tap a pin to see what is there.'
                : '去过的地方被圈成红的，旁边用铅笔打了钩。点一个图钉，看看那一片都有什么。'}
            </p>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-lg md:text-2xl font-black text-white">
                  {en ? pick.nameEn : pick.nameZh}
                </h3>
                <span className="font-mono text-sm text-yellow-400/80">{pick.nameJp}</span>
                <span className="ml-auto text-[11px] font-mono text-white/35">
                  {detail.filter(d => d.been).length}/{detail.length}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {detail.map(d => (
                  <span
                    key={d.loc.id}
                    className={`text-[11px] px-2 py-1 border ${
                      d.been
                        ? 'border-yellow-400/50 text-yellow-200/90 bg-yellow-400/10'
                        : 'border-white/12 text-white/35'
                    }`}
                  >
                    {d.been && <span className="mr-1">✓</span>}
                    {en ? d.loc.nameEn : d.loc.nameZh}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes kobepin {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.55); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes kobering {
          0%,100% { transform: translate(-50%,-50%) scale(0.75); opacity: 0.9; }
          50%     { transform: translate(-50%,-50%) scale(1.15); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

export default KobeMapModal;
