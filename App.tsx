import React, { useState, useEffect, useRef } from 'react';
import { GameMode, ChatMode, Character, UserState, N3GrammarTopic, CharacterId, Message, CustomAssets, QuizData, CollectedWord, AffectionMap, FamiliarityMap, MemoryMap, RelationshipAxis } from './types';
import { CHARACTERS, SCENE_MAP, CHARACTER_ROOMS, DEFAULT_SCENE, UI_TEXT, ALL_CHARACTER_IDS, VISIBLE_CHARACTER_IDS, createCharacterRecord, AFFECTION_MAX, AFFECTION_DELTA_SCALE, AFFECTION_LEVELS, FAMILIARITY_MAX, FAMILIARITY_DELTA_SCALE, FAMILIARITY_LEVELS, SAVE_SLOT_PREFIX, API_KEY_STORAGE_KEY, MODEL_STORAGE_KEY, CUSTOM_BASE_URL_STORAGE_KEY, CUSTOM_MODEL_NAME_STORAGE_KEY, CUSTOM_MODEL_VALUE, MAX_SLOTS, RECENT_HISTORY_COUNT, MEMORY_UPDATE_EVERY, SAVE_MESSAGES_LIMIT, SAVE_HISTORY_PER_CHAR, SAVE_MESSAGES_LIMIT_HARD, SAVE_HISTORY_PER_CHAR_HARD, getAffectionLevelIndex, getFamiliarityLevelIndex, getRomanceCeiling, getInitialFamiliarity, getSeedMemory, getRelationshipProfile, isEmotionUnlocked, rollFateDice, QUIZ_CORRECT_LUCK_LEVELS, QUIZ_CORRECT_AFFECTION_BONUS, QUIZ_CORRECT_FAMILIARITY_BONUS, getDiceAffectionFloor, getDiceFamiliarityFloor, EMOTION_SYNONYMS, detectOutfitRequest, getUnlockedOutfits, getUnlockedScenes, OUTFIT_UNLOCKS, SCENE_UNLOCKS_BY_LEVEL, FAMILIARITY_GATED_OUTFIT_LEVELS, ROMANCE_GATED_OUTFIT_LEVELS } from './constants';
import { startChat, sendMessage, translateText, summarizeMemory, buildOpeningBrief } from './services/geminiService';
import type { DialoguePage } from './types';
import Background from './components/Background';
import SetupScreen from './components/SetupScreen';
import LobbyScreen from './components/LobbyScreen';
import ChatScreen, { AffectionToast } from './components/ChatScreen';
import SystemMenu from './components/SystemMenu';
import WordbookModal from './components/WordbookModal';
import HistoryLogModal from './components/HistoryLogModal';
import SaveLoadScreen from './components/SaveLoadScreen';
import CgGalleryModal from './components/CgGalleryModal';

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
  const [saveLoadMode, setSaveLoadMode] = useState<'SAVE' | 'LOAD' | null>(null);

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);

  const bgUrl = (currentScene === 'room' && selectedCharId && CHARACTER_ROOMS[selectedCharId])
    ? CHARACTER_ROOMS[selectedCharId]
    : (SCENE_MAP[currentScene] || SCENE_MAP[DEFAULT_SCENE]);
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

  // 大厅角色渐次登场
  useEffect(() => {
    if (gameMode === GameMode.LOBBY) {
      setVisibleLobbyChars(new Set());
      const timers: ReturnType<typeof setTimeout>[] = [];

      VISIBLE_CHARACTER_IDS.forEach((id, index) => {
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
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === GameMode.CHAT && !isStreaming && messages.length > 1 && messages[messages.length - 1].role === 'model') {
      triggerAutoSave();
    }
  }, [messages, isStreaming]);

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

  // 离开聊天（返回大厅/标题）时固化本次会话的记忆
  const leaveChat = (target: GameMode) => {
    setShowSystemMenu(false);
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
  };

  // 玩家在升级庆祝画面点击继续 → 触发"关系升级"特别场景
  // TODO 剧情系统：以后改为优先播放 LEVEL_STORIES[charId][level] 的手写剧本
  const handleLevelUpContinue = () => {
    if (!levelUpEvent || !selectedCharId) return;
    const { axis, level: lv } = levelUpEvent;
    setLevelUpEvent(null);

    // 解锁内容按轴归属：親密度给场景与日常服装，好感度给亲密服装
    const outfitLevels = axis === 'familiarity' ? FAMILIARITY_GATED_OUTFIT_LEVELS : ROMANCE_GATED_OUTFIT_LEVELS;
    const newOutfits = outfitLevels.includes(lv) ? (OUTFIT_UNLOCKS[selectedCharId]?.[lv] || []).join(', ') : '';
    const newScenes = axis === 'familiarity' ? (SCENE_UNLOCKS_BY_LEVEL[lv] || []).join(', ') : '';

    const header = axis === 'familiarity'
      ? `【システム：プレイヤーとの親密度がLv.${lv}「${FAMILIARITY_LEVELS[lv - 1].labelEn}」に達しました。恋愛的な進展ではありません——「この人には、もう少し本当のことを話してもいい」と思えるようになった、という距離の変化です。呼び方や話し方がここで一段変わることを、さりげなく、しかしはっきり分かる形で見せてください。恋愛感情の描写は絶対に入れないこと。`
      : `【システム：プレイヤーへの好感度がLv.${lv}「${AFFECTION_LEVELS[lv - 1].labelEn}」に達しました。自分の気持ちが一段深くなったことに気づいてしまう、特別で印象的なシーンをあなたのキャラクター性のままで演出してください。`;

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
        previewText: messages.length > 0 ? messages[messages.length - 1].text.substring(0, 30) + '...' : 'No messages',
        isAutoSave
      },
      data: {
        userState, gameMode, selectedCharId, chatMode,
        messages: messages.slice(-msgLimit),
        chatHistories: trimmedHistories,
        customAssets, affectionMap, familiarityMap, memoryMap
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
    if (!selectedCharId) return;
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

      setGameMode(data.gameMode);
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
              unlockedScenes: getUnlockedScenes(familiarityValue)
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
            unlockedScenes: getUnlockedScenes(familiarityValue)
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
    // 基调参考各自的手写脚本（firstMeeting / firstMessage）。
    const profile = getRelationshipProfile(charId);
    const openingBrief = buildOpeningBrief(
      profile.origin,
      profile.origin === 'stranger'
        ? (profile.firstMeeting || CHARACTERS[charId].firstMessage)
        : CHARACTERS[charId].firstMessage
    );

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

      // 👗 换装门控：仅在「场景切换」或「AI 明确标记本回合换衣(outfitChange)」时才换装。
      // 前者应对移动到新场景，后者应对玩家明说"换泳装吧"——同时杜绝无缘无故乱换。
      const matchedScene = resolveSceneKey(response.location);
      const sceneChanged = !!matchedScene && matchedScene !== currentScene;
      if (sceneChanged) setCurrentScene(matchedScene);
      if ((sceneChanged || response.outfitChange === true) && response.outfit !== undefined) {
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
    const feedbackText = isCorrect ? `✅ ${currentQuiz.explanation}` : `❌ ${currentQuiz.options[currentQuiz.correctIndex]}... ${currentQuiz.explanation}`;
    setQuizFeedback(feedbackText);
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

  const collectWord = (word: CollectedWord) =>
    setUserState(prev => ({ ...prev, collectedWords: [word, ...prev.collectedWords] }));

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
    const emo = currentEmotion || 'neutral';
    const map = char.emotionMap || {};
    // 😳 亲密表情（love/jealous）好感度不到就不给：路人不会红着脸。
    // 模型偶尔仍会输出被门控的表情，这里再兜一次底。
    const romance = affectionMap[char.id] || 0;
    const candidates = [emo, ...(EMOTION_SYNONYMS[emo] || [])].filter(c => isEmotionUnlocked(c, romance));
    const pick = (key: string) => map[key] ? { ...char, avatarUrl: map[key] } : null;

    if (currentOutfit) {
      for (const c of candidates) { const hit = pick(`${currentOutfit}_${c}`); if (hit) return hit; }
      const nf = pick(`${currentOutfit}_neutral`); if (nf) return nf; // 该服装差分不全时，保住服装、退到中性表情
    }
    for (const c of candidates) { const hit = pick(c); if (hit) return hit; }
    return pick('neutral') || char;
  };

  const background = <Background bgUrl={bgUrl} customBg={customAssets.backgroundImage} />;
  const activeChar = getDynamicAvatar(selectedCharId ? CHARACTERS[selectedCharId] : CHARACTERS[ALL_CHARACTER_IDS[0]]);
  const activeCharDisplayName = selectedCharId
    ? (userState.language === 'en' ? CHARACTERS[selectedCharId].nameEn : CHARACTERS[selectedCharId].name)
    : '';

  return (
    <div className="antialiased font-sans text-gray-900 selection:bg-yellow-500 selection:text-black w-full h-[100dvh] overflow-hidden bg-black">
      {gameMode === GameMode.SETUP && (
        <SetupScreen
          T={T}
          userState={userState}
          setUserState={setUserState}
          setupStep={setupStep}
          setSetupStep={setSetupStep}
          hasAnySave={hasAnySave}
          onLoadRequest={() => setSaveLoadMode('LOAD')}
          onComplete={() => setGameMode(GameMode.LOBBY)}
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
          onEnterChat={enterChat}
          onOpenSystemMenu={() => setShowSystemMenu(true)}
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
          onExitToLobby={() => leaveChat(GameMode.LOBBY)}
          onReturnTitle={() => leaveChat(GameMode.SETUP)}
          onSaveRequest={() => { setShowSystemMenu(false); setSaveLoadMode('SAVE'); }}
          onLoadRequest={() => { setShowSystemMenu(false); setSaveLoadMode('LOAD'); }}
          onExportJson={exportExperimentData}
          onSyncCloud={syncToCloud}
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
    </div>
  );
};

export default App;

const styleSheet = document.createElement("style");
styleSheet.innerText = `
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

  @keyframes galgame-poke {
    0%   { transform: scale(1); }
    25%  { transform: scale(0.92, 1.08) translateY(-14px); }
    55%  { transform: scale(1.06, 0.94) translateY(3px); }
    80%  { transform: scale(0.98, 1.02) translateY(-4px); }
    100% { transform: scale(1) translateY(0); }
  }

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
