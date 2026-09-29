import { DrillPack } from '../../types';

// ==========================================================
// 📋 明日香 · 受身・使役・使役受身（〜れる／〜せる／〜させられる）
//
// 【为什么是她】
// 班长的日常就是一边抱怨"被谁怎么了"，一边"让谁去做什么"。
// 受身、使役、使役受身这三样，是 N3 里最容易搅成一锅粥的——
// 形式上只差一两个假名，意思却完全调转。
// 让一个嘴上不饶人的人来追问你"到底是谁对谁做了什么"，错一次就记住了。
//
// 一档：直接被动、迷惑被动（雨に降られる）、基本使役
// 二档：使役被动（走らされる）、させてもらう、ら抜き、を／に
// 三档：尊敬的れる、自发、によって、来られる……同形异义的一锅
// ==========================================================

export const ASUKA_PACK: DrillPack = {
  id: 'asuka',
  grammarZh: '被动 · 使役 · 使役被动', grammarEn: 'Passive · causative · causative-passive',
  partnerZh: '明日香', partnerEn: 'Asuka',
  sprites: {
    neutral: '/images/characters/asuka/neutral.webp',
    happy: '/images/characters/asuka/smug.webp',
    miss: '/images/characters/asuka/angry.webp'
  },
  onRight: [
    { jp: '……ふん、まあまあね。', zh: '……哼，还算过得去。', en: '...Hmph. Passable.' },
    { jp: '当然でしょ。これくらい。', zh: '这不是理所当然的嘛，这点程度。', en: 'Obviously. That much is basic.' },
    { jp: 'へえ、ちゃんと分かってるじゃない。', zh: '哦？这不是挺明白的嘛。', en: 'Oh? So you do understand it.' }
  ],
  onWrong: [
    { jp: '……はぁ？ちゃんと考えて言いなさいよ。', zh: '……哈？给我想清楚再说。', en: '...Huh? Think before you speak.' },
    { jp: '違うわよ。……もう、しょうがないわね。', zh: '不对。……真是的，拿你没办法。', en: 'Wrong. ...Honestly, you are hopeless.' },
    { jp: 'それじゃ意味が逆でしょ。', zh: '那样意思不就反过来了吗。', en: 'That makes it mean the opposite.' }
  ],
  rounds: [
    // ======================= 一档 =======================
    {
      id: 'a1_scolded', tier: 1,
      ctxZh: '你今天被老师点名批评了。', ctxEn: 'A teacher told you off in front of the class today.',
      jp: 'なんでそんなに暗い顔してるのよ。', zh: '你干嘛一脸丧气。', en: 'Why the long face?',
      options: [
        { jp: '先生に怒られたんだ。', zh: '被老师骂了。', en: 'I got told off by the teacher.', ok: true },
        { jp: '先生を怒られたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: '先生が怒られたんだ。', zh: '老师挨骂了。', en: 'The teacher got told off.' }
      ],
      noteZh: '被动句：被谁用「に」，动词变「V-られる」。「先生が怒られた」主语成了老师——挨骂的是老师。',
      noteEn: 'Passive: the agent takes に, the verb becomes V-られる. 先生が怒られた makes the teacher the one being scolded.',
      word: { jp: '怒る', reading: 'おこる', zh: '生气；训斥', en: 'to get angry; to scold' }
    },
    {
      id: 'a1_wind', tier: 1,
      ctxZh: '你的伞被一阵大风吹飞，撞坏了。', ctxEn: 'A gust of wind blew your umbrella away and wrecked it.',
      jp: 'その傘、ボロボロじゃない。', zh: '你那把伞，破破烂烂的嘛。', en: 'That umbrella is in tatters.',
      options: [
        { jp: '風に飛ばされて、壊れたんだ。', zh: '被风吹飞，弄坏了。', en: 'The wind blew it away and it broke.', ok: true },
        { jp: '風を飛ばして、壊れたんだ。', zh: '我把风吹飞了……？', en: 'I blew the wind away...?' },
        { jp: '風が飛ばされて、壊れたんだ。', zh: '风被吹飞了……？', en: 'The wind got blown away...?' }
      ],
      noteZh: '坏事落到自己头上时，日语很爱用被动：「風に飛ばされる」＝被风刮走。',
      noteEn: 'When something bad happens to you, Japanese reaches for the passive: 風に飛ばされる, "to be blown away by the wind".'
    },
    {
      id: 'a1_rain', tier: 1,
      ctxZh: '昨天回家路上突然下暴雨，你淋成了落汤鸡。', ctxEn: 'Yesterday a downpour caught you on the way home and soaked you.',
      jp: '昨日、なんで委員会に来なかったのよ。', zh: '昨天你怎么没来委员会？', en: 'Why did you not turn up to the committee yesterday?',
      options: [
        { jp: '帰りに雨に降られて、びしょ濡れだったんだ。', zh: '回家路上被雨淋了，浑身湿透。', en: 'I got caught in the rain and was soaked through.', ok: true },
        { jp: '帰りに雨を降られて、びしょ濡れだったんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: '帰りに雨が降らせて、びしょ濡れだったんだ。', zh: '（不通：雨"让"了什么？）', en: '(Broken: the rain "made" what?)' }
      ],
      noteZh: '「雨に降られる」＝被雨淋了。「降る」是自动词，却能做被动，意思是"因此受了害"——这是日语特有的"迷惑被动"。',
      noteEn: '雨に降られる, "to be rained on". 降る is intransitive, yet it takes the passive to mean "I suffered from it" — the so-called suffering passive.',
      word: { jp: '降られる', reading: 'ふられる', zh: '被（雨）淋', en: 'to be rained on' }
    },
    {
      id: 'a1_foot', tier: 1,
      ctxZh: '早上挤电车时，你被人踩了脚。', ctxEn: 'On the crowded morning train, someone trod on your foot.',
      jp: 'その足、どうしたの？', zh: '你的脚怎么了？', en: 'What happened to your foot?',
      options: [
        { jp: '電車で足を踏まれたんだ。', zh: '在电车上被人踩了脚。', en: 'Somebody stepped on my foot on the train.', ok: true },
        { jp: '電車で足を踏んだんだ。', zh: '我在电车上踩了（别人的）脚。', en: 'I stepped on (someone’s) foot on the train.' },
        { jp: '電車で足が踏ませたんだ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '自己的身体、东西被别人怎么了：「(私は)足を踏まれた」。主语是"我"，被踩的部位保留「を」。',
      noteEn: 'Something done to your body or belongings: (私は)足を踏まれた. "I" is the subject; the body part keeps を.'
    },
    {
      id: 'a1_essay', tier: 1,
      ctxZh: '老师说明天要让每个人写一篇作文。', ctxEn: 'The teacher announced that everyone has to write an essay tomorrow.',
      jp: '先生、明日の宿題は何だって？', zh: '老师说明天的作业是什么？', en: 'What did the teacher say about tomorrow’s homework?',
      options: [
        { jp: 'みんなに作文を書かせるって。', zh: '说要让大家写作文。', en: 'She is going to make everyone write an essay.', ok: true },
        { jp: 'みんなに作文を書かれるって。', zh: '说作文要被大家写掉……？', en: 'The essay is going to be written by everyone...?' },
        { jp: 'みんなを作文を書くって。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '使役"让/叫某人做"：「(人)に＋V-させる」。「書く」→「書かせる」。「書かれる」是被动。',
      noteEn: 'Causative, "make/let someone do": (person)に＋V-させる. 書く → 書かせる. 書かれる is the passive.'
    },
    {
      id: 'a1_leave', tier: 1,
      ctxZh: '今天你要赶去打工，想请班长明日香让你先走。', ctxEn: 'You have a shift today and want Asuka, as class president, to let you leave first.',
      jp: '今日の掃除当番、あなたもよね？', zh: '今天的值日，你也有份吧？', en: 'You are on cleaning duty today too, right?',
      options: [
        { jp: 'ごめん、今日だけ先に帰らせてくれない？', zh: '抱歉，今天能让我先走吗？', en: 'Sorry — could you let me go first, just today?', ok: true },
        { jp: 'ごめん、今日だけ先に帰られてくれない？', zh: '（不通）', en: '(Broken)' },
        { jp: 'ごめん、今日だけ先に帰ってさせない？', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「V-させてくれない？」＝"让我…好不好"，请求许可的固定说法。对老师说成「V-させてください」。',
      noteEn: 'V-させてくれない? = "would you let me...?", the set phrase for asking permission. To a teacher: V-させてください.'
    },
    {
      id: 'a1_shrine', tier: 1,
      ctxZh: '你们在聊坡下那座生田神社。', ctxEn: 'You are talking about Ikuta Shrine at the bottom of the hill.',
      jp: '生田神社って、どのくらい古いか知ってる？', zh: '你知道生田神社有多古老吗？', en: 'Do you know how old Ikuta Shrine is?',
      options: [
        { jp: '千八百年以上前に建てられたらしいよ。', zh: '据说是一千八百多年前建的。', en: 'Apparently it was built over eighteen hundred years ago.', ok: true },
        { jp: '千八百年以上前に建てさせたらしいよ。', zh: '据说（某人）让人建的。', en: 'Apparently (someone) had it built...' },
        { jp: '千八百年以上前に建つられたらしいよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '讲建筑、作品"被造出来"，主语是物，用被动「建てられる」。「建つ」是自动词，没有这种被动。生田神社相传创建于公元 201 年。',
      noteEn: 'For buildings and works "being made", the thing is the subject: 建てられる. 建つ is intransitive and has no such passive. Ikuta Shrine is said to date from 201 AD.'
    },
    {
      id: 'a1_diary', tier: 1,
      ctxZh: '你的日记被光偷看了。', ctxEn: 'Hikari read your diary without asking.',
      jp: 'なんで光のこと避けてるのよ。', zh: '你干嘛躲着光？', en: 'Why are you avoiding Hikari?',
      options: [
        { jp: '光に日記を読まれたんだよ……。', zh: '日记被光看了……', en: 'Hikari read my diary...', ok: true },
        { jp: '光が日記を読まれたんだよ……。', zh: '光的日记被人看了……', en: 'Hikari’s diary got read...' },
        { jp: '光に日記を読ませたんだよ……。', zh: '我让光看了日记……', en: 'I let Hikari read my diary...' }
      ],
      noteZh: '「(人)に(我的东西)を V-られる」＝我的东西被人怎么了。主语是省略掉的"我"。',
      noteEn: '(person)に(my thing)を V-られる: something of mine was done to by someone. The dropped subject is "I".'
    },
    {
      id: 'a1_laughed', tier: 1,
      ctxZh: '你刚才在课上念错了一个字，被全班笑了。', ctxEn: 'You misread a word aloud in class and everyone laughed.',
      jp: '顔、真っ赤よ。', zh: '你脸红透了哦。', en: 'Your face is bright red.',
      options: [
        { jp: '読み間違えて、みんなに笑われたんだ。', zh: '念错了，被大家笑了。', en: 'I misread it and everyone laughed at me.', ok: true },
        { jp: '読み間違えて、みんなを笑われたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: '読み間違えて、みんなが笑わせたんだ。', zh: '（不通：大家"让"了谁？）', en: '(Broken: everyone "made" whom?)' }
      ],
      noteZh: '被动句里，做动作的人（大家）用「に」。',
      noteEn: 'In a passive, the people doing the action take に.'
    },
    {
      id: 'a1_cry', tier: 1,
      ctxZh: '你玩笑开过头，把光惹哭了。', ctxEn: 'Your joke went too far and made Hikari cry.',
      jp: '光、泣いてたわよ。何かしたの？', zh: '光哭了哦。你干什么了？', en: 'Hikari was crying. What did you do?',
      options: [
        { jp: '冗談がきつすぎて、泣かせちゃったんだ……。', zh: '玩笑开太过，把她弄哭了……', en: 'My joke was too harsh. I made her cry...', ok: true },
        { jp: '冗談がきつすぎて、泣けちゃったんだ……。', zh: '玩笑太过，（我自己）忍不住哭了……', en: 'My joke was too harsh, and I ended up crying...' },
        { jp: '冗談がきつすぎて、泣かさせちゃったんだ……。', zh: '（形式错误：多了一个「さ」）', en: '(Wrong form: an extra さ)' }
      ],
      noteZh: '使役常用在情绪上：泣かせる、笑わせる、驚かせる、心配させる。「泣かさせる」多加了一个「さ」，是常见错误。',
      noteEn: 'The causative is common with emotions: 泣かせる, 笑わせる, 驚かせる, 心配させる. 泣かさせる has an extra さ — a common slip.'
    },

    // ======================= 二档 =======================
    {
      id: 'a2_run', tier: 2,
      ctxZh: '空每天都被学长逼着跑圈。', ctxEn: 'Sora gets made to run laps by her seniors every day.',
      jp: '空の部活、厳しいって本当？', zh: '空的社团很严，是真的吗？', en: 'Is it true Sora’s club is really strict?',
      options: [
        { jp: '毎日先輩に走らされてるらしいよ。', zh: '听说每天都被学长逼着跑。', en: 'Apparently her seniors make her run every day.', ok: true },
        { jp: '毎日先輩に走らせてるらしいよ。', zh: '听说她每天让学长跑。', en: 'Apparently she makes her seniors run every day.' },
        { jp: '毎日先輩を走られてるらしいよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '使役被动＝"被迫做"：V-させられる。五段动词常缩成「V-される」：走らせられる→走らされる。',
      noteEn: 'Causative-passive = "be made to do": V-させられる. Godan verbs usually contract: 走らせられる → 走らされる.',
      word: { jp: '走らされる', reading: 'はしらされる', zh: '被迫跑', en: 'to be made to run' }
    },
    {
      id: 'a2_spicy', tier: 2,
      ctxZh: '昨天光拉你去吃超辣拉面，还逼你吃完了。', ctxEn: 'Yesterday Hikari dragged you to a super-spicy ramen place and made you finish it.',
      jp: '顔色悪いわね。', zh: '你脸色好差。', en: 'You look terrible.',
      options: [
        { jp: '光に激辛ラーメンを全部食べさせられたんだ……。', zh: '被光逼着把超辣拉面全吃了……', en: 'Hikari made me eat an entire bowl of fire ramen...', ok: true },
        { jp: '光に激辛ラーメンを全部食べられたんだ……。', zh: '超辣拉面被光全吃光了……', en: 'Hikari ate all of my fire ramen...' },
        { jp: '光に激辛ラーメンを全部食べさせたんだ……。', zh: '我让光把超辣拉面全吃了……', en: 'I made Hikari eat the whole fire ramen...' }
      ],
      noteZh: '「食べさせられる」＝被迫吃。「食べられる」要么是被动（被人吃掉），要么是可能（能吃）——都不是"被逼着吃"。',
      noteEn: '食べさせられる = forced to eat. 食べられる is either passive (eaten by someone) or potential (can eat) — neither means "forced".'
    },
    {
      id: 'a2_letme', tier: 2,
      ctxZh: '明日香在发愁文化祭的招牌找谁画，你想主动请缨。', ctxEn: 'Asuka cannot decide who should paint the festival sign. You want to volunteer.',
      jp: '文化祭の看板、誰に頼もうかしら……。', zh: '文化祭的招牌，找谁画好呢……', en: 'Who should I ask to do the festival sign...',
      options: [
        { jp: 'それ、私にやらせてよ。', zh: '那个，让我来吧。', en: 'Let me do it.', ok: true },
        { jp: 'それ、私にやられてよ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'それ、私にやらされてよ。', zh: '（不通：请求别人"逼"自己？）', en: '(Broken: asking to be forced?)' }
      ],
      noteZh: '「V-させて(よ／ください)」＝让我来做——使役的て形用来主动请缨。',
      noteEn: 'V-させて(よ／ください) = let me do it. The causative て-form is how you volunteer.'
    },
    {
      id: 'a2_baby', tier: 2,
      ctxZh: '楼上的婴儿哭了一整夜，你没睡好。', ctxEn: 'The baby upstairs cried all night and you barely slept.',
      jp: '目の下、クマができてるわよ。', zh: '你都有黑眼圈了。', en: 'You have got dark circles under your eyes.',
      options: [
        { jp: '上の階の赤ちゃんに一晩中泣かれて、眠れなかったんだ。', zh: '楼上的婴儿哭了一整夜，害我没睡着。', en: 'The baby upstairs cried all night and I could not sleep.', ok: true },
        { jp: '上の階の赤ちゃんを一晩中泣かせて、眠れなかったんだ。', zh: '我让楼上的婴儿哭了一整夜……', en: 'I made the baby upstairs cry all night...' },
        { jp: '上の階の赤ちゃんが一晩中泣かれて、眠れなかったんだ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '自动词的迷惑被动：「(人)に泣かれる」＝有人哭，而我因此受困。中文没有这个结构，只能翻成"孩子哭了一夜，害我没睡"。',
      noteEn: 'Suffering passive of an intransitive: (person)に泣かれる — someone cried and I bore the brunt. English has no direct equivalent.'
    },
    {
      id: 'a2_rewrite', tier: 2,
      ctxZh: '你的作文被老师要求重写了三次。', ctxEn: 'The teacher has made you rewrite your essay three times.',
      jp: '作文、また書き直し？', zh: '作文又要重写？', en: 'Rewriting your essay again?',
      options: [
        { jp: 'うん、もう三回も書き直させられた。', zh: '嗯，已经被逼着重写了三次。', en: 'Yeah, she has made me rewrite it three times now.', ok: true },
        { jp: 'うん、もう三回も書き直された。', zh: '嗯，已经被（老师）改写了三次。', en: 'Yeah, it has been rewritten (by her) three times.' },
        { jp: 'うん、もう三回も書き直させた。', zh: '嗯，已经让（别人）重写了三次。', en: 'Yeah, I have made (someone) rewrite it three times.' }
      ],
      noteZh: '是"我被迫重写"而不是"作文被别人改写"，所以要用使役被动「書き直させられる」。',
      noteEn: 'It is "I was made to rewrite", not "it was rewritten by someone", so the causative-passive 書き直させられる is needed.'
    },
    {
      id: 'a2_borrow', tier: 2,
      ctxZh: '美术社答应借教室给你们画海报。', ctxEn: 'The art club has agreed to lend you their room to paint the poster.',
      jp: 'ポスター、どこで描くつもり？', zh: '海报打算在哪儿画？', en: 'Where are you planning to paint the poster?',
      options: [
        { jp: '美術部の部屋を使わせてもらうことになった。', zh: '承蒙美术社借我们用教室。', en: 'The art club is letting us use their room.', ok: true },
        { jp: '美術部の部屋を使わさせてもらうことになった。', zh: '（多了一个「さ」）', en: '(An extra さ)' },
        { jp: '美術部の部屋を使われてもらうことになった。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「V-させてもらう」＝承蒙允许而做。五段动词的使役是「使わせる」，写成「使わさせる」是常见的"さ入れ言葉"。',
      noteEn: 'V-させてもらう = to be allowed to do. The godan causative is 使わせる; 使わさせる is the common "sa-ire" error.'
    },
    {
      id: 'a2_praised', tier: 2,
      ctxZh: '老师在全班面前夸了你的作文。', ctxEn: 'The teacher praised your essay in front of the class.',
      jp: '何ニヤニヤしてるのよ。', zh: '你傻笑什么啊。', en: 'What are you grinning about?',
      options: [
        { jp: '先生に作文を褒められたんだ。', zh: '作文被老师夸了。', en: 'The teacher praised my essay.', ok: true },
        { jp: '先生に作文を褒めさせたんだ。', zh: '我让老师夸了作文。', en: 'I made the teacher praise my essay.' },
        { jp: '先生が作文を褒められたんだ。', zh: '老师的作文被夸了。', en: 'The teacher’s essay got praised.' }
      ],
      noteZh: '被动不一定是坏事：「褒められる」＝被夸奖。',
      noteEn: 'The passive is not only for bad things: 褒められる, to be praised.',
      word: { jp: '褒める', reading: 'ほめる', zh: '夸奖', en: 'to praise' }
    },
    {
      id: 'a2_natto', tier: 2,
      ctxZh: '明日香问你能不能吃纳豆。你最近终于能吃了。', ctxEn: 'Asuka asks whether you can eat natto. You recently managed to.',
      jp: 'あなた、納豆は食べられるの？', zh: '你能吃纳豆吗？', en: 'Can you eat natto?',
      options: [
        { jp: 'うん、最近やっと食べられるようになった。', zh: '嗯，最近终于能吃了。', en: 'Yeah, I finally got to where I can eat it.', ok: true },
        { jp: 'うん、最近やっと食べさせられるようになった。', zh: '嗯，最近变成被逼着吃了。', en: 'Yeah, lately I have been made to eat it.' },
        { jp: 'うん、最近やっと食べれるようになった。', zh: '（ら抜き：口语常见，考试算错）', en: '(ra-nuki: common in speech, wrong in exams)' }
      ],
      noteZh: '这里的「食べられる」是可能形。「食べれる」叫"ら抜き言葉"，口语里到处都是，但考试和作文里算错——明日香这种人也会当场纠正你。',
      noteEn: '食べられる here is the potential. 食べれる is "ra-nuki" — everywhere in speech, but marked wrong in exams. Asuka would correct you on the spot.'
    },
    {
      id: 'a2_funnyface', tier: 2,
      ctxZh: '光做了个鬼脸，把全班逗得哄堂大笑。', ctxEn: 'Hikari pulled a face and set the whole class laughing.',
      jp: 'さっき教室が盛り上がってたけど、何があったの？', zh: '刚才教室里好热闹，发生什么了？', en: 'The classroom was lively just now. What happened?',
      options: [
        { jp: '光が変な顔をして、みんなを笑わせたんだ。', zh: '光做了个鬼脸，把大家逗笑了。', en: 'Hikari pulled a face and made everyone laugh.', ok: true },
        { jp: '光が変な顔をして、みんなに笑われたんだ。', zh: '光做了个鬼脸，被大家嘲笑了。', en: 'Hikari pulled a face and got laughed at.' },
        { jp: '光が変な顔をして、みんなを笑われたんだ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '使役的对象：自动词（笑う、泣く、走る）多用「を」；他动词（書く、読む）已经有「を」宾语了，对象改用「に」。',
      noteEn: 'Causative targets: with intransitives (笑う, 泣く, 走る) use を; with transitives (書く, 読む), which already have a を object, use に.'
    },
    {
      id: 'a2_conductor', tier: 2,
      ctxZh: '合唱比赛的指挥，被大家硬推给了你。', ctxEn: 'Everyone pushed the job of choir conductor onto you.',
      jp: '合唱コンクール、なんであなたが指揮なのよ。', zh: '合唱比赛，怎么是你当指挥？', en: 'Why are YOU conducting for the choir contest?',
      options: [
        { jp: 'みんなにやらされたんだよ……。', zh: '被大家硬逼着当的……', en: 'Everyone made me do it...', ok: true },
        { jp: 'みんなをやらせたんだよ……。', zh: '我让大家去做的……', en: 'I made everyone do it...' },
        { jp: 'みんなにやられたんだよ……。', zh: '被大家整惨了……', en: 'Everyone did me in...' }
      ],
      noteZh: '「やらされる」＝被迫去做（やる→やらせる→やらせられる→やらされる）。「やられる」是"被打败了／被整了"。',
      noteEn: 'やらされる = made to do it (やる→やらせる→やらせられる→やらされる). やられる means "got beaten / got done in".'
    },

    // ======================= 三档 =======================
    {
      id: 'a3_book', tier: 3,
      ctxZh: '这本书是老师硬塞给你读的，结果出乎意料地好看。', ctxEn: 'A teacher made you read this book — and it turned out to be great.',
      jp: 'その本、面白かった？', zh: '那本书好看吗？', en: 'Was that book any good?',
      options: [
        { jp: '先生に読まされた本だけど、すごく面白かった。', zh: '是被老师逼着读的，但特别好看。', en: 'The teacher made me read it, but it was really good.', ok: true },
        { jp: '先生に読まれた本だけど、すごく面白かった。', zh: '是被老师读了的书……', en: 'It is a book the teacher read (to my annoyance)...' },
        { jp: '先生に読ませた本だけど、すごく面白かった。', zh: '是我让老师读的书……', en: 'It is a book I made the teacher read...' },
        { jp: '先生を読ませた本だけど、すごく面白かった。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '三种形式并排：読まれる（被读）、読ませる（让人读）、読まされる（被迫读）。',
      noteEn: 'All three side by side: 読まれる (be read), 読ませる (make someone read), 読まされる (be made to read).'
    },
    {
      id: 'a3_luminarie', tier: 3,
      ctxZh: '新闻说今年神户光之雕刻也照常举办。', ctxEn: 'The news says the Kobe Luminarie will go ahead again this year.',
      jp: 'ねえ、ニュース見た？', zh: '喂，看新闻了吗？', en: 'Hey, did you see the news?',
      options: [
        { jp: '今年もルミナリエが開催されるんだって。', zh: '听说今年光之雕刻也会举办。', en: 'The Luminarie is being held again this year.', ok: true },
        { jp: '今年もルミナリエが開催させるんだって。', zh: '（不通）', en: '(Broken)' },
        { jp: '今年もルミナリエが開催されられるんだって。', zh: '（不通：叠了两层被动）', en: '(Broken: a double passive)' },
        { jp: '今年もルミナリエが開催するされるんだって。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '活动"被举办"：「開催される」「行われる」。新闻和公告里几乎只用这种被动，不说是谁办的。',
      noteEn: 'Events "being held": 開催される, 行われる. News and notices almost always use this passive and leave out who organises it.',
      word: { jp: '開催', reading: 'かいさい', zh: '举办', en: 'holding (an event)' }
    },
    {
      id: 'a3_wallet', tier: 3,
      ctxZh: '你的钱包在电车里被偷了。', ctxEn: 'Your wallet was stolen on the train.',
      jp: '財布、見つかった？', zh: '钱包找到了吗？', en: 'Did your wallet turn up?',
      options: [
        { jp: 'ううん、電車で財布を盗まれたんだ。', zh: '没有，钱包在电车上被偷了。', en: 'No — my wallet got stolen on the train.', ok: true },
        { jp: 'ううん、電車で財布を盗ませたんだ。', zh: '没有，我让人在电车上偷了钱包。', en: 'No — I had someone steal the wallet on the train.' },
        { jp: 'ううん、電車に財布を盗まれたんだ。', zh: '没有，钱包被电车偷了。', en: 'No — the train stole my wallet.' },
        { jp: 'ううん、電車で財布に盗まれたんだ。', zh: '没有，我被钱包偷了。', en: 'No — the wallet stole me.' }
      ],
      noteZh: '自己的东西被偷，最自然的说法是以"我"为主语：「財布を盗まれた」。"被谁"用「に」，地点用「で」——电车是地点，不是小偷。',
      noteEn: 'The natural way is with "me" as subject: 財布を盗まれた. The agent takes に, the place takes で — the train is where, not who.'
    },
    {
      id: 'a3_sleep', tier: 3,
      ctxZh: '光昨晚熬夜复习，你想让她再睡一会儿。', ctxEn: 'Hikari stayed up studying last night. You want to let her sleep a bit longer.',
      jp: '光、まだ寝てるわよ。起こす？', zh: '光还在睡呢。叫醒她吗？', en: 'Hikari is still asleep. Shall I wake her?',
      options: [
        { jp: '疲れてるみたいだから、もう少し寝かせておいてあげよう。', zh: '她好像很累，再让她睡一会儿吧。', en: 'She seems tired. Let us let her sleep a little longer.', ok: true },
        { jp: '疲れてるみたいだから、もう少し寝られておこう。', zh: '（不通）', en: '(Broken)' },
        { jp: '疲れてるみたいだから、もう少し寝させられてあげよう。', zh: '（不通：被迫＋为她）', en: '(Broken: "forced" plus "for her")' },
        { jp: '疲れてるみたいだから、もう少し寝てもらわせよう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「寝かせる」＝让人睡（寝る的使役，习惯上用这个形）。「〜ておいてあげる」＝为对方着想，保持现状、不去打扰。',
      noteEn: '寝かせる = let someone sleep (the customary causative of 寝る). 〜ておいてあげる = leave things as they are, for their sake.'
    },
    {
      id: 'a3_principal', tier: 3,
      ctxZh: '校长在全校集会上宣布下周三放假。', ctxEn: 'At assembly, the principal announced next Wednesday is a day off.',
      jp: '校長先生、全校集会でなんておっしゃってた？', zh: '校长在全校集会上说了什么？', en: 'What did the principal say at assembly?',
      options: [
        { jp: '来週の水曜日は休みにすると言われたよ。', zh: '说下周三放假。', en: 'He said next Wednesday will be a holiday.', ok: true },
        { jp: '来週の水曜日は休みにすると言わせたよ。', zh: '（我）让校长说下周三放假。', en: '(I) made him say next Wednesday is a holiday.' },
        { jp: '来週の水曜日は休みにすると言わされたよ。', zh: '校长被逼着宣布了放假。', en: 'He was made to announce the holiday.' },
        { jp: '来週の水曜日は休みにすると言っていただかれたよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '这里的「言われる」是尊敬语（＝おっしゃる），不是被动。れる／られる身兼四职：被动、尊敬、可能、自发——全靠主语和语境分辨。',
      noteEn: '言われる here is honorific (= おっしゃる), not passive. れる/られる does four jobs — passive, honorific, potential, spontaneous — told apart by subject and context.'
    },
    {
      id: 'a3_song', tier: 3,
      ctxZh: '惩罚游戏输了，你被逼着在大家面前唱歌。', ctxEn: 'You lost the forfeit game and were made to sing in front of everyone.',
      jp: '罰ゲーム、何させられたの？', zh: '惩罚游戏，你被逼着做了什么？', en: 'What did they make you do for the forfeit?',
      options: [
        { jp: 'みんなの前で歌を歌わされた……。', zh: '被逼着在大家面前唱了歌……', en: 'They made me sing in front of everyone...', ok: true },
        { jp: 'みんなの前で歌を歌われた……。', zh: '有人在大家面前唱了歌（害我遭殃）……', en: 'Someone sang in front of everyone (and I suffered)...' },
        { jp: 'みんなの前で歌を歌わせられされた……。', zh: '（不通：叠了三层）', en: '(Broken: three layers)' },
        { jp: 'みんなの前で歌に歌わされた……。', zh: '被歌逼着唱了……', en: 'The song made me sing...' }
      ],
      noteZh: '「歌う」→使役「歌わせる」→使役被动「歌わせられる」→缩约「歌わされる」。',
      noteEn: '歌う → causative 歌わせる → causative-passive 歌わせられる → contracted 歌わされる.'
    },
    {
      id: 'a3_homesick', tier: 3,
      ctxZh: '明日香看见你手机里家乡的照片。看着看着，你不由得想起了从前。', ctxEn: 'Asuka sees a photo of your hometown on your phone. Looking at it, memories come back unbidden.',
      jp: 'その写真、あなたの故郷？', zh: '那张照片，是你的家乡？', en: 'Is that photo your hometown?',
      options: [
        { jp: 'うん。見てると、なんだか昔のことが思い出されるな。', zh: '嗯。看着看着，不由得想起从前的事。', en: 'Yeah. Looking at it, the old days just come back to me.', ok: true },
        { jp: 'うん。見てると、なんだか昔のことが思い出させるな。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん。見てると、なんだか昔のことに思い出されるな。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' },
        { jp: 'うん。見てると、なんだか昔のことを思い出されてもらうな。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「思い出される」「感じられる」「案じられる」：自发——"不由自主地想起／感到"。主语是想起的内容，用「が」。',
      noteEn: '思い出される, 感じられる: the spontaneous use — something comes to mind unbidden. The memory is the subject, with が.'
    },
    {
      id: 'a3_murakami', tier: 3,
      ctxZh: '书是村上春树写的——他高中读的就是神户高中。', ctxEn: 'The book is by Haruki Murakami — who went to high school in Kobe.',
      jp: 'この小説、誰が書いたか知ってる？', zh: '你知道这本小说是谁写的吗？', en: 'Do you know who wrote this novel?',
      options: [
        { jp: '村上春樹によって書かれた小説だよ。', zh: '是村上春树写的小说。', en: 'It is a novel written by Haruki Murakami.', ok: true },
        { jp: '村上春樹に書かせた小説だよ。', zh: '是（某人）让村上春树写的小说。', en: 'It is a novel (someone) had Murakami write.' },
        { jp: '村上春樹によって書いた小説だよ。', zh: '（不通：主动句不用「によって」）', en: '(Broken: active voice does not take によって)' },
        { jp: '村上春樹を書かれた小説だよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '作品、发明、建筑的创造者，在被动句里用「によって」，不用「に」。',
      noteEn: 'The creator of a work, invention or building is marked with によって in the passive, not に.'
    },
    {
      id: 'a3_early', tier: 3,
      ctxZh: '你等下要去职员室跟老师请假早退，先在明日香面前练一遍。', ctxEn: 'You are about to ask a teacher for permission to leave early, and rehearse it with Asuka first.',
      jp: '職員室に行くんでしょ。なんて言うつもり？', zh: '你要去职员室吧。打算怎么说？', en: 'You are going to the staff room, right? What will you say?',
      options: [
        { jp: '先生、今日は早退させていただけませんか。', zh: '老师，今天能否允许我早退？', en: 'Sir, might I be allowed to leave early today?', ok: true },
        { jp: '先生、今日は早退されていただけませんか。', zh: '（不通）', en: '(Broken)' },
        { jp: '先生、今日は早退させてあげませんか。', zh: '老师，您不让（谁）早退吗？', en: 'Sir, won’t you let (someone) leave early?' },
        { jp: '先生、今日は早退してさせませんか。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '向长辈请求许可，最礼貌的说法是「V-させていただけませんか」。',
      noteEn: 'The most polite way to ask a superior for permission: V-させていただけませんか.'
    },
    {
      id: 'a3_visitor', tier: 3,
      ctxZh: '考试前一晚，朋友突然跑来你家玩到半夜。', ctxEn: 'The night before the test, a friend turned up unannounced and stayed till midnight.',
      jp: 'テストの前の日、ちゃんと勉強できた？', zh: '考试前一天，好好复习了吗？', en: 'Did you manage to study the day before the test?',
      options: [
        { jp: '前の晩に友達に来られて、全然できなかったよ。', zh: '前一晚朋友跑来了，完全没复习成。', en: 'A friend dropped in that night, so I got nothing done.', ok: true },
        { jp: '前の晩に友達が来させて、全然できなかったよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '前の晩に友達を来られて、全然できなかったよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '前の晩に友達に来させられて、全然できなかったよ。', zh: '前一晚被朋友叫过去了……', en: 'A friend made me go over that night...' }
      ],
      noteZh: '「来られる」也可以是迷惑被动：朋友来了，而我因此受困。同样写作「来られる」的，还有尊敬语（先生が来られる）和可能形。',
      noteEn: '来られる can be the suffering passive: a friend came and I paid for it. The same form is also the honorific (先生が来られる) and the potential.'
    }
  ]
};
