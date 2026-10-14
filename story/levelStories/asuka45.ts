import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 明日香 · 第④段「赤ペンの返却」 / 第⑤段「立候補しない理由」
//
// 触发：③演完 7 天后 / ④演完 7 天后（LevelStoryDef.after）
//
// 【③之后还剩什么】
// ③把她的病根拆了：价值不是有条件的，掉到第二的那个月她也没有变成别的东西。
// 但拆掉之后，她手上还攥着两样旧工具——红笔，和委员长的腕章。
// 一个是"我比你会"，一个是"我有用"。④⑤各还掉一样。
//
// ④：红笔。整整一年都是她改你。这一段反过来：她偷偷在学你的语言，
//    满本红笔注音——跟①那份讲义一模一样的标法，三百多个，这次需要注音的是她自己。
//    相爱线里她要用你的语言说一句话，你学她当时的口气说「发音还不够」。
//    最后她把红笔递给你：添削是互相的。
// ⑤：腕章。下学年的委员长选举，候选人名单上第一次没有她。
//    ②里她想辞职，是因为觉得自己不配；这一次她不参选，是因为想知道
//    "不当委员长的我会干什么"。她不知道答案，而她第一次愿意不知道。
//
// 【动画】④：夕阳的图书室，她捧着教材念出声，红笔在指间转了一圈。
//         ⑤：教室窗边，她把腕章摘下来，风把双马尾吹起来，她回头笑了。
// ---------------------------------------------------------

const K = kit(CharacterId.ASUKA, 'bg-red-600', '明日香', 'Asuka');
const { scene, nar, say, me, choice, fork, anime, done, img } = K;

