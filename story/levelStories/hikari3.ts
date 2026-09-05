import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 光 · 第③段「二年目の海」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：黄昏的港边（回到第①段那根栏杆）+ cg_hikari
//
// 【致敬：耳をすませば】
// 借的不是"月島雫和天沢聖司"这两个人，是那个故事真正的骨头：
// **一个人先走了，另一个人于是决定去成为配得上重逢的人。**
// 聖司去意大利学做小提琴，雫留下来写小说，两个人各自把自己
// 磨到能站在对方旁边——告白发生在离别的清晨，而承诺的内容不是
// "别走"，是"我也会走我自己的那条路"。
//
// 【为什么这个故事必须落在光身上】
// 第②段她的墙是"别对我太好，因为会习惯，习惯了你走的时候我撑不住"。
// 那堵墙的正面攻法是"我不走"——但那是撒谎，交换生一定会走。
// 唯一诚实的拆法是耳をすませば那一招：不承诺留下，
// 承诺**走的时候两个人都在往同一个方向走**。
//
// 【第二个致敬：秒速五センチメートル的反面】
// 秒速讲的是"两个人都很好，只是没有说出口，于是被距离磨没了"。
// 这一段把它翻过来用：她要说的那句话如果这次不说，
// 就会变成秒速里那封没寄出去的信。所以本段最锋利的一下
// 是**逼她把话说完整**——不是逼她留下。
//
// 【双结局】
// 相爱：她说出那句她练了一个月的话。
// 挚友：她说不出来，但她做了一件更难的事——她第一次没有先挥手，
// 站在原地等你走过来。对她来说那比告白难。
// 两条都不是失败，两条她都终于停止了表演。
// ---------------------------------------------------------

const H = '/images/characters/hikari/';

