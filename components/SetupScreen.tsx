import React, { useState, useEffect } from 'react';
import { UserState, N3GrammarTopic } from '../types';
import { AVAILABLE_MODELS, CUSTOM_MODEL_VALUE } from '../constants';
import { Emo } from './Emo';

// 🎴 标题封面。一张八个人的海报 + 四张"少人多脸"的，轮着播。
//
// 为什么是一套：模型出图 1344x768，八个人塞进去每张脸不到一百像素宽，
// 五官必糊——那是像素不够，不是画得不好。所以除了那张全员海报，
// 其余每张只放一到三个人，脸能分到三到五倍的像素。
// 每张还各占一个游戏里真实存在的地点，轮播时顺手把地图也展示了。
//
// 五张都是按"左边 45% 留给 UI"画的，所以可以直接换而不用改排版。
const COVERS = [
  '/images/ui/title/ensemble.webp',   // 北野坂 · 日落 · 全员
  '/images/ui/title/school.webp',     // 校门 · 早晨 · 明日香 / 光 / 奈绪
  '/images/ui/title/night.webp',      // 高架下 · 夜 · 空 / 真希
  '/images/ui/title/quiet.webp',      // 西村珈琲 · 午后 · 铃 / 深雪
  '/images/ui/title/shrine.webp',     // 生田神社 · 夜 · 稻荷
  // 第二批。前五张全在四月，轮播久了会觉得这游戏只有一个季节。
  '/images/ui/title/summer.webp',     // 须磨海岸 · 盛夏 · 空 / 光 / 真希
  '/images/ui/title/festival.webp',   // 夏祭 · 浴衣 · 明日香 / 奈绪
  '/images/ui/title/rainy.webp',      // 梅雨 · 校门口 · 明日香
  '/images/ui/title/winter.webp',     // 六甲摘星台 · 雪夜 · 铃 / 深雪
  '/images/ui/title/autumn.webp',     // 王子动物园 · 秋 · 光 / 奈绪 / 稻荷
  // 第三批（2026-10）：同样十个场面，按重画后的立绘、邦多利卡面画风重新画了一遍。
  // 旧的十张不撤——两批混在一起轮播，看久了也不腻。
  ...['ensemble', 'school', 'night', 'quiet', 'shrine', 'summer', 'festival', 'rainy', 'winter', 'autumn'].map(k => `/images/ui/title/v2_${k}.webp`)
];

const COVER_MS = 8000;

interface Props {
  T: Record<string, string>;
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  setupStep: 'MENU' | 'NEW_GAME';
  setSetupStep: (step: 'MENU' | 'NEW_GAME') => void;
  hasAnySave: boolean;
  onLoadRequest: () => void;
  onComplete: () => void;
  customApiKey: string;
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customModel: string;
  onModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  customBaseUrl: string;
  onBaseUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customModelName: string;
  onModelNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  consentGiven: boolean;
  setConsentGiven: (v: boolean) => void;
  background: React.ReactNode;
  // 标题画面上的「OPENING」：重播开场动画
  onPlayOpening?: () => void;
}

