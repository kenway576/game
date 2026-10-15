import { D, say, joke, act } from './kit';

// 王子动物园和摩天轮
export const ZOO = {
  asuka: D(
    ['明日香在熊猫馆前排了二十分钟的队，一直在说\"並ぶのは非効率\"。轮到她的时候，熊猫正好翻了个身，她\"あっ\"了一声，声音比平时高了八度。', 'Asuka queues twenty minutes for the panda, complaining that queuing is inefficient. When it\'s her turn the panda rolls over and she squeaks, an octave higher than usual.'],
    ['出来以后她假装若无其事，可是在纪念品店里，她拿着一个熊猫钥匙扣站了很久，最后放回去了，说\"子供っぽい\"。', 'Outside she acts like nothing happened, but in the gift shop she holds a panda keychain for ages, then puts it back. \"Too childish.\"'],
    ['摩天轮升到最高处的时候，她看着窗外，钥匙扣的事好像还在想。', 'At the top of the Ferris wheel she looks out the window, still thinking about that keychain, it seems.'],
    [say('さっきの声、かわいかったよ。', '刚才那一声，很可爱。', 'That squeak just now was cute.', '说出来', 'Say it',
      ['shy', '……き、聞こえてたの！？　……忘れなさい。今すぐ。……命令よ。……でも、ちょっとだけなら、覚えてていい。', '……听、听见了！？……忘掉。马上。……这是命令。……不过，稍微记住一点也行。', '...Y-you heard?! ...Forget it. Now. ...That\'s an order. ...Well, you can remember a little.'],
      ['さっきの声、かわいいかったよ。', '形容词过去形是「かわいかった」，不是「かわいいかった」。', 'Past of かわいい is かわいかった.'],
      ['さっきの声、うるさかったよ。', '\"刚才吵死了\"，她会想跳下摩天轮。', '\"You were loud\" — she\'d want to jump out.']),
     joke('「班长，熊猫翻身的时候你比熊猫还激动。」', '"You got more excited than the panda did."', '打趣', 'Tease',
      ['angry', 'こ、興奮してないわよ！　……観察よ。生物の観察。……レポートにするんだから。', '我、我才没激动！……是观察。生物观察。……要写成报告的。', 'I-I was NOT excited! ...Observation. Biological observation. ...It\'s for a report.']),
     act('从口袋里拿出那个熊猫钥匙扣——你刚才偷偷买的', 'Pull out the panda keychain — you bought it on the sly', '送她', 'Give it to her',
      ['shy', '……いつの間に。……子供っぽいって、言ったのに。……か、鞄の内側に付けるわ。見えないところに。', '……什么时候买的。……我都说幼稚了。……我、我挂在包里面。看不见的地方。', '...When did you... ...I said it was childish. ...I\'ll put it inside my bag. Where nobody sees.'])]
  ),
  hikari: D(
    ['光在每个笼子前面都要停下来，给动物配音。长颈鹿是\"首、こったわー\"，河马是\"もう動きたない\"，企鹅是\"整列！\"。路过的小孩跟着她走了半圈。', 'Hikari stops at every enclosure to dub the animals. Giraffe: \"Stiff neck, man.\" Hippo: \"Can\'t move.\" Penguins: \"Line up!\" A kid follows her for half the zoo.'],
    ['那个小孩的妈妈来领人，跟光道谢。光笑着挥手，说\"また来てなー\"，好像她是这里的员工。', 'The kid\'s mother comes to collect him and thanks Hikari, who waves him off — \"Come again!\" — as if she worked here.'],
    ['摩天轮上，她终于安静了，把脸贴在玻璃上。', 'On the Ferris wheel she finally goes quiet, face pressed to the glass.'],
    [say('光ちゃんは、子供に好かれるね。', '小孩子都喜欢你呢。', 'Kids really like you.', '说你看到的', 'Say what you saw',
      ['happy', 'えへへ、精神年齢が近いからかな！　……{name}くんは？　{name}くんにも、好かれてる？', '嘿嘿，大概是精神年龄相近吧！……那你呢？你也喜欢我吗？', 'Hehe, similar mental age, maybe! ...And you? Do you like me too?'],
      ['光ちゃんは、子供が好かれるね。', '\"被谁喜欢\"的\"谁\"要用「に」：「子供に好かれる」。', 'The agent of passive takes に: 子供に好かれる.'],
      ['光ちゃんは、子供に嫌われるね。', '\"小孩讨厌你\"，事实正相反。', '\"Kids hate you\" — the opposite of what happened.']),
     joke('「你给企鹅配的『整列！』，是在模仿明日香吧。」', '"Your penguin \'Line up!\' — that was Asuka, wasn\'t it."', '揭穿', 'Call it out',
      ['tease', 'バレた！？　……本人には内緒やで。……あ、でも似てたやろ？', '被发现了！？……别告诉她本人哦。……啊，不过很像吧？', 'You noticed?! ...Don\'t tell her. ...But it was spot-on, right?']),
     act('也把脸贴到玻璃上，挨着她', 'Press your face to the glass too, right beside her', '一起看', 'Look together',
      ['shy', '……近っ。……あ、ガラスに、二人の顔、映ってる。……なんか、カップルみたいやな。……みたい、やで。', '……好近。……啊，玻璃上，映出两个人的脸了。……感觉像情侣一样呢。……只是「像」哦。', '...Close. ...Oh, our faces are reflected in the glass. ...Kind of like a couple. ...LIKE one.'])]
  ),
  rei: D(
    ['铃在每块动物说明牌前都会停下来，从头读到尾，然后告诉你牌子上哪里写得不准确。读到考拉那块，她说\"一日二十時間寝る\"是对的，然后小声说\"羨ましい\"。', 'Rei reads every sign in full and points out each inaccuracy. At the koala\'s — \"sleeps twenty hours a day\" — she confirms it, then murmurs \"I\'m jealous.\"'],
    ['她在夜行动物馆里待了很久。黑暗里，她的声音比平时放松：\"ここは、見られている気がしないので、好きです。\"', 'She lingers in the nocturnal house. In the dark her voice relaxes: \"Here I don\'t feel watched. I like it.\"'],
    ['摩天轮上，她看着远处的海，问你：\"高いところと暗いところ、どちらが好きですか。\"', 'On the Ferris wheel she gazes at the distant sea and asks whether you prefer high places or dark ones.'],
    [say('鈴と一緒なら、どっちでも好き。', '和铃在一起的话，哪里都喜欢。', 'With you, I like either.', '老实回答', 'Answer honestly',
      ['shy', '……その答えは、選択肢にありませんでした。……でも、正解にしておきます。', '……这个答案，不在选项里。……不过，就算你答对吧。', '...That answer wasn\'t one of the options. ...But I\'ll mark it correct.'],
      ['鈴と一緒なら、どっちでも好かれる。', '「好かれる」是\"被喜欢\"，主语变了。', '好かれる means \"be liked\".'],
      ['鈴と一緒でも、どっちも嫌い。', '\"跟你在一起也都讨厌\"，太冷了。', '\"Even with you I hate both\" — cold.']),
     joke('「羡慕考拉睡二十小时？你昨天几点睡的。」', '"Jealous of koalas? What time did you sleep last night?"', '追问', 'Ask',
      ['pout', '……三時です。……星の観測が、長引いたので。……説教は、受け付けません。', '……三点。……因为观星拖久了。……不接受说教。', '...Three. ...Stargazing ran late. ...No lectures accepted.']),
     act('在夜行动物馆里，轻轻碰一下她的手', 'In the nocturnal house, lightly touch her hand', '黑暗里', 'In the dark',
      ['shy', '……暗いので、見えません。……見えないことに、しておきます。……離さなくて、いいです。', '……太暗了，看不见。……就当作看不见吧。……不用松开。', '...It\'s dark, I can\'t see. ...I\'ll pretend I can\'t. ...You don\'t have to let go.'])]
  ),
  inari: D(
    ['稻荷进了动物园，所有的动物都安静下来，齐刷刷地看着她。她得意地说\"獣は、格の違いがわかるのじゃ\"。只有一只狐狸没理她，背对着她睡觉。', 'When Inari enters the zoo every animal falls silent and turns to look at her. \"Beasts know their betters,\" she says smugly. Only a fox ignores her, sleeping with its back turned.'],
    ['她在狐狸笼前站了很久，轻声说了一些你听不懂的话。那只狐狸终于醒了，走到笼边，看着她。', 'She stands at the fox enclosure a long time, speaking softly in words you don\'t understand. At last the fox wakes, comes to the bars, and looks at her.'],
    ['她转过身来，眼睛有点红，说\"……遠い親戚じゃ\"。', 'She turns back, eyes a little red. \"...A distant relative.\"'],
    [say('寂しかったら、いつでも一緒に来ますよ。', '如果寂寞的话，随时陪你来。', 'If you\'re lonely, I\'ll come with you any time.', '陪着她', 'Be there',
      ['shy', '……寂しくなど、ない。……ないが……そなたが来たいと言うなら、付き合ってやらんでもない。', '……我才不寂寞。……不过……你想来的话，我陪你也不是不行。', '...I am not lonely. ...But... if you wish to come, I suppose I could accompany you.'],
      ['寂しかったら、いつでも一緒に来させますよ。', '使役「来させます」是\"让（别人）来\"，意思偏了。', '来させます means \"I\'ll make someone come\".'],
      ['寂しくても、もう来ませんよ。', '\"就算寂寞也不来了\"，太绝情。', '\"Even if lonely, we won\'t come again\" — heartless.']),
     joke('「别的动物都看你，就它背对你——亲戚果然不给面子。」', '"Everyone stared but the fox turned its back — family never gives you face."', '打趣', 'Tease',
      ['angry', 'ぬ、ぬう……！　……身内ほど遠慮がないものじゃ。……人も狐も、同じじゃな。', '呜、呜……！……越是自家人越不客气。……人和狐狸都一样呢。', 'Gr-grr...! ...Family never stands on ceremony. ...Same for humans and foxes.']),
     act('买一包油豆腐味的零食，放在笼子边上（当然被工作人员拦住了）', 'Buy a fried-tofu snack to leave by the cage (staff stop you, of course)', '替她送礼', 'Bring an offering',
      ['happy', '……ふふ、叱られてしもうたな。……その気持ちだけで、十分じゃ。……そなたは、ほんに、愚かで優しい。', '……呵呵，被骂了呢。……有这份心意就够了。……你真是又傻又温柔。', '...Heh, you got scolded. ...The thought alone is enough. ...You are truly foolish, and kind.'])]
  ),
  miyuki: D(
    ['深雪说她小时候，父亲每年都带她来王子动物园，每次都在同一个地方拍照——大象馆前面。大象已经换了，那块牌子还在。', 'Miyuki says her father brought her here every year as a child and always took a photo in the same spot — in front of the elephant house. The elephant has changed; the sign is still there.'],
    ['她站在那块牌子前，摆出了和小时候照片里一样的姿势：双手比V。然后她自己先笑了，说\"アラサーがやるポーズじゃないわね\"。', 'At the sign she strikes the same pose as in her childhood photo — double peace signs. Then laughs first: \"Not a pose for a woman my age.\"'],
    ['摩天轮上，她把手机里那张老照片翻出来给你看。照片里的小女孩缺了一颗门牙。', 'On the Ferris wheel she shows you the old photo on her phone. The little girl is missing a front tooth.'],
    [say('今日の写真も、ずっと残しましょう。', '今天的照片，也一直留着吧。', 'Let\'s keep today\'s photo forever, too.', '延续这个传统', 'Continue the tradition',
      ['shy', '……あら。……来年も、ここに来てくれるってこと？　……ふふ、期待しちゃうわよ、お姉さん。', '……哎呀。……意思是明年也会陪我来这里？……呵呵，姐姐会期待的哦。', '...Oh. ...So you\'ll come here with me next year too? ...Hehe, big sister\'s going to get her hopes up.'],
      ['今日の写真も、ずっと残させましょう。', '使役「残させましょう」是\"让（别人）留下\"，多余。', '残させましょう adds a needless causative.'],
      ['今日の写真は、すぐ消しましょう。', '\"今天的照片马上删掉吧\"，太扫兴。', '\"Let\'s delete today\'s photo right away\" — deflating.']),
     joke('「照片里的小深雪缺了一颗门牙，好可爱。」', '"Little Miyuki missing a front tooth — adorable."', '逗她', 'Tease',
      ['pout', 'もう、そこ見ないの。……あなたの子供の頃の写真、今度見せなさい。おあいこよ。', '真是的，别看那里。……下次给我看看你小时候的照片。扯平。', 'Hey, don\'t look there. ...Show me your childhood photos next time. Then we\'re even.']),
     act('站到她旁边，也比两个V', 'Stand next to her and flash double peace signs too', '陪她一起傻', 'Be silly with her',
      ['happy', 'ふふっ、二人でやると、恥ずかしくないわね。……すみません、写真、お願いできますか？', '呵呵，两个人一起就不害羞了呢。……不好意思，能帮我们拍张照吗？', 'Hehe, it\'s not embarrassing with two. ...Excuse me, could you take our picture?'])]
  ),
  sora: D(
    ['空在猎豹的笼子前停了很久。猎豹在里面来回踱步，她也在外面跟着来回走，像在比赛。', 'Sora stops at the cheetah enclosure. It paces back and forth; she paces along outside, as if racing it.'],
    ['她说猎豹虽然快，但只能跑几百米就没力气了。\"ウチは、長く走れるほうがええ\"。说完她又看了一眼猎豹，补了一句\"……でも、一回でええから、あの速さで走ってみたい\"。', 'Cheetahs are fast but only last a few hundred metres, she says. \"I\'d rather go the distance.\" Then, glancing back: \"...But just once, I\'d like to run that fast.\"'],
    ['摩天轮上，她一直在找操场——你们学校的操场，从这里能不能看见。', 'On the Ferris wheel she keeps searching for the school track — can you see it from here?'],
    [say('空なら、どっちも手に入れられるよ。', '你的话，两样都能拿到。', 'You could have both.', '鼓励她', 'Encourage her',
      ['shy', '……お前、たまに、ウチより熱いこと言うな。……よっしゃ、目標、二つにしたる。', '……你偶尔会说出比我还热血的话呢。……好，目标改成两个。', '...Sometimes you say stuff even more fired-up than me. ...Right. Two goals, then.'],
      ['空なら、どっちも手に入れさせられるよ。', '使役被动「入れさせられる」是\"被迫拿到\"，太绕了。', 'Causative-passive \"be forced to get\" — tangled.'],
      ['空には、どっちも無理だよ。', '\"你两样都做不到\"，她会把你扔出摩天轮。', '\"You can\'t do either\" — she\'d throw you out.']),
     joke('「你跟猎豹比赛，谁赢了？」', '"You raced the cheetah — who won?"', '吐槽', 'Snark',
      ['tease', '引き分けや。……向こうが手加減してくれたんちゃうかな。……お前も今度、手加減せんとかかってこいよ。', '平局。……可能是它让着我吧。……你下次也别手下留情，放马过来。', 'A draw. ...It probably went easy on me. ...You don\'t go easy on me next time either.']),
     act('指着远处一块绿色的地方：\"那个是操场吧\"', 'Point at a patch of green: \"That\'s the track, isn\'t it?\"', '帮她找', 'Help her look',
      ['happy', 'ほんまや！　……ちっちゃ。……毎日あそこで走っとるんか、ウチ。……ここから見たら、なんか、全部ちっちゃいな。悩みとかも。', '真的！……好小。……我每天就在那里跑啊。……从这里看，什么都好小呢。烦恼什么的也是。', 'It is! ...Tiny. ...I run there every day? ...From up here everything\'s tiny. Worries too.'])]
  ),
  nao: D(
    ['奈绪在兔子的互动区坐下来，一只白兔跳到了她的膝盖上，就不走了。她一动不敢动，用眼神向你求救。', 'Nao sits in the rabbit petting area. A white rabbit hops onto her lap and won\'t leave. She doesn\'t dare move, and pleads with you with her eyes.'],
    ['你走过去，兔子跳到了你膝盖上。她小声说\"……うらぎりもの\"，不知道是说兔子还是说你。', 'You come over and the rabbit hops to YOUR lap. She mutters \"...traitor\" — whether at the rabbit or at you, unclear.'],
    ['摩天轮上，她坐在你对面，小本子摊在膝上，在画刚才那只兔子。画得很像。', 'On the Ferris wheel she sits across from you, notebook on her knees, drawing that rabbit. It\'s a good likeness.'],
    [say('奈緒の絵、もっと見たいな。', '想多看看奈绪的画。', 'I want to see more of your drawings.', '对她的画感兴趣', 'Show interest',
      ['shy', '……ほかのは、だめ。……あんたの かお、たくさん かいてあるから。……あっ。', '……别的不行。……因为画了很多你的脸。……啊。', '...Not the others. ...There are lots of your face in there. ...Oh.'],
      ['奈緒の絵、もっと見せたいな。', '「見せたい」是\"想给（别人）看\"，主客颠倒。', '見せたい means \"I want to show\".'],
      ['奈緒の絵、もう見たくないな。', '\"不想再看了\"，她会把本子藏起来一辈子。', '\"Don\'t want to see any more\" — she\'d hide it forever.']),
     joke('「刚才说『叛徒』，是在说兔子还是我？」', '"\'Traitor\' — the rabbit or me?"', '追问', 'Ask',
      ['pout', '……りょうほう。……うさぎは、あんたのほうが すきだった。……あたしも、……なんでもない。', '……两个都是。……兔子更喜欢你。……我也……没什么。', '...Both. ...The rabbit liked you more. ...I also... never mind.']),
     act('把兔子轻轻地放回她的膝盖上', 'Gently set the rabbit back on her lap', '还给她', 'Give it back',
      ['happy', '……あったかい。……あんたの ひざに いたから、あんたの においが する。……いいにおい。', '……好暖和。……因为在你膝盖上待过，有你的味道。……很好闻。', '...Warm. ...It was on your lap, so it smells like you. ...Nice.'])]
  ),
  maki: D(
    ['真希说她是来\"捕获\"的。她在每个笼子前面都要拍一张照片，说集齐全部动物有隐藏成就。拍到第三十二种，她说还差一种：\"レア枠や\"。', 'Maki says she\'s here to \"catch \'em\". She photographs every enclosure; collect them all for a hidden achievement. At thirty-two species she\'s one short: \"The rare slot.\"'],
    ['你们找了半个动物园，最后发现那只\"稀有\"的是一只躲在树洞里的貘。她蹲在玻璃前等了十分钟，貘终于露出了鼻子。', 'Half the zoo later, the rare one turns out to be a tapir hiding in a hollow. She crouches at the glass for ten minutes until it finally pokes out its nose.'],
    ['她拍到了，跳起来跟你击掌。摩天轮上，她还在看那张模糊的照片。', 'She gets it and jumps up to high-five you. On the Ferris wheel she\'s still staring at the blurry photo.'],
    [say('真希の粘り強さ、すごいね。', '真希的耐心，真厉害。', 'Your persistence is amazing.', '夸她', 'Praise her',
      ['shy', '……ゲーマーやからな。……ほしいもんは、時間かけてでも手に入れる主義や。……な、なんで今それ言うたんやろ、ウチ。', '……因为我是玩家嘛。……想要的东西，花再多时间也要拿到。……我、我干嘛现在说这个。', '...I\'m a gamer. ...What I want, I get, however long it takes. ...Wh-why did I say that now.'],
      ['真希の粘り強いさ、すごいね。', '名词化是「粘り強さ」，去掉「い」再加「さ」。', 'Nominalize as 粘り強さ (drop い, add さ).'],
      ['真希の飽きっぽさ、すごいね。', '\"你三分钟热度真厉害\"，跟事实相反。', '\"Your short attention span is amazing\" — the opposite.']),
     joke('「三十三种动物里，我算第几种？」', '"Among the thirty-three species, which number am I?"', '自荐', 'Volunteer',
      ['tease', 'せんぱいは……隠しボス枠やな。……捕まえるの、一番時間かかるやつ。', '前辈的话……是隐藏Boss。……最花时间才能捕获的那种。', 'Senpai is... the hidden boss. ...The one that takes longest to catch.']),
     act('在摩天轮最高处，给她拍一张照片', 'Take a photo of her at the very top of the wheel', '第三十四种', 'Species thirty-four',
      ['shy', '……ちょ、ウチ撮ってどうすんねん。……図鑑に、載せといて。……せんぱい専用の図鑑な。', '……喂，拍我干嘛。……把我收进图鉴里吧。……前辈专用的图鉴。', '...Hey, why photograph me. ...Put me in the encyclopedia, then. ...Senpai\'s personal one.'])]
  )
};