export const ASUKA_STORY_4: StoryNode[] = [
  scene('school_library', '赤ペンの返却', 'Returning the Red Pen', '放学后 · 周四的图书室', 'After school · The library on a Thursday', 'chat'),
  nar('周四的图书室。靠窗那张桌子，桌上照例是一摞讲义。', 'Thursday in the library. The table by the window, a stack of handouts on it as usual.'),
  nar('但今天那摞讲义不是给你的。最上面是一本外语入门教材——你的语言。书脊上贴着一张标签，用很工整的字写着「明日香」。', 'But today the stack is not for you. On top is a beginner\'s textbook for a foreign language. Yours. On its spine, a label in very neat handwriting: Asuka.'),
  say('', 'surprised', '……っ！ 見ないでよ。まだ途中なんだから。', '……！别看。还没弄完呢。', '...! Don\'t look. It\'s not finished.'),
  nar('她伸手去抢，没抢到。书已经摊开在你面前了。', 'She grabs for it and misses. The book is already open in front of you.'),
  nar('满页都是红笔。每一个字的上面都标了读音，一个不漏，跟一年前她给你的那份讲义是同一种标法。', 'Every page is covered in red. Over every single word she has written the pronunciation, not one missed, in exactly the style of the handout she gave you a year ago.'),
  nar('你没有数。你不用数也知道，大概三百多个。', 'You do not count. You do not need to. About three hundred, give or take.'),
  nar('一年前需要注音的那个人是你。这一次，是她自己。', 'A year ago, the one who needed the readings was you. This time it is her.'),
  say('', 'pout', 'あんたの国の言葉、ぜんっぜんわかんないの。口の形からして違うし。……なんでこれで喋れるのよ。', '你们国家的话，我完——全搞不懂。连嘴型都不一样。……你们怎么用这个说话的啊。', 'I do not understand your language at all. Even the mouth shapes are different. ...How do you people talk in this?'),
  say('', 'neutral', '別に、深い意味はないから。……ほら、あんたがあたしの国の言葉覚えたのに、あたしが覚えないのは、なんか、不公平でしょ。', '没什么深意啦。……你看，你都学会我们国家的话了，我却不会你的，总觉得，不公平吧。', 'It doesn\'t mean anything. ...Look, you learned my language. If I don\'t learn yours, that\'s just... unfair.'),
  nar('"不公平"。这个人到现在，说重要的话还是要先找一条规则当扶手。', 'Unfair. Even now, she needs a rule to hold on to before she can say something that matters.'),
  choice('她把教材往自己那边拽了拽，又没有真的拽走。', 'She tugs the book back toward herself, and does not quite take it.', [
    { id: 'as4_teach', zh: '「教えようか。」', en: '"Want me to teach you?"', jp: '教えようか。', hintZh: '换你来当老师', hintEn: 'Your turn to teach',
      aff: 5, fam: 6, stat: 'kindness', words: [{ jp: '交代', reading: 'こうたい', zh: '交换、轮换', en: 'taking turns' }],
      then: [
        say('', 'pout', '……木曜は、あたしが教える日なんだけど。', '……周四是我教你的日子吧。', '...Thursdays are the days I teach you.'),
        say('', 'shy', '…………今日だけ。交代。', '…………就今天。换一下。', '...............Just today. We swap.')
      ] },
    { id: 'as4_why', zh: '「なんで、急に？」', en: '"Why all of a sudden?"', jp: 'なんで、急に？', hintZh: '问到底', hintEn: 'Ask it straight',
      aff: 6, fam: 4, stat: 'guts',
      then: [
        say('', 'angry', '急にじゃないわよ！ ……三ヶ月前からやってるし。', '才不是突然！……三个月前就开始了。', 'It isn\'t sudden! ...I started three months ago.'),
        nar('三个月前。你算了一下——那是夕阳教室那天之后的第二个周四。', 'Three months. You work it out: the second Thursday after the day in the sunset classroom.')
      ] },
    { id: 'as4_redpen', zh: '拿起她的红笔，替她改掉一个标错的音', en: 'Pick up her red pen and fix one reading she got wrong', hintZh: '一个字也不说', hintEn: 'Without a word',
      aff: 7, fam: 3, stat: 'charm',
      then: [
        nar('第十二页有一个读音标错了。你拿起她的红笔，在旁边写了正确的那个。', 'On page twelve one reading is wrong. You pick up her red pen and write the right one beside it.'),
        say('', 'surprised', '……勝手に直さないでよ。', '……别擅自给我改啊。', '...Don\'t just correct it without asking.'),
        say('', 'shy', '……合ってるし。そっちのほうが。', '……而且改对了。你那个。', '...And yours is right. Damn it.')
      ] }
  ]),
  fork([
    nar('她合上书，深吸了一口气。然后她用你的语言说了一句话。', 'She closes the book and takes a breath. Then she says one sentence in your language.'),
    nar('音是歪的，声调全错，有一个字她念成了完全不同的东西。但你听懂了——那是你在夕阳的教室里用她的语言说过的那一句，现在被她换成了你的语言，原样还了回来。', 'The sounds are crooked and the tones all wrong, and one word comes out as something else entirely. But you understand it. It is the sentence you said to her in her language in the sunset classroom, turned into yours and handed back word for word.'),
    choice('她盯着桌面，耳朵红透了。', 'She stares at the desk, ears scarlet.', [
      { id: 'as4_love_amai', zh: '「……発音、まだ甘い。」', en: '"...Your pronunciation needs work."', jp: '……発音、まだ甘い。', hintZh: '学她那时候的口气', hintEn: 'In her voice from that day',
        aff: 8, fam: 2,
        then: [
          say('', 'angry', 'っ……！ い、今のは練習！ もう一回言うから、ちゃんと聞きなさいよ！', '唔……！刚、刚才那是练习！我再说一遍，给我好好听着！', 'Ngh...! Th-that was practice! I\'m saying it again, so listen properly!'),
          nar('她说了第二遍。你纠正了一个音。她说了第三遍。', 'She says it a second time. You correct one sound. She says it a third time.'),
          me('……合格。', '……合格。', '...Pass.'),
          nar('她把教材竖起来，整张脸挡在后面，很久都没有放下来。', 'She stands the textbook up and hides her whole face behind it, and does not lower it for a long time.')
        ] },
      { id: 'as4_love_answer', zh: '用她的语言，再回答一遍', en: 'Answer her again, in her language', hintZh: '这次轮到你说', hintEn: 'Your turn',
        aff: 7, fam: 3,
        then: [
          nar('你用她的语言回了同一句话。这次你没有一个音说错——你练过。', 'You answer with the same sentence, in her language. This time you do not get a single sound wrong. You have practised.'),
          say('', 'shy', '……ずるい。あんた、上手くなりすぎ。', '……狡猾。你进步得太多了。', '...Unfair. You\'ve got too good.')
        ] }
    ])
  ], [
    say('', 'neutral', 'あんたが帰ったら、メッセージ、そっちの言葉で来るかもしれないでしょ。翻訳アプリ通したら、あんたの書き方が消えちゃうじゃない。', '你回去以后，消息说不定会用你们那边的话发过来吧。用翻译软件转一道，你写字的那个样子就没了。', 'When you go home, your messages might come in your language. If I run them through a translation app, the way you write disappears.'),
    nar('时差算一下就行——这是她在夕阳的教室里说的。原来她算的不只是时差。', 'The time difference is just arithmetic, she said in the sunset classroom. It turns out she was not only working out the time difference.'),
    say('', 'neutral', 'だから、読めるようになるの。辞書なしで。', '所以我要学到能读懂。不查词典的那种。', 'So I\'m going to be able to read it. Without a dictionary.'),
    nar('你帮她把第一课的十个词念了一遍，她跟着念，你改，她再念。窗外的天从橘色变成了紫色。', 'You read the ten words of lesson one aloud. She repeats them, you correct her, she tries again. Outside, the sky goes from orange to violet.'),
    say('', 'pout', '……合格は、まだいらない。あたしのほうは不合格でいいの。だから来週も木曜ね。', '……合格什么的，我还不要。我这边先不合格就行。所以下周也是周四。', '...I don\'t want a pass yet. I\'m fine failing. So it\'s Thursday next week, too.')
  ]),
  anime(4),
  nar('收拾东西的时候，她把那支红笔递了过来。笔帽上的漆已经磨掉了一块，是她一整年拿着它的地方。', 'As you pack up she holds out the red pen. The paint on the cap has worn away in one spot: where she has held it all year.'),
  say('', 'neutral', 'はい。今日から、あんたも赤ペン持ちなさい。', '给。从今天开始，你也拿着红笔。', 'Here. From today, you carry a red pen too.', [{ jp: '添削', reading: 'てんさく', zh: '批改', en: 'correcting (written work)' }]),
  say('', 'pout', '添削は、お互い様でしょ。……あたしが直してばっかりなの、もう飽きたの。', '批改这种事，要互相来的吧。……光我一个人改你，我已经腻了。', 'Correcting goes both ways, doesn\'t it. ...I\'m sick of being the only one doing it.'),
  nar('她说"腻了"。你知道她真正的意思是：她不想再只当那个比你会的人了。', 'Sick of it, she says. You know what she means: she does not want to be only the one who knows more than you any more.'),
  done(4, 4, 4, '交换过来的那支红笔', 'The red pen that changed hands')
];

