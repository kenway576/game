import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 空 · 第④段「最初の試合」 / 第⑤段「五センチの答え」
//
// 【③之后还剩什么】
// ③：她承认了"我想打"，入部表交上去了（两条线都交了：相爱线她自己交，挚友线你替她交）。
// 但"想打"和"打得好"之间还隔着一件事：**输**。
// 她过去两年躲的，从来不是篮球，是"我已经不是最好的那个"被证实的那一刻。
//
// ④：复归后第一场练习赛。最后一投，没进，输一分。
//    三井和ペコ那条线的落点不是赢，是输了之后还想打。
//    她下场第一句话是「楽しかった」——两年来第一次。
// ⑤：须磨的海边，沙滩冲刺训练。那个"五センチ"她终于量了：还差三公分。
//    她说"差三公分也想跳"，然后提了一个新的交换条件：
//    想考一所篮球强的大学，入学考要英语——"英语，还教我吗"。
//    ①的交换条件是"你教我英语、我教你运动"，⑤是同一个交换，但这次她要的是将来。
//
// 【动画】④：体育馆，终场前的跳投，球离开指尖，灯光打在她身上。
//         ⑤：夕阳的海边，她踩着浪冲刺，水花一格一格地溅起来，回头举起拳头。
// ---------------------------------------------------------

const K = kit(CharacterId.SORA, 'bg-orange-500', '空', 'Sora');
const { scene, nar, say, me, choice, fork, anime, done } = K;

export const SORA_STORY_4: StoryNode[] = [
  scene('gym', '最初の試合', 'The First Game', '放学后 · 体育馆', 'After school · The gym', 'basketball'),
  nar('练习赛。对手是隔壁区的学校，去年县大赛打进过八强。', 'A practice match. The opponents are from the next ward over; last year they made the prefectural quarter-finals.'),
  fork([
    nar('她没有让你坐观众席。她说过的：结束之后，第一个见到的人要是你。所以你站在场边的通道口，那是她下场第一眼能看见的地方。', 'She did not let you sit in the stands. She said it: the first person she sees afterwards should be you. So you stand at the courtside exit, where her eyes will land first when she comes off.')
  ], [
    nar('观众席最前排，正中间。那是"一号观众"的固定位置。她热身的时候往这边看了一眼，确认你在，然后再也没看过来。', 'Front row of the stands, dead centre: the fixed seat of spectator number one. During warm-up she glances over once to check you are there, and never looks again.')
  ]),
  nar('她两年没在正式的场上打过球。上场之前，她转了三圈右肩——那是她给自己的信号。', 'She has not played on a real court in two years. Before she goes on she rolls her right shoulder three times. Her signal to herself.'),
  nar('比赛很难看。她的传球被断了两次，一次上篮被盖了帽。但她每次被断，下一个回合都冲得更快。', 'It is not pretty. Her passes are picked off twice, one lay-up gets blocked. But every time she loses the ball, the next possession she runs harder.'),
  nar('最后一节，还剩六秒，落后一分。球到了她手里。', 'Final quarter. Six seconds left, down by one. The ball comes to her.', undefined, [{ jp: '残り', reading: 'のこり', zh: '剩余', en: 'remaining' }]),
  nar('她没有传。她起跳了——三分线外半步，右肩没有一丝犹豫。', 'She does not pass. She goes up, half a step outside the three-point line, without a flicker of hesitation in that right shoulder.'),
  anime(4),
  nar('球砸在篮筐前沿，弹了出去。终场哨响了。输一分。', 'The ball hits the front of the rim and bounces out. The final whistle. Lost by one.'),
  nar('她落地之后，在原地站了很久，看着那个篮筐。', 'After she lands she stands where she is for a long time, looking at the hoop.'),
  fork([
    nar('然后她转过身，朝通道口走过来。她走得很快，最后几步几乎是跑的。', 'Then she turns and comes toward the exit. She walks fast; the last few steps are almost a run.')
  ], [
    nar('然后她转过身，抬头看向观众席最前排，正中间。', 'Then she turns and looks up at the front row of the stands. Dead centre.')
  ]),
  say('school', 'happy', '……負けた。', '……输了。', '...We lost.'),
  nar('她说"输了"的时候在笑。不是那种"没事没事"的笑，是汗还没擦、喘着气、整张脸亮着的那种。', 'She is grinning as she says it. Not the never-mind grin. The kind with sweat still running, out of breath, her whole face lit up.'),
  choice('她在等你说点什么。', 'She is waiting for you to say something.', [
    { id: 'so4_fun', zh: '「楽しそうだった。」', en: '"You looked like you were having fun."', jp: '楽しそうだった。', hintZh: '说你看见的', hintEn: 'Say what you saw',
      aff: 7, fam: 5, stat: 'kindness', words: [{ jp: '楽しい', reading: 'たのしい', zh: '开心、愉快', en: 'fun' }],
      then: [
        say('school', 'surprised', '……そう見えた？', '……看起来是那样吗？', '...Did it look like that?'),
        say('school', 'happy', '……うん。楽しかった。負けたのに、めっちゃ楽しかってん。', '……嗯。很开心。明明输了，却超开心的。', '...Yeah. It was fun. We lost and it was so much fun.')
      ] },
    { id: 'so4_close', zh: '「惜しかった。あと五センチ。」', en: '"So close. Five more centimetres."', jp: '惜しかった。あと五センチ。', hintZh: '那个数字', hintEn: 'That number',
      aff: 5, fam: 6, stat: 'charm',
      then: [say('school', 'happy', 'あはは！ またそれ言う？ ……でもほんまに、あと五センチやったな。', '啊哈哈！又提那个？……不过还真是，就差五公分。', 'Ahaha! That again? ...But yeah, it really was five centimetres.')] },
    { id: 'so4_next', zh: '「次は入る。」', en: '"Next one goes in."', jp: '次は入る。', hintZh: '信她', hintEn: 'Believe in her',
      aff: 6, fam: 6, stat: 'guts',
      then: [say('school', 'neutral', '……次、か。', '……下一次啊。', '...Next time, huh.'), say('school', 'happy', '「次」ってええ言葉やな。二年ぶりに聞いた気がする。', '"下一次"这个词真好啊。感觉两年没听过了。', '"Next time" is a nice phrase. Feels like the first time I\'ve heard it in two years.')] }
  ]),
  fork([
    nar('她把额头抵在你肩上，汗蹭了你一身。你没有躲。', 'She drops her forehead onto your shoulder and gets sweat all over you. You do not move away.'),
    say('school', 'shy', '……一番最初に会うの、あんたにしといてよかった。負けた顔、他の人に見せたくなかったし。', '……第一个见的人定成你，真是太好了。输了的脸，不想给别人看。', '...Glad I made you the first person I see. I didn\'t want anyone else seeing my losing face.'),
    nar('她说不想给别人看。可她刚刚给你看了，而且是笑着的。', 'She says she did not want anyone to see it. She has just shown it to you, and she was grinning.')
  ], [
    say('school', 'happy', '一号は、負けた試合も見とかなあかんねん。それが一号の仕事やから。', '一号观众，输掉的比赛也得看着。那是一号的工作。', 'Number one has to watch the games we lose too. That\'s number one\'s job.'),
    nar('她冲你竖起大拇指，然后被队友拖去整队了。整队的时候她还在回头看你，被教练骂了一句。', 'She gives you a thumbs-up and gets dragged off to line up with the team. She keeps looking back at you as they line up and the coach yells at her for it.')
  ]),
  done(4, 4, 4, '输了一分的那场比赛', 'The game lost by one point')
];

