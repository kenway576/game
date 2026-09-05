import React, { useState } from 'react';
import { Language, StoryFlags } from '../types';
import { readableEntries } from '../data/journalEntries';
import { audioManager } from '../services/audioManager';

interface Props {
  language: Language;
  storyFlags: StoryFlags;
  onClose: () => void;
}

// ---------------------------------------------------------
// 🕯️ 翻外公的手账
//
// 一页一条。左边是他写的，右边是主角后来在页边加的批注——
// 所以这本东西同时是两个人的：一个一九六几年写的，
// 一个六十年后拿着同一本在读。
//
// 排版上刻意做旧：纸色、竖排的日期、页边的折痕。
// 但**不做花哨的翻页动画**——这是一本被翻烂了的旧本子，
// 不是一件精美的收藏品。
// ---------------------------------------------------------
const JournalModal: React.FC<Props> = ({ language, storyFlags, onClose }) => {
  const en = language === 'en';
  const entries = readableEntries(storyFlags as Record<string, boolean>);
  const [i, setI] = useState(0);
  const e = entries[Math.min(i, entries.length - 1)];

  const go = (d: number) => {
    const next = Math.max(0, Math.min(entries.length - 1, i + d));
    if (next === i) return;
    audioManager.playSfx('page');
    setI(next);
  };

  return (
    <div className="fixed inset-0 z-[320] bg-black/88 backdrop-blur-md flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="w-full max-w-3xl" onClick={ev => ev.stopPropagation()}>
        {/* 本子 */}
        <div className="relative bg-[#efe7d6] text-[#2a2620] rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* 装订侧的一道暗边 */}
          <div className="absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-[#c9bda4] to-transparent" />
          {/* 页边的折痕 */}
          <div className="absolute right-8 inset-y-0 w-px bg-[#c9bda4]/60" />

          <div className="relative px-10 md:px-16 py-10 md:py-14 min-h-[380px] flex flex-col">
            <div className="text-[11px] tracking-[0.3em] text-[#8a7f68] mb-6">{e?.dateJp}</div>

            <p className="text-xl md:text-2xl leading-relaxed font-serif mb-4">{e?.jp}</p>
            <p className="text-sm md:text-base text-[#5c5548] leading-relaxed mb-8">
              {en ? e?.en : e?.zh}
            </p>

            {/* 主角后来加的批注：用铅笔灰，斜一点，像真的写在页边 */}
            {(en ? e?.noteEn : e?.noteZh) && (
              <div className="mt-auto pt-6 border-t border-[#c9bda4]/70">
                <p className="text-[13px] text-[#6b6350] italic leading-relaxed"
                   style={{ transform: 'rotate(-0.4deg)' }}>
                  {en ? e?.noteEn : e?.noteZh}
                </p>
              </div>
            )}

            {e?.word && (
              <div className="mt-5 inline-flex items-baseline gap-3 self-start bg-[#e3d9c2] border-l-4 border-[#8a7f68] px-3 py-1.5">
                <span className="text-base font-bold">{e.word.jp}</span>
                {e.word.reading && <span className="text-[11px] font-mono text-[#8a7f68]">{e.word.reading}</span>}
                <span className="text-xs text-[#5c5548]">{en ? e.word.en : e.word.zh}</span>
              </div>
            )}
          </div>
        </div>

        {/* 翻页 */}
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => go(-1)} disabled={i === 0}
                  className="text-white/70 hover:text-white disabled:opacity-25 text-sm tracking-widest px-4 py-2">
            ‹ {en ? 'back' : '上一页'}
          </button>
          <span className="text-[11px] text-white/40 font-mono">{i + 1} / {entries.length}</span>
          <button onClick={() => go(1)} disabled={i >= entries.length - 1}
                  className="text-white/70 hover:text-white disabled:opacity-25 text-sm tracking-widest px-4 py-2">
            {en ? 'next' : '下一页'} ›
          </button>
        </div>

        <button onClick={onClose}
                className="mt-2 w-full text-white/35 hover:text-white/70 text-[11px] tracking-widest uppercase py-2">
          {en ? 'Close it' : '合上'}
        </button>
      </div>
    </div>
  );
};

export default JournalModal;
