import { SeedDef, FishDef, RodDef, LifeState, GameCalendar, TimeSlot } from '../types';

// ---------------------------------------------------------
// 🌱🎣 休闲系统的全部数据
//
// 两条线共用一个钱包，但产出方向不一样：
//   种植 —— 慢、稳、可预期。花三四天换一样能送人的东西。
//   钓鱼 —— 快、随机、有图鉴。一次几分钟，赌的是尺寸和稀有度。
//
// 鱼全部是大阪湾 / 明石海峡真的钓得到的鱼，图鉴上那段介绍也都是真的。
// 这个游戏本来就在教日语和这座城市，钓鱼图鉴顺手就是一本方言 + 物产小词典。
// ---------------------------------------------------------

// 把月/日压成一个能直接相减的序号。跨月种菜不用做日期运算。
export const dayIndex = (cal: GameCalendar) => cal.month * 31 + cal.day;

export const INITIAL_LIFE_STATE: LifeState = {
  // 外公留下的那笔零钱。够买一个花盆加两包种子，或者一根最便宜的竿。
  yen: 3000,
  items: {},
  rodId: null,
  plots: [],
  fishDex: {},
  fishedOn: null,
  fishedToday: 0
};

// ==========================================================
// 🌱 种子（百元店）
//
// growDays 和 needWater 是**两个都要满足**的条件：
// 光等天数不浇水长不熟，猛浇水也不能拔苗助长。
// 这样"每天回房间看一眼"才有意义，而不是种完就丢在那儿。
// ==========================================================
export const SEEDS: SeedDef[] = [
  {
    id: 'seed_radish', kind: 'veg',
    nameJp: 'ラディッシュの種', reading: 'ラディッシュのたね',
    nameZh: '樱桃萝卜种子', nameEn: 'Radish Seeds',
    price: 110, growDays: 3, needWater: 3,
    cropId: 'crop_radish', cropNameZh: '樱桃萝卜', cropNameEn: 'Radish', cropEmoji: '🌶️',
    sellPrice: 90, emoji: '🌰',
    descZh: '二十天就能收的懒人菜。百元店的种子袋上写着「初心者向け」，你觉得这是在说你。',
    descEn: 'The lazy gardener’s vegetable, ready in twenty days. The packet says "for beginners", which you take personally.',
    word: { jp: '種', reading: 'たね', zh: '种子', en: 'seed' }
  },
  {
    id: 'seed_basil', kind: 'herb',
    nameJp: 'バジルの種', reading: 'バジルのたね',
    nameZh: '罗勒种子', nameEn: 'Basil Seeds',
    price: 110, growDays: 4, needWater: 4, months: [4, 5, 6, 7, 8, 9],
    cropId: 'crop_basil', cropNameZh: '罗勒', cropNameEn: 'Basil', cropEmoji: '🌿',
    sellPrice: 120, emoji: '🌰',
    descZh: '掐一片叶子放手心搓一下，整个阳台都是味道。神户的洋馆区到处有人在窗台上种。',
    descEn: 'Crush one leaf in your palm and the whole balcony smells of it. Half the windowsills in the Western quarter have a pot.',
    word: { jp: '葉', reading: 'は', zh: '叶子', en: 'leaf' }
  },
  {
    id: 'seed_shiso', kind: 'herb',
    nameJp: '大葉の種', reading: 'おおばのたね',
    nameZh: '紫苏种子', nameEn: 'Shiso Seeds',
    price: 110, growDays: 4, needWater: 3,
    cropId: 'crop_shiso', cropNameZh: '紫苏叶', cropNameEn: 'Shiso Leaf', cropEmoji: '🍃',
    sellPrice: 110, emoji: '🌰',
    descZh: '日本家庭阳台上最常见的一株。长起来之后会一直长，据说没人能把大葉种死。',
    descEn: 'The single most common thing on a Japanese balcony. Once it starts it does not stop; the claim is that nobody has ever killed one.',
    word: { jp: '大葉', reading: 'おおば', zh: '紫苏叶', en: 'shiso leaf' }
  },
  {
    id: 'seed_tomato', kind: 'veg',
    nameJp: 'ミニトマトの苗', reading: 'ミニトマトのなえ',
    nameZh: '小番茄苗', nameEn: 'Cherry Tomato Seedling',
    price: 330, growDays: 6, needWater: 6, months: [4, 5, 6, 7, 8],
    cropId: 'crop_tomato', cropNameZh: '小番茄', cropNameEn: 'Cherry Tomatoes', cropEmoji: '🍅',
    sellPrice: 280, emoji: '🌱',
    descZh: '不是种子是苗，所以贵三倍。但结出来是真能吃的东西。',
    descEn: 'A seedling rather than seed, hence three times the price. But it produces something you can actually eat.',
    word: { jp: '苗', reading: 'なえ', zh: '苗', en: 'seedling' }
  },
  {
    id: 'seed_negi', kind: 'veg',
    nameJp: '万能ねぎの種', reading: 'ばんのうねぎのたね',
    nameZh: '小葱种子', nameEn: 'Spring Onion Seeds',
    price: 110, growDays: 5, needWater: 4,
    cropId: 'crop_negi', cropNameZh: '小葱', cropNameEn: 'Spring Onion', cropEmoji: '🌾',
    sellPrice: 100, emoji: '🌰',
    descZh: '剪掉之后还会再长，可以剪很多次。名字里的「万能」是认真的。',
    descEn: 'Cut it and it grows back, over and over. The "all-purpose" in the name is not marketing.',
    word: { jp: '万能', reading: 'ばんのう', zh: '万能、多用途', en: 'all-purpose' }
  },
  {
    id: 'seed_asagao', kind: 'flower',
    nameJp: 'あさがおの種', reading: 'あさがおのたね',
    nameZh: '牵牛花种子', nameEn: 'Morning Glory Seeds',
    price: 110, growDays: 5, needWater: 5, months: [5, 6, 7],
    cropId: 'crop_asagao', cropNameZh: '牵牛花', cropNameEn: 'Morning Glory', cropEmoji: '🌸',
    sellPrice: 130, emoji: '🌰',
    descZh: '日本小学一年级的暑假作业就是种这个。每个日本人都种过一次，然后忘掉。',
    descEn: 'Every Japanese first-grader grows one over the summer holiday. Everyone has done it once, and then forgotten.',
    word: { jp: '朝顔', reading: 'あさがお', zh: '牵牛花', en: 'morning glory' }
  },
  {
    id: 'seed_marigold', kind: 'flower',
    nameJp: 'マリーゴールドの種', reading: 'マリーゴールドのたね',
    nameZh: '万寿菊种子', nameEn: 'Marigold Seeds',
    price: 110, growDays: 4, needWater: 4,
    cropId: 'crop_marigold', cropNameZh: '万寿菊', cropNameEn: 'Marigold', cropEmoji: '🌼',
    sellPrice: 140, emoji: '🌰',
    descZh: '橙得很凶的一种花，虫子不喜欢它的味道，所以常被种在菜旁边当保镖。',
    descEn: 'An aggressively orange flower. Insects dislike the smell, so it gets planted next to vegetables as a bodyguard.',
    word: { jp: '虫', reading: 'むし', zh: '虫子', en: 'insect' }
  },
  {
    id: 'seed_himawari', kind: 'flower',
    nameJp: 'ひまわりの種', reading: 'ひまわりのたね',
    nameZh: '向日葵种子', nameEn: 'Sunflower Seeds',
    price: 220, growDays: 7, needWater: 7, months: [4, 5, 6, 7],
    cropId: 'crop_himawari', cropNameZh: '向日葵', cropNameEn: 'Sunflower', cropEmoji: '🌻',
    sellPrice: 320, emoji: '🌰',
    descZh: '一个花盆种它其实是有点勉强的。但你还是买了。',
    descEn: 'One pot is, frankly, not enough for this. You buy it anyway.',
    word: { jp: '向日葵', reading: 'ひまわり', zh: '向日葵', en: 'sunflower' }
  }
];

