import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 稻荷 · 第④段「空の箱」 / 第⑤段「なぞる日」
//
// 【③之后还剩什么】
// ③：相爱线她把自己的名字写进了帐，只有第一个日期，从那天起开始数；
//    挚友线她用铅笔写了你的名字——铅笔能擦，所以"不擦"是她每年要做的决定。
// 她搬到了"纸的那一边"。但她还没有从人的高度、人的速度看过这座城市。
//
// ④：布引。她一向是走山路上来的（第一次在瀑布前碰到你的时候也是）。
//    这一次她在山顶等你，说要坐"天上的箱子"下山——一千年里第一次坐进会飞的机器。
//    吊厢里她第一次从上面看神户：哪里以前是海、哪里烧过两次、哪里是她数过的那棵树。
//    「人の時間は、上から見ると、こんなに速いのか」——
//    相爱线：她说"速一点也不坏"，因为她现在也在这个速度里了。
//    挚友线：她说"那就每年都来看一次，看它又变了多少"。
// ⑤：生田神社，清晨。帐的最后一页。
//    相爱线：她请你用圆珠笔（墨水，擦不掉）把你的名字写在她旁边——两个人都在纸的这一边。
//    挚友线：你的铅笔名字她描了第一遍，然后她在旁边用铅笔写了自己的名字，
//            把笔递给你：「わらわのも、毎年なぞってくれ」。描名字变成了互相的事。
//
// 【动画】④：缆车吊厢里，她贴着玻璃，九条尾巴炸开塞满了半个车厢，底下是夕阳里的城市。
//         ⑤：晨雾里的生田之森，她跪坐着用铅笔描帐上的名字，狐火在旁边浮着。
// ---------------------------------------------------------

const K = kit(CharacterId.INARI, 'bg-amber-500', '稻荷', 'Inari');
const { scene, nar, say, me, choice, fork, anime, done } = K;

