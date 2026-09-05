import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 真希 · 第②段「待ち伏せの理由」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：高架下的 Live House · 夜
//
// 【致敬：からかい上手の高木さん（反过来用）】
// 高木さん那部作品里，捉弄是**唯一被允许的亲近方式**——
// 西片每次都以为自己在被玩，其实每一次捉弄都是一次靠近，
// 而高木什么都不用说，因为说了就结束了。
//
// 真希把这一招用到了极端：她管你叫「ざぁこ」，
// 她把每次见面都包装成一场比赛，因为**比赛有规则，
// 规则规定对方必须回应你**。而"我想见你"这句话没有规则保护。
//
// 【第②段的墙】
// 第①段她赢了两局还问要不要打第三局。这一段揭开的是：
// 她每天都在同一个地方等，而且已经等了很久——
// 但她准备了一整套说法来证明自己不是在等。
// 玩家撞上的墙是：**她宁可你以为她只是路过。**
//
// 【为什么在 Live House】
// 高架下那家。第一次撞见結束バンド那四个人也是在这儿。
// 她在那儿不是为了看演出——她在那儿是因为那是她一个人待着
// 也不会显得奇怪的地方。这一段要露的就是这个。
// ---------------------------------------------------------

const K = '/images/characters/maki/';

export const MAKI_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'jazz_livehouse',
    bgm: 'night',
    titleZh: '待ち伏せの理由',
    titleEn: 'Why She Waits',
    subtitleZh: '夜 · 高架下的 Live House',
    subtitleEn: 'Night · The live house under the tracks'
  },
  {
    type: 'narration',
    zh: '这周三你没去游戏厅。你去了三宫办一张交通卡，办完已经七点半。',
    en: 'You did not go to the arcade this Wednesday. You went to Sannomiya for a travel card and it was half seven by the time you were done.'
  },
  {
    type: 'narration',
    zh: '回去的路上你抄了高架下那条近路。',
    en: 'On the way back you cut through under the tracks.'
  },
  {
    type: 'narration',
    characterImage: `${K}punk_neutral.webp`,
    zh: '她坐在 Live House 门口的台阶上，一个人，手里拿着手机没在看。',
    en: 'She is sitting on the steps outside the live house, alone, holding a phone she is not looking at.'
  },
  {
    type: 'narration',
    zh: '你看了一眼手机。七点四十一。',
    en: 'You check your phone. Twenty to eight.'
  },
  {
    type: 'narration',
    zh: '游戏厅六点关排队机。也就是说，她在这儿至少坐了一个半小时。',
    en: 'The arcade closes the queue at six. Which means she has been sitting here at least an hour and a half.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她还没发现你。台阶上就她一个人。',
    promptEn: 'She has not noticed you. There is nobody else on the steps.',
    options: [
      {
        id: 'maki2_call',
        labelZh: '叫她一声',
        labelEn: 'Call out to her',
        jp: '真希。',
        hintZh: '直接一点',
        hintEn: 'Straightforward.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你没有绕过去', reasonEn: 'You did not walk around' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 4, affection: 8, reasonZh: '她整个人弹了一下', reasonEn: 'The whole of her jumped' }],
        then: [
          {
            type: 'narration',
            characterImage: `${K}angry_alt.webp`,
            zh: '她整个人弹了一下，手机差点掉了，接住之后马上换了个姿势——靠在栏杆上，一副等了很久很久也无所谓的样子。',
            en: 'She jumps hard enough to nearly drop the phone, catches it, and immediately rearranges herself against the rail into a posture of total indifference.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}punk_pout.webp`,
            jp: 'は？　なんでおるん。',
            zh: '哈？你怎么在这儿。',
            en: 'What? What are you doing here.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '这句话你听过。第①段她也是这么开场的，只是那次是她先说的。',
            en: 'You have heard that line. It was how she opened the first time, except that time she said it first.'
          }
        ]
      },
      {
        id: 'maki2_sit',
        labelZh: '什么都不说，在她旁边坐下',
        labelEn: 'Say nothing. Sit down next to her.',
        hintZh: '她最擅长的是接招。别给她招',
        hintEn: 'What she is best at is returning serve. Do not serve.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有给她一个可以顶回来的东西', reasonEn: 'You gave her nothing to bat back' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 3, affection: 13, reasonZh: '她准备好的那一整套没用上', reasonEn: 'The whole prepared routine went unused' }],
        setFlags: ['maki_story_sat_beside'],
        then: [
          {
            type: 'narration',
            zh: '你在她旁边坐下。台阶是凉的。',
            en: 'You sit down beside her. The step is cold.'
          },
          {
            type: 'narration',
            characterImage: `${K}shy_alt.webp`,
            zh: '她整个人僵了三秒，然后开始说话——说得非常快，全是关于游戏厅哪台机器坏了。',
            en: 'She locks up for three seconds and then starts talking, very fast, entirely about which machine at the arcade is broken.'
          },
          {
            type: 'narration',
            zh: '她讲了大概四分钟。中间一次都没有问你为什么坐下。',
            en: 'She goes on for about four minutes. She does not once ask why you sat down.'
          }
        ]
      },
      {
        id: 'maki2_time',
        labelZh: '「几点了。」',
        labelEn: '"What time is it."',
        jp: '今、何時？',
        hintZh: '她会看手机。她会知道你为什么问',
        hintEn: 'She will check. She will understand why you asked.',
        requires: { stat: 'charm', min: 6 },
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你用一个问题问了另一个问题', reasonEn: 'You asked one question in order to ask another' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 2, affection: 15, reasonZh: '她自己念出了那个时间', reasonEn: 'She read the time out herself' }],
        setFlags: ['maki2_asked_time'],
        then: [
          {
            type: 'narration',
            characterImage: `${K}punk_neutral.webp`,
            zh: '她低头看了一眼：「七時四十一」。',
            en: 'She glances down. Twenty to eight.'
          },
          {
            type: 'narration',
            zh: '她把手机举在那儿，没有放下去。屏幕自己暗掉了，她还举着。',
            en: 'She holds the phone where it is and does not put it down. The screen goes dark by itself and she is still holding it up.'
          },
          {
            type: 'narration',
            characterImage: `${K}angry_alt.webp`,
            zh: '她抬起头看你，眼神是那种被自己出卖了的眼神。',
            en: 'She looks up at you with the expression of somebody betrayed by herself.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}angry_alt.webp`,
            jp: '……なんも言うなよ。',
            zh: '……什么都别说。',
            en: '...Do not say anything.',
            color: 'bg-pink-500'
          }
        ]
      }
    ]
  },

  // ---- 中段：那一整套说法 ----
  {
    type: 'narration',
    zh: '她开始解释。你没有问，她还是开始解释了。',
    en: 'She starts explaining. You did not ask, and she starts explaining.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}punk_pout.webp`,
    jp: 'ここ、家帰る途中やねん。ほんまに。',
    zh: '这儿是我回家的路上。真的。',
    en: 'This is on my way home. It genuinely is.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '你知道她家在哪个方向。第①段结尾她跑掉的时候你就注意到了——她永远走错方向。',
    en: 'You know which way she lives. You noticed at the end of that first evening, when she ran off: she always goes the wrong way.'
  },
  {
    type: 'narration',
    zh: '而她走错的那个方向，正是这儿。',
    en: 'And the wrong way she always goes is this way.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}punk_neutral.webp`,
    jp: 'あと、ここ音漏れすんねん。中入らんでも聴こえる。',
    words: [{ jp: '音漏れ', reading: 'おともれ', zh: '漏出来的声音', en: 'sound leaking out' }],
    zh: '而且这儿漏音。不进去也听得见。',
    en: 'And the sound leaks out here. You can hear it without going in.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '这一条是真的。台阶这个位置正对着后门，里面在排练。',
    en: 'That part is true. This step faces the back door, and somebody is rehearsing inside.'
  },
  {
    type: 'narration',
    characterImage: `${K}punk_neutral.webp`,
    zh: '她准备了三条理由。她讲了三条。三条都合理。',
    en: 'She has three reasons prepared. She gives all three. All three hold up.'
  },
  {
    type: 'narration',
    zh: '一个偶然路过的人，不需要三条理由。',
    en: 'Somebody who happened to be passing does not need three reasons.'
  },
  {
    type: 'narration',
    zh: '你想起第①段那句：「勝負言うたら、来るやん。みんな」。',
    en: 'You think of what she said at the arcade: if you call it a match, people come.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '里面那段排练停了。台阶上只剩下电车从头顶过去的声音。',
    promptEn: 'The rehearsal inside stops. All that is left on the step is the trains going over.',
    options: [
      {
        id: 'maki2_no_reason',
        labelZh: '「不用理由也可以在这儿。」',
        labelEn: '"You are allowed to be here without a reason."',
        jp: '理由、なくてもええねんで。',
        words: [{ jp: '理由', reading: 'りゆう', zh: '理由', en: 'a reason' }],
        hintZh: '她准备了三条。她以为自己需要三条',
        hintEn: 'She prepared three. She believes she needs three.',
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你取消了她那套通行证', reasonEn: 'You revoked the permit she thought she needed' }
        ],
        relations: [{ char: CharacterId.MAKI, familiarity: 5, affection: 20, reasonZh: '有人告诉她不用买票也能进', reasonEn: 'Somebody told her she does not have to pay to get in' }],
        setFlags: ['maki_story_no_reason'],
        then: [
          {
            type: 'narration',
            characterImage: `${K}angry_alt.webp`,
            zh: '她张嘴要顶回来，顶到一半停了。',
            en: 'She opens her mouth to bat it back and stops halfway.'
          },
          {
            type: 'narration',
            zh: '你说：你每次见我都要先安排一场比赛。你不用安排。',
            en: 'You say: she arranges a contest before every single meeting. She does not have to arrange one.'
          },
          {
            type: 'narration',
            characterImage: `${K}shy_alt.webp`,
            zh: '她低下头，很久没说话。头顶又过去一列电车，九十秒。',
            en: 'She looks down and says nothing. Another train goes over. Ninety seconds.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}shy_alt.webp`,
            jp: '……そんなん、教えられてへんもん。',
            zh: '……那种事，没有人教过我啊。',
            en: '...Nobody ever taught me that.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '关西腔掉了。她认真的时候会掉。',
            en: 'The Kansai drops away. It does when she means it.'
          }
        ]
      },
      {
        id: 'maki2_how_long',
        labelZh: '「你每周三都在这儿坐到几点。」',
        labelEn: '"How late do you sit here every Wednesday?"',
        jp: '水曜、いつも何時までおるん。',
        hintZh: '不是问今天。是问"每周三"',
        hintEn: 'Not about today. About every Wednesday.',
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你把这件事从"今天"变成了"一直"', reasonEn: 'You moved this from today to always' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 4, affection: 14, reasonZh: '她没能反驳"每周三"这三个字', reasonEn: 'She could not argue with the words "every Wednesday"' }],
        then: [
          {
            type: 'narration',
            characterImage: `${K}punk_pout.webp`,
            zh: '她想说"不是每周"。她说不出口，因为你们两个都知道那是假的。',
            en: 'She wants to say it is not every week. She cannot, because you both know that is false.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}punk_pout.webp`,
            jp: '……八時半。',
            zh: '……八点半。',
            en: '...Half eight.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '两个半小时。每周三，两个半小时，在一个不会有人来的台阶上。',
            en: 'Two and a half hours. Every Wednesday, two and a half hours, on a step nobody comes to.'
          }
        ]
      },
      {
        id: 'maki2_believe',
        labelZh: '「哦，路过啊。」——接受她的说法',
        labelEn: '"Oh. Just passing." — take her at her word',
        jp: 'ふーん、通り道な。',
        hintZh: '她要的就是你别拆穿',
        hintEn: 'Not calling it is precisely what she is asking for.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你给了她想要的那个台阶', reasonEn: 'You gave her the exit she asked for' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 6, affection: 5, reasonZh: '她松了一口气，然后不太高兴', reasonEn: 'She was relieved, and then not pleased' }],
        then: [
          {
            type: 'narration',
            characterImage: `${K}punk_neutral.webp`,
            zh: '她"せやろ"了一声，明显松了口气。',
            en: 'She agrees, visibly relieved.'
          },
          {
            type: 'narration',
            zh: '然后她安静了很久。',
            en: 'Then she is quiet for a long time.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}punk_pout.webp`,
            jp: '……信じんの、はやすぎちゃう。',
            zh: '……你信得太快了吧。',
            en: '...You believed that awfully fast.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她要的是你别拆穿。她要的也是你别真的信。这两件事同时成立，而且她自己知道这不讲道理。',
            en: 'She wanted you not to call it. She also wanted you not to actually believe it. Both at once, and she knows that is not reasonable.'
          }
        ]
      }
    ]
  },

  // ---- 收：墙立起来 ----
  {
    type: 'narration',
    zh: '八点。里面开始放正式的演出，声音大了起来。',
    en: 'Eight o’clock. The real set starts inside and the sound comes up.'
  },
  {
    type: 'narration',
    characterImage: `${K}punk_neutral.webp`,
    zh: '她站起来，拍了拍裤子上的灰。',
    en: 'She stands and knocks the dust off the back of her shorts.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}smug.webp`,
    jp: 'センパイ、来週な。水曜。ゲーセン。',
    zh: '前辈，下周啊。周三。游戏厅。',
    en: 'Senpai. Next week. Wednesday. Arcade.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '她又把它变回了一场约好的比赛。',
    en: 'She has turned it back into an arranged match.'
  },
  {
    type: 'narration',
    characterImage: `${K}shy_alt.webp`,
    zh: '走出七八步之后她停下，没有回头，说了最后一句。',
    en: 'Seven or eight steps on she stops, without turning round, and says one last thing.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}shy_alt.webp`,
    jp: '……今日のこと、勝負にせんといてな。',
    zh: '……今天的事，别拿去当比赛啊。',
    en: '...Do not turn tonight into a match.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '一个把所有事都做成比赛的人，第一次要求一件事不要被算分。',
    en: 'Somebody who turns everything into a contest has, for the first time, asked for one thing not to be scored.'
  },
  {
    type: 'narration',
    zh: '然后她跑了。方向还是错的。',
    en: 'Then she runs. Still the wrong way.'
  },
  {
    type: 'effect',
    setFlags: ['maki_story_2_done', 'maki_story_the_steps'],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '你学会了从三条理由里听出没有理由', reasonEn: 'You learned to hear no reason inside three reasons' },
      { stat: 'kindness', amount: 1, reasonZh: '你在一个凉台阶上坐了一个小时', reasonEn: 'You sat on a cold step for an hour' }
    ],
    relations: [
      { char: CharacterId.MAKI, familiarity: 8, affection: 14, reasonZh: '她说了那个时间：八点半', reasonEn: 'She gave you the time: half eight' }
    ]
  }
];