export const ASUKA_STORY_5: StoryNode[] = [
  scene('classroom_sunset', '立候補しない理由', 'Why She Isn\'t Running', '放学后 · 教室', 'After school · The classroom', 'chat'),
  nar('下学年的班委选举公告贴出来了。委员长那一栏的候选人名单上，第一次没有她的名字。', 'The notice for next year\'s class officer election goes up. For the first time, her name is not on the list for class president.', undefined, [{ jp: '立候補', reading: 'りっこうほ', zh: '参选、报名候选', en: 'standing as a candidate' }]),
  nar('全班都看见了。没有一个人敢问。', 'The whole class sees it. Nobody dares ask.'),
  nar('放学后教室里只剩下你们两个。她坐在自己的座位上，把那只委员长的腕章叠得方方正正，叠了又拆，拆了又叠。', 'After school it is just the two of you. She sits at her desk, folding the class president\'s armband into a perfect square, unfolding it, folding it again.', img('', 'neutral')),
  say('', 'pout', '何よ、その顔。……辞めるんじゃないわよ。来年は、やらないってだけ。', '干嘛啊，那张脸。……我又不是辞职。只是明年不干了而已。', 'What\'s that face for? ...I\'m not quitting. I\'m just not doing it next year.'),
  nar('上一次她想辞，是在雨里，模拟考掉到第二的那个月。那一次是因为她觉得自己不配。', 'The last time she wanted to quit was in the rain, the month she dropped to second. That time it was because she thought she did not deserve it.'),
  say('', 'neutral', 'あのね。委員長じゃなかったら、あたし、放課後に何すればいいのか、わかんないの。', '跟你说。不当委员长的话，放学后我都不知道该干什么。', 'Listen. If I\'m not class president, I don\'t know what I\'m supposed to do after school.'),
  say('', 'shy', 'だから、わかんないままでやってみたいの。……そういうの、初めてだから。', '所以，我想就这么不知道地试试看。……这种事，我还是第一次。', 'So I want to try it without knowing. ...I\'ve never done that before.'),
  nar('一个整年靠"有用"站着的人，说她想试试没有用的放学后。', 'Someone who spent a whole year standing on being useful says she wants to try an afternoon that is good for nothing.'),
  choice('她把叠好的腕章放在桌上，看着你，等你说点什么。', 'She sets the folded armband on the desk and looks at you, waiting.', [
    { id: 'as5_nothing', zh: '「じゃあ今日、何もしない放課後、やってみる？」', en: '"Then shall we try a do-nothing afternoon today?"', jp: 'じゃあ今日、何もしない放課後、やってみる？', hintZh: '陪她试', hintEn: 'Try it with her',
      aff: 6, fam: 6, stat: 'kindness',
      then: [say('', 'surprised', '……何もしないって、何するのよ。', '……什么都不干，是要干什么啊。', '...How do you do nothing?'), me('坂を下りて、寄り道する。', '下坡，绕点路。', 'Walk down the slope. Take the long way.')] },
    { id: 'as5_loud', zh: '「委員長じゃなくても、たぶん同じくらいうるさいと思う。」', en: '"You\'ll probably be just as loud without the armband."', jp: '委員長じゃなくても、たぶん同じくらいうるさいと思う。', hintZh: '逗她', hintEn: 'Tease her',
      aff: 5, fam: 7, stat: 'charm',
      then: [say('', 'angry', 'はあ！？ うるさいって何よ！', '哈啊！？谁吵了！', 'Excuse me!? Who\'s loud!?'), nar('她瞪了你三秒，然后自己先笑了出来。', 'She glares for three seconds, then is the first to laugh.')] },
    { id: 'as5_run', zh: '「来年、副委員長に立候補してみようかな。」', en: '"Maybe I\'ll run for vice-president next year."', jp: '来年、副委員長に立候補してみようかな。', hintZh: '换你上', hintEn: 'Your turn to step up',
      aff: 4, fam: 8, stat: 'guts',
      then: [say('', 'surprised', '……は？ あんたが？', '……哈？你？', '...Huh? You?'), say('', 'tease', '……いいじゃない。演説原稿、添削してあげる。赤ペンで。', '……也不错嘛。演讲稿我帮你改。用红笔。', '...Not bad. I\'ll correct your speech. In red pen.')] }
  ]),
  anime(5),
  scene('kitano_slope', undefined, undefined, undefined, undefined, 'town'),
  nar('你们沿着北野坂往下走，没有目的地。她走得很慢，不习惯——她的步子一向是为了赶去某个地方。', 'You walk down the Kitano slope with nowhere to be. She walks slowly, awkwardly. Her stride has always been for getting somewhere.'),
  nar('坡中间有一家可丽饼店。她在店门口站了很久，最后小声说：在路上边走边吃，她这辈子还没有做过。', 'Halfway down there is a crêpe stand. She stands in front of it a long time and finally admits, quietly, that she has never once eaten while walking down the street.'),
  say('', 'shy', '……委員長だったから。示しがつかないでしょ、そういうの。', '……因为是委员长嘛。那种事，不好给别人做榜样吧。', '...Because I was class president. It sets a bad example.'),
  nar('她点了最普通的那种。第一口咬下去，奶油沾到了鼻尖上。她自己没发现。', 'She orders the plainest one. With the first bite, cream ends up on the tip of her nose. She does not notice.'),
  fork([
    nar('你伸手替她擦掉了。她愣了一下，没有躲。', 'You reach over and wipe it off. She freezes, and does not pull away.'),
    say('', 'shy', '……今日のは、勝負でも、仕事でもないから。', '……今天这个，既不是比赛，也不是工作。', '...Today isn\'t a contest. Or a job.'),
    nar('她把空着的那只手伸过来，碰了碰你的手，然后整个握住了。', 'She brings her free hand over, touches yours, and then takes hold of it properly.'),
    say('', 'shy', 'ただ、繋ぎたいだけ。……理由、いる？', '只是想牵而已。……需要理由吗？', 'I just want to hold it. ...Do I need a reason?'),
    nar('你说不需要。她说「でしょ」，那是她这一年里说得最没有底气、也最不需要底气的一句话。', 'You say no. "Right," she says: the least certain thing she has said all year, and the one that needed certainty least.')
  ], [
    nar('你指了指自己的鼻子。她摸到了奶油，脸一下子红了，然后笑得停不下来。', 'You point at your own nose. She finds the cream, goes red, and then cannot stop laughing.'),
    say('', 'happy', '来年も同じクラスだったらさ。隣の席、予約しといて。', '明年要是还同班的话。旁边那个座位，给我预约着。', 'If we\'re in the same class next year. Save me the seat next to you.'),
    say('', 'neutral', '……委員長権限じゃなくて。ただの、お願い。', '……不是委员长的职权。只是，请求。', '...Not as class president. Just asking.'),
    nar('「お願い」。一年前她死也不肯用的那个软的词。', 'Asking. The soft word she would have died rather than use a year ago.')
  ]),
  done(5, 4, 4, '不当委员长的第一个放学后', 'The first afternoon she was not class president')
];
