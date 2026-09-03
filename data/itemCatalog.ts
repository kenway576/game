import { StoryWord, StoryFlags, LifeState } from '../types';
import { SEEDS, FISH, RODS, POT_ITEM, BAIT_ITEM, fishValue } from './lifeData';

// ---------------------------------------------------------
// 🎒 手上有什么 —— 一个统一的物品解释器
//
// life.items 的 key 是好几种格式混在一起长出来的：
//   seed_basil            种子，查 SEEDS.id
//   crop_basil            收获物，查 SEEDS.cropId
//   catch|aji|21          钓上来的鱼，竖线后面是鱼种和厘米数
//   item_bait / item_pot  道具
// 以前每个界面（店、厨房、钓场）各自认得自己那几种，
// 谁也说不出"全部"是什么。要做一个能随时打开的物品栏，
// 就必须先有一个地方能把任意一个 key 翻译成一件看得懂的东西。
//
// 【纪念品为什么也在这儿】
// 玩家问的是"我都有什么个人物品"，他心里那份清单里一定有学生证和
// 外公的手账——那是这个游戏里最像"我的东西"的两样。它们不在
// life.items 里（不消耗、不叠加、由剧情 flag 决定有没有），
// 但清单上少了它们，这个界面就答非所问了。
// ---------------------------------------------------------

export type ItemKind = 'keepsake' | 'crop' | 'fish' | 'seed' | 'gear';

export interface ResolvedItem {
  key: string;
  kind: ItemKind;
  iconId?: string;        // /images/items/<iconId>.webp
  emoji: string;
  nameZh: string; nameEn: string; nameJp: string; reading: string;
  descZh: string; descEn: string;
  subZh?: string; subEn?: string;   // 副标题：尺寸、产地之类
  worth?: number;                   // 卖得掉的东西标个价
  word?: StoryWord;
  image?: string;                   // 有大图的（学生证）点开能看
}

const seedById = (id: string) => SEEDS.find(s => s.id === id);
const seedByCrop = (id: string) => SEEDS.find(s => s.cropId === id);

export const resolveItem = (key: string): ResolvedItem | null => {
  // 鱼：catch|<鱼种>|<厘米>
  if (key.startsWith('catch|')) {
    const [, fishId, cmRaw] = key.split('|');
    const f = FISH.find(x => x.id === fishId);
    if (!f) return null;
    const cm = Number(cmRaw) || 0;
    return {
      key, kind: 'fish', iconId: f.id, emoji: f.emoji,
      nameZh: f.nameZh, nameEn: f.nameEn, nameJp: f.nameJp, reading: f.reading,
      descZh: f.noteZh, descEn: f.noteEn,
      subZh: `${cm} 厘米`, subEn: `${cm} cm`,
      worth: fishValue(f, cm),
      word: f.word
    };
  }

  const seed = seedById(key);
  if (seed) {
    return {
      key, kind: 'seed', iconId: seed.id, emoji: seed.emoji,
      nameZh: seed.nameZh, nameEn: seed.nameEn, nameJp: seed.nameJp, reading: seed.reading,
      descZh: seed.descZh, descEn: seed.descEn,
      word: seed.word
    };
  }

  const crop = seedByCrop(key);
  if (crop) {
    return {
      key, kind: 'crop', iconId: crop.cropId, emoji: crop.cropEmoji,
      nameZh: crop.cropNameZh, nameEn: crop.cropNameEn,
      nameJp: crop.nameJp.replace(/の種$/, ''), reading: crop.reading.replace(/のたね$/, ''),
      descZh: '你自己种出来的。阳台上那几个花盆现在是这间屋子里最有生活气的地方。',
      descEn: 'You grew this. Those few pots on the balcony are the most lived-in thing in the flat now.',
      worth: crop.sellPrice
    };
  }

  const rod = RODS.find(r => r.id === key);
  if (rod) {
    return {
      key, kind: 'gear', iconId: rod.id, emoji: '🎣',
      nameZh: rod.nameZh, nameEn: rod.nameEn, nameJp: rod.nameJp, reading: rod.reading,
      descZh: rod.descZh, descEn: rod.descEn
    };
  }

  if (key === BAIT_ITEM) {
    return {
      key, kind: 'gear', iconId: BAIT_ITEM, emoji: '🪱',
      nameZh: '鱼饵', nameEn: 'Bait', nameJp: '餌', reading: 'えさ',
      descZh: '渔具店按盒卖。盒子上画着一条笑得很开心的鱼，你一直觉得这个设计有问题。',
      descEn: 'The tackle shop sells it by the box. There is a very cheerful fish on the lid, which you have always felt was a design mistake.',
      word: { jp: '餌', reading: 'えさ', zh: '饵', en: 'bait' }
    };
  }

  if (key === POT_ITEM) {
    return {
      key, kind: 'gear', iconId: POT_ITEM, emoji: '🪴',
      nameZh: '花盆', nameEn: 'Plant Pot', nameJp: '植木鉢', reading: 'うえきばち',
      descZh: '素烧的，底下有个洞。百元店标价 550 日元——老板娘对此毫无解释的意思。',
      descEn: 'Unglazed, with a hole in the bottom. Marked 550 yen in the hundred-yen shop, a fact the owner declines to explain.',
      word: { jp: '鉢', reading: 'はち', zh: '盆', en: 'pot' }
    };
  }

  return null;
};

