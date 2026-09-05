import { StoryWord } from '../types';

// ==========================================================
// 🏫 课堂内容
//
// 【三种课】
//   速写 sketch —— 两三句话就过去。一天里最常见的那种课。
//                  只挂一个生词，不给选项。**它的作用是当背景音**：
//                  日子要有厚度，而厚度来自大量不重要的日子。
//   小测 quiz   —— 停下来答一题。答对给知识，答错也给一点（"你至少记住了"）。
//   事件 event  —— 有人在场的课。这种才给选项、才动关系。
//
// 【比例】
// 速写压倒性多数。小测和事件加起来不到三分之一。
// 这个比例是故意的：一件事只有在不常发生的时候才是事件。
//
// 【写法】
// 主角是个刚落地两天的交换生，日语听得半懂不懂。所以课堂速写里
// 最常见的一件事是**他听漏了**。这不是笑料，是这个游戏的实际处境：
// 语言不通的人上课就是这样。他能抓住的只有黑板、邻座的笔、
// 窗外的声音，还有偶尔一个突然听懂了的词——那个词就是今天的生词。
// ==========================================================

export interface Sketch {
  subject: string;
  zh: string;
  en: string;
  word?: StoryWord;
  // 不写就在教室里
  scene?: string;
}

export const SKETCHES: Sketch[] = [
  // ---- 国語 ----
  {
    subject: 'kokugo',
    zh: '老师在黑板上竖着写。你花了半节课才习惯这件事——字是从右往左排的，而你的眼睛还在往左边找下一行。',
    en: 'The teacher writes down the board, vertically. It takes you half the period to stop looking left for the next line.',
    word: { jp: '縦書き', reading: 'たてがき', zh: '竖写', en: 'vertical writing' }
  },
  {
    subject: 'kokugo',
    zh: '今天读的是一首和歌。你一个字也没听懂，但老师念到一半停了一下，全班都笑了。你也笑了，慢了半拍。',
    en: 'Today it is a waka. You understand none of it, but the teacher pauses halfway and the whole class laughs. You laugh too, half a beat late.',
    word: { jp: '和歌', reading: 'わか', zh: '和歌', en: 'waka (classical poem)' }
  },
  {
    subject: 'kokugo',
    zh: '「これ、古文だから現代語じゃないぞ」——老师说这句话的时候看了你一眼。你不确定那是照顾还是提醒。',
    en: 'The teacher says this is classical Japanese, not the modern language, and looks at you while saying it. You cannot tell if that was kindness or a warning.',
    word: { jp: '古文', reading: 'こぶん', zh: '古文', en: 'classical Japanese' }
  },
  {
    subject: 'kokugo',
    zh: '默写。你写的字被自己越写越小，最后一行几乎缩成了一条线。',
    en: 'Dictation. Your characters get smaller as you go, until the last line is nearly a single stroke.',
    word: { jp: '書き取り', reading: 'かきとり', zh: '默写', en: 'dictation' }
  },
  // ---- 数学 ----
  {
    subject: 'suugaku',
    zh: '数学是唯一一门你完全跟得上的课。符号不需要翻译。你有点想为这件事道歉，又不知道该跟谁道歉。',
    en: 'Maths is the only lesson you follow completely. Symbols do not need translating. You feel vaguely like apologising for this, without knowing to whom.',
    word: { jp: '記号', reading: 'きごう', zh: '符号', en: 'symbol' }
  },
  {
    subject: 'suugaku',
    zh: '老师叫了一个人上去解题。那个人在黑板前站了四十秒，然后写出了答案。全班没有人出声。',
    en: 'Someone is called to the board. They stand there for forty seconds and then write the answer. Nobody makes a sound.',
    word: { jp: '解く', reading: 'とく', zh: '解（题）', en: 'to solve' }
  },
  {
    subject: 'suugaku',
    zh: '你发现这边写除法的符号跟你从小写的不一样。你盯着那个符号看了很久，最后决定不问。',
    en: 'You notice the division sign here is not the one you grew up writing. You stare at it for a while and decide not to ask.',
    word: { jp: '割り算', reading: 'わりざん', zh: '除法', en: 'division' }
  },
  {
    subject: 'suugaku',
    zh: '第二排有人在算草稿纸背面画画。老师走过去，看了一眼，什么也没说就走了。',
    en: 'Someone in the second row is drawing on the back of their scratch paper. The teacher walks over, looks, and moves on without saying anything.',
    word: { jp: '落書き', reading: 'らくがき', zh: '涂鸦', en: 'doodle' }
  },
  // ---- 英語 ----
  {
    subject: 'eigo',
    zh: '英语课上老师念了一段课文，全班安静得可怕。然后他叫了你。你念完之后，教室里有一种非常复杂的沉默。',
    en: 'The teacher reads a passage aloud and the class goes alarmingly quiet. Then he calls on you. When you finish there is a very complicated silence.',
    word: { jp: '発音', reading: 'はつおん', zh: '发音', en: 'pronunciation' }
  },
  {
    subject: 'eigo',
    zh: '英语是你一周里唯一一节不用努力的课。你趴在桌上，听满教室的人用一种小心翼翼的语调，念你从小说到大的句子。',
    en: 'English is the one period in the week you do not have to work at. You put your head down and listen to a whole room saying, very carefully, sentences you grew up in.',
    word: { jp: '楽', reading: 'らく', zh: '轻松', en: 'easy / a relief' }
  },
  {
    subject: 'eigo',
    zh: '你想帮邻座改一个介词，手伸到一半又收回来了。这不是你的教室，至少现在还不是。',
    en: 'You start to reach over and fix a preposition for the person next to you, then take your hand back. This is not your classroom. Not yet.',
    word: { jp: '直す', reading: 'なおす', zh: '改正', en: 'to correct' }
  },
  // ---- 日本史 ----
  {
    subject: 'nihonshi',
    zh: '讲到神户开港。老师说了一个一八六八，你在笔记本边上写下来——外公的手账里也有这个数字。',
    en: 'The lesson reaches the opening of the port of Kobe. The teacher says 1868 and you write it in the margin. That number is in your grandfather’s journal too.',
    word: { jp: '開港', reading: 'かいこう', zh: '开港', en: 'opening of a port' }
  },
  {
    subject: 'nihonshi',
    zh: '「南蛮」这个词今天出现了三次。你终于明白为什么那道炸鱼要叫南蛮渍了。',
    en: 'The word "nanban" comes up three times today. You finally understand why that fried fish dish is called what it is called.',
    word: { jp: '南蛮', reading: 'なんばん', zh: '南蛮（旧指西洋）', en: 'nanban (an old word for the West)' }
  },
  {
    subject: 'nihonshi',
    zh: '老师讲到一九九五年。他讲得很快，快得像在赶路，但讲完之后停了三秒才翻页。',
    en: 'The teacher gets to 1995. He goes through it fast, as if hurrying past, and then waits three seconds before turning the page.',
    word: { jp: '震災', reading: 'しんさい', zh: '震灾', en: 'earthquake disaster' }
  },
  // ---- 化学 ----
  {
    subject: 'kagaku',
    zh: '实验课。你的护目镜有一道划痕，正好在右眼前面。你换了三次角度，最后放弃了。',
    en: 'Lab session. Your goggles have a scratch directly in front of your right eye. You try three angles and give up.',
    word: { jp: '実験', reading: 'じっけん', zh: '实验', en: 'experiment' },
    scene: 'school_science_lab'
  },
  {
    subject: 'kagaku',
    zh: '同组的人把烧杯递过来的时候没说话，只是把它往你这边推了两厘米。你接住了。合作有时候不需要语言。',
    en: 'Your lab partner does not say anything when they pass the beaker, just pushes it two centimetres your way. You take it. Cooperation does not always need words.',
    word: { jp: '器具', reading: 'きぐ', zh: '器材', en: 'equipment' },
    scene: 'school_science_lab'
  },
  {
    subject: 'kagaku',
    zh: '整间实验室都是一股鸡蛋放坏了的味道。老师说这是正常的。没有人相信他。',
    en: 'The whole lab smells of eggs that have gone off. The teacher says this is normal. Nobody believes him.',
    word: { jp: '匂い', reading: 'におい', zh: '气味', en: 'smell' },
    scene: 'school_science_lab'
  },
  // ---- 体育 ----
  {
    subject: 'taiiku',
    zh: '体育课跑了八圈。跑到第六圈的时候你想起自己昨天晚上没吃饭。',
    en: 'Eight laps in PE. On the sixth you remember you did not eat dinner last night.',
    word: { jp: '走る', reading: 'はしる', zh: '跑', en: 'to run' },
    scene: 'gym'
  },
  {
    subject: 'taiiku',
    zh: '分组的时候没有人叫你，也没有人不叫你。你就那么被分进了一边，像水自己找地方流。',
    en: 'Nobody picks you when the teams are made. Nobody leaves you out either. You end up on a side the way water ends up somewhere.',
    word: { jp: 'チーム', zh: '队伍', en: 'team' },
    scene: 'gym'
  },
  {
    subject: 'taiiku',
    zh: '体育馆的地板上有几十条不同颜色的线。你花了整节课想搞清楚哪几条是这项运动的。',
    en: 'There are dozens of coloured lines on the gym floor. You spend the whole period trying to work out which ones belong to this sport.',
    word: { jp: '線', reading: 'せん', zh: '线', en: 'line' },
    scene: 'gym'
  },
  // ---- 美術 ----
  {
    subject: 'bijutsu',
    zh: '静物写生。桌子中间摆着一个瓶子和三个柿子。你画了四十分钟，画出来的柿子有点像土豆。',
    en: 'Still life. A bottle and three persimmons in the middle of the table. Forty minutes later your persimmons look somewhat like potatoes.',
    word: { jp: '柿', reading: 'かき', zh: '柿子', en: 'persimmon' },
    scene: 'art_room'
  },
  {
    subject: 'bijutsu',
    zh: '美术老师从你背后走过，停了两秒，什么也没说就走了。你到现在也不知道那两秒是什么意思。',
    en: 'The art teacher walks past behind you, stops for two seconds, says nothing and moves on. You still do not know what those two seconds meant.',
    word: { jp: '黙る', reading: 'だまる', zh: '沉默', en: 'to stay silent' },
    scene: 'art_room'
  },
  {
    subject: 'bijutsu',
    zh: '今天教水墨。老师说「線は一回しか引けない」——线只能画一次。你把这句话记在了笔记本的最后一页。',
    en: 'Ink painting today. The teacher says a line can only be drawn once. You write that on the last page of your notebook.',
    word: { jp: '一回', reading: 'いっかい', zh: '一次', en: 'once' },
    scene: 'art_room'
  },
  // ---- 家庭科 ----
  {
    subject: 'katei',
    zh: '家政课在教缝纽扣。你缝了四遍，前三遍都把布缝在了一起。',
    en: 'Home ec: sewing on a button. You do it four times. The first three times you sew the cloth shut.',
    word: { jp: 'ボタン', zh: '纽扣', en: 'button' }
  },
  {
    subject: 'katei',
    zh: '老师说味噌汤的味噌不能煮开。你想起隔壁那位好像也说过一模一样的话。',
    en: 'The teacher says you must not let miso boil. You remember someone next door saying exactly the same thing.',
    word: { jp: '沸騰', reading: 'ふっとう', zh: '沸腾', en: 'to boil' }
  },
  // ---- 补的量：英语一年要上四十一次，只有三段的话玩家会看十四遍 ----
  {
    subject: 'eigo',
    zh: '老师放了一段听力。是伦敦口音。全班一片沉默，只有你在心里想：这个人说话有点含糊。',
    en: 'The teacher plays a listening exercise. London accent. The room goes silent, and the only thought in your head is that this person mumbles.',
    word: { jp: '訛り', reading: 'なまり', zh: '口音', en: 'accent' }
  },
  {
    subject: 'eigo',
    zh: '有人举手问 "How are you" 一定要回 "I am fine" 吗。老师说不一定。你在座位上点了很久的头。',
    en: 'Somebody asks whether "how are you" has to be answered with "I am fine". The teacher says not necessarily. You nod at your desk for quite a while.',
    word: { jp: '必ず', reading: 'かならず', zh: '一定', en: 'without fail' }
  },
  {
    subject: 'eigo',
    zh: '同桌把作文推过来，指着一处问对不对。你看了三秒，说对的。他不信，去问了老师。老师说对的。',
    en: 'The person next to you slides an essay over and points at a line. Three seconds and you say it is fine. He does not believe you and asks the teacher. The teacher says it is fine.',
    word: { jp: '正しい', reading: 'ただしい', zh: '正确的', en: 'correct' }
  },
  {
    subject: 'eigo',
    zh: '黑板上抄了一句谚语，下面用假名标了读音。你盯着那行假名看了很久，第一次觉得英语很陌生。',
    en: 'A proverb goes up on the board with the pronunciation written under it in kana. You look at that row of kana for a long time and English feels unfamiliar for the first time.',
    word: { jp: 'ことわざ', zh: '谚语', en: 'proverb' }
  },
  {
    subject: 'eigo',
    zh: '老师叫你起来读，读完补了一句「發音がいいね」。全班转过来看你。你坐下的时候耳朵是热的。',
    en: 'The teacher has you read and adds that your pronunciation is good. The whole class turns round. Your ears are hot by the time you sit down.',
    word: { jp: '発音がいい', zh: '发音好', en: 'good pronunciation' }
  },
  {
    subject: 'kokugo',
    zh: '老师念到一个词停下来，问全班有没有人知道意思。没人举手。他自己讲了三分钟，讲得很高兴。',
    en: 'The teacher stops on a word and asks if anyone knows what it means. No hands. He explains it himself for three minutes, and enjoys it.',
    word: { jp: '意味', reading: 'いみ', zh: '意思', en: 'meaning' }
  },
  {
    subject: 'kokugo',
    zh: '汉字听写。你写的字全对，笔顺全错。老师从你背后走过去的时候什么也没说。',
    en: 'Kanji dictation. Every character correct, every stroke order wrong. The teacher walks past behind you and says nothing.',
    word: { jp: '筆順', reading: 'ひつじゅん', zh: '笔顺', en: 'stroke order' }
  },
  {
    subject: 'kokugo',
    zh: '一整节课都在讲一个「けり」。你到下课都没搞清楚它为什么这么重要。前排有人也没搞清楚。',
    en: 'A whole period on the particle "keri". You still do not understand why it matters by the bell. Neither, from the look of it, does the person in front of you.',
    word: { jp: '助動詞', reading: 'じょどうし', zh: '助动词', en: 'auxiliary verb' }
  },
  {
    subject: 'suugaku',
    zh: '老师写了半黑板，写到一半停下来，退后看了看，把最上面那一行擦了。全班没有人问为什么。',
    en: 'The teacher fills half the board, stops, steps back to look, and rubs out the top line. Nobody asks why.',
    word: { jp: '消す', reading: 'けす', zh: '擦掉', en: 'to erase' }
  },
  {
    subject: 'suugaku',
    zh: '有人问这个学了以后有什么用。老师说没什么用。全班笑了，那个人也笑了，然后大家继续算。',
    en: 'Somebody asks what this is good for. The teacher says nothing much. The class laughs, the asker laughs, and everyone goes back to working it out.',
    word: { jp: '役に立つ', reading: 'やくにたつ', zh: '有用', en: 'to be useful' }
  },
  {
    subject: 'suugaku',
    zh: '你的答案和黑板上不一样。你检查了两遍，是黑板错了。你举手举到一半又放下了。',
    en: 'Your answer does not match the board. You check twice. The board is wrong. Your hand goes halfway up and comes back down.',
    word: { jp: '間違い', reading: 'まちがい', zh: '错误', en: 'a mistake' }
  },
  {
    subject: 'nihonshi',
    zh: '讲到战国。老师讲得比平时快，板书也潦草，看得出他喜欢这一段。',
    en: 'The Warring States period. He goes faster than usual and his handwriting on the board gets loose. It is obvious he likes this part.',
    word: { jp: '戦国', reading: 'せんごく', zh: '战国', en: 'the Warring States period' }
  },
  {
    subject: 'nihonshi',
    zh: '课本上那张老照片是黑白的，拍的是这一带的港口。你把它和窗外对了一下，房子全换了，山没换。',
    en: 'The old photograph in the textbook is black and white, and it is this harbour. You hold it up against the window. Every building has changed. The mountain has not.',
    word: { jp: '写真', reading: 'しゃしん', zh: '照片', en: 'photograph' }
  },
  {
    subject: 'nihonshi',
    zh: '老师问有没有人去过生田神社。举手的人比你想的多。他说那你们脚下踩的东西比课本老。',
    en: 'The teacher asks who has been to Ikuta Shrine. More hands go up than you expected. He says in that case what you have been standing on is older than the textbook.',
    word: { jp: '古い', reading: 'ふるい', zh: '古老的', en: 'old' }
  },
  {
    subject: 'taiiku',
    zh: '排球。你的手臂被砸红了一片。下课的时候有人递给你一瓶冰的运动饮料，没说是谁买的。',
    en: 'Volleyball. One forearm comes out red. At the bell somebody hands you a cold sports drink without saying who paid for it.',
    word: { jp: '差し入れ', reading: 'さしいれ', zh: '慰劳的东西', en: 'a little something brought for someone' },
    scene: 'gym'
  },
  {
    subject: 'taiiku',
    zh: '下雨，改在体育馆做柔软体操。全班一起做，动作全都对不上，广播里的音乐一直在放。',
    en: 'Rain, so it is stretches in the gym instead. The whole class does them together and none of them line up. The music on the tannoy keeps going regardless.',
    word: { jp: '柔軟', reading: 'じゅうなん', zh: '柔软（体操）', en: 'stretching' },
    scene: 'gym'
  },
  {
    subject: 'bijutsu',
    zh: '你把调色盘洗干净了才发现下节还是美术。旁边那个人笑了很久，然后把自己的挤了一半给你。',
    en: 'You wash your palette clean and only then find out the next period is art as well. The person beside you laughs for a while, then squeezes half of theirs onto yours.',
    word: { jp: 'パレット', zh: '调色盘', en: 'palette' },
    scene: 'art_room'
  },
  {
    subject: 'katei',
    zh: '今天量了每个人的手掌。老师说这是为了知道自己的一把米是多少。你的一把比标准少了一点。',
    en: 'Today everyone measures their own palm. The teacher says it is so you know what one handful of rice means for you. Yours is slightly under.',
    word: { jp: '一握り', reading: 'ひとにぎり', zh: '一把', en: 'a handful' }
  }
];

