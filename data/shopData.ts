import { StoryEffect } from '../types';

// ==========================================================
// 🛍️ 三宫中心街的四家店
//
// 百元店和渔具店是"为了别的系统服务"的店：卖种子和鱼竿，
// 买了是为了去种、去钓。这四家不一样——它们卖的是**生活本身**：
// 药妆店卖你熬夜之后需要的东西，Book Off 卖你打发时间的东西，
// 駿河屋卖你其实不需要但看见就走不动的东西，优衣库卖你冬天要穿的东西。
//
// 【为什么这些东西要有实际效果】
// 如果买了只是背包里多一行字，那这四家店就是四个橱窗。
// 所以每一样都真的动数值：营养饮料回体力，二手漫画给魅力，
// 扭蛋是随机的（这是扭蛋的全部意义），发热内衣让冬天出门不那么费劲。
//
// 【价钱是真的】
// 营养饮料 198、二手漫画 110、扭蛋 400、优衣库的发热内衣 1500。
// 这些数字在日本是对的，而且和主角一天的预算（一千出头）放在一起
// 才有意义：买一个扭蛋，今天的晚饭就得便宜一点。
// ==========================================================

export type ShopKind = 'hyakkin' | 'tackle' | 'drugstore' | 'bookoff' | 'surugaya' | 'uniqlo';

export interface ShopGood {
  id: string;
  emoji: string;
  nameJp: string; reading: string;
  nameZh: string; nameEn: string;
  price: number;
  descZh: string; descEn: string;
  // 买下来当场发生的事。不写就只是进背包。
  effects?: StoryEffect[];
  // 立刻回体力（营养饮料那一类）
  stamina?: number;
  // 一次只能有一个（发热内衣不需要第二件）
  unique?: boolean;
}

export interface ShopDef {
  kind: ShopKind;
  clerk: string;
  nameJp: string; reading: string;
  nameZh: string; nameEn: string;
  lineZh: string; lineEn: string;
  accent: string; ring: string;
  goods: ShopGood[];
}