export const findSeed = (id: string) => SEEDS.find(s => s.id === id);

// 花盆。买一个多一个格子。
export const POT_ITEM = 'item_pot';
export const POT_PRICE = 550;
export const MAX_PLOTS = 6;

// 鱼饵。有饵才好钓，没饵也能钓但只上杂鱼。
export const BAIT_ITEM = 'item_bait';
export const BAIT_PRICE = 220;
export const BAIT_PER_PACK = 5;

// ==========================================================
// 🎣 鱼竿（渔具店）
// ==========================================================
export const RODS: RodDef[] = [
  {
    id: 'rod_cheap',
    nameJp: 'なんでも竿', reading: 'なんでもざお',
    nameZh: '万能竿', nameEn: 'All-Rounder Rod',
    price: 1800, power: 1, emoji: '🎣',
    descZh: '店门口塑料桶里插着的那批。老板说「これで十分やで」，说的时候没抬头。',
    descEn: 'From the plastic bucket by the door. The owner says it will do fine, without looking up.'
  },
  {
    id: 'rod_seabass',
    nameJp: 'シーバスロッド', reading: 'シーバスロッド',
    nameZh: '海鲈竿', nameEn: 'Seabass Rod',
    price: 6800, power: 2, emoji: '🎣',
    descZh: '细、长、弹。港湾这一带的人几乎人手一根。',
    descEn: 'Thin, long, springy. Nearly everyone along this stretch of harbour has one.'
  },
  {
    id: 'rod_akashi',
    nameJp: '明石仕掛け一式', reading: 'あかしじかけいっしき',
    nameZh: '明石钓组', nameEn: 'Akashi Tackle Set',
    price: 19800, power: 3, emoji: '🎏',
    descZh: '明石海峡的潮流是全日本最凶的之一，本地人为此专门做了一套配置。贵得离谱。',
    descEn: 'The tide through the Akashi Strait is among the fiercest in Japan, and the locals built a whole rig for it. Absurdly expensive.'
  }
];

