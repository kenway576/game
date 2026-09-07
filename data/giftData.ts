import { CharacterId, LifeState, StoryFlags } from '../types';
import { resolveItem, ResolvedItem, buildInventory } from './itemCatalog';
import { findRecipe } from './cookData';

// ==========================================================
// 🎁 送东西
//
// 这个游戏里所有的好感度都来自"说对了一句话"。可现实里最笨也最有效的
// 那一招——把一样东西递过去——一直不存在。你钓上来的鲷、阳台上第一茬葱、
// 昨晚做的那盒便当，只能自己吃掉或者卖钱。
//
// 【怎么定价】
// 不按稀有度表，按**这件东西花了你多少**：
//   · 自己钓的、自己种的 → 你为它花过时间
//   · 自己做的菜         → 时间 + 材料 + 会不会做
//   · 买来的             → 只花了钱，所以最便宜
// 一条三千日元的鲷比一件三千日元的商品值钱，就是这个道理。
//
// 【为什么还要分人】
// 同一样东西送给不同的人不该是同一个数。空喜欢甜的，铃对书有反应，
// 稻荷只认从土里长出来的东西。这几行偏好比任何数值曲线都更像"认识一个人"。
// 不匹配也不扣分——递过去这件事本身是有分量的，只是没有说到心坎上。
// ==========================================================

export interface GiftVerdict {
  familiarity: number;
  affection: number;
  // 这一次送得怎么样。UI 拿它决定说哪句话。
  band: 'perfect' | 'good' | 'ok';
  reasonZh: string;
  reasonEn: string;
  lineZh: string;
  lineEn: string;
}

// 每个人吃哪一套。键是"这件东西是什么"的粗分类。
type Taste = 'fish' | 'crop' | 'dish' | 'sweet' | 'book' | 'gear' | 'goods';

const LIKES: Record<string, { loves: Taste[]; lineZh: string; lineEn: string }> = {
  [CharacterId.ASUKA]: {
    loves: ['book', 'dish'],
    lineZh: '「……这个是你自己做的？」她把它举到眼前看了一会儿，才想起来说谢谢。',
    lineEn: '"...You made this yourself?" She holds it up and looks at it for a while before remembering to say thank you.'
  },
  [CharacterId.HIKARI]: {
    loves: ['sweet', 'dish'],
    lineZh: '她当场就打开了。「え、今食べていい？」问完没等你回答就已经在吃了。',
    lineEn: 'She opens it on the spot. "Can I eat it now?" — and is eating it before you answer.'
  },
  [CharacterId.REI]: {
    loves: ['book', 'fish'],
    lineZh: '她把它接过去，转了半圈，从另一个角度又看了一遍。「……構造がいい。」',
    lineEn: 'She takes it, turns it half around and looks again from the other side. "...Good structure."'
  },
  [CharacterId.INARI]: {
    loves: ['crop', 'fish', 'dish'],
    lineZh: '「土から出たものか。」她说这句话的时候语气变了，变得不太像刚才那个人。',
    lineEn: '"Out of the ground, then." Her voice changes on that line, into something not quite the voice from a moment ago.'
  },
  [CharacterId.MIYUKI]: {
    loves: ['dish', 'crop'],
    lineZh: '「あら」她说，然后立刻开始担心你是不是自己没留一份。',
    lineEn: '"Oh my." Then she immediately starts worrying about whether you kept any for yourself.'
  },
  [CharacterId.SORA]: {
    loves: ['sweet', 'gear'],
    lineZh: '她双手接过去，很郑重，郑重得跟接一个奖杯一样。',
    lineEn: 'She takes it in both hands, with a formality more appropriate to receiving a trophy.'
  },
  [CharacterId.NAO]: {
    loves: ['dish', 'crop'],
    lineZh: '「……あんたが作ったん？」她盯着看了三秒，然后说了句「まあ、食べたるわ」。',
    lineEn: '"...You made this?" She stares at it, then says she supposes she will eat it, then.'
  },
  [CharacterId.MAKI]: {
    loves: ['sweet', 'goods'],
    lineZh: '「へえ。」她拿走了，语气很淡，但拿走的动作一点都不淡。',
    lineEn: '"Huh." She takes it. The tone is flat. The speed of the hand is not.'
  }
};

