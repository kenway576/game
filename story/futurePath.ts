import { GameCalendar, GoalRecord, ExamScore, KobeScore, ProtagonistStats, StoryBgmTrack, StoryFlags, StoryNode } from '../types';
import { schoolDayNumber, weekdayFor } from '../constants';

// ==========================================================
// 🎯 进路：JLPT N1 + 神户大学推荐入学
//
// 【为什么要有这条线】
// 主角来神户的时候，申请表「交换目的」那一栏写的是两件事：
// 年内考过 N1，拿到神户大学的推荐入学名额。主线（外公的地图）讲的是
// "这一年值得记下来"，可他自己写下的那两个目标，以前一个字都没有下文。
//
// 【结果由五维决定，不掷骰子】
// 分数在考的那一刻按当时的五维算出来，存进 life.goal，之后不再变。
// 同样的属性永远得同样的分——玩家要能从九月的模拟考倒推出"我还差什么"。
//
//   N1（各科 0–60，合计 ≥100 且每科 ≥19 才算合格，跟真的 N1 一样）
//     言語知識 ← 知识 + 生词本的厚度
//     読解     ← 知识 + 勇气（长文读到最后一篇靠的是坐得住）
//     聴解     ← 体贴 + 知识（这一年有没有好好听人说话）
//   每天上课就能把知识推到七八十，所以光有知识过不了：体贴是零的话听力过不了十九分。
//
//   神户大学推荐（各 0–100）
//     校内评定 = 五维平均 ≥ 45 才拿得到学校那一个推荐名额（前提是 N1 合格）
//     小论文   ← 知识 + 体贴
//     面试     ← 勇气 + 魅力（N1 考到 140 以上再加 5）
//     合格 = 0.3×评定 + 0.3×小论文 + 0.4×面试 ≥ 55，并且面试 ≥ 45
//
// 【日程】都是"到了这天之后第一次回到大厅"就演，错过一天不会错过整件事。
//   4/20 起 放学后  进路面谈（目标和条件交代清楚）
//   9/9  起 放学后  模拟考发回来（第一次看到分数）
//   12 月第一个星期天  N1 考试（整天）
//   1/24 起 放学后  放榜
//   1/31 起 放学后  推荐会议的结果（只有 N1 合格才有）
//   2/10 起 第一个周末  神大面试 + 小论文（只有拿到推荐才有）
//   3/6  起 下午    合格通知（只有去面试了才有）
// 修了式和后日谈里各有一句接上这条线（story/yearEnd.ts、story/epilogue.ts）。
// ==========================================================

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

export const N1_PASS = 100;
export const N1_SECTION_MIN = 19;
export const KOBE_DOC_MIN = 45;
export const KOBE_PASS = 55;
export const KOBE_INTERVIEW_MIN = 45;

export const jlptScore = (s: ProtagonistStats, words: number): ExamScore => {
  const vocab = Math.min(8, words / 100);
  const lang = clamp(s.knowledge * 0.55 + vocab - 4, 0, 60);
  const read = clamp(s.knowledge * 0.45 + s.guts * 0.15 - 2, 0, 60);
  const listen = clamp(s.kindness * 0.45 + s.knowledge * 0.15 + 2, 0, 60);
  const total = lang + read + listen;
  return { lang, read, listen, total, pass: total >= N1_PASS && Math.min(lang, read, listen) >= N1_SECTION_MIN };
};

export const schoolEval = (s: ProtagonistStats): number =>
  clamp((s.knowledge + s.guts + s.kindness + s.charm + s.proficiency) / 5, 0, 100);

export const kobeScore = (s: ProtagonistStats, jlpt?: ExamScore): KobeScore => {
  const doc = schoolEval(s);
  const essay = clamp(s.knowledge * 0.7 + s.kindness * 0.3, 0, 100);
  const interview = clamp(s.guts * 0.5 + s.charm * 0.5 + (jlpt && jlpt.total >= 140 ? 5 : 0), 0, 100);
  const total = clamp(doc * 0.3 + essay * 0.3 + interview * 0.4, 0, 100);
  return { doc, essay, interview, total, pass: total >= KOBE_PASS && interview >= KOBE_INTERVIEW_MIN };
};

