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
          { type: 'narration', characterImage: `${REI}happy.webp`, zh: '她在你身后，很小声地说了一句：「……そうなる」。像是确认了一个早就预测好的结果。', en: 'Behind you she says, very quietly, that this is what happens. Like confirming a predicted result.' }
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
          { type: 'narration', characterImage: `${NAO}surprised.webp`, zh: '她愣住了。然后她说：「なんでわかったん」。', en: 'She freezes, and asks how you knew.' },
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
  { type: 'narration', characterImage: `${MIYUKI}casual_neutral.webp`, zh: '结果是三个人：她、你，和铃——铃是自己要来的，理由是「有馬の湯は鉄分濃度が高い。見たい」。', en: 'It ends up being three: her, you, and Rei, who invited herself on the grounds that the iron content at Arima is high and she wants to see it.' },
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
  { type: 'narration', characterImage: `${MIYUKI}casual_happy.webp`, zh: '三个人在坡道上买了炭酸煎饼，一边走一边吃。深雪买了两包，说带回去给你当早饭。', en: 'Three people buy carbonated crackers on the slope and eat them walking. Miyuki buys two extra packets and says they are your breakfast.' },
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
