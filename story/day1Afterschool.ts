import { StoryNode, CharacterId } from '../types';

// ---------------------------------------------------------
// 【第1章】放学后的三条路 + 傍晚
//
// 这是第一天唯一的决定性分叉，作用和序章傍晚那次一样：
// 决定你先认识谁。三条路互斥，一周目只能走一条。
//
// 每条路的结尾都不是"交上朋友了"，而是"她给了你一个再见面的理由"——
// 第一天不该把人际关系推得太远，那是后面专属剧情的活。
// ---------------------------------------------------------

const SORA = '/images/characters/sora/';
const REI  = '/images/characters/rei/';
const MAKI = '/images/characters/maki/';
const INARI = '/images/characters/inari/';
const NAO  = '/images/characters/nao/';

// ==========================================================
// A. 体育馆 —— 空
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
    speakerZh: '空',
    speakerEn: 'Sora',
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
    type: 'speech',
    speakerZh: '空',
    speakerEn: 'Sora',
    characterImage: `${SORA}happy.webp`,
    jp: 'あはは、へたくそ！……よし、交換な。ウチが体育教えたるから、そっちは日本語教えて。',
    words: [{ jp: '交換', reading: 'こうかん', zh: '交换', en: 'exchange / swap' }],
    zh: '啊哈哈，烂死了！……好，那就交换。我教你运动，你教我日语。',
    en: 'Ahaha, you are terrible! ...Right. Trade. I teach you sport, you teach me Japanese.',
    color: 'bg-orange-500'
  },
  {
    type: 'narration',
    zh: '你想说自己的日语才是需要人教的那个。但她已经在算课表了。',
    en: 'You want to point out that your Japanese is the one that needs teaching. She is already working out a timetable.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_sora'],
    effects: [{ stat: 'guts', amount: 2, reasonZh: '在体育馆门口没有转身就走', reasonEn: 'You did not turn around at the gym door' }],
    relations: [{ char: CharacterId.SORA, familiarity: 18, affection: 3, reasonZh: '接下了一个莫名其妙的等价交换', reasonEn: 'You accepted a distinctly lopsided trade' }]
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '走出体育馆时天已经开始黄了。她在身后喊：「明日も来いよー！」',
    en: 'The light has gone yellow by the time you leave. She shouts after you: "Come again tomorrow!"'
  }
];

