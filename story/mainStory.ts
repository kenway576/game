import { CharacterId, GameCalendar, StoryFlags, StoryNode, FamiliarityMap } from '../types';
import { getInitialFamiliarity, schoolDayNumber } from '../constants';
import { eventCgNode } from '../data/eventCgs';

// ==========================================================
// 📕 主线：外公那张地图
//
// 【为什么这个游戏需要一条主线】
// 八个人各有三段专属剧情，但那是八条**并行**的线。玩家一年玩下来，
// 记住的是"我攻略了谁"，而不是"这一年发生了什么"。
// 主线负责后面那一件事：它跑在所有恋爱线底下，
// 而且不管你走哪条线，它都在。
//
// 【它讲什么】
// 序章第一天，主角背包里有两样东西：外公一九六几年的手账，
// 和他手绘的一张神户地图。地图上生田神社那个鸟居被描了三遍，
// 比别处都重。第一章里主角在鸟居底下遇到了稻荷。
//
// 主线就是这一条：**他当年在那儿干什么，为什么要描三遍。**
//
// 【答案，以及为什么答案必须由稻荷来给】
// 稻荷活了一千八百年，看着人来人往。她有一本记名字的帐。
// 外公的名字在里面。他在这儿待了一年，每天来，记东西，
// 然后下坡走了，再没回来。
//
// 而真相是反高潮的：他不是在找什么，也不是在藏什么。
// 他做的事和主角现在做的**一模一样**——把一个不属于自己的、
// 注定要结束的普通年份记下来。地图上那三道线不是记号，
// 是同一条路走得太多，笔在纸上磨出来的沟。
//
// 手账第一页写"坂を上る。長い。"，最后一页写"坂を下る。短い。"
// 同一条坡。
//
// 【所以这条主线在说什么】
// 你现在正在过的这一年——一个你终将离开的地方的、
// 平平无奇的一年——是值得记下来的。
// 这本来就是这个游戏的题目，主线只是把它说出口。
//
// 【为什么不跟恋爱线抢】
// 五章全部在神社，全部只有稻荷一个人在场，而且**一次都不加好感度**。
// 稻荷自己的三段专属剧情另有一套。主线动的是主角，不是关系。
//
// ----------------------------------------------------------
// 【第二版：把八条线收进来，加一个"等了八百年"的底】
// 用户要两件事：八个人的线最后要接成一条大主线；稻荷要更强调千年这个属性，
// 参考《超かぐや姫！》——ヤチヨ就是八千年后的かぐや，她一直知道，一直没说。
//
// 用户定的三条：
//   · 穿越写成梦，不点破是不是真的。唯一的证据是单词本少了一页。
//   · 最终章放在各自第③段之后（第③段的相爱/挚友结局照旧），作为尾声。
//   · 其他人跟外公的关联只给一页手账（story/grandfatherJournal.ts），不改她们的故事。
//
// 于是这条线变成一个闭环：
//   修了式那天天亮前，主角在鸟居底下走进了寿永三年（一一八四）的生田之森——
//   源平合战的第二天。一棵烧了一半的梅树下坐着一只还只有一条尾巴、还不识字的小狐狸。
//   她问他的名字。他从单词本上撕下一页，在「待つ」的背面写下名字给她。
//   她后来学会写字，就是为了读懂这张纸；后来有了那本名字的帐，
//   就把这张纸糊在了封面里侧——比"教她写字的人"那一页（②）还早一页。
//   一九六四年外公来报名字，她认出了那个姓。地图上第三条线是她自己描的。
//   所以：外公走了七百多次那条坡，主角在这一年来了神户，
//   第一次在鸟居底下遇见她的时候，她早就知道他是谁——等了八百多年，一句没说，
//   因为说了的话，他也许就不会走上那条坡，她也就得不到那个名字。
//
// 八条线在哪里接上：地图上除了鸟居还有几个铅笔点，正好是每个人第③段的地点，
// 第③段之后手账里对应的那一页会被翻到。最终章里主角在雾里回不来，
// 那些点亮起来，有人在叫他的名字——他跟着好感度最高的那个人的声音走（heart 节点）。
// 跟着稻荷走的那一支，就是辉夜那一版的结局。
//
// 埋下去的伏笔：稻荷①那棵梅（一一八四年二月，箙の梅）、「是打仗之前」；
// ②封面里侧那个方形的鼓包；③相爱线里那支便利店的圆珠笔；
// 主线第 2 章地图上的铅笔点、第 3 章她不让碰封面、第 4 章她看你的那一眼、
// 第 6 章她盯着你写字、承认第三条线是她描的。
// ==========================================================

export interface MainChapterDef {
  id: string;
  n: number;
  titleZh: string; titleEn: string;
  // 大厅上那一行小字。要够勾人，又不能剧透。
  teaseZh: string; teaseEn: string;
  // 最早第几天之后才可能出现。
  // 数的是**开学以来的日历天**（schoolDayNumber 就是这个口径：
  // 4/11 是 0，次年 3/23 是 346），不是上过几节课。
  // 一开始我按"上学日"写了 20/60/115/175/225，而一学年只有 198 个上学日，
  // 于是第 6 章那句「明天是修了式」会在十一月播出来。
  minDay: number;
  requiresFlags?: string[];
  minInariFamiliarity?: number;
  // 最终章：只在学年结束那一刻补演（修了式之前），大厅上不出现
  finale?: boolean;
  script: StoryNode[];
}

const I = '/images/characters/inari/';
const INARI = 'bg-amber-500';

// ==========================================================
// 第 2 章 · 描了三遍的鸟居
// ==========================================================
const CH2: StoryNode[] = [
  {
    type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'town',
    titleZh: '第 2 章 · 描了三遍的鸟居',
    titleEn: 'Chapter 2 · The Torii Traced Three Times',
    subtitleZh: '生田神社', subtitleEn: 'Ikuta Shrine'
  },
  {
    type: 'narration',
    zh: '你把手账摊在鸟居底下的石阶上，对着实物看那张地图。',
    en: 'You spread the journal open on the stone step under the torii and hold the map up against the real thing.'
  },
  {
    type: 'narration',
    zh: '比例是对的。位置是对的。连边上那棵樟树都在，只是画得比现在细一圈——那是六十年前的粗细。',
    en: 'The scale is right. The position is right. Even the camphor tree beside it is there, drawn a size thinner than it is now. That is how thick it was sixty years ago.'
  },
  {
    type: 'narration',
    zh: '只有一件事对不上：鸟居这个位置，他描了三遍。三条线几乎重合，但没有完全重合，所以看上去像有点抖。',
    en: 'Only one thing does not line up. He drew this torii three times. The three lines almost overlap but not quite, so the whole shape looks slightly unsteady.'
  },
  {
    // 八个人第③段的地点。最终章里它们会亮
    type: 'narration',
    zh: '地图上别处还有几个很小的铅笔点，散在城里：港口的栏杆边、北边的山上、学校那一片、元町的高架底下……你一直以为那是他随手点的，像人打电话的时候在纸角上画的那种东西。',
    en: 'Elsewhere on the map there are a few tiny pencil dots scattered across the city: by the harbour railing, up the mountain to the north, around the school, under the tracks at Motomachi. You have always assumed he made them absent-mindedly, the way people doodle in the corner of a page while on the phone.'
  },
  {
    type: 'narration',
    characterImage: `${I}casual_neutral.webp`,
    zh: '「その線な。」有人在你背后说，「三本ともお主の祖父の手じゃ。」',
    en: 'Those lines, says someone behind you. All three of them are your grandfather\'s hand.'
  },
  {
    type: 'narration',
    zh: '你没有回头。因为在你回头之前，你先想清楚了一件事：你从来没有跟任何人说过这是你外公的。',
    en: 'You do not turn round, because before you turn round you work something out: you have never told anybody this was your grandfather\'s.'
  },
  {
    type: 'choice',
    promptZh: '身后的人在等你开口。',
    promptEn: 'The person behind you is waiting.',
    options: [
      {
        id: 'ch2_how',
        labelZh: '「你怎么知道这是我外公的。」',
        labelEn: '"How do you know this was my grandfather\'s."',
        jp: 'なんで、俺の祖父のだって分かるんだ。',
        hintZh: '这是唯一要紧的问题', hintEn: 'It is the only question that matters.',
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 2, reasonZh: '你没有绕开那个问题，她欣赏这一点', reasonEn: 'You went at the question directly, which she rated' }],
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你没有先假装自己听错了', reasonEn: 'You did not start by pretending you had misheard' }],
        setFlags: ['main2_asked_how'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}casual_neutral.webp`,
            jp: '同じ字じゃからのう。',
            zh: '因为是同一个人的字啊。',
            en: 'Because it is the same hand.',
            color: INARI,
            words: [{ jp: '字', reading: 'じ', zh: '字迹', en: 'handwriting' }]
          },
          {
            type: 'narration',
            zh: '她说这句话的语气，就像在说今天有点热。',
            en: 'She says it in the tone of someone remarking that it is warm today.'
          }
        ]
      },
      {
        id: 'ch2_three',
        labelZh: '「为什么是三遍？」',
        labelEn: '"Why three times?"',
        jp: 'なんで三回も？',
        hintZh: '你更在意那三条线', hintEn: 'The three lines are what you actually care about.',
        relations: [{ char: CharacterId.INARI, familiarity: 4, affection: 4, reasonZh: '你先心疼的是那张纸', reasonEn: 'The thing you cared about first was the paper' }],
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你先问的是那张纸，不是那个人', reasonEn: 'You asked about the paper before you asked about the person' }],
        setFlags: ['main2_asked_three'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}casual_neutral.webp`,
            jp: 'さあのう。本人に聞くしかあるまい。',
            zh: '谁知道呢。那得问他本人了。',
            en: 'Who can say. You would have to ask him.',
            color: INARI
          },
          {
            type: 'narration',
            characterImage: `${I}casual_sad.webp`,
            zh: '她说完这句话之后，第一次露出了一个不太好笑的表情。',
            en: 'After she says it, for the first time, her expression is not amused.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    characterImage: `${I}casual_neutral.webp`,
    zh: '她走过来，在石阶上你旁边坐下，看了一眼那张地图，然后指了指别的地方。',
    en: 'She comes over, sits down beside you on the step, glances at the map and points somewhere else entirely.'
  },
  eventCgNode('main2'),
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}casual_neutral.webp`,
    jp: 'ここな。うどん屋。もう無い。',
    zh: '这儿。乌冬店。已经没了。',
    en: 'This one. Udon shop. Gone now.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '手账里有一条五月二日：食堂的乌冬五十円。你翻到那一页给她看。她看了很久，久到你以为她在读那几个字。',
    en: 'There is an entry for the second of May: cafeteria udon, fifty yen. You turn to it and hold it out. She looks at it for a long time, long enough that you assume she is reading.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}casual_sad.webp`,
    jp: '……いや。ただ、久しぶりに見たと思うてな。',
    zh: '……没什么。只是想着，好久没看见了。',
    en: '...It is nothing. Only that I have not seen this in a long time.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '她站起来，把身上的落叶掸掉，走进了鸟居里面。走了七八步之后她停下，没有回头。',
    en: 'She gets up, brushes the leaves off, and walks in through the torii. Seven or eight paces in she stops, without turning round.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}casual_neutral.webp`,
    jp: 'また来い。今度は、その帳面ごと。',
    zh: '再来。下次，把那本子一起带来。',
    en: 'Come again. And bring that notebook with you.',
    color: INARI,
    words: [{ jp: '帳面', reading: 'ちょうめん', zh: '本子、账本', en: 'notebook / ledger' }]
  },
  { type: 'effect', setFlags: ['main_ch2_done'] }
];