// ---------------------------------------------------------
// 日期
// ---------------------------------------------------------
// 一月以后日历的 year 进到 2（advanceCalendarDay），所以一到三月按第二年算
const dayNo = (month: number, day: number) =>
  schoolDayNumber({ month, day, year: month < 4 ? 2 : 1 } as GameCalendar);

const firstWeekday = (month: number, from: number, jpDay: string) => {
  for (let d = from; d < from + 7; d++) if (weekdayFor(month, d).startsWith(jpDay)) return d;
  return from;
};
// 真的 JLPT 在七月和十二月的第一个星期天
export const EXAM_DAY = { month: 12, day: firstWeekday(12, 1, '日') };
export const INTERVIEW_DAY = { month: 2, day: firstWeekday(2, 10, '土') };
const DATE = {
  talk: dayNo(4, 20), mock: dayNo(9, 9), exam: dayNo(EXAM_DAY.month, EXAM_DAY.day),
  result: dayNo(1, 24), recommend: dayNo(1, 31), interview: dayNo(INTERVIEW_DAY.month, INTERVIEW_DAY.day),
  letter: dayNo(3, 6)
};

// ---------------------------------------------------------
// 文本小工具
// ---------------------------------------------------------
const T_COLOR = 'bg-slate-600';
const nar = (zh: string, en: string): StoryNode => ({ type: 'narration', zh, en });
const teacher = (jp: string, zh: string, en: string): StoryNode =>
  ({ type: 'speech', speakerZh: '班主任', speakerEn: 'Homeroom teacher', color: T_COLOR, jp, zh, en });
const grandpa = (zh: string, en: string): StoryNode =>
  ({ type: 'speech', speakerZh: '外公（电话）', speakerEn: 'Grandfather (phone)', color: 'bg-amber-700', zh, en });
const scene = (key: string, titleZh: string, titleEn: string, subZh: string, subEn: string, bgm: StoryBgmTrack = 'study'): StoryNode =>
  ({ type: 'scene', scene: key, bgm, ...(titleZh ? { titleZh, titleEn, subtitleZh: subZh, subtitleEn: subEn } : {}) });
const flags = (...f: string[]): StoryNode => ({ type: 'effect', setFlags: f });

const examDateZh = `十二月${EXAM_DAY.day}日 · 星期天`;
const examDateEn = `Sunday ${EXAM_DAY.day} December`;
const interviewDateZh = `二月${INTERVIEW_DAY.day}日 · 星期六`;
const interviewDateEn = `Saturday ${INTERVIEW_DAY.day} February`;

const scoreLine = (s: ExamScore): StoryNode => nar(
  `言语知识 ${s.lang}/60，阅读 ${s.read}/60，听力 ${s.listen}/60。合计 ${s.total}/180。`,
  `Language knowledge ${s.lang}/60, reading ${s.read}/60, listening ${s.listen}/60. Total ${s.total}/180.`
);

// 三科里最弱的那一科，老师照着它说一句
const weakest = (s: ExamScore): 'lang' | 'read' | 'listen' =>
  s.lang <= s.read && s.lang <= s.listen ? 'lang' : s.read <= s.listen ? 'read' : 'listen';
const SECTION_ZH = { lang: '言语知识', read: '阅读', listen: '听力' };
const SECTION_EN = { lang: 'language knowledge', read: 'reading', listen: 'listening' };

