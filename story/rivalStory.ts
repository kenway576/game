import { CharacterId, StoryNode } from '../types';
import type { MainChapterDef } from './mainStory';

// ==========================================================
// ⚔️ 宿敌线：金城カイ
//
// 【他是谁】
// 冲绳宜野湾来的转学生，跟主角同一个星期转进二年B班——也是从零开始。
// 母亲是冲绳人，父亲是驻冲绳的美国海军陆战队员，在他六岁那年调回本土，
// 之后每年只寄一张生日卡。护照只有日本的，英语是中学才开始学的。
// 狗牌是父亲留下的备用那块，上面的字早就磨平了。
//
// 【为什么需要他】
// 这个游戏一年下来，主角身边全是女孩子和大人。缺一个跟他站在同一条起跑线上、
// 什么都要跟他比、又比得光明正大的人。宝可梦里的劲敌是这个位置：
// 他每次出现都比上次强一点，逼着你也强一点；他赢了不嘲讽，输了不找借口。
// 所以他只在剧情里出现，不能自由对话——他不是用来"攻略"的。
//
// 【讽刺的是什么】（用户要的）
// 不是讽刺"日本人"，是讽刺一种很具体的姿态：
//   · 嘴上说"国际化"，实际上需要一个看起来像外国人的人站在国旗前面拍照；
//   · 喜欢冲绳的海、冲绳的面、冲绳的三线——基地除外的一切；
//   · 一个日本国籍的孩子，在自己的国家里被当成"留学生的同类"。
// 写法上的规矩：讽刺从不出自旁白的评论，全部来自场面本身——
// 别人说了什么、他怎么回答、教室里安静了几秒。他自己从来不发火，
// 他的武器是一句很平的实话。
//
// 【和主角的关系】
// 两个都是新来的。主角是外国人，他是"不太像日本人的日本人"。
// 他们比的东西表面上是名次、球、演讲，底下比的是同一件事：
// 在一个不属于自己的地方，从零开始站稳。
//
// 【成长】
// 七章，每一章都有选择，每一章都按五维给成长（知识、勇气、体贴、魅力、语言）。
// 几处用 check 判属性：属性够了你能赢他一次，不够就输——输了他会告诉你差在哪儿。
//
// 触发：和主线一样挂在"开学第几天"上，在大厅里以「宿敌」的名义出现（见 mainStory 的 nextMainChapter）。
// 第一面在开学第一天的教室里（day1Data.ts，自我介绍之后）。
// ==========================================================

const K = '/images/characters/kai/';
const S = '/images/characters/sora/';
const KAI = 'bg-teal-600';
const ZH = '金城', EN = 'Kinjo';

const kai = (face: string, jp: string, zh: string, en: string, outfit = 'school'): StoryNode =>
  ({ type: 'speech', speakerZh: ZH, speakerEn: EN, characterImage: `${K}${outfit}_${face}.webp`, jp, zh, en, color: KAI });
const nar = (zh: string, en: string, img?: string): StoryNode =>
  (img === undefined ? { type: 'narration', zh, en } : { type: 'narration', zh, en, characterImage: img });
const face = (f: string, outfit = 'school') => `${K}${outfit}_${f}.webp`;

// ==========================================================
// 开学第一天：插在 day1Data 的自我介绍之后
// ==========================================================
export const KAI_DAY1: StoryNode[] = [
  nar('班主任刚拿起点名册，前门被拉开了。', 'The homeroom teacher has only just picked up the register when the front door slides open.', ''),
  nar('门口站着一个男生。校服外套敞着，袖子挽到小臂，脚上是一双白色的帆布鞋——校规上写的是棕色皮鞋。他个子很高，进门的时候下意识低了一下头，其实门框还够。',
    'A boy is standing in the doorway. Blazer open, sleeves pushed up to the forearm, white canvas shoes on his feet — the rules say brown leather. He is tall enough that he ducks a little on the way in, out of habit; the doorframe would have cleared him.', face('neutral')),
  nar('班主任看了一眼名单，说了一句「あ、そうやった。もう一人」，语气像是想起了一件忘在冰箱里的东西。',
    'The teacher glances at the list and says oh, that’s right, one more, in the tone of someone remembering something left in the fridge.'),
  nar('后排有人小声说了句「ハーフや」。前排一个女生已经准备好了，很热情地朝他挥了挥手：「ハロー！」',
    'Somebody at the back murmurs that he’s half. A girl at the front is already prepared, and waves at him warmly: hello!'),
  kai('smug', '……あー、ハロー。けど、日本語でいいよ。沖縄から来た、金城カイ。よろしくね。',
    '……啊——哈喽。不过说日语就行。从冲绳来的，金城カイ。请多指教。',
    '...Uh, hello. But Japanese is fine. Kai Kinjo, from Okinawa. Nice to meet you all.'),
  nar('「沖縄」两个字落地之后，教室里有一种很微妙的安静。你后来想过好几次那是什么：大家准备好了一个外国人，进来的是一个日本人。准确地说，进来的是一个他们不太确定算不算的日本人。',
    'After the word Okinawa lands there is a very particular kind of quiet. You think about it several times afterwards. They had a foreigner ready, and in walked a Japanese boy. Or, more exactly, a boy they weren’t quite sure counted as one.'),
  nar('他被安排在你旁边那张空桌。坐下之前他先低头看了你一眼，从头看到桌上那本手账，像在看一张对手的球员卡。',
    'He is given the empty desk next to yours. Before he sits down he looks you over, from your head to the journal on your desk, the way you would read an opponent’s player card.'),
  kai('neutral', 'お前も転校生？……留学生か。いつ来た？',
    '你也是转学生？……留学生啊。什么时候来的？',
    'You a transfer too? ...Exchange student, huh. When did you get here?'),
  nar('你说昨天。他点点头，说他是前天。', 'You say yesterday. He nods and says he got in the day before.'),
  kai('smug', 'じゃあ、俺が一日先輩さ。', '那我比你早一天，算前辈。', 'Then I’m your senior by a day.'),
  nar('你想说一天不算前辈。还没开口，他已经把手伸过来了——不是要握手，是掌心朝上、手指勾了两下，像在跟你要什么东西。',
    'You want to say a day doesn’t make anyone a senior. Before you can, he holds a hand out — not to shake, palm up, two fingers crooking, as if asking you for something.'),
  kai('happy', '勝負しようぜ。どっちが先に、このクラスに馴染むか。',
    '来比一场。看谁先融进这个班。',
    'Let’s have a contest. Who fits into this class first.'),
  {
    type: 'choice',
    promptZh: '他的手还悬在那儿。', promptEn: 'His hand is still hanging there.',
    options: [
      {
        id: 'kai_d1_accept', labelZh: '「受けて立つ。」', labelEn: '"You’re on."', jp: '受けて立つ。',
        hintZh: '被人下了战书', hintEn: 'Somebody has thrown down a gauntlet.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '第一天就接下了一个人的挑战', reasonEn: 'You took up a challenge on your first day' }],
        setFlags: ['kai_d1_accepted'],
        then: [
          nar('你在他掌心上拍了一下。拍得比你想的响。', 'You slap his palm. It comes out louder than you meant.'),
          kai('laugh', 'いいね。そうこなくちゃ。', '好。就该这样。', 'Nice. That’s the spirit.')
        ]
      },
      {
        id: 'kai_d1_decline', labelZh: '「融进一个班，不是比赛吧。」', labelEn: '"Fitting in isn’t a contest."', jp: '馴染むのは、勝負じゃないだろ。',
        hintZh: '你说的是实话', hintEn: 'It is true.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有把别人当成对手', reasonEn: 'You did not treat other people as a scoreboard' }],
        setFlags: ['kai_d1_declined'],
        then: [
          kai('surprised', '……真面目か。', '……这么较真啊。', '...Serious type, huh.'),
          kai('smug', 'じゃあ、俺の不戦勝な。', '那就算我不战而胜。', 'Then I win by forfeit.')
        ]
      }
    ]
  },
  nar('前排的明日香回过头来瞪了你们一眼——两个人一起被瞪。你在这间教室里第一次和别人"一起"了什么，对方是一个刚认识五分钟、已经宣布要赢你的人。',
    'At the front, Asuka turns round and glares at the pair of you — both of you, together. It is the first thing you have done "together" with anyone in this room, and the other party is someone you have known for five minutes who has already announced he means to beat you.'),
  { type: 'effect', setFlags: ['met_kai'] }
];