const SetupScreen: React.FC<Props> = ({
  T, userState, setUserState, setupStep, setSetupStep, hasAnySave,
  onLoadRequest, onComplete, customApiKey, onApiKeyChange,
  customModel, onModelChange, customBaseUrl, onBaseUrlChange,
  customModelName, onModelNameChange, consentGiven, setConsentGiven, background, onPlayOpening
}) => {
  // 每次进标题从随机一张开始——固定从第一张起的话，
  // 玩家每次打开游戏看到的都是同一张，轮播就白做了。
  const [coverIdx, setCoverIdx] = useState(() => Math.floor(Math.random() * COVERS.length));
  useEffect(() => {
    const t = setInterval(() => setCoverIdx(i => (i + 1) % COVERS.length), COVER_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-[100dvh] relative overflow-hidden font-sans select-none flex items-end md:items-center bg-[#121834]">
      {/* 兜底：主视觉万一没加载出来，底下还是原来那张场景图，不会开天窗 */}
      {background}

      {/* 🎴 标题主视觉。这张图是按"左边 45% 留给 UI"画的，
          所以横屏时它满亮度铺满、右对齐——用 Background 那套 60% 透明度会把它糟蹋了。

          竖屏是另一回事：16:9 的图硬塞进 9:19.5，object-cover 会把它放大到
          只剩最右边那一个人的特写。所以手机上改成"上方一条横幅 + 下方排 UI"，
          横幅裁在角色那一侧，看得见人，也看得见樱花和城市。*/}
      {/* 五张全部挂在 DOM 里靠透明度切换：这样浏览器一开始就把它们都拉下来，
          轮到谁的时候是直接淡入，而不是先白一下再加载。总共两点五兆，一次性的。*/}
      {COVERS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden={i !== coverIdx}
          className={`absolute inset-x-0 top-0 z-0 w-full h-[48dvh] object-cover object-[72%_38%]
                      md:inset-0 md:h-full md:object-right
                      transition-opacity duration-[1600ms] ease-in-out ${
                        i === coverIdx ? 'opacity-100' : 'opacity-0'
                      }`}
        />
      ))}
      {/* 左侧压暗。标题块和按钮本身都有实底色，所以这层只要够把远景的碎光压住就行——
          压太重会把日落、港塔和摩天轮全埋掉，而那正是这张图最值钱的部分。
          渐变是斜的，跟整套 P5 斜切 UI 同一种语言。*/}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(100deg, rgba(18,24,52,0.78) 0%, rgba(18,24,52,0.52) 26%, rgba(18,24,52,0.16) 46%, rgba(18,24,52,0) 60%)' }}
      />
      {/* 竖屏专用：横幅底边化进黑色，UI 就落在下半张干净的地方 */}
      <div
        className="absolute inset-0 z-[1] md:hidden pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(18,24,52,0.28) 0%, rgba(18,24,52,0.10) 22%, rgba(18,24,52,0.78) 42%, rgba(18,24,52,0.96) 52%, #121834 62%)' }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center md:items-start justify-end md:justify-center pb-10 md:pb-0 p-4 md:pl-16 lg:pl-24">
        <div className={`transition-all duration-700 transform ease-in-out ${setupStep === 'MENU' ? 'scale-100 translate-y-0' : 'scale-75 -translate-y-[20vh] opacity-50'}`}>
          <div className="relative font-ui text-center md:text-left">
            <p className="font-story text-pink-200 text-xs md:text-base tracking-[0.45em] mb-2 md:mb-3 drop-shadow">神戸で過ごす、一年の物語</p>
            <h1 className="text-6xl md:text-[8.5rem] font-black leading-[0.92] tracking-tight text-white select-none" style={{ textShadow: '0 6px 30px rgba(10,14,40,0.55)' }}>
              KOBE<br />
              <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">STUDY</span>
            </h1>
            <div className="mt-3 md:mt-4 h-[2px] w-40 md:w-64 mx-auto md:mx-0 bg-gradient-to-r from-pink-300 via-amber-200 to-transparent rounded-full" />
          </div>
        </div>

        {setupStep === 'MENU' && (
          <div className="mt-10 md:mt-14 flex flex-col gap-4 items-center md:items-start w-full max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="flex gap-4 mb-2">
              <button onClick={() => setUserState(p => ({...p, language: 'zh'}))} className={userState.language === 'zh' ? 'ui-chip ui-chip-on' : 'ui-chip'}>中文</button>
              <button onClick={() => setUserState(p => ({...p, language: 'en'}))} className={userState.language === 'en' ? 'ui-chip ui-chip-on' : 'ui-chip'}>ENGLISH</button>
            </div>
            <button onClick={onLoadRequest} disabled={!hasAnySave} className="ui-btn-ghost w-full h-14 md:h-[4.5rem] text-xl md:text-2xl disabled:opacity-30">{T.continue}</button>
            <button onClick={onComplete} className="ui-btn-primary w-full h-14 md:h-[4.5rem] text-xl md:text-2xl">{T.newSession}</button>
            {onPlayOpening && (
              <button onClick={onPlayOpening} className="ui-chip self-center md:self-start mt-1">▶ OPENING</button>
            )}
          </div>
        )}

        {setupStep === 'NEW_GAME' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 p-2 md:p-4">
            <div className="relative w-full max-w-3xl bg-black border-4 border-white rounded-2xl p-6 md:p-14 shadow-xl overflow-y-auto max-h-[95dvh]">
              <button onClick={() => setSetupStep('MENU')} className="absolute top-2 right-2 md:-top-8 md:-left-8 bg-pink-400 text-black w-10 h-10 md:w-16 md:h-16 flex items-center justify-center font-black text-xl md:text-2xl border-2 md:border-4 border-black hover:bg-white hover:scale-110 transition-all z-50 shadow-xl">✕</button>
              <h2 className="text-3xl md:text-5xl font-black text-white italic mb-6 md:mb-10 border-b-4 md:border-b-8 border-red-600 pb-2 md:pb-4 tracking-tighter uppercase flex items-baseline gap-2 md:gap-4"><span className="text-red-600 text-4xl md:text-6xl">01</span> {T.registration}</h2>

              <div className="space-y-6 md:space-y-8">
                <div className="group relative mt-4">
                  <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase rounded-xl border-2 border-black group-focus-within:bg-red-500 group-focus-within:text-white transition-colors z-20">{T.codeName}</label>
                  <input type="text" value={userState.playerName} onChange={(e) => setUserState(prev => ({...prev, playerName: e.target.value}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-lg md:text-2xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-pink-300 focus:bg-zinc-800 outline-none transition-all placeholder-white/10 shadow-inner" placeholder={T.enterName} />
                </div>

                <div className="group relative mt-4">
                  <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase rounded-xl border-2 border-black group-focus-within:bg-green-500 group-focus-within:text-white transition-colors z-20">{T.emailLabel || 'Email'}</label>
                  <input type="email" value={userState.email} onChange={(e) => setUserState(prev => ({...prev, email: e.target.value}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-lg md:text-2xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-green-400 focus:bg-zinc-800 outline-none transition-all placeholder-white/10 shadow-inner" placeholder={T.emailPlaceholder || 'For notifications...'} />
                </div>

                <div className="group relative mt-4">
                  <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase rounded-xl border-2 border-black group-focus-within:bg-blue-500 group-focus-within:text-white transition-colors z-20">{T.targetGrammar}</label>
                  <div className="relative">
                    <select value={userState.grammarTopic} onChange={(e) => setUserState(prev => ({...prev, grammarTopic: e.target.value as N3GrammarTopic}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-base md:text-xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-pink-300 focus:bg-zinc-800 outline-none transition-all appearance-none cursor-pointer hover:bg-zinc-800 shadow-inner">
                      {Object.values(N3GrammarTopic).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs">▼</div>
                  </div>
                </div>
                <div className="group relative mt-4">
                  <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase rounded-xl border-2 border-black group-focus-within:bg-pink-400 group-focus-within:text-black transition-colors z-20">{T.missionObj}</label>
                  <input type="text" value={userState.learningGoal} onChange={(e) => setUserState(prev => ({...prev, learningGoal: e.target.value}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-base md:text-xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-pink-300 focus:bg-zinc-800 outline-none transition-all placeholder-white/10 shadow-inner" placeholder={T.enterGoal} />
                </div>

                <div className="border-t-2 border-white/10 pt-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                  <div className="group relative">
                    <label className="absolute -top-3 -left-2 bg-zinc-800 text-gray-400 px-3 py-1 font-bold text-[10px] md:text-xs uppercase rounded-xl border border-gray-600 z-20">API Key (Google / DeepSeek / Custom)</label>
                    <div className="absolute -top-3 right-0 flex gap-2 z-30">
                      <a href="https://platform.deepseek.com/" target="_blank" rel="noreferrer" className="bg-blue-600/90 text-white hover:bg-pink-400 hover:text-black transition-colors px-2 py-1 font-bold text-[8px] md:text-[10px] shadow-sm flex items-center gap-1"><span><Emo e="🔑" /> DeepSeek</span></a>
                      <a href="https://aistudio.google.com/api-keys?project=gen-lang-client-0367843531" target="_blank" rel="noreferrer" className="bg-red-600/90 text-white hover:bg-pink-400 hover:text-black transition-colors px-2 py-1 font-bold text-[8px] md:text-[10px] shadow-sm flex items-center gap-1"><span><Emo e="🔑" /> Google</span></a>
                    </div>
                    <input type="password" value={customApiKey} onChange={onApiKeyChange} className="w-full bg-black/50 border-2 border-white/10 text-pink-300 text-sm px-4 md:px-6 py-3 md:py-4 font-mono focus:border-pink-300 outline-none transition-all placeholder-white/10 shadow-inner" placeholder="留空则自动使用内置 API Key..." />
                  </div>
                  <div className="group relative">
                    <label className="absolute -top-3 -left-2 bg-zinc-800 text-gray-400 px-3 py-1 font-bold text-[10px] md:text-xs uppercase rounded-xl border border-gray-600 z-20">Model Select</label>
                    <select value={customModel} onChange={onModelChange} className="w-full bg-black/50 border-2 border-white/10 text-pink-300 text-sm px-4 md:px-6 py-3 md:py-4 font-mono focus:border-pink-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
                      {AVAILABLE_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* ⚙️ OpenAI 兼容自定义接口：选中 Custom 时显示 */}
                {customModel === CUSTOM_MODEL_VALUE && (
                  <div className="border-2 border-pink-300/30 bg-pink-400/5 p-4 md:p-5 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="group relative">
                      <label className="absolute -top-3 -left-2 bg-zinc-800 text-pink-400 px-3 py-1 font-bold text-[10px] md:text-xs uppercase rounded-xl border border-yellow-600/50 z-20">API Base URL</label>
                      <input type="text" value={customBaseUrl} onChange={onBaseUrlChange} className="w-full bg-black/50 border-2 border-white/10 text-pink-300 text-sm px-4 md:px-6 py-3 md:py-4 font-mono focus:border-pink-300 outline-none transition-all placeholder-white/10 shadow-inner" placeholder="https://api.openai.com/v1" />
                    </div>
                    <div className="group relative">
                      <label className="absolute -top-3 -left-2 bg-zinc-800 text-pink-400 px-3 py-1 font-bold text-[10px] md:text-xs uppercase rounded-xl border border-yellow-600/50 z-20">Model ID</label>
                      <input type="text" value={customModelName} onChange={onModelNameChange} className="w-full bg-black/50 border-2 border-white/10 text-pink-300 text-sm px-4 md:px-6 py-3 md:py-4 font-mono focus:border-pink-300 outline-none transition-all placeholder-white/10 shadow-inner" placeholder="gpt-4o-mini / qwen-plus / kimi-k2 ..." />
                    </div>
                    <p className="md:col-span-2 text-[9px] md:text-[10px] text-gray-400 leading-relaxed">
                      {userState.language === 'en'
                        ? 'Works with any OpenAI-compatible API (OpenAI / Kimi / Qwen / GLM / OpenRouter / Ollama...). Enter the Base URL as required by your provider (usually ending with /v1), the exact model ID, and your API Key above.'
                        : '支持所有 OpenAI 兼容接口（OpenAI / Kimi / 通义千问 / 智谱 / OpenRouter / 本地 Ollama 等）。按服务商要求填写接口地址（通常以 /v1 结尾）、准确的模型名称，API Key 填在左上方输入框。'}
                    </p>
                  </div>
                )}

                <div className="group relative flex items-start gap-3 md:gap-4 mt-6 md:mt-8 border-2 border-white/20 p-4 md:p-5 bg-black/50 hover:border-pink-300/50 transition-colors">
                  <input type="checkbox" id="consent" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="w-5 h-5 md:w-6 md:h-6 mt-1 accent-red-600 cursor-pointer flex-shrink-0" />
                  <label htmlFor="consent" className="text-[10px] md:text-xs text-gray-300 leading-relaxed cursor-pointer select-none"><span className="font-bold text-pink-400 uppercase tracking-widest block mb-1">{T.consentTitle}</span>{T.consentText}</label>
                </div>
              </div>

              <div className="mt-8 md:mt-12 flex justify-end">
                <button onClick={onComplete} disabled={!userState.learningGoal.trim() || !userState.playerName.trim() || !consentGiven} className="relative overflow-hidden w-full md:w-auto bg-red-600 hover:bg-white hover:text-red-600 text-white font-black text-xl md:text-2xl py-4 md:py-6 px-8 md:px-16 uppercase tracking-widest transition-all shadow-[6px_6px_0px_#000] md:shadow-[10px_10px_0px_#000] border-2 md:border-4 border-transparent hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-1 active:shadow-none group"><span className="relative z-10">{T.startMission}</span><div className="absolute inset-0 bg-white transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupScreen;
