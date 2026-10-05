import React, { useMemo, useState } from 'react';
import { CharacterId, GameCalendar, Language, StoryFlags } from '../types';
import { getAffectionLevel, getFamiliarityLevel } from '../constants';
import { DATE_SPOTS, DateSpot } from '../story/dateSpots';
import { inviteMessage } from '../story/dateLines';
import {
  SPEAKER, InviteReply, inviteReply, spotOpenNow, spotBlockedReason, spotKnownEnough, dateOutfitPlan, WearReason
} from '../data/dateData';
import { outfitLabel, seenOutfitFlag } from '../data/outfitContext';

// ---------------------------------------------------------
// 💌 约人出去
//
// 三步：选人 → 选地方 → 看她怎么回。
// 地方的卡片上写着"她大概会穿什么"——没见过的那一身只写"没见过的一身"，
// 留一点悬念给到了那儿的那一刻。
//
// 选地方那一步上面有一排「想让她穿什么」：默认是她自己挑；
// 也可以点名一身——等级解锁的，或者剧情里已经穿给你看过的（文化祭的女仆装、万圣节的变装……）。
// 点名的那一身会覆盖所有地方的预告。
// ---------------------------------------------------------

export interface InviteCandidate {
  id: CharacterId;
  familiarity: number;
  affection: number;
  // 能点名让她穿的衣服（等级解锁的 + 剧情里穿过的）
  wearable: string[];
  // 有值 = 今天约不了，写原因
  blockedZh?: string;
  blockedEn?: string;
}

interface Props {
  language: Language;
  calendar: GameCalendar;
  flags: StoryFlags;
  stamina: number;
  yen: number;
  candidates: InviteCandidate[];
  onGo: (char: CharacterId, spot: DateSpot, outfit: string, reason?: WearReason) => void;
  // 被拒（busy / no）：今天不能再约她
  onRefused: (char: CharacterId, kind: 'busy' | 'no') => void;
  onClose: () => void;
}

const hearts = (n: number) => '♥'.repeat(n) + '♡'.repeat(4 - n);

// 圆形 / 方形头像：用 scripts/make-avatars-v2.mjs 从当前立绘里裁好的脸
const Face: React.FC<{ id: CharacterId; className: string }> = ({ id, className }) => (
  <img src={`/images/avatars/${id}.webp`} alt="" className={`object-cover ${className}`} draggable={false} />
);

