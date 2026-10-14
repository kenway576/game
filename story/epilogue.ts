import { CharacterId, StoryNode, StoryFlags } from '../types';
import { kit } from './levelStories/_kit';
import type { MovieLine } from '../components/OpeningMovie';

// ---------------------------------------------------------
// 🌸 後日談（年终总结之后）
//
// 谁的后日谈：走完了第③段的人里，相爱结局优先，同类里好感度最高的那一个。
// 一个都没走完就没有后日谈（那一年的故事属于主线和每个人，不属于某一个人）。
//
// 结构：先是一小段剧本（一年后），然后是一分钟的动画——
// 8 个镜头、每个 8 秒（Veo 单次最长 8 秒），分镜在 scripts/op/sets/epilogue.mjs。
//
// 【第四面墙】
// 最后两个镜头里，她察觉到了镜头，转过来对着屏幕说话。
// 她说话的对象**不是主角**（主角是 {name}），是屏幕前选了这一年的那个人。
// 每个人打破的方式都是她自己的方式：明日香批改，光等对方先挥手，铃记录观测者，
// 空给座位编号，深雪问吃饭了没，奈绪添一条清单，真希不说杂鱼，稻荷说"帐外的人"。
// Veo 不出声音，所以台词是按时间叠在画面上的字幕（OpeningMovie 的 subtitles）。
// ---------------------------------------------------------

export const epilogueFlag = (c: CharacterId) => `epilogue_${c}_done`;

const ORDER: CharacterId[] = [
  CharacterId.ASUKA, CharacterId.HIKARI, CharacterId.REI, CharacterId.SORA,
  CharacterId.MIYUKI, CharacterId.NAO, CharacterId.MAKI, CharacterId.INARI
];

export const pickEpilogueHeroine = (flags: StoryFlags, affection: Partial<Record<CharacterId, number>>): CharacterId | null => {
  const done = ORDER.filter(c => flags[`${c}_story_3_done`]);
  if (!done.length) return null;
  const love = done.filter(c => flags[`${c}_ending_love`]);
  const pool = love.length ? love : done;
  return pool.slice().sort((a, b) => (affection[b] || 0) - (affection[a] || 0))[0];
};

// 动画最后两个镜头（49.2–65.2 秒）里的四句字幕
const L = (start: number, end: number, jp: string, zh: string, en: string): MovieLine => ({ start, end, jp, zh, en });
const four = (a: [string, string, string], b: [string, string, string], c: [string, string, string], d: [string, string, string]): MovieLine[] => [
  L(50.2, 53.6, ...a), L(53.8, 57.1, ...b), L(57.8, 61.2, ...c), L(61.4, 65.0, ...d)
];

export interface EpilogueDef { script: StoryNode[]; love: MovieLine[]; friend: MovieLine[] }

