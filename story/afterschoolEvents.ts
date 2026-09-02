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
      promptZh: '老板已经把水杯放到了你面前，没问你要不要坐。',
      promptEn: 'The master has already put a glass of water in front of you. He did not ask whether you were staying.',
      options: [
        {
          id: 'ramen_sora_count',
          labelZh: '「三个碗。你这是在练什么？」',
          labelEn: '"Three bowls. What exactly are you training for?"',
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
              zh: '你吃完了。用了四十分钟。空全程一句话没说，就坐在旁边看着，像在看一场比赛的最后一分钟。',
              en: 'You finish it. It takes forty minutes. Sora says nothing the whole time; she just sits and watches, the way you watch the last minute of a game.'
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
      zh: '她没有转头。你花了两秒才确认这句是对你说的。',
      en: 'She does not turn her head. It takes you two seconds to confirm the sentence was aimed at you.'
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
              zh: '她没有把那句话说完。但这一次，她笑了一下——很浅，大概只有半秒。',
              en: 'She does not finish the sentence. But this time she smiles. Very slightly, for perhaps half a second.'
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
      zh: '她把袋子夹在腋下，走进傍晚的三宫。走了几步，又停下来，回头看了你一眼，然后继续走。',
      en: 'She tucks the bag under her arm and walks out into evening Sannomiya. A few steps on she stops, looks back at you once, and keeps going.'
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
      characterImage: `${MAKI}punk_neutral.webp`,
      zh: '打机的人个子不高，站在踏板上，节奏快得看不清手。',
      en: 'The person playing is not tall. She stands on the footplate and her hands move too fast to follow.'
    },
    {
      type: 'narration',
      zh: '曲子结束。屏幕上跳出评分。她盯着看了三秒，然后一脚踹在机器底座上。',
      en: 'The song ends. The score comes up. She stares at it for three seconds, then kicks the base of the machine.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_angry.webp`,
      jp: 'あーもう！なんでそこで切れんねん！',
      zh: '啊——真是的！为什么偏偏在那儿断了啊！',
      en: 'Argh! Why does it break right there, every time!',
      color: 'bg-pink-600'
    },
    {
      type: 'narration',
      zh: '她转过身，看见你，表情在半秒之内换了一张。',
      en: 'She turns around, sees you, and changes face inside half a second.'
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
              zh: '你被打了个稀烂。一百二十个音符，你接住了三十一个。',
              en: 'You are destroyed. A hundred and twenty notes; you hit thirty-one.'
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
              zh: '两个小时里你们吃了九样东西。她给每一样打分，标准非常严格，而且完全没有逻辑。',
              en: 'In two hours you eat nine things. She scores every one of them by criteria that are extremely strict and entirely without logic.'
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
              zh: '她把最后一个芝麻团子塞进嘴里，含糊地说了句「走啦」，然后语速就恢复正常了。',
              en: 'She puts the last sesame ball in her mouth, says something like "let us go" around it, and her pace returns to normal.'
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
          hintZh: '因为她在看',
          hintEn: 'Because she has been watching.',
          effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你开始注意到她在注意什么', reasonEn: 'You start noticing what she notices' }],
          relations: [{ char: CharacterId.NAO, familiarity: 12, affection: 6, reasonZh: '她被抓到了', reasonEn: 'She got caught' }],
          then: [
            {
              type: 'narration',
              characterImage: `${NAO}curious.webp`,
              zh: '她把咖啡杯换了只手拿，用了大概两秒钟组织语言。',
              en: 'She moves the coffee cup to her other hand, taking roughly two seconds to arrange her words.'
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
          hintZh: '直接一点',
          hintEn: 'Straightforward.',
          effects: [{ stat: 'guts', amount: 2, reasonZh: '你直接开了口', reasonEn: 'You simply asked' }],
          relations: [{ char: CharacterId.NAO, familiarity: 16, affection: 8, reasonZh: '她等这句等了一会儿了', reasonEn: 'She had been waiting for that line for a while' }],
          then: [
            {
              type: 'narration',
              characterImage: `${NAO}happy.webp`,
              zh: '她愣了半秒，然后把剩下的咖啡一口喝完，站起来拍了拍裙子。',
              en: 'She blanks for half a second, then finishes the coffee in one go, stands, and brushes off her skirt.'
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
              zh: '你坐下，点了咖啡，然后就没再说话。她也没有。',
              en: 'You sit, order a coffee, and say nothing more. Neither does she.'
            },
            {
              type: 'narration',
              zh: '这样过了大概二十分钟。中间她动了两次：一次是把书往自己那边挪了挪，一次是把你的杯子往里推了一点，免得你手肘碰到。',
              en: 'Twenty minutes pass like this. She moves twice: once to slide the book closer to herself, once to nudge your cup inward so your elbow will not catch it.'
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
          hintZh: '她把它转过去是有原因的',
          hintEn: 'There is a reason she turned it away.',
          effects: [{ stat: 'guts', amount: 2, reasonZh: '你问了不该问的那个', reasonEn: 'You asked the one you were not meant to' }],
          relations: [{ char: CharacterId.MIYUKI, familiarity: 8, affection: 4, reasonZh: '她没有生气，但也没有回答', reasonEn: 'She was not angry, and she did not answer' }],
          then: [
            {
              type: 'narration',
              characterImage: `${MIYUKI}thinking.webp`,
              zh: '她的手指在封面上停了一下。',
              en: 'Her finger pauses on the cover.'
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
              zh: '从中庭到车站要走十二分钟。这十二分钟里她指出了：你伞举得太高、走得太快、鞋带松了、以及「离那么近做什么」。',
              en: 'It is twelve minutes from the courtyard to the station. In those twelve minutes she points out that you are holding the umbrella too high, walking too fast, that your shoelace is loose, and asks what you think you are doing standing that close.'
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
      zh: '你外公那张手绘地图上，三宫以南是空白的。他没画。或者说，他画到这里就停了。',
      en: 'On your grandfather’s hand-drawn map, everything south of Sannomiya is blank. He did not draw it. Or rather, this is where he stopped drawing.'
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
      zh: '那个小孩全程没说话，鼻子贴在玻璃上。到站的时候他跟你说了句「またね」，然后被他妈妈牵走了。',
      en: 'The child says nothing the whole way, nose against the glass. At the station he says "see you" to you and is led away by his mother.'
    },
    {
      type: 'narration',
      zh: '你站在站台上想了一会儿。往北四十分钟是有马，再往东三十分钟是甲子园，再往东一小时是大阪。原来都不远。',
      en: 'You stand on the platform for a while. Forty minutes north is Arima. Thirty more to the east is Koshien. An hour past that is Osaka. None of it is far, it turns out.'
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
