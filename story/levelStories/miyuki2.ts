import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 深雪 · 第②段「お姉さんの役」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：海风庄的阳台 · 夜
//
// 【致敬一：ヴァイオレット・エヴァーガーデン】
// 借的核是：**一个人替所有人写信，唯独写不出自己的。**
// 薇尔莉特能精确地读出别人心里的话并替他们说出口，
// 但轮到自己的时候没有任何词可以用——因为她整个人是被当作
// 工具训练出来的，而工具没有"我想要"这一栏。
//
// 深雪的版本：她是这栋楼里所有人的应急联络人。
// 她知道谁对什么过敏、谁哪天出差、谁的伞放在哪儿。
// 她能读出你今天累不累，而且会在你开口之前把汤端出来。
// 但如果你问她今天怎么样，她会答"我很好"，而且那句话是空的。
//
// 【致敬二：CLANNAD 的古河早苗】
// 早苗做没人吃的面包，做了很多年，被当作笑点。
// 但那件事真正的形状是：**给予是她唯一敢用的接近方式**，
// 因为给予不需要对方同意，而"我想跟你在一起"需要。
// 深雪那口两人份的锅就是那炉面包。
//
// 【第②段的墙】
// 不是"她其实很寂寞"。墙是：
// **她把"被需要"当成了留在别人身边的唯一执照。**
// 所以玩家越是照顾她，她越慌——被照顾意味着执照作废。
// 这一段结束时她会说一句非常温柔的、把你推开的话。
// ---------------------------------------------------------

const M = '/images/characters/miyuki/';

