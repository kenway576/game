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
  PROLOGUE = 'PROLOGUE',
  LOBBY = 'LOBBY',
  ROOM = 'ROOM',
  MAP = 'MAP',
  STORE = 'STORE',      // 百元店 / 渔具店
  GARDEN = 'GARDEN',    // 阳台 / 天台的花盆
  FISHING = 'FISHING',  // 海边钓鱼
  CAFETERIA = 'CAFETERIA',  // 学生食堂
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

// 房间里可以点的东西。
// 坐标用百分比，跟着背景图一起缩放，不依赖屏幕尺寸。
export interface RoomHotspot {
  id: string;
  // 热区在背景图上的位置（%）
  x: number; y: number; w: number; h: number;
  icon: string;
  labelZh: string; labelEn: string;
  // 点下去之后说的话（会按天气/时段取不同的一条）
  linesZh: string[]; linesEn: string[];
  // 解锁条件：没有就一直在；有就等剧情推到那一步。
  // 随着故事推进，房间里能点的东西越来越多。
  requiresFlag?: string;
  // 特殊行为（睡觉推进时间、看风景给描述……）
  action?: 'sleep' | 'wordbook' | 'journal' | 'view' | 'card' | 'kobemap';
}

// 从 201 室阳台看得见的地标。点开来有图有讲解，
// 也是把"这座城市"变成玩家真的认得出来的地方的主要手段。
export interface ViewSpot {
  id: string;
  nameJp: string;
  reading: string;
  nameZh: string;
  nameEn: string;
  // 复用现有背景图，不为此生成新图
  image: string;
  descZh: string;
  descEn: string;
  word?: StoryWord;
  // 剧情推到了才认得出来；不写就一开始就能看
  requiresFlag?: string;
}

// 5. P5 式主角五维人格参数系统 (Protagonist Social Stats)
export interface ProtagonistStats {
  knowledge: number;     // 知识 (Knowledge) 0 - 100
  guts: number;          // 勇气 (Guts) 0 - 100
  kindness: number;      // 体贴 (Kindness) 0 - 100
  charm: number;         // 魅力 (Charm) 0 - 100
  proficiency: number;   // 灵巧 (Proficiency) 0 - 100
}

export type StatKey = keyof ProtagonistStats;

export interface StatGainEvent {
  stat: StatKey;
  amount: number;
  reasonZh: string;
  reasonEn: string;
  timestamp: number;
}

// 6. 关西四季动态日历与时间系统 (Calendar & Schedule)
// 一天：早晨（上课，玩家不能行动）→ 午休 → 午后 → 夜里。
// 午休是后加的：以前只有"放学后"这一段，于是"为什么放学了还能挨个找人"
// 这个问题没有答案。午休把"在校内碰到人"这件事给了一个属于它的时段。
export type TimeSlot = 'morning' | 'lunch' | 'afternoon' | 'night';

export interface GameCalendar {
  month: number;
  day: number;
  dayOfWeek: string;
  timeSlot: TimeSlot;
  weather: 'sunny' | 'cloudy' | 'rainy' | 'sunset' | 'night';
}

// ---------------------------------------------------------
// 💴 钱包 · 背包 · 两个休闲系统
//
// 这一整块是"课余生活"：种东西、钓鱼、逛店。和主线是分开的循环——
// 主线推进解锁店铺和钓点，休闲系统反过来产出送人的礼物和图鉴收集。
//
// 存档里合成一个 LifeState 存，而不是散成七八个字段，
// 免得每加一样东西就要改一次存档读写。
// ---------------------------------------------------------

// 一株盆栽。花盆买回来才有格子，格子空着可以再种。
export interface PlantPlot {
  id: string;
  site: 'balcony' | 'rooftop';   // 家里阳台 / 学校天台
  seedId: string | null;
  // 种下那天的"绝对日序"（月*31+日），跨月也能直接相减
  plantedOn: number | null;
  watered: number;               // 累计浇水次数
  lastWaterOn: number | null;    // 同一天只能浇一次
  wilted?: boolean;              // 太久没浇会蔫（不会死，但收成减半）
  // 有几天该浇没浇。这是"照顾得好不好"的唯一计量，
  // 收成多少、能不能拿到属性加成，全看它。
  missedWater?: number;
}

export type SeedKind = 'flower' | 'veg' | 'herb';

export interface SeedDef {
  id: string;
  kind: SeedKind;
  nameJp: string; reading: string; nameZh: string; nameEn: string;
  price: number;
  growDays: number;      // 从种下到能收，最少要过几天
  needWater: number;     // 还得浇够几次
  months?: number[];     // 适播月份。不写 = 全年
  cropId: string;        // 收获物 id
  cropNameZh: string; cropNameEn: string; cropEmoji: string;
  sellPrice: number;     // 收获物单价
  emoji: string;
  descZh: string; descEn: string;
  word?: StoryWord;
}

