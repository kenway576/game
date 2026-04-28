import { 
  GoogleGenerativeAI, 
  SchemaType, 
  Schema, 
  ChatSession, 
  GenerateContentResult 
} from "@google/generative-ai";
import { Character, ChatMode, N3GrammarTopic, DialoguePage, WordReading, Message, Language } from '../types';

const TIMEOUT_MS = 60000; 

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
  if (!key) throw new Error("No API Key found.");
  return new GoogleGenerativeAI(key);
};

const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
        promise.then((val) => { clearTimeout(timer); resolve(val); }, (err) => { clearTimeout(timer); reject(err); });
    });
};

const getSystemInstruction = (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language) => {
  const personaBase = character.systemPrompt;
  const pedagogicalLang = lang === 'en' ? 'English' : 'Chinese (Simplified)';
  const availableOutfits = WARDROBE[character.id] ? WARDROBE[character.id].join(', ') : 'none';

  return `
    [CHARACTER PERSONA - STRICT ADHERENCE (CRITICAL)]
    Character Name: ${character.name}
    Base Persona: ${personaBase}
    
    CRITICAL ANTI-AI & RELATIONSHIP INSTRUCTIONS:
    - You are a fictional anime character in a visual novel. YOU ARE NOT AN AI ASSISTANT.
    - NEVER be overly polite, generic, or artificially helpful.
    - RELATIONSHIP PROGRESSION: Do NOT act overly familiar or enthusiastic at the start unless your specific persona demands it (like Genki). 
      * If Kuudere (e.g., Rei): Be icy, silent, highly analytical, and indifferent initially. Use very few words. Let the warmth build naturally only after long interactions.
      * If Tsundere (e.g., Asuka): Be extremely prickly, impatient, and defensive. 
      * Make your personality deeply attractive, authentic, and layered.

    [DYNAMIC SCENE CHANGES]
    - CRITICAL NARRATIVE RULE: This is a Visual Novel dating/hangout sim. The time and environment flow naturally based on the conversation.
    - You MUST actively suggest going to new locations to keep the story exciting (e.g., suggest going to the 'beach', 'cafe', 'park', 'festival', 'shrine', or 'gym').
    - When you and the user change locations, you MUST update the "location" field in your JSON output to EXACTLY match the new scene.
    - The location field MUST be exactly one of these lowercase words: classroom, hallway, library, rooftop, gym, room, kitchen, street, park, beach, shrine, cafe, lab, castle, night, festival.

    [NARRATION RULES - THIRD PERSON ONLY (CRITICAL)]
    - ALWAYS use THIRD-PERSON perspective for all narration and actions (Type: narration). 
    - Refer to yourself by your name (e.g., "${character.name}は...") or neutral descriptions (e.g., "少女は..."). 
    - ABSOLUTELY NEVER use first-person pronouns like "I", "Me", "My" (私, 僕, 俺) in narration.
    - ABSOLUTELY NEVER describe the player's (the user's) actions, thoughts, or words. You only control yourself.

    [CONVERSATION HOOK - COMPULSORY]
    - The VERY LAST page of your response MUST be a "speech" page.
    - This final speech MUST end with an engaging, leading question (疑問句) or a provocative statement to compel the user to reply. Do not let the conversation die!

    [FURIGANA ANNOTATION - HTML RUBY (CRITICAL)]
    - For ALL N3/N2 Kanji in both 'narration' and 'speech', you MUST use standard HTML ruby tags for furigana.
    - Format MUST be exactly like this: <ruby>漢字<rt>かんじ</rt></ruby>. 
    - DO NOT use parentheses for readings! USE THE RUBY TAGS! Example: <ruby>海<rt>うみ</rt></ruby>に<ruby>行<rt>い</rt></ruby>こうよ！

    【GAME ENGINE MODE】
    Target Level: JLPT N3. 
    Turn Length: 10-15 pages (EXTREMELY DETAILED AND LONG). Generate rich micro-expressions and long dialogue.

    [OUTPUT FORMAT - STRICT JSON]
    {
      "pages": [
        { "type": "narration", "text": "<ruby>少女<rt>しょうじょ</rt></ruby>は<ruby>冷<rt>つめ</rt></ruby>たい<ruby>視線<rt>しせん</rt></ruby>を向けて..." },
        { "type": "speech", "text": "「……何か<ruby>用<rt>よう</rt></ruby>？<ruby>邪魔<rt>じゃま</rt></ruby>しないでくれる？」" }
      ],
      "vocabulary": [ { "word": "漢字", "reading": "かんじ" } ],
      "emotion": "sad", 
      "location": "library", 
      "outfit": "casual", 
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
            try { parsedObj = JSON.parse(cleanText.substring(jsonStart, jsonEnd + 1)); } catch (e) {}
        }
        if (parsedObj && Object.keys(parsedObj).length > 0) {
            let pages = Array.isArray(parsedObj.pages) ? parsedObj.pages.map((p: any) => ({
                type: p.type || 'speech', text: String(p.text || p.speech || "……")
            })) : [{ type: 'speech', text: cleanText }];
            return { ...parsedObj, pages };
        }
        return { pages: [{ type: 'speech', text: cleanText }], vocabulary: [], emotion: "neutral", location: "classroom" };
    } catch (e) { return { pages: [{ type: 'speech', text: "Error parsing" }], vocabulary: [], emotion: "neutral" }; }
};

export const translateText = async (text: string, targetLang: Language, apiKey?: string, modelName: string = 'gemini-1.5-flash-latest'): Promise<string> => {
    const target = targetLang === 'en' ? 'English' : 'Chinese (Simplified)';
    const activeKey = apiKey || DEFAULT_DEEPSEEK_KEY;
    if (modelName.includes('deepseek')) {
        try {
            const res = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${activeKey}` },
                body: JSON.stringify({ model: 'deepseek-v4-flash', messages: [{ role: "user", content: `Translate: "${text}" to ${target}. Output translation only.` }] })
            });
            const data = await res.json(); return data.choices[0].message.content.trim();
        } catch (e) { return "Error"; }
    }
    const genAI = getGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName === 'gemini-2.5-flash' ? 'gemini-1.5-flash-latest' : modelName }); 
    try {
        const result = await model.generateContent(`Translate: "${text}" to ${target}. Output translation only.`);
        return result.response.text().trim();
    } catch (error) { return "Error"; }
};