// ---------------------------------------------------------
// 🕯 纪念品：不消耗、不叠加，有没有只看剧情 flag。
// 顺序就是清单上的顺序，从最早拿到的排起。
// ---------------------------------------------------------
export interface Keepsake extends ResolvedItem {
  requiresFlag?: string;
}

export const KEEPSAKES: Keepsake[] = [
  {
    key: 'keepsake_map', kind: 'keepsake', emoji: '🗺',
    nameZh: '外公的神户地图', nameEn: "Grandfather's Kobe Map",
    nameJp: '祖父の神戸地図', reading: 'そふのこうべちず',
    descZh: '一张折了太多次的旧地图，折痕处已经起毛。上面有几个地方被圈了出来，笔迹是外公的，但没有写任何说明。你把它钉在软木板正中间。',
    descEn: 'An old map folded too many times, furred along the creases. A few places are circled in your grandfather’s hand, with nothing written to say why. You pinned it dead centre on the corkboard.',
    subZh: '钉在软木板上', subEn: 'Pinned to the corkboard'
  },
  {
    key: 'keepsake_journal', kind: 'keepsake', emoji: '🕯',
    nameZh: '外公的手账', nameEn: "Grandfather's Journal",
    nameJp: '祖父の手帳', reading: 'そふのてちょう',
    descZh: '皮面已经软了，橡皮筋松得箍不住。写的是日语，字很小很密。你读得不快，但每天都读一点。',
    descEn: 'The leather has gone soft and the elastic no longer holds it shut. It is written in Japanese, small and dense. You are slow at it, but you read a little every day.',
    subZh: '每天读一点', subEn: 'A little every day',
    requiresFlag: 'prologue_read_journal_deep',
    word: { jp: '手帳', reading: 'てちょう', zh: '手账、记事本', en: 'notebook / journal' }
  },
  {
    key: 'keepsake_student_id', kind: 'keepsake', emoji: '🎫',
    nameZh: '学生证', nameEn: 'Student ID',
    nameJp: '学生証', reading: 'がくせいしょう',
    descZh: '塑封卡片，边角还是新的。照片上的自己表情很僵——拍的时候摄影师说了句「もっと自然に」，结果适得其反。',
    descEn: 'Laminated, the corners still sharp. The face in the photo is very stiff: the photographer told you to relax, which had the opposite effect.',
    subZh: '兵库县立港见高等学校', subEn: 'Minatomi Senior High School',
    requiresFlag: 'day1_got_student_id',
    image: '/images/ui/student_id.webp',
    word: { jp: '学生証', reading: 'がくせいしょう', zh: '学生证', en: 'student ID' }
  },
  {
    key: 'keepsake_jersey', kind: 'keepsake', emoji: '🏀',
    nameZh: '24 号球衣', nameEn: 'The Number 24 Jersey',
    nameJp: '二十四番のユニフォーム', reading: 'にじゅうよんばんのユニフォーム',
    descZh: '紫金配色，背后一个大大的 24。来这儿的路上，你用它裹着外公的手账防止磕坏。空看见它的时候笑得蹲了下去——在神户穿这个，确实赖皮。',
    descEn: 'Purple and gold, a very large 24 on the back. On the way over you used it to wrap your grandfather’s journal so it would not get knocked about. When Sora saw it she folded up laughing: wearing that in this city really is cheating.',
    subZh: '行李箱最上层', subEn: 'Top of the suitcase',
    requiresFlag: 'day1_sora_mamba'
  }
];

export const ownedKeepsakes = (flags: StoryFlags): Keepsake[] =>
  KEEPSAKES.filter(k => !k.requiresFlag || flags[k.requiresFlag]);

// 物品栏里一行代表一格：解释好的东西 + 有几个
export interface InventoryRow { item: ResolvedItem; n: number }

export const buildInventory = (life: LifeState, flags: StoryFlags): InventoryRow[] => {
  const rows: InventoryRow[] = ownedKeepsakes(flags).map(k => ({ item: k, n: 1 }));
  // 手上那根竿子算随身装备，即使它不在 items 里
  const rod = life.rodId ? resolveItem(life.rodId) : null;
  if (rod) rows.push({ item: rod, n: 1 });
  for (const [key, n] of Object.entries(life.items)) {
    if (n <= 0) continue;
    const item = resolveItem(key);
    // 认不出来的 key 直接跳过而不是画个问号：能走到这儿说明是我漏了一种格式，
    // 界面上多一个"？？？"只会让玩家以为自己捡到了什么隐藏道具。
    if (item) rows.push({ item, n });
  }
  return rows;
};

export const KIND_ORDER: ItemKind[] = ['keepsake', 'fish', 'crop', 'seed', 'gear'];

export const KIND_LABELS: Record<ItemKind, { zh: string; en: string; jp: string }> = {
  keepsake: { zh: '重要物品', en: 'Keepsakes', jp: '大切なもの' },
  fish:     { zh: '钓获',     en: 'Catch',     jp: '釣果' },
  crop:     { zh: '收获',     en: 'Harvest',   jp: '収穫' },
  seed:     { zh: '种子',     en: 'Seeds',     jp: '種' },
  gear:     { zh: '道具',     en: 'Gear',      jp: '道具' }
};