// ==========================================================
// ① 进路面谈
// ==========================================================
const talkScript = (): StoryNode[] => [
  scene('school_faculty_office', '进路面谈', 'The Career Talk', '四月 · 教员室', 'April · The staff room'),
  nar('放学后，班主任把你叫去了教员室。他桌上摊着你来之前寄过来的那份申请表。',
    'After school, your homeroom teacher calls you to the staff room. Spread on his desk is the application form you posted before you came.'),
  nar('「交换目的」那一栏是你自己填的，中文一行，日文一行：取得日本语能力考试 N1；争取神户大学的推荐入学名额。',
    'You filled in the "purpose of exchange" box yourself, one line in your own language and one in Japanese: pass JLPT N1; win a recommended place at Kobe University.'),
  nar('写的时候你是 N3。现在也还是。', 'When you wrote it, you were N3. You still are.'),
  teacher('十二月の第一日曜に、能力試験がある。N1、受けるんやろ？', '十二月第一个星期天有能力考试。N1，你是要考的吧？',
    'The proficiency test is on the first Sunday of December. You’re sitting N1, right?'),
  teacher('うちの学校には、神戸大学の推薦枠が一つだけある。条件は三つや。', '我们学校在神户大学有一个推荐名额，就一个。条件有三个。',
    'We get one recommended place at Kobe University. Just the one. Three conditions.'),
  nar('他竖起一根手指：N1 合格。第二根：校内评定——不光看成绩，这一年你在这儿是个什么样的人，五样都看。第三根：二月去神户大学，面试，外加一篇小论文。',
    'One finger: pass N1. Two: the school’s own assessment, which is not just your marks but what sort of person you turned out to be here, all five ways. Three: in February, an interview at Kobe University, and an essay.'),
  teacher('N1 は、知識だけやと受からへん。読解は最後まで集中が続くかどうか。聴解は——人の話をちゃんと聞いてきたかどうかや。',
    'N1 光靠知识是过不了的。阅读看你能不能一直撑到最后一篇；听力嘛——看你这一年有没有好好听人说话。',
    'Knowledge alone won’t get you through N1. Reading is whether you can hold out to the last passage. Listening is whether you’ve actually been listening to people.'),
  teacher('面接は、度胸と……まあ、人柄やな。', '面试看胆量，还有……人怎么样吧。', 'The interview is nerve and... well, what you’re like.'),
  nar('九月还有一次模拟考。他说那张卷子会比他更老实地告诉你，你现在站在哪儿。',
    'There is a mock exam in September. He says that paper will tell you where you stand more honestly than he can.'),
  nar('走出教员室，走廊尽头的窗子正对着海。四月的海跟申请表上那两行字一样，看上去很近。',
    'Outside the staff room, the window at the end of the corridor looks straight out at the sea. The April sea, like the two lines on that form, looks very close.'),
  nar('（这两件事的进度，记在手机「档案」那一页的学生证下面。）',
    '(Your progress on both is under the student ID on the Profile page of your phone.)'),
  flags('goal_talk_done')
];

// ==========================================================
// ② 模拟考
// ==========================================================
const mockScript = (m: ExamScore): StoryNode[] => {
  const w = weakest(m);
  return [
    scene('school_faculty_office', '模拟考', 'The Mock Exam', '九月 · 教员室', 'September · The staff room'),
    nar('九月第二个星期。上个星期六在视听教室做的那套 N1 模拟题，今天发回来了。',
      'The second week of September. The N1 mock paper you sat in the AV room last Saturday has come back.'),
    teacher('ほら。', '喏。', 'Here.'),
    scoreLine(m),
    m.total >= N1_PASS && Math.min(m.lang, m.read, m.listen) >= N1_SECTION_MIN
      ? nar('合格线是一百分，每一科不能低于十九分。照这张卷子，你已经站在线上了。三个月以后，你得还站在这儿。',
        'The pass mark is a hundred, with no section under nineteen. On this paper you are already standing on the line. In three months you need to still be standing there.')
      : m.total >= 85
        ? nar(`合格线是一百分，每一科不能低于十九分。你差 ${Math.max(1, N1_PASS - m.total)} 分。三个月，说多不多，说少也不少。`,
          `The pass mark is a hundred, with no section under nineteen. You are ${Math.max(1, N1_PASS - m.total)} short. Three months is not a lot, and it is not nothing.`)
        : nar('合格线是一百分，你差得不少。他没说话，把报名表推了过来，意思是：报还是要报。',
          'The pass mark is a hundred, and you are well short of it. He says nothing, just pushes the application form across. Meaning: you’re still sitting it.'),
    w === 'lang'
      ? teacher('単語と文法やな。教科書の外の言葉を、もっと拾い。', '单词和语法。课本外面的词，多捡一点。', 'Vocabulary and grammar. Pick up more words from outside the textbook.')
      : w === 'read'
        ? teacher('読解、後半で崩れてる。最後まで座ってられる根性やな。', '阅读后半段垮了。缺的是能一直坐到最后的那股劲。', 'Your reading falls apart in the second half. What you need is the guts to stay in your seat to the end.')
        : teacher('聴解。……人の話、最後まで聞いてるか？', '听力。……别人说话，你有没有听到最后？', 'Listening. ...When people talk to you, do you hear them out?'),
    nar(`他用红笔在「${SECTION_ZH[w]}」那一栏底下画了一道线。不重，但是画了。`,
      `He draws a line in red pen under ${SECTION_EN[w]}. Not hard. But he draws it.`),
    nar('报名表上的考场是一所大学。报名费学校替交换生出了——他说这是学校唯一能替你做的事，剩下的都得你自己来。',
      'The test centre on the form is a university. The school pays the fee for exchange students. He says that is the only part the school can do for you; the rest is yours.'),
    flags('goal_mock_done')
  ];
};