// ==========================================================
// 明日香
// ==========================================================
const AS = kit(CharacterId.ASUKA, 'bg-red-600', '明日香', 'Asuka');
const ASUKA: EpilogueDef = {
  script: [
    AS.scene('school_library', '後日談', 'Epilogue', '一年后 · 周四的图书室', 'A year later · The library on a Thursday', 'chat'),
    AS.nar('新学年。她三年级了。左臂上没有腕章。', 'A new school year. She is in her third year. No armband on her left arm.'),
    AS.nar('周四的图书室还是那张桌子。桌上有两支红笔——一支她的，一支你的。两本笔记本，互相批改得满满当当。', 'Thursday in the library, the same table. On it, two red pens: hers and yours. Two notebooks, each crammed with corrections of the other.'),
    AS.say('', 'pout', '……あんたの赤、最近厳しすぎない？', '……你的红笔，最近是不是太严了？', '...Isn\'t your red pen getting a bit harsh lately?'),
    AS.fork([
      AS.say('', 'shy', '……でも、あんたに直されるの、嫌いじゃない。', '……不过，被你改，我不讨厌。', '...But I don\'t mind being corrected by you.'),
      AS.nar('她说这句话的时候没有看你。她用你的语言说的，一个音都没错。', 'She does not look at you as she says it. She says it in your language, without a single wrong sound.')
    ], [
      AS.say('', 'happy', '……ま、いいけど。木曜が続くなら、なんでも。', '……算了，无所谓。只要周四一直有，怎样都行。', '...Whatever. As long as Thursdays keep happening, anything goes.'),
      AS.nar('一年了，周四一次都没有断过。时差那几个月，是凌晨两点的视频电话。', 'A year, and not one Thursday missed. The months with a time difference, it was a video call at two in the morning.')
    ]),
    AS.nar('夕阳照进来。她收拾书包的时候忽然停住了，皱着眉，看向你身后的某个地方。', 'The sunset comes in. As she packs her bag she stops suddenly, frowning, looking at a point somewhere behind you.')
  ],
  love: four(
    ['……ちょっと。そこ、さっきから見てるでしょ。', '……喂。那边那个，从刚才起就一直在看吧。', '...Hey. You there. You\'ve been watching this whole time.'],
    ['{name}じゃなくて。あんたよ。画面の前の、あんた。', '不是{name}。是你。屏幕前面的，你。', 'Not {name}. You. The one in front of the screen.'],
    ['一年間、あたしを選んでくれたの、あんたでしょ。……発音は最後まで甘かったけど。', '这一年，选了我的人，是你吧。……发音到最后都还不够就是了。', 'You\'re the one who chose me, all year. ...Your pronunciation never got there, though.'],
    ['……合格。セーブ、ちゃんとしときなさいよ。', '……合格。存档，给我好好存着。', '...Pass. And save your game properly.']
  ),
  friend: four(
    ['……ちょっと。そこ、さっきから見てるでしょ。', '……喂。那边那个，从刚才起就一直在看吧。', '...Hey. You there. You\'ve been watching this whole time.'],
    ['{name}じゃなくて。あんたよ。画面の前の、あんた。', '不是{name}。是你。屏幕前面的，你。', 'Not {name}. You. The one in front of the screen.'],
    ['恋人にならなかったのも、あんたが選んだことでしょ。……正解だったと思うわよ、今は。', '没成为恋人，也是你选的吧。……现在想想，我觉得选对了。', 'Not becoming lovers was your choice too. ...I think it was the right answer, now.'],
    ['画面の向こうでも、木曜は空けときなさい。……約束、だからね。', '就算隔着屏幕，周四也给我空出来。……这是约定。', 'Even on the other side of the screen, keep Thursdays free. ...That\'s a promise.']
  )
};

