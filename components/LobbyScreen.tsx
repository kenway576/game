import React, { useRef } from 'react';
import { CharacterId, ChatMode, UserState, CustomAssets, AffectionMap, FamiliarityMap, GameCalendar, ProtagonistStats } from '../types';
import { CHARACTERS, VISIBLE_CHARACTER_IDS, getAffectionLevel, getFamiliarityLevel, getInitialFamiliarity } from '../constants';
import CharacterSprite from './CharacterSprite';
import RelationshipMeter from './AffectionMeter';

interface Props {
  T: Record<string, string>;
  userState: UserState;
  customAssets: CustomAssets;
  visibleLobbyChars: Set<CharacterId>;
  lobbySelectedChar: CharacterId | null;
  setLobbySelectedChar: (id: CharacterId | null) => void;
  affectionMap: AffectionMap;
  familiarityMap: FamiliarityMap;
  calendar: GameCalendar;
  stats: ProtagonistStats;
  onEnterChat: (charId: CharacterId, mode: ChatMode) => void;
  onOpenSystemMenu: () => void;
  onOpenCgGallery: () => void;
  onOpenRoom: () => void;
  onOpenMap: () => void;
  onOpenCalendar: () => void;
  onOpenProtagonistProfile: () => void;
  background: React.ReactNode;
}