export interface FishDef {
  id: string;
  nameJp: string; reading: string; nameZh: string; nameEn: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  minCm: number; maxCm: number;
  spots: string[];              // 能钓到的地点 id（对应 MAP_LOCATIONS）
  timeSlots?: TimeSlot[];
  months?: number[];
  weather?: GameCalendar['weather'][];
  yenPerCm: number;             // 卖价按尺寸算，钓到大的才值钱
  emoji: string;
  noteZh: string; noteEn: string;   // 图鉴上的一段介绍
  word?: StoryWord;
  junk?: boolean;               // 空罐子、长靴这类，算钓到但不进图鉴
}

// 图鉴里记的是"你钓到过的"，不是"存在的"
export interface FishRecord {
  count: number;
  bestCm: number;
  firstMonth: number;
  firstDay: number;
}

// 鱼竿。power 越高越容易上稀有鱼，也越经得住挣扎。
export interface RodDef {
  id: string;
  nameJp: string; reading: string; nameZh: string; nameEn: string;
  price: number;
  power: number;      // 1..3
  emoji: string;
  descZh: string; descEn: string;
}

// 料理。材料来自自己种的菜和自己钓的鱼——所以这个系统是前两个的出口，
// 而不是又一个独立循环。
export interface RecipeDef {
  id: string;
  nameJp: string; reading: string; nameZh: string; nameEn: string;
  // 需要的具体材料（种出来的菜、买来的东西）
  needs?: { itemId: string; n: number }[];
  // 需要几条鱼（不挑种类）。挑种类的写在 needFish 里。
  anyFish?: number;
  needFish?: { fishId: string; n: number }[];
  // 吃掉之后长的属性。这游戏没有战斗，属性就是推进对话选项的唯一货币，
  // 所以"做饭"必须真的给得动数值，否则它只是个装饰。
  effects: StoryEffect[];
  emoji: string;
  descZh: string; descEn: string;
  word?: StoryWord;
}

export interface LifeState {
  yen: number;
  // 手头的东西：种子 / 收获物 / 鱼饵 / 花盆 都记在这儿，key = itemId
  items: Record<string, number>;
  rodId: string | null;
  plots: PlantPlot[];
  fishDex: Record<string, FishRecord>;
  // 一天只能钓一定次数，免得刷
  fishedOn: number | null;
  fishedToday: number;
  // 做过一次的菜。第一次做会多给一点知识——学会了就是学会了。
  cookedDex?: Record<string, number>;
}

// ---------------------------------------------------------
// 🗺️ 地图系统
//
// 女神异闻录式：能去的地方一开始很少，剧情推进了才一片片亮起来。
// 地点本身不是背景图的同义词——它带着"这时候能不能去""谁常在这儿"
// "去了会撞上什么事"，所以另起一套数据，只借 SCENE_MAP 的图。
// ---------------------------------------------------------

// 地图上的分区。顺序就是从家往外走的顺序。
export type MapDistrict = 'school' | 'kitano' | 'sannomiya' | 'harbor' | 'far';

export interface MapLocation {
  // 同时是 SCENE_MAP 的 key —— 地点的图直接复用已有背景，不生成新图
  id: string;
  district: MapDistrict;
  nameJp: string;
  reading: string;
  nameZh: string;
  nameEn: string;
  // 一句话说清这是什么地方。地图卡片上就显示这句。
  blurbZh: string;
  blurbEn: string;
  // 什么时段能去。不写 = 全天。
  timeSlots?: TimeSlot[];
  // 这一趟要花掉几格放学后时间。不写 = 市内 1 格、市外(far) 2 格。
  // 吃一碗二郎系拉面和顺路拐进便利店，代价不该一样。
  timeCost?: number;
  // 解锁条件：剧情 flag。不写 = 一开始就能去。
  requiresFlag?: string;
  // 没解锁时地图上给的提示。要说"还去不了"，但不能剧透。
  lockedHintZh?: string;
  lockedHintEn?: string;
  // 常在这儿出没的人。地图上先露个名字，让玩家能有目的地挑地方去。
  regulars?: CharacterId[];
  // 没有可触发事件时的空转旁白。随机挑一条，让白跑一趟也有东西看。
  ambientZh?: string[];
  ambientEn?: string[];

  // ---- 同一个地方的别的图（都是 SCENE_MAP 的 key）----
  //
  // 一个地方只挂一张图的代价是：素材里那些外观图、夜景图、另一个角度，
  // 全都没有地方可以出现。而玩家在地图上挑地方的时候，
  // 他想看的本来就是**外观**——决定去不去看的是门脸，不是里面长什么样。
  //
  // mapScene   地图预览用这张。通常是外观。
  // nightScene 夜里去的时候换这张。
  // extraScenes 白跑一趟（空转旁白）时随机换一张，重复去不会永远同一张。
  mapScene?: string;
  nightScene?: string;
  extraScenes?: string[];
}

