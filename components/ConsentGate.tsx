import React, { useState } from 'react';
import { Language } from '../types';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 学术知情同意 —— 卡在序章结束、进入自由游玩之前
//
// 为什么放在这里而不是开局：
// 序章是手写剧本，一句话都不会送去模型，也就不产生任何实验数据；
// 而进入大厅之后每一次对话都会。同意书应该出现在**真正开始采集的那一刻**，
// 而不是玩家还没看到游戏长什么样的时候。
//
// 邮箱是选填：不填也能玩，只是收不到后续问卷。
// ---------------------------------------------------------

interface Props {
  language: Language;
  T: Record<string, string>;
  email: string;
  onEmailChange: (v: string) => void;
  onAgree: () => void;
}

const ConsentGate: React.FC<Props> = ({ language, T, email, onEmailChange, onAgree }) => {
  const en = language === 'en';
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-[500] bg-black/92 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-zinc-950 border-4 border-white p-7 md:p-12 shadow-[14px_14px_0px_rgba(215,38,56,1)] transform -skew-x-2 max-h-[92dvh] overflow-y-auto">
        <div className="transform skew-x-2">

          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-red-500 mb-2">
            {en ? 'Before you go on' : '在继续之前'}
          </p>
          <h2 className="text-2xl md:text-4xl font-black italic text-white tracking-tight mb-5">
            {T.consentTitle}
          </h2>

          <div className="text-sm md:text-base text-white/70 leading-relaxed space-y-3 mb-7">
            <p>
              {en
                ? 'From here on you will be talking to the characters through a language model. Those conversations, along with your in-game settings, are what this study looks at.'
                : '从这里开始，你和角色的对话会经由语言模型生成。这些对话记录与你的游戏设置，正是本研究要分析的内容。'}
            </p>
            <p>
              {en
                ? 'The prologue you just played was hand-written and sent nothing anywhere.'
                : '你刚刚玩过的序章是手写剧本，没有向任何地方发送过内容。'}
            </p>
          </div>

          <label className="flex items-start gap-3 md:gap-4 border-2 border-white/20 p-4 md:p-5 bg-black/50 hover:border-yellow-500/50 transition-colors cursor-pointer mb-5">
            <input
              type="checkbox"
              checked={checked}
              data-sfx-silent
              onChange={e => setChecked(e.target.checked)}
              className="w-5 h-5 md:w-6 md:h-6 mt-0.5 accent-red-600 cursor-pointer flex-shrink-0"
            />
            <span className="text-[11px] md:text-sm text-gray-300 leading-relaxed select-none">
              {T.consentText}
            </span>
          </label>

          <div className="mb-7">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/50 mb-1.5 block">
              {T.emailLabel} <span className="text-white/30 normal-case tracking-normal">({en ? 'optional' : '选填'})</span>
            </span>
            <input
              type="email"
              value={email}
              data-sfx-silent
              onChange={e => onEmailChange(e.target.value.trim())}
              placeholder={T.emailPlaceholder}
              className="w-full bg-black/50 border-2 border-white/10 text-yellow-400 text-sm px-4 py-3 font-mono focus:border-yellow-400 outline-none transition-all placeholder-white/20"
            />
          </div>

          <button
            onClick={() => { audioManager.playSfx('confirm'); onAgree(); }}
            disabled={!checked}
            data-sfx-silent
            className="w-full bg-red-600 hover:bg-yellow-400 hover:text-black text-white border-2 border-black py-4 font-black italic text-lg md:text-xl tracking-[0.2em] transform -skew-x-12 shadow-[7px_7px_0px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <span className="block transform skew-x-12">
              {en ? 'I AGREE — CONTINUE' : '我同意 — 继续'}
            </span>
          </button>

          <p className="mt-4 text-[10px] text-white/30 leading-relaxed text-center">
            {en
              ? 'You can export or review everything collected at any time from the system menu.'
              : '随时可以在系统菜单里导出或查看已收集的全部内容。'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentGate;
