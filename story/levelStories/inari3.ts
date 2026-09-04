import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 稻荷 · 第③段「人の時間」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：生田神社 · 初雪的清晨 + cg_inari
//
// 【前两段留下的题】
// ①：她数树不数年，她的"上次"是六十年前。
// ②：那本册子，每个名字两个日期；最后一页有一行空的横线。
//    她说"从写下去的那天起，我就会开始数了"。
//
// 【致敬：かぐや姫の物語 的落点】
// 辉夜姬的悲剧不是被带走，是她终于明白
// **"看过"不等于"活过"**——而等她明白的时候，
// 羽衣一披，连明白过这件事都会被抹掉。
// 稻荷手上有一件辉夜姬没有的东西：她可以自己选。
//
// 【致敬：夏目友人帳 的落点】
// 友人帳最后的解法从来不是"把名字还回去"这个动作本身，
// 而是承认**"我认识过他"这件事值得一直疼下去**。
//
// 【这一段真正的动作】
// 不是主角说"我会一直陪着你"（那是撒谎，主角会死）。
// 是让她自己把一样东西写进那本册子里——
// 相爱线：她写自己的名字，只有第一个日期。
// 挚友线：她用铅笔写你的名字，因为铅笔可以擦。
// ---------------------------------------------------------

const I = '/images/characters/inari/';

