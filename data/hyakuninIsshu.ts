// ==========================================================
// 🎴 小倉百人一首（节选）：「上の句」念出来，选对「下の句」
//
// 全部是公版古典和歌。读音按现代假名标注（ゐ/ゑ 等都已改成现代写法），
// 译文是意译，目的是让玩家读懂意境，不是逐字对译。
// ==========================================================

export interface Poem {
  id: string;
  author: string;       // 作者（日语）
  kami: string;         // 上の句（前三句）
  kamiR: string;        // 读音
  shimo: string;        // 下の句（后两句）
  shimoR: string;
  zh: string; en: string;   // 整首的意思
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'love' | 'travel';
}

export const POEMS: Poem[] = [
  { id: 'tenji', author: '天智天皇', kami: '秋の田の かりほの庵の 苫をあらみ', kamiR: 'あきのたの かりほのいおの とまをあらみ',
    shimo: 'わが衣手は 露にぬれつつ', shimoR: 'わがころもでは つゆにぬれつつ',
    zh: '秋天田边的临时小屋，草席编得稀疏，我的衣袖被露水一点点打湿。', en: 'In the harvest hut by the autumn field the thatch is loose, and my sleeves keep getting wet with dew.', season: 'autumn' },
  { id: 'jito', author: '持統天皇', kami: '春すぎて 夏来にけらし 白妙の', kamiR: 'はるすぎて なつきにけらし しろたえの',
    shimo: '衣ほすてふ 天の香具山', shimoR: 'ころもほすちょう あまのかぐやま',
    zh: '春天过去，夏天好像来了——香具山上晒着洁白的衣裳。', en: 'Spring has passed and summer seems to have come: white robes are drying on Mount Kagu.', season: 'summer' },
  { id: 'akahito', author: '山部赤人', kami: '田子の浦に うち出でてみれば 白妙の', kamiR: 'たごのうらに うちいでてみれば しろたえの',
    shimo: '富士の高嶺に 雪は降りつつ', shimoR: 'ふじのたかねに ゆきはふりつつ',
    zh: '走到田子浦的海滩上远望，富士山的高峰上，雪正纷纷落着。', en: 'Out on Tago Bay I look up: snow keeps falling on the lofty peak of Fuji.', season: 'winter' },
  { id: 'nakamaro', author: '阿倍仲麿', kami: '天の原 ふりさけ見れば 春日なる', kamiR: 'あまのはら ふりさけみれば かすがなる',
    shimo: '三笠の山に 出でし月かも', shimoR: 'みかさのやまに いでしつきかも',
    zh: '仰望天空，那轮月亮，是不是就是从故乡春日三笠山上升起的那一轮？', en: 'Gazing up at the sky — is that the same moon that rose over Mount Mikasa at Kasuga?', season: 'travel' },
  { id: 'komachi', author: '小野小町', kami: '花の色は うつりにけりな いたづらに', kamiR: 'はなのいろは うつりにけりな いたずらに',
    shimo: 'わが身世にふる ながめせしまに', shimoR: 'わがみよにふる ながめせしまに',
    zh: '花的颜色白白地褪了，就像我在长雨与出神之间，虚度了容颜。', en: 'The flowers have faded in vain, as I gazed at the long rain and let my own beauty slip away.', season: 'spring' },
  { id: 'semimaru', author: '蝉丸', kami: 'これやこの 行くも帰るも 別れては', kamiR: 'これやこの ゆくもかえるも わかれては',
    shimo: '知るも知らぬも 逢坂の関', shimoR: 'しるもしらぬも おうさかのせき',
    zh: '这就是那座逢坂关啊：去的人、回的人，相识的、不相识的，在此相遇又别离。', en: 'So this is Osaka Barrier: travellers coming and going, friends and strangers, meet and part here.', season: 'travel' },
  { id: 'sutoku', author: '崇徳院', kami: '瀬をはやみ 岩にせかるる 滝川の', kamiR: 'せをはやみ いわにせかるる たきがわの',
    shimo: 'われても末に 逢はむとぞ思ふ', shimoR: 'われてもすえに あわんとぞおもう',
    zh: '急流被岩石拦开，但终究会在下游重新汇合——我们也一定会再相逢。', en: 'A rapid river split by a rock still joins again downstream; so shall we meet again.', season: 'love' },
  { id: 'narihira', author: '在原業平', kami: 'ちはやぶる 神代もきかず 竜田川', kamiR: 'ちはやぶる かみよもきかず たつたがわ',
    shimo: 'からくれなゐに 水くくるとは', shimoR: 'からくれないに みずくくるとは',
    zh: '连神明的时代都没听过——竜田川的水，被染成深红的绞染。', en: 'Not even in the age of the gods: Tatsuta River dyed deep crimson with leaves.', season: 'autumn' },
  { id: 'koko', author: '光孝天皇', kami: '君がため 春の野に出でて 若菜つむ', kamiR: 'きみがため はるののにいでて わかなつむ',
    shimo: 'わが衣手に 雪は降りつつ', shimoR: 'わがころもでに ゆきはふりつつ',
    zh: '为了你，我走进春天的原野采摘嫩菜，雪还在我的衣袖上飘落。', en: 'For your sake I went out to pick young greens, while snow kept falling on my sleeves.', season: 'spring' },
  { id: 'sarumaru', author: '猿丸大夫', kami: '奥山に 紅葉ふみわけ 鳴く鹿の', kamiR: 'おくやまに もみじふみわけ なくしかの',
    shimo: '声きく時ぞ 秋は悲しき', shimoR: 'こえきくときぞ あきはかなしき',
    zh: '深山里，鹿踏着红叶鸣叫——听到那声音时，才真正觉得秋天悲伤。', en: 'Deep in the hills a stag cries, trampling red leaves; hearing it, autumn feels truly sad.', season: 'autumn' },
  { id: 'chisato', author: '大江千里', kami: '月みれば ちぢに物こそ 悲しけれ', kamiR: 'つきみれば ちぢにものこそ かなしけれ',
    shimo: 'わが身一つの 秋にはあらねど', shimoR: 'わがみひとつの あきにはあらねど',
    zh: '看着月亮，百感交集地悲伤——明明秋天并不只属于我一个人。', en: 'Looking at the moon, a hundred sorrows rise — though autumn does not come for me alone.', season: 'autumn' },
  { id: 'tsurayuki', author: '紀貫之', kami: '人はいさ 心も知らず ふるさとは', kamiR: 'ひとはいさ こころもしらず ふるさとは',
    shimo: '花ぞ昔の 香ににほひける', shimoR: 'はなぞむかしの かににおいける',
    zh: '人心如何我不知道，但故乡的花，依旧散发着从前的香气。', en: 'Who knows if people have changed? In my old home the blossoms still smell as they used to.', season: 'spring' },
  { id: 'shikishi', author: '式子内親王', kami: '玉の緒よ 絶えなば絶えね ながらへば', kamiR: 'たまのおよ たえなばたえね ながらえば',
    shimo: '忍ぶることの 弱りもぞする', shimoR: 'しのぶることの よわりもぞする',
    zh: '生命啊，要断就断吧——活得太久，我藏在心里的恋情恐怕要藏不住了。', en: 'O thread of life, snap if you must; live on, and I may lose the strength to hide my love.', season: 'love' },
  { id: 'kanemori', author: '平兼盛', kami: 'しのぶれど 色に出でにけり わが恋は', kamiR: 'しのぶれど いろにいでにけり わがこいは',
    shimo: 'ものや思ふと 人の問ふまで', shimoR: 'ものやおもうと ひとのとうまで',
    zh: '拼命藏着，恋情还是写在了脸上——连别人都问我：是不是有心事？', en: 'I hid it, yet my love showed on my face until people asked, "Is something on your mind?"', season: 'love' },
  { id: 'tadami', author: '壬生忠見', kami: '恋すてふ わが名はまだき 立ちにけり', kamiR: 'こいすちょう わがなはまだき たちにけり',
    shimo: '人知れずこそ 思ひそめしか', shimoR: 'ひとしれずこそ おもいそめしか',
    zh: '我恋爱的传闻这么快就传开了——明明我才刚刚偷偷地开始想念。', en: 'Word is already out that I am in love — and I had only just begun, in secret.', season: 'love' },
  { id: 'atsutada', author: '権中納言敦忠', kami: 'あひ見ての のちの心に くらぶれば', kamiR: 'あいみての のちのこころに くらぶれば',
    shimo: '昔はものを 思はざりけり', shimoR: 'むかしはものを おもわざりけり',
    zh: '与你相见之后的心情，相比之下，从前的思念根本算不得什么。', en: 'Compared with how I feel after meeting you, the longing I felt before was nothing at all.', season: 'love' },
  { id: 'korenori', author: '坂上是則', kami: '朝ぼらけ 有明の月と 見るまでに', kamiR: 'あさぼらけ ありあけのつきと みるまでに',
    shimo: '吉野の里に 降れる白雪', shimoR: 'よしののさとに ふれるしらゆき',
    zh: '天刚蒙蒙亮，我还以为那是残月的光——原来是吉野的村里落下的白雪。', en: 'In the dawn light I mistook it for the lingering moon: it was snow on the village of Yoshino.', season: 'winter' },
  { id: 'tsuraki', author: '春道列樹', kami: '山川に 風のかけたる しがらみは', kamiR: 'やまがわに かぜのかけたる しがらみは',
    shimo: '流れもあへぬ 紅葉なりけり', shimoR: 'ながれもあえぬ もみじなりけり',
    zh: '山涧里风搭起的“栅栏”，原来是流不动的红叶。', en: 'The weir the wind has built in the mountain stream is only red leaves that cannot drift on.', season: 'autumn' },
  { id: 'mitsune', author: '凡河内躬恒', kami: '心あてに 折らばや折らむ 初霜の', kamiR: 'こころあてに おらばやおらん はつしもの',
    shimo: 'おきまどはせる 白菊の花', shimoR: 'おきまどわせる しらぎくのはな',
    zh: '初霜与白菊分不清——要摘，就只能凭感觉去摘了。', en: 'The first frost and white chrysanthemums blur together; if I pick, I must pick by guess.', season: 'autumn' },
  { id: 'sanetada', author: '後徳大寺左大臣', kami: 'ほととぎす 鳴きつる方を ながむれば', kamiR: 'ほととぎす なきつるかたを ながむれば',
    shimo: 'ただ有明の 月ぞ残れる', shimoR: 'ただありあけの つきぞのこれる',
    zh: '杜鹃的叫声传来，我望向那个方向——只剩下黎明的残月挂在天上。', en: 'I look toward where the cuckoo called: only the dawn moon is left in the sky.', season: 'summer' },
  { id: 'akisuke', author: '左京大夫顕輔', kami: '秋風に たなびく雲の 絶え間より', kamiR: 'あきかぜに たなびくくもの たえまより',
    shimo: 'もれ出づる月の 影のさやけさ', shimoR: 'もれいづるつきの かげのさやけさ',
    zh: '秋风吹散的云缝之间，漏下来的月光，多么澄澈。', en: 'Through a gap in clouds drawn out by the autumn wind, how clear the moonlight that leaks through.', season: 'autumn' },
  { id: 'noin', author: '能因法師', kami: '嵐吹く 三室の山の もみぢ葉は', kamiR: 'あらしふく みむろのやまの もみじばは',
    shimo: '竜田の川の 錦なりけり', shimoR: 'たつたのかわの にしきなりけり',
    zh: '三室山被风吹落的红叶，铺在竜田川上，成了一匹锦缎。', en: 'The red leaves blown from Mount Mimuro lie on Tatsuta River like brocade.', season: 'autumn' },
  { id: 'ryozen', author: '良暹法師', kami: '寂しさに 宿を立ち出でて ながむれば', kamiR: 'さびしさに やどをたちいでて ながむれば',
    shimo: 'いづこも同じ 秋の夕暮れ', shimoR: 'いずこもおなじ あきのゆうぐれ',
    zh: '寂寞得走出屋子眺望——不管哪里，都是同样的秋日黄昏。', en: 'Lonely, I step outside and look around: everywhere it is the same autumn dusk.', season: 'autumn' },
  { id: 'tsunenobu', author: '大納言経信', kami: '夕されば 門田の稲葉 おとづれて', kamiR: 'ゆうされば かどたのいなば おとずれて',
    shimo: '芦のまろ屋に 秋風ぞ吹く', shimoR: 'あしのまろやに あきかぜぞふく',
    zh: '到了傍晚，门前稻田的叶子沙沙作响，秋风也吹进了芦苇小屋。', en: 'At dusk the rice leaves rustle by the gate, and autumn wind blows into the reed-thatched hut.', season: 'autumn' },
  { id: 'teika', author: '権中納言定家', kami: '来ぬ人を まつほの浦の 夕なぎに', kamiR: 'こぬひとを まつほのうらの ゆうなぎに',
    shimo: '焼くやもしほの 身もこがれつつ', shimoR: 'やくやもしおの みもこがれつつ',
    zh: '在松帆浦的傍晚无风之时，等着不来的人——我的身心就像烧盐的火一样焦灼。', en: 'In the evening calm at Matsuho Bay I wait for one who does not come, burning like the salt fires.', season: 'love' },
  { id: 'kanemasa', author: '源兼昌', kami: '淡路島 通ふ千鳥の 鳴く声に', kamiR: 'あわじしま かようちどりの なくこえに',
    shimo: '幾夜寝覚めぬ 須磨の関守', shimoR: 'いくよねざめぬ すまのせきもり',
    zh: '往来于淡路岛的千鸟啼声，让须磨关的守关人，多少个夜晚被惊醒。', en: 'The cries of plovers flying to Awaji have woken the keeper of Suma Barrier, how many nights now?', season: 'travel' },
  { id: 'daini', author: '大弐三位', kami: '有馬山 猪名の笹原 風吹けば', kamiR: 'ありまやま いなのささはら かぜふけば',
    shimo: 'いでそよ人を 忘れやはする', shimoR: 'いでそよひとを わすれやはする',
    zh: '有马山、猪名的竹原，风一吹就沙沙响——是啊，我怎么会忘记你呢。', en: 'Wind rustles the bamboo of Mount Arima and Ina: yes, how could I ever forget you?', season: 'love' },
  { id: 'koka', author: '皇嘉門院別当', kami: '難波江の 蘆のかりねの ひとよゆゑ', kamiR: 'なにわえの あしのかりねの ひとよゆえ',
    shimo: 'みをつくしてや 恋ひわたるべき', shimoR: 'みをつくしてや こいわたるべき',
    zh: '难波江芦苇丛里一夜的萍水相逢，就要让我用尽一生去思念吗？', en: 'One night\'s rest among the reeds of Naniwa — must I spend my whole life pining for it?', season: 'love' },
  { id: 'ise', author: '伊勢', kami: '難波潟 短き葦の ふしの間も', kamiR: 'なにわがた みじかきあしの ふしのまも',
    shimo: '逢はでこの世を 過ぐしてよとや', shimoR: 'あわでこのよを すぐしてよとや',
    zh: '连芦苇短短一节那么短的时间都不能相见，你是要我就这样过完一生吗？', en: 'Not even for the length of a reed joint on Naniwa shore — must I live out my life without meeting you?', season: 'love' },
  { id: 'fukayabu', author: '清原深養父', kami: '夏の夜は まだ宵ながら 明けぬるを', kamiR: 'なつのよは まだよいながら あけぬるを',
    shimo: '雲のいづこに 月やどるらむ', shimoR: 'くものいずこに つきやどるらん',
    zh: '夏夜短得天还没黑透就亮了，月亮会躲在云的哪个角落过夜呢？', en: 'The summer night dawns while it still feels like evening — where in the clouds is the moon lodging?', season: 'summer' },
  { id: 'tomonori', author: '紀友則', kami: 'ひさかたの 光のどけき 春の日に', kamiR: 'ひさかたの ひかりのどけき はるのひに',
    shimo: 'しづ心なく 花の散るらむ', shimoR: 'しずごころなく はなのちるらん',
    zh: '阳光这么温柔的春日里，花为什么这样静不下心地凋落呢？', en: 'On a spring day of such gentle light, why do the blossoms scatter so restlessly?', season: 'spring' },
  { id: 'mibu', author: '壬生忠岑', kami: '有明の つれなく見えし 別れより', kamiR: 'ありあけの つれなくみえし わかれより',
    shimo: 'あかつきばかり 憂きものはなし', shimoR: 'あかつきばかり うきものはなし',
    zh: '自从那个冷淡的黎明残月下的离别，我觉得再没有什么比黎明更让人难过。', en: 'Since that parting under the cold dawn moon, nothing has seemed so bleak as daybreak.', season: 'love' },
  { id: 'takamura', author: '参議篁', kami: 'わたの原 八十島かけて 漕ぎ出でぬと', kamiR: 'わたのはら やそしまかけて こぎいでぬと',
    shimo: '人には告げよ 海人の釣舟', shimoR: 'ひとにはつげよ あまのつりぶね',
    zh: '请告诉家乡的人，我已向着无数岛屿划船出海了——渔夫的钓船啊。', en: 'Tell the people at home I have rowed out among the countless isles, O fishing boat.', season: 'travel' },
  { id: 'motosuke', author: '清原元輔', kami: '契りきな かたみに袖を しぼりつつ', kamiR: 'ちぎりきな かたみにそでを しぼりつつ',
    shimo: '末の松山 波越さじとは', shimoR: 'すえのまつやま なみこさじとは',
    zh: '我们曾含泪互相发誓：就像末松山不会被浪淹没，我们的心也永不变。', en: 'We swore, wringing out each other\'s tear-soaked sleeves, that waves would never top Sue-no-Matsuyama.', season: 'love' }
];

const shuffle = <T,>(a: T[]): T[] => {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

// 一道题：念上の句，四张下の句里选一张。
// 干扰项：初级随便取；中高级优先取同季节 / 同主题的，更容易混淆。
export interface PoemQuestion { poem: Poem; options: Poem[]; answer: number; }

export const buildPoemQuestions = (n: number, tier: 1 | 2 | 3, avoid: string[] = []): PoemQuestion[] => {
  const fresh = POEMS.filter(p => !avoid.includes(p.id));
  const pool = shuffle(fresh.length >= n ? fresh : POEMS).slice(0, n);
  return pool.map(poem => {
    const others = POEMS.filter(p => p.id !== poem.id);
    const similar = shuffle(others.filter(p => p.season && p.season === poem.season));
    const rest = shuffle(others.filter(p => p.season !== poem.season));
    const distract = (tier === 1 ? shuffle(others) : [...similar, ...rest]).slice(0, 3);
    const options = shuffle([poem, ...distract]);
    return { poem, options, answer: options.findIndex(o => o.id === poem.id) };
  });
};