// ==========================================================
// ③ N1 考试当天
// ==========================================================
const examScript = (s: ExamScore): StoryNode[] => [
  scene('sannomiya_station_dawn', 'JLPT N1', 'JLPT N1', examDateZh, examDateEn, 'train'),
  nar('十二月的早上六点半，三宫站前的天还没亮透。你哈出一口白气，把准考证又摸了一遍。',
    'Half past six on a December morning, and the sky over Sannomiya station is not light yet. You breathe out white and check your admission slip one more time.'),
  nar('去考场的电车上，一半的人手里拿着同一种单词本。你认出了封面的颜色——跟你那本一样，只是比你那本新。',
    'On the train to the test centre, half the carriage is holding the same vocabulary book. You know that cover colour: it is the same as yours, only newer.'),
  scene('jlpt_exam_hall', '', '', '', ''),
  nar('考场是一所大学的阶梯教室。桌角贴着座位号。监考的人念注意事项，念得很慢——你发现自己每一句都听懂了。四月的时候不是这样。',
    'The exam room is a tiered lecture hall at a university, seat numbers taped to the desk corners. The invigilator reads out the rules very slowly, and you realise you understand every sentence. In April you would not have.'),
  s.lang >= 40
    ? nar('第一节，言语知识。汉字读音那一页你写得很快。有几个词你记得是在哪儿捡到的——便利店的价签，一支红笔，某个下午的黑板。',
      'First, language knowledge. You go through the kanji readings fast. Some of the words you remember picking up: a price tag at the konbini, a red pen, a blackboard one afternoon.')
    : s.lang >= 30
      ? nar('第一节，言语知识。一半的题你很有把握，另一半你在两个选项之间来回。你选了看上去更像日语的那一个。',
        'First, language knowledge. Half the questions you are sure of. The other half you swing between two answers, and pick the one that looks more like Japanese.')
      : nar('第一节，言语知识。语法题里有三个句型你见过，可想不起来在哪儿见过。橡皮被你擦得只剩一小块。',
        'First, language knowledge. Three of the grammar patterns you have seen before, but you cannot remember where. Your eraser is down to a stub.'),
  s.read >= 36
    ? nar('第二节，阅读。读到最后一篇长文，你的手还是稳的。',
      'Second, reading. By the last long passage your hand is still steady.')
    : s.read >= 28
      ? nar('第二节，阅读。最后一篇读得很赶，最后两题是猜的——猜得也不算没道理。',
        'Second, reading. You rush the last passage, and the last two answers are guesses. Not unreasonable guesses.')
      : nar('第二节，阅读。读到第三篇，时间就不够了。你看着剩下的题，像看着一班刚开走的电车。',
        'Second, reading. By the third passage you are out of time. You look at the questions left the way you look at a train that has just pulled out.'),
  s.listen >= 34
    ? nar('午饭是便利店的饭团。下午，听力。录音里的人哪一句是真心、哪一句是客气，你听得出来——这一年你听过太多这样的话了。',
      'Lunch is a konbini rice ball. Then listening. You can hear which lines on the recording are meant and which are only politeness. You have heard a year’s worth of both.')
    : s.listen >= 26
      ? nar('午饭是便利店的饭团。下午，听力。有几段说得太快，你只抓住了开头和结尾。不过人说话最要紧的，往往就在开头和结尾。',
        'Lunch is a konbini rice ball. Then listening. Some of it is too fast and you only catch the beginnings and ends. Then again, that is usually where the point is.')
      : nar('午饭是便利店的饭团。下午，听力。录音放第一遍的时候，你还在想上一题。',
        'Lunch is a konbini rice ball. Then listening. The first time each clip plays, you are still thinking about the one before.'),
  nar('交卷的时候外面天已经暗了。你不知道考得怎么样——这正是这场考试最狠的地方：结果要等到一月。',
    'It is dark when you hand the paper in. You have no idea how it went, which is the cruellest part of this exam: the result does not come until January.'),
  nar('回去的电车上，你没有翻单词本。', 'On the train home, you do not open the vocabulary book.'),
  flags('goal_jlpt_done')
];