export const HIKARI_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'kobe_harbor',
    bgm: 'town',
    titleZh: '二年目の海',
    titleEn: 'The Sea, Second Year',
    subtitleZh: '黄昏 · 港边',
    subtitleEn: 'Dusk · The harbour'
  },
  {
    type: 'narration',
    zh: '交换项目的续签表贴出来那天，公告栏前面围了七八个人。表格很短，只有一栏要填：延长一年，或者不延长。',
    en: 'The day the renewal forms go up there are eight people at the noticeboard. The form is short. There is one field: extend by a year, or do not.'
  },
  {
    type: 'narration',
    zh: '截止日期是这个月底。',
    en: 'The deadline is the end of the month.'
  },
  {
    type: 'narration',
    characterImage: `${H}casual_neutral.webp`,
    zh: '光那天没有去看公告栏。她那天在教室里替人抄了一整节课的板书，抄得非常认真。',
    en: 'Hikari does not go and look. She spends that period copying the board for somebody else, very diligently.'
  },
  {
    type: 'narration',
    zh: '放学后她说要去港边。你们已经很久没有一起去过那儿了。',
    en: 'After school she says she wants to go down to the harbour. It has been a long time since you went there together.'
  },
  {
    type: 'narration',
    zh: '还是那根栏杆。海是四月末的颜色，比第一次来的时候亮。',
    en: 'The same rail. The sea is the colour that late April makes it, brighter than the first time you came.'
  },

  // ---- 她先开口，而且是那种打好草稿的开口 ----
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_happy.webp`,
    jp: '延長するんでしょ？　するよね。うん、するに決まってる。',
    words: [{ jp: '延長', reading: 'えんちょう', zh: '延长', en: 'extension' }],
    zh: '你会续吧？会的吧。嗯，肯定会的。',
    en: 'You are extending, right? You are. Yeah, obviously you are.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '她一口气把问题和答案都说完了，没有留位置给你回答。这是她的老办法。',
    en: 'She gets the question and the answer out in one breath, leaving no room for you to say either. It is an old technique of hers.'
  },
  {
    type: 'narration',
    characterImage: `${H}casual_neutral.webp`,
    zh: '然后她自己也听出来了这句话有多难看，闭上了嘴。',
    en: 'Then she hears how that sounded and shuts her mouth.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_sad.webp`,
    jp: '……ごめん。今の、なし。',
    zh: '……抱歉。刚才那句，不算。',
    en: '...Sorry. Scratch that.',
    color: 'bg-sky-500'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_sad.webp`,
    jp: 'あたしね、三月に帰るの。もう決まってる。二年目はないんだ、あたしのほうは。',
    zh: '我啊，三月回去。已经定了。我这边没有第二年。',
    en: 'I go back in March. It is already decided. There is no second year on my side.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '你不知道这件事。你甚至没有想过要问——她一直在这儿，她看起来永远会在这儿。',
    en: 'You did not know. It had not occurred to you to ask. She has always been here; she looks like someone who always will be.'
  },
  {
    type: 'narration',
    zh: '第②段那句"别对我太好，因为会习惯"，现在有了完整的意思：会走的那个人不是你。',
    en: 'The thing she said on the ferris wheel - do not be too nice, because I would get used to it - now has its full meaning. The one who leaves is not you.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '海面上有一艘船正在慢慢转向。她一直看着那艘船，不看你。',
    promptEn: 'Out on the water a ship is slowly coming about. She watches the ship and not you.',
    options: [
      {
        id: 'hikari3_when_decided',
        labelZh: '「什么时候定的。」',
        labelEn: '"When was it decided."',
        jp: 'いつ決まったん、それ。',
        hintZh: '她说"已经定了"，那就是有一个日期',
        hintEn: 'She said it is already decided, which means there is a date.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你没有先说自己的事', reasonEn: 'You did not lead with your own situation' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 4, affection: 12, reasonZh: '她终于被问到了那个日期', reasonEn: 'Somebody finally asked about the date' }],
        setFlags: ['hikari_story_asked_when'],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '她算了一下。算的时候手指在栏杆上敲。',
            en: 'She works it out, tapping the rail while she does.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_sad.webp`,
            jp: '……三週間前。観覧車の、次の日。',
            zh: '……三周前。坐摩天轮的第二天。',
            en: '...Three weeks ago. The day after the ferris wheel.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '三周。这三周里她每天都在笑，一次都没提。',
            en: 'Three weeks. She has smiled every day of those three weeks and mentioned it not once.'
          },
          {
            type: 'narration',
            zh: '你想起摩天轮上她说的最后一句：别对我太好，因为会习惯。第二天她就收到了通知。',
            en: 'You think of the last thing she said on the wheel. The notice came the next day.'
          }
        ]
      },
      {
        id: 'hikari3_not_extending',
        labelZh: '「我也还没决定。」',
        labelEn: '"I have not decided either."',
        jp: 'こっちもまだ決めてへん。',
        hintZh: '实话。你也在那张表前面站了很久',
        hintEn: 'True. You stood in front of that form for a while too.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有把自己的犹豫藏起来让她一个人难受', reasonEn: 'You did not hide your own hesitation and leave her alone in hers' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 6, affection: 9, reasonZh: '两个人第一次站在同一个问题前面', reasonEn: 'For once you were both standing in front of the same question' }],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_surprised.webp`,
            zh: '她转过头来。',
            en: 'She turns round.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_surprised.webp`,
            jp: 'なんで？　こっち、めっちゃ楽しそうにしてるやん。',
            zh: '为什么？你在这边不是过得挺开心的吗。',
            en: 'Why? You seem to be having a great time here.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说：开心，所以才难。留下来的理由太多了，多到你分不清哪一个是真的。',
            en: 'You say: that is exactly why it is hard. There are too many reasons to stay, so many that you cannot tell which one is the real one.'
          }
        ]
      },
      {
        id: 'hikari3_you_first',
        labelZh: '「你希望我怎么填。」',
        labelEn: '"What do you want me to put on it."',
        jp: '光は、どう書いてほしい。',
        hintZh: '这个问题她一定会躲。看她躲到哪儿去',
        hintEn: 'She will dodge this one. Watch where she goes.',
        requires: { stat: 'guts', min: 6 },
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你把选择权递到了一个从来不敢要东西的人手上', reasonEn: 'You handed the choice to someone who never asks for anything' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 3, affection: 15, reasonZh: '没有人问过她想要什么', reasonEn: 'Nobody has ever asked her what she wants' }],
        setFlags: ['hikari_story_asked_her_want'],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_surprised.webp`,
            zh: '她果然躲了。',
            en: 'She dodges, as expected.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_happy.webp`,
            jp: 'あたしの希望とか、関係ないっしょ。あんたの人生やん。',
            zh: '我希望什么没关系吧。这是你的人生啊。',
            en: 'What I want does not come into it. It is your life.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说：我问的就是你的希望。',
            en: 'You say: your want is the thing I am asking about.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '她沉默了很久。海风把她的头发吹到脸上，她这次没有拨开。',
            en: 'The silence goes on. The wind puts her hair across her face and this time she does not move it.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_sad.webp`,
            jp: '……ずるいよ、そういうの。',
            zh: '……这样很赖皮啊。',
            en: '...That is not fair.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说：赖皮的是你。你把想要的东西全部提前放弃了，然后说这样最省事。',
            en: 'You say: she is the one being unfair. She gives up everything she wants in advance and then calls that the easy way.'
          }
        ]
      }
    ]
  },

  // ---- 中段：两个人各自的那条路 ----
  {
    type: 'narration',
    zh: '天开始暗。港塔的灯一层一层亮起来，跟第①段那天一模一样。',
    en: 'It starts to go dark. The tower lights come up ring by ring, exactly as they did that first evening.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_neutral.webp`,
    jp: 'あたしね、帰ったら日本語の先生になろうかなって、思ってる。',
    words: [{ jp: '先生', reading: 'せんせい', zh: '老师', en: 'teacher' }],
    zh: '我啊，回去以后想当日语老师。',
    en: 'I have been thinking. When I go back, maybe I will teach Japanese.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '这是你第一次听她讲以后的事。她讲今天、讲明天，从来不讲以后。',
    en: 'It is the first time you have heard her talk about later. She talks about today and tomorrow. Never later.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}casual_neutral.webp`,
    jp: '一年目の子って、みんな七日目があるじゃん。あの七日目に、誰か一人いたらさ。',
    zh: '第一年的孩子，每个人都有那个第七天吧。要是那个第七天有一个人在的话。',
    en: 'Everyone in their first year has a seventh day, right. If there were one person there on that seventh day.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '她没有说"就像你之于我"。她说的是"就像我可以之于别人"。',
    en: 'She does not say: the way you were for me. She says: the way I could be for someone else.'
  },
  {
    type: 'narration',
    zh: '她把自己那一周的解法，变成了以后要去做的事。',
    en: 'She has turned what she worked out in that week into a thing she intends to go and do.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '海上那艘船已经转完了，正在往湾外开。',
    promptEn: 'The ship has finished coming about and is heading out of the bay.',
    options: [
      {
        id: 'hikari3_same_direction',
        labelZh: '「那我也去学。等你当老师的时候，我当那个第七天有人在的学生。」',
        labelEn: '"Then I will go and study too. When you are teaching, I will be the student who had someone on the seventh day."',
        jp: 'じゃあ、こっちも勉強する。光が先生になる頃に、間に合わせる。',
        hintZh: '不承诺留下。承诺往同一个方向走',
        hintEn: 'Do not promise to stay. Promise to walk the same way.',
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你给了一个比"我不走"更难兑现的承诺', reasonEn: 'You made a promise harder to keep than staying would have been' },
          { stat: 'knowledge', amount: 1, reasonZh: '你想清楚了自己要用这门语言干什么', reasonEn: 'You worked out what you want this language for' }
        ],
        relations: [{ char: CharacterId.HIKARI, familiarity: 6, affection: 18, reasonZh: '她第一次听见有人说要赶上她', reasonEn: 'It was the first time anyone said they would catch up to her' }],
        setFlags: ['hikari_story_same_direction'],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_surprised.webp`,
            zh: '她整个人转了过来。',
            en: 'She turns the whole of herself round.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_surprised.webp`,
            jp: '……それ、待っててって意味？',
            zh: '……那个意思是，要我等？',
            en: '...Does that mean wait for you?',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说不是。你说的是：你走你的，我走我的，走到能站在一起的地方。',
            en: 'You say no. You say: she goes her way and you go yours, until you get to a place where you can stand next to each other.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '她低下头，很久。风把她说的那句话吹得很轻。',
            en: 'She looks down for a long time. The wind takes most of what she says next.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_sad.webp`,
            jp: '……そういうの、初めて言われた。',
            zh: '……这种话，第一次有人对我说。',
            en: '...Nobody has ever said that to me before.',
            color: 'bg-sky-500'
          }
        ]
      },
      {
        id: 'hikari3_seventh_day',
        labelZh: '「你的第七天呢。那天谁在？」',
        labelEn: '"What about your seventh day. Who was there?"',
        jp: '光の七日目は。あの日、誰かおったん？',
        hintZh: '她一直在说要给别人当那个人。没有人问过她自己那天怎么过的',
        hintEn: 'She keeps talking about being that person for someone else. Nobody has asked how she got through her own.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你把她刚才那句话的箭头掉了个头', reasonEn: 'You turned her own sentence back around' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 8, affection: 14, reasonZh: '那一天她一个人过完的，你第一个问', reasonEn: 'She got through that day alone, and you are the first to ask' }],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '她愣住了。',
            en: 'She stops.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_sad.webp`,
            jp: '……いなかったよ。だから、知ってるの。いないとどうなるか。',
            zh: '……没有人。所以我才知道。没有人的话会变成什么样。',
            en: '...There was nobody. That is how I know what it is like when there is nobody.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说：那今天有。',
            en: 'You say: there is today.'
          },
          {
            type: 'narration',
            characterImage: `${H}casual_sad.webp`,
            zh: '她张嘴要反驳。这一次她没有反驳成功。',
            en: 'She opens her mouth to argue. This time the argument does not arrive.'
          }
        ]
      },
      {
        id: 'hikari3_stay',
        labelZh: '「那我续。为了你留下来。」',
        labelEn: '"Then I will extend. I will stay for you."',
        jp: '延長する。光のために残る。',
        hintZh: '最直接的一句。但她三月就走了',
        hintEn: 'The most direct thing you could say. She leaves in March regardless.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你说了一句非常好听的话', reasonEn: 'You said a very lovely thing' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 2, affection: 6, reasonZh: '她笑了，然后把这句话推了回来', reasonEn: 'She smiled, and handed the sentence back' }],
        then: [
          {
            type: 'narration',
            characterImage: `${H}casual_happy.webp`,
            zh: '她笑了。是那个装回去的笑。',
            en: 'She smiles. It is the one that gets put back on.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_happy.webp`,
            jp: 'それ、あたし三月におらんくなるけど？',
            zh: '可是我三月就不在了哦？',
            en: 'You do know I am gone in March, though?',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你答不上来。她拍了拍你的肩膀，力气比平常大。',
            en: 'You have no answer. She claps your shoulder, harder than she usually does.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}casual_neutral.webp`,
            jp: 'あたしのために決めんの、やめて。それ、いちばんしんどい。',
            zh: '别为了我做决定。那个最难受。',
            en: 'Do not decide anything because of me. That is the hardest one.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '她说得对。她也知道自己说得对，所以说完之后自己也难受了很久。',
            en: 'She is right. She knows she is right, and it makes her wretched for a long while after saying it.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '天彻底黑了。栏杆凉了下来。她一直没有走。',
    en: 'It goes fully dark. The rail cools. She has still not left.'
  },
  {
    type: 'narration',
    characterImage: `${H}casual_neutral.webp`,
    zh: '她做了一件很奇怪的事：她把手放下了，插进口袋，然后就那样站着，没有挥。',
    en: 'She does something odd. She lowers her hands into her pockets and simply stands there, not waving.'
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
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${H}casual_shy.webp`,
        jp: 'あのさ。一個、練習してきたこと言っていい？',
        words: [{ jp: '練習', reading: 'れんしゅう', zh: '练习', en: 'practice' }],
        zh: '话说。有一句我练过的，可以说吗？',
        en: 'Hey. Can I say a thing I practised?',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '你说可以。她深吸了一口气，然后——',
        en: 'You say yes. She takes a breath, and then—'
      },
      {
        type: 'narration',
        characterImage: `${H}casual_shy.webp`,
        zh: '——她笑场了。笑得蹲了下去，一边笑一边说"不行不行，重来"。',
        en: '—she cracks up. She folds down laughing, saying no, no, again, hold on.'
      },
      {
        type: 'narration',
        zh: '她重来了三次。第三次她终于说完了整句，而且中间一个字都没有笑。',
        en: 'She starts over three times. On the third she gets the whole sentence out, and she does not laugh once inside it.'
      },
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${H}casual_shy.webp`,
        jp: 'あたし、{name}のことが好き。ずっと前から、たぶん七日目より前から。',
        zh: '我喜欢你。很早以前就是了，大概比第七天还早。',
        en: 'I like you. For a long time. Probably from before the seventh day.',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '你想说她算错了——你们那时候还没见过。然后你意识到她说的是她自己的第七天，不是你的。',
        en: 'You want to point out the arithmetic: you had not met yet. Then you realise she means her own seventh day, not yours.'
      },
      {
        type: 'narration',
        zh: '她那天在这根栏杆上想的是"要是有一个人在就好了"。她把那个人后来长成的样子，认成了你。',
        en: 'What she thought at this rail that day was that it would have been good if one person had been there. The shape that person eventually took, she has decided, is yours.'
      },
      {
        type: 'cg',
        cgId: 'cg_hikari',
        imageUrl: '/images/cg/cg_hikari.webp',
        titleZh: '海风与心跳', titleEn: 'Sea Wind, Heartbeat',
        captionZh: '她伸出手来。这一次不是挥手，是要你握住。',
        captionEn: 'She puts her hand out. Not a wave this time. She wants you to take it.'
      },
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${H}casual_shy.webp`,
        jp: '三月までしかないけど。それでもいい？',
        zh: '只到三月哦。这样也可以吗？',
        en: 'It only runs until March. Is that all right?',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '你说：三月之后我去找你。她说那太远了。你说你已经跨过一整片海来过一次了。',
        en: 'You say: after March you will come and find her. She says that is far. You say you have already crossed an entire sea once.'
      },
      {
        type: 'narration',
        characterImage: `${H}casual_happy.webp`,
        zh: '她笑出了声，笑得整个港边都听得见。这一次的笑不是装回去的，是漏出来的。',
        en: 'She laughs out loud, loud enough for the whole waterfront. This one is not put on. This one leaks out.'
      },
      {
        type: 'effect',
        setFlags: ['hikari_ending_love', 'hikari_story_3_done'],
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '有人为了对你说一句话练了一个月', reasonEn: 'Somebody practised one sentence for a month, for you' },
          { stat: 'guts', amount: 2, reasonZh: '你答应了一件横跨一整片海的事', reasonEn: 'You agreed to something with an ocean in it' }
        ],
        relations: [
          { char: CharacterId.HIKARI, familiarity: 12, affection: 24, reasonZh: '她终于停止表演了', reasonEn: 'She finally stopped performing' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'narration',
        zh: '她站在那儿，手插在口袋里，一直没有挥。',
        en: 'She stands there with her hands in her pockets and does not wave.'
      },
      {
        type: 'narration',
        zh: '你等了很久才明白她在干什么：她在等你先过去。',
        en: 'It takes you a while to work out what she is doing. She is waiting for you to come over first.'
      },
      {
        type: 'narration',
        characterImage: `${H}casual_neutral.webp`,
        zh: '对一个把"先挥手"当成活下去的办法的人来说，这可能是她这辈子做过最冒险的事。',
        en: 'For someone whose way of surviving is to wave first, this is possibly the most dangerous thing she has ever attempted.'
      },
      {
        type: 'narration',
        zh: '你走了过去。',
        en: 'You go over.'
      },
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${H}casual_shy.webp`,
        jp: '……来た。ほんとに来た。',
        zh: '……来了。真的来了。',
        en: '...You came. You actually came.',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '她说的时候声音在抖，但她一直在笑，而且这次的笑是真的。',
        en: 'Her voice shakes saying it, and she is smiling the whole time, and this time the smile is real.'
      },
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${H}casual_happy.webp`,
        jp: 'あたし、告白とかせんよ。しちゃったら、三月に終わっちゃうやん。',
        words: [{ jp: '終わる', reading: 'おわる', zh: '结束', en: 'to end' }],
        zh: '我不会告白哦。告白了的话，三月就结束了嘛。',
        en: 'I am not confessing anything. If I did, it would end in March.',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '这句话你想了很久才想明白：她是故意不说的。不说，这件事就没有截止日期。',
        en: 'It takes you a long time to unpack that. She is not saying it on purpose. If it is never said, it never has a deadline.'
      },
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${H}casual_neutral.webp`,
        jp: '友達なら、ずっとやろ。国が違っても、友達はやめられへんもん。',
        zh: '朋友的话，就一直是了吧。就算国家不一样，朋友是没法辞职的。',
        en: 'Friends just carry on, right. Different countries or not, you cannot resign from being someone’s friend.',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '她说得很轻松，轻松得像在讲一个笑话。但她说到第三句就没有停顿了，一个磕巴都没有。这段话她练过。',
        en: 'She says it lightly, as light as a joke. But from the third sentence on there are no pauses in it, not one stumble. She has practised this.'
      },
      {
        type: 'narration',
        characterImage: `${H}casual_happy.webp`,
        zh: '走回车站的路上，她一路都在讲回国以后要考的那个教师资格，讲得非常具体——报名费多少，考几门，第一次没过要等多久。',
        en: 'On the way back to the station she talks the whole way about the teaching qualification she is going to sit, in a great deal of detail: the fee, how many papers, how long you wait if you fail the first time.'
      },
      {
        type: 'narration',
        zh: '她已经查过了。她查的时候，大概想的是那个第七天一个人都没有的自己。',
        en: 'She has looked it all up. When she looked it up, she was probably thinking of the version of herself who had nobody on the seventh day.'
      },
      {
        type: 'narration',
        zh: '你们没有在一起。但从今天起，她不用再先挥手了。',
        en: 'You are not together. But from today she does not have to wave first any more.'
      },
      {
        type: 'effect',
        setFlags: ['hikari_ending_friend', 'hikari_story_3_done'],
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你走过去了，而且没有让她解释为什么要等', reasonEn: 'You went over, and did not make her explain why she was waiting' }
        ],
        relations: [
          { char: CharacterId.HIKARI, familiarity: 24, affection: 8, reasonZh: '她说朋友是没法辞职的，她是认真的', reasonEn: 'She said you cannot resign from being someone’s friend, and she meant it' }
        ]
      }
    ]
  }
];
