import { CharacterId, GameCalendar, LifeState, StoryEffect, TimeSlot } from '../types';
import { isSchoolDay } from './calendarLife';
import { dayIndex } from './lifeData';

// ==========================================================
// 🎯 地图上"在这儿能做的事"
//
// 【为什么挂在地图上，而不是另开一个菜单】
// 手机里那个"让她考考你"之所以不对劲，是因为它哪儿都不在：
// 不花时间、不用见面、没有地点，想刷多少刷多少。
// 现在每一件事都长在一个具体的地方、一个具体的时段、一个具体的人身上：
//   · 想练授受，就得傍晚回海风庄，赶上深雪在家
//   · 想捞金鱼，得等到夏天的晚上去生田神社
// 这跟钓鱼、种菜是同一个规矩：一天一次，花一格时间，花体力。
//
// 地点卡片上直接列出来，所以玩家挑地方的时候就知道"去那儿能干嘛"。
// ==========================================================

export type ActivityKind = 'drill' | 'karuta' | 'shiritori' | 'michi' | 'kingyo' | 'basketball';

export interface ActivityDef {
  id: string;
  kind: ActivityKind;
  locId: string;
  // 情景对答用哪一包题
  packId?: string;
  // 对面是谁。没见过的人的活动不显示——那是剧透。
  partner?: CharacterId;
  emoji: string;
  titleZh: string; titleEn: string;
  blurbZh: string; blurbEn: string;
  timeSlots: TimeSlot[];
  // 只在上学日（放假、周末学校里没人）
  schoolDayOnly?: boolean;
  // 季节 / 日期限制，以及不在季节时的提示
  season?: (cal: GameCalendar) => boolean;
  seasonZh?: string; seasonEn?: string;
  fee?: number;
  stamina: number;
  // 这个 flag 有了才能做（投篮：空教过之后才会玩）
  needsFlag?: string;
  needsZh?: string; needsEn?: string;
  // 投篮机摆在哪儿：体育馆，还是游戏厅的机台
  venue?: 'gym' | 'arcade';
}

const summerNights = (cal: GameCalendar) => cal.month === 7 || cal.month === 8;
// 明是四月入学的一年级。第一个月他还在忙手续，到五月才有空追着你问东问西。
const afterApril = (cal: GameCalendar) => (cal.year ?? 1) > 1 || cal.month >= 5 || cal.month <= 3;

