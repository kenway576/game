import { MapLocation, CharacterId } from '../types';

// ---------------------------------------------------------
// 🗺️ 能去的地方
//
// 图全部复用 SCENE_MAP 里已经有的背景，一张新图都不生成。
// id 就是 SCENE_MAP 的 key。
//
// 【解锁链】刻意做成一条能自己往前滚的链，而不是全押在"第几章"上：
//
//   开局                  学校核心 + 北野（家附近）
//   day1_done             三宫一带（第 1 章过完你才知道山下有什么）
//   ev_sannomiya_first → map_harbor   第一次走到三宫站，看见了往海边去的轻轨
//   ev_portliner_first → map_far      第一次坐上轻轨，才敢往市外跑
//   ev_slope_nao       → 西村珈琲     奈绪把你带进去的那家店
//
// 也就是说：地图变大靠的是"你真的去过了"，不是靠日期到了。
//
// 【营业时间】每个地方都写死了 timeSlots，按现实里的作息来：
//   学校放学锁门 → 午后能进，夜里不能
//   咖啡店、神社、沙滩、钓场 → 天黑前收
//   商店街、高架下、港湾、泡汤 → 晚上才是正场
//   车站、便利店、自己住的地方 → 全天
// 放学后只有两格（午后、夜里），午后用掉一格之后再打开地图，
// 一半的地方是灰的——这就是"今天先去哪儿"要花心思的原因。
// 远门（有马、京都）午后不动身就赶不上，所以只挂在午后那一格。
// ---------------------------------------------------------

