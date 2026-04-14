import { 
  GoogleGenerativeAI, 
  SchemaType, 
  Schema, 
  ChatSession, 
  GenerateContentResult 
} from "@google/generative-ai";
import { Character, ChatMode, N3GrammarTopic, DialoguePage, WordReading, Message, Language } from '../types';

// 🔥 修复 1：把超时时间从 30 秒延长到 60 秒，给 3.0 Pro 充足的思考时间
const TIMEOUT_MS = 60000; 

const WARDROBE: Record<string, string[]> = {
  'asuka':  ['casual', 'gym', 'swim', 'maid', 'autumn'],
  'hikari': ['casual', 'gym', 'swim', 'yukata', 'autumn'],
  'rei':    ['casual', 'lab', 'gym', 'swim', 'kimono'],
  'ren':    ['casual', 'gym', 'fantasy', 'butler', 'lecturing'],
  'haku':   ['casual', 'apron', 'summer', 'prince']
};

let currentProvider: 'google' | 'deepseek' = 'google';
let chatSession: ChatSession | null = null; 
let deepseekHistory: { role: string, content: string }[] = []; 
let currentModelName: string = '';
let currentApiKey: string = '';

const getGenAI = (userApiKey?: string) => {
  const key = userApiKey || (import.meta.env.VITE_GOOGLE_API_KEY as string);
  if (!key) {
    throw new Error("No API Key found.");
  }
  return new GoogleGenerativeAI(key);
};