// 地图事件：去某个地方触发的一段剧本。
// 一个人出场 = 课后小剧情；两个人以上 = 多人剧情。用同一套结构，
// 因为"条件满足就演"这件事对两者是一样的，分开写只会多一份筛选逻辑。
export interface MapEventDef {
  // 同时当作"演过了"的 flag 存进 storyFlags
  id: string;
  locationId: string;
  // 出场角色。空数组 = 纯探索事件（比如第一次走到某个地方，解锁新区域）
  chars: CharacterId[];
  titleZh: string;
  titleEn: string;
  timeSlots?: TimeSlot[];
  // 覆盖地点的默认耗时。同一个地方，"陪她排两小时队"和"路过打个招呼"不一样。
  timeCost?: number;
  weather?: GameCalendar['weather'][];
  // 这些 flag 全部为真才会出现
  requiresFlags?: string[];
  // 这些 flag 里有任意一个为真就不出现（用来做互斥的分支事件）
  forbidsFlags?: string[];
  // 关系门槛。多人剧情就是在这儿写"两个人都得熟到一定程度"。
  minAffection?: Partial<Record<CharacterId, number>>;
  minFamiliarity?: Partial<Record<CharacterId, number>>;
  // 默认只演一次。设 true 则每次去都可能再演。
  repeatable?: boolean;
  // 同时满足条件时，数字大的先演。默认 0。
  priority?: number;
  script: StoryNode[];
}

export interface CalendarEvent {
  id: string;
  month: number;
  day: number;
  titleZh: string;
  titleEn: string;
  city: string;
  location: string;
  descriptionZh: string;
  descriptionEn: string;
  relatedCharIds: CharacterId[];
  isMajorFestival?: boolean;
}
// ---------------------------------------------------------
// 7. 剧本 / 选项系统 (Story Script & Choice System)
// 序章等固定剧情走这套数据驱动的播放器，与 AI 对话完全分离。
// ---------------------------------------------------------

// 一次属性增益。文案分中英，直接喂给 StatGainToast。
export interface StoryEffect {
  stat: StatKey;
  amount: number;
  reasonZh: string;
  reasonEn: string;
}

// 一次关系变动。剧本能直接给親密度/好感度——
// 没有这个，序章里"主动跟邻居搭话"就只能加魅力，攒不下任何关系。
export interface StoryRelationEffect {
  char: CharacterId;
  familiarity?: number;
  affection?: number;
  reasonZh: string;
  reasonEn: string;
}

// 剧本台词里挂的生词。节点展示时自动进单词本，
// 让序章的日语原文真的算"学过"，而不是读完就没了。
export interface StoryWord {
  jp: string;
  reading?: string;
  zh: string;
  en: string;
}

// 剧本可以指定的 BGM 轨（audioManager.BgmTrack 由此派生，保持单一事实来源）
export type StoryBgmTrack = 'title' | 'lobby' | 'chat' | 'train' | 'town' | 'store' | 'night';

// 选项的属性门槛。不满足时选项灰掉但仍然可见——
// 让玩家看见"如果当时勇气再高一点"，这是这套系统的主要驱动力。
export interface StoryRequirement {
  stat: StatKey;
  min: number;
}

export interface StoryOption {
  id: string;
  labelZh: string;
  labelEn: string;
  // 这句话主角是用日语说出口的时候，把原句写在这儿。
  // 写了之后选项上大字显示的就是日语本身，labelZh/labelEn 退到下面当译文。
  //
  // 为什么值得单独开一个字段：这个游戏是拿来学日语的，而"要说什么"
  // 恰好是玩家唯一一次主动产出语言的时刻。只给中文的话，
  // 玩家读完选项、点下去、然后才在对话框里看见自己说了什么日语——
  // 那句话跟他的选择就断开了。写在选项上，选的就是那句话本身。
  //
  // 只在主角真的开口时用。心里想的、动作类的选项不要写，
  // 否则玩家会以为自己说了一句其实没说的话。
  jp?: string;
  // 这句话里想教的词。选中之后进单词本——选过的句子比读过的句子记得牢。
  words?: StoryWord[];
  // 选项下方的小字：提示语气或代价，不剧透具体加什么属性
  hintZh?: string;
  hintEn?: string;
  requires?: StoryRequirement;
  // 剧情前提：没有这个 flag 就**根本不显示**这个选项。
  // 和 requires 的区别：requires 是"你不够勇敢"，选项照样列出来吊着你；
  // requiresFlag 是"你压根没学过这句话"，列出来只会让玩家莫名其妙。
  requiresFlag?: string;
  effects?: StoryEffect[];
  // 选中后立刻结算的关系变动（找谁搭话、帮了谁）
  relations?: StoryRelationEffect[];
  setFlags?: string[];
  // 选中后插入播放的分支节点，播完自动回到主线
  then: StoryNode[];
}