// ==========================================================
// 第一章 · 三十六人の名前
// ==========================================================
const R1: StoryNode[] = [
  { type: 'scene', scene: 'classroom_sunset', bgm: 'afternoon', titleZh: '宿敌 · 三十六个名字', titleEn: 'Rival · Thirty-Six Names', subtitleZh: '放学后 · 二年B班', subtitleEn: 'After school · Class 2-B' },
  // 老存档：第一天已经过完了，没看过他登场。补一段回想
  {
    type: 'branch', ifFlag: 'met_kai', not: true,
    then: [
      nar('你转进来的那个星期，二年B班其实来了两个转学生。另一个是从冲绳来的金城カイ，坐在你旁边那张桌子。第一天他就把手伸过来，掌心朝上，手指勾了两下：「勝負しようぜ」。',
        'The week you transferred in, 2-B actually got two new students. The other was Kai Kinjo from Okinawa, at the desk next to yours. On the first day he held a hand out, palm up, two fingers crooking: let’s have a contest.', face('smug')),
      { type: 'effect', setFlags: ['met_kai'] }
    ]
  },
  nar('星期一放学，金城在黑板上写了一个数字：36。然后转过身，用粉笔指着你。',
    'After school on Monday, Kinjo writes a number on the board: 36. Then he turns and points the chalk at you.', face('smug')),
  kai('smug', 'このクラス、三十六人。金曜までに全員の名前、顔見て言えた方の勝ち。',
    '这个班三十六个人。到星期五，谁能看着脸叫出所有人的名字，谁就赢。',
    'Thirty-six people in this class. Whoever can look at every face and name them by Friday wins.'),
  nar('你问他为什么是名字。他想了一下，说因为名字是最便宜的东西——不用花钱，不用考试，只要你肯开口。',
    'You ask why names. He thinks, and says because a name is the cheapest thing there is — it costs nothing, there is no exam, you only have to be willing to open your mouth.'),
  nar('那一个星期你用了一个你很熟悉的办法：你抄了一份座位表，夹在手账里，每天早上对着后脑勺背一遍。',
    'All that week you use a method you know well. You copy out the seating plan, tuck it in your journal and drill it every morning against the backs of people’s heads.'),
  {
    type: 'choice',
    promptZh: '星期三，你发现座位表上有六个名字你不会念。',
    promptEn: 'On Wednesday you find six names on the plan you cannot read.',
    options: [
      {
        id: 'kai1_dictionary', labelZh: '回家查字典，把读音标上', labelEn: 'Look up the readings at home and write them in',
        hintZh: '稳妥的办法', hintEn: 'The safe way.',
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '六个人名的读法，全查到了', reasonEn: 'You looked up all six readings' }],
        setFlags: ['kai1_dictionary'],
        then: [nar('你把六个读音用铅笔小小地标在座位表上。字典很准，只是字典不会回头。', 'You pencil the six readings in tiny letters on the plan. The dictionary is accurate. Dictionaries just never turn round.')]
      },
      {
        id: 'kai1_ask', labelZh: '直接去问本人「你的名字怎么念？」', labelEn: 'Go and ask each of them how to say it',
        hintZh: '要开口六次', hintEn: 'You will have to open your mouth six times.',
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你走过去，问了六个人的名字', reasonEn: 'You walked over and asked six people their names' }],
        setFlags: ['kai1_asked'],
        then: [nar('第一个人被你问得愣了一下，然后很认真地把名字写在你的手账上，还画了个笑脸。第六个人问你叫什么，你也告诉了她。', 'The first person you ask is thrown for a second, then writes her name very carefully in your journal and adds a smiley face. The sixth asks your name in return, and you tell her.')]
      }
    ]
  },
  { type: 'scene', scene: 'classroom_sunset' },
  nar('星期五。金城站在讲台上，像裁判一样抱着胳膊。规则是：他指一个人，你说名字；然后换过来。',
    'Friday. Kinjo stands at the teacher’s desk with his arms folded like a referee. The rule: he points at someone, you say the name; then you swap.', face('neutral')),
  nar('他先来。三十六个人，他一个停顿都没有。不止是名字——他叫到谁，谁就"嗯？"一声转过头来，有几个人还笑了。',
    'He goes first. Thirty-six people and not a single pause. And not just names: every time he calls one, that person turns round with a "hm?", and a few of them laugh.'),
  {
    type: 'branch', ifFlag: 'kai1_asked',
    then: [
      nar('轮到你。你叫到第七个人的时候，那个人转过来说：「あ、留学生やん。こないだ名前聞きに来てくれた」。教室后面有人拍了一下桌子。',
        'Your turn. When you reach the seventh name, she turns round and says oh, it’s the exchange student, you came and asked my name the other day. Someone at the back slaps a desk.'),
      nar('你也叫完了三十六个人。不是每个人都回头了，但回头的比你想的多。', 'You get through all thirty-six as well. Not everyone turns round. More than you expected do.'),
      kai('surprised', '……引き分けか。', '……平手啊。', '...A draw, then.'),
      kai('laugh', 'おもしろくなってきたさ。', '开始有意思了。', 'Now it’s getting interesting.'),
      { type: 'effect', setFlags: ['kai1_draw'], effects: [{ stat: 'charm', amount: 2, reasonZh: '三十六个人里，回头的比你想的多', reasonEn: 'More of the thirty-six turned round than you expected' }] }
    ],
    otherwise: [
      nar('轮到你。三十六个名字你全说对了。可是没有一个人回头——你是对着座位表的形状念的，念的是名字，不是人。',
        'Your turn. You get all thirty-six right. But nobody turns round. You recited the shape of the seating plan: names, not people.'),
      kai('neutral', '全部合っとる。でも、俺の勝ちさ。', '全都对。不过，是我赢了。', 'All correct. But I win.'),
      nar('你问为什么。', 'You ask why.'),
      kai('thinking', '座席表で覚えた名前は、顔と一緒に出てこない。……呼んでみ？呼んだら向こうが返事する。それで初めて「覚えた」ことになるさ。',
        '对着座位表背下来的名字，跟脸是分开的。……你叫叫看？你叫了，对方应一声。那才算"记住了"。',
        'Names learned off a seating plan don’t come out together with the face. ...Try calling one. They answer. That’s when it counts as remembering.'),
      nar('他说这句话的样子不像在得意，倒像一个比你早到一天的人，把路上的一个坑指给你看。',
        'He does not say it like someone gloating. More like someone who got here a day earlier, pointing out a pothole on the road.'),
      { type: 'effect', setFlags: ['kai1_lost'], effects: [{ stat: 'knowledge', amount: 1, reasonZh: '名字要叫出口才算记住', reasonEn: 'A name only counts once you say it to someone' }] }
    ]
  },
  nar('回家的路上你在楼梯口叫了一声「健太」。健太回过头说「おう」。就这样，一个字。你一路上都在想这个字。',
    'On the way out you call "Kenta" at the top of the stairs. Kenta turns and says yo. That is all, one syllable. You think about it the whole way home.', ''),
  { type: 'effect', setFlags: ['rival_ch1_done'] }
];

