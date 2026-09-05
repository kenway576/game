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
        id: 'sora_mamba',
        labelZh: '把外套脱了。「让你见识一下什么叫曼巴精神。」',
        labelEn: 'Take the blazer off. "Let me show you what Mamba mentality looks like."',
        jp: 'マンバ・メンタリティってやつ、見せてあげる。',
        hintZh: '你打了十年球。刚才那一下只是没接住而已',
        hintEn: 'You have played for ten years. You just did not catch that one.',
        effects: [
          { stat: 'guts', amount: 2, reasonZh: '你在一个陌生国家的体育馆里报了自己的名号', reasonEn: 'You announced yourself in a gym in a country you had just arrived in' },
          { stat: 'charm', amount: 1, reasonZh: '她第一次收起了笑', reasonEn: 'It was the first time she stopped grinning' }
        ],
        relations: [{ char: CharacterId.SORA, familiarity: 24, affection: 8, reasonZh: '她找到了一个打得过她的人', reasonEn: 'She found someone who can take her' }],
        setFlags: ['day1_sora_mamba'],
        then: [
          {
            type: 'narration',
            zh: '你把制服外套脱下来搭在栏杆上。里面那件是从行李箱最上层翻出来的——昨晚拆行李时，它被你用来裹外公那本手账，防止路上磕坏。',
            en: 'You take off the blazer and hang it on the rail. What is underneath came out of the top of the suitcase: last night you had used it to wrap your grandfather\u2019s journal so it would not get knocked about on the way.'
          },
          {
            type: 'narration',
            zh: '紫金配色。背后一个大大的 24。',
            en: 'Purple and gold. A very large 24 on the back.'
          },
          {
            type: 'narration',
            characterImage: `${SORA}shock.webp`,
            zh: '空看着那个号码，看了整整三秒。她脸上那种"来玩玩嘛"的表情整个撤掉了。',
            en: 'Sora looks at the number for a full three seconds. The come-on-then look goes off her face entirely.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${SORA}shock.webp`,
            jp: '……二十四番。あんた、それ分かって着てんの？',
            zh: '……24 号。你知道自己穿的是什么才穿的吧？',
            en: '...Number twenty-four. You do know what you are wearing, right?',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '你把球捡起来，在指尖上颠了两下，然后从三分线外投了出去。',
            en: 'You pick the ball up, bounce it twice on your fingertips, and shoot from outside the arc.'
          },
          {
            type: 'narration',
            zh: '空心。整个体育馆只有网绳擦过的那一声。',
            en: 'Nothing but net. The only sound in the whole gym is the cord.'
          },
          {
            type: 'speech',
            speakerZh: '你', speakerEn: 'You',
            jp: 'この街の名前、なんて言うんでしたっけ。',
            words: [{ jp: '街', reading: 'まち', zh: '城市、街区', en: 'town / city' }],
            zh: '这座城市叫什么来着？',
            en: 'Remind me what this city is called?',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            characterImage: `${SORA}happy.webp`,
            zh: '她愣了两秒才反应过来，然后笑得整个人蹲了下去，笑声在空体育馆里绕了一圈才散。',
            en: 'It takes her two seconds. Then she folds up laughing, and the sound goes right round the empty gym before it fades.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${SORA}happy.webp`,
            jp: 'あかん、それずるい！神戸でそれ着られたら誰も文句言われへんやん！',
            words: [{ jp: 'ずるい', reading: 'ずるい', zh: '狡猾、耍赖', en: 'unfair / sly' }],
            zh: '不行，这太赖皮了！在神户穿这个谁还敢说你啊！',
            en: 'That is cheating! Wear that in Kobe and nobody can say a word to you!',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她站起来，把球从你手里抢回去，认真了。',
            en: 'She gets up, takes the ball back off you, and stops playing around.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${SORA}neutral.webp`,
            jp: '……もう一本。今度は本気でいくで。',
            zh: '……再来一个。这次我认真了。',
            en: '...One more. I am not going easy this time.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '接下来的四十分钟里，她一次都没有再让你。你输了，输得很服气。',
            en: 'For the next forty minutes she does not let you have a single one. You lose, and you have no complaints about it.'
          }
        ]
      },
      {
        id: 'sora_trope',
        labelZh: '「转学生、放学后、空无一人的体育馆……这展开我在哪儿见过。」',
        labelEn: '"Transfer student, after school, an empty gym... I have seen this episode."',
        jp: '転校生、放課後、誰もいない体育館……この展開、どこかで見たな。',
        words: [{ jp: '展開', reading: 'てんかい', zh: '展开、发展', en: 'how it unfolds' }],
        hintZh: '即视感强到有点可疑',
        hintEn: 'The déjà vu is frankly suspicious.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你把气氛的尴尬变成了一个笑话', reasonEn: 'You turned the awkwardness into a joke' }],
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
      },
      {
        id: 'sora_shoot',
        labelZh: '「……那一局。不过我不会打。」',
        labelEn: '"...Fine. One game. I do not know how to play, though."',
        jp: '……一本だけなら。でも、下手だよ。',
        words: [{ jp: '下手', reading: 'へた', zh: '不擅长', en: 'bad at it' }],
        hintZh: '她问了，你就答了',
        hintEn: 'She asked. You answered.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '在自己完全不行的项目上点了头', reasonEn: 'You said yes to the one thing you are certainly bad at' }
        ],
        relations: [{ char: CharacterId.SORA, familiarity: 18, affection: 5, reasonZh: '她教你投篮的时候比自己投还认真', reasonEn: 'She took teaching you the shot more seriously than her own' }],
        setFlags: ['day1_sora_played'],
        then: [
          {
            type: 'narration',
            characterImage: `${SORA}happy.webp`,
            zh: '她的表情亮了一下，像是听见了什么久违的好消息。',
            en: 'Her face lights up, as if she has heard some good news she had stopped expecting.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${SORA}happy.webp`,
            jp: 'それでええねん！できひんのは別に恥ずかしいことちゃうで。やらんのが恥ずかしいねん。',
            words: [{ jp: '恥ずかしい', reading: 'はずかしい', zh: '丢脸、难为情', en: 'embarrassing / shameful' }],
            zh: '这就对了！不会又不丢人。不做才丢人。',
            en: 'That is the spirit! Being bad at it is not embarrassing. Not doing it is.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '她走到你身后，两只手掰着你的手肘往里收，又把你的下巴抬起来对准篮筐。',
            en: 'She comes round behind you, tucks your elbows in with both hands, and tips your chin up until you are looking at the rim.'
          },
          {
            type: 'speech',
            speakerZh: '空', speakerEn: 'Sora',
            characterImage: `${SORA}happy.webp`,
            jp: '肘、内側。目はリングの手前のフチ。……ほい、投げてみ。',
            words: [{ jp: '肘', reading: 'ひじ', zh: '手肘', en: 'elbow' }],
            zh: '手肘，往里。眼睛看篮筐靠近你这一侧的边。……来，投。',
            en: 'Elbows in. Eyes on the near edge of the rim. ...Go on, shoot.',
            color: 'bg-orange-500'
          },
          {
            type: 'narration',
            zh: '球撞在篮板上弹了回来，砸在你肩膀上。你们俩都没躲。',
            en: 'The ball hits the backboard, comes straight back, and lands on your shoulder. Neither of you moves out of the way.'
          },
          {
            type: 'narration',
            zh: '第九次的时候进了。她没有欢呼，只是很用力地拍了一下你的背，力气大得你往前踉跄了半步。',
            en: 'The ninth one goes in. She does not cheer. She just claps you on the back hard enough to push you half a step forward.'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${SORA}happy.webp`,
    jp: 'よし、交換な。ウチが体育教えたるから、そっちは——',
    words: [{ jp: '交換', reading: 'こうかん', zh: '交换', en: 'exchange / swap' }],
    zh: '好，那就交换。我教你运动，你教我——',
    en: 'Right. Trade. I teach you sport, and you teach me—',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她卡住了。你看着她，等她想出来一个日本人能跟留学生换的东西。',
    en: 'She stalls. You wait, watching her try to find something a Japanese person could possibly want from an exchange student.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${SORA}shock.webp`,
    jp: '……英語。英語な。ウチ、赤点二回とってんねん。',
    words: [{ jp: '赤点', reading: 'あかてん', zh: '不及格分数', en: 'a failing grade' }],
    zh: '……英语。就英语。我英语挂过两次。',
    en: '...English. English. I have failed it twice.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她说完自己也愣了一下，像是没想到会把这个说出口。',
    en: 'She surprises herself with that, as though she had not planned to say it out loud.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${SORA}shy.webp`,
    jp: 'ええやろ別に。走んのは速いんやから。',
    zh: '有什么关系嘛。反正我跑得快。',
    en: 'So what. I am fast.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她把球抱在腰上，转身往器材室走了两步，又停下。',
    en: 'She tucks the ball against her hip, takes two steps toward the equipment room, and stops.'
  },
  {
    type: 'speech',
    speakerZh: '空', speakerEn: 'Sora',
    characterImage: `${SORA}neutral.webp`,
    jp: '……明日も来る？体育館、四時からずっと空いとるで。',
    words: [{ jp: '空く', reading: 'あく', zh: '空着、有空', en: 'to be free / vacant' }],
    zh: '……明天也来吗？体育馆从四点开始一直空着。',
    en: '...Coming tomorrow? The gym is free from four onward.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '她说的是「体育馆空着」，不是「我在」。你点了头。她这才转身进去，球在她手上转得比刚才快。',
    en: 'What she says is that the gym is free, not that she will be in it. You nod. Only then does she turn and go, the ball spinning faster on her hand than it was before.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_sora', 'day1_deep_sora'],
    effects: [{ stat: 'guts', amount: 1, reasonZh: '在体育馆门口没有转身就走', reasonEn: 'You did not turn around at the gym door' }],
    relations: [{ char: CharacterId.SORA, familiarity: 12, reasonZh: '她主动问了明天', reasonEn: 'She was the one who asked about tomorrow' }]
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
    characterImage: `${REI}thinking.webp`,
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
      characterImage: `${REI}neutral.webp`,
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
      characterImage: `${REI}neutral.webp`,
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
        jp: '……もしかして、宇宙人が作った観測用の端末だったりする？',
        words: [{ jp: '観測', reading: 'かんそく', zh: '观测', en: 'observation' }],
        hintZh: '这个场景实在太像某部动画了',
        hintEn: 'The scene resembles a certain anime a little too closely.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '对一个刚认识的人开这种玩笑，需要点胆量', reasonEn: 'That is a bold joke to make at someone you just met' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 20, affection: 4, reasonZh: '她给了一个你完全没料到的回答', reasonEn: 'She gave you an answer you did not see coming' }],
        setFlags: ['day1_rei_trope'],
        then: [
          {
            type: 'narration',
            characterImage: `${REI}neutral.webp`,
            zh: '她终于抬起头。镜片后面那双眼睛看了你整整三秒，没有任何表情。',
            en: 'She finally looks up. Behind the lenses, her eyes rest on you for a full three seconds, with no expression whatsoever.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}neutral.webp`,
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
            characterImage: `${REI}smile.webp`,
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
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '硬啃下了几个建筑术语', reasonEn: 'You chewed through a few architectural terms' }],
        relations: [{ char: CharacterId.REI, familiarity: 14, affection: 2, reasonZh: '你真的去看了那些书名', reasonEn: 'You actually read the titles' }],
        then: [
          {
            type: 'narration',
            zh: '《神戸居留地建築図譜》《異人館の意匠》。中间夹着一张手绘的街区草图，比印刷的还精细。',
            en: 'Architectural plates of the Kobe foreign settlement. A study of Western-house ornament. Between them, a hand-drawn sketch of a street block, finer than the printed plates.',
            words: [{ jp: '建築', reading: 'けんちく', zh: '建筑', en: 'architecture' }]
          }
        ]
      },
      {
        id: 'rei_sit',
        labelZh: '在她对面坐下，什么也不问',
        labelEn: 'Sit down across from her and ask nothing',
        hintZh: '图书室里有一种不用说话的规矩',
        hintEn: 'A library has rules about talking that nobody has to state.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '你没有打断一个正在专心的人', reasonEn: 'You did not interrupt someone who was concentrating' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 16, affection: 3, reasonZh: '她翻页的节奏一直没被打乱', reasonEn: 'Her page-turning never once lost its rhythm' }],
        setFlags: ['day1_rei_sat'],
        then: [
          {
            type: 'narration',
            characterImage: `${REI}thinking.webp`,
            zh: '你拉开对面的椅子坐下，把书包放在脚边，然后什么也没做。窗外的光从她那一侧斜进来，正好停在摊开的书页上。',
            en: 'You pull out the chair opposite, set your bag by your feet, and then do nothing at all. The light comes in past her side of the table and lands exactly on the open page.'
          },
          {
            type: 'narration',
            zh: '她翻了三页。你听见楼下操场有人在喊号子，声音隔着两层楼变得很软。',
            en: 'She turns three pages. Down on the field somebody is calling a count; through two floors it arrives soft.'
          },
          {
            type: 'narration',
            zh: '第四页翻过去之后，她把其中一本书转了个方向，推到你面前——没有说话，也没有抬头。',
            en: 'After the fourth page she turns one of the books around and pushes it across to you. Without a word, without looking up.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}neutral.webp`,
            jp: '……そこ、あなたが住んでいる坂です。五十年前の図面ですが。',
            words: [{ jp: '図面', reading: 'ずめん', zh: '图纸、设计图', en: 'plan / drawing' }],
            zh: '……那里，是你住的那条坡。虽然是五十年前的图。',
            en: '...That is the slope you live on. The drawing is fifty years old.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你没问她怎么知道你住哪儿。你觉得问了她也只会说「因为你的鞋上有北野那一段的红土」之类的话。',
            en: 'You do not ask how she knows where you live. You suspect the answer would be something like "there is Kitano clay on your shoes".'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
    characterImage: `${REI}neutral.webp`,
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
  // ---- 摊开的那张图 ----
  {
    type: 'narration',
    characterImage: `${REI}neutral.webp`,
    zh: '她把桌上那几本书往两边推开，中间空出来的地方摊了一张手绘的图。你凑近看了才发现，那是整个北野一带的立面测绘——每一栋洋馆的窗户数量、门楣样式、屋顶角度，全都标着数字。',
    en: 'She pushes the books aside and lays a hand-drawn sheet in the space between them. Leaning in, you realise it is an elevation survey of the whole of Kitano: every window counted, every doorway catalogued, every roof pitch marked with a figure.'
  },
  {
    type: 'narration',
    zh: '角落里写着日期。最早那一张是三年前的。',
    en: 'There are dates in the corner. The earliest sheet is three years old.'
  },
  {
    type: 'choice',
    promptZh: '她把图推到你能看清的角度，然后就不动了。',
    promptEn: 'She turns the sheet so you can see it properly, and then stops moving.',
    options: [
      {
        id: 'day1_rei_count',
        labelZh: '「这些数字……你一栋一栋数过来的？」',
        labelEn: '"These numbers... you counted them building by building?"',
        jp: 'この数字……一棟ずつ数えたの？',
        words: [{ jp: '数える', reading: 'かぞえる', zh: '数', en: 'to count' }],
        hintZh: '三年，一整片街区',
        hintEn: 'Three years. An entire district.',
        effects: [
          { stat: 'knowledge', amount: 1, reasonZh: '你搞清楚了这张图是怎么来的', reasonEn: 'You worked out what it took to make that sheet' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 14, affection: 4, reasonZh: '她第一次被问了"怎么做的"，而不是"为什么做"', reasonEn: 'For once she was asked how, not why' }],
        setFlags: ['day1_rei_counted'],
        then: [
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}neutral.webp`,
            jp: 'はい。全部で百三十一棟あります。うち、現存は八十四。',
            words: [{ jp: '現存', reading: 'げんそん', zh: '现存、还留着的', en: 'still standing / extant' }],
            zh: '是。一共一百三十一栋。其中还留着的有八十四栋。',
            en: 'Yes. One hundred and thirty-one in total. Eighty-four of them still standing.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她说这两个数字的时候没有任何停顿，就像在报自己的生日。',
            en: 'She gives both numbers without pausing, the way you would give your own birthday.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}neutral.webp`,
            jp: '去年は八十六でした。二棟、なくなりました。',
            zh: '去年是八十六。少了两栋。',
            en: 'Last year it was eighty-six. Two have gone.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '「なくなりました」这个词她说得很平。平到你花了两秒才反应过来，她是在说那两栋房子被拆了。',
            en: 'She says "have gone" completely levelly. Level enough that it takes you two seconds to understand she means they were demolished.'
          },
          {
            type: 'narration',
            characterImage: `${REI}smile.webp`,
            zh: '「所以要画。」她补了一句，然后把铅笔尖在纸上点了两下，落在那两栋的位置上。',
            en: '"That is why I draw them," she adds, and taps the pencil twice on the paper, on the two places where they used to be.'
          }
        ]
      },
      {
        id: 'day1_rei_own_map',
        labelZh: '把外公的手账掏出来，翻到那一页并排放上去',
        labelEn: "Get out your grandfather's journal and lay it open beside hers",
        hintZh: '同一片街区，隔了五十年',
        hintEn: 'The same district, fifty years apart.',
        effects: [
          { stat: 'charm', amount: 1, reasonZh: '你把自己最珍贵的那本递了出去', reasonEn: 'You handed over the thing you value most' },
          { stat: 'knowledge', amount: 1, reasonZh: '两张图对上了七条街', reasonEn: 'Seven streets lined up between the two sheets' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 18, affection: 6, reasonZh: '她把两张纸的边缘对齐了三次', reasonEn: 'She lined the edges of the two sheets up three times' }],
        setFlags: ['day1_rei_two_maps'],
        then: [
          {
            type: 'narration',
            zh: '你把手账翻到北野那一页，放在她那张图旁边。两张纸的比例完全不一样，但街的走向对得上。',
            en: 'You open the journal to the Kitano page and set it beside her sheet. The scales are completely different, but the streets run the same way.'
          },
          {
            type: 'narration',
            characterImage: `${REI}neutral.webp`,
            zh: '她沉默了很久。久到窗外的光又往里挪了半张桌子。',
            en: 'She is silent for a long time. Long enough that the light moves half a desk further in.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}neutral.webp`,
            jp: 'ここ、この道。わたしの図には無いんです。',
            zh: '这里，这条路。我的图上没有。',
            en: 'Here. This street. It is not on mine.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她的手指停在手账上一条很细的线上。那条线在她那张图里对应的位置，是一片空白。',
            en: 'Her finger rests on a very thin line in the journal. In the corresponding place on her own sheet there is nothing at all.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}neutral.webp`,
            jp: '……五十年前には、あったということですね。',
            zh: '……也就是说，五十年前是有的。',
            en: '...Which means fifty years ago it was there.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '她抬起头看你，镜片后面那双眼睛第一次有了明确的情绪。你分辨不出那是什么，但绝对不是「面无表情」。',
            en: 'She looks up at you, and behind the lenses there is a definite emotion for the first time. You cannot name it, but it is certainly not "no expression".'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}smile.webp`,
            jp: 'この本、いつか……もう一度、見せていただけませんか。',
            words: [{ jp: 'いつか', zh: '哪天、总有一天', en: 'someday' }],
            zh: '这本书，哪天……能再让我看一次吗。',
            en: 'This book. Someday. ...Might I be allowed to look at it again.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '这是今天她说的最长的一句话，也是唯一一句用了敬语的请求。',
            en: 'It is the longest sentence she has said today, and the only request she has phrased politely.'
          }
        ]
      },
      {
        id: 'day1_rei_leave',
        labelZh: '看了两分钟，然后说不打扰她了',
        labelEn: 'Look for two minutes, then say you will leave her to it',
        hintZh: '图书馆里有一种不用说出口的规矩',
        hintEn: 'A library has rules nobody has to state.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '你知道什么时候该走', reasonEn: 'You knew when to leave' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 8, affection: 2, reasonZh: '她说了「また」，虽然听上去只是客套', reasonEn: 'She said "again", though it sounded like a formality' }],
        setFlags: ['day1_rei_left_early'],
        then: [
          {
            type: 'narration',
            zh: '你把椅子推回去，尽量不发出声音，然后说了句「打扰了」。',
            en: 'You push the chair back in as quietly as you can and say that you will not keep her.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生', speakerEn: 'Girl with Glasses',
            characterImage: `${REI}neutral.webp`,
            jp: '……いえ。……また。',
            zh: '……不会。……再见。',
            en: '...Not at all. ...Again.',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            characterImage: '',
            zh: '你走到门口才想起来，日语里的「また」是「下次再见」的意思。她用的是这个词，不是「さようなら」。',
            en: 'You are at the door before you remember that "mata" means "again", as in next time. That is the word she used, not "goodbye".'
          }
        ]
      }
    ]
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
      characterImage: `${MAKI}punk_neutral.webp`,
      zh: '章鱼烧摊子前面，那个粉头发的女生正回头看你。她显然是先看见你的。',
      en: 'In front of the takoyaki stand, the pink-haired girl is already looking your way. She clearly saw you first.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_neutral.webp`,
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
        jp: '待って——生意気な関西弁の後輩。このキャラ、よく知ってる。',
        words: [{ jp: '生意気', reading: 'なまいき', zh: '嚣张、狂', en: 'cheeky' }],
        hintZh: '你甚至能猜到她下一句要说什么',
        hintEn: 'You can practically predict her next line.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '当面拆穿一个后辈的人设，很勇', reasonEn: 'Calling out an underclassman to her face takes something' }],
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
        labelZh: '老实承认：这几个字你不认识',
        labelEn: 'Admit it: you cannot read those characters',
        jp: '読めません。教えてください。',
        hintZh: '外公说过：遇到不懂的，大大方方地问',
        hintEn: 'Your grandfather wrote it down: when you do not understand, ask, openly.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '把不会就说不会，这也是一种本事', reasonEn: 'Saying you cannot is its own skill' }],
        relations: [{ char: CharacterId.MAKI, familiarity: 14, affection: 2, reasonZh: '她最烦装懂的人', reasonEn: 'The one thing she cannot stand is people pretending' }],
        then: [
          {
            type: 'narration',
            characterImage: `${MAKI}punk_neutral.webp`,
            zh: '她挑了挑眉，像是没料到你这么干脆。',
            en: 'Her eyebrows go up. She did not expect you to fold that fast.'
          }
        ]
      },
      {
        id: 'maki_own_order',
        labelZh: '按住钱包，指着菜单上唯一认得的那几个字',
        labelEn: 'Cover your wallet and point at the only characters on the menu you can read',
        hintZh: '第一顿饭还是想自己点',
        hintEn: 'You would like to order your own first meal, thanks.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '在完全看不懂的菜单前伸出了手指', reasonEn: 'You put a finger on a menu you could not read' },
          { stat: 'proficiency', amount: 1, reasonZh: '至少你的手没有抖', reasonEn: 'Your hand, at least, did not shake' }
        ],
        relations: [{ char: CharacterId.MAKI, familiarity: 16, affection: 3, reasonZh: '她笑归笑，还是让你自己点完了', reasonEn: 'She laughed — and still let you finish the order yourself' }],
        setFlags: ['day1_maki_own_order'],
        then: [
          {
            type: 'narration',
            zh: '你把钱包往回一收，抬起手指，落在菜单上唯一一处你能拆开的字上：「たこ焼」。',
            en: 'You pull the wallet back, raise a finger, and put it on the one place on the menu you can parse: TAKOYAKI.'
          },
          {
            type: 'narration',
            characterImage: `${MAKI}punk_laugh.webp`,
            zh: '她盯着你的手指看了两秒，然后笑得蹲了下去。',
            en: 'She stares at your finger for two seconds and then laughs hard enough to crouch down.'
          },
          {
            type: 'speech',
            speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
            characterImage: `${MAKI}punk_laugh.webp`,
            jp: 'それ店の名前や！メニューちゃう！……いや、ええけどな、ここたこ焼しか売ってへんし。',
            words: [{ jp: '店', reading: 'みせ', zh: '店、店铺', en: 'shop' }],
            zh: '那是店名啦！不是菜单！……不过，也行吧，反正这家只卖章鱼烧。',
            en: 'That is the name of the shop! Not the menu! ...Although, fine, I guess. They only sell takoyaki here anyway.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '老板从铁板后面抬起头，看了看你的手指，又看了看她，然后开始翻丸子。',
            en: 'The man behind the griddle looks up, looks at your finger, looks at her, and starts turning the batter.'
          },
          {
            type: 'speech',
            speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
            characterImage: `${MAKI}punk_neutral.webp`,
            jp: '……まあ、自分で指さしただけマシやわ。ウチが全部やったったら、自分いつまでも読まれへんやろ。',
            zh: '……嘛，至少是你自己指的。要是全让我代劳，你就永远看不懂了。',
            en: '...Eh. At least you pointed yourself. If I did all of it for you, you would never learn to read the thing.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她说这话的时候没看你，在数自己口袋里的硬币。',
            en: 'She is not looking at you when she says it. She is counting the coins in her pocket.'
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
    characterImage: `${MAKI}punk_neutral.webp`,
    zh: '「センパイ、金は自分で払いや」——她说完退开半步，看你付钱。',
    en: '"You are paying for that yourself, senpai." She steps back half a pace and watches you hand over the money.'
  },
  {
    type: 'speech',
    speakerZh: '你', speakerEn: 'You',
    jp: '……せんぱい？',
    zh: '……前辈？',
    en: '...Senpai?',
    color: 'bg-yellow-500'
  },
  {
    type: 'narration',
    zh: '她咬着一颗章鱼烧，含混地「あ？」了一声，然后才反应过来你在问什么。',
    en: 'She bites into a takoyaki, makes a muffled noise, and only then works out what you are asking.'
  },
  {
    type: 'speech',
    speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
    characterImage: `${MAKI}punk_laugh.webp`,
    jp: 'ウチ一年。あんた二年やろ？　顔に書いてあるわ、「なんもわからん」って。',
    words: [{ jp: '一年', reading: 'いちねん', zh: '一年级', en: 'first year' }],
    zh: '我一年级。你二年级吧？脸上写着呢——「什么都搞不懂」。',
    en: 'I am first year. You are second, right? It is written all over your face. "Understands nothing."',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '你确实是二年级。你确实什么都搞不懂。你决定不去追究她是怎么知道的。',
    en: 'You are second year. You do understand nothing. You decide not to pursue how she knew.'
  },
  {
    type: 'speech',
    speakerZh: '粉发的女生', speakerEn: 'Pink-haired Girl',
    characterImage: `${MAKI}punk_neutral.webp`,
    jp: '真希。ここの読み方、聞きたなったらまた来たらええわ。',
    words: [{ jp: '読み方', reading: 'よみかた', zh: '读法、念法', en: 'how to read it' }],
    zh: '真希。想问哪个字怎么念了，再来就是了。',
    en: 'Maki. Come back when you want to know how something is read.',
    color: 'bg-pink-500'
  },
  {
    type: 'narration',
    zh: '她没说在哪儿能找到她。你想问，但她已经把最后一颗章鱼烧丢进嘴里，朝商店街深处走了。',
    en: 'She does not say where you would find her. You want to ask, but the last takoyaki is already in her mouth and she is walking off into the arcade.'
  },
  {
    type: 'narration',
    characterImage: `${MAKI}punk_laugh.webp`,
    zh: '走出七八步，她回过头喊了一句「センパイ、ソースついてる」，指了指自己的嘴角。你伸手一抹，什么都没有。',
    en: 'Seven or eight steps on she turns and shouts that senpai has sauce on his face, pointing at the corner of her own mouth. You wipe. There is nothing there.'
  },
  {
    type: 'narration',
    zh: '等你抬起头，人已经不见了。你站在原地，手里还端着那盒她替你点的章鱼烧，热的。',
    en: 'By the time you look up she is gone. You are left standing there holding the tray she ordered for you, still hot.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_maki', 'day1_deep_maki', 'day1_maki_name'],
    effects: [{ stat: 'charm', amount: 1, reasonZh: '被一个不认识的后辈当场认领了', reasonEn: 'You were claimed on the spot by an underclassman you do not know' }],
    relations: [{ char: CharacterId.MAKI, familiarity: 12, affection: 2, reasonZh: '她开始叫你「センパイ」了', reasonEn: 'She started calling you senpai' }]
  }
];

// ==========================================================
// 擦肩而过：没走那条路的人，也让你看见一眼
// ==========================================================
// ==========================================================
// 回去的路上
//
// 【之前是怎么坏的】
// 深度线一结束，下一个节点就是"经过体育馆侧门"——**硬切**。
// 上一秒你还站在图书馆里，铃刚说完那句「また」，下一秒画面已经
// 在体育馆了，再下一秒又跳到校门口的真希。三段之间一句衔接都没有，
// 读起来就是三个不相干的片段被钉在一起。
//
// 【现在怎么接】
// 先给一段共用的"离开"：收东西、走廊、放学的声音。有了这一段，
// 后面那些照面才有了共同的处境——**你在回家的路上，顺路看见的**。
// 每一段之间也补一句移动，画面不再是跳的，是走过去的。
// ==========================================================

// 深度线结束 → 起身往外走。三条线共用。
export const DAY1_LEAVING: StoryNode[] = [
  { type: 'scene', scene: 'hallway', bgm: 'town' },
  {
    type: 'narration', characterImage: '',
    zh: '你把椅子推回原位，背上书包。走廊里已经是放学的动静了——鞋柜的门在响，有人在楼梯上跑，广播里在念明天的日程，念到一半被下课铃盖过去。',
    en: 'You push the chair back in and shoulder your bag. The corridor already sounds like the end of the day: locker doors, somebody running on the stairs, the tannoy reading out tomorrow\u2019s timetable until the bell talks over it.'
  },
  {
    type: 'narration',
    zh: '你顺着人流往校门口走。这条路你今天早上走过一次，那时候是反方向。',
    en: 'You go with the flow towards the gate. You walked this corridor once this morning, in the other direction.'
  }
];

const CAMEO_SORA: StoryNode[] = [
  {
    type: 'narration', characterImage: '',
    zh: '经过体育馆侧门的时候，里面传来一声很响的「ナイッシュー！」。',
    en: 'Passing the side door of the gym, a very loud "nice shot!" comes out of it.'
  },
  {
    type: 'narration',
    characterImage: `${SORA}school_happy.webp`,
    zh: '你停下来往里看了一眼。一个短发女生一个人在练投篮，投进了还自己给自己喊了一声好。馆里没有别人。',
    en: 'You stop and look in. A short-haired girl is practising free throws on her own, calling her own shots. There is nobody else in there.'
  },
  {
    type: 'narration', characterImage: '',
    zh: '你站了几秒钟就走了。她没有发现你。',
    en: 'You watch for a few seconds and move on. She does not notice you.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_sora'],
    relations: [{ char: CharacterId.SORA, familiarity: 4, reasonZh: '你在体育馆门口看了一眼', reasonEn: 'You looked in at the gym door' }]
  }
];

const CAMEO_REI: StoryNode[] = [
  {
    type: 'narration', characterImage: '',
    zh: '再往前是图书馆。门开着，里面的灯还亮着一半。',
    en: 'Further along is the library. The door is open and half the lights are still on.'
  },
  {
    type: 'narration',
    characterImage: `${REI}thinking.webp`,
    zh: '靠窗最里面那张桌子上摊着五六本书，一个戴红框眼镜的女生坐在后面。',
    en: 'At the furthest table by the window, five or six books lie open, and a girl in red-framed glasses sits behind them.'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '你走出十几米才反应过来：刚才那半分钟里，她一次都没有动过。',
    en: 'Ten metres on it registers: in that half minute she did not move once.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_rei'],
    relations: [{ char: CharacterId.REI, familiarity: 4, reasonZh: '你在图书馆门口停了半分钟', reasonEn: 'You paused half a minute at the library door' }]
  }
];

const CAMEO_MAKI: StoryNode[] = [
  { type: 'scene', scene: 'school_gate', bgm: 'town' },
  {
    type: 'narration', characterImage: '',
    zh: '出了教学楼就是校门。这个点门口全是人，自行车推出来的声音一辆接一辆。',
    en: 'Out of the building and the gate is right there. It is thick with people at this hour, bicycles coming out one after another.'
  },
  {
    type: 'narration',
    characterImage: `${MAKI}punk_laugh.webp`,
    zh: '有个粉头发的女生正倒着走路，一边冲身后的人大声说着什么。她胸前的领结颜色和你们班不一样——低一届的。',
    en: 'A pink-haired girl is walking backwards, hollering something at somebody behind her. Her ribbon is a different colour from your class. A year below.'
  },
  {
    type: 'narration', characterImage: '',
    zh: '她倒着走出去七八米，差点撞上门柱，自己蹦开了。整个过程她一次都没回头看路。',
    en: 'She gets seven or eight metres like that, nearly walks into the gatepost, and hops clear of it. She does not once look where she is going.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_maki'],
    relations: [{ char: CharacterId.MAKI, familiarity: 4, reasonZh: '在校门口撞见过一次', reasonEn: 'You caught sight of her at the gate' }]
  }
];

