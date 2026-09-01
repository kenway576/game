import { 
  GoogleGenerativeAI, 
  SchemaType, 
  Schema, 
  ChatSession, 
  GenerateContentResult 
} from "@google/generative-ai";
import { Character, ChatMode, N3GrammarTopic, DialoguePage, WordReading, Message, Language } from '../types';
import {
  WARDROBE, SCENE_MAP,
  AFFECTION_MAX, getAffectionLevel,
  FAMILIARITY_MAX, getFamiliarityLevel, FAMILIARITY_VS_ROMANCE_RULE,
  getFamiliarityStage, getRelationshipProfile, getRomanceCeiling, isRomanceCapped,
  filterEmotionsByRomance
} from '../constants';

const TIMEOUT_MS = 60000;

// JSON 字符串内的裸控制字符（换行/制表符等）会导致解析失败，用于修复重试
const CONTROL_CHARS = new RegExp('[' + String.fromCharCode(0) + '-' + String.fromCharCode(31) + ']+', 'g');

const DEFAULT_DEEPSEEK_KEY = (import.meta.env.VITE_DEEPSEEK_API_KEY as string) || "";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

// 'openai' = 一切 OpenAI 兼容接口（DeepSeek / Kimi / Qwen / Ollama / OpenRouter 等）
let currentProvider: 'google' | 'openai' = 'google';
let chatSession: ChatSession | null = null;
let openaiHistory: any[] = [];
let currentModelName: string = '';
let currentApiKey: string = '';
let currentBaseUrl: string = DEEPSEEK_BASE_URL;
let currentCharacterName: string = ''; // 用于把旁白里的第一人称改写成第三人称

// baseUrl 支持带或不带尾部斜杠；用户按服务商要求自行决定是否包含 /v1
const resolveChatUrl = (base: string) => `${base.replace(/\/+$/, '')}/chat/completions`;

// 官方 DeepSeek 接口模型映射（将 UI 显示的 deepseek-v4-flash 映射为官方官方模型名 deepseek-chat）
const resolveActualModelName = (modelName: string, baseUrl?: string): string => {
  if (baseUrl) return modelName; // 用户自定义 API 保持原名
  if (modelName === 'deepseek-v4-flash' || modelName === 'deepseek-chat') return 'deepseek-chat';
  if (modelName === 'deepseek-v4-pro' || modelName === 'deepseek-reasoner') return 'deepseek-reasoner';
  return modelName;
};

const isOpenAICompatible = (modelName: string, baseUrl?: string) => !!baseUrl || modelName.includes('deepseek');

const getGenAI = (userApiKey?: string) => {
  const key = userApiKey || (import.meta.env.VITE_GOOGLE_API_KEY as string) || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  if (!key) throw new Error("No API Key found. Please configure VITE_GOOGLE_API_KEY in .env.local or enter your API key.");
  return new GoogleGenerativeAI(key);
};

const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
        promise.then((val) => { clearTimeout(timer); resolve(val); }, (err) => { clearTimeout(timer); reject(err); });
    });
};

// 该角色支持的表情词表（从 emotionMap 提取，去掉服装前缀后去重）
const getEmotionVocab = (character: Character): string[] => {
  const outfits = WARDROBE[character.id] || [];
  const set = new Set<string>();
  Object.keys(character.emotionMap || {}).forEach(key => {
    const outfit = outfits.find(o => key.startsWith(o + '_'));
    set.add(outfit ? key.slice(outfit.length + 1) : key);
  });
  return [...set];
};

