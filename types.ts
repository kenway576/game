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

// 3. 关系系统（双轴）
// 親密度 = 有多熟（说话方式、能聊多深、能一起去哪里）
// 好感度 = 有多喜欢（恋爱线、服装解锁）
// 两者独立：幼馴染一开始親密度满、好感度为零。
export type AffectionMap = Record<CharacterId, number>;
export type FamiliarityMap = Record<CharacterId, number>;

// 4. 长期记忆：每个角色一段滚动更新的记忆摘要（日语，随存档保存）
export type MemoryMap = Record<CharacterId, string>;

export interface RelationshipLevelDef {
  threshold: number;      // 达到该数值即进入此等级
  id: string;
  labelZh: string;
  labelEn: string;
  promptHint: string;     // 注入 system prompt，控制角色态度
}

// 兼容旧名：好感度等级与親密度等级结构一致
export type AffectionLevelDef = RelationshipLevelDef;

// 关系轴标识：升级庆祝、提示气泡等需要区分是哪条线涨了
export type RelationshipAxis = 'familiarity' | 'affection';

// 角色与玩家的"初始关系"档案。与 CHARACTERS 分开维护，
// 便于横向对比十个角色的起点，也避免污染巨大的 emotionMap 条目。
export interface RelationshipProfile {
  // 'stranger' = 游戏开始时素不相识；'acquainted' = 剧情设定上早就认识
  origin: 'stranger' | 'acquainted';
  // 開局親密度（0 ~ FAMILIARITY_MAX）。好感度一律从 0 开始，不在这里配置。
  initialFamiliarity: number;
  // 两人是怎么认识的 / 现有关系是什么（注入 system prompt）
  encounter: string;
  // 每个親密度等级下的称呼、语体与距离感（5 项，对应 Lv.1~Lv.5）
  stages: [string, string, string, string, string];
  // 初対面场景的基调参考脚本；未填写时回退到 Character.firstMessage
  firstMeeting?: string;
  // 已认识的角色：预置一段共同记忆，让"过去"从第一句话起就存在
  seedMemory?: string;
}