import { D, say, joke, act } from './kit';

// 须磨水族园
export const AQUARIUM = {
  asuka: D(
    ['明日香在大水槽前停下来，说鱼群游得\"整然としている\"，很合她的心意。可是没过多久，一条鱼脱离了队伍，她立刻盯着它看，眉头皱起来。', 'At the big tank Asuka approves of the school of fish — \"so orderly.\" Then one strays from the formation and she frowns at it intently.'],
    ['那条鱼游了一圈，又回到了队伍里。她松了一口气，然后发现你在看她，脸一下子红了。', 'The fish circles and rejoins the school. She exhales in relief, then notices you watching and flushes.'],
    ['蓝色的光照在她脸上。她小声说：\"……あの子、ちょっと私に似てた\"。', 'Blue light plays on her face. \"...That one looked a bit like me,\" she says quietly.'],
    [say('列から外れても、ちゃんと戻ってこられるよ。', '就算离开了队伍，也一定能回来的。', 'Even if you leave the line, you can always come back.', '安慰她', 'Reassure her',
      ['shy', '……。……戻る場所があれば、ね。……あなたが、そこにいてくれるなら。', '……。……如果有可以回去的地方的话。……如果你在那里的话。', '.... ...If there\'s a place to go back to. ...If you\'re there.'],
      ['列から外れても、ちゃんと戻ってこさせるよ。', '使役「こさせる」变成\"让她回来\"，像在命令。', 'こさせる makes it \"I\'ll make you come back\".'],
      ['列から外れたら、もう戻れないよ。', '\"离开了就回不去了\"，太残酷。', '\"Once you leave, there\'s no return\" — cruel.']),
     joke('「班长，你在给鱼打操行分吗？」', '"Are you grading the fish on conduct?"', '吐槽', 'Snark',
      ['angry', 'し、してないわよ！　……あの子は、五点満点で四点ね。戻ってきたから。', '才、才没有！……那孩子，五分制打四分吧。因为回来了。', 'I-I am NOT! ...That one gets four out of five. For coming back.']),
     act('指着队伍最外面一条游得慢吞吞的鱼', 'Point out a slowpoke fish dawdling at the edge of the school', '它也在队伍里', 'It\'s still in the school',
      ['happy', '……ほんとね。遅くても、ちゃんと一緒にいる。……ふふ、あれはあなたね。', '……真的呢。就算慢，也好好地在一起。……呵呵，那条是你。', '...You\'re right. Slow, but still with them. ...Hehe, that one\'s you.'])]
  ),
  hikari: D(
    ['光在海豚表演的第一排坐下来，你还来不及提醒，海豚就跳起来了。水花落下，她从头湿到脚，然后大笑着说\"最高ーー！\"', 'Hikari sits in the front row of the dolphin show. Before you can warn her, a dolphin leaps. She\'s soaked head to toe — and laughing. \"The best!\"'],
    ['你把外套借给她，她裹在里面，袖子长出一截。她把袖子甩来甩去，说\"{name}くんの匂いする\"，然后马上补了一句\"い、いい意味で！\"', 'You lend her your jacket. She\'s swimming in it, sleeves flapping. \"Smells like you,\" she says — then, quickly, \"I-in a good way!\"'],
    ['表演结束，她还裹着外套，没有要还的意思。', 'The show ends. She\'s still wrapped up, with no intention of giving it back.'],
    [say('そのジャケット、光ちゃんのほうが似合ってる。', '那件外套，你穿更合适。', 'That jacket suits you better than me.', '让她留着', 'Let her keep it',
      ['shy', 'ほんま！？　……じゃ、じゃあ、今日一日、借りとく。……返すとき、ちょっと寂しいかも。', '真的！？……那、那今天一天先借着。……还的时候，可能会有点寂寞。', 'Really?! ...Th-then I\'ll borrow it all day. ...Might be a bit sad giving it back.'],
      ['そのジャケット、光ちゃんのほうが似合わせてる。', '「似合わせる」不是这么用的，就用「似合ってる」。', '似合わせる isn\'t used this way; just 似合ってる.'],
      ['そのジャケット、早く返して。', '\"快还我\"，她会湿着嘴撅起来。', '\"Give it back now\" — she\'d pout, dripping.']),
     joke('「你是故意坐第一排的吧？」', '"You sat in the front row on purpose, didn\'t you?"', '戳穿', 'Call it',
      ['tease', 'バレた？　……濡れたら、{name}くんが上着貸してくれるかなーって。……作戦成功や！', '被发现了？……想着弄湿了，你会不会借我外套。……作战成功！', 'Busted? ...I figured if I got wet you\'d lend me your jacket. ...Mission accomplished!']),
     act('用手帕帮她擦掉脸上的水', 'Dab the water off her face with a handkerchief', '照顾她', 'Look after her',
      ['shy', '……っ。……{name}くん、近い。……そんな丁寧に拭かれたら、うち、溶けてまう。', '……唔。……好近。……被你这么细心地擦，我会融化的。', '...! ...You\'re close. ...If you wipe me that gently, I\'ll melt.'])]
  ),
  rei: D(
    ['铃在水母的展厅里不肯走了。暗色的房间，发光的水母一张一合地漂着。她说水母没有大脑，也没有心脏，\"それでも、五億年生きてきました\"。', 'Rei won\'t leave the jellyfish room. In the dark, glowing jellies pulse and drift. No brain, no heart, she says — \"and still they\'ve survived five hundred million years.\"'],
    ['她把手贴在玻璃上，说有时候她觉得自己像水母：想得太多，反而不知道往哪里漂。', 'Hand on the glass, she says sometimes she feels like a jellyfish: thinking too much, not knowing where to drift.'],
    ['一只小水母漂到了她手的位置，停了一下。', 'A small jelly drifts to where her hand is and pauses.'],
    [say('漂う先が分からないなら、こっちに来ればいい。', '不知道往哪里漂的话，往我这边来就好。', 'If you don\'t know where to drift, drift this way.', '给她方向', 'Give her a direction',
      ['shy', '……。……その言葉、記録しました。……迷ったら、参照します。……何度でも。', '……。……这句话，我记录下来了。……迷路的时候，会参照的。……不管多少次。', '.... ...I\'ve recorded that. ...When I\'m lost, I\'ll refer to it. ...As often as I need.'],
      ['漂う先が分からないなら、こっちに来させればいい。', '使役「来させれば」是\"让（谁）来\"，对象不明。', '来させれば — \"make someone come\" — unclear who.'],
      ['漂う先が分からないなら、ずっと漂っていればいい。', '\"那就一直漂着吧\"，等于不管她。', '\"Then just keep drifting\" — washing your hands of her.']),
     joke('「没大脑也活了五亿年——所以想太多反而不好？」', '"Five hundred million years without a brain — so thinking\'s overrated?"', '逗她', 'Tease',
      ['tease', '……その論理だと、あなたは長生きしますね。……冗談です。三割くらいは。', '……照这个逻辑，你会很长寿呢。……开玩笑的。三成左右是。', '...By that logic you\'ll live a long time. ...Joking. About thirty percent.']),
     act('把手贴在她手旁边的玻璃上', 'Press your hand to the glass beside hers', '陪她', 'Stay with her',
      ['happy', '……クラゲが、二人の間を通りました。……縁結び、かもしれません。非科学的ですが。', '……水母从我们俩中间穿过去了。……说不定是在结缘。虽然不科学。', '...A jellyfish passed between us. ...Matchmaking, perhaps. Unscientific, but.'])]
  ),
  inari: D(
    ['稻荷站在巨大的水槽前，第一次见到这么多海里的东西。她认出了鲷鱼，说\"お供え物じゃ\"，然后对着一条大鲨鱼皱眉：\"……あれは、供えられても困る\"。', 'At the giant tank Inari sees more sea creatures than ever before. She recognizes sea bream — \"offerings!\" — then frowns at a big shark: \"...that, I would not want offered.\"'],
    ['在海底隧道里，鱼从头顶游过。她仰着头，走得很慢，说这是\"竜宮\"，她以前只在故事里听过。', 'In the underwater tunnel fish swim overhead. She walks slowly, head back: \"The Dragon Palace\" — something she\'d only heard of in tales.'],
    ['她停在隧道中间，回头看你：\"……人の子は、竜宮まで造ってしもうたか\"。', 'She stops mid-tunnel and turns: \"...So human children have built even the Dragon Palace.\"'],
    [say('稲荷様と来たかったから、造ったんですよ。', '因为想和稻荷大人一起来，才造的。', 'We built it so I could come here with you.', '说句甜话', 'Say something sweet',
      ['shy', '……う、嘘をつけ。……じゃが、そういう嘘は、嫌いではない。……乙姫の気分じゃ。', '……别、别骗人。……不过，这种谎话，我不讨厌。……有种当乙姬的感觉。', '...L-liar. ...But I don\'t mind that sort of lie. ...I feel like Princess Otohime.'],
      ['稲荷様と来たかったから、造られたんですよ。', '被动「造られた」把\"我造的\"变成\"被造的\"，失去主语。', 'Passive 造られた loses the \"I built it\".'],
      ['稲荷様が来たくないから、造ったんですよ。', '\"因为你不想来才造的\"，逻辑乱了。', '\"Because you didn\'t want to come\" — nonsense.']),
     joke('「那我是浦岛太郎？回去的时候会变老吗。」', '"So I\'m Urashima Taro? Will I age when I go home?"', '接梗', 'Play along',
      ['tease', 'ふふ、玉手箱は渡さぬ。……そなたが老いたら、わらわが困るからのう。', '呵呵，不给你玉手箱。……你变老的话，我会很困扰的。', 'Heh, no treasure box for you. ...I\'d be troubled if you grew old.']),
     act('在隧道里，替她指出头顶游过的一条海龟', 'In the tunnel, point out a sea turtle gliding overhead', '浦岛太郎的乌龟', 'Urashima\'s turtle',
      ['happy', '亀じゃ！　……ほれ、案内してくれておる。……そなたと二人で、乗せてもらいたいのう。', '是乌龟！……看，它在给我们带路。……真想和你两个人一起骑上去。', 'A turtle! ...Look, it\'s guiding us. ...I wish it would carry us both.'])]
  ),
  miyuki: D(
    ['深雪在企鹅馆前站了很久，看一只企鹅一直在岸边徘徊，不敢下水。她说\"わかるわ、その気持ち\"。', 'Miyuki watches a penguin pacing the edge, too scared to dive. \"I know that feeling,\" she says.'],
    ['后来那只企鹅被后面的同伴挤了一下，掉进水里，然后游得比谁都快。深雪笑出声来，说\"背中を押してもらうって、大事ね\"。', 'Then a companion bumps it in — and it swims faster than any of them. Miyuki laughs: \"Sometimes you need a push.\"'],
    ['她看了你一眼，又看回企鹅，没再说话。', 'She glances at you, then back at the penguins, saying nothing more.'],
    [say('深雪さんの背中も、押しましょうか。', '深雪小姐的背，我也来推一把吧。', 'Shall I give you a push too?', '接她的话', 'Pick up the thread',
      ['shy', '……あら。……そんなこと言ったら、本当に飛び込んじゃうわよ。……あなたのほうに。', '……哎呀。……说这种话的话，我可真的会跳进去哦。……往你这边。', '...Oh. ...Say that and I really might dive in. ...Towards you.'],
      ['深雪さんの背中も、押されましょうか。', '「押されましょう」是\"让我被推吧\"，主客颠倒。', '押されましょう means \"shall I be pushed\".'],
      ['深雪さんの背中は、押せませんね。', '\"推不了你\"，把话堵死了。', '\"I can\'t push you\" — shuts it down.']),
     joke('「深雪小姐也有不敢下水的时候？」', '"Even you get scared to dive in?"', '好奇', 'Curious',
      ['tease', 'あるわよ、いくつになっても。……特に、年下の子相手だとね。……ふふ、誰のことかしら。', '有啊，不管多大了。……特别是面对比自己小的孩子的时候。……呵呵，说的是谁呢。', 'Of course, at any age. ...Especially with someone younger. ...Hehe, I wonder who.']),
     act('轻轻碰一下她的后背', 'Lightly touch her back', '真的推一下', 'An actual nudge',
      ['happy', '……ふふっ、本当に押すなんて。……ありがとう。ちょっと、勇気出た。', '……呵呵，竟然真的推了。……谢谢。稍微有勇气了。', '...Hehe, you actually pushed. ...Thank you. I feel a bit braver.'])]
  ),
  sora: D(
    ['空在海豚池边看海豚训练，眼睛一直跟着领头的那只。她说那只海豚的转身比她游泳队的学姐还漂亮，\"フォームが完璧や\"。', 'Sora watches dolphin training, eyes locked on the lead dolphin. Its turn is cleaner than her swim-team senpai\'s — \"perfect form.\"'],
    ['训练员让海豚跳了一个高高的弧线。空跟着它的动作，膝盖不自觉地弯了一下，像要一起跳起来。', 'The trainer cues a high arc. Sora\'s knees bend instinctively, as if to leap with it.'],
    ['她转过头，眼睛亮亮的：\"なあ、ウチもあんな風に跳べたら、お前、見に来てくれる？\"', 'She turns, eyes bright: \"Hey — if I could jump like that, would you come watch?\"'],
    [say('跳べなくても、毎回見に行くよ。', '就算跳不了，每次我都会去看。', 'Even if you can\'t, I\'ll come watch every time.', '承诺', 'Promise',
      ['shy', '……。……ずるいわ、それ。……跳べるまで、練習したる。お前のために、とは言わんけど。', '……。……太狡猾了。……我会练到能跳为止。不是说为了你哦。', '.... ...That\'s unfair. ...I\'ll train until I can. Not saying it\'s for you, though.'],
      ['跳べなくても、毎回見に行かれるよ。', '「行かれる」是尊敬/被动，这里不需要。', '行かれる is honorific/passive; not needed.'],
      ['跳べないなら、見に行かないよ。', '\"跳不了就不去\"，有条件的爱太伤人。', '\"If you can\'t, I won\'t come\" — conditional, hurtful.']),
     joke('「你膝盖刚才弯了一下，是想跳进池子里吗？」', '"Your knees just bent — were you about to jump in?"', '吐槽', 'Snark',
      ['tease', '……ちょっとな。……止めてくれて助かったわ。……いや、止めてへんか。見とっただけか。', '……有一点。……还好你拦住我了。……不对，你没拦。只是在看。', '...A bit. ...Thanks for stopping me. ...Wait, you didn\'t. You just watched.']),
     act('跟她一起，在海豚跳起来的瞬间鼓掌', 'Clap with her the instant the dolphin leaps', '一起兴奋', 'Get excited together',
      ['happy', 'ナイスジャンプ！　……へへ、お前とおると、ウチ、応援する側も楽しいって思えるわ。', '好跳！……嘿嘿，跟你在一起，当加油的一方也很开心呢。', 'Nice jump! ...Heh, with you around, even cheering is fun.'])]
  ),
  nao: D(
    ['奈绪在一个小小的水槽前蹲了很久。里面是一只寄居蟹，背着一个太大的壳，走一步就要停一下。', 'Nao crouches at a tiny tank for ages. Inside, a hermit crab lugs a shell far too big, stopping after every step.'],
    ['她小声说：\"……あたし、こういう かんじ\"。说自己背着太重的东西，走得很慢。你还没回答，寄居蟹找到了一个更小的壳，换了进去。', '\"...that\'s me,\" she whispers. Carrying something too heavy, moving slowly. Before you can answer, the crab finds a smaller shell and switches.'],
    ['它换了壳以后，走得快多了。奈绪看着它，没有说话。', 'In the new shell it moves much faster. Nao watches it, silent.'],
    [say('重いものは、半分持つよ。', '重的东西，我帮你拿一半。', 'I\'ll carry half of whatever\'s heavy.', '分担', 'Share the load',
      ['shy', '……はんぶんこ。……むかしから、あんた、なんでも はんぶんこ する。……ありがと。', '……一人一半。……你从以前开始，什么都要一人一半。……谢谢。', '...Halves. ...You always split everything in half, ever since we were little. ...Thanks.'],
      ['重いものは、半分持たせるよ。', '使役「持たせる」是\"让你拿\"，正好反了。', '持たせる means \"I\'ll make you carry it\" — backwards.'],
      ['重いものは、一人で持ってね。', '\"重的你自己拿\"，太冷淡。', '\"Carry the heavy stuff yourself\" — cold.']),
     joke('「它换了个小壳就跑得飞快——你也换个小点的书包？」', '"It switched shells and zoomed off — want a smaller backpack?"', '开玩笑', 'Joke',
      ['pout', '……そういう いみじゃ ない。……でも、ちょっと わらった。……ばか。', '……不是那个意思。……不过，有点被逗笑了。……笨蛋。', '...Not what I meant. ...But I laughed a little. ...Dummy.']),
     act('陪她一直蹲着，直到寄居蟹爬到角落', 'Crouch beside her until the crab reaches the corner', '不催她', 'Don\'t rush her',
      ['happy', '……あんた、あしが しびれたでしょ。……あたしの ペースに あわせてくれる ひと、あんただけ。', '……你腿麻了吧。……配合我的节奏的人，只有你。', '...Your legs went numb, right? ...You\'re the only one who keeps my pace.'])]
  ),
  maki: D(
    ['真希在深海鱼的展区兴奋得不得了。灯笼鱼、皇带鱼、长得像外星人的东西——她说这些全是\"デザインのネタ\"，手机里拍了几十张。', 'Maki goes wild in the deep-sea section: anglerfish, oarfish, alien-looking things — all \"design material\", she says, snapping dozens of photos.'],
    ['她在一只长相奇怪的鱼前面停下，说她游戏里的最终Boss就要照这个画。然后她转过头，比较了一下你的脸和那条鱼。', 'At one strange-looking fish she announces her final boss will be based on it. Then she turns and compares your face to the fish.'],
    ['她憋着笑，说\"……似てへん、似てへん\"，可是肩膀一直在抖。', 'Biting back a laugh, she says \"no resemblance, none\" — shoulders shaking.'],
    [say('真希のゲーム、完成したら一番に遊びたい。', '你的游戏做好了，我想第一个玩。', 'When your game\'s done, I want to be the first to play.', '支持她', 'Support her',
      ['shy', '……一番は、テストプレイヤーやで。バグだらけやで。……それでもええなら、せんぱいに頼む。', '……第一个就是测试玩家哦。全是Bug哦。……这样也行的话，就拜托前辈了。', '...First means test player. Bugs everywhere. ...If that\'s fine, I\'m counting on you.'],
      ['真希のゲーム、完成したら一番に遊ばれたい。', '被动「遊ばれたい」是\"想被玩弄\"，意思变得很奇怪。', '遊ばれたい means \"want to be toyed with\" — very wrong.'],
      ['真希のゲーム、完成しないと思う。', '\"我觉得做不完\"，她会把你做成Boss。', '\"I don\'t think it\'ll get finished\" — she\'d make you the boss.']),
     joke('「你把我跟那条鱼比，是想让我演最终Boss吗？」', '"Comparing me to that fish — am I the final boss?"', '反问', 'Ask back',
      ['tease', '……最終ボスは、倒されるからな。……せんぱいは、倒されへん役にしとく。ヒロインとか。……ちゃうわ、ヒーローや。', '……最终Boss是要被打倒的。……前辈就当不会被打倒的角色吧。女主角之类的。……不对，是男主角。', '...Final bosses get beaten. ...You get a role that doesn\'t. Like the heroine. ...No — the hero.']),
     act('模仿那条鱼的表情', 'Imitate the fish\'s face', '配合她', 'Play along',
      ['happy', 'ぶはっ……！　……やめ、やめて……！　……あかん、このモーション、ゲームに入れる。モデル料はタダやで。', '噗……！……别、别这样……！……不行，这个动作要放进游戏里。模特费是零哦。', 'Pfft...! ...St-stop...! ...That\'s it, this animation goes in the game. Modelling fee: zero.'])]
  )
};
