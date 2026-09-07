import React, { useMemo, useState } from 'react';
import { CharacterId, Language, LifeState, StoryFlags, FamiliarityMap } from '../types';
import { CHARACTERS } from '../constants';
import { giftableRows, giftVerdict, GiftVerdict } from '../data/giftData';
import { audioManager } from '../services/audioManager';
import ItemIcon from './ItemIcon';

// ---------------------------------------------------------
// 🎁 把一样东西递给某个人
//
// 两栏：左边是包里能送的东西，右边是认识的人。两边都选中了，
// 底下才会亮起那句「递过去」。
//
// 【为什么不预告加多少】
// 递东西这件事一旦标上数字，就变成了刷好感的进货单。
// 这里只说一句"这大概是她会喜欢的东西"或者"她大概会收下"，
// 具体多少等她真的接过去再说——那时候才有意义。
// ---------------------------------------------------------

interface Props {
  language: Language;
  life: LifeState;
  storyFlags: StoryFlags;
  metChars: CharacterId[];
  familiarity: FamiliarityMap;
  // 今天已经收过你东西的人。一天一次，免得好感度变成可以刷的数字。
  givenToday: CharacterId[];
  onClose: () => void;
  onGive: (key: string, char: CharacterId, v: GiftVerdict) => void;
}

