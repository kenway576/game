import { CharacterId, GameCalendar, Language } from '../types';
import { dayIndex } from './lifeData';

// ---------------------------------------------------------
// 💬 谈话的尽头
//
// 以前聊天没有任何限制：不花时间格，一天想聊多少轮就聊多少轮。
// 于是"一个学年"对玩家其实不构成任何约束——几天之内所有数值都能刷满。
//
// 但是给聊天加一个"今日次数 3/5"的计数器会很生硬：
// 那是把游戏规则贴到人脸上。
//
// 所以这里做的是另一件事：**让她自己结束今天的谈话**。
//   最后两轮，她开始收尾（给 AI 的提示里加一句"该往回收了"）；
//   额度用完，她说一句属于她自己的告别——困了、要写作业、明天有晨练；
//   再点进来，得到的是一句"她今晚不在"，而不是一个变灰的按钮。
//
// 玩家看到的自始至终是一个有自己生活的人，不是一个每日任务。
// ---------------------------------------------------------

export interface RiftState {
  since: number;    // 开始那天的绝对日序
  until: number;    // 这一天之前都不说话
  reason: RiftReason;
}

export interface SocialState {
  // 今天跟谁聊了几轮
  turns: Partial<Record<CharacterId, { d: number; n: number }>>;
  // 冷淡期：吵过、或者话说重了之后，她会有几天不理你
  rifts: Partial<Record<CharacterId, RiftState>>;
}

export const INITIAL_SOCIAL_STATE: SocialState = { turns: {}, rifts: {} };

// 当天的稳定随机：同一天重开，她说的还是同一句。
const dayHash = (cal: GameCalendar, salt: number) => {
  let h = (dayIndex(cal) * 2654435761 + salt * 40503) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  return (h % 1000) / 1000;
};

const pick = <T,>(arr: T[], cal: GameCalendar, salt: number): T =>
  arr[Math.floor(dayHash(cal, salt) * arr.length) % arr.length];

const WEEK_HEAD = ['日', '月', '火', '水', '木', '金', '土'];
const isDayOff = (cal: GameCalendar): boolean => {
  const i = WEEK_HEAD.indexOf((cal.dayOfWeek || '').charAt(0));
  return i === 0 || i === 6;
};

// ---------------------------------------------------------
// 今天还能说几轮
//
// 按时段给基数：中午课间短，放学后最长，夜里她本来就该睡了。
// 越熟的人越有耐心多陪一会儿（每 50 点親密度多一轮，最多 +5）。
// 手机上聊比当面少两轮：隔着屏幕，谁都更容易说"那先这样"。
// 休息日整体加三轮——她今天没事。
// ---------------------------------------------------------
const SLOT_BASE: Record<string, number> = {
  morning: 6,
  lunch: 5,       // 午休只有那么长
  afternoon: 9,
  night: 6        // 夜里她困
};

export const budgetFor = (
  cal: GameCalendar, familiarity: number, inPerson: boolean
): number => {
  let n = SLOT_BASE[cal.timeSlot] ?? 7;
  n += Math.min(5, Math.floor(Math.max(0, familiarity) / 50));
  if (!inPerson) n -= 2;
  if (isDayOff(cal)) n += 3;
  return Math.max(3, n);
};

export const turnsToday = (social: SocialState, char: CharacterId, cal: GameCalendar): number => {
  const rec = social.turns[char];
  return rec && rec.d === dayIndex(cal) ? rec.n : 0;
};

export const bumpTurn = (social: SocialState, char: CharacterId, cal: GameCalendar): SocialState => {
  const d = dayIndex(cal);
  const rec = social.turns[char];
  return {
    ...social,
    turns: { ...social.turns, [char]: { d, n: (rec && rec.d === d ? rec.n : 0) + 1 } }
  };
};

export const turnsLeft = (
  social: SocialState, char: CharacterId, cal: GameCalendar,
  familiarity: number, inPerson: boolean
): number => Math.max(0, budgetFor(cal, familiarity, inPerson) - turnsToday(social, char, cal));

