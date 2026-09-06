import { MapEventDef, CharacterId } from '../types';

// ---------------------------------------------------------
// 👥 多人剧情
//
// 和课后小剧情用的是同一套结构，区别只在 chars 里不止一个人。
// 但写法完全不一样：
//
//   单人剧情是"你看见了她一个人的时候是什么样"。
//   多人剧情是"她们互相在场的时候，各自会怎么改写自己"。
//
// 所以这里的重点不是主角和某个人的对话，而是**她们之间的化学反应**，
// 主角很多时候只是那个把两个不该碰面的人放到同一张桌子边的人。
//
// 门槛也不一样：要两个人都熟到一定程度才会一起出现。
// 你不能带一个还只见过一次面的人去参加三个人的饭局。
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
// 空 × 真希 · 拉面太郎
// 两个都不肯输的人，被放进一家只有八个座位的店。
// 主角在这一段里几乎只负责付钱和看着。
// ==========================================================
const EV_GROUP_RAMEN: MapEventDef = {
  id: 'ev_group_ramen',
  locationId: 'ramen_shop_interior',
  chars: [CharacterId.SORA, CharacterId.MAKI],
  titleZh: '八个座位，两个笨蛋',
  titleEn: 'Eight Seats, Two Idiots',
  timeSlots: ['afternoon', 'night'],
  requiresFlags: ['ev_ramen_sora', 'ev_arcade_maki'],
  minFamiliarity: { [CharacterId.SORA]: 60, [CharacterId.MAKI]: 60 },
  priority: 30,
  script: [
    { type: 'scene', scene: 'ramen_shop_interior', bgm: 'town', titleZh: '拉面 太郎', titleEn: 'Ramen Taro', subtitleZh: '傍晚 7:00', subtitleEn: '7:00 PM' },
    {
      type: 'narration',
      zh: '你只是想吃碗面。你推门进去的时候，吧台上已经坐着两个人，中间隔了三个空位，谁也不看谁。',
      en: 'You only wanted a bowl of noodles. When you open the door there are already two people at the counter, three empty seats between them, neither looking at the other.'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}neutral.webp`,
      jp: '……あ、来た。おい、こいつ誰なん。さっきから隣おんねん。',
      zh: '……啊，来了。喂，这家伙是谁啊。刚才就一直坐旁边。',
      en: '...Ah, there you are. Oi. Who is this. She has been sitting there this whole time.',
      color: 'bg-orange-500'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_pout.webp`,
      jp: '「こいつ」ちゃうわ。うちの席や、そこ。三ヶ月前から。',
      zh: '什么「这家伙」啊。那是我的位子。三个月前就是了。',
      en: 'Do not "this" me. That is my seat. Has been for three months.',
      color: 'bg-pink-600'
    },
    {
      type: 'narration',
      zh: '你在她们中间坐下。这是唯一的空位组合。',
      en: 'You sit down between them. It is the only arrangement the empty seats allow.'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}happy.webp`,
      jp: 'ふーん。……ほんなら、替え玉何回いける？',
      zh: '嗯——。……那，加面能加几次？',
      en: 'Hmm. ...Right then. How many rounds of extra noodles can you do?',
      color: 'bg-orange-500'
    },
    {
      type: 'narration',
      zh: '你想说这不是一个正常的搭话方式。但已经晚了。',
      en: 'You want to point out that this is not a normal way to open a conversation. It is already too late.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_neutral.webp`,
      jp: '……三回。',
      zh: '……三次。',
      en: '...Three.',
      color: 'bg-pink-600'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}happy.webp`,
      jp: 'うちは五回。',
      zh: '我五次。',
      en: 'I do five.',
      color: 'bg-orange-500'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_angry.webp`,
      jp: '……四回。',
      zh: '……四次。',
      en: '...Four.',
      color: 'bg-pink-600'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}happy.webp`,
      jp: '増えとるやんけ。',
      zh: '你这数字还涨了啊。',
      en: 'Your number went up.',
      color: 'bg-orange-500'
    },
    {
      type: 'choice',
      promptZh: '老板已经把两只碗放上来了。他没有问。',
      promptEn: 'The master has already set down two bowls. He did not ask.',
      options: [
        {
          id: 'group_ramen_stop',
          labelZh: '「你们两个先冷静一下。」',
          labelEn: '"Could you two calm down for one second."',
          jp: '二人とも、ちょっと落ち着いて。',
          words: [{ jp: '落ち着く', reading: 'おちつく', zh: '冷静', en: 'to calm down' }],
          hintZh: '成年人的选择',
          hintEn: 'The choice of an adult.',
          effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你至少试过了', reasonEn: 'You did at least try' }],
          relations: [
            { char: CharacterId.SORA, familiarity: 6, affection: 2, reasonZh: '她假装没听见', reasonEn: 'She pretended not to hear' },
            { char: CharacterId.MAKI, familiarity: 6, affection: 2, reasonZh: '她也假装没听见', reasonEn: 'She also pretended not to hear' }
          ],
          then: [
            {
              type: 'narration',
              zh: '她们同时转过头看了你一眼。转回去也是同时的。第一口面也是。',
              en: 'They both turn and look at you at the same moment. They turn back at the same moment. The first mouthful of noodles goes in at the same moment.'
            },
            {
              type: 'narration',
              zh: '你放弃了。',
              en: 'You give up.'
            }
          ]
        },
        {
          id: 'group_ramen_fuel',
          labelZh: '「我请客。输的人洗碗。」',
          labelEn: '"My treat. Loser does the dishes."',
          jp: 'おごる。負けたほうが皿洗い。',
          words: [{ jp: 'おごる', reading: 'おごる', zh: '请客', en: 'to treat / to pay' }],
          hintZh: '你选择了火上浇油',
          hintEn: 'You have chosen to add fuel.',
          effects: [{ stat: 'charm', amount: 3, reasonZh: '你成了这一晚的主办方', reasonEn: 'You became the organiser of the evening' }],
          relations: [
            { char: CharacterId.SORA, familiarity: 14, affection: 5, reasonZh: '她赢了，而且是当着人赢的', reasonEn: 'She won, and she won in front of someone' },
            { char: CharacterId.MAKI, familiarity: 14, affection: 5, reasonZh: '她输了，但没人笑她', reasonEn: 'She lost, and nobody laughed at her' }
          ],
          then: [
            {
              type: 'narration',
              zh: '接下来的大半个钟头里，这家只有八个吧台座的小拉面馆俨然变成了决战擂台。老板自始至终一言不发，但他甩干面条、捞起面篓的动作肉眼可见地越来越利落。',
              en: 'For the next while this eight-seat shop becomes a venue. The master says nothing throughout, but the bowls start coming faster.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}punk_angry.webp`,
              jp: 'ま、まだいける……いける、って！',
              zh: '还、还能吃……我说还能吃！',
              en: 'I-I can still go... I said I can still go!',
              color: 'bg-pink-600'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}happy.webp`,
              jp: '無理すな、後輩。腹壊すで。',
              zh: '别硬撑，后辈。会吃坏肚子的。',
              en: 'Do not push it, kouhai. You will make yourself sick.',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '真希在第四碗的一半停了下来。空吃到了第六碗，然后把最后半碗推给了真希。',
              en: 'Maki stops halfway through the fourth. Sora gets to the sixth, then pushes the last half bowl over to Maki.'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}neutral.webp`,
              jp: '半分こなら、引き分けでええやろ。',
              zh: '分一半的话，就算平手吧。',
              en: 'If we split it, we can call it a draw.',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              characterImage: `${MAKI}punk_pout.webp`,
              zh: '真希盯着那半碗面看了很久，然后一句话也没说地吃完了。',
              en: 'Maki stares at that half bowl for a long time and then finishes it without a word.'
            }
          ]
        },
        {
          id: 'group_ramen_third',
          labelZh: '一言不发，自己也点了一碗，坐到两个人中间',
          labelEn: 'Say nothing. Order a bowl of your own and sit down between them',
          hintZh: '劝不动，也不加油。那就一起吃',
          hintEn: 'You cannot stop it and you will not fuel it. So eat.',
          effects: [
            { stat: 'guts', amount: 2, reasonZh: '你把自己放进了两个人的战场中间', reasonEn: 'You put yourself in the middle of somebody else’s battlefield' },
            { stat: 'proficiency', amount: 1, reasonZh: '你终于学会了怎么用替え玉', reasonEn: 'You finally learned what kaedama is actually for' }
          ],
          relations: [
            { char: CharacterId.SORA, familiarity: 12, affection: 4, reasonZh: '有人愿意坐进来，她比赢了还高兴', reasonEn: 'Someone sitting down with her beat winning' },
            { char: CharacterId.MAKI, familiarity: 12, affection: 6, reasonZh: '她不再是那个被围观的人了', reasonEn: 'She stopped being the one being watched' }
          ],
          setFlags: ['group_ramen_joined'],
          then: [
            {
              type: 'narration',
              zh: '你在两只碗中间拉开一张凳子坐下，朝老板伸出一根手指。老板点了点头，一句话没问。',
              en: 'You pull out the stool between the two bowls, sit, and hold one finger up at the master. He nods and asks nothing.'
            },
            {
              type: 'narration',
              zh: '两个人同时停下筷子看你。',
              en: 'Both of them stop mid-chopstick and look at you.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}punk_neutral.webp`,
              jp: '……せんぱい、なにしてんの。',
              zh: '……前辈，你在干嘛。',
              en: '...Senpai. What are you doing.',
              color: 'bg-pink-600'
            },
            {
              type: 'narration',
              zh: '你说，吃面。然后你就真的开始吃面了。',
              en: 'You say: eating noodles. And then you eat noodles.'
            },
            {
              type: 'narration',
              zh: '隔了一阵子，左手边的空先重新动了筷子。右边的真希也默默跟上。数碗数比输赢这件事，谁都没再提起。',
              en: 'A little later the chopsticks on the left start up again. Maki on the right quietly joins in. Nobody mentions counting bowls or winning again.'
            },
            {
              type: 'speech',
              speakerZh: '空', speakerEn: 'Sora',
              characterImage: `${SORA}neutral.webp`,
              jp: '……なあ。替え玉、いる？',
              words: [{ jp: 'いる', zh: '要、需要', en: 'to need / to want' }],
              zh: '……喂。加面，要吗？',
              en: '...Hey. Extra noodles. You want some?',
              color: 'bg-orange-500'
            },
            {
              type: 'narration',
              zh: '这一次你知道该怎么答了：把碗里的汤留够，然后点头。',
              en: 'This time you know how to answer: leave enough broth in the bowl, and nod.'
            },
            {
              type: 'speech',
              speakerZh: '真希', speakerEn: 'Maki',
              characterImage: `${MAKI}punk_laugh.webp`,
              jp: 'おっ、学習しとるやん。えらいえらい。',
              zh: '哦，学会了嘛。真棒真棒。',
              en: 'Oh, look at that, he learned. Well done, well done.',
              color: 'bg-pink-600'
            },
            {
              type: 'narration',
              zh: '三个人一起加了面。谁也没赢，谁也没输，碗摞了九个。',
              en: 'All three of you order extra. Nobody wins and nobody loses. The bowls stack up to nine.'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '出了门，三个人在高架桥底下站着消食。电车从头顶过去，谁都没说话。',
      en: 'Outside, the three of you stand under the viaduct letting it settle. A train goes over. Nobody says anything.'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_neutral.webp`,
      jp: '……先輩。あの人、なんなん。',
      zh: '……前辈。那个人是什么来头。',
      en: '...Senpai. What is her deal.',
      color: 'bg-pink-600'
    },
    {
      type: 'speech',
      speakerZh: '空', speakerEn: 'Sora',
      characterImage: `${SORA}happy.webp`,
      jp: '聞こえとるで。',
      zh: '我听得见哦。',
      en: 'I can hear you.',
      color: 'bg-orange-500'
    },
    {
      type: 'speech',
      speakerZh: '真希', speakerEn: 'Maki',
      characterImage: `${MAKI}punk_pout.webp`,
      jp: '聞こえるように言うたんや。',
      zh: '我就是说给你听的。',
      en: 'I said it so you would hear it.',
      color: 'bg-pink-600'
    },
    {
      type: 'narration',
      zh: '空笑出了声。真希也笑了，但她马上就把脸转开了，装作在看电车。',
      en: 'Sora laughs out loud. Maki laughs too, then turns her face away at once and pretends to watch the train.'
    },
    {
      type: 'effect',
      relations: [
        { char: CharacterId.SORA, familiarity: 6, affection: 3, reasonZh: '她多了个能一起吃到第六碗的人', reasonEn: 'She gained someone who can go six bowls with her' },
        { char: CharacterId.MAKI, familiarity: 6, affection: 3, reasonZh: '她多了个不笑她的人', reasonEn: 'She gained someone who does not laugh at her' }
      ]
    }
  ]
};

// ==========================================================
// 光 × 铃 × 明日香 · 美利坚公园
// 三个人的组合。梗在于三种完全不同的"认真"撞到一起：
// 光的认真是热量，明日香的认真是标准，铃的认真是精度。
// ==========================================================
const EV_GROUP_MERIKEN: MapEventDef = {
  id: 'ev_group_meriken',
  locationId: 'meriken_park',
  chars: [CharacterId.HIKARI, CharacterId.REI, CharacterId.ASUKA],
  titleZh: '一张合照要拍二十七次',
  titleEn: 'Twenty-Seven Attempts at One Photo',
  requiresFlags: ['map_harbor'],
  minFamiliarity: {
    [CharacterId.HIKARI]: 60,
    [CharacterId.REI]: 60,
    [CharacterId.ASUKA]: 60
  },
  priority: 30,
  script: [
    { type: 'scene', scene: 'meriken_park', bgm: 'town', titleZh: '美利坚公园', titleEn: 'Meriken Park', subtitleZh: '周日 下午 3:00', subtitleEn: 'Sunday, 3:00 PM' },
    {
      type: 'narration',
      zh: '这件事的起因是光在群里冷不丁发了一句「明天去海边」。半天没人冒泡回复。过了好一会儿，她自顾自地把集合的时间和地点一口气全发了出来。',
      en: 'This began with Hikari posting "beach tomorrow" out of the blue. Nobody replied. A while later she posted the time and place herself.'
    },
    {
      type: 'narration',
      characterImage: `${HIKARI}happy.webp`,
      zh: '结果是四个人都来了。',
      en: 'The result is that all four of you came.'
    },
    {
      type: 'speech',
      speakerZh: '光', speakerEn: 'Hikari',
      characterImage: `${HIKARI}happy.webp`,
      jp: '来た来た！ほな写真な、まず写真！ポートタワー入れて！',
      zh: '来了来了！那先拍照，先拍照！要把港塔拍进去！',
      en: 'You made it! Right, photo first, photo! Get the Port Tower in!',
      color: 'bg-yellow-500'
    },
    {
      type: 'speech',
      speakerZh: '明日香', speakerEn: 'Asuka',
      characterImage: `${ASUKA}neutral.webp`,
      jp: '待って。逆光よ、そっち。塔が黒く潰れるわ。',
      words: [{ jp: '逆光', reading: 'ぎゃっこう', zh: '逆光', en: 'backlighting' }],
      zh: '等等。那边是逆光。塔会拍成一团黑。',
      en: 'Wait. That side is backlit. The tower will come out as a black smear.',
      color: 'bg-red-600'
    },
    {
      type: 'speech',
      speakerZh: '铃', speakerEn: 'Rei',
      characterImage: `${REI}neutral.webp`,
      jp: '現在の太陽高度は約三十六度。二十七分後に、塔の西面に光が回ります。',
      zh: '当前太阳高度角约三十六度。二十七分钟后，光会转到塔的西面。',
      en: 'Current solar elevation is approximately thirty-six degrees. In twenty-seven minutes the light will come round onto the west face of the tower.',
      color: 'bg-sky-600'
    },
    {
      type: 'narration',
      zh: '三个人同时看向铃。铃看着手机上的一个你不认识的应用。',
      en: 'All three of you look at Rei at once. Rei is looking at an app on her phone that none of you recognise.'
    },
    {
      type: 'speech',
      speakerZh: '光', speakerEn: 'Hikari',
      characterImage: `${HIKARI}surprised.webp`,
      jp: '……二十七分待つん？',
      zh: '……要等二十七分钟？',
      en: '...We are waiting twenty-seven minutes?',
      color: 'bg-yellow-500'
    },
    {
      type: 'speech',
      speakerZh: '明日香', speakerEn: 'Asuka',
      characterImage: `${ASUKA}smug.webp`,
      jp: '待つに決まってるでしょ。どうせ撮るなら、ちゃんと撮るのよ。',
      zh: '当然要等。既然要拍，就要拍好。',
      en: 'Of course we are waiting. If we are taking it at all, we take it properly.',
      color: 'bg-red-600'
    },
    {
      type: 'choice',
      promptZh: '二十七分钟。风很大。',
      promptEn: 'Twenty-seven minutes. It is very windy.',
      options: [
        {
          id: 'group_meriken_wait',
          labelZh: '陪她们等。',
          labelEn: 'Wait with them.',
          hintZh: '反正也没别的地方要去',
          hintEn: 'There is nowhere else you have to be.',
          effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有催任何人', reasonEn: 'You hurried nobody' }],
          relations: [
            { char: CharacterId.HIKARI, familiarity: 10, affection: 4, reasonZh: '她最后是第一个坐下的', reasonEn: 'In the end she was the first to sit down' },
            { char: CharacterId.REI, familiarity: 10, affection: 4, reasonZh: '你是唯一没质疑那个数字的人', reasonEn: 'You were the only one who did not question the number' },
            { char: CharacterId.ASUKA, familiarity: 10, affection: 4, reasonZh: '她赢了那场争论', reasonEn: 'She won that argument' }
          ],
          then: [
            {
              type: 'narration',
              zh: '这二十七分钟里发生了以下事情：',
              en: 'The following happens in those twenty-seven minutes:'
            },
            {
              type: 'narration',
              zh: '光去买了四个冰淇淋，回来的时候只剩三个半。明日香把最完整的那个给了铃，理由是「你算得准」。',
              en: 'Hikari buys four ice creams and comes back with three and a half. Asuka gives the most intact one to Rei, on the grounds that her numbers were right.'
            },
            {
              type: 'narration',
              characterImage: `${REI}neutral.webp`,
              zh: '铃拿着那个冰淇淋，没有吃，一直看着它化。到第十九分钟的时候她说了一句话。',
              en: 'Rei holds the ice cream without eating it and watches it melt. At the nineteenth minute she says one thing.'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}neutral.webp`,
              jp: '……こういう時間の使い方を、非効率と呼ぶそうです。',
              zh: '……听说这种时间用法叫做低效。',
              en: '...I am told this way of using time is called inefficient.',
              color: 'bg-sky-600'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}smile.webp`,
              jp: 'わたしは、そう思いません。',
              zh: '我不这么认为。',
              en: 'I do not agree.',
              color: 'bg-sky-600'
            }
          ]
        },
        {
          id: 'group_meriken_now',
          labelZh: '「现在拍。黑掉就黑掉。」',
          labelEn: '"Take it now. Let it come out black."',
          jp: '今撮ろう。暗くなったら、それはそれで。',
          words: [{ jp: '撮る', reading: 'とる', zh: '拍（照）', en: 'to take a photo' }],
          hintZh: '你想要的是这一刻，不是这张照片',
          hintEn: 'What you want is the moment, not the photograph.',
          effects: [{ stat: 'guts', amount: 2, reasonZh: '你和明日香对着干了', reasonEn: 'You went up against Asuka' }],
          relations: [
            { char: CharacterId.HIKARI, familiarity: 14, affection: 6, reasonZh: '她第一个跳起来同意', reasonEn: 'She was on her feet agreeing first' },
            { char: CharacterId.REI, familiarity: 8, affection: 3, reasonZh: '她把手机收起来了', reasonEn: 'She put the phone away' },
            { char: CharacterId.ASUKA, familiarity: 8, affection: 5, reasonZh: '她抗议了，然后站进了画面', reasonEn: 'She objected, and then stepped into frame' }
          ],
          then: [
            {
              type: 'speech',
              speakerZh: '明日香', speakerEn: 'Asuka',
              characterImage: `${ASUKA}angry.webp`,
              jp: 'は？だから逆光だって言って——',
              zh: '哈？我都说了是逆光——',
              en: 'What? I already said it is backlit—',
              color: 'bg-red-600'
            },
            {
              type: 'narration',
              zh: '光已经把手机架在栏杆上按下了倒计时快门，旋即招手大喊。四个人手忙脚乱地挤进取景框里。',
              en: 'Hikari has already propped the phone on the railing and hit the timer, waving and shouting. The four of you scramble into frame.'
            },
            {
              type: 'narration',
              zh: '照片拍出来果然一团黑。港塔是黑的，四个人的脸也是黑的，只有海面上有一道白得刺眼的光。',
              en: 'The photo does come out black. The tower is black, all four faces are black, and there is one searing white streak on the water.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}happy.webp`,
              jp: 'あははは！誰やこれ！',
              zh: '啊哈哈哈！这是谁啊！',
              en: 'Ahahaha! Who are these people!',
              color: 'bg-yellow-500'
            },
            {
              type: 'narration',
              characterImage: `${ASUKA}shy.webp`,
              zh: '明日香端详了片刻，然后红着脸把那张合照要了过去。',
              en: 'Asuka looks at it for a moment and then asks for a copy.'
            }
          ]
        },
        {
          id: 'group_meriken_coffee',
          labelZh: '「那我去买热的。二十七分钟，站着会冷。」',
          labelEn: '"Then I am getting something hot. Twenty-seven minutes standing here will be cold."',
          jp: 'あったかいの買ってくる。二十七分、立ってると冷える。',
          hintZh: '海边的风比坡道上大得多',
          hintEn: 'The wind off the water is a lot worse than the wind on the slope.',
          effects: [
            { stat: 'kindness', amount: 2, reasonZh: '你先想到的是四个人的手会冷', reasonEn: 'What you thought of first was four sets of cold hands' },
            { stat: 'proficiency', amount: 1, reasonZh: '你记住了三个人各自要什么', reasonEn: 'You kept three different orders straight' }
          ],
          relations: [
            { char: CharacterId.HIKARI, familiarity: 12, affection: 5, reasonZh: '她抢着跟你一起去', reasonEn: 'She insisted on going with you' },
            { char: CharacterId.REI, familiarity: 12, affection: 5, reasonZh: '你记得她不加糖', reasonEn: 'You remembered she takes it without sugar' },
            { char: CharacterId.ASUKA, familiarity: 12, affection: 6, reasonZh: '她一直没承认自己冷', reasonEn: 'She never once admitted to being cold' }
          ],
          setFlags: ['group_meriken_coffee'],
          then: [
            {
              type: 'narration',
              zh: '你说完就往公园口的自动售货机走。光立刻跟了上来，说一个人拿不了四罐。',
              en: 'You head for the vending machine at the park entrance. Hikari falls in beside you at once, on the grounds that one person cannot carry four cans.'
            },
            {
              type: 'speech',
              speakerZh: '光', speakerEn: 'Hikari',
              characterImage: `${HIKARI}happy.webp`,
              jp: 'あの二人な、絶対「寒くない」って言うで。ぜっったい言う。',
              words: [{ jp: '寒い', reading: 'さむい', zh: '冷', en: 'cold' }],
              zh: '那两个人啊，绝对会说「不冷」。绝——对会说。',
              en: 'Those two are going to say they are not cold. Guaranteed. Both of them.',
              color: 'bg-yellow-500'
            },
            {
              type: 'narration',
              zh: '你买了四罐。铃的那罐不加糖——你不确定为什么自己记得这件事。',
              en: 'You buy four. Rei’s is the unsweetened one. You are not sure why you remembered that.'
            },
            {
              type: 'narration',
              characterImage: `${ASUKA}surprised.webp`,
              zh: '回到栏杆边，你把罐子一个个递过去。明日香接过去的时候说了「我不冷」，但两只手一直没有松开。',
              en: 'Back at the railing you hand them round. Asuka says "I am not cold" as she takes hers, and does not let go of it once.'
            },
            {
              type: 'speech',
              speakerZh: '铃', speakerEn: 'Rei',
              characterImage: `${REI}neutral.webp`,
              jp: '……無糖。なぜ分かったのですか。',
              zh: '……无糖的。你怎么知道的。',
              en: '...Unsweetened. How did you know.',
              color: 'bg-sky-600'
            },
            {
              type: 'narration',
              zh: '你一时语塞。铃若有所思地瞧了你一眼，顺手把冰凉的易拉罐贴在自己的脸颊上，视线又落回了屏幕上。',
              en: 'You have no answer. Rei looks at you thoughtfully and presses the cold can against her cheek, her eyes drifting back to the app.'
            },
            {
              type: 'narration',
              characterImage: `${REI}smile.webp`,
              zh: '「……あと十四分です。」她说。声音听上去比刚才软了一点。',
              en: '"...Fourteen minutes left," she says. Her voice is fractionally softer than it was.'
            },
            {
              type: 'narration',
              zh: '四个人站成一排，每人手里一罐热的。风还是很大，但没有人再提要走。',
              en: 'The four of you stand in a row with a hot can each. The wind is still bad. Nobody mentions leaving again.'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '天色开始变。海面从金色慢慢转成紫色，港塔的灯一层一层亮起来。',
      en: 'The light begins to change. The bay goes from gold to purple and the tower lights come on in tiers.'
    },
    {
      type: 'speech',
      speakerZh: '明日香', speakerEn: 'Asuka',
      characterImage: `${ASUKA}neutral.webp`,
      jp: '……ねえ。もう一枚だけ、撮らない？',
      zh: '……喂。再拍一张，好不好？',
      en: '...Hey. Just one more. Shall we?',
      color: 'bg-red-600'
    },
    {
      type: 'narration',
      zh: '这一张拍得很好。四个人都在里面，港塔也在，而且没有人是黑的。',
      en: 'That one comes out well. All four of you are in it, the tower is in it, and nobody is a silhouette.'
    },
    {
      type: 'effect',
      relations: [
        { char: CharacterId.HIKARI, familiarity: 5, affection: 3, reasonZh: '她的临时起意成了', reasonEn: 'Her spur-of-the-moment plan worked' },
        { char: CharacterId.REI, familiarity: 5, affection: 3, reasonZh: '她把两张照片都存下来了', reasonEn: 'She saved both photographs' },
        { char: CharacterId.ASUKA, familiarity: 5, affection: 3, reasonZh: '她主动提了第二张', reasonEn: 'The second photo was her idea' }
      ]
    }
  ]
};

