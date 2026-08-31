import { StoryNode } from '../types';

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
    titleZh: '第 0 章 · 海风起航之日',
    titleEn: 'Chapter 0 · Day of the Sea Breeze',
    subtitleZh: '4 月 10 日 · JR 关西特急 · 晴',
    subtitleEn: 'April 10 · JR Kansai Limited Express · Clear'
  },
  {
    type: 'narration',
    zh: '电车驶出长长的跨海隧道时，四月清亮透彻的阳光瞬间铺满了整个车厢。',
    en: 'As the train breaks out of the long undersea tunnel, clear April sunlight floods the entire carriage at once.'
  },
  {
    type: 'narration',
    zh: '左边是层峦叠翠、点缀着野樱花斑的六甲山脉；右边是波光粼粼的蔚蓝海湾，白色货轮拖着长长的航迹缓缓驶向远方。',
    en: 'To the left, the Rokko mountains rise green and speckled with wild cherry blossom. To the right, a glittering blue bay where a white freighter trails a long wake toward the horizon.'
  },
  {
    type: 'narration',
    zh: '十七年的人生里，你第一次离开熟悉的故乡，独自拖着行李箱踏上这片完全陌生的土地。',
    en: 'Seventeen years of life, and this is the first time you have left home — alone, with one suitcase, stepping onto ground you have never touched.'
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
            zh: '你什么也没想，就那样看了很久。阳光在海面上碎成无数亮片，一路跟着电车往前跑。',
            en: 'You think about nothing at all, and watch for a long time. Sunlight shatters across the water into countless bright flecks that race the train forward.'
          },
          {
            type: 'narration',
            zh: '多年以后回想起来，你依然能清楚地记得这一刻窗玻璃贴在额头上的凉意。',
            en: 'Years later you will still remember, exactly, how cool the window glass felt against your forehead in this moment.'
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
            zh: '你翻开卷了边的单词本。「引っ越す」「手続き」「近所」——全是接下来几天真的会用上的词。',
            en: 'You open the dog-eared notebook. "To move house." "Paperwork." "Neighborhood." Every one of them a word you will actually need this week.'
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
    zh: '前方到站，三宫，三宫。换乘 JR 神户线、阪神电车、阪急电铁的乘客请在此下车。请注意不要遗忘随身物品……',
    en: 'Arriving shortly at Sannomiya. Passengers transferring to the JR Kobe Line, Hanshin, or Hankyu lines, please change here. Please take care not to leave anything behind...',
    color: 'bg-slate-600'
  },
  {
    type: 'narration',
    zh: '（听着广播里字正腔圆的报站，你嘴角不由自主地上扬，从胸前口袋里掏出那张崭新的 ICOCA 卡。）',
    en: '(Listening to the crisp, perfectly enunciated announcement, you catch yourself smiling, and pull the brand-new ICOCA card from your chest pocket.)'
  },
  {
    type: 'speech',
    speakerZh: '你',
    speakerEn: 'You',
    jp: '三ノ宮……',
    zh: '三ノ宮（Sannomiya）……听力模拟题里听过无数次的名字，今天终于真正踩在自己脚下了。',
    en: 'Sannomiya... A name I have heard a hundred times in listening practice. Today I finally stand on it myself.',
    color: 'bg-yellow-500'
  },

  // ==========================================================
  // 【Scene 2】踏上三宫站台与第一声问候
  // ==========================================================
  {
    type: 'scene',
    scene: 'sannomiya_station',
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
        hintZh: '「あの、落としましたよ。」——第一次在这个国家开口',
        hintEn: '"Um — you dropped this." Your first words spoken in this country.',
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
    titleZh: '「海风庄」· 201 室',
    titleEn: 'Umikaze-so · Room 201'
  },
  {
    type: 'narration',
    zh: '在坡道中段一处向阳的静谧拐角，你找到了那栋三层的复古洋馆公寓——「海风庄」。门牌上的黄铜字被擦得很亮。',
    en: 'At a quiet, sun-facing bend halfway up the slope, you find it: a three-story retro Western-style apartment house. Umikaze-so. The brass letters on the nameplate have been polished bright.'
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
    titleZh: '201 室 · 阳台',
    titleEn: 'Room 201 · Balcony'
  },
  {
    type: 'narration',
    zh: '你放下行李箱，快步走到阳台推开门——整座神户港的全景瞬间铺开在眼前。',
    en: 'You drop the suitcase, cross the room, and push the balcony door open — and the entire port of Kobe unfolds in front of you at once.'
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
    scene: 'apartment_room'
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
            zh: '词典、语法书、三本翻烂了的真题集，按厚度一本本排开。最后你退后两步看了看——像样了。',
            en: 'Dictionary, grammar reference, three past-paper collections worn soft at the corners, all lined up by thickness. You step back two paces to look. Yes. That will do.'
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
    type: 'narration',
    zh: '把书本安顿好之后，你从随身背包里郑重地拿出了最后一样东西——一本厚实的牛皮封面手账。',
    en: 'With everything else settled, you take the last item out of your backpack, carefully: a thick journal bound in worn leather.'
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
    zh: '手账的后半部分厚得有些异样——里面夹着几张手绘的神户老地图，边角写满了密密麻麻的注记。',
    en: 'The back half of the journal is oddly thick. Tucked inside are several hand-drawn maps of old Kobe, their margins crowded with dense annotations.'
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
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '读懂了半个世纪前的一整座城市', reasonEn: 'You read an entire city as it was half a century ago' }],
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
            zh: '……没有下文了。你合上手账，心里第一次对这座城市生出了一点别的东西——不只是好奇。',
            en: 'Nothing follows it. You close the journal. For the first time, this city stirs something in you that is not only curiosity.'
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
            zh: '你用手掌把封面抚平，把它摆在书桌正中间——不是收进抽屉，而是放在每天一抬头就能看见的位置。',
            en: 'You smooth the cover flat with your palm and place it dead center on the desk. Not tucked into a drawer — right where you will see it every time you look up.'
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
            zh: '你把手账合上，站起身抓起外套。他写的是「去走出属于你自己的精彩青春」——那就从今天傍晚开始走。',
            en: 'You close the journal, stand, and grab your jacket. He wrote: go and live a youth that is your own. Fine. It starts this evening.'
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
    zh: '路灯一盏接一盏亮起来。反正也不赶时间——先在这一带随便转转吧。',
    en: 'The streetlights come on one after another down the hill. There is no rush. You may as well wander a little first.'
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
        setFlags: ['prologue_walk_kitano'],
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
          }
        ]
      },
      {
        id: 'walk_harbor',
        labelZh: '往下走，一直走到海边',
        labelEn: 'Go down, all the way to the water',
        hintZh: '从阳台上看了一下午，总得走到跟前去',
        hintEn: 'You watched it all afternoon from the balcony. You should stand next to it.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '对着海湾深吸了一口气', reasonEn: 'You filled your lungs facing the open bay' }],
        setFlags: ['prologue_walk_harbor'],
        then: [
          { type: 'scene', scene: 'kobe_harbor' },
          {
            type: 'narration',
            zh: '一路下坡走了二十分钟，终于站到了海边的栏杆前。港塔的红色霓虹刚刚点亮，海面被切成一条一条晃动的光带。',
            en: 'Twenty minutes downhill and you are standing at the harbor railing. The Port Tower has just lit up red, cutting the water into swaying ribbons of light.'
          },
          {
            type: 'narration',
            zh: '风比坡道上大得多，带着咸味直往领口里灌。你张开嘴，用力吸了一口——然后忍不住笑了出来。',
            en: 'The wind is far stronger here, salt-thick, driving straight into your collar. You open your mouth and pull in a lungful of it — and find yourself laughing.'
          },
          {
            type: 'narration',
            zh: '没有人认识你。你可以从头开始做任何人。',
            en: 'Nobody here knows you. You could start over as anyone at all.'
          }
        ]
      },
      {
        id: 'walk_arcade',
        labelZh: '往三宫的商店街走，钻进人堆里',
        labelEn: 'Head for the Sannomiya shopping arcade and into the crowd',
        hintZh: '想听听这座城市正常说话的样子',
        hintEn: 'You want to hear how this city talks when it is not announcing train stations.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '第一次听懂了关西腔的节奏', reasonEn: 'You caught the rhythm of Kansai speech for the first time' }],
        setFlags: ['prologue_walk_arcade'],
        then: [
          { type: 'scene', scene: 'sannomiya_arcade' },
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
          }
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
    titleZh: '坡道口的便利店',
    titleEn: 'The Convenience Store at the Foot of the Slope',
    subtitleZh: '晚上 7:20',
    subtitleEn: '7:20 PM'
  },
  {
    type: 'narration',
    zh: '绕回坡道口时，一家便利店的白光从玻璃门里泼到人行道上。你推门进去，自动门「ピンポーン」响了一声。',
    en: 'Back at the foot of the slope, the white glare of a convenience store spills across the pavement. You push in, and the door chimes.'
  },
  {
    type: 'scene',
    scene: 'convenience_store_interior'
  },
  {
    type: 'speech',
    speakerZh: '店员',
    speakerEn: 'Store Clerk',
    jp: 'いらっしゃいませ〜！',
    zh: '欢迎光临～！',
    en: 'Welcome!',
    color: 'bg-teal-500'
  },
  {
    type: 'narration',
    zh: '暖光下的货架排得整整齐齐。收银台后的关东煮锅冒着白气，热气在玻璃上糊了一层雾。',
    en: 'Neat rows of shelves under warm light. Behind the register, an oden pot breathes steam that fogs the glass above it.'
  },
  {
    type: 'narration',
    zh: '你摸了摸口袋——今天能花在晚饭上的，差不多就一千日元。',
    en: 'You check your pocket. What you can spend on dinner tonight comes to about a thousand yen.'
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
        imageUrl: '/images/items/item_onigiri.webp',
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
        imageUrl: '/images/items/item_oden.webp',
        nameJp: 'おでん（大根と卵）',
        nameZh: '关东煮（萝卜 + 鸡蛋）',
        nameEn: 'Oden (Daikon & Egg)',
        descZh: '要自己开口跟店员说要哪几样。汤是热的，纸碗烫手。',
        descEn: 'You have to tell the clerk out loud which pieces you want. The broth is hot enough to warm the paper cup through.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '指着锅，把想要的那两样说出了口', reasonEn: 'You pointed at the pot and said out loud which two you wanted' }],
        setFlags: ['bought_oden']
      },
      {
        id: 'karaage',
        price: 250,
        emoji: '🍗',
        imageUrl: '/images/items/item_karaage.webp',
        nameJp: 'からあげ',
        nameZh: '炸鸡块',
        nameEn: 'Fried Chicken',
        descZh: '柜台边现炸的，纸袋捧在手里烫烫的。',
        descEn: 'Fried right there by the counter. The paper bag is hot in your hands.',
        setFlags: ['bought_karaage']
      },
      {
        id: 'cup_noodle',
        price: 210,
        emoji: '🍜',
        imageUrl: '/images/items/item_cup_noodle.webp',
        nameJp: 'カップ麺',
        nameZh: '杯面',
        nameEn: 'Cup Noodles',
        descZh: '留着当明天的备用粮也不错。热水店里就能加。',
        descEn: 'Not a bad emergency ration for tomorrow. They will fill it with hot water right here.',
        setFlags: ['bought_noodle']
      },
      {
        id: 'tea_ole',
        price: 160,
        emoji: '🥛',
        imageUrl: '/images/items/item_tea_ole.webp',
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
        imageUrl: '/images/items/item_kobe_pudding.webp',
        nameJp: '神戸プリン',
        nameZh: '神户布丁',
        nameEn: 'Kobe Pudding',
        descZh: '货架上贴着「神戸土産」的标签。来神户的第一天就吃神户布丁，好像有点土，但你还是伸手了。',
        descEn: 'Shelved under a "Kobe souvenir" tag. Eating Kobe pudding on your first day in Kobe is a little on the nose. You reach for it anyway.',
        effects: [{ stat: 'charm', amount: 1, reasonZh: '来神户的第一天，就吃上了神户布丁', reasonEn: 'First day in Kobe, and already eating Kobe pudding' }],
        setFlags: ['bought_pudding']
      },
      {
        id: 'town_magazine',
        price: 450,
        emoji: '📖',
        imageUrl: '/images/items/item_town_magazine.webp',
        nameJp: 'タウン情報誌（神戸特集）',
        nameZh: '本地情报志（神户特辑）',
        nameEn: 'City Guide Magazine (Kobe Special)',
        descZh: '厚厚一本，全是这座城市的店、路线和活动。有点贵，够买三个饭团了。',
        descEn: 'A thick issue, all shops and routes and events across the city. Pricey — three rice balls, that.',
        effects: [{ stat: 'knowledge', amount: 1, reasonZh: '一整本神户，四百五十日元', reasonEn: 'An entire city, for four hundred fifty yen' }],
        setFlags: ['bought_magazine']
      },
      {
        id: 'dish_soap',
        price: 190,
        emoji: '🧴',
        imageUrl: '/images/items/item_dish_soap.webp',
        nameJp: '食器用洗剤',
        nameZh: '洗洁精',
        nameEn: 'Dish Soap',
        descZh: '一点也不浪漫。但今晚要是不买，明天早上你就得用清水刷碗。',
        descEn: 'Not romantic in the slightest. But skip it tonight and you will be scrubbing bowls with cold water in the morning.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '想到了明天早上要刷碗', reasonEn: 'You thought ahead to tomorrow morning’s washing up' }],
        setFlags: ['bought_soap']
      }
    ]
  },

  // ==========================================================
  // 【Scene 6b】结账 · 第一次真正的日语对话
  // ==========================================================
  {
    type: 'narration',
    zh: '你把东西放到收银台上。店员利落地扫码，然后抬起头问了一句。',
    en: 'You set everything on the counter. The clerk scans it all briskly, then looks up and asks:'
  },
  {
    type: 'speech',
    speakerZh: '店员',
    speakerEn: 'Store Clerk',
    jp: 'レジ袋はご利用ですか？お箸はおつけしますか？',
    zh: '需要塑料袋吗？要给您配一双筷子吗？',
    en: 'Would you like a bag? And shall I add a pair of chopsticks?',
    color: 'bg-teal-500'
  },
  {
    type: 'choice',
    promptZh: '两句话，语速比听力教材快得多。',
    promptEn: 'Two sentences, spoken far faster than any listening exercise.',
    options: [
      {
        id: 'checkout_kansai',
        labelZh: '「袋、お願いします。お箸も一膳……おおきに！」',
        labelEn: '"A bag please. And one pair of chopsticks... ookini!"',
        hintZh: '刚在商店街学来的那句关西腔谢谢',
        hintEn: 'The Kansai thank-you you just picked up in the arcade.',
        requires: { stat: 'guts', min: 2 },
        effects: [
          { stat: 'charm', amount: 2, reasonZh: '来的第一天就用上了关西腔', reasonEn: 'Day one, and already speaking Kansai' },
          { stat: 'guts', amount: 1, reasonZh: '敢把刚学会的话立刻用出去', reasonEn: 'You used a phrase the same hour you learned it' }
        ],
        setFlags: ['prologue_checkout_kansai', 'prologue_checkout_jp'],
        then: [
          {
            type: 'narration',
            zh: '店员正在装袋的手停了一下，然后笑出了声。',
            en: 'The clerk’s hands pause mid-bag. Then he laughs out loud.'
          },
          {
            type: 'speech',
            speakerZh: '店员',
            speakerEn: 'Store Clerk',
            jp: 'えっ、おおきに！？お兄さん、関西の人ちゃうやろ？うまいなあ！',
            zh: '诶，「おおきに」！？小哥你不是关西人吧？说得真地道啊！',
            en: 'Wait — "ookini"?! You’re not from Kansai, are you? That was good!',
            color: 'bg-teal-500'
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
        labelZh: '「あ、はい。袋をお願いします。お箸も一膳ください。」',
        labelEn: '"Ah — yes. A bag, please. And one pair of chopsticks."',
        hintZh: '一个字一个字地说完，说得很慢',
        hintEn: 'Word by word, slowly, all the way to the end.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '把整句话说完了，没有中途放弃', reasonEn: 'You finished the whole sentence without bailing out' }
        ],
        setFlags: ['prologue_checkout_jp'],
        then: [
          {
            type: 'narration',
            zh: '你说得很慢，但一个音都没有含糊。店员点点头，把筷子放进袋子，动作一如往常。',
            en: 'You speak slowly, but you do not slur a single syllable. The clerk nods, drops the chopsticks in the bag, entirely unremarkable about it.'
          },
          {
            type: 'narration',
            zh: '——正因为一如往常，你才更高兴。他没有把你当成一个需要特殊照顾的外国人。',
            en: 'And it is precisely because it was unremarkable that you are pleased. He did not treat you as a foreigner in need of handling.'
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
            zh: '你点了点头，又比了个「一」。店员立刻会意，动作麻利地装好袋，还多塞了一张湿纸巾。',
            en: 'You nod, then hold up one finger. The clerk gets it instantly, bags everything efficiently, and slips in an extra wet wipe.'
          },
          {
            type: 'narration',
            zh: '他一句多余的话都没说，态度也没有半点变化。你反倒有点懊恼——那句话你明明会说的。',
            en: 'He says nothing extra and his manner does not change one degree. If anything that makes it worse. You knew that sentence. You could have said it.'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // 【Scene 7】偶遇 · 杂志架前的银发
  // ==========================================================
  {
    type: 'narration',
    zh: '提着袋子转身要走的时候，你注意到杂志架前站着一个人。',
    en: 'Turning to leave with your bag, you notice someone standing at the magazine rack.'
  },
  {
    type: 'narration',
    zh: '是个年轻女子。一头银白色的长发在便利店的白光下几乎是发亮的，手里拎着一个装了牛奶和鸡蛋的小袋子，正低头翻着一本料理杂志。',
    en: 'A young woman. Her long silver-white hair almost glows under the store’s fluorescent light. A small bag of milk and eggs hangs from one hand while she leafs through a cooking magazine.'
  },
  {
    type: 'narration',
    zh: '她抬头的瞬间和你对上了视线——然后你们俩同时愣了半秒。',
    en: 'She looks up, and your eyes meet. For half a second, you both freeze.'
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
        labelZh: '主动开口：「あの、すみません——」',
        labelEn: 'Speak first: "Um, excuse me—"',
        hintZh: '同一栋楼的邻居。今天不打招呼，明天更难开口',
        hintEn: 'Same building. If not now, it only gets harder tomorrow.',
        effects: [
          { stat: 'guts', amount: 1, reasonZh: '主动向陌生人迈出了第一步', reasonEn: 'You took the first step toward a stranger' },
          { stat: 'charm', amount: 1, reasonZh: '第一印象留得干净利落', reasonEn: 'You made a clean first impression' }
        ],
        setFlags: ['prologue_greeted_miyuki'],
        then: [
          {
            type: 'speech',
            speakerZh: '你',
            speakerEn: 'You',
            jp: 'あの、すみません。もしかして、海風荘の方ですか？今日から二〇一号室に住むことになりまして……',
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
            speakerZh: '银发的女子',
            speakerEn: 'Silver-haired Woman',
            jp: 'あら。じゃあ、お隣さんね。二〇二号室です。……ふふ、そんなに緊張しなくても大丈夫よ。',
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
            type: 'narration',
            zh: '你们并肩走出便利店，一起沿着坡道往上走。她的步子放得很慢，刚好是你拎着袋子能跟上的速度。',
            en: 'You walk out of the store side by side and start up the slope together. She keeps her pace slow — exactly slow enough for someone carrying a bag to keep up.'
          },
          {
            type: 'speech',
            speakerZh: '银发的女子',
            speakerEn: 'Silver-haired Woman',
            jp: 'この坂、慣れるまでは大変よ。……何か困ったことがあったら、いつでも隣をノックしてね。',
            zh: '这条坡道，习惯之前挺累人的。……有什么困难的话，随时敲隔壁的门就好。',
            en: 'This hill is hard on you until you get used to it. ...If anything troubles you, knock next door. Any time.',
            color: 'bg-sky-500'
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
        setFlags: ['prologue_nodded_miyuki'],
        then: [
          {
            type: 'narration',
            zh: '你朝她的方向微微低了低头。她也回了一个礼，姿态优雅得像是练过。',
            en: 'You incline your head toward her. She returns the bow, with a poise that looks practiced.'
          },
          {
            type: 'speech',
            speakerZh: '银发的女子',
            speakerEn: 'Silver-haired Woman',
            jp: '……こんばんは。',
            zh: '……晚上好。',
            en: '...Good evening.',
            color: 'bg-sky-500'
          },
          {
            type: 'narration',
            zh: '短短三个字，却让整个便利店的白光都柔和了一点。你们前后脚走出店门，一路上没再说话。',
            en: 'Three quiet syllables, and somehow the harsh store light softens. You leave one after the other, and neither of you says anything more on the way up.'
          },
          {
            type: 'narration',
            zh: '但在她推开 202 室的门之前，她回过头，又对你笑了一下。',
            en: 'But before she pushes open the door of Room 202, she turns back and smiles at you once more.'
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
            zh: '你把视线转向旁边的冰柜，假装在认真研究一排你根本不打算买的饮料。',
            en: 'You turn toward the cooler and pretend to study, very seriously, a row of drinks you have no intention of buying.'
          },
          {
            type: 'narration',
            zh: '余光里，她看了你一会儿，然后合上杂志，安静地走向了收银台。',
            en: 'In the corner of your vision, she looks at you for a moment, then closes the magazine and walks quietly to the register.'
          },
          {
            type: 'narration',
            zh: '走出便利店时，坡道上已经没有她的影子了。你拎着袋子一个人往上爬，风比刚才凉。',
            en: 'By the time you step outside, there is no sign of her on the slope. You climb alone with your bag. The wind is colder than it was.'
          },
          {
            type: 'narration',
            zh: '经过 202 室门口时，里面透出暖黄色的灯光。你在门前站了两秒，然后掏出了自己的钥匙。',
            en: 'Passing Room 202, warm yellow light leaks from under the door. You stand there for two seconds, then take out your own key.'
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
    titleZh: '海风庄 201 室 · 夜',
    titleEn: 'Umikaze-so, Room 201 · Night',
    subtitleZh: '晚上 8:40 · 窗外是千万级的夜景',
    subtitleEn: '8:40 PM · Ten million lights outside the window'
  },
  {
    type: 'narration',
    zh: '你把明天开学要穿的深蓝色制服熨得平平整整，仔细地把银色校徽别在领口——私立神户海星学园，高二 B 班。',
    en: 'You press tomorrow’s navy uniform flat, and pin the silver crest carefully to the collar. Kobe Kaisei Academy. Second year, Class B.'
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
        zh: '最后你打开了那盒神户布丁。焦糖的苦和奶味在舌尖上化开——好吃得有点犯规。',
        en: 'Last, you open the Kobe pudding. Caramel bitterness and cream dissolve on your tongue. It is unfairly good.'
      }
    ]
  },
  {
    type: 'narration',
    zh: '夜深了。海风吹动着窗帘，远处的摩天轮闪烁着温柔的彩色光带。',
    en: 'The night deepens. Sea wind stirs the curtains, and far off the ferris wheel turns through soft bands of color.'
  },
  {
    type: 'narration',
    zh: '你躺在床上，听着墙上钟表平缓有力的滴答声。明天清晨，海星学园高二 B 班的教室门就将向你敞开。',
    en: 'You lie in bed listening to the steady, deliberate tick of the wall clock. Tomorrow morning, the door of Class 2-B will open for you.'
  },
  {
    type: 'speech',
    speakerZh: '你',
    speakerEn: 'You',
    jp: 'おやすみ、神戸。',
    zh: '晚安，神户。……明天见。',
    en: 'Good night, Kobe. ...See you tomorrow.',
    color: 'bg-yellow-500'
  }
];
