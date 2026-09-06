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
  // 一节课分三拍：坐下、课中、铃响。
  //
  // 以前一段速写只有一句旁白，四十五分钟的课被压成一行字，
  // 读起来像课程表的备注而不是一节课。
  // 现在 zh/en 是第一拍，mid 是课中那一段（最长，梗和生词都在这儿），
  // end 是下课的那一下。mid 和 end 不写的话就退回单句，
  // 所以旧的条目不会坏。
  zh: string;
  en: string;
  midZh?: string; midEn?: string;
  endZh?: string; endEn?: string;
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
    midZh: '习惯了之后你发现一件事：竖着写的时候，一句话是往下掉的，不是往前跑的。同样一句「今日は晴れです」，横着看是一条线，竖着看像是从屋檐上滴下来的水。你不知道这个感觉算不算数，反正你有了。', midEn: 'Once you had got used to it you noticed something. Written downwards, a sentence falls rather than runs. The same simple line about the weather being fine reads as a line horizontally and as water coming off an eave vertically. You had no idea whether that counted as an observation. You had it anyway.',
    endZh: '下课的时候你把自己的笔记也竖着写了一行，写完发现字全都歪向左边，像是被风吹的。你把那页折了个角。', endEn: 'At the bell you wrote one line of your own notes downwards. All the characters leaned left, as though blown that way. You turned the corner of the page down.',
    word: { jp: '縦書き', reading: 'たてがき', zh: '竖写', en: 'vertical writing' }
  },
  {
    subject: 'kokugo',
    zh: '今天读的是一首和歌。你一个字也没听懂，但老师念到一半停了一下，全班都笑了。你也笑了，慢了半拍。',
    en: 'Today it is a waka. You understand none of it, but the teacher pauses halfway and the whole class laughs. You laugh too, half a beat late.',
    midZh: '老师又念了一遍，这次慢得多。你还是没听懂，但听出了它是有拍子的——五个音，七个音，再五个音，像是有人在数着步子走路。你忽然明白为什么这东西能背一千年：它本来就是拿来记住的，不是拿来看懂的。', midEn: 'He read it again, much more slowly. You still did not understand it, but you heard that it had a beat: five sounds, then seven, then five, like somebody counting their own steps. It occurred to you why a thing like that survives a thousand years. It was made to be remembered, not to be understood.',
    endZh: '笑过的那一下你其实有点在意。回去以后你把那首查了出来，是讲一个人等另一个人的。笑点在哪儿你还是没找到。', endEn: 'The laugh had bothered you slightly. Later you looked the poem up. It is about somebody waiting for somebody else. You still could not find the joke.',
    word: { jp: '和歌', reading: 'わか', zh: '和歌', en: 'waka (classical poem)' }
  },
  {
    subject: 'kokugo',
    zh: '「これ、古文だから現代語じゃないぞ」——老师说这句话的时候看了你一眼。你不确定那是照顾还是提醒。',
    en: 'The teacher says this is classical Japanese, not the modern language, and looks at you while saying it. You cannot tell if that was kindness or a warning.',
    midZh: '他大概是看你翻字典翻得太用力了。古文这东西对全班都是外语，区别只在于别人是外语里的外语，你是外语里的外语的外语。这么一想反而轻松了不少。', midEn: 'He had probably noticed how hard you were going at the dictionary. Classical Japanese is a foreign language to the whole room; the only difference is that for everybody else it is a foreign language, and for you it is a foreign language inside a foreign language. Oddly, thinking of it that way made it easier.',
    endZh: '下课他路过你桌边，把一本薄薄的古文助词表放在了你的课本上，没说话就走了。你翻开看了一眼，上面全是假名，一个汉字都没有。', endEn: 'On his way past your desk at the end he put a thin table of classical particles on top of your textbook and went on without saying anything. You opened it. All kana, not one kanji.',
    word: { jp: '古文', reading: 'こぶん', zh: '古文', en: 'classical Japanese' }
  },
  {
    subject: 'kokugo',
    zh: '默写。你写的字被自己越写越小，最后一行几乎缩成了一条线。',
    en: 'Dictation. Your characters get smaller as you go, until the last line is nearly a single stroke.',
    midZh: '写小是有原因的：写得越大越看得出哪一笔是编的。你有三个汉字完全不确定，于是把它们挤在一起，指望老师看不清。这个策略你从小学就在用，换了个国家居然还能用。', midEn: 'There was a reason for that. The larger you write, the more obvious it is which strokes you invented. There were three characters you were not sure of at all, so you squeezed them together and hoped nobody would look closely. It was a strategy you had been using since primary school, and it turned out to travel.',
    endZh: '发回来的时候那三个字全被圈了，旁边写着「惜しい」。你查了一下这个词：可惜。也就是说，差一点。', endEn: 'When it came back all three were circled, with one word beside them. You looked it up: a shame. Meaning, in other words, that you had been close.',
    word: { jp: '書き取り', reading: 'かきとり', zh: '默写', en: 'dictation' }
  },
  // ---- 数学 ----
  {
    subject: 'suugaku',
    zh: '数学是唯一一门你完全跟得上的课。符号不需要翻译。你有点想为这件事道歉，又不知道该跟谁道歉。',
    en: 'Maths is the only lesson you follow completely. Symbols do not need translating. You feel vaguely like apologising for this, without knowing to whom.',
    midZh: '老师讲到一半停下来问有没有人不懂。没有人举手，包括你。这大概是你在这个教室里第一次和所有人处在同一个位置上——不是因为你厉害，是因为这门课本来就不歧视谁听不懂日语。', midEn: 'Halfway through he stopped and asked whether anybody was lost. Nobody put a hand up, yourself included. It was probably the first time in that room you had been in the same position as everybody else, not because you were good at it but because this particular subject does not care how much Japanese you have.',
    endZh: '下课以后你在草稿纸背面又算了一遍那道题，用的是你自己国家学的写法。答案一样，过程不一样。你把两种写法并排放在一起看了一会儿。', endEn: 'After the bell you did the question again on the back of the scratch paper, the way you had been taught at home. Same answer, different working. You looked at the two of them side by side for a while.',
    word: { jp: '記号', reading: 'きごう', zh: '符号', en: 'symbol' }
  },
  {
    subject: 'suugaku',
    zh: '老师点名叫人上去解题。黑板前的人捏着粉笔僵立了良久，终于唰唰写出了步骤与答案。全班静得落针可闻。',
    en: 'Someone is called to the board. They hesitate with the chalk for a long time, then write out the working and answer. Nobody makes a sound.',
    midZh: '那段时间里全班都在等，但没有人催，也没有人小声说话。你数了一下自己的心跳，发现比站在黑板前那位还快。你不知道这算是共情还是纯粹的紧张。', midEn: 'For that time the whole room waited, and nobody hurried him and nobody whispered. You checked your own pulse and found it going faster than his probably was. You could not tell whether that was empathy or straightforward nerves.',
    endZh: '他写完回座位，路过你旁边的时候呼了一口气，很长的一口。那口气比刚才那道题告诉你的东西多。', endEn: 'He finished and came back past your desk, letting out a breath on the way, a long one. That breath told you more than the question had.',
    word: { jp: '解く', reading: 'とく', zh: '解（题）', en: 'to solve' }
  },
  {
    subject: 'suugaku',
    zh: '你发现这边写除法的符号跟你从小写的不一样。你盯着那个符号看了很久，最后决定不问。',
    en: 'You notice the division sign here is not the one you grew up writing. You stare at it for a while and decide not to ask.',
    midZh: '不问的理由不是不好意思。是因为你忽然意识到，如果连除号都可以不一样，那还有多少东西是你以为全世界都一样、其实只是你那边一样的。这个念头比那道题难多了。', midEn: 'It was not embarrassment that stopped you. It was that it suddenly occurred to you: if even the division sign can differ, how many other things had you assumed were universal that were merely local to where you came from. That question was considerably harder than the one on the board.',
    endZh: '你在笔记本最后一页开了一个新的清单，标题是「原来不是全世界都一样的东西」。第一条就是除号。', endEn: 'You started a new list on the last page of your notebook, headed things I had assumed were universal. The division sign went in as number one.',
    word: { jp: '割り算', reading: 'わりざん', zh: '除法', en: 'division' }
  },
  {
    subject: 'suugaku',
    zh: '第二排有人在算草稿纸背面画画。老师走过去，看了一眼，什么也没说就走了。',
    en: 'Someone in the second row is drawing on the back of their scratch paper. The teacher walks over, looks, and moves on without saying anything.',
    midZh: '你伸长脖子看了一眼那张纸。画的是老师，画得相当好，而且相当不客气——头发的方向抓得很准。老师刚才那一眼肯定看见了。', midEn: 'You craned over for a look. It was the teacher, drawn well, and drawn without mercy. Whoever it was had the hair exactly right. He had certainly seen it.',
    endZh: '下课以后那张纸被撕下来传了半个教室。传到你手上的时候你也笑了，然后规规矩矩地传给了下一个人。', endEn: 'After the bell the sheet came off the pad and went round half the room. When it reached you, you laughed too, and then passed it on properly to the next person.',
    word: { jp: '落書き', reading: 'らくがき', zh: '涂鸦', en: 'doodle' }
  },
  // ---- 英語 ----
  {
    subject: 'eigo',
    zh: '英语课上老师念了一段课文，全班安静得可怕。然后他叫了你。你念完之后，教室里有一种非常复杂的沉默。',
    en: 'The teacher reads a passage aloud and the class goes alarmingly quiet. Then he calls on you. When you finish there is a very complicated silence.',
    midZh: '那种沉默里有惊讶，有一点「原来是这样念的」，还有一点你说不清的东西。老师让你再念一遍，这次全班都在跟着小声念。你念得很慢，慢到自己都觉得奇怪。', midEn: 'There was surprise in that silence, and a little of so that is how it goes, and something else you could not name. He asked you to read it again, and this time the whole room read along under its breath. You went slowly, slowly enough that it felt strange to you as well.',
    endZh: '下课有三个人过来问你某个词到底怎么念。你念了，他们跟着念。你忽然发现自己在教书，而且是用日语解释英语，这个组合你从来没想过。', endEn: 'Three people came over afterwards to ask how a particular word actually goes. You said it, they said it after you. It came to you that you were teaching, and teaching English through Japanese, a combination that had never once occurred to you.',
    word: { jp: '発音', reading: 'はつおん', zh: '发音', en: 'pronunciation' }
  },
  {
    subject: 'eigo',
    zh: '英语是你一周里唯一一节不用努力的课。你趴在桌上，听满教室的人用一种小心翼翼的语调，念你从小说到大的句子。',
    en: 'English is the one period in the week you do not have to work at. You put your head down and listen to a whole room saying, very carefully, sentences you grew up in.',
    midZh: '他们念得很认真，认真到每个词之间都留了一点空。你听着听着开始想：自己念日语的时候，在别人耳朵里大概也是这样的——一个词一个词往外搬，中间留着空。这么一想就趴不住了。', midEn: 'They read carefully, carefully enough to leave a small gap between every word. Listening to it you began to think that this is probably how your Japanese sounds to everybody else: one word carried out at a time, with gaps. After that you could not lie there comfortably any more.',
    endZh: '你坐直了，跟着念了两句。念完发现自己的声音在这间教室里听起来居然有点陌生。', endEn: 'You sat up and read a couple of lines along with them. Afterwards you noticed that your own voice sounded slightly unfamiliar in that room.',
    word: { jp: '楽', reading: 'らく', zh: '轻松', en: 'easy / a relief' }
  },
  {
    subject: 'eigo',
    zh: '你想帮邻座改一个介词，手伸到一半又收回来了。这不是你的教室，至少现在还不是。',
    en: 'You start to reach over and fix a preposition for the person next to you, then take your hand back. This is not your classroom. Not yet.',
    midZh: '他那个 in 其实应该是 on。你盯着那两个字母看了整整半节课，看到最后你甚至开始怀疑自己——毕竟你已经在一个所有直觉都不作数的地方待了一阵子了。', midEn: 'His in should have been an on. You looked at those two letters for the better part of the period, and by the end you had started to doubt yourself, having spent some time now in a place where none of your instincts count.',
    endZh: '发回来的时候那个 in 被红笔圈了。他转过头小声问你「これ、なんで？」。你解释了。解释得很烂，但他听懂了。', endEn: 'It came back with the in circled in red. He turned round and asked, quietly, why. You explained. You explained it badly. He understood.',
    word: { jp: '直す', reading: 'なおす', zh: '改正', en: 'to correct' }
  },
  // ---- 日本史 ----
  {
    subject: 'nihonshi',
    zh: '讲到神户开港。老师说了一个一八六八，你在笔记本边上写下来——外公的手账里也有这个数字。',
    en: 'The lesson reaches the opening of the port of Kobe. The teacher says 1868 and you write it in the margin. That number is in your grandfather’s journal too.',
    midZh: '他讲的是这座港口打开之后进来的那些东西：面包、洋服、咖啡、还有山上那一片洋馆。你今天早上就是从那片洋馆中间走下来的，走的时候完全没想过它们是怎么来的。', midEn: 'He talked about what came in once the port opened: bread, western clothes, coffee, and that patch of foreign houses up the hill. You had walked down through those houses this morning without once wondering how they got there.',
    endZh: '下课以后你翻开手账查那一条。外公写的不是开港，是「パン屋、まだある」。面包店，还在。你合上本子，决定回去的路上绕一段。', endEn: 'Afterwards you looked the entry up. What your grandfather had written was not about the port. It said: bakery, still there. You closed the journal and decided to go round the long way home.',
    word: { jp: '開港', reading: 'かいこう', zh: '开港', en: 'opening of a port' }
  },
  {
    subject: 'nihonshi',
    zh: '「南蛮」这个词今天出现了三次。你终于明白为什么那道炸鱼要叫南蛮渍了。',
    en: 'The word "nanban" comes up three times today. You finally understand why that fried fish dish is called what it is called.',
    midZh: '老师说这个词本来是指从南边海上来的人，后来变成了泛指西洋，再后来变成了一道菜的名字。一个词从地理走到料理，中间隔了四百年，而现在它就躺在食堂的菜单上。', midEn: 'The word had originally meant the people who came from the southern sea, he said, then came to mean the West in general, and finally became the name of a dish. A word had walked from geography into cookery over four centuries, and now it was lying there on the cafeteria menu.',
    endZh: '中午你特意去看了一眼菜单。南蛮渍，四百二十円。你买了。', endEn: 'At lunch you went and looked at the menu on purpose. Nanban-zuke. You bought it.',
    word: { jp: '南蛮', reading: 'なんばん', zh: '南蛮（旧指西洋）', en: 'nanban (an old word for the West)' }
  },
  {
    subject: 'nihonshi',
    zh: '老师讲到一九九五年。他语速飞快，快得像在急匆匆赶路，但合上教案前却忽然陷入了长长的沉默。',
    en: 'The teacher gets to 1995. He goes through it fast, as if hurrying past, and then lapses into a long quiet before closing his notes.',
    midZh: '教室里那几秒钟非常安静。你环顾了一圈，发现没有人在做笔记，也没有人在看手机。这个班上大概有一半人的父母当时就在这座城市里。', midEn: 'The room was very quiet for those seconds. You looked around and found that nobody was taking notes and nobody was on a phone. Probably half the parents of that class had been in this city at the time.',
    endZh: '翻过页以后他的语速就恢复正常了。整节课他再没有回头提过那一年。', endEn: 'After he turned the page his pace went back to normal. He did not return to that year for the rest of the lesson.',
    word: { jp: '震災', reading: 'しんさい', zh: '震灾', en: 'earthquake disaster' }
  },
  // ---- 化学 ----
  {
    subject: 'kagaku',
    zh: '实验课。你的护目镜有一道划痕，正好在右眼前面。你换了三次角度，最后放弃了。',
    en: 'Lab session. Your goggles have a scratch directly in front of your right eye. You try three angles and give up.',
    midZh: '放弃之后反而好办了：你干脆闭上右眼，用左眼看。同组那位注意到了，什么也没说，把自己的护目镜推了过来，然后拿走了你那副。他戴上以后也开始眯眼。', midEn: 'Giving up made it simpler: you shut the right eye and used the left. Your partner noticed, said nothing, pushed his own goggles across and took yours. Once he had them on he started squinting too.',
    endZh: '整节课你们两个谁都没提这件事。收器材的时候他把那副划痕的又放回了公用箱，放得很随手。', endEn: 'Neither of you mentioned it for the rest of the lesson. Putting the equipment away he dropped the scratched pair back in the communal box, casually.',
    word: { jp: '実験', reading: 'じっけん', zh: '实验', en: 'experiment' },
    scene: 'school_science_lab'
  },
  {
    subject: 'kagaku',
    zh: '同组的人把盛着试剂的烧杯递过来时没吭声，只是默默把它推到你手边。你顺势稳稳接住。合作有时候不需要多余的言语。',
    en: 'Your lab partner does not say anything when passing the beaker, just slides it gently to your hand. You take it. Cooperation does not always need words.',
    midZh: '接下来的四十分钟你们就这么干活：他推一下，你接住；你把滴管举起来，他点头。全程说过的话不超过五个词，而且没有一个是必要的。', midEn: 'You worked like that for the rest of it: he pushed something over, you took it; you held the pipette up, he nodded. Between you, you used barely a handful of words, none of which had been necessary.',
    endZh: '实验结果是对的。你们两个看着那个变成淡蓝色的溶液，同时点了一下头，然后各自去洗手了。', endEn: 'The result came out right. The two of you looked at the pale blue solution, nodded at the same moment, and went to wash your hands separately.',
    word: { jp: '器具', reading: 'きぐ', zh: '器材', en: 'equipment' },
    scene: 'school_science_lab'
  },
  {
    subject: 'kagaku',
    zh: '整间实验室都是一股鸡蛋放坏了的味道。老师说这是正常的。没有人相信他。',
    en: 'The whole lab smells of eggs that have gone off. The teacher says this is normal. Nobody believes him.',
    midZh: '后排有人开始小声地咳嗽，咳得非常有戏。老师头也不抬地说了句「演技はいらん」，全班笑了。窗户还是没人去开。', midEn: 'Somebody at the back started coughing, theatrically. Without looking up the teacher said that the acting was not required, and the class laughed. Nobody opened a window.',
    endZh: '下课铃一响，二十几个人以惊人的速度冲进了走廊。你是最后一个出去的，因为你在收器材。', endEn: 'The bell went and twenty-odd people got into the corridor at a remarkable speed. You were last out, because you were putting the equipment away.',
    word: { jp: '匂い', reading: 'におい', zh: '气味', en: 'smell' },
    scene: 'school_science_lab'
  },
  // ---- 体育 ----
  {
    subject: 'taiiku',
    zh: '体育课跑了八圈。跑到第六圈的时候你想起自己昨天晚上没吃饭。',
    en: 'Eight laps in PE. On the sixth you remember you did not eat dinner last night.',
    midZh: '想起来这件事之后腿立刻就沉了，明明前五圈都还好。人的身体大概是听得懂话的，你一提它就当真了。剩下两圈你是靠数操场边上的树跑完的。', midEn: 'Remembering it made your legs heavy immediately, when the first five had been fine. Bodies apparently understand what you say about them, and take it seriously. You got round the last two by counting the trees along the edge of the field.',
    endZh: '跑完蹲在地上喘气的时候，有人往你手里塞了一瓶运动饮料。等你抬头，那个人已经在跑下一组了。', endEn: 'Crouched down getting your breath back afterwards, somebody put a sports drink into your hand. By the time you looked up they were already off on the next set.',
    word: { jp: '走る', reading: 'はしる', zh: '跑', en: 'to run' },
    scene: 'gym'
  },
  {
    subject: 'taiiku',
    zh: '分组的时候没有人叫你，也没有人不叫你。你就那么被分进了一边，像水自己找地方流。',
    en: 'Nobody picks you when the teams are made. Nobody leaves you out either. You end up on a side the way water ends up somewhere.',
    midZh: '被分进去以后也没有人跟你说战术，因为根本没有战术。这项运动的规则你只懂七成，剩下三成你打算靠观察。观察的结论是：大部分人也只懂七成。', midEn: 'Nobody explained any tactics once you were in, because there were none. You understood about seventy per cent of the rules and intended to work the rest out by watching. What watching told you was that most of them understood about seventy per cent too.',
    endZh: '你们那队输了。输完之后所有人都在笑，包括赢的那队。你也笑了，而且这次没有慢半拍。', endEn: 'Your side lost. Everybody laughed afterwards, including the side that had won. You laughed too, and this time you were not half a beat behind.',
    word: { jp: 'チーム', zh: '队伍', en: 'team' },
    scene: 'gym'
  },
  {
    subject: 'taiiku',
    zh: '体育馆的地板上有几十条不同颜色的线。你花了整节课想搞清楚哪几条是这项运动的。',
    en: 'There are dozens of coloured lines on the gym floor. You spend the whole period trying to work out which ones belong to this sport.',
    midZh: '黄的、蓝的、红的、白的，还有一条不知道为什么是绿的、而且只有半截。你后来放弃了推理，改成直接看别人往哪儿站——这个办法比推理快得多，而且到现在为止在这个国家一直都好用。', midEn: 'Yellow, blue, red, white, and one that was green for no reason and only went half way. In the end you gave up reasoning and simply watched where other people stood, which was much faster, and which has worked reliably in this country so far.',
    endZh: '下课收器材的时候你问了一句那条绿线是干什么的。被问的那个人想了很久，说他也不知道，从入学就在那儿了。', endEn: 'Putting the equipment away you asked what the green one was for. The person you asked thought about it for a long time and said he did not know either. It had been there since he started.',
    word: { jp: '線', reading: 'せん', zh: '线', en: 'line' },
    scene: 'gym'
  },
  // ---- 美術 ----
  {
    subject: 'bijutsu',
    zh: '静物写生课。讲桌中央摆着玻璃瓶和三个新鲜柿子。你埋头画了大半节课，素描本上的柿子怎么看都透着一股土豆的质感。',
    en: 'Still life. A bottle and three persimmons on the desk. You draw for most of the period, but your persimmons look unmistakably like potatoes.',
    midZh: '问题出在你太老实了。你把看见的每一个凹陷都画了上去，画完发现柿子这种东西的美感恰恰在于它没有那么多细节。旁边那位只用了五六笔，反而像。', midEn: 'The trouble was that you had been too honest about it. You put in every dent you could see, and it turned out that the appeal of a persimmon lies precisely in it not having that many details. The person beside you used half a dozen strokes and got closer.',
    endZh: '老师走过来看了看，说了句「よく見てるね」。你不确定这是夸奖还是诊断。', endEn: 'The teacher came past, looked, and said that you were certainly looking carefully. You were not sure whether that was praise or a diagnosis.',
    word: { jp: '柿', reading: 'かき', zh: '柿子', en: 'persimmon' },
    scene: 'art_room'
  },
  {
    subject: 'bijutsu',
    zh: '美术老师踱着步子从你身后走过，冷不丁停下脚步端详了片刻，什么也没评判便悄然走开了。你到现在也不知道他当时到底看出了什么。',
    en: 'The art teacher walks past behind you, stops for a moment to study your page, says nothing and moves on. You still do not know what he saw.',
    midZh: '你为此把那张画来回看了好几遍，试图找出他停下来的理由。找了半天什么也没找到，倒是发现自己把瓶子画歪了，歪得挺明显。', midEn: 'You went over the drawing several times trying to work out what had made him stop. You did not find it. What you did find was that the bottle was crooked, noticeably so.',
    endZh: '临下课他又走了一趟，这次没停。你反而更在意了。', endEn: 'He came past once more before the bell and did not stop that time. Somehow that bothered you more.',
    word: { jp: '黙る', reading: 'だまる', zh: '沉默', en: 'to stay silent' },
    scene: 'art_room'
  },
  {
    subject: 'bijutsu',
    zh: '今天教水墨。老师说「線は一回しか引けない」——线只能画一次。你把这句话记在了笔记本的最后一页。',
    en: 'Ink painting today. The teacher says a line can only be drawn once. You write that on the last page of your notebook.',
    midZh: '他示范了一次。那一笔从纸的这头到那头，中间没有任何犹豫，落笔和收笔的地方粗细不一样，但你说不清是怎么做到的。轮到你的时候，你的那一笔在三分之一处停了一下，那一停就永远留在纸上了。', midEn: 'He demonstrated once. The stroke went from one side of the paper to the other without any hesitation in it, thicker at one end than the other, and you could not have said how. When your turn came, your stroke paused about a third of the way along, and the pause stayed on the paper for good.',
    endZh: '你把那张纸留下来了，没扔。纸上那个停顿看久了其实也不难看。', endEn: 'You kept that sheet instead of throwing it away. Looked at for long enough, the pause is not actually ugly.',
    word: { jp: '一回', reading: 'いっかい', zh: '一次', en: 'once' },
    scene: 'art_room'
  },
  // ---- 家庭科 ----
  {
    subject: 'katei',
    zh: '家政课在教缝纽扣。你缝了四遍，前三遍都把布缝在了一起。',
    en: 'Home ec: sewing on a button. You do it four times. The first three times you sew the cloth shut.',
    midZh: '第四遍成了，靠的是把布掀起来看着针从背面出来。老师说这是最笨的办法，但也是最不会错的办法。她说这话的时候没有嘲笑的意思，你听得出来。', midEn: 'The fourth one worked, by lifting the cloth and watching the needle come out on the underside. The teacher said that was the clumsiest way of doing it and also the way that goes wrong least often. There was no mockery in how she said it, and you could hear that.',
    endZh: '扣子缝得歪，但很牢。你后来用力扯过一次，没掉。', endEn: 'The button ended up crooked and extremely secure. You gave it a hard pull later on. It stayed.',
    word: { jp: 'ボタン', zh: '纽扣', en: 'button' }
  },
  {
    subject: 'katei',
    zh: '老师说味噌汤的味噌不能煮开。你想起隔壁那位好像也说过一模一样的话。',
    en: 'The teacher says you must not let miso boil. You remember someone next door saying exactly the same thing.',
    midZh: '一模一样。连语气都像——都是那种「这不是建议，这是常识」的说法。你忽然意识到这个国家有一整套这样的东西，不写在任何书上，但所有人都知道。', midEn: 'Word for word, and in the same tone: the tone that says this is not advice, this is common knowledge. It struck you that this country has a whole body of that, written down nowhere, and known by everybody.',
    endZh: '下课你把这条记在了那张「原来不是全世界都一样的东西」的清单上。这是第几条你没数。', endEn: 'You added it to that list of things you had assumed were universal. You did not count which number it was.',
    word: { jp: '沸騰', reading: 'ふっとう', zh: '沸腾', en: 'to boil' }
  },
  // ---- 补的量：英语一年要上四十一次，只有三段的话玩家会看十四遍 ----
  {
    subject: 'eigo',
    zh: '老师放了一段听力。是伦敦口音。全班一片沉默，只有你在心里想：这个人说话有点含糊。',
    en: 'The teacher plays a listening exercise. London accent. The room goes silent, and the only thought in your head is that this person mumbles.',
    midZh: '放完之后老师问听懂了多少，教室里没有一只手举起来。你也没举——不是听不懂，是不知道举起来之后要说什么。你在这个教室里第一次为「太懂了」感到为难。', midEn: 'When it finished he asked how much of it people had got, and not one hand went up. Yours did not either, not because you had missed it but because you had no idea what you would say if it did. It was the first time in that room that knowing too much had been a problem.',
    endZh: '下课有人转过来问你那段到底在讲什么。你说在讲一个人问路。对方长长地哦了一声，说难怪听着这么烦。', endEn: 'Afterwards somebody turned round to ask what it had been about. You said somebody asking for directions. They said a long ah, and that it explained why it had been so irritating.',
    word: { jp: '訛り', reading: 'なまり', zh: '口音', en: 'accent' }
  },
  {
    subject: 'eigo',
    zh: '有人举手问 "How are you" 一定要回 "I am fine" 吗。老师说不一定。你在座位上点了很久的头。',
    en: 'Somebody asks whether "how are you" has to be answered with "I am fine". The teacher says not necessarily. You nod at your desk for quite a while.',
    midZh: '老师说其实没有人真的在问你好不好，那句话的功能更接近于「你好」。全班有种被骗了的表情。你想告诉他们日语里的「お疲れ様」也是同一回事，但你的日语说不到那个份上。', midEn: 'He said that nobody is actually asking how you are, and that the phrase functions more like hello. The class looked mildly cheated. You wanted to point out that a certain Japanese greeting works exactly the same way, and your Japanese was not up to it.',
    endZh: '下课以后你在笔记本上写了一行：有些话不是问题，是敲门。写完自己看了一会儿。', endEn: 'Afterwards you wrote one line in your notebook: some sentences are not questions, they are knocking. You looked at it for a while.',
    word: { jp: '必ず', reading: 'かならず', zh: '一定', en: 'without fail' }
  },
  {
    subject: 'eigo',
    zh: '同桌把英语小作文悄悄推过来，指着其中一处语法问对不对。你扫了一眼就笃定地说没问题。他不信邪跑去问了老师，老师给的批复跟你一模一样。',
    en: 'The person next to you slides an essay over and points at a line. You glance at it and say it is fine. He does not believe you and asks the teacher, who gives the exact same confirmation.',
    midZh: '他回来以后没说什么，只是把笔记本又推近了一点，指了指另一处。这一次他没去问老师。接下来那半节课他一共指了七八个地方。', midEn: 'He came back without saying anything and pushed the notebook a little closer, pointing at another place. That time he did not go and ask. Over the rest of the period he pointed at seven or eight more.',
    endZh: '下课的时候他说了句「ありがと」，说得很快，快得像是不想被别人听见。', endEn: 'At the bell he said thanks, quickly, quickly enough that it sounded like he did not want anybody else to hear.',
    word: { jp: '正しい', reading: 'ただしい', zh: '正确的', en: 'correct' }
  },
  {
    subject: 'eigo',
    zh: '黑板上抄了一句谚语，下面用假名标了读音。你盯着那行假名看了很久，第一次觉得英语很陌生。',
    en: 'A proverb goes up on the board with the pronunciation written under it in kana. You look at that row of kana for a long time and English feels unfamiliar for the first time.',
    midZh: '用假名写出来的英语，读起来完全是另一种东西——每个音节都被拉开、垫平、放进一个格子里。你试着照那行假名念了一遍，念出来的东西你自己都不认识。', midEn: 'English written in kana is a different substance entirely: every syllable pulled apart, flattened out and put into its own box. You tried reading that line the way it was written and did not recognise what came out of your mouth.',
    endZh: '但全班就是这么记住它的。而且他们记住了。下课的时候还有人在小声地重复那一串假名。', endEn: 'But that is how the class memorised it, and they had memorised it. Somebody was still repeating the kana quietly on the way out.',
    word: { jp: 'ことわざ', zh: '谚语', en: 'proverb' }
  },
  {
    subject: 'eigo',
    zh: '老师叫你起来读，读完补了一句「發音がいいね」。全班转过来看你。你坐下的时候耳朵是热的。',
    en: 'The teacher has you read and adds that your pronunciation is good. The whole class turns round. Your ears are hot by the time you sit down.',
    midZh: '那句话本来是好意，但它同时也提醒了整个教室一件事：这个人跟你们不一样。你坐下之后有半节课没抬头，一直在看课本上同一个段落，一个字也没读进去。', midEn: 'It was meant kindly, and it also reminded the entire room of something: this one is not like you. You kept your head down for the rest of the period, looking at the same paragraph and taking in none of it.',
    endZh: '下课的时候前排那位回过头，说了句「ずるいわ」，语气里没有一点恶意。你笑了，那半节课的东西一下就散掉了。', endEn: 'At the bell the person in front turned round and said that it was not fair, without a trace of malice in it. You laughed, and the whole of that half-period came loose and went.',
    word: { jp: '発音がいい', zh: '发音好', en: 'good pronunciation' }
  },
  {
    subject: 'kokugo',
    zh: '国语老师念到一个古语词忽然停下来，饶有兴致地问全班有没有人知晓出处。底下鸦雀无声。他索性兴致勃勃地一人展开畅谈了半天，眉飞色舞。',
    en: 'The teacher stops on an archaic word and asks with genuine curiosity if anyone knows its origin. Silence. So he happily takes over and expounds on it himself for a long while.',
    midZh: '他讲的是这个词原本写作什么、后来为什么变了、以及一位江户时代的人怎么用错了它、错得太好以至于大家跟着错到了今天。全班没有人做笔记，但也没有人打断他。', midEn: 'He talked about how the word had originally been written, why it changed, and how somebody in the Edo period had used it wrongly, so well that everybody has been using it wrongly ever since. Nobody took notes. Nobody interrupted him either.',
    endZh: '讲完他愣了一下，说了句「テストには出ません」，然后继续上课。有几个人笑了。', endEn: 'When he finished he paused and said that none of that would be on the test, and carried on. A few people laughed.',
    word: { jp: '意味', reading: 'いみ', zh: '意思', en: 'meaning' }
  },
  {
    subject: 'kokugo',
    zh: '汉字听写。你写的字全对，笔顺全错。老师从你背后走过去的时候什么也没说。',
    en: 'Kanji dictation. Every character correct, every stroke order wrong. The teacher walks past behind you and says nothing.',
    midZh: '笔顺这种东西在你原来那个国家从来没人管过，写出来对就行。这里不一样。你后来才知道，笔顺错了字会歪，歪在哪儿是有规律的，老师一眼就看得出来。', midEn: 'Nobody where you came from had ever cared about stroke order; getting the character right was the whole of it. Here it is different. You found out later that wrong stroke order makes a character lean, and it leans in predictable directions, and a teacher can see it across a room.',
    endZh: '第二天你在草稿纸上按笔顺重写了那几个字，写得比原来慢很多，但确实比原来正。', endEn: 'The next day you rewrote those characters in the proper order on scratch paper. It took much longer and they did come out straighter.',
    word: { jp: '筆順', reading: 'ひつじゅん', zh: '笔顺', en: 'stroke order' }
  },
  {
    subject: 'kokugo',
    zh: '一整节课都在讲一个「けり」。你到下课都没搞清楚它为什么这么重要。前排有人也没搞清楚。',
    en: 'A whole period on the particle "keri". You still do not understand why it matters by the bell. Neither, from the look of it, does the person in front of you.',
    midZh: '老师说这个词的意思大概是「原来如此啊」——不是知道了一件事，是忽然意识到自己一直都知道。你听到这个解释的时候有点被击中，虽然你还是不会用它。', midEn: 'He said the word means something like: so that is how it was. Not learning a thing, but suddenly noticing that you had known it all along. That explanation landed on you somewhat, although you still cannot use the word.',
    endZh: '前排那位回过头看了你一眼，两个人对视了一秒，都摇了摇头。你们至少在这件事上是平等的。', endEn: 'The person in front turned round and looked at you, and for a second you looked at each other and both shook your heads. On this at least the two of you were equals.',
    word: { jp: '助動詞', reading: 'じょどうし', zh: '助动词', en: 'auxiliary verb' }
  },
  {
    subject: 'suugaku',
    zh: '老师写了半黑板，写到一半停下来，退后看了看，把最上面那一行擦了。全班没有人问为什么。',
    en: 'The teacher fills half the board, stops, steps back to look, and rubs out the top line. Nobody asks why.',
    midZh: '擦掉之后他重写了那一行，跟原来看不出什么区别。你盯着看了半天也没找出差在哪儿。前排那位倒是很自然地把自己笔记上那行也划掉重抄了——他显然看出来了。', midEn: 'He rewrote the line and it looked no different from the first one. You stared at it and could not find the difference. The person in front, however, crossed out that line in their own notes and copied it again as a matter of course. They had clearly seen it.',
    endZh: '下课你问了。差别在一个括号的位置上。你听懂了以后觉得自己刚才那半节课白看了，但心情居然还不错。', endEn: 'You asked afterwards. It was where one bracket went. Once you understood, you felt you had wasted half a period, and in surprisingly good spirits about it.',
    word: { jp: '消す', reading: 'けす', zh: '擦掉', en: 'to erase' }
  },
  {
    subject: 'suugaku',
    zh: '有人问这个学了以后有什么用。老师说没什么用。全班笑了，那个人也笑了，然后大家继续算。',
    en: 'Somebody asks what this is good for. The teacher says nothing much. The class laughs, the asker laughs, and everyone goes back to working it out.',
    midZh: '他补了一句：真要说的话，用处是让你以后碰到一件想不明白的事的时候，知道那种感觉是可以忍受的。说完他就转身继续写板书了，好像刚才那句话不算什么。', midEn: 'He added one thing: if you insist on a use, the use is that when you later run into something you cannot work out, you will know that the feeling is survivable. Then he turned back to the board as though that had not been anything in particular.',
    endZh: '那句话你记了下来，写在那本清单的旁边。写的时候你意识到自己已经开始收集这个国家的老师随口说的话了。', endEn: 'You wrote that down, next to the list. Writing it, you noticed that you had started collecting the things teachers in this country say in passing.',
    word: { jp: '役に立つ', reading: 'やくにたつ', zh: '有用', en: 'to be useful' }
  },
  {
    subject: 'suugaku',
    zh: '你的答案和黑板上不一样。你检查了两遍，是黑板错了。你举手举到一半又放下了。',
    en: 'Your answer does not match the board. You check twice. The board is wrong. Your hand goes halfway up and comes back down.',
    midZh: '放下的原因很实际：你想好了中文怎么说，想好了英文怎么说，但想不出日语怎么说「这里应该是负号」。等你把句子拼完，老师已经翻篇了。', midEn: 'The reason you put it down was practical: you had the sentence in your own language and in English, and could not assemble the Japanese for there should be a minus sign there. By the time you had it, he had moved on.',
    endZh: '下课你把草稿纸拿过去指给他看。他看了三秒，说了句「あ、ほんまや」，然后当着你的面在教案上改了。', endEn: 'Afterwards you took the scratch paper up and pointed. He looked at it briefly, said that you were right, and corrected it on his own notes in front of you.',
    word: { jp: '間違い', reading: 'まちがい', zh: '错误', en: 'a mistake' }
  },
  {
    subject: 'nihonshi',
    zh: '讲到战国。老师讲得比平时快，板书也潦草，看得出他喜欢这一段。',
    en: 'The Warring States period. He goes faster than usual and his handwriting on the board gets loose. It is obvious he likes this part.',
    midZh: '潦草到有些字你完全认不出来，只能靠上下文猜。但他讲得实在太投入了，投入到你居然跟着紧张起来——明明结局早就写在课本上，而且写在四百年前。', midEn: 'So loose that some of the characters were beyond you and had to be guessed from context. But he was so absorbed in it that you found yourself getting tense as well, over an outcome printed in the textbook, and settled four hundred years ago.',
    endZh: '下课铃响的时候他还没讲完，愣了一下，说了句「続きは明日」。全班有人小声地喊了一声「えー」。', endEn: 'The bell went before he had finished. He stopped, and said the rest tomorrow. Somebody in the room let out a small noise of complaint.',
    word: { jp: '戦国', reading: 'せんごく', zh: '战国', en: 'the Warring States period' }
  },
  {
    subject: 'nihonshi',
    zh: '课本上那张老照片是黑白的，拍的是这一带的港口。你把它和窗外对了一下，房子全换了，山没换。',
    en: 'The old photograph in the textbook is black and white, and it is this harbour. You hold it up against the window. Every building has changed. The mountain has not.',
    midZh: '山的轮廓和照片上一模一样，一个凹口都不差。你忽然想到，外公当年从这间教室的窗户往外看的时候，看见的也是这条线。', midEn: 'The outline of the ridge matched the photograph exactly, every dip in it. It occurred to you that when your grandfather looked out of the windows of this building, this was the line he saw as well.',
    endZh: '你把课本立起来，让照片的边缘对准窗外那道山脊。对上了。你就那么举了一会儿，直到手酸。', endEn: 'You held the textbook up and lined the edge of the photograph against the ridge outside. It fitted. You held it there a while, until your arm got tired.',
    word: { jp: '写真', reading: 'しゃしん', zh: '照片', en: 'photograph' }
  },
  {
    subject: 'nihonshi',
    zh: '老师问有没有人去过生田神社。举手的人比你想的多。他说那你们脚下踩的东西比课本老。',
    en: 'The teacher asks who has been to Ikuta Shrine. More hands go up than you expected. He says in that case what you have been standing on is older than the textbook.',
    midZh: '他说这座城市的名字就是从那儿来的，比课本上任何一个年号都早，早到没有确切的年份可以写。全班安静了一下——大概没有人想过每天路过的那个地方是这么回事。', midEn: 'He said the name of this city comes from there, earlier than any of the era names in the book, early enough that there is no exact year to write down. The room went quiet for a moment. Probably nobody had thought of the place they walk past every day in those terms.',
    endZh: '你也举了手。举完之后才想起来，你去那儿是因为外公地图上把那个鸟居描了三遍。', endEn: 'You had put your hand up too. Only afterwards did you remember why you had been: because your grandfather drew that torii three times over on his map.',
    word: { jp: '古い', reading: 'ふるい', zh: '古老的', en: 'old' }
  },
  {
    subject: 'taiiku',
    zh: '排球。你的手臂被砸红了一片。下课的时候有人递给你一瓶冰的运动饮料，没说是谁买的。',
    en: 'Volleyball. One forearm comes out red. At the bell somebody hands you a cold sports drink without saying who paid for it.',
    midZh: '红的那一片你自己看了看，觉得挺好看的——起码是个证据，证明你在场上是真的接了球，而不是站在那儿躲。上一次你手臂上有这种痕迹是什么时候你已经不记得了。', midEn: 'You looked at the red patch and rather liked it. It was at least evidence that you had actually taken the ball rather than standing there avoiding it. You could not remember the last time you had a mark like that on your arm.',
    endZh: '饮料是冰的，冰到贴在手臂上很舒服。你先贴了一会儿才喝。', endEn: 'The drink was cold, cold enough to be worth holding against your arm. You held it there for a while before drinking it.',
    word: { jp: '差し入れ', reading: 'さしいれ', zh: '慰劳的东西', en: 'a little something brought for someone' },
    scene: 'gym'
  },
  {
    subject: 'taiiku',
    zh: '下雨，改在体育馆做柔软体操。全班一起做，动作全都对不上，广播里的音乐一直在放。',
    en: 'Rain, so it is stretches in the gym instead. The whole class does them together and none of them line up. The music on the tannoy keeps going regardless.',
    midZh: '那段音乐你听着耳熟，后来才想起来：这是全日本都在用的那一套，你在很多地方听过它的片段，只是从来不知道原曲这么长。全班动作乱七八糟，但没有一个人停下来。', midEn: 'The music was oddly familiar, and then you worked it out: it is the one the whole country uses, and you had heard fragments of it in a great many places without ever knowing that the whole thing goes on this long. Nobody in the room was in time and nobody stopped.',
    endZh: '做完之后大家原地散开，没有人说话，都在喘气。窗外的雨还在下。', endEn: 'Afterwards everybody drifted apart where they stood, out of breath and not talking. It was still raining outside.',
    word: { jp: '柔軟', reading: 'じゅうなん', zh: '柔软（体操）', en: 'stretching' },
    scene: 'gym'
  },
  {
    subject: 'bijutsu',
    zh: '你把调色盘洗干净了才发现下节还是美术。旁边那个人笑了很久，然后把自己的挤了一半给你。',
    en: 'You wash your palette clean and only then find out the next period is art as well. The person beside you laughs for a while, then squeezes half of theirs onto yours.',
    midZh: '他挤颜料的手法非常熟练，一边挤一边跟你说哪个颜色要多挤一点、哪个基本用不上。你听懂了大概一半，但那一半正好是有用的那一半。', midEn: 'He squeezed the paint out with practised ease, telling you as he went which colours you want more of and which you will basically never touch. You followed about half of it, and it was the useful half.',
    endZh: '那节课你画的东西还是不怎么样，但至少这次颜色是够用的。', endEn: 'What you painted that period was still not much good, and this time at least you did not run out.',
    word: { jp: 'パレット', zh: '调色盘', en: 'palette' },
    scene: 'art_room'
  },
  {
    subject: 'katei',
    zh: '今天量了每个人的手掌。老师说这是为了知道自己的一把米是多少。你的一把比标准少了一点。',
    en: 'Today everyone measures their own palm. The teacher says it is so you know what one handful of rice means for you. Yours is slightly under.',
    midZh: '少一点也没关系，她说，知道自己少多少就行了。以后煮饭抓两把再加一点，比拿量杯准。这个说法你觉得非常好，好到有点想记下来，但又觉得记下来就没意思了。', midEn: 'It does not matter that it is less, she said; what matters is knowing by how much. Two handfuls and a bit will beat a measuring cup after that. You liked that a great deal, enough to want to write it down, and then felt that writing it down would spoil it.',
    endZh: '回去的路上你在口袋里张开手又合上，反复了好几次。', endEn: 'On the way home you opened and closed your hand in your pocket several times.',
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
    afterZh: '你扫了一眼题目唰唰写下答案，随后便撑着侧脸陷入沉思，望向窗外的流云发呆。',
    afterEn: 'You glance at the problem, jot down the answer in a flash, and spend the rest of the period propping your chin, daydreaming at the clouds.',
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
        thenZh: '她猛地弹起来的动作太大，椅子腿在地面上刺耳地响了一声。老师脚步一顿，严厉的视线在她身上来回扫视了片刻，才摇摇头继续往前走。下课后她心虚地回过头，压低声音说了一句「借りといて」。',
        thenEn: 'She bolts upright with such sudden force that the chair leg squeals against the floor. The teacher pauses, sweeping a stern gaze over her for a tense beat before shaking his head and walking on. After class she turns round sheepishly, whispering that she owes you one.',
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
        thenZh: '她就这么沉沉睡了大半节课。醒来之后先是怔怔地看着那本立起来替她掩护的课本，又侧头看了看你，心照不宣地什么也没问，只是抿着嘴悄悄把书放平了。',
        thenEn: 'She sleeps soundly through most of the period. On waking, she blinks at the upright book shielding her from view, then glances over at you, asking nothing and quietly laying it flat with a small, knowing smile.'
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
        thenZh: '「……年号が。」她说，声音低到只有你听得见。「一年、ずれてる。」然后她把课本往你这边推了些许，让你看清那一行纠错批注。',
        thenEn: 'The date, she whispers, barely audible. It is off by a year. Then she pushes the textbook slightly your way so you can see the correction.',
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
        hintZh: '胜负只在电光石火的一瞬', hintEn: 'The window is a fraction of a heartbeat.',
        familiarity: 6, affection: 3,
        reasonZh: '她欠了你一次，而且她讨厌欠人情',
        reasonEn: 'She owes you one now, and she hates owing people',
        thenZh: '老师低头继续讲课。片刻后你的手机在课桌肚里轻震了一下，弹出一条消息：「バレたら道連れやからな（要是被发现了就拉你一起陪葬）」。',
        thenEn: 'The teacher goes back to the board. Moments later your phone buzzes under the desk with a message: If I go down, I am taking you with me.',
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
        thenZh: '她的板擦在黑板上顿了一瞬，随即若无其事地继续擦拭下面那半块，自始至终没有多说一个字。走出教室时她才背对着你轻飘飘扔下一句：「明日も同じ時間。」',
        thenEn: 'Her eraser pauses for a heartbeat, then carries on wiping the lower half as if nothing happened. Only as she leaves the room does she drop a quiet line over her shoulder: same time tomorrow.',
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
