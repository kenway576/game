import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 明日香 · 第③段「放課後の残り日」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：夕阳下的空教室 + cg_asuka
//
// 接第②段：她说"下次我会拿第一"，然后说"在那之前别不见了"。
// 这一段是"下次"到了。
//
// 【为什么她拿了第一还是不高兴】
// 第②段的病根不是名次，是"我的价值是有条件的"。
// 所以如果这一段写成"她拿了第一，皆大欢喜"，等于承认那个条件成立，
// 前一段就白写了。她必须在拿到第一之后才发现：那个东西补不上她的洞。
// 她要的是有人告诉她，掉到第二的那个月里，她也没有变成别的东西。
//
// 【双结局是同一段，只在最后岔开】
// 前面所有铺垫两条线共用。check 的门槛定在 200：
// 走到这一段本来就要 220，所以绝大多数玩家会进"相爱"；
// 落在 200 以下的是那些一路选"给她台阶、不戳破、保持距离"的人——
// 对这种玩法来说，挚友结局才是他们一直在写的那个结局，不是罚分。
//
// 挚友结局照"另一种圆满"写：她说的话同样只对你说得出口，
// 而且她给的那个承诺（每周四）比情话更难做到。
//
// 【致敬：这一段是爱丽丝那条线的结账】
// 《无职转生》的爱丽丝不是被拒绝才走的，是觉得自己还不配站在旁边，
// 于是退开去变强，留下一句没头没尾的告别。第②段明日香做了一模一样的事：
// "下次我会拿第一"——那是"我去变得配得上"。
//
// 这一段是她回来兑现的那一天。而故事必须诚实地告诉她：
// **那条路走通了，东西没换到。**
// 因为她要换的从来不是名次，是"我配站在这儿"这件事的凭据，
// 而这个凭据不是靠赢来的——爱丽丝练了那么多年剑，
// 最后需要的也只是有人说"你回来了"。
//
// 所以第一个选项（那一个月我也在）才是这一段的正解：
// 它给的不是安慰，是**收据**——你不在第一名的那个月，
// 你做的那些事我全都收到了。
// ---------------------------------------------------------

const A = '/images/characters/asuka/';

