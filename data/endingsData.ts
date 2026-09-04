import { CharacterId, StoryFlags } from '../types';

// ---------------------------------------------------------
// 🏁 结局记录
//
// 八个人的第③段末尾都是一个 check 节点：好感度 ≥ 200 走「相爱」，
// 否则走「挚友」。两条分支各自 setFlags 一个 `xxx_ending_love` /
// `xxx_ending_friend`。
//
// 问题是：**这些 flag 以前没有任何地方读**。
// 存进存档，然后就躺在那儿。玩家玩到结局，游戏不知道；
// 想凑「全结局」，没有一个地方能看还差谁。
//
// 这个表就是那个地方。它只读 flag，不产生新状态——
// 剧本还是唯一的真相来源。
// ---------------------------------------------------------

export type EndingKind = 'love' | 'friend';

export interface EndingDef {
  char: CharacterId;
  kind: EndingKind;
  flag: string;
  titleZh: string;
  titleEn: string;
  // 没解锁时给的提示：说清楚"怎么走到这儿"，不剧透里面发生了什么。
  hintZh: string;
  hintEn: string;
}

// 每个人两条。love 和 friend 是同一段剧情的两个分叉，
// 所以想集齐必须存两份档 —— 这是有意的，不是漏洞。
const pair = (
  char: CharacterId,
  slug: string,
  loveZh: string, loveEn: string,
  friendZh: string, friendEn: string
): EndingDef[] => [
  {
    char, kind: 'love', flag: `${slug}_ending_love`,
    titleZh: loveZh, titleEn: loveEn,
    hintZh: '第③段触发时好感度已在 200 以上',
    hintEn: 'Have affection at 200 or above when the third chapter fires'
  },
  {
    char, kind: 'friend', flag: `${slug}_ending_friend`,
    titleZh: friendZh, titleEn: friendEn,
    hintZh: '第③段触发时好感度不足 200',
    hintEn: 'Have affection below 200 when the third chapter fires'
  }
];

export const ENDINGS: EndingDef[] = [
  ...pair(CharacterId.ASUKA, 'asuka', '一番の隣', 'Beside the Top', '二番目の椅子', 'The Second Chair'),
  ...pair(CharacterId.HIKARI, 'hikari', '二年目の海', 'The Sea, Second Year', '同じ船のまま', 'Still the Same Boat'),
  ...pair(CharacterId.REI, 'rei', '観測された値', 'The Value, Observed', '星図の余白', 'The Margin of the Chart'),
  ...pair(CharacterId.SORA, 'sora', 'ゴールの向こう', 'Past the Hoop', 'もう五センチ', 'Five More Centimetres'),
  ...pair(CharacterId.MIYUKI, 'miyuki', '名前で呼んで', 'Call Me by My Name', '緊急連絡先', 'Emergency Contact'),
  // 奈绪是唯一的例外：她开局親密度就是 215，親密度 Lv.5 那一级永远跨不过去，
  // 所以她的第③段挂好感度 Lv.5，分岔改看親密度 240。
  ...pair(CharacterId.NAO, 'nao', '十年分の距離', 'Ten Years of Distance', '新しいノート', 'The New Notebook'),
  ...pair(CharacterId.MAKI, 'maki', '一位に二人', 'Two Names in First', '空いた二枠', 'Two Blank Spaces'),
  ...pair(CharacterId.INARI, 'inari', '一日目', 'Day One', '鉛筆の一行', 'One Line in Pencil')
];

export const isEndingUnlocked = (e: EndingDef, flags: StoryFlags): boolean => !!flags[e.flag];

export const endingsFor = (char: CharacterId): EndingDef[] => ENDINGS.filter(e => e.char === char);

export const unlockedCount = (flags: StoryFlags): number =>
  ENDINGS.filter(e => isEndingUnlocked(e, flags)).length;

// 「这个人算通关了吗」= 两条里至少走到过一条。
export const isRouteCleared = (char: CharacterId, flags: StoryFlags): boolean =>
  endingsFor(char).some(e => isEndingUnlocked(e, flags));

export const clearedRouteCount = (flags: StoryFlags): number => {
  const chars = Array.from(new Set(ENDINGS.map(e => e.char)));
  return chars.filter(c => isRouteCleared(c, flags)).length;
};

export const TOTAL_ENDINGS = ENDINGS.length;
export const TOTAL_ROUTES = Array.from(new Set(ENDINGS.map(e => e.char))).length;

// 第③段（也就是结局那一段）是怎么触发的。UI 直接读这张表，
// 免得说明写死在组件里、改了规则忘了改文案。
export interface EndingGateInfo {
  triggerAxis: 'familiarity' | 'affection';
  triggerValue: number;
  splitAxis: 'familiarity' | 'affection';
  splitValue: number;
}

export const endingGateFor = (char: CharacterId): EndingGateInfo =>
  char === CharacterId.NAO
    ? { triggerAxis: 'affection', triggerValue: 220, splitAxis: 'familiarity', splitValue: 240 }
    : { triggerAxis: 'familiarity', triggerValue: 210, splitAxis: 'affection', splitValue: 200 };
