import { CharacterId, StoryFlags, StoryNode } from '../types';
import type { PhoneMessage } from './phoneData';

// ---------------------------------------------------------
// 🍚 深雪的「作りすぎちゃって」
//
// 202 是别人家。地图上它一直在，但门是关着的——
// 只有她发消息叫你的那一天（放学后、夜里），门才开着。没叫你就不能去：
// 不请自来地敲邻居家的门，在这个国家是很重的一件事。
//
// 第一次进 202 是她的好感度剧情①「二〇二号室の夕飯」（它写的就是"第一次进这间屋子"），
// 那一段演过之后，她才会时不时发消息叫你过去吃饭。
//
// 每次邀请都是一条真的手机消息（id 带着日期，各自有已读），
// 理由每次不一样，但桌上永远是那一份：烤鲑鱼、味噌汤、白饭、冷豆腐——
// 跟那张图一致。她的厨艺就是这样，不花哨，每天都一样好。
// ---------------------------------------------------------

export const MIYUKI_202 = 'miyuki_room_202';
// 今天 202 开着门（她叫过你、你还没去）。每天早上清掉，去过一次也清掉。
export const MIYUKI_INVITE_OPEN = 'invite_miyuki_open';
// 第一次进 202 的那段剧情演过了
export const MIYUKI_FIRST_DINNER = 'lvstory_miyuki_1_dinner';

const INVITE_PREFIX = 'invite_miyuki_d';
export const inviteFlag = (day: number) => `${INVITE_PREFIX}${day}`;

const invitedDays = (flags: StoryFlags): number[] =>
  Object.keys(flags)
    .filter(k => k.startsWith(INVITE_PREFIX) && flags[k])
    .map(k => Number(k.slice(INVITE_PREFIX.length)))
    .filter(n => Number.isFinite(n))
    .sort((a, b) => a - b);

interface InviteLine { jp: string; zh: string; en: string }
const INVITES: { lines: InviteLine[]; word: { jp: string; reading: string; zh: string; en: string }; atDoor: InviteLine }[] = [
  {
    lines: [
      { jp: '今日もね、作りすぎちゃって', zh: '今天也是，做多了', en: 'I have gone and made too much again' },
      { jp: '２０２号室、開いてるわよ', zh: '202 室开着哦', en: 'Room 202 is open' }
    ],
    word: { jp: '作りすぎる', reading: 'つくりすぎる', zh: '做太多了', en: 'to make too much' },
    atDoor: { jp: 'いらっしゃい。ほんとに作りすぎたのよ、今日は。', zh: '来啦。今天是真的做多了。', en: 'Come in. I really did make too much today.' }
  },
  {
    lines: [
      { jp: '鮭が安かったから、つい二切れ買っちゃった', zh: '鲑鱼很便宜，一不小心买了两块', en: 'The salmon was cheap, so I ended up buying two fillets' },
      { jp: '一切れ、もらってくれない？今夜', zh: '帮我解决一块好不好？今晚', en: 'Would you take one off my hands? Tonight' }
    ],
    word: { jp: '切れ', reading: 'きれ', zh: '（鱼、肉的）块，片', en: 'slice; fillet (counter)' },
    atDoor: { jp: 'はい、一切れはあなたの。もう焼いちゃったから、断れないわよ。', zh: '喏，这一块是你的。已经烤好了，不许拒绝。', en: 'There, that fillet is yours. It is already grilled, so you cannot say no.' }
  },
  {
    lines: [
      { jp: '実家からお米が届いたの、十キロ', zh: '老家寄来了米，十公斤', en: 'Rice arrived from my parents. Ten kilos' },
      { jp: '炊きたて、食べに来る？', zh: '刚煮好的，来吃吗？', en: 'Freshly cooked. Coming over?' }
    ],
    word: { jp: '炊きたて', reading: 'たきたて', zh: '刚煮好的（饭）', en: 'freshly cooked (rice)' },
    atDoor: { jp: '炊きたてよ。まずはご飯だけ食べてみて。おかずはその後。', zh: '刚煮好的。先光吃一口饭试试，菜等会儿再吃。', en: 'Fresh from the cooker. Try a mouthful of just the rice first. Then the rest.' }
  },
  {
    lines: [
      { jp: 'お味噌汁ってね、一人分だけ作るのが一番難しいのよ', zh: '味噌汤啊，最难的就是只做一个人的份', en: 'Miso soup is hardest to make for just one person, you know' },
      { jp: 'だから今夜は二人分。来るでしょ？', zh: '所以今晚做两人份。你会来的吧？', en: 'So tonight I am making two. You are coming, yes?' }
    ],
    word: { jp: '一人分', reading: 'ひとりぶん', zh: '一人份', en: 'one portion' },
    atDoor: { jp: 'ほらね、二人分だとちゃんと美味しくできるの。', zh: '你看，做两人份的时候就会好喝。', en: 'See? Make it for two and it comes out properly.' }
  },
  {
    lines: [
      { jp: '今日はちょっと疲れちゃって、誰かとご飯が食べたい気分', zh: '今天有点累，想跟谁一起吃顿饭', en: 'I am a bit tired today. I feel like eating with someone' },
      { jp: '……変な意味じゃないわよ。七時ね', zh: '……不是那个意思啊。七点', en: '...Not like that. Seven o\'clock' }
    ],
    word: { jp: '気分', reading: 'きぶん', zh: '心情；想要……的感觉', en: 'mood; feel like' },
    atDoor: { jp: '来てくれたのね。……座って。今日はあなたが聞き役よ。', zh: '你来啦。……坐吧。今天轮到你听我说了。', en: 'You came. ...Sit down. Tonight you are the one doing the listening.' }
  }
];

