import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 光 · 第①段「同じ船」
//
// 触发：親密度 Lv.3「朋友」(90)
// 场景：黄昏的港边
//
// 她的设定是"全肯定型"——对谁都说"没问题的！"。
// 第①段要露的那一面是：这个"没问题"是她自己练出来的，
// 而且练的时候没有人在旁边说"没问题"。
//
// 【比你早一周】
// 她也是留学生，只比你早来一周。序章如果在海边遇到过她，
// 那根栏杆就是她当时站的地方——这一段回到同一根栏杆，
// 由 branch 分成"回来"和"第一次来"两种写法。
//
// 【不能让她哭】
// 她哭出来就变成了一个需要被安慰的角色，那是她最不想变成的东西。
// 所以这一段她全程在笑，只是有一句话说到一半停住了，
// 然后换了个说法继续笑。露出来的就那一秒。
// ---------------------------------------------------------

const H = '/images/characters/hikari/';

export const HIKARI_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'kobe_harbor',
    bgm: 'town',
    titleZh: '同じ船',
    titleEn: 'The Same Boat',
    subtitleZh: '黄昏 · 港边',
    subtitleEn: 'Dusk · The harbour'
  },
  {
    type: 'narration',
    zh: '「放学后有空吗！」她问这句话的时候已经拽着你的袖子往校门走了。所以那不算一个问题。',
    en: '"Are you free after school!" She is already pulling you towards the gate by the sleeve as she asks, which makes it not a question.'
  },
  {
    type: 'narration',
    characterImage: `${H}happy.webp`,
    zh: '电车坐了两站。她一路都在讲今天数学课上老师把粉笔掰断了三次。',
    en: 'Two stops on the train. The whole way she is telling you about the maths teacher snapping the chalk three separate times.'
  },
  {
    type: 'narration',
    zh: '出了站往南走，风里开始有海的味道。她忽然不说话了，走快了半步，走到你前面。',
    en: 'South out of the station, the wind starts tasting of the sea. She stops talking, picks up half a pace, and gets ahead of you.'
  },

  // 序章走过海边的人：回到同一根栏杆
  {
    type: 'branch',
    ifFlag: 'prologue_walk_harbor',
    then: [
      {
        type: 'narration',
        zh: '你认得这个地方。你到神户的第一个晚上就站在这儿，扶着这根栏杆。',
        en: 'You know this place. You stood here on your first night in Kobe, holding this rail.'
      },
      {
        type: 'narration',
        characterImage: `${H}happy.webp`,
        zh: '她拍了拍栏杆，回过头。「记得吧？就是这儿。」',
        en: 'She pats the rail and turns round. "You remember. Right here."'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_walk_harbor',
    not: true,
    then: [
      {
        type: 'narration',
        zh: '海突然就在那儿了。港塔的红色在暮色里刚刚开始亮起来。',
        en: 'The sea is simply there. The red of the port tower is only now starting to come up against the dusk.'
      },
      {
        type: 'narration',
        characterImage: `${H}happy.webp`,
        zh: '她扶着栏杆回过头。「你还没来过这儿吧。我就知道。」',
        en: 'She takes hold of the rail and turns round. "You have not been here yet. I knew it."'
      }
    ]
  },

  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}happy.webp`,
    jp: 'あたしね、来た週、毎日ここ来てたんだ。',
    words: [{ jp: '毎日', reading: 'まいにち', zh: '每天', en: 'every day' }],
    zh: '我啊，刚来那一周，每天都来这儿。',
    en: 'Me, the week I got here, I came down here every single day.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '每天。一周七天。你在心里数了一下。',
    en: 'Every day. Seven of them. You do the sum without meaning to.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}neutral.webp`,
    jp: 'あっち。あの方向がね、うちの方角なんだって。地図で調べた。',
    zh: '那边。听说那个方向是我家的方向。我查过地图。',
    en: 'That way. That direction is home, apparently. I looked it up on a map.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '她指的方向什么都没有，只有海和更远的海。',
    en: 'There is nothing at all in the direction she is pointing. Sea, and then more sea.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她还举着手指着那个方向，指了有点久。',
    promptEn: 'She is still holding her arm out, pointing, a little longer than necessary.',
    options: [
      {
        id: 'hikari1_lonely',
        labelZh: '「那一周，很难熬吧。」',
        labelEn: '"That week must have been rough."',
        jp: 'その一週間、しんどかっただろ。',
        words: [{ jp: 'しんどい', reading: 'しんどい', zh: '累、难熬', en: 'tough / exhausting' }],
        hintZh: '你现在正在过你的那一周',
        hintEn: 'You are in the middle of your own week right now.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你听出了她说「每天」时省掉的那部分', reasonEn: 'You heard the part she left out of "every day"' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 6, affection: 8, reasonZh: '没有人问过她那一周', reasonEn: 'Nobody has ever asked her about that week' }],
        setFlags: ['hikari_story_asked_week'],
        then: [
          {
            type: 'narration',
            characterImage: `${H}surprised.webp`,
            zh: '她的手停在半空。',
            en: 'Her arm stops in mid-air.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}happy.webp`,
            jp: 'ううん、全然！　あたし切り替え早いから！',
            zh: '没有啦，完全不会！我这个人转换得可快了！',
            en: 'Nope, not at all! I bounce back really fast, me!',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '她笑得跟平常一模一样。你也就笑了一下。',
            en: 'The smile is exactly the one she always has. You smile back.'
          },
          {
            type: 'narration',
            zh: '她把手放下来插进口袋。再开口的时候语速慢了下来，慢得像在挑词。',
            en: 'She puts her hands down and into her pockets. When she starts again she is slower, slow enough to look like she is choosing the words.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}neutral.webp`,
            jp: '……七日目に、来なくてよくなったんだ。',
            zh: '……第七天的时候，就不用来了。',
            en: '...On the seventh day I did not need to come any more.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '她说的是「不用来了」，不是「不想来了」。',
            en: 'She says she did not need to. Not that she did not want to.'
          }
        ]
      },
      {
        id: 'hikari1_same',
        labelZh: '走过去，站在她旁边，也往那边看',
        labelEn: 'Go and stand beside her, and look the same way',
        hintZh: '你家的方向大概也在那边',
        hintEn: 'Your home is probably somewhere out that way too.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有把它变成一场谈话', reasonEn: 'You did not turn it into a conversation' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 8, affection: 5, reasonZh: '两个人一起看着同一片什么都没有的海', reasonEn: 'Two people looking at the same nothing' }],
        then: [
          {
            type: 'narration',
            zh: '你们并排站了一会儿。风从海上来，是凉的。',
            en: 'You stand side by side for a while. The wind off the water is cold.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}neutral.webp`,
            jp: '……何も見えないでしょ。',
            zh: '……什么都看不见吧。',
            en: '...You cannot see anything, right.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你说看不见。',
            en: 'You say no.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}happy.webp`,
            jp: 'でしょ。あたしも一週間かけて確かめた。',
            zh: '对吧。我也花了一周确认这件事。',
            en: 'Right? Took me a week to confirm that.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '她说这句话的时候还在笑。你听懂了那是一个很难笑的笑话。',
            en: 'She is still smiling when she says it. You understand that it is a joke that is not funny.'
          }
        ]
      },
      {
        id: 'hikari1_joke',
        labelZh: '「那我的方向呢，能帮我查一下吗。」',
        labelEn: '"Could you look up which way mine is, then?"',
        jp: 'じゃあ、俺のほうも調べてくれよ。',
        hintZh: '把这件事变成两个人的事',
        hintEn: 'Make it a thing the two of you do.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你把一件她自己扛的事分了一半过来', reasonEn: 'You took half of something she had been carrying alone' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 7, affection: 7, reasonZh: '她第一次不是那个负责打气的人', reasonEn: 'For once she was not the one doing the cheering' }],
        then: [
          {
            type: 'narration',
            characterImage: `${H}surprised.webp`,
            zh: '她愣了一下，然后掏出手机，很认真地开始查。',
            en: 'She blinks, gets her phone out, and starts looking it up in earnest.'
          },
          {
            type: 'narration',
            zh: '手指在屏幕上飞快滑动查找了一阵，她一把将手机屏幕转向你，另一只手早就迫不及待地指向远方海平面。',
            en: 'After quickly searching on her phone, she turns the screen toward you, her other hand pointing eager and straight at the sea horizon.'
          },
          {
            type: 'narration',
            zh: '虽说跟她刚才随手胡乱指的方向偏了老大一截。',
            en: 'Never mind that it is noticeably off from the random direction she pointed earlier.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${H}happy.webp`,
            jp: 'ほら。近いじゃん。',
            zh: '你看。挺近的嘛。',
            en: 'See? That is basically next door.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '隔着一整片海和遥遥两千公里。她却笑盈盈地说挺近的。',
            en: 'Across an entire sea and two thousand long kilometres. Yet she smiles and says it is practically next door.'
          }
        ]
      }
    ]
  },

  // ---- 中段：她的那句"没问题" ----
  {
    type: 'narration',
    zh: '天完全黑下来了。港塔的灯变成一层一层往上跑的红色。',
    en: 'It has gone fully dark. The tower lights start running upward, ring by ring, in red.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}neutral.webp`,
    jp: 'ねえ、{name}。あたし、うるさい？',
    zh: '喂，{name}。我是不是很吵？',
    en: 'Hey, {name}. Am I too loud?',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '这个问题来得没头没尾。你说不吵。',
    en: 'The question comes out of nowhere. You say no.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}shy.webp`,
    jp: 'よかった。一年生の時、言われたことあるからさ。',
    zh: '那就好。一年级的时候被人说过。',
    en: 'Good. Someone said it to me in first year.',
    color: 'bg-sky-500'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}neutral.webp`,
    jp: '「元気なのは分かったから、ちょっと静かにして」って。',
    words: [{ jp: '元気', reading: 'げんき', zh: '有精神、有活力', en: 'energetic / lively' }],
    zh: '说「知道你很有精神了，安静一点吧」。',
    en: '"We get that you are cheerful. Could you keep it down."',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '她学那个人的语气学得很像，像到你知道她在心里重放过很多遍。',
    en: 'The impression is very good. Good enough that you know she has replayed it a lot of times.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}happy.webp`,
    jp: 'でもさ、静かにしてたら、誰も来ないんだよ。',
    zh: '可是啊，安静下来的话，就没有人来了。',
    en: 'But here is the thing. If you keep it down, nobody comes.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '这句话之后她没有再补一句"开玩笑的啦"。这是今天她第一次没有补。',
    en: 'She does not follow that with "just kidding". It is the first time today she has not.'
  },

  // ---- 收 ----
  {
    type: 'narration',
    characterImage: `${H}happy.webp`,
    zh: '回程的电车上人很挤。她站着睡着了一小会儿，头往你这边偏了一点，又自己弹回去了。',
    en: 'The train back is packed. She falls asleep standing up for a moment, head tipping your way, then snapping back on its own.'
  },
  {
    type: 'narration',
    zh: '醒过来第一句话是「あたし寝てない！」。你说是是是。',
    en: 'The first thing she says on waking is that she was not asleep. You say of course, of course.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${H}happy.webp`,
    jp: 'また来ようね。あそこ、一人だと結構でかいんだ。',
    words: [{ jp: '一人', reading: 'ひとり', zh: '一个人', en: 'alone' }],
    zh: '下次再来吧。那个地方，一个人的时候还挺大的。',
    en: 'Let us come again. That place is pretty big when you are on your own.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '你说好。她马上就笑开了，然后开始讲明天体育课要跑八百米的事。',
    en: 'You say yes. The smile comes straight back and she starts on tomorrow being eight hundred metres in PE.'
  },
  {
    type: 'narration',
    zh: '你想了一路：她那一周的第七天，是真的不用来了，还是学会了不用来。',
    en: 'You think about it the whole way back: on the seventh day of her week, did she really not need to come, or had she learned not to.'
  },
  {
    type: 'effect',
    setFlags: ['hikari_story_1_done'],
    effects: [
      { stat: 'kindness', amount: 2, reasonZh: '你开始听得出别人话里省掉的那半句', reasonEn: 'You are learning to hear the half people leave out' },
      { stat: 'knowledge', amount: 1, reasonZh: '你现在知道港塔的灯是一层一层往上跑的', reasonEn: 'You now know the tower lights run upward, ring by ring' }
    ],
    relations: [
      { char: CharacterId.HIKARI, familiarity: 10, affection: 6, reasonZh: '她带你去的是她自己的地方，不是好玩的地方', reasonEn: 'She took you to a place of her own, not a place worth seeing' }
    ]
  }
];