export const NEW_SHOPS: ShopDef[] = [
  // ---------------------------------------------------------
  // 💊 药妆店
  // ---------------------------------------------------------
  {
    kind: 'drugstore',
    clerk: '/images/characters/clerk_drugstore_welcome.webp',
    nameJp: 'ドラッグストア', reading: 'ドラッグストア',
    nameZh: '药妆店 サンドラッグ 三宫中心街店', nameEn: 'Sun Drug Sannomiya',
    lineZh: '门口那台机器一直在循环播放同一段广告，音量刚好大到让人记住旋律，记不住产品。',
    lineEn: 'The machine by the door loops the same advert, at exactly the volume that makes you remember the jingle and not the product.',
    accent: 'text-emerald-400', ring: 'border-emerald-500/60',
    goods: [
      {
        id: 'drug_energy', emoji: '🧪',
        nameJp: '栄養ドリンク', reading: 'えいようドリンク',
        nameZh: '营养饮料', nameEn: 'Energy Tonic', price: 198,
        descZh: '五十毫升的小棕瓶。味道像药，喝完二十分钟内你会觉得自己是对的。',
        descEn: 'Fifty millilitres in a small brown bottle. Tastes medicinal. For twenty minutes afterwards you feel you were right about everything.',
        stamina: 30
      },
      {
        id: 'drug_nodoame', emoji: '🍬',
        nameJp: 'のど飴', reading: 'のどあめ',
        nameZh: '润喉糖', nameEn: 'Throat Sweets', price: 250,
        descZh: '一整袋。你会在教室里分掉一半，然后发现这是这个国家最好用的社交货币。',
        descEn: 'A whole bag. You will give half of it away in the classroom and discover it is the most effective social currency in this country.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '分东西的人总是不缺同伴', reasonEn: 'People who hand things out do not lack for company' }]
      },
      {
        id: 'drug_mask', emoji: '😷',
        nameJp: 'マスク', reading: 'マスク',
        nameZh: '口罩（七枚装）', nameEn: 'Face Masks (7)', price: 398,
        descZh: '在这儿它不只是防病的。它也是"今天我不想被搭话"的意思，而且所有人都懂。',
        descEn: 'Here it is not only for illness. It also means "I would rather not be spoken to today", and everybody understands that.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你学会了一种不用开口的拒绝', reasonEn: 'You have learned a refusal that does not require speaking' }]
      },
      {
        id: 'drug_bandaid', emoji: '🩹',
        nameJp: '絆創膏', reading: 'ばんそうこう',
        nameZh: '创可贴', nameEn: 'Plasters', price: 168,
        descZh: '你手上的这个口子是削苹果削的。你不打算跟任何人解释这件事。',
        descEn: 'The cut on your hand is from peeling an apple. You do not intend to explain that to anybody.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你多买了一盒，放在书包里', reasonEn: 'You bought a second box and put it in your bag' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 📚 Book Off
  // ---------------------------------------------------------
  {
    kind: 'bookoff',
    clerk: '/images/characters/clerk_bookoff.webp',
    nameJp: 'ブックオフ', reading: 'ブックオフ',
    nameZh: 'Book Off 三宫中心街店', nameEn: 'Book Off Sannomiya',
    lineZh: '「いらっしゃいませー」是喊出来的，从店里三个不同的方向同时喊，而且没有一个人抬头。',
    lineEn: 'The welcome is shouted, from three different directions in the shop at once, and not one of them looks up.',
    accent: 'text-amber-400', ring: 'border-amber-500/60',
    goods: [
      {
        id: 'bo_manga', emoji: '📕',
        nameJp: '中古コミック', reading: 'ちゅうこコミック',
        nameZh: '二手漫画（一百一十円架）', nameEn: 'Used Manga (110-yen shelf)', price: 110,
        descZh: '一百一十円那一排。你看不懂全部，但你看得懂图，而看得懂图就够开始了。',
        descEn: 'From the hundred-and-ten-yen rack. You cannot read all of it. You can read the pictures, and the pictures are enough to start with.',
        effects: [
          { stat: 'knowledge', amount: 2, reasonZh: '你查了七个词才看完第一话', reasonEn: 'You looked up seven words to get through chapter one' }
        ]
      },
      {
        id: 'bo_bunko', emoji: '📖',
        nameJp: '文庫本', reading: 'ぶんこぼん',
        nameZh: '文库本小说', nameEn: 'Bunko Paperback', price: 220,
        descZh: '巴掌大，能塞进制服口袋。前主人在第四十七页折了一个角，你没有把它抚平。',
        descEn: 'Palm-sized, fits a uniform pocket. The previous owner turned down the corner of page forty-seven. You have not flattened it.',
        effects: [
          { stat: 'knowledge', amount: 3, reasonZh: '一页读三遍，第三遍开始有意思了', reasonEn: 'Three times through each page; on the third it starts being interesting' }
        ]
      },
      {
        id: 'bo_cd', emoji: '💿',
        nameJp: '中古CD', reading: 'ちゅうこシーディー',
        nameZh: '二手 CD', nameEn: 'Used CD', price: 280,
        descZh: '封面上的乐队你没听过。歌词本还在里面，上一个人用铅笔在某一句旁边画了线。',
        descEn: 'A band you have never heard of. The lyric booklet is still inside and somebody has pencilled a line beside one of the verses.',
        effects: [
          { stat: 'charm', amount: 2, reasonZh: '你现在有一首别人不知道的歌', reasonEn: 'You now have a song nobody else has' }
        ]
      },
      {
        id: 'bo_guide', emoji: '📗',
        nameJp: '攻略本', reading: 'こうりゃくぼん',
        nameZh: '游戏攻略本', nameEn: 'Strategy Guide', price: 550,
        descZh: '一本二〇〇八年的攻略本，讲的游戏你没玩过，主机也早停产了。你还是买了。',
        descEn: 'A strategy guide from 2008, for a game you have not played, on a console long discontinued. You buy it anyway.',
        effects: [
          { stat: 'knowledge', amount: 2, reasonZh: '你把整本的假名都读下来了', reasonEn: 'You read every kana in it' },
          { stat: 'guts', amount: 1, reasonZh: '为一本用不上的书付了五百五十円', reasonEn: 'Five hundred and fifty yen for a book of no use to you' }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🎮 駿河屋
  // ---------------------------------------------------------
  {
    kind: 'surugaya',
    clerk: '/images/characters/clerk_surugaya.webp',
    nameJp: '駿河屋', reading: 'するがや',
    nameZh: '駿河屋 神户三宫店', nameEn: 'Surugaya Kobe Sannomiya',
    lineZh: '一整面墙的扭蛋机，从门口排到里面。你在第三台前面站住了，不是因为想要，是因为那个转盘的手感。',
    lineEn: 'A whole wall of gacha machines from the door inwards. You stop at the third one, not because you want what is in it, but because of how the handle turns.',
    accent: 'text-fuchsia-400', ring: 'border-fuchsia-500/60',
    goods: [
      {
        id: 'sg_gacha', emoji: '🥚',
        nameJp: 'ガチャ一回', reading: 'ガチャいっかい',
        nameZh: '扭蛋（一次）', nameEn: 'One Gacha Turn', price: 400,
        descZh: '你知道概率。你也知道自己在干什么。这两件事从来没有阻止过任何人。',
        descEn: 'You know the odds. You also know what you are doing. Neither of those has ever stopped anybody.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '你知道概率，还是转了', reasonEn: 'You knew the odds and turned it anyway' },
          { stat: 'charm', amount: 1, reasonZh: '转把手的时候你确实屏住了呼吸', reasonEn: 'You did actually hold your breath turning the handle' }
        ]
      },
      {
        id: 'sg_figure', emoji: '🗿',
        nameJp: '中古フィギュア', reading: 'ちゅうこフィギュア',
        nameZh: '二手手办', nameEn: 'Used Figure', price: 2800,
        descZh: '盒子有压痕，标价便宜了四成。你把它摆在书桌上，正对着外公的手账。',
        descEn: 'The box is dented so it is forty per cent off. You put it on the desk, facing your grandfather\'s journal.',
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '房间里第一件不是必需品的东西', reasonEn: 'The first thing in that room that is not a necessity' }
        ],
        unique: true
      },
      {
        id: 'sg_cardpack', emoji: '🃏',
        nameJp: 'トレカ 1パック', reading: 'トレカ ワンパック',
        nameZh: '卡包（一包）', nameEn: 'Card Pack', price: 165,
        descZh: '拆开的手法你在另一个国家就练熟了。这件事在这里居然通用。',
        descEn: 'You perfected the way you open these in another country. It turns out to transfer.',
        effects: [
          { stat: 'proficiency', amount: 1, reasonZh: '拇指推、不撕封口，一气呵成', reasonEn: 'Thumb under, seal intact, one motion' },
          { stat: 'charm', amount: 1, reasonZh: '这一包里有一张闪的', reasonEn: 'There was a foil in this one' }
        ]
      },
      {
        id: 'sg_doujin', emoji: '📔',
        nameJp: '同人誌', reading: 'どうじんし',
        nameZh: '同人志', nameEn: 'Doujinshi', price: 700,
        descZh: '你在架子前面站了很久，最后拿的是一本讲铁道的。真的是讲铁道的。',
        descEn: 'You stand at the shelf for a long time and what you take is one about railways. It genuinely is about railways.',
        effects: [
          { stat: 'knowledge', amount: 2, reasonZh: '一个人把一条支线的全部车站画了一遍', reasonEn: 'Somebody drew every station on one branch line' }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 👕 优衣库
  // ---------------------------------------------------------
  {
    kind: 'uniqlo',
    clerk: '/images/characters/clerk_uniqlo.webp',
    nameJp: 'ユニクロ', reading: 'ユニクロ',
    nameZh: '优衣库 三宫中心街店', nameEn: 'UNIQLO Sannomiya',
    lineZh: '所有东西都叠得一模一样。你抽走一件之后那一摞塌了一角，两分钟后有人过来把它叠了回去。',
    lineEn: 'Everything is folded identically. You pull one out and the stack loses a corner; two minutes later somebody has come and put it back.',
    accent: 'text-red-400', ring: 'border-red-500/60',
    goods: [
      {
        id: 'uq_heattech', emoji: '🧥',
        nameJp: 'ヒートテック', reading: 'ヒートテック',
        nameZh: '发热内衣', nameEn: 'Heattech Base Layer', price: 1500,
        descZh: '神户的冬天从十二月开始认真起来。买了它之后，冬天出门这件事会便宜一点。',
        descEn: 'Kobe gets serious about winter in December. With this on, going out in it costs you less.',
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '冬天的坡道不再是一个需要下决心的东西', reasonEn: 'The hill in winter is no longer something that requires a decision' }
        ],
        unique: true
      },
      {
        id: 'uq_socks', emoji: '🧦',
        nameJp: '靴下 三足', reading: 'くつした さんぞく',
        nameZh: '袜子（三双）', nameEn: 'Socks (3 pairs)', price: 990,
        descZh: '你带来的那几双开始破了。这是你在这个国家买的第一件真正的日用品。',
        descEn: 'The ones you brought are going at the heel. This is the first genuinely everyday thing you have bought in this country.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '你开始为将来的自己买东西了', reasonEn: 'You have started buying things for a future version of yourself' }
        ]
      },
      {
        id: 'uq_roomwear', emoji: '👕',
        nameJp: '部屋着', reading: 'へやぎ',
        nameZh: '家居服', nameEn: 'Loungewear', price: 1990,
        descZh: '在这之前你在家里穿的是校服的裤子。换掉之后，那个房间才开始像个住的地方。',
        descEn: 'Until now you have been wearing your school trousers indoors. Once you stop, the room starts to be somewhere you live.',
        effects: [
          { stat: 'charm', amount: 2, reasonZh: '房间和学校终于是两个地方了', reasonEn: 'The room and the school are finally two different places' }
        ],
        unique: true
      },
      {
        id: 'uq_umbrella', emoji: '☂️',
        nameJp: '折りたたみ傘', reading: 'おりたたみがさ',
        nameZh: '折叠伞', nameEn: 'Folding Umbrella', price: 1290,
        descZh: '你已经在便利店买过三把透明伞了，三把都不知道丢在哪儿。这一把有颜色。',
        descEn: 'You have bought three clear plastic ones at the convenience store and lost all three. This one has a colour.',
        effects: [
          { stat: 'proficiency', amount: 1, reasonZh: '你终于承认这座城市会下雨', reasonEn: 'You have finally conceded that it rains in this city' }
        ],
        unique: true
      }
    ]
  }
];

export const findShop = (kind: ShopKind) => NEW_SHOPS.find(s => s.kind === kind);
export const shopGood = (id: string) => NEW_SHOPS.flatMap(s => s.goods).find(g => g.id === id);