const LobbyScreen: React.FC<Props> = ({
  T, userState, customAssets, visibleLobbyChars, lobbySelectedChar,
  setLobbySelectedChar, affectionMap, familiarityMap, calendar, stats,
  onEnterChat, onOpenSystemMenu, onOpenCgGallery, onOpenCalendar, onOpenProtagonistProfile, onOpenRoom, onOpenMap, background
}) => {
  const famOf = (id: CharacterId) => familiarityMap[id] ?? getInitialFamiliarity(id);
  const affOf = (id: CharacterId) => affectionMap[id] ?? 0;
  // 卡片上显示关系"名称"而不是数字——「朋友 · 无意」比「♥ 130」更说明现在处在哪一步
  const levelName = (def: { labelZh: string; labelEn: string }) =>
    userState.language === 'en' ? def.labelEn : def.labelZh;
  // 🎠 横向轮播：固定卡片宽度 + 滚轮横滚 + 箭头翻页，角色再多也放得下
  const scrollRef = useRef<HTMLDivElement>(null);
  const CARD_SCROLL = 340;

  const scrollByCards = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * CARD_SCROLL, behavior: 'smooth' });
  };

  const handleWheel = (e: React.WheelEvent) => {
    // 把纵向滚轮转为横向滚动（桌面端没有横向滚轮）
    if (scrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
  <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col">
    {background}
    <div className="absolute top-0 left-0 w-full p-3 md:p-6 flex flex-col md:flex-row justify-between items-start z-40 pointer-events-none gap-3">
      {/* 标题与目标 */}
      <div className="bg-black/85 backdrop-blur text-white px-5 md:px-8 py-2.5 md:py-3.5 border-l-4 border-yellow-500 skew-x-12 transform origin-top-left pointer-events-auto shadow-2xl">
        <h2 className="-skew-x-12 text-base md:text-2xl font-black italic uppercase tracking-tighter">{T.choosePartner}</h2>
        <p className="-skew-x-12 text-yellow-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{T.goal}: {userState.learningGoal}</p>
      </div>

      {/* 右侧 HUD 工具栏：日历、人格五维、画廊与系统菜单 */}
      <div className="flex flex-wrap items-center gap-2 pointer-events-auto self-end md:self-auto">
        {/* 回自己房间 */}
        <button
          onClick={onOpenRoom}
          className="group bg-zinc-950/90 hover:bg-zinc-900 border border-sky-500/50 hover:border-sky-400 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg backdrop-blur-md shadow-lg transition-all flex items-center gap-2"
        >
          <span className="text-sky-300 font-black text-xs">🏠 {userState.language === 'en' ? 'MY ROOM' : '回房间'}</span>
        </button>

        {/* 出门：地图 */}
        <button
          onClick={onOpenMap}
          className="group bg-zinc-950/90 hover:bg-zinc-900 border border-yellow-500/50 hover:border-yellow-400 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg backdrop-blur-md shadow-lg transition-all flex items-center gap-2"
        >
          <span className="text-yellow-300 font-black text-xs">🗺️ {userState.language === 'en' ? 'GO OUT' : '出门'}</span>
        </button>

        {/* 日历与时间天气 Badge */}
        <button
          onClick={onOpenCalendar}
          className="group bg-zinc-950/90 hover:bg-zinc-900 border border-amber-500/50 hover:border-amber-400 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg backdrop-blur-md shadow-lg transition-all flex items-center gap-2"
        >
          <span className="text-amber-400 font-black text-xs">
            📅 {calendar.month}月{calendar.day}日
          </span>
          <span className="text-[11px] text-zinc-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
            {calendar.timeSlot === 'morning' ? '早晨' : calendar.timeSlot === 'afternoon' ? '放学后' : '夜晚'}
          </span>
          <span className="text-xs">☀️</span>
        </button>

        {/* 主角人格参数 (P5 五维) */}
        <button
          onClick={onOpenProtagonistProfile}
          className="group bg-zinc-950/90 hover:bg-zinc-900 border border-red-500/60 hover:border-red-400 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg backdrop-blur-md shadow-lg transition-all flex items-center gap-2"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-red-400/80">
            <img src="/images/ui/protagonist_card.jpg" alt="Protagonist" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-black text-red-400 tracking-wider">
            {userState.language === 'en' ? 'STATS' : '人格参数'}
          </span>
        </button>

        {/* 回忆画廊 */}
        <button
          onClick={onOpenCgGallery}
          className="bg-rose-700/80 hover:bg-rose-600 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-rose-400/40 backdrop-blur text-xs font-black uppercase tracking-wider shadow-lg transition-all"
        >
          🌸 {userState.language === 'en' ? 'CGs' : '画廊'}
        </button>

        {/* 系统菜单 */}
        <button
          onClick={onOpenSystemMenu}
          className="bg-zinc-900/80 hover:bg-zinc-800 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-white/20 backdrop-blur text-xs font-black uppercase tracking-wider shadow-lg transition-all"
        >
          ⚙️ {T.system}
        </button>
      </div>
    </div>

    <div ref={scrollRef} onWheel={handleWheel} className="lobby-scroll flex-1 flex flex-row items-stretch w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory z-20 pt-24 md:pt-20 pb-0">
      {VISIBLE_CHARACTER_IDS.map((id, index) => {
        const char = CHARACTERS[id];
        const shouldLoad = visibleLobbyChars.has(id);
        const displayChar = { ...char, avatarUrl: customAssets.characters[id] || (shouldLoad ? char.avatarUrl : '') };
        return (
          <div key={id} className={`group relative flex-none w-[85vw] md:w-[320px] lg:w-[340px] snap-center h-full border-r border-white/5 overflow-hidden cursor-pointer bg-black/40 transition-opacity duration-300`} onClick={() => setLobbySelectedChar(id)}>
            <div className={`absolute inset-0 opacity-0 md:group-hover:opacity-20 transition-opacity duration-300 ${char.color} bg-gradient-to-t from-black via-transparent to-transparent`}></div>
            <div className="absolute top-4 right-4 text-7xl md:text-[100px] font-black text-white/5 italic leading-none select-none z-0">0{index + 1}</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[80%] md:h-[88%] flex items-end justify-center origin-bottom">
              <CharacterSprite character={displayChar} isSpeaking={false} fit="height" className="w-full h-full"/>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 md:pb-10 px-4 md:px-6 flex flex-col items-center md:items-start md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-300">
              <div className={`h-1 w-8 md:w-12 mb-2 ${char.color}`}></div>
              <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg">{userState.language === 'en' ? char.nameEn : char.name}</h3>
              <p className="text-[10px] text-white/70 uppercase tracking-widest hidden md:block">{userState.language === 'en' ? char.roleEn : char.role}</p>
              <p className="text-[10px] md:text-xs font-bold mt-1 tracking-widest flex items-center gap-2">
                <span className="text-sky-300">🤝 {levelName(getFamiliarityLevel(famOf(id)))}</span>
                <span className="text-white/25">·</span>
                <span className="text-pink-400">♥ {levelName(getAffectionLevel(affOf(id)))}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>

    {/* 🎠 桌面端翻页箭头 */}
    <button onClick={() => scrollByCards(-1)} className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-40 w-12 h-12 items-center justify-center bg-black/60 hover:bg-yellow-500 hover:text-black text-white border border-white/20 rounded-full text-xl font-black backdrop-blur transition-all shadow-xl" aria-label="prev">‹</button>
    <button onClick={() => scrollByCards(1)} className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-40 w-12 h-12 items-center justify-center bg-black/60 hover:bg-yellow-500 hover:text-black text-white border border-white/20 rounded-full text-xl font-black backdrop-blur transition-all shadow-xl" aria-label="next">›</button>

    {lobbySelectedChar && (
      <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setLobbySelectedChar(null)}>
        <div className="bg-slate-900 border-2 border-white/10 p-6 md:p-10 rounded-sm max-w-lg w-full flex flex-col items-center gap-4 md:gap-6 shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className={`absolute top-0 left-0 w-full h-1 ${CHARACTERS[lobbySelectedChar].color}`} />
          <h2 className={`text-3xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-md`}>{userState.language === 'en' ? CHARACTERS[lobbySelectedChar].nameEn : CHARACTERS[lobbySelectedChar].name}</h2>
          <p className="text-gray-300 text-center text-xs md:text-sm leading-relaxed px-2 md:px-4">{userState.language === 'en' ? CHARACTERS[lobbySelectedChar].descriptionEn : CHARACTERS[lobbySelectedChar].description}</p>
          <RelationshipMeter
            familiarity={famOf(lobbySelectedChar)}
            affection={affOf(lobbySelectedChar)}
            language={userState.language}
            familiarityLabel={T.familiarity}
            affectionLabel={T.affection}
            cappedLabel={T.romanceCappedHint}
          />
          <div className="flex flex-col w-full gap-3 md:gap-4 mt-2 md:mt-4">
            <button onClick={() => onEnterChat(lobbySelectedChar, ChatMode.FREE_TALK)} className="group relative w-full overflow-hidden bg-indigo-700 hover:bg-indigo-600 text-white font-black py-4 md:py-5 rounded-sm text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-xl"><span className="relative z-10 flex items-center justify-center gap-3">💬 {T.casualTalk}</span></button>
            <button onClick={() => onEnterChat(lobbySelectedChar, ChatMode.STUDY)} className="group relative w-full overflow-hidden bg-red-700 hover:bg-red-600 text-white font-black py-4 md:py-5 rounded-sm text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-xl"><span className="relative z-10 flex items-center justify-center gap-3">📚 {T.reviewMode}</span></button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default LobbyScreen;
