import { D, say, joke, act } from './kit';

// 三宫的游戏厅（抓娃娃机）
export const ARCADE = {
  asuka: D(
    ['明日香站在抓娃娃机前，双手抱胸，盯着里面的海豹看了足足一分钟。她说她不是在玩，是在\"分析这台机器的爪力设定\"。', 'Asuka stands in front of the claw machine, arms folded, studying the seals for a full minute. She is not playing, she says; she is \"analysing the claw strength settings.\"'],
    ['她投了一百日元，操作得非常精准，爪子正好落在海豹头上——然后松开了。她的表情从专注变成了愤怒，速度快得像翻书。', 'She puts in a hundred yen and operates with precision. The claw lands right on a seal\'s head — and lets go. Her face goes from focus to fury as fast as turning a page.'],
    ['她握着最后一枚硬币，转头看你。', 'She holds her last coin and turns to you.'],
    [say('二人でやれば、取れるかも。', '两个人一起的话，说不定能抓到。', 'If we do it together, we might get it.', '提议合作', 'Suggest teamwork',
      ['shy', '……あんたが横から見て、私が操作する。……指示、ちゃんと出しなさいよ。', '……你在侧面看，我来操作。……给我好好发指令。', '...You watch from the side, I operate. ...Give clear instructions.'],
      ['二人でやれば、取れるかもしれないだ。', '「かもしれない」后面不加「だ」。', 'かもしれない takes no だ.'],
      ['二人でやれば、取られるかも。', '被动「取られる」是\"被拿走\"，意思错了。', '取られる is passive — \"get taken\".']),
     joke('「班长，这台机器违反校规吗？」', '"Class rep, does this machine break school rules?"', '逗她', 'Tease her',
      ['angry', '校則じゃなくて、景品表示法よ！　……たぶん。……もう、あと一回だけやるわ！', '不是校规，是赠品标示法！……大概。……真是的，再玩最后一次！', 'Not school rules — consumer law! ...Probably. ...Ugh, one more try!']),
     act('站到机器侧面，帮她看爪子的位置', 'Stand at the side of the machine to judge the claw\'s depth for her', '默默配合', 'Quietly help',
      ['happy', '……右、もうちょっと。……今！　……取れた！？　取れたわ！　……べ、別に嬉しくないけど！', '……右边，再一点。……就是现在！……抓到了！？抓到了！……我、我才不高兴！', '...Right, a bit more. ...Now! ...Got it?! We got it! ...N-not that I\'m happy!'])]
  ),
  hikari: D(
    ['光已经在太鼓达人前面了，鼓槌在手里转得像两根指挥棒。她说「一曲だけ！」，打完一曲又说「もう一曲だけ！」，第三曲的时候她已经忘了你还没开始玩。', 'Hikari is already at the taiko machine, spinning the drumsticks like batons. "Just one song!" Then, "Just one more!" By the third she has forgotten you have not had a turn.'],
    ['她打到全连的时候整个人蹦了起来，拉着你的手跳，像赢了什么大比赛。屏幕上的分数是她这辈子第二高。', 'When she gets a full combo she jumps up and pulls you along by the hands like she has won a championship. It is her second-best score ever.'],
    ['她把一副鼓槌塞到你手里。', 'She pushes a pair of drumsticks into your hands.'],
    [say('一緒に叩こう。下手だけど。', '一起敲吧。虽然我很烂。', 'Let\'s play together. I\'m bad, though.', '加入她', 'Join her',
      ['happy', 'ええねん、うまさとか！　大事なんは、楽しいかどうかや！　いくで、ドン！', '没关系，技术什么的！重要的是开不开心！来，咚！', 'Skill doesn\'t matter! What matters is if it\'s fun! Here we go — don!'],
      ['一緒に叩こう。下手けど。', '名词/な形容词接「けど」前要有「だ」：「下手だけど」。', 'A na-adjective needs だ before けど.'],
      ['一緒に叩かれよう。下手だけど。', '被动「叩かれよう」变成\"一起挨打吧\"。', '叩かれよう is passive — \"let\'s get hit together\".']),
     joke('「你说『只玩一曲』说了三次了。」', '"You have said \'just one song\' three times."', '揭穿她', 'Call it',
      ['tease', 'えへへ……数えてたん？　……ほな、次は{name}くんの番な！　ほんまに！', '嘿嘿……你数了吗？……那下一首轮到你！真的！', 'Hehe... you counted? ...Then next one is yours! Really!']),
     act('在她旁边接着敲另一面鼓', 'Start drumming on the other side next to her', '直接加入', 'Just jump in',
      ['happy', 'わっ、ずれてる！　ずれてるけど、なんか楽しい！　あはは！', '哇，节奏错开了！错开了，可是好开心！啊哈哈！', 'Whoa, we\'re off-beat! Off-beat, but it\'s fun! Ahaha!'])]
  ),
  rei: D(
    ['铃站在抓娃娃机前，手里拿着笔记本，在记录爪子每次下落的时间和深度。旁边有个小孩盯着她看，她对小孩点了点头，继续记。', 'Rei is at the claw machine with a notebook, recording how long and how deep the claw drops each time. A small child stares at her; she nods to the child and keeps writing.'],
    ['她说根据二十次观察，这台机器的爪力在第\"整数倍\"次投币时会变强。她说这只是假说。然后她的眼睛亮了一下。', 'After twenty observations, she says, the claw strengthens on certain multiples of plays. It is only a hypothesis. Then her eyes light up.'],
    ['她算了一下，说下一枚硬币，就是那个\"倍数\"。', 'She calculates: the next coin is the multiple.'],
    [say('仮説が正しいか、確かめよう。', '去验证一下假说对不对吧。', 'Let\'s test whether your hypothesis is right.', '支持她的实验', 'Back her experiment',
      ['happy', '……はい。……もし成功したら、景品は共同研究の成果として、半分ずつです。', '……好。……如果成功了，奖品作为共同研究成果，一人一半。', '...Yes. ...If it works, the prize is a joint research result. Half each.'],
      ['仮説が正しいか、確かめろう。', '「確かめる」的意志形是「確かめよう」。', 'The volitional of 確かめる is 確かめよう.'],
      ['仮説が正しいか、確かめないよう。', '「確かめないよう」意思不清，像是\"为了不去验证\"。', '確かめないよう is garbled — \"so as not to check\".']),
     joke('「一个海豹怎么分一半？」', '"How do you split one seal in half?"', '较真', 'Be pedantic',
      ['tease', '……時間で分割します。月・水・金は私が、火・木・土はあなたが保管します。日曜は、共有です。', '……按时间分。周一三五我保管，周二四六你保管。周日，共有。', '...We divide by time. I keep it Mon, Wed, Fri; you keep it Tue, Thu, Sat. Sunday is shared.']),
     act('把那个盯着她的小孩也叫过来一起看', 'Invite the staring child over to watch too', '多一个观测者', 'One more observer',
      ['surprised', '……観測者が、三名になりました。……結果を見届けてもらいましょう。', '……观测者变成三名了。……让他也见证结果吧。', '...Three observers now. ...Let him witness the result.'])]
  ),
  inari: D(
    ['稻荷对游戏厅的声音很不满。她用两只手捂着头顶——狐耳藏在那里——说「なんじゃこの騒がしい社は」。她把这里当成了一座神社。', 'Inari is unhappy with the noise. She covers the top of her head with both hands — where her ears hide — and says, "What is this raucous shrine?" She has taken the arcade for a shrine.'],
    ['抓娃娃机里的海豹，她看了一会儿，说它们是\"被封印的小妖\"，然后郑重地对着玻璃拜了一拜。', 'She studies the seals in the claw machine, declares them \"sealed little spirits,\" and bows solemnly to the glass.'],
    ['她说要把它们\"解放\"出来，向你伸出手：要硬币。', 'She says she will \"free\" them and holds out her hand: a coin.'],
    [say('神様の力、使っちゃだめですよ。', '不可以用神力哦。', 'No using divine powers.', '先说规矩', 'Set the rule',
      ['pout', '……ちっ。……よかろう、人の子の作法でやってやる。……見ておれ、千年の勘を。', '……啧。……好吧，就按人类的规矩来。……看好了，我千年的直觉。', '...Tch. ...Very well, by human rules. ...Watch a thousand years of instinct.'],
      ['神様の力、使っちゃだめだですよ。', '「だめ」后面直接接「です」，不要「だ」。', 'だめ takes です directly, no だ.'],
      ['神様の力、使わなきゃだめですよ。', '\"必须用神力\"，规矩说反了。', '\"You MUST use divine power\" — reversed.']),
     joke('「被封印的小妖，你认识吗？」', '"Do you know these sealed spirits personally?"', '逗她', 'Tease her',
      ['tease', '知らぬ。……されど、一匹だけ、そなたに似た顔のがおるな。あれを取ろう。', '不认识。……不过，有一只长得像你。就抓那只。', 'I do not. ...But one has a face like yours. That is the one.']),
     act('递给她一枚硬币，替她捂住一只耳朵挡噪音', 'Give her a coin and cover one of her ears against the noise', '游戏厅太吵', 'It\'s too loud',
      ['shy', '……！　……耳を、覆ってくれるのか。……静かになった。……そなたの手の音しか、せぬ。', '……！……替我捂住耳朵吗。……安静了。……只听得见你手的声音。', '...! ...Covering my ear? ...It is quiet now. ...I hear only your hand.'])]
  ),
  miyuki: D(
    ['深雪站在游戏厅门口，被那面声音的墙挡住了一下，然后鼓起勇气走进来，说「すごいわね、若い人の場所って」。她在这里显得像一个走错门的老师。', 'Miyuki pauses at the door against the wall of sound, then bravely walks in: "Goodness, young people\'s places." She looks like a teacher who took the wrong door.'],
    ['她在推币机前停了下来，说这个她小时候玩过。她投了一枚，看着它慢慢滑下去，脸上的表情一点一点放松，变得很年轻。', 'She stops at a coin pusher: she played these as a child. She drops one in, watches it slide down, and her face relaxes little by little, growing young.'],
    ['推币机的边缘挂着一大堆硬币，就差一点。', 'A pile of coins teeters at the pusher\'s edge, just about to fall.'],
    [say('次の一枚で、落ちますよ。', '下一枚就会掉下来了。', 'The next coin will knock them down.', '鼓励她', 'Encourage her',
      ['happy', 'ほんと？　……じゃあ、あなたが入れて。……私、こういうの、いつもあと一枚で終わっちゃうの。', '真的？……那你来投。……我这种东西，总是差一枚就结束了。', 'Really? ...Then you put it in. ...I always run out one coin short.'],
      ['次の一枚で、落とされますよ。', '被动「落とされる」听起来像\"会被（人）推下去\"，用自动词「落ちる」。', '落とされる is passive; use 落ちる.'],
      ['次の一枚で、落ちませんよ。', '\"下一枚不会掉\"，打击她。', '\"The next one won\'t do it\" — discouraging.']),
     joke('「深雪小姐小时候，是推币机高手？」', '"Were you a coin-pusher champion as a kid?"', '好奇', 'Curious',
      ['tease', 'ふふ、高手じゃなくて、常連。……お小遣い、全部ここに吸い込まれてたのよ。', '呵呵，不是高手，是常客。……零花钱，全被这里吸走了。', 'Hehe, not a champion — a regular. ...All my pocket money vanished in here.']),
     act('投下最后一枚，硬币哗啦啦掉下来，把杯子递给她', 'Drop in the coin; when the pile crashes down, hand her the cup', '让她拿着', 'Let her hold it',
      ['happy', 'わあ……！　……ふふ、子どもみたいに、うれしい。……ありがとう。', '哇……！……呵呵，像小孩子一样开心。……谢谢。', 'Oh...! ...Hehe, I\'m as happy as a child. ...Thank you.'])]
  ),
  sora: D(
    ['空直接走向游戏厅最里面的投篮机，投了币，四十秒投了五十二个。周围几个大学生停下来看，她连头都没回。', 'Sora walks straight to the basketball machine at the back, puts in a coin and sinks fifty-two in forty seconds. A few college students stop to watch; she does not even turn round.'],
    ['机器上的最高分记录名字栏里，前三名都写着「SORA」。她说这台机器是她的\"第二の体育館\"。', 'The top three high-score names on the machine all read SORA. She calls it her \"second gym.\"'],
    ['她让开位置，往旁边一站：「お前の番」。', 'She steps aside: "Your turn."'],
    [say('記録、破ってもいい？', '我可以打破你的记录吗？', 'Mind if I break your record?', '放话', 'Talk big',
      ['tease', '……ほう。言うやん。破れたら、なんでも一個言うこと聞いたるわ。', '……哦。挺敢说嘛。打破了的话，我答应你一件事。', '...Oh. Big talk. Break it and I\'ll do one thing you ask.'],
      ['記録、破れてもいい？', '自动词「破れる」是\"（自己）破掉\"；打破记录用他动词「破る」。', '破れる is intransitive; breaking a record is 破る.'],
      ['記録、守ってもいい？', '\"可以守住你的记录吗\"，莫名其妙。', '\"May I protect your record?\" — odd.']),
     joke('「你的名字占了前三，第四名留给我吧。」', '"You own the top three. Save fourth place for me."', '谦虚一点', 'Aim low',
      ['happy', '四位か。……ええで。お前の名前、ウチの下に並ぶの、悪くないわ。', '第四名吗。……行啊。你的名字排在我下面，也不坏。', 'Fourth? ...Fine. Your name under mine — not bad.']),
     act('先去自动贩卖机买两瓶水，再回来投', 'Buy two waters from the vending machine first, then come back to shoot', '照顾她', 'Look after her',
      ['shy', '……気ぃ利くやん。……喉、乾いてたの、なんでわかったん。', '……挺机灵嘛。……你怎么知道我渴了。', '...Thoughtful. ...How did you know I was thirsty.'])]
  ),
  nao: D(
    ['奈绪站在大头贴机前，看着帘子后面的灯，犹豫了很久。她说她从来没拍过，因为\"一人で撮るのは、さびしい\"。', 'Nao hesitates in front of the photo booth, looking at the lights behind the curtain. She has never used one, she says — \"taking them alone is lonely.\"'],
    ['她站在帘子边上，不进去，也不走。手里攥着两枚硬币，攥得很紧，像是早就准备好了。', 'She stands at the curtain, neither going in nor leaving, two coins clenched tight — prepared long ago.'],
    ['她看了你一眼，又看了帘子一眼。', 'She glances at you, then at the curtain.'],
    [say('一緒に撮ろう。', '一起拍吧。', 'Let\'s take one together.', '替她说出来', 'Say it for her',
      ['shy', '……うん。……へんな かお しないでね。……わたしも、しないから。', '……嗯。……不要做怪表情哦。……我也不做。', '...Okay. ...No weird faces. ...I won\'t either.'],
      ['一緒に撮られよう。', '被动「撮られよう」是\"一起被拍吧\"，语气很怪。', '撮られよう is passive — \"let\'s get photographed\".'],
      ['一緒に撮ったよ。', '\"已经一起拍了\"，时态错了。', '\"We already took it\" — wrong tense.']),
     joke('「十年都没拍过，是在等我吗？」', '"Ten years without one — were you waiting for me?"', '有点过分', 'A bit much',
      ['pout', '……ちがう。……たまたま。……たまたま、十年。', '……不是。……碰巧。……碰巧，十年。', '...No. ...Coincidence. ...Coincidentally, ten years.']),
     act('掀开帘子，示意她先进', 'Lift the curtain and gesture for her to go first', '让她先', 'Ladies first',
      ['happy', '……ありがと。……ちいさいね、なか。……ちかいね。', '……谢谢。……里面好小。……好近呢。', '...Thanks. ...It\'s small in here. ...Close.'])]
  ),
  maki: D(
    ['真希不在抓娃娃机那边。她在音游区，耳机挂在脖子上，手指在机台上敲得飞快，屏幕上的判定一连串的\"PERFECT\"。你站在后面看，她头也不回地说「せんぱい、気配でわかるで」。', 'Maki is not at the claw machines. She is in the rhythm-game corner, headphones round her neck, fingers flying, a string of PERFECTs on the screen. You watch from behind. Without turning: "Senpai, I can sense you."'],
    ['一曲打完，全连。她转过身，在你面前比了个V：「見た？　これがウチの本気」。周围的人在拍手，她装作没听见，耳朵却红了。', 'Full combo. She turns and flashes a V at you: "See? That\'s me serious." People around her clap; she pretends not to hear, but her ears go red.'],
    ['她把旁边机台的位置让给你：「対戦な」。', 'She gives you the machine beside hers: "Versus."'],
    [say('手加減してくれる？', '能手下留情吗？', 'Will you go easy on me?', '先讨饶', 'Beg first',
      ['tease', 'するわけないやろ、ざぁこ♡　……でも、難易度は「かんたん」選んでええで。ウチは「鬼」な。', '怎么可能，杂鱼♡……不过，你可以选「简单」难度。我选「魔鬼」。', 'As if, loser. ...But you can pick Easy. I\'ll pick Oni.'],
      ['手加減してあげる？', '「してあげる」是\"我对你手下留情\"，授受反了。', 'してあげる means you would go easy on her.'],
      ['手加減しないでくれる？', '\"能别手下留情吗\"，跟讨饶相反。', '\"Will you NOT go easy\" — the opposite.']),
     joke('「刚才大家在拍手，你耳朵红了。」', '"Everyone was clapping and your ears went red."', '戳破', 'Point it out',
      ['angry', '赤ないわ！　……照明や照明！　……もう、対戦始めるで！　覚悟しいや！', '才没红！……是灯光、灯光！……好了，开始对战！做好觉悟！', 'They\'re not red! ...It\'s the lights! ...Starting the match! Brace yourself!']),
     act('把她挂在脖子上的耳机替她戴好', 'Settle her headphones properly over her ears', '让她专心', 'Let her focus',
      ['shy', '……お、おう。……せんぱいの手、ちょっと冷たいな。……集中できへんやん。', '……哦、嗯。……前辈的手，有点凉。……这样没法集中啊。', '...O-okay. ...Your hands are a bit cold, senpai. ...Now I can\'t focus.'])]
  )
};
