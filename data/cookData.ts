import { RecipeDef, LifeState } from '../types';
import { findFish } from './lifeData';

// ---------------------------------------------------------
// 🍳 料理
//
// 这个系统刻意**不产出新的资源**，它是种植和钓鱼的出口：
// 材料只能来自自己种的菜和自己钓的鱼，做出来的东西也不卖钱，只吃。
// 吃掉给属性——而这个游戏没有战斗，属性就是推进对话选项的唯一货币，
// 所以"做饭"是真的能让你打开某个选项的，不是装饰。
//
// 【为什么值得做，而不是直接把菜卖了】
//   一份樱桃萝卜卖 90 日元。
//   同样两份做成沙拉，吃掉给 体贴+2 魅力+1。
// 钱能再赚，属性只能靠这种事一点点攒。所以到了中期，
// 玩家会自己开始舍不得卖菜——这正是想要的。
//
// 菜单全部是日本家庭真的会做的东西，而且尽量落在关西：
// 章鱼烧、明石鲷饭、竹荚鱼南蛮渍。每道菜挂一个生词。
// ---------------------------------------------------------

export const RECIPES: RecipeDef[] = [
  {
    id: 'dish_misoshiru',
    // 第一天晚上有人站在你厨房里教过你这一样。day1_done 是给老存档留的门：
    // 那些人已经过完第一天了，只是当时还没有这段剧情。
    learn: {
      flags: ['cook_tutorial_done', 'day1_done'],
      hintZh: '有人得先站在你的厨房里，把味噌化开给你看一次。',
      hintEn: 'Somebody has to stand in your kitchen and show you how the miso goes in.'
    },
    nameJp: '味噌汁', reading: 'みそしる', nameZh: '味噌汤', nameEn: 'Miso Soup',
    needs: [{ itemId: 'crop_negi', n: 1 }],
    effects: [{ stat: 'kindness', amount: 2, reasonZh: '锅里冒起来的那点热气', reasonEn: 'The steam coming off the pot' }],
    emoji: '🍲',
    descZh: '撒一把自己种的葱。日本人一天里最不需要理由的一碗东西。',
    descEn: 'A handful of your own spring onion on top. The one bowl a Japanese day never needs a reason for.',
    word: { jp: '味噌', reading: 'みそ', zh: '味噌', en: 'miso' }
  },
  {
    id: 'dish_salad',
    nameJp: 'サラダ', reading: 'サラダ', nameZh: '沙拉', nameEn: 'Salad',
    needs: [{ itemId: 'crop_radish', n: 2 }, { itemId: 'crop_basil', n: 1 }],
    effects: [
      { stat: 'kindness', amount: 2, reasonZh: '你把萝卜切成了很薄的片', reasonEn: 'You cut the radish into very thin slices' },
      { stat: 'charm', amount: 1, reasonZh: '摆盘这件事你居然认真了', reasonEn: 'You found yourself caring how it looked on the plate' }
    ],
    emoji: '🥗',
    descZh: '樱桃萝卜切薄片几近透光，新鲜罗勒撕碎撒上，点缀橄榄油与黑胡椒。清爽快手，三两下便大功告成。',
    descEn: 'Thin-sliced radish that lets the light through, torn basil tossed over. Done in moments, crisp and bright.',
    word: { jp: '薄い', reading: 'うすい', zh: '薄的', en: 'thin' }
  },
  {
    id: 'dish_ooba_tempura',
    learn: { flags: ['inari_story_1_done'], hintZh: '有人在神社后面指给你看过那几片叶子。', hintEn: 'Somebody pointed those leaves out to you behind a shrine.' },
    nameJp: '大葉の天ぷら', reading: 'おおばのてんぷら', nameZh: '紫苏天妇罗', nameEn: 'Shiso Tempura',
    needs: [{ itemId: 'crop_shiso', n: 2 }],
    effects: [
      { stat: 'proficiency', amount: 3, reasonZh: '油温这件事没有人能教你，只能自己烫一次', reasonEn: 'Nobody can teach you oil temperature; you have to get it wrong once' }
    ],
    emoji: '🍤',
    descZh: '只裹一面。裹两面就不透光了，那样就白种了。',
    descEn: 'Batter one side only. Coat both and the leaf stops letting the light through, which defeats the point of growing it.',
    word: { jp: '揚げる', reading: 'あげる', zh: '油炸', en: 'to deep-fry' }
  },
  {
    id: 'dish_pasta',
    learn: { flags: ['hikari_story_1_done'], hintZh: '要有人先让你相信「随便做做就行」。', hintEn: 'Somebody has to talk you into just throwing it together first.' },
    nameJp: 'トマトパスタ', reading: 'トマトパスタ', nameZh: '番茄意面', nameEn: 'Tomato Pasta',
    needs: [{ itemId: 'crop_tomato', n: 2 }, { itemId: 'crop_basil', n: 1 }],
    effects: [
      { stat: 'charm', amount: 3, reasonZh: '你现在会做一道能端给别人的菜了', reasonEn: 'You can now make one thing you would put in front of another person' },
      { stat: 'kindness', amount: 1, reasonZh: '你多煮了一人份，虽然没人来', reasonEn: 'You cooked for two. Nobody came' }
    ],
    emoji: '🍝',
    descZh: '小番茄整颗下锅，用铲背压破。神户的洋馆区里到处是教人这么做的老太太。',
    descEn: 'The tomatoes go in whole and get crushed with the back of the spoon. The Western quarter is full of old ladies who will teach you this.',
    word: { jp: '潰す', reading: 'つぶす', zh: '压碎', en: 'to crush' }
  },
  {
    id: 'dish_yakizakana',
    nameJp: '焼き魚', reading: 'やきざかな', nameZh: '烤鱼', nameEn: 'Grilled Fish',
    anyFish: 1,
    needs: [{ itemId: 'crop_shiso', n: 1 }],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '你学会了看鱼皮什么时候该翻面', reasonEn: 'You learned to read the skin for when to turn it' },
      { stat: 'guts', amount: 1, reasonZh: '你自己处理了那条鱼', reasonEn: 'You gutted it yourself' }
    ],
    emoji: '🐠',
    descZh: '粗盐腌制逼出多余水分，轻拭吸干，慢火烤至表皮焦脆泛起金黄。看似质朴无华，实则是日本料理中最考究火候的试金石。',
    descEn: 'Coarse salt draws out excess moisture, patted dry, then grilled slow until the skin blisters crisp and golden. Deceptively humble, yet the ultimate test of patience in Japanese cuisine.',
    word: { jp: '塩', reading: 'しお', zh: '盐', en: 'salt' }
  },
  {
    id: 'dish_nanban',
    learn: { flags: ['rei_story_1_done'], books: ['book_kansai'], hintZh: '南蛮是哪来的、为什么要泡醋——先得有人跟你讲清楚。', hintEn: 'Where nanban came from and why it sits in vinegar: somebody has to explain that first.' },
    nameJp: 'アジの南蛮漬け', reading: 'アジのなんばんづけ', nameZh: '竹荚鱼南蛮渍', nameEn: 'Nanban-Pickled Horse Mackerel',
    needFish: [{ fishId: 'fish_aji', n: 2 }],
    needs: [{ itemId: 'crop_negi', n: 1 }],
    effects: [
      { stat: 'proficiency', amount: 2, reasonZh: '炸完趁热泡进醋里，时机只有一次', reasonEn: 'Into the vinegar while still hot; you get one shot at the timing' },
      { stat: 'knowledge', amount: 2, reasonZh: '「南蛮」这个词的来历你查了一下', reasonEn: 'You looked up where the word nanban comes from' }
    ],
    emoji: '🍛',
    descZh: '「南蛮」原本指从南边来的葡萄牙人——这道菜是十六世纪从他们那儿学来的。',
    descEn: 'Nanban meant the Portuguese, who came from the south. The dish was learned from them in the sixteenth century.',
    word: { jp: '酢', reading: 'す', zh: '醋', en: 'vinegar' }
  },
  {
    id: 'dish_takoyaki',
    learn: { flags: ['nao_story_1_done'], books: ['book_kansai'], hintZh: '这边人人都会。所以没有人会想到要教你。', hintEn: 'Everyone here can do it, which is exactly why nobody thinks to teach you.' },
    nameJp: 'たこ焼き', reading: 'たこやき', nameZh: '章鱼烧', nameEn: 'Takoyaki',
    needFish: [{ fishId: 'fish_tako', n: 1 }],
    needs: [{ itemId: 'crop_negi', n: 1 }],
    effects: [
      { stat: 'charm', amount: 3, reasonZh: '会做这个在关西是一种社交货币', reasonEn: 'Being able to make this is social currency in Kansai' },
      { stat: 'proficiency', amount: 2, reasonZh: '翻面用锥子，手腕的事', reasonEn: 'You turn them with a pick. It is all in the wrist' }
    ],
    emoji: '🐙',
    descZh: '关西家庭真的家家有一台たこ焼き器。会不会翻，是能不能融入这边的隐形考试。',
    descEn: 'Kansai households genuinely all own the pan. Whether you can turn them is the unspoken test of whether you belong here.',
    word: { jp: '返す', reading: 'かえす', zh: '翻面', en: 'to turn over' }
  },
  {
    id: 'dish_taimeshi',
    learn: { flags: ['miyuki_story_2_done'], books: ['book_sakana'], hintZh: '整条鱼下锅这件事，得有人在旁边看着你做一次。', hintEn: 'Putting a whole fish in the pot is something somebody has to stand next to you for, once.' },
    nameJp: '鯛めし', reading: 'たいめし', nameZh: '鲷鱼饭', nameEn: 'Sea Bream Rice',
    needFish: [{ fishId: 'fish_madai', n: 1 }],
    needs: [{ itemId: 'crop_shiso', n: 1 }],
    effects: [
      { stat: 'proficiency', amount: 4, reasonZh: '整条鱼铺在米上一起煮，火候没有第二次机会', reasonEn: 'The whole fish cooks on top of the rice. There is no second attempt at the heat' },
      { stat: 'knowledge', amount: 2, reasonZh: '你查了为什么喜事上一定要有鲷', reasonEn: 'You looked up why a celebration must have bream on it' },
      { stat: 'charm', amount: 2, reasonZh: '你端出来的时候自己也愣了一下', reasonEn: 'You surprised yourself when you lifted the lid' }
    ],
    emoji: '🍚',
    descZh: '明石鲷整条铺在米上，一锅煮成。掀盖那一下是这道菜的全部意义。',
    descEn: 'A whole Akashi bream laid on the rice and cooked in one pot. Lifting the lid is the entire point of the dish.',
    word: { jp: '炊く', reading: 'たく', zh: '煮（饭）', en: 'to cook (rice)' }
  },
  {
    id: 'dish_bento',
    learn: { flags: ['miyuki_story_1_done'], hintZh: '格子怎么塞满，是有人教的，不是自己悟的。', hintEn: 'How to pack the gaps is taught, not worked out.' },
    nameJp: 'お弁当', reading: 'おべんとう', nameZh: '便当', nameEn: 'Bento',
    needs: [
      { itemId: 'crop_tomato', n: 1 },
      { itemId: 'crop_radish', n: 1 },
      { itemId: 'crop_negi', n: 1 }
    ],
    effects: [
      { stat: 'kindness', amount: 4, reasonZh: '你做的时候一直在想别人爱不爱吃', reasonEn: 'The whole time you were thinking about whether someone else would like it' },
      { stat: 'charm', amount: 1, reasonZh: '你在角落塞了一朵万寿菊', reasonEn: 'You wedged a marigold into the corner' }
    ],
    emoji: '🍱',
    descZh: '格子要塞满，不然路上会翻。这一条是日本便当的第一原则，也是唯一一条硬规矩。',
    descEn: 'Pack every gap or it turns over on the way. That is the first principle of a Japanese lunchbox and the only hard rule.',
    word: { jp: '詰める', reading: 'つめる', zh: '装满、塞进', en: 'to pack in' }
  },
  {
    id: 'dish_himawari_seeds',
    learn: { flags: ['maki_story_1_done'], books: ['book_sakana'], hintZh: '把一朵花拆掉这种事，你需要一个理由。', hintEn: 'Taking a flower apart is something you need a reason for.' },
    nameJp: '炒りひまわりの種', reading: 'いりひまわりのたね', nameZh: '炒葵花籽', nameEn: 'Roasted Sunflower Seeds',
    needs: [{ itemId: 'crop_himawari', n: 1 }],
    effects: [
      { stat: 'guts', amount: 2, reasonZh: '你把整整一朵花拆成了一把种子', reasonEn: 'You took an entire flower apart into a handful of seeds' },
      { stat: 'knowledge', amount: 1, reasonZh: '你数了一下，放弃了', reasonEn: 'You started counting them, and stopped' }
    ],
    emoji: '🌻',
    descZh: '养了七天的那一朵。你犹豫了很久才动手。',
    descEn: 'The one you spent seven days on. You hesitated for a long time before starting.',
    word: { jp: '炒る', reading: 'いる', zh: '干炒', en: 'to roast in a dry pan' }
  }
];