// ==========================================================
// 光
// ==========================================================
const HK = kit(CharacterId.HIKARI, 'bg-sky-500', '光', 'Hikari');
const HIKARI: EpilogueDef = {
  script: [
    HK.scene('kobe_harbor', '後日談', 'Epilogue', '一年后 · 港边', 'A year later · The harbour', 'town'),
    HK.nar('八月。机场到达口的自动门打开，一个拖着行李箱的人从里面跑了出来——跑的，不是走的。', 'August. The arrivals doors at the airport slide open and someone comes through dragging a suitcase. Running, not walking.'),
    HK.nar('她没有先挥手。她跑到你面前，喘着气，等你先说。', 'She does not wave first. She runs right up to you, out of breath, and waits for you to speak first.'),
    HK.fork([
      HK.me('おかえり。', '欢迎回来。', 'Welcome back.'),
      HK.say('casual', 'happy', '……ただいま！', '……我回来了！', '...I\'m home!'),
      HK.nar('"我回来了"。她说的是回到一个家的时候说的那句话。', 'Tadaima. The thing you say when you come back to a home.')
    ], [
      HK.me('久しぶり。', '好久不见。', 'Long time no see.'),
      HK.say('casual', 'happy', '……一週間ぶり！ ビデオ通話、先週したじゃん！', '……才一个星期！上周不是刚视频过嘛！', '...It\'s been a week! We video-called last week!'),
      HK.nar('教师资格的第一门，她考过了。这是她回来报的第一个喜讯。', 'She passed the first teaching exam. It is the first good news she has come back to tell.')
    ]),
    HK.nar('傍晚你们又去了那根栏杆。她靠在上面，看着海。然后她忽然转过头——不是看你，是看你身后更远的地方。', 'In the evening you go back to that rail. She leans on it, looking at the sea. Then she suddenly turns her head: not at you. At somewhere further behind you.')
  ],
  love: four(
    ['……あれ？ そこに、誰かいる？', '……咦？那里，有人吗？', '...Huh? Is someone there?'],
    ['{name}の、ずっと後ろのほう。……画面の、向こう側。', '在{name}的，很后面很后面。……屏幕的，另一边。', 'Way, way behind {name}. ...On the other side of the screen.'],
    ['あたしね、先に手を振るの、やめたの。だから——', '我啊，已经不先挥手了。所以——', 'I stopped being the one who waves first. So—'],
    ['今度は、あなたから振って。……そしたら、「おかえり」って言うから。', '这次，你先挥。……然后我会说"欢迎回来"。', 'This time, you wave first. ...Then I\'ll say "welcome back".']
  ),
  friend: four(
    ['……あれ？ そこに、誰かいる？', '……咦？那里，有人吗？', '...Huh? Is someone there?'],
    ['{name}の、ずっと後ろのほう。……画面の、向こう側。', '在{name}的，很后面很后面。……屏幕的，另一边。', 'Way, way behind {name}. ...On the other side of the screen.'],
    ['あたし、友達ひとり増えたみたい。……顔も知らないけど。', '我好像，又多了一个朋友。……虽然连长相都不知道。', 'Looks like I made one more friend. ...Even if I don\'t know your face.'],
    ['「またね」って、あなたにも言っていい？ ……またね！', '"回头见"，也可以对你说吗？……回头见！', 'Can I say "see you" to you too? ...See you!']
  )
};

// ==========================================================
// 铃
// ==========================================================
const RE = kit(CharacterId.REI, 'bg-indigo-500', '铃', 'Rei');
const REI: EpilogueDef = {
  script: [
    RE.scene('rooftop_night', '後日談', 'Epilogue', '一年后 · 夜 · 天台', 'A year later · Night · The rooftop', 'night'),
    RE.nar('第二十三册。观测者一栏写着两个名字，已经是第五本这样写的了。', 'Volume twenty-three. Two names in the observer field: the fifth volume to be written that way.'),
    RE.nar('档案馆后来给她寄了一封信：有一位研究震灾的老先生，读了十五番馆那一项，专程来道谢。那是她的记录第一次有了一个她不认识的读者。', 'The archive wrote to her afterwards: an elderly researcher of the earthquake had read the entry on No. 15 and come in specially to say thank you. The first reader of her records she has never met.'),
    RE.fork([
      RE.say('winter', 'happy', '……読者が、増えました。でも、最初の読者は、ずっとあなたです。', '……读者，变多了。不过，第一个读者，一直都是你。', '...My readers have increased. But the first reader is always you.')
    ], [
      RE.say('winter', 'happy', '……読者が、増えました。共同観測者の欄も、そのままです。', '……读者，变多了。共同观测者那一栏，也一直没变。', '...My readers have increased. The co-observer field is unchanged.')
    ]),
    RE.nar('她低头写着今晚的记录。写到一半，她的笔停了。她抬起头，把眼镜往上推了推，看向一个不存在星星的方向。', 'She bends over tonight\'s entry. Halfway through, her pen stops. She looks up, pushes her glasses into place, and gazes in a direction where there are no stars.')
  ],
  love: four(
    ['……観測対象外の視線を、検知しました。', '……检测到，观测对象以外的视线。', '...I have detected a gaze from outside the observation field.'],
    ['あなたです。画面の向こうで、{name}を一年間見ていた方。', '是你。在屏幕另一边，看了{name}一整年的那一位。', 'You. The one who watched {name} for a whole year from the other side of the screen.'],
    ['記録します。この物語には、もう一人、観測者がいた、と。', '记录下来。这个故事，还有另一位观测者。', 'Recording: this story had one more observer.'],
    ['……署名を、お願いします。見えない文字で、構いません。', '……请署名。用看不见的字，也没关系。', '...Your signature, please. Invisible ink is fine.']
  ),
  friend: four(
    ['……観測対象外の視線を、検知しました。', '……检测到，观测对象以外的视线。', '...I have detected a gaze from outside the observation field.'],
    ['あなたです。画面の向こうで、{name}を一年間見ていた方。', '是你。在屏幕另一边，看了{name}一整年的那一位。', 'You. The one who watched {name} for a whole year from the other side of the screen.'],
    ['観測者は二名、と記録していました。……訂正します。三名です。', '观测者，一直记录的是两名。……订正。是三名。', 'I had recorded two observers. ...Correction. Three.'],
    ['三人目の方の視野は、画面の外。……補正、しないでおきます。', '第三位的视野，在屏幕外面。……不作修正。', 'The third observer\'s field of view lies outside the screen. ...I will not correct for it.']
  )
};

