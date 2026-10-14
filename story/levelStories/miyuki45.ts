import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 深雪 · 第④段「わがままの練習」 / 第⑤段「おかゆ、半分こ」
//
// 【③之后还剩什么】
// ③：被叫了名字。相爱线她承认"做多了"一次都不是真的；挚友线她把 202 的备用钥匙给了你，
// 紧急联络人那一栏写上了你。
// 但她还是只会给。"我想要"这一栏，她一年里一次都没填过。
//
// ④：她第一次提一个**为自己**的要求——想去水族馆看水母。
//    她说出口的方式非常深雪：先找了三个"其实是为了你"的理由，
//    被你一个一个拆掉之后，才小声说出第四个：「……私が、見たいの」。
//    薇尔莉特那条线的延长：第一次写给自己的信，第二封是"我想要"。
// ⑤：她感冒了。全楼的应急联络人，第一次需要别人来应急。
//    挚友线里是那把备用钥匙第一次被用上；相爱线里是你自己的钥匙。
//    你做粥，做多了——两人份。她看着那两碗，笑出声：「作りすぎ、ね」。
//    "做多了"这句谎话终于换了个人说，而且这一次是真的。
//
// 【动画】④：巨大的水母水槽，蓝光里她把手贴在玻璃上，回头笑。
//         ⑤：202 的被炉边，粥碗冒着热气，她裹着毯子，捧着碗，眼睛笑弯了。
// ---------------------------------------------------------

const K = kit(CharacterId.MIYUKI, 'bg-violet-400', '深雪', 'Miyuki');
const { scene, nar, say, me, choice, fork, anime, done } = K;

