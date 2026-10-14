import { MapEventDef, CharacterId, StoryNode, StoryOption, StoryWord, StatKey, GameCalendar } from '../types';
import { outfitImg, Mood } from '../data/outfitContext';

// ---------------------------------------------------------
// 🌿 布引香草园（布引ハーブ園）
//
// 新神户站背后那座山的半山腰。北野坂往东走十分钟就到山脚。
// 上去有两条路，这是这个地方的全部意思：
//   · 坐缆车：十分钟，花钱，城市在脚下一点点变小；
//   · 爬上去：要走一个钟头，累，但半路会经过布引瀑布——
//     日本"三大神瀑"之一，《伊势物语》里在原业平一行人专门来看过的那道水。
// 每次去都先问一次怎么上去（nunobikiApproach），然后才是园里发生的事。
// 天黑以后山路不让走，只剩缆车。
//
// 专属剧情五段：
//   第一次来（谁都不带）→ 认识这个地方
//   深雪：温室里挑香草苗，给阳台的花盆
//   铃：读《伊势物语》第八十七段，那首写瀑布的歌
//   稻荷：瀑布前面，她好像记得一千年前来看水的那一群人（梦一样、说不清）
//   金城：他是跑上来的。你是怎么上来的？
// ---------------------------------------------------------

export const NUNOBIKI_ID = 'nunobiki_herb_garden';

type C = CharacterId;
const SP: Partial<Record<C, { zh: string; en: string; color: string }>> = {
  [CharacterId.MIYUKI]: { zh: '深雪', en: 'Miyuki', color: 'bg-violet-400' },
  [CharacterId.REI]:    { zh: '铃',   en: 'Rei',    color: 'bg-indigo-500' },
  [CharacterId.INARI]:  { zh: '稻荷', en: 'Inari',  color: 'bg-amber-500' }
};
const M = CharacterId.MIYUKI, R = CharacterId.REI, I = CharacterId.INARI;

const scene = (s: string, titleZh?: string, titleEn?: string, subtitleZh?: string, subtitleEn?: string): StoryNode =>
  ({ type: 'scene', scene: s, bgm: 'chat', ...(titleZh ? { titleZh, titleEn } : {}), ...(subtitleZh ? { subtitleZh, subtitleEn } : {}) });
const nar = (zh: string, en: string, img?: string, words?: StoryWord[]): StoryNode =>
  ({ type: 'narration', zh, en, ...(img !== undefined ? { characterImage: img } : {}), ...(words ? { words } : {}) });
const say = (c: C, outfit: string, mood: Mood, jp: string, zh: string, en: string, words?: StoryWord[]): StoryNode =>
  ({ type: 'speech', speakerZh: SP[c]!.zh, speakerEn: SP[c]!.en, color: SP[c]!.color, characterImage: outfitImg(c, outfit, mood), jp, zh, en, ...(words ? { words } : {}) });
const me = (jp: string, zh: string, en: string): StoryNode =>
  ({ type: 'speech', speakerZh: '你', speakerEn: 'You', color: 'bg-yellow-500', jp, zh, en });
// 金城不是可攻略角色，没有 CharacterId：立绘直接写路径（宿敌线同一套）
const kai = (face: string, jp: string, zh: string, en: string): StoryNode =>
  ({ type: 'speech', speakerZh: '金城', speakerEn: 'Kinjo', color: 'bg-teal-600', characterImage: `/images/characters/kai/casual_${face}.webp`, jp, zh, en });

