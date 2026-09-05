import { StreetScene } from './streetScenes';
import { STREET_NPC_SPRITES } from '../constants';

// ==========================================================
// 🚶 街上的人 · 支线
//
// 【和已有的街头小景有什么不一样】
// 街头小景是**看见**：你路过，别人在过自己的日子，你看了一眼就走。
// 这一批是**认识**：同一个人会出现三次、四次，一次比一次往前走一点，
// 最后你知道了一件他没打算告诉任何人的事。
//
// 它们仍然走 STREET_SCENES 那个池子，所以对玩家来说没有"另一套系统"——
// 只是有些人你会再遇到。往前走的机制靠 requiresFlags 串起来：
// 第二条要求第一条演过，以此类推。
//
// 【为什么是这几个人】
// 全部是日本街头真的会有的人，而且全部是**主角这一年会重复路过**的人：
//   · 高架下摆桌子占卜的姐姐——三宫最常见的那种摊子
//   · 排通宵队看地下偶像的宅男——Live House 门口每周都有
//   · 在同一家拉面店坐了三十年的大叔
//   · 拖着买菜车的婆婆——公交站永远有一个
//   · 天桥上没人停下来听的街头歌手
//   · 每天同一时间遛柴犬的人
//   · 交番里那个主要负责指路的警察
//   · 通宵班的便利店店员
//
// 【写法】
// 他们不认识主角是谁，也不关心。他们身上发生的事跟主角没关系——
// 主角只是碰巧在场，碰巧看了三次。
// 这就是"生活气"的全部：世界不为你转，但你在里面。
// ==========================================================

const P = STREET_NPC_SPRITES;

const seen = (zh: string, en: string) => ({
  type: 'effect' as const,
  effects: [{ stat: 'knowledge' as const, amount: 1, reasonZh: zh, reasonEn: en }]
});