// ==========================================================
// B. 图书馆 —— 铃
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
    zh: '靠窗最里面那张桌子上摊着五六本书，都翻开着。坐在后面的人你认得——红框眼镜。',
    en: 'At the furthest table by the window, five or six books lie open at once. You recognise the person behind them: red-framed glasses.'
  },
  {
    type: 'branch',
    ifFlag: 'prologue_met_rei',
    then: [
      {
        type: 'speech',
        speakerZh: '铃',
        speakerEn: 'Rei',
        characterImage: `${REI}casual_neutral.webp`,
        jp: '……あ。昨日の。',
        zh: '……啊。昨天那位。',
        en: '...Ah. From yesterday.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '她抬头看了你两秒，然后低头在笔记本上写了一行什么。你没看清。',
        en: 'She looks up at you for two seconds, then writes a line in her notebook. You do not catch what.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_met_rei',
    not: true,
    then: [
      {
        type: 'speech',
        speakerZh: '戴眼镜的女生',
        speakerEn: 'Girl with Glasses',
        characterImage: `${REI}casual_neutral.webp`,
        jp: '……静かにしてもらえますか。',
        zh: '……可以请你安静一点吗。',
        en: '...Could you keep it down, please.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '你什么都还没说。她说完才反应过来，耳朵有点红。',
        en: 'You have not said anything yet. She registers that a second after saying it, and the tips of her ears go pink.'
      }
    ]
  },
  {
    type: 'narration',
    zh: '摊在桌上的那几本书，标题你只认得一半：《神戸居留地建築図譜》《異人館の意匠》。中间夹着一张手绘的街区草图。',
    en: 'You can read only half the titles on the table: architectural plates of the Kobe foreign settlement, a study of Western-house ornament. Between them lies a hand-drawn sketch of a street block.',
    words: [{ jp: '建築', reading: 'けんちく', zh: '建筑', en: 'architecture' }]
  },
  {
    type: 'speech',
    speakerZh: '铃',
    speakerEn: 'Rei',
    characterImage: `${REI}casual_neutral.webp`,
    jp: '……趣味です。誰にも頼まれていません。',
    zh: '……是兴趣。没有人要求我做。',
    en: '...It is a hobby. Nobody asked me to do it.',
    color: 'bg-emerald-500'
  },
  {
    type: 'narration',
    zh: '她说这句话的语气，像是提前替自己挡掉了一个还没有人问出口的问题。',
    en: 'She says it in the tone of someone deflecting a question nobody has asked yet.'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_rei'],
    effects: [{ stat: 'knowledge', amount: 2, reasonZh: '知道了这座城市有人在认真研究它', reasonEn: 'You learned that someone studies this city seriously' }],
    relations: [{ char: CharacterId.REI, familiarity: 16, affection: 3, reasonZh: '你没有笑她的兴趣', reasonEn: 'You did not laugh at what she does for fun' }]
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '你离开时她已经又埋回书里了。走到门口回头看——夕阳正好落在她那一桌上。',
    en: 'She is already back in the books when you go. From the doorway you look back: the sunset has landed squarely on her table.'
  }
];

// ==========================================================
// C. 商店街 —— 真希
// ==========================================================
export const DAY1_ARCADE: StoryNode[] = [
  { type: 'scene', scene: 'sannomiya_arcade', bgm: 'town', titleZh: '三宫商店街', titleEn: 'Sannomiya Arcade', subtitleZh: '下午 4:40 · 人最多的时候', subtitleEn: '4:40 PM · Peak hour' },
  {
    type: 'narration',
    zh: '拱廊下面全是人。放学的、下班的、推着婴儿车的，声音混成一片你听不清任何一句的背景音。',
    en: 'The arcade is packed. Students, people off work, someone pushing a pram — all of it blending into a wall of sound you cannot pick a single sentence out of.'
  },
  {
    type: 'branch',
    ifFlag: 'prologue_met_maki',
    then: [
      {
        type: 'narration',
        characterImage: `${MAKI}punk_smug.webp`,
        zh: '章鱼烧摊子前面，那个粉头发的女生正回头看你。她显然是先看见你的。',
        en: 'In front of the takoyaki stand, the pink-haired girl is already looking your way. She clearly saw you first.'
      },
      {
        type: 'speech',
        speakerZh: '真希',
        speakerEn: 'Maki',
        characterImage: `${MAKI}punk_smug.webp`,
        jp: 'お、来たな。……で？「おおきに」、言えるようになった？',
        zh: '哦，来了啊。……怎么样？会说「おおきに」了吗？',
        en: 'Oh, you turned up. ...Well? Can you say "ookini" yet?',
        color: 'bg-pink-500'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_met_maki',
    not: true,
    then: [
      {
        type: 'narration',
        characterImage: `${MAKI}punk_neutral.webp`,
        zh: '你在章鱼烧摊子前停下来看菜单。旁边有人往你这边挪了半步。',
        en: 'You stop at a takoyaki stand to read the menu. Someone beside you shifts half a step closer.'
      },
      {
        type: 'speech',
        speakerZh: '粉发的女生',
        speakerEn: 'Pink-haired Girl',
        characterImage: `${MAKI}punk_neutral.webp`,
        jp: 'なあ自分、それ読めてへんやろ。',
        zh: '喂你，那个你根本看不懂吧。',
        en: 'Oi, you. You cannot read that, can you.',
        color: 'bg-pink-500'
      }
    ]
  },
  {
    type: 'narration',
    zh: '她说得对。菜单上一半是手写的，字连在一起，你一个都拆不开。',
    en: 'She is right. Half the menu is handwritten, the characters running into each other, and you cannot pull a single one apart.'
  },
  {
    type: 'speech',
    speakerZh: '真希',
    speakerEn: 'Maki',
    characterImage: `${MAKI}punk_laugh.webp`,
    jp: 'ええわ、ウチが読んだる。……ソース、しょうゆ、ねぎポン。どれ？',
    words: [{ jp: '読む', reading: 'よむ', zh: '读、念', en: 'to read' }],
    zh: '行了，我念给你听。……酱汁、酱油、葱柚子醋。要哪个？',
    en: 'Fine, I will read it for you. ...Sauce, soy, spring onion and ponzu. Which.',
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
    zh: '「センパイ、金は自分で払いや」——她说完就笑着退开了半步，看你付钱。',
    en: '"You are paying for that yourself, senpai." She steps back half a pace, grinning, and watches you hand over the money.'
  },
  {
    type: 'narration',
    zh: '你愣了一下。她刚才叫你——センパイ？',
    en: 'You freeze for a second. Did she just call you senpai?'
  },
  {
    type: 'effect',
    setFlags: ['day1_met_maki'],
    effects: [{ stat: 'charm', amount: 1, reasonZh: '被一个不认识的后辈当场认领了', reasonEn: 'You were claimed on the spot by an underclassman you do not know' }],
    relations: [{ char: CharacterId.MAKI, familiarity: 18, affection: 4, reasonZh: '她开始叫你「センパイ」了', reasonEn: 'She started calling you senpai' }]
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '等你反应过来要问她名字，粉色的脑袋已经钻进人流里了。',
    en: 'By the time you think to ask her name, the pink head is already gone into the crowd.'
  }
];

// ==========================================================
// 傍晚：承接上面的选择
// ==========================================================
export const DAY1_EVENING: StoryNode[] = [
  // 走了图书馆或体育馆 → 回家路上经过生田神社
  {
    type: 'branch',
    ifFlag: 'day1_met_maki',
    not: true,
    then: [
      { type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'night', titleZh: '生田神社 · 鸟居前', titleEn: 'Ikuta Shrine · The Torii', subtitleZh: '傍晚 6:05', subtitleEn: '6:05 PM' },
      {
        type: 'narration',
        zh: '回家的路要绕过神社。外公的地图上，这里画得比别处都重——同一个鸟居描了三遍。',
        en: 'The way home goes around the shrine. On your grandfather’s map this spot is drawn heavier than anywhere else: the same torii traced three times over.'
      },
      {
        type: 'narration',
        characterImage: `${INARI}casual_neutral.webp`,
        zh: '鸟居底下坐着一个人。白发，赤脚，脚边放着一双没穿的木屐。天已经很凉了。',
        en: 'Someone is sitting under the torii. White hair, bare feet, a pair of unworn geta set beside her. It is already cold out.'
      },
      {
        type: 'speech',
        speakerZh: '白发的女子',
        speakerEn: 'White-haired Woman',
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
        en: 'The journal in your bag is closed, wedged into the side pocket.'
      },
      {
        type: 'narration',
        characterImage: `${INARI}casual_smug.webp`,
        zh: '你猛地抬头。她已经不在鸟居底下了——木屐还在原地，整整齐齐地摆着。',
        en: 'Your head snaps up. She is no longer under the torii. The geta are still there, set down neatly, side by side.'
      },
      {
        type: 'effect',
        setFlags: ['day1_met_inari'],
        effects: [{ stat: 'guts', amount: 1, reasonZh: '天黑了还敢站在原地把那件事想完', reasonEn: 'You stayed where you were, in the dark, and finished the thought' }],
        relations: [{ char: CharacterId.INARI, familiarity: 12, affection: 2, reasonZh: '她起了兴致', reasonEn: 'You caught her interest' }]
      }
    ]
  },
  // 去了商店街 → 在回程电车上碰到奈绪
  {
    type: 'branch',
    ifFlag: 'day1_met_maki',
    then: [
      { type: 'scene', scene: 'street', bgm: 'night', titleZh: '回家的路', titleEn: 'The Way Home', subtitleZh: '傍晚 6:05', subtitleEn: '6:05 PM' },
      {
        type: 'narration',
        characterImage: `${NAO}casual_neutral.webp`,
        zh: '坡道口有人在等。手里拎着两袋东西，看见你就把其中一袋举起来晃了晃。',
        en: 'Someone is waiting at the foot of the slope, holding two shopping bags. She lifts one of them and waves it at you.'
      },
      {
        type: 'speech',
        speakerZh: '奈绪',
        speakerEn: 'Nao',
        characterImage: `${NAO}casual_angry.webp`,
        jp: '遅い。何時だと思ってんの。',
        zh: '好慢。你以为几点了。',
        en: 'You are late. What time do you think it is.',
        color: 'bg-rose-500'
      },
      {
        type: 'narration',
        zh: '十年了，她生气的样子一点没变。变的是背景——现在她身后是神户的坡道，不是你们老家那条街。',
        en: 'Ten years, and the way she gets annoyed has not changed at all. What has changed is the background: behind her is a Kobe hillside now, not the street you both grew up on.'
      },
      {
        type: 'speech',
        speakerZh: '奈绪',
        speakerEn: 'Nao',
        characterImage: `${NAO}casual_neutral.webp`,
        jp: '……で、どうだった。初日。',
        zh: '……那，怎么样。第一天。',
        en: '...So. How was it. Day one.',
        color: 'bg-rose-500'
      },
      {
        type: 'narration',
        zh: '你正想说"还行"，忽然意识到——这一整天，她是唯一一个不用你翻译就能听懂你说话的人。',
        en: 'You are about to say "fine" when it lands: in this entire day, she is the only person who can understand you without you having to translate yourself first.'
      },
      {
        type: 'effect',
        setFlags: ['day1_met_nao'],
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有把"还行"当成答案交差', reasonEn: 'You did not let "fine" stand as an answer' }],
        relations: [{ char: CharacterId.NAO, affection: 5, reasonZh: '她特地在坡道口等了很久', reasonEn: 'She waited a long time at the foot of that slope' }]
      }
    ]
  }
];