export const MAP_LOCATIONS: MapLocation[] = [
  // ======================= 学校 =======================
  {
    id: 'classroom_morning', district: 'school',
    nameJp: '一年A組 教室', reading: 'いちねんエーぐみ きょうしつ',
    nameZh: '1年A班 教室', nameEn: 'Class 1-A',
    blurbZh: '你的座位在窗边倒数第二排——转学生的标准配置，你已经放弃吐槽了。',
    blurbEn: 'Your desk is second from the back, by the window. Standard-issue transfer student seating. You have stopped commenting on it.',
    timeSlots: ['morning', 'lunch', 'afternoon'],
    regulars: [CharacterId.ASUKA, CharacterId.HIKARI],
    ambientZh: [
      '教室里只剩下值日生在擦黑板。粉笔灰在斜进来的光里慢慢往下沉。',
      '你回座位拿落下的笔记本。桌肚里多了一张不知谁塞的社团招新传单。'
    ],
    ambientEn: [
      'Only the cleaning duty is left, wiping the board. Chalk dust drifts down through the slanted light.',
      'You come back for a notebook you left behind. Someone has posted a club recruitment flyer into your desk.'
    ]
  },
  {
    id: 'school_library', district: 'school',
    nameJp: '図書室', reading: 'としょしつ',
    nameZh: '图书室', nameEn: 'School Library',
    blurbZh: '三面书架，一扇朝西的窗。下午三点以后整间屋子会变成蜂蜜色。',
    blurbEn: 'Shelves on three walls and one west-facing window. After three in the afternoon the whole room turns honey-coloured.',
    timeSlots: ['lunch', 'afternoon'],
    regulars: [CharacterId.REI],
    ambientZh: ['靠窗那个位置空着，但椅子被拉出来了一点点——像是刚有人起身。'],
    ambientEn: ['The seat by the window is empty, but the chair is pulled out a little. As if someone has just stood up.']
  },
  {
    id: 'rooftop_sunset', district: 'school',
    nameJp: '屋上', reading: 'おくじょう',
    nameZh: '天台', nameEn: 'Rooftop',
    blurbZh: '门上写着「立入禁止」，锁却从来没锁上过。全校都知道，全校都装作不知道。',
    blurbEn: 'The door says NO ENTRY. The lock has never once been locked. The whole school knows, and the whole school pretends not to.',
    timeSlots: ['lunch', 'afternoon', 'night'],
    regulars: [CharacterId.SORA],
    ambientZh: ['风比楼下大得多。你在护栏边站了一会儿，看见港口那头有一艘船正在慢慢转向。'],
    ambientEn: ['The wind is much stronger up here. You stand at the rail a while and watch a ship out in the harbour slowly come about.']
  },
  {
    id: 'school_terrace', district: 'school',
    nameJp: '学生食堂', reading: 'がくせいしょくどう',
    nameZh: '学生食堂', nameEn: 'Cafeteria',
    blurbZh: '中午挤得像战场，放学后空得能听见冰箱的声音。乌冬 280 日元。',
    blurbEn: 'A battlefield at noon, empty enough after school that you can hear the refrigerator. Udon, 280 yen.',
    mapScene: 'kaisei_cafeteria_hall',
    timeSlots: ['morning', 'lunch', 'afternoon'],
    regulars: [CharacterId.HIKARI, CharacterId.ASUKA],
    ambientZh: ['自动售货机吞了你的硬币，又吐了出来。你换了一枚，它才勉强同意。'],
    ambientEn: ['The vending machine swallows your coin and spits it back. You try another one and it grudgingly consents.']
  },
  {
    id: 'gym', district: 'school',
    nameJp: '体育館', reading: 'たいいくかん',
    nameZh: '体育馆', nameEn: 'Gymnasium',
    blurbZh: '篮球砸在地板上的声音在这里会绕一圈才回来。',
    blurbEn: 'A basketball hitting this floor takes a full lap around the room before it comes back to you.',
    extraScenes: ['kaisei_gym_interior'],
    timeSlots: ['lunch', 'afternoon'],
    regulars: [CharacterId.SORA],
    ambientZh: ['球架下摆着一只没人收的球。你投了一次，没进。'],
    ambientEn: ['A ball nobody put away sits under the hoop. You take one shot. You miss.']
  },
  {
    id: 'courtyard_rain', district: 'school',
    nameJp: '中庭', reading: 'なかにわ',
    nameZh: '中庭', nameEn: 'Courtyard',
    blurbZh: '四面教学楼围出来的一小块天。下雨的时候这里的声音特别好听。',
    blurbEn: 'A small square of sky fenced in by four buildings. When it rains, this is the best-sounding place in the school.',
    mapScene: 'courtyard_tree',
    extraScenes: ['courtyard_tree'],
    timeSlots: ['morning', 'lunch', 'afternoon'],
    regulars: [CharacterId.ASUKA],
    ambientZh: ['长椅是湿的。你没坐，就站着听了一会儿雨打在铁皮雨棚上的声音。'],
    ambientEn: ['The bench is wet. You do not sit; you stand and listen to the rain on the tin awning for a while.']
  },
  {
    id: 'music_room', district: 'school',
    nameJp: '音楽室', reading: 'おんがくしつ',
    nameZh: '音乐室', nameEn: 'Music Room',
    blurbZh: '三楼最里面那间。墙上挂着一排作曲家的画像，据说到了晚上眼睛会动——七不思议之一。',
    blurbEn: 'The far room on the third floor. A row of composer portraits whose eyes are said to move at night. One of the seven school mysteries.',
    requiresFlag: 'day1_done',
    lockedHintZh: '你还没在这栋楼里走全过。',
    lockedHintEn: 'You have not walked the whole building yet.',
    timeSlots: ['lunch', 'afternoon'],
    regulars: [CharacterId.REI],
    ambientZh: ['钢琴盖是开的。你按了一个键，声音在空屋子里拖得很长。'],
    ambientEn: ['The piano lid is open. You press one key and the note drags out long in the empty room.']
  },
  {
    id: 'art_room', district: 'school',
    nameJp: '美術室', reading: 'びじゅつしつ',
    nameZh: '美术室', nameEn: 'Art Room',
    blurbZh: '松节油的味道能从走廊那头闻到。石膏像永远缺一只耳朵。',
    blurbEn: 'You can smell the turpentine from the far end of the corridor. The plaster bust is permanently missing an ear.',
    extraScenes: ['kaisei_art_room'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你还没在这栋楼里走全过。',
    lockedHintEn: 'You have not walked the whole building yet.',
    timeSlots: ['lunch', 'afternoon'],
    regulars: [CharacterId.HIKARI],
    ambientZh: ['画架上有一张没画完的港口。颜料还没干透。'],
    ambientEn: ['An unfinished harbour sits on an easel. The paint has not fully dried.']
  },

  {
    id: 'school_infirmary', district: 'school',
    nameJp: '保健室', reading: 'ほけんしつ',
    nameZh: '保健室', nameEn: 'Infirmary',
    blurbZh: '白色的帘子拉了一半。这间屋子在日本的学校里有一种特殊地位——不是给病人的，是给暂时待不下去教室的人的。',
    blurbEn: 'The white curtain is half drawn. This room holds a particular place in a Japanese school: it is not really for the ill, it is for people who cannot be in a classroom right now.',
    requiresFlag: 'day1_done',
    lockedHintZh: '你还没在这栋楼里走全过。',
    lockedHintEn: 'You have not walked the whole building yet.',
    timeSlots: ['morning', 'lunch', 'afternoon'],
    ambientZh: ['校医不在，桌上压着一张「すぐ戻ります」。你在门口站了一会儿就走了。'],
    ambientEn: ['The nurse is out; a note on the desk says back shortly. You stand in the doorway a moment and leave.']
  },
  {
    id: 'school_science_lab', district: 'school',
    nameJp: '理科室', reading: 'りかしつ',
    nameZh: '理科室', nameEn: 'Science Lab',
    blurbZh: '长条实验台，黑色台面被烧过很多次。药品柜上着锁，钥匙就挂在旁边的钉子上。',
    blurbEn: 'Long black-topped benches, scorched in a great many places. The chemical cabinet is locked and the key hangs on a nail beside it.',
    requiresFlag: 'day1_done',
    lockedHintZh: '你还没在这栋楼里走全过。',
    lockedHintEn: 'You have not walked the whole building yet.',
    timeSlots: ['lunch', 'afternoon'],
    regulars: [CharacterId.REI],
    ambientZh: ['人体骨骼模型被人套了一件校服外套。没有人承认是自己干的。'],
    ambientEn: ['Someone has put a school blazer on the skeleton model. Nobody is admitting to it.']
  },
  {
    id: 'school_bicycle_parking', district: 'school',
    nameJp: '駐輪場', reading: 'ちゅうりんじょう',
    nameZh: '自行车棚', nameEn: 'Bicycle Shed',
    blurbZh: '铁皮顶棚下面塞了两百多辆车。放学那阵子这儿最堵，也最容易撞见人。',
    blurbEn: 'Two hundred-odd bicycles under a tin roof. At home time it is the most congested place in the school, and therefore the easiest place to run into somebody.',
    timeSlots: ['morning', 'lunch', 'afternoon'],
    ambientZh: ['你的车被两辆车夹住了。你花了三分钟才把它抽出来。'],
    ambientEn: ['Your bike is wedged between two others. It takes three minutes to work it free.']
  },

  // ======================= 北野（家附近） =======================
  {
    // 第一天遇见光的那间屋子。之后就再也没有入口能回去了——
    // 而它恰恰是这个游戏里唯一一个"留学生的地盘"。
    id: 'international_office', district: 'school',
    nameJp: '国際交流サロン', reading: 'こくさいこうりゅうサロン',
    nameZh: '国际交流室', nameEn: 'International Exchange Room',
    blurbZh: '一张大桌子、三面书架、一个地球仪。墙上贴满了历年的活动照片，照片里的人一年一换。',
    blurbEn: 'One big table, shelves on three sides, a globe. The wall is covered in photographs from previous years, and the faces in them change annually.',
    extraScenes: ['international_office_window'],
    timeSlots: ['morning', 'lunch', 'afternoon'],
    regulars: [CharacterId.HIKARI],
    ambientZh: [
      '桌上摊着别人没填完的表格。你看了一眼，发现自己现在能读懂大半了。',
      '书架最下层有一本很旧的相册。翻到某一页，有个人的站姿和光一模一样，但那是三年前。',
      '地球仪上有一个被摸得发白的地方。你转过去看，是你来的那个方向。'
    ],
    ambientEn: [
      'Somebody has left a half-filled form on the table. You glance at it and find that you can now read most of it.',
      'There is an old photo album on the bottom shelf. On one page somebody is standing exactly the way Hikari stands, but the year is three years ago.',
      'One patch of the globe has been rubbed pale. You turn it round to look. It is the direction you came from.'
    ]
  },
  {
    id: 'umikaze_exterior', district: 'kitano',
    nameJp: '海風荘', reading: 'うみかぜそう',
    nameZh: '海风庄', nameEn: 'Umikaze Apartments',
    blurbZh: '你住的地方。二层木造，外墙刷成奶油色，铁楼梯一踩就响。',
    blurbEn: 'Where you live. Two storeys of timber, cream-painted, with an iron staircase that announces everyone who uses it.',
    timeSlots: ['morning', 'afternoon', 'night'],
    regulars: [CharacterId.MIYUKI, CharacterId.NAO],
    ambientZh: ['信箱里塞着一张披萨传单和一张水电缴费单。楼上有人在浇花，水滴到了铁栏杆上。'],
    ambientEn: ['A pizza flyer and a utility bill in the letterbox. Someone upstairs is watering plants; the drips land on the iron rail.']
  },
  {
    id: 'kitano_slope', district: 'kitano',
    nameJp: '北野坂', reading: 'きたのざか',
    nameZh: '北野坂', nameEn: 'Kitano Slope',
    blurbZh: '从山手一路下到三宫的那条坡。走下去五分钟，走上来十五分钟。',
    blurbEn: 'The slope that runs from the hillside down into Sannomiya. Five minutes down. Fifteen minutes back up.',
    timeSlots: ['morning', 'afternoon', 'night'],
    regulars: [CharacterId.NAO, CharacterId.MIYUKI],
    ambientZh: ['坡道两边的洋馆一栋接一栋。你走到一半停下来喘了口气，装作是在看风景。'],
    ambientEn: ['Western houses line the slope one after another. Halfway up you stop for breath and pretend to be admiring the view.']
  },
  {
    id: 'convenience_store', district: 'kitano',
    nameJp: 'コンビニ 北野店', reading: 'コンビニ きたのてん',
    nameZh: '便利店 北野店', nameEn: 'Convenience Store (Kitano)',
    blurbZh: '坡底那家。二十四小时亮着，是这条坡上唯一不会睡的东西。',
    blurbEn: 'The one at the foot of the slope. Lit twenty-four hours, and the only thing on this hill that never sleeps.',
    timeSlots: ['morning', 'afternoon', 'night'],
    ambientZh: ['关东煮的锅还开着。你在货架前站了三分钟，最后什么也没买就出来了。'],
    ambientEn: ['The oden pot is still on. You stand at the shelves for three minutes and leave without buying anything.']
  },
  {
    id: 'kitano_lookout', district: 'kitano',
    nameJp: '北野天満神社', reading: 'きたのてんまんじんじゃ',
    nameZh: '北野天满神社', nameEn: 'Kitano Tenman Shrine',
    blurbZh: '坡顶的石阶爬上去，能一眼看到整个港。学问之神，考前这里人特别多。',
    blurbEn: 'Up the stone steps at the top of the slope, the whole harbour opens at once. God of learning; very crowded before exams.',
    mapScene: 'kitano_tenman_shrine',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.INARI],
    ambientZh: ['绘马挂了一整排。你随手翻了两张，全是「合格祈願」。'],
    ambientEn: ['A whole rack of ema plaques. You flip two at random. Both are prayers to pass an exam.']
  },
  {
    id: 'nishimura_coffee_salon', district: 'kitano',
    nameJp: 'にしむら珈琲店', reading: 'にしむらこーひーてん',
    nameZh: '西村咖啡店', nameEn: 'Nishimura Coffee',
    blurbZh: '坡道中段那栋深色木门的店。里面比外面看着大三倍，也安静三倍。',
    blurbEn: 'The dark-doored place halfway up the slope. Three times bigger inside than it looks, and three times quieter.',
    mapScene: 'nishimura_coffee_exterior',
    extraScenes: ['nishimura_coffee_bar', 'nishimura_coffee_window'],
    requiresFlag: 'ev_slope_nao',
    lockedHintZh: '你从门口走过好几次了，但没进去过——那种店总得有人先带你进去一次。',
    lockedHintEn: 'You have walked past the door several times. Never in. Places like that need someone to take you the first time.',
    timeSlots: ['morning', 'afternoon'],
    regulars: [CharacterId.MIYUKI],
    ambientZh: ['你点了今日咖啡，坐在最里面。窗外的坡道上有人正吃力地往上走。'],
    ambientEn: ['You order the coffee of the day and take the deepest seat. Outside, someone is labouring up the slope.']
  },

  {
    id: 'kitano_kazamidori_square', district: 'kitano',
    nameJp: '風見鶏の館前広場', reading: 'かざみどりのやかたまえひろば',
    nameZh: '风见鸡馆前广场', nameEn: 'Weathercock House Square',
    blurbZh: '北野真正的中心。红砖的风见鸡馆立在坡顶，屋顶那只铁公鸡是这一带所有明信片的主角。',
    blurbEn: 'The actual centre of Kitano. The red-brick Weathercock House stands at the top of the slope, and the iron cockerel on its roof is on every postcard sold in this district.',
    extraScenes: ['kazamidori_square'],
    timeSlots: ['morning', 'afternoon'],
    ambientZh: ['广场上有人在拉小提琴，琴盒开着。你投了一百日元，他冲你点了下头，没停。'],
    ambientEn: ['Someone is playing violin with the case open. You drop in a hundred yen; he nods at you without stopping.']
  },
  {
    id: 'retro_kissaten', district: 'kitano',
    nameJp: '純喫茶', reading: 'じゅんきっさ',
    nameZh: '纯喫茶', nameEn: 'Old-Style Coffee House',
    blurbZh: '天鹅绒座椅、玻璃糖罐、虹吸壶。「纯喫茶」的意思是不卖酒——这个词本身就是一个时代的化石。',
    blurbEn: 'Velvet seats, a glass sugar jar, a siphon brewer. Junkissa means it serves no alcohol; the word itself is a fossil of another era.',
    mapScene: 'retro_kissaten_exterior',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['morning', 'afternoon'],
    ambientZh: ['老板娘按了半分钟的虹吸壶，整间屋子都是那个声音。咖啡端上来是苦的，你没加糖。'],
    ambientEn: ['The owner works the siphon for half a minute and the whole room fills with the sound of it. The coffee arrives bitter. You do not add sugar.']
  },

  // ======================= 三宫 =======================
  {
    id: 'sannomiya_station', district: 'sannomiya',
    nameJp: '三宮駅', reading: 'さんのみやえき',
    nameZh: '三宫站', nameEn: 'Sannomiya Station',
    blurbZh: '神户的心脏。JR、阪急、阪神、地铁、轻轨，五条线全挤在这一个路口。',
    blurbEn: 'The heart of Kobe. JR, Hankyu, Hanshin, subway and the Port Liner, five lines crammed into one intersection.',
    mapScene: 'portliner_gate',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['morning', 'afternoon', 'night'],
    ambientZh: ['闸机口的人流像涨潮。你靠着柱子站了一会儿，看电子屏上的班次一行行往上滚。'],
    ambientEn: ['The crowd at the gates comes in like a tide. You lean on a pillar and watch the departure board scroll upward.']
  },
  {
    id: 'sannomiya_arcade', district: 'sannomiya',
    nameJp: 'センター街', reading: 'センターがい',
    nameZh: '中央商店街', nameEn: 'Center Gai Arcade',
    blurbZh: '有顶棚的商店街，下雨天也不用打伞。从头走到尾要二十分钟，但没人是走直线的。',
    blurbEn: 'A covered shopping street; no umbrella needed. Twenty minutes end to end, though nobody walks it in a straight line.',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    ambientZh: ['扭蛋机排了一整面墙。你花了三百日元，抽到一只很丑的猫。你留下了它。'],
    ambientEn: ['A whole wall of capsule machines. Three hundred yen buys you a very ugly cat. You keep it.']
  },
  {
    id: 'pia_kobe_arcade', district: 'sannomiya',
    nameJp: '高架下 ピアザ神戸', reading: 'こうかした ピアザこうべ',
    nameZh: '高架下 Piazza 神户', nameEn: 'Under the Tracks',
    blurbZh: '铁道高架桥底下的一长条店铺。电车开过去的时候天花板会震。',
    blurbEn: 'A long ribbon of shops beneath the railway viaduct. When a train goes over, the ceiling shakes.',
    extraScenes: ['pia_kobe'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.MAKI],
    ambientZh: ['音游机的声音从深处传出来。有人正在打一首你不认识的曲子，全连。'],
    ambientEn: ['A rhythm game is going somewhere deep in the arcade. Someone is full-comboing a song you do not know.']
  },
  {
    id: 'ramen_shop_interior', district: 'sannomiya',
    nameJp: 'ラーメン 太郎', reading: 'ラーメン たろう',
    nameZh: '拉面 太郎', nameEn: 'Ramen Taro',
    blurbZh: '八个座位，全是吧台。老板不说话，只在你吃完的时候点一下头。',
    blurbEn: 'Eight seats, all of them at the counter. The master says nothing, and nods once when you finish.',
    mapScene: 'ramen_jiro_exterior',
    extraScenes: ['ramen_jiro_bowl'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.SORA, CharacterId.MAKI],
    ambientZh: ['你点了一碗普通的。汤是猪骨和小鱼干一起熬的，第一口有点咸，第三口就刚好。'],
    ambientEn: ['You order the plain one. Pork bone and dried sardine in the same pot: a touch salty at first, exactly right by the third mouthful.']
  },
  {
    // 🏫 塾。三宫一栋窄楼的三层。
    //
    // 它和图书馆的区别不在"能不能学习"，而在**时候**：
    // 十月里去一趟，回来只是知识 +1；期末考前一周去，
    // 那一趟的价值翻倍。所以它不是又一个刷属性的地方，
    // 而是一个"什么时候去"的判断。
    //
    // 只开夜里：白天要上课，这就是补习班存在的理由。
    id: 'juku', district: 'sannomiya',
    nameJp: '進学塾 灘和ゼミ', reading: 'しんがくじゅく なだわゼミ',
    nameZh: '升学塾 滩和研习班', nameEn: 'Nadawa Cram School',
    blurbZh: '三宫一栋窄楼的三层。隔间、白板、写着「合格祈願」的横幅。九点半才放人。',
    blurbEn: 'Third floor of a narrow building in Sannomiya. Booths, a whiteboard, a banner reading "pray for a pass". They let you out at half nine.',
    mapScene: 'juku_night',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['night'],
    ambientZh: [
      '隔间的挡板上贴满了前人留下的便利贴。有一张只写了「あと12日」，日期是去年的。',
      '你隔壁那个人从头到尾没抬过头。你走的时候他还在。'
    ],
    ambientEn: [
      'The partition is papered with sticky notes left by whoever sat here before. One of them says only "12 days left", and the date on it is from last year.',
      'The person in the next booth does not look up once. He is still there when you leave.'
    ]
  },
  {
    id: 'junkudo_bookstore', district: 'sannomiya',
    nameJp: 'ジュンク堂書店', reading: 'ジュンクどうしょてん',
    nameZh: '淳久堂书店', nameEn: 'Junkudo Books',
    blurbZh: '一整栋楼的书。有椅子，而且没人赶你走。',
    blurbEn: 'An entire building of books. There are chairs, and nobody moves you along.',
    mapScene: 'sannomiya_bookstore',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.REI],
    ambientZh: ['你在语言学习区站了很久，最后买了一本用不上的关西方言词典。'],
    ambientEn: ['You linger a long time in the language section and buy a Kansai dialect dictionary you do not need.']
  },
  {
    id: 'ikuta_shrine', district: 'sannomiya',
    nameJp: '生田神社', reading: 'いくたじんじゃ',
    nameZh: '生田神社', nameEn: 'Ikuta Shrine',
    blurbZh: '闹市正中的一片林子。红色的楼门一进去，外面的声音就断了一大半。',
    blurbEn: 'A stand of trees in the middle of downtown. Step through the red gate and most of the noise outside simply stops.',
    mapScene: 'ikuta_gate',
    extraScenes: ['ikuta_forest'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['morning', 'lunch', 'afternoon'],
    regulars: [CharacterId.INARI],
    ambientZh: ['你在赛钱箱前站着，摸遍口袋只找到一枚十日元。你还是投了。'],
    ambientEn: ['You stand at the offering box, dig through your pockets and come up with a single ten-yen coin. You put it in anyway.']
  },
  {
    id: 'nankinmachi', district: 'sannomiya',
    nameJp: '南京町', reading: 'なんきんまち',
    nameZh: '南京町', nameEn: 'Nankinmachi',
    blurbZh: '红灯笼，蒸笼的白气，从街这头喊到那头的普通话。日本三大中华街之一。',
    blurbEn: 'Red lanterns, steam off the baskets, Mandarin shouted from one end of the street to the other. One of the three great Chinatowns.',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon'],
    regulars: [CharacterId.HIKARI],
    ambientZh: ['你买了一个猪肉包，站在广场边上吃完了。烫，但停不下来。'],
    ambientEn: ['You buy a pork bun and finish it standing at the edge of the plaza. Too hot, and impossible to stop.']
  },
  {
    id: 'hyakkin_store', district: 'sannomiya',
    nameJp: '百円ショップ', reading: 'ひゃくえんショップ',
    nameZh: '百元店', nameEn: 'Hundred-Yen Shop',
    blurbZh: '商店街拐进去的那家。花盆、种子、剪刀、装什么都行的塑料箱——一层楼的杂物，标价大多是 110。',
    blurbEn: 'Off the arcade, one floor of everything: pots, seeds, scissors, plastic boxes for things you do not own yet. Most of it is 110 yen.',
    mapScene: 'hundred_yen_shop_exterior',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    ambientZh: ['你在收纳用品那一排走了两个来回，最后买了一个你其实用不上的沥水篮。'],
    ambientEn: ['You walk the storage aisle twice and leave with a draining basket you have no use for.']
  },
  {
    id: 'sannomiya_drugstore', district: 'sannomiya',
    nameJp: 'マツモトキヨシ 三宮店', reading: 'マツモトキヨシ さんのみやてん',
    nameZh: '松本清药妆店（三宫中心街）', nameEn: 'Matsumoto Kiyoshi Drugstore',
    blurbZh: '三宫中心街入口显眼的黄色大招牌。门口堆满了特价防晒霜和润唇膏，店员七海小姐微笑着迎接客人。',
    blurbEn: 'The bold yellow sign at the entrance to Sannomiya Center Gai. Piles of discounted sunscreen out front, and the clerk Nanami greets shoppers with a smile.',
    mapScene: 'drugstore_exterior',
    extraScenes: ['drugstore_interior'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['morning', 'afternoon', 'night'],
    regulars: [CharacterId.ASUKA, CharacterId.MIYUKI],
    ambientZh: [
      '店员小姐微笑着递给你一个小购物篮，还轻声提醒你今天会员积分双倍。',
      '你在眼药水和维生素货架前站了一会儿，买了一瓶提神用的清凉眼药水。'
    ],
    ambientEn: [
      'The shop clerk offers you a basket with a welcoming smile, mentioning double points today.',
      'You look over the eye drops and vitamin section, picking up a bottle to keep alert during late study sessions.'
    ]
  },
  {
    id: 'bookoff_sannomiya', district: 'sannomiya',
    nameJp: 'BOOKOFF 三宮センター街店', reading: 'ブックオフ さんのみやセンターがいてん',
    nameZh: 'Book Off 三宫中心街店', nameEn: 'Book Off Sannomiya Center Gai',
    blurbZh: '三宫中心街拱廊下醒目的黄蓝招牌。门口推车里堆满 110 円特价文库和二手漫画。',
    blurbEn: 'The bright yellow and blue sign under the Sannomiya arcade roof. Carts out front packed with 110-yen manga and bunko novels.',
    mapScene: 'bookoff_exterior',
    extraScenes: ['bookoff_interior'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.REI, CharacterId.HIKARI],
    ambientZh: [
      '门口 110 円的特价漫画框前挤满了翻书的学生，你在文库本专区挑到了一本昭和年代的怪谈短篇集。',
      '在深处的旧轻小说书架前站了半小时，出来时手里多了两本带书皮的二手文库。'
    ],
    ambientEn: [
      'Students crowd the 110-yen discounted manga carts; you fish out a vintage paperback of Showa-era ghost stories.',
      'You spend half an hour by the back light-novel shelves and leave with two second-hand paperbacks in clean jackets.'
    ]
  },
  {
    id: 'surugaya_sannomiya', district: 'sannomiya',
    nameJp: '駿河屋 神戸三宮店', reading: 'するがや こうべさんのみやてん',
    nameZh: '骏河屋 神户三宫店（Center Plaza）', nameEn: 'Surugaya Kobe Sannomiya',
    blurbZh: '三宫 Center Plaza 里的中古二次元圣地。一整排扭蛋机、玻璃手办柜与满墙挂满的吧唧盲盒。',
    blurbEn: 'The otaku treasure hub inside Sannomiya Center Plaza. Endless gachapon machines, glass figure display cases, and walls of anime badges.',
    mapScene: 'surugaya_exterior',
    extraScenes: ['surugaya_interior'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.SORA, CharacterId.MAKI],
    ambientZh: [
      '玻璃展柜里摆着中古手办和古董主机卡带，你在亚克力立牌区找到了同校很多人在追的动画角色。',
      '在门口一整排扭蛋机前投了两枚硬币，拧出来一个神户限定的微型生田神社鸟居挂件。'
    ],
    ambientEn: [
      'Glass showcases line the aisle with retro game cartridges and anime figurines; you spot keychains popular at school.',
      'You drop two hundred-yen coins into a gachapon machine out front and get a Kobe-exclusive mini shrine gate strap.'
    ]
  },
  {
    id: 'uniqlo_sannomiya', district: 'sannomiya',
    nameJp: 'ユニクロ 神戸三宮店', reading: 'ユニクロ こうべさんのみやてん',
    nameZh: '优衣库 三宫中心街店', nameEn: 'UNIQLO Kobe Sannomiya',
    blurbZh: '三宫中心街宽敞明亮的两层落地玻璃旗舰店。展示着当季极简日系常服与动漫联名 UT。',
    blurbEn: 'The airy two-story flagship with glass display windows in Sannomiya Center Gai, featuring seasonal basics and anime UT collections.',
    mapScene: 'uniqlo_exterior',
    extraScenes: ['uniqlo_interior'],
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['morning', 'afternoon', 'night'],
    regulars: [CharacterId.NAO, CharacterId.ASUKA],
    ambientZh: [
      '明亮挑高的木色展台前，新一季的联名 UT 和轻量羽绒服叠得整整齐齐，店员正在给假人模特调整围巾。',
      '你在保暖内衣区挑了一件长袖打底，走下电动扶梯时收银台的小姐姐微笑着向你鞠躬。'
    ],
    ambientEn: [
      'Neatly folded stacks of graphic UT tees and light jackets line the blonde-wood tables; a clerk straightens a mannequin’s scarf.',
      'You pick up a thermal base layer and the cashier bows pleasantly as you step toward the escalator.'
    ]
  },
  {
    id: 'tackle_shop', district: 'harbor',
    nameJp: 'みなと釣具', reading: 'みなとつりぐ',
    nameZh: '港口渔具店', nameEn: 'Minato Tackle',
    blurbZh: '护岸边一间铁皮屋。门口塑料桶里插着一排竿，屋里有干海藻和机油的味道。',
    blurbEn: 'A tin shed by the quay. A bucket of rods at the door; inside it smells of dried seaweed and machine oil.',
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过。',
    lockedHintEn: 'You have not gone toward the water yet.',
    timeSlots: ['morning', 'afternoon'],
    ambientZh: ['老板正在修一个卷线器。你站着看了十分钟，他一句话也没说，但也没赶你走。'],
    ambientEn: ['The owner is repairing a reel. You watch for ten minutes; he says nothing, and does not move you along either.']
  },
  {
    id: 'former_settlement_salon', district: 'sannomiya',
    nameJp: '旧居留地十五番館', reading: 'きゅうきょりゅうち じゅうごばんかん',
    nameZh: '旧居留地十五番馆', nameEn: 'Former Settlement No. 15',
    blurbZh: '开港时期外国领事馆改的餐厅。天花板高得离谱，说话都会不自觉放轻。',
    blurbEn: 'A restaurant inside a consulate from the port-opening era. The ceilings are absurdly high and everyone lowers their voice unasked.',
    mapScene: 'former_settlement_exterior',
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过——旧居留地在再往南一点的地方。',
    lockedHintEn: 'You have not gone toward the water yet. The old settlement is a little further south.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.MIYUKI],
    ambientZh: ['你只点了红茶。杯子和碟子碰在一起的声音在这间屋子里显得很响。'],
    ambientEn: ['You order only tea. The cup meeting the saucer sounds very loud in this room.']
  },

  {
    id: 'oji_zoo', district: 'sannomiya',
    timeCost: 2,   // 一圈逛下来天就黑了
    nameJp: '王子動物園', reading: 'おうじどうぶつえん',
    nameZh: '王子动物园', nameEn: 'Oji Zoo',
    blurbZh: '全日本唯一一家同时养着大熊猫和考拉的动物园。里面还塞了一个小游乐园，那台摩天轮矮得能看清每个人的脸。',
    blurbEn: 'The only zoo in Japan with both a giant panda and koalas. A small funfair is wedged inside it, with a ferris wheel low enough that you can make out everyone riding it.',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['morning', 'afternoon'],
    ambientZh: ['你在火烈鸟那儿站了很久。它们一直单脚站着一动不动，最后是你先撑不住了。'],
    ambientEn: ['You stand at the flamingos a long time. They hold one leg up without moving, and you are the one who gives in first.']
  },
  {
    id: 'ramen_rekishi', district: 'sannomiya',
    timeCost: 2,   // 二郎系的量，吃完只想回家躺着
    nameJp: '歴史を刻め', reading: 'れきしをきざめ',
    nameZh: '拉面「刻下历史」', nameEn: 'Rekishi wo Kizame',
    blurbZh: '店名的意思是「刻下历史」。豚骨酱油，蒜可以自己加到失去理智。吃完一整天嘴里都是那个味道。',
    blurbEn: 'The name means "carve your name into history". Pork bone and soy, with as much garlic as you have the nerve to ask for. You taste it for the rest of the day.',
    mapScene: 'ramen_rekishi_exterior',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.SORA],
    ambientZh: ['你照着墙上的规矩喊了「ニンニク少なめ」。旁边的大叔喊的是「マシマシ」，你偷偷佩服了一下。'],
    ambientEn: ['You call for a little garlic, as the sign instructs. The man beside you calls for extra extra, and you quietly admire him.']
  },
  {
    id: 'grill_ippei', district: 'sannomiya',
    nameJp: '洋食の店 一平', reading: 'ようしょくのみせ いっぺい',
    nameZh: '洋食店 一平', nameEn: 'Grill Ippei',
    blurbZh: '开港城市才长得出来的东西：把西餐拆开、重装成日本人自己的菜。蛋包饭、炸虾、汉堡排，全在一个铁盘子里。',
    blurbEn: 'A thing only a port city grows: Western food taken apart and rebuilt as Japanese. Omurice, fried prawn and hamburg steak, all on one iron plate.',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    ambientZh: ['铁盘端上来还在响。你等它安静下来才动第一刀。'],
    ambientEn: ['The iron plate is still hissing when it lands. You wait for it to go quiet before making the first cut.']
  },
  {
    id: 'kobe_beef_teppanyaki', district: 'sannomiya',
    timeCost: 2,   // 正经坐下来的一顿，从前菜到甜点
    nameJp: '神戸牛 鉄板焼き', reading: 'こうべぎゅう てっぱんやき',
    nameZh: '神户牛 铁板烧', nameEn: 'Kobe Beef Teppanyaki',
    blurbZh: '师傅在你面前把那块肉从生煎到熟，全程不说话。价格是你一个月的伙食费。',
    blurbEn: 'The chef cooks the piece through in front of you without saying a word. The price is a month of your food budget.',
    requiresFlag: 'map_far',
    lockedHintZh: '这种地方不是刚落地的人会走进去的。等你在这座城市待久一点。',
    lockedHintEn: 'Not a place someone who just landed walks into. Give the city more time.',
    timeSlots: ['night'],
    ambientZh: ['你只点了最便宜的午市。师傅切完之后，把最边上那一块单独摆了摆，说这块是给你的。'],
    ambientEn: ['You order only the cheapest lunch set. After cutting, the chef sets the end piece aside on its own and says that one is for you.']
  },
  {
    id: 'motomachi_arcade', district: 'sannomiya',
    nameJp: '元町商店街', reading: 'もとまちしょうてんがい',
    nameZh: '元町商店街', nameEn: 'Motomachi Arcade',
    blurbZh: '神户开港时便存在的老牌拱廊街。绿色的拱顶挂着彩绘玻璃，老茶铺烘茶的香气与百年面包房的刚出炉热气飘了整条街。',
    blurbEn: 'An arcade that dates to the opening of Kobe port. Stained glass hangs from the green vaulted roof, filled with the aroma of roasted tea and hundred-year bakeries.',
    mapScene: 'motomachi_arcade',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['morning', 'afternoon', 'night'],
    regulars: [CharacterId.MIYUKI, CharacterId.HIKARI],
    ambientZh: [
      '茶铺门前的大茶壶冒着白气，烘焙绿茶的焦香飘了半条街。你在门口站了一会儿，深吸了一口气。',
      '老字号面包店刚出炉的法棍立在藤筐里。你买了一个刚烤好的红豆面包，拿到外面的长椅上趁热吃完。'
    ],
    ambientEn: [
      'Steam rises from the giant kettle outside the tea merchant, roasting-tea aroma drifting halfway down the arcade. You stand a moment and breathe in.',
      'Freshly baked baguettes stand upright in wicker baskets. You buy a warm red-bean bun and eat it on a street bench while it is hot.'
    ]
  },
  {
    id: 'daimaru_settlement', district: 'sannomiya',
    nameJp: '大丸・旧居留地', reading: 'だいまる・きゅうきょりゅうち',
    nameZh: '大丸·旧居留地', nameEn: 'Daimaru & Old Settlement',
    blurbZh: '古典欧式石柱回廊、煤气路灯与露天咖啡座。神户最典雅的洋风街区，晚风穿过榉树林荫，时间在这里走得格外慢。',
    blurbEn: 'Classical European stone colonnades, gas lanterns, and open-air cafes. Kobe’s most elegant foreign quarter; time moves gently beneath the zelkovas.',
    mapScene: 'daimaru_settlement',
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过——旧居留地在再往南一点的地方。',
    lockedHintEn: 'You have not gone toward the water yet. The old settlement is a little further south.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.MIYUKI, CharacterId.ASUKA],
    ambientZh: [
      '大丸百货外廊的煤气灯在薄暮中亮了起来。露天咖啡座上有人正一边翻阅画册一边喝浓缩咖啡。',
      '旧居留地的街道笔直而宽阔，两旁的榉树被晚风吹得沙沙作响。你在街角站了一会儿，整个人都静了下来。'
    ],
    ambientEn: [
      'The gas lamps along Daimaru’s colonnade flicker to life in the twilight. Someone sits at a terrace table sipping espresso over an art catalogue.',
      'The streets of the old settlement run wide and straight, zelkova leaves rustling in the evening breeze. You stand a while at the corner and feel completely calm.'
    ]
  },
  {
    id: 'ikuta_road', district: 'sannomiya',
    nameJp: '生田ロード・東門街', reading: 'いくたロード・ひがしもんがい',
    nameZh: '生田路·东门街', nameEn: 'Ikuta Road & Higashimon',
    blurbZh: '连接三宫站与生田神社的热闹街巷。满街的红提灯、炭火串烧香气与拉面店的热气，神户最鲜活的市井夜色。',
    blurbEn: 'The lively lanes linking Sannomiya Station to Ikuta Shrine. Packed with red lanterns, yakitori grills, and ramen steam—Kobe’s most vibrant nightlife.',
    mapScene: 'ikuta_road_night',
    requiresFlag: 'day1_done',
    lockedHintZh: '你才刚到这座城市，还没往山下走过。',
    lockedHintEn: 'You have only just arrived. You have not been down the hill yet.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.SORA, CharacterId.MAKI],
    ambientZh: [
      '居酒屋门前的红提灯随风微晃，炭烤鸡肉串的香气扑鼻而来。下班的工薪族和学生在巷口擦肩而过。',
      '巷子深处拉面店的木拉门被拉开，传出一声响亮的「いらっしゃい！」。街灯倒映在刚下过小雨的湿润石板上。'
    ],
    ambientEn: [
      'Red paper lanterns sway gently in the breeze, the savoury scent of charcoal-grilled yakitori filling the lane. Office workers and students brush past at the corner.',
      'A wooden sliding door opens down the alley with a hearty shout of welcome. Streetlights reflect cleanly off the damp paving stones.'
    ]
  },

  // ======================= 港 =======================
  {
    id: 'portliner_platform', district: 'harbor',
    nameJp: 'ポートライナー', reading: 'ポートライナー',
    nameZh: 'Port Liner 轻轨', nameEn: 'Port Liner',
    blurbZh: '无人驾驶的高架轻轨，最前面那节没有司机座，小孩子会抢。',
    blurbEn: 'A driverless elevated line. The front carriage has no driver seat, and children fight over it.',
    mapScene: 'portliner_gate',
    extraScenes: ['portliner_sannomiya'],
    requiresFlag: 'map_harbor',
    lockedHintZh: '你在三宫站看见过它的指示牌，但还没走到那一头。',
    lockedHintEn: 'You have seen the signs for it at Sannomiya, but you have not walked to that end yet.',
    timeSlots: ['morning', 'afternoon', 'night'],
    ambientZh: ['你坐在最前面。轨道在海上转了一个大弯，整座城市在窗子里横着扫过去。'],
    ambientEn: ['You take the very front. The track swings out over the water in a long curve and the whole city sweeps across the window.']
  },
  {
    id: 'meriken_park', district: 'harbor',
    nameJp: 'メリケンパーク', reading: 'メリケンパーク',
    nameZh: '美利坚公园', nameEn: 'Meriken Park',
    blurbZh: '港塔脚下那片开阔地。风大，永远有人在拍照，永远有人在跑步。',
    blurbEn: 'The open ground at the foot of the Port Tower. Windy, permanently full of people photographing and people running.',
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过。',
    lockedHintEn: 'You have not gone toward the water yet.',
    timeSlots: ['afternoon', 'night'],
    ambientZh: ['地震纪念公园那一段护岸至今保持着 1995 年那天塌下去的样子。你站了很久。'],
    ambientEn: ['A section of the quay is kept exactly as it collapsed in 1995. You stand there for a long time.']
  },
  {
    id: 'kobe_harbor', district: 'harbor',
    timeSlots: ['afternoon', 'night'],
    timeCost: 2,   // 商场加海边，一逛就停不下来
    nameJp: 'ハーバーランド', reading: 'ハーバーランド',
    nameZh: '港湾乐园', nameEn: 'Harborland',
    blurbZh: '仓库改的商场一路排到水边。傍晚的时候整片海会先变金色再变紫色。',
    blurbEn: 'Converted warehouses running all the way to the waterfront. At dusk the whole bay goes gold, then purple.',
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过。',
    lockedHintEn: 'You have not gone toward the water yet.',
    ambientZh: ['有人在栈桥上弹吉他，弹得不算好。但没人走开。'],
    ambientEn: ['Someone is playing guitar out on the boardwalk, not especially well. Nobody leaves.']
  },
  {
    id: 'mosaic_night', district: 'harbor',
    nameJp: 'モザイク大観覧車', reading: 'モザイクだいかんらんしゃ',
    nameZh: '马赛克摩天轮', nameEn: 'Mosaic Ferris Wheel',
    blurbZh: '转一圈十分钟。灯会变色，从你家阳台上都看得见。',
    blurbEn: 'Ten minutes for one turn. The lights change colour, and you can see it from your own balcony.',
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过。',
    lockedHintEn: 'You have not gone toward the water yet.',
    timeSlots: ['night'],
    ambientZh: ['你一个人坐了一圈。到最高点的时候，能看见山腰上那一片你住的地方也亮着。'],
    ambientEn: ['You ride it alone. At the top you can see the hillside where you live, also lit.']
  },

  {
    id: 'suma_beach', district: 'harbor',
    timeSlots: ['morning', 'afternoon'],
    timeCost: 2,   // 从三宫坐电车过去，来回就是一趟远门
    nameJp: '須磨海岸', reading: 'すまかいがん',
    nameZh: '须磨海岸', nameEn: 'Suma Beach',
    blurbZh: '从三宫坐电车二十分钟。市区里能有一片真正的沙滩，是神户被夹在山和海之间才捡到的便宜。',
    blurbEn: 'Twenty minutes by train from Sannomiya. A real sand beach inside the city is a bargain that comes only of Kobe being pinned between the mountains and the sea.',
    extraScenes: ['suma_beach_alt'],
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过。',
    lockedHintEn: 'You have not gone toward the water yet.',
    ambientZh: ['冬天的沙滩上只有你和两只乌鸦。海浪的声音比夏天大得多。'],
    ambientEn: ['In winter the beach holds you and two crows. The waves are far louder than they are in summer.']
  },
  {
    id: 'suma_fishing_pier', district: 'harbor',
    timeSlots: ['morning', 'afternoon'],
    timeCost: 2,   // 钓鱼没有「待一会儿」这种说法
    nameJp: '須磨海づり公園', reading: 'すまうみづりこうえん',
    nameZh: '须磨海钓公园', nameEn: 'Suma Fishing Pier',
    blurbZh: '一条伸进海里的堤。沙底浅海，上来的东西和市区那些石壁完全不一样——鲽鱼只有这儿有。',
    blurbEn: 'A pier running straight out into the sea. Shallow water over sand, so what comes up is nothing like the harbour walls in town. Flounder only happen here.',
    extraScenes: ['fishing_pier'],
    requiresFlag: 'map_harbor',
    lockedHintZh: '你还没往海那边走过。',
    lockedHintEn: 'You have not gone toward the water yet.',
    ambientZh: ['堤上每隔五米站一个人，谁也不跟谁说话。这大概就是这条堤存在的意义。'],
    ambientEn: ['One person every five metres along the pier, none of them talking to each other. That is probably the point of the pier.']
  },

  {
    // 须磨海浜水族园。神户人从小学远足开始就来这儿，
    // 那条鲨鱼隧道是所有人共同的记忆点。
    id: 'suma_aquarium', district: 'harbor',
    nameJp: '須磨海浜水族園', reading: 'すまかいひんすいぞくえん',
    nameZh: '须磨海滨水族园', nameEn: 'Suma Aqualife Park',
    blurbZh: '本地人叫它「スマスイ」。穿过那条弧形的隧道时，鳐鱼会贴着头顶滑过去，整条通道是蓝的。',
    blurbEn: 'Everyone here calls it Sumasui. In the curved tunnel the rays slide past overhead and the whole passage goes blue.',
    mapScene: 'suma_aquarium',
    timeSlots: ['morning', 'afternoon'],
    requiresFlag: 'map_harbor',
    lockedHintZh: '往西还有很长一段海岸线，你还没走到过。',
    lockedHintEn: 'The coast runs a long way west. You have not been that far yet.',
    regulars: [CharacterId.REI, CharacterId.NAO],
    ambientZh: [
      '隧道里没有别人。鳐鱼从头顶滑过去的时候，影子在地上走了一遍。',
      '你在水母那一缸前面站了很久。旁边的说明牌写着它们没有心脏也没有脑子，就这么活了六亿年。',
      '出口的纪念品店在放一段循环的海豚广播。你听懂了其中三个词，这比上个月多了两个。'
    ],
    ambientEn: [
      'There is nobody else in the tunnel. A ray goes over and its shadow crosses the floor.',
      'You stand a long time at the jellyfish tank. The card says they have neither heart nor brain and have been managing for six hundred million years.',
      'The gift shop is looping a recorded dolphin announcement. You catch three words of it, which is two more than last month.'
    ]
  },
  {
    // 王子公园的游园地。就在王子动物园隔壁，那座摩天轮从战后开到现在，
    // 神户人管它叫「動物園の観覧車」——它比动物园本身还老一点。
    id: 'oji_amusement_park', district: 'sannomiya',
    nameJp: '王子公園 遊園地', reading: 'おうじこうえん ゆうえんち',
    nameZh: '王子公园 游园地', nameEn: 'Oji Park Fairground',
    blurbZh: '动物园里那一小块游乐场。设施都很旧，票要单买，一次两百日元。摩天轮转一圈能看见整片灘区。',
    blurbEn: 'The little fairground inside the zoo. Everything is old, tickets are bought one ride at a time, two hundred yen each. One turn of the wheel shows you the whole of Nada.',
    mapScene: 'oji_amusement_park',
    timeSlots: ['morning', 'afternoon'],
    requiresFlag: 'day1_done',
    regulars: [CharacterId.HIKARI, CharacterId.MAKI],
    ambientZh: [
      '旋转木马在空转，没有人坐。音乐是一段很旧的曲子，你觉得在哪儿听过。',
      '摩天轮的售票窗口贴着一张纸：「風が強い日は止めます」。今天风不大。',
      '你买了一张票，一个人坐了一圈。从最高点能看见海，还能看见学校那片屋顶。'
    ],
    ambientEn: [
      'The carousel is turning with nobody on it. The music is something old that you feel you have heard before.',
      'A sheet of paper on the ticket window says they stop the wheel on windy days. Today is not windy.',
      'You buy one ticket and ride it alone. From the top you can see the sea, and the roofs of the school.'
    ]
  },
  {
    // 滩温泉在市区里（介绍第一句就是这么写的），却被归在 far 区、
    // 花两格时间——那是有马温泉的定价，不是它的。
    // 而且它是这套系统里唯一一个"泡完还能再干一件事"的地方：
    // 花一格，回二十五点体力。放在 far 区花两格的话，
    // 泡完当天就没时间了，回的那点体力等于白回。
    id: 'nada_onsen', district: 'sannomiya',
    timeSlots: ['afternoon', 'night'],
    timeCost: 1,
    nameJp: '灘温泉', reading: 'なだおんせん',
    nameZh: '滩温泉', nameEn: 'Nada Onsen',
    blurbZh: '市区里的天然温泉，从地底下打上来的。四百四十日元，本地老头能在里面泡掉一整个下午。',
    blurbEn: 'A natural hot spring inside the city, pumped up from underground. Four hundred and forty yen, and the local old men spend a whole afternoon in it.',
    mapScene: 'nada_onsen_exterior',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    ambientZh: ['你在冷水池和热水池之间来回了四趟。出来的时候感觉自己被重装了一遍。'],
    ambientEn: ['You go between the cold bath and the hot one four times. You come out feeling reinstalled.']
  },

  // ======================= 远出 =======================
  {
    id: 'rokko_night', district: 'far',
    nameJp: '六甲山', reading: 'ろっこうさん',
    nameZh: '六甲山', nameEn: 'Mount Rokko',
    blurbZh: '缆车上去二十分钟。日本三大夜景之一，据说值一千万美元。',
    blurbEn: 'Twenty minutes up by cable car. One of the three great night views of Japan, allegedly worth ten million dollars.',
    extraScenes: ['kikuseidai_night', 'rokko_kikuseidai_pavilion'],
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['night'],
    ambientZh: ['山上比市区冷了将近十度。你后悔没带外套，但没有下山。'],
    ambientEn: ['It is nearly ten degrees colder up here. You regret not bringing a coat, and you do not go back down.']
  },
  {
    id: 'arima_onsen', district: 'far',
    nameJp: '有馬温泉', reading: 'ありまおんせん',
    nameZh: '有马温泉', nameEn: 'Arima Onsen',
    blurbZh: '翻过六甲山就是。日本最古老的温泉之一，水是铁锈色的，叫「金泉」。',
    blurbEn: 'Just over Mount Rokko. One of the oldest hot springs in Japan; the water is rust-coloured and called the golden spring.',
    extraScenes: ['arima_snow_street'],
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['afternoon'],
    ambientZh: ['你泡了脚汤。旁边的老人问你从哪儿来，然后花了十分钟说明自己也不是本地人。'],
    ambientEn: ['You use the public foot bath. An old man asks where you are from, then spends ten minutes explaining that he is not local either.']
  },
  {
    id: 'koshien', district: 'far',
    nameJp: '甲子園球場', reading: 'こうしえんきゅうじょう',
    nameZh: '甲子园球场', nameEn: 'Koshien Stadium',
    blurbZh: '往大阪方向坐三十分钟。外墙爬满常春藤。夏天这里会决定一批人的一生。',
    blurbEn: 'Thirty minutes toward Osaka. Ivy up the outer wall. In summer this place decides the rest of certain people’s lives.',
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['afternoon', 'night'],
    regulars: [CharacterId.SORA],
    ambientZh: ['没有比赛的日子，球场安静得不像话。你隔着铁网看了很久那片土。'],
    ambientEn: ['On a day with no game the stadium is unreasonably quiet. You look at the dirt through the mesh for a long time.']
  },
  {
    id: 'dotonbori', district: 'far',
    nameJp: '道頓堀', reading: 'どうとんぼり',
    nameZh: '道顿堀', nameEn: 'Dotonbori',
    blurbZh: '大阪。招牌比楼还大，声音比招牌还大。神户人来了会小声说「果然是大阪」。',
    blurbEn: 'Osaka. The signs are bigger than the buildings and the noise is bigger than the signs. Kobe people come here and mutter that it is very Osaka.',
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    regulars: [CharacterId.MAKI],
    timeSlots: ['afternoon', 'night'],
    ambientZh: ['你在桥上被三拨人分别请求帮忙拍照。第三拨你已经很熟练了。'],
    ambientEn: ['Three separate groups ask you to take their photo on the bridge. By the third you have got quite good at it.']
  },
  {
    id: 'kyoto_torii', district: 'far',
    nameJp: '伏見稲荷大社', reading: 'ふしみいなりたいしゃ',
    nameZh: '伏见稻荷大社', nameEn: 'Fushimi Inari Taisha',
    blurbZh: '京都。一万座鸟居顺着山一路排上去，走到顶要两个小时。全日本稻荷神社的总本宫。',
    blurbEn: 'Kyoto. Ten thousand torii marching up the mountain; two hours to the top. Head shrine of every Inari shrine in Japan.',
    mapScene: 'inari_torii_day',
    nightScene: 'inari_torii_night',
    extraScenes: ['inari_sando', 'inari_torii_day'],
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['morning', 'afternoon'],
    regulars: [CharacterId.INARI],
    ambientZh: ['走到半山腰人就少了。鸟居之间漏下来的光一段一段的，像有人在给你打拍子。'],
    ambientEn: ['Halfway up, the crowd thins. Light falls between the torii in regular slices, as if something is keeping time for you.']
  },
  {
    id: 'kiyomizu_stage', district: 'far',
    nameJp: '清水寺', reading: 'きよみずでら',
    nameZh: '清水寺', nameEn: 'Kiyomizu-dera',
    blurbZh: '京都。悬空的木舞台一根钉子都没用。「清水の舞台から飛び降りる」这句话就是从这儿来的。',
    blurbEn: 'Kyoto. The suspended wooden stage uses not a single nail. The idiom about leaping from the Kiyomizu stage comes from right here.',
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['morning', 'afternoon'],
    ambientZh: ['你排队接了音羽瀑布的水。三道里选一道，你选了中间那道，事后才知道是姻缘。'],
    ambientEn: ['You queue for the Otowa waterfall. Three streams, and you take the middle one. Only afterwards do you learn that is the one for love.']
  },
  {
    id: 'himeji_castle', district: 'far',
    timeCost: 2,
    nameJp: '姫路城', reading: 'ひめじじょう',
    nameZh: '姬路城', nameEn: 'Himeji Castle',
    blurbZh: '兵库县西部的国宝世界遗产「白鹭城」。纯白的天守阁在春日樱花掩映下如同展翅欲飞的白鹭，从神户坐新快速四十分钟直达。',
    blurbEn: 'Hyogo’s treasure and World Heritage "White Heron Castle". The pure white keep rises through cherry blossoms like a heron in flight.',
    mapScene: 'himeji_castle_spring',
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['morning', 'afternoon'],
    regulars: [CharacterId.ASUKA, CharacterId.REI],
    ambientZh: [
      '护城河的水面倒映着白色的城堞与飘落的樱花。微风拂过，水面漾起一圈圈粉色的涟漪。',
      '你在天守阁石阶前站着向上仰望，白灰泥墙壁在蔚蓝晴空下白得近乎透明。'
    ],
    ambientEn: [
      'The moat reflects white battlements and drifting cherry petals. A breeze ripples the water in concentric pink circles.',
      'You look up before the stone stairs of the keep; the white plaster walls gleam nearly translucent against the azure sky.'
    ]
  },
  {
    id: 'akashi_bridge', district: 'far',
    timeCost: 2,
    nameJp: '明石海峡大橋', reading: 'あかしかいきょうおおはし',
    nameZh: '明石海峡大桥', nameEn: 'Akashi Kaikyo Bridge',
    blurbZh: '舞子海滨公园眺望的巨大吊桥。连结神户与淡路岛的海上奇迹，钢缆在碧蓝海天之间划出巨大的弧线，海风中带着松针与潮水的味道。',
    blurbEn: 'The colossal suspension bridge viewed from Maiko park, linking Kobe to Awaji Island across glittering blue waters.',
    mapScene: 'akashi_bridge',
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['morning', 'afternoon'],
    regulars: [CharacterId.SORA, CharacterId.NAO],
    ambientZh: [
      '白色的货轮从大桥下方缓缓穿过。巨大的桥墩在海浪冲刷中巍然不动，海潮声回荡在松林间。',
      '海风迎面吹来，吹乱了你的头发。你在岸边坐下，看着对岸淡路岛青翠的山峦轮廓。'
    ],
    ambientEn: [
      'A white freighter glides smoothly beneath the bridge spans, waves crashing gently against the colossal pier.',
      'The sea wind sweeps in, tossing your hair. You sit at the seawall and watch the green ridgeline of Awaji Island across the water.'
    ]
  },
  {
    id: 'awaji_hanasajiki', district: 'far',
    timeCost: 2,
    nameJp: 'あわじ花さじき', reading: 'あわじはなさじき',
    nameZh: '淡路花手敷', nameEn: 'Awaji Hanasajiki',
    blurbZh: '淡路岛北部向着大阪湾缓缓倾斜的高原花丘。漫山遍野的金黄与粉彩花毯一直延伸到湛蓝的海边，海风中全是花香。',
    blurbEn: 'Awaji Island’s rolling hillside garden sloping down to Osaka Bay, blanketed in golden and pastel blossoms under expansive skies.',
    mapScene: 'awaji_hanasajiki',
    requiresFlag: 'map_far',
    lockedHintZh: '要出这一带，你得先习惯这里的电车。',
    lockedHintEn: 'To get out of this district you first have to get used to the trains here.',
    timeSlots: ['morning', 'afternoon'],
    regulars: [CharacterId.HIKARI, CharacterId.MIYUKI],
    ambientZh: [
      '木制步道在漫山遍野的金黄花海中蜿蜒延伸。海风吹过花浪，远方的海面上白色的帆船像小点一样移动。',
      '你在木栈道的长椅上坐下。阳光暖洋洋的，四周除了蜜蜂的振翅声与微风，安静得像梦境一样。'
    ],
    ambientEn: [
      'A wooden boardwalk winds through ocean-facing flower fields. The sea wind ripples the blossoms as distant sailboats drift like white specks.',
      'You rest on a bench along the boardwalk. The sunshine is warm, and save for honeybees and the breeze, it is as serene as a dream.'
    ]
  }
];

export const DISTRICT_LABELS: Record<string, { zh: string; en: string; jp: string }> = {
  school:    { zh: '港見高校',    en: 'Minatomi High',   jp: '学校' },
  kitano:    { zh: '北野 · 山手', en: 'Kitano Hillside', jp: '北野' },
  sannomiya: { zh: '三宫',        en: 'Sannomiya',       jp: '三宮' },
  harbor:    { zh: '海边',        en: 'The Waterfront',  jp: '港' },
  far:       { zh: '远出',        en: 'Further Afield',  jp: '遠出' }
};

export const DISTRICT_ORDER = ['school', 'kitano', 'sannomiya', 'harbor', 'far'] as const;

export const findLocation = (id: string): MapLocation | undefined =>
  MAP_LOCATIONS.find(l => l.id === id);
