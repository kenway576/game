import { MapEventDef, CharacterId } from '../types';

// ---------------------------------------------------------
// 🌇 课后小剧情
//
// 一个人出场，一次偶遇，五到八分钟看完。
// 全部由"你今天决定去哪儿"触发，不是日程表推给你的。
//
// 写作规矩（和主线一致）：
//   · 只演一次。id 同时就是"演过了"的 flag。
//   · 只能引用玩家真的经历过的事。所以几乎每条都挂 requiresFlags: ['day1_met_xxx']。
//   · 每个人的语域必须不一样——空是运动比喻、铃是极短句、真希是关西腔、
//     稻荷是千年尺度、深雪是留白、光是语速、奈绪是熟人的分寸、明日香是硬壳。
//   · 玩梗归玩梗，梗完之后必须落到人身上，不然就只是段子。
// ---------------------------------------------------------

const SORA   = '/images/characters/sora/';
const REI    = '/images/characters/rei/';
const MAKI   = '/images/characters/maki/';
const HIKARI = '/images/characters/hikari/';
const MIYUKI = '/images/characters/miyuki/';
const INARI  = '/images/characters/inari/';
const NAO    = '/images/characters/nao/';
const ASUKA  = '/images/characters/asuka/';

// ==========================================================
// 空 · 拉面太郎
// 「拉面店遇到谁谁谁」——用户点名要的那种小事件。
// 梗：体育番的特训回。她把吃拉面当成训练，而且是认真的。
// ==========================================================
const EV_RAMEN_SORA: MapEventDef = {
  id: 'ev_ramen_sora',
  locationId: 'ramen_shop_interior',
  chars: [CharacterId.SORA],
  titleZh: '第七碗',
  titleEn: 'The Seventh Bowl',
  timeSlots: ['afternoon', 'night'],
  requiresFlags: ['day1_met_sora'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'ramen_shop_interior', bgm: 'town', titleZh: '拉面 太郎', titleEn: 'Ramen Taro', subtitleZh: '傍晚 6:40', subtitleEn: '6:40 PM' },
    {
      type: 'narration',
      zh: '八个座位的店，你推门进去的时候只坐了一个人。运动包扔在脚边，占了半条过道。',
      en: 'Eight seats. Only one of them taken when you push the door open. A sports bag on the floor beside it, taking up half the aisle.'
    },
    {
      type: 'narration',
      characterImage: `${SORA}happy.webp`,
      zh: '那个人回头，嘴里还咬着面。',
      en: 'The person turns around with noodles still in their mouth.'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}happy.webp`,
      jp: 'あ。……ん、んぐ。……よぉ。',
      zh: '啊。……唔，咕。……哟。',
      en: 'Ah. ...Mm. Gulp. ...Yo.',
      color: 'bg-orange-500'
    },
    {
      type: 'narration',
      zh: '她面前摞着三个空碗。第四个正在被吃。',
      en: 'Three empty bowls stacked in front of her. A fourth is in progress.'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}neutral.webp`,
      jp: '座り。ここ、替え玉が五十円やで。神戸で一番安い。',
      words: [{ jp: '替え玉', reading: 'かえだま', zh: '加面（吃完面后再加一份）', en: 'extra noodles (added to leftover broth)' }],
      zh: '坐啊。这儿加面五十日元。全神户最便宜。',
      en: 'Sit. Extra noodles here are fifty yen. Cheapest in Kobe.',
      color: 'bg-orange-500'
    },
    {
      type: 'choice',
      promptZh: '老板已经把冰水杯砰的一声撂在面前。你暗自抹了把冷汗：四个空碗……这家伙莫非是传说中觉醒的赛亚人？',
      promptEn: 'The master sets a glass of iced water down with a solid clunk. You wipe a bead of sweat: four empty bowls... could she be an awakened Super Saiyan in disguise?',
      options: [
        {
          id: 'ramen_sora_count',
          labelZh: '「四个碗……你这是在进行哪门子的超级特训？」',
          labelEn: '"Four bowls... what kind of intense shonen training is this?"',
          jp: '丼が三つ。……何の修行？',
          words: [{ jp: '修行', reading: 'しゅぎょう', zh: '修行、苦练', en: 'training / discipline' }],
          hintZh: '正常人的第一反应',
          hintEn: 'The reaction of a normal person.',
          effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你问了正确的问题', reasonEn: 'You asked the right question' }],
          relations: [{ char: CharacterId.SORA, familiarity: 12, affection: 3, reasonZh: '她喜欢被当真', reasonEn: 'She likes being taken seriously' }],
          then: [
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}neutral.webp`,
              jp: '練習？練習ちゃうわ。……いや、練習か。うん、練習やな。',
              zh: '练习？才不是练习。……不对，是练习。嗯，是练习。',
              en: 'Training? This is not training. ...No. It is training. Yeah. It is training.',
              color: 'bg-orange-500'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}happy.webp`,
              jp: '夏の大会、フルで走ったら二時間や。二時間動くんに、あんた朝ごはん一杯で足りると思う？',
              zh: '夏天的比赛，全场跑下来两个小时。动两个小时，你觉得早饭吃一碗够吗？',
              en: 'The summer tournament runs two hours end to end. Two hours of moving. You think one bowl at breakfast covers that?',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '她说这话的时候把第四碗的汤也喝干了，碗底朝上放到那一摞的最上面。',
              en: 'As she says it she drains the fourth bowl and sets it upside down on top of the stack.'
            }
          ]
        },
        {
          id: 'ramen_sora_join',
          labelZh: '「我也来一碗。加面。」',
          labelEn: '"One for me too. With the extra noodles."',
          jp: '一杯ください。麺、大盛りで。',
          words: [{ jp: '大盛り', reading: 'おおもり', zh: '大份', en: 'large portion' }],
          hintZh: '你不知道自己在答应什么',
          hintEn: 'You do not know what you are agreeing to.',
          requires: { stat: 'guts', min: 2 },
          effects: [{ stat: 'guts', amount: 2, reasonZh: '你把自己交给了这家店', reasonEn: 'You surrendered yourself to this establishment' }],
          relations: [{ char: CharacterId.SORA, familiarity: 20, affection: 6, reasonZh: '她整晚都在看着你吃', reasonEn: 'She watched you eat all evening' }],
          then: [
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}happy.webp`,
              jp: 'おっ。ええやん。大将、こっちにも替え玉！',
              zh: '哦。可以嘛。老板，这边也加面！',
              en: 'Oh. Not bad. Master, extra noodles over here too!',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '你后来才知道，「替え玉」的正确用法是吃完面之后剩着汤加。你把它当成了「大份」。老板什么也没说，只是给了你两份。',
              en: 'You learn later that kaedama means adding noodles to the broth you have left. You had taken it to mean "large size". The master said nothing and simply gave you two servings.'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}happy.webp`,
              jp: 'あははは！ええねん、食え！残したら大将が悲しむで！',
              zh: '啊哈哈哈！没事，吃！剩下的话老板会伤心的！',
              en: 'Ahahaha! It is fine, eat! The master gets sad if you leave any!',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '你大口吃完了整整一大碗。空全程一句话没说，就坐在旁边撑着下巴看，像在专心看一场比赛的加时决胜。',
              en: 'You finish it. Sora says nothing the whole time; she just sits and watches, the way you watch the last minute of a game.'
            }
          ]
        },
        {
          id: 'ramen_sora_pay',
          labelZh: '坐下，点最小的一碗，然后偷偷问老板她那四碗多少钱',
          labelEn: 'Sit, order the smallest bowl — then quietly ask the master what her four came to',
          hintZh: '运动包很旧，鞋也是',
          hintEn: 'The sports bag is old. So are the shoes.',
          effects: [
            { stat: 'kindness', amount: 2, reasonZh: '你注意到了她没打算让人注意的事', reasonEn: 'You noticed the thing she was not planning to have noticed' },
            { stat: 'proficiency', amount: 1, reasonZh: '你压低声音的时机挑得不错', reasonEn: 'You picked a decent moment to lower your voice' }
          ],
          relations: [{ char: CharacterId.SORA, familiarity: 14, affection: 7, reasonZh: '她没让你付，但她记住了', reasonEn: 'She did not let you pay. She remembered anyway' }],
          then: [
            {
              type: 'narration',
              zh: '你在她旁边坐下，点了最便宜的那碗。趁她低头喝汤，你朝老板比了个手势，又指了指那一摞碗。',
              en: 'You sit down beside her and order the cheapest bowl. While she is bent over her broth, you catch the master’s eye and point at the stack.'
            },
            {
              type: 'narration',
              zh: '老板看了你一眼，没说话，只是用手指在台面上写了个数字：0。',
              en: 'The master looks at you, says nothing, and writes a number on the counter with one finger: 0.'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}neutral.webp`,
              jp: '……あ、それ聞いた？',
              zh: '……啊，你问了？',
              en: '...Ah. You asked, did you.',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '她没抬头。筷子还在碗里搅着。',
              en: 'She does not look up. Her chopsticks keep moving in the bowl.'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}neutral.webp`,
              jp: 'ここ、大将がバスケ部のOBやねん。「食え」って言われたら、食うしかないやろ。',
              words: [{ jp: '食う', reading: 'くう', zh: '吃（较随便的说法）', en: 'to eat (blunt / casual)' }],
              zh: '这儿的老板是篮球部的学长。被他说「吃」，那就只能吃啊。',
              en: 'The master here played for the basketball club. When he says eat, what are you going to do.',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '她说完终于抬起头，很快地看了你一眼，又移开。',
              en: 'She finally looks up, glances at you once, quickly, and away again.'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}happy.webp`,
              jp: '……で？何が言いたいん。奢ってくれるとか、そういうやつ？',
              zh: '……所以呢？想说什么。要请我之类的？',
              en: '...So? What is it you want to say. Something about buying me dinner?',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '你摇了摇头，说下次吧。她「哼」了一声，把最后一口汤喝完了。',
              en: 'You shake your head and say some other time. She snorts and finishes the last of the broth.'
            },
            {
              type: 'narration',
              zh: '走出店门的时候她走在前面，突然说了一句：「……那句『下次』，我记着了啊。」',
              en: 'On the way out she is walking ahead of you when she says, without turning round: "...I am holding you to that. The next time."'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '店里的电视在放高中棒球的重播。她抬头看了两眼，又低下去。',
      en: 'The shop TV is replaying a high school baseball game. She glances up twice and goes back down.'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}neutral.webp`,
      jp: '……うちな、ここ来るん、勝った日と負けた日だけって決めてんねん。',
      zh: '……我啊，来这儿是有规矩的。只在赢了的那天和输了的那天来。',
      en: '...I have a rule about this place, you know. I only come on days I won and days I lost.',
      color: 'bg-orange-500'
    },
    {
      type: 'narration',
      zh: '你等着她说今天是哪一种。她没说。',
      en: 'You wait for her to say which one today is. She does not.'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}happy.webp`,
      jp: 'ま、今日はどっちでもええわ。人おったし。',
      zh: '算了，今天哪种都行。反正有人在。',
      en: 'Ah well. Today can be either. There was someone here.',
      color: 'bg-orange-500'
    },
    {
      type: 'narration',
      zh: '她把碗一摞端到柜台上，冲老板举了下手。老板点了一下头。你注意到他对你也点了一下。',
      en: 'She carries the whole stack of bowls to the counter and raises a hand at the master. He nods once. You notice he nods at you as well.'
    },
    { type: 'effect', relations: [{ char: CharacterId.SORA, familiarity: 8, affection: 4, reasonZh: '她让你看见了她的规矩', reasonEn: 'She let you see one of her rules' }] }
  ]
};

// ==========================================================
// 铃 · 淳久堂书店
// 梗：致敬《凉宫春日》的长门有希——站在同一个书架前不动、
// 极短句、把人类当研究对象、然后在最后一句里露出一点不是研究的东西。
// ==========================================================
const EV_BOOKSTORE_REI: MapEventDef = {
  id: 'ev_bookstore_rei',
  locationId: 'junkudo_bookstore',
  chars: [CharacterId.REI],
  titleZh: '第四十分钟',
  titleEn: 'The Fortieth Minute',
  requiresFlags: ['day1_met_rei'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'junkudo_bookstore', bgm: 'chat', titleZh: '淳久堂书店', titleEn: 'Junkudo Books', subtitleZh: '傍晚 5:10', subtitleEn: '5:10 PM' },
    {
      type: 'narration',
      zh: '你在四楼找参考书，走过慣用句那一排的时候，看见一个人站在那里。',
      en: 'You are on the fourth floor looking for a workbook. Passing the idiom shelves, you see someone standing there.'
    },
    {
      type: 'narration',
      characterImage: `${REI}neutral.webp`,
      zh: '你买完书、结完账、又上来找漏掉的一本——她还站在那里。同一格，同一个姿势。',
      en: 'You buy your book, pay, and come back up for one you forgot. She is still standing there. Same shelf. Same posture.'
    },
    {
      type: 'speech',
      speakerZh: '铃', speakerEn: 'Rei',
      characterImage: `${REI}neutral.webp`,
      jp: '四十分。',
      zh: '四十分钟。',
      en: 'Forty minutes.',
      color: 'bg-sky-600'
    },
    {
      type: 'narration',
      zh: '她没有转头。你愣了愣才确认这句是对你说的。',
      en: 'She does not turn her head. It takes you a moment to confirm the sentence was aimed at you.'
    },
    {
      type: 'speech',
      speakerZh: '铃', speakerEn: 'Rei',
      characterImage: `${REI}neutral.webp`,
      jp: 'あなたが一階に降りてから、戻ってくるまで。四十分。',
      zh: '从你下楼，到你回来。四十分钟。',
      en: 'From when you went downstairs to when you came back. Forty minutes.',
      color: 'bg-sky-600'
    },
    {
      type: 'choice',
      promptZh: '她手里的书还停在同一页。',
      promptEn: 'The book in her hands is still open to the same page.',
      options: [
        {
          id: 'rei_book_why',
          labelZh: '「你在这一页看了四十分钟？」',
          labelEn: '"You have been on this page for forty minutes?"',
          jp: 'そのページ、四十分見てる。',
          hintZh: '关心的是她，不是那本书',
          hintEn: 'You are asking about her, not the book.',
          effects: [{ stat: 'kindness', amount: 2, reasonZh: '你问的是人不是内容', reasonEn: 'You asked about the person, not the content' }],
          relations: [{ char: CharacterId.REI, familiarity: 14, affection: 5, reasonZh: '她把书合上了', reasonEn: 'She closed the book' }],
          then: [
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}neutral.webp`,
              jp: 'この項目に、「胸が痛む」とある。',
              words: [{ jp: '胸が痛む', reading: 'むねがいたむ', zh: '心痛、难受', en: 'to feel heartache' }],
              zh: '这一条里写着「胸が痛む」。',
              en: 'This entry contains the phrase "mune ga itamu".',
              color: 'bg-sky-600'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}thinking.webp`,
              jp: '説明には「比喩」と書いてある。……比喩は、どうやって確かめるのですか。',
              zh: '说明里写着「比喻」。……比喻，要怎么确认呢。',
              en: 'The explanation says it is a metaphor. ...How does one verify a metaphor?',
              color: 'bg-sky-600'
            },
            {
              type: 'narration',
              zh: '她终于抬起头看你。表情没有变化，但你莫名觉得这个问题她已经问过很多年了。',
              en: 'She finally looks up at you. Her expression does not change, and yet you get the feeling she has been asking this for years.'
            }
          ]
        },
        {
          id: 'rei_book_alien',
          labelZh: '「你这是在观察人类吧。上次我就问过了。」',
          labelEn: '"You are observing humans again. I did ask about this last time."',
          jp: '人間を観察してるんでしょ。前にも聞いたけど。',
          hintZh: '把第一天那个玩笑接上',
          hintEn: 'Picking the day-one joke back up.',
          requiresFlag: 'day1_rei_trope',
          effects: [{ stat: 'charm', amount: 2, reasonZh: '你记得她说过什么', reasonEn: 'You remembered what she said' }],
          relations: [{ char: CharacterId.REI, familiarity: 18, affection: 7, reasonZh: '她记得你记得', reasonEn: 'She remembers that you remembered' }],
          then: [
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}neutral.webp`,
              jp: '……前回、否定はしませんでした。今回も同様です。',
              zh: '……上次我没有否定。这次也一样。',
              en: '...Last time I did not deny it. The same applies this time.',
              color: 'bg-sky-600'
            },
            {
              type: 'narration',
              zh: '她把书翻回封面，看了一眼定价，又翻回原来那一页。',
              en: 'She turns the book back to its cover, checks the price, and returns to the same page.'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}thinking.webp`,
              jp: '観察対象が、こちらを観察し返してくるとは想定していませんでした。……興味深い。',
              zh: '我没有预设到，观察对象会反过来观察我。……很有意思。',
              en: 'I had not anticipated that the subject of observation would observe back. ...Interesting.',
              color: 'bg-sky-600'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}smile.webp`,
              jp: '……というのは。',
              zh: '……我是说。',
              en: '...Which is to say.',
              color: 'bg-sky-600'
            },
            {
              type: 'narration',
              zh: '她没有把那句话说完。但这一次，她极轻微地弯了一下嘴角——转瞬即逝。',
              en: 'She does not finish the sentence. But this time she smiles. Very slightly, gone in an instant.'
            }
          ]
        },
        {
          id: 'rei_book_show',
          labelZh: '什么也不说，把手按在自己胸口上',
          labelEn: 'Say nothing. Put your hand flat on your own chest',
          hintZh: '比喻没法用查的。只能指给她看',
          hintEn: 'You cannot look a metaphor up. You can only point at it.',
          effects: [
            { stat: 'charm', amount: 2, reasonZh: '你把一个词从纸上搬到了身体上', reasonEn: 'You moved a word off the page and onto a body' },
            { stat: 'knowledge', amount: 1, reasonZh: '你想明白了比喻不能靠查', reasonEn: 'You worked out that metaphors are not lookup problems' }
          ],
          relations: [{ char: CharacterId.REI, familiarity: 16, affection: 6, reasonZh: '她第一次把手从书上拿开了', reasonEn: 'For the first time she took her hand off the book' }],
          setFlags: ['rei_chest_metaphor'],
          then: [
            {
              type: 'narration',
              zh: '你没有回答她的问题。你抬起手，按在自己胸口正中偏左的地方。手就停在那儿，没有再动。',
              en: 'You do not answer her question. You raise a hand and put it against your chest, slightly left of centre. It stays there and does not move.'
            },
            {
              type: 'narration',
              characterImage: `${REI}neutral.webp`,
              zh: '书店三楼很安静。她盯着你的手看了很久，久到你开始怀疑自己是不是做了件很蠢的事。',
              en: 'The third floor of the bookshop is very quiet. She looks at your hand for a long time — long enough that you start to wonder whether this was extremely stupid.'
            },
            {
              type: 'narration',
              characterImage: `${REI}thinking.webp`,
              zh: '然后她把书放在膝盖上，抬起自己的右手，慢慢地、非常准确地，按在了同一个位置上。',
              en: 'Then she sets the book on her knees, lifts her own right hand, and places it — slowly, and very precisely — in the same place.'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}thinking.webp`,
              jp: '……なるほど。ここ、ですか。',
              zh: '……原来如此。是这里，吗。',
              en: '...I see. Here, then.',
              color: 'bg-sky-600'
            },
            {
              type: 'narration',
              zh: '你点了点头。',
              en: 'You nod.'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}neutral.webp`,
              jp: '……今は、痛みません。',
              words: [{ jp: '痛む', reading: 'いたむ', zh: '疼痛', en: 'to hurt / to ache' }],
              zh: '……现在，不痛。',
              en: '...It does not hurt right now.',
              color: 'bg-sky-600'
            },
            {
              type: 'narration',
              zh: '「那就好。」你说。',
              en: '"Good," you say.'
            },
            {
              type: 'narration',
              characterImage: `${REI}smile.webp`,
              zh: '她把手放下来，重新翻开那本书——翻到了下一页。四十分钟以来的第一次。',
              en: 'She lowers her hand and opens the book again. To the next page. The first time in forty minutes.'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '你们一起下楼。她在收银台前把那本书买了下来。',
      en: 'You go downstairs together. At the register she buys the book.'
    },
    {
      type: 'speech',
      speakerZh: '铃', speakerEn: 'Rei',
      characterImage: `${REI}neutral.webp`,
      jp: '確かめる方法が、ひとつだけ思いつきました。',
      zh: '我想到一个能确认的方法了。',
      en: 'I have thought of one method of verification.',
      color: 'bg-sky-600'
    },
    {
      type: 'speech',
      speakerZh: '铃', speakerEn: 'Rei',
      characterImage: `${REI}neutral.webp`,
      jp: '実際にそうなるまで、待つ。',
      zh: '等到它真的发生为止。',
      en: 'Wait until it actually happens.',
      color: 'bg-sky-600'
    },
    {
      type: 'narration',
      zh: '她把袋子夹在腋下走进傍晚的三宫。走了几步停下来，回头看了你一眼。看完继续走，没有再回头。',
      en: 'She tucks the bag under her arm and walks off into the Sannomiya evening. A few paces on she stops and looks back at you. Then she keeps going, and does not look again.'
    },
    { type: 'effect', relations: [{ char: CharacterId.REI, familiarity: 6, affection: 3, reasonZh: '她回了一次头', reasonEn: 'She looked back once' }] }
  ]
};

