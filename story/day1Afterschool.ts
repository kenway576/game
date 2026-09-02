import { StoryNode, CharacterId } from '../types';

// ---------------------------------------------------------
// 【第1章】放学后 + 傍晚
//
// 结构（改版）：
//   深度相遇 1 人（你选的那条路）
//   + 擦肩而过 1 人（剩下两个里随机，重玩不一样）
//   + 傍晚必遇 稻荷 和 奈绪
// 于是一周目 8 个人全都露面，但"跟谁真正说上话"仍然由玩家决定。
//
// 【致敬 / 玩梗】
// 这一章开始把动漫梗铺进去，主角本人也会吐槽自己像在动漫里。
//   · 铃    → 长门有希（凉宫春日）：空教室角落里永远在看书、
//             面无表情、说话极短、偶尔丢出一句听不懂但很重要的话
//   · 空    → 体育会系热血担当，说话全是运动比喻
//   · 真希  → 关西腔小恶魔后辈，嘴上不饶人
//   · 稻荷  → 活了太久的神明，时间尺度和人不一样
//   · 奈绪  → 幼驯染。这里玩了「幼馴染は負けヒロイン」这个圈内老梗——
//             让她自己说出来，而且她说的时候是半开玩笑半认真的
// ---------------------------------------------------------

const SORA  = '/images/characters/sora/';
const REI   = '/images/characters/rei/';
const MAKI  = '/images/characters/maki/';
const INARI = '/images/characters/inari/';
const NAO   = '/images/characters/nao/';