// ==========================================================
// 第二章 · 中間テスト
// ==========================================================
const R2: StoryNode[] = [
  { type: 'scene', scene: 'hallway', bgm: 'afternoon', titleZh: '宿敌 · 期中考试', titleEn: 'Rival · Midterms', subtitleZh: '五月 · 走廊的公告栏', subtitleEn: 'May · The noticeboard in the corridor' },
  nar('期中考试的成绩发下来那天，国语老师在讲台上多说了两句话。', 'The day the midterm papers come back, the Japanese teacher adds a couple of remarks at the front.'),
  nar('先是对你：「留学生やのにようできてるわ。外国の人やのに、えらいねえ」。全班鼓了掌。你脸有点热，不全是因为高兴。',
    'First to you: "You’ve done ever so well for an exchange student. For a foreigner, that’s really something." The whole class applauds. Your face is warm, and not only with pleasure.'),
  nar('然后对金城：「金城くんも、ハーフやのに漢字ちゃんと書けるんやね」。这一次没有人鼓掌，大家也不知道该不该鼓。',
    'Then to Kinjo: "And Kinjo, you can write your kanji properly too, for a half." This time nobody claps. Nobody is sure whether they should.', face('neutral')),
  kai('neutral', '日本で生まれて日本で育ったら、だいたい書けますよ。',
    '在日本出生、在日本长大的话，大体都会写吧。',
    'If you’re born in Japan and grow up in Japan, you can mostly write them.'),
  nar('他说得很客气，客气得像在回答"今天天气怎么样"。老师笑了一下，说「そらそうやね」，然后开始讲下一题。教室里有三秒钟，所有人都在看自己的卷子。',
    'He says it very politely, as though answering a question about the weather. The teacher laughs, says well of course, and moves on to the next question. For three seconds, everyone in the room looks at their own paper.'),
  { type: 'scene', scene: 'hallway' },
  nar('排名贴在走廊的公告栏上。前五十名，全年级。你和金城一起挤过去。', 'The rankings go up on the corridor noticeboard. Top fifty, whole year. You and Kinjo push your way to the front together.'),
  {
    type: 'check', metric: 'knowledge', min: 14,
    then: [
      nar('你在第七。他在第九。', 'You are seventh. He is ninth.', face('surprised')),
      nar('他盯着那两个数字看了很久，久到旁边的人都挤走了。然后他转过来，伸出手——这次是真的要握手。',
        'He stares at the two numbers for a long time, long enough for the crowd beside you to drift off. Then he turns and holds out his hand — this time it really is to shake.'),
      kai('happy', 'おめでとう。……次は抜く。', '恭喜。……下次我会超过你。', 'Congratulations. ...Next time I’m passing you.'),
      nar('他的手很干，握得很用力，一下就松开了。他没有说"运气好"，也没有说"我没认真"。他只说了下次。',
        'His hand is dry, the grip hard, and he lets go at once. He doesn’t say you were lucky, or that he wasn’t really trying. He only says next time.'),
      { type: 'effect', setFlags: ['kai2_won'], effects: [{ stat: 'guts', amount: 2, reasonZh: '你赢了一次，而且对方认了', reasonEn: 'You won one, and he conceded it cleanly' }] }
    ],
    otherwise: [
      nar('他在第九。你在第二十三。', 'He is ninth. You are twenty-third.', face('neutral')),
      nar('你还没想好该说什么，他已经把你的国语卷子从你手里抽了过去，翻到作文那一页，用手指点了三个地方。',
        'Before you have worked out what to say, he has slid your Japanese paper out of your hand, turned to the essay and is tapping three places with a finger.'),
      kai('thinking', 'お前の作文、助詞で三点落としてる。「に」と「で」。ここだけ直してたら、俺より上やった。',
        '你的作文，助词上丢了三分。「に」和「で」。光改这几个地方，你就在我前面了。',
        'Your essay dropped three marks on particles. ni and de. Fix just those and you’d have been above me.'),
      nar('他把自己的笔记本递过来，封面上写着「助詞」两个大字，字很丑，里面贴满了便利贴。',
        'He hands over a notebook with PARTICLES written across the cover in big ugly letters, stuffed with sticky notes.'),
      kai('smug', '貸すだけさ。次、俺に勝てんかったら言い訳できんようにな。', '只是借你。下次你要是还赢不了我，就没借口了。', 'It’s a loan. So next time, if you still can’t beat me, you’ve got no excuse.'),
      { type: 'effect', setFlags: ['kai2_lost'], effects: [{ stat: 'proficiency', amount: 3, reasonZh: '金城的助词笔记', reasonEn: 'Kinjo’s particle notes' }] }
    ]
  },
  { type: 'scene', scene: 'rooftop_day' },
  nar('午休你在天台上找到他。他在吃一个很大的饭团，看着港口那边。', 'At lunch you find him on the roof, eating a huge onigiri and looking out towards the harbour.', face('neutral')),
  nar('你问他英语考了多少。他说九十八。你说那挺好。他咽下去，说了一句你没想到的话。', 'You ask what he got in English. Ninety-eight, he says. You say that’s good. He swallows, and says something you did not expect.'),
  kai('neutral', '英語は、俺も中一から。……みんな、俺が家で英語しゃべっとると思っとるさ。母ちゃんは沖縄の人だし、親父は六つの時にアメリカ帰ったし。',
    '英语，我也是初一才开始的。……大家都以为我在家说英语。我妈是冲绳人，老爸在我六岁的时候就回美国了。',
    'I started English in junior high, same as anyone. ...Everyone thinks I speak English at home. My mum’s Okinawan, and my dad went back to America when I was six.'),
  nar('他说得很快，像是在把一件很重的东西快速地从一只手换到另一只手。', 'He says it quickly, like someone passing something heavy from one hand to the other before it can hurt.'),
  kai('smug', 'だから九十八点は、俺が勉強した九十八点さ。親父の点数じゃない。', '所以这九十八分，是我自己念出来的九十八分。不是我老爸的分。', 'So that ninety-eight is a ninety-eight I studied for. It isn’t my dad’s score.'),
  { type: 'effect', setFlags: ['rival_ch2_done'], effects: [{ stat: 'knowledge', amount: 2, reasonZh: '和金城比了一场期中考试', reasonEn: 'A midterm against Kinjo' }] }
];

