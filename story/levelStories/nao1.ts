import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 奈绪 · 第①段「幼馴染の距離」
//
// 触发：好感度 Lv.2「好意」(80)
// 场景：北野坂
//
// 【为什么她走好感度而不是親密度】
// 她的親密度开局就 215——"无话不谈"。青梅竹马这个位置最难写的地方
// 就在这儿：她没有"认识你"这个阶段可以走，所以她的三段全部挂在好感度上。
// 她的问题从来不是"能不能靠近你"，是"靠这么近，还算什么"。
//
// 【第①段要露的那一面】
// 她的表层是"什么都知道的那个人"。这一段捅破的是：
// 她知道的是十年前那个你，而现在这个你，在她不认识的地方交了朋友、
// 学会了她没教过的日语、被人用她没听过的方式叫名字。
//
// 她不会吵，也不会哭。她只会开始核对——像在对一张过期的清单。
// 这一段最锋利的一句是玩家自己说的：她那张清单上有一条是空的。
// ---------------------------------------------------------

const N = '/images/characters/nao/';

export const NAO_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'kitano_slope',
    bgm: 'town',
    titleZh: '幼馴染の距離',
    titleEn: 'The Childhood-Friend Distance',
    subtitleZh: '傍晚 · 北野坂',
    subtitleEn: 'Evening · The Kitano slope',
  },
  {
    type: 'narration',
    zh: '坡爬到一半的时候她停下来了。理由是「鞋带」。她的鞋带没有松。',
    en: 'Halfway up the slope she stops. The reason given is her laces. Her laces are fine.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '她蹲在青石阶上慢吞吞地摆弄着鞋带，好一会儿才拍拍手站起身，眼神却故意避开你的视线。',
    en: 'She squats on the stone steps dawdling over her laces, brushing her hands and standing only after a long moment, purposely avoiding your eyes.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: 'ねえ。今日、廊下で誰かに呼ばれてたでしょ。',
    zh: '喂。你今天在走廊上，被谁叫住了吧。',
    en: 'Hey. Someone called out to you in the corridor today, did they not.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你说是。她"嗯"了一声，又往上走了两步。',
    en: 'You say yes. She makes a small noise and takes two more steps up the slope.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: '……あの呼び方、なに。',
    zh: '……那个叫法，是什么。',
    en: '...What was that, the way they said it.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你想了一会儿才反应过来她在说什么。那是一个绰号，是这边的人给你起的，起了大概两周。',
    en: 'It takes you a moment to work out what she means. It is a nickname. Somebody here gave it to you, about two weeks ago.'
  },
  {
    type: 'narration',
    zh: '你自己都快忘了它是新的。',
    en: 'You had almost stopped noticing that it was new.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她背对着你在爬坡，速度比平时快。',
    promptEn: 'She is climbing with her back to you, faster than she usually walks.',
    options: [
      {
        id: 'nao1_explain',
        labelZh: '老老实实解释那个绰号的来历',
        labelEn: 'Explain, honestly, where the nickname came from',
        jp: 'あれ、二週間前に付けられたんだ。話すと長いけど。',
        hintZh: '故事不长，但里面有三个她不认识的名字',
        hintEn: 'It is not a long story. It has three names in it she does not know.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有让她自己去猜', reasonEn: 'You did not leave her to guess' }],
        relations: [{ char: CharacterId.NAO, affection: 4, reasonZh: '你把新的那部分讲给了她听', reasonEn: 'You told her the new part' }],
        then: [
          {
            type: 'narration',
            zh: '你讲完了。三个名字，两个地点，一件在你看来很小的事。',
            en: 'You finish. Three names, two places, one thing that seemed small to you.'
          },
          {
            type: 'narration',
            characterImage: `${N}knit_curious.webp`,
            zh: '她听得很认真。认真到你察觉出不对——她不是在听故事，她是在记。',
            en: 'She listens carefully. Carefully enough that you notice something off: she is not following a story, she is memorising.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_neutral.webp`,
            jp: '……三人とも、私、知らない。',
            zh: '……三个人，我都不认识。',
            en: '...All three of them. I do not know any of them.',
            color: 'bg-emerald-500'
          }
        ]
      },
      {
        id: 'nao1_deflect',
        labelZh: '「你也可以这么叫。」',
        labelEn: '"You can call me that too."',
        jp: '奈緒もそう呼んでいいよ。',
        hintZh: '你以为这是一句让她高兴的话',
        hintEn: 'You think this is the sentence that makes her happy.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你想把新的那部分也分给她', reasonEn: 'You tried to hand her a piece of the new part' }],
        relations: [{ char: CharacterId.NAO, affection: 2, familiarity: 2, reasonZh: '她没有接', reasonEn: 'She did not take it' }],
        setFlags: ['nao_story_offered_nickname'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_neutral.webp`,
            zh: '她停下来了。这次是真的停下来。',
            en: 'She stops. This time she actually stops.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_neutral.webp`,
            jp: '……いい。私は、十年前の呼び方でいい。',
            words: [{ jp: '呼び方', reading: 'よびかた', zh: '叫法、称呼', en: 'the way of calling someone' }],
            zh: '……不用。我用十年前那个叫法就行。',
            en: '...No. The way I called you ten years ago is fine.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你才意识到你刚才那句话，等于请她排队。',
            en: 'It lands on you that what you just said was an invitation to join a queue.'
          }
        ]
      },
      {
        id: 'nao1_ask_back',
        labelZh: '「你在意的不是那个叫法吧。」',
        labelEn: '"It is not the nickname you mind, is it."',
        jp: '気にしてるの、呼び方じゃないだろ。',
        hintZh: '她今天从校门口开始就不太对',
        hintEn: 'She has been off since the school gate.',
        requires: { stat: 'proficiency', min: 5 },
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '十年的相处让你能听出她跳过的那一步', reasonEn: 'Ten years lets you hear the step she skipped' }],
        relations: [{ char: CharacterId.NAO, affection: 8, reasonZh: '她被当场看穿了', reasonEn: 'She was read, on the spot' }],
        setFlags: ['nao_story_called_it'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_angry.webp`,
            zh: '她转过身来，脸上的表情你只见过两次，两次都是小学的时候。',
            en: 'She turns round. You have seen that expression twice before, both times in primary school.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_angry.webp`,
            jp: 'ずるい。そういうの、すぐ分かっちゃうの、ずるい。',
            zh: '赖皮。这种事你一下就看出来，太赖皮了。',
            en: 'That is not fair. You always work it out straight away. It is not fair.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她说完自己也知道这句话没道理。她还是说了。',
            en: 'She knows as she says it that it makes no sense. She says it anyway.'
          }
        ]
      }
    ]
  },

  // ---- 核对清单 ----
  {
    type: 'narration',
    zh: '坡顶有一段矮墙，能看见整个神户。她坐上去，两条腿在墙外面晃。',
    en: 'There is a low wall at the top of the slope with the whole of Kobe below it. She sits up on it and swings her legs over the edge.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: 'ちょっと確認させて。',
    words: [{ jp: '確認', reading: 'かくにん', zh: '确认、核对', en: 'to check / to confirm' }],
    zh: '让我确认一下。',
    en: 'Let me check something.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '然后她开始报。你不吃香菜。你左耳后面有个疤，八岁时从她家院子的树上摔的。你数学不好但空间想象力很好。你怕打雷但从来不承认。',
    en: 'And then she starts listing. You will not eat coriander. There is a scar behind your left ear from falling out of the tree in her garden when you were eight. You are bad at maths and unusually good at spatial reasoning. Thunder frightens you and you have never admitted it.'
  },
  {
    type: 'narration',
    zh: '一条一条，全对。',
    en: 'One after another. All correct.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '报到第十几条的时候，她的声音开始有点不稳。她还在报。',
    en: 'Somewhere past the tenth her voice starts to go. She keeps listing.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: '……ぜんぶ合ってる。合ってるのに。',
    zh: '……全都对。明明全都对。',
    en: '...All of it is right. All of it is right, and.',
    color: 'bg-emerald-500'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: 'ぜんぶ、十年前のことなの。',
    zh: '全都是十年前的事。',
    en: 'All of it is from ten years ago.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '她那张清单是完整的。问题是那张清单在十年前就写完了，之后一条都没添过。',
    en: 'The list is complete. The problem is that the list was finished ten years ago and nothing has been added to it since.'
  },

  // ---- 选择 2：落点 ----
  {
    type: 'choice',
    promptZh: '她坐在墙上，等你说话。风把她的头发吹到脸上，她没有拨开。',
    promptEn: 'She sits on the wall, waiting. The wind puts her hair across her face and she leaves it there.',
    options: [
      {
        id: 'nao1_add_one',
        labelZh: '「那就添一条。今天开始。」',
        labelEn: '"Then add one. Starting today."',
        jp: 'じゃあ、一個足そう。今日から。',
        words: [{ jp: '足す', reading: 'たす', zh: '添加、加上', en: 'to add' }],
        hintZh: '清单不是坏东西。坏的是它停了',
        hintEn: 'The list is not the problem. The problem is that it stopped.',
        effects: [
          { stat: 'kindness', amount: 2, reasonZh: '你没有说"别在意"', reasonEn: 'You did not tell her not to mind' },
          { stat: 'guts', amount: 1, reasonZh: '你答应了一件要天天做的事', reasonEn: 'You agreed to something that has to happen every day' }
        ],
        relations: [{ char: CharacterId.NAO, affection: 14, familiarity: 4, reasonZh: '她的清单重新开始更新了', reasonEn: 'Her list started updating again' }],
        setFlags: ['nao_story_add_one'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_curious.webp`,
            zh: '她愣住了。',
            en: 'She goes still.'
          },
          {
            type: 'narration',
            zh: '你说：今天开始，每天告诉她一件她不知道的事。她要是不来问，你就自己讲。',
            en: 'You say: from today, one thing a day that she does not know. If she does not ask, you will tell her anyway.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_shy.webp`,
            jp: '……毎日？',
            zh: '……每天？',
            en: '...Every day?',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你说每天。她把脸转到一边，很久没说话。',
            en: 'You say every day. She turns her face away and says nothing for a long time.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_shy.webp`,
            jp: '……じゃあ、今日の分は。',
            zh: '……那，今天这一条呢。',
            en: '...Then what is today’s.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你说：我现在很紧张。',
            en: 'You say: right now, you are nervous.'
          },
          {
            type: 'narration',
            characterImage: `${N}knit_happy.webp`,
            zh: '她笑出了声，一边笑一边说这条不算，因为这条她也知道。',
            en: 'She laughs out loud, and says through it that this one does not count, because she knew that one too.'
          },
          {
            type: 'narration',
            zh: '她说的是「知道」，现在时。她的清单已经开始往后写了。',
            en: 'She says she knows. Present tense. The list has already started running forward again.'
          }
        ]
      },
      {
        id: 'nao1_still_you',
        labelZh: '「那些也还是我。没过期。」',
        labelEn: '"Those are still me. They have not expired."',
        jp: 'それも今の俺だよ。古くなってない。',
        hintZh: '她怕的是自己手上那份变成了旧版本',
        hintEn: 'What she is afraid of is holding an out-of-date copy.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你告诉她那十年不是白攒的', reasonEn: 'You told her the ten years had not been wasted' }],
        relations: [{ char: CharacterId.NAO, affection: 10, familiarity: 3, reasonZh: '她一直以为自己抓着的是旧的那份', reasonEn: 'She had been assuming she was holding the old copy' }],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_shy.webp`,
            zh: '她低头看自己晃着的脚。',
            en: 'She looks down at her swinging feet.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_shy.webp`,
            jp: '……香菜、今も食べない？',
            zh: '……香菜，现在也不吃？',
            en: '...You still will not eat coriander?',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你说不吃。她"よし"了一声，非常小声，像是核对到了最后一条并且通过了。',
            en: 'You say you will not. She says "good", very quietly, like someone reaching the last line of a check and passing it.'
          }
        ]
      },
      {
        id: 'nao1_ask_hers',
        labelZh: '反过来问她：这十年，我不知道你的什么',
        labelEn: 'Turn it around: what do you not know about her ten years',
        jp: '逆に聞くけど。この十年の奈緒、俺は何を知らない？',
        hintZh: '这份清单一直是单向的',
        hintEn: 'The list has only ever pointed one way.',
        requires: { stat: 'kindness', min: 5 },
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你发现只有她一个人在核对', reasonEn: 'You noticed that only one of you had been checking' }],
        relations: [{ char: CharacterId.NAO, affection: 12, familiarity: 6, reasonZh: '没有人问过她这十年', reasonEn: 'Nobody had asked her about her ten years' }],
        setFlags: ['nao_story_asked_her_ten_years'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_curious.webp`,
            zh: '她张嘴要答，然后发现自己答不上来——不是不知道，是从来没整理过。',
            en: 'She opens her mouth to answer, and finds she cannot. Not because she does not know, but because she has never sorted it.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_neutral.webp`,
            jp: '……考えたことなかった。ずっと、こっちが確認する側だったから。',
            zh: '……没想过。一直都是我在确认那一边。',
            en: '...I never thought about it. I have always been the one doing the checking.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她想了很久，然后说了一件很小的事：她初二那年开始一个人去坐末班车，不为了去哪儿，就是坐一圈再回来。',
            en: 'She thinks for a long time, then offers something small: in her second year of middle school she started riding the last train alone, not to go anywhere, just round and back.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_shy.webp`,
            jp: '……これ、誰にも言ったことない。',
            zh: '……这个，我没跟任何人说过。',
            en: '...I have never told anyone that.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你的那份清单，从今天开始有第一条了。',
            en: 'Your list has its first line on it, as of today.'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '天黑透了。坡下面的灯一片一片地亮，从港口那边往山这边爬上来。',
    en: 'It is fully dark. The lights come on below in patches, climbing from the harbour up towards the hill.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '她从墙上跳下来，落地的时候踉跄了半步，你伸手扶了一下。她没有甩开，也没有说谢谢。',
    en: 'She drops down off the wall, stumbles half a step on landing, and you catch her arm. She does not shake you off, and she does not say thank you.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: 'ねえ。私、心配してたわけじゃないから。',
    zh: '喂。我不是在担心你啊。',
    en: 'Hey. It is not that I was worried about you.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你说知道。',
    en: 'You say you know.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_shy.webp`,
    jp: '……こっちで、ちゃんとやってるんだなって、それだけ。',
    zh: '……只是觉得，你在这边过得挺好的。就这样。',
    en: '...Just that you seem to be doing all right over here. That is all.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '这句话她说得很轻。轻得像她其实希望答案是"没有你我过得不好"。',
    en: 'She says it very lightly. Lightly enough that she may have been hoping the answer was that you are not doing all right without her.'
  },
  {
    type: 'narration',
    zh: '你们一起走完了剩下的坡。她走在里侧，跟十年前一样。',
    en: 'You walk the rest of the slope together. She takes the inside, the way she always did.'
  },
  {
    type: 'effect',
    setFlags: ['nao_story_1_done'],
    effects: [
      { stat: 'proficiency', amount: 1, reasonZh: '你听懂了一句轻描淡写的话有多重', reasonEn: 'You worked out how much a lightly-said sentence weighed' },
      { stat: 'kindness', amount: 1, reasonZh: '你没有笑她那张清单', reasonEn: 'You did not laugh at the list' }
    ],
    relations: [
      { char: CharacterId.NAO, affection: 8, familiarity: 2, reasonZh: '十年前那份档案，今天补了一条', reasonEn: 'One line got added to a ten-year-old file' }
    ]
  }
];