export const findRod = (id: string | null) => RODS.find(r => r.id === id) || null;

// ==========================================================
// 🐟 鱼
//
// spots 对应 MAP_LOCATIONS 的 id。神户能钓鱼的地方就这几处：
//   meriken_park   美利坚公园的护岸
//   kobe_harbor    港湾乐园的栈桥
//   portliner_platform 人工岛那一侧（远，鱼也不一样）
// 稀有度 1 最常见，5 是"钓上来会想给人看照片"的那种。
// ==========================================================
export const FISH: FishDef[] = [
  // ---- rarity 1：小杂鱼，随时随地 ----
  {
    id: 'fish_haze', nameJp: 'ハゼ', reading: 'はぜ', nameZh: '虾虎鱼', nameEn: 'Goby',
    rarity: 1, minCm: 8, maxCm: 20,
    spots: ['meriken_park', 'kobe_harbor', 'portliner_platform'],
    yenPerCm: 6, emoji: '🐟',
    noteZh: '护岸边最容易上钩的一种。小孩子第一次钓到的鱼十有八九是它。',
    noteEn: 'The easiest thing to hook off a quay wall. Nine times out of ten it is the first fish a child ever catches.',
    word: { jp: '釣る', reading: 'つる', zh: '钓', en: 'to fish / to catch' }
  },
  {
    id: 'fish_iwashi', nameJp: 'イワシ', reading: 'いわし', nameZh: '沙丁鱼', nameEn: 'Sardine',
    rarity: 1, minCm: 10, maxCm: 22,
    spots: ['meriken_park', 'kobe_harbor'],
    yenPerCm: 7, emoji: '🐟',
    noteZh: '成群来，一来就是一片。汉字写作「鰯」——鱼字旁加一个弱，因为离水就死。',
    noteEn: 'They arrive in shoals, all at once. The character for it is fish plus weak: they die the moment they leave the water.',
    word: { jp: '鰯', reading: 'いわし', zh: '沙丁鱼', en: 'sardine' }
  },
  {
    id: 'fish_aji', nameJp: 'アジ', reading: 'あじ', nameZh: '竹荚鱼', nameEn: 'Horse Mackerel',
    rarity: 1, minCm: 12, maxCm: 30,
    spots: ['meriken_park', 'kobe_harbor', 'portliner_platform'],
    yenPerCm: 9, emoji: '🐟',
    noteZh: '关西人夏天的日常。名字据说就来自「味」——因为好吃到可以拿味道当名字。',
    noteEn: 'A Kansai summer staple. The name is said to come from the word for flavour: it tastes good enough to be named after tasting good.',
    word: { jp: '味', reading: 'あじ', zh: '味道', en: 'taste / flavour' }
  },

  // ---- rarity 2 ----
  {
    id: 'fish_saba', nameJp: 'サバ', reading: 'さば', nameZh: '鲭鱼', nameEn: 'Mackerel',
    rarity: 2, minCm: 20, maxCm: 45,
    spots: ['meriken_park', 'kobe_harbor', 'portliner_platform'],
    yenPerCm: 11, emoji: '🐟',
    noteZh: '「サバを読む」——报数字时故意少报，这句话就是从鱼贩子数鲭鱼数不清来的。',
    noteEn: 'To "count mackerel" means to fudge a number. It comes from fishmongers losing count of them.',
    word: { jp: '鯖', reading: 'さば', zh: '鲭鱼', en: 'mackerel' }
  },
  {
    id: 'fish_mebaru', nameJp: 'メバル', reading: 'めばる', nameZh: '许氏平鲉', nameEn: 'Rockfish',
    rarity: 2, minCm: 15, maxCm: 30,
    spots: ['meriken_park', 'kobe_harbor'], timeSlots: ['night'],
    yenPerCm: 14, emoji: '🐡',
    noteZh: '夜行。名字的意思是「眼睛张开」，因为那双眼睛大得离谱。',
    noteEn: 'Nocturnal. The name means "wide eyes", because the eyes are ridiculous.',
    word: { jp: '目', reading: 'め', zh: '眼睛', en: 'eye' }
  },
  {
    id: 'fish_kisu', nameJp: 'キス', reading: 'きす', nameZh: '沙鮻', nameEn: 'Japanese Whiting',
    rarity: 2, minCm: 15, maxCm: 28,
    spots: ['meriken_park', 'portliner_platform'], months: [5, 6, 7, 8, 9],
    yenPerCm: 16, emoji: '🐟',
    noteZh: '身体像玻璃一样半透明。天妇罗店里最贵的那一味常常就是它。',
    noteEn: 'Half transparent, like glass. It is often the most expensive item on a tempura counter.',
    word: { jp: '透明', reading: 'とうめい', zh: '透明', en: 'transparent' }
  },
  {
    id: 'fish_kasago', nameJp: 'カサゴ', reading: 'かさご', nameZh: '石狗公', nameEn: 'Scorpionfish',
    rarity: 2, minCm: 15, maxCm: 32,
    spots: ['kobe_harbor', 'portliner_platform'],
    yenPerCm: 15, emoji: '🐡',
    noteZh: '躲在消波块缝里不动。关西这边叫它「ガシラ」，问路的时候用这个词更像本地人。',
    noteEn: 'Sits motionless in the gaps between tetrapods. In Kansai it is called gashira, and using that word makes you sound local.',
    word: { jp: '隠れる', reading: 'かくれる', zh: '躲藏', en: 'to hide' }
  },

  // ---- rarity 3 ----
  {
    id: 'fish_suzuki', nameJp: 'スズキ', reading: 'すずき', nameZh: '日本真鲈', nameEn: 'Japanese Seabass',
    rarity: 3, minCm: 35, maxCm: 80,
    spots: ['kobe_harbor', 'portliner_platform'], timeSlots: ['night'],
    yenPerCm: 22, emoji: '🐟',
    noteZh: '出世鱼——随着长大改名字：セイゴ、フッコ、スズキ。日本人给鱼也安排了职业生涯。',
    noteEn: 'A "promotion fish": it is renamed as it grows, seigo then fukko then suzuki. Even the fish get a career ladder.',
    word: { jp: '出世', reading: 'しゅっせ', zh: '出人头地、升迁', en: 'advancement in life' }
  },
  {
    id: 'fish_chinu', nameJp: 'チヌ', reading: 'ちぬ', nameZh: '黑鲷', nameEn: 'Black Seabream',
    rarity: 3, minCm: 25, maxCm: 55,
    spots: ['meriken_park', 'kobe_harbor'],
    yenPerCm: 26, emoji: '🐟',
    noteZh: '大阪湾的代表鱼。标准语叫クロダイ，但在这一带说チヌ才对。它什么都吃，包括西瓜皮。',
    noteEn: 'The signature fish of Osaka Bay. Standard Japanese says kurodai, but around here it is chinu. It eats anything, watermelon rind included.',
    word: { jp: '鯛', reading: 'たい', zh: '鲷鱼', en: 'sea bream' }
  },
  {
    id: 'fish_anago', nameJp: 'アナゴ', reading: 'あなご', nameZh: '星鳗', nameEn: 'Conger Eel',
    rarity: 3, minCm: 30, maxCm: 70,
    spots: ['kobe_harbor'], timeSlots: ['night'],
    yenPerCm: 24, emoji: '🐍',
    noteZh: '只在夜里出来。汉字「穴子」——住在洞里的孩子。',
    noteEn: 'Comes out only at night. Written with the characters for hole and child: the one that lives in a hole.',
    word: { jp: '穴', reading: 'あな', zh: '洞', en: 'hole' }
  },
  {
    id: 'fish_kouika', nameJp: 'コウイカ', reading: 'こういか', nameZh: '乌贼', nameEn: 'Cuttlefish',
    rarity: 3, minCm: 12, maxCm: 30,
    spots: ['meriken_park', 'portliner_platform'], months: [3, 4, 5, 6],
    yenPerCm: 30, emoji: '🦑',
    noteZh: '被拉上来的瞬间会喷你一身墨。所有钓过它的人都被喷过一次，没有例外。',
    noteEn: 'Sprays ink over you the instant it clears the water. Everyone who has caught one has been inked exactly once.',
    word: { jp: '墨', reading: 'すみ', zh: '墨汁', en: 'ink' }
  },

  // ---- rarity 4 ----
  {
    id: 'fish_tachiuo', nameJp: 'タチウオ', reading: 'たちうお', nameZh: '带鱼', nameEn: 'Beltfish',
    rarity: 4, minCm: 60, maxCm: 130,
    spots: ['kobe_harbor', 'portliner_platform'], timeSlots: ['night'], months: [7, 8, 9, 10, 11],
    yenPerCm: 34, emoji: '🗡️',
    noteZh: '像一把竖着立在水里的银刀。大阪湾秋天的名物，夜里整排护岸都是来钓它的人。',
    noteEn: 'A silver blade standing upright in the water. An Osaka Bay autumn speciality; on a good night the whole quay is lined with people after it.',
    word: { jp: '太刀', reading: 'たち', zh: '日本刀', en: 'longsword' }
  },
  {
    id: 'fish_tako', nameJp: 'マダコ', reading: 'まだこ', nameZh: '真蛸', nameEn: 'Common Octopus',
    rarity: 4, minCm: 25, maxCm: 70,
    spots: ['meriken_park', 'portliner_platform'], months: [6, 7, 8, 9],
    yenPerCm: 40, emoji: '🐙',
    noteZh: '明石章鱼是全日本最有名的。海峡的潮太急，它得死死抓住岩石才不被冲走，于是腿特别有力。',
    noteEn: 'Akashi octopus is the most famous in Japan. The strait runs so hard that it must grip the rock to stay put, and the legs come out powerful.',
    word: { jp: '足', reading: 'あし', zh: '脚、腿', en: 'leg' }
  },
  {
    id: 'fish_buri', nameJp: 'ハマチ', reading: 'はまち', nameZh: '青甘鱼', nameEn: 'Young Yellowtail',
    rarity: 4, minCm: 40, maxCm: 80,
    spots: ['portliner_platform'], months: [10, 11, 12, 1],
    yenPerCm: 38, emoji: '🐟',
    noteZh: '也是出世鱼。ハマチ 长大了叫 ブリ，年底那条ブリ是关西人过年桌上的主角。',
    noteEn: 'Another promotion fish. A hamachi grown up is a buri, and the New Year buri is the centrepiece of a Kansai table.',
    word: { jp: '年末', reading: 'ねんまつ', zh: '年末', en: 'end of the year' }
  },

  // ---- rarity 5 ----
  {
    id: 'fish_madai', nameJp: 'マダイ', reading: 'まだい', nameZh: '真鲷', nameEn: 'Red Seabream',
    rarity: 5, minCm: 40, maxCm: 90,
    spots: ['portliner_platform'], months: [4, 5, 6, 10, 11],
    yenPerCm: 60, emoji: '🎏',
    noteZh: '明石鲷。急潮里练出来的一身肉，日本人办喜事必须有它——因为「めでたい」里就藏着「たい」。',
    noteEn: 'Akashi sea bream, muscled up by the fast tide. It has to appear at any Japanese celebration, because the word for auspicious hides the word for bream inside it.',
    word: { jp: 'めでたい', reading: 'めでたい', zh: '可喜可贺', en: 'auspicious / joyous' }
  },

  // ---- 杂物。钓上来会笑，不进图鉴 ----
  {
    id: 'junk_boot', nameJp: '長靴', reading: 'ながぐつ', nameZh: '一只雨靴', nameEn: 'A Rubber Boot',
    rarity: 1, minCm: 28, maxCm: 30,
    spots: ['meriken_park', 'kobe_harbor', 'portliner_platform'],
    yenPerCm: 0, emoji: '🥾', junk: true,
    noteZh: '右脚。', noteEn: 'Right foot.'
  },
  {
    id: 'junk_can', nameJp: '空き缶', reading: 'あきかん', nameZh: '空罐子', nameEn: 'An Empty Can',
    rarity: 1, minCm: 10, maxCm: 12,
    spots: ['meriken_park', 'kobe_harbor', 'portliner_platform'],
    yenPerCm: 0, emoji: '🥫', junk: true,
    noteZh: '你把它带回去扔了。', noteEn: 'You take it home and bin it.'
  },
  {
    id: 'junk_weed', nameJp: '海藻', reading: 'かいそう', nameZh: '一团海藻', nameEn: 'A Clump of Seaweed',
    rarity: 1, minCm: 20, maxCm: 40,
    spots: ['meriken_park', 'kobe_harbor', 'portliner_platform'],
    yenPerCm: 0, emoji: '🌿', junk: true,
    noteZh: '沉甸甸的，拉上来那一刻你是真以为中大鱼了。',
    noteEn: 'Heavy enough that for one moment you genuinely believed it.'
  }
];