// ==========================================================
// 第三章 · ワン・オン・ワン
// ==========================================================
const R3: StoryNode[] = [
  { type: 'scene', scene: 'gym', bgm: 'basketball', titleZh: '宿敌 · 一对一', titleEn: 'Rival · One on One', subtitleZh: '六月 · 放学后的体育馆', subtitleEn: 'June · The gym after school' },
  nar('男篮的练习结束得早。金城没走，拿着一个球在三分线外一下一下地运。', 'Boys’ basketball finishes early. Kinjo hasn’t left; he is outside the three-point line bouncing a ball, steady as a metronome.', face('smug')),
  kai('smug', '一対一。五点先取。逃げる？', '一对一。先拿五分的赢。要逃吗？', 'One on one. First to five. Running away?'),
  nar('你从来没打过篮球，除了跟空在体育课上投过几个球。你看了一眼场边——空正在收女篮的球，听见了，停下来了。',
    'You have never played basketball beyond a few shots with Sora in PE. You glance at the side of the court — Sora is gathering the girls’ team balls; she has heard, and stopped.'),
  {
    type: 'narration', characterImage: `${S}school_cool.webp`,
    zh: '空把一个球抱在腰上，冲你扬了扬下巴：「やれば？見とったるわ」。',
    en: 'Sora tucks a ball on her hip and tips her chin at you: go on, then. I’ll watch.'
  },
  {
    type: 'choice',
    promptZh: '你接过他抛来的球。', promptEn: 'You catch the ball he tosses you.',
    options: [
      {
        id: 'kai3_straight', labelZh: '正面硬冲', labelEn: 'Go straight at him',
        hintZh: '你一定会输，但不能先认输', hintEn: 'You will certainly lose. You do not have to lose first.',
        effects: [{ stat: 'guts', amount: 3, reasonZh: '明知会输还是正面冲了上去', reasonEn: 'You went straight at him knowing you would lose' }],
        setFlags: ['kai3_straight'],
        then: [nar('你冲了五次，被他断了五次。第五次你摔在地板上，他伸手把你拉起来。', 'You drive five times and he strips you five times. The fifth time you hit the floor; he reaches down and hauls you up.', face('happy'))]
      },
      {
        id: 'kai3_fake', labelZh: '先观察他的脚，再假动作', labelEn: 'Watch his feet first, then fake',
        hintZh: '你看得出他每次都先移右脚', hintEn: 'You notice he always moves his right foot first.',
        requires: { stat: 'knowledge', min: 12 },
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你在球场上也在观察', reasonEn: 'You kept observing, even on court' }, { stat: 'charm', amount: 1, reasonZh: '一个漂亮的假动作', reasonEn: 'One very tidy fake' }],
        setFlags: ['kai3_fake'],
        then: [nar('你往左晃了一下。他的右脚先动了——跟你看到的一样。你从右边过去了，球没进，但你过去了。', 'You dip left. His right foot moves first, exactly as you had seen. You get past on the right. The shot misses, but you got past.', face('surprised'))]
      }
    ]
  },
  {
    type: 'check', metric: 'guts', min: 12,
    then: [
      nar('最后比分是五比一。那一分是你在他面前、在他的手指尖上方投进去的。球在篮筐上转了一圈半才掉进去，你和他都盯着它看完了那一圈半。',
        'It ends five–one. The one is a shot you put up in front of him, over his fingertips. It rolls round the rim one and a half times before dropping, and the two of you watch every inch of it.'),
      kai('laugh', '一点取られた。……でーじ悔しい。', '被你拿了一分。……超级不甘心。', 'You got one off me. ...That really stings.'),
      { type: 'effect', setFlags: ['kai3_scored'] }
    ],
    otherwise: [
      nar('最后比分是五比零。你一分都没拿到，但你的脚一直没有停。', 'It ends five–nil. You don’t get a point, but your feet never stop moving.'),
      kai('neutral', '点数はゼロ。でも、最後まで足が止まらんかった。', '分数是零。不过你的脚到最后都没停。', 'Zero points. But your feet didn’t stop, right to the end.')
    ]
  },
  {
    type: 'speech', speakerZh: '空', speakerEn: 'Sora', characterImage: `${S}school_happy.webp`,
    jp: 'あんたら、明日の朝も来るんやろ？七時。ウチ、鍵開けといたるわ。',
    zh: '你们俩，明天早上也会来吧？七点。我来开门。',
    en: 'You two are coming tomorrow morning too, yeah? Seven. I’ll unlock.',
    color: 'bg-orange-500'
  },
  nar('金城看了你一眼。你看了他一眼。没有人说"好"，但第二天早上七点，体育馆里有三个人。',
    'Kinjo looks at you. You look at him. Nobody says yes, but at seven the next morning there are three people in the gym.', ''),
  { type: 'effect', setFlags: ['rival_ch3_done'], effects: [{ stat: 'guts', amount: 2, reasonZh: '早上七点的体育馆', reasonEn: 'The gym at seven in the morning' }], relations: [{ char: CharacterId.SORA, familiarity: 4, affection: 2, reasonZh: '她替你们开了门', reasonEn: 'She unlocked the gym for you' }] }
];

