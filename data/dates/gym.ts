import { D, say, joke, act } from './kit';

// 体育馆投篮
export const GYM = {
  asuka: D(
    ['明日香站在罚球线上，手里抱着球，姿势标准得像体育课本上的插图——可球一直没有出手。她说她在\"计算抛物线\"。', 'Asuka stands on the free-throw line holding the ball in a textbook-perfect stance — and does not shoot. She says she is \"calculating the parabola.\"'],
    ['终于出手了。球擦着篮筐转了两圈，掉了出来。她盯着篮筐看了很久，说「……今のは、リングの整備不良よ」。', 'Finally she shoots. The ball rolls twice round the rim and drops out. She stares at the hoop: "...That was poor rim maintenance."'],
    ['她把球递给你，抬了抬下巴：轮到你了。', 'She hands you the ball and lifts her chin: your turn.'],
    [say('明日香さんのフォーム、きれいだった。', '明日香你的姿势很漂亮。', 'Your form was beautiful, Asuka.', '夸姿势不夸结果', 'Praise the form, not the result',
      ['shy', '……フォームだけ褒めても、意味ないでしょ。……でも、ありがと。次は入れるわ。', '……只夸姿势有什么用。……不过，谢谢。下一个我会投进的。', '...Praising only the form is pointless. ...But thanks. The next one goes in.'],
      ['明日香さんのフォーム、きれいかった。', '「きれい」是な形容词，过去形是「きれいだった」。', 'きれい is a na-adjective: きれいだった.'],
      ['明日香さんのフォーム、変だった。', '「変」是\"奇怪\"，她会再算一遍抛物线砸你。', '変 means weird.']),
     joke('「篮筐整备不良的话，要写报告吗？」', '"Poor rim maintenance — do we file a report?"', '顺着她的借口', 'Run with her excuse',
      ['angry', '書くわよ！　……書かないけど！　……もう、早く投げなさいよ！', '我会写的！……不写啦！……真是的，快投啦！', 'I will! ...I won\'t! ...Just shoot already!']),
     act('把球捡回来，再递给她一次', 'Fetch the ball and hand it back to her', '再给她一次机会', 'Another chance',
      ['happy', '……もう一回、ね。……見てなさいよ。今度は計算、完璧だから。', '……再来一次是吧。……看好了。这次计算完美。', '...One more, then. ...Watch. My calculation is perfect this time.'])]
  ),
  hikari: D(
    ['光在篮下抢篮板，抢到了就高高举起来喊「リバウンド！」，没人跟她抢也喊。整个体育馆只有你们两个，她一个人喊得像有一支球队。', 'Hikari is grabbing rebounds under the basket, holding each one up and shouting "Rebound!" though nobody contests it. With only the two of you in the gym, she sounds like a whole team.'],
    ['你投进了一个。她跳起来跟你击掌，击得手掌通红，然后甩着手说「いったー！　でも、うれしいー！」。', 'You sink one. She jumps up for a high five so hard both palms go red, then shakes her hand: "Ow! But I\'m so happy!"'],
    ['她把球塞回你手里，眼睛亮亮的。', 'She pushes the ball back into your hands, eyes shining.'],
    [say('次も入ったら、ハイタッチしよう。', '下一个也进的话，再击掌吧。', 'If the next one goes in, high five again.', '定个约定', 'Make a deal',
      ['happy', 'うん！　……あ、でも手ぇ痛いから、今度はそーっとな。そーっと。', '嗯！……啊，不过手好痛，这次轻一点哦。轻轻地。', 'Yes! ...Oh, but my hand hurts, so gently this time. Gently.'],
      ['次も入れば、ハイタッチしたい。', '「したい」是\"想要\"，邀请对方要用「しよう」。', 'したい means \"want to\"; to invite, use しよう.'],
      ['次は入らなかったら、ハイタッチしよう。', '\"没进的话就击掌\"，条件反了。', '\"If it does NOT go in\" — reversed.']),
     joke('「你一个人喊得，像有啦啦队。」', '"You shout like a whole cheer squad."', '调侃', 'Tease',
      ['tease', 'チアやったことあるもん！　……{name}くん専属の、な。', '我当过啦啦队嘛！……是{name}专属的哦。', 'I HAVE been a cheerleader! ...Your personal one.']),
     act('把球传给她，换你去抢篮板', 'Pass her the ball and go under the basket yourself', '换位置', 'Swap roles',
      ['happy', 'えっ、うちが投げるん？　……よーし、見ててや！　……あっ、外れた！　リバウンド頼む！', '诶，我来投？……好——，看着哦！……啊，没进！篮板拜托了！', 'Eh, me? ...Okay, watch! ...Ah, missed! Rebound, please!'])]
  ),
  rei: D(
    ['铃坐在体育馆的看台上，手里拿着一块秒表和一本笔记，像个教练，又像个裁判，更像一个误入体育馆的研究员。', 'Rei is sitting in the bleachers with a stopwatch and a notebook, part coach, part referee, mostly a researcher who wandered into the wrong building.'],
    ['你投了十个。她在本子上画了一条曲线，说你的命中率随疲劳度下降，但第七个球是一个\"有意义的离群值\"。', 'You shoot ten. She sketches a curve: your accuracy declines with fatigue, but shot seven is a \"meaningful outlier.\"'],
    ['她合上本子，走下看台，站到罚球线上。', 'She closes the notebook, comes down, and stands on the free-throw line.'],
    [say('鈴も、一回投げてみない？', '铃也投一个试试？', 'Want to try one, Rei?', '邀请她', 'Invite her',
      ['shy', '……理論は、理解しています。実践は、別問題です。……笑わないと、約束してください。', '……理论我理解。实践是另一回事。……请保证不笑。', '...I understand the theory. Practice is another matter. ...Promise not to laugh.'],
      ['鈴も、一回投げてみないか？', '意思相同，但「ないか」偏硬；对她用「ない？」更柔和。', 'Same meaning but ないか sounds stiff; ない？ is softer.'],
      ['鈴も、一回投げさせてみない？', '使役「投げさせて」变成\"让（别人）投\"，意思错了。', '投げさせて means making someone else throw.']),
     joke('「我的第七个球，可以写进论文吗？」', '"Can my seventh shot go in your paper?"', '借她的话', 'Borrow her words',
      ['tease', '……共著者として、名前を載せましょう。……ただし、再現性はありませんが。', '……我把你列为共同作者吧。……不过，没有可重复性就是了。', '...I will list you as co-author. ...It is not reproducible, though.']),
     act('站到她身后，帮她调整一下手肘的角度', 'Stand behind her and adjust the angle of her elbow', '教她', 'Coach her',
      ['surprised', '……角度、三度修正、ですね。……距離が近いので、心拍数が測定できません。', '……角度修正三度，对吧。……距离太近，没法测心率了。', '...A three-degree correction, then. ...You are too close; I cannot measure my heart rate.'])]
  ),
  inari: D(
    ['稻荷站在三分线外，手里转着篮球——用一根手指，转得很稳。她说千年前人们也玩过一种踢球的游戏，叫「蹴鞠」，她是冠军。', 'Inari is outside the three-point line spinning the ball on one finger, rock steady. She says a thousand years ago people played a kicking game called kemari, and she was the champion.'],
    ['她随手一扔，球空心入网。她回过头，嘴角挑着，九条尾巴在身后摇得像在鼓掌。', 'She tosses it casually — nothing but net. She turns back with a smirk, nine tails swishing behind her like applause.'],
    ['她把球滚到你脚边。', 'She rolls the ball to your feet.'],
    [say('今の、尻尾で狙ったんじゃないですか。', '刚才那个，是用尾巴瞄准的吧？', 'Did you aim that one with your tails?', '怀疑她作弊', 'Suspect cheating',
      ['tease', 'ほう、気づいたか。……冗談じゃ。尻尾は、喜んでおっただけよ。', '哦，被你发现了？……开玩笑的。尾巴只是在高兴而已。', 'Oh, you noticed? ...A jest. The tails were only happy.'],
      ['今の、尻尾が狙ったんじゃないですか。', '\"用尾巴瞄准\"表示手段要用「で」：「尻尾で」。', 'Instrument takes で: 尻尾で.'],
      ['今の、尻尾で狙われたんじゃないですか。', '被动「狙われた」是\"被尾巴瞄准\"，意思乱了。', '狙われた is passive — \"targeted by the tails\".']),
     joke('「蹴鞠冠军，篮球也是吗？」', '"Kemari champion — basketball too?"', '挑战她', 'Challenge her',
      ['happy', '今日から、そうなる。……そなたに勝てばの。来い。', '从今天起就是了。……只要赢了你。来吧。', 'From today, yes. ...If I beat you. Come.']),
     act('一言不发地投了一个，空心入网', 'Shoot one without a word — nothing but net', '用行动回答', 'Answer with action',
      ['surprised', '……！　……やるではないか、人の子。……もう一本、勝負じゃ。', '……！……有两下子嘛，人类的孩子。……再来一球，一决胜负。', '...! ...Not bad, human child. ...One more. A contest.'])]
  ),
  miyuki: D(
    ['深雪站在体育馆门口，手里拿着两瓶运动饮料，说她是来\"送补给\"的。她穿着拖鞋，所以不能上场——体育馆的规矩，她说，她还记得。', 'Miyuki is at the gym door with two sports drinks — "supplies," she says. She is in sandals so she cannot go on court; gym rules, she remembers them.'],
    ['你投篮，她在场边数，数到第十个，她说「すごいわね、半分も入ってる」。你知道只进了三个。她数的是另一种算法。', 'You shoot and she counts from the side. At ten she says, "Amazing, half of them went in." You know only three did. She uses a different maths.'],
    ['她把饮料递过来，瓶身上全是水珠。', 'She holds out a drink, beaded with condensation.'],
    [say('三つしか入ってないですよ。', '其实只进了三个。', 'Only three went in, actually.', '老实说', 'Be honest',
      ['tease', 'あら、そう？　……でも、三つも入ったのよ。お姉さんは、そっちを数えるの。', '哎呀，是吗？……不过，进了三个呢。姐姐只数进了的那些。', 'Oh, really? ...But three went in. Big sister counts those.'],
      ['三つだけしか入ってないですよ。', '「だけ」和「しか」意思重复，二选一。', 'だけ and しか double up; use one.'],
      ['三つしか入ってましたよ。', '「しか」后面必须接否定。', 'しか must be followed by a negative.']),
     joke('「深雪小姐的算法，考试能用吗？」', '"Can I use your maths in exams?"', '调侃', 'Tease',
      ['happy', 'ふふ、テストはダメよ。……人を数える時だけ、使っていいの。', '呵呵，考试不行哦。……只有数人的好的时候，才能用。', 'Hehe, not in exams. ...Only when counting someone\'s good points.']),
     act('接过饮料，一口气喝了一半，再递给她', 'Take the drink, drink half in one go, and hand it back', '分着喝', 'Share it',
      ['shy', '……あら。……間接、ね。……ふふ、いいわ。お姉さんも、いただきます。', '……哎呀。……间接的呢。……呵呵，好吧。姐姐也喝一口。', '...Oh my. ...Indirect, hm. ...Hehe, fine. I will have some too.'])]
  ),
  sora: D(
    ['空一个人在练三分球，你进门的时候她刚好投进第二十三个——她数着的。她没回头，只说「ボール拾い、頼むわ」。', 'Sora is drilling threes alone. As you come in she sinks number twenty-three — she is counting. Without turning: "Grab the rebounds, would you."'],
    ['你捡了二十个球，她进了十七个。最后一个进的时候，她转过身，第一次正眼看你，说「お前が拾うと、リズムええな」。', 'You fetch twenty balls; she makes seventeen. On the last one she turns and looks at you properly for the first time: "Rhythm\'s good when you rebound."'],
    ['她把球扔给你：「一本、勝負せえ」。', 'She throws you the ball: "One shot. Face me."'],
    [say('いいよ。でも、手加減して。', '好啊。不过，手下留情。', 'Sure. But go easy on me.', '接受，但讨饶', 'Accept, but beg mercy',
      ['tease', 'アホか。手加減したら、勝負の意味ないやろ。……けど、フリースローからでええで。', '笨蛋。手下留情的话，比还有什么意义。……不过，从罚球线开始也行。', 'Idiot. Going easy defeats the point. ...But you can start from the free-throw line.'],
      ['いいよ。でも、手加減しろう。', '没有「しろう」这种形；请求用「して」。', 'There is no しろう; use して.'],
      ['いいよ。でも、手加減しないで。', '\"别手下留情\"，跟讨饶的意思反了。', '\"Do not go easy\" — the opposite.']),
     joke('「我捡球是不是该收费？」', '"Shouldn\'t I charge for rebounding?"', '讨价还价', 'Haggle',
      ['happy', 'ほな、帰りにたこ焼きな。……八個入りのやつ。ウチが五個な。', '那回去请你吃章鱼烧。……八个装的。我吃五个。', 'Then takoyaki on the way home. ...The pack of eight. I get five.']),
     act('不说话，直接站到她面前防守', 'Without a word, step in front of her to defend', '真的开打', 'Play for real',
      ['surprised', '……お、ディフェンスか。……ええやん。燃えてきたわ。', '……哦，防守吗。……不错嘛。燃起来了。', '...Oh, defence? ...Nice. Now I\'m fired up.'])]
  ),
  nao: D(
    ['奈绪坐在体育馆角落的一个跳箱上，晃着腿，看你投篮。她说她不会打篮球，但她会\"看\"——她看了你十年，什么都看过了。', 'Nao sits on a vaulting box in the corner, legs swinging, watching you shoot. She cannot play, she says, but she can watch — ten years of watching you, she has seen everything.'],
    ['你投偏了一个，她说「右によれるの、むかしから」。你投准了一个，她说「たまたま」。', 'You miss to the right. "You always pull right. Since forever." You make one. "Fluke."'],
    ['她从跳箱上跳下来，伸出两只手。', 'She hops off the box and holds out both hands.'],
    [say('奈緒も、やってみる？教えるよ。', '奈绪也试试？我教你。', 'Want to try, Nao? I\'ll teach you.', '换你来教她', 'Teach her for once',
      ['shy', '……あんたに おそわるの、はじめてかも。……ちゃんと おしえてよ。', '……被你教，可能是第一次。……要好好教哦。', '...Maybe the first time you have taught me anything. ...Teach properly.'],
      ['奈緒も、やってみる？教えられるよ。', '「教えられる」是可能形\"能教\"或被动\"被教\"，这里会听成\"我会被教\"。', '教えられる can read as passive — \"I will be taught.\"'],
      ['奈緒も、やってみる？教えないよ。', '\"我不教你\"，邀请变成了拒绝。', '\"I won\'t teach you\" — reversed.']),
     joke('「十年了，你也该学会了吧。」', '"Ten years watching — you should know how by now."', '翻她的话', 'Use her line',
      ['pout', '……みてるのと、やるのは ちがう。……あんたの へたなとこ、まねしたくないし。', '……看和做不一样。……我也不想学你烂的地方。', '...Watching and doing are different. ...And I don\'t want to copy your bad habits.']),
     act('把球轻轻抛给她', 'Toss the ball gently to her', '慢慢来', 'Easy does it',
      ['surprised', 'わっ。……とれた。……とれたよ。……なげても いい？', '哇。……接住了。……接住了哦。……我可以投吗？', 'Whoa. ...Caught it. ...I caught it. ...Can I throw?'])]
  ),
  maki: D(
    ['真希在体育馆里放着音乐，一边运球一边踩拍子——运球的节奏跟音游一模一样。你进门的时候，她正好在一个\"パーフェクト\"上把球砸进了篮筐。', 'Maki has music on in the gym and is dribbling to the beat — the rhythm is pure rhythm game. As you walk in she slams the ball through the hoop on a \"Perfect.\"'],
    ['她说篮球就是\"判定の甘い音ゲー\"。然后她连投三个都没进，说是\"今日の譜面、難しいわ\"。', 'She says basketball is just \"a rhythm game with generous timing.\" Then she misses three in a row: \"Today\'s chart is hard.\"'],
    ['她把音乐调大，把球扔给你：「せんぱい、合わせてみ？」', 'She turns the music up and throws you the ball: "Senpai, try matching it."'],
    [say('リズムに合わせるの、難しいね。', '跟着节奏来，好难啊。', 'Matching the rhythm is hard.', '老实说', 'Be honest',
      ['tease', 'せやろ〜？　ウチが天才なだけやねん♡　……ほら、四つ打ちで。いち、に、さん、し！', '对吧～？我只是天才而已♡……来，按四拍。一、二、三、四！', 'Right~? I\'m just a genius. ...Come on, four on the floor. One, two, three, four!'],
      ['リズムで合わせるの、難しいね。', '\"配合……\"用「に合わせる」，不是「で」。', '\"Match to\" is に合わせる, not で.'],
      ['リズムに合わせるの、簡単だね。', '\"很简单\"，等于向她挑衅。', '\"It\'s easy\" — a challenge to her.']),
     joke('「判定这么宽松，那我刚才那个也算『Good』吧。」', '"With timing that generous, my last miss counts as a Good."', '给自己找台阶', 'Find an excuse',
      ['happy', 'ミスはミスやで、ざぁこ♡　……でも、フォームは「グレート」くらいあげてもええわ。', '没进就是没进，杂鱼♡……不过，姿势给你个「Great」也行。', 'A miss is a miss, loser. ...But your form gets a \"Great\", maybe.']),
     act('把音乐的音量调回来一点，跟她一起踩拍子', 'Turn the music back down a little and tap the beat with her', '配合她', 'Join her rhythm',
      ['shy', '……お、リズム感あるやん。……二人で踏むと、なんか、変な感じやな。', '……哦，节奏感不错嘛。……两个人一起踩，总觉得好奇怪。', '...Oh, you\'ve got rhythm. ...Stepping in time together feels weird.'])]
  )
};
