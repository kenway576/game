import { D, say, joke, act } from './kit';

// 来我家一起做饭
export const COOK = {
  asuka: D(
    ['明日香带来了一本菜谱，上面贴满了便利贴。她系上围裙，把材料按照使用顺序排成一列，然后看了一眼你那个乱糟糟的厨房，深吸了一口气。', 'Asuka brings a cookbook bristling with sticky notes. She ties on an apron, lines up the ingredients in order of use, glances at your messy kitchen, and takes a deep breath.'],
    ['她切菜切得很慢，但每一块都一样大。你想帮忙，她说\"手を切ったら困るでしょ\"，不让你碰刀，只让你洗菜。', 'She chops slowly, every piece identical. When you offer to help she won\'t let you near the knife — \"what if you cut yourself?\" — and puts you on washing duty.'],
    ['汤快好了。她舀了一勺，吹了吹，递到你嘴边：\"……味見。正直に言いなさい\"。', 'The soup is nearly done. She ladles a spoonful, blows on it, and holds it to your lips: \"...Taste it. Be honest.\"'],
    [say('すごくおいしい。毎日食べたいくらい。', '特别好喝。好喝到想每天都喝。', 'Delicious. I could have this every day.', '老实说', 'Honestly',
      ['shy', '……ま、毎日って。……それ、どういう意味か分かって言ってるの？　……分かってないわよね。……バカ。', '……每、每天。……你知道这是什么意思才说的吗？……你肯定不知道。……笨蛋。', '...E-every day? ...Do you know what that implies? ...You don\'t, do you. ...Idiot.'],
      ['すごくおいしい。毎日食べられたいくらい。', '被动「食べられたい」是\"想被吃\"，意思完全变了。', '食べられたい means \"want to be eaten\".'],
      ['ちょっと、しょっぱいかな。', '\"有点咸\"——她让你老实说，可这时候说这个，她会把锅端走。', '\"A bit salty\" — honest, but she\'d take the pot away.']),
     joke('「只让我洗菜，你是不放心我还是想一个人表现？」', '"Only letting me wash veg — don\'t trust me, or want to show off?"', '打趣', 'Tease',
      ['angry', 'りょ、両方よ！　……あなたにケガされたら、料理どころじゃなくなるでしょ。', '两、两个都是！……你受伤的话，就顾不上做饭了吧。', 'B-both! ...If you got hurt, cooking would be the last thing on my mind.']),
     act('从背后帮她系紧松了的围裙带', 'Retie her loosened apron strings from behind', '注意到了', 'You noticed',
      ['shy', '……っ。……後ろから、急に、やめなさいよ。……包丁、持ってるんだから。……ありがと。', '……唔。……别、别突然从后面来。……我拿着菜刀呢。……谢谢。', '...! ...Don\'t come up behind me like that. ...I\'m holding a knife. ...Thanks.'])]
  ),
  hikari: D(
    ['光说她要做\"お好み焼き\"，因为\"関西人の魂\"。她一进厨房就把面粉袋打翻了，半个灶台都白了，她自己的鼻子也白了。', 'Hikari is making okonomiyaki — \"the soul of Kansai.\" Within a minute she knocks over the flour bag, whitening half the counter and her own nose.'],
    ['可是一到翻面的时候，她突然变得很认真，拿着两把铲子，屏住呼吸——\"せーのっ！\"——完美地翻了过来。', 'But at the flip she turns serious, two spatulas poised, holding her breath — \"One, two!\" — a perfect turn.'],
    ['她转过头，满脸得意，鼻子上还沾着面粉。', 'She turns, triumphant, flour still on her nose.'],
    [say('鼻に粉ついてるけど、ひっくり返すの、プロみたいだった。', '鼻子上沾着粉，不过翻面像专业的一样。', 'Flour on your nose, but that flip was pro.', '一起说', 'Say both',
      ['happy', 'えっ、粉！？　……もう、先に言うてよ！　……でも、プロ？　えへへ、これだけは、おかんに鍛えられてん。', '诶，粉！？……真是的，早点说嘛！……不过，专业？嘿嘿，只有这个是被老妈练出来的。', 'Eh, flour?! ...You should\'ve said! ...But pro? Hehe, Mum drilled me on this one thing.'],
      ['鼻に粉ついてるけど、ひっくり返すの、プロらしいだった。', '「らしい」是形容词，不接「だった」，用「プロみたいだった」。', 'らしい is an adjective; not らしいだった. Use みたいだった.'],
      ['鼻に粉ついてて、ちょっと汚いよ。', '\"脸上有粉好脏\"，她刚翻完一个完美的面。', '\"There\'s flour, it\'s grubby\" — right after her perfect flip.']),
     joke('「面粉打翻的时候，我以为下雪了。」', '"When the flour went over I thought it was snowing."', '打趣', 'Tease',
      ['tease', '……雪見だいふくやなくて、雪見お好み焼きや。……新メニューや。', '……不是雪见大福，是雪见大阪烧。……新菜单。', '...Not snow mochi — snow okonomiyaki. ...A new menu item.']),
     act('用手指帮她擦掉鼻子上的面粉', 'Wipe the flour off her nose with your finger', '近距离', 'Up close',
      ['shy', '……！　……ち、近いって。……おこのみ焼き、焦げたら、{name}くんのせいやからな。', '……！……太、太近了。……大阪烧烤焦的话，都怪你哦。', '...! ...T-too close. ...If the okonomiyaki burns, it\'s your fault.'])]
  ),
  rei: D(
    ['铃把做饭当成了化学实验。她用电子秤称了每一种调料，精确到零点一克，还在笔记本上记录了火候和时间。', 'Rei treats cooking as a chemistry experiment. She weighs every seasoning on a digital scale to a tenth of a gram and logs heat and timings in her notebook.'],
    ['可是她从来没有尝过味道。你问她为什么不尝，她说：\"レシピ通りなら、味は保証されます\"。你尝了一口，太咸了——她把\"小さじ\"看成了\"大さじ\"。', 'But she never tastes. Why not? \"If I follow the recipe, the flavour is guaranteed.\" You taste it: far too salty — she read teaspoon as tablespoon.'],
    ['她盯着笔记本，脸色发白：\"……計算は、完璧だったはずです\"。', 'She stares at her notebook, pale: \"...My calculations should have been perfect.\"'],
    [say('一緒に作り直そう。今度は、味見しながら。', '一起重新做吧。这次边尝边做。', 'Let\'s remake it together. Tasting as we go this time.', '一起修正', 'Fix it together',
      ['shy', '……味見。……データにない、変数です。……あなたの舌を、信じてみます。', '……试味道。……这是数据里没有的变量。……我试着相信你的舌头。', '...Tasting. ...A variable not in my data. ...I\'ll try trusting your tongue.'],
      ['一緒に作り直させよう。今度は、味見しながら。', '使役「作り直させよう」是\"让（别人）重做\"，不是一起做。', '作り直させよう means \"make someone redo it\".'],
      ['しょっぱすぎて、食べられないね。', '\"太咸了没法吃\"，事实，但太扫兴了。', '\"Too salty to eat\" — true, but crushing.']),
     joke('「小勺看成大勺——天才也会犯这种错误？」', '"Teaspoon for tablespoon — even geniuses do that?"', '逗她', 'Tease',
      ['pout', '……単位の誤読は、歴史上、何度も大事故を起こしています。……今日は、小事故です。', '……单位误读，在历史上引发过很多次大事故。……今天是小事故。', '...Unit misreadings have caused major disasters throughout history. ...Today\'s was minor.']),
     act('加一点水和糖，把味道调回来', 'Add a little water and sugar to rescue the flavour', '补救', 'Rescue it',
      ['happy', '……おいしい。……あなたは、計算しないのに、正解にたどり着きます。……不思議です。', '……好吃。……你明明不计算，却能找到正确答案。……真不可思议。', '...Delicious. ...You don\'t calculate, yet you reach the right answer. ...Mysterious.'])]
  ),
  inari: D(
    ['稻荷说她要做\"本物の\"油豆腐乌冬。她站在灶台前，挽起袖子，可是看着煤气灶，半天不知道怎么开火。', 'Inari announces she will make \"real\" fried-tofu udon. She rolls up her sleeves at the stove — then stares at the gas hob, unable to work out how to light it.'],
    ['你帮她开了火，她吓了一跳：\"ひ、火の神を、こんな箱に閉じ込めておるのか！\"然后她恭恭敬敬地对着灶台拜了一拜。', 'You light it for her and she jumps: \"Y-you\'ve imprisoned the fire god in a box?!\" Then she bows respectfully to the stove.'],
    ['乌冬煮好了。她把最大的那块油豆腐夹到了你的碗里，然后盯着它，好像在后悔。', 'The udon is ready. She places the biggest piece of fried tofu in YOUR bowl, then stares at it as if regretting it.'],
    [say('一番大きいの、稲荷様が食べてください。', '最大的那块，请稻荷大人吃。', 'Please have the biggest piece, Inari-sama.', '还给她', 'Give it back',
      ['shy', '……よ、よいのじゃ。……そなたに、一番を食べてほしかった。……神が、人に供えるなど、初めてじゃ。', '……不、不用了。……我想让你吃最好的。……神明给人供奉，还是第一次。', '...N-no, it\'s fine. ...I wanted you to have the best. ...A goddess making an offering to a human — a first.'],
      ['一番大きいの、稲荷様が食べさせてください。', '「食べさせてください」是\"请让我吃\"，意思反了。', '食べさせてください means \"please let me eat\" — reversed.'],
      ['一番大きいの、もらっちゃいますね。', '直接吃掉——她会一边看一边咽口水。', 'Just eat it — she\'d watch, swallowing.']),
     joke('「给煤气灶行礼，那冰箱是什么神？」', '"You bowed to the stove — what god is the fridge?"', '接梗', 'Play along',
      ['tease', '……冷たき箱には、雪女でも住んでおるのか。……開けるたびに、ひやりとするからのう。', '……冰冷的箱子里，住着雪女吗。……每次打开都冷飕飕的。', '...Does a snow-woman dwell in the cold box? ...It chills me each time it opens.']),
     act('把油豆腐切成两半，一人一半', 'Cut the tofu in half — one piece each', '分享', 'Share it',
      ['happy', '……半分こ、か。……ふふ、人の子の知恵じゃな。……一番うまいのは、半分にしたほうじゃ。', '……一人一半吗。……呵呵，人类的智慧呢。……最好吃的，是分成两半的那一块。', '...Halves, is it. ...Heh, human wisdom. ...The tastiest piece is the one we split.'])]
  ),
  miyuki: D(
    ['深雪系着一条朴素的围裙，在你的厨房里动作很熟练，好像来过很多次。她说她一个人住了十年，\"料理だけは上手くなったわ\"。', 'Miyuki, in a plain apron, moves around your kitchen like she\'s been there many times. Ten years living alone — \"at least my cooking got good.\"'],
    ['她做了一桌家常菜：味噌汤、炖菜、煎鱼。摆好盘子，她坐下来，看着对面的你，好像有点不习惯。', 'She lays out a home-style spread: miso soup, simmered vegetables, grilled fish. Sitting down across from you, she seems a little unused to it.'],
    ['她说：\"……誰かと向かい合って食べるの、久しぶり\"。', '\"...It\'s been a long time since I ate facing someone.\"'],
    [say('これから、何度でも一緒に食べましょう。', '以后，一起吃多少次都行。', 'Let\'s eat together as often as we like from now on.', '许诺', 'Promise',
      ['shy', '……あら。……そんなこと言うと、お姉さん、毎週押しかけちゃうわよ。……いいの？', '……哎呀。……这么说的话，姐姐可要每周都来了哦。……可以吗？', '...Oh. ...Say that and I\'ll invite myself over every week. ...Is that okay?'],
      ['これから、何度でも一緒に食べられましょう。', '「られましょう」不成立，说「食べましょう」。', 'られましょう doesn\'t work; say 食べましょう.'],
      ['一人で食べるほうが、気楽ですよね。', '\"一个人吃比较轻松吧\"，否定了她的感慨。', '\"Eating alone is easier, right?\" — dismisses her.']),
     joke('「十年练出来的手艺，我一顿就吃完了，好浪费。」', '"Ten years of skill, finished in one meal — what a waste."', '打趣', 'Tease',
      ['tease', 'ふふ、そう思うなら、ゆっくり噛んで。……それか、また作らせて。何度でも。', '呵呵，这么想的话，就慢慢嚼。……或者，再让我做。多少次都行。', 'Hehe, then chew slowly. ...Or let me cook again. As often as you like.']),
     act('吃完以后，抢着去洗碗', 'After the meal, rush to do the dishes', '你来收拾', 'Your turn',
      ['happy', '……あら、いい子。……じゃあ、私は隣で拭くわね。……ふふ、新婚さんみたい。', '……哎呀，好孩子。……那我在旁边擦。……呵呵，像新婚夫妇一样。', '...Oh, good boy. ...Then I\'ll dry beside you. ...Hehe, like newlyweds.'])]
  ),
  sora: D(
    ['空说她只会做一样东西：\"プロテインの入ったおにぎり\"。你说今天做咖喱，她认真地点头，然后问你\"……肉、多めでええ？\"', 'Sora says she can make exactly one thing: protein rice balls. You say curry today; she nods seriously, then asks: \"...Can we do extra meat?\"'],
    ['她削土豆的方式像在跟土豆打架，皮削得很厚，土豆越削越小。你教她怎么削，她学得很快，第三个就削得很漂亮了。', 'She peels potatoes like she\'s fighting them — thick peels, shrinking spuds. You show her how; she learns fast, and the third is beautiful.'],
    ['咖喱好了。她盛了满满一碗，看着你：\"……お前と作ったら、普通のカレーでも、うまそうに見えるな\"。', 'The curry\'s done. Heaping her bowl, she looks at you: \"...Made with you, even ordinary curry looks good.\"'],
    [say('空が覚えるの早いから、楽しかったよ。', '你学得很快，我很开心。', 'You learn fast — it was fun.', '夸她', 'Praise her',
      ['shy', '……そ、そうか？　……コーチがええからや。……次も、お前に教えてもらうわ。……料理以外も。', '……是、是吗？……因为教练好。……下次也让你教我。……做饭以外的也是。', '...R-really? ...Good coach. ...You\'ll teach me next time too. ...Not just cooking.'],
      ['空が覚えるの早いから、楽しいだった。', '形容词过去形是「楽しかった」，不是「楽しいだった」。', 'Past of 楽しい is 楽しかった, not 楽しいだった.'],
      ['空は不器用だから、疲れたよ。', '\"你太笨了，好累\"，她会把土豆扔过来。', '\"You\'re clumsy, I\'m tired\" — she\'d throw a potato.']),
     joke('「你削土豆的样子，像在打拳击。」', '"The way you peel potatoes — it\'s like boxing."', '吐槽', 'Snark',
      ['tease', 'ジャガイモが、手強かったんや。……三ラウンド目で、ようやくKOしたったわ。', '土豆太难缠了。……第三回合终于KO了。', 'The potato put up a fight. ...Finally KO\'d it in round three.']),
     act('给她的咖喱里多加一块肉', 'Slip an extra piece of meat into her curry', '她想要的', 'What she wanted',
      ['happy', '……！　……お前、ほんまに、ウチの欲しいもん、分かっとるな。……肉も、お前も。……あ、今のなし！', '……！……你真的懂我想要什么。……肉也好，你也好。……啊，刚才那句不算！', '...! ...You really know what I want. ...The meat, and you. ...Wait, scratch that!'])]
  ),
  nao: D(
    ['奈绪说她想做亲子丼，因为\"おやこ\"这个名字很温暖。她切洋葱切得眼泪直流，却一直不肯停手。', 'Nao wants to make oyakodon — the name \"parent and child\" sounds warm. Chopping onions makes her eyes stream, but she won\'t stop.'],
    ['你接过刀帮她切。她站在旁边，看着你的手，小声说：\"……むかし、あんたが ないてたとき、あたしが なみだ ふいた\"。', 'You take over the knife. She watches your hands and whispers: \"...Back then, when you cried, I wiped your tears.\"'],
    ['你想起来了。小学的时候，你摔倒了，是她用袖子帮你擦的眼泪。', 'You remember. In primary school you fell, and she wiped your tears with her sleeve.'],
    [say('今度は、こっちが拭く番だね。', '这次，轮到我来擦了。', 'This time, it\'s my turn to wipe your tears.', '回应', 'Respond',
      ['shy', '……たまねぎの なみだ だから、ノーカウント。……でも、ふいて。……ほんとの なみだの ときも。', '……这是洋葱的眼泪，不算。……不过，帮我擦。……真的眼泪的时候也是。', '...Onion tears don\'t count. ...But wipe them. ...When they\'re real tears, too.'],
      ['今度は、こっちが拭かれる番だね。', '被动「拭かれる」是\"被擦\"，主客颠倒。', '拭かれる means \"be wiped\" — reversed.'],
      ['たまねぎくらいで、泣かないで。', '\"切个洋葱就哭\"，太冷漠了。', '\"Don\'t cry over onions\" — cold.']),
     joke('「亲子丼的名字很温暖——你知道它为什么叫亲子吗？」', '"Oyakodon sounds warm — know why it\'s called that?"', '逗她', 'Tease',
      ['pout', '……しってる。……とりと たまご。……ちょっと かなしい なまえ。……でも、おいしい。', '……知道。……鸡和蛋。……有点悲伤的名字。……不过，好吃。', '...I know. ...Chicken and egg. ...A slightly sad name. ...But tasty.']),
     act('用干净的毛巾，轻轻地帮她擦眼泪', 'Gently wipe her tears with a clean towel', '像她当年那样', 'Like she did for you',
      ['happy', '……おかえし、された。……あんた、ずっと おぼえてたんだ。……うれしい。', '……被你还回来了。……你一直都记得啊。……好开心。', '...You paid me back. ...You remembered all along. ...I\'m happy.'])]
  ),
  maki: D(
    ['真希说她的料理技能\"レベル1\"，只会泡面。她站在灶台前，拿着锅铲，像拿着一把她不熟悉的武器。', 'Maki says her cooking skill is level 1 — instant noodles only. At the stove she holds the spatula like an unfamiliar weapon.'],
    ['你们做蛋包饭。她第一次包蛋就破了，第二次也破了，第三次——完美地包住了。她举着锅铲，大喊\"レベルアップ！\"', 'You make omurice. Her first omelette tears, so does the second — the third wraps perfectly. Spatula aloft: \"Level up!\"'],
    ['她拿起番茄酱，在蛋包饭上画了一个像素风格的爱心，然后马上用勺子抹掉了。', 'With ketchup she draws a pixel-art heart on it — then smears it out with a spoon.'],
    [say('さっきのハート、消さなくてもよかったのに。', '刚才那个爱心，不用抹掉的。', 'You didn\'t have to erase that heart.', '戳破', 'Call it out',
      ['shy', '……み、見えとったんか。……ほな、もう一回、描いたる。……今度は、消さへん。', '……看、看见了啊。……那我再画一次。……这次，不擦了。', '...Y-you saw. ...Then I\'ll draw it again. ...This time, I won\'t erase it.'],
      ['さっきのハート、消さなくてもいいだったのに。', '「いいだった」不对，形容词过去形是「よかった」。', 'いいだった is wrong; the past of いい is よかった.'],
      ['さっきのハート、下手だったね。', '\"那个爱心画得好烂\"，她再也不画了。', '\"That heart was badly drawn\" — she\'d never draw again.']),
     joke('「三次才成功，存档读了几次？」', '"Three tries — how many save reloads?"', '接梗', 'Play along',
      ['tease', '……リアルにセーブ機能ないの、クソゲーやわ。……でも、せんぱいがおったから、コンティニューできた。', '……现实没有存档功能，真是垃圾游戏。……不过，因为有前辈在，才能继续。', '...Real life has no save function — garbage game. ...But with you here, I could continue.']),
     act('用番茄酱在她的蛋包饭上，画一个爱心', 'Draw a ketchup heart on HER omurice', '回礼', 'Return the gesture',
      ['happy', '……！　……ドット絵ちゃうやん。……でも、こっちのほうが、ええな。……食べるの、もったいない。', '……！……不是像素画嘛。……不过，这个更好。……舍不得吃。', '...! ...That\'s not pixel art. ...But I like this better. ...Too good to eat.'])]
  )
};