// 没走的那两条路，回去的路上两条都路过一眼。
//
// 以前这里是 `random` —— 两条里只演一条。看着是"每周目不一样"，
// 实际后果是：空 / 铃 / 真希三个人，一个存档里只可能认识两个。
// 而第三个人**永远见不到了**：她的放学后事件挂着 requiresFlags: ['day1_met_x']，
// 午休和偶遇也都只认已经认识的人，大厅名单同理。
// 也就是说，全攻略在一份存档里做不到，跟玩多久没关系。
//
// 深度线还是只能选一条（那是选择的重量所在），
// 但"路过时瞥了一眼"这种程度的照面，没有理由三缺一。
export const DAY1_CAMEO_AFTER_GYM: StoryNode[] = [...DAY1_LEAVING, ...CAMEO_REI, ...CAMEO_MAKI];
export const DAY1_CAMEO_AFTER_LIB: StoryNode[] = [...DAY1_LEAVING, ...CAMEO_SORA, ...CAMEO_MAKI];
export const DAY1_CAMEO_AFTER_ARC: StoryNode[] = [...DAY1_LEAVING, ...CAMEO_SORA, ...CAMEO_REI];

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
        jp: '……わかった。こういうのが出てくる話なんだな、これ。',
        hintZh: '白发、赤脚、神社、说话像谜语。够明显了',
        hintEn: 'White hair, bare feet, a shrine, riddles. The signs are not subtle.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你对着一个明显不太对劲的人开了口', reasonEn: 'You spoke up at someone visibly not quite right' }],
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
        jp: 'このあたりに、何か謂れでもあるんですか。',
        words: [{ jp: '謂れ', reading: 'いわれ', zh: '来历、典故', en: 'the story behind it' }],
        hintZh: '外公的地图上，这里描了三遍',
        hintEn: 'Your grandfather traced this one spot three times.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '她讲了一段哪本书上都没有的来历', reasonEn: 'She told you a history that is in no book' }],
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
      },
      {
        id: 'inari_feet',
        labelZh: '什么也没问，先把外套脱下来递过去',
        labelEn: 'Ask nothing. Take your blazer off and hold it out to her',
        hintZh: '四月的傍晚，她赤着脚',
        hintEn: 'It is an April evening and she is barefoot.',
        effects: [
          { stat: 'kindness', amount: 2, reasonZh: '你先看见的是冷，不是怪', reasonEn: 'What you noticed first was the cold, not the strangeness' }
        ],
        relations: [{ char: CharacterId.INARI, familiarity: 20, affection: 6, reasonZh: '一千八百年里，这件事发生过的次数不多', reasonEn: 'In eighteen centuries, this has not happened often' }],
        setFlags: ['day1_inari_blazer'],
        then: [
          {
            type: 'narration',
            zh: '你把制服外套脱下来，叠了一下，隔着一步远递过去。她低头看了看那件外套，又抬头看了看你。',
            en: 'You take off your blazer, fold it once, and hold it out from a step away. She looks at the blazer, then up at you.'
          },
          {
            type: 'narration',
            characterImage: `${INARI}casual_neutral.webp`,
            zh: '她没有接。但她也没有像刚才那样，把话说得像是从很远的地方传来的。',
            en: 'She does not take it. But she also stops sounding like someone speaking from a long way off.'
          },
          {
            type: 'speech',
            speakerZh: '白发的女子', speakerEn: 'White-haired Woman',
            characterImage: `${INARI}casual_neutral.webp`,
            jp: '……妾に、寒かろうと申すか。',
            words: [{ jp: '寒い', reading: 'さむい', zh: '冷', en: 'cold' }],
            zh: '……你是在说，我会冷吗。',
            en: '...You are suggesting that I might be cold.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '你说不上来该怎么回答，只好点了点头。',
            en: 'You cannot think of an answer, so you nod.'
          },
          {
            type: 'speech',
            speakerZh: '白发的女子', speakerEn: 'White-haired Woman',
            characterImage: `${INARI}casual_happy.webp`,
            jp: 'ふふ。……ここに座る者は多いが、そう言うたのは、汝で四人目じゃ。',
            words: [{ jp: '座る', reading: 'すわる', zh: '坐', en: 'to sit' }],
            zh: '呵呵。……在这儿坐着的人多得很，可这么说的，你是第四个。',
            en: 'Hmhm. ...Many have sat here. You are the fourth to say that.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '第四个。你想问前三个是什么时候的事。但你不太确定自己想不想知道答案。',
            en: 'The fourth. You want to ask when the other three were. You find you are not certain you want the answer.'
          },
          {
            type: 'narration',
            zh: '她伸手把外套推了回来，指尖碰到你手背的那一下，比四月的晚风还要凉。',
            en: 'She pushes the blazer back toward you. Where her fingertips touch the back of your hand, she is colder than the April wind.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    characterImage: `${INARI}casual_happy.webp`,
    zh: '你低头想把手账拿出来。再抬头时，鸟居底下已经没有人了——木屐还在原地，整整齐齐地摆着。',
    en: 'You look down to get the journal out. When you look up, there is no one under the torii. The geta are still there, set down neatly, side by side.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_inari'],
    relations: [{ char: CharacterId.INARI, familiarity: 6, reasonZh: '她记住了那张地图', reasonEn: 'She took note of that map' }]
  },

  // ---- 坡道口 · 奈绪 ----
  { type: 'scene', scene: 'kitano_slope_foot_dusk', bgm: 'night', titleZh: '海风庄 · 坡道口', titleEn: 'The Foot of the Slope', subtitleZh: '傍晚 6:40', subtitleEn: '6:40 PM' },
  {
    type: 'narration',
    zh: '坡道口的路灯下面蹲着一个人，两袋东西放在脚边，正对着手机屏幕皱眉。',
    en: 'Under the streetlight at the foot of the slope someone is crouching, two shopping bags on the ground beside her, frowning at a phone.'
  },
  {
    type: 'narration',
    zh: '你还没走到跟前就认出她了。隔着二十米、只有一个后脑勺和一个蹲着的姿势，你也认得出来。',
    en: 'You know who it is before you are anywhere near. Twenty metres off, the back of a head and a crouch, and you know.'
  },
  {
    type: 'narration',
    zh: '奈绪。你们两家在国外做了十年邻居——她家在你隔壁那栋，中间隔一道齐腰的矮墙，小学六年是同一条路上下学。',
    en: 'Nao. Your families were neighbours abroad for ten years: her house next to yours with a waist-high wall between, and six years of primary school walking the same road.'
  },
  {
    type: 'narration',
    zh: '她比你早一年回日本。你决定来神户交换的那天，第一个知道的人是她——因为你还没告诉家里就先给她发了消息。',
    en: 'She came back to Japan a year ahead of you. On the day you decided to take the exchange, she was the first to know, because you messaged her before you told your own family.'
  },
  {
    type: 'narration',
    characterImage: `${NAO}casual_neutral.webp`,
    zh: '你走近的时候她抬起头，脸上先是「啊」，然后是「终于」，最后是一种非常复杂的、看起来快哭了但其实是在生气的表情。',
    en: 'She looks up as you get closer. Her face does "ah", then "finally", and then settles into something extremely complicated that looks like crying but is in fact annoyance.'
  },
  {
    type: 'narration',
    zh: '这个表情你也认得。上一次见到是十二岁，因为你把她的自行车骑进了水沟里。',
    en: 'You know that expression too. The last time you saw it you were twelve, and it was because you had ridden her bicycle into a ditch.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_angry.webp`,
    jp: 'おっそーい！！わたし、四時半からここおるんやけど！',
    zh: '好——慢——！！我从四点半就在这儿了欸！',
    en: 'You are SO late! I have been here since half four!',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '你说学校四点十分才放学。',
    en: 'You point out that school does not finish until ten past four.'
  },
  {
    type: 'narration',
    characterImage: `${NAO}casual_curious.webp`,
    zh: '她张了张嘴，然后开始数手指。数到第三根的时候停住了。',
    en: 'Her mouth opens. She starts counting on her fingers. She stops at the third one.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_shy.webp`,
    jp: '……あ。ほんまや。……えっ、じゃあわたし、なんで四時半に来たん？',
    zh: '……啊。真的欸。……诶，那我为什么四点半就来了？',
    en: '...Oh. So it does. ...Wait, then why did I get here at half four?',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '这个问题她问的是自己。你没有回答，因为你也不知道。',
    en: 'The question is addressed to herself. You do not answer it, because you do not know either.'
  },
  {
    type: 'narration',
    zh: '你注意到她脚边那两袋东西旁边，还放着一杯已经喝完的、纸杯外面全是水汽干掉痕迹的奶茶。',
    en: 'Beside the two bags at her feet there is also an empty paper cup, its outside streaked with the dried marks of condensation.'
  },
  // ---- 走错坡道 ----
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_neutral.webp`,
    jp: 'ていうかさ、この坂ちゃう坂で三十分待っとってん。あっちの、似たようなやつ。',
    words: [{ jp: '坂', reading: 'さか', zh: '坡道', en: 'a slope / hill' }],
    zh: '话说回来，我先在另一条坡道那儿等了三十分钟。那边那条，长得差不多的。',
    en: 'Anyway, I spent thirty minutes waiting on the wrong slope. The other one. The one that looks the same.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '北野一带的坡道有十几条，每一条都长得差不多。这个理由是成立的。',
    en: 'There are a dozen slopes in Kitano and they all look much the same. The excuse is, technically, valid.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_happy.webp`,
    jp: 'でも途中で気づいてん！えらいやろ？',
    zh: '不过我半路就发现了！很厉害吧？',
    en: 'But I noticed halfway! Impressive, right?',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '她说这句的时候是真心在等你夸她。你说了句「厉害」。她非常满意地点了点头。',
    en: 'She genuinely is waiting to be praised for this. You say "impressive". She nods, thoroughly satisfied.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_neutral.webp`,
    jp: '……で、どうやった。初日。',
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
    zh: '她说完自己也愣了一下，像是没料到这句话会从自己嘴里出来。',
    en: 'She seems startled by her own sentence, as though she had not expected it to come out of her.'
  },
  {
    type: 'narration',
    characterImage: `${NAO}casual_curious.webp`,
    zh: '「……あれ、今わたし、なんか感じ悪かった？」她认真地问你。她是真的在问。',
    en: '"...Wait. Did that come out mean just now?" She asks it seriously. She genuinely wants to know.'
  },
  {
    type: 'narration',
    zh: '你说没有。她「哦」了一声，接受了这个答案，然后立刻把袋子塞给你。',
    en: 'You say it did not. She says "oh", accepts this ruling, and immediately shoves a bag into your hands.'
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
        jp: '……あのさ。その立ち位置、アニメだと幼馴染っていうんだけど。',
        words: [{ jp: '幼馴染', reading: 'おさななじみ', zh: '青梅竹马', en: 'childhood friend' }],
        hintZh: '坡道口等人、拎着一袋米、嘴上嫌你',
        hintEn: 'Waiting at the bottom of a hill with a bag of rice, complaining.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '你说了一句她一直在等的话', reasonEn: 'You said the thing she had been waiting for someone to say' }],
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
        jp: '……ありがとう。助かった。',
        words: [{ jp: '助かる', reading: 'たすかる', zh: '得救、帮大忙了', en: 'to be a great help' }],
        hintZh: '她从三宫一路拎上来的',
        hintEn: 'She carried this up from Sannomiya.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有把她的好意当成理所当然', reasonEn: 'You did not take it for granted' }],
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
      },
      {
        id: 'nao_receipt',
        labelZh: '把两袋都接过来，然后伸手要小票',
        labelEn: 'Take both bags — then hold your hand out for the receipt',
        jp: 'レシート、ちょうだい。',
        hintZh: '米和味噌不是从天上掉下来的',
        hintEn: 'Rice and miso do not fall out of the sky.',
        effects: [
          { stat: 'proficiency', amount: 1, reasonZh: '你已经开始算自己的账了', reasonEn: 'You have started keeping your own accounts' },
          { stat: 'guts', amount: 1, reasonZh: '跟一个不肯收钱的人当面把钱掰扯清楚', reasonEn: 'You argued money with someone determined not to take it' }
        ],
        relations: [{ char: CharacterId.NAO, affection: 4, familiarity: 8, reasonZh: '她被当成大人对待了一次', reasonEn: 'For once she was treated as an adult, not a caretaker' }],
        setFlags: ['day1_nao_receipt'],
        then: [
          {
            type: 'narration',
            zh: '你把两袋都拎了过来，腾出一只手摊在她面前。',
            en: 'You take both bags, then free up one hand and hold it out, palm up.'
          },
          {
            type: 'speech',
            speakerZh: '你', speakerEn: 'You',
            jp: 'レシート。',
            words: [{ jp: 'レシート', zh: '收银小票', en: 'receipt' }],
            zh: '小票。',
            en: 'Receipt.',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            characterImage: `${NAO}casual_angry.webp`,
            zh: '她把手往口袋里一插，往后退了半步。',
            en: 'She shoves her hand into her pocket and takes half a step back.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${NAO}casual_angry.webp`,
            jp: '……捨てた。',
            zh: '……扔了。',
            en: '...Threw it away.',
            color: 'bg-rose-500'
          },
          {
            type: 'narration',
            zh: '你看着她。她看着旁边的电线杆。僵持了大概五秒，她从口袋里把那张揉成一团的小票掏了出来，塞进你手里。',
            en: 'You look at her. She looks at a utility pole. About five seconds of stalemate, then she pulls the crumpled receipt out of her pocket and stuffs it into your hand.'
          },
          {
            type: 'speech',
            speakerZh: '奈绪', speakerEn: 'Nao',
            characterImage: `${NAO}casual_shy.webp`,
            jp: '……ほんと、こういうとこだけ大人になったよね、あんた。',
            words: [{ jp: '大人', reading: 'おとな', zh: '大人、成年人', en: 'adult' }],
            zh: '……真是的，就这种地方长大了啊，你。',
            en: '...Honestly. You grew up in exactly the wrong places.',
            color: 'bg-rose-500'
          },
          {
            type: 'narration',
            zh: '你把小票展平，看了一眼总额，然后收进钱包夹层。一千八百四十日元。',
            en: 'You flatten the receipt, read the total, and file it in your wallet. One thousand eight hundred and forty yen.'
          },
          {
            type: 'narration',
            zh: '走在她后面上坡的时候，你想：这个数字得记住。这是你在这座城市欠下的第一笔账。',
            en: 'Climbing the slope behind her, you think: remember that number. It is the first debt you have run up in this city.'
          }
        ]
      }
    ]
  },
  // ---- 一起上坡 ----
  // 原来这里切到 kitano_slope，而那张图是**白天**的樱花坡——
  // 一整段都在傍晚六点四十，画面却跳回了白天。
  // 坡道口那张黄昏图一路用到底。
  { type: 'scene', scene: 'kitano_slope_foot_dusk', bgm: 'night' },
  {
    type: 'narration',
    characterImage: `${NAO}casual_neutral.webp`,
    zh: '两个人一起往上走。她走在你左边，隔半步，这个距离十年没变过。',
    en: 'You start up the slope together. She walks on your left, half a step ahead. That distance has not changed in ten years.'
  },
  {
    type: 'narration',
    zh: '袋子里除了米、鸡蛋和味噌，还有：两把葱、一块豆腐、一盒鸡蛋（第二盒）、一袋洗衣粉，和一个你完全看不出用途的塑料铲子。',
    en: 'Besides the rice, eggs and miso, the bags contain: two bunches of spring onion, a block of tofu, a box of eggs (the second box), a bag of laundry powder, and a plastic scoop whose purpose you cannot determine.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_happy.webp`,
    jp: 'あ、それ？なんか安かったから。',
    zh: '啊，那个？因为好像挺便宜的。',
    en: 'Oh, that? It seemed cheap.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '你问她鸡蛋为什么有两盒。她低头看了看袋子，「啊」了一声，然后说了句「……昨天也买了吧」。',
    en: 'You ask about the two boxes of eggs. She looks into the bag, says "ah", and then, "...I think I bought some yesterday as well."'
  },
  {
    type: 'narration',
    zh: '「那你昨天那盒呢？」',
    en: '"So where is yesterday’s box?"'
  },
  {
    type: 'narration',
    characterImage: `${NAO}casual_curious.webp`,
    zh: '她想了很久。坡道又往上走了大概二十米。',
    en: 'She thinks about it for a long time. The slope goes up another twenty metres.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_shy.webp`,
    jp: '……電車に置いてきたかも。',
    words: [{ jp: '置いてくる', reading: 'おいてくる', zh: '落下、忘在某处', en: 'to leave something behind' }],
    zh: '……可能落在电车上了。',
    en: '...I might have left it on the train.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '你们俩沉默着又走了十几米。',
    en: 'You both walk another ten metres in silence.'
  },
  // ---- 她其实什么都看见了 ----
  {
    type: 'narration',
    characterImage: `${NAO}casual_neutral.webp`,
    zh: '走到一半的时候，她忽然停下来，转过身，非常仔细地看了看你的脸。',
    en: 'Halfway up she stops, turns around, and looks at your face very carefully.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_curious.webp`,
    jp: '……あんた、今日ちゃんとご飯食べた？',
    zh: '……你今天，好好吃饭了吗？',
    en: '...Did you actually eat today?',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '你张嘴要说吃了。她已经在摇头了。',
    en: 'You open your mouth to say yes. She is already shaking her head.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_angry.webp`,
    jp: '嘘。あんた嘘つくとき、ちょっとだけ右見んねん。昔から。',
    words: [{ jp: '嘘', reading: 'うそ', zh: '谎话', en: 'a lie' }],
    zh: '骗人。你说谎的时候会稍微往右看一下。从小就是。',
    en: 'Liar. When you lie you glance a little to the right. You always have.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '一个连自己昨天买没买鸡蛋都记不住的人，记得你十年前撒谎时眼睛往哪边偏。',
    en: 'A person who cannot remember whether she bought eggs yesterday remembers which way your eyes went when you lied, ten years ago.'
  },
  {
    type: 'branch',
    ifFlag: 'day1_lunch_endure',
    then: [
      {
        type: 'narration',
        zh: '你只好承认午饭没吃。她「啊」了一声，然后开始翻袋子，翻了半天，掏出一个已经压扁了的红豆面包塞给你。',
        en: 'You admit you skipped lunch. She says "ah", starts digging through the bags, and after some time produces a badly squashed red bean bun and pushes it at you.'
      },
      {
        type: 'narration',
        zh: '「这个是我早上买的。」她说。「本来是我的早饭。」',
        en: '"I bought this in the morning," she says. "It was going to be my breakfast."'
      },
      {
        type: 'narration',
        zh: '现在是傍晚六点四十。',
        en: 'It is 6:40 in the evening.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'day1_lunch_endure',
    not: true,
    then: [
      {
        type: 'narration',
        zh: '你说吃了，是同学分给你的。她「哦」了一声，点了点头，然后又点了一次，然后就没说话了。',
        en: 'You say you did eat: a classmate shared hers. She says "oh", nods, nods again, and then stops talking.'
      },
      {
        type: 'narration',
        characterImage: `${NAO}casual_cold.webp`,
        zh: '接下来的三十米她走得比刚才快了一点。你没有问为什么。',
        en: 'She walks the next thirty metres slightly faster than before. You do not ask why.'
      }
    ]
  },
  // ---- 门口 ----
  { type: 'scene', scene: 'umikaze_exterior', bgm: 'night' },
  {
    type: 'narration',
    characterImage: `${NAO}casual_neutral.webp`,
    zh: '海风庄门口。她把袋子放在台阶上，直起腰捶了两下。',
    en: 'The entrance of Umikaze-so. She sets the bags down on the step and stretches, thumping her own back twice.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_happy.webp`,
    jp: 'ほな、また明日な。……あ、明日は坂の下ちゃうくて、駅で待っとくわ。そのほうが確実やろ。',
    zh: '那，明天见啦。……啊，明天不在坡道下面，我在车站等你。那样比较保险吧。',
    en: 'Right, see you tomorrow. ...Oh — not the bottom of the slope tomorrow, I will wait at the station. That is safer, right?',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '三宫站有六个出口。你决定明天早点出门。',
    en: 'Sannomiya station has six exits. You decide to leave early tomorrow.'
  },
  {
    type: 'narration',
    characterImage: `${NAO}casual_neutral.webp`,
    zh: '她走了两步，又回过头。',
    en: 'She takes two steps, then turns back.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_shy.webp`,
    jp: '……あのさ。今日、いっぱい名前おぼえたやろ。',
    zh: '……那个啊。今天，记住了好多名字吧。',
    en: '...Hey. You learned a lot of names today, right.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '你说是。',
    en: 'You say yes.'
  },
  {
    type: 'speech',
    speakerZh: '奈绪', speakerEn: 'Nao',
    characterImage: `${NAO}casual_happy.webp`,
    jp: 'ええことやん。……うん。ええことや。',
    zh: '这是好事啊。……嗯。是好事。',
    en: 'That is a good thing. ...Yeah. It is a good thing.',
    color: 'bg-rose-500'
  },
  {
    type: 'narration',
    zh: '她说了两遍。第二遍像是说给自己听的。然后她挥了挥手，转身下坡，走的是——你注意到了——错误的那个方向。',
    en: 'She says it twice. The second time sounds like it was for her own benefit. Then she waves, turns, and heads back down the slope in — you notice — the wrong direction.'
  },
  {
    type: 'narration',
    zh: '你没有叫住她。她自己会发现的。大概三条街之后。',
    en: 'You do not call after her. She will work it out. In about three streets.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_nao'],
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '有人替你想到了米和味噌', reasonEn: 'Someone thought about your rice and miso for you' }],
    relations: [{ char: CharacterId.NAO, affection: 3, reasonZh: '她在坡道口等了很久，而且等错了地方', reasonEn: 'She waited a long time at the foot of a slope. The wrong slope, first' }]
  }
];
