import { D, say, joke, act } from './kit';

// 北野的爵士现场
export const JAZZ = {
  asuka: D(
    ['明日香说她只是\"教養のため\"来听爵士。她坐在小圆桌边，背挺得很直，点了一杯乌龙茶。萨克斯一响，她的手指开始在桌上轻轻打拍子。', 'Asuka says she\'s here purely \"for culture.\" At the little round table, back straight, she orders oolong tea. When the sax starts, her fingers begin tapping the table.'],
    ['一首曲子结束，大家鼓掌。她鼓得最认真，然后发现自己鼓得太认真了，马上停下来，假装在整理裙摆。', 'The song ends, everyone claps. She claps hardest, realizes it, stops, and pretends to straighten her skirt.'],
    ['下一首是一首慢歌。她的手指不打拍子了，只是静静地听着。', 'The next song is slow. Her fingers go still; she just listens.'],
    [say('明日香、さっき、リズム取ってたよね。', '明日香，刚才你在打拍子吧。', 'You were keeping the beat just now.', '说出来', 'Say it',
      ['shy', '……と、取ってないわよ。……ちょっとだけ。……このお店、また来てもいいかもね。……あなたと、なら。', '……我、我才没打。……只有一点点。……这家店，再来也不是不行。……如果是跟你的话。', '...I-I wasn\'t. ...Only a little. ...Maybe we could come back here. ...With you.'],
      ['明日香、さっき、リズム取られてたよね。', '被动「取られてた」是\"被拿走\"，意思错了。', '取られてた means \"was taken away\".'],
      ['明日香、さっき、退屈そうだったね。', '\"你刚才好像很无聊\"，跟事实相反。', '\"You looked bored\" — the opposite.']),
     joke('「教养用的爵士，打拍子也算教养吗？」', '"Jazz for culture — does tapping along count as culture?"', '吐槽', 'Snark',
      ['angry', '……リズム感も、教養の一部よ。……音楽の授業で、習ったでしょ。', '……节奏感也是教养的一部分。……音乐课上学过吧。', '...A sense of rhythm is part of culture. ...You learned that in music class.']),
     act('在慢歌的时候，把手放在桌上，离她的手很近', 'During the slow song, rest your hand on the table close to hers', '等她', 'Wait for her',
      ['happy', '……。……小指、当たってる。……曲が終わるまで、このままで、いいわよ。', '……。……小指碰到了。……到曲子结束为止，就这样也行。', '.... ...Our little fingers are touching. ...You can stay like this until the song ends.'])]
  ),
  hikari: D(
    ['光一进门就被灯光和音乐吸引住了。她说\"大人の世界や……\"，然后点了一杯橙汁，假装是鸡尾酒，用吸管优雅地喝。', 'Hikari is captivated by the lights and music — \"a grown-up world...\" She orders orange juice, pretends it\'s a cocktail, and sips it elegantly through the straw.'],
    ['鼓手独奏的时候，她忍不住跟着节奏晃脑袋。晃得太投入，碰倒了你的水杯。', 'During the drum solo she can\'t help bobbing her head. Too into it, she knocks over your water glass.'],
    ['她慌慌张张地道歉，用自己的手帕帮你擦。擦完了，她才发现手帕上印着一只很幼稚的小熊。', 'She apologizes frantically and wipes it up with her own handkerchief — only then noticing the childish teddy bear printed on it.'],
    [say('光ちゃんのノリ、ジャズに合ってるよ。', '你的节奏感，很适合爵士。', 'Your groove fits jazz.', '夸她', 'Praise her',
      ['happy', 'ほんま！？　……じゃあ、うち、大人の女になれるかな。……ハンカチ、クマやけど。', '真的！？……那我能变成大人了吗。……虽然手帕上是小熊。', 'Really?! ...Then maybe I can be a grown woman. ...Bear hanky notwithstanding.'],
      ['光ちゃんのノリ、ジャズを合ってるよ。', '「合う」前面用「に」：「ジャズに合ってる」。', '合う takes に: ジャズに合ってる.'],
      ['光ちゃんは、ここに合ってないね。', '\"你不适合这里\"，她会马上缩起来。', '\"You don\'t fit here\" — she\'d shrink.']),
     joke('「橙汁配吸管，这就是大人的鸡尾酒吗。」', '"OJ with a straw — so that\'s a grown-up cocktail."', '吐槽', 'Snark',
      ['pout', 'しーっ！　雰囲気が大事やねん！　……{name}くんも、何か頼んで、乾杯しよ。', '嘘——！氛围最重要！……你也点点什么，干杯吧。', 'Shh! It\'s about atmosphere! ...Order something too, let\'s toast.']),
     act('举起水杯，跟她的橙汁碰一下', 'Raise your water glass and clink it against her OJ', '陪她演', 'Play along',
      ['shy', '……乾杯。……なんか、ほんまにデートみたいやな。……みたい、ちゃうか。……デートや。', '……干杯。……感觉真的像约会呢。……不是「像」吧。……是约会。', '...Cheers. ...It really feels like a date. ...Not \"like\". ...It is one.'])]
  ),
  rei: D(
    ['铃说爵士是\"即興の数学\"：每个乐手都在规则里自由发挥。她闭着眼睛听，偶尔小声说出和弦的名字，\"ツー・ファイブ・ワン\"。', 'Jazz, says Rei, is \"improvised mathematics\": freedom within rules. Eyes closed, she occasionally murmurs chord names: \"two-five-one.\"'],
    ['钢琴手弹了一段很复杂的独奏，她睁开眼睛，看着钢琴手的手指，表情很认真，好像在解一道题。', 'The pianist plays an intricate solo. She opens her eyes and watches his fingers seriously, as if solving a problem.'],
    ['独奏结束，她转过头，问你：\"……今の、どう感じましたか。数学ではなく、あなたの感覚で\"。', 'When it ends, she turns: \"...How did that feel to you? Not mathematically — to you.\"'],
    [say('鈴が隣で聴いてたから、いつもより響いた。', '因为你在旁边听，比平时更有感触。', 'With you listening beside me, it resonated more than usual.', '用感觉回答', 'Answer from the heart',
      ['shy', '……それは、測定不能な答えです。……でも、私も、同じでした。', '……这是无法测量的答案。……不过，我也一样。', '...That\'s an unmeasurable answer. ...But it was the same for me.'],
      ['鈴が隣で聴かせたから、いつもより響いた。', '使役「聴かせた」是\"让（别人）听\"，意思跑偏。', '聴かせた means \"made someone listen\".'],
      ['よく分からなかった。数学のほうがいい。', '\"没听懂，还是数学好\"，她问的不是这个。', '\"Didn\'t get it, maths is better\" — not what she asked.']),
     joke('「你连和弦都能听出来——那我心跳的节奏你听得出来吗？」', '"You can hear chords — can you hear my heartbeat\'s rhythm?"', '大胆', 'Bold',
      ['tease', '……今、聴いています。……テンポ、百二十。アップテンポですね。……原因は、推測できます。', '……正在听。……速度一百二。是快板呢。……原因，我能推测出来。', '...I\'m listening now. ...Tempo, 120. Up-tempo. ...I can deduce the cause.']),
     act('跟着她，也闭上眼睛听', 'Close your eyes and listen, like her', '同频', 'Get on her wavelength',
      ['happy', '……目を閉じると、あなたの呼吸も聴こえます。……曲より、そちらのほうが、落ち着きます。', '……闭上眼睛，能听见你的呼吸。……比起曲子，那个更让人安心。', '...With eyes closed I can hear your breathing. ...It\'s more calming than the music.'])]
  ),
  inari: D(
    ['稻荷被这里昏暗的灯光和慵懒的音乐弄得很困惑。她说这里像\"夜の社\"，可是没有神，只有\"酔うた人の子\"。', 'The dim lights and lazy music puzzle Inari. It\'s like a night shrine, she says, but with no god — only tipsy humans.'],
    ['萨克斯手吹了一段很长的独奏，声音低沉，像在哭。稻荷的耳朵慢慢竖起来，尾巴不再晃了。', 'The sax player blows a long, low solo that sounds like weeping. Inari\'s ears slowly rise; her tails go still.'],
    ['曲子结束，她轻声说：\"……あの笛吹き、誰かを想うておるな\"。', 'When it ends, she says softly: \"...That piper is thinking of someone.\"'],
    [say('稲荷様には、音の中の気持ちが聞こえるんですね。', '稻荷大人能听见音乐里的心情呢。', 'You can hear the feelings inside the music.', '佩服', 'Be impressed',
      ['shy', '……長う生きておると、のう。……そなたの気持ちも、時々、聞こえておるぞ。……言わぬがな。', '……活得久了嘛。……你的心情，我有时候也听得见哦。……不说而已。', '...One lives long enough. ...I hear your feelings too, sometimes. ...I just don\'t say.'],
      ['稲荷様には、音の中の気持ちが聞こえられるんですね。', '「聞こえる」本身就有\"能\"的意思，不再加「られる」。', '聞こえる is already potential; no られる.'],
      ['稲荷様には、こういう音楽は分からないでしょう。', '\"你听不懂这种音乐吧\"，小看她了。', '\"You wouldn\'t understand this music\" — condescending.']),
     joke('「夜晚的神社里没有神，但现在有了。」', '"No god at this night shrine — well, there is now."', '甜一下', 'A sweet line',
      ['tease', '……うまいことを言う。……では、今宵の奉納は、何じゃ？　油揚げは、ここには無さそうじゃが。', '……说得真妙。……那今晚的供奉是什么？这里好像没有油豆腐。', '...Clever words. ...Then what is tonight\'s offering? There seems to be no fried tofu here.']),
     act('给她点一杯热牛奶加蜂蜜', 'Order her hot milk with honey', '她不喝酒', 'She doesn\'t drink',
      ['happy', '……甘い。……温かい。……この店で一番うまいのは、そなたが選んだこれじゃな。', '……甜的。……暖的。……这家店里最好喝的，就是你选的这杯了。', '...Sweet. ...Warm. ...The best thing in this shop is the one you chose.'])]
  ),
  miyuki: D(
    ['深雪在这里很自在，她跟店主打了个招呼，点了一杯无酒精的鸡尾酒，说\"今日は、あなたと一緒だから\"。', 'Miyuki is at home here. She greets the owner and orders a mocktail — \"since I\'m with you today.\"'],
    ['歌手唱了一首很老的情歌。深雪托着腮听，眼睛有点湿。她说这首歌，是她第一次失恋的时候，在这家店里听到的。', 'The singer performs an old love song. Chin in hand, Miyuki\'s eyes grow damp. She first heard it here, she says, the night of her first heartbreak.'],
    ['歌唱完了，她用手指擦了擦眼角，笑了：\"……もう、あの時みたいには、泣かないわね\"。', 'When it ends she dabs her eye with a finger and smiles: \"...I don\'t cry like I did then anymore.\"'],
    [say('今日から、この曲は違う思い出になりますよ。', '从今天起，这首歌会变成不同的回忆。', 'From today, this song becomes a different memory.', '改写回忆', 'Rewrite the memory',
      ['shy', '……あら。……上書き保存、ってこと？　……ふふ、あなたらしいわ。……いい思い出に、なりそう。', '……哎呀。……意思是覆盖存档？……呵呵，很像你。……好像会变成好的回忆。', '...Oh. ...Overwriting the save, you mean? ...Hehe, how like you. ...It might become a good memory.'],
      ['今日から、この曲は違う思い出になるですよ。', '动词原形后面不直接接「です」，说「なりますよ」。', 'A plain verb doesn\'t take です; say なりますよ.'],
      ['この曲を聞くと、悲しくなりますね。', '\"听这首歌会难过\"，把她拉回过去了。', '\"This song makes you sad\" — drags her back.']),
     joke('「第一次失恋……对方一定很后悔吧。」', '"Your first heartbreak — he must regret it."', '替她出气', 'Take her side',
      ['tease', 'ふふ、どうかしら。……でも、あの人が後悔してくれなかったから、今、あなたとここにいるのよ。', '呵呵，谁知道呢。……不过，正因为那个人没后悔，我现在才能跟你在这里。', 'Hehe, who knows. ...But because he didn\'t regret it, I\'m here with you now.']),
     act('请歌手再唱一遍这首歌', 'Ask the singer to perform the song again', '新的回忆', 'A new memory',
      ['happy', '……！　……もう、ずるい人。……今度は、隣にあなたがいる。……ちゃんと、覚えておくわ。', '……！……真是个狡猾的人。……这次，旁边有你。……我会好好记住的。', '...! ...You sly thing. ...This time you\'re beside me. ...I\'ll remember it properly.'])]
  ),
  sora: D(
    ['空说她不懂爵士，坐在那里像在等比赛开始。可是贝斯手开始独奏的时候，她的脚尖跟着节拍点地，越点越快。', 'Sora says she doesn\'t get jazz, sitting as if waiting for a match. But when the bassist solos, her toes tap the beat, faster and faster.'],
    ['她说贝斯的节奏\"走るリズムと同じや\"，像跑步时的呼吸。她闭上眼睛，好像在脑子里跑起来了。', 'The bass rhythm is \"the same as running,\" she says, like breathing on a run. She closes her eyes as if running in her head.'],
    ['曲子结束，她睁开眼睛，有点不好意思：\"……ジャズ、ちょっと分かったかも\"。', 'When it ends she opens her eyes, a little sheepish: \"...Maybe I get jazz a bit.\"'],
    [say('空の走るリズム、今度聴かせて。', '你跑步的节奏，下次让我听听。', 'Let me hear your running rhythm next time.', '接她的话', 'Pick up her thread',
      ['shy', '……走るリズムを、聴く？　……お前、ほんま変なこと言うな。……ほな、朝練、一緒に来い。横で聴かせたる。', '……听跑步的节奏？……你真会说怪话。……那就来晨练。在旁边让你听。', '...Hear my running rhythm? ...You say the weirdest things. ...Then come to morning practice. I\'ll let you hear it.'],
      ['空の走るリズム、今度聴いて。', '「聴いて」是\"你去听\"，你想听的话要说「聴かせて」（让我听）。', '聴いて asks HER to listen; to hear it yourself, 聴かせて.'],
      ['空にジャズは、やっぱり分からないよ。', '\"你还是不懂爵士\"，打击她刚萌芽的兴趣。', '\"You\'ll never get jazz\" — crushes her budding interest.']),
     joke('「你脚尖打拍子越打越快，是在冲刺吗。」', '"Your toe-tapping kept speeding up — sprinting?"', '吐槽', 'Snark',
      ['tease', '……ラストスパートや。……曲が終わるまでに、ゴールせなあかんねん。', '……最后冲刺。……要在曲子结束前到终点。', '...Final sprint. ...Had to hit the finish before the song ended.']),
     act('在桌子下面，也用脚尖跟她一起打拍子', 'Under the table, tap the beat with her', '一起跑', 'Run together',
      ['happy', '……へへ、ピッタリや。……お前と走ったら、ペース合うな。……知っとったけど。', '……嘿嘿，正好对上了。……跟你一起跑，步调很合。……我早就知道了。', '...Heh, perfectly in sync. ...Running with you, our pace matches. ...I knew it.'])]
  ),
  nao: D(
    ['奈绪很喜欢这里的昏暗。她说暗的地方，别人看不清她的脸，她就不用担心表情。她坐在角落里，点了一杯热可可。', 'Nao likes the dimness here: in the dark no one can see her face, so she needn\'t worry about her expression. In a corner seat she orders hot cocoa.'],
    ['钢琴手弹了一首很轻的曲子。奈绪听着听着，把头靠在了你的肩膀上。你以为她睡着了，可她的手指在桌上，跟着钢琴的旋律在动。', 'The pianist plays something soft. As she listens, Nao leans her head on your shoulder. You think she\'s asleep — but her fingers move on the table with the melody.'],
    ['曲子结束了。她没有把头抬起来。', 'The song ends. She doesn\'t lift her head.'],
    [say('このまま、次の曲も聴こうか。', '就这样，下一首也一起听吧。', 'Let\'s listen to the next song like this too.', '不打破', 'Don\'t break the moment',
      ['shy', '……うん。……くらいから、だいじょうぶ。……かお、みえないから。……あかく なってても。', '……嗯。……因为暗，没关系。……看不见脸。……就算脸红了也是。', '...Mm. ...It\'s dark, so it\'s okay. ...You can\'t see my face. ...Even if it\'s red.'],
      ['このまま、次の曲も聴かれようか。', '被动「聴かれよう」不成立，用「聴こう」。', '聴かれよう doesn\'t work; use 聴こう.'],
      ['重いから、ちょっと離れて。', '\"好重，离开一点\"，她会再也不靠过来。', '\"You\'re heavy, move\" — she\'d never lean on you again.']),
     joke('「你是睡着了，还是在装睡？」', '"Are you asleep, or pretending?"', '逗她', 'Tease',
      ['pout', '……ねてる。……ねてる ひとは、へんじ しない。……いまのは、ねごと。', '……睡着了。……睡着的人不会回答。……刚才那是梦话。', '...Asleep. ...Sleeping people don\'t answer. ...That was sleep-talking.']),
     act('不说话，轻轻调整肩膀，让她靠得更舒服', 'Say nothing; shift your shoulder so she can lean more comfortably', '默默地', 'Silently',
      ['happy', '……ちょうど いい たかさ。……むかしは、あたしのほうが せが たかかったのに。', '……正好的高度。……以前明明是我比较高。', '...Just the right height. ...I used to be taller than you.'])]
  ),
  maki: D(
    ['真希说爵士是\"音ゲーの最高難度\"，因为没有谱面，全靠即兴。她一边听一边在桌上敲，好像在打节奏游戏。敲着敲着，她皱起眉头：\"……判定、ガバガバやん\"。', 'Maki calls jazz \"the hardest rhythm-game difficulty\": no chart, all improvisation. She taps along on the table, then frowns: \"...The judgement windows are way loose.\"'],
    ['鼓手看见了她在敲桌子，冲她眨了眨眼，在下一段独奏里，敲出了跟她一样的节奏。真希愣住了，然后脸一下子红了。', 'The drummer spots her tapping, winks, and in his next solo plays her exact rhythm. Maki freezes, then goes bright red.'],
    ['曲子结束，她小声说：\"……ライブって、すごいな\"。', 'When it ends, she whispers: \"...Live music is amazing.\"'],
    [say('真希のリズム、プロに認められたね。', '你的节奏，被专业的认可了呢。', 'A pro just acknowledged your rhythm.', '夸她', 'Praise her',
      ['shy', '……せ、せやろか。……今日のこと、一生自慢するわ。……せんぱいが証人やで。', '……是、是吗。……今天的事，我要炫耀一辈子。……前辈是证人哦。', '...Y-you think so? ...I\'m bragging about today forever. ...You\'re my witness.'],
      ['真希のリズム、プロに認めたね。', '\"被……认可\"要用被动「認められた」。', '\"Acknowledged by\" needs the passive: 認められた.'],
      ['真希のリズム、ちょっとずれてたね。', '\"你节奏有点偏\"，她会立刻钻到桌子底下。', '\"Your rhythm was a bit off\" — she\'d hide under the table.']),
     joke('「爵士的判定太宽松，那你给它打几分？」', '"Loose judgement windows — what score do you give jazz?"', '接梗', 'Play along',
      ['tease', '……SSS。……判定ガバでも、楽しかったら勝ちや。……今日のせんぱいも、SSSやで。', '……SSS。……就算判定宽松，开心就赢了。……今天的前辈，也是SSS哦。', '...SSS. ...Loose judgement or not, if it\'s fun you win. ...Today\'s senpai is SSS too.']),
     act('学着那个鼓手，冲她眨眨眼', 'Wink at her, like the drummer did', '模仿', 'Copy him',
      ['angry', 'ちょ……！　……せんぱいのウインク、下手くそすぎて、逆に、ダメージ入るわ……！', '喂……！……前辈的眨眼太烂了，反而受到伤害了……！', 'Hey...! ...Your wink\'s so bad it actually does damage...!'])]
  )
};
