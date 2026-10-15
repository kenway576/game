import { D, say, joke, act } from './kit';

// 生田神社的夏祭
export const SUMMER_FESTIVAL = {
  asuka: D(
    ['明日香穿着深蓝色的浴衣，说是\"母に無理やり着せられた\"。可是她的发型是自己盘的，盘得一丝不苟，还插了一支小小的发簪。', 'Asuka wears a navy yukata — \"my mother forced me into it.\" Yet her hair is up, done herself, immaculate, with a small hairpin.'],
    ['在捞金鱼的摊子前，她蹲下来，盯着纸网看了很久，计算角度。纸网第一下就破了。她看着破了的纸网，表情像考试考砸了。', 'At the goldfish scooping stall she crouches and calculates angles at length. The paper net tears on the first try. Her face is that of someone who\'s just failed an exam.'],
    ['摊主大叔笑着送了她一条金鱼。她捧着那个小塑料袋，小声说\"……負けたのに\"。', 'The stall owner laughs and gives her a fish anyway. Holding the little bag she murmurs: \"...even though I lost.\"'],
    [say('その簪、すごく似合ってる。', '那支发簪，特别适合你。', 'That hairpin really suits you.', '注意到细节', 'Notice the detail',
      ['shy', '……き、気づいたの。……母に着せられたって、言ったでしょ。……簪は、自分で選んだけど。', '……你、你注意到了。……我不是说了是妈妈给我穿的嘛。……发簪是我自己选的。', '...Y-you noticed. ...I said my mother dressed me. ...The hairpin, I chose myself.'],
      ['その簪、すごく似合わせてる。', '「似合わせる」不是自然的说法，用「似合ってる」。', '似合わせる isn\'t natural; use 似合ってる.'],
      ['その簪、ちょっと地味だね。', '\"有点土\"，她会把发簪拔下来。', '\"A bit plain\" — she\'d pull it out.']),
     joke('「捞金鱼还要算角度，你这是物理考试吗。」', '"Calculating angles for goldfish scooping — is this a physics exam?"', '吐槽', 'Snark',
      ['angry', '理論は正しかったのよ！　……紙が、理論に追いついてなかっただけ。', '理论是对的！……只是纸没跟上理论而已。', 'The theory was correct! ...The paper just couldn\'t keep up.']),
     act('换你来捞一次，捞到了就送给她', 'Have a go yourself and give her what you catch', '帮她报仇', 'Avenge her',
      ['happy', '……二匹目。……ふふ、これで、一匹ずつね。あなたの分と、私の分。……同じ水槽で、飼うから。', '……第二条。……呵呵，这样一人一条了。你的和我的。……养在同一个鱼缸里。', '...A second one. ...Hehe, now there\'s one each. Yours and mine. ...They\'ll share a tank.'])]
  ),
  hikari: D(
    ['光穿着红色的浴衣，手里已经拿着苹果糖、刨冰和一个面具，还在往下一个摊子冲。她说她要\"全屋台制覇\"。', 'Hikari, in a red yukata, is already holding a candy apple, shaved ice and a mask, and still charging to the next stall. Her goal: conquer every stall.'],
    ['她在打靶的摊子前停下，瞄了很久，打中了一个很大的熊。她抱着那只比她上身还大的熊，转过来，满脸得意。', 'At the shooting gallery she aims a long time and wins a huge bear. Hugging it — bigger than her torso — she turns, beaming.'],
    ['熊太大了，她看不见前面的路。她把熊举起来，从熊的旁边探出头看你。', 'The bear\'s so big she can\'t see ahead. She hoists it and peeks out at you from behind it.'],
    [say('浴衣の光ちゃん、いつもと違って、どきっとした。', '穿浴衣的你，跟平时不一样，心跳了一下。', 'You in a yukata — different from usual. My heart skipped.', '老实说', 'Be honest',
      ['shy', '……え。……あ、あかん、熊で顔隠す。……{name}くんのせいで、りんご飴より顔赤なってるわ。', '……诶。……不、不行，用熊挡住脸。……都怪你，脸比苹果糖还红了。', '...Eh. ...N-no, hiding behind the bear. ...Thanks to you my face is redder than the candy apple.'],
      ['浴衣の光ちゃん、いつもと違うって、どきっとさせた。', '使役「させた」是\"让（别人）心跳\"，主语变了。', 'させた — \"made someone\'s heart skip\" — wrong subject.'],
      ['浴衣の光ちゃん、いつもと同じで、別に何も。', '\"跟平时一样，没什么\"，她白打扮了。', '\"Same as always, nothing special\" — her effort wasted.']),
     joke('「全屋台制霸，钱包还好吗？」', '"Conquering every stall — how\'s the wallet?"', '担心', 'Worry',
      ['tease', '……瀕死や。……{name}くん、りんご飴、半分あげるから、焼きそば、おごって？', '……濒死了。……苹果糖分你一半，炒面请我吃？', '...On its last legs. ...I\'ll give you half my candy apple — buy me yakisoba?']),
     act('帮她抱着熊，空出她的手', 'Carry the bear for her, freeing her hands', '照顾她', 'Help out',
      ['happy', 'ありがと！　……手、空いたな。……じゃ、じゃあ、空いた手、どうしよ。……{name}くんと、つなぐ？', '谢谢！……手空出来了。……那、那空出来的手怎么办。……跟你牵着？', 'Thanks! ...My hands are free. ...S-so what do I do with them. ...Hold yours?'])]
  ),
  rei: D(
    ['铃穿着白底蓝花的浴衣，走得很小心，木屐踩在石板上，一步一响。她说她第一次穿浴衣，\"歩行効率が著しく低下しています\"。', 'Rei wears a white yukata with blue flowers, stepping carefully; her geta clack on every stone. First time in a yukata: \"Walking efficiency is significantly reduced.\"'],
    ['人很多。她被挤了一下，差点摔倒，你扶住了她。她站稳以后，没有松开你的袖子。', 'It\'s crowded. Someone jostles her and she nearly falls; you catch her. Steady again, she doesn\'t let go of your sleeve.'],
    ['烟花开始了。她仰着头，嘴唇动着，好像在数什么。', 'Fireworks begin. Face upturned, her lips move, as if counting.'],
    [say('何を数えてるの？', '你在数什么？', 'What are you counting?', '好奇', 'Curious',
      ['shy', '……花火と花火の間隔です。……平均、四・二秒。……その間、あなたの顔を見ていました。……だから、数え間違えました。', '……烟花和烟花之间的间隔。……平均四点二秒。……那期间，我在看你的脸。……所以数错了。', '...The interval between fireworks. ...Average 4.2 seconds. ...In between, I was looking at your face. ...So I lost count.'],
      ['何を数えられてるの？', '被动「数えられてる」是\"被数\"，意思不对。', '数えられてる means \"being counted\".'],
      ['何も数えてないよね。', '\"你什么都没数吧\"，否定她。', '\"You\'re not counting anything\" — dismissive.']),
     joke('「步行效率下降——要不要我背你？」', '"Walking efficiency down — want a piggyback?"', '逗她', 'Tease',
      ['pout', '……それは、効率は上がりますが、別の問題が発生します。……主に、心拍数の。', '……那样效率是会提升，但会产生别的问题。……主要是心率方面的。', '...That would raise efficiency, but create another problem. ...Mainly with my heart rate.']),
     act('把袖子换成手，让她握着', 'Swap your sleeve for your hand, so she can hold it', '更稳一点', 'More secure',
      ['happy', '……袖より、手のほうが、安定します。……物理的にも、そうでなくても。', '……比起袖子，手更稳。……物理上是，物理以外也是。', '...A hand is more stable than a sleeve. ...Physically, and otherwise.'])]
  ),
  inari: D(
    ['稻荷说夏祭是\"神々の宴\"，她作为神明，理应受到款待。她穿着金色的浴衣，尾巴在身后左右摇，每个摊子的大叔都忍不住多看一眼。', 'Inari declares the festival a banquet of the gods, at which she should be honoured. In a golden yukata, tails swaying, every stall-keeper does a double take.'],
    ['她在每个摊子前都要停下来，问\"これは、供物か？\"，然后不付钱就伸手。你在后面一路付钱，钱包越来越瘪。', 'At each stall she asks \"Is this an offering?\" and reaches out without paying. You follow behind, paying, wallet thinning.'],
    ['最后她捧着一盒章鱼烧，坐在神社的石阶上，满足地叹了口气。', 'Finally she sits on the shrine steps with a box of takoyaki and sighs contentedly.'],
    [say('稲荷様が楽しそうで、よかったです。', '稻荷大人看起来很开心，太好了。', 'I\'m glad you\'re enjoying yourself.', '不提钱的事', 'Don\'t mention the money',
      ['shy', '……そなた、ずっと払っておったな。……知っておる。……礼に、一つ、やろう。……はい、あーん。', '……你一直在付钱吧。……我知道。……作为谢礼，给你一个。……来，啊——', '...You\'ve been paying all along. ...I know. ...As thanks, have one. ...Here, say \"ah\".'],
      ['稲荷様が楽しいそうで、よかったです。', '\"看起来……\"的「そう」接词干：「楽しそう」。', 'Appearance そう attaches to the stem: 楽しそう.'],
      ['稲荷様のせいで、財布が空です。', '\"都怪你，钱包空了\"，扫兴。', '\"Thanks to you my wallet\'s empty\" — killjoy.']),
     joke('「神明的宴会，是由人类买单的吗？」', '"So humans foot the bill at the gods\' banquet?"', '吐槽', 'Snark',
      ['angry', 'う、うむ……それが、古来の習わしじゃ。……そなたの奉納、ちゃんと覚えておくからの。', '嗯、嗯……这是自古以来的习俗。……你的供奉，我会好好记住的。', 'Y-yes... that is the ancient custom. ...I shall remember your offerings, I promise.']),
     act('陪她在石阶上坐着，一起等烟花', 'Sit with her on the steps and wait for the fireworks', '安静地', 'Quietly',
      ['happy', '……空に咲く花か。……千年見てきたが、隣に誰かおるのは、初めてじゃ。', '……在天上开的花吗。……看了千年，旁边有人陪着，还是第一次。', '...Flowers that bloom in the sky. ...A thousand years watching them, and the first time with someone beside me.'])]
  ),
  miyuki: D(
    ['深雪穿着一件淡紫色的浴衣，头发盘起来，露出脖子。她说这件浴衣是她二十岁时买的，\"まだ着られてよかったわ\"。', 'Miyuki wears a pale-lilac yukata, hair up, neck bare. She bought it at twenty — \"I\'m glad it still fits.\"'],
    ['她在卖面具的摊子前停下，拿起一个狐狸面具戴上，转过来问你\"誰でしょう？\"。面具下面露出她带笑的嘴角。', 'At the mask stall she puts on a fox mask and turns: \"Guess who?\" Beneath it, the corner of her smiling mouth shows.'],
    ['烟花升起来的时候，她把面具推到头顶，看着天空。', 'When the fireworks rise she pushes the mask up onto her head and watches the sky.'],
    [say('二十歳の深雪さんより、今の深雪さんのほうが似合ってると思います。', '比起二十岁的深雪小姐，我觉得现在的你更适合这件。', 'I think it suits you now better than at twenty.', '真心话', 'Sincere',
      ['shy', '……もう。……そんなこと、見てもいないのに。……でも、信じちゃうわ。あなたが言うなら。', '……真是的。……明明没见过。……不过，我会信的。既然是你说的。', '...Honestly. ...You never even saw me then. ...But I\'ll believe it. Since it\'s you.'],
      ['二十歳の深雪さんより、今の深雪さんのほうが似合わせてると思います。', '「似合わせる」不自然，就用「似合ってる」。', '似合わせる isn\'t natural; use 似合ってる.'],
      ['二十歳の頃のほうが、きっと似合ってたと思います。', '\"二十岁时肯定更合适\"，等于说她老了。', '\"It must have suited you better at twenty\" — calling her old.']),
     joke('「狐狸面具……是在模仿稻荷吗？」', '"A fox mask — impersonating Inari?"', '打趣', 'Tease',
      ['tease', 'ふふ、ばれた？　……お姉さんも、あなたを化かしちゃおうかしら。……もう、化かされてる？', '呵呵，被发现了？……姐姐也要迷惑你一下吗。……已经被迷住了？', 'Hehe, caught? ...Shall big sister bewitch you too? ...Or are you already?']),
     act('买一个一样的狐狸面具，也戴上', 'Buy a matching fox mask and put it on', '跟她一样', 'Match her',
      ['happy', 'ふふっ、狐が二匹ね。……今夜だけ、人間じゃないことにしましょうか。……そしたら、何でも言えるわ。', '呵呵，两只狐狸呢。……今晚就当不是人类吧。……那样的话，什么都能说了。', 'Hehe, two foxes. ...Let\'s not be human, just for tonight. ...Then I could say anything.'])]
  ),
  sora: D(
    ['空穿着浴衣，走路的步子还是很大，木屐踩得啪啪响。她说浴衣\"走りにくい\"，三次想把下摆撩起来，三次被你拦住了。', 'Sora strides in her yukata, geta clacking. \"Hard to run in.\" Three times she tries to hitch up the hem; three times you stop her.'],
    ['在套圈的摊子前，她一出手就套中了最远的那个瓶子。周围的人鼓掌，她不好意思地挠头，说\"……投てきは、得意やねん\"。', 'At the ring toss she lands the farthest bottle on her first throw. People applaud; she scratches her head: \"...Throwing\'s my thing.\"'],
    ['烟花开始前，她拉着你，往人少的地方跑——木屐还是很吵。', 'Before the fireworks she drags you toward a quieter spot — geta still clattering.'],
    [say('浴衣でも、空は空だね。', '就算穿着浴衣，空还是空呢。', 'Yukata or not, you\'re still you.', '喜欢原本的她', 'Like her as she is',
      ['happy', '……なんや、それ。褒めてんの？　……まあ、ええわ。お前にそう言われるの、悪い気せえへん。', '……什么啊。是在夸我吗？……算了。被你这么说，感觉不坏。', '...What\'s that supposed to mean. A compliment? ...Whatever. I don\'t mind hearing it from you.'],
      ['浴衣でも、空は空ですだね。', '「ですだね」重复了，用「空だね」或「空ですね」。', 'ですだね doubles up; use だね or ですね.'],
      ['浴衣だと、空らしくないね。', '\"穿浴衣不像你\"，她会把浴衣撩起来就跑。', '\"Doesn\'t look like you in a yukata\" — she\'d hitch it up and run.']),
     joke('「你撩了三次下摆，是想在祭典上跑百米吗。」', '"Three attempts to hitch your hem — planning a hundred-metre dash?"', '吐槽', 'Snark',
      ['tease', '……ちょっとな。……浴衣で百メートル、何秒で走れるか、気になってん。', '……有一点。……想知道穿着浴衣跑一百米要几秒。', '...A bit. ...I wanted to know how fast I could do a hundred in a yukata.']),
     act('到了人少的地方，帮她把散开的衣带重新系好', 'In the quiet spot, retie her loosened obi', '细心', 'Attentive',
      ['shy', '……あ、ほどけとった？　……走りすぎたわ。……お前、帯の結び方、なんで知っとんねん。……ありがと。', '……啊，散了吗？……跑太多了。……你怎么知道腰带怎么系的。……谢谢。', '...Oh, it came loose? ...Ran too much. ...How do you even know how to tie an obi. ...Thanks.'])]
  ),
  nao: D(
    ['奈绪穿着一件淡粉色的浴衣，是她妈妈的旧衣服改的。她走得很慢，一只手一直抓着你的衣角，怕在人群里走散。', 'Nao wears a pale-pink yukata altered from her mother\'s. She walks slowly, one hand clutching your hem so she won\'t get lost in the crowd.'],
    ['她在卖棉花糖的摊子前停下，看了很久，没说要。你买了一个给她，她抱着棉花糖，小口小口地咬，脸几乎埋在糖里。', 'She stops at the cotton-candy stall, looks a long time, doesn\'t ask. You buy her one; she nibbles at it, face almost buried in the sugar.'],
    ['烟花开始了。她抬头看，棉花糖粘在了鼻尖上。', 'The fireworks start. She looks up, a wisp of cotton candy stuck to her nose.'],
    [say('鼻に、わたあめついてるよ。', '鼻子上，粘了棉花糖哦。', 'You\'ve got cotton candy on your nose.', '告诉她', 'Tell her',
      ['shy', '……え。……とって。……てが、ふさがってるから。……はやく。はなび、おわっちゃう。', '……诶。……帮我拿掉。……手腾不出来。……快点。烟花要放完了。', '...Huh. ...Take it off. ...My hands are full. ...Quick. The fireworks will end.'],
      ['鼻に、わたあめつけてるよ。', '「つけてる」是\"（故意）粘上去\"，像是她自己干的。', 'つけてる implies she put it there on purpose.'],
      ['鼻に、何もついてないよ。', '\"什么都没粘\"——你在骗她，结果她带着棉花糖看了一晚上烟花。', '\"Nothing on your nose\" — a lie; she watches all night like that.']),
     joke('「妈妈的浴衣，穿着有点大吧？」', '"Your mum\'s yukata — a bit big?"', '关心', 'Ask gently',
      ['pout', '……ちょっと。……でも、これ、おかあさんが {name} と いくなら きなさいって。……おかあさん、なにか しってる。', '……有一点。……不过，妈妈说要跟你去的话就穿这件。……妈妈好像知道什么。', '...A bit. ...But Mum said to wear it if I was going with you. ...Mum knows something.']),
     act('把衣角换成手，让她牵着', 'Swap your hem for your hand for her to hold', '这样不会走散', 'So she won\'t get lost',
      ['happy', '……てのほうが、まいごに ならない。……ずっと、こうしてれば よかった。', '……牵手的话，不会走丢。……早就应该这样了。', '...With hands, I won\'t get lost. ...We should have done this all along.'])]
  ),
  maki: D(
    ['真希没穿浴衣，穿着她平时的连帽衫，说浴衣\"コスプレみたいで恥ずい\"。可是她头上戴着一个在摊子上买的猫耳发箍，自己好像没意识到。', 'Maki skips the yukata for her usual hoodie — a yukata would feel like cosplay. But she\'s wearing cat ears from a stall and doesn\'t seem to realize it.'],
    ['她在射击游戏的摊子前大杀四方，几乎把奖品架打空了。摊主大叔求她手下留情，她把一半的奖品分给了旁边哭着的小孩。', 'She dominates the shooting gallery, nearly clearing the prize shelf. When the owner begs for mercy, she gives half her haul to a crying kid nearby.'],
    ['她抱着剩下的奖品，站在你旁边，假装若无其事。', 'Holding the rest, she stands beside you, acting like nothing happened.'],
    [say('子供に分けてあげるの、かっこよかったよ。', '分给小孩子的样子，好帅。', 'Sharing with that kid was really cool.', '夸她', 'Praise her',
      ['shy', '……み、見とったんか。……別に。荷物多すぎて、持たれへんかっただけや。……せんぱいの分は、残してあるで。', '……看、看见了啊。……没什么。只是东西太多拿不了而已。……前辈的那份，留着呢。', '...Y-you saw. ...It\'s nothing. Too much to carry, that\'s all. ...I saved yours.'],
      ['子供に分けてくれるの、かっこよかったよ。', '「てくれる」是\"给我\"，分给小孩要用「てあげる」。', 'てくれる is toward you; for the kid, てあげる.'],
      ['子供にあげるなんて、もったいないよ。', '\"给小孩太浪费了\"，显得小气。', '\"Wasteful to give it to a kid\" — petty.']),
     joke('「你头上的猫耳，是在cosplay吧？」', '"Those cat ears on your head — that\'s cosplay, isn\'t it?"', '提醒', 'Point it out',
      ['angry', 'え、なに……！？　……ちょ、いつから……！　……もうええわ、今日はこれで通す！　にゃー！', '诶，什么……！？……喂，从什么时候……！……算了，今天就这样了！喵——！', 'Eh, what...!? ...Hey, since when...! ...Forget it, I\'m rolling with it! Meow!']),
     act('在她猫耳旁边，也戴上一对狗耳', 'Put on a pair of dog ears to match her cat ears', '一起出糗', 'Embarrass yourself too',
      ['happy', 'ぶはっ、犬と猫や！　……ペア装備やな、これ。……写真、撮っとこ。消さへんで。', '噗，狗和猫！……这是情侣装备吧。……拍张照。不会删的哦。', 'Pfft, a dog and a cat! ...That\'s a pair set. ...Taking a photo. Not deleting it.'])]
  )
};