// ---------------------------------------------------------
// 小测
//
// right 永远写在第一个，构建脚本时按日期打乱顺序——
// 不打乱的话玩家两天就发现"选第一个"永远对。
// ---------------------------------------------------------
export interface QuizAnswer { zh: string; en: string; jp?: string }

export interface Quiz {
  subject: string;
  id: string;
  promptZh: string;
  promptEn: string;
  right: QuizAnswer;
  wrong: QuizAnswer[];
  afterZh: string;
  afterEn: string;
  word?: StoryWord;
}

export const QUIZZES: Quiz[] = [
  {
    subject: 'kokugo', id: 'q_keigo',
    promptZh: '小测第三题：「先生が来ます」要改成尊敬语，该怎么说？',
    promptEn: 'Question three: put "sensei ga kimasu" into honorific form.',
    right: { jp: '先生がいらっしゃいます', zh: '先生がいらっしゃいます', en: 'Sensei ga irasshaimasu' },
    wrong: [
      { jp: '先生が参ります', zh: '先生が参ります', en: 'Sensei ga mairimasu' },
      { jp: '先生が来られました', zh: '先生が来られました', en: 'Sensei ga koraremashita' }
    ],
    afterZh: 'いらっしゃる 一个词同时是「来る」「行く」「いる」三个词的尊敬语。你觉得这不太公平。',
    afterEn: 'Irassharu is the honorific of "come", "go" and "be", all three at once. You feel this is somewhat unfair.',
    word: { jp: 'いらっしゃる', zh: '（尊敬语）来／去／在', en: '(honorific) to come / go / be' }
  },
  {
    subject: 'kokugo', id: 'q_counter',
    promptZh: '小测：数兔子用哪个量词？',
    promptEn: 'Quick test: which counter do you use for rabbits?',
    right: { jp: '一羽（いちわ）', zh: '一羽（いちわ）', en: 'ichi-wa' },
    wrong: [
      { jp: '一匹（いっぴき）', zh: '一匹（いっぴき）', en: 'ippiki' },
      { jp: '一頭（いっとう）', zh: '一頭（いっとう）', en: 'ittou' }
    ],
    afterZh: '数鸟用的量词。老师说这是因为以前的和尚想吃兔子，就宣布兔子算鸟。全班一片哗然。',
    afterEn: 'The counter for birds. The teacher explains that monks who wanted to eat rabbit declared rabbits to be birds. The class reacts loudly.',
    word: { jp: '数え方', reading: 'かぞえかた', zh: '数法、量词', en: 'way of counting' }
  },
  {
    subject: 'nihonshi', id: 'q_kobe_port',
    promptZh: '小测：神户开港是哪一年？',
    promptEn: 'Quick test: in what year did the port of Kobe open?',
    right: { zh: '1868 年', en: '1868' },
    wrong: [
      { zh: '1853 年', en: '1853' },
      { zh: '1895 年', en: '1895' }
    ],
    afterZh: '同一年江户改名东京。老师说这一年日本换了一次骨头。',
    afterEn: 'The same year Edo was renamed Tokyo. The teacher says that year the country changed its bones.',
    word: { jp: '開港', reading: 'かいこう', zh: '开港', en: 'opening of a port' }
  },
  {
    subject: 'nihonshi', id: 'q_ikuta',
    promptZh: '小测：生田神社的名字据说和什么有关？',
    promptEn: 'Quick test: what is the name Ikuta Shrine said to relate to?',
    right: { zh: '「活田」——能活的田地', en: 'Living fields' },
    wrong: [
      { zh: '一位叫生田的将军', en: 'A general named Ikuta' },
      { zh: '生丝的产地', en: 'A place that produced raw silk' }
    ],
    afterZh: '老师顺口说，神户这个地名也来自神社——「神戸（かんべ）」，供奉神社的那些人家。',
    afterEn: 'The teacher adds that the name Kobe also comes from a shrine: kanbe, the households that served it.',
    word: { jp: '由来', reading: 'ゆらい', zh: '由来', en: 'origin (of a name)' }
  },
  {
    subject: 'kagaku', id: 'q_mol',
    promptZh: '小测：一摩尔任何物质，含有多少个粒子？',
    promptEn: 'Quick test: how many particles are in one mole of anything?',
    right: { zh: '约 6.02 × 10²³ 个', en: 'About 6.02 × 10²³' },
    wrong: [
      { zh: '约 3.14 × 10²³ 个', en: 'About 3.14 × 10²³' },
      { zh: '取决于是什么物质', en: 'It depends on the substance' }
    ],
    afterZh: '你答对了，但你答对的原因是这个数字全世界都一样。这大概是化学最友好的地方。',
    afterEn: 'You get it right, and the reason you get it right is that this number is the same everywhere. That is probably the friendliest thing about chemistry.',
    word: { jp: '物質', reading: 'ぶっしつ', zh: '物质', en: 'substance' }
  },
  {
    subject: 'eigo', id: 'q_english',
    promptZh: '英语小测最后一题：「I have been to Kobe」和「I have gone to Kobe」区别在哪？',
    promptEn: 'Last question on the English test: what is the difference between "I have been to Kobe" and "I have gone to Kobe"?',
    right: { zh: '前者去过又回来了，后者去了还没回来', en: 'The first means you went and came back; the second means you are still there' },
    wrong: [
      { zh: '没有区别，只是两种说法', en: 'No difference, just two ways of saying it' },
      { zh: '后者更正式', en: 'The second is more formal' }
    ],
    afterZh: '写完之后你看着这两句话愣了一会儿。你自己现在算哪一种，你也不确定。',
    afterEn: 'You look at the two sentences for a moment after writing. Which one you currently are, you are not sure.',
    word: { jp: '違い', reading: 'ちがい', zh: '区别', en: 'difference' }
  },
  {
    subject: 'suugaku', id: 'q_sin',
    promptZh: '小测：sin 30° 等于多少？',
    promptEn: 'Quick test: what is sin 30°?',
    right: { zh: '1/2', en: '1/2' },
    wrong: [
      { zh: '√3/2', en: '√3/2' },
      { zh: '√2/2', en: '√2/2' }
    ],
    afterZh: '你两秒写完，然后花了剩下的十分钟看窗外。',
    afterEn: 'You write it in two seconds and spend the remaining ten minutes looking out of the window.',
    word: { jp: '角度', reading: 'かくど', zh: '角度', en: 'angle' }
  },
  {
    subject: 'katei', id: 'q_dashi',
    promptZh: '小测：关西的出汁和关东的，最主要的区别是什么？',
    promptEn: 'Quick test: what is the main difference between Kansai and Kanto dashi?',
    right: { zh: '关西用昆布，关东用鲣节，所以关西的颜色浅', en: 'Kansai uses kombu, Kanto uses bonito, so the Kansai one is paler' },
    wrong: [
      { zh: '关西的更咸', en: 'The Kansai one is saltier' },
      { zh: '关西不用出汁', en: 'Kansai does not use dashi' }
    ],
    afterZh: '老师说，同一碗乌冬，在这边汤是清的，过了名古屋就变黑了。全班有人点头点得很用力。',
    afterEn: 'The teacher says the same bowl of udon has clear broth here and black broth past Nagoya. Somebody nods extremely hard.',
    word: { jp: '出汁', reading: 'だし', zh: '高汤', en: 'dashi stock' }
  }
];

