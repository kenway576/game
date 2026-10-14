import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 铃 · 第④段「流星の数え方」 / 第⑤段「再建されたものの名前」
//
// 【③之后还剩什么】
// ③：十九册记录第一次有了读者。相爱线她把告白写成了观测记录，挚友线她把署名让出去一半。
// 她的世界观还剩最后一块没动：**记录是唯一的真实**。
// 被记下来的才存在，没被记下来的等于没发生——所以她从来不让任何东西逃出记录本。
//
// ④：双子座流星雨。她带了计数器，你们各数各的。数完对答案，数字不一样。
//    她第一反应是"有一个人数错了"，然后意识到：观测者不同，数就不同，两个都是真的。
//    相爱线里，她第一次**故意不记**一颗流星——"那一颗，我自己留着"。
//    挚友线里，她把两个数字并排写下来，不取平均。
// ⑤：回到①的十五番馆。那栋被地震震塌、重建过的洋馆。
//    ①里她说"重建的东西不算原来那个"，然后推翻了自己。
//    这一段她要把那份建筑调查交给市里的档案馆——十九册记录第一次被交出去，
//    交给不认识的读者。她在最后一页写下结论：「再建されたものも、原物である」。
//    这句话说的是房子，也是她自己。
//
// 【动画】④：夜里的天台，流星划过，她仰着头，镜片上映出光痕。
//         ⑤：十五番馆的窗边，她合上调查笔记，阳光里浮着灰尘，嘴角很轻地动了一下。
// ---------------------------------------------------------

const K = kit(CharacterId.REI, 'bg-indigo-500', '铃', 'Rei');
const { scene, nar, say, me, choice, fork, anime, done } = K;

