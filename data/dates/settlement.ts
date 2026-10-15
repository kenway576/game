import { D, say, joke, act } from './kit';

// 旧居留地的下午茶
export const SETTLEMENT = {
  asuka: D(
    ['明日香在西洋馆的茶室里坐得笔直，膝盖并拢，手放在腿上，像在参加面试。服务员端上三层点心架，她小声问你\"……どれから食べるのが、正式なの？\"', 'In the Western-style tearoom Asuka sits ramrod straight, knees together, hands in lap, as if at an interview. When the three-tier stand arrives she whispers: \"...Which tier is proper to start with?\"'],
    ['你说从下往上，她点头，认真地从三明治开始，切成小块，一小口一小口地吃。吃到司康的时候，她终于放松了一点，涂了很厚的奶油。', 'Bottom up, you say. She nods and starts on the sandwiches, cutting them small. By the scones she relaxes and lays on the cream thickly.'],
    ['她注意到你在看她的奶油，脸红了：\"……今日は、特別だから\"。', 'She sees you eyeing her cream and flushes: \"...Today\'s special.\"'],
    [say('特別な日に、誘ってくれてありがとう。', '谢谢你在特别的日子邀请我。', 'Thank you for inviting me on a special day.', '接住\"特别\"', 'Catch the word \"special\"',
      ['shy', '……べ、別に、あなたと来るから特別ってわけじゃ……。……そういうわけ、だけど。', '……也、也不是因为跟你来才特别的……。……虽然就是那样。', '...I-it\'s not special because I\'m with you... ...Well, it is, actually.'],
      ['特別な日に、誘ってあげてありがとう。', '「てあげて」是\"我给你\"，对她的邀请要说「てくれて」。', 'てあげて faces outward; for her invitation, てくれて.'],
      ['特別な日なのに、来なければよかった。', '\"特别的日子，不该来的\"，太伤人。', '\"I shouldn\'t have come on a special day\" — hurtful.']),
     joke('「班长，你喝下午茶的姿势，像在接受检阅。」', '"You take tea like you\'re being inspected."', '吐槽', 'Snark',
      ['angry', 'マナーは大事でしょ！　……あなたこそ、小指、立てすぎよ。それはマナー違反。', '礼仪很重要吧！……你才是，小指翘得太高了。那是违反礼仪的。', 'Manners matter! ...You\'re the one sticking your pinky out too far. That\'s a violation.']),
     act('把自己那份司康的奶油也推给她', 'Push your scone\'s cream over to her too', '特别的日子', 'It\'s a special day',
      ['happy', '……いいの？　……ふふ、今日の私、ちょっと悪い子ね。……あなたのせいよ。', '……可以吗？……呵呵，今天的我，有点坏孩子呢。……都怪你。', '...Really? ...Hehe, I\'m being a bit naughty today. ...Your fault.'])]
  ),
  hikari: D(
    ['光一进门就被茶室的装潢镇住了，小声说\"お姫様の部屋みたい\"。她坐下来，学着旁边的贵妇人翘起小指拿茶杯，结果手一抖，红茶洒在了碟子里。', 'Hikari is awed by the tearoom — \"like a princess\'s room.\" She copies the lady at the next table, pinky raised, and spills tea into her saucer.'],
    ['她慌忙用纸巾擦，然后放弃了，用两只手捧着茶杯喝，像在喝热可可。\"こっちのほうが、うちらしいわ\"。', 'She dabs frantically, then gives up and holds the cup in both hands like hot cocoa. \"This is more me.\"'],
    ['她咬了一口马卡龙，眼睛一下子睁大了。', 'She bites a macaron and her eyes go wide.'],
    [say('光ちゃんらしい飲み方、いいと思う。', '你的喝法很像你，挺好的。', 'Drinking it your way — I like that.', '肯定她', 'Affirm her',
      ['happy', 'ほんま？　……お嬢様にはなられへんけど、{name}くんがええって言うなら、このままでええわ。', '真的？……虽然当不了大小姐，不过你说好的话，就这样吧。', 'Really? ...I\'ll never be a proper lady, but if you say it\'s fine, I\'ll stay like this.'],
      ['光ちゃんらしいの飲み方、いいと思う。', '「らしい」直接修饰名词，不加「の」。', 'らしい modifies the noun directly; no の.'],
      ['もっとちゃんと飲んだほうがいいと思う。', '\"还是好好喝比较好\"，她会缩起来。', '\"You should drink properly\" — she\'d shrink.']),
     joke('「刚才翘小指那一下，贵妇人都看见了。」', '"That pinky moment — the lady next to us saw."', '打趣', 'Tease',
      ['pout', 'もう、言わんといて！　……お手本にしたのに、お手本に見られてもうた。恥ずっ。', '真是的，别说了！……拿她当榜样，结果被榜样看见了。丢死人了。', 'Don\'t remind me! ...I copied her and she saw me do it. So embarrassing.']),
     act('把自己的马卡龙也给她', 'Give her your macaron too', '她刚才眼睛都亮了', 'Her eyes lit up',
      ['shy', 'えっ、ええの？　……{name}くんの分やのに。……じゃ、半分こ。はい、あーん。', '诶，可以吗？……明明是你的那份。……那一人一半。来，啊——', 'Eh, really? ...It\'s yours. ...Then halves. Here, say \"ah\".'])]
  ),
  rei: D(
    ['铃对茶室的建筑很感兴趣。她说这栋洋馆是明治时代的，抬头看了天花板的装饰很久，说那是\"英国のヴィクトリア様式の影響です\"。', 'Rei is fascinated by the architecture: Meiji-era, she says, studying the ceiling mouldings — \"Victorian influence.\"'],
    ['红茶端上来，她先闻了一下，说出了茶叶的产地。服务员惊讶地看着她，她平静地补充：\"本で読みました\"。', 'When the tea arrives she sniffs it and names its origin. The waiter stares; she adds calmly: \"I read it in a book.\"'],
    ['她用很标准的姿势喝了一口，然后，难得地，笑了。', 'She sips with perfect form, and — rarely — smiles.'],
    [say('鈴が笑うと、紅茶がもっと美味しくなる。', '你一笑，红茶都更好喝了。', 'When you smile, the tea tastes better.', '大胆一点', 'Be bold',
      ['shy', '……そ、その相関関係は、証明されていません。……でも、私も、同じことを感じています。あなたが笑うと。', '……那、那个相关关系还没被证明。……不过，我也有同样的感觉。你笑的时候。', '...Th-that correlation is unproven. ...But I feel the same. When you smile.'],
      ['鈴が笑わせると、紅茶がもっと美味しくなる。', '使役「笑わせる」是\"让别人笑\"，意思不对。', '笑わせる means \"make someone laugh\".'],
      ['鈴が笑っても、紅茶の味は変わらない。', '\"你笑不笑茶都一样\"，太理性了，比她还理性。', '\"Your smile doesn\'t change the tea\" — more clinical than her.']),
     joke('「闻一下就知道产地，你是红茶侦探吗？」', '"One sniff and you know the origin — a tea detective?"', '吐槽', 'Snark',
      ['tease', '……推理は、得意です。……例えば、あなたは今、スコーンを狙っています。……当たりですね。', '……推理是我的强项。……比如，你现在正盯着司康。……猜对了吧。', '...Deduction is a strength. ...For instance, you\'re eyeing the scone. ...Correct?']),
     act('问她天花板上那个图案代表什么', 'Ask her what the ceiling pattern means', '让她讲', 'Let her explain',
      ['happy', '……アカンサスの葉です。古代ギリシャから、ずっと使われています。……聞いてくれて、嬉しいです。', '……是茛苕叶。从古希腊开始，一直被使用。……你愿意听，我很高兴。', '...Acanthus leaves. Used since ancient Greece. ...I\'m glad you asked.'])]
  ),
  inari: D(
    ['稻荷看着三层点心架，表情很严肃，好像在看一座塔。她问你这是\"南蛮の供物\"吗，然后从最上层开始拿——直接拿了一块蛋糕。', 'Inari studies the three-tier stand gravely, like a pagoda. Are these \"offerings of the southern barbarians\"? She starts from the top — straight to the cake.'],
    ['红茶她喝不惯，说太苦。你帮她加了两块方糖和很多牛奶，她再喝一口，眼睛亮了：\"……これは、良い\"。', 'She finds the tea too bitter. You add two sugar cubes and plenty of milk; she sips again and brightens: \"...This is good.\"'],
    ['她捧着茶杯，看着窗外的西洋建筑，小声说：\"百五十年前、ここには異人がたくさんおった\"。', 'Holding her cup, she looks out at the Western buildings: \"A hundred and fifty years ago, this place was full of foreigners.\"'],
    [say('稲荷様は、その頃のことも覚えてるんですね。', '那个时候的事，稻荷大人也记得呢。', 'You remember those days too.', '让她讲', 'Let her tell it',
      ['happy', '……覚えておる。……髪の色の違う子らが、この坂を走っておった。……今、そなたがここにおるのと、同じじゃな。', '……记得。……发色不一样的孩子们，在这坡上跑来跑去。……就跟现在你在这里一样呢。', '...I remember. ...Children with different-coloured hair ran up this slope. ...Just like you\'re here now.'],
      ['稲荷様は、その頃のことも覚えさせてるんですね。', '使役「覚えさせてる」是\"让（别人）记住\"，意思错了。', '覚えさせてる means \"making someone memorize\".'],
      ['稲荷様は、そんな昔のこと、もう忘れたでしょう。', '\"你早忘了吧\"，否定了她的千年。', '\"You\'ve surely forgotten\" — denies her thousand years.']),
     joke('「从最上层开始吃，神明不讲礼仪的吗？」', '"Starting at the top — gods don\'t do etiquette?"', '吐槽', 'Snark',
      ['angry', '神が、人の決まりに従う道理はない！　……上が一番、うまそうであったのじゃ。', '神明没有遵守人类规矩的道理！……最上面那层看起来最好吃。', 'A goddess need not follow human rules! ...The top looked the tastiest.']),
     act('再给她的红茶里加一块糖', 'Drop one more sugar cube into her tea', '记住她的口味', 'Remember her taste',
      ['shy', '……わらわの好み、もう覚えたのか。……ふふ、人の子にしては、気が利くのう。', '……我的口味，你已经记住了吗。……呵呵，作为人类，还挺机灵的。', '...You\'ve already learned my taste? ...Heh, rather perceptive for a human.'])]
  ),
  miyuki: D(
    ['深雪是这家茶室的常客。服务员认得她，不用点就端来了她常喝的大吉岭。她说这是她\"一人で頑張った日のご褒美\"的地方。', 'Miyuki is a regular here. The waiter recognizes her and brings her usual Darjeeling unasked. This is where she rewards herself on days she\'s worked hard alone.'],
    ['可是今天，她第一次点了两人份的点心。服务员看了你一眼，又看了她一眼，笑着走开了。深雪假装没看见。', 'But today, for the first time, she orders the set for two. The waiter glances at you, then at her, and leaves smiling. Miyuki pretends not to notice.'],
    ['她把茶倒进你的杯子里，说：\"今日は、ご褒美じゃなくて、ただの、楽しみ\"。', 'Pouring your cup, she says: \"Today isn\'t a reward. It\'s just for fun.\"'],
    [say('これからは、ここに一人で来なくていいですよ。', '以后，不用一个人来这里了。', 'From now on, you don\'t have to come here alone.', '许诺', 'Promise',
      ['shy', '……あら。……じゃあ、頑張った日は、あなたを呼べばいいのね。……毎日、頑張っちゃうかも。', '……哎呀。……那，努力过的日子，叫你就好了呢。……说不定我会每天都努力。', '...Oh. ...So on hard days, I just call you. ...I might start working hard every day.'],
      ['これからは、ここに一人で来させなくていいですよ。', '使役「来させなくて」是\"不用让（别人）来\"，主语乱了。', '来させなくて shifts to \"needn\'t make someone come\".'],
      ['これからも、ここには一人で来てください。', '\"以后也请一个人来\"，把她推开了。', '\"Keep coming here alone\" — pushes her away.']),
     joke('「服务员刚才那个笑，深雪小姐也看见了吧。」', '"You saw the waiter\'s smile, didn\'t you?"', '戳破', 'Call it out',
      ['tease', '……見なかったことにしてるのに。……次に来たとき、何て説明しようかしら。「彼氏」？　ふふ、冗談よ。', '……明明在装没看见。……下次来的时候，该怎么解释呢。「男朋友」？呵呵，开玩笑的。', '...I was pretending not to. ...How shall I explain next time? \"My boyfriend\"? Hehe, kidding.']),
     act('也给她倒茶', 'Pour her tea in return', '互相照顾', 'Take care of each other',
      ['happy', '……ありがと。……人に紅茶を淹れてもらうの、いつぶりかしら。……おいしいわ。', '……谢谢。……让别人给我倒红茶，多久没有过了。……很好喝。', '...Thank you. ...How long since someone poured tea for me. ...It\'s delicious.'])]
  ),
  sora: D(
    ['空坐在雅致的茶室里，浑身不自在，像一只被关进鸟笼的鹰。她说这种地方\"足が落ち着かへん\"，膝盖一直在抖。', 'Sora sits in the elegant tearoom like a hawk in a birdcage. Places like this make her legs restless; her knee won\'t stop bouncing.'],
    ['点心架端上来，她一口一个司康，吃得很快，被旁边的客人看了好几眼。你小声提醒她，她马上放慢了速度，可是一个司康只咬了三口。', 'The stand arrives and she downs scones one bite each, drawing stares. You whisper a warning; she slows down — to three bites per scone.'],
    ['吃完，她看着空了的点心架，说：\"……ここ、お前は好きなんか？\"', 'Finished, she eyes the empty stand: \"...Do YOU like this kind of place?\"'],
    [say('空と一緒なら、どこでも好きだよ。', '和你一起的话，哪里都喜欢。', 'With you, I like anywhere.', '老实回答', 'Answer honestly',
      ['shy', '……アホ。……ほな、ウチも、慣れるように頑張るわ。……お前の好きな場所、ウチも好きになりたいし。', '……笨蛋。……那我也努力习惯吧。……你喜欢的地方，我也想喜欢上。', '...Idiot. ...Then I\'ll try to get used to it. ...I want to like the places you like.'],
      ['空と一緒なら、どこでも好かれるよ。', '「好かれる」是\"被喜欢\"，意思变了。', '好かれる means \"be liked\".'],
      ['空と一緒だと、ここは似合わないね。', '\"跟你来这里不合适\"，太伤人。', '\"With you, this place doesn\'t fit\" — hurtful.']),
     joke('「一口一个司康，你是在比赛吗。」', '"One scone per bite — is this a competition?"', '吐槽', 'Snark',
      ['tease', '……つい、癖で。……部活の後、早食いせな、先輩に取られるねん。……生存戦略や。', '……习惯了。……社团活动后不吃快点，会被前辈抢走。……生存战略。', '...Habit. ...After practice, if you don\'t eat fast, the seniors take it. ...Survival strategy.']),
     act('吃完就带她去外面的坡道散步', 'Take her for a walk on the slopes outside as soon as you finish', '让她舒展一下', 'Let her stretch',
      ['happy', '……！　……お前、ウチのこと、よう分かっとるな。……ほな、坂、競争な！', '……！……你真懂我。……那，爬坡比赛！', '...! ...You really get me. ...Right, race you up the slope!'])]
  ),
  nao: D(
    ['奈绪在茶室里很安静，跟这里的气氛很配。她点了一杯伯爵茶，两只手捧着，一直在看杯子里的倒影。', 'Nao is quiet in the tearoom, perfectly suited to it. She orders Earl Grey and holds it in both hands, watching her reflection in the cup.'],
    ['她从包里拿出一个小信封，推到你面前。里面是一张手写的卡片，写着：\"きょう、さそってくれて、ありがとう\"。', 'She takes a small envelope from her bag and slides it to you. Inside, a handwritten card: \"thank you for inviting me today.\"'],
    ['卡片的背面还有一行字，被橡皮擦过，看不清了。', 'There\'s another line on the back, erased, illegible.'],
    [say('裏に、何て書いてあったの？', '背面写了什么？', 'What was written on the back?', '好奇', 'Curious',
      ['shy', '……けした。……けしたけど、きもちは けしてない。……いつか、くちで いう。', '……擦掉了。……虽然擦掉了，心情没有擦掉。……总有一天，亲口说。', '...Erased it. ...Erased it, but not the feeling. ...Someday I\'ll say it out loud.'],
      ['裏に、何て書かせてあったの？', '使役「書かせて」是\"让（别人）写\"，意思不对。', '書かせて means \"made someone write\".'],
      ['裏は、どうでもいいよ。', '\"背面无所谓\"，她会把卡片收回去。', '\"The back doesn\'t matter\" — she\'d take the card back.']),
     joke('「用橡皮擦过——你是写错字了，还是写了不该写的？」', '"You erased it — a typo, or something you shouldn\'t have written?"', '逗她', 'Tease',
      ['pout', '……かいちゃ いけない こと。……でも、まちがいじゃ ない。', '……不该写的事。……不过，不是写错。', '...Something I shouldn\'t have written. ...But not a mistake.']),
     act('把卡片放进胸前的口袋', 'Tuck the card into your breast pocket', '珍惜', 'Treasure it',
      ['happy', '……むねの ポケット。……しんぞうの ちかく。……そこが いい。', '……胸前的口袋。……靠近心脏。……那里好。', '...Your chest pocket. ...Near your heart. ...That\'s a good place.'])]
  ),
  maki: D(
    ['真希一进茶室就拿出手机，拍了点心架的照片，从三个角度，还加了滤镜。她说要发给\"フォロワー\"。拍完，她看着点心架，不知道该怎么下手。', 'Maki photographs the tea stand from three angles with filters for her followers. Then she stares at it, unsure where to begin.'],
    ['你教她从下往上吃，她认真地点头，说\"攻略順序があるんやな\"。吃到最上层的蛋糕时，她说这是\"ボス\"，要慢慢享受。', 'You explain bottom to top. She nods seriously — \"there\'s a walkthrough order.\" The top-tier cake is the boss, to be savoured slowly.'],
    ['蛋糕吃完，她舔了舔叉子，说\"……クリア\"。', 'Cake finished, she licks her fork. \"...Cleared.\"'],
    [say('真希と来ると、何でもゲームみたいで楽しい。', '跟真希来，什么都像游戏一样好玩。', 'With you, everything\'s fun like a game.', '夸她', 'Praise her',
      ['shy', '……そ、そう？　……せんぱいとやったら、何でもゲームになんねん。……二人プレイ限定やけど。', '……是、是吗？……跟前辈在一起，什么都会变成游戏。……仅限双人模式。', '...R-really? ...With you everything turns into a game. ...Two-player only, though.'],
      ['真希と来ると、何でもゲームらしいで楽しい。', '「らしい」后接「で」不对，这里是比喻用「みたいで」。', 'らしいで is wrong; for likeness, みたいで.'],
      ['真希と来ると、何でもゲームにされて疲れる。', '\"什么都被你变成游戏，好累\"，扫兴。', '\"You turn everything into a game, it\'s tiring\" — killjoy.']),
     joke('「拍三个角度还加滤镜，你的粉丝有多少？」', '"Three angles plus filters — how many followers do you have?"', '好奇', 'Curious',
      ['tease', '……十二人。……そのうち三人は、ウチのサブ垢や。……笑うなや！', '……十二个。……其中三个是我的小号。……不许笑！', '...Twelve. ...Three of them are my alt accounts. ...Don\'t laugh!']),
     act('用你的手机，拍一张她举着叉子的照片', 'Snap a photo of her holding her fork with your phone', '记录通关时刻', 'Record the clear',
      ['happy', '……あっ、撮ったな！　……それ、クリア画面のスクショやな。……保存しといてや。消したら許さへん。', '……啊，拍了！……那是通关画面的截图吧。……保存好哦。删了不饶你。', '...Ah, you took it! ...That\'s a clear-screen screenshot. ...Save it. Delete it and you\'re dead.'])]
  )
};