// ==========================================================
// 空
// ==========================================================
const SO = kit(CharacterId.SORA, 'bg-orange-500', '空', 'Sora');
const SORA: EpilogueDef = {
  script: [
    SO.scene('gym', '後日談', 'Epilogue', '一年后 · 体育馆', 'A year later · The gym', 'basketball'),
    SO.nar('县大赛的四强。她是首发。', 'The prefectural semi-finals. She starts.'),
    SO.nar('赛前热身的时候，她跳起来摸了一下篮板上贴着的那条胶带——那是她去年秋天重新量出来的高度。今年，她的指尖比那条胶带高了两公分。', 'In the warm-up she leaps and slaps the strip of tape on the backboard: the height she measured last autumn. This year her fingertips clear it by two centimetres.'),
    SO.fork([
      SO.nar('比赛结束的哨声响起，她第一个朝通道口看过来。那是约好的：第一个见到的人。', 'At the final whistle the first place she looks is the exit. As agreed: the first person she sees.')
    ], [
      SO.nar('比赛结束的哨声响起，她第一个朝观众席最前排正中间看过来。一号的位子。', 'At the final whistle the first place she looks is the front row, dead centre. Number one\'s seat.')
    ]),
    SO.say('school', 'happy', '見とった!? 今の、見とった!?', '看到了吗!?刚才那个，看到了吗!?', 'Did you see!? That just now, did you see!?'),
    SO.nar('她一边转着球一边往外走，走到一半忽然停下，眯起眼睛看向观众席最后面——更后面——一个根本没有座位的地方。', 'She walks off spinning the ball on her finger, then stops halfway and squints at the very back of the stands. Further back. Somewhere there are no seats at all.')
  ],
  love: four(
    ['……ん？ 観客席に、まだ誰かおるやん。', '……嗯？观众席上，还有人在嘛。', '...Huh? There\'s still someone in the stands.'],
    ['あんたや、あんた。画面の前の。', '你啊，就是你。屏幕前面的。', 'You. Yeah, you. In front of the screen.'],
    ['一番最初に会う人の、さらに後ろで、ずっと見とったやろ。', '在第一个见我的人的更后面，一直都在看着吧。', 'You were watching the whole time, from behind even the first person I see.'],
    ['ほな、あんたは零号な。一号より先に、ずっとおったから。', '那你就是零号了。比一号还早，一直都在。', 'Then you\'re number zero. You were there even before number one.']
  ),
  friend: four(
    ['……ん？ 観客席に、まだ誰かおるやん。', '……嗯？观众席上，还有人在嘛。', '...Huh? There\'s still someone in the stands.'],
    ['あんたや、あんた。画面の前の。', '你啊，就是你。屏幕前面的。', 'You. Yeah, you. In front of the screen.'],
    ['一号は{name}やけど……あんたの席も、ちゃんとあるで。', '一号是{name}啦……不过你的位子，也好好留着呢。', 'Number one is {name}... but there\'s a seat for you too.'],
    ['零号。一号より前の席。……終身制やで！', '零号。比一号还靠前的位子。……终身制的哦！', 'Number zero. In front of number one. ...It\'s a lifetime appointment!']
  )
};