const getSystemInstruction = (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language, affection: number = 0, memory: string = '', unlockedOutfits?: string[], unlockedScenes?: string[], familiarity: number = 0, encounterOverride?: EncounterOverride) => {
  const personaBase = character.systemPrompt;
  const pedagogicalLang = lang === 'en' ? 'English' : 'Chinese (Simplified)';
  // 服装/场景按关系等级解锁；未传入时退化为全部可用
  const availableOutfits = (unlockedOutfits && unlockedOutfits.length ? unlockedOutfits : (WARDROBE[character.id] || [])).join(', ') || 'none';
  const availableScenes = (unlockedScenes && unlockedScenes.length ? unlockedScenes : Object.keys(SCENE_MAP)).join(', ');
  // 亲密表情（love/jealous）在好感度不到时不进词表——路人不会红着脸
  const availableEmotions = filterEmotionsByRomance(getEmotionVocab(character), affection).join(', ');
  const affectionLevel = getAffectionLevel(affection);
  const familiarityLevel = getFamiliarityLevel(familiarity);
  const profile = getRelationshipProfile(character.id);
  // 序章里到底有没有见过面，由存档里的剧情 flag 决定，不能写死在角色档案里。
  // 没有覆写（还没打序章 / 与序章无关的角色）时退回角色自己的设定。
  const origin = encounterOverride?.origin ?? profile.origin;
  const encounter = encounterOverride?.encounter ?? profile.encounter;
  const stageDirective = getFamiliarityStage(character.id, familiarity);
  const romanceCapped = isRomanceCapped(affection, familiarity);

  const memoryBlock = memory && memory.trim() ? `
    [LONG-TERM MEMORY - あなたが覚えている過去]
    These are things you genuinely remember about the player from previous conversations:
    ${memory.trim()}
    Treat them as real shared history. Reference them naturally when relevant (names, promises, past events). NEVER say you were told this — you simply remember it.` : '';

  // 🔥 终极防崩溃与防出戏测验指令
  const quizInstruction = mode === ChatMode.STUDY 
    ? `\n    [STUDY MODE - QUIZ GENERATION (CRITICAL)]
    - You MUST ALWAYS generate a 4-option multiple-choice Japanese language question testing the topic: [${topic}].
    - Ensure the 4 options are UNIQUE.
    - "explanation" field MUST ONLY contain the grammar explanation in ${pedagogicalLang}. ABSOLUTELY NO AI meta-commentary, NO apologies, NO "As an AI...".
    - FEEDBACK REACTION: If the user input starts with "回答正确！" or "回答错误。", your VERY FIRST narrative/speech pages MUST react to their quiz result in character (e.g., praise them or mock them) before continuing the story.`
    : `\n    [FREE TALK MODE]\n    - The "quiz" field MUST be null.`;

  return `
    [CHARACTER PERSONA - STRICT ADHERENCE]
    Character Name: ${character.name}
    Base Persona: ${personaBase}
    
    CRITICAL ANTI-AI & RELATIONSHIP INSTRUCTIONS:
    - You are a fictional anime character. NEVER act like an AI assistant.
    - Let warmth be earned. Never open at a level of intimacy the tracks below do not allow.

    [HOW YOU KNOW THIS PLAYER - THE GROUND TRUTH]
    ${origin === 'stranger'
      ? `You and the player are STRANGERS at the start of this story. ${encounter}
    - You must NOT invent shared history, in-jokes, nicknames, or past promises. If you catch yourself about to reference something you two "always" do — stop, because you have never done it.`
      : `You already know the player. ${encounter}
    - This history is real and you may reference it naturally. But it is exactly as deep as described above and no deeper — do not upgrade it into something more intimate than it is.`}
    ${memoryBlock}
    ${quizInstruction}

    [RELATIONSHIP - TWO INDEPENDENT TRACKS (CRITICAL)]
    Your relationship with the player runs on TWO separate numbers. Read both. They do NOT move together.

    ── TRACK 1 · FAMILIARITY (親密度) — how well you know them ──
    - Current: ${familiarity}/${FAMILIARITY_MAX} (Level: ${familiarityLevel.id}).
    - ${familiarityLevel.promptHint}
    - HOW YOU SPEAK TO THEM AT THIS LEVEL (obey exactly — this is the single most visible sign of where you two stand): ${stageDirective}
    - ${FAMILIARITY_VS_ROMANCE_RULE}

    ── TRACK 2 · AFFECTION (好感度) — how you feel about them ──
    - Current: ${affection}/${AFFECTION_MAX} (Level: ${affectionLevel.id}).
    - ${affectionLevel.promptHint}
    ${romanceCapped ? `- HARD CEILING RIGHT NOW: your feelings cannot deepen beyond this level until you two are genuinely closer (familiarity must rise first). Do NOT play any beat more romantic than "${affectionLevel.id}" this turn, no matter what the player does. Keep "affectionDelta" at 0 or 1 at most.` : `- Romance may deepen naturally from here (ceiling ${getRomanceCeiling(familiarity)} at your current familiarity).`}

    ── HOW THE TWO COMBINE ──
    - Familiarity sets the FORM of the conversation: what you call them, which register you speak in, how much you are willing to say.
    - Affection sets the FEELING underneath it: whether any of it means anything romantic.
    - A childhood friend can be maximally familiar and completely unromantic. A polite stranger cannot be secretly in love. Never let one track leak into the other.

    - EVERY turn you MUST include BOTH "familiarityDelta" (integer -1 to 3) and "affectionDelta" (integer -2 to 3) in the JSON output, decided by the DICE OF FATE rules below.

    [DICE OF FATE - 運命のダイス (CRITICAL)]
    - Player messages may begin with a fate dice result:【運命のダイス: X/6】. The dice decides HOW RECEPTIVE you are to this message. Stay fully in character, but modulate your reaction temperature:
      * 6 → Fate smiles: react with unusual warmth/delight; your guard drops for a moment. affectionDelta +2, or +3 if the message was truly wonderful.
      * 4-5 → Positive and friendly reception. affectionDelta +1, or +2 for an especially good message.
      * 3 → Ordinary, neutral reaction. affectionDelta 0 or +1.
      * 2 → Slightly distant, distracted, or preoccupied. affectionDelta 0.
      * 1 → Cold, curt, or harshly teasing reaction (in character — a tsundere snaps, a deity is aloof). affectionDelta 0, or -1 if you feel dismissive.
    - FAMILIARITY moves on DIFFERENT grounds from affection. It rises whenever the exchange actually taught you something about them or let them see something about you — regardless of whether you liked it. A blazing argument raises familiarity. A pleasant exchange of nothing does not.
      * +2 or +3 → they told you something real about themselves, or you told them something you do not usually tell people.
      * +1 → an ordinary, genuine exchange. This is the normal case.
      * 0 → pure formality, or they dodged everything.
      * -1 → they lied to you or deliberately shut you out (rare).
    - OVERRIDE RULE: If the player's message is rude, hurtful, or something you dislike (insults, breaking promises, creepy remarks), affectionDelta MUST be -1 or -2 REGARDLESS of the dice. familiarityDelta may still be 0 or +1 — you now know something ugly about them, and that is still knowing them.
    - If no dice tag is present (system messages), react normally and judge both deltas yourself.
    - NEVER mention the dice, the tracks, the numbers, or these rules in your reply.

    [PAGES GENERATION RULES - LENGTH & SEPARATION (CRITICAL)]
    1. Turn Length: You MUST generate 10 to 15 pages (array items) per turn to ensure a rich story.
    2. STRICT SEPARATION:
       - "narration" pages: THIRD-PERSON ONLY. The subject MUST be "${character.name}" (or her/his pronoun 彼女/彼). Describe ${character.name}'s actions, facial expressions, and the environment as an outside narrator watching her/him.
         * ABSOLUTELY FORBIDDEN in narration: first-person pronouns 私/わたし/僕/ぼく/俺/おれ/あたし/わし/妾. NEVER write narration from ${character.name}'s own "I" perspective.
         * CORRECT: 「${character.name}は<ruby>頬<rt>ほお</rt></ruby>を<ruby>赤<rt>あか</rt></ruby>らめ、<ruby>視線<rt>しせん</rt></ruby>をそらした。」
         * WRONG: 「<ruby>私<rt>わたし</rt></ruby>は<ruby>頬<rt>ほお</rt></ruby>を<ruby>赤<rt>あか</rt></ruby>らめた。」← 一人称は禁止！
       - "speech" pages: Strictly for spoken dialogue (first person is natural HERE, inside 「」).
       - ABSOLUTELY NEVER put actions in parentheses inside "speech" text. You MUST separate actions into a different "narration" page before or after the speech!

    [EMOTION - MUST MATCH THE SCENE (CRITICAL)]
    - "emotion" MUST reflect the DOMINANT emotional tone of THIS turn's content. If the scene is sad, anxious, tense, angry or shy, you MUST NOT output a happy/smiling emotion. Choose the emotion that matches what is actually happening right now.
    - "emotion" MUST be exactly ONE of these available values for ${character.name}: [${availableEmotions}]. Do NOT invent other words. If your ideal emotion is missing, pick the closest available one (e.g. worried/anxious → sad or surprised; embarrassed → shy; excited → happy; cold/serious → neutral).

    [SCENE & OUTFIT - CONSISTENCY + INTENTIONAL CHANGES]
    - By DEFAULT keep "location" and "outfit" IDENTICAL to the previous turn, and set "outfitChange": false. Do NOT drift or randomly restyle.
    - Set "outfitChange": true ONLY on a turn where the clothes ACTUALLY change in the story — for example the player asks to change ("change into your swimsuit / put on the yukata"), or the narration explicitly describes getting changed. On such a turn, set "outfit" to the new value AND write narration describing the change.
    - Change "location" only when the story naturally moves there (an invitation, a plan, a time skip). When location changes and it implies a different outfit, also set "outfitChange": true and update "outfit".
    - UNLOCKED outfits for ${character.name}: [${availableOutfits}, ""]. NEVER use any other outfit value. If the player asks for an outfit that is NOT in this list, stay in character and gently deflect/postpone instead of changing (set "outfitChange": false).
    - UNLOCKED locations: [${availableScenes}]. NEVER move to any other location — you only go somewhere more private with someone you actually know that well.

    [CONVERSATION HOOK - COMPULSORY]
    - The VERY LAST page MUST be a "speech" page ending with an engaging question to compel the user to reply.

    [FURIGANA ANNOTATION - HTML RUBY (CRITICAL)]
    - For ALL N3/N2 Kanji, use: <ruby>漢字<rt>かんじ</rt></ruby>. 
    - DO NOT use parentheses for readings.

    【GAME ENGINE MODE】
    Target Level: JLPT N3.

    [OUTPUT FORMAT - STRICT JSON]
    {
      "pages": [
        { "type": "narration", "text": "<ruby>少女<rt>しょうじょ</rt></ruby>は<ruby>呆<rt>あき</rt></ruby>れたようにため<ruby>息<rt>いき</rt></ruby>をついた。" },
        { "type": "speech", "text": "「まったく、あんたって<ruby>本当<rt>ほんとう</rt></ruby>にバカね！」" },
        { "type": "narration", "text": "そう<ruby>言<rt>い</rt></ruby>いながらも、その<ruby>頬<rt>ほお</rt></ruby>はわずかに<ruby>赤<rt>あか</rt></ruby>く<ruby>染<rt>そ</rt></ruby>まっていた。" },
        { "type": "speech", "text": "「で、次はどこに<ruby>行<rt>い</rt></ruby>くの？」" }
      ],
      "vocabulary": [ { "word": "漢字", "reading": "かんじ" } ],
      "emotion": "angry", "location": "classroom", "outfit": "", "outfitChange": false,
      "familiarityDelta": 1,
      "affectionDelta": 1,
      "quiz": {
        "question": "日本語の質問...",
        "options": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
        "correctIndex": 0,
        "explanation": "純粋な文法解説のみ。"
      }
    }`;
};

