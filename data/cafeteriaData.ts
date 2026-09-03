import { GameCalendar, StoryEffect, StoryWord } from '../types';

// ---------------------------------------------------------
// 🍜 学生食堂
//
// 背景图上的菜单牌本来就写着价钱——日替わり定食 680 円、きつねうどん 450 円。
// 这份菜单照着那块牌子写，玩家抬头看见的和点单看见的是同一份。
//
// 【为什么要有"卖光"这回事】
// 食堂不是便利店。便利店永远有货，去不去只是花不花钱；
// 食堂的库存是有限的，好吃的先被抢光——"今天还有没有炸鸡"这件事
// 才是食堂真正的样子，也是"放学后先去哪儿"这个选择的一部分。
//
// 【"去晚了"是怎么发生的】
// 玩家能出门的只有放学后那两格，也就是说他**每次到食堂都已经过了午休**。
// 所以基准状态就是"高峰过去了"：炸鸡和日替わり定食大多数日子已经没了，
// 只有偶尔——有人请假、阿姨多做了一份——才轮得到你。
// 那种日子的惊喜（"今天居然还有炸鸡"）比天天有值钱得多。
// 要是在午休之后又先拐去了别处（只剩一格时间），那连这点机会都没有。
//
// 卖光刻意做成**可预测但不固定**：按当天日期算，同一天重开结果一样，
// 换一天就变。全随机玩家学不会规律，只会觉得游戏在耍他；
// 全固定的话第二天就没人再看一眼菜单了。
//
// 【吃的东西给什么】
// 属性。这个游戏没有战斗，属性就是推进对话选项的唯一货币。
// 但食堂给得很少（1 点），因为它便宜、天天有、不需要任何准备——
// 真正划算的是自己种菜自己做饭那条线。食堂是保底，不是捷径。
// ---------------------------------------------------------

export interface CafeteriaItem {
  id: string;
  nameJp: string; reading: string;
  nameZh: string; nameEn: string;
  price: number;
  // 1 = 天天有，2 = 手慢就没，3 = 去晚了必然没
  popularity: 1 | 2 | 3;
  emoji: string;
  descZh: string; descEn: string;
  effects: StoryEffect[];
  word?: StoryWord;
  // 第一次吃到的时候主角的那句话。菜单上每一样都写了一句——
  // 食堂之所以值得反复来，不是因为属性，是因为每样东西吃第一口时想到的事不一样。
  firstJp?: string;
  firstZh: string; firstEn: string;
}

