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

export const windDownHint = (remaining: number): string | null => {
  if (remaining > WIND_DOWN_AT) return null;
  if (remaining <= 1) {
    return '【システム：この返答で今日の会話を締めくくってください。あなた自身の都合（眠い・宿題・朝練・家の用事など、あなたらしい理由）で、自然に切り上げること。「またね」で終わるのではなく、次に会う口実を一つ残してください。名残惜しさは出してよいが、演説にはしないこと。質問で終わらないこと。】';
  }
  return '【システム：そろそろ会話の終わりが近づいています。まだ切り上げてはいけませんが、時間を気にする素振り（時計を見る、明日の予定に触れる、あくびをする等）をさりげなく一つ混ぜてください。】';
};

// ---------------------------------------------------------
// 今天到此为止 —— 她自己给的理由
//
// 每个人两三句，按当天日期稳定挑一句。夜里和白天分开写：
// 白天是"我还有事"，夜里是"我要睡了"。
// ---------------------------------------------------------
interface Farewell { jp: string; zh: string; en: string }

const FAREWELLS: Record<CharacterId, { day: Farewell[]; night: Farewell[] }> = {
  [CharacterId.ASUKA]: {
    day: [
      { jp: '今日はここまで。わたし、明日の予習がまだなの。', zh: '今天到这里。我明天的预习还没做。', en: 'That is enough for today. I have not done tomorrow\'s reading yet.' },
      { jp: '……もうこんな時間。時間割、崩れるじゃない。', zh: '……都这个点了。我的时间表要乱了。', en: '...Look at the time. This is going to wreck my schedule.' }
    ],
    night: [
      { jp: '十一時には寝るって決めてるの。あなたも寝なさい。', zh: '我规定自己十一点必须睡。你也去睡。', en: 'I have a rule about being asleep by eleven. You should sleep too.' }
    ]
  },
  [CharacterId.HIKARI]: {
    day: [
      { jp: 'あ、やば。バイトの時間。……続きは今度な。', zh: '啊糟了，打工时间到了。……剩下的下次说。', en: 'Ah — my shift. ...We\'ll pick this up next time.' },
      { jp: 'ごめん、ちょっと用事あるわ。また明日な。', zh: '抱歉，我还有点事。明天见啦。', en: 'Sorry, I\'ve got something on. See you tomorrow.' }
    ],
    night: [
      { jp: 'うち明日一限からやねん。……先に寝るわ、おやすみ。', zh: '我明天第一节就有课。……我先睡了，晚安。', en: 'I\'ve got a first period tomorrow. ...Going to sleep. Night.' }
    ]
  },
  [CharacterId.REI]: {
    day: [
      { jp: '記録はここまで。これ以上は明日の観測に影響する。', zh: '记录到此为止。再下去会影响明天的观测。', en: 'The record ends here. More would affect tomorrow\'s observation.' },
      { jp: '……次の実験の準備がある。三十分後に始める。', zh: '……我还要准备下一个实验。三十分钟后开始。', en: '...I have a setup to prepare. It starts in thirty minutes.' }
    ],
    night: [
      { jp: '睡眠は変数ではなく前提条件。落ちる。', zh: '睡眠不是变量，是前提条件。我下了。', en: 'Sleep is not a variable. It is a precondition. Logging off.' }
    ]
  },
  [CharacterId.SORA]: {
    day: [
      { jp: 'あかん、練習行かな。監督にどやされる。', zh: '不行了，得去练习。不然要被教练骂。', en: 'Right, practice. Coach will have my head.' },
      { jp: 'ちょっと走ってくるわ。しゃべってると体なまる。', zh: '我去跑一圈。光说话身体要生锈。', en: 'Going for a run. Too much talking and I seize up.' }
    ],
    night: [
      { jp: '明日朝練やねん。六時。……もう寝るわ。', zh: '明天有晨练。六点。……我睡了。', en: 'Morning practice tomorrow. Six o\'clock. ...Sleeping.' }
    ]
  },
  [CharacterId.MIYUKI]: {
    day: [
      { jp: 'あら、お鍋。……ごめんなさい、また後でね。', zh: '哎呀，锅还在火上。……抱歉，回头再说。', en: 'Oh — the pot. ...Sorry, later, all right.' },
      { jp: 'そろそろ買い物に行かないと、閉まっちゃう。', zh: '再不去买菜就关门了。', en: 'If I do not go now the shops will shut.' }
    ],
    night: [
      { jp: '明日も早いの。ちゃんと歯磨いて寝るのよ。', zh: '我明天也早。你记得刷牙再睡。', en: 'Early start for me too. Brush your teeth before bed.' }
    ]
  },
  [CharacterId.NAO]: {
    day: [
      { jp: 'あ、洗濯物。取り込まな。……またあとで！', zh: '啊，衣服还晾着。得收了。……回头聊！', en: 'Ah — the washing. Got to bring it in. ...Later!' },
      { jp: 'ちょっと出かけてくる。夜また連絡するわ。', zh: '我出去一下。晚上再联系你。', en: 'Popping out. I\'ll message you tonight.' }
    ],
    night: [
      { jp: 'ねむ……。もう無理。おやすみ。', zh: '困……不行了。晚安。', en: 'Sleepy... that\'s me done. Night.' }
    ]
  },
  [CharacterId.MAKI]: {
    day: [
      { jp: 'ウチ、まだ回るとこあんねん。ほな。', zh: '我还有地方要去。就这样。', en: 'Still got places to be. Later.' },
      { jp: 'センパイ、しゃべりすぎ。ざぁこ。……ほな、また。', zh: '前辈，话太多了。杂鱼。……那，回头见。', en: 'Senpai, you talk too much. Weakling. ...Right, later.' }
    ],
    night: [
      { jp: '……もう寝る時間ちゃう？　子どもは寝ぇや。', zh: '……不是该睡了吗？小孩子快去睡。', en: '...Isn\'t it your bedtime? Off you go, child.' }
    ]
  },
  [CharacterId.INARI]: {
    day: [
      { jp: '今日はこのくらいにしておこう。日が高い。', zh: '今天就到这儿吧。日头还高着。', en: 'Let us leave it there for today. The sun is still high.' },
      { jp: 'そろそろ社に戻らねばな。留守が長いと叱られる。', zh: '我该回神社了。空太久是要挨说的。', en: 'I ought to return to the shrine. They complain if I am away too long.' }
    ],
    night: [
      { jp: '今宵はここまでじゃ。……お主は寝よ。人は寝るものじゃ。', zh: '今宵到此为止。……你去睡。人是要睡觉的。', en: 'That is enough for this evening. ...Go and sleep. People are supposed to.' }
    ]
  }
};

