import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameMode, ChatMode, Character, UserState, N3GrammarTopic, CharacterId, Message, CustomAssets, QuizData, CollectedWord, AffectionMap, FamiliarityMap, MemoryMap, RelationshipAxis, ProtagonistStats, GameCalendar, StatGainEvent, StatKey, StoryEffect, StoryFlags, StoryRelationEffect, StoryWord, PrologueResult, StoryProgress, StoryNode } from './types';
import { resolvePrologueEncounter, buildPrologueBrief, PROLOGUE_INTRODUCIBLE_CHARS, didMeetInPrologue, findLevelStory, appendDay1Memories, getWeatherScene, weekdayFor } from './constants';
import { CHARACTERS, SCENE_MAP, CHARACTER_ROOMS, DEFAULT_SCENE, UI_TEXT, ALL_CHARACTER_IDS, VISIBLE_CHARACTER_IDS, createCharacterRecord, AFFECTION_MAX, AFFECTION_DELTA_SCALE, AFFECTION_LEVELS, FAMILIARITY_MAX, FAMILIARITY_DELTA_SCALE, FAMILIARITY_LEVELS, SAVE_SLOT_PREFIX, API_KEY_STORAGE_KEY, MODEL_STORAGE_KEY, CUSTOM_BASE_URL_STORAGE_KEY, CUSTOM_MODEL_NAME_STORAGE_KEY, CUSTOM_MODEL_VALUE, MAX_SLOTS, RECENT_HISTORY_COUNT, MEMORY_UPDATE_EVERY, SAVE_MESSAGES_LIMIT, SAVE_HISTORY_PER_CHAR, SAVE_MESSAGES_LIMIT_HARD, SAVE_HISTORY_PER_CHAR_HARD, getAffectionLevelIndex, getFamiliarityLevelIndex, getRomanceCeiling, getInitialFamiliarity, getSeedMemory, getRelationshipProfile, isEmotionUnlocked, rollFateDice, QUIZ_CORRECT_LUCK_LEVELS, QUIZ_CORRECT_AFFECTION_BONUS, QUIZ_CORRECT_FAMILIARITY_BONUS, getDiceAffectionFloor, getDiceFamiliarityFloor, EMOTION_SYNONYMS, WARDROBE, detectOutfitRequest, getUnlockedOutfits, getUnlockedScenes, OUTFIT_UNLOCKS, SCENE_UNLOCKS_BY_LEVEL, FAMILIARITY_GATED_OUTFIT_LEVELS, ROMANCE_GATED_OUTFIT_LEVELS, INITIAL_PROTAGONIST_STATS, INITIAL_CALENDAR_STATE, SCENE_FALLBACK } from './constants';
import { startChat, sendMessage, translateText, summarizeMemory, buildOpeningBrief } from './services/geminiService';
import { audioManager, handleUiClickSfx } from './services/audioManager';
import type { DialoguePage } from './types';
import type { LevelStoryDef } from './constants';
import Background from './components/Background';
import SetupScreen from './components/SetupScreen';
import LobbyScreen from './components/LobbyScreen';
import ChatScreen, { AffectionToast } from './components/ChatScreen';
import SystemMenu from './components/SystemMenu';
import WordbookModal from './components/WordbookModal';
import HistoryLogModal from './components/HistoryLogModal';
import SaveLoadScreen from './components/SaveLoadScreen';
import CgGalleryModal from './components/CgGalleryModal';
import { ProtagonistProfileModal } from './components/ProtagonistProfileModal';
import { CalendarModal } from './components/CalendarModal';
import InventoryScreen from './components/InventoryScreen';
import { StatGainToast } from './components/StatGainToast';
import StoryScreen, { StoryRestorePayload } from './components/StoryScreen';
import PrologueResultScreen from './components/PrologueResultScreen';
import ConsentGate from './components/ConsentGate';
import RoomScreen from './components/RoomScreen';
import MapScreen from './components/MapScreen';
import StoreScreen, { StoreKind } from './components/StoreScreen';
import GardenScreen from './components/GardenScreen';
import FishingScreen from './components/FishingScreen';
import FishDexModal from './components/FishDexModal';
import KitchenScreen from './components/KitchenScreen';
import { PROLOGUE_SCRIPT } from './story/prologueData';
import { pickEventFor, buildAmbientScript, getTimeCost, AFTERSCHOOL_SLOTS, slotsLeftToday } from './story/mapEvents';
import { INITIAL_LIFE_STATE, dayIndex, plantStage, findSeed, FISHING_SPOTS, MAX_FISH_PER_DAY, BAIT_ITEM } from './data/lifeData';
import { consumeFor } from './data/cookData';
import type { LifeState, FishDef, RecipeDef } from './types';
import type { MapLocation, MapEventDef } from './types';
import { DAY1_SCRIPT } from './story/day1Data';
import { DAY1_VERSION, DAY1_PROGRESS_KEY } from './story/day1Meta';
import { PROLOGUE_SCRIPT_VERSION, PROLOGUE_PROGRESS_KEY } from './story/prologueMeta';

