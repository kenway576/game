import { StoryNode, CharacterId } from '../types';
import { DAY1_GYM, DAY1_LIBRARY, DAY1_ARCADE, DAY1_EVENING } from './day1Afterschool';

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
    zh: '你把外公那本手账塞进书包侧袋——不知道为什么，带着它心里踏实一点。',
    en: 'You slide your grandfather’s journal into the side pocket of your bag. You cannot say why; it just makes the day feel more possible.'
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
        zh: '她看见你，动作停了一下——然后还是很轻地点了下头。',
        en: 'She sees you and her hand pauses on the door. Then she gives a small nod anyway.'
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
    zh: '推开公寓大门的瞬间，一阵山风卷着满坡的落樱扑面而来。有一片打着旋儿黏在了你的袖口上。',
    en: 'The moment you push the front door open, a gust off the hill throws a slope’s worth of petals into your face. One of them spins down and sticks to your cuff.'
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
      }
    ]
  },

  // ==========================================================
  // 【Scene 4】校门 · 第一块看得懂的牌子
  // ==========================================================
  {
    type: 'scene',
    scene: 'school_gate',
    bgm: 'town',
    titleZh: '海星学园 · 正门',
    titleEn: 'Kaisei Academy · Main Gate'
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
    zh: '你在心里拆这行字。**「済ませて」**是「済ませる」的て形，前面接「までに」——「在八点之前，把手续办完」。',
    en: 'You take the line apart in your head. "Sumasete" is the te-form of "sumaseru", and it follows "made ni": get it done by eight.'
  },
  {
    type: 'narration',
    zh: '教科书上背过无数遍的语法点，此刻变成了脚下真实的指路牌。那种感觉很难形容——不是考试对了一题的雀跃，而是**这个国家忽然对你敞开了一条缝**。',
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
    characterImage: `${HIKARI}casual_angry.webp`,
    zh: '正当你盯着那一栏发愣，斜对面「啪」的一声，一个金发女生把笔重重拍在了桌上。',
    en: 'While you are staring at it, a pen slams down on the table across from you. A blonde girl.'
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}casual_angry.webp`,
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
        characterImage: `${HIKARI}casual_surprised.webp`,
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
        characterImage: `${HIKARI}casual_happy.webp`,
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
        characterImage: `${HIKARI}casual_surprised.webp`,
        zh: '她愣了半秒，眉头皱起来，像是在翻一本很乱的相册。',
        en: 'She stops for half a second, frowning, like someone flipping through a badly sorted photo album.'
      },
      {
        type: 'speech',
        speakerZh: '光',
        speakerEn: 'Hikari',
        characterImage: `${HIKARI}casual_surprised.webp`,
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
            characterImage: `${HIKARI}casual_surprised.webp`,
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
            characterImage: `${HIKARI}casual_happy.webp`,
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
    zh: '两个人一起举手。老师笑着走过来解释：**「続柄」就是「与保证人的关系」**——写「祖父」就行。',
    en: 'You both put your hands up. The teacher comes over, smiling, and explains: "tsuzukigara" is simply your relationship to your guarantor. Write "grandfather".'
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}casual_happy.webp`,
    jp: 'なるほどな。……ま、これから同じ船に乗ってる仲間ってことで！困ったらお互い様、な？',
    zh: '原来如此。……那，从今天起我们就是同一条船上的伙伴啦！有难同当，好吗？',
    en: 'Right, got it. ...Well then — same boat from here on. We bail each other out, yeah?',
    color: 'bg-amber-400'
  },
  {
    type: 'effect',
    setFlags: ['day1_hikari_registered'],
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '两个人一起举了手', reasonEn: 'You put your hands up together' }]
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
    type: 'choice',
    promptZh: '开口。',
    promptEn: 'Speak.',
    options: [
      {
        id: 'day1_intro_kansai',
        labelZh: '「よろしゅうおたのもうします」——用关西腔',
        labelEn: '"Yoroshuu otanomou shimasu" — in Kansai-ben',
        hintZh: '昨晚那句「おおきに」之后，你查了一晚上',
        hintEn: 'After that "ookini" last night, you spent the evening looking things up.',
        requiresFlag: 'prologue_checkout_kansai',
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '第一天就敢在全班面前用方言', reasonEn: 'Day one, and you used dialect in front of the whole class' },
          { stat: 'charm', amount: 2, reasonZh: '全班都笑了，但没有一个人在嘲笑你', reasonEn: 'The whole class laughed, and none of it was at you' }
        ],
        setFlags: ['day1_intro_kansai'],
        then: [
          {
            type: 'narration',
            zh: '教室静了半秒，然后炸开一片笑声。不是嘲笑——是那种「这家伙可以」的笑。',
            en: 'Half a second of silence, then the room breaks up. Not mocking laughter. The other kind: this guy is all right.'
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
        hintZh: '慢，但是完整',
        hintEn: 'Slow. But complete.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '在三十几个人面前把整句说完了', reasonEn: 'You finished the whole sentence in front of thirty people' },
          { stat: 'knowledge', amount: 1, reasonZh: '一个助词都没错', reasonEn: 'Not one particle out of place' }
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
        labelZh: '「はじめまして」之后，卡住了',
        labelEn: 'Get as far as "hajimemashite" and stall',
        hintZh: '排练过二十遍的句子，一个字都想不起来',
        hintEn: 'Twenty rehearsals, and not one word of it is there.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你在三十几个人面前把慌乱吞了下去', reasonEn: 'You swallowed the panic with thirty people watching' }],
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
    characterImage: `${HIKARI}casual_happy.webp`,
    zh: '光在午休铃响后三十秒就出现在了你们班门口，一手拎着面包，一手把你往楼上拽。',
    en: 'Hikari appears at your classroom door thirty seconds after the bell, bread in one hand, the other hauling you toward the stairs.'
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}casual_happy.webp`,
    jp: '屋上な。ここが一番ええねん。海が見えるから。',
    zh: '屋顶啦。这里最好了。因为看得见海。',
    en: 'The roof. Best spot in the school. You can see the sea from here.',
    color: 'bg-amber-400'
  },
  {
    type: 'narration',
    zh: '确实看得见。从这儿看下去，港口、摩天轮、昨天你站过的那段栏杆，全都缩成了一排小小的东西。',
    en: 'You can. From up here the harbour, the ferris wheel, the stretch of railing you stood at yesterday — all of it shrinks into one small row of things.'
  },
  {
    type: 'speech',
    speakerZh: '光',
    speakerEn: 'Hikari',
    characterImage: `${HIKARI}casual_neutral.webp`,
    jp: '……最初の一週間な、毎日ここで昼メシ食っとった。誰とも喋らんで。',
    zh: '……刚来那一个星期啊，我每天都在这儿吃午饭。谁也不跟我说话。',
    en: '...First week I was here, I ate lunch up here every day. Did not talk to anyone.',
    color: 'bg-amber-400'
  },
  {
    type: 'narration',
    zh: '她说得很轻松，像在讲别人的事。然后立刻岔开了话题，问你要不要吃一半的咖喱面包。',
    en: 'She says it lightly, as though it happened to someone else. Then she changes the subject at once and offers you half a curry bun.'
  },
  {
    type: 'effect',
    setFlags: ['day1_roof_lunch'],
    relations: [{ char: CharacterId.HIKARI, familiarity: 8, affection: 4, reasonZh: '她把自己那一周说出来了，虽然只说了一句', reasonEn: 'She told you about that week. One sentence of it, anyway' }]
  },

  // ==========================================================
  // 【Scene 9】放学后 · 决定性分叉
  // ==========================================================
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
  {
    type: 'choice',
    promptZh: '回家之前，你还有一下午。',
    promptEn: 'You have an afternoon before you have to go home.',
    options: [
      {
        id: 'day1_go_gym',
        labelZh: '体育馆那边一直有球撞地板的声音',
        labelEn: 'There has been a ball hitting the floor in the gym all afternoon',
        hintZh: '整个下午，节奏一直没乱过',
        hintEn: 'All afternoon, and the rhythm has not slipped once.',
        setFlags: ['day1_route_gym'],
        then: DAY1_GYM
      },
      {
        id: 'day1_go_library',
        labelZh: '去图书馆——想查查外公地图上那些地名',
        labelEn: 'The library — you want to look up the place names on that map',
        hintZh: '手账上有几个地名，你在现在的地图上找不到',
        hintEn: 'A few of the names in the journal are not on any map you can find.',
        setFlags: ['day1_route_library'],
        then: DAY1_LIBRARY
      },
      {
        id: 'day1_go_arcade',
        labelZh: '往三宫走，钻进商店街',
        labelEn: 'Head for Sannomiya and into the arcade',
        hintZh: '冰箱还是空的，而且你想听人正常说话',
        hintEn: 'The fridge is still empty, and you want to hear people talk at normal speed.',
        setFlags: ['day1_route_arcade'],
        then: DAY1_ARCADE
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
  {
    type: 'effect',
    setFlags: ['day1_done'],
    effects: [{ stat: 'knowledge', amount: 1, reasonZh: '第一天在这座城市里活下来了', reasonEn: 'You got through the first day in this city' }]
  }
];
