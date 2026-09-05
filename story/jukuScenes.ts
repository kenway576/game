import { GameCalendar, StoryNode } from '../types';
import { daysToExam, examOn } from '../data/calendarLife';

// ==========================================================
// 🏫 塾
//
// 【它为什么不是"又一个学习的地方"】
// 图书馆、自习、在房间背单词——这些都给知识。塾如果也只是给知识，
// 那它就只是一个数字更大的按钮。
//
// 它的机制只有一条：**收益看离考试还有多久**。
//   离考试超过三周   → 一节普通的课，知识 +2
//   两周以内         → 开始讲考点，知识 +4
//   一周以内         → 押题周，知识 +7，加毅力
//   正在考试期间     → 不上课，只有自习室开着
//
// 于是"什么时候去塾"变成一个判断，而不是一个习惯。
// 一年只有三场期末考，也就是三个值得去的窗口——
// 剩下的时间它开着，但不划算，而玩家看得出来不划算。
//
// 【还有一件事】
// 它是这个游戏里唯一一个花钱的日常。一次三千日元。
// 这个价钱要疼，疼到玩家会算"这一趟值不值"。
// ==========================================================

export const JUKU_FEE = 3000;

export type JukuTier = 'far' | 'near' | 'crunch' | 'during';

export const jukuTier = (cal: GameCalendar): JukuTier => {
  if (examOn(cal)) return 'during';
  const d = daysToExam(cal);
  if (d === null || d > 21) return 'far';
  if (d > 7) return 'near';
  return 'crunch';
};

const SCENE = 'juku_night';

// 一节课的正文。四档各写各的——同一段文字配四种收益，
// 玩家两次就会发现这个地方是假的。
const BODY: Record<JukuTier, StoryNode[]> = {
  far: [
    {
      type: 'narration',
      zh: '九月的周三晚上，教室里坐了四个人。你挑了靠窗那个隔间，因为能看见高架。',
      en: 'A Wednesday night in the ordinary part of the year: four people in the room. You take the booth by the window because you can see the viaduct from it.'
    },
    {
      type: 'narration',
      zh: '讲的是基础语法，进度慢得像在照顾谁。你后来发现照顾的就是你——老师讲到「〜ておく」的时候特意停下来，用了两个例句。',
      en: 'It is basic grammar, at a pace slow enough to be looking after somebody. You work out later that the somebody is you: at "-te oku" the teacher stops and gives two example sentences instead of one.'
    },
    {
      type: 'narration',
      zh: '九点半散场。你在楼梯口把讲义卷起来塞进书包，纸是热的。',
      en: 'They let you out at half nine. You roll the handout up and push it into your bag on the stairs. The paper is warm.'
    },
    {
      type: 'effect',
      effects: [
        { stat: 'knowledge', amount: 2, reasonZh: '一节不赶时间的课', reasonEn: 'One lesson, in no hurry' }
      ]
    }
  ],
  near: [
    {
      type: 'narration',
      zh: '人多了一倍。白板上多了一行字：**出題範囲**。下面列着十二项，老师用红笔在其中四项上画了圈。',
      en: 'Twice as many people. There is a new line on the whiteboard: what the exam covers. Twelve items under it, four of them circled in red.'
    },
    {
      type: 'narration',
      zh: '「ここ、出ます。」他说这句话的时候没有加任何修饰。整间教室的笔同时动了。',
      en: '"This will come up." He says it without qualifying it in any way. Every pen in the room moves at the same moment.'
    },
    {
      type: 'narration',
      zh: '你也在动。你甚至没完全听懂那句话，但你看懂了别人的手。',
      en: 'Yours moves too. You did not entirely follow the sentence, but you read everybody else’s hands.'
    },
    {
      type: 'effect',
      effects: [
        { stat: 'knowledge', amount: 4, reasonZh: '有人告诉你哪些是重点', reasonEn: 'Somebody told you which parts matter' }
      ]
    }
  ],
  crunch: [
    {
      type: 'scene', scene: SCENE, bgm: 'night',
      titleZh: '直前対策', titleEn: 'The Week Before'
    },
    {
      type: 'narration',
      zh: '走廊里排到了楼梯上。有人自带折叠凳。你的隔间是抽签抽到的，编号写在手背上。',
      en: 'The queue reaches the stairs. Somebody has brought a folding stool. Booths are drawn by lot and your number is written on the back of your hand.'
    },
    {
      type: 'narration',
      zh: '两个小时里老师只做一件事：把去年、前年、大前年的卷子摊开，指出同一道题换了三种问法。',
      en: 'For two hours the teacher does one thing: he lays out last year’s paper, and the one before, and the one before that, and shows you the same question asked three different ways.'
    },
    {
      type: 'narration',
      zh: '散场前他说了一句「寝てください」。全班笑了。没有人打算照做。',
      en: 'Before letting you go he tells everybody to please sleep. The room laughs. Nobody intends to.'
    },
    {
      type: 'narration',
      zh: '你走出去的时候是九点四十。三宫的雨已经停了，地面还亮着。',
      en: 'You get out at twenty to ten. The rain over Sannomiya has stopped and the ground is still shining.'
    },
    {
      type: 'effect',
      effects: [
        { stat: 'knowledge', amount: 7, reasonZh: '三年的卷子摊在同一张桌子上', reasonEn: 'Three years of past papers on one table' },
        { stat: 'guts', amount: 2, reasonZh: '排队排到楼梯上还是坐下来了', reasonEn: 'The queue went down the stairs and you sat down anyway' }
      ]
    }
  ],
  during: [
    {
      type: 'narration',
      zh: '考试周不上课，只开自习室。灯只亮了一半，剩下的一半没人管。',
      en: 'No lessons during exam week, only the self-study room. Half the lights are on and nobody has bothered about the other half.'
    },
    {
      type: 'narration',
      zh: '里面有六个人，没有一个抬头。你坐了两个小时，什么也没问，也没有人问你。',
      en: 'Six people inside, none of them looking up. You sit for two hours. You ask nothing and nobody asks you anything.'
    },
    {
      type: 'effect',
      effects: [
        { stat: 'knowledge', amount: 3, reasonZh: '两个小时，没有人说话', reasonEn: 'Two hours, and nobody spoke' },
        { stat: 'guts', amount: 1, reasonZh: '你已经在这儿坐得住了', reasonEn: 'You can sit here now' }
      ]
    }
  ]
};