// ==========================================================
// 深度路线 A：体育馆 —— 空
// ==========================================================
export const DAY1_GYM: StoryNode[] = [
  { type: 'scene', scene: 'gym', bgm: 'town', titleZh: '体育馆', titleEn: 'The Gymnasium', subtitleZh: '下午 4:20', subtitleEn: '4:20 PM' },
  {
    type: 'narration',
    zh: '你循着声音走过去。篮球砸在地板上的闷响，一下，一下，节奏稳得像节拍器。',
    en: 'You follow the sound. A basketball hitting the floor, once, and again, with the steadiness of a metronome.'
  },
  {
    type: 'narration',
    characterImage: `${SORA}happy.webp`,
    zh: '一个短发女生正在罚球线上练投篮。她投进第七个的时候看见了你，球在指尖上停住。',
    en: 'A short-haired girl is shooting free throws. She sinks the seventh, spots you, and the ball stops dead on her fingertips.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${SORA}happy.webp`,
    jp: 'お、転校生じゃん。見学？それとも——やる？',
    words: [{ jp: '見学', reading: 'けんがく', zh: '参观、旁观', en: 'to watch / observe' }],
    zh: '哦，转学生。来参观？还是说——要来一局？',
    en: 'Oh, the transfer kid. Here to watch? Or — you playing?',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她把球扔过来。你没接住，球在脚边弹了两下滚开了。她笑得很大声，一点没客气。',
    en: 'She throws the ball. You do not catch it. It bounces twice at your feet and rolls away. She laughs, loudly, without a shred of politeness.'
  },
  {
    type: 'choice',
    promptZh: '球滚到墙边停下了。',
    promptEn: 'The ball rolls to the wall and stops.',
    options: [
      {
        id: 'sora_trope',
        labelZh: '「转学生、放学后、空无一人的体育馆……这展开我在哪儿见过。」',
        labelEn: '"Transfer student, after school, an empty gym... I have seen this episode."',
        hintZh: '即视感强到有点可疑',
        hintEn: 'The déjà vu is frankly suspicious.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你把气氛的尴尬变成了一个笑话', reasonEn: 'You turned the awkwardness into a joke' }],
        relations: [{ char: CharacterId.SORA, familiarity: 20, affection: 4, reasonZh: '她笑到要扶墙', reasonEn: 'She had to hold onto the wall' }],
        setFlags: ['day1_sora_trope'],
        then: [
          {
            type: 'narration',
            characterImage: `${SORA}happy.webp`,
            zh: '她愣了两秒，然后笑得弯下腰去，一只手撑着膝盖。',
            en: 'She blanks for two seconds, then doubles over, one hand on her knee.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${SORA}happy.webp`,
            jp: 'あはははっ！なんやそれ！……ほな次は、夕陽が差し込んでこなあかんな。',
            zh: '啊哈哈哈！什么啊那是！……那下一步，得有夕阳照进来才行吧。',
            en: 'Ahahaha! What is that! ...Right, so next the sunset has to come through the window, yeah?',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '你们俩同时看向西面的高窗。夕阳确实正好照进来，斜斜地铺在地板上。',
            en: 'You both look at the high west-facing windows at the same time. The sunset is, in fact, coming through, laid at an angle across the floor.'
          },
          {
            type: 'narration',
            zh: '两个人又笑了一次。',
            en: 'You both laugh again.'
          }
        ]
      },
      {
        id: 'sora_pick',
        labelZh: '走过去把球捡回来，扔还给她',
        labelEn: 'Walk over, pick the ball up, throw it back',
        hintZh: '接不住，至少能捡',
        hintEn: 'You cannot catch. You can at least fetch.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '没有站在原地尴尬', reasonEn: 'You did not just stand there' }],
        relations: [{ char: CharacterId.SORA, familiarity: 14, affection: 2, reasonZh: '你把球扔回来了，姿势很烂但扔到了', reasonEn: 'You threw it back. Badly, but you threw it back' }],
        then: [
          {
            type: 'narration',
            zh: '你的传球歪得离谱，她横跨两步单手接住，动作轻得像顺手拂了一下。',
            en: 'Your pass is wildly off. She crosses two steps and takes it one-handed, as casually as brushing something aside.'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${SORA}happy.webp`,
    jp: 'よし、交換な。ウチが体育教えたるから、そっちは日本語教えて。',
    words: [{ jp: '交換', reading: 'こうかん', zh: '交换', en: 'exchange / swap' }],
    zh: '好，那就交换。我教你运动，你教我日语。',
    en: 'Right. Trade. I teach you sport, you teach me Japanese.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你想说自己的日语才是需要人教的那个。但她已经在算课表了。',
    en: 'You want to point out that your Japanese is the one that needs teaching. She is already working out a timetable.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_sora', 'day1_deep_sora'],
    effects: [{ stat: 'guts', amount: 2, reasonZh: '在体育馆门口没有转身就走', reasonEn: 'You did not turn around at the gym door' }],
    relations: [{ char: CharacterId.SORA, familiarity: 12, reasonZh: '接下了一个明显不对等的交换', reasonEn: 'You accepted a distinctly lopsided trade' }]
  }
];

// ==========================================================
// 深度路线 B：图书馆 —— 铃（致敬长门有希）
// ==========================================================
export const DAY1_LIBRARY: StoryNode[] = [
  { type: 'scene', scene: 'school_library', bgm: 'chat', titleZh: '图书馆', titleEn: 'The Library', subtitleZh: '下午 4:20 · 西晒', subtitleEn: '4:20 PM · Western light' },
  {
    type: 'narration',
    zh: '西晒的光斜穿过书架，把地板切成一条一条。整个阅览室只有翻页的声音。',
    en: 'Late sun cuts through the shelves and lays the floor out in stripes. The only sound in the whole reading room is pages turning.'
  },
  {
    type: 'narration',
    characterImage: `${REI}casual_reading.webp`,
    zh: '最里面那张桌子，靠窗，正对夕阳。一个人坐在那儿看书，一动不动，连翻页的手都像是按秒表在动。',
    en: 'The furthest table, by the window, facing the sun. Someone is sitting there reading, completely still, turning pages as if to a stopwatch.'
  },
  {
    type: 'narration',
    zh: '——空教室、靠窗的位子、永远在看书的沉默女生。你脑子里有个声音说：这个构图你见过一百遍了。',
    en: '—An empty room, a seat by the window, a silent girl who is always reading. Some part of your brain says: you have seen this composition a hundred times.'
  },
  { type: 'branch', ifFlag: 'prologue_met_rei', then: [
    {
      type: 'speech',
      speakerZh: '铃', speakerEn: 'Rei',
      characterImage: `${REI}casual_neutral.webp`,
      jp: '……昨日の。',
      zh: '……昨天那位。',
      en: '...From yesterday.',
      color: 'bg-emerald-500'
    },
    {
      type: 'narration',
      zh: '她没有抬头。你甚至不确定她是什么时候发现你的。',
      en: 'She does not look up. You are not even sure when she noticed you.'
    }
  ]},
  { type: 'branch', ifFlag: 'prologue_met_rei', not: true, then: [
    {
      type: 'speech',
      speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
      characterImage: `${REI}casual_neutral.webp`,
      jp: '……座っても、いい。',
      zh: '……可以坐。',
      en: '...You may sit.',
      color: 'bg-emerald-500'
    },
    {
      type: 'narration',
      zh: '不是疑问句。她也没有抬头。你甚至不确定她是什么时候发现你的。',
      en: 'Not a question. She does not look up either. You are not even sure when she noticed you.'
    }
  ]},
  {
    type: 'choice',
    promptZh: '桌上摊着五六本书，全都翻开着。',
    promptEn: 'Five or six books lie open on the table at once.',
    options: [
      {
        id: 'rei_trope',
        labelZh: '「……你该不会是那种，其实是外星人做的观测终端吧。」',
        labelEn: '"...You are not secretly an observation terminal built by aliens, are you."',
        hintZh: '这个场景实在太像某部动画了',
        hintEn: 'The scene resembles a certain anime a little too closely.',
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '对一个刚认识的人开这种玩笑，需要点胆量', reasonEn: 'That is a bold joke to make at someone you just met' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 20, affection: 4, reasonZh: '她给了一个你完全没料到的回答', reasonEn: 'She gave you an answer you did not see coming' }],
        setFlags: ['day1_rei_trope'],
        then: [
          {
            type: 'narration',
            characterImage: `${REI}casual_neutral.webp`,
            zh: '她终于抬起头。镜片后面那双眼睛看了你整整三秒，没有任何表情。',
            en: 'She finally looks up. Behind the lenses, her eyes rest on you for a full three seconds, with no expression whatsoever.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}casual_neutral.webp`,
            jp: '……否定はしません。',
            words: [{ jp: '否定', reading: 'ひてい', zh: '否定、否认', en: 'denial' }],
            zh: '……我不否认。',
            en: '...I will not deny it.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你的后背窜过一阵凉气。三秒之后她补了一句——',
            en: 'Something cold goes up your back. Three seconds later she adds—'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}casual_smile.webp`,
            jp: '……というのは、冗談です。',
            zh: '……这句是玩笑。',
            en: '...That was a joke.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她的表情从头到尾没有变过。你完全无法判断哪一句才是玩笑。',
            en: 'Her face did not change once, start to finish. You have no way of telling which half was the joke.'
          }
        ]
      },
      {
        id: 'rei_books',
        labelZh: '低头看那几本书的标题',
        labelEn: 'Read the titles on the table',
        hintZh: '认得一半的汉字',
        hintEn: 'You recognise about half the characters.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '硬啃下了几个建筑术语', reasonEn: 'You chewed through a few architectural terms' }],
        relations: [{ char: CharacterId.REI, familiarity: 14, affection: 2, reasonZh: '你真的去看了那些书名', reasonEn: 'You actually read the titles' }],
        then: [
          {
            type: 'narration',
            zh: '《神戸居留地建築図譜》《異人館の意匠》。中间夹着一张手绘的街区草图，比印刷的还精细。',
            en: 'Architectural plates of the Kobe foreign settlement. A study of Western-house ornament. Between them, a hand-drawn sketch of a street block, finer than the printed plates.',
            words: [{ jp: '建築', reading: 'けんちく', zh: '建筑', en: 'architecture' }]
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
    characterImage: `${REI}casual_neutral.webp`,
    jp: '……趣味です。誰にも頼まれていません。',
    zh: '……是兴趣。没有人要求我做。',
    en: '...It is a hobby. Nobody asked me to do it.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '这句话的语气，像是提前替自己挡掉了一个还没有人问出口的问题。',
    en: 'She says it in the tone of someone deflecting a question nobody has asked yet.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_rei', 'day1_deep_rei'],
    effects: [{ stat: 'knowledge', amount: 1, reasonZh: '知道了这座城市有人在认真研究它', reasonEn: 'You learned that someone studies this city seriously' }],
    relations: [{ char: CharacterId.REI, familiarity: 10, reasonZh: '你没有笑她的兴趣', reasonEn: 'You did not laugh at what she does for fun' }]
  }
];

// ==========================================================
// 深度路线 C：商店街 —— 真希
// ==========================================================
export const DAY1_ARCADE: StoryNode[] = [
  { type: 'scene', scene: 'sannomiya_arcade', bgm: 'town', titleZh: '三宫商店街', titleEn: 'Sannomiya Arcade', subtitleZh: '下午 4:40 · 人最多的时候', subtitleEn: '4:40 PM · Peak hour' },
  {
    type: 'narration',
    zh: '拱廊下面全是人。放学的、下班的、推着婴儿车的，声音混成一片你听不清任何一句的背景音。',
    en: 'The arcade is packed. Students, people off work, someone pushing a pram — all of it blending into a wall of sound you cannot pick a single sentence out of.'
  },
  { type: 'branch', ifFlag: 'prologue_met_maki', then: [
    {
      type: 'narration',
      characterImage: `${MAKI}punk_smug.webp`,
      zh: '章鱼烧摊子前面，那个粉头发的女生正回头看你。她显然是先看见你的。',
      en: 'In front of the takoyaki stand, the pink-haired girl is already looking your way. She clearly saw you first.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_smug.webp`,
      jp: 'お、来たな。……で？「おおきに」、言えるようになった？',
      zh: '哦，来了啊。……怎么样？会说「おおきに」了吗？',
      en: 'Oh, you turned up. ...Well? Can you say "ookini" yet?',
      color: 'bg-pink-500'
    }
  ]},
  { type: 'branch', ifFlag: 'prologue_met_maki', not: true, then: [
    {
      type: 'narration',
      characterImage: `${MAKI}punk_neutral.webp`,
      zh: '你在章鱼烧摊子前停下来看菜单。旁边有人往你这边挪了半步。',
      en: 'You stop at a takoyaki stand to read the menu. Someone beside you shifts half a step closer.'
    },
    {
      type: 'speech',
      speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
      characterImage: `${MAKI}punk_neutral.webp`,
      jp: 'なあ自分、それ読めてへんやろ。',
      zh: '喂你，那个你根本看不懂吧。',
      en: 'Oi, you. You cannot read that, can you.',
      color: 'bg-pink-500'
    }
  ]},
  {
    type: 'narration',
    zh: '她说得对。菜单上一半是手写的，字连在一起，你一个都拆不开。',
    en: 'She is right. Half the menu is handwritten, the characters running into each other, and you cannot pull a single one apart.'
  },
  {
    type: 'choice',
    promptZh: '她已经把手伸过来要拿你的钱包了。',
    promptEn: 'She is already reaching for your wallet.',
    options: [
      {
        id: 'maki_trope',
        labelZh: '「等等——嚣张的关西腔后辈，这人设我太熟了。」',
        labelEn: '"Hold on — cocky Kansai-accent underclassman. I know this character type."',
        hintZh: '你甚至能猜到她下一句要说什么',
        hintEn: 'You can practically predict her next line.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '当面拆穿一个后辈的人设，很勇', reasonEn: 'Calling out an underclassman to her face takes something' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 20, affection: 5, reasonZh: '她被说中了，而且不太甘心', reasonEn: 'You got it right, and she did not enjoy that' }],
        setFlags: ['day1_maki_trope'],
        then: [
          {
            type: 'narration',
            characterImage: `${MAKI}punk_angry.webp`,
            zh: '她的手停在半空。',
            en: 'Her hand stops in mid-air.'
          },
          {
            type: 'speech',
            speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
            characterImage: `${MAKI}punk_angry.webp`,
            jp: 'はぁ！？人を勝手にキャラ扱いすなや！……ウチはウチやし！',
            words: [{ jp: '勝手', reading: 'かって', zh: '擅自、随便', en: 'arbitrarily / as one pleases' }],
            zh: '哈！？别擅自把人当成角色啊！……我就是我！',
            en: 'Haaah?! Do not go filing people as character types! ...I am me, thanks!',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            characterImage: `${MAKI}punk_pout.webp`,
            zh: '她别过脸去，耳朵有点红。三秒之后，很小声地：',
            en: 'She turns away. The tips of her ears are pink. Three seconds later, very quietly:'
          },
          {
            type: 'speech',
            speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
            characterImage: `${MAKI}punk_pout.webp`,
            jp: '……で、当たってんのがいちばんムカつくわ。',
            zh: '……而且被你说中了才是最气人的。',
            en: '...And the most annoying part is that you are right.',
            color: 'bg-pink-500'
          }
        ]
      },
      {
        id: 'maki_ask',
        labelZh: '老实承认：「读めません。教えてください。」',
        labelEn: 'Admit it: "I cannot read it. Please teach me."',
        hintZh: '外公说过：遇到不懂的，大大方方地问',
        hintEn: 'Your grandfather wrote it down: when you do not understand, ask, openly.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '把不会就说不会，这也是一种本事', reasonEn: 'Saying you cannot is its own skill' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 14, affection: 2, reasonZh: '她最烦装懂的人', reasonEn: 'The one thing she cannot stand is people pretending' }],
        then: [
          {
            type: 'narration',
            characterImage: `${MAKI}punk_smug.webp`,
            zh: '她挑了挑眉，像是没料到你这么干脆。',
            en: 'Her eyebrows go up. She did not expect you to fold that fast.'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
    characterImage: `${MAKI}punk_laugh.webp`,
    jp: 'ソース、しょうゆ、ねぎポン。どれ？',
    words: [{ jp: '読む', reading: 'よむ', zh: '读、念', en: 'to read' }],
    zh: '酱汁、酱油、葱柚子醋。要哪个？',
    en: 'Sauce, soy, spring onion and ponzu. Which.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '你指了一个。她朝摊主喊了一句，语速快得像一个词。三十秒后你手里就多了一盒热的。',
    en: 'You point at one. She fires something at the stall owner, so fast it sounds like a single word. Thirty seconds later there is a hot tray in your hands.'
  },
  {
    type: 'narration',
    characterImage: `${MAKI}punk_smug.webp`,
    zh: '「センパイ、金は自分で払いや」——她说完退开半步，看你付钱。',
    en: '"You are paying for that yourself, senpai." She steps back half a pace and watches you hand over the money.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_maki', 'day1_deep_maki'],
    effects: [{ stat: 'charm', amount: 1, reasonZh: '被一个不认识的后辈当场认领了', reasonEn: 'You were claimed on the spot by an underclassman you do not know' }],
    relations: [{ char: CharacterId.MAKI, familiarity: 12, affection: 2, reasonZh: '她开始叫你「センパイ」了', reasonEn: 'She started calling you senpai' }]
  }
];

// ==========================================================
// 擦肩而过：没走那条路的人，也让你看见一眼
// ==========================================================
const CAMEO_SORA: StoryNode[] = [
  {
    type: 'narration',
    characterImage: `${SORA}happy.webp`,
    zh: '经过体育馆侧门时，里面传来一声很响的「ナイッシュー！」。你往里看了一眼——一个短发女生正一个人练投篮，投进了还自己给自己喊了一声好。',
    en: 'Passing the side door of the gym you hear a very loud "nice shot!" from inside. You glance in: a short-haired girl practising free throws alone, calling her own shots.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_sora'],
    relations: [{ char: CharacterId.SORA, familiarity: 4, reasonZh: '你在体育馆门口看了一眼', reasonEn: 'You looked in at the gym door' }]
  }
];

const CAMEO_REI: StoryNode[] = [
  {
    type: 'narration',
    characterImage: `${REI}casual_reading.webp`,
    zh: '路过图书馆，门开着。靠窗最里面那张桌子上摊着五六本书，一个戴红框眼镜的女生坐在后面，一动不动。',
    en: 'You pass the library. The door is open. At the furthest table by the window, five or six books lie open, and a girl in red-framed glasses sits behind them, completely still.'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '你走出十几米，忽然意识到刚才那半分钟里，她一次都没有动过。',
    en: 'Ten metres on, it occurs to you that in that half minute she did not move once.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_rei'],
    relations: [{ char: CharacterId.REI, familiarity: 4, reasonZh: '你在图书馆门口停了半分钟', reasonEn: 'You paused half a minute at the library door' }]
  }
];