// ---------------------------------------------------------
// 收尾提示
//
// 剩两轮的时候，给模型加一句系统指令：开始往回收。
// 不是"马上道别"——是那种真实的收尾感：看一眼手机、提一句明天要早起、
// 话题开始往"那你路上小心"上偏。玩家不会看到这句提示，只会觉得
// 这段对话自然而然地走到了头。
// ---------------------------------------------------------
export const WIND_DOWN_AT = 2;

// 她今天大概会拿什么当借口。**这不是要打印出来的台词**，
// 是喂给模型的例子：让它知道这个人会用什么样的理由离席，
// 然后由它自己按刚才聊的内容现编一个。
//
// 第一版是直接把这些句子印出来当告别语，结果每次都一样，
// 而且和刚才聊的东西没有半点关系——聊了一小时她的伤，
// 最后弹一句"我明天的预习还没做"。真人不这么说话。
const EXCUSE_HINTS: Record<CharacterId, string> = {
  [CharacterId.ASUKA]: '時間割・予習・生徒会の書類・「十一時には寝ると決めている」といった、自分で決めた規律',
  [CharacterId.HIKARI]: 'バイトのシフト・明日の一限・寮の門限といった、留学生の現実的な予定',
  [CharacterId.REI]: '観測の準備・実験のセットアップ・「睡眠は変数ではなく前提条件」といった、理屈の形をした理由',
  [CharacterId.SORA]: '練習・朝練・走りに行く・監督にどやされる、といった体育会系の予定',
  [CharacterId.MIYUKI]: '鍋・買い物・洗濯・「明日も早いの」といった、生活の細かい用事',
  [CharacterId.NAO]: '洗濯物・出かける用事・単純に眠い、といった飾らない理由',
  [CharacterId.MAKI]: 'まだ回るとこがある・ゲーセン・「子どもは寝ぇや」と逆に相手を子ども扱いする形',
  [CharacterId.INARI]: '社に戻る・日が高い/夜が更けた・「人は寝るものじゃ」と人間の側の都合を持ち出す形'
};

export const windDownHint = (char: CharacterId, remaining: number, cal: GameCalendar): string | null => {
  if (remaining > WIND_DOWN_AT) return null;
  const night = cal.timeSlot === 'night';
  const excuses = EXCUSE_HINTS[char] || '自分の予定';

  if (remaining <= 1) {
    return [
      '【システム：この返答で今日の会話を締めくくること。以下を必ず守る：',
      '① 別れの理由は**今この会話で実際に話していた内容から**引き出すこと。今の話題と無関係な用事を突然持ち出さない。',
      `② どうしても外の用事を使うなら、あなたらしいもの（${excuses}）を、今日の状況に合わせて言い換えて使う。`,
      night
        ? '③ 今は夜。眠気・明日の朝の予定・相手にも寝るよう促す、といった夜特有の切り上げ方にする。'
        : '③ 今はまだ日中。眠気ではなく「行くところがある」系の切り上げ方にする。',
      '④ 今日話したことのどれかに触れて、次に会う口実を一つ残す（続きを聞く・見せる約束・同じ場所など）。',
      '⑤ 決まり文句（「またね」だけ、「じゃあ」だけ）で終わらせない。毎回違う言い方にすること。',
      '⑥ 質問で終わらないこと。演説にもしないこと。長くて三文。】'
    ].join('\n');
  }
  return [
    '【システム：会話の終わりが近い。まだ切り上げてはいけない。',
    'ただし一つだけ、時間を気にする素振りを自然に混ぜること（時計を見る・外の明るさに触れる・あくび・「そろそろ」と言いかけてやめる等）。',
    'どの素振りを使うかは、今話している内容の空気に合わせて選ぶこと。】'
  ].join('\n');
};