export const INARI_STORY_4: StoryNode[] = [
  scene('nunobiki_herb_garden', '空の箱', 'The Box in the Sky', '傍晚 · 布引香草园', 'Early evening · Nunobiki Herb Garden', 'chat'),
  nar('薰衣草的花坛边上，有人坐在栏杆上晃着腿。橘红色的长发，九条尾巴懒洋洋地垂着。', 'By the lavender beds someone sits on the railing, swinging her legs. Long orange-red hair, nine tails hanging lazily.'),
  say('casual', 'happy', 'おお、来たか。待っておったぞ。', '哦，来了啊。我等你好久了。', 'Ah, there you are. I\'ve been waiting.'),
  nar('她是走山路上来的。她一直都是。一千年来，她从来没有坐过任何会离开地面的东西。', 'She came up on foot. She always does. In a thousand years she has never ridden anything that leaves the ground.'),
  say('casual', 'neutral', '今日はな、降りるのを、あの空の箱にしようと思うての。', '今天啊，我想下山的时候，坐那个天上的箱子。', 'Today I thought I\'d go down in that box in the sky.'),
  say('casual', 'pout', '……一人で乗るのは、その、なんじゃ。……つまらぬからな。', '……一个人坐的话，那个，怎么说呢。……没意思嘛。', '...Riding it alone would be, well. ...Dull.'),
  nar('她说"没意思"。你看见她的九条尾巴全都炸开了毛。', 'Dull, she says. You notice all nine of her tails have puffed up.'),
  choice('缆车站就在眼前。她的脚步越走越慢。', 'The ropeway station is right ahead. Her steps get slower and slower.', [
    { id: 'in4_scared', zh: '「もしかして、怖い？」', en: '"Are you scared, by any chance?"', jp: 'もしかして、怖い？', hintZh: '戳穿她', hintEn: 'Call her out',
      aff: 5, fam: 7, stat: 'guts',
      then: [say('casual', 'angry', 'こ、怖いものか！ 千年生きた神が、箱ひとつに……！', '才、才不怕！活了一千年的神，怎么会怕一个箱子……！', 'S-scared!? A god of a thousand years, afraid of one little box...!'), nar('她说完，尾巴缠住了你的手腕。缠得很紧。', 'As she says it, a tail wraps around your wrist. Tightly.')] },
    { id: 'in4_hand', zh: '黙って手を差し出す', en: 'Hold out your hand without a word', hintZh: '不说破', hintEn: 'Don\'t say it',
      aff: 7, fam: 4, stat: 'kindness',
      then: [nar('她看了你的手一眼，哼了一声，然后握住了。握得比初雪那天熟练。', 'She looks at your hand, sniffs, and takes it. More practised than on the day of the first snow.')] },
    { id: 'in4_window', zh: '「窓際、譲るよ。一番よく見えるところ。」', en: '"You take the window seat. Best view."', jp: '窓際、譲るよ。一番よく見えるところ。', hintZh: '让她看', hintEn: 'Let her see',
      aff: 6, fam: 6, stat: 'charm',
      then: [say('casual', 'surprised', '……一番よく見えるところは、一番怖いところではないのか。', '……看得最清楚的地方，不就是最可怕的地方吗。', '...Isn\'t the best view also the scariest spot?'), nar('她嘴上这么说，还是坐到了窗边。', 'She says it, and sits by the window anyway.')] }
  ]),
  scene('nunobiki_ropeway'),
  nar('吊厢的门关上，晃了一下，离开了站台。她倒吸一口气，整个人贴到了玻璃上。', 'The door closes, the cabin sways and leaves the platform. She gasps and presses herself flat against the glass.'),
  nar('脚底下是整个神户。夕阳把海染成了金色。', 'Below is the whole of Kobe. The setting sun has turned the sea gold.'),
  anime(4),
  say('casual', 'surprised', '……あそこは、昔、海じゃった。あの辺りは、田んぼじゃった。', '……那里，以前是海。那一带，以前是稻田。', '...That was sea, once. Around there were rice paddies.'),
  say('casual', 'neutral', 'あそこは二度焼けた。あの森のあの木は、わらわが数えた木じゃ。……上から見ると、ぜんぶ一度に見えるのじゃな。', '那边烧过两次。那片林子里的那棵树，是我数过的树。……从上面看，原来全都能一眼看见啊。', 'That part burned twice. That tree in that grove is the one I counted. ...From up here you can see it all at once.'),
  nar('她一千年都是站在地上，一棵树一棵树、一个人一个人地看。她从来没有从上面看过。', 'For a thousand years she has watched from the ground, one tree, one person at a time. She has never looked down on it.'),
  say('casual', 'sad', '……人の時間は、上から見ると、こんなに速いのか。', '……人的时间，从上面看，原来这么快啊。', '...So this is how fast human time looks from above.', [{ jp: '速い', reading: 'はやい', zh: '快', en: 'fast' }]),
  fork([
    nar('她沉默了一会儿。然后她把额头抵在玻璃上，笑了。', 'She is silent a while. Then she rests her forehead on the glass and laughs.'),
    say('casual', 'happy', '……じゃが、悪うない。わらわも今は、この速さの中におるのじゃからな。', '……不过，也不坏。毕竟我现在，也在这个速度里面了。', '...But it\'s not bad. I\'m inside this speed now too, after all.'),
    say('casual', 'shy', '数えておるぞ。そなたとの日。……速いぶん、一日一日がよう光る。', '我在数哦。和你在一起的日子。……越快，每一天就越亮。', 'I\'m counting, you know. Our days. ...The faster they go, the brighter each one shines.'),
    nar('吊厢落地之前，她的尾巴一直缠在你手腕上，没有松开过。', 'Until the cabin touches down, her tail stays wrapped around your wrist. It never lets go.')
  ], [
    say('casual', 'neutral', '……そうじゃ。毎年、ここに乗りに来るか。', '……对了。每年都来坐一次吧。', '...I know. Shall we ride this every year?'),
    say('casual', 'happy', 'そなたの名前をなぞるついでに。……一年で、この町がどれだけ変わるか、上から見てやるのじゃ。', '顺便描你的名字的时候。……从上面看看，这座城一年能变多少。', 'When I come to trace your name. ...We\'ll look down and see how much the town has changed in a year.'),
    nar('她把一年一次的约定，又多加了一项。描名字，坐缆车。都是要每年由她决定"要不要"的事。', 'She adds one more thing to the once-a-year promise. Trace the name, ride the ropeway. Both things she has to decide, every year, that she wants.')
  ]),
  done(4, 4, 4, '一千年里第一次从上面看', 'The first time in a thousand years she looked down')
];

