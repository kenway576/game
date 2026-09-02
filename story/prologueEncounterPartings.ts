import { StoryNode, CharacterId } from '../types';

// ---------------------------------------------------------
// 【第0章】傍晚偶遇的收尾 & 擦肩而过的加演
//
// 为什么单独拆一个文件：prologueData.ts 里那三条傍晚路线本来是
// 「撞见 → 聊两句 → 直接切便利店」，人还站在原地画面就没了。
// 这里补的是每条路线真正的**告别**——互相报上名字、留一句下次见，
// 让"遇见"变成一件有始有终的事。
//
// 两条支线，按玩家当时的选择分叉：
//   · 主动搭话的（问了、递了手账、接了话）→ 完整的道别 + 互报名字
//   · 保持距离的（让路、只点头、笑一笑走开）→ 短一点、留白一点的收尾，
//     但也不再是"人还在原地画面就切走"——她们都会补上一句，
//     那一句正是玩家没接住的东西。
//
// 另外每条路线末尾挂一个 random 节点：回坡道的路上随机跟**没遇到的那两个人
// 之一**擦肩而过。抽中的结果会被就地拼进节点表并随进度存档，
// 所以读档回来还是同一个人，只有重开一轮才会换。
// ---------------------------------------------------------

const REI = '/images/characters/rei/';
const HIK = '/images/characters/hikari/';
const MAK = '/images/characters/maki/';

// ==========================================================
// 擦肩而过（加演）：三段都很短，只留一个印象，不交谈
// ==========================================================

const CAMEO_REI: StoryNode[] = [
  {
    type: 'narration',
    characterImage: `${REI}casual_reading.webp`,
    zh: '快到坡道口时，你在一栋洋馆的门前看见一个人。红框眼镜，一手托着摊开的书，正仰头对着门楣上的雕花较劲——从你走过到走远，她一次都没有低头。',
    en: 'Near the foot of the slope you pass someone standing at the door of one of the old Western houses. Red-framed glasses, an open book balanced on one hand, chin tilted up at a carving above the doorway. From the moment you pass her to the moment you are gone, she never once looks down.'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '你没有出声。这座城市里居然真的有人肯为了一扇门站上半个小时——这件事本身就让你安心了一点。',
    en: 'You say nothing. Somewhere in this city there is a person willing to stand half an hour for a doorway — and somehow that thought alone settles you a little.',
    words: [
      { jp: '見上げる', reading: 'みあげる', zh: '仰头看', en: 'to look up at' }
    ]
  },
  {
    type: 'effect',
    setFlags: ['prologue_glimpsed_rei'],
    relations: [
      { char: CharacterId.REI, familiarity: 2, reasonZh: '路过时不自觉地放慢了半步', reasonEn: 'You slowed half a step without meaning to' }
    ]
  }
];

const CAMEO_HIKARI: StoryNode[] = [
  {
    type: 'narration',
    characterImage: `${HIK}casual_surprised.webp`,
    zh: '拐过坡道口时，一个金发女生举着手机迎面小跑过来，差点撞上你的肩膀。',
    en: 'Rounding the foot of the slope, a blonde girl comes jogging the other way with her phone held up, and nearly takes your shoulder off.'
  },
  {
    type: 'speech',
    speakerZh: '擦肩而过的女生',
    speakerEn: 'A Girl in Passing',
    characterImage: `${HIK}casual_surprised.webp`,
    jp: 'わっ、ごめんっ！——日没、間に合わへんっ！',
    words: [
      { jp: '間に合う', reading: 'まにあう', zh: '来得及、赶得上', en: 'to make it in time' }
    ],
    zh: '哇，抱歉！——日落，要赶不上啦！',
    en: 'Whoa — sorry! The sunset, I am not going to make it!',
    color: 'bg-amber-400'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '她头也不回，黄色的卫衣一路朝海的方向跑远了。刚才那句话里混着关西腔——她学得比你快得多。',
    en: 'She does not look back once; the yellow hoodie keeps going, downhill, toward the sea. There was Kansai-ben mixed into that sentence. She is learning faster than you are.'
  },
  {
    type: 'effect',
    setFlags: ['prologue_glimpsed_hikari'],
    relations: [
      { char: CharacterId.HIKARI, familiarity: 2, reasonZh: '在坡道口差点撞上', reasonEn: 'You very nearly collided at the foot of the slope' }
    ]
  }
];

