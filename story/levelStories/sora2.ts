import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 空 · 第②段「肩の話」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：夜里的体育馆
//
// 【致敬：スラムダンク的三井寿 × ピンポン的ペコ】
//
// 三井那一半借的不是"不良回头"，是**失去了两年之后回来的人，
// 最怕的不是打不好，是被人说"你已经不是那个你了"**。
// 他那句「バスケがしたいです」之所以要跪着说，是因为承认想要
// 比承认失败难得多。
//
// ペコ那一半更狠：**曾经是最好的那个，某天发现自己不再享受它了。**
// 空的问题不是肩膀疼——肩膀只是给了她一个不用回答的理由。
// 真正的问题是她已经开始怀疑，如果不能是最好的那个，
// 她还愿不愿意打。
//
// 【第②段的墙】
// 她的表层是"什么都无所谓、笑着就过去了"。这一段撞上的是：
// 那个"无所谓"是她拿来盖住"我不敢知道答案"的盖子。
// 所以玩家越是给她加油，她越是往后退——加油等于要求她回答。
//
// 【为什么在夜里的体育馆】
// 白天有人。这件事只能在没有人看见的时候发生，
// 而她之所以在没人的时候还来，本身就是答案的一半。
// ---------------------------------------------------------

const S = '/images/characters/sora/';