// ==========================================================
// 第 3 章 · 名字的帐
// ==========================================================
const CH3: StoryNode[] = [
  {
    type: 'scene', scene: 'ikuta_shrine_forest', bgm: 'night',
    titleZh: '第 3 章 · 名字的帐',
    titleEn: 'Chapter 3 · The Ledger of Names',
    subtitleZh: '神社后面的林子', subtitleEn: 'The wood behind the shrine'
  },
  {
    type: 'narration',
    zh: '七月。林子里比外面凉五度，蝉在头顶上叫得像下雨。',
    en: 'July. Five degrees cooler in among the trees, and the cicadas overhead sound like rain.'
  },
  {
    type: 'narration',
    characterImage: `${I}summer_neutral.webp`,
    zh: '她坐在那块石头上，膝盖上摊着一本很旧的册子。册子比手账厚，纸的颜色也更深。',
    en: 'She is on the rock with a very old volume open across her knees. It is thicker than the journal and the paper is darker.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_neutral.webp`,
    jp: 'これはな、名前の帳じゃ。',
    zh: '这个啊，是名字的帐。',
    en: 'This is a ledger of names.',
    color: INARI,
    words: [{ jp: '名前', reading: 'なまえ', zh: '名字', en: 'name' }]
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_neutral.webp`,
    jp: 'ここに来て、ちゃんと名乗った者だけを書く。……そう多くはない。',
    zh: '来了这儿、而且好好报过名字的，才写进来。……不算多。',
    en: 'Only those who came here and actually gave me their name go in it. There are not many.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '她翻页的时候你数了一下。这本册子从头到尾，一年最多写两三个名字。',
    en: 'You count while she turns the pages. From end to end, this book takes two or three names in a year.'
  },
  {
    type: 'narration',
    zh: '字也一路在变。最前面那些你一个都认不出来，弯弯绕绕，像是有人拿草茎蘸了水在纸上走路；往后翻，慢慢变成古文课本里那种假名，再往后是端正的毛笔楷书，然后是钢笔。翻一页就是几十年。你翻得手有点抖，不是因为纸脆。',
    en: 'The writing keeps changing too. The earliest you cannot read at all, all loops and wanderings, as if someone had dipped a grass stem in water and gone for a walk across the paper. Further on it turns into the kana from your classical Japanese textbook, then into upright brush script, then fountain pen. Every page you turn is a few decades. Your hands are shaking slightly, and it is not because the paper is brittle.'
  },
  {
    type: 'narration',
    zh: '你想翻回最前面看看封面里侧，手指刚碰到，她就把册子轻轻抽了回去。',
    en: 'You go to turn right back to the inside of the cover. Your finger has barely touched it when she draws the book gently away.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_neutral.webp`,
    jp: 'そこは、まだじゃ。',
    zh: '那儿，还不行。',
    en: 'Not that part. Not yet.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '她停在了很后面的某一页，把册子转过来给你看。',
    en: 'She stops well towards the back and turns the book round for you.'
  },
  {
    type: 'narration',
    zh: '那一页只有一行。是你外公的名字，四个字，写得非常端正。旁边有一个小小的日期：昭和三十九年 四月十二日。',
    en: 'One line on the page. Your grandfather\'s name, four characters, written extremely neatly. A small date beside it: the twelfth of April, 1964.'
  },
  {
    type: 'narration',
    zh: '手账的第一条是四月十日。他入学第三天就来了这儿，而且报了名字。',
    en: 'The journal\'s first entry is the tenth of April. He came here on his third day of school, and he gave his name.'
  },
  {
    type: 'choice',
    promptZh: '「じゃあ、」你听见自己开口，「他后来还来过吗。」',
    promptEn: '"So," you hear yourself say, "did he keep coming?"',
    options: [
      {
        id: 'ch3_how_often',
        labelZh: '「他来了多少次？」',
        labelEn: '"How many times did he come?"',
        jp: '何回、来たんだ。',
        hintZh: '你想要一个数字', hintEn: 'You want a number.',
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 2, reasonZh: '你在数别人来过多少次', reasonEn: 'You were counting how often somebody else had come' }],
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你问的是能被记录的那部分', reasonEn: 'You asked for the part that can be written down' }],
        setFlags: ['main3_asked_count'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_surprised.webp`,
            jp: '数えたことはないが……ほぼ毎日じゃな。二年と、少し。',
            zh: '没数过……不过差不多是每天。两年，多一点。',
            en: 'I never counted. Nearly every day, though. Two years and a bit.',
            color: INARI
          },
          {
            type: 'narration',
            zh: '两年多。七百多次。地图上那三条线突然变得非常合理。',
            en: 'Two years and a bit. Seven hundred-odd times. The three lines on the map suddenly make complete sense.'
          }
        ]
      },
      {
        id: 'ch3_what_for',
        labelZh: '「他来干什么？」',
        labelEn: '"What did he come for?"',
        jp: '何しに来てたんだ。',
        hintZh: '你想要一个理由', hintEn: 'You want a reason.',
        relations: [{ char: CharacterId.INARI, familiarity: 4, affection: 4, reasonZh: '你想知道的是他为什么来，不是他来过几次', reasonEn: 'What you wanted was the reason, not the tally' }],
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你先想的是他，不是那本册子', reasonEn: 'What you thought about first was him, not the book' }],
        setFlags: ['main3_asked_why'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_shy.webp`,
            jp: '……何も。座って、書いて、帰る。それだけじゃ。',
            zh: '……什么也不干。坐着，写字，回去。就这样。',
            en: '...Nothing. He sat, he wrote, he went home. That was all.',
            color: INARI
          },
          {
            type: 'narration',
            zh: '「それだけ」这三个字她说得很轻，轻得像是怕它被听成一句抱怨。',
            en: 'She says "that was all" very lightly, as if afraid it might be mistaken for a complaint.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    characterImage: `${I}summer_neutral.webp`,
    zh: '她把册子合上，放在膝盖上，两只手压着。',
    en: 'She closes the book, rests it on her knees and holds it down with both hands.'
  },
  eventCgNode('main3'),
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}summer_shy.webp`,
    jp: 'ある日から来なくなった。それも、よくあることじゃ。',
    zh: '有一天就不来了。这种事也很常见。',
    en: 'One day he stopped coming. That happens often enough.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '你翻到手账最后一页。昭和四十一年三月二十四日：「修了。坂を下る。短い。」',
    en: 'You turn to the last page of the journal. The twenty-fourth of March, 1966: "Term ended. Walked down the hill. Short."'
  },
  {
    type: 'narration',
    zh: '他没有不告而别。他只是写完了。',
    en: 'He did not vanish. He simply finished writing.'
  },
  { type: 'effect', setFlags: ['main_ch3_done'] }
];

// ==========================================================
// 第 4 章 · 他在等谁
// ==========================================================
const CH4: StoryNode[] = [
  {
    type: 'scene', scene: 'ikuta_shrine_night', bgm: 'night',
    titleZh: '第 4 章 · 他在等谁',
    titleEn: 'Chapter 4 · Who He Was Waiting For',
    subtitleZh: '十月 · 生田神社', subtitleEn: 'October · Ikuta Shrine'
  },
  {
    type: 'narration',
    zh: '十月的傍晚五点半天就暗了。境内的灯亮着三盏，第四盏坏了很久，没人修。',
    en: 'Dark by half past five in October. Three lights on in the grounds; the fourth has been broken for a long time and nobody has fixed it.'
  },
  {
    type: 'narration',
    characterImage: `${I}knit_neutral.webp`,
    zh: '她穿着一件明显不属于神明的毛衣。你没有问那是从哪儿来的。',
    en: 'She is wearing a jumper that very obviously does not belong to a deity. You do not ask where it came from.'
  },
  {
    type: 'narration',
    zh: '你带着一个问题来的，路上想了三天怎么开口，结果开口的是她。',
    en: 'You came with a question and spent three days working out how to ask it. She asks first.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}knit_neutral.webp`,
    jp: 'お主、なぜ毎日来る。',
    zh: '你啊，为什么每天来。',
    en: 'You. Why do you come every day.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '你想了想，发现自己没有答案。你来是因为你来了，然后第二天又来了。',
    en: 'You think about it and find you have no answer. You come because you came, and then came again the next day.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}knit_sad.webp`,
    jp: 'あやつも、同じ顔をしておった。',
    zh: '那个人当年也是这个表情。',
    en: 'He used to make that same face.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '「あやつ」——她一直这么叫他，从来不叫名字，虽然那个名字就写在她的册子里。',
    en: '"That one." That is what she calls him, always. Never the name, though the name is written in her book.'
  },
  {
    type: 'choice',
    promptZh: '你决定问那个想了三天的问题。',
    promptEn: 'You decide to ask the thing you have been working out how to ask.',
    options: [
      {
        id: 'ch4_waiting',
        labelZh: '「他每天来，是在等什么人吗？」',
        labelEn: '"He came every day. Was he waiting for someone?"',
        jp: '毎日来てたのって、誰か待ってたのか？',
        hintZh: '这是最容易想到的解释', hintEn: 'It is the easiest explanation to reach for.',
        relations: [{ char: CharacterId.INARI, familiarity: 5, affection: 5, reasonZh: '你猜到那是在等人，而且没有说破是等谁', reasonEn: 'You worked out that he was waiting, and left the name unsaid' }],
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你把一个人的两年当成一件有目的的事', reasonEn: 'You assumed two years of a man\'s life had a purpose in it' }],
        setFlags: ['main4_asked_waiting'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}knit_neutral.webp`,
            jp: '待っておった。……いや。',
            zh: '他在等。……不对。',
            en: 'He was waiting. ...No.',
            color: INARI
          },
          {
            type: 'narration',
            zh: '她陷入了长久的沉默。久到远处那三盏路灯里有一盏忽明忽暗地闪了一下。',
            en: 'She stops for a long time. Long enough that one of the three lights flickers.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}knit_sad.webp`,
            jp: '……待っておったのは、わしじゃ。',
            zh: '……在等的人是我。',
            en: '...The one who was waiting was me.',
            color: INARI
          }
        ]
      },
      {
        id: 'ch4_nothing',
        labelZh: '「他是不是……其实什么也没在干？」',
        labelEn: '"Was he... actually not doing anything at all?"',
        jp: 'あの人、実は何もしてなかったんじゃないか？',
        hintZh: '手账里全是价钱和天气', hintEn: 'The journal is all prices and weather.',
        relations: [{ char: CharacterId.INARI, familiarity: 3, affection: 7, reasonZh: '有些事就是没有理由的，你先替他说了这句', reasonEn: 'Some things have no reason. You said it for him first' }],
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没有硬要给他安一个理由', reasonEn: 'You did not insist on giving him a reason' }],
        setFlags: ['main4_asked_nothing'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}knit_neutral.webp`,
            jp: '……ほう。',
            zh: '……哦。',
            en: '...Oh.',
            color: INARI
          },
          {
            type: 'narration',
            zh: '她缓缓转过头静静注视着你。那双洞察世事的眼睛里倒映着你的身影，你从来没有被她用这样的眼神凝视过。',
            en: 'She turns her head slowly, gazing at you in silence. Her worldly eyes reflect your silhouette; she has never looked at you with such depth before.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}knit_sad.webp`,
            jp: 'そうじゃ。何もしておらん。……そして、わしはそれを待っておった。',
            zh: '是啊。他什么也没干。……而我在等的就是这个。',
            en: 'Just so. He did nothing at all. ...And that was what I was waiting for.',
            color: INARI
          }
        ]
      }
    ]
  },
  {
    // 她等的是谁——这一眼就是答案，只是现在还看不懂
    type: 'narration',
    characterImage: `${I}knit_neutral.webp`,
    zh: '她看了你一会儿。看的时间比这一刻需要的长了一点，像是在核对一张很旧的照片——核对完了，什么也没说。',
    en: 'She looks at you for a while, a little longer than the moment calls for, the way someone checks a face against a very old photograph. When she has finished checking, she says nothing.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}knit_neutral.webp`,
    jp: '願い事を言いに来る者は多い。座りに来る者はおらん。',
    zh: '来许愿的人很多。来坐着的人没有。',
    en: 'Plenty come to ask for things. Nobody comes to sit.',
    color: INARI,
    words: [{ jp: '願い事', reading: 'ねがいごと', zh: '愿望', en: 'a wish' }]
  },
  {
    type: 'narration',
    zh: '你低头看了看自己：书包静静倚在脚边，手账摊在膝盖上，你已经在这石阶前默坐了许久，心如止水，一句愿望也没有许过。',
    en: 'You look down at yourself: schoolbag quiet by your feet, journal spread on your lap. You have sat in stillness on these stone steps, without once making a wish.'
  },
  {
    type: 'narration',
    characterImage: `${I}knit_neutral.webp`,
    zh: '她把手伸出来，掌心朝上。你把手账递过去。她翻到最后一页，看了看那句「短い」，然后把本子还给你。',
    en: 'She puts out a hand, palm up. You pass her the journal. She turns to the last page, looks at the word "short", and hands it back.'
  },
  eventCgNode('main4'),
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}knit_neutral.webp`,
    jp: 'お主も、いずれこれを書く。',
    zh: '你早晚也会写这一句。',
    en: 'You will write that line yourself, in time.',
    color: INARI
  },
  { type: 'effect', setFlags: ['main_ch4_done'] }
];

// ==========================================================
// 第 5 章 · 一九九五
// ==========================================================
const CH5: StoryNode[] = [
  {
    type: 'scene', scene: 'ikuta_shrine_gate_night', bgm: 'night',
    titleZh: '第 5 章 · 一九九五',
    titleEn: 'Chapter 5 · Nineteen Ninety-Five',
    subtitleZh: '一月十七日', subtitleEn: '17th January'
  },
  {
    type: 'narration',
    zh: '一月十七日。今天早上的第一节课，历史老师讲到一九九五年时语速罕见地加快了，讲完后在讲台上长久地停顿默哀，才轻轻翻过那一页教案。',
    en: 'The seventeenth of January. In first period this morning, the history teacher spoke unusually fast when reaching 1995, pausing in long, heavy silence before gently turning the lesson page.'
  },
  {
    type: 'narration',
    zh: '放学之后你没有回家。',
    en: 'You do not go home after school.'
  },
  {
    type: 'narration',
    zh: '境内今天有人。不多，但一整天都没断过。有人带了花，有人只是站一会儿就走。',
    en: 'There are people in the grounds today. Not many, but a steady trickle all day. Some bring flowers. Some stand for a moment and leave.'
  },
  {
    type: 'narration',
    characterImage: `${I}gown_neutral.webp`,
    zh: '她站在鸟居底下，穿着你没见过的那身，一动不动。你走过去的时候她没有看你。',
    en: 'She is standing under the torii in something you have not seen her wear, perfectly still. She does not look at you as you come over.'
  },
  eventCgNode('main5'),
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_neutral.webp`,
    jp: 'この鳥居はな、一度倒れておる。',
    zh: '这个鸟居啊，倒过一次。',
    en: 'This torii came down once.',
    color: INARI,
    words: [{ jp: '倒れる', reading: 'たおれる', zh: '倒下', en: 'to fall over' }]
  },
  {
    type: 'narration',
    zh: '你抬头看那个鸟居。它现在的漆是新的，柱脚有一圈接缝，颜色比上面浅一点点。',
    en: 'You look up at it. The paint is new. There is a seam around the base of each post where the colour is very slightly paler.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_neutral.webp`,
    jp: '五時四十六分。まだ暗かった。',
    zh: '五点四十六分。天还没亮。',
    en: 'Five forty-six. It was still dark.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '她说这句话的时候语速和平时一样。这一点比任何别的说法都更难听。',
    en: 'She says it at exactly her usual speed. That is harder to listen to than any other way she could have said it.'
  },
  {
    type: 'narration',
    zh: '手账里没有这一年。手账停在一九六六年三月。他那时候已经下坡走了二十九年。',
    en: 'This year is not in the journal. The journal stops in March 1966. By then he had been down the hill for twenty-nine years.'
  },
  {
    type: 'choice',
    promptZh: '你站在她旁边，不知道该说什么。',
    promptEn: 'You stand next to her without knowing what to say.',
    options: [
      {
        id: 'ch5_alone',
        labelZh: '「那天……你一个人在这儿？」',
        labelEn: '"That day. Were you here on your own?"',
        jp: 'あの日……一人でここに居たのか。',
        hintZh: '你问了一个你其实已经知道答案的问题', hintEn: 'You already know the answer.',
        relations: [{ char: CharacterId.INARI, familiarity: 4, affection: 8, reasonZh: '一千八百年里，问过她这句话的人不多', reasonEn: 'In eighteen centuries not many have asked her that' }],
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你问的是她，不是那场灾难', reasonEn: 'You asked about her, not about the disaster' }],
        setFlags: ['main5_asked_alone'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}gown_neutral.webp`,
            jp: 'わしはいつも一人じゃ。……あの朝は、それが少し長かった。',
            zh: '我一直都是一个人。……那天早上，只是有点长。',
            en: 'I am always on my own. ...That morning it went on a little longer than usual.',
            color: INARI
          }
        ]
      },
      {
        id: 'ch5_stay',
        labelZh: '什么也不说，站着不走',
        labelEn: 'Say nothing and do not leave',
        hintZh: '有些时候话是多余的', hintEn: 'Sometimes words are the surplus part.',
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 8, reasonZh: '你什么都没说，但你没有走', reasonEn: 'You said nothing and you did not leave' }],
        effects: [{ stat: 'guts', amount: 3, reasonZh: '自始至终沉默相伴比任何苍白的言语都难得多', reasonEn: 'Standing quietly in silent solidarity is harder than hollow words' }],
        setFlags: ['main5_stayed'],
        then: [
          {
            type: 'narration',
            zh: '你在清冷的夜风中静静陪她伫立了良久。直到暮色沉沉吞没最后一丝晚霞，天光彻底暗了下来，她才终于开了口。',
            en: 'You stand quietly beside her in the chill night breeze for a long time. Only when twilight swallows the last ember of dusk does she finally speak.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}gown_neutral.webp`,
            jp: '……あやつも、こうして黙って立っておった。',
            zh: '……那个人当年也是这样，一声不吭站着。',
            en: '...He used to stand like this too. Not saying anything.',
            color: INARI
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '来的人陆陆续续走光了。最后一个走的时候朝鸟居鞠了一躬，很深。',
    en: 'The trickle of people thins out and stops. The last one bows to the torii on the way out, deeply.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_neutral.webp`,
    jp: '倒れたのは鳥居だけではない。社は水に浸かり、焼け、崩れた。三度とも、建て直された。',
    zh: '倒下的不只是鸟居。这座神社泡过水，烧过，塌过。三次，都重新建起来了。',
    en: 'It was not only the torii. This shrine has been flooded, burned and brought down. All three times it was built again.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '你问更早呢。她说更早的时候这里还不叫神户，有人把都城从京都搬到海边来，住了半年又搬走了；没过几年，两拨武士在后面那片林子里打了一整天，林子烧掉了一半。她讲这些用的是讲隔壁邻居的语气。你在心里替她把年份补上，补到八百多年前就不想再往前补了。',
    en: 'You ask about before that. Before that, she says, this place was not called Kobe yet; someone moved the capital down from Kyoto to the sea, stayed half a year, and moved it back. A few years later two bands of warriors fought all day in the wood behind the shrine and half of it burned. She tells it in the voice people use for the neighbours. You fill the dates in for her in your head, and somewhere past eight hundred years ago you stop wanting to go any further.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_neutral.webp`,
    jp: 'それで、ここは「蘇りの社」と呼ばれておる。……わしが一番、蘇っておらんのにのう。',
    words: [{ jp: '蘇る', reading: 'よみがえる', zh: '复苏、重生', en: 'to come back to life' }],
    zh: '所以这里被叫作「重生的神社」。……明明最没有重生过的，是我。',
    en: 'Which is why they call this the shrine of coming back to life. ...When the one thing here that has never come back to anything is me.',
    color: INARI
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_neutral.webp`,
    jp: 'この街はな、二度建った。二度目のは、みんなが覚えておる。',
    zh: '这座城建过两次。第二次那一回，所有人都记得。',
    en: 'This city has been built twice. The second time, everyone remembers.',
    color: INARI
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_neutral.webp`,
    jp: '一度目のことは、あの帳面みたいなものにしか残っておらん。',
    zh: '第一次的事，只留在那种本子里了。',
    en: 'The first time only survives in things like that notebook of yours.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '你低头看手里的那本东西。它记的全是价钱、天气、几点几分、谁说了什么。',
    en: 'You look down at the thing in your hands. All it records is prices, weather, times, and what somebody said.'
  },
  {
    type: 'narration',
    zh: '你一直以为那是因为他不擅长写感受。现在你不太确定了。',
    en: 'You had always assumed that was because he was not good at writing down feelings. You are no longer sure.'
  },
  { type: 'effect', setFlags: ['main_ch5_done'] }
];

// ==========================================================
// 第 6 章 · 同一条坡
// ==========================================================
const CH6: StoryNode[] = [
  {
    type: 'scene', scene: 'ikuta_shrine_gate_night', bgm: 'night',
    titleZh: '第 6 章 · 同一条坡',
    titleEn: 'Chapter 6 · The Same Hill',
    subtitleZh: '三月二十三日', subtitleEn: '23rd March'
  },
  {
    type: 'narration',
    zh: '明天是修了式。你的行李已经打包了一半，机票在书桌上压着。',
    en: 'Tomorrow is the closing ceremony. Half your things are packed and the ticket is weighted down on the desk.'
  },
  {
    type: 'narration',
    zh: '你最后一次走上这条坡。你数了一下，从坡底到鸟居是两百一十七步。',
    en: 'You walk up this hill for the last time. You count: two hundred and seventeen paces from the bottom to the torii.'
  },
  {
    type: 'narration',
    characterImage: `${I}casual_neutral.webp`,
    zh: '她已经在那儿了。膝盖上摊着那本名字的帐，翻在空白的一页。',
    en: 'She is already there, the ledger of names open across her knees at a blank page.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}casual_neutral.webp`,
    jp: '書いてやろうと思うてな。',
    zh: '想着给你写上。',
    en: 'I thought I would write you in.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '你看着那一页空白。上一页是你外公，昭和三十九年四月十二日。中间隔着六十年，一个名字都没有。',
    en: 'You look at the blank page. The page before it is your grandfather, the twelfth of April 1964. Sixty years in between, and not one name.'
  },
  {
    type: 'choice',
    promptZh: '她把笔递过来。',
    promptEn: 'She holds out the brush.',
    options: [
      {
        id: 'ch6_leave_journal',
        labelZh: '写下名字，然后把手账留在这儿',
        labelEn: 'Write your name, and leave the journal here',
        jp: 'これ、置いていく。',
        hintZh: '它在这条坡上待过两年，现在待了两年半', hintEn: 'It spent two years on this hill. Now two and a half.',
        relations: [{ char: CharacterId.INARI, familiarity: 8, affection: 10, reasonZh: '那本手账留在了她这儿', reasonEn: 'The journal stayed with her' }],
        effects: [
          { stat: 'kindness', amount: 5, reasonZh: '你把一样属于你的东西留给了一个没有人陪的人', reasonEn: 'You left something of yours with someone who has nobody' }
        ],
        setFlags: ['main6_left_journal', 'main_journal_left'],
        then: [
          {
            type: 'narration',
            zh: '你把手账放在她膝盖上那本帐的旁边。两本厚度差不多，纸的颜色差得很远。',
            en: 'You set the journal down beside hers on her knees. Almost the same thickness. Nothing like the same colour of paper.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}casual_surprised.webp`,
            jp: '……いいのか。',
            zh: '……可以吗。',
            en: '...Are you sure.',
            color: INARI
          },
          {
            type: 'narration',
            zh: '「我记得住。」你说。这句话你说得很慢，因为你是用日语说的，而且你是认真的。',
            en: '"I remember it," you say. You say it slowly, because you say it in Japanese, and because you mean it.'
          },
          {
            type: 'narration',
            characterImage: `${I}casual_happy.webp`,
            zh: '她低头笑了一下。这是你见过她笑得最难看的一次。',
            en: 'She looks down and smiles. It is the worst smile you have seen on her.'
          }
        ]
      },
      {
        id: 'ch6_keep_journal',
        labelZh: '写下名字，然后把手账收进包里',
        labelEn: 'Write your name, and put the journal back in your bag',
        jp: 'これは、持って帰る。',
        hintZh: '它本来就是要带回去的', hintEn: 'It was always going back.',
        relations: [{ char: CharacterId.INARI, familiarity: 10, affection: 6, reasonZh: '你把它带走了，因为它还要接着写', reasonEn: 'You took it with you, because it is not finished' }],
        effects: [
          { stat: 'guts', amount: 5, reasonZh: '你没有为了让场面好看而送出一样不该送的东西', reasonEn: 'You did not give away something you should not, just to make the moment land' }
        ],
        setFlags: ['main6_kept_journal', 'main_journal_kept'],
        then: [
          {
            type: 'narration',
            zh: '你把手账扣上，塞回书包的侧袋——和你带来的那天一模一样的位置。',
            en: 'You close the journal and slide it into the side pocket of your bag, exactly where it was on the day you arrived.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}casual_neutral.webp`,
            jp: 'それでよい。あれは、持って帰るものじゃ。',
            zh: '这样才对。那种东西，是要带回去的。',
            en: 'Good. That is a thing you take home.',
            color: INARI
          },
          {
            type: 'narration',
            zh: '「持って帰る」——带回去。她用了和你一样的词，而且是在你说出口之前。',
            en: 'She uses the same words you did. She uses them before you say them.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    zh: '你在那一页上写下自己的名字。笔画比你外公的差远了，但你写完之后没有想重写。',
    en: 'You write your name on that page. The strokes are nowhere near his. You do not want to write it again.'
  },
  {
    // 她在核对的是封面里那张纸上的字
    type: 'narration',
    characterImage: `${I}casual_neutral.webp`,
    zh: '你写的时候她一直盯着，盯得很近，近到你能感觉到她的呼吸落在手背上。她看的不是你写了什么，是笔画怎么走——哪一笔先下，哪一笔收得急。像在对一份很早以前的笔迹。',
    en: 'She watches the whole time you write, so closely you can feel her breath on the back of your hand. It is not what you write that she is watching but how the strokes go: which comes first, which one you cut off too quickly. As if she were comparing it against a sample from a long time ago.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}casual_neutral.webp`,
    jp: 'それとな。地図の鳥居、三本とも祖父の手と言うたが——あれは嘘じゃ。',
    zh: '还有啊。地图上那个鸟居，我说过三条线都是你外公画的——那是骗你的。',
    en: 'And another thing. The torii on the map. I told you all three lines were your grandfather\'s hand. That was a lie.',
    color: INARI
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}casual_shy.webp`,
    jp: '三本目は、わしが引いた。',
    zh: '第三条，是我描的。',
    en: 'The third line was mine.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '你问为什么。她想了一下，说「いつか分かる。分からんでもよい」——总有一天会明白的，不明白也没关系。说完就不再解释了，像一个出完了谜面、并不在乎你猜不猜得出来的人。',
    en: 'You ask why. She thinks, and says you will understand one day, and that it does not matter if you never do. Then she explains no further, like someone who has set the riddle and is not especially bothered whether you solve it.'
  },
  {
    type: 'narration',
    characterImage: `${I}casual_happy.webp`,
    zh: '她合上册子，站起来，第一次把手伸出来。',
    en: 'She closes the book, stands up, and for the first time puts out her hand.'
  },
  eventCgNode('main6'),
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}casual_happy.webp`,
    jp: 'また来い。六十年以内にな。',
    zh: '再来。六十年之内。',
    en: 'Come again. Within sixty years.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '你下坡的时候数了第二遍。两百一十七步。',
    en: 'You count again on the way down. Two hundred and seventeen.'
  },
  {
    type: 'narration',
    zh: '第一页写的是「长」。最后一页写的是「短」。你现在知道那不是关于坡的。',
    en: 'The first page said long. The last page said short. You know now that neither of them was about the hill.'
  },
  { type: 'effect', setFlags: ['main_ch6_done'] }
];

// ==========================================================
// 最终章 · 待つ
//
// 修了式那天天亮之前。只在学年结束的那一刻补演（见 App 里修了式那段），
// 大厅上不会出现——它写的是"最后一天的早上"，提前演就全错了。
//
// 写成梦：雾、步数对不上、没有立绘的小狐狸。醒来之后什么都不点破，
// 唯一的证据是单词本少了一页、撕口是新的。
// 只有跟着稻荷的声音回来的那一支，会把封面里那张纸揭开给你看。
// ==========================================================
const H = '/images/characters/hikari/';
const A = '/images/characters/asuka/';
const R = '/images/characters/rei/';
const M = '/images/characters/miyuki/';
const S = '/images/characters/sora/';
const N = '/images/characters/nao/';
const K = '/images/characters/maki/';

// 每一支的收尾都一样：低头看见单词本少了一页
const TORN_PAGE: StoryNode = {
  type: 'narration',
  zh: '你低头摸了一下口袋里的单词本。最后一页没有了，撕口毛毛的，是新的。',
  en: 'You reach into your pocket for your vocabulary notebook. The last page is gone. The torn edge is still fuzzy. It is new.'
};

const CH7: StoryNode[] = [
  {
    type: 'scene', scene: 'ikuta_hill_fog', bgm: 'night',
    titleZh: '最终章 · 待つ',
    titleEn: 'Final Chapter · To Wait',
    subtitleZh: '三月二十四日 · 天亮之前', subtitleEn: '24th March · Before dawn'
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '修了式那天你四点多就醒了。不是睡不着，是醒得很干脆，像是有人在楼下叫过你的名字，叫完就走了。',
    en: 'On the morning of the closing ceremony you are awake a little after four. Not sleepless; cleanly awake, as if someone had called your name from the street below and then gone away.'
  },
  {
    type: 'narration',
    zh: '你穿好校服，把外公的手账和地图塞进口袋，顺手把单词本也塞了进去。单词本的最后一页是昨天晚上写的，只写了一个词。你也说不清为什么偏偏是这个。',
    en: 'You put on your uniform, push your grandfather\'s journal and the map into your pocket, and, without really thinking about it, the vocabulary notebook as well. The last page was written last night. There is only one word on it. You could not tell anyone why it was that one.',
    words: [{ jp: '待つ', reading: 'まつ', zh: '等待', en: 'to wait' }]
  },
  {
    type: 'narration',
    zh: '坡还是那条坡。这次你没有数步数。走到一半起了雾——神户三月很少起雾，起得这么厚的你没见过——路灯在雾里一团一团的，像有人把灯泡泡进了牛奶里。',
    en: 'The hill is the same hill. This time you do not count. Halfway up a fog comes in. Kobe hardly ever gets fog in March, and you have never seen one this thick; the streetlamps turn into soft blots, like light bulbs someone has dropped into milk.'
  },
  {
    type: 'narration',
    zh: '鸟居在雾里只剩一个轮廓。你从底下走过去的时候，脚下的石板换了一种硬度。',
    en: 'The torii is only an outline in the fog. As you pass under it, the stone under your feet changes its hardness.'
  },

  // ---- 寿永三年 ----
  { type: 'scene', scene: 'ikuta_forest_1184', bgm: 'reflective' },
  {
    type: 'narration',
    zh: '雾散开一点。眼前是林子，可不是你认识的那片：没有写字楼，没有路灯，林子大得看不到边，一直铺到海那边去。空气里有烟味，还有一点梅花的香，两种味道搅在一起，闻上去像一封写到一半的信。',
    en: 'The fog thins a little. There is a wood in front of you, but not the one you know. No office blocks, no lamps; a wood so big you cannot see the edge of it, running all the way down to the sea. The air smells of smoke and, faintly, of plum blossom, the two mixed together like a letter abandoned halfway through.'
  },
  {
    type: 'narration',
    zh: '地上有折断的箭，很多。你没有走过去细看，有些东西不用细看也知道。',
    en: 'There are broken arrows on the ground, a great many of them. You do not go over to look closely. Some things you know without looking.'
  },
  {
    type: 'narration',
    zh: '一棵烧了一半的梅树底下坐着一个小孩。再看一眼就知道不是小孩：头上竖着一对耳朵，身后有一条尾巴——只有一条，毛乱糟糟的，沾着灰。她抱着膝盖，膝盖上搁着一本空白的册子，新得不像是这片林子里该有的东西。',
    en: 'Under a half-burned plum tree a child is sitting. One more look and it is not a child: there is a pair of upright ears, and behind her a tail. Only one tail, the fur all tangled and grey with ash. She is hugging her knees, and across them lies a blank booklet, too new to belong anywhere in this wood.'
  },
  {
    type: 'narration',
    zh: '她抬头看你。那双眼睛的颜色你在哪儿见过，想了很久才想起来：是每天傍晚神社石阶上的那种金色。',
    en: 'She looks up at you. You have seen the colour of those eyes before somewhere, and it takes you a long time to place it: the gold that lies on the shrine steps every evening.'
  },
  {
    type: 'speech',
    speakerZh: '？？？', speakerEn: '???',
    jp: '……そなた、名は。',
    zh: '……你，叫什么名字。',
    en: '...You. What is your name?',
    color: INARI,
    words: [{ jp: 'そなた', reading: 'そなた', zh: '你（古语）', en: 'you (archaic)' }]
  },
  {
    type: 'narration',
    zh: '你说了。她听得非常认真，嘴唇跟着动了一下，像是在把这几个音放进一个还很空的抽屉里。',
    en: 'You tell her. She listens with enormous care, her lips moving along, as though she were putting the sounds away in a drawer that is still almost empty.'
  },
  {
    type: 'speech',
    speakerZh: '？？？', speakerEn: '???',
    jp: '昨日、ここで大勢死んだ。誰も、名を言わずに行った。',
    zh: '昨天，这里死了很多人。谁都没有留下名字就走了。',
    en: 'Yesterday a great many people died here. Every one of them went without leaving a name.',
    color: INARI
  },
  {
    type: 'speech',
    speakerZh: '？？？', speakerEn: '???',
    jp: '書いてくれぬか。わらわは、まだ字を知らぬ。',
    zh: '能帮我写下来吗。我还不认识字。',
    en: 'Will you write it for me? I do not know letters yet.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '她把那本空册子递过来。你摸遍口袋，摸出来一支便利店的圆珠笔。笔尖快碰到她那本册子的时候你停住了——那么新的一本，第一页不该是一支圆珠笔写的、歪歪扭扭的名字。',
    en: 'She holds out the blank booklet. You go through your pockets and come up with a convenience-store biro. The nib is almost on her page when you stop. A book that new should not start with a crooked name in ballpoint.'
  },
  {
    type: 'narration',
    zh: '你从单词本上撕下最后一页，在「待つ」的背面写下自己的名字。写得比平时还难看，因为手在抖，而你直到写完才发现它一直在抖。',
    en: 'You tear the last page out of your vocabulary notebook and write your name on the back of the word on it. It comes out worse than usual, because your hand is shaking, and you only notice it was shaking once you have finished.'
  },
  {
    type: 'narration',
    zh: '「{name}」。',
    en: '"{name}".'
  },
  {
    type: 'narration',
    zh: '她接过那张纸，翻过来，看见了另一面的字。她当然不认识。她把两面来回看了很多遍，然后把它夹进那本空册子里，夹在封面和第一页之间，用手掌压平。',
    en: 'She takes the slip, turns it over and finds the writing on the other side. Of course she cannot read it. She looks from one side to the other many times, then tucks it into the blank booklet, between the cover and the first page, and presses it flat with her palm.'
  },
  eventCgNode('main_finale_1184'),
  {
    type: 'speech',
    speakerZh: '？？？', speakerEn: '???',
    jp: 'また、来るか。',
    zh: '你还会来吗。',
    en: 'Will you come again?',
    color: INARI
  },
  {
    type: 'choice',
    promptZh: '她问得很小心，像是怕问重了，答案会碎。',
    promptEn: 'She asks it carefully, as if the answer might break if the question were too heavy.',
    options: [
      {
        id: 'ch7_will_come',
        labelZh: '「会来的。不过要很久很久以后。」',
        labelEn: '"I will. But a long, long time from now."',
        jp: '来る。ずっと、ずっと先だけど。',
        hintZh: '这是真话，只是长得离谱', hintEn: 'It is true. It is just absurdly long.',
        setFlags: ['main7_promised'],
        then: [
          {
            type: 'speech',
            speakerZh: '？？？', speakerEn: '???',
            jp: 'どれほど先じゃ。',
            zh: '要多久。',
            en: 'How long?',
            color: INARI
          },
          {
            type: 'narration',
            zh: '你没法用「年」来回答她。你说：比这片林子烧掉、再长出来、再烧掉、再长出来，还要久一点。',
            en: 'You cannot answer her in years. You say: longer than it takes this wood to burn, and grow back, and burn, and grow back again. A little longer than that.'
          }
        ]
      },
      {
        id: 'ch7_dont_wait',
        labelZh: '「别等我。太久了。」',
        labelEn: '"Don\'t wait for me. It\'s too long."',
        jp: '待たなくていい。長すぎる。',
        hintZh: '你知道那有多久', hintEn: 'You know exactly how long.',
        setFlags: ['main7_told_not_to_wait'],
        then: [
          {
            type: 'speech',
            speakerZh: '？？？', speakerEn: '???',
            jp: '……それは、わらわが決める。',
            zh: '……那由我来决定。',
            en: '...That is for me to decide.',
            color: INARI
          },
          {
            type: 'narration',
            zh: '她说这句话的语气，和你认识的那个人一模一样。只是还很小。',
            en: 'She says it in exactly the voice of the person you know. Only smaller.'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '？？？', speakerEn: '???',
    jp: '……ふむ。待つのは、得意になってみせよう。',
    zh: '……嗯。那我就学着，把等这件事做得很拿手吧。',
    en: '...Hm. Then I shall make myself good at waiting.',
    color: INARI
  },
  {
    type: 'narration',
    zh: '她说「待つ」的时候，那个音你认得。是那张纸背面的那个词。她念对了，第一次就念对了。',
    en: 'When she says the word for waiting, you recognise the sound. It is the word on the back of the slip. She has said it right, first time.'
  },
  {
    type: 'narration',
    zh: '风从海那边吹过来，雾又合上了。你回头去找鸟居，鸟居不在。林子往四面八方铺开去，每个方向都长得一样。',
    en: 'A wind comes up from the sea and the fog closes again. You turn round for the torii, and there is no torii. The wood runs off in every direction, and every direction looks the same.'
  },
  {
    type: 'narration',
    zh: '你开始数步数。数到两百一十七，没有坡，没有灯，什么都没有。你又数了一遍两百一十七。',
    en: 'You start counting. At two hundred and seventeen there is no hill, no lamp, nothing. You count another two hundred and seventeen.'
  },
  {
    type: 'narration',
    zh: '你把外公的地图掏出来。在这片什么都对不上的林子里，地图上的东西一样也对不上——除了那几个铅笔点。它们在雾里很淡地亮着，像有人在很远的地方，隔着纸划着了几根火柴。',
    en: 'You take out your grandfather\'s map. Nothing in this wood matches anything on it, except those pencil dots. They are glowing very faintly in the fog, like matches struck a long way off, on the other side of the paper.'
  },
  {
    type: 'narration',
    zh: '然后你听见有人在叫你。不止一个人。好几个方向，好几个声音，叫的都是同一个名字。',
    en: 'Then you hear someone calling you. More than one person. From several directions, several voices, all calling the same name.'
  },
  {
    type: 'narration',
    zh: '可你只能朝一个方向走。',
    en: 'And you can only walk in one direction.'
  },

  // ---- 跟着谁的声音 ----
  {
    type: 'heart',
    routes: {
      // ======== 稻荷：辉夜那一版 ========
      [CharacterId.INARI]: [
        {
          type: 'narration',
          zh: '你朝其中一个声音走。那个声音你刚刚才听过——在那棵烧了一半的梅树底下。只是现在它老了八百年，老得很温柔。',
          en: 'You walk towards one of the voices. You heard it only a moment ago, under the half-burned plum tree. Only now it is eight hundred years older, and old in the gentlest way.'
        },
        { type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'reflective' },
        {
          type: 'narration',
          zh: '雾一下子退干净了。你站在鸟居底下，石阶是湿的，天刚开始发白。',
          en: 'The fog clears all at once. You are standing under the torii. The steps are wet, and the sky is only just starting to pale.'
        },
        {
          type: 'narration',
          characterImage: `${I}casual_sad.webp`,
          zh: '她在鸟居的另一边。九条尾巴，一条都没有藏。手里拿着那本名字的帐，封面翻开着，封面里侧那层糊纸被拆开了一角。',
          en: 'She is on the other side of the torii. Nine tails, not one of them hidden. In her hands is the ledger of names, open at the cover, and one corner of the lining inside the cover has been prised up.'
        },
        {
          type: 'speech',
          speakerZh: '稻荷', speakerEn: 'Inari',
          characterImage: `${I}casual_sad.webp`,
          jp: '……遅いぞ。',
          zh: '……太慢了。',
          en: '...You took your time.',
          color: INARI
        },
        {
          type: 'narration',
          zh: '她把那一角揭开给你看。底下是一张很小的纸，纸边是单词本那种齿孔撕口。纸黄得厉害，圆珠笔的字已经淡成了灰色，但还认得出来：是你的名字，你的字，比你平时写的还难看。',
          en: 'She lifts the corner for you. Underneath is a very small piece of paper with the perforated edge of a notebook page. It has gone deeply yellow and the ballpoint has faded to grey, but it is still legible: your name, in your hand, worse than you usually write it.'
        },
        {
          type: 'narration',
          zh: '她把纸翻过来。背面是「待つ」。',
          en: 'She turns it over. On the back: the word for waiting.'
        },
        {
          type: 'speech',
          speakerZh: '稻荷', speakerEn: 'Inari',
          characterImage: `${I}casual_sad.webp`,
          jp: '八百年あまりじゃ。……字を覚えたのはな、これが読みたかったからじゃ。',
          zh: '八百多年了。……我学写字啊，就是为了读懂这个。',
          en: 'Eight hundred years and more. ...I learned my letters because I wanted to read this.',
          color: INARI
        },
        {
          type: 'narration',
          zh: '你想起来她说过，那本帐的第一页是教她写字的人。你一直以为那是这个故事的开头。现在你知道了，开头比第一页还早一页。',
          en: 'You remember her saying that the first page of the ledger belonged to the one who taught her to write. You had always taken that to be where the story began. Now you know it begins one page earlier.'
        },
        {
          type: 'speech',
          speakerZh: '稻荷', speakerEn: 'Inari',
          characterImage: `${I}casual_neutral.webp`,
          jp: '鳥居の下で初めてお主を見た時から、分かっておった。',
          zh: '在鸟居底下第一次见到你的时候，我就知道了。',
          en: 'I knew from the first time I saw you under the torii.',
          color: INARI
        },
        {
          type: 'narration',
          zh: '你问她为什么一直不说。',
          en: 'You ask why she never said.'
        },
        {
          type: 'speech',
          speakerZh: '稻荷', speakerEn: 'Inari',
          characterImage: `${I}casual_sad.webp`,
          jp: '言えば、お主はあの坂を上らなんだかもしれん。上らねば、わしは名を貰えなんだ。',
          zh: '说了的话，你也许就不会走上那条坡了。你不上来，我就得不到那个名字。',
          en: 'If I had told you, you might never have climbed that hill. And if you had not climbed it, I would never have been given the name.',
          color: INARI
        },
        {
          type: 'narration',
          zh: '所以地图上第三条线是她描的。所以外公在这条坡上走了七百多次。所以你会在这一年、这一天，站在这里。一整根线绕了八百年，绕回到同一张纸上。你想算一算这里面有多少个巧合，算到一半就放弃了——它们不是巧合，是一个人很耐心、很耐心地等出来的。',
          en: 'So the third line on the map was hers. So your grandfather climbed this hill seven hundred-odd times. So you would be standing here, in this year, on this day. One thread looped through eight hundred years and back onto the same slip of paper. You try to count how many coincidences are in it and give up halfway, because none of them are coincidences. They are what one person managed, by waiting very, very patiently.'
        },
        {
          type: 'branch',
          ifFlag: 'inari_ending_love',
          then: [
            {
              type: 'narration',
              characterImage: `${I}casual_neutral.webp`,
              zh: '她从袖子里拿出一支圆珠笔。便利店那种，笔杆上的字早就磨没了。初雪那天，她就是用这支笔把自己写进帐里的。你现在认出来了：是你的。是你在那片林子里写完名字，忘了拿回来的那一支。',
              en: 'She takes a biro from her sleeve. The convenience-store kind, the lettering on the barrel long since worn away. It is the pen she used on the morning of the first snow to write herself into the ledger. You recognise it now: it is yours. The one you forgot to take back in that wood, after you wrote your name.'
            },
            {
              type: 'narration',
              zh: '一支圆珠笔不可能写八百年。可它那天写出来了。你决定不去想这件事。',
              en: 'No biro writes for eight hundred years. But it wrote that day. You decide not to think about it.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${I}casual_happy.webp`,
              jp: '返さぬぞ。これは、わしのじゃ。',
              zh: '不还你。这是我的。',
              en: 'I am not giving it back. It is mine.',
              color: INARI
            },
            eventCgNode('main_finale_inari'),
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${I}casual_happy.webp`,
              jp: '待つのはな、もう得意じゃ。……じゃが、もう待たぬ。',
              zh: '等这件事啊，我已经很拿手了。……不过，我不再等了。',
              en: 'I am very good at waiting now. ...But I am not going to wait any more.',
              color: INARI
            },
            {
              type: 'narration',
              zh: '她伸手牵你。初雪那天她够了两次才够到。这一次，一下就够到了。',
              en: 'She reaches for your hand. On the morning of the first snow it took her two attempts. This time she gets it first go.'
            }
          ],
          otherwise: [
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${I}casual_neutral.webp`,
              jp: '名は、確かに貰った。……それで、十分じゃ。',
              zh: '名字，我确实收到了。……这就够了。',
              en: 'I was given the name. I have it. ...That is enough.',
              color: INARI
            },
            {
              type: 'narration',
              zh: '她把那张纸重新糊回封面里，压平，动作很慢，像把一封信放回信封。',
              en: 'She pastes the slip back under the cover and smooths it down, very slowly, like someone putting a letter back in its envelope.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${I}casual_happy.webp`,
              jp: 'また来い。……今度は、八百年もかけるでないぞ。',
              zh: '再来。……这次，可别再花八百年了。',
              en: 'Come again. ...And do not take eight hundred years about it this time.',
              color: INARI
            }
          ]
        },
        { type: 'effect', setFlags: ['finale_route_inari'] }
      ],

      // ======== 光：港口的栏杆 ========
      [CharacterId.HIKARI]: [
        {
          type: 'narration',
          zh: '你朝咸的那个方向走。雾越来越咸，脚底下的土变成了石板，石板变成了码头的水泥。一根栏杆从雾里伸出来，冰凉的，正好在你手该放的高度。',
          en: 'You walk towards the salt. The fog grows saltier, the earth under your feet turns to paving and the paving to the concrete of the quay. A railing reaches out of the fog, cold, at exactly the height your hand expects.'
        },
        { type: 'scene', scene: 'kobe_harbor', bgm: 'reflective' },
        {
          type: 'narration',
          characterImage: `${H}school_sad.webp`,
          zh: '她在栏杆边，手里攥着手机，屏幕亮着，拨出去的是你的号码。没打通。看那个通话记录，她已经打了很多次。',
          en: 'She is at the railing with her phone clutched in her hand, the screen lit, your number dialling. It does not connect. From the call log, she has been trying for a while.'
        },
        {
          type: 'speech',
          speakerZh: '光', speakerEn: 'Hikari',
          characterImage: `${H}school_surprised.webp`,
          jp: '……あ、いた。',
          zh: '……啊，在这儿。',
          en: '...Oh. There you are.',
          color: 'bg-sky-500'
        },
        {
          type: 'speech',
          speakerZh: '光', speakerEn: 'Hikari',
          characterImage: `${H}school_shy.webp`,
          jp: 'なんかね、起きたら呼ばなきゃって思ったの。理由はないけど。',
          zh: '怎么说呢，醒过来就觉得必须叫你一声。没有理由。',
          en: 'I just woke up and thought, I have to call you. No reason.',
          color: 'bg-sky-500'
        },
        {
          type: 'branch',
          ifFlag: 'hikari_ending_love',
          then: [
            {
              type: 'narration',
              zh: '她没有挥手。她把手伸过来，停在半空，等你握。这一次你没有让她等。',
              en: 'She does not wave. She holds her hand out and leaves it there in the air for you to take. This time you do not make her wait.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${H}school_happy.webp`,
              jp: '今日で、最後の日だね。',
              zh: '今天，就是最后一天了呢。',
              en: 'So today is the last day.',
              color: 'bg-sky-500'
            },
            {
              type: 'narration',
              zh: '她说「最后一天」的语气，像在说第一天。',
              en: 'She says "the last day" the way other people say "the first".'
            }
          ],
          otherwise: [
            {
              type: 'narration',
              characterImage: `${H}school_happy.webp`,
              zh: '她朝你挥手，挥到一半停住了，改成了招手——叫你过来的那种。',
              en: 'She waves at you, stops halfway through, and turns it into a beckon: the kind that means come here.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${H}school_smug.webp`,
              jp: '修了式、遅刻するよ。友達の最後の日に遅刻とか、許さないからね。',
              zh: '修了式要迟到啦。朋友的最后一天还迟到，我可不原谅哦。',
              en: 'You\'ll be late for the ceremony. Being late on your friend\'s last day? Not allowed.',
              color: 'bg-sky-500'
            }
          ]
        },
        TORN_PAGE,
        { type: 'effect', setFlags: ['finale_route_hikari'] }
      ],

      // ======== 明日香：天亮前的教室 ========
      [CharacterId.ASUKA]: [
        {
          type: 'narration',
          zh: '你朝粉笔灰的味道走。雾里的那个声音很不耐烦，叫一遍停一下，像是每叫一遍都要先跟自己吵一架。',
          en: 'You walk towards the smell of chalk dust. The voice in the fog is impatient; it calls, then stops, as if it has to have an argument with itself before every attempt.'
        },
        { type: 'scene', scene: 'classroom_morning', bgm: 'reflective' },
        {
          type: 'narration',
          characterImage: `${A}neutral.webp`,
          zh: '教室的灯只开了前排一盏。她坐在讲台边，在核对今天的座位表，红笔夹在耳朵上。天还没亮，学校里除了她没有别人。',
          en: 'Only the front row of lights is on in the classroom. She is at the teacher\'s desk checking today\'s seating plan, a red pen tucked behind her ear. It is not light yet, and there is nobody else in the school.'
        },
        {
          type: 'speech',
          speakerZh: '明日香', speakerEn: 'Asuka',
          characterImage: `${A}pout.webp`,
          jp: '……遅い。何回呼んだと思ってるの。',
          zh: '……太慢了。你知道我叫了多少遍吗。',
          en: '...You\'re late. Do you know how many times I called?',
          color: 'bg-red-600'
        },
        {
          type: 'narration',
          zh: '你问她怎么叫的——你没听见手机响。她别过脸去，说她没打电话。她就是在这儿叫的。对着空教室。',
          en: 'You ask how she called; your phone never rang. She looks away and says she did not ring. She just called. Here. To an empty classroom.'
        },
        {
          type: 'branch',
          ifFlag: 'asuka_ending_love',
          then: [
            {
              type: 'narration',
              characterImage: `${A}shy.webp`,
              zh: '她站起来，伸手把你的领结扯正，扯得有点用力。扯完了手没有马上拿开。',
              en: 'She gets up and straightens your bow, rather harder than necessary. When it is straight, her hand does not move away straight away.'
            },
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${A}shy.webp`,
              jp: '今日、木曜じゃないけど。……特別に、空けといてあげる。',
              zh: '今天不是星期四。……特别给你空出来。',
              en: 'It isn\'t Thursday today. ...I\'ll keep it free anyway. Just this once.',
              color: 'bg-red-600'
            }
          ],
          otherwise: [
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${A}smug.webp`,
              jp: '来週の木曜の時差、もう計算してあるから。……忘れたら許さない。',
              zh: '下星期四的时差，我已经算好了。……忘了的话，饶不了你。',
              en: 'I\'ve already worked out the time difference for next Thursday. ...Forget, and you\'re dead.',
              color: 'bg-red-600'
            }
          ]
        },
        TORN_PAGE,
        { type: 'effect', setFlags: ['finale_route_asuka'] }
      ],

      // ======== 铃：六甲山的黎明观测 ========
      [CharacterId.REI]: [
        {
          type: 'narration',
          zh: '你朝往上走的那个方向走。那个声音叫你名字的间隔非常均匀，均匀得像是在读秒。',
          en: 'You walk the way that goes uphill. The voice calls your name at perfectly even intervals, as if it were counting seconds.'
        },
        { type: 'scene', scene: 'rokko_night', bgm: 'reflective' },
        {
          type: 'narration',
          characterImage: `${R}winter_neutral.webp`,
          zh: '她在观景台上，望远镜对着东边。底下的城市还亮着，东边的天开始发白。她膝盖上摊着第二十册，第一页只写了日期。',
          en: 'She is on the viewing platform with the telescope turned east. The city below is still lit, and the eastern sky is starting to go pale. Volume twenty is open on her knees, with nothing on the first page but the date.'
        },
        {
          type: 'speech',
          speakerZh: '铃', speakerEn: 'Rei',
          characterImage: `${R}winter_thinking.webp`,
          jp: '観測中に、あなたの名前を三回呼んだ。……記録上は、二回にしておく。',
          zh: '观测的时候，我叫了你的名字三次。……记录上，写两次。',
          en: 'During the observation I called your name three times. ...For the record, I will put two.',
          color: 'bg-indigo-500'
        },
        {
          type: 'narration',
          zh: '你问为什么少写一次。她说第三次不是观测行为，不应该进记录。说完她把头转开了。',
          en: 'You ask why one fewer. The third, she says, was not an act of observation and does not belong in the record. Then she turns her head away.'
        },
        {
          type: 'branch',
          ifFlag: 'rei_ending_love',
          then: [
            {
              type: 'narration',
              characterImage: `${R}winter_shy.webp`,
              zh: '她把第二十册翻过来，扉页那一栏已经写好了：观测者，两名。第二个名字的位置空着，铅笔画了一道很浅的线，等你。',
              en: 'She turns volume twenty round. The flyleaf is already filled in: observers, two. The second name has been left blank, with a faint pencil line drawn for it, waiting for you.'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${R}winter_smile.webp`,
              jp: '本日の観測、開始。……観測者、二名。',
              zh: '今日观测，开始。……观测者，两名。',
              en: 'Today\'s observation begins. ...Observers: two.',
              color: 'bg-indigo-500'
            }
          ],
          otherwise: [
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${R}winter_smile.webp`,
              jp: '第二十冊の最初の読者は、あなた。それは、もう決まっている。',
              zh: '第二十册的第一个读者是你。这件事已经定了。',
              en: 'The first reader of volume twenty is you. That has already been decided.',
              color: 'bg-indigo-500'
            }
          ]
        },
        TORN_PAGE,
        { type: 'effect', setFlags: ['finale_route_rei'] }
      ],

      // ======== 深雪：海风庄的阳台 ========
      [CharacterId.MIYUKI]: [
        {
          type: 'narration',
          zh: '你朝有味噌汤味道的方向走。在一片烧焦的林子里闻到味噌汤，这件事本身就够说明你该往哪儿走了。',
          en: 'You walk towards the smell of miso soup. Smelling miso soup in a burned forest tells you, more or less on its own, which way to go.'
        },
        { type: 'scene', scene: 'apartment_balcony', bgm: 'reflective' },
        {
          type: 'narration',
          characterImage: `${M}cardigan_sad.webp`,
          zh: '她在阳台上，开襟毛衣披在睡衣外面，栏杆上放着两杯茶，一杯已经凉了。她说她四点多醒的，醒来就觉得得叫你一声，叫完了又觉得自己很傻。',
          en: 'She is on the balcony with her cardigan over her nightclothes and two cups of tea on the rail, one already cold. She woke a little after four, she says, and felt she had to call you, and then felt silly for doing it.'
        },
        {
          type: 'speech',
          speakerZh: '深雪', speakerEn: 'Miyuki',
          characterImage: `${M}cardigan_shy.webp`,
          jp: '……呼んだら、本当に来た。',
          zh: '……叫了，你就真的来了。',
          en: '...I called, and you actually came.',
          color: 'bg-violet-400'
        },
        {
          type: 'branch',
          ifFlag: 'miyuki_ending_love',
          then: [
            {
              type: 'narration',
              zh: '你叫了她的名字，不加「さん」。她把那杯热的递给你，说了一句你在这栋楼里从来没听任何人对你说过的话。',
              en: 'You say her name, no "-san". She hands you the hot cup and says something nobody in this building has ever said to you.'
            },
            {
              type: 'speech',
              speakerZh: '深雪', speakerEn: 'Miyuki',
              characterImage: `${M}cardigan_love.webp`,
              jp: 'おかえり。',
              zh: '欢迎回来。',
              en: 'Welcome home.',
              color: 'bg-violet-400'
            }
          ],
          otherwise: [
            {
              type: 'speech',
              speakerZh: '深雪', speakerEn: 'Miyuki',
              characterImage: `${M}cardigan_happy.webp`,
              jp: '緊急連絡先って、こういう時に呼ぶものでしょう？',
              zh: '紧急联络人，不就是这种时候叫的吗？',
              en: 'An emergency contact is for moments like this, isn\'t it?',
              color: 'bg-violet-400'
            }
          ]
        },
        TORN_PAGE,
        { type: 'effect', setFlags: ['finale_route_miyuki'] }
      ],

      // ======== 空：天台 ========
      [CharacterId.SORA]: [
        {
          type: 'narration',
          zh: '你朝那个最响的声音走。它叫你的名字像在场边喊战术，一点都不客气，客气了你就听不见了。',
          en: 'You walk towards the loudest voice. It calls your name the way people shout plays from the sideline: not politely, because politely you would not hear it.'
        },
        { type: 'scene', scene: 'rooftop', bgm: 'reflective' },
        {
          type: 'narration',
          characterImage: `${S}school_cool.webp`,
          zh: '她在天台上压腿，校服外套搭在铁丝网上。修了式那天早上来天台压腿，这件事只有她干得出来。',
          en: 'She is on the roof stretching, her blazer slung over the wire fence. Coming up to the roof to stretch on the morning of the closing ceremony is something only she would do.'
        },
        {
          type: 'speech',
          speakerZh: '空', speakerEn: 'Sora',
          characterImage: `${S}school_happy.webp`,
          jp: '一号がいないと、始まんないじゃん。',
          zh: '一号不在，怎么开始啊。',
          en: 'Can\'t start without my number one, can I.',
          color: 'bg-orange-500'
        },
        {
          type: 'branch',
          ifFlag: 'sora_ending_love',
          then: [
            {
              type: 'narration',
              characterImage: `${S}school_love.webp`,
              zh: '她抬起手。你以为是击掌，伸手过去，她又握住了。跟那天一样。',
              en: 'She puts up her hand. You think it is a high five and go to meet it, and she holds on. Just like that day.'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${S}school_love.webp`,
              jp: 'これ、ハイタッチじゃないからね。',
              zh: '这个，不是击掌哦。',
              en: 'This isn\'t a high five, for the record.',
              color: 'bg-orange-500'
            }
          ],
          otherwise: [
            {
              type: 'narration',
              characterImage: `${S}school_happy.webp`,
              zh: '她用力拍了一下你的肩，拍得你往前踉跄了半步。她说这一下是开赛的哨。',
              en: 'She claps you on the shoulder hard enough to stagger you half a step. That, she says, was the whistle for kick-off.'
            }
          ]
        },
        TORN_PAGE,
        { type: 'effect', setFlags: ['finale_route_sora'] }
      ],

      // ======== 奈绪：校门口的樱花树 ========
      [CharacterId.NAO]: [
        {
          type: 'narration',
          zh: '你朝那个最熟的声音走。它叫你的方式十年没变过，前半个字拖长，后半个字往上挑——你闭着眼睛也能跟着它走回家。',
          en: 'You walk towards the most familiar voice. It has called you the same way for ten years, the first half drawn out, the end lifting; you could follow it home with your eyes shut.'
        },
        { type: 'scene', scene: 'school_gate', bgm: 'reflective' },
        {
          type: 'narration',
          characterImage: `${N}neutral.webp`,
          zh: '她站在校门口那棵樱花树底下。花还没开，枝头鼓着一个个小小的苞。她手里拿着那本新的笔记，翻在今天那一页，已经写了一行。',
          en: 'She is standing under the cherry tree at the school gate. It has not flowered yet; the branches are covered in small tight buds. She has the new notebook open at today\'s page, and one line is already written.'
        },
        {
          type: 'narration',
          zh: '「三月二十四日。朝、名前を呼んだら、来た。」——三月二十四日。早上，叫了名字，就来了。',
          en: '"24th March. Morning. Called his name, and he came."'
        },
        {
          type: 'branch',
          ifFlag: 'nao_ending_love',
          then: [
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${N}shy.webp`,
              jp: '十年前から、呼んだら来る人だったよね。……これからも、そうでしょ？',
              zh: '十年前开始，你就是叫了就会来的人吧。……以后也是，对吧？',
              en: 'You\'ve been someone who comes when I call for ten years now. ...You still will be, right?',
              color: 'bg-emerald-500'
            },
            {
              type: 'narration',
              zh: '她走在你里侧，跟十年前一样。区别是这次她牵着你的袖子，没有松手。',
              en: 'She walks on the inside, as she did ten years ago. The difference is that this time she has hold of your sleeve, and does not let go.'
            }
          ],
          otherwise: [
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${N}happy.webp`,
              jp: '今日の分、もう一行書けた。……あと何行書けるかな。',
              zh: '今天这一条，已经写了一行了。……接下来还能写多少行呢。',
              en: 'That\'s one line for today already. ...I wonder how many more I\'ll get.',
              color: 'bg-emerald-500'
            }
          ]
        },
        TORN_PAGE,
        { type: 'effect', setFlags: ['finale_route_nao'] }
      ],

      // ======== 真希：高架底下 ========
      [CharacterId.MAKI]: [
        {
          type: 'narration',
          zh: '你朝电车的声音走。林子里不可能有电车。可那个轰隆声从头顶上压过去，一班，又一班，中间夹着一个人在叫你，叫得很凶。',
          en: 'You walk towards the sound of trains. There cannot be trains in this wood. But the rumble rolls overhead, one train, then another, and between them someone is calling you, fiercely.'
        },
        { type: 'scene', scene: 'pia_kobe_arcade', bgm: 'reflective' },
        {
          type: 'narration',
          characterImage: `${K}school_pout.webp`,
          zh: '游戏厅的卷帘门还没拉起来。她坐在门口的台阶上，耳机挂在脖子上，嗓子有点哑。',
          en: 'The shutters on the arcade are still down. She is sitting on the step outside with her headphones round her neck, and her voice has gone a little hoarse.'
        },
        {
          type: 'speech',
          speakerZh: '真希', speakerEn: 'Maki',
          characterImage: `${K}school_pout.webp`,
          jp: '……ざぁこ。何回呼ばせんねん。',
          zh: '……杂鱼。要我叫几遍啊。',
          en: '...Small fry. How many times are you gonna make me shout?',
          color: 'bg-pink-500'
        },
        {
          type: 'narration',
          zh: '她说完立刻低下头，加了一句，声音小得要贴过去才听得见：今のは、ざぁこちゃうで。——刚才那个，不是「杂鱼」的意思。',
          en: 'Straight away she ducks her head and adds something so quietly you have to lean in to hear: that one did not mean small fry.'
        },
        {
          type: 'branch',
          ifFlag: 'maki_ending_love',
          then: [
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${K}school_shy.webp`,
              jp: '……センパイ。今日のは、勝負にせんといてな。',
              zh: '……前辈。今天这个，别算成比赛哦。',
              en: '...Senpai. Don\'t make today a match, OK?',
              color: 'bg-pink-500'
            }
          ],
          otherwise: [
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${K}school_smug.webp`,
              jp: '帰国しても、週一でオンライン対戦な。逃げたら不戦敗やで。',
              zh: '回国了也要每周跟我网上对战一次。逃跑的话算你弃权输哦。',
              en: 'Once a week online, even after you go home. Run off and it\'s a forfeit.',
              color: 'bg-pink-500'
            }
          ]
        },
        TORN_PAGE,
        { type: 'effect', setFlags: ['finale_route_maki'] }
      ]
    },

    // ======== 谁的第③段都没走完：跟着离你最近的那个声音 ========
    otherwise: [
      {
        type: 'narration',
        zh: '你朝离你最近的那个声音走。走着走着，雾里的声音一个一个停了，最后只剩一个，从你背后来，很近。',
        en: 'You walk towards the nearest voice. As you go, the voices in the fog fall silent one by one until only one is left, behind you, very close.'
      },
      { type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'reflective' },
      {
        type: 'speech',
        speakerZh: '？？？', speakerEn: '???',
        jp: '遅刻するぞ、人の子。',
        zh: '要迟到了哦，人类的孩子。',
        en: 'You will be late, child of man.',
        color: INARI
      },
      {
        type: 'narration',
        characterImage: '',
        zh: '你回过头。鸟居底下没有人，只有石阶上薄薄一层刚落下来的梅花瓣。生田神社的梅早就开过了，这几片不知道是从哪儿来的。',
        en: 'You turn round. There is nobody under the torii; only a thin scatter of freshly fallen plum petals on the steps. The plums at Ikuta finished flowering weeks ago. You have no idea where these came from.'
      },
      TORN_PAGE,
      { type: 'effect', setFlags: ['finale_route_none'] }
    ]
  },

  // ---- 所有人共用的最后几行 ----
  {
    type: 'narration',
    characterImage: '',
    zh: '去学校的路上你又翻了一次外公的手账。最后一页还是那句「坂を下る。短い。」。你从来没有翻过封底的里侧——今天翻了。那里有一行很淡的铅笔字，是他的笔迹：',
    en: 'On the way to school you open your grandfather\'s journal once more. The last page still says the same thing: walked down the hill; short. You have never looked inside the back cover. Today you do. There is a single faint line of pencil there, in his hand:'
  },
  {
    type: 'narration',
    zh: '「孫へ。鳥居まで。」——给外孙：到鸟居为止。',
    en: '"For my grandson. As far as the torii."'
  },
  {
    type: 'narration',
    zh: '你不知道这一行是什么时候写上去的，也不知道一直都在，还是今天早上才在的。你把手账合上。今天是修了式。',
    en: 'You do not know when that line was written, or whether it has always been there, or only since this morning. You close the journal. Today is the closing ceremony.'
  },
  { type: 'effect', setFlags: ['main_ch7_done'] }
];

// ==========================================================
// 章节表
//
// 【触发】
// 全部挂在"上学第几天"上，而不是月份——玩家可能翘课、可能天天出门，
// 用日历月份卡会出现"到了七月但只出过五次门"的空洞。
// 上学日数是玩家真的过掉的日子。
//
// 再加一道"去过神社"的门：主线是在神社发生的，
// 一个从没走到过那儿的玩家不该被硬塞一段。
// ==========================================================
export const MAIN_CHAPTERS: MainChapterDef[] = [
  {
    id: 'main_ch2', n: 2,
    titleZh: '描了三遍的鸟居', titleEn: 'The Torii Traced Three Times',
    teaseZh: '地图上有个地方，他描了三遍',
    teaseEn: 'One place on the map he drew three times',
    minDay: 30,   // 5/11
    requiresFlags: ['been_ikuta_shrine'],
    script: CH2
  },
  {
    id: 'main_ch3', n: 3,
    titleZh: '名字的帐', titleEn: 'The Ledger of Names',
    teaseZh: '她说，下次把本子一起带来',
    teaseEn: 'She said to bring the notebook next time',
    minDay: 85,   // 7/5
    requiresFlags: ['main_ch2_done'],
    minInariFamiliarity: 90,
    script: CH3
  },
  {
    id: 'main_ch4', n: 4,
    titleZh: '他在等谁', titleEn: 'Who He Was Waiting For',
    teaseZh: '两年多，七百多次，什么也没干',
    teaseEn: 'Two years, seven hundred visits, nothing done',
    minDay: 180,   // 10/8
    requiresFlags: ['main_ch3_done'],
    script: CH4
  },
  {
    id: 'main_ch5', n: 5,
    titleZh: '一九九五', titleEn: 'Nineteen Ninety-Five',
    teaseZh: '历史课上，老师讲到那一年停了三秒',
    teaseEn: 'In history, the teacher paused three seconds on that year',
    minDay: 281,   // 1/17，正文里写死的那一天
    requiresFlags: ['main_ch4_done'],
    script: CH5
  },
  {
    id: 'main_ch6', n: 6,
    titleZh: '同一条坡', titleEn: 'The Same Hill',
    teaseZh: '最后一次走上去',
    teaseEn: 'The last time up',
    minDay: 344,   // 3/21，修了式前几天
    requiresFlags: ['main_ch5_done'],
    script: CH6
  },
  {
    id: 'main_ch7', n: 7, finale: true,
    titleZh: '待つ', titleEn: 'To Wait',
    teaseZh: '修了式那天，天亮之前',
    teaseEn: 'The morning of the closing ceremony, before dawn',
    minDay: 344,
    requiresFlags: ['main_ch6_done'],
    script: CH7
  }
];

export interface MainCtx {
  calendar: GameCalendar;
  flags: StoryFlags;
  familiarity: FamiliarityMap;
  met: CharacterId[];
}

const inariFam = (ctx: MainCtx) => {
  if (!ctx.met.includes(CharacterId.INARI)) return 0;
  return ctx.familiarity[CharacterId.INARI] ?? getInitialFamiliarity(CharacterId.INARI);
};

// 现在能演的下一章。没有就返回 null。
// opts.finale：修了式之前那一次补演才传 true，最终章只在那时候演
export const nextMainChapter = (ctx: MainCtx, opts: { finale?: boolean } = {}): MainChapterDef | null => {
  const day = schoolDayNumber(ctx.calendar);
  for (const ch of MAIN_CHAPTERS) {
    if (ctx.flags[`${ch.id}_done`]) continue;
    if (ch.finale && !opts.finale) continue;
    if (day < ch.minDay) continue;
    if (ch.requiresFlags && !ch.requiresFlags.every(f => ctx.flags[f])) continue;
    if (ch.minInariFamiliarity && inariFam(ctx) < ch.minInariFamiliarity) continue;
    return ch;
  }
  return null;
};