interface Opt {
  id: string; zh: string; en: string; jp?: string; hintZh: string; hintEn: string;
  char?: C; aff?: number; fam?: number; stat?: StatKey; words?: StoryWord[]; setFlags?: string[];
  then: StoryNode[];
}
const choice = (promptZh: string, promptEn: string, opts: Opt[]): StoryNode => ({
  type: 'choice', promptZh, promptEn,
  options: opts.map<StoryOption>(o => ({
    id: o.id, labelZh: o.zh, labelEn: o.en, ...(o.jp ? { jp: o.jp } : {}), hintZh: o.hintZh, hintEn: o.hintEn,
    ...(o.words ? { words: o.words } : {}), ...(o.setFlags ? { setFlags: o.setFlags } : {}),
    ...(o.char ? { relations: [{ char: o.char, affection: o.aff || 0, familiarity: o.fam || 0, reasonZh: o.zh.replace(/[「」]/g, ''), reasonEn: o.en.replace(/"/g, '') }] } : {}),
    ...(o.stat ? { effects: [{ stat: o.stat, amount: 2, reasonZh: o.zh.replace(/[「」]/g, ''), reasonEn: o.en.replace(/"/g, '') }] } : {}),
    then: o.then
  }))
});
const end = (c: C, aff: number, fam: number, zh: string, en: string): StoryNode =>
  ({ type: 'effect', relations: [{ char: c, affection: aff, familiarity: fam, reasonZh: zh, reasonEn: en }] });

const W_TAKI: StoryWord = { jp: '滝', reading: 'たき', zh: '瀑布', en: 'waterfall' };
const W_ROPEWAY: StoryWord = { jp: 'ロープウェイ', reading: 'ろーぷうぇい', zh: '缆车（索道）', en: 'ropeway / cable car' };
const W_NOBORU: StoryWord = { jp: '登る', reading: 'のぼる', zh: '爬（山）、登', en: 'to climb' };
const W_KAORI: StoryWord = { jp: '香り', reading: 'かおり', zh: '香气', en: 'fragrance' };

// ==========================================================
// 上山：每一趟都先走这一段
// 「nunobiki_now_*」只记这一趟是怎么上来的（下面金城那段要用），
// 「nunobiki_hiked」记的是你走过那条山路没有（稻荷那段要用）。
// tire:N 是爬山多耗的体力，pay:N 是缆车票。
// ==========================================================
export const nunobikiApproach = (cal: GameCalendar, flags: Record<string, boolean>): StoryNode[] => {
  const first = !flags['nunobiki_hiked'] && !flags['nunobiki_rode'];
  const night = cal.timeSlot === 'night';
  const ropeway: Opt = {
    id: 'nb_ropeway', zh: '坐缆车上去', en: 'Take the ropeway up', hintZh: '十分钟。要买票', hintEn: 'Ten minutes. Costs a ticket',
    words: [W_ROPEWAY], setFlags: ['pay:1200', 'nunobiki_rode', 'nunobiki_now_ropeway', '!nunobiki_now_hike'],
    then: [
      scene('nunobiki_ropeway'),
      first
        ? nar('缆车是那种小小的白色吊厢，一次只坐得下几个人。门一关，它就晃了一下离开站台，像被什么东西轻轻提了起来。新神户站的屋顶一下子就到了脚底下。',
            'The gondola is a small white cabin that holds only a few people. The door shuts, it sways once and leaves the platform as if something has gently lifted it. The roof of Shin-Kobe station is suddenly beneath your feet.', '', [W_ROPEWAY])
        : nar('你又坐上了那个白色的小吊厢。城市照旧在脚下一点点变小。', 'You are in the little white cabin again. As before, the city shrinks beneath you bit by bit.', ''),
      first
        ? nar('往下看，山谷里有一道细细的白线，在树缝里一闪一闪的——那是瀑布。从这么高的地方看，它安静得像一根挂着的线。你想，要是走上来的话，大概会从它旁边经过吧。',
            'Below, in the valley, a thin white line flickers between the trees: the waterfall. From this high it is as quiet as a hanging thread. If you had walked up, you think, you would probably have passed right by it.')
        : nar(night ? '窗外的灯一盏一盏亮起来，山下是一整片铺开的夜景。' : '十分钟很短。你还没看够，山顶的站台就到了。',
            night ? 'Outside, lights come on one by one, the whole night view spreading out below.' : 'Ten minutes is short. You have not finished looking when the top station arrives.')
    ]
  };
  const hike: Opt = {
    id: 'nb_hike', zh: '走山路爬上去', en: 'Climb the mountain path', jp: '歩いて登ろう。', hintZh: '要一个钟头。会累，但路过瀑布', hintEn: 'An hour. Tiring, but it passes the falls',
    words: [W_NOBORU, W_TAKI], setFlags: ['tire:20', 'nunobiki_hiked', 'nunobiki_now_hike', '!nunobiki_now_ropeway'],
    then: [
      scene('nunobiki_falls'),
      ...(first ? [
        nar('从新神户站背后钻进去，不到十五分钟，城市的声音就没了。先听见的是水声，然后才看见它：一道白色的水从四十多米高的黑色岩壁上直直落下来，砸进一潭绿色的水里。雾气扑到脸上，凉的。',
          'Slip in behind Shin-Kobe station, and in under fifteen minutes the noise of the city is gone. You hear the water first and only then see it: a white fall dropping straight down forty-odd metres of black rock into a green pool. The spray hits your face, cold.', undefined, [W_TAKI]),
        nar('旁边立着一块说明牌：布引の滝。雄滝、雌滝、夫婦滝、鼓ヶ滝，四道瀑布连在一起，和那智、华严并称日本的「三大神滝」。一千多年前，京都的贵族就专门跑来看过它，写进了《伊势物语》。',
          'A sign stands beside it: Nunobiki Falls. Four falls in a row, the male, the female, the married couple, the drum, counted with Nachi and Kegon among Japan\'s three great sacred falls. More than a thousand years ago, nobles from Kyoto made the trip just to see it, and it went into The Tales of Ise.'),
        nar('牌子底下还有一行小字：这里的水后来成了神户港给远洋船补给的水，叫「KOBE WATER」，据说过了赤道都不会坏。你在心里把这件事记下来，打算哪天讲给谁听。',
          'In smaller print under that: this water later supplied the ocean-going ships at Kobe port, and was known as "Kobe Water", said to stay fresh even across the equator. You file it away to tell someone one day.'),
        { type: 'effect', effects: [{ stat: 'guts', amount: 2, reasonZh: '第一次走布引的山路', reasonEn: 'Walking the Nunobiki trail for the first time' }] } as StoryNode
      ] : [
        nar('你又在瀑布前站了一会儿。水声大得盖住了自己的呼吸，脑子里一下子就空了。', 'You stand in front of the falls for a while again. The water is loud enough to drown out your own breathing, and your head empties at once.')
      ]),
      nar('再往上是一座石头砌的老水坝，水面平得像镜子。然后是很长、很长的一段上坡。等你终于看见香草园的栅栏时，衬衫已经贴在背上了。',
        'Further up is an old stone dam with water as flat as a mirror. Then a very, very long climb. By the time you finally see the herb garden fence your shirt is stuck to your back.')
    ]
  };
  return [
    scene('kitano_slope'),
    first
      ? nar('北野坂往东走十分钟，就是新神户站。站的背后紧贴着一座山，山腰上就是布引香草园。上去有两条路：缆车，或者自己的腿。',
          'Ten minutes east along the slope from Kitano is Shin-Kobe station. A mountain presses right up behind it, and halfway up is the Nunobiki Herb Garden. There are two ways up: the ropeway, or your own legs.')
      : nar('又到了新神户站背后。缆车站的牌子和山路的入口指着两个方向。', 'Behind Shin-Kobe station again. The ropeway sign and the trailhead point in two directions.'),
    ...(night
      ? [
          nar('天已经黑了，山路的入口拉上了一道绳子。今晚只能坐缆车。', 'It is already dark, and a rope has been strung across the trailhead. Tonight it is the ropeway or nothing.'),
          choice('怎么上去？', 'How do you go up?', [ropeway])
        ]
      : [choice('怎么上去？', 'How do you go up?', [ropeway, hike])])
  ];
};

// ==========================================================
// 第一次来
// ==========================================================
const EV_FIRST: MapEventDef = {
  id: 'ev_nunobiki_first', locationId: NUNOBIKI_ID, chars: [], priority: 6,
  titleZh: '两百种香气', titleEn: 'Two Hundred Fragrances',
  script: [
    scene(NUNOBIKI_ID, '布引香草园', 'Nunobiki Herb Garden', '新神户 · 山腰', 'Shin-Kobe · Halfway up the mountain'),
    nar('风一吹过来，你先闻到的是薰衣草，然后是迷迭香，然后是一种你叫不出名字、但很像小时候某种糖的味道。', 'When the wind comes, the first thing you smell is lavender, then rosemary, then something you cannot name that is very like a sweet from your childhood.', undefined, [W_KAORI]),
    nar('整面山坡被切成一层一层的花坛，一直往下铺。每块花坛前插着小木牌，日文名下面写着拉丁文。这里据说是日本最大的香草园之一，两百来种香草，七万多株。',
      'The whole slope is cut into terraces of beds stepping down the hill. A small wooden tag stands in front of each, Japanese name above, Latin below. They say it is one of the largest herb gardens in Japan: some two hundred kinds, more than seventy thousand plants.'),
    nar('花坛的尽头，是整个神户——你住的那条坡、港塔、海、还有更远的、在雾里的海平线。你第一次从这么高的地方、这么完整地看你住的城市。',
      'At the end of the beds is the whole of Kobe: your slope, the Port Tower, the sea, and the horizon further off in haze. It is the first time you have seen the city you live in this high up and this whole.'),
    choice('你在一块写着「ミント」的牌子前停下来。', 'You stop in front of a tag that says "mint".', [
      { id: 'nb_first_smell', zh: '掐一片叶子闻一闻', en: 'Pinch a leaf and smell it', hintZh: '牌子上写着「请触摸」', hintEn: 'The tag says "please touch"', stat: 'proficiency',
        words: [{ jp: '触ってみてください', reading: 'さわってみてください', zh: '请摸摸看', en: 'please try touching' }],
        then: [nar('你用指尖蹭了一下叶子。清凉的味道一下子冲进鼻子里，你打了个喷嚏。旁边一个老奶奶笑出了声，说「ミントは元気がいいからね」。',
          'You brush a leaf with your fingertip. The cool smell rushes straight up your nose and you sneeze. An old lady nearby laughs: mint has plenty of spirit, you know.')] },
      { id: 'nb_first_view', zh: '去观景台看城市', en: 'Go to the lookout and look at the city', hintZh: '找找自己住在哪儿', hintEn: 'Look for where you live', stat: 'kindness',
        then: [nar('你趴在栏杆上找了很久，终于认出了北野那一片洋馆的屋顶。你住的那栋看不见，但你知道它就在那儿。这种"知道"让你有一点安心。',
          'You lean on the rail and search for a long time before you recognise the rooftops of the Kitano houses. Yours is not visible, but you know it is there, and the knowing is a small comfort.')] },
      { id: 'nb_first_tea', zh: '去温室的咖啡角喝一杯香草茶', en: 'Have a herb tea in the glasshouse café', hintZh: '要花点钱', hintEn: 'Costs a little', setFlags: ['pay:600'], stat: 'charm',
        then: [scene('nunobiki_glasshouse'),
          nar('玻璃壶里的茶是淡金色的，叫「ハーブティー」。店员说今天的是柠檬马鞭草和洋甘菊。你喝了一口，觉得自己今天走过的路都被泡开了。',
            'The tea in the glass pot is pale gold. The staff say today it is lemon verbena and camomile. One sip, and it feels as if all the walking you did today has been steeped loose.', undefined,
            [{ jp: 'ハーブティー', reading: 'はーぶてぃー', zh: '香草茶', en: 'herbal tea' }])] }
    ]),
    nar('下山的时候，你的衣服上还带着一点薰衣草的味道。', 'On the way down there is still a little lavender on your clothes.'),
    { type: 'effect', setFlags: ['nunobiki_known'] }
  ]
};

// ==========================================================
// 深雪：温室里挑香草苗
// ==========================================================
const EV_MIYUKI: MapEventDef = {
  id: 'ev_nunobiki_miyuki', locationId: NUNOBIKI_ID, chars: [M], priority: 8, timeSlots: ['morning', 'afternoon'],
  titleZh: '会长大的那一种', titleEn: 'The Kind That Grows',
  requiresFlags: ['ev_nunobiki_first'], minFamiliarity: { [M]: 40 },
  script: [
    scene('nunobiki_glasshouse', '布引香草园 · 温室', 'Nunobiki Herb Garden · The glasshouse', '午后', 'Afternoon'),
    nar('温室的架子上摆满了一盆一盆的小苗。你在里面看见一个熟悉的背影，正蹲在架子前，手里拿着两盆几乎一模一样的东西在比。', 'The glasshouse shelves are lined with seedlings in small pots. You spot a familiar back crouched in front of one, comparing two pots that look almost identical.'),
    say(M, 'cardigan', 'surprised', 'あら……！ こんなところで会うなんて。ふふ、私ね、ベランダのプランターに何か植えようと思って。料理に使えるのがいいなって。', '哎呀……！居然在这种地方碰到你。呵呵，我呀，想在阳台的花盆里种点什么。最好是做菜能用上的。', 'Oh...! Fancy meeting you here. I wanted to plant something in the balcony planters. Something I can cook with, ideally.'),
    say(M, 'cardigan', 'neutral', 'でもね、どれも可愛くて決められないの。……ねえ、選んでくれない？', '可是每一盆都很可爱，我定不下来。……呐，你帮我选一个好不好？', 'But they are all so sweet that I cannot decide. ...Would you choose for me?'),
    choice('她手里一盆罗勒，一盆迷迭香。架子上还有薰衣草。', 'She holds a basil and a rosemary. There is lavender on the shelf too.', [
      { id: 'nb_m_basil', zh: '「バジルがいいと思う。」', en: '"I think the basil."', jp: 'バジルがいいと思う。', hintZh: '最好种，最常用', hintEn: 'Easiest to grow, most useful',
        char: M, aff: 4, fam: 7, stat: 'kindness', words: [{ jp: 'バジル', reading: 'ばじる', zh: '罗勒', en: 'basil' }],
        then: [say(M, 'cardigan', 'happy', 'バジル！ そうよね、トマトと合わせて……ふふ、今度パスタ作ったら、一番最初に食べてもらわなきゃ。', '罗勒！对哦，配番茄……呵呵，下次做意面的时候，第一盘一定要让你吃。', 'Basil! Of course, with tomatoes... When I make pasta next, you will have to be the very first to eat it.')] },
      { id: 'nb_m_rosemary', zh: '「ローズマリーは？ 冬も枯れないって。」', en: '"Rosemary? It says it survives winter."', jp: 'ローズマリーは？冬も枯れないって。', hintZh: '你读了牌子', hintEn: 'You read the tag',
        char: M, aff: 5, fam: 5, stat: 'knowledge', words: [{ jp: '枯れる', reading: 'かれる', zh: '枯萎', en: 'to wither' }],
        then: [say(M, 'cardigan', 'shy', '冬も枯れない……そういうの、いいわね。ずっとそこにいてくれるって。……あ、ごめんなさい、なんだか変なこと言っちゃった。', '冬天也不会枯……那种的，真好呢。一直在那儿陪着你。……啊，对不起，我好像说了奇怪的话。', 'Survives the winter... I like that. Something that just stays there. ...Oh, sorry, that came out strangely.')] },
      { id: 'nb_m_lavender', zh: '「ラベンダー。料理じゃないけど、いい香りだから。」', en: '"Lavender. Not for cooking, but it smells nice."', jp: 'ラベンダー。料理じゃないけど、いい香りだから。', hintZh: '给她自己的', hintEn: 'For her, not for the kitchen',
        char: M, aff: 7, fam: 3, stat: 'charm', words: [{ jp: 'ラベンダー', reading: 'らべんだー', zh: '薰衣草', en: 'lavender' }],
        then: [nar('她愣了一下，看着那盆薰衣草，好像从来没想过可以买一个"不为了谁"的东西。', 'She pauses and looks at the lavender as if it had never occurred to her that she could buy something not meant for anyone.', outfitImg(M, 'cardigan', 'surprised')),
          say(M, 'cardigan', 'happy', '……自分のために、ね。うん。じゃあ、それにする。', '……为了自己，是吗。嗯。那就选它。', '...For myself. Yes. Then that is the one.')] }
    ]),
    nar('结账的时候，她多买了一小袋种子，塞进你手里。', 'At the till she buys an extra little packet of seeds and presses it into your hand.'),
    say(M, 'cardigan', 'happy', 'これはあなたの分。ベランダ、お隣同士でしょう？ どっちが先に芽が出るか、競争ね。', '这是你的份。阳台不是挨着的嘛？看谁的先发芽，比一比。', 'This is yours. Our balconies are next to each other, aren\'t they? Let\'s see whose sprouts first.'),
    { type: 'effect', setFlags: ['give:seed_basil:1'] },
    nar('（获得了罗勒的种子。可以种在阳台的花盆里。）', '(You received basil seeds. They can be planted in a balcony pot.)'),
    end(M, 3, 4, '布引香草园的温室', 'The Nunobiki glasshouse')
  ]
};

// ==========================================================
// 铃：伊势物语第八十七段
// ==========================================================
const EV_REI: MapEventDef = {
  id: 'ev_nunobiki_rei', locationId: NUNOBIKI_ID, chars: [R], priority: 8, timeSlots: ['morning', 'afternoon'],
  titleZh: '白玉', titleEn: 'White Jewels',
  requiresFlags: ['ev_nunobiki_first'], minFamiliarity: { [R]: 50 },
  script: [
    scene(NUNOBIKI_ID, '布引香草园', 'Nunobiki Herb Garden', '午后 · 观景台旁的长椅', 'Afternoon · The bench by the lookout'),
    nar('观景台旁边的长椅上，有人在看一本很旧的文库本。风把书页翻过去一页，她伸手按住，眼镜反了一下光。', 'On the bench by the lookout someone is reading a very old paperback. The wind flips a page; she puts out a hand to hold it, and her glasses catch the light.'),
    say(R, 'casual', 'surprised', '……あ。こんにちは。……奇遇ですね。私は、これを読みに。『伊勢物語』の八十七段。布引の滝が出てくるんです。', '……啊。你好。……真巧。我是来读这个的。《伊势物语》第八十七段。里面写到了布引瀑布。', '...Oh. Hello. ...What a coincidence. I came to read this. The Tales of Ise, section eighty-seven. The Nunobiki falls are in it.'),
    say(R, 'casual', 'neutral', '在原業平たちが、わざわざ京都からこの滝を見に来るんです。そこで詠んだ歌が……「ぬき乱る　人こそあるらし　白玉の　まなくも散るか　袖のせばきに」。', '在原业平一行人特地从京都跑来看这道瀑布。在这儿咏的歌是……「是谁扯断了串珠的线／白玉不停地散落／我的袖子太窄／接也接不住」。', 'Ariwara no Narihira and his party come all the way from Kyoto to see these falls. The poem he makes there is... "Someone, it seems, has broken the string, and the white jewels scatter without pause: my sleeves are too narrow to catch them."',
      [{ jp: '白玉', reading: 'しらたま', zh: '白玉；珍珠', en: 'white jewel / pearl' }, { jp: '袖', reading: 'そで', zh: '袖子', en: 'sleeve' }]),
    say(R, 'casual', 'neutral', '水しぶきを、糸の切れた真珠に見立てているんです。……千年以上前の人が、同じ水を見て、同じように「きれいだ」と思った。それが、少し不思議で。', '他把水花比作断了线的珍珠。……一千多年前的人，看着同一道水，和我们一样觉得「好美」。这件事，让我觉得有点不可思议。', 'He likens the spray to pearls off a broken string. ...Someone over a thousand years ago looked at the same water and thought, as we do, how beautiful. I find that a little strange.'),
    { type: 'branch', ifFlag: 'nunobiki_hiked',
      then: [choice('你是爬山上来的，见过那道瀑布。', 'You have climbed up and seen those falls.', [
        { id: 'nb_r_seen', zh: '「見たよ。本当に、真珠みたいだった。」', en: '"I saw it. It really did look like pearls."', jp: '見たよ。本当に、真珠みたいだった。', hintZh: '你是走上来的', hintEn: 'You walked up',
          char: R, aff: 6, fam: 6, stat: 'charm',
          then: [say(R, 'casual', 'happy', '……ふふ。じゃあ、あなたも業平と同じものを見たんですね。……少し、うらやましいです。私は、ロープウェイで来てしまったので。', '……呵呵。那你和业平看到了同样的东西呢。……有点羡慕。我是坐缆车上来的。', '...Heh. Then you saw the same thing Narihira did. ...I am a little jealous. I came up on the ropeway.')] },
        { id: 'nb_r_sleeve', zh: '「袖が狭いって、どういう意味？」', en: '"What does it mean, the sleeves are too narrow?"', jp: '袖が狭いって、どういう意味？', hintZh: '认真问', hintEn: 'Ask in earnest',
          char: R, aff: 4, fam: 8, stat: 'knowledge',
          then: [say(R, 'casual', 'shy', '袖で涙を受けることを、昔は「袖を濡らす」と言いました。……美しいものが多すぎて、受け止めきれない。泣くほど、という意味だと、私は読んでいます。', '古时候用袖子接眼泪，叫「湿了袖子」。……美的东西太多，接也接不住。多到想哭——我是这么读的。', 'In old poems, catching tears in your sleeve was "wetting the sleeve". ...So much beauty that you cannot hold it all. Enough to cry. That is how I read it.')] }
      ])],
      otherwise: [choice('你是坐缆车上来的，只在上面看过那道白线。', 'You came up by ropeway and only saw the falls as a white thread from above.', [
        { id: 'nb_r_together', zh: '「今度、一緒に歩いて見に行こうか。」', en: '"Shall we walk down and see it together some time?"', jp: '今度、一緒に歩いて見に行こうか。', hintZh: '邀她', hintEn: 'Invite her',
          char: R, aff: 7, fam: 4, stat: 'guts',
          then: [say(R, 'casual', 'shy', '……一緒に、ですか。……はい。運動靴、ちゃんと履いてきます。', '……一起，吗。……好。我会好好穿运动鞋来的。', '...Together? ...Yes. I will wear proper trainers.')] },
        { id: 'nb_r_read', zh: '「もう一回、読んでくれる？」', en: '"Will you read it once more?"', jp: 'もう一回、読んでくれる？', hintZh: '听她念', hintEn: 'Listen to her read',
          char: R, aff: 5, fam: 6, stat: 'proficiency',
          then: [nar('她清了清嗓子，又念了一遍。念得很慢，每个音都放在该放的地方。你没全听懂，但你听见了水声。', 'She clears her throat and reads it again, slowly, every sound placed where it belongs. You do not understand all of it, but you hear water.', outfitImg(R, 'casual', 'neutral'))] }
      ])]
    } as StoryNode,
    nar('她合上书，夹进去一片刚才掉在长椅上的薄荷叶当书签。', 'She closes the book, marking the page with a mint leaf that had fallen onto the bench.'),
    end(R, 3, 4, '布引的长椅和那首歌', 'The bench at Nunobiki and that poem')
  ]
};

// ==========================================================
// 稻荷：瀑布前（梦一样、说不清；只有走过山路的人才碰得到）
// ==========================================================
const EV_INARI: MapEventDef = {
  id: 'ev_nunobiki_inari', locationId: NUNOBIKI_ID, chars: [I], priority: 9, timeSlots: ['morning', 'afternoon'],
  titleZh: '同一道水', titleEn: 'The Same Water',
  // 事件是出门时就挑好的，那时还没选怎么上山——所以门槛只看"走过一次山路没有"，
  // 这一趟是怎么上来的，在剧本里用 branch 分开
  requiresFlags: ['ev_nunobiki_first', 'nunobiki_hiked'], minFamiliarity: { [I]: 60 },
  script: [
    { type: 'branch', ifFlag: 'nunobiki_now_hike',
      then: [
        scene('nunobiki_falls', '布引の滝', 'Nunobiki Falls', '回程 · 雄滝前', 'On the way back · Before the male fall'),
        nar('下山的时候你又经过了瀑布。潭边的石头上坐着一个人，橘红色的长发垂到水面，脚丫浸在冰凉的水里晃。', 'On the way down you pass the falls again. Someone sits on a rock by the pool, long orange-red hair trailing to the water, bare feet swinging in the cold.'),
        say(I, 'casual', 'happy', 'おや、そなたか。……ふふ、足で登ってくる者は久しぶりに見たぞ。この頃は皆、空の箱に乗っていってしまうからの。', '哎呀，是你。……呵呵，好久没看见用脚爬上来的人了。最近的人全都坐那个天上的箱子走了。', 'Oh, it is you. ...Heh, I have not seen anyone climb up on foot in a while. These days everyone rides the box in the sky.')
      ],
      otherwise: [
        scene(NUNOBIKI_ID, '布引香草园', 'Nunobiki Herb Garden', '山顶', 'The top'),
        say(I, 'casual', 'pout', 'なんじゃ、空の箱で来おったのか。滝の前で待っておったのに。……ほれ、帰りは歩くぞ。', '什么嘛，坐天上的箱子来的啊。我还在瀑布前面等你呢。……喏，回去用走的。', 'What, you came in the box in the sky? And I was waiting by the falls. ...Come on, we walk back.'),
        scene('nunobiki_falls', '布引の滝', 'Nunobiki Falls', '回程 · 雄滝前', 'On the way back · Before the male fall'),
        nar('她一路跳着石阶下山，在瀑布前的石头上坐下，把脚丫浸进冰凉的潭水里晃。', 'She hops down the stone steps all the way and sits on a rock before the falls, swinging her bare feet in the cold pool.')
      ]
    } as StoryNode,
    nar('她看着瀑布，眼睛眯起来，像是在看一个很远的地方。', 'She looks at the falls with narrowed eyes, as if at somewhere very far away.', outfitImg(I, 'casual', 'neutral')),
    say(I, 'casual', 'neutral', '昔の。……昔の、ことじゃ。都から、雅な者たちが馬で来ての。滝の前で、誰の歌が一番か、などと言い合うておった。……一人、泣きそうな顔で詠む男がおってな。', '从前的。……从前的事啦。从京城来了一群风雅的人，骑着马。在瀑布前面争谁的歌最好。……有一个男的，咏歌的时候一副快哭的样子。', 'Long ago. ...A long time ago. Elegant people came on horseback from the capital and argued in front of the falls over whose poem was best. ...There was one man who recited looking as if he might cry.'),
    say(I, 'casual', 'sad', '……あれは、本当に見たのか、それとも誰かに聞いた話を、見たと思うておるだけか。千年もおると、そこのところが、だんだん、ぼやけての。', '……那是我真的看见过，还是听谁讲过、就以为自己看见过？待了一千年，这个地方，就会慢慢变得模模糊糊的。', '...Did I really see that, or did I hear someone tell it and come to think I saw it? After a thousand years, that part grows blurry, little by little.'),
    choice('水声很大。她没有看你。', 'The water is loud. She is not looking at you.', [
      { id: 'nb_i_now', zh: '「今日のことは、ぼやけないように覚えておくよ。」', en: '"I will remember today so it does not blur."', jp: '今日のことは、ぼやけないように覚えておくよ。', hintZh: '替她记着', hintEn: 'Remember it for her',
        char: I, aff: 8, fam: 4, stat: 'kindness', words: [{ jp: '覚える', reading: 'おぼえる', zh: '记住', en: 'to remember' }],
        then: [say(I, 'casual', 'surprised', '……そなたが？ 百年もせぬうちに、そなたの方が先にいなくなるくせに。', '……你？明明不到一百年，先不在了的会是你。', '...You? You will be gone first, before a hundred years are out.'),
          nar('她这么说着，却把脚从水里收了回来，往你这边挪了一点。', 'She says it, yet draws her feet out of the water and shifts a little closer to you.', outfitImg(I, 'casual', 'shy'))] },
      { id: 'nb_i_feet', zh: '脱了鞋，也把脚伸进水里', en: 'Take off your shoes and put your feet in too', hintZh: '冷', hintEn: 'Cold',
        char: I, aff: 5, fam: 8, stat: 'guts',
        then: [nar('水冷得你倒吸一口气。她看着你的脸，笑得前仰后合，九条尾巴的影子在水面上乱晃了一阵。', 'The cold makes you gasp. She looks at your face and doubles over laughing, the shadows of nine tails jostling on the water.'),
          say(I, 'casual', 'happy', 'これは、ぼやけぬわ。千年経っても、そなたのその顔は覚えておる。', '这个可模糊不了。再过一千年，你这张脸我也记得。', 'This will not blur. A thousand years on, I will still remember that face of yours.')] }
    ]),
    nar('回过神来，石头上只剩下一圈湿湿的脚印。山路上方，有一片不合季节的枫叶慢慢落进潭里。', 'When you come back to yourself, only a ring of wet footprints is left on the rock. Above the path, an out-of-season maple leaf drifts slowly down into the pool.'),
    end(I, 4, 3, '布引瀑布前的那一会儿', 'That moment before the Nunobiki falls')
  ]
};

// ==========================================================
// 金城：他是跑上来的
// ==========================================================
const EV_KAI: MapEventDef = {
  id: 'ev_nunobiki_kai', locationId: NUNOBIKI_ID, chars: [], priority: 7, timeSlots: ['morning', 'afternoon'],
  titleZh: '山顶见', titleEn: 'See You at the Top',
  requiresFlags: ['ev_nunobiki_first', 'rival_ch2_done'],
  script: [
    scene(NUNOBIKI_ID, '布引香草园', 'Nunobiki Herb Garden', '山顶 · 观景台', 'The top · The lookout'),
    nar('观景台的栏杆上搭着一件橄榄绿的外套。外套的主人躺在旁边的草坡上，胸口一起一伏，汗把T恤浸成了深色。', 'An olive-green jacket is slung over the lookout rail. Its owner lies on the grassy slope beside it, chest heaving, T-shirt dark with sweat.'),
    kai('surprised', '……お前かよ。何しに来たん。', '……是你啊。来干嘛的。', '...You? What are you doing up here?'),
    kai('smug', '俺？ トレーニング。新神戸から走って、二十二分。ロープウェイより速いで、たぶん。', '我？训练。从新神户跑上来，二十二分钟。大概比缆车快。', 'Me? Training. Ran up from Shin-Kobe. Twenty-two minutes. Faster than the ropeway, probably.'),
    { type: 'branch', ifFlag: 'nunobiki_now_hike',
      then: [
        nar('他看了一眼你湿透的衬衫，眉毛挑了一下。', 'He glances at your soaked shirt and raises an eyebrow.'),
        kai('happy', '……へえ。お前も歩いて来たんや。滝、見た？ ……ほな、次は一緒に下から走ろか。どっちが先に着くか。', '……嘿。你也是走上来的啊。瀑布看了吗？……那下次一起从山脚跑。看谁先到。', '...Huh. You walked up too. See the falls? ...Then next time we run it together from the bottom. First one to the top.'),
        choice('他伸出拳头。', 'He holds out a fist.', [
          { id: 'nb_k_race', zh: '「負けないからな。」碰拳', en: '"I won\'t lose." Bump fists', jp: '負けないからな。', hintZh: '接下挑战', hintEn: 'Accept', stat: 'guts', setFlags: ['nunobiki_kai_race'],
            then: [kai('laugh', 'ははっ。ええやん。その顔、試験の時よりマシやで。', '哈哈。不错嘛。这张脸，比考试那时候像样多了。', 'Ha! Good. That face is better than the one you had at exam time.')] },
          { id: 'nb_k_falls', zh: '「走ったら、滝が見えないだろ。」', en: '"If you run, you can\'t see the falls."', jp: '走ったら、滝が見えないだろ。', hintZh: '换个角度', hintEn: 'Another way of looking', stat: 'kindness',
            then: [kai('thinking', '……。……せやな。二十二分の間、一回も見てへんわ。', '……。……也是。这二十二分钟里，我一次都没看过。', '...... ...Fair. Twenty-two minutes and I didn\'t look at it once.'),
              nar('他坐起来，看着山下的城市，过了很久才说：「次は、歩いてみるわ。」', 'He sits up and looks at the city below, and after a long while says: next time, I will try walking.')] }
        ])
      ],
      otherwise: [
        kai('smug', '……で、お前はロープウェイ？ ……ええねん、別に。俺が勝っただけやし。', '……你呢，坐缆车上来的？……没事，无所谓。只是我赢了而已。', '...And you took the ropeway? ...That is fine. Just means I won.'),
        choice('他笑得很得意。', 'He grins, very pleased with himself.', [
          { id: 'nb_k_next', zh: '「次は歩いて来る。で、お前より先に着く。」', en: '"Next time I walk. And get here before you."', jp: '次は歩いて来る。で、お前より先に着く。', hintZh: '不服', hintEn: 'Not having it', stat: 'guts',
            then: [kai('laugh', '言うたな？ 覚えとくで。', '你说的哦？我记住了。', 'You said it. I am holding you to that.')] },
          { id: 'nb_k_view', zh: '「でも、上から見る神戸、きれいだったよ。」', en: '"But Kobe from the gondola was beautiful."', jp: 'でも、上から見る神戸、きれいだったよ。', hintZh: '各有各的', hintEn: 'Each to their own', stat: 'charm',
            then: [kai('neutral', '……ふーん。俺、乗ったことないわ。千円ちょい、もったいない思て。', '……哼。我没坐过。一千出头，舍不得。', '...Huh. I have never ridden it. A thousand-odd yen. Felt like a waste.'),
              nar('他说这话的时候看着天上的缆车，看了挺久。', 'As he says it, he watches a gondola crossing overhead, for quite a while.')] }
        ])
      ]
    } as StoryNode,
    nar('他把外套搭到肩上，从草坡上跳下来。「ほな、また学校で。」说完就往山路那边跑了，跑出去十米又回头喊了一句：「水、ちゃんと飲めよ！」',
      'He throws the jacket over his shoulder and hops down the slope. "See you at school." He runs off toward the trail, then turns ten metres on and shouts back: drink some water, properly!'),
    { type: 'effect', effects: [{ stat: 'guts', amount: 2, reasonZh: '在布引的山顶碰到了金城', reasonEn: 'Running into Kinjo at the top of Nunobiki' }] }
  ]
};

export const NUNOBIKI_EVENTS: MapEventDef[] = [EV_FIRST, EV_MIYUKI, EV_REI, EV_INARI, EV_KAI];