export const farewellFor = (char: CharacterId, cal: GameCalendar, language: Language): string => {
  const set = FAREWELLS[char];
  if (!set) return language === 'en' ? 'She says she has to go.' : '她说她该走了。';
  const list = cal.timeSlot === 'night' ? set.night : set.day;
  const f = pick(list, cal, char.length * 13);
  return language === 'en' ? f.en : f.zh;
};

export const farewellJpFor = (char: CharacterId, cal: GameCalendar): string => {
  const set = FAREWELLS[char];
  if (!set) return '';
  const list = cal.timeSlot === 'night' ? set.night : set.day;
  return pick(list, cal, char.length * 13).jp;
};

// 额度用完之后再点进来，给的那一句。不是"今日次数已用完"，
// 是她此刻在干别的事。
const BUSY_ZH = [
  '发过去了，没有回。她大概真的去忙了。',
  '对话框停在她最后那句话上。今天大概就到这儿了。',
  '你打了半句，又删掉了。她说了她有事。'
];
const BUSY_EN = [
  'Sent. Nothing comes back. She really did have somewhere to be.',
  'The thread sits on her last line. That is probably it for today.',
  'You type half a sentence and delete it. She said she was busy.'
];

export const busyNote = (cal: GameCalendar, language: Language): string =>
  language === 'en' ? pick(BUSY_EN, cal, 91) : pick(BUSY_ZH, cal, 91);

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

// 谁能憋多久。越要面子的人越久。
const RIFT_DAYS: Record<CharacterId, number> = {
  [CharacterId.ASUKA]: 4,
  [CharacterId.REI]: 3,
  [CharacterId.MAKI]: 3,
  [CharacterId.INARI]: 3,
  [CharacterId.MIYUKI]: 2,
  [CharacterId.HIKARI]: 2,
  [CharacterId.SORA]: 2,
  [CharacterId.NAO]: 2
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
  const days = RIFT_DAYS[char] ?? 2;
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
