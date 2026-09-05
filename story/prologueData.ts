import { StoryNode, CharacterId } from '../types';
import { REI_PARTING, HIKARI_PARTING, MAKI_PARTING } from './prologueEncounterPartings';

// ---------------------------------------------------------
// 【第0章：海风起航之日】数据化剧本
//
// 设计原则：选项之间没有"正确答案"，只有"你想把自己养成什么样的人"。
// 每个分支都给东西，只是给的不一样；唯一什么都不给的选项，
// 换来的是一段只有那样选才看得到的独白——那是它的报酬。
// ---------------------------------------------------------

export const PROLOGUE_SCRIPT: StoryNode[] = [
  // ==========================================================
  // 【Scene 1】穿行在山海之间的列车
  // ==========================================================
  {
    type: 'scene',
    scene: 'train_interior',
    bgm: 'train',
    titleZh: '第 0 章 · 海风起航之日',
    titleEn: 'Chapter 0 · Day of the Sea Breeze',
    subtitleZh: '4 月 10 日 · JR 关西特急 · 晴',
    subtitleEn: 'April 10 · JR Kansai Limited Express · Clear'
  },
  {
    type: 'narration',
    zh: '出隧道的时候，车厢一下子亮了。你眯了一下眼睛。',
    en: 'Coming out of the tunnel the carriage goes bright all at once. You squint.'
  },
  {
    type: 'narration',
    zh: '左边是山。右边是海。',
    en: 'Mountains on the left. Sea on the right.'
  },
  {
    type: 'narration',
    zh: '……好近。海离铁轨大概只有五十米，近到你怀疑涨潮的时候会不会漫上来。',
    en: '...That is close. The water is maybe fifty metres from the rails. Close enough that you wonder what happens at high tide.'
  },
  {
    type: 'narration',
    zh: '为了今天你背了三千多个日语单词。而你现在脑子里唯一冒出来的一句是「好近」。',
    en: 'You learned over three thousand Japanese words for today. The only thing your head has produced so far is "that is close".'
  },
  {
    type: 'narration',
    zh: '行李箱立在腿边，轮子随着车厢晃动一下一下地磕着你的脚踝。你没有挪开。',
    en: 'Your suitcase stands against your leg, its wheels knocking your ankle each time the carriage rocks. You leave it there.'
  },
  {
    type: 'choice',
    promptZh: '距离到站还有十几分钟。',
    promptEn: 'A dozen minutes left before the station.',
    options: [
      {
        id: 'train_sea',
        labelZh: '把额头贴在车窗上，一直看着那片海',
        labelEn: 'Press your forehead to the glass and just watch the sea',
        hintZh: '什么也不想，先把这座城市的第一眼刻进去',
        hintEn: 'Think of nothing. Just let the first sight of this city sink in.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '把海的颜色记在了心里', reasonEn: 'You took the color of the sea to heart' }],
        setFlags: ['prologue_train_sea'],
        then: [
          {
            type: 'narration',
            zh: '玻璃是凉的。你把额头贴上去，一直看到眼睛发酸。',
            en: 'The glass is cold. You put your forehead against it and keep looking until your eyes sting.'
          },
          {
            type: 'narration',
            zh: '海一直在。防波堤挡过它两次。仓库挡过一次。挡完了它还在。',
            en: 'The sea stays. A breakwater takes it away twice. A row of warehouses once. It is still there afterwards.'
          },
          {
            type: 'narration',
            zh: '你把手机举起来，想拍一张。取景框里全是自己的倒影和玻璃上的手印。你把手机收了回去。',
            en: 'You lift your phone to take a picture. The frame is mostly your own reflection and a handprint on the glass. You put the phone away.'
          }
        ]
      },
      {
        id: 'train_study',
        labelZh: '掏出单词本，临阵磨枪背几个',
        labelEn: 'Pull out your vocabulary notebook and cram a few more',
        hintZh: '明天就要上课了，多记一个是一个',
        hintEn: 'Class starts tomorrow. One more word is one more word.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '在电车上又啃下了一页单词', reasonEn: 'Another page of vocabulary conquered on the train' }],
        setFlags: ['prologue_train_study'],
        then: [
          {
            type: 'narration',
            zh: '你翻开卷了边的单词本。「引っ越す」「手続き」「近所」。这一页你昨天在飞机上背了四遍。',
            en: 'You open the dog-eared notebook. "To move house." "Paperwork." "Neighborhood." You went through this page four times on the plane yesterday.'
          },
          {
            type: 'narration',
            zh: '车窗外的海只在你翻页的间隙里，一闪一闪地掠过。',
            en: 'The sea outside flashes past only in the gaps between turning pages.'
          }
        ]
      },
      {
        id: 'train_journal',
        labelZh: '翻开外祖父给的那本手账',
        labelEn: 'Open the journal your grandfather gave you',
        hintZh: '他年轻时也是坐着这条线来的吧',
        hintEn: 'He must have ridden this same line, once.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '隔着半个世纪，和外公坐了同一趟车', reasonEn: 'Half a century apart, you rode the same train as your grandfather' }],
        setFlags: ['prologue_train_journal'],
        then: [
          {
            type: 'narration',
            zh: '牛皮封面被摩挲得发亮。你翻到中间某一页，上面是一行褪色的钢笔字：「海が見えたら、もうすぐ神戸」。',
            en: 'The leather cover is worn glossy. You turn to a page in the middle: a faded line of fountain pen ink. "When you can see the sea, Kobe is close."'
          },
          {
            type: 'narration',
            zh: '你抬头。窗外，正是那片海。',
            en: 'You look up. Outside the window: that very sea.'
          }
        ]
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '车厢广播',
    speakerEn: 'Train Announcement',
    jp: 'まもなく、三ノ宮、三ノ宮です。JR神戸線、阪神電車、阪急電鉄をご利用のお客様はお乗り換えです。お忘れ物のないよう、ご注意ください……',
    words: [
          { jp: "お忘れ物", reading: "おわすれもの", zh: "遗失物品（车站广播固定说法）", en: "forgotten belongings (station announcement)" },
          { jp: "お乗り換え", reading: "おのりかえ", zh: "换乘", en: "transfer (to another line)" }
    ],
    zh: '前方到站，三宫，三宫。换乘 JR 神户线、阪神电车、阪急电铁的乘客请在此下车。请注意不要遗忘随身物品……',
    en: 'Arriving shortly at Sannomiya. Passengers transferring to the JR Kobe Line, Hanshin, or Hankyu lines, please change here. Please take care not to leave anything behind...',
    color: 'bg-slate-600'
  },
  {
    type: 'narration',
    zh: '报站的女声一个字一个字咬得很清楚，清楚到你全听懂了。你把手伸进胸前口袋，摸出那张昨天才买的 ICOCA。',
    en: 'The announcement is enunciated so clearly that you follow every word of it. You reach into your breast pocket and find the ICOCA you bought yesterday.'
  },
  {
    type: 'speech',
    speakerZh: '你',
    speakerEn: 'You',
    jp: '三ノ宮……',
    zh: '三ノ宮……这个名字在听力题里出现过几十次。今天它变成了一个地方。',
    en: 'Sannomiya... That name came up dozens of times in listening practice. Today it turns out to be a place.',
    color: 'bg-yellow-500'
  },

  // ==========================================================
  // 【Scene 2】踏上三宫站台与第一声问候
  // ==========================================================
  {
    type: 'scene',
    scene: 'sannomiya_station_prologue',
    bgm: 'town',
    titleZh: '三宫站 · 中央出闸口',
    titleEn: 'Sannomiya Station · Central Gates',
    subtitleZh: '下午 3:20 · 人潮与海风',
    subtitleEn: '3:20 PM · Crowds and sea breeze'
  },
  {
    type: 'narration',
    zh: '车门滑开，微甜的海风混杂着关西老街烘焙面包的香气扑面而来。你一手拉过沉重的黑色行李箱，稳稳跨出了车厢。',
    en: 'The doors slide open and a faintly sweet sea breeze rushes in, tangled with the smell of bread baking somewhere in the old Kansai streets. You haul your heavy black suitcase and step down firmly onto the platform.'
  },
  {
    type: 'narration',
    zh: '在出闸机前，一位抱着大包小包、正匆忙赶路的年轻母亲不小心掉落了怀里的儿童画册。',
    en: 'At the ticket gates, a young mother juggling far too many bags fumbles, and the children’s picture book she was carrying slips from her arms.'
  },
  {
    type: 'narration',
    zh: '画册滑到了你的脚边。她没有察觉，正手忙脚乱地把孩子往闸机里领。',
    en: 'It slides to a stop at your feet. She has not noticed — she is busy steering her child through the gate.'
  },
  {
    type: 'choice',
    promptZh: '周围人来人往，没有人停下来。',
    promptEn: 'People stream past on all sides. Nobody stops.',
    options: [
      {
        id: 'pickup_speak',
        labelZh: '弯腰捡起来，快步追上去用日语递给她',
        labelEn: 'Pick it up, catch up to her, and hand it over in Japanese',
        jp: 'あの、これ、落としましたよ。',
        words: [{ jp: '落とす', reading: 'おとす', zh: '掉、弄丢', en: 'to drop' }],
        hintZh: '第一次在这个国家开口',
        hintEn: 'The first words you speak in this country.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '把别人的东西当成自己的事', reasonEn: 'You treated a stranger’s problem as your own' },
          { stat: 'guts', amount: 1, reasonZh: '在异国他乡，第一次主动开口', reasonEn: 'In a foreign country, you spoke first' }
        ],
        setFlags: ['prologue_helped_mother', 'prologue_spoke_first'],
        then: [
          {
            type: 'speech',
            speakerZh: '你',
            speakerEn: 'You',
            jp: 'あの、落としましたよ。どうぞ。',
            words: [
                  { jp: "落とす", reading: "おとす", zh: "掉落、弄丢", en: "to drop / to let fall" }
            ],
            zh: '那个，您的东西掉了。请拿好。',
            en: 'Um, excuse me — you dropped this. Here you go.',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            zh: '年轻母亲愣了半秒，随即露出极其真诚温暖的笑容，微微鞠了个躬。',
            en: 'The young mother freezes for half a second, then breaks into a completely genuine, warm smile and bows slightly.'
          },
          {
            type: 'speech',
            speakerZh: '年轻的母亲',
            speakerEn: 'Young Mother',
            jp: 'あら！ありがとうございます！助かりました！',
            words: [
                  { jp: "助かる", reading: "たすかる", zh: "得救了、帮大忙了", en: "to be saved / \"that really helps\"" }
            ],
            zh: '哎呀！太谢谢您了！真是帮了大忙！',
            en: 'Oh! Thank you so much! You really saved me!',
            color: 'bg-rose-400'
          },
          {
            type: 'narration',
            zh: '只是几句最基础的日常口语。但当书本上的单词真正变成连接人与人之间善意的桥梁时，那种踏实的成就感，是任何考试分数都替代不了的。',
            en: 'Just a few lines of the most basic everyday Japanese. But when textbook words become an actual bridge of goodwill between two people, the feeling that settles in your chest is something no exam score has ever given you.'
          }
        ]
      },
      {
        id: 'pickup_silent',
        labelZh: '捡起来，默默递过去就走',
        labelEn: 'Pick it up, hand it over silently, and move on',
        hintZh: '帮忙是要帮的，但话到嘴边还是咽了回去',
        hintEn: 'You will help. You just cannot get the words out.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '话没说出口，手先动了', reasonEn: 'The words stuck, but your hands moved anyway' }
        ],
        setFlags: ['prologue_helped_mother'],
        then: [
          {
            type: 'narration',
            zh: '你捡起画册，快步追上去递到她手里。「あの……」到了嘴边的那句话，最后还是没能完整地说出来。',
            en: 'You pick up the book, catch up, and press it into her hands. "Um..." The sentence you had ready dissolves before it can finish.'
          },
          {
            type: 'narration',
            zh: '她还是笑着道了谢。你点点头，转身拉起行李箱。',
            en: 'She thanks you anyway, smiling. You nod, turn, and take hold of your suitcase again.'
          },
          {
            type: 'narration',
            zh: '走出十几步，你才小声地、对着空气把那句话补完了：「……落としましたよ。」',
            en: 'A dozen steps later, quietly, to nobody at all, you finish the sentence: "...you dropped this."'
          }
        ]
      },
      {
        id: 'pickup_ignore',
        labelZh: '装作没看见，拉着行李箱走自己的路',
        labelEn: 'Pretend not to notice and keep walking',
        hintZh: '你连自己的行李都还没安顿好',
        hintEn: 'You haven’t even worked out where you’re sleeping tonight.',
        setFlags: ['prologue_ignored_mother'],
        then: [
          {
            type: 'narration',
            zh: '你把视线移开，拉着行李箱从画册旁边绕了过去。轮子在瓷砖地上滚过，发出很响的声音。',
            en: 'You look away and wheel your suitcase around the fallen book. The casters rattle loudly across the tile.'
          },
          {
            type: 'narration',
            zh: '身后传来另一个人弯腰的窸窣声，和那句你已经听过无数遍的「ありがとうございます」。',
            en: 'Behind you: the rustle of someone else bending down, and that phrase you have heard a hundred times in recordings. "Thank you very much."'
          },
          {
            type: 'narration',
            zh: '不是你说的。你走进了闸机口，把那点说不上来的滋味一起带了进去。',
            en: 'It was not said to you. You pass through the gate, carrying with you a feeling you cannot quite name.'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // 【Scene 3】北野坡道与「海风庄」
  // ==========================================================
  {
    type: 'scene',
    scene: 'kitano_slope',
    bgm: 'town',
    titleZh: '北野异人馆坡道',
    titleEn: 'Kitano Ijinkan Slope',
    subtitleZh: '下午 4:30 · 橘金色的夕阳',
    subtitleEn: '4:30 PM · Amber gold sunlight'
  },
  {
    type: 'narration',
    zh: '拉着行李箱沿北野坡道一路向上。坡度陡得让你鼻尖冒汗，行李箱的轮子在石板缝里一路磕磕绊绊。',
    en: 'You drag the suitcase up the Kitano slope. It is steep enough to bring sweat to the bridge of your nose, and the wheels catch in every seam of the cobblestones.'
  },
  {
    type: 'narration',
    zh: '左侧是爬满常春藤的风见鸡馆，右侧是飘着黄油香的百年老面包铺。一阵山风卷过，满地粉白落樱被吹得打了个旋。',
    en: 'To the left, the ivy-covered Weathercock House. To the right, a century-old bakery breathing butter into the street. A gust off the mountain sends the fallen cherry petals spiraling.'
  },
  {
    type: 'scene',
    scene: 'umikaze_exterior',
    bgm: 'town',
    titleZh: '「海风庄」· 201 室',
    titleEn: 'Umikaze-so · Room 201'
  },
  {
    type: 'narration',
    zh: '坡走到一半有个拐角。你差点走过去，是门牌上那三个黄铜字把你叫回来的：海风荘。三层楼，木头窗框，外墙的漆补过。',
    en: 'There is a bend halfway up. You nearly walk past it; what calls you back is three brass characters on a nameplate. Umikaze-so. Three storeys, wooden window frames, paint patched in places.'
  },
  {
    type: 'narration',
    zh: '钥匙转动锁芯，「カチャリ」一声清脆的响。',
    en: 'The key turns in the lock with a crisp, satisfying click.'
  },

  // ==========================================================
  // 【Scene 4】201 室 · 安顿下来
  // ==========================================================
  {
    type: 'scene',
    scene: 'apartment_room',
    bgm: 'lobby',
    titleZh: '海风庄 201 室',
    titleEn: 'Umikaze-so, Room 201'
  },
  {
    type: 'narration',
    zh: '推开厚实的实木房门，阳光正透过宽敞的阳台玻璃门洒在原木地板上。房间干净清爽，空气里带着淡淡的雪松木香。',
    en: 'The heavy wooden door swings open. Sunlight pours through the wide balcony doors onto bare wood flooring. The room is clean and airy, and the air carries a faint scent of cedar.'
  },
  {
    type: 'scene',
    scene: 'apartment_balcony',
    bgm: 'lobby',
    titleZh: '201 室 · 阳台',
    titleEn: 'Room 201 · Balcony'
  },
  {
    type: 'narration',
    zh: '你把行李箱扔在门口就去开阳台门。门轨涩，推到一半卡了一下。第二下推开的时候，风先进来的。',
    en: 'You leave the suitcase by the door and go for the balcony. The track is stiff and it jams halfway. On the second shove it opens, and what comes in first is the wind.'
  },
  {
    type: 'narration',
    zh: '鲜红挺拔的神户港塔立在岸边，远处 Mosaic 的彩色摩天轮正缓缓转动，整个海湾在夕阳下泛着熔金一样的光。',
    en: 'The scarlet Port Tower stands sharp against the shore. Far off, the Mosaic ferris wheel turns slowly in color, and the whole bay glows like molten gold in the setting sun.'
  },
  {
    type: 'speech',
    speakerZh: '你',
    speakerEn: 'You',
    zh: '神户……真的好美啊。从今天开始，这里就是我全新的起点了。',
    en: 'Kobe... it really is beautiful. From today, this is where I start over.',
    color: 'bg-yellow-500'
  },
  {
    type: 'scene',
    scene: 'apartment_room',
    bgm: 'lobby',
  },
  {
    type: 'narration',
    zh: '行李箱躺在房间正中，拉链敞着。天还没黑，时间够你把这个家收拾出个样子来。',
    en: 'The suitcase lies open in the middle of the room. It is not dark yet — there is still time to make this place feel like somewhere you live.'
  },
  {
    type: 'choice',
    promptZh: '先从哪儿开始？',
    promptEn: 'Where do you start?',
    options: [
      {
        id: 'unpack_books',
        labelZh: '先把书和课本一本本码上书架',
        labelEn: 'Line the books and textbooks up on the shelf first',
        hintZh: '书架空着，房间就不算你的',
        hintEn: 'An empty bookshelf means the room isn’t yours yet.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '书架立起来了，房间就有了主心骨', reasonEn: 'With the shelf filled, the room finally has a spine' }],
        setFlags: ['prologue_unpack_books'],
        then: [
          {
            type: 'narration',
            zh: '词典、语法书、三本翻烂了的真题集，按厚度排开。你退后两步看了看，又回去把最左边那本往里推了一厘米。',
            en: 'Dictionary, grammar reference, three past-paper collections worn soft at the corners, lined up by thickness. You step back two paces to look, then go back and push the leftmost one in by a centimetre.'
          }
        ]
      },
      {
        id: 'unpack_clean',
        labelZh: '先擦地板、把厨房归置出来',
        labelEn: 'Wipe down the floors and get the kitchen in order first',
        hintZh: '能自己做饭，日子才立得住',
        hintEn: 'A life stands on being able to cook your own dinner.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '厨房归位，第一次有了「过日子」的手感', reasonEn: 'Kitchen in order — the first real feel of running a household' }],
        setFlags: ['prologue_unpack_clean'],
        then: [
          {
            type: 'narration',
            zh: '你把水槽刷干净，锅碗按大小摞好，抹布搭在水龙头上。地板擦到第三遍时，木头开始反光了。',
            en: 'You scrub the sink, stack pots and bowls by size, and drape the cloth over the tap. By the third pass over the floor, the wood starts to give back the light.'
          },
          {
            type: 'narration',
            zh: '手心有点酸，但看着这间干干净净的屋子，你心里意外地踏实。',
            en: 'Your palms ache a little. But looking at the clean, ordered room, you feel unexpectedly steady.'
          }
        ]
      },
      {
        id: 'unpack_call',
        labelZh: '什么都先不收拾，给外公发条报平安的消息',
        labelEn: 'Leave it all. Message your grandfather to say you arrived safe.',
        hintZh: '他这会儿肯定还守着手机',
        hintEn: 'He is definitely still sitting there watching his phone.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '知道有人在等这条消息', reasonEn: 'You knew someone was waiting for that message' }],
        setFlags: ['prologue_unpack_call'],
        then: [
          {
            type: 'narration',
            zh: '「到了，一切都好。阳台上能看见海。」你拍了张港口的照片一起发过去。',
            en: '"Arrived. Everything is fine. I can see the sea from the balcony." You attach a photo of the harbor and send it.'
          },
          {
            type: 'narration',
            zh: '几乎是秒回。老人家显然守着手机等了一整天：「好。照片里的塔，我当年也天天看。」',
            en: 'The reply is almost instant. He has clearly been watching his phone all day. "Good. That tower in the photo — I used to look at it every day too."'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // 【Scene 4b】外祖父的泛黄手账
  // ==========================================================
  {
    type: 'scene',
    scene: 'grandfather_journal',
    bgm: 'title',
  },
  {
    type: 'narration',
    zh: '书排完了，背包里还剩一样。你把它拿出来的时候两只手都用上了，虽然它并不重。牛皮封面，很厚。',
    en: 'The books are done and there is one thing left in the backpack. You use both hands to lift it out, though it is not heavy. Leather cover. Thick.'
  },
  {
    // 序章唯一一张 CG。播完永久进回忆图鉴——
    // 图鉴里那张"你确实经历过"的证据，不该只有好感度能解锁。
    type: 'cg',
    cgId: 'cg_prologue_grandfather_journal',
    imageUrl: '/images/cg/cg_prologue_grandfather_journal.webp',
    titleZh: '外祖父的泛黄手账',
    titleEn: "Grandfather's Yellowed Journal",
    captionZh: '牛皮封面已经被摩挲得发亮，钢笔字迹褪成了浅褐色。书页之间夹着一张神户港的旧照片。',
    captionEn: 'The leather cover has been worn smooth by handling; the fountain-pen script has faded to pale brown. An old photograph of Kobe harbour is pressed between the pages.'
  },
  {
    type: 'narration',
    zh: '那是临行前外祖父笑呵呵交到你手里的宝贝。他年轻时也曾作为留学生在神户求学。扉页上是他苍劲有力的手写字迹：',
    en: 'His parting gift, handed over with a laugh. He too came to Kobe as an exchange student once. On the first page, in his strong, angular handwriting:'
  },
  {
    type: 'narration',
    zh: '「致我的孙儿：当你翻开这本手账时，应该已经站在神户的海风里了吧？独自在异国生活，最重要的不是把语法背得多熟练，而是永远保持一份真诚、大度与探索的勇气。」',
    en: '"To my grandchild: by the time you open this, you are standing in the sea wind of Kobe, aren’t you? Living alone in a foreign country, what matters most is not how well you have memorized your grammar. It is keeping your sincerity, your generosity, and your courage to go and look."'
  },
  {
    type: 'narration',
    zh: '「饿了就去三宫吃碗热腾腾的拉面，遇到不懂的习俗就大大方方地向周围人请教。这本手账里记录了我当年在神户走过的那些老街、神社与未曾说完的故事。现在，把它交给你了。」',
    en: '"When you are hungry, go to Sannomiya and eat a hot bowl of ramen. When you do not understand a custom, ask the people around you, openly. In this journal are the old streets, the shrines, and the stories I never finished telling. Now it is yours."'
  },
  {
    type: 'narration',
    zh: '后半本比前半本鼓。你捏着书脊翻开，里面夹着几张对折的纸。展开是手绘的神户地图，边上写满了字，小得要凑近才看得清。',
    en: 'The back half sits fatter than the front. You hold the spine and open it: folded sheets inside. Unfolded, they are hand-drawn maps of Kobe, the margins written over in a hand small enough that you have to lean in.'
  },
  {
    type: 'choice',
    promptZh: '窗外的天正在一点点变暗。',
    promptEn: 'Outside the window, the light is going.',
    options: [
      {
        id: 'journal_deep',
        labelZh: '打开台灯，一页一页把注记读完',
        labelEn: 'Switch on the desk lamp and read every annotation, page by page',
        hintZh: '这些地方，他一定是想让你去的',
        hintEn: 'These places — he must have meant for you to go.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '读懂了半个世纪前的一整座城市', reasonEn: 'You read an entire city as it was half a century ago' }],
        setFlags: ['prologue_read_journal_deep'],
        then: [
          {
            type: 'narration',
            zh: '你在书桌前坐了很久。地图上有些街名早就改了，有些神社的位置标着两个圈，旁边写着「移転？要確認」。',
            en: 'You sit at the desk for a long time. Some street names on the map no longer exist. One shrine is circled twice, with a note beside it: "Relocated? To verify."'
          },
          {
            type: 'narration',
            zh: '最后一页的角落里，有一行被反复描过的字，墨迹比别处都深：「あの人に、まだ渡していない。」',
            en: 'In the corner of the last page, one line has been traced over again and again, the ink darker than anywhere else: "I still have not given it to her."'
          },
          {
            type: 'narration',
            zh: '……下面是空的。这一页写完就没再写了。你把手账合上，在桌边坐了一会儿没动。',
            en: 'The rest of the page is blank. He wrote that line and did not write another. You close the journal and sit at the desk for a while without moving.'
          }
        ]
      },
      {
        id: 'journal_shelf',
        labelZh: '只看扉页，把手账端端正正放在书桌正中',
        labelEn: 'Read only the first page, and set the journal squarely at the center of the desk',
        hintZh: '这种东西，要挑一个静下来的时候读',
        hintEn: 'Something like this deserves a quieter hour.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '有些东西值得等一个更好的时候', reasonEn: 'Some things deserve to be waited for' }],
        setFlags: ['prologue_journal_shelved'],
        then: [
          {
            type: 'narration',
            zh: '你把封面按平，把它摆在书桌正中间。抽屉是空的，但你没往里放。',
            en: 'You press the cover flat and set it in the middle of the desk. The drawer is empty. You do not put it in the drawer.'
          },
          {
            type: 'narration',
            zh: '「等安顿下来，我会一页一页读完的。」你在心里对他说。',
            en: '"Once I’ve settled in, I’ll read all of it. Every page." You say it to him, silently.'
          }
        ]
      },
      {
        id: 'journal_out',
        labelZh: '合上手账——比起读，现在更想出去看看这座城市',
        labelEn: 'Close it. Right now you would rather go see the city than read about it.',
        hintZh: '「遇到不懂的就大大方方去问」——他是这么写的',
        hintEn: '"Ask the people around you, openly." That is what he wrote.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '与其读别人的地图，不如自己去走一遍', reasonEn: 'Better to walk it yourself than read someone else’s map' }],
        setFlags: ['prologue_eager_out'],
        then: [
          {
            type: 'narration',
            zh: '你抓起外套。他写的是「去走出属于你自己的精彩青春」。这句话你外公说得出口，你说不出口，但你已经在穿鞋了。',
            en: 'You grab your jacket. He wrote: go and live a youth that is your own. He could say a thing like that out loud; you could not. You are already putting your shoes on.'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // 【Scene 5】傍晚 · 出门溜达
  // ==========================================================
  {
    type: 'scene',
    scene: 'kitano_slope',
    bgm: 'town',
    titleZh: '北野坡道 · 傍晚',
    titleEn: 'Kitano Slope · Evening',
    subtitleZh: '下午 6:10 · 天边最后一点橘色',
    subtitleEn: '6:10 PM · The last orange at the edge of the sky'
  },
  {
    type: 'narration',
    zh: '锁上 201 室的门，你踩着坡道往下走。肚子已经开始叫了，冰箱是空的，晚饭还没有着落。',
    en: 'You lock the door of Room 201 and head back down the slope. Your stomach has started complaining. The fridge is empty. Dinner is an open question.'
  },
  {
    type: 'narration',
    zh: '路灯一盏接一盏亮起来，从坡底往上追。你走到门口才想起来自己没有目的地。',
    en: 'The streetlights come on one after another, chasing up the hill from the bottom. You get as far as the door before it occurs to you that you have nowhere to be.'
  },
  {
    type: 'choice',
    promptZh: '往哪边走？',
    promptEn: 'Which way?',
    options: [
      {
        id: 'walk_kitano',
        labelZh: '往上走，钻进异人馆之间的小巷',
        labelEn: 'Go up, into the alleys between the old Western houses',
        hintZh: '外公的地图上，这一带画得最密',
        hintEn: 'This is the densest part of your grandfather’s map.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '把这一带的路记进了脑子里', reasonEn: 'You mapped the neighborhood into your head' }],
        setFlags: ['prologue_walk_kitano', 'prologue_met_rei'],
        then: [
          {
            type: 'narration',
            zh: '巷子窄得只容两人并行，两侧是十九世纪的砖木洋馆。有一栋门口挂着褪色的铜牌，上面的年份是 1904。',
            en: 'The alley is barely wide enough for two people abreast, walled in by nineteenth-century brick and timber houses. One has a faded bronze plaque by the door. The year on it reads 1904.'
          },
          {
            type: 'narration',
            zh: '你绕了三个弯，居然一次都没迷路。原来外公画的那张图，到今天还是准的。',
            en: 'You take three turns and never once lose your bearings. The map your grandfather drew still holds, after all this time.'
          },
          // ---- 偶遇 · 石阶上的红框眼镜 ----
          {
            type: 'narration',
            characterImage: '/images/characters/rei/casual_neutral.webp',
            zh: '转过第四个弯时，你差点撞上一个人。她站在一栋洋馆的石阶前，一手托着摊开的书，一手拿着铅笔，正对着门楣上的雕花较劲。',
            en: 'On the fourth turn you nearly walk into someone. She is standing at the stone steps of one of the houses, an open book balanced on one hand and a pencil in the other, squaring off against the carving above the door.'
          },
          {
            type: 'speech',
            speakerZh: '戴眼镜的女生',
            speakerEn: 'Girl with Glasses',
            jp: '……すみません、通りますか？',
            words: [
              { jp: '通る', reading: 'とおる', zh: '通过、经过', en: 'to pass through' }
            ],
            zh: '……不好意思，您要过去吗？',
            en: '...Excuse me. Did you want to get past?',
            color: 'bg-emerald-500'
          },
          {
            type: 'narration',
            zh: '你这才发现自己堵在了窄巷正中间，慌忙侧过身。她轻轻点了下头，视线又回到了门楣上。',
            en: 'Only now do you notice you are standing squarely in the middle of the alley. You step aside in a hurry. She gives a small nod and returns her attention to the doorway.'
          },
          {
            type: 'choice',
            promptZh: '她盯着那朵石雕的花，已经盯了很久了。',
            promptEn: 'She has been staring at that carved flower for a long while now.',
            options: [
              {
                id: 'rei_ask',
                labelZh: '指着门楣上的雕花，问她这是什么',
                labelEn: 'Point at the carving over the door and ask what it is',
                jp: 'あの、これは何ですか。',
                hintZh: '外公说过：遇到不懂的，就大大方方地问',
                hintEn: 'Your grandfather wrote it down: when you do not understand, ask, openly.',
                effects: [
                  { stat: 'knowledge', amount: 1, reasonZh: '把这条巷子的来历问明白了', reasonEn: 'You got the history of this alley straight from someone who knew it' },
                  { stat: 'guts', amount: 1, reasonZh: '对着陌生人主动提了个问题', reasonEn: 'You asked a stranger a question, unprompted' }
                ],
                relations: [
                  { char: CharacterId.REI, familiarity: 12, affection: 2, reasonZh: '问了一个她愿意回答的问题', reasonEn: 'You asked the one kind of question she likes answering' }
                ],
                setFlags: ['prologue_rei_asked'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/rei/casual_neutral.webp',
                    zh: '她转过头看了你两秒。镜片反光，你看不清那两秒里她在想什么。然后她把书往臂弯里换了个手。',
                    en: 'She turns and looks at you for two seconds. The lenses catch the light and you cannot see what happens in those two seconds. Then she shifts the book to her other arm.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '戴眼镜的女生',
                    speakerEn: 'Girl with Glasses',
                    characterImage: '/images/characters/rei/casual_neutral.webp',
                    jp: 'アカンサスです。地中海の植物。……この街の異人館には、なぜか一番多く彫られています。',
                    words: [
                      { jp: '彫る', reading: 'ほる', zh: '雕刻', en: 'to carve / to engrave' }
                    ],
                    zh: '是老鼠簕。地中海的植物。……不知道为什么，这座城市的异人馆上，刻得最多的就是它。',
                    en: 'Acanthus. A Mediterranean plant. ...For some reason it is the most commonly carved motif on the Western houses in this city.',
                    color: 'bg-emerald-500'
                  },
                  {
                    type: 'narration',
                    zh: '她说得很慢，每个词之间留一点空。她没有问你听不听得懂，也没有换成简单的说法。',
                    en: 'She speaks slowly, leaving a little space between the words. She does not ask whether you follow, and she does not switch to easier ones.'
                  },
                  {
                    type: 'narration',
                    characterImage: '/images/characters/rei/casual_smile.webp',
                    zh: '你没好意思说：那正是你此刻最需要的语速。',
                    en: 'You do not have the nerve to tell her that is exactly the speed you needed.'
                  }
                ]
              },
              {
                id: 'rei_journal',
                labelZh: '把外公的手账翻到这一页，递过去给她看',
                labelEn: "Open your grandfather's journal to this page and hold it out to her",
                hintZh: '半个世纪前，有人也站在这条巷子里画过图',
                hintEn: 'Half a century ago someone else stood in this alley and drew it.',
                effects: [
                  { stat: 'knowledge', amount: 1, reasonZh: '让两张相隔五十年的地图对上了', reasonEn: 'You laid two maps fifty years apart side by side' },
                  { stat: 'charm', amount: 1, reasonZh: '把自己最珍贵的东西先递了出去', reasonEn: 'You offered up the thing you treasure most, first' }
                ],
                relations: [
                  { char: CharacterId.REI, familiarity: 14, affection: 3, reasonZh: '让她看见了一张五十年前的手绘地图', reasonEn: 'You showed her a hand-drawn map fifty years old' }
                ],
                setFlags: ['prologue_rei_journal'],
                then: [
                  {
                    type: 'narration',
                    zh: '你从背包里翻出那本牛皮手账，找到画着这一带的那一页，递到她面前。',
                    en: 'You dig the leather journal out of your bag, find the page with this neighborhood on it, and hold it out to her.'
                  },
                  {
                    type: 'narration',
                    characterImage: '/images/characters/rei/casual_neutral.webp',
                    zh: '她放下自己的书，双手接了过去。翻页的动作很轻，像在处理不属于自己的东西。',
                    en: 'She sets her own book down and takes it with both hands. She turns the page carefully, the way one handles something that belongs to someone else.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '戴眼镜的女生',
                    speakerEn: 'Girl with Glasses',
                    characterImage: '/images/characters/rei/casual_neutral.webp',
                    jp: '……手描きですか。しかも、この道はもう無くなっているのに、ちゃんと残っている。',
                    words: [
                      { jp: '残る', reading: 'のこる', zh: '留下、残存', en: 'to remain / to be left behind' }
                    ],
                    zh: '……是手绘的吗。而且，这条路早就不在了，图上却还留着。',
                    en: '...Hand-drawn. And this street no longer exists — yet here it still is.',
                    color: 'bg-emerald-500'
                  },
                  {
                    type: 'narration',
                    zh: '她盯着那张图看了很久，久到你以为她已经忘了你还站在旁边。',
                    en: 'She studies the page for a long time — long enough that you begin to think she has forgotten you are standing there.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '戴眼镜的女生',
                    speakerEn: 'Girl with Glasses',
                    characterImage: '/images/characters/rei/casual_smile.webp',
                    jp: '見せてくださって、ありがとうございました。……いい地図です。とても。',
                    zh: '谢谢您给我看。……这是张好地图。非常好。',
                    en: 'Thank you for letting me see it. ...It is a good map. A very good one.',
                    color: 'bg-emerald-500'
                  },
                  {
                    type: 'narration',
                    zh: '她把手账还给你，指尖在封面上停了半秒才收回去。',
                    en: 'She hands the journal back. Her fingertips rest on the cover for half a second before she withdraws them.'
                  }
                ]
              },
              {
                id: 'rei_pass',
                labelZh: '道个歉，侧身走过去',
                labelEn: 'Apologize and slip past',
                hintZh: '别打扰人家',
                hintEn: 'Do not bother her.',
                effects: [
                  { stat: 'kindness', amount: 1, reasonZh: '把别人的专注留给了别人', reasonEn: 'You left someone’s concentration where you found it' }
                ],
                relations: [
                  { char: CharacterId.REI, familiarity: 4, reasonZh: '在窄巷里让了一次路', reasonEn: 'You gave way once, in a narrow alley' }
                ],
                setFlags: ['prologue_rei_passed'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/rei/casual_neutral.webp',
                    zh: '你说了句「すみません」侧身让开。她也说了句「すみません」。两个人在窄巷里像两块错开的积木。',
                    en: 'You say "sumimasen" and step aside. She says "sumimasen" back. The two of you slot past each other in the narrow alley like a pair of mismatched blocks.'
                  },
                  {
                    type: 'narration',
                    characterImage: '',
                    zh: '走出巷口回头看，她还站在那儿，一动不动地对着那扇门。',
                    en: 'At the mouth of the alley you look back. She is still there, motionless, facing that doorway.'
                  },
                  {
                    type: 'narration',
                    zh: '她走了以后你才想起来，那句话你本来还有半句没说。',
                    en: 'It is only after she has gone that you remember there was another half to that sentence.'
                  }
                ]
              }
            ]
          },
          ...REI_PARTING
        ]
      },
      {
        id: 'walk_harbor',
        labelZh: '往下走，一直走到海边',
        labelEn: 'Go down, all the way to the water',
        hintZh: '从阳台上看了一下午，总得走到跟前去',
        hintEn: 'You watched it all afternoon from the balcony. You should stand next to it.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '对着海湾深吸了一口气', reasonEn: 'You filled your lungs facing the open bay' }],
        setFlags: ['prologue_walk_harbor', 'prologue_met_hikari'],
        then: [
          { type: 'scene', scene: 'kobe_harbor', bgm: 'town' },
          {
            type: 'narration',
            zh: '一路下坡走了二十分钟，终于站到了海边的栏杆前。港塔的红色霓虹刚刚点亮，海面被切成一条一条晃动的光带。',
            en: 'Twenty minutes downhill and you are standing at the harbor railing. The Port Tower has just lit up red, cutting the water into swaying ribbons of light.'
          },
          {
            type: 'narration',
            zh: '风比坡道上大得多，从领口往里灌，是咸的。你吸了一口，呛了一下，站在那儿笑了半天。',
            en: 'The wind is much stronger here. It goes in at the collar and it tastes of salt. You take a mouthful, choke on it, and stand there laughing for a while.'
          },
          {
            type: 'narration',
            zh: '没有人认识你。你可以从头开始做任何人。',
            en: 'Nobody here knows you. You could start over as anyone at all.'
          },
          // ---- 偶遇 · 栏杆上的黄色卫衣 ----
          {
            type: 'narration',
            zh: '右手边的栏杆那儿炸开一声惊呼。',
            en: 'A yelp goes off at the railing to your right.'
          },
          {
            type: 'narration',
            characterImage: '/images/characters/hikari/casual_surprised.webp',
            zh: '一个金发的女生举着手机对准港塔，棒球帽反戴着，整个人几乎要探出栏杆外面去。',
            en: 'A blonde girl has her phone aimed at the Port Tower, cap on backwards, leaning so far over the railing she is most of the way outside it.'
          },
          {
            type: 'speech',
            speakerZh: '金发的女生',
            speakerEn: 'Blonde Girl',
            characterImage: '/images/characters/hikari/casual_surprised.webp',
            jp: 'うわ、やば！これ絶対いいやつ撮れた！',
            words: [
              { jp: 'やばい', zh: '（口语）绝了 / 糟了，看语气', en: '"insane" / "no way" — slang, good or bad by tone' }
            ],
            zh: '哇，绝了！这张绝对拍到好东西了！',
            en: 'Whoa — no way! I definitely just got a good one!',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '她拍完回过头，正好和你对上视线。你还没来得及移开，她的眼睛就亮了。',
            en: 'She turns from the shot and her eyes land straight on you. Before you can look away, they light up.'
          },
          {
            type: 'speech',
            speakerZh: '金发的女生',
            speakerEn: 'Blonde Girl',
            characterImage: '/images/characters/hikari/casual_happy.webp',
            jp: 'あ！ねえねえ、もしかして留学生？！だよね？！絶対そうだよね？！',
            words: [
              { jp: '留学生', reading: 'りゅうがくせい', zh: '留学生', en: 'international student' }
            ],
            zh: '啊！那个那个，你该不会也是留学生吧？！是吧？！绝对是吧？！',
            en: 'Ah! Hey, hey — are you an exchange student?! You are, right?! You totally are, right?!',
            color: 'bg-amber-400'
          },
          {
            type: 'narration',
            zh: '你还没来得及回答，她已经跨了两大步站到你面前，帽檐底下是一张毫无防备的笑脸。',
            en: 'Before you can answer she has crossed two long strides and is standing in front of you, an entirely unguarded grin under the cap brim.'
          },
          {
            type: 'choice',
            promptZh: '她的语速比车厢广播还快。',
            promptEn: 'She talks faster than the train announcements.',
            options: [
              {
                id: 'hikari_answer',
                labelZh: '老老实实回答：今天刚到',
                labelEn: 'Answer straight: you only got here today',
                jp: 'はい、今日、着いたばかりです。',
                words: [{ jp: 'ばかり', reading: 'ばかり', zh: '刚刚（做完）', en: 'only just' }],
                hintZh: '「刚到」这三个字，说出口才发觉是真的',
                hintEn: 'Only once you say "just arrived" does it become true.',
                effects: [
                  { stat: 'guts', amount: 1, reasonZh: '面对连珠炮没有退后半步', reasonEn: 'You did not take a step back from the barrage' }
                ],
                relations: [
                  { char: CharacterId.HIKARI, familiarity: 12, affection: 2, reasonZh: '在海边认下了同为留学生的身份', reasonEn: 'You owned up to being an exchange student too, at the water’s edge' }
                ],
                setFlags: ['prologue_hikari_answered'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/hikari/casual_happy.webp',
                    zh: '「今天」两个字一出口，她整个人都跳了起来。',
                    en: 'The word "today" is barely out of your mouth before she leaves the ground entirely.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '金发的女生',
                    speakerEn: 'Blonde Girl',
                    characterImage: '/images/characters/hikari/casual_happy.webp',
                    jp: '今日！？今日の今日！？うわー、じゃあ私、あなたの神戸の一日目に映り込んでるじゃん！',
                    zh: '今天！？今天的今天！？哇——那我不就出现在你神户的第一天里了吗！',
                    en: 'Today?! Today today?! Whoa — then I am literally in the footage of your first day in Kobe!',
                    color: 'bg-amber-400'
                  },
                  {
                    type: 'narration',
                    zh: '她说她比你早来一周，前六天全都用在了迷路上。她说这话的时候一点都不难过，反而像在炫耀。',
                    en: 'She got here a week ahead of you, she says, and spent six of those days lost. She does not sound sorry about it. She sounds like she is bragging.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '金发的女生',
                    speakerEn: 'Blonde Girl',
                    characterImage: '/images/characters/hikari/casual_shy.webp',
                    jp: '……あのさ。明日から学校でしょ？もし誰とも喋れなかったら、私のこと思い出してよ。ね？',
                    zh: '……那个啊。你明天就要上学了吧？要是一整天没能跟人说上话，就想想我。好吗？',
                    en: '...Hey. School starts tomorrow, right? If you get through a whole day without talking to anyone — think of me. Okay?',
                    color: 'bg-amber-400'
                  }
                ]
              },
              {
                id: 'hikari_tease',
                labelZh: '反问她：你是怎么看出来的',
                labelEn: 'Ask her back: how could she tell?',
                jp: 'どうして分かったんですか。',
                hintZh: '你很想知道自己到底哪里写着「刚下飞机」',
                hintEn: 'You genuinely want to know where it says "fresh off the plane" on you.',
                effects: [
                  { stat: 'charm', amount: 1, reasonZh: '被搭话时不但接住了，还打了回去', reasonEn: 'You did not just catch it — you threw it back' }
                ],
                relations: [
                  { char: CharacterId.HIKARI, familiarity: 14, affection: 3, reasonZh: '第一句话就跟她对上了拍子', reasonEn: 'You matched her rhythm from the very first line' }
                ],
                setFlags: ['prologue_hikari_teased'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/hikari/casual_smug.webp',
                    zh: '她「唔」了一声，退后半步。你被从头到脚看了一遍，包括鞋。看完她举起一只手，掰起了大拇指。',
                    en: 'She goes "hmm" and takes half a step back. You are looked over from head to foot, shoes included. Then she holds up a hand and bends down the thumb.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '金发的女生',
                    speakerEn: 'Blonde Girl',
                    characterImage: '/images/characters/hikari/casual_smug.webp',
                    jp: '一つ、看板を全部読もうとしてる。二つ、歩くの遅い。三つ——さっき、海に向かって深呼吸してたでしょ。私も半年前、まったく同じことしたもん。',
                    words: [
                      { jp: '深呼吸', reading: 'しんこきゅう', zh: '深呼吸', en: 'a deep breath' }
                    ],
                    zh: '第一，你想把每块招牌都读一遍。第二，走得慢。第三——你刚才对着海深呼吸了吧。我半年前，做的一模一样。',
                    en: 'One: you are trying to read every single sign. Two: you walk slowly. Three — you just took a deep breath facing the sea. I did the exact same thing six months ago.',
                    color: 'bg-amber-400'
                  },
                  {
                    type: 'narration',
                    zh: '你被说中了，一句话也接不上。她笑得像是赢了一整场比赛。',
                    en: 'She has you dead to rights and you have nothing to say. She grins like she has won an entire tournament.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '金发的女生',
                    speakerEn: 'Blonde Girl',
                    characterImage: '/images/characters/hikari/casual_happy.webp',
                    jp: 'ね？分かるって。……半年先輩やからね、うち。',
                    zh: '看吧？我就知道。……毕竟我可是早来了半年的前辈呢。',
                    en: 'See? I knew it. ...I have half a year of seniority on you, after all.',
                    color: 'bg-amber-400'
                  }
                ]
              },
              {
                id: 'hikari_nod',
                labelZh: '被气势压住，只是点了点头',
                labelEn: 'Get flattened by the momentum, and just nod',
                hintZh: '脑子里那句日语还在排队',
                hintEn: 'The Japanese sentence is still queued up somewhere behind your eyes.',
                effects: [
                  { stat: 'charm', amount: 1, reasonZh: '笨拙的点头反而把她逗笑了', reasonEn: 'The clumsy nod is what made her laugh' }
                ],
                relations: [
                  { char: CharacterId.HIKARI, familiarity: 6, affection: 1, reasonZh: '在海边被一个陌生人记住了', reasonEn: 'A stranger at the harbour decided to remember you' }
                ],
                setFlags: ['prologue_hikari_nodded'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/hikari/casual_happy.webp',
                    zh: '你只来得及点头。她「哇」地叫了一声，像是猜中了大奖。',
                    en: 'A nod is all you manage. She lets out a "whoa" like she has just won something.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '金发的女生',
                    speakerEn: 'Blonde Girl',
                    characterImage: '/images/characters/hikari/casual_happy.webp',
                    jp: 'やっぱり！ねえ、日本語まだ大変でしょ？いいのいいの、私も最初は「はい」しか言えなかったから！',
                    zh: '果然！哎，日语还很吃力吧？没关系没关系，我刚来的时候也只会说「はい」！',
                    en: 'I knew it! Hey — Japanese is still rough, right? It is fine, it is fine. All I could say at first was "yes" too!',
                    color: 'bg-amber-400'
                  },
                  {
                    type: 'narration',
                    characterImage: '',
                    zh: '她挥了下手就跑了。那件黄卫衣在人群里还能看见两三秒。等看不见了你才想起来，名字没问。',
                    en: 'She waves and goes. The yellow hoodie stays visible in the crowd for another two or three seconds. Once it is not, you remember you did not ask her name.'
                  }
                ]
              }
            ]
          },
          ...HIKARI_PARTING
        ]
      },
      {
        id: 'walk_arcade',
        labelZh: '往三宫的商店街走，钻进人堆里',
        labelEn: 'Head for the Sannomiya shopping arcade and into the crowd',
        hintZh: '想听听这座城市正常说话的样子',
        hintEn: 'You want to hear how this city talks when it is not announcing train stations.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '第一次听懂了关西腔的节奏', reasonEn: 'You caught the rhythm of Kansai speech for the first time' }],
        setFlags: ['prologue_walk_arcade', 'prologue_met_maki'],
        then: [
          { type: 'scene', scene: 'sannomiya_arcade', bgm: 'town' },
          {
            type: 'narration',
            zh: '拱顶商店街里灯火通明，人声、关东煮的热气、章鱼烧铁板的滋滋声混成一片。',
            en: 'The arcade blazes with light. Voices, the steam off an oden counter, the sizzle of a takoyaki griddle — all of it running together.'
          },
          {
            type: 'narration',
            zh: '你听见店主冲着熟客喊「まいど！」，听见两个高中生用你完全跟不上的语速斗嘴，尾音一律往上挑。',
            en: 'A shopkeeper barks "Maido!" at a regular. Two high schoolers bicker at a speed you cannot follow at all, every sentence flicking upward at the end.'
          },
          {
            type: 'narration',
            zh: '教科书里从来没有这种声音。你放慢脚步，跟着人流走了整整一条街。',
            en: 'No textbook has ever made this sound. You slow your pace and let the current carry you the whole length of the street.'
          },
          // ---- 偶遇 · 章鱼烧摊子前的粉色头发 ----
          {
            type: 'narration',
            characterImage: '/images/characters/maki/punk_neutral.webp',
            zh: '走到章鱼烧摊子前，你停下来看铁板上翻滚的丸子。旁边站着一个粉色头发的女生，正把一整串举得老高，边吹边跳脚。',
            en: 'You stop at a takoyaki griddle to watch the balls being turned. Beside you a girl with pink hair is holding a whole skewer up at arm’s length, blowing on it and hopping in place.'
          },
          {
            type: 'speech',
            speakerZh: '粉发的女生',
            speakerEn: 'Pink-haired Girl',
            characterImage: '/images/characters/maki/punk_pout.webp',
            jp: 'あっつ！……あー、もう、なんでウチ毎回学ばへんのやろ。',
            words: [
              { jp: '熱い', reading: 'あつい', zh: '烫、热', en: 'hot (to the touch)' }
            ],
            zh: '烫死了！……啊，真是的，我怎么每次都学不乖啊。',
            en: 'Hot! ...Ugh, seriously, why do I never learn.',
            color: 'bg-pink-500'
          },
          {
            type: 'narration',
            zh: '她注意到你在看，眯起眼睛，从头到脚把你打量了一圈。',
            en: 'She notices you watching, narrows her eyes, and looks you over from head to foot.'
          },
          {
            type: 'speech',
            speakerZh: '粉发的女生',
            speakerEn: 'Pink-haired Girl',
            characterImage: '/images/characters/maki/punk_neutral.webp',
            jp: '……あんた、この辺の人ちゃうやろ。顔に書いてあるで。',
            words: [
              { jp: 'ちゃう', zh: '不是（关西方言，＝違う）', en: '"nope / not that" — Kansai for 違う' }
            ],
            zh: '……你不是这一带的人吧。脸上写着呢。',
            en: '...You are not from around here. It is written on your face.',
            color: 'bg-pink-500'
          },
          {
            type: 'choice',
            promptZh: '被一个看上去比你还小的女生一眼看穿了。',
            promptEn: 'Read at a glance by a girl who looks younger than you.',
            options: [
              {
                id: 'maki_ask',
                labelZh: '承认今天刚来，顺便问她这个东西怎么吃',
                labelEn: 'Admit you only arrived today, then ask how you are meant to eat this',
                jp: 'はい。今日、来ました。……これ、どうやって食べるんですか。',
                hintZh: '铁板上那东西，你是真的不会吃',
                hintEn: 'You genuinely do not know how to eat the thing on that griddle.',
                effects: [
                  { stat: 'guts', amount: 1, reasonZh: '承认了自己是个什么都不懂的外地人', reasonEn: 'You admitted to being the outsider who knows nothing' },
                  { stat: 'kindness', amount: 1, reasonZh: '把请教的姿态摆得很低', reasonEn: 'You asked to be taught, and meant it' }
                ],
                relations: [
                  { char: CharacterId.MAKI, familiarity: 12, affection: 2, reasonZh: '在章鱼烧摊子前拜了个师', reasonEn: 'You took a lesson at a takoyaki stand' }
                ],
                setFlags: ['prologue_maki_asked'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/maki/punk_neutral.webp',
                    zh: '她眉毛一挑，把那串举到你面前晃了晃。',
                    en: 'Her eyebrows go up. She waves the skewer in front of your face.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '粉发的女生',
                    speakerEn: 'Pink-haired Girl',
                    characterImage: '/images/characters/maki/punk_neutral.webp',
                    jp: 'こうやって、フーフーしてから一気に。……先っぽ噛んだら中身が噴き出すから、気ぃつけや。',
                    words: [
                      { jp: '気をつける', reading: 'きをつける', zh: '小心、注意', en: 'to be careful' }
                    ],
                    zh: '像这样，呼呼吹两下，然后一口。……咬尖上的话馅会喷出来，小心点啊。',
                    en: 'Like this — blow on it, then all in one go. ...Bite the tip and the inside erupts, so watch it.',
                    color: 'bg-pink-500'
                  },
                  {
                    type: 'narration',
                    zh: '你照做了。第一口烫得眼泪都出来了。第二口才尝出味道来。外面是脆的，里面还在动。',
                    en: 'You do as told. The first bite brings tears to your eyes. The second one you actually taste. Crisp outside. Still moving inside.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '粉发的女生',
                    speakerEn: 'Pink-haired Girl',
                    characterImage: '/images/characters/maki/punk_laugh.webp',
                    jp: 'な？ ……ま、初日にしては悪ないセンスやん。',
                    zh: '怎么样？……嘛，第一天就这个品味，不算差嘛。',
                    en: 'Right? ...Eh. Not bad taste, for day one.',
                    color: 'bg-pink-500'
                  }
                ]
              },
              {
                id: 'maki_kansai',
                labelZh: '用刚听了一整条街的关西腔回一句',
                labelEn: 'Answer in the Kansai-ben you have been hearing all down the street',
                jp: 'ちゃうで。',
                hintZh: '整条商店街都在教你这个尾音',
                hintEn: 'The whole arcade has been teaching you that ending.',
                requires: { stat: 'guts', min: 1 },
                effects: [
                  { stat: 'charm', amount: 1, reasonZh: '来的第一天就敢学舌关西腔', reasonEn: 'Day one, and already mimicking the local accent' },
                  { stat: 'guts', amount: 1, reasonZh: '拿一句现学的方言去冒险', reasonEn: 'You gambled on a dialect you learned ten minutes ago' }
                ],
                relations: [
                  { char: CharacterId.MAKI, familiarity: 16, affection: 3, reasonZh: '用关西腔顶了回去，她乐坏了', reasonEn: 'You fired Kansai back at her and she loved it' }
                ],
                setFlags: ['prologue_maki_kansai'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/maki/punk_laugh.webp',
                    zh: '她愣了半秒。笑起来的时候手一抖，签子上那颗章鱼烧差点飞出去。',
                    en: 'She freezes for half a second. When she laughs her hand jerks and the takoyaki on the stick nearly goes flying.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '粉发的女生',
                    speakerEn: 'Pink-haired Girl',
                    characterImage: '/images/characters/maki/punk_laugh.webp',
                    jp: '「ちゃうで」やて！発音めっちゃ変やけど！……ええわ、合格。ほな、これも覚えとき——「おおきに」。',
                    words: [
                      { jp: 'おおきに', zh: '谢谢（关西方言）', en: 'thank you (Kansai dialect)' }
                    ],
                    zh: '还「ちゃうで」呢！发音怪得要死！……行吧，及格。那这个也记着——「おおきに」。',
                    en: '"Chau de", he says! Your pronunciation is all over the place! ...Fine. You pass. Here, learn this one too — "ookini".',
                    color: 'bg-pink-500'
                  },
                  {
                    type: 'narration',
                    zh: '「おおきに」。你在心里默念了三遍。今晚一定要找个机会用出去。',
                    en: '"Ookini." You repeat it three times in your head. Tonight you are going to find somewhere to use it.'
                  }
                ]
              },
              {
                id: 'maki_leave',
                labelZh: '笑一笑，转身继续往前走',
                labelEn: 'Smile, and keep walking',
                hintZh: '接不上这个速度',
                hintEn: 'You cannot keep up with that tempo.',
                effects: [
                  { stat: 'proficiency', amount: 1, reasonZh: '把慌乱藏进了一个笑里', reasonEn: 'You buried the panic inside a smile' }
                ],
                relations: [
                  { char: CharacterId.MAKI, familiarity: 4, reasonZh: '在摊子前对上过一次视线', reasonEn: 'Your eyes met once, over a griddle' }
                ],
                setFlags: ['prologue_maki_left'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '',
                    zh: '你笑了一下，转身走进人流里。走出十几米回头，她已经在跟摊主用你完全跟不上的语速讨价还价了。',
                    en: 'You smile and step back into the current. Ten metres on you look back: she is already haggling with the stall owner at a speed you could not follow at all.'
                  },
                  {
                    type: 'narration',
                    zh: '这座城市自己在往前走，不会停下来等你。',
                    en: 'This city is moving on its own, and it is not going to stop and wait for you.'
                  },
                  {
                    type: 'narration',
                    zh: '你以为这个念头会让你难过。结果你只是走快了两步。',
                    en: 'You expect the thought to make you sad. What it actually does is make you walk two paces faster.'
                  }
                ]
              }
            ]
          },
          ...MAKI_PARTING
        ]
      }
    ]
  },

  // ==========================================================
  // 【Scene 6】便利店 · 自由挑选
  // ==========================================================
  {
    type: 'scene',
    scene: 'convenience_store_exterior',
    bgm: 'town',
    titleZh: '坡道口的便利店',
    titleEn: 'The Convenience Store at the Foot of the Slope',
    subtitleZh: '晚上 7:20',
    subtitleEn: '7:20 PM'
  },
  {
    type: 'narration',
    zh: '绕回坡道口的时候，一家便利店的白光从玻璃门里泼到人行道上。你停在门口没进去。',
    en: 'Back at the foot of the slope, the white glare of a convenience store spills across the pavement. You stop at the door instead of going in.'
  },
  {
    type: 'narration',
    zh: '这就是那个便利店。你在屏幕上看过大概两百次的那个便利店。玻璃门、关东煮的锅、货架上那排一模一样的饭团。',
    en: 'So this is the convenience store. The one you have seen on a screen roughly two hundred times. The glass door, the oden pot, the row of identical rice balls on the shelf.'
  },
  {
    type: 'narration',
    zh: '按你看过的那些东西的规矩，推开这扇门，出来的时候应该已经在异世界了。',
    en: 'By the rules of the things you have watched, you push this door open and when you come out you are in another world.'
  },
  {
    type: 'narration',
    zh: '你推了门。自动门「ピンポーン」响了一声。你还在神户。',
    en: 'You push the door. It goes ping-pong. You are still in Kobe.'
  },
  {
    type: 'scene',
    scene: 'convenience_store_interior',
    bgm: 'store',
  },
  {
    type: 'speech',
    speakerZh: '店员小姐',
    speakerEn: 'Store Clerk',
    jp: 'いらっしゃいませ〜！',
    words: [
          { jp: "いらっしゃいませ", zh: "欢迎光临（店员用语）", en: "welcome (shop greeting)" }
    ],
    zh: '欢迎光临～！',
    en: 'Welcome!',
    color: 'bg-teal-500',
    characterImage: '/images/characters/clerk_misaki_welcome.webp'
  },
  {
    type: 'narration',
    zh: '暖光下的货架排得整整齐齐。收银台后的关东煮锅冒着白气，热气在玻璃上糊了一层雾。',
    en: 'Neat rows of shelves under warm light. Behind the register, an oden pot breathes steam that fogs the glass above it.'
  },
  {
    type: 'narration',
    zh: '你摸了摸口袋。硬币加起来一千出头，晚饭得从这里面出。',
    en: 'You check your pocket. The coins come to a bit over a thousand, and dinner has to come out of that.'
  },
  {
    type: 'shop',
    budget: 1000,
    promptZh: '慢慢逛，想拿什么就拿什么。',
    promptEn: 'Take your time. Pick up whatever you like.',
    items: [
      {
        id: 'onigiri_mentaiko',
        price: 140,
        emoji: '🍙',
        imageUrl: '/images/items/onigiri.webp',
        nameJp: 'おにぎり（明太子）',
        nameZh: '明太子饭团',
        nameEn: 'Mentaiko Rice Ball',
        descZh: '最稳妥的选择。海苔单独包着，撕开的时候还是脆的。',
        descEn: 'The safe choice. The nori is wrapped separately and still crisp when you tear it open.',
        setFlags: ['bought_onigiri']
      },
      {
        id: 'oden_set',
        price: 320,
        emoji: '🍢',
        imageUrl: '/images/items/oden.webp',
        nameJp: 'おでん（大根と卵）',
        nameZh: '关东煮（萝卜 + 鸡蛋）',
        nameEn: 'Oden (Daikon & Egg)',
        descZh: '要自己开口跟店员说要哪几样。汤是热的，纸碗烫手。',
        descEn: 'You have to tell the clerk out loud which pieces you want. The broth is hot enough to warm the paper cup through.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '指着锅，把想要的那两样说出了口', reasonEn: 'You pointed at the pot and said out loud which two you wanted' }],
        setFlags: ['bought_oden', 'bought_needs_chopsticks']
      },
      {
        id: 'karaage',
        price: 250,
        emoji: '🍗',
        imageUrl: '/images/items/karaage.webp',
        nameJp: 'からあげ',
        nameZh: '炸鸡块',
        nameEn: 'Fried Chicken',
        descZh: '柜台边现炸的，纸袋捧在手里烫烫的。',
        descEn: 'Fried right there by the counter. The paper bag is hot in your hands.',
        setFlags: ['bought_karaage', 'bought_needs_chopsticks']
      },
      {
        id: 'kobe_beef_croquette',
        price: 220,
        emoji: '🍘',
        imageUrl: '/images/items/croquette.webp',
        nameJp: '神戸牛コロッケ',
        nameZh: '神户牛可乐饼',
        nameEn: 'Kobe Beef Croquette',
        descZh: '炸得金黄酥脆。咬开后土豆泥混着牛肉末与洋葱的甜香，油滋滋的满足感。',
        descEn: 'Crispy and golden. Hot mashed potato sweet with minced beef and onion — pure comfort.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '品尝了神户风味的可乐饼', reasonEn: 'Tasted a local Kobe-style croquette' }],
        setFlags: ['bought_croquette', 'bought_needs_chopsticks']
      },
      {
        id: 'makunouchi_bento',
        price: 680,
        emoji: '🍱',
        imageUrl: '/images/items/bento.webp',
        nameJp: '特選 幕の内弁当',
        nameZh: '特选幕内便当',
        nameEn: 'Makunouchi Bento',
        descZh: '烤鲑鱼、日式玉子烧、炸虾与炖时蔬俱全。比普通便当贵出不少，但今晚能大快朵颐吃顿饱饭。',
        descEn: 'Grilled salmon, tamagoyaki, fried prawn and simmered vegetables. Pricey, but a real hearty dinner.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '犒劳初抵神户的自己一顿丰盛大餐', reasonEn: 'Treated yourself to a feast on day one' }],
        setFlags: ['bought_bento', 'bought_needs_chopsticks']
      },
      {
        id: 'cup_noodle',
        price: 210,
        emoji: '🍜',
        imageUrl: '/images/items/noodle.webp',
        nameJp: 'カップ麺',
        nameZh: '海鲜杯面',
        nameEn: 'Cup Noodles',
        descZh: '留着当明天的备用粮也不错。热水店里就能加。',
        descEn: 'Not a bad emergency ration for tomorrow. They will fill it with hot water right here.',
        setFlags: ['bought_noodle', 'bought_needs_chopsticks']
      },
      {
        id: 'black_coffee_can',
        price: 130,
        emoji: '☕',
        imageUrl: '/images/items/coffee.webp',
        nameJp: '無糖ブラック缶コーヒー',
        nameZh: '无糖黑咖啡',
        nameEn: 'Black Can Coffee',
        descZh: '冰凉铝罐，深烘焙的苦味很正。今晚整理房间、背单词全靠它提神。',
        descEn: 'Chilled aluminum can. Strong, dark roast bitterness. Just what you need to unpack and study tonight.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '准备靠黑咖啡连夜预习', reasonEn: 'Fueled by black coffee for late study' }],
        setFlags: ['bought_coffee']
      },
      {
        id: 'tea_ole',
        price: 160,
        emoji: '🥛',
        imageUrl: '/images/items/tea.webp',
        nameJp: '紅茶オレ',
        nameZh: '红茶欧蕾',
        nameEn: 'Royal Milk Tea',
        descZh: '冰柜里最显眼的那一排。据说这个牌子是关西限定。',
        descEn: 'The most eye-catching row in the cooler. This brand, apparently, is Kansai-only.',
        setFlags: ['bought_tea']
      },
      {
        id: 'kobe_pudding',
        price: 280,
        emoji: '🍮',
        imageUrl: '/images/items/pudding.webp',
        nameJp: '神戸プリン',
        nameZh: '神户布丁',
        nameEn: 'Kobe Pudding',
        descZh: '货架上贴着「神戸土産」的标签。来神户的第一天就吃神户布丁，好像有点土，但你还是伸手了。',
        descEn: 'Shelved under a "Kobe souvenir" tag. Eating Kobe pudding on your first day in Kobe is a little on the nose. You reach for it anyway.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '来神户的第一天，就吃上了神户布丁', reasonEn: 'First day in Kobe, and already eating Kobe pudding' }],
        setFlags: ['bought_pudding']
      },
      {
        id: 'travel_towel_set',
        price: 380,
        emoji: '🧺',
        imageUrl: '/images/items/towel.webp',
        nameJp: '綿100% フェイスタオル',
        nameZh: '纯棉吸水毛巾',
        nameEn: 'Cotton Face Towel Set',
        descZh: '便利店里的生活杂货比百元店贵得多，但今晚洗完澡要是没毛巾可就真傻眼了。救急必备。',
        descEn: 'Convenience store goods are marked up over the 100-yen shop, but stepping out of the shower without a towel is not an option.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '未雨绸缪解决了今晚洗漱问题', reasonEn: 'Thought ahead for tonight’s shower' }],
        setFlags: ['bought_towel']
      },
      {
        id: 'dish_soap',
        price: 190,
        emoji: '🧴',
        imageUrl: '/images/items/soap.webp',
        nameJp: '食器用洗剤',
        nameZh: '洗洁精',
        nameEn: 'Dish Soap',
        descZh: '一点也不浪漫。但今晚要是不买，明天早上你就得用清水刷碗。',
        descEn: 'Not romantic in the slightest. But skip it tonight and you will be scrubbing bowls with cold water in the morning.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '想到了明天早上要刷碗', reasonEn: 'You thought ahead to tomorrow morning’s washing up' }],
        setFlags: ['bought_soap']
      },
      {
        id: 'compact_umbrella',
        price: 780,
        emoji: '☂️',
        imageUrl: '/images/items/umbrella.webp',
        nameJp: '耐風ワンタッチ折りたたみ傘',
        nameZh: '耐风折叠伞',
        nameEn: 'Windproof Folding Umbrella',
        descZh: '六甲山脚下海风大、天气多变。便利店里的伞比超市贵一倍，但带强化伞骨，握在手里安全感拉满。',
        descEn: 'The foot of Mount Rokko gets wild weather. Double supermarket price, but with a sturdy reinforced frame.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '买了应对神户狂风骤雨的耐风伞', reasonEn: 'Prepared for the fierce Kobe wind and rain' }],
        setFlags: ['bought_umbrella']
      },
      {
        id: 'nail_clipper_set',
        price: 540,
        emoji: '✂️',
        imageUrl: '/images/items/clipper.webp',
        nameJp: '匠の技 ステンレス爪切り',
        nameZh: '匠之技不锈钢指甲刀',
        nameEn: 'Craftsman Nail Clipper',
        descZh: '岐阜县关市名刀厂出品，便利店里最贵的日杂之一。虽然贵得肉疼，但新学期修剪整洁仪容加分。',
        descEn: 'Made by famous bladesmiths in Seki. Expensive for a convenience item, but neat grooming matters for school.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '注重个人仪容细节', reasonEn: 'Attentive to grooming details' }],
        setFlags: ['bought_clipper']
      },
      {
        id: 'lip_balm_cream',
        price: 460,
        emoji: '💄',
        imageUrl: '/images/items/lipbalm.webp',
        nameJp: '薬用リップ＆ハンドクリーム',
        nameZh: '药用润唇膏＆护手霜',
        nameEn: 'Lip Balm & Hand Cream',
        descZh: '神户春天的海风吹得皮肤干燥。给嘴唇和双手一点滋润呵护，明天见新同学清爽自然。',
        descEn: 'Spring sea breeze dries skin fast. A little care keeps you looking clean and approachable tomorrow.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '做好了开学见面的仪容护理', reasonEn: 'Fresh and well-groomed for school' }],
        setFlags: ['bought_lipbalm']
      },
      {
        id: 'gel_pen_notebook',
        price: 390,
        emoji: '📝',
        imageUrl: '/images/items/stationery.webp',
        nameJp: 'フリクションペン＆Campusノート',
        nameZh: '可擦中性笔与方格本',
        nameEn: 'Erasable Pen & Grid Note',
        descZh: '百乐可擦笔搭配经典的Campus笔记本，明天开学第一堂课与分班考试随时能用上。',
        descEn: 'A Pilot Frixion erasable pen and a classic Campus grid notebook. Ready for placement tests tomorrow.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '为明天的分班摸底备齐了文具', reasonEn: 'Fully equipped with stationery for school' }],
        setFlags: ['bought_stationery']
      },
      {
        id: 'town_magazine',
        price: 450,
        emoji: '📖',
        imageUrl: '/images/items/magazine.webp',
        nameJp: 'タウン情報誌（神戸特集）',
        nameZh: '本地情报志（神户特辑）',
        nameEn: 'City Guide Magazine (Kobe Special)',
        descZh: '厚厚一本，全是这座城市的店、路线和活动。有点贵，够买三个饭团了。',
        descEn: 'A thick issue, all shops and routes and events across the city. Pricey — three rice balls, that.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '一整本神户，四百五十日元', reasonEn: 'An entire city, for four hundred fifty yen' }],
        setFlags: ['bought_magazine']
      }
    ],
    // 买 / 不买是两条路：空手出去的人不会被问「要筷子吗」
    setFlagsOnPurchase: ['prologue_bought_something'],
    setFlagsOnEmpty: ['prologue_empty_handed']
  },

  // ==========================================================
  // 【Scene 6b】结账 · 第一次真正的日语对话
  // ==========================================================
  {
    // 空手出去的人不该被问「要不要筷子」：整段结账只在真的买了东西时才播。
    type: 'branch',
    ifFlag: 'prologue_bought_something',
    then: [
      {
        type: 'scene',
        scene: 'convenience_store_counter',
        bgm: 'store',
      },
      {
        type: 'narration',
        zh: '你把东西放到收银台上。扫码的声音一声接一声，四下就完了。他抬起头问了一句。',
        en: 'You set everything on the counter. The scanner beeps four times, close together, and it is done. He looks up and asks:'
      },
      {
        type: 'speech',
        speakerZh: '店员小姐',
        speakerEn: 'Store Clerk',
        jp: 'レジ袋はご利用ですか？',
        words: [
              { jp: "レジ袋", reading: "レジぶくろ", zh: "收银塑料袋", en: "plastic shopping bag" }
        ],
        zh: '需要塑料袋吗？',
        en: 'Would you like a bag?',
        color: 'bg-teal-500',
        characterImage: '/images/characters/clerk_misaki_think.webp'
      },
      {
        // 只有买了要趁热吃的东西，才会被问筷子。
        // 拎着一包毛巾和洗洁精被问"要筷子吗"，那是穿帮。
        type: 'branch',
        ifFlag: 'bought_needs_chopsticks',
        then: [
          {
            type: 'speech',
            speakerZh: '店员小姐',
            speakerEn: 'Store Clerk',
            jp: 'お箸はおつけしますか？',
            words: [
              { jp: "お箸", reading: "おはし", zh: "筷子", en: "chopsticks" }
            ],
            zh: '要给您配一双筷子吗？',
            en: 'And shall I add a pair of chopsticks?',
            color: 'bg-teal-500'
          }
        ]
      },
      {
        // 去过商店街、被真纪教过「おおきに」的人，这里会想起她
        type: 'branch',
        ifFlag: 'prologue_maki_kansai',
        then: [
          {
            type: 'narration',
            zh: '「おおきに」。商店街那个粉色头发的女生的声音忽然在脑子里响了一下。……现在？就现在用？',
            en: '"Ookini." The pink-haired girl from the arcade suddenly plays back in your head. ...Now? Right now?'
          }
        ]
      },
      {
        type: 'choice',
        promptZh: '两句话，语速比听力教材快得多。',
        promptEn: 'Two sentences, spoken far faster than any listening exercise.',
        options: [
          {
            id: 'checkout_kansai',
            labelZh: '要个袋子，然后学着说一句关西的谢谢',
            labelEn: 'Ask for a bag, then try the Kansai way of saying thanks',
            jp: '袋、お願いします。……おおきに！',
            words: [{ jp: 'おおきに', reading: 'おおきに', zh: '谢谢（关西）', en: 'thanks, in Kansai' }],
            hintZh: '关西人道谢时说的那一句',
            hintEn: 'The way people say thank you around here.',
            // 只有被真纪教过「おおきに」的人才看得到这一句。
            // 之前是拿 guts>=2 当门槛，结果没去过商店街的人也能选——
            // 等于凭空说出一个游戏从没教过的词。勇气在真纪那一幕已经考过了。
            requiresFlag: 'prologue_maki_kansai',
            effects: [
              { stat: 'charm', amount: 1, reasonZh: '来的第一天就用上了关西腔', reasonEn: 'Day one, and already speaking Kansai' },
              { stat: 'guts', amount: 1, reasonZh: '敢把刚学会的话立刻用出去', reasonEn: 'You used a phrase the same hour you learned it' }
            ],
            setFlags: ['prologue_checkout_kansai', 'prologue_checkout_jp'],
            then: [
              {
                type: 'narration',
                zh: '装袋的手停在半空。他先是没出声，一秒之后才笑出来。',
                en: 'His hands stop halfway into the bag. Nothing for a second, and then he laughs.'
              },
              {
                type: 'speech',
                speakerZh: '店员小姐',
                speakerEn: 'Store Clerk',
                jp: 'えっ、おおきに！？お兄さん、関西の人ちゃうやろ？うまいなあ！',
                words: [
                      { jp: "おおきに", zh: "谢谢（关西方言）", en: "thank you (Kansai dialect)" },
                      { jp: "うまい", zh: "说得好、地道", en: "skilful / well done" }
                ],
                zh: '诶，「おおきに」！？小哥你不是关西人吧？说得真地道啊！',
                en: 'Wait — "ookini"?! You’re not from Kansai, are you? That was good!',
                color: 'bg-teal-500',
                characterImage: '/images/characters/clerk_misaki_laugh.webp'
              },
              {
                type: 'narration',
                zh: '你有点不好意思地挠了挠头。走出店门的时候，脚步比进来时轻了一大截。',
                en: 'You scratch the back of your head, a little embarrassed. Walking out, your step is considerably lighter than it was walking in.'
              }
            ]
          },
          {
            id: 'checkout_jp',
            labelZh: '规规矩矩地说要个袋子',
            labelEn: 'Ask for a bag, by the book',
            jp: 'あ、はい。袋をお願いします。',
            hintZh: '一个字一个字地说完，说得很慢',
            hintEn: 'Word by word, slowly, all the way to the end.',
            effects: [
              { stat: 'guts', amount: 1, reasonZh: '把整句话说完了，没有中途放弃', reasonEn: 'You finished the whole sentence without bailing out' }
            ],
            setFlags: ['prologue_checkout_jp'],
            then: [
              {
                type: 'narration',
                characterImage: '/images/characters/clerk_misaki_bag.webp',
                zh: '你说得很慢，但一个音都没有含糊。店员点点头，手上装袋的动作一如往常。',
                en: 'You speak slowly, but you do not slur a single syllable. The clerk nods and bags it all, entirely unremarkable about it.'
              },
              {
                type: 'narration',
                zh: '她没有放慢语速，没有换词，也没有多看你一眼。你拎着袋子走出去，发现自己在笑。',
                en: 'She did not slow down, did not change her words, did not give you an extra look. You are outside with the bag before you notice you are smiling.'
              }
            ]
          },
          {
            id: 'checkout_gesture',
            labelZh: '点头，然后用手比划了一下',
            labelEn: 'Nod, and gesture with your hands',
            hintZh: '脑子里的句子还没组装好，队伍已经排起来了',
            hintEn: 'The sentence has not finished assembling in your head, and a queue is forming.',
            setFlags: ['prologue_checkout_gesture'],
            then: [
              {
                type: 'narration',
                characterImage: '/images/characters/clerk_misaki_bag.webp',
                zh: '你点了点头，又比了个「一」。店员立刻会意，动作麻利地装好袋，还多塞了一张湿纸巾。',
                en: 'You nod, then hold up one finger. The clerk gets it instantly, bags everything efficiently, and slips in an extra wet wipe.'
              },
              {
                type: 'narration',
                zh: '她一句多余的话都没说，找零、鞠躬、下一位。走出自动门以后你在原地站了两秒。那句话你会说的。',
                en: 'She says nothing extra. Change, bow, next customer. You stand still for two seconds on the other side of the automatic door. You knew that sentence.'
              }
            ]
          }
        ]
      },
    ]
  },
  {
    // 什么都没买的那条路。给的不是东西，是另一段只有这样选才看得到的独白。
    type: 'branch',
    ifFlag: 'prologue_empty_handed',
    then: [
      {
        type: 'narration',
        zh: '你在货架之间来回走了两趟，最后什么也没拿。钱包里的每一张纸币，接下来都得算着花。',
        en: 'You walk the aisles twice and end up picking up nothing at all. Every note in your wallet has to be counted from here on.'
      },
      {
        type: 'narration',
        zh: '经过收银台的时候店员抬了下头，朝你点了点，然后就低回去继续理烟盒了。',
        en: 'The clerk glances up as you pass the register, gives you a nod, and goes back to squaring up the cigarette packs.'
      },
      {
        type: 'narration',
        zh: '你也点头回了一下。这是今晚你和这座城市之间，唯一一次不需要说话的交流。',
        en: 'You nod back. It is the one exchange between you and this city tonight that needed no words at all.'
      }
    ]
  },

  {
    // 买了要趁热吃的东西才会拿到筷子
    type: 'branch',
    ifFlag: 'bought_needs_chopsticks',
    then: [
      {
        type: 'narration',
        zh: '她往袋子里放了一双筷子，又多塞了一张湿纸巾。',
        en: 'She slips a pair of chopsticks into the bag, and a wet wipe after them.'
      }
    ]
  },

  // ==========================================================
  // 【Scene 7】偶遇 · 杂志架前的银发
  // ==========================================================
  // 手里到底有没有袋子，取决于上一场买没买
  {
    type: 'branch',
    ifFlag: 'prologue_bought_something',
    then: [
      {
        type: 'narration',
        characterImage: '',   // 店员退场
        zh: '提着袋子转身要走的时候，你注意到杂志架前站着一个人。',
        en: 'Turning to leave with your bag, you notice someone standing at the magazine rack.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_empty_handed',
    then: [
      {
        type: 'narration',
        characterImage: '',   // 店员退场
        zh: '空着手往门口走的时候，你注意到杂志架前站着一个人。',
        en: 'Walking empty-handed toward the door, you notice someone standing at the magazine rack.'
      }
    ]
  },
  {
    type: 'narration',
    characterImage: '/images/characters/miyuki/thinking.webp',
    zh: '是个年轻女子。一头银白色的长发在便利店的白光下几乎是发亮的，手里拎着一个装了牛奶和鸡蛋的小袋子，正低头翻着一本料理杂志。',
    en: 'A young woman. Her long silver-white hair almost glows under the store’s fluorescent light. A small bag of milk and eggs hangs from one hand while she leafs through a cooking magazine.'
  },
  {
    type: 'narration',
    zh: '她抬头，你们对上了视线。两个人都没动，半秒之后才各自把眼睛移开。',
    en: 'She looks up and your eyes meet. Neither of you moves. Half a second later you both look away.'
  },
  {
    type: 'narration',
    zh: '因为她手里的另一样东西，是一串「海风庄」的钥匙。和你口袋里的那串，一模一样。',
    en: 'Because the other thing in her hand is a key ring — Umikaze-so. Identical to the one in your pocket.'
  },
  {
    type: 'choice',
    promptZh: '她也认出了那串钥匙。',
    promptEn: 'She recognizes the keys too.',
    options: [
      {
        id: 'greet_speak',
        labelZh: '主动开口叫住她',
        labelEn: 'Speak first and stop her',
        jp: 'あの、すみません——',
        hintZh: '同一栋楼的邻居。今天不打招呼，明天更难开口',
        hintEn: 'Same building. If not now, it only gets harder tomorrow.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '主动向陌生人迈出了第一步', reasonEn: 'You took the first step toward a stranger' },
          { stat: 'charm', amount: 1, reasonZh: '第一印象留得干净利落', reasonEn: 'You made a clean first impression' }
        ],
        // 序章唯一一次能真正攒下关系的地方：主动开口 = 邻里关系从"面熟"起步
        relations: [
          { char: CharacterId.MIYUKI, familiarity: 32, reasonZh: '和 202 室的邻居说上了话', reasonEn: 'You actually spoke with your neighbour in 202' }
        ],
        setFlags: ['prologue_greeted_miyuki'],
        then: [
          {
            type: 'speech',
            speakerZh: '你',
            speakerEn: 'You',
            jp: 'あの、すみません。もしかして、海風荘の方ですか？今日から二〇一号室に住むことになりまして……',
            words: [
                  { jp: "ことになる", zh: "（事情）决定为……、变成……（N3 语法）", en: "it has been decided that... (N3 grammar)" },
                  { jp: "もしかして", zh: "难道说、莫非", en: "by any chance / could it be" }
            ],
            zh: '那个，不好意思。请问……您也住在海风庄吗？我今天刚搬进 201 室……',
            en: 'Um, excuse me. Are you — by any chance — also at Umikaze-so? I moved into Room 201 today...',
            color: 'bg-yellow-500'
          },
          {
            type: 'narration',
            zh: '她眨了眨眼，随即弯起眼睛笑了。那笑容温柔得让人一下子放松下来。',
            en: 'She blinks, then her eyes curve into a smile — gentle enough that your shoulders come down at once.'
          },
          {
            type: 'speech',
            characterImage: '/images/characters/miyuki/happy.webp',
            speakerZh: '银发的女子',
            speakerEn: 'Silver-haired Woman',
            jp: 'あら。じゃあ、お隣さんね。二〇二号室です。……ふふ、そんなに緊張しなくても大丈夫よ。',
            words: [
                  { jp: "お隣さん", reading: "おとなりさん", zh: "邻居", en: "neighbour" },
                  { jp: "緊張する", reading: "きんちょうする", zh: "紧张", en: "to be nervous" }
            ],
            zh: '哎呀。那我们是邻居呢，我住 202 室。……呵呵，不用这么紧张的。',
            en: 'Oh my. Then we are neighbors — Room 202. ...Hmhm, there’s no need to be so tense.',
            color: 'bg-sky-500'
          },
          {
            type: 'branch',
            ifFlag: 'bought_pudding',
            then: [
              {
                type: 'narration',
                zh: '她的视线落到你袋子里那盒神户布丁上，忍住了笑。',
                en: 'Her gaze drops to the Kobe pudding in your bag, and she suppresses a laugh.'
              },
              {
                type: 'speech',
                characterImage: '/images/characters/miyuki/happy_alt.webp',
                speakerZh: '银发的女子',
                speakerEn: 'Silver-haired Woman',
                jp: '初日から神戸プリン？……ふふ、いい趣味してるわ。',
                zh: '第一天就吃神户布丁？……呵呵，品味不错嘛。',
                en: 'Kobe pudding on your very first day? ...Hmhm. Good taste.',
                color: 'bg-sky-500'
              }
            ]
          },
          {
            type: 'scene',
            scene: 'kitano_slope',
            bgm: 'night'
          },
          {
            type: 'narration',
            characterImage: '/images/characters/miyuki/neutral.webp',
            zh: '你们并肩走出便利店，一起沿着坡道往上走。她的步子放得很慢，刚好是你能跟得上的速度。',
            en: 'You walk out of the store side by side and start up the slope together. She keeps her pace slow — exactly slow enough for you to stay beside her.'
          },
          {
            type: 'speech',
            characterImage: '/images/characters/miyuki/neutral.webp',
            speakerZh: '银发的女子',
            speakerEn: 'Silver-haired Woman',
            jp: 'この坂、慣れるまでは大変よ。……何か困ったことがあったら、いつでも隣をノックしてね。',
            words: [
                  { jp: "慣れる", reading: "なれる", zh: "习惯、适应", en: "to get used to" },
                  { jp: "困る", reading: "こまる", zh: "为难、伤脑筋", en: "to be troubled / at a loss" }
            ],
            zh: '这条坡道，习惯之前挺累人的。……有什么困难的话，随时敲隔壁的门就好。',
            en: 'This hill is hard on you until you get used to it. ...If anything troubles you, knock next door. Any time.',
            color: 'bg-sky-500'
          },

          // ---- 坡道上的一段路：序章里唯一能真正相处一会儿的人 ----
          {
            type: 'choice',
            promptZh: '坡道还有一半。她的袋子看上去不轻。',
            promptEn: 'Half the hill still to climb. That bag of hers does not look light.',
            options: [
              {
                id: 'miyuki_carry',
                labelZh: '问她要不要帮忙拿一个袋子',
                labelEn: 'Offer to carry one of the bags',
                jp: 'あの、袋、一つ持ちましょうか。',
                hintZh: '牛奶和鸡蛋，一路上坡',
                hintEn: 'Milk and eggs. All of it uphill.',
                effects: [
                  { stat: 'guts', amount: 1, reasonZh: '第二次主动开口，比第一次容易了一点', reasonEn: 'The second time speaking up came easier than the first' },
                  { stat: 'kindness', amount: 1, reasonZh: '看见了别人手里的重量', reasonEn: 'You noticed the weight in someone else’s hand' }
                ],
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 6, affection: 4, reasonZh: '在坡道上替她拎了半程', reasonEn: 'You carried half her load up the hill' }
                ],
                setFlags: ['prologue_miyuki_carried'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/thinking.webp',
                    zh: '她愣了一下，像是没想到会被这么问。',
                    en: 'She pauses, as if the question had genuinely not occurred to her.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '银发的女子',
                    speakerEn: 'Silver-haired Woman',
                    characterImage: '/images/characters/miyuki/happy.webp',
                    jp: 'あら……いいの？じゃあ、こっちだけ。卵のほう、割らないでね。',
                    words: [
                      { jp: '割る', reading: 'わる', zh: '打破、弄碎', en: 'to break / to crack' }
                    ],
                    zh: '哎呀……可以吗？那，就这个吧。装鸡蛋那袋，别弄破了哦。',
                    en: 'Oh my... are you sure? Then — just this one. It has the eggs. Try not to break them.',
                    color: 'bg-sky-500'
                  },
                  {
                    type: 'narration',
                    zh: '袋子比你想的沉。你换了只手，尽量让脚步看起来还很轻松。',
                    en: 'The bag is heavier than you expected. You switch hands and do your best to keep your stride looking easy.'
                  },
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/happy_alt.webp',
                    zh: '她在旁边看了你两眼，没有拆穿，只是把步子又放慢了一点。',
                    en: 'She glances at you twice, says nothing about it, and simply slows her pace a little further.'
                  }
                ]
              },
              {
                id: 'miyuki_groceries',
                labelZh: '问她这一带哪里买东西便宜',
                labelEn: 'Ask her where the cheap places to shop are around here',
                jp: 'この辺、どこで買うと安いですか。',
                words: [{ jp: '安い', reading: 'やすい', zh: '便宜', en: 'cheap' }],
                hintZh: '你的冰箱现在还是空的',
                hintEn: 'Your fridge is still completely empty.',
                effects: [
                  { stat: 'knowledge', amount: 1, reasonZh: '把这一带的生活地图问到手了', reasonEn: 'You got the neighborhood’s survival map straight from a local' }
                ],
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 5, affection: 2, reasonZh: '问了一个只有邻居会问的问题', reasonEn: 'You asked the kind of question only a neighbour asks' }
                ],
                setFlags: ['prologue_miyuki_groceries'],
                then: [
                  {
                    type: 'speech',
                    speakerZh: '你',
                    speakerEn: 'You',
                    jp: 'あの、この辺で、安いスーパーとかありますか？',
                    words: [
                      { jp: '安い', reading: 'やすい', zh: '便宜', en: 'cheap / inexpensive' }
                    ],
                    zh: '那个，这附近有便宜一点的超市吗？',
                    en: 'Um — is there a cheaper supermarket around here?',
                    color: 'bg-yellow-500'
                  },
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/happy.webp',
                    zh: '她「啊」了一声，忽然认真起来，像是被问到了最擅长的科目。',
                    en: 'She makes a small "ah", and abruptly turns serious — as if asked about her best subject.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '银发的女子',
                    speakerEn: 'Silver-haired Woman',
                    characterImage: '/images/characters/miyuki/happy.webp',
                    jp: '坂を下りて右に三分。あそこ、夜八時からお惣菜が半額になるの。……あと、火曜日は卵が特売。',
                    words: [
                      { jp: '半額', reading: 'はんがく', zh: '半价', en: 'half price' },
                      { jp: '特売', reading: 'とくばい', zh: '特价、促销', en: 'special sale' }
                    ],
                    zh: '下了坡往右走三分钟。那家店晚上八点之后熟食半价哦。……还有，周二鸡蛋特价。',
                    en: 'Down the hill and right, three minutes. Their prepared food goes half price after eight. ...Also, Tuesdays are egg day.',
                    color: 'bg-sky-500'
                  },
                  {
                    type: 'narration',
                    zh: '你掏出手机想记下来，她已经说到了第四家店。你放弃了，改成用力点头。',
                    en: 'You pull out your phone to write it down. She is already on the fourth shop. You give up and settle for nodding hard.'
                  }
                ]
              },
              {
                id: 'miyuki_silent',
                labelZh: '什么也不说，只是配合她的步子往上走',
                labelEn: 'Say nothing, and simply match her pace up the hill',
                hintZh: '今天已经说了够多的日语了',
                hintEn: 'You have spoken enough Japanese for one day.',
                effects: [
                  { stat: 'charm', amount: 1, reasonZh: '学会了不用说话也不尴尬', reasonEn: 'You learned that silence does not have to be awkward' }
                ],
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 3, affection: 1, reasonZh: '和她一起安静地走完了这段坡', reasonEn: 'You walked the rest of the hill beside her in silence' }
                ],
                setFlags: ['prologue_miyuki_silent'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/neutral.webp',
                    zh: '你们一句话都没再说。坡道两边的窗子一扇一扇亮起来，里面有电视声、炒菜声、小孩子的叫声。',
                    en: 'Neither of you says anything more. The windows along the slope light up one by one — a television, a wok, a child shouting.'
                  },
                  {
                    type: 'narration',
                    zh: '你忽然意识到，这些声音从明天起也会是你的日常。',
                    en: 'It occurs to you that from tomorrow, those sounds will be your ordinary life too.'
                  }
                ]
              }
            ]
          },

          // ---- 海风庄门口 ----
          {
            type: 'scene',
            scene: 'umikaze_exterior',
            bgm: 'night'
          },
          {
            type: 'narration',
            characterImage: '/images/characters/miyuki/neutral.webp',
            zh: '坡道尽头，海风庄的门灯亮着一盏昏黄的灯。她在 202 室门口停下来，一边找钥匙一边朝你偏了偏头。',
            en: 'At the top of the slope a single amber lamp burns over the Umikaze-so entrance. She stops at the door of 202, feeling for her keys, and tilts her head toward you.'
          },
          {
            type: 'choice',
            promptZh: '道晚安之前——',
            promptEn: 'Before you say good night—',
            options: [
              {
                id: 'miyuki_name',
                labelZh: '鼓起勇气问她怎么称呼',
                labelEn: 'Work up to asking what she is called',
                jp: 'あの……お名前、聞いてもいいですか。',
                hintZh: '明天早上在楼梯上再遇见，总不能一直叫「那个」',
                hintEn: 'You will meet on the stairs tomorrow. You cannot keep calling her "um".',
                effects: [
                  { stat: 'guts', amount: 1, reasonZh: '把今天最难开口的一句问了出来', reasonEn: 'You asked the hardest question of the day' }
                ],
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 6, affection: 5, reasonZh: '问了她的名字，并且记住了', reasonEn: 'You asked her name — and kept it' }
                ],
                setFlags: ['prologue_miyuki_named', 'prologue_knows_miyuki_name'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/thinking.webp',
                    zh: '她摸钥匙的手停住了，回过头看了你一会儿。门灯的光落在她的银发上，边缘是暖色的。',
                    en: 'Her hand stops on the keys. She turns back and looks at you for a moment. The lamp catches her silver hair and warms its edges.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '银发的女子',
                    speakerEn: 'Silver-haired Woman',
                    characterImage: '/images/characters/miyuki/happy.webp',
                    jp: '……深雪。二〇二号室の、深雪です。',
                    zh: '……深雪。202 室的，深雪。',
                    en: '...Miyuki. Miyuki, of Room 202.',
                    color: 'bg-sky-500'
                  },
                  {
                    type: 'narration',
                    zh: '「みゆき」。你在心里把这三个音重复了一遍，生怕明天早上就忘了。',
                    en: '"Mi-yu-ki." You repeat the three syllables inside your head, afraid of losing them before morning.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '深雪',
                    speakerEn: 'Miyuki',
                    characterImage: '/images/characters/miyuki/happy_alt.webp',
                    jp: 'ふふ。ちゃんと覚えてくれた？……じゃあ、また明日。おやすみなさい。',
                    words: [
                      { jp: '覚える', reading: 'おぼえる', zh: '记住', en: 'to remember / to memorize' }
                    ],
                    zh: '呵呵。记住了吗？……那么，明天见。晚安。',
                    en: 'Hmhm. Did you get it? ...See you tomorrow, then. Good night.',
                    color: 'bg-sky-500'
                  }
                ]
              },
              {
                id: 'miyuki_thanks',
                labelZh: '端端正正地鞠一躬，郑重道谢',
                labelEn: 'Bow properly, and thank her in earnest',
                hintZh: '今天她做的事，比「顺路」多得多',
                hintEn: 'What she did tonight was a good deal more than "on the way".',
                effects: [
                  { stat: 'charm', amount: 1, reasonZh: '把谢意说得干净利落', reasonEn: 'You said thank you cleanly and meant it' },
                  { stat: 'kindness', amount: 1, reasonZh: '记得别人为你多走的那几步', reasonEn: 'You counted the extra steps someone took for you' }
                ],
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 4, affection: 3, reasonZh: '认真道了谢，她记住了', reasonEn: 'You thanked her properly, and she noticed' }
                ],
                setFlags: ['prologue_miyuki_thanked'],
                then: [
                  {
                    type: 'speech',
                    speakerZh: '你',
                    speakerEn: 'You',
                    jp: '今日は、本当にありがとうございました。',
                    zh: '今天真的非常感谢您。',
                    en: 'Thank you. Really — for today.',
                    color: 'bg-yellow-500'
                  },
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/thinking.webp',
                    zh: '她似乎没料到会被这么正式地道谢，愣了半秒才摆了摆手。',
                    en: 'She did not expect to be thanked that formally. It takes her half a second to wave it off.'
                  },
                  {
                    type: 'speech',
                    speakerZh: '银发的女子',
                    speakerEn: 'Silver-haired Woman',
                    characterImage: '/images/characters/miyuki/happy.webp',
                    jp: 'そんな、たいしたことしてないのに。……でも、ありがとう。ちゃんと言える子で、安心したわ。',
                    words: [
                      { jp: '安心する', reading: 'あんしんする', zh: '放心、安心', en: 'to feel relieved / at ease' }
                    ],
                    zh: '哎呀，我又没做什么。……不过，谢谢你。是个会好好道谢的孩子，我就放心了。',
                    en: 'Goodness, I hardly did anything. ...But thank you. It is a relief — you are the sort who says it properly.',
                    color: 'bg-sky-500'
                  },
                  {
                    type: 'narration',
                    zh: '「安心了」这三个字，她说得很轻，轻得像是说给自己听的。',
                    en: '"A relief." She says it quietly — quietly enough that it might have been meant for herself.'
                  }
                ]
              },
              {
                id: 'miyuki_wave',
                labelZh: '举手挥了挥，转身上楼',
                labelEn: 'Raise a hand, wave, and head up the stairs',
                hintZh: '今天的日语额度已经用完了',
                hintEn: 'Your Japanese quota for today is spent.',
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 2, reasonZh: '至少道了别', reasonEn: 'At least you said goodbye' }
                ],
                setFlags: ['prologue_miyuki_wave'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '',
                    zh: '你举起手挥了挥，转身上了铁楼梯。每一级都响得很清脆。',
                    en: 'You raise a hand, wave, and start up the iron stairs. Every step rings out crisply.'
                  },
                  {
                    type: 'narration',
                    zh: '走到 201 室门口时，你听见楼下 202 的门开了，又轻轻关上。',
                    en: 'At the door of 201 you hear the door of 202 open below you, and close again softly.'
                  },
                  {
                    type: 'narration',
                    zh: '隔着一堵墙，那是今晚最后一点人声。你站在门口听了三秒，才把钥匙插进锁孔。',
                    en: 'Through one wall, that is the last human sound of the night. You stand and listen for three seconds before putting your key in the lock.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'greet_nod',
        labelZh: '微微鞠躬，规规矩矩地点头致意',
        labelEn: 'Bow slightly and give a proper, polite nod',
        hintZh: '话说不出口，礼数总要到',
        hintEn: 'The words will not come, but courtesy still can.',
        effects: [
          { stat: 'kindness', amount: 1, reasonZh: '礼数到了，分寸也到了', reasonEn: 'Courtesy given, and distance respected' }
        ],
        relations: [
          { char: CharacterId.MIYUKI, familiarity: 16, reasonZh: '和 202 室的邻居互相认了个脸', reasonEn: 'You and your neighbour in 202 now know each other by sight' }
        ],
        setFlags: ['prologue_nodded_miyuki'],
        then: [
          {
            type: 'narration',
            zh: '你朝她的方向微微低了低头。她也回了一个礼，姿态优雅得像是练过。',
            en: 'You incline your head toward her. She returns the bow, with a poise that looks practiced.'
          },
          {
            type: 'speech',
            characterImage: '/images/characters/miyuki/neutral.webp',
            speakerZh: '银发的女子',
            speakerEn: 'Silver-haired Woman',
            jp: '……こんばんは。',
            zh: '……晚上好。',
            en: '...Good evening.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            characterImage: '',
            zh: '短短三个字，却让整个便利店的白光都柔和了一点。你们前后脚走出店门，一路上没再说话。',
            en: 'Three quiet syllables, and somehow the harsh store light softens. You leave one after the other, and neither of you says anything more on the way up.'
          },
          {
            type: 'scene',
            scene: 'umikaze_exterior',
            bgm: 'night'
          },
          {
            type: 'narration',
            characterImage: '/images/characters/miyuki/neutral.webp',
            zh: '但在她推开 202 室的门之前，她回过头，又对你笑了一下。',
            en: 'But before she pushes open the door of Room 202, she turns back and smiles at you once more.'
          },
          {
            type: 'choice',
            promptZh: '她的门还没关上。',
            promptEn: 'Her door has not closed yet.',
            options: [
              {
                id: 'miyuki_wave_back',
                labelZh: '举起手，无声地挥了一下',
                labelEn: 'Raise a hand and wave, without a word',
                hintZh: '说不出话，手还是能动的',
                hintEn: 'The words will not come. Your hand still works.',
                effects: [
                  { stat: 'charm', amount: 1, reasonZh: '把说不出口的话用手挥了出去', reasonEn: 'You waved the sentence you could not say' }
                ],
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 4, affection: 2, reasonZh: '在她关门前回了一次礼', reasonEn: 'You answered her before the door closed' }
                ],
                setFlags: ['prologue_miyuki_wave_back'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/happy.webp',
                    zh: '她看见了。眼睛弯了一下，人才进门。关门的声音轻得像是特意的。',
                    en: 'She sees it. Her eyes curve first, and then she goes in. The door shuts so quietly it seems deliberate.'
                  },
                  {
                    type: 'narration',
                    characterImage: '',
                    zh: '你在楼梯上站了一会儿。今晚一句完整的话都没说出口，但好像也不算全输。',
                    en: 'You stand on the stairs a moment. Not one complete sentence tonight — and yet it does not feel like a total loss.'
                  }
                ]
              },
              {
                id: 'miyuki_bow_back',
                labelZh: '也回她一个更深的鞠躬',
                labelEn: 'Return the bow — deeper than hers',
                hintZh: '不会说，就把礼数做到底',
                hintEn: 'If you cannot speak, at least do the courtesy all the way.',
                effects: [
                  { stat: 'kindness', amount: 1, reasonZh: '把礼数做到了最后一秒', reasonEn: 'You held the courtesy to the last second' }
                ],
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 3, affection: 1, reasonZh: '一躬到底，她在门口多站了两秒', reasonEn: 'A deep bow — and she stayed in the doorway two seconds longer' }
                ],
                setFlags: ['prologue_miyuki_bow_back'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '/images/characters/miyuki/happy_alt.webp',
                    zh: '你弯下腰，角度深得有点过分。抬头时她还站在门口，像是被逗到了，忍着笑对你摆了摆手。',
                    en: 'You bend at the waist — rather deeper than necessary. When you straighten up she is still in the doorway, visibly holding back a laugh, waving you off.'
                  },
                  {
                    type: 'narration',
                    characterImage: '',
                    zh: '上楼的时候你才反应过来：那大概是「不用这么客气」的意思。',
                    en: 'Only on the stairs does it land: that was probably her way of saying you did not need to be so formal.'
                  }
                ]
              },
              {
                id: 'miyuki_missed',
                labelZh: '已经上到二楼了——来不及了',
                labelEn: 'You are already on the second floor. Too late.',
                hintZh: '等你想回头的时候，门已经关上了',
                hintEn: 'By the time you think to turn around, the door has shut.',
                relations: [
                  { char: CharacterId.MIYUKI, familiarity: 1, reasonZh: '至少你们对上过一次视线', reasonEn: 'At least your eyes met once tonight' }
                ],
                setFlags: ['prologue_miyuki_missed'],
                then: [
                  {
                    type: 'narration',
                    characterImage: '',
                    zh: '等你反应过来该回一个什么的时候，楼下的门已经「咔哒」一声关上了。',
                    en: 'By the time you work out that you should have answered with something, the door below has clicked shut.'
                  },
                  {
                    type: 'narration',
                    zh: '你站在 201 室门口，对着空荡荡的楼梯，把那句迟到的「こんばんは」小声说了一遍。',
                    en: 'You stand at the door of 201, facing an empty stairwell, and say the belated "good evening" under your breath anyway.'
                  },
                  {
                    type: 'narration',
                    zh: '没有人听见。但你决定，明天早上要早一点出门。',
                    en: 'Nobody hears it. But you decide to leave a little earlier tomorrow morning.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'greet_avoid',
        labelZh: '移开视线，假装在挑饮料',
        labelEn: 'Look away and pretend to be choosing a drink',
        hintZh: '今天已经够累了',
        hintEn: 'It has already been a long day.',
        setFlags: ['prologue_avoided_miyuki'],
        then: [
          {
            type: 'narration',
            characterImage: '',
            zh: '你把视线转向旁边的冰柜，假装在认真研究一排你根本不打算买的饮料。',
            en: 'You turn toward the cooler and pretend to study, very seriously, a row of drinks you have no intention of buying.'
          },
          {
            type: 'narration',
            zh: '余光里她在看你。看了有一会儿。杂志合上的时候纸页扑了一声，她朝收银台去了。',
            en: 'She is looking at you, in the corner of your vision. For a while. The magazine gives a small flap as it shuts, and she heads for the register.'
          },
          {
            type: 'scene',
            scene: 'kitano_slope',
            bgm: 'night'
          },
          {
            type: 'narration',
            zh: '走出便利店时，坡道上已经没有她的影子了。你一个人往上爬，风比刚才凉。',
            en: 'By the time you step outside, there is no sign of her on the slope. You climb alone. The wind is colder than it was.'
          },
          {
            type: 'scene',
            scene: 'umikaze_exterior',
            bgm: 'night'
          },
          {
            type: 'narration',
            zh: '202 室的门缝底下透出一道黄光，里面有电视的声音。你在那儿站了两秒。然后你掏出了自己那把钥匙。',
            en: 'A strip of yellow light under the door of 202, and a television going behind it. You stand there for two seconds. Then you get out your own key.'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // 【Scene 8】夜 · 开学前夜的蓄力
  // ==========================================================
  {
    type: 'scene',
    scene: 'apartment_room',
    bgm: 'night',
    titleZh: '海风庄 201 室 · 夜',
    titleEn: 'Umikaze-so, Room 201 · Night',
    subtitleZh: '晚上 8:40 · 窗外是千万级的夜景',
    subtitleEn: '8:40 PM · Ten million lights outside the window'
  },
  {
    type: 'narration',
    zh: '你把明天要穿的制服熨了两遍。校徽别在领口，别歪了一次，拆下来重别。兵库县立港见高等学校，高二 B 班。',
    en: 'You iron tomorrow’s uniform twice. The crest goes on the collar, crooked the first time, so you unpin it and do it again. Hyogo Prefectural Minatomi Senior High School. Second year, Class B.'
  },
  // ==========================================================
  // 【回覧板】深雪敲门 —— 玩家的名字在这里第一次被人问起
  //
  // 必须放在主线上：门口那场戏有三条互斥分支，挂在任何一条里
  // 都会有玩家一路走到最后也没人问过他叫什么。
  // ==========================================================
  {
    type: 'narration',
    zh: '正要把制服挂上去，门被敋响了。不重，三下，很有分寸。',
    en: 'You are just hanging the uniform up when there is a knock. Light, three times, carefully measured.'
  },
  {
    type: 'branch',
    ifFlag: 'prologue_avoided_miyuki',
    not: true,
    then: [
      {
        type: 'narration',
        characterImage: '/images/characters/miyuki/neutral.webp',
        zh: '门外站着的是刚才那位银发的邻居。她换了家居服，手里拿着一个夹着纸的木板夹。',
        en: 'The silver-haired neighbour from earlier is standing outside, changed into house clothes, holding a wooden clipboard with papers wedged into it.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'prologue_avoided_miyuki',
    then: [
      {
        type: 'narration',
        characterImage: '/images/characters/miyuki/neutral.webp',
        zh: '门外站着一位银发的女子。就是便利店里那个你移开了视线的人。她手里拿着一块夹了纸的木板夹。',
        en: 'A silver-haired woman is standing outside. The one you looked away from in the convenience store. She is holding a wooden clipboard with papers wedged into it.'
      }
    ]
  },
  {
    type: 'speech',
    speakerZh: '银发的女子',
    speakerEn: 'Silver-haired Woman',
    characterImage: '/images/characters/miyuki/neutral.webp',
    jp: '夜遅くにごめんなさい。回覧板、回しに来ました。',
    words: [
      { jp: '回覧板', reading: 'かいらんばん', zh: '居民传阅板（邻里通知轮流传阅）', en: 'neighbourhood circular board' }
    ],
    zh: '这么晚了打扰了。我是来送回覧板的。',
    en: 'Sorry to call so late. I am passing on the neighbourhood circular.',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '她把木板夹翻到最后一页。上面是一张手写的住户名单，每个房号后面跟着一个名字。只有「２０１」那一格是空的。',
    en: 'She turns the clipboard to its last page: a handwritten resident list, a name beside every room number. Only the row marked "201" is blank.'
  },
  {
    type: 'speech',
    speakerZh: '银发的女子',
    speakerEn: 'Silver-haired Woman',
    characterImage: '/images/characters/miyuki/happy.webp',
    jp: 'ここ、まだ空白なんです。……お名前、伺ってもいいですか？',
    words: [
      { jp: '伺う', reading: 'うかがう', zh: '请教、拜听（谦让语）', en: 'to ask (humble)' }
    ],
    zh: '这里还空着。……可以请教你的名字吗？',
    en: 'This one is still empty. ...May I ask your name?',
    color: 'bg-sky-500'
  },
  {
    type: 'narration',
    zh: '「うかがってもいいですか」。这句你没听懂。你背过的三千个词里没有这个用法——你只抓住了中间那两个字：名前。',
    en: '"Ukagatte mo ii desu ka." You do not have that one. It is not in the three thousand words you memorised. What you do catch is the two syllables in the middle: namae.'
  },
  {
    type: 'narration',
    zh: '名前。名字。她在问你的名字。你在心里给自己鼓了一下掌，然后才意识到她已经把笔递过来了。',
    en: 'Namae. Name. She is asking for your name. You congratulate yourself internally, and only then notice that the pen has been held out for some time.'
  },
  {
    type: 'nameInput',
    promptZh: '钢笔已经递到你手里了。写下去的这个名字，这座城市里的每一个人都会这样叫你。',
    promptEn: 'The pen is already in your hand. Whatever you write here is what everyone in this city will call you.',
    placeholderZh: '写下你的名字……',
    placeholderEn: 'Write your name...'
  },
  {
    type: 'narration',
    characterImage: '/images/characters/miyuki/happy.webp',
    zh: '她接过木板夹低头看了一眼，很小声地把那几个音念了一遍。念到第三个字的时候停了半拍，又从头念了一次。',
    en: 'She takes the clipboard back, glances down, and says the syllables once, very quietly. She stalls half a beat on the third one and starts again from the beginning.'
  },
  {
    type: 'speech',
    speakerZh: '银发的女子',
    speakerEn: 'Silver-haired Woman',
    characterImage: '/images/characters/miyuki/happy_alt.webp',
    jp: '{name}さん、ですね。……覚えました。',
    zh: '{name}先生。……我记住了。',
    en: 'So it is {name}. ...I will remember that.',
    color: 'bg-sky-500'
  },
  {
    type: 'effect',
    setFlags: ['prologue_name_given'],
    relations: [
      { char: CharacterId.MIYUKI, familiarity: 6, reasonZh: '你的名字写进了这栋楼的住户名单', reasonEn: 'Your name went onto this building\u2019s resident list' }
    ]
  },
  {
    type: 'narration',
    characterImage: '',
    zh: '门关上了。你在原地站着，手还搭在门把上。这个国家里现在有一块木板夹，上面写着你的名字。',
    en: 'The door closes. You stay where you are with your hand still on the handle. Somewhere in this country there is now a clipboard with your name on it.'
  },

  {
    // 什么都没买的人也该有一段属于自己的晚饭
    type: 'branch',
    ifFlag: 'prologue_empty_handed',
    then: [
      {
        type: 'narration',
        zh: '冰箱是空的，柜子也是空的。你灌了一大杯自来水，把肚子先骗过去。',
        en: 'The fridge is empty. So are the cupboards. You drink a tall glass of tap water and let your stomach believe it for now.'
      },
      {
        type: 'narration',
        zh: '明天放学后第一件事：去买菜。你把这句话写在便签上，贴在了空荡荡的冰箱门上。',
        en: 'Tomorrow after school, first thing: groceries. You write it on a sticky note and press it to the empty fridge door.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'bought_onigiri',
    then: [
      {
        type: 'narration',
        zh: '晚饭是那个明太子饭团。撕开海苔包装的那一下「咔啦」响得很清脆，房间里只有你一个人听见。',
        en: 'Dinner is the mentaiko rice ball. The nori wrapper crackles crisply as you tear it open — a sound only you are here to hear.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'bought_oden',
    then: [
      {
        type: 'narration',
        zh: '关东煮的纸碗还是温的。萝卜炖得透透的，一咬满口都是汤。你想起自己指着锅说那两个词时的紧张，忍不住笑了。',
        en: 'The oden cup is still warm. The daikon has been simmered through and floods your mouth with broth. You remember how nervous you were pointing at the pot, and laugh at yourself.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'bought_noodle',
    then: [
      {
        type: 'narration',
        zh: '杯面的盖子掀开时，一股白气直冲上来，把窗玻璃糊了一小块。留学生的第一顿晚饭，非常经典。',
        en: 'Steam surges up when you peel back the cup noodle lid, fogging a small patch of the window. A deeply classic first dinner for an exchange student.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'bought_karaage',
    then: [
      {
        type: 'narration',
        zh: '炸鸡块早就凉了，但咬下去还是脆的。你一边吃一边想：明天要不要在学校门口找找有没有更好吃的。',
        en: 'The fried chicken went cold long ago but still gives a crunch. Chewing, you wonder whether there is somewhere better near the school gate.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'bought_magazine',
    then: [
      {
        type: 'narration',
        zh: '你摊开那本情报志，把感兴趣的页角一个个折起来：有乐园的旧书店、南京町的小笼包、六甲山上的夜景展望台。',
        en: 'You spread the city guide open and fold down the corners one by one: a secondhand bookshop, soup dumplings in Nankinmachi, the night-view terrace up on Rokko.'
      },
      {
        type: 'narration',
        zh: '折到第七页时，你意识到自己在给未来的自己排行程。',
        en: 'By the seventh folded corner you realize what you are doing: making plans for a future version of yourself.'
      }
    ]
  },
  {
    type: 'branch',
    ifFlag: 'bought_pudding',
    then: [
      {
        type: 'narration',
        zh: '最后你打开了那盒神户布丁。第一口下去你就开始算，明天的预算够不够再买一个。',
        en: 'Last, you open the Kobe pudding. One spoonful in, you start working out whether tomorrow’s budget stretches to another one.'
      }
    ]
  },
  {
    type: 'narration',
    zh: '十一点。你躺下了。',
    en: 'Eleven o’clock. You lie down.'
  },
  {
    type: 'narration',
    zh: '十一点零六分，你坐起来把闹钟又检查了一遍。设的是六点二十。你把它改成了六点十分。',
    en: 'At six minutes past you sit up and check the alarm again. It is set for twenty past six. You change it to ten past.'
  },
  {
    type: 'narration',
    zh: '十一点十四分，你想起来自己没确认制服的领带该怎么打。你查了三分钟视频，然后决定明天早上再说。',
    en: 'At fourteen minutes past it occurs to you that you have not checked how the tie is supposed to go. You watch three minutes of video and decide it can wait until morning.'
  },
  {
    type: 'narration',
    zh: '十一点二十九分，你在黑暗里睁着眼睛，脑子里过明天可能会发生的事。第一件是自我介绍。你在心里排练了三个版本，三个都不满意。',
    en: 'At twenty-nine minutes past you are lying with your eyes open in the dark, going through what might happen tomorrow. The first thing is the self-introduction. You rehearse three versions and are happy with none of them.'
  },
  {
    type: 'narration',
    zh: '窗外有电车过去。你数了一下，从声音出现到消失是九秒。',
    en: 'A train goes past outside. You count: nine seconds from the sound arriving to it going.'
  },
  {
    type: 'narration',
    zh: '你打算等下一班过来，再数一次。',
    en: 'You decide to wait for the next one and count again.'
  },
  {
    type: 'narration',
    zh: '你没有等到。',
    en: 'You do not make it.'
  }
];