export const INARI_STORY_5: StoryNode[] = [
  scene('ikuta_shrine', 'なぞる日', 'The Day of Tracing', '清晨 · 生田神社', 'Early morning · Ikuta Shrine', 'chat'),
  nar('清晨的生田神社。林子里的雾还没散，石板路是湿的。', 'Ikuta Shrine in the early morning. The mist has not left the grove yet; the flagstones are wet.'),
  nar('她跪坐在那棵她数过的树底下，帐摊开在膝上，翻到最后一页。', 'She kneels under the tree she once counted, the ledger open on her knees, turned to the last page.'),
  fork([
    nar('那一页上写着她自己的名字。下面只有一个日期——初雪那天。第二个日期的位置空着。', 'On that page is her own name. Beneath it, one date only: the day of the first snow. The space for a second date is empty.'),
    say('knit', 'neutral', '今朝な、ふと思うたのじゃ。この頁、わらわ一人の名前しかないのは、寂しいとな。', '今天早上，我突然想到。这一页上只有我一个人的名字，好寂寞。', 'This morning it struck me. This page has only my name on it, and that\'s lonely.'),
    nar('她从袖子里拿出一支圆珠笔，递给你。不是铅笔——墨水的，擦不掉的。', 'She takes a ballpoint pen from her sleeve and holds it out. Not a pencil. Ink. The kind that does not erase.'),
    say('knit', 'shy', 'そなたの名前、わらわの隣に書いてくれぬか。……この帳面の、こちら側に。', '你的名字，能写在我旁边吗。……写在这本帐的，这一边。', 'Will you write your name next to mine? ...On this side of the ledger.'),
    nar('一千年里，她把每一个名字都写在纸上，然后看着他们离开。现在她请你把名字写在她旁边——不是让她看着的那一边，是和她站在一起的那一边。', 'For a thousand years she wrote every name on paper and watched them leave. Now she asks you to write yours beside hers. Not on the side she watches. On the side she stands.')
  ], [
    nar('那一页上是你的名字，铅笔写的，已经淡了一点。', 'On that page is your name, in pencil, already a little faded.'),
    say('knit', 'neutral', '一年経っておらぬが、なぞりに来た。……思うたより薄うなるのが速うての。', '还没满一年，不过我来描了。……淡得比我想的快。', 'It hasn\'t been a year, but I came to trace it. ...It\'s fading faster than I thought.'),
    nar('你知道它为什么淡得快。她大概每天都来翻这一页，用手指摸。', 'You know why it fades so fast. She probably turns to this page every day and runs her finger over it.'),
    nar('她拿起铅笔，一笔一画地把你的名字描了一遍。很慢，很认真，像在写一个她第一次学会的字。', 'She picks up the pencil and traces your name stroke by stroke. Very slowly, very carefully, like a character she has only just learned.')
  ]),
  anime(5),
  choice('她写完，抬头看你。', 'Done, she looks up at you.', [
    { id: 'in5_write', zh: '「書くよ。」笔接过来', en: '"I\'ll write it." Take the pen', jp: '書くよ。', hintZh: '写', hintEn: 'Write',
      aff: 7, fam: 5, stat: 'kindness',
      then: [] },
    { id: 'in5_name', zh: '「稲荷の名前も、こっちに書いていい？」', en: '"Can I write your name on my side too?"', jp: '稲荷の名前も、こっちに書いていい？', hintZh: '反过来', hintEn: 'The other way round',
      aff: 6, fam: 6, stat: 'charm',
      then: [say('knit', 'surprised', '……そなたの、帳面にか？', '……写在你的，本子上？', '...In your book?'), nar('你拿出你的单词本。第一页是一年前写的「港」。她看着那个字，很久都没说话。', 'You take out your vocabulary notebook. On its first page, from a year ago: harbour. She looks at the character a long time without speaking.')] },
    { id: 'in5_count', zh: '「今日で、何日目？」', en: '"What day is it today?"', jp: '今日で、何日目？', hintZh: '问她数到哪儿了', hintEn: 'Ask how far she has counted',
      aff: 5, fam: 7, stat: 'knowledge',
      then: [nar('她毫不犹豫地报出了一个数字。连一秒都没想。', 'She gives you a number without the slightest hesitation. Not even a second.'), say('knit', 'happy', '……数えるのは、得意じゃからな。千年やっておる。', '……数数嘛，我很拿手。干了一千年了。', '...Counting is something I\'m good at. I\'ve been doing it a thousand years.')] }
  ]),
  fork([
    nar('你在她的名字旁边，用圆珠笔写下了自己的名字。墨水在湿的空气里洇开了一点。', 'Beside her name, in ballpoint, you write your own. The ink spreads a little in the damp air.'),
    say('knit', 'happy', '……これでよい。二人とも、こちら側じゃ。', '……这样就好。两个人，都在这一边了。', '...There. Now we\'re both on this side.'),
    nar('她把帐合上，抱在胸前。雾散了，第一缕阳光穿过树梢，照在石板路上。', 'She closes the ledger and holds it to her chest. The mist lifts; the first light of the sun comes through the branches onto the stones.')
  ], [
    nar('她把铅笔递给你。然后在你的名字旁边，用铅笔写下了她自己的名字。', 'She hands you the pencil. Then, beside your name, she writes her own. In pencil.'),
    say('knit', 'shy', 'わらわのも、毎年なぞってくれ。……なぞるのは、片方だけでは、不公平じゃからな。', '我的名字也一样，每年帮我描一遍。……描名字这件事，只有一个人做的话，不公平嘛。', 'Trace mine every year too. ...It\'s not fair if only one of us does the tracing.'),
    nar('铅笔能擦。所以每一年，你们都要各自决定一次"不擦"。', 'Pencil erases. So every year, each of you will have to decide, once, not to.'),
    nar('她把铅笔塞进你的口袋里，说：这支归你了。明年带着它来。', 'She tucks the pencil into your pocket. This one is yours now, she says. Bring it next year.')
  ]),
  done(5, 4, 4, '帐上并排的两个名字', 'Two names side by side in the ledger')
];
