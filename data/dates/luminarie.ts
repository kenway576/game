import { D, say, joke, act } from './kit';

// 神户光之祭典
export const LUMINARIE = {
  asuka: D(
    ['明日香在光之回廊的入口停下来，抬头看着那些光拱，好久没有往前走。她说光之祭典是为了纪念地震的遇难者，\"だから、はしゃいじゃいけない気がする\"。', 'At the entrance to the gallery of light Asuka stops, gazing up at the arches. Luminarie remembers the earthquake victims, she says — \"so it feels wrong to get excited.\"'],
    ['走在光的隧道里，她一直很安静。走到尽头的广场，她在募捐箱前停下，从钱包里拿出硬币，认真地投了进去，然后合掌。', 'Through the tunnel of light she stays quiet. In the plaza at the end she stops at the donation box, drops in coins with care, and puts her palms together.'],
    ['她转过身，眼睛有点红：\"……祖母が、あの日、ここにいたの\"。', 'She turns, eyes a little red: \"...My grandmother was here that day.\"'],
    [say('話してくれて、ありがとう。', '谢谢你告诉我。', 'Thank you for telling me.', '只是听', 'Just listen',
      ['shy', '……誰にも、話したことなかったの。……あなたなら、聞いてくれる気がした。……来年も、一緒に来てくれる？', '……我从来没跟任何人说过。……觉得你会听。……明年，也会陪我来吗？', '...I\'ve never told anyone. ...I felt you\'d listen. ...Will you come with me next year too?'],
      ['話してあげて、ありがとう。', '「てあげて」是\"我给你\"，感谢她要说「てくれて」。', 'てあげて faces outward; to thank her, てくれて.'],
      ['昔のことだから、気にしないで。', '\"都是过去的事了，别在意\"——太轻描淡写。', '\"It\'s in the past, don\'t worry\" — too dismissive.']),
     joke('「班长，你今天特别安静。」', '"You\'re very quiet today."', '轻轻地', 'Gently',
      ['neutral', '……そういう日も、あるのよ。……でも、隣にあなたがいるから、寂しくはないわ。', '……也有这样的日子。……不过，因为你在旁边，并不寂寞。', '...Some days are like that. ...But with you beside me, I\'m not lonely.']),
     act('也往募捐箱里投一点钱，跟她一起合掌', 'Drop something in the box too, and join her in prayer', '一起', 'Together',
      ['happy', '……ありがとう。……祖母も、きっと、喜んでるわ。……あなたのこと、紹介したかったな。', '……谢谢。……奶奶一定也很高兴。……真想把你介绍给她。', '...Thank you. ...Grandma would be glad. ...I wish I could have introduced you.'])]
  ),
  hikari: D(
    ['光一走进光的回廊就\"わぁ……\"地停住了，平时那么吵的她，这次一句话都说不出来。她伸出手，好像要接住那些光。', 'Entering the gallery of light, Hikari stops with a \"whoa...\" — loud as she usually is, she\'s speechless. She reaches out as if to catch the light.'],
    ['她说她小时候，妈妈每年都带她来。妈妈说这些光是\"天国の人たちへの手紙\"。', 'Her mother brought her every year as a child, she says. Mum said the lights were \"letters to the people in heaven.\"'],
    ['她转过头，眼睛闪闪的：\"……{name}くんは、誰に手紙送る？\"', 'She turns, eyes shining: \"...Who would you send a letter to?\"'],
    [say('今年の手紙は、光ちゃんへの感謝にする。', '今年的信，写给你，表示感谢。', 'This year\'s letter is a thank-you to you.', '大胆一点', 'Be bold',
      ['shy', '……う、うち？　……うち、生きとるで！　……でも、ありがと。……うちも、{name}くんに、手紙書く。生きとる人に。', '……我、我？……我还活着呢！……不过，谢谢。……我也给你写信。给活着的人。', '...M-me? ...I\'m alive, you know! ...But thanks. ...I\'ll write to you too. To someone living.'],
      ['今年の手紙は、光ちゃんへの感謝にされる。', '被动「される」不通，用「にする」。', 'される doesn\'t fit; use にする.'],
      ['手紙なんて、届くわけないよ。', '\"信怎么可能寄得到\"——这是她妈妈说的话。', '\"Letters can\'t arrive\" — those were her mother\'s words.']),
     joke('「你今天居然这么安静，我还以为你生病了。」', '"You\'re so quiet today — I thought you were sick."', '轻轻逗她', 'A gentle tease',
      ['pout', '……うちだって、静かになるときくらい、あるわ。……きれいすぎて、言葉、出てこうへんねん。', '……我也有安静的时候。……太美了，说不出话来。', '...Even I go quiet sometimes. ...It\'s too beautiful, the words won\'t come.']),
     act('伸出手，跟她一起\"接\"光', 'Reach out with her, as if catching the light together', '一起接住', 'Catch it together',
      ['happy', '……手、光ってる。……二人の手、光で、つながってるみたい。……こうしとこ。ずっと。', '……手在发光。……两个人的手，好像被光连在一起了。……就这样吧。一直。', '...Our hands are glowing. ...Like the light\'s joining them. ...Let\'s stay like this. Always.'])]
  ),
  rei: D(
    ['铃说光之祭典用了大约四十万个灯泡。她在光的回廊里走得很慢，抬头看着光拱的结构，说那是\"イタリアの教会建築を模したもの\"。', 'Rei says Luminarie uses about four hundred thousand bulbs. She walks slowly through the gallery, studying the arches — \"modelled on Italian church architecture.\"'],
    ['走到一半，她不说数字了。她说她查过地震那天的资料，\"六千四百三十四人\"。她念出这个数字的时候，声音很轻。', 'Halfway through she stops giving numbers. She looked up the earthquake data, she says: \"Six thousand, four hundred thirty-four.\" She says the number very softly.'],
    ['她停下来，看着光：\"……数字にすると、一人一人が、見えなくなります\"。', 'She stops, looking at the light: \"...As numbers, you can\'t see each person anymore.\"'],
    [say('だから、この光があるんだと思う。一人一人のために。', '所以才有这些光吧。为了每一个人。', 'That\'s why these lights exist. For each person.', '回应', 'Respond',
      ['shy', '……。……四十万の光と、六千の人。……一人に、六十以上の光。……あなたの答え、正しいです。', '……。……四十万的光，六千个人。……每个人，六十多盏光。……你的答案，是对的。', '.... ...Four hundred thousand lights, six thousand people. ...Over sixty for each. ...Your answer is right.'],
      ['だから、この光があるんだと思わせる。', '使役「思わせる」是\"让（人）觉得\"，主语乱了。', '思わせる means \"makes one think\".'],
      ['数字のほうが、分かりやすいよ。', '\"数字更好懂\"——她刚好说的是反面。', '\"Numbers are easier\" — the opposite of her point.']),
     joke('「四十万个灯泡，你数过吗？」', '"Four hundred thousand bulbs — did you count?"', '轻轻地', 'Gently',
      ['neutral', '……数えていません。……今日は、数えないことにしました。……ただ、見ていたいので。', '……没有数。……今天，决定不数了。……只是想看着。', '...I didn\'t count. ...Today I decided not to. ...I just want to look.']),
     act('站在她旁边，什么都不说，一起看光', 'Stand beside her, say nothing, and look at the lights together', '陪着', 'Be there',
      ['happy', '……ありがとうございます。……何も言わないでくれて。……一番、正しい選択でした。', '……谢谢。……谢谢你什么都没说。……这是最正确的选择。', '...Thank you. ...For saying nothing. ...It was the most correct choice.'])]
  ),
  inari: D(
    ['稻荷走进光的回廊，脚步变得很慢。她说那一天，她在山上，感觉到大地在哭，\"……わらわは、何もできなんだ\"。', 'Inari slows as she enters the gallery of light. That day, she says, she was on the mountain and felt the earth weep. \"...I could do nothing.\"'],
    ['她在光拱下面站了很久，闭着眼睛，低声念着什么。你听不懂，但你知道那是祈祷。', 'She stands long beneath the arches, eyes closed, murmuring. You don\'t understand the words, but you know it\'s a prayer.'],
    ['念完了，她睁开眼睛，眼泪顺着脸颊流下来：\"……人の子は、強いのう。……こんなに、明るく、立ち直った\"。', 'When she finishes she opens her eyes, tears running down: \"...Human children are strong. ...They\'ve risen again, so brightly.\"'],
    [say('稲荷様が祈り続けてくれたから、ですよ。', '是因为稻荷大人一直在祈祷。', 'It\'s because you kept praying for them.', '安慰她', 'Comfort her',
      ['shy', '……。……そなたは、ほんに、優しい嘘をつく。……じゃが、今日は、その嘘に、甘えさせてもらう。', '……。……你真是会说温柔的谎话。……不过，今天就让我依赖一下这个谎话吧。', '.... ...You tell such kind lies. ...But today, let me lean on that lie.'],
      ['稲荷様が祈り続けてあげたから、ですよ。', '「てあげた」是\"给（别人）\"，说她为人们祈祷时，从你的角度要用「てくれた」。', 'From your side, her favour is てくれた, not てあげた.'],
      ['神様でも、できないことはありますよね。', '\"神也有做不到的事\"——在她最内疚的时候说这个。', '\"Even gods have limits\" — when she feels most guilty.']),
     joke('「稻荷大人，你在念什么？」', '"What were you reciting?"', '轻轻地', 'Gently',
      ['neutral', '……古い、鎮魂の祝詞じゃ。……三十年、毎年、ここで唱えておる。……今年は、隣にそなたがおる。', '……古老的镇魂祝词。……三十年来，每年都在这里念。……今年，旁边有你。', '...An old requiem prayer. ...I\'ve recited it here every year for thirty years. ...This year, you\'re beside me.']),
     act('用手帕轻轻擦掉她的眼泪', 'Gently wipe her tears with a handkerchief', '安静地', 'Quietly',
      ['happy', '……神の涙を拭う人の子、か。……ふふ、前代未聞じゃ。……ありがとう。', '……给神明擦眼泪的人类吗。……呵呵，前所未闻。……谢谢你。', '...A human wiping a goddess\'s tears. ...Heh, unheard of. ...Thank you.'])]
  ),
  miyuki: D(
    ['深雪说地震那年，她还没出生。她妈妈当时才二十岁，家里的房子塌了一半，一家人在体育馆里住了三个月。', 'Miyuki wasn\'t born yet when the earthquake hit. Her mother was twenty; half their house collapsed and the family lived in a school gym for three months.'],
    ['\"母がね、いつも話してたの。知らない人が、毛布をくれたって\"，她说，\"顔は覚えてないけど、温かさは覚えてるって\"。', '\"My mother always told me a stranger gave her a blanket,\" she says. \"She never remembered the face — only how warm it was.\"'],
    ['她在光拱下面停下来，看着你，笑了笑：\"……だから、私、誰かの毛布になりたかったの\"。', 'Under the arches she stops, looks at you, and smiles: \"...That\'s why I wanted to be someone\'s blanket.\"'],
    [say('深雪さんは、もう、誰かの毛布になってますよ。', '深雪小姐，已经是某个人的毛毯了。', 'You\'re already someone\'s blanket.', '告诉她', 'Tell her',
      ['shy', '……あら。……そう言ってもらえると、母の毛布が、ちゃんと受け継がれた気がするわ。……ありがとう。', '……哎呀。……听你这么说，觉得妈妈的那条毛毯，好好地传下来了。……谢谢你。', '...Oh. ...Hearing that, I feel my mother\'s blanket was truly passed on. ...Thank you.'],
      ['深雪さんは、もう、誰かの毛布がなってますよ。', '「なる」前面用「に」：「毛布になる」。', 'なる takes に: 毛布になる.'],
      ['毛布なんて、どこでも買えますよ。', '\"毛毯哪里都能买\"——完全没听懂她在说什么。', '\"You can buy blankets anywhere\" — completely missed her point.']),
     joke('「深雪小姐，冷吗？」', '"Are you cold?"', '关心', 'Care',
      ['neutral', '……ちょっとね。……でも、平気よ。……母のあの冬に比べたら、全然。', '……有一点。……不过，没事。……跟妈妈的那个冬天比，完全不算什么。', '...A little. ...But I\'m fine. ...Compared to my mother\'s winter, not at all.']),
     act('把自己的围巾围在她的脖子上', 'Wrap your scarf around her neck', '当她的毛毯', 'Be her blanket',
      ['happy', '……温かい。……母が言ってた毛布って、きっと、こんな感じね。', '……好暖。……妈妈说的那条毛毯，一定就是这种感觉吧。', '...Warm. ...The blanket my mother talked about must have felt like this.'])]
  ),
  sora: D(
    ['空在光的回廊里走得很慢，比她平时慢了一倍。她说她爸爸是消防员，地震那天，他三天没有回家。', 'Sora walks through the gallery twice as slowly as usual. Her father is a firefighter; the day of the earthquake he didn\'t come home for three days.'],
    ['\"親父、あの時のこと、一回も話してくれへんねん\"，她说，\"でも、毎年この光、一人で見に来とる\"。', '\"Dad\'s never once talked about it,\" she says. \"But every year he comes to see these lights alone.\"'],
    ['她停下来，看着光拱：\"……ウチが走るのは、親父みたいに、誰かのとこに一番に駆けつけたいからや\"。', 'She stops beneath an arch: \"...I run because I want to be first to reach someone, like Dad.\"'],
    [say('空なら、きっと誰よりも早く駆けつけられるよ。', '你的话，一定能比谁都早赶到。', 'You\'ll get there faster than anyone, I\'m sure.', '相信她', 'Believe in her',
      ['shy', '……。……お前に言われると、ほんまにそうなる気がするわ。……ほな、まず、お前のとこに一番に駆けつけたる。', '……。……被你这么说，感觉真的会这样。……那，首先，第一个赶到你身边。', '.... ...From you, it feels like it\'ll really happen. ...Then first, I\'ll run to you before anyone.'],
      ['空なら、きっと誰よりも早く駆けつけさせられるよ。', '使役被动「させられる」是\"被迫赶到\"，太绕了。', 'Causative-passive \"be forced to rush\" — convoluted.'],
      ['無理しないで、プロに任せればいいよ。', '\"别勉强，交给专业的人吧\"——否定了她的梦想。', '\"Don\'t push it, leave it to pros\" — dismisses her dream.']),
     joke('「你今天走得好慢。」', '"You\'re walking so slowly today."', '轻轻地', 'Gently',
      ['neutral', '……ここは、走ったらあかん場所や。……一個一個の光、ちゃんと見なあかん。', '……这里是不能跑的地方。……每一盏光，都要好好看。', '...This isn\'t a place to run. ...Each light deserves to be properly seen.']),
     act('建议明年，带她爸爸一起来', 'Suggest bringing her dad along next year', '三个人', 'The three of you',
      ['happy', '……！　……親父、一人で来とるの、ずっと気になっとってん。……お前、ほんま、ええこと言うな。', '……！……老爸一个人来，我一直很在意。……你真会说好话。', '...! ...It\'s always bugged me that Dad comes alone. ...You really say the right things.'])]
  ),
  nao: D(
    ['奈绪在光之回廊的入口，握住了你的手。人很多，她怕走散，也因为——她小声说——\"ひかりが、きれいすぎて、こわい\"。', 'At the entrance Nao takes your hand — the crowd is thick and she\'s afraid of getting separated, but also, she whispers, \"the light is so beautiful it\'s scary.\"'],
    ['走在光的隧道里，她一直仰着头，眼睛映着无数的光点。走到一半，她停下来，拿出小本子，在昏暗的光下写了一行字。', 'In the tunnel of light she keeps her face upturned, countless points of light in her eyes. Halfway, she stops and writes a line in her notebook by the dim glow.'],
    ['她把本子给你看：\"ずっと、となりに いて ほしい\"。', 'She shows you: \"i want you beside me always.\"'],
    [say('ずっと、隣にいるよ。約束する。', '我会一直在你身边。我保证。', 'I\'ll always be beside you. I promise.', '用嘴说出来', 'Say it aloud',
      ['shy', '……！　……くちで いわれた。……ずるい。……もう、ノートに かかなくても いいの？', '……！……被你说出口了。……狡猾。……那，以后不用写在本子上了吗？', '...! ...You said it out loud. ...Unfair. ...So I don\'t need to write it anymore?'],
      ['ずっと、隣がいるよ。約束する。', '表示所在的地点用「に」：「隣にいる」；「隣がいる」变成\"有个邻居\"。', 'Location takes に: 隣にいる. 隣がいる means \"there\'s a neighbour\".'],
      ['ずっとは、ちょっと無理かもね。', '\"一直有点难吧\"——在这种时候。', '\"Always might be hard\" — at a moment like this.']),
     joke('「光太漂亮了，所以可怕？」', '"So beautiful it\'s scary?"', '轻轻问', 'Ask softly',
      ['neutral', '……うん。……きれいな ものは、いつか きえるから。……でも、あんたの てが あるから、だいじょうぶ。', '……嗯。……美丽的东西，总有一天会消失。……不过，有你的手在，没关系。', '...Mm. ...Beautiful things vanish someday. ...But your hand is here, so it\'s okay.']),
     act('在她的本子上，那行字的下面，写上\"約束\"', 'Below her line in the notebook, write \"promise\"', '用她的方式回答', 'Answer her way',
      ['happy', '……やくそく。……あんたの じ。……このページ、いっしょう、やぶらない。', '……约定。……你的字。……这一页，一辈子都不撕。', '...Promise. ...In your handwriting. ...I\'ll never tear out this page.'])]
  ),
  maki: D(
    ['真希说她本来以为光之祭典就是\"でっかいイルミネーション\"。可是走进光的回廊，她不说话了，连手机都忘了拿出来。', 'Maki thought Luminarie was just \"giant illuminations.\" But inside the gallery of light she falls silent, forgetting even to take out her phone.'],
    ['走到尽头的广场，她看到了纪念碑上的说明，读了很久。然后她小声说：\"……ウチ、何も知らんかった\"。', 'In the plaza she reads the memorial text for a long time. Then, quietly: \"...I didn\'t know anything.\"'],
    ['她转过头，看着你，有点不知所措：\"……こういうとき、どうしたらええん？\"', 'She turns to you, a little lost: \"...What are you supposed to do at times like this?\"'],
    [say('知ろうとしたことが、一番大事だと思う。', '我觉得，想去了解，就是最重要的。', 'I think wanting to know is what matters most.', '告诉她', 'Tell her',
      ['shy', '……そっか。……せんぱい、たまに、ほんまにええこと言うな。……来年も、一緒に来て。ちゃんと、知りたいから。', '……这样啊。……前辈偶尔会说出很好的话呢。……明年也一起来吧。因为想好好了解。', '...I see. ...Sometimes you say really good things, senpai. ...Come with me next year too. I want to properly know.'],
      ['知ろうとさせたことが、一番大事だと思う。', '使役「させた」是\"让（别人）去了解\"，意思偏了。', 'させた means \"made someone try to know\".'],
      ['昔のことだし、知らなくても仕方ないよ。', '\"都是以前的事，不知道也没办法\"——她想要的不是这个。', '\"It\'s old history, can\'t be helped\" — not what she needs.']),
     joke('「你今天连手机都没拿出来。」', '"You haven\'t even taken your phone out."', '轻轻地', 'Gently',
      ['neutral', '……撮ったら、あかん気がしてん。……目で、ちゃんと覚えとく。せんぱいと見たことも。', '……感觉不能拍。……要用眼睛好好记住。跟前辈一起看的这件事也是。', '...It felt wrong to film it. ...I\'ll remember with my eyes. Seeing it with you, too.']),
     act('跟她一起，在募捐箱前投一点零钱', 'Drop some change in the donation box with her', '一起做点什么', 'Do something together',
      ['happy', '……ちょっとだけやけど。……でも、何かできて、よかった。……せんぱいと一緒で、よかった。', '……虽然只有一点。……不过，能做点什么，太好了。……跟前辈一起，太好了。', '...Only a little. ...But I\'m glad I could do something. ...Glad I\'m with you.'])]
  )
};