export const REI_STORY_4: StoryNode[] = [
  scene('rooftop_night', '流星の数え方', 'How to Count Meteors', '夜 · 天台', 'Night · The rooftop', 'night'),
  nar('双子座流星雨的极大期。她提前三周就申请好了天台的夜间使用许可，申请书上观测者一栏写着两个名字。', 'The peak of the Geminids. She applied for night access to the roof three weeks ahead. On the form, the observer field has two names.'),
  nar('她递给你一个计数器——银色的，按一下"咔"一声，数字加一。她自己手里也有一个。', 'She hands you a tally counter: silver, a click and the number goes up by one. She has one of her own.', undefined, [{ jp: '流れ星', reading: 'ながれぼし', zh: '流星', en: 'shooting star' }]),
  say('winter', 'neutral', 'ルールを説明します。二十二時から二十三時まで。見えた流星を、各自で数えてください。相談は禁止です。', '说明一下规则。二十二点到二十三点。看见的流星，各自数。禁止商量。', 'The rules. From ten to eleven. Count the meteors you see, separately. No conferring.'),
  say('winter', 'neutral', '終了後、数を照合します。', '结束后核对数字。', 'Afterwards, we compare.'),
  nar('你们并排躺在铺好的垫子上。天很黑，城市的光被学校的楼挡住了一半。', 'You lie side by side on the mats she has laid out. The sky is very dark; the school building blocks half the city\'s glow.'),
  nar('第一颗来的时候，两个计数器同时响了。咔。', 'When the first one comes, both counters click at once.'),
  nar('一个小时里，夜空一直在下一场很慢的雨。你数着数着，渐渐不再看计数器了。', 'For an hour the sky rains very slowly. Somewhere along the way you stop looking at your counter.'),
  fork([
    nar('数到一半的时候，她的手在垫子上碰到了你的手。你握住了。她的计数器停了好几秒，才又咔地响起来。', 'Halfway through, her hand brushes yours on the mat. You take it. Her counter goes silent for several seconds before it clicks again.')
  ], []),
  anime(4),
  nar('二十三点。她坐起来，打开手电，把计数器举到灯下。', 'Eleven. She sits up, switches on her torch and holds her counter under it.'),
  say('winter', 'neutral', '四十一。', '四十一。', 'Forty-one.'),
  me('三十八。', '三十八。', 'Thirty-eight.'),
  nar('她的眉头动了一下。这在她脸上已经算是很大的表情了。', 'Her eyebrows move. On her face that counts as a large expression.'),
  say('winter', 'surprised', '……誤差が、三。どちらかが数え間違えています。', '……误差三。我们当中有一个人数错了。', '...A discrepancy of three. One of us has miscounted.'),
  choice('她看着两个数字，像在看一道没有解的题。', 'She looks at the two numbers like a problem with no solution.', [
    { id: 'rei4_both', zh: '「どっちも合ってると思う。見てた場所が違うだけ。」', en: '"I think we\'re both right. We were just looking at different bits of sky."', jp: 'どっちも合ってると思う。見てた場所が違うだけ。', hintZh: '观测者不同', hintEn: 'Different observers',
      aff: 6, fam: 6, stat: 'knowledge', words: [{ jp: '観測者', reading: 'かんそくしゃ', zh: '观测者', en: 'observer' }],
      then: [
        nar('她沉默了很久。然后她说：视野。人的视野是有偏差的。你的视线偏东，她的偏西。东边那三颗，她没看见；西边的，你没看见。', 'She is quiet a long time. Then: field of view. Human vision has a bias. Yours leaned east, hers west. Three in the east she never saw; some in the west you missed.'),
        say('winter', 'neutral', '……観測者が二人いれば、数も二つある。どちらも、正しい。', '……观测者有两个，数字也就有两个。两个都是对的。', '...Two observers, two numbers. Both correct.')
      ] },
    { id: 'rei4_wrong', zh: '「たぶん、途中で見るのやめてた。君のほう見てたから。」', en: '"I probably stopped counting partway. I was looking at you."', jp: 'たぶん、途中で見るのやめてた。君のほう見てたから。', hintZh: '老实交代', hintEn: 'Confess',
      aff: 8, fam: 3, stat: 'guts',
      then: [
        say('winter', 'surprised', '……っ。', '……！', '...!'),
        nar('手电的光晃了一下。她把计数器攥得很紧，紧到又"咔"地响了一声。', 'The torch beam wobbles. She grips her counter so hard it clicks again.'),
        say('winter', 'shy', '……今のは、流星ではありません。カウントから除外します。', '……刚才那一下不是流星。从计数里剔除。', '...That last one was not a meteor. Excluding it from the count.')
      ] },
    { id: 'rei4_average', zh: '「平均すれば三十九・五。」', en: '"Average it: thirty-nine and a half."', jp: '平均すれば三十九・五。', hintZh: '她的方法', hintEn: 'Her method',
      aff: 4, fam: 7, stat: 'knowledge',
      then: [
        say('winter', 'neutral', '……半分の流星は存在しません。', '……不存在半颗流星。', '...There is no such thing as half a meteor.'),
        nar('她说完，自己先愣了——她发现这句话听起来像是在开玩笑。然后她真的笑了，很小声。', 'Having said it, she pauses: it sounded like a joke. Then she actually laughs, very quietly.')
      ] }
  ]),
  fork([
    nar('她在记录本上写下了"四十一"和"三十八"。然后她停下笔，看了你一会儿。', 'In the logbook she writes forty-one and thirty-eight. Then she stops and looks at you for a while.'),
    say('winter', 'shy', '……本当は、四十二でした。', '……其实，是四十二。', '...Actually, it was forty-two.'),
    say('winter', 'shy', '一つ、記録しませんでした。あなたが私の手を握った時に流れたもの。……あれは、私だけのにします。', '有一颗，我没有记。你握住我的手的时候划过去的那颗。……那一颗，我自己留着。', 'There was one I did not record. The one that fell when you took my hand. ...I\'m keeping that one for myself.'),
    nar('六年来，她第一次故意让一样东西逃出了记录本。', 'For the first time in six years, she has deliberately let something escape the logbook.')
  ], [
    nar('她在记录本上写下两个数字。并排，不取平均，不注明哪个是对的。', 'In the logbook she writes both numbers. Side by side. No average, no note of which is right.'),
    say('winter', 'neutral', '共同観測の記録は、こう書くことにします。……観測者の数だけ、数字を残す。', '共同观测的记录，以后就这么写。……有几个观测者，就留几个数字。', 'From now on, joint observations are recorded like this. ...As many numbers as there are observers.'),
    nar('她在页脚加了一行小字：「第二観測者の視野は東寄り。補正しないこと。」', 'At the foot of the page she adds, in small writing: Second observer\'s field of view leans east. Do not correct for this.')
  ]),
  done(4, 4, 4, '两个数字都是真的', 'Both numbers were true')
];

