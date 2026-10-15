import { D, say, joke, act } from './kit';

// 去生田神社参拜
export const SHRINE = {
  asuka: D(
    ['明日香参拜的每一个步骤都标准得像教科书：鞠躬两次，拍手两次，再鞠躬一次。她闭着眼睛许愿，许了很久，久得你都开始数她的睫毛。', 'Asuka\'s worship is textbook: two bows, two claps, one bow. She prays with her eyes closed for so long you start counting her lashes.'],
    ['她睁开眼，发现你在看她，立刻转身去抽签。抽到\"末吉\"，她盯着签文看了很久，嘴里念着\"待ち人、遅れて来る\"。', 'She opens her eyes, catches you looking, and spins off to draw a fortune. \"Small luck.\" She studies it, murmuring: \"The one you wait for will come late.\"'],
    ['她把签折好，没有系在树上，而是放进了钱包里。', 'She folds it and, instead of tying it to the tree, tucks it into her wallet.'],
    [say('遅れても、来るなら、いいじゃない。', '就算晚到，会来的话，不也挺好吗。', 'Even if they\'re late — if they come, that\'s fine, right?', '解读签文', 'Read the fortune',
      ['shy', '……そうね。……でも、あんまり遅いと、怒るわよ。……誰とは、言わないけど。', '……也是。……不过，太晚了的话，我会生气哦。……我没说是谁。', '...True. ...But if they\'re too late, I\'ll get angry. ...Not saying who.'],
      ['遅れても、来られるなら、いいじゃない。', '「来られる」是可能/尊敬，这里简单的「来る」就够了。', '来られる adds unneeded potential/honorific; plain 来る.'],
      ['遅れるなら、来ないほうがいいじゃない。', '\"晚来不如不来\"，她会把签撕了。', '\"Better not to come than be late\" — she\'d tear it up.']),
     joke('「你许愿许那么久，许了几个？」', '"You prayed so long — how many wishes?"', '好奇', 'Curious',
      ['angry', 'ひ、一つよ！　……長かったのは、説明を丁寧にしたから。神様に誤解されたら困るでしょ。', '一、一个！……时间长是因为说明得很仔细。被神明误解了可就麻烦了吧。', 'J-just one! ...It was long because I explained it carefully. Can\'t have the gods misunderstanding.']),
     act('也抽一张签，抽到\"大吉\"，跟她交换', 'Draw a fortune too — Great Luck — and swap with her', '分给她好运', 'Share your luck',
      ['happy', '……大吉、もらっていいの？　……じゃあ、私の末吉はあなたが持ってて。……二人で、半分ずつね。', '……大吉，给我可以吗？……那我的末吉你拿着。……两个人，一人一半呢。', '...Can I really have Great Luck? ...Then you keep my Small Luck. ...Half each.'])]
  ),
  hikari: D(
    ['光在洗手的地方把水溅了自己一身，然后对着你笑：\"お清め完了！\"她拍手的声音特别响，响得旁边的老奶奶都回头了。', 'Hikari splashes herself at the purification basin and grins: \"Purified!\" Her clap is so loud an old lady turns around.'],
    ['她许完愿，偷偷看了你一眼。你问她许了什么，她说\"言うたら叶わへんやん\"，可是脸红了。', 'After praying she sneaks a glance at you. What did she wish for? \"If I say, it won\'t come true\" — but she\'s blushing.'],
    ['她去写绘马。写完，她用手挡着，不让你看。', 'She goes to write an ema plaque, covering it with her hand so you can\'t see.'],
    [say('光ちゃんの願い、叶うといいね。', '希望你的愿望能实现。', 'I hope your wish comes true.', '真心祝福', 'Sincere wish',
      ['shy', '……うん。……{name}くんが、そう言うてくれたら、もう半分叶ったようなもんやわ。', '……嗯。……有你这么说，就已经实现了一半了。', '...Yeah. ...With you saying that, it\'s already half come true.'],
      ['光ちゃんの願い、叶えるといいね。', '「叶える」是\"（谁）去实现\"，这里说愿望\"实现\"用自动词「叶う」。', '叶える is transitive; the wish itself 叶う.'],
      ['光ちゃんの願い、叶わないといいね。', '\"希望实现不了\"，太坏了。', '\"I hope it doesn\'t come true\" — mean.']),
     joke('「你拍手那么响，神明大概以为是在敲门。」', '"Clapping that loud — the gods must think someone\'s knocking."', '吐槽', 'Snark',
      ['tease', 'それでええねん！　……ちゃんと聞こえへんかったら、困るやろ。大事なお願いやねんから。', '那就对了！……要是没听清就麻烦了吧。是很重要的愿望。', 'That\'s the point! ...It\'d be bad if they didn\'t hear. It\'s an important wish.']),
     act('在她的绘马旁边，挂上你自己的', 'Hang your own ema right next to hers', '挨着', 'Side by side',
      ['shy', '……隣に、かけたん？　……神様、二人分まとめて読んでくれるかな。……同じこと、書いてたらええな。', '……挂在旁边了？……神明会不会两个人的一起读呢。……要是写的是一样的就好了。', '...Right next to mine? ...Maybe the gods will read them together. ...I hope we wrote the same thing.'])]
  ),
  rei: D(
    ['铃说她不信神，但她会遵守礼节，\"文化への敬意です\"。她参拜的动作很轻，拍手的声音几乎听不见。', 'Rei says she doesn\'t believe in gods but observes the etiquette — \"respect for the culture.\" Her clap is nearly silent.'],
    ['她在神社后面的森林里走得很慢，抬头看那些很老的树。她说这些树经历过大火和地震，\"それでも、ここにあります\"。', 'In the forest behind the shrine she walks slowly, looking up at the ancient trees. They\'ve survived fire and earthquake — \"and they\'re still here.\"'],
    ['她停在一棵最老的树前，把手放在树干上。', 'She stops at the oldest tree and lays a hand on its trunk.'],
    [say('鈴は、神様じゃなくて、木に願いごとをするんだね。', '铃不是向神明，而是向树许愿呢。', 'You make your wishes to trees, not gods.', '看出来了', 'You noticed',
      ['shy', '……観測できるものに、願うほうが、合理的なので。……でも、今の願いは、あなたにも関係があります。', '……向能观测到的东西许愿，比较合理。……不过，刚才的愿望，跟你也有关系。', '...Wishing to something observable is more rational. ...But this wish involves you too.'],
      ['鈴は、神様じゃなくて、木に願いごとをさせるんだね。', '使役「させる」变成\"让树许愿\"，不对。', 'させる turns it into \"make the tree wish\".'],
      ['鈴は、木にも神様にも、何も願わないんだね。', '\"什么也不许\"，跟你看到的不符。', '\"You wish for nothing\" — contradicts what you saw.']),
     joke('「不信神但守礼节——你是在给神明打分吗。」', '"No faith but full etiquette — are you grading the gods?"', '吐槽', 'Snark',
      ['tease', '……神様が実在した場合の、保険です。……あなたも、保険に入っておきますか。', '……这是万一神明存在的保险。……你也要加入保险吗？', '...Insurance, in case the gods exist. ...Would you like a policy too?']),
     act('把手也放在那棵树上，挨着她的手', 'Lay your hand on the tree too, beside hers', '一起', 'Together',
      ['happy', '……樹皮が、温かいです。……いえ、それは、あなたの手のほうかもしれません。', '……树皮是温的。……不，那可能是你的手。', '...The bark is warm. ...No — perhaps that\'s your hand.'])]
  ),
  inari: D(
    ['稻荷一进神社就皱起了眉头，说这里的神\"格が上\"，她有点不自在。可是她又站在正殿前不肯走，说要\"挨拶せねば\"。', 'The moment Inari enters she frowns — this shrine\'s deity outranks her and she feels awkward. Yet she won\'t leave the main hall: \"I must pay my respects.\"'],
    ['她的参拜跟别人不一样：没有拍手，只是深深地低下头，说了一长串古老的话。说完，一阵风吹过，树叶沙沙作响。她松了一口气：\"……許された\"。', 'Her worship is different: no clapping, just a deep bow and a long string of archaic words. A breeze rustles the leaves. She exhales: \"...I\'m permitted.\"'],
    ['出来以后，她小声问你：\"……そなたは、何を願った？\"', 'Outside, she asks softly what you wished for.'],
    [say('稲荷様が、ずっとここにいられますように、って。', '希望稻荷大人能一直待在这里。', 'That you can always stay here.', '说实话', 'Tell the truth',
      ['shy', '……っ。……他所の神に、わらわのことを願ったのか。……愚か者。……じゃが、聞き届けられるとよいな。', '……唔。……你竟然向别的神明，为我许愿吗。……傻瓜。……不过，希望能被听到呢。', '...! ...You asked another god about me? ...Fool. ...But I hope it\'s heard.'],
      ['稲荷様が、ずっとここにいさせますように、って。', '使役「いさせます」是\"让（别人）待着\"，主语乱了。', 'いさせます means \"make someone stay\".'],
      ['稲荷様が、早く帰りますように、って。', '\"希望你早点回去\"，她会哭的。', '\"That you go home soon\" — she\'d cry.']),
     joke('「别人家的神社，你是来串门的吗？」', '"Someone else\'s shrine — dropping by for a visit?"', '打趣', 'Tease',
      ['angry', '串門……！　……正式な表敬訪問じゃ！　……まあ、お茶くらいは出してもらいたかったが。', '串门……！……是正式的拜访！……不过，至少想被招待一杯茶的。', 'Dropping by...! ...This is a formal courtesy call! ...Though I\'d have liked a cup of tea.']),
     act('在回去的路上，买一份油豆腐乌冬请她', 'On the way back, treat her to fried-tofu udon', '犒劳她', 'Reward her',
      ['happy', '……気の利く人の子じゃ。……緊張したから、腹が減っておった。……二杯、よいか？', '……真是个机灵的人类。……因为紧张，肚子饿了。……可以两碗吗？', '...A thoughtful human child. ...The nerves made me hungry. ...May I have two?'])]
  ),
  miyuki: D(
    ['深雪说生田神社是保佑姻缘的。她说得很轻松，像在说天气，可是参拜的时候，她的手合了很久。', 'Ikuta Shrine is for matchmaking, Miyuki says lightly, as if talking about the weather. But her hands stay pressed together a long time.'],
    ['她带你去看神社后面的一口井，说传说中这里的水能让人\"心が澄む\"。她掬了一捧，没有喝，只是看着水里的倒影。', 'She shows you a well behind the shrine whose water is said to clear the heart. She cups some, doesn\'t drink, just looks at her reflection.'],
    ['她转过头，笑了笑：\"……縁結びの神社に、あなたと来ちゃった\"。', 'She turns and smiles: \"...I came to the matchmaking shrine with you.\"'],
    [say('来てよかったです、一緒に。', '一起来了，真好。', 'I\'m glad we came together.', '不躲开', 'Don\'t dodge it',
      ['shy', '……あら、否定しないのね。……ふふ、神様、聞いてたかしら。……聞いてて、くれたらいいな。', '……哎呀，你不否认呢。……呵呵，神明听到了吗。……要是听到了就好了。', '...Oh, you don\'t deny it. ...Hehe, I wonder if the gods heard. ...I hope they did.'],
      ['来ってよかったです、一緒に。', '「来る」的て形是「来て」，没有「来って」。', 'The te-form of 来る is 来て, not 来って.'],
      ['来なければよかったです、一緒に。', '\"不该一起来的\"，太伤人。', '\"We shouldn\'t have come together\" — hurtful.']),
     joke('「深雪小姐，你刚才合掌那么久，许的愿很具体吧。」', '"You prayed so long — a very specific wish?"', '追问', 'Prod',
      ['tease', '具体的よ。年齢、身長、名前まで。……ふふ、冗談。……半分くらいね。', '很具体哦。年龄、身高，连名字都有。……呵呵，开玩笑的。……一半左右。', 'Very. Age, height, even the name. ...Hehe, kidding. ...About half.']),
     act('也掬一捧井水，跟她的手靠在一起', 'Cup some well water too, hands beside hers', '两个人的倒影', 'Two reflections',
      ['happy', '……二人、映ってるわね。……このお水、飲んだら、この景色、忘れなさそう。', '……映着两个人呢。……喝了这水的话，大概就忘不了这个画面了。', '...We\'re both reflected. ...If I drank this, I don\'t think I\'d ever forget this.'])]
  ),
  sora: D(
    ['空参拜的时候特别认真，拍手拍得掌心都红了。你问她许了什么，她毫不犹豫地说：\"大会で優勝！\"', 'Sora prays with total focus, clapping until her palms go red. Her wish? Without hesitation: \"Win the tournament!\"'],
    ['然后她去买了一个\"必胜\"的御守，又站在御守架前犹豫，拿起一个\"恋愛成就\"的，看了两秒，放回去了。', 'She buys a \"certain victory\" charm, then hesitates at the rack, picks up a \"love fulfilled\" one, looks at it two seconds, and puts it back.'],
    ['她转身，发现你看见了，脸一下子涨红：\"……見んかったことにせえ\"。', 'She turns, sees you saw, and goes red: \"...You didn\'t see that.\"'],
    [say('必勝のお守り、こっちも同じのにする。', '必胜御守，我也买一样的。', 'I\'ll get the same victory charm.', '和她一样', 'Match her',
      ['happy', 'お、おそろいか！　……ほな、お前もなんか勝たなあかんな。……ウチに、とか。', '哦，一样的啊！……那你也得赢点什么了。……比如赢我。', 'M-matching! ...Then you have to win something too. ...Like, me.'],
      ['必勝のお守り、こっちも同じのにさせる。', '使役「させる」多余，变成\"让（谁）买\"。', 'させる adds a needless causative.'],
      ['必勝のお守りなんて、意味ないよ。', '\"御守没用\"，她会很受伤。', '\"Charms are pointless\" — she\'d be hurt.']),
     joke('「那个恋爱御守，你拿起来又放下了哦。」', '"That love charm — you picked it up and put it back."', '戳破', 'Call it out',
      ['angry', 'み、見んかったことにせえって言うたやろ！　……ちょっと、色が綺麗やっただけや！', '我、我不是说了当没看见吗！……只是颜色好看而已！', 'I-I said you didn\'t see it! ...It was just a nice colour!']),
     act('悄悄买下那个恋爱御守，塞进她的运动包', 'Quietly buy the love charm and tuck it into her sports bag', '不说破', 'Without a word',
      ['shy', '……あとで、カバンの中で見つけたら、どんな顔したらええねん。……お前のせいやで。', '……等我在包里发现了，该摆什么表情啊。……都怪你。', '...When I find it in my bag later, what face am I supposed to make? ...Your fault.'])]
  ),
  nao: D(
    ['奈绪参拜的时候，你站在她旁边。她拍手的声音很轻，像怕吵醒神明。许完愿，她还闭着眼睛，嘴唇动了好几下，像在补充。', 'You stand beside Nao as she prays. Her clap is soft, as if not to wake the gods. Afterwards her eyes stay closed, lips moving, as if adding a postscript.'],
    ['她抽了一支签，是\"凶\"。她看着签文，没什么表情，然后拿出小本子写了一行字，给你看：\"あんたが いるから だいじょうぶ\"。', 'She draws a fortune: \"Bad luck.\" Expressionless, she writes in her notebook and shows you: \"it\'s fine because you\'re here.\"'],
    ['她把凶签系在了树上，系得很认真，打了两个结。', 'She ties the bad fortune to the tree carefully, with a double knot.'],
    [say('凶でも、そばにいるから、大丈夫だよ。', '就算是凶，我在你身边，没事的。', 'Even with bad luck, I\'m by your side. It\'s okay.', '回应她的那行字', 'Answer her note',
      ['shy', '……おなじこと、かいたのに。……くちで いわれると、ずるい。……ありがと。', '……我写的是一样的话。……被你说出口，太狡猾了。……谢谢。', '...I wrote the same thing. ...Hearing you say it out loud is unfair. ...Thanks.'],
      ['凶でも、そばにいさせるから、大丈夫だよ。', '使役「いさせる」是\"让（别人）在\"，不对。', 'いさせる means \"make someone stay\".'],
      ['凶なら、もう帰ったほうがいいよ。', '\"凶的话还是回去吧\"，等于嫌弃她的运气。', '\"With bad luck you\'d better go home\" — dismissive.']),
     joke('「你刚才嘴唇动了好久，是在跟神明讨价还价吗？」', '"Your lips kept moving — haggling with the gods?"', '逗她', 'Tease',
      ['pout', '……ちゅうもん、ふやしてた。……かみさま、おおすぎるって おこってるかも。', '……在追加订单。……神明可能会生气说太多了。', '...Adding to the order. ...The gods might be mad it\'s too much.']),
     act('在她系的签旁边，系上你自己的大吉签', 'Tie your own Great Luck fortune right beside her bad one', '抵消', 'Cancel it out',
      ['happy', '……だいきち と きょう、となりどうし。……たして、ちゅうきち。……ふたりなら、ちょうどいい。', '……大吉和凶，挨在一起。……加起来，中吉。……两个人的话，刚刚好。', '...Great Luck and Bad Luck, side by side. ...Add them up: Middling Luck. ...Just right, for two.'])]
  ),
  maki: D(
    ['真希说神社是游戏里的\"セーブポイント\"，进来要先存档。她拍手的姿势像在按手柄的按钮，拍完还要做个\"ピロン\"的音效。', 'Maki calls shrines save points — you save on entry. She claps like pressing controller buttons, then adds a \"ping!\" sound effect.'],
    ['她在绘马上画了一个像素风格的小人，旁边写着\"コミケ当選\"。然后她又在角落里写了一行小字，写完马上用手挡住。', 'On her ema she draws a pixel-art figure and writes \"win the convention lottery.\" Then she adds a tiny line in the corner and covers it immediately.'],
    ['你问她角落写了什么，她说\"隠し要素や\"。', 'What\'s in the corner? \"Hidden content.\"'],
    [say('隠し要素、いつか解放してね。', '隐藏要素，总有一天要解锁给我看哦。', 'Unlock the hidden content for me someday.', '用她的话', 'In her language',
      ['shy', '……解放条件、きびしいで。……好感度、MAXにせなあかん。……今、九割くらいやけど。', '……解锁条件很严格哦。……好感度得满。……现在大概九成吧。', '...Harsh unlock conditions. ...Affection has to be maxed. ...It\'s at about ninety percent now.'],
      ['隠し要素、いつか解放されてね。', '被动「解放されて」是\"你被解放吧\"，意思跑偏了。', 'Passive 解放されて means \"get set free\" — off target.'],
      ['隠し要素なんて、興味ないよ。', '\"不感兴趣\"，她会把绘马翻过去。', '\"Not interested\" — she\'d flip the plaque.']),
     joke('「在神社存档的话，读档会回到哪里？」', '"If you save at a shrine, where do you reload?"', '接梗', 'Play along',
      ['tease', 'ここや。……せんぱいと神社に来た、今日のこの瞬間。……何回でもロードしたるわ。', '这里。……和前辈一起来神社的，今天的这一刻。……读多少次档都行。', 'Here. ...Today, this moment, at the shrine with you. ...I\'d reload it any number of times.']),
     act('在她的绘马旁边，也画一个像素小人', 'Draw a pixel-art figure beside hers on your own ema', '组队', 'Party up',
      ['happy', '……下手くそ。……でも、パーティー組めたな。二人パーティー。……解散せえへんで。', '……画得好烂。……不过，组成队伍了呢。两人小队。……不会解散的哦。', '...Terrible. ...But we formed a party. A party of two. ...We\'re not disbanding.'])]
  )
};
