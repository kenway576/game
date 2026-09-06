import { CharacterId, StoryNode } from '../types';

// ==========================================================
// 📌 第一天答应过的两件事
//
// 第一章结尾，两个人各跟主角约了第二天：
//   · 奈绪：「明日は坂の下ちゃうくて、駅で待っとくわ」
//   · 昴（只有走体育馆那条线才有）：「明日も来る？体育館、四時からずっと空いとるで」
//
// 但第二天（4/12）一直什么都没有。玩家记得这个约，游戏不记得——
// 这是这个游戏里最伤的一种 bug：它让主角看起来像个说话不算数的人。
//
// 【怎么接】
// 不做成"任务"。它们就是 4/12 那天大厅里等着的两段剧情，
// 时间到了自己会演：奈绪那段在午休之后（她说的是"下午"），
// 昴那段在放学后（她说的是"四点开始"）。
//
// 【为什么昴那段要判 flag】
// 她只在玩家第一天选了体育馆的时候才说过这句话。
// 没选过体育馆的玩家收到一个"昨天的约"，会一头雾水。
// ==========================================================

const S = '/images/characters/sora/';
const N = '/images/characters/nao/';

export interface PromiseDef {
  id: string;
  // 4/12。写死日期，因为它们是"第二天"，不是"某天"。
  month: number; day: number;
  slot: 'lunch' | 'afternoon' | 'night';
  requiresFlags?: string[];
  titleZh: string; titleEn: string;
  script: StoryNode[];
}

