import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 奈绪 · 第②段「知らない顔」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：学生食堂
//
// 【致敬：秒速五センチメートル】
// 借的核不是"错过"，是**没有人做错任何事，距离自己长出来了**。
// 秒速里最狠的一点是：贵树和明里都很好，都很珍惜对方，
// 而距离只是每天多一点，多到某天回头发现已经追不上了。
// 没有反派，没有背叛，只有速度差。
//
// 奈绪的速度差是**语言**。
// 她认识的是用母语说话的你——语速、玩笑、抬杠的节奏，全都是那一套。
// 而你正在变成一个用日语想事情的人。第一次在食堂里，
// 你听懂了一句她没听懂的关西腔玩笑，并且笑了。
// 那一秒她脸上的表情，是这一段的全部。
//
// 【致敬：あの日見た花の名前】
// 借的是"一群人各自往前走了，只有一个人还停在原地"那个位置——
// 但反过来用：**停在原地的人以为自己是在等，其实是在守。**
// 她守的是那个只有她知道的你。
//
// 【第②段的墙】
// 不是"她吃醋"。墙是：她第一次意识到，
// **你在这边变成的那个人，她可能永远认识不了。**
// 而她最怕的不是你交了新朋友，是有一天你回国了，
// 回来的却是另一个人。
// ---------------------------------------------------------

const N = '/images/characters/nao/';

