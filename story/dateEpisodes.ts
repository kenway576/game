import { CharacterId, StoryFlags, StoryNode, StoryOption } from '../types';
import { Mood } from '../data/outfitContext';

// ---------------------------------------------------------
// 💞 约会专属剧情
//
// 约会本身每次是"一个地方 + 一段小插曲"。约得多了，人和人之间该发生点别的：
// 第三次、第五次、第八次跟同一个人出去，在快要坐下来聊天之前，
// 她会说一些平时不说的话。每个人三段，按次数解锁，第三段还要好感度够。
//
// 这几段跟地点无关——在咖啡店说和在海边说是同一件事——
// 所以只写她和你，不写环境。
// ---------------------------------------------------------

type L = { jp: string; zh: string; en: string };
export interface EpisodeHelpers {
  say: (l: L, m: Mood) => StoryNode;
  img: (m: Mood) => string;
  her: (t: { zh: string; en: string }) => { zh: string; en: string };
}
export interface DateEpisode {
  id: string;
  char: CharacterId;
  after: number;          // 之前已经约过几次（第 after+1 次约会时演）
  minAffection?: number;
  build: (h: EpisodeHelpers) => StoryNode[];
}

// 之前跟她约过几次：每次约会的事件 id 是 date_<角色>_<地点>_d<日序>
export const pastDateCount = (char: CharacterId, flags: StoryFlags): number =>
  Object.keys(flags).filter(k => flags[k] && k.startsWith(`date_${char}_`) && /_d\d+$/.test(k)).length;

const nar = (zh: string, en: string, img?: string): StoryNode => ({ type: 'narration', zh, en, ...(img !== undefined ? { characterImage: img } : {}) });
const j = (jp: string, zh: string, en: string): L => ({ jp, zh, en });
const opt = (c: CharacterId, id: string, labelZh: string, labelEn: string, jp: string | undefined, aff: number, fam: number, then: StoryNode[]): StoryOption => ({
  id, labelZh, labelEn, ...(jp ? { jp } : {}), hintZh: '', hintEn: '',
  relations: [{ char: c, affection: aff, familiarity: fam, reasonZh: labelZh, reasonEn: labelEn }],
  then
});
const choice = (promptZh: string, promptEn: string, options: StoryOption[]): StoryNode =>
  ({ type: 'choice', promptZh, promptEn, options });

const A = CharacterId.ASUKA, H = CharacterId.HIKARI, R = CharacterId.REI, I = CharacterId.INARI;
const M = CharacterId.MIYUKI, S = CharacterId.SORA, N = CharacterId.NAO, K = CharacterId.MAKI;