// ==========================================================
// ④ 放榜
// ==========================================================
const resultScript = (s: ExamScore): StoryNode[] => {
  const low = (['lang', 'read', 'listen'] as const).find(k => s[k] < N1_SECTION_MIN);
  return [
    scene('international_office', '放榜', 'Results', '一月 · 国际交流室', 'January · The international office', 'reflective'),
    nar('成绩是上午十点在网上公布的。你一整个上午都没有碰手机。',
      'The results went online at ten this morning. You have not touched your phone all morning.'),
    nar('放学后，你在国际交流室的电脑上输进了准考证号。页面转了很久。',
      'After school you type your candidate number into the computer in the international office. The page takes a long time.'),
    scoreLine(s),
    ...(s.pass ? [
      nar('下面一行：合格。', 'Underneath, one word: PASSED.'),
      nar('你盯着这两个字看了很久，久到屏幕自己暗了下去。四月的时候，校长讲话你一个字都没听懂。',
        'You stare at it so long the screen dims on its own. In April you did not understand a word of the principal’s speech.'),
      teacher('どうやった。', '怎么样？', 'Well?'),
      nar('你把屏幕转过去给他看。他看了一会儿，没有夸你，只说了一句：', 'You turn the screen round. He looks for a while. He does not praise you. He says only:'),
      teacher('推薦会議、来週や。', '推荐会议，下个星期开。', 'The recommendation meeting is next week.'),
      flags('goal_result_done', 'jlpt_n1_pass')
    ] : [
      low
        ? nar(`下面一行：不合格。总分 ${s.total}，过了线——可${SECTION_ZH[low]}只有 ${s[low]} 分。低于十九分的那一科，一科就够让整张卷子作废。`,
          `Underneath: FAILED. A total of ${s.total} is over the line, but ${SECTION_EN[low]} is only ${s[low]}. One section under nineteen is enough to sink the whole paper.`)
        : nar(`下面一行：不合格。差 ${N1_PASS - s.total} 分。`, `Underneath: FAILED. ${N1_PASS - s.total} points short.`),
      nar('你把页面关掉，又打开，又关掉。数字没有变。', 'You close the page, open it again, close it again. The numbers do not change.'),
      teacher('……七月にも試験はある。国でも受けられるで。', '……七月还有一次。在国内也能考。', '...There’s another sitting in July. You can take it back home.'),
      nar('他没有提推荐的事。你们都知道，没有 N1，那一栏就是空的。',
        'He does not mention the recommendation. You both know that without N1, that box stays empty.'),
      flags('goal_result_done', 'jlpt_n1_fail', 'kobe_rec_no')
    ])
  ];
};

// ==========================================================
// ⑤ 推荐会议（N1 合格才有）
// ==========================================================
const recommendScript = (doc: number): StoryNode[] => doc >= KOBE_DOC_MIN ? [
  scene('school_faculty_office', '推荐会议', 'The Recommendation', '一月末 · 教员室', 'Late January · The staff room'),
  teacher('推薦、出すことになった。', '推荐，决定给你了。', 'We’re putting you forward.'),
  nar('他说会上有人问，一年的交换生凭什么占这个名额。然后有人替你回答了——是谁，他没说。',
    'He says someone at the meeting asked why a one-year exchange student should take the place. Then someone answered for you. He does not say who.'),
  nar('每个科任老师都写了一段评语。体育老师那一段最长。', 'Every subject teacher wrote a paragraph. The PE teacher’s is the longest.'),
  teacher(`二月${INTERVIEW_DAY.day}日、六甲台。面接と小論文や。……度胸だけは、置いていくなよ。`,
    `${interviewDateZh.replace(' · ', '，')}，六甲台。面试加小论文。……胆子可别落在家里。`,
    `${interviewDateEn}, Rokkodai. Interview and essay. ...Don’t leave your nerve at home.`),
  flags('goal_recommend_done', 'kobe_rec_yes')
] : [
  scene('school_faculty_office', '推荐会议', 'The Recommendation', '一月末 · 教员室', 'Late January · The staff room'),
  teacher('……推薦は、別の生徒に決まった。', '……推荐，定给了别的学生。', '...The place went to another student.'),
  nar('N1 你是过了的。会上说，五样评定里你还差一点——不是哪一样不好，是哪一样都还没长到能替你开口的地步。',
    'You passed N1. But the meeting said that across the five assessments you fall a little short. Not bad at anything. Just not yet strong enough at anything for it to speak for you.'),
  nar(`他把评定表给你看。综合一栏写着 ${doc}。推荐要的是 ${KOBE_DOC_MIN}。每一格的评语都是「良好」。良好不是不好，只是推荐要的不是良好。`,
    `He shows you the sheet. The overall box says ${doc}; the recommendation needs ${KOBE_DOC_MIN}. Every comment reads "good". Good is not bad. A recommendation just asks for more than good.`),
  teacher('N1 は、あんたのもんや。それは誰にも取られへん。', 'N1 是你自己的。那个谁也拿不走。', 'N1 is yours. No one can take that off you.'),
  flags('goal_recommend_done', 'kobe_rec_no')
];

