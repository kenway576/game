import { CharacterId, StoryFlags, StoryWord, AffectionMap, FamiliarityMap } from '../types';
import { getInitialFamiliarity } from '../constants';
import { MAKEUP_LINES, makeupFlag } from './socialLimits';

// ---------------------------------------------------------
// 📱 手机
//
// 【为什么要有手机】
// 之前"放学了还能挨个找人自由对话"是个设定漏洞：大厅是一份无视时间地点的
// 菜单，而地图那套时段系统已经建起来了，两边打架。
//
// 手机把这个漏洞变成了设定本身：
//   随时能发消息 —— 这是现实，十七岁的人当然随时在发消息；
//   但发消息**不等于见面**。文字里没有立绘、没有场景、她可能在忙，
//   给的好感度也少。想要一段真正的对话，得在对的时间去对的地方堵到人。
//
// 于是"见到本人"第一次变成一件有代价、也有价值的事，
// 而这个游戏最核心的 AI 对话功能一点没丢——只是分了两档。
//
// 【通讯录里存的名字是人物设定】
// 你手机里怎么存一个人，比任何介绍都准。
// 真希存的是「後輩（ゲーセン）」——因为你到现在都还没搞清楚她姓什么；
// 奈绪存的是十年前就存好的那个，你一直没改。
// ---------------------------------------------------------

export interface PhoneContact {
  id: CharacterId;
  avatar: string;
  // 你在通讯录里给她存的名字
  savedAsJp: string; savedAsZh: string; savedAsEn: string;
  // 她自己设的一句状态
  statusZh: string; statusEn: string;
  accent: string;      // 和剧本里她的对话框同色
}

// 拿到号码的门槛。见过一面不算——現实里也不算。
// 「面熟」(親密度 40) 起才会互相交换联系方式。
export const CONTACT_MIN_FAMILIARITY = 40;

export const PHONE_CONTACTS: PhoneContact[] = [
  {
    id: CharacterId.ASUKA, avatar: '/images/phone/asuka.webp',
    savedAsJp: '委員長', savedAsZh: '委员长', savedAsEn: 'Class President',
    statusZh: '木曜、図書室。', statusEn: 'Thursday. Library.',
    accent: 'bg-red-600'
  },
  {
    id: CharacterId.HIKARI, avatar: '/images/phone/hikari.webp',
    savedAsJp: 'ひかり', savedAsZh: '光', savedAsEn: 'Hikari',
    statusZh: '今日もげんき！', statusEn: 'Cheerful again today!',
    accent: 'bg-sky-500'
  },
  {
    id: CharacterId.REI, avatar: '/images/phone/rei.webp',
    savedAsJp: '伊吹 鈴', savedAsZh: '伊吹 铃', savedAsEn: 'Ibuki Rei',
    statusZh: '観測中。', statusEn: 'Observing.',
    accent: 'bg-indigo-500'
  },
  {
    id: CharacterId.INARI, avatar: '/images/phone/inari.webp',
    savedAsJp: '稲荷さま', savedAsZh: '稻荷大人', savedAsEn: 'Lady Inari',
    statusZh: '千年、暇。', statusEn: 'A thousand years. Bored.',
    accent: 'bg-amber-500'
  },
  {
    id: CharacterId.NAO, avatar: '/images/phone/nao.webp',
    // 十年前存的那个名字，你一直没改
    savedAsJp: 'なおちゃん', savedAsZh: '小奈绪', savedAsEn: 'Nao-chan',
    statusZh: '（未設定）', statusEn: '(not set)',
    accent: 'bg-emerald-500'
  },
  {
    id: CharacterId.SORA, avatar: '/images/phone/sora.webp',
    savedAsJp: '空（バスケ）', savedAsZh: '空（篮球）', savedAsEn: 'Sora (basketball)',
    statusZh: '体育館、四時から。', statusEn: 'Gym. From four.',
    accent: 'bg-orange-500'
  },
  {
    id: CharacterId.MIYUKI, avatar: '/images/phone/miyuki.webp',
    savedAsJp: '２０２号室', savedAsZh: '202 室', savedAsEn: 'Room 202',
    statusZh: '作りすぎたら呼ぶわね。', statusEn: 'I will call if I make too much.',
    accent: 'bg-violet-400'
  },
  {
    id: CharacterId.MAKI, avatar: '/images/phone/maki.webp',
    // 到现在你都还不知道她姓什么
    savedAsJp: '後輩（ゲーセン）', savedAsZh: '后辈（游戏厅）', savedAsEn: 'Kouhai (arcade)',
    statusZh: 'ざぁこ♡', statusEn: 'Weakling ♡',
    accent: 'bg-pink-500'
  }
];

