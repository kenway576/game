import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 明日香 · 第②段「一番じゃないと」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：放学后的中庭，下雨
//
// 【致敬】
// 这一段站在两个人的交叉点上，而不是简单套皮：
//
// · EVA 的明日香 —— 自我价值完全挂在"我是第一"上。
//   一旦不是第一，她失去的不是名次，是**存在的理由**。
//   所以她受不了的不是失败，是被同情：怜悯等于承认"你不用有用也没关系"，
//   而那恰恰否定了她赖以站立的全部前提。
//
// · 无职转生的爱丽丝 —— 不是被拒绝才走的，是觉得**自己还不配站在旁边**才走的。
//   于是她选择退开去变强，留下一句没头没尾的告别。行动先于语言，
//   道歉从来不出口。
//
// 交叉点：**两个人都把自己的价值当成有条件、可撤销的东西，
// 都宁愿自己先退场，也不肯被人看见自己不够格的样子。**
//
// 落到这个游戏里：她是被指派来辅导你日语的学級委員長。
// "有用"是她抓着的那根绳子。模拟考掉到第二，绳子断了——
// 她的第一反应不是难过，是取消自己（辞掉委员长的工作）。
//
// 结尾那两句是全段的落点，也是两个致敬合流的地方：
//   「……次は一番取るから。」        ← 爱丽丝：我去变得配得上
//   「……だから、それまでに、いなくならないでよ。」 ← 明日香：别丢下我
// 前一句是骄傲，后一句是她这辈子大概第一次求人。
// ---------------------------------------------------------

const A = '/images/characters/asuka/';

