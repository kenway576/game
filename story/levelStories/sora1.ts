import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 空 · 第①段「交換条件」
//
// 触发：親密度 Lv.3「朋友」(90)
// 场景：放学后的体育馆
//
// 接第一天体育馆那场：她提了一个交换——她教你运动，你教她英语。
// 这一段是那个交换第一次真的执行。
//
// 【第①段要露的那一面】
// 空的表层是"什么都无所谓、笑着就过去了"的体育会系。
// 底下是一个把"我只有这个"当成事实接受了的人：
// 她考试不行，而且不觉得那是可以改的。
// 所以真正的转折不是她学会了一个单词，是她第一次说出
// 「できるようになるかも」——她第一次允许自己对某件事抱期待。
//
// 【肩膀那件事在这一段只出现一次，一句话，不解释】
// 她投篮的时候换了个动作。玩家可能注意到，可能没注意到。
// 这是第②段的引信，这里不点。
// ---------------------------------------------------------

const S = '/images/characters/sora/';

export const SORA_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'gym',
    bgm: 'town',
    titleZh: '交換条件',
    titleEn: 'The Trade',
    subtitleZh: '放学后 · 体育馆',
    subtitleEn: 'After school · The gym'
  },
  {
    type: 'narration',
    zh: '四点零五分。体育馆的门开着，里面只有一个人的球声。',
    en: 'Five past four. The gym doors are open and there is one person’s worth of bouncing inside.'
  },
  {
    type: 'narration',
    characterImage: `${S}neutral.webp`,
    zh: '她看见你，把球夹在腰上，另一只手从包里掏出一本英语单词书，往你那边一扔。',
    en: 'She sees you, tucks the ball against her hip, digs an English vocabulary book out of her bag, and lobs it at you.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}happy.webp`,
    jp: '来た。ほな、先に勉強な。三十分だけ。',
    words: [{ jp: '勉強', reading: 'べんきょう', zh: '学习', en: 'study' }],
    zh: '来了。那先学习。就三十分钟。',
    en: 'You came. Right, studying first. Thirty minutes only.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你翻开那本书。第一页就有折痕，第二页也有。翻到第十一页，折痕没有了。',
    en: 'You open the book. Page one is dog-eared. So is page two. At page eleven the dog-ears stop.'
  },
  {
    type: 'narration',
    zh: '往后全是新的。她在第十一页停下来过，不止一次。',
    en: 'Everything after that is pristine. She has stopped at page eleven, and not just once.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}shy.webp`,
    jp: 'そこ見んといて。',
    zh: '别看那儿。',
    en: 'Do not look at that bit.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你把书合上，然后又打开，直接翻到第十一页。',
    en: 'You close the book. Then open it again, straight to page eleven.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '第十一页是不规则动词变化表。整整一页，密密麻麻。',
    promptEn: 'Page eleven is the irregular verbs. A full page of them, packed tight.',
    options: [
      {
        id: 'sora1_start_here',
        labelZh: '「那就从这儿开始。」',
        labelEn: '"Then we start here."',
        jp: 'じゃあ、ここからやろう。',
        hintZh: '她卡在这儿，说明这儿是要过的地方',
        hintEn: 'She is stuck here, which means here is the thing to get past.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你没有替她跳过难的那一页', reasonEn: 'You did not let her skip the hard page' }],
        relations: [{ char: CharacterId.SORA, familiarity: 6, affection: 6, reasonZh: '之前教她的人都从第一页重新开始', reasonEn: 'Everyone who taught her before started again from page one' }],
        setFlags: ['sora_story_page_eleven'],
        then: [
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}shock.webp`,
            jp: 'えっ。……一ページ目からちゃうん？',
            zh: '诶。……不是从第一页开始吗？',
            en: 'Huh. ...Not from page one?',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '你说前十页她已经会了，折痕是证据。她愣了一下，然后坐下来了。',
            en: 'You say she already knows the first ten; the dog-ears are the proof. She blinks, and then she sits down.'
          }
        ]
      },
      {
        id: 'sora1_gomi',
        labelZh: '「这页设计得很烂。谁编的书。」',
        labelEn: '"This page is badly made. Who wrote this book."',
        jp: 'このページ、作りが下手やわ。誰が書いたんこれ。',
        hintZh: '先把问题从她身上挪开',
        hintEn: 'Move the problem off her first.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你把她卡住的地方说成了书的问题', reasonEn: 'You made her stuck page the book’s fault' }],
        relations: [{ char: CharacterId.SORA, familiarity: 8, affection: 4, reasonZh: '她笑了，肩膀松了下来', reasonEn: 'She laughed, and her shoulders came down' }],
        then: [
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}happy.webp`,
            jp: 'せやろ！　ウチもずっとそう思っててん！',
            zh: '就是吧！我一直也这么觉得！',
            en: 'Right?! I have been saying that this whole time!',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她说得太快了，快得像终于有人替她说了这句话。',
            en: 'It comes out very fast, like something she has been waiting for somebody else to say.'
          },
          {
            type: 'narration',
            zh: '「一直」——一直是多久？你没有问。',
            en: '"This whole time." How long is that? You do not ask.'
          }
        ]
      },
      {
        id: 'sora1_close_book',
        labelZh: '把书合上：「先打球。学习待会儿说。」',
        labelEn: 'Close the book. "Ball first. Study later."',
        hintZh: '她已经在椅子上坐立不安了十分钟',
        hintEn: 'She has been fidgeting on that chair for ten minutes.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你看出来她根本坐不住', reasonEn: 'You could see she was never going to sit still' }],
        relations: [{ char: CharacterId.SORA, familiarity: 9, affection: 2, reasonZh: '她整个人亮了一下', reasonEn: 'The whole of her lit up' }],
        then: [
          {
            type: 'narration',
            characterImage: `${S}happy.webp`,
            zh: '她跳起来的速度快得撞翻了椅子。',
            en: 'She gets up fast enough to knock the chair over.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}happy.webp`,
            jp: 'それでこそや！　……いや、待って、それやったら交換になってへん。',
            zh: '这才对嘛！……不对，等等，这样就不算交换了。',
            en: 'Now you are talking! ...No, wait, that stops it being a trade.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她自己把歪倒的椅子扶正重新坐好。你识趣地没有拆穿，她居然真就耐着性子埋头苦读了好一会儿。',
            en: 'She rights the tipped chair and sits down again. You wisely say nothing, and she surprisingly buckles down to study for quite some time.'
          }
        ]
      }
    ]
  },

  // ---- 交换的另一半 ----
  {
    type: 'narration',
    zh: '约好的时间一到，她啪地一声把单词书一甩，猛地跳起来时整个人眼里都有了光，方才的蔫头耷脑瞬间一扫而空。',
    en: 'The second the timer finishes, she snaps the vocab book shut and tosses it aside, bouncing up with fire in her eyes, all drowsiness instantly evaporated.'
  },
  {
    type: 'narration',
    characterImage: `${S}neutral.webp`,
    zh: '「投篮。手肘在下面，手腕最后弹一下。」她示范了一次，球进了。',
    en: '"Shooting. Elbow under it, flick at the wrist last." She demonstrates once. It goes in.'
  },
  {
    type: 'narration',
    zh: '第二次示范的时候，她换了个动作——右手压得比第一次低，出手快了半拍。',
    en: 'The second demonstration is different. Her right arm stays lower than the first time and the release comes half a beat early.'
  },
  {
    type: 'narration',
    zh: '球也进了。她没有提这件事。',
    en: 'That one goes in too. She does not mention it.'
  },
  {
    type: 'narration',
    zh: '接下来一个小时，你投了大概两百个球。进了多少你没数，但最后半小时她不用再喊「手肘」了。',
    en: 'For the next hour you take maybe two hundred shots. You do not count how many go in, but by the last half hour she has stopped shouting "elbow".'
  },

  // ---- 选择 2：落点 ----
  {
    type: 'choice',
    promptZh: '坐在地板上喝水的时候，她忽然把单词书又翻开了，翻到第十二页。',
    promptEn: 'Sitting on the floor with a drink, she picks the vocabulary book up again and turns to page twelve.',
    options: [
      {
        id: 'sora1_can_do',
        labelZh: '「第十二页。你今天已经过了第十一页了。」',
        labelEn: '"Page twelve. You cleared page eleven today."',
        jp: '十二ページ目。今日、十一ページ越えたやん。',
        words: [{ jp: '越える', reading: 'こえる', zh: '越过、跨过', en: 'to get past' }],
        hintZh: '这是她三年来第一次翻过那一页',
        hintEn: 'It is the first time in three years she has got past that page.',
        effects: [
          { stat: 'kindness', amount: 2, reasonZh: '你把一件小事说成了它本来的分量', reasonEn: 'You gave a small thing the weight it actually had' }
        ],
        relations: [{ char: CharacterId.SORA, familiarity: 6, affection: 14, reasonZh: '她第一次觉得这件事有可能', reasonEn: 'For the first time she thought this might be possible' }],
        setFlags: ['sora_story_past_eleven'],
        then: [
          {
            type: 'narration',
            characterImage: `${S}shock.webp`,
            zh: '她低头看那一页，看了很久。',
            en: 'She looks down at the page for a long time.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}neutral.webp`,
            jp: '……三年、ここで止まっててん。',
            zh: '……三年，一直卡在这儿。',
            en: '...Three years I have been stuck on this.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '三年。你想起她说过赤点两次。两次不是三年。她没算的那一次，大概是她自己都不想算的那一次。',
            en: 'Three years. You remember her saying she had failed it twice. Twice is not three years. The one she did not count is presumably the one she would rather not.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}shy.webp`,
            jp: '……ウチでも、できるようになるかもしれへんな。',
            words: [{ jp: 'かもしれない', reading: 'かもしれない', zh: '也许、说不定', en: 'might / perhaps' }],
            zh: '……说不定，连我也能学会呢。',
            en: '...Maybe even I could get there.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她说的是「说不定」。对一个从来只说「无所谓」的人来说，这是一个非常大的词。',
            en: 'She says maybe. From someone who only ever says it does not matter, that is an enormous word.'
          }
        ]
      },
      {
        id: 'sora1_next_week',
        labelZh: '「下周同一时间。带那本书来。」',
        labelEn: '"Same time next week. Bring the book."',
        jp: '来週も同じ時間な。その本、持ってきて。',
        hintZh: '把它变成一件会重复发生的事',
        hintEn: 'Make it a thing that recurs.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你替两个人都排了下周的时间', reasonEn: 'You put next week in the diary for both of you' }],
        relations: [{ char: CharacterId.SORA, familiarity: 12, affection: 6, reasonZh: '交换变成了一个固定的东西', reasonEn: 'The trade became a standing arrangement' }],
        then: [
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}happy.webp`,
            jp: 'ええで。……あんた、しつこいって言われへん？',
            zh: '可以啊。……你没被人说过很烦吗？',
            en: 'Sure. ...Does nobody tell you that you are persistent?',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她一边说一边把那本单词书塞进包里，塞的是最外面那个方便拿的口袋。',
            en: 'As she says it she puts the vocabulary book in her bag, into the outside pocket, the easy one to reach.'
          }
        ]
      },
      {
        id: 'sora1_shoulder',
        labelZh: '「你刚才第二次投篮，动作换了。」',
        labelEn: '"Your second shot. The motion was different."',
        jp: 'さっきの二本目、フォーム変わってたやろ。',
        hintZh: '你不确定该不该问。你还是问了',
        hintEn: 'You are not sure you should ask. You ask.',
        requires: { stat: 'proficiency', min: 5 },
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '两百个球看下来，你看出了一件她没说的事', reasonEn: 'Two hundred shots in, you saw something she had not said' }],
        relations: [{ char: CharacterId.SORA, familiarity: 4, affection: 9, reasonZh: '除了教练，没有人看出来过', reasonEn: 'Nobody but her coach has ever spotted it' }],
        setFlags: ['sora_story_saw_shoulder'],
        then: [
          {
            type: 'narration',
            characterImage: `${S}shock.webp`,
            zh: '她转过头来看你，笑还挂在脸上，但眼睛不一样了。',
            en: 'She turns to look at you. The grin is still there. The eyes are not the same.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}neutral.webp`,
            jp: '……よう見てんな。',
            zh: '……看得挺仔细啊。',
            en: '...You watch closely.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她站起来去捡球，背对着你。',
            en: 'She gets up to fetch the ball, with her back to you.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${S}neutral.webp`,
            jp: 'その話は、また今度な。',
            zh: '那件事，改天再说。',
            en: 'That one is for another day.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '「改天」不是拒绝。她给了你一个日期，只是没写在纸上。',
            en: 'Another day is not a refusal. She has given you a date; she just has not written it down.'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '关灯的时候她让你去按开关，她自己在门口等。体育馆一黑，只剩窗户那几条橘色。',
    en: 'She sends you to hit the lights and waits at the door. With the gym dark, all that is left are the orange strips at the windows.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}neutral.webp`,
    jp: 'なあ。交換って、ええな。',
    zh: '喂。交换这个事，挺好的。',
    en: 'Hey. Trading. It is good.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你问哪里好。',
    en: 'You ask what is good about it.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${S}shy.webp`,
    jp: '……教えてもらうだけやったら、ウチ、来られへんかったと思う。',
    words: [{ jp: '教える', reading: 'おしえる', zh: '教', en: 'to teach' }],
    zh: '……要是只有你教我，我大概来不了。',
    en: '...If it were only you teaching me, I do not think I could have come.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你终于明白她当初为什么非要凑出一个交换条件，哪怕凑得那么勉强。',
    en: 'You finally understand why she insisted on assembling a trade at all, however badly it fitted together.'
  },
  {
    type: 'narration',
    zh: '她不是在讨价还价。她是在给自己找一个可以出现的理由。',
    en: 'She was not haggling. She was manufacturing a reason to be allowed to show up.'
  },
  {
    type: 'effect',
    setFlags: ['sora_story_1_done'],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '两百个球之后，手肘的位置成了肌肉记忆', reasonEn: 'Two hundred shots in, the elbow is muscle memory' },
      { stat: 'guts', amount: 1, reasonZh: '你在一个空体育馆里投丢了一百多个球，没走', reasonEn: 'You missed well over a hundred shots in an empty gym and stayed' }
    ],
    relations: [
      { char: CharacterId.SORA, familiarity: 10, affection: 6, reasonZh: '她翻过了第十一页', reasonEn: 'She got past page eleven' }
    ]
  }
];