export const findContact = (id: CharacterId) => PHONE_CONTACTS.find(c => c.id === id);

// ---------------------------------------------------------
// 手机上的 App
//
// 大厅右上角原来一排六个按钮（画廊、人格参数、日历、单词本、物品、系统），
// 全部收进手机。理由不是"整齐"，是**它们本来就是手机里的东西**：
// 相册、笔记、日历、设置——一个高中生的手机就长这样。
// 大厅只剩三个真正属于"身体"的动作：回房间、出门、掏手机。
// ---------------------------------------------------------
export type PhoneAppId =
  | 'messages' | 'map' | 'album' | 'notes' | 'calendar' | 'items' | 'profile' | 'settings';

export interface PhoneApp {
  id: PhoneAppId;
  icon: string;
  labelJp: string; labelZh: string; labelEn: string;
  tint: string;       // 图标底色
}

export const PHONE_APPS: PhoneApp[] = [
  { id: 'messages', icon: '💬', labelJp: 'メッセージ', labelZh: '消息',   labelEn: 'Messages', tint: 'from-emerald-400 to-emerald-600' },
  { id: 'map',      icon: '🗺', labelJp: '地図',       labelZh: '地图',   labelEn: 'Map',      tint: 'from-amber-400 to-orange-600' },
  { id: 'album',    icon: '🌸', labelJp: 'アルバム',   labelZh: '相册',   labelEn: 'Album',    tint: 'from-rose-400 to-pink-600' },
  { id: 'notes',    icon: '📖', labelJp: '単語帳',     labelZh: '单词本', labelEn: 'Wordbook', tint: 'from-yellow-300 to-amber-500' },
  { id: 'calendar', icon: '📅', labelJp: 'カレンダー', labelZh: '日历',   labelEn: 'Calendar', tint: 'from-red-400 to-rose-600' },
  { id: 'items',    icon: '🎒', labelJp: '持ち物',     labelZh: '物品',   labelEn: 'Items',    tint: 'from-lime-400 to-green-600' },
  { id: 'profile',  icon: '👤', labelJp: 'プロフィール', labelZh: '人格参数', labelEn: 'Profile', tint: 'from-slate-300 to-slate-500' },
  { id: 'settings', icon: '⚙',  labelJp: '設定',       labelZh: '设置',   labelEn: 'Settings', tint: 'from-zinc-400 to-zinc-600' }
];

// ---------------------------------------------------------
// 她们主动发来的消息
//
// 【为什么必须有主动发来的】
// 只有你能发消息的通讯录，是一份联系人清单，不是一部手机。
// 她主动发一条，这段关系才是活的——而且这是唯一能表现
// "她在你不在场的时候也在想事情"的地方。
//
// 触发条件挂在已经存在的 flag 上（第一天遇没遇到、某段剧情演没演、
// 去没去过某个地方、吃没吃过食堂那个炒面面包），所以内容永远对得上进度。
//
// id 同时是"已读"的 flag：打开那个对话就记 msg_<id>，不另起一套。
// ---------------------------------------------------------
export interface PhoneMessage {
  id: string;
  char: CharacterId;
  requiresFlags?: string[];
  forbidsFlags?: string[];
  minAffection?: number;
  minFamiliarity?: number;
  // 连发几条，像真人发消息那样一条一条弹出来
  lines: { jp: string; zh: string; en: string }[];
  word?: StoryWord;
}

// 【顺序就是时间】
// 收到的先后 = 在这个数组里写的先后，每个人的几条按剧情顺序排。
// 第一版给每条打了 priority 然后按它排序，结果明日香那条"讲义帮你标好注音了"
// （第一天认识她就有）排到了"周四四点图书室"（第①段演完才有）后面——
// 手机上的对话必须是往下走的，倒着读就不成立。排序去掉了，靠写的顺序。
// 🧊 和好的第一句。冷淡期结束的那天早上，她自己先发过来。
// 没有道歉，也不提那件事——装作什么都没发生，是最常见的和解方式。
// requiresFlags 挂 makeup_xxx，由 App 在冷淡期结束时置上。
const MAKEUP_MESSAGES: PhoneMessage[] = (Object.keys(MAKEUP_LINES) as CharacterId[]).map(c => ({
  id: `msg_makeup_${c}`,
  char: c,
  requiresFlags: [makeupFlag(c)],
  lines: [MAKEUP_LINES[c]]
}));

