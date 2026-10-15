import { D, say, joke, act } from './kit';

// 来我房间看电影
export const MOVIENIGHT = {
  asuka: D(
    ['明日香选了一部纪录片，说是\"学習にもなるから\"。她坐在沙发的最边上，和你之间隔着一个靠垫，像隔着一道三八线。', 'Asuka picks a documentary — \"it\'s educational.\" She sits at the very end of the sofa with a cushion between you like a border.'],
    ['纪录片讲的是企鹅。看到一只小企鹅跟妈妈走散的时候，她不知不觉把靠垫抱在了怀里，三八线没了。', 'It\'s about penguins. When a chick gets separated from its mother she unconsciously hugs the cushion — and the border disappears.'],
    ['小企鹅找到妈妈了。她松了一口气，然后发现自己离你只有十厘米。', 'The chick finds its mother. She exhales — then realizes she\'s ten centimetres from you.'],
    [say('明日香、今、ちょっと泣いてた？', '明日香，刚才你哭了一下？', 'Were you crying a little just now?', '温柔地问', 'Ask gently',
      ['shy', '……な、泣いてないわよ。……目にゴミが入っただけ。……こっち、見ないで。……もうちょっと、このままでいて。', '……我、我没哭。……只是眼睛进沙子了。……别看这边。……再这样待一会儿。', '...I-I wasn\'t. ...Something in my eye. ...Don\'t look. ...Stay like this a bit longer.'],
      ['明日香、今、ちょっと泣かせてた？', '使役「泣かせてた」是\"让（别人）哭\"，意思乱了。', '泣かせてた means \"was making someone cry\".'],
      ['明日香、ペンギンなんかで泣くの？', '\"为企鹅这种东西哭？\"「なんか」带着嘲笑。', 'なんか makes it mocking.']),
     joke('「三八线呢？被企鹅吃掉了？」', '"Where\'d the border go? Eaten by penguins?"', '打趣', 'Tease',
      ['angry', 'こ、国境は、一時的に解除されただけよ！　……休戦協定。……映画が終わるまで。', '国、国境只是暂时解除了！……停战协定。……到电影结束为止。', 'Th-the border is only temporarily lifted! ...A ceasefire. ...Until the film ends.']),
     act('拿一条毯子，盖在两个人的腿上', 'Spread a blanket over both your laps', '夜里有点冷', 'It\'s chilly',
      ['happy', '……温かい。……休戦協定、延長してもいいわよ。……次の映画まで。', '……好暖。……停战协定，延长也可以哦。……到下一部电影为止。', '...Warm. ...I could extend the ceasefire. ...Until the next film.'])]
  ),
  hikari: D(
    ['光带来了一部恐怖片，说\"一人やと怖いから\"。开场五分钟，她已经用靠垫挡住了半张脸。', 'Hikari brings a horror film — \"too scary alone.\" Five minutes in, half her face is behind a cushion.'],
    ['鬼出现的时候，她\"ぎゃー！\"地叫了一声，整个人扑到了你身上。然后她发现自己扑过来了，可是没有松开。', 'When the ghost appears she shrieks and throws herself onto you. Then she realizes what she\'s done — and doesn\'t let go.'],
    ['电影结束了。她还抓着你的袖子，小声说：\"……今日、帰り道、怖いかも\"。', 'The film ends. Still clutching your sleeve, she whispers: \"...The walk home might be scary.\"'],
    [say('じゃあ、家まで送るよ。', '那我送你回家。', 'Then I\'ll walk you home.', '负责到底', 'See it through',
      ['happy', 'ほんま！？　……えへへ、作戦成功。……あっ、ちゃう、ほんまに怖かってん！　……半分くらい。', '真的！？……嘿嘿，作战成功。……啊，不对，是真的害怕！……一半左右。', 'Really?! ...Hehe, mission accomplished. ...Wait, no, I really was scared! ...About half.'],
      ['じゃあ、家まで送られるよ。', '被动「送られる」是\"被送\"，变成你被她送了。', '送られる means \"be walked home\" — reversed.'],
      ['じゃあ、一人で頑張って。', '\"那你一个人加油\"，太冷了。', '\"Then good luck on your own\" — cold.']),
     joke('「你是不是故意选恐怖片的？」', '"Did you pick horror on purpose?"', '戳破', 'Call it',
      ['tease', '……バレた？　……怖いの選んだら、{name}くんにくっつけるかなって。……ホラーより、そっちのほうがドキドキしたわ。', '……被发现了？……想着选恐怖片的话，就能贴着你了。……比恐怖片还心跳。', '...Busted? ...I figured if it was scary, I could cling to you. ...That was more thrilling than the horror.']),
     act('换一部搞笑片，让她笑着回家', 'Switch to a comedy so she goes home laughing', '照顾她', 'Look after her',
      ['shy', '……{name}くん、優しいなあ。……でも、くっついたまま見てもええ？　……コメディでも。', '……你真温柔。……不过，可以贴着看吗？……就算是喜剧。', '...You\'re so kind. ...But can I keep clinging while we watch? ...Even a comedy.'])]
  ),
  rei: D(
    ['铃选了一部科幻片，讲宇宙和时间的。她看得很专注，偶尔小声指出\"この物理描写は不正確です\"，但没有一次要求暂停。', 'Rei picks a sci-fi film about space and time. She watches intently, occasionally murmuring that the physics is inaccurate — but never asks to pause.'],
    ['电影的结尾，主角穿越时间回到了女儿身边。铃没有说话。你转过头，看见她的眼睛里映着屏幕的光，有一滴眼泪。', 'At the end the hero crosses time to return to his daughter. Rei says nothing. You turn and see the screen\'s light in her eyes — and a single tear.'],
    ['她察觉到你在看她，没有擦眼泪，只是说：\"……物理的には、不可能です\"。', 'She notices you looking and doesn\'t wipe it away: \"...Physically impossible.\"'],
    [say('不可能でも、会いに行きたい気持ちは本物だよ。', '就算不可能，想去见的心情是真的。', 'Impossible or not, the wish to go see someone is real.', '回应她的眼泪', 'Respond to the tear',
      ['shy', '……。……そうですね。……私も、もし時間を越えられるなら、……今日に、戻ってきたいです。あなたのいる今日に。', '……。……是啊。……我也是，如果能穿越时间的话……想回到今天。有你在的今天。', '.... ...Yes. ...If I could cross time... I\'d come back to today. The today with you in it.'],
      ['不可能でも、会いに行かせたい気持ちは本物だよ。', '使役「行かせたい」是\"想让（别人）去\"，意思跑偏了。', '行かせたい means \"want to make someone go\".'],
      ['不可能なら、意味ないよね。', '\"不可能就没意义\"，太冷血。', '\"If it\'s impossible, it\'s meaningless\" — cold-blooded.']),
     joke('「你吐槽了七次物理描写，但一次都没要求暂停。」', '"You critiqued the physics seven times, but never paused it."', '打趣', 'Tease',
      ['tease', '……八回です。一回は、心の中で。……物語が良ければ、物理は許します。', '……八次。有一次是在心里。……故事好的话，物理就原谅它了。', '...Eight. One was silent. ...If the story\'s good, I forgive the physics.']),
     act('递给她一张纸巾，什么都不说', 'Hand her a tissue without a word', '不说破', 'Don\'t mention it',
      ['happy', '……ありがとうございます。……これは、光の反射による、生理的な涙です。……ということに、しておいてください。', '……谢谢。……这是光线反射引起的生理性眼泪。……就当是这样吧。', '...Thank you. ...These are physiological tears caused by light reflection. ...Let\'s say that.'])]
  ),
  inari: D(
    ['稻荷第一次看电影。屏幕亮起来的时候，她吓得往后一缩，问\"……箱の中に、人が閉じ込められておるのか\"。', 'It\'s Inari\'s first film. When the screen lights up she recoils: \"...Are people trapped in the box?\"'],
    ['你解释了半天，她终于接受了。看到一半，她已经完全入戏了，对着屏幕里的坏人喊\"成敗してくれる！\"，尾巴炸成了一团。', 'After much explaining she accepts it. Halfway through she\'s completely absorbed, shouting at the villain — \"I\'ll smite you!\" — tails puffed out.'],
    ['电影结束，主角和女主角在一起了。稻荷满意地点头：\"……縁が結ばれたな。良き哉\"。', 'The hero and heroine end up together. Inari nods in satisfaction: \"...The bond is tied. Good.\"'],
    [say('稲荷様、映画、気に入ってくれましたか。', '稻荷大人，喜欢电影吗？', 'Did you enjoy the film, Inari-sama?', '问她', 'Ask her',
      ['happy', '……うむ。……人の子は、夢を箱に詰めるのが上手いのう。……次も、そなたと見たい。', '……嗯。……人类真擅长把梦装进箱子里。……下次也想跟你一起看。', '...Mm. ...Human children are skilled at packing dreams into boxes. ...I want to watch with you again.'],
      ['稲荷様、映画、気に入ってあげましたか。', '「てあげました」是\"给（别人）\"，问她的感受要用「てくれました」。', 'てあげました faces outward; asking her, use てくれました.'],
      ['稲荷様には、ちょっと難しかったですか。', '\"对你来说有点难吧\"，小看她了。', '\"A bit hard for you?\" — condescending.']),
     joke('「你对着屏幕喊『成敗』，坏人吓到了吗？」', '"You shouted \'I\'ll smite you\' — did the villain flinch?"', '打趣', 'Tease',
      ['angry', 'ぬう……！　……あやつ、わらわを無視しおった。……箱の中の者には、神威も届かぬのか。', '呜……！……那家伙无视我。……箱子里的人，连神威都传不到吗。', 'Grr...! ...He ignored me. ...Does divine power not reach those in the box?']),
     act('做一碗油豆腐味的爆米花——嗯，就是撒了酱油的爆米花', 'Make her \"fried-tofu flavour\" popcorn — popcorn with soy sauce', '电影零食', 'Movie snack',
      ['happy', '……これは、何じゃ。……ぽりぽり。……うまい！　……映画より、こっちのほうが気に入ったかもしれぬ。', '……这是什么。……咔嚓咔嚓。……好吃！……比起电影，可能更喜欢这个。', '...What\'s this. ...Crunch crunch. ...Delicious! ...I may like this better than the film.'])]
  ),
  miyuki: D(
    ['深雪带来了一部老电影，是她学生时代最喜欢的爱情片。她说\"若い子には、退屈かもね\"，可是一直在偷偷观察你的反应。', 'Miyuki brings an old romance, her favourite from student days. \"Might be dull for a young one,\" she says — while secretly watching your reactions.'],
    ['电影里的男主角在雨中告白。深雪托着腮，小声地跟着念台词，一字不差。', 'The hero confesses in the rain. Chin in hand, Miyuki murmurs along with every line, word-perfect.'],
    ['电影结束了，她笑着说：\"……何回見ても、ここで泣いちゃうのよね\"。可是今天，她没有哭。', 'When it ends, she laughs: \"...Every time, I cry at that part.\" But today she didn\'t.'],
    [say('今日は、泣かなかったですね。', '今天，你没有哭呢。', 'You didn\'t cry today.', '注意到了', 'You noticed',
      ['shy', '……あら、気づいた？　……隣にあなたがいたから、かな。……映画より、こっちのほうが、ドキドキしちゃった。', '……哎呀，注意到了？……大概是因为你在旁边吧。……比起电影，这边更让我心跳。', '...Oh, you noticed? ...Maybe because you were beside me. ...This was more thrilling than the film.'],
      ['今日は、泣かせなかったですね。', '使役「泣かせなかった」是\"没让（别人）哭\"，意思乱了。', '泣かせなかった means \"didn\'t make someone cry\".'],
      ['今日も、泣いてましたね。', '\"今天也哭了呢\"——她没哭，你没在看她。', '\"You cried again\" — she didn\'t; you weren\'t watching her.']),
     joke('「台词你都会背，当年看了多少遍？」', '"You know every line — how many times did you watch it?"', '好奇', 'Curious',
      ['tease', '……三十回くらい？　……あの頃は、雨の中で告白されるのが夢だったの。……今は、どうかしらね。', '……三十次左右？……那时候，梦想就是在雨中被告白。……现在嘛，谁知道呢。', '...Thirty-ish? ...Back then my dream was a confession in the rain. ...Now, who knows.']),
     act('把窗户打开，外面正好在下雨', 'Open the window — it happens to be raining', '巧合', 'Coincidence',
      ['happy', '……！　……雨。……もう、ずるいわ。……何か、言いたいことがあるなら、今よ？', '……！……下雨了。……真是的，太狡猾了。……有什么想说的，就趁现在哦？', '...! ...Rain. ...Honestly, so unfair. ...If there\'s something you want to say, now\'s the time?'])]
  ),
  sora: D(
    ['空选了一部体育电影，讲一个落后的球队逆袭夺冠。她看得比你还投入，攥着拳头，跟着电影里的观众一起喊\"行けーっ！\"', 'Sora picks a sports film about underdogs winning it all. She\'s more into it than you, fists clenched, yelling \"Go!\" with the crowd on screen.'],
    ['最后一球进了的时候，她跳起来，跟你击掌，然后发现自己眼睛湿了，转过身去：\"……汗や、汗\"。', 'When the final shot goes in she jumps up to high-five you — then realizes her eyes are wet and turns away: \"...Sweat. It\'s sweat.\"'],
    ['她重新坐下来，靠在沙发上，说：\"……ウチも、いつかあんな風に、勝ちたいな\"。', 'Settling back on the sofa: \"...Someday I want to win like that.\"'],
    [say('空が勝つとき、一番前で応援するよ。', '你赢的时候，我会在最前面给你加油。', 'When you win, I\'ll be cheering in the front row.', '承诺', 'Promise',
      ['shy', '……一番前、か。……ほな、ゴールした瞬間、最初にお前の顔、探すわ。……おらんかったら、怒るで。', '……最前面吗。……那冲线的瞬间，我第一个找你的脸。……不在的话，我会生气。', '...Front row, huh. ...Then the moment I cross the line, I\'ll look for your face first. ...Not there and I\'ll be mad.'],
      ['空が勝つとき、一番前で応援されるよ。', '被动「応援される」是\"被加油\"，主客颠倒。', '応援される means \"be cheered\" — reversed.'],
      ['空は、ああいう風には勝てないと思う。', '\"你赢不了\"，她会把你踢下沙发。', '\"You can\'t win like that\" — she\'d kick you off the sofa.']),
     joke('「眼睛里的汗，是怎么流进去的？」', '"How did sweat get in your eyes?"', '戳破', 'Call it out',
      ['angry', '……う、うっさいわ！　……スポーツ選手は、目からも汗かくねん！　……常識や！', '……吵、吵死了！……运动员眼睛也会出汗！……常识！', '...Sh-shut up! ...Athletes sweat from their eyes too! ...Common knowledge!']),
     act('把电影里那个夺冠的镜头，再放一遍', 'Replay the championship scene', '再看一次', 'Watch it again',
      ['happy', '……！　……お前、ほんま、分かっとるな。……今度は、泣かへんで。……たぶん。', '……！……你真的懂我。……这次不哭了。……大概。', '...! ...You really get me. ...I won\'t cry this time. ...Probably.'])]
  ),
  nao: D(
    ['奈绪选了一部动画电影，是你们小时候一起在电视上看过的那部。她抱着膝盖，坐在你旁边，看得很安静。', 'Nao picks an animated film — the one you watched together on TV as kids. Hugging her knees beside you, she watches quietly.'],
    ['看到一半，她的头慢慢地靠到了你的肩膀上。你以为她困了，可她小声说：\"……ここ、むかしも、こうしてた\"。', 'Halfway through, her head slowly comes to rest on your shoulder. You think she\'s sleepy, but she whispers: \"...We sat like this back then, too.\"'],
    ['电影结束了。片尾曲响起来，她没有把头抬起来，跟着哼。', 'The film ends. The credits song plays; she doesn\'t lift her head, humming along.'],
    [say('また、一緒に見よう。何回でも。', '再一起看吧。多少次都行。', 'Let\'s watch it together again. As many times as we like.', '约定', 'A promise',
      ['shy', '……なんかいでも。……やくそく。……おとなに なっても。……おばあちゃんに なっても。', '……多少次都行。……约好了。……长大了也是。……变成老奶奶了也是。', '...As many times as we like. ...Promise. ...Even when we\'re grown. ...Even when I\'m a granny.'],
      ['また、一緒に見せよう。何回でも。', '「見せよう」是\"给（别人）看吧\"，意思不对。', '見せよう means \"let\'s show it to someone\".'],
      ['もう、子供っぽい映画はいいかな。', '\"这种幼稚的电影就算了吧\"，否定了你们的回忆。', '\"Enough childish films\" — dismisses your shared memory.']),
     joke('「你在哼片尾曲——小时候你也跑调吗？」', '"Humming the credits song — were you off-key as a kid too?"', '逗她', 'Tease',
      ['pout', '……あんたの ほうが、おんち だった。……いまも。……でも、いっしょに うたうと、ちょうど いい。', '……你才是音痴。……现在也是。……不过，一起唱的话，刚刚好。', '...YOU were the tone-deaf one. ...Still are. ...But together, it comes out right.']),
     act('跟她一起，小声哼片尾曲', 'Hum the credits song softly along with her', '一起', 'Together',
      ['happy', '……ふふ。……やっぱり、ずれてる。……でも、これが いい。……あたしたちの おと。', '……呵呵。……果然跑调了。……不过，这样就好。……我们的声音。', '...Hehe. ...Off-key, as expected. ...But this is good. ...Our sound.'])]
  ),
  maki: D(
    ['真希带来了一部动作片，说是\"ゲームの映画化\"。她看得非常挑剔，每隔五分钟就吐槽一次：\"原作やったら、ここでコンボ入るねん\"。', 'Maki brings an action film adapted from a game. She\'s merciless, griping every five minutes: \"In the original you\'d chain a combo here.\"'],
    ['可是看到主角为了救同伴牺牲的时候，她突然不说话了。你转过头，她已经用连帽衫的帽子盖住了整张脸。', 'But when the hero sacrifices himself for his comrades she goes silent. You turn: she\'s pulled her hood down over her whole face.'],
    ['片尾字幕滚动的时候，她从帽子里闷闷地说：\"……原作より、ええやん\"。', 'As the credits roll, a muffled voice from inside the hood: \"...Better than the original.\"'],
    [say('真希が気に入ってくれて、よかった。', '你喜欢就好。', 'I\'m glad you liked it.', '不戳破', 'Don\'t call it out',
      ['shy', '……べ、別に、気に入ったとかやないし。……でも、続編出たら、また一緒に見よな。……約束やで。', '……也、也不是喜欢什么的。……不过，出续集的话，再一起看吧。……约好了哦。', '...I-it\'s not like I liked it. ...But if there\'s a sequel, let\'s watch it together. ...Promise.'],
      ['真希が気に入ってあげて、よかった。', '「てあげて」是\"给（别人）\"，对她的感受要用「てくれて」。', 'てあげて faces outward; for her, てくれて.'],
      ['真希、泣いてる？', '直接问\"你哭了？\"——她会把帽子拉得更紧。', 'Asking \"are you crying?\" — she\'d pull the hood tighter.']),
     joke('「吐槽了一整部，最后却说比原作好？」', '"Griped the whole way, then says it beats the original?"', '打趣', 'Tease',
      ['angry', '……文句言うのと、好きなのは、両立するねん！　……ゲーマーの愛情表現や。', '……吐槽和喜欢是可以并存的！……这是玩家的爱的表达。', '...Complaining and loving can coexist! ...It\'s how gamers show affection.']),
     act('隔着帽子，轻轻拍拍她的头', 'Gently pat her head through the hood', '不揭穿', 'Without exposing her',
      ['happy', '……っ。……フード越しでも、バレてるやん。……ずるい、せんぱい。……もうちょっと、撫でてもええよ。', '……唔。……隔着帽子也被发现了。……狡猾，前辈。……再摸一会儿也行。', '...! ...Even through the hood you can tell. ...Unfair, senpai. ...You can keep patting a bit.'])]
  )
};
