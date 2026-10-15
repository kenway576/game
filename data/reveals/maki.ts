import { say, joke, act } from './kit';

// 真希：N3 语法 + 浓关西腔和俗语。爱叫「せんぱい」「ざぁこ♡」；被认真夸会当场卡壳。
export const MAKI_REVEALS = {
  school: [
    say('星のヘアピン、真希らしいね。', '星星发夹，很有真希的风格。', 'The star hairclip is so very Maki.', '夸发夹，不接她的茬', 'Praise the clip, ignore the bait',
      ['shy', '……え。そっち？　……ふ、ふーん。わかっとるやん、せんぱい。……ちょっとだけな。', '……诶。夸那个？……哼、哼——。挺懂的嘛，前辈。……就一点点。', '...Eh. That? ...H-hmph. You get it, senpai. ...A little.'],
      ['星のヘアピン、真希らしいだね。', '「らしい」是い形容词型，不加「だ」。', 'らしい ends like an i-adjective; no だ.'],
      ['星のヘアピン、真希らしくないね。', '\"不像你\"，她会拿这个嘲笑你一整天。', '\"Not like you\" — she will mock you all day.']),
    joke('「校规写的长度，你差了大概五厘米。」', '"You are about five centimetres short of the regulation length."', '学明日香的口气', 'Do your Asuka impression',
      ['tease', 'うわ、委員長のモノマネ？　似てへん、ざぁこ♡　……でも測ったん？　キモ〜。', '哇，模仿班长？一点都不像，杂鱼♡……等等你量过？好恶心～', 'Ew, a class-rep impression? Not even close, loser. ...Wait, you measured? Gross.']),
    act('把她脖子上的耳机摘下来，戴到自己头上听一下', 'Take the headphones off her neck and listen for a second', '好奇她在听什么', 'Curious what she is playing',
      ['surprised', 'ちょ、勝手に！　……それ、ウチのハイスコアの曲やねん。……ええやろ？', '喂、别擅自！……那是我拿最高分的曲子。……好听吧？', 'Hey, without asking! ...That is my high-score track. ...Good, right?'])
  ],
  cardigan: [
    say('うん、かわいい。袖も。', '嗯，可爱。袖子也是。', 'Yeah, cute. The sleeves too.', '照她要求的说', 'Say what she asked for',
      ['shy', '……は？　ほんまに言うた。……ちょ、そんなすぐ言われたら、ウチが困るんやけど。', '……哈？真的说了。……喂，这么快就说，我会很困扰的好吗。', '...Huh? You actually said it. ...Hey, saying it that fast throws me.'],
      ['うん、かわいい。袖もだ。', '口语里「袖も」直接结束就好，硬加「だ」很别扭。', 'Ending on 袖も is natural; adding だ is clunky.'],
      ['うん、かわいくない。袖も。', '\"不可爱，袖子也是\"，她会记仇。', '\"Not cute, the sleeves neither\" — she will hold a grudge.']),
    joke('「袖子那么长，是不是想藏零食？」', '"Sleeves that long — hiding snacks in there?"', '拆穿她', 'Call it',
      ['tease', 'なんでバレてんねん。……グミ、一個やるわ。口止め料な。', '怎么被发现了。……给你一颗软糖。封口费哦。', 'How did you know. ...Have a gummy. Hush money.']),
    act('把她的袖子往上折了一折，露出手指', 'Fold her sleeve back once so her fingers show', '方便她拿东西', 'So she can hold things',
      ['surprised', 'ちょ、わざと長いんやって！　……まあ、ええけど。手、冷たいん触ったやろ。', '喂，故意弄长的啊！……算了。你刚才碰到我冰冷的手了吧。', 'Hey, they are long on purpose! ...Whatever. You touched my cold hand, didn\'t you.'])
  ],
  punk: [
    say('ワッペン、全部ゲームのだね。', '布贴，全都是游戏的呢。', 'All your patches are from games.', '注意到细节', 'Notice the details',
      ['happy', 'せや！　全部ウチがクリアしたやつ。……このドクロだけ、まだやねん。いつか倒す。', '对啊！全都是我通关过的。……只有这个骷髅还没。总有一天要打倒它。', 'Yep! All games I have cleared. ...Except the skull. Some day I will beat it.'],
      ['ワッペン、全部ゲームのだな。', '能懂，但「だな」是自言自语；跟她说话用「だね」。', 'Understandable, but だな is musing; use だね with her.'],
      ['ワッペン、全部ゲームじゃないね。', '\"全都不是游戏的\"，事实说反了。', '\"None of them are from games\" — untrue.']),
    joke('「等一个币的时间是多久？三分钟？」', '"How long is one credit\'s wait? Three minutes?"', '较真', 'Be pedantic',
      ['tease', 'ウチの腕やったら、一コインで二十分もつで？　……つまり、二十分待ったってこと♡', '以我的水平，一个币能玩二十分钟哦？……也就是说，我等了二十分钟♡', 'At my level, one credit lasts twenty minutes. ...So I waited twenty minutes.']),
    act('从口袋里掏出两枚游戏币，递一枚给她', 'Take two arcade tokens from your pocket and give her one', '准备好了', 'Came prepared',
      ['surprised', '……準備ええやん、せんぱい。……ほな、ウチの縄張りで、ボコボコにしたるわ。', '……准备得不错嘛，前辈。……那就在我的地盘把你打得落花流水。', '...Well prepared, senpai. ...Then I will crush you on my turf.'])
  ],
  kimono: [
    say('あけましておめでとう。こけし、似合ってるよ。', '新年快乐。木芥子跟你很配。', 'Happy New Year. The kokeshi charm suits you.', '拜年，夸挂饰', 'Greeting plus praise',
      ['happy', 'おめでとさん♡　これな、おばあちゃんが くれてん。……せんぱいも、触ってええで。', '新年快乐♡这个啊，是奶奶给我的。……前辈也可以摸摸哦。', 'Happy New Year! Grandma gave me this. ...You can touch it, senpai.'],
      ['あけましておめでとう。こけし、似合うよ。', '此刻挂着，用状态「似合ってる」更自然。', 'For what she has on now, 似合ってる is more natural.'],
      ['あけましておめでとう。こけし、似合わないよ。', '\"不适合你\"，新年第一天就吵架。', '\"It does not suit you\" — a fight on day one.']),
    joke('掏出一个空红包递给她', 'Hand her an empty New Year envelope', '给了，但没钱', 'Given, but empty',
      ['angry', '……からっぽやん！　ざぁこ！　……袋はもらっとくけど。かわいいから。', '……空的啊！杂鱼！……袋子我收下了。因为好看。', '...It is empty! Loser! ...I will keep the envelope, though. It is cute.']),
    act('替她把挂在脖子上的猫耳耳机理顺', 'Straighten the cat-ear headphones round her neck', '它们缠住了领子', 'They caught on her collar',
      ['shy', '……着物にヘッドホン、変やと思った？　……ウチは、これがないと落ち着かへんねん。', '……和服配耳机，你觉得奇怪吧？……可没有这个我会不安的。', '...Kimono and headphones — weird, right? ...I cannot settle without them.'])
  ],
  gown: [
    say('きれいだ。言葉が出てこなかった。', '很漂亮。我刚才说不出话来。', 'You are beautiful. I could not find the words.', '老实说', 'Be honest',
      ['shy', '…………。……あかん、反則やで、それ。……もう一回、言うて。', '…………。……不行，这是犯规。……再说一遍。', '.......... ...No fair, that is a foul. ...Say it again.'],
      ['きれいだ。言葉が出てこないだった。', '「出てこない」是い形容词型，过去形是「出てこなかった」。', 'The past of 出てこない is 出てこなかった.'],
      ['きれいだ。言葉がたくさん出てきた。', '\"说了好多话\"，跟刚才沉默的事实对不上。', '\"Lots of words came out\" — contradicts your silence.']),
    joke('「今天不叫我杂鱼了？」', '"No \'loser\' today?"', '反将一军', 'Turn it around',
      ['pout', '……今日は、言わへん。……言うたら、ウチのほうが負けそうやから。', '……今天不说。……说了的话，感觉输的会是我。', '...Not today. ...If I say it, I feel like I would be the one losing.']),
    act('向她伸出手', 'Hold out your hand to her', '礼服很长', 'The gown is long',
      ['shy', '……ほんま、今日のせんぱい、ずるいわ。……ちゃんと、握っといてや。', '……今天的前辈真狡猾。……要好好握紧哦。', '...You are really unfair today, senpai. ...Hold on properly.'])
  ],
  swim: [
    say('ピクセルのハート、かわいいね。', '像素爱心，好可爱。', 'The pixel hearts are cute.', '只看图案', 'Look at the pattern only',
      ['tease', 'ふーん、そこ見るんや。……ほんまに図柄だけ？　にしし、目ぇ泳いどるで♡', '哼——，你看那里啊。……真的只看图案？嘻嘻，眼睛在游泳哦♡', 'Hmm, looking there, are you. ...Really just the pattern? Heehee, your eyes are swimming.'],
      ['ピクセルのハート、かわいくね。', '「かわいくね」是很随便的说法，听起来像在问\"不可爱吗\"。', 'かわいくね is slangy and sounds like a question \"not cute?\"'],
      ['ピクセルのハート、ださいね。', '「ださい」是\"土、俗气\"，等于在嘲笑她。', 'ださい means tacky — mocking her.']),
    joke('「眼睛游泳是因为海太亮了。」', '"My eyes are swimming because the sea is too bright."', '嘴硬', 'Make an excuse',
      ['tease', '言い訳ヘタすぎやろ、ざぁこ♡　……サングラス、貸したろか？', '找借口也太烂了吧，杂鱼♡……要借你墨镜吗？', 'Worst excuse ever, loser. ...Want to borrow my sunglasses?']),
    act('把她的两个丸子头上松掉的发绳紧一紧', 'Tighten the loose hair tie on one of her buns', '快散了', 'It is coming undone',
      ['shy', '……え、触った？　……ほどけかけてたんか。……ありがと。……言うたからな、今の一回だけ。', '……诶，碰了？……快散了吗。……谢谢。……我只说这一次。', '...Eh, you touched it? ...Was it coming loose. ...Thanks. ...I am saying it once only.'])
  ]
};
