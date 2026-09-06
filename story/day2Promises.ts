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
    zh: '你猛一回头，她正双手抱胸站在你身后几步远的地方，半眯着眼，不知已经好整以暇地盯了你多久。',
    en: 'You spin around; she is standing a few paces behind with arms folded, half-squinting, looking as though she has watched you for ages.'
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
    promptZh: '她踩着小皮鞋径直走出了几步，才慢悠悠回过头来。',
    promptEn: 'She clicks forward a few steps in her leather shoes before casually glancing back.',
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
            zh: '穿过两条商业街的小巷，眼前出现了一家日常超市。她熟练地抽出一只塑料购物篮往你怀里一塞，理所当然地说了句「持って」。',
            en: 'Through two commercial alleyways, a local supermarket appears. She pulls out a shopping basket and shoves it into your arms, naturally remarking: "Hold this."'
          },
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
  // ---------------------------------------------------------
  // 🛒 超市
  //
  // 这一段以前是三句旁白，四十分钟压成一行「她在货架之间来回」。
  // 但这是这两个人第一次单独待够长的时间，逛超市恰好是那种
  // 什么都没发生、却什么都露出来了的场合。
  // ---------------------------------------------------------
  { type: 'scene', scene: 'supermarket', bgm: 'store', titleZh: '业务超市 · 三宫店', titleEn: 'The Supermarket' },
  {
    type: 'narration',
    zh: '进门是蔬菜。她推着车直接拐进去，动作熟得像在自己家。你跟在后面，第一次发现原来白萝卜可以论"半根"卖。',
    en: 'Vegetables are just inside the door. She turns straight in with the trolley, moving like somebody in her own house. You follow, and discover for the first time that daikon can be sold by the half.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: 'あんた、今日から一人で作んねんで。まず、これ。',
    zh: '你从今天起要一个人做饭的欸。首先，这个。',
    en: 'You are cooking for yourself from now on. First: this.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '「这个」是一袋豆芽。四十九日元。她把它放进篮子的样子，像是在传授某种秘技。',
    en: '"This" is a bag of bean sprouts. Forty-nine yen. The way she puts it in the basket suggests the transmission of a secret technique.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_happy.webp`,
    zh: '「豆芽是这样的，」她说，「什么都能加，加了就有量，而且它便宜到你不会心疼。人生的底线就是这个。」',
    en: '"Bean sprouts work like this," she says. "They go in anything, they make it look like more, and they are cheap enough that you never regret them. That is the floor of a human life."'
  },
  {
    type: 'narration',
    zh: '你说这话听起来像是某种武道流派的第一课。她非常认真地点了点头，说「せやで」。',
    en: 'You say that sounds like the first lesson of some martial school. She nods gravely and agrees that it is.'
  },

  {
    type: 'narration',
    zh: '生鲜鱼柜前面，系着围裙的促销阿姨正笑脸盈盈地分发试吃。竹签上插着金黄酥脆的炸鱼块。奈绪眼疾手快地拿了一串，紧接着又顺理成章地顺走第二串，塞到了你的手里。',
    en: 'At the fresh fish counter, a promotional clerk in an apron is cheerily offering samples: golden crispy fried fish on cocktail sticks. Nao nimbly takes one, smoothly swiping a second right after to thrust into your hand.'
  },
  {
    type: 'narration',
    zh: '阿姨看着她。她非常自然地说了句「弟です」，然后推着车就走了。',
    en: 'The woman looks at her. Nao says, entirely naturally, that you are her little brother, and pushes the trolley onwards.'
  },
  {
    type: 'choice',
    promptZh: '你跟上去，嘴里还含着那块试吃。',
    promptEn: 'You catch up with the sample still in your mouth.',
    options: [
      {
        id: 'mkt_brother',
        labelZh: '「你比我小三个月。」',
        labelEn: '"You are three months younger than me."',
        jp: '……三ヶ月下やろ、あんた。',
        hintZh: '这件事你记了十年',
        hintEn: 'You have been keeping this fact for ten years.',
        relations: [{ char: CharacterId.NAO, familiarity: 6, affection: 4, reasonZh: '她被抓到了，而且是被十年前的证据抓到的', reasonEn: 'She was caught out, on ten-year-old evidence' }],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_angry.webp`,
            zh: '「うるさい。」她说。「試食もろてる時は、下や。」',
            en: '"Shut up," she says. "When there are free samples involved, you are the younger one."'
          },
          {
            type: 'narration',
            zh: '这个规则你以前没听说过。但你回头看了一眼，阿姨又给了她一块。',
            en: 'This is a rule you had not previously encountered. You do look back, though, and the woman has given her another piece.'
          }
        ]
      },
      {
        id: 'mkt_jojo',
        labelZh: '「……你刚才那个撒谎的速度，是替身能力吧。」',
        labelEn: '"...The speed of that lie. That is a Stand ability."',
        jp: '今の嘘、スピードがおかしい。スタンド使いやろ。',
        hintZh: '零点二秒，面不改色',
        hintEn: 'Two tenths of a second, and not a flicker.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你说了一句只有你们俩听得懂的话', reasonEn: 'You said something only the two of you would understand' }],
        relations: [{ char: CharacterId.NAO, familiarity: 4, affection: 7, reasonZh: '她接住了，而且接得比你还快', reasonEn: 'She caught it, and caught it faster than you threw it' }],
        setFlags: ['nao_stand_joke'],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_happy.webp`,
            zh: '她连头都没回。「近距離パワー型やで。射程、五メートル。」',
            en: 'She does not even turn round. "Close-range power type. Range: five metres."'
          },
          {
            type: 'narration',
            zh: '你笑出了声，笑到旁边挑鱼的大叔看了你一眼。你们两个人上一次这样是在小学的走廊上，那时候讲的还是同一部动画。',
            en: 'You laugh out loud, loudly enough that a man choosing fish looks over. The last time the two of you did this was in a primary school corridor, and it was the same show then too.'
          },
          {
            type: 'narration',
            characterImage: `${N}knit_shy.webp`,
            zh: '「……あんた、まだ覚えてたんや。」她这句说得比刚才小声很多。',
            en: '"...You still remember that." She says this one considerably more quietly.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '调味料那一排她站了很久。酱油有整整一面墙，从两百日元到两千日元都有。你伸手要拿最便宜的那瓶，被她拍了一下。',
    en: 'She stands a long time at the seasonings. There is an entire wall of soy sauce, from two hundred yen up to two thousand. You reach for the cheapest bottle and she smacks your hand.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: '醤油はケチったらあかん。これは毎日使うやつやから。',
    words: [{ jp: '醤油', reading: 'しょうゆ', zh: '酱油', en: 'soy sauce' }],
    zh: '酱油不能省。这是每天都要用的东西。',
    en: 'You do not economise on soy sauce. This is something you use every single day.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '她拿的是中间那一瓶。不是最贵的，也不是第二贵的，是从右边数第四瓶。你问她为什么是这瓶。',
    en: 'She takes one from the middle. Not the most expensive, not the second most expensive: the fourth from the right. You ask why that one.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_shy.webp`,
    zh: '「……うちがずっとこれやから。」她说完把它放进篮子，动作有点快。',
    en: '"...Because it is the one we always had." She puts it in the basket rather quickly after saying it.'
  },

  {
    type: 'narration',
    zh: '鸡蛋区。她伸手，停住了，把手收了回来。',
    en: 'The eggs. She reaches out, stops, and takes her hand back.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_curious.webp`,
    zh: '「……昨日、買うたっけ。」她问的是自己。她想了很久，久到旁边有人要拿鸡蛋，绕过她走了。',
    en: '"...Did I buy eggs yesterday." The question is for herself. She thinks about it long enough that somebody else who wants eggs goes around her.'
  },
  {
    type: 'narration',
    zh: '最后她还是拿了一盒。「二個あっても死なへんし。」这句话你觉得可以印在她的墓碑上，当然是很多年以后的事。',
    en: 'In the end she takes a box anyway. Nobody ever died of having two. You privately decide that this could go on her headstone, a great many years from now.'
  },

  {
    type: 'narration',
    zh: '结账队伍很长。她一边排一边把篮子里的东西重新码了一遍，把软的放上面，鸡蛋放最上面。这一整套动作她做得毫不犹豫，像是做过几千次。',
    en: 'The queue is long. While you wait she repacks the basket, soft things on top, eggs on the very top. She does all of it without hesitating, as though she has done it a few thousand times.'
  },
  {
    type: 'narration',
    zh: '你忽然想到：她比你早回来一年。这一年里，这些事都是她一个人做的。没有人教她怎么码篮子。',
    en: 'It occurs to you that she came back a year before you did. For that year she did all of this on her own. Nobody taught her how to pack a basket.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '收银台上，账单一半是你的东西。你伸手要掏钱包，她已经把卡按在读卡器上了，按得又快又准，像是早就想好了要抢在你前面。',
    en: 'At the till, half the bill is yours. You reach for your wallet. Her card is already flat against the reader, fast and accurate, in a way that had clearly been planned some time in advance.'
  },
  {
    type: 'narration',
    zh: '「小票给我。」你说。她说扔了。她当然没扔——她这次是攥在手里的，攥了一路。',
    en: 'You ask for the receipt. She says she threw it away. She has not: this time it is in her fist, and it stays there the whole way out.'
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