const InviteModal: React.FC<Props> = ({ language, calendar, flags, stamina, yen, candidates, onGo, onRefused, onClose }) => {
  const en = language === 'en';
  const [who, setWho] = useState<InviteCandidate | null>(null);
  const [asked, setAsked] = useState<{ spot: DateSpot; reply: InviteReply } | null>(null);
  // '' = 她自己挑；否则是点名的那一身
  const [wish, setWish] = useState<string>('');
  const spotCtx = { calendar, stamina, yen };

  const spots = useMemo(() => who
    ? DATE_SPOTS.filter(s => spotOpenNow(s, spotCtx) && spotKnownEnough(s, who.familiarity))
    : [], [who, calendar, stamina, yen]);

  const pick = (c: InviteCandidate) => { setWho(c); setWish(''); };

  const ask = (spot: DateSpot) => {
    if (!who) return;
    const reply = inviteReply(who.id, spot, { ...spotCtx, flags, familiarity: who.familiarity, affection: who.affection });
    setAsked({ spot, reply });
  };

  // 去这个地方她会穿什么、为什么
  const planFor = (c: InviteCandidate, s: DateSpot): { outfit: string; reason?: WearReason } =>
    wish ? { outfit: wish, reason: 'request' } : dateOutfitPlan(c.id, s, calendar, c.familiarity, c.affection, flags);

  const go = (c: InviteCandidate, s: DateSpot) => {
    const p = planFor(c, s);
    onGo(c.id, s, p.outfit, p.reason);
  };

  const sp = who ? SPEAKER[who.id] : null;
  const name = (id: CharacterId) => en ? SPEAKER[id].en : SPEAKER[id].zh;
  const labelOf = (id: CharacterId, o: string) => {
    const fresh = !!o && !flags[seenOutfitFlag(id, o)];
    return fresh ? (en ? '✨ Something you have never seen' : '✨ 没见过的一身') : outfitLabel(id, o, en);
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/85 backdrop-blur-md p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl bg-zinc-950/95 border-2 border-pink-400/40 rounded-xl shadow-[0_0_80px_rgba(244,114,182,0.18)] max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="px-6 md:px-8 pt-6 pb-4 border-b border-pink-400/25 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {who && <Face id={who.id} className="w-14 h-14 rounded-full border-2 border-pink-300/60 shrink-0" />}
            <div className="min-w-0">
              <span className="text-[10px] font-black tracking-[0.2em] text-black bg-pink-300 px-2 py-0.5 -skew-x-12">
                {en ? 'INVITE' : '邀约'}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic mt-2">
                {!who ? (en ? 'Who will you ask?' : '约谁出去？')
                  : !asked ? (en ? `Where to, with ${name(who.id)}?` : `和${name(who.id)}去哪儿？`)
                  : (en ? 'Her reply' : '她的回复')}
              </h2>
              <p className="text-white/45 text-xs mt-2 leading-relaxed">
                {!who
                  ? (en ? 'A message to one person. If she says yes, she goes home to change first.' : '给一个人发条消息。她答应的话，会先回去换身衣服。')
                  : !asked
                  ? (en ? 'The more it looks like a date, the more she has to like you first.' : '越像约会的地方，她越要先喜欢你才肯去。')
                  : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none px-2">✕</button>
        </div>

        {/* 一、选人 */}
        {!who && (
          <div className="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {candidates.map(c => {
              const blocked = !!(en ? c.blockedEn : c.blockedZh);
              const famL = getFamiliarityLevel(c.familiarity), affL = getAffectionLevel(c.affection);
              return (
                <button
                  key={c.id}
                  disabled={blocked}
                  onClick={() => pick(c)}
                  className={`relative rounded-lg overflow-hidden border text-left transition-all ${blocked
                    ? 'border-white/10 opacity-45 cursor-not-allowed'
                    : 'border-white/15 hover:border-pink-300 hover:-translate-y-0.5'}`}
                >
                  <Face id={c.id} className="w-full aspect-square bg-gradient-to-b from-white/10 to-black/40" />
                  <div className="p-2 bg-black/70">
                    <div className="text-white font-black text-sm">{name(c.id)}</div>
                    <div className="text-[10px] text-white/50">
                      {en ? famL.labelEn : famL.labelZh} · <span className="text-pink-300/80">{en ? affL.labelEn : affL.labelZh}</span>
                    </div>
                    {blocked && <div className="text-[10px] text-rose-300/80 mt-1 leading-snug">{en ? c.blockedEn : c.blockedZh}</div>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 二、选地方 */}
        {who && !asked && (
          <div className="p-4 md:p-6">
            {/* 想让她穿什么 */}
            <div className="mb-4">
              <p className="text-[10px] font-black tracking-[0.25em] text-white/40 mb-2">
                {en ? 'WHAT WOULD YOU LIKE HER TO WEAR?' : '想让她穿什么？'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setWish('')}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${wish === ''
                    ? 'bg-pink-300 text-black border-pink-300 font-bold'
                    : 'border-white/15 text-white/60 hover:border-pink-300/60'}`}
                >
                  {en ? 'Her choice' : '她自己挑'}
                </button>
                {who.wearable.map(o => (
                  <button
                    key={o}
                    onClick={() => setWish(o)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${wish === o
                      ? 'bg-pink-300 text-black border-pink-300 font-bold'
                      : 'border-white/15 text-white/60 hover:border-pink-300/60'}`}
                  >
                    {outfitLabel(who.id, o, en)}
                  </button>
                ))}
              </div>
              {who.wearable.length === 0 && (
                <p className="text-[11px] text-white/35 mt-1">
                  {en ? 'Nothing else to ask for yet. Outfits unlock as you grow closer, or once she has worn them in a story.' : '现在还没有能点名的衣服。关系更近、或者剧情里她穿过一次之后，就能在这里点了。'}
                </p>
              )}
            </div>

            {spots.length === 0 && (
              <p className="text-white/50 text-sm text-center py-8">
                {en ? 'Nowhere you could take her right now.' : '现在这个时候，没有能约她去的地方。'}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {spots.map(s => {
                const block = spotBlockedReason(s, spotCtx, en);
                const plan = planFor(who, s);
                const wear = labelOf(who.id, plan.outfit);
                return (
                  <button
                    key={s.id}
                    disabled={!!block}
                    onClick={() => ask(s)}
                    className={`text-left rounded-lg p-4 border transition-all ${block
                      ? 'bg-white/[0.02] border-white/10 opacity-55 cursor-not-allowed'
                      : 'bg-black/50 border-white/12 hover:border-pink-300/70 hover:bg-pink-400/10 hover:-translate-y-0.5'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl leading-none shrink-0">{s.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-black text-sm tracking-wide flex items-center gap-2 flex-wrap">
                          {en ? s.nameEn : s.nameZh}
                          <span className="text-[10px] text-pink-300/80 tracking-widest">{hearts(s.mood)}</span>
                        </div>
                        <div className="text-white/45 text-[11px] leading-relaxed mt-0.5">{en ? s.blurbEn : s.blurbZh}</div>
                        <div className="text-[11px] mt-1.5 text-amber-200/80">
                          {en ? 'She would wear: ' : '她会穿：'}{wear}
                          {plan.reason === 'request' && <span className="text-pink-300/80">{en ? ' (your request)' : '（你点的）'}</span>}
                        </div>
                        <div className="text-[10px] mt-1 text-white/35">
                          {s.yen ? `¥${s.yen} · ` : ''}{(s.timeCost ?? 1) > 1 ? (en ? 'takes two slots' : '花掉两格时间') : (en ? 'one slot' : '一格时间')}
                        </div>
                        {block && <div className="text-rose-300/80 text-[11px] mt-1">{block}</div>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setWho(null)} className="mt-4 w-full text-white/40 hover:text-white/70 text-xs tracking-widest py-2">
              ← {en ? 'Ask someone else' : '换个人'}
            </button>
          </div>
        )}

        {/* 三、她的回复 */}
        {who && asked && sp && (
          <div className="p-4 md:p-6">
            <div className="bg-slate-900/70 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-green-500/90 text-black rounded-2xl rounded-br-sm px-3 py-2 text-sm">
                  <div className="font-bold">{inviteMessage(asked.spot.nameJp).jp}</div>
                  <div className="text-[11px] opacity-70">{en ? inviteMessage(asked.spot.nameEn).en : inviteMessage(asked.spot.nameZh).zh}</div>
                  {wish && (
                    <div className="text-[11px] mt-1 border-t border-black/15 pt-1">
                      {en ? `P.S. Wear the ${outfitLabel(who.id, wish, true).toLowerCase()}?` : `P.S. 穿那身${outfitLabel(who.id, wish, false)}来好不好？`}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Face id={who.id} className="w-10 h-10 rounded-full border border-white/20 shrink-0" />
                <div className="max-w-[80%] bg-white text-black rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                  <div className="font-bold">{asked.reply.line.jp}</div>
                  <div className="text-[11px] opacity-60">{en ? asked.reply.line.en : asked.reply.line.zh}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {asked.reply.kind === 'yes' && (
                <button
                  onClick={() => go(who, asked.spot)}
                  className="w-full bg-pink-400 hover:bg-pink-300 text-black font-black py-3 rounded-lg tracking-widest"
                >
                  {en ? 'Head out' : '出发'} →
                </button>
              )}
              {asked.reply.kind === 'counter' && asked.reply.counter && (
                <>
                  <button
                    onClick={() => go(who, asked.reply.counter!)}
                    className="w-full bg-pink-400 hover:bg-pink-300 text-black font-black py-3 rounded-lg tracking-widest"
                  >
                    {en ? `OK — ${asked.reply.counter.nameEn}` : `好，就去${asked.reply.counter.nameZh}`} →
                  </button>
                  <button onClick={() => setAsked(null)} className="w-full text-white/50 hover:text-white/80 text-xs py-2">
                    {en ? 'Let me think of somewhere else' : '我再想想别的地方'}
                  </button>
                </>
              )}
              {(asked.reply.kind === 'busy' || asked.reply.kind === 'no') && (
                <>
                  <p className="text-center text-white/40 text-[11px]">
                    {asked.reply.kind === 'busy'
                      ? (en ? 'She has her own day. Maybe someone else is free.' : '她今天有自己的事。也许别人有空。')
                      : (en ? 'Not there, not yet. You learned something about her, at least.' : '那里还不行。不过，你又多了解了她一点。')}
                  </p>
                  <button
                    onClick={() => { onRefused(who.id, asked.reply.kind as 'busy' | 'no'); setAsked(null); setWho(null); }}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg"
                  >
                    {en ? 'Fair enough' : '知道了'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
