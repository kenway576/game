import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 真希 · 第①段「センパイ認定」
//
// 触发：親密度 Lv.3「朋友」(90)
// 场景：高架下 Piazza 神户（游戏厅）
//
// 她的表层是关西腔雌小鬼：叫你センパイ，语气永远在挑衅，
// 挑衅的内容永远是"你这么弱还敢来"。
//
// 【第①段要露的那一面】
// 那些挑衅是她唯一学会的搭话方式。她不是不想好好说话，
// 是好好说话的时候没有人接。所以她把每一次接触都包装成一场比赛——
// 比赛有规则，规则规定对方必须回应你。
//
// 【怎么让玩家看见，而不是让她说】
// 让她赢。她赢了之后没有走，还在那儿站着等下一局。
// 一个只想赢的人赢完就走了。她要的从来不是那个分数。
//
// 【关西腔】
// 否定用 ～へん，句尾 ～やん / ～やで / ～ねん。
// 她着急或者被戳中的时候会掉回普通话，这是她的破防指示灯。
// ---------------------------------------------------------

const K = '/images/characters/maki/';

export const MAKI_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'pia_kobe_arcade',
    bgm: 'town',
    titleZh: 'センパイ認定',
    titleEn: 'Certified Senpai',
    subtitleZh: '放学后 · 高架下',
    subtitleEn: 'After school · Under the tracks'
  },
  {
    type: 'narration',
    zh: '高架下这一排游戏机厅，头顶上轰鸣驶过的阪急电车总会定时将所有嘈杂盖过去。你已经渐渐习惯在列车呼啸的间隙里跟人说话。',
    en: 'In the arcade under the viaduct, the rumble of the Hankyu line overhead regularly drowns out the noise. You have learned to speak in the gaps between trains.'
  },
  {
    type: 'narration',
    characterImage: `${K}neutral.webp`,
    zh: '她在最里面那台机器前面，粉色的头发在屏幕的光里发紫。她没回头，但你还没走近她就开口了。',
    en: 'She is at the machine at the very back, pink hair going violet in the screen light. She does not turn round, and she speaks before you are close enough for it.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}smug.webp`,
    jp: '遅い。センパイ、五分遅刻やで。',
    words: [{ jp: '遅刻', reading: 'ちこく', zh: '迟到', en: 'being late' }],
    zh: '慢死了。前辈，你迟到五分钟。',
    en: 'Slow. You are five minutes late, senpai.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '——谁跟你约好了啊！你在心里疯狂拍桌，差点脱口而出一句「異議あり！」。但看着她那副得意洋洋的表情，你还是把话咽了回去。',
    en: '—Who even made plans with you?! You slam your mental desk shouting "Hold it!" internally, but seeing her smug grin, you swallow the words.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她把第二枚硬币放在机台边上，推到你这边一点点。',
    promptEn: 'She puts a second coin on the edge of the cabinet and nudges it your way, slightly.',
    options: [
      {
        id: 'maki1_no_appointment',
        labelZh: '「我们没约过啊。」',
        labelEn: '"We never made a plan."',
        jp: '約束してへんやろ。',
        hintZh: '她把你的话原样还回来的可能性是百分之百',
        hintEn: 'The odds of her returning that sentence to you are one hundred percent.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你没有让她轻松过关', reasonEn: 'You did not let her have it for free' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 4, affection: 4, reasonZh: '她喜欢有人接招', reasonEn: 'She likes it when someone returns the serve' }],
        then: [
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}smug.webp`,
            jp: 'は？　毎週水曜、ここやん。常識やろ。',
            zh: '哈？每周三，就是这儿啊。常识吧。',
            en: 'What? Every Wednesday, here. That is just common knowledge.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '你上周三来过。上上周三也来过。你自己都没意识到这已经是第三次了。',
            en: 'You came last Wednesday. And the Wednesday before. You had not registered that this makes three.'
          },
          {
            type: 'narration',
            zh: '她不仅意识到了，甚至连你每次踏进店门的时间都记得一清二楚。',
            en: 'She not only noticed, but remembered the exact time you walked through the doors each day.'
          }
        ]
      },
      {
        id: 'maki1_take_coin',
        labelZh: '什么也不说，把硬币拿起来投进去',
        labelEn: 'Say nothing. Pick the coin up and put it in.',
        hintZh: '她推那枚硬币推了两次',
        hintEn: 'She nudged that coin twice.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你直接坐下了', reasonEn: 'You just sat down' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 7, affection: 3, reasonZh: '她不用把邀请说出口了', reasonEn: 'It saved her having to say the invitation out loud' }],
        then: [
          {
            type: 'narration',
            characterImage: `${K}happy.webp`,
            zh: '硬币落进去的声音很响。她马上就把身子转过来了，转得比她自己想的快。',
            en: 'The coin lands loudly. She turns towards you at once, faster than she meant to.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}happy.webp`,
            jp: 'お、やる気やん。ボロ負けしても泣かんといてや。',
            zh: '哦，有干劲嘛。输惨了别哭啊。',
            en: 'Oh, up for it. Do not cry when you get flattened.',
            color: 'bg-pink-500'
          }
        ]
      },
      {
        id: 'maki1_wait_long',
        labelZh: '「你等了多久。」',
        labelEn: '"How long have you been waiting."',
        jp: 'どんくらい待っててん。',
        hintZh: '她知道你迟了五分钟，说明她在数',
        hintEn: 'She knows you are five minutes late, which means she was counting.',
        requires: { stat: 'proficiency', min: 4 },
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你从一句挑衅里算出了一个时长', reasonEn: 'You extracted a duration out of a taunt' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 3, affection: 8, reasonZh: '她第一次被问住', reasonEn: 'It was the first time she had nothing ready' }],
        setFlags: ['maki_story_asked_waiting'],
        then: [
          {
            type: 'narration',
            characterImage: `${K}angry_alt.webp`,
            zh: '她的脸一下子垮了半边。',
            en: 'Half her face falls off the pose.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}angry_alt.webp`,
            jp: '待ってへんし。たまたま来てただけやし。',
            zh: '我才没等。只是刚好来了而已。',
            en: 'I was not waiting. I just happened to be here.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她说这句硬气话的时候，屏幕上街机单人闯关已经打到了第四关的大BOSS——想单币打到那一关，起码得聚精会神地连续奋战大半个小时。',
            en: 'As she says it, her single-credit run is already on the stage-four boss — reaching that point takes over half an hour of unbroken concentration.'
          },
          {
            type: 'narration',
            zh: '她顺着你的视线看过去，耳尖顿时一红，飞快地按了投降退出。',
            en: 'Following your gaze, her ears flare red and she hurriedly taps forfeit.'
          }
        ]
      }
    ]
  },

  // ---- 比赛 ----
  {
    type: 'narration',
    zh: '规则是她定的：三局两胜，输的人请章鱼烧。她说完补了一句「センパイやからハンデあげるわ」，然后没给。',
    en: 'She sets the rules: best of three, loser buys takoyaki. She adds that she will spot you a handicap because you are her senpai, and then does not.'
  },
  {
    type: 'narration',
    characterImage: `${K}smug.webp`,
    zh: '第一局她赢了。第二局她赢了。差距大到有点难看。',
    en: 'She wins the first. She wins the second. The margins are not close.'
  },
  {
    type: 'narration',
    zh: '她赢完之后没有走。她站在那儿，两只手还搭在操作杆上，看着屏幕上的结算画面。',
    en: 'Having won, she does not leave. She stands there with both hands still on the stick, looking at the results screen.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}neutral_alt.webp`,
    jp: '……三本目、やる？',
    zh: '……第三局，打吗？',
    en: '...Third round. Do you want to?',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '三局两胜。她已经赢了两局。第三局在规则上不存在。',
    en: 'Best of three. She has two. There is no third round in the rules.'
  },

  // ---- 选择 2：落点 ----
  {
    type: 'choice',
    promptZh: '她没有看你，眼睛还在屏幕上。手指在操作杆上敲。',
    promptEn: 'She is not looking at you. Her eyes are on the screen and her fingers are tapping the stick.',
    options: [
      {
        id: 'maki1_no_third',
        labelZh: '「三局两胜，你赢了。不用打了。」',
        labelEn: '"Best of three. You won. There is no third."',
        jp: '三本勝負やろ。もう勝ってるやん。',
        hintZh: '看她怎么办',
        hintEn: 'See what she does with that.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你没有替她把话说完', reasonEn: 'You did not finish her sentence for her' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 5, affection: 14, reasonZh: '她被逼着自己说出了那句话', reasonEn: 'She was made to say it herself' }],
        setFlags: ['maki_story_made_her_say_it'],
        then: [
          {
            type: 'narration',
            characterImage: `${K}angry_alt.webp`,
            zh: '她的手指停了。',
            en: 'The tapping stops.'
          },
          {
            type: 'narration',
            zh: '高架铁轨上电车呼啸轰鸣而过，车厢与铁轨撞击的震动顺着梁柱传到指尖。在这漫长的震颤轰鸣中，她始终低着头，一个字都没说。',
            en: 'The train roars overhead along the viaduct, vibration traveling down the pillars into your fingertips. In the long rumble, she keeps her head bowed and says nothing.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}shy_alt.webp`,
            jp: '……勝負ちゃうくても、やったらあかんの。',
            zh: '……就算不是比赛，就不能打了吗。',
            en: '...Even if it is not a match. Are we not allowed to just play.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '关西腔掉了。这一句是标准语。',
            en: 'The Kansai has gone. That sentence came out standard.'
          },
          {
            type: 'narration',
            zh: '你说可以。你说本来就可以。',
            en: 'You say yes. You say it was always allowed.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}shy.webp`,
            jp: '……ほな、五本先取な。ハンデはやらん。',
            zh: '……那，先赢五局的。不给让子。',
            en: '...First to five, then. No handicap.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她马上又把它变回了一场比赛。但这次是一场要打很久的比赛。',
            en: 'She turns it straight back into a contest. This time, though, it is a contest that takes a long while.'
          }
        ]
      },
      {
        id: 'maki1_play_third',
        labelZh: '「打。」直接投币',
        labelEn: '"Yes." Put a coin in.',
        hintZh: '不用问为什么。她开口了就够难了',
        hintEn: 'Do not ask why. Getting the words out was hard enough.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有让她解释自己', reasonEn: 'You did not make her account for herself' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 9, affection: 8, reasonZh: '她提的那个第三局，有人接了', reasonEn: 'The third round she offered got taken' }],
        then: [
          {
            type: 'narration',
            characterImage: `${K}happy.webp`,
            zh: '她"よっしゃ"了一声，音量比她自己预想的大。旁边一台机器前面的大叔看了一眼。',
            en: 'She says "right then" louder than she intended. A man at the next cabinet looks over.'
          },
          {
            type: 'narration',
            zh: '第三局你输了。第四局你输了。第五局她故意放水，你还是输了，她笑到需要扶着机台。',
            en: 'You lose the third. You lose the fourth. She goes easy on the fifth and you lose that too, and she laughs until she has to hold on to the cabinet.'
          }
        ]
      },
      {
        id: 'maki1_call_it',
        labelZh: '「你其实不在乎输赢吧。」',
        labelEn: '"You do not actually care about winning, do you."',
        jp: 'あんた、勝ち負けどうでもええんちゃう？',
        hintZh: '一个只想赢的人，赢完就走了',
        hintEn: 'Someone who only wants to win leaves once they have won.',
        requires: { stat: 'charm', min: 6 },
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你把她那套挑衅的用途说破了', reasonEn: 'You named what the taunting is for' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 4, affection: 12, reasonZh: '她被拆穿了，然后没有反驳', reasonEn: 'She was called on it, and did not argue' }],
        setFlags: ['maki_story_called_out'],
        then: [
          {
            type: 'narration',
            characterImage: `${K}angry.webp`,
            zh: '她猛地转过来，嘴张开了，然后什么都没说出来。',
            en: 'She whips round, opens her mouth, and nothing arrives.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}angry_alt.webp`,
            jp: 'うっさい。……うっさいわ。',
            zh: '烦死了。……烦死了啦。',
            en: 'Shut up. ...Just shut up.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她转回去，把硬币"当"地投进机器，投得很用力。',
            en: 'She turns back and slams a coin into the slot.'
          },
          {
            type: 'speech',
            speakerZh: '真希', speakerEn: 'Maki',
            characterImage: `${K}neutral_alt.webp`,
            jp: '……勝負言うたら、来るやん。みんな。',
            zh: '……说是比赛的话，大家就会来嘛。',
            en: '...If you call it a match, people come. They do.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她说的是「大家」。你想了想这个词，然后意识到她指的可能是很少的几个人。',
            en: 'She says "people". You turn the word over and realise it may refer to a rather small number of them.'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '出来的时候快九点了。章鱼烧摊在收摊，老板认得她，多给了两颗。',
    en: 'It is nearly nine when you come out. The takoyaki stall is closing; the owner knows her and puts in two extra.'
  },
  {
    type: 'narration',
    characterImage: `${K}happy.webp`,
    zh: '她一边烫得吸气一边吃，一边报下周三的时间，报得像在念课表。',
    en: 'She eats them too hot, hissing, and recites next Wednesday’s time like a timetable entry.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}smug.webp`,
    jp: '来週も五分遅刻したら、ハンデ倍にするからな。',
    words: [{ jp: '倍', reading: 'ばい', zh: '加倍', en: 'double' }],
    zh: '下周再迟到五分钟，我就把让子加倍。',
    en: 'Five minutes late again next week and I am doubling the handicap.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '她给的让子从来是零。加倍还是零。你没有指出来。',
    en: 'The handicap she gives is always zero. Doubled, it is still zero. You do not point this out.'
  },
  {
    type: 'narration',
    zh: '走到路口她往另一个方向去了。走了大概十步，回头喊了一句。',
    en: 'At the crossing she goes the other way. About ten steps on, she shouts back.'
  },
  {
    type: 'speech',
    speakerZh: '真希', speakerEn: 'Maki',
    characterImage: `${K}happy_alt.webp`,
    jp: 'センパイ！　……なんでもない！',
    zh: '前辈！……没事！',
    en: 'Senpai! ...Never mind!',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '然后她跑了。跑的方向是错的——你上次就发现了，她永远走错方向，而且永远不承认。',
    en: 'Then she runs. In the wrong direction, which you noticed last time as well: she always goes the wrong way, and never admits it.'
  },
  {
    type: 'effect',
    setFlags: ['maki_story_1_done'],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '一整晚的关西腔，你现在能听懂大半', reasonEn: 'A whole evening of Kansai-ben, and most of it went in' },
      { stat: 'charm', amount: 1, reasonZh: '你输了五局还坐在那儿', reasonEn: 'You lost five in a row and were still sitting there' }
    ],
    relations: [
      { char: CharacterId.MAKI, familiarity: 10, affection: 6, reasonZh: '她赢了之后没有走', reasonEn: 'She won, and did not leave' }
    ]
  }
];