export const findFish = (id: string) => FISH.find(f => f.id === id);
export const FISHING_SPOTS = ['meriken_park', 'kobe_harbor', 'portliner_platform'];
export const MAX_FISH_PER_DAY = 8;

// 今天、这个地点、这个时段能上什么。按稀有度加权抽。
// 竿越好，稀有鱼的权重抬得越高——但杂鱼永远抽得到，
// 不然好竿一到手，钓鱼就变成纯粹的刷分了。
export const rollFish = (
  spot: string, cal: GameCalendar, rodPower: number, hasBait: boolean
): FishDef => {
  const pool = FISH.filter(f => {
    if (!f.spots.includes(spot)) return false;
    if (f.timeSlots && !f.timeSlots.includes(cal.timeSlot as TimeSlot)) return false;
    if (f.months && !f.months.includes(cal.month)) return false;
    if (f.weather && !f.weather.includes(cal.weather)) return false;
    // 没饵只上杂鱼和 rarity 1
    if (!hasBait && !f.junk && f.rarity > 1) return false;
    // 竿撑不起太稀有的
    if (f.rarity > rodPower + 2) return false;
    return true;
  });
  const usable = pool.length ? pool : FISH.filter(f => f.junk);
  const weight = (f: FishDef) => {
    if (f.junk) return hasBait ? 6 : 26;
    // 稀有度每高一级，基础权重减半；好竿把这个惩罚补回来一部分
    return Math.max(1, 100 / Math.pow(2.4, f.rarity - 1) * (1 + 0.45 * (rodPower - 1) * (f.rarity - 1)));
  };
  const total = usable.reduce((s, f) => s + weight(f), 0);
  let r = Math.random() * total;
  for (const f of usable) { r -= weight(f); if (r <= 0) return f; }
  return usable[usable.length - 1];
};