// ==========================================================
// 真希 · 高架下
// 梗：关西腔小恶魔后辈。ざぁこ 挂在嘴上，但机器上留着的记录
// 说明她一个人在这儿待了很久。
// ==========================================================
const EV_ARCADE_MAKI: MapEventDef = {
  id: 'ev_arcade_maki',
  locationId: 'pia_kobe_arcade',
  chars: [CharacterId.MAKI],
  titleZh: '排行榜第二名',
  titleEn: 'Second on the Board',
  requiresFlags: ['day1_met_maki'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'pia_kobe_arcade', bgm: 'town', titleZh: '高架下 Piazza 神户', titleEn: 'Under the Tracks', subtitleZh: '傍晚 6:00', subtitleEn: '6:00 PM' },
    {
      type: 'narration',
      zh: '电车从头顶开过去，整条街的天花板跟着震。震完之后，你听见最里面那台音游机在响。',
      en: 'A train goes over and the whole ceiling of the street shakes with it. When it stops, you hear the rhythm game machine at the very back.'
    },
    {
      type: 'narration',
      characterImage: `${MAKI}neutral.webp`,
      zh: '打机的人个子不高，站在踏板上，节奏快得看不清手。',
      en: 'The person playing is not tall. She stands on the footplate and her hands move too fast to follow.'
    },
    {
      type: 'narration',
      zh: '曲子结束。屏幕上跳出惨淡的评分。她死死盯着屏幕，咬了咬牙，然后一脚踹在机器底座上。',
      en: 'The song ends. The score comes up. She stares at the screen, gritting her teeth, then kicks the base of the machine.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}angry.webp`,
      jp: 'あーもう！なんでそこで切れんねん！',
      zh: '啊——真是的！为什么偏偏在那儿断了啊！',
      en: 'Argh! Why does it break right there, every time!',
      color: 'bg-pink-600'
    },
    {
      type: 'narration',
      zh: '她气呼呼地转过身，撞上你的视线，脸上的羞恼瞬间收得干干净净，换上一副若无其事的冰冷表情。',
      en: 'She turns around huffing, catches your eye, and wipes the fluster from her face in an instant, putting on a cool front.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}smug.webp`,
      jp: 'あ〜、せんぱいやん。何？ うちのプレイ見に来たん？ ざぁこ♡',
      zh: '啊——是前辈嘛。干嘛？来看我打机的？杂鱼♡',
      en: 'Oh, it is Senpai. What, come to watch me play? Weakling.',
      color: 'bg-pink-600'
    },
    {
      type: 'narration',
      zh: '（‘杂、杂鱼？！’你在心里捂胸倒退半步，这扑面而来的雌小鬼压迫感是怎么回事！不行，身为正义的伙伴，绝不能在这里被后辈看扁！）',
      en: '(\'W-weakling?!\' In your mind you clutch your chest and stumble back half a step. What is this overwhelming mesugaki aura?! No—as an ally of justice, you cannot let an underclassman look down on you here!)'
    },
    {
      type: 'narration',
      zh: '你看了眼屏幕。排行榜上第一名和第二名是同一个 ID：MAKI。',
      en: 'You glance at the screen. First and second on the leaderboard are the same ID: MAKI.'
    },
    {
      type: 'choice',
      promptZh: '第一名的分数比第二名高了不到两百分。',
      promptEn: 'First place is under two hundred points above second.',
      options: [
        {
          id: 'maki_arcade_first',
          labelZh: '「你在追你自己的记录。」',
          labelEn: '"You are chasing your own record."',
          jp: '自分の記録を追ってるんだ。',
          words: [{ jp: '記録', reading: 'きろく', zh: '记录', en: 'record' }],
          hintZh: '这句她没准备好挡',
          hintEn: 'She has no defence prepared for this one.',
          effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你看懂了那块屏幕', reasonEn: 'You read the screen correctly' }],
          relations: [{ char: CharacterId.MAKI, familiarity: 16, affection: 6, reasonZh: '她一时没接上话', reasonEn: 'For once she had no line ready' }],
          then: [
            {
              type: 'narration',
              characterImage: `${MAKI}shy.webp`,
              zh: '她张了张嘴，没出声。手上的动作停在半空，然后很快地把手插回口袋。',
              en: 'Her mouth opens. Nothing comes out. Her hand stops mid-air and then goes very quickly into her pocket.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}pout.webp`,
              jp: '……せんぱい、そういうとこあるよな。人が隠しとるとこばっかり見んねん。',
              zh: '……前辈你就是有这毛病。专门看人藏起来的地方。',
              en: '...Senpai, you have got a real habit, you know. You only ever look at the parts people are hiding.',
              color: 'bg-pink-600'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}neutral.webp`,
              jp: 'そらな、二位はうちや。一位もうちや。ほんならな——',
              zh: '是啊，第二名是我。第一名也是我。那就是说——',
              en: 'Yeah. Second is me. First is me too. Which means—',
              color: 'bg-pink-600'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}neutral.webp`,
              jp: 'うちに勝てるやつ、この街におらんねん。三ヶ月ずっと。',
              zh: '这条街上没人赢得了我。整整三个月。',
              en: 'Nobody in this street can beat me. Three months straight.',
              color: 'bg-pink-600'
            },
            {
              type: 'narration',
              zh: '她说这句的时候没有笑。你才意识到，她刚才那一脚是踹给自己看的。',
              en: 'She is not smiling when she says it. Only now do you realise that kick was aimed at herself.'
            }
          ]
        },
        {
          id: 'maki_arcade_play',
          labelZh: '「我来一局。你教我。」',
          labelEn: '"Let me have a go. Teach me."',
          jp: '一回やる。教えて。',
          hintZh: '把主动权交给她',
          hintEn: 'Hand her the wheel.',
          effects: [{ stat: 'guts', amount: 1, reasonZh: '你知道自己会输', reasonEn: 'You knew you would lose' }],
          relations: [{ char: CharacterId.MAKI, familiarity: 20, affection: 5, reasonZh: '她一整局都站在你旁边', reasonEn: 'She stood beside you for the whole song' }],
          then: [
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}laugh.webp`,
              jp: 'はぁ？ せんぱいが？ ぷっ、あははは！ええで、やってみ！',
              zh: '哈？前辈你？噗，啊哈哈哈！行啊，来试试！',
              en: 'Huh? You? Pfft — ahahaha! Fine, go on then!',
              color: 'bg-pink-600'
            },
            {
              type: 'narration',
              zh: '屏幕上的判定线仿佛下了一场疾风骤雨。你一顿手忙脚乱的鬼畜操作，在连击中断的暴击音效里被打得溃不成军——一百二十个音符，你拼尽全力也只勉强接住了三十一个。',
              en: 'The notes rain down like a sudden tempest. Between your panicked flailing and the stinging chime of dropped combos, you are thoroughly dismantled—of a hundred and twenty notes, you manage to hit thirty-one.'
            },
            {
              type: 'narration',
              characterImage: `${MAKI}neutral.webp`,
              zh: '但她从头到尾站在你旁边，一句一句地喊拍子。「ここ！」「はよ！」「今！」——喊到最后声音都哑了。',
              en: 'But she stands beside you the entire time, calling the beat. Here. Faster. Now. By the end her voice has gone hoarse.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}smug.webp`,
              jp: '……三十一かぁ。初見にしては、まあ、ざぁこの中では上のほうやな。',
              zh: '……三十一啊。第一次打的话，嘛，在杂鱼里算上等的了。',
              en: '...Thirty-one, huh. For a first attempt — well. That is upper-tier, for a weakling.',
              color: 'bg-pink-600'
            }
          ]
        },
        {
          id: 'maki_arcade_name',
          labelZh: '「MAKI。……这拼法，是你自己选的吧。」',
          labelEn: '"MAKI. ...You chose those letters yourself, didn’t you."',
          jp: 'MAKI。……そのつづり、自分で選んだでしょ。',
          words: [{ jp: '選ぶ', reading: 'えらぶ', zh: '选择', en: 'to choose' }],
          hintZh: '三个月来这块屏幕上只有一个名字',
          hintEn: 'One name has been on that screen for three months.',
          effects: [
            { stat: 'knowledge', amount: 1, reasonZh: '你注意到了一块屏幕上真正在说的事', reasonEn: 'You noticed what that screen was actually saying' },
            { stat: 'charm', amount: 1, reasonZh: '你没有把它说成一件可怜的事', reasonEn: 'You said it without making it sound sad' }
          ],
          relations: [{ char: CharacterId.MAKI, familiarity: 12, affection: 8, reasonZh: '她把「输入名字」这件事讲出来了', reasonEn: 'She told you what typing that name was for' }],
          setFlags: ['maki_arcade_name'],
          then: [
            {
              type: 'narration',
              characterImage: `${MAKI}neutral.webp`,
              zh: '她瞥了一眼屏幕，又瞥了一眼你。',
              en: 'She glances at the screen. Then at you.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}neutral.webp`,
              jp: '……四文字までしか入らんねん、この機械。',
              words: [{ jp: '文字', reading: 'もじ', zh: '字符、文字', en: 'character (letter)' }],
              zh: '……这机器只能输四个字符。',
              en: '...This machine only takes four characters.',
              color: 'bg-pink-600'
            },
            {
              type: 'narration',
              zh: '她伸手在按键上敲了四下，很熟练，像敲一个背了很多遍的密码。',
              en: 'She taps four keys, fluently, the way you enter a password you have typed a thousand times.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}shy.webp`,
              jp: 'ほんまはな、下の名前でええねん。でもフルで入れたら、誰のことか分かるやろ。',
              zh: '其实呢，名字就够了。但要是全写上去，别人就知道是谁了吧。',
              en: 'Honestly, the given name would do. But if I put the whole thing in, people would know who it was.',
              color: 'bg-pink-600'
            },
            {
              type: 'narration',
              zh: '你没有问「知道了会怎么样」。',
              en: 'You do not ask what would happen if they knew.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}pout.webp`,
              jp: '……なんも言わんのな、せんぱい。',
              zh: '……什么都不说啊，前辈。',
              en: '...You are not saying anything, senpai.',
              color: 'bg-pink-600'
            },
            {
              type: 'narration',
              zh: '你说，那块屏幕上有人连着三个月都在，挺好的。',
              en: 'You say that somebody has been up on that screen for three months straight, and that seems like a good thing.'
            },
            {
              type: 'narration',
              characterImage: `${MAKI}shy.webp`,
              zh: '她「哦」了一声，转过身去投币。你看见她按下开始键之前，先把 ID 那一栏又输了一遍。',
              en: 'She says "oh", turns away and feeds in a coin. Before she hits start, you see her type the ID in one more time.'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '又一列电车从头顶过去。她抬头看了一眼天花板，等震动过去。',
      en: 'Another train passes overhead. She looks up at the ceiling and waits for the shaking to stop.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}neutral.webp`,
      jp: 'ここ、電車の音でうるさいやろ。うち、それが好きやねん。',
      zh: '这儿电车吵吧。我喜欢这个。',
      en: 'It is loud here, with the trains. I like that.',
      color: 'bg-pink-600'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}shy.webp`,
      jp: '……家、静かすぎんねん。',
      zh: '……家里太安静了。',
      en: '...It is too quiet at my house.',
      color: 'bg-pink-600'
    },
    {
      type: 'narration',
      zh: '她马上就把话题岔开了，开始讲哪台机器的判定最松。你没有追问。',
      en: 'She changes the subject immediately and starts explaining which machine has the most forgiving timing. You do not push.'
    },
    { type: 'effect', relations: [{ char: CharacterId.MAKI, familiarity: 6, affection: 4, reasonZh: '她说漏了一句', reasonEn: 'One sentence slipped out' }] }
  ]
};

// ==========================================================
// 光 · 南京町
// 梗：元気な留学生。她的语速本身就是笑点，
// 但落点是「为什么是中华街」。
// ==========================================================
const EV_NANKINMACHI_HIKARI: MapEventDef = {
  id: 'ev_nankinmachi_hikari',
  locationId: 'nankinmachi',
  chars: [CharacterId.HIKARI],
  titleZh: '一路吃过去',
  titleEn: 'Eating the Whole Street',
  requiresFlags: ['day1_met_hikari'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'nankinmachi', bgm: 'town', titleZh: '南京町', titleEn: 'Nankinmachi', subtitleZh: '傍晚 5:30', subtitleEn: '5:30 PM' },
    {
      type: 'narration',
      zh: '红灯笼从街这头挂到那头。蒸笼的白气一股股往上冒，闻起来像同时打开了十家店的门。',
      en: 'Red lanterns run the length of the street. Steam comes up off the baskets in columns; it smells like ten shop doors opening at once.'
    },
    {
      type: 'narration',
      characterImage: `${HIKARI}happy.webp`,
      zh: '有人在你背后大喊你的名字。整条街回头了一半。',
      en: 'Someone shouts your name behind you. Half the street turns around.'
    },
    {
      type: 'speech',
      speakerZh: '光', speakerEn: 'Hikari',
      characterImage: `${HIKARI}happy.webp`,
      jp: '{name}！ちょうどよかった！両手ふさがってんねん、これ持って！',
      zh: '{name}！来得正好！我两只手都满了，帮我拿着这个！',
      en: '{name}! Perfect timing! Both my hands are full — hold this!',
      color: 'bg-yellow-500'
    },
    {
      type: 'narration',
      zh: '你还没答应，手里已经多了一个纸袋。是烫的。',
      en: 'Before you can agree there is a paper bag in your hand. It is hot.'
    },
    {
      type: 'speech',
      speakerZh: '光', speakerEn: 'Hikari',
      characterImage: `${HIKARI}happy.webp`,
      jp: '豚まん、小籠包、あと胡麻団子。今から食べ比べすんねん。付き合って。',
      words: [{ jp: '食べ比べ', reading: 'たべくらべ', zh: '对比着吃、试吃比较', en: 'eating several of a thing to compare them' }],
      zh: '猪肉包、小笼包，还有芝麻团子。我现在要开始试吃对比了。陪我。',
      en: 'Pork buns, soup dumplings, and sesame balls. I am doing a taste comparison right now. Come with me.',
      color: 'bg-yellow-500'
    },
    {
      type: 'choice',
      promptZh: '她已经在往下一家走了，一边走一边回头看你有没有跟上。',
      promptEn: 'She is already walking to the next stall, glancing back to check you are following.',
      options: [
        {
          id: 'hikari_nankin_follow',
          labelZh: '跟上去。反正也没别的事。',
          labelEn: 'Follow her. You had nothing else on.',
          hintZh: '接下来两小时都归她安排了',
          hintEn: 'The next two hours now belong to her.',
          effects: [{ stat: 'charm', amount: 2, reasonZh: '你被一整条街的人看见和她在一起', reasonEn: 'The entire street saw you with her' }],
          relations: [{ char: CharacterId.HIKARI, familiarity: 16, affection: 6, reasonZh: '她最怕一个人吃', reasonEn: 'What she hates most is eating alone' }],
          then: [
            {
              type: 'narration',
              zh: '从街头吃到街尾，你们足足扫荡了九样风味小吃。她神情严肃地给每样东西逐一打分，评判标准极其严苛，而且完全没有任何科学逻辑。',
              en: 'From one end of the street to the other, you devour nine kinds of street food. She grades every single item with intense seriousness, her criteria ruthlessly strict and entirely devoid of scientific logic.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}smug.webp`,
              jp: 'ここの豚まんは八十五点。皮が厚い。でも今日は寒いから、加点で九十点。',
              zh: '这家的猪肉包八十五分。皮太厚。不过今天冷，加分，九十分。',
              en: 'These pork buns are eighty-five. The skin is too thick. But it is cold today, so with the bonus, ninety.',
              color: 'bg-yellow-500'
            }
          ]
        },
        {
          id: 'hikari_nankin_why',
          labelZh: '「你怎么老往这儿跑？」',
          labelEn: '"Why are you always down here?"',
          jp: 'どうして、いつもここに来るの。',
          hintZh: '你注意到这不是第一次了',
          hintEn: 'You have noticed this is not the first time.',
          effects: [{ stat: 'kindness', amount: 2, reasonZh: '你注意到了她的路线', reasonEn: 'You noticed where her feet keep taking her' }],
          relations: [{ char: CharacterId.HIKARI, familiarity: 12, affection: 8, reasonZh: '没人问过她这个', reasonEn: 'Nobody had asked her that' }],
          then: [
            {
              type: 'narration',
              characterImage: `${HIKARI}surprised.webp`,
              zh: '她的语速第一次慢了下来。',
              en: 'For the first time, her pace drops.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}neutral.webp`,
              jp: '……ここな、みんな大きい声で喋んねん。日本語ちゃう言葉でも、誰も見んねん。',
              zh: '……这儿啊，大家都很大声地说话。就算不是日语，也没人会看你。',
              en: '...Everyone talks loudly here. Even in a language that is not Japanese, nobody looks at you.',
              color: 'bg-yellow-500'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}shy.webp`,
              jp: 'うち、声でかいってよう言われるから。……ここやと、普通やねん。',
              zh: '我总被说嗓门大。……在这儿的话，就很普通。',
              en: 'People are always telling me I am loud. ...Here, that is just normal.',
              color: 'bg-yellow-500'
            },
            {
              type: 'narration',
              zh: '她把最后一个芝麻团子塞进嘴里，含糊地说了句「走啦」。这三个字之后，她的语速就回到平时那个速度了。',
              en: 'She puts the last sesame ball in her mouth and says, thickly, that she is off. After those words her speech goes back to its usual rate.'
            }
          ]
        },
        {
          id: 'hikari_nankin_judge',
          labelZh: '「等一下——评分标准得先定好。」',
          labelEn: '"Hold on. We need to agree on the scoring criteria first."',
          jp: '待って。……採点の基準を先に決めよう。',
          words: [{ jp: '基準', reading: 'きじゅん', zh: '标准', en: 'criteria / standard' }],
          hintZh: '既然是对比，那就认真比',
          hintEn: 'If it is a comparison, it should be a real one.',
          effects: [
            { stat: 'knowledge', amount: 1, reasonZh: '你给一场胡闹定了规则', reasonEn: 'You imposed rules on a piece of nonsense' },
            { stat: 'charm', amount: 2, reasonZh: '你把她的胡闹当成一件正经事', reasonEn: 'You treated her nonsense as a serious undertaking' }
          ],
          relations: [{ char: CharacterId.HIKARI, familiarity: 18, affection: 7, reasonZh: '从来没有人陪她把玩笑玩到底', reasonEn: 'Nobody had ever played one of her jokes all the way through' }],
          setFlags: ['hikari_nankin_rules'],
          then: [
            {
              type: 'narration',
              characterImage: `${HIKARI}surprised.webp`,
              zh: '她刹住脚，转过身来，表情像是听见了什么了不得的提案。',
              en: 'She stops dead, turns around, and looks like someone who has just heard a genuinely serious proposal.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}happy.webp`,
              jp: '……基準？基準ってなに？点数つけるだけちゃうん？',
              words: [{ jp: '基準', reading: 'きじゅん', zh: '标准、基准', en: 'criterion / standard' }],
              zh: '……标准？什么标准？不就是打个分吗？',
              en: '...Criteria? What criteria? You just give it a number, no?',
              color: 'bg-yellow-500'
            },
            {
              type: 'narration',
              zh: '你从书包里掏出手账，翻到空白页，写下三行：皮、馅、烫嘴程度。她凑过来看。看到第二行的时候笔就被抢走了。',
              en: 'You get the journal out, find a blank page, and write three lines: skin, filling, how much it burns. She leans in to look. By the second line the pen has been taken off you.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}smug.webp`,
              jp: '足りん！「一口目の幸せ度」と「三口目に飽きるかどうか」も要る！',
              zh: '不够！还得加「第一口的幸福度」和「第三口会不会腻」！',
              en: 'Not enough! You need "happiness of the first bite" and "have you got bored by the third".',
              color: 'bg-yellow-500'
            },
            {
              type: 'narration',
              zh: '不知不觉间，那一页备忘录被密密麻麻地填满了。九样小吃、五个主观维度、一个你完全看不懂的玄学加权公式，以及她在最底下即兴涂鸦的一只表情极其魔性的猪。',
              en: 'Before you know it, the memo page is packed solid. Nine items, five subjective metrics, a mystical weighting formula you cannot decipher, and an aggressively expressive pig doodled at the very bottom.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}happy.webp`,
              jp: 'これ、来月もやろ。データは多いほうがええやろ？',
              words: [{ jp: 'データ', zh: '数据', en: 'data' }],
              zh: '这个，下个月也做吧。数据越多越好对吧？',
              en: 'Let us do this again next month. More data is better, right?',
              color: 'bg-yellow-500'
            },
            {
              type: 'narration',
              zh: '「下个月」。她说得很自然，好像那已经是一件定下来的事了。',
              en: '"Next month." She says it as though it were already settled.'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '你们在广场的石阶上坐下来。她把纸袋垫在屁股底下，动作熟练得像做过一百次。',
      en: 'You sit on the stone steps in the plaza. She puts the paper bag under her to sit on, with the ease of someone who has done it a hundred times.'
    },
    {
      type: 'speech',
      speakerZh: '光', speakerEn: 'Hikari',
      characterImage: `${HIKARI}happy.webp`,
      jp: 'なあ、{name}。またここ来よな。次は餃子の店、開拓すんねん。',
      zh: '喂，{name}。下次还来这儿吧。下次去开发饺子店。',
      en: 'Hey, {name}. Let us come again. Next time we conquer the dumpling places.',
      color: 'bg-yellow-500'
    },
    { type: 'effect', relations: [{ char: CharacterId.HIKARI, familiarity: 8, affection: 4, reasonZh: '她给了你一个下次', reasonEn: 'She gave you a next time' }] }
  ]
};