export const ASUKA_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'classroom_sunset',
    bgm: 'chat',
    titleZh: '放課後の残り日',
    titleEn: 'What Is Left of the Afternoon',
    subtitleZh: '放学后 · 空教室',
    subtitleEn: 'After school · The empty classroom'
  },
  {
    type: 'narration',
    zh: '成绩榜贴出来那天，走廊里挤了三层人。你没挤进去。中午的时候，光跑过来告诉你了。',
    en: 'The day the rankings go up there are three rows of people in front of the board. You do not get near it. At lunch, Hikari runs over and tells you.'
  },
  {
    type: 'narration',
    zh: '第一名。名字后面那个数字比第二名高出十一分。',
    en: 'First. Eleven points clear of second.'
  },
  {
    type: 'narration',
    zh: '你以为她会来说点什么。她一整天什么都没说。',
    en: 'You expected her to say something. She says nothing all day.'
  },
  {
    type: 'narration',
    zh: '放学后你回教室拿东西。她一个人坐在座位上，书包还挂在椅背上，夕阳把整间教室染成橘色。',
    en: 'After school you come back for your things. She is sitting alone at her desk, bag still on the chair, the whole room orange.'
  },
  {
    type: 'narration',
    characterImage: `${A}neutral.webp`,
    zh: '她面前摊着那张成绩单。已经摊了不知道多久了。',
    en: 'The results sheet is open in front of her, and has been for some unknown length of time.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: '……取ったわよ。一番。',
    zh: '……拿到了。第一。',
    en: '...I took it. First.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她的声音里没有任何东西。不是谦虚，是真的什么都没有。',
    en: 'There is nothing in her voice. Not modesty. Genuinely nothing.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: '……で、それだけだった。',
    words: [{ jp: 'それだけ', reading: 'それだけ', zh: '就这样、仅此而已', en: 'that was all' }],
    zh: '……然后，就这样。',
    en: '...And that was all.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她把成绩单翻过去，扣在桌上。',
    en: 'She turns the sheet face down on the desk.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: '一番取ったら、戻れると思ってた。前の私に。',
    zh: '我以为拿到第一就能回去了。回到以前的我。',
    en: 'I thought if I took first I would go back. To the person I was.',
    color: 'bg-red-600'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: '戻らなかった。二位だった一ヶ月が、消えないの。',
    zh: '没回去。当第二名的那一个月，消不掉。',
    en: 'It did not. The month I was second does not go away.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '你想起中庭那场雨。她说下次会拿第一，然后求你别不见。',
    en: 'You think of the rain in the courtyard. She said she would take first next time, and then asked you not to disappear.'
  },
  {
    type: 'narration',
    zh: '她做到了前一半。她大概从来没打算让你知道后一半有多重要。',
    en: 'She has delivered on the first half. She probably never intended you to know how much the second half weighed.'
  },
  {
    type: 'narration',
    zh: '她从书包里抽出一叠纸，摔在桌上。是这一个月的错题本，厚得不像一个月的量。',
    en: 'She pulls a wad of paper out of her bag and drops it on the desk. It is a month of corrections, and far too thick to be a month of corrections.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: '毎日四時間。三十日。全部やった。',
    words: [{ jp: '毎日', reading: 'まいにち', zh: '每天', en: 'every day' }],
    zh: '每天四小时。三十天。全都做了。',
    en: 'Four hours a day. Thirty days. I did all of it.',
    color: 'bg-red-600'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}sad.webp`,
    jp: 'ちゃんと取り返した。取り返したのに、何も返ってこなかった。',
    words: [{ jp: '取り返す', reading: 'とりかえす', zh: '夺回、挽回', en: 'to take back / to regain' }],
    zh: '我确实把它夺回来了。夺回来了，可是什么都没有回来。',
    en: 'I took it back. I did take it back. And nothing came back with it.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她说的是"夺回来"。她一直把那个月当成被人抢走的东西，而不是发生过的三十天。',
    en: 'She says she took it back. She has been treating that month as something stolen from her, rather than as thirty days that happened.'
  },
  {
    type: 'narration',
    zh: '她拿名次去换一样东西。她付了三十天，货没到。',
    en: 'She was trading a ranking for something. She paid thirty days, and the goods never arrived.'
  },

  // ---- 关键选择：这一段权重最大的一下 ----
  {
    type: 'choice',
    promptZh: '教室里只有你们两个。她没有赶你走，这本身就是一句话。',
    promptEn: 'There is nobody else in the room. She has not told you to go, which is itself a sentence.',
    options: [
      {
        id: 'asuka3_that_month',
        labelZh: '「那一个月我也在。你没有变成别人。」',
        labelEn: '"I was there that month too. You did not turn into someone else."',
        jp: 'あの一ヶ月、俺も居たよ。あんたは別の誰かになってなかった。',
        words: [{ jp: '別の', reading: 'べつの', zh: '别的、另一个', en: 'another / a different' }],
        hintZh: '掉到第二的那个月，她照样每周四给你标注音',
        hintEn: 'The month she was second, she still pencilled your readings in every Thursday.',
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你说的是她最不敢问的那件事', reasonEn: 'You answered the thing she was most afraid to ask' },
          { stat: 'guts', amount: 1, reasonZh: '你没有绕开', reasonEn: 'You did not go around it' }
        ],
        relations: [{ char: CharacterId.ASUKA, familiarity: 6, affection: 16, reasonZh: '有人替她证明了那一个月', reasonEn: 'Someone accounted for that month on her behalf' }],
        setFlags: ['asuka_story_that_month'],
        then: [
          {
            type: 'narration',
            characterImage: `${A}surprised.webp`,
            zh: '她抬起头。',
            en: 'She looks up.'
          },
          {
            type: 'narration',
            zh: '你说：那个月你还是每周四来图书室，还是把讲义标满假名，还是在走廊上骂我把「委嘱」念成「委员长」。',
            en: 'You say: that month she still came to the library on Thursdays, still filled in every reading, still told you off in the corridor for saying "iinchou" when the word was "ishoku".'
          },
          {
            type: 'narration',
            zh: '你说：第二名的明日香，跟第一名的明日香，我一个字都没看出区别。',
            en: 'You say: between the Asuka who was second and the Asuka who is first, you could not tell the difference by a single word.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}sad.webp`,
            jp: '……ずるい。',
            zh: '……你太赖皮了。',
            en: '...That is not fair.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '她把脸埋进手臂里。肩膀抖了两下，然后停住了——她连哭都要控制次数。',
            en: 'She puts her face into her arms. Her shoulders go twice, and then stop; she rations even this.'
          }
        ]
      },
      {
        id: 'asuka3_congratulate',
        labelZh: '先好好恭喜她，别急着谈别的',
        labelEn: 'Congratulate her properly first, and leave the rest',
        jp: 'おめでとう。まずはそれを言わせて。',
        hintZh: '她今天一整天，没有一个人说过这两个字',
        hintEn: 'All day today, nobody has said that word to her once.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你注意到今天没有人恭喜过她', reasonEn: 'You noticed that nobody had congratulated her' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 8, affection: 9, reasonZh: '她把"应该的"当成了"没有人会说的"', reasonEn: 'She had filed "expected of her" under "nobody will mention it"' }],
        then: [
          {
            type: 'narration',
            characterImage: `${A}surprised.webp`,
            zh: '她愣住了。',
            en: 'She stops.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}surprised.webp`,
            jp: '……今日、初めて言われた。',
            zh: '……今天第一次有人跟我说这个。',
            en: '...That is the first time anyone has said that today.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '全校都知道她是第一。所以全校都觉得这没什么好说的。',
            en: 'The whole school knows she came first. Which is precisely why the whole school found it not worth mentioning.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}sad.webp`,
            jp: '当たり前のことって、誰も言ってくれないのね。',
            words: [{ jp: '当たり前', reading: 'あたりまえ', zh: '理所当然', en: 'a matter of course' }],
            zh: '理所当然的事，是没有人会说出口的呢。',
            en: 'Nobody says the things that go without saying, do they.',
            color: 'bg-red-600'
          }
        ]
      },
      {
        id: 'asuka3_quit',
        labelZh: '「那就别当第一了。试试看。」',
        labelEn: '"Then stop being first. Try it."',
        jp: 'じゃあ、一番やめてみたら。',
        hintZh: '很冒险。她可能会翻脸',
        hintEn: 'A risk. She may well turn on you.',
        requires: { stat: 'guts', min: 6 },
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你对着一个把命挂在名次上的人说了这句话', reasonEn: 'You said that to someone whose life hangs off a ranking' }
        ],
        relations: [{ char: CharacterId.ASUKA, familiarity: 4, affection: 13, reasonZh: '没有人敢跟她说这句话', reasonEn: 'Nobody has ever dared say that to her' }],
        setFlags: ['asuka_story_told_her_to_quit'],
        then: [
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}angry.webp`,
            jp: 'は？　あんた何言って——',
            zh: '哈？你说什么——',
            en: 'What? What are you—',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '你说：你已经证明过一次了。现在把它放下，看看剩下的还有多少。',
            en: 'You say: she has proved it once already. Now put it down and see how much is left.'
          },
          {
            type: 'narration',
            characterImage: `${A}surprised.webp`,
            zh: '她张着嘴。要反驳的话在喉咙里排了一整队，一句都没出来。',
            en: 'Her mouth stays open. There is a whole queue of arguments in her throat and not one of them comes out.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}sad.webp`,
            jp: '……残ってなかったら、どうすんのよ。',
            zh: '……要是什么都不剩，怎么办。',
            en: '...And if there is nothing left?',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '这就是那个洞。她终于把它说出来了。',
            en: 'There it is. The hole. She has finally said it out loud.'
          },
          {
            type: 'narration',
            zh: '你说：那我就是剩下的那部分。',
            en: 'You say: then you are what is left.'
          },
          {
            type: 'narration',
            characterImage: `${A}shy.webp`,
            zh: '很久没有人说话。窗外有社团在跑步，口号一遍一遍地传上来。',
            en: 'For a long while nobody says anything. Outside, a club is running laps; the call comes up again and again.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '夕阳已经落到操场那排树后面了。教室里的橘色变成了很浅的紫。',
    en: 'The sun has dropped behind the trees at the edge of the field. The orange in the room has gone a very pale violet.'
  },
  {
    type: 'narration',
    characterImage: `${A}shy.webp`,
    zh: '她站起来，走到你桌子前面，然后没有走开。',
    en: 'She stands, comes as far as your desk, and then does not go anywhere.'
  },

  // ---- 双结局：同一段铺垫，最后一下岔开 ----
  {
    type: 'check',
    metric: 'affection',
    min: 200,

    // ============ 相爱 ============
    then: [
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}shy.webp`,
        jp: 'ねえ。一個だけ、聞いていい？',
        zh: '喂。我只问一件事，行吗？',
        en: 'Hey. Can I ask you one thing?',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '她两只手抓着自己的裙摆，抓得很紧。你从来没见过她做这个动作。',
        en: 'Both hands have hold of her skirt, gripping hard. You have never seen her do that.'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}shy.webp`,
        jp: 'あんたが日本語できるようになったら、私、要らなくなる？',
        words: [{ jp: '要る', reading: 'いる', zh: '需要', en: 'to be needed' }],
        zh: '等你日语学会了，我就不需要了吧？',
        en: 'Once you can speak Japanese, you will not need me any more, will you.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '一整年的红笔、注音、周四的图书室，全都通向这一个问题。',
        en: 'A whole year of red ink, pencilled readings and Thursdays in the library, all of it leading to this one question.'
      },
      {
        type: 'narration',
        zh: '你伸手，把她抓着裙摆的那只手拿了下来。',
        en: 'You reach over and take the hand that is holding her skirt.'
      },
      {
        type: 'narration',
        zh: '你说：我学日语，是为了能用你的语言，把这句话说清楚。',
        en: 'You say: the reason you are learning Japanese is so that you can say this next sentence properly, in her language.'
      },
      {
        type: 'speech',
        speakerZh: '你', speakerEn: 'You',
        jp: '好きだ。ずっと前から。',
        zh: '我喜欢你。很早以前就是了。',
        en: 'I like you. I have for a long time.',
        color: 'bg-yellow-500'
      },
      {
        type: 'cg',
        cgId: 'cg_asuka',
        imageUrl: '/images/cg/cg_asuka.webp',
        titleZh: '放学后的余晖', titleEn: 'After-School Twilight',
        captionZh: '她低下头，然后往前倾了一点点。窗外的天已经全暗了，只有走廊的灯照进来一条。',
        captionEn: 'She lowers her head, then leans in, just slightly. Outside it has gone fully dark; the only light is one strip from the corridor.'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}shy.webp`,
        jp: '……発音、まだ甘い。',
        zh: '……发音，还不够。',
        en: '...Your pronunciation is still soft.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '她说这句话的时候，声音抖得比你还厉害。',
        en: 'Her voice, saying that, is shaking worse than yours was.'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}shy.webp`,
        jp: '……もう一回。ゆっくり、ちゃんと言って。',
        zh: '……再说一遍。慢一点，好好说。',
        en: '...Again. Slowly. Say it properly.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '你说了第二遍。她纠正了一个音。你说了第三遍。',
        en: 'You say it a second time. She corrects one syllable. You say it a third.'
      },
      {
        type: 'narration',
        zh: '第三遍她没有纠正。她只是把额头抵在你肩上，很小声地说了一句「合格」。',
        en: 'The third time she does not correct it. She just puts her forehead against your shoulder and says, very quietly, that it passes.'
      },
      {
        type: 'effect',
        setFlags: ['asuka_ending_love', 'asuka_story_3_done'],
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '你把一句话练到了她肯给及格', reasonEn: 'You drilled one sentence until she would pass it' }
        ],
        relations: [
          { char: CharacterId.ASUKA, familiarity: 12, affection: 24, reasonZh: '她问的那个问题，你回答了', reasonEn: 'You answered the question she asked' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}neutral.webp`,
        jp: 'ねえ。一個、約束して。',
        words: [{ jp: '約束', reading: 'やくそく', zh: '约定', en: 'a promise' }],
        zh: '喂。跟我约定一件事。',
        en: 'Hey. Promise me one thing.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '她说的是「约定」，不是「拜托」。这个人到最后也不肯用软的那个词。',
        en: 'She says "promise", not "please". Even now she will not use the soft word.'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}neutral.webp`,
        jp: 'あんたがどこ行っても、木曜だけは空けときなさい。',
        zh: '不管你以后去哪儿，星期四给我空出来。',
        en: 'Wherever you end up, you keep Thursdays free.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '周四。图书室。一摞不需要注音的讲义。',
        en: 'Thursday. The library. A stack of handouts that does not need furigana.'
      },
      {
        type: 'narration',
        zh: '你说：你要是回国了呢。',
        en: 'You say: and if you go home?'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}smug.webp`,
        jp: '時差なんて、計算すればいいでしょ。',
        zh: '时差算一下不就行了。',
        en: 'Time zones are arithmetic.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '她说得像在讲一道很简单的题。这个人一辈子都会用讲题的方式说重要的话。',
        en: 'She says it the way she would explain an easy problem. This person will spend her whole life saying important things as though they were coursework.'
      },
      {
        type: 'narration',
        characterImage: `${A}neutral.webp`,
        zh: '她把书包甩上肩，走到门口，回头看了你一眼。',
        en: 'She swings her bag onto her shoulder, gets as far as the door, and looks back.'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}neutral.webp`,
        jp: 'あのさ。一番取っても、何も変わんなかったけど。',
        zh: '话说。拿了第一，也没什么变化。',
        en: 'By the way. Taking first changed nothing.',
        color: 'bg-red-600'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${A}shy.webp`,
        jp: '……二位だった月に、木曜が続いてたのは、変わったことだったと思う。',
        zh: '……不过第二名那个月，周四没有断，我觉得这算是变化。',
        en: '...But the month I was second, the Thursdays did not stop. I think that counted as a change.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '这大概是明日香这辈子说过的最接近「谢谢」的一句话。',
        en: 'That is very likely the closest Asuka has come, in her entire life, to saying thank you.'
      },
      {
        type: 'narration',
        zh: '你们不是恋人。但走廊上那两步的距离，从今天开始不会再变远了。',
        en: 'You are not together. But those two paces in the corridor are never going to get any wider than this.'
      },
      {
        type: 'effect',
        setFlags: ['asuka_ending_friend', 'asuka_story_3_done'],
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你们两个都没有把这段关系推去它没准备好的地方', reasonEn: 'Neither of you pushed this anywhere it was not ready to go' }
        ],
        relations: [
          { char: CharacterId.ASUKA, familiarity: 24, affection: 8, reasonZh: '周四那个约定，她是认真的', reasonEn: 'She meant the thing about Thursdays' }
        ]
      }
    ]
  }
];
