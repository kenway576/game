import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  StoryNode, StoryOption, StoryEffect, StoryRelationEffect, StoryWord,
  ShopItem, StoryFlags, Language, ProtagonistStats, StoryProgress
} from '../types';
import { STAT_METADATA } from '../constants';
import { audioManager } from '../services/audioManager';

// StoryScreen 恢复出来的那份"已经拿到手的东西"，由 App 一次性灌回全局状态
export interface StoryRestorePayload {
  stats: ProtagonistStats;
  words: StoryWord[];
  relations: StoryRelationEffect[];
  unlockedCgs: string[];
}

interface Props {
  script: StoryNode[];
  scriptVersion: string;
  progressKey: string;
  language: Language;
  stats: ProtagonistStats;
  background: React.ReactNode;
  // 读档进来的那一份进度：直接静默恢复，不再弹"要不要接着看"
  // （玩家在存档界面已经做过一次选择了，不该再问一遍）
  initialProgress?: StoryProgress | null;
  // 打开系统菜单（存档 / 读档 / 单词本 / 音量）。序章期间也要能存盘。
  onOpenSystemMenu: () => void;
  // 属性增益上抛给 App：由 App 统一改数值并弹 StatGainToast
  onEffects: (effects: StoryEffect[]) => void;
  // 関係（親密度/好感度）变动同样上抛
  onRelations: (relations: StoryRelationEffect[]) => void;
  onSceneChange: (scene: string) => void;
  // 台词里挂的生词进单词本（App 侧去重）
  onCollectWords: (words: StoryWord[]) => void;
  onUnlockCg: (cgId: string) => void;
  // 续玩：把上次的属性/生词/关系一次性还原
  onRestore: (payload: StoryRestorePayload) => void;
  // 序章播完（或跳过）时把最终 flags 交回去存档
  onFinish: (flags: StoryFlags, opts: { skipped: boolean }) => void;
}

// ---------- 阅读偏好（打字速度 / 自动播放间隔），本地记住 ----------
const PREFS_KEY = 'kobe_story_prefs_v1';

const SPEED_OPTIONS = [
  { id: 'slow',    ms: 42, labelZh: '慢',   labelEn: 'Slow' },
  { id: 'normal',  ms: 24, labelZh: '标准', labelEn: 'Normal' },
  { id: 'fast',    ms: 11, labelZh: '快',   labelEn: 'Fast' },
  { id: 'instant', ms: 0,  labelZh: '瞬间', labelEn: 'Instant' }
] as const;

const AUTO_OPTIONS = [
  { id: 'relaxed', ms: 2200, labelZh: '慢', labelEn: 'Relaxed' },
  { id: 'normal',  ms: 1400, labelZh: '标准', labelEn: 'Normal' },
  { id: 'brisk',   ms: 700,  labelZh: '快', labelEn: 'Brisk' }
] as const;

interface StoryPrefs { speedMs: number; autoMs: number; }
const DEFAULT_PREFS: StoryPrefs = { speedMs: 24, autoMs: 1400 };

const loadPrefs = (): StoryPrefs => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw);
    return {
      speedMs: typeof p.speedMs === 'number' ? p.speedMs : DEFAULT_PREFS.speedMs,
      autoMs: typeof p.autoMs === 'number' ? p.autoMs : DEFAULT_PREFS.autoMs
    };
  } catch { return DEFAULT_PREFS; }
};

interface BacklogEntry { speaker: string; main: string; sub: string; }