export const SORA_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'gym',
    bgm: 'night',
    titleZh: '肩の話',
    titleEn: 'About the Shoulder',
    subtitleZh: '夜 · 体育馆',
    subtitleEn: 'Night · The gym'
  },
  {
    type: 'narration',
    zh: '八点四十。校门本来九点锁，体育馆的灯不该还亮着。',
    en: 'Twenty to nine. The gates lock at nine and the gym lights should not still be on.'
  },
  {
    type: 'narration',
    zh: '你是回来拿落在鞋柜里的东西的。你本来可以直接走。',
    en: 'You came back for something you left in your locker. You could have simply gone.'
  },
  {
    type: 'narration',
    characterImage: `${S}school_neutral.webp`,
    zh: '她一个人在场上。没有换球衣，制服外套扔在地上。她在投篮。',
    en: 'She is alone on the court. She has not changed; her blazer is on the floor. She is shooting.'
  },
  {
    type: 'narration',
    zh: '你数了一下。她连投了十一个，进了十一个。',
    en: 'You count. Eleven in a row. Eleven in.'
  },
  {
    type: 'narration',
    zh: '第十二个的时候，她换了手。',
    en: 'On the twelfth she changes hands.'
  },
  {
    type: 'narration',
    zh: '左手。她是右撇子。',
    en: 'Left. She is right-handed.'
  },
  {
    type: 'narration',
    characterImage: `${S}school_sad.webp`,
    zh: '左手那个没进。她捡回来，又用左手投。又没进。',
    en: 'The left-handed one misses. She fetches it and shoots left-handed again. Misses again.'
  },
  {
    type: 'narration',
    zh: '她投了大概二十个左手球。中间一次都没有用右手。',
    en: 'She takes about twenty left-handed shots. She does not use her right once.'
  },
  {
    type: 'narration',
    zh: '你想起第①段那两次示范：第二次她压低了右手，出手快了半拍。',
    en: 'You think of the two demonstrations that first afternoon: the second one, her right arm lower, the release half a beat early.'
  },
  {
    type: 'narration',
    zh: '你也想起她说的那句「その話は、また今度な」。',
    en: 'And of what she said: that one was for another day.'
  },

  // ---- 选择 1：怎么进场 ----
  {
    type: 'choice',
    promptZh: '她还没发现你。你站在门口。',
    promptEn: 'She has not noticed you. You are standing in the doorway.',
    options: [
      {
        id: 'sora2_walk_in',
        labelZh: '走进去，把球捡回来递给她',
        labelEn: 'Walk in, fetch the ball, hand it to her',
        hintZh: '第一天你就是这么做的',
        hintEn: 'It is what you did on the first day.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有先问', reasonEn: 'You did not lead with a question' }],
        relations: [{ char: CharacterId.SORA, familiarity: 5, affection: 9, reasonZh: '你做了和第一天一样的事', reasonEn: 'You did the same thing you did on the first day' }],
        then: [
          {
            type: 'narration',
            characterImage: `${S}shock.webp`,
            zh: '她转过来的时候明显吓了一跳，随即整个人换上了那副笑：「うわ、なんでおるん」。',
            en: 'She jumps when she turns, and the grin goes straight on: what are you doing here.'
          },
          {
            type: 'narration',
            zh: '你把球递过去。她接的时候用的是左手。',
            en: 'You hand her the ball. She takes it with her left hand.'
          },
          {
            type: 'narration',
            zh: '你们都看见了这件事。谁都没说。',
            en: 'You both notice. Neither of you says anything.'
          }
        ]
      },
      {
        id: 'sora2_watch',
        labelZh: '不出声，靠在门框上看完',
        labelEn: 'Say nothing. Lean on the frame and watch.',
        hintZh: '她投完自然会发现你',
        hintEn: 'She will notice when she stops.',
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你数完了那二十个球', reasonEn: 'You counted all twenty of them' }],
        relations: [{ char: CharacterId.SORA, familiarity: 3, affection: 12, reasonZh: '她被完整地看了一次', reasonEn: 'She was watched, all the way through' }],
        setFlags: ['sora_story_watched_all'],
        then: [
          {
            type: 'narration',
            zh: '第二十一个球出手之后，她终于发现门口有人。',
            en: 'After the twenty-first she finally sees somebody in the doorway.'
          },
          {
            type: 'narration',
            characterImage: `${S}shock.webp`,
            zh: '她没有立刻说话。她先低头看了一眼自己的右手，然后才抬起头。',
            en: 'She does not speak straight away. She looks down at her own right hand first, and only then looks up.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}school_sad.webp`,
            jp: '……どっからおった。',
            zh: '……从哪儿开始看的。',
            en: '...From where.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '你说从第十二个。她"あー"了一声，把球夹在腰上，没有再看你。',
            en: 'You say from the twelfth. She makes a long noise, tucks the ball against her hip, and does not look at you again.'
          }
        ]
      },
      {
        id: 'sora2_lights',
        labelZh: '按了一下开关，把灯关了又开',
        labelEn: 'Hit the switch. Lights off, then on again.',
        hintZh: '让她知道有人来了，但不用你说话',
        hintEn: 'Announce yourself without having to say anything.',
        requires: { stat: 'charm', min: 5 },
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你替她省掉了被撞见那一下', reasonEn: 'You spared her the moment of being caught' }],
        relations: [{ char: CharacterId.SORA, familiarity: 4, affection: 13, reasonZh: '她有两秒钟可以把表情装回去', reasonEn: 'She had two seconds to put her face back on' }],
        then: [
          {
            type: 'narration',
            zh: '灯灭了两秒，又亮了。',
            en: 'The lights go out for two seconds and come back.'
          },
          {
            type: 'narration',
            characterImage: `${S}school_neutral.webp`,
            zh: '等你走到场边的时候，她已经笑起来了，球在指尖上转着。表情装得很好。',
            en: 'By the time you reach the sideline she is already grinning, the ball spinning on a fingertip. It is a good job.'
          },
          {
            type: 'narration',
            zh: '只是她转球用的是左手。',
            en: 'Except that the hand it is spinning on is her left.'
          }
        ]
      }
    ]
  },

  // ---- 中段：那个数字 ----
  {
    type: 'narration',
    zh: '你们在场边坐下。地板是凉的。',
    en: 'You sit down at the edge. The floor is cold.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_neutral.webp`,
    jp: '別に、大したことちゃうねん。',
    zh: '也没什么大不了的。',
    en: 'It is not a big deal or anything.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她开头是这么说的。然后她讲了十分钟。',
    en: 'That is how she starts. Then she talks for ten minutes.'
  },
  {
    type: 'narration',
    zh: '中学三年级的县大会，半决赛，第三节。她抢一个前场篮板，落地的时候右肩先着地。',
    en: 'The prefectural semi-final in her third year of middle school, third quarter. She goes up for an offensive board and comes down on her right shoulder first.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_neutral.webp`,
    jp: 'そのまま最後までやった。勝ったで。',
    zh: '就那么打完了。赢了哦。',
    en: 'Played it out. We won, you know.',
    color: 'bg-orange-500'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: '決勝は出られへんかったけどな。',
    zh: '不过决赛没能上。',
    en: 'Could not play the final, though.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你问现在还疼吗。',
    en: 'You ask whether it still hurts.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_neutral.webp`,
    jp: '痛ないよ。もう治っとる。',
    words: [{ jp: '治る', reading: 'なおる', zh: '痊愈', en: 'to heal' }],
    zh: '不疼。早就好了。',
    en: 'It does not hurt. It healed ages ago.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '这句话是真的。医生也是这么说的。她给你看过诊断书，就在书包里，随身带着。',
    en: 'That is true. It is what the doctor said. She shows you the paperwork; she carries it in her bag.'
  },
  {
    type: 'narration',
    zh: '一张两年前就说"已痊愈"的诊断书，被她随身带了两年。',
    en: 'A piece of paper that has said "healed" for two years, carried on her person for two years.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: '……治っとるのに、届かへんねん。あと五センチ。',
    zh: '……明明好了，就是够不到。差五公分。',
    en: '...It healed, and it still will not reach. Five centimetres short.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '五公分。她说这个数字的时候语气很平，平到你知道她量过很多次。',
    en: 'Five centimetres. She gives the number flatly, flatly enough that you know she has measured it many times.'
  },

  // ---- 关键选择：这一段最重的一下 ----
  {
    type: 'choice',
    promptZh: '她把球放在两个人中间的地板上，没有再碰它。',
    promptEn: 'She puts the ball on the floor between you and does not touch it again.',
    options: [
      {
        id: 'sora2_still_love',
        labelZh: '「你现在还喜欢打球吗。」',
        labelEn: '"Do you still like playing?"',
        jp: '今も、バスケ好き？',
        words: [{ jp: '今も', reading: 'いまも', zh: '现在也、依然', en: 'still, even now' }],
        hintZh: '所有人都问她还能不能打。没有人问过她还想不想',
        hintEn: 'Everyone asks whether she can still play. Nobody has asked whether she still wants to.',
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你问的是想不想，不是能不能', reasonEn: 'You asked about wanting, not about being able' },
          { stat: 'guts', amount: 1, reasonZh: '这个问题的答案可能是"不"', reasonEn: 'The answer to that could have been no' }
        ],
        relations: [{ char: CharacterId.SORA, familiarity: 5, affection: 18, reasonZh: '两年来第一次有人问对了问题', reasonEn: 'In two years, the first time anyone asked the right question' }],
        setFlags: ['sora_story_still_love'],
        then: [
          {
            type: 'narration',
            characterImage: `${S}shock.webp`,
            zh: '她整个人僵了一下。',
            en: 'Something in her locks.'
          },
          {
            type: 'narration',
            zh: '这两年所有人问的都是同一个问题的不同说法：还能打吗、还有救吗、要不要转项。',
            en: 'For two years everybody has asked the same question in different words: can you still play, is it fixable, have you considered another sport.'
          },
          {
            type: 'narration',
            zh: '没有一个人问过她还想不想。',
            en: 'Not one of them asked whether she still wanted to.'
          },
          {
            type: 'narration',
            characterImage: `${S}school_sad.webp`,
            zh: '她低头看着那个球，看了很久。',
            en: 'She looks at the ball for a long time.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}school_sad.webp`,
            jp: '……こわいねん。好きって言うたら、',
            zh: '……我怕。要是说了喜欢，',
            en: '...I am scared. If I say I like it,',
            color: 'bg-orange-500'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}school_sad.webp`,
            jp: 'また、あと五センチのために三年やらなあかんくなるやん。',
            zh: '就又得为了那五公分再拼三年了嘛。',
            en: 'then I have to spend another three years on five centimetres.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她怕的不是打不好。她怕的是自己还想要。',
            en: 'What frightens her is not being bad at it. What frightens her is still wanting it.'
          }
        ]
      },
      {
        id: 'sora2_five_cm',
        labelZh: '「五公分是谁量的。」',
        labelEn: '"Who measured the five centimetres?"',
        jp: 'その五センチ、誰が測ってん。',
        hintZh: '一个精确的数字，一定有个来源',
        hintEn: 'A number that precise came from somewhere.',
        requires: { stat: 'knowledge', min: 5 },
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你追问了那个数字是谁给的', reasonEn: 'You asked where the number came from' }],
        relations: [{ char: CharacterId.SORA, familiarity: 6, affection: 12, reasonZh: '她第一次意识到那个标准是别人定的', reasonEn: 'She realised for the first time that somebody else set that bar' }],
        then: [
          {
            type: 'narration',
            characterImage: `${S}shock.webp`,
            zh: '她愣了一下，然后答了：初中的教练。',
            en: 'It stops her. Then she answers: her middle-school coach.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}school_neutral.webp`,
            jp: '「県で戦うなら、あと五センチ」って',
            zh: '「要在县里打，就还差五公分」，他是这么说的。',
            en: 'He said: if you want to compete at prefecture level, five centimetres more.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '那是两年前的话，说的是那时候的她，为了那时候的那支队伍。',
            en: 'That was two years ago, about who she was then, for the team she was on then.'
          },
          {
            type: 'narration',
            zh: '她把那句话原封不动地带到了现在，而且一次都没有想过要重新量。',
            en: 'She has carried the sentence forward untouched, and it has not once occurred to her to measure again.'
          }
        ]
      },
      {
        id: 'sora2_cheer',
        labelZh: '「你肯定能回去的。加油。」',
        labelEn: '"You will get back there. Keep at it."',
        jp: '絶対戻れるって。頑張れ。',
        hintZh: '你想鼓励她',
        hintEn: 'You want to encourage her.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你是真心的', reasonEn: 'You meant it' }],
        relations: [{ char: CharacterId.SORA, familiarity: 2, affection: 3, reasonZh: '她笑了，然后不说话了', reasonEn: 'She smiled, and then stopped talking' }],
        then: [
          {
            type: 'narration',
            characterImage: `${S}happy.webp`,
            zh: '她马上就笑了：「おう、せやな」。',
            en: 'The grin arrives at once. Right, yeah.'
          },
          {
            type: 'narration',
            zh: '然后她站起来去捡球，说时间不早了，该走了。',
            en: 'Then she gets up to fetch the ball and says it is getting late, they should go.'
          },
          {
            type: 'narration',
            zh: '你后来才想明白：你说的是"回去"。而她根本不确定自己还想不想回去。',
            en: 'It comes to you later. You said "get back". She is not sure she wants to go back.'
          },
          {
            type: 'narration',
            zh: '"加油"这两个字，对一个正在怀疑自己还想不想要的人来说，是一道追加的题。',
            en: 'To somebody who is not sure they still want the thing, "keep at it" is one more question to answer.'
          }
        ]
      }
    ]
  },

  // ---- 收：墙立起来 ----
  {
    type: 'narration',
    zh: '九点差五分。看门的老师在外面喊了一声。',
    en: 'Five to nine. The caretaker calls from outside.'
  },
  {
    type: 'narration',
    characterImage: `${S}school_neutral.webp`,
    zh: '她把球放回球架，捡起地上的外套，动作快得像什么都没发生过。',
    en: 'She puts the ball back on the rack and picks her blazer off the floor, fast enough that nothing happened.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_neutral.webp`,
    jp: '今日のこと、誰にも言わんといて。',
    zh: '今天的事，别跟任何人说。',
    en: 'Do not tell anyone about tonight.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你说好。',
    en: 'You say all right.'
  },
  {
    type: 'narration',
    characterImage: `${S}school_shy.webp`,
    zh: '走到门口她停了一下，背对着你补了一句。',
    en: 'At the door she stops, with her back to you, and adds one more thing.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_shy.webp`,
    jp: '……英語、来週も見てくれる？',
    zh: '……英语，下周也帮我看吗？',
    en: '...English. Will you look at it next week too?',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她问的是英语。这是她现在唯一敢开口要的东西。',
    en: 'She asks about English. It is the only thing she currently dares to ask for.'
  },
  {
    type: 'narration',
    zh: '灯灭了。你们一前一后走出校门，谁都没有再提球的事。',
    en: 'The lights go off. You leave through the gate one after the other, and neither of you mentions basketball again.'
  },
  {
    type: 'effect',
    setFlags: ['sora_story_2_done', 'sora_story_shoulder'],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '你学会了分辨"能不能"和"想不想"', reasonEn: 'You learned to tell "can" from "want"' },
      { stat: 'kindness', amount: 1, reasonZh: '你答应了不说出去，而且真的没说', reasonEn: 'You promised not to tell, and did not' }
    ],
    relations: [
      { char: CharacterId.SORA, familiarity: 8, affection: 12, reasonZh: '她把那张诊断书给你看了', reasonEn: 'She showed you the piece of paper' }
    ]
  }
];
