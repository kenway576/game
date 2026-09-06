import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 光 · 第②段「一週間の差」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：马赛克摩天轮 · 夜
//
// 【致敬：とらドラ！的櫛枝実乃梨】
// 不是套皮，是借她那个真正难写的核：
// 実乃梨的"元気"不是性格，是一件**主动穿上的装备**。
// 她拼命打气、拼命搞笑、拼命把气氛托住，是因为她认定
// **一旦停下来，人就会散开**。而更狠的那一层是：
// 她连自己想要的东西都不肯伸手去拿，因为她觉得
// "想要"这件事本身要先有资格。
//
// 落到光身上：她比你早来一周。那一周她每天去港边看那个方向，
// 第七天"不用去了"。她把那一周的解法总结成了一条规矩——
// **不能安静下来，安静下来就没有人来了**——然后靠这条规矩活到今天。
//
// 【第②段的墙是什么】
// 不是"她其实很难过"，那太便宜。墙是：
// 你越好，她越用力表演，因为她把"你会留下"也算成了需要她托住的东西。
// 玩家撞上的是——她根本不相信有人会因为她本人而留下来。
//
// 【摩天轮】
// 一圈十五分钟，中途下不去。这一段必须发生在一个**双方都跑不掉**的地方，
// 否则以她的性格，话说到一半就会跳起来说"啊我去买个饮料"。
// 摩天轮是这个故事唯一诚实的房间。
//
// 【结尾不给和解】
// 第②段的职能是把墙立起来，不是拆掉。她最后说的那句话是
// "所以你别对我太好"——这是拒绝，也是她这辈子说过最接近告白的话。
// 拆墙留给第③段。
// ---------------------------------------------------------

const H = '/images/characters/hikari/';