export const ASUKA_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'courtyard_rain',
    bgm: 'night',
    titleZh: '一番じゃないと',
    titleEn: 'It Has To Be First',
    subtitleZh: '放学后 · 中庭 · 雨',
    subtitleEn: 'After school · The courtyard · Rain'
  },
  {
    type: 'narration',
    zh: '你回教室拿落在抽屉里的东西。教室空了，只剩她的座位上还挂着书包。',
    en: 'You go back to the classroom for something you left in your desk. The room is empty. Only her bag is still hanging on her chair.'
  },
  {
    type: 'narration',
    zh: '走廊尽头的中庭里，雨檐下站着一个人。红色的双马尾被雨气打湿，贴在肩上。',
    en: 'At the far end of the corridor, in the courtyard, someone is standing under the eaves. Red twin-tails, damp with rain-mist, clinging to her shoulders.'
  },
  {
    type: 'narration',
    characterImage: `${A}neutral.webp`,
    zh: '她背对着你。手里捏着一张纸。',
    en: 'Her back is to you. There is a sheet of paper crushed in her hand.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}angry.webp`,
    jp: '……何よ。',
    zh: '……干嘛。',
    en: '...What.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她没有回头。你说你来拿忘在教室的东西。',
    en: 'She does not turn round. You say you came back for something you forgot.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}angry.webp`,
    jp: 'そう。じゃあ早く帰りなさいよ。……こんなところ見てても、面白くないでしょ。',
    zh: '是吗。那就快点回去。……站在这种地方看，也没什么好看的吧。',
    en: 'Fine. Then hurry up and go home. ...There is nothing worth looking at here.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她手里那张纸已经被捏得变了形。但你认得那个格式——上周的模拟考排名表，年级前十会贴在办公室门口的那种。',
    en: 'The paper in her hand has been crushed out of shape. But you recognise the layout: last week’s mock exam rankings, the kind they pin up outside the staff room for the top ten.',
    words: [
      { jp: '順位', reading: 'じゅんい', zh: '名次、排名', en: 'ranking / placement' }
    ]
  },
  {
    type: 'narration',
    zh: '你往前走了一步。她猛地把纸背到身后，动作快得像被烫到。',
    en: 'You take a step closer. She whips the paper behind her back, fast, like something scalded her.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}surprised.webp`,
    jp: '見るな！',
    zh: '不许看！',
    en: 'Do not look!',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '太大声了。声音在雨里撞了一下，弹回来。两个人都愣住。',
    en: 'Too loud. The shout hits the rain and comes back at both of you. Neither of you moves.'
  },
  {
    type: 'narration',
    characterImage: `${A}sad.webp`,
    zh: '几秒钟之后，她自己先泄了气。手垂下来，那张纸露出一个角。',
    en: 'A few seconds later it is she who deflates first. Her hand drops. A corner of the paper shows.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: '……二位。',
    zh: '……第二名。',
    en: '...Second.',
    color: 'bg-red-600'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: '一位じゃないの。二位よ。',
    words: [
      { jp: '一番', reading: 'いちばん', zh: '第一、最（好）', en: 'first / the very best' }
    ],
    zh: '不是第一。是第二。',
    en: 'Not first. Second.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她终于转过身。眼睛是红的，脸上却一滴眼泪都没有——她大概已经在这里站了很久，久到把该流的全都逼了回去。',
    en: 'She finally turns around. Her eyes are red and her face is completely dry — she has been standing here long enough to force all of it back down.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: '……ねえ。あんた、私のこと、なんだと思ってる？',
    zh: '……喂。你把我当成什么？',
    en: '...Hey. What do you think I am, exactly?',
    color: 'bg-red-600'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: '委員長で、成績が良くて、あんたに日本語を教えてる人。……それだけでしょ。',
    zh: '委员长、成绩好、教你日语的那个人。……不就这些吗。',
    en: 'Class president. Good grades. The one who teaches you Japanese. ...That is the whole list, is it not.',
    color: 'bg-red-600'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: 'じゃあ——一番じゃない私は、何？',
    words: [
      { jp: '意味', reading: 'いみ', zh: '意义、意思', en: 'meaning / point' }
    ],
    zh: '那——不是第一的我，算什么？',
    en: 'Then what am I, when I am not first?',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '雨声忽然变得很大。',
    en: 'All at once the rain is very loud.'
  },

  // ==========================================================
  // 选择：三种回应，没有正确答案，只有你是哪种人
  // ==========================================================
  {
    type: 'choice',
    promptZh: '她在等一个回答。而且她已经准备好不接受任何一个了。',
    promptEn: 'She is waiting for an answer. And she has already decided not to accept any of them.',
    options: [
      // ---- A. 安慰（对她最伤的一种善意）----
      {
        id: 'asuka_comfort',
        labelZh: '「別に、一番じゃなくてもいいだろ」',
        labelEn: '"You do not have to be first."',
        hintZh: '你是真心的。这句话对九成的人都管用',
        hintEn: 'You mean it. It would work on nine people out of ten.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '你先想的是让她好受一点', reasonEn: 'Your first instinct was to make it hurt less' }
        ],
        relations: [
          { char: CharacterId.ASUKA, familiarity: 4, affection: 6, reasonZh: '你说了最不该说、但最像你会说的那句话', reasonEn: 'You said the worst possible thing, and the most like you' }
        ],
        setFlags: ['asuka_pitied'],
        then: [
          {
            type: 'narration',
            characterImage: `${A}angry.webp`,
            zh: '她的表情在半秒之内塌下去，然后重新绷紧——比刚才还紧。',
            en: 'Her face collapses for half a second, then pulls tight again — tighter than before.'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${A}angry.webp`,
            jp: '同情するな。',
            words: [
              { jp: '同情', reading: 'どうじょう', zh: '同情、可怜', en: 'pity / sympathy' }
            ],
            zh: '别可怜我。',
            en: 'Do not pity me.',
            color: 'bg-red-600'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${A}angry.webp`,
            jp: 'それ、「あんたなんかどうでもいい」って言ってるのと同じよ。わかってる？',
            zh: '那句话，跟「你怎样都无所谓」是一个意思。你知道吗？',
            en: 'That sentence means the same thing as "it does not matter what you are". Do you understand that?',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '你张了张嘴。她没给你机会。',
            en: 'You open your mouth. She does not give you the chance.'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${A}sad.webp`,
            jp: '……あんたにそう言われるのが、一番きついのよ。',
            zh: '……被你这么说，才是最难受的。',
            en: '...Hearing it from you is the part that hurts most.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '最后那句几乎没有声音。她自己好像也吓了一跳，立刻把脸转开了。',
            en: 'The last sentence barely has a voice. She seems startled by it herself, and turns her face away at once.'
          }
        ]
      },

      // ---- B. 递笔记本（行动，而不是话）----
      {
        id: 'asuka_notebook',
        labelZh: '什么也不说，把日语笔记本翻开递过去',
        labelEn: 'Say nothing. Open your Japanese notebook and hold it out.',
        hintZh: '每一页上都是她的红笔',
        hintEn: 'Every page is covered in her red pen.',
        effects: [
          { stat: 'charm', amount: 1, reasonZh: '你没有辩解，你把证据递了过去', reasonEn: 'You did not argue. You handed over the evidence' },
          { stat: 'knowledge', amount: 1, reasonZh: '那本笔记确实被你翻烂了', reasonEn: 'That notebook really has been read to pieces' }
        ],
        relations: [
          { char: CharacterId.ASUKA, familiarity: 6, affection: 10, reasonZh: '她看见了自己这三个月留下的东西', reasonEn: 'She saw what three months of her own handwriting had built' }
        ],
        setFlags: ['asuka_notebook'],
        then: [
          {
            type: 'narration',
            zh: '你把书包里那本翻得起毛边的笔记本抽出来，翻开，递到她面前。',
            en: 'You pull the dog-eared notebook out of your bag, open it, and hold it out to her.'
          },
          {
            type: 'narration',
            characterImage: `${A}surprised.webp`,
            zh: '整整一页密密麻麻的红字。她的字。每一个你搞错的助词旁边都标着：为什么错，下次该怎么想。',
            en: 'A full page dense with red. Her handwriting. Beside every particle you got wrong, a note on why it was wrong and how to think about it next time.'
          },
          {
            type: 'narration',
            zh: '你没有说话。只是往后翻了一页。又一页。再一页。全都是。',
            en: 'You do not say anything. You just turn a page. And another. And another. All of them.'
          },
          {
            type: 'narration',
            characterImage: `${A}sad.webp`,
            zh: '她伸手接了过去。翻的速度越来越慢。',
            en: 'She takes it. She turns the pages more and more slowly.'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${A}sad.webp`,
            jp: '……こんなの、取っておいて、どうするのよ。',
            zh: '……留着这种东西，你要干嘛啊。',
            en: '...What are you even keeping this for.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '声音已经不稳了。她把笔记本合上，抱在胸前，抱得很紧——像是怕还给你之后就没有了。',
            en: 'Her voice has stopped being steady. She closes the notebook and holds it against her chest, tightly, as if letting go of it would mean it had never existed.'
          }
        ]
      },

      // ---- C. 顶回去（她唯一能接受的安慰方式）----
      {
        id: 'asuka_talk_back',
        labelZh: '「じゃあ、俺の日本語が下手なのは誰のせいだ」',
        labelEn: '"Then whose fault is it that my Japanese is this bad?"',
        hintZh: '她不需要人扶。她需要有人站着跟她说话',
        hintEn: 'She does not want to be helped up. She wants someone still standing.',
        requires: { stat: 'guts', min: 3 },
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '对着这个状态的她顶回去，需要点胆子', reasonEn: 'Talking back to her in that state took something' }
        ],
        relations: [
          { char: CharacterId.ASUKA, familiarity: 8, affection: 8, reasonZh: '你把她当对手，而不是伤员', reasonEn: 'You treated her as an opponent, not as a casualty' }
        ],
        setFlags: ['asuka_talked_back'],
        then: [
          {
            type: 'narration',
            zh: '你把话丢回去，语气跟她一样冲。',
            en: 'You throw it back at her, in exactly her register.'
          },
          {
            type: 'narration',
            characterImage: `${A}surprised.webp`,
            zh: '她瞪着你。雨檐上的水一滴一滴落下来，落了大概有五秒。',
            en: 'She stares at you. Water drips off the eaves, one drop at a time, for about five seconds.'
          },
          {
            type: 'narration',
            characterImage: `${A}smug.webp`,
            zh: '然后她极短促地笑了一下。很难看，鼻子还是红的，但确实是笑。',
            en: 'Then she laughs, very briefly. It is not a good laugh, and her nose is still red, but it is a laugh.'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${A}smug.webp`,
            jp: '……あんた、最近、生意気になったわね。',
            words: [
              { jp: '生意気', reading: 'なまいき', zh: '狂妄、不知天高地厚', en: 'cheeky / impertinent' }
            ],
            zh: '……你最近，说话挺横啊。',
            en: '...You have got quite mouthy lately.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '这大概是她唯一能接受的安慰方式：被当成还站着的人，而不是需要扶的人。',
            en: 'This is probably the only comfort she can accept: being treated as someone still on her feet, rather than someone who needs helping up.'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // 转折：她的解决办法是把自己撤掉
  // ==========================================================
  {
    type: 'narration',
    zh: '雨小了一点。她低头看了很久自己的鞋尖。',
    en: 'The rain eases a little. She looks down at the toes of her shoes for a long time.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: '……委員長の仕事、しばらく外してもらう。',
    zh: '……委员长的工作，我打算先辞掉一段时间。',
    en: '...I am going to step down from the class president duties for a while.',
    color: 'bg-red-600'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: 'あんたの日本語の面倒も、他の誰かに頼んで。',
    zh: '你日语的事，也去拜托别人吧。',
    en: 'Ask someone else to look after your Japanese, too.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '你没听懂。不——你听懂了每一个词，只是不明白为什么。',
    en: 'You do not understand. No — you understood every word. You just do not understand why.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: '今の私が教えたって、あんたも二位になるだけでしょ。',
    zh: '现在这个我去教你，你也只会变成第二名而已吧。',
    en: 'If I teach you the way I am now, all you will become is second place too.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '你终于明白了。她不是在放弃你。她是在把自己从你身边拿开，因为她认定现在的自己没有资格站在这里。',
    en: 'And there it is. She is not giving up on you. She is removing herself from your side, because she has decided that the version of her standing here is not good enough to be there.'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '她把那张纸折起来塞进口袋，从你身边走过去。',
    en: 'She folds the paper away into her pocket and walks past you.'
  },
  {
    type: 'narration',
    zh: '走到中庭出口，她停住了。没有回头。',
    en: 'At the mouth of the courtyard she stops. She does not turn round.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}shy.webp`,
    jp: '……次は一番取るから。',
    zh: '……下次我会拿第一的。',
    en: '...I will take first place next time.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '一拍。雨从檐上落下来，正好落在两个人中间。',
    en: 'A beat. Water falls from the eaves, landing exactly between the two of you.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${A}shy.webp`,
    jp: '……だから、それまでに、いなくならないでよ。',
    words: [
      { jp: 'いなくなる', zh: '消失、不见了、离开', en: 'to be gone / to disappear' }
    ],
    zh: '……所以，在那之前，你别不见了啊。',
    en: '...So until then. Do not go anywhere.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '然后她就走进雨里了，没有撑伞，走得很快。',
    en: 'Then she walks out into the rain without an umbrella, walking fast.'
  },
  {
    type: 'narration',
    zh: '你站在原地想了很久才反应过来——刚才那句话，是求人。',
    en: 'You stand there for a long while before it lands: that last sentence was a request.'
  },
  {
    type: 'narration',
    zh: '而她这辈子，大概从来没求过任何人。',
    en: 'And she has probably never asked anyone for anything in her life.'
  },
  {
    type: 'effect',
    setFlags: ['asuka_story_rank_second'],
    effects: [
      { stat: 'knowledge', amount: 1, reasonZh: '你开始明白她那些红字是什么意思了', reasonEn: 'You are starting to understand what all that red ink meant' }
    ],
    relations: [
      { char: CharacterId.ASUKA, familiarity: 6, affection: 12, reasonZh: '她在你面前塌了一次，又自己站了起来', reasonEn: 'She came apart in front of you once, and put herself back together' }
    ]
  }
];