const App: React.FC = () => {
  // ---------- 全局游戏状态 ----------
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.SETUP);
  const [setupStep, setSetupStep] = useState<'MENU' | 'NEW_GAME'>('MENU');

  const [userState, setUserState] = useState<UserState>({
    learningGoal: '',
    grammarTopic: N3GrammarTopic.GENERAL,
    playerName: 'Gakusei',
    email: '',
    collectedWords: [],
    language: 'zh'
  });

  // 角色相关状态一律由 CHARACTERS 配置表派生，增删角色无需改这里
  const [customAssets, setCustomAssets] = useState<CustomAssets>({
    backgroundImage: null,
    characters: createCharacterRecord(() => null as string | null)
  });
  const [chatHistories, setChatHistories] = useState<Record<CharacterId, Message[]>>(
    createCharacterRecord(() => [] as Message[])
  );
  // 💗 好感度（恋爱线）：全员从 0 开始，没有例外
  const [affectionMap, setAffectionMap] = useState<AffectionMap>(
    createCharacterRecord(() => 0)
  );
  // 🤝 親密度（有多熟）：每个角色的起点由 RELATIONSHIP_PROFILES 决定
  const [familiarityMap, setFamiliarityMap] = useState<FamiliarityMap>(
    createCharacterRecord(id => getInitialFamiliarity(id))
  );
  const [affectionToast, setAffectionToast] = useState<AffectionToast | null>(null);

  // 🎲 命运骰子：本回合的点数（发送消息时掷出，展示给玩家）
  const [diceRoll, setDiceRoll] = useState<{ value: number; key: number } | null>(null);

  // 💞 关系升级事件：触发庆祝画面 + 升级剧情（区分是哪条轴涨了）
  const [levelUpEvent, setLevelUpEvent] = useState<{ axis: RelationshipAxis; level: number; key: number } | null>(null);

  // 🧠 长期记忆：每个角色一段滚动摘要（已认识的角色带着共同记忆开局）；
  // replySinceMemoryRef 记录距上次摘要的回复数
  const [memoryMap, setMemoryMap] = useState<MemoryMap>(createCharacterRecord(id => getSeedMemory(id)));
  const replySinceMemoryRef = useRef(0);

  const [selectedCharId, setSelectedCharId] = useState<CharacterId | null>(null);
  const [lobbySelectedChar, setLobbySelectedChar] = useState<CharacterId | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>(ChatMode.FREE_TALK);
  const [visibleLobbyChars, setVisibleLobbyChars] = useState<Set<CharacterId>>(new Set());
  // 🤝 已经在剧情里照过面的人。没见过的人不进大厅名单——
  // 第一天完全没出现过的光，不该能直接点开跟她自由聊天。
  const [metChars, setMetChars] = useState<CharacterId[]>([]);
  const markMet = (ids: CharacterId[]) => {
    if (!ids.length) return;
    setMetChars(prev => {
      const add = ids.filter(id => id && !prev.includes(id));
      return add.length ? [...prev, ...add] : prev;
    });
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 🌊 流式回复中：页面持续到达，期间暂停自动存档、对话框显示等待点
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState<boolean | null>(null);
  const [isDialogueFinished, setIsDialogueFinished] = useState(false);

  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showHistoryLog, setShowHistoryLog] = useState(false);
  const [showWordbook, setShowWordbook] = useState(false);
  const [showCgGallery, setShowCgGallery] = useState(false);
  const [showProtagonistProfile, setShowProtagonistProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [saveLoadMode, setSaveLoadMode] = useState<'SAVE' | 'LOAD' | null>(null);

  // 👤 P5 式主角五维人格属性与关西行事历状态
  const [protagonistStats, setProtagonistStats] = useState<ProtagonistStats>(INITIAL_PROTAGONIST_STATS);
  const [gameCalendar, setGameCalendar] = useState<GameCalendar>(INITIAL_CALENDAR_STATE);
  const [statGainEvent, setStatGainEvent] = useState<StatGainEvent | null>(null);
  // 一次给多个属性时（剧情选项常见）要排队弹，不然后一个会盖掉前一个
  const [statGainQueue, setStatGainQueue] = useState<StatGainEvent[]>([]);

  // 📖 剧情选择留下的痕迹 + 序章是否已通关（随存档保存）
  const [storyFlags, setStoryFlags] = useState<StoryFlags>({});
  const [prologueDone, setPrologueDone] = useState(false);
  // 🖼 剧情 CG 解锁记录（好感度 CG 走 affectionMap，这一组靠"你确实经历过"）
  const [unlockedCgs, setUnlockedCgs] = useState<string[]>([]);
  // 🏁 序章结算屏：序章播完先停在这一屏，让玩家看见自己的选择被记住了
  const [prologueResult, setPrologueResult] = useState<PrologueResult | null>(null);

  const gainStat = (stat: StatKey, amount: number, reasonZh: string, reasonEn: string) => {
    setProtagonistStats(prev => ({
      ...prev,
      [stat]: Math.min(100, Math.max(0, (prev[stat] || 0) + amount))
    }));
    setStatGainEvent({
      stat,
      amount,
      reasonZh,
      reasonEn,
      timestamp: Date.now()
    });
  };

  // 剧本节点一次抛回来的一组增益：数值立刻结算，提示进队列依次弹出
  const applyStoryEffects = (effects: StoryEffect[]) => {
    if (!effects.length) return;
    setProtagonistStats(prev => {
      const next = { ...prev };
      effects.forEach(e => {
        next[e.stat] = Math.min(100, Math.max(0, (next[e.stat] || 0) + e.amount));
      });
      return next;
    });
    setStatGainQueue(prev => [
      ...prev,
      ...effects.map((e, i) => ({
        stat: e.stat,
        amount: e.amount,
        reasonZh: e.reasonZh,
        reasonEn: e.reasonEn,
        timestamp: Date.now() + i
      }))
    ]);
  };

  // 队列泵：当前没有提示在显示时，取下一个顶上
  useEffect(() => {
    if (statGainEvent || statGainQueue.length === 0) return;
    setStatGainEvent(statGainQueue[0]);
    setStatGainQueue(q => q.slice(1));
  }, [statGainEvent, statGainQueue]);

  const [activeHistoryTab, setActiveHistoryTab] = useState<CharacterId>(VISIBLE_CHARACTER_IDS[0]);
  const [hasAnySave, setHasAnySave] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<string>('');
  const [currentScene, setCurrentScene] = useState<string>(DEFAULT_SCENE);

  const [customApiKey, setCustomApiKey] = useState('');
  const [customModel, setCustomModel] = useState('deepseek-v4-flash');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentGate, setShowConsentGate] = useState(false);
  // 第一天（第 1 章）：序章之后、进入自由游玩之前的手写章节
  const [day1Done, setDay1Done] = useState(false);
  const [playingDay1, setPlayingDay1] = useState(false);
  // 正在播的专属剧情（手写剧本走 StoryScreen，和序章同一套引擎）
  const [activeLevelStory, setActiveLevelStory] = useState<{ charId: CharacterId; def: LevelStoryDef } | null>(null);
  // 🗺️ 出门：正在走的那一趟。event 为 null 表示今天这地方没戏，播空转旁白。
  const [activeTrip, setActiveTrip] = useState<{ loc: MapLocation; event: MapEventDef | null; script: StoryNode[] } | null>(null);
  // 🌱🎣 课余生活：钱包 / 背包 / 花盆 / 鱼图鉴，合成一份存
  const [life, setLife] = useState<LifeState>(INITIAL_LIFE_STATE);
  const [activeStore, setActiveStore] = useState<StoreKind | null>(null);
  const [activeGarden, setActiveGarden] = useState<'balcony' | 'rooftop' | null>(null);
  const [inKitchen, setInKitchen] = useState(false);
  const [activeFishing, setActiveFishing] = useState<MapLocation | null>(null);
  const [showFishDex, setShowFishDex] = useState(false);
  const [lifeToast, setLifeToast] = useState<string | null>(null);

  const flashLife = (msg: string) => {
    setLifeToast(msg);
    window.setTimeout(() => setLifeToast(t => (t === msg ? null : t)), 2600);
  };
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);

  // 场景背景：角色房间 > 天气变体（教室/屋顶有）> 原图
  const bgUrl = (currentScene === 'room' && selectedCharId && CHARACTER_ROOMS[selectedCharId])
    ? CHARACTER_ROOMS[selectedCharId]
    : (getWeatherScene(currentScene, gameCalendar)
       || SCENE_MAP[currentScene] || SCENE_MAP[DEFAULT_SCENE]);
  const T = UI_TEXT[userState.language] as Record<string, string>;

  // ---------- 初始化 ----------
  useEffect(() => {
    checkForSaves();
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) setCustomApiKey(storedKey);

    const storedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    if (storedModel) setCustomModel(storedModel);

    const storedBaseUrl = localStorage.getItem(CUSTOM_BASE_URL_STORAGE_KEY);
    if (storedBaseUrl) setCustomBaseUrl(storedBaseUrl);

    const storedModelName = localStorage.getItem(CUSTOM_MODEL_NAME_STORAGE_KEY);
    if (storedModelName) setCustomModelName(storedModelName);
  }, []);

  // 🔊 音效系统：init 幂等；BGM 要等首次用户手势解锁后才响（浏览器自动播放策略）。
  useEffect(() => {
    audioManager.init();
    if (audioManager.isUnlocked()) return;
    const unlock = () => {
      audioManager.unlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // 🎵 按 gameMode 切 BGM（title / lobby / chat），交叉淡入 800ms。
  // 序章期间由 StoryScreen 按场景自己点曲（列车 / 街道 / 便利店 / 夜），这里不插手。
  useEffect(() => {
    if (gameMode === GameMode.PROLOGUE) return;
    const track = gameMode === GameMode.LOBBY ? 'lobby'
      : gameMode === GameMode.CHAT ? 'chat'
      : 'title';
    audioManager.crossfadeBgm(track, 800);
  }, [gameMode]);

  // OpenAI 兼容自定义接口：选中 custom 时使用用户填写的 Base URL 与模型名
  const isCustomApi = customModel === CUSTOM_MODEL_VALUE;
  const effectiveModelName = isCustomApi ? customModelName.trim() : customModel;
  const effectiveBaseUrl = isCustomApi ? (customBaseUrl.trim() || undefined) : undefined;

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setCustomApiKey(val);
    if (val) localStorage.setItem(API_KEY_STORAGE_KEY, val);
    else localStorage.removeItem(API_KEY_STORAGE_KEY);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCustomModel(val);
    localStorage.setItem(MODEL_STORAGE_KEY, val);
  };

  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setCustomBaseUrl(val);
    if (val) localStorage.setItem(CUSTOM_BASE_URL_STORAGE_KEY, val);
    else localStorage.removeItem(CUSTOM_BASE_URL_STORAGE_KEY);
  };

  const handleModelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setCustomModelName(val);
    if (val) localStorage.setItem(CUSTOM_MODEL_NAME_STORAGE_KEY, val);
    else localStorage.removeItem(CUSTOM_MODEL_NAME_STORAGE_KEY);
  };

  useEffect(() => {
    if (selectedCharId) {
      setActiveHistoryTab(selectedCharId);
    }
  }, [selectedCharId]);

  // 大厅名单：只列已经在剧情里照过面的人。
  // 没见过的角色连卡片都不出现（不是灰掉），她是谁这件事留给剧情去揭。
  const lobbyChars = useMemo(
    () => VISIBLE_CHARACTER_IDS.filter(id => metChars.includes(id)),
    [metChars]
  );

  // 大厅角色渐次登场
  useEffect(() => {
    if (gameMode === GameMode.LOBBY) {
      setVisibleLobbyChars(new Set());
      const timers: ReturnType<typeof setTimeout>[] = [];

      lobbyChars.forEach((id, index) => {
        const timer = setTimeout(() => {
          setVisibleLobbyChars(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        }, index * 1000 + 500);
        timers.push(timer);
      });

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [gameMode, lobbyChars]);

  useEffect(() => {
    if (gameMode === GameMode.CHAT && !isStreaming && messages.length > 1 && messages[messages.length - 1].role === 'model') {
      triggerAutoSave();
    }
  }, [messages, isStreaming]);

  // 🔊 主要弹窗开 / 关的提示音（关闭多为点背景遮罩，通用点击音覆盖不到）
  const anyModalOpen = showSystemMenu || showHistoryLog || showWordbook || showCgGallery || showInventory || !!saveLoadMode;
  const prevModalOpenRef = useRef(false);
  useEffect(() => {
    if (anyModalOpen === prevModalOpenRef.current) return;
    prevModalOpenRef.current = anyModalOpen;
    audioManager.playSfx(anyModalOpen ? 'modal_open' : 'modal_close');
  }, [anyModalOpen]);

  // 🌊 流式骨架消息：第一页到达时创建，之后逐页追加，流结束后由完整结果替换
  const makeStreamHandler = (charId: CharacterId, replaceAll: boolean) => {
    const state = { msgId: null as string | null };
    const onPage = (page: DialoguePage) => {
      setIsLoading(false);
      setIsStreaming(true);
      if (!state.msgId) {
        state.msgId = 'stream-' + Date.now();
        const skeleton: Message = { id: state.msgId, role: 'model', text: '', pages: [page], senderName: CHARACTERS[charId].name };
        setMessages(prev => replaceAll ? [skeleton] : [...prev, skeleton]);
      } else {
        setMessages(prev => prev.map(m => m.id === state.msgId ? { ...m, pages: [...(m.pages || []), page] } : m));
      }
    };
    return { state, onPage };
  };

  // 好感度提示自动消失
  useEffect(() => {
    if (!affectionToast) return;
    const timer = setTimeout(() => setAffectionToast(null), 2500);
    return () => clearTimeout(timer);
  }, [affectionToast]);

  // ---------- 长期记忆 ----------
  // 后台把最近对话合并进角色的长期记忆（失败不影响游戏，静默忽略）
  const updateCharacterMemory = async (charId: CharacterId, sessionMessages: Message[]) => {
    const relevant = sessionMessages.filter(m => !m.id.startsWith('err'));
    if (relevant.length < 2) return;
    try {
      const updated = await summarizeMemory(
        CHARACTERS[charId].name, memoryMap[charId] || '', relevant.slice(-24),
        customApiKey, effectiveModelName, effectiveBaseUrl
      );
      if (updated) {
        setMemoryMap(prev => ({ ...prev, [charId]: updated }));
      }
    } catch (e) {
      console.warn('Memory update failed (will retry next time):', e);
    }
  };

  // ---------- 序章 (Chapter 0) ----------
  // 只有「新的开始」会走序章；「继续游戏」读档后直接回大厅。
  // 序章开始时属性归零、关系回到各角色的默认起点——
  // 序章里挣到的每一点关系，都必须是这一轮真的挣到的。
  const prologueStatsBeforeRef = useRef<ProtagonistStats>(INITIAL_PROTAGONIST_STATS);
  const prologueWordCountRef = useRef(0);

  const startPrologue = () => {
    setStoryFlags({});
    setPrologueDone(false);
    setProtagonistStats(INITIAL_PROTAGONIST_STATS);
    // 序章能介绍的人一律从 0 起：她们的"第一天"就是这一天，
    // 不能一边说"只见过一面"，一边顶着开学前就认识的親密度。
    setFamiliarityMap(createCharacterRecord(id =>
      PROLOGUE_INTRODUCIBLE_CHARS.includes(id) ? 0 : getInitialFamiliarity(id)
    ));
    setAffectionMap(createCharacterRecord(() => 0));
    setMemoryMap(createCharacterRecord(id => getSeedMemory(id)));
    setUnlockedCgs([]);
    setMetChars([]);   // 新开一局：谁都还没见过
    setPrologueResult(null);
    setStatGainEvent(null);
    setStatGainQueue([]);
    prologueStatsBeforeRef.current = INITIAL_PROTAGONIST_STATS;
    prologueWordCountRef.current = 0;
    storyWordKeysRef.current = new Set();
    // 名字清空：序章里深雪送回覧板那一幕才会问，问到之前谁都不会叫你的名字
    setUserState(prev => ({ ...prev, playerName: '' }));
    // 全新开始：清掉上一轮的半截进度，别让 StoryScreen 又弹"要不要接着看"
    setPendingPrologueProgress(null);
    setDay1Done(false);
    setPlayingDay1(false);
    setActiveTrip(null);
    setLife(INITIAL_LIFE_STATE);
    setActiveStore(null); setActiveGarden(null); setActiveFishing(null); setInKitchen(false);
    setPrologueSessionKey(k => k + 1);
    try {
      localStorage.removeItem(PROLOGUE_PROGRESS_KEY);
      localStorage.removeItem(DAY1_PROGRESS_KEY);   // 第一章的半截进度也要清
      // 地图的"新地点"角标也要重来，否则新档一开地图全是看过的
      localStorage.removeItem('kobe_map_seen_v1');
      // 出门那些小剧情的半截进度同样清掉
      Object.keys(localStorage)
        .filter(k => k.startsWith('kobe_study_trip_'))
        .forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }
    // 序章 = 4 月 10 日，抵达当晚
    setGameCalendar({ month: 4, day: 10, dayOfWeek: '月 (Mon)', timeSlot: 'afternoon', weather: 'sunny' });
    setCurrentScene('train_interior');
    setGameMode(GameMode.PROLOGUE);
    // 序章一开始就先落一次盘：这样即使中途关掉页面，
    // 标题画面的「继续游戏」也是亮的，能直接接回序章而不是重走登记流程。
    pendingPrologueStartSaveRef.current = true;
  };

  const pendingPrologueStartSaveRef = useRef(false);
  useEffect(() => {
    if (!pendingPrologueStartSaveRef.current) return;
    if (gameMode !== GameMode.PROLOGUE) return;
    pendingPrologueStartSaveRef.current = false;
    triggerAutoSave();
  }, [gameMode]);

  // 剧本给的关系变动：直接加绝对点数（不走 AI 那套 delta × 倍率），
  // 也不弹升级庆祝——序章的结算统一放到结算屏上讲。
  const applyStoryRelations = (relations: StoryRelationEffect[]) => {
    if (!relations.length) return;
    // 剧本里但凡给某人结算过关系，就说明玩家真的跟她照过面了。
    // 大厅的名单直接认这个信号 —— 不用另维护一张"谁登场过"的表，
    // 也就不会出现"剧情加了新角色但忘了登记，她永远不出现"的漏配。
    markMet(relations.map(r => r.char));
    setFamiliarityMap(prev => {
      const next = { ...prev };
      relations.forEach(r => {
        if (!r.familiarity) return;
        next[r.char] = Math.max(0, Math.min(FAMILIARITY_MAX, (next[r.char] || 0) + r.familiarity));
      });
      return next;
    });
    setAffectionMap(prev => {
      const next = { ...prev };
      relations.forEach(r => {
        if (!r.affection) return;
        next[r.char] = Math.max(0, Math.min(AFFECTION_MAX, (next[r.char] || 0) + r.affection));
      });
      return next;
    });
  };

  // 剧本台词里的生词进单词本。
  // 去重键走同步的 ref：StrictMode 会把 effect 跑两遍，
  // 只靠 setState updater 里判重会把计数算成两倍。
  const storyWordKeysRef = useRef<Set<string>>(new Set());
  const collectStoryWords = (words: StoryWord[]) => {
    if (!words.length) return;
    const now = Date.now();
    const fresh: CollectedWord[] = [];
    words.forEach((w, i) => {
      const original = w.reading ? `${w.jp}（${w.reading}）` : w.jp;
      if (storyWordKeysRef.current.has(original)) return;
      storyWordKeysRef.current.add(original);
      fresh.push({
        id: `story-${now}-${i}`,
        original,
        translation: userState.language === 'en' ? w.en : w.zh,
        timestamp: now + i
      });
    });
    if (!fresh.length) return;
    prologueWordCountRef.current += fresh.length;
    setUserState(prev => {
      const known = new Set(prev.collectedWords.map(w => w.original));
      const add = fresh.filter(f => !known.has(f.original));
      return add.length ? { ...prev, collectedWords: [...add, ...prev.collectedWords] } : prev;
    });
  };

  // 序章痕迹 → AI 的"你们到底认不认识"。
  // 没有这一步，玩家在便利店主动跟深雪搭过话，正篇第一句仍然是"我们素不相识"。
  const getEncounterOverride = (charId: CharacterId, flags: StoryFlags = storyFlags, done: boolean = prologueDone) => {
    const enc = resolvePrologueEncounter(charId, flags, done);
    return enc ? { origin: enc.origin, encounter: enc.encounter } : undefined;
  };

  const unlockStoryCg = (cgId: string) => {
    setUnlockedCgs(prev => (prev.includes(cgId) ? prev : [...prev, cgId]));
  };

  // 续玩半截序章：把上次已经拿到的东西一次性灌回来
  const restoreStoryProgress = (payload: StoryRestorePayload) => {
    setProtagonistStats({ ...INITIAL_PROTAGONIST_STATS, ...payload.stats });
    if (payload.relations.length) applyStoryRelations(payload.relations);
    if (payload.words.length) collectStoryWords(payload.words);
    if (payload.unlockedCgs.length) {
      setUnlockedCgs(prev => Array.from(new Set([...prev, ...payload.unlockedCgs])));
    }
  };

  // 序章播完（或被跳过）：先停在结算屏，不直接甩进大厅
  const pendingPrologueSaveRef = useRef(false);
  const finishPrologue = (flags: StoryFlags, opts: { skipped: boolean }) => {
    setStoryFlags(flags);
    setPrologueDone(true);
    setPrologueResult({
      flags,
      statsBefore: prologueStatsBeforeRef.current,
      statsAfter: protagonistStats,
      wordsLearned: prologueWordCountRef.current,
      skipped: opts.skipped
    });
  };

  // 结算屏上按「进入第 1 章」：把序章的相遇写进各角色的长期记忆，然后进大厅
  const continueFromPrologue = () => {
    audioManager.playSfx('confirm');
    // 序章里没碰上的人：回到她们档案里"开学前就认识了"的那份背景设定
    setFamiliarityMap(prev => {
      const next = { ...prev };
      PROLOGUE_INTRODUCIBLE_CHARS.forEach(id => {
        if (didMeetInPrologue(id, storyFlags)) return;
        next[id] = Math.max(next[id] || 0, getInitialFamiliarity(id));
      });
      return next;
    });
    setMemoryMap(prev => {
      const next = { ...prev };
      ALL_CHARACTER_IDS.forEach(id => {
        const enc = resolvePrologueEncounter(id, storyFlags, true);
        // 序章决定了她"记得"哪个版本的那天晚上；没相遇的角色记忆留空
        if (enc) next[id] = enc.seedMemory || '';
      });
      return next;
    });
    setPrologueResult(null);
    setCurrentScene(DEFAULT_SCENE);
    goAfterPrologue(consentGiven);
  };

  // 序章之后该去哪：同意书 → 第一章 → 大厅。
  // 抽出来是因为这段逻辑有两个入口（结算屏、同意书），
  // 之前只在同意书里启动第一章，结果"已经同意过"的人直接掉进大厅、
  // 整个第一章被跳过。
  const goAfterPrologue = (hasConsent: boolean) => {
    if (!hasConsent) { setShowConsentGate(true); return; }
    if (!day1Done) { startDay1(); return; }
    setCurrentScene(DEFAULT_SCENE);
    setGameMode(GameMode.LOBBY);
    pendingPrologueSaveRef.current = true;
  };

  // 第一章 = 4 月 11 日，开学。日历要跟着走，不然大厅显示的日期和剧情对不上。
  const startDay1 = () => {
    setGameCalendar({ month: 4, day: 11, dayOfWeek: '火 (Tue)', timeSlot: 'morning', weather: 'sunny' });
    setPlayingDay1(true);
  };

  // 睡一觉 = 推进到第二天早晨。天气随机，房间背景会跟着换。
  const advanceToNextDay = () => {
    audioManager.playSfx('confirm');
    setGameCalendar(prev => {
      const weathers: GameCalendar['weather'][] = ['sunny', 'sunny', 'cloudy', 'rainy', 'sunset'];
      return {
        ...prev,
        day: prev.day + 1,
        dayOfWeek: weekdayFor(prev.month, prev.day + 1),
        timeSlot: 'morning',
        weather: weathers[Math.floor(Math.random() * weathers.length)]
      };
    });
    // 过夜：昨天没浇水的盆会蔫。蔫了只是收成减半，不会死——
    // 这是休闲系统，不该因为玩家两天没上线就把东西毁掉。
    setLife(l => {
      const today = dayIndex(gameCalendar);
      return {
        ...l,
        plots: l.plots.map(p =>
          p.seedId && p.lastWaterOn !== today && plantStage(p, today) < 4
            ? { ...p, wilted: true, missedWater: (p.missedWater || 0) + 1 }
            : p)
      };
    });
    setGameMode(GameMode.LOBBY);
  };

  // 🗺️ 出门。选好地方 → 看今天这儿有没有戏 → 有就演，没有就给一段空转旁白。
  //
  // 店和钓点是例外：它们本身就是一个界面，不该被"今天这儿没事发生"的空转旁白挡住。
  // 但第一次去仍然让剧情事件先播（比如第一次走到三宫站那段），所以顺序是
  // "有事件先演事件，没事件才直接开门"。
  const startTrip = (loc: MapLocation) => {
    const ev = pickEventFor(loc.id, {
      flags: storyFlags,
      calendar: gameCalendar,
      affection: affectionMap,
      familiarity: familiarityMap
    });
    if (!ev) {
      if (loc.id === 'hyakkin_store') { setCurrentScene(loc.id); setActiveStore('hyakkin'); setGameMode(GameMode.STORE); return; }
      if (loc.id === 'tackle_shop')   { setCurrentScene(loc.id); setActiveStore('tackle');  setGameMode(GameMode.STORE); return; }
      if (FISHING_SPOTS.includes(loc.id)) { setCurrentScene(loc.id); setActiveFishing(loc); setGameMode(GameMode.FISHING); return; }
      // 天台只有在真摆了盆的时候才当花园开。一个盆都没有还跳花园界面，
      // 等于把天台原本那段空转旁白也吞掉了，白跑一趟还什么都没看见。
      if (loc.id === 'rooftop_sunset' && life.plots.some(p => p.site === 'rooftop')) {
        setCurrentScene(loc.id); setActiveGarden('rooftop'); setGameMode(GameMode.GARDEN); return;
      }
    }
    setActiveTrip({
      loc,
      event: ev,
      script: ev ? ev.script : buildAmbientScript(loc, userState.language === 'en' ? 'en' : 'zh')
    });
    setGameMode(GameMode.LOBBY);
  };

  // ---- 休闲系统的几个回调 ----
  const buyItem = (cost: number, apply: (l: LifeState) => LifeState) =>
    setLife(l => (l.yen < cost ? l : { ...apply(l), yen: l.yen - cost }));
  const sellItem = (gain: number, apply: (l: LifeState) => LifeState) =>
    setLife(l => ({ ...apply(l), yen: l.yen + gain }));

  // 照顾得好不好，直接换成属性。这游戏没有战斗，属性就是推进对话选项的唯一货币，
  // 所以"每天记得浇水"必须真的换得到东西，否则它只是个日常仪式。
  const harvested = (zh: string, enName: string, n: number, care: 'perfect' | 'ok' | 'poor') => {
    audioManager.playSfx('confirm');
    flashLife(userState.language === 'en' ? `Harvested ${enName} ×${n}` : `收获了 ${zh} ×${n}`);
    if (care === 'perfect') {
      applyStoryEffects([
        { stat: 'kindness', amount: 2, reasonZh: '一天都没落下', reasonEn: 'Not one day missed' },
        { stat: 'proficiency', amount: 1, reasonZh: '你开始能看出它哪天不对劲', reasonEn: 'You have started to notice when it is having a bad day' }
      ]);
    } else {
      applyStoryEffects([
        { stat: 'kindness', amount: 1, reasonZh: '你把一样东西从头养到了尾', reasonEn: 'You saw something through from seed to harvest' }
      ]);
    }
  };

  // 做菜：吃掉结算属性，第一次做的多给一点知识
  const cooked = (r: RecipeDef, firstTime: boolean) => {
    setLife(l => {
      const next = consumeFor(r, l);
      return { ...next, cookedDex: { ...(l.cookedDex || {}), [r.id]: ((l.cookedDex || {})[r.id] || 0) + 1 } };
    });
    applyStoryEffects([
      ...r.effects,
      ...(firstTime
        ? [{ stat: 'knowledge' as const, amount: 1,
             reasonZh: `你学会做${r.nameZh}了`, reasonEn: `You learned to make ${r.nameEn.toLowerCase()}` }]
        : [])
    ]);
    if (r.word) collectStoryWords([r.word]);
    flashLife(userState.language === 'en' ? `Made ${r.nameEn}` : `做了${r.nameZh}`);
  };

  const caughtFish = (fish: FishDef, cm: number) => {
    const today = dayIndex(gameCalendar);
    setLife(l => {
      const items = { ...l.items };
      if (!fish.junk) items['catch|' + fish.id + '|' + cm] = (items['catch|' + fish.id + '|' + cm] || 0) + 1;
      const dex = { ...l.fishDex };
      if (!fish.junk) {
        const prev = dex[fish.id];
        dex[fish.id] = prev
          ? { ...prev, count: prev.count + 1, bestCm: Math.max(prev.bestCm, cm) }
          : { count: 1, bestCm: cm, firstMonth: gameCalendar.month, firstDay: gameCalendar.day };
      }
      return {
        ...l, items, fishDex: dex,
        fishedOn: today,
        fishedToday: (l.fishedOn === today ? l.fishedToday : 0) + 1
      };
    });
    if (!fish.junk && fish.rarity >= 4) {
      gainStat('guts', 1, '你把一条不该上来的鱼弄上来了', 'You landed something that had no business coming up');
    }
  };

  const spendBait = () =>
    setLife(l => {
      const items = { ...l.items };
      items[BAIT_ITEM] = Math.max(0, (items[BAIT_ITEM] || 0) - 1);
      if (!items[BAIT_ITEM]) delete items[BAIT_ITEM];
      return { ...l, items };
    });

  // 出门回来：时段往前走一格。夜里出去的那一趟回来就直接是第二天早上——
  // 否则夜里可以无限刷，"今天去哪儿"就不是个选择了。
  const finishTrip = (flags: StoryFlags) => {
    const trip = activeTrip;
    setStoryFlags(prev => ({
      ...prev,
      ...flags,
      // 事件 id 同时就是"演过了"的 flag
      ...(trip?.event ? { [trip.event.id]: true } : {})
    }));
    if (trip?.event?.chars?.length) markMet(trip.event.chars);
    setActiveTrip(null);
    setActiveStore(null); setActiveFishing(null);
    // 出门那一趟的剧本是叠在大厅上播的，所以以前不用管 gameMode。
    // 但店和钓点是自己占一个 gameMode 的，回来必须显式切回大厅——
    // 否则 activeStore 清空之后 gameMode 还停在 STORE，屏幕上什么都不剩。
    setGameMode(GameMode.LOBBY);
    setCurrentScene(DEFAULT_SCENE);
    // 这一趟花掉几格，由地点/事件标价决定：便利店 1 格，二郎系拉面和远门 2 格。
    // 花完今天的额度就直接跳到第二天午后——早上是上学时间，不是可以出门的时段。
    const cost = trip ? getTimeCost(trip.loc, trip.event) : 1;
    setGameCalendar(prev => {
      const idx = AFTERSCHOOL_SLOTS.indexOf(prev.timeSlot);
      const next = (idx < 0 ? 0 : idx) + cost;
      if (next < AFTERSCHOOL_SLOTS.length) {
        return { ...prev, timeSlot: AFTERSCHOOL_SLOTS[next] };
      }
      const weathers: GameCalendar['weather'][] = ['sunny', 'sunny', 'cloudy', 'rainy', 'sunset'];
      return {
        ...prev,
        day: prev.day + 1,
        dayOfWeek: weekdayFor(prev.month, prev.day + 1),
        timeSlot: 'afternoon',
        weather: weathers[Math.floor(Math.random() * weathers.length)]
      };
    });
  };

  // 同意之后才真正进大厅
  const acceptConsent = () => {
    setConsentGiven(true);
    setShowConsentGate(false);
    goAfterPrologue(true);
  };

  // 第一天播完 → 正式进入自由游玩
  const finishDay1 = (flags: StoryFlags) => {
    // day1_done 强制置上：跳过第 1 章的人也算过完了这一天。
    // 地图的三宫一带、校内社团室都挂在这个 flag 上，
    // 靠剧本末尾那个 effect 节点的话，一跳过就全锁死了。
    setStoryFlags(prev => ({ ...prev, ...flags, day1_done: true }));
    // 第 1 章主线上一定会碰面的三个人，跳过章节的人也算认识——
    // 否则跳过之后大厅可能一个人都没有，玩家直接卡死在空名单上。
    markMet([CharacterId.ASUKA, CharacterId.HIKARI, CharacterId.MIYUKI]);
    // 把今天真正发生过的事并进各人的长期记忆。
    // 没触发的 flag 不留痕迹 —— 角色不该记得玩家没玩过的剧情。
    setMemoryMap(prev => appendDay1Memories(prev, flags));
    setDay1Done(true);
    setPlayingDay1(false);
    // 第一章结束 = 4/11 过完。自由游玩从第二天下午开始。
    setGameCalendar({ month: 4, day: 12, dayOfWeek: '水 (Wed)', timeSlot: 'afternoon', weather: 'sunny' });
    setCurrentScene(DEFAULT_SCENE);
    setGameMode(GameMode.LOBBY);
    pendingPrologueSaveRef.current = true;
  };

  // 等 prologueDone / gameMode 真正落到 state 里再存，避免存进过期的值
  useEffect(() => {
    if (!pendingPrologueSaveRef.current) return;
    if (!prologueDone || gameMode !== GameMode.LOBBY) return;
    pendingPrologueSaveRef.current = false;
    triggerAutoSave();
  }, [prologueDone, gameMode]);

  // 离开聊天（返回大厅/标题）时固化本次会话的记忆
  const leaveChat = (target: GameMode) => {
    setShowSystemMenu(false);
    if (gameMode === GameMode.CHAT) audioManager.playSfx('leave_chat'); // 🔊 退出聊天
    if (gameMode === GameMode.CHAT && selectedCharId) {
      updateCharacterMemory(selectedCharId, messages);
      replySinceMemoryRef.current = 0;
    }
    setGameMode(target);
    if (target === GameMode.SETUP) setSetupStep('MENU');
  };

  // ---------- 关系（双轴） ----------
  // 親密度先结算，因为它决定了本回合好感度的天花板：
  // 不熟的人再怎么聊也不会心动，要推恋爱线得先把人处熟。
  const applyRelationship = (charId: CharacterId, rawAffection: number, rawFamiliarity: number) => {
    if (!rawAffection && !rawFamiliarity) return;

    const curFam = familiarityMap[charId] ?? getInitialFamiliarity(charId);
    const famDelta = rawFamiliarity * FAMILIARITY_DELTA_SCALE;
    const nextFam = Math.max(0, Math.min(FAMILIARITY_MAX, curFam + famDelta));

    const curAff = affectionMap[charId] || 0;
    const ceiling = getRomanceCeiling(nextFam);
    const wantedAff = Math.max(0, Math.min(AFFECTION_MAX, curAff + rawAffection * AFFECTION_DELTA_SCALE));
    // 天花板只挡上涨，不倒扣已有的好感度（避免关系倒退时数值被抹掉）
    const nextAff = wantedAff > curAff ? Math.min(wantedAff, Math.max(curAff, ceiling)) : wantedAff;

    if (nextFam === curFam && nextAff === curAff) return;

    if (nextFam !== curFam) setFamiliarityMap(prev => ({ ...prev, [charId]: nextFam }));
    if (nextAff !== curAff) setAffectionMap(prev => ({ ...prev, [charId]: nextAff }));
    setAffectionToast({ delta: nextAff - curAff, famDelta: nextFam - curFam, key: Date.now() });

    // 跨越等级阈值 → 庆祝画面 + 升级剧情。两条轴同回合升级时，
    // 优先播放好感度（更稀有、更有戏），親密度那一级下回合自然会补上。
    const affLeveledTo = getAffectionLevelIndex(nextAff) > getAffectionLevelIndex(curAff)
      ? getAffectionLevelIndex(nextAff) + 1 : 0;
    const famLeveledTo = getFamiliarityLevelIndex(nextFam) > getFamiliarityLevelIndex(curFam)
      ? getFamiliarityLevelIndex(nextFam) + 1 : 0;

    if (affLeveledTo) setLevelUpEvent({ axis: 'affection', level: affLeveledTo, key: Date.now() });
    else if (famLeveledTo) setLevelUpEvent({ axis: 'familiarity', level: famLeveledTo, key: Date.now() });

    // 🔊 关系音效：升级 > 关系下降 > 单纯上涨。好感=暖音色，親密=冷音色。
    if (affLeveledTo) { audioManager.playSfx('levelup_affection'); audioManager.duckBgm(); }
    else if (famLeveledTo) { audioManager.playSfx('levelup_familiarity'); audioManager.duckBgm(); }
    else if (nextAff < curAff || nextFam < curFam) audioManager.playSfx('relation_down');
    else if (nextAff > curAff) audioManager.playSfx('affection_up');
    else if (nextFam > curFam) audioManager.playSfx('familiarity_up');
  };

  // 玩家在升级庆祝画面点击继续 → 触发"关系升级"特别场景
  // TODO 剧情系统：以后改为优先播放 LEVEL_STORIES[charId][level] 的手写剧本
  const handleLevelUpContinue = () => {
    if (!levelUpEvent || !selectedCharId) return;
    const { axis, level: lv } = levelUpEvent;
    setLevelUpEvent(null);
    audioManager.restoreBgm(); // 庆祝结束，BGM 音量恢复

    // 这一级有手写的专属剧情就播它，没有才让 AI 即兴。
    // 剧本是一个一个写的，所以这两条路要长期共存。
    const story = findLevelStory(selectedCharId, axis, lv);
    if (story?.script?.length) {
      setActiveLevelStory({ charId: selectedCharId, def: story });
      return;
    }

    // 解锁内容按轴归属：親密度给场景与日常服装，好感度给亲密服装
    const outfitLevels = axis === 'familiarity' ? FAMILIARITY_GATED_OUTFIT_LEVELS : ROMANCE_GATED_OUTFIT_LEVELS;
    const newOutfits = outfitLevels.includes(lv) ? (OUTFIT_UNLOCKS[selectedCharId]?.[lv] || []).join(', ') : '';
    const newScenes = axis === 'familiarity' ? (SCENE_UNLOCKS_BY_LEVEL[lv] || []).join(', ') : '';

    const header = axis === 'familiarity'
      ? `【システム：プレイヤーとの親密度がLv.${lv}「${FAMILIARITY_LEVELS[lv - 1].labelEn}」に達しました。恋愛的な進展ではありません——「この人には、もう少し本当のことを話してもいい」と思えるようになった、という距離の変化です。呼び方や話し方がここで一段変わることを、さりげなく、しかしはっきり分かる形で見せてください。恋愛感情の描写は絶対に入れないこと。`
      : `【システム：プレイヤーへの好感度がLv.${lv}「${AFFECTION_LEVELS[lv - 1].labelEn}」に達しました。自分の気持ちが一段深くなったことに気づいてしまう、特別で印象的なシーンをあなたのキャラクター性のままで演出してください。`;

    if (newOutfits || newScenes) audioManager.playSfx('unlock'); // 🔊 解锁服装 / 场景

    handleSendMessage(
      header +
      (newOutfits ? `新しく解放された服装: ${newOutfits}。` : '') +
      (newScenes ? `新しく行ける場所: ${newScenes}。` : '') +
      `最後は必ず質問で終わること。】`
    );
  };

  // ---------- 存档系统 ----------
  // 双轴之前的旧存档只有 affectionMap。直接补 0 会让"已经攻略到恋人"的角色
  // 突然退回初対面，所以按当时的好感度等级反推一个等价的親密度起点。
  const migrateFamiliarityMap = (saved: Partial<FamiliarityMap> | undefined, affection: AffectionMap): FamiliarityMap =>
    createCharacterRecord(id => {
      const stored = saved?.[id];
      if (typeof stored === 'number' && Number.isFinite(stored)) return stored;
      const equivalent = FAMILIARITY_LEVELS[getAffectionLevelIndex(affection[id] || 0)].threshold;
      return Math.max(getInitialFamiliarity(id), equivalent);
    });

  // 序章中途进度：StoryScreen 每前进一步就写在 PROLOGUE_PROGRESS_KEY 下。
  // 存档槽要能把这一份一起带走，否则"序章存了三个档"读回来全是同一个位置。
  const isUsablePrologueProgress = (p: unknown): p is StoryProgress => {
    const q = p as StoryProgress | null;
    return !!q && q.version === PROLOGUE_SCRIPT_VERSION
      && Array.isArray(q.nodes) && q.idx > 0 && q.idx < q.nodes.length;
  };

  const readPrologueProgress = (): StoryProgress | null => {
    try {
      const raw = localStorage.getItem(PROLOGUE_PROGRESS_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw) as StoryProgress;
      return isUsablePrologueProgress(p) ? p : null;
    } catch { return null; }
  };

  const hasValidPrologueProgress = (): boolean => !!readPrologueProgress();

  // 读档进序章时交给 StoryScreen 的那一份（静默恢复，不再弹"要不要接着看"）
  const [pendingPrologueProgress, setPendingPrologueProgress] = useState<StoryProgress | null>(null);
  // StoryScreen 的 key：读档 / 重开时 +1 强制重挂载。
  // 它只在挂载时读一次 initialProgress，不换 key 的话「在序章里读另一个档」
  // 只会换掉背景，正文还停在原来那一句上。
  const [prologueSessionKey, setPrologueSessionKey] = useState(0);

  // 存档只保留最近的对话（更早内容已在长期记忆摘要里），防止 localStorage 爆仓
  const buildSaveData = (isAutoSave: boolean, hard = false) => {
    const msgLimit = hard ? SAVE_MESSAGES_LIMIT_HARD : SAVE_MESSAGES_LIMIT;
    const histLimit = hard ? SAVE_HISTORY_PER_CHAR_HARD : SAVE_HISTORY_PER_CHAR;
    const trimmedHistories = {} as Record<CharacterId, Message[]>;
    (Object.keys(chatHistories) as CharacterId[]).forEach(id => {
      trimmedHistories[id] = (chatHistories[id] || []).slice(-histLimit);
    });
    return {
      meta: {
        timestamp: Date.now(),
        playerName: userState.playerName,
        topic: userState.grammarTopic,
        charId: selectedCharId,
        previewText: messages.length > 0
          ? messages[messages.length - 1].text.substring(0, 30) + '...'
          : prologueDone
            ? (userState.language === 'en' ? 'Prologue cleared' : '序章已通关')
            : gameMode === GameMode.PROLOGUE
              ? (userState.language === 'en' ? 'Prologue in progress' : '序章进行中')
              : 'No messages',
        isAutoSave
      },
      data: {
        userState, gameMode, selectedCharId, chatMode,
        messages: messages.slice(-msgLimit),
        chatHistories: trimmedHistories,
        customAssets, affectionMap, familiarityMap, memoryMap,
        // 🔥 五维人格、行事历与剧情选择：漏存这几项等于玩家的选择读档就作废
        protagonistStats, gameCalendar, storyFlags, prologueDone, day1Done, unlockedCgs, life, metChars,
        // 序章进行中：把这一刻的进度（读到第几句、做过哪些选择）随槽位一起存下来，
        // 这样三个存档就是三个不同的位置，而不是都指向同一份共享进度。
        // hard 模式（容量告急）下丢掉它：宁可退回共享进度，也不能让存档整个写不进去。
        prologueProgress: (!hard && gameMode === GameMode.PROLOGUE) ? readPrologueProgress() : null
      }
    };
  };

  // 写入 localStorage；容量不足时用更小的限额降级重试一次
  const writeSave = (slotKey: string, isAutoSave: boolean): boolean => {
    try {
      localStorage.setItem(slotKey, JSON.stringify(buildSaveData(isAutoSave)));
      return true;
    } catch (e) {
      try {
        localStorage.setItem(slotKey, JSON.stringify(buildSaveData(isAutoSave, true)));
        console.warn('Save trimmed to hard limit (storage nearly full).');
        return true;
      } catch (e2) {
        console.error('Save failed even after trimming:', e2);
        return false;
      }
    }
  };

  const triggerAutoSave = () => {
    // 序章期间/刚打完时还没选过角色，但这份进度必须存下来——
    // 否则玩家关掉页面后「继续游戏」是灰的，序章得从头再看一遍。
    if (!selectedCharId && !prologueDone && gameMode !== GameMode.PROLOGUE) return;
    if (writeSave(`${SAVE_SLOT_PREFIX}0`, true)) {
      checkForSaves();
      setShowAutoSave(true);
      setTimeout(() => setShowAutoSave(false), 2500);
    }
  };

  const checkForSaves = () => {
    let found = false;
    for (let i = 0; i < MAX_SLOTS; i++) {
      if (localStorage.getItem(`${SAVE_SLOT_PREFIX}${i}`)) {
        found = true;
        break;
      }
    }
    setHasAnySave(found);
  };

  const saveGameToSlot = (slotIndex: number) => {
    if (writeSave(`${SAVE_SLOT_PREFIX}${slotIndex}`, false)) {
      checkForSaves();
      setSaveLoadMode(null);
      setShowSystemMenu(false);
      alert(`${T.gameSaved} (Slot ${slotIndex + 1})`);
    } else {
      alert("❌ 存档失败：设备存储空间可能已满，请删除部分旧存档后重试。");
    }
  };

  const loadGameFromSlot = async (slotIndex: number) => {
    const saved = localStorage.getItem(`${SAVE_SLOT_PREFIX}${slotIndex}`);
    if (!saved) return;

    try {
      const fullData = JSON.parse(saved);
      const data = fullData.data;

      setUserState(prev => ({ ...prev, ...data.userState, language: data.userState.language || 'zh' }));
      setCustomAssets({
        backgroundImage: data.customAssets?.backgroundImage || null,
        characters: { ...createCharacterRecord(() => null as string | null), ...(data.customAssets?.characters || {}) }
      });
      setSelectedCharId(data.selectedCharId);
      setChatMode(data.chatMode);
      setMessages(data.messages || []);

      // 旧存档没有的角色/字段自动补默认值，被删除的角色数据自然忽略
      setChatHistories({ ...createCharacterRecord(() => [] as Message[]), ...(data.chatHistories || {}) });
      const loadedAffection = { ...createCharacterRecord(() => 0), ...(data.affectionMap || {}) };
      setAffectionMap(loadedAffection);
      setFamiliarityMap(migrateFamiliarityMap(data.familiarityMap, loadedAffection));
      // 记忆为空的角色补上预置的共同记忆（旧存档 & 尚未对话过的角色）
      setMemoryMap(createCharacterRecord(id => (data.memoryMap || {})[id] || getSeedMemory(id)));

      // 旧存档没有这几项：回退到初值，不让读档崩掉
      setProtagonistStats({ ...INITIAL_PROTAGONIST_STATS, ...(data.protagonistStats || {}) });
      setGameCalendar({ ...INITIAL_CALENDAR_STATE, ...(data.gameCalendar || {}) });
      setStoryFlags(data.storyFlags || {});
      setUnlockedCgs(Array.isArray(data.unlockedCgs) ? data.unlockedCgs : []);
      // 老存档没有休闲系统：给一份初值，别让读档崩掉
      setLife({ ...INITIAL_LIFE_STATE, ...(data.life || {}),
                items: { ...(data.life?.items || {}) },
                plots: Array.isArray(data.life?.plots) ? data.life.plots : [],
                fishDex: { ...(data.life?.fishDex || {}) } });
      setPrologueResult(null);
      // 老存档一律视为已过序章：他们已经在玩了，不该被拽回序章
      setPrologueDone(data.prologueDone ?? true);
      // 老存档没有这一项：他们早就在自由游玩了，别把人拽回第一天
      setDay1Done(data.day1Done ?? true);
      // 老存档没有 metChars：他们已经在玩了，一律视为全员已认识，
      // 否则一读档半数角色凭空消失。
      setMetChars(Array.isArray(data.metChars) ? data.metChars : [...VISIBLE_CHARACTER_IDS]);
      setPlayingDay1(false);

      // 存档停在序章：优先用槽位里自带的那份进度（这才是"这个存档"的位置），
      // 老存档没带就退回共享进度。两个都不可用才退回大厅，
      // 免得把玩家困在一段播不出来的剧情里。
      const slotProgress = isUsablePrologueProgress(data.prologueProgress)
        ? data.prologueProgress
        : null;
      const resumeProgress = data.gameMode === GameMode.PROLOGUE
        ? (slotProgress || readPrologueProgress())
        : null;
      const canResumePrologue = !!resumeProgress;
      // 交给 StoryScreen 静默恢复；同时把共享进度对齐到这个槽位，
      // 免得下次从标题画面「继续」时又跳回别的存档的位置。
      setPendingPrologueProgress(resumeProgress);
      setPrologueSessionKey(k => k + 1);
      if (slotProgress) {
        try { localStorage.setItem(PROLOGUE_PROGRESS_KEY, JSON.stringify(slotProgress)); } catch { /* 存不下就只用内存里这份 */ }
      }
      setGameMode(
        data.gameMode === GameMode.PROLOGUE
          ? (canResumePrologue ? GameMode.PROLOGUE : GameMode.LOBBY)
          : data.gameMode
      );
      if (canResumePrologue) setCurrentScene('train_interior');
      setSaveLoadMode(null);
      setShowSystemMenu(false);
      setSetupStep('MENU');

      if (data.gameMode === GameMode.CHAT && data.selectedCharId) {
        setIsLoading(true);
        try {
          const charId = data.selectedCharId as CharacterId;
          const affectionValue = loadedAffection[charId] || 0;
          const familiarityValue = migrateFamiliarityMap(data.familiarityMap, loadedAffection)[charId];
          await startChat(
            CHARACTERS[charId], data.chatMode, data.userState.learningGoal, data.userState.grammarTopic, data.userState.language || 'zh', {
              apiKey: customApiKey, modelName: effectiveModelName, history: (data.messages || []).slice(-RECENT_HISTORY_COUNT),
              affection: affectionValue, familiarity: familiarityValue, baseUrl: effectiveBaseUrl,
              memory: (data.memoryMap || {})[charId] || getSeedMemory(charId), resume: false,
              unlockedOutfits: getUnlockedOutfits(charId, familiarityValue, affectionValue),
              unlockedScenes: getUnlockedScenes(familiarityValue),
              // 读档恢复会话时同样要带上序章痕迹，否则 AI 会退回"素不相识"
              encounterOverride: getEncounterOverride(charId, data.storyFlags || {}, data.prologueDone ?? true)
            }
          );
          setIsDialogueFinished(true);
        } catch (e) {
          console.error("Session restore failed", e);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.error("Load failed", e);
      alert("Failed to load save file.");
    }
  };

  // ---------- 实验数据工具 ----------
  const exportExperimentData = () => {
    const exportPayload = {
      timestamp: new Date().toISOString(),
      playerInfo: userState,
      modelUsed: effectiveModelName,
      activeCharacter: selectedCharId,
      mode: chatMode,
      affectionMap,
      familiarityMap,
      fullDialogueLog: chatHistories
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KobeStudy_ExperimentData_${userState.playerName}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const syncToCloud = async () => {
    const WEBHOOK_URL = "https://hook.eu1.make.com/gh39lk2rhsdmoeztkx0sjt378k5rgbay";

    if (WEBHOOK_URL.includes("YOUR_WEBHOOK_URL_HERE")) {
      alert(T.webhookWarning);
      return;
    }

    setIsSyncing(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        playerName: userState.playerName,
        email: userState.email,
        grammarTopic: userState.grammarTopic,
        learningGoal: userState.learningGoal,
        character: selectedCharId,
        messagesCount: messages.length,
        chatLogText: chatHistories[selectedCharId || ALL_CHARACTER_IDS[0]]
          .map(m => `[${m.role === 'user' ? userState.playerName : m.senderName}] ${m.text}`)
          .join('\n')
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(T.syncSuccess);
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      alert(T.syncFailed);
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  // ---------- 会话流程 ----------
  // 把 AI 返回的 location 字符串解析为已知场景键，匹配不到返回 null
  const resolveSceneKey = (locStr: string | undefined): string | null => {
    if (!locStr) return null;
    const lowerLoc = locStr.toLowerCase().trim();
    return Object.keys(SCENE_MAP).find(key => lowerLoc.includes(key)) || null;
  };

  const updateSceneIfMatched = (locStr: string | undefined) => {
    const matchedKey = resolveSceneKey(locStr);
    if (matchedKey) setCurrentScene(matchedKey);
  };

  const enterChat = async (charId: CharacterId, mode: ChatMode) => {
    if (isCustomApi && (!customBaseUrl.trim() || !customModelName.trim())) {
      alert(userState.language === 'en'
        ? 'Custom API selected: please fill in the API Base URL and Model ID on the registration screen first.'
        : '当前选择了自定义 API：请先回到登记页面填写接口地址 (Base URL) 和模型名称 (Model ID)。');
      return;
    }
    audioManager.playSfx('enter_chat'); // 🔊 进入聊天
    setSelectedCharId(charId);
    setLobbySelectedChar(null);
    setChatMode(mode);
    setGameMode(GameMode.CHAT);
    setMessages([]);
    setIsLoading(true);
    setQuizFeedback(null);
    setCurrentQuiz(null);
    setIsDialogueFinished(false);
    setCurrentEmotion('neutral');
    setCurrentOutfit('');
    setCurrentScene(DEFAULT_SCENE);
    setDiceRoll(null);
    replySinceMemoryRef.current = 0;

    const affectionValue = affectionMap[charId] || 0;
    const familiarityValue = familiarityMap[charId] ?? getInitialFamiliarity(charId);
    const fullHistory = chatHistories[charId].filter(m => !m.id.startsWith('err'));
    const pastHistory = fullHistory.slice(-RECENT_HISTORY_COUNT);
    const lastModel = [...fullHistory].reverse().find(m => m.role === 'model');

    // 🔁 有历史 → 静默恢复上次结束时的状态，不重新生成对话（保持连续感）
    if (lastModel) {
      try {
        // 只重建 AI 上下文（resume:false 且有 history → 不生成新回复）
        await startChat(
          CHARACTERS[charId], mode, userState.learningGoal, userState.grammarTopic, userState.language, {
            apiKey: customApiKey, modelName: effectiveModelName, history: pastHistory,
            affection: affectionValue, familiarity: familiarityValue, baseUrl: effectiveBaseUrl,
            memory: memoryMap[charId] || getSeedMemory(charId), resume: false,
            unlockedOutfits: getUnlockedOutfits(charId, familiarityValue, affectionValue),
            unlockedScenes: getUnlockedScenes(familiarityValue),
            encounterOverride: getEncounterOverride(charId)
          }
        );
        // 恢复上次最后一条 AI 消息的画面（表情/服装/场景），并把输入框直接就绪
        setMessages([lastModel]);
        setCurrentEmotion(lastModel.emotion || 'neutral');
        setCurrentOutfit(lastModel.outfit || '');
        updateSceneIfMatched(lastModel.location);
        setIsDialogueFinished(true);
      } catch (error: any) {
        const errMsg: Message = {
          id: 'err-' + Date.now(), role: 'model', text: `${T.connectionError}: ${error.message}`, pages: [{ type: 'speech', text: `(发生连接错误: ${error.message}。请点击左上角【主菜单】更换模型或检查网络。)` }], senderName: 'System'
        };
        setMessages([errMsg]);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
      return;
    }

    // 🆕 无历史 → 生成开场。陌生角色演"初対面"，已认识的角色演"日常的一天"，
    // 基调参考各自的手写脚本：firstMeeting 是"第一次正经说话"的专用脚本，
    // 没写的角色回退到 firstMessage（对已认识的角色，那就是日常的一天）。
    const profile = getRelationshipProfile(charId);
    const encounterOverride = getEncounterOverride(charId);
    const openingBrief = buildOpeningBrief(
      encounterOverride?.origin || profile.origin,
      profile.firstMeeting || CHARACTERS[charId].firstMessage
    ) + buildPrologueBrief(storyFlags, charId);

    const stream = makeStreamHandler(charId, true);
    try {
      const result = await startChat(
        CHARACTERS[charId], mode, userState.learningGoal, userState.grammarTopic, userState.language, {
          apiKey: customApiKey, modelName: effectiveModelName, history: [],
          affection: affectionValue, familiarity: familiarityValue, baseUrl: effectiveBaseUrl,
          memory: memoryMap[charId] || getSeedMemory(charId), resume: false,
          unlockedOutfits: getUnlockedOutfits(charId, familiarityValue, affectionValue),
          unlockedScenes: getUnlockedScenes(familiarityValue),
          openingBrief,
          encounterOverride,
          onPage: stream.onPage
        }
      );

      const greetingMsg: Message = {
        id: stream.state.msgId || ('init-' + Date.now()),
        role: 'model',
        text: result.pages.map(p => p.text).join(' '),
        pages: result.pages,
        vocabulary: result.vocabulary,
        emotion: result.emotion,
        outfit: result.outfit,
        location: result.location,
        senderName: CHARACTERS[charId].name,
        quiz: result.quiz
      };

      setIsStreaming(false);
      setMessages(prev => stream.state.msgId ? prev.map(m => m.id === stream.state.msgId ? greetingMsg : m) : [greetingMsg]);
      setCurrentEmotion(result.emotion || 'neutral');
      if (result.outfit) setCurrentOutfit(result.outfit);

      updateSceneIfMatched(result.location);

      setChatHistories(prev => ({ ...prev, [charId]: [...prev[charId], greetingMsg] }));

    } catch (error: any) {
      const errMsg: Message = {
        id: 'err-' + Date.now(), role: 'model', text: `${T.connectionError}: ${error.message}`, pages: [{ type: 'speech', text: `(发生连接错误: ${error.message}。请点击左上角【主菜单】更换模型或检查网络。)` }], senderName: 'System'
      };
      setMessages([errMsg]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // opts.diceRoll：外部指定骰子点数（如答题反馈）；opts.bonusAffection / bonusFamiliarity：额外关系值（原始值）
  const handleSendMessage = async (customPrompt?: string, opts?: { diceRoll?: number; bonusAffection?: number; bonusFamiliarity?: number }) => {
    if (!selectedCharId || (isLoading && !customPrompt)) return;
    if (!customPrompt && !inputText.trim()) return;

    const isInternalTrigger = !!customPrompt;

    // 本轮完整消息列表（用于记忆摘要，避免 state 闭包滞后）
    let turnMessages: Message[] = messages;

    // 如果是系统发送的内部指令（如答题反馈），则不在历史面板展示给玩家
    if (!isInternalTrigger) {
      const userMsg: Message = {
        id: Date.now().toString(), role: 'user', text: inputText, senderName: userState.playerName
      };

      turnMessages = [...turnMessages, userMsg];
      setMessages(prev => [...prev, userMsg]);
      setChatHistories(prev => ({ ...prev, [selectedCharId]: [...prev[selectedCharId], userMsg] }));
      audioManager.playSfx('send'); // 🔊 发送消息
    }

    const currentInput = customPrompt || inputText;
    setInputText('');
    setIsLoading(true);
    setQuizFeedback(null);
    setIsDialogueFinished(false);
    setCurrentQuiz(null);

    // 🎲 掷命运骰子：点数随消息发给 AI，决定回应温度与好感度涨幅。
    // 普通发言现掷；答题反馈等内部指令用 opts.diceRoll 传入的点数。
    // 历史记录里保存的是干净的原文（不含骰子标签）。
    // 骰子权重按親密度取：越熟的人越容易好好接你的话。
    const turnFamiliarity = familiarityMap[selectedCharId] ?? getInitialFamiliarity(selectedCharId);
    let outgoingText = currentInput;
    const roll = opts?.diceRoll ?? (isInternalTrigger ? undefined : rollFateDice(getFamiliarityLevelIndex(turnFamiliarity)));
    if (roll !== undefined) {
      setDiceRoll({ value: roll, key: Date.now() });
      outgoingText = `【運命のダイス: ${roll}/6】\n${currentInput}`;
    }

    // 👗 换装意图识别：玩家明说"换泳装/私服"等且该服装已解锁 → 提示 AI 配合，并在回复后强制换装（兜底）
    const requestedOutfit = isInternalTrigger ? null : detectOutfitRequest(currentInput, selectedCharId, turnFamiliarity, affectionMap[selectedCharId] || 0);
    if (requestedOutfit) {
      outgoingText += `\n【システム：プレイヤーの要望通り、服装を「${requestedOutfit.outfit || 'デフォルト(制服/私服)'}」に着替える描写を自然に入れ、JSONに "outfit":"${requestedOutfit.outfit}" と "outfitChange":true を必ず設定すること。】`;
    }

    const stream = makeStreamHandler(selectedCharId, false);
    try {
      const response = await sendMessage(outgoingText, stream.onPage);
      const modelMsg: Message = {
        id: stream.state.msgId || (Date.now() + 1).toString(), role: 'model', text: response.pages.map(p => p.text).join(' '), pages: response.pages, vocabulary: response.vocabulary, quiz: response.quiz, emotion: response.emotion, outfit: response.outfit, location: response.location, affectionDelta: response.affectionDelta, familiarityDelta: response.familiarityDelta, senderName: CHARACTERS[selectedCharId].name
      };

      setIsStreaming(false);
      setMessages(prev => stream.state.msgId ? prev.map(m => m.id === stream.state.msgId ? modelMsg : m) : [...prev, modelMsg]);
      setCurrentEmotion(response.emotion || 'neutral');
      audioManager.playSfx('receive'); // 🔊 收到 AI 回复

      // 👗 换装门控：只认 AI 明确标记的 outfitChange。
      // 这里以前还认「场景切换」，但模型经常只是把 location 的措辞飘一下
      // （"classroom" → "classroom_window"），场景一变，服装就跟着 outfit 字段
      // 一起飘，于是同一段对话里她毫无描写地换了身衣服，下一句又换回来。
      // system prompt 已经明确要求"地点变化若意味着换装，必须同时把 outfitChange
      // 设为 true"，所以这里只信 outfitChange。模型忘了标记的后果是"衣服没换"，
      // 比无缘无故乱换安全得多；玩家明说要换装时，下面的 requestedOutfit 会强制生效。
      const matchedScene = resolveSceneKey(response.location);
      const sceneChanged = !!matchedScene && matchedScene !== currentScene;
      if (sceneChanged) setCurrentScene(matchedScene);
      if (response.outfitChange === true && response.outfit !== undefined) {
        setCurrentOutfit(response.outfit);
      }
      // 兜底：玩家明确要求换装时，无论 AI 是否配合都强制生效（requestedOutfit.outfit 可为 '' = 换回默认）
      if (requestedOutfit) setCurrentOutfit(requestedOutfit.outfit);

      // 🎲 骰子点数保底：高点数保证最低增量（AI 只能加码不能克扣）。
      // 若 AI 判定玩家无礼（返回负值），尊重惩罚、不触发保底。
      // 親密度保底比好感度慷慨：只要好好说了话，人就是会渐渐变熟。
      const aiDelta = response.affectionDelta || 0;
      const flooredDelta = (roll !== undefined && aiDelta >= 0)
        ? Math.max(aiDelta, getDiceAffectionFloor(roll))
        : aiDelta;
      const aiFamDelta = response.familiarityDelta || 0;
      const flooredFamDelta = (roll !== undefined && aiFamDelta >= 0)
        ? Math.max(aiFamDelta, getDiceFamiliarityFloor(roll))
        : aiFamDelta;
      applyRelationship(
        selectedCharId,
        flooredDelta + (opts?.bonusAffection || 0),
        flooredFamDelta + (opts?.bonusFamiliarity || 0)
      );

      setChatHistories(prev => ({ ...prev, [selectedCharId]: [...prev[selectedCharId], modelMsg] }));

      // 🧠 每积累一定回复数，后台自动固化一次长期记忆（不阻塞对话）
      replySinceMemoryRef.current += 1;
      if (replySinceMemoryRef.current >= MEMORY_UPDATE_EVERY) {
        replySinceMemoryRef.current = 0;
        updateCharacterMemory(selectedCharId, [...turnMessages, modelMsg]);
      }

    } catch (error: any) {
      const errMsg: Message = {
        id: 'err-' + Date.now(), role: 'model', text: `Error: ${error.message}`, pages: [{ type: 'speech', text: `(通信中断: ${error.message}。请尝试再说一次或点击左上角返回【主菜单】。)` }], senderName: 'System'
      };
      setMessages(prev => stream.state.msgId ? prev.map(m => m.id === stream.state.msgId ? errMsg : m) : [...prev, errMsg]);
      audioManager.playSfx('error'); // 🔊 通信错误
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // 🔥 测验检测核心：只有 AI 传回了安全且完整的 quiz，才会渲染
  const onDialogueFinished = () => {
    setIsDialogueFinished(true);
    const lastModelMsg = [...messages].reverse().find(m => m.role === 'model');

    if (chatMode === ChatMode.STUDY && lastModelMsg && lastModelMsg.quiz) {
      if (lastModelMsg.quiz.question && Array.isArray(lastModelMsg.quiz.options) && lastModelMsg.quiz.options.length > 0) {
        setCurrentQuiz(lastModelMsg.quiz);
      } else {
        setCurrentQuiz(null);
      }
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (!currentQuiz) return;
    const isCorrect = index === currentQuiz.correctIndex;
    setIsLastAnswerCorrect(isCorrect);
    audioManager.playSfx(isCorrect ? 'quiz_correct' : 'quiz_wrong'); // 🔊 答对 / 答错（柔和）
    const feedbackText = isCorrect ? `✅ ${currentQuiz.explanation}` : `❌ ${currentQuiz.options[currentQuiz.correctIndex]}... ${currentQuiz.explanation}`;
    setQuizFeedback(feedbackText);
    if (isCorrect) {
      gainStat('knowledge', 2, '完美解答 N3 语法测验！', 'Answered N3 Grammar Quiz Correctly!');
    }
    setCurrentQuiz(null);
  };

  // 🔥 导演指令反馈：玩家答题后，给 AI 发送"场外指导"，要求其根据性格做出回应
  // 答对题 → 掷骰按"高 2 级"权重（更易高点数）+ 额外好感度；答错 → 正常掷骰
  const handleContinueAfterFeedback = () => {
    setQuizFeedback(null);
    const wasCorrect = isLastAnswerCorrect;
    setIsLastAnswerCorrect(null);
    if (!selectedCharId) return;

    const levelIndex = getFamiliarityLevelIndex(familiarityMap[selectedCharId] ?? getInitialFamiliarity(selectedCharId));
    const roll = rollFateDice(levelIndex, wasCorrect ? QUIZ_CORRECT_LUCK_LEVELS : 0);

    const prompt = wasCorrect
      ? "【システム：プレイヤーは前の問題に正解しました。あなたのキャラクター性格（ツンデレ、クーデレ等）に合わせて褒めてから、次の会話と次のquizを生成してください。】"
      : "【システム：プレイヤーは前の問題に間違えました。あなたのキャラクター性格に合わせて指摘・解説してから、次の会話と次のquizを生成してください。】";

    // 答对题两条轴都有奖励：她高兴（好感度），也更了解你的水平（親密度）
    handleSendMessage(prompt, {
      diceRoll: roll,
      bonusAffection: wasCorrect ? QUIZ_CORRECT_AFFECTION_BONUS : 0,
      bonusFamiliarity: wasCorrect ? QUIZ_CORRECT_FAMILIARITY_BONUS : 0
    });
  };

  // ---------- 单词本 ----------
  const translateForUser = (text: string) => translateText(text, userState.language, customApiKey, effectiveModelName, effectiveBaseUrl);

  const collectWord = (word: CollectedWord) => {
    audioManager.playSfx('collect'); // 🔊 收藏生词
    setUserState(prev => ({ ...prev, collectedWords: [word, ...prev.collectedWords] }));
  };

  const removeCollectedWord = (id: string) =>
    setUserState(prev => ({ ...prev, collectedWords: prev.collectedWords.filter(w => w.id !== id) }));

  const handleWordAction = (index: number, action: 'up' | 'down' | 'top') => {
    setUserState(prev => {
      const words = [...prev.collectedWords];
      if (action === 'top') { const [item] = words.splice(index, 1); words.unshift(item); }
      else if (action === 'up' && index > 0) [words[index - 1], words[index]] = [words[index], words[index - 1]];
      else if (action === 'down' && index < words.length - 1) [words[index + 1], words[index]] = [words[index], words[index + 1]];
      return { ...prev, collectedWords: words };
    });
  };

  // ---------- 立绘：表情 × 服装 ----------
  // 解析优先级：当前服装+表情(含同义词) → 当前服装+中性 → 裸表情(含同义词) → 裸中性 → 默认。
  // 有服装时优先保持服装一致（宁可丢表情也不换回校服），避免立绘"串装"。
  const getDynamicAvatar = (char: Character): Character => {
    const map = char.emotionMap || {};
    // 模型偶尔会把服装一起写进 emotion（返回 "kimono_happy" 而不是 "happy"）。
    // 这种值恰好也是 emotionMap 的合法键，直接拿去查就会绕过 currentOutfit，
    // 于是同一个场景里她自己换了身衣服，下一句又换回来。
    // 所以先把服装前缀剥掉：服装只由 currentOutfit 决定，emotion 只管表情。
    const rawEmo = currentEmotion || 'neutral';
    const wardrobe = WARDROBE[char.id] || [];
    const strayOutfit = wardrobe.find(o => o && rawEmo.startsWith(`${o}_`));
    const emo = strayOutfit ? rawEmo.slice(strayOutfit.length + 1) : rawEmo;
    // 😳 亲密表情（love/jealous）好感度不到就不给：路人不会红着脸。
    // 模型偶尔仍会输出被门控的表情，这里再兜一次底。
    const romance = affectionMap[char.id] || 0;
    const candidates = [emo, ...(EMOTION_SYNONYMS[emo] || [])].filter(c => isEmotionUnlocked(c, romance));
    const pick = (key: string) => map[key] ? { ...char, avatarUrl: map[key] } : null;

    if (currentOutfit) {
      for (const c of candidates) { const hit = pick(`${currentOutfit}_${c}`); if (hit) return hit; }
      const nf = pick(`${currentOutfit}_neutral`); if (nf) return nf; // 该服装差分不全时，保住服装、退到中性表情
      // 该服装连 neutral 都没有：宁可用这套衣服里**任意**一个表情，也不掉回默认那套。
      // 掉回去的观感是"同一个场景里她突然换了身衣服"，比表情不对劲刺眼得多。
      const sameOutfit = Object.keys(map).find(k => k.startsWith(`${currentOutfit}_`) && map[k]);
      if (sameOutfit) return { ...char, avatarUrl: map[sameOutfit] };
      // 走到这里说明这套服装一张素材都没有（配置写错了），才允许退回默认
    }
    for (const c of candidates) { const hit = pick(c); if (hit) return hit; }
    return pick('neutral') || char;
  };

  const background = <Background bgUrl={bgUrl} customBg={customAssets.backgroundImage} fallbackUrl={SCENE_FALLBACK[currentScene]} />;
  const activeChar = getDynamicAvatar(selectedCharId ? CHARACTERS[selectedCharId] : CHARACTERS[ALL_CHARACTER_IDS[0]]);
  const activeCharDisplayName = selectedCharId
    ? (userState.language === 'en' ? CHARACTERS[selectedCharId].nameEn : CHARACTERS[selectedCharId].name)
    : '';

  return (
    <div className="antialiased font-sans text-gray-900 selection:bg-yellow-500 selection:text-black w-full h-[100dvh] overflow-hidden bg-black" onClickCapture={handleUiClickSfx}>
      {gameMode === GameMode.SETUP && (
        <SetupScreen
          T={T}
          userState={userState}
          setUserState={setUserState}
          setupStep={setupStep}
          setSetupStep={setSetupStep}
          hasAnySave={hasAnySave}
          onLoadRequest={() => setSaveLoadMode('LOAD')}
          onComplete={startPrologue}
          customApiKey={customApiKey}
          onApiKeyChange={handleApiKeyChange}
          customModel={customModel}
          onModelChange={handleModelChange}
          customBaseUrl={customBaseUrl}
          onBaseUrlChange={handleBaseUrlChange}
          customModelName={customModelName}
          onModelNameChange={handleModelNameChange}
          consentGiven={consentGiven}
          setConsentGiven={setConsentGiven}
          background={background}
        />
      )}

      {/* 序章。同意书弹出后、第一天开播后都要让位——
          否则两个 StoryScreen 同时挂载，屏幕上显示的会是序章的台词 */}
      {gameMode === GameMode.PROLOGUE && !prologueResult && !showConsentGate && !playingDay1 && (
        <StoryScreen
          key={prologueSessionKey}
          script={PROLOGUE_SCRIPT}
          scriptVersion={PROLOGUE_SCRIPT_VERSION}
          progressKey={PROLOGUE_PROGRESS_KEY}
          chapterNameZh="序章"
          chapterNameEn="the prologue"
          initialProgress={pendingPrologueProgress}
          onOpenSystemMenu={() => setShowSystemMenu(true)}
          playerName={userState.playerName}
          onSetPlayerName={(name) => setUserState(prev => ({ ...prev, playerName: name }))}
          language={userState.language}
          stats={protagonistStats}
          background={background}
          onEffects={applyStoryEffects}
          onRelations={applyStoryRelations}
          onSceneChange={setCurrentScene}
          onCollectWords={collectStoryWords}
          onUnlockCg={unlockStoryCg}
          onRestore={restoreStoryProgress}
          onFinish={finishPrologue}
        />
      )}

      {prologueResult && (
        <PrologueResultScreen
          language={userState.language}
          result={prologueResult}
          familiarityMap={familiarityMap}
          onContinue={continueFromPrologue}
        />
      )}

      {gameMode === GameMode.LOBBY && (
        <LobbyScreen
          T={T}
          userState={userState}
          customAssets={customAssets}
          visibleLobbyChars={visibleLobbyChars}
          lobbySelectedChar={lobbySelectedChar}
          setLobbySelectedChar={setLobbySelectedChar}
          affectionMap={affectionMap}
          familiarityMap={familiarityMap}
          calendar={gameCalendar}
          stats={protagonistStats}
          onEnterChat={enterChat}
          onOpenSystemMenu={() => setShowSystemMenu(true)}
          onOpenCgGallery={() => setShowCgGallery(true)}
          onOpenRoom={() => setGameMode(GameMode.ROOM)}
          onOpenMap={() => setGameMode(GameMode.MAP)}
          onOpenCalendar={() => setShowCalendar(true)}
          onOpenInventory={() => setShowInventory(true)}
          onOpenProtagonistProfile={() => setShowProtagonistProfile(true)}
          lobbyChars={lobbyChars}
          background={background}
        />
      )}

      {gameMode === GameMode.CHAT && (
        <ChatScreen
          T={T}
          userState={userState}
          character={activeChar}
          displayName={activeCharDisplayName}
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          isDialogueFinished={isDialogueFinished}
          currentQuiz={currentQuiz}
          quizFeedback={quizFeedback}
          inputText={inputText}
          setInputText={setInputText}
          showAutoSave={showAutoSave}
          affection={selectedCharId ? (affectionMap[selectedCharId] || 0) : 0}
          familiarity={selectedCharId ? (familiarityMap[selectedCharId] ?? getInitialFamiliarity(selectedCharId)) : 0}
          affectionToast={affectionToast}
          diceRoll={diceRoll}
          levelUpEvent={levelUpEvent}
          onLevelUpContinue={handleLevelUpContinue}
          onSend={() => handleSendMessage()}
          onDialogueFinished={onDialogueFinished}
          onQuizAnswer={handleQuizAnswer}
          onCloseQuiz={() => setCurrentQuiz(null)}
          onContinueAfterFeedback={handleContinueAfterFeedback}
          onOpenSystemMenu={() => setShowSystemMenu(true)}
          translate={translateForUser}
          onCollectWord={collectWord}
          background={background}
        />
      )}

      {showSystemMenu && (
        <SystemMenu
          T={T}
          language={userState.language}
          wordCount={userState.collectedWords.length}
          showExitToLobby={gameMode === GameMode.CHAT}
          hasAnySave={hasAnySave}
          isSyncing={isSyncing}
          onClose={() => setShowSystemMenu(false)}
          onOpenWordbook={() => { setShowSystemMenu(false); setShowWordbook(true); }}
          onOpenHistory={() => { setShowSystemMenu(false); setShowHistoryLog(true); }}
          onOpenCgGallery={() => { setShowSystemMenu(false); setShowCgGallery(true); }}
          onOpenProtagonistProfile={() => { setShowSystemMenu(false); setShowProtagonistProfile(true); }}
          onOpenCalendar={() => { setShowSystemMenu(false); setShowCalendar(true); }}
          onOpenInventory={() => { setShowSystemMenu(false); setShowInventory(true); }}
          onExitToLobby={() => leaveChat(GameMode.LOBBY)}
          onReturnTitle={() => leaveChat(GameMode.SETUP)}
          onSaveRequest={() => { setShowSystemMenu(false); setSaveLoadMode('SAVE'); }}
          onLoadRequest={() => { setShowSystemMenu(false); setSaveLoadMode('LOAD'); }}
          onExportJson={exportExperimentData}
          onSyncCloud={syncToCloud}
          userState={userState}
          setUserState={setUserState}
          customApiKey={customApiKey}
          onApiKeyChange={handleApiKeyChange}
          customModel={customModel}
          onModelChange={handleModelChange}
          customBaseUrl={customBaseUrl}
          onBaseUrlChange={handleBaseUrlChange}
          customModelName={customModelName}
          onModelNameChange={handleModelNameChange}
        />
      )}

      {showProtagonistProfile && (
        <ProtagonistProfileModal
          stats={protagonistStats}
          playerName={userState.playerName}
          language={userState.language}
          onClose={() => setShowProtagonistProfile(false)}
        />
      )}

      {/* 物品栏。挂在最外层是故意的：房间、大厅、地图、剧情里都能开，
          "我现在都有什么"这个问题不该有回答不了的时候。 */}
      {showInventory && (
        <InventoryScreen
          language={userState.language}
          life={life}
          storyFlags={storyFlags}
          onClose={() => setShowInventory(false)}
        />
      )}

      {showCalendar && (
        <CalendarModal
          calendar={gameCalendar}
          language={userState.language}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {showHistoryLog && (
        <HistoryLogModal
          T={T}
          language={userState.language}
          chatHistories={chatHistories}
          activeTab={activeHistoryTab}
          setActiveTab={setActiveHistoryTab}
          onClose={() => setShowHistoryLog(false)}
        />
      )}

      {showCgGallery && (
        <CgGalleryModal
          language={userState.language}
          affectionMap={affectionMap}
          unlockedCgs={unlockedCgs}
          onClose={() => setShowCgGallery(false)}
        />
      )}

      {showWordbook && (
        <WordbookModal
          T={T}
          words={userState.collectedWords}
          onClose={() => setShowWordbook(false)}
          onClear={() => setUserState(prev => ({ ...prev, collectedWords: [] }))}
          onRemove={removeCollectedWord}
          onMove={handleWordAction}
        />
      )}

      {saveLoadMode && (
        <SaveLoadScreen
          T={T}
          mode={saveLoadMode}
          onClose={() => setSaveLoadMode(null)}
          onSaveSlot={saveGameToSlot}
          onLoadSlot={loadGameFromSlot}
        />
      )}

      {/* 第 1 章：开学第一天。和专属剧情共用同一套引擎 */}
      {playingDay1 && (
        <StoryScreen
          key="day1"
          script={DAY1_SCRIPT}
          scriptVersion={DAY1_VERSION}
          progressKey={DAY1_PROGRESS_KEY}
          chapterNameZh="第 1 章"
          chapterNameEn="Chapter 1"
          language={userState.language}
          stats={protagonistStats}
          background={background}
          playerName={userState.playerName}
          onSetPlayerName={(name) => setUserState(prev => ({ ...prev, playerName: name }))}
          onOpenSystemMenu={() => setShowSystemMenu(true)}
          onEffects={applyStoryEffects}
          onRelations={applyStoryRelations}
          onSceneChange={setCurrentScene}
          onCollectWords={collectStoryWords}
          onUnlockCg={unlockStoryCg}
          onRestore={restoreStoryProgress}
          onFinish={finishDay1}
        />
      )}

      {/* 专属剧情：复用序章那套引擎（打字机 / 选项 / 生词 / CG / 存档续玩全都白拿）。
          剧情播完把 flags 并进全局，让后续剧情和 AI 都知道发生过什么。 */}
      {activeLevelStory && (
        <div className="fixed inset-0 z-[130] overflow-hidden">
        <StoryScreen
          key={`levelstory-${activeLevelStory.def.id}`}
          script={activeLevelStory.def.script || []}
          storyAffection={affectionMap[activeLevelStory.charId] || 0}
          storyFamiliarity={familiarityMap[activeLevelStory.charId] ?? getInitialFamiliarity(activeLevelStory.charId)}
          scriptVersion={`${activeLevelStory.def.id}-v1`}
          progressKey={`kobe_study_story_${activeLevelStory.def.id}`}
          language={userState.language}
          stats={protagonistStats}
          background={background}
          playerName={userState.playerName}
          onSetPlayerName={(name) => setUserState(prev => ({ ...prev, playerName: name }))}
          onOpenSystemMenu={() => setShowSystemMenu(true)}
          onEffects={applyStoryEffects}
          onRelations={applyStoryRelations}
          onSceneChange={setCurrentScene}
          onCollectWords={collectStoryWords}
          onUnlockCg={unlockStoryCg}
          onRestore={restoreStoryProgress}
          onFinish={(flags) => {
            setStoryFlags(prev => ({ ...prev, ...flags }));
            setActiveLevelStory(null);
          }}
        />
        </div>
      )}

      {gameMode === GameMode.MAP && !activeTrip && (
        <MapScreen
          language={userState.language}
          calendar={gameCalendar}
          storyFlags={storyFlags}
          affection={affectionMap}
          familiarity={familiarityMap}
          onClose={() => setGameMode(GameMode.LOBBY)}
          onTravel={startTrip}
        />
      )}

      {activeTrip && (
        <div className="fixed inset-0 z-[130] overflow-hidden">
        <StoryScreen
          key={`trip-${activeTrip.event?.id || activeTrip.loc.id}-${gameCalendar.day}-${gameCalendar.timeSlot}`}
          script={activeTrip.script}
          scriptVersion={`${activeTrip.event?.id || `ambient-${activeTrip.loc.id}`}-v1`}
          progressKey={`kobe_study_trip_${activeTrip.event?.id || activeTrip.loc.id}`}
          chapterNameZh={activeTrip.event ? activeTrip.event.titleZh : activeTrip.loc.nameZh}
          chapterNameEn={activeTrip.event ? activeTrip.event.titleEn : activeTrip.loc.nameEn}
          storyAffection={
            activeTrip.event && activeTrip.event.chars.length === 1
              ? (affectionMap[activeTrip.event.chars[0]] || 0)
              : 0
          }
          storyFamiliarity={
            activeTrip.event && activeTrip.event.chars.length === 1
              ? (familiarityMap[activeTrip.event.chars[0]] ?? getInitialFamiliarity(activeTrip.event.chars[0]))
              : 0
          }
          language={userState.language}
          stats={protagonistStats}
          background={background}
          playerName={userState.playerName}
          onSetPlayerName={(name) => setUserState(prev => ({ ...prev, playerName: name }))}
          onOpenSystemMenu={() => setShowSystemMenu(true)}
          onEffects={applyStoryEffects}
          onRelations={applyStoryRelations}
          onSceneChange={setCurrentScene}
          onCollectWords={collectStoryWords}
          onUnlockCg={unlockStoryCg}
          onRestore={restoreStoryProgress}
          onFinish={finishTrip}
        />
        </div>
      )}

      {gameMode === GameMode.STORE && activeStore && (
        <StoreScreen
          kind={activeStore}
          language={userState.language}
          life={life}
          calendar={gameCalendar}
          onClose={() => { setActiveStore(null); finishTrip({}); }}
          onBuy={buyItem}
          onSell={sellItem}
        />
      )}

      {gameMode === GameMode.GARDEN && activeGarden && (
        <GardenScreen
          site={activeGarden}
          language={userState.language}
          life={life}
          calendar={gameCalendar}
          onClose={() => {
            const fromMap = activeGarden === 'rooftop';
            setActiveGarden(null);
            // 天台是"出了一趟门"，阳台就在自己家里，不该推进时间
            if (fromMap) finishTrip({}); else setGameMode(GameMode.ROOM);
          }}
          onUpdate={fn => setLife(fn)}
          onHarvest={harvested}
        />
      )}

      {gameMode === GameMode.FISHING && activeFishing && (
        <FishingScreen
          spot={activeFishing.id}
          spotNameZh={activeFishing.nameZh}
          spotNameEn={activeFishing.nameEn}
          language={userState.language}
          life={life}
          calendar={gameCalendar}
          onClose={() => { setActiveFishing(null); finishTrip({}); }}
          onCatch={caughtFish}
          onSpendBait={spendBait}
          onOpenDex={() => setShowFishDex(true)}
        />
      )}

      {inKitchen && (
        <KitchenScreen
          language={userState.language}
          life={life}
          onClose={() => { setInKitchen(false); setGameMode(GameMode.ROOM); }}
          onCook={cooked}
        />
      )}

      {showFishDex && (
        <FishDexModal language={userState.language} life={life} onClose={() => setShowFishDex(false)} />
      )}

      {lifeToast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[150] bg-black/85 border border-emerald-500/60 px-5 py-2.5 transform -skew-x-12 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="block transform skew-x-12 text-emerald-300 font-bold text-sm">{lifeToast}</span>
        </div>
      )}

      {gameMode === GameMode.ROOM && (
        <RoomScreen
          language={userState.language}
          calendar={gameCalendar}
          storyFlags={storyFlags}
          onClose={() => setGameMode(GameMode.LOBBY)}
          onOpenWordbook={() => setShowWordbook(true)}
          onSleep={advanceToNextDay}
          plotCount={life.plots.filter(p => p.site === 'balcony').length}
          onOpenBalcony={() => { setActiveGarden('balcony'); setGameMode(GameMode.GARDEN); }}
          onOpenKitchen={() => setInKitchen(true)}
        />
      )}

      {showConsentGate && (
        <ConsentGate
          language={userState.language}
          T={T}
          email={userState.email}
          onEmailChange={(v) => setUserState(prev => ({ ...prev, email: v }))}
          onAgree={acceptConsent}
        />
      )}

      <StatGainToast
        event={statGainEvent}
        language={userState.language}
        total={statGainEvent ? protagonistStats[statGainEvent.stat] : undefined}
        onDismiss={() => setStatGainEvent(null)}
      />
    </div>
  );
};

export default App;

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  /* 🏠 房间可交互物的触碰反馈：呼吸光点 + 扩散涟漪 + 点击冲击环。
     刻意都很慢很淡——房间是待着的地方，不是仪表盘。 */
  @keyframes room-breathe {
    0%, 100% { transform: scale(1);    opacity: 0.72; }
    50%      { transform: scale(1.18); opacity: 1; }
  }
  .room-breathe { animation: room-breathe 3.2s ease-in-out infinite; }

  @keyframes room-ping {
    0%   { transform: translate(-50%, -50%) scale(0.7); opacity: 0.55; }
    70%  { opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(2.9); opacity: 0; }
  }
  .room-ping { animation: room-ping 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite; }

  @keyframes room-burst {
    0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9; }
    100% { transform: translate(-50%, -50%) scale(4.2); opacity: 0; }
  }
  .room-burst { animation: room-burst 0.62s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  @keyframes tachie-breathe {
    0% { transform: scale(1) translateY(0); }
    50% { transform: scale(1.015) translateY(-4px); }
    100% { transform: scale(1) translateY(0); }
  }
  @keyframes tachie-speak {
    0% { transform: translateY(0); }
    20% { transform: translateY(-5px); }
    40% { transform: translateY(-1px); }
    60% { transform: translateY(-4px); }
    80% { transform: translateY(-1px); }
    100% { transform: translateY(0); }
  }
  .tachie-anim-breathe {
    animation: tachie-breathe 4.5s ease-in-out infinite;
    transform-origin: bottom center;
    will-change: transform;
  }
  .tachie-anim-speak {
    animation: tachie-speak 0.45s ease-out;
    transform-origin: bottom center;
  }

  /* 🎬 Galgame 动态立绘动画系统 */
  @keyframes galgame-shock {
    0%   { transform: translateY(0) scale(1); }
    10%  { transform: translateY(-16px) scale(1.04); }
    22%  { transform: translateY(-3px) translateX(-9px) rotate(-2deg); }
    36%  { transform: translateY(2px) translateX(9px) rotate(2deg); }
    50%  { transform: translateY(-1px) translateX(-6px) rotate(-1deg); }
    64%  { transform: translateY(1px) translateX(6px) rotate(1deg); }
    78%  { transform: translateY(0) translateX(-3px) rotate(-0.5deg); }
    90%  { transform: translateY(0) translateX(2px) rotate(0deg); }
    100% { transform: translateY(0) translateX(0) scale(1); }
  }

  @keyframes galgame-hop {
    0%   { transform: translateY(0) scale(1); }
    20%  { transform: translateY(-24px) scale(0.97, 1.05); }
    40%  { transform: translateY(0) scale(1.04, 0.96); }
    60%  { transform: translateY(-12px) scale(0.99, 1.02); }
    80%  { transform: translateY(0) scale(1.01, 0.99); }
    100% { transform: translateY(0) scale(1); }
  }

  @keyframes galgame-shy {
    0%   { transform: translateY(0) scale(1) rotate(0deg); }
    22%  { transform: translateY(8px) scale(0.97, 0.98) rotate(-2deg); }
    45%  { transform: translateY(4px) scale(0.98, 0.99) rotate(2deg); }
    68%  { transform: translateY(6px) scale(0.97, 0.98) rotate(-1.2deg); }
    88%  { transform: translateY(2px) scale(0.99, 0.99) rotate(0.6deg); }
    100% { transform: translateY(0) scale(1) rotate(0deg); }
  }

  @keyframes galgame-droop {
    0%   { transform: translateY(0) scale(1); }
    35%  { transform: translateY(18px) scale(0.97, 0.96) rotate(-1.5deg); }
    70%  { transform: translateY(12px) scale(0.98, 0.97) rotate(-0.8deg); }
    100% { transform: translateY(14px) scale(0.98, 0.97) rotate(-1deg); }
  }

  @keyframes galgame-think {
    0%   { transform: rotate(0deg) translateY(0); }
    40%  { transform: rotate(3.5deg) translateY(-8px) scale(1.01); }
    75%  { transform: rotate(2.5deg) translateY(-5px) scale(1.01); }
    100% { transform: rotate(2deg) translateY(-4px) scale(1.01); }
  }

  /* 点击立绘：阻尼式的轻微回弹。
     幅度刻意压到原来的五分之一——大幅挤压会让立绘看起来像贴纸，
     现在的二游都是很克制的一下。 */
  @keyframes galgame-poke {
    0%   { transform: scale(1) translateY(0) rotate(0deg); }
    18%  { transform: scale(1.012, 0.988) translateY(2px) rotate(-0.5deg); }
    42%  { transform: scale(0.995, 1.005) translateY(-3px) rotate(0.4deg); }
    68%  { transform: scale(1.003, 0.997) translateY(1px) rotate(-0.15deg); }
    100% { transform: scale(1) translateY(0) rotate(0deg); }
  }

  /* 触点柔光 */
  @keyframes touch-bloom {
    0%   { opacity: 0;    transform: translate(-50%, -50%) scale(0.5); }
    18%  { opacity: 0.95; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0;    transform: translate(-50%, -50%) scale(1.35); }
  }
  .touch-bloom { animation: touch-bloom 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  @keyframes touch-ring {
    0%   { opacity: 0.85; transform: translate(-50%, -50%) scale(0.5); }
    100% { opacity: 0;    transform: translate(-50%, -50%) scale(3.6); }
  }
  .touch-ring { animation: touch-ring 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  /* 上浮的光尘 */
  @keyframes touch-mote {
    0%   { opacity: 0;   transform: translate(-50%, 0) scale(0.6); }
    22%  { opacity: 1;   transform: translate(-50%, -18px) scale(1); }
    100% { opacity: 0;   transform: translate(-50%, -52px) scale(0.5); }
  }
  .touch-mote { animation: touch-mote 1s cubic-bezier(0.22, 0.9, 0.3, 1) forwards; }

  @keyframes emotion-bubble-pop {
    0%   { transform: scale(0) translateY(12px); opacity: 0; }
    50%  { transform: scale(1.3) translateY(-6px); opacity: 1; }
    75%  { transform: scale(0.92) translateY(0); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }

  @keyframes emotion-bubble-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-7px) rotate(4deg); }
  }

  .galgame-anim-shock {
    animation: galgame-shock 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform-origin: bottom center;
  }
  .galgame-anim-hop {
    animation: galgame-hop 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    transform-origin: bottom center;
  }
  .galgame-anim-shy {
    animation: galgame-shy 0.85s ease-in-out both;
    transform-origin: bottom center;
  }
  .galgame-anim-droop {
    animation: galgame-droop 0.95s ease-out both;
    transform-origin: bottom center;
  }
  .galgame-anim-think {
    animation: galgame-think 0.75s ease-out both;
    transform-origin: bottom center;
  }
  .galgame-anim-poke {
    animation: galgame-poke 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    transform-origin: bottom center;
  }
  .emotion-bubble {
    animation: emotion-bubble-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
               emotion-bubble-float 2.2s ease-in-out 0.35s infinite;
  }
  @keyframes dice-shake {
    0%   { transform: rotate(0deg) translateY(0); }
    25%  { transform: rotate(-24deg) translateY(-2px); }
    50%  { transform: rotate(18deg) translateY(1px); }
    75%  { transform: rotate(-12deg) translateY(-1px); }
    100% { transform: rotate(0deg) translateY(0); }
  }
  .dice-rolling {
    display: inline-block;
    animation: dice-shake 0.28s ease-in-out infinite;
  }
  @keyframes dice-land {
    0%   { transform: scale(1.9); }
    55%  { transform: scale(0.88); }
    100% { transform: scale(1); }
  }
  .dice-landed {
    animation: dice-land 0.45s cubic-bezier(0.2, 0.8, 0.3, 1.2);
  }
  ruby {
    ruby-position: over;
    ruby-align: center;
  }
  .lobby-scroll::-webkit-scrollbar { height: 6px; }
  .lobby-scroll::-webkit-scrollbar-track { background: transparent; }
  .lobby-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 3px; }
  .lobby-scroll::-webkit-scrollbar-thumb:hover { background: rgba(250,204,21,0.5); }
  rt {
    font-size: 0.6em;
    color: #fbbf24;
  }
`;
document.head.appendChild(styleSheet);