export const MIYUKI_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'apartment_balcony',
    bgm: 'night',
    titleZh: 'お姉さんの役',
    titleEn: 'The Part of the Older Sister',
    subtitleZh: '夜 · 海风庄的阳台',
    subtitleEn: 'Night · The balcony at Umikaze-so'
  },
  {
    type: 'narration',
    zh: '你半夜起来倒水，看见走廊尽头的灯亮着。',
    en: 'You get up for a glass of water in the night and see the light on at the end of the corridor.'
  },
  {
    type: 'narration',
    zh: '202 室的门开着一条缝。你本来打算直接回房间。',
    en: 'The door of 202 is ajar. You had been going to go straight back to your room.'
  },
  {
    type: 'narration',
    characterImage: `${M}cardigan_neutral.webp`,
    zh: '她坐在阳台上，没开灯，面前摆着一个碗。碗是空的，凉的。',
    en: 'She is out on the balcony with no light on and a bowl in front of her. The bowl is empty, and cold.'
  },
  {
    type: 'narration',
    zh: '不是吃完的空。是从来没盛过东西的空。',
    en: 'Not the empty of a finished meal. The empty of a bowl that was never filled.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_happy.webp`,
    jp: 'あら。起こしちゃった？',
    zh: '哎呀。把你吵醒了？',
    en: 'Oh dear. Did I wake you?',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '笑容是即时的。她大概是听见你的脚步声就装好了。',
    en: 'The smile is instantaneous. She presumably assembled it at the sound of your footsteps.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '凌晨一点四十。她穿着开衫坐在四月的阳台上，面前一个空碗。',
    promptEn: 'Twenty to two in the morning. She is on an April balcony in a cardigan with an empty bowl in front of her.',
    options: [
      {
        id: 'miyuki2_sit',
        labelZh: '不问，坐下来',
        labelEn: 'Ask nothing. Sit down.',
        hintZh: '她最会应付的就是问题',
        hintEn: 'Questions are the thing she handles best.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有给她一个可以回答的东西', reasonEn: 'You did not give her something answerable' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 5, affection: 12, reasonZh: '她准备好的那套话没有用上', reasonEn: 'The prepared answers went unused' }],
        setFlags: ['miyuki_story_sat_down'],
        then: [
          {
            type: 'narration',
            zh: '你在她旁边坐下，什么都没说。',
            en: 'You sit down beside her and say nothing.'
          },
          {
            type: 'narration',
            characterImage: `${M}cardigan_neutral.webp`,
            zh: '她等了一会儿，等你开口。你没有开口。',
            en: 'She waits for you to speak. You do not.'
          },
          {
            type: 'narration',
            zh: '又过了大概两分钟，她自己说话了——这是你认识她以来第一次。',
            en: 'After about two more minutes she speaks first, which she has never done since you met her.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_sad.webp`,
            jp: '……夜って、長いのよね。',
            zh: '……夜里啊，很长呢。',
            en: '...Nights are long, are they not.',
            color: 'bg-violet-400'
          }
        ]
      },
      {
        id: 'miyuki2_bowl',
        labelZh: '「这个碗是给谁的。」',
        labelEn: '"Who is that bowl for?"',
        jp: 'それ、誰の分ですか。',
        hintZh: '她做饭永远做两人份。这个碗一直没盛东西',
        hintEn: 'She always cooks for two. That bowl has never had anything in it.',
        requires: { stat: 'proficiency', min: 5 },
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你把成对的那件事追到了底', reasonEn: 'You followed the pairs all the way down' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 3, affection: 16, reasonZh: '有人问出了那个问题', reasonEn: 'Somebody asked the question' }],
        setFlags: ['miyuki_story_asked_bowl'],
        then: [
          {
            type: 'narration',
            characterImage: `${M}cardigan_neutral_alt.webp`,
            zh: '笑容没有消失。它只是停止了更新——像一张照片留在她脸上。',
            en: 'The smile does not go. It simply stops updating, and sits on her face like a photograph.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_neutral.webp`,
            jp: '……癖なの。ずっと二人分作ってて',
            zh: '……是习惯。一直都做两人份，',
            en: '...It is a habit. I always make two portions,',
            color: 'bg-violet-400'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_sad.webp`,
            jp: 'それで、片方を先に置くの。置いてから、作るの',
            zh: '然后先把一份摆出来。摆好了，才开始做。',
            en: 'and I put one of them out first. I put it out, and then I cook.',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她先摆碗，再做饭。也就是说，那个碗是为了让厨房里有两个人的位置。',
            en: 'The bowl goes down before the cooking starts. Which is to say the bowl exists so that the kitchen has room in it for two people.'
          }
        ]
      },
      {
        id: 'miyuki2_make_tea',
        labelZh: '进屋去，给她泡一杯茶',
        labelEn: 'Go inside and make her a cup of tea',
        hintZh: '她给你泡过至少三十次',
        hintEn: 'She has made you at least thirty.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你走进了那间厨房', reasonEn: 'You went into that kitchen' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 4, affection: 14, reasonZh: '这栋楼里第一次有人给她端东西', reasonEn: 'For the first time in this building somebody brought her something' }],
        setFlags: ['miyuki_story_made_tea'],
        then: [
          {
            type: 'narration',
            zh: '你在她的厨房里找茶叶。找了很久——每一样东西都在它该在的地方，只是那个"该在"是她的逻辑，不是你的。',
            en: 'You look for the tea in her kitchen. It takes a while: everything is exactly where it should be, but "should" is her logic and not yours.'
          },
          {
            type: 'narration',
            zh: '两个杯子摆在一起。你拿了一个。',
            en: 'The cups are in pairs. You take one.'
          },
          {
            type: 'narration',
            characterImage: `${M}cardigan_sad.webp`,
            zh: '你把茶端出去的时候，她看着那个杯子，看了很久才伸手接。',
            en: 'When you bring it out she looks at the cup for a while before she reaches for it.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_shy.webp`,
            jp: '……変な感じ。',
            zh: '……感觉好奇怪。',
            en: '...This feels strange.',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她说的不是茶。',
            en: 'She is not talking about the tea.'
          }
        ]
      }
    ]
  },

  // ---- 中段：她是谁的应急联络人 ----
  {
    type: 'narration',
    zh: '港口那边有一艘船在动。这个时间还在动的船不多。',
    en: 'Out at the harbour a ship is moving. Not many are, at this hour.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_neutral.webp`,
    jp: 'このアパート、七部屋あるでしょう。',
    zh: '这栋楼有七个房间，对吧。',
    en: 'There are seven flats in this building, are there not.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '你说是。她点点头，然后一个一个数过去。',
    en: 'You say there are. She nods, and goes through them one at a time.'
  },
  {
    type: 'narration',
    zh: '101 的老先生对荞麦过敏。103 的太太周三上夜班。201 就是你。203 那家的小孩怕打雷。',
    en: 'The old man in 101 cannot eat buckwheat. The woman in 103 works Wednesday nights. 201 is you. The child in 203 is afraid of thunder.'
  },
  {
    type: 'narration',
    zh: '她一直数到 302。每一条都对，每一条她都记着。',
    en: 'She gets all the way to 302. Every one is correct, and every one she carries.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_neutral.webp`,
    jp: '緊急連絡先、みんな私になってるの。大家さんじゃなくてね',
    words: [{ jp: '連絡先', reading: 'れんらくさき', zh: '联络方式', en: 'contact details' }],
    zh: '大家的紧急联络人都写的我。不是房东，是我。',
    en: 'Everybody has me down as their emergency contact. Not the landlord. Me.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '你问她自己的紧急联络人写的是谁。',
    en: 'You ask who she has down as hers.'
  },
  {
    type: 'narration',
    characterImage: `${M}cardigan_neutral.webp`,
    zh: '她沉默了。这是今天晚上第一次，她的沉默不是在等你说话。',
    en: 'She is quiet. It is the first time tonight her silence is not waiting for you to speak.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_sad.webp`,
    jp: '……空欄よ。ずっと。',
    words: [{ jp: '空欄', reading: 'くうらん', zh: '空栏、没填', en: 'a blank field' }],
    zh: '……空着。一直都是。',
    en: '...It is blank. It always has been.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '一个所有人都写在表格上的名字，自己那一栏是空的。',
    en: 'A name that appears on everybody’s form, with her own field empty.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '茶凉了。她两只手还捧着杯子。',
    promptEn: 'The tea has gone cold. Her hands are still round the cup.',
    options: [
      {
        id: 'miyuki2_write_me',
        labelZh: '「填我。」',
        labelEn: '"Put me."',
        jp: '俺、書いといてください。',
        hintZh: '不是安慰，是一个具体的、能填进表格的动作',
        hintEn: 'Not comfort. A specific thing that goes in a box on a form.',
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你把自己写进了一张不该有你的表', reasonEn: 'You put yourself on a form you had no business being on' },
          { stat: 'kindness', amount: 1, reasonZh: '你给的是一个动作，不是一句话', reasonEn: 'What you offered was an action, not a sentence' }
        ],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 5, affection: 20, reasonZh: '那一栏有人了', reasonEn: 'That field has somebody in it' }],
        setFlags: ['miyuki_story_emergency_contact'],
        then: [
          {
            type: 'narration',
            characterImage: `${M}cardigan_neutral_alt.webp`,
            zh: '她笑了。这次的笑是真的，但笑得很难看。',
            en: 'She laughs. This one is real, and it is not a good laugh.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_sad.webp`,
            jp: 'だめよ。あなた、来年には帰るかもしれないでしょう',
            zh: '不行的。你明年说不定就回去了。',
            en: 'You cannot. You may go home next year.',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '你说紧急联络人不需要保证一辈子在。只需要现在在。',
            en: 'You say an emergency contact does not have to promise a lifetime. It has to be reachable now.'
          },
          {
            type: 'narration',
            characterImage: `${M}cardigan_shy.webp`,
            zh: '她低下头。你看不见她的表情。过了很久她说了一句话，声音很小。',
            en: 'She lowers her head. You cannot see her face. After a long time she says something, very quietly.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_shy.webp`,
            jp: '……ずるいわ、それ。',
            zh: '……那样很赖皮啊。',
            en: '...That is unfair of you.',
            color: 'bg-violet-400'
          }
        ]
      },
      {
        id: 'miyuki2_who_cooks',
        labelZh: '「你生病的时候，谁给你做饭。」',
        labelEn: '"Who cooks for you when you are ill?"',
        jp: '深雪さんが倒れたら、誰が作るんですか。',
        hintZh: '她照顾了七个房间。第八个房间是她自己',
        hintEn: 'She looks after seven flats. The eighth is her own.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你把那张表反过来看了一遍', reasonEn: 'You read that list the other way round' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 7, affection: 15, reasonZh: '没有人问过她这个', reasonEn: 'Nobody has asked her that' }],
        then: [
          {
            type: 'narration',
            zh: '她非常自然地答了：「私、丈夫だから」。',
            en: 'She answers with total ease: she is a robust person.'
          },
          {
            type: 'narration',
            zh: '你说去年十一月你听见 202 咳了一个星期。',
            en: 'You say that last November you heard 202 coughing for a week.'
          },
          {
            type: 'narration',
            characterImage: `${M}cardigan_neutral.webp`,
            zh: '她愣住了。她没想到那件事有人听见。',
            en: 'She stops. It had not occurred to her that anybody heard.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_sad.webp`,
            jp: '……あの時は、お粥、自分で作ったわ。',
            zh: '……那次的粥，是我自己煮的。',
            en: '...I made the rice porridge myself, that time.',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '一个人发着烧，自己爬起来煮粥，然后一个人吃完。用的大概还是那两个碗里的一个。',
            en: 'Getting up with a fever to make porridge, and eating it alone. Presumably out of one of the pair.'
          }
        ]
      },
      {
        id: 'miyuki2_dont_ask',
        labelZh: '什么都不问，把外套脱下来给她',
        labelEn: 'Ask nothing. Take off your jacket and give it to her.',
        hintZh: '四月的凌晨两点，她只穿了一件开衫',
        hintEn: 'Two in the morning in April, and she is in a cardigan.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你处理的是"她冷"，不是"她的心事"', reasonEn: 'You dealt with her being cold, not with her interior' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 6, affection: 11, reasonZh: '她被照顾了，而且没能拒绝', reasonEn: 'She was looked after, and could not decline' }],
        then: [
          {
            type: 'narration',
            zh: '你把外套披在她肩上。她要脱下来，你按住了。',
            en: 'You put your jacket over her shoulders. She goes to take it off. You hold it there.'
          },
          {
            type: 'narration',
            characterImage: `${M}cardigan_shy.webp`,
            zh: '她的手停在半空，停了三秒，然后放下了。',
            en: 'Her hand stops in mid-air for three seconds, and then comes down.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_shy.webp`,
            jp: '……こういうの、慣れてないの。',
            zh: '……这种事，我不习惯。',
            en: '...I am not used to this sort of thing.',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她把外套的领子往上拉了一点。这个动作她自己没有注意到。',
            en: 'She pulls the collar up a little. She does not notice herself doing it.'
          }
        ]
      }
    ]
  },

  // ---- 收：温柔地把你推开 ----
  {
    type: 'narration',
    zh: '两点二十。港口那艘船已经出了湾。',
    en: 'Twenty past two. The ship is out of the bay.'
  },
  {
    type: 'narration',
    characterImage: `${M}cardigan_neutral.webp`,
    zh: '她站起来收碗。收得很利落，像刚才那半个小时没有发生过。',
    en: 'She gets up to clear the bowl, briskly, as though the last half hour did not take place.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_happy.webp`,
    jp: 'ごめんなさいね、変な話しちゃって。忘れてちょうだい',
    zh: '抱歉啊，讲了些奇怪的话。忘掉吧。',
    en: 'I am sorry, that was an odd thing to talk about. Do forget it.',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '你说不忘。她笑了一下，说了这一晚上最温柔、也最狠的一句话。',
    en: 'You say you will not. She smiles, and says the gentlest and hardest thing of the evening.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_neutral.webp`,
    jp: 'あのね。私はお姉さんでいるのが、いちばん楽なの。',
    words: [{ jp: '楽', reading: 'らく', zh: '轻松、省事', en: 'easy / comfortable' }],
    zh: '那个啊。对我来说，当姐姐是最轻松的。',
    en: 'You see. Being the older sister is the easiest thing for me.',
    color: 'bg-violet-400'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_happy.webp`,
    jp: 'だから、そのままでいさせて。ね？',
    zh: '所以，就让我这样吧。好吗？',
    en: 'So let me stay that way. All right?',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '她说的是"轻松"。不是"喜欢"，不是"应该"。是轻松。',
    en: 'The word she uses is easy. Not that she likes it, or that she ought to. Easy.'
  },
  {
    type: 'narration',
    zh: '一个角色演久了会变成一个可以躲进去的地方。她在里面住了很多年。',
    en: 'A part played long enough becomes somewhere to hide. She has been living in it for years.'
  },
  {
    type: 'narration',
    zh: '门关上了。你在走廊上站着，手里还拿着那个空杯子。',
    en: 'The door closes. You stand in the corridor holding the empty cup.'
  },
  {
    type: 'effect',
    setFlags: ['miyuki_story_2_done', 'miyuki_story_the_role'],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '你听懂了"让我这样吧"是一句拒绝', reasonEn: 'You understood that "let me stay this way" was a refusal' },
      { stat: 'kindness', amount: 1, reasonZh: '你在凌晨两点没有走开', reasonEn: 'At two in the morning you did not walk away' }
    ],
    relations: [
      { char: CharacterId.MIYUKI, familiarity: 8, affection: 14, reasonZh: '她把那一栏是空的这件事说了出来', reasonEn: 'She said out loud that the field is blank' }
    ]
  }
];
