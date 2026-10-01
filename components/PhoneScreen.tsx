import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Language, GameCalendar, StoryFlags, CharacterId, AffectionMap, FamiliarityMap, PhoneChatMsg } from '../types';
import {
  PHONE_CONTACTS, PHONE_APPS, PhoneAppId, PhoneContact, PhoneMessage,
  messagesFor, unreadFor, totalUnread, readFlag, hasContact, PhoneContext
} from '../data/phoneData';
import { COMMON_STICKERS } from '../data/stickers';
import Sticker from './Sticker';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 📱 手机
//
// 【为什么手机长得不像这个游戏的其他界面】
// 全游戏的 UI 是女神异闻录那套斜切色块，手机故意**不是**——
// 它是圆角的、深色的、安静的，像一部真的手机。
// 因为它在设定里就是一件实物：你把它从口袋里掏出来。
//
// 【三层：锁屏 → 主页 → App】
// 锁屏那一层不是装饰：现在几点几号、天气、以及**几条未读**——
// 一部手机最重要的信息本来就在锁屏上，不用点进去。
//
// 【聊天就是聊天】
// 以前点「发消息」会跳出手机、换成立绘对话——人"蹦"到你面前，
// 跟发消息这件事对不上。现在消息就在手机里发、在手机里收：
// 她的回复一条一条冒出来，会打字、会已读、会甩一张表情包过来。
// 见到本人的那种对话（立绘、场景、表情）只在现实里碰到她的时候才有。
// ---------------------------------------------------------

export type PhoneView = 'lock' | 'home' | 'messages' | 'thread';

interface Props {
  language: Language;
  calendar: GameCalendar;
  storyFlags: StoryFlags;
  affection: AffectionMap;
  familiarity: FamiliarityMap;
  metChars: CharacterId[];
  wordCount: number;
  // 从哪一层开始：从 App 里退回来时直接回主页，从大厅点某个人时直接进她的对话
  startView?: PhoneView;
  initialThread?: CharacterId | null;
  // 真正聊过的那些（含抄进来的预写消息）
  chats: Partial<Record<CharacterId, PhoneChatMsg[]>>;
  // 她正在打字
  typingFor: CharacterId | null;
  // 今天她还回不回。返回一句说明 = 不回了（冷淡期 / 今天聊够了）
  replyBlock: (id: CharacterId) => string | null;
  onClose: () => void;
  onOpenApp: (app: PhoneAppId) => void;
  onSend: (id: CharacterId, payload: { text?: string; sticker?: string }) => void;
  // 点开对话时把还没读的预写消息交出去：App 把它们抄进聊天记录、记成已读
  onReadMessages: (id: CharacterId, msgs: PhoneMessage[]) => void;
}

const WEEK_JP = ['日', '月', '火', '水', '木', '金', '土'];