// ==========================================================
// ⑥ 神户大学 面试 + 小论文（拿到推荐才有）
// ==========================================================
const interviewScript = (k: KobeScore): StoryNode[] => [
  scene('kobe_univ_campus', '神户大学', 'Kobe University', interviewDateZh, interviewDateEn, 'reflective'),
  nar('二月的六甲台，坡比你想的陡。走到一半你回了一次头——整个神户都在下面，海在更下面。',
    'Rokkodai in February. The slope is steeper than you expected. Halfway up you look back once: all of Kobe below you, and the sea below that.'),
  nar('小论文的题目是：「这一年里你学到的、教科书上没有的一件事」。',
    'The essay question: "One thing you learned this year that is not in any textbook."'),
  k.essay >= 65
    ? nar('你写了外公的手账。写他只记价钱、天气、谁做了什么，不写感受；写你后来才明白，感受是留给读的人的。格子写满了，你又在页边补了一行。',
      'You write about your grandfather’s notebook: how he only ever wrote down prices, weather and who did what, never feelings, and how you understood later that the feelings were left for whoever read it. You fill every box and add a line in the margin.')
    : k.essay >= 50
      ? nar('你写了，写得不算满。最后一段的结尾，你改了两次。', 'You write it. Not quite to the bottom. You rewrite the last line twice.')
      : nar('你想写的东西太多，写下来的东西太少。交卷的时候，最后一行还空着。', 'You have too much to say and not enough of it makes it onto the page. When you hand it in, the last line is still blank.'),
  nar('下午是面试。三位教授，一张长桌，一把椅子。', 'The interview is in the afternoon. Three professors, a long table, one chair.'),
  k.interview >= 60
    ? nar('问到「为什么是神户」的时候，你说了那条坡。中间那位教授笑了一下，在纸上写了很长的一行。',
      'When they ask "why Kobe", you tell them about the slope. The professor in the middle smiles and writes a long line on his sheet.')
    : k.interview >= KOBE_INTERVIEW_MIN
      ? nar('有一个问题你没答好。但你没有低头，把剩下的都答完了。', 'One question you answer badly. You do not look down, and you answer the rest.')
      : nar('你的声音比你想的小。有一个问题你答到一半就停了，后半句一直没找回来。',
        'Your voice comes out smaller than you meant. One answer stops halfway, and you never find the rest of it.'),
  nar('下坡的时候，你想起手账第一页那句：坂を上る。長い。——下坡确实短。',
    'On the way down you think of the first page of the notebook: 坂を上る。長い。The way down really is shorter.'),
  flags('goal_interview_done')
];

