import { 
  GoogleGenerativeAI, 
  SchemaType, 
  Schema, 
  ChatSession, 
  GenerateContentResult 
} from "@google/generative-ai";
import { Character, ChatMode, N3GrammarTopic, DialoguePage, WordReading, Message, Language } from '../types';

const TIMEOUT_MS = 30000; 

const WARDROBE: Record<string, string[]> = {
  'asuka':  ['casual', 'gym', 'swim', 'maid', 'autumn'],
  'hikari': ['casual', 'gym', 'swim', 'yukata', 'autumn'],
  'rei':    ['casual', 'lab', 'gym', 'swim', 'kimono'],
  'ren':    ['casual', 'gym', 'fantasy', 'butler', 'lecturing'],
  'haku':   ['casual', 'apron', 'summer', 'prince']
};

// 🔥 双引擎状态管理
let currentProvider: 'google' | 'deepseek' = 'google';
let chatSession: ChatSession | null = null; // 用于 Google
let deepseekHistory: { role: string, content: string }[] = []; // 用于 DeepSeek
let currentModelName: string = '';
let currentApiKey: string = '';

// 1. 获取 AI 实例 (Google)
const getGenAI = (userApiKey?: string) => {
  const key = userApiKey || (import.meta.env.VITE_GOOGLE_API_KEY as string);
  if (!key) {
    throw new Error("No API Key found.");
  }
  return new GoogleGenerativeAI(key);
};

// 2. 超时控制
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
        promise.then(
            (val) => { clearTimeout(timer); resolve(val); },
            (err) => { clearTimeout(timer); reject(err); }
        );
    });
};

// 3. Prompt
const getSystemInstruction = (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language) => {
  const personaBase = character.systemPrompt;
  const pedagogicalLang = lang === 'en' ? 'English' : 'Chinese (Simplified)';
  const availableOutfits = WARDROBE[character.id] ? WARDROBE[character.id].join(', ') : 'none';
  const quizInstruction = mode === ChatMode.STUDY 
    ? `4. Quiz (quiz): Include 1 multiple-choice question related to "${topic}". Explanation in ${pedagogicalLang}.`
    : `4. Quiz (quiz): Set to null.`;

  return `${personaBase}
    【IMPORTANT: VISUAL NOVEL NARRATIVE MODE】
    Target Level: JLPT N3.
    Current Mode: ${mode === ChatMode.STUDY ? 'STUDY Mode' : 'FREE_TALK Mode'}
    User Language: ${pedagogicalLang}

    [WRITING STYLE - LIGHT NOVEL / GALGAME]
    You are writing a script for a high-quality Japanese visual novel.
    
    **RULES FOR "PAGES" (CRITICAL):**
    1. **Output Length**: You MUST generate **5 to 6 pages** (array items) for every single turn. Do not be short.
    2. **Separate Action & Speech**:
       - **Do NOT** put actions in parentheses inside speech.
       - **INSTEAD**, create a separate "narration" page BEFORE or AFTER the speech.
    
    **PAGE TYPES:**
    - **Type "narration"**: Third-person descriptive text. Describe facial expressions, body language, atmosphere, or internal thoughts.
      - Example: "明日香は頬を赤らめ、机の上にちょこんと座った。上目遣いでこちらを見つめ、もじもじしている。"
    - **Type "speech"**: The character's spoken line. Use brackets.
      - Example: "「……ねえ、私のこと、どう思ってるの？」"

    [SCENE & OUTFIT]
    1. Location: Update 'location' if the narrative moves to a new place (library, room, beach, etc.).
    2. Outfit: Update 'outfit' only if the narrative justifies a change (e.g. getting wet -> casual/swim). Codes: [${availableOutfits}]

    [VOCABULARY EXTRACTION RULES]
    You MUST populate the 'vocabulary' array heavily. 
    1. Extract 6 to 12 words per response.
    2. Target Difficulty: JLPT N4, N3, N2. Include any Kanji compound used.

    [OUTPUT FORMAT - STRICT JSON]
    You must output a single, valid JSON object matching this structure:
    {
      "pages": [
        { "type": "narration", "text": "Descriptive text here..." },
        { "type": "speech", "text": "「Spoken line here...」" }
      ],
      "vocabulary": [ { "word": "漢字", "reading": "かんじ" } ],
      "emotion": "neutral" | "happy" | "angry" | "sad" | "shy" | "surprised",
      "location": "classroom",
      "outfit": "casual" | "",
      "quiz": null (or quiz object)
    }`;
};

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    pages: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { type: { type: SchemaType.STRING }, text: { type: SchemaType.STRING } } } },
    vocabulary: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { word: { type: SchemaType.STRING }, reading: { type: SchemaType.STRING } } } },
    emotion: { type: SchemaType.STRING },
    location: { type: SchemaType.STRING },
    outfit: { type: SchemaType.STRING },
    quiz: { type: SchemaType.OBJECT, properties: { question: { type: SchemaType.STRING }, options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }, correctIndex: { type: SchemaType.NUMBER }, explanation: { type: SchemaType.STRING } } },
  },
  required: ["pages", "vocabulary", "location"],
};

