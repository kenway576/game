import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 铃 · 第①段「一九〇四年」
//
// 触发：親密度 Lv.3「朋友」(90)
// 场景：旧居留地十五番馆
//
// 她的表层是"三无"：没有语气起伏、只说事实、不解释自己。
// 第①段要露的不是"其实她很温柔"——那太便宜了。
// 要露的是：她那套不带感情的说法，本身就是一种非常费劲的照顾。
//
// 【致敬长门有希】
// 不写"其实是外星人"这种明面梗（那是主角在放学后已经拿来开过的玩笑）。
// 借的是长门真正的形状：一个用信息密度代替情绪表达的人。
// 她递给你的关心，长得像一份数据。你得学会读那份数据。
//
// 【1904 这个数字】
// 她在做一份建筑调查，逐栋记录神户洋馆的建成年份。
// 她带你去的那一栋，年份对不上——因为它被地震震塌过，重建了。
// 她说"重建的东西不算原来那个"，然后自己推翻了这个结论。
// 那是她第一次在你面前改自己的判断，也是这一段真正的落点。
// ---------------------------------------------------------

const R = '/images/characters/rei/';

export const REI_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'former_settlement_salon',
    bgm: 'town',
    titleZh: '一九〇四年',
    titleEn: 'Nineteen Oh Four',
    subtitleZh: '放学后 · 旧居留地',
    subtitleEn: 'After school · The Former Foreign Settlement'
  },
  {
    type: 'narration',
    zh: '她在校门口等你。不是"碰巧遇到"——她手里拿着两张打印好的地图，其中一张写着你的名字。',
    en: 'She is waiting at the school gate. Not by chance: there are two printed maps in her hand and one of them has your name on it.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: '今日は十五番館。徒歩十二分。異論は。',
    words: [{ jp: '徒歩', reading: 'とほ', zh: '步行', en: 'on foot' }],
    zh: '今天是十五番馆。步行十二分钟。有异议吗。',
    en: 'Today is Number Fifteen. Twelve minutes on foot. Objections.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '她说的是「异议」，不是「可以吗」。但她印了两张地图。',
    en: 'She says "objections", not "is that all right". She also printed two maps.'
  },
  {
    type: 'narration',
    characterImage: `${R}neutral.webp`,
    zh: '路上她一言不发，步履精确得像钟摆。行至中途，她忽然极其自然地放慢了半步，待你并肩跟上后，才重新维持着匀速向前。',
    en: 'She walks in silence, footsteps measured like a pendulum. Midway, she naturally drops half a step so you can catch up, then resumes her steady cadence.'
  },
  {
    type: 'narration',
    zh: '十五番馆是一栋两层的白色洋馆。门口有块小铜牌。',
    en: 'Number Fifteen is a two-storey white Western house. There is a small brass plaque by the door.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}lecturing.webp`,
    jp: '一八八〇年代築。現存する居留地建築で最古。',
    zh: '1880 年代建成。现存的居留地建筑里最古老的一栋。',
    en: 'Built in the 1880s. The oldest surviving building in the settlement.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '她翻开笔记本。密密麻麻的表格：地址、年份、材质、层数、备注。已经记了七十几栋。',
    en: 'She opens a notebook. Dense tables: address, year, material, storeys, notes. Seventy-odd buildings so far.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她在等你说点什么。她等人的时候是完全不动的，所以很难看出她在等。',
    promptEn: 'She is waiting for you to say something. When she waits she is entirely still, which makes it hard to tell that she is waiting.',
    options: [
      {
        id: 'rei1_why_this',
        labelZh: '「为什么是这些房子？」',
        labelEn: '"Why these buildings?"',
        jp: 'どうして、この建物なんですか。',
        hintZh: '七十几栋。这不是作业能解释的量',
        hintEn: 'Seventy-odd. Homework does not explain that number.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你问的是理由，不是数据', reasonEn: 'You asked for a reason, not for data' }],
        relations: [{ char: CharacterId.REI, familiarity: 6, affection: 4, reasonZh: '大部分人只问"要记到什么时候"', reasonEn: 'Most people only ask how long she intends to keep going' }],
        then: [
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '一九九五年に、たくさん消えたから。',
            words: [{ jp: '消える', reading: 'きえる', zh: '消失', en: 'to vanish' }],
            zh: '因为 1995 年，消失了很多。',
            en: 'Because in 1995 a great many of them vanished.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她说这句话的语气跟报年份一模一样平静。你怔了片刻才猛然反应过来——1995年，是阪神大地震。',
            en: 'She says it with the same quiet composure as reading dates. It takes you a stunned moment to realize — 1995 was the Great Hanshin Earthquake.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '記録がないものは、無かったことになる。',
            zh: '没有记录的东西，会变成不存在过。',
            en: 'A thing with no record becomes a thing that never was.',
            color: 'bg-indigo-500'
          }
        ]
      },
      {
        id: 'rei1_take_notes',
        labelZh: '掏出手账，跟着她一起记',
        labelEn: 'Get your journal out and take notes alongside her',
        hintZh: '你外公那本手账里也有神户的地名',
        hintEn: 'Your grandfather’s journal has Kobe place-names in it too.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你把她的表格抄了一半下来', reasonEn: 'You copied half her table down' }],
        relations: [{ char: CharacterId.REI, familiarity: 9, affection: 3, reasonZh: '她第一次不是一个人在记', reasonEn: 'For the first time she was not recording alone' }],
        setFlags: ['rei_story_took_notes'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}neutral.webp`,
            zh: '她静静注视着你翻开本子的举动，随后不声不响地将自己的笔记本平移转过来，好让你能清晰看到表格的行距和标注。',
            en: 'She silently observes you opening your notebook, then quietly slides her own over so you can clearly see the layout and annotations.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}lecturing.webp`,
            jp: '年代は左。材質は右。備考は下。',
            zh: '年代写左边。材质写右边。备注写下面。',
            en: 'Date on the left. Material on the right. Notes underneath.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她没有问你要不要学。她直接教了。',
            en: 'She does not ask whether you want to learn. She simply teaches you.'
          }
        ]
      },
      {
        id: 'rei1_grandfather',
        labelZh: '把外公的手账翻出来，问她认不认识这几个地名',
        labelEn: "Take out your grandfather's journal and ask if she knows these place-names",
        hintZh: '有些字你到现在都没认全',
        hintEn: 'There are characters in it you still have not made out.',
        requiresFlag: 'prologue_read_journal_deep',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你把那本手账给别人看了', reasonEn: 'You showed someone the journal' }],
        relations: [{ char: CharacterId.REI, familiarity: 7, affection: 8, reasonZh: '你交给她的是一份需要考据的东西', reasonEn: 'What you handed her was something that needed research' }],
        setFlags: ['rei_story_showed_journal'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}thinking.webp`,
            zh: '她接过手账的动作很轻，比她拿自己笔记本的时候还轻。',
            en: 'She takes the journal more carefully than she handles her own notebook.'
          },
          {
            type: 'narration',
            zh: '她看了很久。翻回去两页，又翻回来。',
            en: 'She reads for a long time. Turns back two pages, then forward again.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: 'この四つのうち、三つは今も同じ名前。一つは違う。',
            zh: '这四个里面，三个现在还是同一个名字。一个不是了。',
            en: 'Three of these four still carry the same name. One does not.',
            color: 'bg-indigo-500'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '……全部、私のリストに入ってる。',
            zh: '……四个全都在我的表里。',
            en: '...All four are on my list.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '一个几十年前来过神户的外国人，和一个每周末逐栋量房子的高中生，圈的是同一片地方。',
            en: 'A foreigner who came to Kobe decades ago, and a schoolgirl measuring buildings one by one every weekend, have circled the same patch of city.'
          }
        ]
      }
    ]
  },

  // ---- 那个对不上的年份 ----
  {
    type: 'narration',
    zh: '她带你绕到房子后面。那里有一小段砖墙，颜色和正面的不一样。',
    en: 'She takes you round the back. There is a short stretch of brickwork there, a different colour from the front.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: 'ここ。一九九五年に崩れて、解体して、番号を振って、また積み直した。',
    words: [{ jp: '積む', reading: 'つむ', zh: '堆、砌', en: 'to stack / to lay' }],
    zh: '这里。1995 年塌了，拆掉，编上号，又重新砌回去。',
    en: 'Here. It came down in 1995, was taken apart, numbered, and stacked back up again.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '一块一块编号，再一块一块砌回原位。你看着那面墙，想象那个工程量。',
    en: 'Every brick numbered, every brick returned to its place. You look at the wall and try to picture the labour.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}thinking.webp`,
    jp: '私の表では、これは「一九九八年」と書くべき。同じ材料でも、同じ建物ではない。',
    zh: '按我的表，这里应该写「1998 年」。就算是同样的材料，也不是同一栋建筑。',
    en: 'By my table this should read 1998. Same material or not, it is not the same building.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '她说完就不动了。你发现她其实没在跟你说话——她在跟这个结论较劲，已经较了不知道多久。',
    en: 'She stops. You realise she is not talking to you at all: she is arguing with that conclusion, and has been for some time.'
  },

  // ---- 选择 2：这一段的落点 ----
  {
    type: 'choice',
    promptZh: '她笔尖悬在那一格上，没有落下去。',
    promptEn: 'Her pen is hovering over that cell and not coming down.',
    options: [
      {
        id: 'rei1_same_building',
        labelZh: '「是同一栋。有人记得它原来的样子。」',
        labelEn: '"It is the same building. Somebody remembered what it looked like."',
        jp: '同じ建物だよ。元の形を覚えてた人がいたんだから。',
        words: [{ jp: '覚える', reading: 'おぼえる', zh: '记住', en: 'to remember' }],
        hintZh: '把砖编上号的那个人，是照着记忆编的',
        hintEn: 'Whoever numbered those bricks was working from memory.',
        effects: [
          { stat: 'kindness', amount: 2, reasonZh: '你替一栋房子说了话', reasonEn: 'You spoke up for a building' },
          { stat: 'knowledge', amount: 1, reasonZh: '你想明白了记录和记忆的区别', reasonEn: 'You worked out the difference between a record and a memory' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 5, affection: 12, reasonZh: '你给了她一个她自己不敢用的理由', reasonEn: 'You gave her a reason she would not let herself use' }],
        setFlags: ['rei_story_same_building'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}neutral.webp`,
            zh: '她看了你很久。久到你以为自己说错了。',
            en: 'She looks at you for a long time. Long enough that you think you have got it wrong.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}thinking.webp`,
            jp: '……記録より、記憶のほうが先にある。',
            zh: '……记忆，比记录更早。',
            en: '...Memory comes before the record.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她低头在那一格里写下「1880s」。写完没停笔，又在备注栏加了一行更小的字。',
            en: 'She writes 1880s in the cell. The pen does not stop; a line of smaller writing goes into the notes column as well.'
          },
          {
            type: 'narration',
            zh: '你偷看了一眼。备注写的是：「1995 年倒壊。番号を振って積み直された。」',
            en: 'You steal a look. The note reads: collapsed 1995. Numbered and stacked back up.'
          },
          {
            type: 'narration',
            zh: '她没有把重建这件事删掉。她把它记进了这栋房子的一部分。',
            en: 'She has not deleted the rebuilding. She has recorded it as part of what the building is.'
          }
        ]
      },
      {
        id: 'rei1_agree',
        labelZh: '「按你的标准写。你的表得站得住。」',
        labelEn: '"Write it by your own rule. Your table has to hold."',
        jp: '自分の基準で書けばいい。表が崩れたら意味ないだろ。',
        hintZh: '她的整张表都建立在同一个定义上',
        hintEn: 'The whole table stands on one definition.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你先想到的是这张表本身的完整性', reasonEn: 'Your first thought was for the integrity of the table itself' }],
        relations: [{ char: CharacterId.REI, familiarity: 9, affection: 4, reasonZh: '你认真对待了她的方法论', reasonEn: 'You took her methodology seriously' }],
        then: [
          {
            type: 'narration',
            zh: '她点了头，在那一格写下「1998」。写完之后笔没有立刻拿开。',
            en: 'She nods and writes 1998 in the cell. The pen does not lift straight away.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '……正しい。でも、気持ちが悪い。',
            words: [{ jp: '正しい', reading: 'ただしい', zh: '正确', en: 'correct' }],
            zh: '……是对的。但是不舒服。',
            en: '...It is correct. It also feels wrong.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '这是你第一次听见她用"感觉"来评价一个结论。她自己似乎也注意到了，皱了一下眉。',
            en: 'It is the first time you have heard her judge a conclusion by how it feels. She seems to notice too, and frowns slightly.'
          }
        ]
      },
      {
        id: 'rei1_ask_her',
        labelZh: '不给答案，问她自己想怎么写',
        labelEn: 'Give no answer. Ask what she wants to write.',
        hintZh: '她大概从来没被人问过这个',
        hintEn: 'Nobody has likely ever asked her that.',
        requires: { stat: 'kindness', min: 5 },
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没有替她决定', reasonEn: 'You did not decide it for her' }],
        relations: [{ char: CharacterId.REI, familiarity: 6, affection: 10, reasonZh: '她被问了一个只有主观答案的问题', reasonEn: 'She was asked a question that only has a subjective answer' }],
        then: [
          {
            type: 'narration',
            characterImage: `${R}shy.webp`,
            zh: '她沉默了很长时间。长到路灯亮了。',
            en: 'The silence goes on long enough for the street lights to come on.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}shy.webp`,
            jp: '……そういう聞き方、初めてされた。',
            zh: '……这种问法，第一次有人对我用。',
            en: '...Nobody has ever asked me a question that way.',
            color: 'bg-indigo-500'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '「一八八〇年代」と書きたい。理由は、説明できない。',
            zh: '我想写「1880 年代」。理由，说明不了。',
            en: 'I want to write 1880s. I cannot supply a reason.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '一个能把任何东西解释清楚的人，说了"说明不了"。她自己看起来比你还惊讶。',
            en: 'A person who can explain anything has just said she cannot explain. She looks more surprised by it than you are.'
          },
          {
            type: 'narration',
            zh: '她还是写下了「1880s」。',
            en: 'She writes 1880s anyway.'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '返程的路上她依旧沉默。行经原处时，她的步子再次悄然放缓了半步。',
    en: 'She remains quiet on the return. Passing the same spot, her pace quietly slows by half a step again.'
  },
  {
    type: 'narration',
    zh: '你这次终于敏锐地注意到了：她不是漫无目的地走慢，她是每次都在同一个视线死角的路口慢下来等你。',
    en: 'This time you catch it: she does not slow at random, but slows deliberately at the blind corner to wait for you.'
  },
  {
    type: 'narration',
    characterImage: `${R}neutral.webp`,
    zh: '到车站她停下，把那张写着你名字的地图递过来。',
    en: 'At the station she stops and holds out the map with your name on it.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: '次は北野。土曜、十時。返事は今じゃなくていい。',
    words: [{ jp: '返事', reading: 'へんじ', zh: '回复、答复', en: 'a reply' }],
    zh: '下次是北野。周六，十点。现在不用答复。',
    en: 'Kitano next. Saturday, ten o’clock. You do not have to answer now.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '地图背面写着从你家出发的路线，用的是你家的地址。',
    en: 'On the back of the map is a route drawn from your address.'
  },
  {
    type: 'narration',
    zh: '你从来没有告诉过她你住在哪儿。你也从来没告诉过她你不知道路。',
    en: 'You have never told her where you live. You have also never told her that you get lost.'
  },
  {
    type: 'effect',
    setFlags: ['rei_story_1_done'],
    effects: [
      { stat: 'knowledge', amount: 3, reasonZh: '一个下午，七十几栋房子里的一栋', reasonEn: 'One afternoon, one of seventy-odd buildings' },
      { stat: 'proficiency', amount: 1, reasonZh: '你学会了读她那种不带语气的句子', reasonEn: 'You are learning to read sentences with no tone in them' }
    ],
    relations: [
      { char: CharacterId.REI, familiarity: 10, affection: 5, reasonZh: '她印了两张地图，第二张背面写了你的路线', reasonEn: 'She printed two maps, and drew your route on the back of the second' }
    ]
  }
];