export const PHONE_MESSAGES: PhoneMessage[] = [
  // ---- 奈绪：青梅竹马的那条线从最早就在手机上 ----
  {
    id: 'msg_nao_arrived', char: CharacterId.NAO,
    lines: [
      { jp: 'ついた？', zh: '到了吗？', en: 'Are you there?' },
      { jp: '既読つかないんだけど', zh: '已读都不显示的', en: 'It is not even showing as read' },
      { jp: 'まあいいや。おやすみ', zh: '算了。晚安', en: 'Never mind. Night' }
    ],
    word: { jp: '既読', reading: 'きどく', zh: '已读', en: 'read (receipt)' }
  },
  {
    id: 'msg_nao_slope', char: CharacterId.NAO, requiresFlags: ['ev_slope_nao'],
    lines: [
      { jp: 'あの店、二回目は自分で行った？', zh: '那家店，第二次你自己去了吗？', en: 'That cafe. Did you go back on your own?' },
      { jp: '……行ってないでしょ。顔でわかる', zh: '……没去吧。看脸就知道', en: '...You have not. I can tell from your face' }
    ]
  },
  {
    id: 'msg_nao_list', char: CharacterId.NAO, requiresFlags: ['nao_story_add_one'],
    lines: [
      { jp: '今日の分、まだ聞いてない', zh: '今天那一条，我还没听到', en: 'I have not had today’s one yet' },
      { jp: '毎日って言ったのそっちだからね', zh: '说每天的是你自己啊', en: 'You are the one who said every day' }
    ]
  },

  // ---- 深雪：房东、隔壁、做多了 ----
  {
    id: 'msg_miyuki_dinner', char: CharacterId.MIYUKI, requiresFlags: ['day1_done'],
    lines: [
      { jp: '今日もね、作りすぎちゃって', zh: '今天也是，做多了', en: 'I have gone and made too much again' },
      { jp: '２０２号室、開いてるわよ', zh: '202 室开着哦', en: 'Room 202 is open' }
    ],
    word: { jp: '作りすぎる', reading: 'つくりすぎる', zh: '做太多了', en: 'to make too much' }
  },
  {
    id: 'msg_miyuki_pairs', char: CharacterId.MIYUKI, requiresFlags: ['miyuki_story_saw_pairs'],
    lines: [
      { jp: 'この前の、お茶碗の話だけど', zh: '之前那个，碗的事', en: 'About the bowls, the other day' },
      { jp: '……やっぱりなんでもない', zh: '……还是算了，没什么', en: '...Never mind, it is nothing' }
    ]
  },

  // ---- 光：全肯定型，也是最爱发消息的 ----
  {
    id: 'msg_hikari_first', char: CharacterId.HIKARI, requiresFlags: ['day1_met_hikari'],
    lines: [
      { jp: '連絡先こうかんしたやつ！おぼえてる？', zh: '交换联系方式的那个！记得吗？', en: 'The one you swapped contacts with! Remember?' },
      { jp: 'あたしあたし。同じ船のひかり', zh: '我我我。同一条船上的光', en: 'Me me me. Hikari, same boat' },
      { jp: 'ねえ明日いっしょにお昼たべよ', zh: '喂明天一起吃午饭吧', en: 'Hey let us have lunch together tomorrow' }
    ]
  },
  {
    id: 'msg_hikari_wall', char: CharacterId.HIKARI, requiresFlags: ['hikari_story_the_wall'],
    lines: [
      { jp: 'きのうのことなんだけど', zh: '关于昨天的事', en: 'About yesterday' },
      { jp: 'あんまり気にしないでね！', zh: '别太在意啦！', en: 'Do not worry about it!' },
      { jp: '……ってこれ言うと余計気になるよね。ごめん', zh: '……说了这个反而更在意了吧。抱歉', en: '...Saying that makes it worse, does it not. Sorry' }
    ]
  },

  // ---- 明日香：她发消息像在发通知 ----
  {
    id: 'msg_asuka_handout', char: CharacterId.ASUKA, requiresFlags: ['day1_met_asuka'],
    lines: [
      { jp: '明日のプリント、二枚配られたから一枚あんたの', zh: '明天的讲义发了两张，一张是你的', en: 'Two copies of tomorrow’s handout were given out. One is yours' },
      { jp: 'ルビ、ふっといた', zh: '注音，标好了', en: 'I put the readings in' },
      { jp: '別に。ついでよ', zh: '没什么。顺便', en: 'It is nothing. While I was at it' }
    ],
    word: { jp: 'ルビ', reading: 'ルビ', zh: '注音假名', en: 'furigana' }
  },
  {
    id: 'msg_asuka_thursday', char: CharacterId.ASUKA, requiresFlags: ['asuka_story_1_done'],
    lines: [
      { jp: '木曜。四時。図書室', zh: '星期四。四点。图书室', en: 'Thursday. Four. Library' },
      { jp: '返事はいらない', zh: '不用回', en: 'No reply needed' }
    ]
  },
  {
    id: 'msg_asuka_second', char: CharacterId.ASUKA, requiresFlags: ['asuka_story_rank_second'],
    lines: [
      { jp: 'この前のこと、誰にも言ってないでしょうね', zh: '之前那件事，你没跟任何人说吧', en: 'You have not told anyone about the other day, I assume' },
      { jp: '……言ってないなら、いい', zh: '……没说的话，那就算了', en: '...If you have not, then fine' }
    ]
  },

  // ---- 铃：她发消息像在提交数据 ----
  {
    id: 'msg_rei_map', char: CharacterId.REI, requiresFlags: ['rei_story_1_done'],
    lines: [
      { jp: '土曜、十時、北野。ルートは地図の裏', zh: '周六，十点，北野。路线在地图背面', en: 'Saturday, ten, Kitano. The route is on the back of the map' },
      { jp: '雨天決行', zh: '下雨照常', en: 'Rain does not cancel' }
    ],
    word: { jp: '決行', reading: 'けっこう', zh: '照常进行', en: 'to go ahead regardless' }
  },
  {
    id: 'msg_rei_pulse', char: CharacterId.REI, requiresFlags: ['rei_story_keeps_recording'],
    lines: [
      { jp: '報告。今日の値は八十九', zh: '报告。今天的值是八十九', en: 'Report. Today’s value is eighty-nine' },
      { jp: 'あなたは同席していない。よって、変数は他にもある', zh: '你并不在场。因此，变量不止一个', en: 'You were not present. Therefore there is more than one variable' },
      { jp: '……訂正。今、あなたのことを考えていた', zh: '……更正。刚才我在想你的事', en: '...Correction. I was thinking about you just now' }
    ]
  },

  // ---- 空：全是短句，还全是关西腔 ----
  {
    id: 'msg_sora_gym', char: CharacterId.SORA, requiresFlags: ['day1_met_sora'],
    lines: [
      { jp: '体育館、今日も空いとるで', zh: '体育馆，今天也空着', en: 'Gym is free today too' },
      { jp: 'べつに待ってへんけど', zh: '我才没在等', en: 'Not that I am waiting or anything' }
    ]
  },
  {
    id: 'msg_sora_page', char: CharacterId.SORA, requiresFlags: ['sora_story_past_eleven'],
    lines: [
      { jp: '十三ページまでいった', zh: '做到第十三页了', en: 'Got as far as page thirteen' },
      { jp: '一人で', zh: '一个人', en: 'On my own' },
      { jp: '……で、合っとるか見てほしいねんけど', zh: '……然后，想让你看看对不对', en: '...So, I want you to check if it is right' }
    ]
  },
  {
    id: 'msg_sora_mamba', char: CharacterId.SORA, requiresFlags: ['day1_sora_mamba'],
    lines: [
      { jp: 'あの背番号、調べた', zh: '那个号码，我查了', en: 'I looked up that number' },
      { jp: '……ずるいわ、ほんまに', zh: '……真的太赖皮了', en: '...That really is cheating' }
    ]
  },

  // ---- 真希：语速最快，最会装 ----
  {
    id: 'msg_maki_wed', char: CharacterId.MAKI, requiresFlags: ['day1_met_maki'],
    lines: [
      { jp: 'センパイ', zh: '前辈', en: 'Senpai' },
      { jp: '水曜な', zh: '周三啊', en: 'Wednesday' },
      { jp: '来んかったら二度と教えたらへんから', zh: '不来的话我再也不教你了', en: 'If you do not come I am never teaching you anything again' }
    ]
  },
  {
    id: 'msg_maki_name', char: CharacterId.MAKI, requiresFlags: ['maki_story_made_her_say_it'],
    lines: [
      { jp: 'なあ', zh: '喂', en: 'Hey' },
      { jp: '勝負ちゃうときも、来てええねんな', zh: '不是比赛的时候，也可以来吧', en: 'Even when it is not a match. I can still come, right' },
      { jp: '……なんでもない。忘れて', zh: '……没事。忘了吧', en: '...Nothing. Forget it' }
    ]
  },

  // ---- 稻荷：一千年的人不太会用手机 ----
  {
    id: 'msg_inari_first', char: CharacterId.INARI, requiresFlags: ['day1_met_inari'],
    lines: [
      { jp: 'これは、声を紙に閉じ込めておるのか', zh: '这个东西，是把声音关进纸里吗', en: 'Does this thing shut a voice up inside paper' },
      { jp: '面白いのう。千年でいちばん面白い', zh: '有意思。一千年里最有意思的', en: 'How interesting. The most interesting thing in a thousand years' },
      { jp: '……で、これはどうやって止めるのじゃ', zh: '……话说，这个要怎么停下来', en: '...And how does one make it stop' }
    ]
  },
  {
    id: 'msg_inari_tree', char: CharacterId.INARI, requiresFlags: ['inari_story_fourth_tree'],
    lines: [
      { jp: 'まだ覚えておるぞ', zh: '我还记着哦', en: 'I still remember, you know' },
      { jp: '四本目のこと', zh: '第四棵的事', en: 'About the fourth one' }
    ]
  },

  // ---- 一条跟食堂挂钩的：她们也吃那个 ----
  {
    id: 'msg_hikari_pan', char: CharacterId.HIKARI, requiresFlags: ['tasted_caf_yakisoba_pan'],
    lines: [
      { jp: 'やきそばパン食べてたでしょ！見たよ！', zh: '你吃炒面面包了吧！我看见了！', en: 'You had the yakisoba bread! I saw you!' },
      { jp: 'あれ最初みんな引くんだよね。でもさ', zh: '那个大家一开始都嫌弃的。可是啊', en: 'Everyone recoils from that at first. But you know' },
      { jp: '二回目からうまいでしょ', zh: '第二次开始就好吃了吧', en: 'From the second time it is good, right' }
    ]
  }
];

