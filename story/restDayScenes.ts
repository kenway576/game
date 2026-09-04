import { StoryNode, CharacterId, GameCalendar } from '../types';

// ---------------------------------------------------------
// 🏖️ 休息日的内容
//
// 「今天不上学」以前只意味着学校关门。这个文件补的是另一半：
// 不上学的那一天，你到底可以拿它去干什么。
//
// 七种过法（见 data/restDayPlans.ts），各自有实际内容：
//   在家待一天（四季各一段）· 用功 · 打工 · 大扫除
//   社团活动（四个部，各挂一个人）
//   郊游（四季各一次，每次两个人；八个人正好各出场一次）
//
// 写法上和放学后小剧情一样，但重心不同：
// 放学后小剧情写的是"她一个人的时候是什么样"；
// 休息日写的是"没有课表的那一天，人会露出什么"。
// ---------------------------------------------------------

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export const seasonOf = (cal: GameCalendar): Season => {
  const m = cal.month;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
};

const SORA = '/images/characters/sora/';
const REI = '/images/characters/rei/';
const ASUKA = '/images/characters/asuka/';
const MAKI = '/images/characters/maki/';
const HIKARI = '/images/characters/hikari/';
const NAO = '/images/characters/nao/';
const MIYUKI = '/images/characters/miyuki/';
const INARI = '/images/characters/inari/';

// ==========================================================
// 🏠 在家待一天
//
// 这四段里没有别人。这是故意的：一整天不出门、不跟任何人说话，
// 是一种很具体的休息，而这个游戏其他任何时候都不给你这个。
// 唯一的外界是手机震一下——你可以不看。
// ==========================================================

