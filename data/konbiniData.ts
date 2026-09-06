import { StoryWord } from '../types';

// ==========================================================
// 🏪 便利店收银小游戏
//
// 【为什么不是胡闹厨房】
// 那种游戏好玩在"同时有四件事在烧"，而它跟这个游戏的主题——学日语——
// 一点关系都没有。做出来会是一个可以单独拆出去卖的小游戏，
// 玩家玩完了，日语一个词没多。
//
// 日本便利店收银真正难的地方，恰好就是语言：
// 客人一句话说完，你有大概两秒钟决定要按哪个键。
//   「温めますか」「袋はご利用ですか」「お箸おつけしますか」
//   「ポイントカードお持ちですか」「レジ袋は五円になります」
// 这些句子每天要说两百多遍，是这份工里唯一真正会留在你身上的东西。
//
// 所以规则是：客人说一句，你在时限内挑一个回应。
//   · 挑对        → 队伍前进，连击 +1
//   · 挑错        → 客人愣一下，连击断
//   · 超时        → 队伍变长，连击断
// 连击直接换成时薪：手快的人一天挣得多，这是便利店的真事。
// ==========================================================

export interface KonbiniRound {
  id: string;
  // 客人说的那句话。日语在上，译文在下——和剧本里的台词一个规矩。
  jp: string;
  zh: string;
  en: string;
  // 客人是谁。只是给一行小字，让队伍里的人看起来不是同一个。
  whoZh: string;
  whoEn: string;
  options: { jp: string; zh: string; en: string; ok?: boolean }[];
  // 答对之后学到的那个词
  word?: StoryWord;
  // 答错时店长（或者客人）的反应
  missZh: string;
  missEn: string;
}