// ---------------------------------------------------------
// 她走了之后的那一行
//
// 注意这里**不再印她的台词**。台词是模型刚才那句回复——
// 那句是照着刚才聊的内容现编的，所以每次都不一样。
// 这里只补一句舞台指示，说明"对话结束了"这件事，
// 而且按时段和当天分开挑，免得三百天看同一句。
// ---------------------------------------------------------
const LEFT_DAY_ZH = [
  '她说完就走了。走出去两步又回头说了句什么，你没听清。',
  '她把东西收进包里，动作很快——像是真的赶时间。',
  '她挥了下手，转身走了。',
  '她站起来，把椅子推回原位，然后才走。',
  '她走到门口停了一下，好像想说什么，最后什么都没说。'
];
const LEFT_DAY_EN = [
  'She goes. Two steps out she turns and says something you do not catch.',
  'She packs her things away fast, like somebody genuinely late for something.',
  'She waves once and goes.',
  'She stands, pushes the chair back in, and only then leaves.',
  'She pauses at the door as though about to say something, and does not.'
];
const LEFT_NIGHT_ZH = [
  '对话框安静下来。过了一会儿，「オンライン」的标记灭了。',
  '她发完最后一句就下线了。',
  '打字提示亮了一下，又灭了。然后就没有然后了。',
  '最后一条消息之后，屏幕暗下去。'
];
const LEFT_NIGHT_EN = [
  'The thread goes quiet. A moment later the online dot goes out.',
  'She sends the last line and drops offline.',
  'The typing indicator comes on, and goes off. That is all.',
  'After the last message the screen dims.'
];

export const leftNote = (char: CharacterId, cal: GameCalendar, language: Language, inPerson: boolean): string => {
  const night = cal.timeSlot === 'night' || !inPerson;
  const zh = night ? LEFT_NIGHT_ZH : LEFT_DAY_ZH;
  const en = night ? LEFT_NIGHT_EN : LEFT_DAY_EN;
  return language === 'en'
    ? pick(en, cal, char.length * 29 + (night ? 3 : 0))
    : pick(zh, cal, char.length * 29 + (night ? 3 : 0));
};

// 额度用完之后再点进来，给的那一句。不是"今日次数已用完"，
// 是她此刻在干别的事。白天和夜里分开写。
const BUSY_DAY_ZH = [
  '发过去了，没有回。她大概真的去忙了。',
  '对话框停在她最后那句话上。今天大概就到这儿了。',
  '你打了半句，又删掉了。她说了她有事。',
  '你想了想，把手机放下了。晚一点她自己会说的。'
];
const BUSY_DAY_EN = [
  'Sent. Nothing comes back. She really did have somewhere to be.',
  'The thread sits on her last line. That is probably it for today.',
  'You type half a sentence and delete it. She said she was busy.',
  'You think about it and put the phone down. She will say something later.'
];
const BUSY_NIGHT_ZH = [
  '这个点她应该已经睡了。',
  '没有回。这个时间还醒着的只有你一个。',
  '「既読」都没有。她是真的睡着了。',
  '你看了一眼时间，把手机扣在桌上。'
];
const BUSY_NIGHT_EN = [
  'She will be asleep by now.',
  'Nothing back. You are the only one still up at this hour.',
  'Not even a read receipt. She really is asleep.',
  'You check the time and put the phone face down.'
];

export const busyNote = (cal: GameCalendar, language: Language): string => {
  const night = cal.timeSlot === 'night';
  const zh = night ? BUSY_NIGHT_ZH : BUSY_DAY_ZH;
  const en = night ? BUSY_NIGHT_EN : BUSY_DAY_EN;
  return language === 'en' ? pick(en, cal, 91) : pick(zh, cal, 91);
};

// ---------------------------------------------------------
// 🧊 冷淡期
//
// 吵过一次，或者话说重了，她会有几天不理你。
// 这不是惩罚机制，是一个很普通的事实：人生气的时候不想说话。
//
// 期间：找不到她（午休、偶遇都会避开），手机发过去只有已读。
// 结束：她自己先发消息。谁都不用道歉，日子过去了而已——
//      而"日子过去了"这件事只有在有日历的游戏里才成立。
// ---------------------------------------------------------
export type RiftReason = 'fight' | 'said_too_much' | 'misunderstanding';

