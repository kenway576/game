import { CharacterId } from '../types';

// ---------------------------------------------------------
// 【第0章】剧本元数据
//
// 与 prologueData.ts（剧本正文）分开：这里放的是"结算屏 / 存档 / 图鉴"
// 这类系统要读的索引信息。改剧本正文不必动这里，反之亦然。
// ---------------------------------------------------------

// 中途存档的版本戳。剧本结构改动后手动 +1，
// 旧的半截进度会被丢弃而不是错位播放到别人的台词上。
export const PROLOGUE_SCRIPT_VERSION = '0.5.0';

// 序章中途进度写在这个键下（独立于存档槽：序章还没打完就还没有"角色"可存）
export const PROLOGUE_PROGRESS_KEY = 'kobe_study_prologue_progress_v1';

export type PrologueFlagGroup = 'attitude' | 'encounter' | 'purchase';

export interface PrologueFlagLabel {
  icon: string;
  zh: string;
  en: string;
  group: PrologueFlagGroup;
  // 结算屏上归到哪位角色名下（相遇类才有）
  char?: CharacterId;
}

// 结算屏用：把 flag 翻译成一句人话。
// 没登记的 flag 不显示——买了什么杂货不值得单独列一行。
export const PROLOGUE_FLAG_LABELS: Record<string, PrologueFlagLabel> = {
  // ---- 一路上你是个什么样的人 ----
  prologue_train_sea:      { icon: '🌊', zh: '把额头贴在车窗上，看了很久那片海', en: 'Watched the sea with your forehead against the glass', group: 'attitude' },
  prologue_train_study:    { icon: '📖', zh: '在电车上又啃下了一页单词', en: 'Crammed one more page of vocabulary on the train', group: 'attitude' },
  prologue_train_journal:  { icon: '🕰', zh: '在电车上翻开了外祖父的手账', en: "Opened your grandfather's journal on the train", group: 'attitude' },
  prologue_helped_mother:  { icon: '🤝', zh: '在三宫站台帮了那位手忙脚乱的母亲', en: 'Helped the flustered young mother at Sannomiya', group: 'attitude' },
  prologue_ignored_mother: { icon: '🚶', zh: '在三宫站台没有停下脚步', en: 'Kept walking past on the Sannomiya platform', group: 'attitude' },
  prologue_unpack_books:   { icon: '📚', zh: '先把书一本本码上了书架', en: 'Shelved your books one by one before anything else', group: 'attitude' },
  prologue_unpack_clean:   { icon: '🧹', zh: '先把 201 室从头到尾擦了一遍', en: 'Scrubbed Room 201 from end to end first', group: 'attitude' },
  prologue_unpack_call:    { icon: '📞', zh: '先给家里打了一通报平安的电话', en: 'Called home first to say you had arrived safely', group: 'attitude' },
  prologue_read_journal_deep: { icon: '✒️', zh: '把外祖父的手账从头读到了尾', en: "Read your grandfather's journal from cover to cover", group: 'attitude' },
  prologue_journal_shelved:{ icon: '📕', zh: '把手账合上，放进了书架最上层', en: 'Closed the journal and set it on the top shelf', group: 'attitude' },
  prologue_walk_kitano:    { icon: '⛰', zh: '沿着北野的坡道一路往上走', en: 'Walked up the Kitano slope', group: 'attitude' },
  prologue_walk_harbor:    { icon: '⚓', zh: '一路走到了港边，看着摩天轮亮起来', en: 'Walked to the harbour and watched the ferris wheel light up', group: 'attitude' },
  prologue_walk_arcade:    { icon: '🏮', zh: '钻进了三宫的商店街', en: 'Ducked into the Sannomiya shopping arcade', group: 'attitude' },
  prologue_eager_out:      { icon: '👟', zh: '东西还没收完就先出门了', en: 'Went out before the unpacking was done', group: 'attitude' },

  // ---- 第一次真正开口说日语 ----
  prologue_checkout_kansai:  { icon: '🗣', zh: '结账时试着用了刚学会的关西腔', en: 'Tried freshly-learned Kansai-ben at the register', group: 'attitude' },
  prologue_checkout_jp:      { icon: '🎌', zh: '结账时用教科书上的标准日语说完了整句', en: 'Got a full textbook-Japanese sentence out at the register', group: 'attitude' },
  prologue_checkout_gesture: { icon: '🤲', zh: '结账时话卡在了喉咙里，用手势比划过去了', en: 'The words stuck; you got through the register on gestures', group: 'attitude' },

  // ---- 遇见的人 ----
  prologue_greeted_miyuki: { icon: '🌙', zh: '主动向便利店里那位银发的邻居开了口', en: 'Spoke first to the silver-haired neighbour in the store', group: 'encounter', char: CharacterId.MIYUKI },
  prologue_nodded_miyuki:  { icon: '🎐', zh: '和那位银发的邻居互相鞠了一躬', en: 'Exchanged a bow with the silver-haired neighbour', group: 'encounter', char: CharacterId.MIYUKI },
  prologue_avoided_miyuki: { icon: '💤', zh: '移开了视线——今天已经够累了', en: 'Looked away — today had already been long enough', group: 'encounter', char: CharacterId.MIYUKI },
  prologue_spoke_first:    { icon: '💬', zh: '在站台上对陌生人说出了第一句日语', en: 'Said your first Japanese sentence to a stranger on the platform', group: 'attitude' },

  // ---- 傍晚去了哪儿、遇见了谁 ----
  prologue_met_rei:        { icon: '📐', zh: '在北野的窄巷里差点撞上一个看门楣的人', en: 'Nearly walked into someone studying a doorway in a Kitano alley', group: 'encounter', char: CharacterId.REI },
  prologue_rei_asked:      { icon: '🌿', zh: '问了她门楣上那朵花是什么', en: 'Asked her what the flower carved above the door was', group: 'attitude' },
  prologue_rei_journal:    { icon: '🗺', zh: '把外公的手绘地图递给她看了', en: "Showed her your grandfather's hand-drawn map", group: 'attitude' },
  prologue_rei_passed:     { icon: '🚸', zh: '在窄巷里让了路，没有打扰她', en: 'Gave way in the alley and left her to it', group: 'attitude' },

  prologue_met_hikari:     { icon: '📸', zh: '在神户港的栏杆边被一个金发女生一眼认出', en: 'A blonde girl at the harbour railing pegged you on sight', group: 'encounter', char: CharacterId.HIKARI },
  prologue_hikari_answered:{ icon: '✈️', zh: '老实承认自己今天才到', en: 'Owned up to having landed that very day', group: 'attitude' },
  prologue_hikari_teased:  { icon: '🔍', zh: '反问她「你是怎么看出来的」', en: 'Asked her back how she could tell', group: 'attitude' },
  prologue_hikari_nodded:  { icon: '😅', zh: '被她的气势压住，只点了点头', en: 'Got flattened by her momentum and just nodded', group: 'attitude' },

  prologue_met_maki:       { icon: '🐙', zh: '在三宫商店街的章鱼烧摊前被一个粉发女生逮住', en: 'A pink-haired girl cornered you at a takoyaki stand in Sannomiya', group: 'encounter', char: CharacterId.MAKI },
  prologue_maki_asked:     { icon: '🍢', zh: '老老实实请教了章鱼烧怎么吃', en: 'Straight-up asked how you are supposed to eat takoyaki', group: 'attitude' },
  prologue_maki_kansai:    { icon: '🎤', zh: '用现学的关西腔回了她一句「ちゃうで」', en: 'Fired back a freshly-learned Kansai "chau de"', group: 'attitude' },
  prologue_maki_left:      { icon: '🌀', zh: '笑了一下就走进了人流里', en: 'Smiled once and stepped back into the crowd', group: 'attitude' },

  // ---- 擦肩而过（随机加演）：没说上话，但确实碰上了 ----
  prologue_glimpsed_rei:    { icon: '👓', zh: '路过一扇门，有人正仰头看那朵雕花', en: 'Passed a doorway where someone stood reading the carving', group: 'encounter', char: CharacterId.REI },
  prologue_glimpsed_hikari: { icon: '🏃', zh: '在坡道口差点被一个金发女生撞上', en: 'A blonde girl nearly ran into you at the foot of the slope', group: 'encounter', char: CharacterId.HIKARI },
  prologue_glimpsed_maki:   { icon: '💬', zh: '便利店门口有个粉发女生从你面前横穿而过', en: 'A pink-haired girl cut across in front of the store', group: 'encounter', char: CharacterId.MAKI },

  // ---- 和深雪一起走的那段坡道 ----
  prologue_miyuki_carried: { icon: '🛍', zh: '在坡道上替她拎了一袋东西', en: 'Carried one of her bags up the hill', group: 'attitude' },
  prologue_miyuki_groceries:{ icon: '🥬', zh: '问了她这一带哪里买东西便宜', en: 'Asked her where the cheap shops around here are', group: 'attitude' },
  prologue_miyuki_silent:  { icon: '🌃', zh: '一句话没说，只是配合她的步子走完了坡道', en: 'Said nothing, and simply matched her pace to the top', group: 'attitude' },
  prologue_miyuki_named:   { icon: '📛', zh: '在门口问了她的名字——深雪', en: 'Asked her name at the door — Miyuki', group: 'attitude' },
  prologue_miyuki_thanked: { icon: '🙇', zh: '端端正正地向她道了谢', en: 'Thanked her with a proper bow', group: 'attitude' },
  prologue_miyuki_wave:    { icon: '👋', zh: '挥挥手就上了楼', en: 'Waved once and went up the stairs', group: 'attitude' },
  prologue_miyuki_wave_back:{ icon: '🤚', zh: '在她关门前无声地挥了挥手', en: 'Waved back silently before her door closed', group: 'attitude' },
  prologue_miyuki_bow_back:{ icon: '🎎', zh: '回了她一个深得过分的鞠躬', en: 'Returned her bow, rather too deeply', group: 'attitude' },
  prologue_miyuki_missed:  { icon: '🚪', zh: '还没想好回什么，楼下的门已经关上了', en: 'The door below shut before you thought of an answer', group: 'attitude' },

  // ---- 便利店买没买 ----
  prologue_empty_handed:   { icon: '👛', zh: '在便利店什么都没买，空着手走了出去', en: 'Left the convenience store without buying anything', group: 'attitude' }
};

