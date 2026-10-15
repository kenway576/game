import { D, say, joke, act } from './kit';

// 北野坂的西村咖啡
export const CAFE = {
  asuka: D(
    ['明日香坐在靠窗的位置，面前摊着一本笔记，已经写满了半页——是你上周的单词小测，她在给你出\"复习题\"。', 'Asuka is at the window seat with a notebook, half a page already filled — your vocabulary quiz from last week. She is writing you \"review questions.\"'],
    ['咖啡端上来，她把笔记推到你面前：「飲み終わるまでに、全部解きなさい」。你喝得很慢。她发现了，没说什么，自己也喝得很慢。', 'When the coffee arrives she pushes the notebook across: "Finish them all before you finish your cup." You drink slowly. She notices, says nothing, and drinks slowly too.'],
    ['最后一道题，你不会。她托着下巴等。', 'The last question stumps you. She waits, chin on her hand.'],
    [say('ヒント、もらえない？', '能给个提示吗？', 'Can I get a hint?', '求救', 'Ask for help',
      ['tease', '……仕方ないわね。ヒントは、私が昨日、あんたに言った言葉よ。……覚えてないの？', '……真拿你没办法。提示是，我昨天对你说过的话。……你不记得了？', '...Fine. The hint is something I said to you yesterday. ...You don\'t remember?'],
      ['ヒント、くれない？もらう？', '一句话里混了「くれない」和「もらう」，乱了；说「もらえない？」就行。', 'Mixing くれない and もらう garbles it; just say もらえない？'],
      ['ヒント、あげない？', '「あげない？」是\"（你）不给（别人）吗\"，方向反了。', 'あげない？ asks if she won\'t give it to someone else.']),
     joke('「题目出得这么难，是想留我久一点吧。」', '"These questions are hard so I\'ll stay longer, right?"', '戳中她', 'Hit the mark',
      ['angry', 'ち、違うわよ！　あんたの実力に合わせただけ！　……コーヒー、おかわりする？', '才、才不是！只是配合你的实力！……咖啡，要续杯吗？', 'N-no! I matched your level, that\'s all! ...Want a refill?']),
     act('在最后一题旁边写上「ありがとう」', 'Write \"thank you\" beside the last question', '算是答案', 'Your answer',
      ['shy', '……答えになってないわよ。……でも、正解にしてあげる。今回だけ。', '……这不算答案。……不过，算你对。只有这次。', '...That\'s not an answer. ...But I\'ll mark it correct. This once.'])]
  ),
  hikari: D(
    ['光一看见你就从座位上站起来挥手，声音大到店里的人都看了过来。她坐下来，压低声音说「しーっ、ここ大人のお店やった」，然后自己先笑了。', 'Hikari leaps up and waves so loudly the whole café turns. She sits back down and whispers, "Shh, this is a grown-up place," then laughs first.'],
    ['她点了一杯拿铁，看见拉花是一颗心，举着杯子给你看了三遍，舍不得喝。', 'She orders a latte with a heart in the foam and shows it to you three times, unwilling to drink it.'],
    ['拿铁快凉了，心还在。', 'The latte is going cold. The heart is still there.'],
    [say('写真撮ってから、飲めば？', '拍张照再喝吧？', 'Take a photo, then drink it?', '给她出主意', 'Suggest a fix',
      ['happy', 'そっか、天才やん！　……あ、{name}くんも一緒に写って！　ハートと三人で！', '对哦，你是天才！……啊，你也一起入镜！跟爱心三个一起！', 'Oh, genius! ...Oh, you get in too! Three of us with the heart!'],
      ['写真撮ったから、飲めば？', '「撮ったから」是\"因为拍了\"，应该说\"拍了之后\"「撮ってから」。', '撮ったから means \"because\"; \"after\" is 撮ってから.'],
      ['写真撮らないで、飲めば？', '\"别拍了，喝吧\"，她会很失望。', '\"Don\'t take a photo, just drink\" — she\'d be sad.']),
     joke('「心再不喝就要凉成冰心了。」', '"Drink it before your heart turns to ice."', '玩谐音', 'A pun',
      ['tease', 'うまいこと言うやん！　……でも、うちのハートは冷めへんで？　ずっとあったかいねん！', '说得好！……不过，我的心才不会凉哦？一直都是热的！', 'Good one! ...But my heart never cools, okay? Always warm!']),
     act('拿出手机替她拍下那颗心', 'Take out your phone and photograph the heart for her', '替她留住', 'Keep it for her',
      ['shy', 'あ……撮ってくれた。……あとで送ってな。待ち受けにするから。', '啊……帮我拍了。……之后发给我哦。我要设成壁纸。', 'Oh... you took it. ...Send it later. It\'s going to be my wallpaper.'])]
  ),
  rei: D(
    ['铃已经在看菜单了——不是在选，是在读。她说这家店的菜单三十年没变过，这在统计上是很罕见的。', 'Rei is already reading the menu — reading, not choosing. It has not changed in thirty years, she says, which is statistically rare.'],
    ['店员冲咖啡的时候，她一直盯着法兰绒滤布看，嘴唇无声地动着。你凑过去听，她在数——数热水落下的秒数。', 'While the barista pours, she watches the flannel filter, lips moving silently. You lean in: she is counting — the seconds the water falls.'],
    ['咖啡端上来，她闭上眼闻了一下，睁开眼看你。', 'The coffee arrives. She closes her eyes to smell it, then opens them and looks at you.'],
    [say('何秒だった？', '几秒？', 'How many seconds?', '问她数的结果', 'Ask her count',
      ['happy', '……四十二秒です。……あなたが聞いてくれると思って、数えていました。', '……四十二秒。……我想你会问，所以一直在数。', '...Forty-two seconds. ...I counted because I thought you might ask.'],
      ['何秒でした？だった？', '「でした」和「だった」重复了，二选一。', 'でした and だった duplicated; use one.'],
      ['何秒かかる？', '\"要花几秒\"，问的是将来，不是她刚数的结果。', 'Asks about the future, not what she counted.']),
     joke('「三十年不变的菜单，跟你的笔记本一样执着。」', '"A menu unchanged for thirty years — as stubborn as your notebooks."', '比较', 'Compare',
      ['tease', '……光栄です。……私のノートも、三十年後に同じ場所にあれば、ですが。', '……荣幸。……前提是，我的笔记三十年后也在同一个地方。', '...I\'m honoured. ...Provided my notebooks are in the same place in thirty years.']),
     act('学她的样子，也闭上眼闻一下咖啡', 'Copy her: close your eyes and smell the coffee', '陪她', 'Join her',
      ['shy', '……同じことをしていますね。……観測データが、二件になりました。', '……你在做同样的事呢。……观测数据变成两条了。', '...You\'re doing the same. ...Two data points now.'])]
  ),
  inari: D(
    ['稻荷坐在窗边，手里捧着一杯热牛奶——她说咖啡\"苦すぎて、人の子の修行の味がする\"。她的尾巴从椅子后面垂下来一截，被她赶紧收了回去。', 'Inari sits by the window cradling hot milk — coffee, she says, is \"too bitter, it tastes of human penance.\" A length of tail slips down behind the chair; she hastily tucks it back.'],
    ['她说这家店开张的那天，她也来过。那时候坡上还没这么多洋房，店主还很年轻。她说得很平静，像在说上个星期。', 'She says she came the day this café opened. There were fewer Western houses on the slope then, and the owner was young. She says it calmly, as if it were last week.'],
    ['她把牛奶推到你面前一点：尝尝。', 'She nudges the milk toward you: try it.'],
    [say('店長さん、若い頃どんな人でしたか。', '店长年轻的时候，是什么样的人？', 'What was the owner like when he was young?', '对她的记忆好奇', 'Be curious about her memory',
      ['happy', 'よう笑う男であった。……今は、笑うと皺が増えるがの。人の子は、そこがよい。', '是个爱笑的男人。……现在一笑皱纹就变多了。人类的孩子，就好在这里。', 'A man who laughed a lot. ...Now his laughs come with more wrinkles. That\'s what is good about humans.'],
      ['店長さん、若い頃どんな人だでしたか。', '「だ」和「でした」不能叠在一起。', 'だ and でした cannot stack.'],
      ['店長さん、若い頃どんな人になりますか。', '\"年轻时会变成什么样的人\"，时态乱了。', 'Asks what he WILL become when young — tense chaos.']),
     joke('「千年都来过的店，你就没有会员卡吗？」', '"A café you\'ve visited for ages — no loyalty card?"', '调侃', 'Tease',
      ['tease', '……ポイントなるものは、神には付かぬらしい。理不尽じゃ。', '……所谓的积分，好像不给神算。真是不讲理。', '...Points, it seems, are not granted to gods. Most unjust.']),
     act('尝了一口她的牛奶，又推回去', 'Take a sip of her milk and push it back', '分享', 'Share',
      ['shy', '……飲んだな。……間接、というやつか。……人の子の作法は、面妖じゃのう。', '……喝了啊。……这就是所谓的间接吗。……人类的规矩，真是奇妙。', '...You drank. ...So this is \"indirect.\" ...Human customs are strange.'])]
  ),
  miyuki: D(
    ['深雪坐在窗边，正在看一本很旧的料理书，看见你，把书合上，书签是一张超市的收据。她说她每个月来一次，点一样的东西，坐一样的位置。', 'Miyuki sits by the window reading an old cookbook. When she sees you she closes it on a bookmark made from a supermarket receipt. She comes once a month, she says — same order, same seat.'],
    ['她说今天第一次，带了别人来。说完她低头搅咖啡，搅了很久，咖啡已经不需要再搅了。', 'Today is the first time she has brought someone. Then she stirs her coffee for a long time, long after it needs stirring.'],
    ['店员来问要不要续杯。她看着你。', 'The waiter asks about refills. She looks at you.'],
    [say('来月も、一緒に来てもいいですか。', '下个月，也可以一起来吗？', 'May I come with you next month too?', '想成为她的常规', 'Join her ritual',
      ['shy', '……あら。……毎月の、決まりになっちゃうわよ？　……それでも、いいの？', '……哎呀。……这样会变成每个月的惯例哦？……那样也可以吗？', '...Oh. ...It would become a monthly rule, you know? ...Is that all right?'],
      ['来月も、一緒に来てもいいでしたか。', '请求许可用现在形「いいですか」，不用过去形。', 'Asking permission uses いいですか, not the past.'],
      ['先月も、一緒に来てもいいですか。', '「先月」是\"上个月\"，请求不了过去。', '先月 is last month — you can\'t ask about the past.']),
     joke('「收据当书签，是主妇的智慧？」', '"A receipt as a bookmark — housewife wisdom?"', '注意到', 'Notice it',
      ['tease', 'ふふ、ばれちゃった。……これはね、去年の、一番高かった晩ご飯のレシート。記念なの。', '呵呵，被发现了。……这个啊，是去年最贵的一顿晚饭的收据。纪念。', 'Hehe, caught. ...This is the receipt from last year\'s most expensive dinner. A memento.']),
     act('替她叫店员，续两杯一样的', 'Call the waiter and order two of the same', '跟她点一样的', 'Order what she has',
      ['happy', '……同じものを、二つ。……ふふ、今日から、それが私たちの決まりね。', '……一样的，两杯。……呵呵，从今天起，这就是我们的惯例了。', '...Two of the same. ...Hehe, from today that\'s our rule.'])]
  ),
  sora: D(
    ['空坐在靠门的位置，一条腿抖个不停，看起来随时准备冲出去。她说这种安静的店让她\"落ち着かん\"，但她点的是全店最贵的那种手冲。', 'Sora sits by the door, one leg jiggling, ready to bolt. Quiet places make her \"restless,\" she says — yet she ordered the most expensive pour-over in the house.'],
    ['她喝了一口，表情僵住了，又喝了一口，眉头皱得更深。她说「……うまいんか、これ。わからん」，但杯子没放下。', 'She sips, freezes, sips again, frowns harder. "...Is this good? No idea." But she does not put the cup down.'],
    ['她把杯子推给你：「お前、わかる？」', 'She pushes the cup to you: "Can you tell?"'],
    [say('ミルク、入れてみたら？', '加点牛奶试试？', 'Try adding some milk?', '给个台阶', 'Offer an out',
      ['happy', '……おお。……うまい！　最初からこうせえや！　……って、ウチが頼んだんか。', '……哦哦。……好喝！一开始就该这样！……等等，是我自己点的啊。', '...Oh. ...Tasty! Should\'ve done this from the start! ...Wait, I ordered it.'],
      ['ミルク、入ってみたら？', '「入る」是自动词，加东西要用他动词「入れる」。', '入る is intransitive; adding something is 入れる.'],
      ['ミルク、抜いてみたら？', '「抜く」是\"去掉\"，黑咖啡里没牛奶可去。', '抜く means remove — there\'s no milk to remove.']),
     joke('「点最贵的，是为了装大人吗？」', '"Ordered the priciest one to act grown-up?"', '戳破', 'Call it',
      ['angry', 'ちゃうわ！　……一番高いのが、一番うまいと思たんや。……ちゃうんか。', '才不是！……我以为最贵的就最好喝。……不是吗。', 'No! ...I figured the most expensive one tastes best. ...Doesn\'t it.']),
     act('把自己那杯加了糖的换给她', 'Swap your sweetened cup for hers', '换着喝', 'Trade cups',
      ['shy', '……ええんか。……お前、これ飲むんか。苦いで。……ありがとな。', '……可以吗。……你要喝这个吗。很苦哦。……谢了。', '...You sure? ...You\'re drinking that? It\'s bitter. ...Thanks.'])]
  ),
  nao: D(
    ['奈绪坐在最里面的角落，背对着窗，面前只有一杯水。她说「先に頼むの、こわかった」——她在等你来，才敢点。', 'Nao is in the back corner, back to the window, only a glass of water in front of her. "I was scared to order first" — she waited for you before daring to.'],
    ['菜单上的字很多，她看了一会儿，小声问你「ブレンド」是什么意思。你解释完，她点了点头，点了一杯热可可。', 'The menu is wordy. After a while she asks quietly what \"blend\" means. You explain; she nods and orders hot cocoa.'],
    ['热可可来了，上面浮着一颗棉花糖。', 'The cocoa arrives with a marshmallow floating on top.'],
    [say('ココア、一口ちょうだい。', '可可，给我尝一口。', 'Give me a sip of your cocoa.', '向她要', 'Ask her',
      ['shy', '……いいよ。……マシュマロは、だめ。さいごに たべるから。', '……可以。……棉花糖不行。我要最后吃。', '...Okay. ...Not the marshmallow. I\'m eating that last.'],
      ['ココア、一口ちょうだいだ。', '「ちょうだい」本身就是请求，后面不加「だ」。', 'ちょうだい is already a request; no だ.'],
      ['ココア、一口あげる。', '「あげる」是\"我给你一口\"，方向反了。', 'あげる means you would give her some.']),
     joke('「来了咖啡店点可可，跟小学一样。」', '"Cocoa at a coffee shop — just like primary school."', '翻旧账', 'Bring up the past',
      ['pout', '……にがいの、にがて。……あんただって、むかし コーヒー こぼしたくせに。', '……我不喜欢苦的。……你以前不也打翻过咖啡。', '...I don\'t like bitter. ...You spilled coffee once, remember.']),
     act('把她那杯水也续满', 'Top up her glass of water', '照顾她', 'Look after her',
      ['happy', '……ありがと。……あんたと いると、ちゃんと たのめる。', '……谢谢。……跟你在一起，就能好好点单了。', '...Thanks. ...With you here, I can order properly.'])]
  ),
  maki: D(
    ['真希坐在窗边，正在给咖啡拍照，换了七个角度。她说这家店\"映える\"，但她其实不喝咖啡——她点的是奶昔，咖啡是给你点的。', 'Maki is photographing a coffee from seven angles. The café is \"photogenic,\" she says, but she does not drink coffee — her milkshake is hers; the coffee is for you.'],
    ['她把照片发到了网上，配文写着「せんぱいとカフェ♡」，然后把手机屏幕扣在桌上，说「……冗談やで。下書きや」。', 'She posts a photo captioned \"café with senpai ♡\" — then flips her phone face-down. "...Kidding. It\'s a draft."'],
    ['她的手机在桌上震了一下。她没看。', 'Her phone buzzes on the table. She doesn\'t look.'],
    [say('今の写真、あとで送って。', '刚才那张照片，之后发我。', 'Send me that photo later.', '想要照片', 'Want the photo',
      ['shy', '……は？　……ほしいん？　……しゃあないな。ウチの写真、高いで？', '……哈？……你想要？……真拿你没办法。我的照片很贵哦？', '...Huh? ...You want it? ...Fine. My photos are expensive, y\'know?'],
      ['今の写真、あとで送られて。', '被动「送られて」不成请求，要用「送って」。', 'Passive 送られて isn\'t a request; use 送って.'],
      ['今の写真、あとで消して。', '\"之后删掉\"，跟你想要照片相反。', '\"Delete it later\" — the opposite.']),
     joke('「真的是草稿吗？那我看一下。」', '"Really a draft? Then let me see."', '追问', 'Press her',
      ['angry', 'あかんあかん！　見せへん！　……下書きは、下書きやから！　ざぁこ！', '不行不行！不给看！……草稿就是草稿！杂鱼！', 'No no no! Not showing! ...A draft is a draft! Loser!']),
     act('把咖啡往她那边推一推：「你也喝一口？」', 'Push the coffee toward her: \"Want a sip?\"', '分享', 'Share',
      ['tease', '……にがっ！　……せんぱい、よう飲めるな。……大人ぶっとるだけやろ？', '……好苦！……前辈你居然喝得下去。……只是在装大人吧？', '...Bitter! ...How can you drink this, senpai? ...Just pretending to be grown-up, right?'])]
  )
};
