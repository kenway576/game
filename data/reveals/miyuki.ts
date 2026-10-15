import { say, joke, act } from './kit';

// 深雪：N3–N2，です・ます的柔和礼貌体，自称「お姉さん」。被夸会害羞地笑，被逗会温柔地反将一军。
export const MIYUKI_REVEALS = {
  summer: [
    say('バラの柄、深雪さんにぴったりです。', '玫瑰花纹，跟深雪小姐很配。', 'The rose print is perfect on you, Miyuki.', '用敬语夸', 'Praise her politely',
      ['shy', 'あら……ぴったり、だなんて。ふふ、久しぶりに、選ぶのに時間をかけてよかったわ。', '哎呀……说什么很配。呵呵，好久没花时间挑衣服了，真好。', 'Oh my... perfect, you say. Hehe, I am glad I took my time choosing for once.'],
      ['バラの柄、深雪さんをぴったりです。', '\"跟……很配\"用「に」：「深雪さんにぴったり」。', '\"Perfect for\" takes に, not を.'],
      ['バラの柄、深雪さんには似合いません。', '\"不适合深雪小姐\"，太失礼了。', '\"It does not suit you\" — rude.']),
    joke('「打扮得这么用心，是有约会吗？」', '"Dressed up so carefully. Have you got a date?"', '明知故问', 'Ask what you already know',
      ['tease', 'ええ、ありますよ。……今、目の前に。ふふ、困った顔、かわいいわね。', '嗯，有哦。……就在眼前。呵呵，你为难的样子好可爱。', 'Yes, I do. ...Right in front of me. Hehe, your flustered face is cute.']),
    act('把她手里的草编包接过来', 'Take her straw bag from her', '让她空出手', 'Free her hands',
      ['happy', 'ありがとう。……持ってもらうと、なんだか、本当にデートみたいね。', '谢谢。……让你拿着，总觉得真的像约会呢。', 'Thank you. ...Having you carry it makes it feel like a real date.'])
  ],
  school: [
    say('大事に取っておいたんですね。', '一直很珍惜地留着呢。', 'You kept it so carefully.', '不笑，接住她的话', 'Do not laugh — take her seriously',
      ['shy', '……そうね。捨てられなかったの。あの頃の私も、ちょっとだけ、見てほしかったのかしら。', '……是啊。舍不得扔。那时候的我，大概也有一点想被人看见吧。', '...Yes. I could not throw it away. Maybe the girl I was then wanted to be seen, a little.'],
      ['大事に取ってきたんですね。', '「取ってくる」是\"去拿来\"；\"一直留着\"要用「取っておく」。', '取ってくる means fetch; \"kept\" is 取っておく.'],
      ['大事に捨てたんですね。', '\"很珍惜地扔掉了\"，自相矛盾。', '\"Carefully threw it away\" — contradictory.']),
    joke('「那我该叫你学姐吗？」', '"Should I call you senpai, then?"', '顺势调侃', 'Tease along',
      ['tease', 'せ、先輩……！？　……もう一回、言ってみて？　……ふふ、冗談よ。でも、悪くないわね。', '学、学姐……！？……再说一遍试试？……呵呵，开玩笑的。不过，不坏呢。', 'S-senpai...?! ...Say it once more? ...Hehe, joking. Not bad, though.']),
    act('替她把领巾的结整理了一下', 'Straighten the knot of her sailor scarf', '她的手不知道放哪', 'Her hands do not know where to go',
      ['shy', '……結び方、忘れちゃってたの。……今日は、あなたがお兄さんみたいね。', '……结的打法我都忘了。……今天，你倒像哥哥一样呢。', '...I had forgotten how to tie it. ...Today you are like the older one.'])
  ],
  cardigan: [
    say('ボタン、今日はきちんと留めてますね。', '扣子今天扣得很整齐呢。', 'Your buttons are done up neatly today.', '注意到小变化', 'Notice the small change',
      ['surprised', '……気づいたの？　……ふふ、あなたに会うから、ちょっとだけ、きちんとしたのよ。', '……你注意到了？……呵呵，因为要见你，所以稍微整齐了一点。', '...You noticed? ...Hehe, I tidied up a little because I was seeing you.'],
      ['ボタン、今日はきちんと留まってますね。', '「留まる」是自动词，说\"她扣好了\"要用他动词「留めて」。', '留まる is intransitive; for her doing them up, use 留めて.'],
      ['ボタン、今日はきちんと外してますね。', '「外す」是\"解开\"，意思反了。', '外す means undo — the opposite.']),
    joke('「平常的打扮最自在，那我平常来就好。」', '"If ordinary is most comfortable, I will come ordinary too."', '轻松的玩笑', 'Light joke',
      ['happy', 'ええ、それでいいの。……二人とも普段着で、のんびりしましょ。', '嗯，那样就好。……两个人都穿平常的衣服，慢慢待着吧。', 'Yes, that is fine. ...Both in everyday clothes, let us take it easy.']),
    act('拉一拉她长到手背的袖子', 'Tug at the sleeve that reaches past her knuckles', '袖子太长了', 'The sleeve is too long',
      ['shy', 'あら、袖？　……この方が、手が温かいの。……つないだら、もっと温かいけど。', '哎呀，袖子？……这样手比较暖和。……牵着的话，会更暖和就是了。', 'Oh, the sleeve? ...It keeps my hands warm. ...Holding hands would be warmer, though.'])
  ],
  sundress: [
    say('海ガラスのブレスレット、きれいですね。', '海玻璃手链，好漂亮。', 'The sea-glass bracelet is beautiful.', '夸手链', 'Praise the bracelet',
      ['happy', 'この浜で拾ったのを、自分でつないだの。……あなたも、一緒に探してくれる？', '是在这片海滩捡的，自己串起来的。……你也愿意一起找吗？', 'I picked them up on this beach and strung them myself. ...Will you look with me?'],
      ['海ガラスのブレスレット、きれいくですね。', '「きれい」是な形容词，直接说「きれいですね」。', 'きれい is a na-adjective: きれいですね.'],
      ['海ガラスのブレスレット、汚いですね。', '「汚い」是\"脏\"，太失礼了。', '汚い means dirty — rude.']),
    joke('「泳装还太早的话，什么时候才不早？」', '"If a swimsuit is too soon, when is not too soon?"', '追问', 'Push the point',
      ['tease', 'ふふ、そうね……あなたが、私をちゃんと名前で呼べるようになったら、かしら。', '呵呵，是啊……等你能好好叫我的名字的时候吧。', 'Hehe, let me see... when you can call me by my name properly, perhaps.']),
    act('从她手里拿过遮阳帽，替她戴上', 'Take the sunhat from her hand and put it on her', '太阳很晒', 'The sun is strong',
      ['shy', '……あら。……かぶせてもらうなんて、子どもの時以来よ。……ありがとう。', '……哎呀。……被人戴帽子，还是小时候的事了。……谢谢。', '...Oh. ...Not since I was a child has anyone put a hat on me. ...Thank you.'])
  ],
  gown: [
    say('今夜は、ちゃんとエスコートします。', '今晚，我会好好护送你。', 'Tonight, I will escort you properly.', '接下她的邀请', 'Accept her request',
      ['shy', '……ふふ。頼もしいわ。……じゃあ、今夜だけは、お姉さんじゃなくて、私ね。', '……呵呵。好可靠。……那今晚，我就不是姐姐，只是我。', '...Hehe. How reliable. ...Then tonight I am not big sister — just me.'],
      ['今夜は、ちゃんとエスコートされます。', '被动「されます」是\"我会被护送\"，主客颠倒。', 'されます is passive — you would be the one escorted.'],
      ['今夜は、ちゃんとエスコートしません。', '\"今晚我不护送你\"，意思反了。', '\"Tonight I will not escort you\" — reversed.']),
    joke('「今晚换我来照顾你。叫我一声『哥哥』？」', '"Tonight I look after you. Call me big brother?"', '反客为主', 'Turn the tables',
      ['tease', 'あら、生意気。……でも、今夜は特別に許してあげる。……おにいさん。……ふふ、照れた？', '哎呀，真嚣张。……不过今晚特别准许。……哥哥。……呵呵，害羞了？', 'Oh, cheeky. ...But tonight, specially. ...Big brother. ...Hehe, blushing?']),
    act('向她伸出手臂', 'Offer her your arm', '像个大人', 'Like a grown-up',
      ['happy', '……ありがとう。……腕を組むなんて、何年ぶりかしら。', '……谢谢。……挽着手臂，有多少年没这样了呢。', '...Thank you. ...How many years since I last took someone\'s arm.'])
  ],
  apron: [
    say('エプロン、すごく似合ってます。', '围裙，很适合你。', 'The apron really suits you.', '夸她', 'Praise her',
      ['happy', 'ふふ、ありがとう。……じゃあ、あなたの分も用意してあるの。はい、どうぞ。', '呵呵，谢谢。……那么，你的那份我也准备好了。来，给你。', 'Hehe, thank you. ...I have one ready for you too. Here you go.'],
      ['エプロン、すごく似合います。', '此刻正穿着，用状态「似合ってます」更自然。', 'For what she has on now, 似合ってます is more natural.'],
      ['エプロン、すごく似合いません。', '\"很不适合\"，意思反了。', '\"Really does not suit you\" — reversed.']),
    joke('「今天的老师是深雪小姐吗？那我是学生。」', '"Is today\'s teacher Miyuki-sensei? Then I am the student."', '配合她', 'Play the student',
      ['tease', 'はい、生徒さん。まずは手を洗ってきてください。……先生の言うことは、絶対ですよ？', '好的，学生同学。请先去洗手。……老师的话，要绝对服从哦？', 'Yes, student. First go and wash your hands. ...The teacher\'s word is absolute, understood?']),
    act('先去洗手，回来替她把挽起的袖子再卷高一点', 'Wash your hands first, then roll her sleeves a little higher', '照她说的做', 'Do as she says',
      ['shy', '……あら、気が利くわね。……今日は、いい日になりそう。', '……哎呀，真细心。……今天好像会是个好日子。', '...Oh, how thoughtful. ...Today is going to be a good day.'])
  ],
  kimono: [
    say('あけましておめでとうございます。梅のかんざし、きれいです。', '新年快乐。梅花簪子真好看。', 'Happy New Year. Your plum-blossom hairpin is lovely.', '郑重地拜年', 'A proper greeting',
      ['happy', 'あけましておめでとうございます。……ちゃんと言えるようになったのね。お姉さん、うれしいわ。', '新年快乐。……你已经能好好说这句话了呢。姐姐好高兴。', 'Happy New Year. ...You can say it properly now. Big sister is so pleased.'],
      ['あけましておめでとうございます。梅のかんざし、きれいいです。', '「きれい」是な形容词，没有「きれいい」。', 'きれい is a na-adjective; there is no きれいい.'],
      ['あけましておめでとうございました。梅のかんざし、きれいです。', '新年祝词不用过去形「ございました」。', 'The New Year greeting is never put in the past.']),
    joke('「腰带勒得紧的话，年饭少吃一点？」', '"If the obi is tight, eat less at New Year dinner?"', '调侃', 'Tease',
      ['pout', 'もう、意地悪。……おせち、あなたの分まで作ってあるのに。', '真是的，坏心眼。……我连你那份年菜都做好了。', 'Honestly, mean. ...And I made New Year food for you too.']),
    act('扶着她走下神社的台阶', 'Steady her down the shrine steps', '和服不好走路', 'Kimono is hard to walk in',
      ['shy', '……ありがとう。……転ばないように、ずっと握っていてね。', '……谢谢。……为了不摔倒，要一直握着哦。', '...Thank you. ...So I do not fall, keep holding on.'])
  ]
};
