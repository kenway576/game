import { StoryNode } from '../types';

// ---------------------------------------------------------
// 🎓 修了式
//
// 学年从 4/11 走到次年 3/24，347 天。这一段是那 347 天的尽头。
//
// 【为什么不是毕业】
// 主角是交换生，读的是一年。所以这不是毕业式，是修了式——
// 一个更小、更安静的仪式：没有人哭得很凶，校长讲话十分钟，
// 然后就散了。散了之后每个人各自回去准备下一年。
//
// 而主角的下一年不在这里。这是这一段全部的重量，
// 而且它一个字都不用点破：**所有人都还有明年，只有你没有**。
//
// 【写法】
// 不点名任何一个女主角。谁陪你走到最后，由玩家自己的存档决定，
// 剧本要是替他点了名，那一整年就白玩了。
// 这一段只写"最后一天"这件事本身，人由结算屏来算。
// ---------------------------------------------------------

export const YEAR_END: StoryNode[] = [
  {
    type: 'scene',
    scene: 'kaisei_gym_interior',
    bgm: 'night',
    titleZh: '修了式',
    titleEn: 'The Closing Ceremony',
    subtitleZh: '三月二十四日 · 体育馆',
    subtitleEn: '24th March · The gym'
  },
  {
    type: 'narration',
    zh: '体育馆里冷。三月的早上，所有人穿着冬季制服，呼出来的气看得见。',
    en: 'The gym is cold. A March morning, everybody in winter uniform, everybody\'s breath visible.'
  },
  {
    type: 'narration',
    zh: '校长讲了十一分钟。你听懂了大概九成——这件事你自己愣了一下才反应过来。',
    en: 'The principal speaks for eleven minutes. You follow about ninety per cent of it, and it takes you a moment to notice that you did.'
  },
  {
    type: 'narration',
    zh: '去年四月你站在同一个地方，一个字都没听懂。那天你数了地板上的木纹，数到第三十七条。',
    en: 'Last April you stood in this same place and understood none of it. That day you counted the boards in the floor and got to thirty-seven.'
  },
  {
    type: 'narration',
    zh: '这是修了式，不是毕业式。二年级三年级明年还会站在这儿，站在往前挪一排的位置上。',
    en: 'This is a closing ceremony, not a graduation. The second and third years will stand here again next year, one row further forward.'
  },
  {
    type: 'narration',
    zh: '你不会。你的名字在名册上只有一年。',
    en: 'You will not. Your name is on the roll for one year only.'
  },

  {
    type: 'scene',
    scene: 'classroom_sunset',
    bgm: 'chat',
    titleZh: '最后一次点名',
    titleEn: 'The Last Register',
    subtitleZh: '同日 · 教室',
    subtitleEn: 'Same day · The classroom'
  },
  {
    type: 'narration',
    zh: '回教室发成绩单。班主任念名字，一个一个上去拿。',
    en: 'Back in the classroom for report cards. The homeroom teacher reads out names one at a time.'
  },
  {
    type: 'narration',
    zh: '念到你名字的时候他念对了。这一年里他念错过十几次，从来没有人纠正过他——你也没有。',
    en: 'He gets your name right. He has got it wrong a dozen times this year and nobody has ever corrected him. You never did either.'
  },
  {
    type: 'narration',
    zh: '你回头才发现，是有人替你纠正的。什么时候纠正的，你不知道。',
    en: 'Only afterwards does it occur to you that somebody must have corrected him. You do not know when.'
  },

  {
    type: 'choice',
    promptZh: '放学之后，教室里的人慢慢走光了。窗外是三月很淡的太阳。',
    promptEn: 'The classroom empties slowly after school. Outside is the thin March sun.',
    options: [
      {
        id: 'yearend_desk',
        labelZh: '在自己的座位上再坐一会儿',
        labelEn: 'Sit at your own desk a little longer',
        hintZh: '这张桌子明年是别人的',
        hintEn: 'This desk belongs to somebody else next year.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你和这一年好好道了别', reasonEn: 'You said goodbye to the year properly' }],
        setFlags: ['yearend_sat_at_desk'],
        then: [
          {
            type: 'narration',
            zh: '桌面上有一道很浅的刻痕，是你第二个月的时候手滑划的。你一直没跟任何人说。',
            en: 'There is a faint scratch on the desktop from your second month, when your hand slipped. You never told anybody.'
          },
          {
            type: 'narration',
            zh: '你用手指摸了一遍那道痕。明年会有一个人坐在这儿，不知道这道痕是谁划的。',
            en: 'You run a finger along it. Somebody will sit here next year without knowing who made it.'
          },
          {
            type: 'narration',
            zh: '这样也好。留下一点没有署名的东西，本来就是待过一个地方最正常的结果。',
            en: 'That is all right. Leaving something unsigned is the ordinary result of having been somewhere.'
          }
        ]
      },
      {
        id: 'yearend_locker',
        labelZh: '去把鞋柜清空',
        labelEn: 'Go and empty your shoe locker',
        hintZh: '这一年所有东西都塞在那里面',
        hintEn: 'Everything from this year is jammed in there.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你数了一遍这一年攒下的东西', reasonEn: 'You counted what a year had accumulated' }],
        setFlags: ['yearend_cleared_locker'],
        then: [
          { type: 'scene', scene: 'school_lockers_hallway' },
          {
            type: 'narration',
            zh: '鞋柜里有：两把伞、一张过期的电影票、四张便利店收据、一包没拆的纸巾。',
            en: 'In the locker: two umbrellas, an expired cinema ticket, four convenience store receipts, an unopened packet of tissues.'
          },
          {
            type: 'narration',
            zh: '还有一叠纸条。你没数，因为你知道有多少张。',
            en: 'And a stack of notes. You do not count them, because you know how many there are.'
          },
          {
            type: 'narration',
            zh: '你把伞留在了鞋柜里。下一个用这个柜子的人下雨天会需要。',
            en: 'You leave the umbrellas. Whoever gets this locker next will want them on a wet day.'
          }
        ]
      },
      {
        id: 'yearend_walk',
        labelZh: '把学校走一遍',
        labelEn: 'Walk the whole school once',
        hintZh: '体育馆、图书室、天台、音乐室、食堂',
        hintEn: 'Gym, library, roof, music room, canteen.',
        requires: { stat: 'guts', min: 10 },
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '你把每个房间都又看了一次', reasonEn: 'You looked into every room one more time' },
          { stat: 'charm', amount: 2, reasonZh: '你记住了它们空着的样子', reasonEn: 'You memorised what they look like empty' }
        ],
        setFlags: ['yearend_walked_school'],
        then: [
          { type: 'scene', scene: 'school_hallway_new' },
          {
            type: 'narration',
            zh: '你从一楼走到四楼，每个房间开一下门，看一眼，关上。',
            en: 'You go from the ground floor to the fourth, opening each door, looking in, closing it.'
          },
          {
            type: 'narration',
            zh: '每个房间你都能想起一件具体的事。这是这一年真正的成绩单。',
            en: 'For every room there is one specific thing you can remember. That is the actual report card.'
          },
          { type: 'scene', scene: 'rooftop_sunset' },
          {
            type: 'narration',
            zh: '最后你上了天台。风还是冷的，但和四月那天不一样了——四月你冷得站不住，今天你站了二十分钟。',
            en: 'You finish on the roof. The wind is still cold, but not the way it was in April; in April you could not stand it, and today you stand there twenty minutes.'
          }
        ]
      }
    ]
  },

  {
    type: 'scene',
    scene: 'school_gate',
    bgm: 'night',
    titleZh: '校门',
    titleEn: 'The Gate',
    subtitleZh: '同日 · 傍晚',
    subtitleEn: 'Same day · Evening'
  },
  {
    type: 'narration',
    zh: '校门口的樱花已经有花苞了。四月它们会开——那时候这里会有一批新的人。',
    en: 'The cherry trees at the gate are already in bud. They will open in April, and there will be a new set of people here.'
  },
  {
    type: 'narration',
    zh: '你在门口回头看了一次。就一次。',
    en: 'You look back once at the gate. Once.'
  },
  {
    type: 'narration',
    zh: '去年四月你第一次站在这儿的时候，你在心里默念了一遍学校的名字，念了三遍才记住。',
    en: 'Standing here for the first time last April, you recited the school\'s name in your head three times before it stuck.'
  },
  {
    type: 'narration',
    zh: '现在你不用念了。',
    en: 'You do not have to now.'
  },
  {
    type: 'effect',
    setFlags: ['year_end_done'],
    effects: [
      { stat: 'knowledge', amount: 3, reasonZh: '一年', reasonEn: 'One year' },
      { stat: 'guts', amount: 3, reasonZh: '一年', reasonEn: 'One year' },
      { stat: 'kindness', amount: 3, reasonZh: '一年', reasonEn: 'One year' }
    ]
  }
];