export const startChat = async (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language, apiKey?: string, modelName: string = 'gemini-3-flash-preview', history: Message[] = []) => {
    currentModelName = modelName;
    currentApiKey = apiKey || (modelName.includes('deepseek') ? DEFAULT_DEEPSEEK_KEY : '');
    const sysPrompt = getSystemInstruction(character, mode, goal, topic, lang);

    if (modelName.includes('deepseek')) {
        currentProvider = 'deepseek';
        deepseekHistory = [{ role: "system", content: sysPrompt }];
        if (history && history.length > 0) {
            history.forEach(m => deepseekHistory.push({ role: m.role === 'model' ? 'assistant' : 'user', content: m.role === 'model' ? JSON.stringify(m) : m.text }));
            return { pages: [], vocabulary: [] };
        }
        return await handleDeepSeekMessage("Start the session. Generate 10-15 pages. End with a question. Third person narration only. Use HTML ruby tags. NEVER break your anime character persona. If you are Kuudere or Tsundere, start very cold/prickly.");
    } else {
        currentProvider = 'google';
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName === 'gemini-2.5-flash' ? 'gemini-2.0-flash-exp' : modelName, systemInstruction: sysPrompt, generationConfig: { responseMimeType: "application/json" } });
        chatSession = model.startChat({ history: history.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] })) });
        if (history.length > 0) return { pages: [], vocabulary: [] };
        const result = await withTimeout(chatSession.sendMessage("Start the session. Generate 10-15 pages. End with a question. Third person narration only. Use HTML ruby tags. NEVER break your anime character persona. If you are Kuudere or Tsundere, start very cold/prickly."), TIMEOUT_MS, "Timeout");
        return parseResponse(result.response.text());
    }
};

const handleDeepSeekMessage = async (text: string) => {
    deepseekHistory.push({ role: "user", content: text });
    const response = await withTimeout(fetch("https://api.deepseek.com/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentApiKey}` },
        body: JSON.stringify({ model: currentModelName, messages: deepseekHistory, response_format: { type: "json_object" } })
    }), TIMEOUT_MS, "Timeout");
    const data = await response.json();
    deepseekHistory.push(data.choices[0].message);
    return parseResponse(data.choices[0].message.content);
};

export const sendMessage = async (text: string) => {
  if (currentProvider === 'deepseek') return await handleDeepSeekMessage(text);
  if (!chatSession) throw new Error("Session lost.");
  const result = await withTimeout(chatSession.sendMessage(text), TIMEOUT_MS, "Timeout");
  return parseResponse(result.response.text());
};