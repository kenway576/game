import { CharacterId, GameCalendar, StoryFlags, StoryNode, FamiliarityMap } from '../types';
import { getInitialFamiliarity, schoolDayNumber } from '../constants';

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
    characterImage: `${I}summer_neutral_alt.webp`,
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
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你问的是能被记录的那部分', reasonEn: 'You asked for the part that can be written down' }],
        setFlags: ['main3_asked_count'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}summer_curious.webp`,
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
    type: 'scene', scene: 'ikuta_shrine', bgm: 'night',
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
    characterImage: `${I}knit_thinking.webp`,
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
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没有硬要给他安一个理由', reasonEn: 'You did not insist on giving him a reason' }],
        setFlags: ['main4_asked_nothing'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}knit_thinking.webp`,
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
    type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'night',
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
    characterImage: `${I}gown_serious.webp`,
    zh: '她站在鸟居底下，穿着你没见过的那身，一动不动。你走过去的时候她没有看你。',
    en: 'She is standing under the torii in something you have not seen her wear, perfectly still. She does not look at you as you come over.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_serious.webp`,
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
    characterImage: `${I}gown_cold.webp`,
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
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你问的是她，不是那场灾难', reasonEn: 'You asked about her, not about the disaster' }],
        setFlags: ['main5_asked_alone'],
        then: [
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}gown_cold.webp`,
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
            characterImage: `${I}gown_cold.webp`,
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
    jp: 'この街はな、二度建った。二度目のは、みんなが覚えておる。',
    zh: '这座城建过两次。第二次那一回，所有人都记得。',
    en: 'This city has been built twice. The second time, everyone remembers.',
    color: INARI
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}gown_neutral_alt.webp`,
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
    type: 'scene', scene: 'ikuta_shrine_gate', bgm: 'night',
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
    type: 'narration',
    characterImage: `${I}casual_happy.webp`,
    zh: '她合上册子，站起来，第一次把手伸出来。',
    en: 'She closes the book, stands up, and for the first time puts out her hand.'
  },
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
export const nextMainChapter = (ctx: MainCtx): MainChapterDef | null => {
  const day = schoolDayNumber(ctx.calendar);
  for (const ch of MAIN_CHAPTERS) {
    if (ctx.flags[`${ch.id}_done`]) continue;
    if (day < ch.minDay) continue;
    if (ch.requiresFlags && !ch.requiresFlags.every(f => ctx.flags[f])) continue;
    if (ch.minInariFamiliarity && inariFam(ctx) < ch.minInariFamiliarity) continue;
    return ch;
  }
  return null;
};
