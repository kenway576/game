import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 稻荷 · 第①段「千年の暇つぶし」
//
// 触发：親密度 Lv.3「朋友」(90)
// 场景：生田神社的林子
//
// 她的表层是"看透一切的千年神明"：什么都知道，什么都不惊讶，
// 用一种非常轻的语气讲非常重的事。
//
// 【第①段要露的那一面】
// 不是"她其实很寂寞"——那是第②段的东西，而且写在第①段就太便宜了。
// 这一段要露的是**尺度**：她说的"最近""上次""一会儿"，
// 全都不是人的单位。玩家得亲耳听见一次这个错位，
// 才会明白后面她说"你也会走"的时候在说什么。
//
// 【致敬：辉夜姬那条线】
// 借的是"看着人间的人一茬一茬地过去"这个形状，不是月亮的设定。
// 所以这一段里她数的是树，不是年份——一棵树她见过种下、烧掉、再种。
// 那棵树在 1945 年和 1995 年各死过一次。这两个年份不用解释。
//
// 【她第一次让你看见她不是人】
// 只给一个很小的证据：石头上落着的叶子，没有风，自己让开了路。
// 神明不需要表演神迹。她只是没有再费劲遮。
// ---------------------------------------------------------

const I = '/images/characters/inari/';

export const INARI_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'ikuta_shrine',
    bgm: 'night',
    titleZh: '千年の暇つぶし',
    titleEn: 'A Thousand Years to Kill',
    subtitleZh: '傍晚 · 生田神社',
    subtitleEn: 'Evening · Ikuta Shrine'
  },
  {
    type: 'narration',
    zh: '生田神社的后面有一小片林子，夹在两栋写字楼中间。走进去三十步，外面的声音就没有了。',
    en: 'There is a small wood behind Ikuta Shrine, wedged between two office blocks. Thirty paces in, the outside stops making any sound.'
  },
  {
    type: 'narration',
    characterImage: `${I}neutral.webp`,
    zh: '她坐在一块石头上，晃着一只脚。四月的石头是凉的——凉到你光是站在旁边都替她觉得冷。她像是不知道这回事。她一直是这样，你已经不问了。',
    en: 'She is sitting on a rock, swinging one foot. April stone is cold — cold enough that you feel it on her behalf just standing there. She appears not to have noticed. She always is like this. You have stopped asking.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}smug.webp`,
    jp: 'おや。今日は早いのう。',
    zh: '哦呀。今天来得早呢。',
    en: 'Oh my. You are early today.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '你说你放学就直接来了。她"ふむ"了一声，然后拍了拍旁边的石头。',
    en: 'You say you came straight from school. She makes a considering noise and pats the rock beside her.'
  },
  {
    type: 'narration',
    zh: '石头上落着几片叶子。你还没坐下，叶子就往两边让开了。没有风。',
    en: 'There are leaves on the rock. Before you sit, they move aside. There is no wind.'
  },
  {
    type: 'narration',
    zh: '她没有解释。她甚至没有看那边。',
    en: 'She does not explain. She does not even look at them.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '你坐下了。石头是温的，比傍晚该有的温度高。',
    promptEn: 'You sit. The rock is warm, warmer than an evening accounts for.',
    options: [
      {
        id: 'inari1_leaves',
        labelZh: '「叶子刚才自己动了。」',
        labelEn: '"Those leaves moved by themselves."',
        jp: '今、葉っぱが勝手にどいた。',
        hintZh: '你决定问出来',
        hintEn: 'You decide to say it out loud.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你把看见的东西说了出来', reasonEn: 'You said the thing you saw' }],
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 6, reasonZh: '大部分人会说服自己那是风', reasonEn: 'Most people talk themselves into it having been the wind' }],
        setFlags: ['inari_story_saw_leaves'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}surprised.webp`,
            zh: '她转过来看你，眼睛在暗下来的林子里亮了一下。那不是反光。',
            en: 'She turns to look at you, and her eyes catch the light in the darkening wood. It is not a reflection.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}smug.webp`,
            jp: 'ふふ。気づく子は、久しぶりじゃ。',
            words: [{ jp: '久しぶり', reading: 'ひさしぶり', zh: '好久没有了', en: 'it has been a while' }],
            zh: '呵呵。会注意到的孩子，好久没有了。',
            en: 'Heh. It has been a while since one of you noticed.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '「好久」。你顺口问了一句多久。',
            en: '"A while." You ask, casually, how long a while.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}neutral.webp`,
            jp: 'ん？　……そうさな。戦の前じゃ。',
            zh: '嗯？……我想想。是打仗之前。',
            en: 'Mm? ...Let me think. Before the war.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '哪一场战争，她没有说。你也没有问。',
            en: 'She does not say which war. You do not ask.'
          }
        ]
      },
      {
        id: 'inari1_pretend',
        labelZh: '装作没看见，坐下',
        labelEn: 'Pretend not to have seen, and sit down',
        hintZh: '有些事情，你觉得等她自己说比较好',
        hintEn: 'Some things, you would rather she raised herself.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你把话语权留给了她', reasonEn: 'You left it to her to bring up' }],
        relations: [{ char: CharacterId.INARI, familiarity: 8, affection: 3, reasonZh: '她注意到你注意到了，而且没说', reasonEn: 'She noticed you noticing, and noticed that you said nothing' }],
        then: [
          {
            type: 'narration',
            characterImage: `${I}smug.webp`,
            zh: '你在落叶边坐了下来。她那双狐狸般狡黠深邃的眼眸静静凝视着你，随即弯起唇角，露出一抹了然的微笑。',
            en: 'You sit among the fallen leaves. Her fox-like, deep gaze watches you quietly before her lips curve into an understanding smile.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}smug.webp`,
            jp: '見なかったことにするのが、いちばん人らしいのう。',
            zh: '当作没看见——这才最像人呢。',
            en: 'Deciding you did not see it. That is the most human thing there is.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她说「像人」的时候，用的是那种在说别人的语气。',
            en: 'When she says "human", the tone is the one you use about other people.'
          }
        ]
      },
      {
        id: 'inari1_shoes',
        labelZh: '把自己的外套铺在石头上，让她坐着不硌',
        labelEn: 'Spread your blazer on the rock so it is not hard to sit on',
        hintZh: '四月的石头，她已经坐了不知道多久',
        hintEn: 'April stone, and she has been sitting on it for who knows how long.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你把一个神明当成了一个会冷的人', reasonEn: 'You treated a deity as someone who could get cold' }],
        relations: [{ char: CharacterId.INARI, familiarity: 5, affection: 9, reasonZh: '很少有人操心她冷不冷', reasonEn: 'Not many people worry about whether she is cold' }],
        setFlags: ['inari_story_blazer'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}surprised.webp`,
            zh: '她低头看着那件外套，看了很久，久到你开始觉得自己是不是冒犯了什么。',
            en: 'She looks down at the blazer for long enough that you start to wonder whether you have offended something.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}shy.webp`,
            jp: '……わらわは、寒くはならぬぞ。',
            zh: '……我啊，是不会冷的哦。',
            en: '...I do not get cold, you know.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '话是这么说，她还是坐了上去，而且把外套的边角仔细地捋平了。',
            en: 'She says so, and sits on it anyway, and smooths the corners down carefully.'
          }
        ]
      }
    ]
  },

  // ---- 那棵树 ----
  {
    type: 'narration',
    zh: '天完全暗了。她指了指林子中间那棵最大的树。',
    en: 'It goes fully dark. She points at the largest tree in the middle of the wood.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}neutral.webp`,
    jp: 'あれはの、三代目じゃ。',
    words: [{ jp: '三代目', reading: 'さんだいめ', zh: '第三代', en: 'the third of its line' }],
    zh: '那棵啊，是第三代。',
    en: 'That one is the third of its line.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '你问前两代呢。',
    en: 'You ask about the first two.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}neutral.webp`,
    jp: '一本目は焼けた。二本目も焼けた。五十年ほど空いての。',
    zh: '第一棵烧掉了。第二棵也烧掉了。中间隔了五十年左右。',
    en: 'The first burned. The second burned as well. Fifty years or so between them.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '你在心里算。她说的是 1945 年，和 1995 年。两个年份她都没有说出口。',
    en: 'You do the arithmetic. She means 1945, and 1995. She names neither year.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}neutral.webp`,
    jp: '二度とも、次の春には人が来て、また植えおった。',
    zh: '两次，第二年春天都有人来，又种上了。',
    en: 'Both times, come the spring, people turned up and planted it again.',
    color: 'bg-amber-500'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}happy.webp`,
    jp: 'あれが、わらわの見てきた中でいちばん面白い。',
    zh: '那件事，是我看过的所有事里最有意思的。',
    en: 'That is the most interesting thing I have ever watched happen.',
    color: 'bg-amber-500'
  },

  // ---- 选择 2：落点 ----
  {
    type: 'choice',
    promptZh: '她说"最有意思"的时候，语气跟她讲天气一样轻。',
    promptEn: 'She says "the most interesting" in the tone she uses for the weather.',
    options: [
      {
        id: 'inari1_scale',
        labelZh: '「你说的『最近』『上次』，都不是我们的单位吧。」',
        labelEn: '"Your \'recently\' and \'last time\' are not our units, are they."',
        jp: '「最近」も「この前」も、こっちの単位とちゃうやろ。',
        words: [{ jp: '単位', reading: 'たんい', zh: '单位', en: 'unit (of measure)' }],
        hintZh: '她刚才用「五十年ほど」形容"隔了一会儿"',
        hintEn: 'She just used "about fifty years" to mean "after a bit".',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你算出了她那把尺子的刻度', reasonEn: 'You worked out the graduations on her ruler' }],
        relations: [{ char: CharacterId.INARI, familiarity: 8, affection: 10, reasonZh: '有人终于问对了问题', reasonEn: 'Somebody finally asked the right question' }],
        setFlags: ['inari_story_scale'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}surprised.webp`,
            zh: '她安静了一会儿。林子里安静下来的时候，是真的一点声音都没有。',
            en: 'She goes quiet. When this wood goes quiet there is genuinely no sound in it at all.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}neutral.webp`,
            jp: '……そうじゃな。わらわの「ちょっと」は、そなたの一生より長いこともある。',
            zh: '……是啊。我的「一会儿」，有时候比你的一生还长。',
            en: '...That is so. My "a moment" is sometimes longer than your whole life.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她说这句话的时候依旧是那副漫不经心的调调。轻巧到话音落地片刻后，丝丝凉意才后知后觉地爬上脊梁骨。',
            en: 'She speaks in that same nonchalant register. So light that it takes moments after the words settle for a chill to crawl up your spine.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}smug.webp`,
            jp: 'じゃがの。だからこそ、こういう一日は数える。',
            zh: '不过呢。正因为这样，这样的一天我是数的。',
            en: 'Even so. That is exactly why a day like this one gets counted.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '你问她数到多少了。她笑了一下，没有回答。',
            en: 'You ask what the count is up to. She smiles, and does not answer.'
          }
        ]
      },
      {
        id: 'inari1_boring',
        labelZh: '「一千年会无聊吗。」',
        labelEn: '"Does a thousand years get boring."',
        jp: '千年って、退屈せえへんの。',
        hintZh: '这个问题她大概被问过很多次',
        hintEn: 'She has probably been asked this a lot.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你直接问了年龄有关的事', reasonEn: 'You asked about her age, directly' }],
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 5, reasonZh: '她喜欢有人问，即使问得很笨', reasonEn: 'She likes being asked, even clumsily' }],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}smug.webp`,
            jp: '退屈じゃよ。だから暇つぶしを探す。',
            words: [{ jp: '暇つぶし', reading: 'ひまつぶし', zh: '消磨时间的事', en: 'something to pass the time' }],
            zh: '无聊啊。所以要找点事情打发。',
            en: 'Terribly. Which is why one looks for something to pass the time.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她说完侧过头，似笑非笑地凝视着你，目光深邃得仿佛能穿透千百年的岁月。待她悠悠转回头望向那棵古树时，毛茸茸的尾巴轻轻扫过了地上的沙沙枯叶。',
            en: 'She turns her head with an enigmatic half-smile, her eyes deep enough to peer through centuries. As she turns back to the ancient tree, her fluffy tail sweeps softly through the dry leaves.'
          },
          {
            type: 'narration',
            zh: '你很久之后再次回想起这片刻的凝视，才隐约参透了那双眼睛里倒映着的究竟是什么。',
            en: 'Only long afterwards, when you recall that brief gaze, do you faintly understand what those eyes were reflecting.'
          }
        ]
      },
      {
        id: 'inari1_fourth',
        labelZh: '「那第四棵，谁来种。」',
        labelEn: '"So who plants the fourth one."',
        jp: '四本目は、誰が植えるん。',
        hintZh: '她讲的是两次重种。她没讲第三次',
        hintEn: 'She told you about two replantings. She did not mention a third.',
        requires: { stat: 'knowledge', min: 6 },
        effects: [
          { stat: 'knowledge', amount: 2, reasonZh: '你听出了她那句话是往前看的', reasonEn: 'You heard that her sentence was facing forward' }
        ],
        relations: [{ char: CharacterId.INARI, familiarity: 4, affection: 13, reasonZh: '她被问了一个关于未来的问题', reasonEn: 'She was asked a question about the future' }],
        setFlags: ['inari_story_fourth_tree'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}surprised.webp`,
            zh: '她的脚停了。她刚才一直在很轻地晃着脚。',
            en: 'Her feet stop. She had been swinging them, very slightly.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}neutral.webp`,
            jp: '……そなた、そういうことを聞くのか。',
            zh: '……你居然会问这种事。',
            en: '...You would ask that.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她的语气第一次不轻了。',
            en: 'For the first time the tone is not light.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}sad.webp`,
            jp: 'わらわは植えられぬ。見ておることしかできぬ。',
            zh: '我种不了。我只能看着。',
            en: 'I cannot plant. All I can do is watch.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '一千年来，每一次都是别人来种。她一次都没有伸过手。',
            en: 'For a thousand years, somebody else has always done the planting. She has never once put a hand to it.'
          },
          {
            type: 'narration',
            zh: '你说：那我来种。种完了你看着就行。',
            en: 'You say: then you will plant it. She can watch.'
          },
          {
            type: 'narration',
            characterImage: `${I}surprised.webp`,
            zh: '她很久很久没有说话。久到你以为自己说错了什么。',
            en: 'She says nothing for a very long time. Long enough that you think you have said something wrong.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}shy.webp`,
            jp: '……覚えておくぞ。わらわは、忘れぬからの。',
            zh: '……我记住了哦。我这个人，是不会忘的。',
            en: '...I shall remember that. I do not forget things.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '这句话听上去像在开玩笑。它一点都不是。',
            en: 'It sounds like a joke. It is not one at all.'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '你要走的时候她还坐在那儿，没有要动的意思。',
    en: 'When you get up to go she is still sitting there, with no sign of moving.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}happy.webp`,
    jp: 'また来るとよい。……まあ、来ずともよいがの。',
    zh: '再来吧。……嘛，不来也没关系。',
    en: 'Do come again. ...Though it hardly matters if you do not.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '「不来也没关系」这句话，她说了两遍。第二遍是对着那棵树说的，声音很小。',
    en: 'She says the part about it hardly mattering twice. The second time is to the tree, very quietly.'
  },
  {
    type: 'narration',
    zh: '你走出林子，回头看了一眼。她还在石头上。你的外套还铺在那儿。',
    en: 'You come out of the wood and look back. She is still on the rock. Your blazer is still spread under her.'
  },
  {
    type: 'narration',
    zh: '第二天早上你在自己的鞋柜里找到了它。叠得非常整齐，上面放着一片叶子。',
    en: 'The next morning you find it in your shoe locker. Folded very neatly, with a single leaf laid on top.'
  },
  {
    type: 'effect',
    setFlags: ['inari_story_1_done'],
    effects: [
      { stat: 'knowledge', amount: 3, reasonZh: '一棵树，三代，两个没有说出口的年份', reasonEn: 'One tree, three generations, two years that went unnamed' },
      { stat: 'guts', amount: 1, reasonZh: '你在一片天黑的林子里坐了两个小时', reasonEn: 'You sat in a dark wood for two hours' }
    ],
    relations: [
      { char: CharacterId.INARI, familiarity: 10, affection: 7, reasonZh: '她没有再费劲遮住自己不是人这件事', reasonEn: 'She stopped bothering to hide that she is not a person' }
    ]
  }
];