export const ACTIVITIES: ActivityDef[] = [
  // ---------------- 情景对答 ----------------
  {
    id: 'drill_miyuki', kind: 'drill', packId: 'miyuki', locId: 'umikaze_exterior',
    partner: CharacterId.MIYUKI, emoji: '🍲',
    titleZh: '在门口跟深雪聊一会儿', titleEn: 'Chat with Miyuki at her door',
    blurbZh: '邻居之间永远在给来给去。练「あげる・くれる・もらう」。',
    blurbEn: 'Neighbours are forever giving and receiving. Practise あげる・くれる・もらう.',
    timeSlots: ['afternoon', 'night'], stamina: 10
  },
  {
    id: 'drill_asuka', kind: 'drill', packId: 'asuka', locId: 'classroom_morning',
    partner: CharacterId.ASUKA, emoji: '📋',
    titleZh: '听明日香抱怨', titleEn: 'Hear Asuka out',
    blurbZh: '"被谁怎么了"和"让谁去做"。练被动、使役、使役被动。',
    blurbEn: 'Who did what to whom. Passive, causative, causative-passive.',
    timeSlots: ['lunch', 'afternoon'], schoolDayOnly: true, stamina: 14
  },
  {
    id: 'drill_rei', kind: 'drill', packId: 'rei', locId: 'school_library',
    partner: CharacterId.REI, emoji: '📚',
    titleZh: '请铃出几道题', titleEn: 'Ask Rei for a few questions',
    blurbZh: '图书室最安静的角落。练可能形、自动词和他动词。',
    blurbEn: 'The quietest corner of the library. Potential form, intransitive and transitive verbs.',
    timeSlots: ['lunch', 'afternoon'], schoolDayOnly: true, stamina: 12
  },
  {
    id: 'drill_sora', kind: 'drill', packId: 'sora', locId: 'gym',
    partner: CharacterId.SORA, emoji: '🏀',
    titleZh: '陪空练球', titleEn: 'Shoot hoops with Sora',
    blurbZh: '「走ろう」「もう一本やろう」——练意向形。',
    blurbEn: '"Let’s run." "One more." — the volitional form.',
    timeSlots: ['lunch', 'afternoon'], schoolDayOnly: true, stamina: 18
  },
  {
    id: 'drill_minh', kind: 'drill', packId: 'minh', locId: 'international_office',
    emoji: '🎒',
    titleZh: '给后辈明答疑', titleEn: 'Answer Minh’s questions',
    blurbZh: '今年春天刚来的越南留学生，追着你问"如果……怎么办"。练条件形。',
    blurbEn: 'A first-year from Vietnam who arrived this spring, full of "what if" questions. Conditionals.',
    timeSlots: ['lunch', 'afternoon'], schoolDayOnly: true,
    season: afterApril,
    seasonZh: '明还在办入学手续，五月以后才有空。',
    seasonEn: 'Minh is still buried in enrolment paperwork until May.',
    stamina: 10
  },
  // ---------------- 小游戏 ----------------
  {
    id: 'karuta', kind: 'karuta', locId: 'school_sahoushitsu',
    partner: CharacterId.ASUKA, emoji: '🎴',
    titleZh: '跟明日香抢歌留多', titleEn: 'Karuta against Asuka',
    blurbZh: '牌是用你单词本里的词做的。念到哪张，抢哪张。',
    blurbEn: 'The cards are made from your own wordbook. Hear it, slap it.',
    timeSlots: ['lunch', 'afternoon'], schoolDayOnly: true, stamina: 14
  },
  {
    id: 'shiritori', kind: 'shiritori', locId: 'school_terrace',
    partner: CharacterId.HIKARI, emoji: '🔤',
    titleZh: '跟光玩接龙', titleEn: 'Shiritori with Hikari',
    blurbZh: '用上一个词的最后一个假名开头。说到「ん」就输。',
    blurbEn: 'Start with the last kana of the last word. End on ん and you lose.',
    timeSlots: ['lunch'], schoolDayOnly: true, stamina: 8
  },
  {
    id: 'michi', kind: 'michi', locId: 'sannomiya_station',
    emoji: '🗺️',
    titleZh: '在站前给游客指路', titleEn: 'Give directions outside the station',
    blurbZh: '三宫站前永远有人拿着手机转圈。用日语把路说清楚。',
    blurbEn: 'Outside Sannomiya there is always someone turning in circles with a phone. Tell them the way, in Japanese.',
    timeSlots: ['morning', 'afternoon'], stamina: 14
  },
  {
    id: 'kingyo', kind: 'kingyo', locId: 'ikuta_shrine',
    emoji: '🐟',
    titleZh: '夜店捞金鱼', titleEn: 'Goldfish scooping at the night stalls',
    blurbZh: '一张纸网三百日元。纸湿了就会破。',
    blurbEn: 'Three hundred yen a paper scoop. Wet paper tears.',
    timeSlots: ['night'],
    season: summerNights,
    seasonZh: '夜店只在七、八月的晚上摆出来。',
    seasonEn: 'The night stalls only set up on July and August evenings.',
    fee: 300, stamina: 8
  },
  // ---------------- 投篮机 ----------------
  // 一个人练。规则是空教的，所以得先被她教过一次。
  {
    id: 'bb_gym', kind: 'basketball', locId: 'gym', venue: 'gym',
    emoji: '🏀',
    titleZh: '一个人练「一分钟投篮」', titleEn: 'The one-minute shootout, solo',
    blurbZh: '计时器、一筐球、一个篮筐。限时投进够数就晋级下一关。',
    blurbEn: 'A timer, a cart of balls, one hoop. Make the target in time to move up a stage.',
    timeSlots: ['lunch', 'afternoon'], schoolDayOnly: true, stamina: 14,
    needsFlag: 'basketball_tutorial_done',
    needsZh: '规则还没人教过你。体育馆里那个短发的女生会教。', needsEn: 'Nobody has shown you the rules yet. The short-haired girl in the gym will.'
  },
  {
    id: 'bb_arcade', kind: 'basketball', locId: 'sannomiya_arcade', venue: 'arcade',
    emoji: '🕹️',
    titleZh: '游戏厅的投篮机', titleEn: 'The arcade basketball machine',
    blurbZh: '中央街游戏厅门口那台。一百日元一局，排行榜第一写着「SORA」。',
    blurbEn: 'The one at the front of the Center Gai game centre. A hundred yen a go. Top of the leaderboard: SORA.',
    timeSlots: ['afternoon', 'night'], fee: 100, stamina: 10,
    needsFlag: 'basketball_tutorial_done',
    needsZh: '你还不太会玩。也许该先让空教教你。', needsEn: 'You do not really know how it works. Maybe get Sora to show you first.'
  }
];

