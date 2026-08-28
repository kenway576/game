// 1. 基础类型定义
export type Language = 'zh' | 'en';

export interface DialoguePage {
  type: 'speech' | 'action' | 'narration'; 
  text: string;
}

export interface WordReading {
  word: string;
  reading: string;
}

export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  senderName?: string;
  pages?: DialoguePage[];
  vocabulary?: WordReading[];
  quiz?: QuizData | null;
  emotion?: string;
  outfit?: string;
  location?: string;
  affectionDelta?: number;
  familiarityDelta?: number;
}

// 2. 角色与游戏状态
export interface Character {
  id: CharacterId;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  description: string;
  descriptionEn: string;
  avatarUrl: string;
  color: string;
  emotionMap: Record<string, string>;
  firstMessage: string;
  systemPrompt: string;
  hidden?: boolean; // true = 不在大厅/记录中显示（数据保留，可随时恢复）
}

export enum CharacterId {
  ASUKA = 'asuka',
  HIKARI = 'hikari',
  REI = 'rei',
  REN = 'ren',
  HAKU = 'haku',
  INARI = 'inari',
  MIYUKI = 'miyuki',
  SORA = 'sora',
  NAO = 'nao',
  MAKI = 'maki'
}

export enum ChatMode {
  FREE_TALK = 'FREE_TALK',
  STUDY = 'STUDY'
}

export enum GameMode {
  SETUP = 'SETUP',
  LOBBY = 'LOBBY',
  CHAT = 'CHAT'
}

// 🔥 扩充了 N3 核心语法点
export enum N3GrammarTopic {
  GENERAL = 'General (综合练习)',
  PASSIVE = 'Passive (受身形 - れる/られる)',
  CAUSATIVE = 'Causative (使役形 - せる/させる)',
  PASSIVE_CAUSATIVE = 'Causative-Passive (使役受身形 - される)',
  CONDITIONAL = 'Conditional (条件形 - と/ば/たら/なら)',
  RESPECTFUL = 'Keigo (敬語 - 尊敬/謙譲/丁寧)',
  POTENTIAL = 'Potential (可能形 - える/られる)',
  VOLITIONAL = 'Volitional (意向形 - おう/よう)',
  TRANSITIVE_INTRANSITIVE = 'Transitive/Intransitive (自他動詞)',
  GIVING_RECEIVING = 'Giving/Receiving (授受表現 - あげる/もらう/くれる)'
}

export interface CollectedWord {
  id: string;
  original: string;
  translation: string;
  timestamp: number;
}

export interface UserState {
  learningGoal: string;
  grammarTopic: N3GrammarTopic;
  playerName: string;
  email: string; // 🔥 新增这一行
  collectedWords: CollectedWord[];
  language: Language;
}

export interface CustomAssets {
  backgroundImage: string | null;
  characters: Record<CharacterId, string | null>;
}

// 3. 好感度系统
export type AffectionMap = Record<CharacterId, number>;

// 4. 长期记忆：每个角色一段滚动更新的记忆摘要（日语，随存档保存）
export type MemoryMap = Record<CharacterId, string>;

export interface AffectionLevelDef {
  threshold: number;      // 达到该好感度数值即进入此等级
  id: string;
  labelZh: string;
  labelEn: string;
  promptHint: string;     // 注入 system prompt，控制角色态度
}