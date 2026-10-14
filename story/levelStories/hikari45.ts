import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 光 · 第④段「練習のさよなら」 / 第⑤段「往復切符」
//
// 【③之后还剩什么】
// ③里她停止了表演：相爱线说出了练了一个月的那句话，挚友线第一次没有先挥手。
// 但"交换生三月要走"这件事没有消失。她怕的东西从"有人走"变成了"我要走"——
// 她这辈子一直是被留在原地的那个，从来没练过怎么当离开的那个人。
//
// ④：港边看飞机。她有一张「神戸でやりたいことリスト」，其中一条是
//    「飛行機を見送る練習」。她在练习说再见——「さよなら」太像结束，
//    她想找一个说完了还能回来的词。①的规矩是"不能让她哭"；
//    这一段她哭了，因为她不再需要靠笑撑着了。
// ⑤：摩天轮。②里她在这里说"别对我太好，会习惯的"。
//    这一次她说的是反话：「もっと優しくして。習慣になっても、もう平気だから」。
//    她买了往返的机票——回程那一班，是"再回来"的那一班。
//
// 【动画】④：黄昏的栏杆，她朝飞过海面的飞机挥手，侧马尾被风扯起来，眼里有光。
//         ⑤：夜里的摩天轮，她把手掌贴在玻璃上，回头笑。
// ---------------------------------------------------------

const K = kit(CharacterId.HIKARI, 'bg-sky-500', '光', 'Hikari');
const { scene, nar, say, me, choice, fork, anime, done } = K;