// ---------------------------------------------------------
// 送达 / 已读
// ---------------------------------------------------------
export const readFlag = (msgId: string) => `msgread_${msgId}`;

export interface PhoneContext {
  flags: StoryFlags;
  affection: AffectionMap;
  familiarity: FamiliarityMap;
  // 已经认识的人。没见过的人不会有你的号码。
  met: CharacterId[];
}

const famOf = (ctx: PhoneContext, id: CharacterId) =>
  ctx.familiarity[id] ?? getInitialFamiliarity(id);

// 这条消息够不够条件送到你手机上
export const isDelivered = (m: PhoneMessage, ctx: PhoneContext): boolean => {
  if (!ctx.met.includes(m.char)) return false;
  if (m.requiresFlags && !m.requiresFlags.every(f => ctx.flags[f])) return false;
  if (m.forbidsFlags && m.forbidsFlags.some(f => ctx.flags[f])) return false;
  if (m.minAffection && (ctx.affection[m.char] || 0) < m.minAffection) return false;
  if (m.minFamiliarity && famOf(ctx, m.char) < m.minFamiliarity) return false;
  return true;
};

// 不排序：数组里的先后就是收到的先后。
// 和解那条单独接在最后——它总是"刚刚才发来的"，不管前面攒了多少条。
export const messagesFor = (char: CharacterId, ctx: PhoneContext): PhoneMessage[] => [
  ...PHONE_MESSAGES.filter(m => m.char === char && isDelivered(m, ctx)),
  ...MAKEUP_MESSAGES.filter(m => m.char === char && isDelivered(m, ctx))
];

export const unreadFor = (char: CharacterId, ctx: PhoneContext): number =>
  messagesFor(char, ctx).filter(m => !ctx.flags[readFlag(m.id)]).length;

export const totalUnread = (ctx: PhoneContext): number =>
  PHONE_CONTACTS.reduce((n, c) => n + unreadFor(c.id, ctx), 0);