// ---------------------------------------------------------
// 教室事件
//
// 这一类才给选项、才动关系。条件是**那个人得在你班上、而且你认识她**。
// 明日香、光、丽、真希是同班；昴是隔壁班但会来串门；
// 稻荷、深雪、奈绪不在学校，所以这里没有她们的戏。
// ---------------------------------------------------------
export interface ClassEventDef {
  id: string;
  subject?: string;      // 不写 = 哪节课都可能
  char: string;          // CharacterId 的字符串值
  minFamiliarity?: number;
  titleZh: string;
  titleEn: string;
  // 用 buildClassScript 组装，这里只放正文
  introZh: string;
  introEn: string;
  sprite?: string;
  promptZh: string;
  promptEn: string;
  options: {
    id: string;
    labelZh: string; labelEn: string; jp?: string;
    hintZh?: string; hintEn?: string;
    familiarity?: number; affection?: number;
    reasonZh: string; reasonEn: string;
    thenZh: string; thenEn: string;
    word?: StoryWord;
  }[];
}

export const CLASS_EVENTS: ClassEventDef[] = [
  {
    id: 'cls_asuka_note',
    char: 'asuka',
    minFamiliarity: 40,
    titleZh: '第二节课', titleEn: 'Second Period',
    introZh: '一张对折的纸从右边推过来，停在你的笔袋旁边。上面只有一行字：「38 ページ、あなたのところ」。',
    introEn: 'A folded piece of paper slides in from the right and stops beside your pencil case. One line on it: page 38, your part.',
    sprite: 'asuka/serious.webp',
    promptZh: '你抬头。老师正在看这边。',
    promptEn: 'You look up. The teacher is looking this way.',
    options: [
      {
        id: 'read_it',
        labelZh: '翻到 38 页，站起来念',
        labelEn: 'Turn to page 38 and stand up to read',
        jp: '……はい。三十八ページ。',
        hintZh: '她救了你，那就别浪费', hintEn: 'She saved you. Do not waste it.',
        familiarity: 4, affection: 2,
        reasonZh: '你没有装作不知道，也没有谢她——这两件事她都注意到了',
        reasonEn: 'You neither pretended not to notice nor thanked her, and she registered both',
        thenZh: '你念完坐下。右边那个人一直没有转过头来，但耳朵是红的。',
        thenEn: 'You finish and sit down. The person on your right never turns her head, but her ears are red.',
        word: { jp: 'ページ', zh: '页', en: 'page' }
      },
      {
        id: 'thank_first',
        labelZh: '先小声说一句谢谢',
        labelEn: 'Whisper thank you first',
        jp: 'ありがと。',
        hintZh: '老师还在看这边', hintEn: 'The teacher is still looking this way.',
        familiarity: 2, affection: 1,
        reasonZh: '她因为这句话被老师点了名，但她没有生气',
        reasonEn: 'That got her called on by the teacher, and she was not angry about it',
        thenZh: '「そこ、私語」——老师叫的是她的名字，不是你的。她站起来，念完了你那一段。',
        thenEn: 'The teacher says "no talking" and calls her name, not yours. She stands up and reads your part for you.'
      }
    ]
  },
  {
    id: 'cls_hikari_sleep',
    char: 'hikari',
    minFamiliarity: 40,
    titleZh: '第四节课', titleEn: 'Fourth Period',
    introZh: '前面那个人的头一点一点地往下沉，最后停在了课本上。她的笔还握着，笔尖压在同一个字上，已经洇开了一个圈。',
    introEn: 'The head in front of you sinks by degrees until it comes to rest on the textbook. She is still holding her pen, and the nib has been pressing on one character long enough to bleed a circle into the page.',
    sprite: 'hikari/school_sad.webp',
    promptZh: '老师正在往这边走。',
    promptEn: 'The teacher is walking this way.',
    options: [
      {
        id: 'poke',
        labelZh: '用笔杆戳一下她的背',
        labelEn: 'Poke her back with the end of your pen',
        hintZh: '还来得及', hintEn: 'There is still time.',
        familiarity: 5, affection: 2,
        reasonZh: '她醒过来的第一件事是把课本翻到正确的那一页——她知道是谁叫的她',
        reasonEn: 'The first thing she did on waking was turn to the right page. She knew who had woken her',
        thenZh: '她弹起来的动作太大，椅子响了一声。老师停下，看了她两秒，继续往前走了。下课以后她回过头，只说了一句「借りといて」。',
        thenEn: 'She comes up so fast the chair scrapes. The teacher stops, looks at her for two seconds, and walks on. After class she turns round and says only that she owes you one.',
        word: { jp: '借り', reading: 'かり', zh: '欠的人情', en: 'a debt owed' }
      },
      {
        id: 'cover',
        labelZh: '把自己的课本立起来，挡住那个角度',
        labelEn: 'Stand your own textbook up to block the line of sight',
        hintZh: '不叫醒她', hintEn: 'Do not wake her.',
        familiarity: 3, affection: 4,
        reasonZh: '她醒来的时候先看见的是那本立着的书',
        reasonEn: 'The first thing she saw when she woke was that upright book',
        thenZh: '她睡了十一分钟。醒来之后看了看那本立着的课本，又看了看你，然后什么也没问，把书轻轻放平了。',
        thenEn: 'She sleeps for eleven minutes. When she wakes she looks at the standing textbook, then at you, asks nothing, and lays it flat again.'
      }
    ]
  },
  {
    id: 'cls_rei_margin',
    char: 'rei',
    subject: 'nihonshi',
    minFamiliarity: 40,
    titleZh: '日本史', titleEn: 'History',
    introZh: '你旁边那个人的课本边上写满了字，密度是印刷体的两倍。你不小心看清了一行：那不是笔记，是反驳。',
    introEn: 'The margins of the textbook beside you are packed with handwriting at twice the density of the print. You accidentally read one line. Those are not notes. They are rebuttals.',
    sprite: 'rei/neutral.webp',
    promptZh: '她发现你在看。',
    promptEn: 'She notices you looking.',
    options: [
      {
        id: 'ask',
        labelZh: '「这里……写的是课本错了？」',
        labelEn: '"Does that say the textbook is wrong?"',
        jp: 'これ……教科書が間違ってるって意味？',
        hintZh: '她的字很小，但你看懂了那个「が」', hintEn: 'Her writing is tiny, but you made out that "ga".',
        familiarity: 6, affection: 2,
        reasonZh: '很少有人问她在写什么',
        reasonEn: 'Not many people ask her what she is writing',
        thenZh: '「……年号が。」她说，声音低到只有你听得见。「一年、ずれてる。」然后她把课本往你这边推了两厘米，让你看清那一行。',
        thenEn: 'The date, she says, low enough that only you can hear. It is off by a year. Then she pushes the textbook two centimetres your way so you can see the line.',
        word: { jp: 'ずれる', zh: '错位、偏了', en: 'to be off / misaligned' }
      },
      {
        id: 'lookaway',
        labelZh: '把眼睛收回来，装作在看黑板',
        labelEn: 'Look away and pretend to be reading the board',
        hintZh: '那是她的本子', hintEn: 'It is her notebook.',
        familiarity: 2, affection: 1,
        reasonZh: '你没有追问。她记住了这件事',
        reasonEn: 'You did not press. She noticed that',
        thenZh: '下课的时候，那本课本被翻到了那一页，摊在你们两张桌子中间。她没有说话，也没有把它收回去。',
        thenEn: 'At the bell the textbook is open at that page, lying between the two desks. She says nothing, and does not take it back.'
      }
    ]
  },
  {
    id: 'cls_maki_phone',
    char: 'maki',
    minFamiliarity: 40,
    titleZh: '第一节课', titleEn: 'First Period',
    introZh: '后排传来一声非常小、但绝对不属于教室的音效。那是某个游戏的连击音。',
    introEn: 'A very small sound comes from the back row, and it absolutely does not belong in a classroom. It is a combo chime from some game.',
    sprite: 'maki/school_surprised.webp',
    promptZh: '老师抬起头。全班都在装作没听见。',
    promptEn: 'The teacher looks up. The whole class is pretending not to have heard.',
    options: [
      {
        id: 'cough',
        labelZh: '咳嗽一声，正好压过去',
        labelEn: 'Cough, exactly loud enough to cover it',
        hintZh: '时机只有半秒', hintEn: 'The window is about half a second.',
        familiarity: 6, affection: 3,
        reasonZh: '她欠了你一次，而且她讨厌欠人情',
        reasonEn: 'She owes you one now, and she hates owing people',
        thenZh: '老师低头继续讲。三十秒后你的手机震了一下：「バレたら道連れやからな」。',
        thenEn: 'The teacher goes back to the board. Thirty seconds later your phone buzzes: if I go down, you go down with me.',
        word: { jp: '道連れ', reading: 'みちづれ', zh: '拖下水的同伴', en: 'someone dragged down with you' }
      },
      {
        id: 'ignore',
        labelZh: '什么也不做',
        labelEn: 'Do nothing',
        hintZh: '这不是你的事', hintEn: 'Not your problem.',
        familiarity: 1,
        reasonZh: '她自己解决了，但她注意到你连头都没回',
        reasonEn: 'She dealt with it herself, and noticed you did not even turn round',
        thenZh: '老师朝后排走了两步，然后停住，改口说了一句和课文有关的话。你回头的时候，后排那个人正一脸认真地看着黑板。',
        thenEn: 'The teacher takes two steps towards the back, stops, and says something about the text instead. When you look round, the person in the back row is studying the board with enormous sincerity.'
      }
    ]
  },
  {
    id: 'cls_sora_pe',
    char: 'sora',
    subject: 'taiiku',
    minFamiliarity: 40,
    titleZh: '体育课', titleEn: 'PE',
    introZh: '隔壁班和你们一起上体育。分组投篮的时候，有人从后面拍了你的背——力气大到你往前踉跄了半步。',
    introEn: 'The class next door is sharing the period. During shooting practice somebody slaps you on the back hard enough to send you half a step forward.',
    sprite: 'sora/gym_happy.webp',
    promptZh: '「なあ、そこの！ちょっと来て。」',
    promptEn: '"Hey, you there. Come here a second."',
    options: [
      {
        id: 'go',
        labelZh: '过去',
        labelEn: 'Go over',
        jp: '……俺？',
        hintZh: '她指的确实是你', hintEn: 'She does mean you.',
        familiarity: 7, affection: 2,
        reasonZh: '你过去了。对她来说这就够了',
        reasonEn: 'You came over. For her that is the whole test',
        thenZh: '她把球塞给你，退后三步，摊开手。「投げて。フォーム見たいねん。」你投了。球撞在篮板上弹回来，正好砸在她怀里。她笑了很久。',
        thenEn: 'She shoves the ball at you, backs off three paces and holds her hands out. Throw it, she wants to see your form. You throw. It hits the backboard and comes straight back into her arms. She laughs for a long time.',
        word: { jp: 'フォーム', zh: '动作、姿势', en: 'form' }
      },
      {
        id: 'point',
        labelZh: '指指自己',
        labelEn: 'Point at yourself',
        hintZh: '确认一下总没错', hintEn: 'Worth checking.',
        familiarity: 4, affection: 1,
        reasonZh: '她觉得这个反应很好笑',
        reasonEn: 'She found that reaction funny',
        thenZh: '「そう、あんた。他に誰おんねん。」她说这话的时候已经把球扔过来了。你接住了，这件事让你自己也有点意外。',
        thenEn: 'Yes, you, who else is there. She has already thrown the ball while saying it. You catch it, which surprises you as much as anyone.'
      }
    ]
  },
  {
    id: 'cls_asuka_duty',
    char: 'asuka',
    minFamiliarity: 90,
    titleZh: '放学前的十分钟', titleEn: 'The Last Ten Minutes',
    introZh: '值日表上今天写着两个名字。一个是你的，另一个的笔迹比印刷体还整齐。',
    introEn: 'Two names on the rota today. One is yours. The other is written more neatly than the printing.',
    sprite: 'asuka/neutral.webp',
    promptZh: '她已经在擦黑板了。她够不到最上面那一行。',
    promptEn: 'She has already started on the board. She cannot reach the top line.',
    options: [
      {
        id: 'reach',
        labelZh: '什么也不说，把上面那行擦掉',
        labelEn: 'Say nothing and wipe the top line',
        hintZh: '她不会开口要人帮忙', hintEn: 'She is not going to ask.',
        familiarity: 5, affection: 5,
        reasonZh: '她最讨厌的是被问「要不要帮忙」',
        reasonEn: 'The thing she hates most is being asked whether she needs help',
        thenZh: '她停了半秒，然后继续擦下面那半块，一个字也没说。走出教室的时候她说：「明日も同じ時間。」',
        thenEn: 'She pauses for half a second, then carries on with the lower half without a word. On the way out she says: same time tomorrow.',
        word: { jp: '日直', reading: 'にっちょく', zh: '值日', en: 'daily duty' }
      },
      {
        id: 'offer',
        labelZh: '「上面那行我来吧？」',
        labelEn: '"Shall I get the top?"',
        jp: '上、やろうか？',
        hintZh: '礼貌一点总没错', hintEn: 'Politeness is rarely wrong.',
        familiarity: 3, affection: 2,
        reasonZh: '她说了不用，然后搬了椅子',
        reasonEn: 'She said she did not need it, and then fetched a chair',
        thenZh: '「結構よ。」她搬了张椅子踩上去，擦完了最上面那行。下来的时候她扶了一下桌子，你伸出去的手停在半空，最后收了回来。',
        thenEn: 'No thank you. She fetches a chair, stands on it and does the top line herself. Getting down she steadies herself on a desk; your hand goes out, stops in mid-air, and comes back.'
      }
    ]
  }
];
