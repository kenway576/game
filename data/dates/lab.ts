import { D, say, joke, act } from './kit';

// 理科室的小实验（焰色反应）
export const LAB = {
  asuka: D(
    ['明日香已经把实验步骤写在了黑板上，一共九步，每一步旁边画了一个小方框，等着打勾。她把粉笔递给你：「勾は、あんたが付けなさい」。', 'Asuka has written the procedure on the board, nine steps, each with a little box waiting for a tick. She hands you the chalk: "You do the ticks."'],
    ['做到第四步，她发现你漏了护目镜，伸手就把它扣到你头上，扣得很用力。「事故が起きたら、委員長の責任になるのよ」。', 'At step four she notices you are not wearing goggles and jams a pair on your head, hard. "If there is an accident, it is the class rep\'s fault."'],
    ['最后一小撮盐，标签看不清了。她皱着眉头盯着它。', 'The last pinch of salt has an unreadable label. She frowns at it.'],
    [say('わからないなら、試してみよう。', '不知道的话，就试试看吧。', 'If we do not know, let\'s test it.', '用实验解决', 'Let the experiment decide',
      ['neutral', '……正論ね。でも、手順は守るわよ。ステップ十、追加。', '……说得对。不过，步骤要守。追加第十步。', '...Fair. But we follow procedure. Adding step ten.'],
      ['わからないなら、試してみろう。', '「試してみる」的意志形是「試してみよう」，没有「みろう」。', 'The volitional of 試してみる is 試してみよう.'],
      ['わかるなら、試してみよう。', '\"知道的话就试试\"，条件说反了。', '\"If we DO know\" — reversed.']),
     joke('「班长要是炸了实验室，算谁的责任？」', '"If the class rep blows up the lab, whose fault is it?"', '翻她的话', 'Use her words against her',
      ['angry', '爆発なんてしないわよ！　……し、しないわよね？　あんた、ちゃんと見てなさいよ。', '才不会爆炸！……不、不会吧？你给我好好看着。', 'Nothing is exploding! ...I-it won\'t, right? Watch carefully.']),
     act('在黑板上替她画好第十个小方框', 'Draw the tenth little box on the board for her', '配合她的规矩', 'Play by her rules',
      ['happy', '……分かってるじゃない。……勾、きれいに付けなさいよ。', '……挺懂的嘛。……勾要打得漂亮点。', '...You get it. ...Make the tick neat.'])]
  ),
  hikari: D(
    ['光把护目镜戴反了，带子在前面，镜片在后脑勺。她说这样看起来像一只昆虫，然后自己先笑得蹲了下去。', 'Hikari has her goggles on backwards, strap at the front, lenses on the back of her head. She says she looks like a bug, then laughs so hard she has to crouch.'],
    ['铜的火焰变绿的时候，她「わあ」了一声，声音大到走廊里有人探头进来。她冲那个人挥了挥手，那个人也挥了挥手，走了。', 'When the copper flame turns green she goes "Waaah!" so loud someone looks in from the corridor. She waves at them. They wave back and leave.'],
    ['她把最后一小撮盐托在手心，看着你。', 'She holds the last pinch of salt in her palm and looks at you.'],
    [say('今度は、何色だと思う？', '这次你觉得是什么颜色？', 'What colour do you think this one is?', '让她猜', 'Let her guess',
      ['happy', 'うーん……ピンク！　ピンクがええ！　ピンクやったら、うちの勝ちな！', '嗯……粉色！我想要粉色！是粉色的话就算我赢！', 'Hmm... pink! I want pink! If it is pink, I win!'],
      ['今度は、何色と思う？', '\"觉得是……\"前面接「だと思う」，名词后要有「だ」。', 'A noun before と思う needs だ.'],
      ['今度は、何色だった？', '还没撒就问\"是什么颜色来着\"，时态错了。', 'Asking what colour it WAS before trying.']),
     joke('「你戴反的护目镜，保护的是你后脑勺。」', '"Your backwards goggles are protecting the back of your head."', '指出来', 'Point it out',
      ['surprised', 'えっ！？　……ほんまや！　……後ろから火ぃ来たら、安全やな！', '诶！？……真的！……要是火从后面来，就安全了呢！', 'Eh?! ...Oh no! ...Safe if fire comes from behind, then!']),
     act('替她把护目镜摘下来，转个方向重新戴好', 'Take her goggles off, turn them round and put them back on properly', '顺手', 'Just do it',
      ['shy', 'あ……ありがと。……ちかい。……なんか、実験より、ドキドキする。', '啊……谢谢。……好近。……总觉得比实验还心跳加速。', 'Oh... thanks. ...Close. ...My heart is racing more than the experiment.'])]
  ),
  rei: D(
    ['铃已经把酒精灯点上了，火焰很小，很稳，是那种被调过很多次的稳。她看见你，指了指桌上的第二副护目镜，没有说话，表示\"已经为你准备好了\"。', 'Rei already has the spirit lamp lit — a small, steady flame, the steadiness of many adjustments. She points at a second pair of goggles on the bench without a word: prepared for you.'],
    ['每撒一次盐，她都在本子上写下颜色、时间、和你的反应。你问为什么要记你的反应。她说「対照実験です」。', 'Every time salt goes in she writes down the colour, the time, and your reaction. You ask why your reaction. "Control experiment."'],
    ['最后一小撮，标签洇了。她把放大镜递给你。', 'The last pinch. The label has run. She hands you a magnifying glass.'],
    [say('ナトリウムかもしれない。', '可能是钠。', 'It might be sodium.', '认真推理', 'Reason it out',
      ['happy', '……根拠を、聞かせてください。……もし正解なら、記録に「共同研究者」と書きます。', '……请说说你的依据。……如果答对了，我在记录里写上「共同研究者」。', '...Please give your reasoning. ...If you are right, I will write \"co-researcher\" in the record.'],
      ['ナトリウムかもしれないだ。', '「かもしれない」后面不加「だ」。', 'かもしれない takes no だ.'],
      ['ナトリウムに違いない。', '「に違いない」是\"一定是\"，太武断，铃会要你拿出证据。', 'に違いない means \"must be\" — far too certain without evidence.']),
     joke('「对照组的我，现在心跳有点快。」', '"Your control subject\'s heart rate is a bit high right now."', '用她的话', 'Use her terms',
      ['shy', '……その変数は、記録しません。……実験の邪魔になるので。', '……这个变量不记录。……因为会干扰实验。', '...I will not record that variable. ...It would contaminate the experiment.']),
     act('把窗帘再拉上一点，让火焰看得更清楚', 'Draw the curtains a little more so the flame shows clearer', '改善条件', 'Improve conditions',
      ['surprised', '……照度を下げる判断は、正しいです。……あなたは、いい助手ですね。', '……降低照度的判断是对的。……你是个好助手。', '...Lowering the light is correct. ...You make a good assistant.'])]
  ),
  inari: D(
    ['稻荷坐在实验台上——坐在上面——手里拿着一个烧瓶，对着光看，像在看一颗宝石。她说她看过一千年的火，但这种会变颜色的火，还是第一次。', 'Inari is sitting on the bench — on it — holding a flask up to the light like a jewel. She says she has watched a thousand years of fire, but fire that changes colour is new.'],
    ['锂的红色火焰升起来的时候，她的狐耳从头发里冒了出来，竖得笔直。她赶紧按回去，假装什么都没发生。', 'When the lithium burns red her fox ears pop out of her hair, bolt upright. She presses them back down and pretends nothing happened.'],
    ['她拿起最后一小撮盐，凑近火焰。', 'She picks up the last pinch and leans toward the flame.'],
    [say('近すぎると、危ないですよ。', '离太近会有危险哦。', 'Too close is dangerous.', '提醒她', 'Warn her',
      ['tease', 'ふふ、狐火の主に、火の心配か。……されど、そなたが言うなら、少し下がろう。', '呵呵，担心狐火的主人被火伤吗。……不过既然你这么说，我就退后一点。', 'Heh, warning the mistress of fox-fire about fire? ...But since you say so, I will step back.'],
      ['近すぎると、危ないだですよ。', '「危ない」是い形容词，后面不加「だ」。', '危ない is an i-adjective; no だ.'],
      ['遠すぎると、危ないですよ。', '\"离太远会危险\"，说反了。', '\"Too far is dangerous\" — reversed.']),
     joke('「刚才耳朵冒出来了哦。」', '"Your ears popped out just now."', '揭穿', 'Expose it',
      ['angry', '出ておらぬ！　……見間違いじゃ。……誰にも言うでないぞ。', '没有冒出来！……你看错了。……不许跟任何人说。', 'They did not! ...You saw wrong. ...Tell no one.']),
     act('把实验台上的烧杯挪远一点，给她腾地方坐', 'Move the beakers aside to give her room on the bench', '既然她要坐', 'Since she insists on sitting',
      ['happy', '……気が利くのう。千年生きて、実験台に座らせてもらうのは初めてじゃ。', '……还挺机灵。活了一千年，第一次有人让我坐实验台。', '...Thoughtful. A thousand years, and the first time anyone has made room for me on a lab bench.'])]
  ),
  miyuki: D(
    ['深雪站在理科室门口，脸上写着\"我是不是不该进来\"。她说她以前最怕理科，尤其是这种有火的。说完她还是走了进来，挑了离酒精灯最远的那个凳子坐下。', 'Miyuki hovers at the door looking as if she should not come in. She says science always scared her, especially the fire kind. Then she comes in anyway and takes the stool furthest from the lamp.'],
    ['钠的黄色火焰亮起来，她说「あ、お味噌汁を作る時のガスの色」。你想了想，觉得她说得一点都没错。', 'The sodium flame flares yellow. "Oh — the colour of the gas when I make miso soup." You think about it and decide she is exactly right.'],
    ['最后一小撮盐，她看着你，等你决定。', 'The last pinch. She looks at you, waiting for you to decide.'],
    [say('一緒にやりましょう。怖くないですよ。', '一起做吧。不可怕的。', 'Let\'s do it together. It\'s not scary.', '邀请她', 'Invite her in',
      ['shy', '……あなたが隣にいてくれるなら。……手、少し震えてるの、内緒にしてね。', '……如果你在旁边的话。……我的手有点抖，要保密哦。', '...If you stay beside me. ...My hands are shaking a little — keep it a secret.'],
      ['一緒にやりましょう。怖いじゃないですよ。', '「怖い」是い形容词，否定是「怖くない」。', 'The negative of 怖い is 怖くない.'],
      ['一緒にやめましょう。怖くないですよ。', '「やめましょう」是\"一起放弃吧\"，跟邀请相反。', 'やめましょう means \"let\'s give up\".']),
     joke('「深雪小姐的味噌汤，原来是焰色反应啊。」', '"So your miso soup is a flame test."', '接她的话', 'Run with it',
      ['happy', 'ふふ、じゃあ今夜のお味噌汁は、実験の続きね。……食べに来る？', '呵呵，那今晚的味噌汤，就是实验的后续了。……要来吃吗？', 'Hehe, then tonight\'s soup continues the experiment. ...Coming to eat?']),
     act('站到她和酒精灯之间', 'Stand between her and the lamp', '挡在前面', 'Shield her',
      ['shy', '……守ってくれるの？　……ふふ、頼もしい生徒さん。', '……你在保护我吗？……呵呵，好可靠的学生。', '...Protecting me? ...Hehe, what a reliable student.'])]
  ),
  sora: D(
    ['空把护目镜推到额头上，像戴墨镜一样，站在实验台前双手叉腰。她说「理科は苦手や。でも、火は好き」。理由她没说。', 'Sora has her goggles pushed up on her forehead like sunglasses, hands on hips at the bench. "Science, no. Fire, yes." She does not explain.'],
    ['她撒盐的动作像在投罚球：瞄、停、手腕一抖。铜的绿色火焰窜起来，她握拳低吼了一声「よっしゃ」。', 'She tosses salt like a free throw: aim, pause, flick of the wrist. The copper flame leaps green and she growls "Yes!" with a fist pump.'],
    ['最后一小撮。她说要比，谁猜中颜色谁赢。', 'The last pinch. She wants a contest: whoever guesses the colour wins.'],
    [say('負けたら、ジュースおごる。', '输了我请你喝饮料。', 'Loser buys the drinks.', '接下比赛', 'Accept the contest',
      ['happy', '言うたな！　ウチは赤や！　……お前は？　早よ言え！', '你说的哦！我猜红色！……你呢？快说！', 'You said it! I say red! ...You? Hurry up!'],
      ['負けたら、ジュースおごられる。', '被动「おごられる」是\"被请客\"，输了反而被请，条件反了。', 'おごられる is passive — the loser would be treated.'],
      ['勝ったら、ジュースおごる。', '\"赢了我请\"，赌注逻辑反了。', '\"If I win, I pay\" — backwards.']),
     joke('「你投盐的姿势，比你投篮还认真。」', '"You throw salt more seriously than you shoot hoops."', '逗她', 'Tease her',
      ['angry', 'はあ！？　シュートのほうが真剣に決まっとるやろ！　……今のは、練習や練習。', '哈！？投篮当然更认真啊！……刚才那是练习，练习。', 'Hah?! Of course shooting is more serious! ...That was practice. Practice.']),
     act('替她把推在额头上的护目镜拉下来戴好', 'Pull her goggles down from her forehead and set them properly', '安全第一', 'Safety first',
      ['shy', '……お、おう。……まあ、目は大事やな。シュートできへんくなるし。', '……哦、嗯。……嘛，眼睛很重要。看不见就投不了篮了。', '...O-okay. ...Well, eyes matter. Can\'t shoot without them.'])]
  ),
  nao: D(
    ['奈绪坐在最后一排的实验台前，面前摆着她的小本子，已经把七种盐的名字抄好了，每个名字后面留着一个空格，等着填颜色。', 'Nao is at the back bench with her little notebook, the names of the seven salts already copied out, each followed by a blank waiting for a colour.'],
    ['每次火焰变色，她就用彩色铅笔在空格里涂一小块。涂得很认真，涂完还要比一比，看颜色像不像。锂的那一格，她涂了三次。', 'Each time the flame changes she colours a little square in the blank. Carefully, then compares it to the real thing. She colours the lithium square three times.'],
    ['最后一格空着。她把彩色铅笔递给你。', 'The last square is empty. She hands you the coloured pencils.'],
    [say('最後の色、何色にする？', '最后一格，涂什么颜色？', 'What colour for the last one?', '问她', 'Ask her',
      ['shy', '……あんたが きめて。……さいごの いっこは、あんたの いろが いい。', '……你来决定。……最后一格，我想要你选的颜色。', '...You choose. ...I want the last one to be your colour.'],
      ['最後の色、何色をする？', '\"决定涂什么颜色\"用「にする」，不是「をする」。', '\"Decide on\" is にする, not をする.'],
      ['最後の色、何色にした？', '还没涂就问\"涂了什么颜色\"，时态错了。', 'Asking what you DID choose before choosing.']),
     joke('「锂那一格你涂了三次，是有多喜欢红色？」', '"Three coats on the lithium square. You must really like red."', '注意到了', 'You noticed',
      ['pout', '……ちがうよ。……にてなかったから。……ほんとの いろは、もっと きれいだった。', '……不是啦。……是因为不像。……真的颜色更漂亮。', '...No. ...It did not match. ...The real colour was prettier.']),
     act('用彩色铅笔在她本子角上画一个小火焰', 'Draw a tiny flame in the corner of her notebook', '留个记号', 'Leave a mark',
      ['happy', '……かってに かかないで。……けさないけど。', '……别擅自画。……虽然我不会擦掉。', '...Don\'t draw in it without asking. ...I won\'t erase it, though.'])]
  ),
  maki: D(
    ['真希把实验室的灯关了一半，说这样火焰的颜色更\"映える\"。她手机已经架好了，镜头对着酒精灯，录像模式。', 'Maki has switched off half the lights — "the colours pop more" — and set up her phone on the lamp, recording.'],
    ['火焰每变一次颜色，她就配一句音效：「チュイーン！」「ドゥン！」，像在给游戏特效配音。锂的红色出来的时候，她说「レア演出やん」。', 'Each colour change she adds a sound effect — "Chwing!" "Doon!" — like dubbing a game effect. When the lithium goes red: "Rare animation!"'],
    ['最后一撮盐。她说要压轴，让你来撒。', 'The last pinch. She says it is the finale and you should do it.'],
    [say('失敗しても、笑わないでね。', '失败了也别笑我哦。', 'Don\'t laugh if I mess up.', '先打预防针', 'Brace her',
      ['tease', 'それは約束できへんな〜♡　……まあ、動画はちゃんと残したるわ。黒歴史として。', '这个可没法保证哦～♡……嘛，视频我会好好留着的。作为黑历史。', 'Can\'t promise that~ ...Well, I will keep the video. As your dark history.'],
      ['失敗しても、笑わなくでね。', '否定请求是「ないで」：「笑わないで」，没有「なくで」。', 'A negative request is ないで, not なくで.'],
      ['失敗したら、笑ってね。', '\"失败了就笑吧\"，跟你的意思反了。', '\"Laugh if I fail\" — the opposite.']),
     joke('「这段视频，标题叫『前辈的魔法』怎么样？」', '"Title the video \'Senpai\'s Magic\'?"', '给她出主意', 'Suggest a title',
      ['happy', 'ダサっ！　……でも、再生数は取れそうやな。採用。', '好土！……不过播放量应该不错。采用。', 'Lame! ...But it might get views. Approved.']),
     act('趁她录像，伸手在镜头前比了个剪刀手', 'Throw a peace sign in front of her camera', '抢镜', 'Photobomb',
      ['angry', 'ちょ、映り込むなや！　……もう、撮り直しやん。……一緒に映るなら、ちゃんと言うてや。', '喂，别乱入镜头！……真是的，得重拍了。……要一起入镜的话，先说啊。', 'Hey, don\'t photobomb! ...Ugh, now I have to reshoot. ...If you want to be in it, say so.'])]
  )
};