// 谁能憋多久。给的是一个区间，不是一个数——
// 「明日香生气正好四天」这种东西一旦被玩家摸清就不再是生气了，
// 是冷却时间。真人不知道自己什么时候会消气，玩家也不该知道。
//
// 区间按性格给：越要面子、越不肯先开口的人，上限越高，
// 而且下限也高（她连"两天就算了"这个选项都没有）。
const RIFT_RANGE: Record<CharacterId, [number, number]> = {
  [CharacterId.ASUKA]: [3, 7],   // 认了错也要先把台阶铺好
  [CharacterId.REI]: [2, 6],     // 她不是在生气，是在重新算一遍
  [CharacterId.MAKI]: [2, 6],    // 嘴硬，而且越在乎越硬
  [CharacterId.INARI]: [3, 8],   // 她的"几天"本来就不是人的单位
  [CharacterId.MIYUKI]: [1, 3],  // 她会先原谅你，再为自己生过气道歉
  [CharacterId.HIKARI]: [1, 4],
  [CharacterId.SORA]: [1, 3],    // 打一场球就过去了
  [CharacterId.NAO]: [1, 4]      // 十年的交情，气得快也消得快
};

// 吵得越凶拖得越久。fight 最重，说过头次之，误会最轻——
// 误会本来就只需要一个机会把话说开。
const REASON_WEIGHT: Record<RiftReason, number> = {
  fight: 1,
  said_too_much: 0.7,
  misunderstanding: 0.45
};

// 这一次要僵多少天。**不落在日历的稳定随机上**：
// 冷淡期只掷一次，掷完写进存档，所以用真随机没有"读档重摇"的问题，
// 而且这样连同一个人的两次冷战都不会一样长。
const rollRiftDays = (char: CharacterId, reason: RiftReason): number => {
  const [lo, hi] = RIFT_RANGE[char] || [1, 3];
  const w = REASON_WEIGHT[reason] ?? 1;
  const span = (hi - lo) * w;
  // 偏向短的那一头：大部分架吵完第二天就没事了，长的是少数
  const r = Math.min(Math.random(), Math.random());
  return Math.max(1, Math.round(lo + span * r));
};

export const riftFor = (social: SocialState, char: CharacterId, cal: GameCalendar): RiftState | null => {
  const r = social.rifts[char];
  if (!r) return null;
  return dayIndex(cal) < r.until ? r : null;
};

export const openRift = (
  social: SocialState, char: CharacterId, cal: GameCalendar, reason: RiftReason
): SocialState => {
  const d = dayIndex(cal);
  const days = rollRiftDays(char, reason);
  return { ...social, rifts: { ...social.rifts, [char]: { since: d, until: d + days, reason } } };
};

// 刚结束的那些人：昨天还在冷淡期，今天不在了。
// 用来让她们主动发一条和好的消息。
export const riftsJustEnded = (social: SocialState, cal: GameCalendar): CharacterId[] => {
  const d = dayIndex(cal);
  return (Object.keys(social.rifts) as CharacterId[])
    .filter(c => { const r = social.rifts[c]; return !!r && r.until === d; });
};

const RIFT_ZH: Record<RiftReason, string[]> = {
  fight: [
    '消息显示已读。没有下文。',
    '你看着那个「既読」，看了很久。',
    '输入框亮了一下，又灭了。她在打字，然后删掉了。'
  ],
  said_too_much: [
    '她读了。她没有回。那句话大概确实说重了。',
    '已读。你重看了一遍自己发的那句，明白了她为什么不回。'
  ],
  misunderstanding: [
    '已读。你想解释，但你不知道该从哪一句开始解释。',
    '她读了，然后下线了。'
  ]
};
const RIFT_EN: Record<RiftReason, string[]> = {
  fight: [
    'Read. Nothing after it.',
    'You look at the read receipt for a long time.',
    'The typing indicator comes on, then goes off again.'
  ],
  said_too_much: [
    'She read it. She did not answer. That line probably did land too hard.',
    'Read. You reread what you sent and understand why nothing came back.'
  ],
  misunderstanding: [
    'Read. You want to explain, and you do not know which sentence to start from.',
    'She read it and went offline.'
  ]
};

