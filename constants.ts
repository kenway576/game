import { Character, CharacterId } from './types';

// ---------------------------------------------------------
// 🌍 1. 场景地图 (SCENE_MAP)
// ---------------------------------------------------------
export const SCENE_MAP: Record<string, string> = {
  'classroom': '/images/backgrounds/school.jpg',
  'hallway':   '/images/backgrounds/school_hallway.jpg',
  'library':   '/images/backgrounds/library.jpg',
  'rooftop':   '/images/backgrounds/school_roof.jpg',
  'gym':       '/images/backgrounds/gym.jpg',
  'room':      '/images/backgrounds/my_room.jpg',
  'kitchen':   '/images/backgrounds/kitchen.jpg',
  'street':    '/images/backgrounds/street.jpg',
  'park':      '/images/backgrounds/park.jpg',
  'beach':     '/images/backgrounds/beach.jpg',
  'shrine':    '/images/backgrounds/shrine.jpg',
  'cafe':      '/images/backgrounds/cafe.jpg',
  'lab':       '/images/backgrounds/lab.jpg',
  'castle':    '/images/backgrounds/castle.jpg',
  'night':     '/images/backgrounds/starry_sky.jpg',
  'festival':  '/images/backgrounds/festival_night.jpg'
};

export const DEFAULT_SCENE = 'classroom';