// ==========================================================
// 深雪
// ==========================================================
const MI = kit(CharacterId.MIYUKI, 'bg-violet-400', '深雪', 'Miyuki');
const MIYUKI: EpilogueDef = {
  script: [
    MI.scene('apartment_balcony', '後日談', 'Epilogue', '一年后 · 海风庄的阳台', 'A year later · The Umikaze balcony', 'chat'),
    MI.nar('阳台上的花盆里，罗勒长得比人还精神。旁边是一盆薰衣草——"不为了谁"的那一盆。', 'In the planters on the balcony the basil is livelier than anyone. Beside it, the lavender. The one not meant for anyone.'),
    MI.nar('她还是全楼的应急联络人。区别是，现在她的应急联络人那一栏也有人了。', 'She is still the whole building\'s emergency contact. The difference is that now her own emergency contact field is filled in too.'),
    MI.fork([
      MI.say('cardigan', 'happy', '今日はね、あなたが作る日でしょう？ ……ふふ、楽しみにしてたの。', '今天是你做饭的日子吧？……呵呵，我一直很期待呢。', 'Today\'s your turn to cook, isn\'t it? ...I\'ve been looking forward to it.'),
      MI.nar('一周两天，你做饭。她坐在被炉边等着被端饭。她说她到现在还是会不好意思，但已经学会了不道歉。', 'Two days a week, you cook and she sits at the kotatsu waiting to be served. She says it still embarrasses her, but she has learned not to apologise.')
    ], [
      MI.say('cardigan', 'happy', '今日はね、多めに作っちゃった。……本当に、作りすぎたの。今日のは嘘じゃないわ。', '今天啊，做多了。……是真的做多了。今天这个可不是谎话。', 'I made too much today. ...Really too much. That one isn\'t a lie.'),
      MI.nar('一年了，"做多了"有时候是真的，有时候是假的。但不管哪种，两份都有人吃。', 'A year on, "made too much" is sometimes true and sometimes not. Either way, both portions get eaten.')
    ]),
    MI.nar('洗碗的时候，她忽然关了水龙头，回过头，像在听什么动静。然后她对着一个没有人的方向，很温柔地笑了。', 'At the sink she suddenly turns off the tap and looks round, as if listening for something. Then she smiles, very gently, at a place where nobody is.')
  ],
  love: four(
    ['……あら？ どなたかしら。', '……哎呀？是哪位呢。', '...Oh? Who might that be?'],
    ['{name}を、一年間ここまで連れてきてくれた方ね。', '是把{name}一路带到这里来的那一位吧。', 'You\'re the one who brought {name} all the way here, this whole year.'],
    ['あなたの分は、作ってあげられないけれど……ちゃんと、食べてる？', '你的那一份，我没办法做给你……你有好好吃饭吗？', 'I can\'t make a portion for you, but... are you eating properly?'],
    ['……また、いつでも。ここに、名前で呼びに来てね。', '……随时再来。来这里，叫我的名字。', '...Come back anytime. Come here and call me by my name.']
  ),
  friend: four(
    ['……あら？ どなたかしら。', '……哎呀？是哪位呢。', '...Oh? Who might that be?'],
    ['{name}を、一年間ここまで連れてきてくれた方ね。', '是把{name}一路带到这里来的那一位吧。', 'You\'re the one who brought {name} all the way here, this whole year.'],
    ['あなたの分は、作ってあげられないけれど……ちゃんと、食べてる？', '你的那一份，我没办法做给你……你有好好吃饭吗？', 'I can\'t make a portion for you, but... are you eating properly?'],
    ['緊急連絡先、もう一人書いてもいいかしら。……画面の向こうの、あなた。', '紧急联络人，可以再多写一个吗。……屏幕另一边的，你。', 'May I add one more emergency contact? ...You, on the other side of the screen.']
  )
};