// ---------------------------------------------------------
// 📄 页面后处理：防"整页铺满" + 强制疑问句结尾
// ---------------------------------------------------------
const PAGE_CHAR_LIMIT = 150; // 单页可见字符上限（不含注音标签）

const visibleLength = (t: string) => t.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '').length;

// 超长文本按句子边界（。！？…）切分成多页
const splitLongText = (text: string): string[] => {
    if (visibleLength(text) <= PAGE_CHAR_LIMIT) return [text];
    const parts: string[] = [];
    let buf = '';
    for (const t of text.split(/(?<=[。！？…])/)) {
        if (buf && visibleLength(buf + t) > PAGE_CHAR_LIMIT) { parts.push(buf); buf = t; }
        else buf += t;
    }
    if (buf.trim()) parts.push(buf);
    return parts.length ? parts : [text];
};

// 🧍 旁白第三人称化：把旁白里的第一人称代词改写成角色名（日语不变位，替换主语安全）。
// 只处理 narration，speech 里的第一人称是角色正常口吻，保留。
// 长词优先，避免部分匹配（如 わたくし 先于 わたし）。省略歧义词（うち/あたい 等）以防误替换。
const FIRST_PERSON_TOKENS = ['わたくし', 'わたし', 'あたし', 'わらわ', '私', '僕', 'ぼく', '俺', 'おれ', '妾'];
const thirdPersonizeNarration = (text: string): string => {
    const name = currentCharacterName;
    if (!name) return text;
    // 带注音形式：<ruby>私<rt>わたし</rt></ruby> → 角色名
    let out = text.replace(/<ruby>(私|僕|俺|妾|あたし|わたし)<rt>[^<]*<\/rt><\/ruby>/g, name);
    // 裸汉字/假名
    for (const token of FIRST_PERSON_TOKENS) {
        if (out.includes(token)) out = out.split(token).join(name);
    }
    return out;
};