// ==========================================================
// ⑦ 合格通知
// ==========================================================
const letterScript = (k: KobeScore): StoryNode[] => k.pass ? [
  scene('umikaze_exterior', '合格通知', 'The Letter', '三月 · 海风庄', 'March · Umikaze-sō', 'harbor'),
  nar('海风庄的信箱里有一个大信封。大信封是好消息——这话不知道是谁告诉你的，可这一年里每个人都跟你说过一遍。',
    'There is a large envelope in the Umikaze-sō letterbox. Large envelopes are good news; you cannot remember who told you that, only that by now everyone has.'),
  nar('「合格」。', '"Admitted."'),
  nar('你给外公打了个电话。他听完，隔了很久，只说了一句：', 'You ring your grandfather. He listens, is quiet for a long time, and says only:'),
  grandpa('那条坡，你还得再上一次了。', 'So you’ll be going up that slope again.'),
  nar('明年四月，你会回到这里。不是交换生了。', 'Next April you will come back here. Not as an exchange student.'),
  flags('goal_kobe_done', 'kobe_univ_pass')
] : [
  scene('umikaze_exterior', '合格通知', 'The Letter', '三月 · 海风庄', 'March · Umikaze-sō', 'harbor'),
  nar('海风庄的信箱里有一个小信封。你在信箱前面就拆开了。', 'There is a small envelope in the Umikaze-sō letterbox. You open it standing right there.'),
  nar(`「不合格」。面试 ${k.interview}，小论文 ${k.essay}，校内评定 ${k.doc}——信里当然没写这些数字，是你自己一遍一遍算出来的。`,
    `"Not admitted." Interview ${k.interview}, essay ${k.essay}, school assessment ${k.doc}. The letter gives no numbers, of course; you worked them out yourself, over and over.`),
  nar('你给外公打了个电话。他听完，只说了一句：', 'You ring your grandfather. He listens, and says only:'),
  grandpa('上过一次的坡，就认得路了。', 'A slope you’ve climbed once, you know the way up.'),
  nar('你把信封叠好，夹进了外公的手账里。', 'You fold the envelope and tuck it into your grandfather’s notebook.'),
  flags('goal_kobe_done', 'kobe_univ_fail')
];

// ==========================================================
// 今天该演哪一段
// ==========================================================
export interface FutureCtx {
  calendar: GameCalendar;
  flags: StoryFlags;
  stats: ProtagonistStats;
  words: number;
  goal: GoalRecord;
  // 今天是不是上学日、课上完了没有
  schoolDay: boolean;
  classPending: boolean;
}

export interface FutureDue {
  id: string;
  titleZh: string; titleEn: string;
  scene: string;
  district: 'school' | 'far' | 'kitano';
  // 花几格时间。考试和面试都占掉剩下的一整天（回来是晚上），其余都在放学后顺便说完
  timeCost: number;
  script: StoryNode[];
  // 考的那一刻算出来的分数：先存进 life.goal 再演
  record?: GoalRecord;
  // 这一段会置的 flag（"演过了" + 结果）。开演时就记上：
  // 玩家点「跳过」的话，剧本末尾那个 effect 节点是走不到的，结果不能跟着丢。
  flags: string[];
}

const flagsOf = (script: StoryNode[]): string[] =>
  script.flatMap(n => n.type === 'effect' && n.setFlags ? n.setFlags : []);
const due = (d: Omit<FutureDue, 'flags'>): FutureDue => ({ ...d, flags: flagsOf(d.script) });