export const KONBINI_ROUNDS: KonbiniRound[] = [
  {
    id: 'k_warm',
    jp: 'これ、温めてもらえますか。',
    zh: '这个，能帮我热一下吗。',
    en: 'Could you heat this up for me?',
    whoZh: '拿着便当的上班族', whoEn: 'A salaryman holding a bento',
    options: [
      { jp: 'かしこまりました。少々お待ちください。', zh: '好的，请稍等。', en: 'Certainly. One moment please.', ok: true },
      { jp: 'お箸はおつけしますか。', zh: '需要筷子吗？', en: 'Would you like chopsticks?' },
      { jp: '袋にお入れしますか。', zh: '需要装袋吗？', en: 'Shall I put it in a bag?' }
    ],
    word: { jp: '温める', reading: 'あたためる', zh: '加热', en: 'to heat up' },
    missZh: '他指了指微波炉。你才反应过来。',
    missEn: 'He points at the microwave. Only then do you get it.'
  },
  {
    id: 'k_bag',
    jp: 'レジ袋、いります？',
    zh: '要塑料袋吗？',
    en: 'Do I need a bag?',
    whoZh: '两手拿满的学生', whoEn: 'A student with both hands full',
    options: [
      { jp: 'はい、五円になりますがよろしいでしょうか。', zh: '好的，需要五日元，可以吗？', en: 'Yes — that will be five yen, is that all right?', ok: true },
      { jp: 'ポイントカードはお持ちですか。', zh: '有积分卡吗？', en: 'Do you have a points card?' },
      { jp: 'こちらで温めますか。', zh: '要在这儿加热吗？', en: 'Shall I heat it here?' }
    ],
    word: { jp: 'レジ袋', reading: 'レジぶくろ', zh: '购物塑料袋', en: 'a carrier bag' },
    missZh: '她把东西又往前推了推，等你说那句该说的话。',
    missEn: 'She pushes her things forward again, waiting for the sentence that should come next.'
  },
  {
    id: 'k_point',
    jp: 'ポイント、貯めてます。',
    zh: '我在攒积分。',
    en: 'I collect the points.',
    whoZh: '拿着手机的阿姨', whoEn: 'A woman with her phone out',
    options: [
      { jp: 'ではバーコードをお願いいたします。', zh: '那麻烦出示一下条码。', en: 'Then your barcode, please.', ok: true },
      { jp: '恐れ入ります、袋は有料です。', zh: '不好意思，袋子是收费的。', en: 'Sorry, bags are chargeable.' },
      { jp: 'お会計、千円になります。', zh: '一共一千日元。', en: 'That comes to a thousand yen.' }
    ],
    word: { jp: '貯める', reading: 'ためる', zh: '攒、积累', en: 'to save up' },
    missZh: '她举着手机等了三秒，然后自己把屏幕转了过来。',
    missEn: 'She holds the phone up for three seconds, then turns the screen round herself.'
  },
  {
    id: 'k_chopsticks',
    jp: 'お箸、二膳もらえます？',
    zh: '筷子能给两双吗？',
    en: 'Could I have two pairs of chopsticks?',
    whoZh: '买了两份便当的女人', whoEn: 'A woman with two bentos',
    options: [
      { jp: 'はい、二膳お入れいたします。', zh: '好的，给您放两双。', en: 'Of course, two pairs going in.', ok: true },
      { jp: '恐れ入ります、こちらは温められません。', zh: '不好意思，这个不能加热。', en: 'Sorry, this one cannot be heated.' },
      { jp: 'レシートはご利用ですか。', zh: '需要小票吗？', en: 'Do you need the receipt?' }
    ],
    word: { jp: '膳', reading: 'ぜん', zh: '（筷子的量词）双', en: 'counter for pairs of chopsticks' },
    missZh: '她伸出两根手指，很有耐心。',
    missEn: 'She holds up two fingers, patiently.'
  },
  {
    id: 'k_change',
    jp: '一万円で。',
    zh: '一万日元的。',
    en: 'Out of ten thousand.',
    whoZh: '只买了一瓶茶的老先生', whoEn: 'An old man buying one bottle of tea',
    options: [
      { jp: '一万円お預かりいたします。', zh: '收您一万日元。', en: 'Ten thousand yen, thank you.', ok: true },
      { jp: 'ちょうどお預かりいたします。', zh: '收您正好。', en: 'Exact change, thank you.' },
      { jp: '恐れ入ります、カードのみとなります。', zh: '不好意思，只收卡。', en: 'Sorry, card only.' }
    ],
    word: { jp: '預かる', reading: 'あずかる', zh: '收下、暂为保管', en: 'to receive / take charge of' },
    missZh: '店长在你身后轻轻咳了一声。',
    missEn: 'The manager clears their throat behind you, very quietly.'
  },
  {
    id: 'k_toilet',
    jp: 'すみません、トイレお借りできますか。',
    zh: '不好意思，能借用一下洗手间吗。',
    en: 'Excuse me, may I use the toilet?',
    whoZh: '看起来很急的人', whoEn: 'Somebody who looks in a hurry',
    options: [
      { jp: 'はい、あちらの奥になります。', zh: '可以，在那边最里面。', en: 'Yes — right at the back there.', ok: true },
      { jp: '申し訳ございません、売り切れです。', zh: '非常抱歉，卖完了。', en: 'I am very sorry, we are sold out.' },
      { jp: 'ただいまお繋ぎいたします。', zh: '这就为您转接。', en: 'Putting you through now.' }
    ],
    word: { jp: '借りる', reading: 'かりる', zh: '借用', en: 'to borrow' },
    missZh: '那个人的表情变了。你立刻改口，指了指店里最深处。',
    missEn: 'Their expression changes. You correct yourself immediately and point to the back of the shop.'
  },
  {
    id: 'k_age',
    jp: 'これ、お願いします。',
    zh: '这个，麻烦了。',
    en: 'This, please.',
    whoZh: '把一罐啤酒放上柜台的男人', whoEn: 'A man putting a can of beer on the counter',
    options: [
      { jp: '恐れ入ります、画面のタッチをお願いいたします。', zh: '不好意思，麻烦按一下屏幕确认。', en: 'Sorry — could you tap the screen to confirm?', ok: true },
      { jp: 'かしこまりました、温めますか。', zh: '好的，要加热吗？', en: 'Certainly. Shall I heat it?' },
      { jp: 'ポイントカードお作りしますか。', zh: '要办一张积分卡吗？', en: 'Would you like to sign up for a points card?' }
    ],
    word: { jp: '確認', reading: 'かくにん', zh: '确认', en: 'confirmation' },
    missZh: '你差点把一罐啤酒直接装袋。店长的手伸过来按了那个键。',
    missEn: 'You nearly bag a beer without asking. The manager reaches over and taps the key.'
  },
  {
    id: 'k_oden',
    jp: 'おでん、大根ひとつ。',
    zh: '关东煮，萝卜一个。',
    en: 'Oden — one daikon.',
    whoZh: '穿着工装的人', whoEn: 'Somebody in work overalls',
    options: [
      { jp: 'かしこまりました。からしはおつけしますか。', zh: '好的。要放芥末吗？', en: 'Certainly. Would you like mustard with that?', ok: true },
      { jp: '恐れ入ります、おでんは終了しました。', zh: '不好意思，关东煮结束了。', en: 'Sorry, the oden is finished for today.' },
      { jp: 'お会計は以上でよろしいですか。', zh: '结账就这些可以吗？', en: 'Is that everything?' }
    ],
    word: { jp: '大根', reading: 'だいこん', zh: '白萝卜', en: 'daikon radish' },
    missZh: '锅还冒着热气。他看了看锅，又看了看你。',
    missEn: 'The pot is still steaming. He looks at the pot, then at you.'
  }
];

// 一次班的结算。连击换时薪——手快的人挣得多，这是便利店的真事。
export const SHIFT_BASE = 8400;   // 一千零五十日元 × 八小时

export const shiftPay = (correct: number, total: number, bestCombo: number): number => {
  const rate = total ? correct / total : 0;
  // 底薪照付。做得好的部分是店长塞的加班费和"下次还来吧"。
  const bonus = Math.round(SHIFT_BASE * 0.25 * rate) + bestCombo * 120;
  return SHIFT_BASE + bonus;
};

export const shiftGrade = (correct: number, total: number): 'ace' | 'fine' | 'rough' => {
  const rate = total ? correct / total : 0;
  if (rate >= 0.85) return 'ace';
  if (rate >= 0.55) return 'fine';
  return 'rough';
};