// 尺寸偏小——大鱼要靠钓得多。三次取最小值，分布就自然偏向小的那头。
export const rollSize = (f: FishDef, rodPower: number): number => {
  const rolls = [Math.random(), Math.random(), Math.random()];
  const t = Math.min(...rolls) + (rodPower - 1) * 0.12;
  return Math.round(f.minCm + Math.min(1, t) * (f.maxCm - f.minCm));
};

export const fishValue = (f: FishDef, cm: number) => Math.round(f.yenPerCm * cm);

// 盆栽的四个阶段：0 空 / 1 刚种下 / 2 发芽 / 3 长大 / 4 可收
export const plantStage = (
  plot: { seedId: string | null; plantedOn: number | null; watered: number },
  today: number
): number => {
  if (!plot.seedId || plot.plantedOn == null) return 0;
  const seed = findSeed(plot.seedId);
  if (!seed) return 0;
  const days = today - plot.plantedOn;
  const dayRatio = days / seed.growDays;
  const waterRatio = plot.watered / seed.needWater;
  if (dayRatio >= 1 && waterRatio >= 1) return 4;
  const p = Math.min(dayRatio, waterRatio);
  if (p >= 0.6) return 3;
  if (p >= 0.25) return 2;
  return 1;
};

export const STAGE_EMOJI = ['', '🌰', '🌱', '🌿', ''];