export const CAFETERIA_MENU: CafeteriaItem[] = [
  {
    id: 'caf_teishoku',
    nameJp: '日替わり定食', reading: 'ひがわりていしょく',
    nameZh: '每日定食', nameEn: 'Daily Set Meal',
    price: 680, popularity: 3, emoji: '🍱',
    descZh: '菜单牌上最大的那一块。今天是炸猪排、味噌汤、腌菜、一碗饭。明天是什么没人知道，牌子只写「日替わり」。',
    descEn: 'The biggest board on the wall. Today it is tonkatsu, miso soup, pickles and a bowl of rice. Nobody knows about tomorrow; the sign only says "changes daily".',
    effects: [
      { stat: 'kindness', amount: 1, reasonZh: '好好吃了一顿正经饭', reasonEn: 'You ate a proper meal, properly' },
      { stat: 'guts', amount: 1, reasonZh: '你抢到了今天最后一份', reasonEn: 'You got the last one' }
    ],
    word: { jp: '日替わり', reading: 'ひがわり', zh: '每日更换', en: 'changing daily' },
    firstJp: '日替わり……つまり、明日は違うものが出るってことか。',
    firstZh: '「日替わり」——也就是说，明天出来的是别的东西。你忽然明白这块牌子是一种承诺：明天还会有明天的。',
    firstEn: '"Changes daily" - meaning something else comes out tomorrow. It occurs to you that the sign is a kind of promise: there will be a tomorrow, and it will have its own lunch.'
  },
  {
    id: 'caf_kitsune_udon',
    nameJp: 'きつねうどん', reading: 'きつねうどん',
    nameZh: '狐狸乌冬', nameEn: 'Kitsune Udon',
    price: 450, popularity: 1, emoji: '🍜',
    descZh: '一大片炸豆皮盖在面上，汤是关西的淡口，几乎是透明的。东京的乌冬汤是黑的——这件事关西人会主动告诉你三次。',
    descEn: 'One big sheet of sweet fried tofu on top, in the pale Kansai broth, almost clear. Tokyo udon broth is black, a fact people here will volunteer to you three times.',
    effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你学会了从汤的颜色判断这是哪儿', reasonEn: 'You learned to tell where you are by the colour of the broth' }],
    word: { jp: '狐', reading: 'きつね', zh: '狐狸', en: 'fox' },
    firstJp: 'なんで「きつね」なんですか。',
    firstZh: '你问阿姨为什么叫「狐狸」。她说因为狐狸喜欢吃油豆腐。你还想问下一句，后面已经排了六个人。',
    firstEn: 'You ask the lady why it is called fox. She says because foxes like fried tofu. You have a follow-up question, but there are six people behind you.'
  },
  {
    id: 'caf_curry',
    nameJp: 'カレーライス', reading: 'カレーライス',
    nameZh: '咖喱饭', nameEn: 'Curry Rice',
    price: 480, popularity: 2, emoji: '🍛',
    descZh: '甜的。日本的学校咖喱一律是甜的，辣的那种要另外找地方。分量大得不讲道理。',
    descEn: 'Sweet. Japanese school curry is always sweet; for the hot kind you go elsewhere. The portion is unreasonable.',
    effects: [{ stat: 'guts', amount: 1, reasonZh: '你把那一大盘吃完了', reasonEn: 'You finished the whole unreasonable plate' }],
    firstJp: '……甘い。',
    firstZh: '……是甜的。你愣了两秒才继续吃。不是难吃，是完全不是你以为的那个味道。',
    firstEn: '...It is sweet. You pause for two seconds before continuing. Not bad. Just not remotely the thing you were braced for.'
  },
  {
    id: 'caf_yakisoba_pan',
    nameJp: '焼きそばパン', reading: 'やきそばパン',
    nameZh: '炒面面包', nameEn: 'Yakisoba Bread',
    price: 180, popularity: 2, emoji: '🥖',
    descZh: '一个热狗面包，中间夹着一整份炒面，上面还挤了美乃滋，插一撮红姜。',
    descEn: 'A hot dog bun with an entire portion of fried noodles in it, a stripe of mayonnaise on top and a pinch of red ginger.',
    effects: [
      { stat: 'guts', amount: 1, reasonZh: '你直面了它', reasonEn: 'You faced it' },
      { stat: 'knowledge', amount: 1, reasonZh: '你对这个国家的理解前进了一步', reasonEn: 'Your understanding of this country advanced' }
    ],
    word: { jp: '炭水化物', reading: 'たんすいかぶつ', zh: '碳水化合物', en: 'carbohydrate' },
    firstJp: '……炭水化物を、炭水化物で、挟んでる。',
    firstZh: '……碳水，夹着碳水。真不愧是日本。你举着它看了好一会儿，最后还是咬了下去——而且很好吃，这才是最过分的地方。',
    firstEn: '...Carbohydrate, wrapped in carbohydrate. Of course. Japan. You hold it up and consider it for a while, then bite anyway - and it is delicious, which is the truly outrageous part.'
  },
  {
    id: 'caf_korokke_pan',
    nameJp: 'コロッケパン', reading: 'コロッケパン',
    nameZh: '可乐饼面包', nameEn: 'Croquette Bread',
    price: 160, popularity: 2, emoji: '🥪',
    descZh: '炒面面包的近亲。夹的是一个炸土豆饼，刷了猪排酱。',
    descEn: 'A close relative of the yakisoba bread. This one has a deep-fried potato cake in it, brushed with tonkatsu sauce.',
    effects: [{ stat: 'guts', amount: 1, reasonZh: '你已经不再对这件事发表意见了', reasonEn: 'You have stopped commenting on this' }],
    firstJp: 'もう驚かへんで。',
    firstZh: '土豆夹面包。你已经不惊讶了。你甚至觉得这很合理——这个转变发生得比你预想的快。',
    firstEn: 'Potato in bread. You are no longer surprised. You even find it reasonable, and that transition happened faster than you expected.'
  },
  {
    id: 'caf_karaage',
    nameJp: '唐揚げ', reading: 'からあげ',
    nameZh: '炸鸡块', nameEn: 'Fried Chicken',
    price: 220, popularity: 3, emoji: '🍗',
    descZh: '一份五块，纸盘子装着。十二点五分就会没有，这是全校公认的物理常数。',
    descEn: 'Five pieces on a paper plate. Gone by five past twelve, a physical constant the entire school agrees on.',
    effects: [{ stat: 'charm', amount: 1, reasonZh: '端着这个走过食堂，视线会跟着你', reasonEn: 'Carrying this across the hall, you are followed by eyes' }],
    firstJp: 'なんで五分でなくなるん、これ。',
    firstZh: '你终于抢到了一份。旁边的男生看了你一眼，那种眼神你在超市抢打折商品时见过。',
    firstEn: 'You finally get a plate. The boy beside you glances over with an expression you have previously only seen at supermarket markdowns.'
  },
  {
    id: 'caf_onigiri',
    nameJp: 'おにぎり', reading: 'おにぎり',
    nameZh: '饭团', nameEn: 'Rice Ball',
    price: 120, popularity: 1, emoji: '🍙',
    descZh: '梅子或者昆布，两种。用保鲜膜裹着，摆在收银台旁边的篮子里。永远有。',
    descEn: 'Pickled plum or kelp, those are the options. Wrapped in film, in a basket by the till. Always there.',
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '便宜、够吃、不用排队', reasonEn: 'Cheap, enough, and no queue' }],
    firstJp: '……しょっぱ。',
    firstZh: '……好咸。是梅子。你后来才知道那种酸咸法叫「梅干し」，而且日本人会拿它当形容词用。',
    firstEn: '...Salty. It is umeboshi. You learn later that this particular sourness has a name, and that people here use it as an adjective.'
  },
  {
    id: 'caf_zarusoba',
    nameJp: 'ざるそば', reading: 'ざるそば',
    nameZh: '笊篱荞麦面', nameEn: 'Cold Soba',
    price: 380, popularity: 1, emoji: '🍢',
    descZh: '凉的，摆在竹帘上，蘸汁另给。吃的时候要出声，这一点你花了两周才习惯。',
    descEn: 'Cold, on a bamboo tray, with the dipping sauce separate. You are meant to make noise eating it, which took you two weeks.',
    effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你终于敢在食堂里吸出声了', reasonEn: 'You finally dared to slurp in public' }],
    word: { jp: '冷たい', reading: 'つめたい', zh: '冷的、凉的', en: 'cold' },
    firstJp: '音、立てていいんですよね。',
    firstZh: '你小声确认了一次"是可以出声的吧"。旁边的人根本没听见——因为整个食堂都在出声。',
    firstEn: 'You quietly check that making noise is in fact allowed. Nobody hears you, because the entire hall is making noise.'
  },
  {
    id: 'caf_croquette',
    nameJp: 'コロッケ', reading: 'コロッケ',
    nameZh: '可乐饼', nameEn: 'Croquette',
    price: 100, popularity: 1, emoji: '🥔',
    descZh: '单卖的那种，一块一百日元。神户的洋食传统，从明治年间的居留地一路传下来的东西。',
    descEn: 'Sold singly, a hundred yen each. Part of Kobe’s yoshoku tradition, handed down from the foreign settlement.',
    effects: [{ stat: 'knowledge', amount: 1, reasonZh: '一块一百日元的近代史', reasonEn: 'A hundred yen of modern history' }],
    firstJp: 'これ、神戸のやつなんですか。',
    firstZh: '你想起外公手账里也写过这个词。他画了一个圈，旁边写着"和家里的不一样"。',
    firstEn: 'You remember the word in your grandfather’s journal. He had circled it and written that it was not like the ones at home.'
  },
  {
    id: 'caf_milk',
    nameJp: '牛乳', reading: 'ぎゅうにゅう',
    nameZh: '瓶装牛奶', nameEn: 'Bottled Milk',
    price: 90, popularity: 1, emoji: '🥛',
    descZh: '玻璃瓶装，纸盖。喝完瓶子要放回箱子里，这件事没有人教过你，你是看别人做才学会的。',
    descEn: 'A glass bottle with a paper cap. The empty goes back in the crate, which nobody told you; you learned it by watching.',
    effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你学会了一件没有人会教的事', reasonEn: 'You learned something nobody teaches' }],
    firstJp: '瓶、どこに戻すんやろ。',
    firstZh: '你端着空瓶站了几秒，然后跟着前面那个人走到了箱子那儿。这大概是你这一周学得最快的一件事。',
    firstEn: 'You stand holding the empty for a few seconds, then follow the person in front of you to the crate. It may be the fastest you have learned anything this week.'
  }
];