const parseResponse = (text: string) => {
    try {
        let cleanJson = text.trim();
        if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '');
        else if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '');
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("JSON Parse Error:", e, text);
        return { pages: [{ type: 'speech', text: "系统解析错误，请重试..." }], vocabulary: [], emotion: "neutral" };
    }
};

// 🔥 新增：DeepSeek API 调用逻辑
const handleDeepSeekMessage = async (text: string) => {
    if (!currentApiKey) throw new Error("Please provide a DeepSeek API Key.");
    
    deepseekHistory.push({ role: "user", content: text });

    const fetchPromise = fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentApiKey}`
        },
        body: JSON.stringify({
            model: currentModelName,
            messages: deepseekHistory,
            response_format: { type: "json_object" } // DeepSeek V3 专属 JSON 模式
        })
    });

    const response = await withTimeout(fetchPromise, TIMEOUT_MS, "DeepSeek API Timeout.");
    
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek Error ${response.status}: ${errData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const replyText = data.choices[0].message.content;
    deepseekHistory.push({ role: "assistant", content: replyText });

    const parsed = parseResponse(replyText);
    return { 
        pages: parsed.pages || [], 
        vocabulary: parsed.vocabulary || [], 
        quiz: parsed.quiz,
        emotion: parsed.emotion,
        outfit: parsed.outfit,
        location: parsed.location
    };
};

export const translateText = async (text: string, targetLang: Language, apiKey?: string, modelName: string = 'gemini-1.5-flash-latest'): Promise<string> => {
    const target = targetLang === 'en' ? 'English' : 'Chinese (Simplified)';
    
    // 如果选用的是 DeepSeek 模型进行翻译
    if (modelName.includes('deepseek')) {
        try {
            const res = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: "user", content: `Translate the following Japanese text to ${target}. Only provide the translation text: "${text}"` }]
                })
            });
            const data = await res.json();
            return data.choices[0].message.content.trim();
        } catch (e) { return "DeepSeek 翻译失败"; }
    }

    // Google 翻译降级逻辑 (防止 2.5 报错)
    const googleTranslateModel = modelName === 'gemini-2.5-flash' ? 'gemini-1.5-flash-latest' : modelName;
    const genAI = getGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: googleTranslateModel }); 
    try {
        const result = await model.generateContent(`Translate the following Japanese text to ${target}. Only provide the translation text: "${text}"`);
        return result.response.text().trim() || "Translation failed.";
    } catch (error) { return "Google 翻译失败"; }
};

export const startChat = async (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language, apiKey?: string, modelName: string = 'gemini-2.5-flash', history: Message[] = []) => {
    currentModelName = modelName;
    currentApiKey = apiKey || '';
    const sysPrompt = getSystemInstruction(character, mode, goal, topic, lang);

    // 🔥 引擎分流判断
    if (modelName.includes('deepseek')) {
        currentProvider = 'deepseek';
        // DeepSeek 需要手动维护上下文，我们在初始化时将要求注入系统提示词
        deepseekHistory = [{ 
            role: "system", 
            content: sysPrompt + "\n\nCRITICAL: You MUST output ONLY valid JSON format. Do not use markdown blocks if possible." 
        }];
        return await handleDeepSeekMessage("Start the Visual Novel scene. Describe the situation first (narration), then speak. Generate 5-6 pages.");
    } 
    else {
        currentProvider = 'google';
        const genAI = getGenAI(apiKey);
        // 🔥 隐藏的映射：为了防止 Google API 报错找不到 2.5 模型，我们在底层将其请求转交发给 2.0 实验版
        const actualGoogleModel = modelName === 'gemini-2.5-flash' ? 'gemini-2.0-flash-exp' : modelName;
        
        const temp = actualGoogleModel.includes('gemini-3') ? 1.0 : 0.85;

        const model = genAI.getGenerativeModel({
            model: actualGoogleModel,
            systemInstruction: sysPrompt,
            generationConfig: { temperature: temp, responseMimeType: "application/json", responseSchema: responseSchema }
        });

        chatSession = model.startChat({ history: [] });

        if (Array.isArray(history) && history.length > 0) return { pages: [], vocabulary: [] };

        try {
            const result = await withTimeout<GenerateContentResult>(
                chatSession.sendMessage("Start the Visual Novel scene. Describe the situation first (narration), then speak. Generate 5-6 pages."),
                TIMEOUT_MS, "Timeout connecting to AI."
            );
            const parsed = parseResponse(result.response.text());
            return { pages: parsed.pages || [], vocabulary: parsed.vocabulary || [], emotion: parsed.emotion, outfit: parsed.outfit, location: parsed.location };
        } catch (error: any) { throw new Error(error.message); }
    }
};

export const sendMessage = async (text: string, isQuizRequest: boolean = false) => {
  if (currentProvider === 'deepseek') {
      return await handleDeepSeekMessage(text);
  } else {
      if (!chatSession) throw new Error("Session lost. Please re-enter chat.");
      try {
        const result = await withTimeout<GenerateContentResult>(chatSession.sendMessage(text), TIMEOUT_MS, "Server response timeout.");
        const parsed = parseResponse(result.response.text());
        return { pages: parsed.pages, vocabulary: parsed.vocabulary, quiz: parsed.quiz, emotion: parsed.emotion, outfit: parsed.outfit, location: parsed.location };
      } catch (error: any) { throw new Error(error.message); }
  }
};