// ==========================================================
// 第四章 · パンフレットの写真
// ==========================================================
const R4: StoryNode[] = [
  { type: 'scene', scene: 'school_gate', bgm: 'afternoon', titleZh: '宿敌 · 招生手册的照片', titleEn: 'Rival · The Brochure Photo', subtitleZh: '七月 · 校门前', subtitleEn: 'July · In front of the school gate' },
  nar('教导主任说要给明年的招生手册拍一页照片，标题已经想好了：「国際色豊かな港見高校」。被叫来的是你和金城。',
    'The vice principal wants a page for next year’s prospectus, and the headline is already decided: "Minatomi High — A Truly International School". The two people summoned are you and Kinjo.'),
  nar('摄影师递过来两面小旗子。给你的是你自己国家的。给金城的是星条旗。', 'The photographer hands out two little flags. Yours is your own country’s. Kinjo’s is the Stars and Stripes.', face('neutral')),
  kai('neutral', '……俺、パスポート日本のしかないっすよ。', '……我只有日本的护照啊。', '...I’ve only got a Japanese passport, though.'),
  nar('教导主任笑了，笑得很和气：「ええやん、雰囲気、雰囲気。お父さん、アメリカの方やろ？」', 'The vice principal laughs, very kindly. "Oh, it’s about the feel of it. Your father’s American, isn’t he?"'),
  nar('然后又补了一句，像是想让气氛更好一点：「沖縄、ええとこやねえ。海きれいで」。', 'And then, as if to warm things up: "Okinawa’s such a lovely place. The sea’s so beautiful."'),
  kai('smug', '基地もありますよ。でっかいのが。', '还有基地哦。很大的那种。', 'There’s the base too. A big one.'),
  nar('教导主任笑出了声，以为这是个笑话。摄影师没笑，假装在调光圈。金城手里那面小旗子垂着，没有举起来，也没有放下。',
    'The vice principal laughs out loud, taking it for a joke. The photographer doesn’t laugh; he pretends to fiddle with the aperture. The little flag hangs from Kinjo’s hand, neither raised nor put down.'),
  {
    type: 'choice',
    promptZh: '摄影师说「じゃあ、二人とも旗を胸の前に」。', promptEn: 'The photographer says right, both of you, flags in front of your chest.',
    options: [
      {
        id: 'kai4_refuse', labelZh: '「那我也不拿旗了。」', labelEn: '"Then I won’t hold a flag either."', jp: 'じゃあ、僕も旗はいいです。',
        hintZh: '会让大人下不来台', hintEn: 'An adult will lose face.',
        requires: { stat: 'guts', min: 14 },
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你在大人面前放下了旗子', reasonEn: 'You put the flag down in front of the adults' }, { stat: 'kindness', amount: 2, reasonZh: '你站到了他那一边', reasonEn: 'You stood on his side' }],
        setFlags: ['kai4_refused'],
        then: [
          nar('你把旗子递回给摄影师。教导主任的笑容停了半秒，然后说「まあ、ほな、普通に」。照片里你们俩穿着校服站在校门前，没有旗子，看上去就是两个高中生。',
            'You hand your flag back. The vice principal’s smile stops for half a second, then he says well, fine then, just normal. In the photo the two of you stand in uniform at the gate with no flags, looking like exactly what you are: two high-school boys.'),
          kai('surprised', '……お前、意外とやるな。', '……你这家伙，比我想的有种。', '...You’ve got more nerve than I thought.')
        ]
      },
      {
        id: 'kai4_suggest', labelZh: '「拍全班的合照不是更国际吗？」', labelEn: '"Wouldn’t a whole-class photo be more international?"', jp: 'クラス全員で撮った方が、国際的じゃないですか。',
        hintZh: '给大人一个台阶', hintEn: 'Give the adult a way out.',
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你给了所有人一个台阶', reasonEn: 'You gave everyone a way down' }],
        setFlags: ['kai4_suggested'],
        then: [
          nar('教导主任想了想，居然觉得很好。最后那一页用的是二年B班三十六个人在操场上的合照，标题没改。金城站在最后一排，比别人高出半个头，没拿任何东西。',
            'The vice principal thinks about it and, surprisingly, likes it. The page ends up as all thirty-six of 2-B on the sports field, headline unchanged. Kinjo is in the back row, half a head above everyone, holding nothing.'),
          kai('happy', '……うまいこと言うさ。', '……你倒挺会说。', '...Smooth.')
        ]
      },
      {
        id: 'kai4_silent', labelZh: '什么也不说，举起旗子', labelEn: 'Say nothing and raise the flag',
        hintZh: '这不是你的事', hintEn: 'This is not your business.',
        setFlags: ['kai4_silent'],
        then: [
          nar('你举起了旗子。金城看了你一眼，然后也举起来了，举得笔直，脸上是一个标准的、无可挑剔的笑。照片拍得很好。你在那张照片里看不出他在想什么，这一点比什么都难受。',
            'You raise your flag. Kinjo glances at you, then raises his too, perfectly straight, with a regulation, faultless smile. The photo comes out well. You cannot tell from it what he was thinking, and that is worse than anything.')
        ]
      }
    ]
  },
  { type: 'scene', scene: 'rooftop_sunset' },
  nar('放学后他在天台上。你上来的时候他没回头。', 'After school he is on the roof. He doesn’t turn round when you come up.', face('thinking')),
  kai('thinking', '本土の人はさ、沖縄が好きなんよ。海と、ソーキそばと、三線と。……基地以外、ぜんぶ。',
    '本土的人啊，都喜欢冲绳。海、排骨面、三线。……除了基地，什么都喜欢。',
    'People on the mainland love Okinawa, you know. The sea, soki soba, the sanshin. ...Everything except the base.'),
  kai('neutral', '沖縄は、都合のいい時だけ日本なんさ。俺も、たぶん同じ。', '冲绳只在方便的时候才算日本。我大概也一样。', 'Okinawa only counts as Japan when it’s convenient. Probably me too.'),
  nar('你问他为什么转来神户。他说是母亲工作调动。说完停了一下，又说了一句。', 'You ask why he transferred to Kobe. His mother’s job, he says. Then he pauses, and adds something.'),
  kai('neutral', 'それと……ここなら、誰も俺のこと知らんから。からっぽから始められると思った。お前と同じさ。',
    '还有……在这儿，谁都不认识我。我以为能从零开始。跟你一样。',
    'And... nobody here knows me. I thought I could start from empty. Same as you.'),
  nar('他转过来，表情一下子恢复成了平时那个样子。', 'He turns round, and his face is already back to its usual self.', face('smug')),
  kai('smug', '同情はいらんよ。代わりに、次の勝負で手ぇ抜くな。それだけ。', '不需要同情。作为交换，下一场比赛你别放水。就这样。', 'I don’t want sympathy. In exchange, don’t go easy on me next time. That’s all.'),
  { type: 'effect', setFlags: ['rival_ch4_done'], effects: [{ stat: 'kindness', amount: 2, reasonZh: '你听见了"基地以外，全部"', reasonEn: 'You heard "everything except the base"' }] }
];

