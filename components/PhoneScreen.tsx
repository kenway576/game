import React, { useMemo, useState, useEffect } from 'react';
import { Language, GameCalendar, StoryFlags, CharacterId, ChatMode, AffectionMap, FamiliarityMap } from '../types';
import {
  PHONE_CONTACTS, PHONE_APPS, PhoneAppId, PhoneContact,
  messagesFor, unreadFor, totalUnread, readFlag, PhoneContext
} from '../data/phoneData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 📱 手机
//
// 【为什么手机长得不像这个游戏的其他界面】
// 全游戏的 UI 是女神异闻录那套斜切色块，手机故意**不是**——
// 它是圆角的、深色的、安静的，像一部真的手机。
// 因为它在设定里就是一件实物：你把它从口袋里掏出来。
// 界面语言不一样，反而让"这是个道具，不是菜单"这件事成立。
//
// 【三层：锁屏 → 主页 → App】
// 锁屏那一层不是装饰。它给了三样东西一个位置：
// 现在几点几号、天气、以及**几条未读**——
// 一部手机最重要的信息本来就在锁屏上，不用点进去。
//
// 【动画】
// 掏出来：整机从屏幕下方推上来（280ms）。
// 解锁：锁屏往上滑走，主页的图标错开 40ms 依次弹进来。
// 进 App：从图标那个位置放大铺满。
// 这三段是这个界面唯一的动效，都很短——手机的动画要快，
// 慢一点就变成"在看动画"而不是"在用手机"。
// ---------------------------------------------------------

interface Props {
  language: Language;
  calendar: GameCalendar;
  storyFlags: StoryFlags;
  affection: AffectionMap;
  familiarity: FamiliarityMap;
  metChars: CharacterId[];
  wordCount: number;
  onClose: () => void;
  onOpenApp: (app: PhoneAppId) => void;
  onEnterChat: (charId: CharacterId, mode: ChatMode) => void;
  onReadMessages: (msgIds: string[]) => void;
}

const WEEK_JP = ['日', '月', '火', '水', '木', '金', '土'];