// ==========================================================
// 奈绪
// ==========================================================
const NA = kit(CharacterId.NAO, 'bg-emerald-500', '奈绪', 'Nao');
const NAO: EpilogueDef = {
  script: [
    NA.scene('kitano_slope', '後日談', 'Epilogue', '一年后 · 北野坂', 'A year later · The Kitano slope', 'town'),
    NA.nar('笔记本已经写到第九本了。旧的那一本还在她的书架最上层，没有扔，也没有再翻过。', 'The notebook is up to number nine. The old one is still on the top shelf of her bookcase: not thrown away, never opened again.'),
    NA.fork([
      NA.nar('新的那几本，每一本的最后一行都是同一条。她每天都写，写了一年，一次都没嫌重复。', 'In each of the new ones, the last line is the same item. She writes it every day; a year of it, and not once has she found it repetitive.'),
      NA.say('knit', 'shy', '……同じことでも、毎日ちょっとずつ、字が違うねん。', '……就算是同一句话，每天的字都有一点不一样。', '...Even when it\'s the same thing, the handwriting is a little different every day.')
    ], [
      NA.nar('新的那几本，一半是她写的，一半是你写的。"二人のノート"，每周交换一次，一次都没断过。', 'Half of the new ones are in her writing, half in yours. Our notebook, swapped every week, not once missed.'),
      NA.say('knit', 'happy', 'あんたのページ、最近ウチのことばっかりやな。……ええけど。', '你那几页，最近全是写我的嘛。……也行吧。', 'Your pages are all about me lately. ...Not complaining.')
    ]),
    NA.nar('她走在前面半步，翻着笔记本，嘴里念念有词。走到坡中间，她忽然停下，眨了一下眼，然后回过头——看的不是你。', 'She walks half a step ahead, leafing through the notebook, muttering. Halfway down she stops, blinks once, and turns round. It is not you she is looking at.')
  ],
  love: four(
    ['……え。そこ、誰？', '……诶。那边，是谁？', '...Huh. Who\'s that?'],
    ['{name}ちゃうな。……{name}を、ずっと動かしてた人や。', '不是{name}啊。……是一直在让{name}动起来的那个人。', 'Not {name}. ...The one who\'s been moving {name} all this time.'],
    ['ノートの最後のページ、あんたの項目も作っといたで。', '笔记本的最后一页，我也给你开了一项。', 'I made an entry for you on the last page of the notebook.'],
    ['一行目。「この人のおかげで、十年分の一行が書けた」。', '第一行。"多亏了这个人，那一句十年的话，终于写下来了。"', 'Line one: "Thanks to this person, I finally wrote the line ten years in the making."']
  ),
  friend: four(
    ['……え。そこ、誰？', '……诶。那边，是谁？', '...Huh. Who\'s that?'],
    ['{name}ちゃうな。……{name}を、ずっと動かしてた人や。', '不是{name}啊。……是一直在让{name}动起来的那个人。', 'Not {name}. ...The one who\'s been moving {name} all this time.'],
    ['ノートの最後のページ、あんたの項目も作っといたで。', '笔记本的最后一页，我也给你开了一项。', 'I made an entry for you on the last page of the notebook.'],
    ['「顔は知らん。けど、ずっと見ててくれた」。……答え合わせ、また来てな。', '"不知道长什么样。但是，一直看着我们。"……对答案，再来哦。', '"Don\'t know their face. But they watched the whole time." ...Come back to check the answers.']
  )
};