export const HIKARI_STORY_4: StoryNode[] = [
  scene('kobe_harbor', '練習のさよなら', 'Practising Goodbye', '黄昏 · 港边', 'Dusk · The harbour', 'town'),
  nar('还是那根栏杆。她今天带了一个小本子，封面上用马克笔写着「神戸でやりたいことリスト」。', 'The same rail. Today she has a small notebook with her, the cover marked in felt pen: Things to Do in Kobe.'),
  nar('里面大半都画了勾：南京町的肉包、六甲山的夜景、在北野坂上不看地图走到底。没画勾的只剩最后几条。', 'Most of it is ticked off: pork buns in Nankinmachi, the night view from Rokko, walking the whole Kitano slope without a map. Only the last few lines are left.'),
  say('casual', 'happy', '今日のはね、これ。', '今天的是这一条。', 'Today it\'s this one.'),
  nar('她指着的那一行写着：「飛行機を見送る練習」。', 'The line under her finger reads: Practise seeing off a plane.', undefined, [{ jp: '見送る', reading: 'みおくる', zh: '送行、目送', en: 'to see someone off' }]),
  nar('海的对面是机场岛。每隔十几分钟就有一架飞机从那边起飞，贴着海面爬升，然后变成天上的一个亮点。', 'Across the water is the airport island. Every ten-odd minutes a plane lifts off from it, climbs low over the sea, and becomes a bright point in the sky.'),
  say('casual', 'neutral', 'あたしさ、見送られるほうはずっとやってきたんだよ。お父さんの転勤のたびに。……でも見送るほうは、やったことないの。', '我啊，一直都是被送的那一边。每次爸爸调动的时候。……可是送别人这件事，我一次都没做过。', 'I\'ve always been the one being seen off. Every time Dad got transferred. ...But I\'ve never been the one doing the seeing off.'),
  say('casual', 'sad', '三月はさ、あたしが行くほうじゃん。だから、ちゃんと言える言葉、決めときたくて。', '三月的时候，走的是我嘛。所以我想先定好一句，能好好说出口的话。', 'In March I\'m the one leaving. So I want to decide on the words beforehand. Words I can actually say.'),
  nar('一架飞机从对岸起飞了。她试着对它说了一句「さよなら」，说完自己皱了皱眉。', 'A plane lifts off across the water. She tries "sayonara" at it, then frowns at herself.'),
  say('casual', 'pout', '……なんか違う。終わっちゃう感じがする。', '……感觉不对。像是要结束了一样。', '...That\'s wrong. It sounds like it\'s over.'),
  choice('第二架飞机正在跑道上加速。她看向你。', 'A second plane is gathering speed on the runway. She looks at you.', [
    { id: 'hk4_ittekimasu', zh: '「行ってきます、がいいと思う。」', en: '"I think \'I\'m off\' is the one."', jp: '行ってきます、がいいと思う。', hintZh: '出门的人说的那句', hintEn: 'What you say leaving home',
      aff: 7, fam: 4, stat: 'kindness', words: [{ jp: '行ってきます', reading: 'いってきます', zh: '我出门了（还会回来）', en: 'I\'m off (and will be back)' }],
      then: [
        say('casual', 'surprised', '……行ってきます。', '……我出门了。', '...I\'m off.'),
        nar('那是出门的人对家里说的话。说的人会回来，这句话本身就是这个意思。', 'It is what you say to the house when you leave it. The person saying it will be back. That is what the words mean.')
      ] },
    { id: 'hk4_nothing', zh: '「何も言わなくても、伝わると思う。」', en: '"You don\'t have to say anything. It\'ll get across."', jp: '何も言わなくても、伝わると思う。', hintZh: '不用练', hintEn: 'No practice needed',
      aff: 5, fam: 6, stat: 'charm',
      then: [say('casual', 'neutral', '……だめ。あたし、言わないと伝わらないって、ここで習ったんだもん。', '……不行。我在这儿学到的，就是不说出来就传达不到。', '...No. Here is where I learned that if I don\'t say it, it doesn\'t get across.')] },
    { id: 'hk4_wave', zh: '「先に手を振ってもいいんだよ、今度は。」', en: '"This time, you\'re allowed to wave first."', jp: '先に手を振ってもいいんだよ、今度は。', hintZh: '她戒掉的那个习惯', hintEn: 'The habit she gave up',
      aff: 6, fam: 5, stat: 'guts',
      then: [nar('她愣了一下。先挥手，是她用来让自己不被留下的办法。现在她是要走的那个人——先挥手的意思就完全反过来了。', 'She blinks. Waving first was how she kept from being the one left behind. Now she is the one leaving, and waving first means the opposite.')] }
  ]),
  nar('飞机离地了。她举起手，朝着它用力地挥，挥得整个侧马尾都在晃。', 'The plane leaves the ground. She raises her arm and waves at it hard, so hard her whole side ponytail swings.'),
  anime(4),
  nar('飞机变成一个亮点的时候，她的手还举着。然后你听见她吸了一下鼻子。', 'When the plane is just a bright point, her hand is still up. Then you hear her sniff.'),
  say('casual', 'sad', '……あれ。なんで。練習なのに。', '……咦。为什么。明明只是练习。', '...Huh. Why. It\'s only practice.'),
  nar('她哭了。没有蹲下去，没有转过身，也没有说"没事的！"。就那样站着，一边哭一边笑。', 'She is crying. She does not crouch, does not turn away, does not say "I\'m fine!" She just stands there, crying and laughing at once.'),
  nar('一年前你在这根栏杆上认识的那个人，是绝对不会让任何人看见这个样子的。', 'The person you met at this rail a year ago would never have let anyone see her like this.'),
  fork([
    say('casual', 'shy', '……ねえ。あたしが「行ってきます」って言ったら、なんて言ってくれる？', '……呐。我说"我出门了"的时候，你会怎么回？', '...Hey. When I say "I\'m off", what will you say back?'),
    me('行ってらっしゃい。', '路上小心，早点回来。', 'See you when you get back.'),
    nar('「行ってらっしゃい」。送人出门的人说的话，意思是"我在这儿等你回来"。', 'Itterasshai. What the one staying says at the door. It means: I will be here when you come back.', undefined, [{ jp: '行ってらっしゃい', reading: 'いってらっしゃい', zh: '路上小心（等你回来）', en: 'see you when you\'re back' }]),
    say('casual', 'happy', '……うん。それなら、言える。', '……嗯。那样的话，我说得出口。', '...Yeah. Then I can say it.')
  ], [
    say('casual', 'happy', '決めた。あたしは「またね」にする。', '决定了。我就说"回头见"。', 'Decided. I\'m going with "see you".'),
    say('casual', 'neutral', '「またね」は、友達同士で、次があるときに言うやつでしょ。……友達は、辞められないって言ったもんね、あたし。', '"回头见"是朋友之间、还有下次的时候说的吧。……我说过的嘛，朋友是没法辞职的。', '"See you" is what friends say when there\'s a next time. ...I did say you can\'t quit being friends.'),
    nar('她把那一行划掉了。在旁边又添了一条新的：「またね、を言いに戻ってくる」。', 'She crosses the line out. Beside it she adds a new one: Come back to say "see you".')
  ]),
  done(4, 4, 4, '港边练习的那一句', 'The words she practised at the harbour')
];