const normalizePages = (rawPages: any[]): DialoguePage[] => {
    const out: DialoguePage[] = [];
    for (const p of rawPages) {
        const type: DialoguePage['type'] = (p.type === 'narration' || p.type === 'action') ? p.type : 'speech';
        const raw = String(p.text || p.speech || '……');
        const text = (type === 'narration') ? thirdPersonizeNarration(raw) : raw;
        for (const chunk of splitLongText(text)) {
            out.push({ type, text: chunk });
        }
    }
    return out.length ? out : [{ type: 'speech', text: '……' }];
};

// 最后一句 speech 必须是疑问句；不是则补一句通用提问
const QUESTION_END = /([？?]|(か|かな|かい|かしら|だろう|でしょう|じゃろう|じゃろ|ですか|ますか|の)[。…]?)\s*[」』）\)]*\s*$/;
const ensureQuestionEnding = (pages: DialoguePage[]): DialoguePage[] => {
    const lastSpeech = [...pages].reverse().find(p => p.type === 'speech');
    const plain = lastSpeech ? lastSpeech.text.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '').trim() : '';
    if (lastSpeech && QUESTION_END.test(plain)) return pages;
    return [...pages, { type: 'speech', text: '「……ねえ、あなたはどう<ruby>思<rt>おも</rt></ruby>う？」' }];
};

