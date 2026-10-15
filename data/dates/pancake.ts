import { D, say, joke, act } from './kit';

// 幸福松饼（排队、只有一壶糖浆）
export const PANCAKE = {
  asuka: D(
    ['排队的时候，明日香一直在看手表，每隔两分钟报一次时间，像在监督这条队伍有没有偷懒。她说这家店的翻台率\"非効率\"。', 'In the queue Asuka checks her watch every two minutes and announces the time, as if supervising the line. The table turnover here is \"inefficient,\" she says.'],
    ['松饼端上来的时候，她的眼睛亮了一下——很快，快到她以为你没看见。她拿出手机，拍了一张，又若无其事地放下。', 'When the pancakes come her eyes light up — fast, so fast she thinks you missed it. She takes one photo and puts the phone away as if nothing happened.'],
    ['只有一壶糖浆。她把壶推到你那边，又拉了一点回来。', 'There is one jug of syrup. She pushes it toward you, then pulls it back a little.'],
    [say('先にかけていいよ。', '你先浇吧。', 'You go first with the syrup.', '让给她', 'Let her go first',
      ['shy', '……順番は、どうでもいいのよ。……でも、まあ、ありがと。半分、残しておくから。', '……顺序无所谓的。……不过，嘛，谢了。我会留一半的。', '...Order doesn\'t matter. ...But, well, thanks. I\'ll leave you half.'],
      ['先にかけてもいいだよ。', '「いい」后面不加「だ」，直接说「いいよ」。', 'いい takes no だ; just いいよ.'],
      ['先にかけないで。', '\"别先浇\"，正好反过来了。', '\"Don\'t go first\" — reversed.']),
     joke('「拍照了吧？我看见了。」', '"You took a photo. I saw."', '揭穿', 'Call it',
      ['angry', 'き、記録よ！　店の評価のための記録！　……送らないからね。', '那、那是记录！为了评价店铺的记录！……不会发给你的。', 'I-it\'s documentation! For rating the shop! ...I\'m not sending it to you.']),
     act('把自己那块最边上、黄油最多的切给她', 'Cut her the edge piece of yours, the one with the most butter', '最好的那块', 'The best bit',
      ['happy', '……そこ、一番おいしいとこじゃない。……分かってて、くれたの？', '……那是最好吃的地方吧。……你是知道才给我的？', '...That\'s the best part. ...You knew, and gave it to me?'])]
  ),
  hikari: D(
    ['排队的时候，光把前后左右的人都聊了一遍：前面的情侣是第三次来，后面的大学生是第一次。等轮到你们的时候，她已经知道了这家店最好吃的是哪一种。', 'In the queue Hikari chats with everyone around: the couple ahead are on their third visit, the students behind on their first. By your turn she knows the best item on the menu.'],
    ['松饼端上来，她「わあああ」了一声，声音长得像一列小火车开过去。她用叉子戳了戳，说「ふわっふわや！」，然后又戳了一下，确认。', 'When the pancakes arrive she goes \"Waaaah\" like a little train passing. She pokes one: \"So fluffy!\" Then pokes again to confirm.'],
    ['糖浆壶在你们中间。', 'The syrup jug sits between you.'],
    [say('半分ずつ、かけよう。', '一人一半，浇吧。', 'Let\'s split the syrup half and half.', '公平分配', 'Split it fairly',
      ['happy', 'うん！　……あ、うち、ちょっと多めにかけてもうた。ごめん！　……ひとくち、あげるから！', '嗯！……啊，我好像浇多了一点。对不起！……给你吃一口！', 'Yeah! ...Oops, I poured a bit too much. Sorry! ...Have a bite of mine!'],
      ['半分ずつ、かけろう。', '「かける」的意志形是「かけよう」。', 'The volitional of かける is かけよう.'],
      ['半分ずつ、かかろう。', '「かかる」是自动词\"淋上去\"，意志形用在这里不成句。', 'かかる is intransitive; かかろう makes no sense here.']),
     joke('「你戳了它三次，它都快被你戳扁了。」', '"You\'ve poked it three times. It\'s going flat."', '逗她', 'Tease',
      ['tease', 'だいじょうぶ、まだふわふわや！　……{name}くんも、つついてみて？　ほら！', '没事，还是软软的！……你也戳戳看？来！', 'It\'s fine, still fluffy! ...You poke it too! Go on!']),
     act('替她把嘴角沾到的奶油擦掉', 'Wipe a smudge of cream off the corner of her mouth', '她没发现', 'She hadn\'t noticed',
      ['shy', 'えっ……ついてた！？　……はずっ。……ありがと。', '诶……沾到了！？……好丢人。……谢谢。', 'Eh... I had some on me?! ...Embarrassing. ...Thanks.'])]
  ),
  rei: D(
    ['铃在排队的时候拿出了一本口袋书，读到第四十三页的时候，队伍正好排到。她把书签夹好，说「予測通りです」。', 'Rei reads a paperback in the queue. Just as she reaches page forty-three, it is your turn. She marks the page: "As predicted."'],
    ['松饼上的黄油化开的速度，她看得很认真，说\"化开的角度很漂亮\"。你从来没想过黄油化开还有角度。', 'She watches the butter melt with great attention and says the \"angle of melting is beautiful.\" You never knew melting butter had an angle.'],
    ['糖浆壶的嘴细得像一根问号。她拿起来，又放下。', 'The jug\'s spout is thin as a question mark. She picks it up, then sets it down.'],
    [say('どのくらいかけるか、計算してるの？', '你在算要浇多少吗？', 'Are you calculating how much to pour?', '猜中她', 'Read her mind',
      ['happy', '……はい。最適量は十二ミリリットルです。……でも、あなたと分けるので、半分にします。', '……是的。最佳用量是十二毫升。……不过要跟你分，所以减半。', '...Yes. The optimum is twelve millilitres. ...But I\'m sharing with you, so half.'],
      ['どのくらいかけるか、計算されてるの？', '被动「計算されてる」变成\"被计算\"，主语错了。', '計算されてる is passive — \"being calculated\".'],
      ['どのくらいかけるか、計算しないの？', '\"你不算吗\"，跟眼前的事实相反。', '\"Aren\'t you calculating?\" — the opposite.']),
     joke('「黄油的角度，可以写进论文吗？」', '"Can the butter angle go in your paper?"', '调侃', 'Tease',
      ['tease', '……すでに三ページ分のメモがあります。タイトルは「幸福の融点」です。', '……已经有三页笔记了。标题叫「幸福的熔点」。', '...I already have three pages of notes. The title is \"The Melting Point of Happiness.\"']),
     act('拿起壶，替她浇了一条细细的线', 'Pick up the jug and pour a thin line for her', '替她决定', 'Decide for her',
      ['surprised', '……誤差、プラス二ミリです。……でも、おいしいので、許容範囲です。', '……误差，多了两毫升。……不过，很好吃，所以在容许范围内。', '...Error: plus two millilitres. ...But it\'s delicious, so within tolerance.'])]
  ),
  inari: D(
    ['稻荷完全不理解为什么要排队。她站在队伍里，每隔一会儿就小声问你\"还要拜多久\"——她以为这是某种参拜。', 'Inari does not understand queues. Every so often she whispers, \"How much longer must we pray?\" — she thinks this is a kind of shrine visit.'],
    ['松饼端上来，她盯着它看了很久，然后郑重地合了一下掌。她说这么柔软的供品，她一千年都没收到过。', 'When the pancakes arrive she stares a long time, then puts her palms together solemnly. In a thousand years she has never received an offering this soft.'],
    ['她把糖浆壶拿起来，像拿一只酒瓶，看着你，等你斟。', 'She lifts the syrup jug like a sake flask and looks at you, waiting for you to pour.'],
    [say('神様、どうぞ召し上がってください。', '神明大人，请享用。', 'Please, my goddess, enjoy.', '配合她当供品', 'Play along with the offering',
      ['happy', 'うむ、苦しゅうない。……そなたの供物は、甘いのう。……一口、分けてやろう。', '嗯，免礼。……你的供品真甜啊。……分你一口吧。', 'Mm, at ease. ...Your offering is sweet. ...I shall share a bite.'],
      ['神様、どうぞ召し上がらせてください。', '使役「召し上がらせて」变成\"请让我享用\"，主客颠倒。', '召し上がらせて means \"let me eat\" — reversed.'],
      ['神様、どうぞ召し上がりませんでした。', '过去否定\"没有享用\"，句子不成立。', 'A past negative here makes no sense.']),
     joke('「排队不是参拜，是在等吃的。」', '"The queue isn\'t prayer. We\'re waiting for food."', '告诉她真相', 'Tell her the truth',
      ['surprised', '……食うために、これほど並ぶのか。……人の子は、神より辛抱強いのう。', '……为了吃，排这么久吗。……人类的孩子，比神还有耐心啊。', '...All this waiting, to eat? ...Humans are more patient than gods.']),
     act('学她的样子，也对着松饼合掌', 'Copy her and put your palms together over the pancakes', '一起参拜', 'Pray with her',
      ['shy', '……真似をするな。……されど、二人で拝むと、ありがたみが増すのう。', '……别学我。……不过，两个人一起拜，好像更灵验了。', '...Do not mimic me. ...Though praying together does feel more blessed.'])]
  ),
  miyuki: D(
    ['深雪排队的时候，从包里拿出了两颗糖，一颗给你，一颗给排在你们后面的一个等得快哭了的小孩。小孩的妈妈对她鞠了一躬。', 'In the queue Miyuki produces two sweets from her bag — one for you, one for a tearful child behind you. The child\'s mother bows to her.'],
    ['松饼端上来，她先拍了一张照，说要发给\"楼下的房东太太\"——她们约好了要一起来，可对方腰痛来不了。', 'When the pancakes arrive she takes a photo to send \"the landlady downstairs\" — they planned to come together but her back is bad.'],
    ['糖浆壶在她那边。她握着把手，看着你。', 'The syrup is on her side. She holds the handle and looks at you.'],
    [say('今度は、大家さんも一緒に来ましょう。', '下次，跟房东太太一起来吧。', 'Next time, let\'s bring the landlady too.', '想到别人', 'Think of someone else',
      ['shy', '……あら。……ふふ、そういうところ、好きよ。……きっと、喜ぶわ。', '……哎呀。……呵呵，你这种地方，我很喜欢哦。……她一定会高兴的。', '...Oh. ...Hehe, I love that about you. ...She\'ll be so pleased.'],
      ['今度は、大家さんも一緒に来させましょう。', '使役「来させましょう」是\"让她来\"，语气很失礼。', '来させましょう means \"make her come\" — rude.'],
      ['前回は、大家さんも一緒に来ましょう。', '「前回」是\"上次\"，邀请不了过去。', '前回 is last time — you can\'t invite into the past.']),
     joke('「深雪小姐的包里，是不是什么都有？」', '"Is there anything your bag doesn\'t have?"', '好奇', 'Curious',
      ['tease', 'ふふ、お姉さんの鞄は四次元なの。……ばんそうこうも、ハンカチも、あなたの分の飴も。', '呵呵，姐姐的包是四次元的。……创可贴、手帕，还有你那份的糖。', 'Hehe, big sister\'s bag is four-dimensional. ...Plasters, handkerchiefs, and sweets for you.']),
     act('拿起壶先给她浇，再给自己', 'Take the jug and pour for her first, then yourself', '照顾她一次', 'Look after her for once',
      ['happy', '……今日は、私がしてもらう番なのね。……ありがとう。甘い。', '……今天，轮到我被照顾了呢。……谢谢。好甜。', '...Today it\'s my turn to be looked after. ...Thank you. Sweet.'])]
  ),
  sora: D(
    ['空在队伍里做拉伸，一会儿压腿，一会儿转手腕，像在等比赛开场。她说站着不动是\"いちばんしんどい練習\"。', 'Sora stretches in the queue — hamstrings, wrists — as if waiting for tip-off. Standing still, she says, is \"the hardest drill.\"'],
    ['松饼端上来，她一口吞了三分之一，然后被烫得猛喝水。她说「……ゆっくり食えってことか」，眼泪都出来了。', 'When the pancakes come she wolfs a third in one bite and gulps water, scalded. "...So you\'re meant to eat it slowly," she says, eyes watering.'],
    ['她把糖浆壶推给你：「お前、先かけ」。', 'She pushes the syrup at you: "You first."'],
    [say('熱いから、ゆっくり食べよう。', '很烫，慢慢吃吧。', 'It\'s hot, let\'s eat slowly.', '照顾她', 'Look out for her',
      ['shy', '……わかっとるわ。……でも、言うてくれて、サンキュ。', '……我知道啦。……不过，谢谢你提醒。', '...I know. ...But thanks for saying it.'],
      ['熱いから、ゆっくり食べろう。', '「食べる」的意志形是「食べよう」。', 'The volitional of 食べる is 食べよう.'],
      ['熱くないから、ゆっくり食べよう。', '\"不烫所以慢慢吃\"，逻辑反了。', '\"It\'s not hot, so eat slowly\" — illogical.']),
     joke('「排队拉伸，吃饭赛跑，你是运动员病吧。」', '"Stretching in queues, racing your food — athlete brain."', '调侃', 'Tease',
      ['tease', '褒め言葉として受け取っとくわ。……次の一枚、どっちが早く食えるか勝負な。', '我就当是夸奖了。……下一块，比谁吃得快。', 'I\'ll take that as a compliment. ...Next pancake: race you.']),
     act('把自己那杯冰水推给她', 'Push your glass of ice water over to her', '她被烫到了', 'She burned her mouth',
      ['happy', '……ん。……助かる。……お前の分、なくなったら言えや。おごるから。', '……嗯。……帮大忙了。……你的没了就说，我请。', '...Mm. ...Lifesaver. ...If yours runs out, say so. I\'ll get you one.'])]
  ),
  nao: D(
    ['奈绪排队的时候很安静，一直在看前面那对情侣牵着的手，看完又看你的手，然后低头看自己的鞋。', 'Nao is quiet in the queue, watching the couple ahead holding hands, then your hand, then her own shoes.'],
    ['松饼端上来，她拿出小本子，画了一张松饼的速写——黄油画成了一个歪歪的方块。她说「わすれないように」。', 'When the pancakes come she sketches one in her notebook — the butter a lopsided square. \"So I don\'t forget.\"'],
    ['只有一壶糖浆。她小声说「あんた、あまいの すきでしょ」。', 'Only one jug of syrup. She murmurs, \"You like sweet things, right.\"'],
    [say('奈緒が先に使って。', '奈绪你先用。', 'You use it first, Nao.', '让给她', 'Let her go first',
      ['shy', '……いいの？　……じゃあ、すこしだけ。……あんたの ぶん、ちゃんと のこすね。', '……可以吗？……那，就一点点。……你的那份，我会好好留着。', '...Really? ...Then just a little. ...I\'ll leave yours, properly.'],
      ['奈緒が先に使われて。', '被动「使われて」是\"被使用\"，请求不成立。', '使われて is passive — the request breaks.'],
      ['奈緒が後で使って。', '「後で」是\"之后再用\"，不是让她先。', '後で means later — not first.']),
     joke('「你画的黄油，像块豆腐。」', '"Your butter drawing looks like tofu."', '调侃她的画', 'Tease her drawing',
      ['pout', '……とうふ じゃないよ。……バター。……あんたの え より、うまいもん。', '……不是豆腐。……是黄油。……比你画得好。', '...It\'s not tofu. ...Butter. ...Better than your drawing, anyway.']),
     act('在她本子上的松饼旁边，画了一个小小的你', 'Next to her pancake sketch, draw a tiny version of yourself', '加一个人', 'Add someone',
      ['happy', '……かってに かいた。……でも、ふたりで たべてる え に なったね。', '……擅自画了。……不过，变成两个人一起吃的画了呢。', '...You drew in it. ...But now it\'s a picture of us eating together.'])]
  ),
  maki: D(
    ['真希排队的时候一直在打手机游戏，队伍往前走，她就闭着眼往前挪，从来没撞到前面的人。你问她怎么做到的，她说「気配や」。', 'Maki games on her phone the whole queue, shuffling forward eyes down without ever bumping the person ahead. How? \"I sense it.\"'],
    ['松饼端上来，她拍了十几张照片，修了五分钟的图，然后说「冷めたやん……」，一脸受伤。', 'When the pancakes arrive she takes a dozen photos and edits for five minutes, then: \"It\'s gone cold...\" — wounded.'],
    ['她瞪着糖浆壶，好像它要为松饼变凉负责。', 'She glares at the syrup jug as if it were to blame.'],
    [say('温かいシロップをかければ、まだおいしいよ。', '浇上热糖浆，还是很好吃的。', 'With warm syrup, it\'s still delicious.', '安慰她', 'Comfort her',
      ['tease', '……せんぱい、たまにええこと言うやん。……かけて。ウチの分も。たっぷりな♡', '……前辈偶尔也会说好话嘛。……浇吧。我的也要。多一点哦♡', '...You say good stuff sometimes, senpai. ...Pour it. Mine too. Lots.'],
      ['温かいシロップをかけば、まだおいしいよ。', '「かける」的假定形是「かければ」，不是「かけば」。', 'The conditional of かける is かければ.'],
      ['冷たいシロップをかければ、まだおいしいよ。', '「冷たい」是\"冰的\"，跟你想安慰她的意思不合。', '冷たい means cold syrup — not comforting.']),
     joke('「修图五分钟，松饼也会生气的。」', '"Five minutes of editing — the pancake\'s offended."', '吐槽', 'Snark',
      ['angry', 'パンケーキに感情ないわ！　……ないよな？　……ごめん、パンケーキ。', '松饼才没有感情！……没有吧？……对不起，松饼。', 'Pancakes don\'t have feelings! ...Right? ...Sorry, pancake.']),
     act('把你那份还热的换给她', 'Swap your still-warm plate for hers', '换着吃', 'Swap plates',
      ['shy', '……ええの？　……せんぱいの、まだあったかい。……今日だけ、ざぁこって言わんとく。', '……可以吗？……前辈的还是热的。……今天就不叫你杂鱼了。', '...You sure? ...Yours is still warm. ...Today I won\'t call you loser.'])]
  )
};
