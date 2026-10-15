import { say, joke, act } from './kit';

// 光：N4，句子短，拟声词多，带一点关西腔（うち、めっちゃ、ほんま、〜やん）。夸她会整个人亮起来。
export const HIKARI_REVEALS = {
  casual: [
    say('そのひまわり、光ちゃんっぽいね。', '那朵向日葵，很像你。', 'That sunflower is so you.', '夸卫衣上的向日葵', 'Praise the sunflower on her hoodie',
      ['happy', 'ほんま！？　うちもそう思って買ってん！　めっちゃうれしい！', '真的吗！？我也是这么想才买的！超开心！', 'Really?! That is why I bought it! So happy!'],
      ['そのひまわり、光ちゃんっぽいだね。', '「っぽい」是い形容词型，后面不加「だ」。', 'っぽい works like an i-adjective; no だ after it.'],
      ['そのひまわり、光ちゃんっぽくないね。', '\"不像你\"，夸奖变成了否定。', '\"Not like you\" — the compliment flips.']),
    joke('把她反戴的帽子转正：「这样才对吧？」', 'Turn her backwards cap the right way round: "Like this, surely?"', '逗她', 'Tease her',
      ['pout', 'あーっ！　ちゃうちゃう、うしろ向きがかわいいの！　もどして〜！', '啊——！不对不对，反着戴才可爱！给我转回去～！', 'Ahh! No no, backwards is the cute way! Turn it back!']),
    act('跟她举一样高地挥手回应', 'Wave back just as high as she does', '她先挥的手', 'She waved first',
      ['happy', 'えへへ、手、ふりかえしてくれた！　今日はええ日になるで！', '嘿嘿，你也挥手了！今天一定是好日子！', 'Hehe, you waved back! Today is going to be a good day!'])
  ],
  gym: [
    say('家から走ってきたの？すごいね。', '从家里跑过来的？好厉害。', 'You ran all the way from home? Amazing.', '佩服她', 'Be impressed',
      ['happy', 'うん！　ぜんぜん つかれてへんよ！　……ちょっとだけ、つかれた。', '嗯！一点都不累哦！……其实，有一点点累。', 'Yep! Not tired at all! ...Okay, a tiny bit.'],
      ['家から走ってきたの？すごいだね。', '「すごい」是い形容词，后面不加「だ」。', 'すごい is an i-adjective; no だ.'],
      ['家から走らせてきたの？すごいね。', '使役「走らせて」变成\"让（谁）跑过来\"，意思不对。', '走らせて is causative — \"made someone run\".']),
    joke('递给她一瓶新的水：「剩下那半瓶归我。」', 'Hand her a fresh bottle: "I will take the half-empty one."', '换着喝', 'Swap bottles',
      ['surprised', 'えっ、それ うちが飲んだやつやで！？　……ま、まあ ええけど！', '诶，那个是我喝过的耶！？……算、算了，也行！', 'Eh, I drank from that one?! ...F-fine, whatever!']),
    act('把自己的毛巾也递给她', 'Hand her your towel too', '她出了一身汗', 'She is soaked',
      ['happy', 'ありがと！　あっ、ええにおい……って、なに言うてんねん うち！', '谢谢！啊，好香……我在说什么啊！', 'Thanks! Oh, it smells nice... wait, what am I saying!'])
  ],
  swim: [
    say('ひまわりの髪かざり、いいね。', '头上那朵向日葵，很好看。', 'The sunflower in your hair is great.', '夸发饰（安全）', 'Praise the hair flower (safe)',
      ['shy', 'そこ見てくれたん！？　……えへへ、うち、そこ いちばん こだわってん。', '你注意到那里了！？……嘿嘿，那个是我最用心的地方。', 'You noticed that?! ...Hehe, that is the bit I fussed over most.'],
      ['ひまわりの髪かざり、いいだね。', '「いい」是い形容词，直接说「いいね」。', 'いい is an i-adjective: just いいね.'],
      ['ひまわりの髪かざり、いらないね。', '「いらない」是\"不需要\"，她会当场摘掉。', 'いらない means \"not needed\".']),
    joke('抢过沙滩球：「先接住这个再说！」', 'Grab the beach ball: "Catch this first!"', '先玩再说', 'Play first, talk later',
      ['happy', 'わっ！　ずるい！　まって〜！', '哇！好狡猾！等等我～！', 'Whoa! No fair! Wait for me!']),
    act('别开视线，脸先红了', 'Look away, already going red', '说不出话', 'Lost for words',
      ['shy', 'あ……顔、赤いで？　……うちも、あついねん。海やから。たぶん。', '啊……你脸红了哦？……我也好热。因为是海边吧。大概。', 'Oh... your face is red? ...Mine is hot too. It is the sea. Probably.'])
  ],
  yukata: [
    say('金魚のゆかた、夏っぽくていいね。', '金鱼浴衣，很有夏天的感觉。', 'The goldfish yukata feels so summery.', '夸浴衣', 'Praise the yukata',
      ['happy', 'せやろ！　うち、金魚 めっちゃ すきやねん！　りんごあめも 金魚色やで！', '对吧！我超喜欢金鱼的！苹果糖也是金鱼色的哦！', 'Right! I love goldfish! The candy apple is goldfish-coloured too!'],
      ['金魚のゆかた、夏っぽいていいね。', 'い形容词连接要用「くて」：「夏っぽくて」。', 'Join i-adjectives with くて: 夏っぽくて.'],
      ['金魚のゆかた、冬っぽくていいね。', '\"很有冬天的感觉\"，季节说反了。', '\"Feels wintry\" — wrong season.']),
    joke('真的咬了一大口苹果糖', 'Actually take a huge bite of her candy apple', '她问的', 'She did offer',
      ['surprised', 'うわっ、ほんまに かじった！　しかも 大きい！　……ええよ、半分こや。', '哇，真的咬了！还咬这么大口！……好吧，一人一半。', 'Whoa, you really bit it! A big bite too! ...Fine, we share.']),
    act('把她松掉的兵儿带往上提了提', 'Tug her loosening sash back up', '它快掉了', 'It was slipping',
      ['shy', 'あ、ゆるんでた？　ありがと……。なんか、お兄ちゃんみたいやな。', '啊，松了吗？谢谢……总觉得你像哥哥一样。', 'Oh, was it loose? Thanks... You are like a big brother.'])
  ],
  autumn: [
    say('そのぼうし、ぽんぽんがかわいい。', '那顶帽子，绒球好可爱。', 'The pom-pom on that hat is so cute.', '夸绒球', 'Praise the pom-pom',
      ['happy', 'でしょ！　ふると、ぽんぽん ゆれるねん。ほら、ほら！', '对吧！一晃，绒球就会动哦。你看，你看！', 'Right! It bounces when I shake. Look, look!'],
      ['そのぼうし、ぽんぽんをかわいい。', '形容词句的主语用「が」：「ぽんぽんがかわいい」。', 'The subject of an adjective takes が, not を.'],
      ['そのぼうし、ぽんぽんがこわい。', '「こわい」是\"可怕\"，不是\"可爱\"。', 'こわい means scary, not cute.']),
    joke('「大的那半给你，那我要袋子。」', '"You get the big half. I get the bag."', '跟她讨价还价', 'Haggle',
      ['pout', 'ふくろ？　ふくろは たべられへんで？　……あ、あったかいからか！　かしこい！', '袋子？袋子不能吃哦？……啊，因为暖和是吧！好聪明！', 'The bag? You cannot eat the bag? ...Oh, because it is warm! Clever!']),
    act('从她手里接过烤红薯，掰成两半，把大的递回去', 'Take the sweet potato, break it, and hand her the bigger half', '让给她', 'Let her have it',
      ['surprised', 'え、大きいほう くれるん？　……もう、そういうとこやで。', '诶，大的那半给我？……真是的，你就是这种地方啦。', 'Eh, the big half for me? ...See, that is what you are like.'])
  ],
  maid: [
    say('笑ってもいいよ。かわいかったから。', '笑场也没关系。很可爱。', 'You can laugh. It was cute.', '让她放松', 'Let her relax',
      ['happy', 'ほんま？　じゃあ もう一回！　……おかえりなさいませ〜！　あはは、やっぱ むり！', '真的？那再来一遍！……欢迎回来～！啊哈哈，果然不行！', 'Really? One more time! ...Welcome home! Ahaha, no, I cannot!'],
      ['笑ってもいいよ。かわいいかったから。', 'い形容词「かわいい」的过去形是「かわいかった」。', 'The past of かわいい is かわいかった.'],
      ['笑っちゃいけないよ。かわいかったから。', '\"不许笑\"，跟你想安慰她的意思反了。', '\"You must not laugh\" — the opposite of reassuring her.']),
    joke('「主人大人想点一杯『光特调』。」', '"Master would like one Hikari Special, please."', '陪她玩', 'Play along',
      ['tease', 'ひかりスペシャル！？　えーっと……オレンジジュースに、えがお、トッピングです！', '光特调！？那个……橙汁，加上笑容当配料！', 'Hikari Special?! Um... orange juice, topped with a smile!']),
    act('等她笑完，再认真说一次「ただいま」', 'Wait for her to finish laughing, then say ただいま properly', '给她第二次机会', 'Give her another go',
      ['shy', '……おかえりなさいませ、ご主人さま。……い、言えた！　言えたで！', '……欢迎回来，主人大人。……说、说出来了！说出来了！', '...Welcome home, master. ...I-I did it! I did it!'])
  ],
  winter: [
    say('そのオレンジ、遠くからでもすぐ分かった。', '那件橙色的，离很远就认出来了。', 'I spotted that orange from miles away.', '她举手太高了', 'She waved so high',
      ['happy', 'それ ねらってん！　ゆきの日でも、うち、すぐ見つかるやろ？', '就是要这样！就算下雪天，也能马上找到我吧？', 'That is the plan! Even on a snowy day you can find me, right?'],
      ['そのオレンジ、遠くからでもすぐ分かるった。', '「分かる」的过去形是「分かった」。', 'The past of 分かる is 分かった.'],
      ['そのオレンジ、遠くからだと全然分からなかった。', '\"离远了根本看不出来\"，跟事实相反。', '\"I could not see it at all from far away\" — untrue.']),
    joke('捏一捏帽子上那个巨大的绒球', 'Squeeze the enormous pom-pom on her hat', '它太大了', 'It is enormous',
      ['surprised', 'わっ、ぽんぽん つぶさんといて！　それ、うちの 二こめの あたまやねんから！', '哇，别捏扁我的绒球！那是我的第二颗脑袋！', 'Hey, do not squash it! That is my second head!']),
    act('把她的手套捏在手里暖一暖', 'Hold her mittened hands a moment to warm them', '不说话', 'Without words',
      ['shy', '……あったかい。手ぶくろ ごしでも、わかるもんやな。', '……好暖和。隔着手套也感觉得到呢。', '...Warm. You can tell, even through mittens.'])
  ],
  sleep: [
    say('くまのパジャマ、すごく似合ってる。', '小熊睡衣，太适合你了。', 'The bear pyjamas suit you so well.', '直接夸', 'Say it straight',
      ['shy', 'えへへ……耳も あるねんで。ほら。……ね、ねむくなってきたかも。', '嘿嘿……还有耳朵哦。你看。……好、好像有点困了。', 'Hehe... it has ears too. See. ...I-I might be getting sleepy.'],
      ['くまのパジャマ、すごく似合う。', '此刻正穿着，用状态「似合ってる」更自然。', 'She is wearing it now, so 似合ってる fits better.'],
      ['くまのパジャマ、すごく似合わない。', '\"太不适合了\"，意思完全反了。', '\"It really does not suit you\" — reversed.']),
    joke('学小熊玩偶摆了摆她拎着的那只胳膊', 'Make her teddy wave with its little arm', '陪她闹', 'Join in',
      ['happy', 'くまさんが あいさつしてる！　……こんばんは〜って、言うてるで。', '小熊在打招呼！……它在说晚上好～哦。', 'Teddy is saying hi! ...He says good evening.']),
    act('悄悄把门开大一点，示意她别出声', 'Quietly open the door wider and put a finger to your lips', '别吵醒别人', 'Do not wake anyone',
      ['happy', '……ないしょ、な。　（こくこく）', '……要保密哦。（拼命点头）', '...Our secret, okay. (nods hard)'])
  ],
  sport: [
    say('応援、ちゃんと届いたよ。', '你的应援，我收到了。', 'Your cheering reached me.', '回应她的应援', 'Answer her cheer',
      ['happy', 'ほんま！？　やった！　じゃあ、もっと 大きい声で いくで！　フレー！', '真的吗！？太好了！那我再大声一点！加——油！', 'Really?! Yes! Then even louder! Hoo-ray!'],
      ['応援、ちゃんと届けたよ。', '「届ける」是\"送达（别人的东西）\"；\"收到了\"用自动词「届いた」。', '届ける means to deliver; \"it reached me\" is 届いた.'],
      ['応援、ぜんぜん届かなかったよ。', '\"一点都没收到\"，她会很受伤。', '\"It did not reach me at all\" — she will be crushed.']),
    joke('也举起一只拳头：「那我就为你应援吧。」', 'Raise a fist: "Then I will cheer for you."', '反过来应援她', 'Cheer her back',
      ['shy', 'う、うちに？　……そ、そんなん、はじめてや。……もう一回 言うて？', '为、为我？……这、这种事还是第一次。……再说一遍？', 'F-for me? ...N-nobody has ever... ...Say it again?']),
    act('接住她抛起来又没接住的彩球', 'Catch the pom-pom she tossed up and missed', '眼疾手快', 'Quick hands',
      ['surprised', 'ナイスキャッチ！　……チアより、キャッチのほうが うまいんちゃう？', '好球！……你接东西比我应援还厉害吧？', 'Nice catch! ...You catch better than I cheer!'])
  ],
  dress: [
    say('ぜんぜん変じゃない。すごくきれい。', '一点都不奇怪。很漂亮。', 'Not weird at all. You look beautiful.', '回答她的担心', 'Answer her worry',
      ['shy', '……きれい、って、うちに？　……あかん、顔あつい。くるっと回るんちゃうかった。', '……漂亮，是说我吗？……糟了，脸好烫。刚才不该转圈的。', '...Beautiful, me? ...Oh no, my face is hot. I should not have spun.'],
      ['ぜんぜん変じゃない。すごくきれいくない。', '「きれい」是な形容词，不能变成「きれいくない」；而且这样意思也反了。', 'きれい is a na-adjective; きれいくない is wrong and also negates it.'],
      ['ぜんぜん変だよ。すごくきれい。', '\"很奇怪\"和\"很漂亮\"自相矛盾，她会当真前半句。', '\"It is really weird\" contradicts the rest — she will hear only that.']),
    joke('「转到一半停下来，是在等我接着转吗？」', '"You stopped mid-spin. Waiting for me to finish it?"', '调侃', 'Tease',
      ['tease', 'ちゃうわ！　……でも、まわして くれるんやったら、まわっても ええよ？', '才不是！……不过，你要带我转的话，转一圈也行哦？', 'Not at all! ...But if you are offering to spin me, I might let you.']),
    act('替她把裙边上沾的一片花瓣摘掉', 'Pick a petal off the hem of her dress', '细心', 'Attentive',
      ['shy', '……ありがと。こういうの、ほんまに 似合わへんと 思ってたんやけどな。', '……谢谢。我本来真的以为，这种衣服不适合我呢。', '...Thanks. I really thought this kind of thing did not suit me.'])
  ],
  kimono: [
    say('あけましておめでとう。オレンジ、明るくていいね。', '新年快乐。橙色好明亮。', 'Happy New Year. The orange is so bright.', '拜年加夸奖', 'Greeting plus praise',
      ['happy', 'おめでとう！　うちの色やからな！　今年も いっしょに いっぱい 笑おな！', '新年快乐！因为这是我的颜色嘛！今年也要一起多笑笑哦！', 'Happy New Year! It is my colour! Let us laugh a lot together this year!'],
      ['あけましておめでとう。オレンジ、明るいていいね。', 'い形容词连接用「くて」：「明るくて」。', 'Join i-adjectives with くて: 明るくて.'],
      ['あけましておめでとう。オレンジ、暗くていいね。', '「暗い」是\"暗\"，正好说反了。', '暗い means dark — the opposite.']),
    joke('学她的样子，也用力扇了几下手', 'Fan yourself as hard as she does', '模仿她', 'Copy her',
      ['happy', 'あははっ、まねせんといて！　……でも、それ、けっこう すずしいやろ？', '啊哈哈，别学我啦！……不过，这样还挺凉快的吧？', 'Ahaha, stop copying! ...Cool, though, right?']),
    act('替她把披肩往肩上拉了拉', 'Pull her fur stole back up onto her shoulders', '它滑下来了', 'It slipped',
      ['shy', 'あ、ずれてた？　……ことし さいしょの「ありがと」、{name}くんに言うわ。', '啊，歪了吗？……今年第一句「谢谢」，就说给你了。', 'Oh, did it slip? ...My first thank-you of the year goes to you.'])
  ]
};
