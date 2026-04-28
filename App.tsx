import React, { useState, useEffect, useRef } from 'react';
import { GameMode, ChatMode, Character, UserState, N3GrammarTopic, CharacterId, Message, CustomAssets, DialoguePage, WordReading, QuizData, CollectedWord, Language } from './types';
import { CHARACTERS, SCENE_MAP, DEFAULT_SCENE, UI_TEXT } from './constants';
import { startChat, sendMessage, translateText } from './services/geminiService';
import CharacterSprite from './components/CharacterSprite';
import DialogueBox from './components/DialogueBox';

const SAVE_SLOT_PREFIX = 'kobe_study_save_v5_slot_';
const API_KEY_STORAGE_KEY = 'kobe_study_user_api_key';
const MODEL_STORAGE_KEY = 'kobe_study_user_model'; 
const MAX_SLOTS = 6;

const AVAILABLE_MODELS = [
  { value: 'deepseek-v4-flash',      label: 'DeepSeek V4 Flash (默认/内置专线)' },
  { value: 'deepseek-v4-pro',        label: 'DeepSeek V4 Pro (最强深度思考)' },
  { value: 'gemini-3-flash-preview', label: 'Gemini 3.0 Flash (谷歌极速预览)' },
  { value: 'gemini-3-pro-preview',   label: 'Gemini 3.0 Pro (谷歌深度推理)' },
  { value: 'gemini-2.5-flash',       label: 'Gemini 2.0 Flash Exp (稳定预览)' },
  { value: 'gemini-1.5-flash-latest',label: 'Gemini 1.5 Flash (经典稳定)' }
];