const OPENING: Record<JukuTier, { zh: string; en: string }> = {
  far:    { zh: '灘和ゼミ · 平常的一晚', en: 'Nadawa Seminar · an ordinary night' },
  near:   { zh: '灘和ゼミ · 考试前两周',  en: 'Nadawa Seminar · two weeks out' },
  crunch: { zh: '灘和ゼミ · 直前対策',    en: 'Nadawa Seminar · the week before' },
  during: { zh: '灘和ゼミ · 自习室',      en: 'Nadawa Seminar · the self-study room' }
};

export const buildJukuScript = (cal: GameCalendar): StoryNode[] => {
  const tier = jukuTier(cal);
  const head = OPENING[tier];
  return [
    {
      type: 'scene', scene: SCENE, bgm: 'night',
      titleZh: head.zh, titleEn: head.en,
      subtitleZh: `授業料 ${JUKU_FEE.toLocaleString()} 円`,
      subtitleEn: `${JUKU_FEE.toLocaleString()} yen a session`
    },
    ...BODY[tier].filter(n => n.type !== 'scene')
  ];
};

// 大厅/地图上给玩家的那句提示。**说清楚划不划算**——
// 这个系统的全部乐趣就是"什么时候去"，藏起来就没了。
export const jukuHint = (cal: GameCalendar, en: boolean): string => {
  switch (jukuTier(cal)) {
    case 'crunch': return en ? 'The week before. Worth every yen.' : '考试前一周。这一趟最值。';
    case 'near':   return en ? 'They have started saying which parts come up.' : '开始讲考点了。';
    case 'during': return en ? 'No lessons this week. The self-study room is open.' : '考试周没有课，只开自习室。';
    default:       return en ? 'Ordinary lessons. Cheaper weeks exist.' : '平常的课。不急的话可以等等。';
  }
};
