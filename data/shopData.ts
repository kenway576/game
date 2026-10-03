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

export type ShopKind = 'hyakkin' | 'tackle' | 'drugstore' | 'matsukiyo' | 'bookoff' | 'surugaya' | 'uniqlo';

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
        descZh: '五十毫升的深色玻璃小药瓶。入口微苦带酸，灌下去片刻便感觉整个人又原地满血复活。',
        descEn: 'Fifty millilitres in a dark brown vial. Slightly bitter and tangy; chug it down and feel your batteries instantly recharge.',
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
      },
      {
        id: 'drug_cooling_sheet', emoji: '🧊',
        nameJp: '冷却シート', reading: 'れいきゃくシート',
        nameZh: '退热贴', nameEn: 'Cooling Gel Sheets', price: 328,
        descZh: '贴在额头上，凉意一路钻进脑子里。发烧的时候用，熬夜背单词的时候其实也用。',
        descEn: 'Stick one on your forehead and the cold goes straight through to your brain. For fevers. Also, it turns out, for late-night vocabulary.',
        stamina: 15
      },
      {
        id: 'drug_kairo', emoji: '🔥',
        nameJp: '貼るカイロ', reading: 'はるカイロ',
        nameZh: '暖宝宝（粘贴式）', nameEn: 'Stick-on Hand Warmers', price: 298,
        descZh: '十枚装。撕开、摇两下、贴在衬衫里面。冬天早上的坡道从此短了一半。',
        descEn: 'A pack of ten. Tear, shake, stick inside your shirt. The hill on a winter morning is half as long.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '冬天的早上不再那么难起床了', reasonEn: 'Winter mornings are a little easier to face' }]
      },
      {
        id: 'drug_snack', emoji: '🍪',
        nameJp: 'お菓子の大袋', reading: 'おかしのおおぶくろ',
        nameZh: '零食大包装', nameEn: 'Family-size Snacks', price: 258,
        descZh: '药妆店的零食比便利店便宜三成。这是住在日本的人最先学会的生活常识之一。',
        descEn: 'Snacks are thirty per cent cheaper at the drugstore than the konbini. One of the first things anybody living here learns.',
        stamina: 10,
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你发现零食要在药妆店买', reasonEn: 'You learned to buy snacks at the drugstore' }]
      },
      {
        id: 'drug_vitamin', emoji: '💊',
        nameJp: 'ビタミンC', reading: 'ビタミンシー',
        nameZh: '维生素 C 片', nameEn: 'Vitamin C Tablets', price: 498,
        descZh: '一天两粒。效果你说不上来，但每天早上记得吃这件事本身，让你觉得生活在正轨上。',
        descEn: 'Two a day. You could not say what they do, but remembering them every morning makes it feel as though life is on track.',
        stamina: 10,
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你开始有自己的生活习惯了', reasonEn: 'You are starting to have routines of your own' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 💄 松本清（マツキヨ）
  // 同一条街上的第二家药妆店。サンドラッグ偏"身体出状况了"，
  // 这家偏"想把自己收拾得像样一点"：化妆水、发蜡、防晒、眼药水。
  // 店员七海就站在这家（地图上的介绍写的就是她）。
  // ---------------------------------------------------------
  {
    kind: 'matsukiyo',
    clerk: '/images/characters/clerk_drugstore_smile.webp',
    nameJp: 'マツモトキヨシ', reading: 'マツモトキヨシ',
    nameZh: '松本清药妆店 三宫店', nameEn: 'Matsumoto Kiyoshi Sannomiya',
    lineZh: '「ポイントカードはお持ちですか？」七海小姐问得很轻，像是不想让你因为没有卡而觉得不好意思。',
    lineEn: '"Do you have a points card?" Nanami asks it softly, as though she would rather you did not feel bad for not having one.',
    accent: 'text-yellow-300', ring: 'border-yellow-400/60',
    goods: [
      {
        id: 'mk_eyedrops', emoji: '💧',
        nameJp: '目薬（クール）', reading: 'めぐすり（クール）',
        nameZh: '清凉眼药水', nameEn: 'Cooling Eye Drops', price: 548,
        descZh: '包装上画着一个冒冷气的眼球。滴进去的那一秒你会怀疑人生，下一秒世界清晰得像刚擦过的玻璃。',
        descEn: 'The box shows an eyeball breathing frost. For one second after the drop you question your life choices; the next, the world is as clear as a freshly wiped window.',
        stamina: 15,
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '眼睛不酸了，单词又能多背一页', reasonEn: 'Eyes no longer sore; one more page of vocabulary' }]
      },
      {
        id: 'mk_lotion', emoji: '🧴',
        nameJp: '化粧水', reading: 'けしょうすい',
        nameZh: '化妆水', nameEn: 'Facial Toner', price: 880,
        descZh: '七海小姐推荐的那瓶。「男の子もみんな使ってますよ」——她说得那么自然，你就信了。',
        descEn: 'The one Nanami recommended. "All the boys use it too" — she says it so naturally that you believe her.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '洗完脸不再紧绷了', reasonEn: 'Your face no longer feels tight after washing' }]
      },
      {
        id: 'mk_sunscreen', emoji: '☀️',
        nameJp: '日焼け止め', reading: 'ひやけどめ',
        nameZh: '防晒霜', nameEn: 'Sunscreen', price: 698,
        descZh: 'SPF50+、PA++++。神户的夏天从五月就开始了，海边的太阳不讲道理。',
        descEn: 'SPF50+, PA++++. Summer in Kobe starts in May, and the sun by the sea is not reasonable.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你不再害怕大太阳天出门了', reasonEn: 'You no longer dread going out on bright days' }]
      },
      {
        id: 'mk_wax', emoji: '💇',
        nameJp: 'ヘアワックス', reading: 'ヘアワックス',
        nameZh: '发蜡', nameEn: 'Hair Wax', price: 1078,
        descZh: '你对着镜子研究了二十分钟，最后的效果和不抹差不多。但你自己知道不一样。',
        descEn: 'Twenty minutes in front of the mirror, and the result looks about the same as before. But you know it is different.',
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你开始在意自己今天看起来怎么样了', reasonEn: 'You have started caring how you look today' }],
        unique: true
      },
      {
        id: 'mk_lipbalm', emoji: '💋',
        nameJp: 'リップクリーム', reading: 'リップクリーム',
        nameZh: '润唇膏', nameEn: 'Lip Balm', price: 385,
        descZh: '门口特价筐里的。冬天的海风会把嘴唇吹裂，这是你在第一个冬天之前就该知道的事。',
        descEn: 'From the bargain basket by the door. The winter sea wind splits your lips. Something to know before your first winter here.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你开始照顾自己了', reasonEn: 'You have started looking after yourself' }]
      },
      {
        id: 'mk_bathsalt', emoji: '🛁',
        nameJp: '入浴剤', reading: 'にゅうよくざい',
        nameZh: '入浴剂（温泉之素）', nameEn: 'Onsen Bath Salts', price: 598,
        descZh: '十二包，每包一个温泉地名：有马、草津、别府……在出租屋的浴缸里环游日本。',
        descEn: 'Twelve sachets, each named after a hot spring: Arima, Kusatsu, Beppu… A tour of Japan from your rented bathtub.',
        stamina: 20,
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你记住了十二个温泉的名字', reasonEn: 'You learned the names of twelve hot springs' }]
      },
      {
        id: 'mk_shampoo', emoji: '🫧',
        nameJp: 'シャンプー詰め替え', reading: 'シャンプーつめかえ',
        nameZh: '洗发水（补充装）', nameEn: 'Shampoo Refill', price: 658,
        descZh: '日本人买洗发水买的是补充装——瓶子留着，袋子换。你第一次看见的时候以为拿错了。',
        descEn: 'People here buy refill pouches and keep the bottle. The first time you saw one you thought you had picked up the wrong thing.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你学会了日本人的「詰め替え」', reasonEn: 'You learned the art of the refill pouch' }]
      },
      {
        id: 'mk_protein', emoji: '🥤',
        nameJp: 'プロテインバー', reading: 'プロテインバー',
        nameZh: '蛋白棒', nameEn: 'Protein Bar', price: 178,
        descZh: '巧克力味。社团活动前塞一根，能撑到最后一圈。',
        descEn: 'Chocolate flavour. One before club practice gets you to the last lap.',
        stamina: 20
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
      },
      {
        id: 'bo_picturebook', emoji: '🐻',
        nameJp: '絵本', reading: 'えほん',
        nameZh: '二手绘本', nameEn: 'Used Picture Book', price: 110,
        descZh: '全是平假名，一页一句。你读得磕磕绊绊，和书里那只第一次出门的小熊差不多。',
        descEn: 'All hiragana, one sentence a page. You read it haltingly, rather like the little bear in it leaving home for the first time.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你第一次从头到尾读完了一本日文书', reasonEn: 'The first Japanese book you read cover to cover' }]
      },
      {
        id: 'bo_dvd', emoji: '📀',
        nameJp: '中古DVD', reading: 'ちゅうこディーブイディー',
        nameZh: '二手 DVD（日剧）', nameEn: 'Used DVD (TV drama)', price: 330,
        descZh: '十几年前的日剧第一卷。没有中文字幕，只有日文字幕——正好。',
        descEn: 'Volume one of a drama from a decade ago. No subtitles in your language, only Japanese ones — which is just right.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '开着日文字幕看完了两集', reasonEn: 'Two episodes with Japanese subtitles on' }]
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
      },
      {
        id: 'sg_acrylic', emoji: '🔑',
        nameJp: 'アクキー', reading: 'アクキー',
        nameZh: '亚克力钥匙扣', nameEn: 'Acrylic Keychain', price: 330,
        descZh: '盲抽的，抽到一个你不认识的角色。你决定从今天开始认识她。',
        descEn: 'A blind pull, and you got a character you do not recognise. You decide to start getting to know her today.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '书包上多了一个会晃的东西', reasonEn: 'Something on your bag now swings when you walk' }]
      },
      {
        id: 'sg_retrogame', emoji: '🕹️',
        nameJp: 'レトロゲーム', reading: 'レトロゲーム',
        nameZh: '中古游戏卡带', nameEn: 'Retro Game Cartridge', price: 980,
        descZh: '标签褪色了，上一个主人在背面用马克笔写了自己的名字。存档里还有他的记录。',
        descEn: 'The label is faded and the last owner wrote his name on the back in marker. His save file is still on it.',
        effects: [
          { stat: 'knowledge', amount: 1, reasonZh: '你读懂了游戏里的每一行对白', reasonEn: 'You understood every line of dialogue in it' },
          { stat: 'proficiency', amount: 1, reasonZh: '第一关打了十一遍', reasonEn: 'Eleven tries at the first stage' }
        ],
        unique: true
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
      },
      {
        id: 'uq_ut', emoji: '👚',
        nameJp: 'UT（コラボTシャツ）', reading: 'ユーティー',
        nameZh: '联名 UT', nameEn: 'Collab UT Tee', price: 1500,
        descZh: '印着一部老动画的那件。走在三宫的街上，有两个人回头看了一眼你的胸口，然后对你点了点头。',
        descEn: 'The one with an old anime on it. Walking through Sannomiya, two people glance at your chest and nod at you.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你在街上被同好认出来了', reasonEn: 'A fellow fan recognised you on the street' }],
        unique: true
      },
      {
        id: 'uq_airism', emoji: '🎽',
        nameJp: 'エアリズム', reading: 'エアリズム',
        nameZh: 'AIRism 速干衣', nameEn: 'AIRism Tee', price: 990,
        descZh: '和发热内衣是一对：一个对付冬天，一个对付神户七月那种湿到能拧出水的空气。',
        descEn: 'The other half of the Heattech pair: one handles winter, the other handles Kobe air in July, humid enough to wring out.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '夏天的坡道也不再可怕', reasonEn: 'The hill in summer is no longer frightening either' }],
        unique: true
      }
    ]
  }
];