// ==========================================================
// 真希
// ==========================================================
const MK = kit(CharacterId.MAKI, 'bg-pink-500', '真希', 'Maki');
const MAKI: EpilogueDef = {
  script: [
    MK.scene('sannomiya_arcade', '後日談', 'Epilogue', '一年后 · 夜 · 三宫的游戏厅', 'A year later · Night · The arcade in Sannomiya', 'night'),
    MK.nar('「Beat Crash 神戸大会」，第二届。参赛名单的第一行，是她的名字——上一届的亚军，种子选手。', 'The second Beat Crash Kobe Tournament. On the first line of the entrants\' list, her name: last year\'s runner-up, seeded.'),
    MK.nar('开赛前，她把紫色的猫耳耳机摘下来，交到你手里。这已经是一个仪式了。', 'Before it starts she takes off the purple cat-ear headphones and puts them in your hands. It has become a ritual.'),
    MK.say('punk', 'tease', '……いつもの。わかってるやんな？', '……老规矩。你懂的吧？', '...The usual. You know the drill, right?'),
    MK.fork([
      MK.nar('这一次她赢了。她从台上直接跳下来，扑进你怀里，喊着让你夸她。你夸了。她说还要。', 'This time she wins. She jumps straight off the stage into your arms, yelling for you to praise her. You do. She says more.')
    ], [
      MK.nar('这一次她赢了。她从台上跑下来，在你面前急刹车，抬着下巴等你开口。你夸了。她说"下手くそ"，然后让你再说一遍。', 'This time she wins. She runs off the stage and skids to a stop in front of you, chin up, waiting. You praise her. "Terrible," she says, and makes you say it again.')
    ]),
    MK.nar('散场之后，她在那台机器前面输入名字。输到一半，她忽然停下，盯着屏幕上自己的倒影——倒影的后面。', 'After it is over she stands at the cabinet entering her name. Halfway through she stops and stares at her reflection in the screen. At what is behind it.')
  ],
  love: four(
    ['……なあ。そこで見てるん、誰？', '……喂。在那边看着的，是谁？', '...Hey. Who\'s that watching?'],
    ['センパイちゃうやろ。センパイの、中の人や。', '不是前辈吧。是前辈里面的那个人。', 'You\'re not senpai. You\'re the one inside senpai.'],
    ['ざぁこ……って言おうと思ったけど。今日は、やめとく。', '本来想说"杂鱼"的……不过今天，算了。', 'I was gonna say "loser"... but not today.'],
    ['最後まで遊んでくれて、ありがとな。……ほんまに、楽しかってん。', '陪我玩到最后，谢啦。……真的，超开心的。', 'Thanks for playing all the way to the end. ...It really was fun.']
  ),
  friend: four(
    ['……なあ。そこで見てるん、誰？', '……喂。在那边看着的，是谁？', '...Hey. Who\'s that watching?'],
    ['センパイちゃうやろ。センパイの、中の人や。', '不是前辈吧。是前辈里面的那个人。', 'You\'re not senpai. You\'re the one inside senpai.'],
    ['ざぁこ……って言おうと思ったけど。今日は、やめとく。', '本来想说"杂鱼"的……不过今天，算了。', 'I was gonna say "loser"... but not today.'],
    ['名前入力、最後のマス、空けといたる。……あんたの分な。', '输名字的格子，最后那一格给你空着。……你的份。', 'I\'ll leave the last letter blank on the name entry. ...That one\'s yours.']
  )
};

