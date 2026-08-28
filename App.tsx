import React, { useState, useEffect, useRef } from 'react';
import { GameMode, ChatMode, Character, UserState, N3GrammarTopic, CharacterId, Message, CustomAssets, QuizData, CollectedWord, AffectionMap, MemoryMap } from './types';
import { CHARACTERS, SCENE_MAP, DEFAULT_SCENE, UI_TEXT, ALL_CHARACTER_IDS, VISIBLE_CHARACTER_IDS, createCharacterRecord, AFFECTION_MAX, AFFECTION_DELTA_SCALE, AFFECTION_LEVELS, SAVE_SLOT_PREFIX, API_KEY_STORAGE_KEY, MODEL_STORAGE_KEY, CUSTOM_BASE_URL_STORAGE_KEY, CUSTOM_MODEL_NAME_STORAGE_KEY, CUSTOM_MODEL_VALUE, MAX_SLOTS, RECENT_HISTORY_COUNT, MEMORY_UPDATE_EVERY, SAVE_MESSAGES_LIMIT, SAVE_HISTORY_PER_CHAR, SAVE_MESSAGES_LIMIT_HARD, SAVE_HISTORY_PER_CHAR_HARD, getAffectionLevelIndex, rollFateDice, QUIZ_CORRECT_LUCK_LEVELS, QUIZ_CORRECT_AFFECTION_BONUS, getDiceAffectionFloor, EMOTION_SYNONYMS, detectOutfitRequest, getUnlockedOutfits, getUnlockedScenes, OUTFIT_UNLOCKS, SCENE_UNLOCKS_BY_LEVEL } from './constants';
import { startChat, sendMessage, translateText, summarizeMemory } from './services/geminiService';
import type { DialoguePage } from './types';
import Background from './components/Background';
import SetupScreen from './components/SetupScreen';
import LobbyScreen from './components/LobbyScreen';
import ChatScreen, { AffectionToast } from './components/ChatScreen';
import SystemMenu from './components/SystemMenu';
import WordbookModal from './components/WordbookModal';
import HistoryLogModal from './components/HistoryLogModal';
import SaveLoadScreen from './components/SaveLoadScreen';

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
  const [affectionMap, setAffectionMap] = useState<AffectionMap>(
    createCharacterRecord(() => 0)
  );
  const [affectionToast, setAffectionToast] = useState<AffectionToast | null>(null);

  // 🎲 命运骰子：本回合的点数（发送消息时掷出，展示给玩家）
  const [diceRoll, setDiceRoll] = useState<{ value: number; key: number } | null>(null);

  // 💞 好感度升级事件：触发庆祝画面 + 升级剧情
  const [levelUpEvent, setLevelUpEvent] = useState<{ level: number; key: number } | null>(null);

  // 🧠 长期记忆：每个角色一段滚动摘要；replySinceMemoryRef 记录距上次摘要的回复数
  const [memoryMap, setMemoryMap] = useState<MemoryMap>(createCharacterRecord(() => ''));
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

  const bgUrl = SCENE_MAP[currentScene] || SCENE_MAP[DEFAULT_SCENE];
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

  // ---------- 好感度 ----------
  const applyAffection = (charId: CharacterId, rawDelta: number) => {
    if (!rawDelta) return;
    const delta = rawDelta * AFFECTION_DELTA_SCALE;
    const current = affectionMap[charId] || 0;
    const next = Math.max(0, Math.min(AFFECTION_MAX, current + delta));
    if (next === current) return;

    setAffectionMap(prev => ({ ...prev, [charId]: next }));
    setAffectionToast({ delta, key: Date.now() });

    // 跨越 100 分边界 = 等级提升 → 触发庆祝画面与升级剧情
    const prevLevel = getAffectionLevelIndex(current);
    const nextLevel = getAffectionLevelIndex(next);
    if (nextLevel > prevLevel) {
      setLevelUpEvent({ level: nextLevel + 1, key: Date.now() });
    }
  };

  // 玩家在升级庆祝画面点击继续 → 触发"关系升级"特别场景
  // TODO 剧情系统：以后改为优先播放 LEVEL_STORIES[charId][level] 的手写剧本
  const handleLevelUpContinue = () => {
    if (!levelUpEvent || !selectedCharId) return;
    const lv = levelUpEvent.level;
    const levelDef = AFFECTION_LEVELS[lv - 1];
    setLevelUpEvent(null);

    const newOutfits = (OUTFIT_UNLOCKS[selectedCharId]?.[lv] || []).join(', ');
    const newScenes = (SCENE_UNLOCKS_BY_LEVEL[lv] || []).join(', ');
    handleSendMessage(
      `【システム：プレイヤーとの好感度がLv.${lv}「${levelDef.labelEn}」に到達しました。二人の関係が新しい段階に進んだことをはっきり感じさせる、特別で印象的なシーンをあなたのキャラクター性のままで演出してください。` +
      (newOutfits ? `新しく解放された服装: ${newOutfits}。` : '') +
      (newScenes ? `新しく行ける場所: ${newScenes}。` : '') +
      `これらを自然に活用しても良い。最後は必ず質問で終わること。】`
    );
  };

  // ---------- 存档系统 ----------
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
        customAssets, affectionMap, memoryMap
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
      setAffectionMap({ ...createCharacterRecord(() => 0), ...(data.affectionMap || {}) });
      setMemoryMap({ ...createCharacterRecord(() => ''), ...(data.memoryMap || {}) });

      setGameMode(data.gameMode);
      setSaveLoadMode(null);
      setShowSystemMenu(false);
      setSetupStep('MENU');

      if (data.gameMode === GameMode.CHAT && data.selectedCharId) {
        setIsLoading(true);
        try {
          const charId = data.selectedCharId as CharacterId;
          const affectionValue = (data.affectionMap || {})[charId] || 0;
          await startChat(
            CHARACTERS[charId], data.chatMode, data.userState.learningGoal, data.userState.grammarTopic, data.userState.language || 'zh', {
              apiKey: customApiKey, modelName: effectiveModelName, history: (data.messages || []).slice(-RECENT_HISTORY_COUNT),
              affection: affectionValue, baseUrl: effectiveBaseUrl,
              memory: (data.memoryMap || {})[charId] || '', resume: false,
              unlockedOutfits: getUnlockedOutfits(charId, affectionValue),
              unlockedScenes: getUnlockedScenes(affectionValue)
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
            affection: affectionValue, baseUrl: effectiveBaseUrl,
            memory: memoryMap[charId] || '', resume: false,
            unlockedOutfits: getUnlockedOutfits(charId, affectionValue),
            unlockedScenes: getUnlockedScenes(affectionValue)
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

    // 🆕 无历史 → 生成初次登场问候（流式）
    const stream = makeStreamHandler(charId, true);
    try {
      const result = await startChat(
        CHARACTERS[charId], mode, userState.learningGoal, userState.grammarTopic, userState.language, {
          apiKey: customApiKey, modelName: effectiveModelName, history: [],
          affection: affectionValue, baseUrl: effectiveBaseUrl,
          memory: memoryMap[charId] || '', resume: false,
          unlockedOutfits: getUnlockedOutfits(charId, affectionValue),
          unlockedScenes: getUnlockedScenes(affectionValue),
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

  // opts.diceRoll：外部指定骰子点数（如答题反馈）；opts.bonusAffection：额外好感度（原始值）
  const handleSendMessage = async (customPrompt?: string, opts?: { diceRoll?: number; bonusAffection?: number }) => {
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
    let outgoingText = currentInput;
    const roll = opts?.diceRoll ?? (isInternalTrigger ? undefined : rollFateDice(getAffectionLevelIndex(affectionMap[selectedCharId] || 0)));
    if (roll !== undefined) {
      setDiceRoll({ value: roll, key: Date.now() });
      outgoingText = `【運命のダイス: ${roll}/6】\n${currentInput}`;
    }

    // 👗 换装意图识别：玩家明说"换泳装/私服"等且该服装已解锁 → 提示 AI 配合，并在回复后强制换装（兜底）
    const requestedOutfit = isInternalTrigger ? null : detectOutfitRequest(currentInput, selectedCharId, affectionMap[selectedCharId] || 0);
    if (requestedOutfit) {
      outgoingText += `\n【システム：プレイヤーの要望通り、服装を「${requestedOutfit.outfit || 'デフォルト(制服/私服)'}」に着替える描写を自然に入れ、JSONに "outfit":"${requestedOutfit.outfit}" と "outfitChange":true を必ず設定すること。】`;
    }

    const stream = makeStreamHandler(selectedCharId, false);
    try {
      const response = await sendMessage(outgoingText, stream.onPage);
      const modelMsg: Message = {
        id: stream.state.msgId || (Date.now() + 1).toString(), role: 'model', text: response.pages.map(p => p.text).join(' '), pages: response.pages, vocabulary: response.vocabulary, quiz: response.quiz, emotion: response.emotion, outfit: response.outfit, location: response.location, affectionDelta: response.affectionDelta, senderName: CHARACTERS[selectedCharId].name
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

      // 🎲 骰子点数保底：高点数保证最低好感度增量（AI 只能加码不能克扣）。
      // 若 AI 判定玩家无礼（返回负值），尊重惩罚、不触发保底。
      const aiDelta = response.affectionDelta || 0;
      const flooredDelta = (roll !== undefined && aiDelta >= 0)
        ? Math.max(aiDelta, getDiceAffectionFloor(roll))
        : aiDelta;
      applyAffection(selectedCharId, flooredDelta + (opts?.bonusAffection || 0));

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

    const levelIndex = getAffectionLevelIndex(affectionMap[selectedCharId] || 0);
    const roll = rollFateDice(levelIndex, wasCorrect ? QUIZ_CORRECT_LUCK_LEVELS : 0);

    const prompt = wasCorrect
      ? "【システム：プレイヤーは前の問題に正解しました。あなたのキャラクター性格（ツンデレ、クーデレ等）に合わせて褒めてから、次の会話と次のquizを生成してください。】"
      : "【システム：プレイヤーは前の問題に間違えました。あなたのキャラクター性格に合わせて指摘・解説してから、次の会話と次のquizを生成してください。】";

    handleSendMessage(prompt, {
      diceRoll: roll,
      bonusAffection: wasCorrect ? QUIZ_CORRECT_AFFECTION_BONUS : 0
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
    const candidates = [emo, ...(EMOTION_SYNONYMS[emo] || [])];
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
    50% { transform: scale(1.02) translateY(-3px); }
    100% { transform: scale(1) translateY(0); }
  }
  @keyframes tachie-speak {
    0% { transform: translateY(0); }
    15% { transform: translateY(-4px); }
    30% { transform: translateY(0); }
    45% { transform: translateY(-2px); }
    100% { transform: translateY(0); }
  }
  .tachie-anim-breathe {
    animation: tachie-breathe 5s ease-in-out infinite;
    transform-origin: bottom center;
    will-change: transform;
  }
  .tachie-anim-speak {
    animation: tachie-speak 0.4s ease-out;
    transform-origin: bottom center;
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
