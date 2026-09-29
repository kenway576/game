// ==========================================================
// 📜 菜谱卡：做菜小游戏的"题目"
//
// 【为什么把做菜从 QTE 改成读菜谱】
// 以前做菜和钓鱼玩的是同一个动作——看准时机按。
// 现在钓鱼留着考手感，做菜改成考"读懂"：
// 菜谱卡是日语写的，动作按钮是中文（或英文）。
// 你得读懂那句日语，才知道下一步该点哪个。
//
// 【句子顺序 ≠ 动作顺序】
// 这是整个设计的核心。菜谱里大量用 N3 的顺序语法：
//   〜前に    「揚げる前に、水気を拭き取ります」——先擦干，后炸（句子里"炸"在前面）
//   〜てから  「洗ってから切ります」——先洗后切
//   〜たら    「沸騰したら、火を弱めます」——开了以后才调小火
//   〜うちに  「熱いうちに漬けます」——必须趁热，不能等
//   〜まで    「固まるまで待ちます」——等到凝固为止
//   〜間に    「ゆでている間に、ソースを作ります」——煮面的同时做酱
// 只看关键词按顺序点，一定会在「前に」那里栽跟头。
//
// 每张卡另有两个"陷阱"动作：菜谱里明确说了不要做的（煮立たせない），
// 或者只差一个词的（冷水 vs 温水）。
// ==========================================================

export interface RecipeStepAction {
  id: string;
  emoji: string;
  zh: string;
  en: string;
}

export interface RecipeCard {
  // 菜谱正文：日语原文 + 译文（点"看翻译"才出来，看了这道菜最多算"成功"）
  lines: { jp: string; zh: string; en: string }[];
  // 正确顺序
  steps: RecipeStepAction[];
  // 陷阱：点了算失误
  traps: RecipeStepAction[];
}

