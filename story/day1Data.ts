import { SCHOOL_NPC_SPRITES } from '../constants';
import { StoryNode, CharacterId } from '../types';
import {
  DAY1_GYM, DAY1_LIBRARY, DAY1_ARCADE, DAY1_EVENING,
  DAY1_CAMEO_AFTER_GYM, DAY1_CAMEO_AFTER_LIB, DAY1_CAMEO_AFTER_ARC, DAY1_LEAVING
} from './day1Afterschool';

// ---------------------------------------------------------
// 【第 1 章：开学第一天】4 月 11 日 · 火 · 晴
//
// 序章 = 4/10 抵达当晚。这一章 = 开学。自由游玩从 4/12 开始。
//
// 结构刻意和序章同构：固定主线 + 一个决定性分叉（放学后）+ 收尾。
//
// ⚠️ 与序章的衔接
// 序章可能已经让玩家正式认识了 深雪(必遇) / 铃 / 光 / 真希 中的一两个，
// 所以这几个人的"第一次见面"必须按 flag 分叉，不能写死成初遇：
//   prologue_greeted_miyuki / prologue_nodded_miyuki / prologue_avoided_miyuki
//   prologue_met_hikari / prologue_glimpsed_hikari
//   prologue_met_rei / prologue_met_maki
// 明日香序章里不出场，所以她这里是干净的初遇（对齐她的 firstMeeting 脚本）。
//
// 教室自我介绍那一场专门回收序章便利店的 prologue_checkout_* ——
// 你昨晚在收银台用的是关西腔、标准语还是手势，
// 决定你今天第一次在全班面前开口的样子。
// ---------------------------------------------------------

const MIYUKI = '/images/characters/miyuki/';
const HIKARI = '/images/characters/hikari/';
const ASUKA  = '/images/characters/asuka/';