// ==========================================================
// 奈绪 · 北野坂
// 幼驯染。这一段的功能除了她自己，还负责解锁西村珈琲店——
// 那种店确实得有人先带你进去一次。
// ==========================================================
const EV_SLOPE_NAO: MapEventDef = {
  id: 'ev_slope_nao',
  locationId: 'kitano_slope',
  chars: [CharacterId.NAO],
  titleZh: '半山腰那家店',
  titleEn: 'The Place Halfway Up',
  requiresFlags: ['day1_met_nao'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'kitano_slope', bgm: 'chat', titleZh: '北野坂', titleEn: 'Kitano Slope', subtitleZh: '傍晚 5:50', subtitleEn: '5:50 PM' },
    {
      type: 'narration',
      zh: '你在坡道中段停下来喘气，装作是在看那栋绿色屋顶的洋馆。',
      en: 'You stop halfway up the slope to catch your breath, pretending to look at the house with the green roof.'
    },
    {
      type: 'speech',
      speakerZh: '奈绪', speakerEn: 'Nao',
      characterImage: `${NAO}smile.webp`,
      jp: 'バレバレだから、それ。息切れてるの、ここまで聞こえてる。',
      zh: '装得也太明显了。你喘气的声音，我这儿都听得见。',
      en: 'That is extremely obvious, by the way. I can hear you wheezing from here.',
      color: 'bg-emerald-600'
    },
    {
      type: 'narration',
      zh: '她坐在一家店门口的台阶上，手边放着一杯已经喝掉一半的咖啡。深色木门，没有招牌照明，从外面看根本不像开着。',
      en: 'She is sitting on the step outside a shop, a half-finished coffee beside her. Dark wooden door, no lit sign; from outside it does not look open at all.'
    },
    {
      type: 'speech',
      speakerZh: '奈绪', speakerEn: 'Nao',
      characterImage: `${NAO}neutral.webp`,
      jp: 'ここ、にしむら。……あんた、まだ入ったことないでしょ。',
      zh: '这家是西村。……你还没进去过吧。',
      en: 'This is Nishimura. ...You have never been inside, have you.',
      color: 'bg-emerald-600'
    },
    {
      type: 'choice',
      promptZh: '她说得很肯定。她没有在猜。',
      promptEn: 'She says it flatly. She is not guessing.',
      options: [
        {
          id: 'nao_slope_how',
          labelZh: '「你怎么知道我没进去过。」',
          labelEn: '"How do you know I have never been in."',
          jp: 'なんで、入ったことないって分かるの。',
          hintZh: '因为她在看',
          hintEn: 'Because she has been watching.',
          effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你开始注意到她在注意什么', reasonEn: 'You start noticing what she notices' }],
          relations: [{ char: CharacterId.NAO, familiarity: 12, affection: 6, reasonZh: '她被抓到了', reasonEn: 'She got caught' }],
          then: [
            {
              type: 'narration',
              characterImage: `${NAO}curious.webp`,
              zh: '她把咖啡杯换了只手拿，低头沉吟了片刻才组织好语言。',
              en: 'She moves the coffee cup to her other hand, taking a moment to arrange her words.'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}neutral.webp`,
              jp: '……このへん、あたしの通学路なの。毎日通ってんの。それだけ。',
              zh: '……这一带是我的上学路。每天都走。就这样。',
              en: '...This is my route to school. I walk it every day. That is all.',
              color: 'bg-emerald-600'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}neutral.webp`,
              jp: 'で、毎日通ってると、坂の途中で立ち止まってるやつがいたら、まあ、目につくでしょ。',
              zh: '每天都走的话，坡道中间站着个人，总归会看见吧。',
              en: 'And when you walk it every day, someone standing still halfway up does tend to catch the eye.',
              color: 'bg-emerald-600'
            }
          ]
        },
        {
          id: 'nao_slope_ask',
          labelZh: '「带我进去。」',
          labelEn: '"Take me in."',
          jp: '連れてって。',
          words: [{ jp: '連れる', reading: 'つれる', zh: '带（人）', en: 'to take someone along' }],
          hintZh: '直接一点',
          hintEn: 'Straightforward.',
          effects: [{ stat: 'guts', amount: 2, reasonZh: '你直接开了口', reasonEn: 'You simply asked' }],
          relations: [{ char: CharacterId.NAO, familiarity: 16, affection: 8, reasonZh: '她等这句等了一会儿了', reasonEn: 'She had been waiting for that line for a while' }],
          then: [
            {
              type: 'narration',
              characterImage: `${NAO}happy.webp`,
              zh: '她微微一怔，随即仰头把剩下的咖啡一饮而尽，站起来拍了拍裙摆上的褶皱。',
              en: 'She blinks, then finishes the coffee in one go, stands, and brushes off her skirt.'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}happy.webp`,
              jp: '……はっや。もうちょっと粘るかと思ってた。',
              zh: '……真快。我还以为你要磨蹭一会儿。',
              en: '...That was fast. I thought you would hold out longer.',
              color: 'bg-emerald-600'
            }
          ]
        },
        {
          id: 'nao_slope_bill',
          labelZh: '掏出那张一千八百四十日元的小票，压在她杯子底下',
          labelEn: 'Take out the 1,840-yen receipt and slide it under her cup',
          hintZh: '你说过这是第一笔账',
          hintEn: 'You called it the first debt.',
          requiresFlag: 'day1_nao_receipt',
          effects: [
            { stat: 'proficiency', amount: 2, reasonZh: '你真的把那笔账记到了今天', reasonEn: 'You actually carried that account this far' },
            { stat: 'kindness', amount: 1, reasonZh: '你还的不只是钱', reasonEn: 'What you were paying back was not only money' }
          ],
          relations: [{ char: CharacterId.NAO, familiarity: 10, affection: 9, reasonZh: '她没想到你真的留着那张纸', reasonEn: 'She had not expected you to still have that piece of paper' }],
          setFlags: ['nao_debt_paid'],
          then: [
            {
              type: 'narration',
              zh: '你从钱包夹层里抽出那张已经压平了的小票，放在桌上，用她的杯子压住一角。',
              en: 'You take the receipt — flattened now — out of your wallet, put it on the table, and pin one corner under her cup.'
            },
            {
              type: 'narration',
              characterImage: `${NAO}curious.webp`,
              zh: '她低头看了一眼，愣住了。那张纸上的日期是四月十一号。',
              en: 'She looks down and stops. The date on the paper is the eleventh of April.'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}curious.webp`,
              jp: '……あんた、これ、ずっと持ってたの。',
              words: [{ jp: '持つ', reading: 'もつ', zh: '拿着、持有', en: 'to hold / to keep' }],
              zh: '……你这个，一直留着？',
              en: '...You have been carrying this the whole time?',
              color: 'bg-emerald-600'
            },
            {
              type: 'narration',
              zh: '你说，米和味噌不是从天上掉下来的。她盯着那张纸看了很久。笑出来的时候纸已经在她手里折起来了，折了两折，进了自己口袋。',
              en: 'You say that rice and miso do not fall out of the sky. She stares at the paper for a long time. By the time she laughs it is already folded in her hands, twice, and going into her own pocket.'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}happy.webp`,
              jp: 'お金はいらない。……そのかわり、これ、あたしが持っとく。',
              zh: '钱就不用了。……不过作为交换，这张我拿着。',
              en: 'I do not want the money. ...In exchange, I am keeping this.',
              color: 'bg-emerald-600'
            },
            {
              type: 'narration',
              zh: '「为什么。」你问。她已经站起来了，一边推那扇玻璃门一边说：',
              en: '"Why," you ask. She is already on her feet, pushing at the glass door as she answers:'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}smile.webp`,
              jp: '……借りがあるほうが、また会う理由になるでしょ。',
              words: [{ jp: '借り', reading: 'かり', zh: '欠下的人情 / 债', en: 'a debt owed' }],
              zh: '……欠着的话，就还有再见面的理由了吧。',
              en: '...If you still owe me, that is a reason to see each other again. Is it not.',
              color: 'bg-emerald-600'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '她推开那扇门。里面比外面看着大三倍，而且几乎听不见外面的坡道。',
      en: 'She pushes the door open. Inside is three times bigger than it looks, and the slope outside is almost inaudible.'
    },
    { type: 'scene', scene: 'nishimura_coffee_salon' },
    {
      type: 'speech',
      speakerZh: '奈绪', speakerEn: 'Nao',
      characterImage: `${NAO}neutral.webp`,
      jp: '奥から二番目の席、いつも空いてんの。理由は知らない。',
      zh: '倒数第二个座位一直是空的。原因我不知道。',
      en: 'The second seat from the back is always free. I do not know why.',
      color: 'bg-emerald-600'
    },
    {
      type: 'narration',
      zh: '你们在那个位置坐下。她点了今日咖啡，替你也点了一杯，没问你要什么。',
      en: 'You sit there. She orders the coffee of the day, and one for you as well, without asking what you want.'
    },
    {
      type: 'speech',
      speakerZh: '奈绪', speakerEn: 'Nao',
      characterImage: `${NAO}smile.webp`,
      jp: 'こういう店ってさ、一回誰かに連れてきてもらわないと、一生入らないままなんだよね。',
      zh: '这种店啊，要是没人带你进来一次，可能一辈子都不会进来。',
      en: 'Places like this — if nobody takes you in once, you can go your whole life without ever going in.',
      color: 'bg-emerald-600'
    },
    {
      type: 'speech',
      speakerZh: '奈绪', speakerEn: 'Nao',
      characterImage: `${NAO}neutral.webp`,
      jp: 'だから、これで一回。あとは自分で来れば。',
      zh: '所以，这算一次了。之后你自己来就行。',
      en: 'So that is your one time. From here you can come on your own.',
      color: 'bg-emerald-600'
    },
    {
      type: 'narration',
      zh: '她说完就低头喝咖啡了，没有看你。窗外的坡道上，路灯一盏接一盏地亮起来。',
      en: 'She says it and looks down into her cup without meeting your eyes. Outside, the streetlamps on the slope come on one after another.'
    },
    {
      type: 'effect',
      relations: [{ char: CharacterId.NAO, familiarity: 10, affection: 5, reasonZh: '她把自己的位置分给了你', reasonEn: 'She gave you a share of her own seat' }]
    }
  ]
};