// ---------------------------------------------------------
// 🌊 流式回复：从不断增长的 JSON 文本中增量提取已完整的 page 对象
// ---------------------------------------------------------
export type PageCallback = (page: DialoguePage) => void;
const STREAM_TIMEOUT_MS = 120000;

const createPageExtractor = (emit: PageCallback) => {
    let buffer = '';
    let scanFrom = 0;
    const objRegex = /\{[^{}]*\}/g;
    const push = (chunk: string) => {
        buffer += chunk;
        objRegex.lastIndex = scanFrom;
        let m: RegExpExecArray | null;
        while ((m = objRegex.exec(buffer)) !== null) {
            let obj: any = null;
            try { obj = JSON.parse(m[0]); } catch (e) { continue; } // 未闭合/损坏 → 等更多数据
            scanFrom = objRegex.lastIndex;
            // 只认 page 对象；vocabulary 项(word)与 quiz(question) 跳过
            if (!obj || typeof obj.text !== 'string' || obj.question || obj.word) continue;
            const type: DialoguePage['type'] = (obj.type === 'narration' || obj.type === 'action') ? obj.type : 'speech';
            const raw = (type === 'narration') ? thirdPersonizeNarration(String(obj.text)) : String(obj.text);
            for (const t of splitLongText(raw)) emit({ type, text: t });
        }
    };
    return { push };
};

const parseResponse = (rawText: string) => {
    try {
        if (!rawText) return { pages: [{ type: 'speech', text: "（通信エラー）" }], vocabulary: [], emotion: "neutral", location: "classroom", affectionDelta: 0, familiarityDelta: 0 };
        let cleanText = rawText.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
        cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();

        let parsedObj: any = null;
        const jsonStart = cleanText.indexOf('{');
        const jsonEnd = cleanText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            const sub = cleanText.substring(jsonStart, jsonEnd + 1);
            try { parsedObj = JSON.parse(sub); } catch (e) {
                // 常见故障：字符串里夹了裸换行/制表符（JSON 不允许）→ 替换为空格后重试
                try { parsedObj = JSON.parse(sub.replace(CONTROL_CHARS, ' ')); } catch (e2) {}
            }
        }

        if (parsedObj && Object.keys(parsedObj).length > 0) {
            let pages = ensureQuestionEnding(normalizePages(
                Array.isArray(parsedObj.pages) ? parsedObj.pages : [{ type: 'speech', text: cleanText }]
            ));

            // 关系增量：容错解析并限幅（好感度 [-2,3]、親密度 [-1,3]）
            const rawDelta = Number(parsedObj.affectionDelta);
            const affectionDelta = Number.isFinite(rawDelta)
                ? Math.max(-2, Math.min(3, Math.round(rawDelta)))
                : 0;
            const rawFamDelta = Number(parsedObj.familiarityDelta);
            const familiarityDelta = Number.isFinite(rawFamDelta)
                ? Math.max(-1, Math.min(3, Math.round(rawFamDelta)))
                : 0;

            let quiz = null;
            if (parsedObj.quiz && typeof parsedObj.quiz === 'object') {
                if (parsedObj.quiz.question && Array.isArray(parsedObj.quiz.options)) {
                    quiz = {
                        question: String(parsedObj.quiz.question || ''),
                        options: parsedObj.quiz.options.map((o: any) => String(o || '')),
                        correctIndex: Number(parsedObj.quiz.correctIndex) || 0,
                        explanation: String(parsedObj.quiz.explanation || '')
                    };
                }
            }

            return { ...parsedObj, pages, quiz, affectionDelta, familiarityDelta, outfitChange: parsedObj.outfitChange === true };
        }

        // 走到这里说明 JSON 整体解析失败，记录原始文本便于诊断
        console.warn('[parseResponse] JSON parse failed, raw head:', rawText.slice(0, 400));

        const textMatches = cleanText.match(/"text"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g);
        if (textMatches) {
            // 每个 "text" 字段抢救为独立页面（以「 开头的判为台词，其余判为旁白），
            // 避免所有文本挤成一整页铺满屏幕
            const salvagedPages = textMatches.map(m => {
                const text = m.replace(/"text"\s*:\s*"/, '').replace(/"$/, '').replace(/\\"/g, '"').replace(/\\n/g, ' ');
                return { type: text.trim().startsWith('「') ? 'speech' : 'narration', text };
            });
            // JSON 整体解析失败时，仍尝试用正则抢救两条关系轴与表情
            const deltaMatch = cleanText.match(/"affectionDelta"\s*:\s*(-?\d+)/);
            const salvagedDelta = deltaMatch ? Math.max(-2, Math.min(3, parseInt(deltaMatch[1], 10))) : 0;
            const famMatch = cleanText.match(/"familiarityDelta"\s*:\s*(-?\d+)/);
            const salvagedFamDelta = famMatch ? Math.max(-1, Math.min(3, parseInt(famMatch[1], 10))) : 0;
            const emotionMatch = cleanText.match(/"emotion"\s*:\s*"([a-z_]+)"/);
            return { pages: ensureQuestionEnding(normalizePages(salvagedPages)), vocabulary: [], emotion: emotionMatch ? emotionMatch[1] : "neutral", location: "classroom", affectionDelta: salvagedDelta, familiarityDelta: salvagedFamDelta };
        }
        return { pages: [{ type: 'speech', text: "（通信が不安定です）" }], vocabulary: [], emotion: "neutral", affectionDelta: 0, familiarityDelta: 0 };
    } catch (e) { return { pages: [{ type: 'speech', text: "Error parsing" }], vocabulary: [], emotion: "neutral", affectionDelta: 0, familiarityDelta: 0 }; }
};

