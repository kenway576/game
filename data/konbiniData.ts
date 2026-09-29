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

// 题目本身搬到了 data/drills/konbini.ts，跟其他几包情景对答共用一套分档出题。
// 这里只留一次班怎么算钱、怎么评级。

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