// 互斥压制：关西腔那个选项同时置了 checkout_jp（它确实也是一句完整日语），
// 但两行一起列出来会自相矛盾——被压制的那条不进结算屏。
// 键 = 被压制的 flag，值 = 压制它的 flag。
export const PROLOGUE_FLAG_SUPERSEDED: Record<string, string> = {
  prologue_checkout_jp: 'prologue_checkout_kansai'
};

// 便利店商品 flag → 结算屏上那一行"你拎回家的东西"
export const PROLOGUE_PURCHASE_LABELS: Record<string, { icon: string; zh: string; en: string }> = {
  bought_onigiri:   { icon: '🍙', zh: '明太子饭团', en: 'Mentaiko onigiri' },
  bought_oden:      { icon: '🍢', zh: '关东煮套餐', en: 'Oden set' },
  bought_karaage:   { icon: '🍗', zh: '炸鸡块', en: 'Karaage' },
  bought_croquette: { icon: '🥔', zh: '神户牛可乐饼', en: 'Kobe beef croquette' },
  bought_bento:     { icon: '🍱', zh: '幕之内便当', en: 'Makunouchi bento' },
  bought_noodle:    { icon: '🍜', zh: '杯面', en: 'Cup noodles' },
  bought_coffee:    { icon: '☕', zh: '罐装黑咖啡', en: 'Canned black coffee' },
  bought_tea:       { icon: '🥛', zh: '奶茶欧蕾', en: 'Tea au lait' },
  bought_pudding:   { icon: '🍮', zh: '神户布丁', en: 'Kobe pudding' },
  bought_towel:     { icon: '🧻', zh: '旅行毛巾组', en: 'Travel towel set' },
  bought_soap:      { icon: '🧴', zh: '洗洁精', en: 'Dish soap' },
  bought_umbrella:  { icon: '☂️', zh: '折叠伞', en: 'Compact umbrella' },
  bought_clipper:   { icon: '✂️', zh: '指甲刀组', en: 'Nail clipper set' },
  bought_lipbalm:   { icon: '💄', zh: '润唇膏与护手霜', en: 'Lip balm & hand cream' },
  bought_stationery:{ icon: '🖊', zh: '中性笔与笔记本', en: 'Gel pen & notebook' },
  bought_magazine:  { icon: '📰', zh: '神户情报志', en: 'Kobe city guide' }
};
