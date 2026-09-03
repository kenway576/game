import React, { useMemo, useState } from 'react';
import { Language, StoryFlags } from '../types';
import { MAP_LOCATIONS } from '../story/mapLocations';
import { KOBE_SITES, KobeSite, beenFlag, siteRevealed, siteVisited, visitTally } from '../story/kobeMap';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🗺 软木板上那张地图
//
// 画成一张旧纸：奶油色的底、褐色的墨线、几道折痕。理由在 kobeMap.ts 里。
//
// 三种状态，一眼要能分开：
//   没解锁     不画。纸上那块地方是空的。
//   解锁没去过 空心圈，名字浅浅一行。你知道有这么个地方了。
//   去过       红圈 + 铅笔打的钩 + 名字加深。
//
// 打开时去过的钉子依次盖上去（从 0.6 倍弹到 1 倍），一个隔 60ms。
// 这是这张图唯一的动效，也是它想说的那件事：这些是你自己走出来的。
// ---------------------------------------------------------

interface Props {
  language: Language;
  storyFlags: StoryFlags;
  onClose: () => void;
}

const INK = '#5b4636';

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

  // 海岸线和山脚：整张图的骨架，图钉都是照着这两条线摆的
  const COAST = 'M0,470 C120,438 260,410 380,388 C470,372 540,358 660,342 C780,330 900,324 1000,320';
  const FOOT  = 'M0,332 C140,304 300,276 450,250 C600,226 760,196 1000,164';

  return (
    <div
      className="fixed inset-0 z-[215] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[94dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 纸 */}
        <div className="relative shadow-[0_24px_70px_rgba(0,0,0,0.75)]">
          <svg viewBox="0 0 1000 560" className="w-full block" style={{ background: '#e9dfc6' }}>
            <defs>
              {/* 纸的斑驳。用两层很淡的径向渐变，比贴一张噪点图便宜 */}
              <radialGradient id="paper" cx="35%" cy="30%" r="85%">
                <stop offset="0%" stopColor="#f3ead4" />
                <stop offset="100%" stopColor="#ddd0b1" />
              </radialGradient>
              {/* 影线要稀。第一版 22px 一格，铺满整片山之后看上去是一块布，
                  不是地形——纸质地图上的山影本来就是零星几笔。 */}
              <pattern id="waves" width="54" height="30" patternUnits="userSpaceOnUse">
                <path d="M0,22 q13,-9 26,0 t26,0" fill="none" stroke="#7f9aa2" strokeWidth="1" opacity="0.35" />
              </pattern>
              <pattern id="ridge" width="58" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-9)">
                <path d="M4,38 l16,-24 l16,24" fill="none" stroke={INK} strokeWidth="1.3" opacity="0.3" />
                <path d="M30,40 l10,-14 l10,14" fill="none" stroke={INK} strokeWidth="1.1" opacity="0.18" />
              </pattern>
            </defs>

            <rect width="1000" height="560" fill="url(#paper)" />

            {/* 海 */}
            <path d={`${COAST} L1000,560 L0,560 Z`} fill="#c9d9dc" />
            <path d={`${COAST} L1000,560 L0,560 Z`} fill="url(#waves)" />

            {/* 山 */}
            <path d={`${FOOT} L1000,0 L0,0 Z`} fill="#d8cdae" />
            <path d={`${FOOT} L1000,0 L0,0 Z`} fill="url(#ridge)" />
            <path d={FOOT} fill="none" stroke={INK} strokeWidth="1.6" opacity="0.55" />
            <path d={COAST} fill="none" stroke={INK} strokeWidth="2.2" opacity="0.75" />

            {/* 港岛和六甲岛：海上填出来的两块地 */}
            <path d="M478,404 L586,398 L592,466 L486,472 Z" fill="#ded2b4" stroke={INK} strokeWidth="1.6" opacity="0.9" />
            <path d="M640,392 L722,388 L728,442 L646,448 Z" fill="#ded2b4" stroke={INK} strokeWidth="1.4" opacity="0.65" />
            {/* 美利坚公园那块伸进海里的地。原来画成四边形，看着像一架纸飞机，
                改成沿着岸往外鼓一小块。 */}
            <path d="M472,366 Q502,368 512,390 Q496,398 476,384 Z" fill="#ded2b4" stroke={INK} strokeWidth="1.3" opacity="0.85" />

            {/* 港岛的轻轨：一条从三宫伸出去的细线 */}
            <path d="M546,332 L530,404" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />

            {/* 沿着这条窄带子横穿的铁路。加它是因为空着的纸看不出这是一座
                东西向的长条城市——所有地名都串在这一条线上。 */}
            <path
              d="M40,436 C180,404 330,376 470,352 C590,332 720,308 990,272"
              fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="12 6" opacity="0.35"
            />

            {/* 折痕。这张纸被折过太多次了 */}
            <line x1="334" y1="0" x2="334" y2="560" stroke="#000" strokeWidth="1" opacity="0.07" />
            <line x1="668" y1="0" x2="668" y2="560" stroke="#000" strokeWidth="1" opacity="0.07" />
            <line x1="0" y1="280" x2="1000" y2="280" stroke="#000" strokeWidth="1" opacity="0.07" />

            {/* 海湾的名字 */}
            <text x="770" y="500" fill={INK} opacity="0.4" fontSize="26" fontWeight="700" letterSpacing="10">
              大阪湾
            </text>
            <text x="120" y="86" fill={INK} opacity="0.35" fontSize="22" fontWeight="700" letterSpacing="8">
              六甲山系
            </text>
            <text x="286" y="358" fill={INK} opacity="0.22" fontSize="30" fontWeight="800" letterSpacing="16"
                  transform="rotate(-9 286 358)">
              神　戸
            </text>

            {/* 图钉 */}
            {sites.map((s, i) => {
              const been = siteVisited(s, storyFlags);
              const on = pick?.id === s.id;
              const dx = s.side === 'left' ? -12 : s.side === 'right' ? 12 : 0;
              const dy = s.side === 'above' ? -16 : s.side === 'below' ? 26 : 5;
              const anchor = s.side === 'left' ? 'end' : s.side === 'right' ? 'start' : 'middle';
              return (
                <g
                  key={s.id}
                  onClick={() => { audioManager.playSfx('click'); setPick(s); }}
                  className="cursor-pointer"
                  style={
                    been
                      ? {
                          animation: `kobepin 380ms cubic-bezier(.34,1.56,.64,1) ${i * 60}ms backwards`,
                          transformOrigin: `${s.x}px ${s.y}px`
                        }
                      : undefined
                  }
                >
                  {/* 点击热区。圈本身太小，手机上戳不中 */}
                  <circle cx={s.x} cy={s.y} r="22" fill="transparent" />
                  {been ? (
                    <>
                      <circle cx={s.x} cy={s.y} r="7.5" fill="#b3261e" stroke="#7a1a13" strokeWidth="1.4" />
                      {/* 铅笔打的钩 */}
                      <path
                        d={`M${s.x + 7},${s.y - 12} l-5.5,7.5 l-3.5,-3.2`}
                        fill="none" stroke="#3f6b3a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                        opacity="0.9"
                      />
                    </>
                  ) : (
                    <circle cx={s.x} cy={s.y} r="6" fill="none" stroke={INK} strokeWidth="1.8" opacity="0.55" />
                  )}
                  {on && (
                    <circle cx={s.x} cy={s.y} r="15" fill="none" stroke="#b3261e" strokeWidth="2">
                      <animate attributeName="r" values="11;17;11" dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.15;0.9" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text
                    x={s.x + dx} y={s.y + dy}
                    textAnchor={anchor}
                    fill={been ? '#3a2c22' : INK}
                    opacity={been ? 0.95 : 0.5}
                    fontSize="15"
                    fontWeight={been ? 800 : 600}
                    style={{ paintOrder: 'stroke', stroke: '#efe6cf', strokeWidth: 3 } as React.CSSProperties}
                  >
                    {en ? s.nameEn : s.nameJp}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 纸上的角标 */}
          <div className="absolute top-3 left-3 bg-[#3a2c22]/90 text-[#efe6cf] px-3 py-1.5 transform -skew-x-12">
            <span className="block transform skew-x-12 text-[11px] font-black tracking-widest">
              {en ? "GRANDFATHER'S MAP" : '外公的神户地图'}
              <span className="ml-2 font-mono text-[#e0c88a]">
                {tally.been}/{tally.total}
              </span>
            </span>
          </div>
          <button
            onClick={() => { audioManager.playSfx('click'); onClose(); }}
            className="absolute top-3 right-3 bg-[#3a2c22]/90 hover:bg-[#b3261e] text-[#efe6cf] px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-colors"
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
          from { opacity: 0; transform: scale(0.55); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default KobeMapModal;
