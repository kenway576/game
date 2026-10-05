import { StoryNode, StoryFlags, GameCalendar, MapLocation } from '../types';
import { ShopKind } from '../data/shopData';
import { CITY_NPC_SPRITES, CLERK_DRUGSTORE_SPRITES } from '../constants';
import { pickStreetScene } from './streetScenes';

// ---------------------------------------------------------
// 🛒 进店之后、开始挑东西之前的那一小段
//
// 以前进店就是直接跳货架。店是一个界面，不是一个地方——
// 你在里面不会碰见任何人，也不会有任何事情发生在你身上。
//
// 现在进门的时候掷一次：
//   1. 这家店有没有还没演过的专属小景（街头小景池子里挂在这家店的那些）。
//      有就先演——这些是一次性的，演完就没了，所以不掷概率。
//   2. 没有的话按 SHOP_SCENE_CHANCE 抽一段日常小插曲。
//      这些可以重复撞见：店还是那家店，店员还是那个店员。
// 演完都接同一句收尾——「差点忘了是来买东西的」，然后才开门做生意。
// ---------------------------------------------------------

export const SHOP_SCENE_CHANCE = 0.45;

interface ShopScene {
  id: string;
  script: StoryNode[];
  weather?: GameCalendar['weather'][];
  // 带属性奖励的那几段只演一次，免得进进出出刷数值
  once?: boolean;
}

const YOU = { speakerZh: '你', speakerEn: 'You', color: 'bg-yellow-500' } as const;

// 每家店进门之后看见的是店里面，不是门口
export const SHOP_INTERIOR: Record<ShopKind, string> = {
  hyakkin:   'hundred_yen_shop_interior',
  tackle:    'tackle_shop',
  drugstore: 'drugstore_interior',
  matsukiyo: 'drugstore_interior',
  bookoff:   'bookoff_interior',
  surugaya:  'surugaya_interior',
  uniqlo:    'uniqlo_interior'
};

const CLERK_BOOKOFF  = '/images/characters/clerk_bookoff.webp';
const CLERK_SURUGAYA = '/images/characters/clerk_surugaya.webp';
const CLERK_UNIQLO   = '/images/characters/clerk_uniqlo.webp';
// 店里碰见的路人（立绘重制第二轮补画的，scripts/remake/npcs.mjs）
const npc = (id: string) => `/images/characters/npc_${id}.webp`;