const StoryScreen: React.FC<Props> = ({
  script, scriptVersion, progressKey, language, stats, background,
  initialProgress, onOpenSystemMenu,
  onEffects, onRelations, onSceneChange, onCollectWords, onUnlockCg, onRestore, onFinish
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

  // ---------- 已经拿到手的东西（中途存档要一起带走） ----------
  const wordsRef = useRef<StoryWord[]>([]);
  const relationsRef = useRef<StoryRelationEffect[]>([]);
  const cgsRef = useRef<string[]>([]);
  const appliedEffectIdxRef = useRef<Set<number>>(new Set());
  // random 节点同样只能抽一次：StrictMode 下这个 effect 会跑两遍
  const pickedRandomIdxRef = useRef<Set<number>>(new Set());
  const statsRef = useRef<ProtagonistStats>(stats);
  statsRef.current = stats;

  // ---------- 播放控制 ----------
  const [prefs, setPrefs] = useState<StoryPrefs>(loadPrefs);
  const [showPrefs, setShowPrefs] = useState(false);
  const [auto, setAuto] = useState(false);
  const [fastForward, setFastForward] = useState(false);
  const [backlog, setBacklog] = useState<BacklogEntry[]>([]);
  const [showBacklog, setShowBacklog] = useState(false);
  const [wordToast, setWordToast] = useState<{ count: number; key: number } | null>(null);
  // 当前站在台上的立绘。跨节点保持，直到有节点明确换人 / 让人下场 / 换景，
  // 否则一遇到旁白就闪没，一段对话下来立绘会一闪一闪。
  const [activeSprite, setActiveSprite] = useState<string | null>(null);

  // ---------- 续玩 ----------
  const [restoreOffer, setRestoreOffer] = useState<StoryProgress | null>(null);
  const [restoreChecked, setRestoreChecked] = useState(false);
  const finishedRef = useRef(false);

  const node = nodes[idx];
  const isDisplayNode = node?.type === 'narration' || node?.type === 'speech';
  const isBlockingNode = node?.type === 'choice' || node?.type === 'shop' || node?.type === 'cg';

  const advance = useCallback(() => setIdx(i => i + 1), []);

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

  const applyRelations = (list?: StoryRelationEffect[]) => {
    if (!list?.length) return;
    relationsRef.current = [...relationsRef.current, ...list];
    onRelations(list);
  };

  // 一份进度落到界面上：续玩弹窗和读档静默恢复共用同一段逻辑
  const applyProgress = (p: StoryProgress) => {
    flagsRef.current = p.flags || {};
    wordsRef.current = p.words || [];
    relationsRef.current = p.relations || [];
    cgsRef.current = p.unlockedCgs || [];
    setNodes(p.nodes);
    setIdx(p.idx);
    // 续玩点通常落在 scene 节点之后，那一节的换景/换曲不会再触发。
    // 往回找最近的一个 scene 补上，否则会出现"人在三宫站台、背景还在电车里"。
    // 顺便把台上的立绘也找回来（同样只在本场景内回溯）
    let sprite: string | null = null;
    let spriteFound = false;
    for (let i = Math.min(p.idx, p.nodes.length) - 1; i >= 0; i--) {
      const n = p.nodes[i];
      if (n.type === 'scene') {
        onSceneChange(n.scene);
        if (n.bgm) audioManager.crossfadeBgm(n.bgm, 600);
        break;
      }
      if (!spriteFound && (n.type === 'speech' || n.type === 'narration') && n.characterImage !== undefined) {
        sprite = n.characterImage || null;
        spriteFound = true;
      }
    }
    setActiveSprite(sprite);
    onRestore({
      stats: p.stats,
      words: p.words || [],
      relations: p.relations || [],
      unlockedCgs: p.unlockedCgs || []
    });
  };

  const isUsable = (p: StoryProgress | null | undefined): p is StoryProgress =>
    !!p && p.version === scriptVersion && Array.isArray(p.nodes) && p.idx > 0 && p.idx < p.nodes.length;

  // ==========================================================
  // 进场：读档带进度就直接接上；否则看 localStorage 里有没有半截进度
  // ==========================================================
  useEffect(() => {
    // 从存档槽进来的：玩家在存档界面已经选过了，不再问第二次
    if (isUsable(initialProgress)) {
      applyProgress(initialProgress);
      setRestoreChecked(true);
      return;
    }
    try {
      const raw = localStorage.getItem(progressKey);
      if (raw) {
        const p = JSON.parse(raw) as StoryProgress;
        // 剧本改过之后旧进度会错位到别人的台词上，宁可丢弃也不能错播
        if (isUsable(p)) {
          setRestoreOffer(p);
        } else {
          localStorage.removeItem(progressKey);
        }
      }
    } catch { /* 读不出来就当没有 */ }
    setRestoreChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptRestore = () => {
    const p = restoreOffer;
    if (!p) return;
    audioManager.playSfx('confirm');
    applyProgress(p);
    setRestoreOffer(null);
  };

  const declineRestore = () => {
    audioManager.playSfx('click');
    try { localStorage.removeItem(progressKey); } catch { /* ignore */ }
    setRestoreOffer(null);
  };

  // 每前进一步就把进度落盘：关掉页面回来能接着看，不用重播 100 段文本
  useEffect(() => {
    if (!restoreChecked || restoreOffer || finishedRef.current) return;
    if (idx <= 0) return;
    const progress: StoryProgress = {
      version: scriptVersion,
      idx,
      nodes,
      flags: flagsRef.current,
      stats: statsRef.current,
      words: wordsRef.current,
      relations: relationsRef.current,
      unlockedCgs: cgsRef.current,
      savedAt: Date.now()
    };
    try {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } catch {
      // 容量不够就不存中途进度，不影响继续玩
    }
  }, [idx, nodes, restoreChecked, restoreOffer, progressKey, scriptVersion]);

  const clearProgress = () => {
    try { localStorage.removeItem(progressKey); } catch { /* ignore */ }
  };

  const finish = (skipped: boolean) => {
    finishedRef.current = true;
    clearProgress();
    onFinish(flagsRef.current, { skipped });
  };

  // ==========================================================
  // 非展示型节点（切景 / 增益 / 条件插播）自动处理并跳过
  // ==========================================================
  useEffect(() => {
    if (restoreOffer || !restoreChecked) return;
    if (!node) { if (!finishedRef.current) finish(false); return; }

    if (node.type === 'scene') {
      onSceneChange(node.scene);
      setActiveSprite(null); // 换景 = 清台
      // 分场景 BGM：整段序章共用一首大厅曲，列车、便利店和开学前夜就全是一个温度
      if (node.bgm) audioManager.crossfadeBgm(node.bgm, 900);
      const title = en ? node.titleEn : node.titleZh;
      if (title && !fastForward) {
        setTitleCard({
          title,
          subtitle: (en ? node.subtitleEn : node.subtitleZh) || ''
        });
        const t = setTimeout(() => { setTitleCard(null); advance(); }, 2400);
        return () => clearTimeout(t);
      }
      setTitleCard(null);
      advance();
    } else if (node.type === 'effect') {
      // StrictMode 下 effect 会跑两遍，属性/关系不能给两次
      if (!appliedEffectIdxRef.current.has(idx)) {
        appliedEffectIdxRef.current.add(idx);
        if (node.effects?.length) onEffects(node.effects);
        applyRelations(node.relations);
        // 剧情自己置的 flag（不经过选项）：擦肩而过这类没有选择的桥段要靠它留痕
        applyFlags(node.setFlags);
      }
      advance();
    } else if (node.type === 'branch') {
      const has = !!flagsRef.current[node.ifFlag];
      if (node.not ? !has : has) spliceAfter(node.then);
      advance();
    } else if (node.type === 'random') {
      // 抽中的那一组就地拼进 nodes，于是它会跟着进度一起存盘 ——
      // 读档回来播的还是同一段，不会每次刷新换一个人
      if (!pickedRandomIdxRef.current.has(idx)) {
        pickedRandomIdxRef.current.add(idx);
        const pool = node.pick.filter(b => b?.length);
        if (pool.length) spliceAfter(pool[Math.floor(Math.random() * pool.length)]);
      }
      advance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, nodes, restoreOffer, restoreChecked]);

  // ---------- 立绘上下场 ----------
  useEffect(() => {
    if (!node) return;
    if (node.type !== 'speech' && node.type !== 'narration') return;
    if (node.characterImage === undefined) return;   // 没写就保持不变
    setActiveSprite(node.characterImage || null);    // 空串 = 退场
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, nodes]);

  // ---------- 生词：台词展示时自动进单词本 ----------
  useEffect(() => {
    if (!node || (node.type !== 'narration' && node.type !== 'speech')) return;
    const words = node.words;
    if (!words?.length) return;
    const known = new Set(wordsRef.current.map(w => w.jp));
    const fresh = words.filter(w => !known.has(w.jp));
    if (!fresh.length) return;
    wordsRef.current = [...wordsRef.current, ...fresh];
    onCollectWords(fresh);
    setWordToast({ count: fresh.length, key: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, nodes]);

  useEffect(() => {
    if (!wordToast) return;
    const t = setTimeout(() => setWordToast(null), 2200);
    return () => clearTimeout(t);
  }, [wordToast]);

  // ---------- CG：播到就永久解锁进回忆图鉴 ----------
  useEffect(() => {
    if (node?.type !== 'cg') return;
    if (cgsRef.current.includes(node.cgId)) return;
    cgsRef.current = [...cgsRef.current, node.cgId];
    onUnlockCg(node.cgId);
    audioManager.playSfx('collect');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // 瞬间显示 / 快进时不走逐字，直接铺满
    if (prefs.speedMs <= 0 || fastForward) {
      setTyped(displayText.main);
      setTyping(false);
      return;
    }
    setTyped('');
    setTyping(true);
    let pos = 0;
    const full = displayText.main;
    const timer = setInterval(() => {
      if (pos >= full.length) { clearInterval(timer); setTyping(false); return; }
      pos++;
      setTyped(full.substring(0, pos));
      audioManager.playTypeBlip();
    }, prefs.speedMs);
    return () => clearInterval(timer);
  }, [displayText.main, prefs.speedMs, fastForward]);

  // ---------- 回想（Backlog）：读过的每一句都留下 ----------
  useEffect(() => {
    if (!displayText.main) return;
    setBacklog(prev => {
      const last = prev[prev.length - 1];
      if (last && last.main === displayText.main && last.speaker === displayText.speaker) return prev;
      return [...prev, { speaker: displayText.speaker, main: displayText.main, sub: displayText.sub }];
    });
  }, [displayText.main, displayText.speaker, displayText.sub]);

  // ---------- 自动播放 ----------
  useEffect(() => {
    if (!auto || typing || !isDisplayNode || showBacklog || showPrefs || confirmSkip) return;
    // 长句多给一点时间：按字数线性加权
    const dwell = prefs.autoMs + Math.min(2600, displayText.main.length * 34);
    const t = setTimeout(() => advance(), dwell);
    return () => clearTimeout(t);
  }, [auto, typing, isDisplayNode, idx, nodes, prefs.autoMs, displayText.main, showBacklog, showPrefs, confirmSkip, advance]);

  // 选项 / 商店 / CG 面前自动播放必须停下，否则会替玩家做决定
  useEffect(() => {
    if (auto && isBlockingNode) setAuto(false);
  }, [auto, isBlockingNode]);

  // ---------- 快进到下一个选择 ----------
  useEffect(() => {
    if (!fastForward) return;
    if (!node || isBlockingNode) { setFastForward(false); return; }
    if (!isDisplayNode) return; // 非展示节点由上面那个 effect 自己推进
    const t = setTimeout(advance, 14);
    return () => clearTimeout(t);
  }, [fastForward, idx, nodes, node, isBlockingNode, isDisplayNode, advance]);

  const handleTextClick = () => {
    if (window.getSelection()?.toString().trim()) return;
    if (fastForward) { setFastForward(false); return; }
    if (auto) { setAuto(false); return; }
    if (typing) { setTyped(displayText.main); setTyping(false); return; }
    audioManager.playSfx('page');
    advance();
  };

  // ---------- 键盘 ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (restoreOffer) return;
      if (e.key === 'Escape') {
        if (showBacklog) { setShowBacklog(false); return; }
        if (showPrefs) { setShowPrefs(false); return; }
        if (confirmSkip) { setConfirmSkip(false); return; }
        return;
      }
      if (showBacklog || showPrefs || confirmSkip) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (isDisplayNode) { e.preventDefault(); handleTextClick(); }
      } else if (e.key === 'a' || e.key === 'A') {
        setAuto(v => !v);
      } else if (e.key === 'l' || e.key === 'L') {
        setShowBacklog(true);
      } else if (e.key === 'Control') {
        if (!isBlockingNode) setFastForward(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---------- 选项 ----------
  const meetsRequirement = (opt: StoryOption) =>
    !opt.requires || (stats[opt.requires.stat] || 0) >= opt.requires.min;

  const pickOption = (opt: StoryOption) => {
    if (!meetsRequirement(opt)) { audioManager.playSfx('error'); return; }
    audioManager.playSfx('confirm');
    applyFlags(opt.setFlags);
    if (opt.effects?.length) onEffects(opt.effects);
    applyRelations(opt.relations);
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
    const allRelations: StoryRelationEffect[] = [];
    picked.forEach(i => {
      if (i.setFlags) allFlags.push(...i.setFlags);
      if (i.effects) allEffects.push(...i.effects);
      if (i.relations) allRelations.push(...i.relations);
    });
    // 买没买东西本身就是一次选择，后面的剧情要分叉
    if (node?.type === 'shop') {
      const shopFlags = picked.length ? node.setFlagsOnPurchase : node.setFlagsOnEmpty;
      if (shopFlags?.length) allFlags.push(...shopFlags);
    }
    applyFlags(allFlags);
    if (allEffects.length) onEffects(allEffects);
    applyRelations(allRelations);

    // 买过的东西的日语名进单词本：16 件商品本来就是 16 张现成的单词卡
    const known = new Set(wordsRef.current.map(w => w.jp));
    const fresh: StoryWord[] = picked
      .filter(i => !known.has(i.nameJp))
      .map(i => ({ jp: i.nameJp, zh: i.nameZh, en: i.nameEn }));
    if (fresh.length) {
      wordsRef.current = [...wordsRef.current, ...fresh];
      onCollectWords(fresh);
      setWordToast({ count: fresh.length, key: Date.now() });
    }

    setCart([]);
    advance();
  };

  const skipPrologue = () => {
    audioManager.playSfx('confirm');
    finish(true);
  };

  const progressPct = nodes.length ? Math.min(100, Math.round((idx / nodes.length) * 100)) : 0;
  const ctrlBtn = 'bg-black/70 hover:bg-yellow-400 hover:text-black text-white/70 border border-white/25 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all backdrop-blur-sm';
  const ctrlBtnOn = 'bg-yellow-400 text-black border border-black px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transform -skew-x-12 transition-all shadow-[0_0_18px_rgba(250,204,21,0.5)]';

  // ==========================================================
  return (
    <div className="min-h-[100dvh] relative overflow-hidden font-sans select-none flex flex-col">
      {background}

      {/* 进度条：序章有 100 多段，玩家有权知道还剩多少 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-yellow-200 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 播放控制条 */}
      <div className="absolute top-3 right-3 z-50 flex flex-wrap items-center justify-end gap-1.5 max-w-[92vw]">
        <button
          onClick={() => { audioManager.playSfx('click'); setFastForward(v => !v); }}
          disabled={isBlockingNode}
          className={`${fastForward ? ctrlBtnOn : ctrlBtn} disabled:opacity-30`}
          title={en ? 'Fast-forward to the next choice' : '快进到下一个选择'}
        >
          <span className="block transform skew-x-12">{fastForward ? '⏩ ...' : (en ? '⏩ Fwd' : '⏩ 快进')}</span>
        </button>
        <button
          onClick={() => { audioManager.playSfx('click'); setAuto(v => !v); }}
          disabled={isBlockingNode}
          className={`${auto ? ctrlBtnOn : ctrlBtn} disabled:opacity-30`}
        >
          <span className="block transform skew-x-12">{en ? '▶ Auto' : '▶ 自动'}</span>
        </button>
        <button onClick={() => { audioManager.playSfx('click'); setShowBacklog(true); }} className={ctrlBtn}>
          <span className="block transform skew-x-12">{en ? '📜 Log' : '📜 回想'}</span>
        </button>
        <button onClick={() => { audioManager.playSfx('click'); setShowPrefs(true); }} className={ctrlBtn}>
          <span className="block transform skew-x-12">⚙</span>
        </button>
        {/* 序章也能存盘：序章有 100 多段，不给存档等于逼玩家一口气读完 */}
        <button
          onClick={() => { audioManager.playSfx('click'); onOpenSystemMenu(); }}
          className={ctrlBtn}
          title={en ? 'Menu — save, load, wordbook' : '菜单 — 存档 / 读档 / 单词本'}
        >
          <span className="block transform skew-x-12">{en ? '☰ Menu' : '☰ 菜单'}</span>
        </button>
        <button onClick={() => { audioManager.playSfx('click'); setConfirmSkip(true); }} className={ctrlBtn}>
          <span className="block transform skew-x-12">{en ? 'Skip ▶▶' : '跳过 ▶▶'}</span>
        </button>
      </div>

      {/* 生词入库提示 */}
      {wordToast && (
        <div key={wordToast.key} className="absolute top-16 right-3 z-50 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-emerald-500/90 text-black border-2 border-black px-4 py-1.5 text-xs font-black tracking-wider transform -skew-x-12 shadow-lg">
            <span className="block transform skew-x-12">
              📖 {en ? `${wordToast.count} word${wordToast.count > 1 ? 's' : ''} added` : `生词本 +${wordToast.count}`}
            </span>
          </div>
        </div>
      )}

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

      {/* 全屏 CG */}
      {node?.type === 'cg' && (
        <div
          className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center p-4 md:p-10 cursor-pointer animate-in fade-in duration-700"
          onClick={() => { audioManager.playSfx('page'); advance(); }}
        >
          <img
            src={node.imageUrl}
            alt={en ? node.titleEn : node.titleZh}
            className="max-w-full max-h-[72dvh] object-contain shadow-[0_0_80px_rgba(0,0,0,0.9)] border-2 border-white/15"
            onError={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.15'; }}
          />
          <div className="mt-5 w-full max-w-3xl text-center">
            <h3 className="text-xl md:text-3xl font-black italic text-yellow-400 tracking-wide">
              {en ? node.titleEn : node.titleZh}
            </h3>
            <p className="mt-2 text-sm md:text-base text-white/70 leading-relaxed">
              {en ? node.captionEn : node.captionZh}
            </p>
            <p className="mt-4 text-[10px] md:text-xs text-emerald-400 font-black uppercase tracking-[0.3em]">
              ✦ {en ? 'Added to the memory gallery' : '已收入回忆图鉴'}
            </p>
          </div>
        </div>
      )}

      {/* 角色立绘：和自由对话一样铺在画面正中、底端对齐，对话框压在它上面 */}
      {activeSprite && (
        <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none overflow-hidden">
          <img
            key={activeSprite}
            src={activeSprite}
            alt={displayText.speaker || ''}
            className="h-[58dvh] md:h-[78vh] max-h-[82dvh] w-auto object-contain object-bottom drop-shadow-[0_18px_36px_rgba(0,0,0,0.8)] filter brightness-105 animate-in fade-in slide-in-from-bottom-8 duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
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

                {/* 这句话里挂的生词（已自动进单词本，这里只是让玩家看见） */}
                {node.words?.length && !typing ? (
                  <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in duration-500">
                    {node.words.map(w => (
                      <span key={w.jp} className="inline-flex items-baseline gap-1.5 bg-emerald-500/15 border border-emerald-400/40 rounded px-2.5 py-1">
                        <span className="text-sm md:text-base font-bold text-emerald-200">{w.jp}</span>
                        {w.reading && <span className="text-[10px] text-emerald-300/60">{w.reading}</span>}
                        <span className="text-[11px] md:text-xs text-white/60">{en ? w.en : w.zh}</span>
                      </span>
                    ))}
                  </div>
                ) : null}

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
              {node.options
                .filter(opt => !opt.requiresFlag || flagsRef.current[opt.requiresFlag])
                .map(opt => {
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

      {/* 回想 / Backlog */}
      {showBacklog && (
        <div className="absolute inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-8 animate-in fade-in duration-200" onClick={() => setShowBacklog(false)}>
          <div className="w-full max-w-3xl max-h-[85dvh] bg-zinc-950/95 border-2 border-white/20 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-white/10 shrink-0">
              <h3 className="text-lg md:text-2xl font-black italic text-yellow-400 tracking-wide">
                {en ? '📜 BACKLOG' : '📜 回想'}
              </h3>
              <button onClick={() => setShowBacklog(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white font-bold transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 select-text">
              {backlog.length === 0 && (
                <p className="text-white/40 text-sm italic">{en ? 'Nothing read yet.' : '还没有读过的内容。'}</p>
              )}
              {backlog.map((b, i) => (
                <div key={i} className={`border-l-4 pl-3 py-1 ${b.speaker ? 'border-yellow-500/70' : 'border-blue-400/40'}`}>
                  {b.speaker && (
                    <div className="text-[11px] font-black uppercase tracking-widest text-yellow-400/90 mb-0.5">{b.speaker}</div>
                  )}
                  <p className={`text-sm md:text-base leading-relaxed ${b.speaker ? 'text-white/90 font-medium' : 'text-blue-50/70 italic'}`}>{b.main}</p>
                  {b.sub && <p className="mt-1 text-xs md:text-sm text-yellow-100/50">{b.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 阅读速度设置 */}
      {showPrefs && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowPrefs(false)}>
          <div className="bg-black border-4 border-white p-7 md:p-10 max-w-md w-full shadow-[12px_12px_0px_rgba(215,38,56,1)] transform -skew-x-2" onClick={e => e.stopPropagation()}>
            <div className="transform skew-x-2 flex flex-col gap-6">
              <h3 className="text-xl md:text-2xl font-black italic text-white">
                {en ? 'Reading speed' : '阅读设置'}
              </h3>

              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-2">
                  {en ? 'Text speed' : '文本速度'}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SPEED_OPTIONS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => {
                        const next = { ...prefs, speedMs: o.ms };
                        setPrefs(next);
                        try { localStorage.setItem(PREFS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
                        audioManager.playSfx('click');
                      }}
                      className={`py-2 text-xs font-black border-2 transition-all ${prefs.speedMs === o.ms ? 'bg-yellow-400 text-black border-black' : 'bg-zinc-900 text-white/70 border-white/25 hover:border-white'}`}
                    >
                      {en ? o.labelEn : o.labelZh}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-2">
                  {en ? 'Auto-play pace' : '自动播放节奏'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {AUTO_OPTIONS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => {
                        const next = { ...prefs, autoMs: o.ms };
                        setPrefs(next);
                        try { localStorage.setItem(PREFS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
                        audioManager.playSfx('click');
                      }}
                      className={`py-2 text-xs font-black border-2 transition-all ${prefs.autoMs === o.ms ? 'bg-yellow-400 text-black border-black' : 'bg-zinc-900 text-white/70 border-white/25 hover:border-white'}`}
                    >
                      {en ? o.labelEn : o.labelZh}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-white/40 leading-relaxed">
                {en
                  ? 'Space / Enter: advance · A: auto · L: backlog · Ctrl: fast-forward to the next choice'
                  : '空格 / 回车：继续 · A：自动播放 · L：回想 · Ctrl：快进到下一个选择'}
              </p>

              <button
                onClick={() => setShowPrefs(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-white/30 py-3 font-black italic tracking-widest transform -skew-x-12 transition-all"
              >
                <span className="block transform skew-x-12">{en ? 'CLOSE' : '关闭'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 续玩上次的进度 */}
      {restoreOffer && (
        <div className="absolute inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-black border-4 border-white p-8 md:p-12 max-w-lg shadow-[12px_12px_0px_rgba(56,189,248,1)] transform -skew-x-2">
            <div className="transform skew-x-2">
              <h3 className="text-2xl md:text-3xl font-black italic text-white mb-3">
                {en ? 'Continue the prologue?' : '继续上次的序章？'}
              </h3>
              <p className="text-sm md:text-base text-white/60 mb-2 leading-relaxed">
                {en
                  ? 'You stopped partway through last time. Your stats, vocabulary and choices from that run are all still there.'
                  : '上次读到一半就离开了。当时拿到的属性、生词与做过的选择都还在。'}
              </p>
              <p className="text-xs text-sky-300/80 mb-8 tabular-nums">
                {en ? 'Progress' : '进度'} {Math.round((restoreOffer.idx / Math.max(1, restoreOffer.nodes.length)) * 100)}%
                {' · '}
                {new Date(restoreOffer.savedAt).toLocaleString()}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={acceptRestore}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 text-black border-2 border-black py-3 font-black italic tracking-widest transform -skew-x-12 shadow-[5px_5px_0px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-none transition-all"
                >
                  <span className="block transform skew-x-12">{en ? 'CONTINUE' : '接着看'}</span>
                </button>
                <button
                  onClick={declineRestore}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-white/30 py-3 font-black italic tracking-widest transform -skew-x-12 transition-all"
                >
                  <span className="block transform skew-x-12">{en ? 'RESTART' : '从头开始'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 跳过确认 */}
      {confirmSkip && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-black border-4 border-white p-8 md:p-12 max-w-lg shadow-[12px_12px_0px_rgba(215,38,56,1)] transform -skew-x-2">
            <div className="transform skew-x-2">
              <h3 className="text-2xl md:text-3xl font-black italic text-white mb-3">
                {en ? 'Skip the prologue?' : '跳过序章？'}
              </h3>
              <p className="text-sm md:text-base text-white/60 mb-4 leading-relaxed">
                {en
                  ? 'You will go straight to the lobby. Stats, vocabulary and choices from the part you have not played will not be counted.'
                  : '将直接进入大厅。没看到的部分不会计入任何属性、生词与选择结果。'}
              </p>
              <p className="text-xs text-red-400/90 mb-8 leading-relaxed">
                {en
                  ? 'That includes the people you would have met: anyone you never ran into in the prologue starts the story not knowing you at all.'
                  : '这也包括序章里本该遇见的人——没碰上的角色，正篇开局时是真的不认识你。'}
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
