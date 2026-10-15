import { say, joke, act } from './kit';

// 稻荷：N1 + 古语（わらわ、そなた、〜じゃ、〜のう、〜ぬ）。被夸会得意，被逗会装作生气，其实很开心。
export const INARI_REVEALS = {
  casual: [
    say('尻尾、本当に見えないね。すごい。', '尾巴真的看不见了。好厉害。', 'I really cannot see your tails. Impressive.', '夸她的幻术', 'Praise her illusion',
      ['tease', 'ふふん、千年の業じゃ。……されど、そなたにだけは、時々見せてやらぬでもない。', '哼哼，这是千年的功夫。……不过，对你嘛，偶尔给你看看也不是不行。', 'Hmph, a thousand years of practice. ...Though for you, now and then, I might show them.'],
      ['尻尾、本当に見えないだね。すごい。', '「見えない」是い形容词型，后面不加「だ」。', '見えない ends like an i-adjective; no だ.'],
      ['尻尾、本当に見えるね。すごい。', '「見える」是\"看得见\"，等于说她的幻术失败了。', '見える means you CAN see them — her trick failed.']),
    joke('盯着她的裙摆：「……刚才是不是动了一下？」', 'Stare at her skirt: "...Did that just move?"', '戳破她', 'Call her bluff',
      ['surprised', 'う、動いておらぬ！　……少し、嬉しかっただけじゃ。尻尾は正直でいかん。', '没、没有动！……只是有点高兴而已。尾巴太老实了，真不好。', 'I-it did not move! ...I was only a little pleased. Tails are far too honest.']),
    act('伸手碰了碰她手腕上的金铃', 'Touch the golden bell on her wrist', '让它响', 'Make it ring',
      ['happy', 'ちりん、と鳴ったのう。……この鈴が鳴るたび、そなたを思い出すことにしよう。', '叮铃一声呢。……以后这个铃一响，我就想起你吧。', 'It rang. ...From now on, whenever it rings, I shall think of you.'])
  ],
  school: [
    say('誰よりも校則どおりだね。', '你比谁都更守校规。', 'You follow the dress code better than anyone.', '夸她的认真', 'Praise how exact she is',
      ['happy', '当然じゃ。人の決まりを守るのも、人に紛れる業のうちよ。……分度器で測ったのじゃ。', '当然。遵守人类的规矩，也是混入人群的本事之一。……我是用量角器量过的。', 'Naturally. Keeping human rules is part of blending in. ...I measured it with a protractor.'],
      ['誰よりも校則とおりだね。', '\"按照……\"是「どおり」（连浊），不是「とおり」接在名词后。', 'After a noun it is どおり (voiced), not とおり.'],
      ['誰よりも校則違反だね。', '「校則違反」是\"违反校规\"，正好说反了。', '校則違反 means breaking the rules — reversed.']),
    joke('「名册上添的那一笔，学号是多少？」', '"The line you added to the register — what is your student number?"', '追问', 'Press her',
      ['tease', '零番じゃ。誰より先に、この地におったのでな。', '零号。因为我比谁都更早在这片土地上。', 'Number zero. I was on this land before anyone.']),
    act('替她把领结稍微弄松一点点', 'Loosen her bow by the tiniest amount', '太标准了反而显眼', 'Too perfect stands out',
      ['surprised', '……なるほど。完璧すぎると、かえって目立つのか。人の世は、難しいのう。', '……原来如此。太完美了反而显眼吗。人世真是难懂啊。', '...I see. Too perfect stands out. The human world is difficult.'])
  ],
  swim: [
    say('千年前の海の話、聞かせてほしい。', '想听你讲千年前的海。', 'I want to hear about the sea a thousand years ago.', '对她的过去感兴趣', 'Be curious about her past',
      ['happy', 'よかろう。……砂浜はあの松まであった。舟が、いくつも浮かんでおった。……長い話になるぞ？', '好啊。……那时沙滩一直延伸到那棵松树。海上浮着好多船。……会讲很久哦？', 'Very well. ...The sand reached that pine. Many boats floated there. ...It will be a long tale.'],
      ['千年前の海の話、聞かせてほしいだ。', '「ほしい」是い形容词，不加「だ」。', 'ほしい is an i-adjective; no だ.'],
      ['千年前の海の話、聞かせないでほしい。', '\"希望你别讲\"，意思反了。', '\"Please do not tell me\" — reversed.']),
    joke('「那千年前，你下水也穿这种吗？」', '"So a thousand years ago, did you swim in this too?"', '调侃', 'Tease',
      ['angry', 'た、たわけ！　当時はこのような布切れなど……ええい、聞くでない！', '蠢、蠢货！那时候哪有这种布片……啊啊，别问了！', 'F-fool! In those days there was no such scrap of cloth... ugh, do not ask!']),
    act('把她滑下来的罩衫往肩上拉回去', 'Pull her slipping cover-up back onto her shoulder', '自然的动作', 'A natural gesture',
      ['shy', '……気が利くのう。……神に触れたのは、そなたが何人目か、数えておらぬわ。', '……还挺细心的嘛。……碰过神明的人里你是第几个，我可没数。', '...Thoughtful. ...I have not counted how many have touched a god. You are one.'])
  ],
  home: [
    say('狐のスリッパ、かわいいね。', '狐狸拖鞋，好可爱。', 'The fox slippers are cute.', '夸拖鞋', 'Praise the slippers',
      ['shy', '……己の顔を足に履く神など、聞いたこともあるまい。……それでも、気に入っておるのじゃ。', '……把自己的脸穿在脚上的神，你没听说过吧。……可我就是喜欢。', '...A god wearing her own face on her feet — unheard of. ...Still, I like them.'],
      ['狐のスリッパ、かわいくね。', '「かわいくね」是很粗的口语，原意是\"不可爱吗\"，容易被听成否定。', 'かわいくね is slangy and can sound like a negative.'],
      ['狐のスリッパ、こわいね。', '「こわい」是\"可怕\"。', 'こわい means scary.']),
    joke('学着她的样子，也瘫在沙发上', 'Copy her and sprawl on the sofa too', '一起放松', 'Relax together',
      ['happy', 'ふふ、よいぞ。神も人も、ぐうたらする日は要るのじゃ。', '呵呵，好。神也好人也好，都需要偷懒的日子。', 'Heh, good. Gods and people both need lazy days.']),
    act('替她把搭在肩上的辫子理顺', 'Smooth the braid lying over her shoulder', '很轻', 'Lightly',
      ['shy', '……編み直してくれてもよいのじゃぞ。……冗談じゃ。半分はな。', '……你要帮我重新编也行哦。……开玩笑的。一半是。', '...You may re-braid it, you know. ...A jest. Half of one.'])
  ],
  knit: [
    say('流行りの服も、ちゃんと着こなしてるね。', '流行的衣服也穿得很好看。', 'You wear the latest fashion well.', '夸她跟得上潮流', 'Praise her keeping up',
      ['tease', 'そうであろう。千年、流行りを見てきたのじゃ。……来年はまた変わるがの。', '那是自然。我看了一千年的流行了。……明年又会变就是了。', 'Of course. I have watched fashions for a thousand years. ...Next year it changes again.'],
      ['流行りの服も、ちゃんと着こなすね。', '说她\"此刻穿得好\"用「着こなしてる」更合适。', 'For how she wears it now, 着こなしてる fits better.'],
      ['流行りの服も、ちゃんと着こなせないね。', '可能形否定\"穿不好\"，变成了贬低。', '\"Cannot carry it off\" — an insult.']),
    joke('「那千年里，你最喜欢哪一年的流行？」', '"Which year\'s fashion did you like best in all that time?"', '考她', 'Quiz her',
      ['happy', '難しい問いじゃのう。……強いて言えば、今年じゃ。そなたが隣におるからの。', '真是难题啊。……硬要说的话，是今年。因为你在旁边。', 'A hard question. ...If I must say, this year. Because you are here.']),
    act('碰了碰她腰间那枚狐尾坠子', 'Touch the fox-tail charm at her hip', '好奇', 'Curious',
      ['surprised', 'こ、これは飾りじゃ！　本物は……いや、なんでもない。', '这、这是装饰！真的那个……不，没什么。', 'Th-this is a charm! The real one... no, nothing.'])
  ],
  gown: [
    say('部屋の光、全部君に集まってるみたいだ。', '整个房间的光，好像都聚到你身上了。', 'Every light in the room seems to gather on you.', '认真地夸', 'Mean it',
      ['shy', '……そなた、そのような言葉をどこで覚えた。……神を照れさせるとは、不届きな。', '……你这种话是从哪儿学的。……竟敢让神害羞，真是无礼。', '...Where did you learn words like that. ...Making a god blush. Insolent.'],
      ['部屋の光、全部君を集まってるみたいだ。', '「集まる」是自动词，到达点用「に」：「君に集まる」。', '集まる is intransitive; the destination takes に.'],
      ['部屋の光、全部君から逃げてるみたいだ。', '\"光都在躲着你\"，意思完全反了。', '\"The light is fleeing from you\" — the opposite.']),
    joke('「心血来潮就穿成这样？那下次心血来潮是什么时候？」', '"A whim, you said? When is the next whim?"', '追问', 'Push it',
      ['tease', '気まぐれは予告せぬから気まぐれなのじゃ。……そなたが、また誘えばの。', '心血来潮之所以是心血来潮，就是因为不预告。……要看你会不会再约我。', 'A whim gives no warning — that is what makes it a whim. ...It depends on whether you ask again.']),
    act('向她伸出手臂，示意她挽着', 'Offer her your arm', '今晚你护送她', 'Escort her tonight',
      ['happy', '……ほう。人の子に導かれるのは、いつ以来かのう。……よかろう、案内せい。', '……哦。被人类的孩子引路，是多久以来的事了呢。……好，带路吧。', '...Oh. How long since a human child led me. ...Very well, lead on.'])
  ],
  summer: [
    say('誰も拝まないけど、見とれる人はいると思う。', '没人会参拜你，不过看呆的人应该会有。', 'Nobody will pray to you, but people will stare.', '回她的话', 'Answer her line',
      ['happy', 'ふふ、見とれるのは許そう。……一番長く見とれておるのは、そなたのようじゃがの。', '呵呵，看呆可以原谅。……不过看得最久的，好像是你啊。', 'Heh, staring is permitted. ...Though you seem to be staring the longest.'],
      ['誰も拝まないけど、見とれる人はいるだと思う。', '「と思う」前面接普通形「いる」，不加「だ」。', 'と思う follows the plain form いる, without だ.'],
      ['誰も拝まないけど、見とれる人はいないと思う。', '\"没人会看呆\"，夸奖没了。', '\"Nobody will stare\" — no compliment left.']),
    joke('故意双手合十，对她拜了一拜', 'Put your palms together and bow to her anyway', '偏要拜', 'Pray anyway',
      ['angry', 'こ、これ！　今日は神ではないと言うたであろう！　……願い事は、なんじゃ？', '喂、喂！不是说了今天不是神吗！……愿望是什么？', 'H-hey! I said I am not a god today! ...What is your wish?']),
    act('把她的草编包接过来拎着', 'Take her straw bag to carry', '并肩走', 'Walk side by side',
      ['shy', '……並んで歩くとは、こういうことか。……悪くないのう。', '……并肩走，就是这样的感觉吗。……不坏啊。', '...So this is walking side by side. ...Not bad.'])
  ],
  miko: [
    say('笑わないよ。よく似合ってる。', '我不笑。很适合你。', 'I will not laugh. It suits you.', '认真回答', 'Answer seriously',
      ['shy', '……笑わぬのか。……神が巫女を真似ても、そなたは真面目に見るのじゃな。', '……不笑吗。……神模仿巫女，你也这么认真地看啊。', '...You do not laugh. ...Even a god playing shrine maiden, you look at seriously.'],
      ['笑わないよ。よく似合う。', '此刻正穿着，用状态「似合ってる」更自然。', 'For what she has on now, 似合ってる is more natural.'],
      ['笑うよ。よく似合わないから。', '\"我要笑，因为很不适合\"，太伤人。', '\"I will laugh, it does not suit you\" — cruel.']),
    joke('「那今天，我可以求一张护身符吗？」', '"Then may I buy a charm from you today?"', '当真', 'Take it literally',
      ['tease', '売り物ではない。……されど、そなたにはタダでやろう。本物の神の、手作りじゃ。', '不卖。……不过给你的话，免费。真正的神亲手做的。', 'Not for sale. ...But for you, free. Handmade by a real god.']),
    act('替她把袖口那根红绳重新系好', 'Retie the red cord holding up her sleeve', '它松了', 'It came loose',
      ['happy', '……巫女の紐を結ぶ人の子か。……縁が、ひとつ結ばれたのう。', '……给巫女系绳子的人类孩子吗。……结下了一个缘分呢。', '...A human child tying a shrine maiden\'s cord. ...A bond has been tied.'])
  ],
  goddess: [
    say('こわくないよ。一緒に歩こう。', '不可怕。一起走吧。', 'You do not scare me. Let\'s walk together.', '往前一步，而不是后退', 'Step forward, not back',
      ['shy', '……退かなかったのは、そなたが初めてじゃ。……隣を、歩いてくれるか。', '……没有退后的，你是第一个。……愿意走在我旁边吗。', '...You are the first who did not step back. ...Will you walk beside me?'],
      ['こわくないよ。一緒に歩こうか？', '意思没错，但带上「か？」就成了犹豫的提问，少了那份笃定。', 'Not wrong, but か？ makes it a hesitant question.'],
      ['こわいよ。一緒に歩かない。', '\"好可怕，不一起走\"，正好伤到她。', '\"You are scary, I will not walk with you\" — wounding.']),
    joke('「这么闪，晚上走夜路倒是不用手电了。」', '"With that glow, we will not need a torch tonight."', '化解紧张', 'Break the tension',
      ['happy', 'ぷっ……神の後光を懐中電灯扱いか。……よい、照らしてやろう。足元に気をつけい。', '噗……把神的光环当手电筒吗。……好，我给你照着。小心脚下。', 'Pfft... treating a god\'s halo as a torch. ...Fine, I will light the way. Mind your step.']),
    act('伸手接住一条飘过来的金色绸带', 'Catch one of the drifting golden ribbons', '它飘向你', 'It drifts your way',
      ['surprised', '……捕まえたか。それは、そなたを選んで流れていったのじゃ。……わらわではないぞ。帯が勝手にじゃ。', '……抓住了吗。那是它自己选了你飘过去的。……不是我。是带子自己。', '...You caught it. It chose you and drifted there. ...Not me. The ribbon did it.'])
  ]
};
