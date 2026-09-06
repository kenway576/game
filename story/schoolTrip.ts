import { CharacterId, StoryNode } from '../types';

// ==========================================================
// ✈️ 修学旅行
//
// 【真实设定】
// 兵库县的公立高中，修学旅行是二年级的事，多半在秋天，三泊四日。
// 神户这边最经典的目的地是冲绳——飞两小时，出发那天早上五点半集合。
// 所以时间定在十一月中旬的星期二到星期五，四天，占掉日历上真的四天。
//
// 【为什么它值得单独做一套】
// 这个游戏的所有内容都是"放学后两格时间"。修学旅行是唯一一次
// **连续四天和所有人待在一起**，而且没有回家这个选项。
// 它不该被塞进一次出门里演完。
//
// 所以它是四段，一天一段，中间会真的过夜。第二天早上醒来还在冲绳。
//
// 【写法】
// 修学旅行的经典桥段——分组、自由行动、夜里聊天、回程——一个不少，
// 但每一段只写**主角作为一个外国人**在其中的位置：
// 他是唯一一个没有小学同学在这条线上的人，
// 也是唯一一个知道自己明年不在这儿的人。
//
// 不点名任何一个女主角当主角。谁在场由 metChars 决定，
// 剧本用 branch 分叉——这条规矩和年末结算是一样的。
// ==========================================================

const A = '/images/characters/asuka/';
const H = '/images/characters/hikari/';
const R = '/images/characters/rei/';
const S = '/images/characters/sora/';
const M = '/images/characters/maki/';
const N = '/images/characters/nao/';

export interface TripDayDef {
  id: string;
  n: number;
  titleZh: string; titleEn: string;
  script: StoryNode[];
}

