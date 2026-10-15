import { CharacterId } from '../types';

// ==========================================================
// 🗣️ 每个人说的日语，难度不一样
//
// 以前八个人在 AI 对话里全是「JLPT N3」，于是跟谁聊都是同一种日语——
// 这是一个学日语的游戏，"跟谁说话"本来就该是"练哪一种日语"。
//
// 从易到难排开，玩家可以按自己的水平挑人：
//   奈绪 N5–N4（最好懂）→ 光 N4 → 空 N4–N3 → 明日香 N3 → 真希 N3 + 浓关西腔
//   → 深雪 N3–N2 敬语 → 铃 N2–N1 书面语 → 稻荷 N1 + 古语（最难）
// 每个人的难度跟她的人设是一回事：奈绪天然、说话简单；铃是读书人；稻荷活了一千年。
//
// 用在：AI 当面聊天、手机聊天的提示词（services/geminiService.ts）、大厅和手机上的标签。
// ==========================================================

export interface JpLevel {
  jlpt: string;                 // 标签上显示的那个：N4、N2–N1……
  styleZh: string; styleEn: string;
  // 给模型的指令（英文写，模型最听得进去）
  prompt: string;
  // 注音标到哪一级：all = 所有汉字都标；n3 = N3 及以上的汉字才标；n2 = 只标 N2 以上
  furigana: 'all' | 'n4' | 'n3' | 'n2';
}

export const JP_LEVELS: Partial<Record<CharacterId, JpLevel>> = {
  [CharacterId.NAO]: {
    jlpt: 'N5–N4', styleZh: '短句 · 常体 · 最好懂', styleEn: 'Short, plain, easiest',
    prompt: 'Speak at JLPT N5–N4. Very short sentences (one idea each, roughly 15 characters or fewer), plain form (だ/る/た), only everyday words a beginner knows, almost no kanji compounds above N4, no idioms, no keigo. Repeat the key word of a sentence once if it might be new. She is the easiest person in the game to understand — that is part of who she is.',
    furigana: 'all'
  },
  [CharacterId.HIKARI]: {
    jlpt: 'N4', styleZh: '简单口语 · 拟声词多', styleEn: 'Simple casual, lots of onomatopoeia',
    prompt: 'Speak at JLPT N4. Short casual sentences, lots of exclamations and onomatopoeia (ワクワク, ドキドキ, キラキラ, ぱっと), common words only, simple て-form chains. A light touch of Kansai (めっちゃ, 〜やん) is fine. Avoid written-style words and keigo.',
    furigana: 'all'
  },
  [CharacterId.SORA]: {
    jlpt: 'N4–N3', styleZh: '运动部短句 · 男孩子气', styleEn: 'Punchy sports-club talk',
    prompt: 'Speak at JLPT N4–N3. Short, punchy casual sentences, boyish speech (〜じゃん, 〜だろ, 〜ぜ occasionally), sports-club words (練習, 試合, 部活, シュート, 根性). Simple grammar; the occasional N3 pattern (〜ようにする, 〜ばかり) is fine.',
    furigana: 'n4'
  },
  [CharacterId.ASUKA]: {
    jlpt: 'N3', styleZh: '标准语 · 语法规范', styleEn: 'Standard, by-the-book',
    prompt: 'Speak at JLPT N3 in clean standard Japanese — the textbook model a learner should copy. Use N3 grammar naturally (〜わけ, 〜ばかり, 〜ようにする, 〜ことにする, 〜はずだ) with tsundere sentence endings (〜わよ, 〜なさい, 〜じゃない). No dialect.',
    furigana: 'n4'
  },
  [CharacterId.MAKI]: {
    jlpt: 'N3', styleZh: '浓关西腔 · 年轻人俗语', styleEn: 'Heavy Kansai + slang',
    prompt: 'Grammar around JLPT N3, but in HEAVY Kansai-ben and youth slang — this is the dialect-listening challenge of the game: 〜へん, 〜やん, 〜やろ, 〜しとる, 〜てもうた, あかん, ほんま, めっちゃ, なんでやねん, ウケる, ざぁこ. Keep each sentence short so the dialect is the only hard part.',
    furigana: 'n4'
  },
  [CharacterId.MIYUKI]: {
    jlpt: 'N3–N2', styleZh: '礼貌体 · 柔和敬语', styleEn: 'Polite, soft keigo',
    prompt: 'Speak at JLPT N3–N2 in gentle polite Japanese: です/ます throughout, soft keigo where an adult neighbour would use it (〜ていらっしゃる, 〜させていただく, お〜になる, 〜でしょうか), household and daily-life vocabulary (献立, 洗濯物, 回覧板), slightly longer, calm sentences.',
    furigana: 'n3'
  },
  [CharacterId.REI]: {
    jlpt: 'N2–N1', styleZh: '书面语 · 学术词汇', styleEn: 'Written style, academic words',
    prompt: 'Speak at JLPT N2–N1. Precise, written-style Japanese: academic vocabulary (観測, 仮説, 概念, 根拠, 一般的に), N2–N1 grammar (〜に基づいて, 〜にほかならない, 〜とは限らない, 〜に際して, 〜をめぐって), longer sentences with clear logic. When she explains something, である-style is natural for her.',
    furigana: 'n3'
  },
  [CharacterId.INARI]: {
    jlpt: 'N1+', styleZh: '古语 · 文语 · 最难', styleEn: 'Archaic, classical — hardest',
    prompt: 'Speak at JLPT N1 and above, in archaic, classical-flavoured Japanese: わらわ, そなた, 〜じゃ, 〜ぬ, 〜おる, 〜であろう, 〜ておくれ, literary vocabulary (幾星霜, 縁, 儚い, 憂い), the occasional classical phrase. She is the hardest person in the game to understand — that is part of who she is.',
    furigana: 'n2'
  }
};

export const jpLevelOf = (id: CharacterId): JpLevel => JP_LEVELS[id] || {
  jlpt: 'N3', styleZh: '标准口语', styleEn: 'Standard casual',
  prompt: 'Speak at JLPT N3: natural standard Japanese, everyday vocabulary.', furigana: 'n4'
};

const FURIGANA_RULE: Record<JpLevel['furigana'], string> = {
  all: 'Put <ruby> readings on EVERY kanji word.',
  n4: 'Put <ruby> readings on every kanji word above JLPT N5.',
  n3: 'Put <ruby> readings on every kanji word of JLPT N3 level and above.',
  n2: 'Put <ruby> readings on every kanji word of JLPT N2 level and above, and on every archaic or literary word.'
};

// 提示词里的那一段
export const jpLevelPrompt = (id: CharacterId): string => {
  const l = jpLevelOf(id);
  return `[LANGUAGE LEVEL — YOUR OWN WAY OF SPEAKING (CRITICAL, overrides any other level mentioned)]
    - ${l.prompt}
    - Furigana: ${FURIGANA_RULE[l.furigana]}
    - Stay at this level for the whole conversation, in speech AND narration. Different people in this game speak at different levels; this one is yours.`;
};