// ==========================================================
// 稻荷
// ==========================================================
const IN = kit(CharacterId.INARI, 'bg-amber-500', '稻荷', 'Inari');
const INARI: EpilogueDef = {
  script: [
    IN.scene('ikuta_shrine', '後日談', 'Epilogue', '一年后 · 清晨 · 生田神社', 'A year later · Early morning · Ikuta Shrine', 'chat'),
    IN.nar('又是初雪的早晨。一年前，她就是在这棵树下把一个名字写进了帐里。', 'The morning of the first snow again. A year ago, under this tree, she wrote a name into the ledger.'),
    IN.fork([
      IN.nar('她的名字下面，第一个日期旁边，现在多了一行很小的字：一个三位数。那是她数到今天的天数。', 'Under her name, beside the first date, there is now a line of very small writing: a three-digit number. The days she has counted up to today.'),
      IN.say('knit', 'happy', '一年で、こんなに数えたのは初めてじゃ。……一日が、こんなに重いとはの。', '一年里数了这么多，还是第一次。……一天，原来这么沉啊。', 'The first time I\'ve counted so many in a single year. ...Who knew one day could weigh so much.')
    ], [
      IN.nar('你的名字和她的名字并排写着，都是铅笔，都描过一遍了。笔迹比去年深。', 'Your name and hers side by side, both in pencil, both traced over once. The lines are darker than last year.'),
      IN.say('knit', 'happy', '今年も、消さなんだな。……わらわも、そなたも。', '今年也没有擦掉呢。……我也好，你也好。', 'Neither of us erased it this year either. ...Not me, not you.')
    ]),
    IN.nar('雪落在帐上，她伸手拂掉。拂到一半，她的耳朵忽然竖了起来，转向一个方向——不是林子，不是鸟居，是比那些都远得多的地方。', 'Snow falls on the ledger and she brushes it away. Halfway through, her ears suddenly prick up and swivel toward something. Not the grove, not the torii. Somewhere much, much further away.')
  ],
  love: four(
    ['……ほう。そなた、どこから覗いておる。', '……哦？你，是从哪里在偷看。', '...Oh? And where are you peeking from?'],
    ['この子の後ろじゃな。帳の外、画面の向こうから。', '在这孩子的后面吧。帐的外面，屏幕的另一边。', 'Behind this one. From outside the ledger, beyond the screen.'],
    ['千年見てきたが、外から見られたのは、初めてじゃ。', '看了一千年，被外面的人看着，还是第一次。', 'A thousand years of watching, and this is the first time I\'ve been watched from outside.'],
    ['名は書けぬが、覚えておく。……そなたの分も、数えておこう。', '名字写不下来，不过我会记住。……你的那一份，我也一起数着。', 'I can\'t write your name, but I\'ll remember. ...I\'ll count your days too.']
  ),
  friend: four(
    ['……ほう。そなた、どこから覗いておる。', '……哦？你，是从哪里在偷看。', '...Oh? And where are you peeking from?'],
    ['この子の後ろじゃな。帳の外、画面の向こうから。', '在这孩子的后面吧。帐的外面，屏幕的另一边。', 'Behind this one. From outside the ledger, beyond the screen.'],
    ['千年見てきたが、外から見られたのは、初めてじゃ。', '看了一千年，被外面的人看着，还是第一次。', 'A thousand years of watching, and this is the first time I\'ve been watched from outside.'],
    ['見えぬ名は、なぞれぬのう。……じゃから、また遊びに来い。', '看不见的名字，可描不了啊。……所以，再来玩吧。', 'A name I can\'t see, I can\'t trace. ...So come back and visit.']
  )
};

export const EPILOGUES: Record<CharacterId, EpilogueDef> = {
  [CharacterId.ASUKA]: ASUKA, [CharacterId.HIKARI]: HIKARI, [CharacterId.REI]: REI, [CharacterId.SORA]: SORA,
  [CharacterId.MIYUKI]: MIYUKI, [CharacterId.NAO]: NAO, [CharacterId.MAKI]: MAKI, [CharacterId.INARI]: INARI
};