// ==========================================================
// 第五章 · 弁論大会
// ==========================================================
const R5: StoryNode[] = [
  { type: 'scene', scene: 'school_auditorium_stage', bgm: 'reflective', titleZh: '宿敌 · 演讲比赛', titleEn: 'Rival · The Speech Contest', subtitleZh: '九月 · 礼堂', subtitleEn: 'September · The assembly hall' },
  nar('校内演讲比赛。老师本来让金城报英语组——"你肯定有优势"。他报了日语组。你也在日语组，因为你是留学生，老师觉得"对你是个好机会"。',
    'The school speech contest. His teacher wanted Kinjo in the English section — "you’ll have an advantage". He signed up for Japanese. You are in Japanese too, because you are an exchange student and your teacher thought it would be "a good opportunity for you".'),
  nar('后台很窄，你们俩挤在同一块幕布后面，各自拿着稿子，谁也没看谁。', 'Backstage is narrow. The two of you are squeezed behind the same curtain, each holding a script, neither looking at the other.', face('neutral')),
  kai('neutral', '……手、震えとるぞ。', '……你手在抖。', '...Your hands are shaking.'),
  nar('你说他的也在抖。他低头看了一眼，承认了。', 'You say so are his. He looks down and admits it.'),
  {
    type: 'choice',
    promptZh: '轮到你了。你的稿子写的是——', promptEn: 'It is your turn. Your speech is about —',
    options: [
      {
        id: 'kai5_words', labelZh: '「在神户学会的一个词」', labelEn: '"One word I learned in Kobe"',
        effects: [{ stat: 'proficiency', amount: 3, reasonZh: '你在台上用日语讲完了一个词的来历', reasonEn: 'You told the story of a word in Japanese, on stage' }],
        setFlags: ['kai5_topic_words'],
        then: [nar('你讲的是「おおきに」。第一次听见的时候你以为是「大きい」。台下有人笑了，是好的那种笑。', 'You talk about ookini. The first time you heard it you thought it meant big. Somebody in the audience laughs, the good kind of laugh.')]
      },
      {
        id: 'kai5_journal', labelZh: '「外公的手账」', labelEn: '"My grandfather’s journal"',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '六十年前的神户', reasonEn: 'Kobe sixty years ago' }, { stat: 'kindness', amount: 1, reasonZh: '你讲的是别人的一年', reasonEn: 'You told someone else’s year' }],
        setFlags: ['kai5_topic_journal'],
        then: [nar('你讲外公在这座城市过的那一年：五十日元的乌冬、走了七百多次的坡。讲到一半你忘了紧张。', 'You talk about the year your grandfather spent in this city: fifty-yen udon, a hill climbed seven hundred-odd times. Halfway through you forget to be nervous.')]
      },
      {
        id: 'kai5_rival', labelZh: '「坐在我旁边的转学生」', labelEn: '"The transfer student next to me"',
        hintZh: '他就在后台听着', hintEn: 'He is listening from the wings.',
        requires: { stat: 'charm', min: 20 },
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你当着全校讲了你的对手', reasonEn: 'You spoke about your rival in front of the whole school' }],
        setFlags: ['kai5_topic_rival'],
        then: [nar('你讲的是开学第一天伸过来的那只手，掌心朝上，手指勾了两下。你没说名字，但礼堂里有一半人往后台看了一眼。', 'You talk about a hand held out on the first day of term, palm up, two fingers crooking. You do not say a name, but half the hall glances towards the wings.')]
      }
    ]
  },
  nar('你讲完的时候，礼堂里的掌声比你想的长一点。你下台的时候，他在幕布后面没说话，只是用拳头在你肩膀上碰了一下。',
    'When you finish, the applause runs a little longer than you expected. As you come off, he says nothing behind the curtain; he just bumps your shoulder with his fist.'),
  { type: 'branch', ifFlag: 'kai5_topic_rival', then: [kai('surprised', '……人のこと、勝手に題にすんなや。', '……别随便拿别人当题目啊。', '...Don’t go turning people into your topic without asking.'), nar('他说这句话的时候耳朵是红的。', 'His ears are red as he says it.')] },
  nar('然后是他。他的题目只有两个字：「フェンス」。', 'Then it is his turn. His title is a single word: "Fence".', face('neutral')),
  eventKai('rival_speech'),
  kai('neutral', 'フェンスの向こうに、親父がいました。こっち側に、俺と母ちゃんがいました。……日本の人は、俺をどっち側に数えるんだろうって、ずっと考えてました。',
    '铁丝网的那一边，是我老爸。这一边，是我和我妈。……我一直在想，日本的人，会把我算在哪一边。',
    'On the other side of the fence was my father. On this side were me and my mum. ...I’ve always wondered which side the people of Japan count me on.'),
  nar('礼堂里很安静。他讲完之后掌声很整齐、很礼貌，像在会议上通过一项议程。', 'The hall is very quiet. When he finishes, the applause is neat and polite, like a motion being carried at a meeting.'),
  nar('下一个上台的是一年级的女生，题目是「沖縄旅行で見た青い海」。她讲到海龟的时候，礼堂里笑声和掌声都比刚才大。金城在幕布后面也笑了，笑得很轻，像一个早就知道结果的人。',
    'Next up is a first-year girl: "The Blue Sea I Saw on My Okinawa Holiday". When she gets to the sea turtles, the laughter and applause are bigger than anything so far. Behind the curtain, Kinjo laughs too, very softly, like someone who knew how it would go.'),
  {
    type: 'check', metric: 'proficiency', min: 30,
    then: [
      nar('结果公布：第一名是你。第二名是金城。', 'The results: first place, you. Second, Kinjo.'),
      kai('happy', 'おめでとう。……今日は、ほんまに負けた。', '恭喜。……今天是真的输了。', 'Congratulations. ...Today I really lost.'),
      nar('他说"本当に"的时候，没有一点不情愿。你反而有点说不出话。你知道这一次你赢在日语，他输在别的东西上——那个东西不是他的错。',
        'There is no reluctance at all in the way he says "really". It leaves you rather speechless. You know you won on the Japanese this time, and he lost on something else, and that something else was not his fault.'),
      { type: 'effect', setFlags: ['kai5_won'], effects: [{ stat: 'proficiency', amount: 3, reasonZh: '你在演讲比赛上赢了', reasonEn: 'You won the speech contest' }] }
    ],
    otherwise: [
      nar('结果公布：第一名是金城。你是第三。', 'The results: first place, Kinjo. You are third.'),
      kai('neutral', '……お前の、最後の一文。あれ、文法ちょっと崩れとった。でも、一番よかったのもあそこさ。', '……你最后那一句。语法有点乱。不过整篇最好的也是那一句。', '...Your last line. The grammar went a bit wrong. But it was also the best bit of the whole thing.'),
      kai('smug', '次は手加減せんで。——いや、今日も手加減はしとらん。お前の勝ちが本物になる日、待っとくさ。',
        '下次我不会放水。——不对，今天也没放水。我等着你赢得名正言顺的那一天。',
        'Next time I won’t hold back. — No, I didn’t hold back today either. I’ll be waiting for the day you win it for real.'),
      { type: 'effect', setFlags: ['kai5_lost'], effects: [{ stat: 'proficiency', amount: 2, reasonZh: '他指出了你最后一句的语法', reasonEn: 'He pointed out the grammar of your last line' }] }
    ]
  },
  { type: 'effect', setFlags: ['rival_ch5_done'], effects: [{ stat: 'guts', amount: 2, reasonZh: '你在全校面前站上了台', reasonEn: 'You stood up in front of the whole school' }] }
];

