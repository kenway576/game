import { D, say, joke, act } from './kit';

// 神户牛铁板烧
export const TEPPANYAKI = {
  asuka: D(
    ['明日香坐在铁板前面，看着菜单上的价格，眉头皱得紧紧的。她小声说\"……学生には、分不相応よ\"，可是当厨师把牛肉放在铁板上、发出\"滋——\"的一声时，她的眼睛亮了。', 'At the teppan counter Asuka frowns at the menu prices: \"...Beyond a student\'s station.\" But when the chef lays the beef down with a sizzle, her eyes light up.'],
    ['厨师切下第一块，放在她面前。她用筷子夹起来，放进嘴里，然后整个人都安静了。过了好一会儿，她才说：\"……溶けたわ\"。', 'The chef places the first cut before her. She lifts it with her chopsticks, eats, and goes completely still. Long moments later: \"...It melted.\"'],
    ['她转过头，看着你，表情很复杂：\"……今日のこと、一生、忘れないと思う\"。', 'She turns to you, her expression complicated: \"...I don\'t think I\'ll ever forget today.\"'],
    [say('明日香と一緒に食べたから、もっとおいしかった。', '因为是跟你一起吃，所以更好吃了。', 'Eating it with you made it even better.', '老实说', 'Honestly',
      ['shy', '……もう。……そういうこと、さらっと言わないでよ。……お肉より、そっちのほうが、溶けそう。', '……真是的。……这种话，别说得那么轻松。……比起肉，我更像是要融化了。', '...Honestly. ...Don\'t say things like that so casually. ...I\'m the one melting, not the beef.'],
      ['明日香と一緒に食べたから、もっとおいしいかった。', '形容词过去形是「おいしかった」，不是「おいしいかった」。', 'Past of おいしい is おいしかった.'],
      ['高いわりには、普通だったね。', '\"这么贵，也就一般\"——她刚说一辈子忘不了。', '\"Pretty ordinary for the price\" — she just said she\'d never forget it.']),
     joke('「分不相应——那你刚才是不是吃了两份？」', '"Beyond your station — yet didn\'t you have two servings?"', '打趣', 'Tease',
      ['angry', 'に、二枚目は、シェフが勧めてくれたからよ！　……断るのは、失礼でしょ。', '第、第二块是厨师推荐的！……拒绝的话，很失礼吧。', 'Th-the second was the chef\'s recommendation! ...Refusing would be rude.']),
     act('把你盘子里最好的那一块，夹给她', 'Pass her the best piece from your plate', '让给她', 'Give it to her',
      ['happy', '……いいの？　……じゃあ、私のも、半分あげる。……交換ね。……こういうの、ちょっと、憧れてたの。', '……可以吗？……那我的也分你一半。……交换。……这种事，我有点向往很久了。', '...Really? ...Then have half of mine. ...A swap. ...I\'ve kind of always wanted to do this.'])]
  ),
  hikari: D(
    ['光一坐下就被铁板上的火焰吓了一跳——厨师在做火焰表演。火苗窜起来的时候，她\"きゃー！\"地叫了一声，然后拍手拍得比谁都响。', 'Hikari jumps as the chef does a flambé — when the flames leap she squeals, then claps louder than anyone.'],
    ['牛肉端上来，她咬了一口，眼睛瞪得圆圆的，用手捂着嘴，发出了一串没有意义的声音：\"んーーーっ！\"', 'The beef arrives. One bite and her eyes go perfectly round; hand over mouth, she lets out a meaningless \"mmmmm!\"'],
    ['她咽下去，抓着你的袖子：\"{name}くん！　これ、ほっぺた落ちる！　ほんまに落ちる！\"', 'Swallowing, she grabs your sleeve: \"This is so good my cheeks are falling off! Really falling!\"'],
    [say('光ちゃんのほっぺた、落ちないように押さえておくよ。', '我帮你按住脸颊，别让它掉了。', 'I\'ll hold your cheeks so they don\'t fall.', '接她的梗', 'Play along',
      ['shy', '……え、ちょ、ほんまに押さえるん！？　……あ、あかん、今度は顔、熱なってきた。……鉄板のせいやで！', '……诶，等等，真的要按吗！？……不、不行，这次脸热起来了。……都怪铁板！', '...Eh, wait, you\'re really holding them?! ...N-no, now my face is hot. ...It\'s the griddle!'],
      ['光ちゃんのほっぺた、落ちないように押さえさせるよ。', '使役「押さえさせる」是\"让（别人）按住\"，意思不对。', '押さえさせる means \"make someone hold\".'],
      ['ほっぺたは落ちないよ、大げさだな。', '\"脸颊又不会掉，太夸张了\"——太较真。', '\"Cheeks don\'t fall off, drama queen\" — too literal.']),
     joke('「火焰表演的时候你叫得最大声，拍手也最响。」', '"Loudest scream at the flambé, and the loudest clapping."', '打趣', 'Tease',
      ['tease', 'リアクションは、関西人の礼儀やねん！　……シェフも、喜んでたやろ？', '反应是关西人的礼仪！……厨师也很开心吧？', 'Reactions are Kansai etiquette! ...The chef looked pleased, right?']),
     act('请厨师再做一次火焰表演，专门给她看', 'Ask the chef for one more flambé, just for her', '让她再开心一次', 'Delight her again',
      ['happy', 'わぁぁ！　……{name}くん、ありがと！　……今日のこと、絵日記に描くわ。{name}くんも、描いとくな。', '哇啊啊！……谢谢你！……今天的事，我要画在图画日记里。你也画上去。', 'Whoaaa! ...Thank you! ...I\'m drawing today in my picture diary. You\'re going in too.'])]
  ),
  rei: D(
    ['铃坐在铁板前面，认真地观察厨师的每一个动作。她说牛肉的脂肪熔点只有二十五度左右，所以\"口の中で溶ける\"不是比喻，是物理事实。', 'Rei studies every move of the chef. Wagyu fat melts at about 25 degrees, she explains, so \"melts in your mouth\" isn\'t a metaphor — it\'s physics.'],
    ['牛肉端上来，她夹起一块，先观察了一下截面的颜色，然后放进嘴里。她闭上眼睛，嚼了很久。', 'When the beef comes she examines the cross-section\'s colour, then eats. Eyes closed, she chews for a long time.'],
    ['她睁开眼睛：\"……物理的事実を、体験で確認しました。……想定以上です\"。', 'She opens her eyes: \"...Physical fact confirmed by experience. ...Beyond expectations.\"'],
    [say('鈴の「想定以上」、初めて聞いた。', '第一次听你说\"超出预期\"。', 'First time I\'ve heard you say \"beyond expectations\".', '注意到了', 'You noticed',
      ['shy', '……そうですか。……今日は、二回目です。……一回目は、あなたが、今日のデートに誘ってくれたとき。', '……是吗。……今天是第二次了。……第一次，是你约我今天出来的时候。', '...Is that so. ...Today it\'s the second time. ...The first was when you asked me out today.'],
      ['鈴の「想定以上」、初めて聞かせた。', '使役「聞かせた」是\"让（别人）听\"，主客颠倒。', '聞かせた means \"made someone hear\".'],
      ['鈴は、いつも想定通りだよね。', '\"你总是在预料之中\"——她刚刚被打破了。', '\"You\'re always as expected\" — she was just surprised.']),
     joke('「熔点二十五度——那你现在的体温，是不是也快融化了？」', '"Melting point 25 degrees — are you about to melt too?"', '逗她', 'Tease',
      ['tease', '……私の融点は、もっと高いです。……でも、あなたの隣だと、少し下がる傾向があります。', '……我的熔点更高。……不过，在你旁边的时候，有下降的倾向。', '...My melting point is higher. ...But next to you, it tends to drop.']),
     act('请厨师讲讲怎么判断牛肉的熟度', 'Ask the chef how he judges doneness', '满足她的好奇心', 'Feed her curiosity',
      ['happy', '……！　……指で押した弾力で、判断するんですね。……あなたは、私の知りたいことを、いつも分かっています。', '……！……用手指按的弹性来判断啊。……你总是知道我想知道什么。', '...! ...By the springiness when pressed. ...You always know what I want to learn.'])]
  ),
  inari: D(
    ['稻荷看着铁板上的牛肉，表情很严肃。她说在她那个年代，牛是用来耕田的，\"食うなど、とんでもない\"。可是香味飘过来，她的鼻子动了动。', 'Inari regards the beef gravely. In her day, oxen ploughed fields — \"eating them was unthinkable.\" But the aroma drifts over and her nose twitches.'],
    ['厨师把第一块放在她面前。她盯着它，犹豫了很久，然后小声说\"……時代は、変わるものじゃな\"，夹起来吃了。', 'The chef sets the first piece before her. She stares, hesitates a long time, then murmurs \"...times change,\" and eats it.'],
    ['她的尾巴，在身后，慢慢地、慢慢地摇了起来。', 'Behind her, her tails slowly, slowly begin to sway.'],
    [say('稲荷様の尻尾、正直ですね。', '稻荷大人的尾巴，很诚实呢。', 'Your tails are honest, Inari-sama.', '戳穿', 'Call it out',
      ['shy', '……！　……み、見るでない！　……尾は、勝手に動くのじゃ。……わらわの意思ではない。……うまかったが。', '……！……不、不许看！……尾巴是自己动的。……不是我的意思。……虽然很好吃。', '...! ...D-don\'t look! ...Tails move on their own. ...Not by my will. ...Though it was delicious.'],
      ['稲荷様の尻尾、正直いですね。', '「正直」是な形容词，不加「い」：「正直ですね」。', '正直 is a na-adjective: 正直ですね, not 正直いですね.'],
      ['稲荷様、牛を食べてもいいんですか。', '\"你可以吃牛吗？\"——她刚刚说服了自己。', '\"Are you allowed to eat beef?\" — she just talked herself into it.']),
     joke('「耕田的牛……那神明大人现在算是背叛了农民吗？」', '"Plough oxen — have you betrayed the farmers?"', '打趣', 'Tease',
      ['angry', 'う、裏切ってなどおらぬ！　……感謝して、いただいておるのじゃ。……いただきます、と言うたであろう。', '没、没有背叛！……是怀着感谢吃的。……我说过「我开动了」吧。', 'I-I have not betrayed anyone! ...I eat with gratitude. ...I said itadakimasu, didn\'t I?']),
     act('点一份铁板煎的油豆腐，作为甜品前的加餐', 'Order teppan-grilled fried tofu as an extra course', '她的最爱', 'Her favourite',
      ['happy', '……！　……鉄板で、油揚げを！？　……そなた、天才か。……今日一番の、ご馳走じゃ。', '……！……用铁板煎油豆腐！？……你是天才吗。……今天最棒的美食。', '...! ...Fried tofu on the teppan?! ...Are you a genius? ...The finest dish of the day.'])]
  ),
  miyuki: D(
    ['深雪说这家铁板烧，她只在\"人生の節目\"来过两次：一次是工作转正的时候，一次是三十岁生日。', 'Miyuki has only come to this teppanyaki twice, at life milestones: when she became a permanent employee, and on her thirtieth birthday.'],
    ['你问她今天是什么节目。她看着铁板上滋滋作响的牛肉，笑着说：\"……さあ、何かしら。……後で、分かるかもね\"。', 'What milestone is today? Watching the sizzling beef, she smiles: \"...Who knows. ...Maybe I\'ll find out later.\"'],
    ['她举起一杯乌龙茶，跟你碰杯：\"……今日を、三回目の節目にしてもいい？\"', 'She raises a glass of oolong to clink with yours: \"...May I make today my third milestone?\"'],
    [say('深雪さんの大事な日に、一緒にいられて嬉しいです。', '能在深雪小姐重要的日子陪着你，我很高兴。', 'I\'m happy to be with you on an important day.', '回应她', 'Answer her',
      ['shy', '……あら。……「大事な日」って、言ってくれるのね。……ふふ、じゃあ、毎年、ここに来ましょう。今日を、記念日にして。', '……哎呀。……你说是「重要的日子」呢。……呵呵，那每年都来这里吧。把今天当作纪念日。', '...Oh. ...You call it \"an important day\". ...Hehe, then let\'s come here every year. Make today an anniversary.'],
      ['深雪さんの大事な日に、一緒にいさせて嬉しいです。', '使役「いさせて」后面直接接「嬉しい」不通，要说「いさせてもらえて」或「いられて」。', 'いさせて can\'t join 嬉しい directly; use いられて.'],
      ['節目って、大げさじゃないですか。', '\"纪念日太夸张了吧\"——她鼓起勇气说的话。', '\"Milestone is a bit much\" — she worked up the nerve to say it.']),
     joke('「三十岁生日一个人来吃铁板烧——深雪小姐好酷。」', '"Teppanyaki alone on your thirtieth — so cool."', '夸里带逗', 'Teasing praise',
      ['tease', 'ふふ、強がりよ。……一人で、お肉、泣きながら食べたわ。……今日は、泣かないで済みそう。', '呵呵，是逞强啦。……一个人，边哭边吃肉。……今天，好像不用哭了。', 'Hehe, that was bravado. ...I ate the beef crying, alone. ...Today, I don\'t think I\'ll need to.']),
     act('悄悄跟厨师说，甜品的时候在盘子上写\"記念日\"', 'Quietly ask the chef to write \"Anniversary\" on her dessert plate', '给她惊喜', 'Surprise her',
      ['happy', '……！　……もう、いつの間に。……ずるいわ、本当に。……写真、撮らせて。……一生、消さないから。', '……！……真是的，什么时候。……太狡猾了，真的。……让我拍张照。……一辈子都不删。', '...! ...When did you... ...So unfair, truly. ...Let me take a photo. ...I\'ll never delete it.'])]
  ),
  sora: D(
    ['空说铁板烧\"量が少ない\"，可是第一块牛肉进嘴以后，她就没再说话了。她闭着眼睛，嚼得很慢，跟她平时狼吞虎咽完全不一样。', 'Sora complains teppanyaki portions are small — but after the first bite she says nothing more. Eyes closed, she chews slowly, nothing like her usual wolfing.'],
    ['她咽下去，睁开眼睛，认真地说：\"……これ、試合の前に食べたら、絶対勝てるわ\"。', 'Swallowing, she opens her eyes and says seriously: \"...Eat this before a match and you\'d win for sure.\"'],
    ['厨师笑着问她要不要再来一份。她看了看价格，又看了看你，犹豫了。', 'The chef laughs and asks if she wants another. She glances at the price, then at you, and hesitates.'],
    [say('大会の前祝いに、もう一枚どうぞ。', '就当是比赛前的庆祝，再来一份吧。', 'Have another — an early celebration for the tournament.', '请她', 'Treat her',
      ['shy', '……お、おう。……前祝いか。……ほな、絶対勝たなあかんな。……負けたら、お前に借り、返されへんし。', '……哦、嗯。……提前庆祝吗。……那一定得赢了。……输了的话，欠你的就还不上了。', '...O-okay. ...An early celebration. ...Then I HAVE to win. ...If I lose I can\'t repay you.'],
      ['大会の前祝いに、もう一枚どうぞされて。', '「どうぞされて」不成立，就说「どうぞ」。', 'どうぞされて doesn\'t exist; just どうぞ.'],
      ['高いから、一枚で我慢しよう。', '\"太贵了，一份就忍着吧\"——她正犹豫的时候。', '\"Too pricey, make do with one\" — just as she hesitated.']),
     joke('「说分量少的人，吃得比谁都慢。」', '"The one who said the portions were small is eating slowest."', '打趣', 'Tease',
      ['tease', '……味わっとるんや。……こんなええ肉、早食いしたら、牛に失礼やろ。', '……在品味啊。……这么好的肉，吃快了，对牛不礼貌吧。', '...I\'m savouring it. ...Wolfing meat this good would be rude to the cow.']),
     act('跟厨师说，把你那份的一半给她', 'Ask the chef to give her half of your portion', '分给她', 'Share yours',
      ['happy', '……！　……お前、ほんま、ええ奴やな。……今度の大会、お前のために走ったる。……絶対や。', '……！……你真是个好人。……下次比赛，为你跑。……一定。', '...! ...You\'re a really good guy. ...Next tournament, I\'ll run for you. ...Promise.'])]
  ),
  nao: D(
    ['奈绪坐在铁板前面，很紧张。高级餐厅的气氛让她不知所措，她一直低着头，小声跟你说话，像怕被厨师听见。', 'Nao sits stiffly at the teppan counter, overwhelmed by the upscale atmosphere. Head down, she whispers to you as if afraid the chef will hear.'],
    ['厨师很温柔，看出她紧张，切了一块很小的、形状像心的牛肉放在她面前。她看着那块牛肉，愣住了。', 'The kind chef notices and places a small heart-shaped cut before her. She stares at it, stunned.'],
    ['她小声说：\"……たべるの、もったいない\"，然后拿出手机，拍了一张照片。', '\"...Too precious to eat,\" she whispers, and takes a photo.'],
    [say('写真に残したから、もう食べても大丈夫だよ。', '已经拍下来了，可以吃了哦。', 'You\'ve got the photo, so it\'s okay to eat now.', '轻轻推她', 'A gentle nudge',
      ['shy', '……うん。……あんたが いうなら。……いただきます。……！　……おいしい。……あんたも、たべて。はやく。', '……嗯。……你这么说的话。……我开动了。……！……好吃。……你也吃。快点。', '...Mm. ...If you say so. ...Itadakimasu. ...! ...Delicious. ...You eat too. Quick.'],
      ['写真に残させたから、もう食べても大丈夫だよ。', '使役「残させた」是\"让（别人）留下\"，多余。', '残させた adds a needless causative.'],
      ['冷めるから、早く食べなよ。', '\"会凉的，快吃\"——她正珍惜着呢。', '\"It\'ll get cold, eat up\" — while she\'s treasuring it.']),
     joke('「厨师给你切了个心形——他是不是看出什么了？」', '"The chef cut you a heart — did he notice something?"', '逗她', 'Tease',
      ['pout', '……しらない。……でも、シェフさん、にこにこ してた。……ばれてる、かも。', '……不知道。……不过，厨师在笑。……可能，被看穿了。', '...Don\'t know. ...But the chef was smiling. ...He might know.']),
     act('请厨师也给你切一块心形的，放在她的旁边', 'Ask the chef for a heart-shaped cut for you too, set beside hers', '两颗心', 'Two hearts',
      ['happy', '……ハート、ふたつ。……ならんでる。……これも、しゃしん とる。……ふたりの しゃしん。', '……两颗心。……排在一起。……这个也要拍。……两个人的照片。', '...Two hearts. ...Side by side. ...Taking a photo of this too. ...Our photo.'])]
  ),
  maki: D(
    ['真希坐在铁板前，表情像在看一场直播。厨师翻动牛肉、切菜、浇酒点火，她每看一个动作就小声评论：\"……フレーム単位で無駄がない\"。', 'Maki watches the chef like a livestream. Flipping, slicing, flambéing — after each move she murmurs: \"...Not a wasted frame.\"'],
    ['牛肉端上来，她咬了一口，愣了三秒，然后放下筷子，双手合十，对着厨师鞠了一躬。厨师笑了。', 'The beef arrives. One bite, three seconds frozen, then she sets down her chopsticks, presses her palms together, and bows to the chef. He laughs.'],
    ['她转过头，看着你：\"……せんぱい、これ、実績解除や。「神戸牛を食べた」\"。', 'She turns to you: \"...Senpai, achievement unlocked: \'Ate Kobe beef\'.\"'],
    [say('真希と一緒に解除できて、嬉しいよ。', '能跟真希一起解锁，很开心。', 'I\'m glad I unlocked it with you.', '接梗', 'Play along',
      ['shy', '……せんぱい、それ、協力プレイ実績やで。……二人でしか、取られへんやつ。……レアやな。', '……前辈，这是合作模式成就哦。……只有两个人才能拿到的那种。……很稀有呢。', '...Senpai, that\'s a co-op achievement. ...The kind you can only get with two. ...Rare.'],
      ['真希と一緒に解除させて、嬉しいよ。', '使役「解除させて」后面直接接「嬉しい」不通，要说「解除できて」。', '解除させて can\'t join 嬉しい; say 解除できて.'],
      ['実績とか、どうでもいいよ。', '\"成就什么的无所谓\"——她最在乎这个。', '\"Achievements don\'t matter\" — they matter to her.']),
     joke('「你刚才给厨师鞠躬，是在打赏主播吗。」', '"Bowing to the chef — tipping the streamer?"', '吐槽', 'Snark',
      ['tease', '……スパチャや。……感謝の気持ちは、ちゃんと伝えなあかん。……せんぱいにも、あとでスパチャしたる。', '……打赏。……感谢的心情要好好传达。……之后也给前辈打赏。', '...A super chat. ...Gratitude must be expressed. ...I\'ll super-chat you later too.']),
     act('请厨师在她的盘子上，用酱汁画一个像素风的心', 'Ask the chef to draw a pixel-art heart in sauce on her plate', '为她定制', 'Custom-made for her',
      ['happy', '……！　……ドット絵のハート……！　……シェフ、神や。……せんぱいも、神や。……今日、神しかおらん。', '……！……像素风的心……！……厨师是神。……前辈也是神。……今天，只有神。', '...! ...A pixel heart...! ...The chef is a god. ...Senpai\'s a god too. ...Nothing but gods today.'])]
  )
};