// ==========================================================
// 奈绪 × 深雪 × 稻荷 · 摩天轮（夜）
// 三个人年龄跨度是十六岁、二十四岁、一千五百岁。
// 梗押在这个跨度本身，但落点是三个人对"等"这件事各有各的经验。
// ==========================================================
const EV_GROUP_MOSAIC: MapEventDef = {
  id: 'ev_group_mosaic',
  locationId: 'mosaic_night',
  chars: [CharacterId.NAO, CharacterId.MIYUKI, CharacterId.INARI],
  titleZh: '一圈十分钟',
  titleEn: 'Ten Minutes for One Turn',
  timeSlots: ['night'],
  requiresFlags: ['map_harbor'],
  minFamiliarity: {
    [CharacterId.NAO]: 60,
    [CharacterId.MIYUKI]: 60,
    [CharacterId.INARI]: 60
  },
  priority: 30,
  script: [
    { type: 'scene', scene: 'mosaic_night', bgm: 'night', titleZh: '马赛克大摩天轮', titleEn: 'Mosaic Ferris Wheel', subtitleZh: '夜 8:40', subtitleEn: '8:40 PM' },
    {
      type: 'narration',
      zh: '一个包厢坐四个人。你们是四个人。这件事在排队的时候没有人提起，但每个人都算过了。',
      en: 'A gondola seats four. There are four of you. Nobody mentions this in the queue, but everybody has done the arithmetic.'
    },
    {
      type: 'narration',
      characterImage: `${INARI}neutral.webp`,
      zh: '稻荷是第一个上去的。她坐在正中间，占了两个人的位置，还理直气壮。',
      en: 'Inari gets on first. She sits dead centre, taking up two people worth of bench, entirely unembarrassed.'
    },
    {
      type: 'speech',
      speakerZh: '稻荷', speakerEn: 'Inari',
      characterImage: `${INARI}smug.webp`,
      jp: 'ほう。人の子は、こうやって高いところへ上るようになったか。',
      zh: '哦。人类现在是这样上高处的了。',
      en: 'Hoh. So this is how humans get themselves up high these days.',
      color: 'bg-amber-600'
    },
    {
      type: 'speech',
      speakerZh: '奈绪', speakerEn: 'Nao',
      characterImage: `${NAO}curious.webp`,
      jp: 'この人、いつもこういう喋り方なの？',
      zh: '这个人平时就是这么说话的？',
      en: 'Does she always talk like this?',
      color: 'bg-emerald-600'
    },
    {
      type: 'speech',
      speakerZh: '深雪', speakerEn: 'Miyuki',
      characterImage: `${MIYUKI}happy.webp`,
      jp: 'ふふ。慣れるわよ。',
      zh: '呵呵。会习惯的。',
      en: 'Mm. You get used to it.',
      color: 'bg-purple-600'
    },
    {
      type: 'narration',
      zh: '门关上。包厢晃了一下，然后开始往上。',
      en: 'The door closes. The gondola rocks once and starts to climb.'
    },
    {
      type: 'narration',
      zh: '整座城市从下面铺开。山、街、港，还有山腰上那一小片亮着的地方。',
      en: 'The whole city unrolls beneath you. Mountains, streets, harbour, and that small lit patch on the hillside.'
    },
    {
      type: 'speech',
      speakerZh: '奈绪', speakerEn: 'Nao',
      characterImage: `${NAO}neutral.webp`,
      jp: 'あそこ、うちの窓。……あの、右から三つ目の。',
      zh: '那儿是我家窗户。……那个，从右边数第三个。',
      en: 'That is my window. ...There. Third from the right.',
      color: 'bg-emerald-600'
    },
    {
      type: 'narration',
      zh: '你顺着她指的方向看过去。右边数第三个是亮的，第四个也是亮的。第四个是你的。',
      en: 'You follow where she is pointing. Third from the right is lit. So is the fourth. The fourth is yours.'
    },
    {
      type: 'choice',
      promptZh: '到最高点还有大概四分钟。',
      promptEn: 'About four minutes to the top.',
      options: [
        {
          id: 'group_mosaic_wait',
          labelZh: '「你们三个，最久等过一个人多久？」',
          labelEn: '"How long is the longest any of you has waited for someone?"',
          jp: '三人とも、人を待った最長記録って、どれくらい？',
          hintZh: '你不知道自己问了个多大的问题',
          hintEn: 'You do not know how large a question you just asked.',
          effects: [{ stat: 'kindness', amount: 3, reasonZh: '你问了一个三个人都答得上来的问题', reasonEn: 'You asked something all three of them could answer' }],
          relations: [
            { char: CharacterId.NAO, familiarity: 10, affection: 7, reasonZh: '她的答案是最短的，但她说得最慢', reasonEn: 'Her answer was the shortest and she took the longest to say it' },
            { char: CharacterId.MIYUKI, familiarity: 10, affection: 7, reasonZh: '她没有回答', reasonEn: 'She did not answer' },
            { char: CharacterId.INARI, familiarity: 10, affection: 7, reasonZh: '她的答案让整个包厢安静了', reasonEn: 'Her answer silenced the gondola' }
          ],
          then: [
            {
              type: 'narration',
              zh: '包厢里短暂地陷入了一片宁静。',
              en: 'The gondola falls into a momentary stillness.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}neutral.webp`,
              jp: '四百年ほどかのう。……結局、来なんだ。',
              zh: '四百年左右吧。……最后没来。',
              en: 'Four hundred years or so. ...In the end he did not come.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '没有人接话。她自己也没有再说下去，只是把脸转向窗外。',
              en: 'Nobody picks it up. She does not continue either; she simply turns her face to the window.'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}neutral.webp`,
              jp: '……あたし、三年。',
              zh: '……我，三年。',
              en: '...Me. Three years.',
              color: 'bg-emerald-600'
            },
            {
              type: 'narration',
              zh: '她说完就笑了一下，很快地补了一句「不过是等公交」。没有人相信，但也没有人拆穿。',
              en: 'She laughs a little afterwards and adds quickly that it was only for a bus. Nobody believes her, and nobody says so.'
            },
            {
              type: 'narration',
              characterImage: `${MIYUKI}neutral.webp`,
              zh: '深雪从头到尾没有回答。她只是看着窗外，手指在膝盖上轻轻敲了几下，像在数什么。',
              en: 'Miyuki never answers. She only looks out of the window, tapping her knee a few times with her fingers, as though counting something.'
            }
          ]
        },
        {
          id: 'group_mosaic_light',
          labelZh: '「灯要变色了。看那边。」',
          labelEn: '"The lights are about to change. Look over there."',
          jp: 'ライト、色が変わる。あっち見て。',
          hintZh: '有些时候不问才是对的',
          hintEn: 'Sometimes the right move is not to ask.',
          effects: [{ stat: 'charm', amount: 2, reasonZh: '你替所有人挑了一个安全的话题', reasonEn: 'You chose everyone a safe topic' }],
          relations: [
            { char: CharacterId.NAO, familiarity: 8, affection: 4, reasonZh: '她松了口气', reasonEn: 'She was relieved' },
            { char: CharacterId.MIYUKI, familiarity: 8, affection: 6, reasonZh: '她看了你一眼', reasonEn: 'She glanced at you' },
            { char: CharacterId.INARI, familiarity: 8, affection: 4, reasonZh: '她真的转头去看了', reasonEn: 'She actually turned to look' }
          ],
          then: [
            {
              type: 'narration',
              zh: '整个轮子从蓝色转成紫色，再转成金色，一层一层地扫过去。四个人都没说话。',
              en: 'The whole wheel goes from blue to purple to gold, sweeping across in bands. None of the four of you says anything.'
            },
            {
              type: 'narration',
              characterImage: `${MIYUKI}neutral.webp`,
              zh: '深雪看了你一眼。就一眼，但你确定她知道你为什么换了话题。',
              en: 'Miyuki glances at you. Just once, but you are certain she knows why you changed the subject.'
            }
          ]
        },
        {
          id: 'group_mosaic_window',
          labelZh: '「右边数第四个也是亮的。那个是我家。」',
          labelEn: '"The fourth from the right is lit too. That one is mine."',
          jp: '右から四つ目も点いてる。あれ、うち。',
          hintZh: '她指了自己的窗户。那你也指一个',
          hintEn: 'She pointed at her own window. So point at one.',
          effects: [
            { stat: 'guts', amount: 2, reasonZh: '你把自己住在哪儿告诉了三个人', reasonEn: 'You told three people where you live' },
            { stat: 'charm', amount: 1, reasonZh: '你把一句"那是我家"接成了一整片灯', reasonEn: 'You turned one lit window into a whole row of them' }
          ],
          relations: [
            { char: CharacterId.NAO, familiarity: 12, affection: 8, reasonZh: '她指窗户的时候，等的就是这句', reasonEn: 'That was the sentence she was waiting for when she pointed' },
            { char: CharacterId.MIYUKI, familiarity: 12, affection: 7, reasonZh: '她也把自己那扇指了出来', reasonEn: 'She pointed out her own as well' },
            { char: CharacterId.INARI, familiarity: 8, affection: 5, reasonZh: '她没有窗户可指，但她笑了', reasonEn: 'She had no window to point at, and she smiled anyway' }
          ],
          setFlags: ['group_mosaic_windows'],
          then: [
            {
              type: 'narration',
              zh: '你伸手指过去，比她的位置往右挪了一格。',
              en: 'You reach out and point, one window to the right of hers.'
            },
            {
              type: 'narration',
              characterImage: `${NAO}curious.webp`,
              zh: '指尖若有似无的触碰让奈绪触电般微微一颤，飞快地将手缩了回去，双颊微红，仿佛刚才那个随意的并排指向忽然变得格外令人心悸。',
              en: 'A fleeting touch of fingertips makes Nao flinch as if jolted by a soft current; she swiftly retracts her hand, cheeks dusting pink, as though pointing side by side had suddenly turned breathtakingly dangerous.'
            },
            {
              type: 'speech',
              speakerZh: '奈绪', speakerEn: 'Nao',
              characterImage: `${NAO}smile.webp`,
              jp: '……知ってる。三つ目の隣が四つ目なんだから、そりゃ知ってるでしょ。',
              zh: '……我知道啊。第三个旁边就是第四个，那当然知道。',
              en: '...I know. The fourth is next to the third. Obviously I know.',
              color: 'bg-emerald-600'
            },
            {
              type: 'narration',
              characterImage: `${MIYUKI}happy.webp`,
              zh: '深雪笑了一声，也抬起手指了一下——就在你那扇的正上方。',
              en: 'Miyuki laughs once and lifts her own hand to point. Directly above yours.'
            },
            {
              type: 'speech',
              speakerZh: '深雪', speakerEn: 'Miyuki',
              characterImage: `${MIYUKI}happy.webp`,
              jp: 'じゃあ、わたしはその上ね。……こうして見ると、ずいぶん近いのね、わたしたち。',
              words: [{ jp: '近い', reading: 'ちかい', zh: '近', en: 'close / near' }],
              zh: '那我就是那扇的正上方了。……这样看的话，我们住得可真近呢。',
              en: 'Then I am the one directly above. ...Seen from here, we do live remarkably close together.',
              color: 'bg-purple-600'
            },
            {
              type: 'narration',
              characterImage: `${INARI}neutral.webp`,
              zh: '稻荷一直没有指。她只是看着那一小片亮着的窗户，看了很久。',
              en: 'Inari does not point at anything. She only looks at that small cluster of lit windows, for a long time.'
            },
            {
              type: 'speech',
              speakerZh: '稻荷', speakerEn: 'Inari',
              characterImage: `${INARI}neutral.webp`,
              jp: '……灯りというのは、誰かが帰ってくる家にしか点かぬものじゃ。',
              words: [{ jp: '灯り', reading: 'あかり', zh: '灯光', en: 'a light' }],
              zh: '……灯这种东西啊，只会亮在有人要回去的房子里。',
              en: '...A light only ever burns in a house someone is coming home to.',
              color: 'bg-amber-600'
            },
            {
              type: 'narration',
              zh: '包厢里没有人接话。四个人一起看着山坡上那几扇窗，直到轮子转过最高点。',
              en: 'Nobody answers that. The four of you watch those few windows on the hillside together, until the wheel comes over the top.'
            }
          ]
        }
      ]
    },
    {
      type: 'narration',
      zh: '轮子转到最低点，门开了。四个人下来，站在原地都没有立刻走。',
      en: 'The wheel comes back down and the door opens. All four of you get out and none of you immediately walks away.'
    },
    {
      type: 'speech',
      speakerZh: '稻荷', speakerEn: 'Inari',
      characterImage: `${INARI}happy.webp`,
      jp: '……十分。悪くない長さじゃ。',
      zh: '……十分钟。是个不错的长度。',
      en: '...Ten minutes. That is not a bad length.',
      color: 'bg-amber-600'
    },
    {
      type: 'speech',
      speakerZh: '深雪', speakerEn: 'Miyuki',
      characterImage: `${MIYUKI}happy.webp`,
      jp: 'そうね。……ちょうど、みんなが黙っていられるくらい。',
      zh: '是啊。……刚好是大家能一起沉默的长度。',
      en: 'It is. ...Just long enough for everyone to be quiet together.',
      color: 'bg-purple-600'
    },
    {
      type: 'narration',
      zh: '你们四个一起走回三宫。奈绪和你在同一站下车，一起爬那条坡。她一路上什么都没说，但走得比平时慢。',
      en: 'The four of you walk back to Sannomiya together. Nao gets off at the same stop and climbs the slope with you. She says nothing the whole way, and walks slower than usual.'
    },
    {
      type: 'effect',
      relations: [
        { char: CharacterId.NAO, familiarity: 6, affection: 4, reasonZh: '她把坡走慢了', reasonEn: 'She took the slope slowly' },
        { char: CharacterId.MIYUKI, familiarity: 6, affection: 4, reasonZh: '她说了那句话', reasonEn: 'She said that one line' },
        { char: CharacterId.INARI, familiarity: 6, affection: 4, reasonZh: '她说十分钟不错', reasonEn: 'She said ten minutes was not a bad length' }
      ]
    }
  ]
};

export const GROUP_EVENTS: MapEventDef[] = [
  EV_GROUP_RAMEN,
  EV_GROUP_MERIKEN,
  EV_GROUP_MOSAIC
];
