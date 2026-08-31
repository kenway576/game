import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StoryNode, StoryOption, StoryEffect, ShopItem, StoryFlags, Language, ProtagonistStats } from '../types';
import { STAT_METADATA } from '../constants';
import { audioManager } from '../services/audioManager';

interface Props {
  script: StoryNode[];
  language: Language;
  stats: ProtagonistStats;
  background: React.ReactNode;
  // 属性增益上抛给 App：由 App 统一改数值并弹 StatGainToast
  onEffects: (effects: StoryEffect[]) => void;
  onSceneChange: (scene: string) => void;
  // 序章播完（或跳过）时把最终 flags 交回去存档
  onFinish: (flags: StoryFlags) => void;
}

const TYPE_SPEED_MS = 24;

const StoryScreen: React.FC<Props> = ({
  script, language, stats, background, onEffects, onSceneChange, onFinish
}) => {
  const en = language === 'en';

  // 工作副本：选中分支时把 option.then 就地插到当前节点之后，
  // 播完自然回到主线，不需要额外的返回栈。
  const [nodes, setNodes] = useState<StoryNode[]>(script);
  const [idx, setIdx] = useState(0);
  // flags 用 ref 保存：branch 节点在同一次渲染里就要读到最新值，state 会慢一拍
  const flagsRef = useRef<StoryFlags>({});
  const [titleCard, setTitleCard] = useState<{ title: string; subtitle: string } | null>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);

  const node = nodes[idx];

  const advance = () => setIdx(i => i + 1);

  const spliceAfter = (extra: StoryNode[]) => {
    if (!extra.length) return;
    setNodes(prev => [...prev.slice(0, idx + 1), ...extra, ...prev.slice(idx + 1)]);
  };

  const applyFlags = (list?: string[]) => {
    if (!list?.length) return;
    const next = { ...flagsRef.current };
    list.forEach(f => { next[f] = true; });
    flagsRef.current = next;
  };

  // ---------- 非展示型节点（切景 / 增益 / 条件插播）自动处理并跳过 ----------
  useEffect(() => {
    if (!node) { onFinish(flagsRef.current); return; }

    if (node.type === 'scene') {
      onSceneChange(node.scene);
      const title = en ? node.titleEn : node.titleZh;
      if (title) {
        setTitleCard({
          title,
          subtitle: (en ? node.subtitleEn : node.subtitleZh) || ''
        });
        const t = setTimeout(() => { setTitleCard(null); advance(); }, 2400);
        return () => clearTimeout(t);
      }
      advance();
    } else if (node.type === 'effect') {
      onEffects(node.effects);
      advance();
    } else if (node.type === 'branch') {
      const has = !!flagsRef.current[node.ifFlag];
      if (node.not ? !has : has) spliceAfter(node.then);
      advance();
    }
  }, [idx, nodes]);

  // ---------- 打字机 ----------
  const displayText = useMemo(() => {
    if (!node) return { main: '', sub: '', speaker: '' };
    if (node.type === 'narration') return { main: en ? node.en : node.zh, sub: '', speaker: '' };
    if (node.type === 'speech') {
      return {
        main: node.jp || (en ? node.en : node.zh),
        sub: node.jp ? (en ? node.en : node.zh) : '',
        speaker: en ? node.speakerEn : node.speakerZh
      };
    }
    return { main: '', sub: '', speaker: '' };
  }, [node, en]);

  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!displayText.main) { setTyped(''); setTyping(false); return; }
    setTyped('');
    setTyping(true);
    let pos = 0;
    const full = displayText.main;
    const timer = setInterval(() => {
      if (pos >= full.length) { clearInterval(timer); setTyping(false); return; }
      pos++;
      setTyped(full.substring(0, pos));
      audioManager.playTypeBlip();
    }, TYPE_SPEED_MS);
    return () => clearInterval(timer);
  }, [displayText.main]);

  const handleTextClick = () => {
    if (window.getSelection()?.toString().trim()) return;
    if (typing) { setTyped(displayText.main); setTyping(false); return; }
    audioManager.playSfx('page');
    advance();
  };

  // ---------- 选项 ----------
  const meetsRequirement = (opt: StoryOption) =>
    !opt.requires || (stats[opt.requires.stat] || 0) >= opt.requires.min;

  const pickOption = (opt: StoryOption) => {
    if (!meetsRequirement(opt)) { audioManager.playSfx('error'); return; }
    audioManager.playSfx('confirm');
    applyFlags(opt.setFlags);
    if (opt.effects?.length) onEffects(opt.effects);
    spliceAfter(opt.then);
    advance();
  };

  // ---------- 便利店 ----------
  const [cart, setCart] = useState<string[]>([]);
  const shopItems = node?.type === 'shop' ? node.items : [];
  const budget = node?.type === 'shop' ? node.budget : 0;
  const spent = cart.reduce((sum, id) => sum + (shopItems.find(i => i.id === id)?.price || 0), 0);
  const remaining = budget - spent;

  const toggleItem = (item: ShopItem) => {
    if (cart.includes(item.id)) {
      audioManager.playSfx('click');
      setCart(c => c.filter(id => id !== item.id));
      return;
    }
    if (item.price > remaining) { audioManager.playSfx('error'); return; }
    audioManager.playSfx('collect');
    setCart(c => [...c, item.id]);
  };

  const checkout = () => {
    audioManager.playSfx('confirm');
    const picked = shopItems.filter(i => cart.includes(i.id));
    const allFlags: string[] = [];
    const allEffects: StoryEffect[] = [];
    picked.forEach(i => {
      if (i.setFlags) allFlags.push(...i.setFlags);
      if (i.effects) allEffects.push(...i.effects);
    });
    applyFlags(allFlags);
    if (allEffects.length) onEffects(allEffects);
    setCart([]);
    advance();
  };

  const skipPrologue = () => {
    audioManager.playSfx('confirm');
    onFinish(flagsRef.current);
  };

  // ==========================================================
  return (
    <div className="min-h-[100dvh] relative overflow-hidden font-sans select-none flex flex-col">
      {background}

      {/* 跳过序章（重玩的人不该被剧情困住） */}
      <button
        onClick={() => setConfirmSkip(true)}
        className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-yellow-400 hover:text-black text-white/70 border border-white/25 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all backdrop-blur-sm"
      >
        {en ? 'Skip ▶▶' : '跳过序章 ▶▶'}
      </button>

      {/* 场景标题卡 */}
      {titleCard && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="inline-block bg-black/80 backdrop-blur-md border-l-8 border-red-600 px-10 md:px-16 py-5 md:py-7 shadow-2xl transform -skew-x-6">
              <h2 className="text-2xl md:text-5xl font-black italic text-white tracking-tight transform skew-x-6">
                {titleCard.title}
              </h2>
              {titleCard.subtitle && (
                <p className="mt-2 text-xs md:text-base text-yellow-400 font-bold tracking-[0.2em] transform skew-x-6">
                  {titleCard.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 正文区 */}
      <div className="relative z-30 flex-1 flex flex-col justify-end pb-6 md:pb-10 px-3 md:px-8">

        {/* 旁白 / 台词 */}
        {(node?.type === 'narration' || node?.type === 'speech') && (
          <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            {node.type === 'narration' ? (
              <div
                className="bg-slate-900/70 backdrop-blur-sm border border-blue-400/25 rounded-lg p-5 md:p-8 shadow-2xl cursor-pointer select-text"
                onClick={handleTextClick}
              >
                <p className="text-base md:text-2xl text-blue-50/90 font-medium italic tracking-wide leading-relaxed">
                  {typed}
                </p>
                {!typing && (
                  <div className="text-right text-yellow-400 text-xl md:text-2xl animate-bounce mt-1">▼</div>
                )}
              </div>
            ) : (
              <div
                className="relative bg-black/88 backdrop-blur-2xl border-t-4 border-white/10 p-6 md:p-10 pt-9 md:pt-12 shadow-2xl rounded-t-xl cursor-pointer select-text"
                onClick={handleTextClick}
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 ${node.color || 'bg-yellow-500'}`} />
                <div className={`absolute -top-6 md:-top-8 left-6 md:left-10 px-7 md:px-10 py-1.5 ${node.color || 'bg-yellow-500'} text-white font-black italic text-base md:text-xl shadow-2xl transform -skew-x-12 border-2 border-white/20 pointer-events-none`}>
                  <span className="block transform skew-x-12">{displayText.speaker}</span>
                </div>

                <p className="text-lg md:text-3xl text-white font-bold leading-[1.7] tracking-wide" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.9)' }}>
                  {typed}
                </p>

                {/* 日语原文下方的译文：本作是日语学习游戏，原文永远在上 */}
                {displayText.sub && !typing && (
                  <p className="mt-4 pt-3 border-t border-white/10 text-sm md:text-lg text-yellow-100/70 leading-relaxed animate-in fade-in duration-500">
                    {displayText.sub}
                  </p>
                )}

                {!typing && (
                  <div className="absolute right-6 bottom-4 animate-bounce text-yellow-400 text-2xl md:text-3xl pointer-events-none">▼</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 选项 */}
        {node?.type === 'choice' && (
          <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="text-center mb-5">
              <span className="inline-block bg-black/80 backdrop-blur-sm border border-white/20 text-blue-100/90 italic text-sm md:text-lg px-6 py-2 rounded-full">
                {en ? node.promptEn : node.promptZh}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {node.options.map(opt => {
                const ok = meetsRequirement(opt);
                const reqMeta = opt.requires ? STAT_METADATA[opt.requires.stat] : null;
                return (
                  <button
                    key={opt.id}
                    onClick={() => pickOption(opt)}
                    disabled={!ok}
                    className={`group relative w-full text-left px-5 md:px-8 py-4 md:py-5 border-2 transform -skew-x-6 transition-all duration-200 backdrop-blur-md shadow-[6px_6px_0px_rgba(0,0,0,0.5)]
                      ${ok
                        ? 'bg-black/85 border-white/30 hover:bg-yellow-400 hover:border-black hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
                        : 'bg-black/60 border-white/10 opacity-45 cursor-not-allowed'}`}
                  >
                    <div className="transform skew-x-6">
                      <div className={`text-base md:text-xl font-black tracking-wide ${ok ? 'text-white group-hover:text-black' : 'text-white/50'}`}>
                        {en ? opt.labelEn : opt.labelZh}
                      </div>
                      {(en ? opt.hintEn : opt.hintZh) && (
                        <div className={`mt-1 text-[11px] md:text-sm italic ${ok ? 'text-blue-200/60 group-hover:text-black/70' : 'text-white/30'}`}>
                          {en ? opt.hintEn : opt.hintZh}
                        </div>
                      )}
                      {opt.requires && reqMeta && (
                        <div
                          className="mt-2 inline-flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                          style={{
                            color: ok ? reqMeta.color : '#f87171',
                            borderColor: ok ? `${reqMeta.color}66` : '#f8717166'
                          }}
                        >
                          {ok ? '🔓' : '🔒'}
                          {(en ? reqMeta.nameEn : reqMeta.nameZh.split(' ')[0])} {opt.requires.min}
                          <span className="opacity-60">
                            ({stats[opt.requires.stat] || 0}/{opt.requires.min})
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 便利店：预算内自由挑选 */}
        {node?.type === 'shop' && (
          <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="bg-black/85 backdrop-blur-xl border-2 border-white/20 shadow-2xl p-4 md:p-6 max-h-[78dvh] overflow-y-auto">

              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-white/10">
                <p className="text-sm md:text-lg text-blue-100/90 italic">
                  {en ? node.promptEn : node.promptZh}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] md:text-xs text-white/50 font-black uppercase tracking-widest">
                    {en ? 'Wallet' : '钱包'}
                  </span>
                  <span className={`text-xl md:text-3xl font-black italic tabular-nums ${remaining < 200 ? 'text-red-400' : 'text-yellow-400'}`}>
                    ¥{remaining}
                  </span>
                  <span className="text-[10px] md:text-xs text-white/30">/ ¥{budget}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {shopItems.map(item => {
                  const picked = cart.includes(item.id);
                  const tooExpensive = !picked && item.price > remaining;
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      disabled={tooExpensive}
                      className={`group relative text-left p-3 md:p-4 border-2 transition-all duration-200 overflow-hidden flex gap-3 md:gap-4 items-center
                        ${picked
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-300 border-yellow-200 text-black shadow-[0_0_25px_rgba(250,204,21,0.45)] scale-[1.01]'
                          : tooExpensive
                            ? 'bg-black/50 border-white/10 opacity-35 cursor-not-allowed'
                            : 'bg-zinc-900/90 border-white/15 hover:border-yellow-400/80 hover:bg-zinc-800/90 hover:shadow-lg cursor-pointer'}`}
                    >
                      {/* 商品立绘 / 图标 */}
                      <div className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border ${picked ? 'border-black/30 bg-black/10' : 'border-white/20 bg-black/40'} flex items-center justify-center`}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.nameZh}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-3xl md:text-4xl select-none absolute" style={{ zIndex: 0 }}>
                          {item.emoji}
                        </span>
                      </div>

                      {/* 商品信息 */}
                      <div className="flex-1 min-w-0 z-10">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className={`font-black text-sm md:text-lg truncate ${picked ? 'text-black' : 'text-white'}`}>
                            {item.nameJp}
                          </span>
                          <span className={`font-black text-sm md:text-base tabular-nums shrink-0 px-2 py-0.5 rounded ${picked ? 'bg-black text-yellow-400' : 'bg-red-600/90 text-white'}`}>
                            ¥{item.price}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[11px] md:text-sm font-bold ${picked ? 'text-black/80' : 'text-white/70'}`}>
                            {en ? item.nameEn : item.nameZh}
                          </span>
                          {/* 属性增益徽章 */}
                          {item.effects && item.effects.length > 0 && (
                            <span className={`text-[9px] md:text-[10px] font-black px-1.5 py-0.2 rounded uppercase ${picked ? 'bg-black/80 text-yellow-300' : 'bg-yellow-400 text-black'}`}>
                              +{item.effects[0].amount} {STAT_METADATA[item.effects[0].stat]?.nameZh.split(' ')[0] || item.effects[0].stat}
                            </span>
                          )}
                        </div>

                        <div className={`mt-1 text-[10px] md:text-xs leading-snug line-clamp-2 ${picked ? 'text-black/70' : 'text-white/40'}`}>
                          {en ? item.descEn : item.descZh}
                        </div>
                      </div>

                      {/* 选中指示标记 */}
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-sm md:text-base border-2 transition-all ${picked ? 'bg-black text-yellow-400 border-black' : 'bg-transparent text-white/30 border-white/20 group-hover:border-yellow-400 group-hover:text-yellow-400'}`}>
                        {picked ? '✓' : '＋'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t-2 border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] md:text-sm text-white/50">
                  {cart.length === 0
                    ? (en ? 'Basket empty — you can also leave with nothing.' : '篮子是空的——你也可以什么都不买就走。')
                    : `${en ? 'In basket' : '篮子里'}: ${cart.length} ${en ? 'items' : '件'} · ¥${spent}`}
                </div>
                <button
                  onClick={checkout}
                  className="bg-red-600 hover:bg-yellow-400 hover:text-black text-white border-2 border-black px-8 md:px-12 py-2.5 md:py-3 font-black italic text-base md:text-xl tracking-widest transform -skew-x-12 shadow-[6px_6px_0px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-none transition-all"
                >
                  <span className="block transform skew-x-12">
                    {cart.length === 0 ? (en ? 'LEAVE' : '空手出去') : (en ? 'CHECK OUT' : 'お会計')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 跳过确认 */}
      {confirmSkip && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-black border-4 border-white p-8 md:p-12 max-w-lg shadow-[12px_12px_0px_rgba(215,38,56,1)] transform -skew-x-2">
            <div className="transform skew-x-2">
              <h3 className="text-2xl md:text-3xl font-black italic text-white mb-3">
                {en ? 'Skip the prologue?' : '跳过序章？'}
              </h3>
              <p className="text-sm md:text-base text-white/60 mb-8 leading-relaxed">
                {en
                  ? 'You will go straight to the lobby. Stats and choices from the part you have not played will not be counted.'
                  : '将直接进入大厅。没看到的部分不会计入任何属性与选择结果。'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={skipPrologue}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white border-2 border-black py-3 font-black italic tracking-widest transform -skew-x-12 shadow-[5px_5px_0px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-none transition-all"
                >
                  <span className="block transform skew-x-12">{en ? 'SKIP' : '跳过'}</span>
                </button>
                <button
                  onClick={() => setConfirmSkip(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-white/30 py-3 font-black italic tracking-widest transform -skew-x-12 transition-all"
                >
                  <span className="block transform skew-x-12">{en ? 'BACK' : '继续看'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryScreen;
