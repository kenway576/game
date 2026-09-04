import React, { useRef } from 'react';
import { CharacterId, UserState, CustomAssets, AffectionMap, FamiliarityMap, GameCalendar, ProtagonistStats } from '../types';
import { CHARACTERS, VISIBLE_CHARACTER_IDS, getAffectionLevel, getFamiliarityLevel, getInitialFamiliarity, LOBBY_PORTRAITS } from '../constants';
import CharacterSprite from './CharacterSprite';
import RelationshipMeter from './AffectionMeter';

interface Props {
  T: Record<string, string>;
  userState: UserState;
  customAssets: CustomAssets;
  visibleLobbyChars: Set<CharacterId>;
  // 大厅名单：只有已经在剧情里照过面的人。没见过的连位置都不占。
  lobbyChars: CharacterId[];
  lobbySelectedChar: CharacterId | null;
  setLobbySelectedChar: (id: CharacterId | null) => void;
  affectionMap: AffectionMap;
  familiarityMap: FamiliarityMap;
  calendar: GameCalendar;
  stats: ProtagonistStats;
  onOpenSystemMenu: () => void;
  onOpenCgGallery: () => void;
  onOpenRoom: () => void;
  onOpenMap: () => void;
  onOpenCalendar: () => void;
  onOpenInventory: () => void;
  onOpenPhone: () => void;
  phoneUnread: number;
  onOpenProtagonistProfile: () => void;
  background: React.ReactNode;
}