export const NAO_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'school_terrace',
    bgm: 'chat',
    titleZh: '知らない顔',
    titleEn: 'A Face She Does Not Know',
    subtitleZh: '午休 · 学生食堂',
    subtitleEn: 'Lunch · The cafeteria'
  },
  {
    type: 'narration',
    zh: '食堂中午挤得像战场。你们抢到了靠窗那张六人桌的两个位置。',
    en: 'The cafeteria at noon is a battlefield. You get two seats at the six-person table by the window.'
  },
  {
    type: 'narration',
    characterImage: `${N}casual_happy.webp`,
    zh: '她把托盘放下的时候心情很好，因为今天有唐揚げ，而且是她抢到的。',
    en: 'She puts her tray down in a good mood, because there is karaage today and she got it.'
  },
  {
    type: 'narration',
    zh: '然后隔壁桌那几个二年级开始讲话。',
    en: 'Then the second-years at the next table start talking.'
  },
  {
    type: 'narration',
    zh: '语速很快，全是关西腔，中间夹着一个只有本校学生才懂的梗——关于上周升旗时那面旗子。',
    en: 'Fast, thick Kansai-ben, built round a joke only this school would get, about the flag at last week’s assembly.'
  },
  {
    type: 'narration',
    zh: '你笑了。你先笑的，比隔壁那桌自己笑得还早半拍。',
    en: 'You laugh. You laugh first, half a beat before the table that made the joke.'
  },
  {
    type: 'narration',
    characterImage: `${N}casual_curious.webp`,
    zh: '你笑完之后转过头，看见她正在看着你。',
    en: 'When you stop, you turn and find her looking at you.'
  },
  {
    type: 'narration',
    zh: '她没有笑。她没听懂。',
    en: 'She is not laughing. She did not follow it.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她的表情只变了半秒，然后又变回去了。但你看见了。',
    promptEn: 'Her expression changes for half a second and then changes back. You saw it.',
    options: [
      {
        id: 'nao2_explain',
        labelZh: '把那个梗讲给她听',
        labelEn: 'Explain the joke to her',
        jp: 'あれな、先週の朝礼で——',
        hintZh: '你现在是这个学校里的人了。你可以解释',
        hintEn: 'You are of this school now. You can explain it.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有让她一个人在那儿', reasonEn: 'You did not leave her out there alone' }],
        relations: [{ char: CharacterId.NAO, affection: 4, familiarity: 2, reasonZh: '她笑了，但那个笑是补上去的', reasonEn: 'She laughed, and the laugh was retrofitted' }],
        then: [
          {
            type: 'narration',
            zh: '你讲完了。她"啊——"了一声，笑了。',
            en: 'You finish. She makes an understanding noise and laughs.'
          },
          {
            type: 'narration',
            characterImage: `${N}casual_neutral.webp`,
            zh: '笑得很正常。正常到你花了两秒才发现，那是被讲解之后补上去的笑。',
            en: 'It is a perfectly normal laugh. Normal enough that it takes you two seconds to notice it is the kind that gets added after an explanation.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}casual_neutral.webp`,
            jp: '……なるほどね。',
            zh: '……原来如此。',
            en: '...I see.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '「原来如此」是听懂了。「原来如此」不是觉得好笑。',
            en: '"I see" means it was understood. "I see" is not the same as finding it funny.'
          }
        ]
      },
      {
        id: 'nao2_pretend',
        labelZh: '装作没看见，继续吃',
        labelEn: 'Pretend not to have noticed. Keep eating.',
        hintZh: '把这件事放大对谁都没好处',
        hintEn: 'Making it into something helps nobody.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你判断了一下，选择不去碰它', reasonEn: 'You made a judgement and left it' }],
        relations: [{ char: CharacterId.NAO, affection: 2, reasonZh: '她也装作没有被看见', reasonEn: 'She also pretended not to have been seen' }],
        then: [
          {
            type: 'narration',
            zh: '你低头继续吃。她也低头继续吃。',
            en: 'You go back to your food. So does she.'
          },
          {
            type: 'narration',
            characterImage: `${N}casual_neutral.webp`,
            zh: '接下来五分钟你们谁都没说话。这五分钟里她一直在很小口地吃那块唐揚げ。',
            en: 'Neither of you speaks for five minutes. She spends them eating that piece of karaage in very small bites.'
          }
        ]
      },
      {
        id: 'nao2_ask',
        labelZh: '「你刚才那个表情是什么。」',
        labelEn: '"What was that face just now?"',
        jp: '今の顔、なに。',
        hintZh: '你认识这张脸十年了。你知道那不是随便一个表情',
        hintEn: 'You have known this face for ten years. That was not just any expression.',
        requires: { stat: 'proficiency', min: 5 },
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '十年的相处让你读得出半秒钟', reasonEn: 'Ten years lets you read half a second' }],
        relations: [{ char: CharacterId.NAO, affection: 9, familiarity: 3, reasonZh: '她躲不掉了', reasonEn: 'There was nowhere for her to put it' }],
        setFlags: ['nao_story_called_the_face'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}casual_curious.webp`,
            zh: '她愣了一下，然后非常快地答了：「なんもない」。',
            en: 'She blinks and answers very fast: nothing.'
          },
          {
            type: 'narration',
            zh: '答得太快了。快到你确认了自己没看错。',
            en: 'Too fast. Fast enough to confirm you did not misread it.'
          },
          {
            type: 'narration',
            characterImage: `${N}casual_cold.webp`,
            zh: '她把筷子放下，看着窗外，过了很久才又开口。',
            en: 'She puts her chopsticks down, looks out of the window, and does not speak again for a while.'
          }
        ]
      }
    ]
  },

  // ---- 中段：她把话说出来 ----
  {
    type: 'narration',
    zh: '午休还剩十分钟。食堂已经空了一半。',
    en: 'Ten minutes of lunch left. Half the hall has emptied.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}casual_neutral.webp`,
    jp: 'ねえ。さっき、なんで笑ったん。',
    zh: '喂。刚才，你为什么笑。',
    en: 'Hey. Just now. Why did you laugh.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你说因为好笑。',
    en: 'You say because it was funny.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}casual_cold.webp`,
    jp: 'そうやなくて。……先に笑ってた。あの人らより先に。',
    words: [{ jp: '先に', reading: 'さきに', zh: '先、比……早', en: 'first / before' }],
    zh: '不是这个意思。……你先笑的。比他们还早。',
    en: 'That is not what I mean. You laughed first. Before they did.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你没意识到这件事。你确实先笑了——因为你已经知道那个笑话要落在哪儿。',
    en: 'You had not registered that. You did laugh first, because you already knew where the joke was going to land.'
  },
  {
    type: 'narration',
    zh: '你不再是听翻译的那个人了。你成了看得见笑点在哪儿的那个人。',
    en: 'You are no longer the person waiting for the translation. You are the person who can see the punchline coming.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}casual_cold.webp`,
    jp: '……私、あんたが笑うタイミング、ぜんぶ知ってたのに。',
    zh: '……我明明知道你所有笑的时机。',
    en: '...I used to know every single one of your timings.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '这是真的。她知道你什么时候会笑，因为她数了十年。',
    en: 'That is true. She knows when you laugh, because she has been counting for ten years.'
  },
  {
    type: 'narration',
    zh: '但那十年是用另一种语言数的。',
    en: 'But those ten years were counted in a different language.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}casual_angry.webp`,
    jp: 'なんか、ずるい。誰も悪ないのに。',
    zh: '总觉得，很赖皮。明明谁都没做错。',
    en: 'It feels unfair. Even though nobody did anything wrong.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '谁都没做错。这才是最麻烦的地方。',
    en: 'Nobody did anything wrong. That is the difficult part.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '预备铃响了。她没有动。',
    promptEn: 'The warning bell goes. She does not move.',
    options: [
      {
        id: 'nao2_teach_me',
        labelZh: '「那你教我一个只有你懂的。」',
        labelEn: '"Then teach me one only you would get."',
        jp: 'ほな、奈緒しか分からんやつ、一個教えて。',
        hintZh: '她怕的是追不上。那就让她跑在前面一次',
        hintEn: 'What she is afraid of is falling behind. So put her in front, once.',
        effects: [
          { stat: 'charm', amount: 2, reasonZh: '你把速度差调转了一次方向', reasonEn: 'You reversed the direction of the gap, once' },
          { stat: 'kindness', amount: 1, reasonZh: '你没有说"我等你"', reasonEn: 'You did not say you would wait for her' }
        ],
        relations: [{ char: CharacterId.NAO, affection: 16, familiarity: 5, reasonZh: '有一样东西又变成只有她有了', reasonEn: 'One thing became hers alone again' }],
        setFlags: ['nao_story_teach_me'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}casual_curious.webp`,
            zh: '她愣了很久。',
            en: 'It takes her a long time.'
          },
          {
            type: 'narration',
            zh: '然后她讲了一件事：小学四年级，你们班养的那只兔子。',
            en: 'Then she tells you something: the rabbit your class kept in the fourth year of primary school.'
          },
          {
            type: 'narration',
            zh: '她讲了那只兔子的名字、谁给起的、后来去了哪儿。你一个字都想不起来。',
            en: 'She tells you its name, who chose it, and where it went afterwards. You cannot remember any of it.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}casual_happy.webp`,
            jp: 'ほらな。これは私しか持ってへんもん。',
            zh: '你看吧。这个只有我有。',
            en: 'See. This one is only mine.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她说这句话的时候整个人都松了。你后来才明白她松的是什么——',
            en: 'The whole of her loosens as she says it. You work out later what loosened.'
          },
          {
            type: 'narration',
            zh: '她一直以为自己手上那份是"旧的"。这一刻她发现那不是旧的，是**只有她有的**。',
            en: 'She had been treating what she holds as the out-of-date copy. In that moment she discovers it is not out of date. It is the only one.'
          }
        ]
      },
      {
        id: 'nao2_same_person',
        labelZh: '「我还是我。」',
        labelEn: '"I am still me."',
        jp: '俺、変わってへんよ。',
        hintZh: '最直接的一句安慰',
        hintEn: 'The most direct comfort available.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你想让她安心', reasonEn: 'You wanted her to feel steady' }],
        relations: [{ char: CharacterId.NAO, affection: 4, reasonZh: '她点了头，但没有信', reasonEn: 'She nodded, and did not believe it' }],
        then: [
          {
            type: 'narration',
            characterImage: `${N}casual_neutral.webp`,
            zh: '她点了点头，说"嗯"。',
            en: 'She nods and says yes.'
          },
          {
            type: 'narration',
            zh: '然后她说了一句你答不上来的话。',
            en: 'Then she says something you have no answer to.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}casual_cold.webp`,
            jp: 'でも、日本語で考えるときの{name}、私は会うたことないやん。',
            zh: '可是，用日语想事情的时候的你，我没见过啊。',
            en: 'But the version of you that thinks in Japanese. I have never met him.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你想反驳。你发现她说的是对的。',
            en: 'You want to argue. You find that she is right.'
          }
        ]
      },
      {
        id: 'nao2_come_here',
        labelZh: '「那你也进来。」',
        labelEn: '"Then come in here too."',
        jp: 'ほな、奈緒もこっち来たらええやん。',
        hintZh: '她说的是"追不上"。那就不要让她追，让她并排',
        hintEn: 'She said she cannot keep up. So do not make her follow. Put her alongside.',
        requires: { stat: 'guts', min: 5 },
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你邀请她进你这一年', reasonEn: 'You invited her into the year you are having' }],
        relations: [{ char: CharacterId.NAO, affection: 13, familiarity: 6, reasonZh: '她一直以为自己只能在外面等', reasonEn: 'She had assumed her only option was to wait outside' }],
        then: [
          {
            type: 'narration',
            zh: '你说：明天中午你也来这张桌子。隔壁那桌每天都在讲。听三个星期你就懂了。',
            en: 'You say: come to this table tomorrow lunchtime. The next table does this every day. Three weeks and she will follow it.'
          },
          {
            type: 'narration',
            characterImage: `${N}casual_curious.webp`,
            zh: '她看着你，像是从来没想过这个方案存在。',
            en: 'She looks at you as though this option had not been on the list.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}casual_shy.webp`,
            jp: '……そんな、簡単な話やったん。',
            zh: '……原来是这么简单的事吗。',
            en: '...Was it that simple.',
            color: 'bg-emerald-500'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '上课铃响了。她端起托盘，走了两步，又停下来。',
    en: 'The bell goes. She picks up her tray, takes two steps, and stops.'
  },
  {
    type: 'narration',
    characterImage: `${N}casual_neutral.webp`,
    zh: '她背对着你说了一句，说得很轻。',
    en: 'With her back to you she says something, quietly.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}casual_cold.webp`,
    jp: '……帰ってくるとき、別の人になってたら、どうしよ。',
    words: [{ jp: '別の人', reading: 'べつのひと', zh: '别的人', en: 'a different person' }],
    zh: '……回去的时候，要是变成了别的人，怎么办。',
    en: '...What if the one who comes back is somebody else.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '她怕的从来不是你交了新朋友。她怕的是一年之后回国的那个人，她不认识。',
    en: 'What she is afraid of was never that you made new friends. It is that in a year the person who goes home will be one she does not know.'
  },
  {
    type: 'narration',
    zh: '她没有等你回答就走了。托盘上那块唐揚げ一口都没动。',
    en: 'She goes without waiting for an answer. The karaage on her tray has not been touched.'
  },
  {
    type: 'effect',
    setFlags: ['nao_story_2_done', 'nao_story_the_gap'],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '你第一次比本地人先笑', reasonEn: 'For the first time you laughed before the locals did' },
      { stat: 'kindness', amount: 1, reasonZh: '你没有把她那半秒钟的表情放过去', reasonEn: 'You did not let that half-second go past' }
    ],
    relations: [
      { char: CharacterId.NAO, affection: 12, familiarity: 4, reasonZh: '她把那个她一直不敢说的问题问了出来', reasonEn: 'She asked the question she had been avoiding' }
    ]
  }
];