export const HIKARI_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'mosaic_night',
    bgm: 'night',
    titleZh: '一週間の差',
    titleEn: 'One Week Ahead',
    subtitleZh: '夜 · 马赛克摩天轮',
    subtitleEn: 'Night · The Mosaic ferris wheel'
  },
  {
    type: 'narration',
    zh: '起因是一件小事。今天你在国际交流室帮一个刚来的留学生填表——对方一句日语都不会，你也才刚来神户没多久，两个人鸡同鸭讲地比划了大半天。',
    en: 'It began with a trifle. Today you helped a newly arrived foreign student fill in paperwork. He had no Japanese, you were still new to Kobe, and the two of you spent ages waving hands.'
  },
  {
    type: 'narration',
    zh: '光站在门口看了一会儿，然后走了。放学后她一句话都没提这件事。',
    en: 'Hikari watched from the doorway for a while, then left. After school she does not mention it once.'
  },
  {
    type: 'narration',
    characterImage: `${H}casual_happy.webp`,
    zh: '她提的是别的：「今天去坐摩天轮吧！我请客！」——她已经在查末班电车了。',
    en: 'What she brings up instead is the ferris wheel, tonight, her treat. She is already checking the last train.'
  },
  {
    type: 'narration',
    zh: '马赛克的巨型摩天轮，一圈正好慢悠悠转上十五分钟。悬空之后便再无退路，这一点很快就会变得无比真切。',
    en: 'The Mosaic wheel takes a leisurely fifteen minutes per rotation. Once suspended in midair there is no turning back, a truth that soon becomes tangible.'
  },

  // ---- 上升：她还在演 ----
  {
    type: 'narration',
    characterImage: `${H}casual_happy.webp`,
    zh: '轿厢刚离地，她就开始了：讲哪个方向能看到她家、讲上次坐这个的时候手机掉了、讲摩天轮的英文她一直记不住。',
    en: 'The car has barely left the platform before she starts: which direction her flat is, the time she dropped her phone on this thing, the fact that she can never remember the English word for it.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_happy.webp`,
    jp: 'あのさ、今日の。えらかったよ、ほんとに。',
    words: [{ jp: 'えらい', reading: 'えらい', zh: '了不起、做得好', en: 'admirable / well done' }],
    zh: '话说，今天那个。你真的很了不起。',
    en: 'By the way. Today. That was a good thing you did, seriously.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '她夸得很快，快得像要赶在你回话之前把这一段翻过去。',
    en: 'The praise comes fast, fast enough to be trying to get past the subject before you can answer.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_happy.webp`,
    jp: 'ね、あの子さ、来週も来るって？　あたしも手伝おっかな！',
    zh: '那孩子下周还来吗？我也去帮忙好了！',
    en: 'Is he coming again next week? Maybe I should help out too!',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '轿厢升到一半。窗外港塔的灯从上往下滑过去。',
    en: 'The car is halfway up. Outside, the tower lights slide down past the glass.'
  },
  {
    type: 'narration',
    zh: '你注意到一件事：她今天笑的次数，比平常多。',
    en: 'You notice something. She has smiled more times today than she usually does.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '还有十分钟。这十分钟里她跑不掉。',
    promptEn: 'Ten minutes left. For ten minutes she cannot go anywhere.',
    options: [
      {
        id: 'hikari2_you_taught_me',
        labelZh: '「那些手势，是你教我的。」',
        labelEn: '"Those gestures. You taught me those."',
        jp: 'あのジェスチャー、光に教わったやつだよ。',
        hintZh: '你第一周听不懂的时候，她就是这么跟你比划的',
        hintEn: 'Your first week, when you understood nothing, that is what she did with you.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你把功劳递回去了', reasonEn: 'You handed the credit back' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 4, affection: 10, reasonZh: '她第一次被算进一件好事里', reasonEn: 'For once she was counted inside a good thing' }],
        setFlags: ['hikari_story_credit'],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_surprised.webp`,
            zh: '她笑了一半停住了。',
            en: 'The smile gets halfway and stops.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_surprised.webp`,
            jp: '……あたし、教えてないよ。ただ、ふざけてただけ。',
            zh: '……我没教你啊。我只是在闹而已。',
            en: '...I did not teach you anything. I was just messing about.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说：你闹了两个月，闹到我敢开口了。',
            en: 'You say: she messed about for two months, and by the end of it you could open your mouth.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '她转过头去看窗外。轿厢正好到最高点，整个神户在下面摊开。',
            en: 'She turns to the window. The car reaches the top, and the whole of Kobe lies open underneath.'
          }
        ]
      },
      {
        id: 'hikari2_why_smiling',
        labelZh: '「你今天笑得太多了。」',
        labelEn: '"You have been smiling too much today."',
        jp: '今日、笑いすぎ。',
        hintZh: '一个从不数别人笑几次的人，今天数了',
        hintEn: 'You are not someone who counts other people’s smiles. Today you counted.',
        requires: { stat: 'proficiency', min: 5 },
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你学会了从"太用力"里读出东西', reasonEn: 'You learned to read effort as information' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 3, affection: 13, reasonZh: '没有人说过她笑得多', reasonEn: 'Nobody has ever told her she smiles too much' }],
        setFlags: ['hikari_story_saw_through'],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_surprised.webp`,
            zh: '这一次她连笑都没笑完。',
            en: 'This time the smile does not even finish assembling.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_neutral.webp`,
            jp: '……そんなの、数えてたの。',
            zh: '……这种事，你居然在数。',
            en: '...You were counting that.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说不是数，是看出来了。她"哦"了一声，把头靠在玻璃上。',
            en: 'You say you were not counting, you just saw it. She makes a small noise and puts her head against the glass.'
          }
        ]
      },
      {
        id: 'hikari2_quiet',
        labelZh: '什么都不说，让轿厢转',
        labelEn: 'Say nothing. Let the wheel turn.',
        hintZh: '她受不了安静。等着看她自己开口',
        hintEn: 'She cannot stand a silence. Wait and see what she does with one.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你顶住了一个非常难顶的沉默', reasonEn: 'You held a silence that was very hard to hold' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 2, affection: 11, reasonZh: '她一个人把那段安静走完了', reasonEn: 'She walked the whole of that silence by herself' }],
        setFlags: ['hikari_story_let_it_sit'],
        then: [
          {
            type: 'narration',
            zh: '她又讲了两个笑话。你笑了，但没有接。',
            en: 'She tries two more jokes. You laugh, but you do not pick them up.'
          },
          {
            type: 'narration',
            zh: '第三个笑话讲到一半，她自己停了。',
            en: 'Halfway through the third one she stops herself.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_neutral.webp`,
            zh: '轿厢里只剩下钢缆的声音。那声音你从来没听见过——因为她在的地方从来没有安静过。',
            en: 'All that is left in the car is the sound of the cable. You have never heard it before, because no place she is in has ever been quiet.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_neutral.webp`,
            jp: '……こわいな、これ。',
            zh: '……这个，好可怕啊。',
            en: '...This is frightening.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你问什么可怕。她说：安静。',
            en: 'You ask what is. She says: the quiet.'
          }
        ]
      }
    ]
  },

  // ---- 那条规矩 ----
  {
    type: 'narration',
    zh: '轿厢掠过最高点开始缓缓下行。窗外的港湾夜景如深海中的星河，静得只听得见两人的呼吸声。',
    en: 'Passing the apex, the gondola glides downward. The harbour lights outside glisten like a starry deep sea, quiet enough to hear both of your breaths.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_neutral.webp`,
    jp: 'あたしさ、来た週の話、したじゃん。毎日ここ来てたって。',
    zh: '我啊，跟你讲过我刚来那一周吧。每天都来这边。',
    en: 'I told you about my first week, right. That I came down here every day.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '你说记得。她点点头，然后说了一句你没想到的话。',
    en: 'You say you remember. She nods, and then says something you had not expected.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_sad.webp`,
    jp: '七日目にね、気づいたの。誰も探しに来ないんだって。',
    words: [{ jp: '探す', reading: 'さがす', zh: '找、寻找', en: 'to look for' }],
    zh: '第七天的时候我发现了。没有人会来找我。',
    en: 'On the seventh day I worked something out. Nobody comes looking.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '她说这句话的时候在笑。她说任何话的时候都在笑。',
    en: 'She is smiling as she says it. She is smiling when she says anything.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_happy.webp`,
    jp: 'だから、こっちから行くことにした。うるさくして、笑って、先に手ぇ振る。',
    zh: '所以我决定自己过去。吵一点，笑一点，先挥手。',
    en: 'So I decided I would go to them. Be loud, laugh, wave first.',
    color: 'bg-sky-500'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_happy.webp`,
    jp: 'そしたらね、ちゃんと来てくれるんだよ、みんな。',
    zh: '这么做的话，大家真的会过来哦。',
    en: 'And when you do that, people really do come.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '你听懂了这段话里没说出口的那一半：所以一旦停下来，就没有人会来。',
    en: 'You hear the half she did not say: and therefore if you stop, nobody comes.'
  },
  {
    type: 'narration',
    zh: '她把"元气"这件事，当成了一份需要天天续费的合约。',
    en: 'She has been treating her own cheerfulness as a subscription that has to be renewed daily.'
  },

  // ---- 选择 2：撞上那堵墙 ----
  {
    type: 'choice',
    promptZh: '还有三分钟。你能看见下面站台的灯了。',
    promptEn: 'Three minutes. You can see the platform lights below.',
    options: [
      {
        id: 'hikari2_i_came',
        labelZh: '「今天是我先找的你。」',
        labelEn: '"Today I came looking for you first."',
        jp: '今日は、こっちが探しに行ったんだけど。',
        hintZh: '中午你绕了整整两层楼，就为了问她要不要一起吃',
        hintEn: 'At lunch you went round two whole floors to ask if she wanted to eat.',
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '你把她的那条规矩当场推翻了一次', reasonEn: 'You overturned her rule, once, in front of her' },
          { stat: 'kindness', amount: 1, reasonZh: '你说的是事实，不是安慰', reasonEn: 'What you said was a fact, not comfort' }
        ],
        relations: [{ char: CharacterId.HIKARI, familiarity: 5, affection: 16, reasonZh: '她的规矩被一个反例打了个洞', reasonEn: 'Her rule took a hole from one counterexample' }],
        setFlags: ['hikari_story_i_came_first'],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_surprised.webp`,
            zh: '她怔怔地凝视着你，长久没有说出话来，任由轿厢在夜色中缓缓下沉。',
            en: 'It takes her a long time. Long enough for the car to drop further.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_sad.webp`,
            jp: '……それ、あたしが先に手ぇ振ってたからでしょ。',
            zh: '……那是因为，我先挥的手吧。',
            en: '...That is only because I waved first.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '她把所有的证据都算进了那条规矩里。连反例也是。',
            en: 'She has folded every piece of evidence into the rule. Including the ones that disprove it.'
          },
          {
            type: 'narration',
            zh: '你说：那你现在试试不挥。看我走不走。',
            en: 'You say: then try not waving. See whether you lose me.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '她张了张嘴，什么都没说出来。这大概是你认识她以来，她第一次接不上话。',
            en: 'Her mouth opens and nothing arrives. It is very likely the first time since you met her that she has had nothing to say.'
          }
        ]
      },
      {
        id: 'hikari2_tired',
        labelZh: '「不累吗。天天这样。」',
        labelEn: '"Does it not get tiring. Doing that every day."',
        jp: '疲れへんの。毎日それ。',
        words: [{ jp: '疲れる', reading: 'つかれる', zh: '累', en: 'to get tired' }],
        hintZh: '两个月了，你没见她关过机',
        hintEn: 'Two months, and you have never once seen her switched off.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你问的是她自己，不是她的用处', reasonEn: 'You asked about her, not about what she does' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 6, affection: 12, reasonZh: '这个问题她没准备过答案', reasonEn: 'She has no prepared answer for that one' }],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_neutral.webp`,
            zh: '她"啊"了一声，像是被问到了一个从来没有人问过的方向。',
            en: 'She makes a small sound, like someone asked a question from a direction nobody has ever come at her from.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_neutral.webp`,
            jp: '……疲れるとか、考えたことなかった。',
            zh: '……累不累这种事，我没想过。',
            en: '...Whether it is tiring. I have never thought about that.',
            color: 'bg-sky-500'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_sad.webp`,
            jp: 'だって、やめたらどうなるか、分かんないもん。',
            zh: '因为，不做了会怎么样，我不知道啊。',
            en: 'Because I do not know what happens if I stop.',
            color: 'bg-sky-500'
          }
        ]
      },
      {
        id: 'hikari2_wave_first',
        labelZh: '举起手，先向她挥了一下',
        labelEn: 'Raise your hand, and wave at her first',
        hintZh: '不说话。她的规矩是"先挥手的人"，那就让她当被挥的那个',
        hintEn: 'No words. Her rule is about who waves first, so make her the one waved at.',
        requires: { stat: 'charm', min: 5 },
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你用她自己的规矩回答了她', reasonEn: 'You answered her in her own rule' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 4, affection: 15, reasonZh: '两个人隔着一米，她被挥了一下手', reasonEn: 'One metre apart, and somebody waved at her' }],
        setFlags: ['hikari_story_waved_first'],
        then: [
          {
            type: 'narration',
            zh: '逼仄的轿厢里只有你们两个，相对而坐。你迎着她的目光，缓缓举起手，在半空中轻柔地向她挥了挥。',
            en: 'Inside the narrow carriage it is just the two of you, sitting face to face. Meeting her gaze, you gently raise your hand and wave softly in the air.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_surprised.webp`,
            zh: '她呆呆注视着你的手掌，眼眶里的泪水终于失控地打转。',
            en: 'She stares blankly at your hand, tears welling uncontrollably in her eyes.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '然后她把脸埋进了膝盖里。肩膀在抖，没有声音。',
            en: 'Then she puts her face into her knees. Her shoulders go. There is no sound.'
          },
          {
            type: 'narration',
            zh: '你是第一个先向她挥手的人。你花了两个月才发现这件事居然是第一次。',
            en: 'You are the first person to wave at her first. It took you two months to notice that this was a first.'
          }
        ]
      }
    ]
  },

  // ---- 落地：墙立起来 ----
  {
    type: 'narration',
    zh: '轿厢快到底了。她抬起头，很快地擦了一下脸。微笑先勉强挂上了唇边，眼神却慢了半拍才跟上。你全程都看在眼里。',
    en: 'The car is nearly down. She lifts her head and wipes her face quickly. The smile comes back at the mouth first; the eyes are half a beat behind. You watch the whole of it.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_happy.webp`,
    jp: 'ごめんごめん、変な空気にしちゃった！　降りたらたこ焼き食べよ！',
    zh: '抱歉抱歉，把气氛搞奇怪了！下去吃章鱼烧吧！',
    en: 'Sorry, sorry, I made it weird! Let us get takoyaki when we are down!',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '你说好。你没有拆穿。',
    en: 'You say all right. You do not call it.'
  },
  {
    type: 'narration',
    zh: '门开了。她跳下去，回头等你，手已经举起来在挥了。',
    en: 'The door opens. She hops out, turns back to wait for you, hand already up and waving.'
  },
  {
    type: 'narration',
    characterImage: `${H}casual_happy.webp`,
    zh: '走出去十几步，她忽然停下来，背对着你说了一句。',
    en: 'A dozen steps on she stops, with her back to you, and says one more thing.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_sad.webp`,
    jp: 'ねえ。あんまり優しくしないでよ。',
    words: [{ jp: '優しい', reading: 'やさしい', zh: '温柔、体贴', en: 'kind / gentle' }],
    zh: '喂。别对我太好啊。',
    en: 'Hey. Do not be too nice to me.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '你问为什么。',
    en: 'You ask why.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_sad.webp`,
    jp: '……慣れちゃうから。',
    zh: '……因为会习惯的。',
    en: '...Because I would get used to it.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '习惯了之后呢？她没有说。但你知道后半句是什么：习惯了之后，你走的时候她就撑不住了。',
    en: 'And then what? She does not say. But you know the second half: and then when you go, she would not be able to hold it.'
  },
  {
    type: 'narration',
    zh: '她说完就跑了，跑向章鱼烧摊，一路上都在喊你快点。',
    en: 'Then she runs, towards the takoyaki stall, shouting at you to hurry the whole way.'
  },
  {
    type: 'narration',
    zh: '这一晚你什么都没有解决。你只是终于看见了那堵墙有多高。',
    en: 'You solved nothing tonight. You only finally saw how high the wall is.'
  },
  {
    type: 'effect',
    setFlags: ['hikari_story_2_done', 'hikari_story_the_wall'],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '你现在能分辨她哪一次笑是真的', reasonEn: 'You can now tell which of her smiles are real' },
      { stat: 'kindness', amount: 1, reasonZh: '你没有在她装回去的时候拆穿她', reasonEn: 'You did not call it when she put the smile back on' }
    ],
    relations: [
      { char: CharacterId.HIKARI, familiarity: 8, affection: 14, reasonZh: '她把那条规矩说给你听了', reasonEn: 'She told you the rule out loud' }
    ]
  }
];