// ==========================================================
// 第六章 · フェンスの向こう（修学旅行之后）
// ==========================================================
const R6: StoryNode[] = [
  { type: 'scene', scene: 'kobe_harbor_night', bgm: 'late_night', titleZh: '宿敌 · 铁丝网的那一边', titleEn: 'Rival · The Other Side of the Fence', subtitleZh: '十一月 · 修学旅行回来之后 · 夜晚的港口', subtitleEn: 'November · After the school trip · The harbour at night' },
  nar('修学旅行回来的第二天晚上，他发消息叫你出来。港口的风已经是冬天的风了。', 'The second night after the school trip, he messages you to come out. The wind off the harbour is already a winter wind.', face('neutral', 'casual')),
  nar('他穿着一件旧旧的橄榄绿外套，袖子长了一截。胸口那块缝名牌的地方是一个空的长方形，线头还在。', 'He is wearing a faded olive-green jacket, the sleeves a little too long. On the chest is an empty rectangle where a name tape used to be, the threads still there.'),
  kai('neutral', '自由行動の日、班抜けて、家の方まで行ってきた。宜野湾。……フェンス見に。', '自由活动那天，我离队了，回了趟家那边。宜野湾。……去看铁丝网。', 'On the free-time day I ditched the group and went home. Ginowan. ...To look at the fence.', 'casual'),
  { type: 'scene', scene: 'okinawa_fence_sunset' },
  nar('他讲的时候，你脑子里出现的是一道很长的铁丝网，从一条马路的这头拉到那头，上面卷着带刺的铁丝，另一边是一大片修剪得很整齐的草地，草地尽头有几栋白色的房子。',
    'As he talks, what comes into your head is a very long wire fence running from one end of a road to the other, coils of razor wire along the top, and on the far side a huge, neatly mown lawn with a few white buildings at the end of it.'),
  eventKai('rival_fence'),
  kai('sad', '親父、毎年誕生日にカード送ってくる。「Happy Birthday, Kai」だけ。六つの時に読めた英語、それだけやったから。……今年のカードも、それだけやった。',
    '老爸每年生日寄一张卡。只写「Happy Birthday, Kai」。六岁的时候我能看懂的英语，就只有这一句。……今年那张，也只有这一句。',
    'My dad sends a card every birthday. Just "Happy Birthday, Kai". At six that was all the English I could read. ...This year’s card said just that, too.', 'casual'),
  { type: 'scene', scene: 'kobe_harbor_night' },
  nar('他说班上的人在美国村买了很多东西，美式的T恤、汉堡形状的钥匙扣，大家都说「アメリカっぽくてかわいい」。他笑了一下，没说那句话哪里让他不舒服，你也没问。',
    'He says people in the class bought loads of things at American Village — American-style T-shirts, burger-shaped keyrings — and everyone said they were "so cute, so American". He laughs a little and doesn’t say what about that bothered him. You don’t ask.', face('neutral', 'casual')),
  {
    type: 'choice',
    promptZh: '他看着海，没有再说话。', promptEn: 'He looks at the sea and says nothing more.',
    options: [
      {
        id: 'kai6_father', labelZh: '「你想见你爸吗？」', labelEn: '"Do you want to see your dad?"', jp: 'お父さんに、会いたい？',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你问了最难问的那一句', reasonEn: 'You asked the hardest question' }],
        setFlags: ['kai6_asked_father'],
        then: [
          kai('thinking', '……わからん。', '……不知道。', '...I don’t know.', 'casual'),
          kai('neutral', 'わからんって言えるようになったの、最近さ。前は「会いたくない」って言っとった。そっちの方が楽やったから。',
            '能说出"不知道"，是最近的事。以前我都说"不想见"。因为那样比较轻松。',
            'Being able to say "I don’t know" is new. I used to say "I don’t want to". It was easier.', 'casual')
        ]
      },
      {
        id: 'kai6_side', labelZh: '「两边都不算的话，就算我这边。」', labelEn: '"If neither side counts you, count yourself on mine."', jp: 'どっち側でもないなら、こっち側に来ればいい。',
        requires: { stat: 'charm', min: 26 },
        effects: [{ stat: 'charm', amount: 3, reasonZh: '你给了他一个"这一边"', reasonEn: 'You offered him a side' }],
        setFlags: ['kai6_this_side'],
        then: [
          kai('laugh', 'お前の「こっち側」か。……せまいなあ、こっち側。', '你的"这一边"啊。……真窄啊，这一边。', 'Your "side", huh. ...Pretty cramped, this side.', 'casual'),
          nar('他笑得很大声，把旁边钓鱼的大叔吓了一跳。', 'He laughs loudly enough to make a man fishing nearby jump.')
        ]
      },
      {
        id: 'kai6_stay', labelZh: '什么也不说，陪他看海', labelEn: 'Say nothing, and look at the sea with him',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你没有急着说点什么', reasonEn: 'You did not rush to say something' }],
        setFlags: ['kai6_stayed'],
        then: [nar('你们看了很久的海。一艘渡轮开过去，船上的灯一层一层地亮着，像一栋横着漂走的楼。', 'You look at the sea for a long time. A ferry slides by with its lights on deck after deck, like a building drifting away on its side.')]
      }
    ]
  },
  nar('回去的时候，他把狗牌从领口里拿出来给你看。牌子上什么字都没有，磨得很亮。', 'On the way back he pulls the dog tag out of his collar to show you. There is nothing written on it at all; it has been worn smooth and bright.', face('neutral', 'casual')),
  kai('smug', '親父の予備のやつ。字、俺がこすって消した。……中身は、自分で書くさ。', '老爸备用的那块。上面的字，是我自己磨掉的。……里面写什么，我自己来写。', 'Dad’s spare. I rubbed the writing off myself. ...What goes on it, I’ll write.', 'casual'),
  { type: 'effect', setFlags: ['rival_ch6_done'], effects: [{ stat: 'kindness', amount: 2, reasonZh: '冬天的港口和一块没有字的狗牌', reasonEn: 'A winter harbour and a dog tag with nothing on it' }] }
];

