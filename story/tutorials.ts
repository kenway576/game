import { CharacterId, StoryNode } from '../types';

// ==========================================================
// 🧑‍🏫 三个玩法，三个人教
//
// 种菜、钓鱼、做饭这三套系统以前是自己长出来的：玩家点开阳台，
// 界面里有花盆有种子有浇水按钮，没有人跟他说过一个字。
// 那不是"发现"，那是被扔进一个没写说明书的仪表盘前面。
//
// 所以每套系统进门都站一个人：
//   · 做饭 → 奈绪（第一天晚上，她本来就在你厨房里）
//   · 种菜 → 深雪（隔壁的邻居，她的阳台就在你头顶上）
//   · 钓鱼 → 源さん（渔具店那个老头，他从二十六岁开始在这片海钓）
//
// 教的东西必须是**玩法本身**，不是气氛：材料从哪来、做出来干什么用、
// 什么东西要学才会。说明书写在对话里，但语气得是人说的话。
// ==========================================================

const MIYUKI = '/images/characters/miyuki/';
const GEN = '/images/characters/npc_city_gensan.webp';

// ---------------------------------------------------------
// 🌱 种菜 · 深雪
// 触发：第一次打开阳台
// ---------------------------------------------------------
export const FARM_TUTORIAL: StoryNode[] = [
  {
    type: 'scene', scene: 'apartment_balcony', bgm: 'town',
    titleZh: '海风庄 201 · 阳台', titleEn: 'Umikaze-so 201 · The Balcony'
  },
  {
    type: 'narration',
    zh: '阳台比你想的宽。晾衣杆下面空着一大片水泥地，上一个住户在墙角留了一圈圆形的水渍，看得出那里放过很久的什么东西。',
    en: 'The balcony is wider than you expected. Under the washing pole there is a long empty stretch of concrete, and in the corner the previous tenant left a ring of water stain where something stood for a long time.'
  },
  {
    type: 'narration',
    characterImage: `${MIYUKI}cardigan_neutral.webp`,
    zh: '楼上传来拖鞋的声音，然后是一个人趴在栏杆上往下看你的声音。',
    en: 'Slippers upstairs, and then the sound of somebody leaning over the railing to look down at you.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${MIYUKI}cardigan_happy.webp`,
    jp: 'あ、やっぱりそこ空いてるんや。もったいないなあ、そこ、めっちゃ日ぃ当たんねんで。',
    words: [{ jp: '日が当たる', reading: 'ひがあたる', zh: '晒得到太阳', en: 'to get the sun' }],
    zh: '啊，那边果然是空的。可惜了呀，那个位置，太阳晒得可好了。',
    en: 'Ah, so that bit really is empty. Such a waste. That spot gets a lot of sun, you know.',
    color: 'bg-purple-500'
  },
  {
    type: 'narration',
    zh: '你说你没想过要在阳台上放什么。她说了句「そうなん」，然后转身进了屋，拖鞋声吧嗒吧嗒地响了一阵。',
    en: 'You say it had not occurred to you to put anything on it. She says "is that so", and disappears inside for a moment with a shuffle of slippers.'
  },
  {
    type: 'narration',
    characterImage: `${MIYUKI}cardigan_happy.webp`,
    zh: '再出现的时候她手里拿着一个空花盆，从楼上直接递下来。你伸手接的时候两个人的胳膊都不太够，最后是她松了手，你接住的。',
    en: 'When she comes back she has an empty plant pot, which she holds down over the railing. Neither of you can quite reach, and it ends with her letting go and you catching it.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${MIYUKI}cardigan_neutral.webp`,
    jp: 'ほな、説明するで。……といっても、三つだけ。',
    zh: '那我说明一下。……说是说明，也就三件事。',
    en: 'Right, let me explain. ...Although there are only three things to it.',
    color: 'bg-purple-500'
  },
  {
    type: 'narration',
    zh: '第一件：盆和种子。盆在三宫的百元店有，种子在渔具店隔壁那家杂货铺和百元店都能买到——葱、樱桃萝卜、罗勒、紫苏，都是这个阳台养得活的。',
    en: 'One: pots and seeds. Pots come from the hundred-yen shop in Sannomiya; seeds from there too. Spring onion, radish, basil, shiso — all of them will live on this balcony.'
  },
  {
    type: 'narration',
    zh: '第二件：每天浇水。她说得很轻描淡写，然后补了一句：忘一天不会死，忘三天就会。',
    en: 'Two: water it every day. She says this lightly, then adds that missing one day will not kill it and missing three will.'
  },
  {
    type: 'narration',
    zh: '第三件：长熟了自己摘。摘下来的东西可以卖掉换钱，也可以拿去做饭。',
    en: 'Three: pick it yourself when it is ready. What you pick can be sold for money, or it can be cooked.'
  },
  {
    type: 'choice',
    promptZh: '「那……卖掉和吃掉，哪个划算？」',
    promptEn: '"So... which is worth more, selling it or eating it?"',
    options: [
      {
        id: 'farm_tut_sell',
        labelZh: '「听起来还是卖钱实在。」',
        labelEn: '"Selling sounds more practical."',
        hintZh: '一份樱桃萝卜九十日元',
        hintEn: 'Ninety yen a bunch.',
        relations: [{ char: CharacterId.MIYUKI, familiarity: 5, affection: 2, reasonZh: '她被这个回答逗到了', reasonEn: 'That answer amused her' }],
        then: [
          {
            type: 'narration',
            characterImage: `${MIYUKI}cardigan_happy.webp`,
            zh: '她笑了。「九十円やで。九十円。」她说这三个字的时候伸出了三根手指，你到现在也没搞懂为什么是三根。',
            en: 'She laughs and repeats the price back at you, holding up three fingers. You never do work out why three.'
          },
          {
            type: 'narration',
            zh: '「钱以后还能再赚，」她说，「可你自己种的东西吃下去以后留在你身上的那点什么，是买不着的。」',
            en: '"You can always earn money again," she says. "What stays in you after you eat something you grew, you cannot buy that anywhere."'
          }
        ]
      },
      {
        id: 'farm_tut_eat',
        labelZh: '「吃掉吧。反正我也不会做菜以外的事。」',
        labelEn: '"Eat it, I suppose. It is not as though I can do anything else with it."',
        hintZh: '奈绪教过你一样东西',
        hintEn: 'Nao taught you one thing.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你已经在想着做给谁吃了', reasonEn: 'You were already thinking about who you would cook it for' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 6, affection: 4, reasonZh: '她本来就想听这句', reasonEn: 'That was the answer she had been hoping for' }],
        then: [
          {
            type: 'narration',
            characterImage: `${MIYUKI}cardigan_happy.webp`,
            zh: '「正解。」她说得很干脆。',
            en: '"Correct," she says, briskly.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    characterImage: `${MIYUKI}cardigan_neutral.webp`,
    zh: '她解释了为什么：自己种的东西做成菜吃下去，会变成你身上的一点本事——耐心、手艺、或者只是对别人多一点周到。这些东西不能卖，也不会因为你有钱就自己长出来。',
    en: 'She explains why. What you grow, cook and eat turns into a little more of something in you: patience, or skill, or simply being a bit more thoughtful about other people. None of that can be sold, and none of it grows on its own because you happen to have money.'
  },
  {
    type: 'narration',
    zh: '「所以呢，」她最后说，「菜舍不得卖的那一天，你就算是住下来了。」',
    en: '"So," she finishes, "the day you cannot bring yourself to sell the vegetables is the day you have properly moved in."'
  },
  {
    type: 'effect',
    setFlags: ['farm_tutorial_done', 'give:item_pot:1'],
    effects: [{ stat: 'kindness', amount: 1, reasonZh: '楼上那个人把自己的空盆给了你', reasonEn: 'The person upstairs gave you her spare pot' }],
    relations: [{ char: CharacterId.MIYUKI, familiarity: 8, affection: 3, reasonZh: '她隔着一层楼板把说明书讲完了', reasonEn: 'She got through the whole manual from one floor up' }]
  },
  {
    type: 'narration',
    zh: '花盆是空的，土还得自己买。但它已经在你阳台上了，就摆在那圈水渍中间——尺寸正好，一分不差。',
    en: 'The pot is empty and you will have to buy the soil yourself. But it is on your balcony now, standing in the middle of that ring of water stain. It fits exactly.'
  }
];

// ---------------------------------------------------------
// 🎣 钓鱼 · 源さん
// 触发：第一次到任何一个钓点
// ---------------------------------------------------------
export const FISH_TUTORIAL: StoryNode[] = [
  {
    type: 'narration',
    zh: '防波堤上一字排开数位垂钓者，彼此相隔丈许，各自沉浸在海浪与浮漂的呼吸中。你两手空空立在堤岸最外侧，浑身散发着走错片场的突兀感——事实上你确实是误打误撞闯进来的。',
    en: 'A row of solitary figures line the breakwater, each lost in the rhythmic rise and fall of float and tide. Standing at the far edge empty-handed, you emanate the unmistakable aura of someone who has wandered onto the wrong set—which, in fact, you entirely have.',
  },
  {
    type: 'narration',
    characterImage: GEN,
    zh: '离你最近的那个老头看了你一眼，又看了一眼你的两只手，然后把自己脚边的一根备用竿踢了过来。踢得很准，停在你鞋尖前面。',
    en: 'The old man nearest you looks at you, then at your two empty hands, and kicks a spare rod along the concrete towards you. Accurately: it stops at your toes.'
  },
  {
    type: 'speech',
    speakerZh: '源さん', speakerEn: 'Gen-san',
    characterImage: GEN,
    jp: '手ぶらで堤防来る子、久しぶりに見たわ。',
    zh: '空着手上堤防的小孩，好久没见到了。',
    en: 'Not seen a lad turn up on the breakwater empty-handed in a long while.',
    color: 'bg-sky-600'
  },
  {
    type: 'narration',
    zh: '他没有等你解释，直接开始说。语速很快，而且默认你听得懂——你后来发现这是这一带老人对你说话的统一方式。',
    en: 'He does not wait for you to explain. He simply starts, quickly, on the assumption that you can follow. You come to learn that this is how the old men around here address you as a matter of course.'
  },
  {
    type: 'narration',
    zh: '一、竿和饵。竿在他那家店里，越贵的钓上来的越大；饵是消耗品，每甩一次少一份，用完就只能回去买。',
    en: 'One: a rod and bait. Rods come from his shop, and the dearer the rod the bigger what comes up on it. Bait is consumed: one gone per cast, and when it runs out you go back and buy more.'
  },
  {
    type: 'narration',
    zh: '二、什么时候来。早上和傍晚的鱼跟中午的不是一批，下雨天又是另一批。同一个堤防，一天里能是三个地方。',
    en: 'Two: when you come. The fish in the morning and at dusk are not the fish at noon, and rain brings up a different lot again. The same breakwater is three different places over one day.'
  },
  {
    type: 'narration',
    zh: '三、一天钓几次。他说：钓两三竿就够了。你问为什么。他说因为那之后手会抖，抖了就钓不上来了。',
    en: 'Three: how many times a day. He says two or three casts is plenty. You ask why. He says because after that your hands shake, and once they shake nothing comes up.'
  },
  {
    type: 'choice',
    promptZh: '他把饵盒推过来。',
    promptEn: 'He pushes the bait box across.',
    options: [
      {
        id: 'fish_tut_ask',
        labelZh: '「钓上来的鱼，是拿去卖吗？」',
        labelEn: '"What do you do with them? Sell them?"',
        jp: '釣った魚って、売るんですか。',
        hintZh: '你已经知道这个游戏喜欢在这种地方藏东西',
        hintEn: 'You have started to notice where this place hides things.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你问了一个只有内行会问的问题', reasonEn: 'You asked the question an insider asks' }],
        then: [
          {
            type: 'narration',
            characterImage: GEN,
            zh: '「卖给你倒也无妨。」他吐出一口烟圈，「不过嘛……」老头浑浊的目光在你脸上驻留片刻，似乎在掂量该不该跟一个初来乍到的生面孔交底。',
            en: '"You can sell them," he says, exhaling a plume of smoke. "Though mind you..." The old man’s weathered gaze lingers on your face for a beat, weighing whether to confide in a newcomer.'
          },
          {
            type: 'narration',
            zh: '「大きいのは売り。小さいのは食う。」大的卖钱，小的自己吃。他说小的做起来比较麻烦，但吃完了那顿饭，人会不一样。',
            en: '"Big ones you sell. Small ones you eat." He says the small ones are more trouble to prepare, and that after you have eaten one you are not quite the same person.'
          },
          {
            type: 'narration',
            zh: '你问哪里不一样。他没回答，把鱼竿往海那边指了指，意思是别废话了。',
            en: 'You ask in what way. He does not answer. He points the rod out at the water, meaning: get on with it.'
          }
        ]
      },
      {
        id: 'fish_tut_silent',
        labelZh: '什么也不问，学着他的样子把线甩出去',
        labelEn: 'Ask nothing. Copy him and cast',
        hintZh: '这一排人都没在说话',
        hintEn: 'Nobody in this row is talking.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你没有先要一份说明书才肯动手', reasonEn: 'You did not demand a manual before starting' }],
        then: [
          {
            type: 'narration',
            zh: '第一竿软绵绵地甩出去没多远就落了水。第二竿差不多。第三竿他没忍住，伸手把你的手腕往下压了一点，只压了一点。',
            en: 'The first cast lands barely past your toes. So does the second. On the third he cannot help himself and presses your wrist down a little. Only a little.'
          },
          {
            type: 'narration',
            characterImage: GEN,
            zh: '第四竿出去了很远。他「ん」了一声，就转回去看自己的浮标了。这一声是他今天对你最高的评价。',
            en: 'The fourth one goes a long way out. He makes a short noise and turns back to his own float. That noise is the highest praise he offers anybody today.'
          }
        ]
      }
    ]
  },
  {
    type: 'narration',
    characterImage: GEN,
    zh: '他说他从二十六岁开始在这片海钓。你算了一下，没敢把结果说出来。',
    en: 'He tells you he has been fishing this water since he was twenty-six. You do the arithmetic and decide not to say the answer out loud.'
  },
  {
    type: 'effect',
    setFlags: ['fish_tutorial_done'],
    effects: [{ stat: 'proficiency', amount: 2, reasonZh: '有人把手腕往下压了那一下', reasonEn: 'Somebody pressed your wrist down that once' }]
  },
  {
    type: 'narration',
    zh: '他把那根备用竿留给了你，说下次记得自己带一根来。海上的风是从右边来的，浮标一直在往左边飘。',
    en: 'He leaves you the spare rod and tells you to bring your own next time. The wind is off the water from the right, and the float keeps drifting left.'
  }
];
