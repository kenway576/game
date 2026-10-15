import { D, say, joke, act } from './kit';

// 两个人的卡拉OK
export const KARAOKE = {
  asuka: D(
    ['明日香翻点歌器翻得很快，最后点了一首很老的、节奏很慢的歌。她说「声域が合うから」，可你看见她点之前，先确认了一下歌词里有没有\"恋\"字。', 'Asuka flicks through the songbook and picks an old, slow song — \"it suits my range.\" But you saw her check the lyrics for the word \"love\" first.'],
    ['她唱的时候站得笔直，像在朗读课文。唱到副歌，她的声音突然软了一下，然后马上又站直了。', 'She sings standing bolt upright, like reciting a text. At the chorus her voice softens for a moment — then she straightens again.'],
    ['分数出来了：九十二。她看了一眼，没说话，把话筒递给你。', 'The score: ninety-two. She glances, says nothing, and hands you the mic.'],
    [say('サビのところ、すごくよかった。', '副歌那里，特别好听。', 'The chorus was really beautiful.', '夸她那一下', 'Praise that moment',
      ['shy', '……サ、サビだけ？　……あ、あそこは、ちょっと、気持ちが入っただけよ。', '……只、只有副歌？……那、那里只是稍微投入了一点感情而已。', '...Only the chorus? ...Th-that was just a bit of feeling getting in.'],
      ['サビのところ、すごくよい。', '「よい」偏书面；而且说刚唱完的事用过去形「よかった」。', 'よい is stiff, and it just happened — use よかった.'],
      ['サビのところ、すごくひどかった。', '「ひどい」是\"很糟\"，她会把话筒摔了。', 'ひどかった means awful.']),
     joke('「班长，你点歌前检查歌词，是怕有『恋』字吗？」', '"Class rep — checking for \'love\' in the lyrics?"', '揭穿', 'Expose her',
      ['angry', 'み、見てたの！？　……検閲よ、検閲！　風紀委員として当然の確認！', '你、你看见了！？……是审查，审查！作为风纪委员理所当然的确认！', 'Y-you saw?! ...Censorship! A natural check for a disciplinary officer!']),
     act('点一首她刚才唱的那首的对唱版', 'Queue up the duet version of the song she just sang', '跟她一起', 'Join her',
      ['shy', '……デュエット版なんて、あったの。……し、仕方ないわね。間違えたら、承知しないわよ。', '……还有对唱版啊。……真、真拿你没办法。唱错了的话，不饶你。', '...There\'s a duet version? ...F-fine. Get it wrong and you\'re dead.'])]
  ),
  hikari: D(
    ['光点了一首动画歌，前奏一响就跳起来了，一只手拿话筒，一只手挥舞，唱得比原唱还用力。分数八十七，她说「機械が厳しい！」', 'Hikari picks an anime song and is on her feet at the intro, mic in one hand, waving the other, singing harder than the original. Eighty-seven. \"The machine\'s strict!\"'],
    ['第二首她拉你一起唱，两个人都跑调了，跑得很一致。她笑得话筒都拿不稳，说「息ぴったりやん！」', 'For the second she drags you in. You\'re both off-key — perfectly in sync. She laughs so hard she nearly drops the mic. \"We\'re totally in sync!\"'],
    ['包厢里安静下来，点歌器回到了你手里。', 'The room goes quiet. The songbook is back in your hands.'],
    [say('光ちゃんの好きな歌、もう一回歌って。', '再唱一遍你喜欢的那首。', 'Sing your favourite song again.', '想再听', 'Want to hear more',
      ['happy', 'ほんま！？　……じゃあ、今度は {name}くんだけ見て歌う。……あ、あかん、恥ずかしなってきた！', '真的！？……那这次，我只看着你唱。……啊、不行，开始害羞了！', 'Really?! ...Then this time I\'ll sing looking only at you. ...Oh no, now I\'m embarrassed!'],
      ['光ちゃんの好きな歌、もう一回歌われて。', '被动「歌われて」不成请求，用「歌って」。', 'Passive 歌われて isn\'t a request; use 歌って.'],
      ['光ちゃんの嫌いな歌、もう一回歌って。', '「嫌いな歌」是\"讨厌的歌\"。', '嫌いな歌 means a song she hates.']),
     joke('「我们跑调都跑得这么整齐，可以组乐队了。」', '"We go off-key in perfect sync. Let\'s form a band."', '玩笑', 'Joke',
      ['tease', 'ええな！　バンド名は「音程迷子」な！　……うち、ボーカルで！', '好啊！乐队名叫「迷路的音准」！……我当主唱！', 'Yes! Band name: \"Lost Pitch\"! ...I\'m on vocals!']),
     act('把手机灯打开，像演唱会那样挥', 'Turn on your phone light and wave it like at a concert', '当她的观众', 'Be her audience',
      ['shy', 'わっ、ペンライト……！　……もう、ずるいわ。そんなんされたら、本気で歌うしかないやん。', '哇，荧光棒……！……真是的，太狡猾了。被这样对待，只能认真唱了。', 'Whoa, a glow stick...! ...So unfair. Now I have to sing for real.'])]
  ),
  rei: D(
    ['铃坐在沙发最角落，点歌器放在膝盖上，一页一页地翻，像在翻一本目录。她说她从来没唱过卡拉OK，但她\"理論上\"知道怎么唱。', 'Rei sits in the far corner of the sofa, songbook on her knees, turning pages like a catalogue. She\'s never sung karaoke, but she knows how \"in theory.\"'],
    ['她点了一首唱星星的歌，声音很小，几乎被伴奏盖住了。可是每一个音都准，准得像是用尺子量过的。分数九十五，她看着屏幕，眨了两下眼。', 'She picks a song about stars. Her voice is tiny, nearly lost under the backing track, but every note is exact, as if measured with a ruler. Ninety-five. She blinks twice at the screen.'],
    ['她把话筒放在桌上，没有递给你，也没有拿回去。', 'She sets the mic on the table, neither passing it to you nor taking it back.'],
    [say('もっと大きい声で、聴きたい。', '想听你更大声一点。', 'I want to hear you louder.', '鼓励她', 'Encourage her',
      ['shy', '……音量を上げると、誤差が増えます。……でも、あなたが聴きたいなら、試してみます。', '……提高音量的话，误差会变大。……不过，如果你想听，我试试看。', '...More volume means more error. ...But if you want to hear it, I\'ll try.'],
      ['もっと大きい声で、聴かせたい。', '「聴かせたい」是\"想让（别人）听\"，主客颠倒。', '聴かせたい means \"I want to make someone listen\".'],
      ['もっと小さい声で、聴きたい。', '\"想听你更小声\"，跟鼓励相反。', '\"Quieter\" — the opposite.']),
     joke('「理论上会唱，实践上九十五分。」', '"In theory you can sing; in practice, ninety-five."', '夸里带逗', 'A teasing compliment',
      ['tease', '……理論と実践が一致した、珍しい事例です。……記録しておいてください。私の代わりに。', '……理论和实践一致的罕见案例。……请帮我记下来。代替我。', '...A rare case of theory matching practice. ...Please record it. On my behalf.']),
     act('关掉包厢的灯，只留屏幕的光', 'Turn off the room lights, leaving only the screen\'s glow', '让她不那么紧张', 'Ease her nerves',
      ['happy', '……暗いと、星の歌が合いますね。……もう一曲、歌ってもいいですか。', '……暗一点，星星的歌就更合适了。……可以再唱一首吗。', '...In the dark, the star song fits. ...May I sing one more?'])]
  ),
  inari: D(
    ['稻荷完全不知道这个小房间是干什么用的。她拿起话筒，对着它说「もしもし」，然后被扩音的声音吓得尾巴都炸开了。', 'Inari has no idea what this little room is for. She lifts the mic, says \"Hello?\" into it, and her tails puff out in shock at the amplified voice.'],
    ['她让你先唱。听完，她说人类竟然发明了让自己声音变大的方法，然后点了一首——不知道她怎么找到的——一首很老的民谣，唱得像在神社里祝词。', 'She makes you go first. Then she marvels that humans invented a way to make their voices bigger, and picks — who knows how — an old folk song, sung like a shrine prayer.'],
    ['屏幕上的分数是七十一。她盯着它，脸色很难看。', 'The score: seventy-one. She glares at it.'],
    [say('機械には、神様の歌はわからないんですよ。', '机器是听不懂神明的歌的。', 'Machines can\'t understand a goddess\'s song.', '替她说话', 'Take her side',
      ['happy', '……そうであろう、そうであろう！　……そなたは、わかったか？　……ふふ、ならよい。', '……就是说嘛，就是说嘛！……那你听懂了吗？……呵呵，那就好。', '...Indeed, indeed! ...And did YOU understand it? ...Heh, then all is well.'],
      ['機械には、神様の歌はわからせないんですよ。', '使役「わからせない」是\"不让（它）懂\"，意思乱了。', 'わからせない means \"won\'t let it understand\".'],
      ['機械には、神様の歌はよくわかるんですよ。', '\"机器很懂\"，等于说她唱得就值七十一分。', '\"Machines understand it well\" — so she earned 71.']),
     joke('「刚才『もしもし』的时候，尾巴都炸开了。」', '"When you said hello, your tails exploded."', '戳她', 'Poke fun',
      ['angry', 'は、爆ぜておらぬ！　……少し、驚いただけじゃ。……誰にも言うでないぞ。', '没、没有炸开！……只是稍微吓了一跳。……不许跟任何人说。', 'Th-they did not! ...I was only a little startled. ...Tell no one.']),
     act('鼓掌，鼓得很响', 'Applaud, loudly', '给她排面', 'Give her a proper ovation',
      ['shy', '……拍手か。……千年、祝詞を奏上して、拍手されたのは、初めてじゃ。', '……鼓掌吗。……念了千年的祝词，第一次被人鼓掌。', '...Applause. ...A thousand years of prayers, and the first time anyone has clapped.'])]
  ),
  miyuki: D(
    ['深雪说她上一次来卡拉OK，是十年前公司的聚会。她拿着点歌器，手指停在一首很老的偶像歌上，犹豫了很久。', 'Miyuki says her last karaoke was a company party ten years ago. Her finger hovers over an old idol song for a long time.'],
    ['她终于点了。前奏一响，她的表情变了——变成了一个你没见过的、十几岁的女孩。唱到一半，她自己笑场了，说「若作りしすぎね」。', 'She finally picks it. At the intro her face changes into a teenage girl you\'ve never met. Halfway through she breaks into laughter: \"Trying too hard to look young.\"'],
    ['她把话筒递给你，脸还红着。', 'She hands you the mic, still red.'],
    [say('今の深雪さん、すごく楽しそうでした。', '刚才的深雪小姐，看起来好开心。', 'You looked so happy just now, Miyuki.', '说出你看到的', 'Say what you saw',
      ['shy', '……あら。……そう見えた？　……ふふ、そうかもね。あなたの前だと、つい、昔に戻っちゃうの。', '……哎呀。……看起来是那样吗？……呵呵，也许吧。在你面前，就会不自觉地回到从前。', '...Oh. ...Did I look like that? ...Hehe, maybe. In front of you, I slip back to the old days.'],
      ['今の深雪さん、すごく楽しいそうでした。', '\"看起来……\"的「そう」接形容词词干：「楽しそう」。', 'Appearance そう attaches to the stem: 楽しそう.'],
      ['今の深雪さん、すごくつまらなそうでした。', '\"看起来很无聊\"，太伤人了。', '\"You looked bored\" — hurtful.']),
     joke('「十年前的偶像歌，深雪小姐当年是粉丝吧？」', '"An idol song from years back — were you a fan?"', '追问', 'Press her',
      ['tease', 'ふふ、ファンクラブ会員番号、まだ覚えてるわよ。……教えてあげない。', '呵呵，粉丝俱乐部的会员编号，我还记得哦。……不告诉你。', 'Hehe, I still remember my fan club number. ...Not telling you.']),
     act('点了同一位偶像的另一首歌', 'Queue another song by the same idol', '让她再唱一首', 'Let her sing again',
      ['happy', 'あら、これも知ってるの！？　……もう、お姉さん、今夜は喉、枯らしちゃうわ。', '哎呀，这首你也知道！？……真是的，姐姐今晚要把嗓子唱哑了。', 'Oh, you know this one too?! ...Goodness, big sister\'s going to lose her voice tonight.'])]
  ),
  sora: D(
    ['空把卡拉OK当成了比赛。她一进门就说规则：三首定胜负，分数高的赢，输的请拉面。然后她点了一首节奏快得离谱的歌。', 'Sora treats karaoke as a match. Rules at the door: best of three, high score wins, loser buys ramen. Then she picks an absurdly fast song.'],
    ['她唱得上气不接下气，可是一个字都没漏。分数出来：八十九。她转过身，对你比了一个\"该你了\"的手势，额头上全是汗。', 'She\'s gasping by the end but doesn\'t drop a word. Eighty-nine. She turns, sweat on her brow, and points at you: your turn.'],
    ['话筒在你手里。她抱着胳膊，在等。', 'The mic is in your hand. Arms folded, she waits.'],
    [say('負けても、ラーメンは一緒に食べよう。', '就算输了，拉面也一起吃吧。', 'Win or lose, let\'s eat ramen together.', '把比赛变成约定', 'Turn the match into a promise',
      ['shy', '……お、おう。……そ、そういうことやないねん、勝負っていうのは。……まあ、ええけど。', '……哦、嗯。……比、比赛不是这么回事。……算了，也行。', '...O-okay. ...Th-that\'s not how a match works. ...Fine, whatever.'],
      ['負けても、ラーメンは一緒に食べろう。', '「食べる」的意志形是「食べよう」。', 'The volitional of 食べる is 食べよう.'],
      ['勝っても、ラーメンは一緒に食べない。', '\"赢了也不一起吃\"，太冷淡了。', '\"Even if I win, we won\'t eat together\" — cold.']),
     joke('「唱这么快的歌，你是在练肺活量吧。」', '"A song that fast — you\'re training your lung capacity."', '吐槽', 'Snark',
      ['tease', 'バレたか。……持久走の練習も兼ねとるんや。お前も、やってみ。', '被发现了。……顺便练长跑。你也试试。', 'Busted. ...Doubles as endurance training. You try.']),
     act('递给她一杯水，先让她喘口气', 'Hand her a glass of water and let her catch her breath', '她喘成这样', 'She\'s out of breath',
      ['happy', '……サンキュ。……お前、勝負中に相手の世話してどうすんねん。……好きやけど、そういうとこ。', '……谢了。……你在比赛中照顾对手干嘛。……不过，我喜欢你这种地方。', '...Thanks. ...Why are you looking after your opponent mid-match. ...I like that about you, though.'])]
  ),
  nao: D(
    ['奈绪不肯唱。她坐在沙发上，抱着那个小本子，说她只是来\"聴く係\"的。你唱的时候，她在本子上记什么，你凑过去看，她马上合上。', 'Nao won\'t sing. She sits hugging her notebook — she\'s only here as \"the listener.\" While you sing she writes something; when you lean over she snaps it shut.'],
    ['你唱完第三首，她终于拿起了点歌器，翻到一首儿歌——你们小时候一起在幼儿园唱过的那首。', 'After your third song she finally picks up the songbook and finds a children\'s song — the one you sang together in kindergarten.'],
    ['前奏响了。她把话筒递了一个给你。', 'The intro starts. She hands you a second mic.'],
    [say('覚えてるよ、この歌。一緒に歌おう。', '我记得这首歌。一起唱吧。', 'I remember this song. Let\'s sing it together.', '接住', 'Take it',
      ['shy', '……おぼえてたんだ。……あんた、むかし、この歌で ないたよね。……きょうは、なかないでね。', '……你还记得啊。……你以前，唱这首歌的时候哭了吧。……今天，别哭哦。', '...You remember. ...You cried at this song, back then. ...Don\'t cry today.'],
      ['覚えてるよ、この歌。一緒に歌わせよう。', '使役「歌わせよう」是\"让（别人）唱吧\"，意思错了。', '歌わせよう means \"let\'s make someone sing\".'],
      ['忘れたよ、この歌。一緒に歌おう。', '\"我忘了这首歌\"，她会很失望。', '\"I\'ve forgotten this song\" — she\'d be hurt.']),
     joke('「你在本子上记什么？我唱歌的分数？」', '"What are you writing? My scores?"', '追问', 'Ask',
      ['pout', '……ちがう。……あんたの すきな うた、リスト。……みないで。', '……不是。……是你喜欢的歌的清单。……别看。', '...No. ...A list of songs you like. ...Don\'t look.']),
     act('把话筒放下，跟她一起只用嗓子唱', 'Put the mic down and sing with her unamplified', '像小时候那样', 'Like when you were kids',
      ['happy', '……マイク なしだと、むかしと おなじだね。……ちょっと、なきそう。', '……不用麦克风，就跟以前一样了呢。……有点想哭。', '...Without the mic it\'s just like before. ...I might cry a little.'])]
  ),
  maki: D(
    ['真希一进包厢就把灯光调成了彩色闪烁模式，然后点了一首她游戏里的曲子，唱得又快又准，中间还能空出手来比心。分数九十六。她转身：「せんぱい、次。逃げたらあかんで」。', 'Maki switches the lights to flashing colour mode and sings a track from her game, fast and spot-on, even freeing a hand to make a heart. Ninety-six. \"Your turn, senpai. No running.\"'],
    ['你唱完，分数七十四。她笑得在沙发上打滚，说要把这个分数截图发给全班。然后她没发，把手机收起来了。', 'You score seventy-four. She rolls on the sofa laughing, threatening to screenshot it for the whole class. Then she doesn\'t, and puts the phone away.'],
    ['她把话筒递给你，眼睛闪着：「デュエット、する？」', 'She hands you the mic, eyes glinting: \"Duet?\"'],
    [say('真希が選んだ歌なら、いいよ。', '是真希选的歌的话，好啊。', 'If you pick the song, sure.', '交给她', 'Leave it to her',
      ['shy', '……え、ほんまに？　……じゃ、じゃあ、ラブソングでも、ええの？　……冗談やけど。……半分な。', '……诶，真的？……那、那情歌也可以吗？……开玩笑的。……一半是。', '...Eh, really? ...Th-then a love song is okay? ...Kidding. ...Half kidding.'],
      ['真希が選ばれた歌なら、いいよ。', '被动「選ばれた」是\"真希被选中的歌\"，主语乱了。', '選ばれた is passive — garbles who chose.'],
      ['真希が選んだ歌なら、いやだよ。', '\"你选的歌我才不唱\"，她会生气。', '\"If you pick it, no way\" — she\'d be mad.']),
     joke('「你没发截图，是不是心疼我？」', '"You didn\'t post the screenshot. Going soft on me?"', '戳破', 'Call her out',
      ['angry', 'ちゃうわ！　……あんな点数、拡散したら、ウチの趣味が疑われるやろ。それだけや。', '才不是！……那种分数传出去，别人会怀疑我的品位。仅此而已。', 'No! ...If that score got out, people would question my taste. That\'s all.']),
     act('把彩色闪灯关掉，换成普通灯光', 'Switch the flashing lights back to normal', '让她看清你', 'So she can see you',
      ['shy', '……あ。……明るいと、せんぱいの顔、ちゃんと見えるな。……見えすぎや。', '……啊。……亮的话，前辈的脸，看得很清楚呢。……太清楚了。', '...Oh. ...In the light I can see your face properly. ...Too properly.'])]
  )
};