export const futureEventDue = (c: FutureCtx): FutureDue | null => {
  const f = c.flags;
  const today = schoolDayNumber(c.calendar);
  const slot = c.calendar.timeSlot;
  const afterSchool = slot === 'afternoon' && !c.classPending;
  const weekend = !c.schoolDay;
  const restOfDay = slot === 'morning' ? 3 : slot === 'lunch' ? 2 : slot === 'afternoon' ? 1 : 0;

  if (!f.goal_talk_done && today >= DATE.talk && c.schoolDay && afterSchool)
    return due({ id: 'goal_talk', titleZh: '进路面谈', titleEn: 'Career talk', scene: 'school_faculty_office', district: 'school', timeCost: 0, script: talkScript() });

  if (!f.goal_mock_done && today >= DATE.mock && today < DATE.exam && c.schoolDay && afterSchool) {
    const mock = c.goal.mock ?? jlptScore(c.stats, c.words);
    return due({ id: 'goal_mock', titleZh: '模拟考', titleEn: 'Mock exam', scene: 'school_faculty_office', district: 'school', timeCost: 0, script: mockScript(mock), record: { mock } });
  }

  // 考试那天一大早就出门，晚上才回来。当天没赶上（别的剧情占着），之后第一个星期天补上
  if (!f.goal_jlpt_done && today >= DATE.exam && today < DATE.result && weekend && slot !== 'night') {
    const jlpt = c.goal.jlpt ?? jlptScore(c.stats, c.words);
    return due({ id: 'goal_jlpt', titleZh: 'JLPT N1', titleEn: 'JLPT N1', scene: 'jlpt_exam_hall', district: 'far', timeCost: restOfDay, script: examScript(jlpt), record: { jlpt } });
  }

  if (!f.goal_result_done && today >= DATE.result && afterSchool) {
    // 万一考试那段一直没演到（存档跳过了十二月），也按现在的属性给一个成绩，不让这条线断在这儿
    const jlpt = c.goal.jlpt ?? jlptScore(c.stats, c.words);
    return due({ id: 'goal_result', titleZh: '放榜', titleEn: 'Results', scene: 'international_office', district: 'school', timeCost: 0, script: resultScript(jlpt), record: { jlpt } });
  }

  if (f.jlpt_n1_pass && !f.goal_recommend_done && today >= DATE.recommend && afterSchool)
    return due({ id: 'goal_recommend', titleZh: '推荐会议', titleEn: 'The recommendation', scene: 'school_faculty_office', district: 'school', timeCost: 0, script: recommendScript(schoolEval(c.stats)) });

  if (f.kobe_rec_yes && !f.goal_interview_done && today >= DATE.interview && today < DATE.letter && weekend && slot !== 'night') {
    const kobe = c.goal.kobe ?? kobeScore(c.stats, c.goal.jlpt);
    return due({ id: 'goal_interview', titleZh: '神户大学', titleEn: 'Kobe University', scene: 'kobe_univ_campus', district: 'far', timeCost: restOfDay, script: interviewScript(kobe), record: { kobe } });
  }

  if (f.goal_interview_done && !f.goal_kobe_done && today >= DATE.letter && slot === 'afternoon' && !c.classPending) {
    const kobe = c.goal.kobe ?? kobeScore(c.stats, c.goal.jlpt);
    return due({ id: 'goal_letter', titleZh: '合格通知', titleEn: 'The letter', scene: 'umikaze_exterior', district: 'kitano', timeCost: 0, script: letterScript(kobe), record: { kobe } });
  }
  return null;
};

// ==========================================================
// 档案页 / 结算屏用：现在走到哪一步了
// ==========================================================
export type GoalStage = 'todo' | 'waiting' | 'pass' | 'fail' | 'locked';
export const goalStatus = (flags: StoryFlags, goal: GoalRecord) => ({
  n1: (flags.jlpt_n1_pass ? 'pass' : flags.jlpt_n1_fail ? 'fail' : flags.goal_jlpt_done ? 'waiting' : 'todo') as GoalStage,
  kobe: (flags.kobe_univ_pass ? 'pass'
    : flags.kobe_univ_fail || flags.kobe_rec_no || flags.jlpt_n1_fail ? 'fail'
    : flags.goal_interview_done ? 'waiting'
    : 'todo') as GoalStage,
  mock: goal.mock, jlpt: flags.goal_result_done ? goal.jlpt : undefined, kobeScore: flags.goal_kobe_done ? goal.kobe : undefined,
  recommended: !!flags.kobe_rec_yes, recDenied: !!flags.kobe_rec_no && !!flags.jlpt_n1_pass
});
export const EXAM_DATE_LABEL = { zh: `12月${EXAM_DAY.day}日`, en: `${EXAM_DAY.day} Dec` };
export const INTERVIEW_DATE_LABEL = { zh: `2月${INTERVIEW_DAY.day}日`, en: `${INTERVIEW_DAY.day} Feb` };

// StoryLab 试播：/?story=goal_result&stats=75,40,40,35,30&words=900
// （stats 依次是 知识,勇气,体贴,魅力,灵巧）
export const futureLabScript = (id: string, s: ProtagonistStats, words: number): StoryNode[] => {
  const j = jlptScore(s, words);
  const k = kobeScore(s, j);
  switch (id) {
    case 'goal_talk': return talkScript();
    case 'goal_mock': return mockScript(j);
    case 'goal_jlpt': return examScript(j);
    case 'goal_result': return resultScript(j);
    case 'goal_recommend': return recommendScript(schoolEval(s));
    case 'goal_interview': return interviewScript(k);
    case 'goal_letter': return letterScript(k);
  }
  return [];
};
