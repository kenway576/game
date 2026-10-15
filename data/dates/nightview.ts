import { D, say, joke, act } from './kit';

// 摩耶山掬星台的夜景
export const NIGHTVIEW = {
  asuka: D(
    ['缆车往上走的时候，明日香一直盯着窗外，不说话。你问她是不是怕高，她说\"怖くないわよ\"，可是手一直抓着扶手，指节都白了。', 'All the way up on the ropeway Asuka stares out the window in silence. Scared of heights? \"Not at all\" — but her knuckles are white on the rail.'],
    ['到了山顶，整个神户的灯光在脚下铺开。她走到观景台的栏杆边，看了很久，然后轻声说：\"……私の家、どこかしら\"。', 'At the top, all of Kobe\'s lights spread beneath you. At the railing she looks for a long time, then says softly: \"...I wonder which one is my house.\"'],
    ['她转过头，眼睛里映着城市的光：\"……一千万ドルの夜景って、本当ね\"。', 'She turns, the city reflected in her eyes: \"...The ten-million-dollar view. It\'s true.\"'],
    [say('明日香と見てるから、もっと高く感じる。', '因为是跟你一起看，感觉更值钱了。', 'Seeing it with you makes it worth even more.', '说句甜话', 'Something sweet',
      ['shy', '……な、何よ、それ。……値段のつけられないもの、って言いたいの？　……ずるいわ、そういうの。', '……什、什么啊，那是。……想说是无价的吗？……这种话，太狡猾了。', '...Wh-what\'s that supposed to mean. ...That it\'s priceless? ...That\'s unfair.'],
      ['明日香と見てるから、もっと高いく感じる。', '形容词副词形是「高く」，不是「高いく」。', 'The adverbial of 高い is 高く, not 高いく.'],
      ['一千万ドルって、大げさだよね。', '\"一千万美元太夸张了吧\"，煞风景。', '\"Ten million is an exaggeration\" — ruins the mood.']),
     joke('「抓扶手抓得那么紧，你在缆车上做俯卧撑吗。」', '"Gripping the rail that hard — doing push-ups on the ropeway?"', '吐槽', 'Snark',
      ['angry', 'つ、掴んでないわよ！　……揺れたから、念のためよ。……帰りは、あなたが隣に座りなさい。', '没、没抓！……因为晃了，以防万一。……回去的时候，你坐我旁边。', 'I-I wasn\'t gripping! ...It swayed, just in case. ...On the way down, you sit next to me.']),
     act('把外套披在她肩上——山顶很冷', 'Drape your jacket over her shoulders — it\'s cold up here', '照顾她', 'Look after her',
      ['happy', '……あなたが寒くなるでしょ。……でも、返さないわよ。……こっち、来なさい。半分、入れてあげる。', '……你会冷的吧。……不过，我不还你。……过来。分你一半。', '...You\'ll get cold. ...But I\'m not giving it back. ...Come here. I\'ll share half.'])]
  ),
  hikari: D(
    ['光一下缆车就冲到栏杆边，大喊\"すっごーい！\"，声音在山谷里回荡。旁边的情侣转过头来看，她吐了吐舌头。', 'Hikari bolts from the ropeway to the railing — \"Amaaazing!\" — her voice echoing across the valley. A couple turns to look; she sticks out her tongue.'],
    ['她指着远处的灯光，一个一个地数：\"あれが三宮、あれが港、あれが……{name}くんの家！\"你说不对，她说\"うちがそう決めたからええねん\"。', 'She points out the lights one by one: \"That\'s Sannomiya, that\'s the port, that\'s... your house!\" Wrong, you say. \"I decided it, so it\'s right.\"'],
    ['风很大。她搓着手，不说话了，靠到了你旁边。', 'The wind is strong. Rubbing her hands, she falls quiet and leans against you.'],
    [say('光ちゃんが決めたなら、そこが家でいいよ。', '既然是你定的，那就是家吧。', 'If you decided it, that\'s home.', '顺着她', 'Go along with her',
      ['shy', '……ほんま？　……ほな、いつか、ほんまにあそこに住も。……ふ、二人で、って意味ちゃうで！　……ちゃうくもないけど。', '……真的？……那总有一天，真的住在那里吧。……不、不是说两个人哦！……也不是不是。', '...Really? ...Then someday let\'s really live there. ...N-not like, together! ...Not NOT like that, either.'],
      ['光ちゃんが決めさせたなら、そこが家でいいよ。', '使役「決めさせた」是\"让（别人）决定\"，不对。', '決めさせた means \"made someone decide\".'],
      ['違うよ、あそこはただの工場だよ。', '\"那就是个工厂\"——太较真了。', '\"No, that\'s a factory\" — too literal.']),
     joke('「你刚才那一声，山下的人都听见了吧。」', '"After that shout, everyone at the bottom heard you."', '吐槽', 'Snark',
      ['tease', 'ええやん！　……山の神様に、うちが来たって、知らせたってん。……{name}くんと一緒にな。', '有什么关系！……是在告诉山神我来了。……跟你一起来的。', 'So what! ...I was telling the mountain god I\'m here. ...With you.']),
     act('握住她冰冷的手，放进你的口袋', 'Take her cold hand and put it in your pocket with yours', '暖一下', 'Warm it up',
      ['happy', '……あったかい。……ポケットの中で、手、つないでるみたいやな。……みたい、ちゃうか。つないでるな。', '……好暖。……在口袋里，像牵着手一样呢。……不是「像」吧。是牵着。', '...Warm. ...It\'s like we\'re holding hands in your pocket. ...Not \"like\". We are.'])]
  ),
  rei: D(
    ['铃带了一架小型的天文望远镜。她说掬星台的名字，意思是\"星を掬う\"——用手捧起星星的地方。', 'Rei brings a small telescope. Kikuseidai, she explains, means \"the place where you scoop up stars.\"'],
    ['可是今晚城市的光太亮，星星很少。她调了半天望远镜，有点失落。然后她低头看着脚下的灯海，说：\"……下にも、星がありますね\"。', 'But tonight the city lights are too bright and the stars are few. After fiddling with the telescope she\'s a little dejected. Then she looks down at the sea of lights: \"...There are stars below, too.\"'],
    ['她把望远镜转向你，从镜头里看了你一眼，然后飞快地移开了。', 'She swings the telescope toward you, takes one look through it, and quickly turns away.'],
    [say('今、何が見えたの？', '刚才看见什么了？', 'What did you just see?', '好奇', 'Curious',
      ['shy', '……一等星です。……測定エラーかもしれません。……もう一度、確認してもいいですか。', '……一等星。……可能是测量误差。……可以再确认一次吗？', '...A first-magnitude star. ...Possibly a measurement error. ...May I check again?'],
      ['今、何が見せたの？', '「見せた」是\"给（别人）看\"，问她看见了什么要用「見えた」。', '見せた means \"showed\"; to ask what she saw, 見えた.'],
      ['どうせ何も見えなかったでしょ。', '\"反正什么都看不见吧\"，太冷淡。', '\"You couldn\'t see anything anyway\" — dismissive.']),
     joke('「星星太少，那你掬什么？」', '"Not many stars — so what are you scooping?"', '打趣', 'Tease',
      ['tease', '……代わりに、あなたの言葉を掬います。……今日の分は、もう三つ集めました。', '……作为替代，我掬你说的话。……今天的份，已经收集了三句。', '...Your words, instead. ...I\'ve collected three today already.']),
     act('用双手做出捧起星星的样子，伸到她面前', 'Cup your hands as if scooping stars, and hold them out to her', '替她掬星', 'Scoop stars for her',
      ['happy', '……。……見えません。……でも、受け取ります。……あなたが掬ってくれた星なら、本物です。', '……。……看不见。……不过，我收下了。……你掬起来的星星，就是真的。', '.... ...I can\'t see them. ...But I\'ll accept them. ...Stars you scooped are real.'])]
  ),
  inari: D(
    ['稻荷站在山顶，看着脚下的城市。她说一百年前，这里晚上是一片黑，只有港口有几盏灯。\"……人の子の灯が、こんなに増えたか\"。', 'Inari stands at the summit, looking down at the city. A century ago, she says, it was dark at night — only a few lamps at the port. \"...So many human lights now.\"'],
    ['她伸出手，好像要去碰那些灯光。她说每一盏灯下面，都有一户人家，都有人在吃饭、在吵架、在笑。', 'She reaches out as if to touch them. Under every light, she says, is a household — people eating, quarrelling, laughing.'],
    ['她转过头，看着你：\"……わらわは、それを全部、守りたかったのじゃ\"。', 'She turns to you: \"...I wanted to protect every one of them.\"'],
    [say('稲荷様は、ちゃんと守ってきましたよ。この灯りが、その証拠です。', '稻荷大人一直守护着。这些灯光就是证据。', 'You have protected them. These lights are the proof.', '肯定她', 'Affirm her',
      ['shy', '……そなたは、ほんに、わらわの欲しい言葉をくれる。……千年分の、褒美じゃな。', '……你真是，总能给我想听的话。……这是千年份的奖赏呢。', '...You truly give me the words I want. ...A reward for a thousand years.'],
      ['稲荷様は、ちゃんと守られてきましたよ。', '被动「守られて」是\"被守护\"，主客颠倒。', '守られて means \"was protected\" — reversed.'],
      ['この灯りは、人間が自分で作ったものですよ。', '\"这是人类自己造的\"，否定了她的千年。', '\"Humans made these themselves\" — denies her thousand years.']),
     joke('「这么多灯，你一个个守得过来吗？」', '"That many lights — can you guard every one?"', '好奇', 'Curious',
      ['tease', '……無理じゃな。……じゃから、今は、一つだけでよい。……そなたの家の灯だけ、守ることにする。', '……做不到呢。……所以，现在一盏就够了。……只守护你家的那盏灯。', '...Impossible. ...So now, just one will do. ...I\'ll guard only your house\'s light.']),
     act('指着一盏很小的灯，说\"那是稻荷神社的灯\"', 'Point to a tiny light: \"That\'s your shrine\'s lamp.\"', '帮她找到家', 'Find her home',
      ['happy', '……見えるか。……ふふ、あんなに小さいのに。……そなたと見ると、どんな灯より明るく見える。', '……看得见吗。……呵呵，明明那么小。……跟你一起看，比任何灯都亮。', '...You can see it? ...Heh, so small. ...Seen with you, it\'s brighter than any light.'])]
  ),
  miyuki: D(
    ['深雪说她二十岁的时候，曾经跟一个人约好要来这里看夜景，可是那个人没来。她一个人坐最后一班缆车上来，看了五分钟就下去了。', 'At twenty, Miyuki says, she promised to see the night view here with someone. They didn\'t come. She rode the last ropeway up alone, looked for five minutes, and went down.'],
    ['今天，她在栏杆边站了很久，比五分钟长得多。她说：\"……十年越しの約束、あなたが果たしてくれたわね\"。', 'Today she stays at the railing much longer than five minutes. \"...You\'ve kept a ten-year-old promise for me.\"'],
    ['她转过身，背靠着栏杆，看着你，城市的光在她身后。', 'She turns, back to the railing, facing you, the city glowing behind her.'],
    [say('これからは、約束を破らない人と来てください。', '以后，请跟不会爽约的人一起来。', 'From now on, come here with someone who keeps promises.', '承诺', 'Promise',
      ['shy', '……それって、あなたのこと？　……ふふ、じゃあ、次の約束、もうしちゃっていい？　……来年も、ここで。', '……那是在说你吗？……呵呵，那下一个约定，现在就可以定吗？……明年，也在这里。', '...Meaning you? ...Hehe, then may I make our next promise now? ...Next year, here again.'],
      ['これからは、約束を破られない人と来てください。', '被动「破られない」是\"不被破坏\"，修饰\"人\"时意思乱了。', '破られない (passive) garbles who breaks the promise.'],
      ['その人のこと、まだ忘れられないんですね。', '\"你还忘不了那个人吧\"——她刚刚放下。', '\"You still can\'t forget him\" — she just let go.']),
     joke('「爽约的那个人，一定会后悔一辈子。」', '"Whoever stood you up will regret it forever."', '替她出气', 'Take her side',
      ['tease', 'ふふ、そうかしら。……でも、後悔してくれなくていいわ。……そのおかげで、今日があるんだもの。', '呵呵，会吗。……不过，他不后悔也没关系。……正因为这样，才有了今天。', 'Hehe, would he? ...He needn\'t regret it. ...Thanks to that, I have today.']),
     act('拿出手机，给她和背后的夜景拍一张照', 'Take a photo of her with the night view behind her', '新的回忆', 'A new memory',
      ['happy', '……あら、撮ってくれるの。……二十歳の私に、見せてあげたいわ。……「ちゃんと、来てくれる人がいたわよ」って。', '……哎呀，要帮我拍吗。……真想给二十岁的我看看。……「有人真的来了哦」。', '...Oh, you\'re taking one? ...I\'d like to show it to twenty-year-old me. ...\"Someone came after all.\"'])]
  ),
  sora: D(
    ['空不想坐缆车，她要走登山道上去。你跟着她爬了一个小时，到山顶的时候已经喘不上气了。她一点都不累，站在栏杆边等你。', 'Sora skips the ropeway — she\'s hiking up. After an hour\'s climb you\'re gasping at the top. She\'s not tired at all, waiting at the railing.'],
    ['你走过去，她指着脚下的灯海，说：\"……これ、走って来た奴だけが見れる景色や\"。', 'You join her. Pointing at the sea of lights: \"...A view only for those who climbed.\"'],
    ['她转过头，脸颊被风吹得红红的：\"……お前と来たかってん。一人で何回も来たけど\"。', 'She turns, cheeks red from the wind: \"...I wanted to come with you. I\'ve been up alone loads of times.\"'],
    [say('空がいなかったら、ここまで来れなかった。', '没有你的话，我爬不到这里。', 'Without you, I\'d never have made it up here.', '感谢她', 'Thank her',
      ['shy', '……アホ。……お前が来れるペースで、登ってたんや。……気づいてへんかったやろ。', '……笨蛋。……我是按照你跟得上的速度在爬。……你没发现吧。', '...Idiot. ...I was climbing at a pace you could manage. ...You didn\'t notice, did you.'],
      ['空がいなかったら、ここまで来させなかった。', '使役「来させなかった」是\"不让（别人）来\"，意思反了。', '来させなかった means \"wouldn\'t have let someone come\".'],
      ['もう二度と、歩いて登りたくない。', '\"再也不想走上来了\"，她特意带你来的。', '\"Never hiking up again\" — she brought you specially.']),
     joke('「一个人来了好几次，是在找谁吗？」', '"Up here alone loads of times — looking for someone?"', '逗她', 'Tease',
      ['angry', 'ち、ちゃうわ！　……トレーニングや。……でも、毎回、隣に誰かおったらええなって、思っとった。……それが、お前や。', '才、才不是！……是训练。……不过，每次都想要是旁边有人就好了。……那个人，就是你。', 'N-no! ...Training. ...But every time I thought it\'d be nice to have someone beside me. ...That\'s you.']),
     act('从包里拿出一瓶运动饮料递给她', 'Pull a sports drink from your bag and hand it to her', '准备好了', 'Came prepared',
      ['happy', '……準備ええやん。……ほな、半分こな。……ほら、お前が先に飲め。間接、とか、気にせえへんから。', '……准备得真好。……那，一人一半。……喏，你先喝。间接什么的，我不在意。', '...Well prepared. ...Halves, then. ...Here, you first. I don\'t care about the indirect-kiss thing.'])]
  ),
  nao: D(
    ['奈绪在缆车上一直闭着眼睛。到了山顶，你拉着她的手走到栏杆边，说\"可以睁开了\"。', 'Nao keeps her eyes shut the whole ropeway ride. At the top you lead her by the hand to the railing: \"You can open them now.\"'],
    ['她睁开眼睛。脚下是一整片灯光。她没有说话，只是握着你的手，越握越紧。', 'She opens her eyes. A whole field of lights below. She says nothing, only grips your hand tighter and tighter.'],
    ['很久以后，她小声说：\"……ほしが、したに おちてる\"。', 'A long time later, softly: \"...the stars have fallen down below.\"'],
    [say('奈緒の言葉、きれいだね。', '你说的话，好美。', 'What you said was beautiful.', '夸她', 'Praise her',
      ['shy', '……あんたの まえだと、ことばが でてくる。……ほかの ひとの まえだと、でてこない。……ふしぎ。', '……在你面前，话就出来了。……在别人面前，出不来。……好奇怪。', '...In front of you, the words come. ...In front of others, they don\'t. ...Strange.'],
      ['奈緒の言葉、きれいいね。', '「きれい」是な形容词，不加「い」：「きれいだね」。', 'きれい is a na-adjective: きれいだね, not きれいいね.'],
      ['星は落ちないよ、あれは街の灯りだよ。', '\"星星不会掉，那是城市的灯\"，太较真了。', '\"Stars don\'t fall, those are city lights\" — too literal.']),
     joke('「闭着眼睛坐缆车，是怕高还是想给自己惊喜？」', '"Eyes closed on the ropeway — scared of heights, or saving the surprise?"', '好奇', 'Curious',
      ['pout', '……りょうほう。……でも、あんたが てを つないでくれるって、しってたから。……とじてた。', '……两个都是。……不过，因为知道你会牵我的手。……才闭着的。', '...Both. ...But I knew you\'d hold my hand. ...So I closed them.']),
     act('站到她身后，用双手帮她挡住风', 'Stand behind her and shield her from the wind with both arms', '挡风', 'Shelter her',
      ['happy', '……あったかい。……うしろから、ぎゅって されてるみたい。……みたい、じゃなくても いい。', '……好暖。……好像从后面被抱住一样。……不是「好像」也可以。', '...Warm. ...Like being hugged from behind. ...It doesn\'t have to be \"like\".'])]
  ),
  maki: D(
    ['真希说这里的夜景是她游戏里\"最終ステージ\"的背景参考。她站在栏杆边，拿着手机拍了好几分钟，然后放下手机，看着真的夜景，不说话了。', 'Maki says this view is the reference for her game\'s final stage. She films at the railing for minutes, then lowers the phone and just looks at the real thing, silent.'],
    ['她说：\"……ドットで描いたら、この光、全部は表現できへんな\"。语气里有点失落，又有点开心。', '\"...In pixel art I could never capture all this light,\" she says — a little dejected, a little happy.'],
    ['她转过头，看着你：\"……せんぱいと見るんやったら、描かんでもええかもな\"。', 'She turns to you: \"...If I\'m seeing it with you, maybe I don\'t need to draw it.\"'],
    [say('真希の描く夜景も、見てみたいよ。', '也想看看你画的夜景。', 'I\'d still like to see the night view you draw.', '鼓励她', 'Encourage her',
      ['shy', '……せんぱい、ほんま、ずるいわ。……描くわ。……完成したら、エンディングに、せんぱい描き込んどく。', '……前辈，真的太狡猾了。……我会画的。……画完了，在结局里把前辈画进去。', '...Senpai, you\'re so unfair. ...I\'ll draw it. ...When it\'s done, I\'ll put you in the ending.'],
      ['真希の描く夜景も、見られてみたいよ。', '被动「見られてみたい」是\"想被看\"，意思不对。', '見られてみたい means \"want to be seen\".'],
      ['本物があるなら、描かなくてもいいね。', '\"有真的就不用画了\"，否定了她的创作。', '\"No need to draw it if the real thing exists\" — dismisses her work.']),
     joke('「最终关卡的背景——那最终Boss是谁？」', '"Final-stage backdrop — so who\'s the final boss?"', '接梗', 'Play along',
      ['tease', '……ラスボスは、せんぱいや。……攻略するのに、一年かかる予定。……もう半分、攻略したけどな。', '……最终Boss是前辈。……预计要花一年攻略。……已经攻略了一半了。', '...The final boss is you. ...Scheduled to take a year to beat. ...Already halfway, though.']),
     act('把她的手机拿过来，拍一张两个人和夜景的合照', 'Take her phone and snap a selfie of you both with the view', '参考资料', 'Reference material',
      ['happy', '……！　……資料、増えたな。……これは、ゲームには使わへん。……ウチだけの、隠しCGや。', '……！……资料增加了呢。……这张不用在游戏里。……是我专属的隐藏CG。', '...! ...More reference material. ...Not using this one in the game. ...It\'s my own hidden CG.'])]
  )
};
