import { D, say, joke, act } from './kit';

// 有马温泉的温泉街
export const ONSEN = {
  asuka: D(
    ['明日香在有马的坡道上走得很认真，手里拿着一张导览地图，把要去的地方按顺序编了号。走到第三个点——卖碳酸煎饼的老店——她停下来，看着刚烤好的煎饼，咽了一下口水。', 'Asuka walks Arima\'s slopes methodically, map in hand, every stop numbered. At stop three — an old shop selling carbonated-water crackers — she pauses and swallows at the fresh batch.'],
    ['你买了一包，掰了一块给她。她接过去，小口地咬，说\"……旅先での間食は、例外ね\"。', 'You buy a pack and break off a piece for her. She nibbles: \"...Snacking while travelling is an exception.\"'],
    ['在足汤边，她犹豫了很久，终于脱下袜子，把脚放进温泉里。她舒服得叹了一口气，然后发现你在看，脸红了。', 'At the foot bath she hesitates a long time, then finally peels off her socks and dips her feet. She sighs with pleasure — then sees you watching and blushes.'],
    [say('明日香がリラックスしてるの、初めて見た。', '第一次看见你这么放松。', 'First time I\'ve seen you this relaxed.', '说出来', 'Say it',
      ['shy', '……い、いつもは、気を張ってるだけよ。……あなたの前だと、張らなくていいって、思っちゃったの。', '……平、平时只是在绷着。……在你面前，觉得不用绷着了。', '...I-I\'m just always on guard. ...With you, I felt I didn\'t have to be.'],
      ['明日香がリラックスさせてるの、初めて見た。', '使役「させてる」是\"让（别人）放松\"，意思跑偏了。', 'させてる means \"making someone relax\".'],
      ['明日香、足、ちょっと赤いね。', '\"你的脚有点红\"，她会把脚缩回去。', '\"Your feet are a bit red\" — she\'d pull them out.']),
     joke('「旅行中零食是例外——那你编号的计划表也是例外吗？」', '"Snacks are an exception on trips — is your numbered itinerary too?"', '打趣', 'Tease',
      ['angry', 'け、計画は例外じゃないわよ！　……でも、四番目以降は、あなたが決めていいわ。', '计、计划不是例外！……不过，第四个以后，你来决定也行。', 'Th-the plan is NOT an exception! ...But from stop four on, you can decide.']),
     act('也把脚放进足汤，在她旁边', 'Dip your feet in the foot bath too, beside her', '一起泡', 'Soak together',
      ['happy', '……温かいわね。……お湯の中で、足、当たってる。……今日は、規則、お休みにするわ。', '……好暖和。……在热水里，脚碰到了。……今天，规则放假了。', '...Warm. ...Our feet are touching in the water. ...Today, the rules take a holiday.'])]
  ),
  hikari: D(
    ['光一到有马就被温泉的味道迷住了，说\"ゆで卵の匂いする！\"然后真的去买了温泉蛋，一口气吃了三个。', 'Hikari loves Arima\'s smell — \"like boiled eggs!\" — then actually buys onsen eggs and eats three in a row.'],
    ['在足汤边，她把脚伸进去，烫得\"あっつ！\"地叫了一声，然后又慢慢地放回去，眯起眼睛：\"……極楽や〜\"。', 'At the foot bath she plunges her feet in, yelps at the heat, then eases them back in, eyes narrowing: \"...Paradise~\"'],
    ['她泡着脚，靠在你肩膀上，声音越来越小：\"……{name}くん、このまま、寝てもええ？\"', 'Feet soaking, she leans on your shoulder, voice fading: \"...Can I fall asleep like this?\"'],
    [say('いいよ。起きるまで、ここにいるから。', '可以。你醒之前，我都在这里。', 'Sure. I\'ll be here until you wake up.', '让她睡', 'Let her sleep',
      ['shy', '……ほんま？　……ほな、ちょっとだけ。……起きたとき、{name}くんがおったら、ええ夢見たことにする。', '……真的？……那就一会儿。……醒来的时候，你在的话，就当做了个好梦。', '...Really? ...Just a little, then. ...If you\'re here when I wake, I\'ll call it a good dream.'],
      ['いいよ。起きるまで、ここにいさせるから。', '使役「いさせる」是\"让（别人）待着\"，不对。', 'いさせる means \"make someone stay\".'],
      ['ダメだよ、風邪ひくよ。', '\"不行，会感冒\"——没错，但太扫兴。', '\"No, you\'ll catch cold\" — true, but deflating.']),
     joke('「三个温泉蛋，你是想变成蛋吗？」', '"Three onsen eggs — trying to become one?"', '吐槽', 'Snark',
      ['tease', 'えへへ、うち、半熟やから。……{name}くんに、ちょうどええ加減に、されてもうてん。', '嘿嘿，我是半熟的。……被你弄成刚刚好的火候了。', 'Hehe, I\'m soft-boiled. ...You\'ve cooked me just right.']),
     act('用毛巾帮她擦干脚', 'Dry her feet with a towel', '体贴', 'Considerate',
      ['happy', 'わっ、くすぐったい！　……もう、{name}くん、お姫様扱いしすぎや。……もっとして。', '哇，好痒！……真是的，你太把我当公主了。……再多点。', 'Whoa, tickles! ...You\'re treating me like a princess. ...Do it more.'])]
  ),
  rei: D(
    ['铃对有马的两种温泉——\"金泉\"和\"銀泉\"——的化学成分很感兴趣。她站在说明牌前，读了很久，说金泉是因为铁离子氧化才变成红褐色的。', 'Rei is fascinated by Arima\'s two springs — gold and silver. She reads the sign at length: the gold is red-brown from oxidized iron ions.'],
    ['在足汤边，她把手伸进金泉里，看着手被染成淡淡的褐色，说：\"……鉄分、約二パーセント\"。然后她把脚也放了进去。', 'At the foot bath she dips a hand into the gold spring and watches it tint faintly brown: \"...About two percent iron.\" Then she puts her feet in too.'],
    ['她看着水面，难得地放空，什么都没算。', 'She gazes at the water, for once calculating nothing.'],
    [say('今、何も計算してないでしょ。', '你现在什么都没在算吧。', 'You\'re not calculating anything right now, are you.', '看出来了', 'You can tell',
      ['shy', '……バレましたか。……あなたといると、時々、頭が静かになります。……それが、心地いいです。', '……被发现了吗。……跟你在一起，有时候脑子会安静下来。……那样很舒服。', '...Found out? ...With you, sometimes my mind goes quiet. ...It\'s pleasant.'],
      ['今、何も計算されてないでしょ。', '被动「計算されて」是\"被计算\"，主客颠倒。', '計算されて means \"being calculated\".'],
      ['鈴は、いつも計算してるよね。', '\"你总是在算\"，她刚刚好不容易停下来。', '\"You\'re always calculating\" — just when she\'d stopped.']),
     joke('「铁含量百分之二——那泡完我们是不是有磁性了。」', '"Two percent iron — will we be magnetic after this?"', '玩笑', 'Joke',
      ['tease', '……科学的には、ありえません。……でも、あなたに引き寄せられる感覚は、あります。……磁力ではない何かで。', '……科学上不可能。……不过，被你吸引的感觉是有的。……用磁力以外的什么。', '...Scientifically impossible. ...But I do feel drawn to you. ...By something other than magnetism.']),
     act('用金泉的水，在她手心里画一个小小的星星', 'With gold-spring water, trace a tiny star on her palm', '给她星星', 'Give her a star',
      ['happy', '……星。……褐色の星、初めてです。……消えるまで、見ていてもいいですか。', '……星星。……褐色的星星，第一次见。……可以一直看到它消失吗？', '...A star. ...My first brown star. ...May I watch it until it fades?'])]
  ),
  inari: D(
    ['稻荷说有马的温泉她\"千年前から知っておる\"。她走在坡道上，一路跟路边的石地藏打招呼，好像在跟老朋友叙旧。', 'Inari says she\'s known Arima\'s springs for a thousand years. Up the slopes she greets each roadside stone jizo like an old friend.'],
    ['在一座小神社前，她停下来，说这里的神是她的\"古い知り合い\"。她恭敬地拜了拜，然后小声说：\"……人の子を連れてきた。よしなに\"。', 'At a small shrine she stops — its god is an old acquaintance. She bows respectfully, then whispers: \"...I\'ve brought a human child. Treat him well.\"'],
    ['在足汤边，她把脚放进去，尾巴也不小心碰到了水。她\"ひゃっ\"地叫了一声，尾巴炸开了。', 'At the foot bath her tails accidentally touch the water. She squeaks — tails puffing out.'],
    [say('稲荷様の知り合いに、紹介してもらえて嬉しいです。', '能被介绍给稻荷大人的熟人，很开心。', 'I\'m happy you introduced me to your old friend.', '感谢', 'Thank her',
      ['shy', '……べ、別に、紹介したわけでは……。……そなたが、わらわの大事な者じゃと、伝えただけじゃ。', '……也、也不是介绍……。……只是告诉它，你是我重要的人而已。', '...I-it wasn\'t an introduction... ...I merely told it you\'re someone precious to me.'],
      ['稲荷様の知り合いに、紹介してあげて嬉しいです。', '「てあげて」是\"我给（别人）\"，她为你介绍要用「てもらえて」。', 'てあげて faces outward; for her favour to you, てもらえて.'],
      ['神様の知り合いなんて、ちょっと怖いです。', '\"神明的熟人好可怕\"，她会很受伤。', '\"A god\'s acquaintance is scary\" — she\'d be hurt.']),
     joke('「尾巴碰到水就炸毛——稻荷大人是猫吗？」', '"Tails puff when wet — are you a cat?"', '打趣', 'Tease',
      ['angry', 'ね、猫と一緒にするでない！　……狐は、尾が濡れるのを嫌うのじゃ。……乾かすの、手伝え。', '别、别把我跟猫混为一谈！……狐狸讨厌尾巴湿。……帮我弄干。', 'D-don\'t lump me with cats! ...Foxes hate wet tails. ...Help me dry them.']),
     act('用毛巾仔细地帮她擦干尾巴', 'Carefully dry her tails with a towel', '照顾', 'Tend to her',
      ['happy', '……ん。……そこ、もう少し、優しく。……ふふ、尾を触らせるのは、そなたが初めてじゃぞ。', '……嗯。……那里，再温柔一点。……呵呵，让人碰尾巴，你是第一个。', '...Mm. ...There, a little gentler. ...Heh, you\'re the first I\'ve let touch my tails.'])]
  ),
  miyuki: D(
    ['深雪说她每年都会来有马一次，一个人，住一晚，泡一次温泉，然后回去继续工作。\"大人のリセットボタンよ\"。', 'Miyuki comes to Arima once a year alone: one night, one soak, then back to work. \"A grown-up\'s reset button.\"'],
    ['今年她带了你来。在足汤边，她把裙子往上提了一点，把脚放进去，舒服得闭上了眼睛。', 'This year she brought you. At the foot bath she lifts her skirt slightly, dips her feet, and closes her eyes in bliss.'],
    ['她说：\"……一人の時は、リセットだったけど。……今日は、何だろう。……充電、かしら\"。', '\"...Alone, it was a reset. ...Today, what is it? ...A recharge, maybe.\"'],
    [say('深雪さんの充電器になれるなら、嬉しいです。', '如果能当深雪小姐的充电器，我很高兴。', 'If I can be your charger, I\'d be happy.', '接她的比喻', 'Run with her metaphor',
      ['shy', '……あら。……じゃあ、毎日、充電させてもらおうかしら。……コンセント、どこ？　……なんてね。', '……哎呀。……那，每天都让你给我充电吧。……插座在哪？……开玩笑的。', '...Oh. ...Then maybe I\'ll recharge on you every day. ...Where\'s the socket? ...Just kidding.'],
      ['深雪さんの充電器になられるなら、嬉しいです。', '「なられる」是尊敬/被动，这里用可能形「なれる」。', 'なられる is honorific/passive; use potential なれる.'],
      ['リセットのほうが、すっきりしそうですね。', '\"重置好像更清爽\"——你在说你不重要。', '\"A reset sounds cleaner\" — saying you don\'t matter.']),
     joke('「一个人来了这么多年，今年为什么带我？」', '"Alone for years — why bring me this year?"', '追问', 'Prod',
      ['tease', 'ふふ、どうしてかしらね。……一人で来ても、あなたのこと考えちゃうって、去年、気づいたから。', '呵呵，为什么呢。……因为去年发现，一个人来也会想着你。', 'Hehe, why indeed. ...Last year I realized that even alone, I\'d think of you.']),
     act('从坡道下面的老店，买两瓶冰牛奶回来', 'Fetch two bottles of cold milk from the old shop down the slope', '温泉标配', 'The classic onsen treat',
      ['happy', '……あら、分かってるわね。……温泉の後は、牛乳よね。……乾杯。……ふふ、何年ぶりかしら、誰かと乾杯するの。', '……哎呀，你懂嘛。……泡完温泉就是要喝牛奶。……干杯。……呵呵，多少年没跟人干杯了。', '...Oh, you know the drill. ...Milk after the bath. ...Cheers. ...Hehe, how many years since I toasted with someone.'])]
  ),
  sora: D(
    ['空爬有马的坡道爬得比谁都快，一边爬一边回头催你。爬到最上面，她才发现自己把所有的店都跳过了。', 'Sora charges up Arima\'s slopes faster than anyone, glancing back to hurry you. At the top she realizes she\'s skipped every shop.'],
    ['她只好跟你一起往回走，一家一家地逛。在一家卖手工竹篮的老店里，她蹲下来，看了很久一个小小的竹编蚂蚱。', 'So she walks back down with you, shop by shop. In an old basketwork store she crouches over a tiny woven-bamboo grasshopper for ages.'],
    ['在足汤边，她把累了一天的脚放进去，舒服得\"あぁ〜\"了一声，然后马上捂住了嘴。', 'At the foot bath she sinks her tired feet in with a blissful \"aaah~\" — then claps a hand over her mouth.'],
    [say('空がゆっくり歩いてくれて、楽しかった。', '你陪我慢慢走，很开心。', 'Walking slowly with you was fun.', '感谢她', 'Thank her',
      ['shy', '……お前に合わせたんや。……でも、ゆっくり歩くのも、悪くないな。……お前と一緒なら。', '……是配合你。……不过，慢慢走也不坏。……跟你一起的话。', '...I matched your pace. ...But walking slow isn\'t bad. ...With you.'],
      ['空がゆっくり歩いてあげて、楽しかった。', '「てあげて」是\"给（别人）\"，她为你慢下来要用「てくれて」。', 'てあげて faces outward; for her favour to you, てくれて.'],
      ['空は、いつも速すぎるよ。', '\"你总是太快了\"——她今天特意慢下来了。', '\"You\'re always too fast\" — she slowed down today.']),
     joke('「刚才那一声『啊——』，像老大爷泡澡。」', '"That \'aaah\' just now — like an old man in the bath."', '吐槽', 'Snark',
      ['angry', 'う、うっさい！　……足が、疲れとったんや。……お前も入ってみ、絶対言うで。', '吵、吵死了！……是脚累了。……你也泡泡看，绝对也会叫。', 'Sh-shut up! ...My feet were tired. ...Get in, you\'ll say it too.']),
     act('偷偷回去买下那只竹编蚂蚱，放在她手心', 'Sneak back for the bamboo grasshopper and place it in her palm', '惊喜', 'A surprise',
      ['happy', '……！　……見とったんか。……お前、ほんま、ウチのこと、よう見とるな。……大事にする。', '……！……你看见了啊。……你真的很留意我呢。……我会好好珍惜的。', '...! ...You saw. ...You really watch me closely. ...I\'ll treasure it.'])]
  ),
  nao: D(
    ['奈绪在有马的坡道上走得很慢，一路上一直在看路边的小花和石头。她说这里的空气\"ゆっくり\"，跟她的速度很合。', 'Nao walks Arima\'s slopes slowly, eyes on the wayside flowers and stones. The air here is \"slow,\" she says — it suits her pace.'],
    ['在一家卖手工和纸的店里，她挑了一张淡蓝色的信纸，偷偷地买了，藏进了包里。', 'In a handmade washi shop she picks a sheet of pale-blue letter paper, buys it secretly, and tucks it into her bag.'],
    ['在足汤边，她把脚放进温泉里，然后把头靠在了你的肩膀上，像小时候在公园的长椅上一样。', 'At the foot bath she dips her feet in and rests her head on your shoulder, like on the park bench when you were small.'],
    [say('さっきの便箋、誰に手紙書くの？', '刚才那张信纸，要给谁写信？', 'That letter paper — who are you writing to?', '好奇', 'Curious',
      ['shy', '……ないしょ。……でも、あんたの いえの ポストに、いつか とどく かも。……まってて。', '……秘密。……不过，说不定哪天会寄到你家的信箱。……等着。', '...Secret. ...But it might arrive in your letterbox someday. ...Wait for it.'],
      ['さっきの便箋、誰に手紙書かせるの？', '使役「書かせる」是\"让（谁）写\"，意思不对。', '書かせる means \"make someone write\".'],
      ['便箋なんて、今どき使わないよね。', '\"现在谁还用信纸\"，她会把信纸藏得更深。', '\"Who uses letter paper these days\" — she\'d hide it deeper.']),
     joke('「空气很慢——那是不是这里的时间也很慢？」', '"Slow air — does time run slow here too?"', '接她的话', 'Pick up her thread',
      ['pout', '……うん。……だから、ここに いれば、あんたと ずっと いっしょに いられる。……かえりたくない。', '……嗯。……所以，待在这里的话，就能一直跟你在一起。……不想回去。', '...Mm. ...So if we stay here, I can be with you forever. ...I don\'t want to go back.']),
     act('不动，让她靠着，直到夕阳落下', 'Stay still and let her lean on you until the sun sets', '时间很慢', 'Time runs slow',
      ['happy', '……ゆうひ、おちた。……あんた、ずっと うごかなかった。……ありがと。……また、こよう。', '……夕阳落下了。……你一直没动。……谢谢。……下次还来吧。', '...The sun set. ...You didn\'t move the whole time. ...Thanks. ...Let\'s come again.'])]
  ),
  maki: D(
    ['真希说有马温泉是游戏里\"回復の泉\"的原型。她在每个冒热气的地方都要停下来拍照，说要\"HP全回復\"。', 'Maki says Arima is the model for every game\'s healing spring. She photographs every steaming vent — \"full HP restore.\"'],
    ['在一家卖人偶笔的老店里，她第一次见到笔杆上会弹出小人偶的毛笔，惊讶得眼睛都圆了，说\"……ギミックがある！\"', 'In an old shop selling doll-brushes — a tiny figure pops from the handle when you write — her eyes go round: \"...It has a gimmick!\"'],
    ['在足汤边，她把袜子脱了，把脚放进去，然后掏出手机：\"……HP、満タンになったわ\"。', 'At the foot bath she peels off her socks, dips her feet, and pulls out her phone: \"...HP fully restored.\"'],
    [say('真希と一緒だと、MPも回復するよ。', '跟真希在一起，MP也回复了。', 'With you, my MP recovers too.', '接梗', 'Play along',
      ['shy', '……せ、せんぱい、それ、どこで覚えてん。……ウチも、せんぱいとおると、状態異常、全部治るわ。', '……前、前辈，这句你从哪学的。……我也是，跟前辈在一起，异常状态全好了。', '...S-senpai, where\'d you learn that line. ...Same here — with you, every status ailment clears.'],
      ['真希と一緒だと、MPも回復させるよ。', '使役「回復させる」变成\"让（别人）回复\"，意思不对。', '回復させる means \"make something recover\".'],
      ['ゲームの話ばっかりで、疲れるよ。', '\"整天说游戏好累\"，她会把手机收起来再也不说了。', '\"All this game talk is tiring\" — she\'d clam up.']),
     joke('「人偶笔有机关——那你是不是也有隐藏机关？」', '"The doll-brush has a gimmick — do you have a hidden one too?"', '逗她', 'Tease',
      ['tease', '……あるで。……好感度MAXで、デレモードに切り替わる。……今、九十九パーセントや。', '……有哦。……好感度满了，就切换到娇羞模式。……现在百分之九十九。', '...I do. ...At max affection I switch to dere mode. ...Currently at ninety-nine percent.']),
     act('买一支人偶笔送给她', 'Buy her one of the doll-brushes', '她喜欢的机关', 'The gimmick she loved',
      ['happy', '……！　……ええの？　……これで、ゲームのデザイン、描くわ。……せんぱいからのアイテム、レア度、最高やで。', '……！……可以吗？……我要用它画游戏设计。……前辈给的道具，稀有度最高。', '...! ...Really? ...I\'ll sketch game designs with it. ...An item from senpai — max rarity.'])]
  )
};