// 第 i 次邀请用第几套说法。第一次固定是「今日もね、作りすぎちゃって」。
const variantFor = (i: number) => (i === 0 ? 0 : 1 + ((i - 1) % (INVITES.length - 1)));

// 手机上的邀请消息：每一次邀请一条，id 带着日期
export const miyukiInviteMessages = (flags: StoryFlags): PhoneMessage[] =>
  invitedDays(flags).map((day, i) => {
    const v = INVITES[variantFor(i)];
    return { id: `msg_miyuki_invite_${day}`, char: CharacterId.MIYUKI, lines: v.lines, word: v.word };
  });

// 早上醒来：今天她叫不叫你
export const rollMiyukiInvite = (o: {
  flags: StoryFlags; today: number; met: boolean; rift: boolean; familiarity: number; affection: number;
}): boolean => {
  if (!o.met || o.rift || !o.flags[MIYUKI_FIRST_DINNER]) return false;
  const days = invitedDays(o.flags);
  const last = days[days.length - 1];
  // 不连着两天叫
  if (last !== undefined && o.today - last <= 1) return false;
  // 第一顿饭之后的第一次邀请来得快一点：她已经叫过你一次了
  if (!days.length) return Math.random() < 0.5;
  // 越熟越常叫；隔得越久越想叫
  const gap = last === undefined ? 0 : Math.min(0.15, (o.today - last) * 0.02);
  const chance = 0.12 + Math.min(0.15, o.familiarity / 300 * 0.15) + Math.min(0.1, o.affection / 300 * 0.1) + gap;
  return Math.random() < chance;
};

const M = '/images/characters/miyuki/';

// 到了 202。演完接面对面聊天（饭桌上）。
export const miyukiDinnerScript = (flags: StoryFlags, today: number): StoryNode[] => {
  const days = invitedDays(flags);
  const i = Math.max(0, days.indexOf(today));
  const v = INVITES[variantFor(i)];
  return [
    { type: 'scene', scene: 'miyuki_dinner_table', bgm: 'lobby', titleZh: '海风庄 202', titleEn: 'Umikaze-so, Room 202' },
    {
      type: 'narration',
      zh: '你敲了敲 202 的门。门几乎是立刻就开了——她大概一直在等这一下。',
      en: 'You knock on 202. The door opens almost at once. She was probably waiting for it.'
    },
    {
      type: 'speech', speakerZh: '深雪', speakerEn: 'Miyuki', characterImage: `${M}apron_happy.webp`, color: 'bg-violet-400',
      jp: v.atDoor.jp, zh: v.atDoor.zh, en: v.atDoor.en
    },
    {
      type: 'narration',
      zh: '桌上已经摆好了两人份：烤鲑鱼、味噌汤、白饭、一小块冷豆腐，筷子架在筷枕上。跟上次一模一样，也跟上次一样好吃。',
      en: 'The table is already laid for two: grilled salmon, miso soup, rice, a little block of chilled tofu, chopsticks resting on their rests. Exactly like last time, and just as good.'
    },
    {
      type: 'speech', speakerZh: '你', speakerEn: 'You', color: 'bg-yellow-500',
      jp: 'いただきます。',
      zh: '我开动了。',
      en: 'Itadakimasu.',
      words: [{ jp: 'いただきます', zh: '我开动了（饭前）', en: 'said before eating' }]
    },
    {
      type: 'narration',
      zh: '她在你对面坐下，自己却没怎么动筷子，一直看着你吃。',
      en: 'She sits down opposite you and barely touches her own chopsticks. She mostly watches you eat.'
    }
  ];
};
