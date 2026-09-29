import { DrillPack } from '../../types';

// ==========================================================
// 🍲 深雪 · 授受表現（あげる／くれる／もらう）
//
// 【为什么是她】
// 邻居之间的日常就是"给来给去"：炖菜端过来、快递帮着收、伞借出去。
// 授受是 N3 里中国学生错得最多的一块——中文一个"给"字包打天下，
// 日语却要看"东西往哪个方向走、站在谁的立场说"。
// 在门口跟一个总是送你东西的人练这个，再合适不过。
//
// 一档：あげる／くれる／もらう 本身，外加助词（が・に・から）
// 二档：〜てあげる／〜てくれる／〜てもらう，やる
// 三档：いただく／くださる／さしあげる，以及"〜てあげる"在长辈面前的失礼
// ==========================================================

export const MIYUKI_PACK: DrillPack = {
  id: 'miyuki',
  grammarZh: '授受表现', grammarEn: 'Giving & receiving',
  partnerZh: '深雪', partnerEn: 'Miyuki',
  sprites: {
    neutral: '/images/characters/miyuki/neutral.webp',
    happy: '/images/characters/miyuki/happy.webp',
    miss: '/images/characters/miyuki/thinking.webp'
  },
  onRight: [
    { jp: 'ふふ、上手ね。', zh: '呵呵，说得真好。', en: 'Hmhm. Nicely put.' },
    { jp: 'あら、もうすっかり慣れたわね。', zh: '哎呀，已经完全习惯了呢。', en: 'Oh my, you are quite used to it now.' },
    { jp: 'そうそう、それでいいのよ。', zh: '对对，就是这样。', en: 'That is it. Just like that.' }
  ],
  onWrong: [
    { jp: 'あら？……ふふ、惜しいわね。', zh: '哎？……呵呵，差一点呢。', en: 'Hm? ...Hmhm. So close.' },
    { jp: 'それだと、逆になっちゃうのよ。', zh: '那样说的话，方向就反过来了哦。', en: 'Said like that, it goes the other way round.' },
    { jp: '大丈夫、日本人でもたまに迷うんだから。', zh: '没关系，日本人有时候也会犹豫的。', en: 'It is fine. Even Japanese people hesitate over that one sometimes.' }
  ],
  rounds: [
    // ======================= 一档 =======================
    {
      id: 'm1_cookie', tier: 1,
      ctxZh: '你手里拿着一盒曲奇——是光给你的。', ctxEn: 'You are holding a box of cookies. Hikari gave them to you.',
      jp: 'あら、そのクッキー、どうしたの？', zh: '哎呀，那盒曲奇是哪来的？', en: 'Oh, where did those cookies come from?',
      options: [
        { jp: '光がくれたんです。', zh: '光给我的。', en: 'Hikari gave them to me.', ok: true },
        { jp: '光にくれたんです。', zh: '（不通：「くれる」不能"给光"）', en: '(Broken: くれる cannot go "to Hikari")' },
        { jp: '光があげたんです。', zh: '光给（别人）的。', en: 'Hikari gave them (to someone else).' }
      ],
      noteZh: '别人给「我」东西用「くれる」，给的人用「が」。「あげる」只能用在往外给的方向——所以接收者是你的时候，「光があげた」就错了。',
      noteEn: 'When someone gives something to ME, use くれる, with the giver marked by が. あげる only points outward, so it cannot be used when you are the receiver.',
      word: { jp: 'くれる', zh: '（别人）给我', en: 'to give (to me)' }
    },
    {
      id: 'm1_present', tier: 1,
      ctxZh: '你提着一个礼品袋，是准备送给光的生日礼物。', ctxEn: 'You are carrying a gift bag — a birthday present for Hikari.',
      jp: 'その袋、なあに？', zh: '那个袋子是什么呀？', en: 'What is in that bag?',
      options: [
        { jp: '光の誕生日なので、光にあげるんです。', zh: '光过生日，我要送给光。', en: 'It is Hikari’s birthday, so I am giving it to her.', ok: true },
        { jp: '光の誕生日なので、光にくれるんです。', zh: '（不通：「くれる」只能给我）', en: '(Broken: くれる only goes to me)' },
        { jp: '光の誕生日なので、光にもらうんです。', zh: '光过生日，我要从光那里拿。', en: 'It is Hikari’s birthday, so I am getting it from her.' }
      ],
      noteZh: '我给别人 → 「あげる」，接受的人用「に」。「もらう」是"我从某人那儿得到"，方向正好反了。',
      noteEn: 'Me giving to someone → あげる, with the receiver marked by に. もらう means receiving FROM someone — the opposite direction.',
      word: { jp: 'あげる', zh: '给（别人）', en: 'to give (away)' }
    },
    {
      id: 'm1_umbrella', tier: 1,
      ctxZh: '你撑着一把新伞——是奈绪送的。', ctxEn: 'You have a new umbrella. Nao gave it to you.',
      jp: 'その傘、新しいわね。', zh: '那把伞是新的呢。', en: 'That umbrella is new, isn’t it.',
      options: [
        { jp: '奈緒にもらったんです。', zh: '是从奈绪那儿收到的。', en: 'I got it from Nao.', ok: true },
        { jp: '奈緒をもらったんです。', zh: '我把奈绪领回家了。', en: 'I took Nao home (as mine).' },
        { jp: '奈緒にあげたんです。', zh: '我把它送给奈绪了。', en: 'I gave it to Nao.' }
      ],
      noteZh: '「もらう」：我从某人那儿得到，给的人用「に」或「から」。写成「奈緒をもらった」，就成了"把奈绪领回家"——嫁娶时才这么说。',
      noteEn: 'もらう: I receive from someone, marked with に or から. 奈緒をもらった would mean you took Nao herself — the phrase used for taking a bride.',
      word: { jp: 'もらう', zh: '得到、收到', en: 'to receive' }
    },
    {
      id: 'm1_curry', tier: 1,
      ctxZh: '上周深雪端给你一锅咖喱，你想说"深雪姐给的咖喱特别好吃"。', ctxEn: 'Last week Miyuki brought you a pot of curry. You want to say it was delicious.',
      jp: 'この前のカレー、どうだった？', zh: '上次的咖喱怎么样？', en: 'How was that curry the other day?',
      options: [
        { jp: '深雪さんがくれたカレー、すごくおいしかったです。', zh: '深雪姐给我的咖喱，特别好吃。', en: 'The curry you gave me was really delicious.', ok: true },
        { jp: '深雪さんがあげたカレー、すごくおいしかったです。', zh: '深雪姐给（别人）的咖喱……', en: 'The curry you gave (to someone else)...' },
        { jp: '深雪さんにくれたカレー、すごくおいしかったです。', zh: '（不通：「くれる」不能给深雪）', en: '(Broken: くれる cannot go to Miyuki)' }
      ],
      noteZh: '修饰名词时规则不变："深雪给我的咖喱"＝「深雪さんがくれたカレー」。东西朝你这边来，就用「くれる」。',
      noteEn: 'The rule holds inside a noun phrase: "the curry Miyuki gave me" is 深雪さんがくれたカレー. Coming toward you → くれる.'
    },
    {
      id: 'm1_peach', tier: 1,
      ctxZh: '老家寄来一箱桃子，你拿了几个打算给奈绪。', ctxEn: 'A box of peaches came from home. You are taking a few to Nao.',
      jp: '奈緒ちゃんのところに行くの？', zh: '你要去奈绪那儿吗？', en: 'Are you going over to Nao’s?',
      options: [
        { jp: 'はい、実家から届いた桃を奈緒にあげます。', zh: '嗯，把老家寄来的桃子给奈绪。', en: 'Yes, I am giving Nao some peaches from home.', ok: true },
        { jp: 'はい、実家から届いた桃を奈緒にくれます。', zh: '（不通：「くれる」只能给我）', en: '(Broken: くれる only goes to me)' },
        { jp: 'はい、実家から届いた桃を奈緒からもらいます。', zh: '嗯，从奈绪那儿拿桃子。', en: 'Yes, I am getting peaches from Nao.' }
      ],
      noteZh: '「から」只标"从哪里来"。桃子是从你手里出去的，所以是「奈緒にあげる」。',
      noteEn: 'から marks where something comes FROM. The peaches leave your hands, so it is 奈緒にあげる.'
    },
    {
      id: 'm1_hairpin', tier: 1,
      ctxZh: '你们在聊光的生日。明日香送了光一个发夹。', ctxEn: 'You are talking about Hikari’s birthday. Asuka gave Hikari a hairpin.',
      jp: '光ちゃん、誕生日だったんでしょう？', zh: '光过生日了吧？', en: 'It was Hikari’s birthday, wasn’t it?',
      options: [
        { jp: 'はい。明日香が光にヘアピンをあげました。', zh: '嗯，明日香送了光一个发夹。', en: 'Yes. Asuka gave Hikari a hairpin.', ok: true },
        { jp: 'はい。明日香が光にヘアピンをくれました。', zh: '（不通：两人都不是"我"）', en: '(Broken: neither of them is "me")' },
        { jp: 'はい。明日香が光にヘアピンをもらいました。', zh: '明日香从光那儿收到了发夹。', en: 'Asuka got a hairpin from Hikari.' }
      ],
      noteZh: '两个都是"别人"时，一律用「あげる」。「くれる」只有接收者是我、或者我这边的人（家人）时才能用。',
      noteEn: 'Between two other people, it is always あげる. くれる only works when the receiver is me or someone on my side (like family).'
    },
    {
      id: 'm1_pen', tier: 1,
      ctxZh: '书桌上那支钢笔，是外公给的。', ctxEn: 'The fountain pen on your desk was a gift from your grandfather.',
      jp: 'いいペンね。', zh: '好漂亮的钢笔啊。', en: 'What a lovely pen.',
      options: [
        { jp: '祖父からもらいました。', zh: '是从外公那儿得到的。', en: 'I got it from my grandfather.', ok: true },
        { jp: '祖父でもらいました。', zh: '（不通：「で」不能表示来源）', en: '(Broken: で cannot mark the giver)' },
        { jp: '祖父までもらいました。', zh: '连外公都收到了。', en: 'Even my grandfather got one.' }
      ],
      noteZh: '「もらう」的来源用「に」或「から」都行，「で」不行。提到自己家人时不加敬称，说「祖父」「母」。',
      noteEn: 'The source of もらう takes に or から, never で. When mentioning your own family to others, drop honorifics: 祖父, 母.'
    },
    {
      id: 'm1_scholarship', tier: 1,
      ctxZh: '学校给你批下来了一笔奖学金。', ctxEn: 'The school has awarded you a scholarship.',
      jp: '奨学金、決まったんですって？', zh: '听说奖学金定下来了？', en: 'I hear your scholarship came through?',
      options: [
        { jp: 'はい、学校から奨学金をもらいました。', zh: '嗯，从学校拿到了奖学金。', en: 'Yes, I received a scholarship from the school.', ok: true },
        { jp: 'はい、学校に奨学金をもらいました。', zh: '（不自然：机构不用「に」）', en: '(Unnatural: institutions do not take に)' },
        { jp: 'はい、学校が奨学金をもらいました。', zh: '嗯，学校拿到了奖学金。', en: 'Yes, the school received a scholarship.' }
      ],
      noteZh: '给的一方是学校、公司、政府这种机构时，「もらう」只搭「から」。「に」只用在具体的人身上。',
      noteEn: 'When the giver is an institution — a school, company, government — もらう takes から only. に is for people.',
      word: { jp: '奨学金', reading: 'しょうがくきん', zh: '奖学金', en: 'scholarship' }
    },
    {
      id: 'm1_already', tier: 1,
      ctxZh: '深雪让你把点心也分给光，可你昨天已经给过了。', ctxEn: 'Miyuki suggests sharing the sweets with Hikari — but you already did yesterday.',
      jp: 'このお菓子、光ちゃんにもあげたら？', zh: '这点心也给光一些吧？', en: 'Why not give some of these to Hikari too?',
      options: [
        { jp: 'もう昨日、光にあげました。', zh: '昨天已经给光了。', en: 'I already gave her some yesterday.', ok: true },
        { jp: 'もう昨日、光からあげました。', zh: '（不通：「あげる」不接「から」）', en: '(Broken: あげる does not take から)' },
        { jp: 'もう昨日、光にくれました。', zh: '（不通：「くれる」不能给光）', en: '(Broken: くれる cannot go to Hikari)' }
      ],
      noteZh: '「あげる」的接受者只能用「に」。「から」是"从…那里"，只跟「もらう」这类"拿进来"的动词搭。',
      noteEn: 'あげる marks its receiver with に only. から means "from", and pairs with verbs of taking in, like もらう.'
    },
    {
      id: 'm1_apple', tier: 1,
      ctxZh: '深雪递过来一个苹果，问你要不要。你想收下。', ctxEn: 'Miyuki holds out an apple and asks if you want one. You do.',
      jp: 'りんご、一つどう？', zh: '要不要来个苹果？', en: 'How about an apple?',
      options: [
        { jp: 'いいんですか？じゃあ、一ついただきます。', zh: '可以吗？那我就收下一个。', en: 'Are you sure? Then I will take one, thank you.', ok: true },
        { jp: 'いいんですか？じゃあ、一つくれます。', zh: '（不通：主语对不上）', en: '(Broken: the subject does not fit)' },
        { jp: 'いいんですか？じゃあ、一つあげます。', zh: '可以吗？那我给你一个。', en: 'Are you sure? Then I will give you one.' }
      ],
      noteZh: '自己接受时说「もらいます」，对长辈更礼貌地说「いただきます」。「くれます」的主语得是对方，用来说自己就不通了。',
      noteEn: 'When you are the one receiving, say もらいます — or, to an elder, いただきます. くれます needs the other person as subject.'
    },

    // ======================= 二档 =======================
    {
      id: 'm2_moving', tier: 2,
      ctxZh: '其实搬家那天，是班上的健太来帮你搬的。', ctxEn: 'On moving day, Kenta from your class actually came to help.',
      jp: '引っ越しの荷物、一人で運んだの？', zh: '搬家的行李，是你一个人搬的吗？', en: 'Did you carry all your things in by yourself?',
      options: [
        { jp: 'いえ、クラスの健太が手伝ってくれました。', zh: '没有，班上的健太来帮我了。', en: 'No, Kenta from my class helped me.', ok: true },
        { jp: 'いえ、クラスの健太が手伝ってあげました。', zh: '没有，健太帮（别人）了。', en: 'No, Kenta helped (someone else).' },
        { jp: 'いえ、クラスの健太に手伝ってくれました。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' }
      ],
      noteZh: '别人为我做事＝「〜てくれる」，做事的人用「が」。「〜てあげる」方向相反，是"我为别人做"。',
      noteEn: 'Someone doing something for me = 〜てくれる, doer marked with が. 〜てあげる is the reverse: me doing it for someone.'
    },
    {
      id: 'm2_shelf', tier: 2,
      ctxZh: '书架坏了，你请大楼管理员帮忙修好了。', ctxEn: 'Your shelf broke. You asked the building caretaker to fix it.',
      jp: 'この棚、どうやって直したの？', zh: '这个架子是怎么修好的？', en: 'How did you fix this shelf?',
      options: [
        { jp: '管理人さんに直してもらいました。', zh: '请管理员帮我修的。', en: 'I had the caretaker fix it.', ok: true },
        { jp: '管理人さんが直してもらいました。', zh: '管理员请（别人）修的。', en: 'The caretaker had it fixed (by someone).' },
        { jp: '管理人さんに直してあげました。', zh: '我替管理员修的。', en: 'I fixed it for the caretaker.' }
      ],
      noteZh: '「〜てもらう」：我请别人为我做，做事的人用「に」，句子的主语还是"我"。「管理人さんが直してもらった」主语就错位了。',
      noteEn: '〜てもらう: I get someone to do it for me. The doer takes に; the subject stays "I". With が, the caretaker becomes the one receiving the favour.'
    },
    {
      id: 'm2_homework', tier: 2,
      ctxZh: '奈绪作业卡住了——你昨晚已经教过她了。', ctxEn: 'Nao was stuck on homework — you already helped her last night.',
      jp: '奈緒ちゃん、宿題で困ってたみたいよ。', zh: '奈绪好像为作业发愁呢。', en: 'Nao seemed to be struggling with her homework.',
      options: [
        { jp: '昨日、少し教えてあげました。', zh: '昨天我稍微教了她一下。', en: 'I taught her a bit yesterday.', ok: true },
        { jp: '昨日、少し教えてくれました。', zh: '昨天她稍微教了我一下。', en: 'She taught me a bit yesterday.' },
        { jp: '昨日、少し教えてもらいました。', zh: '昨天我请她教了我一下。', en: 'I had her teach me a bit yesterday.' }
      ],
      noteZh: '我为别人做＝「〜てあげる」。不过当着对方或对长辈说「〜てあげた」会显得在邀功——在奈绪面前，最好只说「教えました」。',
      noteEn: 'Doing it for someone = 〜てあげる. But saying it to their face, or to an elder, sounds like claiming credit. In front of Nao, just say 教えました.'
    },
    {
      id: 'm2_photo', tier: 2,
      ctxZh: '那张照片是铃帮你拍的。', ctxEn: 'Rei took that photo for you.',
      jp: 'その写真、よく撮れてるわね。', zh: '这张照片拍得真好。', en: 'That photo came out really well.',
      options: [
        { jp: '鈴さんが撮ってくれたんです。', zh: '是铃帮我拍的。', en: 'Rei took it for me.', ok: true },
        { jp: '鈴さんに撮ってくれたんです。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' },
        { jp: '鈴さんが撮ってもらったんです。', zh: '铃请（别人）拍的。', en: 'Rei had someone take it.' }
      ],
      noteZh: '同一件事有两种说法：「鈴さんが撮ってくれた」（主语是铃）、「鈴さんに撮ってもらった」（主语是我）。助词跟着主语走，不能混用。',
      noteEn: 'Two ways to say it: 鈴さんが撮ってくれた (Rei as subject) or 鈴さんに撮ってもらった (me as subject). The particle follows the subject — no mixing.'
    },
    {
      id: 'm2_hikari_tutor', tier: 2,
      ctxZh: '光的日语进步很快——她每周请明日香给她补课。', ctxEn: 'Hikari’s Japanese is improving fast. Asuka tutors her every week.',
      jp: '光ちゃん、日本語が上手になったわね。', zh: '光的日语变好了呢。', en: 'Hikari’s Japanese has really improved.',
      options: [
        { jp: '毎週、明日香に教えてもらっているそうです。', zh: '听说她每周请明日香教她。', en: 'Apparently Asuka teaches her every week.', ok: true },
        { jp: '毎週、明日香が教えてもらっているそうです。', zh: '听说明日香每周请人教她。', en: 'Apparently Asuka gets taught every week.' },
        { jp: '毎週、明日香に教えてあげているそうです。', zh: '听说光每周教明日香。', en: 'Apparently Hikari teaches Asuka every week.' }
      ],
      noteZh: '主语（光）省略了，但「〜てもらう」的主语依然是接受好处的光，教的人明日香用「に」。',
      noteEn: 'The subject (Hikari) is dropped, but with 〜てもらう she is still the one receiving the favour; Asuka, the teacher, takes に.'
    },
    {
      id: 'm2_tomato', tier: 2,
      ctxZh: '阳台上的番茄是你种的，每天早上都浇水。', ctxEn: 'You grow the tomatoes on the balcony and water them every morning.',
      jp: 'ベランダのトマト、元気ね。', zh: '阳台的番茄长得真精神。', en: 'Your balcony tomatoes look healthy.',
      options: [
        { jp: '毎朝、水をやっています。', zh: '我每天早上都浇水。', en: 'I water them every morning.', ok: true },
        { jp: '毎朝、水をくれています。', zh: '（不通：番茄没有给你水）', en: '(Broken: the tomatoes are not giving you water)' },
        { jp: '毎朝、水をもらっています。', zh: '我每天早上都收到水。', en: 'I receive water every morning.' }
      ],
      noteZh: '给植物浇水、给动物喂食，教科书用「やる」（口语里也常说「あげる」）。「くれる」「もらう」方向都不对——是你给番茄水。',
      noteEn: 'For watering plants or feeding animals, the textbook verb is やる (あげる is also common in speech). くれる and もらう run the wrong way — you give the tomatoes water.'
    },
    {
      id: 'm2_directions', tier: 2,
      ctxZh: '你迷路的时候，一位不认识的老奶奶给你指了路。', ctxEn: 'When you got lost, an old lady you did not know showed you the way.',
      jp: '駅までの道、分かった？', zh: '去车站的路找到了吗？', en: 'Did you find your way to the station?',
      options: [
        { jp: 'はい、知らないおばあさんが教えてくれました。', zh: '嗯，一位不认识的老奶奶给我指了路。', en: 'Yes, an old lady I did not know showed me.', ok: true },
        { jp: 'はい、知らないおばあさんに教えてくれました。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' },
        { jp: 'はい、知らないおばあさんが教えてもらいました。', zh: '嗯，老奶奶请（别人）告诉了她。', en: 'Yes, the old lady had someone tell her.' }
      ],
      noteZh: '陌生人对你的善意，日语一律用「〜てくれる」表达出来——这不只是语法，也是在说"我领了这份情"。',
      noteEn: 'A stranger’s kindness toward you is always framed with 〜てくれる. It is grammar, but it is also you acknowledging the favour.'
    },
    {
      id: 'm2_essay', tier: 2,
      ctxZh: '你想请深雪帮你看看你写的日语作文。', ctxEn: 'You want to ask Miyuki to look over your Japanese essay.',
      jp: 'あら、何か用？', zh: '哎，有什么事吗？', en: 'Oh, did you need something?',
      options: [
        { jp: 'この作文、ちょっと見てもらえませんか。', zh: '这篇作文，能帮我看一下吗？', en: 'Could you take a look at this essay for me?', ok: true },
        { jp: 'この作文、ちょっと見てあげませんか。', zh: '这篇作文，不帮（别人）看看吗？', en: 'Won’t you look at it for (someone)?' },
        { jp: 'この作文、ちょっと見てもらいませんか。', zh: '我们一起请人看看这篇作文吧？', en: 'Shall we get someone to look at it?' }
      ],
      noteZh: '请别人为自己做：「〜てもらえませんか」或「〜てくれませんか」。「〜てもらいませんか」是劝诱——"我们一起去请人看吧"，意思整个变了。',
      noteEn: 'Asking a favour: 〜てもらえませんか or 〜てくれませんか. 〜てもらいませんか is an invitation — "shall we get someone to...?" — a different meaning entirely.'
    },
    {
      id: 'm2_tea', tier: 2,
      ctxZh: '妈妈从老家寄来了茶叶。', ctxEn: 'Your mother sent you tea leaves from home.',
      jp: 'お母さん、何か送ってくれたの？', zh: '妈妈寄东西来了吗？', en: 'Did your mother send you something?',
      options: [
        { jp: 'はい、母が故郷のお茶を送ってくれました。', zh: '嗯，妈妈寄来了家乡的茶。', en: 'Yes, my mother sent me tea from home.', ok: true },
        { jp: 'はい、母が故郷のお茶を送ってあげました。', zh: '嗯，妈妈给（别人）寄了茶。', en: 'Yes, my mother sent tea (to someone).' },
        { jp: 'はい、母に故郷のお茶を送ってくれました。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' }
      ],
      noteZh: '家人为我做的事同样用「〜てくれる」。对外人提到自己妈妈，说「母」，不说「お母さん」。',
      noteEn: 'Family doing things for you still takes 〜てくれる. To outsiders, refer to your own mother as 母, not お母さん.'
    },
    {
      id: 'm2_notebook', tier: 2,
      ctxZh: '你借给光的笔记本，今天刚还回来。', ctxEn: 'The notebook you lent Hikari came back today.',
      jp: 'そのノート、きれいにまとめてあるわね。', zh: '这本笔记整理得好整齐。', en: 'Those notes are beautifully organised.',
      options: [
        { jp: '光に貸してあげたノートが、今日戻ってきたんです。', zh: '借给光的笔记今天还回来了。', en: 'The notes I lent Hikari came back today.', ok: true },
        { jp: '光に貸してくれたノートが、今日戻ってきたんです。', zh: '（不通：「くれる」不能给光）', en: '(Broken: くれる cannot go to Hikari)' },
        { jp: '光に貸してもらったノートが、今日戻ってきたんです。', zh: '从光那儿借来的笔记今天回来了。', en: 'The notes I borrowed from Hikari came back today.' }
      ],
      noteZh: '「貸してあげた」＝我借给别人；「貸してもらった」＝别人借给我。同一个「貸す」，挂上不同的授受动词，借出借入就对调了。',
      noteEn: '貸してあげた = I lent it out; 貸してもらった = someone lent it to me. Same verb, but the giving/receiving auxiliary flips who lent to whom.'
    },

    // ======================= 三档 =======================
    {
      id: 'm3_jam', tier: 3,
      ctxZh: '深雪送你一瓶亲手做的草莓果酱。', ctxEn: 'Miyuki offers you a jar of homemade strawberry jam.',
      jp: 'よかったら、これ。いちごジャム作ったの。', zh: '不嫌弃的话，这个给你。我做了草莓果酱。', en: 'If you would like — here. I made strawberry jam.',
      options: [
        { jp: 'ありがとうございます。遠慮なくいただきます。', zh: '谢谢您，那我就不客气地收下了。', en: 'Thank you. I will gladly accept it.', ok: true },
        { jp: 'ありがとうございます。遠慮なくくださいます。', zh: '（不通：「くださる」主语是对方）', en: '(Broken: くださる takes the other person as subject)' },
        { jp: 'ありがとうございます。遠慮なくさしあげます。', zh: '谢谢，那我就不客气地送给您。', en: 'Thank you. I will gladly present it to you.' },
        { jp: 'ありがとうございます。遠慮なくもらってあげます。', zh: '谢谢，那我就勉为其难地收下吧。', en: 'Thanks. I will do you the favour of taking it.' }
      ],
      noteZh: '从长辈那里接受东西，谦让语是「いただく」。「くださる」是对方给我时对方的动作，不能说自己；「さしあげる」是我给长辈。「もらってあげる」是在施恩，很失礼。',
      noteEn: 'Receiving from an elder: いただく (humble). くださる describes the elder’s action of giving; さしあげる is you giving upward. もらってあげる makes it a favour to them — rude.',
      word: { jp: 'いただく', zh: '（谦）收下、领受', en: 'to receive (humble)' }
    },
    {
      id: 'm3_sweets', tier: 3,
      ctxZh: '你想说"深雪姐给的点心特别好吃"，而且要说得礼貌。', ctxEn: 'You want to say, politely, that the sweets Miyuki gave you were delicious.',
      jp: 'この前のお菓子、お口に合ったかしら。', zh: '上次的点心，合你口味吗？', en: 'I wonder if the sweets suited your taste.',
      options: [
        { jp: '深雪さんがくださったお菓子、とてもおいしかったです。', zh: '深雪姐给我的点心，非常好吃。', en: 'The sweets you gave me were delicious.', ok: true },
        { jp: '深雪さんがいただいたお菓子、とてもおいしかったです。', zh: '深雪姐收到的点心……', en: 'The sweets that you received...' },
        { jp: '深雪さんにくださったお菓子、とてもおいしかったです。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' },
        { jp: '深雪さんがさしあげたお菓子、とてもおいしかったです。', zh: '深雪姐献给（长辈）的点心……', en: 'The sweets you presented (to a superior)...' }
      ],
      noteZh: '长辈给我＝「くださる」（くれる的尊敬语），给的人用「が」。「いただく」的主语是我，所以「深雪さんがいただいた」变成了"深雪收到的"。',
      noteEn: 'An elder giving to me = くださる (honorific of くれる), giver marked by が. いただく has ME as subject, so 深雪さんがいただいた means sweets Miyuki received.',
      word: { jp: 'くださる', zh: '（尊）给我', en: 'to give me (honorific)' }
    },
    {
      id: 'm3_caretaker_gift', tier: 3,
      ctxZh: '你拎着一盒家乡点心，打算送给年长的大楼管理员。', ctxEn: 'You are carrying a box of sweets from home, meant for the elderly building caretaker.',
      jp: 'その箱、どうするの？', zh: '那个盒子打算怎么办？', en: 'What is that box for?',
      options: [
        { jp: '管理人さんにさしあげようと思って。', zh: '想着送给管理员。', en: 'I was thinking of giving it to the caretaker.', ok: true },
        { jp: '管理人さんにくださろうと思って。', zh: '（不通：「くださる」不能用在自己身上）', en: '(Broken: くださる cannot describe your own act)' },
        { jp: '管理人さんにいただこうと思って。', zh: '想着从管理员那儿收下。', en: 'I was thinking of receiving it from the caretaker.' },
        { jp: '管理人さんがくださると思って。', zh: '我以为管理员会给我。', en: 'I thought the caretaker would give it to me.' }
      ],
      noteZh: '我给长辈＝「さしあげる」（あげる的谦让语）。不过当面递过去时，日本人更常说「よろしければどうぞ」——直接说「さしあげます」反而有点居高临下。',
      noteEn: 'Giving to an elder = さしあげる (humble あげる). But face to face, people usually say よろしければどうぞ; saying さしあげます outright can sound lordly.',
      word: { jp: 'さしあげる', zh: '（谦）呈送', en: 'to give (humble)' }
    },
    {
      id: 'm3_nimono', tier: 3,
      ctxZh: '你想请深雪（长辈）下次教你做炖菜。', ctxEn: 'You want to ask Miyuki, as your elder, to teach you her simmered dish next time.',
      jp: '今日の煮物、けっこう自信作なのよ。', zh: '今天的炖菜，我可是很有自信的哦。', en: 'I am rather proud of today’s simmered dish.',
      options: [
        { jp: '今度、作り方を教えていただけませんか。', zh: '下次能请您教我做法吗？', en: 'Could you possibly teach me how to make it sometime?', ok: true },
        { jp: '今度、作り方を教えていただきませんか。', zh: '下次我们一起去请人教吧？', en: 'Shall we go and get someone to teach us sometime?' },
        { jp: '今度、作り方を教えてさしあげませんか。', zh: '下次不去教（长辈）做法吗？', en: 'Won’t you teach it to (someone superior)?' },
        { jp: '今度、作り方を教えてくださりませんか。', zh: '（形式错误：应为「くださいませんか」）', en: '(Wrong form: should be くださいませんか)' }
      ],
      noteZh: '请长辈为自己做：「〜ていただけませんか」或「〜てくださいませんか」。注意「くださる」的ます形是「くださいます」，不是「くださります」。',
      noteEn: 'Asking an elder: 〜ていただけませんか or 〜てくださいませんか. Note くださる conjugates to くださいます, not くださります.'
    },
    {
      id: 'm3_rice', tier: 3,
      ctxZh: '深雪抱着一袋很重的米正要上楼。', ctxEn: 'Miyuki is about to carry a heavy sack of rice up the stairs.',
      jp: 'よいしょ……。', zh: '嘿咻……', en: 'Hup...',
      options: [
        { jp: '重そうですね。お持ちしましょうか。', zh: '看起来好重，我来帮您拿吧？', en: 'That looks heavy. Shall I carry it for you?', ok: true },
        { jp: '重そうですね。持ってあげます。', zh: '看起来好重，我给你拿吧。', en: 'That looks heavy. I’ll carry it for you.' },
        { jp: '重そうですね。持っていただきます。', zh: '看起来好重，请您（替我）拿着。', en: 'That looks heavy. I’ll have you carry it.' },
        { jp: '重そうですね。持ってくださいます。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '对长辈说「〜てあげる」，听起来像在施恩，这是留学生最常犯的失礼之一。主动帮忙用「お〜しましょうか」（谦让语＋提议）。',
      noteEn: 'Saying 〜てあげる to an elder sounds like bestowing a favour — one of the commonest slips learners make. Offer help with お〜しましょうか.'
    },
    {
      id: 'm3_landlord', tier: 3,
      ctxZh: '前几天房东来帮你修好了热水器。', ctxEn: 'The other day the landlord came and fixed your water heater.',
      jp: '大家さんに、ちゃんとお礼は言った？', zh: '有好好跟房东道谢吗？', en: 'Did you remember to thank the landlord?',
      options: [
        { jp: 'はい。大家さんに直していただいたので、お礼を言いました。', zh: '嗯，房东帮我修好了，我道过谢了。', en: 'Yes. The landlord kindly fixed it, so I thanked them.', ok: true },
        { jp: 'はい。大家さんが直していただいたので、お礼を言いました。', zh: '房东请（别人）修的……', en: 'The landlord had someone fix it...' },
        { jp: 'はい。大家さんに直してくださったので、お礼を言いました。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' },
        { jp: 'はい。大家さんに直してさしあげたので、お礼を言いました。', zh: '我替房东修的……', en: 'I fixed it for the landlord...' }
      ],
      noteZh: '两套说法助词正好相反：「大家さんに〜ていただく」（主语是我）／「大家さんが〜てくださる」（主语是房东）。',
      noteEn: 'The two honorific versions take opposite particles: 大家さんに〜ていただく (me as subject) / 大家さんが〜てくださる (landlord as subject).'
    },
    {
      id: 'm3_haircut', tier: 3,
      ctxZh: '你在三宫的美容院剪了头发。', ctxEn: 'You got your hair cut at a salon in Sannomiya.',
      jp: 'あら、髪切ったのね。', zh: '哎呀，你剪头发了呀。', en: 'Oh, you got a haircut.',
      options: [
        { jp: 'はい、三宮の美容院で切ってもらいました。', zh: '嗯，在三宫的美容院剪的。', en: 'Yes, I had it cut at a salon in Sannomiya.', ok: true },
        { jp: 'はい、三宮の美容院を切ってもらいました。', zh: '请人把三宫的美容院剪了。', en: 'I had the Sannomiya salon cut.' },
        { jp: 'はい、三宮の美容院で切ってあげました。', zh: '在三宫的美容院给（别人）剪了。', en: 'I cut (someone’s) hair at the salon.' },
        { jp: 'はい、三宮の美容院が切ってもらいました。', zh: '美容院请人剪的。', en: 'The salon had someone cut it.' }
      ],
      noteZh: '请专业的人为自己做事（剪头发、修东西、看病），日语常用「〜てもらう」。只说「髪を切りました」也很常见，但那听起来也可能是自己剪的。',
      noteEn: 'Having a professional do something for you — haircut, repair, check-up — is typically 〜てもらう. Plain 髪を切りました is common too, but could mean you cut it yourself.'
    },
    {
      id: 'm3_laundry', tier: 3,
      ctxZh: '昨天突然下雨，深雪帮你把晾在外面的衣服收了进去。你想郑重道谢。', ctxEn: 'Yesterday it suddenly rained, and Miyuki brought your laundry in. You want to thank her properly.',
      jp: 'あ、昨日は大丈夫だった？', zh: '啊，昨天没事吧？', en: 'Oh — were you all right yesterday?',
      options: [
        { jp: '昨日は洗濯物を取り込んでくださって、ありがとうございました。', zh: '昨天谢谢您帮我把衣服收进来。', en: 'Thank you so much for bringing my laundry in yesterday.', ok: true },
        { jp: '昨日は洗濯物を取り込んでさしあげて、ありがとうございました。', zh: '（主客颠倒）', en: '(Giver and receiver swapped)' },
        { jp: '昨日は洗濯物を取り込ませていただいて、ありがとうございました。', zh: '谢谢您让我收了衣服。', en: 'Thank you for letting me bring the laundry in.' },
        { jp: '昨日は洗濯物を取り込んでもらってあげて、ありがとうございました。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '感谢长辈为自己做的事：「〜てくださって、ありがとうございました」。「〜させていただいて」是"承蒙您允许我做"，做事的人变成了自己。',
      noteEn: 'Thanking an elder for doing something: 〜てくださって、ありがとうございました. 〜させていただいて means "thank you for letting ME do it".'
    },
    {
      id: 'm3_persimmon', tier: 3,
      ctxZh: '你想顺便提一句："管理员还送了我柿子。"', ctxEn: 'You want to mention that the caretaker also gave you persimmons.',
      jp: '管理人さん、あなたのこと褒めてたわよ。', zh: '管理员一直在夸你呢。', en: 'The caretaker was singing your praises.',
      options: [
        { jp: 'そういえば、管理人さんが柿をくださいました。', zh: '说起来，管理员还给了我柿子。', en: 'Come to think of it, the caretaker gave me persimmons.', ok: true },
        { jp: 'そういえば、管理人さんに柿をくださいました。', zh: '（不通：助词错了）', en: '(Broken: wrong particle)' },
        { jp: 'そういえば、管理人さんが柿をいただきました。', zh: '说起来，管理员收到了柿子。', en: 'Come to think of it, the caretaker received persimmons.' },
        { jp: 'そういえば、管理人さんに柿をさしあげられました。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「くださる」的主语是给的长辈，用「が」。如果想以自己为主语，就说「管理人さんに柿をいただきました」。',
      noteEn: 'くださる takes the giving elder as subject, with が. With yourself as subject, say 管理人さんに柿をいただきました.'
    },
    {
      id: 'm3_ageru_trap', tier: 3,
      ctxZh: '深雪说起自己小时候的事。你想问"那时候是谁教你做菜的"。', ctxEn: 'Miyuki mentions her childhood. You want to ask who taught her to cook back then.',
      jp: '小さい頃は、料理なんて全然できなかったのよ。', zh: '我小时候完全不会做菜的。', en: 'When I was little, I could not cook at all.',
      options: [
        { jp: 'じゃあ、どなたに教えてもらったんですか。', zh: '那是谁教您的呢？', en: 'Then who taught you?', ok: true },
        { jp: 'じゃあ、どなたが教えてもらったんですか。', zh: '那是谁请人教的呢？', en: 'Then who was it who got taught?' },
        { jp: 'じゃあ、どなたに教えてあげたんですか。', zh: '那您教了谁呢？', en: 'Then whom did you teach?' },
        { jp: 'じゃあ、どなたを教えてくれたんですか。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '问"谁为你做了什么"，主语是对方（被省略），用「どなたに〜てもらった」。换成「どなたが教えてくれたんですか」也对——但注意这时「くれた」的"我这边"是深雪自己。',
      noteEn: 'Asking who did something for her: どなたに〜てもらった, with Miyuki as the unspoken subject. どなたが教えてくれたんですか also works — here the "my side" of くれる is Miyuki’s.'
    }
  ]
};
