import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 稻荷 · 第②段「面の下」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：夏祭 · 生田筋的摊子
//
// 【第①段留下的题】
// 第①段露的是"尺度"：她数树不数年，她的"上次"是六十年前。
// 结尾她说了两遍「来なくてもよいのじゃ」，第二遍是对树说的。
//
// 【致敬：夏目友人帳】
// 借的核不是妖怪，是**友人帳**这件东西本身：
// 一本写满名字的册子，册子上的每个名字都比持有者先走。
// 那部作品最疼的从来不是打斗，是"我认识过他"这句话
// 只能由一个人来说，另一边已经没有人能接。
//
// 稻荷的版本：她记名字。她记了一千年的名字。
// 她背得出，因为她从来不需要再叫。
//
// 【致敬：かぐや姫の物語】
// 借的是"活过"和"看过"的差别——辉夜姬被养在最好的地方，
// 却不算活过，因为她一直是被观看的那个，从来没弄脏过手。
// 稻荷这一段要弄脏一次手：捞金鱼，网破了，很难看。
//
// 【这一段的墙】
// 她不怕死，也不怕孤独。她怕的是**开始记你的名字**，
// 因为她知道那一栏最后会变成什么样子。
// ---------------------------------------------------------

const I = '/images/characters/inari/';

export const INARI_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'ikuta_shrine_summer_festival',
    bgm: 'town',
    titleZh: '面の下',
    titleEn: 'Under the Mask',
    subtitleZh: '夏夜 · 生田神社的祭典',
    subtitleEn: 'Summer night · The festival at Ikuta Shrine'
  },
  {
    type: 'narration',
    zh: '生田神社的夏祭。参道两边全是摊子，从鸟居一路排到马路上。',
    en: 'The summer festival at Ikuta. Stalls line the approach the whole way from the torii out to the road.'
  },
  {
    type: 'narration',
    zh: '你们约好在第三个石灯笼边碰头。你在祭典喧嚣的人声与太鼓声中等得额头微汗，她却依然迟迟不见踪影。',
    en: 'You agreed to meet at the third stone lantern. In the heat of the drums and festival crowd you wait with brow beaded in sweat, yet she is still nowhere in sight.'
  },
  {
    type: 'narration',
    characterImage: `${I}summer_neutral.webp`,
    zh: '当她终于现身时，却完全不是从参道走来的。仿佛是从熙攘人潮与暖黄灯影中凭空化出一般——前一刻那处空无一物，下一刻她便已笑意盈盈地立在那里。',
    en: 'When she finally appears, she does not walk up the approach. It is as if she condensed from the warm lantern glow and bustle — one moment empty, the next standing with a faint smile.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_happy.webp`,
    jp: '待たせたかえ。すまぬな、ちと寄り道をしておった。',
    words: [{ jp: '寄り道', reading: 'よりみち', zh: '绕路', en: 'a detour' }],
    zh: '让你久等了吧。抱歉呢，稍微绕了点路。',
    en: 'Have I kept you? Forgive me, I took something of a detour.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '她手里拿着一个狐狸面具，戴在头侧。祭典上到处都有卖，五百日元一个。',
    en: 'She has a fox mask pushed up on the side of her head. They sell them everywhere at the festival, five hundred yen each.'
  },
  {
    type: 'narration',
    characterImage: `${I}summer_neutral_alt.webp`,
    zh: '你说这个你也有一个。她说她知道——她说她「每年都要买一个」。',
    en: 'You say you have one of those. She says she knows, and that she buys one every year.'
  },
  {
    type: 'narration',
    zh: '你问买来干嘛。她说：戴上之后，别人就看不出来是她了。',
    en: 'You ask what for. She says: with it on, nobody can tell it is her.'
  },
  {
    type: 'narration',
    zh: '这句话你走过一整排摊子才想明白哪里不对——本来就没有人认得出她。',
    en: 'It takes you a whole row of stalls to work out what is wrong with that. Nobody recognises her anyway.'
  },

  // ---- 选择 1：摊子 ----
  {
    type: 'choice',
    promptZh: '走到金鱼摊前面。老板正在换水。',
    promptEn: 'You stop at the goldfish scooping. The owner is changing the water.',
    options: [
      {
        id: 'inari2_scoop',
        labelZh: '塞一个纸网给她：「你来。」',
        labelEn: 'Push a paper scoop into her hand. "You go."',
        jp: '稲荷がやってみ。',
        hintZh: '她一千年只看，没有下过手',
        hintEn: 'A thousand years of watching, and never once her own hands.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你让一位神明去捞金鱼', reasonEn: 'You made a god scoop for goldfish' }],
        relations: [{ char: CharacterId.INARI, familiarity: 5, affection: 14, reasonZh: '她第一次弄湿了自己的手', reasonEn: 'She got her own hands wet for the first time' }],
        setFlags: ['inari_story_scooped'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}summer_curious.webp`,
            zh: '她把纸网翻来覆去看了半天，那个表情像是在研究一件出土文物。',
            en: 'She turns the paper scoop over and over with the expression of somebody examining an excavated artefact.'
          },
          {
            type: 'narration',
            zh: '她蹲下去，伸手，网破了。第一下就破了。',
            en: 'She crouches, reaches in, and the paper tears. On the very first try.'
          },
          {
            type: 'narration',
            characterImage: `${I}summer_curious.webp`,
            zh: '她整个人彻底愣住了。是真的猝不及防——完全不是平时装模作样的调侃轻笑，而是货真价实、大脑一片空白的手足无措。',
            en: 'She completely freezes. Truly caught off guard — not her usual feigned teasing, but genuine, wide-eyed bewilderment.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_shy.webp`,
            jp: '……のう。これ、破れるものなのか。',
            zh: '……喂。这东西，是会破的吗。',
            en: '...I say. Is this thing meant to tear?',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '一千年。她在这条参道上看过几万个小孩捞金鱼。她一次都没伸过手，所以她不知道纸会破。',
            en: 'A thousand years. She has watched tens of thousands of children on this approach. She has never once put her hand in, so she did not know the paper tears.'
          },
          {
            type: 'narration',
            zh: '你又买了一张给她。这次成功了：一条最小的，尾巴有点残。',
            en: 'You buy her another. This time she gets one: the smallest in the tank, with a ragged tail.'
          },
          {
            type: 'narration',
            characterImage: `${I}summer_happy.webp`,
            zh: '她提着那个塑料袋，走了一路都没有换过手。',
            en: 'She carries the plastic bag the whole way without once swapping hands.'
          }
        ]
      },
      {
        id: 'inari2_watch',
        labelZh: '陪她站在旁边看',
        labelEn: 'Stand and watch beside her',
        hintZh: '她习惯当观众。你可以陪她当',
        hintEn: 'She is used to being the audience. You can be one with her.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有推她', reasonEn: 'You did not push her' }],
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 6, reasonZh: '她说出了那个孩子曾祖父的名字', reasonEn: 'She named the child’s great-grandfather' }],
        then: [
          {
            type: 'narration',
            characterImage: `${I}summer_neutral.webp`,
            zh: '一个五六岁的小孩在捞，捞了七次，一条都没有。他妈妈在后面笑。',
            en: 'A child of five or six tries seven times and gets nothing. His mother laughs behind him.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_happy.webp`,
            jp: 'あの子の曾祖父も、そこで七回失敗しておったよ。',
            zh: '那孩子的曾祖父，也在那个位置失败过七次哦。',
            en: 'That boy’s great-grandfather failed seven times in that same spot.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她说得像是在说昨天的事。对她来说也差不多。',
            en: 'She says it as though it were yesterday. For her it is roughly yesterday.'
          },
          {
            type: 'narration',
            characterImage: `${I}summer_neutral_alt.webp`,
            zh: '然后她说了那个曾祖父的名字。全名，三个字，她一顿都没打。',
            en: 'Then she says the great-grandfather’s name. In full, without a pause.'
          }
        ]
      },
      {
        id: 'inari2_mask',
        labelZh: '「面具给我看看。」',
        labelEn: '"Let me see the mask."',
        jp: 'その面、ちょっと見せて。',
        hintZh: '她说戴上就没人认得出她',
        hintEn: 'She said the mask makes her unrecognisable.',
        requires: { stat: 'knowledge', min: 8 },
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你注意到一句不成立的话', reasonEn: 'You noticed a sentence that does not hold' }],
        relations: [{ char: CharacterId.INARI, familiarity: 3, affection: 12, reasonZh: '你没有让那句话过去', reasonEn: 'You did not let that line pass' }],
        setFlags: ['inari2_took_mask'],
        then: [
          {
            type: 'narration',
            zh: '她把面具递给你。塑料的，很便宜，边缘还有毛刺。',
            en: 'She hands it over. Cheap moulded plastic with the flash still on the rim.'
          },
          {
            type: 'narration',
            characterImage: `${I}summer_neutral.webp`,
            zh: '你说：戴上就没人认得出你——可是本来也没有人认得出你。',
            en: 'You say: with it on nobody can tell it is you. But nobody can anyway.'
          },
          {
            type: 'narration',
            zh: '她笑了一下，笑得很慢。',
            en: 'She smiles, slowly.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_neutral.webp`,
            jp: '……よう聞いておったのう。',
            zh: '……听得很仔细呢。',
            en: '...You were listening closely.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她把面具拿回去，重新戴回头侧。',
            en: 'She takes it back and pushes it up onto the side of her head again.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_shy.webp`,
            jp: '被るのはな、他人に見えぬようにではない。',
            zh: '戴它啊，不是为了别人看不见我。',
            en: 'I do not wear it so that others cannot see.',
            color: 'bg-amber-500'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_shy.webp`,
            jp: '祭りの間だけ、わらわも「その他大勢」になれるのじゃ。',
            words: [{ jp: 'その他大勢', reading: 'そのたおおぜい', zh: '其余的一大群人', en: 'everybody else, in bulk' }],
            zh: '只有祭典这段时间，我也能变成「其他一大堆人」里的一个。',
            en: 'For the length of the festival, I too can be one of the crowd.',
            color: 'bg-amber-500'
          }
        ]
      }
    ]
  },

  // ---- 中段：那本册子 ----
  {
    type: 'narration',
    zh: '祭典的高潮过了。摊子开始收，人往车站方向散。',
    en: 'The festival passes its peak. The stalls begin breaking down and the crowd drifts towards the station.'
  },
  {
    type: 'narration',
    characterImage: `${I}summer_neutral_alt.webp`,
    zh: '你们绕到本殿后面那片林子。她坐回那块石头上，从袖子里拿出一个东西。',
    en: 'You cut round behind the main hall into the wood. She sits back on the rock and takes something out of her sleeve.'
  },
  {
    type: 'narration',
    zh: '一本册子。纸黄得发脆，装订换过很多次——线的颜色至少有五种。',
    en: 'A booklet. The paper is yellow and brittle and it has been rebound many times; there are at least five colours of thread.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_neutral.webp`,
    jp: '名前じゃ。ここに来て、二度目も来た者の。',
    zh: '名字。来过这里，而且来了第二次的人的名字。',
    en: 'Names. Of those who came here, and then came a second time.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '你翻了几页。字体一路在变，毛笔、钢笔、圆珠笔。最后几页是铅笔。',
    en: 'You turn a few pages. The hand changes as you go, brush to fountain pen to biro. The last pages are pencil.'
  },
  {
    type: 'narration',
    zh: '每一个名字下面都有两个日期。第二个是后来补上去的——墨色比第一个新。',
    en: 'Every name has two dates under it. The second was added later; the ink is always fresher than the first.'
  },
  {
    type: 'narration',
    characterImage: `${I}summer_neutral.webp`,
    zh: '你数了一下最后一页：十一个名字，十一个都补齐了。',
    en: 'You count the last page. Eleven names. All eleven have both dates.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_neutral.webp`,
    jp: 'わらわは忘れぬ。忘れられぬ、が正しいかの。',
    zh: '我不会忘。或者说，是忘不掉，比较准确。',
    en: 'I do not forget. Or rather, I cannot; that is the more accurate way to put it.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '你翻到最后一页的最后。有一行是空的，只画了一道很浅的横线，像是在等什么。',
    en: 'At the very end of the last page there is an empty line with a faint rule drawn across it, as though waiting for something.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '她看着你翻到那一行，没有阻止。',
    promptEn: 'She watches you reach that line and does not stop you.',
    options: [
      {
        id: 'inari2_write_me',
        labelZh: '「那一行是留给我的吧。」',
        labelEn: '"That line is for me, isn’t it."',
        jp: 'その一行、俺のじゃろ。',
        hintZh: '她画了线，就是已经决定了',
        hintEn: 'She ruled the line. That decision is already made.',
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你要求被写进一本只会增加结束日期的册子', reasonEn: 'You asked to be entered in a book that only ever gains end dates' }
        ],
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 20, reasonZh: '她合上了册子，很久没有说话', reasonEn: 'She closed the book and said nothing for a long time' }],
        setFlags: ['inari_story_the_line'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}summer_curious.webp`,
            zh: '她把册子合上了，很快，像是被烫到。',
            en: 'She shuts the book fast, as though it burned.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_neutral.webp`,
            jp: 'わらわはな、書いた日から数え始めてしまうのじゃ。',
            zh: '我啊，从写下去的那天起，就会开始数了。',
            en: 'You see, from the day I write it, I begin counting.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '这是她第一次说出一件她做不到的事。',
            en: 'It is the first time she has named something she cannot manage.'
          },
          {
            type: 'narration',
            characterImage: `${I}summer_shy.webp`,
            zh: '你说那就数吧。她说你不懂。你说你确实不懂——你只有一次。',
            en: 'You say then count. She says you do not understand. You say no, you do not; you only get the one.'
          },
          {
            type: 'narration',
            zh: '她低下头，肩膀动了一下，很轻，轻到可以当作没看见。',
            en: 'She looks down. Her shoulders move once, so slightly that it could be taken as nothing.'
          }
        ]
      },
      {
        id: 'inari2_dont_write',
        labelZh: '「别写。我自己会来。」',
        labelEn: '"Don’t write it. I’ll come anyway."',
        jp: '書かんでええ。勝手に来るし。',
        hintZh: '册子是她记住的方式。你可以让她不用记',
        hintEn: 'The book is how she remembers. You can free her from needing it.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你替她省下了一次开始数数', reasonEn: 'You spared her one more count' }],
        relations: [{ char: CharacterId.INARI, familiarity: 8, affection: 14, reasonZh: '没有人提过"不用记得我"', reasonEn: 'Nobody had ever offered not to be remembered' }],
        then: [
          {
            type: 'narration',
            characterImage: `${I}summer_shy.webp`,
            zh: '她抬头看你，看了很久。',
            en: 'She looks up at you for a long time.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_neutral.webp`,
            jp: '……それは、優しいのか、ずるいのか。',
            zh: '……那到底是温柔，还是狡猾呢。',
            en: '...I wonder whether that is kindness or cunning.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她把册子收回袖子里。收进去之前，她用拇指压了一下那条空的横线。',
            en: 'She puts the book back into her sleeve. Before she does, she presses that blank rule once with her thumb.'
          }
        ]
      },
      {
        id: 'inari2_first_page',
        labelZh: '翻到第一页看',
        labelEn: 'Turn to the first page',
        hintZh: '第一个名字是谁',
        hintEn: 'Who was the first name.',
        requires: { stat: 'knowledge', min: 10 },
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你去看了这本册子的起点', reasonEn: 'You went and looked at where the book starts' }],
        relations: [{ char: CharacterId.INARI, familiarity: 4, affection: 16, reasonZh: '她没有拦你，虽然她很想拦', reasonEn: 'She did not stop you, though she wanted to' }],
        setFlags: ['inari_story_first_name'],
        then: [
          {
            type: 'narration',
            zh: '第一页只有一个名字，写得很大，占了整整一页。',
            en: 'The first page has a single name on it, written large enough to fill the page.'
          },
          {
            type: 'narration',
            zh: '两个日期之间隔了十四年。看笔迹，写第一个日期的时候，她还不太会写字。',
            en: 'Fourteen years between the two dates. From the hand, she was still learning to write when she put the first one down.'
          },
          {
            type: 'narration',
            characterImage: `${I}summer_neutral.webp`,
            zh: '你抬头。她把脸转开了。',
            en: 'You look up. She has turned her face away.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_neutral.webp`,
            jp: '一番最初のは、な。字を教えてくれた者じゃ。',
            zh: '最开始那个啊。是教我写字的人。',
            en: 'The very first one. He is the one who taught me to write.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '一千年前有一个人教了一个神写字，然后那个神用学到的字，写下了那个人死掉的日子。',
            en: 'A thousand years ago somebody taught a god to write, and the god used what she had learned to record the day he died.'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '祭典的灯一排一排熄掉。林子里只剩下最后一盏，挂在参道口。',
    en: 'The festival lights go out in rows. One is left in the wood, at the mouth of the approach.'
  },
  {
    type: 'narration',
    characterImage: `${I}summer_neutral_alt.webp`,
    zh: '她站起来的时候，你第一次看清那件事——她的影子不动。风把树影吹得乱七八糟，她的没有动过一下。',
    en: 'When she stands, you see it clearly for the first time: her shadow does not move. The wind throws every other shadow about and hers has not shifted once.'
  },
  {
    type: 'narration',
    zh: '你没有说。她也知道你看见了。',
    en: 'You do not say anything. She knows you saw.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_neutral.webp`,
    jp: '来年もな、面を買うてやる。二つ。',
    zh: '明年啊，我也给你买面具。两个。',
    en: 'Next year I shall buy masks. Two of them.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '「明年」。她第一次用了一个这么短的单位。',
    en: '"Next year." It is the first time she has used a unit that short.'
  },
  {
    type: 'effect',
    setFlags: ['inari_story_2_done', 'inari_story_book_of_names'],
    effects: [
      { stat: 'knowledge', amount: 3, reasonZh: '一本册子，每个名字两个日期', reasonEn: 'One book, two dates per name' },
      { stat: 'kindness', amount: 2, reasonZh: '你没有点破那个不动的影子', reasonEn: 'You let the motionless shadow go unmentioned' }
    ],
    relations: [
      { char: CharacterId.INARI, familiarity: 8, affection: 16, reasonZh: '她说了「明年」', reasonEn: 'She said "next year"' }
    ]
  }
];
