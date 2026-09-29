import { DrillPack } from '../../types';

// ==========================================================
// 🏀 空 · 意向形（〜よう／〜ようと思う／〜ようとする）
//
// 【为什么是她】
// 体育馆里的每一句话都是意向形：「走ろう」「もう一本やろう」
// 「明日から朝練しようと思ってる」。空是那种把决心挂在嘴上的人，
// 而意向形恰好就是"决心"和"邀约"的语法。
// 她说关西腔（剧情里就是这样），但你回她的话都是标准语——考点在你那一句。
//
// 一档：意向形的变形（五段／一段／する／来る），邀约和提议
// 二档：〜ようとする、〜ようかと思う、〜ようにする 和 〜ようとする 的区别，转述
// 三档：〜ようにも〜ない、〜ようがない（此「よう」非彼「よう」）、非意志主语的〜ようとしている
// ==========================================================

export const SORA_PACK: DrillPack = {
  id: 'sora',
  grammarZh: '意向形', grammarEn: 'Volitional form',
  partnerZh: '空', partnerEn: 'Sora',
  sprites: {
    neutral: '/images/characters/sora/neutral.webp',
    happy: '/images/characters/sora/happy.webp',
    miss: '/images/characters/sora/shock.webp'
  },
  onRight: [
    { jp: 'おっ、ええやん！', zh: '哦，不错嘛！', en: 'Oh, nice one!' },
    { jp: 'せや、それや。', zh: '对，就是那个。', en: 'Yeah, that’s the one.' },
    { jp: '分かってるやん。', zh: '你这不是挺懂的嘛。', en: 'You get it.' }
  ],
  onWrong: [
    { jp: '……ん？なんかちゃうな。', zh: '……嗯？好像不太对。', en: '...Hm? Something’s off.' },
    { jp: 'それ、意味変わってまうで。', zh: '那样意思就变了哦。', en: 'That changes the meaning, y’know.' },
    { jp: '惜しい！もう一本！', zh: '可惜！再来一球！', en: 'So close! One more!' }
  ],
  rounds: [
    // ======================= 一档 =======================
    {
      id: 's1_takoyaki', tier: 1,
      ctxZh: '你想约她练完一起去吃章鱼烧。', ctxEn: 'You want to invite her for takoyaki after practice.',
      jp: '練習終わったら、何する？', zh: '练习结束后干嘛？', en: 'What do you wanna do after practice?',
      options: [
        { jp: '一緒にたこ焼き食べに行こうよ。', zh: '一起去吃章鱼烧吧。', en: 'Let’s go get takoyaki together.', ok: true },
        { jp: '一緒にたこ焼き食べに行くよう。', zh: '（不通）', en: '(Broken)' },
        { jp: '一緒にたこ焼き食べに行きろう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '五段动词的意向形：う段 → お段＋う。行く → 行こう。意向形在对话里就是"……吧"。',
      noteEn: 'Godan volitional: change the u-sound to o and add う. 行く → 行こう. In conversation it means "let’s...".',
      word: { jp: '行こう', reading: 'いこう', zh: '去吧', en: 'let’s go' }
    },
    {
      id: 's1_morning', tier: 1,
      jp: '明日から朝練、一緒に走らへん？', zh: '明天开始晨练，一起跑步不？', en: 'Wanna run together at morning practice from tomorrow?',
      options: [
        { jp: 'うん、頑張って早く起きよう。', zh: '好，努力早起吧。', en: 'Sure — let’s try to get up early.', ok: true },
        { jp: 'うん、頑張って早く起きおう。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん、頑張って早く起きろう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '一段动词：去掉「る」加「よう」。起きる → 起きよう。',
      noteEn: 'Ichidan: drop る, add よう. 起きる → 起きよう.'
    },
    {
      id: 's1_carry', tier: 1,
      ctxZh: '你想说"我来拿吧"。', ctxEn: 'You want to offer to carry it.',
      jp: 'このボール籠、めっちゃ重いわ。', zh: '这个球筐超重的。', en: 'This ball basket is crazy heavy.',
      options: [
        { jp: '持とうか？', zh: '我来拿吧？', en: 'Want me to carry it?', ok: true },
        { jp: '持てか？', zh: '（不通）', en: '(Broken)' },
        { jp: '持ちようか？', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「意向形＋か」＝主动提出为对方做某事："我来……吧？"',
      noteEn: 'Volitional＋か offers to do something for the other person: "shall I...?"'
    },
    {
      id: 's1_cheer', tier: 1,
      ctxZh: '你打算去看她周日的练习赛。', ctxEn: 'You are planning to go and watch her Sunday practice match.',
      jp: '日曜、練習試合やねん。', zh: '周日有练习赛哦。', en: 'I’ve got a practice match on Sunday.',
      options: [
        { jp: '応援しに行こうと思ってる。', zh: '我打算去给你加油。', en: 'I’m planning to come and cheer.', ok: true },
        { jp: '応援しに行きようと思ってる。', zh: '（不通）', en: '(Broken)' },
        { jp: '応援しに行こうと思わせてる。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「意向形＋と思っている」＝打算、想要做（已经想了一阵子）。',
      noteEn: 'Volitional＋と思っている = intending to (and have been for a while).'
    },
    {
      id: 's1_homework', tier: 1,
      jp: '数学の宿題、全然分からへん。', zh: '数学作业完全搞不懂。', en: 'I don’t get the maths homework at all.',
      options: [
        { jp: 'じゃあ、今夜一緒にしよう。', zh: '那今晚一起做吧。', en: 'Then let’s do it together tonight.', ok: true },
        { jp: 'じゃあ、今夜一緒にすろう。', zh: '（不通）', en: '(Broken)' },
        { jp: 'じゃあ、今夜一緒にしおう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「する」的意向形是「しよう」。',
      noteEn: 'The volitional of する is しよう.'
    },
    {
      id: 's1_okonomi', tier: 1,
      jp: 'この店のお好み焼き、最高やな！', zh: '这家的大阪烧，绝了！', en: 'This place’s okonomiyaki is the best!',
      options: [
        { jp: 'うん、今度はみんなで来よう。', zh: '嗯，下次大家一起来吧。', en: 'Yeah — let’s bring everyone next time.', ok: true },
        { jp: 'うん、今度はみんなで来おう。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん、今度はみんなで来ろう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「来る」的意向形是「来よう（こよう）」。',
      noteEn: 'The volitional of 来る is 来よう (koyou).'
    },
    {
      id: 's1_continue', tier: 1,
      ctxZh: '你想提议"再练三十分钟"。', ctxEn: 'You want to suggest thirty more minutes.',
      jp: 'もう六時やけど、どうする？', zh: '已经六点了，怎么办？', en: 'It’s already six. What d’you reckon?',
      options: [
        { jp: 'あと三十分だけ続けよう。', zh: '再坚持三十分钟吧。', en: 'Let’s keep going for thirty more minutes.', ok: true },
        { jp: 'あと三十分だけ続けおう。', zh: '（不通）', en: '(Broken)' },
        { jp: 'あと三十分だけ続けるよう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「続ける」是一段动词 → 「続けよう」。',
      noteEn: '続ける is ichidan → 続けよう.'
    },
    {
      id: 's1_gym', tier: 1,
      ctxZh: '你想提议去体育馆里练。', ctxEn: 'You want to suggest moving practice into the gym.',
      jp: 'うわ、雨降ってきた。', zh: '哇，下雨了。', en: 'Ugh, it’s started raining.',
      options: [
        { jp: 'じゃあ、体育館で練習しよう。', zh: '那去体育馆练吧。', en: 'Then let’s practise in the gym.', ok: true },
        { jp: 'じゃあ、体育館で練習しろう。', zh: '（不通）', en: '(Broken)' },
        { jp: 'じゃあ、体育館で練習するよう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「名词＋する」型动词同样变成「〜しよう」：練習する → 練習しよう。',
      noteEn: 'Noun＋する verbs go the same way: 練習する → 練習しよう.'
    },
    {
      id: 's1_summer', tier: 1,
      jp: '夏休み、何するん？', zh: '暑假你打算干嘛？', en: 'What are you doing over the summer?',
      options: [
        { jp: 'アルバイトしようと思ってる。', zh: '打算去打工。', en: 'I’m thinking of getting a part-time job.', ok: true },
        { jp: 'アルバイトしおうと思ってる。', zh: '（不通）', en: '(Broken)' },
        { jp: 'アルバイトしようと思わってる。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「アルバイトする」→「アルバイトしよう」＋「と思っている」。',
      noteEn: 'アルバイトする → アルバイトしよう＋と思っている.'
    },
    {
      id: 's1_rest', tier: 1,
      jp: 'はぁ……もう足動かへん……。', zh: '哈……腿已经动不了了……', en: 'Haah... my legs won’t move...',
      options: [
        { jp: '少し休もうか。', zh: '稍微歇会儿吧。', en: 'Let’s take a little break.', ok: true },
        { jp: '少し休みようか。', zh: '（不通）', en: '(Broken)' },
        { jp: '少し休むようか。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '五段「休む」→「休もう」。',
      noteEn: 'Godan 休む → 休もう.'
    },

    // ======================= 二档 =======================
    {
      id: 's2_about', tier: 2,
      jp: 'さっき、何か言いかけてへんかった？', zh: '你刚才是不是想说什么？', en: 'Weren’t you about to say something just now?',
      options: [
        { jp: 'うん、言おうとしたけど、忘れちゃった。', zh: '嗯，本来想说，结果忘了。', en: 'Yeah, I was going to, but I forgot.', ok: true },
        { jp: 'うん、言いようとしたけど、忘れちゃった。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん、言うようとしたけど、忘れちゃった。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「意向形＋とする」＝正要做／试图做——多半没做成。',
      noteEn: 'Volitional＋とする = be about to / try to — usually without managing it.'
    },
    {
      id: 's2_late', tier: 2,
      ctxZh: '你正要出门，突然下起了大雨。', ctxEn: 'Just as you were leaving, it started pouring.',
      jp: '遅刻やん。どないしたん？', zh: '迟到了嘛。怎么回事？', en: 'You’re late. What happened?',
      options: [
        { jp: '家を出ようとしたら、急に雨が降ってきてさ。', zh: '正要出门，突然下起雨来。', en: 'Just as I was leaving, it suddenly started raining.', ok: true },
        { jp: '家を出るとしたら、急に雨が降ってきてさ。', zh: '假如我出门的话……', en: 'Supposing I left the house...' },
        { jp: '家を出ようとするなら、急に雨が降ってきてさ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「〜ようとしたら」＝正要……的时候（突然发生了别的事）。「〜とすれば／としたら」是假设。',
      noteEn: '〜ようとしたら = just as I was about to (something else happened). 〜とすれば／としたら is hypothetical.'
    },
    {
      id: 's2_quit', tier: 2,
      ctxZh: '你只是在考虑要不要退出社团，还没决定。', ctxEn: 'You are only considering leaving the club; nothing is decided.',
      jp: '部活辞めるって、ほんま！？', zh: '你要退社团，真的假的！？', en: 'You’re quitting the club? Seriously!?',
      options: [
        { jp: 'まだ決めてないけど、辞めようかと思ってる。', zh: '还没决定，只是有点想退。', en: 'I haven’t decided, but I’m sort of thinking about it.', ok: true },
        { jp: 'まだ決めてないけど、辞めようと思わない。', zh: '还没决定，但我不打算退。', en: 'Not decided, but I don’t intend to quit.' },
        { jp: 'まだ決めてないけど、辞めさせようかと思ってる。', zh: '还没决定，想让（别人）退出。', en: 'Not decided, but I’m thinking of making (someone) quit.' }
      ],
      noteZh: '「意向形＋かと思う」＝有点想……（还在犹豫），比「〜ようと思う」语气不确定。',
      noteEn: 'Volitional＋かと思う = half-thinking of (still wavering) — softer than 〜ようと思う.'
    },
    {
      id: 's2_stretch', tier: 2,
      jp: '毎日ストレッチしてる？', zh: '你每天都拉伸吗？', en: 'Do you stretch every day?',
      options: [
        { jp: 'うん、寝る前に必ずするようにしてる。', zh: '嗯，我尽量每天睡前都做。', en: 'Yeah, I make a point of doing it before bed.', ok: true },
        { jp: 'うん、寝る前に必ずしようにしてる。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん、寝る前に必ずしようとしてる。', zh: '嗯，睡前正要做……', en: 'Yeah, before bed I am about to do it...' }
      ],
      noteZh: '「辞书形＋ようにする」＝养成习惯、尽量做到。「意向形＋とする」＝正要做、试图做（一次性的）。这两个是最容易搞混的一对。',
      noteEn: 'Dictionary form＋ようにする = make a habit of. Volitional＋とする = be about to (a single attempt). These two get mixed up constantly.'
    },
    {
      id: 's2_senpai', tier: 2,
      ctxZh: '空的学长在场。你想对学长说"器材我们来收拾吧"。', ctxEn: 'Sora’s senior is there. You want to offer that you will clear up the equipment.',
      jp: '先輩、片付けどうします？', zh: '学长，收拾怎么办？', en: 'Senpai, what about clearing up?',
      options: [
        { jp: '片付けは私たちがやりましょうか。', zh: '收拾就交给我们吧？', en: 'Shall we take care of the clearing up?', ok: true },
        { jp: '片付けは私たちがやろうでしょうか。', zh: '（不通）', en: '(Broken)' },
        { jp: '片付けは私たちがやりますようか。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '对长辈提议用「〜ましょうか」——意向形的礼貌形。',
      noteEn: 'Offering to a senior: 〜ましょうか, the polite volitional.'
    },
    {
      id: 's2_fever', tier: 2,
      ctxZh: '昨天你本来要去，结果发烧了。', ctxEn: 'You meant to go yesterday but came down with a fever.',
      jp: '昨日、なんで来えへんかったん？', zh: '昨天你怎么没来？', en: 'How come you didn’t show up yesterday?',
      options: [
        { jp: '行こうと思ったんだけど、熱が出ちゃって。', zh: '本来打算去的，结果发烧了。', en: 'I meant to, but I came down with a fever.', ok: true },
        { jp: '行くと思ったんだけど、熱が出ちゃって。', zh: '我以为（会有人）去……', en: 'I thought (someone) would go...' },
        { jp: '行こうとさせたんだけど、熱が出ちゃって。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「行こうと思った」＝打算去；「行くと思った」＝以为会去（是推测，不是打算）。',
      noteEn: '行こうと思った = I meant to go. 行くと思った = I thought it would happen — a prediction, not an intention.'
    },
    {
      id: 's2_future', tier: 2,
      jp: '将来、何になりたいん？', zh: '将来想做什么？', en: 'What do you wanna be when you’re older?',
      options: [
        { jp: '日本で働こうと思ってる。', zh: '打算在日本工作。', en: 'I’m planning to work in Japan.', ok: true },
        { jp: '日本で働きようと思ってる。', zh: '（不通）', en: '(Broken)' },
        { jp: '日本で働けようと思ってる。', zh: '（不通：可能形没有意向形）', en: '(Broken: potential forms have no volitional)' }
      ],
      noteZh: '「働く」→「働こう」。可能形（働ける）表示能力，不能再变意向形。',
      noteEn: '働く → 働こう. The potential (働ける) expresses ability and has no volitional.'
    },
    {
      id: 's2_coach', tier: 2,
      ctxZh: '教练交代大家：明天早点到。', ctxEn: 'The coach told everyone to come early tomorrow.',
      jp: 'コーチ、なんて言うてた？', zh: '教练说什么了？', en: 'What did the coach say?',
      options: [
        { jp: '明日は早く来るようにって。', zh: '说明天要早点来。', en: 'That we’re to come early tomorrow.', ok: true },
        { jp: '明日は早く来ようって。', zh: '说"明天一起早点来吧"。', en: 'That "let’s all come early tomorrow".' },
        { jp: '明日は早く来いようにって。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '转述命令、要求：「辞书形＋ように（と）言う」。「来ようって」转述的是提议——"咱们一起早点来吧"。',
      noteEn: 'Reporting an instruction: dictionary form＋ように(と)言う. 来ようって reports a suggestion — "let’s all come early".'
    },
    {
      id: 's2_kouhai', tier: 2,
      jp: '一年生、全然話聞いてくれへんねん……。', zh: '一年级的完全不听我说话……', en: 'The first-years just won’t listen to me...',
      options: [
        { jp: '最近の一年生、人の話を聞こうとしないよね。', zh: '最近的一年级，根本不肯听人说话呢。', en: 'First-years these days just won’t even try to listen.', ok: true },
        { jp: '最近の一年生、人の話を聞こうとならないよね。', zh: '（不通）', en: '(Broken)' },
        { jp: '最近の一年生、人の話を聞くようとしないよね。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「意向形＋としない」＝根本不打算、不肯……（多用来说别人）。',
      noteEn: 'Volitional＋としない = won’t even try to (usually said of other people).'
    },
    {
      id: 's2_call', tier: 2,
      ctxZh: '你正要给光打电话，光先打过来了。', ctxEn: 'You were just about to call Hikari when she rang you first.',
      jp: 'さっきの電話、誰やったん？', zh: '刚才的电话是谁打的？', en: 'Who was that on the phone just now?',
      options: [
        { jp: '光にかけようとしたら、先にかかってきたんだ。', zh: '正要打给光，她先打来了。', en: 'I was about to call Hikari when she called first.', ok: true },
        { jp: '光にかけるようとしたら、先にかかってきたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: '光にかけようとされたら、先にかかってきたんだ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '又一个「〜ようとしたら」：动作刚要开始，就被别的事打断了。',
      noteEn: 'Another 〜ようとしたら: an action about to begin, interrupted by something else.'
    },

    // ======================= 三档 =======================
    {
      id: 's3_breakfast', tier: 3,
      ctxZh: '你以前不吃早饭，现在每天都吃了。', ctxEn: 'You used to skip breakfast; now you eat it every day.',
      jp: '最近、朝ごはん食べてる？', zh: '最近吃早饭吗？', en: 'Been eating breakfast lately?',
      options: [
        { jp: '前は抜いてたけど、今は毎朝食べるようになった。', zh: '以前不吃，现在每天早上都吃了。', en: 'I used to skip it, but now I eat it every morning.', ok: true },
        { jp: '前は抜いてたけど、今は毎朝食べようになった。', zh: '（不通）', en: '(Broken)' },
        { jp: '前は抜いてたけど、今は毎朝食べるようとなった。', zh: '（不通）', en: '(Broken)' },
        { jp: '前は抜いてたけど、今は毎朝食べようとした。', zh: '……现在每天早上都试着要吃（没吃成）。', en: '...now I try to eat it each morning (and fail).' }
      ],
      noteZh: '习惯、状态的变化：「辞书形＋ようになる」。这里的「よう」不是意向形。',
      noteEn: 'A change in habit or state: dictionary form＋ようになる. This よう is not the volitional.'
    },
    {
      id: 's3_battery', tier: 3,
      ctxZh: '你的手机没电了，想联系她也联系不上。', ctxEn: 'Your phone died, so you could not contact her even though you wanted to.',
      jp: 'なんで連絡くれへんかったん。', zh: '你为什么不联系我。', en: 'Why didn’t you get in touch?',
      options: [
        { jp: 'スマホの電池が切れて、連絡しようにもできなかったんだ。', zh: '手机没电了，想联系也联系不了。', en: 'My phone died, so I couldn’t contact you even though I tried.', ok: true },
        { jp: 'スマホの電池が切れて、連絡しようとできなかったんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'スマホの電池が切れて、連絡するようにもできなかったんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'スマホの電池が切れて、連絡しようにもしなかったんだ。', zh: '（不通：前后矛盾）', en: '(Broken: contradicts itself)' }
      ],
      noteZh: '「意向形＋にも〜ない」＝想做也做不了。后面接可能形的否定。',
      noteEn: 'Volitional＋にも〜ない = want to but cannot. It is followed by a negative potential.'
    },
    {
      id: 's3_regular', tier: 3,
      ctxZh: '你想鼓励她："只要想做，什么都做得到。"', ctxEn: 'You want to encourage her: if you set your mind to it, you can do anything.',
      jp: 'あたしなんかが、レギュラーになれるんかな……。', zh: '像我这样的，能成为正式队员吗……', en: 'Can someone like me really make the starting team...',
      options: [
        { jp: 'やろうと思えば、何だってできるよ。', zh: '只要你想做，什么都做得到。', en: 'If you set your mind to it, you can do anything.', ok: true },
        { jp: 'やるようと思えば、何だってできるよ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'やろうと思わせれば、何だってできるよ。', zh: '只要让（别人）想做……', en: 'If you make (someone) want to...' },
        { jp: 'やれようと思えば、何だってできるよ。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「意向形＋と思えば」＝只要有心去做（就能……）。',
      noteEn: 'Volitional＋と思えば = if you only set out to (then you can...).'
    },
    {
      id: 's3_noway', tier: 3,
      ctxZh: '球飞进了海里，根本找不回来。', ctxEn: 'The ball went into the sea; there is no getting it back.',
      jp: 'ボール、どこ行ったん？', zh: '球跑哪儿去了？', en: 'Where’d the ball go?',
      options: [
        { jp: '海に落ちたから、もう探しようがないよ。', zh: '掉海里了，根本没法找。', en: 'It fell in the sea. There’s no way to look for it now.', ok: true },
        { jp: '海に落ちたから、もう探そうがないよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '海に落ちたから、もう探すようがないよ。', zh: '（不通）', en: '(Broken)' },
        { jp: '海に落ちたから、もう探しようとしないよ。', zh: '掉海里了，（他）不肯找了。', en: 'It fell in the sea, so (he) won’t even try to look.' }
      ],
      noteZh: '「ます形词干＋ようがない」＝没办法……。注意这里的「よう」是"方法、手段"（様），跟意向形长得像，但不是一回事。',
      noteEn: 'Masu-stem＋ようがない = there is no way to. This よう means "method" (様) — it looks like the volitional but is unrelated.'
    },
    {
      id: 's3_curry', tier: 3,
      ctxZh: '在食堂排队，你还在犹豫点什么。', ctxEn: 'In the cafeteria queue, you are still dithering over what to order.',
      jp: 'で、何にするん？', zh: '所以，你点什么？', en: 'So what’re you having?',
      options: [
        { jp: 'うーん、今日はカレーにしようかな。', zh: '嗯……今天吃咖喱好了。', en: 'Hmm... maybe curry today.', ok: true },
        { jp: 'うーん、今日はカレーにするようかな。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うーん、今日はカレーにしろうかな。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うーん、今日はカレーにしようかと言って。', zh: '（句子没说完）', en: '(Sentence left hanging)' }
      ],
      noteZh: '「意向形＋かな」＝自言自语地犹豫、打算："要不……吧"。',
      noteEn: 'Volitional＋かな = musing aloud: "maybe I’ll..."'
    },
    {
      id: 's3_laps', tier: 3,
      ctxZh: '你们打算罚迟到的一年级跑三圈操场。', ctxEn: 'You plan to make the late first-years run three laps of the field.',
      jp: '一年生、また遅刻やで。', zh: '一年级的又迟到了。', en: 'The first-years are late again.',
      options: [
        { jp: 'じゃあ、グラウンドを三周走らせよう。', zh: '那就让他们跑三圈操场吧。', en: 'Then let’s make them run three laps.', ok: true },
        { jp: 'じゃあ、グラウンドを三周走らされよう。', zh: '那我们被逼着跑三圈吧。', en: 'Then let’s be made to run three laps.' },
        { jp: 'じゃあ、グラウンドを三周走ろうさせよう。', zh: '（不通）', en: '(Broken)' },
        { jp: 'じゃあ、グラウンドを三周走らせろう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '使役也能变意向形：走らせる（一段）→ 走らせよう。',
      noteEn: 'The causative has a volitional too: 走らせる (ichidan) → 走らせよう.'
    },
    {
      id: 's3_dontthink', tier: 3,
      jp: '明日のこと考えたら、緊張して寝られへん……。', zh: '一想到明天，紧张得睡不着……', en: 'Thinking about tomorrow, I’m too nervous to sleep...',
      options: [
        { jp: '今日はもう考えないでおこう。', zh: '今天就先别想了吧。', en: 'Let’s just not think about it tonight.', ok: true },
        { jp: '今日はもう考えないおこう。', zh: '（不通）', en: '(Broken)' },
        { jp: '今日はもう考えまいでおこう。', zh: '（不通）', en: '(Broken)' },
        { jp: '今日はもう考えないようにおこう。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「〜ないでおこう」＝决定先不做（ないでおく＋意向形）。',
      noteEn: '〜ないでおこう = decide to leave it for now (ないでおく＋volitional).'
    },
    {
      id: 's3_sunset', tier: 3,
      ctxZh: '须磨的海边，太阳正要沉进海里。', ctxEn: 'On Suma beach, the sun is just about to sink into the sea.',
      jp: 'あ、見て！夕日！', zh: '啊，快看！夕阳！', en: 'Oh, look! The sunset!',
      options: [
        { jp: 'ちょうど海に沈もうとしてるね。', zh: '正要沉进海里呢。', en: 'It’s just about to sink into the sea.', ok: true },
        { jp: 'ちょうど海に沈むとしてるね。', zh: '（不通）', en: '(Broken)' },
        { jp: 'ちょうど海に沈めようとしてるね。', zh: '（有人）正要把它弄沉。', en: '(Someone) is trying to sink it.' },
        { jp: 'ちょうど海に沈みようとしてるね。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '「意向形＋としている」也能用于太阳、火车这类没有意志的主语，意思是"眼看就要……"。',
      noteEn: 'Volitional＋としている also works with subjects that have no will — the sun, a train — meaning "about to".'
    },
    {
      id: 's3_hikari', tier: 3,
      ctxZh: '光说："大家一起去海边吧！"', ctxEn: 'Hikari said: "Let’s all go to the beach!"',
      jp: '光、なんて言うてた？', zh: '光说了什么？', en: 'What was Hikari saying?',
      options: [
        { jp: 'みんなで海に行こうって言ってたよ。', zh: '她说大家一起去海边吧。', en: 'She said we should all go to the beach.', ok: true },
        { jp: 'みんなで海に行くようにって言ってたよ。', zh: '她吩咐大家要去海边。', en: 'She instructed everyone to go to the beach.' },
        { jp: 'みんなで海に行けって言ってたよ。', zh: '她命令大家去海边。', en: 'She ordered everyone to go to the beach.' },
        { jp: 'みんなで海に行かせようって言ってたよ。', zh: '她说要让大家去海边。', en: 'She said we should make everyone go.' }
      ],
      noteZh: '转述别人的提议：「意向形＋って／と言っていた」。转述命令才用「〜ように」或命令形——跟二档教练那题对着看。',
      noteEn: 'Reporting a suggestion: volitional＋って／と言っていた. Instructions use 〜ように or the imperative — compare the coach question.'
    },
    {
      id: 's3_university', tier: 3,
      ctxZh: '你已经下定决心考日本的大学。', ctxEn: 'You have made up your mind to apply to a Japanese university.',
      jp: 'ほんまに日本の大学受けるん？', zh: '你真的要考日本的大学？', en: 'You’re really sitting for a Japanese uni?',
      options: [
        { jp: 'うん。日本の大学に進もうと決めたんだ。', zh: '嗯，我决定升日本的大学了。', en: 'Yeah. I’ve decided to go on to a Japanese university.', ok: true },
        { jp: 'うん。日本の大学に進むようと決めたんだ。', zh: '（不通）', en: '(Broken)' },
        { jp: 'うん。日本の大学に進もうと決めさせたんだ。', zh: '我让（别人）决定了……', en: 'I made (someone) decide...' },
        { jp: 'うん。日本の大学に進めようと決めたんだ。', zh: '我决定推进日本的大学……？', en: 'I decided to advance a Japanese university...?' }
      ],
      noteZh: '「意向形＋と決める」＝下定决心要……。「進む」（自）＝升学、前进；「進める」（他）＝推进某件事。',
      noteEn: 'Volitional＋と決める = resolve to. 進む (intransitive) = go on, advance; 進める (transitive) = push something forward.'
    }
  ]
};