export const REI_STORY_5: StoryNode[] = [
  scene('former_settlement_salon', '再建されたものの名前', 'The Name of a Rebuilt Thing', '下午 · 旧居留地十五番馆', 'Afternoon · Former Settlement No. 15', 'chat'),
  nar('旧居留地十五番馆。一年前，她在这里告诉你，这栋楼的建成年份对不上。', 'Former Settlement No. 15. A year ago she told you here that the date on this building did not add up.'),
  nar('它在地震里塌过，后来一块砖一块砖地重新砌了起来。她那时候说：重建的东西不算原来那个。然后她自己推翻了这个结论。', 'It fell in the earthquake and was put back up brick by brick. Back then she said a rebuilt thing does not count as the original. Then she overturned her own conclusion.'),
  nar('今天她背着一个很重的帆布包。里面是十九本笔记——六年的建筑调查和天体记录。', 'Today she carries a heavy canvas bag. Inside are nineteen notebooks: six years of building surveys and sky records.'),
  say('', 'neutral', '神戸市の文書館に、寄贈することにしました。', '我决定捐给神户市的档案馆。', 'I have decided to donate them to the Kobe City Archives.', [{ jp: '寄贈', reading: 'きぞう', zh: '捐赠', en: 'donation' }]),
  say('', 'neutral', '震災前後の洋館の記録は、意外と欠けているそうです。……私の記録で、一部埋まります。', '听说震灾前后洋馆的记录，意外地有不少缺口。……我的记录能填上一部分。', 'Apparently the records of the Western houses around the earthquake have surprising gaps. ...Mine will fill some of them.'),
  nar('三年里没有交给任何人的东西。上一次有了一个读者——你。这一次，她要把它交给所有不认识的人。', 'Things she never handed to anyone for three years. Last time, they gained one reader: you. This time she is giving them to everyone she will never meet.'),
  say('', 'neutral', '寄贈する前に、最後の一項目を書きます。この建物の。', '捐出去之前，我要写最后一项。这栋楼的。', 'Before I hand them over, I will write one final entry. For this building.'),
  nar('她坐在窗边那张旧椅子上，翻开第一册——六年前的那一本。第一页是她十岁时的字，歪歪扭扭的。', 'She sits in the old chair by the window and opens the first volume, from six years ago. The first page is in her ten-year-old handwriting, all crooked.'),
  nar('那一页写着：「十五番館。築年不明。再建のため、原物ではない。」', 'It reads: No. 15. Year built: unknown. Rebuilt; therefore not the original.'),
  choice('她把那一页指给你看，像在指一个旧的错误。', 'She shows you the page as if pointing out an old mistake.', [
    { id: 'rei5_keep', zh: '「その一行、消さないで残しておいて。」', en: '"Don\'t erase that line. Keep it."', jp: 'その一行、消さないで残しておいて。', hintZh: '错的也是记录', hintEn: 'Wrong is a record too',
      aff: 6, fam: 6, stat: 'kindness',
      then: [say('', 'neutral', '……はい。間違った記録も、記録です。訂正は、その下に書きます。', '……好的。错的记录也是记录。订正写在它下面。', '...Yes. A wrong record is still a record. The correction goes underneath.')] },
    { id: 'rei5_you', zh: '「十歳の君も、今の君も、どっちも原物だよ。」', en: '"The ten-year-old you and you now are both the original."', jp: '十歳の君も、今の君も、どっちも原物だよ。', hintZh: '说的不只是楼', hintEn: 'Not only about the house',
      aff: 8, fam: 3, stat: 'charm',
      then: [nar('她的笔停了。你说的那句话，比她准备写的结论早了一步。', 'Her pen stops. You have said it one step before the conclusion she was about to write.')] },
    { id: 'rei5_read', zh: '「最後の項目、声に出して読んでくれる？」', en: '"Will you read the last entry aloud?"', jp: '最後の項目、声に出して読んでくれる？', hintZh: '当第一个听众', hintEn: 'Be the first audience',
      aff: 5, fam: 7, stat: 'proficiency',
      then: [nar('她点头。你知道这对她来说意味着什么：她的记录，第一次被念出声。', 'She nods. You know what that means for her: for the first time, one of her records will be spoken aloud.')] }
  ]),
  nar('她在第十九册的最后一页写了很久。写完，她念了出来。', 'She writes on the last page of volume nineteen for a long time. Then she reads it aloud.'),
  say('', 'neutral', '「十五番館。訂正。……再建されたものも、原物である。崩れたことも、積み直されたことも、建物の一部として記録する。」', '「十五番馆。订正。……重建的东西也是原物。塌过的事、重新砌起来的事，都作为这栋建筑的一部分记录下来。」', '"No. 15. Correction. ...A rebuilt thing is also the original. That it fell, and that it was put back, are recorded as part of the building."', [{ jp: '再建', reading: 'さいけん', zh: '重建', en: 'rebuilding' }]),
  nar('她念"塌过"的时候，声音很平。念"重新砌起来"的时候，声音轻了一点。', 'When she reads "that it fell" her voice is flat. At "put back" it goes a little softer.'),
  anime(5),
  fork([
    say('', 'shy', '……この項目には、共同署名が必要です。', '……这一项需要共同署名。', '...This entry requires a co-signature.'),
    nar('署名栏上已经写好了她的名字。旁边空着一格。', 'Her name is already in the signature field. The space beside it is empty.'),
    nar('你签上了名字。她看着两个名字，用只有你听得懂的那种重音说：', 'You sign. She looks at the two names and says, with the stress only you can hear:'),
    say('', 'happy', '……崩れた私を、積み直したのは、あなたです。これは記録しません。言うだけにします。', '……把塌掉的我重新砌起来的，是你。这一句不记录。只说出来。', '...The one who put me back together after I fell was you. I won\'t record this. I\'ll only say it.'),
    nar('不记录，只说出来。这是她能给出的、比任何记录都重的东西。', 'Not recorded. Only said. From her, that weighs more than any record.')
  ], [
    nar('署名栏上写着两个名字。那是③那天开始的习惯：观测者，两名。', 'The signature field has two names. A habit since the day at the lookout: observers, two.'),
    say('', 'neutral', '文書館の人に、聞かれると思います。第二観測者は誰ですか、と。', '档案馆的人大概会问吧。第二观测者是谁。', 'The archivist will probably ask: who is the second observer?'),
    say('', 'happy', '……そうしたら、答えます。私が、記録を人に渡せるようになった理由です、と。', '……到时候我就回答。是让我学会把记录交给别人的那个人。', '...Then I will answer. The reason I learned to hand my records to someone else.'),
    nar('那天傍晚你帮她把帆布包背到档案馆门口。包很重，她一路上回头看了三次——不是看包，是看你。', 'That evening you carry the canvas bag to the archive door for her. It is heavy. On the way she looks back three times: not at the bag, at you.')
  ]),
  done(5, 4, 4, '十九册记录交出去的那天', 'The day the nineteen volumes were handed over')
];