// ==========================================================
// 第七章 · 最後の勝負
// ==========================================================
const R7: StoryNode[] = [
  { type: 'scene', scene: 'kitano_slope_dawn', bgm: 'morning', titleZh: '宿敌 · 最后一场', titleEn: 'Rival · The Last Match', subtitleZh: '三月 · 北野坂 · 早上六点', subtitleEn: 'March · Kitano-zaka · Six in the morning' },
  nar('三月。你的机票已经订好了。金城发来一条消息，只有一行：「明日六時、北野坂の下。最後の勝負」。', 'March. Your ticket is booked. A message from Kinjo, one line: tomorrow, six, bottom of Kitano-zaka. Last match.'),
  nar('天刚亮。他在坡底做拉伸，穿着那件橄榄绿外套。坡道很陡，一直通到异人馆那边，路灯还亮着。', 'It is barely light. He is stretching at the foot of the slope in the olive jacket. The hill is steep, all the way up to the old foreign houses, and the streetlamps are still on.', face('smug', 'casual')),
  kai('smug', '坂の上まで。先に着いた方の勝ち。ルールはそれだけ。', '跑到坡顶。先到的赢。规则就这些。', 'To the top. First one there wins. That’s the only rule.', 'casual'),
  {
    type: 'check', metric: 'guts', min: 40,
    then: [
      nar('你跑到一半就喘不上气了。他在你左边，差半步。到坡顶前最后那一段你什么都没想，只想着那半步。',
        'Halfway up you can’t breathe. He is on your left, half a step ahead. On the last stretch before the top you think of nothing except that half step.'),
      nar('你们一起撞在了坡顶的栏杆上。谁先到的，谁也说不清。', 'You hit the railing at the top together. Neither of you can say who got there first.', face('laugh', 'casual')),
      kai('laugh', '……同着。最後の最後で、同着かい。', '……同时到。最后的最后，居然是同时到。', '...A dead heat. The very last one, and it’s a dead heat.', 'casual'),
      { type: 'effect', setFlags: ['kai7_tie'] }
    ],
    otherwise: [
      nar('他比你早到了五步。你到坡顶的时候他已经靠在栏杆上，在等你，没有一点要嘲笑你的意思。', 'He reaches the top five strides ahead. When you get there he is already leaning on the railing waiting, without the faintest hint of mockery.', face('happy', 'casual')),
      kai('happy', '一年前のお前やったら、半分で止まっとったさ。', '一年前的你，跑到一半就停了。', 'The you from a year ago would’ve stopped halfway.', 'casual'),
      { type: 'effect', setFlags: ['kai7_lost'] }
    ]
  },
  nar('从坡顶能看见整个神户，港口、塔、你住了一年的那条街。天一点一点亮起来。', 'From the top you can see the whole of Kobe — the harbour, the tower, the street you have lived on for a year. The sky is coming up bit by bit.', face('thinking', 'casual')),
  kai('thinking', 'お前がおらんようになったらさ。このクラスで俺が一番になっても、誰も悔しがらんやん。……それ、つまらんなあって。',
    '你走了以后啊。就算我在这个班当了第一，也没人会不甘心了。……那多没意思。',
    'Once you’re gone. Even if I come top of the class, nobody’ll be annoyed about it. ...That’s no fun.', 'casual'),
  nar('他从口袋里掏出一个很小的钥匙扣，是一只陶瓷的风狮爷，张着嘴。', 'He takes a tiny keyring out of his pocket: a little ceramic shisa lion, mouth open.'),
  kai('neutral', 'シーサーは二匹でひとつさ。口開けとるのと、閉じとるの。閉じとる方は、俺が持っとく。',
    '风狮爷是两只一对的。一只张着嘴，一只闭着嘴。闭嘴的那只，我留着。',
    'Shisa come in pairs. One with its mouth open, one with it shut. I’ll keep the shut one.', 'casual'),
  {
    type: 'choice',
    promptZh: '你接过那只张着嘴的风狮爷。', promptEn: 'You take the one with its mouth open.',
    options: [
      {
        id: 'kai7_promise', labelZh: '「回去以后我也当第一给你看。」', labelEn: '"I’ll come top back home. You’ll see."', jp: '帰ったら、向こうで一番になってやる。',
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你接下了最后一场没有终点的比赛', reasonEn: 'You accepted a last match with no finish line' }],
        setFlags: ['kai7_promised'],
        then: [kai('smug', 'おう。なったら連絡しろ。俺はこっちで一番になっとく。勝負はまだ終わってないさ。', '好。当上了就告诉我。我在这边当第一。比赛还没完呢。', 'Deal. Let me know when you do. I’ll be top over here. This isn’t over.', 'casual')]
      },
      {
        id: 'kai7_thanks', labelZh: '「谢谢你，这一年一直跟我比。」', labelEn: '"Thanks for competing with me all year."', jp: '一年間、ずっと勝負してくれて、ありがとう。',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你把"谢谢"说出口了', reasonEn: 'You actually said thank you' }],
        setFlags: ['kai7_thanked'],
        then: [
          kai('surprised', '……やめろや、そういうの。', '……别这样啊，这种话。', '...Cut that out.', 'casual'),
          nar('他转过头去看海。你看见他用袖子擦了一下脸，很快，快得可以当作没看见。', 'He turns to look at the sea. You see him wipe his face with his sleeve, quickly, quickly enough that you could pretend not to have seen.')
        ]
      }
    ]
  },
  nar('下坡的时候你们没有比赛，一前一后走着，路灯一盏一盏地灭了。你想起开学第一天他伸过来的那只手，掌心朝上，手指勾了两下。你现在知道他要的是什么了——不是输赢，是一个肯跟他比的人。',
    'You do not race on the way down. You walk, one ahead of the other, and the streetlamps go out one by one. You think of the hand he held out on the first day, palm up, two fingers crooking. You know now what he was asking for. Not a result. Someone willing to compete with him.', ''),
  {
    type: 'effect', setFlags: ['rival_ch7_done', 'rival_done'],
    effects: [
      { stat: 'guts', amount: 3, reasonZh: '和金城的最后一场', reasonEn: 'The last match with Kinjo' },
      { stat: 'charm', amount: 2, reasonZh: '一只张着嘴的风狮爷', reasonEn: 'A shisa with its mouth open' }
    ]
  }
];

// 宿敌线里的两张事件 CG（data/eventCgs.ts 里登记）
function eventKai(key: 'rival_speech' | 'rival_fence'): StoryNode {
  const d = key === 'rival_speech'
    ? { titleZh: 'フェンス', titleEn: 'Fence', captionZh: '他的题目只有两个字。讲台上的灯很亮，他的手还在抖。', captionEn: 'His title is a single word. The stage lights are very bright, and his hands are still shaking.' }
    : { titleZh: '铁丝网的那一边', titleEn: 'The Other Side of the Fence', captionZh: '宜野湾的黄昏。铁丝网很长，草地修剪得很整齐，另一边有他六岁以前的父亲。', captionEn: 'Dusk in Ginowan. The fence is very long, the lawn neatly mown, and on the far side is the father he had until he was six.' };
  return { type: 'cg', cgId: `cg_ev_${key}`, imageUrl: `/images/cg/cg_ev_${key}.webp`, ...d };
}

// ==========================================================
// 章节表（和主线共用 MainChapterDef：大厅那一栏会显示「宿敌 · …」）
// minDay = 开学第几天（4/11 = 0）
// ==========================================================
const rival = (id: string, n: number, titleZh: string, titleEn: string, teaseZh: string, teaseEn: string, minDay: number, script: StoryNode[], requires: string[]): MainChapterDef =>
  ({ id, n, titleZh, titleEn, teaseZh, teaseEn, minDay, requiresFlags: requires, script, labelZh: '宿敌', labelEn: 'RIVAL' });

export const RIVAL_CHAPTERS: MainChapterDef[] = [
  rival('rival_ch1', 1, '三十六个名字', 'Thirty-Six Names', '金城在黑板上写了一个数字：36', 'Kinjo writes a number on the board: 36', 6, R1, []),
  rival('rival_ch2', 2, '期中考试', 'Midterms', '排名贴出来了。你和他挤到最前面', 'The rankings are up. You both push to the front', 38, R2, ['rival_ch1_done']),
  rival('rival_ch3', 3, '一对一', 'One on One', '「五点先取。逃げる？」', '"First to five. Running away?"', 70, R3, ['rival_ch2_done']),
  rival('rival_ch4', 4, '招生手册的照片', 'The Brochure Photo', '摄影师递过来两面小旗子', 'The photographer hands out two little flags', 98, R4, ['rival_ch3_done']),
  rival('rival_ch5', 5, '演讲比赛', 'The Speech Contest', '他的题目只有两个字', 'His title is one word long', 158, R5, ['rival_ch4_done']),
  rival('rival_ch6', 6, '铁丝网的那一边', 'The Other Side of the Fence', '修学旅行那天，他离队了', 'On the school trip, he slipped away', 220, R6, ['rival_ch5_done', 'trip_day4_done']),
  rival('rival_ch7', 7, '最后一场', 'The Last Match', '「明日六時、北野坂の下」', '"Tomorrow, six, foot of Kitano-zaka"', 336, R7, ['rival_ch6_done'])
];