export const activitiesAt = (locId: string) => ACTIVITIES.filter(a => a.locId === locId);

// 练习进度存在哪个 key 下：情景对答按题包，小游戏按活动
// 投篮机不管在体育馆还是游戏厅，练的是同一双手，所以共用一个进度
export const practiceKeyOf = (a: ActivityDef) => a.kind === 'basketball' ? 'basketball' : (a.packId || a.id);

// ok 为 false 时，zh / en 是「为什么现在做不了」，地图卡片上原样显示
export type ActivityCheck = { ok: boolean; zh: string; en: string };

export const checkActivity = (
  a: ActivityDef,
  ctx: { calendar: GameCalendar; life: LifeState; slotsLeft: number; met: CharacterId[]; flags?: Record<string, boolean> }
): ActivityCheck => {
  const { calendar, life, slotsLeft } = ctx;
  if (a.needsFlag && !ctx.flags?.[a.needsFlag]) {
    return { ok: false, zh: a.needsZh || '还不会。', en: a.needsEn || 'Not yet.' };
  }
  if (a.schoolDayOnly && !isSchoolDay(calendar)) {
    return { ok: false, zh: '今天不上学，这儿没人。', en: 'No school today — nobody is here.' };
  }
  if (a.season && !a.season(calendar)) {
    return { ok: false, zh: a.seasonZh || '现在不是时候。', en: a.seasonEn || 'Not the right time of year.' };
  }
  if (!a.timeSlots.includes(calendar.timeSlot)) {
    const names: Record<TimeSlot, [string, string]> = {
      morning: ['早上', 'mornings'], lunch: ['午休', 'lunch'], afternoon: ['放学后', 'after school'], night: ['晚上', 'evenings']
    };
    return {
      ok: false,
      zh: `只在${a.timeSlots.map(s => names[s][0]).join('、')}。`,
      en: `Only ${a.timeSlots.map(s => names[s][1]).join(' / ')}.`
    };
  }
  if (life.activityOn?.[a.id] === dayIndex(calendar)) {
    return { ok: false, zh: '今天已经来过了。', en: 'Already done today.' };
  }
  if (slotsLeft < 1) return { ok: false, zh: '今天来不及了。', en: 'No time left today.' };
  if ((life.stamina ?? 100) < a.stamina) return { ok: false, zh: '撑不住了。', en: 'Too tired.' };
  if (a.fee && life.yen < a.fee) return { ok: false, zh: '钱不够。', en: 'Not enough money.' };
  return { ok: true, zh: '', en: '' };
};

// 情景对答练完给什么。达标了才给那一位的"特色属性"——
// 跟深雪聊得好，长的是体贴；陪空练球练得好，长的是魅力。
const PARTNER_STAT: Record<string, StoryEffect['stat']> = {
  miyuki: 'kindness', asuka: 'guts', rei: 'knowledge', sora: 'charm', minh: 'kindness', konbini: 'proficiency'
};

export const drillRewards = (packId: string, tier: number, cleared: boolean): StoryEffect[] => {
  const k = cleared ? tier + 1 : 1;
  const out: StoryEffect[] = [{
    stat: 'knowledge', amount: k,
    reasonZh: cleared ? '一口气答对了大半' : '错了不少，但错的地方都记住了',
    reasonEn: cleared ? 'You got most of them right' : 'Plenty wrong, but you remember where'
  }];
  if (cleared && PARTNER_STAT[packId]) {
    out.push({
      stat: PARTNER_STAT[packId], amount: 1,
      reasonZh: '这一来一回，说得越来越自然了', reasonEn: 'The back-and-forth is starting to feel natural'
    });
  }
  return out;
};