export const DAY1_SCRIPT: StoryNode[] = [

  // ==========================================================
  // 【Scene 1】早晨 · 201 室
  // ==========================================================
  {
    type: 'scene',
    scene: 'apartment_room',
    bgm: 'lobby',
    titleZh: '第 1 章 · 開學第一天',
    titleEn: 'Chapter 1 · The First Day',
    subtitleZh: '4 月 11 日 · 火曜日 · 晴',
    subtitleEn: 'April 11 · Tuesday · Clear'
  },
  {
    type: 'narration',
    zh: '闹钟响之前你就醒了。天花板的木纹和昨天一样陌生，但今天你已经知道它在哪儿了。',
    en: 'You wake before the alarm. The grain of the ceiling is as unfamiliar as it was yesterday, but today at least you know where it is.'
  },
  {
    type: 'narration',
    zh: '深蓝色的制服挂在衣柜门上。领口的银色校徽昨晚别了三次才别正。',
    en: 'The navy uniform hangs on the wardrobe door. It took three tries last night to pin the silver crest straight.'
  },
  {
    type: 'narration',
    zh: '你把外公那本手账塞进书包侧袋。它在那儿放着不干什么，但你昨天也是这么塞的。',
    en: 'You slide your grandfather’s journal into the side pocket of your bag. It does nothing sitting there, but you put it there yesterday too.'
  },
  // ---- 铺垫：奈绪从昨晚开始就在刷屏 ----
  {
    type: 'narration',
    zh: '手机在桌上震了一下。',
    en: 'Your phone buzzes on the desk.'
  },
  {
    // 这十七条以前是用旁白复述的。念给玩家听，远不如让他自己看。
    type: 'phone',
    savedAsZh: 'なおちゃん', savedAsEn: 'Nao-chan',
    avatar: '/images/avatars/nao.webp',
    lines: [
      { jp: 'ついた？', zh: '到了吗？', en: 'Are you there yet?', time: '23:01' },
      { jp: 'ついた？？', zh: '到了吗？？', en: 'Are you there yet??' },
      { jp: 'なんで返さへんの', zh: '怎么不回啊', en: 'Why are you not answering' },
      { jp: 'あ、まだ飛行機か。ごめん', zh: '啊，还在飞机上吧。抱歉', en: 'Ah, still on the plane. Sorry', time: '23:04' },
      { jp: '明日むかえ行くわ', zh: '明天我去接你', en: 'I will come and get you tomorrow' },
      { jp: 'てか学校どこ', zh: '话说你学校在哪', en: 'Wait, where is your school' },
      { jp: 'ええわ自分で調べた', zh: '算了我自己查到了', en: 'Never mind, I looked it up' },
      { jp: '……これ大阪の学校ちゃう？', zh: '……这个是大阪的学校吧？', en: '...I think this one is in Osaka?' },
      { jp: '坂の下で待っとくで。米、買うたし。', zh: '放学在坡道下面等你。米，我买了。', en: 'I will wait at the bottom of the slope. I bought rice.', time: '06:40' }
    ],
    afterZh: '十七条。最后一条是今天早上六点四十的。',
    afterEn: 'Seventeen of them. The last one came in at twenty to seven this morning.'
  },
  {
    type: 'narration',
    zh: '你昨天下午两点就落地了。而且你没有告诉过她你住哪条坡道，也没有告诉过她你家没有米。',
    en: 'You landed at two in the afternoon the day before. And you never told her which slope you live on, or that there was no rice in the flat.'
  },
  {
    type: 'narration',
    zh: '你把手机扣进口袋。回复留到中午吧，她现在肯定还在睡。',
    en: 'You put the phone face down in your pocket. You will reply at lunch. She is definitely still asleep.'
  },
  {
    type: 'narration',
    zh: '书包上肩的时候，你忽然从外面看了自己一眼。',
    en: 'As the bag settles onto your shoulder, you catch a glimpse of your own situation from the outside.'
  },
  {
    type: 'narration',
    zh: '转学生。开学第一天。一个人住。海边的坡道小城。四月，樱花刚好开到最满。',
    en: 'Transfer student. First day of term. Living alone. A hillside town by the sea. April, with the blossom timed to the day.'
  },
  {
    type: 'narration',
    zh: '……这个开局你见过。不止见过一次。',
    en: '...You have seen this opening before. More than once.'
  },
  {
    type: 'narration',
    zh: '你把手账翻到最后一页，在最上面写了一行：「即视感 · 计数」。下面记了第一条——转学生、第一天、海边、樱花。',
    en: 'You turn the journal to its last page and write a heading across the top: DEJA VU, A TALLY. Underneath goes the first entry: transfer student, first day, seaside, blossom.'
  },
  {
    type: 'narration',
    zh: '外公要是知道他的手账最后被这么用，大概会说点什么。但今天你需要点乐子。',
    en: 'Your grandfather would probably have had something to say about his journal ending up in this use. But today you need the entertainment.'
  },
  {
    type: 'effect',
    setFlags: ['day1_meta_list']
  },
  {
    type: 'choice',
    promptZh: '出门前还有五分钟。',
    promptEn: 'Five minutes before you have to go.',
    options: [
      {
        id: 'day1_review',
        labelZh: '把今天要用的自我介绍再默背一遍',
        labelEn: 'Run through your self-introduction one more time',
        hintZh: '「はじめまして」之后那句，昨晚练了二十遍',
        hintEn: 'The line after "hajimemashite". You practised it twenty times last night.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '把要说的话在嘴里过了一遍', reasonEn: 'You put the words through your mouth once more' }],
        setFlags: ['day1_rehearsed'],
        then: [
          {
            type: 'narration',
            zh: '你对着窗玻璃里的自己说了一遍。玻璃外面是海。声音抖，但一个音都没漏。',
            en: 'You say it once to your own reflection in the window. Behind the reflection is the sea. Your voice shakes, but you do not drop a syllable.'
          }
        ]
      },
      {
        id: 'day1_breakfast',
        labelZh: '好好吃完早饭再走',
        labelEn: 'Sit down and finish breakfast first',
        hintZh: '昨晚买的东西还剩一点',
        hintEn: 'There is still something left from last night.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有亏待自己的第一顿早饭', reasonEn: 'You did not shortchange yourself on the first breakfast' }],
        setFlags: ['day1_ate'],
        then: [
          {
            type: 'narration',
            zh: '你坐在窗边慢慢吃完。海面上有一艘船正往西开。等你吃完，它已经开出了视野。',
            en: 'You eat slowly by the window. A ship is heading west across the bay. By the time you finish, it has left the frame.'
          }
        ]
      },
      {
        id: 'day1_mirror',
        labelZh: '在镜子前把领带重打了三次',
        labelEn: 'Retie your tie three times in front of the mirror',
        hintZh: '第一天，总不能歪着进教室',
        hintEn: 'First day. You are not walking into that classroom crooked.',
        effects: [
          { stat: 'charm', amount: 1, reasonZh: '第一天的领带，你打得很认真', reasonEn: 'You took the first day’s tie seriously' },
          { stat: 'proficiency', amount: 1, reasonZh: '第三次终于打对了', reasonEn: 'The third attempt finally came out right' }
        ],
        setFlags: ['day1_tie'],
        then: [
          {
            type: 'narration',
            zh: '第一次太松，第二次太紧，第三次总算对了。你退后半步。镜子里那个人穿着深蓝制服，领口别着银色校徽。',
            en: 'Too loose the first time, too tight the second. The third comes out right. You step back. The person in the mirror is wearing a navy uniform with a silver crest on the collar.'
          },
          {
            type: 'narration',
            zh: '「看上去像。」你在心里加了这四个字。书包在门口，你拎起来就走了。',
            en: '"Looks like one." You add that to it, silently. The bag is by the door. You pick it up and go.'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // 【Scene 2】走廊 · 202 室门口（深雪，按序章态度分叉）
  // ==========================================================
  {
    type: 'scene',
    scene: 'umikaze_exterior',
    bgm: 'lobby'
  },
  {
    type: 'narration',
    zh: '锁门的时候，隔壁 202 的门也开了。',
    en: 'As you lock your door, the door of 202 opens as well.'
  },
  // — 搭过话
  {
    type: 'branch',
    ifFlag: 'prologue_greeted_miyuki',
    then: [
      {
        type: 'speech',
        speakerZh: '深雪',
        speakerEn: 'Miyuki',
        characterImage: `${MIYUKI}happy.webp`,
        jp: 'あら、{name}さん。おはようございます。……制服、よくお似合いですよ。',
        words: [{ jp: '似合う', reading: 'にあう', zh: '合适、相称', en: 'to suit / to look good on' }],
        zh: '哎呀，{name}。早上好。……制服很合身呢。',
        en: 'Oh — good morning, {name}. ...That uniform suits you.',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '她记得你的名字。昨晚写在回覧板上那一次，她真的记住了。',
        en: 'She remembered your name. From the resident list last night — she actually kept it.'
      }
    ]
  },
  // — 只鞠过躬
  {
    type: 'branch',
    ifFlag: 'prologue_nodded_miyuki',
    then: [
      {
        type: 'speech',
        speakerZh: '深雪',
        speakerEn: 'Miyuki',
        characterImage: `${MIYUKI}neutral.webp`,
        jp: '……おはようございます。{name}さん、でしたね。',
        zh: '……早上好。是叫{name}，对吧。',
        en: '...Good morning. It was {name}, was it not.',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '她说名字的时候顿了半拍，像是在确认自己没记错。昨晚你们之间只有一个鞠躬，和写在纸上的三个字。',
        en: 'She pauses half a beat on the name, checking it against her memory. Last night the two of you exchanged one bow, and a name written on a page.'
      }
    ]
  },
  // — 别过脸
  {
    type: 'branch',
    ifFlag: 'prologue_avoided_miyuki',
    then: [
      {
        type: 'narration',
        characterImage: `${MIYUKI}neutral.webp`,
        zh: '她看见你了。开门的手停在半路。停完，她还是点了下头，很轻。',
        en: 'She sees you. Her hand stops halfway on the door. When it has stopped, she gives a small nod anyway.'
      },
      {
        type: 'speech',
        speakerZh: '深雪',
        speakerEn: 'Miyuki',
        characterImage: `${MIYUKI}neutral.webp`,
        jp: '……おはようございます。行ってらっしゃい。',
        words: [{ jp: '行ってらっしゃい', zh: '路上小心（送人出门）', en: 'said to someone leaving' }],
        zh: '……早上好。路上小心。',
        en: '...Good morning. Have a good day.',
        color: 'bg-sky-500'
      },
      {
        type: 'narration',
        zh: '昨晚你在便利店移开了视线。她显然记得。但她还是说了这句话。',
        en: 'You looked away from her in the shop last night. She clearly remembers that. She said it anyway.'
      }
    ]
  },
  // 兜底：跳过序章的人三个 flag 一个都没有，
  // 不补这一条的话走廊这场会整个空掉——门开了，然后什么都没发生。
  {
    type: 'branch',
    ifFlag: 'prologue_greeted_miyuki',
    not: true,
    then: [{
      type: 'branch',
      ifFlag: 'prologue_nodded_miyuki',
      not: true,
      then: [{
        type: 'branch',
        ifFlag: 'prologue_avoided_miyuki',
        not: true,
        then: [
          {
            type: 'narration',
            characterImage: `${MIYUKI}neutral.webp`,
            zh: '一位银发的女子拎着垃圾袋走出来，看见你，愣了一下。',
            en: 'A silver-haired woman comes out with a rubbish bag, sees you, and stops.'
          },
          {
            type: 'speech',
            speakerZh: '银发的女子',
            speakerEn: 'Silver-haired Woman',
            characterImage: `${MIYUKI}happy.webp`,
            jp: 'あら。……もしかして、二〇一号室の方？',
            zh: '哎呀。……难不成，是 201 室的那位？',
            en: 'Oh. ...Are you the one who moved into 201?',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你点头。她笑了一下，说了句「これからよろしくね」，就拎着袋子下楼了。',
            en: 'You nod. She smiles, says something about looking forward to having you around, and carries the bag downstairs.'
          },
          { type: 'effect', relations: [{ char: CharacterId.MIYUKI, familiarity: 8, reasonZh: '在走廊上打了个照面', reasonEn: 'You crossed paths in the corridor' }] }
        ]
      }]
    }]
  },
  {
    type: 'choice',
    promptZh: '她把垃圾袋换到另一只手上，像是还想说点什么，又像是在等你先开口。',
    promptEn: 'She shifts the rubbish bag to her other hand, as though there is more she might say, or as though she is waiting for you to go first.',
    options: [
      {
        id: 'day1_miyuki_ask_road',
        labelZh: '「请问……去学校走哪条路比较快？」',
        labelEn: '"Sorry — which way is quicker to the school?"',
        jp: 'あの、すみません。学校へは、どっちが近いですか。',
        words: [{ jp: '近い', reading: 'ちかい', zh: '近的', en: 'close / near' }],
        hintZh: '你其实昨晚已经在地图上看过三遍了',
        hintEn: 'You checked the map three times last night.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你先开的口', reasonEn: 'You spoke first' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 10, affection: 3, reasonZh: '她很高兴被问路', reasonEn: 'She was pleased to be asked' }],
        setFlags: ['day1_miyuki_road'],
        then: [
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${MIYUKI}happy.webp`,
            jp: '坂をまっすぐ下りて、二つ目の角を左。……でも、遠回りのほうをおすすめします。',
            words: [{ jp: '遠回り', reading: 'とおまわり', zh: '绕远路', en: 'the long way round' }],
            zh: '顺着坡一直下去，第二个路口左转。……不过，我更推荐绕远的那条。',
            en: 'Straight down the slope, then left at the second corner. ...Though I would recommend the long way.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你问为什么。她想了两秒，说：因为那条路上有樱花。',
            en: 'You ask why. She thinks for two seconds and says: because that one has the cherry trees.'
          }
        ]
      },
      {
        id: 'day1_miyuki_ask_trash',
        labelZh: '伸手：「我帮您拿下去吧。」',
        labelEn: 'Reach out: "Let me take that down for you."',
        jp: 'それ、下まで持っていきましょうか。',
        words: [{ jp: '持つ', reading: 'もつ', zh: '拿、带', en: 'to carry / to hold' }],
        hintZh: '袋子看着挺沉',
        hintEn: 'The bag looks heavy.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没等人开口就伸了手', reasonEn: 'You put your hand out before being asked' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 8, affection: 6, reasonZh: '她愣了一下才把袋子给你', reasonEn: 'It took her a moment to hand it over' }],
        setFlags: ['day1_miyuki_trash'],
        then: [
          {
            type: 'narration',
            characterImage: `${MIYUKI}neutral.webp`,
            zh: '她愣了一下。那半秒钟里，她的表情不是感激，更像是在确认自己有没有听错。',
            en: 'She blanks for half a second. In that half second her face is not gratitude; it is closer to checking whether she heard you correctly.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${MIYUKI}happy.webp`,
            jp: '……ありがとう。じゃあ、お言葉に甘えて。',
            words: [{ jp: '甘える', reading: 'あまえる', zh: '领受好意、不客气了', en: 'to accept an offer / to lean on someone' }],
            zh: '……谢谢。那，我就不客气了。',
            en: '...Thank you. Then I will take you up on it.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '袋子比看上去轻。你怀疑她本来就打算自己拿，只是不好意思拒绝。',
            en: 'The bag is lighter than it looked. You suspect she was always going to carry it, and simply could not bring herself to refuse.'
          }
        ]
      },
      {
        id: 'day1_miyuki_quiet',
        labelZh: '点个头就走。第一天，别添麻烦',
        labelEn: 'Nod and go. First day; do not be a nuisance',
        hintZh: '安全，但什么也没发生',
        hintEn: 'Safe. Also nothing happens.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你把注意力留给了今天要用的日语', reasonEn: 'You saved your attention for the Japanese you would need today' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 3, reasonZh: '她目送你下了楼', reasonEn: 'She watched you go down the stairs' }],
        then: [
          {
            type: 'narration',
            zh: '你点头，侧身让过。走到楼梯口的时候，你听见她在身后轻轻说了句「いってらっしゃい」。',
            en: 'You nod and step aside. At the top of the stairs you hear her say, quietly, behind you: have a good day.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '下楼的时候你在手账边上添了第二条：隔壁，年长，一个人住，做饭的量总是不对。',
    en: 'On the way down you add a second item in the margin: next door, older, lives alone, never gets the quantities right.'
  },
  {
    type: 'narration',
    zh: '你为自己感到一点点羞耻。但还是记下了。',
    en: 'You feel faintly ashamed of yourself. You keep it anyway.'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '「行ってきます」——这句你会说。你说完自己愣了一下：这是你到日本以后，第一次对人说这句话。',
    en: '"Itte-kimasu." That one you can say. And having said it, you catch yourself: it is the first time you have said it to anyone in this country.'
  },

  // ==========================================================
  // 【Scene 3】北野坡道
  // ==========================================================
  {
    type: 'scene',
    scene: 'kitano_slope',
    bgm: 'town',
    titleZh: '北野坡道',
    titleEn: 'The Kitano Slope',
    subtitleZh: '早上 7:43',
    subtitleEn: '7:43 AM'
  },
  {
    type: 'narration',
    zh: '推开公寓大门，风是从坡上下来的，带着一坡的落樱。一片粘在了你袖口上。',
    en: 'You push the front door open. The wind comes down the slope with a slope’s worth of petals in it. One sticks to your cuff.'
  },
  {
    type: 'narration',
    zh: '你走了大概三十米就停了一次——路边有一台自动贩卖机，卖的东西你一半没见过。你看了很久，最后没买。',
    en: 'Thirty metres on you stop for the first time. There is a vending machine at the kerb and you have not seen half of what is in it. You look for a while and buy nothing.'
  },
  {
    type: 'narration',
    zh: '又走了五十米，一只三花猫从围墙上跳下来，横穿马路。你站住等它过完，还目送了一段。',
    en: 'Fifty metres further a calico drops off a wall and crosses the road. You stand and let it, and then watch it go a while longer.'
  },
  {
    type: 'narration',
    zh: '路口有一块告示牌，上面的字你只认得三分之一。你站在那儿把它读完了，读到一半才发现旁边有人在等你让路。',
    en: 'There is a notice board at the junction and you can read about a third of it. You stand and get to the end of it, and halfway through notice somebody waiting for you to move.'
  },
  {
    type: 'narration',
    zh: '坡道拐弯的地方能看见海。你又停了一次。',
    en: 'You can see the sea from the bend in the slope. You stop again.'
  },
  {
    type: 'narration',
    zh: '你掏出手机看时间。七点四十三。',
    en: 'You get your phone out. Seven forty-three.'
  },
  {
    type: 'narration',
    zh: '开学式八点整。从这儿到校门口，昨天拖着行李箱走了十二分钟。',
    en: 'The ceremony is at eight. From here to the school gate took twelve minutes yesterday, with a suitcase.'
  },
  {
    type: 'choice',
    promptZh: '你伸手想拂掉，手指停在半空——',
    promptEn: 'You reach to brush it off. Your fingers stop halfway.',
    options: [
      {
        id: 'day1_petal',
        labelZh: '把花瓣夹进手账的扉页',
        labelEn: 'Press the petal into the front page of the journal',
        hintZh: '第一天嘛，总得留点什么',
        hintEn: 'It is the first day. Something ought to be kept.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你决定留下今天的一片证据', reasonEn: 'You decided to keep one piece of evidence of today' }],
        setFlags: ['day1_kept_petal'],
        then: [
          {
            type: 'narration',
            zh: '手账最前面那页原本是空的。现在有一片北野的樱花躺在上面。',
            en: 'The first page of the journal was blank. Now there is a Kitano petal lying on it.'
          }
        ]
      },
      {
        id: 'day1_run',
        labelZh: '7 时 43 分。拂掉花瓣，冲上坡道',
        labelEn: '7:43. Brush it off and run',
        hintZh: '第一天迟到可不太妙',
        hintEn: 'Being late on day one would not be ideal.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '一口气冲完了整条坡道', reasonEn: 'You took the whole slope in one go' }],
        setFlags: ['day1_ran'],
        then: [
          {
            type: 'narration',
            zh: '坡道比昨天拖着行李箱走的时候短得多。你到校门口的时候只喘了三口气。',
            en: 'The slope is far shorter than it was yesterday with a suitcase. You reach the gate three breaths short of fine.'
          }
        ]
      },
      {
        id: 'day1_toast',
        labelZh: '翻出昨晚剩的吐司叼上，试试传说中的转学生跑法',
        labelEn: 'Dig out last night’s leftover toast, bite down on it, and try the legendary transfer-student run',
        hintZh: '既然剧本都摆在这儿了，不试一下说不过去',
        hintEn: 'The script is right there. It would be rude not to.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '在一条没人认识你的坡道上放弃了体面', reasonEn: 'You gave up on dignity, on a slope where nobody knows you' },
          { stat: 'charm', amount: 1, reasonZh: '你还挺舍得对自己开玩笑', reasonEn: 'You are willing to be the joke, which counts for something' }
        ],
        setFlags: ['day1_toast_run'],
        then: [
          {
            type: 'narration',
            zh: '吐司是昨晚的，已经有点硬了。你叼着它冲上坡道，认认真真地在每个拐角减速——万一呢。',
            en: 'The toast is a night old and going stiff. You bite down and charge the slope, slowing conscientiously at every corner. Just in case.'
          },
          {
            type: 'narration',
            zh: '第四个拐角之后你放弃了。没有人撞上来，没有纸撒一地，只有一个拎着垃圾袋的大叔看了你一眼。',
            en: 'You give up after the fourth corner. Nobody walks into you, no paper goes everywhere. A middle-aged man with a rubbish bag gives you one look.'
          },
          {
            type: 'narration',
            zh: '你把吐司吃了。说实话，比预想的好吃一点。',
            en: 'You eat the toast. Honestly, it is better than expected.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '第三条：满坡的樱花、迎面的山风、上学要爬的坡。',
    en: 'Third entry: a slope full of blossom, a headwind off the hill, a climb to get to school.'
  },
  {
    type: 'narration',
    zh: '照这个走法，接下来该有人在拐角处撞上你，把一叠纸撒得满地都是。最好嘴里还叼着一片吐司。',
    en: 'At this rate somebody ought to walk into you at a corner next and put a stack of paper all over the floor. Ideally with a slice of toast in their mouth.'
  },
  {
    type: 'narration',
    zh: '你笑了一声，继续往上走。',
    en: 'You snort, and keep climbing.'
  },

  // ==========================================================
  // 【Scene 4】校门 · 第一块看得懂的牌子
  // ==========================================================
  {
    type: 'scene',
    scene: 'school_gate',
    bgm: 'town',
    titleZh: '港见高校 · 正门',
    titleEn: 'Minatomi High · Main Gate'
  },
  {
    type: 'narration',
    zh: '校门口立着一块崭新的白牌，上面几行黑字：',
    en: 'A fresh white sign stands at the gate, a few lines of black text on it:'
  },
  {
    type: 'narration',
    zh: '「新入生・編入生の皆さんへ / 国際交流室（本館二階・２０３）にて / ８時までに受付を済ませてください。」',
    en: '"New and transferring students: please complete registration at the International Exchange Room (Main Building, 2F, Room 203) by 8:00."',
    words: [
      { jp: '済ませる', reading: 'すませる', zh: '办完、了结', en: 'to finish / get done' },
      { jp: '受付', reading: 'うけつけ', zh: '登记处、接待', en: 'reception / registration' }
    ]
  },
  {
    type: 'narration',
    zh: '你在心里把这行字拆开。「済ませて」是「済ませる」的て形，前面接「までに」。合起来就是：八点之前，把手续办完。',
    en: 'You take the line apart in your head. "Sumasete" is the te-form of "sumaseru", and it follows "made ni": get it done by eight.'
  },
  {
    type: 'narration',
    zh: '教科书上背过无数遍的语法点，忽然变成了脚下的指路牌。这跟考试做对一道题不是一回事。这个国家刚才对你松了一道缝。',
    en: 'A grammar point you have drilled a hundred times has turned into a sign telling you where to go. It is hard to name the feeling. It is not the small thrill of getting a question right. It is this country opening a crack for you.'
  },
  {
    type: 'effect',
    effects: [{ stat: 'knowledge', amount: 1, reasonZh: '第一次在真实世界里读懂了一句日语', reasonEn: 'You read a real sentence in the real world, and it worked' }]
  },

  // ==========================================================
  // 【Scene 5】国际交流室 · 光（按序章分叉）
  // ==========================================================
  {
    type: 'scene',
    scene: 'international_office',
    bgm: 'lobby',
    titleZh: '本馆二楼 · 国际交流室',
    titleEn: 'Main Building 2F · International Exchange Room'
  },
  {
    type: 'narration',
    zh: '推开 203 的门，室内比想象中安静。负责的女老师递来三张表格和一支笔。',
    en: 'You push open the door of 203. It is quieter than you expected. The teacher on duty hands you three forms and a pen.'
  },
  {
    type: 'narration',
    zh: '第一张还算顺利。第二张最上面一栏让你的笔尖悬住了——「保証人との続柄」。这两个汉字你都认得，可组在一起是什么意思？',
    en: 'The first form goes fine. The top field of the second one stops your pen: "relationship to guarantor". You know both characters. Together they mean nothing to you.'
  },
  {
    type: 'narration',
    characterImage: `${HIKARI}school_angry.webp`,
    zh: '正当你盯着那一栏发愣，斜对面「啪」的一声，一个金发女生把笔重重拍在了桌上。',
    en: 'While you are staring at it, a pen slams down on the table across from you. A blonde girl.'
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}school_angry.webp`,
    jp: 'うわあああ、これ絶対おかしいって！「続柄」って何！？漢字は読めるのに意味が全然わかんない！',
    zh: '哇啊啊，这个绝对有问题吧！「続柄」是什么啦！？汉字明明认得，意思完全搞不懂！',
    en: 'Ugh, this cannot be right! What even is "tsuzukigara"? I can read the characters and I have no idea what they mean!',
    color: 'bg-amber-400'
  },
  {
    type: 'narration',
    zh: '她猛地抬头，琥珀色的眼睛正对上你的视线。',
    en: 'Her head comes up, and her amber eyes land squarely on yours.'
  },
  // — 序章港边正式认识过
  {
    type: 'branch',
    ifFlag: 'prologue_met_hikari',
    then: [
      {
        type: 'speech',
        speakerZh: '光',
        speakerEn: 'Hikari',
        characterImage: `${HIKARI}school_surprised.webp`,
        jp: '——あっ！{name}！うそ、同じ学校！？',
        zh: '——啊！{name}！骗人吧，同一所学校！？',
        en: '—Wait! {name}! No way, the same school?!',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        zh: '她整个人从椅子上弹起来，表格散了一桌。老师从眼镜上方看了她一眼。',
        en: 'She launches out of the chair, scattering forms across the table. The teacher looks at her over the top of her glasses.'
      },
      {
        type: 'speech',
        speakerZh: '光',
        speakerEn: 'Hikari',
        characterImage: `${HIKARI}school_happy.webp`,
        jp: '昨日の今日でこれ？もう運命やん。……あ、ごめん先生。',
        zh: '昨天才见过今天就这样？这不就是命运嘛。……啊，对不起老师。',
        en: 'We met yesterday and now this? That is fate, that is. ...Ah — sorry, sensei.',
        color: 'bg-amber-400'
      },
      { type: 'effect', relations: [{ char: CharacterId.HIKARI, familiarity: 10, affection: 3, reasonZh: '第二天就在同一间办公室里重逢', reasonEn: 'You turned up in the same room the very next day' }] }
    ]
  },
  // — 序章只擦肩而过
  {
    type: 'branch',
    ifFlag: 'prologue_glimpsed_hikari',
    then: [
      {
        type: 'narration',
        characterImage: `${HIKARI}school_surprised.webp`,
        zh: '她愣了半秒，眉头皱起来，像是在翻一本很乱的相册。',
        en: 'She stops for half a second, frowning, like someone flipping through a badly sorted photo album.'
      },
      {
        type: 'speech',
        speakerZh: '光',
        speakerEn: 'Hikari',
        characterImage: `${HIKARI}school_surprised.webp`,
        jp: '……あれ。あんた、どっかで……坂で、ぶつかりそうになった？',
        zh: '……欸。你，我是不是在哪儿……坡道上，差点撞上的那个？',
        en: '...Huh. Have I — did I nearly flatten you on a hill somewhere?',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        zh: '她想起来了。你也是。昨天傍晚，坡道口，一句「ごめんっ！」和一件黄色卫衣。',
        en: 'She has it. So do you. Yesterday evening, the foot of the slope, one shouted apology and a yellow hoodie.'
      },
      { type: 'effect', relations: [{ char: CharacterId.HIKARI, familiarity: 6, affection: 1, reasonZh: '她想起了坡道口那一下', reasonEn: 'She placed you from the near-miss on the slope' }] }
    ]
  },
  // — 完全没见过：原版初遇
  {
    type: 'branch',
    ifFlag: 'prologue_met_hikari',
    not: true,
    then: [
      {
        type: 'branch',
        ifFlag: 'prologue_glimpsed_hikari',
        not: true,
        then: [
          {
            type: 'speech',
            speakerZh: '金发的女生',
            speakerEn: 'Blonde Girl',
            characterImage: `${HIKARI}school_surprised.webp`,
            jp: '……あ。もしかして、そっちも止まってる？',
            zh: '……啊。难不成，你也卡在那儿了？',
            en: '...Oh. Are you stuck on it too?',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '你点了点头，把表格转过去给她看。她先是瞪大眼睛，紧接着「噗」地笑出了声，笑得肩膀直抖。',
            en: 'You nod and turn your form toward her. Her eyes go wide, and then she snorts with laughter, shoulders shaking.'
          },
          {
            type: 'speech',
            speakerZh: '金发的女生',
            speakerEn: 'Blonde Girl',
            characterImage: `${HIKARI}school_happy.webp`,
            jp: 'あはは！仲間だ！よかったー、私だけバカなのかと思った！',
            words: [{ jp: '仲間', reading: 'なかま', zh: '同伴、伙伴', en: 'comrade / one of us' }],
            zh: '啊哈哈！同伴！太好了——我还以为只有我一个笨蛋呢！',
            en: 'Ahaha! One of us! Oh thank god, I thought I was the only idiot!',
            color: 'bg-amber-400'
          },
          { type: 'effect', relations: [{ char: CharacterId.HIKARI, familiarity: 14, affection: 3, reasonZh: '在同一栏上卡住的两个人', reasonEn: 'Two people stuck on the same line of the same form' }] }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '两个人一起举手。老师笑着走过来解释：「続柄」问的是你和保证人之间是什么关系，写「祖父」就行。',
    en: 'You both put your hands up. The teacher comes over, smiling, and explains: "tsuzukigara" is simply your relationship to your guarantor. Write "grandfather".'
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}school_happy.webp`,
    jp: 'なるほどな。……ま、これから同じ船に乗ってる仲間ってことで！困ったらお互い様、な？',
    zh: '原来如此。……那，从今天起我们就是同一条船上的伙伴啦！有难同当，好吗？',
    en: 'Right, got it. ...Well then — same boat from here on. We bail each other out, yeah?',
    color: 'bg-amber-400'
  },
  {
    type: 'choice',
    promptZh: '她把表格叠好，忽然想起什么似的转过来。',
    promptEn: 'She folds her form and turns round as though something has just occurred to her.',
    options: [
      {
        id: 'day1_hikari_name',
        labelZh: '「同一条船的话，总得知道船上的人叫什么吧。」',
        labelEn: '"If we are in the same boat, I should probably know who else is in it."',
        jp: '同じ船に乗ってるなら、名前ぐらい知っておきたいです。',
        hintZh: '你先问了名字',
        hintEn: 'You ask her name first.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你把一句客套接成了一次自我介绍', reasonEn: 'You turned a pleasantry into an introduction' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 12, affection: 5, reasonZh: '她报名字的时候声音特别大', reasonEn: 'She said her name much too loudly' }],
        then: [
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_happy.webp`,
            jp: 'あ、そうやん！光！ひかりって書いて、光。覚えやすいやろ？',
            words: [{ jp: '光', reading: 'ひかり', zh: '光', en: 'light' }],
            zh: '啊，对哦！光！写作「光」，念ひかり。好记吧？',
            en: 'Oh, right! Hikari! Written with the character for light. Easy, right?',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '国际交流室很安静。她这一嗓子之后，靠窗那位老师抬头看了一眼，又低下去了。',
            en: 'The exchange room is quiet. After that, the teacher by the window looks up once and goes back to her papers.'
          }
        ]
      },
      {
        id: 'day1_hikari_howlong',
        labelZh: '「你也是留学生？来多久了？」',
        labelEn: '"You are an exchange student too? How long have you been here?"',
        jp: '君も留学生？　こっちに来て、どれくらい？',
        words: [{ jp: '留学生', reading: 'りゅうがくせい', zh: '留学生', en: 'exchange student' }],
        hintZh: '她刚才说「私だけバカなのかと」',
        hintEn: 'She just said she thought she was the only idiot here.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你问了一个能问出东西的问题', reasonEn: 'You asked a question that actually goes somewhere' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 10, affection: 6, reasonZh: '她答得比你问的多', reasonEn: 'She answered rather more than you asked' }],
        then: [
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_neutral.webp`,
            jp: '半年。……半年おってもな、こういう紙は毎回わからんねん。',
            zh: '半年。……住了半年也一样啊，这种纸每次都还是看不懂。',
            en: 'Six months. ...Six months in, and I still cannot read a form like this.',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '她说这句的时候笑着，但语速比刚才慢了半拍。',
            en: 'She is smiling when she says it, but half a beat slower than everything before.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_happy.webp`,
            jp: 'せやから、二人おったら二倍わかるようになるやろ！たぶん！',
            zh: '所以说嘛，两个人的话就能懂两倍了吧！大概！',
            en: 'Which is why two of us should understand twice as much! Probably!',
            color: 'bg-amber-400'
          }
        ]
      },
      {
        id: 'day1_hikari_boat',
        labelZh: '「这条船……有救生圈吗？」',
        labelEn: '"This boat... does it come with life jackets?"',
        jp: 'その船に……浮き輪はありますか。',
        words: [{ jp: '浮き輪', reading: 'うきわ', zh: '救生圈', en: 'life ring' }],
        hintZh: '她起了个比喻，你顺着往下接',
        hintEn: 'She started the metaphor. You might as well run with it.',
        effects: [
          { stat: 'charm', amount: 1, reasonZh: '你接住了别人抛过来的那个比喻', reasonEn: 'You caught the metaphor somebody threw at you' },
          { stat: 'guts', amount: 1, reasonZh: '第一次见面就敢开玩笑', reasonEn: 'You cracked a joke the first time you met someone' }
        ],
        relations: [{ char: CharacterId.HIKARI, familiarity: 11, affection: 7, reasonZh: '她笑到被老师看了一眼', reasonEn: 'She laughed hard enough to get looked at' }],
        then: [
          {
            type: 'narration',
            zh: '她愣了半秒。下一秒整个人趴到了桌子上，肩膀一抽一抽的。靠窗那位老师抬起头又低下去。今天第二次了。',
            en: 'She freezes for half a second. The next one she is face down on the desk with her shoulders going. The teacher by the window looks up and back down. Second time today.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_smug.webp`,
            jp: 'ないない！沈むときは一緒に沈むやつや！',
            words: [{ jp: '沈む', reading: 'しずむ', zh: '沉没、下沉', en: 'to sink' }],
            zh: '没有没有！这是要沉一起沉的那种船！',
            en: 'Nope! This is the kind where we go down together!',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '她自己又笑了一阵。笑完忽然就没声了。她低头把表格的边角捏了又捏，捏得很平。',
            en: 'She laughs at her own line for a while longer. Then the sound just stops. She looks down and works the corner of her form flat between her fingers.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_shy.webp`,
            jp: '……ええな、そういうん返してくれる人。半年で初めてやわ。',
            zh: '……不错嘛，会这样接话的人。来了半年，你是第一个。',
            en: '...That is nice, actually. Someone who throws it back. Six months here and you are the first.',
            color: 'bg-amber-400'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${HIKARI}school_happy.webp`,
    jp: 'ほな、これ出したら学生証もらいに行こ。写真、変な顔で写ってへんとええけどな。',
    words: [{ jp: '学生証', reading: 'がくせいしょう', zh: '学生证', en: 'student ID card' }],
    zh: '那，交完这个就去领学生证吧。希望照片上别是个怪表情。',
    en: 'Right, hand these in and then we go get our student cards. Here is hoping the photo is not a disaster.',
    color: 'bg-amber-400'
  },
  {
    type: 'effect',
    setFlags: ['day1_hikari_registered'],
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '两个人一起举了手', reasonEn: 'You put your hands up together' }]
  },

  // ==========================================================
  // 【Scene 5.5】事务室 · 领学生证
  // ==========================================================
  {
    // 这一场以前没换景，一路沿用上一场的背景和立绘——
    // 人已经走到一楼最里面的事务室了，画面还停在遇见光的地方。
    type: 'scene', scene: 'school_faculty_office', bgm: 'chat',
    titleZh: '事务室', titleEn: 'The Office',
    subtitleZh: '一楼最里面 · 十一点四十', subtitleEn: 'Far end of the ground floor · Twenty to twelve'
  },
  {
    // 空字符串 = 让上一场的立绘退场。不清的话明日香会一直站在事务室里。
    type: 'narration', characterImage: '',
    zh: '事务室在一楼最里面。窗口后面的老师从抽屉里翻出一张卡，对着名单看了两眼，推过来。',
    en: 'The office is at the far end of the ground floor. The clerk behind the window digs a card out of a drawer, checks it against a list, and slides it across.'
  },
  {
    type: 'narration',
    zh: '塑料覆膜还是新的，摸上去有点黏手。左边是你的照片——上周在领事馆门口那台机器里拍的，表情僵得像被谁按着。',
    en: 'The lamination is new and still slightly tacky. Your photograph is on the left: taken last week in the booth outside the consulate, wearing the expression of someone being held still.'
  },
  {
    type: 'speech',
    speakerZh: '事务室的老师', speakerEn: 'Office Clerk',
    jp: '名前のところ、確認して。間違ってたら今のうちやで。',
    words: [{ jp: '確認', reading: 'かくにん', zh: '确认', en: 'to check / confirm' }],
    zh: '名字那一栏，核对一下。有错的话趁现在。',
    en: 'Check the name line. If it is wrong, now is the time.',
    color: 'bg-slate-500'
  },
  {
    type: 'narration',
    zh: '你用拇指压着卡片的下缘去看那一行。覆膜上斜斜地划过一道反光，正好压在名字上。你换了个角度。',
    en: 'You hold the card by its lower edge and tilt it to read the line. A band of reflection lies across the lamination, directly over the name. You change the angle.'
  },
  {
    type: 'narration',
    zh: '没错。是你的名字。用这个国家的文字写出来，看着有点陌生，但确实是你。',
    en: 'It is right. It is your name, set in this country\u2019s script. It looks unfamiliar written that way, and it is still you.'
  },
  {
    type: 'choice',
    promptZh: '老师在等你把卡收好。',
    promptEn: 'The clerk is waiting for you to put it away.',
    options: [
      {
        id: 'day1_card_wallet',
        labelZh: '放进钱包最里面那一层',
        labelEn: 'Slide it into the innermost slot of your wallet',
        hintZh: '和外公那张旧照片放在一起',
        hintEn: 'Next to your grandfather\u2019s old photograph.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你把它和另一张重要的东西放在了一起', reasonEn: 'You put it next to the other thing that mattered' }],
        setFlags: ['day1_card_wallet'],
        then: [
          {
            type: 'narration',
            zh: '钱包里那一层原本只有外公的一张旧照片。现在多了一张你自己的。',
            en: 'That slot held one old photograph of your grandfather. Now there are two faces in it.'
          }
        ]
      },
      {
        id: 'day1_card_neck',
        labelZh: '挂在脖子上——反正这一周肯定要天天用',
        labelEn: 'Hang it round your neck; you will need it all week anyway',
        hintZh: '像个刚入职的人',
        hintEn: 'Like somebody on their first day at a job.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你决定让所有人都看得见你是这里的人', reasonEn: 'You decided to let everyone see you belong here' }],
        setFlags: ['day1_card_neck'],
        then: [
          {
            type: 'narration',
            zh: '卡套在胸前晃。走出事务室的时候，走廊上有个学长瞥了一眼，什么也没说。',
            en: 'The holder swings against your chest. On the way out an older student glances at it and says nothing.'
          }
        ]
      },
      {
        id: 'day1_card_look',
        labelZh: '再看一会儿',
        labelEn: 'Look at it a little longer',
        hintZh: '你其实是在看「港見高校」那四个字',
        hintEn: 'What you are actually looking at is the school\u2019s name.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你把学校的名字一个字一个字念了一遍', reasonEn: 'You read the school\u2019s name character by character' }],
        relations: [],
        setFlags: ['day1_card_look'],
        then: [
          {
            type: 'narration',
            zh: '「港見高校」。港，和见。昨天在校门口那块牌子上你见过一次，当时只认出了「高校」两个字。',
            en: '"Minatomi Koukou." The harbour, and to see. You saw it on the sign at the gate yesterday and could only pick out the last two characters of it.'
          },
          {
            type: 'narration',
            zh: '看得见港口的学校。你早上从二楼窗户往外看过一次。确实看得见。',
            en: 'A school from which the harbour can be seen. You looked out of a second-floor window this morning. It can.'
          },
          {
            type: 'speech',
            speakerZh: '事务室的老师', speakerEn: 'Office Clerk',
            jp: '……そんなにじっと見るもん、あんまりおらんけどな。',
            zh: '……很少有人会这么盯着它看的。',
            en: '...Not many people stare at it quite that hard.',
            color: 'bg-slate-500'
          }
        ]
      }
    ]
  },
  {
    // 卡片特写。这张图同时也是人格参数面板的主图——
    // 一个交换生身上最像"身份"的东西就是这张卡。
    type: 'cg',
    cgId: 'cg_student_id',
    imageUrl: '/images/ui/student_id.webp',
    titleZh: '学生证',
    titleEn: 'The Student ID',
    captionZh: '兵库县立港见高等学校，二年 B 组。照片上那个人剃着寸头，是上个月在国内拍的，那时候他还不知道自己会在这儿。',
    captionEn: 'Minatomi Senior High School, second year, class B. The boy in the photograph has a buzz cut and was photographed at home last month, when he did not yet know he would end up here.'
  },
  {
    type: 'effect',
    setFlags: ['day1_got_student_id'],
    effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你现在有一张能证明你属于这里的卡', reasonEn: 'You now hold a card that says you belong here' }]
  },
  {
    type: 'narration',
    zh: '回房间以后它会一直在书桌上。你随时可以再拿起来看。',
    en: 'From now on it lives on your desk. You can pick it up again whenever you like.'
  },

  // ==========================================================
  // 【Scene 6】二楼走廊转角 · 明日香（序章不出场，干净的初遇）
  // ==========================================================
  {
    type: 'scene',
    scene: 'school_lockers',
    bgm: 'lobby'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '光在楼梯口和你分了手——她的教室在三楼。你按老师给的指示往二年 B 班走，注意力全在门牌号上。',
    en: 'Hikari peels off at the stairwell; her classroom is on the third floor. You head for Class 2-B by the teacher’s directions, eyes on the door numbers.'
  },
  {
    type: 'narration',
    zh: '就在拐角处——',
    en: 'And at the corner—'
  },
  {
    type: 'narration',
    zh: '「ドンッ！」迎面撞上了一个人。对方怀里那叠讲义「哗」地散了一地。一头亮红色的双马尾在你眼前甩过。',
    en: 'You walk straight into someone. The stack of handouts in their arms goes everywhere. A flash of bright red twin-tails across your field of view.'
  },
  {
    type: 'speech',
    speakerZh: '红发的女生',
    speakerEn: 'Red-haired Girl',
    characterImage: `${ASUKA}angry.webp`,
    jp: '……ちょっと。前を見て歩きなさいよ。',
    zh: '……喂。走路看着点前面。',
    en: '...Excuse me. Watch where you are going.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '你连忙蹲下来帮她捡。指尖碰到同一张纸的瞬间，她抬起了头——一双深红色的眼睛，眉毛挑得很高。',
    en: 'You crouch to help. Your fingers touch the same sheet as hers, and she looks up: dark red eyes, one eyebrow already climbing.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${ASUKA}neutral.webp`,
    jp: '……あ。同じクラスの人、よね。出席簿で名前だけは見たことあるけど。',
    words: [{ jp: '出席簿', reading: 'しゅっせきぼ', zh: '点名册', en: 'class register' }],
    zh: '……啊。同班的人吧。我只在点名册上见过名字。',
    en: '...Ah. You are in my class. I have seen the name on the register, at least.',
    color: 'bg-red-600'
  },
  {
    type: 'choice',
    promptZh: '你手里还捏着半张讲义。今天早上那句玩笑正堵在喉咙口。',
    promptEn: 'You are still holding half a handout. This morning\u2019s joke is sitting right at the top of your throat.',
    options: [
      {
        id: 'day1_meta_say',
        labelZh: '\u300c……抱歉。不过我今天早上刚预言过这一幕。\u300d',
        labelEn: '"...Sorry. I predicted this exact scene this morning, though."',
        jp: '……すみません。実は今朝、この場面を予言したばかりで。',
        words: [{ jp: '予言', reading: 'よげん', zh: '预言', en: 'prediction' }],
        hintZh: '说出口就收不回来了',
        hintEn: 'There is no taking this one back.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你对一个刚认识三十秒的人说了实话', reasonEn: 'You told the truth to someone you had known for thirty seconds' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 14, affection: 4, reasonZh: '她第一次没接上话', reasonEn: 'For once she had no line ready' }],
        setFlags: ['day1_meta_said'],
        then: [
          {
            type: 'speech',
            speakerZh: '你', speakerEn: 'You',
            jp: '……すみません。でも今朝、この場面を予言したんです。',
            words: [{ jp: '予言', reading: 'よげん', zh: '预言', en: 'prediction / prophecy' }],
            zh: '……抱歉。不过我今天早上刚预言过这一幕。',
            en: '...Sorry. I did predict this exact scene this morning, though.',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            zh: '她捡纸的手停在半空。',
            en: 'Her hand stops halfway to the next sheet.'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${ASUKA}surprised.webp`,
            jp: '……はい？',
            zh: '……啊？',
            en: '...I beg your pardon?',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '你把手账最后一页翻给她看。三条整整齐齐地列在那儿，第四条你刚在心里写完：拐角、撞人、讲义满天飞。',
            en: 'You show her the last page of the journal. Three entries laid out in a neat column, and a fourth you had just finished writing in your head: corner, collision, handouts everywhere.'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${ASUKA}angry.webp`,
            jp: '……あのね。人を、そういう、記号みたいに数えるの、やめてくれる？',
            words: [{ jp: '記号', reading: 'きごう', zh: '符号、记号', en: 'sign / symbol' }],
            zh: '……我说你啊。别把人当成那种符号一条条数，行吗？',
            en: '...Listen. Could you stop counting people off like they were symbols?',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '她一边说一边把纸从你手里抽回去，耳朵尖有点红。',
            en: 'She pulls the sheets out of your hands as she says it. The tips of her ears have gone a little red.'
          },
          {
            type: 'speech',
            speakerZh: '明日香',
            speakerEn: 'Asuka',
            characterImage: `${ASUKA}neutral.webp`,
            jp: '……で。あと何個残ってるのよ、そのリスト。',
            zh: '……然后呢。那张清单，还剩几条。',
            en: '...So. How many are left on that list of yours.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '她问了。而且她自己好像没意识到自己问了。',
            en: 'She asked. And she does not appear to have noticed that she asked.'
          }
        ]
      },
      {
        id: 'day1_meta_swallow',
        labelZh: '咽回去，专心捡纸',
        labelEn: 'Swallow it and keep picking up paper',
        hintZh: '第一天，别把人吓跑',
        hintEn: 'Day one. Do not frighten anybody off.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你把一个只对自己好笑的笑话咽了回去', reasonEn: 'You swallowed a joke that was only funny to you' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 6, affection: 2, reasonZh: '你把纸按页码理好了才递过去', reasonEn: 'You put the pages back in order before handing them over' }],
        then: [
          {
            type: 'narration',
            zh: '你把最后一张纸递过去，什么也没说。',
            en: 'You hand over the last sheet without saying anything.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${ASUKA}neutral.webp`,
            jp: 'ありがとう。……次からは前見て歩きなさいよ。',
            words: [{ jp: '前', reading: 'まえ', zh: '前面', en: 'ahead / in front' }],
            zh: '谢谢。……下次记得看着前面走。',
            en: 'Thank you. ...Watch where you are going next time.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '第四条在心里记上了：拐角、撞人、讲义满天飞、红色双马尾。全中。',
            en: 'The fourth entry goes down in your head anyway: corner, collision, handouts everywhere, red twin-tails. Full marks.'
          }
        ]
      },
      {
        id: 'day1_meta_blame',
        labelZh: '先道歉，再指出她也在跑',
        labelEn: 'Apologize first — then point out that she was running too',
        jp: 'ごめん。……でも、そっちも走ってたよね。',
        hintZh: '这个拐角是两个人一起撞出来的',
        hintEn: 'It took two people to make that corner happen.',
        effects: [
          { stat: 'knowledge', amount: 1, reasonZh: '你看清了刚才那三秒里真正发生的事', reasonEn: 'You worked out what had actually happened in those three seconds' },
          { stat: 'guts', amount: 1, reasonZh: '你没有把不属于自己的那一半也认下来', reasonEn: 'You declined to take on the half that was not yours' }
        ],
        relations: [{ char: CharacterId.ASUKA, familiarity: 10, affection: 3, reasonZh: '她被顶回来了，而且没有生气', reasonEn: 'She got pushed back on, and did not mind' }],
        setFlags: ['day1_meta_pushed_back'],
        then: [
          {
            type: 'speech',
            speakerZh: '你', speakerEn: 'You',
            jp: 'すみませんでした。……でも、そっちも走ってましたよね。',
            words: [{ jp: '走る', reading: 'はしる', zh: '跑', en: 'to run' }],
            zh: '非常抱歉。……不过，您刚才也在跑吧。',
            en: 'I am sorry. ...You were running too, though. Weren’t you.',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            zh: '空气停了大概两秒。她把手里那叠纸的边缘捏出了一道折痕。',
            en: 'The air stops for about two seconds. A crease appears along the edge of the stack in her hand.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${ASUKA}surprised.webp`,
            jp: '…………走ってたわよ。悪い？',
            zh: '…………我是在跑。有问题吗？',
            en: '............I was running. Is that a problem?',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '「有」和「没有」你都答不上来。你选择继续捡纸。',
            en: 'You have no answer to that in either direction. You go back to picking up paper.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${ASUKA}neutral.webp`,
            jp: '……ふん。まあ、そこで謝り倒さないだけマシね。',
            zh: '……哼。算了，起码没在那儿一个劲儿地赔不是，还行。',
            en: '...Hmph. Well. At least you did not just stand there apologizing on a loop.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '她说这句的时候没有看你。但递纸的时候，那份是从最上面抽的——没有一个折角。',
            en: 'She does not look at you when she says it. But the sheet she hands over comes off the top of the stack. Not a bent corner on it.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '她把散落的讲义在膝上「咚咚」地磕齐，站起身，抽出一份递给你。动作干脆得没有一丝多余。',
    en: 'She taps the handouts square against her knee, stands, and pulls one off the top for you. Not a wasted movement anywhere.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${ASUKA}neutral.webp`,
    jp: 'はい、これ。あなたの分。……先生が言ってたわ。日本語の授業についていけてない子がいるって。',
    zh: '给，这个。你那份。……老师说过。有个跟不上日语课的孩子。',
    en: 'Here. Yours. ...The teacher mentioned it. That there is someone who cannot keep up in Japanese class.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她说完这句，视线飞快地从你脸上移开，落到窗外的操场上。',
    en: 'Having said it, her eyes leave your face fast and settle on the sports ground outside.'
  },
  {
    type: 'speech',
    speakerZh: '明日香',
    speakerEn: 'Asuka',
    characterImage: `${ASUKA}shy.webp`,
    jp: '……別に、心配してるわけじゃないから。ただ、委員長として確認するだけ。',
    zh: '……我可不是在担心你。只是作为委员长确认一下而已。',
    en: '...It is not that I am worried. I am simply checking, as class president.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '预备铃在这时响了起来。',
    en: 'The warning bell goes at exactly that moment.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_asuka'],
    relations: [{ char: CharacterId.ASUKA, familiarity: 12, reasonZh: '在走廊拐角撞了个正着', reasonEn: 'A head-on collision at a corridor corner' }]
  },

  // ==========================================================
  // 【Scene 7】教室 · 自我介绍（回收序章便利店的选择）
  // ==========================================================
  {
    type: 'scene',
    scene: 'classroom_morning',
    bgm: 'lobby',
    titleZh: '二年 B 班',
    titleEn: 'Class 2-B'
  },
  {
    type: 'narration',
    zh: '「じゃあ、自己紹介を」——班主任说完就退到一边。三十几双眼睛同时转过来。',
    en: '"Go ahead and introduce yourself." The homeroom teacher steps aside. Thirty-odd pairs of eyes turn at once.'
  },
  {
    type: 'narration',
    zh: '你站在讲台边上。喉咙发紧。昨晚在便利店收银台前的那三秒钟，忽然又回来了。',
    en: 'You stand at the edge of the platform. Your throat closes. Those three seconds at the convenience store counter last night come back all at once.'
  },
  {
    type: 'narration',
    zh: '你扫了一眼教室。窗边倒数第二排空着一张桌子。你已经知道那是谁的了。第五条。',
    en: 'You scan the room. There is an empty desk by the window, second from the back. You already know whose it is. Fifth entry.'
  },
  {
    type: 'narration',
    zh: '你数到第四条的时候，发现自己的手不抖了。',
    en: 'Somewhere around the fourth item you notice your hands have stopped shaking.'
  },
  {
    type: 'choice',
    promptZh: '开口。',
    promptEn: 'Speak.',
    options: [
      {
        id: 'day1_intro_kansai',
        labelZh: '用关西腔说那句问候',
        labelEn: 'Greet them in Kansai-ben',
        jp: 'よろしゅう　おたのもうします。',
        hintZh: '昨晚那句「おおきに」之后，你查了一晚上',
        hintEn: 'After that "ookini" last night, you spent the evening looking things up.',
        requiresFlag: 'prologue_checkout_kansai',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '第一天就敢在全班面前用方言', reasonEn: 'Day one, and you used dialect in front of the whole class' },
          { stat: 'charm', amount: 1, reasonZh: '全班都笑了，但没有一个人在嘲笑你', reasonEn: 'The whole class laughed, and none of it was at you' }
        ],
        // 这是在全班面前说的，明日香和光都在场——以前这三个选项一点关系变化都没有。
        relations: [
          { char: CharacterId.HIKARI, familiarity: 4, affection: 2, reasonZh: '她在后排笑出了声', reasonEn: 'She laughed out loud from the back row' },
          { char: CharacterId.ASUKA, familiarity: 2, reasonZh: '她第一次正眼看了你一下', reasonEn: 'She looked at you properly for the first time' }
        ],
        setFlags: ['day1_intro_kansai'],
        then: [
          {
            type: 'narration',
            zh: '教室静了半秒。然后是笑声，从后排先起来的。有人拍了下桌子。',
            en: 'Half a second of silence. Then laughing, starting from the back rows. Somebody slaps a desk.'
          },
          {
            type: 'narration',
            characterImage: `${ASUKA}surprised.webp`,
            zh: '第三排靠窗那个红双马尾，笔停在半空，眉毛挑得比刚才在走廊还高。',
            en: 'Third row by the window, the red twin-tails: her pen has stopped in mid-air and that eyebrow is higher than it was in the corridor.'
          },
          { type: 'effect', relations: [{ char: CharacterId.ASUKA, familiarity: 6, affection: 4, reasonZh: '她没料到你敢这么开口', reasonEn: 'She did not expect you to open your mouth like that' }] }
        ]
      },
      {
        id: 'day1_intro_polite',
        labelZh: '一个字一个字，把标准的那句说完',
        labelEn: 'Say the textbook sentence, one word at a time',
        jp: 'はじめまして。今日からお世話になります。よろしくお願いします。',
        words: [{ jp: '世話', reading: 'せわ', zh: '照顾、关照', en: 'care / looking after' }],
        hintZh: '慢，但是完整',
        hintEn: 'Slow. But complete.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '在三十几个人面前把整句说完了', reasonEn: 'You finished the whole sentence in front of thirty people' },
          { stat: 'knowledge', amount: 1, reasonZh: '一个助词都没错', reasonEn: 'Not one particle out of place' }
        ],
        relations: [
          { char: CharacterId.ASUKA, familiarity: 4, affection: 2, reasonZh: '一个字都没有省，她注意到了', reasonEn: 'You did not cut a single corner, and she noticed' },
          { char: CharacterId.HIKARI, familiarity: 2, reasonZh: '她冲你比了个大拇指', reasonEn: 'She gave you a thumbs up' }
        ],
        setFlags: ['day1_intro_polite'],
        then: [
          {
            type: 'narration',
            zh: '你说得很慢。慢到能听见自己心跳。但你把整句说完了，一个助词都没错。',
            en: 'You speak slowly. Slowly enough to hear your own heartbeat. But you finish the sentence, and not one particle is wrong.'
          },
          {
            type: 'narration',
            characterImage: `${ASUKA}neutral.webp`,
            zh: '教室里安静了一下，然后有人鼓掌。第三排靠窗那个人没鼓掌——她在本子上写了点什么。',
            en: 'A beat of quiet, then someone claps. The girl in the third row by the window does not clap. She writes something in her notebook.'
          },
          { type: 'effect', relations: [{ char: CharacterId.ASUKA, familiarity: 5, affection: 2, reasonZh: '她记下了你能说到什么程度', reasonEn: 'She made a note of exactly how far you can get' }] }
        ]
      },
      {
        id: 'day1_intro_stuck',
        labelZh: '开了个头，然后卡住了',
        labelEn: 'Get the opening out, then stall',
        jp: 'はじめまして。……えっと、その、',
        hintZh: '排练过二十遍的句子，一个字都想不起来',
        hintEn: 'Twenty rehearsals, and not one word of it is there.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你在三十几个人面前把慌乱吞了下去', reasonEn: 'You swallowed the panic with thirty people watching' }],
        relations: [
          { char: CharacterId.HIKARI, familiarity: 3, affection: 3, reasonZh: '她是第一个鼓掌的', reasonEn: 'She was the first one to clap' },
          { char: CharacterId.ASUKA, familiarity: 1, reasonZh: '她没有笑，也没有移开视线', reasonEn: 'She did not laugh, and did not look away either' }
        ],
        setFlags: ['day1_intro_stuck'],
        then: [
          {
            type: 'narration',
            zh: '三秒。五秒。空气开始变重。',
            en: 'Three seconds. Five. The air starts to get heavy.'
          },
          {
            type: 'narration',
            characterImage: `${ASUKA}neutral.webp`,
            zh: '然后第三排有人清了清嗓子，声音不大不小，正好够全班听见：「——名前から、ゆっくりでいいわよ。」',
            en: 'Then someone in the third row clears her throat, at exactly the volume the whole room can hear: "Start with your name. Slowly is fine."'
          },
          {
            type: 'narration',
            zh: '你抬头。她根本没看你，正低头翻讲义，一脸「我什么都没说」。',
            en: 'You look up. She is not looking at you at all — she is flipping through handouts with the face of someone who said nothing.'
          },
          { type: 'effect', relations: [{ char: CharacterId.ASUKA, familiarity: 8, affection: 5, reasonZh: '她在全班面前替你接了一句', reasonEn: 'She covered for you in front of everyone' }] }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '你把名字说完了。班主任点点头，指了指窗边倒数第二排那张空桌。',
    en: 'You get your name out. The homeroom teacher nods and points at the empty desk by the window, second from the back.'
  },
  {
    type: 'narration',
    zh: '走过去的那七步里，你听见后排有人小声说了句「留学生や」，语气里没有恶意，只是好奇。',
    en: 'In the seven steps it takes to get there, you hear someone at the back say "exchange student" under their breath. There is no malice in it, only curiosity.'
  },
  {
    type: 'branch',
    ifFlag: 'day1_intro_stuck',
    then: [
      {
        type: 'narration',
        characterImage: `${ASUKA}neutral.webp`,
        zh: '你的座位就在明日香斜后方。坐下的时候你想说句谢谢，她已经把讲义竖起来挡住了半张脸。',
        en: 'Your seat turns out to be diagonally behind Asuka. As you sit down you mean to thank her; she has already raised her handouts to cover half her face.'
      },
      {
        type: 'speech',
        speakerZh: '明日香', speakerEn: 'Asuka',
        characterImage: `${ASUKA}neutral.webp`,
        jp: '……言っとくけど、あれは静かにしてほしかっただけだから。',
        zh: '……先说好，我刚才只是想让大家安静点而已。',
        en: '...For the record, I only wanted everyone to be quiet.',
        color: 'bg-red-600'
      },
      {
        type: 'narration',
        zh: '她没有回头。讲义在她手里翻得很快，快到不像在看。',
        en: 'She does not turn round. The handouts go past in her hands rather too fast for anyone to be reading them.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'day1_intro_stuck',
    not: true,
    then: [
      {
        type: 'narration',
        zh: '你坐下，把书包挂上桌侧的钩子。窗玻璃上映着自己的脸，看起来比想象中镇定。',
        en: 'You sit and hang your bag on the hook at the side of the desk. Your own face in the window looks steadier than you expected.'
      },
      {
        type: 'narration',
        characterImage: `${ASUKA}neutral.webp`,
        zh: '斜前方的明日香把讲义往后递的时候多看了你一眼。就一眼。她转回去的速度快得像是被抓到了。',
        en: 'Asuka glances at you as she passes the handouts back. Once. She faces front again fast enough to look like someone who has been caught.'
      }
    ]
  },
  {
    // characterImage: '' 清掉明日香。上一句给她挂了立绘，
    // 之后一路到课间都没清过，于是她在讲台边站了整整一节课。
    type: 'narration', characterImage: '',
    zh: '第一节课的铃响了。你在这间教室里有了一个位置。',
    en: 'The bell goes for first period. You have a place in this room now.'
  },

  // ---- 第一节课 ----
  //
  // 主角对日式课堂的第一印象。先轻敌，再被课本教做人——
  // 这一段的笑点全在那个落差上，所以中间不能有任何解释。
  {
    type: 'narration',
    zh: '藤原老师推门进来，全班起立、行礼、坐下，一气呵成。你慢了半拍，站起来的时候别人已经在坐下了。',
    en: 'Fujiwara-sensei comes in; the whole class stands, bows and sits in one motion. You are half a beat late and are still getting up as everybody else goes down.'
  },
  {
    type: 'narration',
    zh: '第一节是国语。老师在黑板上写下今天的课题，字很漂亮。',
    en: 'First period is Japanese. She writes the day\u2019s topic on the board in very neat handwriting.'
  },
  {
    type: 'narration',
    zh: '你环顾了一圈：没有人在做题，没有人在抢答，没有人被叫起来罚站。窗户开着，风进得来。',
    en: 'You look around. Nobody is grinding exercises, nobody is racing to answer, nobody has been stood up as punishment. The windows are open and the wind comes in.'
  },
  {
    type: 'narration',
    zh: '——这就是传说中的日式课堂吗。比国内轻松多了嘛。',
    en: '—So this is the fabled Japanese classroom. This is a great deal easier than back home.'
  },
  {
    type: 'narration',
    zh: '你带着一种很没道理的从容翻开了课本。',
    en: 'You open the textbook with an entirely unearned calm.'
  },
  {
    type: 'narration',
    zh: '「————」',
    en: '"————"'
  },
  {
    type: 'narration',
    zh: '一整页竖排。没有标点在你熟悉的位置上。认识的汉字有，但它们排在一起之后就不认识了。',
    en: 'A full page of vertical text. None of the punctuation is where you expect it. There are characters you know, and once they are placed next to each other you do not know them any more.'
  },
  {
    type: 'narration',
    zh: '你把课本转了个角度。没有用。',
    en: 'You turn the book slightly. It does not help.'
  },
  {
    type: 'narration',
    zh: '这一节课你唯一完全听懂的一句话，是下课铃。',
    en: 'The only thing you understand completely in that lesson is the bell at the end of it.'
  },

  // ==========================================================
  // 【Scene 7.5】课间 · 第一次被围住
  //
  // 转学生的第一个课间。热情是真的，听不懂也是真的。
  // 这一段刻意不给"顺利沟通"的选项——因为第一天本来就不该顺利。
  // ==========================================================
  {
    type: 'narration',
    characterImage: SCHOOL_NPC_SPRITES.kenta,
    zh: '第一节课下课铃响完的第四秒，你的桌子周围围了六个人。带头的是个晒得很黑的男生，一屁股坐在了你前桌的桌子上。',
    en: 'Four seconds after the bell ends first period, there are six people around your desk. The one leading them is a very tanned boy, who sits himself down on the desk in front of yours.'
  },
  {
    type: 'narration',
    characterImage: SCHOOL_NPC_SPRITES.aoi,
    zh: '一个短发女生从他背后探出头来，手里还举着手机，像是随时准备查什么。',
    en: 'A short-haired girl leans out from behind him with her phone already up, as though ready to look something up at any moment.'
  },
  {
    type: 'narration',
    characterImage: SCHOOL_NPC_SPRITES.hiroki,
    zh: '最外圈站着一个戴黑框眼镜的，没挤进来，但也没走。',
    en: 'On the outside of the ring stands one in black-framed glasses who has not pushed in and has not left either.'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '他们在笑，很热情，语速全开。你听懂的部分大概是这样的：',
    en: 'They are smiling, they are friendly, and they are talking at full speed. What reaches you is roughly this:'
  },
  {
    type: 'narration',
    zh: '「——から来たん？」「——え、ほんまに？」「——ってどんな感じ？」「——めっちゃ——やん！」',
    en: '"—where are you from?" "—wait, seriously?" "—what is it like—?" "—that is so—!"'
  },
  {
    type: 'narration',
    zh: '中间那些句子像是被人从中央挖掉了一块。你能抓到的只有语气。',
    en: 'The middles of the sentences have been scooped out. All you can catch is the tone.'
  },
  {
    type: 'choice',
    promptZh: '六张脸都在等你回答。你甚至不确定他们问的是不是同一个问题。',
    promptEn: 'Six faces are waiting. You are not even sure they all asked the same question.',
    options: [
      {
        id: 'day1_break_smile',
        labelZh: '笑。用力地笑，然后点头',
        labelEn: 'Smile. Smile hard, and nod',
        hintZh: '万能的、也毫无用处的那一招',
        hintEn: 'The universal solution, which solves nothing.',
        effects: [
          { stat: 'proficiency', amount: 1, reasonZh: '你把慌张藏得还算成功', reasonEn: 'You hid the panic reasonably well' }
        ],
        setFlags: ['day1_break_smiled'],
        then: [
          {
            type: 'narration',
            zh: '你笑了。他们也笑了。气氛非常好。没有任何信息被传递。',
            en: 'You smile. They smile. The mood is excellent. No information changes hands.'
          },
          {
            type: 'narration',
            zh: '有人拍了拍你的肩膀说了句什么，大家一起笑起来，你也跟着笑。你不知道自己在笑什么。',
            en: 'Somebody claps your shoulder and says something, and everyone laughs, and you laugh too. You do not know what you are laughing at.'
          },
          {
            type: 'narration',
            zh: '这大概是你今天做的最累的一件事。',
            en: 'This is probably the most tiring thing you do all day.'
          }
        ]
      },
      {
        id: 'day1_break_slow',
        labelZh: '请她再说一遍，说慢一点',
        labelEn: 'Ask her to say it again, slowly',
        jp: 'すみません、もう一度……ゆっくり、お願いします。',
        words: [{ jp: 'もう一度', reading: 'もういちど', zh: '再一次', en: 'once more' }],
        hintZh: '承认听不懂，比假装听懂难',
        hintEn: 'Admitting it is harder than faking it.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '你当着六个人的面承认自己没听懂', reasonEn: 'You admitted, in front of six people, that you had not understood' },
          { stat: 'knowledge', amount: 1, reasonZh: '慢速重复的那一遍，你真的听懂了', reasonEn: 'The slow repeat, you actually understood' }
        ],
        setFlags: ['day1_break_asked'],
        then: [
          {
            type: 'speech',
            speakerZh: '你', speakerEn: 'You',
            jp: 'すみません、もう一度……ゆっくり、お願いします。',
            words: [{ jp: 'ゆっくり', zh: '慢慢地', en: 'slowly' }],
            zh: '不好意思，再说一遍……请慢一点。',
            en: 'Sorry — one more time. Slowly, please.',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            zh: '六个人愣了半秒，然后同时开始用一种极其缓慢、每个音都断开的语速重新说了一遍。',
            en: 'The six of them blank for half a second, then all begin again at once, at an extremely slow speed with every syllable detached.'
          },
          {
            type: 'narration',
            zh: '「ど・こ・か・ら・き・た・の」——六个人同时。像一个失败的合唱团。',
            en: '"WHERE. ARE. YOU. FROM." Six people, in unison. Like a choir going badly wrong.'
          },
          {
            type: 'narration',
            zh: '你听懂了。你回答了。整间教室因为这个荒谬的场面笑成一片，但那种笑是热的。',
            en: 'You understand it. You answer it. The whole room dissolves over how ridiculous this is, and the laugh is a warm one.'
          }
        ]
      },
      {
        id: 'day1_break_english',
        labelZh: '试试英语。也许英语能通',
        labelEn: 'Try English. Maybe English will get through',
        hintZh: '你的英语其实也不怎么样',
        hintEn: 'Your English is not actually that good either.',
        effects: [
          { stat: 'charm', amount: 1, reasonZh: '你贡献了今天教室里最好笑的三分钟', reasonEn: 'You supplied the funniest three minutes of the day' }
        ],
        setFlags: ['day1_break_english'],
        then: [
          {
            type: 'narration',
            zh: '你切换到英语。前排一个男生眼睛亮了，猛地站起来，用一种非常有自信的语气开口了：',
            en: 'You switch to English. A boy in the front row lights up, stands bolt upright, and speaks with tremendous confidence:'
          },
          {
            type: 'speech',
            speakerZh: '同班男生',
            speakerEn: 'Classmate',
            jp: 'Ohh! My name is Kenta! I am... uh... very... fine! Your hobby is?',
            zh: '哦哦！我叫健太！我……呃……非常……好！你的爱好是？',
            en: 'Ohh! My name is Kenta! I am... uh... very... fine! Your hobby is?',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '你张嘴想答，才发现自己的英语在离开课本之后也就那么回事。你憋出了一句语法可疑的回答。',
            en: 'You open your mouth to answer and discover that your own English, outside a textbook, is not much better. What comes out is grammatically questionable.'
          },
          {
            type: 'narration',
            zh: '健太用力点头，说了句「Yes! Yes! Very nice!」。你们两个都不知道对方说了什么。',
            en: 'Kenta nods vigorously and says "Yes! Yes! Very nice!" Neither of you has any idea what the other said.'
          },
          {
            type: 'narration',
            zh: '围观的人爆发出一阵欢呼，像在看一场国际交流的伟大成果。',
            en: 'The onlookers erupt, as though witnessing a triumph of international exchange.'
          },
          {
            type: 'narration',
            zh: '你和健太隔着桌子对视了一眼。那一眼里有一种跨越语言的、纯粹的共鸣：我们俩都不行。',
            en: 'You and Kenta look at each other across the desk. In that look there is a pure understanding that transcends language: neither of us can do this.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '你的桌子边越围越多，第二节课的预备铃已经响过了。',
    en: 'The crowd at your desk keeps growing. The warning bell for second period has already gone.'
  },
  {
    type: 'narration',
    characterImage: `${ASUKA}angry.webp`,
    zh: '然后有人从人群外面「啪」地把一叠讲义拍在了你桌上。',
    en: 'Then, from outside the crowd, somebody slaps a stack of handouts down on your desk.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${ASUKA}angry.webp`,
    jp: 'はい解散。予鈴鳴ったでしょ。転校生を初日から質問攻めにしないの。',
    words: [{ jp: '解散', reading: 'かいさん', zh: '解散', en: 'disperse / break it up' }],
    zh: '好了散了。预备铃都响了吧。别第一天就把转学生问成这样。',
    en: 'Right, break it up. The bell has gone. You do not interrogate a transfer student on day one.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '人群在四秒之内散干净了。班长这两个字在这间教室里显然是有分量的。',
    en: 'The crowd is gone in four seconds. The words "class president" evidently carry weight in this room.'
  },
  {
    type: 'narration',
    characterImage: `${ASUKA}neutral.webp`,
    zh: '明日香站在原地，把那叠讲义往你面前推了推——最上面那一张，重要的地方全都用铅笔标了假名。',
    en: 'Asuka stays where she is and nudges the stack toward you. On the top sheet, every important line has been annotated in pencil with kana readings.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${ASUKA}neutral.webp`,
    jp: '……別に。全部の漢字にふってあるわけじゃないから。読めないところだけよ。',
    words: [{ jp: 'ふりがな', zh: '注音假名（标在汉字上的读音）', en: 'kana printed over kanji to give the reading' }],
    zh: '……没什么。又不是每个汉字都标了。只标了你读不了的地方而已。',
    en: '...It is nothing. I did not do all of them. Only the ones you would not be able to read.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '「你读不了的地方」——她怎么知道你读不了哪些。这个问题你没敢问。',
    en: '"The ones you would not be able to read." How she knows which ones is a question you do not dare to ask.'
  },
  {
    type: 'effect',
    setFlags: ['day1_asuka_rescue'],
    effects: [{ stat: 'knowledge', amount: 1, reasonZh: '一整叠标好假名的讲义', reasonEn: 'A whole stack of handouts with the readings written in' }],
    relations: [{ char: CharacterId.ASUKA, familiarity: 10, affection: 4, reasonZh: '她替你把人赶走了，还标了假名', reasonEn: 'She cleared the crowd for you, and wrote in the readings' }]
  },

  // ==========================================================
  // 【Scene 8】午休 · 屋顶
  // ==========================================================
  {
    type: 'scene',
    scene: 'rooftop',
    bgm: 'lobby',
    titleZh: '屋顶',
    titleEn: 'The Roof',
    subtitleZh: '午休 · 12:40',
    subtitleEn: 'Lunch break · 12:40'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '午休铃响。周围的人开始从桌肚里掏便当盒，教室里一下子全是塑料盖子被掀开的声音。',
    en: 'The lunch bell. Around you people start pulling bento boxes out of their desks, and the room fills with the sound of plastic lids coming off.'
  },
  {
    type: 'narration',
    zh: '你也伸手往书包里摸。摸到了课本、笔袋、外公的手账、一把没用上的伞。',
    en: 'You reach into your bag as well. You find textbooks, a pencil case, your grandfather’s journal, and an umbrella you did not need.'
  },
  {
    type: 'narration',
    zh: '没有午饭。',
    en: 'No lunch.'
  },
  {
    type: 'narration',
    zh: '你想起昨晚那个空冰箱，和「明天放学后第一件事：去买菜」那张便签。你把「早饭」和「午饭」两件事一起忘了。',
    en: 'You think of last night’s empty fridge, and the note that said groceries came first after school tomorrow. You forgot breakfast and lunch in the same motion.'
  },
  {
    type: 'choice',
    promptZh: '钱包里有一千二百日元。食堂在一楼最里面，你还不知道怎么点。',
    promptEn: 'Twelve hundred yen in your wallet. The cafeteria is at the far end of the ground floor, and you have no idea how to order.',
    options: [
      {
        id: 'day1_lunch_canteen',
        labelZh: '硬着头皮去食堂',
        labelEn: 'Grit your teeth and go to the cafeteria',
        hintZh: '昨天在便利店已经练过一次了',
        hintEn: 'You did practise this once, at the convenience store.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你朝着一个完全没去过的地方走了', reasonEn: 'You set off toward somewhere you had never been' }],
        setFlags: ['day1_lunch_canteen'],
        then: [
          {
            // 人下楼了，画面得跟着下楼。以前这一整段都还挂在教室的背景上。
            type: 'scene', scene: 'kaisei_cafeteria_hall', bgm: 'town',
            titleZh: '学生食堂', titleEn: 'The Cafeteria',
            subtitleZh: '一楼最里面 · 十二点二十', subtitleEn: 'Far end of the ground floor · Twenty past twelve'
          },
          {
            type: 'narration',
            zh: '你走到一楼，看见食堂门口排着大约四十个人的队，以及一台全是汉字的售票机。你在原地站了十秒。',
            en: 'You get downstairs and find a queue of roughly forty people outside the cafeteria, and a ticket machine covered end to end in kanji. You stand there for ten seconds.'
          },
          {
            type: 'narration',
            zh: '按钮是三排四列，一共十二个。你认得出「うどん」和「カレー」。剩下十个不认识。',
            en: 'Three rows of four buttons, twelve in all. You can read the udon and the curry. The other ten you cannot.'
          },
          {
            type: 'narration',
            zh: '你身后排上了人。你往旁边让了一步，然后又让了一步，最后让到了队伍外面。',
            en: 'Somebody joins the queue behind you. You step aside, and then step aside again, and end up outside the queue altogether.'
          },
          {
            type: 'narration',
            zh: '然后你转身上楼了。',
            en: 'Then you turn around and go back up.'
          },
          {
            type: 'scene', scene: 'classroom', bgm: 'chat'
          }
        ]
      },
      {
        id: 'day1_lunch_endure',
        labelZh: '算了。撑到放学也就四个小时',
        labelEn: 'Never mind. It is only four hours to the final bell',
        hintZh: '你已经开始给自己算账了',
        hintEn: 'You have started doing arithmetic on yourself.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '一千二百日元，你打算让它撑到周末', reasonEn: 'Twelve hundred yen, and you intend to make it last the week' }],
        setFlags: ['day1_lunch_endure'],
        then: [
          {
            type: 'narration',
            zh: '你把书包拉链拉上，趴在桌上。四个小时。喝点水就过去了。',
            en: 'You zip the bag shut and put your head down on the desk. Four hours. Some water and it will pass.'
          },
          {
            type: 'narration',
            zh: '肚子在这个时候非常不合时宜地叫了一声。前排有个人回头看了你一眼。',
            en: 'At this exact moment your stomach makes a extremely poorly timed noise. Someone in front turns around.'
          }
        ]
      },
      {
        id: 'day1_lunch_journal',
        labelZh: '翻开手账，看外公有没有写过食堂',
        labelEn: 'Open the journal — see if your grandfather ever wrote about the cafeteria',
        hintZh: '他在这所学校待过三年',
        hintEn: 'He was at this school for three years.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你查到了半个世纪前的午饭价格', reasonEn: 'You looked up the price of lunch half a century ago' }],
        setFlags: ['day1_lunch_journal'],
        then: [
          {
            type: 'narration',
            zh: '你翻到中间那几页。他写过：「食堂のうどん、五十円。安いが、量が少ない。腹が減る。」',
            en: 'You find it a few pages in. He had written: "Cafeteria udon, fifty yen. Cheap, but not much of it. You stay hungry."'
          },
          {
            type: 'narration',
            zh: '五十日元。现在是二百八十。物价涨了五倍多，而你连队都排不进去。',
            en: 'Fifty yen. It is two hundred and eighty now. Prices have gone up more than fivefold and you cannot even get into the queue.'
          },
          {
            type: 'narration',
            zh: '「腹が減る」这四个字倒是一点没变。你合上手账，趴回桌上。',
            en: '"You stay hungry", however, has not changed at all. You close the journal and put your head back down.'
          }
        ]
      }
    ]
  },
  // 光是怎么找上门的，要跟着上面那三条走。
  // 以前不管选了什么都写"铃响后三十秒她就在门口"——
  // 可你要是下楼排了一趟队再回来，那三十秒早就过去了。
  {
    type: 'branch',
    ifFlag: 'day1_lunch_canteen',
    then: [
      {
        type: 'narration',
        characterImage: `${HIKARI}school_happy.webp`,
        zh: '你回到教室门口的时候，光已经靠在那儿了，一手拎着一个便利店的袋子。',
        en: 'Hikari is already leaning by your classroom door when you get back, a convenience store bag in one hand.'
      },
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${HIKARI}school_smug.webp`,
        jp: '券売機、無理やったやろ。あれ半年おっても無理やで。',
        words: [{ jp: '券売機', reading: 'けんばいき', zh: '售票机', en: 'ticket machine' }],
        zh: '售票机搞不定吧。那玩意儿待半年也搞不定。',
        en: 'The ticket machine beat you, right. That thing beats you at six months too.',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        zh: '你问她怎么知道你去了食堂。她说你回来的方向不对——教室在二楼，你是从楼梯下面上来的。',
        en: 'You ask how she knows you went. She says you came back from the wrong direction: the classroom is on the second floor and you came up the stairs.'
      }
    ],
    otherwise: [
      {
        type: 'narration',
        characterImage: `${HIKARI}school_happy.webp`,
        zh: '午休铃响完没多久，光就出现在了你们班门口，一手拎着一个便利店的袋子。',
        en: 'Not long after the bell, Hikari turns up at your classroom door with a convenience store bag in one hand.'
      },
      {
        type: 'narration',
        zh: '她扫了一眼你空着的桌子，什么都没问，直接把袋子往你怀里一塞。',
        en: 'She takes one look at your empty desk, asks nothing, and puts the bag into your arms.'
      }
    ]
  },
  {
    type: 'narration',
    characterImage: `${HIKARI}school_happy.webp`,
    zh: '然后她一手把你往楼上拽。',
    en: 'Then she hauls you toward the stairs.'
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}school_happy.webp`,
    jp: '屋上な。ここが一番ええねん。海が見えるから。',
    zh: '屋顶啦。这里最好了。因为看得见海。',
    en: 'The roof. Best spot in the school. You can see the sea from here.',
    color: 'bg-amber-400'
  },
  // 「昨天你站过的那段栏杆」只有走过海边那条路的人才站过。
  // 序章选了商店街或北野坡的人，昨天根本没到过海边。
  {
    type: 'branch',
    ifFlag: 'prologue_walk_harbor',
    then: [
      {
        type: 'narration',
        zh: '确实看得见。从这儿看下去，港口、摩天轮、昨天你站过的那段栏杆，全都缩成了一排小小的东西。',
        en: 'You can. From up here the harbour, the ferris wheel, the stretch of railing you stood at yesterday: all of it shrinks into one small row of things.'
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
        zh: '确实看得见。港口、摩天轮、还有更远处那条把海和天分开的线。昨天你还在这座城市的地面上打转，今天它整个摊在你脚下。',
        en: 'You can. The harbour, the ferris wheel, and further out the line that separates the sea from the sky. Yesterday you were still going in circles at street level; today the whole thing is laid out under you.'
      }
    ]
  },
  // ---- 分饭 ----
  {
    type: 'narration',
    characterImage: `${HIKARI}school_happy.webp`,
    zh: '她盘腿坐下，把袋子里的东西一样样摆到中间：两个饭团、一个咖喱面包、一盒炸鸡块、一瓶茶。',
    en: 'She sits down cross-legged and lays the contents of the bag out between you: two onigiri, a curry bun, a box of karaage, a bottle of tea.'
  },
  {
    type: 'narration',
    zh: '她抬头看你。两秒之后，那道视线落到了你空着的两只手上。',
    en: 'She looks up at you. Two seconds later her eyes land on your two empty hands.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${HIKARI}school_surprised.webp`,
    jp: '……あれ？弁当は？',
    words: [{ jp: '弁当', reading: 'べんとう', zh: '便当、盒饭', en: 'a packed lunch' }],
    zh: '……咦？便当呢？',
    en: '...Huh? Where is your lunch?',
    color: 'bg-amber-400'
  },
  {
    type: 'narration',
    zh: '你说忘了。其实不是忘了，是冰箱里根本没有可以带的东西。但这句话说出来太长了。',
    en: 'You say you forgot. It is not that you forgot; it is that there was nothing in the fridge to bring. But that sentence is too long to say.'
  },
  {
    type: 'narration',
    characterImage: `${HIKARI}school_neutral.webp`,
    zh: '她「啊」了一声。接下来的三十秒里，她把摆在中间的东西一样一样分成了两堆，中途还调换过一次。',
    en: 'She says "ah". Over the next thirty seconds she sorts everything laid out between you into two piles, one item at a time, swapping two of them over partway through.'
  },
  {
    type: 'narration',
    zh: '饭团一人一个。咖喱面包用手掰开——她掰得很不均匀，然后把大的那半推给了你。',
    en: 'One onigiri each. She tears the curry bun in half with her hands — unevenly — and pushes the bigger half toward you.'
  },
  {
    type: 'choice',
    promptZh: '那半个面包停在你和她中间。',
    promptEn: 'The larger half sits on the ground between you.',
    options: [
      {
        id: 'day1_lunch_refuse',
        labelZh: '推回去：「你自己吃就好。」',
        labelEn: 'Push it back. "You should eat it."',
        jp: '大丈夫。自分で食べて。',
        hintZh: '这是她的午饭，不是你的',
        hintEn: 'That is her lunch, not yours.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有理所当然地接下别人的午饭', reasonEn: 'You did not simply take somebody else’s lunch' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 8, affection: 5, reasonZh: '她把面包推回来的力气比你大', reasonEn: 'She pushed it back harder than you pushed it away' }],
        setFlags: ['day1_lunch_refused'],
        then: [
          {
            type: 'narration',
            zh: '你把那半个面包推了回去。她又推了回来。你再推，她按住了。',
            en: 'You push the half bun back. She pushes it back. You push again; she puts her hand on it.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_smug.webp`,
            jp: 'あんな、うちの国ではな、腹減っとるやつの前で一人で食うんは、いちばんアカンことやねん。',
            words: [{ jp: '腹が減る', reading: 'はらがへる', zh: '肚子饿', en: 'to be hungry' }],
            zh: '我跟你说，在我们那儿啊，当着饿肚子的人一个人吃，是最要不得的事。',
            en: 'Listen. Where I am from, eating on your own in front of someone who is hungry is the single worst thing you can do.',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '你有点想问「你们那儿」是哪儿。但她已经把面包塞进你手里了。',
            en: 'You want to ask where "where I am from" actually is. She has already put the bun in your hand.'
          }
        ]
      },
      {
        id: 'day1_lunch_accept',
        labelZh: '双手接过来，认真道谢',
        labelEn: 'Take it with both hands and thank her properly',
        jp: '……ありがとう。いただきます。',
        hintZh: '「いただきます」这句你会说',
        hintEn: 'This is one phrase you do know.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你把「谢谢」说得很像回事', reasonEn: 'You made "thank you" sound like it meant something' }],
        relations: [{ char: CharacterId.HIKARI, familiarity: 10, affection: 6, reasonZh: '她被正经道谢，反而有点不好意思', reasonEn: 'Thanked properly, she was the one who got embarrassed' }],
        setFlags: ['day1_lunch_accepted'],
        then: [
          {
            type: 'speech',
            speakerZh: '你', speakerEn: 'You',
            jp: 'ありがとうございます。……いただきます。',
            words: [{ jp: 'いただきます', zh: '开动了（吃饭前的固定说法）', en: 'said before eating — "I gratefully receive"' }],
            zh: '谢谢您。……我开动了。',
            en: 'Thank you. ...Itadakimasu.',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            characterImage: `${HIKARI}school_shy.webp`,
            zh: '她愣住了，然后飞快地摆手，脸上的表情像是被人当众表扬了。',
            en: 'She freezes, then waves both hands very fast, wearing the expression of someone praised in public.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_shy.webp`,
            jp: 'いや、そんなちゃんと言われると、なんか……こっちが恥ずかしいわ。パンやで？パン。',
            zh: '不是，你说得这么正式，搞得我……我这边反而不好意思了。是面包欸？面包而已。',
            en: 'No, if you say it that properly it makes — it makes me embarrassed. It is bread. It is just bread.',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '咖喱面包已经凉了，但里面还是软的。你吃得很慢，因为一旦吃完，就得说点什么了。',
            en: 'The curry bun has gone cold, but the inside is still soft. You eat slowly, because once it is gone you will have to say something.'
          }
        ]
      },
      {
        id: 'day1_lunch_repay',
        labelZh: '接下，但说好明天还她一个',
        labelEn: 'Take it — on the condition that you bring her one tomorrow',
        jp: 'じゃあ、明日返す。同じやつ。',
        words: [{ jp: '返す', reading: 'かえす', zh: '还、归还', en: 'to give back' }],
        hintZh: '你已经欠过一次账了',
        hintEn: 'You have run up one debt in this city already.',
        effects: [
          { stat: 'proficiency', amount: 1, reasonZh: '你又给自己记了一笔账', reasonEn: 'You opened a second account on yourself' },
          { stat: 'guts', amount: 1, reasonZh: '你给一次施舍安上了一个明天', reasonEn: 'You attached a tomorrow to a piece of charity' }
        ],
        relations: [{ char: CharacterId.HIKARI, familiarity: 12, affection: 7, reasonZh: '「明天」这两个字她记住了', reasonEn: 'She noted the word "tomorrow"' }],
        setFlags: ['day1_lunch_repay'],
        then: [
          {
            type: 'narration',
            zh: '你接过面包。「明天我带一个还你。」这句话你说得很慢，语法多半是错的。她听懂了。',
            en: 'You take the bread. "Tomorrow I bring one, give back you." You say it slowly and the grammar is almost certainly wrong. She understands it.'
          },
          {
            type: 'narration',
            characterImage: `${HIKARI}school_surprised.webp`,
            zh: '她把手里的饭团停在半空。',
            en: 'She stops with the onigiri halfway to her mouth.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_happy.webp`,
            jp: '明日？……ええやん、それ。ほな明日もここな。約束や。',
            words: [{ jp: '約束', reading: 'やくそく', zh: '约定', en: 'a promise' }],
            zh: '明天？……不错嘛，这个。那明天也在这儿。说好了。',
            en: 'Tomorrow? ...I like that. Then here again tomorrow. It is a promise.',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '你只是想还一个面包。她把它变成了一个约定。',
            en: 'You only meant to return a bread roll. She has turned it into an appointment.'
          }
        ]
      }
    ]
  },

  // ---- 互相报上名字 ----
  {
    type: 'narration',
    zh: '两个人在屋顶上安静地吃了一会儿。风从海那边过来，把包装纸吹得哗哗响。',
    en: 'You eat in silence on the roof for a while. The wind comes in off the sea and rattles the wrappers.'
  },
  // 序章在港边正式认识过的话，这里不能再说"还没自我介绍"——
  // 她昨天已经喊过主角的名字了。那条线改成两个人一起惊叹缘分。
  {
    type: 'branch',
    ifFlag: 'prologue_met_hikari',
    then: [
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${HIKARI}school_happy.webp`,
        jp: 'なあ、考えてみ。昨日あの手すりのとこで会って、今日おんなじ交流室で、今おんなじ屋上におるんやで。',
        words: [{ jp: '手すり', reading: 'てすり', zh: '栏杆', en: 'a railing' }],
        zh: '喂，你想想。昨天在那个栏杆边碰上，今天在同一间交流室，现在还在同一个屋顶上。',
        en: 'Hey, think about it. Yesterday at that railing, today the same exchange office, and now the same roof.',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        zh: '你说这大概叫有缘。她说不对，这叫神户太小了。说完自己先笑出来了。',
        en: 'You say that is probably what people call fate. She says no, that is what people call Kobe being small. Then she laughs at her own line first.'
      },
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${HIKARI}school_happy.webp`,
        jp: 'まあでも……うれしいわ、正直。同じ学校って聞いたとき、ちょっとガッツポーズしたもん。',
        zh: '不过嘛……说实话，挺高兴的。听说是同一所学校的时候，我还偷偷握了下拳。',
        en: 'Still... honestly, I am glad. When I heard it was the same school I did a little fist-pump.',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        zh: '她说完马上补了一句"没有真的握啊"，但你已经能想象出那个动作了。',
        en: 'She adds immediately that she did not actually do it. You can picture it perfectly.'
      },
      {
        type: 'effect',
        relations: [{ char: CharacterId.HIKARI, familiarity: 6, affection: 5, reasonZh: '她承认自己偷偷握了下拳', reasonEn: 'She admitted to the fist-pump' }]
      }
    ],
    otherwise: [
      {
        type: 'speech',
        speakerZh: '光', speakerEn: 'Hikari',
        characterImage: `${HIKARI}school_neutral.webp`,
        jp: 'そういえばな。国際交流室では書類の話ばっかりやったやろ。ちゃんと自己紹介、してへんかったわ。',
        words: [{ jp: '自己紹介', reading: 'じこしょうかい', zh: '自我介绍', en: 'introducing yourself' }],
        zh: '说起来啊。在国际交流室净说表格的事了吧。都没好好自我介绍过。',
        en: 'Come to think of it. In the exchange office it was all forms, was it not. We never actually introduced ourselves.',
        color: 'bg-amber-400'
      }
    ]
  },
  {
    type: 'narration',
    zh: '她把手在裙子上擦了擦。转过来面对你的时候，膝盖并拢了，坐姿也换了一个。',
    en: 'She wipes her hands on her skirt. When she turns to face you her knees have come together and she has changed how she is sitting.'
  },
  {
    type: 'speech',
    speakerZh: '光', speakerEn: 'Hikari',
    characterImage: `${HIKARI}school_happy.webp`,
    jp: '二年B組、光。日本に来て半年。好きなもんは食べ歩き、嫌いなもんは書類。以上！',
    words: [{ jp: '食べ歩き', reading: 'たべあるき', zh: '边走边吃、逛吃', en: 'eating your way around a place' }],
    zh: '二年B班，光。来日本半年。喜欢的是逛吃，讨厌的是各种表格。完毕！',
    en: 'Class 2-B, Hikari. Six months in Japan. Likes: eating my way around town. Dislikes: paperwork. That is it!',
    color: 'bg-amber-400'
  },
  {
    type: 'choice',
    promptZh: '轮到你了。她盯着你，等得非常认真。',
    promptEn: 'Your turn. She is watching you, waiting with complete seriousness.',
    options: [
      {
        id: 'day1_intro_full',
        labelZh: '照她的格式，认真报一遍',
        labelEn: 'Match her format and give it properly',
        hintZh: '名字、来了多久、喜欢什么、讨厌什么',
        hintEn: 'Name, how long, likes, dislikes.',
        effects: [
          { stat: 'charm', amount: 1, reasonZh: '你把一次自我介绍说完整了', reasonEn: 'You got through a self-introduction intact' },
          { stat: 'knowledge', amount: 1, reasonZh: '这套句型你昨晚练过二十遍', reasonEn: 'You had practised this pattern twenty times last night' }
        ],
        relations: [{ char: CharacterId.HIKARI, familiarity: 10, affection: 5, reasonZh: '她认真听完了每一个字', reasonEn: 'She listened to every word of it' }],
        setFlags: ['day1_hikari_intro_full'],
        then: [
          {
            type: 'narration',
            zh: '你学着她的样子坐好，把昨晚在窗玻璃前练过二十遍的那段说了出来。这一次没有抖。',
            en: 'You sit up the way she did and deliver the passage you rehearsed twenty times at the window last night. This time your voice does not shake.'
          },
          {
            type: 'narration',
            characterImage: `${HIKARI}school_happy.webp`,
            zh: '说到「討厭的是表格」的时候，她「啪」地一拍地面，说了句「せやんな！！」，声音大到楼下操场都听得见。',
            en: 'When you get to "dislikes: paperwork" she slaps the ground and says "RIGHT?!" loudly enough to be heard on the field below.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_happy.webp`,
            jp: 'よし、覚えた。……あんたの名前、これでもう忘れへんわ。',
            zh: '好，记住了。……你的名字，我这下不会忘了。',
            en: 'Right. Got it. ...I am not going to forget your name now.',
            color: 'bg-amber-400'
          }
        ]
      },
      {
        id: 'day1_intro_why',
        labelZh: '只说名字，然后问她：「你为什么来神户？」',
        labelEn: 'Give your name — then ask her: "Why did you come to Kobe?"',
        jp: '……そっちは？　どうして神戸に。',
        hintZh: '你更想知道她的答案',
        hintEn: 'You would rather have her answer than give yours.',
        effects: [
          { stat: 'knowledge', amount: 1, reasonZh: '你把问题抛了回去，还问对了地方', reasonEn: 'You turned the question round, and aimed it well' }
        ],
        relations: [{ char: CharacterId.HIKARI, familiarity: 8, affection: 8, reasonZh: '她答这个问题的时候，语速第一次慢了下来', reasonEn: 'Answering that, her pace dropped for the first time' }],
        setFlags: ['day1_hikari_why'],
        then: [
          {
            type: 'narration',
            zh: '你只报了名字，然后把问题推了回去。',
            en: 'You give only your name, and push the question back across.'
          },
          {
            type: 'narration',
            characterImage: `${HIKARI}school_neutral.webp`,
            zh: '她「唔」了一声，抱着膝盖看了一会儿海。',
            en: 'She makes a small sound, hugs her knees, and looks at the sea for a while.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_neutral.webp`,
            jp: '……テレビで見てん。神戸の夜景。ちっちゃい頃に。',
            words: [{ jp: '夜景', reading: 'やけい', zh: '夜景', en: 'a night view' }],
            zh: '……在电视上看到的。神户的夜景。很小的时候。',
            en: '...I saw it on television. The night view of Kobe. When I was small.',
            color: 'bg-amber-400'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_shy.webp`,
            jp: 'それだけ。理由それだけやねん。……しょうもないやろ。',
            zh: '就这样。理由就只有这个。……很没意思吧。',
            en: 'That is it. That is the whole reason. ...Pretty stupid, right.',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '你说不。你说你也是为了一张画得乱七八糟的旧地图来的。',
            en: 'You say no. You say you came for a badly drawn old map.'
          },
          {
            type: 'narration',
            characterImage: `${HIKARI}school_happy.webp`,
            zh: '她笑出了声，笑了很久。',
            en: 'She laughs, and keeps laughing for a while.'
          }
        ]
      },
      {
        id: 'day1_intro_joke',
        labelZh: '「喜欢的是别人分给我的面包。」',
        labelEn: '"Likes: bread that other people give me."',
        jp: '好きなものは、人が分けてくれたパンです。',
        words: [{ jp: '分ける', reading: 'わける', zh: '分、分给', en: 'to share out' }],
        hintZh: '现学现卖她的格式',
        hintEn: 'Her format, used against her.',
        effects: [
          { stat: 'charm', amount: 1, reasonZh: '你用她自己的句式反将了一军', reasonEn: 'You turned her own format back on her' },
          { stat: 'guts', amount: 1, reasonZh: '第一天就敢开这种玩笑', reasonEn: 'That is a bold joke for day one' }
        ],
        relations: [{ char: CharacterId.HIKARI, familiarity: 12, affection: 6, reasonZh: '她被自己的句式噎了一下', reasonEn: 'Her own sentence pattern came back and got her' }],
        setFlags: ['day1_hikari_joke'],
        then: [
          {
            type: 'narration',
            zh: '你学着她的语气报完名字，然后停顿了一下——',
            en: 'You give your name in her cadence, then pause—'
          },
          {
            type: 'speech',
            speakerZh: '你', speakerEn: 'You',
            jp: '好きなものは、人がくれたパン。嫌いなものは、空っぽの冷蔵庫。以上。',
            words: [{ jp: '冷蔵庫', reading: 'れいぞうこ', zh: '冰箱', en: 'refrigerator' }],
            zh: '喜欢的是，别人分给我的面包。讨厌的是，空冰箱。完毕。',
            en: 'Likes: bread other people give me. Dislikes: empty refrigerators. That is it.',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            characterImage: `${HIKARI}school_surprised.webp`,
            zh: '她正在喝茶。这一口茶她没能咽下去。',
            en: 'She is drinking her tea. That mouthful does not go down.'
          },
          {
            type: 'narration',
            zh: '咳嗽了大概二十秒之后，她指着你，一边喘一边笑。',
            en: 'After about twenty seconds of coughing, she points at you, laughing and out of breath.'
          },
          {
            type: 'speech',
            speakerZh: '光', speakerEn: 'Hikari',
            characterImage: `${HIKARI}school_happy.webp`,
            jp: 'あんた、日本語まだアカンとか言うてたやん。今の完璧やったで。ずるいわ。',
            zh: '你不是说日语还不行吗。刚才那句完美欸。太狡猾了。',
            en: 'You said your Japanese was still bad. That was perfect. That is cheating.',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '你没告诉她，那两句你在心里排了整整三分钟。',
            en: 'You do not tell her that you spent a full three minutes assembling those two sentences in your head.'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}school_neutral.webp`,
    jp: '……最初の一週間な、毎日ここで昼メシ食っとった。誰とも喋らんで。',
    zh: '……刚来那一个星期啊，我每天都在这儿吃午饭。谁也不跟我说话。',
    en: '...First week I was here, I ate lunch up here every day. Did not talk to anyone.',
    color: 'bg-amber-400'
  },
  {
    type: 'narration',
    zh: '她说得很轻松，像在讲别人的事。说完没等你接话就把咖喱面包举了起来，问你吃不吃一半。',
    en: 'She says it lightly, as though it happened to someone else. Before you can answer she has the curry bun up in the air, asking if you want half.'
  },
  {
    type: 'narration',
    zh: '第六条你其实已经想好了。屋顶、看得见海的午休、把你一路拽上来的同班同学。',
    en: 'You already had the sixth entry worked out. The roof, lunch with a view of the sea, the classmate who hauled you up here.'
  },
  {
    type: 'narration',
    zh: '但你没写。',
    en: 'You do not write it.'
  },
  {
    type: 'narration',
    zh: '因为「毎日ここで昼メシ食っとった。誰とも喋らんで」这一句，不在任何一条套路里。',
    en: 'Because "I ate lunch up here every day, and I did not talk to anybody" is not on anyone\u2019s list of clich\u00e9s.'
  },
  {
    type: 'narration',
    zh: '你接过那半个咖喱面包，说了声谢谢。手账留在书包里，整个下午都没再拿出来。',
    en: 'You take the half of the curry bun and say thank you. The journal stays in your bag. You do not take it out again all afternoon.'
  },
  {
    type: 'effect',
    setFlags: ['day1_roof_lunch', 'day1_meta_closed'],
    relations: [{ char: CharacterId.HIKARI, familiarity: 8, affection: 4, reasonZh: '她把自己那一周说出来了，虽然只说了一句', reasonEn: 'She told you about that week. One sentence of it, anyway' }]
  },

  // ==========================================================
  // 【Scene 9】放学后 · 决定性分叉
  // ==========================================================
  // ---- 下午的四节课 ----
  {
    type: 'scene',
    scene: 'classroom_morning',
    bgm: 'lobby'
  },
  {
    type: 'narration',
    zh: '下午四节课。现代文、数学、日本史、古典。',
    en: 'Four periods in the afternoon. Modern Japanese, maths, Japanese history, classical Japanese.'
  },
  {
    type: 'narration',
    zh: '客观地说，你听懂了其中的数学。',
    en: 'Objectively speaking, you understood the maths.'
  },
  {
    type: 'narration',
    zh: '因为数字长得都一样。',
    en: 'Because the numbers look the same in every language.'
  },
  {
    type: 'narration',
    zh: '现代文那节课，老师念了一篇散文，全班都在点头。你也在点头。你点头的依据是老师的语调。',
    en: 'In modern Japanese the teacher read out an essay and the whole class nodded along. You nodded too. You were nodding based on the teacher’s intonation.'
  },
  {
    type: 'narration',
    zh: '日本史更糟：黑板上全是人名，每个人名后面跟着一个年份，年份后面跟着一个你不认识的动词。',
    en: 'History was worse. The board filled up with names, each name followed by a year, each year followed by a verb you did not know.'
  },
  {
    type: 'narration',
    zh: '最后一节是古典。古典课上讲的是古代日语。你的现代日语才刚够点一碗拉面。',
    en: 'The last period was classical Japanese. Classical Japanese is a form of the language from a thousand years ago. Your modern Japanese is just about adequate for ordering ramen.'
  },
  {
    type: 'narration',
    zh: '你在手账最后一页写下了今天真正学到的东西：',
    en: 'On the last page of the journal you write down what you actually learned today:'
  },
  {
    type: 'narration',
    zh: '「一、听不懂的时候，全班都会安静两秒，那两秒是留给你自己意识到的。」',
    en: '"One. When you have not understood, the class goes quiet for two seconds. Those two seconds are for you to notice."'
  },
  {
    type: 'narration',
    zh: '「二、点头的角度和听懂的程度没有关系。」',
    en: '"Two. The angle of the nod bears no relation to the amount understood."'
  },
  {
    type: 'narration',
    zh: '「三、数学是好东西。」',
    en: '"Three. Maths is a good thing."'
  },
  {
    type: 'narration',
    characterImage: `${ASUKA}neutral.webp`,
    zh: '你写第三条的时候，斜前方那个人回过头，看了一眼你的本子，什么都没说，然后把自己的笔记本往你桌角推了两厘米。',
    en: 'As you write the third one, the person diagonally in front turns around, looks at your notebook, says nothing, and pushes her own notes two centimetres onto the corner of your desk.'
  },
  {
    type: 'narration',
    zh: '古典课那一页，重点全部用红笔框了出来。框线画得非常直。',
    en: 'On the page for classical Japanese, every key point has been boxed in red pen. The lines are extremely straight.'
  },
  {
    type: 'effect',
    setFlags: ['day1_afternoon_lost'],
    effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你搞清楚了自己到底哪里不懂', reasonEn: 'You worked out precisely what it was you did not understand' }],
    relations: [{ char: CharacterId.ASUKA, familiarity: 6, affection: 3, reasonZh: '她的笔记推过来了两厘米', reasonEn: 'Her notes came two centimetres closer' }]
  },

  // ---- 铺垫（二）：她已经出发了，而且已经走错了 ----
  {
    type: 'narration',
    zh: '第四节课中途，口袋里震了三下。你趁老师转身写板书的时候，把手机压在桌肚里看了一眼。',
    en: 'Three buzzes in your pocket during fourth period. You sneak a look with the phone pressed into the desk while the teacher is turned to the board.'
  },
  {
    // 早上那一屏是十七条堆在一起的"她一整晚都在发"；
    // 这一屏只有三条，看的是**这三条之间发生了什么**。
    type: 'phone',
    savedAsZh: 'なおちゃん', savedAsEn: 'Nao-chan',
    avatar: '/images/avatars/nao.webp',
    lines: [
      { jp: '坂の下ついた', zh: '我到坡道下面了', en: 'I am at the bottom of the slope', time: '15:50' },
      { jp: 'この坂なっが', zh: '这条坡道好长', en: 'This slope is so long' },
      { jp: '……待って、これあんたの坂ちゃうくない？', zh: '……等一下，这条好像不是你那条', en: '...Hang on, I do not think this is your one' }
    ],
    afterZh: '学校四点十分放学。她三点五十就到了——到了一条不是你那条的坡下面。',
    afterEn: 'School finishes at ten past four. She got there at ten to — to the bottom of a slope that is not yours.'
  },
  {
    type: 'narration',
    zh: '你把手机扣回桌肚里，忽然有点想笑。十年了，一点没变。',
    en: 'You put the phone face down under the desk and find you want to laugh. Ten years, and not one thing has changed.'
  },

  {
    type: 'scene',
    scene: 'rooftop_sunset',
    bgm: 'town',
    titleZh: '放学后',
    titleEn: 'After School',
    subtitleZh: '下午 4:10',
    subtitleEn: '4:10 PM'
  },
  {
    type: 'narration',
    zh: '值日的同学在擦黑板。窗外的天还很亮。第一天结束了——但今天还没有结束。',
    en: 'Someone on cleaning duty is wiping the board. It is still bright outside. The first day is over. The day is not.'
  },
  // 先出校门，再决定去哪儿。这一段以前在深度线之后，
  // 于是选了商店街的玩家逛完街会莫名其妙回到教室推椅子。
  ...DAY1_LEAVING,
  {
    type: 'choice',
    promptZh: '你站在校门口。回家之前，你还有一下午。',
    promptEn: 'You are standing at the school gate. You have an afternoon before you have to go home.',
    options: [
      {
        id: 'day1_go_gym',
        labelZh: '体育馆那边一直有球撞地板的声音',
        labelEn: 'There has been a ball hitting the floor in the gym all afternoon',
        hintZh: '整个下午，节奏一直没乱过',
        hintEn: 'All afternoon, and the rhythm has not slipped once.',
        setFlags: ['day1_route_gym'],
        then: [...DAY1_GYM, ...DAY1_CAMEO_AFTER_GYM]
      },
      {
        id: 'day1_go_library',
        labelZh: '去图书馆——想查查外公地图上那些地名',
        labelEn: 'The library — you want to look up the place names on that map',
        hintZh: '手账上有几个地名，你在现在的地图上找不到',
        hintEn: 'A few of the names in the journal are not on any map you can find.',
        setFlags: ['day1_route_library'],
        then: [...DAY1_LIBRARY, ...DAY1_CAMEO_AFTER_LIB]
      },
      {
        id: 'day1_go_arcade',
        labelZh: '往三宫走，钻进商店街',
        labelEn: 'Head for Sannomiya and into the arcade',
        hintZh: '冰箱还是空的，而且你想听人正常说话',
        hintEn: 'The fridge is still empty, and you want to hear people talk at normal speed.',
        setFlags: ['day1_route_arcade'],
        then: [...DAY1_ARCADE, ...DAY1_CAMEO_AFTER_ARC]
      }
    ]
  },

  // ==========================================================
  // 【Scene 10】傍晚（承接上面的路线）
  // ==========================================================
  ...DAY1_EVENING,

  // ==========================================================
  // 【Scene 11】夜 · 201 室
  // ==========================================================
  {
    type: 'scene',
    scene: 'apartment_room',
    bgm: 'night',
    titleZh: '海风庄 201 室 · 夜',
    titleEn: 'Umikaze-so, Room 201 · Night',
    subtitleZh: '晚上 9:30',
    subtitleEn: '9:30 PM'
  },
  {
    type: 'narration',
    zh: '制服挂回衣柜门上。领口的校徽今天没有歪。',
    en: 'The uniform goes back on the wardrobe door. The crest did not go crooked today.'
  },
  {
    type: 'narration',
    zh: '你把外公的手账摊在桌上，翻到最后一页有字的地方，往后一页——空的。',
    en: 'You open your grandfather’s journal on the desk, find the last page with writing on it, and turn one further. Blank.'
  },
  {
    type: 'branch',
    ifFlag: 'day1_kept_petal',
    then: [
      {
        type: 'narration',
        zh: '扉页上那片樱花已经开始变干了。你把它往里挪了挪，压平。',
        en: 'The petal in the front is already drying out. You nudge it further in and press it flat.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'day1_meta_list',
    then: [
      {
        type: 'narration',
        zh: '往前翻一页，是早上那张清单。五条。',
        en: 'One page back is this morning\u2019s list. Five entries.'
      },
      {
        type: 'narration',
        zh: '你从头看了一遍。每一条都成立。转学生、坡道、樱花、拐角撞人、窗边倒数第二排——准得像照着教科书排的。',
        en: 'You read down it. Every line holds. Transfer student, the slope, the blossom, the collision at the corner, the window seat second from the back. As exact as if it had been set from a textbook.'
      },
      {
        type: 'narration',
        zh: '然后你开始想清单上没有的那些。',
        en: 'And then you start thinking about the things that are not on it.'
      },
      {
        type: 'narration',
        zh: '「最初の一週間、誰とも喋らんで」——这句不在上面。',
        en: '"That first week, I did not talk to anybody." That is not on it.'
      },
      {
        type: 'branch',
        ifFlag: 'day1_meta_said',
        then: [
          {
            type: 'narration',
            zh: '「あと何個残ってるのよ」——这句也不在。说这句的人当时耳朵是红的。',
            en: '"How many are left on that list." That is not on it either. The person who said it had gone red at the ears.'
          }
        ]
      },
      {
        type: 'narration',
        zh: '套路负责把人送到门口。进了门之后的事，清单上一条也没有。',
        en: 'The formula gets you as far as the door. Nothing on the other side of it made the list.'
      },
      {
        type: 'narration',
        zh: '你把那一页轻轻撕了下来，对折，夹回扉页——和那片北野的樱花放在一起。',
        en: 'You tear the page out, fold it once, and tuck it back inside the front cover, next to the Kitano petal.'
      }
    ]
  },
  {
    type: 'narration',
    zh: '你拧开笔帽，停了很久，最后只写下一行：',
    en: 'You uncap the pen, sit there for a long time, and in the end write only one line:'
  },
  {
    type: 'speech',
    speakerZh: '你',
    speakerEn: 'You',
    jp: '——四月十一日。今日、日本語で三十四人に名前を言った。',
    words: [{ jp: '名前', reading: 'なまえ', zh: '名字', en: 'name' }],
    zh: '——四月十一日。今天，我用日语对三十四个人说了自己的名字。',
    en: '—April 11th. Today I said my own name in Japanese, to thirty-four people.',
    color: 'bg-yellow-500'
  },
  {
    type: 'narration',
    zh: '写完你看了很久。这句话作为一整天的总结，怎么看都太小了。',
    en: 'You look at it for a while. As a summary of an entire day it is, by any measure, far too small.'
  },
  {
    type: 'narration',
    zh: '但你没有再加。因为你知道明天还有一页。',
    en: 'You do not add to it. Because you know there is another page tomorrow.'
  },
  // ---- 睡前 ----
  //
  // 这一段是第一章真正的结尾。前面全是"发生了什么"，这里只写
  // 一件事：一个人第一次在别人的国家里躺下，然后睡着。
  //
  // 写法上刻意不总结、不抒情、不下结论——全是手上的动作和听见的声音。
  // 兴奋不用"我很兴奋"来写，用"翻了第七次身"来写。
  {
    type: 'scene', scene: 'room', bgm: 'night',
    titleZh: '第一夜', titleEn: 'The First Night',
    subtitleZh: '海风庄 202 · 十一点二十',
    subtitleEn: 'Umikaze-so 202 · Twenty past eleven'
  },
  {
    type: 'narration',
    zh: '行李箱里还剩最后一层。你把它倒在榻榻米上：三件衬衫、一双备用的鞋、母亲塞的两袋泡面、还有一个你不记得自己装过的插线板。',
    en: 'One layer left in the suitcase. You tip it out onto the tatami: three shirts, a spare pair of shoes, two bags of instant noodles your mother put in, and an extension lead you do not remember packing.'
  },
  {
    type: 'narration',
    zh: '衣柜里没有衣架。你把衬衫叠好，摞在最上层，打算明天去百元店买。',
    en: 'There are no hangers in the wardrobe. You fold the shirts and stack them on the top shelf, and decide to buy some at the hundred-yen shop tomorrow.'
  },
  {
    type: 'narration',
    zh: '床是房东留下的旧褥子。你按下午在店里看别人做的样子铺：褥子在下，床单绷紧四个角，被子搭上去，枕头拍两下。',
    en: 'The bedding is the landlord’s old futon. You lay it out the way you saw somebody do it in a shop this afternoon: mattress down, sheet pulled tight at all four corners, quilt over it, two pats to the pillow.'
  },
  {
    type: 'narration',
    zh: '第一次铺成这个样子花了十二分钟。你站着看了一会儿，觉得还行。',
    en: 'Getting it to look like that takes twelve minutes. You stand and look at it for a bit and decide it will do.'
  },
  {
    type: 'narration',
    zh: '关灯。躺下。',
    en: 'Light off. Lie down.'
  },
  {
    type: 'narration',
    zh: '天花板的木纹和你家的不一样。这个念头一起来就再也压不下去了——',
    en: 'The grain in the ceiling is not the grain you grew up with. Once that has occurred to you it will not go away—'
  },
  {
    type: 'narration',
    zh: '明天早上那家面包店几点开门。商店街最里面那条巷子通到哪儿。今天没敢进去的那家旧书店，架子最上面那一排是什么。二楼楼梯口贴的那张海报上写的到底是什么字。食堂那个「日替わり」明天换成什么。',
    en: 'What time does that bakery open. Where does the alley at the far end of the shotengai come out. That secondhand bookshop you did not dare go into today — what is on its top shelf. What did that poster by the second-floor stairs actually say. What will tomorrow’s canteen special be.'
  },
  {
    type: 'narration',
    zh: '你翻了个身。',
    en: 'You turn over.'
  },
  {
    type: 'narration',
    zh: '还有——那座山就在窗户外面。你来了两天，一次都还没有走上去过。',
    en: 'And the mountain is right outside the window. You have been here two days and have not once walked up it.'
  },
  {
    type: 'narration',
    zh: '你又翻了一个身。这是第七次。你数了。',
    en: 'You turn over again. That is the seventh time. You were counting.'
  },
  {
    type: 'narration',
    zh: '楼下有人回来了，铁楼梯响了六下。隔壁的电视很小声，隔着墙只听得见语调，听不出内容。远处过去一列电车。电车过完之后，很久都没有声音。',
    en: 'Somebody comes home downstairs and the iron staircase rings six times. The television next door is low enough that through the wall you get the intonation but not the words. A train goes past in the distance. After the train there is no sound for a long time.'
  },
  {
    type: 'narration',
    zh: '再远一点是海的声音。也可能不是。你分不出那是海还是六甲山下来的风。',
    en: 'Further off there is the sea. Or there is not; you cannot yet tell the sea from the wind coming down off Rokko.'
  },
  {
    type: 'narration',
    zh: '你决定明天问问奈绪。她在这儿住了一年，应该分得出来。',
    en: 'You decide to ask Nao tomorrow. She has lived here a year. She will be able to tell.'
  },
  {
    type: 'narration',
    zh: '——然后是这两天：两个半小时的飞机、关空到三宫那一趟坐过站的电车、爬了三遍的坡道，和三十四个名字，一起压了上来。',
    en: '—And then the last two days land on you at once: two and a half hours in the air, the train from Kansai to Sannomiya that you rode one stop too far, the slope you have now climbed three times, and thirty-four names.'
  },
  {
    type: 'narration',
    zh: '你没有睡着的记忆。只有第二天早上闹钟响的时候，被子还整整齐齐地盖在身上，一晚上没有踢开过。',
    en: 'You have no memory of falling asleep. Only that when the alarm goes in the morning the quilt is still square across you, unkicked all night.'
  },
  {
    type: 'effect',
    setFlags: ['day1_done', 'day1_first_night'],
    effects: [
      { stat: 'knowledge', amount: 1, reasonZh: '第一天在这座城市里活下来了', reasonEn: 'You got through the first day in this city' },
      { stat: 'proficiency', amount: 1, reasonZh: '你自己把床铺好了，用了十二分钟', reasonEn: 'You made the bed yourself. It took twelve minutes.' }
    ]
  }
];
