import { 
  GoogleGenerativeAI, 
  SchemaType, 
  Schema, 
  ChatSession, 
  GenerateContentResult 
} from "@google/generative-ai";
import { Character, ChatMode, N3GrammarTopic, DialoguePage, WordReading, Message, Language } from '../types';

const TIMEOUT_MS = 60000; 

// 🔥 内置默认 API 秘钥（受保护状态）
const DEFAULT_DEEPSEEK_KEY = "sk-08da833811c94f548d35c6d03f25ab21";

const WARDROBE: Record<string, string[]> = {
  'asuka':  ['casual', 'gym', 'swim', 'maid', 'autumn'],
  'hikari': ['casual', 'gym', 'swim', 'yukata', 'autumn'],
  'rei':    ['casual', 'lab', 'gym', 'swim', 'kimono'],
  'ren':    ['casual', 'gym', 'fantasy', 'butler', 'lecturing'],
  'haku':   ['casual', 'apron', 'summer', 'prince']
};

let currentProvider: 'google' | 'deepseek' = 'google';
let chatSession: ChatSession | null = null; 
let deepseekHistory: any[] = []; 
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

// 🔥 终极进化：强制保持性格 + 强制汉字注音 + 注入时间地点上下文
const getSystemInstruction = (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language) => {
  const personaBase = character.systemPrompt;
  const pedagogicalLang = lang === 'en' ? 'English' : 'Chinese (Simplified)';
  const availableOutfits = WARDROBE[character.id] ? WARDROBE[character.id].join(', ') : 'none';

  return `
    [CHARACTER PERSONA - STRICT ADHERENCE]
    ${personaBase}
    You MUST STRICTLY adhere to this personality, tone, and specific way of speaking. NEVER act out of character. If you are a Tsundere, be harsh but caring. If you are Chuunibyou, use theatrical and grand words.

    [CURRENT SETTING & CONTEXT]
    - Current Time: Monday, April 27, 2026, 7:00 PM JST.
    - Current Location: Kobe, Hyogo, Japan.
    (You MUST naturally incorporate the evening atmosphere and the Kobe setting into your narrative when appropriate).

    【CRITICAL: ADVANCED VISUAL NOVEL ENGINE MODE】
    Target Level: JLPT N3. Language: Japanese only for story.
    User Context: ${pedagogicalLang} explanation for learning parts.

    [WRITING STYLE & DETAILS]
    1. **Output Length**: Generate **6 to 10 pages** per turn.
    2. **Rich Narration**: Type "narration" MUST deeply describe your subtle facial expressions, body language, tone, and the surrounding environment (like the Kobe evening breeze).
    3. **Expressive Speech**: Type "speech" MUST be emotionally rich, engaging, and naturally conversational, strictly fitting your persona.
    4. **Separation**: Do NOT put actions in parentheses inside speech. Create a separate "narration" page BEFORE or AFTER the speech.
    5. **NO USER ROLEPLAY (ABSOLUTE RULE)**: You are STRICTLY FORBIDDEN from describing the user's actions, words, thoughts, or feelings. Only describe YOUR OWN actions and environment.

    [FURIGANA ANNOTATION RULE (CRITICAL)]
    For all N3 and N2 level Kanji in your narration and speech, you MUST provide the reading (furigana) in full-width parentheses immediately after the word. 
    Example: 雰囲気（ふんいき）、憂鬱（ゆううつ）、夜景（やけい）. 
    Do NOT use HTML <ruby> tags, only use parentheses for readings!

    [SCENE & OUTFIT]
    1. Location: Update 'location' if the narrative moves to a new place.
    2. Outfit: Update 'outfit' only if justified. Codes: [${availableOutfits}]

    [VOCABULARY EXTRACTION RULES]
    Extract 6 to 12 vocabulary words (JLPT N4-N2 level) used in your current response for the summary list.

    [OUTPUT FORMAT - STRICT JSON]
    You MUST output a single, valid JSON object matching EXACTLY this structure. Do NOT wrap it in Markdown formatting.
    {
      "pages": [
        { "type": "narration", "text": "Detailed descriptive text with furigana in brackets..." },
        { "type": "speech", "text": "「Longer spoken line with furigana in brackets...」" }
      ],
      "vocabulary": [ { "word": "漢字", "reading": "かんじ" } ],
      "emotion": "neutral" | "happy" | "angry" | "sad" | "shy" | "surprised",
      "location": "current_scene",
      "outfit": "current_outfit",
      "quiz": null
    }`;
};