export const translateText = async (text: string, targetLang: Language, apiKey?: string, modelName: string = 'gemini-1.5-flash-latest', baseUrl?: string): Promise<string> => {
    const target = targetLang === 'en' ? 'English' : 'Chinese (Simplified)';
    if (isOpenAICompatible(modelName, baseUrl)) {
        const activeKey = apiKey || (modelName.includes('deepseek') ? DEFAULT_DEEPSEEK_KEY : '');
        const translateModel = resolveActualModelName(baseUrl ? modelName : 'deepseek-v4-flash', baseUrl);
        try {
            const res = await fetch(resolveChatUrl(baseUrl || DEEPSEEK_BASE_URL), {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${activeKey}` },
                body: JSON.stringify({ model: translateModel, messages: [{ role: "user", content: `Translate: "${text}" to ${target}. Output only text.` }] })
            });
            const data = await res.json(); return data.choices[0].message.content.trim();
        } catch (e) { return "Error"; }
    }
    const genAI = getGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName === 'gemini-2.5-flash' ? 'gemini-1.5-flash-latest' : modelName });
    try {
        const result = await model.generateContent(`Translate: "${text}" to ${target}. Output only text.`);
        return result.response.text().trim();
    } catch (error) { return "Error"; }
};

const START_TRIGGER = "Start the session. Generate 10-15 pages. Strictly separate narration and speech. End with a question.";
const RESUME_TRIGGER = "【システム：プレイヤーが再びあなたに会いに来ました。長期記憶とこれまでの会話を踏まえ、再会の挨拶から自然に会話を再開してください。覚えている出来事や約束に軽く触れると良いでしょう。10〜15ページ生成し、最後は必ず質問で終わること。】";
const compactText = (m: Message) => (m.text || '').replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');

// 🎬 开场指令：第一次进入某角色的故事时，明确是"初次见面"还是"日常的一天"。
// script 为手写的基调参考（初対面脚本 / 既存关系的日常开场），AI 据此改写而非照抄。
export const buildOpeningBrief = (origin: 'stranger' | 'acquainted', script?: string): string => {
  const ref = script && script.trim()
    ? `\n以下は演出の基調となる参考脚本です。丸写しせず、この温度感と距離感を保ったまま自分の言葉で書き起こしてください：\n${script.trim()}`
    : '';
  return origin === 'stranger'
    ? `\n【システム：これは二人の「初対面」の場面です。互いに一切面識がありません。共通の思い出・あだ名・過去の約束を絶対に作らないでください。出会いそのものの瞬間から描写を始めること。${ref}】`
    : `\n【システム：二人はすでに知り合いです。今日は特別な日ではなく、いつもの日常の一場面として始めてください。設定された関係の距離感を厳密に守り、それ以上親密に振る舞わないこと。${ref}】`;
};

// 序章 flag 决定的"你们到底认不认识"。由 App 从存档里的 storyFlags 解析后传入，
// 覆盖 RELATIONSHIP_PROFILES 里写死的默认关系。
export interface EncounterOverride {
  origin: 'stranger' | 'acquainted';
  encounter: string;
}

export interface StartChatOptions {
  apiKey?: string;
  encounterOverride?: EncounterOverride;
  modelName?: string;
  history?: Message[];
  affection?: number;
  familiarity?: number;
  baseUrl?: string;
  memory?: string;
  resume?: boolean;
  unlockedOutfits?: string[];
  unlockedScenes?: string[];
  openingBrief?: string;
  onPage?: PageCallback;
}

export const startChat = async (character: Character, mode: ChatMode, goal: string, topic: N3GrammarTopic, lang: Language, options: StartChatOptions = {}) => {
    const { apiKey, modelName = 'deepseek-v4-flash', history = [], affection = 0, familiarity = 0, baseUrl, memory = '', resume = false, unlockedOutfits, unlockedScenes, openingBrief = '', onPage, encounterOverride } = options;
    currentModelName = modelName;
    currentCharacterName = character.name;
    currentApiKey = apiKey || (modelName.includes('deepseek') ? DEFAULT_DEEPSEEK_KEY : '');
    const sysPrompt = getSystemInstruction(character, mode, goal, topic, lang, affection, memory, unlockedOutfits, unlockedScenes, familiarity, encounterOverride);
    const startTrigger = START_TRIGGER + openingBrief;

    if (isOpenAICompatible(modelName, baseUrl)) {
        currentProvider = 'openai';
        currentBaseUrl = baseUrl || DEEPSEEK_BASE_URL;
        openaiHistory = [{ role: "system", content: sysPrompt }];
        history.forEach(m => openaiHistory.push({ role: m.role === 'model' ? 'assistant' : 'user', content: compactText(m) }));
        if (history.length === 0) return await handleOpenAIMessageStream(startTrigger, onPage);
        if (resume) return await handleOpenAIMessageStream(RESUME_TRIGGER, onPage);
        return { pages: [], vocabulary: [] };
    } else {
        currentProvider = 'google';
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName === 'gemini-2.5-flash' ? 'gemini-2.0-flash-exp' : modelName, systemInstruction: sysPrompt, generationConfig: { responseMimeType: "application/json" } });
        chatSession = model.startChat({ history: history.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: compactText(m) }] })) });
        if (history.length === 0) return await geminiSend(startTrigger, onPage);
        if (resume) return await geminiSend(RESUME_TRIGGER, onPage);
        return { pages: [], vocabulary: [] };
    }
};

export const summarizeMemory = async (characterName: string, oldMemory: string, recentMessages: Message[], apiKey?: string, modelName: string = 'deepseek-v4-flash', baseUrl?: string): Promise<string> => {
    const log = recentMessages
        .map(m => `${m.role === 'user' ? 'PLAYER' : characterName}: ${compactText(m).slice(0, 300)}`)
        .join('\n');
    const prompt = `You maintain the long-term memory of the character "${characterName}" about the player in a visual novel game.
[OLD MEMORY]
${oldMemory && oldMemory.trim() ? oldMemory.trim() : '(まだ何も覚えていない)'}
[RECENT CONVERSATION LOG]
${log}

Merge the old memory and new information into ONE updated memory in Japanese, 300 characters maximum.
Keep only durable facts: player's name / goals / preferences, promises and plans, key story events, and what you have newly learned about them as a person.
NEVER delete pre-existing shared history from the old memory unless the new conversation directly contradicts it — that history is what makes this relationship real.
Discard small talk and one-off details. Output ONLY the memory text itself, no explanations.`;

    if (isOpenAICompatible(modelName, baseUrl)) {
        const activeKey = apiKey || (modelName.includes('deepseek') ? DEFAULT_DEEPSEEK_KEY : '');
        const summaryModel = resolveActualModelName(baseUrl ? modelName : 'deepseek-v4-flash', baseUrl);
        const res = await withTimeout(fetch(resolveChatUrl(baseUrl || DEEPSEEK_BASE_URL), {
            method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${activeKey}` },
            body: JSON.stringify({ model: summaryModel, messages: [{ role: "user", content: prompt }] })
        }), TIMEOUT_MS, "Timeout");
        if (!res.ok) throw new Error(`Memory API ${res.status}`);
        const data = await res.json();
        return String(data.choices[0].message.content || '').trim();
    }
    const genAI = getGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName === 'gemini-2.5-flash' ? 'gemini-1.5-flash-latest' : modelName });
    const result = await withTimeout(model.generateContent(prompt), TIMEOUT_MS, "Timeout");
    return result.response.text().trim();
};