const NEUTRAL_ZH = '她说了谢谢，把它收好了。收的动作比说的那句话认真。';
const NEUTRAL_EN = 'She says thank you and puts it away. The putting-away is more sincere than the words.';

// 这件东西属于哪一类
export const tasteOf = (key: string): Taste => {
  if (key.startsWith('catch|')) return 'fish';
  if (key.startsWith('dish|')) return 'dish';
  if (key.startsWith('crop_')) return 'crop';
  if (key.startsWith('seed_')) return 'crop';
  if (key.startsWith('book_')) return 'book';
  if (key.startsWith('rod_') || key === 'item_bait' || key === 'item_pot') return 'gear';
  if (/sweet|choco|cake|pudding|candy|snack/.test(key)) return 'sweet';
  return 'goods';
};

// 送出去值多少。基数来自"你为它花了什么"，不是标价。
const baseFor = (key: string, item: ResolvedItem | null): number => {
  if (key.startsWith('dish|')) {
    const r = findRecipe(key.split('|')[1]);
    // 一道菜的分量看它自己给多少属性——难做的菜给得多
    const weight = r ? r.effects.reduce((s, e) => s + Math.abs(e.amount), 0) : 3;
    return 10 + weight * 2;
  }
  if (key.startsWith('catch|')) {
    // 鱼按大小。三十厘米的竹荚鱼和一条小杂鱼不是一回事。
    const cm = Number(key.split('|')[2]) || 0;
    return 6 + Math.min(14, Math.round(cm / 3));
  }
  if (key.startsWith('crop_')) return 8;
  if (key.startsWith('seed_')) return 3;
  const worth = item?.worth ?? 0;
  // 买来的东西：钱只折算一小部分，而且封顶。
  return 2 + Math.min(8, Math.round(worth / 400));
};

export const giftVerdict = (
  key: string, char: CharacterId, life: LifeState
): GiftVerdict => {
  const item = resolveItem(key);
  const base = baseFor(key, item);
  const taste = tasteOf(key);
  const like = LIKES[char];
  const loved = !!like?.loves.includes(taste);
  const homemade = key.startsWith('dish|') || key.startsWith('crop_') || key.startsWith('catch|');

  // ⚖️ 送礼是**每天都能做**的动作，剧情选项是一次性的。
  // 第一版按剧情选项的量给（自己做的菜 +14），而剧本里单次好感的中位数是 6、
  // 九成落在 16 以下——也就是说递一盒味噌汤，抵得上一场戏的高光选项，
  // 而且第二天还能再来一次。八个人一起算，一天能刷出一百多点。
  // 所以整体压到剧情的三分之一上下：送对东西大约 +5，随手买的 +2。
  const affection = Math.max(1, Math.round(base * (loved ? 0.36 : 0.18)));
  const familiarity = Math.max(1, Math.round(base * 0.16));
  const band: GiftVerdict['band'] = loved && homemade ? 'perfect' : loved ? 'good' : 'ok';

  const name = item?.nameZh ?? '东西';
  const nameEn = item?.nameEn ?? 'something';
  return {
    familiarity, affection, band,
    reasonZh: homemade ? `你把${name}递了过去，那是你自己弄来的` : `你把${name}递了过去`,
    reasonEn: homemade ? `You handed over the ${nameEn.toLowerCase()}, and you got it yourself` : `You handed over the ${nameEn.toLowerCase()}`,
    lineZh: band === 'ok' ? NEUTRAL_ZH : (like?.lineZh ?? NEUTRAL_ZH),
    lineEn: band === 'ok' ? NEUTRAL_EN : (like?.lineEn ?? NEUTRAL_EN)
  };
};

// 能拿去送人的东西。纪念品和还在用的家伙事不算——
// 外公的手账不是礼物，鱼竿送出去你自己就钓不了了。
export const giftableRows = (life: LifeState, flags: StoryFlags) =>
  buildInventory(life, flags).filter(r =>
    r.item.kind !== 'keepsake'
    && !r.item.key.startsWith('rod_')
    && r.item.key !== 'item_pot'
  );