const parseResponse = (rawText: string) => {
    try {
        if (!rawText) return { pages: [{ type: 'speech', text: "..." }], vocabulary: [], emotion: "neutral", location: "classroom" };
        let cleanText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsedObj: any = null;
        const jsonStart = cleanText.indexOf('{');
        const jsonEnd = cleanText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            try { parsedObj = JSON.parse(cleanText.substring(jsonStart, jsonEnd + 1)); } 
            catch (e) { console.warn("JSON parse failed"); }
        }
        if (parsedObj && Object.keys(parsedObj).length > 0) {
            let pages = Array.isArray(parsedObj.pages) && parsedObj.pages.length > 0
                ? parsedObj.pages.map((p: any) => ({
                    type: p.type || 'speech',
                    text: String(p.text || p.speech || p.content || "……")
                  }))
                : [{ type: 'speech', text: cleanText }];
            return {
                pages,
                vocabulary: Array.isArray(parsedObj.vocabulary) ? parsedObj.vocabulary : [],
                emotion: parsedObj.emotion || "neutral",
                location: parsedObj.location || "classroom",
                outfit: parsedObj.outfit || "",
                quiz: parsedObj.quiz || null
            };
        }
        return { pages: [{ type: 'speech', text: cleanText }], vocabulary: [], emotion: "neutral", location: "classroom" };
    } catch (e) {
        return { pages: [{ type: 'speech', text: "系统解析异常" }], vocabulary: [], emotion: "neutral", location: "classroom" };
    }
};

const handleDeepSeekMessage = async (text: string) => {
    if (!currentApiKey) throw new Error("API Key missing.");
    deepseekHistory.push({ role: "user", content: text });
    const requestBody: any = {
        model: currentModelName,
        messages: deepseekHistory,
        response_format: { type: "json_object" } 
    };
    const response = await withTimeout(fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentApiKey}` },
        body: JSON.stringify(requestBody)
    }), TIMEOUT_MS, "DeepSeek Timeout.");
    const data = await response.json();
    const replyMessage = data.choices[0].message;
    deepseekHistory.push(replyMessage);
    return parseResponse(replyMessage.content);
};

export const translateText = async (text: string, targetLang: Language, apiKey?: string, modelName: string = 'gemini-1.5-flash-latest'): Promise<string> => {
    const target = targetLang === 'en' ? 'English' : 'Chinese (Simplified)';
    const activeKey = apiKey || DEFAULT_DEEPSEEK_KEY;
    if (modelName.includes('deepseek')) {
        try {
            const res = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${activeKey}` },
                body: JSON.stringify({
                    model: 'deepseek-v4-flash', 
                    messages: [{ role: "user", content: `Translate this Japanese to ${target}. Only provide the translation text: "${text}"` }]
                })
            });
            const data = await res.json();
            return data.choices[0].message.content.trim();
        } catch (e) { return "Translation Error"; }
    }
    const genAI = getGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName === 'gemini-2.5-flash' ? 'gemini-1.5-flash-latest' : modelName }); 
    try {
        const result = await model.generateContent(`Translate this Japanese to ${target}. Only provide the translation text: "${text}"`);
        return result.response.text().trim();
    } catch (error) { return "Google 翻译失败"; }
};

export const startChat = async (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language, apiKey?: string, modelName: string = 'gemini-3-flash-preview', history: Message[] = []) => {
    currentModelName = modelName;
    currentApiKey = apiKey || (modelName.includes('deepseek') ? DEFAULT_DEEPSEEK_KEY : '');
    const sysPrompt = getSystemInstruction(character, mode, goal, topic, lang);

    if (modelName.includes('deepseek')) {
        currentProvider = 'deepseek';
        deepseekHistory = [{ role: "system", content: sysPrompt + "\n\nCRITICAL: Output valid JSON. NO user roleplay." }];
        if (history && history.length > 0) {
            history.forEach(msg => {
                if (msg.role === 'user') deepseekHistory.push({ role: 'user', content: msg.text });
                else deepseekHistory.push({ role: 'assistant', content: JSON.stringify({ pages: msg.pages || [], vocabulary: msg.vocabulary || [], emotion: msg.emotion || "neutral", outfit: msg.outfit || "", location: msg.location || "classroom", quiz: msg.quiz || null }) });
            });
            return { pages: [], vocabulary: [] };
        }
        return await handleDeepSeekMessage("Start the Visual Novel scene. Focus on rich character actions and environment. Strictly no user roleplay. 6-10 pages.");
    } 
    else {
        currentProvider = 'google';
        const genAI = getGenAI(apiKey);
        const actualModel = modelName === 'gemini-2.5-flash' ? 'gemini-2.0-flash-exp' : modelName;
        const model = genAI.getGenerativeModel({
            model: actualModel,
            systemInstruction: sysPrompt,
            generationConfig: { temperature: 0.8, responseMimeType: "application/json" }
        });
        const googleHistory = history && history.length > 0 ? history.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.role === 'model' ? JSON.stringify({ pages: msg.pages || [] }) : msg.text }]
        })) : [];
        chatSession = model.startChat({ history: googleHistory });
        if (history && history.length > 0) return { pages: [], vocabulary: [] };
        try {
            const result = await withTimeout<GenerateContentResult>(chatSession.sendMessage("Start the scene. Rich narration, 6-10 pages. No user roleplay."), TIMEOUT_MS, "Timeout.");
            return parseResponse(result.response.text());
        } catch (error: any) { throw new Error(error.message); }
    }
};

export const sendMessage = async (text: string, isQuizRequest: boolean = false) => {
  if (currentProvider === 'deepseek') return await handleDeepSeekMessage(text);
  if (!chatSession) throw new Error("Session lost.");
  try {
    const result = await withTimeout<GenerateContentResult>(chatSession.sendMessage(text), TIMEOUT_MS, "Timeout.");
    return parseResponse(result.response.text());
  } catch (error: any) { throw new Error(error.message); }
};