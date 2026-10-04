import { isSchoolDay } from '../data/calendarLife';
import { canGoOutAtAll } from '../data/staminaData';
import StaminaBar from './StaminaBar';
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
  onOpenGift: () => void;
  onOpenPhone: () => void;
  // 点了某个人 → 掏出手机，直接进她的对话。没有她号码的时候按钮是灰的。
  onMessage: (id: CharacterId) => void;
  canMessage: (id: CharacterId) => boolean;
  // 今天早上的安排定了没有。没定的话，主按钮就是「今天的安排」。
  dayPlanned: boolean;
  // 第一章还没打完 → 左上角变成回主线的入口
  mainStoryPending?: boolean;
  onResumeMainStory?: () => void;
  // 🏫 今天要上学，而且早上那节课还没上
  classPending?: boolean;
  classLine?: string;
  onGoToClass?: () => void;
  // 📕 主线：外公那张地图。排在上课前面——
  // 它一学年只出现五次，出现的时候就该是当天最要紧的事。
  mainChapter?: { titleZh: string; titleEn: string; teaseZh: string; teaseEn: string; n: number } | null;
  onStartMainChapter?: () => void;
  phoneUnread: number;
  stamina: number;
  // 🏠 下个月 1 号要交多少、现在欠多少（见 data/rentData）
  rent?: { nextMonth: number; net: number; owed: number; warn: boolean; short: boolean };
  onOpenProtagonistProfile: () => void;
  background: React.ReactNode;
}