export const INARI_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'ikuta_shrine',
    bgm: 'night',
    titleZh: '人の時間',
    titleEn: 'Human Time',
    subtitleZh: '初雪的清晨 · 生田神社',
    subtitleEn: 'First snow, early morning · Ikuta Shrine'
  },
  {
    type: 'narration',
    zh: '神户下雪的日子一年不到三天。今年的第一天是这天早上六点。',
    en: 'Kobe gets fewer than three days of snow a year. This year the first of them starts at six in the morning.'
  },
  {
    type: 'narration',
    zh: '你没有约她。你是自己来的。参道上一个脚印都没有。',
    en: 'You did not arrange to meet. You came on your own. There is not a single footprint on the approach.'
  },
  {
    type: 'narration',
    characterImage: `${I}knit_neutral.webp`,
    zh: '她坐在本殿的台阶上，穿着一件明显不是她那个时代的毛衣。雪落在她肩膀上，不化。',
    en: 'She is sitting on the steps of the main hall in a knitted jumper that is very obviously not from her century. The snow settles on her shoulders and does not melt.'
  },
  {
    type: 'narration',
    zh: '你在她旁边坐下。你肩膀上的雪化了。两个人肩膀上的雪不一样，这件事今天特别明显。',
    en: 'You sit down beside her. The snow on your shoulders melts. The difference between the two sets of shoulders is very legible this morning.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}knit_neutral.webp`,
    jp: '雪の日はな、みな来ぬ。千年、ずっとそうじゃ。',
    zh: '下雪的日子啊，谁都不会来。一千年，一直都这样。',
    en: 'On snow days nobody comes. For a thousand years, always.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '你说你来了。她说她知道，她看见你从鸟居那儿走进来，走了很久。',
    en: 'You say you came. She says she knows; she watched you come in at the torii and take a long time about it.'
  },

  // ---- 中段：她把册子摊开 ----
  {
    type: 'narration',
    characterImage: `${I}knit_thinking.webp`,
    zh: '她把那本册子摊在膝盖上，翻到最后一页。那条空的横线还在。',
    en: 'She spreads the book across her knees and turns to the last page. The blank rule is still there.'
  },
  {
    type: 'narration',
    zh: '你注意到一件事：这本册子从夏天到现在，一个新名字都没有加。',
    en: 'You notice something: since the summer this book has not gained a single new name.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}knit_sad.webp`,
    jp: 'ずっと考えておった。三月と半分。',
    zh: '我一直在想。三个半月。',
    en: 'I have been thinking about it. Three and a half months.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '三个半月。对一个数树的人来说，这是她第一次用"月"这个单位思考一件事。',
    en: 'Three and a half months. For somebody who counts in trees, it is the first time she has weighed anything in months.'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}knit_sad.webp`,
    jp: 'わらわは、ずっと「見ておった」だけじゃった。',
    words: [{ jp: '見る', reading: 'みる', zh: '看', en: 'to watch' }],
    zh: '我一直以来，都只是在「看」而已。',
    en: 'All this time, I have only ever been watching.',
    color: 'bg-amber-500'
  },
  {
    type: 'speech',
    speakerZh: '稻荷', speakerEn: 'Inari',
    characterImage: `${I}sad.webp`,
    jp: '金魚のな。あの紙が破れることすら、知らなんだ。',
    zh: '金鱼那个啊。连那张纸会破，我都不知道。',
    en: 'The goldfish. I did not even know that the paper tears.',
    color: 'bg-amber-500'
  },
  {
    type: 'narration',
    zh: '看了一千年，和活过一天，是两件不一样的事。她今天早上六点才承认这一点。',
    en: 'Watching for a thousand years and living for one day are not the same thing. She admitted it at six o’clock this morning.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '雪下大了。她把册子往你那边推了一点。',
    promptEn: 'The snow thickens. She pushes the book a little way towards you.',
    options: [
      {
        id: 'inari3_your_turn',
        labelZh: '「这次换你被人记。」',
        labelEn: '"This time somebody remembers you."',
        jp: '今度は、稲荷が覚えられる番や。',
        words: [{ jp: '番', reading: 'ばん', zh: '轮到', en: 'one’s turn' }],
        hintZh: '一千年里她一直是记的那一边',
        hintEn: 'For a thousand years she has only ever been the one doing the remembering.',
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你把那本册子翻了个面', reasonEn: 'You turned the book around' },
          { stat: 'guts', amount: 2, reasonZh: '你答应了一件你活不到兑现的事', reasonEn: 'You promised something you will not live to finish' }
        ],
        relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 24, reasonZh: '一千年来第一次有人要记住她', reasonEn: 'In a thousand years, the first person to say they would remember her' }],
        setFlags: ['inari_story_her_turn'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}surprised.webp`,
            zh: '她整个人转过来看你，那种毫无准备的表情，你只在她捞破纸网的时候见过一次。',
            en: 'She turns her whole self towards you with the unprepared look you have seen exactly once before, over a torn paper scoop.'
          },
          {
            type: 'narration',
            zh: '你说：你记了一千年的人，全都走了，没有一个人回过头记你。',
            en: 'You say: she has remembered people for a thousand years, and every one of them left, and not one of them ever turned round and remembered her.'
          },
          {
            type: 'narration',
            characterImage: `${I}knit_sad.webp`,
            zh: '她张了张嘴，然后哭了。非常安静，眼泪落在册子上，把一个一九四五年的名字晕开了一点。',
            en: 'She opens her mouth, and cries. Very quietly. A tear lands on the book and blurs the edge of a name from 1945.'
          },
          {
            type: 'narration',
            zh: '她慌了一下，去擦。擦不掉。她停手了。',
            en: 'She panics for a moment and tries to blot it. It will not come out. She stops trying.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}knit_sad.webp`,
            jp: '……こういうの、初めてじゃ。',
            zh: '……这种事，是第一次。',
            en: '...This is the first time.',
            color: 'bg-amber-500'
          }
        ]
      },
      {
        id: 'inari3_live_one_day',
        labelZh: '「今天陪我过一天人的日子。」',
        labelEn: '"Spend one human day with me. Today."',
        jp: '今日一日、人の時間で過ごしてみ。',
        hintZh: '她说她只是在看。那就给她一天不看的',
        hintEn: 'She said she only ever watches. Give her one day of not watching.',
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你给了一位神明一份日程表', reasonEn: 'You handed a god an itinerary' }],
        relations: [{ char: CharacterId.INARI, familiarity: 8, affection: 18, reasonZh: '她答应了，而且很认真地问几点', reasonEn: 'She agreed, and asked very seriously what time' }],
        setFlags: ['inari_story_one_human_day'],
        then: [
          {
            type: 'narration',
            characterImage: `${I}knit_thinking.webp`,
            zh: '她想了一下，然后问了一个非常认真的问题：「何時からじゃ」。',
            en: 'She thinks about it and then asks, entirely seriously, from what time.'
          },
          {
            type: 'narration',
            zh: '你说从现在。她说那要先吃早饭——她一千年没有需要吃过早饭。',
            en: 'You say from now. She says then there must be breakfast first. She has not needed breakfast in a thousand years.'
          },
          {
            type: 'narration',
            characterImage: `${I}casual_happy.webp`,
            zh: '你们去了神社外面那家七点开门的咖啡店。她点了最贵的那个套餐，因为她不知道该点什么。',
            en: 'You go to the coffee shop outside the shrine that opens at seven. She orders the most expensive set because she does not know what to order.'
          },
          {
            type: 'narration',
            zh: '她吃了一半就饱了。她说这个感觉很奇怪。她笑了一整个上午。',
            en: 'She is full halfway through. She says the sensation is very strange. She laughs about it all morning.'
          }
        ]
      },
      {
        id: 'inari3_erase',
        labelZh: '把那条空横线擦掉',
        labelEn: 'Rub out the blank rule',
        hintZh: '那条线是她给自己划的期限',
        hintEn: 'That line is a deadline she drew on herself.',
        requires: { stat: 'guts', min: 10 },
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你动了一本一千年的册子', reasonEn: 'You touched a thousand-year-old book' }],
        relations: [{ char: CharacterId.INARI, familiarity: 4, affection: 20, reasonZh: '她没有拦你', reasonEn: 'She did not stop you' }],
        setFlags: ['inari_story_erased_line'],
        then: [
          {
            type: 'narration',
            zh: '你拿出橡皮，把那条浅浅的横线擦了。铅笔画的，擦得很干净。',
            en: 'You take out a rubber and remove the faint rule. It was pencil; it comes away cleanly.'
          },
          {
            type: 'narration',
            characterImage: `${I}surprised.webp`,
            zh: '她看着那片空白，很久。',
            en: 'She looks at the blank space for a long time.'
          },
          {
            type: 'narration',
            zh: '你说：这一页你不用先留位置。人不是先划好格子再活的。',
            en: 'You say: she does not have to rule the space in advance. People do not draw the box before they live in it.'
          },
          {
            type: 'speech',
            speakerZh: '稻荷', speakerEn: 'Inari',
            characterImage: `${I}knit_sad.webp`,
            jp: '……線を引くと、な。覚悟がいらんくなるのじゃ。',
            zh: '……划了线的话啊。就不需要下决心了。',
            en: '...If the line is already drawn, you see, one does not have to steel oneself.',
            color: 'bg-amber-500'
          },
          {
            type: 'narration',
            zh: '她划线不是为了记你。她划线是为了提前把疼安排好。',
            en: 'She did not rule the line in order to record you. She ruled it to schedule the pain in advance.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '雪停了。太阳从写字楼中间那条缝里下来，整片参道亮了一下。',
    en: 'The snow stops. The sun comes down the gap between the office blocks and the whole approach lights up at once.'
  },

  // ---- 双结局 ----
  {
    type: 'check',
    metric: 'affection',
    min: 200,

    // ============ 相爱 ============
    then: [
      {
        type: 'narration',
        characterImage: `${I}knit_neutral.webp`,
        zh: '她把册子重新摊开，从袖子里摸出一支笔——一支很普通的圆珠笔，便利店买的。',
        en: 'She opens the book again and produces a pen from her sleeve: an ordinary biro from a convenience store.'
      },
      {
        type: 'narration',
        zh: '她没有写你的名字。她在最后一页的最后，写了自己的名字。',
        en: 'She does not write your name. At the very end of the last page, she writes her own.'
      },
      {
        type: 'narration',
        zh: '名字下面她写了一个日期。今天的日期。',
        en: 'Under it she writes a date. Today’s date.'
      },
      {
        type: 'narration',
        zh: '然后她停在了第二个日期的位置上，笔尖悬着，没有落下去。',
        en: 'Then she stops where the second date goes, nib hovering, and does not put it down.'
      },
      {
        type: 'speech',
        speakerZh: '稻荷', speakerEn: 'Inari',
        characterImage: `${I}knit_neutral.webp`,
        jp: 'これでな。わらわも、この帳面の側になった。',
        zh: '这样一来啊。我也变成这本册子里面的那一边了。',
        en: 'There. Now I too am on the inside of this book.',
        color: 'bg-amber-500'
      },
      {
        type: 'narration',
        zh: '一千年里她一直是拿笔的那个。她刚刚把自己搬到了纸上。',
        en: 'For a thousand years she has been the one holding the pen. She has just moved herself onto the paper.'
      },
      {
        type: 'speech',
        speakerZh: '稻荷', speakerEn: 'Inari',
        characterImage: `${I}shy.webp`,
        jp: 'わらわは死なぬ。じゃが、今日から数えることにした。',
        zh: '我不会死。不过，从今天开始我决定数了。',
        en: 'I will not die. But from today I have decided to count.',
        color: 'bg-amber-500'
      },
      {
        type: 'narration',
        zh: '你问数什么。她说：数跟你在一起的天数。她说这样，她也会知道"少"是什么感觉。',
        en: 'You ask what she is counting. The days with you, she says. That way she will finally know what "few" feels like.'
      },
      {
        type: 'cg',
        cgId: 'cg_inari',
        imageUrl: '/images/cg/cg_inari.webp',
        titleZh: '初雪，参道，两个影子',
        titleEn: 'First Snow, the Approach, Two Shadows',
        captionZh: '太阳从缝里下来的那一下，参道上有两个影子，都在动。她自己也发现了，愣在那儿看了很久。',
        captionEn: 'When the sun comes down through the gap there are two shadows on the approach, and both of them are moving. She notices it herself, and stands there staring for a long while.'
      },
      {
        type: 'narration',
        characterImage: `${I}happy.webp`,
        zh: '她伸手去够你的手，动作生疏得可笑——她够了两次才够到。',
        en: 'She reaches for your hand, so unpractised that it is funny. It takes her two attempts.'
      },
      {
        type: 'speech',
        speakerZh: '稻荷', speakerEn: 'Inari',
        characterImage: `${I}happy.webp`,
        jp: '一日目じゃ。ちゃんと数えるからな。',
        zh: '第一天了。我会好好数的。',
        en: 'Day one. I shall count them properly.',
        color: 'bg-amber-500'
      },
      {
        type: 'effect',
        setFlags: ['inari_ending_love', 'inari_story_3_done'],
        effects: [
          { stat: 'knowledge', amount: 3, reasonZh: '你弄懂了"看过"和"活过"的差别', reasonEn: 'You learned the difference between watching and living' },
          { stat: 'kindness', amount: 3, reasonZh: '一千年来第一次有人记住她', reasonEn: 'For the first time in a thousand years, somebody remembers her' }
        ],
        relations: [
          { char: CharacterId.INARI, familiarity: 12, affection: 26, reasonZh: '她把自己写进了那本册子', reasonEn: 'She wrote herself into the book' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'narration',
        characterImage: `${I}knit_neutral.webp`,
        zh: '她把册子重新摊开，从袖子里摸出一支笔。是铅笔。',
        en: 'She opens the book again and takes a pen from her sleeve. It is a pencil.'
      },
      {
        type: 'narration',
        zh: '她在最后一页写下了你的名字。写得很浅，浅到隔一年就会自己淡掉。',
        en: 'She writes your name on the last page, so faintly that a year would fade it on its own.'
      },
      {
        type: 'speech',
        speakerZh: '稻荷', speakerEn: 'Inari',
        characterImage: `${I}sly.webp`,
        jp: '鉛筆じゃ。消せるようにな。',
        zh: '铅笔哦。为了能擦掉。',
        en: 'Pencil. So that it can be rubbed out.',
        color: 'bg-amber-500'
      },
      {
        type: 'narration',
        zh: '你说那不写不是更省事。她摇头。',
        en: 'You say it would be simpler not to write it at all. She shakes her head.'
      },
      {
        type: 'speech',
        speakerZh: '稻荷', speakerEn: 'Inari',
        characterImage: `${I}knit_neutral.webp`,
        jp: '消せる、というのはな。消さん、と決められるということじゃ。',
        zh: '「能擦掉」这件事啊。就是「可以决定不擦」的意思。',
        en: 'That it can be rubbed out means one is able to decide not to.',
        color: 'bg-amber-500'
      },
      {
        type: 'narration',
        zh: '一千年里她所有的名字都是墨写的，因为那些不用她决定——那些人本来就会走。',
        en: 'For a thousand years every name went down in ink, because none of them required a decision. Those people were going to leave regardless.'
      },
      {
        type: 'narration',
        zh: '你的那一行是铅笔的。铅笔要每年由她重新描一遍，才能留下来。',
        en: 'Yours is in pencil. A pencil line has to be gone over again every year, by her, to survive.'
      },
      {
        type: 'narration',
        characterImage: `${I}happy.webp`,
        zh: '她站起来，把毛衣上的雪拍掉——那些雪终于化了一点。',
        en: 'She stands and knocks the snow off the jumper. Some of it has finally begun to melt.'
      },
      {
        type: 'speech',
        speakerZh: '稻荷', speakerEn: 'Inari',
        characterImage: `${I}happy.webp`,
        jp: '毎年、なぞりに来い。わらわが忘れる前にな。',
        zh: '每年都来让我描一遍。趁我还没忘之前。',
        en: 'Come every year and make me go over it. Before I forget.',
        color: 'bg-amber-500'
      },
      {
        type: 'narration',
        zh: '她不会忘。她说过她忘不掉。这是她能想出来的、最像"约定"的东西。',
        en: 'She will not forget. She has said herself that she cannot. It is the closest thing to an appointment that she can invent.'
      },
      {
        type: 'effect',
        setFlags: ['inari_ending_friend', 'inari_story_3_done'],
        effects: [
          { stat: 'knowledge', amount: 4, reasonZh: '一行铅笔字，每年描一次', reasonEn: 'One pencil line, gone over once a year' }
        ],
        relations: [
          { char: CharacterId.INARI, familiarity: 26, affection: 8, reasonZh: '她给了你一个每年一次的约定', reasonEn: 'She gave you an appointment that recurs once a year' }
        ]
      }
    ]
  }
];