// ---------------------------------------------------------
// 百元店、渔具店的"杂货"。
// 那两家的货架是手写的（花盆、种子、鱼竿跟种植/钓鱼系统绑着），
// 这里补的是摆在它们货架后面的普通生活用品，跟上面几家走同一套"买了当场生效"。
// ---------------------------------------------------------
export const EXTRA_GOODS: Partial<Record<ShopKind, ShopGood[]>> = {
  hyakkin: [
    {
      id: 'hk_flashcards', emoji: '📓',
      nameJp: '単語カード', reading: 'たんごカード',
      nameZh: '单词卡本', nameEn: 'Flashcard Ring', price: 110,
      descZh: '一个金属环串着一叠小卡片。正面写日语，背面写意思——这里的学生从初中就这么背单词。',
      descEn: 'A stack of little cards on a metal ring. Japanese on the front, meaning on the back — the way students here have revised since junior high.',
      effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你写满了第一个单词环', reasonEn: 'You filled your first flashcard ring' }]
    },
    {
      id: 'hk_slippers', emoji: '🩴',
      nameJp: 'スリッパ', reading: 'スリッパ',
      nameZh: '室内拖鞋', nameEn: 'Indoor Slippers', price: 110,
      descZh: '进门脱鞋，换拖鞋。你花了两个星期才不再穿着它走进厕所——厕所有自己的拖鞋。',
      descEn: 'Shoes off at the door, slippers on. It took you two weeks to stop wearing them into the toilet, which has its own slippers.',
      effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你搞懂了拖鞋的规矩', reasonEn: 'You have understood the rules of slippers' }],
      unique: true
    },
    {
      id: 'hk_bento_box', emoji: '🍱',
      nameJp: '弁当箱', reading: 'べんとうばこ',
      nameZh: '便当盒', nameEn: 'Bento Box', price: 330,
      descZh: '双层的，带一根绑带。买了它，"明天自己带饭"这件事就从想法变成了计划。',
      descEn: 'Two tiers and a strap. Buying it turns "bring my own lunch tomorrow" from an idea into a plan.',
      effects: [{ stat: 'kindness', amount: 1, reasonZh: '你开始照顾明天的自己', reasonEn: 'You have started looking after tomorrow\'s you' }],
      unique: true
    },
    {
      id: 'hk_furin', emoji: '🎐',
      nameJp: '風鈴', reading: 'ふうりん',
      nameZh: '风铃', nameEn: 'Wind Chime', price: 220,
      descZh: '玻璃的，挂在窗边。风一过就"叮"一声，房间里终于有了一点不是你发出来的声音。',
      descEn: 'Glass, hung by the window. Every breeze makes it ring, and the room finally has a sound in it that is not you.',
      effects: [{ stat: 'charm', amount: 1, reasonZh: '房间里多了夏天的声音', reasonEn: 'The room has a summer sound now' }],
      unique: true
    },
    {
      id: 'hk_vinyl_umbrella', emoji: '🌂',
      nameJp: 'ビニール傘', reading: 'ビニールがさ',
      nameZh: '透明塑料伞', nameEn: 'Clear Plastic Umbrella', price: 110,
      descZh: '全日本最常被"借走"的东西。你买这一把的时候，已经做好了它不会陪你太久的准备。',
      descEn: 'The most frequently "borrowed" object in Japan. You buy this one fully prepared for it not to stay with you long.',
      effects: [{ stat: 'guts', amount: 1, reasonZh: '下雨天也敢出门了', reasonEn: 'Rain no longer keeps you in' }]
    },
    {
      id: 'hk_dagashi', emoji: '🍭',
      nameJp: '駄菓子セット', reading: 'だがしセット',
      nameZh: '粗点心套装', nameEn: 'Dagashi Assortment', price: 110,
      descZh: '十种小零食塞在一个袋子里。一半你不知道是什么味道，这正是乐趣所在。',
      descEn: 'Ten little snacks in one bag. You do not know what half of them taste like, which is the fun.',
      stamina: 10
    }
  ],
  tackle: [
    {
      id: 'tk_cap', emoji: '🧢',
      nameJp: '釣り用キャップ', reading: 'つりようキャップ',
      nameZh: '钓鱼帽', nameEn: 'Fishing Cap', price: 1200,
      descZh: '帽檐下面是深绿色的，防反光。源老爹看了一眼，说了句「ええやん」。这是他今天说的最长的一句话。',
      descEn: 'The underside of the brim is dark green, against glare. Gen-san glances and says "not bad". It is the longest thing he says all day.',
      effects: [{ stat: 'guts', amount: 1, reasonZh: '在堤防上站一下午也不怕晒了', reasonEn: 'A whole afternoon on the pier no longer burns' }],
      unique: true
    },
    {
      id: 'tk_onigiri', emoji: '🍙',
      nameJp: '手作りおにぎり', reading: 'てづくりおにぎり',
      nameZh: '店里的手捏饭团', nameEn: 'Shop-made Onigiri', price: 150,
      descZh: '收银台旁边的塑料盒里，老板娘早上捏的。梅干馅，咸得恰到好处，配海风刚好。',
      descEn: 'In a plastic box by the till, made by the owner\'s wife this morning. Pickled plum, exactly salty enough for sea wind.',
      stamina: 15
    },
    {
      id: 'tk_tidetable', emoji: '📅',
      nameJp: '潮見表', reading: 'しおみひょう',
      nameZh: '潮汐表', nameEn: 'Tide Table', price: 300,
      descZh: '一整年的涨潮退潮，印在一本小册子里。你一个字一个字地查「大潮」「小潮」是什么意思。',
      descEn: 'A year of high and low tides in one little booklet. You look up "spring tide" and "neap tide" one character at a time.',
      effects: [
        { stat: 'knowledge', amount: 2, reasonZh: '你看懂了潮汐表', reasonEn: 'You can read a tide table now' },
        { stat: 'proficiency', amount: 1, reasonZh: '你开始按潮水安排出门了', reasonEn: 'You plan your trips around the tide now' }
      ],
      unique: true
    }
  ]
};

export const findShop = (kind: ShopKind) => NEW_SHOPS.find(s => s.kind === kind);
export const shopGood = (id: string) =>
  [...NEW_SHOPS.flatMap(s => s.goods), ...Object.values(EXTRA_GOODS).flatMap(g => g || [])].find(g => g.id === id);

// 地图上的地点 → 进去之后开哪家店。以前散在 App 里，一家店一个 if。
export const SHOP_AT_LOCATION: Record<string, ShopKind> = {
  hyakkin_store:       'hyakkin',
  tackle_shop:         'tackle',
  drugstore_sannomiya: 'drugstore',
  sannomiya_drugstore: 'matsukiyo',
  bookoff_sannomiya:   'bookoff',
  surugaya_sannomiya:  'surugaya',
  uniqlo_sannomiya:    'uniqlo'
};