// 便利店等"自由逛"场景里的一件商品
export interface ShopItem {
  id: string;
  price: number;          // 日元
  nameJp: string;         // 日语原名（学习用）
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  emoji: string;
  imageUrl?: string;      // 专属商品立绘 / 插画卡片路径
  effects?: StoryEffect[];
  relations?: StoryRelationEffect[];
  setFlags?: string[];
}

export type StoryNode =
  // 切背景（可带一个章节标题卡）。bgm 省略时沿用上一场的曲子。
  | { type: 'scene'; scene: string; bgm?: StoryBgmTrack; titleZh?: string; titleEn?: string; subtitleZh?: string; subtitleEn?: string }
  // 旁白 / 内心独白。characterImage 用来在旁白里让人上下场：
  // 给路径 = 换上这张立绘，给空串 = 让当前立绘退场，不写 = 保持不变。
  | { type: 'narration'; zh: string; en: string; words?: StoryWord[]; characterImage?: string }
  // 台词。jp 有值时上方显示日语原文，下方显示译文（本作是日语学习游戏）；
  // characterImage 语义同 narration：给路径换立绘、给空串退场、不写则沿用上一张
  | { type: 'speech'; speakerZh: string; speakerEn: string; jp?: string; zh: string; en: string; color?: string; characterImage?: string; words?: StoryWord[] }
  // 无条件属性 / 关系增益（剧情自动给的）
  | { type: 'effect'; effects?: StoryEffect[]; relations?: StoryRelationEffect[]; setFlags?: string[] }
  // 全屏 CG 插画。播放后永久解锁到回忆图鉴。
  | { type: 'cg'; cgId: string; imageUrl: string; titleZh: string; titleEn: string; captionZh: string; captionEn: string }
  // 分歧选项
  | { type: 'choice'; promptZh: string; promptEn: string; options: StoryOption[] }
  // 自由购物（便利店）：预算内随便挑，结算时统一生效。
  // setFlagsOnPurchase / setFlagsOnEmpty 用来分叉后续剧情——
  // 空手走出去的人不该被店员问「要筷子吗」。
  | { type: 'shop'; budget: number; promptZh: string; promptEn: string; items: ShopItem[]; setFlagsOnPurchase?: string[]; setFlagsOnEmpty?: string[] }
  // 条件插播：满足 flag 时才播这段（用于回收前面的选择）
  | { type: 'branch'; ifFlag: string; not?: boolean; then: StoryNode[] }
  // 剧情里问玩家的名字。取代开场的「学员登记」表单：
  // 名字不该在游戏还没开始时填，而该在第一个角色真的开口问你时填。
  | { type: 'nameInput'; promptZh: string; promptEn: string; placeholderZh: string; placeholderEn: string }
  // 数值分歧：按好感度 / 親密度 / 五维的当前值分叉。
  // 和 branch 的区别是 branch 判"发生过没有"，check 判"到什么程度了"。
  // 第③段的「相爱 or 挚友」就靠它——两个结局共用前面的铺垫，只在最后岔开。
  | {
      type: 'check';
      metric: 'affection' | 'familiarity' | StatKey;
      min: number;
      then: StoryNode[];
      otherwise?: StoryNode[];
    }
  // 随机插播：从 pick 里随机抽一组播出去（重玩时遇到的人不一样）。
  // 抽中的结果会被就地拼进节点表、随进度一起存档，
  // 所以读档回来播的还是同一段，不会刷新一次换一个人。
  | { type: 'random'; pick: StoryNode[][] };

// 剧情选择留下的痕迹。随存档保存，可注入 AI 的 system prompt。
export type StoryFlags = Record<string, boolean>;

// 序章中途进度。独立于存档槽单独写 localStorage：
// 关掉页面再回来能接着看，不用把 103 段文本重播一遍。
export interface StoryProgress {
  version: string;
  idx: number;
  nodes: StoryNode[];
  flags: StoryFlags;
  stats: ProtagonistStats;
  // 已经拿到手的东西也要一起存，否则续玩会把序章前半段的收获吞掉
  words: StoryWord[];
  relations: StoryRelationEffect[];
  unlockedCgs: string[];
  savedAt: number;
}

// 序章结算屏的数据
export interface PrologueResult {
  flags: StoryFlags;
  statsBefore: ProtagonistStats;
  statsAfter: ProtagonistStats;
  wordsLearned: number;
  skipped: boolean;
}