const LobbyScreen: React.FC<Props> = ({
  T, userState, customAssets, visibleLobbyChars, lobbyChars, lobbySelectedChar,
  setLobbySelectedChar, affectionMap, familiarityMap, calendar, stats,
  onOpenSystemMenu, onOpenCgGallery, onOpenCalendar, onOpenProtagonistProfile, onOpenRoom, onOpenMap, onOpenInventory, onOpenGift, onOpenPhone, onMessage, canMessage, dayPlanned, mainStoryPending, onResumeMainStory, classPending, classLine, onGoToClass, mainChapter, onStartMainChapter, phoneUnread, stamina, rent, background
}) => {
  // 连最轻的一趟都撑不住 = 今天出不去了
  const spent = !canGoOutAtAll(stamina, calendar);
  // 🧭 大厅只有一个「去做点什么」的主按钮，它说的是**现在**能做的那件事。
  //
  // 以前这里并排两个：「出门」和「今天的行动」。后者其实是早上那张
  // "去不去上学"的面板，可它一天到晚都挂着——夜里点开还能选「去上学」；
  // 而「出门」打开的地图里又列着教室，等于另一条去学校的路。
  // 两个按钮管的是同一件事的不同时段，玩家分不清该按哪个。
  //
  // 现在按时段只给一个入口：
  //   早上    → 今天的安排（上学 / 做便当 / 翘课 / 休息日的整天计划）
  //   午休    → 午休去哪（只有校内）；用掉了 → 回教室
  //   放学后  → 放学后去哪（留在学校的社团教室，或者下山去街上）
  //   夜里    → 夜里出门（只有一趟）；出去过了 → 回家睡觉
  const schoolDayNow = isSchoolDay(calendar);
  const slot = calendar.timeSlot;
  // 这个按钮永远打开「行动」面板（App 的 RestDayPanel），文字只是告诉你现在是什么时段、该想什么。
  // 走不动 / 今晚已经出去过的时候它不再是亮黄色——面板里照样能回房间睡觉。
  const action: { icon: string; zh: string; en: string; primary: boolean } =
    slot === 'morning'
      ? { icon: '📅', zh: dayPlanned ? '今天做什么' : '今天的安排', en: dayPlanned ? 'What now' : 'Plan the day', primary: true }
    : slot === 'lunch' && schoolDayNow && calendar.lunchUsed && classPending
      ? { icon: '🔔', zh: '回教室', en: 'Back to class', primary: true }
    : slot === 'night' && calendar.nightUsed
      ? { icon: '🛏', zh: '今晚就这样', en: 'Done for tonight', primary: false }
    : spent
      ? { icon: '🛏', zh: '走不动了', en: 'Too tired', primary: false }
    : slot === 'lunch' && schoolDayNow
      ? { icon: '🏫', zh: '午休做什么', en: 'Lunch break', primary: true }
    : slot === 'afternoon' && schoolDayNow
      ? { icon: '🎒', zh: '放学后做什么', en: 'After school', primary: true }
    : slot === 'night'
      ? { icon: '🌙', zh: '今晚做什么', en: 'Tonight', primary: true }
      : { icon: '🗺', zh: '今天做什么', en: 'What now', primary: true };
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

  // 时段的叫法要看今天上不上学。休息日没有"午休"也没有"放学后"——
  // 那两个词是相对于课表说的，放假那天说出来就不成立。
  const schoolDay = isSchoolDay(calendar);
  const slotLabel = userState.language === 'en'
    ? (schoolDay
        ? ({ morning: 'MORNING', lunch: 'LUNCH BREAK', afternoon: 'AFTER SCHOOL', night: 'NIGHT' } as Record<string, string>)
        : ({ morning: 'MORNING', lunch: 'DAYTIME', afternoon: 'AFTERNOON', night: 'NIGHT' } as Record<string, string>)
      )[calendar.timeSlot] || ''
    : (schoolDay
        ? ({ morning: '早晨', lunch: '午休', afternoon: '放学后', night: '夜里' } as Record<string, string>)
        : ({ morning: '早晨', lunch: '白天', afternoon: '下午', night: '夜里' } as Record<string, string>)
      )[calendar.timeSlot] || '';

  return (
  <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col">
    {background}
    <div className="absolute top-0 left-0 w-full p-3 md:p-6 flex flex-col md:flex-row justify-between items-start z-40 pointer-events-none gap-3">
      {/* 左上角。
          这里本来写的是"选择你的搭档 / 当前目标：xxx"——像一个任务系统的
          抬头，而不像一个人站在自己房间里。现在换成日期和当下这一刻，
          玩家一眼看到的是"今天几号、什么时段"，那才是他要拿来做决定的东西。

          第一章没打完的时候，这一块变成回主线的入口：以前存档一读回来
          就掉在大厅里，主线断在半路，界面上没有任何地方能回去。 */}
      <div className="bg-black/85 backdrop-blur text-white px-5 md:px-8 py-2.5 md:py-3.5 border-l-4 border-yellow-500 skew-x-12 transform origin-top-left pointer-events-auto shadow-2xl">
        {mainChapter ? (
          <button onClick={onStartMainChapter} className="-skew-x-12 text-left group">
            <h2 className="text-base md:text-2xl font-black italic uppercase tracking-tighter text-amber-300 group-hover:text-amber-200">
              {userState.language === 'en'
                ? `CHAPTER ${mainChapter.n} · ${mainChapter.titleEn} ▶`
                : `第 ${mainChapter.n} 章 · ${mainChapter.titleZh} ▶`}
            </h2>
            <p className="text-white/55 text-[10px] md:text-xs font-bold tracking-widest truncate max-w-[62vw] md:max-w-none">
              {userState.language === 'en' ? mainChapter.teaseEn : mainChapter.teaseZh}
            </p>
          </button>
        ) : mainStoryPending ? (
          <button onClick={onResumeMainStory} className="-skew-x-12 text-left group">
            <h2 className="text-base md:text-2xl font-black italic uppercase tracking-tighter text-yellow-400 group-hover:text-yellow-300">
              {userState.language === 'en' ? 'CONTINUE CHAPTER 1 ▶' : '继续第 1 章 ▶'}
            </h2>
            <p className="text-white/55 text-[10px] md:text-xs font-bold tracking-widest">
              {userState.language === 'en' ? 'The first day is not over yet' : '第一天还没有过完'}
            </p>
          </button>
        ) : classPending ? (
          // 🏫 上课日的早晨。这一格以前是空的：玩家醒来，什么都点不了，
          // 只能等它过去。一周有五个这样的早晨。
          <button onClick={onGoToClass} className="-skew-x-12 text-left group">
            <h2 className="text-base md:text-2xl font-black italic uppercase tracking-tighter text-yellow-400 group-hover:text-yellow-300">
              {/* 午休那一格点进去上的是下午的课，不是"去上学"——
                  第一次玩的人看见"去上学"会以为自己还没出过门。 */}
              {calendar.timeSlot === 'lunch'
                ? (userState.language === 'en' ? 'BACK FOR AFTERNOON CLASS ▶' : '回教室上下午的课 ▶')
                : (userState.language === 'en' ? 'GO TO SCHOOL ▶' : '去上学 ▶')}
            </h2>
            <p className="text-white/55 text-[10px] md:text-xs font-bold tracking-widest truncate max-w-[62vw] md:max-w-none">
              {classLine}
            </p>
          </button>
        ) : (
          <>
            <h2 className="-skew-x-12 text-base md:text-2xl font-black italic uppercase tracking-tighter">
              {calendar.month} / {calendar.day}
              <span className="text-yellow-500 text-sm md:text-lg ml-2">{calendar.dayOfWeek}</span>
            </h2>
            <p className="-skew-x-12 text-yellow-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              {slotLabel}
            </p>
          </>
        )}
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
          // 主按钮说的是现在能做的那件事（见上面 action）。走不动、或者今晚已经出去过了，
          // 它就不再是亮黄色——还点得动，但看上去不像今天该做的事。
          { key: 'map',   on: onOpenMap, icon: action.icon, zh: action.zh, en: action.en, primary: action.primary },
          { key: 'phone', on: onOpenPhone, icon: '📱', zh: '手机',   en: 'Phone', badge: phoneUnread },
          // 🎁 把包里的东西递给谁。放在大厅这一排，因为送东西和
          // 回房间、出门一样，是"用身体做的一件事"，不是菜单里的设置项。
          { key: 'gift',  on: onOpenGift,   icon: '🎁', zh: '送东西', en: 'Give' }
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
                : calendar.timeSlot === 'lunch' ? (userState.language === 'en' ? (schoolDay ? 'lunch' : 'daytime') : (schoolDay ? '午休' : '白天'))
                : calendar.timeSlot === 'afternoon' ? (userState.language === 'en' ? (schoolDay ? 'after school' : 'afternoon') : (schoolDay ? '放学后' : '下午'))
                : (userState.language === 'en' ? 'night' : '夜晚')}
            </span>
          </span>
        </button>

        {/* 🔋 体力。挨着日历放：一个说"还剩几格"，一个说"还撑不撑得住"，
            这两件事是一起看的。 */}
        <StaminaBar cur={stamina} en={userState.language === 'en'} />

        {/* 🏠 房租。平时只在宽屏上淡淡地挂着，方便算账；
            月底（25 号以后）和欠着的时候，手机上也会冒出来，而且变色。 */}
        {rent && (() => {
          const alarm = rent.owed > 0 || (rent.warn && rent.short);
          const en = userState.language === 'en';
          return (
            <div className={`transform -skew-x-12 bg-black/80 backdrop-blur-md border px-3 py-2 ${
              alarm ? 'border-red-500/70' : rent.warn ? 'border-yellow-400/60' : 'border-white/15 hidden md:block'
            }`}>
              <span className={`block transform skew-x-12 text-[10px] font-bold whitespace-nowrap ${
                alarm ? 'text-red-300' : rent.warn ? 'text-yellow-300' : 'text-white/45'
              }`}>
                🏠 {rent.owed > 0
                  ? (en ? `Rent owed ¥${rent.owed.toLocaleString('ja-JP')}` : `欠房租 ¥${rent.owed.toLocaleString('ja-JP')}`)
                  : (en ? `${rent.nextMonth}/1 bills −¥${rent.net.toLocaleString('ja-JP')}`
                        : `${rent.nextMonth}/1 房租水电 −¥${rent.net.toLocaleString('ja-JP')}`)}
              </span>
            </div>
          );
        })()}
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
              onClick={() => { if (canMessage(lobbySelectedChar)) { setLobbySelectedChar(null); onMessage(lobbySelectedChar); } }}
              disabled={!canMessage(lobbySelectedChar)}
              className={`group relative w-full overflow-hidden font-black py-4 md:py-5 rounded-sm text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-xl ${
                canMessage(lobbySelectedChar)
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  : 'bg-white/10 text-white/35 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                📱 {canMessage(lobbySelectedChar)
                  ? (userState.language === 'en' ? 'Message her' : '发消息给她')
                  : (userState.language === 'en' ? 'No number yet' : '还没有她的联系方式')}
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
