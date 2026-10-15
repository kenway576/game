import { say, joke, act } from './kit';

// 空：N4–N3，短句，关西腔，男孩子气。被夸会慌，被逗会要单挑。
export const SORA_REVEALS = {
  school: [
    say('練習のあと、お疲れさま。', '练完球了，辛苦了。', 'Good work at practice.', '先慰劳她', 'Acknowledge the practice',
      ['happy', 'おう、サンキュ。……今日はシュート、八割入ったで。見せたかったわ。', '嗯，谢啦。……今天投篮进了八成。真想让你看看。', 'Yeah, thanks. ...Eighty percent of my shots went in today. Wish you had seen.'],
      ['練習のあと、お疲れさまだ。', '「お疲れさま」后面不加「だ」；客气一点说「お疲れさまです」。', 'お疲れさま takes no だ; politely, お疲れさまです.'],
      ['練習のまえ、お疲れさま。', '「練習のまえ」是\"练习之前\"，还没练就说辛苦了。', '練習のまえ means before practice.']),
    joke('把她歪掉的领带拉正：「明日香看见要罚你。」', 'Straighten her crooked tie: "Asuka would book you for this."', '提明日香', 'Mention Asuka',
      ['pout', 'うわ、委員長の名前出すなや。……直してくれたんは、まあ、ありがと。', '哇，别提班长的名字啊。……帮我弄正了，嘛，谢了。', 'Ugh, do not say the class rep\'s name. ...Thanks for fixing it, though.']),
    act('帮她拎一下搭在肩上的运动外套', 'Take the track jacket off her shoulder to carry', '她手里东西多', 'Her hands are full',
      ['surprised', 'お、持ってくれるんか。……汗くさいで、それ。……ええんか。', '哦，你帮我拿？……那个有汗味哦。……没关系吗？', 'Oh, you will carry it? ...It smells of sweat. ...You sure?'])
  ],
  summer: [
    say('そのTシャツ、空にしか似合わない。', '那件T恤，只有你穿才合适。', 'Only you could pull off that T-shirt.', '夸那个小篮球', 'Praise the little basketball',
      ['shy', 'な、なんやそれ。……バスケのやつ、自分で見つけてん。……そっか。似合うか。', '什、什么啊。……那个篮球图案是我自己找到的。……这样啊。合适吗。', 'Wh-what is that. ...I found the basketball one myself. ...Huh. It suits me?'],
      ['そのTシャツ、空しか似合わない。', '「しか」要接在「に」后面：「空にしか」，因为是\"对谁合适\"。', 'It needs に before しか: 空にしか.'],
      ['そのTシャツ、空にしか似合う。', '「しか」必须接否定，不能接肯定「似合う」。', 'しか must be followed by a negative.']),
    joke('「裙子跑不了，那你就跑给我看。」', '"Skirts are no good for running, so show me how you run."', '激她', 'Provoke her',
      ['tease', '言うたな？　あの電柱まで競走や。負けたらジュースおごりな！', '你说的哦？跑到那根电线杆。输了请喝饮料！', 'You said it. Race you to that pole. Loser buys drinks!']),
    act('递给她一瓶冰水', 'Hand her an ice-cold water', '天太热', 'It is too hot',
      ['happy', 'おっ、気ぃ利くやん。……冷た！　……さいこう。', '哦，挺机灵嘛。……好冰！……太爽了。', 'Oh, thoughtful. ...Cold! ...Perfect.'])
  ],
  autumn: [
    say('スカート、すごくいいと思う。', '裙子，我觉得很好看。', 'I think the skirt looks great.', '她在等你说话', 'She is waiting for it',
      ['shy', '……っ。……そ、そうか。……いや、ありがと。……やっぱ慣れへんな、こういうの。', '……！……是、是吗。……不，谢了。……果然还是不习惯这种事。', '...! ...R-really. ...No, thanks. ...I am not used to this.'],
      ['スカート、すごくいいだと思う。', '「と思う」前面接普通形，い形容词「いい」后面不加「だ」。', 'Before と思う, いい takes no だ.'],
      ['スカート、すごく変だと思う。', '「変」是\"奇怪\"，她会当场换掉。', '変 means weird — she will go and change.']),
    joke('「原来你也有裙子。我输了，请你刨冰。」', '"So you DO own a skirt. I lose — shaved ice is on me."', '认输', 'Concede',
      ['happy', 'ほんまか！？　……って、なんの勝負やねん。……でも、かき氷はもらうで。', '真的！？……等等，这是什么比赛啊。……不过刨冰我收下了。', 'Really?! ...Wait, what contest was that. ...I will take the shaved ice, though.']),
    act('替她把刘海上歪了的橙色发夹别正', 'Straighten the orange clip in her fringe', '它歪了', 'It was crooked',
      ['shy', '……お、おう。……そこ、自分では見えへんから、助かるわ。', '……哦、嗯。……那里我自己看不见，帮大忙了。', '...O-okay. ...I cannot see that spot myself. Thanks.'])
  ],
  swim: [
    say('いいよ。負けたら、かき氷おごる。', '好啊。输了我请刨冰。', 'Deal. If I lose, shaved ice is on me.', '接下挑战', 'Accept the challenge',
      ['happy', 'よっしゃ！　言うたな！　ほな、三、二、一――待たへんで！', '好嘞！你说的！那，三、二、一——不等你了！', 'Yes! You said it! Three, two, one — I am not waiting!'],
      ['いいよ。負けたら、かき氷おごられる。', '被动「おごられる」是\"被请客\"，你输了反而是你被请。', 'おごられる is passive — you would be treated instead.'],
      ['いいよ。勝ったら、かき氷おごる。', '\"赢了我请\"，赌约的条件反了。', '\"If I win, I pay\" — the bet is backwards.']),
    joke('「我先申请让你十秒。」', '"I request a ten-second head start. For me."', '耍赖', 'Cheat openly',
      ['tease', 'アホか、逆やろ普通。……ええよ、五秒な。それでも勝つけど。', '笨蛋，正常是反过来吧。……行，五秒。反正我还是赢。', 'Idiot, it is normally the other way. ...Fine, five seconds. I will still win.']),
    act('把她推到头顶的墨镜摘下来，替她架回鼻梁', 'Take the sunglasses off her head and settle them on her nose', '太阳刺眼', 'The sun is harsh',
      ['surprised', '……お、おう。……見えへんようにしてくれたんか。……サンキュ。', '……哦、嗯。……是帮我挡光吗。……谢啦。', '...O-okay. ...To shade my eyes? ...Thanks.'])
  ],
  maid: [
    say('三連敗でも、着こなしてるのはすごい。', '三连败还能穿得这么好，厉害。', 'Lost three straight and still wearing it well. Impressive.', '换个角度夸', 'Praise from a new angle',
      ['shy', '……見るなって言うたやろ。……でも、着こなしてる、か。……なら、まあ、ええわ。', '……不是说别看吗。……不过，穿得好吗。……那就算了。', '...I said do not look. ...But wearing it well, huh. ...Then, fine.'],
      ['三連敗でも、着こなしてるのはすごいだ。', '「すごい」是い形容词，不加「だ」。', 'すごい is an i-adjective; no だ.'],
      ['三連勝でも、着こなしてるのはすごい。', '「三連勝」是\"三连胜\"，事实说反了。', '三連勝 means three straight wins — wrong.']),
    joke('「再来一局猜拳？赢了就能换回来。」', '"Another round of rock-paper-scissors? Win and you can change back."', '给她机会', 'Give her a chance',
      ['angry', 'やる！　……グー！　……なんでパーやねん！　読まれてるやん！', '来！……石头！……为什么是布啊！被看穿了！', 'You are on! ...Rock! ...Why paper?! You read me!']),
    act('认真地背过身去，不看', 'Turn your back properly and do not look', '尊重她', 'Respect her',
      ['shy', '……ほんまに向こう向いたんか。……ちょっとだけなら、見てもええで。ちょっとだけな。', '……真的转过去了啊。……一点点的话，看看也行。就一点点。', '...You really turned round. ...A tiny look is okay. Just a tiny one.'])
  ],
  kimono: [
    say('あけましておめでとう。立ち方が空らしい。', '新年快乐。站姿很有你的风格。', 'Happy New Year. You stand like Sora.', '拜年，顺便夸', 'Greeting plus praise',
      ['happy', 'おめでとさん。……空らしいって、ガニ股ってことか？　……まあ、ええわ。今年もよろしゅう。', '新年快乐。……很有我的风格，是说我八字脚吗？……算了。今年也请多指教。', 'Happy New Year. ...Like me — you mean bow-legged? ...Whatever. Let us get along this year.'],
      ['あけましておめでとう。立ち方が空らしいだ。', '「らしい」是い形容词型，不加「だ」。', 'らしい ends like an i-adjective; no だ.'],
      ['あけましておめでとう。立ち方が空らしくない。', '\"一点都不像你\"，夸点没了。', '\"Not like you\" — the praise is gone.']),
    joke('「穿和服的话，今年第一场比赛你让我吧？」', '"In a kimono, you will let me win the first game of the year?"', '趁机', 'Seize the chance',
      ['tease', 'アホ、着物でもお前には勝つわ。……初詣でお願いするのは、勝つことやしな。', '笨蛋，穿和服我也能赢你。……今年初诣许的愿，就是赢。', 'Idiot, I beat you even in a kimono. ...My New Year wish is winning, after all.']),
    act('放慢脚步，配合她踩着木屐的小碎步', 'Slow down to match her small steps in geta', '她走不快', 'She cannot walk fast',
      ['shy', '……合わせてくれてんのか。……こういうとこ、ずるいわ。', '……你在配合我吗。……你这种地方，太狡猾了。', '...You are matching my pace? ...That kind of thing is unfair.'])
  ],
  gown: [
    say('大丈夫。転ばないように、ちゃんと支える。', '没事。我会好好扶着你，不让你摔。', 'It\'s fine. I will hold you steady so you do not fall.', '接下她的请求', 'Take her request',
      ['shy', '……ほんまやで。……離したら、ファウルやからな。', '……说好了哦。……放手的话，就算你犯规。', '...You promise. ...Let go and it is a foul.'],
      ['大丈夫。転ぶように、ちゃんと支える。', '「転ぶように」是\"为了摔倒\"，目的说反了，要用「転ばないように」。', '転ぶように means \"so that she falls\" — use 転ばないように.'],
      ['大丈夫。転ばないように、ちゃんと支えない。', '\"不会扶你\"，跟承诺相反。', '\"I will not hold you\" — contradicts the promise.']),
    joke('「等哨声？那我吹了：比赛开始。」', '"Waiting for a whistle? Then — tip-off."', '缓解紧张', 'Ease her nerves',
      ['happy', 'ぷっ……なんやそれ。……でも、ちょっと緊張とれたわ。ほな、行こか。', '噗……那是什么。……不过，稍微没那么紧张了。那，走吧。', 'Pfft... what is that. ...But I am less nervous now. Okay, let us go.']),
    act('把手臂伸给她扶着', 'Offer her your arm to hold', '高跟鞋', 'The heels',
      ['shy', '……おう。……腕、思ってたより、しっかりしてるな。', '……嗯。……你的手臂，比我想的还要结实呢。', '...Yeah. ...Your arm is steadier than I thought.'])
  ]
};