const GiftScreen: React.FC<Props> = ({ language, life, storyFlags, metChars, familiarity, givenToday, onClose, onGive }) => {
  const en = language === 'en';
  const rows = useMemo(() => giftableRows(life, storyFlags), [life, storyFlags]);
  const [itemKey, setItemKey] = useState<string | null>(null);
  const [who, setWho] = useState<CharacterId | null>(null);
  const [given, setGiven] = useState<GiftVerdict | null>(null);

  // 🎁 送东西比发消息更进一步：号码可以是顺手换的，
  // 但把一样东西塞到别人手里，得是已经算朋友的关系。
  //   · 真的开口聊过（talked_）
  //   · 親密度到「朋友」（90）
  // 奈绪例外，她从小学起就替你拎过米。
  const GIFT_MIN_FAMILIARITY = 90;
  const closeEnough = (id: CharacterId) =>
    id === CharacterId.NAO
    || (!!storyFlags[`talked_${id}`] && (familiarity[id] ?? 0) >= GIFT_MIN_FAMILIARITY);
  const people = metChars.map(id => CHARACTERS[id]).filter(Boolean).filter(c => closeEnough(c.id));
  const verdict = itemKey && who ? giftVerdict(itemKey, who, life) : null;
  const target = who ? CHARACTERS[who] : null;

  const hand = () => {
    if (!itemKey || !who || !verdict) return;
    audioManager.playSfx('confirm');
    onGive(itemKey, who, verdict);
    setGiven(verdict);
  };

  // 递完之后停在她的反应上，而不是直接把界面关掉。
  if (given && target) {
    return (
      <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-5 text-center">
          <div className="text-5xl">{given.band === 'perfect' ? '💖' : given.band === 'good' ? '🎁' : '🙂'}</div>
          <p className="text-white text-lg leading-relaxed">{en ? given.lineEn : given.lineZh}</p>
          <button
            onClick={() => { setGiven(null); setItemKey(null); setWho(null); onClose(); }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-2.5 text-xs font-black tracking-widest transform -skew-x-12"
          >
            <span className="block transform skew-x-12">{en ? 'Close' : '收起来'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white -skew-x-12">
            {en ? 'GIVE SOMETHING' : '送点东西'}
          </h2>
          <p className="text-white/45 text-[11px] font-bold tracking-widest">
            {en ? 'Something you grew, caught or cooked counts for more than something you bought.'
                : '自己种的、钓的、做的，比买来的值钱。'}
          </p>
        </div>
        <button onClick={onClose}
          className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/20 px-4 py-2 text-[11px] font-black tracking-widest transform -skew-x-12">
          <span className="block transform skew-x-12">{en ? 'Back' : '返回'}</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-2 gap-4 p-5 overflow-hidden">
        {/* 包里的东西 */}
        <div className="min-h-0 flex flex-col">
          <div className="text-white/40 text-[10px] font-black tracking-widest mb-2">
            {en ? 'FROM YOUR BAG' : '包里'}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {rows.length === 0 && (
              <p className="text-white/35 text-sm">
                {en ? 'Nothing worth handing to anybody yet.' : '现在包里没有能拿得出手的东西。'}
              </p>
            )}
            {rows.map(r => (
              <button key={r.item.key}
                onClick={() => { audioManager.playSfx('click'); setItemKey(r.item.key); }}
                className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-3 ${
                  itemKey === r.item.key
                    ? 'bg-yellow-400/15 border-yellow-400/60'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'}`}
              >
                {r.item.iconId
                  ? <ItemIcon id={r.item.iconId} emoji={r.item.emoji} size={28} />
                  : <span className="text-xl w-7 text-center">{r.item.emoji}</span>}
                <span className="flex-1 min-w-0">
                  <span className="block text-white text-sm font-bold truncate">
                    {en ? r.item.nameEn : r.item.nameZh}
                  </span>
                  {(r.item.subZh || r.item.subEn) && (
                    <span className="block text-white/40 text-[10px]">{en ? r.item.subEn : r.item.subZh}</span>
                  )}
                </span>
                {r.n > 1 && <span className="text-white/45 text-xs font-bold">×{r.n}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* 送给谁 */}
        <div className="min-h-0 flex flex-col">
          <div className="text-white/40 text-[10px] font-black tracking-widest mb-2">
            {en ? 'TO' : '送给'}
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pr-1 content-start">
            {people.length === 0 && (
              <p className="col-span-2 text-white/35 text-sm leading-relaxed">
                {en
                  ? 'Nobody yet. Handing somebody a thing is not a first move — talk to them, spend some time, and this fills up.'
                  : '还没有人。把东西塞到别人手里不是第一步——先跟人说上话、处熟一点，这儿自然会有人。'}
              </p>
            )}
            {people.map(c => {
              const done = givenToday.includes(c.id);
              return (
                <button key={c.id}
                  disabled={done}
                  onClick={() => { audioManager.playSfx('click'); setWho(c.id); }}
                  className={`px-3 py-2.5 border text-left transition-all ${
                    done
                      ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed'
                      : who === c.id
                        ? 'bg-rose-400/15 border-rose-400/60'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'}`}
                >
                  <span className="block text-white text-sm font-bold">{c.name}</span>
                  <span className="block text-white/40 text-[10px] truncate">
                    {done ? (en ? 'already had something from you today' : '今天已经收过你的东西了')
                          : (en ? c.roleEn : c.role)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-white/10 flex items-center gap-4">
        <p className="flex-1 text-white/55 text-xs">
          {!itemKey || !who
            ? (en ? 'Pick something, and pick somebody.' : '挑一样东西，再挑一个人。')
            : verdict?.band === 'perfect'
              ? (en ? 'This is the kind of thing she notices, and you made it yourself.' : '这是她会留意的那一类东西，而且是你自己弄来的。')
              : verdict?.band === 'good'
                ? (en ? 'She is likely to like this.' : '她大概会喜欢。')
                : (en ? 'She will take it. Whether it lands is another matter.' : '她会收下。至于说没说到心坎上，那是另一回事。')}
        </p>
        <button
          disabled={!itemKey || !who}
          onClick={hand}
          className={`px-8 py-2.5 text-xs font-black tracking-widest transform -skew-x-12 ${
            itemKey && who
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
              : 'bg-white/5 text-white/25 cursor-not-allowed'}`}
        >
          <span className="block transform skew-x-12">{en ? 'Hand it over' : '递过去'}</span>
        </button>
      </div>
    </div>
  );
};

export default GiftScreen;