const CAMEO_MAKI: StoryNode[] = [
  {
    type: 'narration',
    characterImage: `${MAK}punk_laugh.webp`,
    zh: '便利店门口，一个粉头发的女生正倒着走路，一边冲身后的朋友大声说着什么，语速快得像在念绕口令。',
    en: 'Outside the convenience store a pink-haired girl is walking backwards, hollering something over her shoulder at a friend, the words coming out fast enough to be a tongue-twister.'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '她从你面前横穿而过，视线扫到你身上停了半秒——像是把你归了个类——然后就笑着跑掉了。你一个字都没听懂。',
    en: 'She cuts right across your path, her eyes catching on you for half a second — as if filing you under something — and then she is gone, laughing. You did not catch a single word of it.',
    words: [
      { jp: '早口', reading: 'はやくち', zh: '语速快', en: 'fast talking' }
    ]
  },
  {
    type: 'effect',
    setFlags: ['prologue_glimpsed_maki'],
    relations: [
      { char: CharacterId.MAKI, familiarity: 2, reasonZh: '被她扫了一眼', reasonEn: 'Her eyes caught on you for half a second' }
    ]
  }
];

const randomCameo = (...pick: StoryNode[][]): StoryNode => ({ type: 'random', pick });

// ==========================================================
// 北野窄巷 · 铃
// ==========================================================
export const REI_PARTING: StoryNode[] = [
  {
    type: 'branch',
    ifFlag: 'prologue_rei_passed',
    not: true,
    then: [
      {
        type: 'narration',
        characterImage: `${REI}casual_neutral.webp`,
        zh: '她合上书，这才像是第一次注意到天已经黑透了。路灯把两个人的影子叠在同一块墙上。',
        en: 'She closes the book, and only then seems to notice that the sky has gone fully dark. The streetlight lays both your shadows against the same wall.'
      },
      {
        type: 'speech',
        speakerZh: '戴眼镜的女生',
        speakerEn: 'Girl with Glasses',
        characterImage: `${REI}casual_neutral.webp`,
        jp: '……すみません、長々と。こういう話、聞いてくれる人があまりいなくて。',
        words: [
          { jp: '長々と', reading: 'ながながと', zh: '啰嗦地、拖得很长', en: 'at (tedious) length' }
        ],
        zh: '……不好意思，说了这么久。这种话题，愿意听的人不太多。',
        en: '...I am sorry, I went on. There are not many people who will sit through this sort of thing.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '她犹豫了一下，像是在决定要不要多说一句。然后她把书抱在胸前，微微欠了欠身。',
        en: 'She hesitates, as if deciding whether to add one more thing. Then she hugs the book to her chest and inclines her head a fraction.'
      },
      {
        type: 'speech',
        speakerZh: '戴眼镜的女生',
        speakerEn: 'Girl with Glasses',
        characterImage: `${REI}casual_smile.webp`,
        jp: '鈴、といいます。……あなたは？',
        zh: '我叫铃。……你呢？',
        en: 'Rei. That is my name. ...And yours?',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        zh: '你报上名字。她在嘴里轻轻重复了一遍，像是在确认发音——那一瞬间你忽然庆幸，自己刚才没有径直走过去。',
        en: 'You give her your name. She repeats it quietly to herself, as if checking the pronunciation — and in that moment you are suddenly very glad you did not simply walk past.'
      },
      {
        type: 'speech',
        speakerZh: '鈴',
        speakerEn: 'Rei',
        characterImage: `${REI}casual_smile.webp`,
        jp: 'この街、扉を見上げる人は少ないんです。……また、どこかで。',
        words: [
          { jp: 'また', zh: '再、又（下次见）', en: 'again / see you' }
        ],
        zh: '这座城市里，会抬头看门的人不多。……那么，改天再会。',
        en: 'Not many people in this city look up at doorways. ...Until somewhere, sometime.',
        color: 'bg-emerald-500'
      },
      {
        type: 'effect',
        relations: [
          { char: CharacterId.REI, familiarity: 8, affection: 1, reasonZh: '在巷子里互相报上了名字', reasonEn: 'You traded names in an alley' }
        ]
      },
      {
        type: 'narration',
        characterImage: '',
        zh: '她转过身，沿着更深的巷子走了。你站在原地看了一会儿——来到这个国家的第一天，你居然已经知道了一个人的名字。',
        en: 'She turns and walks off into the deeper part of the alley. You stand there a moment longer. Your first day in this country, and you already know one person by name.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_rei_passed',
    then: [
      {
        type: 'narration',
        characterImage: `${REI}casual_neutral.webp`,
        zh: '走到巷口时，身后忽然传来一句话。不像是对你说的——她仍旧仰着头，像在对那扇门自言自语。',
        en: 'At the mouth of the alley a sentence reaches you from behind. It does not sound addressed to you: she is still looking up, talking to the door as much as to anyone.'
      },
      {
        type: 'speech',
        speakerZh: '戴眼镜的女生',
        speakerEn: 'Girl with Glasses',
        characterImage: `${REI}casual_neutral.webp`,
        jp: '……一九〇四年。あなたも、越してきたばかりなんですね。',
        words: [
          { jp: '越す', reading: 'こす', zh: '搬（家）', en: 'to move house' }
        ],
        zh: '……一九〇四年。你也是刚搬来的吧。',
        en: '...Nineteen-oh-four. You have only just moved here yourself, have you not.',
        color: 'bg-emerald-500'
      },
      {
        type: 'narration',
        characterImage: '',
        zh: '你猛地回过头。她没有再看你，只是抬手按了按眼镜——那句话究竟是说给房子听的，还是说给你听的，你没有把握。',
        en: 'You turn sharply. She is not looking at you; she only pushes her glasses up with one finger. Whether that sentence was meant for the house or for you, you cannot tell.'
      },
      {
        type: 'effect',
        relations: [
          { char: CharacterId.REI, familiarity: 3, reasonZh: '她记住了那个在巷子里让路的人', reasonEn: 'She registered the person who gave way in the alley' }
        ]
      },
      {
        type: 'narration',
        zh: '直到走出很远，你才想起自己一个字都没答上。……名字也没有留下。',
        en: 'It is only much later, streets away, that you realise you never answered. Not one word. And you never gave her your name.'
      }
    ]
  },
  randomCameo(CAMEO_HIKARI, CAMEO_MAKI)
];

// ==========================================================
// 神户港栏杆 · 光
// ==========================================================
export const HIKARI_PARTING: StoryNode[] = [
  {
    type: 'branch',
    ifFlag: 'prologue_hikari_nodded',
    not: true,
    then: [
      {
        type: 'narration',
        characterImage: `${HIK}casual_happy.webp`,
        zh: '她把手机塞回口袋，忽然伸出手来——不是要握手，而是掌心朝上，像在等你把什么东西放上去。',
        en: 'She stuffs the phone back in her pocket and abruptly puts out a hand — not to shake, but palm up, as if waiting for you to put something in it.'
      },
      {
        type: 'speech',
        speakerZh: '金发的女生',
        speakerEn: 'Blonde Girl',
        characterImage: `${HIK}casual_happy.webp`,
        jp: '名前！先輩の特権で先に聞いとく。私、ヒカリ。一週間だけ先輩やで。',
        words: [
          { jp: '先輩', reading: 'せんぱい', zh: '前辈', en: 'senior / one who came before' }
        ],
        zh: '名字！我用前辈的特权先问。我叫光。只早你一个星期的前辈。',
        en: 'Name! Senior privilege, I get to ask first. I am Hikari. Senior by exactly one week.',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        zh: '你把名字说出口。她煞有介事地点点头，然后掰着手指算了半天。',
        en: 'You say your name out loud. She nods with great ceremony, then spends a while counting on her fingers.'
      },
      {
        type: 'speech',
        speakerZh: '光',
        speakerEn: 'Hikari',
        characterImage: `${HIK}casual_smug.webp`,
        jp: 'うん、覚えた。……あんな、最初の一ヶ月がいちばんしんどいねん。でも大丈夫、ぜったい慣れるから。',
        words: [
          { jp: '慣れる', reading: 'なれる', zh: '习惯、适应', en: 'to get used to' }
        ],
        zh: '嗯，记住了。……我跟你说，最开始那一个月是最难熬的。不过没事，绝对会习惯的。',
        en: 'Right, got it. ...Listen — the first month is the worst of it. But you will be fine. You get used to it. Everybody does.',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        zh: '「ぜったい」这个词她说得又快又重，像是在说服自己，而不是说服你。',
        en: 'She lands hard on the word "definitely", fast and heavy, as though she is talking herself into it rather than you.'
      },
      {
        type: 'effect',
        relations: [
          { char: CharacterId.HIKARI, familiarity: 9, affection: 2, reasonZh: '在栏杆边互相报上了名字', reasonEn: 'You traded names at the harbour railing' }
        ]
      },
      {
        type: 'speech',
        speakerZh: '光',
        speakerEn: 'Hikari',
        characterImage: `${HIK}casual_happy.webp`,
        jp: 'ほな、またな！困ったら港に来て叫んどき、たぶん聞こえるから！',
        zh: '那，回头见！有麻烦就来港边喊一嗓子，大概听得见！',
        en: 'Right — see you around! If you get stuck, come down to the harbour and yell. I will probably hear you.',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        characterImage: '',
        zh: '她挥挥手跑了，黄色的卫衣很快被人流吞没。海风还在吹。你发现自己嘴角是翘着的。',
        en: 'She waves and takes off, the yellow hoodie swallowed by the crowd within seconds. The sea wind keeps coming. You notice the corners of your mouth are up.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_hikari_nodded',
    then: [
      {
        type: 'narration',
        characterImage: `${HIK}casual_happy.webp`,
        zh: '她朝你挥挥手就跑了。跑出十几米，忽然停住，转身冲你喊了一句。',
        en: 'She waves and takes off. Ten metres on she stops dead, spins round, and shouts something back at you.'
      },
      {
        type: 'speech',
        speakerZh: '金发的女生',
        speakerEn: 'Blonde Girl',
        characterImage: `${HIK}casual_happy.webp`,
        jp: '最初の一ヶ月がいちばんしんどいで——！でも慣れるから！ぜったい！',
        words: [
          { jp: '慣れる', reading: 'なれる', zh: '习惯、适应', en: 'to get used to' }
        ],
        zh: '最开始那一个月是最难熬的——！不过会习惯的！绝对！',
        en: 'The first month is the worst of it — ! But you get used to it! Definitely!',
        color: 'bg-amber-400'
      },
      {
        type: 'narration',
        characterImage: '',
        zh: '没等你反应过来，黄色的卫衣已经被人流吞没了。',
        en: 'Before you can put a word together the yellow hoodie is gone, swallowed by the crowd.'
      },
      {
        type: 'effect',
        relations: [
          { char: CharacterId.HIKARI, familiarity: 3, reasonZh: '她冲你喊了一句才跑', reasonEn: 'She shouted one thing at you before running off' }
        ]
      },
      {
        type: 'narration',
        zh: '你站在原地才想起来——连名字都没问。她怎么知道你听得懂？……又或者，她根本不在乎你听不听得懂。',
        en: 'Standing there, it occurs to you that you never asked her name. How did she know you would understand? ...Or perhaps she simply did not care whether you did.'
      }
    ]
  },
  randomCameo(CAMEO_REI, CAMEO_MAKI)
];

// ==========================================================
// 三宫商店街 · 真希
// ==========================================================
export const MAKI_PARTING: StoryNode[] = [
  {
    type: 'branch',
    ifFlag: 'prologue_maki_left',
    not: true,
    then: [
      {
        type: 'narration',
        characterImage: `${MAK}punk_neutral.webp`,
        zh: '她把最后一颗章鱼烧塞进嘴里，边嚼边上下打量你，那眼神像是在给你标价。',
        en: 'She posts the last takoyaki into her mouth and looks you up and down while she chews, with the air of someone pricing you up.'
      },
      {
        type: 'speech',
        speakerZh: '粉发的女生',
        speakerEn: 'Pink-haired Girl',
        characterImage: `${MAK}punk_neutral.webp`,
        jp: 'なあ、自分、名前は？',
        zh: '喂，你，叫什么名字？',
        en: 'Oi. You. What is your name?',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '你老老实实报上名字。她「嗯——」了一声，明显没打算记。',
        en: 'You give your name, dutifully. She goes "hmmm" in a way that makes it very clear she is not committing it to memory.'
      },
      {
        type: 'speech',
        speakerZh: '粉发的女生',
        speakerEn: 'Pink-haired Girl',
        characterImage: `${MAK}punk_laugh.webp`,
        jp: 'ふーん。ま、ええわ。……ウチの名前？教えたるわけないやろ、まだ一回しか会うてへんのに。',
        words: [
          { jp: '教える', reading: 'おしえる', zh: '告诉、教', en: 'to tell / to teach' }
        ],
        zh: '哦——。行吧。……我的名字？怎么可能告诉你啊，才见过一次而已。',
        en: 'Huh. Well, whatever. ...My name? Not a chance. We have met exactly once.',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        zh: '她说完转身就走。走出三四米，忽然又倒退着挪回来一点，歪着头补了一句。',
        en: 'She turns to go. Three or four metres on she suddenly reverse-walks a little way back, head tilted, and adds one more thing.'
      },
      {
        type: 'speech',
        speakerZh: '粉发的女生',
        speakerEn: 'Pink-haired Girl',
        characterImage: `${MAK}punk_pout.webp`,
        jp: '……この辺、ウチよぉおるから。今度見かけたら、「おおきに」ぐらい言えるようになっとき。ほな。',
        words: [
          { jp: '見かける', reading: 'みかける', zh: '（偶然）看见', en: 'to happen to see' }
        ],
        zh: '……这一带，我经常在。下次要是撞见我，起码得会说句「おおきに」啊。走了。',
        en: '...I am around here a lot. Next time you spot me, you had better be able to manage an "ookini" at least. Later.',
        color: 'bg-pink-500'
      },
      {
        type: 'effect',
        relations: [
          { char: CharacterId.MAKI, familiarity: 8, affection: 1, reasonZh: '她把这条街定成了「还会再碰上」的地方', reasonEn: 'She filed this street as somewhere you would turn up again' }
        ]
      },
      {
        type: 'narration',
        characterImage: '',
        zh: '粉色的脑袋钻进人流，很快就看不见了。你在原地反应了半天才明白过来——她刚才那句，是在约下次。',
        en: 'The pink head slips into the crowd and is gone. You stand there for a while before it lands: that last line was her arranging a next time.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_maki_left',
    then: [
      {
        type: 'narration',
        characterImage: `${MAK}punk_pout.webp`,
        zh: '走出十几米，你没忍住回头。她正把签子丢进垃圾桶，视线不偏不倚地撞上你的。',
        en: 'Ten metres on you cannot help looking back. She is dropping her skewer in the bin, and her eyes land squarely on yours.'
      },
      {
        type: 'speech',
        speakerZh: '粉发的女生',
        speakerEn: 'Pink-haired Girl',
        characterImage: `${MAK}punk_pout.webp`,
        jp: 'なんや、まだおったんか。……逃げ足だけは速いくせに。',
        words: [
          { jp: '逃げる', reading: 'にげる', zh: '逃跑', en: 'to run away' }
        ],
        zh: '干嘛，还没走啊。……明明跑得挺快的。',
        en: 'What, still here? ...For someone that quick to bolt.',
        color: 'bg-pink-500'
      },
      {
        type: 'narration',
        characterImage: '',
        zh: '你慌忙转回头，加快脚步。身后传来一声很短的笑——不像嘲笑，倒像是记住了什么。',
        en: 'You whip back round and walk faster. A short laugh follows you — not mocking, exactly. More like something being filed away.'
      },
      {
        type: 'effect',
        relations: [
          { char: CharacterId.MAKI, familiarity: 3, reasonZh: '她记住了那个在摊子前溜掉的人', reasonEn: 'She remembered the one who bolted at the stall' }
        ]
      },
      {
        type: 'narration',
        zh: '这座城市自己在往前走，不会停下来等你。这个念头没让你难过——反而让你想快点跟上。',
        en: 'This city is moving on its own, and it is not going to stop and wait for you. The thought does not make you sad. It makes you want to catch up faster.'
      }
    ]
  },
  randomCameo(CAMEO_REI, CAMEO_HIKARI)
];
