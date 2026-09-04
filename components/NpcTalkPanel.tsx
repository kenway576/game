import React, { useState } from 'react';
import { GameCalendar, StoryFlags, CharacterId, StoryEffect } from '../types';
import { findNpc } from '../data/npcData';
import { openTopics, topicLines, topicSeenFlag, NpcTopic } from '../data/npcTalk';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 💬 在自建界面里跟 NPC 说话
//
// 食堂和两家店有自己的界面，不走剧本引擎——但站柜台的那三个人
// （山田阿姨、源老爹、高桥）恰恰是最该能搭话的：
// 山田阿姨知道明天出什么，源老爹知道今天鱼口好不好，
// 高桥知道今天哪一排贴了新标签。
//
// 台词从 npcTalk 的 topicLines 取，和剧本引擎那条路共用同一份，
// 所以改一句话不用改两个地方。这里只负责把它画出来。
// ---------------------------------------------------------

interface Props {
  npcId: string;
  calendar: GameCalendar;
  storyFlags: StoryFlags;
  metChars: CharacterId[];
  en: boolean;
  onEffects: (fx: StoryEffect[]) => void;
  onFlags: (flags: string[]) => void;
}

const NpcTalkPanel: React.FC<Props> = ({
  npcId, calendar, storyFlags, metChars, en, onEffects, onFlags
}) => {
  const npc = findNpc(npcId);
  const [said, setSaid] = useState<{ topic: NpcTopic; lines: ReturnType<typeof topicLines> } | null>(null);
  if (!npc) return null;

  const topics = openTopics(npcId, storyFlags);
  if (!topics.length && !said) return null;

  const ask = (t: NpcTopic) => {
    audioManager.playSfx('confirm');
    const lines = topicLines(t, { flags: storyFlags, calendar, met: metChars, en });
    setSaid({ topic: t, lines });
    if (t.effects?.length) onEffects(t.effects);
    const flags = [...(t.setFlags || []), ...(t.once ? [topicSeenFlag(t.id)] : [])];
    if (flags.length) onFlags(flags);
  };

  return (
    <div className="relative border-t border-white/10 bg-black/60 px-4 md:px-6 py-3">
      <div className="flex items-start gap-3">
        <img src={npc.sprite} alt="" className="w-10 h-10 rounded-full object-cover object-top shrink-0 border border-white/15" />
        <div className="min-w-0 flex-1">
          {!said ? (
            <>
              <p className="text-[11px] text-white/45 leading-relaxed mb-2">
                {en ? npc.roleEn : npc.roleZh}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {topics.map(t => (
                  <button
                    key={t.id}
                    onClick={() => ask(t)}
                    className="text-left bg-white/8 hover:bg-yellow-400 hover:text-black text-white/85 border border-white/15 px-3 py-1.5 transform -skew-x-12 transition-colors"
                  >
                    <span className="block transform skew-x-12 text-[11px] font-bold">
                      {t.jp && <span className="block text-[11px]">{t.jp}</span>}
                      <span className={t.jp ? 'block text-[10px] opacity-70' : ''}>
                        {en ? t.labelEn : t.labelZh}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
              {said.lines.map((l, i) => (
                <p key={i} className="text-[12px] leading-relaxed mb-1">
                  {l.jp && <span className="text-white font-bold mr-2">「{l.jp}」</span>}
                  <span className="text-white/70">{en ? l.en : l.zh}</span>
                </p>
              ))}
              <button
                onClick={() => { audioManager.playSfx('click'); setSaid(null); }}
                className="mt-1 text-[10px] font-black uppercase tracking-widest text-yellow-400/80 hover:text-yellow-300"
              >
                {en ? '◀ back' : '◀ 收回'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NpcTalkPanel;
