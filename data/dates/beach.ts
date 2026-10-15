import { D, say, joke, act } from './kit';

// 须磨海滩
export const BEACH = {
  asuka: D(
    ['明日香穿着一件很保守的连帽外套，坐在遮阳伞下面，手里拿着一本参考书。她说她\"監督\"来的，不下水。', 'Asuka sits under a parasol in a very modest hoodie, a study guide in hand. She\'s here to \"supervise\", not to swim.'],
    ['可是一个小时后，你发现她的参考书一页都没翻。她一直在看海，脚尖在沙子里画圈。', 'An hour later you notice she hasn\'t turned a single page. She\'s been watching the sea, toes drawing circles in the sand.'],
    ['你走到她面前，伸出手。她看着你的手，又看了看海。', 'You stand in front of her and hold out a hand. She looks at it, then at the sea.'],
    [say('足だけでも、一緒に入ろう。', '就算只是脚，也一起下去吧。', 'Let\'s go in together — even just our feet.', '给她台阶', 'Give her an easy step',
      ['shy', '……足だけ、よ。……それ以上は、規則違反だから。……手、離さないで。波、怖いから。', '……只有脚哦。……再往前就违反规定了。……手，别松开。浪，有点可怕。', '...Just feet. ...Any further breaks the rules. ...Don\'t let go of my hand. The waves scare me.'],
      ['足だけでも、一緒に入らせよう。', '使役「入らせよう」是\"让（谁）进去吧\"，意思不对。', '入らせよう means \"let\'s make someone go in\".'],
      ['足だけなら、一人で入って。', '\"只是脚的话你自己去\"，她会继续看书。', '\"If it\'s just feet, go alone\" — she\'d go back to her book.']),
     joke('「参考书一页没翻，你是在监督大海吗？」', '"Not a page turned — supervising the sea?"', '戳破', 'Call it out',
      ['angry', 'か、海の監督よ！　……波が規則正しいか、確認してたの。……九割、規則正しかったわ。', '是、是在监督海！……确认浪是不是有规律。……九成是有规律的。', 'S-supervising the sea! ...Checking if the waves were orderly. ...Ninety percent were.']),
     act('在她画的沙圈旁边，画一个一样的', 'Draw a matching circle beside hers in the sand', '陪她画', 'Draw with her',
      ['happy', '……二つの円、ちょっと重なってるわね。……数学的には、共通部分って言うのよ。……私たちみたいに。', '……两个圆，有一点重叠呢。……数学上叫做交集。……就像我们一样。', '...The two circles overlap a little. ...In maths that\'s called an intersection. ...Like us.'])]
  ),
  hikari: D(
    ['光一到海滩就冲进了海里，连鞋都没脱。她站在齐膝的水里，大声喊你的名字，然后被一个浪打得坐在了水里。', 'Hikari charges into the sea the moment you arrive, shoes still on. Knee-deep, she shouts your name — and a wave knocks her onto her bottom.'],
    ['她坐在水里大笑，一点都不在意。你把她拉起来，她顺势往你身上泼了一大捧水，宣布\"水かけ合戦、開始！\"', 'Sitting in the water, she laughs it off. You pull her up and she flings a big splash at you: \"Water fight — begin!\"'],
    ['十分钟后，两个人都湿透了，躺在沙滩上喘气。她转过头，头发上还有沙子。', 'Ten minutes later you\'re both soaked, panting on the sand. She turns her head, sand still in her hair.'],
    [say('光ちゃんと来ると、毎回びしょ濡れになるね。', '跟你来的话，每次都湿透呢。', 'Every time I come with you, I get soaked.', '笑着抱怨', 'Complain, smiling',
      ['happy', 'えへへ、それがうちとのデートやで！　……嫌やった？　……嫌ちゃうやろ。顔に書いてある。', '嘿嘿，这就是跟我约会啊！……讨厌吗？……不讨厌吧。脸上写着呢。', 'Hehe, that\'s what dating me is! ...Did you hate it? ...You didn\'t. It\'s written on your face.'],
      ['光ちゃんと来ると、毎回びしょ濡れをなるね。', '「なる」前面用「に」：「びしょ濡れになる」。', 'なる takes に, not を: びしょ濡れになる.'],
      ['光ちゃんとは、もう来たくないね。', '\"不想再跟你来了\"，太伤人了。', '\"Never coming with you again\" — hurtful.']),
     joke('「你连鞋都没脱就冲进去，回去穿什么？」', '"You ran in with your shoes on — what\'ll you wear home?"', '吐槽', 'Snark',
      ['tease', '……考えてへんかった。……{name}くん、おんぶして帰ってくれる？　……冗談や。半分くらい。', '……没想过。……你背我回去吗？……开玩笑的。一半左右。', '...Didn\'t think of that. ...Will you piggyback me home? ...Kidding. About half.']),
     act('帮她把头发上的沙子拍掉', 'Brush the sand out of her hair', '温柔一下', 'A gentle moment',
      ['shy', '……あ。……{name}くんの手、優しい。……砂、まだついとっても、ええかも。', '……啊。……你的手，好温柔。……沙子，还粘着也没关系吧。', '...Oh. ...Your hands are gentle. ...Maybe I don\'t mind if there\'s still sand.'])]
  ),
  rei: D(
    ['铃带了一把遮阳伞、一瓶防晒、一顶帽子，还有一本关于潮汐的书。她坐在伞下，计算下一次涨潮的时间：\"十四時二十三分です\"。', 'Rei brings a parasol, sunscreen, a hat, and a book on tides. Under the parasol she calculates the next high tide: \"2:23 p.m.\"'],
    ['两点二十三分，浪真的涨上来了，打湿了她伸在伞外的脚尖。她\"あ\"了一声，看着湿了的脚，好像第一次知道海水是凉的。', 'At 2:23 the tide does come in, wetting the toes she\'s stuck out past the parasol. \"Ah.\" She looks at her wet feet as if learning for the first time that the sea is cold.'],
    ['她站起来，往海边走了两步，又回头看你。', 'She stands, takes two steps toward the water, and looks back at you.'],
    [say('計算どおりだったね。一緒に入ってみる？', '跟你算的一样呢。要一起下去吗？', 'Right on schedule. Want to go in together?', '邀请她', 'Invite her',
      ['shy', '……計算どおりなのは、潮だけです。……あなたと海に入るのは、計算外でした。……行きます。', '……跟计算一样的只有潮水。……和你一起下海，是计算之外的。……我去。', '...Only the tide went to plan. ...Going in with you wasn\'t in my calculations. ...I\'ll go.'],
      ['計算どおりだったね。一緒に入られてみる？', '被动「入られて」不通，就用「入って」。', '入られて doesn\'t fit; just 入って.'],
      ['計算違いだったね。もう帰ろう。', '\"算错了，回去吧\"，跟事实不符还扫兴。', '\"You got it wrong, let\'s go home\" — false and deflating.']),
     joke('「你算潮汐算得这么准，是不是把海也当成实验对象了。」', '"Calculating the tide that precisely — is the sea your test subject?"', '吐槽', 'Snark',
      ['tease', '……海は、協力的な被験者です。……あなたより、予測しやすいですから。', '……海是很配合的受试者。……比你好预测多了。', '...The sea is a cooperative subject. ...Far more predictable than you.']),
     act('把她的帽子扶正，帽檐被风吹歪了', 'Straighten her hat — the wind knocked the brim askew', '照顾她', 'Look after her',
      ['happy', '……ありがとうございます。……帽子の角度、今のが最適です。……あなたが直したから。', '……谢谢。……帽子的角度，现在这个最合适。……因为是你扶的。', '...Thank you. ...This angle is optimal. ...Because you set it.'])]
  ),
  inari: D(
    ['稻荷从来没有去过海边。她站在沙滩上，看着一眼望不到头的海，半天没说话，尾巴一动不动。', 'Inari has never been to the seaside. On the sand, facing endless sea, she says nothing for a long time; her tails are utterly still.'],
    ['一个浪冲上来，打湿了她的脚。她吓得跳起来，抓住了你的胳膊，然后又假装若无其事地松开：\"……塩辛い水じゃな\"。', 'A wave rushes up and wets her feet. She jumps and grabs your arm, then lets go as if nothing happened: \"...Salty water, this.\"'],
    ['她蹲下来，捡起一个贝壳，放在耳边听。', 'She crouches, picks up a shell, and holds it to her ear.'],
    [say('何が聞こえますか、稲荷様。', '听见了什么，稻荷大人？', 'What do you hear, Inari-sama?', '好奇', 'Curious',
      ['shy', '……海の神の、声じゃ。……「よう来た」と、言うておる。……そなたの耳にも、当ててやろう。', '……是海神的声音。……说「欢迎来」。……也给你的耳朵听听。', '...The sea god\'s voice. ...It says, \"Welcome.\" ...Here, I\'ll hold it to your ear too.'],
      ['何を聞こえますか、稲荷様。', '「聞こえる」前面的对象用「が」，不用「を」。', 'With 聞こえる the object takes が, not を.'],
      ['何も聞こえませんよね、稲荷様。', '\"什么都听不见吧\"，等于嘲笑她。', '\"You can\'t hear anything, right?\" — mocking.']),
     joke('「刚才被浪吓得抓我胳膊的，是哪位神明？」', '"Which goddess grabbed my arm when the wave came?"', '打趣', 'Tease',
      ['angry', 'つ、掴んでおらぬ！　……そなたが、流されぬように、支えてやったのじゃ。', '我、我没抓！……是我扶着你，免得你被冲走。', 'I-I did not grab! ...I was steadying you so you wouldn\'t be swept away.']),
     act('拉着她的手，往海里走一步', 'Take her hand and step into the water', '带她', 'Lead her',
      ['happy', '……冷たい！　……じゃが、そなたの手は温かい。……もう一歩、行ってみるか。', '……好凉！……不过，你的手是温的。……再往前一步吧。', '...Cold! ...But your hand is warm. ...Shall we try one more step?'])]
  ),
  miyuki: D(
    ['深雪戴着一顶很大的草帽，坐在海边的长椅上，说她\"もう水着を着る年じゃない\"。可是她的脚已经脱了鞋，埋在沙子里了。', 'Miyuki sits on a seaside bench in a big straw hat, insisting she\'s past the age for swimsuits. Her shoes are already off, feet buried in sand.'],
    ['她说她学生时代每年夏天都来这里，跟朋友比赛谁游得远。\"いつも二番だったわ\"，她说，\"一番の子は、今、海外にいるの\"。', 'Every summer in her school days she came here to race friends out to sea. \"I always came second. The winner lives abroad now.\"'],
    ['她看着海平线，好像在看那个朋友。', 'She gazes at the horizon, as if looking at that friend.'],
    [say('今度は、深雪さんが一番になる番ですよ。', '这次，轮到深雪小姐当第一了。', 'This time it\'s your turn to come first.', '给她勇气', 'Encourage her',
      ['shy', '……あら。……じゃあ、あなたが審判してくれる？　……ちょっとだけ、泳いでみようかしら。', '……哎呀。……那你来当裁判？……稍微游一下试试吧。', '...Oh. ...Then will you be the judge? ...Maybe I\'ll swim, just a little.'],
      ['今度は、深雪さんが一番になれる番ですよ。', '「番」前面用动词原形「なる」就够了，「なれる」多余。', '番 takes plain なる; なれる is superfluous.'],
      ['今度も、深雪さんは二番ですよ。', '\"这次也是第二\"，太扫兴。', '\"Second again this time\" — deflating.']),
     joke('「说不穿泳装，脚却已经埋进沙子里了。」', '"No swimsuit, you say — but your feet are buried in sand."', '戳破', 'Call it out',
      ['tease', 'ふふ、バレた。……水着、持ってきてるわよ。カバンの底に。……見たい？', '呵呵，被发现了。……泳装，带来了哦。在包的最底下。……想看？', 'Hehe, caught. ...I did bring a swimsuit. Bottom of my bag. ...Want to see?']),
     act('也把鞋脱了，把脚埋在她旁边', 'Kick off your shoes and bury your feet beside hers', '陪她', 'Join her',
      ['happy', '……ふふ、砂の中で、足、当たってるわよ。……わざと？　……わざとでも、いいけど。', '……呵呵，在沙子里，脚碰到了哦。……故意的？……故意的也没关系。', '...Hehe, our feet are touching under the sand. ...On purpose? ...It\'s fine if it is.'])]
  ),
  sora: D(
    ['空一到海滩就宣布：\"あのブイまで競争な！\"不等你回答，她已经冲进海里了。你追上去的时候，她已经快到了。', 'Sora announces: \"Race you to that buoy!\" Before you answer she\'s in the water. By the time you catch up she\'s nearly there.'],
    ['她在浮标那里等你，一只手扶着浮标，一只手朝你挥。等你游到，她已经喘匀了气，笑着说\"遅いわ、お前\"。', 'At the buoy she waits, one hand on it, waving with the other. When you arrive, breath recovered, she grins: \"Slow, you.\"'],
    ['两个人扶着浮标，漂在海上。岸边的人变得很小。', 'Both clinging to the buoy, you float. The people on shore look tiny.'],
    [say('空が待っててくれるから、ここまで来られたんだよ。', '因为你在等我，我才游到这里的。', 'I made it this far because you waited for me.', '感谢她', 'Thank her',
      ['shy', '……アホ。……待つに決まっとるやろ。……ウチ、お前を置いていったこと、一回もないで。', '……笨蛋。……当然会等啊。……我从来没有丢下过你一次。', '...Idiot. ...Of course I\'d wait. ...I\'ve never once left you behind.'],
      ['空が待っててあげるから、ここまで来られたんだよ。', '「てあげる」是\"我给你\"，对她的帮助要用「てくれる」。', 'てあげる faces outward; her favour to you is てくれる.'],
      ['空が先に行くから、ここまで来たくなかったよ。', '\"因为你先跑了，我才不想来\"，在怨她。', '\"You went ahead so I didn\'t want to come\" — resentful.']),
     joke('「你不等我回答就跑，这叫偷跑吧。」', '"You took off before I answered — that\'s a false start."', '抗议', 'Protest',
      ['tease', 'フライングも作戦のうちや。……次は、お前に先にスタートさせたる。ハンデや。', '偷跑也是战术。……下次，让你先出发。让你一手。', 'False starts are tactics. ...Next time you get a head start. A handicap.']),
     act('趁她不注意，往她脸上泼一点水', 'When she\'s not looking, splash a little water at her face', '小小反击', 'Small revenge',
      ['happy', 'ぶっ！　……やったな！？　……ふふ、ええ度胸や。……ほな、本気出すで！', '噗！……你干了吧！？……呵呵，好胆量。……那我要认真了！', 'Pfft! ...You did NOT! ...Heh, you\'ve got guts. ...Now I\'m going all out!'])]
  ),
  nao: D(
    ['奈绪不会游泳。她穿着一件很大的T恤，坐在沙滩上，用手指在沙子上写字，写了又抹掉，抹掉又写。', 'Nao can\'t swim. In an oversized T-shirt she sits on the sand, writing with her finger, wiping it out, writing again.'],
    ['你走过去，她最后写的那几个字还没来得及抹——\"すき\"。她慌忙用手捂住，一个浪冲上来，把字和她的手一起冲湿了。', 'You walk over before she can erase the last word — \"like\". She covers it in a panic; a wave washes over both the word and her hand.'],
    ['浪退了，沙子上什么都没剩下。她低着头，耳朵很红。', 'The wave recedes. Nothing is left in the sand. Head down, her ears are bright red.'],
    [say('波に消されても、ちゃんと読めたよ。', '就算被浪冲掉了，我也看清了。', 'Even if the wave erased it, I read it.', '让她知道', 'Let her know',
      ['shy', '……！　……よまないでって、いったのに。……でも、よんで、くれたんだ。……へんじは、まだ いい。', '……！……我说了别看的。……不过，你看了啊。……回答，还不用。', '...! ...I said not to read it. ...But you did. ...You don\'t have to answer yet.'],
      ['波に消されても、ちゃんと読ませたよ。', '使役「読ませた」是\"让（别人）读了\"，意思乱了。', '読ませた means \"made someone read\".'],
      ['波に消されたから、何も読めなかったよ。', '\"什么都没看到\"——你在装傻，她会松口气，也会失望。', '\"I couldn\'t read a thing\" — playing dumb; relief and disappointment both.']),
     joke('「你写的是『すき焼き』吧？」', '"You wrote \'sukiyaki\', right?"', '装傻', 'Play dumb',
      ['pout', '……ちがう。……でも、そういうことに しといて。……すきやき、たべたい。', '……不是。……不过，就当是那样吧。……想吃寿喜烧。', '...No. ...But let\'s say it was. ...I want sukiyaki.']),
     act('在她旁边的沙子上，也写下同样的两个字', 'Write the same word in the sand beside her', '用行动回答', 'Answer in kind',
      ['happy', '……あ。……おなじ もじ。……なみが くるまで、みてて いい？', '……啊。……一样的字。……在浪来之前，我可以一直看着吗？', '...Oh. ...The same word. ...Can I look at it until the wave comes?'])]
  ),
  maki: D(
    ['真希躲在遮阳伞下，全身涂满了防晒霜，戴着墨镜，说\"インドア派に太陽はキツい\"。她在用手机玩一个钓鱼游戏。', 'Maki hides under a parasol, slathered in sunscreen, sunglasses on: \"The sun\'s rough on indoor types.\" She\'s playing a fishing game on her phone.'],
    ['你从海里捞上来一个寄居蟹给她看，她摘下墨镜，第一次认真地看着海：\"……リアルの生き物、グラフィックすごいな\"。', 'You bring her a hermit crab from the shallows. She takes off her sunglasses and looks properly at the sea for the first time: \"...Real-life creatures have amazing graphics.\"'],
    ['她站起来，把手机收进包里，说\"……ちょっとだけ、リアルで遊んだろかな\"。', 'She stands and puts her phone away: \"...Maybe I\'ll play in real life for a bit.\"'],
    [say('リアルのほうが、真希と一緒に遊べるからいいよ。', '现实的话，能跟真希一起玩，更好。', 'Real life is better — I get to play with you.', '鼓励她', 'Encourage her',
      ['shy', '……せんぱい、それ、ゲーマーへの最大の殺し文句やで。……しゃあないな、ログアウトしたる。', '……前辈，这句话对玩家来说是最致命的。……没办法，下线了。', '...Senpai, that\'s the ultimate line on a gamer. ...Fine. Logging out.'],
      ['リアルのほうが、真希と一緒に遊ばれるからいいよ。', '被动「遊ばれる」意思变成\"被玩弄\"。', '遊ばれる means \"be toyed with\".'],
      ['ゲームのほうが、真希には似合ってるよ。', '\"你还是适合玩游戏\"，把她推回伞下了。', '\"Games suit you better\" — pushes her back under the parasol.']),
     joke('「涂这么厚的防晒，你是要去打Boss吗。」', '"That much sunscreen — gearing up for a boss fight?"', '吐槽', 'Snark',
      ['tease', 'そうや、ラスボス「太陽」や。……装備は万全。あとは、回復役がおれば完璧やな。……せんぱい、ヒーラーな。', '对，最终Boss「太阳」。……装备万全。再有个回复担当就完美了。……前辈当治疗。', 'Right, the final boss: the Sun. ...Fully equipped. Just need a healer. ...Senpai, you\'re the healer.']),
     act('把寄居蟹放在她手心里', 'Set the hermit crab in her palm', '让她亲手感受', 'Let her feel it',
      ['happy', 'うわ、動いた！　……くすぐったい……！　……な、名前つけよ。せんぱいの名前な。', '哇，动了！……好痒……！……给、给它起个名字。就叫前辈的名字。', 'Whoa, it moved! ...Tickles...! ...L-let\'s name it. After you.'])]
  )
};