// ==========================================================
// 第一天 · 五点半的校门
// ==========================================================
const DAY1: StoryNode[] = [
  {
    // 十一月十四号早上五点半，天还没亮。校门口那张背景是樱花，
    // 那是四月的图；站内那张是白天且满是人。用三宫的夜路：有路灯，天没亮，一百二十个人站得下。
    type: 'scene', scene: 'ikuta_road_night', bgm: 'town',
    titleZh: '修学旅行 · 第一天', titleEn: 'School Trip · Day One',
    subtitleZh: '十一月十六日 · 五点三十分 集合', subtitleEn: '16 November · assembly at 5:30'
  },
  {
    type: 'narration',
    zh: '五点半的三宫站前还是黑的。路灯下站着一百二十个人，没有一个人说话超过三个字。',
    en: 'It is still dark in front of Sannomiya station at half five. A hundred and twenty people under the streetlights, nobody saying more than three words at a time.'
  },
  {
    type: 'narration',
    zh: '你昨晚只睡了三个小时。行李箱是深雪借你的，轮子有一个不太转，在坡上一路响。',
    en: 'You got three hours. The suitcase is one Miyuki lent you and one of its wheels does not turn properly. It made a noise the whole way down the hill.'
  },
  {
    type: 'narration',
    zh: '点名。老师念到你的名字时念得比平时慢，四个音都念对了。你说了「はい」。',
    en: 'Roll call. The teacher slows down at your name and gets all four syllables right. You say yes.'
  },
  {
    type: 'scene', scene: 'trip_plane_cabin', bgm: 'chat',
    titleZh: '关西机场 → 那霸', titleEn: 'Kansai → Naha'
  },
  {
    type: 'narration',
    zh: '飞行耗时两个多小时。你靠窗而坐，机翼穿行在层层白云间，舷窗右侧一路都是浩瀚无垠的蔚蓝大海。',
    en: 'The flight takes a little over two hours. Sitting by the window, the wing cuts through tiers of white cloud, the entire view to the right an endless expanse of blue ocean.'
  },
  {
    type: 'narration',
    zh: '起飞之后半小时全机舱都睡了。你没睡——你在数自己这一年坐过几次飞机。答案是两次，都是单程。',
    en: 'Half an hour in, the whole cabin is asleep. You are not. You are counting the flights you have taken this year. The answer is two, both one-way.'
  },
  {
    type: 'branch', ifFlag: 'day1_met_hikari',
    then: [
      {
        type: 'narration', characterImage: `${H}school_neutral.webp`,
        zh: '光从后面两排探过头来，问你能不能换座位——她那边看不见海。你们换了。她坐下之后一句话都没说，一直看着窗外。',
        en: 'Hikari leans through from two rows back and asks to swap: she cannot see the sea from hers. You swap. Once she sits down she does not say anything at all, just looks out.'
      },
      {
        type: 'narration',
        zh: '飞到一半她忽然说：「这个方向，是不是离你家更远了。」你想了想，说是。',
        en: 'Halfway she says, out of nowhere: "This direction. Does it take you further from home?" You think about it and say yes.'
      }
    ],
    otherwise: [
      {
        type: 'narration',
        zh: '邻座是一个你叫不出名字的男生。他整程都在看一本参考书，下飞机的时候跟你说了句「おつかれ」。',
        en: 'Your neighbour is a boy whose name you do not know. He reads a study guide the whole way and says "well done" to you as you get off.'
      }
    ]
  },
  {
    type: 'scene', scene: 'trip_shuri_castle', bgm: 'town',
    titleZh: '首里城', titleEn: 'Shuri Castle'
  },
  {
    type: 'narration',
    zh: '十一月的冲绳二十六度。全班在停车场脱外套，脱下来又没地方放，只好全部搭在手臂上。',
    en: 'Twenty-six degrees in Okinawa in November. The whole class takes its coats off in the car park and then has nowhere to put them, so everybody carries them over one arm.'
  },
  {
    type: 'narration',
    zh: '石墙是弯的。你在日本见过的城墙都是直角的，这里的每一段都在弧上。',
    en: 'The walls curve. Every castle wall you have seen in Japan turns at right angles. Here every stretch of it is on an arc.'
  },
  {
    type: 'branch', ifFlag: 'day1_met_rei',
    then: [
      {
        type: 'speech',
        speakerZh: '铃', speakerEn: 'Rei',
        characterImage: `${R}neutral.webp`,
        jp: '……ここ、日本じゃなかった時期の方が長い。',
        zh: '……这里不属于日本的那段时间，比属于的时间长。',
        en: '...This place spent longer not being Japan than being it.',
        color: 'bg-sky-600',
        words: [{ jp: '琉球', reading: 'りゅうきゅう', zh: '琉球', en: 'the Ryukyus' }]
      },
      {
        type: 'narration',
        zh: '她说完就去看解说牌了，看得比谁都久。你跟过去，发现她在拍解说牌上的年表，一张一张地拍。',
        en: 'Having said it she goes to the interpretation panel and stays at it longer than anybody. You follow and find her photographing the chronology on it, panel by panel.'
      }
    ],
    otherwise: [
      {
        type: 'narration',
        zh: '解说牌上写着这座城烧过五次，最近一次是二〇一九年。你算了一下，那时候你十三岁，在另一个国家。',
        en: 'The panel says the castle has burned five times, most recently in 2019. You work out that you were thirteen then, in another country.'
      }
    ]
  },
  {
    type: 'narration',
    zh: '正殿还围着脚手架。导游说预计二〇二六年完工。有人问「那我们看什么」，导游说「看它在盖」。',
    en: 'The main hall is still in scaffolding. The guide says 2026. Somebody asks what there is to look at, then. The guide says: it being built.'
  },
  { type: 'effect', effects: [{ stat: 'knowledge', amount: 3, reasonZh: '一座正在被重新盖起来的城', reasonEn: 'A castle in the middle of being put back' }], setFlags: ['trip_day1_done'] }
];