const HOME_SPRING: StoryNode[] = [
  { type: 'scene', scene: 'apartment_balcony', bgm: 'lobby', titleZh: '什么都不干的一天', titleEn: 'A Day of Nothing', subtitleZh: '春 · 海风庄 202', subtitleEn: 'Spring · Umikaze-so 202' },
  { type: 'narration', zh: '你九点半醒的。没有闹钟，是外面晾衣杆被风吹得当当响把你吵醒的。', en: 'You wake at half nine. No alarm; the washing pole clanging outside did it.' },
  { type: 'narration', zh: '阳台朝东。这个时间太阳正好翻过对面那栋楼，把整个房间照成一片很旧的黄色。', en: 'The balcony faces east. At this hour the sun clears the block opposite and turns the whole room an old shade of yellow.' },
  { type: 'narration', zh: '你把被子搬出去晒。这是你来神户之后学会的第一件家务，深雪教的：不是搭上去，是要拍。', en: 'You take the futon out. It was the first bit of housekeeping you learned here — Miyuki taught you that you do not just drape it, you beat it.' },
  {
    type: 'choice',
    promptZh: '上午还剩三个小时。你什么都不用做。',
    promptEn: 'Three hours of morning left. You are not required to do anything.',
    options: [
      {
        id: 'home_spring_sit', labelZh: '就坐在阳台上', labelEn: 'Just sit on the balcony',
        hintZh: '什么都不干，是需要练习的',
        hintEn: 'Doing nothing takes practice.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你允许自己浪费了一个上午', reasonEn: 'You allowed yourself to waste a morning' }],
        then: [
          { type: 'narration', zh: '你搬了张椅子出去，坐着。楼下有人在洗车，收音机开着关西腔的谈话节目。', en: 'You take a chair out and sit. Somebody downstairs is washing a car with a Kansai chat show on the radio.' },
          { type: 'narration', zh: '你听了大概四十分钟。听懂了大概三成。你发现自己不着急了——这在两个月前是不可能的。', en: 'You listen for about forty minutes and follow maybe a third of it. You notice you are not anxious about that. Two months ago you would have been.' }
        ]
      },
      {
        id: 'home_spring_cook', labelZh: '认真给自己做一顿饭', labelEn: 'Cook yourself a proper meal',
        hintZh: '一个人吃饭也可以摆盘',
        hintEn: 'Eating alone is still allowed to look like something.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '你给自己认真做了一顿', reasonEn: 'You cooked for yourself properly' },
          { stat: 'proficiency', amount: 2, reasonZh: '第一次没把味噌煮开', reasonEn: 'First time you did not boil the miso' }
        ],
        setFlags: ['restday_cooked_alone'],
        then: [
          { type: 'narration', zh: '味噌汤、煎蛋、昨天剩的米饭。你按深雪说的，味噌是关火之后才化开的。', en: 'Miso soup, a fried egg, yesterday\'s rice. You melt the miso in off the heat, the way Miyuki said.' },
          { type: 'narration', zh: '你摆好了才吃。一个人吃饭没有必要摆盘，但你摆了。', en: 'You lay it out before eating. There is no need to when nobody is watching. You do it anyway.' }
        ]
      },
      {
        id: 'home_spring_journal', labelZh: '翻祖父的那本日记', labelEn: 'Open your grandfather\'s journal',
        hintZh: '你已经很久没翻了',
        hintEn: 'It has been a while.',
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '一九六几年的神户，用手写的', reasonEn: 'Kobe in the sixties, in longhand' }],
        setFlags: ['restday_read_journal'],
        then: [
          { type: 'scene', scene: 'grandfather_journal' },
          { type: 'narration', zh: '有一页写的是他第一个不上班的星期天。他写：「一日中なにもせず。悪くない。」', en: 'One page is his first Sunday off work. He wrote: did nothing all day. Not bad.' },
          { type: 'narration', zh: '底下他自己又补了一句，字迹小一点：「これを覚えておくこと。」', en: 'Underneath, in smaller writing, he added: remember this.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '下午你睡了一觉。醒来天已经斜了，被子晒得发烫，有太阳的味道。', en: 'You nap in the afternoon. When you wake the light has gone slanted and the futon is hot and smells of sun.' },
  {
    type: 'effect', setFlags: ['restday_home_done'],
    effects: [{ stat: 'guts', amount: 1, reasonZh: '你什么都没做，而且不觉得亏', reasonEn: 'You did nothing, and did not feel you had lost anything' }]
  }
];

const HOME_SUMMER: StoryNode[] = [
  { type: 'scene', scene: 'apartment_room', bgm: 'lobby', titleZh: '三十四度', titleEn: 'Thirty-Four Degrees', subtitleZh: '夏 · 海风庄 202', subtitleEn: 'Summer · Umikaze-so 202' },
  { type: 'narration', zh: '空调是二十年前的机型。开到最低，出来的风只能说是"不热"。', en: 'The air conditioner is twenty years old. On its lowest setting the air it produces can only be described as "not hot".' },
  { type: 'narration', zh: '你把凉席铺在地板上，趴着。蝉在外面叫，叫得像是有人把音量旋钮拧断了。', en: 'You spread the reed mat on the floor and lie on it. The cicadas outside sound like somebody snapped the volume knob off.' },
  {
    type: 'choice',
    promptZh: '冰箱里有一壶麦茶。以外什么都没有。',
    promptEn: 'There is a jug of barley tea in the fridge and nothing else.',
    options: [
      {
        id: 'home_summer_ice', labelZh: '去便利店买冰', labelEn: 'Go to the convenience store for ice',
        hintZh: '来回七分钟，会热死',
        hintEn: 'Seven minutes there and back. It will nearly kill you.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你在下午两点出了门', reasonEn: 'You went outside at two in the afternoon' }],
        then: [
          { type: 'scene', scene: 'convenience_store_exterior' },
          { type: 'narration', zh: '柏油路面在冒烟。自动门开的那一下，冷气扑到脸上，你在门口站了整整十秒没动。', en: 'The tarmac is smoking. When the automatic door opens the cold hits your face and you stand there for a full ten seconds.' },
          { type: 'narration', zh: '你买了冰、一根汽水棒冰，还有一瓶不需要的乌龙茶——因为不想那么快出去。', en: 'You buy ice, a soda lolly, and a bottle of oolong you do not need, because you do not want to leave yet.' }
        ]
      },
      {
        id: 'home_summer_study', labelZh: '趴着背单词', labelEn: 'Lie there and do vocabulary',
        hintZh: '太热了，脑子转得很慢',
        hintEn: 'Too hot. Your brain runs at half speed.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '在三十四度里背下来的词，忘得慢', reasonEn: 'Words learned at thirty-four degrees stick better' }],
        then: [
          { type: 'narration', zh: '你背了二十个词，忘了十五个，剩下五个大概能记一辈子——因为它们是和这个温度一起记住的。', en: 'You learn twenty words, forget fifteen, and the remaining five you will probably keep for life, because they went in attached to this temperature.' }
        ]
      },
      {
        id: 'home_summer_nothing', labelZh: '什么都不干，就趴着', labelEn: 'Nothing. Just lie there.',
        hintZh: '夏天本来就该这么过',
        hintEn: 'This is what summer is for.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有跟这个夏天较劲', reasonEn: 'You did not fight the summer' }],
        then: [
          { type: 'narration', zh: '你趴了两个小时。中间睡着了一次，梦见自己在冬天，冷得发抖，然后被热醒。', en: 'Two hours. You fall asleep once and dream it is winter and you are shivering, then wake up because of the heat.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '傍晚起了一点风。你把窗全部打开，凉席上的席纹印在胳膊上，很久才消。', en: 'A little wind comes up in the evening. You open every window. The mat has left its weave on your arm and it takes a long time to fade.' },
  { type: 'narration', zh: '手机震了一下。你没看。晚一点再看也一样。', en: 'Your phone buzzes. You do not look. It will say the same thing later.' },
  {
    type: 'effect', setFlags: ['restday_home_done'],
    effects: [{ stat: 'guts', amount: 1, reasonZh: '你在神户过了一个真正的夏天', reasonEn: 'You had an actual Kobe summer' }]
  }
];

const HOME_AUTUMN: StoryNode[] = [
  { type: 'scene', scene: 'apartment_room', bgm: 'lobby', titleZh: '换季', titleEn: 'Changing Over', subtitleZh: '秋 · 海风庄 202', subtitleEn: 'Autumn · Umikaze-so 202' },
  { type: 'narration', zh: '早上你是被冷醒的。这是今年第一次。', en: 'You wake up cold. First time this year.' },
  { type: 'narration', zh: '衣柜最上面那格里有一床更厚的被子，你搬来的时候没动过。今天该动了。', en: 'There is a heavier futon on the top shelf of the wardrobe that you have not touched since you moved in. Today is the day.' },
  {
    type: 'choice',
    promptZh: '搬下来的时候，从被子里掉出来一个纸袋。',
    promptEn: 'A paper bag falls out of it as you pull it down.',
    options: [
      {
        id: 'home_autumn_bag', labelZh: '打开看', labelEn: 'Open it',
        hintZh: '不是你的',
        hintEn: 'It is not yours.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '这间房子在你之前有过人', reasonEn: 'Somebody lived in this room before you' }],
        setFlags: ['restday_found_bag'],
        then: [
          { type: 'narration', zh: '里面是一叠电车票。全是同一条线，同一个区间，日期从三月排到七月，一天一张。', en: 'A stack of train tickets. Same line, same section, dated one per day from March to July.' },
          { type: 'narration', zh: '七月之后没有了。你把它们按原样叠好，放回原处。', en: 'Nothing after July. You square them back up and put them back where they were.' },
          { type: 'narration', zh: '房东说过这间房子空了两年。他没说上一个人为什么走。', en: 'The landlord said this room had been empty two years. He did not say why the last tenant left.' }
        ]
      },
      {
        id: 'home_autumn_clean', labelZh: '不看，先把屋子收拾了', labelEn: 'Leave it. Clean the flat instead.',
        hintZh: '换季那天大扫除，是这儿的习惯',
        hintEn: 'Cleaning on the day you change the bedding is how it is done here.',
        effects: [
          { stat: 'kindness', amount: 2, reasonZh: '你把这个屋子当自己的了', reasonEn: 'You started treating the flat as yours' },
          { stat: 'proficiency', amount: 1, reasonZh: '你学会了怎么正确地叠被子', reasonEn: 'You learned to fold a futon properly' }
        ],
        then: [
          { type: 'narration', zh: '你擦了窗、拖了地、把夏天的东西全收进衣柜。四个小时。', en: 'Windows, floor, everything summer packed into the wardrobe. Four hours.' },
          { type: 'narration', zh: '收完之后屋子看起来小了一点，也暖了一点。', en: 'Afterwards the flat looks slightly smaller, and slightly warmer.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '下午三点你去阳台收被子。风里已经有那种要冷的味道了——干的、脆的、带一点烟。', en: 'You bring the futon in at three. There is a getting-cold smell in the air now: dry, brittle, faintly smoky.' },
  { type: 'narration', zh: '晚上你睡在厚被子里，第一次觉得这个房间像个家。', en: 'You sleep under the heavy futon, and for the first time the room feels like somewhere you live.' },
  {
    type: 'effect', setFlags: ['restday_home_done'],
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '换季这件事你自己做完了', reasonEn: 'You changed the season over on your own' }]
  }
];

const HOME_WINTER: StoryNode[] = [
  { type: 'scene', scene: 'apartment_room', bgm: 'lobby', titleZh: '一整天不出门', titleEn: 'Indoors, All of It', subtitleZh: '冬 · 海风庄 202', subtitleEn: 'Winter · Umikaze-so 202' },
  { type: 'narration', zh: '暖桌是深雪硬塞给你的。她说一个人过冬没有暖桌是不行的，说得像在讲一条法律。', en: 'The kotatsu was forced on you by Miyuki, who said that getting through a winter alone without one is simply not done, in the tone of somebody citing legislation.' },
  { type: 'narration', zh: '她是对的。你已经三个小时没有从桌子底下出来了。', en: 'She was right. You have not been out from under it in three hours.' },
  {
    type: 'choice',
    promptZh: '桌上有一袋橘子、一本没看完的书、和一部安静的手机。',
    promptEn: 'On the table: a bag of mandarins, an unfinished book, and a phone that is not doing anything.',
    options: [
      {
        id: 'home_winter_book', labelZh: '把那本书看完', labelEn: 'Finish the book',
        hintZh: '日文的。看得很慢',
        hintEn: 'It is in Japanese. It goes slowly.',
        effects: [{ stat: 'knowledge', amount: 4, reasonZh: '你第一次读完了一整本日文书', reasonEn: 'You finished a book in Japanese for the first time' }],
        setFlags: ['restday_finished_book'],
        then: [
          { type: 'narration', zh: '两百四十页，你查了大概一百二十个词。看完的时候外面天黑了。', en: 'Two hundred and forty pages and about a hundred and twenty dictionary lookups. It is dark outside when you finish.' },
          { type: 'narration', zh: '最后一句你没查就看懂了。你把书合上，坐了一会儿。', en: 'You understood the last sentence without looking anything up. You close the book and sit for a moment.' }
        ]
      },
      {
        id: 'home_winter_call', labelZh: '给家里打个电话', labelEn: 'Call home',
        hintZh: '时差七个小时',
        hintEn: 'Seven hours of time difference.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你主动打了那个电话', reasonEn: 'You made that call without being asked' }],
        setFlags: ['restday_called_home'],
        then: [
          { type: 'narration', zh: '接通用了很久。那边是早上，很吵。', en: 'It takes a long time to connect. It is morning over there, and loud.' },
          { type: 'narration', zh: '你说了二十分钟自己的近况，然后花了四十分钟听他们说他们的。', en: 'You give twenty minutes of your news and then spend forty listening to theirs.' },
          { type: 'narration', zh: '挂掉之后房间显得比刚才更安静。这种安静不难受，但确实是安静。', en: 'The room is quieter afterwards than it was before. Not a bad quiet. Still a quiet.' }
        ]
      },
      {
        id: 'home_winter_mikan', labelZh: '吃橘子，什么都不想', labelEn: 'Eat mandarins and think about nothing',
        hintZh: '这一袋有十二个',
        hintEn: 'There are twelve in the bag.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你一个人过了一整个冬天的下午', reasonEn: 'You got through a whole winter afternoon alone' }],
        then: [
          { type: 'narration', zh: '你吃到第七个的时候手指尖开始发黄。你数了一下皮，摆成一排。', en: 'By the seventh your fingertips are going yellow. You count the peels and line them up.' },
          { type: 'narration', zh: '外面开始下雨，很小。暖桌下面很暖。就这样过了一整个下午。', en: 'It starts to rain, lightly. It is warm under the table. That is the entire afternoon.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '你一整天没有出门，也没有跟任何人说话。你发现自己一点都不难受。', en: 'You did not go out all day and did not speak to anybody. You notice that you do not mind at all.' },
  {
    type: 'effect', setFlags: ['restday_home_done'],
    effects: [{ stat: 'guts', amount: 1, reasonZh: '一个人待着这件事，你不再怕了', reasonEn: 'Being alone stopped being something you brace for' }]
  }
];

export const HOME_DAY: Record<Season, StoryNode[]> = {
  spring: HOME_SPRING, summer: HOME_SUMMER, autumn: HOME_AUTUMN, winter: HOME_WINTER
};

// ==========================================================
// 📚 用功一整天 / 💴 打工 / 🧹 大扫除
// 三段小的。给的是数值，但不能只有数值。
// ==========================================================

export const STUDY_DAY: StoryNode[] = [
  { type: 'scene', scene: 'school_library', bgm: 'chat', titleZh: '闭馆音乐', titleEn: 'The Closing Music', subtitleZh: '休息日 · 市立图书馆', subtitleEn: 'Day off · The city library' },
  { type: 'narration', zh: '市立图书馆休息日照常开门，而且人比平日少。三楼靠窗那排桌子全空着。', en: 'The city library opens on days off and is emptier than on a weekday. The whole window row on the third floor is free.' },
  { type: 'narration', zh: '你坐下的时候是十点。你打算坐到中午。', en: 'You sit down at ten, intending to stay until noon.' },
  {
    type: 'choice',
    promptZh: '包里有三样东西：语法书、单词本、和一本你其实更想看的小说。',
    promptEn: 'Three things in your bag: the grammar book, the vocabulary notebook, and a novel you would rather be reading.',
    options: [
      {
        id: 'study_grammar', labelZh: '啃语法', labelEn: 'Grind the grammar',
        hintZh: '最难受，也最有用',
        hintEn: 'The worst of it, and the most useful.',
        effects: [{ stat: 'knowledge', amount: 5, reasonZh: '使役受身形，一个下午', reasonEn: 'Causative-passive, one whole afternoon' }, { stat: 'guts', amount: 1, reasonZh: '你没有中途换成小说', reasonEn: 'You did not switch to the novel halfway' }],
        setFlags: ['restday_grammar_day'],
        then: [
          { type: 'narration', zh: '「〜させられる」。你写了两页表格，中间三次差点睡着。', en: 'The causative-passive. Two pages of tables, and you nearly fall asleep three times.' },
          { type: 'narration', zh: '第四页开始，那个形状忽然自己站住了。你反应过来的时候已经能造句了。', en: 'On the fourth page the shape of it suddenly stands up on its own. By the time you notice, you are making sentences with it.' }
        ]
      },
      {
        id: 'study_novel', labelZh: '看小说，但只查不认识的词', labelEn: 'Read the novel, but look up every word you do not know',
        hintZh: '慢，但你会一直看下去',
        hintEn: 'Slow, but you will keep going.',
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '一页三十七个生词，你查完了', reasonEn: 'Thirty-seven unknown words on one page, all looked up' }, { stat: 'charm', amount: 2, reasonZh: '你开始读得懂别人怎么说话', reasonEn: 'You are starting to hear how people actually talk' }],
        then: [
          { type: 'narration', zh: '第一页你查了三十七个词。第二十页只查了九个。', en: 'Thirty-seven lookups on page one. By page twenty it is down to nine.' },
          { type: 'narration', zh: '你抬头的时候，闭馆音乐已经在放了。你完全没听见它是什么时候开始的。', en: 'When you look up, the closing music is playing. You did not hear it start.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '走出图书馆的时候天已经黑了。你在门口站了一会儿，脑子里还是日文。', en: 'It is dark when you come out. You stand at the door for a moment with Japanese still running in your head.' },
  { type: 'effect', setFlags: ['restday_study_done'] }
];

export const PART_TIME: StoryNode[] = [
  { type: 'scene', scene: 'convenience_store_counter', bgm: 'store', titleZh: '八小时', titleEn: 'An Eight-Hour Shift', subtitleZh: '休息日 · 便利店', subtitleEn: 'Day off · The convenience store' },
  { type: 'narration', zh: '西村店长说缺人，问你要不要来顶一天。时薪一千零五十日元。', en: 'The manager says they are short-handed and asks if you want a day. A thousand and fifty yen an hour.' },
  { type: 'narration', zh: '「いらっしゃいませ」这句话你今天要说大约两百四十次。', en: 'You will say the welcome line roughly two hundred and forty times today.' },
  {
    type: 'choice',
    promptZh: '中午高峰，队排到了杂志架。收银机在你手上。',
    promptEn: 'Lunch rush. The queue is back to the magazine rack. The till is yours.',
    options: [
      {
        id: 'parttime_fast', labelZh: '拼速度', labelEn: 'Go for speed',
        hintZh: '会出错，但队会短',
        hintEn: 'You will make mistakes. The queue will be shorter.',
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你一个人扛完了午高峰', reasonEn: 'You took the lunch rush on your own' }, { stat: 'proficiency', amount: 2, reasonZh: '手比脑子先学会', reasonEn: 'Your hands learned before your head did' }],
        setFlags: ['restday_parttime_rush'],
        then: [
          { type: 'narration', zh: '你按错了两次加热键，把一个大叔的便当加热了两遍。他说没关系，笑得很开心。', en: 'You hit the microwave twice on one bento. The man says it is fine and seems genuinely delighted.' },
          { type: 'narration', zh: '一点十分，队没了。店长从后面出来，什么都没说，把一罐咖啡放在你手边。', en: 'At ten past one the queue is gone. The manager comes out from the back, says nothing, and puts a tin of coffee by your hand.' }
        ]
      },
      {
        id: 'parttime_polite', labelZh: '慢一点，每一句敬语都说完整', labelEn: 'Slower. Every honorific in full.',
        hintZh: '队会长，但你在练的是别的东西',
        hintEn: 'The queue grows. You are practising something else.',
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你的敬语第一次说得不像背的', reasonEn: 'Your keigo stopped sounding recited' }, { stat: 'knowledge', amount: 2, reasonZh: '一天两百四十遍，比任何课本都管用', reasonEn: 'Two hundred and forty repetitions beats any textbook' }],
        then: [
          { type: 'narration', zh: '「千円お預かりいたします」。第一百遍的时候你不用想了。', en: 'Taking a thousand yen, thank you. By the hundredth time you no longer have to think about it.' },
          { type: 'narration', zh: '有个老太太说：你日语说得真好。她说完就走了，大概自己都忘了说过。', en: 'An old woman says your Japanese is very good. She leaves immediately and has probably already forgotten saying it.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '晚上七点下班。八千四百日元，现金，装在一个小信封里。', en: 'Off at seven. Eight thousand four hundred yen, cash, in a small envelope.' },
  { type: 'narration', zh: '你在回去的路上一直捏着那个信封。这是你在这个国家赚到的第一笔钱。', en: 'You hold the envelope the whole way home. It is the first money you have earned in this country.' },
  {
    type: 'effect', setFlags: ['restday_parttime_done'],
    effects: [{ stat: 'guts', amount: 1, reasonZh: '你自己赚到了钱', reasonEn: 'You earned it yourself' }]
  }
];

export const CHORES_DAY: StoryNode[] = [
  { type: 'scene', scene: 'umikaze_room_kitchen', bgm: 'lobby', titleZh: '大扫除', titleEn: 'The Big Clean', subtitleZh: '休息日 · 海风庄 202', subtitleEn: 'Day off · Umikaze-so 202' },
  { type: 'narration', zh: '你决定今天把这个屋子彻底收拾一遍。上一次这么做是搬进来那天。', en: 'You decide to clean the flat properly. The last time was the day you moved in.' },
  { type: 'narration', zh: '冰箱最里面有一盒你不记得买过的东西。日期已经不能看了。', en: 'At the back of the fridge is something you do not remember buying. The date is no longer worth reading.' },
  {
    type: 'choice',
    promptZh: '床底下拖出一个纸箱。是你自己的——从家里寄来那批，一直没拆。',
    promptEn: 'A cardboard box comes out from under the bed. Yours: from the shipment from home, never opened.',
    options: [
      {
        id: 'chores_open', labelZh: '拆开', labelEn: 'Open it',
        hintZh: '你知道里面是什么。所以才一直没拆',
        hintEn: 'You know what is in it. That is why it is still shut.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你终于把它拆开了', reasonEn: 'You finally opened it' }, { stat: 'guts', amount: 2, reasonZh: '看完之后你把它摆到了架子上', reasonEn: 'And then you put it on the shelf instead of back under the bed' }],
        setFlags: ['restday_opened_box'],
        then: [
          { type: 'narration', zh: '母亲塞进来的东西：两袋泡面、一件毛衣、一张全家福，还有一包你小时候最爱吃的糖。', en: 'What your mother packed: two bags of instant noodles, a jumper, a family photograph, and a bag of the sweets you liked as a child.' },
          { type: 'narration', zh: '糖已经受潮了，黏成一整块。你还是吃了一颗。', en: 'The sweets have gone soft and fused into one lump. You eat one anyway.' },
          { type: 'narration', zh: '照片你摆到了书架上。摆的时候调了三次角度。', en: 'The photograph goes on the shelf. You adjust the angle three times.' }
        ]
      },
      {
        id: 'chores_later', labelZh: '推回去，先扫地', labelEn: 'Push it back. Sweep first.',
        hintZh: '总有一天会拆的',
        hintEn: 'One day.',
        effects: [{ stat: 'proficiency', amount: 3, reasonZh: '整间屋子被你收拾干净了', reasonEn: 'The whole flat came out clean' }],
        then: [
          { type: 'narration', zh: '你把箱子推回床底，然后花了五个小时把这间十二叠的屋子彻底扫了一遍。', en: 'You push the box back and spend five hours going over twelve mats\' worth of floor.' },
          { type: 'narration', zh: '收完之后你坐在正中间，看着这个很干净、很空的房间。', en: 'Afterwards you sit in the middle of a very clean and very empty room.' }
        ]
      }
    ]
  },
  {
    type: 'effect', setFlags: ['restday_chores_done'],
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '你把自己住的地方当回事了', reasonEn: 'You started taking where you live seriously' }]
  }
];

// ==========================================================
// 🏀 社团活动
// 休息日的社团是自愿的，所以来的人都是真的想来。
// 四个部各挂一个人，主角是那个"不属于任何部"的人——
// 这一段的重点每次都是：她在自己的地盘上是什么样。
// ==========================================================

export const CLUB_BASKETBALL: StoryNode[] = [
  { type: 'scene', scene: 'kaisei_gym_interior', bgm: 'town', titleZh: '休日練習', titleEn: 'Weekend Practice', subtitleZh: '休息日 · 体育馆', subtitleEn: 'Day off · The gym' },
  { type: 'narration', zh: '休息日的体育馆只开一半的灯。另外半边是暗的，球撞在地板上有回声。', en: 'Half the gym lights are on. The other half of the floor is dark and the ball comes back with an echo.' },
  { type: 'narration', characterImage: `${SORA}neutral.webp`, zh: '空一个人在。她说部活是十点开始的，现在是八点四十。', en: 'Sora is here on her own. She says club starts at ten. It is twenty to nine.' },
  { type: 'speech', speakerZh: '空', speakerEn: 'Sora', characterImage: `${SORA}happy.webp`, jp: 'なんでおるん。休みやで、今日。', zh: '你怎么来了。今天放假啊。', en: 'What are you doing here? It\'s a day off.', color: 'bg-orange-500' },
  { type: 'narration', zh: '你把这句话原样还给她。她笑了，没接。', en: 'You hand the question straight back. She laughs and does not answer it.' },
  {
    type: 'choice',
    promptZh: '她把球扔给你。',
    promptEn: 'She throws you the ball.',
    options: [
      {
        id: 'club_bb_shoot', labelZh: '投一个', labelEn: 'Take a shot',
        hintZh: '你不会打球',
        hintEn: 'You cannot play.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你当着一个校队的面投了一个空气球', reasonEn: 'You air-balled in front of a varsity player' }],
        relations: [{ char: CharacterId.SORA, familiarity: 6, affection: 4, reasonZh: '她笑了整整一分钟，然后教你手怎么放', reasonEn: 'She laughed for a full minute and then fixed your hands' }],
        then: [
          { type: 'narration', zh: '空气球。球连篮板都没碰到。', en: 'Air ball. It does not touch the backboard.' },
          { type: 'narration', characterImage: `${SORA}happy.webp`, zh: '她笑了整整一分钟。笑完之后走过来，把你的手指一根一根摆到该在的位置上。', en: 'She laughs for a full minute. Then she comes over and puts your fingers where they are supposed to be, one at a time.' },
          { type: 'speech', speakerZh: '空', speakerEn: 'Sora', characterImage: `${SORA}neutral.webp`, jp: '肘。肘が外向いとる。……そう。それ。', zh: '手肘。手肘朝外了。……对。就那样。', en: 'Elbow. Your elbow\'s out. ...There. That.', color: 'bg-orange-500' },
          { type: 'narration', zh: '第十四个进了。她"ナイッシュー"喊得整个体育馆都听得见，而馆里只有你们两个人。', en: 'The fourteenth goes in. Her "nice shot" fills the entire gym, which contains two people.' }
        ]
      },
      {
        id: 'club_bb_watch', labelZh: '把球还给她，坐在边线上看', labelEn: 'Give it back and sit on the sideline',
        hintZh: '她一个人练的时候不一样',
        hintEn: 'She is different when she practises alone.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你看懂了她在练什么', reasonEn: 'You worked out what she was drilling' }],
        relations: [{ char: CharacterId.SORA, familiarity: 4, affection: 6, reasonZh: '她练了一个小时，一次都没往你这边看——这是最高的信任', reasonEn: 'She drilled for an hour without once looking over, which is the highest trust available' }],
        then: [
          { type: 'narration', zh: '她练的不是投篮。她在练同一个转身动作，一遍一遍，一遍一遍。', en: 'She is not shooting. She is drilling one pivot, over and over and over.' },
          { type: 'narration', zh: '你数到第八十次的时候，看出来了：她左脚落地的时候会慢半拍。那是伤过的那条腿。', en: 'Around the eightieth you see it: her left foot lands half a beat late. That is the leg.' },
          { type: 'narration', zh: '她练了一个小时，一次都没有往你这边看。', en: 'She drills for an hour and does not look over once.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '十点，别的部员陆陆续续来了。她马上变回那个大声、爱笑、什么都不在意的空。', en: 'At ten the others start arriving. She turns straight back into the loud, laughing, unbothered Sora.' },
  { type: 'effect', setFlags: ['restday_club_basketball'] }
];

export const CLUB_ASTRONOMY: StoryNode[] = [
  { type: 'scene', scene: 'school_terrace', bgm: 'night', titleZh: '観測日和', titleEn: 'Good Seeing', subtitleZh: '休息日 · 天台', subtitleEn: 'Day off · The roof' },
  { type: 'narration', zh: '天文部的休息日活动在晚上。铃发的通知只有一行：「今夜、快晴。二十時。」', en: 'The astronomy club meets in the evening. Rei\'s notice was one line: clear tonight, eight o\'clock.' },
  { type: 'narration', characterImage: `${REI}neutral.webp`, zh: '天台上只有她一个人和一台望远镜。天文部一共两个人，另一个是三年级，已经引退了。', en: 'On the roof there is one person and one telescope. The astronomy club has two members; the other is a third-year and has retired.' },
  { type: 'speech', speakerZh: '铃', speakerEn: 'Rei', characterImage: `${REI}neutral.webp`, jp: '来た。座標は合わせてある。', zh: '来了。坐标已经对好了。', en: 'You came. The coordinates are set.', color: 'bg-indigo-500' },
  {
    type: 'choice',
    promptZh: '她把目镜让开了半步。',
    promptEn: 'She steps half a pace back from the eyepiece.',
    options: [
      {
        id: 'club_astro_look', labelZh: '去看', labelEn: 'Look',
        hintZh: '她对好的东西',
        hintEn: 'Whatever she aimed it at.',
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你亲眼看见了土星的环', reasonEn: 'You saw the rings of Saturn with your own eye' }],
        relations: [{ char: CharacterId.REI, familiarity: 5, affection: 6, reasonZh: '她把最好的那个视野让给了你', reasonEn: 'She gave you the good seeing' }],
        then: [
          { type: 'narration', zh: '土星。小得像一粒米，但环是清清楚楚的两条线。', en: 'Saturn. The size of a grain of rice, and the rings unmistakably two clean lines.' },
          { type: 'narration', zh: '你「哇」了一声。你自己都没准备好会发出那个声音。', en: 'You make a noise. You were not expecting to make a noise.' },
          { type: 'narration', characterImage: `${REI}smile.webp`, zh: '她在你身后，很小声地说了一句：「……そうなる」。像是确认了一个早就预测好的结果。', en: 'Behind you she says, very quietly, that this is what happens. Like confirming a predicted result.' }
        ]
      },
      {
        id: 'club_astro_ask', labelZh: '「一个人的社团，为什么还要办活动。」', labelEn: '"Why hold a meeting for a club of one?"',
        jp: '一人の部活で、なんで活動日決めるん。',
        hintZh: '通知是发给谁的',
        hintEn: 'Who was that notice for.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你问到了那份通知真正的收件人', reasonEn: 'You asked who the notice was actually addressed to' }],
        relations: [{ char: CharacterId.REI, familiarity: 3, affection: 9, reasonZh: '她承认那份通知只发给了一个人', reasonEn: 'She admitted the notice went to exactly one person' }],
        then: [
          { type: 'narration', characterImage: `${REI}thinking.webp`, zh: '她沉默了大概八秒。她沉默的时候是在算，算完才说话。', en: 'She is silent for about eight seconds. When she is silent she is calculating, and she speaks when it resolves.' },
          { type: 'speech', speakerZh: '铃', speakerEn: 'Rei', characterImage: `${REI}shy.webp`, jp: '……活動日を決めないと、来る口実がない。', zh: '……不定活动日的话，就没有来的借口。', en: '...Without a meeting day there is no pretext for coming.', color: 'bg-indigo-500' },
          { type: 'narration', zh: '「来る」这个词她没有说主语。天文部只有她一个人，而通知只发给了一个人。', en: 'She does not say who would be coming. The club has one member, and the notice went to one person.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '你们看到十一点。中间云过来一次，她一句话都没说，等了二十分钟，云走了。', en: 'You stay until eleven. Cloud comes over once; she says nothing and waits twenty minutes and it goes.' },
  { type: 'effect', setFlags: ['restday_club_astronomy'] }
];

export const CLUB_COUNCIL: StoryNode[] = [
  { type: 'scene', scene: 'classroom', bgm: 'chat', titleZh: '誰もいない生徒会室', titleEn: 'The Empty Council Room', subtitleZh: '休息日 · 学生会室', subtitleEn: 'Day off · The student council room' },
  { type: 'narration', zh: '休息日的学生会室开着灯。里面只有明日香，和三个纸箱的文件。', en: 'The council room light is on. Inside: Asuka, and three boxes of paperwork.' },
  { type: 'narration', characterImage: `${ASUKA}neutral.webp`, zh: '她看见你的时候明显愣了一下，然后马上把桌上摊开的东西往里推了推。', en: 'She startles when she sees you and immediately pushes what is spread on the desk further in.' },
  { type: 'speech', speakerZh: '明日香', speakerEn: 'Asuka', characterImage: `${ASUKA}surprised.webp`, jp: 'ど、どうしてここに。今日は休みでしょう。', zh: '你、你怎么会在这儿。今天不是放假吗。', en: 'W-what are you doing here? It is a day off.', color: 'bg-red-500' },
  { type: 'narration', zh: '这句话应该由你来问她。', en: 'That was your question.' },
  {
    type: 'choice',
    promptZh: '桌上那份是下个月文化祭的预算表。她一个人做到第七页。',
    promptEn: 'The papers are next month\'s culture festival budget. She is on page seven, alone.',
    options: [
      {
        id: 'club_council_help', labelZh: '坐下来帮她算', labelEn: 'Sit down and do the sums with her',
        hintZh: '她不会开口要',
        hintEn: 'She will not ask.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没有问就坐下了', reasonEn: 'You sat down without asking' }, { stat: 'knowledge', amount: 2, reasonZh: '你现在知道文化祭的章鱼烧是怎么定价的了', reasonEn: 'You now know how the festival prices its takoyaki' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 7, affection: 8, reasonZh: '她把第八页推了过来', reasonEn: 'She pushed page eight across' }],
        then: [
          { type: 'narration', zh: '你什么都没说，拉了张椅子坐下，把第八页拿过来。', en: 'You say nothing, pull up a chair, and take page eight.' },
          { type: 'narration', characterImage: `${ASUKA}shy.webp`, zh: '她张嘴要说什么——大概是"不用"——然后没说。', en: 'She opens her mouth to say something, probably that it is not necessary, and does not.' },
          { type: 'narration', zh: '你们算了四个小时。中间她只说过一句话：「そこ、消費税抜き」。', en: 'Four hours of arithmetic. She says one thing in all of it: that column is before tax.' },
          { type: 'narration', characterImage: `${ASUKA}happy.webp`, zh: '算完最后一页的时候是下午四点。她伸了个懒腰，然后意识到你在，赶紧收回去。', en: 'The last page is done at four. She stretches, remembers you are there, and puts the stretch away.' }
        ]
      },
      {
        id: 'club_council_drag', labelZh: '「今天不干这个。走。」', labelEn: '"Not today. Come on."',
        jp: '今日はこれ、なし。行くで。',
        hintZh: '她需要有人替她做这个决定',
        hintEn: 'She needs somebody else to make this decision for her.',
        requires: { stat: 'guts', min: 8 },
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你把一份没做完的文件从她手里拿走了', reasonEn: 'You took unfinished paperwork out of her hands' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 4, affection: 12, reasonZh: '她被人从桌子边拽走，而且没有反抗到底', reasonEn: 'She was pulled away from a desk and did not fight all the way' }],
        setFlags: ['restday_dragged_asuka_out'],
        then: [
          { type: 'narration', characterImage: `${ASUKA}angry.webp`, zh: '她当然反对。她列举了三条理由，每一条都成立。', en: 'She objects, of course, on three grounds, all of them valid.' },
          { type: 'narration', zh: '你把她的笔收了，把文件扣过来压好，然后站在门口等。', en: 'You take her pen, turn the papers face down, and go and wait by the door.' },
          { type: 'narration', characterImage: `${ASUKA}shy.webp`, zh: '她坐了大概三十秒，然后站起来，很小声地说了句「……一時間だけよ」。', en: 'She sits there about thirty seconds, then stands, and says very quietly that it is one hour only.' },
          { type: 'narration', zh: '一小时后你们还在元町。三小时后她第一次说了"今天真的挺好的"。', en: 'An hour later you are still in Motomachi. Three hours later she says, for the first time, that today was rather good.' }
        ]
      }
    ]
  },
  { type: 'effect', setFlags: ['restday_club_council'] }
];

export const CLUB_MUSIC: StoryNode[] = [
  { type: 'scene', scene: 'music_room', bgm: 'town', titleZh: '軽音部（仮）', titleEn: 'Light Music Club (Provisional)', subtitleZh: '休息日 · 音乐室', subtitleEn: 'Day off · The music room' },
  { type: 'narration', zh: '音乐室的门半开着，里面在放很吵的东西。走近了才听出来是有人在弹，不是在放。', en: 'The music room door is ajar and something very loud is coming out. Up close you realise somebody is playing it, not playing it back.' },
  { type: 'narration', characterImage: `${MAKI}punk_neutral.webp`, zh: '真希。她背对着门，插着电，音量开得比这个房间应该承受的大。', en: 'Maki, with her back to the door, plugged in, at a volume this room was not designed for.' },
  { type: 'narration', zh: '她弹错了一个地方，停下来，骂了一句，从头再来。你在门口站了六遍。', en: 'She fluffs something, stops, swears, and starts again. You stand in the doorway through six of these.' },
  {
    type: 'choice',
    promptZh: '第七遍她过了那个地方，然后猛地转过头——发现你在。',
    promptEn: 'On the seventh she gets through it, and whips round, and finds you there.',
    options: [
      {
        id: 'club_music_clap', labelZh: '鼓掌', labelEn: 'Applaud',
        hintZh: '她会想死',
        hintEn: 'She will want to die.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你在她最不想被看见的时候鼓了掌', reasonEn: 'You applauded at the exact moment she least wanted to be seen' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 5, affection: 8, reasonZh: '她骂了你三分钟，然后又弹了一遍', reasonEn: 'She swore at you for three minutes and then played it again' }],
        then: [
          { type: 'narration', characterImage: `${MAKI}angry_alt.webp`, zh: '她整张脸红到耳朵，然后开始骂你，骂了大概三分钟，一句重复的都没有。', en: 'She goes red to the ears and swears at you for about three minutes without repeating herself once.' },
          { type: 'narration', zh: '骂完之后她没赶你走。她背过身，说了一句「……もっかいだけな」，然后又弹了一遍。', en: 'When she has finished she does not throw you out. She turns her back, says just the once, then, and plays it again.' },
          { type: 'narration', characterImage: `${MAKI}shy_alt.webp`, zh: '这一遍没错。弹完她没回头，肩膀在等。', en: 'This time it is clean. She does not turn round. Her shoulders are waiting.' }
        ]
      },
      {
        id: 'club_music_ask', labelZh: '「軽音部有几个人。」', labelEn: '"How many people are in this club?"',
        jp: '軽音部、何人おるん。',
        hintZh: '这个房间只有一把椅子被坐过',
        hintEn: 'Only one chair in this room has been sat in.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你数了椅子', reasonEn: 'You counted the chairs' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 7, affection: 5, reasonZh: '她说了实话，而且说得很快', reasonEn: 'She told the truth, very fast' }],
        then: [
          { type: 'narration', characterImage: `${MAKI}punk_pout.webp`, zh: '「三人」，她说。然后停了一下，「……届出上は」。', en: 'Three, she says. Then a pause. On the paperwork.' },
          { type: 'narration', zh: '实际上是一个。另外两个是她拿章鱼烧买通的一年级，从来没来过。', en: 'Actually one. The other two are first-years she bought with takoyaki and who have never once turned up.' },
          { type: 'narration', characterImage: `${MAKI}smug.webp`, zh: '她说这个的时候一点都不难过。她说：房间大，一个人用刚好。', en: 'She is not remotely sad about it. She says the room is big and one person is about right.' }
        ]
      }
    ]
  },
  { type: 'effect', setFlags: ['restday_club_music'] }
];

// ==========================================================
// 🚌 郊游
// 一年四次，一次两个人，八个人正好各出场一次。
// 和放学后的偶遇不同：这是"约好的一整天"，
// 所以写的是那种只有一整天才会发生的事——
// 有人会在下午三点开始说白天不会说的话。
// ==========================================================

export const OUTING_HANAMI: StoryNode[] = [
  { type: 'scene', scene: 'oji_amusement_park', bgm: 'town', titleZh: '花見', titleEn: 'Under the Blossom', subtitleZh: '春 · 王子公园', subtitleEn: 'Spring · Oji Park' },
  { type: 'narration', zh: '光在群里说她占了位子。她七点就去了，为了那棵最大的树底下那块地。', en: 'Hikari said in the group chat that she had a spot. She went at seven for the patch under the biggest tree.' },
  { type: 'narration', characterImage: `${HIKARI}happy.webp`, zh: '你到的时候她已经在那块蓝色塑料布上坐了三个小时，靠着树睡着了一次。', en: 'By the time you arrive she has been on the blue tarpaulin three hours and has fallen asleep against the tree once.' },
  { type: 'narration', characterImage: `${NAO}happy.webp`, zh: '奈绪拎了两个便当盒来，一个是她做的，一个是她买的，她坚持不说哪个是哪个。', en: 'Nao arrives with two bento boxes, one she made and one she bought, and refuses to say which is which.' },
  { type: 'speech', speakerZh: '奈绪', speakerEn: 'Nao', characterImage: `${NAO}happy.webp`, jp: '当ててみ。当たったら両方あげる。', zh: '猜猜看。猜中了两个都给你。', en: 'Guess. If you get it right you can have both.', color: 'bg-emerald-500' },
  {
    type: 'choice',
    promptZh: '两个便当摆在你面前。光已经开始吃了，一边吃一边说"这个好吃"，两个都说。',
    promptEn: 'Both boxes in front of you. Hikari has already started, saying this one is good, about both of them.',
    options: [
      {
        id: 'hanami_guess', labelZh: '认真猜', labelEn: 'Guess properly',
        hintZh: '看蛋卷的切口',
        hintEn: 'Look at how the tamagoyaki is cut.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你看出了手切和机器切的区别', reasonEn: 'You can tell a knife cut from a machine cut now' }],
        relations: [
          { char: CharacterId.NAO, familiarity: 5, affection: 8, reasonZh: '你一眼就认出了哪个是她做的', reasonEn: 'You knew which one was hers at a glance' },
          { char: CharacterId.HIKARI, familiarity: 3, affection: 2, reasonZh: '她看你们看得很开心', reasonEn: 'She enjoyed watching the two of you' }
        ],
        then: [
          { type: 'narration', zh: '左边那盒的蛋卷切口不整齐，而且每一片厚度都不一样。你指了左边。', en: 'The tamagoyaki on the left is unevenly cut and no two slices are the same thickness. You point left.' },
          { type: 'narration', characterImage: `${NAO}curious.webp`, zh: '她愣住了。然后她说：「なんでわかったん」。', en: 'She freezes, and asks how you knew.' },
          { type: 'narration', zh: '因为你吃过十年她做的东西。你没说这句，但她自己想到了——她的耳朵红了。', en: 'Because you ate ten years of her cooking. You do not say it. She gets there herself, and her ears go red.' }
        ]
      },
      {
        id: 'hanami_both', labelZh: '「都好吃。」直接吃两个', labelEn: '"They\'re both good." Eat both.',
        hintZh: '光已经在这么干了',
        hintEn: 'Hikari is already doing this.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你选了不选', reasonEn: 'You declined to choose' }],
        relations: [
          { char: CharacterId.NAO, familiarity: 4, affection: 3, reasonZh: '她说"你这人真滑头"，但笑了', reasonEn: 'She called you slippery, and laughed' },
          { char: CharacterId.HIKARI, familiarity: 5, affection: 5, reasonZh: '你和她站在同一边', reasonEn: 'You took her side' }
        ],
        then: [
          { type: 'narration', characterImage: `${HIKARI}happy.webp`, zh: '光举起筷子跟你碰了一下，像干杯。', en: 'Hikari taps her chopsticks against yours like a toast.' },
          { type: 'narration', characterImage: `${NAO}angry.webp`, zh: '奈绪说你们两个都是滑头。她说完自己也夹了一筷子买来的那个。', en: 'Nao says you are both slippery, and then takes a piece from the shop-bought one herself.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '下午三点，风起来了，花瓣往塑料布上落，落进便当盒里。谁都没有去拨。', en: 'At three the wind gets up and petals come down onto the tarpaulin and into the boxes. Nobody brushes them out.' },
  { type: 'narration', characterImage: `${HIKARI}neutral.webp`, zh: '光忽然说：「うち、去年の花見は一人やってん」。她说完就没再说了。', en: 'Hikari says, out of nowhere, that last year she did the blossom on her own. Then she does not say anything else.' },
  { type: 'narration', zh: '奈绪往她那边挪了一点。就一点，挪完什么都没说。', en: 'Nao shifts a little way towards her. Just a little. Neither of them mentions it.' },
  {
    type: 'effect', setFlags: ['restday_outing_hanami'],
    effects: [{ stat: 'kindness', amount: 2, reasonZh: '你们三个在树底下坐到天黑', reasonEn: 'The three of you stayed under the tree until dark' }],
    relations: [
      { char: CharacterId.HIKARI, familiarity: 4, affection: 4, reasonZh: '今年的花見不是一个人', reasonEn: 'This year the blossom was not on her own' },
      { char: CharacterId.NAO, familiarity: 3, affection: 3, reasonZh: '她挪的那一点', reasonEn: 'That small shift across the tarpaulin' }
    ]
  }
];

export const OUTING_BEACH: StoryNode[] = [
  { type: 'scene', scene: 'suma_beach', bgm: 'town', titleZh: '須磨、正午', titleEn: 'Suma, Noon', subtitleZh: '夏 · 须磨海岸', subtitleEn: 'Summer · Suma beach' },
  { type: 'narration', zh: '这件事是从空和真希互相说对方不会游泳开始的。', en: 'This began with Sora and Maki each telling the other they could not swim.' },
  { type: 'narration', characterImage: `${SORA}swim_happy.webp`, zh: '到了海边，两个人在沙滩上站成对峙的样子，中间隔了两米。', en: 'At the beach the two of them square off two metres apart on the sand.' },
  { type: 'speech', speakerZh: '空', speakerEn: 'Sora', characterImage: `${SORA}swim_happy.webp`, jp: 'あの浮き輪まで。負けたほう、かき氷おごり。', zh: '游到那个浮标。输的请刨冰。', en: 'To that buoy. Loser buys the shaved ice.', color: 'bg-orange-500' },
  { type: 'speech', speakerZh: '真希', speakerEn: 'Maki', characterImage: `${MAKI}swim_neutral.webp`, jp: 'ええけど。ウチ、負けへんで。', zh: '行啊。不过我不会输。', en: 'Fine. I\'m not losing, though.', color: 'bg-pink-500' },
  {
    type: 'choice',
    promptZh: '她们都看向你。有人得喊开始。',
    promptEn: 'They both look at you. Somebody has to start it.',
    options: [
      {
        id: 'beach_start', labelZh: '喊开始', labelEn: 'Start them',
        hintZh: '这两个人认真起来很吓人',
        hintEn: 'These two are alarming when they mean it.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你放出了两头野兽', reasonEn: 'You released two wild animals' }],
        relations: [
          { char: CharacterId.SORA, familiarity: 5, affection: 4, reasonZh: '她赢了半个身位', reasonEn: 'She won by half a length' },
          { char: CharacterId.MAKI, familiarity: 5, affection: 4, reasonZh: '她输了半个身位，而且要求重来', reasonEn: 'She lost by half a length and demanded a rematch' }
        ],
        then: [
          { type: 'narration', zh: '空赢了半个身位。真希在水里就开始要求重来，一共重来了四次。', en: 'Sora wins by half a length. Maki demands a rematch while still in the water, and then three more times.' },
          { type: 'narration', zh: '第五次两个人都游不动了，趴在浮标上互相说对方作弊。', en: 'By the fifth neither of them can move, and they hang off the buoy accusing each other of cheating.' },
          { type: 'narration', characterImage: `${MAKI}swim_shy.webp`, zh: '最后是你把刨冰买回来的。买了三份。', en: 'You end up buying the shaved ice. Three of them.' }
        ]
      },
      {
        id: 'beach_join', labelZh: '「三个人一起。」', labelEn: '"Three of us."',
        jp: '三人でやろ。',
        hintZh: '你游得比她们都慢',
        hintEn: 'You are slower than both of them.',
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你自愿去当那个垫底的', reasonEn: 'You volunteered to come last' }],
        relations: [
          { char: CharacterId.SORA, familiarity: 4, affection: 7, reasonZh: '你把一场对决变成了一件三个人的事', reasonEn: 'You turned a duel into something three people did' },
          { char: CharacterId.MAKI, familiarity: 4, affection: 9, reasonZh: '她不用一个人输给空了', reasonEn: 'She no longer had to lose to Sora alone' }
        ],
        setFlags: ['restday_beach_three'],
        then: [
          { type: 'narration', zh: '你输得很惨。你到浮标的时候她们两个已经在那儿聊了一会儿了。', en: 'You lose badly. By the time you reach the buoy they have been chatting there for a while.' },
          { type: 'narration', characterImage: `${SORA}swim_happy.webp`, zh: '空伸手把你拽上浮标，一边拽一边笑得说不出话。', en: 'Sora hauls you up onto the buoy, laughing too hard to speak.' },
          { type: 'narration', characterImage: `${MAKI}swim_shy.webp`, zh: '真希什么都没说。但她挪开了一点，给你腾了地方。', en: 'Maki says nothing, but she moves over to make room.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '傍晚，太阳掉进海里，整片沙滩变成橘色。三个人坐在防波堤上，谁都没提回去的事。', en: 'The sun drops into the sea and the whole beach goes orange. Three people on the breakwater, and nobody mentions going home.' },
  { type: 'narration', characterImage: `${SORA}swim_neutral.webp`, zh: '空说：「来年も来ような」。她说的是「来年」——她一年前还不确定自己能不能再游泳。', en: 'Sora says they should come again next year. Next year: a year ago she did not know whether she would swim again at all.' },
  {
    type: 'effect', setFlags: ['restday_outing_beach'],
    effects: [{ stat: 'guts', amount: 2, reasonZh: '你在须磨的海里游到脱力', reasonEn: 'You swam yourself to nothing at Suma' }],
    relations: [
      { char: CharacterId.SORA, familiarity: 4, affection: 4, reasonZh: '她说了「来年」', reasonEn: 'She said "next year"' },
      { char: CharacterId.MAKI, familiarity: 4, affection: 4, reasonZh: '她在防波堤上没有跑掉', reasonEn: 'She did not run off from the breakwater' }
    ]
  }
];

export const OUTING_AUTUMN: StoryNode[] = [
  { type: 'scene', scene: 'arima_onsen_street_slope', bgm: 'town', titleZh: '有馬、紅葉', titleEn: 'Arima, in Autumn', subtitleZh: '秋 · 有马温泉', subtitleEn: 'Autumn · Arima Onsen' },
  { type: 'narration', zh: '深雪说她有两张温泉的招待券，快过期了。她说得很随意，随意到你知道那是准备好的话。', en: 'Miyuki says she has two spa vouchers about to expire. She says it lightly enough that you can tell the sentence was prepared.' },
  { type: 'narration', characterImage: `${MIYUKI}cardigan_neutral.webp`, zh: '结果是三个人：她、你，和铃——铃是自己要来的，理由是「有馬の湯は鉄分濃度が高い。見たい」。', en: 'It ends up being three: her, you, and Rei, who invited herself on the grounds that the iron content at Arima is high and she wants to see it.' },
  { type: 'narration', zh: '从三宫坐巴士上山四十分钟。山路一半的时候，窗外整片山都是红的。', en: 'Forty minutes up by bus. Halfway there the entire hillside outside the window is red.' },
  {
    type: 'choice',
    promptZh: '铃一路没说话，一直看着窗外。深雪在打盹。',
    promptEn: 'Rei has not spoken the whole way and is looking out of the window. Miyuki is dozing.',
    options: [
      {
        id: 'autumn_rei', labelZh: '问铃在看什么', labelEn: 'Ask Rei what she is looking at',
        hintZh: '她看了四十分钟',
        hintEn: 'She has been at it forty minutes.',
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你现在知道叶子为什么会红了', reasonEn: 'You now know why leaves go red' }],
        relations: [{ char: CharacterId.REI, familiarity: 6, affection: 6, reasonZh: '她讲了整整十分钟花青素', reasonEn: 'She talked about anthocyanins for ten straight minutes' }],
        then: [
          { type: 'narration', characterImage: `${REI}neutral.webp`, zh: '她说：叶子变红不是因为多了红色，是因为绿色撤走了。红色一直都在。', en: 'She says leaves do not turn red by gaining red. The green withdraws. The red was there the whole time.' },
          { type: 'narration', zh: '她讲了十分钟。深雪醒了一半，听着，没有插话。', en: 'She talks for ten minutes. Miyuki half wakes, listens, and does not interrupt.' },
          { type: 'narration', characterImage: `${REI}shy.webp`, zh: '讲完之后铃很小声地补了一句：「……喋りすぎた」。', en: 'Afterwards Rei says, very quietly, that she talked too much.' },
          { type: 'narration', zh: '深雪没睁眼，说了句「ううん、もっと聞きたい」。铃看了她很久。', en: 'Without opening her eyes Miyuki says no, she would like to hear more. Rei looks at her for a long time.' }
        ]
      },
      {
        id: 'autumn_miyuki', labelZh: '让深雪睡，替她把外套盖好', labelEn: 'Let Miyuki sleep. Put her coat over her.',
        hintZh: '她今天是来休息的，虽然她不会承认',
        hintEn: 'She came here to rest, though she will not say so.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你看出来她累了', reasonEn: 'You noticed she was tired' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 5, affection: 10, reasonZh: '有人替她盖了一次外套', reasonEn: 'Somebody put a coat over her for once' }],
        setFlags: ['restday_miyuki_slept'],
        then: [
          { type: 'narration', zh: '她睡了整整三十五分钟。醒来的时候第一句话是「あら、私、寝てた？」，第二句是「ごめんなさい」。', en: 'She sleeps thirty-five minutes. Her first words on waking are to ask whether she was asleep. Her second are an apology.' },
          { type: 'narration', characterImage: `${REI}thinking.webp`, zh: '铃在旁边说：「謝る対象が不明」。深雪愣了一下，然后笑得停不下来。', en: 'Rei says the object of the apology is unclear. Miyuki blinks, and then cannot stop laughing.' }
        ]
      }
    ]
  },
  { type: 'scene', scene: 'arima_onsen_kin_no_yu' },
  { type: 'narration', zh: '金汤是铁锈色的，热得吓人。泡完出来，山里的空气冷得让人清醒。', en: 'The gold bath is the colour of rust and alarmingly hot. Outside afterwards the mountain air is cold enough to sober you up.' },
  { type: 'narration', characterImage: `${MIYUKI}cardigan_happy.webp`, zh: '三个人在坡道上买了炭酸煎饼，一边走一边吃。深雪买了两包，说带回去给你当早饭。', en: 'Three people buy carbonated crackers on the slope and eat them walking. Miyuki buys two extra packets and says they are your breakfast.' },
  {
    type: 'effect', setFlags: ['restday_outing_autumn'],
    effects: [{ stat: 'kindness', amount: 2, reasonZh: '你在山上待了一整天', reasonEn: 'You spent a whole day up the mountain' }],
    relations: [
      { char: CharacterId.MIYUKI, familiarity: 4, affection: 4, reasonZh: '她今天是被照顾的那个', reasonEn: 'Today she was the one being looked after' },
      { char: CharacterId.REI, familiarity: 4, affection: 3, reasonZh: '她记录了水温，也记录了别的', reasonEn: 'She recorded the water temperature, and some other things' }
    ]
  }
];

export const OUTING_HATSUMODE: StoryNode[] = [
  { type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'night', titleZh: '初詣', titleEn: 'The First Visit', subtitleZh: '冬 · 元旦 · 生田神社', subtitleEn: 'Winter · New Year · Ikuta Shrine' },
  { type: 'narration', zh: '元旦零点，生田神社的队从鸟居一直排到马路对面。你们排了五十分钟。', en: 'Midnight on New Year\'s Day. The queue at Ikuta runs from the torii to the far side of the road. You are in it fifty minutes.' },
  { type: 'narration', characterImage: `${ASUKA}casual_neutral.webp`, zh: '明日香穿的是私服。你几乎没见过她穿私服，她自己也不太自在，一直在整理围巾。', en: 'Asuka is in her own clothes. You have almost never seen this, and neither has she; she keeps rearranging her scarf.' },
  { type: 'narration', characterImage: `${INARI}summer_neutral.webp`, zh: '稻荷不用排队。你们排到一半的时候她已经站在里面了，靠着一根柱子，手里拿着一杯甜酒。', en: 'Inari does not queue. Halfway up you find her already inside, leaning on a pillar with a cup of amazake.' },
  { type: 'speech', speakerZh: '稻荷', speakerEn: 'Inari', characterImage: `${INARI}sly.webp`, jp: '毎年、この日だけは混むのう。年に一度、皆が思い出すのじゃ。', zh: '每年就这一天挤。一年一次，大家会想起来。', en: 'Only on this one day of the year. Once a year, everybody remembers.', color: 'bg-amber-500' },
  {
    type: 'choice',
    promptZh: '绘马挂在殿侧，密密麻麻。明日香在写。她写了很久，用手挡着。',
    promptEn: 'The ema boards hang thick beside the hall. Asuka is writing on one, and has been a while, with a hand over it.',
    options: [
      {
        id: 'hatsu_ema_look', labelZh: '不看她写的，去写自己的', labelEn: 'Do not look. Write your own.',
        hintZh: '有些愿望被看见了就不算数',
        hintEn: 'Some wishes stop counting if they are seen.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没有偷看', reasonEn: 'You did not look' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 4, affection: 11, reasonZh: '她挂完之后，自己把绘马转了过来给你看', reasonEn: 'When she had hung it, she turned it round for you herself' }],
        setFlags: ['restday_hatsumode_ema'],
        then: [
          { type: 'narration', zh: '你写了自己的，挂上去。挂的时候你听见旁边"咔"的一声，她也挂上了。', en: 'You write yours and hang it. Beside you there is a small knock as hers goes up too.' },
          { type: 'narration', characterImage: `${ASUKA}shy.webp`, zh: '然后她伸手，把自己那块转了过来，正面朝你。', en: 'Then she reaches over and turns hers round, face towards you.' },
          { type: 'narration', zh: '上面只有一行字，不是「一番になれますように」。是：「一番じゃなくても、いられますように」。', en: 'One line on it. Not that she may be first. That she may be all right even if she is not.' },
          { type: 'narration', characterImage: `${ASUKA}shy.webp`, zh: '她转完就走了，走得很快，没有等你说任何话。', en: 'She turns and walks off fast, without waiting for you to say anything.' }
        ]
      },
      {
        id: 'hatsu_inari', labelZh: '去问稻荷：神会不会看绘马', labelEn: 'Ask Inari whether the gods read the ema',
        hintZh: '你旁边就站着一位',
        hintEn: 'There is one standing right there.',
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你问了一个只有这里能问的问题', reasonEn: 'You asked a question you could only ask here' }],
        relations: [{ char: CharacterId.INARI, familiarity: 5, affection: 9, reasonZh: '她说了实话，虽然实话不好听', reasonEn: 'She told the truth, which was not the nice answer' }],
        then: [
          { type: 'narration', characterImage: `${INARI}neutral.webp`, zh: '她看着那一整面绘马，看了很久。', en: 'She looks at the whole wall of them for a long time.' },
          { type: 'speech', speakerZh: '稻荷', speakerEn: 'Inari', characterImage: `${INARI}sad.webp`, jp: '読む。全部な。……叶えられるとは言うておらん。', zh: '读。全都读。……我可没说能实现。', en: 'I read them. All of them. ...I did not say I could grant them.', color: 'bg-amber-500' },
          { type: 'narration', zh: '你问那读来干什么。她说：读了，那件事就有人知道了。', en: 'You ask what the point is. She says that once she has read it, somebody knows about it.' },
          { type: 'narration', characterImage: `${INARI}sad.webp`, zh: '「知られたことは、一人ぶんだけ軽くなる。」', en: 'What is known, she says, gets one person\'s worth lighter.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '凌晨两点，人才散。神社里剩下的灯把地上照成一片很淡的橘色。', en: 'The crowd thins around two. The lamps that are left lay a very pale orange over the ground.' },
  { type: 'narration', zh: '新的一年开始了。你在神户过了第一个正月。', en: 'A new year has started. You have had your first New Year in Kobe.' },
  {
    type: 'effect', setFlags: ['restday_outing_hatsumode'],
    effects: [{ stat: 'guts', amount: 2, reasonZh: '你排了五十分钟的队，在零度里', reasonEn: 'You queued fifty minutes at zero degrees' }],
    relations: [
      { char: CharacterId.ASUKA, familiarity: 3, affection: 4, reasonZh: '那块绘马上写的不是"第一"', reasonEn: 'What was on the ema was not about being first' },
      { char: CharacterId.INARI, familiarity: 4, affection: 4, reasonZh: '一年一次，大家会想起来', reasonEn: 'Once a year, everybody remembers' }
    ]
  }
];

export const OUTING_BY_SEASON: Record<Season, StoryNode[]> = {
  spring: OUTING_HANAMI,
  summer: OUTING_BEACH,
  autumn: OUTING_AUTUMN,
  winter: OUTING_HATSUMODE
};

// 每次郊游要哪两个人都认识。凑不齐就不给这个选项——
// 三个人的一整天，不能带一个只见过一面的人去。
export const OUTING_CAST: Record<Season, CharacterId[]> = {
  spring: [CharacterId.HIKARI, CharacterId.NAO],
  summer: [CharacterId.SORA, CharacterId.MAKI],
  autumn: [CharacterId.MIYUKI, CharacterId.REI],
  winter: [CharacterId.ASUKA, CharacterId.INARI]
};

// ==========================================================
// 🛏️ 不想上学的那一天
//
// 「一整天不出门」原本只有休息日能选。但不想去学校这件事
// 和今天是不是周末没有关系——它恰恰只在有课的日子才成立。
//
// 所以这两段挂在上学日：请假睡一天、翘课出去逛。
// 两条都掉学识（课是真的没上），但掉的不是同一样东西，
// 换回来的也不是同一样东西。
// ==========================================================

export const SKIP_SLEEP: StoryNode[] = [
  { type: 'scene', scene: 'apartment_room', bgm: 'lobby', titleZh: '今天不去了', titleEn: 'Not Today', subtitleZh: '海风庄 202 · 早上七点', subtitleEn: 'Umikaze-so 202 · Seven a.m.' },
  { type: 'narration', zh: '闹钟响了。你按掉了。', en: 'The alarm goes. You turn it off.' },
  { type: 'narration', zh: '第二个闹钟响了。你也按掉了。', en: 'The second alarm goes. You turn that off too.' },
  { type: 'narration', zh: '七点二十，你睁着眼躺在那儿，很清楚自己已经赶不上第一节课了，而且并不打算赶。', en: 'At twenty past seven you are lying there awake, entirely aware that you have missed first period and entirely uninterested in catching it.' },
  {
    type: 'choice',
    promptZh: '手机在枕头边上。你可以发一条消息，也可以什么都不发。',
    promptEn: 'The phone is by the pillow. You can send something, or not.',
    options: [
      {
        id: 'skip_sleep_tell',
        labelZh: '给学校发一条请假',
        labelEn: 'Message the school',
        jp: '本日、欠席します。',
        hintZh: '体面一点',
        hintEn: 'Do it properly.',
        effects: [
          { stat: 'kindness', amount: 2, reasonZh: '你没有让别人替你圆谎', reasonEn: 'You did not make anybody cover for you' },
          { stat: 'knowledge', amount: -3, reasonZh: '一整天的课', reasonEn: 'A whole day of lessons' }
        ],
        setFlags: ['skip_school_excused'],
        then: [
          { type: 'narration', zh: '「体調不良のため本日欠席します」。你写了三遍才写对敬语。', en: 'Absent today due to feeling unwell. It takes you three attempts to get the keigo right.' },
          { type: 'narration', zh: '发出去两分钟就收到了回复：「お大事に」。你盯着这三个字看了一会儿。', en: 'The reply comes in two minutes: take care of yourself. You look at it for a while.' },
          { type: 'narration', zh: '你没有生病。但收到这句之后，你确实觉得好受了一点。', en: 'You are not ill. Having received it, you do feel somewhat better.' }
        ]
      },
      {
        id: 'skip_sleep_silent',
        labelZh: '什么都不发，继续睡',
        labelEn: 'Send nothing. Go back to sleep.',
        hintZh: '明天再解释',
        hintEn: 'Explain tomorrow.',
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '你决定这一天不属于任何人', reasonEn: 'You decided this day belonged to nobody' },
          { stat: 'knowledge', amount: -4, reasonZh: '一整天的课，而且是无故的', reasonEn: 'A whole day, and unexplained at that' }
        ],
        setFlags: ['skip_school_silent'],
        then: [
          { type: 'narration', zh: '你把手机扣过来，翻了个身。', en: 'You turn the phone face down and roll over.' },
          { type: 'narration', zh: '中午十一点你醒了一次，看见三条未读，又睡了过去。', en: 'You surface at eleven, see three unread, and go under again.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '你一直睡到下午三点。醒来的时候屋子里的光已经变成另一个颜色了。', en: 'You sleep until three. The light in the room has changed colour by the time you wake.' },
  { type: 'narration', zh: '你在床上坐了很久，什么都没想。这一整天里，没有一个人知道你在哪儿。', en: 'You sit on the edge of the bed for a long time thinking about nothing. All day, nobody has known where you were.' },
  { type: 'narration', zh: '这件事有点吓人，也有点舒服。', en: 'It is slightly frightening and slightly comfortable.' },
  {
    type: 'effect', setFlags: ['skip_school_slept'],
    effects: [
      { stat: 'guts', amount: 1, reasonZh: '你欠了自己一天，还给了自己', reasonEn: 'You owed yourself a day and paid it' },
      { stat: 'proficiency', amount: -1, reasonZh: '一整天没说过一句日语', reasonEn: 'A whole day without speaking a word of Japanese' }
    ]
  }
];

export const SKIP_WANDER: StoryNode[] = [
  { type: 'scene', scene: 'sannomiya_station', bgm: 'town', titleZh: '反方向的电车', titleEn: 'The Train the Other Way', subtitleZh: '上学日 · 早上八点十分', subtitleEn: 'A school day · Ten past eight' },
  { type: 'narration', zh: '你穿着制服，背着书包，站在月台上。', en: 'You are on the platform in uniform with your bag.' },
  { type: 'narration', zh: '往学校的那班车进站了。你看着它停下、开门、上人、关门、开走。', en: 'The train towards school pulls in. You watch it stop, open, fill, close, and go.' },
  { type: 'narration', zh: '你还站在原地。', en: 'You are still standing there.' },
  {
    type: 'choice',
    promptZh: '两分钟后，反方向那班车进站。',
    promptEn: 'Two minutes later the train the other way pulls in.',
    options: [
      {
        id: 'skip_wander_harbor',
        labelZh: '上车，坐到海边',
        labelEn: 'Get on. Ride to the sea.',
        hintZh: '这个点海边一个人都没有',
        hintEn: 'There will be nobody there at this hour.',
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你上了那班反方向的车', reasonEn: 'You got on the train going the other way' },
          { stat: 'knowledge', amount: -3, reasonZh: '这一天的课你一节都没上', reasonEn: 'You attended none of the day' },
          { stat: 'charm', amount: 2, reasonZh: '你第一次一个人做了一件没人知道的事', reasonEn: 'You did something nobody knew about, alone, for the first time' }
        ],
        setFlags: ['skip_school_sea'],
        then: [
          { type: 'scene', scene: 'suma_beach' },
          { type: 'narration', zh: '上午九点半的须磨海岸，只有两个遛狗的老人和一只在追浪的柴犬。', en: 'Suma at half nine in the morning: two people walking dogs, and one shiba chasing waves.' },
          { type: 'narration', zh: '你穿着制服坐在防波堤上。有人从后面走过，看了你一眼，什么都没说。', en: 'You sit on the breakwater in your uniform. Somebody passes behind you, looks, and says nothing.' },
          { type: 'narration', zh: '你在那儿坐了四个小时。中间买了一个饭团，吃得很慢。', en: 'You stay four hours. At some point you buy an onigiri and eat it very slowly.' },
          { type: 'narration', zh: '这四个小时里你什么都没想明白。但你不再觉得那件事非想明白不可了。', en: 'You work nothing out in those four hours. You do stop feeling that it has to be worked out.' }
        ]
      },
      {
        id: 'skip_wander_city',
        labelZh: '不上车。就在市里走一天',
        labelEn: 'Do not board. Walk the city all day.',
        hintZh: '工作日的白天穿着制服走路，是会被看的',
        hintEn: 'A uniform on a weekday morning gets looked at.',
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '你顶着所有人的目光走了一天', reasonEn: 'You walked all day under everybody looking' },
          { stat: 'knowledge', amount: -2, reasonZh: '课是没上，但你把这座城看了一遍', reasonEn: 'You missed the lessons and read the city instead' },
          { stat: 'proficiency', amount: 2, reasonZh: '你听了一整天路上的关西腔', reasonEn: 'A full day of overheard Kansai' }
        ],
        setFlags: ['skip_school_walked'],
        then: [
          { type: 'scene', scene: 'sannomiya_arcade' },
          { type: 'narration', zh: '工作日上午的商店街是另一个地方：没有学生，全是推着购物车的人和送货的三轮。', en: 'The shotengai on a weekday morning is a different place: no students, just shopping trolleys and delivery trikes.' },
          { type: 'narration', zh: '有个卖鱼的大叔冲你喊了一句什么。你没听懂，但语气是好的，你就笑了一下。', en: 'A fishmonger shouts something at you. You do not understand it, but the tone is friendly, so you smile.' },
          { type: 'narration', zh: '他又喊了一句，这次你听懂了：「学校は？」', en: 'He shouts again, and this time you get it: what about school?' },
          { type: 'narration', zh: '你说今天休み。他笑得很大声，然后塞给你一条烤鱼。', en: 'You say you have the day off. He laughs very loudly and hands you a grilled fish.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '傍晚你按平常的时间回到海风庄。制服上有海的味道，或者鱼的味道。', en: 'You get back to Umikaze-so at the usual time. Your uniform smells of the sea, or of fish.' },
  { type: 'narration', zh: '明天你得解释。但那是明天的事。', en: 'You will have to explain tomorrow. Tomorrow can have it.' },
  { type: 'effect', setFlags: ['skip_school_wandered'] }
];

// ==========================================================
// 🚄 远门：四个人的大阪、五个人的京都
//
// 四季那四次郊游都是两个人。两个人的一天写的是"她"；
// 人一多，写的东西就变了——三个人以上，重点不再是任何一个人，
// 而是**这些人凑在一起的时候，各自会怎么改写自己**。
//
// 所以这两段里主角说话很少。他主要负责付钱、数人头，
// 以及在某个时刻发现有人不见了。
//
// 门槛也高：得所有人都处到朋友以上。你不能带一个
// 只见过两次面的人去坐一小时的电车。
// ==========================================================

export const TRIP_OSAKA: StoryNode[] = [
  { type: 'scene', scene: 'osaka_shinsekai', bgm: 'town', titleZh: '大阪、四个人', titleEn: 'Osaka, Four of Us', subtitleZh: '休息日 · 新世界', subtitleEn: 'Day off · Shinsekai' },
  { type: 'narration', zh: '从三宫坐阪神到梅田三十分钟，再换地铁到动物园前。四个人，一张回数券，谁都不承认是自己提议的。', en: 'Thirty minutes on the Hanshin to Umeda, then the subway to Dobutsuen-mae. Four people, one book of tickets, and nobody admitting whose idea it was.' },
  { type: 'narration', characterImage: `${SORA}autumn_happy.webp`, zh: '空一出站就开始找串炸店，说她查了三家，全部都要去。', en: 'Sora starts looking for kushikatsu the moment they are through the gate, announcing that she has researched three places and intends to visit all of them.' },
  { type: 'narration', characterImage: `${MAKI}cardigan_neutral.webp`, zh: '真希说三家太少。', en: 'Maki says three is not very many.' },
  { type: 'narration', characterImage: `${ASUKA}casual_angry.webp`, zh: '明日香把她们两个人的行程表当场划掉了，换成她自己在电车上做的那份。', en: 'Asuka strikes both of their itineraries out on the spot and substitutes the one she made on the train.' },
  { type: 'narration', characterImage: `${HIKARI}casual_happy.webp`, zh: '光在旁边笑，说她第一次来大阪的时候也是这样，被人推着走，什么都没记住，但那天很开心。', en: 'Hikari laughs and says her first time in Osaka went like this too: pushed along, remembering nothing, and a very good day.' },
  {
    type: 'choice',
    promptZh: '通天阁底下，四个人站成一个僵持的形状。',
    promptEn: 'Under Tsutenkaku the four of you settle into a stand-off.',
    options: [
      {
        id: 'osaka_side_asuka',
        labelZh: '站明日香那边：按表走',
        labelEn: 'Back Asuka. Follow the schedule.',
        hintZh: '她做那张表花了四十分钟',
        hintEn: 'She spent forty minutes on that schedule.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '一天走完了七个地方', reasonEn: 'Seven places in one day' }],
        relations: [
          { char: CharacterId.ASUKA, familiarity: 5, affection: 9, reasonZh: '有人站在了她那张表这一边', reasonEn: 'Somebody took the schedule seriously' },
          { char: CharacterId.SORA, familiarity: 3, affection: -1, reasonZh: '串炸只吃到了两家', reasonEn: 'Only two of the three kushikatsu places' },
          { char: CharacterId.MAKI, familiarity: 2, affection: -1, reasonZh: '她全程都在唱反调', reasonEn: 'She objected to all of it, continuously' }
        ],
        then: [
          { type: 'narration', zh: '那张表精确到分钟，而且真的走完了。七个地方，一个没落。', en: 'The schedule is accurate to the minute, and it holds. Seven places, none skipped.' },
          { type: 'narration', characterImage: `${ASUKA}casual_happy.webp`, zh: '最后一站结束的时候明日香看了一眼手表，比预定早了四分钟。她什么都没说，但那一路走得很轻快。', en: 'At the last stop Asuka checks her watch: four minutes ahead. She says nothing, and walks noticeably lighter the rest of the way.' },
          { type: 'narration', characterImage: `${MAKI}cardigan_neutral.webp`, zh: '真希在最后一站买了两串炸，一串给了空，一串塞给明日香。「表には無いけどな」。', en: 'At the last stop Maki buys two skewers, gives one to Sora and pushes the other at Asuka. Not on the schedule, she says.' }
        ]
      },
      {
        id: 'osaka_scatter',
        labelZh: '「散了吧。六点在这儿集合。」',
        labelEn: '"Split up. Back here at six."',
        jp: '一回バラけよ。六時にここな。',
        hintZh: '四个人的一天不一定要四个人一直在一起',
        hintEn: 'A day for four does not have to be four people in a line.',
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你把一场僵持解开了', reasonEn: 'You dissolved a stand-off' }],
        relations: [
          { char: CharacterId.SORA, familiarity: 5, affection: 5, reasonZh: '三家串炸全部吃到了', reasonEn: 'All three kushikatsu places, achieved' },
          { char: CharacterId.MAKI, familiarity: 5, affection: 5, reasonZh: '她跟去了，虽然嘴上说是顺路', reasonEn: 'She went along, claiming it was on her way' },
          { char: CharacterId.HIKARI, familiarity: 4, affection: 4, reasonZh: '她挑了明日香那一边', reasonEn: 'She picked Asuka to walk with' },
          { char: CharacterId.ASUKA, familiarity: 4, affection: 4, reasonZh: '她的表没有被否决，只是没有被强加', reasonEn: 'Her schedule was not vetoed, merely not imposed' }
        ],
        setFlags: ['trip_osaka_split'],
        then: [
          { type: 'narration', zh: '空和真希去吃串炸。光跟着明日香去按表走。你一个人。', en: 'Sora and Maki go for kushikatsu. Hikari goes with Asuka and the schedule. You are on your own.' },
          { type: 'narration', zh: '你在新世界的巷子里走了两个小时，什么都没干，看了两局将棋。', en: 'You spend two hours in the alleys of Shinsekai doing nothing and watching two games of shogi.' },
          { type: 'scene', scene: 'osaka_dotonbori_canal' },
          { type: 'narration', zh: '六点，道顿堀的河边。四个人从四个方向到齐，没有一个人迟到。', en: 'Six o’clock, the canal at Dotonbori. Four people arrive from four directions and nobody is late.' },
          { type: 'narration', characterImage: `${SORA}autumn_happy.webp`, zh: '空拎着一整袋章鱼烧。真希手里是同一个袋子的另一半。', en: 'Sora is carrying a whole bag of takoyaki. Maki has the other half of the same bag.' },
          { type: 'narration', characterImage: `${ASUKA}casual_neutral.webp`, zh: '明日香的表提前完成了。她把剩下的一小时用来陪光在一家二手书店里翻了六十分钟。', en: 'Asuka finished the schedule early and spent the spare hour standing in a secondhand bookshop with Hikari.' },
          { type: 'narration', zh: '她们四个人各过各的一天，然后回到同一个地方。这件事比全程走在一起要难得多。', en: 'The four of them each had their own day and came back to the same place. That is much harder than staying in a line.' }
        ]
      },
      {
        id: 'osaka_food_first',
        labelZh: '站空和真希那边：先吃',
        labelEn: 'Back Sora and Maki. Food first.',
        hintZh: '这是大阪。这个理由站得住',
        hintEn: 'This is Osaka. That argument holds.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你把一张表否决了', reasonEn: 'You overruled a schedule' }],
        relations: [
          { char: CharacterId.SORA, familiarity: 6, affection: 7, reasonZh: '三家全部吃到，而且是你带的头', reasonEn: 'All three, and you led' },
          { char: CharacterId.MAKI, familiarity: 6, affection: 6, reasonZh: '她跟你击了一次掌，然后马上说那是意外', reasonEn: 'She high-fived you and immediately called it an accident' },
          { char: CharacterId.ASUKA, familiarity: 2, affection: -2, reasonZh: '她的表被当场否决了', reasonEn: 'Her schedule was vetoed in public' }
        ],
        then: [
          { type: 'narration', zh: '三家串炸，两家章鱼烧，一碗关东煮。空吃到第四十串的时候第一次说"够了"。', en: 'Three kushikatsu shops, two takoyaki stands, one oden. At the fortieth skewer Sora says "enough" for the first time.' },
          { type: 'narration', characterImage: `${ASUKA}casual_angry.webp`, zh: '明日香一整个下午都在生气。到了道顿堀她才承认——她的表上第一站也是串炸，只是排在下午两点。', en: 'Asuka is annoyed all afternoon. At Dotonbori she admits that kushikatsu was first on her schedule too. At two o’clock.' },
          { type: 'narration', characterImage: `${ASUKA}casual_shy.webp`, zh: '「……順番の問題なの」，她说。没有人接这句话。', en: 'It was a question of order, she says. Nobody takes her up on it.' }
        ]
      }
    ]
  },
  { type: 'scene', scene: 'osaka_dotonbori_canal' },
  { type: 'narration', zh: '晚上八点，回程的电车。四个人坐一排，三个人睡着了。', en: 'Eight o’clock, the train back. Four in a row, three of them asleep.' },
  { type: 'narration', characterImage: `${HIKARI}casual_neutral.webp`, zh: '光没睡。她看着窗外，忽然说：「うち、こういう日のために来たんかもしれん」。', en: 'Hikari is awake, looking out of the window. She says perhaps this is the sort of day she came here for.' },
  { type: 'narration', zh: '车过淀川的时候，桥上的灯一根一根从窗户上扫过去。', en: 'Crossing the Yodogawa, the lights on the bridge sweep across the window one at a time.' },
  {
    type: 'effect', setFlags: ['restday_trip_osaka'],
    effects: [
      { stat: 'guts', amount: 2, reasonZh: '你带四个人去了另一座城市，一个都没丢', reasonEn: 'You took four people to another city and lost none of them' },
      { stat: 'proficiency', amount: 2, reasonZh: '大阪腔和神户腔不是一回事，你现在知道了', reasonEn: 'Osaka and Kobe do not sound the same, and now you know it' }
    ],
    relations: [
      { char: CharacterId.HIKARI, familiarity: 4, affection: 5, reasonZh: '她说了那句"或许我就是为了这种日子来的"', reasonEn: 'She said perhaps this was what she came for' },
      { char: CharacterId.SORA, familiarity: 3, affection: 2, reasonZh: '她在电车上睡着了，靠在你这一边', reasonEn: 'She fell asleep on the train, leaning your way' },
      { char: CharacterId.MAKI, familiarity: 3, affection: 2, reasonZh: '她假装没看见空靠过来这件事', reasonEn: 'She pretended not to notice that' },
      { char: CharacterId.ASUKA, familiarity: 3, affection: 2, reasonZh: '她把回程的时刻表也做好了', reasonEn: 'She had made a schedule for the way back as well' }
    ]
  }
];

export const TRIP_KYOTO: StoryNode[] = [
  { type: 'scene', scene: 'kyoto_fushimi_torii', bgm: 'town', titleZh: '京都、五个人', titleEn: 'Kyoto, Five of Us', subtitleZh: '休息日 · 伏见稻荷', subtitleEn: 'Day off · Fushimi Inari' },
  { type: 'narration', zh: '从三宫到京都一个小时。五个人挤在一节车厢的同一头，被本地人当成修学旅行看。', en: 'An hour from Sannomiya. Five of you bunched at one end of a carriage, mistaken by locals for a school trip.' },
  { type: 'narration', characterImage: `${INARI}casual_neutral.webp`, zh: '稻荷是自己来的。她在伏见稻荷的第一座鸟居底下等你们，一句"哦呀"都没有说。', en: 'Inari came separately. She is waiting under the first torii at Fushimi and does not say her usual "oh my".' },
  { type: 'narration', characterImage: `${INARI}casual_neutral.webp`, zh: '她今天很安静。她一直在看那些鸟居上刻的名字。', en: 'She is quiet today. She keeps reading the names carved on the gates.' },
  { type: 'narration', characterImage: `${REI}casual_neutral.webp`, zh: '铃在数鸟居。她说资料上写一万座，她要验证一下。', en: 'Rei is counting torii. The literature says ten thousand and she intends to verify it.' },
  { type: 'narration', characterImage: `${NAO}casual_happy.webp`, zh: '奈绪在给所有人分饭团。她做了十二个，说这样每人两个还有富余。', en: 'Nao is handing out onigiri. She made twelve, on the theory that two each leaves a margin.' },
  { type: 'narration', characterImage: `${MIYUKI}cardigan_neutral.webp`, zh: '深雪拿着五个人的车票、五瓶水、和一盒创可贴。她一整天都没有让任何人看见她累。', en: 'Miyuki is holding five tickets, five bottles of water and a box of plasters. All day, she lets nobody see her tired.' },
  {
    type: 'choice',
    promptZh: '上山的路很长。走到一半的时候，你发现队伍已经散成了三截。',
    promptEn: 'It is a long way up. Halfway, you notice the group has come apart into three.',
    options: [
      {
        id: 'kyoto_back',
        labelZh: '走到最后面去',
        labelEn: 'Drop to the back',
        hintZh: '最后面是深雪',
        hintEn: 'Miyuki is at the back.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你去了队伍最后面', reasonEn: 'You went to the back of the line' }],
        relations: [
          { char: CharacterId.MIYUKI, familiarity: 5, affection: 12, reasonZh: '有人发现她一直在最后面', reasonEn: 'Somebody noticed she had been at the back the whole time' }
        ],
        setFlags: ['trip_kyoto_back'],
        then: [
          { type: 'narration', characterImage: `${MIYUKI}cardigan_neutral.webp`, zh: '她在最后面走。她说这样能看见所有人，谁掉队她马上知道。', en: 'She is walking at the back. That way she can see everybody, she says, and knows at once if anyone falls behind.' },
          { type: 'narration', zh: '你问那谁看着她。她愣了一下，然后笑了，说这个问题她没想过。', en: 'You ask who is watching her. She blinks, then laughs, and says she has never considered the question.' },
          { type: 'narration', characterImage: `${MIYUKI}cardigan_shy.webp`, zh: '接下来的四百级台阶你们走在一起。她第一次没有走在最后面。', en: 'You do the next four hundred steps together. For once she is not last.' }
        ]
      },
      {
        id: 'kyoto_inari',
        labelZh: '去找稻荷',
        labelEn: 'Go and find Inari',
        hintZh: '她已经落下很久了，而且不是因为累',
        hintEn: 'She has been behind for a while, and not because she is tired.',
        requires: { stat: 'knowledge', min: 10 },
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你看懂了她为什么安静', reasonEn: 'You understood why she was quiet' }],
        relations: [
          { char: CharacterId.INARI, familiarity: 4, affection: 14, reasonZh: '有人在一万座鸟居里找到了她', reasonEn: 'Somebody found her among ten thousand gates' }
        ],
        setFlags: ['trip_kyoto_inari'],
        then: [
          { type: 'narration', zh: '你在半山腰一条岔道上找到她。她站在一座很旧的鸟居前面，那座的字已经快看不清了。', en: 'You find her on a side path halfway up, in front of a very old gate whose lettering has nearly gone.' },
          { type: 'speech', speakerZh: '稻荷', speakerEn: 'Inari', characterImage: `${INARI}casual_sad.webp`, jp: 'この鳥居を建てた者、名前を知っておる。', zh: '立这座鸟居的人，我知道他的名字。', en: 'The one who raised this gate. I know his name.', color: 'bg-amber-500' },
          { type: 'narration', zh: '字看不清了，但她知道。她把那个名字念了一遍，念得很轻。', en: 'The lettering has gone and she knows it anyway. She says the name once, very quietly.' },
          { type: 'narration', characterImage: `${INARI}casual_neutral.webp`, zh: '然后她转过身，恢复了平常那个语气：「さ、行こう。皆待っておる」。', en: 'Then she turns round in her usual voice and says they should go; the others are waiting.' }
        ]
      },
      {
        id: 'kyoto_front',
        labelZh: '追到最前面',
        labelEn: 'Catch up with the front',
        hintZh: '最前面是铃，在数东西',
        hintEn: 'Rei is at the front, counting.',
        effects: [{ stat: 'proficiency', amount: 3, reasonZh: '你陪一个人数了八百座鸟居', reasonEn: 'You counted eight hundred torii with somebody' }],
        relations: [
          { char: CharacterId.REI, familiarity: 6, affection: 8, reasonZh: '有人愿意陪她把一件没意义的事做完', reasonEn: 'Somebody was willing to finish a pointless task with her' },
          { char: CharacterId.NAO, familiarity: 3, affection: 3, reasonZh: '她也跟上来了，纯粹因为热闹', reasonEn: 'Nao came too, purely for the company' }
        ],
        then: [
          { type: 'narration', characterImage: `${REI}casual_neutral.webp`, zh: '她数到八百一十七。她说她知道数不完，也知道"一万"是个约数。', en: 'She is at eight hundred and seventeen. She knows she will not finish, and knows that ten thousand is an approximation.' },
          { type: 'narration', zh: '你问那为什么还数。她说：因为有人问起来的时候，我想有一个自己数出来的数字。', en: 'You ask why she is counting then. Because if somebody asks, she says, she would like to have a number she arrived at herself.' },
          { type: 'narration', characterImage: `${NAO}casual_happy.webp`, zh: '奈绪听完之后开始帮她数，两个人数得对不上，从八百一十七吵到八百四十。', en: 'Nao starts counting too. Their numbers disagree, and they argue about it from eight hundred and seventeen to eight hundred and forty.' }
        ]
      }
    ]
  },
  { type: 'scene', scene: 'kyoto_bamboo' },
  { type: 'narration', zh: '下午去了岚山。竹林里的光是绿色的，五个人走进去之后，说话声就都变小了。', en: 'Arashiyama in the afternoon. The light in the bamboo is green, and after they walk in everybody’s voice drops.' },
  { type: 'narration', zh: '没有人说为什么要小声。竹子那么高，人自然就会。', en: 'Nobody says why. The bamboo is that tall, and people simply do.' },
  { type: 'scene', scene: 'kyoto_kamogawa' },
  { type: 'narration', zh: '傍晚在鸭川的河滩上坐下。五个人自然而然地排成了等距的一排——京都人管这个叫「鴨川等間隔の法則」。', en: 'They sit on the bank of the Kamo in the evening and naturally form an evenly spaced row. Kyoto people have a name for this.' },
  { type: 'narration', characterImage: `${NAO}casual_happy.webp`, zh: '奈绪最后两个饭团在这儿分掉了。一个给了深雪，一个掰成四份。', en: 'Nao’s last two onigiri go here: one to Miyuki, the other broken into four.' },
  { type: 'narration', characterImage: `${INARI}casual_neutral.webp`, zh: '稻荷说她上一次坐在这条河边是很久以前。她说"很久"的时候，没有人再追问是多久。', en: 'Inari says the last time she sat by this river was a long time ago. When she says "a long time", nobody asks how long.' },
  { type: 'narration', zh: '天黑之前你们赶上了回神户的电车。五个人，一个都没丢。', en: 'You make the train back to Kobe before dark. Five people, none lost.' },
  {
    type: 'effect', setFlags: ['restday_trip_kyoto'],
    effects: [
      { stat: 'knowledge', amount: 3, reasonZh: '一万座鸟居，八百一十七座是数过的', reasonEn: 'Ten thousand gates, eight hundred and seventeen of them counted' },
      { stat: 'kindness', amount: 3, reasonZh: '你数了一整天人头', reasonEn: 'You counted heads all day' },
      { stat: 'guts', amount: 1, reasonZh: '五个人的一整天，是你带的', reasonEn: 'A whole day for five, and you led it' }
    ],
    relations: [
      { char: CharacterId.MIYUKI, familiarity: 4, affection: 4, reasonZh: '鸭川那一排，她坐在中间', reasonEn: 'On the riverbank she sat in the middle for once' },
      { char: CharacterId.REI, familiarity: 4, affection: 3, reasonZh: '八百一十七', reasonEn: 'Eight hundred and seventeen' },
      { char: CharacterId.NAO, familiarity: 4, affection: 3, reasonZh: '十二个饭团，一个都没剩', reasonEn: 'Twelve onigiri, none left over' },
      { char: CharacterId.INARI, familiarity: 4, affection: 4, reasonZh: '她在鸭川边上说了"很久以前"', reasonEn: 'By the Kamo she said "a long time ago"' }
    ]
  }
];

// ==========================================================
// 🎤 三个人的卡拉OK
//
// 一年四次的郊游是两个人，大阪京都是四五个人。中间缺的是
// 那种**随便约一下就成的三个人**——不用挑季节，不用坐一小时电车，
// 放学后走两百米就到。
//
// 三个人是一个很特别的数字：两个人是对话，四个人会分成两组，
// 只有三个人的时候，永远有一个人在看另外两个。
// 而看的那个每隔十分钟就会换。
// ==========================================================

export const GROUP_KARAOKE: StoryNode[] = [
  { type: 'scene', scene: 'jazz_livehouse', bgm: 'town', titleZh: '三个人，两小时，一个包厢', titleEn: 'Three People, Two Hours, One Booth', subtitleZh: '放学后 · 三宫的卡拉OK', subtitleEn: 'After school · Karaoke in Sannomiya' },
  { type: 'narration', zh: '学生优惠，两小时七百日元，饮料吧无限。这个价格是真希查出来的，她查了四家。', en: 'Student rate, seven hundred yen for two hours, drinks bar included. Maki found it. She compared four places.' },
  { type: 'narration', characterImage: `${MAKI}punk_neutral.webp`, zh: '进包厢之前她先声明了一条规矩：不许点谁都会唱的那种。', en: 'Before going in she lays down one rule: nothing everybody already knows.' },
  { type: 'narration', characterImage: `${SORA}autumn_happy.webp`, zh: '空第一首就点了一首谁都会唱的。', en: 'Sora’s first pick is a song everybody knows.' },
  { type: 'narration', characterImage: `${HIKARI}casual_happy.webp`, zh: '光笑得从沙发上滑下去了。', en: 'Hikari laughs herself off the sofa.' },
  {
    type: 'choice',
    promptZh: '第一小时结束的时候，麦克风到了你手里。两个人都在看你。',
    promptEn: 'At the end of the first hour the microphone reaches you. Both of them are watching.',
    options: [
      {
        id: 'karaoke_japanese',
        labelZh: '点一首日文歌',
        labelEn: 'Pick a Japanese song',
        hintZh: '你会唱，但你没在人前唱过',
        hintEn: 'You can sing it. You have never sung it in front of anybody.',
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你用一门还不熟的语言唱了一首歌', reasonEn: 'You sang in a language you are not yet fluent in' },
          { stat: 'proficiency', amount: 2, reasonZh: '唱一遍比读十遍管用', reasonEn: 'Singing it once beat reading it ten times' }
        ],
        setFlags: ['group_karaoke_sang_jp'],
        then: [
          { type: 'narration', zh: '前奏起来的时候你后悔了。副歌那一句的语速你从来没跟上过。', en: 'You regret it during the intro. You have never once kept up with that line in the chorus.' },
          { type: 'narration', zh: '你没跟上。你唱错了三个地方，最后一句直接跑没了。', en: 'You do not keep up. Three mistakes, and the last line simply gets away from you.' },
          { type: 'narration', characterImage: `${SORA}happy.webp`, zh: '空鼓掌鼓得整个包厢都在响。她说"うまいやん"，说得非常真诚，而且非常不准确。', en: 'Sora applauds hard enough to fill the booth. She says you were good, with total sincerity and total inaccuracy.' },
          { type: 'narration', characterImage: `${MAKI}shy_alt.webp`, zh: '真希什么都没说。但她把那首歌加进了后面的列表里，加了两次。', en: 'Maki says nothing. She does add that song to the queue again. Twice.' }
        ]
      },
      {
        id: 'karaoke_home',
        labelZh: '点一首你自己国家的歌',
        labelEn: 'Pick a song from your own country',
        hintZh: '她们一个字都听不懂',
        hintEn: 'They will not understand a word.',
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '你让两个人听了一首她们听不懂的歌', reasonEn: 'You made two people sit through a song they could not follow' }
        ],
        setFlags: ['group_karaoke_sang_home'],
        then: [
          { type: 'narration', zh: '机器里居然有。你自己都没想到。', en: 'The machine has it. Even you did not expect that.' },
          { type: 'narration', zh: '你唱的时候没有人说话。两个人都在看屏幕上那些她们不认识的字。', en: 'Nobody talks while you sing. They both watch letters they cannot read go past on the screen.' },
          { type: 'narration', characterImage: `${HIKARI}casual_neutral.webp`, zh: '唱完之后光第一个开口。她说：这首歌是不是有点难过。', en: 'Hikari speaks first. She asks whether that song is a bit sad.' },
          { type: 'narration', zh: '她一个字都没听懂。她说对了。', en: 'She did not understand a word. She is right.' }
        ]
      },
      {
        id: 'karaoke_pass',
        labelZh: '把麦克风推给光',
        labelEn: 'Push the mic to Hikari',
        hintZh: '她一晚上都没唱过',
        hintEn: 'She has not sung all evening.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你注意到有人一晚上没唱过', reasonEn: 'You noticed who had not sung all evening' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 5, affection: 8, reasonZh: '有人把麦克风递给了她', reasonEn: 'Somebody handed her the microphone' }],
        then: [
          { type: 'narration', characterImage: `${HIKARI}casual_shy.webp`, zh: '她说不用不用，摆了三次手。第四次她接过去了。', en: 'She waves it off three times. On the fourth she takes it.' },
          { type: 'narration', zh: '她唱得非常好。好到空和真希都停下来了。', en: 'She is extremely good. Good enough that Sora and Maki both stop.' },
          { type: 'narration', characterImage: `${HIKARI}casual_shy.webp`, zh: '唱完她自己也愣了一下，然后小声说："うち、家でしか歌わへんから"。', en: 'She surprises herself too, and says quietly that she only ever sings at home.' },
          { type: 'narration', zh: '接下来一小时她唱了七首。', en: 'She sings seven more in the next hour.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '两小时到了。前台问要不要续，三个人同时说了"延長で"。', en: 'Two hours are up. The desk asks about extending. All three say yes at once.' },
  { type: 'narration', zh: '又续了一个小时。这一个小时里没有人再管"不许点谁都会唱的"这条规矩。', en: 'One more hour, in which nobody bothers with the rule about songs everybody knows.' },
  {
    type: 'effect', setFlags: ['restday_group_karaoke'],
    effects: [
      { stat: 'charm', amount: 2, reasonZh: '三个人，三小时，一个包厢', reasonEn: 'Three people, three hours, one booth' },
      { stat: 'proficiency', amount: 2, reasonZh: '你跟着屏幕读完了大概四十首歌的歌词', reasonEn: 'You read about forty songs’ worth of lyrics off a screen' }
    ],
    relations: [
      { char: CharacterId.SORA, familiarity: 6, affection: 4, reasonZh: '她给你鼓的那阵掌', reasonEn: 'That round of applause' },
      { char: CharacterId.MAKI, familiarity: 6, affection: 4, reasonZh: '她把你那首加了两次', reasonEn: 'She queued your song twice' },
      { char: CharacterId.HIKARI, familiarity: 6, affection: 5, reasonZh: '她在包厢里唱了七首', reasonEn: 'She sang seven songs in a karaoke booth' }
    ]
  }
];

// ==========================================================
// 🎪 文化祭前夜
//
// 四个人，一个通宵，一间没有暖气的教室。
// 这一段的重点不是文化祭，是**四个人在凌晨三点会说什么**。
// 白天说不出口的东西，到了凌晨三点会自己掉出来。
// ==========================================================

export const GROUP_FESTIVAL_EVE: StoryNode[] = [
  { type: 'scene', scene: 'classroom_sunset', bgm: 'night', titleZh: '文化祭前夜', titleEn: 'The Night Before', subtitleZh: '十一月 · 教室 · 晚上八点', subtitleEn: 'November · A classroom · Eight p.m.' },
  { type: 'narration', zh: '明天开幕。今晚要把三十六个纸箱糊成一条商店街。', en: 'It opens tomorrow. Tonight, thirty-six cardboard boxes have to become a shopping street.' },
  { type: 'narration', characterImage: `${ASUKA}neutral.webp`, zh: '明日香贴了一张进度表在黑板上。表上把今晚切成了十五分钟一格。', en: 'Asuka has taped a schedule to the blackboard. It divides the night into fifteen-minute blocks.' },
  { type: 'narration', characterImage: `${REI}neutral.webp`, zh: '铃在算承重。她说按现在的糊法，第三层会塌。她算了两遍。', en: 'Rei is calculating load. She says the third tier will collapse as currently glued. She has checked twice.' },
  { type: 'narration', characterImage: `${NAO}casual_happy.webp`, zh: '奈绪带了四个人的夜宵，装在一个比她还宽的袋子里。', en: 'Nao has brought supper for four in a bag wider than she is.' },
  { type: 'narration', characterImage: `${MIYUKI}cardigan_neutral.webp`, zh: '深雪是被叫来当"成年人监护"的。她说她只坐着，然后马上开始糊纸箱。', en: 'Miyuki is here as the responsible adult. She says she will only sit, and immediately starts gluing boxes.' },
  { type: 'narration', zh: '十点，进度表落后一格。十二点，落后三格。两点，明日香把表撕了。', en: 'At ten they are one block behind. At midnight, three. At two, Asuka takes the schedule down.' },
  {
    type: 'choice',
    promptZh: '凌晨三点。第三层果然塌了。四个人坐在一地纸箱中间。',
    promptEn: 'Three in the morning. The third tier has, as predicted, collapsed. Four people sitting in cardboard.',
    options: [
      {
        id: 'eve_rebuild',
        labelZh: '「按铃说的重做。」',
        labelEn: '"Rebuild it the way Rei said."',
        jp: '鈴の言うとおり作り直そ。',
        hintZh: '她两个小时前就算出来了',
        hintEn: 'She worked it out two hours ago.',
        effects: [
          { stat: 'knowledge', amount: 3, reasonZh: '你终于信了那两遍演算', reasonEn: 'You finally believed the arithmetic' },
          { stat: 'guts', amount: 2, reasonZh: '凌晨三点重来一遍', reasonEn: 'Starting over at three in the morning' }
        ],
        relations: [
          { char: CharacterId.REI, familiarity: 6, affection: 10, reasonZh: '两个小时之后终于有人采纳了她的计算', reasonEn: 'Two hours late, somebody used her numbers' },
          { char: CharacterId.ASUKA, familiarity: 4, affection: 4, reasonZh: '她没有坚持自己那张表', reasonEn: 'She did not defend her own schedule' }
        ],
        setFlags: ['group_eve_rebuilt'],
        then: [
          { type: 'narration', characterImage: `${REI}shy.webp`, zh: '铃愣了一下，然后从口袋里拿出一张纸。上面已经画好了改法。', en: 'Rei blinks, and takes a piece of paper out of her pocket. The revised method is already drawn on it.' },
          { type: 'narration', zh: '她两个小时前就画好了。她没有拿出来，因为没有人问。', en: 'She drew it two hours ago. She did not produce it, because nobody asked.' },
          { type: 'narration', characterImage: `${ASUKA}sad.webp`, zh: '明日香看了那张纸很久，然后说了句"ごめん"。', en: 'Asuka looks at the paper for a long time and says sorry.' },
          { type: 'narration', zh: '四点四十，第三层立住了。五点，天开始亮。', en: 'At twenty to five the third tier stands. At five it starts getting light.' }
        ]
      },
      {
        id: 'eve_sleep',
        labelZh: '「先睡二十分钟。」',
        labelEn: '"Twenty minutes. Everybody."',
        jp: '二十分だけ寝よ。全員。',
        hintZh: '四个人已经十九个小时没合眼了',
        hintEn: 'Nobody here has slept in nineteen hours.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你在凌晨三点叫停了四个人', reasonEn: 'You called a halt for four people at three in the morning' }],
        relations: [
          { char: CharacterId.MIYUKI, familiarity: 5, affection: 9, reasonZh: '有人替她说了那句"该休息了"', reasonEn: 'Somebody else said the thing she always has to say' },
          { char: CharacterId.NAO, familiarity: 4, affection: 5, reasonZh: '她三分钟就睡着了', reasonEn: 'She was asleep in three minutes' }
        ],
        setFlags: ['group_eve_slept'],
        then: [
          { type: 'narration', zh: '四个人趴在拼起来的课桌上。奈绪三分钟就睡着了，而且开始说梦话。', en: 'Four heads on pushed-together desks. Nao is asleep in three minutes and starts talking in her sleep.' },
          { type: 'narration', characterImage: `${MIYUKI}cardigan_shy.webp`, zh: '深雪是最后一个睡着的。她睡着之前把自己的外套盖到了明日香身上。', en: 'Miyuki is the last to go. Before she does she puts her own coat over Asuka.' },
          { type: 'narration', zh: '二十分钟变成了五十分钟。没有人定闹钟。', en: 'Twenty minutes becomes fifty. Nobody had set an alarm.' },
          { type: 'narration', zh: '醒来的时候是五点二十。第三层还是塌的。四个人一起笑了很久。', en: 'It is twenty past five when you wake. The third tier is still down. All four of you laugh for a long time.' }
        ]
      }
    ]
  },
  { type: 'scene', scene: 'kaisei_classroom_morning' },
  { type: 'narration', zh: '早上七点，开幕前一小时。那条商店街立在教室中间，有点歪，但立着。', en: 'Seven in the morning, an hour before opening. The shopping street stands in the middle of the classroom, slightly crooked, and standing.' },
  { type: 'narration', characterImage: `${NAO}casual_happy.webp`, zh: '奈绪把最后一个纸箱贴上去的时候，四个人一起鼓了掌。楼下的班级探头进来看了一眼，什么都没问。', en: 'When Nao tapes the last box on, all four of you applaud. The class from downstairs looks in and asks nothing.' },
  {
    type: 'effect', setFlags: ['restday_group_festival_eve'],
    effects: [
      { stat: 'guts', amount: 3, reasonZh: '一个通宵，三十六个纸箱', reasonEn: 'One all-nighter, thirty-six boxes' },
      { stat: 'kindness', amount: 2, reasonZh: '凌晨三点没有人吵架', reasonEn: 'Nobody argued at three in the morning' }
    ],
    relations: [
      { char: CharacterId.ASUKA, familiarity: 5, affection: 4, reasonZh: '她把自己的进度表撕了，而且没有生气', reasonEn: 'She took her own schedule down, and was not angry about it' },
      { char: CharacterId.REI, familiarity: 5, affection: 4, reasonZh: '她口袋里那张纸', reasonEn: 'That piece of paper in her pocket' },
      { char: CharacterId.NAO, familiarity: 5, affection: 4, reasonZh: '四个人的夜宵', reasonEn: 'Supper for four' },
      { char: CharacterId.MIYUKI, familiarity: 5, affection: 4, reasonZh: '她说她只坐着', reasonEn: 'She said she would only sit' }
    ]
  }
];

// ==========================================================
// 🎆 六个人的花火大会
//
// 这一段是全游戏人最多的一场。六个人，一条河堤，四十五分钟的烟花。
//
// 人多到这个程度，剧本就不能再管每个人。所以写法变了：
// 主角这一晚只做一件事——**数人头**。
// 而这一段真正的内容，是他每数一次，队伍就少一个人。
// ==========================================================

export const GROUP_HANABI: StoryNode[] = [
  { type: 'scene', scene: 'kobe_harbor', bgm: 'town', titleZh: 'みなと神戸海上花火大会', titleEn: 'The Harbour Fireworks', subtitleZh: '八月 · 傍晚六点', subtitleEn: 'August · Six in the evening' },
  { type: 'narration', zh: '一万发。港口那一带今晚会有二十万人。', en: 'Ten thousand shells. There will be two hundred thousand people around the harbour tonight.' },
  { type: 'narration', zh: '六个人约在三宫的鸽子雕像前面。到齐花了四十分钟，因为有两个人走错了出口。', en: 'Six of you agree to meet at the pigeon statue in Sannomiya. It takes forty minutes, because two people used the wrong exit.' },
  { type: 'narration', characterImage: `${NAO}yukata_happy.webp`, zh: '奈绪穿了浴衣。她说她自己系的腰带，说完就开始担心会不会散。', en: 'Nao is in a yukata. She says she tied the obi herself, and immediately starts worrying it will come undone.' },
  { type: 'narration', characterImage: `${ASUKA}yukata_smug.webp`, zh: '明日香也穿了浴衣，而且系得非常标准。她没有说是谁帮她系的。', en: 'Asuka is in a yukata too, immaculately tied. She does not say who tied it.' },
  { type: 'narration', characterImage: `${SORA}kimono_laugh.webp`, zh: '空穿浴衣配了运动鞋。她说木屐跑不动。没有人问她今晚为什么需要跑。', en: 'Sora has paired hers with trainers, on the grounds that you cannot run in geta. Nobody asks why she expects to run tonight.' },
  { type: 'narration', characterImage: `${MAKI}kimono_smug.webp`, zh: '真希的浴衣是租的，而且明显大了一号。她说这是故意的。', en: 'Maki’s is rented and visibly a size too big. She says that is deliberate.' },
  { type: 'narration', characterImage: `${HIKARI}yukata_happy.webp`, zh: '光带了六个人的水，装在一个保温包里。她说去年她中暑了。', en: 'Hikari has brought water for six in a cool bag. She says she got heatstroke last year.' },
  { type: 'narration', characterImage: `${MIYUKI}kimono_shy.webp`, zh: '深雪一直在数人头。你注意到了，因为你也在数。', en: 'Miyuki keeps counting heads. You notice, because you are doing it too.' },
  { type: 'narration', zh: '六个。你数了三遍，都是六个。', en: 'Six. You count three times. Six each time.' },
  { type: 'narration', zh: '走到河堤的时候是五个。', en: 'By the time you reach the embankment there are five.' },
  {
    type: 'choice',
    promptZh: '少的那个是空。花火还有十分钟开始。',
    promptEn: 'The missing one is Sora. Ten minutes to the first shell.',
    options: [
      {
        id: 'hanabi_find',
        labelZh: '去找',
        labelEn: 'Go and find her',
        hintZh: '二十万人。你要在二十万人里找一个人',
        hintEn: 'Two hundred thousand people. You are going to find one of them.',
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你在二十万人里逆着人流走了八百米', reasonEn: 'You walked eight hundred metres against two hundred thousand people' }
        ],
        relations: [{ char: CharacterId.SORA, familiarity: 6, affection: 12, reasonZh: '有人回去找她了', reasonEn: 'Somebody went back for her' }],
        setFlags: ['group_hanabi_found_sora'],
        then: [
          { type: 'narration', zh: '你逆着人流往回走。这件事比你想的难得多——八百米走了十二分钟。', en: 'You go back against the crowd. It is much harder than you expected: eight hundred metres in twelve minutes.' },
          { type: 'narration', zh: '第一发升空的时候你还在路上。整条街的人同时抬头，你在那一瞬间是唯一一个低着头找人的。', en: 'The first shell goes up while you are still walking. The whole street looks up at once, and for that moment you are the only person looking down.' },
          { type: 'narration', characterImage: `${SORA}kimono_shy.webp`, zh: '你在一个卖苹果糖的摊子后面找到了她。她蹲在那儿，正在帮一个走丢的小孩擦眼泪。', en: 'You find her behind a candy-apple stall, crouched down, wiping a lost child’s face.' },
          { type: 'narration', zh: '她抬头看见你，第一句话是：「この子の親、探すの手伝って」。', en: 'She looks up and the first thing she says is: help me find this child’s parents.' },
          { type: 'narration', zh: '你们花了二十分钟找到了那个孩子的妈妈。花火放到一半了。', en: 'It takes twenty minutes to find the mother. The fireworks are half over.' },
          { type: 'narration', characterImage: `${SORA}kimono_love.webp`, zh: '回河堤的路上她一句话都没说。走到一半她忽然说：「ありがと。ほんまに」。', en: 'She says nothing on the way back. Halfway there she says thank you, and that she means it.' }
        ]
      },
      {
        id: 'hanabi_hold',
        labelZh: '守住位置，让别人去找',
        labelEn: 'Hold the spot. Let somebody else go.',
        hintZh: '六个人的位置比一个人难占',
        hintEn: 'A spot for six is harder to hold than a person is to find.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你替五个人守住了那块地方', reasonEn: 'You held the ground for five people' }],
        relations: [
          { char: CharacterId.MIYUKI, familiarity: 5, affection: 6, reasonZh: '她去找人的时候，知道位置还在', reasonEn: 'She went knowing the spot would still be there' },
          { char: CharacterId.SORA, familiarity: 3, affection: 2, reasonZh: '她回来的时候位置还在', reasonEn: 'The spot was still there when she got back' }
        ],
        then: [
          { type: 'narration', characterImage: `${MIYUKI}kimono_shy.webp`, zh: '深雪去了。她走之前把水递给你，说"ここ、お願いね"。', en: 'Miyuki goes. Before she does she hands you the water and asks you to hold it.' },
          { type: 'narration', zh: '接下来二十分钟你一个人守着一块能坐六个人的河堤。旁边来了三拨人问能不能挤一挤。', en: 'For twenty minutes you hold a stretch of embankment big enough for six. Three separate groups ask whether they can squeeze in.' },
          { type: 'narration', zh: '你三次都说了"すみません、連れが来ます"。第三次你说得很流利，自己都吓了一跳。', en: 'Three times you say you are keeping it for people. The third time it comes out fluently, and startles you.' },
          { type: 'narration', characterImage: `${SORA}kimono_laugh.webp`, zh: '她们回来的时候花火放到一半了。空手里牵着一个小孩，那个小孩的妈妈跟在后面一路道谢。', en: 'They come back halfway through. Sora is holding a child’s hand, and the child’s mother follows, thanking everybody.' }
        ]
      }
    ]
  },
  { type: 'narration', zh: '最后十分钟是连发。整片天亮得像白天，河堤上二十万人一起不说话。', en: 'The last ten minutes are continuous. The sky goes as bright as day and two hundred thousand people go quiet together.' },
  { type: 'narration', zh: '你又数了一遍人头。六个。', en: 'You count heads again. Six.' },
  { type: 'narration', characterImage: `${MIYUKI}kimono_shy.webp`, zh: '深雪也在数。你们俩对上眼的时候，她笑了一下，比了个"六"。', en: 'Miyuki is counting too. When your eyes meet she smiles and holds up six fingers.' },
  { type: 'narration', zh: '散场花了一个半小时。六个人挤在同一节电车里，没有一个人有位子坐。', en: 'It takes ninety minutes to get out. Six people in one carriage, none of them sitting.' },
  { type: 'narration', characterImage: `${NAO}yukata_happy.webp`, zh: '奈绪的腰带最后还是散了。是明日香在电车上给她重新系的。', en: 'Nao’s obi does come undone in the end. Asuka reties it on the train.' },
  {
    type: 'effect', setFlags: ['restday_group_hanabi'],
    effects: [
      { stat: 'guts', amount: 2, reasonZh: '二十万人，六个人，一个都没丢', reasonEn: 'Two hundred thousand people, six of yours, none lost' },
      { stat: 'kindness', amount: 3, reasonZh: '你数了一整晚人头', reasonEn: 'You counted heads all night' },
      { stat: 'charm', amount: 2, reasonZh: '你用日语守住了一块河堤', reasonEn: 'You held a piece of riverbank in Japanese' }
    ],
    relations: [
      { char: CharacterId.NAO, familiarity: 4, affection: 4, reasonZh: '那条自己系的腰带', reasonEn: 'That self-tied obi' },
      { char: CharacterId.ASUKA, familiarity: 4, affection: 4, reasonZh: '她在电车上蹲下来给人系腰带', reasonEn: 'She knelt down on a train to retie somebody’s obi' },
      { char: CharacterId.MAKI, familiarity: 3, affection: 3, reasonZh: '大一号的浴衣，她说是故意的', reasonEn: 'The oversized yukata she insists was deliberate' },
      { char: CharacterId.HIKARI, familiarity: 4, affection: 4, reasonZh: '六个人的水', reasonEn: 'Water for six' },
      { char: CharacterId.MIYUKI, familiarity: 4, affection: 5, reasonZh: '她比的那个"六"', reasonEn: 'Those six fingers' },
      { char: CharacterId.SORA, familiarity: 3, affection: 3, reasonZh: '苹果糖摊子后面那件事', reasonEn: 'What happened behind the candy-apple stall' }
    ]
  }
];