// ==========================================================
// 📖 料理本
//
// 菜谱一开始只会三样：味噌汤、沙拉、烤鱼。剩下的要么有人教，
// 要么自己去买本书。**两条路都通**——不然不走某个人的线，
// 厨房就永远缺一半。
//
// 书放在百均卖。九百日元一本，比一包种子贵得多，
// 所以前期买书是一个真的要犹豫一下的决定。
// ==========================================================
export interface RecipeBook {
  id: string;
  emoji: string;
  nameJp: string; reading: string; nameZh: string; nameEn: string;
  price: number;
  descZh: string; descEn: string;
}

export const RECIPE_BOOKS: RecipeBook[] = [
  {
    id: 'book_kansai', emoji: '📕',
    nameJp: '関西のおかず', reading: 'かんさいのおかず',
    nameZh: '关西家常菜', nameEn: 'Kansai Home Cooking',
    price: 900,
    descZh: '封面上那家人笑得过头了。里面的字很小，图很少，但配方是对的。',
    descEn: 'The family on the cover are smiling too hard. Small print, few pictures, correct recipes.'
  },
  {
    id: 'book_sakana', emoji: '📘',
    nameJp: 'さかなの本', reading: 'さかなのほん',
    nameZh: '鱼的书', nameEn: 'The Fish Book',
    price: 1400,
    descZh: '前一半在讲怎么把鱼杀干净，后一半才开始做菜。翻的时候要有心理准备。',
    descEn: 'The first half is about killing the fish cleanly. The cooking starts halfway through. Brace yourself.'
  }
];