const PhoneScreen: React.FC<Props> = ({
  language, calendar, storyFlags, affection, familiarity, metChars,
  wordCount, onClose, onOpenApp, onEnterChat, onReadMessages
}) => {
  const en = language === 'en';
  // 'lock' → 'home' → 'messages' → 'thread'
  const [view, setView] = useState<'lock' | 'home' | 'messages' | 'thread'>('lock');
  const [thread, setThread] = useState<PhoneContact | null>(null);
  // 对话里的气泡一条一条冒出来，不是一次性铺满
  const [shown, setShown] = useState(0);

  const ctx: PhoneContext = useMemo(
    () => ({ flags: storyFlags, affection, familiarity, met: metChars }),
    [storyFlags, affection, familiarity, metChars]
  );

  const contacts = useMemo(
    () => PHONE_CONTACTS.filter(c => metChars.includes(c.id)),
    [metChars]
  );
  const unread = useMemo(() => totalUnread(ctx), [ctx]);

  const threadMsgs = useMemo(
    () => (thread ? messagesFor(thread.id, ctx) : []),
    [thread, ctx]
  );
  // 展开成一条一条的气泡
  const bubbles = useMemo(
    () => threadMsgs.flatMap(m => m.lines.map(l => ({ ...l, msgId: m.id, word: m.word }))),
    [threadMsgs]
  );

  // 打开对话 → 一条一条冒出来，冒完记已读
  useEffect(() => {
    if (view !== 'thread' || !bubbles.length) return;
    setShown(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(i);
      audioManager.playSfx('page');
      if (i >= bubbles.length) clearInterval(t);
    }, 420);
    return () => clearInterval(t);
  }, [view, thread]);          // bubbles 不进依赖：已读之后它会变，会把动画重放一遍

  const openThread = (c: PhoneContact) => {
    audioManager.playSfx('click');
    setThread(c);
    setView('thread');
    const unreadIds = messagesFor(c.id, ctx)
      .filter(m => !storyFlags[readFlag(m.id)])
      .map(m => m.id);
    if (unreadIds.length) onReadMessages(unreadIds);
  };

  const time = calendar.timeSlot === 'morning' ? '07:42'
    : calendar.timeSlot === 'afternoon' ? '16:05' : '21:18';
  const weekIdx = ['日', '月', '火', '水', '木', '金', '土']
    .indexOf((calendar.dayOfWeek || '').charAt(0));
  const dateLine = en
    ? `${calendar.month}/${calendar.day}`
    : `${calendar.month} 月 ${calendar.day} 日 ${weekIdx >= 0 ? '（' + WEEK_JP[weekIdx] + '）' : ''}`;
  const weatherIcon = calendar.weather === 'rainy' ? '🌧'
    : calendar.weather === 'cloudy' ? '☁' : calendar.timeSlot === 'night' ? '🌙' : '☀';

  return (
    <div
      className="fixed inset-0 z-[230] bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* 机身 */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[380px] h-[86dvh] md:h-[760px] md:max-h-[92dvh] bg-[#0e1014] rounded-t-[2.2rem] md:rounded-[2.2rem] border border-white/12 shadow-[0_-10px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        style={{ animation: 'phoneIn 280ms cubic-bezier(.22,1,.36,1)' }}
      >
        {/* 状态栏 */}
        <div className="shrink-0 flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-mono text-white/70">
          <span>{time}</span>
          <span className="flex items-center gap-1.5">{weatherIcon}<span className="text-white/40">▯▯▯</span></span>
        </div>

        {/* ---------- 锁屏 ---------- */}
        {view === 'lock' && (
          <div
            className="flex-1 min-h-0 flex flex-col items-center px-7 cursor-pointer"
            onClick={() => { audioManager.playSfx('confirm'); setView('home'); }}
          >
            <div className="mt-14 text-center">
              <p className="text-6xl font-thin text-white tracking-tight">{time}</p>
              <p className="mt-1 text-sm text-white/55">{dateLine}</p>
            </div>

            {/* 通知堆。手机最重要的信息本来就在这一层。 */}
            <div className="mt-10 w-full space-y-2">
              {contacts.filter(c => unreadFor(c.id, ctx) > 0).slice(0, 4).map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2.5 border border-white/10"
                  style={{ animation: `notifIn 320ms ease-out ${140 + i * 70}ms backwards` }}
                >
                  <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold text-white truncate">
                      {en ? c.savedAsEn : c.savedAsZh}
                    </span>
                    <span className="block text-[11px] text-white/55 truncate">
                      {en ? 'New message' : '发来了新消息'}
                    </span>
                  </span>
                  <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center">
                    {unreadFor(c.id, ctx)}
                  </span>
                </div>
              ))}
              {unread === 0 && (
                <p className="text-center text-[12px] text-white/30 pt-6">
                  {en ? 'No new messages' : '没有新消息'}
                </p>
              )}
            </div>

            <div className="mt-auto mb-7 flex flex-col items-center gap-2">
              <span className="text-[11px] text-white/35 tracking-widest">
                {en ? 'tap to unlock' : '点一下解锁'}
              </span>
              <span className="w-28 h-1 rounded-full bg-white/25" />
            </div>
          </div>
        )}

        {/* ---------- 主页 ---------- */}
        {view === 'home' && (
          <div className="flex-1 min-h-0 flex flex-col px-6 pt-6 overflow-y-auto">
            <div className="grid grid-cols-4 gap-x-4 gap-y-5">
              {PHONE_APPS.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => {
                    audioManager.playSfx('click');
                    if (a.id === 'messages') setView('messages');
                    else onOpenApp(a.id);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                  style={{ animation: `appIn 300ms cubic-bezier(.34,1.56,.64,1) ${i * 40}ms backwards` }}
                >
                  <span className={`relative w-14 h-14 rounded-[1.05rem] bg-gradient-to-br ${a.tint} flex items-center justify-center text-2xl shadow-lg transition-transform duration-150 group-active:scale-90`}>
                    {a.icon}
                    {a.id === 'messages' && unread > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 border-2 border-[#0e1014] text-white text-[11px] font-black flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                    {a.id === 'notes' && wordCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-zinc-700 border-2 border-[#0e1014] text-white/80 text-[10px] font-bold flex items-center justify-center">
                        {wordCount}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-white/70 tracking-wide">
                    {en ? a.labelEn : a.labelZh}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-auto pb-6 pt-8 flex justify-center">
              <button
                onClick={() => { audioManager.playSfx('click'); onClose(); }}
                className="w-28 h-1.5 rounded-full bg-white/25 hover:bg-white/45 transition-colors"
                aria-label="close"
              />
            </div>
          </div>
        )}

        {/* ---------- 消息列表 ---------- */}
        {view === 'messages' && (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b border-white/8">
              <button onClick={() => { audioManager.playSfx('click'); setView('home'); }}
                      className="text-white/60 hover:text-white text-lg leading-none">‹</button>
              <span className="text-sm font-bold text-white">{en ? 'Messages' : '消息'}</span>
              {unread > 0 && (
                <span className="ml-auto text-[11px] text-rose-300">
                  {en ? `${unread} unread` : `${unread} 条未读`}
                </span>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {contacts.length === 0 && (
                <p className="p-8 text-center text-sm text-white/30">
                  {en ? 'You have nobody’s number yet.' : '你还没有任何人的联系方式。'}
                </p>
              )}
              {contacts.map((c, i) => {
                const n = unreadFor(c.id, ctx);
                const msgs = messagesFor(c.id, ctx);
                const last = msgs.length ? msgs[msgs.length - 1].lines.slice(-1)[0] : null;
                return (
                  <button
                    key={c.id}
                    onClick={() => openThread(c)}
                    className="w-full flex items-center gap-3 px-5 py-3 border-b border-white/5 hover:bg-white/5 transition-colors text-left"
                    style={{ animation: `rowIn 260ms ease-out ${i * 35}ms backwards` }}
                  >
                    <span className="relative shrink-0">
                      <img src={c.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                      {n > 0 && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#0e1014]" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className={`text-[13px] truncate ${n > 0 ? 'font-black text-white' : 'font-bold text-white/85'}`}>
                          {en ? c.savedAsEn : c.savedAsZh}
                        </span>
                        <span className="text-[10px] font-mono text-white/25 shrink-0">{c.savedAsJp}</span>
                      </span>
                      <span className={`block text-[11px] truncate mt-0.5 ${n > 0 ? 'text-white/75' : 'text-white/35'}`}>
                        {last ? last.jp : (en ? c.statusEn : c.statusZh)}
                      </span>
                    </span>
                    {n > 0 && (
                      <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center">{n}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- 一个人的对话 ---------- */}
        {view === 'thread' && thread && (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b border-white/8">
              <button onClick={() => { audioManager.playSfx('click'); setView('messages'); }}
                      className="text-white/60 hover:text-white text-lg leading-none">‹</button>
              <img src={thread.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-white truncate">
                  {en ? thread.savedAsEn : thread.savedAsZh}
                </span>
                <span className="block text-[10px] text-white/35 truncate">
                  {en ? thread.statusEn : thread.statusZh}
                </span>
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2">
              {bubbles.length === 0 && (
                <p className="text-center text-[12px] text-white/25 py-10">
                  {en ? 'Nothing here yet.' : '这里还什么都没有。'}
                </p>
              )}
              {bubbles.slice(0, shown).map((b, i) => (
                <div key={i} className="flex items-end gap-2" style={{ animation: 'bubbleIn 240ms ease-out' }}>
                  {i === 0 && <img src={thread.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 mb-1" />}
                  {i > 0 && <span className="w-6 shrink-0" />}
                  <span className="max-w-[78%] bg-[#1e2129] rounded-2xl rounded-bl-md px-3.5 py-2.5">
                    <span className="block text-[13px] text-white leading-relaxed">{b.jp}</span>
                    <span className="block text-[11px] text-white/45 mt-1 leading-relaxed">{en ? b.en : b.zh}</span>
                  </span>
                </div>
              ))}
              {/* 还在打字 */}
              {shown < bubbles.length && (
                <div className="flex items-end gap-2">
                  <span className="w-6 shrink-0" />
                  <span className="bg-[#1e2129] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    {[0, 1, 2].map(d => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/40"
                            style={{ animation: `typing 1s ease-in-out ${d * 0.18}s infinite` }} />
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* 回复。这两个按钮就是原来大厅上那两个，只是现在它们在手机里，
                而且措辞变成了"发消息"——文字聊天和当面说话不是一回事。 */}
            <div className="shrink-0 px-4 py-3 border-t border-white/8 space-y-2">
              <button
                onClick={() => { audioManager.playSfx('confirm'); onEnterChat(thread.id, ChatMode.FREE_TALK); }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-black py-3 rounded-xl transition-colors"
              >
                {en ? '💬  Message her' : '💬  发消息'}
              </button>
              <button
                onClick={() => { audioManager.playSfx('confirm'); onEnterChat(thread.id, ChatMode.STUDY); }}
                className="w-full bg-white/8 hover:bg-white/15 text-white/80 text-[12px] font-bold py-2.5 rounded-xl transition-colors"
              >
                {en ? '📚  Ask her to quiz you' : '📚  让她考考你'}
              </button>
              <p className="text-[10px] text-white/25 text-center leading-relaxed pt-0.5">
                {en
                  ? 'Texting is not the same as being there. Find her in person for the real thing.'
                  : '发消息和见面不是一回事。想好好说话，得在对的地方碰到她。'}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes phoneIn  { from { transform: translateY(24px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes notifIn  { from { transform: translateY(-10px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes appIn    { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes rowIn    { from { transform: translateX(-10px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes bubbleIn { from { transform: translateY(6px) scale(0.96); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes typing   { 0%,60%,100% { opacity: 0.25; transform: none; } 30% { opacity: 1; transform: translateY(-3px); } }
      `}</style>
    </div>
  );
};

export default PhoneScreen;