const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
        promise.then(
            (val) => { clearTimeout(timer); resolve(val); },
            (err) => { clearTimeout(timer); reject(err); }
        );
    });
};

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
    1. **Output Length**: You MUST generate **4 to 6 pages** (array items) for every single turn.
    2. **Separate Action & Speech**:
       - **Do NOT** put actions in parentheses inside speech.
       - **INSTEAD**, create a separate "narration" page BEFORE or AFTER the speech.
    
    **PAGE TYPES:**
    - **Type "narration"**: Third-person descriptive text. Describe expressions or actions.
    - **Type "speech"**: The character's spoken line.

    [SCENE & OUTFIT]
    1. Location: Update 'location' if the narrative moves to a new place.
    2. Outfit: Update 'outfit' only if justified. Codes: [${availableOutfits}]

    [VOCABULARY EXTRACTION RULES]
    Extract 6 to 12 vocabulary words (JLPT N4-N2 level) used in your current response.

    [OUTPUT FORMAT - STRICT JSON]
    You MUST output a single, valid JSON object matching EXACTLY this structure. Do NOT wrap it in Markdown formatting.
    {
      "pages": [
        { "type": "narration", "text": "Descriptive text here..." },
        { "type": "speech", "text": "「Spoken line here...」" }
      ],
      "vocabulary": [ { "word": "漢字", "reading": "かんじ" } ],
      "emotion": "neutral" | "happy" | "angry" | "sad" | "shy" | "surprised",
      "location": "classroom",
      "outfit": "casual" | "",
      "quiz": null
    }`;
};

const parseResponse = (rawText: string) => {
    // 打印原始回复供开发者调试，如果以后再出错，按 F12 就能看到 AI 到底回了什么鬼东西
    console.log("Raw AI Response:", rawText); 

    try {
        if (!rawText) {
             return { pages: [{ type: 'speech', text: "（AI 返回了空数据，可能是触发了安全拦截，请重试。）" }], vocabulary: [], emotion: "neutral", location: "classroom" };
        }

        let cleanText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        let parsedObj: any = null;
        
        const jsonStart = cleanText.indexOf('{');
        const jsonEnd = cleanText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            try {
                parsedObj = JSON.parse(cleanText.substring(jsonStart, jsonEnd + 1));
            } catch (e) {
                console.warn("Partial JSON parse failed, falling back to raw text.");
            }
        }

        if (parsedObj && Object.keys(parsedObj).length > 0) {
            let pages = [];
            
            if (Array.isArray(parsedObj.pages) && parsedObj.pages.length > 0) {
                pages = parsedObj.pages.map((p: any) => {
                    let text = "……";
                    if (typeof p === 'string') text = p;
                    else if (typeof p === 'object' && p !== null) {
                        text = p.text || p.speech || p.content || p.dialogue || p.message || p.narration;
                        if (!text) {
                           const vals = Object.values(p).filter(v => typeof v === 'string');
                           if (vals.length > 0) text = String(vals[0]);
                        }
                    }
                    return { type: p.type || 'speech', text: String(text || "……") };
                });
            } else {
                let rootText = parsedObj.text || parsedObj.speech || parsedObj.message || parsedObj.dialogue || parsedObj.content;
                if (!rootText) {
                    const stringValues = Object.values(parsedObj).filter(v => typeof v === 'string' && v !== parsedObj.emotion && v !== parsedObj.outfit && v !== parsedObj.location);
                    if (stringValues.length > 0) {
                        rootText = stringValues.sort((a: any, b: any) => b.length - a.length)[0];
                    }
                }
                pages = [{ type: 'speech', text: rootText || cleanText }];
            }

            return {
                pages: pages,
                vocabulary: Array.isArray(parsedObj.vocabulary) ? parsedObj.vocabulary : [],
                emotion: parsedObj.emotion || "neutral",
                location: parsedObj.location || "classroom",
                outfit: parsedObj.outfit || "",
                quiz: parsedObj.quiz || null
            };
        }

        if (!cleanText) cleanText = "（……）";
        return {
            pages: [{ type: 'speech', text: cleanText }],
            vocabulary: [],
            emotion: "neutral",
            location: "classroom"
        };

    } catch (e) {
        console.error("Critical extraction failure:", e);
        return { 
            pages: [{ type: 'speech', text: "（系统通信出现未知异常，请点击左上角主菜单重试）" }], 
            vocabulary: [], 
            emotion: "neutral",
            location: "classroom"
        };
    }
};

const handleDeepSeekMessage = async (text: string) => {
    if (!currentApiKey) throw new Error("Please provide a DeepSeek API Key.");
    
    deepseekHistory.push({ role: "user", content: text });

    const requestBody: any = {
        model: currentModelName,
        messages: deepseekHistory,
    };

    if (currentModelName !== 'deepseek-reasoner') {
        requestBody.response_format = { type: "json_object" };
    }

    const fetchPromise = fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentApiKey}`
        },
        body: JSON.stringify(requestBody)
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

    if (modelName.includes('deepseek')) {
        currentProvider = 'deepseek';
        deepseekHistory = [{ 
            role: "system", 
            content: sysPrompt + "\n\nCRITICAL: You MUST output ONLY valid JSON format. Follow the exact keys shown in the schema. NO <think> tags. NO comments." 
        }];
        return await handleDeepSeekMessage("Start the Visual Novel scene. Describe the situation first (narration), then speak. Generate 4-6 pages.");
    } 
    else {
        currentProvider = 'google';
        const genAI = getGenAI(apiKey);
        const actualGoogleModel = modelName === 'gemini-2.5-flash' ? 'gemini-2.0-flash-exp' : modelName;
        const temp = actualGoogleModel.includes('gemini-3') ? 0.7 : 0.85;

        // 🔥 修复 2：彻底删掉 responseSchema，防止 3.0 模型因为格式校验失败直接抛出空数据
        const model = genAI.getGenerativeModel({
            model: actualGoogleModel,
            systemInstruction: sysPrompt,
            generationConfig: { 
                temperature: temp, 
                responseMimeType: "application/json" 
            }
        });

        chatSession = model.startChat({ history: [] });

        if (Array.isArray(history) && history.length > 0) return { pages: [], vocabulary: [] };

        try {
            const result = await withTimeout<GenerateContentResult>(
                chatSession.sendMessage("Start the Visual Novel scene. Describe the situation first (narration), then speak. Generate 4-6 pages."),
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