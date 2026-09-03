import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 深雪 · 第①段「二〇二号室の夕飯」
//
// 触发：親密度 Lv.3「朋友」(90)
// 场景：海风庄 202 室的厨房
//
// 她的表层是"温柔的邻家姐姐"，一个没有需求、只负责给予的角色。
// 第①段要露的是：这个角色是她自己挑的，而且她挑它是有原因的。
//
// 【"做多了"这句话】
// 她每次送东西过来都说"做多了"。这一段让玩家亲眼看见：
// 她的锅、她的碗、她买菜的量，全都是按两个人配的。
// 一个独居的人，长期按两个人的量做饭——这件事本身就是一句话。
//
// 【不许她哭，也不许她解释】
// 她是这个游戏里最会照顾人的角色，所以她也最会岔开话题。
// 玩家问到边上的时候，她会用一句非常温柔的话把问题挡回去。
// 这一段的成功不是"她说了实话"，是"你发现她挡了回来"。
// 那个洞留给第②段。
// ---------------------------------------------------------

const M = '/images/characters/miyuki/';

export const MIYUKI_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'kitchen',
    bgm: 'lobby',
    titleZh: '二〇二号室の夕飯',
    titleEn: 'Dinner in 202',
    subtitleZh: '傍晚 · 海风庄 202 室',
    subtitleEn: 'Evening · Umikaze-so, room 202'
  },
  {
    type: 'narration',
    zh: '门是虚掩着的。你敲的时候它自己开了一条缝，里面飘出味噌和什么烤过的东西的味道。',
    en: 'The door is not quite shut. Your knock nudges it open, and miso and something roasted come out of the gap.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}apron_happy.webp`,
    jp: 'あら、ちょうどよかった。今日もね、作りすぎちゃって。',
    words: [{ jp: '作りすぎる', reading: 'つくりすぎる', zh: '做太多了', en: 'to make too much' }],
    zh: '哎呀，正好。今天也是，做多了。',
    en: 'Oh, perfect timing. I have gone and made too much again.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '这是这个月第七次「做多了」。你数过。',
    en: 'That is the seventh time this month she has made too much. You have been counting.'
  },
  {
    type: 'narration',
    zh: '她把你按在餐桌前，转身回厨房。你第一次进这间屋子，所以第一次看清楚。',
    en: 'She sits you down at the table and goes back to the kitchen. It is the first time you have been in this flat, so it is the first time you see it properly.'
  },
  {
    type: 'narration',
    zh: '锅是两人份的。碗柜里成对的碗，成对的杯子。冰箱上贴着一张购物清单，每一项后面写着数量：豆腐 2、卵 6、味噌 1。',
    en: 'The pot is a two-person pot. The cupboard has bowls in pairs, cups in pairs. There is a shopping list on the fridge with quantities beside every line: tofu 2, eggs 6, miso 1.'
  },
  {
    type: 'narration',
    zh: '这间屋子住了一个人。这些东西是给两个人配的。',
    en: 'One person lives in this flat. Everything in it is set for two.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她端着两个碗过来，坐在你对面。她自己那碗盛得比你的少一半。',
    promptEn: 'She comes over with two bowls and sits opposite. Hers has half as much in it as yours.',
    options: [
      {
        id: 'miyuki1_notice_two',
        labelZh: '「碗都是成对的。」',
        labelEn: '"Everything in here comes in pairs."',
        jp: 'お茶碗、全部二つずつなんですね。',
        hintZh: '你说的是碗。你问的不是碗',
        hintEn: 'You are talking about bowls. You are not asking about bowls.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你注意到了一件她以为没人会注意的事', reasonEn: 'You noticed something she assumed nobody looks at' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 5, affection: 6, reasonZh: '有人看见了这间屋子的形状', reasonEn: 'Someone saw the shape of the flat' }],
        setFlags: ['miyuki_story_saw_pairs'],
        then: [
          {
            type: 'narration',
            characterImage: `${M}neutral.webp`,
            zh: '她的筷子停了非常短的一下。短到如果你在看碗而不是在看她，就会错过。',
            en: 'Her chopsticks pause for a very short moment. Short enough to miss, if you had been looking at the bowls instead of at her.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}happy.webp`,
            jp: 'そうなのよ。ひとつずつだと、割れた時に困るでしょう？',
            zh: '是啊。一个一个买的话，摔了不就麻烦了嘛。',
            en: 'That is right. If you buy them one at a time, what do you do when one breaks?',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '这个理由完全说得通。这个理由也完全没有回答你的问题。',
            en: 'That reason is entirely sound. It also answers nothing you asked.'
          },
          {
            type: 'narration',
            zh: '她笑着给你添了一勺汤，话题就这么过去了。你注意到它是被挡回去的。',
            en: 'She smiles, adds a ladle of soup to your bowl, and the subject is over. You notice that it was deflected.'
          }
        ]
      },
      {
        id: 'miyuki1_eat',
        labelZh: '先好好吃完，说好吃',
        labelEn: 'Eat properly first, and say it is good',
        jp: 'いただきます。……うまい。ほんとに。',
        hintZh: '她做菜的时候一直在看你的表情',
        hintEn: 'She was watching your face the whole time she cooked.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你把一顿饭当成一顿饭好好吃了', reasonEn: 'You treated a meal as a meal' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 8, affection: 8, reasonZh: '她做这些是为了看这一眼', reasonEn: 'This is the moment she cooks for' }],
        then: [
          {
            type: 'narration',
            characterImage: `${M}happy_alt.webp`,
            zh: '她整个人亮了一下，然后马上低头去夹自己碗里的东西，掩饰得不太成功。',
            en: 'Something lights up in her, and she immediately looks down at her own bowl, not very successfully.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}shy.webp`,
            jp: 'ふふ。……お代わり、ある。',
            zh: '呵呵。……还有，可以再添。',
            en: 'Heh. ...There is more, if you want it.',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她说「还有」的时候声音有点抢拍，像是等这句话等了一顿饭那么久。',
            en: 'She says it slightly early, like someone who has been holding that sentence for the length of a meal.'
          }
        ]
      },
      {
        id: 'miyuki1_cook_next',
        labelZh: '「下次我做。你来吃。」',
        labelEn: '"Next time I cook. You come and eat."',
        jp: '次は俺が作ります。食べに来てください。',
        hintZh: '她从来没坐在过被照顾的那一边',
        hintEn: 'She has never once sat on the receiving side.',
        requires: { stat: 'guts', min: 4 },
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你把这张桌子的方向调了个头', reasonEn: 'You turned the table around' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 6, affection: 11, reasonZh: '没有人对她说过这句话', reasonEn: 'Nobody has said that to her' }],
        setFlags: ['miyuki_story_offered_to_cook'],
        then: [
          {
            type: 'narration',
            characterImage: `${M}neutral_alt.webp`,
            zh: '她抬起头，这一次没有马上笑。',
            en: 'She looks up, and for once the smile does not arrive first.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}neutral.webp`,
            jp: '……えっと。私が、食べに行くの？',
            zh: '……那个。是我，去吃？',
            en: '...Um. I would be the one coming to eat?',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她把这个句子重复了一遍，像在确认语法。她的日语是母语。',
            en: 'She repeats the sentence as though checking the grammar. Japanese is her first language.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}shy.webp`,
            jp: 'そう……そういうのも、あるのね。',
            zh: '这样啊……原来还有这种事。',
            en: 'I see... So that is also a thing that happens.',
            color: 'bg-violet-400'
          }
        ]
      }
    ]
  },

  // ---- 洗碗 ----
  {
    type: 'narration',
    zh: '你抢着去洗碗。她拦了一次，第二次没拦住。',
    en: 'You get up to do the washing-up. She stops you once. The second time she does not.'
  },
  {
    type: 'narration',
    characterImage: `${M}cardigan_neutral.webp`,
    zh: '她在旁边擦盘子。水声很大，所以两个人都不用说话，这件事让人很舒服。',
    en: 'She dries beside you. The water is loud enough that neither of you has to talk, which is comfortable.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_neutral.webp`,
    jp: 'ねえ。日本のご飯、飽きない？',
    words: [{ jp: '飽きる', reading: 'あきる', zh: '腻、厌倦', en: 'to get tired of' }],
    zh: '喂。日本的饭，吃不腻吗？',
    en: 'Say. Do you not get tired of Japanese food?',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '你说不腻。她"嗯"了一声，擦盘子的手停了一下。',
    en: 'You say no. She makes a small noise, and the cloth stops for a moment.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_neutral.webp`,
    jp: 'よかった。……作りすぎちゃう癖、なかなか直らなくて。',
    zh: '那就好。……做太多这个毛病，一直改不掉。',
    en: 'Good. ...I cannot seem to get out of the habit of making too much.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '你问她这个习惯是什么时候开始的。',
    en: 'You ask when the habit started.'
  },
  {
    type: 'narration',
    characterImage: `${M}cardigan_neutral.webp`,
    zh: '她把最后一个盘子放进柜子，关上柜门，然后转过身来，笑得跟平常一模一样。',
    en: 'She puts the last plate in the cupboard, closes the door, turns round, and smiles exactly as she always does.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}happy.webp`,
    jp: 'さあ。もう忘れちゃった。',
    zh: '谁知道呢。已经忘了。',
    en: 'Who knows. I have forgotten.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '一个能记得你上上周说过想吃厚蛋烧的人，说她忘了。',
    en: 'A person who remembered that you mentioned wanting tamagoyaki two weeks ago says she has forgotten.'
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '走廊上凉。她送你到门口，手扶着门框。',
    en: 'The corridor is cold. She sees you to the door and holds the frame.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_happy.webp`,
    jp: 'また作りすぎたら、呼ぶわね。',
    zh: '下次再做多了，就叫你。',
    en: 'If I make too much again, I will call you.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '你说好。然后你说：不做多的时候也可以叫。',
    en: 'You say all right. Then you say: she can call on the nights she does not make too much, as well.'
  },
  {
    type: 'narration',
    characterImage: `${M}shy.webp`,
    zh: '她扶着门框的手紧了一下。',
    en: 'The hand on the door frame tightens.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}shy.webp`,
    jp: '……ずるいこと言うのね、{name}くんは。',
    words: [{ jp: 'ずるい', reading: 'ずるい', zh: '狡猾、赖皮', en: 'unfair / sly' }],
    zh: '……{name}你啊，说话很赖皮呢。',
    en: '...You say unfair things, {name}.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '门关上了。你在走廊上站了两秒才走。',
    en: 'The door closes. You stand in the corridor for two seconds before you go.'
  },
  {
    type: 'narration',
    zh: '你想的是那张购物清单。豆腐 2、卵 6、味噌 1。那是很久以前定下来的量，久到她自己都说忘了。',
    en: 'You are thinking about the shopping list. Tofu 2, eggs 6, miso 1. Those quantities were set a long time ago. Long enough that she says she has forgotten.'
  },
  {
    type: 'effect',
    setFlags: ['miyuki_story_1_done'],
    effects: [
      { stat: 'kindness', amount: 2, reasonZh: '你洗了一次碗，抢的', reasonEn: 'You did the washing-up, and you had to fight for it' },
      { stat: 'proficiency', amount: 1, reasonZh: '你听出了一句温柔的话是怎么把问题挡回去的', reasonEn: 'You heard how a kind sentence turns a question aside' }
    ],
    relations: [
      { char: CharacterId.MIYUKI, familiarity: 10, affection: 7, reasonZh: '你第一次坐在了那张摆着两副碗筷的桌子边', reasonEn: 'You sat at the table that has always been laid for two' }
    ]
  }
];