// ---------------------------------------------------------
// 🚉 奈绪：三宫站，六个出口
// ---------------------------------------------------------
const NAO_STATION: StoryNode[] = [
  {
    type: 'scene', scene: 'sannomiya_station', bgm: 'town',
    titleZh: '三宫站', titleEn: 'Sannomiya Station',
    subtitleZh: '下午 4:10', subtitleEn: '4:10 PM'
  },
  {
    type: 'narration',
    zh: '她说的是"在车站等"。三宫站有六个出口，你昨晚睡前想起过这件事，然后决定早点出门。',
    en: 'What she said was that she would wait at the station. Sannomiya has six exits. You thought about that before you went to sleep and decided to leave early.'
  },
  {
    type: 'narration',
    zh: '你从中央口出去，没有。绕到东口，没有。绕回来的路上你开始怀疑她说的是不是阪急那个站。',
    en: 'You come out at the central gate. Nothing. Round to the east gate. Nothing. On the way back you start to wonder whether she meant the Hankyu station.'
  },
  {
    type: 'narration',
    zh: '第三个出口你没找到人，但找到了一条短信：「どこ」。发送时间四点零二。',
    en: 'At the third exit you find no Nao, but you do find a message. It says "where". Sent at two minutes past four.'
  },
  {
    type: 'narration',
    zh: '你还没打完字，第二条来了：「後ろ」。',
    en: 'Before you have finished typing, a second one arrives: "behind you".'
  },
  {
    type: 'narration', characterImage: `${N}knit_neutral.webp`,
    zh: '她在你后面大概两米，抱着胳膊，已经站了不知道多久。',
    en: 'She is about two metres behind you with her arms folded, and has been for an unknown length of time.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_angry.webp`,
    jp: '六個ある言うたやん。……言うてへんかったっけ。',
    zh: '我说了有六个出口吧。……我没说吗。',
    en: 'I did say there were six. ...Did I not say that.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你说她没说。她说「あ、そう」，然后就往前走了，走的方向你不知道是哪儿。',
    en: 'You say she did not. She says "oh, right", and starts walking, in a direction you cannot identify.'
  },
  {
    type: 'choice',
    promptZh: '她走了大概五米才回头。',
    promptEn: 'She gets about five metres before looking back.',
    options: [
      {
        id: 'p_nao_follow',
        labelZh: '跟上去，什么也不问',
        labelEn: 'Follow, and ask nothing',
        hintZh: '她知道自己要去哪儿', hintEn: 'She knows where she is going.',
        relations: [{ char: CharacterId.NAO, familiarity: 8, affection: 4, reasonZh: '你没有要求她解释', reasonEn: 'You did not require her to explain' }],
        then: [
          {
            type: 'narration',
            zh: '走了十分钟，是一家超市。她拿了一个购物篮塞给你，说「持って」。',
            en: 'Ten minutes later it is a supermarket. She takes a basket and pushes it at you. "Hold this."'
          },
          {
            type: 'narration',
            zh: '接下来四十分钟她在货架之间来回，往篮子里放东西，一样都没问过你要不要。',
            en: 'For the next forty minutes she goes up and down the aisles putting things in the basket, without once asking whether you want any of it.'
          },
          {
            type: 'narration',
            zh: '结账的时候你才发现，篮子里一半是你家里没有的东西。她一直知道你冰箱是空的。',
            en: 'At the till you notice that half of it is things you do not have. She has known all along that your fridge is empty.'
          }
        ]
      },
      {
        id: 'p_nao_ask',
        labelZh: '「等一下，去哪儿？」',
        labelEn: '"Hang on. Where are we going?"',
        jp: 'ちょお待って、どこ行くん。',
        hintZh: '你有权知道', hintEn: 'You are entitled to know.',
        relations: [{ char: CharacterId.NAO, familiarity: 5, affection: 6, reasonZh: '她被问住了，因为她根本没想过要说', reasonEn: 'The question stopped her, because it had not occurred to her to say' }],
        then: [
          {
            type: 'narration', characterImage: `${N}knit_curious.webp`,
            zh: '她停住了。「……スーパー。」她说的时候有点不确定，像是刚刚才想起来自己没说过。',
            en: 'She stops. "...Supermarket." She says it slightly uncertainly, as if only now remembering she had not mentioned it.'
          },
          {
            type: 'narration',
            zh: '「あんたんとこ、冷蔵庫空やろ。」她说完就继续走了。这句她说得非常肯定。',
            en: '"Your fridge is empty." She carries on walking. That part she says with total confidence.'
          },
          {
            type: 'narration',
            zh: '你确实是空的。你没告诉过她。',
            en: 'It is. You have not told her that.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration', characterImage: `${N}knit_neutral.webp`,
    zh: '回坡道口的时候两只手都拎着袋子。她把其中一袋换到自己那边，理由是"你拿得不对，会勒手"。',
    en: 'You go back to the foot of the slope with a bag in each hand. She moves one of them to her side, on the grounds that you are carrying it wrong and it will cut into your fingers.'
  },
  {
    type: 'effect',
    effects: [
      { stat: 'kindness', amount: 2, reasonZh: '有人替你想过冰箱里有什么', reasonEn: 'Somebody has thought about what is in your fridge' }
    ],
    setFlags: ['day2_nao_done']
  }
];

// ---------------------------------------------------------
// 🏀 昴：体育馆，四点以后
// ---------------------------------------------------------
const SORA_GYM: StoryNode[] = [
  {
    type: 'scene', scene: 'gym', bgm: 'chat',
    titleZh: '体育馆', titleEn: 'The Gym',
    subtitleZh: '下午 4:20', subtitleEn: '4:20 PM'
  },
  {
    type: 'narration',
    zh: '她昨天说的是"从四点开始一直空着"。四点二十，馆里只有她一个人，和昨天一模一样。',
    en: 'What she said was that it is free from four. At twenty past, there is one person in there, exactly as there was yesterday.'
  },
  {
    type: 'narration', characterImage: `${S}school_neutral.webp`,
    zh: '她没有回头。「来た。」她说，球没停。',
    en: 'She does not turn round. "You came." The ball does not stop.'
  },
  {
    type: 'narration',
    zh: '你后来发现她那句话说得太快了——快到像是已经准备好说很多遍，准备了一下午。',
    en: 'It occurs to you later that she said it very fast. Fast enough to have been ready to say it a great many times, all afternoon.'
  },
  {
    type: 'choice',
    promptZh: '她把球传了过来。',
    promptEn: 'She passes you the ball.',
    options: [
      {
        id: 'p_sora_shoot',
        labelZh: '投一个',
        labelEn: 'Take a shot',
        hintZh: '你昨天那个是撞板进的', hintEn: 'Yesterday\'s went in off the board.',
        relations: [{ char: CharacterId.SORA, familiarity: 10, affection: 3, reasonZh: '你接住了球，而且投了', reasonEn: 'You caught it and you shot' }],
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '第二天比第一天稳一点', reasonEn: 'Steadier on the second day than the first' }],
        then: [
          {
            type: 'narration',
            zh: '空心。你自己都愣了一下。',
            en: 'Nothing but net. You are as surprised as anybody.'
          },
          {
            type: 'narration', characterImage: `${S}school_happy.webp`,
            zh: '她笑得非常大声，整个体育馆都在回音。「昨日のあれ、まぐれやなかったんか。」',
            en: 'She laughs loudly enough that the whole gym echoes. "So yesterday was not a fluke after all."'
          },
          {
            type: 'narration',
            zh: '你说昨天是撞板的。她说她知道，她当时就在旁边。',
            en: 'You say yesterday went in off the board. She says she knows. She was standing right there.'
          }
        ]
      },
      {
        id: 'p_sora_pass',
        labelZh: '把球传回去',
        labelEn: 'Pass it back',
        hintZh: '你今天不是来投篮的', hintEn: 'You did not come to shoot.',
        relations: [{ char: CharacterId.SORA, familiarity: 6, affection: 6, reasonZh: '你来了，这件事本身就是回答', reasonEn: 'You came, and coming was the answer' }],
        then: [
          {
            type: 'narration',
            zh: '她接住了，运了两下，又传回来。你又传回去。',
            en: 'She catches it, bounces it twice and passes it back. You pass it back again.'
          },
          {
            type: 'narration',
            zh: '就这样传了大概二十个来回，谁也没说话。她的呼吸慢慢平下来了。',
            en: 'It goes back and forth about twenty times and neither of you says anything. Her breathing settles.'
          },
          {
            type: 'narration', characterImage: `${S}school_neutral.webp`,
            zh: '「……昨日、誰も来おへんと思っててん。」她说这句话的时候在看地板上的线。',
            en: '"...I thought nobody would come." She is looking at the lines on the floor when she says it.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '五点半有人来关灯。你们一起把球收进球车，她推的那一边轮子有点卡。',
    en: 'At half five somebody comes to turn the lights off. You put the balls in the cart together. One wheel on her side sticks.'
  },
  {
    type: 'effect',
    effects: [
      { stat: 'guts', amount: 2, reasonZh: '你去了一个只有一个人在等的地方', reasonEn: 'You went somewhere one person was waiting' }
    ],
    setFlags: ['day2_sora_done']
  }
];

export const DAY2_PROMISES: PromiseDef[] = [
  {
    id: 'day2_nao', month: 4, day: 12, slot: 'afternoon',
    titleZh: '三宫站，六个出口', titleEn: 'Six Exits',
    script: NAO_STATION
  },
  {
    id: 'day2_sora', month: 4, day: 12, slot: 'night',
    // 只有第一天真的去了体育馆，她才说过这句话
    requiresFlags: ['day1_route_gym'],
    titleZh: '四点以后', titleEn: 'After Four',
    script: SORA_GYM
  }
];

export const promiseDue = (
  month: number, day: number, slot: string, flags: Record<string, boolean>
): PromiseDef | null =>
  DAY2_PROMISES.find(p =>
    p.month === month && p.day === day && p.slot === slot
    && !flags[`${p.id}_done`]
    && (!p.requiresFlags || p.requiresFlags.every(f => flags[f]))
  ) || null;