const App: React.FC = () => {
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
  
  const [customAssets, setCustomAssets] = useState<CustomAssets>({
    backgroundImage: null,
    characters: {
      [CharacterId.ASUKA]: null,
      [CharacterId.HIKARI]: null,
      [CharacterId.REI]: null,
      [CharacterId.REN]: null,
      [CharacterId.HAKU]: null,
    }
  });

  const [selectedCharId, setSelectedCharId] = useState<CharacterId | null>(null);
  const [lobbySelectedChar, setLobbySelectedChar] = useState<CharacterId | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>(ChatMode.FREE_TALK);
  
  const [visibleLobbyChars, setVisibleLobbyChars] = useState<Set<CharacterId>>(new Set());
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistories, setChatHistories] = useState<Record<CharacterId, Message[]>>({
    [CharacterId.ASUKA]: [],
    [CharacterId.HIKARI]: [],
    [CharacterId.REI]: [],
    [CharacterId.REN]: [],
    [CharacterId.HAKU]: [],
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState<boolean | null>(null);
  const [isDialogueFinished, setIsDialogueFinished] = useState(false);
  
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showHistoryLog, setShowHistoryLog] = useState(false);
  const [showWordbook, setShowWordbook] = useState(false);
  const [saveLoadMode, setSaveLoadMode] = useState<'SAVE' | 'LOAD' | null>(null);
  
  const [activeHistoryTab, setActiveHistoryTab] = useState<CharacterId>(CharacterId.ASUKA);
  const [hasAnySave, setHasAnySave] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, text: string } | null>(null);
  const [translationResult, setTranslationResult] = useState<{ original: string, translation: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [currentOutfit, setCurrentOutfit] = useState<string>('');
  const [currentScene, setCurrentScene] = useState<string>(DEFAULT_SCENE);

  const [customApiKey, setCustomApiKey] = useState('');
  const [customModel, setCustomModel] = useState('deepseek-v4-flash');

  const [consentGiven, setConsentGiven] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);

  const bgUrl = SCENE_MAP[currentScene] || SCENE_MAP[DEFAULT_SCENE];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const T = UI_TEXT[userState.language] as Record<string, string>;

  useEffect(() => {
    checkForSaves();
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) setCustomApiKey(storedKey);

    const storedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    if (storedModel) setCustomModel(storedModel);
  }, []);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, quizFeedback, currentQuiz]);

  useEffect(() => {
    if (showHistoryLog) {
      historyEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [showHistoryLog]);

  useEffect(() => {
    if (selectedCharId) {
      setActiveHistoryTab(selectedCharId);
    }
  }, [selectedCharId]);

  useEffect(() => {
    if (gameMode === GameMode.LOBBY) {
      setVisibleLobbyChars(new Set());
      const ids = Object.keys(CHARACTERS) as CharacterId[];
      const timers: ReturnType<typeof setTimeout>[] = [];

      ids.forEach((id, index) => {
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
      if (gameMode === GameMode.CHAT && messages.length > 1 && messages[messages.length - 1].role === 'model') {
          triggerAutoSave();
      }
  }, [messages]);

  const triggerAutoSave = () => {
      if (!selectedCharId) return;
      const timestamp = Date.now();
      const saveData = {
          meta: {
              timestamp,
              playerName: userState.playerName,
              topic: userState.grammarTopic,
              charId: selectedCharId,
              previewText: messages[messages.length - 1]?.text?.substring(0, 30) + '...',
              isAutoSave: true
          },
          data: {
              userState, gameMode, selectedCharId, chatMode, messages, chatHistories, customAssets
          }
      };
      
      try {
          localStorage.setItem(`${SAVE_SLOT_PREFIX}0`, JSON.stringify(saveData));
          checkForSaves();
          setShowAutoSave(true);
          setTimeout(() => setShowAutoSave(false), 2500);
      } catch (e) {
          console.warn("AutoSave failed: Storage might be full.");
      }
  };

  const exportExperimentData = () => {
    const exportPayload = {
      timestamp: new Date().toISOString(),
      playerInfo: userState,
      modelUsed: customModel,
      activeCharacter: selectedCharId,
      mode: chatMode,
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
        chatLogText: chatHistories[selectedCharId || CharacterId.ASUKA]
          .map(m => `[${m.role === 'user' ? userState.playerName : m.senderName}] ${m.text}`)
          .join('\n')
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if(response.ok) {
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
    const timestamp = Date.now();
    const saveData = {
        meta: {
            timestamp,
            playerName: userState.playerName,
            topic: userState.grammarTopic,
            charId: selectedCharId,
            previewText: messages.length > 0 ? messages[messages.length - 1].text.substring(0, 30) + '...' : 'No messages'
        },
        data: {
            userState, gameMode, selectedCharId, chatMode, messages, chatHistories, customAssets
        }
    };
    
    try {
        localStorage.setItem(`${SAVE_SLOT_PREFIX}${slotIndex}`, JSON.stringify(saveData));
        checkForSaves();
        setSaveLoadMode(null);
        setShowSystemMenu(false);
        alert(`${T.gameSaved} (Slot ${slotIndex + 1})`);
    } catch (e) {
        console.error("Save failed", e);
        alert("❌ 存档失败：设备存储空间可能已满，请清理浏览器缓存。");
    }
  };

  const loadGameFromSlot = async (slotIndex: number) => {
    const saved = localStorage.getItem(`${SAVE_SLOT_PREFIX}${slotIndex}`);
    if (!saved) return;

    try {
        const fullData = JSON.parse(saved);
        const data = fullData.data;

        setUserState(prev => ({ ...prev, ...data.userState, language: data.userState.language || 'zh' }));
        setCustomAssets(data.customAssets);
        setSelectedCharId(data.selectedCharId);
        setChatMode(data.chatMode);
        setMessages(data.messages || []);
        
        setChatHistories({
            [CharacterId.ASUKA]: [], [CharacterId.HIKARI]: [], [CharacterId.REI]: [], [CharacterId.REN]: [], [CharacterId.HAKU]: [],
            ...(data.chatHistories || {})
        });
        
        setGameMode(data.gameMode);
        setSaveLoadMode(null);
        setShowSystemMenu(false);
        setSetupStep('MENU');
        
        if (data.gameMode === GameMode.CHAT && data.selectedCharId) {
            setIsLoading(true);
            try {
                await startChat(
                    CHARACTERS[data.selectedCharId as CharacterId], data.chatMode, data.userState.learningGoal, data.userState.grammarTopic, data.userState.language || 'zh', customApiKey, customModel, data.messages
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

  const handleSetupComplete = (name: string, goal: string, topic: N3GrammarTopic) => {
    setUserState(prev => ({ ...prev, playerName: name, learningGoal: goal, grammarTopic: topic }));
    setGameMode(GameMode.LOBBY);
  };

  // 🔥 场景切换模糊匹配助手函数
  const updateSceneIfMatched = (locStr: string | undefined) => {
    if (!locStr) return;
    const lowerLoc = locStr.toLowerCase().trim();
    // 只要返回的字段包含地图键名（如 "The Beach" 包含 "beach"），就切场景
    const matchedKey = Object.keys(SCENE_MAP).find(key => lowerLoc.includes(key));
    if (matchedKey) {
        setCurrentScene(matchedKey);
    }
  };

  const enterChat = async (charId: CharacterId, mode: ChatMode) => {
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

    try {
      const result = await startChat(
          CHARACTERS[charId], mode, userState.learningGoal, userState.grammarTopic, userState.language, customApiKey, customModel 
      );
      const greetingMsg: Message = { 
        id: 'init-' + Date.now(), role: 'model', text: result.pages.map(p => p.text).join(' '), pages: result.pages, vocabulary: result.vocabulary, emotion: result.emotion, outfit: result.outfit, location: result.location, senderName: CHARACTERS[charId].name
      };
      
      setMessages([greetingMsg]);
      setCurrentEmotion(result.emotion || 'neutral');
      if (result.outfit) setCurrentOutfit(result.outfit);
      
      updateSceneIfMatched(result.location); // 确保第一句话就能切场景
      
      setChatHistories(prev => ({ ...prev, [charId]: [...prev[charId], greetingMsg] }));

    } catch (error: any) {
      const errMsg: Message = { 
          id: 'err-' + Date.now(), role: 'model', text: `${T.connectionError}: ${error.message}`, pages: [{ type: 'speech', text: `(发生连接错误: ${error.message}。请点击左上角【主菜单】更换模型或检查网络。)` }], senderName: 'System'
      };
      setMessages([errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    if (!selectedCharId || (isLoading && !customPrompt)) return;
    if (!customPrompt && !inputText.trim()) return;

    const isInternalTrigger = !!customPrompt;
    
    if (!isInternalTrigger) {
      const userMsg: Message = { 
          id: Date.now().toString(), role: 'user', text: inputText, senderName: userState.playerName 
      };
      
      setMessages(prev => [...prev, userMsg]);
      setChatHistories(prev => ({ ...prev, [selectedCharId]: [...prev[selectedCharId], userMsg] }));
    }

    const currentInput = customPrompt || inputText;
    setInputText('');
    setIsLoading(true);
    setQuizFeedback(null);
    setIsDialogueFinished(false);
    setCurrentQuiz(null);

    try {
      const response = await sendMessage(currentInput, false);
      const modelMsg: Message = { 
        id: (Date.now() + 1).toString(), role: 'model', text: response.pages.map(p => p.text).join(' '), pages: response.pages, vocabulary: response.vocabulary, quiz: response.quiz, emotion: response.emotion, outfit: response.outfit, location: response.location, senderName: CHARACTERS[selectedCharId].name
      };

      setMessages(prev => [...prev, modelMsg]);
      setCurrentEmotion(response.emotion || 'neutral');
      if (response.outfit !== undefined) setCurrentOutfit(response.outfit);
      
      updateSceneIfMatched(response.location); // 修复：根据对话动态更新场景背景
      
      setChatHistories(prev => ({ ...prev, [selectedCharId]: [...prev[selectedCharId], modelMsg] }));

    } catch (error: any) {
      const modelMsg: Message = { 
          id: 'err-' + Date.now(), role: 'model', text: `Error: ${error.message}`, pages: [{ type: 'speech', text: `(通信中断: ${error.message}。请尝试再说一次或点击左上角返回【主菜单】。)` }], senderName: 'System'
      };
      setMessages(prev => [...prev, modelMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const onDialogueFinished = () => {
    setIsDialogueFinished(true);
    const lastMsg = messages[messages.length - 1];
    if (chatMode === ChatMode.STUDY && lastMsg?.role === 'model' && lastMsg.quiz && lastMsg.quiz.question && lastMsg.quiz.options?.length > 0) {
      setCurrentQuiz(lastMsg.quiz);
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

  const handleContinueAfterFeedback = () => {
    setQuizFeedback(null);
    const wasCorrect = isLastAnswerCorrect;
    setIsLastAnswerCorrect(null);
    const prompt = wasCorrect ? T.feedbackCorrect : T.feedbackWrong;
    handleSendMessage(prompt);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, text: selection });
    } else {
      setContextMenu(null);
    }
  };

  const handleTranslateSelection = async () => {
    if (!contextMenu) return;
    const text = contextMenu.text;
    setContextMenu(null);
    setIsTranslating(true);
    try {
        const translation = await translateText(text, userState.language, customApiKey, customModel); 
        setTranslationResult({ original: text, translation });
    } finally {
        setIsTranslating(false);
    }
  };

  const handleCollectSelection = async () => {
    if (!contextMenu) return;
    const text = contextMenu.text;
    setContextMenu(null);
    setIsTranslating(true);
    try {
        const translation = await translateText(text, userState.language, customApiKey, customModel);
        const newWord: CollectedWord = { id: Date.now().toString(), original: text, translation: translation, timestamp: Date.now() };
        setUserState(prev => ({ ...prev, collectedWords: [newWord, ...prev.collectedWords] }));
    } finally {
        setIsTranslating(false);
    }
  };

  const removeCollectedWord = (id: string) => setUserState(prev => ({ ...prev, collectedWords: prev.collectedWords.filter(w => w.id !== id) }));
  
  const handleWordAction = (index: number, action: 'up' | 'down' | 'top') => {
    setUserState(prev => {
      const words = [...prev.collectedWords];
      if (action === 'top') { const [item] = words.splice(index, 1); words.unshift(item); }
      else if (action === 'up' && index > 0) [words[index - 1], words[index]] = [words[index], words[index - 1]];
      else if (action === 'down' && index < words.length - 1) [words[index + 1], words[index]] = [words[index], words[index + 1]];
      return { ...prev, collectedWords: words };
    });
  };

  const getDynamicAvatar = (char: Character): Character => {
    const baseEmotion = currentEmotion || 'neutral';
    const outfitKey = currentOutfit ? `${currentOutfit}_${baseEmotion}` : baseEmotion;
    if (char.emotionMap && char.emotionMap[outfitKey]) return { ...char, avatarUrl: char.emotionMap[outfitKey] };
    const fallbackOutfitKey = currentOutfit ? `${currentOutfit}_neutral` : 'neutral';
    if (currentOutfit && char.emotionMap && char.emotionMap[fallbackOutfitKey]) return { ...char, avatarUrl: char.emotionMap[fallbackOutfitKey] };
    if (char.emotionMap && char.emotionMap[baseEmotion]) return { ...char, avatarUrl: char.emotionMap[baseEmotion] };
    return char;
  };

  const renderBackground = () => (
     <div className="absolute inset-0 w-full h-full z-0 bg-gray-900 select-none overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black z-0"></div>
         <img key={bgUrl} src={customAssets.backgroundImage || bgUrl} alt="Background" loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-60 z-10 scale-105 transition-all duration-1000 ease-in-out" style={{ animation: 'breathe 20s ease-in-out infinite' }} />
         <div className="absolute inset-0 bg-black/30 z-20 pointer-events-none" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
     </div>
  );

  const renderSetup = () => {
    return (
        <div className="min-h-[100dvh] relative overflow-hidden font-sans select-none flex items-center justify-center">
            {renderBackground()}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                <div className={`transition-all duration-700 transform ease-in-out ${setupStep === 'MENU' ? 'scale-100 translate-y-0' : 'scale-75 -translate-y-[20vh] opacity-50'}`}>
                     <div className="relative group">
                        <div className="absolute -inset-6 bg-red-600 transform -skew-x-12 blur-sm opacity-80 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="absolute -inset-2 bg-black transform skew-x-12 opacity-80"></div>
                        <h1 className="relative text-5xl md:text-9xl font-black italic tracking-tighter text-white drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] transform -skew-x-6 select-none" style={{textShadow: '8px 8px 0px #000'}}>KOBE<br/><span className="text-yellow-400">STUDY</span></h1>
                        <p className="absolute bottom-2 -right-4 bg-white text-black text-[10px] md:text-xs font-black px-4 py-1 transform skew-x-12 tracking-[0.5em] shadow-[4px_4px_0px_#000]">N3 RESEARCH</p>
                     </div>
                </div>

                {setupStep === 'MENU' && (
                    <div className="mt-20 flex flex-col gap-6 items-center w-full max-w-md animate-in fade-in slide-in-from-bottom-10 duration-500">
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => setUserState(p => ({...p, language: 'zh'}))} className={`px-4 py-2 font-black transform -skew-x-12 border-2 ${userState.language === 'zh' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-black text-white border-white/30 hover:border-white'}`}>中文</button>
                            <button onClick={() => setUserState(p => ({...p, language: 'en'}))} className={`px-4 py-2 font-black transform -skew-x-12 border-2 ${userState.language === 'en' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-black text-white border-white/30 hover:border-white'}`}>ENGLISH</button>
                        </div>
                        <button onClick={() => setSaveLoadMode('LOAD')} disabled={!hasAnySave} className="group relative w-full h-20 md:h-24 bg-black border-4 border-white transform -skew-x-12 hover:bg-yellow-400 hover:border-black transition-all duration-300 shadow-[10px_10px_0px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none hover:-translate-y-1 disabled:opacity-30 disabled:hover:bg-black disabled:hover:border-white"><span className="absolute inset-0 flex items-center justify-center transform skew-x-12 text-2xl md:text-4xl font-black italic tracking-widest text-white group-hover:text-black transition-colors">{T.continue}</span></button>
                        <button onClick={() => setSetupStep('NEW_GAME')} className="group relative w-full h-20 md:h-24 bg-red-600 border-4 border-black transform -skew-x-12 hover:bg-black hover:border-red-600 transition-all duration-300 shadow-[10px_10px_0px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none hover:-translate-y-1"><span className="absolute inset-0 flex items-center justify-center transform skew-x-12 text-2xl md:text-4xl font-black italic tracking-widest text-white group-hover:text-red-500 transition-colors">{T.newSession}</span></button>
                    </div>
                )}

                {setupStep === 'NEW_GAME' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 p-2 md:p-4">
                        <div className="relative w-full max-w-3xl bg-black border-4 border-white transform -skew-x-2 p-6 md:p-14 shadow-[15px_15px_0px_rgba(215,38,56,1)] overflow-y-auto max-h-[95dvh]">
                            <button onClick={() => setSetupStep('MENU')} className="absolute top-2 right-2 md:-top-8 md:-left-8 bg-yellow-400 text-black w-10 h-10 md:w-16 md:h-16 flex items-center justify-center font-black text-xl md:text-2xl border-2 md:border-4 border-black hover:bg-white hover:scale-110 transition-all z-50 transform skew-x-2 shadow-xl">✕</button>
                            <h2 className="text-3xl md:text-5xl font-black text-white italic mb-6 md:mb-10 border-b-4 md:border-b-8 border-red-600 pb-2 md:pb-4 tracking-tighter uppercase transform skew-x-2 flex items-baseline gap-2 md:gap-4"><span className="text-red-600 text-4xl md:text-6xl">01</span> {T.registration}</h2>

                            <div className="space-y-6 md:space-y-8 transform skew-x-2">
                                <div className="group relative mt-4">
                                    <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase transform -skew-x-12 border-2 border-black group-focus-within:bg-red-500 group-focus-within:text-white transition-colors z-20">{T.codeName}</label>
                                    <input type="text" value={userState.playerName} onChange={(e) => setUserState(prev => ({...prev, playerName: e.target.value}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-lg md:text-2xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-yellow-400 focus:bg-zinc-800 outline-none transition-all placeholder-white/10 shadow-inner" placeholder={T.enterName} />
                                </div>

                                <div className="group relative mt-4">
                                    <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase transform -skew-x-12 border-2 border-black group-focus-within:bg-green-500 group-focus-within:text-white transition-colors z-20">{T.emailLabel || 'Email'}</label>
                                    <input type="email" value={userState.email} onChange={(e) => setUserState(prev => ({...prev, email: e.target.value}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-lg md:text-2xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-green-400 focus:bg-zinc-800 outline-none transition-all placeholder-white/10 shadow-inner" placeholder={T.emailPlaceholder || 'For notifications...'} />
                                </div>

                                <div className="group relative mt-4">
                                    <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase transform -skew-x-12 border-2 border-black group-focus-within:bg-blue-500 group-focus-within:text-white transition-colors z-20">{T.targetGrammar}</label>
                                    <div className="relative">
                                        <select value={userState.grammarTopic} onChange={(e) => setUserState(prev => ({...prev, grammarTopic: e.target.value as N3GrammarTopic}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-base md:text-xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-yellow-400 focus:bg-zinc-800 outline-none transition-all appearance-none cursor-pointer hover:bg-zinc-800 shadow-inner">
                                            {Object.values(N3GrammarTopic).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs">▼</div>
                                    </div>
                                </div>
                                <div className="group relative mt-4">
                                    <label className="absolute -top-4 -left-2 bg-white text-black px-2 md:px-4 py-1 font-black text-xs md:text-sm uppercase transform -skew-x-12 border-2 border-black group-focus-within:bg-yellow-400 group-focus-within:text-black transition-colors z-20">{T.missionObj}</label>
                                    <input type="text" value={userState.learningGoal} onChange={(e) => setUserState(prev => ({...prev, learningGoal: e.target.value}))} className="w-full bg-zinc-900 border-2 md:border-4 border-white/20 text-white text-base md:text-xl px-4 md:px-6 py-3 md:py-5 font-bold focus:border-yellow-400 focus:bg-zinc-800 outline-none transition-all placeholder-white/10 shadow-inner" placeholder={T.enterGoal} />
                                </div>

                                <div className="border-t-2 border-white/10 pt-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                                    <div className="group relative">
                                        <label className="absolute -top-3 -left-2 bg-zinc-800 text-gray-400 px-3 py-1 font-bold text-[10px] md:text-xs uppercase transform -skew-x-12 border border-gray-600 z-20">API Key (Google / DeepSeek)</label>
                                        <div className="absolute -top-3 right-0 flex gap-2 z-30">
                                            <a href="https://platform.deepseek.com/" target="_blank" rel="noreferrer" className="bg-blue-600/90 text-white hover:bg-yellow-400 hover:text-black transition-colors px-2 py-1 font-bold text-[8px] md:text-[10px] transform skew-x-12 shadow-sm flex items-center gap-1"><span>🔑 DeepSeek</span></a>
                                            <a href="https://aistudio.google.com/api-keys?project=gen-lang-client-0367843531" target="_blank" rel="noreferrer" className="bg-red-600/90 text-white hover:bg-yellow-400 hover:text-black transition-colors px-2 py-1 font-bold text-[8px] md:text-[10px] transform skew-x-12 shadow-sm flex items-center gap-1"><span>🔑 Google</span></a>
                                        </div>
                                        <input type="password" value={customApiKey} onChange={handleApiKeyChange} className="w-full bg-black/50 border-2 border-white/10 text-yellow-400 text-sm px-4 md:px-6 py-3 md:py-4 font-mono focus:border-yellow-400 outline-none transition-all placeholder-white/10 shadow-inner" placeholder="留空则自动使用内置 API Key..." />
                                    </div>
                                    <div className="group relative">
                                        <label className="absolute -top-3 -left-2 bg-zinc-800 text-gray-400 px-3 py-1 font-bold text-[10px] md:text-xs uppercase transform -skew-x-12 border border-gray-600 z-20">Model Select</label>
                                        <select value={customModel} onChange={handleModelChange} className="w-full bg-black/50 border-2 border-white/10 text-yellow-400 text-sm px-4 md:px-6 py-3 md:py-4 font-mono focus:border-yellow-400 outline-none transition-all shadow-inner appearance-none cursor-pointer">
                                            {AVAILABLE_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="group relative flex items-start gap-3 md:gap-4 mt-6 md:mt-8 border-2 border-white/20 p-4 md:p-5 bg-black/50 hover:border-yellow-500/50 transition-colors">
                                    <input type="checkbox" id="consent" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="w-5 h-5 md:w-6 md:h-6 mt-1 accent-red-600 cursor-pointer flex-shrink-0" />
                                    <label htmlFor="consent" className="text-[10px] md:text-xs text-gray-300 leading-relaxed cursor-pointer select-none"><span className="font-bold text-yellow-500 uppercase tracking-widest block mb-1">{T.consentTitle}</span>{T.consentText}</label>
                                </div>
                            </div>

                            <div className="mt-8 md:mt-12 flex justify-end transform skew-x-2">
                                <button onClick={() => handleSetupComplete(userState.playerName, userState.learningGoal, userState.grammarTopic)} disabled={!userState.learningGoal.trim() || !userState.playerName.trim() || !consentGiven} className="relative overflow-hidden w-full md:w-auto bg-red-600 hover:bg-white hover:text-red-600 text-white font-black text-xl md:text-2xl py-4 md:py-6 px-8 md:px-16 uppercase tracking-widest transition-all shadow-[6px_6px_0px_#000] md:shadow-[10px_10px_0px_#000] border-2 md:border-4 border-transparent hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-1 active:shadow-none group"><span className="relative z-10">{T.startMission}</span><div className="absolute inset-0 bg-white transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div></button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderLobby = () => (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col">
      {renderBackground()}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex flex-col md:flex-row justify-between items-start z-40 pointer-events-none gap-4">
         <div className="bg-black/80 backdrop-blur text-white px-6 md:px-8 py-3 md:py-4 border-l-4 border-yellow-500 skew-x-12 transform origin-top-left pointer-events-auto shadow-2xl">
             <h2 className="-skew-x-12 text-lg md:text-2xl font-black italic uppercase tracking-tighter">{T.choosePartner}</h2>
             <p className="-skew-x-12 text-yellow-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{T.goal}: {userState.learningGoal}</p>
         </div>
         <div className="flex gap-2 pointer-events-auto self-end md:self-auto">
            <button onClick={() => setShowSystemMenu(true)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-sm border border-white/20 backdrop-blur text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all">⚙️ {T.system}</button>
         </div>
      </div>

      <div className="flex-1 flex flex-row items-stretch w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory md:snap-none md:overflow-hidden z-20 pt-24 md:pt-20 pb-0">
          {(Object.keys(CHARACTERS) as CharacterId[]).map((id, index) => {
              const char = CHARACTERS[id];
              const shouldLoad = visibleLobbyChars.has(id);
              const displayChar = { ...char, avatarUrl: customAssets.characters[id] || (shouldLoad ? char.avatarUrl : '') };
              return (
                  <div key={id} className={`group relative flex-none w-[85vw] snap-center md:flex-1 h-full border-r border-white/5 overflow-hidden cursor-pointer bg-black/40 transition-opacity duration-300`} onClick={() => setLobbySelectedChar(id)}>
                        <div className={`absolute inset-0 opacity-0 md:group-hover:opacity-20 transition-opacity duration-300 ${char.color} bg-gradient-to-t from-black via-transparent to-transparent`}></div>
                        <div className="absolute top-4 right-4 text-7xl md:text-[100px] font-black text-white/5 italic leading-none select-none z-0">0{index + 1}</div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[85%] md:h-[95%] flex items-end justify-center origin-bottom">
                            <CharacterSprite character={displayChar} isSpeaking={false} className="w-full h-full object-contain"/>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 md:pb-10 px-4 md:px-6 flex flex-col items-center md:items-start md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-300">
                             <div className={`h-1 w-8 md:w-12 mb-2 ${char.color}`}></div>
                             <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg">{userState.language === 'en' ? char.nameEn : char.name}</h3>
                             <p className="text-[10px] text-white/70 uppercase tracking-widest hidden md:block">{userState.language === 'en' ? char.roleEn : char.role}</p>
                        </div>
                  </div>
              )
          })}
      </div>

      {lobbySelectedChar && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setLobbySelectedChar(null)}>
              <div className="bg-slate-900 border-2 border-white/10 p-6 md:p-10 rounded-sm max-w-lg w-full flex flex-col items-center gap-4 md:gap-6 shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className={`absolute top-0 left-0 w-full h-1 ${CHARACTERS[lobbySelectedChar].color}`} />
                  <h2 className={`text-3xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-md`}>{userState.language === 'en' ? CHARACTERS[lobbySelectedChar].nameEn : CHARACTERS[lobbySelectedChar].name}</h2>
                  <p className="text-gray-300 text-center text-xs md:text-sm leading-relaxed px-2 md:px-4">{userState.language === 'en' ? CHARACTERS[lobbySelectedChar].descriptionEn : CHARACTERS[lobbySelectedChar].description}</p>
                  <div className="flex flex-col w-full gap-3 md:gap-4 mt-2 md:mt-4">
                      <button onClick={() => enterChat(lobbySelectedChar, ChatMode.FREE_TALK)} className="group relative w-full overflow-hidden bg-indigo-700 hover:bg-indigo-600 text-white font-black py-4 md:py-5 rounded-sm text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-xl"><span className="relative z-10 flex items-center justify-center gap-3">💬 {T.casualTalk}</span></button>
                      <button onClick={() => enterChat(lobbySelectedChar, ChatMode.STUDY)} className="group relative w-full overflow-hidden bg-red-700 hover:bg-red-600 text-white font-black py-4 md:py-5 rounded-sm text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-xl"><span className="relative z-10 flex items-center justify-center gap-3">📚 {T.reviewMode}</span></button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );

  const renderChat = () => {
      const activeChar = getDynamicAvatar(selectedCharId ? CHARACTERS[selectedCharId] : CHARACTERS[CharacterId.ASUKA]);
      const lastModelMsg = [...messages].reverse().find(m => m.role === 'model');

      // 🔥 提取出最后一句话（只留 speech，过滤掉导致截断乱码的动作描写）
      const lastSpeechText = lastModelMsg?.pages?.filter(p => p.type === 'speech').pop()?.text || lastModelMsg?.text || '';

      return (
        <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col" onContextMenu={handleContextMenu} onClick={() => { if(contextMenu) setContextMenu(null); }}>
            {renderBackground()}
            
            <div className={`absolute top-4 right-4 z-[200] bg-black/60 px-3 py-1.5 rounded-sm border border-yellow-500/30 transition-opacity duration-500 pointer-events-none ${showAutoSave ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-[10px] md:text-xs font-bold text-yellow-500 tracking-widest uppercase animate-pulse">{T.autoSaving}</span>
            </div>

            <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-6 flex justify-between items-start pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    <button onClick={() => setShowSystemMenu(true)} className="bg-black/80 px-5 py-3 rounded-sm text-white font-black text-[10px] md:text-xs border border-white/20 hover:border-yellow-500 transition-colors uppercase tracking-[0.2em] shadow-xl">⚙️ {T.system}</button>
                </div>
                <div className="flex flex-wrap justify-end gap-2 max-w-[70%] pointer-events-auto">
                    <div className="bg-black/80 px-4 py-3 text-white/50 text-[10px] font-mono border-b-2 border-red-500 w-full md:w-auto text-right shadow-xl">N3: {userState.playerName.toUpperCase()} | {userState.grammarTopic}</div>
                </div>
            </div>

            <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none pb-0">
                 <div className="relative h-[55dvh] md:h-[80vh] max-h-[85dvh] w-auto aspect-[45/70] flex items-end justify-center pointer-events-auto transition-all duration-500">
                    <CharacterSprite character={activeChar} isSpeaking={lastModelMsg?.role === 'model' && !isLoading && !isDialogueFinished} className="w-full h-full object-contain tachie-anim-breathe" />
                </div>
            </div>

            <div className="absolute bottom-0 w-full min-h-[40vh] bg-gradient-to-t from-black via-black/90 to-transparent z-40 pb-32 md:pb-24 px-4 md:px-8 flex flex-col items-center justify-end pointer-events-none overflow-y-auto">
                
                <div className="pointer-events-auto w-full max-w-5xl flex flex-col items-center">
                    {!isLoading && lastModelMsg?.pages && !isDialogueFinished && (
                        <DialogueBox key={lastModelMsg.id} character={activeChar} pages={lastModelMsg.pages} vocabulary={lastModelMsg.vocabulary || []} onFinish={onDialogueFinished} />
                    )}
                    
                    {isLoading && (
                        <div className="w-full bg-slate-900/90 backdrop-blur-md border-t-2 border-indigo-500 p-8 min-h-[160px] animate-pulse flex flex-col items-center justify-center shadow-2xl">
                          <div className="text-indigo-400 font-black tracking-[1em] text-lg md:text-2xl">{T.generating}</div>
                        </div>
                    )}

                    {(isDialogueFinished || isLoading) && !currentQuiz && (
                        <div className={`w-full flex flex-col gap-4 mt-6 transition-all duration-700 ${isDialogueFinished ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {lastModelMsg && (
                                <div className="w-full px-4 flex flex-col items-start opacity-60">
                                    <span className="text-[10px] text-yellow-500 font-bold uppercase mb-1">▶ {userState.language === 'en' ? CHARACTERS[selectedCharId!].nameEn : CHARACTERS[selectedCharId!].name}</span>
                                    {/* 🔥 使用 line-clamp 替代 substring 截断，完美兼容 HTML 的注音显示 */}
                                    <span className="text-xs text-white italic line-clamp-2 w-full" dangerouslySetInnerHTML={{ __html: lastSpeechText }} />
                                </div>
                            )}
                            <div className="relative flex w-full gap-2 md:gap-4 px-2">
                                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={T.chatPlaceholder} disabled={isLoading} className="w-full bg-slate-900/95 border-2 border-white/20 rounded-full px-6 py-4 md:px-10 md:py-6 text-white text-base md:text-xl focus:outline-none focus:border-yellow-500 transition-all shadow-2xl" />
                                <button onClick={() => handleSendMessage()} disabled={isLoading || !inputText.trim()} className="bg-yellow-600 hover:bg-yellow-500 px-8 py-4 md:px-14 text-gray-900 font-black uppercase tracking-widest transition-all shadow-xl rounded-full text-sm md:text-lg">SEND</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
  };

  const renderSaveLoadScreen = () => {
    if (!saveLoadMode) return null;
    const slots = Array.from({ length: MAX_SLOTS }).map((_, i) => { const raw = localStorage.getItem(`${SAVE_SLOT_PREFIX}${i}`); return { index: i, data: raw ? JSON.parse(raw) : null }; });
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-5xl h-[90dvh] md:h-[85dvh] flex flex-col p-4 md:p-8">
                <div className="flex items-center justify-between mb-6 md:mb-8 border-b-4 border-red-600 pb-2 md:pb-4"><h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase transform -skew-x-6">{saveLoadMode === 'SAVE' ? T.saveData : T.loadData}</h2><button onClick={() => setSaveLoadMode(null)} className="bg-white text-black font-black px-4 py-1 md:px-6 md:py-2 text-sm md:text-base uppercase hover:bg-red-600 hover:text-white transition-colors transform -skew-x-12">{T.close}</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto pb-10">
                    {slots.map((slot) => (
                        <div key={slot.index} onClick={() => { 
                            if (saveLoadMode === 'SAVE') {
                                if (slot.index === 0) { alert(T.autoSaveWarning); return; }
                                saveGameToSlot(slot.index); 
                            } else if (slot.data) {
                                loadGameFromSlot(slot.index); 
                            } 
                        }} className={`relative h-40 md:h-48 border-2 md:border-4 transform transition-all duration-200 cursor-pointer overflow-hidden group ${!slot.data ? 'border-white/20 bg-white/5 hover:border-white/50' : 'border-white bg-zinc-900 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-xl'}`}>
                            <div className="absolute -right-2 -bottom-4 md:-right-4 md:-bottom-8 text-7xl md:text-9xl font-black text-white/5 italic select-none pointer-events-none">{slot.index + 1}</div>
                            <div className="p-4 md:p-6 h-full flex flex-col justify-between relative z-10">
                                {slot.data ? (<><div className="flex justify-between items-start"><div><div className="text-[10px] md:text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">{slot.index === 0 ? T.autoSaveSlot : `${T.file} ${slot.index + 1}`}</div><div className="text-xl md:text-2xl font-black text-white uppercase italic">{slot.data.meta.playerName}</div></div><div className="text-right"><div className="text-[8px] md:text-[10px] text-white/50 font-mono">{new Date(slot.data.meta.timestamp).toLocaleDateString()}</div><div className="text-[8px] md:text-[10px] text-white/50 font-mono">{new Date(slot.data.meta.timestamp).toLocaleTimeString()}</div></div></div><div className="space-y-1"><div className="text-[10px] md:text-xs text-white/70 font-bold bg-white/10 inline-block px-2 py-1">{slot.data.meta.topic}</div><div className="text-[8px] md:text-[10px] text-white/40 italic truncate" dangerouslySetInnerHTML={{__html: `"${slot.data.meta.previewText}"`}}></div></div></>) : (<div className="h-full flex items-center justify-center flex-col text-white/20"><span className="text-3xl md:text-4xl mb-1 md:mb-2">∅</span><span className="font-black uppercase tracking-widest text-xs md:text-sm">{T.noData}</span></div>)}
                            </div>
                            <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  const renderSystemMenu = () => (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4" onClick={() => setShowSystemMenu(false)}>
          <div className="w-full max-w-lg bg-zinc-900 border-2 border-white/10 p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform -skew-x-2 overflow-y-auto max-h-[95dvh]" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter mb-4 border-b-4 border-red-600 pb-2 uppercase">{T.system}</h2>
              
              <div className="flex flex-col gap-3 md:gap-4">
                  <div className="grid grid-cols-2 gap-2 md:gap-3 mb-2">
                      <button onClick={() => { setShowSystemMenu(false); setShowWordbook(true); }} className="bg-yellow-600/90 hover:bg-yellow-500 text-black font-black py-3 md:py-4 rounded-sm text-[10px] md:text-xs uppercase transition-colors shadow-md">{T.wordbook} ({userState.collectedWords.length})</button>
                      <button onClick={() => { setShowSystemMenu(false); setShowHistoryLog(true); }} className="bg-indigo-600/90 hover:bg-indigo-500 text-white font-black py-3 md:py-4 rounded-sm text-[10px] md:text-xs uppercase transition-colors shadow-md">{T.logs}</button>
                  </div>

                  {gameMode === GameMode.CHAT && (
                      <button onClick={() => { setShowSystemMenu(false); setGameMode(GameMode.LOBBY); }} className="group flex items-center justify-between bg-red-900/30 hover:bg-red-800/60 p-4 border border-red-500/30 transition-all">
                          <span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">🚪 {T.exit} (返回休息室)</span>
                      </button>
                  )}
                  <button onClick={() => { setShowSystemMenu(false); setGameMode(GameMode.SETUP); setSetupStep('MENU'); }} className="group flex items-center justify-between bg-red-900/30 hover:bg-red-800/60 p-4 border border-red-500/30 transition-all">
                      <span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">⌂ {userState.language === 'en' ? 'RETURN TO TITLE' : '返回标题画面'}</span>
                  </button>

                  <div className="h-px bg-white/10 my-2" />

                  <button onClick={() => { setShowSystemMenu(false); setSaveLoadMode('SAVE'); }} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 border border-white/10 transition-all"><span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">{T.saveData}</span><span className="text-yellow-500 text-xs font-mono group-hover:translate-x-1 transition-transform">{'>>>'}</span></button>
                  <button onClick={() => { setShowSystemMenu(false); setSaveLoadMode('LOAD'); }} disabled={!hasAnySave} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 border border-white/10 transition-all disabled:opacity-20"><span className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">{T.loadData}</span><span className="text-yellow-500 text-xs font-mono group-hover:translate-x-1 transition-transform">{'>>>'}</span></button>
                  
                  <div className="mt-2 md:mt-4 pt-4 border-t border-white/10">
                     <p className="text-[10px] md:text-xs text-yellow-500 font-bold mb-2 md:mb-3 uppercase tracking-widest">{T.expDataTools}</p>
                     <button onClick={exportExperimentData} className="w-full group flex items-center justify-between bg-blue-900/30 hover:bg-blue-800/60 p-3 md:p-4 border border-blue-500/30 transition-all mb-2">
                         <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">{T.exportJson}</span>
                     </button>
                     <button onClick={syncToCloud} disabled={isSyncing} className="w-full group flex items-center justify-between bg-green-900/30 hover:bg-green-800/60 p-3 md:p-4 border border-green-500/30 transition-all disabled:opacity-50">
                         <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">{isSyncing ? T.syncing : T.syncCloud}</span>
                     </button>
                  </div>

                  <button onClick={() => setShowSystemMenu(false)} className="mt-2 text-center text-white/40 hover:text-white font-black uppercase text-[10px] md:text-xs tracking-[0.5em] transition-colors">{T.cancel}</button>
              </div>
          </div>
      </div>
  );

  const renderWordbook = () => (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-2 md:p-4" onClick={() => setShowWordbook(false)}>
        <div className="w-full max-w-4xl h-[95dvh] md:h-[80dvh] bg-zinc-900 border-2 border-yellow-500/50 shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 md:px-8 py-3 md:py-4"><h2 className="text-yellow-500 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic text-sm md:text-base">{T.wordbook}</h2><div className="flex gap-3 md:gap-4"><button onClick={() => { if(confirm(T.confirmClear)) { setUserState(prev => ({ ...prev, collectedWords: [] })); }}} className="text-white/20 hover:text-red-500 font-black text-[10px] md:text-xs uppercase tracking-widest">{T.clearAll}</button><button onClick={() => setShowWordbook(false)} className="text-white/30 hover:text-red-500 font-black">✕</button></div></div>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-3 md:space-y-4 bg-slate-900/50 scrollbar-hide">
                {userState.collectedWords.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-white/20 italic font-medium"><span className="text-4xl md:text-6xl mb-4">📓</span><p className="text-sm md:text-base">{T.emptyWordbook}</p><p className="text-[8px] md:text-[10px] mt-2 uppercase tracking-widest text-center">{T.emptyWordbookSub}</p></div>) : (userState.collectedWords.map((word, index) => (<div key={word.id} className="group relative bg-white/5 border border-white/10 p-4 md:p-6 rounded-sm hover:border-yellow-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4"><div className="flex-1"><p className="text-white text-lg md:text-xl font-bold mb-1">{word.original}</p><p className="text-yellow-400 font-medium text-sm md:text-base">{word.translation}</p></div><div className="flex items-center justify-between sm:justify-end gap-4"><div className="flex sm:flex-col gap-2 sm:gap-1 sm:mr-4 opacity-100 sm:opacity-30 group-hover:opacity-100 transition-opacity"><button onClick={() => handleWordAction(index, 'top')} className="text-white/50 hover:text-yellow-400 text-sm md:text-xs" title="Pin to top" disabled={index === 0}>🔝</button><div className="flex gap-2 sm:gap-1"><button onClick={() => handleWordAction(index, 'up')} className="text-white/50 hover:text-white text-sm md:text-xs" title="Move Up" disabled={index === 0}>⬆</button><button onClick={() => handleWordAction(index, 'down')} className="text-white/50 hover:text-white text-sm md:text-xs" title="Move Down" disabled={index === userState.collectedWords.length - 1}>⬇</button></div></div><span className="text-[8px] md:text-[10px] text-white/20 font-mono">{new Date(word.timestamp).toLocaleDateString()}</span><button onClick={() => removeCollectedWord(word.id)} className="text-white/20 hover:text-red-500 transition-colors p-2" title="Remove from wordbook"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div></div>)))}
            </div>
        </div>
    </div>
  );

  const renderHistoryLog = () => (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-2 md:p-0" 
         onClick={() => { if (contextMenu) setContextMenu(null); else setShowHistoryLog(false); }}
         onContextMenu={handleContextMenu}
    >
        <div className="w-full max-w-5xl h-[95dvh] md:h-[85dvh] bg-zinc-900 border-2 border-indigo-500/50 shadow-2xl flex flex-col overflow-hidden" 
             onClick={e => { e.stopPropagation(); if (contextMenu) setContextMenu(null); }}>
            <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 md:px-6 py-3 md:py-4"><h2 className="text-indigo-400 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic text-sm md:text-base">{T.logs}</h2><button onClick={() => setShowHistoryLog(false)} className="text-white/30 hover:text-red-500 font-black">✕</button></div>
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                <div className="w-full md:w-64 bg-black/20 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0">{(Object.keys(CHARACTERS) as CharacterId[]).map(id => (<button key={id} onClick={() => setActiveHistoryTab(id)} className={`p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-3 transition-all border-b-4 md:border-b-0 md:border-l-4 ${activeHistoryTab === id ? `bg-white/5 ${CHARACTERS[id].color.replace('bg-', 'border-')}` : 'border-transparent opacity-50 hover:opacity-100'}`}><div className={`w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0`}><img src={CHARACTERS[id].emotionMap['neutral']} className="w-full h-full object-cover" alt="" /></div><span className="font-bold text-white text-[10px] md:text-sm uppercase tracking-wider truncate">{userState.language === 'en' ? CHARACTERS[id].nameEn : CHARACTERS[id].name}</span></button>))}</div>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-900/50">
                    {chatHistories[activeHistoryTab].length === 0 ? (<div className="h-full flex items-center justify-center text-white/20 italic font-medium text-sm">No history found.</div>) : (chatHistories[activeHistoryTab].map((msg) => (<div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}><div className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/30 mb-1 px-1">{msg.senderName || (msg.role === 'user' ? 'You' : CHARACTERS[activeHistoryTab].name)}</div><div className={`max-w-[90%] md:max-w-[80%] p-3 md:p-4 rounded-sm text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-white/10 text-white border border-white/5' : 'bg-indigo-900/20 text-indigo-100 border border-indigo-500/30'}`} dangerouslySetInnerHTML={{ __html: msg.text }}></div></div>)))}
                    <div ref={historyEndRef} />
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="antialiased font-sans text-gray-900 selection:bg-yellow-500 selection:text-black w-full h-[100dvh] overflow-hidden bg-black">
        {gameMode === GameMode.SETUP && renderSetup()}
        {gameMode === GameMode.LOBBY && renderLobby()}
        {gameMode === GameMode.CHAT && renderChat()}
        {showSystemMenu && renderSystemMenu()}
        {showHistoryLog && renderHistoryLog()}
        {showWordbook && renderWordbook()}
        {saveLoadMode && renderSaveLoadScreen()}
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
  ruby {
    ruby-align: center;
  }
  rt {
    font-size: 0.5em;
    color: #fbbf24; 
    line-height: 1;
    transform: translateY(2px);
  }
`;
document.head.appendChild(styleSheet);