export const SORA_STORY_5: StoryNode[] = [
  scene('suma_beach', '五センチの答え', 'The Answer to Five Centimetres', '傍晚 · 须磨海岸', 'Early evening · Suma beach', 'sports'),
  nar('须磨的海边。她说沙滩冲刺是最累的训练——脚底下的东西一直在跑，你得比它跑得更快。', 'The beach at Suma. Sand sprints, she says, are the worst training there is: the ground keeps moving under you, so you have to move faster than it does.'),
  nar('她让你帮忙计时。五十米，往返十趟。第七趟的时候她摔了一跤，爬起来接着跑。', 'She has you time her. Fifty metres, ten round trips. On the seventh she goes down in the sand, gets up, keeps going.'),
  nar('跑完最后一趟，她仰面倒在沙子上，喘了很久。', 'After the last one she falls flat on her back in the sand and breathes for a long time.'),
  say('summer', 'neutral', '……あんな。測ってん、あれ。', '……跟你说。我量了，那个。', '...Listen. I measured it. That thing.'),
  nar('那个"五センチ"。两年前一个教练对两年前的她说：你的跳跃高度差了五公分，打不了更高的级别。她这两年一次都没有重新量过。', 'The five centimetres. Two years ago a coach told the two-years-younger her that her vertical jump was five centimetres short of the next level. She has not measured it once since.'),
  say('summer', 'neutral', '藤原先生に頼んで、測ってもらった。', '拜托藤原老师帮我量的。', 'I asked Mr. Fujiwara to measure it for me.'),
  say('summer', 'happy', '三センチ足りひんかった。二センチは縮まったけど、三センチ、まだ足りひん。', '还差三公分。缩短了两公分，但还差三公分。', 'Still three short. Closed two of them, but three centimetres still missing.'),
  nar('她说这个数字的时候，表情跟说"今天晚饭吃咖喱"没有区别。', 'She says the number with the same face she would use to say they are having curry for dinner.'),
  choice('浪拍上来，打湿了她的鞋。', 'A wave rolls in and soaks her shoes.', [
    { id: 'so5_still', zh: '「それでも、跳びたいんだよね。」', en: '"And you still want to jump."', jp: 'それでも、跳びたいんだよね。', hintZh: '替她说出来', hintEn: 'Say it for her',
      aff: 6, fam: 6, stat: 'kindness',
      then: [say('summer', 'happy', '……うん。三センチ足りひんくても、跳びたい。あはは、なんやそれって感じやけど。', '……嗯。就算差三公分，也想跳。啊哈哈，好像有点莫名其妙就是了。', '...Yeah. Three centimetres short and I still want to jump. Ahaha, sounds ridiculous.')] },
    { id: 'so5_closed', zh: '「二センチ縮めたんでしょ。すごいよ。」', en: '"You closed two centimetres. That\'s amazing."', jp: '二センチ縮めたんでしょ。すごいよ。', hintZh: '看她跑掉的那一半', hintEn: 'Look at the half she closed',
      aff: 5, fam: 7, stat: 'charm',
      then: [say('summer', 'surprised', '……そっち見るん？', '……你看的是那边吗？', '...That\'s the part you look at?'), say('summer', 'happy', '……あんたって、ほんま変なとこ数えるな。', '……你这个人，数的地方真是奇怪。', '...You really count the weirdest things.')] },
    { id: 'so5_who', zh: '「その五センチ、誰が決めたの？」', en: '"Who decided it had to be five centimetres anyway?"', jp: 'その五センチ、誰が決めたの？', hintZh: '把标准拿回来', hintEn: 'Take the standard back',
      aff: 7, fam: 4, stat: 'guts',
      then: [nar('她愣住了。然后她慢慢坐起来，拍掉头发上的沙子。', 'She goes still. Then she slowly sits up and brushes the sand out of her hair.'), say('summer', 'neutral', '……せやな。二年前のおっちゃんが、二年前のウチに言うただけや。', '……也是啊。只是两年前的一个大叔，对两年前的我说的而已。', '...Yeah. Just some guy two years ago, talking to me two years ago.')] }
  ]),
  nar('她站起来，又跑了一趟。没人让她跑，没有计时，就是跑。', 'She gets up and runs one more length. Nobody told her to, nobody is timing. She just runs.'),
  anime(5),
  nar('跑回来的时候，她在你面前停下，脸红扑扑的，眼睛很亮。', 'When she comes back she stops in front of you, flushed, eyes very bright.'),
  say('summer', 'neutral', 'ウチな、大学でもバスケやりたい。強いとこ。……でも、入試に英語あんねん。', '我啊，大学也想打篮球。打得强的那种学校。……可是，入学考试有英语。', 'I want to play at university too. A good team. ...But the entrance exam has English.'),
  say('summer', 'shy', '……英語、まだ教えてくれる？', '……英语，还教我吗？', '...Will you still teach me English?'),
  nar('一年前在体育馆里，她提的交换条件是：她教你运动，你教她英语。那时候她要的是一个借口。这一次，她要的是将来。', 'A year ago in the gym the deal she offered was: she teaches you sport, you teach her English. Back then she wanted an excuse. This time she wants a future.', undefined, [{ jp: '交換条件', reading: 'こうかんじょうけん', zh: '交换条件', en: 'terms of a trade' }]),
  fork([
    me('うん。……代わりに、毎試合、一番最初に会わせて。', '嗯。……作为交换，每一场比赛，都让我第一个见你。', 'Yes. ...In exchange, let me be the first person you see after every game.'),
    say('summer', 'happy', 'あはは！ それ、もう契約済みやん。', '啊哈哈！那个早就签过约了啊。', 'Ahaha! That\'s already in the contract!'),
    nar('她伸出手。你以为她要击掌，她握住了——跟天台那天一样。这一次她说：「これも、ハイタッチちゃうで」。', 'She holds out her hand. You think it is a high-five. She takes hold of yours, like that day on the roof. This time she says: this one isn\'t a high-five either.')
  ], [
    me('うん。代わりに、一号の席、大学でも空けといて。', '嗯。作为交换，一号的位子，大学也给我留着。', 'Yes. In exchange, keep number one\'s seat for me at university too.'),
    say('summer', 'happy', 'もちろんや！ 一号は終身制やから。', '那当然！一号是终身制的。', 'Obviously! Number one is a lifetime appointment.'),
    nar('她跟你击了一下掌，响得海鸥都飞起来了。', 'She high-fives you so loudly the gulls take off.')
  ]),
  done(5, 4, 4, '还差三公分也想跳', 'Still wanting to jump, three centimetres short')
];