// ==========================================================
// 第二天 · 海
// ==========================================================
const DAY2: StoryNode[] = [
  {
    type: 'scene', scene: 'trip_okinawa_beach', bgm: 'town',
    titleZh: '修学旅行 · 第二天', titleEn: 'School Trip · Day Two',
    subtitleZh: '十一月十七日 · 自由行动', subtitleEn: '17 November · free time'
  },
  {
    type: 'narration',
    zh: '下午三小时自由行动，规定四人一组。分组的时候你站在原地没动，因为你不知道该往哪边走。',
    en: 'Three hours of free time in the afternoon, in groups of four. When the groups form you stay where you are, because you do not know which way to move.'
  },
  {
    type: 'narration',
    zh: '然后有人从背后把你往一个方向推了两步。',
    en: 'Then somebody puts a hand on your back and pushes you two steps in a direction.'
  },
  {
    type: 'branch', ifFlag: 'day1_met_sora',
    then: [
      {
        type: 'speech',
        speakerZh: '昴', speakerEn: 'Sora',
        characterImage: `${S}school_happy.webp`,
        jp: 'なに突っ立ってんねん。四人目、あんたな。',
        zh: '站那儿干嘛。第四个，你了。',
        en: 'What are you standing there for. Fourth one, you.',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '她说这话的时候已经在往海边走了，根本没等你回答。你后来发现她们那组本来就只有三个人，而且是她自己算的。',
        en: 'She is already walking towards the water as she says it and does not wait for an answer. You work out later that her group had three, and that she was the one counting.'
      }
    ],
    otherwise: [
      {
        type: 'narration',
        zh: '推你的是班长。她一句话也没说，把你塞进了一个缺人的组里，然后就走了。',
        en: 'It is the class rep. She says nothing, deposits you into a group that was one short, and leaves.'
      }
    ]
  },
  {
    type: 'narration',
    zh: '海水竟然是温热的。即便已经步入十一月，冲绳的海水依旧泛着宜人的暖意，这种奇妙的南方气候让你花了片刻才慢慢适应。',
    en: 'The water is surprisingly warm. Even in November, Okinawa’s sea carries a gentle warmth, a subtropical contrast that takes a moment to sink in.'
  },
  {
    type: 'narration',
    zh: '踩着细软白沙往浅海深处淌去，清澈的海水依然只漫过膝盖。低头便能清晰看见水底的脚趾，以及绕着脚踝打转、毫不怕生的小热带鱼。',
    en: 'Wading outward over soft white sand, the clear water still reaches only knee-height. Looking down, you see your toes clearly and a fearless little tropical fish circling your ankles.'
  },
  {
    type: 'choice',
    promptZh: '有人在岸上喊你的名字，喊了两遍。',
    promptEn: 'Somebody on the beach calls your name. Twice.',
    options: [
      {
        id: 'trip_wave',
        labelZh: '举起手挥回去',
        labelEn: 'Put a hand up and wave back',
        hintZh: '喊的人在等你回应', hintEn: 'Whoever it is, is waiting.',
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你没有假装没听见', reasonEn: 'You did not pretend not to hear' }],
        setFlags: ['trip_waved_back'],
        then: [
          {
            type: 'narration',
            zh: '岸上那个人也挥了。然后旁边又有两个人跟着挥，虽然他们根本不知道在挥什么。',
            en: 'The person on the beach waves back. Then two more beside them wave as well, without having any idea what they are waving at.'
          },
          {
            type: 'narration',
            zh: '你站在及膝的水里，朝一群不知道谁是谁的人挥手。这一年里你第一次觉得，站在哪儿都可以。',
            en: 'You stand in knee-deep water waving at a group of people you cannot individually identify. For the first time this year it occurs to you that it does not much matter where you stand.'
          }
        ]
      },
      {
        id: 'trip_walk_back',
        labelZh: '往回走',
        labelEn: 'Walk back in',
        hintZh: '走回去比挥手远，但也更实在', hintEn: 'Further than waving, and more definite.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '喊你的人不用再喊第三遍', reasonEn: 'Whoever it was did not have to call a third time' }],
        setFlags: ['trip_walked_back'],
        then: [
          {
            type: 'narration',
            zh: '你哗啦哗啦涉水淌回沙滩，浸湿的裤腿紧贴在大腿上沉甸甸的。走到跟前时，那个人正低头摆弄着手机，抬头见到你才猛地想起来刚才是自己喊的。',
            en: 'You splash your way back to the beach, wet trousers clinging heavy to your legs. By the time you arrive, the caller is on their phone and only remembers calling when looking up.'
          },
          {
            type: 'narration',
            zh: '「あ、来たんや。」她说。你说你来了。',
            en: '"Oh. You came." You say that you came.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '太阳落得比神户早。五点半天就红了，云的下面全是金的。全班在沙滩上排成一排看，没有人拍照。',
    en: 'The sun goes down earlier than in Kobe. The sky is red by half five and the undersides of the clouds are all gold. The whole class lines up on the sand to watch. Nobody photographs it.'
  },
  { type: 'effect', effects: [{ stat: 'charm', amount: 2, reasonZh: '整整三个小时你没有想过明年的事', reasonEn: 'Three whole hours in which you did not think about next year' }], setFlags: ['trip_day2_done'] }
];

// ==========================================================
// 第三天 · 夜里
// ==========================================================
const DAY3: StoryNode[] = [
  {
    type: 'scene', scene: 'trip_hotel_banquet', bgm: 'night',
    titleZh: '修学旅行 · 第三天', titleEn: 'School Trip · Day Three',
    subtitleZh: '十一月十六日 · 二十二时消灯', subtitleEn: '16 November · lights out at ten'
  },
  {
    type: 'narration',
    zh: '晚饭是宴会厅的定食，十人一桌。菜里有一道东西是紫色的，没有人知道那是什么，但全桌都吃完了。',
    en: 'Dinner is a set meal in the banquet room, ten to a table. One of the dishes is purple. Nobody knows what it is and the table finishes all of it.'
  },
  {
    type: 'narration',
    zh: '十点消灯。十点零四分，你房间的门被敲了。',
    en: 'Lights out at ten. At four minutes past, somebody knocks on your door.'
  },
  {
    type: 'narration',
    zh: '门外站着七个人，其中三个不是这一层的。',
    en: 'Seven people outside, three of whom are not from this floor.'
  },
  {
    type: 'narration',
    zh: '接下来两个小时发生的事，事后回想全都记不清顺序：谁带了扑克，谁把零食全倒在中间那张矮桌上，谁在走廊尽头放了哨。',
    en: 'What happens over the next two hours will not stay in order afterwards: who brought cards, who tipped every snack onto the low table in the middle, who posted a lookout at the end of the corridor.'
  },
  {
    type: 'narration',
    zh: '你只清楚地记得一件事：轮到你的时候，有人问「じゃあ、来年は？」。',
    en: 'You remember one thing clearly. When it comes round to you, somebody asks: so what about next year?'
  },
  {
    type: 'narration',
    zh: '房间里骤然陷入了难言的沉寂。不是尴尬的那种冷场，而是七个人在同一瞬间被现实击中、意识到彼此其实心知肚明却谁也不愿先点破的那种沉重静默。',
    en: 'The room suddenly falls into a profound quiet. Not an awkward lull, but that heavy silence when seven people are struck at once by reality, knowing full well yet loath to voice it.'
  },
  {
    type: 'choice',
    promptZh: '你得回答。',
    promptEn: 'You have to answer.',
    options: [
      {
        id: 'trip_next_year_honest',
        labelZh: '「三月就回去了。」',
        labelEn: '"I go back in March."',
        jp: '三月には帰る。',
        hintZh: '这是实话，而且他们已经知道了', hintEn: 'It is true, and they already know it.',
        effects: [{ stat: 'guts', amount: 4, reasonZh: '你自己把那句话说出了口', reasonEn: 'You were the one who said it out loud' }],
        setFlags: ['trip_said_march'],
        then: [
          {
            type: 'narration',
            zh: '没有人说「舍不得」，也没有人说「常联系」。有人把一包薯片推到你面前，说「じゃあ食え」。',
            en: 'Nobody says they will miss you. Nobody says to keep in touch. Somebody pushes a bag of crisps at you and says: eat, then.'
          },
          {
            type: 'narration',
            zh: '你吃了。那一包后来是你一个人吃完的，没有人跟你抢。',
            en: 'You eat. You finish that bag by yourself, and nobody competes with you for it.'
          }
        ]
      },
      {
        id: 'trip_next_year_dodge',
        labelZh: '「还没想那么远。」',
        labelEn: '"I have not thought that far."',
        jp: 'そこまで考えてへん。',
        hintZh: '你想过。你每天都在想', hintEn: 'You have. You think about it daily.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你把这一晚还给了他们', reasonEn: 'You gave them the rest of the night back' }],
        setFlags: ['trip_dodged'],
        then: [
          {
            type: 'narration',
            zh: '「そらそうやな」有人说，然后话题就过去了。扑克继续打。你输了三局。',
            en: '"Fair enough," somebody says, and the subject moves on. The cards carry on. You lose three hands.'
          },
          {
            type: 'narration',
            zh: '两点钟人散了。你躺下之后想了很久：他们其实是让你不用回答的。',
            en: 'They break up at two. Lying down afterwards you think about it for a long time. They were letting you off.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '两点十分，老师查房。所有人以一种事后被反复讨论的速度回到了自己床上。',
    en: 'At ten past two the teacher does a room check. Everybody gets back to their own bed at a speed that will be discussed for weeks.'
  },
  { type: 'effect', effects: [{ stat: 'kindness', amount: 3, reasonZh: '那两秒的安静里，没有人先移开视线', reasonEn: 'In those two seconds of quiet, nobody looked away first' }], setFlags: ['trip_day3_done'] }
];

// ==========================================================
// 第四天 · 回程
// ==========================================================
const DAY4: StoryNode[] = [
  {
    type: 'scene', scene: 'trip_plane_cabin', bgm: 'chat',
    titleZh: '修学旅行 · 第四天', titleEn: 'School Trip · Day Four',
    subtitleZh: '十一月十七日 · 那霸 → 关西', subtitleEn: '17 November · Naha → Kansai'
  },
  {
    type: 'narration',
    zh: '回程的飞机上，一百二十个人睡了一百一十个。',
    en: 'On the flight back, a hundred and ten out of a hundred and twenty are asleep.'
  },
  {
    type: 'narration',
    zh: '你也睡了。醒过来的时候窗外已经是灰的，云层很厚，底下就是十一月的关西。',
    en: 'You sleep too. When you wake the window has gone grey, the cloud is thick, and underneath it is Kansai in November.'
  },
  {
    type: 'narration',
    zh: '下降的时候有人在后面说了一句「さむ」。整个机舱笑了一下，然后就开始翻外套。',
    en: 'On the descent somebody behind you says it is cold. The cabin laughs once and then starts going through bags for coats.'
  },
  {
    type: 'branch', ifFlag: 'day1_met_asuka',
    then: [
      {
        type: 'narration', characterImage: `${A}neutral.webp`,
        zh: '过道对面的明日香在整理一叠东西：门票、收据、宾馆的房卡套、写着班级名的行李牌。她在做记录。',
        en: 'Across the aisle Asuka is squaring up a stack of things: tickets, receipts, the hotel key-card sleeve, a luggage tag with the class name on it. She is keeping a record.'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}shy.webp`,
        jp: '……別に。文集用よ。',
        zh: '……没什么。做文集用的。',
        en: '...It is nothing. For the class booklet.',
        color: 'bg-rose-600'
      },
      {
        type: 'narration',
        zh: '你没问她为什么把四张一模一样的门票都留着。',
        en: 'You do not ask why she has kept four identical tickets.'
      }
    ],
    otherwise: [
      {
        type: 'narration',
        zh: '前排有人在收东西，把门票和收据一张张夹进本子里。你摸了摸自己口袋，只有一张揉皱的登机牌。',
        en: 'Somebody in front is collecting things, sliding tickets and receipts one by one into a notebook. You check your own pocket. One creased boarding pass.'
      }
    ]
  },
  {
    type: 'scene', scene: 'kitano_slope_foot_dusk', bgm: 'night',
    titleZh: '解散', titleEn: 'Dismissed'
  },
  {
    type: 'narration',
    zh: '三宫站前解散，六点二十。所有人拖着行李箱往四个方向散开，轮子的声音在广场上响成一片。',
    en: 'Dismissed in front of Sannomiya station at twenty past six. A hundred and twenty suitcases go off in four directions and the wheels make one continuous noise across the concourse.'
  },
  {
    type: 'narration',
    zh: '你往北野走。那个不太转的轮子在坡上又开始响了，一路响到海风庄门口。',
    en: 'You walk towards Kitano. The wheel that does not turn properly starts up again on the slope and keeps going all the way to the door of Umikaze-so.'
  },
  {
    type: 'narration',
    zh: '开门的时候你有一个非常短的念头：你是回来了，不是到了。',
    en: 'Putting the key in, you have a very brief thought: you have come back, not arrived.'
  },
  {
    type: 'narration',
    zh: '这个念头你没有多想。你把行李箱推进去，倒在床上，睡到第二天中午。',
    en: 'You do not pursue the thought. You push the suitcase inside, fall onto the bed, and sleep until midday.'
  },
  {
    type: 'effect',
    effects: [
      { stat: 'kindness', amount: 2, reasonZh: '四天里你一次都没被落下', reasonEn: 'Four days and not once were you left behind' },
      { stat: 'guts', amount: 2, reasonZh: '「回来了」这个说法是你自己冒出来的', reasonEn: 'The word "back" was one you produced yourself' }
    ],
    setFlags: ['trip_day4_done', 'school_trip_done']
  }
];

// ==========================================================
// 四天
//
// 日期写死在十一月十四到十七（火～金）。到那天早上，大厅不问"今天怎么过"，
// 直接就是修学旅行——这四天玩家没有别的选择，
// 这本来就是修学旅行的样子。
// ==========================================================
export const SCHOOL_TRIP: TripDayDef[] = [
  { id: 'trip_day1', n: 1, titleZh: '五点半的站前', titleEn: 'The Station at Half Five', script: DAY1 },
  { id: 'trip_day2', n: 2, titleZh: '十一月的海',   titleEn: 'The Sea in November',  script: DAY2 },
  { id: 'trip_day3', n: 3, titleZh: '十点零四分',   titleEn: 'Four Minutes Past Ten', script: DAY3 },
  { id: 'trip_day4', n: 4, titleZh: '回来了',       titleEn: 'Back',                 script: DAY4 }
];

// 火曜日出发，金曜日回来。修学旅行不会横跨周末——
// 学校不会拿两个休息日去抵四天行程，家长也不答应。
// 这一年的 11/14 正好是星期二。
export const TRIP_DATES: [number, number][] = [[11, 14], [11, 15], [11, 16], [11, 17]];

// 今天是修学旅行的第几天（1-4）。不在里面返回 0。
export const tripDayOn = (month: number, day: number): number => {
  const i = TRIP_DATES.findIndex(([m, d]) => m === month && d === day);
  return i < 0 ? 0 : i + 1;
};