export const findCafeteriaItem = (id: string) => CAFETERIA_MENU.find(i => i.id === id);

// 当天的稳定随机：同一天重开游戏结果一样，换一天就变。
// 用日期而不是 Math.random，是因为"今天没有炸鸡"必须是今天这一天的事实，
// 而不是每次打开菜单都重新掷一次骰子。
const dayHash = (cal: GameCalendar, salt: number) => {
  let h = (cal.month * 31 + cal.day) * 2654435761 + salt * 40503;
  h = (h ^ (h >>> 13)) >>> 0;
  return (h % 1000) / 1000;
};

// slotsLeft: 今天放学后还剩几格时间（2 = 直接来的，1 = 先去了别处）
export const isSoldOut = (item: CafeteriaItem, cal: GameCalendar, slotsLeft: number): boolean => {
  // 中间拐去了别的地方，来得就更晚
  const late = slotsLeft <= 1;
  if (item.popularity === 3) {
    // 抢手货：放学后大多没了，四天里大概能碰上一次
    return late || dayHash(cal, item.id.length * 7) >= 0.25;
  }
  if (item.popularity === 2) {
    return dayHash(cal, item.id.length * 13) < (late ? 0.7 : 0.4);
  }
  // 饭团、乌冬、牛奶这类：永远有。食堂得有个保底
  return false;
};

// 第一次吃某样东西的 flag。剧情里也能拿来判断。
export const tastedFlag = (id: string) => `tasted_${id}`;