const CAMEO_MAKI: StoryNode[] = [
  {
    type: 'narration',
    characterImage: `${MAKI}punk_laugh.webp`,
    zh: '校门口有个粉头发的女生正倒着走路，一边冲身后的人大声说着什么。她胸前的领结颜色和你们班不一样——低一届的。',
    en: 'A pink-haired girl is walking backwards out of the school gate, hollering something at someone behind her. Her ribbon is a different colour from your class. A year below.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_maki'],
    relations: [{ char: CharacterId.MAKI, familiarity: 4, reasonZh: '在校门口撞见过一次', reasonEn: 'You caught sight of her at the gate' }]
  }
];

// 没走的那两条路，随机演一条
export const DAY1_CAMEO_AFTER_GYM: StoryNode = { type: 'random', pick: [CAMEO_REI, CAMEO_MAKI] };
export const DAY1_CAMEO_AFTER_LIB: StoryNode = { type: 'random', pick: [CAMEO_SORA, CAMEO_MAKI] };
export const DAY1_CAMEO_AFTER_ARC: StoryNode = { type: 'random', pick: [CAMEO_SORA, CAMEO_REI] };

// ==========================================================
// 傍晚：稻荷 → 奈绪（两个都必遇，让 8 个人在一周目里全部露面）
// ==========================================================
export const DAY1_EVENING: StoryNode[] = [
  { type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'night', titleZh: '生田神社 · 鸟居前', titleEn: 'Ikuta Shrine · The Torii', subtitleZh: '傍晚 6:05', subtitleEn: '6:05 PM' },
  {
    type: 'narration',
    zh: '回家的路要绕过神社。外公的地图上，这里画得比别处都重——同一个鸟居描了三遍。',
    en: 'The way home goes around the shrine. On your grandfather’s map this spot is drawn heavier than anywhere else: the same torii traced three times over.'
  },
  {
    type: 'narration',
    characterImage: `${INARI}casual_neutral.webp`,
    zh: '鸟居底下坐着一个人。白发，赤脚，脚边放着一双没穿的木屐。四月的傍晚已经很凉了。',
    en: 'Someone is sitting under the torii. White hair, bare feet, a pair of unworn geta set beside her. April evenings here are already cold.'
  },
  {
    type: 'speech',
    speakerZh: '白发的女子', speakerEn: 'White-haired Woman',
    characterImage: `${INARI}casual_happy.webp`,
    jp: 'ふぅん。……その地図、ずいぶん古いのう。',
    words: [{ jp: '古い', reading: 'ふるい', zh: '旧的、古老的', en: 'old' }],
    zh: '唔嗯。……你那张地图，可真够旧的呀。',
    en: 'Hmm. ...That map of yours is quite old, is it not.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '你手里的手账是合着的，塞在书包侧袋里。',
    en: 'The journal is closed, wedged into the side pocket of your bag.'
  },
  {
    type: 'choice',
    promptZh: '她说话的调子，像是从很远的地方传过来的。',
    promptEn: 'Her voice arrives as if from somewhere much further away than she is.',
    options: [
      {
        id: 'inari_trope',
        labelZh: '「……好，我明白了。这游戏是有超自然线的对吧。」',
        labelEn: '"...Right. Okay. So this one has a supernatural route."',
        hintZh: '白发、赤脚、神社、说话像谜语。够明显了',
        hintEn: 'White hair, bare feet, a shrine, riddles. The signs are not subtle.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你对着一个明显不太对劲的人开了口', reasonEn: 'You spoke up at someone visibly not quite right' }],
        relations: [{ char: CharacterId.INARI, familiarity: 16, affection: 4, reasonZh: '她被逗乐了，笑了很久', reasonEn: 'She found that funny, and kept finding it funny' }],
        setFlags: ['day1_inari_trope'],
        then: [
          {
            type: 'narration',
            characterImage: `${INARI}casual_happy.webp`,
            zh: '她笑了。不是礼貌性的那种——是真的被逗到了，笑得肩膀直抖，笑了很久。',
            en: 'She laughs. Not politely: genuinely, shoulders shaking, and she keeps going for a while.'
          },
          {
            type: 'speech',
            speakerZh: '白发的女子', speakerEn: 'White-haired Woman',
            characterImage: `${INARI}casual_happy.webp`,
            jp: 'くくく……そういう言い方をした人の子は、そなたで四人目じゃ。',
            words: [{ jp: '人の子', reading: 'ひとのこ', zh: '人类（神明对人的称呼）', en: 'child of man' }],
            zh: '呵呵呵……用这种说法的人类，你是第四个。',
            en: 'Heh heh... You are the fourth child of man to put it quite like that.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '第四个。你想问前三个是什么时候的事，但你忽然不太确定自己想不想知道答案。',
            en: 'The fourth. You want to ask when the other three were. You find you are not certain you want the answer.'
          }
        ]
      },
      {
        id: 'inari_polite',
        labelZh: '鞠一躬，问她这一带是不是有什么典故',
        labelEn: 'Bow, and ask whether this place has some history to it',
        hintZh: '外公的地图上，这里描了三遍',
        hintEn: 'Your grandfather traced this one spot three times.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '她讲了一段哪本书上都没有的来历', reasonEn: 'She told you a history that is in no book' }],
        relations: [{ char: CharacterId.INARI, familiarity: 12, affection: 2, reasonZh: '你对着一座神社问了正经问题', reasonEn: 'You asked a serious question at a shrine' }],
        then: [
          {
            type: 'speech',
            speakerZh: '白发的女子', speakerEn: 'White-haired Woman',
            characterImage: `${INARI}casual_neutral.webp`,
            jp: '典故なぞ、いくらでもあるわ。……千八百年ぶんもな。',
            zh: '典故嘛，要多少有多少。……足足一千八百年份的。',
            en: 'History? There is as much of it as you like. ...Eighteen centuries of it.',
            color: 'bg-amber-500'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    characterImage: `${INARI}casual_smug.webp`,
    zh: '你低头想把手账拿出来。再抬头时，鸟居底下已经没有人了——木屐还在原地，整整齐齐地摆着。',
    en: 'You look down to get the journal out. When you look up, there is no one under the torii. The geta are still there, set down neatly, side by side.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_inari'],
    relations: [{ char: CharacterId.INARI, familiarity: 6, reasonZh: '她记住了那张地图', reasonEn: 'She took note of that map' }]
  },

  // ---- 坡道口 · 奈绪 ----
  { type: 'scene', scene: 'street', bgm: 'night', titleZh: '海风庄 · 坡道口', titleEn: 'The Foot of the Slope', subtitleZh: '傍晚 6:40', subtitleEn: '6:40 PM' },
  {
    type: 'narration',
    characterImage: `${NAO}casual_neutral.webp`,
    zh: '坡道口有人在等。手里拎着两袋东西，看见你就把其中一袋举起来晃了晃。',
    en: 'Someone is waiting at the foot of the slope, holding two shopping bags. She lifts one of them and waves it at you.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_angry.webp`,
    jp: '遅い。何時だと思ってんの。',
    zh: '好慢。你以为几点了。',
    en: 'You are late. What time do you think it is.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '十年了，她生气的样子一点没变。变的是背景——现在她身后是神户的坡道，不是你们从小走的那条街。',
    en: 'Ten years, and the way she gets annoyed has not changed at all. What has changed is the background: behind her is a Kobe hillside now, not the street you both grew up on.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_neutral.webp`,
    jp: '……で、どうだった。初日。',
    zh: '……那，怎么样。第一天。',
    en: '...So. How was it. Day one.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '你说了几个名字。她一边听一边点头，点到第三个的时候，点头的幅度小了一点。',
    en: 'You list a few names. She nods along, and somewhere around the third one the nodding gets smaller.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_cold.webp`,
    jp: 'ふーん。……一日で、ずいぶん増えたね。',
    zh: '哦——。……一天就认识这么多了啊。',
    en: 'Huh. ...That is quite a lot, for one day.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '她说完自己也愣了一下，像是没料到这句话会从自己嘴里出来。然后立刻把袋子塞给你。',
    en: 'She seems startled by her own sentence, as though she had not expected it to come out of her. Then she shoves a bag into your hands.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_neutral.webp`,
    jp: '……はい、これ。米と、卵と、あと味噌。あんた絶対買ってないでしょ。',
    words: [{ jp: '味噌', reading: 'みそ', zh: '味噌', en: 'miso' }],
    zh: '……给，这个。米、鸡蛋，还有味噌。你肯定没买吧。',
    en: '...Here. Rice, eggs, miso. You absolutely did not buy any of it.',
    color: 'bg-rose-500'
  },
  {
    type: 'choice',
    promptZh: '袋子比看上去沉。她从三宫一路拎上来的。',
    promptEn: 'The bag is heavier than it looks. She carried it all the way up from Sannomiya.',
    options: [
      {
        id: 'nao_trope',
        labelZh: '「……你知道吗，你现在这个位置，在动画里叫幼驯染。」',
        labelEn: '"...You know the role you are playing right now has a name, right."',
        hintZh: '坡道口等人、拎着一袋米、嘴上嫌你',
        hintEn: 'Waiting at the bottom of a hill with a bag of rice, complaining.',
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你说了一句她一直在等的话', reasonEn: 'You said the thing she had been waiting for someone to say' }],
        relations: [{ char: CharacterId.NAO, affection: 8, familiarity: 4, reasonZh: '她笑着骂了你，但没有否认', reasonEn: 'She swore at you, laughing, and did not deny it' }],
        setFlags: ['day1_nao_trope'],
        then: [
          {
            type: 'narration',
            characterImage: `${NAO}casual_angry.webp`,
            zh: '她一巴掌拍在你胳膊上，力道相当实在。',
            en: 'She smacks your arm. There is genuine force in it.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${NAO}casual_angry.webp`,
            jp: 'うるさいっ！……知ってるわよ、そんなの。',
            zh: '吵死了！……那种事我知道啦。',
            en: 'Shut up! ...I know that, obviously.',
            color: 'bg-rose-500'
          },
          {
            type: 'narration',
            zh: '然后她往前走了两步，背对着你，声音低下来——',
            en: 'Then she walks two steps ahead, keeping her back to you, and her voice drops—'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${NAO}casual_cold.webp`,
            jp: '幼馴染は負けるって、相場が決まってんでしょ。',
            words: [{ jp: '相場', reading: 'そうば', zh: '行情、通例', en: 'the going rate / how it usually goes' }],
            zh: '幼驯染是会输的，这不是老规矩了吗。',
            en: 'The childhood friend loses. That is how it always goes, is it not.',
            color: 'bg-rose-500'
          },
          {
            type: 'narration',
            zh: '你张嘴想说点什么。她已经转过身来了，脸上是平时那个表情。',
            en: 'You open your mouth. She has already turned round, wearing her usual face.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${NAO}casual_happy.webp`,
            jp: '——なーんてね。ほら、米重いんだから早く歩く。',
            zh: '——开玩笑的啦。快走，米很重欸。',
            en: '—Kidding. Come on, that rice is heavy, walk faster.',
            color: 'bg-rose-500'
          },
          {
            type: 'narration',
            zh: '你跟上去。一路上你都在想，刚才那句"开玩笑的"，到底是哪一句的注解。',
            en: 'You follow her up. The whole way, you are trying to work out which of those sentences the "kidding" was attached to.'
          }
        ]
      },
      {
        id: 'nao_thanks',
        labelZh: '接过袋子，认真地说谢谢',
        labelEn: 'Take the bag, and thank her properly',
        hintZh: '她从三宫一路拎上来的',
        hintEn: 'She carried this up from Sannomiya.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有把她的好意当成理所当然', reasonEn: 'You did not take it for granted' }],
        relations: [{ char: CharacterId.NAO, affection: 5, familiarity: 3, reasonZh: '她被正经道谢，反而不知道该怎么办', reasonEn: 'Thanked sincerely, she had no idea what to do with it' }],
        then: [
          {
            type: 'narration',
            characterImage: `${NAO}casual_shy.webp`,
            zh: '她愣了一下，然后飞快地转过身往坡上走。',
            en: 'She freezes, then turns and starts up the slope very quickly.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${NAO}casual_shy.webp`,
            jp: '……べつに。ついでだし。',
            zh: '……没什么。顺路而已。',
            en: '...It is nothing. It was on my way.',
            color: 'bg-rose-500'
          },
          {
            type: 'narration',
            zh: '三宫到北野，怎么算都不顺路。',
            en: 'Sannomiya to Kitano is not on anybody’s way.'
          }
        ]
      }
    ]
  },
  {
    type: 'effect',
    setFlags: ['day1_met_nao'],
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '有人替你想到了米和味噌', reasonEn: 'Someone thought about your rice and miso for you' }],
    relations: [{ char: CharacterId.NAO, affection: 3, reasonZh: '她在坡道口等了很久', reasonEn: 'She waited a long time at the foot of that slope' }]
  }
];
