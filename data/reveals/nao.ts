import { say, joke, act } from './kit';

// 奈绪：N5–N4，句子很短，常体，叫你「あんた」。认识十年，被夸会别扭，被逗会翻旧账。
export const NAO_REVEALS = {
  knit: [
    say('そのノート、まだ持ってるんだ。', '那个小本子，你还带着啊。', 'You still carry that notebook.', '注意到口袋里的小本子', 'Notice the notebook in her pocket',
      ['shy', '……うん。ずっと。……あんたのことも、少し書いてある。少しだけ。', '……嗯。一直带着。……也写了一点你的事。一点点而已。', '...Yeah. Always. ...There is a bit about you in it too. Just a bit.'],
      ['そのノート、まだ持つんだ。', '\"一直带着\"是状态，要用「持ってる」。', '\"Still carrying\" is a state: 持ってる.'],
      ['そのノート、もう持ってないんだ。', '\"已经不带了\"，事实说反了。', '\"You do not carry it any more\" — untrue.']),
    joke('「你说『刚到』，可你的奶茶已经喝完了。」', '"You say you just got here, but your milk tea is already finished."', '揭穿她', 'Catch her out',
      ['pout', '……のど、かわいてたの。……うそ。十分前に来た。', '……我口渴嘛。……骗你的。十分钟前就到了。', '...I was thirsty. ...Lie. I came ten minutes ago.']),
    act('自然地走到她外侧', 'Naturally fall into step on her outer side', '她一直走在你里侧', 'She always walks on your inside',
      ['surprised', '……あ。いつも、わたしが そっちなのに。……今日は、交代？', '……啊。平时都是我走那边。……今天换过来了？', '...Oh. I always walk on that side. ...Swap today?'])
  ],
  cat: [
    say('そのねこ、奈緒に似てる。', '那只猫，跟你很像。', 'That cat looks like you.', '老实地说', 'Say it honestly',
      ['pout', '……似てない。……似てる？　……うれしいかも。ねこ、すきだし。', '……才不像。……像吗？……可能有点高兴。毕竟我喜欢猫。', '...It does not. ...Does it? ...Maybe I am happy. I like cats.'],
      ['そのねこ、奈緒に似てるだ。', '「似てる」是动词，后面不加「だ」。', '似てる is a verb; no だ after it.'],
      ['そのねこ、奈緒に似てない。', '\"不像你\"，意思反了。', '\"Does not look like you\" — reversed.']),
    joke('学了一声猫叫', 'Do a cat meow at her', '逗她', 'Tease her',
      ['tease', '……へたくそ。……ねこは、もっと えらそうに なくよ。', '……好烂。……猫叫得要更神气一点。', '...Terrible. ...Cats meow more smugly than that.']),
    act('从口袋里摸出一颗猫形状的糖递给她', 'Find a cat-shaped sweet in your pocket and give it to her', '刚好带着', 'Just happened to have one',
      ['happy', '……なんで持ってるの。……もらう。食べない。かざる。', '……你怎么会带着这个。……我收下。不吃。摆着。', '...Why do you have that. ...I will take it. Not eat it. Keep it.'])
  ],
  sleep: [
    say('かみ、おろしてるの、はじめて見た。', '头发放下来的样子，第一次见。', 'First time I have seen your hair down.', '说出你的惊讶', 'Say what surprised you',
      ['shy', '……うそ。小さいとき、見てるよ。……でも、そっか。最近は、ないね。', '……骗人。小时候你见过的。……不过，也是。最近没有呢。', '...Liar. You saw it when we were little. ...But yeah. Not lately.'],
      ['かみ、おろしてるの、はじめて見る。', '\"第一次见到\"是刚刚发生的事，用过去形「見た」。', 'It just happened, so use the past 見た.'],
      ['かみ、おろしてるの、もう見たくない。', '\"不想再看\"，太伤人了。', '\"I never want to see it again\" — hurtful.']),
    joke('「看恐怖片吧。」', '"Let\'s watch a horror film."', '明知她怕', 'You know she is scared of them',
      ['angry', '……やだ。……あんた、こわいの だめなの、知ってるくせに。……となり、すわるよ。', '……不要。……你明知道我怕的。……我坐你旁边哦。', '...No. ...You know I hate scary ones. ...I am sitting next to you.']),
    act('从柜子里拿出一条毯子给她', 'Get a blanket out of the cupboard for her', '光着脚会冷', 'Her feet are bare',
      ['happy', '……ありがと。……あんたのにおい、する。……むかしと、おなじ。', '……谢谢。……有你的味道。……跟以前一样。', '...Thanks. ...It smells like you. ...Same as before.'])
  ],
  kimono: [
    say('あけましておめでとう。花のかざり、いいね。', '新年快乐。花发饰很好看。', 'Happy New Year. Nice flower ornament.', '拜年，夸发饰', 'Greeting plus praise',
      ['shy', 'おめでとう。……これ、おばさんが えらんだの。……でも、わたしも すき。', '新年快乐。……这个是阿姨挑的。……不过，我也喜欢。', 'Happy New Year. ...Auntie picked this. ...But I like it too.'],
      ['あけましておめでとう。花のかざり、いいだね。', '「いい」是い形容词，不加「だ」。', 'いい is an i-adjective; no だ.'],
      ['あけましておめでとう。花のかざり、いらないね。', '\"发饰不需要\"，她会难过。', '\"You do not need the ornament\" — she will be hurt.']),
    joke('「动不了的话，今年的初诣我背你去？」', '"If you cannot move, shall I carry you to the shrine?"', '半开玩笑', 'Half joking',
      ['pout', '……やだ。はずかしい。……手、かして。それで いい。', '……不要。好丢人。……手借我。那样就行。', '...No. Embarrassing. ...Lend me your hand. That is enough.']),
    act('替她把垂下来的那串花拨到肩后', 'Brush the dangling flowers back over her shoulder', '挡到她了', 'They were in her way',
      ['shy', '……ありがと。……ことしも、となり、いるからね。', '……谢谢。……今年也会在你旁边的。', '...Thanks. ...I will be beside you this year too.'])
  ],
  swim: [
    say('ありがとう。ぬってくれる？', '谢谢。帮我涂一下？', 'Thanks. Will you put it on me?', '借着防晒霜的话头', 'Take her up on it',
      ['surprised', '……え。……せ、せなかだけ だよ。……じっと しててね。', '……诶。……只、只涂背哦。……别乱动。', '...Eh. ...O-only your back. ...Hold still.'],
      ['ありがとう。ぬってあげる？', '「ぬってあげる」是\"我给你涂\"，授受反了。', 'ぬってあげる means \"shall I put it on you\" — reversed.'],
      ['ありがとう。ぬらないで。', '\"别涂\"，跟借防晒的意思冲突。', '\"Do not put it on\" — contradicts accepting it.']),
    joke('「你怎么知道我没涂？」', '"How did you know I had not put any on?"', '明知故问', 'Ask anyway',
      ['tease', 'あんた、十年 毎年 やけてるもん。……ことしは、わたしが まもる。', '你十年来每年都晒伤。……今年，我来保护你。', 'You have burned every year for ten years. ...This year I protect you.']),
    act('接过她的草编包，放到遮阳伞下', 'Take her straw bag and put it in the shade', '默默地', 'Quietly',
      ['happy', '……そういうとこ、かわんないね。……すき。……そういうとこが。', '……你这种地方，一直没变呢。……喜欢。……我是说你这种地方。', '...You have not changed there. ...I like it. ...That part, I mean.'])
  ],
  maid: [
    say('「にゃん」、かわいかったよ。', '那声「喵」，很可爱哦。', 'That \"nyan\" was cute.', '夸那句「喵」', 'Praise the meow',
      ['angry', '……いいんちょうの しじ だって いったでしょ。……もう 言わない。……たぶん。', '……不是说了是班长的指示嘛。……再也不说了。……大概。', '...I said it was the class rep\'s orders. ...Never again. ...Probably.'],
      ['「にゃん」、かわいいだったよ。', '「かわいい」的过去形是「かわいかった」，不是「かわいいだった」。', 'The past of かわいい is かわいかった.'],
      ['「にゃん」、こわかったよ。', '「こわかった」是\"好可怕\"。', 'こわかった means it was scary.']),
    joke('也学一声「喵」回给她', 'Meow back at her', '跟她一样', 'Same as her',
      ['tease', '……へたくそ。……でも、ちょっと すき。', '……好烂。……不过，有点喜欢。', '...Terrible. ...But I kind of like it.']),
    act('摸了摸她头上的猫耳发饰', 'Touch the cat ears on her headpiece', '好奇', 'Curious',
      ['shy', '……ほんものじゃ ないよ。……なでても、ごろごろ いわないよ。……たぶん。', '……不是真的哦。……摸了也不会呼噜呼噜。……大概。', '...They are not real. ...Stroking will not make me purr. ...Probably.'])
  ],
  gown: [
    say('ずっと、にあうと思ってた。', '我一直觉得会很适合你。', 'I always thought it would suit you.', '回答她', 'Answer her',
      ['shy', '……ずっと？　……じゃあ、言ってよ。もっと はやく。……ばか。', '……一直？……那你早点说啊。……笨蛋。', '...Always? ...Then say so. Sooner. ...Idiot.'],
      ['ずっと、にあうと思う。', '\"一直觉得\"是过去持续的想法，用「思ってた」。', '\"I always thought\" needs 思ってた.'],
      ['ずっと、にあわないと思ってた。', '\"一直觉得不适合\"，太伤人了。', '\"I always thought it would not suit you\" — hurtful.']),
    joke('「星星这么多，像你小本子上画的。」', '"So many stars. Like the ones you doodle in your notebook."', '提起小本子', 'Bring up the notebook',
      ['surprised', '……みてたの？　ノート。……いつ？　……もう、かくすとこ ないじゃん。', '……你看过？我的本子。……什么时候？……真是的，没地方藏了。', '...You looked? My notebook. ...When? ...Now I have nowhere to hide.']),
    act('替她把袖口理好', 'Smooth her sleeve cuff for her', '她一直在拉', 'She keeps tugging it',
      ['shy', '……ありがと。……なれないね、こういうの。……でも、あんたが いるから、へいき。', '……谢谢。……还是不习惯这种。……不过有你在，就没事。', '...Thanks. ...I am not used to this. ...But you are here, so I am fine.'])
  ],
  yukata: [
    say('ことしは、やぶらないよ。', '今年不会弄破了。', 'This year I will not tear it.', '接她的话', 'Answer her teasing',
      ['tease', 'ほんと？　……じゃあ、かけよ。やぶったら、りんごあめ ね。', '真的？……那打个赌。破了的话，请我吃苹果糖。', 'Really? ...Then let us bet. If you tear it, candy apple.'],
      ['ことしは、やぶれないよ。', '可能形「やぶれない」是\"弄不破\"，像在说纸太结实。', 'やぶれない sounds like \"it cannot tear\" — about the paper.'],
      ['ことしも、すぐ やぶるよ。', '\"今年也会马上弄破\"，你自己认输了。', '\"I will tear it quickly this year too\" — giving up.']),
    joke('「你去年捞到几条？一条都没有吧。」', '"How many did you catch last year? None, right?"', '翻旧账', 'Bring up the past',
      ['angry', '……いっぴき。……みずに おちて にげたけど。……かぞえて いいの。', '……一条。……虽然掉进水里跑了。……可以算的。', '...One. ...It fell in and escaped. ...It counts.']),
    act('替她把马尾上的花扶正', 'Set the flower in her ponytail straight', '它歪了', 'It tilted',
      ['shy', '……ありがと。……まいとし、それ、してくれるね。', '……谢谢。……你每年都帮我弄这个呢。', '...Thanks. ...You do that every year.'])
  ]
};