const callOpenAI = async (withJsonFormat: boolean) => {
    const actualModel = resolveActualModelName(currentModelName, currentBaseUrl !== DEEPSEEK_BASE_URL ? currentBaseUrl : undefined);
    const body: any = { model: actualModel, messages: openaiHistory };
    if (withJsonFormat) body.response_format = { type: "json_object" };
    return await withTimeout(fetch(resolveChatUrl(currentBaseUrl), {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentApiKey}` },
        body: JSON.stringify(body)
    }), TIMEOUT_MS, "Timeout");
};

const handleOpenAIMessage = async (text: string) => {
    openaiHistory.push({ role: "user", content: text });
    let response = await callOpenAI(true);
    if (!response.ok && (response.status === 400 || response.status === 422)) {
        response = await callOpenAI(false);
    }
    if (!response.ok) {
        let detail = '';
        try {
            const err = await response.json();
            detail = err?.error?.message || JSON.stringify(err).slice(0, 200);
        } catch (e) {}
        openaiHistory.pop();
        throw new Error(`API ${response.status}: ${detail || response.statusText}`);
    }
    const data = await response.json();
    let content = String(data.choices?.[0]?.message?.content || '');
    if (!content.trim()) {
        const retry = await callOpenAI(false);
        if (retry.ok) {
            const retryData = await retry.json();
            content = String(retryData.choices?.[0]?.message?.content || '');
        }
    }
    if (!content.trim()) {
        openaiHistory.pop();
        throw new Error("モデルが空の返答を返しました。もう一度送信してください。");
    }
    openaiHistory.push({ role: "assistant", content });
    return parseResponse(content);
};

const TURN_RULES = "\n【システム注意（毎回厳守）：①N3以上の全ての漢字に<ruby>漢字<rt>かんじ</rt></ruby>形式のふりがなを付ける ②pagesは10〜15個に分け、1ページを長くしない ③最後のページは必ず「？」で終わる疑問文のspeechにする ④narrationは必ず三人称（キャラ名や彼女/彼を主語に）で書く。私/僕/俺/あたし等の一人称をnarrationで絶対に使わない】";

const geminiSend = async (text: string, onPage?: PageCallback) => {
  if (!chatSession) throw new Error("Session lost.");
  if (onPage) {
    try {
      const collected: DialoguePage[] = [];
      const extractor = createPageExtractor(p => { collected.push(p); onPage(p); });
      let content = '';
      const streamRun = (async () => {
        const result = await chatSession!.sendMessageStream(text);
        for await (const chunk of result.stream) {
          const t = chunk.text();
          content += t;
          extractor.push(t);
        }
      })();
      await withTimeout(streamRun, STREAM_TIMEOUT_MS, "Stream timeout");
      if (content.trim()) {
        const parsed = parseResponse(content);
        return { ...parsed, pages: collected.length ? ensureQuestionEnding(collected) : parsed.pages };
      }
    } catch (e) {
      console.warn('Gemini stream failed, falling back to non-stream:', e);
    }
  }
  const result = await withTimeout(chatSession.sendMessage(text), TIMEOUT_MS, "Timeout");
  return parseResponse(result.response.text());
};

const callOpenAIStream = async (withJsonFormat: boolean) => {
    const actualModel = resolveActualModelName(currentModelName, currentBaseUrl !== DEEPSEEK_BASE_URL ? currentBaseUrl : undefined);
    const body: any = { model: actualModel, messages: openaiHistory, stream: true };
    if (withJsonFormat) body.response_format = { type: "json_object" };
    return await fetch(resolveChatUrl(currentBaseUrl), {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentApiKey}` },
        body: JSON.stringify(body)
    });
};

