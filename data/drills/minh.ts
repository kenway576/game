import { DrillPack } from '../../types';

// ==========================================================
// 🎒 明（ミン）· 条件形（と／ば／たら／なら）
//
// 【为什么是他】
// 明是刚来一个月的越南留学生，一年级。国际交流室里他追着你问东问西：
// 市役所怎么走、奖学金怎么申请、京都要不要早点出门——
// 全是"如果……就……"的问题。
// 序章里你是那个什么都不懂的人；到这里，你成了被问的那个。
//
// 条件形是 N3 的一块硬骨头：四个形式，中文都翻成"如果"，
// 但后面能接什么、能不能说过去的事，各有各的规矩。
//
// 一档：四种形式怎么变
// 二档：と后面不能接意志；なら的时间顺序；反事实；〜ば〜ほど；さえ〜ば
// 三档：过去的发现、后悔、请求句前只能用たら、だったら、〜たところ
// ==========================================================

export const MINH_PACK: DrillPack = {
  id: 'minh',
  grammarZh: '条件形', grammarEn: 'Conditionals',
  partnerZh: '明（后辈）', partnerEn: 'Minh (first-year)',
  sprites: {
    neutral: '/images/characters/npc_minh.webp',
    happy: '/images/characters/npc_minh.webp',
    miss: '/images/characters/npc_minh.webp'
  },
  onRight: [
    { jp: 'なるほど！ありがとうございます、先輩！', zh: '原来如此！谢谢学长！', en: 'I see! Thank you, senpai!' },
    { jp: 'メモしておきます！', zh: '我记下来！', en: 'I’ll write that down!' },
    { jp: '先輩、すごいです……！', zh: '学长好厉害……！', en: 'Senpai, you’re amazing...!' }
  ],
  onWrong: [
    { jp: 'えっ……？そうなんですか？', zh: '诶……？是这样的吗？', en: 'Eh...? Is that right?' },
    { jp: 'すみません、ちょっと分からなくなりました……。', zh: '对不起，我有点搞糊涂了……', en: 'Sorry, I’ve got a bit confused...' },
    { jp: 'あの……教科書と、少し違う気がします。', zh: '那个……感觉跟课本上有点不一样。', en: 'Um... that seems a little different from the textbook.' }
  ],
  rounds: [
    // ======================= 一档 =======================
    {
      id: 'n1_cityhall', tier: 1,
      ctxZh: '从三宫站沿着花之路一直往南走，就到市役所。', ctxEn: 'From Sannomiya Station, walk straight south down Flower Road to reach City Hall.',
      jp: '先輩、市役所ってどう行けばいいですか。', zh: '学长，市役所怎么走？', en: 'Senpai, how do I get to City Hall?',
      options: [
        { jp: 'フラワーロードをまっすぐ南に行くと、市役所があるよ。', zh: '沿花之路一直往南走，就是市役所。', en: 'Go straight south down Flower Road and you’ll find it.', ok: true },
        { jp: 'フラワーロードをまっすぐ南に行けと、市役所があるよ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'フラワーロードをまっすぐ南に行きと、市役所があるよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「辞书形＋と」：A 一发生，B 必然跟着发生——指路、自然规律、机器操作最常用。',
      noteEn: 'Dictionary form＋と: once A happens, B follows as a matter of course — the standard form for directions, natural laws and machines.',
      word: { jp: '市役所', reading: 'しやくしょ', zh: '市政府', en: 'city hall' }
    },
    {
      id: 'n1_hot', tier: 1,
      jp: '日本の夏って、そんなに暑いんですか。', zh: '日本的夏天真的那么热吗？', en: 'Are Japanese summers really that hot?',
      options: [
        { jp: 'うん、外に出ると、すぐ汗が出るよ。', zh: '嗯，一出门马上就冒汗。', en: 'Yeah, the moment you go outside you start sweating.', ok: true },
        { jp: 'うん、外に出ったら、すぐ汗が出るよ。', zh: '（不通：出る的た形是「出た」）', en: '(Broken: the ta-form of 出る is 出た)' },
        { jp: 'うん、外に出れと、すぐ汗が出るよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「出る」是一段动词：と形「出ると」，たら形「出たら」。',
      noteEn: '出る is ichidan: 出ると, 出たら.'
    },
    {
      id: 'n1_better', tier: 1,
      jp: 'どうすれば日本語が上手になりますか。', zh: '怎样才能把日语学好？', en: 'How can I get better at Japanese?',
      options: [
        { jp: '毎日少しずつ話せば、上手になるよ。', zh: '每天说一点，就会进步的。', en: 'Speak a little every day and you’ll improve.', ok: true },
        { jp: '毎日少しずつ話すば、上手になるよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '毎日少しずつ話しば、上手になるよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: 'ば形：五段动词 う段 → え段＋ば（話す → 話せば）；一段动词 る → れば（食べる → 食べれば）。',
      noteEn: 'ば-form: godan u → e＋ば (話す → 話せば); ichidan る → れば (食べる → 食べれば).'
    },
    {
      id: 'n1_arrive', tier: 1,
      jp: '駅に着いたら、連絡してもいいですか。', zh: '到了车站，可以联系你吗？', en: 'Can I contact you once I reach the station?',
      options: [
        { jp: 'うん、着いたら電話して。', zh: '嗯，到了给我打电话。', en: 'Sure, call me when you get there.', ok: true },
        { jp: 'うん、着くたら電話して。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん、着きたら電話して。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: 'たら形＝た形＋ら：着く → 着いた → 着いたら。',
      noteEn: 'たら-form = ta-form＋ら: 着く → 着いた → 着いたら.'
    },
    {
      id: 'n1_ramen', tier: 1,
      jp: 'この辺で、おいしいラーメン屋さん、知りませんか。', zh: '这附近有好吃的拉面店吗？', en: 'Do you know a good ramen place around here?',
      options: [
        { jp: 'ラーメンなら、センター街の近くにいい店があるよ。', zh: '拉面的话，中心街附近有家不错的。', en: 'For ramen, there’s a good place near Center Gai.', ok: true },
        { jp: 'ラーメンと、センター街の近くにいい店があるよ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'ラーメンれば、センター街の近くにいい店があるよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「名词＋なら」：接过对方提起的话题给建议——"要说拉面的话"。',
      noteEn: 'Noun＋なら picks up the other person’s topic to give advice: "if it’s ramen you’re after".'
    },
    {
      id: 'n1_library', tier: 1,
      jp: '授業のあと、図書室に行きますか。', zh: '下课后去图书室吗？', en: 'Are you going to the library after class?',
      options: [
        { jp: 'うん、授業が終わったら行くよ。', zh: '嗯，下了课就去。', en: 'Yeah, I’ll go when class finishes.', ok: true },
        { jp: 'うん、授業が終わると行くよ。', zh: '（不自然：と后面不接意志）', en: '(Unnatural: と cannot lead into your intention)' },
        { jp: 'うん、授業が終わるたら行くよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「〜たら」：A 实现以后做 B，后句可以是意志、请求。「と」后面不能接自己的意志（行くよ、してください）。',
      noteEn: '〜たら: after A, do B — the second half may be your intention or a request. と cannot be followed by your own will (行くよ, してください).'
    },
    {
      id: 'n1_rain', tier: 1,
      jp: '雨が降ったら、明日の遠足はどうなりますか。', zh: '下雨的话，明天的远足怎么办？', en: 'What happens to tomorrow’s outing if it rains?',
      options: [
        { jp: '雨が降ったら、中止になるって。', zh: '说是下雨就取消。', en: 'They said it’ll be cancelled if it rains.', ok: true },
        { jp: '雨が降ったれば、中止になるって。', zh: '（不通）', en: '(Broken)' },
        { jp: '雨が降るたら、中止になるって。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「降る」→「降った」→「降ったら」。たら和ば不能叠在一起。',
      noteEn: '降る → 降った → 降ったら. たら and ば cannot be stacked.'
    },
    {
      id: 'n1_button', tier: 1,
      ctxZh: '那是热水器的按钮，一按就出热水。', ctxEn: 'It is the water-heater button; press it and hot water comes out.',
      jp: 'このボタン、何ですか。', zh: '这个按钮是干什么的？', en: 'What’s this button for?',
      options: [
        { jp: '押すと、お湯が出るよ。', zh: '一按就出热水。', en: 'Press it and hot water comes out.', ok: true },
        { jp: '押すなら、お湯が出るよ。', zh: '（不自然）', en: '(Unnatural)' },
        { jp: '押しと、お湯が出るよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '机器操作、必然结果用「と」。「なら」是"如果你打算按的话"，后面该接建议，不接必然结果。',
      noteEn: 'Machines and automatic results take と. なら means "if you’re going to press it" and leads into advice, not an automatic result.'
    },
    {
      id: 'n1_cheap', tier: 1,
      jp: 'このアパート、家賃が高いですね……。', zh: '这间公寓，房租好贵啊……', en: 'The rent on this flat is steep...',
      options: [
        { jp: '駅から遠ければ、もっと安いよ。', zh: '离车站远一点的话，会便宜些。', en: 'Further from the station, it gets cheaper.', ok: true },
        { jp: '駅から遠いければ、もっと安いよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '駅から遠くば、もっと安いよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: 'い形容词的ば形：去掉「い」加「ければ」——遠い → 遠ければ。',
      noteEn: 'i-adjective ば-form: drop い, add ければ — 遠い → 遠ければ.'
    },
    {
      id: 'n1_ask', tier: 1,
      jp: '分からないことがあったら、誰に聞けばいいですか。', zh: '有不懂的事，该问谁好？', en: 'If I don’t understand something, who should I ask?',
      options: [
        { jp: '担任の先生に聞けばいいよ。', zh: '问班主任就行了。', en: 'Just ask your homeroom teacher.', ok: true },
        { jp: '担任の先生に聞くばいいよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '担任の先生に聞けたらいいよ。', zh: '要是能问班主任就好了（变成愿望了）。', en: 'It’d be nice if you could ask (a wish, not advice).' }
      ],
      noteZh: '「〜ばいい」＝建议"……就行了"（「〜たらいい」也可以）。',
      noteEn: '〜ばいい = advice, "you just need to..." (〜たらいい also works).'
    },

    // ======================= 二档 =======================
    {
      id: 'n2_kyoto', tier: 2,
      jp: '来週、京都に行こうと思ってるんです。', zh: '我下周打算去京都。', en: 'I’m thinking of going to Kyoto next week.',
      options: [
        { jp: '京都に行くなら、朝早く出たほうがいいよ。', zh: '要去京都的话，最好早点出门。', en: 'If you’re going to Kyoto, set off early.', ok: true },
        { jp: '京都に行くと、朝早く出たほうがいいよ。', zh: '（不自然：と不接建议）', en: '(Unnatural: と does not take advice)' },
        { jp: '京都に行ったら、朝早く出たほうがいいよ。', zh: '到了京都以后，最好早点出门。', en: 'Once you get to Kyoto, set off early.' }
      ],
      noteZh: '「なら」：B 可以发生在 A 之前——"如果你要去京都，（出发前）就早点出门"。「たら」是去了以后，时间顺序就错了。',
      noteEn: 'With なら, B can come before A: "if you’re going, leave early (beforehand)". たら means after arriving — wrong order.'
    },
    {
      id: 'n2_cat', tier: 2,
      ctxZh: '你想说："我打开门一看，里面有只猫。"', ctxEn: 'You want to say: "When I opened the door, there was a cat."',
      jp: '昨日、何かあったんですか。', zh: '昨天发生什么事了？', en: 'Did something happen yesterday?',
      options: [
        { jp: 'ドアを開けると、猫がいたんだ。', zh: '一打开门，里面有只猫。', en: 'When I opened the door, there was a cat.', ok: true },
        { jp: 'ドアを開ければ、猫がいたんだ。', zh: '（不通：ば不能说已发生的一次性事件）', en: '(Broken: ば cannot narrate a past one-off)' },
        { jp: 'ドアを開けるなら、猫がいたんだ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '过去一次性的"一……就发现"，用「と」或「たら」。「ば」和「なら」不能用在已经发生的一次性事件上。',
      noteEn: 'A past one-off discovery uses と or たら. ば and なら cannot narrate something that already happened once.'
    },
    {
      id: 'n2_dinner', tier: 2,
      jp: '宿題が終わったら、一緒にご飯に行きませんか。', zh: '作业做完了，一起去吃饭吗？', en: 'Once homework is done, want to get dinner?',
      options: [
        { jp: 'うん、終わったら連絡するね。', zh: '好，做完了联系你。', en: 'Sure, I’ll message you when I’m done.', ok: true },
        { jp: 'うん、終わると連絡するね。', zh: '（不自然：と后面不接意志）', en: '(Unnatural: と cannot lead into your will)' },
        { jp: 'うん、終わるなら連絡するね。', zh: '要是会做完的话（在做完之前）就联系你。', en: 'If it’s going to finish, I’ll message (beforehand).' }
      ],
      noteZh: '后句是自己的意志（連絡する），前面用「たら」。「なら」会变成"在结束之前先联系"。',
      noteEn: 'Your own intention in the second half needs たら first. なら would mean messaging before it finishes.'
    },
    {
      id: 'n2_ifnot', tier: 2,
      jp: '先輩は、日本に来てよかったと思いますか。', zh: '学长觉得来日本是对的吗？', en: 'Senpai, are you glad you came to Japan?',
      options: [
        { jp: 'うん。もし来なかったら、みんなに会えなかったからね。', zh: '嗯。要是没来，就遇不到大家了。', en: 'Yeah. If I hadn’t, I’d never have met everyone.', ok: true },
        { jp: 'うん。もし来ないと、みんなに会えなかったからね。', zh: '（不通：と不能做反事实）', en: '(Broken: と cannot be counterfactual)' },
        { jp: 'うん。もし来ないなら、みんなに会えなかったからね。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '反事实"要是当初没……的话"：「〜たら」「〜ば」都可以，「と」「なら」不行。',
      noteEn: 'Counterfactual "if I hadn’t...": 〜たら or 〜ば. Not と or なら.'
    },
    {
      id: 'n2_hodo', tier: 2,
      jp: '日本語って、勉強すればするほど難しくなりませんか。', zh: '日语是不是越学越难？', en: 'Doesn’t Japanese get harder the more you study it?',
      options: [
        { jp: 'わかる。知れば知るほど、分からなくなるよね。', zh: '懂。知道得越多，越糊涂。', en: 'I know. The more you know, the less you understand.', ok: true },
        { jp: 'わかる。知ると知るほど、分からなくなるよね。', zh: '（不通）', en: '(Broken)' },
        { jp: 'わかる。知ったら知るほど、分からなくなるよね。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「〜ば〜ほど」＝越……越……。前后用同一个词，只能配「ば」。',
      noteEn: '〜ば〜ほど = the more..., the more.... Same word twice, and only ば works.'
    },
    {
      id: 'n2_fever', tier: 2,
      jp: '実は、ちょっと熱があるんです……。', zh: '其实我有点发烧……', en: 'Actually, I’ve got a bit of a fever...',
      options: [
        { jp: '熱があるなら、今日は早く帰ったほうがいいよ。', zh: '发烧的话，今天还是早点回去吧。', en: 'If you’ve got a fever, you should go home early.', ok: true },
        { jp: '熱があると、今日は早く帰ったほうがいいよ。', zh: '（不自然：と不接建议）', en: '(Unnatural: と does not take advice)' },
        { jp: '熱があるたら、今日は早く帰ったほうがいいよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '接过对方刚告诉你的情况给建议，用「なら」："既然你发烧了，那……"',
      noteEn: 'Advising on something you have just been told: なら — "since you have a fever, then...".'
    },
    {
      id: 'n2_spring', tier: 2,
      ctxZh: '每年春天，你都会去须磨浦公园看樱花。', ctxEn: 'Every spring you go to see the cherry blossoms at Sumaura Park.',
      jp: '神戸の春って、どんな感じですか。', zh: '神户的春天是什么样的？', en: 'What’s spring like in Kobe?',
      options: [
        { jp: '春になると、いつも須磨浦公園に花見に行くよ。', zh: '一到春天，我总会去须磨浦公园赏花。', en: 'When spring comes, I always go blossom-viewing at Sumaura Park.', ok: true },
        { jp: '春になるなら、いつも須磨浦公園に花見に行くよ。', zh: '（不自然）', en: '(Unnatural)' },
        { jp: '春になったなら、いつも須磨浦公園に花見に行くよ。', zh: '（不自然）', en: '(Unnatural)' }
      ],
      noteZh: '每次 A 都会 B（习惯、反复）：「と」。须磨浦公园是神户有名的赏樱地。',
      noteEn: 'Whenever A, B (habit, repetition): と. Sumaura Park is one of Kobe’s best-known blossom spots.'
    },
    {
      id: 'n2_form', tier: 2,
      jp: 'この書類、どこに出せばいいですか。', zh: '这份文件交到哪里？', en: 'Where do I hand in this form?',
      options: [
        { jp: '書き終わったら、事務室に出してね。', zh: '写完了交到办公室。', en: 'When you’ve filled it in, hand it to the office.', ok: true },
        { jp: '書き終わると、事務室に出してね。', zh: '（不通：と后面不接请求）', en: '(Broken: と cannot lead into a request)' },
        { jp: '書き終わるなら、事務室に出してね。', zh: '要是会写完的话（写完之前）就交……', en: 'If you’re going to finish, hand it in (before)...' }
      ],
      noteZh: '后句是请求（出してね），前面用「たら」。',
      noteEn: 'A request in the second half (出してね) takes たら first.'
    },
    {
      id: 'n2_grades', tier: 2,
      jp: '奨学金って、誰でも申し込めますか。', zh: '奖学金谁都可以申请吗？', en: 'Can anyone apply for the scholarship?',
      options: [
        { jp: '成績が良ければ、申し込めるよ。', zh: '成绩好就能申请。', en: 'If your grades are good, you can apply.', ok: true },
        { jp: '成績が良くなら、申し込めるよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '成績が良いたら、申し込めるよ。', zh: '（不通：应为「良かったら」）', en: '(Broken: should be 良かったら)' }
      ],
      noteZh: '「良い（いい）」变条件形时用「良」：良ければ、良かったら。「いければ」是错的。',
      noteEn: '良い (いい) conjugates from 良: 良ければ, 良かったら. いければ is wrong.'
    },
    {
      id: 'n2_sae', tier: 2,
      jp: '日本で生活するのに、一番大事なことは何ですか。', zh: '在日本生活，最重要的是什么？', en: 'What matters most for living in Japan?',
      options: [
        { jp: '健康さえあれば、なんとかなるよ。', zh: '只要身体健康，总会有办法的。', en: 'As long as you’ve got your health, you’ll manage.', ok: true },
        { jp: '健康さえあると、なんとかなるよ。', zh: '（不通：さえ只配ば）', en: '(Broken: さえ only pairs with ば)' },
        { jp: '健康でもあれば、なんとかなるよ。', zh: '如果也健康的话……（意思变了）', en: 'If it’s healthy too... (meaning changed)' }
      ],
      noteZh: '「〜さえ〜ば」＝只要……就……（唯一必要条件）。「さえ」只和「ば」搭。',
      noteEn: '〜さえ〜ば = as long as (the one condition needed). さえ only pairs with ば.'
    },

    // ======================= 三档 =======================
    {
      id: 'n3_firstday', tier: 3,
      jp: '先輩が日本に来た最初の日、どうでしたか。', zh: '学长来日本的第一天，是什么感觉？', en: 'What was your first day in Japan like, senpai?',
      options: [
        { jp: 'ベランダの窓を開けると、港が一面に見えたんだ。', zh: '一打开阳台的窗，整个港口都在眼前。', en: 'When I opened the balcony window, the whole harbour was spread out below.', ok: true },
        { jp: 'ベランダの窓を開ければ、港が一面に見えたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'ベランダの窓を開けるなら、港が一面に見えたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'ベランダの窓を開けたなら、港が一面に見えたんだ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '叙述自己已经发生过的经历："一……就看到"——「と」（或「たら」）。「ば」「なら」都不行。',
      noteEn: 'Narrating something that happened: "when I did A, I saw B" — と (or たら). Not ば, not なら.'
    },
    {
      id: 'n3_regret', tier: 3,
      jp: '昨日のテスト、どうでしたか。', zh: '昨天的考试怎么样？', en: 'How did yesterday’s test go?',
      options: [
        { jp: 'もっと早く勉強を始めればよかった……。', zh: '早知道就早点开始复习了……', en: 'I should have started studying sooner...', ok: true },
        { jp: 'もっと早く勉強を始めるとよかった……。', zh: '（不通）', en: '(Broken)' },
        { jp: 'もっと早く勉強を始めるならよかった……。', zh: '（不通）', en: '(Broken)' },
        { jp: 'もっと早く勉強を始めたらよかったなら……。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「〜ばよかった」＝后悔"早知道就……"（「〜たらよかった」也可以）。',
      noteEn: '〜ばよかった = regret, "I should have..." (〜たらよかった also works).'
    },
    {
      id: 'n3_wallet', tier: 3,
      jp: 'その財布、どこで見つけたんですか。', zh: '那个钱包是在哪儿捡到的？', en: 'Where did you find that wallet?',
      options: [
        { jp: 'ベンチに座ったら、下に落ちてたんだ。', zh: '往长椅上一坐，发现它掉在下面。', en: 'I sat on a bench and there it was, underneath.', ok: true },
        { jp: 'ベンチに座れば、下に落ちてたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'ベンチに座るなら、下に落ちてたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'ベンチに座ってから、下に落ちてたんだ。', zh: '坐下以后，它（才）掉在下面……', en: 'After I sat down, it was lying underneath...' }
      ],
      noteZh: '偶然的发现用「たら」（或「と」）。「てから」只表示先后顺序，没有"一……才发现"的意思。',
      noteEn: 'A chance discovery takes たら (or と). てから only marks sequence, with no sense of discovery.'
    },
    {
      id: 'n3_nightview', tier: 3,
      jp: '神戸で夜景を見るなら、どこがいいですか。', zh: '在神户看夜景，哪里好？', en: 'Where’s best for the night view in Kobe?',
      options: [
        { jp: '夜景を見るなら、やっぱり摩耶山の掬星台だね。', zh: '要看夜景，还得是摩耶山的掬星台。', en: 'For the night view, it has to be Kikuseidai on Mount Maya.', ok: true },
        { jp: '夜景を見ると、やっぱり摩耶山の掬星台だね。', zh: '（不自然）', en: '(Unnatural)' },
        { jp: '夜景を見れば、やっぱり摩耶山の掬星台だね。', zh: '（不自然）', en: '(Unnatural)' },
        { jp: '夜景を見たら、やっぱり摩耶山の掬星台だね。', zh: '看完夜景以后，就是掬星台了。', en: 'After you’ve seen the view, it’s Kikuseidai.' }
      ],
      noteZh: '推荐"要……的话，就数……"用「なら」。摩耶山的掬星台，是"日本三大夜景"之一。',
      noteEn: 'Recommending "if it’s X you want, then...": なら. Kikuseidai on Mount Maya is one of Japan’s three great night views.'
    },
    {
      id: 'n3_regards', tier: 3,
      ctxZh: '你想托他：见到教务处的藤原老师，替你问声好。', ctxEn: 'You want him to pass your regards to Ms Fujiwara in the school office.',
      jp: '明日、事務室に書類を出しに行きます。', zh: '明天我要去办公室交文件。', en: 'I’m taking some forms to the office tomorrow.',
      options: [
        { jp: '藤原先生に会ったら、よろしく伝えて。', zh: '见到藤原老师的话，替我问好。', en: 'If you see Ms Fujiwara, say hi for me.', ok: true },
        { jp: '藤原先生に会うと、よろしく伝えて。', zh: '（不通：と后面不接请求）', en: '(Broken: と cannot lead into a request)' },
        { jp: '藤原先生に会えば、よろしく伝えて。', zh: '（不通：动作动词的ば后面不接请求）', en: '(Broken: action-verb ば cannot lead into a request)' },
        { jp: '藤原先生に会ったと、よろしく伝えて。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '后句是请求、命令时，前面只能用「たら」（或「なら」）。「と」和接动作动词的「ば」，后面都不能跟请求。',
      noteEn: 'Before a request or command, use たら (or なら). と, and ば on an action verb, cannot be followed by a request.'
    },
    {
      id: 'n3_alarm', tier: 3,
      jp: '光先輩、昨日のテストに遅刻したらしいです。', zh: '光学姐昨天考试好像迟到了。', en: 'Apparently Hikari-senpai was late for the test yesterday.',
      options: [
        { jp: '目覚ましをかけておけばよかったのに。', zh: '她要是定个闹钟就好了。', en: 'She should have set an alarm.', ok: true },
        { jp: '目覚ましをかけておくとよかったのに。', zh: '（不通）', en: '(Broken)' },
        { jp: '目覚ましをかけておいたならよかったのに。', zh: '（不自然）', en: '(Unnatural)' },
        { jp: '目覚ましをかけておくならよかったのに。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '替别人惋惜：「〜ばよかったのに」。',
      noteEn: 'Regretting on someone else’s behalf: 〜ばよかったのに.'
    },
    {
      id: 'n3_dattara', tier: 3,
      jp: '明日、雨みたいですよ。', zh: '明天好像要下雨哦。', en: 'Looks like rain tomorrow.',
      options: [
        { jp: 'だったら、ハーバーランドの映画館にでも行こうか。', zh: '那就去港湾乐园的电影院之类的吧。', en: 'Then how about the cinema at Harborland?', ok: true },
        { jp: 'だと、ハーバーランドの映画館にでも行こうか。', zh: '（不自然：だと后面不接邀约）', en: '(Unnatural: だと does not lead into an invitation)' },
        { jp: 'なれば、ハーバーランドの映画館にでも行こうか。', zh: '（不通）', en: '(Broken)' },
        { jp: 'だっては、ハーバーランドの映画館にでも行こうか。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '接续词「だったら」「それなら」：根据对方的话提出建议。「だと」后面不接邀请、意志。',
      noteEn: 'The connectives だったら／それなら turn what you heard into a suggestion. だと cannot lead into an invitation.'
    },
    {
      id: 'n3_visa', tier: 3,
      ctxZh: '明的签证下个月就到期了。', ctxEn: 'Minh’s visa expires next month.',
      jp: 'ビザの更新、まだ先でいいですよね……？', zh: '签证更新，还不急吧……？', en: 'The visa renewal can wait a bit, right...?',
      options: [
        { jp: '早く出さないと、間に合わないよ。', zh: '不早点交就来不及了。', en: 'If you don’t submit soon, you won’t make it.', ok: true },
        { jp: '早く出さないれば、間に合わないよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '早く出さなかったと、間に合わないよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '早く出さないたら、間に合わないよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「〜ないと（いけない）」＝不……就糟了，口语里常省略后半句。在留期间的更新，可以在到期前三个月开始申请。',
      noteEn: '〜ないと(いけない) = if you don’t..., trouble — the second half is often dropped. Visa renewals can be filed from three months before expiry.'
    },
    {
      id: 'n3_souvenir', tier: 3,
      jp: '母が神戸に来るんですけど、お土産は何がいいですか。', zh: '我妈妈要来神户，伴手礼买什么好？', en: 'My mum’s visiting Kobe. What’s a good souvenir?',
      options: [
        { jp: 'お土産なら、元町のバウムクーヘンが喜ばれるよ。', zh: '伴手礼的话，元町的年轮蛋糕很受欢迎。', en: 'For souvenirs, Motomachi baumkuchen always goes down well.', ok: true },
        { jp: 'お土産と、元町のバウムクーヘンが喜ばれるよ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'お土産ば、元町のバウムクーヘンが喜ばれるよ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'お土産たら、元町のバウムクーヘンが喜ばれるよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '又一个「名词＋なら」。顺带一提：德式点心店尤海姆（Juchheim）是在神户起家的，年轮蛋糕是神户伴手礼的招牌。',
      noteEn: 'Another noun＋なら. Incidentally, Juchheim, the German-style confectioner, started in Kobe; its baumkuchen is the classic Kobe souvenir.'
    },
    {
      id: 'n3_tokoro', tier: 3,
      jp: '先生に、締め切りのこと聞いてみましたか。', zh: '你问过老师截止日期的事了吗？', en: 'Did you ask the teacher about the deadline?',
      options: [
        { jp: 'うん、聞いてみたところ、来週まででいいって。', zh: '问了，结果说下周前交就行。', en: 'Yeah — I asked, and she said next week is fine.', ok: true },
        { jp: 'うん、聞いてみるところ、来週まででいいって。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん、聞いてみたなら、来週まででいいって。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん、聞いてみればところ、来週まででいいって。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「〜たところ」＝试着做了之后，结果……（书面感稍强）。',
      noteEn: '〜たところ = having tried, the result was... (a little formal).'
    }
  ]
};