export const MIYUKI_STORY_4: StoryNode[] = [
  scene('apartment_balcony', 'わがままの練習', 'Practising Selfishness', '傍晚 · 海风庄的阳台', 'Early evening · The Umikaze balcony', 'chat'),
  nar('她在阳台上叫住你。手里拿着一张从超市传单上剪下来的小广告：须磨海滨水族园。', 'She calls to you from the balcony. In her hand is a little advert clipped from a supermarket flyer: Suma Aqualife Park.'),
  say('cardigan', 'neutral', 'あのね。今度のお休み、もし空いてたら、なんだけど。', '那个。下次休息日，如果你有空的话。', 'Um. Your next day off, if you happen to be free.'),
  say('cardigan', 'neutral', '水族館、行かない？ ……ほら、あなた、海の生き物の言葉、まだ習ってないでしょう？ 勉強になると思うの。', '要不要去水族馆？……你看，海洋生物的单词，你还没学过吧？我觉得能学到东西。', 'Would you like to go to the aquarium? ...You haven\'t learned the words for sea creatures yet, have you? It would be good study.'),
  nar('第一个理由：为了你的学习。', 'Reason one: your studies.'),
  say('cardigan', 'neutral', 'それに、最近ずっと勉強ばっかりだったし、息抜きも大事だし。', '而且你最近一直都在学习，放松一下也很重要。', 'And you\'ve been studying nonstop lately. A break is important too.'),
  nar('第二个理由：为了你的身体。', 'Reason two: your wellbeing.'),
  say('cardigan', 'neutral', '……あと、チケットが、商店街の福引で当たって。二枚。もったいないでしょう？', '……还有，票是商店街抽奖抽中的。两张。浪费了多可惜。', '...And I won the tickets in the shopping street raffle. Two of them. It would be a waste.'),
  nar('第三个理由：不能浪费。三个理由，没有一个是她自己。', 'Reason three: waste not. Three reasons, and not one of them is her.'),
  choice('她把广告折了又折，等你回答。', 'She folds the advert smaller and smaller, waiting for your answer.', [
    { id: 'mi4_why', zh: '「深雪は、行きたい？」', en: '"Do you want to go, Miyuki?"', jp: '深雪は、行きたい？', hintZh: '问她自己', hintEn: 'Ask about her',
      aff: 7, fam: 4, stat: 'guts',
      then: [
        nar('她张了张嘴，又闭上。这个问题比三个理由加在一起都难回答。', 'She opens her mouth, then closes it. That question is harder than all three reasons put together.'),
        say('cardigan', 'shy', '……私が、見たいの。クラゲ。一度、ちゃんと見てみたかったの。', '……是我，想看。水母。一直想好好看一次的。', '...I want to see them. The jellyfish. I\'ve always wanted to see them properly, just once.', [{ jp: 'クラゲ', reading: 'くらげ', zh: '水母', en: 'jellyfish' }])
      ] },
    { id: 'mi4_raffle', zh: '「福引、当たったの？ 本当に？」', en: '"You won a raffle? Really?"', jp: '福引、当たったの？本当に？', hintZh: '戳穿第三个', hintEn: 'Poke the third one',
      aff: 5, fam: 6, stat: 'charm',
      then: [
        say('cardigan', 'pout', '……当たってません。買いました。', '……没抽中。是买的。', '...I didn\'t win them. I bought them.'),
        say('cardigan', 'shy', '……私が、見たかったから。クラゲ。', '……因为我想看。水母。', '...Because I wanted to see them. The jellyfish.')
      ] },
    { id: 'mi4_yes', zh: '「行く。理由はいらないよ。」', en: '"I\'ll go. You don\'t need a reason."', jp: '行く。理由はいらないよ。', hintZh: '不需要理由', hintEn: 'No reason needed',
      aff: 6, fam: 5, stat: 'kindness',
      then: [
        say('cardigan', 'surprised', '……いらないの？', '……不需要吗？', '...I don\'t?'),
        say('cardigan', 'shy', '……じゃあ、一個だけ言わせて。本当の理由。……クラゲが、見たいの。私が。', '……那，让我说一个就好。真正的理由。……我想看水母。是我想看。', '...Then let me say just one. The real one. ...I want to see the jellyfish. Me.')
      ] }
  ]),
  nar('"我想要"。你认识她一年，第一次听她说这三个字。', 'I want. In a year of knowing her, the first time you have heard her say it.', undefined, [{ jp: 'わがまま', reading: 'わがまま', zh: '任性', en: 'selfishness, a selfish wish' }]),
  scene('suma_aquarium', undefined, undefined, undefined, undefined, 'town'),
  nar('休息日的水族馆。她在海豚表演那里待了三分钟，在企鹅那里待了五分钟，在水母的展区待了四十分钟。', 'The aquarium on your day off. She spends three minutes at the dolphin show, five at the penguins, and forty in the jellyfish hall.'),
  nar('那是一整面墙的圆柱形水槽，蓝色的光，几百只水母慢慢地开合。像在呼吸，又像什么都不想。', 'A whole wall of cylindrical tanks in blue light, hundreds of jellyfish slowly opening and closing. As if breathing. As if thinking of nothing at all.'),
  say('cardigan', 'neutral', '……この子たち、心臓も脳もないんですって。それなのに、ちゃんと生きてるの。', '……听说这些孩子没有心脏，也没有大脑。可是它们好好地活着呢。', '...Apparently they have no heart and no brain. And they still live, perfectly well.'),
  say('cardigan', 'happy', '誰かのためじゃなくて、ただ、漂ってるだけで。……いいなぁ、って。', '不为了谁，只是飘着而已。……真好啊，我想。', 'Not for anyone. Just drifting. ...I envy that.'),
  anime(4),
  fork([
    nar('出口的商店里，她在水母的钥匙扣前面站了很久。最后她拿了两个，一个蓝的，一个粉的。', 'In the shop by the exit she stands in front of the jellyfish key rings for a long time. In the end she takes two, one blue, one pink.'),
    say('cardigan', 'shy', '……今日は、わがままの日だから。お揃い、してもいい？', '……今天是任性日嘛。可以戴一对的吗？', '...Today is my selfish day. Can we have matching ones?'),
    nar('你说可以。她把蓝色那个挂到了你的钥匙上——就在 202 的那把钥匙旁边。', 'You say yes. She hangs the blue one on your keys, right next to the key to 202.')
  ], [
    nar('出口的商店里，她给楼里每个人都挑了一样小东西，挑了二十分钟。然后她停了一下，又回去，给自己挑了一个水母的钥匙扣。', 'In the shop by the exit she spends twenty minutes picking a little something for everyone in the building. Then she stops, goes back, and picks out a jellyfish key ring for herself.'),
    say('cardigan', 'happy', '……自分にお土産買うの、初めて。', '……给自己买纪念品，还是第一次。', '...It\'s the first time I\'ve bought a souvenir for myself.'),
    nar('她把它挂在了那把备用钥匙原来挂着的地方。那把钥匙现在在你那儿。', 'She hangs it where the spare key used to hang. That key is with you now.')
  ]),
  done(4, 4, 4, '她第一次说"我想要"', 'The first time she said "I want"')
];