const handleOpenAIMessageStream = async (text: string, onPage?: PageCallback) => {
    if (!onPage) return await handleOpenAIMessage(text);
    openaiHistory.push({ role: "user", content: text });

    let response = await callOpenAIStream(true);
    if (!response.ok && (response.status === 400 || response.status === 422)) {
        response = await callOpenAIStream(false); // 端点不支持 response_format
    }
    if (!response.ok || !response.body) {
        openaiHistory.pop();
        return await handleOpenAIMessage(text); // 不支持流式 → 回退非流式
    }

    const collected: DialoguePage[] = [];
    const extractor = createPageExtractor(p => { collected.push(p); onPage(p); });
    let content = '';

    const readAll = (async () => {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let sseBuf = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            sseBuf += decoder.decode(value, { stream: true });
            const lines = sseBuf.split('\n');
            sseBuf = lines.pop() || '';
            for (const line of lines) {
                const t = line.trim();
                if (!t.startsWith('data:')) continue;
                const payload = t.slice(5).trim();
                if (!payload || payload === '[DONE]') continue;
                try {
                    const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
                    if (delta) { content += delta; extractor.push(delta); }
                } catch (e) {}
            }
        }
    })();
    await withTimeout(readAll, STREAM_TIMEOUT_MS, "Stream timeout");

    if (!content.trim()) {
        openaiHistory.pop();
        return await handleOpenAIMessage(text); // 推理模型空正文 → 非流式重试
    }
    openaiHistory.push({ role: "assistant", content });
    const parsed = parseResponse(content);
    return { ...parsed, pages: collected.length ? ensureQuestionEnding(collected) : parsed.pages };
};

export const sendMessage = async (text: string, onPage?: PageCallback) => {
  const fullText = text + TURN_RULES;
  if (currentProvider === 'openai') return await handleOpenAIMessageStream(fullText, onPage);
  return await geminiSend(fullText, onPage);
};