export const SHOP_SCENES: Record<ShopKind, ShopScene[]> = {
  // ================= 百元店 =================
  hyakkin: [
    {
      id: 'shop_hk_grandma_price',
      script: [
        { type: 'narration', characterImage: npc('hk_obaa'), zh: '收纳用品那一排，一位老奶奶把一个塑料盒举得很近，又举得很远，眯着眼睛看底下的标签。', en: 'In the storage aisle an old woman holds a plastic box very close, then very far, squinting at the label underneath.' },
        {
          type: 'speech', speakerZh: '老奶奶', speakerEn: 'Old Woman',
          jp: 'ちょっとお兄さん、これ百円？字が小さくてねえ。',
          zh: '小哥，这个是一百円吗？字太小了，看不清哟。',
          en: 'Young man, is this a hundred yen? The writing is so small.',
          words: [{ jp: '字', reading: 'じ', zh: '字', en: 'writing; character' }]
        },
        { type: 'narration', zh: '你接过来翻到底面。贴纸上印着「330円（税込）」。', en: 'You take it and turn it over. The sticker says 330 yen, tax included.' },
        {
          type: 'speech', ...YOU,
          jp: 'えっと……三百三十円です。税込みで。',
          zh: '呃……三百三十円。含税的。',
          en: 'Um… it\'s three hundred and thirty. Including tax.',
          words: [{ jp: '税込み', reading: 'ぜいこみ', zh: '含税', en: 'tax included' }]
        },
        {
          type: 'speech', speakerZh: '老奶奶', speakerEn: 'Old Woman',
          jp: 'あら、百円ちゃうの。百円ショップやのにねえ。おおきに。',
          zh: '哎呀，不是一百円啊。明明是百元店嘛。谢谢你啊。',
          en: 'Oh, not a hundred? And it\'s a hundred-yen shop. Thank you, dear.'
        },
        { type: 'narration', characterImage: '', zh: '她把盒子放回去，拿了旁边一个小一号的。那个是真的一百一十円。', en: 'She puts it back and takes the next size down. That one really is a hundred and ten.' }
      ]
    },
    {
      id: 'shop_hk_takahashi_boxes',
      script: [
        { type: 'narration', characterImage: CITY_NPC_SPRITES.takahashi, zh: '高桥抱着三个纸箱从仓库出来，最上面那个正一点一点往外滑。', en: 'Takahashi comes out of the stockroom carrying three boxes. The top one is sliding off, a little at a time.' },
        { type: 'narration', zh: '你伸手扶住的时候，它已经斜成四十五度了。', en: 'By the time you put out a hand it is at forty-five degrees.' },
        {
          type: 'speech', speakerZh: '高桥', speakerEn: 'Takahashi',
          jp: 'あっ、すんません！めっちゃ助かりました。',
          zh: '啊，不好意思！真是帮大忙了。',
          en: 'Ah, sorry! You really saved me there.',
          words: [{ jp: '助かる', reading: 'たすかる', zh: '得救；帮了大忙', en: 'to be a big help' }]
        },
        {
          type: 'speech', speakerZh: '高桥', speakerEn: 'Takahashi',
          jp: 'それ、新しく入ったやつなんすよ。よかったら見てってください。',
          zh: '那箱是新到的货。有兴趣的话可以看看。',
          en: 'That lot just came in. Have a look if you like.'
        },
        { type: 'narration', characterImage: '', zh: '他把箱子码好，又小跑着回了仓库。', en: 'He stacks the boxes and jogs back to the stockroom.' }
      ]
    },
    {
      id: 'shop_hk_kid_toys',
      script: [
        { type: 'narration', characterImage: npc('hk_boy'), zh: '玩具那一排前面蹲着一个小男孩，两只手各拿一个塑料恐龙，正在认真比较哪一只更凶。', en: 'A little boy squats in front of the toy shelf with a plastic dinosaur in each hand, seriously weighing which is fiercer.' },
        {
          type: 'speech', speakerZh: '妈妈', speakerEn: 'Mother', characterImage: npc('hk_mother'),
          jp: 'ほら、もう行くよー。一個だけって言ったでしょ。',
          zh: '好啦，要走了哦。不是说好只能买一个吗。',
          en: 'Come on, we\'re going. I said only one, didn\'t I.'
        },
        {
          type: 'speech', speakerZh: '小男孩', speakerEn: 'Little Boy', characterImage: npc('hk_boy'),
          jp: 'まだ決めてない！',
          zh: '我还没决定好！',
          en: 'I haven\'t decided yet!',
          words: [{ jp: '決める', reading: 'きめる', zh: '决定', en: 'to decide' }]
        },
        { type: 'narration', characterImage: '', zh: '他最后选了那只更小、但嘴张得更大的。你觉得这是正确的判断。', en: 'In the end he picks the smaller one with the wider mouth. You think that is the right call.' }
      ]
    },
    {
      id: 'shop_hk_rain_umbrellas', weather: ['rainy'],
      script: [
        { type: 'narration', characterImage: CITY_NPC_SPRITES.takahashi, zh: '门口的伞架前排着队。外面的雨来得太突然，透明塑料伞一把一把地被抽走，店员正从仓库里抱出第二箱。', en: 'There is a queue at the umbrella stand by the door. The rain came too suddenly; clear umbrellas are disappearing one by one and a clerk is bringing out a second box.' },
        {
          type: 'speech', speakerZh: '店员', speakerEn: 'Clerk',
          jp: '傘、まだありますのでー！押さないでくださーい！',
          zh: '伞还有很多——！请不要挤——！',
          en: 'We still have umbrellas! Please don\'t push!',
          words: [{ jp: '押す', reading: 'おす', zh: '推；挤', en: 'to push' }]
        },
        { type: 'narration', characterImage: '', zh: '全日本的透明伞大概有一半是在这种时候买的。', en: 'Probably half the clear umbrellas in Japan were bought at moments like this.' }
      ]
    }
  ],

  // ================= 渔具店 =================
  tackle: [
    {
      id: 'shop_tk_radio',
      script: [
        { type: 'narration', characterImage: CITY_NPC_SPRITES.gensan, zh: '柜台上那台旧收音机在播海上天气预报。源老爹手上修着卷线器，耳朵却明显朝着收音机。', en: 'The old radio on the counter is reading the marine forecast. Gen-san\'s hands are on a reel, but his ear is clearly on the radio.' },
        { type: 'narration', zh: '「……播磨灘、波の高さ二メートル……」', en: '"…Harima Sea, waves two metres…"' },
        {
          type: 'speech', speakerZh: '源さん', speakerEn: 'Gen-san',
          jp: '明日は波が高いな。行くんやったら今日のうちや。',
          zh: '明天浪大。要去的话就趁今天。',
          en: 'Rough sea tomorrow. If you\'re going, go today.',
          words: [{ jp: '波', reading: 'なみ', zh: '波浪', en: 'wave' }]
        },
        { type: 'narration', characterImage: '', zh: '说完这一句，他就又低下头去了。这算是他今天的天气预报。', en: 'And with that he looks down again. That was his forecast for the day.' }
      ]
    },
    {
      id: 'shop_tk_cat',
      script: [
        { type: 'narration', zh: '放鱼饵的冷柜上面睡着一只三花猫，肚子朝天，尾巴垂在冷柜门把手上。', en: 'A calico cat is asleep on top of the bait fridge, belly up, its tail draped over the handle.' },
        { type: 'narration', characterImage: CITY_NPC_SPRITES.gensan, zh: '你看看猫，又看看源老爹。', en: 'You look at the cat, then at Gen-san.' },
        {
          type: 'speech', speakerZh: '源さん', speakerEn: 'Gen-san',
          jp: 'そいつ、店長や。起こしたら怒られんで。',
          zh: '那家伙是店长。吵醒了它可是要挨骂的。',
          en: 'That\'s the manager. Wake her and you\'ll be in trouble.',
          words: [{ jp: '店長', reading: 'てんちょう', zh: '店长', en: 'store manager' }]
        },
        { type: 'narration', characterImage: '', zh: '店长翻了个身，尾巴从把手上滑下来，又挂了回去。', en: 'The manager rolls over. The tail slides off the handle, then hooks back on.' }
      ]
    },
    {
      id: 'shop_tk_first_rod',
      script: [
        { type: 'narration', zh: '一个老爷爷领着孙子站在竿架前。孩子的眼睛直勾勾地盯着最长、最贵的那一根。', en: 'An old man stands at the rod rack with his grandson. The boy\'s eyes are fixed on the longest, most expensive rod.' },
        { type: 'narration', characterImage: CITY_NPC_SPRITES.gensan, zh: '源老爹放下手里的活，走过去，从最下面抽出一根很短的。', en: 'Gen-san puts down his work, walks over and pulls a very short one from the bottom.' },
        {
          type: 'speech', speakerZh: '源さん', speakerEn: 'Gen-san',
          jp: 'まずはこれや。最初から長いの持ったら、魚より先に竿に負けるで。',
          zh: '先用这根。一开始就拿长的，还没赢过鱼就先输给竿子了。',
          en: 'Start with this. Pick up a long one first and the rod\'ll beat you before any fish does.',
          words: [{ jp: '負ける', reading: 'まける', zh: '输', en: 'to lose' }]
        },
        { type: 'narration', characterImage: '', zh: '孩子有点不服气，但还是接过去了。你突然觉得那句话不只是在说钓鱼。', en: 'The boy looks unconvinced, but takes it. It occurs to you that the advice was not only about fishing.' }
      ]
    }
  ],

  // ================= サンドラッグ =================
  drugstore: [
    {
      id: 'shop_dr_jingle',
      script: [
        { type: 'narration', zh: '门口那段广告歌又从头开始了。你已经在脑子里跟着哼到第二句了。', en: 'The jingle by the door starts over. You realise you are already humming along to the second line in your head.' },
        { type: 'narration', characterImage: npc('dr_schoolgirl'), zh: '旁边挑洗面奶的高中女生也在哼。你们对视了一眼，同时停了下来。', en: 'The high-school girl choosing face wash next to you is humming it too. You catch each other\'s eye and both stop at once.' },
        {
          type: 'speech', speakerZh: '女高中生', speakerEn: 'Schoolgirl',
          jp: '……この曲、頭から離れへんよね。',
          zh: '……这首歌，一听就忘不掉对吧。',
          en: '…This song never leaves your head, does it.',
          words: [{ jp: '離れる', reading: 'はなれる', zh: '离开', en: 'to leave; to separate' }]
        },
        { type: 'narration', characterImage: '', zh: '她笑了一下，拿着洗面奶去了收银台。那段旋律在你脑子里又转了一圈。', en: 'She smiles and takes her face wash to the till. The tune goes round your head one more time.' }
      ]
    },
    {
      id: 'shop_dr_odaiji',
      script: [
        { type: 'narration', characterImage: npc('dr_pharmacist'), zh: '药剂师柜台前，一位戴口罩的上班族正小声描述自己的症状。药剂师听得很认真，挑了一盒药递给他。', en: 'At the pharmacist\'s counter a masked office worker describes his symptoms quietly. The pharmacist listens carefully and hands him a box.' },
        {
          type: 'speech', speakerZh: '药剂师', speakerEn: 'Pharmacist',
          jp: '一日三回、食後に飲んでください。お大事に。',
          zh: '一天三次，饭后服用。请多保重。',
          en: 'Three times a day, after meals. Take care of yourself.',
          words: [
            { jp: '食後', reading: 'しょくご', zh: '饭后', en: 'after a meal' },
            { jp: 'お大事に', reading: 'おだいじに', zh: '请保重（对病人说）', en: 'get well soon' }
          ]
        },
        { type: 'narration', characterImage: '', zh: '「お大事に」。你在心里默念了一遍。这是一句只对生病的人说的话，你想，将来总有一天会用到。', en: '"Odaiji ni." You repeat it to yourself. A phrase said only to people who are unwell. Someday you will need it.' }
      ]
    },
    {
      id: 'shop_dr_bag',
      script: [
        { type: 'narration', characterImage: npc('dr_cashier'), zh: '你前面排队的人在结账。收银员的语速快得像一整个词。', en: 'The person ahead of you is paying. The cashier speaks so fast it sounds like a single word.' },
        {
          type: 'speech', speakerZh: '收银员', speakerEn: 'Cashier',
          jp: 'レジ袋はご利用ですか？',
          zh: '需要塑料袋吗？',
          en: 'Would you like a bag?',
          words: [{ jp: 'レジ袋', reading: 'レジぶくろ', zh: '（收银台的）塑料袋', en: 'plastic carrier bag' }]
        },
        { type: 'narration', zh: '前面那人摇了摇头，从口袋里掏出一个折得很小的环保袋。你在脑子里排练了一遍：轮到你的时候要说什么。', en: 'He shakes his head and produces a tightly folded eco-bag. You rehearse in your head what you will say when it is your turn.' },
        {
          type: 'choice', promptZh: '轮到你的时候，你打算说——', promptEn: 'When it is your turn, you will say —',
          options: [
            { id: 'shop_dr_bag_no', jp: '大丈夫です。', labelZh: '不用了', labelEn: 'No thanks', then: [
              { type: 'narration', zh: '「大丈夫です」——在这里是「不用了」的意思。这件事你花了一个月才敢确定。', en: '"Daijoubu desu" — here it means "no thanks". It took you a month to be sure of that.' }
            ] },
            { id: 'shop_dr_bag_yes', jp: 'お願いします。', labelZh: '麻烦给我一个', labelEn: 'Yes, please', then: [
              { type: 'narration', zh: '「お願いします」。一句话就能解决大半的事。你把它在舌头上又过了一遍。', en: '"Onegai shimasu." One phrase that solves half of everything. You run it over your tongue once more.' }
            ] }
          ]
        }
      ]
    }
  ],

  // ================= マツキヨ =================
  matsukiyo: [
    {
      id: 'shop_mk_tester',
      script: [
        { type: 'narration', characterImage: CLERK_DRUGSTORE_SPRITES.welcome, zh: '你刚进门，七海小姐就从护手霜的货架后面探出头来。', en: 'You are barely through the door when Nanami leans out from behind the hand-cream shelf.' },
        {
          type: 'speech', speakerZh: '七海', speakerEn: 'Nanami', characterImage: CLERK_DRUGSTORE_SPRITES.recommend,
          jp: 'よかったら、こちらお試しください。今日から新しい香りなんです。',
          zh: '不介意的话，请试试这个。今天刚上的新香味。',
          en: 'If you like, please try this. It\'s a new scent from today.',
          words: [{ jp: '試す', reading: 'ためす', zh: '尝试', en: 'to try' }]
        },
        { type: 'narration', zh: '你伸出手，她挤了一点在你手背上。柚子的味道，很淡。', en: 'You hold out your hand and she squeezes a little onto the back of it. Yuzu, very faint.' },
        {
          type: 'speech', speakerZh: '七海', speakerEn: 'Nanami', characterImage: CLERK_DRUGSTORE_SPRITES.smile,
          jp: '冬になると、手がすぐ荒れちゃいますからね。',
          zh: '一到冬天，手就很容易干裂呢。',
          en: 'Hands get rough so quickly once winter comes.',
          words: [{ jp: '荒れる', reading: 'あれる', zh: '（皮肤）粗糙、干裂', en: 'to get rough (skin)' }]
        },
        { type: 'narration', characterImage: '', zh: '你闻了一下手背。整个下午，大概都会是这个味道了。', en: 'You sniff the back of your hand. It will probably smell like this all afternoon.' }
      ]
    },
    {
      id: 'shop_mk_tourists', once: true,
      script: [
        { type: 'narration', characterImage: CLERK_DRUGSTORE_SPRITES.think, zh: '收银台前，一对游客夫妇拿着手机上的截图，七海小姐一边看一边努力地比划。三个人都在笑，但谁也没听懂谁。', en: 'At the till a tourist couple are holding up a screenshot on a phone while Nanami gestures her best. All three are smiling, and none of them understands the others.' },
        { type: 'narration', zh: '你听出来他们说的语言你能懂。他们想要截图上的那款眼药水，但货架上只剩下另一个颜色的包装。', en: 'You realise you understand the language they are speaking. They want the eye drops in the screenshot, but the shelf only has a different-coloured box left.' },
        {
          type: 'choice', promptZh: '要不要上前帮一下？', promptEn: 'Step in and help?',
          options: [
            {
              id: 'shop_mk_tourists_help', labelZh: '过去帮他们翻译', labelEn: 'Go over and translate',
              hintZh: '你的日语够用吗？', hintEn: 'Is your Japanese up to it?',
              effects: [{ stat: 'kindness', amount: 2, reasonZh: '你在药妆店当了一回翻译', reasonEn: 'You played interpreter in a drugstore' }],
              then: [
                {
                  type: 'speech', ...YOU,
                  jp: 'あの……この目薬、色が違うだけで、中身は同じですか？',
                  zh: '那个……这个眼药水，只是颜色不一样，里面是一样的吗？',
                  en: 'Um… is this eye drop the same inside, just a different colour?',
                  words: [{ jp: '中身', reading: 'なかみ', zh: '内容物', en: 'contents' }]
                },
                {
                  type: 'speech', speakerZh: '七海', speakerEn: 'Nanami', characterImage: CLERK_DRUGSTORE_SPRITES.smile,
                  jp: 'はい、パッケージが新しくなっただけです！ありがとうございます、ほんとに助かりました！',
                  zh: '是的，只是换了新包装！谢谢你，真是帮了大忙！',
                  en: 'Yes, only the packaging is new! Thank you, you really saved me!'
                },
                { type: 'narration', characterImage: '', zh: '游客夫妇买了四盒，临走前跟你握了手。七海小姐冲你双手合十，小小地鞠了一躬。', en: 'The couple buy four boxes and shake your hand on the way out. Nanami presses her palms together and gives you a small bow.' }
              ]
            },
            {
              id: 'shop_mk_tourists_watch', labelZh: '在旁边看着就好', labelEn: 'Just watch',
              then: [
                { type: 'narration', characterImage: '', zh: '七海小姐最后拿出了一张写着各国语言的对照卡片，一项一项指给他们看。花了五分钟，但她做到了。', en: 'In the end Nanami brings out a card with phrases in several languages and points them through it item by item. It takes five minutes, but she manages.' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'shop_mk_dry',
      script: [
        { type: 'narration', characterImage: CLERK_DRUGSTORE_SPRITES.recommend, zh: '你在化妆水那一排站了不到十秒，七海小姐就过来了。', en: 'You have stood at the toner shelf for less than ten seconds when Nanami comes over.' },
        {
          type: 'speech', speakerZh: '七海', speakerEn: 'Nanami',
          jp: 'お肌、乾燥してませんか？神戸は海風があるので、意外と乾くんですよ。',
          zh: '皮肤有没有觉得干？神户有海风，其实意外地容易干哦。',
          en: 'Is your skin feeling dry? Kobe has the sea wind, so it dries out more than you\'d think.',
          words: [{ jp: '乾燥', reading: 'かんそう', zh: '干燥', en: 'dryness' }]
        },
        {
          type: 'speech', ...YOU,
          jp: 'あ、たぶん……大丈夫、だと思います。',
          zh: '啊，大概……没问题吧，我想。',
          en: 'Ah, probably… fine, I think.'
        },
        {
          type: 'speech', speakerZh: '七海', speakerEn: 'Nanami', characterImage: CLERK_DRUGSTORE_SPRITES.smile,
          jp: 'ふふ、「たぶん」なら、たぶん乾燥してます。',
          zh: '呵呵，说"大概"的话，那大概就是干了。',
          en: 'Heh. If it\'s "probably", it\'s probably dry.'
        },
        { type: 'narration', characterImage: '', zh: '她说完就去招呼下一位客人了。你摸了摸自己的脸。好像……是有一点。', en: 'And off she goes to the next customer. You touch your face. Maybe… a little.' }
      ]
    }
  ],

  // ================= Book Off =================
  bookoff: [
    {
      id: 'shop_bo_echo',
      script: [
        { type: 'narration', characterImage: CLERK_BOOKOFF, zh: '门一开，「いらっしゃいませー」从收银台传出来，接着是漫画区，然后是最里面的 CD 区。像是在店里传接力棒。', en: 'The door opens and "irasshaimase" comes from the till, then from the manga section, then from the CDs at the very back. Like a relay baton passed round the shop.' },
        { type: 'narration', zh: '你数了一下，一共五声。最后一声明显慢了半拍。', en: 'You count. Five in all. The last one is clearly half a beat late.' },
        {
          type: 'speech', speakerZh: '店员', speakerEn: 'Clerk',
          jp: 'いらっしゃいませー、こんにちはー。',
          zh: '欢迎光临——您好——',
          en: 'Welcome, hello!',
          words: [{ jp: 'いらっしゃいませ', zh: '欢迎光临', en: 'welcome (to a shop)' }]
        },
        { type: 'narration', characterImage: '', zh: '第六声。原来书架后面还藏着一个。', en: 'A sixth. So there was one more hiding behind the shelves.' }
      ]
    },
    {
      id: 'shop_bo_tachiyomi',
      script: [
        { type: 'narration', zh: '漫画区的过道里站着一排人，每个人手里都拿着一本，谁也不说话，谁也没打算买。', en: 'The manga aisle is lined with people, each holding a volume, nobody speaking, nobody intending to buy.' },
        { type: 'narration', zh: '你也抽了一本，站到他们中间。翻到第三页的时候，你发现自己的姿势和左右两个人一模一样。', en: 'You take one too and join them. By page three you notice you are standing exactly like the people either side of you.' },
        {
          type: 'narration', zh: '这叫「立ち読み」——站着白看。在这家店里，它几乎是被默许的。',
          en: 'This is tachiyomi, reading standing up for free. In this shop it is all but expected.',
          words: [{ jp: '立ち読み', reading: 'たちよみ', zh: '站着白看书', en: 'reading in a shop without buying' }]
        },
        { type: 'narration', zh: '等你回过神来，已经看完一整卷了。', en: 'By the time you look up you have finished a whole volume.' }
      ]
    },
    {
      id: 'shop_bo_note', once: true,
      script: [
        { type: 'narration', zh: '你随手翻开一本旧参考书，里面夹着一张便利贴，字迹工整：', en: 'You open an old study guide at random. Inside is a sticky note in neat handwriting:' },
        {
          type: 'narration', zh: '「がんばれ、未来の私。ここまで来たらあと少し。」——加油，未来的我。都到这里了，只差一点点了。',
          en: '"Keep going, future me. You\'ve come this far — not much left."',
          words: [{ jp: '未来', reading: 'みらい', zh: '未来', en: 'future' }]
        },
        { type: 'narration', zh: '书的后半本几乎没有笔记。你不知道写这张纸条的人最后考上了没有。', en: 'The second half of the book is almost unmarked. You do not know whether the person who wrote it made it in the end.' },
        {
          type: 'effect',
          effects: [{ stat: 'guts', amount: 1, reasonZh: '一张不是写给你的纸条，却好像也是写给你的', reasonEn: 'A note not written for you, that seems written for you anyway' }]
        },
        { type: 'narration', zh: '你把便利贴照原样夹了回去。下一个翻开这本书的人，也许正好需要它。', en: 'You put the note back exactly where it was. The next person to open the book might need it.' }
      ]
    }
  ],

  // ================= 駿河屋 =================
  surugaya: [
    {
      id: 'shop_sg_debate',
      script: [
        { type: 'narration', characterImage: npc('sg_otaku_a'), zh: '手办展柜前，两个穿格子衬衫的男生压低声音争论着什么，表情严肃得像在讨论国家大事。', en: 'In front of the figure case two boys in check shirts argue in low voices, as solemn as if discussing affairs of state.' },
        {
          type: 'speech', speakerZh: '格子衬衫 A', speakerEn: 'Check Shirt A', characterImage: npc('sg_otaku_a'),
          jp: 'いや、これ絶対本物やって。箱の角見てみ。',
          zh: '不，这个绝对是正版。你看盒子的角。',
          en: 'No, this is definitely genuine. Look at the corner of the box.',
          words: [{ jp: '本物', reading: 'ほんもの', zh: '真品；正版', en: 'the real thing' }]
        },
        {
          type: 'speech', speakerZh: '格子衬衫 B', speakerEn: 'Check Shirt B', characterImage: npc('sg_otaku_b'),
          jp: '角で何がわかんねん……。',
          zh: '看个角能看出什么来啊……',
          en: 'What can you tell from a corner…'
        },
        { type: 'narration', zh: '五分钟后，两个人一人买了一个，开开心心地走了。争论到底谁赢了，你没看出来。', en: 'Five minutes later they each buy one and leave happily. Who won the argument, you could not tell.' }
      ]
    },
    {
      id: 'shop_sg_junk',
      script: [
        { type: 'narration', characterImage: CLERK_SURUGAYA, zh: '店员正在一个纸箱前给旧游戏卡带一个一个贴黄色标签。标签上写着「ジャンク」。', en: 'A clerk is sticking yellow labels on old game cartridges from a cardboard box, one by one. The labels say JUNK.' },
        {
          type: 'speech', speakerZh: '店员', speakerEn: 'Clerk',
          jp: 'ジャンク品は動作保証なしなんで、自己責任でお願いしますねー。',
          zh: '"故障品"不保证能用，请自行承担风险哦～',
          en: 'Junk items come with no guarantee they work, so it\'s at your own risk!',
          words: [
            { jp: 'ジャンク品', reading: 'ジャンクひん', zh: '故障品；不保修商品', en: 'junk item (sold as-is)' },
            { jp: '自己責任', reading: 'じこせきにん', zh: '自负责任', en: 'one\'s own responsibility' }
          ]
        },
        { type: 'narration', characterImage: '', zh: '一个中年男人把整箱都搬去了收银台。他的表情说明他知道自己在做什么，也说明他不在乎。', en: 'A middle-aged man carries the whole box to the till. His face says he knows what he is doing, and that he does not care.' }
      ]
    },
    {
      id: 'shop_sg_atari',
      script: [
        { type: 'narration', zh: '扭蛋机那一排一直有"咔啦咔啦"的声音，像下雨。', en: 'The row of gacha machines makes a constant clatter, like rain.' },
        { type: 'narration', characterImage: npc('sg_gacha_girl'), zh: '你旁边一个穿校服的女生已经转了第七次。她拧开蛋壳，看了一眼，整个人僵住了。', en: 'The girl in school uniform beside you is on her seventh turn. She twists open the capsule, looks, and freezes.' },
        {
          type: 'speech', speakerZh: '穿校服的女生', speakerEn: 'Girl in Uniform',
          jp: '……やった！当たった！やっと出たー！',
          zh: '……太好了！中了！终于出来了——！',
          en: '…Yes! I got it! Finally!',
          words: [{ jp: '当たる', reading: 'あたる', zh: '中（奖）；抽中', en: 'to win; to hit' }]
        },
        { type: 'narration', zh: '她把那个小小的挂件举起来给你看，像是必须有一个人见证这一刻。你点了点头。她心满意足地走了。', en: 'She holds the tiny charm up to show you, as if someone had to witness it. You nod. She leaves completely satisfied.' }
      ]
    }
  ],

  // ================= 优衣库 =================
  uniqlo: [
    {
      id: 'shop_uq_fitting',
      script: [
        { type: 'narration', characterImage: CLERK_UNIQLO, zh: '试衣间门口的店员把号码牌递给前面的客人，客人出来的时候，她立刻迎上去。', en: 'The fitting-room clerk hands a number tag to the customer ahead. The moment the customer comes out, she is there.' },
        {
          type: 'speech', speakerZh: '店员', speakerEn: 'Clerk',
          jp: 'サイズはいかがでしたか？',
          zh: '尺码怎么样？',
          en: 'How was the size?',
          words: [{ jp: 'いかが', zh: '如何（礼貌说法）', en: 'how (polite)' }]
        },
        {
          type: 'speech', speakerZh: '客人', speakerEn: 'Customer', characterImage: npc('uq_customer'),
          jp: 'ちょっと大きかったです。ワンサイズ下、ありますか？',
          zh: '有点大。有小一号的吗？',
          en: 'A bit big. Do you have one size down?'
        },
        { type: 'narration', characterImage: '', zh: '「ワンサイズ下」。你在心里记了下来——这句话迟早用得上。', en: '"One size down." You file it away. You will need that sooner or later.' }
      ]
    },
    {
      id: 'shop_uq_fold',
      script: [
        { type: 'narration', characterImage: CLERK_UNIQLO, zh: '你从一摞T恤里抽出一件看了看，又放了回去。放回去的那一件，明显比其他的歪。', en: 'You pull a T-shirt from a stack, look at it, put it back. The one you put back is visibly crooked.' },
        { type: 'narration', zh: '不到十秒，一个店员出现在你身边，拿起那件T恤，抖开、翻面、对折、再对折。三秒钟，它变得和其他的一模一样。', en: 'Within ten seconds a clerk is beside you. She lifts the shirt, shakes it out, flips it, folds, folds again. Three seconds, and it is identical to the rest.' },
        {
          type: 'speech', speakerZh: '店员', speakerEn: 'Clerk',
          jp: 'どうぞ、ごゆっくりご覧ください。',
          zh: '请慢慢看。',
          en: 'Please, take your time.',
          words: [{ jp: 'ゆっくり', zh: '慢慢地', en: 'slowly; at leisure' }]
        },
        { type: 'narration', characterImage: '', zh: '她笑着走开了。你决定接下来什么都不碰。', en: 'She walks off smiling. You decide not to touch anything else.' }
      ]
    },
    {
      id: 'shop_uq_amayadori', weather: ['rainy'],
      script: [
        { type: 'narration', zh: '外面下起雨来，店里的人一下子多了一倍。大部分人站在门口附近，假装对袜子很感兴趣。', en: 'It starts raining outside and the shop suddenly has twice as many people. Most of them stand near the door, pretending to be fascinated by socks.' },
        {
          type: 'narration', zh: '这叫「雨宿り」——躲雨。没有人会因此被赶出去，这是这座城市默认的礼貌。',
          en: 'This is amayadori, sheltering from the rain. Nobody gets asked to leave for it. It is this city\'s unspoken courtesy.',
          words: [{ jp: '雨宿り', reading: 'あまやどり', zh: '避雨', en: 'sheltering from the rain' }]
        },
        { type: 'narration', zh: '你旁边的大叔已经把同一双袜子拿起来看了第四次了。', en: 'The man next to you has picked up the same pair of socks for the fourth time.' }
      ]
    }
  ]
};

// 收尾：主角回过神来
const REMEMBER_LINES: { jp: string; zh: string; en: string }[] = [
  { jp: 'あ、そうだ。買い物に来たんだった。……さて、何を買おうかな。', zh: '啊，对了，差点忘了我是来买东西的。……那么，要买点什么好呢？', en: 'Oh, right. I came here to shop. …So, what should I get?' },
  { jp: 'おっと、忘れるところだった。買い物、買い物……何にしようかな。', zh: '哎呀，差点给忘了。买东西、买东西……买什么好呢？', en: 'Oops, nearly forgot. Shopping, shopping… what shall I get?' },
  { jp: 'って、ぼーっとしてる場合じゃない。何か買いに来たんだった。', zh: '不对，现在不是发呆的时候。我是来买东西的。', en: 'Wait, this is no time to space out. I came to buy something.' }
];

const rememberNode = (): StoryNode => {
  const l = REMEMBER_LINES[Math.floor(Math.random() * REMEMBER_LINES.length)];
  return {
    type: 'speech', ...YOU, characterImage: '',
    jp: l.jp, zh: l.zh, en: l.en,
    words: [{ jp: '買い物', reading: 'かいもの', zh: '购物', en: 'shopping' }]
  };
};

// ---------------------------------------------------------
// 在店里碰见认识的人
// 看见她 → 面对面聊 → 聊完回过神来「差点忘了是来买东西的」→ 开门。
// ---------------------------------------------------------
const SPOT_HER: Record<ShopKind, { zh: string; en: string }> = {
  hyakkin:   { zh: '收纳用品那一排的尽头，{n}正拿着两个几乎一模一样的盒子，认真地比较着。', en: 'At the end of the storage aisle, {n} is holding two almost identical boxes, comparing them seriously.' },
  tackle:    { zh: '竿架旁边站着一个熟悉的身影——{n}正弯着腰看玻璃柜里的鱼钩。', en: 'A familiar figure by the rod rack: {n}, bent over the glass case of hooks.' },
  drugstore: { zh: '零食货架的拐角，{n}提着购物篮，篮子里已经放了三袋薯片。', en: 'Round the corner of the snack shelf, {n} is carrying a basket that already holds three bags of crisps.' },
  matsukiyo: { zh: '试用装那一排前面，{n}正对着小镜子往手背上抹着什么。', en: 'At the tester shelf, {n} is dabbing something on the back of her hand in front of a little mirror.' },
  bookoff:   { zh: '文库本的书架前，{n}站着看书，手里那本已经翻过一半了。', en: 'By the paperback shelves {n} is reading standing up, already halfway through the book in her hands.' },
  surugaya:  { zh: '玻璃展柜前，{n}把脸凑得很近，几乎要贴到玻璃上了。', en: 'At the glass display case {n} has her face so close it is nearly touching the glass.' },
  uniqlo:    { zh: '试衣间旁边的镜子前，{n}正拿着一件外套在身上比划。', en: 'By the mirror next to the fitting rooms, {n} is holding a jacket up against herself.' }
};

export const buildShopEncounter = (
  kind: ShopKind, loc: MapLocation, nameZh: string, nameEn: string
): StoryNode[] => {
  const s = SPOT_HER[kind];
  return [
    {
      type: 'scene', scene: SHOP_INTERIOR[kind], bgm: kind === 'tackle' ? 'harbor' : 'store',
      titleZh: loc.nameZh, titleEn: loc.nameEn
    },
    { type: 'narration', zh: s.zh.replace('{n}', nameZh), en: s.en.replace('{n}', nameEn) },
    { type: 'narration', zh: `你走了过去。${nameZh}抬起头。`, en: `You go over. ${nameEn} looks up.` }
  ];
};

// 聊完之后，人还在店里
export const buildShopReturn = (kind: ShopKind, loc: MapLocation): StoryNode[] => [
  {
    type: 'scene', scene: SHOP_INTERIOR[kind], bgm: kind === 'tackle' ? 'harbor' : 'store',
    titleZh: loc.nameZh, titleEn: loc.nameEn
  },
  rememberNode()
];

// 同一家店连着两次撞见同一段，会让人觉得店里只有一个剧本
const lastPlayed: Partial<Record<ShopKind, string>> = {};

const pickShopScene = (kind: ShopKind, flags: StoryFlags, calendar: GameCalendar): ShopScene | null => {
  const pool = (SHOP_SCENES[kind] || []).filter(s =>
    (!s.once || !flags[s.id]) &&
    (!s.weather || s.weather.includes(calendar.weather))
  );
  if (!pool.length) return null;
  const fresh = pool.filter(s => s.id !== lastPlayed[kind]);
  const from = fresh.length ? fresh : pool;
  return from[Math.floor(Math.random() * from.length)];
};

// 进店前要演的那一段；null = 今天什么也没发生，直接开门。
export const buildShopVisit = (
  kind: ShopKind, loc: MapLocation, ctx: { flags: StoryFlags; calendar: GameCalendar }
): StoryNode[] | null => {
  const special = pickStreetScene(loc.id, ctx);
  let body: StoryNode[] | null = null;
  let flagsToSet: string[] = [];
  if (special) {
    body = special.script;
    flagsToSet = [special.id];
  } else if (Math.random() < SHOP_SCENE_CHANCE) {
    const s = pickShopScene(kind, ctx.flags, ctx.calendar);
    if (s) {
      body = s.script;
      lastPlayed[kind] = s.id;
      if (s.once) flagsToSet = [s.id];
    }
  }
  if (!body) return null;
  return [
    {
      type: 'scene', scene: SHOP_INTERIOR[kind], bgm: kind === 'tackle' ? 'harbor' : 'store',
      titleZh: loc.nameZh, titleEn: loc.nameEn
    },
    ...body,
    ...(flagsToSet.length ? [{ type: 'effect', setFlags: flagsToSet } as StoryNode] : []),
    rememberNode()
  ];
};