export const RECIPE_CARDS: Record<string, RecipeCard> = {
  dish_misoshiru: {
    lines: [
      { jp: 'まず、鍋でお湯を沸かします。', zh: '先用锅把水烧开。', en: 'First, bring water to the boil in a pot.' },
      { jp: '沸騰したら、火を弱めて味噌を溶かします。', zh: '水开了以后，调小火，把味噌化开。', en: 'Once it boils, lower the heat and dissolve the miso.' },
      { jp: '味噌を入れた後は、煮立たせないでください。お椀によそってから、ねぎをのせます。', zh: '放了味噌以后，不要再让它滚开。盛进碗里之后，再放葱。', en: 'Once the miso is in, do not let it boil again. Ladle into bowls, then top with spring onion.' }
    ],
    steps: [
      { id: 'boil', emoji: '🔥', zh: '烧开水', en: 'Boil the water' },
      { id: 'low', emoji: '🔽', zh: '调小火', en: 'Turn the heat down' },
      { id: 'miso', emoji: '🥄', zh: '化开味噌', en: 'Dissolve the miso' },
      { id: 'serve', emoji: '🥣', zh: '盛进碗里', en: 'Ladle into bowls' },
      { id: 'negi', emoji: '🌿', zh: '放葱花', en: 'Add the spring onion' }
    ],
    traps: [
      { id: 'reboil', emoji: '♨️', zh: '开大火再煮滚一次', en: 'Bring it back to a rolling boil' },
      { id: 'negi_pot', emoji: '🫕', zh: '把葱倒进锅里一起煮', en: 'Simmer the onion in the pot' }
    ]
  },

  dish_salad: {
    lines: [
      { jp: 'ラディッシュは、よく洗ってから薄く切ります。', zh: '樱桃萝卜洗干净之后，切成薄片。', en: 'Wash the radishes well, then slice them thinly.' },
      { jp: 'バジルは包丁を使わずに手でちぎって、切ったラディッシュと混ぜます。', zh: '罗勒不用刀，用手撕开，和切好的萝卜拌在一起。', en: 'Tear the basil by hand rather than cutting it, and toss it with the radish.' },
      { jp: '食べる直前に、オリーブオイルと塩をかけます。', zh: '吃之前再浇橄榄油、撒盐。', en: 'Dress with olive oil and salt just before eating.' }
    ],
    steps: [
      { id: 'wash', emoji: '💧', zh: '洗萝卜', en: 'Wash the radishes' },
      { id: 'slice', emoji: '🔪', zh: '萝卜切薄片', en: 'Slice the radishes thinly' },
      { id: 'tear', emoji: '🤲', zh: '用手撕罗勒', en: 'Tear the basil by hand' },
      { id: 'mix', emoji: '🥗', zh: '拌在一起', en: 'Toss together' },
      { id: 'dress', emoji: '🫒', zh: '浇油撒盐', en: 'Oil and salt' }
    ],
    traps: [
      { id: 'knife_basil', emoji: '🔪', zh: '用刀把罗勒切碎', en: 'Chop the basil with a knife' },
      { id: 'dress_early', emoji: '🧂', zh: '先把萝卜用盐腌一晚', en: 'Salt the radishes overnight first' }
    ]
  },

  dish_ooba_tempura: {
    lines: [
      { jp: '揚げる前に、大葉の水気をしっかり拭き取ります。', zh: '炸之前，把紫苏叶上的水擦干。', en: 'Before frying, pat the shiso leaves completely dry.' },
      { jp: '衣は冷水で作ります。混ぜすぎないように気をつけてください。', zh: '面衣用冰水调，注意别搅过头。', en: 'Make the batter with ice-cold water, and do not overmix it.' },
      { jp: '油が百七十度になったら、大葉の片面だけに衣をつけて揚げます。', zh: '油温到一百七十度后，只在紫苏叶的一面裹上面衣下锅。', en: 'When the oil reaches 170°, coat just one side of each leaf and fry.' }
    ],
    steps: [
      { id: 'dry', emoji: '🧻', zh: '擦干紫苏叶', en: 'Pat the leaves dry' },
      { id: 'batter', emoji: '🧊', zh: '用冰水调面衣', en: 'Mix batter with ice water' },
      { id: 'heat', emoji: '🌡️', zh: '把油烧到170度', en: 'Heat the oil to 170°' },
      { id: 'coat', emoji: '🍃', zh: '只给一面裹面衣', en: 'Batter one side only' },
      { id: 'fry', emoji: '🍤', zh: '下锅炸', en: 'Fry' }
    ],
    traps: [
      { id: 'warm_batter', emoji: '♨️', zh: '用温水调面衣', en: 'Mix batter with warm water' },
      { id: 'both_sides', emoji: '🥟', zh: '两面都裹满面衣', en: 'Batter both sides thickly' }
    ]
  },

  dish_pasta: {
    lines: [
      { jp: 'パスタをゆでている間に、トマトを切ってソースを作ります。', zh: '在煮意面的同时，切番茄、做酱。', en: 'While the pasta boils, chop the tomatoes and make the sauce.' },
      { jp: 'パスタがゆであがったら、すぐにソースとからめます。', zh: '意面煮好后，马上和酱拌匀。', en: 'As soon as the pasta is done, toss it with the sauce.' },
      { jp: '最後に、バジルをのせます。', zh: '最后放上罗勒。', en: 'Finally, top with basil.' }
    ],
    steps: [
      { id: 'boil', emoji: '🍝', zh: '下意面煮', en: 'Put the pasta on to boil' },
      { id: 'chop', emoji: '🍅', zh: '切番茄', en: 'Chop the tomatoes' },
      { id: 'sauce', emoji: '🍳', zh: '做番茄酱汁', en: 'Make the sauce' },
      { id: 'toss', emoji: '🔄', zh: '把面和酱拌匀', en: 'Toss pasta and sauce' },
      { id: 'basil', emoji: '🌿', zh: '放上罗勒', en: 'Top with basil' }
    ],
    traps: [
      { id: 'basil_boil', emoji: '🫕', zh: '罗勒和面一起下锅煮', en: 'Boil the basil with the pasta' },
      { id: 'cool', emoji: '❄️', zh: '面煮好先放凉再拌', en: 'Let the pasta cool before tossing' }
    ]
  },

  dish_yakizakana: {
    lines: [
      { jp: '焼く三十分前に、魚に塩をふっておきます。', zh: '烤之前三十分钟，先给鱼抹上盐。', en: 'Thirty minutes before grilling, salt the fish.' },
      { jp: 'グリルを十分に温めてから、魚を皮の方から焼きます。', zh: '烤架充分预热之后，从鱼皮那面开始烤。', en: 'Once the grill is fully heated, grill the fish skin-side first.' },
      { jp: '焼き上がったら、大葉を添えます。', zh: '烤好之后，配上紫苏叶。', en: 'When it is done, garnish with shiso.' }
    ],
    steps: [
      { id: 'salt', emoji: '🧂', zh: '给鱼抹盐', en: 'Salt the fish' },
      { id: 'preheat', emoji: '🔥', zh: '预热烤架', en: 'Preheat the grill' },
      { id: 'skin', emoji: '🐟', zh: '鱼皮朝下开始烤', en: 'Grill skin-side first' },
      { id: 'shiso', emoji: '🌿', zh: '配上紫苏叶', en: 'Garnish with shiso' }
    ],
    traps: [
      { id: 'flesh', emoji: '🥩', zh: '鱼肉那面朝下先烤', en: 'Grill flesh-side first' },
      { id: 'salt_after', emoji: '⏱️', zh: '烤好之后再抹盐', en: 'Salt it after grilling' }
    ]
  },

  dish_nanban: {
    lines: [
      { jp: '漬けだれは、アジを揚げる前に作っておきます。', zh: '腌汁要在炸竹荚鱼之前先调好。', en: 'Make the marinade before you fry the aji.' },
      { jp: 'アジに片栗粉をまぶしてから、油で揚げます。', zh: '竹荚鱼裹上淀粉之后，下油锅炸。', en: 'Dust the aji with potato starch, then deep-fry.' },
      { jp: '揚げたてのアジを、熱いうちにたれに漬けます。ねぎは最後にのせます。', zh: '刚炸好的竹荚鱼，要趁热泡进腌汁。葱最后放。', en: 'Drop the fresh-fried aji into the marinade while still hot. Spring onion goes on last.' }
    ],
    steps: [
      { id: 'marinade', emoji: '🥣', zh: '调好南蛮醋汁', en: 'Make the marinade' },
      { id: 'starch', emoji: '⚪', zh: '竹荚鱼裹淀粉', en: 'Dust the fish with starch' },
      { id: 'fry', emoji: '🍤', zh: '下油锅炸', en: 'Deep-fry' },
      { id: 'soak', emoji: '💧', zh: '趁热泡进腌汁', en: 'Soak while hot' },
      { id: 'negi', emoji: '🌿', zh: '放葱丝', en: 'Top with spring onion' }
    ],
    traps: [
      { id: 'cool', emoji: '❄️', zh: '等鱼放凉了再泡', en: 'Let the fish cool before soaking' },
      { id: 'nostarch', emoji: '🐟', zh: '不裹粉直接炸', en: 'Fry without the starch' }
    ]
  },

  dish_takoyaki: {
    lines: [
      { jp: 'たこは、生地を焼く前にゆでて、小さく切っておきます。', zh: '章鱼要在烤面糊之前先焯熟，切成小块。', en: 'Before cooking the batter, boil the octopus and cut it small.' },
      { jp: 'たこ焼き器に油をひいて、よく熱してから生地を流し入れます。', zh: '章鱼烧烤盘刷油，充分烧热之后倒入面糊。', en: 'Oil the takoyaki pan and heat it well, then pour in the batter.' },
      { jp: 'たことねぎを入れたら、周りが固まるまで待って、くるっと回します。', zh: '放进章鱼和葱以后，等到边缘凝固，再转过来。', en: 'Add the octopus and onion, wait until the edges set, then flip.' }
    ],
    steps: [
      { id: 'boil', emoji: '🐙', zh: '焯章鱼', en: 'Boil the octopus' },
      { id: 'cut', emoji: '🔪', zh: '切成小块', en: 'Cut it small' },
      { id: 'oil', emoji: '🛢️', zh: '烤盘刷油烧热', en: 'Oil and heat the pan' },
      { id: 'pour', emoji: '🥛', zh: '倒入面糊', en: 'Pour in the batter' },
      { id: 'add', emoji: '🌿', zh: '放章鱼和葱', en: 'Add octopus and onion' },
      { id: 'wait', emoji: '⏳', zh: '等边缘凝固', en: 'Wait for the edges to set' },
      { id: 'flip', emoji: '🔄', zh: '转过来', en: 'Flip' }
    ],
    traps: [
      { id: 'flip_now', emoji: '💨', zh: '倒进去马上就翻', en: 'Flip straight away' },
      { id: 'raw', emoji: '🦑', zh: '生章鱼直接放进去', en: 'Put the octopus in raw' }
    ]
  },

  dish_taimeshi: {
    lines: [
      { jp: '米は炊く三十分前に研いで、水につけておきます。', zh: '米在煮之前三十分钟淘好，泡在水里。', en: 'Thirty minutes before cooking, rinse the rice and leave it to soak.' },
      { jp: '鯛は、焼き目がつくまで表面だけ焼きます。', zh: '鲷鱼只把表面烤出焦色即可。', en: 'Sear the sea bream just until the surface browns.' },
      { jp: '米の上に鯛をのせて炊きます。炊き上がったら、骨を取ってから全体を混ぜ、大葉を散らします。', zh: '把鲷鱼放在米上一起煮。煮好以后，先挑掉鱼骨再整体拌匀，撒上紫苏。', en: 'Lay the fish on the rice and cook together. When done, remove the bones, then mix everything and scatter with shiso.' }
    ],
    steps: [
      { id: 'rinse', emoji: '🍚', zh: '淘米、泡水', en: 'Rinse and soak the rice' },
      { id: 'sear', emoji: '🐟', zh: '把鲷鱼表面烤出焦色', en: 'Sear the fish surface' },
      { id: 'cook', emoji: '♨️', zh: '鱼放米上一起煮', en: 'Cook the fish on the rice' },
      { id: 'bones', emoji: '🦴', zh: '挑掉鱼骨', en: 'Remove the bones' },
      { id: 'mix', emoji: '🥄', zh: '整体拌匀', en: 'Mix everything' },
      { id: 'shiso', emoji: '🌿', zh: '撒紫苏', en: 'Scatter the shiso' }
    ],
    traps: [
      { id: 'full', emoji: '🔥', zh: '把鲷鱼完全烤熟', en: 'Grill the fish right through' },
      { id: 'mix_bones', emoji: '🥢', zh: '连骨头一起拌', en: 'Mix it in with the bones' }
    ]
  },

  dish_bento: {
    lines: [
      { jp: 'ご飯は、詰める前に冷ましておきます。', zh: '米饭在装盒之前先晾凉。', en: 'Let the rice cool before you pack it.' },
      { jp: 'おかずは汁気を切ってから、大きいものから順に詰めます。', zh: '配菜沥干汤汁之后，从大的开始依次装。', en: 'Drain the side dishes, then pack them largest first.' },
      { jp: 'すき間ができたら、ミニトマトで埋めます。ふたは、全部冷めてから閉めます。', zh: '有了空隙就用小番茄填上。盖子要等全部凉透再盖。', en: 'Fill any gaps with cherry tomatoes. Only close the lid once everything has cooled.' }
    ],
    steps: [
      { id: 'cool_rice', emoji: '❄️', zh: '把米饭晾凉', en: 'Cool the rice' },
      { id: 'rice', emoji: '🍚', zh: '装米饭', en: 'Pack the rice' },
      { id: 'drain', emoji: '💧', zh: '沥干配菜的汤汁', en: 'Drain the sides' },
      { id: 'big', emoji: '🥕', zh: '先装大块的配菜', en: 'Pack the big items first' },
      { id: 'tomato', emoji: '🍅', zh: '用小番茄填缝', en: 'Fill gaps with tomatoes' },
      { id: 'lid', emoji: '📦', zh: '全部凉透后盖盖子', en: 'Close the lid once cool' }
    ],
    traps: [
      { id: 'hot_lid', emoji: '♨️', zh: '趁热马上盖上', en: 'Close it while hot' },
      { id: 'small', emoji: '🫛', zh: '先装小的配菜', en: 'Pack the small items first' }
    ]
  },

  dish_himawari_seeds: {
    lines: [
      { jp: '種は殻をむかずに、まず塩水に一晩つけます。', zh: '种子不剥壳，先在盐水里泡一晚。', en: 'Without shelling them, soak the seeds overnight in salt water.' },
      { jp: '水気をよく切ってから、弱火でゆっくり炒ります。', zh: '充分沥干水分之后，用小火慢慢炒。', en: 'Drain them thoroughly, then roast slowly over a low flame.' },
      { jp: 'パチパチという音がしなくなるまで、フライパンを揺すり続けます。', zh: '一直晃锅，直到不再发出噼啪声。', en: 'Keep shaking the pan until the crackling stops.' }
    ],
    steps: [
      { id: 'soak', emoji: '💧', zh: '泡一晚盐水', en: 'Soak overnight in brine' },
      { id: 'drain', emoji: '🧻', zh: '沥干水分', en: 'Drain well' },
      { id: 'roast', emoji: '🔥', zh: '小火慢炒', en: 'Roast on a low flame' },
      { id: 'shake', emoji: '🤲', zh: '晃锅到不再噼啪响', en: 'Shake until the crackling stops' }
    ],
    traps: [
      { id: 'high', emoji: '💥', zh: '开大火快炒', en: 'Roast fast on high heat' },
      { id: 'shell', emoji: '🥜', zh: '先把壳剥掉', en: 'Shell them first' }
    ]
  }
};
