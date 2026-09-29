import { DrillPack } from '../../types';

// ==========================================================
// 📚 鈴 · 可能形・自動詞／他動詞（読める／開く・開ける）
//
// 【为什么是她】
// 图书室里的问答，天然就是"你会不会""门开着还是你开的"。
// 鈴说话轻、慢、客气，是最不会让人紧张的出题人——
// 这两块恰好又是最"教科书"的：规则清楚，但一到实际说话就混。
//
// 一档：可能形的变形；自他动词最常见的几对（開く／開ける、消える／消す）
// 二档：見える／見られる、聞こえる／聞ける，道歉时刻意用他动词
// 三档：没有可能形的动词、てある、同形的「解ける」，规则说明里的ことができる
// ==========================================================

export const REI_PACK: DrillPack = {
  id: 'rei',
  grammarZh: '可能形 · 自动词／他动词', grammarEn: 'Potential form · intransitive / transitive verbs',
  partnerZh: '铃', partnerEn: 'Rei',
  sprites: {
    neutral: '/images/characters/rei/neutral.webp',
    happy: '/images/characters/rei/smile.webp',
    miss: '/images/characters/rei/thinking.webp'
  },
  onRight: [
    { jp: '……はい。正解です。', zh: '……嗯，正确。', en: '...Yes. Correct.' },
    { jp: 'よくできました。', zh: '做得很好。', en: 'Well done.' },
    { jp: 'その調子です。', zh: '保持这个状态。', en: 'Keep it up.' }
  ],
  onWrong: [
    { jp: '……惜しいです。もう一度、考えてみてください。', zh: '……可惜。请再想一想。', en: '...Close. Please think about it once more.' },
    { jp: 'そこは、少し違います。', zh: '那里稍微有点不对。', en: 'That part is slightly off.' },
    { jp: '大丈夫です。ここは、間違えやすいところですから。', zh: '没关系，这里本来就容易错。', en: 'It is all right. This is an easy place to slip.' }
  ],
  rounds: [
    // ======================= 一档 =======================
    {
      id: 'r1_kanji', tier: 1,
      jp: '漢字、どのくらい読めますか。', zh: '汉字你能读多少？', en: 'How much kanji can you read?',
      options: [
        { jp: '簡単なものなら、少し読めます。', zh: '简单的话，能读一点。', en: 'I can read a little, if it is simple.', ok: true },
        { jp: '簡単なものなら、少し読まれます。', zh: '简单的话，会被读一点。', en: 'If simple, a little gets read.' },
        { jp: '簡単なものなら、少し読みれます。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '五段动词的可能形：う段 → え段＋る。読む → 読める，書く → 書ける。',
      noteEn: 'Godan potential: change the final u-sound to e and add る. 読む → 読める, 書く → 書ける.',
      word: { jp: '読める', reading: 'よめる', zh: '能读', en: 'can read' }
    },
    {
      id: 'r1_come', tier: 1,
      jp: '明日の朝、七時に図書室に来られますか。', zh: '明天早上七点能来图书室吗？', en: 'Can you come to the library at seven tomorrow morning?',
      options: [
        { jp: 'はい、来られます。', zh: '能，我能来。', en: 'Yes, I can come.', ok: true },
        { jp: 'はい、来させられます。', zh: '是，我会被逼着来。', en: 'Yes, I will be made to come.' },
        { jp: 'はい、来えます。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「来る」的可能形是「来られる（こられる）」。口语里常听到「来れる」——那是ら抜き，考试算错。',
      noteEn: 'The potential of 来る is 来られる (korareru). 来れる is common in speech but is ra-nuki and marked wrong in exams.'
    },
    {
      id: 'r1_email', tier: 1,
      jp: '日本語で、電話はできますか。', zh: '你能用日语打电话吗？', en: 'Can you manage phone calls in Japanese?',
      options: [
        { jp: '電話はまだ難しいですが、メールなら書けます。', zh: '电话还有点难，邮件的话能写。', en: 'Calls are still hard, but I can write emails.', ok: true },
        { jp: '電話はまだ難しいですが、メールなら書かれます。', zh: '……邮件的话会被写。', en: '...emails get written.' },
        { jp: '電話はまだ難しいですが、メールなら書きられます。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '書く → 書ける。「書かれる」是被动。',
      noteEn: '書く → 書ける. 書かれる is the passive.'
    },
    {
      id: 'r1_window', tier: 1,
      ctxZh: '窗户其实已经开着了。', ctxEn: 'The window is actually already open.',
      jp: '窓、開けましょうか。', zh: '我去开窗吧？', en: 'Shall I open the window?',
      options: [
        { jp: 'あ、もう開いていますよ。', zh: '啊，已经开着了。', en: 'Oh, it is already open.', ok: true },
        { jp: 'あ、もう開けていますよ。', zh: '啊，我正在开呢。', en: 'Oh, I am already opening it.' },
        { jp: 'あ、もう開きていますよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '描述"开着"这个状态：自动词＋ている「開いている」。「開けている」是"正在开"这个动作。',
      noteEn: 'For the state "is open": intransitive＋ている, 開いている. 開けている is the action of opening, in progress.',
      word: { jp: '開く', reading: 'あく', zh: '（门窗）开', en: 'to open (intransitive)' }
    },
    {
      id: 'r1_light', tier: 1,
      ctxZh: '你离开教室时亲手关了灯。', ctxEn: 'You switched the classroom light off yourself when you left.',
      jp: '教室の電気、消しましたか。', zh: '教室的灯关了吗？', en: 'Did you switch off the classroom light?',
      options: [
        { jp: 'はい、ちゃんと消しました。', zh: '嗯，关好了。', en: 'Yes, I switched it off.', ok: true },
        { jp: 'はい、ちゃんと消えました。', zh: '嗯，（灯自己）灭了。', en: 'Yes, it went out (by itself).' },
        { jp: 'はい、ちゃんと消されました。', zh: '嗯，被（人）关了。', en: 'Yes, it was switched off (by someone).' }
      ],
      noteZh: '自己动手做的事用他动词（消す），东西自己变化用自动词（消える）。被问"你关了吗"，回答「消えました」听起来像灯自己灭了。',
      noteEn: 'What you do yourself: transitive (消す). What happens by itself: intransitive (消える). Answering 消えました sounds like the light went out on its own.'
    },
    {
      id: 'r1_door', tier: 1,
      ctxZh: '你到图书室时，门是关着的。', ctxEn: 'When you got to the library, the door was shut.',
      jp: '図書室のドア、閉まっていましたか。', zh: '图书室的门，当时是关着的吗？', en: 'Was the library door closed?',
      options: [
        { jp: 'はい、閉まっていました。', zh: '是的，关着。', en: 'Yes, it was closed.', ok: true },
        { jp: 'はい、閉めていました。', zh: '是的，我正在关。', en: 'Yes, I was closing it.' },
        { jp: 'はい、閉めさせていました。', zh: '是的，我让（人）关着。', en: 'Yes, I was having (someone) close it.' }
      ],
      noteZh: '「閉まる」（自）＝关着的状态，「閉める」（他）＝去关。',
      noteEn: '閉まる (intransitive) = to be shut; 閉める (transitive) = to shut something.'
    },
    {
      id: 'r1_ski', tier: 1,
      ctxZh: '你老家从来不下雪。', ctxEn: 'It never snows where you grew up.',
      jp: 'スキー、できますか。', zh: '你会滑雪吗？', en: 'Can you ski?',
      options: [
        { jp: 'いいえ、できません。雪が降らない所で育ったので。', zh: '不会。我是在不下雪的地方长大的。', en: 'No. I grew up somewhere it never snows.', ok: true },
        { jp: 'いいえ、しられません。雪が降らない所で育ったので。', zh: '（不通）', en: '(Broken)' },
        { jp: 'いいえ、されません。雪が降らない所で育ったので。', zh: '（这是被动/尊敬）', en: '(That is passive/honorific)' }
      ],
      noteZh: '「する」的可能形是「できる」。',
      noteEn: 'The potential of する is できる.'
    },
    {
      id: 'r1_memorize', tier: 1,
      jp: '昨日の単語、覚えられましたか。', zh: '昨天的单词记住了吗？', en: 'Did you manage to memorise yesterday’s words?',
      options: [
        { jp: 'はい、なんとか覚えられました。', zh: '嗯，总算记住了。', en: 'Yes, I just about managed.', ok: true },
        { jp: 'はい、なんとか覚えれました。', zh: '（ら抜き）', en: '(ra-nuki)' },
        { jp: 'はい、なんとか覚えさせました。', zh: '嗯，总算让（别人）记住了。', en: 'Yes, I got (someone) to memorise them.' }
      ],
      noteZh: '一段动词的可能形：る → られる。覚える → 覚えられる。',
      noteEn: 'Ichidan potential: る → られる. 覚える → 覚えられる.'
    },
    {
      id: 'r1_shelf', tier: 1,
      jp: 'その本、棚に戻しておきましたか。', zh: '那本书，放回书架了吗？', en: 'Did you put that book back on the shelf?',
      options: [
        { jp: 'はい、戻しておきました。', zh: '嗯，放回去了。', en: 'Yes, I put it back.', ok: true },
        { jp: 'はい、戻っておきました。', zh: '（不通）', en: '(Broken)' },
        { jp: 'はい、戻られました。', zh: '是，（某位）回来了。', en: 'Yes, (someone) has returned.' }
      ],
      noteZh: '「戻す」（他）＝把东西放回去；「戻る」（自）＝自己回来。「〜ておく」前面得是自己能控制的动作，所以用他动词。',
      noteEn: '戻す (transitive) = put something back; 戻る (intransitive) = come back. 〜ておく needs a deliberate action, so the transitive.'
    },
    {
      id: 'r1_aircon', tier: 1,
      ctxZh: '空调坏了，你按了好几次都开不起来。', ctxEn: 'The air conditioner is broken; it will not start however often you press it.',
      jp: 'エアコン、つけましょうか。', zh: '开空调吧？', en: 'Shall I turn on the air conditioning?',
      options: [
        { jp: 'それが、何度押してもつかないんです。', zh: '就是，按了好几次都开不起来。', en: 'That is the thing — it will not come on however often I press it.', ok: true },
        { jp: 'それが、何度押してもつけないんです。', zh: '就是，我按了好几次都不去开。', en: 'The thing is, I will not turn it on...' },
        { jp: 'それが、何度押してもつかせないんです。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '空调"开不起来"是它自己的状态，用自动词否定「つかない」。「つけない」是"我不开"。',
      noteEn: 'The aircon not coming on is its own state: intransitive negative つかない. つけない means "I won’t turn it on".'
    },

    // ======================= 二档 =======================
    {
      id: 'r2_see', tier: 2,
      ctxZh: '天气好的时候，从图书室窗口能一直看到港塔。', ctxEn: 'On clear days you can see all the way to Port Tower from the library window.',
      jp: 'ここの窓から、海は見えますか。', zh: '从这扇窗能看到海吗？', en: 'Can you see the sea from this window?',
      options: [
        { jp: 'はい、晴れた日はポートタワーまで見えます。', zh: '能，天晴的时候连港塔都看得到。', en: 'Yes — on clear days you can see as far as Port Tower.', ok: true },
        { jp: 'はい、晴れた日はポートタワーまで見せます。', zh: '是，天晴的时候我给你看港塔。', en: 'Yes — on clear days I show (you) Port Tower.' },
        { jp: 'はい、晴れた日はポートタワーまで見えられます。', zh: '（不通：「見える」没有可能形）', en: '(Broken: 見える has no potential form)' }
      ],
      noteZh: '自然映入眼帘用「見える」；主动去看、有机会看才用「見られる」（例：この映画は来週から見られます）。',
      noteEn: '見える for what naturally comes into view; 見られる for having the chance to see something (この映画は来週から見られます).'
    },
    {
      id: 'r2_hear', tier: 2,
      jp: '後ろの席でも、先生の声は聞こえますか。', zh: '坐在后排，也听得见老师的声音吗？', en: 'Can you hear the teacher from the back row?',
      options: [
        { jp: 'はい、よく聞こえます。', zh: '嗯，听得很清楚。', en: 'Yes, I can hear fine.', ok: true },
        { jp: 'はい、よく聞けます。', zh: '（这里不自然）', en: '(Unnatural here)' },
        { jp: 'はい、よく聞かれます。', zh: '嗯，我常被问。', en: 'Yes, I get asked a lot.' }
      ],
      noteZh: '声音自然传进耳朵用「聞こえる」；「聞ける」是"有条件去听"——このアプリでラジオが聞ける。',
      noteEn: 'Sound reaching your ears: 聞こえる. 聞ける means having the means to listen — このアプリでラジオが聞ける.'
    },
    {
      id: 'r2_ride', tier: 2,
      jp: '日本に来て、何ができるようになりましたか。', zh: '来日本以后，你学会做什么了？', en: 'What have you become able to do since coming to Japan?',
      options: [
        { jp: '一人で電車に乗れるようになりました。', zh: '能一个人坐电车了。', en: 'I can ride the train on my own now.', ok: true },
        { jp: '一人で電車に乗られるようになりました。', zh: '（这是被动/尊敬）', en: '(That is passive/honorific)' },
        { jp: '一人で電車に乗れることにしました。', zh: '（不通：决定变得能坐？）', en: '(Broken: decided to become able?)' }
      ],
      noteZh: '能力的变化：可能形＋ようになる。「乗る」五段 → 「乗れる」。',
      noteEn: 'A change in ability: potential＋ようになる. 乗る (godan) → 乗れる.'
    },
    {
      id: 'r2_tore', tier: 2,
      ctxZh: '书的封皮是你不小心弄破的。', ctxEn: 'You tore the book’s cover by accident.',
      jp: 'この本、カバーが破れていますね。', zh: '这本书的封皮破了呢。', en: 'This book’s cover is torn.',
      options: [
        { jp: 'すみません、私が破ってしまいました。', zh: '对不起，是我弄破的。', en: 'I am sorry — I tore it.', ok: true },
        { jp: 'すみません、私が破れてしまいました。', zh: '对不起，我（自己）破掉了。', en: 'Sorry — I myself tore apart.' },
        { jp: 'すみません、私に破れられました。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '承认是自己弄的，用他动词「破る」。日本人道歉时会刻意选他动词，表示"是我的责任"——说自动词会听起来像在推脱。',
      noteEn: 'Owning up takes the transitive 破る. Japanese apologies deliberately choose the transitive to take responsibility; the intransitive sounds evasive.'
    },
    {
      id: 'r2_cup', tier: 2,
      ctxZh: '杯子是被风吹倒摔碎的，没人碰过它。', ctxEn: 'The cup blew over in the wind and smashed; nobody touched it.',
      jp: 'そのコップ、割れてしまったんですか。', zh: '那个杯子碎了吗？', en: 'Did that cup break?',
      options: [
        { jp: '風で倒れて、割れたんです。', zh: '被风吹倒，碎掉了。', en: 'The wind knocked it over and it broke.', ok: true },
        { jp: '風で倒して、割ったんです。', zh: '我用风把它弄倒、打碎了。', en: 'I knocked it over with the wind and broke it.' },
        { jp: '風で倒されて、割らせたんです。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '不是任何人故意做的，用自动词叙述：「倒れる」「割れる」。',
      noteEn: 'When nobody did it on purpose, narrate with intransitives: 倒れる, 割れる.'
    },
    {
      id: 'r2_absent', tier: 2,
      ctxZh: '那天你要打工。', ctxEn: 'You have a shift that day.',
      jp: '来週の勉強会、出られますか。', zh: '下周的学习会，你能参加吗？', en: 'Can you make next week’s study group?',
      options: [
        { jp: 'すみません、その日はバイトで出られないんです。', zh: '抱歉，那天要打工，去不了。', en: 'Sorry, I have work that day, so I cannot.', ok: true },
        { jp: 'すみません、その日はバイトで出れないんです。', zh: '（ら抜き）', en: '(ra-nuki)' },
        { jp: 'すみません、その日はバイトで出させないんです。', zh: '抱歉，那天不让（别人）出席。', en: 'Sorry, I won’t let (anyone) attend that day.' }
      ],
      noteZh: '「出る」一段 → 「出られる」。',
      noteEn: '出る (ichidan) → 出られる.'
    },
    {
      id: 'r2_rainstop', tier: 2,
      ctxZh: '你想说"雨停了，我们回去吧"。', ctxEn: 'You want to say the rain has stopped, so let’s head home.',
      jp: '雨、止みましたね。', zh: '雨停了呢。', en: 'The rain has stopped.',
      options: [
        { jp: '雨が止んだので、帰りましょうか。', zh: '雨停了，我们回去吧。', en: 'Since it has stopped, shall we go home?', ok: true },
        { jp: '雨を止めたので、帰りましょうか。', zh: '我把雨停下了，回去吧。', en: 'I stopped the rain, so shall we go?' },
        { jp: '雨が止められたので、帰りましょうか。', zh: '雨被（谁）停下了……', en: 'The rain was stopped (by someone)...' }
      ],
      noteZh: '雨停是自然现象，只能用自动词「止む」。「止める」是"让…停下"。',
      noteEn: 'Rain stopping is natural: only the intransitive 止む works. 止める means to stop something.'
    },
    {
      id: 'r2_languages', tier: 2,
      jp: '何語が話せますか。', zh: '你会说哪些语言？', en: 'Which languages can you speak?',
      options: [
        { jp: '母語と英語が話せます。', zh: '母语和英语。', en: 'My native language and English.', ok: true },
        { jp: '母語と英語を話されます。', zh: '（这是尊敬/被动）', en: '(That is honorific/passive)' },
        { jp: '母語と英語が話します。', zh: '（不通：少了可能形）', en: '(Broken: potential missing)' }
      ],
      noteZh: '可能形的对象一般用「が」：日本語が話せる。「を」也越来越常见，但「が」更规范。',
      noteEn: 'The object of a potential verb usually takes が: 日本語が話せる. を is increasingly heard, but が is standard.'
    },
    {
      id: 'r2_notfound', tier: 2,
      ctxZh: '你找了一下午，那份资料还是没找到。', ctxEn: 'You have looked all afternoon and still cannot find the document.',
      jp: '探していた資料、見つかりましたか。', zh: '你找的资料找到了吗？', en: 'Did you find the document you were looking for?',
      options: [
        { jp: 'いいえ、どこを探しても見つからないんです。', zh: '没有，到处找都找不到。', en: 'No, I cannot find it anywhere.', ok: true },
        { jp: 'いいえ、どこを探しても見つけないんです。', zh: '没有，到处找我也不去找。', en: 'No, wherever I look, I won’t find it (on purpose).' },
        { jp: 'いいえ、どこを探しても見つけられるんです。', zh: '没有，到处找都能找到。', en: 'No, I can find it wherever I look.' }
      ],
      noteZh: '找不到＝「見つからない」（自动词否定）或「見つけられない」（可能形否定）。「見つけない」是"我不去找"。',
      noteEn: 'Cannot find = 見つからない (intransitive negative) or 見つけられない (potential negative). 見つけない means choosing not to.'
    },
    {
      id: 'r2_cold', tier: 2,
      jp: '少し、寒くないですか。', zh: '是不是有点冷？', en: 'Isn’t it a little cold?',
      options: [
        { jp: 'そうですね。窓を閉めてもいいですか。', zh: '是啊，可以把窗关上吗？', en: 'It is. May I close the window?', ok: true },
        { jp: 'そうですね。窓が閉まってもいいですか。', zh: '窗户关着也可以吗？', en: 'Is it all right if the window is shut?' },
        { jp: 'そうですね。窓を閉まってもいいですか。', zh: '（不通：自动词带了宾语）', en: '(Broken: intransitive with an object)' }
      ],
      noteZh: '请求做某动作要用他动词「閉める」。「閉まる」没有宾语，「窓を閉まる」是把两个词混在了一起。',
      noteEn: 'Asking to do an action needs the transitive 閉める. 閉まる takes no object; 窓を閉まる blends the two.'
    },

    // ======================= 三档 =======================
    {
      id: 'r3_wakaru', tier: 3,
      jp: 'この文法、分かりましたか。', zh: '这个语法，明白了吗？', en: 'Did you understand this grammar point?',
      options: [
        { jp: 'はい、説明を聞いて分かりました。', zh: '嗯，听了说明就明白了。', en: 'Yes, once I heard the explanation.', ok: true },
        { jp: 'はい、説明を聞いて分かれました。', zh: '嗯，听了说明就分开了。', en: 'Yes, after the explanation we split up.' },
        { jp: 'はい、説明を聞いて分かられました。', zh: '（不通）', en: '(Broken)' },
        { jp: 'はい、説明を聞いて分かることができました。', zh: '（不自然：重复表达"能"）', en: '(Unnatural: "can" said twice)' }
      ],
      noteZh: '「分かる」「できる」「見える」「聞こえる」本身就含"能"的意思，没有可能形，也不说「分かることができる」。',
      noteEn: '分かる, できる, 見える, 聞こえる already contain "can". They have no potential form, and 分かることができる is not said.'
    },
    {
      id: 'r3_chairs', tier: 3,
      ctxZh: '你提前把会议室的椅子排好了。', ctxEn: 'You set out the meeting-room chairs in advance.',
      jp: '会議室の準備、してくれたんですね。', zh: '你帮忙把会议室准备好了呢。', en: 'You got the meeting room ready.',
      options: [
        { jp: 'はい、椅子はもう並べてあります。', zh: '是的，椅子已经摆好了。', en: 'Yes, the chairs are all set out.', ok: true },
        { jp: 'はい、椅子はもう並んであります。', zh: '（不通：自动词不接「てある」）', en: '(Broken: intransitives do not take てある)' },
        { jp: 'はい、椅子はもう並べています。', zh: '是的，我正在摆椅子。', en: 'Yes, I am setting out the chairs.' },
        { jp: 'はい、椅子はもう並ばせてあります。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '他动词＋てある＝有人为了某个目的事先做好，结果保留着。自动词不能接「てある」。',
      noteEn: 'Transitive＋てある = done in advance on purpose, with the result still in place. Intransitives cannot take てある.'
    },
    {
      id: 'r3_sleep', tier: 3,
      ctxZh: '考试临近，你晚上总是睡不着。', ctxEn: 'Exams are close and you cannot sleep at night.',
      jp: '最近、よく眠れていますか。', zh: '最近睡得好吗？', en: 'Have you been sleeping well lately?',
      options: [
        { jp: '試験が近いので、なかなか眠れません。', zh: '考试快到了，怎么也睡不着。', en: 'Exams are coming, so I can hardly sleep.', ok: true },
        { jp: '試験が近いので、なかなか眠られません。', zh: '（这是被动/尊敬）', en: '(That is passive/honorific)' },
        { jp: '試験が近いので、なかなか眠らせません。', zh: '考试快到了，怎么也不让（别人）睡。', en: 'Exams are coming, so I won’t let (anyone) sleep.' },
        { jp: '試験が近いので、なかなか寝れません。', zh: '（ら抜き）', en: '(ra-nuki)' }
      ],
      noteZh: '「眠る」是五段动词，可能形「眠れる」；「寝る」是一段动词，可能形「寝られる」（口语常说「寝れる」）。两个都是"睡"，变法不一样。',
      noteEn: '眠る is godan: 眠れる. 寝る is ichidan: 寝られる (寝れる in speech). Both mean sleep; they conjugate differently.'
    },
    {
      id: 'r3_coffee', tier: 3,
      ctxZh: '书页上的污渍，是你打翻咖啡弄的。', ctxEn: 'The stain on the page is from coffee you spilt.',
      jp: 'あ、このページ、汚れていますね。', zh: '啊，这页脏了呢。', en: 'Oh, this page is stained.',
      options: [
        { jp: 'すみません、コーヒーをこぼして汚してしまいました。', zh: '对不起，我打翻咖啡弄脏了。', en: 'I am sorry, I spilt coffee and stained it.', ok: true },
        { jp: 'すみません、コーヒーがこぼして汚れてしまいました。', zh: '（不通）', en: '(Broken)' },
        { jp: 'すみません、コーヒーをこぼれて汚してしまいました。', zh: '（不通：自动词带了宾语）', en: '(Broken: intransitive with an object)' },
        { jp: 'すみません、コーヒーをこぼして汚れさせてしまいました。', zh: '（不自然）', en: '(Unnatural)' }
      ],
      noteZh: '两个动作都是自己造成的：「こぼす」「汚す」都用他动词，把责任认下来。',
      noteEn: 'Both actions were yours: こぼす and 汚す, both transitive — owning the whole thing.'
    },
    {
      id: 'r3_convey', tier: 3,
      ctxZh: '你给老师写了信，但意思好像没传达到。', ctxEn: 'You wrote the teacher a letter, but your meaning does not seem to have got across.',
      jp: '先生に、気持ちは伝えられましたか。', zh: '心意传达给老师了吗？', en: 'Did you manage to tell the teacher how you feel?',
      options: [
        { jp: '手紙は渡したんですが、うまく伝わらなかったみたいです。', zh: '信是交了，但好像没能好好传达到。', en: 'I gave her the letter, but it does not seem to have got across.', ok: true },
        { jp: '手紙は渡したんですが、うまく伝えなかったみたいです。', zh: '……好像我故意没传达。', en: '...it seems I chose not to convey it.' },
        { jp: '手紙は渡したんですが、うまく伝わられなかったみたいです。', zh: '（不通）', en: '(Broken)' },
        { jp: '手紙は渡したんですが、うまく伝わさなかったみたいです。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '心意"没传达到"是结果，用自动词「伝わらない」。日语习惯把沟通失败说成"没能传达到"，而不是"我没传达"。',
      noteEn: 'A message not getting through is a result: intransitive 伝わらない. Japanese frames miscommunication as "it did not arrive", not "I did not send it".'
    },
    {
      id: 'r3_photo', tier: 3,
      ctxZh: '照片是在傍晚拍的，有点暗。', ctxEn: 'The photo was taken at dusk and is rather dark.',
      jp: 'その写真、見せてもらえますか。', zh: '那张照片能给我看看吗？', en: 'Could I see that photo?',
      options: [
        { jp: 'どうぞ。暗くて、よく見えないかもしれませんが。', zh: '请看。可能有点暗，看不太清。', en: 'Here. It is dark, so you might not see much.', ok: true },
        { jp: 'どうぞ。暗くて、よく見せないかもしれませんが。', zh: '（不自然）', en: '(Unnatural)' },
        { jp: 'どうぞ。暗くて、よく見えられないかもしれませんが。', zh: '（不通）', en: '(Broken)' },
        { jp: 'どうぞ。暗くて、よく見さないかもしれませんが。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '三个词别混：見る（看）、見える（看得见）、見せる（给人看）。',
      noteEn: 'Keep three verbs apart: 見る (look), 見える (be visible), 見せる (show).'
    },
    {
      id: 'r3_solve', tier: 3,
      jp: '昨日の問題、全部解けましたか。', zh: '昨天的题全都解出来了吗？', en: 'Did you solve all of yesterday’s problems?',
      options: [
        { jp: '最後の一問だけ、解けませんでした。', zh: '只有最后一题没解出来。', en: 'Only the last one beat me.', ok: true },
        { jp: '最後の一問だけ、解かれませんでした。', zh: '（这是被动）', en: '(That is passive)' },
        { jp: '最後の一問だけ、解けられませんでした。', zh: '（不通：可能形叠了两次）', en: '(Broken: potential applied twice)' },
        { jp: '最後の一問だけ、解きれませんでした。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「解く」五段 → 可能形「解ける」。巧的是「解ける」本身也是自动词（结解开了、冰化了）——同形，看语境。',
      noteEn: '解く (godan) → potential 解ける. By coincidence 解ける is also an intransitive verb (a knot comes undone, ice melts) — same form, told by context.'
    },
    {
      id: 'r3_meeting', tier: 3,
      ctxZh: '你是会议主持人，打算五点前结束。', ctxEn: 'You are chairing the meeting and plan to wrap up by five.',
      jp: '会議、何時に終わりそうですか。', zh: '会议大概几点结束？', en: 'What time do you think the meeting will finish?',
      options: [
        { jp: '五時には終わらせるつもりです。', zh: '打算五点前结束。', en: 'I intend to wrap it up by five.', ok: true },
        { jp: '五時には終われるつもりです。', zh: '（不自然）', en: '(Unnatural)' },
        { jp: '五時には終わられるつもりです。', zh: '（给自己用了敬语）', en: '(Honorific used on yourself)' },
        { jp: '五時には終えさせられるつもりです。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「終わる」多作自动词；要表达"我让它结束"的意志，用使役「終わらせる」，或他动词「終える」。',
      noteEn: '終わる is mostly intransitive. To express your will to end it, use the causative 終わらせる or the transitive 終える.'
    },
    {
      id: 'r3_rule', tier: 3,
      ctxZh: '图书室规定一次最多借五本。', ctxEn: 'The library rule is five books at a time.',
      jp: '図書室の本は、一度に何冊借りられますか。', zh: '图书室的书一次能借几本？', en: 'How many library books can you borrow at once?',
      options: [
        { jp: '一度に五冊まで借りることができます。', zh: '一次最多可以借五本。', en: 'You can borrow up to five at a time.', ok: true },
        { jp: '一度に五冊まで借りれることができます。', zh: '（不通：叠用）', en: '(Broken: doubled)' },
        { jp: '一度に五冊まで借りさせることができます。', zh: '一次最多可以让人借五本。', en: 'You can let someone borrow up to five.' },
        { jp: '一度に五冊まで借りられることができます。', zh: '（不通：叠用）', en: '(Broken: doubled)' }
      ],
      noteZh: '说明规则时常用「〜ことができる」，显得正式。可能形和它不能叠在一起用。',
      noteEn: 'Rules are often stated with 〜ことができる, which sounds formal. Never stack it on a potential form.'
    },
    {
      id: 'r3_locked', tier: 3,
      ctxZh: '门从外面上了锁，从里面打不开。', ctxEn: 'The door has been locked from outside; it cannot be opened from within.',
      jp: 'そのドア、開きませんか。', zh: '那扇门打不开吗？', en: 'Won’t that door open?',
      options: [
        { jp: '鍵がかかっていて、内側からは開けられないんです。', zh: '上锁了，从里面打不开。', en: 'It is locked, so it cannot be opened from inside.', ok: true },
        { jp: '鍵がかかっていて、内側からは開かられないんです。', zh: '（不通）', en: '(Broken)' },
        { jp: '鍵がかかっていて、内側からは開けれないんです。', zh: '（ら抜き）', en: '(ra-nuki)' },
        { jp: '鍵がかかっていて、内側からは開かせないんです。', zh: '（不自然）', en: '(Unnatural)' }
      ],
      noteZh: '从里面"打不开"：他动词「開ける」的可能形「開けられる」。也可以用自动词说「内側からは開かないんです」——门本身开不了。',
      noteEn: 'Cannot open it from inside: potential of the transitive, 開けられる. Or use the intransitive: 内側からは開かないんです — the door itself will not open.'
    }
  ]
};