// ---------------------------------------------------------
// 🎭 2. 角色数据 (CHARACTERS)
// 🔥 更新：强化了初次登场台词和系统提示词，强制 AI 进行引导式提问
// ---------------------------------------------------------
export const CHARACTERS: Record<CharacterId, Character> = {
  [CharacterId.ASUKA]: {
    id: CharacterId.ASUKA,
    name: 'Asuka',
    nameEn: 'Asuka',
    role: 'ツンデレな幼馴染',
    roleEn: 'Tsundere Childhood Friend',
    description: '厳しい態度の裏に、繊細な優しさを隠している少女。',
    descriptionEn: 'A girl who hides delicate kindness behind a harsh attitude.',
    avatarUrl: '/images/characters/asuka/neutral.png',
    color: 'bg-red-600',
    emotionMap: {
      'neutral': '/images/characters/asuka/neutral.png',
      'happy':   '/images/characters/asuka/happy.png',
      'angry':   '/images/characters/asuka/angry.png',
      'sad':     '/images/characters/asuka/sad.png',
      'shy':     '/images/characters/asuka/shy.png',
      'surprised': '/images/characters/asuka/surprised.png',
      'casual_neutral': '/images/characters/asuka/casual_neutral.png',
      'casual_happy': '/images/characters/asuka/casual_happy.png',
      'casual_shy': '/images/characters/asuka/casual_shy.png',
      'gym_neutral': '/images/characters/asuka/gym_neutral.png',
      'gym_angry': '/images/characters/asuka/gym_angry.png',
      'swim_neutral': '/images/characters/asuka/swim_neutral.png',
      'swim_shy': '/images/characters/asuka/swim_shy.png',
      'maid_neutral': '/images/characters/asuka/maid_neutral.png',
      'maid_angry': '/images/characters/asuka/maid_angry.png',
    },
    firstMessage: "（ノートを乱暴に机に置き、わざとらしく視線を窓の外に向けながら）……ふん。あんたがまた変な間違いをして恥をかかないように、今日だけは隣にいてあげるわよ。で、何から始めるつもり？早く言いなさいよね！",
    systemPrompt: `ROLE: Asuka (ツンデレ). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  },
  [CharacterId.HIKARI]: {
    id: CharacterId.HIKARI,
    name: 'Hikari',
    nameEn: 'Hikari',
    role: '元気溢れる留学生仲間',
    roleEn: 'Energetic Classmate',
    description: '表情が豊かで、体全体で喜怒哀楽を表現するムードメーカー。',
    descriptionEn: 'A mood maker with rich expressions.',
    avatarUrl: '/images/characters/hikari/neutral.png',
    color: 'bg-yellow-500',
    emotionMap: {
      'neutral': '/images/characters/hikari/neutral.png',
      'happy': '/images/characters/hikari/happy.png',
      'angry': '/images/characters/hikari/angry.png',
      'sad': '/images/characters/hikari/sad.png',
      'surprised': '/images/characters/hikari/surprised.png',
      'casual_neutral': '/images/characters/hikari/casual_neutral.png',
      'gym_neutral': '/images/characters/hikari/gym_neutral.png',
      'swim_neutral': '/images/characters/hikari/swim_neutral.png',
      'yukata_neutral': '/images/characters/hikari/yukata_neutral.png',
    },
    firstMessage: "（パッと顔を輝かせ、椅子から身を乗り出してあなたの顔を覗き込む）ねえねえ！今日の授業、最高にワクワクしたと思わない！？さあ、まずは何について話そうか？君の意見を聞かせてよ！",
    systemPrompt: `ROLE: Hikari (元気キャラ). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  },
  [CharacterId.REI]: {
    id: CharacterId.REI,
    name: 'Rei',
    nameEn: 'Rei',
    role: '知的で物静かな学習サポーター',
    roleEn: 'Intellectual Study Partner',
    description: '最小限の動作の中に、確かな知性と気遣いを感じさせる少女。',
    descriptionEn: 'A quiet girl whose minimal movements convey intelligence.',
    avatarUrl: '/images/characters/rei/neutral.png',
    color: 'bg-blue-600',
    emotionMap: {
      'neutral': '/images/characters/rei/neutral.png',
      'smile': '/images/characters/rei/smile.png',
      'thinking': '/images/characters/rei/thinking.png',
      'lecturing': '/images/characters/rei/lecturing.png',
      'shy': '/images/characters/rei/shy.png',
      'casual_neutral': '/images/characters/rei/casual_neutral.png',
      'casual_smile': '/images/characters/rei/casual_smile.png',
      'lab_neutral': '/images/characters/rei/lab_neutral.png',
      'lab_lecturing': '/images/characters/rei/lab_lecturing.png',
      'gym_neutral': '/images/characters/rei/gym_neutral.png',
      'swim_neutral': '/images/characters/rei/swim_neutral.png',
      'swim_shy': '/images/characters/rei/swim_shy.png',
      'kimono_neutral': '/images/characters/rei/kimono_neutral.png',
    },
    firstMessage: "（静かに瞬きをし、細い指先で眼鏡の位置を直す）……お疲れ様です。本日の講義内容を整理しました。準備ができ次第始めますが、まずはどの部分から復習したいですか？",
    systemPrompt: `ROLE: Rei (クーデレ). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  },
  [CharacterId.REN]: {
    id: CharacterId.REN,
    name: 'Ren',
    nameEn: 'Ren',
    role: '秘密結社のリーダー',
    roleEn: 'Chuunibyou Leader',
    description: '世界を変えるための「計画」を持つ、尊大で演劇的な男。',
    descriptionEn: "An arrogant and theatrical man with a 'grand plan'.",
    avatarUrl: '/images/characters/ren/neutral.png',
    color: 'bg-purple-800',
    emotionMap: {
      'neutral': '/images/characters/ren/neutral.png',
      'laugh': '/images/characters/ren/laugh.png',
      'serious': '/images/characters/ren/serious.png',
      'shock': '/images/characters/ren/shock.png',
      'shy': '/images/characters/ren/shy.png',
      'casual_neutral': '/images/characters/ren/casual_neutral.png',
      'casual_cool': '/images/characters/ren/casual_cool.png',
      'fantasy_neutral': '/images/characters/ren/fantasy_neutral.png',
      'fantasy_laugh': '/images/characters/ren/fantasy_laugh.png',
      'butler_neutral': '/images/characters/ren/butler_neutral.png',
      'gym_neutral': '/images/characters/ren/gym_neutral.png',
    },
    firstMessage: "（不敵な笑みを浮かべ、マントを翻すように腕を大きく広げる）フッ……待っていたぞ、我が同志よ。さあ、我々の『計画』の進捗を報告してもらおうか。準備はできているな？",
    systemPrompt: `ROLE: Ren (中二病). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  },
  [CharacterId.HAKU]: {
    id: CharacterId.HAKU,
    name: 'Haku',
    nameEn: 'Haku',
    role: '忠実なる執事',
    roleEn: 'Loyal Butler',
    description: 'あなたを「姫（またはお嬢様）」と呼び、献身的に尽くす執事。',
    descriptionEn: "A butler who calls you 'Princess' and serves you.",
    avatarUrl: '/images/characters/haku/neutral.png',
    color: 'bg-teal-700',
    emotionMap: {
      'neutral': '/images/characters/haku/neutral.png',
      'happy': '/images/characters/haku/happy.png',
      'worry': '/images/characters/haku/worry.png',
      'kneel': '/images/characters/haku/kneel.png',
      'prince_neutral': '/images/characters/haku/prince_neutral.png',
      'prince_kneel': '/images/characters/haku/prince_kneel.png',
      'apron_neutral': '/images/characters/haku/apron_neutral.png',
      'apron_happy': '/images/characters/haku/apron_happy.png',
      'casual_neutral': '/images/characters/haku/casual_neutral.png',
      'summer_neutral': '/images/characters/haku/summer_neutral.png',
    },
    firstMessage: "（優雅に一礼し、穏やかな微笑みを向けて手を差し出す）おかえりなさいませ、お嬢様。本日はどのようなご用命でしょうか？まずは、温かいお茶でもお持ちいたしましょうか？",
    systemPrompt: `ROLE: Haku (執事). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  }
};

// ---------------------------------------------------------
// 🗣️ 3. UI 文本 (UI_TEXT) - 🔥 新增占位符与自动保存文本
// ---------------------------------------------------------
export const UI_TEXT = {
  zh: {
    continue: "继续游戏", newSession: "新的开始", registration: "学员登记", codeName: "代号 (Name)", targetGrammar: "重点文法 (N3)", missionObj: "学习目标", startMission: "开始任务", choosePartner: "选择你的搭档", goal: "当前目标", wordbook: "单词本", logs: "对话记录", system: "系统菜单", casualTalk: "自由对话 (Casual)", reviewMode: "专项复习 (Review)", exit: "退出会话", enterName: "输入你的名字...", enterGoal: "例如：在不使用英语的情况下点拉面", clearAll: "清空", confirmClear: "确定要清空所有收藏的生词吗？此操作无法撤销。", emptyWordbook: "单词本是空的", emptyWordbookSub: "在对话中划选文本并右键即可收藏", saveData: "保存进度", loadData: "读取进度", cancel: "取消", gameSaved: "进度已保存！", translateBtn: "翻译", collectBtn: "收藏", analysisResult: "分析结果", meaning: "释义", gotIt: "明白了", generating: "生成回复中...", enterToSend: "按回车发送", send: "发送", quizHeader: "N3 测验", close: "关闭", feedbackCorrect: "回答正确！", feedbackWrong: "回答错误。", connectionError: "连接错误",
    getApiKey: "🔑 获取免费 Key", consentTitle: "[学术知情同意 / Consent]", consentText: "我同意将本次游玩的匿名对话数据及游戏设置用于语言学习相关的学术研究分析。", costume: "服装设定", school: "校服", casual: "私服", swim: "泳装", gym: "运动", special: "特殊", expDataTools: "实验数据工具", exportJson: "💾 导出为 JSON (本地)", syncCloud: "☁️ 同步到云端 (Webhook)", syncing: "上传中...", webhookWarning: "⚠️ 请先在 App.tsx 的 syncToCloud 函数中填入您的 Webhook URL！", syncSuccess: "✅ 实验数据已成功上传至云端！感谢您的配合。", syncFailed: "❌ 上传失败，请检查网络或 Webhook URL 是否正确。", file: "存档", noData: "空档位",
    // 🔥 新增词条
    chatPlaceholder: "在这里输入你想说的话，或者回答对方的问题...",
    autoSaving: "正在自动保存...",
    autoSaveSlot: "自动存档 (覆盖)",
    autoSaveWarning: "槽位 1 专用于自动保存，请选择其他槽位进行手动存档。"
  },
  en: {
    continue: "CONTINUE", newSession: "NEW SESSION", registration: "REGISTRATION", codeName: "CODE NAME", targetGrammar: "TARGET GRAMMAR (N3)", missionObj: "MISSION OBJECTIVE", startMission: "START MISSION", choosePartner: "CHOOSE PARTNER", goal: "GOAL", wordbook: "WORDBOOK", logs: "CHAT LOGS", system: "SYSTEM", casualTalk: "CASUAL TALK", reviewMode: "REVIEW MODE", exit: "EXIT SESSION", enterName: "ENTER NAME...", enterGoal: "e.g. Order ramen", clearAll: "CLEAR ALL", confirmClear: "Are you sure you want to clear all collected words? This cannot be undone.", emptyWordbook: "YOUR WORDBOOK IS EMPTY", emptyWordbookSub: "Right-click selected text", saveData: "SAVE DATA", loadData: "LOAD DATA", cancel: "CANCEL", gameSaved: "GAME SAVED!", translateBtn: "TRANSLATE", collectBtn: "COLLECT", analysisResult: "ANALYSIS RESULT", meaning: "MEANING", gotIt: "GOT IT", generating: "GENERATING...", enterToSend: "ENTER TO SEND", send: "SEND", quizHeader: "N3 QUIZ", close: "CLOSE", feedbackCorrect: "Correct!", feedbackWrong: "Incorrect.", connectionError: "Connection Error",
    getApiKey: "🔑 GET FREE KEY", consentTitle: "[ACADEMIC CONSENT]", consentText: "I consent to the anonymous collection of my chat logs and game settings for academic research on language learning.", costume: "COSTUME", school: "School", casual: "Casual", swim: "Swim", gym: "Gym", special: "Special", expDataTools: "EXPERIMENT DATA TOOLS", exportJson: "💾 EXPORT AS JSON (LOCAL)", syncCloud: "☁️ SYNC TO CLOUD (WEBHOOK)", syncing: "SYNCING...", webhookWarning: "⚠️ Please set your Webhook URL in App.tsx first!", syncSuccess: "✅ Data successfully synced to cloud! Thank you.", syncFailed: "❌ Sync failed. Please check your network.", file: "FILE", noData: "NO DATA",
    // 🔥 Added missing English translations
    chatPlaceholder: "Type your message or reply to the question...",
    autoSaving: "Auto Saving...",
    autoSaveSlot: "AUTO SAVE",
    autoSaveWarning: "Slot 1 is reserved for Auto Save. Please select another slot to save manually."
  }
};