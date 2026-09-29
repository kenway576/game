import { DrillPack } from '../../types';
import { CLERK_MISAKI_SPRITES } from '../../constants';

// ==========================================================
// 🏪 便利店收银 · 敬語（尊敬語／謙譲語／丁寧語）
//
// 原来的八个客人（k_warm … k_oden）一个没动，全部放在一档：
// 那一档考的是"听懂客人要什么"，挑那句对应的店员用语。
//
// 二档开始考敬语本身——便利店是日本人每天听到最多敬语的地方，
// 也是留学生敬语最容易出洋相的地方：
//   「ご利用できます」「お書きしてください」「店長さんはいらっしゃいません」
// 这些错误每一个都是真实的、在收银台前每天都会听到的。
//
// 三档：投诉、二重敬语、「かねます」、关西老奶奶的「なんぼ」。
// 美咲（序章里给你结第一次账的那个店员）现在是你的前辈，站在你旁边。
// ==========================================================

export const KONBINI_PACK: DrillPack = {
  id: 'konbini',
  grammarZh: '敬语（店员用语）', grammarEn: 'Keigo at the till',
  partnerZh: '美咲前辈', partnerEn: 'Misaki (senior clerk)',
  sprites: {
    neutral: CLERK_MISAKI_SPRITES.welcome,
    happy: CLERK_MISAKI_SPRITES.smile,
    miss: CLERK_MISAKI_SPRITES.think
  },
  onRight: [
    { jp: 'いいね、その調子！', zh: '不错，保持这样！', en: 'Nice — keep it up!' },
    { jp: '今の、完璧！', zh: '刚才那句，完美！', en: 'That one was perfect!' },
    { jp: 'うん、お客さんも笑顔だったよ。', zh: '嗯，客人也笑着走的。', en: 'See? The customer left smiling.' }
  ],
  onWrong: [
    { jp: 'あ、ドンマイ。次、次！', zh: '啊，别在意。下一个！', en: 'Ah, never mind. Next one!' },
    { jp: '今のはね……こう言うんだよ。', zh: '刚才那个嘛……要这么说。', en: 'That one... you say it like this.' },
    { jp: '大丈夫、最初はみんなそうだから。', zh: '没事，一开始大家都这样。', en: 'It’s fine. Everyone’s like that at first.' }
  ],
  rounds: [
    // ======================= 一档：听懂客人要什么 =======================
    {
      id: 'k_warm', tier: 1,
      ctxZh: '拿着便当的上班族', ctxEn: 'A salaryman holding a bento',
      jp: 'これ、温めてもらえますか。', zh: '这个，能帮我热一下吗。', en: 'Could you heat this up for me?',
      options: [
        { jp: 'かしこまりました。少々お待ちください。', zh: '好的，请稍等。', en: 'Certainly. One moment please.', ok: true },
        { jp: 'お箸はおつけしますか。', zh: '需要筷子吗？', en: 'Would you like chopsticks?' },
        { jp: '袋にお入れしますか。', zh: '需要装袋吗？', en: 'Shall I put it in a bag?' }
      ],
      noteZh: '「かしこまりました」＝"明白了"最郑重的说法，店员接下客人要求时的标准回答。',
      noteEn: 'かしこまりました is the most formal "understood" — the standard reply when a clerk takes a request.',
      word: { jp: '温める', reading: 'あたためる', zh: '加热', en: 'to heat up' },
      missZh: '他指了指微波炉。你才反应过来。', missEn: 'He points at the microwave. Only then do you get it.'
    },
    {
      id: 'k_bag', tier: 1,
      ctxZh: '两手拿满的学生', ctxEn: 'A student with both hands full',
      jp: 'レジ袋、いります？', zh: '要塑料袋吗？', en: 'Do I need a bag?',
      options: [
        { jp: 'はい、五円になりますがよろしいでしょうか。', zh: '好的，需要五日元，可以吗？', en: 'Yes — that will be five yen, is that all right?', ok: true },
        { jp: 'ポイントカードはお持ちですか。', zh: '有积分卡吗？', en: 'Do you have a points card?' },
        { jp: 'こちらで温めますか。', zh: '要在这儿加热吗？', en: 'Shall I heat it here?' }
      ],
      noteZh: '日本的购物袋从 2020 年起收费。「〜でしょうか」比「〜ですか」更委婉。',
      noteEn: 'Carrier bags in Japan have cost money since 2020. 〜でしょうか is softer than 〜ですか.',
      word: { jp: 'レジ袋', reading: 'レジぶくろ', zh: '购物塑料袋', en: 'a carrier bag' },
      missZh: '她把东西又往前推了推，等你说那句该说的话。', missEn: 'She pushes her things forward again, waiting for the sentence that should come next.'
    },
    {
      id: 'k_point', tier: 1,
      ctxZh: '拿着手机的阿姨', ctxEn: 'A woman with her phone out',
      jp: 'ポイント、貯めてます。', zh: '我在攒积分。', en: 'I collect the points.',
      options: [
        { jp: 'ではバーコードをお願いいたします。', zh: '那麻烦出示一下条码。', en: 'Then your barcode, please.', ok: true },
        { jp: '恐れ入ります、袋は有料です。', zh: '不好意思，袋子是收费的。', en: 'Sorry, bags are chargeable.' },
        { jp: 'お会計、千円になります。', zh: '一共一千日元。', en: 'That comes to a thousand yen.' }
      ],
      noteZh: '「お願いいたします」＝「お願いします」的谦让语，更郑重。',
      noteEn: 'お願いいたします is the humble, more formal お願いします.',
      word: { jp: '貯める', reading: 'ためる', zh: '攒、积累', en: 'to save up' },
      missZh: '她举着手机等了三秒，然后自己把屏幕转了过来。', missEn: 'She holds the phone up for three seconds, then turns the screen round herself.'
    },
    {
      id: 'k_chopsticks', tier: 1,
      ctxZh: '买了两份便当的女人', ctxEn: 'A woman with two bentos',
      jp: 'お箸、二膳もらえます？', zh: '筷子能给两双吗？', en: 'Could I have two pairs of chopsticks?',
      options: [
        { jp: 'はい、二膳お入れいたします。', zh: '好的，给您放两双。', en: 'Of course, two pairs going in.', ok: true },
        { jp: '恐れ入ります、こちらは温められません。', zh: '不好意思，这个不能加热。', en: 'Sorry, this one cannot be heated.' },
        { jp: 'レシートはご利用ですか。', zh: '需要小票吗？', en: 'Do you need the receipt?' }
      ],
      noteZh: '「膳」是筷子的量词：一膳、二膳。「お入れいたします」是「入れる」的谦让语。',
      noteEn: '膳 counts pairs of chopsticks. お入れいたします is the humble form of 入れる.',
      word: { jp: '膳', reading: 'ぜん', zh: '（筷子的量词）双', en: 'counter for pairs of chopsticks' },
      missZh: '她伸出两根手指，很有耐心。', missEn: 'She holds up two fingers, patiently.'
    },
    {
      id: 'k_change', tier: 1,
      ctxZh: '只买了一瓶茶的老先生', ctxEn: 'An old man buying one bottle of tea',
      jp: '一万円で。', zh: '一万日元的。', en: 'Out of ten thousand.',
      options: [
        { jp: '一万円お預かりいたします。', zh: '收您一万日元。', en: 'Ten thousand yen, thank you.', ok: true },
        { jp: 'ちょうどお預かりいたします。', zh: '收您正好。', en: 'Exact change, thank you.' },
        { jp: '恐れ入ります、カードのみとなります。', zh: '不好意思，只收卡。', en: 'Sorry, card only.' }
      ],
      noteZh: '收钱要找零时说「お預かりいたします」（暂时收下），因为钱还要找回去一部分。',
      noteEn: 'When change is due, clerks say お預かりいたします — "I’ll take this for now" — since part goes back.',
      word: { jp: '預かる', reading: 'あずかる', zh: '收下、暂为保管', en: 'to receive / take charge of' },
      missZh: '店长在你身后轻轻咳了一声。', missEn: 'The manager clears their throat behind you, very quietly.'
    },
    {
      id: 'k_toilet', tier: 1,
      ctxZh: '看起来很急的人', ctxEn: 'Somebody who looks in a hurry',
      jp: 'すみません、トイレお借りできますか。', zh: '不好意思，能借用一下洗手间吗。', en: 'Excuse me, may I use the toilet?',
      options: [
        { jp: 'はい、あちらの奥になります。', zh: '可以，在那边最里面。', en: 'Yes — right at the back there.', ok: true },
        { jp: '申し訳ございません、売り切れです。', zh: '非常抱歉，卖完了。', en: 'I am very sorry, we are sold out.' },
        { jp: 'ただいまお繋ぎいたします。', zh: '这就为您转接。', en: 'Putting you through now.' }
      ],
      noteZh: '日本人借洗手间说「お借りする」——用的是"借"。',
      noteEn: 'Japanese people "borrow" a toilet: お借りする.',
      word: { jp: '借りる', reading: 'かりる', zh: '借用', en: 'to borrow' },
      missZh: '那个人的表情变了。你立刻改口，指了指店里最深处。', missEn: 'Their expression changes. You correct yourself immediately and point to the back of the shop.'
    },
    {
      id: 'k_age', tier: 1,
      ctxZh: '把一罐啤酒放上柜台的男人', ctxEn: 'A man putting a can of beer on the counter',
      jp: 'これ、お願いします。', zh: '这个，麻烦了。', en: 'This, please.',
      options: [
        { jp: '恐れ入ります、画面のタッチをお願いいたします。', zh: '不好意思，麻烦按一下屏幕确认。', en: 'Sorry — could you tap the screen to confirm?', ok: true },
        { jp: 'かしこまりました、温めますか。', zh: '好的，要加热吗？', en: 'Certainly. Shall I heat it?' },
        { jp: 'ポイントカードお作りしますか。', zh: '要办一张积分卡吗？', en: 'Would you like to sign up for a points card?' }
      ],
      noteZh: '日本便利店卖酒要客人在屏幕上确认"已满二十岁"。「恐れ入ります」是请人做事前的客气话。',
      noteEn: 'Japanese convenience stores have customers confirm on-screen that they are over twenty before selling alcohol. 恐れ入ります softens a request.',
      word: { jp: '確認', reading: 'かくにん', zh: '确认', en: 'confirmation' },
      missZh: '你差点把一罐啤酒直接装袋。店长的手伸过来按了那个键。', missEn: 'You nearly bag a beer without asking. The manager reaches over and taps the key.'
    },
    {
      id: 'k_oden', tier: 1,
      ctxZh: '穿着工装的人', ctxEn: 'Somebody in work overalls',
      jp: 'おでん、大根ひとつ。', zh: '关东煮，萝卜一个。', en: 'Oden — one daikon.',
      options: [
        { jp: 'かしこまりました。からしはおつけしますか。', zh: '好的。要放芥末吗？', en: 'Certainly. Would you like mustard with that?', ok: true },
        { jp: '恐れ入ります、おでんは終了しました。', zh: '不好意思，关东煮结束了。', en: 'Sorry, the oden is finished for today.' },
        { jp: 'お会計は以上でよろしいですか。', zh: '结账就这些可以吗？', en: 'Is that everything?' }
      ],
      noteZh: '「おつけしますか」＝要不要给您附上。关东煮配黄芥末（からし）是日本的吃法。',
      noteEn: 'おつけしますか = shall I add it for you. Oden with karashi mustard is the Japanese way.',
      word: { jp: '大根', reading: 'だいこん', zh: '白萝卜', en: 'daikon radish' },
      missZh: '锅还冒着热气。他看了看锅，又看了看你。', missEn: 'The pot is still steaming. He looks at the pot, then at you.'
    },
    {
      id: 'k_receipt', tier: 1,
      ctxZh: '赶时间的大学生', ctxEn: 'A university student in a rush',
      jp: 'レシート、いらないです。', zh: '小票不用了。', en: 'I don’t need the receipt.',
      options: [
        { jp: 'かしこまりました。ありがとうございました。', zh: '好的，谢谢惠顾。', en: 'Certainly. Thank you very much.', ok: true },
        { jp: 'レシートをお持ちですか。', zh: '您带着小票吗？', en: 'Do you have your receipt?' },
        { jp: 'こちら、温めますか。', zh: '这个要加热吗？', en: 'Shall I heat this?' }
      ],
      noteZh: '客人离开时说过去式的「ありがとうございました」——感谢的是已经完成的这次购物。',
      noteEn: 'As a customer leaves, it’s the past-tense ありがとうございました — thanks for a purchase now complete.',
      word: { jp: 'レシート', zh: '小票', en: 'receipt' },
      missZh: '她已经走到门口了，又回头看了你一眼。', missEn: 'She is at the door already, and glances back at you.'
    },
    {
      id: 'k_separate', tier: 1,
      ctxZh: '买了便当和冰淇淋的阿姨', ctxEn: 'A woman buying a bento and an ice cream',
      jp: 'お弁当とアイス、一緒に入れないでね。', zh: '便当和冰淇淋别放一起哦。', en: 'Don’t put the bento and the ice cream together.',
      options: [
        { jp: 'かしこまりました。袋をお分けしますね。', zh: '好的，给您分开装。', en: 'Of course. I’ll bag them separately.', ok: true },
        { jp: 'かしこまりました。アイスも温めますね。', zh: '好的，冰淇淋也给您热一下。', en: 'Of course. I’ll heat the ice cream too.' },
        { jp: 'アイスはおつけしますか。', zh: '需要附上冰淇淋吗？', en: 'Would you like ice cream with that?' }
      ],
      noteZh: '「お分けする」＝「分ける」的谦让语：为客人分开装。',
      noteEn: 'お分けする is the humble form of 分ける: separating things for the customer.',
      word: { jp: '分ける', reading: 'わける', zh: '分开', en: 'to separate' },
      missZh: '她赶紧把冰淇淋从微波炉门口拿了回去。', missEn: 'She rescues the ice cream from the microwave door just in time.'
    },

    // ======================= 二档：敬语本身 =======================
    {
      id: 'k2_coupon', tier: 2,
      ctxZh: '客人拿出一张优惠券', ctxEn: 'A customer holds out a coupon',
      jp: 'これ、使えますか。', zh: '这个能用吗？', en: 'Can I use this?',
      options: [
        { jp: 'はい、ご利用いただけます。', zh: '可以，您可以使用。', en: 'Yes, you may use it.', ok: true },
        { jp: 'はい、ご利用できます。', zh: '（错：谦让语用在了客人身上）', en: '(Wrong: humble form used on the customer)' },
        { jp: 'はい、ご利用されます。', zh: '（错：不规范的敬语）', en: '(Wrong: non-standard keigo)' }
      ],
      noteZh: '客人的动作不能用「ご〜できる」——那是谦让语，主语只能是自己。说"您可以使用"：「ご利用いただけます」或「ご利用になれます」。',
      noteEn: 'ご〜できる is humble and can only describe yourself. For the customer: ご利用いただけます or ご利用になれます.',
      word: { jp: '利用', reading: 'りよう', zh: '使用、利用', en: 'use' },
      missZh: '店长在后面轻轻摇了摇头。', missEn: 'Behind you, the manager gives a tiny shake of the head.'
    },
    {
      id: 'k2_manager', tier: 2,
      ctxZh: '一个来找店长的供货商', ctxEn: 'A supplier asking for the manager',
      jp: '店長さん、いらっしゃいますか。', zh: '店长在吗？', en: 'Is the manager in?',
      options: [
        { jp: '申し訳ございません、店長はただいま外出しております。', zh: '非常抱歉，店长现在外出了。', en: 'I am very sorry, the manager is out at the moment.', ok: true },
        { jp: '申し訳ございません、店長はただいま外出していらっしゃいます。', zh: '（错：对外人抬高了自己店的人）', en: '(Wrong: honouring your own side to an outsider)' },
        { jp: '申し訳ございません、店長さんはただいま外出されています。', zh: '（错：自己人不加「さん」、不用尊敬语）', en: '(Wrong: no さん or honorifics for your own side)' }
      ],
      noteZh: '对外人提到自己店里的人——哪怕是店长——用谦让语，不加「さん」：「店長は〜しております」。这叫"内外之别"。',
      noteEn: 'Speaking to outsiders about your own staff — even the manager — use humble forms and drop さん: 店長は〜しております. The in-group/out-group rule.',
      missZh: '供货商的眉毛动了一下。', missEn: 'The supplier’s eyebrow twitches.'
    },
    {
      id: 'k2_form', tier: 2,
      ctxZh: '想寄快递的客人', ctxEn: 'A customer wanting to send a parcel',
      jp: '宅配便、出したいんですけど。', zh: '我想寄个快递。', en: 'I’d like to send a parcel.',
      options: [
        { jp: 'では、こちらの伝票にご記入ください。', zh: '那请在这张单子上填写。', en: 'Then please fill in this slip.', ok: true },
        { jp: 'では、こちらの伝票にお書きしてください。', zh: '（错：谦让的「お〜する」用在了客人身上）', en: '(Wrong: humble お〜する used on the customer)' },
        { jp: 'では、こちらの伝票に記入してさしあげてください。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '请客人做某事：「ご〜ください」「お〜ください」。「お書きしてください」把谦让语用在了客人身上，是最常见的错误之一。',
      noteEn: 'Asking a customer to do something: ご〜ください／お〜ください. お書きしてください puts a humble form on the customer — a classic mistake.',
      word: { jp: '伝票', reading: 'でんぴょう', zh: '单据、运单', en: 'slip / waybill' },
      missZh: '客人看了看你，又看了看单子，自己拿起了笔。', missEn: 'The customer looks at you, at the slip, and picks up the pen anyway.'
    },
    {
      id: 'k2_price', tier: 2,
      ctxZh: '指着货架上一盒点心的客人', ctxEn: 'A customer pointing at a box of sweets',
      jp: 'これ、いくら？', zh: '这个多少钱？', en: 'How much is this?',
      options: [
        { jp: '三百八十円でございます。', zh: '三百八十日元。', en: 'It is three hundred and eighty yen.', ok: true },
        { jp: '三百八十円でいらっしゃいます。', zh: '（错：「いらっしゃる」只用于人）', en: '(Wrong: いらっしゃる is for people)' },
        { jp: '三百八十円になられます。', zh: '（错：给价格用了尊敬语）', en: '(Wrong: honouring a price)' }
      ],
      noteZh: '说价格、物品用丁宁语「でございます」。「いらっしゃる」「なられる」是尊敬语，只能用在人身上。',
      noteEn: 'Prices and things take the polite でございます. いらっしゃる and なられる are honorific and only for people.',
      missZh: '客人没忍住，笑了一下。', missEn: 'The customer cannot quite suppress a smile.'
    },
    {
      id: 'k2_atm', tier: 2,
      ctxZh: '找 ATM 的观光客', ctxEn: 'A tourist looking for the ATM',
      jp: 'ATMってどこですか。', zh: 'ATM 在哪里？', en: 'Where’s the ATM?',
      options: [
        { jp: 'あちらの雑誌売り場の奥にございます。', zh: '在那边杂志区的里面。', en: 'It is just past the magazine rack there.', ok: true },
        { jp: 'あちらの雑誌売り場の奥にいらっしゃいます。', zh: '（错：把 ATM 当人了）', en: '(Wrong: treating the ATM as a person)' },
        { jp: 'あちらの雑誌売り場の奥においでになります。', zh: '（错：把 ATM 当人了）', en: '(Wrong: treating the ATM as a person)' }
      ],
      noteZh: '东西"在"：「あります」的郑重说法是「ございます」。人"在"才用「いらっしゃいます」。',
      noteEn: 'For things, the formal "there is" is ございます. いらっしゃいます is only for people.',
      missZh: '观光客顺着你的手看过去，找了半天。', missEn: 'The tourist follows your hand and searches for a while.'
    },
    {
      id: 'k2_stamps', tier: 2,
      ctxZh: '想买邮票的老奶奶', ctxEn: 'An elderly woman wanting stamps',
      jp: '百十円の切手、あるかしら。', zh: '有一百一十日元的邮票吗？', en: 'Do you have 110-yen stamps?',
      options: [
        { jp: '申し訳ございません。ただいま切らしております。', zh: '非常抱歉，现在正好卖完了。', en: 'I am very sorry, we have run out.', ok: true },
        { jp: '申し訳ございません。ただいま切らしていらっしゃいます。', zh: '（错：对自己这边用了尊敬语）', en: '(Wrong: honouring your own side)' },
        { jp: '申し訳ございません。ただいま切らされております。', zh: '（错：被动，意思不对）', en: '(Wrong: passive; meaning off)' }
      ],
      noteZh: '自己这边的状态用「〜ております」（谦让／郑重）。「切らす」＝用完了、断货。',
      noteEn: 'Your own side’s situation takes 〜ております. 切らす = to run out of stock.',
      word: { jp: '切らす', reading: 'きらす', zh: '用完、断货', en: 'to run out of' },
      missZh: '老奶奶慢慢地把钱包收了回去。', missEn: 'The old woman slowly puts her purse away.'
    },
    {
      id: 'k2_umbrella', tier: 2,
      ctxZh: '外面突然下雨，客人没带伞。店里有失物招领的旧伞可以借。', ctxEn: 'It has started pouring; the customer has no umbrella. The shop has old lost-property umbrellas to lend.',
      jp: 'うわ、雨……傘、忘れちゃった。', zh: '哇，下雨了……伞忘带了。', en: 'Ugh, rain... I forgot my umbrella.',
      options: [
        { jp: 'よろしければ、こちらの傘をお使いください。', zh: '不嫌弃的话，请用这把伞。', en: 'If you like, please use this umbrella.', ok: true },
        { jp: 'よろしければ、こちらの傘をお使いしてください。', zh: '（错：「お〜する」用在了客人身上）', en: '(Wrong: お〜する used on the customer)' },
        { jp: 'よろしければ、こちらの傘を使わせていただいてください。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '又一次：请客人做事是「お〜ください」，不是「お〜してください」。',
      noteEn: 'Again: asking a customer is お〜ください, not お〜してください.',
      missZh: '客人愣了一下，还是接过了伞。', missEn: 'The customer hesitates, then takes the umbrella anyway.'
    },
    {
      id: 'k2_reserved', tier: 2,
      ctxZh: '刚才打过电话预约的客人', ctxEn: 'A customer who phoned ahead',
      jp: 'さっき電話した山田ですけど。', zh: '我是刚才打过电话的山田。', en: 'I’m Yamada — I called earlier.',
      options: [
        { jp: '山田様ですね。お待ちしておりました。', zh: '是山田先生吧，恭候您多时了。', en: 'Mr Yamada. We have been expecting you.', ok: true },
        { jp: '山田様ですね。お待ちになっておりました。', zh: '（错：尊敬语用在了自己身上）', en: '(Wrong: honorific used on yourself)' },
        { jp: '山田さんですね。待っていらっしゃいました。', zh: '（错）', en: '(Wrong)' }
      ],
      noteZh: '自己在等对方：谦让语「お待ちしておりました」。「お待ちになる」是尊敬语，主语应该是客人。',
      noteEn: 'You were waiting: humble お待ちしておりました. お待ちになる is honorific and needs the customer as subject.',
      missZh: '山田先生看了你一眼，没说什么。', missEn: 'Mr Yamada glances at you and says nothing.'
    },
    {
      id: 'k2_sample', tier: 2,
      ctxZh: '想看一下试用装的客人', ctxEn: 'A customer who wants to look at a sample',
      jp: 'これ、見てもいいですか。', zh: '这个可以看看吗？', en: 'May I look at this?',
      options: [
        { jp: 'どうぞ、ご覧ください。', zh: '请，您随便看。', en: 'Please, go ahead.', ok: true },
        { jp: 'どうぞ、拝見してください。', zh: '（错：谦让语用在了客人身上）', en: '(Wrong: humble form used on the customer)' },
        { jp: 'どうぞ、お見えください。', zh: '（错：「お見え」是"来"的尊敬语）', en: '(Wrong: お見え is the honorific of "come")' }
      ],
      noteZh: '「見る」的尊敬语是「ご覧になる」，谦让语是「拝見する」。请客人看：「ご覧ください」。「お見えになる」是「来る」的尊敬语。',
      noteEn: '見る: honorific ご覧になる, humble 拝見する. To invite a customer to look: ご覧ください. お見えになる is honorific "come".',
      word: { jp: 'ご覧', reading: 'ごらん', zh: '（尊）看', en: 'look (honorific)' },
      missZh: '客人手已经伸到一半，停住了。', missEn: 'The customer’s hand stops halfway.'
    },
    {
      id: 'k2_message', tier: 2,
      ctxZh: '常来的老客人要你给店长带句话', ctxEn: 'A regular asks you to pass a message to the manager',
      jp: '店長に、来週また来るって伝えといて。', zh: '跟店长说一声，我下周再来。', en: 'Tell the manager I’ll be back next week.',
      options: [
        { jp: 'かしこまりました。店長に申し伝えます。', zh: '好的，我会转告店长。', en: 'Certainly. I will let the manager know.', ok: true },
        { jp: 'かしこまりました。店長にお伝えになります。', zh: '（错：尊敬语用在了自己身上）', en: '(Wrong: honorific on yourself)' },
        { jp: 'かしこまりました。店長におっしゃいます。', zh: '（错：「おっしゃる」只用于对方）', en: '(Wrong: おっしゃる is only for others)' }
      ],
      noteZh: '「言う・伝える」的谦让语：「申す」「申し伝える」。「おっしゃる」是尊敬语，只能用在对方身上。',
      noteEn: 'Humble forms of "say / pass on": 申す, 申し伝える. おっしゃる is honorific and only for the other person.',
      missZh: '老客人哈哈笑了一声："你这孩子。"', missEn: 'The regular laughs. "Oh, you."'
    },

    // ======================= 三档：投诉、二重敬语、方言 =======================
    {
      id: 'k3_expired', tier: 3,
      ctxZh: '一位不太高兴的客人', ctxEn: 'A not-very-happy customer',
      jp: 'さっき買ったおにぎり、賞味期限切れてたんだけど。', zh: '刚才买的饭团，已经过期了。', en: 'The rice ball I just bought is past its date.',
      options: [
        { jp: '大変申し訳ございません。すぐにお取り替えいたします。', zh: '实在非常抱歉，马上为您更换。', en: 'I am terribly sorry. I will replace it right away.', ok: true },
        { jp: '大変申し訳ございません。すぐにお取り替えになります。', zh: '（错：尊敬语用在了自己身上）', en: '(Wrong: honorific on yourself)' },
        { jp: 'すみません。すぐに取り替えてあげます。', zh: '（失礼：在施恩）', en: '(Rude: framed as a favour)' },
        { jp: '大変申し訳ございません。すぐにお取り替えしてさしあげます。', zh: '（错：叠加错误）', en: '(Wrong: stacked mistakes)' }
      ],
      noteZh: '自己马上处理：「お〜いたします」（谦让）。「お〜になる」是尊敬语，主语只能是客人；「〜てあげる」在投诉面前是火上浇油。',
      noteEn: 'Your own action: お〜いたします (humble). お〜になる is honorific for the customer; 〜てあげる in the face of a complaint is fuel on the fire.',
      word: { jp: '賞味期限', reading: 'しょうみきげん', zh: '保质期（最佳食用期）', en: 'best-before date' },
      missZh: '客人的脸色又沉了一分。美咲赶紧过来接手。', missEn: 'The customer’s face darkens another shade. Misaki hurries over to take it.'
    },
    {
      id: 'k3_double', tier: 3,
      ctxZh: '你想复述客人刚才说的话："正如您刚才所说。"', ctxEn: 'You want to say: "Just as you said a moment ago."',
      jp: 'だからさっきから、温めてって言ってるでしょう。', zh: '所以我从刚才就一直说要加热啊。', en: 'I’ve been telling you to heat it this whole time.',
      options: [
        { jp: '失礼いたしました。先ほどおっしゃったとおりにいたします。', zh: '失礼了，就按您刚才说的办。', en: 'My apologies. I will do just as you said.', ok: true },
        { jp: '失礼いたしました。先ほどおっしゃられたとおりにいたします。', zh: '（错：二重敬语）', en: '(Wrong: double honorific)' },
        { jp: '失礼いたしました。先ほど申されたとおりにいたします。', zh: '（错：谦让语＋尊敬语混用）', en: '(Wrong: humble and honorific mixed)' },
        { jp: '失礼いたしました。先ほど申し上げたとおりにいたします。', zh: '就按我刚才说的办（主语变成自己了）。', en: 'I will do as I said (now YOU are the speaker).' }
      ],
      noteZh: '「おっしゃられる」是二重敬语（おっしゃる＋られる）：听着很恭敬，但算错。「申し上げる」是自己说的谦让语。',
      noteEn: 'おっしゃられる is a double honorific (おっしゃる＋られる): it sounds deferential but is wrong. 申し上げる is humble, for your own speech.',
      missZh: '客人叹了口气。微波炉叮的一声。', missEn: 'The customer sighs. The microwave pings.'
    },
    {
      id: 'k3_name', tier: 3,
      ctxZh: '一位常客想知道你的名字', ctxEn: 'A regular wants to know your name',
      jp: 'いつもありがとうね。お名前は？', zh: '一直多谢你啦。你叫什么名字？', en: 'Thanks as always. What’s your name?',
      options: [
        { jp: '{name}と申します。', zh: '我叫{name}。', en: 'My name is {name}.', ok: true },
        { jp: '{name}とおっしゃいます。', zh: '（错：给自己用了尊敬语）', en: '(Wrong: honorific on yourself)' },
        { jp: '{name}様です。', zh: '（错：给自己加了「様」）', en: '(Wrong: 様 on your own name)' },
        { jp: '{name}といらっしゃいます。', zh: '（不通）', en: '(Broken)' }
      ],
      noteZh: '自报姓名：「〜と申します」（「言う」的谦让语）。永远不要给自己的名字加「さん」「様」。',
      noteEn: 'Giving your name: 〜と申します (humble "say"). Never put さん or 様 on your own name.',
      missZh: '常客笑出了声："自分に『様』つけたらあかんで。"', missEn: 'The regular laughs out loud. "Don’t go putting ‘sama’ on yourself, love."'
    },
    {
      id: 'k3_wait', tier: 3,
      ctxZh: '洗手间正在清扫，得请客人稍等。', ctxEn: 'The toilet is being cleaned; you need to ask the customer to wait.',
      jp: 'お手洗い、お借りしてもよろしいですか。', zh: '可以借用一下洗手间吗？', en: 'Might I use the restroom?',
      options: [
        { jp: '申し訳ございません、ただいま清掃中ですので、少々お待ちいただけますか。', zh: '非常抱歉，现在正在清扫，能请您稍等吗？', en: 'I am very sorry, it is being cleaned. Would you mind waiting a moment?', ok: true },
        { jp: '申し訳ございません、ただいま清掃中ですので、少々お待ちしていただけますか。', zh: '（错：谦让的「お〜する」混进来了）', en: '(Wrong: humble お〜する mixed in)' },
        { jp: '申し訳ございません、ただいま清掃中ですので、少々お待ちになってさしあげますか。', zh: '（不通）', en: '(Broken)' },
        { jp: '申し訳ございません、ただいま清掃中ですので、少々待たせていただけますか。', zh: '能让我等一下吗？（主客颠倒）', en: 'May I be allowed to wait? (roles reversed)' }
      ],
      noteZh: '请对方等：「お待ちいただけますか」或「お待ちください」。「お待ちしていただく」把谦让的「お〜する」和「いただく」混在一起，是典型错误。',
      noteEn: 'Asking someone to wait: お待ちいただけますか or お待ちください. お待ちしていただく tangles humble お〜する with いただく — a textbook error.',
      missZh: '客人换了一只脚站着，等着。', missEn: 'The customer shifts their weight and waits.'
    },
    {
      id: 'k3_heard', tier: 3,
      ctxZh: '店长说过这款点心是神户的工厂做的。', ctxEn: 'The manager mentioned these sweets are made at a factory in Kobe.',
      jp: 'このお菓子、どこで作ってるの？', zh: '这点心是在哪儿做的？', en: 'Where are these sweets made?',
      options: [
        { jp: '神戸の工場で作られていると伺っております。', zh: '听说是在神户的工厂做的。', en: 'I understand they are made at a factory in Kobe.', ok: true },
        { jp: '神戸の工場で作られているとおっしゃっております。', zh: '（错：「おっしゃる」＋「おる」混用）', en: '(Wrong: おっしゃる mixed with おる)' },
        { jp: '神戸の工場でお作りになっていると申しております。', zh: '（错：给工厂用了尊敬语）', en: '(Wrong: honouring the factory)' },
        { jp: '神戸の工場で作られていると拝見しております。', zh: '（错：「拝見」是"看"，不是"听说"）', en: '(Wrong: 拝見 is "see", not "hear")' }
      ],
      noteZh: '「聞く」的谦让语是「伺う」："我听说……"＝「〜と伺っております」。',
      noteEn: 'The humble form of 聞く is 伺う: "I have heard that..." = 〜と伺っております.',
      word: { jp: '伺う', reading: 'うかがう', zh: '（谦）请教、听说、拜访', en: 'to ask / hear / visit (humble)' },
      missZh: '客人点点头，但看起来并没有被说服。', missEn: 'The customer nods, not entirely convinced.'
    },
    {
      id: 'k3_check', tier: 3,
      ctxZh: '客人怀疑你打错了价钱。', ctxEn: 'The customer thinks you rang something up wrong.',
      jp: 'ちょっと、レジ打ち間違えてない？', zh: '喂，你是不是打错了？', en: 'Hang on — didn’t you ring that up wrong?',
      options: [
        { jp: '失礼いたしました。ただいま確認いたします。', zh: '失礼了，我马上确认。', en: 'I’m sorry. I will check right away.', ok: true },
        { jp: '失礼しました。ただいま確認されます。', zh: '（错：被动／尊敬）', en: '(Wrong: passive/honorific)' },
        { jp: '失礼いたしました。ただいま確認してくださいます。', zh: '（错：主语变成了客人）', en: '(Wrong: the customer becomes the subject)' },
        { jp: '失礼いたしました。ただいまご確認なさいます。', zh: '（错：尊敬语用在了自己身上）', en: '(Wrong: honorific on yourself)' }
      ],
      noteZh: '「確認いたします」＝谦让语，自己去确认。「なさる」「くださる」都是对方的动作。',
      noteEn: '確認いたします is humble — you will check. なさる and くださる describe the other person’s action.',
      missZh: '后面排队的人开始看表了。', missEn: 'The people queueing behind start checking their watches.'
    },
    {
      id: 'k3_cake', tier: 3,
      ctxZh: '来取圣诞蛋糕预约的客人。你需要问对方的名字。', ctxEn: 'A customer collecting a reserved Christmas cake. You need to ask their name.',
      jp: '予約してたケーキ、取りに来ました。', zh: '我来取预约的蛋糕。', en: 'I’m here for the cake I reserved.',
      options: [
        { jp: 'ご予約のお名前を伺ってもよろしいでしょうか。', zh: '可以请问您预约用的名字吗？', en: 'May I ask the name on the reservation?', ok: true },
        { jp: 'ご予約のお名前をお聞きになってもよろしいでしょうか。', zh: '（错：尊敬语用在了自己身上）', en: '(Wrong: honorific on yourself)' },
        { jp: 'ご予約のお名前を申してもよろしいでしょうか。', zh: '我可以说出预约的名字吗？（意思不对）', en: 'May I say the name? (wrong meaning)' },
        { jp: '予約した名前を教えてあげてもいいですか。', zh: '（失礼）', en: '(Rude)' }
      ],
      noteZh: '"请问"：「伺う」（谦让）。「お聞きになる」是客人去听的尊敬语。「〜てもよろしいでしょうか」是最郑重的请示。',
      noteEn: 'To ask politely: 伺う (humble). お聞きになる is honorific for the customer listening. 〜てもよろしいでしょうか is the most formal "may I".',
      missZh: '客人把手机屏幕上的预约单举了起来。', missEn: 'The customer holds up the booking on their phone.'
    },
    {
      id: 'k3_kaneru', tier: 3,
      ctxZh: '便利店可以收快递，但不能直接替客人送上门。', ctxEn: 'The shop can accept parcels, but cannot deliver them to a customer’s door itself.',
      jp: 'これ、家まで届けてくれる？', zh: '这个能帮我送到家吗？', en: 'Can you deliver this to my house?',
      options: [
        { jp: '申し訳ございません。お届けはいたしかねます。', zh: '非常抱歉，我们无法为您配送。', en: 'I am very sorry, we are unable to deliver.', ok: true },
        { jp: '申し訳ございません。お届けはいたしかねません。', zh: '（错：「かねません」反而是"有可能"）', en: '(Wrong: かねません means "might well")' },
        { jp: '申し訳ございません。お届けはできかねません。', zh: '（错）', en: '(Wrong)' },
        { jp: '申し訳ございません。お届けはなさいかねます。', zh: '（错：尊敬语用在了自己身上）', en: '(Wrong: honorific on yourself)' }
      ],
      noteZh: '「〜かねます」＝礼貌地说"做不到"，本身就是否定。再加「ません」变成「〜かねません」，意思反而成了"很可能会……"。',
      noteEn: '〜かねます politely means "cannot" — it is already negative. Add ません and 〜かねません flips to "might very well...".',
      word: { jp: 'いたしかねます', zh: '（婉拒）难以办到', en: 'we are unable to (polite refusal)' },
      missZh: '客人一脸困惑："え、届けてくれるん？くれへんの？"', missEn: 'The customer looks baffled. "Wait, can you or can’t you?"'
    },
    {
      id: 'k3_nanbo', tier: 3,
      ctxZh: '关西口音很重的老奶奶', ctxEn: 'An elderly woman with a strong Kansai accent',
      jp: 'これ、なんぼ？', zh: '这个多少钱？（关西话）', en: 'How much is this? (Kansai)',
      options: [
        { jp: '二百四十円でございます。', zh: '二百四十日元。', en: 'It is two hundred and forty yen.', ok: true },
        { jp: 'こちらは温められます。', zh: '这个可以加热。', en: 'This one can be heated.' },
        { jp: 'おいくつになられましたか。', zh: '您今年多大了？', en: 'How old are you now?' },
        { jp: '本日は晴れでございます。', zh: '今天是晴天。', en: 'It is sunny today.' }
      ],
      noteZh: '「なんぼ」＝关西话的「いくら」（多少钱）。在神户的便利店，这句你一天会听到好多次。',
      noteEn: 'なんぼ is Kansai for いくら, "how much". At a Kobe konbini you will hear it many times a day.',
      word: { jp: 'なんぼ', zh: '（关西话）多少钱', en: 'how much (Kansai)' },
      missZh: '老奶奶又说了一遍，更大声了："なんぼ！"', missEn: 'She says it again, louder. "Nanbo!"'
    },
    {
      id: 'k3_receipt', tier: 3,
      ctxZh: '要开发票（领收书）的上班族，抬头要写「上様」。', ctxEn: 'An office worker wants a formal receipt made out to "Uesama".',
      jp: '領収書ください。宛名は「上様」で。', zh: '请开发票，抬头写「上様」。', en: 'A receipt, please — addressed to "Uesama".',
      options: [
        { jp: 'かしこまりました。「上様」でお書きいたします。', zh: '好的，给您写「上様」。', en: 'Certainly. I’ll write it to "Uesama".', ok: true },
        { jp: 'かしこまりました。「上様」でお書きになります。', zh: '（错：尊敬语用在了自己身上）', en: '(Wrong: honorific on yourself)' },
        { jp: 'かしこまりました。「上様」でお書きなさいます。', zh: '（不通）', en: '(Broken)' },
        { jp: 'かしこまりました。「上様」でご記入いただきます。', zh: '好的，请您自己填「上様」（意思不对）。', en: 'Certainly — you will fill it in yourself (wrong).' }
      ],
      noteZh: '「上様」是不写具体公司名时收据上的惯用抬头。自己写：「お書きいたします」。',
      noteEn: '上様 is the stock addressee on a receipt when no company name is given. Writing it yourself: お書きいたします.',
      word: { jp: '領収書', reading: 'りょうしゅうしょ', zh: '收据、发票', en: 'formal receipt' },
      missZh: '上班族看了一眼手表。', missEn: 'The office worker glances at his watch.'
    }
  ]
};