export const STREET_PEOPLE: StreetScene[] = [
  // ---------------------------------------------------------
  // 🔮 高架下占卜的姐姐 · 三条
  // ---------------------------------------------------------
  {
    id: 'sp_uranai_1', locationIds: ['sannomiya_arcade', 'ikuta_road', 'pia_kobe_arcade'],
    weight: 6, minDay: 18, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: P.uranai,
        zh: '高架下摆着一张折叠桌，桌上一块紫布，布上一副牌。桌子后面坐着一个人，正在给自己剥橘子。',
        en: 'A folding table under the viaduct, a square of purple cloth on it, a deck on the cloth. Behind it somebody is peeling a satsuma for herself.'
      },
      {
        type: 'narration',
        zh: '牌摊在那儿没动。她抬头看了你一眼，把橘子皮拢成一小堆，说：「今日は見なくていい顔しとるわ。」',
        en: 'The cards do not move. She looks up, gathers the peel into a small heap, and says you have the face of somebody who does not need reading today.'
      },
      {
        type: 'narration',
        zh: '你说你没打算算。她说她知道，然后低头继续剥。',
        en: 'You say you were not going to. She says she knows, and goes back to peeling.'
      },
      seen('高架下有一张桌子，桌子后面有一个人', 'There is a table under the viaduct and a person behind it')
    ]
  },
  {
    id: 'sp_uranai_2', locationIds: ['sannomiya_arcade', 'ikuta_road', 'pia_kobe_arcade'],
    weight: 6, minDay: 90, requiresFlags: ['sp_uranai_1'], timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: P.uranai,
        zh: '还是那张桌子。今天前面坐着一个女生，背对着你，肩膀在抖。占卜的人一句话也没说，只是把纸巾盒往前推了推。',
        en: 'The same table. Today there is a girl in the chair with her back to you and her shoulders going. The fortune-teller says nothing at all, and pushes the tissue box forward.'
      },
      {
        type: 'narration',
        zh: '你在十米外站了一会儿就走了。第二天再路过的时候，桌上多了一盒新的纸巾。',
        en: 'You stand ten metres off for a moment and move on. Passing again the next day, there is a fresh box on the table.'
      },
      {
        type: 'narration', characterImage: P.uranai,
        zh: '「よう見とるなあ、あんた。」她说。「見とるだけの人間、わりと珍しいで。」',
        en: '"You do watch, don\'t you," she says. "People who only watch are fairly rare."'
      },
      seen('她记得你，虽然你什么都没问过', 'She remembers you, and you have never asked her anything')
    ]
  },
  {
    id: 'sp_uranai_3', locationIds: ['sannomiya_arcade', 'ikuta_road'],
    weight: 7, minDay: 230, requiresFlags: ['sp_uranai_2'], timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: P.uranai,
        zh: '这次她主动叫住你，指了指对面那张空椅子。你坐下了。她没有摊牌，只是把整副牌推到你面前。',
        en: 'This time she calls you over and points at the empty chair. You sit. She does not lay anything out; she pushes the whole deck across to you.'
      },
      {
        type: 'narration',
        zh: '「一枚。」她说。你抽了一张，翻过来，是一张画着船的牌。',
        en: '"One." You take one and turn it over. There is a ship on it.'
      },
      {
        type: 'narration', characterImage: P.uranai,
        zh: '「船な。」她看了两秒，把牌收回去了。「意味は言わへん。言うたら、あんたそれに合わせてまうやろ。」',
        en: '"A ship." She looks at it for two seconds and takes it back. "I am not telling you what it means. If I did, you would go and live up to it."'
      },
      {
        type: 'narration',
        zh: '你问她收多少钱。她说今天不收，因为你抽的那张她自己也想不明白。',
        en: 'You ask what you owe her. Nothing today, she says, because she cannot make sense of that one either.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '有人拒绝告诉你答案，这也是一种回答', reasonEn: 'Somebody refused to tell you the answer, which is also an answer' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🎤 地下偶像宅 · 三条
  // ---------------------------------------------------------
  {
    id: 'sp_otaku_1', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade', 'motomachi_arcade'],
    weight: 6, minDay: 25, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '有个人靠在墙上，从中午就站在那儿了——你下午路过一次，晚上又路过一次，位置没变。',
        en: 'Somebody is against the wall, and has been since midday: you went past once in the afternoon and again in the evening, and he has not moved.'
      },
      {
        type: 'narration',
        zh: '他手里捏着一张票，塑料文件夹夹着，边角一点折痕都没有。',
        en: 'He is holding a ticket in a clear plastic file. Not one corner of it is bent.'
      },
      {
        type: 'narration',
        zh: '门开的时候他是第三个进去的。你看了一眼海报：五个人的团，名字你没听过，最小的一个写着十六岁。',
        en: 'When the doors open he goes in third. You look at the poster: a group of five, a name you have never heard, the youngest of them listed as sixteen.'
      },
      seen('这条街上有一间你从来没注意过的 Live House', 'There is a live house on this street you had never noticed')
    ]
  },
  {
    id: 'sp_otaku_2', locationIds: ['pia_kobe_arcade', 'convenience_store', 'sannomiya_arcade'],
    weight: 6, minDay: 110, requiresFlags: ['sp_otaku_1'], timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '便利店里那个人你认得——排队那位。他在关东煮柜台前面站了很久，最后只买了一瓶水。',
        en: 'You recognise the man in the convenience store: the one from the queue. He stands at the oden counter for a long time and buys a bottle of water.'
      },
      {
        type: 'narration',
        zh: '结账的时候他跟店员说了一句什么，店员愣了一下，然后说「そうなんですか」。',
        en: 'He says something to the clerk at the till. The clerk blinks and says: is that so.'
      },
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '出门的时候他和你对上了眼。他大概是想解释，最后说的是：「今日、解散やってん。」',
        en: 'On the way out he catches your eye. He seems to want to explain something. What he says is: they disbanded today.'
      },
      {
        type: 'narration',
        zh: '他说完就走了。你站在自动门那儿，想起海报上那个十六岁。',
        en: 'And then he goes. You stand in the doorway thinking about the sixteen-year-old on the poster.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '他跟一个陌生人说了这件事，因为得跟谁说', reasonEn: 'He told a stranger, because it had to be told to somebody' }]
      }
    ]
  },
  {
    id: 'sp_otaku_3', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade'],
    weight: 6, minDay: 260, requiresFlags: ['sp_otaku_2'], timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '同一面墙，同一个人，同一个姿势。手里那个塑料文件夹也是同一个。',
        en: 'The same wall, the same man, the same posture. The same plastic file, too.'
      },
      {
        type: 'narration',
        zh: '你瞄了一眼票面。团名不一样了，五个人变成三个人。他注意到你在看。',
        en: 'You glance at the ticket. Different name. Three of them instead of five. He notices you looking.'
      },
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '「二人、また始めてん。」他说这句话的时候有点不好意思，「まあ、行かなあかんやろ。」',
        en: '"Two of them started again," he says, a little embarrassed about it. "Well. Somebody has to go, haven\'t they."'
      },
      {
        type: 'effect',
        effects: [{ stat: 'guts', amount: 3, reasonZh: '他又从头排了一次队', reasonEn: 'He queued from the beginning all over again' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🍜 三十年的拉面大叔 · 两条
  // ---------------------------------------------------------
  {
    id: 'sp_ramen_1', locationIds: ['ramen_shop_interior', 'ramen_rekishi'],
    weight: 7, minDay: 14,
    script: [
      {
        type: 'narration', characterImage: P.ramen_oyaji,
        zh: '你旁边那个位子上坐着一个大叔。他没有点单，老板直接给他上了。',
        en: 'There is a man on the stool beside you. He does not order. It arrives anyway.'
      },
      {
        type: 'narration',
        zh: '他吃得很快，八分钟见底。放下碗之后他没走，坐在那儿把汤喝完了，一口一口地喝。',
        en: 'He eats fast: eight minutes to the bottom. He does not leave when he puts the bowl down. He sits and finishes the broth, mouthful by mouthful.'
      },
      seen('有一种人的碗是不用点的', 'There is a kind of customer whose bowl does not need ordering')
    ]
  },
  {
    id: 'sp_ramen_2', locationIds: ['ramen_shop_interior', 'ramen_rekishi'],
    weight: 7, minDay: 130, requiresFlags: ['sp_ramen_1'],
    script: [
      {
        type: 'narration', characterImage: P.ramen_oyaji,
        zh: '还是他。今天他看见你在犹豫加不加葱，隔着两个位子说了一句：「ここのは、入れんでええ。」',
        en: 'Him again. Today he sees you hesitating over the spring onion and says, from two stools away: not at this place, you don\'t.'
      },
      {
        type: 'narration',
        zh: '你照做了。确实不用。',
        en: 'You do as told. He is right.'
      },
      {
        type: 'narration',
        zh: '他说他从二十六岁开始在这儿吃，中间搬过两次家，两次都搬回了这附近。老板在铁板后面听着，没接话。',
        en: 'He says he has eaten here since he was twenty-six. He has moved house twice and both times ended up back near here. The owner listens from behind the counter and does not join in.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '一碗面能把一个人留在半径三百米里三十年', reasonEn: 'A bowl of noodles has held a man inside three hundred metres for thirty years' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🛒 公交站的婆婆 · 两条
  // ---------------------------------------------------------
  {
    id: 'sp_obaa_1', locationIds: ['kitano_slope', 'motomachi_arcade', 'ikuta_road'],
    weight: 7, minDay: 10,
    script: [
      {
        type: 'narration', characterImage: P.bus_obaa,
        zh: '公交站牌下面站着一位婆婆，一只手扶着买菜的小推车。你只是站在旁边等，她就开始说话了。',
        en: 'An old woman at the bus stop with one hand on a shopping trolley. You are merely standing near her, and she starts talking.'
      },
      {
        type: 'narration',
        zh: '她说了这条线路以前不是这么走的、旁边那栋楼以前是澡堂、还有你这个年纪的孩子应该多吃鱼。',
        en: 'This route did not used to go this way; the building over there used to be a bathhouse; and a boy your age should eat more fish.'
      },
      {
        type: 'narration',
        zh: '车来了。她上车之前回头说了一句「気ぃつけてな」，说的是你。',
        en: 'The bus comes. Before she gets on she turns and tells you to take care. She means you.'
      },
      seen('你被一个不认识的人叮嘱了一句', 'Somebody who does not know you told you to take care')
    ]
  },
  {
    id: 'sp_obaa_2', locationIds: ['kitano_slope', 'motomachi_arcade'],
    weight: 7, minDay: 160, requiresFlags: ['sp_obaa_1'],
    script: [
      {
        type: 'narration', characterImage: P.bus_obaa,
        zh: '又是她。这次她认出你了——「あ、魚食べてる子や」。你不知道该怎么回答这句话。',
        en: 'Her again. This time she recognises you: ah, the fish boy. You do not know what to do with that.'
      },
      {
        type: 'narration',
        zh: '推车里今天有一把葱，露在外面。她说买多了，问你要不要。',
        en: 'There is spring onion sticking out of the trolley today. She bought too much, she says, and asks if you want it.'
      },
      {
        type: 'narration',
        zh: '你没好意思要。她把葱塞进你怀里，上车走了。整条坡道你都拿着那把葱。',
        en: 'You are too embarrassed to accept. She puts it into your arms, gets on the bus and goes. You carry it the whole way up the hill.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你抱着一把不是自己买的葱上了坡', reasonEn: 'You carried up the hill an onion you had not bought' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🎸 天桥上的街头歌手 · 两条
  // ---------------------------------------------------------
  {
    id: 'sp_busker_1', locationIds: ['sannomiya_station', 'sannomiya_arcade', 'meriken_park'],
    weight: 6, minDay: 30, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: P.busker,
        zh: '天桥中段有人在唱歌。琴箱开着，里面有三枚硬币，其中一枚是他自己放的——所有人都这么干。',
        en: 'Somebody is singing halfway along the pedestrian deck. The case is open with three coins in it, one of which he put there himself. Everybody does.'
      },
      {
        type: 'narration',
        zh: '你站着听完了一首。他唱完抬头，发现只有你一个人还站着，愣了一下才说谢谢。',
        en: 'You stand and listen to one all the way through. He looks up at the end, finds that you are the only one still standing there, and takes a moment before saying thank you.'
      },
      seen('你是那一首歌唯一的听众', 'You were the entire audience for that song')
    ]
  },
  {
    id: 'sp_busker_2', locationIds: ['sannomiya_station', 'sannomiya_arcade'],
    weight: 6, minDay: 190, requiresFlags: ['sp_busker_1'], timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: P.busker,
        zh: '同一个位置，同一把琴。今天围了七八个人。',
        en: 'Same spot, same guitar. Seven or eight people around him tonight.'
      },
      {
        type: 'narration',
        zh: '唱到一半他看见了你。他没停，但那一句唱得比前面几句都稳。',
        en: 'Halfway through a song he sees you. He does not stop, but that line comes out steadier than the ones before it.'
      },
      {
        type: 'narration', characterImage: P.busker,
        zh: '散场之后他隔着人群朝你举了一下手，就一下。你也举了一下。',
        en: 'When it breaks up he lifts a hand at you across the crowd. Once. You lift yours.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '半年前只有你站着听', reasonEn: 'Six months ago you were the only one standing there' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🐕 每天同一时间遛狗的人 · 两条
  // ---------------------------------------------------------
  {
    id: 'sp_dog_1', locationIds: ['meriken_park', 'kobe_harbor', 'suma_beach'],
    weight: 7, minDay: 20, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: P.dog_walker,
        zh: '一个人牵着一条柴犬从你旁边过去。狗在第三根栏杆那儿停下来闻了很久，牵狗的人就站在那儿等，一点也不急。',
        en: 'Somebody goes past with a shiba. The dog stops at the third railing post and takes a long time over it. The person just stands and waits, in no hurry at all.'
      },
      {
        type: 'narration',
        zh: '你后来发现这件事每天都在同一个时间发生。你调整过一次自己出门的时间，就为了确认这一点。',
        en: 'You work out later that this happens at the same time every day. You once adjusted when you went out, purely to confirm it.'
      },
      seen('这座城市有它自己的时刻表', 'This city runs to a timetable of its own')
    ]
  },
  {
    id: 'sp_dog_2', locationIds: ['meriken_park', 'kobe_harbor'],
    weight: 7, minDay: 150, requiresFlags: ['sp_dog_1'], timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: '今天那条狗先看见了你，朝你这边扯了一下绳。',
        en: 'Today the dog sees you first and pulls the lead your way.'
      },
      {
        type: 'narration', characterImage: P.dog_walker,
        zh: '「あれ、いつもの子や」牵狗的人说。她说的是狗认得你，不是她。',
        en: '"Oh, it\'s the usual one," the woman says. She means the dog knows you, not her.'
      },
      {
        type: 'narration',
        zh: '她让你摸了。柴犬的毛比看上去硬。摸完它就走了，一点留恋都没有。',
        en: 'She lets you. Shiba fur is coarser than it looks. Having been stroked, the dog leaves without the slightest sentiment.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '一条狗把你归进了"每天都在的东西"里', reasonEn: 'A dog has filed you under things that are always there' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 👮 交番的警察 · 两条
  // ---------------------------------------------------------
  {
    id: 'sp_koban_1', locationIds: ['sannomiya_station', 'ikuta_road', 'motomachi_arcade'],
    weight: 6, minDay: 8,
    script: [
      {
        type: 'narration', characterImage: P.koban,
        zh: '交番门口那个警察正在给一对游客指路，指了大概三分钟，最后把自己那张地图撕下来给了他们。',
        en: 'The officer outside the koban is giving directions to a couple of tourists. It takes about three minutes and ends with him tearing his own map off the pad and handing it over.'
      },
      {
        type: 'narration',
        zh: '你路过的时候他朝你点了点头。你后来才知道，他对每一个路过的人都点头。',
        en: 'He nods at you as you pass. You find out later that he nods at everybody who passes.'
      },
      seen('这一带有一个交番，门口那个人会点头', 'There is a koban here, and the man outside it nods')
    ]
  },
  {
    id: 'sp_koban_2', locationIds: ['sannomiya_station', 'ikuta_road'],
    weight: 6, minDay: 170, requiresFlags: ['sp_koban_1'], timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: P.koban,
        zh: '你在站前迷了一次路——不是不认识，是出错了口。他从交番里出来，还没等你开口就说了方向。',
        en: 'You get lost outside the station. Not lost exactly; you came out of the wrong exit. He steps out of the koban and gives you the direction before you have said anything.'
      },
      {
        type: 'narration',
        zh: '你问他怎么知道你要去哪儿。他说这个点从这个口出来、往这边看的人，十个有九个是要去坡上。',
        en: 'You ask how he knew. He says that at this hour, nine out of ten people who come out of that exit and look this way are heading up the hill.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '有人光看你站的方向就知道你要回哪儿', reasonEn: 'Somebody can tell where you live from which way you are facing' }]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🌙 通宵班的便利店店员 · 两条
  // ---------------------------------------------------------
  {
    id: 'sp_night_clerk_1', locationIds: ['convenience_store'],
    weight: 5, minDay: 40, timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: P.conbini_night,
        zh: '夜里的便利店换了人。这个店员头发是漂过的，正拿着一个平板在数货架，数到一半打了个哈欠，很大的一个。',
        en: 'The night shift is a different person. This one has bleached hair and is counting the shelves with a tablet. Halfway through he yawns, enormously.'
      },
      {
        type: 'narration',
        zh: '他看见你，把哈欠收了一半，说了句「いらっしゃいませ」。收得不太成功。',
        en: 'He sees you, gets about half the yawn back in, and says welcome. It is not entirely successful.'
      },
      seen('白天那个人和晚上这个人，是两家店', 'The daytime one and this one are two different shops')
    ]
  },
  {
    id: 'sp_night_clerk_2', locationIds: ['convenience_store'],
    weight: 5, minDay: 200, requiresFlags: ['sp_night_clerk_1'], timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: P.conbini_night,
        zh: '两点半。店里只有你和他。你在杂志架前面站了很久，他也没有过来。',
        en: 'Half two. Just the two of you in the shop. You stand at the magazine rack for a long time and he does not come over.'
      },
      {
        type: 'narration', characterImage: P.conbini_night,
        zh: '结账的时候他说：「あんた、たまに来るよな。この時間に。」你说睡不着。他说「わかる」，然后把找零递过来。',
        en: 'At the till he says: you come in sometimes, at this hour. You say you cannot sleep. He says he knows the feeling, and hands over your change.'
      },
      {
        type: 'narration',
        zh: '「わかる」这两个字他说得非常自然，自然到你走出去以后才反应过来：他每天这个点都醒着。',
        en: 'He says he knows the feeling so easily that it is only outside that it lands: he is awake at this hour every single day.'
      },
      {
        type: 'effect',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '深夜的城市里有一小群互相不认识的人醒着', reasonEn: 'A small number of people who do not know each other are awake in this city at night' }]
      }
    ]
  }
];