export const HIKARI_STORY_5: StoryNode[] = [
  scene('mosaic_night', '往復切符', 'Round Trip', '夜 · 马赛克摩天轮', 'Night · The Mosaic Ferris wheel', 'night'),
  nar('她约你去坐摩天轮。同一座，夜里。', 'She asks you to ride the Ferris wheel. The same one, at night.'),
  nar('上一次坐的时候，她说的是"所以你别对我太好"。那是一圈十五分钟、谁都下不去的房间里，她能想出来的最远的距离。', 'The last time, what she said was: so don\'t be too nice to me. In a room nobody could leave for fifteen minutes, it was the furthest away she could think of putting you.'),
  nar('吊厢的门关上了。地面一点一点往下沉。', 'The gondola door closes. The ground starts to sink away.'),
  say('casual', 'neutral', 'ここ、覚えてる？ あたしがさ、ずるいこと言った場所。', '这里，还记得吗？我说了很狡猾的话的地方。', 'Remember this place? Where I said something sneaky.'),
  say('casual', 'shy', 'だからね、今日は、あの日の反対を言いに来たの。', '所以啊，今天我是来说那天的反话的。', 'So today I came to say the opposite.'),
  nar('她深吸一口气。这次她没有笑场。', 'She takes a breath. This time she does not burst out laughing.'),
  say('casual', 'neutral', 'もっと優しくして。……習慣になっても、もう平気だから。', '对我再好一点。……就算养成习惯了，我也已经不怕了。', 'Be nicer to me. ...Even if it turns into a habit, I can take it now.', [{ jp: '習慣', reading: 'しゅうかん', zh: '习惯', en: 'habit' }]),
  nar('"别对我太好"翻过来，就是这一句。她把它翻过来花了一整年。', 'Turn "don\'t be too nice to me" over and this is what is underneath. It took her a whole year to turn it.'),
  choice('吊厢升到一半，城市的灯铺满了整面玻璃。', 'Halfway up, the city lights fill the whole window.', [
    { id: 'hk5_promise', zh: '「うん。毎日、ちょっとずつ。」', en: '"Okay. A little every day."', jp: 'うん。毎日、ちょっとずつ。', hintZh: '答应她', hintEn: 'Promise',
      aff: 7, fam: 4, stat: 'kindness',
      then: [say('casual', 'happy', '……毎日って言った？ 言ったね？ 録音しとけばよかった。', '……你说了每天？说了吧？早知道录下来了。', '...You said every day? You did, right? Should\'ve recorded it.')] },
    { id: 'hk5_already', zh: '「もう、ずっとそうしてたつもりだけど。」', en: '"I thought I already was."', jp: 'もう、ずっとそうしてたつもりだけど。', hintZh: '其实一直都是', hintEn: 'You always were',
      aff: 6, fam: 5, stat: 'charm',
      then: [say('casual', 'surprised', '……え。', '……诶。', '...Huh.'), nar('她回头算了算，算到一半捂住了脸。她发现你说的是真的。', 'She counts back, and halfway through covers her face. She has realised it is true.')] },
    { id: 'hk5_you_too', zh: '「光も、自分に優しくしてね。」', en: '"Be nice to yourself too, Hikari."', jp: '光も、自分に優しくしてね。', hintZh: '她最不擅长的那个', hintEn: 'The one she is worst at',
      aff: 5, fam: 7, stat: 'guts',
      then: [say('casual', 'pout', '……それ、いちばん難しいやつじゃん。', '……那是最难的一条好吗。', '...That\'s the hardest one.'), say('casual', 'neutral', '……でも、やってみる。リストに足しとく。', '……不过，我试试。加到清单里。', '...But I\'ll try. I\'ll add it to the list.')] }
  ]),
  nar('吊厢到了最高点。她把手掌贴在玻璃上，看着底下整个神户。', 'The gondola reaches the top. She presses her palm to the glass and looks down at the whole of Kobe.'),
  anime(5),
  nar('然后她从包里拿出一个信封，递给你。里面是一张打印出来的机票行程单。', 'Then she takes an envelope from her bag and gives it to you. Inside is a printed flight itinerary.'),
  nar('出发：三月。回来：八月。往返票。', 'Outbound: March. Return: August. A round trip.', undefined, [{ jp: '往復', reading: 'おうふく', zh: '往返', en: 'round trip' }]),
  say('casual', 'happy', '片道じゃないよ。帰りの便は、また来るための便。', '不是单程哦。回程那一班，是再来这儿的那一班。', 'It\'s not one way. The return flight is the flight for coming back.'),
  fork([
    say('casual', 'shy', '八月の一週間だけだけど。……一週間って、あたしたちには長い単位でしょ。', '只有八月的一个星期。……不过一个星期，对我们来说是很长的单位吧。', 'It\'s only a week in August. ...But a week is a long unit for us, isn\'t it.'),
    nar('她比你早来一周。她的整个故事都是从那一周开始的。', 'She arrived one week before you. Her whole story started with that week.'),
    nar('吊厢开始往下降。她把头靠在了你肩上，一直靠到地面。下来的时候工作人员拉开门，她才慢吞吞地坐直。', 'The gondola begins to descend. She leans her head on your shoulder and keeps it there all the way down. Only when the attendant opens the door does she sit up, very slowly.')
  ], [
    say('casual', 'neutral', '教員免許の試験、七月に一個目があるの。受かったら、その報告しに来る。落ちたら……慰めてもらいに来る。', '教师资格考试，七月有第一门。考过了，我就来报喜。没考过……就来让你安慰我。', 'The first teaching exam is in July. If I pass, I\'ll come and tell you. If I fail... I\'ll come and get comforted.'),
    say('casual', 'happy', 'どっちにしても来るから。友達って、そういうのに使っていいんでしょ？', '反正不管怎样都会来。朋友，就是可以拿来这样用的吧？', 'Either way I\'m coming. That\'s what friends are for, right?'),
    nar('一年前，她觉得"需要别人"是一件要先有资格才能做的事。现在她拿着一张往返票，理直气壮地说"拿来用"。', 'A year ago she thought needing someone was something you had to earn first. Now she holds a round-trip ticket and says, without a flicker: that is what friends are for.')
  ]),
  done(5, 4, 4, '往返的那张机票', 'The round-trip ticket')
];