export const DATE_EPISODES: DateEpisode[] = [
  // ================= 明日香 =================
  {
    id: 'dep_asuka_1', char: A, after: 2,
    build: ({ say, img }) => [
      nar('明日香从书包里拿出一张纸，折了四折，又展开，又折上。你认出来那是上周模拟考的成绩单。', 'Asuka takes a sheet out of her bag, folds it in four, unfolds it, folds it again. You recognise last week\'s mock exam results.', img('neutral')),
      say(j('……全国で二番。また二番。……父はね、「惜しかったな」としか言わないの。毎回。', '……全国第二。又是第二。……我爸啊，每次都只说一句"可惜了"。每一次。', '...Second in the country. Second again. ...My father only ever says "so close". Every time.'), 'sad'),
      choice('她没有看你，看着那张折起来的纸。', 'She is not looking at you. She is looking at the folded paper.', [
        opt(A, 'dep_asuka_1_see', '「二番でも、俺はちゃんと見てるよ。」', '"Second or not, I am watching."', '二番でも、ちゃんと見てるよ。', 8, 4, [
          say(j('……な、何それ。慰めのつもり？ ……下手くそ。……でも、ありがと。', '……什、什么啊。是想安慰我？……笨拙死了。……不过，谢谢。', '...Wh-what is that? Is that meant to comfort me? ...Clumsy. ...But thanks.'), 'shy')
        ]),
        opt(A, 'dep_asuka_1_study', '「じゃあ次は、一緒に勉強しよう。」', '"Then next time, let us study together."', '次は一緒に勉強しよう。', 5, 7, [
          say(j('あんたと？ ……足引っ張られそう。……でも、まあ、一人よりはマシかもね。', '跟你？……感觉会被你拖后腿。……不过，嘛，可能比一个人强。', 'With you? ...You will only slow me down. ...Though I suppose it beats doing it alone.'), 'pout')
        ])
      ]),
      nar('她把那张纸塞回了书包最底下，压在所有课本的下面，像是终于把它放下了一点。', 'She pushes the sheet to the very bottom of her bag, under every textbook, as if she has finally set some of it down.', img('neutral'))
    ]
  },
  {
    id: 'dep_asuka_2', char: A, after: 4,
    build: ({ say, img }) => [
      nar('明日香看了一眼手腕上那块细细的银表。你注意到她每次跟你见面，都会先看一眼这块表。', 'Asuka glances at the slim silver watch on her wrist. You have noticed she always checks it first whenever she meets you.', img('neutral')),
      say(j('この時計ね、三分進めてあるの。遅刻しないように。……中学からずっと。', '这块表啊，调快了三分钟。为了不迟到。……从初中开始一直这样。', 'This watch runs three minutes fast. So I am never late. ...Since middle school.'), 'neutral'),
      nar('她停了一下，把表面转过来给你看。指针和你手机上的时间分毫不差。', 'She pauses, then turns the face towards you. The hands match the time on your phone exactly.'),
      say(j('……あんたと会う日だけ、合わせてるの。三分早く着いて、三分待つの、なんか……嫌だったから。……深い意味はないわよ！', '……只有跟你见面的日子，我才把它调准。早到三分钟、再等三分钟，总觉得……不太舒服。……没什么深意啦！', '...Only on days I meet you, I set it right. Arriving three minutes early and waiting three minutes felt... wrong somehow. ...It does not mean anything!'), 'shy'),
      choice('「没什么深意」这句话，她说得比平时快。', 'She says "it does not mean anything" faster than she says anything else.', [
        opt(A, 'dep_asuka_2_tease', '「待つの、嫌いじゃなかったくせに。」', '"You did not actually mind waiting."', '待つの、嫌いじゃなかったくせに。', 4, 6, [
          say(j('うるさいっ！ ……あんたって、ほんとにそういうとこだけ鋭いんだから。', '吵死了！……你这家伙，真是只在这种地方敏锐。', 'Shut up! ...You are only ever sharp about things like this.'), 'angry')
        ]),
        opt(A, 'dep_asuka_2_same', '把自己的手机时间也拿给她看', 'Show her the time on your own phone', undefined, 7, 3, [
          nar('你把手机屏幕也转过去。两个时间并排着，一样的数字。她看了很久，然后很小声地说："……一緒ね。"', 'You turn your phone screen towards her too. Two times side by side, the same digits. She looks for a long while, then says very quietly: ...the same.', img('shy'))
        ])
      ])
    ]
  },
  {
    id: 'dep_asuka_3', char: A, after: 7, minAffection: 140,
    build: ({ say, img }) => [
      nar('明日香今天话很少。你以为她累了，后来才发现她一直在组织一句话，组织了一路。', 'Asuka has said very little today. You thought she was tired, until you realise she has been assembling one sentence the whole way here.', img('neutral')),
      say(j('……あのね。私、予定表きっちり作るでしょ。十五分刻みで。', '……那个啊。我不是会把日程表排得很满吗。十五分钟一格。', '...Look. You know I make strict schedules. Fifteen-minute blocks.'), 'neutral'),
      say(j('最近、それが全部ぐちゃぐちゃなの。あんたから連絡来るかもって思うと、空けとかなきゃって思っちゃって。……あんたのせいよ。全部。', '最近全乱套了。一想到你可能会联系我，就想着得空出来。……都怪你。全部。', 'Lately it has all gone to pieces. Whenever I think you might message, I leave gaps just in case. ...It is your fault. All of it.'), 'shy'),
      choice('她把"全部"两个字说得很重。', 'She leans hard on the words "all of it".', [
        opt(A, 'dep_asuka_3_take', '「じゃあ、責任取る。」', '"Then I will take responsibility."', 'じゃあ、責任取る。', 12, 3, [
          say(j('……っ！ ば、ばかじゃないの！？ ……どうやって取るのよ。……言ってみなさいよ。ちゃんと、聞いてあげるから。', '……！你、你是笨蛋吗？！……要怎么负责啊。……说说看啊。我会好好听着的。', '...! A-are you stupid?! ...How exactly? ...Go on, say it. I will listen. Properly.'), 'shy')
        ]),
        opt(A, 'dep_asuka_3_schedule', '「その空いてるとこ、全部俺にくれる？」', '"Can I have all those gaps?"', 'その空いてるとこ、全部くれる？', 10, 5, [
          say(j('……全部はあげない。……八割。いえ、九割。……もう、計算させないでよ。', '……不会全给你。……八成。不，九成。……真是的，别让我算这个啦。', '...Not all of them. ...Eighty per cent. No, ninety. ...Honestly, do not make me calculate this.'), 'pout')
        ])
      ]),
      nar('那天回去的路上，她第一次没有看那块表。', 'On the way home that day, for the first time, she does not check her watch.')
    ]
  },

  // ================= 光 =================
  {
    id: 'dep_hikari_1', char: H, after: 2,
    build: ({ say, img }) => [
      nar('光笑了一阵，忽然停下来，捂住了嘴，看了看周围。', 'Hikari laughs for a while, then suddenly stops, covers her mouth and glances around.', img('surprised')),
      say(j('……うち、声でかかった？ よう言われんねん。「光ちゃん、声大きいで」って。小学校からずっと。', '……我刚才声音很大吗？经常被人说。"光，你声音好大哦"。从小学开始就一直这样。', '...Was I loud? People always tell me. "Hikari, you are so loud." Since primary school.'), 'sad'),
      say(j('でもな、{name}といると、なんでか気にならへんねん。気づいたら笑ってて、気づいたら声でかくなってる。', '但是啊，跟{name}在一起的时候，不知道为什么就不在意了。回过神来已经在笑了，回过神来声音已经变大了。', 'But with {name}, somehow I do not notice. Next thing I know I am laughing, and next thing I know I am loud.'), 'shy'),
      choice('她说完自己先不好意思了。', 'She is embarrassed by it before she has finished.', [
        opt(H, 'dep_hikari_1_like', '「その声、好きだよ。」', '"I like your voice."', 'その声、好きだよ。', 9, 3, [
          say(j('……ほんま？ ……ほな、もっとでかい声で笑ったろ！ ……いや、ちょっと待って、今のはやっぱ恥ずいわ。', '……真的？……那我就笑得更大声！……不对，等一下，刚才那句果然好害羞。', '...Really? ...Then I will laugh even louder! ...No, wait, that was too embarrassing after all.'), 'shy')
        ]),
        opt(H, 'dep_hikari_1_loud', '跟着她一起大声笑', 'Laugh out loud along with her', undefined, 5, 7, [
          nar('你笑得比她还响。旁边有人回头看，你们俩笑得更厉害了，笑到最后都说不清在笑什么。', 'You laugh louder than she does. People turn to look, which only makes you both laugh harder, until neither of you can remember what was funny.', img('happy'))
        ])
      ])
    ]
  },
  {
    id: 'dep_hikari_2', char: H, after: 4,
    build: ({ say, img }) => [
      nar('光把手机递过来，说给你看她的相册。三百多张照片，几乎全是吃的：豚まん、ラーメン、たこ焼き、一盘看不出是什么的东西。', 'Hikari hands you her phone to show you her album. Three hundred-odd photos, nearly all food: pork buns, ramen, takoyaki, a plate of something unidentifiable.', img('happy')),
      nar('往下翻到最后，有一张不是吃的。是你。侧脸，有点糊，你完全不记得是什么时候被拍的。', 'Scroll to the end and there is one that is not food. It is you. In profile, slightly blurred. You have no idea when it was taken.'),
      say(j('あっ！ そ、それは、その……ピンボケの練習！ 練習やから！ 消そうと思っててん、ほんまに！', '啊！那、那个是，那个……练习对焦失败的！是练习！我本来打算删掉的，真的！', 'Ah! Th-that is, um... out-of-focus practice! Practice! I was going to delete it, honestly!'), 'surprised'),
      choice('她伸手来抢手机。', 'She reaches to grab the phone back.', [
        opt(H, 'dep_hikari_2_keep', '「消さないで。」', '"Do not delete it."', '消さないで。', 9, 3, [
          say(j('……消さへんよ。最初から消す気なかったもん。……今のも、ナシな！ 聞かんかったことにして！', '……不会删啦。本来就没打算删。……刚才那句也不算！当作没听见！', '...I will not. I never meant to. ...And that does not count either! Pretend you did not hear!'), 'shy')
        ]),
        opt(H, 'dep_hikari_2_retake', '「じゃあ、ちゃんと撮り直そう。二人で。」', '"Then let us take a proper one. Both of us."', 'ちゃんと撮り直そう。', 7, 5, [
          nar('你们俩凑在一起拍了一张。这次不糊。她把它设成了手机壁纸，又马上改了回去，又改了过来。', 'You lean together and take one. Not blurred this time. She sets it as her wallpaper, changes it back at once, then changes it again.', img('happy'))
        ])
      ])
    ]
  },
  {
    id: 'dep_hikari_3', char: H, after: 7, minAffection: 140,
    build: ({ say, img }) => [
      say(j('なあ{name}。うち、なんでも点数つけるやん。豚まん九十点とか。', '呐{name}。我不是什么都打分吗。猪肉包九十分什么的。', 'Hey, {name}. You know how I score everything. Pork buns, ninety, that sort of thing.'), 'neutral'),
      say(j('……{name}にも、ずっとつけよう思っててん。でも、つけられへんねん。百点超えてもうて、メーターが壊れんねん。', '……我一直也想给{name}打个分。可是打不出来。超过一百分了，计分器都坏掉了。', '...I have been meaning to score you too. But I cannot. You go past a hundred and the meter breaks.'), 'shy'),
      nar('她说得很快，说完把脸埋进了围巾——或者袖子——总之是能把脸埋进去的任何东西里。', 'She says it fast, then buries her face in her scarf — or her sleeve — in whatever is nearest that a face can be buried in.', img('shy')),
      choice('你得给点回应。', 'You have to respond to that.', [
        opt(H, 'dep_hikari_3_score', '「じゃあ俺も光に点数つける。……測定不能。」', '"Then I will score you too. ...Off the scale."', '光は、測定不能。', 12, 3, [
          say(j('……ずるい！ それ、うちのセリフやのに！ ……もう、あかん、顔見られへん。', '……狡猾！那是我的台词！……不行了，我没法看你的脸了。', '...Unfair! That is my line! ...No, I cannot look at you now.'), 'shy')
        ]),
        opt(H, 'dep_hikari_3_hand', '什么也不说，把手伸过去', 'Say nothing; hold out your hand', undefined, 11, 4, [
          nar('她从围巾里抬起一只眼睛，看了看你的手，然后握住了。握得很用力，像是怕它跑掉。', 'She raises one eye from her scarf, looks at your hand, and takes it. She grips it hard, as if afraid it might get away.', img('happy'))
        ])
      ])
    ]
  },

  // ================= 铃 =================
  {
    id: 'dep_rei_1', char: R, after: 2,
    build: ({ say, img }) => [
      nar('铃打开那本她一直带着的笔记本，翻到某一页，推到你面前。上面是一张表格：日期、天气、月龄，还有最右边一栏，栏头只写了一个字母。是你名字的首字母。', 'Rei opens the notebook she always carries, turns to a page and slides it over. A table: date, weather, moon age, and one last column headed with a single letter. Your initial.', img('neutral')),
      say(j('あなたが笑った回数です。会うたびに記録しています。……平均、一回につき七・四回。', '这是你笑的次数。每次见面我都有记录。……平均每次七点四回。', 'The number of times you laughed. I record it every time we meet. ...Average, seven point four per meeting.'), 'neutral'),
      choice('你不知道该笑还是不该笑——笑的话，又要被记一次。', 'You cannot decide whether to laugh. If you do, it will be recorded.', [
        opt(R, 'dep_rei_1_why', '「なんでそんなの記録してるの。」', '"Why are you recording that?"', 'なんで記録してるの。', 5, 7, [
          say(j('……分かりません。気づいたら、始めていました。原因を特定するのが、現在の研究課題です。', '……不知道。回过神来已经开始了。找出原因，是我目前的研究课题。', '...I do not know. I found I had started. Identifying the cause is my current research topic.'), 'shy')
        ]),
        opt(R, 'dep_rei_1_laugh', '忍不住笑出来', 'Laugh despite yourself', undefined, 8, 4, [
          nar('你笑了。她拿起笔，在表格上很认真地画了一笔，然后抬起头，嘴角也弯了一下。你决定那一下也应该记进某个表格里。', 'You laugh. She picks up her pen and makes a careful mark, then looks up, and the corner of her mouth curves too. You decide that ought to go in a table somewhere.', img('happy'))
        ])
      ])
    ]
  },
  {
    id: 'dep_rei_2', char: R, after: 4,
    build: ({ say, img }) => [
      nar('铃摘下眼镜擦镜片。你第一次这么近地看见她不戴眼镜的样子，眼睛比你想象的大，也比你想象的茫然。', 'Rei takes off her glasses to clean them. It is the first time you have seen her without them this close. Her eyes are bigger than you thought, and more lost.', img('neutral')),
      say(j('裸眼視力は〇・一です。今、あなたの顔は輪郭しか見えません。', '我的裸眼视力是零点一。现在，我只能看见你脸的轮廓。', 'My uncorrected vision is point one. Right now I can only see the outline of your face.'), 'neutral'),
      say(j('……でも、声で分かります。どこにいても。この前、駅の雑踏の中でも分かりました。', '……不过，我能听出你的声音。在哪儿都能。上次在车站的人群里也听出来了。', '...But I know your voice. Anywhere. Last time, even in the crowd at the station, I knew it.'), 'shy'),
      choice('她还没把眼镜戴回去。', 'She has not put her glasses back on yet.', [
        opt(R, 'dep_rei_2_call', '小声叫她的名字', 'Say her name softly', undefined, 9, 3, [
          nar('她的眼睛准确地找到了你的位置，一点都没偏。"……正解です"，她说，然后才慢慢把眼镜戴回去。', 'Her eyes find exactly where you are, without the slightest error. Correct, she says, and only then slowly puts her glasses back on.', img('happy'))
        ]),
        opt(R, 'dep_rei_2_closer', '往她那边靠近一点', 'Move a little closer to her', undefined, 8, 4, [
          say(j('……輪郭が、大きくなりました。……解像度も、少し上がりました。……これ以上は、心拍数の測定に支障が出ます。', '……轮廓变大了。……分辨率也稍微提高了。……再近的话，会影响心率测量。', '...The outline has grown. ...The resolution has improved slightly too. ...Any closer and it will interfere with measuring my heart rate.'), 'shy')
        ])
      ])
    ]
  },
  {
    id: 'dep_rei_3', char: R, after: 7, minAffection: 140,
    build: ({ say, img }) => [
      say(j('仮説があります。聞いてもらえますか。', '我有一个假说。你愿意听吗。', 'I have a hypothesis. Will you hear it?'), 'neutral'),
      say(j('あなたと会う前日、睡眠時間が平均四十分短くなる。会った日の夜は、記録の字が乱れる。笑った回数の欄だけ、毎回見返してしまう。', '跟你见面的前一天，睡眠时间平均少四十分钟。见面那天晚上，记录的字会写乱。只有"笑的次数"那一栏，我每次都会翻回去看。', 'The night before I see you, I sleep forty minutes less on average. The night after, my handwriting in the records is untidy. And I always go back and reread the column of your laughs.'), 'neutral'),
      say(j('文献によれば、この症状群には名前があります。……「恋」と、呼ばれています。……検証に、協力してもらえますか。', '根据文献，这一组症状有一个名字。……被称为"恋爱"。……你愿意协助我验证吗。', 'According to the literature, this cluster of symptoms has a name. ...It is called "love". ...Will you help me verify it?'), 'shy'),
      choice('她的声音很平，可是握着笔记本的手指是白的。', 'Her voice is level, but the fingers gripping the notebook have gone white.', [
        opt(R, 'dep_rei_3_yes', '「喜んで。……一生かかっても。」', '"Gladly. ...Even if it takes a lifetime."', '喜んで。一生かかっても。', 13, 3, [
          say(j('……一生、ですか。……サンプル期間として、十分です。……ありがとうございます。', '……一辈子吗。……作为样本期间，足够了。……谢谢你。', '...A lifetime. ...That is a sufficient sampling period. ...Thank you.'), 'happy')
        ]),
        opt(R, 'dep_rei_3_same', '「俺も、同じ症状がある。」', '"I have the same symptoms."', '俺も、同じ症状がある。', 12, 4, [
          say(j('……再現性が、確認されました。……これは、重大な発見です。……記録しておきます。いいえ、忘れないので、記録はいりません。', '……可重复性，确认了。……这是重大发现。……我会记录下来。不，不会忘的，不需要记录。', '...Reproducibility confirmed. ...This is a major finding. ...I will record it. No, I will not forget it. No record needed.'), 'shy')
        ])
      ])
    ]
  },

  // ================= 稻荷 =================
  {
    id: 'dep_inari_1', char: I, after: 2,
    build: ({ say, img }) => [
      say(j('のう、人の子。千年のあいだ、妾のところへ来た者はみな、何かを置いていった。米、酒、願い事。', '呐，人类的孩子。一千年里，来到妾身这里的人，都会留下些什么。米、酒、愿望。', 'Child of man. In a thousand years, everyone who came to me left something behind. Rice, sake, wishes.'), 'neutral'),
      say(j('……妾を、どこかへ連れ出そうとした者は、一人もおらなんだ。汝が初めてじゃ。', '……想把妾身带出去走走的人，一个都没有。你是第一个。', '...Not one ever tried to take me anywhere. You are the first.'), 'shy'),
      choice('她说"初めて"的时候，声音轻得像怕被谁听见。', 'When she says "the first", her voice is soft, as if afraid to be overheard.', [
        opt(I, 'dep_inari_1_more', '「じゃあ、これから何度でも連れ出す。」', '"Then I will take you out again and again."', 'これから、何度でも連れ出すよ。', 9, 4, [
          say(j('ふふ……軽々しく言うでない。神との約束は、重いぞ？ ……まあよい。その重さ、汝なら背負えよう。', '呵呵……别说得那么轻巧。跟神的约定，可是很重的哦？……罢了。这份重量，你应该背得起。', 'Hehe... do not say it so lightly. A promise to a god is heavy, you know. ...Well. I think you can carry it.'), 'happy')
        ]),
        opt(I, 'dep_inari_1_ask', '「どこか、行きたいところある？」', '"Is there anywhere you want to go?"', '行きたいところ、ある？', 6, 7, [
          say(j('……考えたこともなかった。……少し、考えさせよ。次に会うときまでに。宿題じゃな、妾の。', '……从来没想过。……让妾身想想。到下次见面之前。算是妾身的作业吧。', '...I have never thought about it. ...Let me think. Until next time. My homework, I suppose.'), 'shy')
        ])
      ])
    ]
  },
  {
    id: 'dep_inari_2', char: I, after: 4,
    build: ({ say, img }) => [
      nar('稻荷忽然问你，知不知道她的名字。你说稻荷。她摇了摇头。', 'Inari suddenly asks if you know her name. Inari, you say. She shakes her head.', img('neutral')),
      say(j('それは役目の名じゃ。社の名、と言ってもよい。……妾にも、もとの名があった。もう誰も呼ばぬ名がな。', '那是职责的名字。也可以说是神社的名字。……妾身也有原本的名字。一个再也没有人叫的名字。', 'That is the name of my office. The shrine\'s name, you might say. ...I had a name of my own once. One nobody calls any more.'), 'sad'),
      nar('她凑到你耳边，说了两个音节。很古老的发音，你听懂了，又好像没听懂。', 'She leans to your ear and says two syllables. A very old sound. You understand it, and somehow do not.'),
      choice('她退开一点，看着你。', 'She draws back a little and watches you.', [
        opt(I, 'dep_inari_2_call', '小声地叫一遍那个名字', 'Say the name back, softly', undefined, 11, 3, [
          nar('你叫出那个名字的时候，她的耳朵——那对本该藏起来的耳朵——在头发底下动了一下。她转过脸去，过了很久才说："……千年ぶりじゃ。"', 'As you say the name, her ears — the ones meant to be hidden — twitch under her hair. She turns her face away and after a long time says: the first time in a thousand years.', img('shy'))
        ]),
        opt(I, 'dep_inari_2_keep', '「大事にする。誰にも言わない。」', '"I will treasure it. I will not tell anyone."', '大事にする。誰にも言わない。', 8, 6, [
          say(j('……うむ。それがよい。名とは、呼ぶ者がおって初めて名になる。……汝だけが呼べ。', '……嗯。这样就好。名字，要有人叫才算名字。……只许你叫。', '...Mm. Good. A name is only a name when someone calls it. ...Only you may.'), 'happy')
        ])
      ])
    ]
  },
  {
    id: 'dep_inari_3', char: I, after: 7, minAffection: 140,
    build: ({ say, img }) => [
      say(j('人の子の命は短い。……妾には、瞬きのようなものじゃ。', '人类的生命很短。……对妾身来说，就像眨一次眼。', 'A human life is short. ...To me, it is a blink.'), 'sad'),
      say(j('じゃが、今日のことは千年覚えておる。いや、二千年でも。……だから、頼む。よい思い出にしてくれ。妾が、何度でも思い出したくなるような。', '但是，今天的事，妾身会记一千年。不，两千年也会记得。……所以，拜托了。让它成为好的回忆吧。让妾身无论多少次都想再想起来的那种。', 'But I will remember today for a thousand years. Two thousand, even. ...So please. Make it a good memory. One I will want to recall again and again.'), 'shy'),
      choice('她第一次用了"拜托"这个词。', 'It is the first time she has said "please".', [
        opt(I, 'dep_inari_3_every', '「今日だけじゃなくて、毎日そうする。」', '"Not just today. Every day."', '今日だけじゃなくて、毎日。', 13, 3, [
          say(j('……欲張りな人の子じゃ。……ふふ。嫌いではない。いや、……好きじゃ。汝の、そういうところが。', '……贪心的人类孩子。……呵呵。不讨厌。不……是喜欢。你的这种地方。', '...A greedy child of man. ...Hehe. I do not dislike it. No... I like it. That about you.'), 'happy')
        ]),
        opt(I, 'dep_inari_3_hold', '握住她的手', 'Take her hand', undefined, 12, 4, [
          nar('她的手比人类的手稍微暖一点。她低头看着你们握在一起的手，看了很久，像是在用千年的记忆力，一点一点地把它刻下来。', 'Her hand is a little warmer than a human hand. She looks down at your joined hands for a long time, as if engraving them, slowly, with a thousand years of memory.', img('shy'))
        ])
      ])
    ]
  },

  // ================= 深雪 =================
  {
    id: 'dep_miyuki_1', char: M, after: 2,
    build: ({ say, img }) => [
      nar('经过一面玻璃橱窗的时候，深雪停下来，看着玻璃里映出来的你们两个。', 'Passing a shop window, Miyuki stops and looks at the reflection of the two of you.', img('neutral')),
      say(j('……ね、変じゃない？ 私とあなたが並んで歩いてるの。周りから見たら、姉弟かしら。それとも……。', '……呐，不奇怪吗？我和你并排走着。别人看来，是姐弟吧。还是说……', '...Is it not strange? You and me walking side by side. To other people, are we siblings? Or...'), 'sad'),
      choice('她没有把那句话说完。', 'She does not finish the sentence.', [
        opt(M, 'dep_miyuki_1_not', '「どう見えてもいい。俺は気にしない。」', '"I do not care how it looks."', 'どう見えてもいい。', 8, 4, [
          say(j('……そういうこと、さらっと言うのね。……ずるいわ。お姉さんのほうが、ドキドキしちゃうじゃない。', '……这种话，你说得那么轻松。……好狡猾。害得姐姐心跳加速了啊。', '...You say that so easily. ...Unfair. Now I am the one whose heart is racing.'), 'shy')
        ]),
        opt(M, 'dep_miyuki_1_finish', '「それとも……の続きは？」', '"Or... what?"', 'それとも、の続きは？', 6, 6, [
          say(j('……もう。聞かないでって顔、してたでしょ？ ……続きは、もう少し内緒。', '……真是的。我刚才不是一脸"别问"的表情吗？……后半句，再保密一阵子。', '...Honestly. Did my face not say "do not ask"? ...The rest stays a secret a little longer.'), 'tease')
        ])
      ])
    ]
  },
  {
    id: 'dep_miyuki_2', char: M, after: 4,
    build: ({ say, img }) => [
      nar('深雪从手包里拿出一张旧照片：一个穿水手服的女孩，一个人坐在教室的窗边，表情很淡。', 'Miyuki takes an old photo from her bag: a girl in a sailor uniform sitting alone by a classroom window, her expression faint.', img('neutral')),
      say(j('高校の頃の私。……友達、あんまりいなかったの。一人でお弁当食べて、一人で帰って。', '高中时候的我。……没什么朋友。一个人吃便当，一个人回家。', 'Me in high school. ...I did not have many friends. I ate lunch alone and went home alone.'), 'sad'),
      say(j('だから今、こうして誰かと出かけてるの、ちょっと不思議。……あの頃の私に、教えてあげたいわ。', '所以现在像这样跟别人一起出门，有点不可思议。……真想告诉那时候的自己。', 'So going out with someone like this still feels a little unreal. ...I would like to tell that girl about it.'), 'shy'),
      choice('照片里的女孩看着窗外。', 'The girl in the photo is looking out of the window.', [
        opt(M, 'dep_miyuki_2_tell', '「じゃあ一緒に教えてあげよう。」', '"Then let us tell her together."', '一緒に教えてあげよう。', 9, 4, [
          say(j('……ふふ。「大丈夫よ、そのうち、隣の部屋に変な子が越してくるから」って？ ……うん。それ、いいわね。', '……呵呵。"没关系，过一阵子隔壁会搬来一个奇怪的孩子"——这样说？……嗯。这样很好。', '...Hehe. "Do not worry, one day an odd boy will move in next door"? ...Yes. I like that.'), 'happy')
        ]),
        opt(M, 'dep_miyuki_2_photo', '「今の写真も、撮ろうよ。」', '"Let us take a photo of now, too."', '今の写真も撮ろう。', 7, 6, [
          nar('你们拍了一张。照片里的深雪笑得很开，跟那张旧照片里的女孩一点都不像。她把两张并排放进了手包里。', 'You take one. In it Miyuki is smiling widely, nothing like the girl in the old photo. She puts the two side by side in her bag.', img('happy'))
        ])
      ])
    ]
  },
  {
    id: 'dep_miyuki_3', char: M, after: 7, minAffection: 160,
    build: ({ say, img }) => [
      say(j('……ね。「お姉さん」って言うの、もうやめてもいい？ 自分のこと。', '……呐。我可以不再说"姐姐"了吗？说我自己的时候。', '...Hey. May I stop calling myself "big sister"?'), 'shy'),
      say(j('ずっとそれで線を引いてたの。大家さんと店子さん、お姉さんと年下の子。……でも、もう、その線の向こうに行きたくなっちゃった。', '我一直用这个来画一条线。房东和房客，姐姐和比自己小的孩子。……可是，我现在想走到那条线的另一边去了。', 'I have been using it to draw a line. Landlady and tenant, big sister and the younger one. ...But now I find I want to cross it.'), 'shy'),
      choice('她在等你叫她。不加任何称呼地。', 'She is waiting for you to say her name. With nothing attached.', [
        opt(M, 'dep_miyuki_3_name', '「……深雪。」', '"...Miyuki."', '……深雪。', 14, 3, [
          say(j('……っ。……はい。……ふふ、思ったより、ずっと嬉しい。もう一回、呼んで？', '……！……嗯。……呵呵，比想象的还要开心得多。再叫一次好吗？', '...! ...Yes. ...Hehe, that makes me far happier than I expected. Say it again?'), 'happy')
        ]),
        opt(M, 'dep_miyuki_3_wait', '「俺が、そっちに行く。」', '"I will come over to your side."', '俺が、そっちに行く。', 12, 4, [
          say(j('……年下のくせに、生意気。……でも、待ってる。線のこっちで。', '……明明比我小，还这么嚣张。……不过，我等你。在线的这一边。', '...Cheeky, for someone younger. ...But I will wait. On this side of the line.'), 'shy')
        ])
      ])
    ]
  },

  // ================= 空 =================
  {
    id: 'dep_sora_1', char: S, after: 2,
    build: ({ say, img }) => [
      nar('空坐下来的时候，下意识地揉了揉右膝。你问她怎么了，她愣了一下，好像没想到你会注意到。', 'As Sora sits she rubs her right knee without thinking. You ask what is wrong and she freezes, as if she did not expect you to notice.', img('neutral')),
      say(j('……去年な、靭帯やってん。治ったけど。……次の大会、また同じとこやったらって思うと、たまに足止まんねん。', '……去年啊，韧带伤了。已经好了。……一想到下次比赛要是又伤到同一个地方，有时候脚就会停下来。', '...Last year I did a ligament. It is healed. ...But when I think about doing the same thing at the next tournament, sometimes my legs just stop.'), 'sad'),
      say(j('部のみんなには言うてへん。キャプテンやしな。……あんたにだけや。', '没跟部里的人说过。我是队长嘛。……只告诉你。', 'I have not told the club. I am captain. ...Only you.'), 'shy'),
      choice('"只告诉你"这几个字，她说得很硬。', 'She says "only you" stiffly.', [
        opt(S, 'dep_sora_1_watch', '「次の大会、見に行く。一番前で。」', '"I will come to the next tournament. Front row."', '次の大会、一番前で見てる。', 9, 4, [
          say(j('……ほな、止まってられへんな。あんたの前で止まったら、かっこ悪いやん。……約束やで。', '……那我就不能停下来了。在你面前停下来，太丢人了。……说好了哦。', '...Then I cannot stop, can I. Stopping in front of you would be embarrassing. ...It is a promise.'), 'happy')
        ]),
        opt(S, 'dep_sora_1_fear', '「怖いって言えるの、強いと思う。」', '"Saying you are scared takes strength."', '怖いって言えるのは、強いよ。', 7, 6, [
          say(j('……なんやねん、それ。……ずるいわ。そんなん言われたら、泣いてまうやろ。……泣かへんけど。', '……什么啊，那种话。……太狡猾了。你那样说，我会哭的啊。……我才不哭。', '...What is that supposed to mean. ...Unfair. Say that and I will cry. ...I will not, though.'), 'shy')
        ])
      ])
    ]
  },
  {
    id: 'dep_sora_2', char: S, after: 4,
    build: ({ say, img }) => [
      nar('空从书包里掏出一张卷子，揉得皱皱巴巴的，摊开在你面前。英语，二十八分。', 'Sora digs a crumpled test paper out of her bag and flattens it in front of you. English. Twenty-eight.', img('neutral')),
      say(j('……笑うなよ。笑うなよ！ ……追試で六十点取らな、次の試合出られへんねん。……教えて。頼む。', '……别笑。别笑啊！……补考不考到六十分，下场比赛就不能上。……教我。拜托。', '...Do not laugh. Do not laugh! ...If I do not get sixty on the resit I cannot play the next match. ...Teach me. Please.'), 'pout'),
      choice('她把"拜托"说得像在罚球线上祈祷。', 'She says please like someone praying at the free-throw line.', [
        opt(S, 'dep_sora_2_teach', '「任せて。毎日練習メニュー作る。」', '"Leave it to me. I will write you a daily practice menu."', '任せて。練習メニュー作る。', 7, 7, [
          say(j('練習メニュー！ それならわかる！ ……あんた、うちの扱い方わかってきたな。', '训练菜单！这个我懂！……你越来越懂得怎么对付我了啊。', 'A practice menu! That I understand! ...You are getting the hang of handling me.'), 'happy')
        ]),
        opt(S, 'dep_sora_2_bet', '「六十点取ったら、ご褒美あげる。」', '"Get sixty and you get a reward."', '六十点取ったら、ご褒美。', 9, 4, [
          say(j('ご、ご褒美？ ……なんや。何くれんねん。……いや言わんでええ！ 言われたら集中できへん！', '奖、奖励？……什么啊。给什么。……不对你别说！说了我就没法集中了！', 'A r-reward? ...Like what? ...No, do not tell me! If you tell me I will not be able to concentrate!'), 'shy')
        ])
      ])
    ]
  },
  {
    id: 'dep_sora_3', char: S, after: 7, minAffection: 140,
    build: ({ say, img }) => [
      say(j('……前に決めてん。フリースロー十本連続で入ったら、言おうって。あんたに。', '……之前我决定了。罚球连进十个，就说出来。对你。', '...I decided a while back. If I made ten free throws in a row, I would say it. To you.'), 'neutral'),
      say(j('今朝、練習で、九本までいった。十本目、リングに嫌われてん。', '今天早上练习，进到第九个了。第十个，被篮筐嫌弃了。', 'This morning in practice I got to nine. The tenth, the rim did not like me.'), 'sad'),
      say(j('……せやけど、もう待たれへん。九本でええか。……あんたのことが、好きや。', '……不过，我等不下去了。九个也行吧。……我喜欢你。', '...But I cannot wait any more. Will nine do? ...I like you.'), 'shy'),
      choice('她说完，像是刚投出了最后一球，盯着你，等它进还是不进。', 'Having said it she watches you like someone who has just released the last shot, waiting to see if it drops.', [
        opt(S, 'dep_sora_3_in', '「入ったよ。十本目。」', '"It went in. The tenth."', '入ったよ。十本目。', 14, 3, [
          say(j('……っ！ ……あほ。そんなん言われたら、もう、どうしたらええねん。……ナイッシュー、うち。', '……！……笨蛋。被你这么说，我还能怎么办啊。……好球，我自己。', '...! ...Idiot. What am I supposed to do when you say that. ...Nice shot, me.'), 'happy')
        ]),
        opt(S, 'dep_sora_3_ten', '「十本目は、一緒に入れよう。」', '"Let us make the tenth together."', '十本目は、一緒に入れよう。', 13, 4, [
          say(j('……一緒に、か。……うん。それ、ええな。それが、一番ええわ。', '……一起吗。……嗯。这样好。这样最好了。', '...Together. ...Yeah. I like that. That is the best way.'), 'shy')
        ])
      ])
    ]
  },

  // ================= 奈绪 =================
  {
    id: 'dep_nao_1', char: N, after: 2,
    build: ({ say, img }) => [
      say(j('……十年前、あんたが引っ越した日のこと、覚えてる？', '……十年前，你搬走的那天，还记得吗？', '...Do you remember the day you moved away, ten years ago?'), 'neutral'),
      say(j('あたし、駅まで走ったの。間に合わなかったけど。……電車、見えなくなるまでホームにいた。', '我一路跑到车站。没赶上。……在站台上一直站到电车看不见为止。', 'I ran all the way to the station. I did not make it. ...I stood on the platform until the train was out of sight.'), 'sad'),
      choice('她说得很平静，像在说别人的事。', 'She says it calmly, as if describing someone else.', [
        opt(N, 'dep_nao_1_sorry', '「……ごめん。」', '"...I am sorry."', '……ごめん。', 6, 7, [
          say(j('謝んないでよ。子どもだったんだし。……ただ、言っときたかっただけ。帰ってきてくれて、ありがと。', '别道歉啦。那时候都是小孩子。……我只是想说出来而已。谢谢你回来。', 'Do not apologise. We were kids. ...I just wanted to say it. Thanks for coming back.'), 'shy')
        ]),
        opt(N, 'dep_nao_1_here', '「今度は、ちゃんとここにいる。」', '"This time I am here. Properly."', '今度は、ちゃんとここにいる。', 9, 4, [
          say(j('……「今度は」って、三月までなんでしょ。……分かってる。分かってるけど、今は、それでいい。', '……"这次"，也只到三月吧。……我知道。我知道，可是现在，这样就够了。', '..."This time" only lasts till March, right. ...I know. I know, but for now, that is enough.'), 'sad')
        ])
      ])
    ]
  },
  {
    id: 'dep_nao_2', char: N, after: 4,
    build: ({ say, img }) => [
      nar('奈绪的小本子从口袋里掉了出来，摊开在地上。你捡起来的时候不小心看见了那一页：「からいもの×」「ねこじた」「数学の小テストの前は寝不足」……全是关于你的。', 'Nao\'s notebook falls out of her pocket and lands open. As you pick it up you cannot help seeing the page: no spicy food. Cannot handle hot drinks. Sleeps badly before maths quizzes... All of it about you.', img('surprised')),
      say(j('っ……！ 返して！ ……それは、その、昔からの癖！ あんた、ほっとくとすぐ忘れるでしょ、自分のこと！', '……！还给我！……那个是，那个，从以前就有的习惯！你这家伙，不管的话，马上就会把自己的事忘掉吧！', '...! Give it back! ...That is, um, an old habit! Leave you alone and you forget everything about yourself!'), 'angry'),
      choice('她伸着手，脸红到了耳朵。', 'She holds out her hand, red to the ears.', [
        opt(N, 'dep_nao_2_return', '还给她，「ありがとう」', 'Give it back: "Thank you."', 'ありがとう。', 8, 5, [
          say(j('……なにそれ。お礼言われることじゃないし。……ばか。', '……什么啊。又不是什么需要道谢的事。……笨蛋。', '...What is that for. It is nothing to thank me for. ...Idiot.'), 'shy')
        ]),
        opt(N, 'dep_nao_2_add', '借她的铅笔，在最后一行写一句', 'Borrow her pencil and add a line at the bottom', undefined, 10, 3, [
          nar('你在最后一行写：「奈緒といると、よく笑う」。她低头看了很久，把本子合上，按在胸口，没有还给你看第二遍。', 'You write on the last line: laughs a lot when with Nao. She looks at it a long time, closes the notebook, presses it to her chest, and does not let you see it again.', img('shy'))
        ])
      ])
    ]
  },
  {
    id: 'dep_nao_3', char: N, after: 7, minAffection: 140,
    build: ({ say, img }) => [
      say(j('……ね。幼なじみって、やめられるのかな。', '……呐。青梅竹马这种关系，能不做了吗。', '...Hey. Can you stop being childhood friends?'), 'neutral'),
      say(j('ずっと隣にいて、ずっと知ってて、それが当たり前で。……でも最近、それだけじゃ足りないの。あたし、欲張りになったのかな。', '一直在旁边，一直了解，理所当然的。……可是最近，光是这样已经不够了。我是不是变贪心了。', 'Always next door, always knowing everything, as if it were natural. ...But lately that is not enough. Have I got greedy?'), 'sad'),
      choice('她没看你，在看你们俩中间那一小段距离。', 'She is not looking at you, but at the small gap between you.', [
        opt(N, 'dep_nao_3_stop', '「やめよう。今日から、別のになろう。」', '"Let us stop. From today, let us be something else."', 'やめよう。今日から、別のになろう。', 14, 3, [
          say(j('……っ。……別のって、なによ。ちゃんと言ってよ。……十年も待ったんだから、ちゃんと。', '……！……别的是什么啊。好好说出来。……我可是等了十年，要好好说。', '...! ...Something else like what? Say it properly. ...I waited ten years. Properly.'), 'shy')
        ]),
        opt(N, 'dep_nao_3_close', '把那一小段距离走完', 'Close the gap', undefined, 13, 4, [
          nar('你往她那边挪了一步。她没有退，也没有抬头，只是很小声地说了一句"……やっと"，像是把十年都放进了这两个字里。', 'You take one step towards her. She does not move back or look up, only says, very quietly: ...finally. As if ten years fit inside the word.', img('shy'))
        ])
      ])
    ]
  },

  // ================= 真希 =================
  {
    id: 'dep_maki_1', char: K, after: 2,
    build: ({ say, img }) => [
      say(j('せんぱいってさ、ウチのこと、ちゃんと名前で呼んだことないよな。', '前辈啊，从来没有好好叫过我的名字吧。', 'You know, senpai, you have never properly called me by my name.'), 'tease'),
      say(j('ウチはせんぱいのこと「ざぁこ」って呼ぶけど。……それとこれとは別やろ。……呼んでみ？', '虽然我叫前辈"杂鱼"。……那是两码事吧。……叫叫看？', 'I call you loser, sure. ...That is different. ...Go on, try it?'), 'shy'),
      choice('她的耳机没开，紫光是暗的。她在等。', 'Her headphones are off, the purple glow dark. She is waiting.', [
        opt(K, 'dep_maki_1_name', '「……真希。」', '"...Maki."', '……真希。', 9, 4, [
          say(j('……っ！ ……ふ、ふーん。まあ、合格ってことにしといたるわ。……もっかい言うてもええで。', '……！……哼、哼——。嘛，就算你及格吧。……再叫一次也行哦。', '...! ...Hm, hmph. Fine, I will give you a pass. ...You can say it again if you like.'), 'shy')
        ]),
        opt(K, 'dep_maki_1_zako', '「……ざぁこ。」反击回去', '"...Loser." Fire it back', 'ざぁこ。', 4, 7, [
          say(j('はぁ！？ ……あははは！ せんぱい、それウチのセリフや！ ……ちょっと、おもろいやん。', '哈？！……啊哈哈哈！前辈，那是我的台词！……有点意思嘛。', 'Huh?! ...Ahahaha! Senpai, that is my line! ...Okay, that was kind of funny.'), 'happy')
        ])
      ])
    ]
  },
  {
    id: 'dep_maki_2', char: K, after: 4,
    build: ({ say, img }) => [
      nar('真希拨了一下耳机线，难得地安静了很久。', 'Maki fiddles with her headphone cable and stays unusually quiet for a long time.', img('neutral')),
      say(j('……バンド、ウチ以外みんな辞めてん。受験やって。……一人でギター弾いてもな、聴く人おらんかったら、ただの音や。', '……乐队里，除了我大家都退了。说是要考试。……一个人弹吉他啊，没有人听的话，就只是声音而已。', '...Everyone in the band quit except me. Exams, they said. ...Playing guitar alone, if nobody is listening, it is just noise.'), 'sad'),
      choice('她没有看你，可这句话是说给你听的。', 'She is not looking at you, but that was meant for you.', [
        opt(K, 'dep_maki_2_listen', '「俺が聴く。毎回。」', '"I will listen. Every time."', '俺が聴く。毎回。', 9, 4, [
          say(j('……毎回？ 言うたな？ ……ほな、来週から特等席や。ウチの前、一番前。逃げたら許さへんで。', '……每次？你说了哦？……那从下周开始你就是特等席。我面前，最前面。敢逃我饶不了你。', '...Every time? You said it. ...Then from next week you have the best seat. Right in front of me. Run off and you are dead.'), 'happy')
        ]),
        opt(K, 'dep_maki_2_new', '「新しいメンバー、一緒に探そう。」', '"Let us find new members together."', '一緒にメンバー探そう。', 6, 7, [
          say(j('……せんぱい、意外と真面目やな。……うん。ほな、まずはせんぱいがタンバリン担当な。', '……前辈，意外地认真呢。……嗯。那首先，前辈负责铃鼓。', '...You are surprisingly serious, senpai. ...Okay. First up, you are on tambourine.'), 'tease')
        ])
      ])
    ]
  },
  {
    id: 'dep_maki_3', char: K, after: 7, minAffection: 140,
    build: ({ say, img }) => [
      say(j('……せんぱい。ウチな、勝負で負けたこと、ないねん。ゲームでも、口喧嘩でも。', '……前辈。我啊，在较量上从来没输过。不管是游戏还是吵架。', '...Senpai. I have never lost. Not at games, not in an argument.'), 'neutral'),
      say(j('せやのに、最近ずっと負けてる気がすんねん。せんぱいに。……顔見たら負け。声聞いたら負け。……もう、ウチの負けや。好きや、アホ。', '可是最近总觉得一直在输。输给前辈。……看到你的脸就输了。听到你的声音就输了。……算了，是我输了。我喜欢你，笨蛋。', 'And yet lately I feel like I keep losing. To you. ...See your face, I lose. Hear your voice, I lose. ...Fine. I lose. I like you, you idiot.'), 'shy'),
      choice('她说"笨蛋"的时候，声音在发抖。', 'Her voice shakes on the word "idiot".', [
        opt(K, 'dep_maki_3_both', '「引き分けにしよう。俺も負けてる。」', '"Call it a draw. I have lost too."', '引き分けにしよう。俺も負けてる。', 14, 3, [
          say(j('……引き分け？ ……あほ。そんなん、ずるいやん。……ほな、延長戦や。一生かけて決着つけたる。', '……平局？……笨蛋。那种的太狡猾了。……那就加时赛。用一辈子来分胜负。', '...A draw? ...Idiot. That is cheating. ...Fine, extra time. We will settle it over a lifetime.'), 'happy')
        ]),
        opt(K, 'dep_maki_3_win', '「じゃあ、勝者の権限で。……ずっと隣にいて。」', '"Then by the winner\'s right... stay beside me."', 'ずっと隣にいて。', 13, 4, [
          say(j('……命令かいな。……ええよ。せんぱいの命令やったら、聞いたる。今回だけ。……ずっと、やけど。', '……是命令吗。……好啊。前辈的命令的话，我听。就这一次。……虽然是"一直"。', '...Is that an order? ...Fine. If it is your order, I will obey. Just this once. ...Forever, though.'), 'shy')
        ])
      ])
    ]
  }
];

export const pickDateEpisode = (char: CharacterId, pastDates: number, flags: StoryFlags, affection?: number): DateEpisode | null =>
  DATE_EPISODES
    .filter(e => e.char === char && !flags[e.id] && pastDates >= e.after && (!e.minAffection || (affection ?? 0) >= e.minAffection))
    .sort((a, b) => a.after - b.after)[0] || null;