const PhoneScreen: React.FC<Props> = ({
  language, calendar, storyFlags, affection, familiarity, metChars,
  wordCount, startView = 'lock', initialThread = null, chats, typingFor, replyBlock,
  onClose, onOpenApp, onSend, onReadMessages
}) => {
  const en = language === 'en';
  const ctx: PhoneContext = useMemo(
    () => ({ flags: storyFlags, affection, familiarity, met: metChars }),
    [storyFlags, affection, familiarity, metChars]
  );
  const contacts = useMemo(() => PHONE_CONTACTS.filter(c => hasContact(c.id, ctx)), [ctx]);
  const unread = useMemo(() => totalUnread(ctx), [ctx]);

  const startThread = initialThread ? contacts.find(c => c.id === initialThread) || null : null;
  const [view, setView] = useState<PhoneView>(startThread ? 'thread' : (initialThread ? 'messages' : startView));
  const [thread, setThread] = useState<PhoneContact | null>(startThread);
  const [draft, setDraft] = useState('');
  const [trayOpen, setTrayOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // 这次点进来之前已经在记录里的条数：之后的才播入场动画
  const [seenAt, setSeenAt] = useState(0);

  const openThread = (c: PhoneContact) => {
    audioManager.playSfx('click');
    setSeenAt((chats[c.id] || []).length);
    setThread(c);
    setView('thread');
    setTrayOpen(false);
    const fresh = messagesFor(c.id, ctx).filter(m => !storyFlags[readFlag(m.id)]);
    if (fresh.length) onReadMessages(c.id, fresh);
  };

  // 从大厅直接点进某个人：挂载时也要把她的未读交出去
  useEffect(() => {
    if (startThread) openThread(startThread);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const log = thread ? (chats[thread.id] || []) : [];
  // 在这套聊天记录出现之前就已经读过的预写消息：放在最上面，原样显示
  const legacy = useMemo(() => {
    if (!thread) return [];
    const copied = new Set(log.map(m => m.scriptId).filter(Boolean));
    return messagesFor(thread.id, ctx).filter(m => storyFlags[readFlag(m.id)] && !copied.has(m.id));
  }, [thread, log, ctx, storyFlags]);

  // 新消息进来就滚到底
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log.length, typingFor, view, trayOpen]);

  const block = thread ? replyBlock(thread.id) : null;
  const typing = !!thread && typingFor === thread.id;

  const send = (payload: { text?: string; sticker?: string }) => {
    if (!thread || typing) return;
    if (payload.text !== undefined && !payload.text.trim()) return;
    audioManager.playSfx('send');
    onSend(thread.id, payload);
    setDraft('');
    setTrayOpen(false);
  };

  const time = calendar.timeSlot === 'morning' ? '07:42'
    : calendar.timeSlot === 'lunch' ? '12:26'
    : calendar.timeSlot === 'afternoon' ? '16:05' : '21:18';
  const weekIdx = WEEK_JP.indexOf((calendar.dayOfWeek || '').charAt(0));
  const dateLine = en
    ? `${calendar.month}/${calendar.day}`
    : `${calendar.month} 月 ${calendar.day} 日 ${weekIdx >= 0 ? '（' + WEEK_JP[weekIdx] + '）' : ''}`;
  const weatherIcon = calendar.weather === 'rainy' ? '🌧'
    : calendar.weather === 'cloudy' ? '☁' : calendar.timeSlot === 'night' ? '🌙' : '☀';

  // 日期分隔线："今天 / 昨天 / 3 天前"
  const todayIdx = log.length ? Math.max(...log.map(m => m.day)) : 0;
  const dayLabel = (d: number, now: number) => {
    const diff = now - d;
    if (diff <= 0) return en ? 'Today' : '今天';
    if (diff === 1) return en ? 'Yesterday' : '昨天';
    return en ? `${diff} days ago` : `${diff} 天前`;
  };
  // 我发的最后一条之后她回过没有——回过就挂「既読」
  const lastHerIdx = (() => { for (let i = log.length - 1; i >= 0; i--) if (log[i].from === 'her') return i; return -1; })();

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
                      {(() => { const ms = messagesFor(c.id, ctx).filter(m => !storyFlags[readFlag(m.id)]); return ms.length ? ms[0].lines[0].jp : (en ? 'New message' : '发来了新消息'); })()}
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
              {initialThread && !startThread && (
                <p className="px-5 py-3 text-[11px] text-amber-300/80 border-b border-white/5">
                  {en ? 'You have not swapped numbers with her yet. Talk to her in person first.' : '你们还没交换联系方式。先当面跟她说上话吧。'}
                </p>
              )}
              {contacts.map((c, i) => {
                const n = unreadFor(c.id, ctx);
                const mine = chats[c.id] || [];
                const lastLog = mine[mine.length - 1];
                const scripted = messagesFor(c.id, ctx);
                const lastScripted = scripted.length ? scripted[scripted.length - 1].lines.slice(-1)[0].jp : null;
                const preview = n > 0
                  ? lastScripted
                  : lastLog
                    ? (lastLog.sticker ? (en ? '[Sticker]' : '[表情包]') : (lastLog.from === 'me' ? (en ? 'You: ' : '你：') : '') + (lastLog.jp || ''))
                    : lastScripted;
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
                        {preview || (en ? c.statusEn : c.statusZh)}
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
              <button onClick={() => { audioManager.playSfx('click'); setView('messages'); setTrayOpen(false); }}
                      className="text-white/60 hover:text-white text-lg leading-none">‹</button>
              <img src={thread.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-white truncate">
                  {en ? thread.savedAsEn : thread.savedAsZh}
                </span>
                <span className={`block text-[10px] truncate ${typing ? 'text-emerald-300' : 'text-white/35'}`}>
                  {typing ? (en ? 'typing…' : '对方正在输入…') : (en ? thread.statusEn : thread.statusZh)}
                </span>
              </span>
            </div>

            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-2 bg-[#0b0d11]">
              {legacy.length === 0 && log.length === 0 && !typing && (
                <p className="text-center text-[12px] text-white/25 py-10">
                  {en ? 'No messages yet. Say something.' : '还没有聊过。说点什么吧。'}
                </p>
              )}

              {/* 以前就读过的预写消息 */}
              {legacy.flatMap(m => m.lines.map((l, j) => (
                <HerBubble key={`${m.id}-${j}`} avatar={j === 0 ? thread.avatar : null} jp={l.jp} tr={en ? l.en : l.zh} />
              )))}

              {log.map((m, i) => {
                const prev = log[i - 1];
                const newDay = !prev || prev.day !== m.day;
                const animate = i >= seenAt;
                return (
                  <React.Fragment key={m.id}>
                    {newDay && (
                      <div className="flex justify-center py-1">
                        <span className="text-[10px] text-white/40 bg-white/5 rounded-full px-2.5 py-0.5">
                          {dayLabel(m.day, todayIdx)}
                        </span>
                      </div>
                    )}
                    {m.from === 'system' ? (
                      <p className="text-center text-[10px] text-white/35 px-6 py-1 leading-relaxed">{m.jp}</p>
                    ) : m.from === 'me' ? (
                      <div className="flex justify-end items-end gap-1.5" style={animate ? { animation: 'bubbleIn 220ms ease-out' } : undefined}>
                        <span className="flex flex-col items-end text-[9px] text-white/30 leading-tight shrink-0 mb-0.5">
                          {i < lastHerIdx || typing ? <span>{en ? 'Read' : '既読'}</span> : null}
                          <span>{m.time}</span>
                        </span>
                        {m.sticker ? (
                          <Sticker id={m.sticker} size={118} />
                        ) : (
                          <span className="max-w-[74%] bg-[#06c755] text-black rounded-2xl rounded-br-md px-3.5 py-2 text-[13px] leading-relaxed break-words">
                            {m.jp}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div style={animate ? { animation: 'bubbleIn 240ms ease-out' } : undefined}>
                        <HerBubble
                          avatar={!prev || prev.from !== 'her' || newDay ? thread.avatar : null}
                          jp={m.jp} tr={m.tr} sticker={m.sticker} time={m.time}
                        />
                        {m.delta && (m.delta.aff !== 0 || m.delta.fam !== 0) && (
                          <div className="pl-9 mt-1 flex gap-2 text-[10px] font-bold">
                            {m.delta.fam !== 0 && <span className={m.delta.fam > 0 ? 'text-sky-300' : 'text-rose-300'}>🤝 {m.delta.fam > 0 ? '+' : ''}{m.delta.fam}</span>}
                            {m.delta.aff !== 0 && <span className={m.delta.aff > 0 ? 'text-pink-300' : 'text-rose-300'}>♥ {m.delta.aff > 0 ? '+' : ''}{m.delta.aff}</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {typing && (
                <div className="flex items-end gap-2">
                  <img src={thread.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <span className="bg-[#22252d] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    {[0, 1, 2].map(d => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/40"
                            style={{ animation: `typing 1s ease-in-out ${d * 0.18}s infinite` }} />
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* 表情包面板 */}
            {trayOpen && !block && (
              <div className="shrink-0 h-[210px] overflow-y-auto border-t border-white/8 bg-[#14161c] px-2 py-2 grid grid-cols-4 gap-1" style={{ animation: 'trayIn 180ms ease-out' }}>
                {COMMON_STICKERS.map(s => (
                  <button key={s.id} onClick={() => send({ sticker: s.id })}
                          className="rounded-xl hover:bg-white/5 active:scale-95 transition flex justify-center py-1">
                    <Sticker def={s} size={72} showMeaning en={en} />
                  </button>
                ))}
              </div>
            )}

            {/* 输入栏 */}
            <div className="shrink-0 px-3 py-2.5 border-t border-white/8 bg-[#0e1014]">
              {block ? (
                <p className="text-[11px] text-white/40 text-center py-2 leading-relaxed">{block}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { audioManager.playSfx('click'); setTrayOpen(o => !o); }}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg transition ${trayOpen ? 'bg-emerald-500/25' : 'bg-white/10 hover:bg-white/15'}`}
                    aria-label="stickers"
                  >😊</button>
                  <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onFocus={() => setTrayOpen(false)}
                    onKeyDown={e => {
                      // 输入法还在选字的时候按回车是"确定这个字"，不是"发送"
                      if (e.key === 'Enter' && !(e.nativeEvent as any).isComposing) send({ text: draft });
                    }}
                    disabled={typing}
                    placeholder={en ? 'Message (Japanese is best)' : '发消息（最好用日语）'}
                    className="flex-1 min-w-0 bg-white/10 rounded-full px-4 py-2 text-[13px] text-white placeholder-white/30 outline-none focus:bg-white/15"
                  />
                  <button
                    onClick={() => send({ text: draft })}
                    disabled={typing || !draft.trim()}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition ${draft.trim() && !typing ? 'bg-[#06c755] text-black' : 'bg-white/10 text-white/25'}`}
                    aria-label="send"
                  >➤</button>
                </div>
              )}
              <p className="text-[9px] text-white/20 text-center mt-1.5 leading-relaxed">
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
        @keyframes trayIn   { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes typing   { 0%,60%,100% { opacity: 0.25; transform: none; } 30% { opacity: 1; transform: translateY(-3px); } }
      `}</style>
    </div>
  );
};

// 她的一条：头像（连发时只在第一条显示）+ 气泡（日语 + 小字译文），或者一张表情包
const HerBubble: React.FC<{ avatar: string | null; jp?: string; tr?: string; sticker?: string; time?: string }> = ({ avatar, jp, tr, sticker, time }) => (
  <div className="flex items-end gap-2">
    {avatar ? <img src={avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" /> : <span className="w-7 shrink-0" />}
    {sticker ? (
      <Sticker id={sticker} size={118} />
    ) : (
      <span className="max-w-[74%] bg-[#22252d] rounded-2xl rounded-bl-md px-3.5 py-2">
        <span className="block text-[13px] text-white leading-relaxed break-words">{jp}</span>
        {tr && <span className="block text-[11px] text-white/45 mt-0.5 leading-relaxed">{tr}</span>}
      </span>
    )}
    {time && <span className="text-[9px] text-white/25 shrink-0 mb-0.5">{time}</span>}
  </div>
);

export default PhoneScreen;
