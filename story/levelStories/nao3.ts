import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 奈绪 · 第③段「十年分の距離」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：校门口的樱花树下 + cg_nao
//
// 【第②段留下的题】
// 她问的是："回去的时候要是变成了别的人怎么办。"
// 这个问题不能用"我不会变"来答——那是撒谎，人当然会变，
// 而且她真正怕的也不是你变，是**她会被留在旧版本里**。
//
// 【怎么解：第①段那本清单】
// ① 里她把关于你的一切报了一遍，全对，全是十年前的，
// 而玩家给的解法是"那就每天添一条"。
// 这一段是那件事的结账：她真的记了。而且记了之后她发现——
// **新的那本比旧的那本厚得快。**
// 也就是说她怕的那件事（追不上）在事实层面已经不成立了。
//
// 【致敬：あの日見た花の名前 的反面】
// あの花里那群人各自往前走，只有一个停在原地守着回忆。
// 这一段把那个位置解开：守着回忆的人**自己动了**，
// 而且是她自己决定动的，不是被谁拉着动的。
// ---------------------------------------------------------

const N = '/images/characters/nao/';

export const NAO_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'school_gate',
    bgm: 'town',
    titleZh: '十年分の距離',
    titleEn: 'Ten Years of Distance',
    subtitleZh: '傍晚 · 校门口',
    subtitleEn: 'Evening · The school gate'
  },
  {
    type: 'narration',
    zh: '今年的樱花快落完了。校门口那棵最大的，风一吹就是一阵。',
    en: 'This year’s blossom is nearly finished. The big tree at the gate lets go a whole handful whenever the wind moves.'
  },
  {
    type: 'narration',
    characterImage: `${N}casual_neutral.webp`,
    zh: '她在树底下等你。手里拿着一本笔记本，不是她平时上课那本。',
    en: 'She is waiting under it with a notebook, and not the one she takes to class.'
  },
  {
    type: 'narration',
    zh: '封面上什么都没写。你看见她的手指一直在摩挲那个封面的边角，摩挲得起了毛。',
    en: 'There is nothing on the cover. Her thumb keeps going over the corner of it, and the corner has gone furry.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}casual_shy.webp`,
    jp: '……これ、見せたら笑う？',
    zh: '……给你看的话，你会笑吗？',
    en: '...Will you laugh if I show you this?',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你说不会。她还是犹豫了很久才递过来。',
    en: 'You say no. She still hesitates for a long time before she hands it over.'
  },

  // ---- 那本新的 ----
  {
    type: 'narration',
    zh: '第一页第一行的日期，是你们在北野坂那个矮墙上坐着的那天。',
    en: 'The date on the first line of the first page is the day you sat on that low wall on the Kitano slope.'
  },
  {
    type: 'narration',
    zh: '那天她说她的清单全是十年前的。那天你说：那就添一条，今天开始。',
    en: 'The day she said her list was all ten years old. The day you said: then add one, starting today.'
  },
  {
    type: 'narration',
    zh: '她真的记了。每天一条。',
    en: 'She did it. One a day.'
  },
  {
    type: 'narration',
    zh: '「食堂の唐揚げが出る日を、なぜか前日から知っている」',
    en: '"Somehow knows the day before whether there will be karaage."'
  },
  {
    type: 'narration',
    zh: '「関西弁の『ちゃう』を、たぶん無意識に使っている」',
    en: '"Has started using the local negative without noticing."'
  },
  {
    type: 'narration',
    zh: '「歩くのが速くなった。坂のせいだと思う」',
    en: '"Walks faster now. I think it is the hills."'
  },
  {
    type: 'narration',
    characterImage: `${N}casual_shy.webp`,
    zh: '你翻到最后一页。这本比你以为的厚得多。',
    en: 'You turn to the last page. It is much thicker than you expected.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}casual_shy.webp`,
    jp: '……びっくりしてん。こっちのほうが、増えるの速かった。',
    words: [{ jp: '増える', reading: 'ふえる', zh: '增加', en: 'to increase' }],
    zh: '……我自己也吓了一跳。这本，长得比那本快。',
    en: '...It surprised me. This one filled up faster than the old one.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '十年攒了一本。几个月攒了这一本。',
    en: 'Ten years made one notebook. A few months made this one.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '她站在那儿等你说点什么。风又吹下来一阵花瓣。',
    promptEn: 'She stands there waiting for you to say something. The wind brings down another handful.',
    options: [
      {
        id: 'nao3_not_behind',
        labelZh: '「你根本没有落下。你只是一直在记。」',
        labelEn: '"You never fell behind. You have been recording the whole time."',
        jp: '奈緒、遅れてへんよ。ずっと書いとったやん。',
        words: [{ jp: '遅れる', reading: 'おくれる', zh: '落后、迟到', en: 'to fall behind' }],
        hintZh: '她怕的那件事，在她自己手里的本子上已经不成立了',
        hintEn: 'The thing she is afraid of has already been disproved by the notebook in her own hands.',
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你用她自己的证据回答了她', reasonEn: 'You answered her with her own evidence' },
          { stat: 'knowledge', amount: 1, reasonZh: '你看懂了那两本的厚度差是什么意思', reasonEn: 'You worked out what the difference in thickness meant' }
        ],
        relations: [{ char: CharacterId.NAO, affection: 20, familiarity: 6, reasonZh: '她害怕的那件事被她自己推翻了', reasonEn: 'The thing she feared was disproved by her own hand' }],
        setFlags: ['nao_story_not_behind'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}curious.webp`,
            zh: '她愣住了。',
            en: 'She stops.'
          },
          {
            type: 'narration',
            zh: '你说：你以为自己拿着的是一份过期的档案。可是你从那天起每天都在更新它。',
            en: 'You say: she has been treating what she holds as an expired file. And she has been updating it every day since that afternoon.'
          },
          {
            type: 'narration',
            zh: '你说：现在这个世界上，最了解现在的我的人，还是你。',
            en: 'You say: right now, in this world, the person who knows the current version best is still her.'
          },
          {
            type: 'narration',
            characterImage: `${N}casual_shy.webp`,
            zh: '她把笔记本抢了回去，抱在胸前，转过身，肩膀在抖。',
            en: 'She takes the notebook back, holds it against her chest, turns round, and her shoulders go.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}casual_shy.webp`,
            jp: '……ずるいって、何回言わせんの。',
            zh: '……你要我说多少次"赖皮"啊。',
            en: '...How many times are you going to make me say that is unfair.',
            color: 'bg-emerald-500'
          }
        ]
      },
      {
        id: 'nao3_my_list',
        labelZh: '掏出外公的手账，翻到你记她的那几页',
        labelEn: "Take out your grandfather's journal, and open it to the pages about her",
        hintZh: '第①段你问过她这十年，然后你也开始记了',
        hintEn: 'You asked about her ten years on that slope, and then you started one too.',
        requires: { stat: 'kindness', min: 6 },
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你也记了，而且一直没说', reasonEn: 'You had been keeping one too, and had not mentioned it' }],
        relations: [{ char: CharacterId.NAO, affection: 22, familiarity: 4, reasonZh: '原来是两个人都在记', reasonEn: 'It turns out both of them had been recording' }],
        setFlags: ['nao_story_both_lists'],
        then: [
          {
            type: 'narration',
            zh: '你翻开手账最后那几页。上面有她的名字，还有一行一行的日期。',
            en: 'You open the back pages of the journal. Her name is there, and a column of dates.'
          },
          {
            type: 'narration',
            zh: '「中二の時から、終電に一人で乗る。どこにも行かず、一周して帰る」',
            en: '"Since her second year of middle school, rides the last train alone. Goes nowhere. Round and back."'
          },
          {
            type: 'narration',
            zh: '「怒ってる時、先に鞄を置く」',
            en: '"When she is angry, she puts her bag down first."'
          },
          {
            type: 'narration',
            zh: '「私が知らんかった十年の話を、まだ全部は聞けてない」',
            en: '"Have still not heard all of the ten years I was not there for."'
          },
          {
            type: 'narration',
            characterImage: `${N}curious.webp`,
            zh: '她读完之后很长时间没有说话。然后她笑了，笑得很难看。',
            en: 'She reads it and says nothing for a long time. Then she laughs, and it is not a pretty laugh.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}casual_shy.webp`,
            jp: '……なんで言わへんの、そういうの。',
            zh: '……这种事，你为什么不说啊。',
            en: '...Why would you not say something like that.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你说因为你以为记录本来就是不说的那种东西。她说那是铃的说法，不是你的。',
            en: 'You say you assumed a record was the sort of thing one keeps quietly. She says that is Rei’s reasoning, not yours.'
          }
        ]
      },
      {
        id: 'nao3_go_together',
        labelZh: '「等我回去的时候，你也一起。」',
        labelEn: '"When I go back, come with me."',
        jp: '帰るとき、奈緒も一緒に来て。',
        hintZh: '她怕的是"回去的那个人她不认识"。那就让她在场',
        hintEn: 'She is afraid of not knowing the one who goes back. So have her there.',
        requires: { stat: 'guts', min: 6 },
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你把一年以后的事说了出来', reasonEn: 'You said out loud a thing about a year from now' }],
        relations: [{ char: CharacterId.NAO, affection: 18, familiarity: 5, reasonZh: '她第一次被写进以后的安排里', reasonEn: 'For the first time she was written into a plan about later' }],
        then: [
          {
            type: 'narration',
            characterImage: `${N}curious.webp`,
            zh: '她瞪大了眼睛：「え、それ、どういう意味」。',
            en: 'Her eyes go wide. What is that supposed to mean.'
          },
          {
            type: 'narration',
            zh: '你说：意思是，回去的那个人是谁，你自己在场看着，就不用怕了。',
            en: 'You say: it means she can be there and see for herself who goes back, and then there is nothing to be afraid of.'
          },
          {
            type: 'narration',
            characterImage: `${N}casual_shy.webp`,
            zh: '她张嘴要说什么，说了一半停住了，然后非常小声地"嗯"了一声。',
            en: 'She starts to say something, stops halfway, and produces a very small yes.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '天暗下来了。校门的灯亮了，把树底下照成一小块白。',
    en: 'It gets dark. The gate light comes on and makes a small white patch under the tree.'
  },

  // ---- 双结局 ----
  {
    // 分岔不看好感度：这一段本来就是好感度 Lv.5 才触发的，
    // 再按好感度分，「挚友」那条永远走不到。
    // 改看親密度——她开局 215，到 240 意味着十年那道缝真的补上了。
    type: 'check',
    metric: 'familiarity',
    min: 240,

    // ============ 相爱 ============
    then: [
      {
        type: 'narration',
        characterImage: `${N}casual_shy.webp`,
        zh: '她把笔记本翻到最后一页，撕下来一张，折了两折，递给你。',
        en: 'She turns to the last page, tears one out, folds it twice, and holds it out.'
      },
      {
        type: 'speech',
        speakerZh: '奈绪', speakerEn: 'Nao',
        characterImage: `${N}casual_shy.webp`,
        jp: '今日の分。……今読まんといて。',
        zh: '今天那一条。……现在别看。',
        en: 'Today’s entry. ...Do not read it now.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '你说好。然后你当场打开了。',
        en: 'You say all right. Then you open it on the spot.'
      },
      {
        type: 'narration',
        characterImage: `${N}angry.webp`,
        zh: '她扑过来要抢，没抢到。',
        en: 'She lunges for it and does not get there.'
      },
      {
        type: 'narration',
        zh: '纸上只有一行字，字迹比前面那些都用力：',
        en: 'One line on the paper, pressed harder into it than any of the others:'
      },
      {
        type: 'narration',
        zh: '「この人のこと、たぶん十年前から好き。ずっと項目にできひんかった」',
        en: '"Have probably liked him for ten years. Could never make it an entry."'
      },
      {
        type: 'narration',
        zh: '十年，一本清单，每一条都写得下来，只有这一条一直写不下去。',
        en: 'Ten years and a full notebook, every fact of you recordable, and this one line never once written.'
      },
      {
        type: 'cg',
        cgId: 'cg_nao',
        imageUrl: '/images/cg/cg_nao.webp',
        titleZh: '十年分的距离', titleEn: 'Ten Years of Distance',
        captionZh: '她放弃抢了，站在原地，脸整个红透。花瓣落下来，落在两个人中间那一小块灯光里。',
        captionEn: 'She gives up reaching for it and stands still, entirely red. Petals come down into the small patch of light between you.'
      },
      {
        type: 'speech',
        speakerZh: '奈绪', speakerEn: 'Nao',
        characterImage: `${N}casual_love.webp`,
        jp: '……で、そっちの手帳には、いつ書いてくれんの。',
        zh: '……那，你那本手账上，什么时候写？',
        en: '...So. When does it go in yours.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '你当场写了。她凑过来看，看完把脸埋进你肩膀，说了一句「遅い」。',
        en: 'You write it there and then. She leans over to read it, puts her face into your shoulder, and says you are late.'
      },
      {
        type: 'narration',
        zh: '晚了十年。她说的是这个。',
        en: 'Ten years late. That is what she means.'
      },
      {
        type: 'effect',
        setFlags: ['nao_ending_love', 'nao_story_3_done'],
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '你当场读了那张不让读的纸', reasonEn: 'You read the paper you were told not to read' },
          { stat: 'kindness', amount: 2, reasonZh: '你也当场写了自己那一条', reasonEn: 'And wrote your own entry on the spot' }
        ],
        relations: [
          { char: CharacterId.NAO, affection: 24, familiarity: 12, reasonZh: '那一条终于写下来了', reasonEn: 'The entry finally got written' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'narration',
        characterImage: `${N}casual_neutral.webp`,
        zh: '她把笔记本收回去，塞进包里，动作利落。',
        en: 'She puts the notebook away in her bag, briskly.'
      },
      {
        type: 'speech',
        speakerZh: '奈绪', speakerEn: 'Nao',
        characterImage: `${N}casual_neutral.webp`,
        jp: '一個、決めてん。',
        zh: '我决定了一件事。',
        en: 'I have decided something.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '你问什么事。',
        en: 'You ask what.'
      },
      {
        type: 'speech',
        speakerZh: '奈绪', speakerEn: 'Nao',
        characterImage: `${N}happy.webp`,
        jp: '古いほう、捨てへん。でも、もう見返さへん。',
        words: [{ jp: '見返す', reading: 'みかえす', zh: '重看、翻回去看', en: 'to look back over' }],
        zh: '旧的那本，不扔。但不再翻了。',
        en: 'I am not throwing the old one away. But I am not going to keep looking back at it.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '守着旧的那本，是她这十年做的事。今天她决定不守了。',
        en: 'Keeping watch over the old one is what she has done for ten years. Today she has decided to stop keeping watch.'
      },
      {
        type: 'speech',
        speakerZh: '奈绪', speakerEn: 'Nao',
        characterImage: `${N}casual_neutral.webp`,
        jp: 'あんたが変わるんやったら、こっちも書き足していくだけやん。',
        zh: '你要是会变，那我就一直往下写不就行了。',
        en: 'If you are going to change, then I just keep writing. That is all.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '这句话解决了②里那个问题，而且解决得比任何告白都干净。',
        en: 'That answers the question from the cafeteria, and answers it more cleanly than a confession would have.'
      },
      {
        type: 'narration',
        characterImage: `${N}happy.webp`,
        zh: '走出校门的时候她走在里侧，跟十年前一样。区别是这次她走得比你快半步。',
        en: 'Going out of the gate she takes the inside, the way she always did. The difference is that this time she is half a step ahead.'
      },
      {
        type: 'narration',
        zh: '你们没有在一起。但那本新的笔记，一天都没有断过。',
        en: 'You are not together. But the new notebook has not missed a day.'
      },
      {
        type: 'effect',
        setFlags: ['nao_ending_friend', 'nao_story_3_done'],
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你陪着她把那本旧的放下了', reasonEn: 'You were there when she put the old one down' }
        ],
        relations: [
          { char: CharacterId.NAO, familiarity: 24, affection: 8, reasonZh: '她决定不再守着十年前那一份', reasonEn: 'She decided to stop keeping watch over the ten-year-old copy' }
        ]
      }
    ]
  }
];