export const riftNote = (r: RiftState, cal: GameCalendar, language: Language): string =>
  language === 'en' ? pick(RIFT_EN[r.reason], cal, 37) : pick(RIFT_ZH[r.reason], cal, 37);

// 冷淡期里当面撞见她：不演正常的偶遇，演一句擦肩。
const AVOID_ZH = [
  '你看见她了。她也看见你了。她转身走了另一条路。',
  '走廊上错身而过。谁都没有开口。',
  '她低头看手机，一直看到你走过去为止。手机屏幕是黑的。'
];
const AVOID_EN = [
  'You see her. She sees you. She takes the other corridor.',
  'You pass each other. Neither of you says anything.',
  'She looks at her phone until you have gone past. The screen is off.'
];

export const avoidNote = (cal: GameCalendar, language: Language): string =>
  language === 'en' ? pick(AVOID_EN, cal, 53) : pick(AVOID_ZH, cal, 53);

// 冷淡期结束时她发来的第一句。不道歉，也不提那件事——
// 装作什么都没发生，是最常见的和解方式。
export const MAKEUP_LINES: Record<CharacterId, { jp: string; zh: string; en: string }> = {
  [CharacterId.ASUKA]: { jp: '……ノート、まだ返してもらってないんだけど。', zh: '……笔记本，你还没还我。', en: '...You still have not given me my notebook back.' },
  [CharacterId.HIKARI]: { jp: 'なあ、今日の学食のカレー、辛すぎひん？', zh: '喂，今天食堂的咖喱是不是太辣了？', en: 'Hey. Was the canteen curry not way too hot today?' },
  [CharacterId.REI]: { jp: '観測を再開する。異論は？', zh: '观测重新开始。有异议吗？', en: 'Resuming observation. Objections?' },
  [CharacterId.SORA]: { jp: 'なあ、パン買うてきて。金は後で払う。', zh: '喂，帮我买个面包。钱回头给你。', en: 'Oi. Grab me a bread roll. I\'ll pay you back.' },
  [CharacterId.MIYUKI]: { jp: '肉じゃが作りすぎたの。取りに来る？', zh: '土豆炖肉做多了。要来拿吗？', en: 'I made far too much stew. Do you want to come and get some?' },
  [CharacterId.NAO]: { jp: 'あー、もうええわ。今日なに食べる？', zh: '啊——算了算了。今天吃什么？', en: 'Ugh, forget it. What are we eating today?' },
  [CharacterId.MAKI]: { jp: '……水曜、ゲーセン。来んの、来えへんの。', zh: '……周三，游戏厅。来不来。', en: '...Wednesday. Arcade. Are you coming or not.' },
  [CharacterId.INARI]: { jp: 'そろそろ機嫌も直った。茶でも飲みに来い。', zh: '气也消得差不多了。来喝杯茶吧。', en: 'My temper has run its course. Come and drink tea.' }
};

export const makeupLine = (char: CharacterId, language: Language): string => {
  const m = MAKEUP_LINES[char];
  if (!m) return language === 'en' ? 'Hey.' : '喂。';
  return language === 'en' ? m.en : m.zh;
};

export const makeupJp = (char: CharacterId): string => MAKEUP_LINES[char]?.jp || '';

// 和解消息的 flag：冷淡期一结束就置上，手机里她主动发来第一句。
// 再吵一次时要连同已读标记一起清掉，否则第二次和好她就不吭声了。
export const makeupFlag = (char: CharacterId) => `makeup_${char}`;
