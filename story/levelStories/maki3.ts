import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 真希 · 第③段「一回だけ本音」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：高架下的游戏厅 + cg_maki
//
// 【第②段留下的题】
// 她最后说的是「今日のこと、勝負にせんといてな」——
// 一个把所有事都做成比赛的人，第一次要求一件事不要被算分。
// 但她也只敢要求那一次，第二天照样约"周三、游戏厅"。
//
// 【致敬：あの花 的あなる】
// 借的核是：**只能用刻薄说话的人，不是因为刻薄，
// 是因为诚实太危险。**
// 安鸣一直用刺人的方式对待自己最在乎的那群人，
// 因为一旦温柔，就等于承认自己需要他们，
// 而她赌不起被拒绝的那一下。
//
// 真希的版本：ざぁこ 是她的护城河。
// 这一段要让她过一次桥，而且必须是她自己走过来——
// 所以关键动作是**把选择权交给她**，不是替她拆桥。
//
// 【那台机器】
// 全段发生在同一台街机前面。她提的规则每次都在退：
// 三局两胜 → 先赢五局 → 这一次她说"不计分"。
// 分数一路退，退到最后没有分数了，剩下的只有两个人在一起打游戏。
// ---------------------------------------------------------

const K = '/images/characters/maki/';

export const MAKI_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'pia_kobe_arcade',
    bgm: 'town',
    titleZh: '一回だけ本音',
    titleEn: 'One Honest Thing, Once',
    subtitleZh: '夜 · 高架下',
    subtitleEn: 'Night · Under the tracks',
  },
  {
    type: 'narration',
    zh: '周三。最里面那台机器。你比约定的时间早到了十分钟。',
    en: 'Wednesday. The machine at the very back. You get there ten minutes early.'
  },
  {
    type: 'narration',
    characterImage: `${K}neutral.webp`,
    zh: '她已经在了。她永远已经在了。',
    en: 'She is already there. She is always already there.'
  },
  {
    type: 'narration',
    zh: '机台侧面贴了一张纸：「このゲーム、今月末で撤去します」。',
    en: 'There is a notice taped to the side of the cabinet: this machine is being removed at the end of the month.'
  },
  {
    type: 'narration',
    zh: '你看了三遍才反应过来那是什么意思。',
    en: 'You read it three times before it lands.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}neutral.webp`,
    jp: '知っとった。先月から貼ってあんねん。',
    zh: '我早就知道。上个月就贴了。',
    en: 'I knew. It has been up since last month.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '上个月。也就是说她每周三坐在那个台阶上的时候，就已经知道了。',
    en: 'Last month. Which is to say she already knew, on every one of those Wednesdays on the step.'
  },

  // ---- 中段：规则一路退 ----
  {
    type: 'narration',
    zh: '她投币。你也投币。',
    en: 'She puts a coin in. So do you.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}smug.webp`,
    jp: '今日は……',
    zh: '今天是……',
    en: 'Today is...',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '她停住了。她每次都会在这里报规则：三局两胜、先赢五局、输的人请章鱼烧。',
    en: 'She stops. This is the point where she announces the rules: best of three, first to five, loser buys takoyaki.'
  },
  {
    type: 'narration',
    characterImage: `${K}shy_alt.webp`,
    zh: '这一次她没有报。',
    en: 'This time she does not announce anything.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}shy_alt.webp`,
    jp: '……今日、点数つけへん。',
    words: [{ jp: '点数', reading: 'てんすう', zh: '分数', en: 'score' }],
    zh: '……今天，不计分。',
    en: '...No scoring today.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '你们打了大概一个小时。谁都没有数赢了几局。',
    en: 'You play for about an hour. Neither of you counts.'
  },
  {
    type: 'narration',
    zh: '这一个小时里她话很少。她平常是话最多的那个。',
    en: 'She barely talks for that hour. She is normally the one who never stops.'
  },
  {
    type: 'narration',
    characterImage: `${K}neutral.webp`,
    zh: '最后一局结束的时候，屏幕上跳出排行榜。第一名是 MAKI。第二名也是。第三名还是。',
    en: 'When the last round ends the leaderboard comes up. First place is MAKI. So is second. So is third.'
  },
  {
    type: 'narration',
    zh: '一直到第十名。十个名字全是同一个人。',
    en: 'All the way to tenth. Ten entries, one name.'
  },
  {
    type: 'narration',
    zh: '这台机器要在月底被搬走。搬走的时候，这十个名字也一起没了。',
    en: 'The machine goes at the end of the month. When it does, those ten names go with it.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '她一直看着那个排行榜，没有说话。',
    promptEn: 'She looks at the leaderboard and says nothing.',
    options: [
      {
        id: 'maki3_your_call',
        labelZh: '「今天你说了算。你想干嘛。」',
        labelEn: '"Today is yours. What do you want to do."',
        jp: '今日は真希が決めてええよ。なにしたい。',
        words: [{ jp: '決める', reading: 'きめる', zh: '决定', en: 'to decide' }],
        hintZh: '她的规则一直是用来保证对方必须回应她的。这次把规则交给她',
        hintEn: 'Her rules exist to guarantee the other person has to respond. Hand her the rules.',
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你把选择权给了一个从不敢要东西的人', reasonEn: 'You gave the choice to somebody who never asks for anything' },
          { stat: 'guts', amount: 1, reasonZh: '你没有替她决定', reasonEn: 'You did not decide for her' }
        ],
        relations: [{ char: CharacterId.MAKI, familiarity: 5, affection: 22, reasonZh: '她第一次被允许自己开口要', reasonEn: 'For the first time she was allowed to ask' }],
        setFlags: ['maki_story_her_call'],
        then: [
          {
            type: 'narration',
            characterImage: `${K}angry_alt.webp`,
            zh: '她马上顶了回来：「そんなん、ずるいやん」。',
            en: 'She bats it straight back: that is not fair.'
          },
          {
            type: 'narration',
            zh: '你说哪里赖皮。她说不上来。',
            en: 'You ask what is unfair about it. She cannot say.'
          },
          {
            type: 'narration',
            characterImage: `${K}shy_alt.webp`,
            zh: '她盯着屏幕看了很久。头顶的电车过去了两班。',
            en: 'She stares at the screen for a long time. Two trains go over.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}shy_alt.webp`,
            jp: '……この台、なくなる前に。',
            zh: '……在这台机器被搬走之前。',
            en: '...Before this machine goes.',
            color: 'bg-pink-500'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}shy_alt.webp`,
            jp: '一位、二人の名前にしたい。',
            zh: '第一名，我想写两个人的名字。',
            en: 'I want first place to have two names on it.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '排行榜只有四个字母的位置。她想的是把那四个字母分成两半。',
            en: 'The leaderboard allows four letters. What she is proposing is to split those four in half.'
          }
        ]
      },
      {
        id: 'maki3_ten_names',
        labelZh: '「这十个名字都是你一个人打的。」',
        labelEn: '"All ten of those are you, on your own."',
        jp: 'この十個、全部一人でやったんやろ。',
        hintZh: '她说过"说是比赛的话，大家就会来"。这十个名字说明大家没来',
        hintEn: 'She said that if you call it a match, people come. Ten identical names say they did not.',
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你读懂了一个排行榜', reasonEn: 'You read a leaderboard correctly' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 4, affection: 16, reasonZh: '有人看出了那十个名字的意思', reasonEn: 'Somebody understood what ten identical names meant' }],
        then: [
          {
            type: 'narration',
            characterImage: `${K}pout.webp`,
            zh: '她"せやけど"了一声，然后没有接下去。',
            en: 'She starts to object and does not finish.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}shy_alt.webp`,
            jp: '……一位から十位まで自分やと、誰とも競われへんねん。',
            zh: '……从第一到第十都是自己的话，就没法跟任何人比了。',
            en: '...When first through tenth are all you, there is nobody left to compete with.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '屏幕上那十行名字，你一行一行看下去。真的是十个她。',
            en: 'You read down the ten lines of names on the screen, one at a time. It really is ten of her.'
          }
        ]
      },
      {
        id: 'maki3_kouhai',
        labelZh: '「你到现在都没告诉我你姓什么。」',
        labelEn: '"You still have not told me your surname."',
        jp: '真希、名字なんて言うん。',
        hintZh: '你手机里存的是「後輩（ゲーセン）」',
        hintEn: 'She is saved in your phone as "kouhai (arcade)".',
        requires: { stat: 'charm', min: 6 },
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你指出了一件她一直在回避的小事', reasonEn: 'You named a small thing she had been avoiding' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 6, affection: 18, reasonZh: '她终于把姓给了你', reasonEn: 'She finally gave you the surname' }],
        setFlags: ['maki_story_surname'],
        then: [
          {
            type: 'narration',
            characterImage: `${K}angry_alt.webp`,
            zh: '她整个人转过来：「は？　今さら？」',
            en: 'The whole of her turns round. What, now?'
          },
          {
            type: 'narration',
            zh: '你说你手机里存的是「後輩（ゲーセン）」。她笑了很久。',
            en: 'You say she is saved in your phone as "kouhai (arcade)". She laughs for a long time.'
          },
          {
            type: 'narration',
            characterImage: `${K}shy_alt.webp`,
            zh: '笑完之后她小声说了三个字。你听见了，但你决定假装没听清，让她再说一遍。',
            en: 'When she stops she says it quietly. You hear it, and decide to pretend you did not, so that she has to say it again.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}shy_alt.webp`,
            jp: '……二回も言わせんな、あほ。',
            zh: '……别让我说第二遍，笨蛋。',
            en: '...Do not make me say it twice, idiot.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她还是说了第二遍。',
            en: 'She says it twice.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '游戏厅要关门了。店员开始一台一台关电源，声音一台一台矮下去。',
    en: 'The arcade is closing. The staff shut the machines down one at a time and the noise drops in steps.'
  },

  // ---- 双结局 ----
  {
    type: 'check',
    metric: 'affection',
    min: 200,

    // ============ 相爱 ============
    then: [
      {
        type: 'narration',
        characterImage: `${K}shy_alt.webp`,
        zh: '她投了最后一枚硬币，打完一局，第一名。输入名字的界面跳出来。',
        en: 'She puts in a last coin, plays a round, takes first. The name-entry screen comes up.'
      },
      {
        type: 'narration',
        zh: '四个字母的位置。她把摇杆推给你。',
        en: 'Four letters. She pushes the stick over to you.'
      },
      {
        type: 'speech',
        speakerZh: '真希', speakerEn: 'Maki',
        characterImage: `${K}shy_alt.webp`,
        jp: '前二つ、ウチ。後ろ二つ、そっち。',
        zh: '前两个我的。后两个你的。',
        en: 'First two mine. Last two yours.',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '你输完之后她一直盯着屏幕，没有说话。',
        en: 'You finish typing and she looks at the screen without saying anything.'
      },
      {
        type: 'narration',
        zh: '那四个字母会在这台机器里待到月底，然后跟这台机器一起消失。',
        en: 'Those four letters will sit in this machine until the end of the month, and then go with it.'
      },
      {
        type: 'speech',
        speakerZh: '真希', speakerEn: 'Maki',
        characterImage: `${K}shy_alt.webp`,
        jp: 'なあ。一回だけ、本音言うてええ？',
        words: [{ jp: '本音', reading: 'ほんね', zh: '真心话', en: 'what one actually means' }],
        zh: '喂。我能说一次真心话吗？',
        en: 'Hey. Can I say one honest thing, once?',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '你说可以。她深吸了一口气，然后说得非常快。',
        en: 'You say she can. She takes a breath and says it very fast.'
      },
      {
        type: 'speech',
        speakerZh: '真希', speakerEn: 'Maki',
        characterImage: `${K}happy.webp`,
        jp: 'ざぁこって言うたん、全部うそ。一回も思ったことない。',
        zh: '我说的那些"杂鱼"，全是假的。一次都没那么想过。',
        en: 'Every time I called you a weakling, that was a lie. I have never once thought it.',
        color: 'bg-pink-500'
      },
      {
        type: 'cg',
        cgId: 'cg_maki',
        imageUrl: '/images/cg/cg_maki.webp',
        titleZh: '后台霓虹的距离', titleEn: 'Neon, Backstage Distance',
        captionZh: '店里的灯一台一台灭下去。最后剩下这台机器的屏幕，把两个人的脸照成粉紫色。她没有退开。',
        captionEn: 'The machines go dark one by one. The last light in the room is this screen, and it turns both faces pink and violet. She does not step back.'
      },
      {
        type: 'speech',
        speakerZh: '真希', speakerEn: 'Maki',
        characterImage: `${K}happy.webp`,
        jp: '……で、これ、勝負ちゃうからな。',
        zh: '……然后，这个不是比赛啊。',
        en: '...And this is not a match, all right.',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '你说知道。她说那就好，然后把脸埋进你胸口，声音闷得几乎听不见：「……センパイ、ずるい」。',
        en: 'You say you know. She says good, puts her face into your chest, and says something so muffled it barely arrives: that you are unfair.'
      },
      {
        type: 'effect',
        setFlags: ['maki_ending_love', 'maki_story_3_done'],
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '排行榜第一名有两个人的名字', reasonEn: 'First place has two names on it' },
          { stat: 'kindness', amount: 2, reasonZh: '你把决定权留给了她，她自己走了过来', reasonEn: 'You left the decision with her, and she came across on her own' }
        ],
        relations: [
          { char: CharacterId.MAKI, familiarity: 12, affection: 24, reasonZh: '她说了一次真心话', reasonEn: 'She said one honest thing' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'narration',
        characterImage: `${K}neutral.webp`,
        zh: '她投了最后一枚硬币，打完一局，第一名。输名字的时候她只用了两个字母，剩下两格空着。',
        en: 'She puts in a last coin, plays a round, takes first. She types two letters into the name and leaves the other two blank.'
      },
      {
        type: 'speech',
        speakerZh: '真希', speakerEn: 'Maki',
        characterImage: `${K}neutral.webp`,
        jp: '空けとく。埋めたかったら、自分で来て埋めや。',
        words: [{ jp: '埋める', reading: 'うめる', zh: '填上', en: 'to fill in' }],
        zh: '空着。想填的话，自己来填。',
        en: 'Leaving it. If you want it filled in, come and fill it in yourself.',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '这台机器月底就搬走了。她给的期限只有三个星期。',
        en: 'The machine goes at the end of the month. The deadline she is offering is three weeks.'
      },
      {
        type: 'narration',
        characterImage: `${K}smug.webp`,
        zh: '走出游戏厅的时候她一直在笑。到路口她停下来。',
        en: 'She grins the whole way out. At the crossing she stops.'
      },
      {
        type: 'speech',
        speakerZh: '真希', speakerEn: 'Maki',
        characterImage: `${K}shy_alt.webp`,
        jp: 'あのな。ざぁこって言うの、あれ、',
        zh: '那个啊。我说"杂鱼"那个，那是，',
        en: 'Look. When I call you a weakling. That is,',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '她停住了，然后换了个说法。',
        en: 'She stops, and takes a different route.'
      },
      {
        type: 'speech',
        speakerZh: '真希', speakerEn: 'Maki',
        characterImage: `${K}happy_alt.webp`,
        jp: '……あれ言うてる相手、センパイだけやで。',
        zh: '……我只对前辈一个人说那个。',
        en: '...You are the only person I say it to.',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '这是她能说的最接近的一句。而且她说完就跑了——方向照旧是错的。',
        en: 'It is the closest thing she can produce. And she runs the moment it is out, in the wrong direction as usual.'
      },
      {
        type: 'narration',
        zh: '你们没有在一起。但那台机器搬走之前的每个周三，那两格一直空着，等你。',
        en: 'You are not together. But on every Wednesday until that machine goes, those two blank spaces are still there, waiting.'
      },
      {
        type: 'effect',
        setFlags: ['maki_ending_friend', 'maki_story_3_done'],
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '有两格是给你留的', reasonEn: 'Two spaces were being kept for you' }
        ],
        relations: [
          { char: CharacterId.MAKI, familiarity: 24, affection: 8, reasonZh: '那句话她只对一个人说', reasonEn: 'She says it to exactly one person' }
        ]
      }
    ]
  }
];
