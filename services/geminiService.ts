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
      - Example: "明日香は頬を赤らめ、そっぽを向いた。"
    - **Type "speech"**: The character's spoken line.
      - Example: "「別に、あんたのためじゃないんだからね！」"

    [SCENE & OUTFIT]
    1. Location: Update 'location' if the narrative moves to a new place.
    2. Outfit: Update 'outfit' only if justified. Codes: [${availableOutfits}]

    [VOCABULARY EXTRACTION RULES]
    Extract 6 to 12 vocabulary words (JLPT N4-N2 level) used in your current response.

    [OUTPUT FORMAT - STRICT JSON]
    You MUST output a single, valid JSON object matching EXACTLY this structure.
    ⚠️ CRITICAL: DO NOT include your internal thoughts, reasoning process (e.g., "(Wait, I need to generate...)", "(Narration)"), or pseudo-code in the JSON values. Only output the final story text! DO NOT use Markdown blocks inside the strings.
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
        
        // 🔥 物理拦截 1：彻底干掉 DeepSeek R1 等推理模型的内置 <think> 标签和内部独白
        cleanJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        
        // 🔥 物理拦截 2：干掉可能导致解析崩溃的 markdown 格式
        cleanJson = cleanJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        // 🔥 物理拦截 3：精准锁定 JSON 的大括号范围，抛弃前后的任何废话
        const jsonStart = cleanJson.indexOf('{');
        const jsonEnd = cleanJson.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
        }

        const parsed = JSON.parse(cleanJson);
        
        // 保底逻辑：如果解析出来确实没有对话，或者格式不对
        if (!parsed.pages || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
            parsed.pages = [{ type: 'speech', text: parsed.text || parsed.speech || parsed.message || "（……）" }];
        } else {
            parsed.pages = parsed.pages.map((p: any) => {
                if (typeof p === 'string') return { type: 'speech', text: p };
                if (typeof p === 'object' && p !== null) {
                    let textContent = p.text || p.speech || p.dialogue || p.content || p.message || p.narration;
                    
                    // 如果还是找不到内容，提取第一个看起来像台词的字符串
                    if (!textContent && Object.keys(p).length > 0) {
                        const values = Object.values(p).filter(v => typeof v === 'string' && v !== 'speech' && v !== 'narration');
                        if (values.length > 0) textContent = values[0];
                    }
                    
                    let typeContent = p.type || 'speech';
                    if (!p.type && (p.narration || p.action)) typeContent = 'narration';

                    if (textContent) {
                        // 🔥 物理拦截 4：清理遗漏到文本内部的导演批注 (比如 "Wait, I need to..." 这种)
                        let finalText = String(textContent);
                        finalText = finalText.replace(/\(Wait,.*?\)/gi, '')
                                             .replace(/\(Narration\)/gi, '')
                                             .replace(/\(Speech\)/gi, '')
                                             .replace(/\(Text: /gi, '')
                                             .replace(/\(Type:.*?, text: /gi, '')
                                             .trim();
                        
                        // 清理掉尾部可能多余的括号
                        if (finalText.endsWith(')')) finalText = finalText.slice(0, -1).trim();

                        return { type: typeContent, text: finalText };
                    }
                }
                return { type: 'speech', text: "……" }; 
            });
        }
        return parsed;
    } catch (e) {
        console.error("JSON Parse Error:", e, text);
        return { 
            pages: [{ type: 'speech', text: "（系统提示：角色语言解析失败，请检查模型格式或发送任意字符重试……）" }], 
            vocabulary: [], 
            emotion: "neutral",
            location: "classroom"
        };
    }
};

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
            response_format: { type: "json_object" } 
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
        // 适当降低 temperature，让 Pro 模型不要那么“发散思维”
        const temp = actualGoogleModel.includes('gemini-3') ? 0.7 : 0.85;

        const model = genAI.getGenerativeModel({
            model: actualGoogleModel,
            systemInstruction: sysPrompt,
            generationConfig: { temperature: temp, responseMimeType: "application/json", responseSchema: responseSchema }
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