export const findBook = (id: string) => RECIPE_BOOKS.find(b => b.id === id);

// 这道菜你会不会做。没写 learn 的一律会。
export const recipeKnown = (
  r: RecipeDef, life: LifeState, flags: Record<string, boolean>
): boolean => {
  if (!r.learn) return true;
  if (r.learn.flags?.some(f => flags[f])) return true;
  if (r.learn.books?.some(b => (life.items[b] || 0) > 0)) return true;
  return false;
};

export const findRecipe = (id: string) => RECIPES.find(r => r.id === id);

// 背包里的鱼是 "catch|鱼id|厘米"，做菜时要按种类数。
export const fishCounts = (items: Record<string, number>) => {
  const byId: Record<string, number> = {};
  let total = 0;
  for (const [k, n] of Object.entries(items)) {
    if (!k.startsWith('catch|') || n <= 0) continue;
    const id = k.split('|')[1];
    byId[id] = (byId[id] || 0) + n;
    total += n;
  }
  return { byId, total };
};

export const canCook = (r: RecipeDef, life: LifeState): boolean => {
  for (const need of r.needs || []) {
    if ((life.items[need.itemId] || 0) < need.n) return false;
  }
  const fc = fishCounts(life.items);
  for (const nf of r.needFish || []) {
    if ((fc.byId[nf.fishId] || 0) < nf.n) return false;
  }
  if (r.anyFish) {
    // 指定鱼已经占掉的那部分要先扣掉，否则同一条鱼会被算两次
    const reserved = (r.needFish || []).reduce((s, x) => s + x.n, 0);
    if (fc.total - reserved < r.anyFish) return false;
  }
  return true;
};

// 扣材料。鱼优先扣小的——大的留着卖钱，这是玩家默认想要的。
export const consumeFor = (r: RecipeDef, life: LifeState): LifeState => {
  const items = { ...life.items };
  for (const need of r.needs || []) {
    items[need.itemId] = (items[need.itemId] || 0) - need.n;
    if (items[need.itemId] <= 0) delete items[need.itemId];
  }
  const takeFish = (pred: (id: string) => boolean, count: number) => {
    const keys = Object.keys(items)
      .filter(k => k.startsWith('catch|') && items[k] > 0 && pred(k.split('|')[1]))
      .sort((a, b) => Number(a.split('|')[2]) - Number(b.split('|')[2]));
    let left = count;
    for (const k of keys) {
      while (left > 0 && items[k] > 0) { items[k]--; left--; }
      if (items[k] <= 0) delete items[k];
      if (left === 0) break;
    }
  };
  for (const nf of r.needFish || []) takeFish(id => id === nf.fishId, nf.n);
  if (r.anyFish) takeFish(() => true, r.anyFish);
  return { ...life, items };
};