// ==========================================================
// 深雪 · 西村珈琲店
// 年上的邻居。这一段全靠留白——她说的话很少，
// 但每一句都比听上去重。
// ==========================================================
const EV_COFFEE_MIYUKI: MapEventDef = {
  id: 'ev_coffee_miyuki',
  locationId: 'nishimura_coffee_salon',
  chars: [CharacterId.MIYUKI],
  titleZh: '第二杯是她请的',
  titleEn: 'The Second Cup Is On Her',
  requiresFlags: ['ev_slope_nao'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'nishimura_coffee_salon', bgm: 'chat', titleZh: '西村咖啡店', titleEn: 'Nishimura Coffee', subtitleZh: '傍晚 6:20', subtitleEn: '6:20 PM' },
    {
      type: 'narration',
      zh: '倒数第二个座位果然空着。但再往里那一个不是。',
      en: 'The second seat from the back is free, as promised. The one beyond it is not.'
    },
    {
      type: 'narration',
      characterImage: `${MIYUKI}neutral.webp`,
      zh: '深雪坐在最里面，面前摊着一本书和一杯已经凉了的咖啡。她没有在看书。',
      en: 'Miyuki is in the deepest seat with a book open in front of her and a coffee that has gone cold. She is not reading.'
    },
    {
      type: 'speech',
      speakerZh: '深雪', speakerEn: 'Miyuki',
      characterImage: `${MIYUKI}happy.webp`,
      jp: 'あら。……見つかっちゃった。',
      zh: '哎呀。……被找到了。',
      en: 'Oh my. ...You found me.',
      color: 'bg-purple-600'
    },
    {
      type: 'narration',
      zh: '她合上书，用食指按住封面，把它转了个方向推到桌子边上——像是不太想让你看见书名。',
      en: 'She closes the book, holds the cover down with one finger, turns it around and pushes it to the edge of the table, as though she would rather you did not read the title.'
    },
    {
      type: 'choice',
      promptZh: '服务生过来给她的杯子添水，她摆了摆手。',
      promptEn: 'The waiter comes to top up her cup. She waves him off.',
      options: [
        {
          id: 'miyuki_coffee_sit',
          labelZh: '在她旁边坐下，什么也不问。',
          labelEn: 'Sit down beside her and ask nothing.',
          hintZh: '有些人需要的是有人在',
          hintEn: 'Some people need presence, not questions.',
          effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没有去戳那本书', reasonEn: 'You did not poke at the book' }],
          relations: [{ char: CharacterId.MIYUKI, familiarity: 12, affection: 8, reasonZh: '她需要的正好是这个', reasonEn: 'That was exactly what she needed' }],
          then: [
            {
              type: 'narration',
              zh: '你坐下，点了咖啡。之后你没有再说话。她也没有。',
              en: 'You sit down and order a coffee. After that you do not say anything. Neither does she.'
            },
            {
              type: 'narration',
              zh: '时间在安静的翻书声里悄悄流淌。中间她只动了两次：一次是把摊开的讲义往自己那边挪了挪，一次是伸手把你的马克杯往里推了推，免得被你的手肘碰翻。',
              en: 'Time passes softly in the quiet rustle of pages. She moves only twice: once to slide the notes closer to herself, once to nudge your mug inward so your elbow will not catch it.'
            },
            {
              type: 'speech',
              speakerZh: '深雪', speakerEn: 'Miyuki',
              characterImage: `${MIYUKI}neutral.webp`,
              jp: '……ありがとう。何も聞かないでいてくれて。',
              zh: '……谢谢。谢谢你什么都不问。',
              en: '...Thank you. For not asking anything.',
              color: 'bg-purple-600'
            }
          ]
        },
        {
          id: 'miyuki_coffee_book',
          labelZh: '「那本书是什么？」',
          labelEn: '"What is the book?"',
          jp: 'それ、何の本ですか。',
          hintZh: '她把它转过去是有原因的',
          hintEn: 'There is a reason she turned it away.',
          effects: [{ stat: 'guts', amount: 2, reasonZh: '你问了不该问的那个', reasonEn: 'You asked the one you were not meant to' }],
          relations: [{ char: CharacterId.MIYUKI, familiarity: 8, affection: 4, reasonZh: '她没有生气，但也没有回答', reasonEn: 'She was not angry, and she did not answer' }],
          then: [
            {
              type: 'narration',
              characterImage: `${MIYUKI}thinking.webp`,
              zh: '她的指尖在微旧的书脊上轻轻摩挲了一瞬。',
              en: 'Her fingertips linger on the slightly worn spine for a fleeting instant.'
            },
            {
              type: 'speech',
              speakerZh: '深雪', speakerEn: 'Miyuki',
              characterImage: `${MIYUKI}happy.webp`,
              jp: 'ふふ。……いつか、ね。',
              zh: '呵呵。……以后吧。',
              en: 'Mm. ...Someday.',
              color: 'bg-purple-600'
            },
            {
              type: 'narration',
              zh: '「以后」这个词她说得很轻，轻到像是在对自己确认，而不是对你承诺。',
              en: 'She says "someday" very lightly. Light enough that it sounds like something she is confirming to herself rather than promising to you.'
            }
          ]
        },
        {
          id: 'miyuki_coffee_order',
          labelZh: '不问她，改问服务生：她刚才那杯是什么',
          labelEn: 'Do not ask her. Ask the waiter what she is drinking',
          jp: 'あの人が飲んでるの、何ですか。',
          hintZh: '她摆手拒绝了添水。那杯已经凉了很久了',
          hintEn: 'She waved off the refill. That cup has been cold a long time.',
          effects: [
            { stat: 'proficiency', amount: 2, reasonZh: '你绕开了正面提问', reasonEn: 'You went around the front door' },
            { stat: 'kindness', amount: 1, reasonZh: '你管的是那杯凉掉的咖啡，不是那本书', reasonEn: 'What you attended to was the cold coffee, not the book' }
          ],
          relations: [{ char: CharacterId.MIYUKI, familiarity: 10, affection: 7, reasonZh: '她被照顾了一次，而且没被追问', reasonEn: 'She was looked after, and not interrogated' }],
          setFlags: ['miyuki_coffee_refill'],
          then: [
            {
              type: 'narration',
              zh: '你趁她低头的时候朝服务生抬了抬下巴，指了指她的杯子。服务生看了一眼，报了个名字，你没听懂，但你点了两杯。',
              en: 'While she is looking down you catch the waiter’s eye and point at her cup. He gives you a name you do not catch, and you order two.'
            },
            {
              type: 'narration',
              characterImage: `${MIYUKI}thinking.webp`,
              zh: '热气腾腾的新咖啡悄然搁在她面前时，她有些诧异地抬起头，眼中闪过一丝不设防的怔忪。',
              en: 'When the steaming fresh cup is quietly placed before her, she looks up in slight surprise, an unguarded hesitation flitting through her eyes.'
            },
            {
              type: 'speech',
              speakerZh: '深雪', speakerEn: 'Miyuki',
              characterImage: `${MIYUKI}thinking.webp`,
              jp: 'あら。……頼んでないわよ。',
              zh: '哎呀。……我没有点哦。',
              en: 'Oh. ...I did not order this.',
              color: 'bg-purple-600'
            },
            {
              type: 'narration',
              zh: '你说，刚才那杯凉了。你没有说「你坐了多久我看得出来」，虽然那才是真话。',
              en: 'You say the old one had gone cold. You do not say that you can tell how long she has been sitting there, although that is the true version.'
            },
            {
              type: 'narration',
              characterImage: `${MIYUKI}neutral.webp`,
              zh: '她低头看了看新的那杯，又看了看自己那本合着的书，然后把书往旁边挪开了一点，给杯子腾出位置。',
              en: 'She looks at the new cup, then at her closed book, and then moves the book aside a little to make room for it.'
            },
            {
              type: 'speech',
              speakerZh: '深雪', speakerEn: 'Miyuki',
              characterImage: `${MIYUKI}happy.webp`,
              jp: '……ずるいわ、そういうの。聞かないで、ぜんぶ分かってるみたいな顔して。',
              words: [{ jp: 'ずるい', zh: '狡猾、不公平（口语里常带撒娇意味）', en: 'unfair / sly (often affectionate)' }],
              zh: '……真狡猾啊，这样。什么都不问，一副全都看穿了的样子。',
              en: '...That is unfair, you know. Asking nothing and looking as though you understand all of it.',
              color: 'bg-purple-600'
            },
            {
              type: 'narration',
              zh: '她端起杯子喝了一口。这一口她喝得很慢，但是喝完了。',
              en: 'She picks the cup up and drinks. Slowly — but she finishes it.'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '你要结账的时候，服务生说已经付过了。',
      en: 'When you go to pay, the waiter says it has already been taken care of.'
    },
    {
      type: 'speech',
      speakerZh: '深雪', speakerEn: 'Miyuki',
      characterImage: `${MIYUKI}happy.webp`,
      jp: '大家さんの特権よ。……二杯目からは自分で払ってね。',
      words: [{ jp: '大家', reading: 'おおや', zh: '房东', en: 'landlord / landlady' }],
      zh: '这是房东的特权哦。……第二杯开始你自己付。',
      en: 'Landlady privileges. ...From the second cup you pay for yourself.',
      color: 'bg-purple-600'
    },
    {
      type: 'narration',
      zh: '你们一起走回海风庄。坡很陡，她走得很慢，你也就走得很慢。',
      en: 'You walk back to Umikaze together. The slope is steep and she goes slowly, so you go slowly too.'
    },
    { type: 'effect', relations: [{ char: CharacterId.MIYUKI, familiarity: 8, affection: 4, reasonZh: '一整条坡你们都没说话', reasonEn: 'Neither of you spoke for the whole slope' }] }
  ]
};

// ==========================================================
// 稻荷 · 生田神社
// 千年狐神。梗全部押在"时间尺度不一样"上：
// 对她来说，一千五百年前和上周是同一类记忆。
// ==========================================================
const EV_SHRINE_INARI: MapEventDef = {
  id: 'ev_shrine_inari',
  locationId: 'ikuta_shrine',
  chars: [CharacterId.INARI],
  titleZh: '上一次也是四月',
  titleEn: 'Last Time Was Also April',
  requiresFlags: ['day1_met_inari'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'ikuta_shrine', bgm: 'night', titleZh: '生田神社', titleEn: 'Ikuta Shrine', subtitleZh: '傍晚 6:00', subtitleEn: '6:00 PM' },
    {
      type: 'narration',
      zh: '你穿过红色的楼门，外面商店街的声音一下子退到很远的地方去了。',
      en: 'You pass through the red gate and the noise of the shopping street outside recedes a long way at once.'
    },
    {
      type: 'narration',
      characterImage: `${INARI}neutral.webp`,
      zh: '本殿旁边的树下站着一个人。你走近了才发现，她脚下的碎石一点声音都没有。',
      en: 'Someone is standing under the tree beside the main hall. Only when you get closer do you realise the gravel under her feet makes no sound at all.'
    },
    {
      type: 'speech',
      speakerZh: '稻荷', speakerEn: 'Inari',
      characterImage: `${INARI}sly.webp`,
      jp: 'おや。人の子ではないか。……ここへは、初めてか？',
      zh: '哎呀。这不是人类的孩子吗。……第一次来这儿？',
      en: 'Oh. If it is not the human child. ...First time here?',
      color: 'bg-amber-600'
    },
    {
      type: 'narration',
      zh: '你点头。她看了看那棵树，又看了看你。',
      en: 'You nod. She looks at the tree, then back at you.'
    },
    {
      type: 'speech',
      speakerZh: '稻荷', speakerEn: 'Inari',
      characterImage: `${INARI}neutral.webp`,
      jp: 'この社はな、この街よりずっと古い。港ができたのは、つい最近のことじゃ。',
      zh: '这座神社啊，比这座城市老得多。港口是最近才有的东西。',
      en: 'This shrine is far older than this city. The port is a very recent development.',
      color: 'bg-amber-600'
    },
    {
      type: 'choice',
      promptZh: '「最近」。她用的是这个词。',
      promptEn: '"Recent". That is the word she used.',
      options: [
        {
          id: 'inari_shrine_recent',
          labelZh: '「最近？那可是 1868 年。」',
          labelEn: '"Recent? That was 1868."',
          jp: '最近？　……1868 年ですけど。',
          hintZh: '你已经隐约知道会得到什么答案了',
          hintEn: 'You already half know what answer you are going to get.',
          effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你在跟一个不用年号计时的人对表', reasonEn: 'You are syncing clocks with someone who does not count in eras' }],
          relations: [{ char: CharacterId.INARI, familiarity: 14, affection: 5, reasonZh: '她喜欢肯追问的人', reasonEn: 'She likes the ones who push back' }],
          then: [
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}smug.webp`,
              jp: 'うむ。最近じゃ。',
              zh: '嗯。最近。',
              en: 'Mm. Recent.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '她说得非常自然，一点开玩笑的意思都没有。',
              en: 'She says it entirely naturally, with no trace of a joke in it.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}neutral.webp`,
              jp: 'この木を植えたときのことは覚えておる。ずいぶんと細かった。',
              zh: '种下这棵树时候的事我还记得。当时细得很。',
              en: 'I remember when this tree was planted. It was very thin.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '你抬头看那棵树。三个人合抱都不一定围得住。',
              en: 'You look up at the tree. Three people with linked arms might not go around it.'
            }
          ]
        },
        {
          id: 'inari_shrine_lonely',
          labelZh: '「活那么久，会腻吗。」',
          labelEn: '"Living that long — do you get bored?"',
          jp: 'そんなに長く生きて、飽きませんか。',
          words: [{ jp: '飽きる', reading: 'あきる', zh: '厌倦', en: 'to get tired of' }],
          hintZh: '这个问题她大概被问过',
          hintEn: 'She has probably been asked this before.',
          effects: [{ stat: 'kindness', amount: 2, reasonZh: '你想到的是她，不是神迹', reasonEn: 'You thought about her, not the miracle' }],
          relations: [{ char: CharacterId.INARI, familiarity: 10, affection: 9, reasonZh: '这个问题上一次有人问，已经很久了', reasonEn: 'It has been a very long time since anyone asked her that' }],
          then: [
            {
              type: 'narration',
              characterImage: `${INARI}surprised.webp`,
              zh: '她的耳朵动了一下。',
              en: 'Her ears twitch.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}neutral.webp`,
              jp: '……飽きはせぬ。ただ、な。',
              zh: '……不会腻。只是啊。',
              en: '...I do not tire of it. Only.',
              color: 'bg-amber-600'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}sad.webp`,
              jp: '「また来る」と言うた者は、たいてい来ぬ。悪気があるわけではない。ただ、寿命がな。',
              zh: '说「我还会来」的人，大多不会再来。倒不是有什么恶意。只是寿命这东西。',
              en: 'Those who say they will come again mostly do not. Not out of ill will. It is simply a question of lifespan.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '她说这句的时候语气很平，就像在讲今天的天气。',
              en: 'Her tone is completely level, as though she were remarking on the weather.'
            }
          ]
        },
        {
          id: 'inari_shrine_tree',
          labelZh: '不接她的话，走过去摸了摸那棵树',
          labelEn: 'Do not answer. Walk over and put your hand on the tree',
          hintZh: '她说她记得它还很细的时候',
          hintEn: 'She said she remembers when it was thin.',
          effects: [
            { stat: 'charm', amount: 1, reasonZh: '你没有把她的话当成一个知识点', reasonEn: 'You did not treat what she said as a piece of trivia' },
            { stat: 'knowledge', amount: 1, reasonZh: '你摸到了一段没有写进任何书里的时间', reasonEn: 'You touched a stretch of time that is in no book' }
          ],
          relations: [{ char: CharacterId.INARI, familiarity: 12, affection: 7, reasonZh: '有人替她确认了那棵树确实长大了', reasonEn: 'Somebody confirmed for her that the tree really did grow' }],
          setFlags: ['inari_touched_tree'],
          then: [
            {
              type: 'narration',
              zh: '你走过去，把手掌贴在树干上。树皮很粗，手心底下能摸到一道一道的裂纹，像很多年被撑开的痕迹。',
              en: 'You walk over and lay your palm on the trunk. The bark is coarse; under your hand you can feel the split lines, like the marks of many years being forced open.'
            },
            {
              type: 'narration',
              characterImage: `${INARI}surprised.webp`,
              zh: '她没有说话。你回过头，她正看着你的手。',
              en: 'She says nothing. When you look back, she is looking at your hand.'
            },
            {
              type: 'narration',
              zh: '「长得挺好的。」你说。',
              en: '"It grew well," you say.'
            },
            {
              type: 'narration',
              characterImage: `${INARI}neutral.webp`,
              zh: '掠过耳畔的山风忽然歇了，整座神社陷入一片奇特的寂静。',
              en: 'The wind whistling through the pines suddenly stills, leaving the shrine in a deep quiet.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}neutral.webp`,
              jp: '……そうか。育ったか。',
              words: [{ jp: '育つ', reading: 'そだつ', zh: '成长、长大', en: 'to grow up' }],
              zh: '……是吗。长大了啊。',
              en: '...Is that so. It grew.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '她说得很轻。你忽然意识到，这棵树她看了几百年，可她大概从来没有走过去，用手去量过它。',
              en: 'She says it very quietly. It occurs to you that she has watched this tree for centuries, and has probably never once walked over and measured it with her hand.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}happy.webp`,
              jp: 'ふふ。……汝、面白い触り方をする。神ではなく、木のほうに触れるとはな。',
              zh: '呵呵。……你摸东西的方式挺有意思。不去碰神，倒去碰树。',
              en: 'Hmhm. ...You touch things in an interesting way. Not the god — the tree.',
              color: 'bg-amber-600'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '风穿过树，赛钱箱那边有游客在拍手。她等那声音过去了才继续说。',
      en: 'The wind goes through the tree. Over by the offering box a tourist claps twice. She waits for the sound to pass before continuing.'
    },
    {
      type: 'speech',
      speakerZh: '稻荷', speakerEn: 'Inari',
      characterImage: `${INARI}neutral.webp`,
      jp: '前にここで人の子と話したのも、四月であった。',
      zh: '上一次在这儿和人类说话，也是四月。',
      en: 'The last time I spoke with a human child here was also April.',
      color: 'bg-amber-600'
    },
    {
      type: 'choice',
      promptZh: '你有点想知道那是多久以前。',
      promptEn: 'You find you want to know how long ago that was.',
      options: [
        {
          id: 'inari_shrine_when',
          labelZh: '「上一次是什么时候？」',
          labelEn: '"When was the last time?"',
          jp: '前は、いつ？',
          hintZh: '你已经准备好听到一个吓人的数字',
          hintEn: 'You have braced yourself for a large number.',
          effects: [{ stat: 'guts', amount: 1, reasonZh: '你还是问了', reasonEn: 'You asked anyway' }],
          relations: [{ char: CharacterId.INARI, familiarity: 8, affection: 6, reasonZh: '她笑了', reasonEn: 'She laughed' }],
          then: [
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}smug.webp`,
              jp: 'ふむ。……六十年ほど前かの。',
              zh: '唔。……大概六十年前吧。',
              en: 'Hm. ...About sixty years ago, I think.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '你正要点头，她又补了一句。',
              en: 'You are about to nod when she adds one more thing.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}sly.webp`,
              jp: 'その者は、そなたの祖父ではないかのう。地図を描いておった。よう似ておる、目のあたりが。',
              zh: '那个人，该不会就是你外公吧。当时在画地图。眼睛那一带，很像。',
              en: 'That one might have been your grandfather. He was drawing a map. Around the eyes, you look very alike.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '你没有告诉过她外公画过地图。你确定。',
              en: 'You have never told her your grandfather drew maps. You are certain of that.'
            }
          ]
        },
        {
          id: 'inari_shrine_guess',
          labelZh: '不问时间，直接说：「那个人……是不是在画地图。」',
          labelEn: 'Do not ask when. Say: "That person... was drawing a map, weren’t they."',
          jp: 'その人……地図を描いてませんでしたか。',
          words: [{ jp: '描く', reading: 'かく', zh: '画', en: 'to draw' }],
          hintZh: '你手账里那一页，鸟居描了三遍',
          hintEn: 'The page in your journal where the torii is traced three times.',
          effects: [
            { stat: 'knowledge', amount: 2, reasonZh: '你自己把两件事对上了', reasonEn: 'You put the two things together yourself' },
            { stat: 'guts', amount: 1, reasonZh: '你先把猜测说出了口', reasonEn: 'You said the guess out loud first' }
          ],
          relations: [{ char: CharacterId.INARI, familiarity: 12, affection: 8, reasonZh: '她被一个人类抢了先', reasonEn: 'A human got there before she did' }],
          setFlags: ['inari_guessed_grandfather'],
          then: [
            {
              type: 'narration',
              zh: '你把手账从书包里抽出来，翻到那一页——同一个鸟居，描了三遍。你没有说下去。',
              en: 'You take the journal out and open it to that page: the same torii, traced three times. You do not say anything further.'
            },
            {
              type: 'narration',
              characterImage: `${INARI}surprised.webp`,
              zh: '她第一次露出了那种表情——不是神的表情，是被抢了话的人的表情。',
              en: 'For the first time she wears an expression that is not a god’s. It is the expression of someone who has just been beaten to the punch.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}surprised.webp`,
              jp: '……ほう。妾より先に言うか。',
              zh: '……哦。竟然抢在我前面说了。',
              en: '...Oh. You said it before I could.',
              color: 'bg-amber-600'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}neutral.webp`,
              jp: '六十年ほど前じゃ。ここに座って、その鳥居を三度なぞっておった。……よう似ておる、目のあたりが。',
              words: [{ jp: 'なぞる', zh: '描摹、沿着描', en: 'to trace over' }],
              zh: '大概六十年前。他坐在这儿，把那座鸟居描了三遍。……眼睛那一带，很像。',
              en: 'Some sixty years ago. He sat here and traced that torii three times over. ...Around the eyes, you look very alike.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '你低头看那三条重叠的线。他描第三遍的时候在想什么，你永远不会知道了。',
              en: 'You look down at the three overlapping outlines. What he was thinking on the third pass is something you will never know.'
            }
          ]
        },
        {
          id: 'inari_shrine_dont',
          labelZh: '「……算了。我不想知道。」',
          labelEn: '"...Never mind. I do not want to know."',
          jp: '……やっぱりいい。聞きたくない。',
          hintZh: '有些数字听了就回不去了',
          hintEn: 'Some numbers you cannot un-hear.',
          effects: [
            { stat: 'proficiency', amount: 1, reasonZh: '你学会了不去掀开每一块石头', reasonEn: 'You are learning not to turn over every stone' }
          ],
          relations: [{ char: CharacterId.INARI, familiarity: 10, affection: 6, reasonZh: '她偏要说，这本身就是一种在意', reasonEn: 'She told you anyway, which is its own kind of caring' }],
          setFlags: ['inari_refused_to_ask'],
          then: [
            {
              type: 'narration',
              characterImage: `${INARI}smug.webp`,
              zh: '她挑了挑眉，像是听见了一个很新鲜的回答。',
              en: 'Her eyebrows go up, as though that were a genuinely novel answer.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}smug.webp`,
              jp: '知りとうないと申すか。……ふふ、ならば余計に言うてやろう。',
              zh: '说是不想知道啊。……呵呵，那我就偏要说了。',
              en: 'You say you do not want to know. ...Hmhm. Then I shall tell you precisely because of that.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '你转身想走。她在你身后继续说，语速一点也没有加快。',
              en: 'You turn to go. She keeps talking behind you, not hurrying at all.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}neutral.webp`,
              jp: '六十年ほど前じゃ。地図を描いておった人の子でな。……よう似ておるぞ、目のあたりが。',
              zh: '大概六十年前。是个在画地图的人类。……很像啊，眼睛那一带。',
              en: 'Some sixty years ago. A human child who was drawing a map. ...You look very alike, around the eyes.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '你的脚步骤然顿在石阶边缘，脊背漫上一阵真实的寒意。你从来没有向任何人提起过外公曾走遍神户绘制地图的事——你百分之百确定。',
              en: 'Your boots halt dead on the edge of the stone step, a real chill climbing up your spine. You have never mentioned to a living soul that your grandfather walked all of Kobe mapping its streets—you are one hundred percent certain.'
            },
            {
              type: 'narration',
              zh: '身后传来她很轻的一声笑：「所以说，不想知道的事，往往才是真的。」',
              en: 'Behind you comes a very small laugh. "Which is generally how it goes. The things you would rather not know tend to be the true ones."'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '她转身往本殿后面走。碎石在她脚下依然一点声音也没有。',
      en: 'She turns and walks around behind the main hall. The gravel under her feet still makes no sound whatsoever.'
    },
    {
      type: 'speech',
      speakerZh: '稻荷', speakerEn: 'Inari',
      characterImage: `${INARI}neutral.webp`,
      jp: 'また来やれ。……今度は、来るであろう？',
      zh: '再来吧。……这次，会来的吧？',
      en: 'Come again. ...This time you will, will you not?',
      color: 'bg-amber-600'
    },
    { type: 'effect', relations: [{ char: CharacterId.INARI, familiarity: 6, affection: 5, reasonZh: '她第一次用了疑问句', reasonEn: 'For the first time she ended on a question' }] }
  ]
};

// ==========================================================
// 明日香 · 中庭（限雨天）
// 硬壳。她在雨里站着不肯进去，理由极其站不住脚。
// 天气限定——这也是天气系统第一次真正影响到能玩什么。
// ==========================================================
const EV_COURTYARD_ASUKA: MapEventDef = {
  id: 'ev_courtyard_asuka',
  locationId: 'courtyard_rain',
  chars: [CharacterId.ASUKA],
  titleZh: '雨棚下面站不下两个人',
  titleEn: 'The Awning Does Not Fit Two',
  weather: ['rainy'],
  requiresFlags: ['day1_met_asuka'],
  priority: 10,
  script: [
    { type: 'scene', scene: 'courtyard_rain', bgm: 'chat', titleZh: '中庭', titleEn: 'The Courtyard', subtitleZh: '放学后 · 雨', subtitleEn: 'After School · Rain' },
    {
      type: 'narration',
      zh: '雨下得不大，但没停。你从走廊经过的时候，看见中庭的雨棚下站着一个人。',
      en: 'The rain is not heavy, but it has not stopped. Passing along the corridor, you see someone standing under the courtyard awning.'
    },
    {
      type: 'narration',
      characterImage: `${ASUKA}neutral.webp`,
      zh: '明日香。手里拎着书包，站得笔直，像在等什么。但中庭这个位置，不是任何人会等人的地方。',
      en: 'Asuka. Bag in hand, standing perfectly straight, as though waiting for something. But the courtyard is not a place anybody waits for anybody.'
    },
    {
      type: 'speech',
      speakerZh: '明日香', speakerEn: 'Asuka',
      characterImage: `${ASUKA}angry.webp`,
      jp: '……何よ。',
      zh: '……干嘛。',
      en: '...What.',
      color: 'bg-red-600'
    },
    {
      type: 'narration',
      zh: '你还什么都没说。',
      en: 'You have not said anything yet.'
    },
    {
      type: 'speech',
      speakerZh: '明日香', speakerEn: 'Asuka',
      characterImage: `${ASUKA}neutral.webp`,
      jp: '傘、忘れただけ。すぐ止むわ。……天気予報でそう言ってたもの。',
      zh: '只是忘了带伞。马上就会停。……天气预报是那么说的。',
      en: 'I just forgot my umbrella. It will stop shortly. ...The forecast said so.',
      color: 'bg-red-600'
    },
    {
      type: 'narration',
      zh: '你今天早上看过天气预报。今天全天有雨。',
      en: 'You checked the forecast this morning. Rain all day.'
    },
    {
      type: 'choice',
      promptZh: '雨棚很窄，站两个人的话，其中一个的肩膀会淋到。',
      promptEn: 'The awning is narrow. With two people under it, one of them gets a wet shoulder.',
      options: [
        {
          id: 'asuka_rain_umbrella',
          labelZh: '把伞递过去，然后走进雨里。',
          labelEn: 'Hand her the umbrella and walk out into the rain.',
          hintZh: '不给她拒绝的时间',
          hintEn: 'Give her no window to refuse.',
          effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没给她台阶，你直接把台阶撤了', reasonEn: 'You did not offer her an out; you removed the need for one' }],
          relations: [{ char: CharacterId.ASUKA, familiarity: 10, affection: 10, reasonZh: '她在你身后喊了两声，你都没回头', reasonEn: 'She called after you twice and you did not turn around' }],
          then: [
            {
              type: 'narration',
              zh: '你把伞塞进她手里，转身就走。',
              en: 'You push the umbrella into her hands and go.'
            },
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${ASUKA}surprised.webp`,
              jp: 'ちょ、ちょっと！誰が——待ちなさいってば！',
              zh: '等、等一下！谁说要——我叫你等一下啊！',
              en: 'W-wait! Who said I — I said wait!',
              color: 'bg-red-600'
            },
            {
              type: 'narration',
              zh: '你走到校门口才停下。回头看，雨棚下面已经没有人了。',
              en: 'You do not stop until the school gate. Looking back, there is nobody under the awning any more.'
            },
            {
              type: 'narration',
              zh: '第二天早上，你的桌子上放着一把叠得极其工整的伞，和一张便条：「洗过了。以后天气预报要看到晚上。」',
              en: 'The next morning there is an extremely neatly folded umbrella on your desk, and a note: "It has been cleaned. In future, read the forecast through to the evening."'
            }
          ]
        },
        {
          id: 'asuka_rain_share',
          labelZh: '「一起走。我送你到车站。」',
          labelEn: '"Come on. I will walk you to the station."',
          jp: '一緒に行こう。駅まで送る。',
          words: [{ jp: '送る', reading: 'おくる', zh: '送（人）', en: 'to see someone off' }],
          hintZh: '一把伞，两个人，很挤',
          hintEn: 'One umbrella. Two people. Tight.',
          requires: { stat: 'guts', min: 3 },
          effects: [{ stat: 'guts', amount: 2, reasonZh: '你知道她会说什么，还是说了', reasonEn: 'You knew what she would say and said it anyway' }],
          relations: [{ char: CharacterId.ASUKA, familiarity: 16, affection: 12, reasonZh: '她走了一路都在挑刺，一次也没走开', reasonEn: 'She complained the entire way and never once stepped away' }],
          then: [
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${ASUKA}shy.webp`,
              jp: 'は？いや、そんな……別に、頼んでな——',
              zh: '哈？不，那个……我又没有，拜托你——',
              en: 'Huh? No, that is — I never asked you to—',
              color: 'bg-red-600'
            },
            {
              type: 'narration',
              zh: '她说到一半就没说了，因为你已经把伞举到了她头上。',
              en: 'She stops halfway, because the umbrella is already over her head.'
            },
            {
              type: 'narration',
              zh: '从中庭一路走到车站，她嘴上就没闲着，接连挑了你一堆毛病：伞举得太高、步伐走得太快、鞋带散了，以及气鼓鼓的那句「离那么近做什么」。',
              en: 'From the courtyard to the station, she does not stop pointing out flaws: you hold the umbrella too high, walk too fast, your shoelace is untied, and a flustered "what are you doing standing so close".'
            },
            {
              type: 'narration',
              characterImage: `${ASUKA}shy.webp`,
              zh: '但她一次也没有往旁边挪。',
              en: 'She does not once move to the side.'
            },
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${ASUKA}shy.webp`,
              jp: '……明日、晴れるって。だから、その、これは今日だけ。',
              zh: '……明天会放晴。所以，那个，这只有今天。',
              en: '...It is supposed to be clear tomorrow. So — this is only for today.',
              color: 'bg-red-600'
            },
            {
              type: 'narration',
              zh: '她说完就进闸机了，没有回头。你想起来，她刚才说她没看晚上的预报。',
              en: 'She goes through the gates without looking back. It occurs to you that a moment ago she said she had not read the evening forecast.'
            }
          ]
        },
        {
          id: 'asuka_rain_wait',
          labelZh: '收起伞，在她旁边站下来一起等',
          labelEn: 'Close the umbrella and stand there waiting with her',
          hintZh: '她说了「等一会儿就停」。那就等',
          hintEn: 'She said it would stop soon. So wait.',
          effects: [
            { stat: 'kindness', amount: 2, reasonZh: '你陪一个不肯接受帮助的人一起淋', reasonEn: 'You got rained on alongside someone who would not accept help' },
            { stat: 'guts', amount: 1, reasonZh: '什么也不做，比做点什么更难', reasonEn: 'Doing nothing turned out to be the harder option' }
          ],
          relations: [{ char: CharacterId.ASUKA, familiarity: 14, affection: 9, reasonZh: '她第一次没能把人赶走', reasonEn: 'For once she failed to make someone leave' }],
          setFlags: ['asuka_rain_waited'],
          then: [
            {
              type: 'narration',
              zh: '你把伞收拢立在墙角，退到雨棚阴凉处她身侧不远的位置站定。伞尖滴落的雨水在水泥地面上晕开一圈深暗的水痕。',
              en: 'You close the umbrella, lean it against the wall, and take the half metre of awning next to her. Water runs off the tip and darkens a small circle on the ground.'
            },
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${ASUKA}surprised.webp`,
              jp: '……なんで閉じたのよ。持ってるでしょ、傘。',
              words: [{ jp: '傘', reading: 'かさ', zh: '伞', en: 'umbrella' }],
              zh: '……你干嘛把伞收了。你明明有伞吧。',
              en: '...Why did you close it. You have an umbrella.',
              color: 'bg-red-600'
            },
            {
              type: 'narration',
              zh: '你说，你说等一会儿就停。她张了张嘴，没说出话来。',
              en: 'You say: you told me it would stop soon. Her mouth opens and nothing comes out.'
            },
            {
              type: 'narration',
              zh: '雨丝毫没有减弱的意思。两人并肩立在窄窄的雨檐下，谁都没有再开口打破沉默。斜飞的雨丝慢慢浸湿了她半边肩膀，你这一侧的袖管也是。',
              en: 'The rain shows no sign of easing. Neither of you speaks for a long while. Spray slowly soaks her shoulder, and yours too.'
            },
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${ASUKA}shy.webp`,
              jp: '……ばかじゃないの。二人とも濡れてるだけじゃない。',
              zh: '……你是不是傻。这不就是两个人一起淋湿吗。',
              en: '...Are you stupid? Now there are simply two of us getting wet.',
              color: 'bg-red-600'
            },
            {
              type: 'narration',
              zh: '「嗯。」你说。',
              en: '"Yeah," you say.'
            },
            {
              type: 'narration',
              characterImage: `${ASUKA}shy.webp`,
              zh: '她又沉默了一会儿，然后伸手把靠在墙边的伞拿了起来，撑开，举到你们两个人中间——高度还是不太对，但她没有让开。',
              en: 'She is quiet a while longer. Then she reaches for the umbrella against the wall, opens it, and holds it between the two of you. The height is still wrong. She does not step away.'
            },
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${ASUKA}shy.webp`,
              jp: '……言っとくけど。これは、あんたが風邪ひいたらクラスが困るからよ。',
              zh: '……先说好。这是因为你要是感冒了，班上会很麻烦。',
              en: '...For the record. This is because if you catch cold it becomes the class’s problem.',
              color: 'bg-red-600'
            },
            {
              type: 'narration',
              zh: '不知过了多久，雨云终于散开。她刚才说了那么多气话，唯独这一句关于天气的预言应验了。',
              en: 'Before long, the clouds part and the sky clears. Of all the sharp things she muttered, only that weather prediction turned out to be true.'
            }
          ]
        }
      ]
    },
    { type: 'effect', relations: [{ char: CharacterId.ASUKA, familiarity: 4, affection: 3, reasonZh: '她在雨里等的到底是什么，你没问', reasonEn: 'You never asked what she was actually waiting for' }] }
  ]
};

// ==========================================================
// 探索事件（没有角色出场，负责把地图往外推）
// ==========================================================
const EV_SANNOMIYA_FIRST: MapEventDef = {
  id: 'ev_sannomiya_first',
  locationId: 'sannomiya_station',
  chars: [],
  titleZh: '五条线',
  titleEn: 'Five Lines',
  requiresFlags: ['day1_done'],
  priority: 50,
  script: [
    { type: 'scene', scene: 'sannomiya_station', bgm: 'town', titleZh: '三宫站', titleEn: 'Sannomiya Station', subtitleZh: '放学后', subtitleEn: 'After School' },
    {
      type: 'narration',
      zh: '你是第一次一个人站在这个路口。JR、阪急、阪神、地铁——四块指示牌各指一个方向，你转了一圈才把它们看全。',
      en: 'It is the first time you have stood at this intersection alone. JR, Hankyu, Hanshin, subway: four sets of signs pointing four ways. You have to turn all the way around to take them in.'
    },
    {
      type: 'narration',
      zh: '第五块牌子在最边上，字最小，上面写着「ポートライナー」，箭头指向南边。',
      en: 'A fifth sign sits at the very edge in the smallest type. PORT LINER, with an arrow pointing south.'
    },
    {
      type: 'narration',
      zh: '你顺着箭头走了几步，从高架的缝隙里看见了海。原来那边是海。',
      en: 'You follow the arrow a few steps and catch sight of water through a gap in the elevated tracks. So that is where the sea is.'
    },
    {
      type: 'narration',
      zh: '你外公那张泛黄的手绘地图上，三宫以南延展向大海的整片街区皆是空白。他没有画下去——或者说，他的笔尖在定格于这里的那一刻，便永远停了下来。',
      en: 'On your grandfather’s yellowed, hand-drawn map, the entire block extending south from Sannomiya to the sea is blank. He did not continue—or rather, the moment his pen came to rest here, it stopped for good.'
    },
    {
      type: 'effect',
      setFlags: ['map_harbor'],
      effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你把这座城市的南边打开了', reasonEn: 'You opened up the south half of this city' }]
    }
  ]
};

const EV_PORTLINER_FIRST: MapEventDef = {
  id: 'ev_portliner_first',
  locationId: 'portliner_platform',
  chars: [],
  titleZh: '最前面那一节',
  titleEn: 'The Front Carriage',
  requiresFlags: ['map_harbor'],
  priority: 50,
  script: [
    { type: 'scene', scene: 'portliner_platform', bgm: 'town', titleZh: 'Port Liner', titleEn: 'Port Liner', subtitleZh: '傍晚', subtitleEn: 'Evening' },
    {
      type: 'narration',
      zh: '车进站的时候你才发现最前面那节没有司机座。整块玻璃就是前窗。',
      en: 'When the train pulls in you notice the front carriage has no driver seat. The entire pane of glass is the windscreen.'
    },
    {
      type: 'narration',
      zh: '一个大概六岁的小孩比你先冲进去，占了正中间的位置。你在他旁边站着。',
      en: 'A child of about six gets there before you and takes the exact centre. You stand next to him.'
    },
    {
      type: 'narration',
      zh: '轨道爬上高架，在海面上转了一个很大的弯。整座城市在窗子里横着扫过去——山、街、港、你住的那片山腰。',
      en: 'The track climbs the viaduct and swings out over the water in a long curve. The whole city sweeps sideways across the window: the mountains, the streets, the port, the hillside you live on.'
    },
    {
      type: 'narration',
      zh: '那个小孩全程没说话，鼻子贴在玻璃上。到站的时候他跟你说了句「またね」。他妈妈牵着他走的时候他还在回头。',
      en: 'The child does not say a word the whole way, nose against the glass. At the stop he tells you "see you". His mother leads him off and he is still looking back.'
    },
    {
      type: 'narration',
      zh: '你站在站台上吹着晚风。往北坐电车是有马温泉，往东是甲子园，再往前便是大阪。原来都在咫尺之间。',
      en: 'You stand on the platform feeling the evening wind. To the north lies Arima, to the east Koshien, and further ahead is Osaka. None of it feels far.'
    },
    {
      type: 'effect',
      setFlags: ['map_far'],
      effects: [{ stat: 'guts', amount: 2, reasonZh: '你决定以后可以往更远的地方去', reasonEn: 'You decided you were allowed to go further' }]
    }
  ]
};

export const AFTERSCHOOL_EVENTS: MapEventDef[] = [
  EV_RAMEN_SORA,
  EV_BOOKSTORE_REI,
  EV_ARCADE_MAKI,
  EV_NANKINMACHI_HIKARI,
  EV_SLOPE_NAO,
  EV_COFFEE_MIYUKI,
  EV_SHRINE_INARI,
  EV_COURTYARD_ASUKA,
  EV_SANNOMIYA_FIRST,
  EV_PORTLINER_FIRST
];
