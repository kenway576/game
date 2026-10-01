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
        labelZh: '「……这个味道，是说谎的味道呢。」',
        labelEn: '"...This taste is the taste of a liar."',
        jp: 'この味は……嘘をついてる味やな。',
        hintZh: '布加拉提附体',
        hintEn: 'Channeling Bucciarati.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你说了一句只有你们俩听得懂的话', reasonEn: 'You said something only the two of you would understand' }],
        relations: [{ char: CharacterId.NAO, familiarity: 6, affection: 6, reasonZh: '她接住了，而且拿姐姐的身份压你', reasonEn: 'She caught it, and pulled sister rank on you' }],
        setFlags: ['nao_stand_joke'],
        then: [
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_happy.webp`,
            jp: '何よ。今のウチ、お姉さんっぽくなかった？……あんた、またアニメのセリフ言うて。',
            zh: '怎么，现在我难道不像你姐姐吗？……你这家伙，又在说那些听不懂的动漫台词了。',
            en: 'What? Don\'t I look like your big sister now? ...There you go quoting anime again.',
            color: 'bg-emerald-500'
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
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '出了业务超市的推拉门，三宫的晚风扑面而来。你手里拎着装满白萝卜、豆芽、鸡蛋和特价乌冬面的大塑料袋，手腕被勒得微微发沉。',
    en: 'Stepping through the automatic sliding doors of the Gyomu Supermarket, the evening breeze of Sannomiya greets you. In your hand hangs a heavy plastic bag laden with daikon, bean sprouts, eggs, and discount udon noodles.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_curious.webp`,
    zh: '奈绪走在前面两步，忽然像想起了什么极重要的事似的猛然刹住脚，回过身把你从头到脚扫视了一遍。',
    en: 'Nao takes two paces ahead, then abruptly skids to a stop as though remembering something critically important, spinning around to inspect you head to toe.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_curious.webp`,
    jp: '……あんた、まさかと思うけど。部屋にフライパン洗うスポンジとか、食器用洗剤とか、あるん？',
    words: [
      { jp: 'スポンジ', reading: 'スポンジ', zh: '海绵、清洁海绵', en: 'sponge' },
      { jp: '洗剤', reading: 'せんざい', zh: '洗涤剂、清洁剂', en: 'detergent / dish soap' }
    ],
    zh: '……你这家伙，该不会连洗锅的海绵和洗洁精都还没买吧？',
    en: '...Don\'t tell me. Do you even have a sponge for your frying pan or dish soap in your room?',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你回想了一下 201 室。除了房东奶奶借给你的老式电水壶、一个地铺单人被褥和空空荡荡的榻榻米，几乎连个喝水的杯子都没有。你诚实地摇了摇头。',
    en: 'You mentally scan Room 201. Aside from the vintage electric kettle lent by the landlady, a futon on the floor, and bare tatami mats, you do not even possess a water glass. You shake your head honestly.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_angry.webp`,
    jp: 'やっぱり！あんた、生活力ゼロやん！食材だけ買うても、洗うもんも干すもんもなかったら一食で詰むで！',
    words: [
      { jp: '生活力', reading: 'せいかつりょく', zh: '独立生活能力', en: 'life skills / ability to live independently' }
    ],
    zh: '果然！你这家伙的自理能力根本就是零蛋吧！光买了菜有什么用，没东西洗、没东西挂，吃完第一顿就全线瘫痪了啊！',
    en: 'I knew it! Your independent living skill is literally zero! What use are groceries if you cannot wash up or hang anything? You\'d be completely paralyzed after one meal!',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_happy.webp`,
    zh: '她单手叉腰，像极了电视剧里训斥笨蛋弟弟的精明长姐，嘴角却抑制不住地泛起一股"果然没我不行吧"的得意之色。',
    en: 'She rests one hand on her hip, looking every bit like the shrewd older sister lecturing an incompetent younger brother in a TV drama, though a smug "you\'d be hopeless without me" grin slips onto her lips.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_happy.webp`,
    jp: 'しゃあないな……うちが三宮の『百均』で、一人暮らしのサバイバル術教えたる！ついてき！',
    words: [
      { jp: '百均', reading: 'ひゃっきん', zh: '百元店（百円均一的略称）', en: '100-yen shop (hyakkin)' },
      { jp: 'サバイバル', reading: 'サバイバル', zh: '生存、求生', en: 'survival' }
    ],
    zh: '真拿你没办法……就由本小姐带你去三宫的「百元店」，手把手教你独居生存的终极奥义！跟紧了！',
    en: 'Hopeless case, honestly... I\'ll take you to the Sannomiya "100-yen shop" and teach you the ultimate survival arts of living alone! Keep up!',
    color: 'bg-emerald-500'
  },
  {
    type: 'scene', scene: 'sannomiya_arcade', bgm: 'town',
    titleZh: '三宫商业街', titleEn: 'Sannomiya Shopping Arcade',
    subtitleZh: '傍晚 5:00', subtitleEn: '5:00 PM'
  },
  {
    type: 'narration',
    zh: '夕阳的余晖透过商业街挑高的拱形玻璃顶棚斜斜落下来。两旁的炸肉饼店、老旧喫茶店和二手唱片行飘出令人放松的香气与杂音。',
    en: 'Slanted golden twilight filters through the vaulted glass archway of the covered arcade. The aromas of croquette stalls, vintage kissaten cafes, and secondhand record shops mingle into a comforting hum.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '奈绪一边在人流中轻巧地穿梭，一边像通关向导一样竖起一根食指，开始传授她的独居生存第一定理。',
    en: 'Nao nimbly weaves through the crowd, raising an index finger like an in-game tutorial guide as she delivers her first theorem of independent living.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: '聴きや。日本の一人暮らしはな、『百均』を使いこなせるかどうかで初期費用が三倍変わんねん。',
    words: [
      { jp: '初期費用', reading: 'しょきひよう', zh: '初期安家成本、初期费用', en: 'initial costs' }
    ],
    zh: '听好了。在日本一个人生活，能不能把「百元店」玩明白，初期安家费用能差出整整三倍。',
    en: 'Listen up. Living alone in Japan, whether you master the "100-yen shop" changes your initial set-up costs by threefold.',
    color: 'bg-emerald-500'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: '鉄則その一：消耗品と小物は全部百均！水切りネット、メラミンスポンジ、コロコロ、S字フック。これらは高いの買うたら負けや。',
    words: [
      { jp: '鉄則', reading: 'てっそく', zh: '铁则、死规矩', en: 'iron rule' },
      { jp: '水切りネット', reading: 'みずきりネット', zh: '水槽沥水网袋', en: 'sink drain mesh' },
      { jp: '消耗品', reading: 'しょうもうひん', zh: '消耗品', en: 'consumables' }
    ],
    zh: '铁则第一条：消耗品和小工具一律买百元店！水槽滤网、魔术海绵、除尘粘毛滚轮、S形挂钩……这些东西买贵的你就输了。',
    en: 'Iron Rule #1: All consumables and small widgets come from the 100-yen shop! Sink drain meshes, melamine sponges, lint rollers, S-hooks... buy expensive ones and you lose.',
    color: 'bg-emerald-500'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_angry.webp`,
    jp: 'でもな！包丁とフライパンだけは絶対に百均で買うたらあかんで！切れへん包丁は怪我するし、安いフライパンは二回で焦げ付くからな！',
    words: [
      { jp: '包丁', reading: 'ほうちょう', zh: '菜刀', en: 'kitchen knife' },
      { jp: 'フライパン', reading: 'フライパン', zh: '平底锅', en: 'frying pan' }
    ],
    zh: '但是！唯独菜刀和平底锅，绝对不能在百元店买！钝刀最容易滑手切伤自己，便宜平底锅的涂层用两次就全烧焦剥落了！',
    en: 'However! Never, ever buy your kitchen knife or frying pan at a 100-yen shop! A blunt knife will slip and slice your fingers, and a cheap pan coat peels after twice!',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你说这番话听着简直字字泣血，她当年是不是吃过大亏。奈绪别开脸轻咳了一声，假装没听见。',
    en: 'You remark that this advice sounds soaked in blood and tears, asking if she learned it the hard way. Nao looks away with a slight cough, pretending not to hear.'
  },
  {
    type: 'scene', scene: 'hundred_yen_shop_interior', bgm: 'store',
    titleZh: '百元店 · Can★Do', titleEn: '100-Yen Shop · Can★Do',
    subtitleZh: '傍晚 5:15', subtitleEn: '5:15 PM'
  },
  {
    type: 'narration',
    zh: '店里冷白色的日光灯明晃晃的，货架密密麻麻，整齐得令人叹为观止。从收纳盒到文具，从卫浴用品到园艺工具，所有的价签几乎都只写着「100円（税込110円）」。',
    en: 'The cool white fluorescent lamps illuminate dense, breathtakingly organized aisles. From storage tubs to stationery, bathware to gardening tools, almost every tag reads "100 Yen (110 Yen with tax)".'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_curious.webp`,
    zh: '奈绪熟练地抽出一只粉红色的塑料小购物筐挂在手肘上，径直将你拽到了日用品区。',
    en: 'Nao smoothly loops a small pink plastic basket over her elbow, marching you straight into the daily goods aisle.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: 'まずこれ！洗濯ネット！海風荘の洗濯機、コインランドリー式やろ？ネット使わんと、あんたの服一瞬でヨレヨレになるで。',
    words: [
      { jp: '洗濯ネット', reading: 'せんたくネット', zh: '洗衣网、洗衣袋', en: 'laundry net' },
      { jp: 'ヨレヨレ', reading: 'ヨレヨレ', zh: '皱皱巴巴、变形松垮', en: 'worn out / stretched out' }
    ],
    zh: '首先是这个！洗衣袋！海风庄楼下的洗衣机是老式投币式的吧？不套洗衣袋的话，你那些体恤衫洗一次领口就全松成荷叶边了。',
    en: 'First, this! Laundry net! The machine downstairs at Umikaze-so is coin-op, right? Wash without a net and your t-shirt collars will stretch into frills instantly.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '她不由分说地把两个细网眼的洗衣袋丢进篮子里，接着带你停在了一整面摆满清洁海绵的货架前。',
    en: 'She tosses two fine-mesh laundry bags into the basket without debate, then leads you to halt before an entire wall of cleaning sponges.'
  },
  {
    type: 'choice',
    promptZh: '货架上有琳琅满目的清洁海绵，奈绪转头看向你。',
    promptEn: 'The shelves display a dizzying array of cleaning sponges. Nao turns to face you.',
    options: [
      {
        id: 'hyakkin_practical_sponge',
        labelZh: '「选最划算的五只装多色双面海绵」',
        labelEn: '"Pick the value 5-pack of colorful dual-sided sponges"',
        jp: '一番コスパ良さそうな、この五個入りにしとく。',
        hintZh: '实用主义的王道选择', hintEn: 'The pragmatic king of choices.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '展现出了扎实的独居实用眼光', reasonEn: 'Demonstrated solid pragmatic intuition for living alone' }],
        relations: [{ char: CharacterId.NAO, familiarity: 6, affection: 4, reasonZh: '她对你的领悟速度感到非常满意', reasonEn: 'She was thoroughly pleased with your quick grasp' }],
        then: [
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_happy.webp`,
            jp: 'せや！硬い面でフライパンの焦げ落として、柔らかい面でコップ洗うんや。消耗品はコスパこそ正義！よぉ分かっとるやん。',
            zh: '这就对了！粗糙的那面用来刮锅底，柔软的那面洗杯子。消耗品当然是性价比至上！悟性不错嘛。',
            en: 'Exactly! Scour the pans with the rough side, wash glasses with the soft side. Cost performance is justice for consumables! Quick study, aren\'t you.',
            color: 'bg-emerald-500'
          }
        ]
      },
      {
        id: 'hyakkin_cat_sponge',
        labelZh: '「伸手拿起旁边那块可爱的黑猫造型魔术擦」',
        labelEn: '"Reach for the cute black cat-shaped melamine sponge"',
        jp: '……この猫の形のやつ、めっちゃ可愛くない？',
        hintZh: '被可爱击中', hintEn: 'Smitten by cuteness.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '发现了生活里的微小趣味', reasonEn: 'Found small joys in everyday items' }],
        relations: [{ char: CharacterId.NAO, familiarity: 5, affection: 7, reasonZh: '她嘴上嫌弃，其实自己也很想要', reasonEn: 'She feigned annoyance, but secretly wanted it too' }],
        setFlags: ['nao_bought_cat_sponge'],
        then: [
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_shy.webp`,
            jp: '……アホ！実用性で選べ言うた直後やろ！……まあ、メラミンスポンジは水だけでシンクの水垢落ちるし……べ、別に可愛いから買うわけちゃうで！',
            zh: '……笨蛋！我才刚说了要看实用性吧！……不过，三聚氰胺魔术擦只用清水就能擦掉水槽水垢……我、我可不是因为长得像猫才放进去的啊！',
            en: '...Idiot! Right after I told you to look at utility! ...Well, melamine sponges do wipe sink scale with just water... I-it\'s not like I\'m adding it because it looks like a cat!',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她嘴上数落着，却动作极其利落地把那块黑猫海绵塞进了篮子里，耳朵尖微微泛红。',
            en: 'Though scolding you, she briskly tucked that black cat sponge into the basket, the tips of her ears glowing slightly pink.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '接着，她像清点行囊的参谋官一样，领着你把衣架、小垃圾桶、封口夹、甚至洗碗手套一一挑齐。',
    en: 'Next, like a quartermaster checking provisions, she guided you to round up coat hangers, a mini trash bin, bag sealing clips, and rubber dishwashing gloves.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_curious.webp`,
    zh: '在收银台附近的货架前，奈绪的神情忽然变得格外庄重，从挂钩上取下一包印有绿色字样的透明塑料袋。',
    en: 'Near the cash register racks, Nao\'s expression abruptly turned solemn as she retrieved a pack of clear plastic bags printed with green typography.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: 'これ！一番大事なやつ！神戸市指定のゴミ袋！',
    words: [
      { jp: '分別', reading: 'ぶんべつ', zh: '垃圾分类', en: 'waste sorting / separation' },
      { jp: '指定ごみ袋', reading: 'していごみぶくろ', zh: '指定垃圾袋', en: 'designated garbage bag' }
    ],
    zh: '这个！最关键、最要命的东西！神户市的指定垃圾袋！',
    en: 'This! The most critical, life-and-death item! Kobe City\'s designated garbage bags!',
    color: 'bg-emerald-500'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: '燃えるゴミはこれに入れんと絶対に回収してくれへん。あと、ペットボトル！ラベル剥がして、キャップ外して、洗って潰す！ここまでやって初めて捨てられんねん。',
    words: [
      { jp: 'ラベル', reading: 'ラベル', zh: '标签、包装膜', en: 'label / wrapper' },
      { jp: 'キャップ', reading: 'キャップ', zh: '瓶盖', en: 'bottle cap' }
    ],
    zh: '可燃垃圾不装进这个专用袋子里，环卫车看都不会看一眼。还有，喝完的塑料瓶！必须撕掉塑料标签，拧下瓶盖，洗干净踩扁！做到这步才能扔！',
    en: 'If combustible trash is not in this specific bag, the sanitation truck will not even look at it. And plastic bottles! Strip the plastic label, unscrew the cap, rinse and crush it! Only then can you throw it out!',
    color: 'bg-emerald-500'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_angry.webp`,
    jp: '海風荘のゴミステーションな、毎朝大家のおばあちゃんが見回ってんねんで？分別ミスったら黄色い警告シール貼られて部屋番号晒されるから覚悟しぃや！',
    words: [
      { jp: '見回る', reading: 'みまわる', zh: '巡视、巡查', en: 'patrol / inspect' },
      { jp: '晒す', reading: 'さらす', zh: '曝光、公示', en: 'expose / publicly display' }
    ],
    zh: '海风庄楼下的垃圾投放处，房东奶奶每天早晨都会戴着白手套巡视的！要是分类错了，袋子上会被贴黄色警告贴纸，还会被当众退回，你可给我警惕点！',
    en: 'The garbage station beneath Umikaze-so is inspected every morning by the landlady with white gloves! If you mess up sorting, a yellow warning sticker gets slapped on it, so you better stay alert!',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '你脑海中瞬间浮现出房东奶奶冷酷撕开垃圾袋检查瓶盖的威严画面，后背不由得冒出一层冷汗，连连点头把每一条规矩刻进脑子里。',
    en: 'An intimidating mental image of the landlady sternly tearing open a bag to check for bottle caps sends a prickle of cold sweat down your neck. You nod repeatedly, etching every rule into memory.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_happy.webp`,
    jp: 'あと最後に……百円玉！あんたの財布に常に何枚か入れとき。海風荘の乾燥機も、坂道の自販機も、全部百円玉やからな。万札なんか夜の坂道ではただの紙切れやで。',
    zh: '最后一条……百元硬币！钱包里永远多留几枚。海风庄的烘干机、坡道半当中的自动售货机，全认百元硬币。到了半夜口渴，一万日元大钞在自动贩卖机前就是废纸一张。',
    en: 'And one last thing... 100-yen coins! Always keep a few in your wallet. The dryers at Umikaze-so, the vending machines on the slope — they only take 100-yen coins. Come midnight thirst, a 10,000-yen bill is just scrap paper in front of a machine.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '结完账出来，天色已经完全浸入了温暖而深邃的薄暮。',
    en: 'By the time you finish checking out and step outside, dusk has deepened into a warm, rich amber twilight.'
  },
  {
    type: 'narration',
    zh: '三宫商店街两旁的灯笼与霓虹招牌次第亮起，下班的白领与放学的学生络绎不绝。空气中满是居酒屋烤串的焦香与微凉的春末海风。',
    en: 'Lanterns and neon signs across Sannomiya arcade illuminate one by one, with returning commuters and schoolkids bustling past. The crisp late-spring sea breeze blends with the savory aroma of yakitori skewers.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_happy.webp`,
    zh: '奈绪一只手提着业务超市沉甸甸的菜袋，另一只手高高举起那包刚刚买到的多色厨房海绵，迎着黄昏商业街温暖的灯光回过头来。',
    en: 'Nao clutches the heavy grocery bag from Gyomu in one hand, while high in the other she proudly brandishes the colorful pack of kitchen sponges, turning back beneath the arcade\'s warm lanterns.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_happy.webp`,
    jp: '聴きや、一人暮らしの第一歩は『百均』を制することやで！……どう？ウチ、めっちゃ頼れるお姉ちゃんやろ！',
    zh: '听好了，在这座城市一个人生活，第一步就是把百元店征服！……怎么样？本小姐今天是不是超级可靠、超级像你姐姐！',
    en: 'Listen up, living alone in this city begins with conquering the 100-yen shop! ...Well? Am I not the most reliable big sister ever today!',
    color: 'bg-emerald-500'
  },
  {
    // 🎨 专属剧情 CG：黄昏街头的百元店向导
    type: 'cg',
    cgId: 'cg_nao_shopping_dusk',
    imageUrl: '/images/cg/cg_nao_shopping_dusk.webp',
    titleZh: '黄昏街头的百元店向导',
    titleEn: 'The 100-Yen Guide at Dusk',
    captionZh: '「听好了，在这座城市一个人生活，第一步就是把百元店征服！」在暮色渐浓的三宫街头，她拎着装满食材的塑料袋，神气活现地举着海绵向你传授独居秘籍。那一刻，她比任何人都更像一位可靠的领路人。',
    captionEn: '"Listen up, living alone in this city begins with conquering the 100-yen shop!" On the dusk-lit Sannomiya street, grocery bag in hand, she proudly brandishes a kitchen sponge. In that moment, she looked more reliable than anyone else.'
  },
  {
    type: 'choice',
    promptZh: '看着黄昏光晕里神采飞扬的奈绪，你……',
    promptEn: 'Looking at Nao radiant in the dusk light, you...',
    options: [
      {
        id: 'nao_respect_mentor',
        labelZh: '一本正经地向她鞠躬：「受教了，奈绪老师。」',
        labelEn: 'Bow formally: "I have learned much, Master Nao."',
        jp: '大変勉強になりました、奈緒先生。',
        hintZh: '配合她的表演', hintEn: 'Play along with her act.',
        relations: [{ char: CharacterId.NAO, familiarity: 8, affection: 6, reasonZh: '你的恭敬让她尾巴翘到了天上', reasonEn: 'Your respect sent her pride soaring to the heavens' }],
        effects: [{ stat: 'charm', amount: 1, reasonZh: '展现了恰到好处的幽默感', reasonEn: 'Showed tasteful humor' }],
        then: [
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_happy.webp`,
            jp: '先生言うな！……ふふん、まあええわ。その素直さに免じて、次もいろいろ教えてあげんこともないで！',
            zh: '别叫老师啦！……哼哼，不过看在你态度这么诚恳的份上，下次本小姐勉为其难再带带你也不是不行！',
            en: 'Don\'t call me Master! ...Heh, fine then. In light of your honest submission, I suppose I wouldn\'t mind teaching you a few more tricks next time!',
            color: 'bg-emerald-500'
          }
        ]
      },
      {
        id: 'nao_praise_year',
        labelZh: '看着她的眼睛，认真地说：「这一年里，你一个人很不容易吧。」',
        labelEn: 'Look into her eyes and say softly: "It couldn\'t have been easy on your own this whole year."',
        jp: '……この一年、一人でよう頑張ったな、奈緒。',
        hintZh: '触碰到她坚强外表下的柔软', hintEn: 'Touch the softness beneath her brave front.',
        relations: [{ char: CharacterId.NAO, familiarity: 10, affection: 12, reasonZh: '你真正看见了她独自走过的路', reasonEn: 'You truly saw the solitary road she had walked' }],
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '温柔地抚平了童年玩伴藏在心底的孤单', reasonEn: 'Gently soothed the loneliness tucked away inside your childhood friend' }],
        then: [
          {
            type: 'narration',
            characterImage: `${N}knit_curious.webp`,
            zh: '奈绪举着海绵的手僵了一下。她睁大眼睛看着你，似乎完全没料到你会在这种时候说出这句话。',
            en: 'Nao\'s hand holding the sponge freezes midair. Her eyes widen as she gazes at you, clearly having never anticipated those words right now.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_shy.webp`,
            jp: '……何よ、急に。……最初はな、ゴミの分別も知らんくて、警告シール貼られてアパートの階段で泣きそうになったりしたわ。',
            zh: '……干嘛啦，突然没头没脑地说这个。……刚来那会儿啊，我确实连分类都搞不明白，第一次被贴警告贴纸的时候，蹲在公寓楼梯上差点哭出来呢。',
            en: '...What\'s this, all of a sudden? ...At first, yeah, I didn\'t know waste sorting either. The first time a yellow sticker got slapped on my bag, I almost cried on the apartment stairs.',
            color: 'bg-emerald-500'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${N}knit_shy.webp`,
            jp: '……でも、もう平気やし。それに……今は、あんたもおるしな。',
            zh: '……不过，现在早就习惯了。而且……现在，你不是也来了嘛。',
            en: '...But I\'m totally fine now. Besides... now, you\'re here too.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '最后那半句话她说得极轻，轻得几乎被商业街广播里的爵士萨克斯旋律盖了过去。但她的耳朵彻底红透了，飞快地扭过头去。',
            en: 'That last half-sentence was murmured so softly it was almost swallowed by the jazz saxophone playing over the arcade speakers. But her ears had turned completely crimson as she hastily looked away.'
          }
        ]
      }
    ]
  },
  {
    type: 'scene', scene: 'kitano_slope_night', bgm: 'night',
    titleZh: '北野坂 · 夜幕', titleEn: 'Kitano Slope · Nightfall',
    subtitleZh: '晚 6:00', subtitleEn: '6:00 PM'
  },
  {
    type: 'narration',
    zh: '沿着北野坂往上爬的时候，街边的复古煤气路灯已经全部亮起，泛着温润的橘黄光晕。神户港的夜景在身后的坡道尽头一点点展开，波光粼粼。',
    en: 'As you climb Kitano-zaka, the vintage gas street lamps have illuminated into soft amber halos. Kobe harbour\'s night view unrolls in sparkling ripples behind you at the foot of the hill.'
  },
  {
    type: 'narration',
    characterImage: `${N}knit_neutral.webp`,
    zh: '奈绪走在你身边，忽然伸手把装着大葱和调料的那只较重的袋子拽到了自己手里。',
    en: 'Walking beside you, Nao suddenly reaches out and tugs the heavier bag carrying green onions and soy sauce over to her side.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${N}knit_neutral.webp`,
    jp: '言うたやろ、あんたの持ち方は手ぇ痛めるって。一人で全部持とうとすんな、分担や。',
    zh: '我说了吧，你那么拎袋子手指会被勒坏的。别总想着一个人逞强全扛着，分摊才是正确的做法。',
    en: 'I told you, gripping like that will wreck your fingers. Don\'t always try to play tough and carry everything alone. Sharing the load is the right way.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '夜风吹动着塑料袋发出沙沙的声响，里面装着今晚的食材，还有印着「Can★Do」的全新百元生活用品。',
    en: 'The evening breeze rustles the plastic bags softly, filled with tonight\'s fresh ingredients and brand-new 100-yen essentials stamped with "Can★Do".'
  },
  {
    type: 'narration',
    zh: '坡道依然很长，但手里的重量却并不沉重。在这个举目无亲的陌生海港城市里，回到海风庄的路，忽然有了让人心安的温度。',
    en: 'The uphill climb remains long, yet the weight in your hands feels far from heavy. In this unfamiliar port town far from home, the road back to Umikaze-so suddenly feels warm and welcoming.'
  },
  {
    type: 'effect',
    effects: [
      { stat: 'kindness', amount: 3, reasonZh: '有人手把手教你如何在这座城市扎根', reasonEn: 'Somebody taught you by hand how to plant your roots in this city' },
      { stat: 'proficiency', amount: 2, reasonZh: '掌握了日本独居生活与百元店的实用生存常识', reasonEn: 'Mastered practical survival knowledge of Japanese living and 100-yen shops' }
    ],
    setFlags: ['day2_nao_done', 'nao_hyakkin_guide_done']
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
    type: 'narration', characterImage: `${S}neutral.webp`,
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
            type: 'narration', characterImage: `${S}happy.webp`,
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
            type: 'narration', characterImage: `${S}neutral.webp`,
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
    // 她说的是"四点开始一直空着"——那是放学后，不是夜里。
    // 以前这里写的是 night，于是跟奈绪逛完百元店、天一黑回到大厅，
    // 体育馆四点二十那一场就接着自己演了起来。
    id: 'day2_sora', month: 4, day: 12, slot: 'afternoon',
    // 只有第一天真的去了体育馆，她才说过这句话
    requiresFlags: ['day1_route_gym'],
    titleZh: '四点以后', titleEn: 'After Four',
    script: SORA_GYM
  }
];

// ---------------------------------------------------------
// 两个约撞在同一个下午
//
// 走过体育馆那条线的玩家，4/12 放学后同时欠着两个人：
// 奈绪在三宫站等，空在体育馆等。两边都是"四点"。
// 以前两段会一前一后全演掉——人不可能同时在两个地方，
// 玩家看到的就是"刚跟奈绪逛完百元店，莫名其妙又在体育馆投篮"。
//
// 现在让玩家选。没去的那一边不会凭空消失：她会发来一条消息，
// 而这件事也会留在她对你的记忆里。
// ---------------------------------------------------------
export interface DuePromise {
  id: string;
  titleZh: string; titleEn: string;
  script: StoryNode[];
}

export const promiseScriptFor = (
  month: number, day: number, slot: string, flags: Record<string, boolean>
): DuePromise | null => {
  const due = DAY2_PROMISES.filter(p =>
    p.month === month && p.day === day && p.slot === slot
    && !flags[`${p.id}_done`]
    && (!p.requiresFlags || p.requiresFlags.every(f => flags[f])));
  if (!due.length) return null;
  if (due.length === 1) {
    const p = due[0];
    return { id: p.id, titleZh: p.titleZh, titleEn: p.titleEn, script: [...p.script, { type: 'effect', setFlags: [`${p.id}_done`] }] };
  }
  const nao = due.find(p => p.id === 'day2_nao')!;
  const sora = due.find(p => p.id === 'day2_sora')!;
  return {
    id: 'day2_clash',
    titleZh: '两个约，一个下午', titleEn: 'Two promises, one afternoon',
    script: [
      { type: 'scene', scene: 'school_entrance_lockers', bgm: 'chat', titleZh: '鞋柜前', titleEn: 'The shoe lockers', subtitleZh: '下午 3:50', subtitleEn: '3:50 PM' },
      { type: 'narration', zh: '换鞋的时候手机震了两下。两条消息，前后差了不到十秒。', en: 'Your phone buzzes twice while you change shoes. Two messages, less than ten seconds apart.' },
      {
        type: 'phone', savedAsZh: '小奈绪', savedAsEn: 'Nao-chan', avatar: '/images/phone/nao.webp',
        lines: [{ jp: '四時、駅な。忘れてへんやろな', zh: '四点，车站。没忘吧', en: 'Four, the station. You have not forgotten' }]
      },
      {
        type: 'phone', savedAsZh: '空（篮球）', savedAsEn: 'Sora (basketball)', avatar: '/images/phone/sora.webp',
        lines: [{ jp: '体育館、今日も四時から空いとる', zh: '体育馆，今天也是四点开始空着', en: 'The gym is free from four again today' }]
      },
      { type: 'narration', zh: '两个"四点"。一个在山下的车站，一个就在你身后那栋楼里。你只有一双腿。', en: 'Two fours. One at the station at the bottom of the hill, one in the building right behind you. You only have the one pair of legs.' },
      {
        type: 'choice',
        promptZh: '去哪边？', promptEn: 'Which one?',
        options: [
          {
            id: 'clash_pick_nao',
            labelZh: '下山，去三宫站找奈绪', labelEn: 'Down the hill to Nao at the station',
            hintZh: '昨天先约的是她', hintEn: 'She asked first',
            setFlags: ['day2_sora_done', 'day2_sora_missed'],
            then: [...nao.script, { type: 'effect', setFlags: ['day2_nao_done'] }]
          },
          {
            id: 'clash_pick_sora',
            labelZh: '回头，去体育馆找空', labelEn: 'Turn round, the gym and Sora',
            hintZh: '她说"不是在等"的时候，听起来就是在等', hintEn: 'When she said she was not waiting, she sounded like she was',
            setFlags: ['day2_nao_done', 'day2_nao_missed'],
            then: [...sora.script, { type: 'effect', setFlags: ['day2_sora_done'] }]
          }
        ]
      }
    ]
  };
};

export const promiseDue = (
  month: number, day: number, slot: string, flags: Record<string, boolean>
): PromiseDef | null =>
  DAY2_PROMISES.find(p =>
    p.month === month && p.day === day && p.slot === slot
    && !flags[`${p.id}_done`]
    && (!p.requiresFlags || p.requiresFlags.every(f => flags[f]))
  ) || null;
