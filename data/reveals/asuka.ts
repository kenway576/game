import { say, joke, act } from './kit';

// 明日香：标准语 N3，傲娇。夸她会先嘴硬再道谢；开她玩笑会炸毛；不说话她反而更慌。
export const ASUKA_REVEALS = {
  casual: [
    say('そのチョーカー、似合ってる。', '那条项圈，很适合你。', 'That choker suits you.', '夸那颗小红心', 'Compliment the little red heart',
      ['shy', '……チョーカーだけ？　……別に、全部って言えなんて言ってないわよ。', '……只有项圈？……我又没要你说全部。', '...Only the choker? ...Not that I asked you to say all of it.'],
      ['そのチョーカーを似合ってる。', '「似合う」前面的东西用「が/は」，不用「を」。', '似合う takes が or は, not を.'],
      ['そのチョーカー、似合ってない。', '「似合ってない」是\"不适合\"，夸奖变成了差评。', '似合ってない means it does NOT suit her.']),
    joke('「校门口查领带的人，原来也有私服啊。」', '"So the tie inspector owns normal clothes."', '拿她的班长身份开玩笑', 'Tease her about the class-president thing',
      ['angry', 'あるに決まってるでしょ！　……明日、あんたのネクタイ、一番に見てやるから。', '当然有啊！……明天，我第一个检查你的领带。', 'Of course I do! ...Tomorrow, yours is the first tie I check.']),
    act('把手机收起来，认真看她一眼', 'Put your phone away and actually look at her', '让她知道你在看', 'Let her see that you are looking',
      ['shy', '……な、なによ。黙って見られると、余計に恥ずかしいんだけど。', '……干、干嘛。不说话一直看，反而更难为情。', '...Wh-what. Being stared at in silence is even more embarrassing.'])
  ],
  gym: [
    say('ジャージでも、きちんとしてるね。', '穿运动服也这么一丝不苟。', 'Even in a tracksuit you look neat.', '夸她连运动服都穿得规规矩矩', 'Praise how neatly she wears even PE kit',
      ['shy', 'あ、当たり前でしょ。ファスナーの位置にも、ちゃんと理由があるんだから。', '那、那当然。拉链拉到哪儿，我也是有道理的。', 'O-of course. Even where the zip stops has a reason.'],
      ['ジャージでも、きちんとしてるな。', '意思能懂，但对女生说「な」偏粗；平时说「ね」更自然。', 'Understandable, but な sounds rough here; ね is more natural.'],
      ['ジャージなら、きちんとしてない。', '变成\"穿运动服的话就不整齐\"，夸成了批评。', 'It now says she is NOT neat in a tracksuit.']),
    joke('指了指她的哨子：「今天也要吹我？」', 'Point at the whistle: "Going to blow that at me today?"', '逗她', 'Tease her',
      ['tease', '……吹かれたいの？　だったら、遅刻しなければいいのよ。', '……你想被吹吗？那就别迟到。', '...Do you want me to? Then stop being late.']),
    act('接过她手里那瓶水，帮她拧开', 'Take her water bottle and open it for her', '顺手的事', 'A small thing',
      ['surprised', '……自分で開けられるわよ。……でも、ありがと。', '……我自己能开的。……不过，谢谢。', '...I can open it myself. ...But thanks.'])
  ],
  swim: [
    say('赤、すごくきれいだよ。', '红色，真的很好看。', 'The red looks really lovely.', '夸颜色，不夸别的', 'Praise the colour, nothing else',
      ['shy', '……色だけ見てなさいよ。色だけ。……ありがと。', '……只许看颜色。只许看颜色。……谢谢。', '...Look at the colour only. Only the colour. ...Thanks.'],
      ['赤、すごいきれいだよ。', '修饰形容词「きれい」要用副词「すごく」，「すごい」是口语的不规范用法。', 'Before an adjective use the adverb すごく; すごい here is sloppy.'],
      ['赤、すごく汚いよ。', '「汚い」是\"脏\"，完全说反了。', '汚い means dirty — the opposite.']),
    joke('「那个结要是开了，我会转过头的。」', '"If that knot comes undone, I will look away."', '有点危险的玩笑', 'A risky joke',
      ['angry', 'ほどけないわよ！　……ほどけないように、三回結んだんだから！', '才不会开！……我打了三个结，就是为了不让它开！', 'It will not come undone! ...I tied it three times so it would not!']),
    act('把自己的毛巾递给她，看着海那边', 'Hand her your towel and look out to sea', '给她一点安心', 'Give her a little ease',
      ['shy', '……気が利くじゃない。……今日だけ、褒めてあげるわ。', '……还挺机灵的嘛。……就今天，表扬你一下。', '...Thoughtful of you. ...Just today, you get praised.'])
  ],
  maid: [
    say('その赤いリボン、自分で付けたんでしょ。', '那个红色蝴蝶结，是你自己加的吧。', 'You added that red bow yourself, right?', '看出了她的小心思', 'Notice the detail she added',
      ['surprised', 'な、なんで分かるのよ！　……だって、黒と白だけじゃ、つまらないでしょ。', '你、你怎么看出来的！……光是黑白太无聊了嘛。', 'H-how did you know! ...Just black and white is boring, okay?'],
      ['その赤いリボン、自分で付けたんだろ。', '意思一样，但「だろ」很冲；跟她说话用「でしょ」更柔和。', 'Same meaning, but だろ is blunt; でしょ is softer.'],
      ['その赤いリボン、自分で付けられたんでしょ。', '被动「付けられた」变成\"被（别人）别上的\"，意思反了。', '付けられた is passive — someone else put it on her.']),
    joke('「再说一遍『主人』，我录下来。」', '"Say \'master\' again. I will record it."', '作死', 'Asking for trouble',
      ['angry', '殺すって言ったわよね。……一回だけなら、録音なしで、言ってあげてもいいけど。', '我说过会杀了你的吧。……不录音的话，说一次也不是不行。', 'I said I would kill you. ...Once, without recording, maybe.']),
    act('认真地鞠了一躬：「我回来了。」', 'Bow properly: "I\'m home."', '陪她把戏演完', 'Play along properly',
      ['shy', '……お、おかえりなさいませ。……今のは、仕事だから。仕事。', '……欢、欢迎回来。……刚才那是工作。是工作。', '...W-welcome home. ...That was work. Work.'])
  ],
  autumn: [
    say('長いマフラー、温かそうだね。', '长围巾，看起来好暖和。', 'That long scarf looks warm.', '顺着她的话说', 'Agree with her about the scarf',
      ['happy', 'でしょ？　長いと、二回巻いてもまだ余るのよ。……余った分は、別に何でもないけど。', '对吧？长的话绕两圈还有剩。……剩下那截，倒也没什么用。', 'Right? Long enough to wrap twice and still have extra. ...Not that the extra is for anything.'],
      ['長いマフラー、温かいそうだね。', '\"看起来……\"的「そう」接形容词词干：「温かそう」，不是「温かいそう」（那是传闻）。', 'Appearance そう attaches to the stem: 温かそう; 温かいそう means hearsay.'],
      ['長いマフラー、寒そうだね。', '「寒そう」是\"看起来很冷\"，跟她的话对着干。', '寒そう means it looks cold — contradicting her.']),
    joke('拎起围巾垂下来的那一截：「这截是给我的吗？」', 'Lift the trailing end: "Is this part for me?"', '有点越界', 'A bit forward',
      ['shy', 'ば、馬鹿じゃないの！？　……風邪ひいたら、困るのはクラス委員なんだからね。', '你、你是笨蛋吗？！……你感冒了，麻烦的可是班长。', 'A-are you stupid?! ...If you catch cold, it is the class rep who suffers.']),
    act('把她围巾的尾巴从风里捞回来，替她搭到肩上', 'Catch the tail of her scarf from the wind and drape it back over her shoulder', '不说话', 'Without a word',
      ['shy', '……ありがと。……べ、別に、自分でもできたけど。', '……谢谢。……我、我自己也能弄的。', '...Thanks. ...I-I could have done it myself.'])
  ],
  yukata: [
    say('後ろも、ちゃんとまっすぐだよ。', '后面也好好的，很正。', 'The back is perfectly straight.', '先回答她的问题', 'Answer her question first',
      ['happy', 'ほんと？　……よかった。三十分かかったのよ、これ。', '真的？……太好了。这个花了我三十分钟呢。', 'Really? ...Good. This took me thirty minutes.'],
      ['後ろも、ちゃんとまっすぐくだよ。', '「まっすぐ」是名词/な形容词，后面直接接「だ」，没有「まっすぐく」。', 'まっすぐ takes だ directly; there is no まっすぐく.'],
      ['後ろは、全然まっすぐじゃないよ。', '\"后面一点都不正\"，她会当场崩溃。', '\"The back is not straight at all\" — she will panic.']),
    joke('「团扇再扇快一点，就能飞起来了。」', '"Fan any faster and you will take off."', '笑她扇得快', 'Laugh at the fast fanning',
      ['pout', 'う、うるさいわね！　暑いのよ！　……暑いだけなんだから！', '少、少啰嗦！是因为热！……只是因为热！', 'Sh-shut up! It is hot! ...It is only because it is hot!']),
    act('替她把背后的蝴蝶结理正一点', 'Straighten the bow at her back a little', '她看不到的地方', 'Where she cannot see',
      ['shy', '……今、触った？　……直してくれたのね。……ありがと。', '……刚才碰到了？……是帮我弄正了吧。……谢谢。', '...Did you just touch it? ...You fixed it. ...Thanks.'])
  ],
  winter: [
    say('三分も待たせて、ごめん。', '让你等了三分钟，对不起。', 'Sorry I kept you waiting three minutes.', '先道歉', 'Apologise first',
      ['pout', '……分かればいいのよ。……耳当て、温かいから許してあげる。', '……知道就好。……耳罩挺暖和的，原谅你了。', '...As long as you know. ...The earmuffs are warm, so you are forgiven.'],
      ['三分も待って、ごめん。', '「待って」是你自己等；让她等要用使役「待たせて」。', '待って means you waited; making her wait is 待たせて.'],
      ['三分しか待たせなくて、ごめん。', '\"只让你等了三分钟，对不起\"，道歉道得莫名其妙。', '\"Sorry I only made you wait three minutes\" — absurd.']),
    joke('戳了戳她的耳罩：「听得见吗？」', 'Poke her earmuffs: "Can you hear me in there?"', '逗她', 'Tease her',
      ['angry', '聞こえてるわよ！　……全部、聞こえてるんだから。', '听得见！……全都听得见。', 'I can hear you! ...I can hear everything.']),
    act('把自己口袋里的暖宝宝塞进她手套里', 'Slip the hand warmer from your pocket into her mitten', '不说话', 'Without a word',
      ['shy', '……あったかい。……あんたのは？　……ないの？　バカね。半分こしなさいよ。', '……好暖和。……你的呢？……没有？笨蛋。一人一半啊。', '...Warm. ...What about yours? ...None? Idiot. We share it.'])
  ],
  sleep: [
    say('星のパジャマ、かわいいね。', '星星睡衣，好可爱。', 'Star pyjamas. Cute.', '直接说可爱', 'Just say cute',
      ['shy', 'み、見回りだって言ってるでしょ！　……でも、これ、気に入ってるの。', '都、都说了是巡查！……不过，这件我很喜欢。', 'I-I said this is a patrol! ...But I do like these.'],
      ['星のパジャマ、かわいいだね。', 'い形容词「かわいい」后面不接「だ」，直接说「かわいいね」。', 'An i-adjective takes no だ: かわいいね.'],
      ['星のパジャマ、かわいそうだね。', '「かわいそう」是\"可怜\"，不是\"可爱\"。', 'かわいそう means pitiful, not cute.']),
    joke('「巡查的话，兔子拖鞋也是制服吗？」', '"Are bunny slippers part of the patrol uniform?"', '揭穿她', 'Call her bluff',
      ['angry', 'う、うるさい！　夜の見回りは、静かに歩くのが大事なの！　だからこれなの！', '少、少啰嗦！夜里巡查，走路要轻！所以才穿这个！', 'Sh-shut up! A night patrol needs quiet feet! That is why!']),
    act('什么都不问，把门开大一点，让她进来', 'Ask nothing; just open the door wider for her', '给她台阶', 'Give her a way in',
      ['shy', '……おじゃまします。……見回りの、続きだから。', '……打扰了。……这是巡查的后续。', '...Excuse me. ...This is still part of the patrol.'])
  ],
  dress: [
    say('お辞儀、本物のお嬢様みたいだった。', '刚才那个屈膝礼，像真正的大小姐。', 'That curtsy was like a real young lady\'s.', '夸她的礼', 'Praise the curtsy',
      ['tease', '当然でしょ。練習したもの。……あんたのために、じゃないけどね。', '当然啊。我练过的。……不是为了你就是了。', 'Naturally. I practised. ...Not for you, though.'],
      ['お辞儀、本物のお嬢様らしいだった。', '「らしい」是い形容词型，过去式是「らしかった」；这里用「みたいだった」最自然。', 'らしい conjugates like an i-adjective; みたいだった is the natural choice here.'],
      ['お辞儀、本物のお嬢様じゃなかった。', '\"不像真正的大小姐\"，你这是在挑衅。', '\"It was not like a real lady\" — that is picking a fight.']),
    joke('也提起不存在的裙摆，回她一个屈膝礼', 'Lift an imaginary skirt and curtsy back', '陪她胡闹', 'Play along',
      ['happy', 'ぷっ……なにそれ、ひどい！　……でも、ちょっとだけ、上手かったかも。', '噗……那是什么啊，太烂了！……不过，可能稍微有点像样。', 'Pfft... what is that, terrible! ...Maybe a tiny bit good, though.']),
    act('伸出手，像要请她跳舞', 'Offer her your hand, as if for a dance', '认真的那种', 'Seriously',
      ['shy', '……え。……し、仕方ないわね。踏んだら、許さないから。', '……诶。……真、真拿你没办法。踩到我的话，不饶你。', '...Eh. ...F-fine. Step on my feet and you are dead.'])
  ],
  kimono: [
    say('あけましておめでとう。今年もよろしく。', '新年快乐。今年也请多指教。', 'Happy New Year. Let\'s get along this year too.', '好好地拜年', 'Say the greeting properly',
      ['happy', '……ちゃんと言えるじゃない。……今年も、よろしく。厳しくいくわよ。', '……这不是说得挺好的嘛。……今年也请多指教。我会很严格哦。', '...You can say it properly. ...This year too. I will be strict.'],
      ['あけましておめでとう。今年もよろしくだ。', '「よろしく」后面不加「だ」；客气一点说「よろしくお願いします」。', 'よろしく takes no だ; politely, よろしくお願いします.'],
      ['あけましておめでとう。去年もよろしく。', '「去年」是\"去年\"，新年祝词说的是「今年」。', '去年 is last year; the greeting is about this year.']),
    joke('「像年画里走出来的。可以贴在门上吗？」', '"You look like a New Year print. Can I stick you on the door?"', '夸张的玩笑', 'An exaggerated joke',
      ['pout', '貼らないわよ！　……でも、年賀状の写真なら、一枚くらい、いいけど。', '才不贴！……不过，贺年卡的照片的话，拍一张也行。', 'You will not! ...A photo for a New Year card, though, one might be fine.']),
    act('替她把被风吹歪的金簪扶正', 'Set her gold hairpin straight where the wind tipped it', '很小心', 'Carefully',
      ['shy', '……ありがと。……今年最初に触ったの、あんたかも。……なんでもない。', '……谢谢。……今年第一个碰我的，可能是你。……没什么。', '...Thanks. ...You might be the first to touch me this year. ...Never mind.'])
  ],
  sport: [
    say('リストバンド、本気だね。', '连护腕都戴上了，是认真的啊。', 'Wristbands. You mean business.', '看出她的认真', 'Notice how serious she is',
      ['tease', '当たり前でしょ。手加減しないって言ったじゃない。', '当然啊。不是说了不会手下留情吗。', 'Naturally. I said I would not go easy.'],
      ['リストバンド、本気だな。', '能懂，但「だな」是自言自语式的；对她说「だね」更自然。', 'Understandable, but だな sounds like talking to yourself; だね is better.'],
      ['リストバンド、冗談だね。', '\"护腕是开玩笑的吧\"，她会当场把球拍过来。', '\"The wristbands are a joke\" — she will serve at your head.']),
    joke('「我可以先认输吗？」', '"Can I concede now?"', '还没开始就投降', 'Surrender before starting',
      ['angry', 'ダメ！　負けるなら、ちゃんと戦ってから負けなさい！', '不行！要输也得好好打完再输！', 'No! If you lose, lose after a proper fight!']),
    act('接过她的球拍，掂了掂分量', 'Take her racket and test its weight', '认真对待', 'Take it seriously',
      ['happy', '……ふーん、重さ確かめるんだ。少しは分かってるじゃない。', '……哦，还知道试重量。还算懂一点嘛。', '...Hm, checking the weight. You know a little, then.'])
  ],
  summer: [
    say('帽子のリボン、ワンピースと同じ赤だね。', '帽子的缎带，跟连衣裙是同一种红呢。', 'The ribbon on your hat matches the red of your dress.', '注意到细节', 'Notice the detail',
      ['surprised', '……気づいたの？　探すの、大変だったのよ。同じ赤って、なかなかないの。', '……你注意到了？很难找的。一样的红，没那么容易找到。', '...You noticed? It was hard to find. The same red is not easy.'],
      ['帽子のリボン、ワンピースと同じの赤だね。', '「同じ」直接修饰名词，不加「の」：「同じ赤」。', '同じ modifies nouns directly, without の: 同じ赤.'],
      ['帽子のリボン、ワンピースと違う赤だね。', '\"跟裙子是不一样的红\"，正好戳中她最在意的地方。', '\"A different red from the dress\" — exactly what she feared.']),
    joke('「适合啊。太适合了，我都不敢跟你走一起。」', '"It suits you. Too well. I am scared to walk next to you."', '半真半假', 'Half joking',
      ['shy', 'な、なによそれ。……並んで歩きなさいよ。そのために、着てきたんだから。', '干、干嘛啦。……给我并排走。我就是为了这个才穿的。', 'Wh-what is that. ...Walk next to me. That is why I wore it.']),
    act('风一来，你替她按住草帽的另一边', 'When the wind comes, hold down the other side of her hat', '默契', 'Without being asked',
      ['shy', '……飛ばされるとこだった。……ありがと。', '……差点就飞了。……谢谢。', '...It nearly blew away. ...Thanks.'])
  ],
  fantasy: [
    say('剣の持ち方、本当に騎士みたいだ。', '握剑的样子，真的像骑士。', 'The way you hold that sword — a real knight.', '认真地夸', 'Praise it seriously',
      ['happy', 'でしょ！？　……あ、いや、えっと。ふ、ふん。当然よ、騎士団長だもの。', '对吧！？……啊，不是，那个。哼、哼。当然了，我可是骑士团长。', 'Right?! ...Ah, no, um. H-hmph. Naturally. I am the commander.'],
      ['剣の持ち方、本当に騎士らしいみたいだ。', '「らしい」和「みたい」意思重复了，二选一。', 'らしい and みたい double up; use one.'],
      ['剣の持ち方、本当に騎士に見えない。', '\"一点都不像骑士\"，她会真的砍你。', '\"You do not look like a knight at all\" — she will draw.']),
    joke('单膝跪下：「团长大人，请饶我一命。」', 'Kneel: "Commander, spare my life."', '陪她演', 'Join the act',
      ['tease', 'よかろう。……ただし、今日一日、私の従者になること。', '准了。……不过，今天一整天，你要当我的随从。', 'Granted. ...But you serve as my squire all day.']),
    act('忍住不笑，严肃地敬了个礼', 'Keep a straight face and salute', '她说了不准笑', 'She said no laughing',
      ['shy', '……笑わなかったわね。……合格。……ちょっと、恥ずかしいけど。', '……你没笑呢。……合格。……虽然有点难为情。', '...You did not laugh. ...Pass. ...Even if it is a bit embarrassing.'])
  ]
};
