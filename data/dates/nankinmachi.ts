import { D, say, joke, act } from './kit';

// 南京町边走边吃（老祥记的猪肉包、小笼包）
export const NANKINMACHI = {
  asuka: D(
    ['明日香在老祥记的队伍里，手里攥着一张写好的清单：猪肉包四个、小笼包一笼、芝麻球两个，每一项后面标着预算。她说边走边吃\"计划性\"很重要。', 'Asuka is in the Roshoki queue holding a written list: four pork buns, one basket of xiaolongbao, two sesame balls, a budget beside each. Eating on the move, she says, requires \"planning.\"'],
    ['猪肉包太烫，她两只手来回倒着，表情很严肃，像在处理什么危险品。吃完一个，她在清单上划掉一行。', 'The pork bun is scalding; she juggles it hand to hand with a grave face, as if handling something hazardous. Finished, she crosses a line off the list.'],
    ['小笼包的摊子前，她看着招牌上的\"汤汁很烫\"，犹豫了。', 'At the xiaolongbao stall she reads \"Hot soup inside!\" and hesitates.'],
    [say('中国では、こうやって食べるんだよ。', '在中国，是这样吃的。', 'In China, this is how you eat them.', '教她吃法', 'Show her how',
      ['surprised', '……本場の食べ方？　……ちょ、ちょっと、ゆっくり見せなさいよ。メモするから。', '……正宗的吃法？……慢、慢一点示范。我要记下来。', '...The authentic way? ...Sh-show me slowly. I\'m taking notes.'],
      ['中国では、こうやって食べられるんだよ。', '被动/可能「食べられる」听起来像\"被吃掉\"或\"能吃\"，说吃法用「食べる」。', '食べられる sounds passive or potential; use 食べる.'],
      ['中国では、こうやって食べないんだよ。', '\"在中国不这样吃\"，你在示范反例。', '\"In China you DON\'T eat it like this\" — a counter-example.']),
     joke('「清单上没有『跟我一起吃』这一项。」', '"Your list doesn\'t have \'eat with me\' on it."', '逗她', 'Tease',
      ['shy', '……書いてないわよ。……書かなくても、するんだから。', '……没写。……就算不写，也会做的。', '...It\'s not written. ...I\'ll do it whether it\'s written or not.']),
     act('先咬开一个小口，吹凉了递给她', 'Bite a small hole, blow it cool and pass it to her', '替她试温度', 'Test it for her',
      ['shy', '……ちょ、あんたがかじったやつじゃない。……もう、いいわよ。食べるわよ。', '……等等，这是你咬过的。……算了，好吧。我吃。', '...Hey, you bit that. ...Fine, whatever. I\'ll eat it.'])]
  ),
  hikari: D(
    ['光在南京町简直如鱼得水，每个摊子都要停一下，跟每个老板都聊两句。你跟在后面，手里不知不觉多了三袋她买的、说\"等一下一起吃\"的东西。', 'Hikari is in her element in Nankinmachi, stopping at every stall, chatting with every vendor. Somehow you end up carrying three bags of things she bought \"to share later.\"'],
    ['她把一个猪肉包掰成两半，大的一半塞到你嘴边，说「あーん」。说完她自己先脸红了。', 'She tears a pork bun in two and holds the bigger half to your mouth: \"Say ahh.\" Then she goes red first.'],
    ['她举着一根芝麻球，看着你。', 'She holds up a sesame ball, looking at you.'],
    [say('中国語で、ありがとうって言ってみて。', '用中文说一句谢谢试试。', 'Try saying thank you in Chinese.', '教她一句中文', 'Teach her some Chinese',
      ['happy', 'しぇ、しぇしぇ？　……あってる！？　やった！　おじさんにも言うてくる！', '谢、谢谢？……对吗！？太好了！我也去跟老板说！', 'Xie... xie xie? ...Right?! Yes! I\'m going to say it to the vendor too!'],
      ['中国語で、ありがとうって言わせてみて。', '使役「言わせて」是\"让（别人）说\"，主语乱了。', '言わせて means \"make someone say it\".'],
      ['中国語で、ありがとうって言わないで。', '\"别用中文说谢谢\"，跟你的意思相反。', '\"Don\'t say thanks in Chinese\" — the opposite.']),
     joke('「你买的这些，算是『一起吃』还是『我帮你拿』？」', '"Are these for \'sharing\' or for me to carry?"', '吐槽', 'Snark',
      ['tease', 'りょうほう！　……ちゃう、ぜんぶ いっしょに食べるやつ！　持つのは、そのついで！', '都是！……不对，全都是一起吃的！拿着只是顺便！', 'Both! ...No, all for sharing! Carrying is just a bonus!']),
     act('接住她递过来的那半个包子，一口吃掉', 'Take the half bun she offered and eat it in one bite', '不说话，吃', 'Just eat',
      ['shy', 'た、食べた……！　ほんまに、あーん、で……！　……おいしい？', '吃、吃了……！真的是喂的……！……好吃吗？', 'Y-you ate it...! From my hand...! ...Is it good?'])]
  ),
  rei: D(
    ['铃站在南京町的牌楼下面，正在读牌楼上的字，一个字一个字地念，然后问你哪个字在中文里读法不一样。她拿出本子，准备记。', 'Rei stands under the gate reading its characters one by one, then asks which ones are read differently in Chinese. Notebook out, ready.'],
    ['你教她「包子」的中文发音。她重复了四次，每次都比上一次准一点，第四次的时候，老板在后面笑着说「上手やね」。', 'You teach her the Chinese for \"baozi.\" She repeats it four times, each closer; on the fourth the vendor laughs: \"You\'re good!\"'],
    ['她把本子递给你，空着一行：「中国語、もう一つ」。', 'She hands you the notebook with one blank line: \"One more Chinese word.\"'],
    [say('「好吃」って言葉、覚えて。', '记住「好吃」这个词吧。', 'Learn the word for \"delicious\".', '教她一个词', 'Teach a word',
      ['happy', '……ハオチー。……意味と、使用場面を、記録しました。……今、使います。ハオチー。', '……好吃。……意思和使用场景，记下了。……现在就用。好吃。', '...Haochi. ...Meaning and usage recorded. ...Using it now. Haochi.'],
      ['「好吃」って言葉、覚えさせて。', '使役「覚えさせて」是\"让我记住\"，方向反了。', '覚えさせて means \"let me learn it\" — reversed.'],
      ['「好吃」って言葉、忘れて。', '\"忘掉吧\"，跟教她相反。', '\"Forget it\" — the opposite.']),
     joke('「你的发音，比我的日语还准。」', '"Your pronunciation beats my Japanese."', '自嘲', 'Self-deprecate',
      ['tease', '……比較対象として、適切ではありません。……あなたの日本語も、四月より、ずっと正確です。', '……作为比较对象，不太合适。……你的日语，也比四月的时候准确多了。', '...Not a fair comparison. ...Your Japanese is far more accurate than in April.']),
     act('在她本子上用中文写下「铃」字', 'Write her name in Chinese characters in her notebook', '送她一个字', 'Give her a character',
      ['shy', '……私の名前、ですね。……中国語の筆跡は、初めて見ました。……保存します。', '……是我的名字吧。……第一次见到中文的笔迹。……我会保存。', '...My name. ...The first time I\'ve seen it in Chinese handwriting. ...I\'ll keep it.'])]
  ),
  inari: D(
    ['稻荷在南京町很安静。她看着牌楼和红灯笼，说一百五十年前这里刚有华人来的时候，她也来看过。那时候灯笼还是纸糊的。', 'Inari is quiet in Nankinmachi. Looking at the gate and lanterns, she says that when the first Chinese came here a hundred and fifty years ago, she came to see. The lanterns were paper then.'],
    ['她买了一个猪肉包，小口小口地吃，吃得很慢。她说味道没变——不对，变了一点。人换了，手艺传下来了。', 'She buys a pork bun and eats it in tiny bites, slowly. The taste hasn\'t changed — no, it has a little. The people changed; the craft was handed down.'],
    ['她看着你，问你家乡的包子是什么味道。', 'She asks what buns taste like where you come from.'],
    [say('今度、作ってあげます。', '下次我做给你吃。', 'I\'ll make you some next time.', '许个约', 'Make a promise',
      ['shy', '……人の子が、神に料理を、か。……よかろう。待っておる。千年でも、待てるからの。', '……人类的孩子，给神做饭吗。……好啊。我等着。一千年我也等得起。', '...A human cooking for a god. ...Very well. I shall wait. I can wait a thousand years.'],
      ['今度、作ってもらいます。', '「作ってもらう」是\"请（她）做给我\"，授受反了。', '作ってもらう means asking her to make them.'],
      ['前回、作ってあげます。', '「前回」是\"上次\"，许诺不了过去。', '前回 is last time — can\'t promise the past.']),
     joke('「一百五十年前的包子，多少钱？」', '"How much was a bun a hundred and fifty years ago?"', '问价', 'Ask the price',
      ['happy', '銭で買うた。……覚えておらぬ。されど、今より、ずっと大きかったぞ。', '用铜钱买的。……不记得了。不过，比现在大多了。', 'Bought with copper coins. ...I don\'t recall the price. But it was much bigger than now.']),
     act('陪她站在牌楼下，看灯笼被风吹', 'Stand with her under the gate watching the lanterns sway', '陪她回忆', 'Keep her company',
      ['happy', '……そなたと見ると、百五十年前と同じ灯に見えるのう。……不思議じゃ。', '……跟你一起看，就像一百五十年前的灯一样。……真奇妙。', '...With you, they look like the lanterns of a hundred and fifty years ago. ...Strange.'])]
  ),
  miyuki: D(
    ['深雪在南京町是来买菜的——买八角、花椒和一种你都叫不出名字的干货。她说她在学做中国菜，为了你。说完她补了一句「……練習よ、練習」。', 'Miyuki is in Nankinmachi to shop — star anise, Sichuan pepper and a dried something you can\'t name. She\'s learning Chinese cooking, for you. Then: \"...Practice. Just practice.\"'],
    ['她拿起一包干货问你这是什么、怎么用。你说了做法，她拿出手机记下来，记得很认真，连\"少许\"都问了是多少。', 'She asks what a packet is and how to use it. You explain; she types notes earnestly, even asking how much \"a pinch\" is.'],
    ['她的购物篮满了，看着你。', 'Her basket is full. She looks at you.'],
    [say('今夜、一緒に作りませんか。', '今晚，一起做吧？', 'Shall we cook it together tonight?', '邀请她', 'Invite her',
      ['happy', 'あら……いいの？　……じゃあ、先生はあなたね。お姉さん、生徒になるわ。', '哎呀……可以吗？……那老师就是你了。姐姐当学生。', 'Oh... really? ...Then you\'re the teacher. Big sister will be the student.'],
      ['今夜、一緒に作られませんか。', '被动「作られませんか」是\"不被做吗\"，邀请不成立。', '作られませんか is passive — the invitation breaks.'],
      ['昨夜、一緒に作りませんか。', '「昨夜」是\"昨晚\"，邀请不了过去。', '昨夜 is last night.']),
     joke('「练习做中国菜，是练给谁吃的？」', '"Practising Chinese food — for whom?"', '追问', 'Push her',
      ['tease', 'ふふ、さあ、誰かしら。……毎晩、隣の部屋から、いい匂いがする人よ。', '呵呵，是谁呢。……是每天晚上，会从隔壁闻到香味的那个人。', 'Hehe, who could it be. ...The person next door who smells my cooking every night.']),
     act('接过她的购物篮拎着', 'Take her shopping basket to carry', '很重', 'It\'s heavy',
      ['shy', '……ありがとう。……こうして並んで歩くと、なんだか、夫婦みたいね。……なんてね。', '……谢谢。……这样并排走，总觉得像夫妻呢。……开玩笑的。', '...Thank you. ...Walking side by side like this, we\'re like a married couple. ...Just kidding.'])]
  ),
  sora: D(
    ['空在南京町的目标只有一个：吃。她已经吃完两个猪肉包，正在排第三家。她说比赛前要\"炭水化物を詰めとく\"——明天没有比赛。', 'Sora has one goal in Nankinmachi: eat. Two pork buns down, she\'s in her third queue. \"Carb-loading before a match\" — there\'s no match tomorrow.'],
    ['她咬了一口小笼包，汤溅出来烫到了下巴，她「あっつ！」了一声，然后又咬了一口，一样烫，一样「あっつ！」。', 'She bites a xiaolongbao, soup squirts and burns her chin — \"Hot!\" — then bites again, same burn, same \"Hot!\"'],
    ['她举起最后一个小笼包，看着你：「勝負や。どっちが熱いの我慢できるか」。', 'She holds up the last one: \"Contest. Who can take the heat.\"'],
    [say('やけどするから、やめよう。', '会烫伤的，算了吧。', 'You\'ll burn yourself — let\'s not.', '劝她', 'Talk her down',
      ['pout', '……ちぇ。……わかったわ。お前が言うなら、冷ましてから食う。', '……切。……知道了。既然你这么说，我放凉了再吃。', '...Tch. ...Fine. If you say so, I\'ll let it cool.'],
      ['やけどされるから、やめよう。', '被动「やけどされる」不成立，\"会烫伤\"用「やけどする」。', 'やけどされる is not a thing; use やけどする.'],
      ['やけどしないから、やろう。', '\"不会烫伤，比吧\"，你在火上浇油。', '\"You won\'t burn, let\'s do it\" — egging her on.']),
     joke('「明天没有比赛吧？」', '"There\'s no match tomorrow, is there?"', '戳穿', 'Call it',
      ['angry', 'う、うるさい！　……毎日が試合なんや、ウチにとっては！　……もう一個食お。', '少、少啰嗦！……对我来说，每天都是比赛！……再吃一个。', 'Sh-shut up! ...Every day\'s a match for me! ...One more.']),
     act('拿纸巾替她擦掉下巴上的汤汁', 'Wipe the soup off her chin with a napkin', '她烫到了', 'She burned herself',
      ['shy', '……っ。……子どもちゃうねんから。……でも、サンキュ。', '……！……我又不是小孩。……不过，谢了。', '...! ...I\'m not a kid. ...But thanks.'])]
  ),
  nao: D(
    ['奈绪在南京町有点紧张，人太多了，她一直走在你身后半步，拉着你的书包带子。她说「はぐれたら、こまる」。', 'Nao is a bit nervous in the crowd, walking half a step behind you, holding your bag strap. \"If we get separated, that\'s bad.\"'],
    ['她买了一个猪肉包，咬了一口，眼睛亮了一下，然后把剩下的一半递给你，说「おいしい。あんたも」。', 'She buys a pork bun, takes a bite, her eyes light up, and she hands you the other half. \"Good. You too.\"'],
    ['人潮又涌过来了。她拉着你书包带的手紧了一下。', 'The crowd surges again. Her grip on your strap tightens.'],
    [say('はぐれないように、手、つなごう。', '为了别走散，牵着手吧。', 'Let\'s hold hands so we don\'t get separated.', '把她的手牵过来', 'Take her hand',
      ['shy', '……うん。……かばんより、こっちの ほうが いい。……ずっと。', '……嗯。……比起书包带，这个更好。……一直都是。', '...Okay. ...This is better than the bag strap. ...Always has been.'],
      ['はぐれないように、手、つながろう。', '「つながる」是自动词，牵手要用他动词「つなぐ」→「つなごう」。', 'つながる is intransitive; holding hands is つなぐ → つなごう.'],
      ['はぐれるように、手、つなごう。', '「はぐれるように」是\"为了走散\"，目的反了。', 'はぐれるように means \"so that we get separated\".']),
     joke('「你拉着书包带，像小时候拉着我的衣角。」', '"Holding my bag strap, like you held my sleeve as a kid."', '翻旧账', 'Bring up the past',
      ['pout', '……いまも こどもって いいたいの。……いいよ、こどもで。はぐれなければ。', '……你是想说我现在也是小孩吗。……好啊，当小孩就当小孩。只要不走散。', '...You mean I\'m still a kid. ...Fine, I\'ll be a kid. As long as we don\'t get separated.']),
     act('放慢脚步，让她走到你身边来', 'Slow down so she can walk beside you', '不让她落后', 'Don\'t leave her behind',
      ['happy', '……となり、あいた。……となり なら、はぐれないね。', '……旁边空出来了。……在旁边的话，就不会走散了呢。', '...There\'s room beside you. ...Beside you, we won\'t get separated.'])]
  ),
  maki: D(
    ['真希在南京町的目标是拍照：红灯笼、蒸笼的白气、熊猫形状的包子，每一样都要拍。她说「映えの宝庫やん」，然后让你站在灯笼底下，说要拍\"せんぱいの間抜け顔\"。', 'Maki is here for photos: lanterns, steam, panda-shaped buns. \"A treasure trove of aesthetic.\" Then she poses you under the lanterns to shoot \"senpai\'s dopey face.\"'],
    ['她买了一个熊猫包，舍不得吃，举着拍了二十张。最后咬下去的时候，咬掉了熊猫的头，她「あっ」了一声，像是犯了什么罪。', 'She buys a panda bun, photographs it twenty times, and when she finally bites, takes off the panda\'s head. \"Ah\" — as if she\'s committed a crime.'],
    ['她举着那只没头的熊猫，看着你，表情很复杂。', 'She holds up the headless panda, looking at you, conflicted.'],
    [say('食べちゃったものは、しょうがないよ。', '已经吃了，也没办法啦。', 'What\'s eaten is eaten.', '安慰她', 'Console her',
      ['pout', '……せやけど。……ごめんな、パンダ。……おいしいわ。くやしいけど。', '……话是这么说。……对不起，熊猫。……好吃。虽然不甘心。', '...I know, but. ...Sorry, panda. ...It\'s good. Annoyingly.'],
      ['食べちゃったものは、しょうがないだよ。', '「しょうがない」是い形容词型，不加「だ」。', 'しょうがない takes no だ.'],
      ['食べちゃったものは、しょうがあるよ。', '没有「しょうがある」这种说法。', 'しょうがある is not a phrase.']),
     joke('「熊猫的头，算是你的战利品。」', '"The panda\'s head is your trophy."', '调侃', 'Tease',
      ['tease', '戦利品ちゃうわ！　……でも、写真はトロフィーとして残しとこ。「パンダ、討伐」。', '才不是战利品！……不过，照片作为奖杯留着吧。「熊猫，讨伐」。', 'Not a trophy! ...But I\'ll keep the photo as one. \"Panda: defeated.\"']),
     act('替她拍一张她举着熊猫包的照片', 'Take a photo of her holding the panda bun', '换你来拍她', 'Shoot her for once',
      ['shy', '……ちょ、撮るなら言うてや！　……今の、変な顔してたやろ。……消さんでええけど。', '……喂，要拍先说啊！……刚才肯定是怪表情。……不用删就是了。', '...Hey, warn me if you\'re shooting! ...I made a weird face, right. ...You don\'t have to delete it.'])]
  )
};
