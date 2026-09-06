import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 空 · 第③段「ゴールの向こう」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：天台 · 夕阳 + cg_sora
//
// 【第②段留下的题】
// 她怕的不是打不好，是**自己还想要**——因为一旦承认想要，
// 就得再为那五公分拼三年。所以她把答案往后拖，
// 拖到"英语"变成她唯一敢开口要的东西。
//
// 【这一段怎么解】
// 不能靠"你其实可以的"——那是把那五公分又还给她。
// 三井跪下来说的不是"我能赢"，是"我想打"。ペコ回到球台前，
// 也不是因为他确定自己还是最强，是因为他终于承认自己享受它。
//
// 所以这一段的转折点是**把标准从别人手里拿回来**：
// 那五公分是两年前一个教练对两年前的她说的。
// 她这两年一次都没有重新量过——因为重新量意味着承认自己在乎。
//
// 【天台 + 那个球架】
// 天台上没有篮筐。这是故意的：她要说的这件事，
// 必须发生在一个没法用投篮糊弄过去的地方。
// ---------------------------------------------------------

const S = '/images/characters/sora/';

export const SORA_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'rooftop_sunset',
    bgm: 'town',
    titleZh: 'ゴールの向こう',
    titleEn: 'Past the Hoop',
    subtitleZh: '傍晚 · 天台',
    subtitleEn: 'Evening · The rooftop'
  },
  {
    type: 'narration',
    zh: '篮球部的入部申请截止到今天下午五点。这件事是健太告诉你的，说得很随意。',
    en: 'Applications to join the basketball club close at five today. Kenta mentioned it, very casually.'
  },
  {
    type: 'narration',
    zh: '他还说了一句：「あいつ、去年も出さんかったで」。',
    en: 'He also said she did not put one in last year either.'
  },
  {
    type: 'narration',
    zh: '四点五十。她不在体育馆。你上了天台。',
    en: 'Ten to five. She is not in the gym. You go up to the roof.'
  },
  {
    type: 'narration',
    characterImage: `${S}school_neutral.webp`,
    zh: '她坐在护栏边上，手里捏着一张纸。风把纸吹得响。',
    en: 'She is sitting by the rail with a sheet of paper in her hand. The wind is making it snap.'
  },
  {
    type: 'narration',
    zh: '入部申请书。已经填好了名字，没有交。',
    en: 'A club application. Her name is filled in. It has not been handed in.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: '……なんでここ来たん。',
    zh: '……你怎么上来了。',
    en: '...Why are you up here.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你说健太说了。她"あいつ余計なこと言いよって"了一声，但没有生气。',
    en: 'You say Kenta told you. She swears at Kenta, mildly, without meaning it.'
  },
  {
    type: 'narration',
    zh: '天台上没有篮筐。这大概是她挑这儿的原因——在这里，她没法用投篮把话岔开。',
    en: 'There is no hoop up here. That is presumably why she chose it: there is nothing to shoot to change the subject with.'
  },

  // ---- 中段：她终于把那个问题拿出来 ----
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: 'この前の、答えてへんかったやろ。',
    zh: '上次那个，我没回答吧。',
    en: 'The other night. I did not answer it, did I.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你没说话。她也没有等你说话。',
    en: 'You say nothing. She was not waiting for you to.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: 'あれから毎日考えててん。「好きか」って。',
    zh: '那之后我每天都在想。"喜不喜欢"这件事。',
    en: 'I have thought about it every day since. Whether I like it.',
    color: 'bg-orange-500'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: 'で、こわいことに気づいてん。',
    zh: '然后我发现了一件很可怕的事。',
    en: 'And I noticed something frightening.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她把纸摊平在膝盖上。',
    en: 'She flattens the paper on her knee.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: 'ウチ、二年間ずっと、体育館におったんよ。誰にも言われてへんのに。',
    words: [{ jp: 'ずっと', reading: 'ずっと', zh: '一直、始终', en: 'the whole time' }],
    zh: '这两年我一直都在体育馆。没有人要求我去。',
    en: 'I have been in that gym for two years. Nobody asked me to be.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '两年。没有队、没有教练、没有比赛、没有任何人在等她。',
    en: 'Two years. No team, no coach, no games, nobody waiting for her.'
  },
  {
    type: 'narration',
    zh: '而她每天四点都在那儿。',
    en: 'And she has been there at four o’clock every day.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}school_sad.webp`,
    jp: '……答え、もう出とったんやな。二年前から。',
    zh: '……答案早就有了吧。两年前就有了。',
    en: '...The answer was already there, was it not. It has been there for two years.',
    color: 'bg-orange-500'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '五点差七分。申请书还在她手里。',
    promptEn: 'Seven minutes to five. The form is still in her hand.',
    options: [
      {
        id: 'sora3_remeasure',
        labelZh: '「那五公分，现在重新量一次。」',
        labelEn: '"Measure the five centimetres again. Now."',
        jp: 'あの五センチ、今もう一回測ろう。',
        words: [{ jp: '測る', reading: 'はかる', zh: '测量', en: 'to measure' }],
        hintZh: '那个数字是两年前一个人对两年前的她说的',
        hintEn: 'That number was said two years ago, by one person, about who she was then.',
        effects: [
          { stat: 'knowledge', amount: 2, reasonZh: '你指出了那个标准是有日期的', reasonEn: 'You pointed out that the bar has a date on it' },
          { stat: 'guts', amount: 2, reasonZh: '你让她去面对一个可能更难看的数字', reasonEn: 'You made her face a number that might be worse' }
        ],
        relations: [{ char: CharacterId.SORA, familiarity: 6, affection: 20, reasonZh: '她把标准从别人手里拿回来了', reasonEn: 'She took the bar back off somebody else' }],
        setFlags: ['sora_story_remeasured'],
        then: [
          {
            type: 'narration',
            characterImage: `${S}school_sad.webp`,
            zh: '她抬起头，像是从来没想过这件事可以被重新量。',
            en: 'Her head comes up. It has evidently never occurred to her that it could be measured again.'
          },
          {
            type: 'narration',
            zh: '你说：那句话是两年前说的，说的是两年前的你，为了两年前那支队。',
            en: 'You say: that was said two years ago, about who she was then, for the team she was on then.'
          },
          {
            type: 'narration',
            zh: '你说：这两年你每天四点都在那儿。你自己不打算把这两年算进去吗。',
            en: 'You say: she has been there at four every day for two years. Is she not going to count those two years.'
          },
          {
            type: 'narration',
            characterImage: `${S}school_sad.webp`,
            zh: '她低头看着自己的右手，看了很久很久。',
            en: 'She looks at her own right hand for a very long time.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}school_sad.webp`,
            jp: '……測ったら、五センチより悪かったらどうすんの。',
            zh: '……要是量出来比五公分还差怎么办。',
            en: '...And if it turns out worse than five.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '你说：那就知道差多少了。现在你连差多少都不知道，只知道害怕。',
            en: 'You say: then she will know by how much. Right now she does not know by how much; she only knows the fear.'
          },
          {
            type: 'narration',
            characterImage: `${S}school_sad.webp`,
            zh: '她非常久地看着你。然后她笑了——不是那个装回去的笑，是那种被戳穿之后没办法的笑。',
            en: 'She looks at you for a very long time. Then she laughs, and it is not the one she puts on. It is the one that arrives when there is nothing left to do about it.'
          }
        ]
      },
      {
        id: 'sora3_two_years',
        labelZh: '「两年了，你一天都没缺过。」',
        labelEn: '"Two years, and you have not missed a day."',
        jp: '二年間、一日も休んでへんやろ。',
        hintZh: '她刚才自己说出来了，但她没听见自己说了什么',
        hintEn: 'She just said it herself, and did not hear what she said.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你替她把她自己说的话重复了一遍', reasonEn: 'You repeated her own sentence back to her' }],
        relations: [{ char: CharacterId.SORA, familiarity: 8, affection: 15, reasonZh: '她第一次听见了自己刚才说的话', reasonEn: 'She heard, for the first time, what she had just said' }],
        then: [
          {
            type: 'narration',
            zh: '她张嘴要反驳，然后停住了。',
            en: 'She opens her mouth to argue, and stops.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}school_sad.webp`,
            jp: '……習慣やと思っとった。',
            zh: '……我一直以为那只是习惯。',
            en: '...I thought it was just habit.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '你说：习惯不会让人在没有人看的时候，用左手投二十个球。',
            en: 'You say: habit does not make a person take twenty left-handed shots with nobody watching.'
          },
          {
            type: 'narration',
            characterImage: `${S}school_sad.webp`,
            zh: '她没有说话。风把申请书吹得响了一下。',
            en: 'She says nothing. The wind snaps the form once.'
          }
        ]
      },
      {
        id: 'sora3_come_watch',
        labelZh: '「你交，我每场都来看。」',
        labelEn: '"Hand it in. I will come to every game."',
        jp: '出しや。ウチ、全部見に行くから。',
        hintZh: '两年里她一场比赛都没有观众',
        hintEn: 'For two years there has been nobody in the stands.',
        requires: { stat: 'guts', min: 6 },
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你承诺了一件要一直做下去的事', reasonEn: 'You promised something that has to keep being done' }],
        relations: [{ char: CharacterId.SORA, familiarity: 5, affection: 18, reasonZh: '第一次有人说要来看', reasonEn: 'For the first time somebody said they would come' }],
        setFlags: ['sora_story_will_watch'],
        then: [
          {
            type: 'narration',
            characterImage: `${S}school_sad.webp`,
            zh: '她整个人转过来。',
            en: 'The whole of her turns round.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}school_sad.webp`,
            jp: '……全部？',
            zh: '……全部？',
            en: '...All of them?',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '你说全部。她说有的比赛在很远的地方。你说那就坐很久的车。',
            en: 'You say all of them. She says some are a long way away. You say then it will be a long train.'
          },
          {
            type: 'narration',
            characterImage: `${S}school_shy.webp`,
            zh: '她把脸转开了。你听见她小声说了句「あほちゃう」，但声音在抖。',
            en: 'She turns her face away. You hear her call you an idiot, quietly, and her voice is not steady.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '四点五十八。她站了起来。',
    en: 'Two minutes to five. She stands.'
  },
  {
    type: 'narration',
    characterImage: `${S}school_cool.webp`,
    zh: '她把申请书折了一下，塞进外套口袋，然后往楼梯口走。走到一半她回过头。',
    en: 'She folds the form, puts it in her blazer pocket, and heads for the stairs. Halfway there she looks back.'
  },

  // ---- 双结局 ----
  {
    type: 'check',
    metric: 'affection',
    min: 200,

    // ============ 相爱 ============
    then: [
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_shy.webp`,
        jp: 'なあ。一個だけ、条件つけてええ？',
        zh: '喂。我能提一个条件吗？',
        en: 'Hey. Can I attach one condition?',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '你说可以。她深吸了一口气，说得非常快，快得像怕自己中途停下来。',
        en: 'You say she can. She takes a breath and says it very fast, fast enough to be afraid of stopping in the middle.'
      },
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_shy.webp`,
        jp: '見に来るんやったら、応援席ちゃうくて、',
        zh: '要来看的话，不要坐观众席，',
        en: 'If you are coming, do not sit in the stands,',
        color: 'bg-orange-500'
      },
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_love.webp`,
        jp: '……終わったあと、いちばん最初に会うやつでおってほしい。',
        words: [{ jp: '最初', reading: 'さいしょ', zh: '最初、第一个', en: 'the first' }],
        zh: '……结束之后，第一个见到的人，我希望是你。',
        en: '...After it finishes, I want the first person I see to be you.',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '这是她这辈子说过最像告白的一句话，而且她说的全程是关于篮球的。',
        en: 'It is the closest thing to a confession she has ever produced, and the entire thing is ostensibly about basketball.'
      },
      {
        type: 'cg',
        cgId: 'cg_sora',
        imageUrl: '/images/cg/cg_sora.webp',
        titleZh: '球场之外', titleEn: 'Past the Hoop',
        captionZh: '夕阳把整个天台染成橘色。她伸出手来，掌心朝上——那是要击掌的手势，但她没有动，一直等到你把手放上去。',
        captionEn: 'The roof has gone entirely orange. She holds a hand out, palm up. It is the gesture for a high five, and she does not move it until you put your hand in it.'
      },
      {
        type: 'narration',
        zh: '你以为她要击掌。她握住了。',
        en: 'You expect the clap. She closes her hand instead.'
      },
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_love.webp`,
        jp: '……ハイタッチちゃうで、これ。',
        zh: '……这个不是击掌哦。',
        en: '...This is not a high five, by the way.',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '你说知道。她说那就好，然后就那样握着，一直到楼下的铃响。',
        en: 'You say you know. She says good, and keeps hold of it until the bell goes downstairs.'
      },
      {
        type: 'effect',
        setFlags: ['sora_ending_love', 'sora_story_3_done', 'sora_joined_club'],
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '她把那张纸交上去了', reasonEn: 'She handed the form in' },
          { stat: 'charm', amount: 2, reasonZh: '有人把"第一个见到的人"这个位置留给了你', reasonEn: 'Somebody reserved the position of first person seen, for you' }
        ],
        relations: [
          { char: CharacterId.SORA, familiarity: 12, affection: 24, reasonZh: '她终于承认自己想要', reasonEn: 'She finally admitted that she wants it' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_neutral.webp`,
        jp: 'なあ。一個、頼んでええ？',
        zh: '喂。能拜托你一件事吗？',
        en: 'Hey. Can I ask you for something?',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '你说可以。她从口袋里把那张纸又拿出来，递给你。',
        en: 'You say yes. She takes the form back out of her pocket and holds it out.'
      },
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_shy.webp`,
        jp: 'ウチが出したら、また逃げるかもしれん。だから、出しといて。',
        zh: '我自己交的话，可能又会逃。所以，你替我交。',
        en: 'If I hand it in myself I might run again. So hand it in for me.',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '她把自己的选择交给了别人，不是因为软弱，是因为她算准了自己会退。',
        en: 'She is handing her own decision to somebody else, not out of weakness, but because she has correctly predicted that she will back out.'
      },
      {
        type: 'narration',
        zh: '你拿着那张纸飞奔下三层楼。在你手指碰到门把的刹那，门被从里面猛地拉开了——藤原老师正好拎着包准备下班。',
        en: 'You sprint down three flights with the paper in hand. Just as your fingers graze the handle, the door is pulled open from within — Ms. Fujiwara is right about to head home.'
      },
      {
        type: 'narration',
        zh: '她接过表格，看了一眼名字，什么都没问，盖了章。',
        en: 'She takes the form, glances at the name, asks nothing, and stamps it.'
      },
      {
        type: 'narration',
        characterImage: `${S}school_neutral.webp`,
        zh: '你回到天台的时候她还坐在原地。你说交上去了。',
        en: 'When you get back to the roof she is still sitting there. You say it is in.'
      },
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_happy.webp`,
        jp: '……そっか。',
        zh: '……这样啊。',
        en: '...Right.',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '她笑了很久。笑到最后她抬起手，用力拍了一下你的肩。',
        en: 'She laughs for a long time. At the end of it she raises a hand and hits your shoulder, hard.'
      },
      {
        type: 'speech',
        speakerZh: '空', speakerEn: 'Sora',
        characterImage: `${S}school_happy.webp`,
        jp: 'あんた、ウチの一号やからな。',
        words: [{ jp: '一号', reading: 'いちごう', zh: '第一号', en: 'number one' }],
        zh: '你是我的一号啊。',
        en: 'You are my number one, you know.',
        color: 'bg-orange-500'
      },
      {
        type: 'narration',
        zh: '你问一号是什么。她说：第一个观众。',
        en: 'You ask what that means. She says: first spectator.'
      },
      {
        type: 'narration',
        zh: '你们没有在一起。但接下来两年，每一场她的比赛，观众席上都有一个固定的位置。',
        en: 'You are not together. But for the next two years, at every one of her games, there is one seat in the stands that is always taken.'
      },
      {
        type: 'effect',
        setFlags: ['sora_ending_friend', 'sora_story_3_done', 'sora_joined_club'],
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你替她跑了三层楼', reasonEn: 'You ran three flights of stairs on her behalf' }
        ],
        relations: [
          { char: CharacterId.SORA, familiarity: 24, affection: 8, reasonZh: '她把自己的选择托付给了你', reasonEn: 'She put her own decision in your hands' }
        ]
      }
    ]
  }
];