const LobbyScreen: React.FC<Props> = ({
  T, userState, customAssets, visibleLobbyChars, lobbyChars, lobbySelectedChar,
  setLobbySelectedChar, affectionMap, familiarityMap, calendar, stats,
  onOpenSystemMenu, onOpenCgGallery, onOpenCalendar, onOpenProtagonistProfile, onOpenRoom, onOpenMap, onOpenInventory, onOpenPhone, phoneUnread, background
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

      {/* ---------------------------------------------------------
          右上角工具栏。
          原来这里是六个圆角按钮，每个自己挑了一种边框颜色——天蓝、
          明黄、琥珀、大红、玫红、白——凑在一起像一排没关系的贴纸，
          眼睛不知道该先看哪个。现在统一成同一种形状：斜切的黑片，
          只有黄色一个重音色，靠图标和位置区分，不靠颜色。
          鼠标移上去往上抬一点、黄条从左边推出来，动的是同一套。
          --------------------------------------------------------- */}
      <div className="flex flex-wrap items-stretch gap-1.5 pointer-events-auto self-end md:self-auto">
        {/* 相册、人格参数、物品、单词本、日历、设置全都搬进手机了——
            它们本来就是手机里的东西。大厅只剩三个真正属于"身体"的动作：
            回自己房间、出门、掏手机。 */}
        {([
          { key: 'room',  on: onOpenRoom,  icon: '🏠', zh: '回房间', en: 'My room' },
          { key: 'map',   on: onOpenMap,   icon: '🗺',  zh: '出门',   en: 'Go out', primary: true },
          { key: 'phone', on: onOpenPhone, icon: '📱', zh: '手机',   en: 'Phone', badge: phoneUnread }
        ] as { key: string; on: () => void; icon: string; zh: string; en: string; primary?: boolean; badge?: number }[]).map(b => (
          <button
            key={b.key}
            onClick={b.on}
            className={`group relative overflow-hidden transform -skew-x-12 border transition-all duration-200 hover:-translate-y-0.5 px-3 md:px-3.5 py-2 md:py-2.5 ${
              b.primary
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-[3px_3px_0_rgba(0,0,0,0.55)]'
                : 'bg-black/80 text-white/80 border-white/15 hover:border-yellow-400/70 hover:text-white backdrop-blur-md'
            }`}
          >
            {/* 黄条从左边推进来，作为 hover 的唯一反馈 */}
            {!b.primary && (
              <span className="absolute inset-y-0 left-0 w-0 bg-yellow-400/20 transition-all duration-200 group-hover:w-full" />
            )}
            <span className="relative block transform skew-x-12 text-[11px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap">
              <span className="mr-1">{b.icon}</span>
              {userState.language === 'en' ? b.en : b.zh}
            </span>
            {/* 未读数。这是大厅上唯一一个会自己变的数字，所以它值得一个红点。 */}
            {!!b.badge && (
              <span className="absolute -top-1.5 -right-1.5 z-10 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center transform skew-x-12 shadow">
                {b.badge}
              </span>
            )}
          </button>
        ))}

        {/* 日历单独一块：它要显示日期和时段，不是一个纯按钮 */}
        <button
          onClick={onOpenCalendar}
          className="group relative overflow-hidden transform -skew-x-12 border border-white/15 hover:border-yellow-400/70 bg-black/80 backdrop-blur-md px-3 md:px-3.5 py-2 md:py-2.5 transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="absolute inset-y-0 left-0 w-0 bg-yellow-400/20 transition-all duration-200 group-hover:w-full" />
          <span className="relative block transform skew-x-12 flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-[11px] md:text-xs font-black text-white tracking-wider">
              {calendar.month}/{calendar.day}
            </span>
            <span className="text-[10px] font-mono text-yellow-400/80">
              {calendar.dayOfWeek?.replace(/\s*\(.*\)/, '')}
            </span>
            <span className="text-[10px] font-bold text-white/50">
              {calendar.timeSlot === 'morning' ? (userState.language === 'en' ? 'morning' : '早晨')
                : calendar.timeSlot === 'lunch' ? (userState.language === 'en' ? 'lunch' : '午休')
                : calendar.timeSlot === 'afternoon' ? (userState.language === 'en' ? 'after school' : '放学后')
                : (userState.language === 'en' ? 'night' : '夜晚')}
            </span>
          </span>
        </button>
      </div>
    </div>

    <div ref={scrollRef} onWheel={handleWheel} className="lobby-scroll flex-1 flex flex-row items-stretch w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory z-20 pt-24 md:pt-20 pb-0">
      {/* 谁都还没遇见时的空名单。理论上过完第 1 章不会出现，但跳过章节能走到这儿。 */}
      {lobbyChars.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <span className="text-5xl opacity-30">🚪</span>
          <p className="text-sm md:text-base text-white/60 max-w-sm leading-relaxed">
            {userState.language === 'en'
              ? 'You have not met anyone yet. Head out and see who is around.'
              : '你还没认识任何人。出门走走，看看这一带都有谁。'}
          </p>
          <button
            onClick={onOpenMap}
            className="mt-2 bg-yellow-400 text-black px-8 py-2.5 text-sm font-black uppercase tracking-widest transform -skew-x-12 hover:bg-white transition-all"
          >
            <span className="block transform skew-x-12">
              {userState.language === 'en' ? 'Go out ▶' : '出门 ▶'}
            </span>
          </button>
        </div>
      )}
      {lobbyChars.map((id, index) => {
        const char = CHARACTERS[id];
        const shouldLoad = visibleLobbyChars.has(id);
        // 大厅优先用专属立绘；没有就退回该角色的 neutral 差分
        const portrait = LOBBY_PORTRAITS[id] || char.avatarUrl;
        const displayChar = { ...char, avatarUrl: customAssets.characters[id] || (shouldLoad ? portrait : '') };
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
            {/* 聊天入口搬到手机里去了。
                以前站在这儿就能跟任何人开始一段完整对话——放学了也一样，
                那是这个游戏最说不通的一处设定。现在这里只看关系，
                要说话就掏手机（发消息），要好好说话就去当面碰到她。 */}
            <button
              onClick={onOpenPhone}
              className="group relative w-full overflow-hidden bg-emerald-700 hover:bg-emerald-600 text-white font-black py-4 md:py-5 rounded-sm text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                📱 {userState.language === 'en' ? 'Message her' : '发消息给她'}
              </span>
            </button>
            <p className="text-[10px] md:text-[11px] text-white/35 text-center leading-relaxed px-2">
              {userState.language === 'en'
                ? 'Texting is not the same as being there. Find her in person for the real thing.'
                : '发消息和见面不是一回事。想好好说话，得在对的地方碰到她。'}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default LobbyScreen;