export const MIYUKI_STORY_5: StoryNode[] = [
  scene('kitchen', 'おかゆ、半分こ', 'Rice Porridge, Split Two Ways', '傍晚 · 202 室', 'Early evening · Room 202', 'chat'),
  nar('那天傍晚 202 没有饭菜的味道飘出来。一年里，这是第一次。', 'That evening no cooking smells drift out of 202. For the first time in a year.'),
  nar('你敲门，没有人应。手机上有一条她两个小时前发的消息，只有三个字：「ごめんね」。', 'You knock. No answer. On your phone is a message she sent two hours ago. Three characters: Sorry.'),
  fork([
    nar('你用自己的钥匙开了门——她给你的那一把，不是备用的。', 'You open the door with your own key: the one she gave you, not the spare.')
  ], [
    nar('你用那把备用钥匙开了门。它在你的钥匙圈上挂了好几个月，这是第一次被用上。', 'You open the door with the spare key. It has hung on your key ring for months. This is the first time it has been used.')
  ]),
  nar('她裹着毯子窝在被炉里，额头烫得吓人。桌上摊着楼里各家的值班表——她发着烧，还在排下个月的垃圾当番。', 'She is huddled in a blanket at the kotatsu, her forehead frighteningly hot. On the table is the building\'s rota. Running a fever, and she is still drawing up next month\'s rubbish duties.'),
  say('cardigan', 'sad', '……あら。ごめんなさい、今日、ご飯作れなくて。', '……哎呀。对不起，今天，没能做饭。', '...Oh. I\'m sorry. I couldn\'t make dinner today.'),
  nar('她发烧烧到三十八度五，第一句话是道歉。因为今天没给你做饭。', 'She has a fever of thirty-eight and a half, and the first thing out of her mouth is an apology. For not cooking for you.', undefined, [{ jp: '熱', reading: 'ねつ', zh: '发烧、热度', en: 'fever' }]),
  choice('她想站起来。', 'She tries to get up.', [
    { id: 'mi5_sit', zh: '「今日は座ってて。こっちが作る。」', en: '"Sit. I\'m cooking today."', jp: '今日は座ってて。こっちが作る。', hintZh: '换你', hintEn: 'Your turn',
      aff: 6, fam: 6, stat: 'kindness',
      then: [say('cardigan', 'surprised', '……あなたが？', '……你？', '...You?'), say('cardigan', 'shy', '……はい。座ってます。', '……好。我坐着。', '...All right. I\'ll sit.')] },
    { id: 'mi5_rota', zh: '把值班表收走', en: 'Take the rota away from her', hintZh: '先没收这个', hintEn: 'Confiscate that first',
      aff: 5, fam: 7, stat: 'guts',
      then: [say('cardigan', 'pout', 'あっ、それ、まだ途中……', '啊，那个，还没排完……', 'Ah, that\'s not finished...'), me('明日やる。手伝うから。', '明天再弄。我帮你。', 'Tomorrow. I\'ll help.'), nar('她看着空了的桌面，好像不知道手该放哪儿。', 'She looks at the empty table as if she does not know where to put her hands.')] },
    { id: 'mi5_sorry', zh: '「謝るの、今日は禁止。」', en: '"No apologising today."', jp: '謝るの、今日は禁止。', hintZh: '一个规矩', hintEn: 'A rule',
      aff: 7, fam: 4, stat: 'charm',
      then: [say('cardigan', 'surprised', '……ごめ、', '……对不，', '...Sorr—'), nar('她自己捂住了嘴。然后在毯子里笑了，笑得咳嗽起来。', 'She covers her own mouth. Then laughs into the blanket until she coughs.')] }
  ]),
  nar('你在她的厨房里煮了一锅粥。用的是她那口锅——两人份的那一口。', 'You make a pot of rice porridge in her kitchen. In her pot: the one sized for two.', undefined, [{ jp: 'おかゆ', reading: 'おかゆ', zh: '粥', en: 'rice porridge' }]),
  nar('米放多了。你不太会估量。端出来的时候是满满两大碗。', 'Too much rice. You are not good at judging it. What comes out is two big bowls, full to the brim.'),
  nar('她看着那两碗，看了很久，然后笑出了声。', 'She looks at the two bowls for a long time, and then she laughs.'),
  say('cardigan', 'happy', '……作りすぎ、ね。', '……做多了，呢。', '...Made too much, didn\'t you.'),
  nar('一整年，这句话都是她说的谎。现在它换了一个人说，而且这一次，是真的做多了。', 'For a whole year, that line was her lie. Now someone else is saying it, and this time it really is too much.'),
  anime(5),
  fork([
    say('cardigan', 'shy', '……ねえ。今日だけ、甘えてもいい？', '……呐。就今天，可以撒个娇吗？', '...Hey. Just for today, can I lean on you?'),
    nar('她把头靠在你肩上，一勺一勺地吃，吃得很慢。吃完了，她没有起来去洗碗。这是这一年里她第一次没有抢着去洗碗。', 'She leans her head on your shoulder and eats slowly, spoon by spoon. When she is done she does not get up to wash the bowls. The first time all year she has not raced to the sink.'),
    say('cardigan', 'shy', '……看病されるのって、こんなに、恥ずかしいのね。', '……被人照顾，原来是这么，难为情的事啊。', '...Being looked after is this embarrassing, it turns out.'),
    nar('你说下次她还可以再难为情一次。她说那她要多发几次烧。你说那不行。她闭着眼睛笑了。', 'You say she is allowed to be embarrassed again next time. She says then she will have to run more fevers. You say no. She laughs with her eyes closed.')
  ], [
    say('cardigan', 'happy', '緊急連絡先って、こういうことなのね。……書いておいて、よかった。', '紧急联络人，原来是这么回事啊。……写上你，真是太好了。', 'So this is what an emergency contact is for. ...I\'m glad I wrote you in.'),
    nar('她把那碗粥吃得一粒不剩，然后把碗推过来，有点不好意思地说：还有吗。', 'She eats every grain, then pushes the bowl over and asks, a little sheepishly, whether there is any more.'),
    nar('她的锅是两人份的。这一次，两份都是她的。', 'Her pot holds two. Tonight, both portions are hers.')
  ]),
  done(5, 4, 4, '做多了的那锅粥', 'The pot of porridge that made too much')
];
