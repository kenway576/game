import { CharacterId } from '../types';
import { Mood } from '../data/outfitContext';
import { DateTag } from './dateSpots';

// ---------------------------------------------------------
// 💬 约她的时候，她怎么回
//
// 四种回法：答应 / 改约（"那里不行，换个地方可以"）/ 今天没空 / 不去。
// 改约的那句里 {spot} 换成她提议的那个地方的日语名。
//
// 拒绝不是惩罚。"今天没空"每个人有每个人的理由——学生会、社团、店里帮忙、神社的祭事；
// "不去"是关系还没到那一步，她说出来的方式就是她这个人。
// 被拒绝之后好感度不会掉，親密度还会涨一点：你又多知道了一件关于她的事。
// ---------------------------------------------------------

export interface Line { jp: string; zh: string; en: string }
const L = (jp: string, zh: string, en: string): Line => ({ jp, zh, en });

export const INVITE_LINES: Record<CharacterId, { yes: Line[]; counter: Line[]; busy: Line[]; no: Line[] }> = {
  [CharacterId.ASUKA]: {
    yes: [
      L('……いいわよ。べ、別に暇だったわけじゃないから。十五分後、遅れたら置いてくわよ。', '……行啊。我、我可不是因为闲着才答应的。十五分钟后，迟到我就不等了。', '...Fine. N-not because I had nothing to do. Fifteen minutes. Late and I leave without you.'),
      L('行く。……行くって言ったでしょ。二回言わせないで。', '去。……我说了去吧。别让我说第二遍。', 'I will go. ...I said I will go. Do not make me say it twice.'),
      L('仕方ないわね。あんた一人だと迷子になりそうだし。', '真拿你没办法。你一个人去好像会迷路。', 'Oh, if I must. You would only get lost on your own.')
    ],
    counter: [
      L('そ、そんなとこ二人で行けるわけないでしょ！ ……{spot}なら、付き合ってあげてもいいけど。', '那、那种地方怎么可能两个人去啊！……{spot}的话，陪你去也不是不行。', 'W-we cannot go somewhere like that, just the two of us! ...I suppose I could keep you company at {spot}.'),
      L('急すぎるのよ、あんたは。……{spot}。それなら、まあ。', '你也太突然了。……{spot}。那里的话，嘛。', 'You are always so sudden. ...{spot}. That, I suppose.')
    ],
    busy: [
      L('今日は生徒会。……残念とか、思ってないから。', '今天有学生会。……才没觉得可惜呢。', 'Student council today. ...I am not disappointed, if that is what you think.'),
      L('委員会の資料、まだ終わってないの。また今度にして。……今度、ね。', '委员会的资料还没弄完。下次吧。……下次哦。', 'The committee papers are not finished. Another time. ...Another time, all right?'),
      L('無理。……ほんとに無理なの。嘘じゃないわよ。', '不行。……真的不行。不是骗你的。', 'I cannot. ...I really cannot. I am not lying.')
    ],
    no: [
      L('は？ 何考えてんの、あんた。……そういうのは、もっとちゃんとしてから言いなさいよ。', '哈？你在想什么啊。……那种话，等你更像样一点再说吧。', 'Excuse me? What are you thinking? ...Say that sort of thing when you have earned it.'),
      L('行かない。……まだ、そういうのじゃないでしょ、私たち。', '不去。……我们，还不是那种关系吧。', 'No. ...We are not like that. Not yet.')
    ]
  },
  [CharacterId.HIKARI]: {
    yes: [
      L('行く行く行くー！ ちょい待って、着替えてくるわ！ 十分で行く！', '去去去——！等我一下，我换个衣服！十分钟就到！', 'Yes yes yes! Wait, let me change! Ten minutes!'),
      L('ほんま!? うち、ちょうど誘おうと思っててん！ 以心伝心やん！', '真的吗？！我正想约你呢！心有灵犀嘛！', 'Really?! I was just about to ask you! Great minds!'),
      L('ええで！ 待ち合わせ、改札前な！ 走ってく！', '好啊！检票口前面见！我跑过去！', 'Sure! Meet at the ticket gates! I will run!')
    ],
    counter: [
      L('えー、そこはちょっと……恥ずいやん。{spot}にせえへん？ そっちのが絶対楽しいって！', '诶——那里有点……好害羞啦。去{spot}怎么样？那边绝对更好玩！', 'Eh, there is a bit... embarrassing. How about {spot}? That would be way more fun!'),
      L('うーん、そこはまだ早いかも！ 代わりに{spot}行こ！', '嗯——那里可能还早了点！换成去{spot}吧！', 'Hmm, maybe a bit soon for there! Let us do {spot} instead!')
    ],
    busy: [
      L('ごめーん！ 今日、家の店手伝わなあかんねん……また誘ってな！ 絶対やで！', '抱歉——！今天得帮家里看店……下次再约我哦！一定哦！', 'Sorry! I have to help at the family shop today... Ask me again! Promise!'),
      L('あかん、今日ダンス部の助っ人入ってもうてん！ 明日！ 明日やったら空いてる！', '糟了，今天答应去舞蹈部帮忙了！明天！明天有空！', 'Argh, I promised to help the dance club today! Tomorrow! I am free tomorrow!'),
      L('うわー、行きたい！ でも今日はおかんに捕まってん。ごめん！', '哇——好想去！但今天被我妈抓住了。抱歉！', 'Waaah, I want to go! But Mum has got me today. Sorry!')
    ],
    no: [
      L('え、えっと……それはさすがに、うち、どんな顔して行ったらええかわからへん……ごめん！', '诶、那个……那种地方，我真不知道该摆什么表情去……对不起！', 'Um, er... I would not know what face to wear going there... sorry!'),
      L('……ごめん、そこは、まだ無理かも。嫌とかやなくて！ ほんまに！', '……对不起，那里，可能还不行。不是讨厌你哦！真的！', '...Sorry, maybe not there, not yet. It is not that I do not want to! Honest!')
    ]
  },
  [CharacterId.REI]: {
    yes: [
      L('了解しました。現地で合流します。……楽しみ、という単語を使ってもいいでしょうか。', '明白了。在那里会合。……我可以用"期待"这个词吗。', 'Understood. I will meet you there. ...May I use the word "looking forward"?'),
      L('行きます。理由は後で考えます。', '我去。理由之后再想。', 'I will come. I will think of a reason later.'),
      L('承知しました。……誘われたのは、初めてです。記録します。', '收到。……这是我第一次被邀请。我会记录下来。', 'Acknowledged. ...It is the first time I have been invited. I will record it.')
    ],
    counter: [
      L('その場所は、現在の私たちの関係性から推測して、不適切です。……{spot}であれば、合理的です。', '根据我们目前的关系推测，那个地方不合适。……{spot}的话，比较合理。', 'Given the present state of our relationship, that location is inappropriate. ...{spot} would be rational.'),
      L('代案を提示します。{spot}。……拒否ではありません。修正です。', '我提出替代方案。{spot}。……这不是拒绝，是修正。', 'I propose an alternative: {spot}. ...This is not a refusal. It is a correction.')
    ],
    busy: [
      L('本日は天文部の観測準備があります。……次回の誘いを、待っています。', '今天有天文部的观测准备。……我在等你下次邀请。', 'The astronomy club is preparing an observation today. ...I will be waiting for your next invitation.'),
      L('今日は図書室の返却期限です。……すみません。本当に、すみません。', '今天是图书室的还书期限。……对不起。真的，对不起。', 'Today is the library return date. ...I am sorry. I am truly sorry.'),
      L('先約があります。祖母との電話です。……優先順位を変えることはできません。', '我有约在先。和祖母打电话。……优先顺序不能改。', 'I have a prior engagement. A call with my grandmother. ...I cannot change the order of priority.')
    ],
    no: [
      L('……理解できません。なぜ私なのですか。……少し、考える時間をください。', '……我无法理解。为什么是我。……请给我一点时间考虑。', '...I do not understand. Why me? ...Please give me some time to think.'),
      L('その提案には応じられません。……理由は、うまく言語化できません。', '这个提议我无法接受。……理由，我没办法很好地说出来。', 'I cannot accept that proposal. ...I cannot put the reason into words.')
    ]
  },
  [CharacterId.INARI]: {
    yes: [
      L('ほう、神を誘うか。……よかろう。人の世の遊び、案内してみよ。', '哦，邀请神明吗。……好吧。人世间的玩乐，你来带路看看。', 'Oh? You invite a god? ...Very well. Show me how your world plays.'),
      L('ふふ、退屈しておったところじゃ。すぐ行く。……人の足でな。', '呵呵，正闲得无聊呢。马上就去。……用人的脚走过去。', 'Hehe, I was growing bored. I will come at once. ...On human feet.'),
      L('よいぞ。汝の誘いなら、千年に一度くらいは乗ってやろう。……今日がその日じゃ。', '好啊。你的邀请，千年一回的话妾身还是会答应的。……今天就是那一天。', 'Very well. For you, I will accept once in a thousand years. ...Today is that day.')
    ],
    counter: [
      L('そこはまだ早いのう、人の子。……{spot}ならば、付き合うてやらんでもない。', '那里还太早了，人类的孩子。……{spot}的话，陪你去也无妨。', 'Too soon for that, child of man. ...{spot}, I might allow.'),
      L('急くでない。……まずは{spot}じゃ。順序というものがある。', '别急。……先去{spot}。凡事都有顺序。', 'Do not rush. ...{spot} first. There is an order to these things.')
    ],
    busy: [
      L('今宵は社の祭事でな。……狐にも務めはあるのじゃ。', '今天神社有祭事。……狐狸也是有职责的。', 'There is a rite at the shrine today. ...Even a fox has duties.'),
      L('今日は気が乗らぬ。……拗ねておるのではないぞ。たぶん。', '今天没那个心情。……可不是在闹别扭。大概。', 'I am not in the mood today. ...I am not sulking. Probably.'),
      L('先客がおる。参拝の者じゃ。……神は、願いを聞かねばならぬ。', '有先来的客人。来参拜的人。……神明是必须听人许愿的。', 'Someone came before you. A worshipper. ...A god must listen to prayers.')
    ],
    no: [
      L('……汝、何を言うておるかわかっておるのか。千年早い。……いや、千年は言い過ぎか。', '……你知道自己在说什么吗。早了一千年。……不，一千年说得太过了吧。', '...Do you know what you are saying? A thousand years too soon. ...No, perhaps a thousand is too many.'),
      L('ならぬ。……今は、まだ、な。', '不行。……现在，还不行。', 'No. ...Not now. Not yet.')
    ]
  },
  [CharacterId.MIYUKI]: {
    yes: [
      L('あら、デートのお誘い？ ……ふふ、冗談よ。いいわよ、行きましょう。', '哎呀，约会的邀请？……呵呵，开玩笑的。好啊，走吧。', 'Oh, asking me on a date? ...Hehe, I am teasing. Yes, let us go.'),
      L('ちょうどお買い物に出ようと思ってたの。一緒に行きましょ。', '正好想出门买东西呢。一起去吧。', 'I was just about to go out shopping. Let us go together.'),
      L('いいわよ。……ちょっと待ってて、お化粧だけ直させて。', '好啊。……稍等一下，让我补个妆。', 'All right. ...Wait a moment, let me fix my make-up.')
    ],
    counter: [
      L('それは……ちょっと、大人として困っちゃうわ。{spot}なら、喜んで。', '那个嘛……作为大人，有点为难呢。{spot}的话，我很乐意。', 'That is... a little awkward for a grown-up. {spot}, I would love to.'),
      L('ふふ、背伸びしなくていいのよ。{spot}にしましょう？ そっちのほうが、きっと楽しいわ。', '呵呵，不用逞强哦。去{spot}吧？那边一定更开心。', 'Hehe, you need not stretch yourself. Shall we do {spot}? I am sure that will be more fun.')
    ],
    busy: [
      L('ごめんなさい、今日は管理会社の人が来るの。……埋め合わせ、させてね。', '对不起，今天管理公司的人要来。……让我补偿你哦。', 'I am sorry, the management company is coming today. ...Let me make it up to you.'),
      L('今日は夕方からお仕事なの。……誘ってくれて、嬉しかったわ。', '今天傍晚开始要工作。……你约我，我很开心。', 'I am working from this evening. ...I was happy you asked.'),
      L('あら、残念。今日は先約があるの。……女の子との、ね。ふふ。', '哎呀，可惜。今天有约了。……是跟女孩子的哦。呵呵。', 'Oh, what a shame. I have plans today. ...With a girlfriend. Hehe.')
    ],
    no: [
      L('……だめよ。あなたはまだ、私の大事な店子さんなんだから。', '……不行哦。你现在，还是我重要的房客呢。', '...No. You are still my precious tenant, after all.'),
      L('その気持ちは、受け取っておくわね。……今はそれだけ。ごめんなさい。', '你的心意，我收下了。……现在只能这样。对不起。', 'I will accept the feeling behind it. ...That is all for now. I am sorry.')
    ]
  },
  [CharacterId.SORA]: {
    yes: [
      L('おっしゃ、行くで！ 部活終わったら速攻で行くわ！', '好嘞，走起！练完球马上就过去！', 'Right, let us go! I will come straight after practice!'),
      L('ええで！ ……え、二人？ ……ま、まあ、ええけど。', '行啊！……诶，就两个人？……嘛、嘛，也行吧。', 'Sure! ...Wait, just us two? ...W-well, fine.'),
      L('行く！ 腹減ってんねん、なんか食おうや！', '去！肚子饿了，吃点什么吧！', 'Yes! I am starving, let us eat something!')
    ],
    counter: [
      L('そ、そこは……あかん、なんか恥ずい！ {spot}にしよ、な！', '那、那里……不行，总觉得好害羞！去{spot}吧，好不好！', 'Th-there... no, that is embarrassing somehow! {spot}, yeah?'),
      L('そこより{spot}のほうがええやん！ 体動かせるし！ ……たぶん！', '比起那里{spot}更好吧！还能活动身体！……大概！', '{spot} is better than there! You can move around! ...Probably!')
    ],
    busy: [
      L('すまん！ 今日は練習試合や。……応援来てくれてもええんやで？', '抱歉！今天有练习赛。……你来给我加油也行哦？', 'Sorry! Practice match today. ...You could come and cheer, you know?'),
      L('今日は自主練や。休んだら体が鈍る。……また誘ってくれ。', '今天要自主练习。一休息身体就变钝了。……下次再约我。', 'Extra training today. Skip it and I get rusty. ...Ask me again.'),
      L('無理や、顧問に捕まった。……ほんまはめっちゃ行きたいねんで。', '不行，被教练逮住了。……其实超想去的。', 'Cannot, the coach has got me. ...I really do want to go.')
    ],
    no: [
      L('……え。……いや、あの、そういうのは、まだ……すまん！', '……诶。……不，那个，那种的，还……抱歉！', '...Eh. ...No, um, that kind of thing, not yet... sorry!'),
      L('あ、あかんあかん！ そんなん、心臓もたへん！', '不、不行不行！那种的，心脏受不了！', 'N-no no no! My heart could not take it!')
    ]
  },
  [CharacterId.NAO]: {
    yes: [
      L('いいよ。……どうせあたしが行かないと、あんた道に迷うでしょ。', '好啊。……反正我不去，你也会迷路吧。', 'Sure. ...You would only get lost without me anyway.'),
      L('行く。……五分で準備する。待ってて。', '去。……五分钟准备好。等我。', 'I will come. ...Five minutes to get ready. Wait.'),
      L('ん。ちょうど暇だったし。……ちょうど、ね。', '嗯。正好闲着。……正好而已。', 'Mm. I happened to be free. ...Happened to be.')
    ],
    counter: [
      L('なにそれ、いきなり。……{spot}ならいいけど。昔もよく行ったじゃん。', '什么啊，这么突然。……{spot}的话可以。以前不也经常去嘛。', 'What, out of nowhere? ...{spot} is fine. We used to go all the time.'),
      L('そこは……まだいい。{spot}にしよ。', '那里……还是算了。去{spot}吧。', 'Not there... not yet. Let us do {spot}.')
    ],
    busy: [
      L('今日、おばさんの手伝い。……明日なら、空いてるけど。', '今天要帮阿姨的忙。……明天的话，有空。', 'I am helping Auntie today. ...I am free tomorrow, though.'),
      L('バイト。……ごめん。メモしとくね、あんたが誘ってくれたこと。', '要打工。……抱歉。我记下来了，你约过我这件事。', 'Work. ...Sorry. I am writing it down, that you asked.'),
      L('今日は無理。課題。……あんたも、やったほうがいいよ。', '今天不行。作业。……你也最好做一下。', 'Not today. Homework. ...You should do yours too.')
    ],
    no: [
      L('……幼なじみ相手に、それ言う？ ……ばか。考えとく。', '……对青梅竹马说这种话？……笨蛋。我考虑一下。', '...You are saying that to your childhood friend? ...Idiot. I will think about it.'),
      L('……ごめん。今は、まだ、そういうふうに見られたくない。', '……对不起。现在，还不想被你那样看待。', '...Sorry. Not yet. I do not want you looking at me like that, not yet.')
    ]
  },
  [CharacterId.MAKI]: {
    yes: [
      L('えー、せんぱいがウチを誘うん？ ……しゃーないなぁ、付き合ったるわ♡', '诶——前辈约我？……真拿你没办法，就陪你去吧♡', 'Ehh, senpai is asking me out? ...Oh, all right, I will keep you company.'),
      L('行く行く〜！ せんぱいの奢りな？ ……え、ちゃうの？', '去去～！前辈请客对吧？……诶，不是吗？', 'Yes yes! Your treat, right? ...Eh, it is not?'),
      L('ウチ、ちょうど暇しててん。……べ、別に待ってたわけちゃうで。', '我正好闲着呢。……才、才不是在等你约哦。', 'I happen to be free. ...N-not that I was waiting or anything.')
    ],
    counter: [
      L('はぁ〜？ そこはさすがにキモいで、せんぱい♡ ……{spot}やったら、行ったってもええけど。', '哈～？那里也太恶心了吧，前辈♡……{spot}的话，倒是可以陪你去。', 'Hah? That is a bit creepy, senpai. ...I might go to {spot} with you though.'),
      L('いきなりそれは無理〜。{spot}にしよ、ウチが勝ったる。', '一上来就那个不行啦～。去{spot}吧，我会赢你的。', 'Not straight off. {spot}, and I will beat you.')
    ],
    busy: [
      L('今日はランキング戦やねん。……せんぱいより大事なもんやで、当然♡', '今天有排位赛。……当然比前辈重要啦♡', 'Ranked matches today. ...More important than you, obviously.'),
      L('バンドの練習〜。来たかったら来てもええけど。', '乐队练习～。想来的话也可以来哦。', 'Band practice. You can come if you want.'),
      L('無理〜。……ほんまは行きたかったけど。言わせんなや。', '不行～。……其实是想去的。别让我说出来啦。', 'Cannot. ...I did want to go, actually. Do not make me say it.')
    ],
    no: [
      L('……え、本気で言うとる？ ……ざ、ざぁこ。そういうのは、もっと仲良なってからや。', '……诶，你是认真的？……杂、杂鱼。那种的，等关系更好了再说。', '...Eh, are you serious? ...L-loser. That kind of thing is for when we are closer.'),
      L('むりむりむり！ ……顔、熱っ。せんぱいのせいやからな！', '不行不行不行！……脸好烫。都怪前辈！', 'No no no! ...My face is hot. This is your fault, senpai!')
    ]
  }
};

// 约会途中，她在这种地方会说的一句话。地点只分八类，八个人各说各的。
export const TAG_LINES: Record<CharacterId, Record<DateTag, Line & { mood: Mood }>> = {
  [CharacterId.ASUKA]: {
    food: { ...L('……おいしい。……別に、あんたが選んだ店だから褒めてるわけじゃないわよ。', '……好吃。……可不是因为是你选的店才夸的。', '...It is good. ...Not that I am praising it because you chose the place.'), mood: 'happy' },
    play: { ...L('もう一回！ 今のはノーカウントよ。負けたまま帰るなんて、私の辞書にないの。', '再来一次！刚才那局不算。输了就回去，我的字典里没有这种事。', 'Again! That one does not count. Going home a loser is not in my vocabulary.'), mood: 'angry' },
    scenery: { ...L('……こういうの、一人だと見ないのよね。見る理由がないから。', '……这种风景，一个人的时候是不会看的。没有看的理由嘛。', '...I never look at this sort of thing alone. There is no reason to.'), mood: 'sad' },
    culture: { ...L('解説、読みなさいよ。……読んだ？ じゃあ問題。さっきのは何年？', '说明你倒是读啊。……读了？那我考你。刚才那个是哪一年？', 'Read the panel. ...Done? Then a question. What year was that one?'), mood: 'tease' },
    sport: { ...L('フォームが雑。……ほら、肘。こう。……触ってないわよ、指導よ。', '姿势太随便了。……喏，手肘。这样。……我没碰你，这是指导。', 'Sloppy form. ...Here, your elbow. Like this. ...I am not touching you, I am coaching.'), mood: 'shy' },
    night: { ...L('門限、あるのよ。……あと十分だけ。十分だけなら、いい。', '我有门禁的。……再十分钟。十分钟的话，可以。', 'I have a curfew. ...Ten more minutes. Ten minutes is fine.'), mood: 'shy' },
    formal: { ...L('背筋。……ほら、あんたも。私の隣を歩くなら、それくらいしなさい。', '背挺直。……喏，你也是。要走在我旁边，至少做到这点。', 'Back straight. ...You too. If you are going to walk next to me, at least do that.'), mood: 'tease' },
    home: { ...L('台所借りるわよ。……味見役、あんたね。正直に言いなさいよ、正直に。', '借一下厨房。……试吃的就是你了。要老实说哦，老实说。', 'I am borrowing the kitchen. ...You are the taster. Be honest. Honest.'), mood: 'neutral' }
  },
  [CharacterId.HIKARI]: {
    food: { ...L('うまっ！ これ百点！ ……あ、さっきのも百点やった。今日は百点の日や！', '好吃！这个一百分！……啊，刚才那个也是一百分。今天是一百分的日子！', 'So good! A hundred points! ...Oh, the last one was a hundred too. Today is a hundred-point day!'), mood: 'happy' },
    play: { ...L('よっしゃ勝ったー！ 罰ゲーム何にしよっかなー……あ、逃げんといてや！', '好耶赢了——！惩罚游戏要做什么呢——……啊，别逃啊！', 'Yes, I won! What shall the forfeit be... hey, do not run away!'), mood: 'tease' },
    scenery: { ...L('……なあ。こういうとこ、あんたと来たかってん。ずっと。', '……呐。这种地方，我一直想跟你来。一直。', '...Hey. I wanted to come somewhere like this with you. For ages.'), mood: 'shy' },
    culture: { ...L('むずかしい字ばっか！ ……{name}、これ何て読むん？ ……あ、知らんのや。一緒やな！', '全是好难的字！……{name}，这个怎么读？……啊，你也不知道啊。一样嘛！', 'All hard kanji! ...{name}, how do you read this? ...Oh, you do not know. Same!'), mood: 'happy' },
    sport: { ...L('ナイッシュー！ ……いまの見た？ 見たやんな？ ハイタッチ！', '好球！……刚才看到了吗？看到了吧？击掌！', 'Nice shot! ...Did you see? You saw, right? High five!'), mood: 'happy' },
    night: { ...L('夜って、昼より声ちっちゃくなるやんな。……なんでやろ。ないしょ話みたい。', '晚上说话，声音会比白天小吧。……为什么呢。像在说悄悄话。', 'At night your voice gets smaller than in the day, does it not. ...Why is that? Like telling secrets.'), mood: 'shy' },
    formal: { ...L('ナイフとフォーク、外側からやっけ？ 内側？ ……{name}の真似するわ！', '刀叉是从外侧开始用？还是内侧？……我学{name}的！', 'Knife and fork, outside first? Inside? ...I will copy {name}!'), mood: 'surprised' },
    home: { ...L('お邪魔しまーす！ ……わ、思ったより片付いてる。意外〜！', '打扰啦——！……哇，比想象中整齐。好意外～！', 'Coming in! ...Oh, tidier than I expected. Surprising!'), mood: 'surprised' }
  },
  [CharacterId.REI]: {
    food: { ...L('糖分の摂取は思考に有効です。……それと、おいしいです。後者が主な理由です。', '摄取糖分有助于思考。……还有，很好吃。主要是后者。', 'Sugar intake aids thinking. ...Also, it is delicious. The latter is the main reason.'), mood: 'happy' },
    play: { ...L('確率的には、次は勝てます。……もう一回、お願いします。', '从概率上说，下一局能赢。……请再来一次。', 'Probabilistically, I will win the next one. ...Once more, please.'), mood: 'angry' },
    scenery: { ...L('この景色を数式で表すことはできます。……でも、今はしたくありません。', '这片风景可以用公式表示。……但现在，我不想那么做。', 'I could express this view as an equation. ...But I do not want to, right now.'), mood: 'shy' },
    culture: { ...L('説明板に誤りが二つあります。……指摘しません。今日は、楽しいので。', '说明牌上有两处错误。……我不指出来。因为今天很开心。', 'There are two errors on the panel. ...I will not point them out. Today is enjoyable.'), mood: 'happy' },
    sport: { ...L('放物線です。……入りませんでした。理論と実践には差があるようです。', '是抛物线。……没进。理论和实践之间似乎有差距。', 'A parabola. ...It did not go in. There appears to be a gap between theory and practice.'), mood: 'sad' },
    night: { ...L('今夜は月齢十二。……あなたと見る月を、記録しておきます。', '今晚月龄十二。……我会把和你一起看的月亮，记录下来。', 'The moon is twelve days old tonight. ...I will record the moon I saw with you.'), mood: 'shy' },
    formal: { ...L('マナーは事前に調べてきました。……あなたが間違えたら、黙って同じ間違いをします。', '礼仪我事先查过了。……你要是弄错了，我就默默地跟你错得一样。', 'I researched the etiquette beforehand. ...If you make a mistake, I will quietly make the same one.'), mood: 'happy' },
    home: { ...L('計量スプーンはありますか。……ない？ では、目分量という未知の手法を学びます。', '有量勺吗。……没有？那我就来学习"目测"这种未知的方法。', 'Do you have measuring spoons? ...No? Then I shall learn the unknown technique of judging by eye.'), mood: 'surprised' }
  },
  [CharacterId.INARI]: {
    food: { ...L('ほう、この味は初めてじゃ。千年生きても、まだ初めてがあるのう。', '哦，这个味道是第一次尝到。活了一千年，还会有第一次啊。', 'Oh, this taste is new to me. A thousand years and there are still firsts.'), mood: 'happy' },
    play: { ...L('からくりの勝負か。……ふふ、少しばかり狐火で細工を——冗談じゃ。', '机关的较量吗。……呵呵，稍微用狐火动点手脚——开玩笑的。', 'A contest of machines? ...Hehe, a little fox-fire trickery— I jest.'), mood: 'tease' },
    scenery: { ...L('ここは昔、海じゃった。……汝と見るのは、今のこの景色がよい。', '这里从前是海。……和你一起看的话，还是现在这片风景好。', 'This was sea, once. ...To look at with you, I prefer it as it is now.'), mood: 'neutral' },
    culture: { ...L('その説明は半分違う。妾はその場におったからの。……続きは、汝だけに話してやろう。', '那个说明错了一半。因为妾身当时就在场。……后面的事，只讲给你听。', 'That explanation is half wrong. I was there. ...The rest I will tell only you.'), mood: 'tease' },
    sport: { ...L('走るのか？ 神を走らせるとは。……よかろう、一度だけじゃぞ。', '要跑吗？居然让神明跑步。……好吧，只此一次。', 'Running? You would make a god run? ...Very well. Once only.'), mood: 'happy' },
    night: { ...L('夜は妾の刻じゃ。……人の子、はぐれるでないぞ。手を貸せ。', '夜晚是妾身的时刻。……人类的孩子，别走散了。手给我。', 'Night is my hour. ...Do not stray, child of man. Give me your hand.'), mood: 'shy' },
    formal: { ...L('宴か。……人の宴は、いつの世も皿が小さいのう。', '宴会啊。……人类的宴会，无论哪个时代盘子都好小。', 'A banquet. ...In every age, human banquets have such small plates.'), mood: 'tease' },
    home: { ...L('人の子の住処か。……ふむ、狭いが、よい匂いがする。', '人类孩子的住处吗。……嗯，虽然窄，但味道很好闻。', 'The dwelling of a human child. ...Hm. Cramped, but it smells pleasant.'), mood: 'happy' }
  },
  [CharacterId.MIYUKI]: {
    food: { ...L('ふふ、おいしいわね。……誰かと食べると、どうしてこう味が変わるのかしら。', '呵呵，真好吃。……和别人一起吃的时候，为什么味道会变得不一样呢。', 'Hehe, it is good. ...Why does food taste different when you eat with someone?'), mood: 'happy' },
    play: { ...L('あら、私の勝ち？ ……ごめんなさい、手加減ってどうやるのか忘れちゃって。', '哎呀，我赢了？……对不起，我忘了手下留情要怎么做了。', 'Oh, I won? ...Sorry, I have forgotten how to go easy.'), mood: 'tease' },
    scenery: { ...L('……こういう時間、大事にしなきゃって、最近よく思うの。', '……最近经常想，得好好珍惜这样的时间。', '...Lately I keep thinking I should treasure moments like this.'), mood: 'sad' },
    culture: { ...L('昔、ここで働きたかったのよ。……ふふ、内緒の話。', '以前，我想在这种地方工作呢。……呵呵，是秘密哦。', 'I used to want to work somewhere like this. ...Hehe, that is a secret.'), mood: 'shy' },
    sport: { ...L('若いわね……。お姉さん、ここで見てるから。がんばって。', '真年轻啊……。姐姐在这儿看着。加油。', 'So young... I will watch from here. Do your best.'), mood: 'happy' },
    night: { ...L('遅くなっちゃったわね。……大家さんとしては、早く帰りなさいって言わなきゃいけないんだけど。', '变晚了呢。……作为房东，本来应该叫你早点回去的。', 'It has got late. ...As your landlady I ought to tell you to go home.'), mood: 'shy' },
    formal: { ...L('緊張してる？ ……大丈夫よ。私の真似をして。ゆっくりでいいの。', '紧张吗？……没事的。学我就好。慢慢来。', 'Nervous? ...It is all right. Copy me. Take your time.'), mood: 'happy' },
    home: { ...L('包丁はこう持つの。……そう、上手。ほら、もうできるじゃない。', '菜刀要这样拿。……对，很好。你看，这不是已经会了嘛。', 'Hold the knife like this. ...Yes, good. See, you can already do it.'), mood: 'happy' }
  },
  [CharacterId.SORA]: {
    food: { ...L('おかわり！ ……あんたも食えや。食わんと強ならんで。', '再来一份！……你也吃啊。不吃怎么变强。', 'Seconds! ...You eat too. You will not get strong otherwise.'), mood: 'happy' },
    play: { ...L('もう一本！ 次は本気出す！ ……今のも本気やったけど！', '再来一局！下次拿出真本事！……刚才也是真本事就是了！', 'Again! This time for real! ...That was for real too, mind!'), mood: 'angry' },
    scenery: { ...L('……ええ景色やな。走ってる時は、こういうの見えへんねん。', '……风景真好。跑步的时候，是看不到这些的。', '...Nice view. When you are running you never see this sort of thing.'), mood: 'neutral' },
    culture: { ...L('……ねむ。……いや寝てへん！ 寝てへんで！ 説明が長すぎるんや！', '……好困。……不，没睡！我没睡！是说明太长了！', '...Sleepy. ...No, I am not asleep! I am not! The explanations are too long!'), mood: 'surprised' },
    sport: { ...L('ナイス！ そうや、それや！ ……あんた、ちょっとずつ上手なっとるで。', '漂亮！对，就是那样！……你一点一点在进步哦。', 'Nice! Yes, that is it! ...You are getting better, bit by bit.'), mood: 'happy' },
    night: { ...L('夜の街って、なんか静かでええな。……試合の前の夜みたいや。', '夜里的街道，安安静静的真好。……像比赛前一天晚上。', 'The town at night, it is nice and quiet. ...Like the night before a match.'), mood: 'neutral' },
    formal: { ...L('ナイフ……どっちの手や……。もうええ、箸ください。', '刀……用哪只手……。算了，请给我筷子。', 'Knife... which hand... Forget it, chopsticks please.'), mood: 'sad' },
    home: { ...L('料理？ ……うち、ゆで卵しかできへんで。爆発させたことあるけど。', '做饭？……我只会煮鸡蛋哦。虽然还煮爆过。', 'Cooking? ...I can only do boiled eggs. And I have exploded one.'), mood: 'shy' }
  },
  [CharacterId.NAO]: {
    food: { ...L('それ、あたしのも一口。……いいでしょ、昔からそうしてたじゃん。', '那个，也给我一口。……可以吧，以前不都这样嘛。', 'Give me a bite of that. ...It is fine, we always used to.'), mood: 'happy' },
    play: { ...L('あんた、昔からこれ弱いよね。……あたしに勝てたこと、一回もないでしょ。', '你从以前就不擅长这个吧。……一次都没赢过我吧。', 'You have always been bad at this. ...You have never once beaten me.'), mood: 'tease' },
    scenery: { ...L('……覚えてる？ 昔、こういうとこで迷子になったの。あんたが泣いて、あたしが手引っ張って。', '……还记得吗？以前在这种地方迷过路。你哭了，我拉着你的手。', '...Remember? We got lost somewhere like this once. You cried and I dragged you by the hand.'), mood: 'shy' },
    culture: { ...L('メモしとこ。……あんたが興味持ったとこ、あとで調べてあげる。', '记下来。……你感兴趣的地方，我回头帮你查。', 'I will make a note. ...Whatever you were interested in, I will look up for you later.'), mood: 'neutral' },
    sport: { ...L('無理しないの。……ほら、水。あんたの分も持ってきてる。', '别勉强。……喏，水。你的份我也带了。', 'Do not overdo it. ...Here, water. I brought yours too.'), mood: 'neutral' },
    night: { ...L('送ってく。……隣なんだから、送るも何もないけど。', '我送你回去。……虽然住隔壁，也谈不上送。', 'I will walk you back. ...Not that it counts, living next door.'), mood: 'shy' },
    formal: { ...L('ネクタイ曲がってる。……動かないで。昔もこうやって直したでしょ。', '领带歪了。……别动。以前我不也这样帮你弄过嘛。', 'Your tie is crooked. ...Hold still. I used to fix it like this before.'), mood: 'shy' },
    home: { ...L('味噌汁、まだ覚えてる？ ……教えたでしょ。忘れてたら怒るから。', '味噌汤，还记得吗？……教过你的吧。要是忘了我会生气的。', 'Do you still remember the miso soup? ...I taught you. I will be cross if you forgot.'), mood: 'neutral' }
  },
  [CharacterId.MAKI]: {
    food: { ...L('せんぱいのそれ、一口ちょーだい♡ ……あーん、は？ してくれへんの？', '前辈的那个，给我一口嘛♡……"啊——"呢？不喂我吗？', 'Give me a bite of yours, senpai. ...Well? Are you not going to feed me?'), mood: 'tease' },
    play: { ...L('はい勝ち〜！ せんぱい、よわよわ♡ ……もう一戦？ ええで、何回でも泣かしたる。', '赢啦～！前辈，弱弱的♡……再来一局？好啊，让你哭多少次都行。', 'I win! So weak, senpai. ...Another round? Sure, I will make you cry as often as you like.'), mood: 'tease' },
    scenery: { ...L('……ふーん。ウチ、こういうとこ興味ないけど。……せんぱいとやったら、まあ、ええわ。', '……哼。我对这种地方没兴趣。……不过跟前辈一起的话，嘛，也行。', '...Hmph. I am not into places like this. ...With you, though, it is fine.'), mood: 'shy' },
    culture: { ...L('ウチ、こういうの退屈やねん。……でもせんぱいが楽しそうやから、見とったる。', '我觉得这种东西很无聊。……不过前辈好像很开心，我就陪你看吧。', 'This stuff bores me. ...But you look like you are enjoying it, so I will watch.'), mood: 'pout' },
    sport: { ...L('汗くさ〜。……うそうそ。ちょっとかっこよかったで。ちょっとだけな。', '一身汗味～。……骗你的骗你的。有一点点帅哦。就一点点。', 'Ew, sweaty. ...Kidding. That was a bit cool. Just a bit.'), mood: 'shy' },
    night: { ...L('夜遊びや〜♡ ……せんぱい、悪い子やな。ウチと一緒や。', '夜游～♡……前辈，是坏孩子呢。跟我一样。', 'A night out! ...You are a bad kid, senpai. Same as me.'), mood: 'tease' },
    formal: { ...L('こういう店、ウチ浮いとらん？ ……浮いとらんか。そやろ、ウチかわいいもんな。', '这种店，我会不会太显眼？……不会吗。也是，我这么可爱嘛。', 'Do I stick out in a place like this? ...No? Of course not, I am cute.'), mood: 'tease' },
    home: { ...L('せんぱいの部屋〜♡ ベッドの下、なに隠しとるん？ ……冗談やって、怒んなや。', '前辈的房间～♡床底下藏了什么？……开玩笑的啦，别生气。', 'Senpai\'s room! What are you hiding under the bed? ...Kidding, do not get mad.'), mood: 'tease' }
  }
};

// 主角发出去的那条邀约
export const inviteMessage = (spotJp: string): Line => ({
  jp: `${spotJp}、一緒に行かない？`,
  zh: `要不要一起去${spotJp}？`,
  en: `Want to go to ${spotJp} together?`
});

// ---------------------------------------------------------
// 👗 "穿那身来好不好？" —— 主角在邀约里点名要她穿哪一身。
// 她会穿来，但每个人答应的方式不一样。
// ---------------------------------------------------------
export const WEAR_REQUEST_LINES: Record<CharacterId, Line & { mood: Mood }> = {
  [CharacterId.ASUKA]:  { ...L('……あんたがどうしてもって言うから着てきただけよ。どうしてもって言ったでしょ？ 言ったわよね？', '……是你非要我穿，我才穿来的。你说了"非要"对吧？说了吧？', '...I only wore it because you insisted. You did insist, did you not? You did.'), mood: 'pout' },
  [CharacterId.HIKARI]: { ...L('リクエストにお応えしましたー！ ……って、なんで自分で照れてんねやろ、うち。', '响应点单——！……话说，我自己干嘛害羞啊。', 'Request fulfilled! ...Wait, why am I the one getting embarrassed?'), mood: 'shy' },
  [CharacterId.REI]:    { ...L('指定の服装で来ました。……理由は聞きませんでした。聞くと、答えを知ってしまうので。', '按指定的服装来了。……我没问理由。问了的话，就会知道答案了。', 'I came in the specified clothing. ...I did not ask why. If I asked, I would know the answer.'), mood: 'shy' },
  [CharacterId.INARI]:  { ...L('ふふ、注文の多い人の子じゃ。……まあよい。汝が見たいと言うなら、何度でも化けてやろう。', '呵呵，真是个要求多的人类孩子。……罢了。你说想看的话，妾身变多少次都行。', 'Hehe, a demanding child of man. ...Very well. If you wish to see it, I will change as often as you like.'), mood: 'tease' },
  [CharacterId.MIYUKI]: { ...L('……これ、本当にまた着ることになるなんて。ふふ、あなたのお願いだから、特別よ？', '……没想到真的会再穿这身。呵呵，因为是你的请求，特别破例哦？', '...I never thought I would actually wear this again. Hehe, it is only because you asked. Special treatment, yes?'), mood: 'shy' },
  [CharacterId.SORA]:   { ...L('……着てきたで。約束やからな。約束は守る。それだけや。……それだけやって！', '……穿来了。因为答应了你。答应的事就要做到。就这样。……我说就这样！', '...I wore it. I said I would. I keep my word. That is all. ...I said that is all!'), mood: 'shy' },
  [CharacterId.NAO]:    { ...L('……ほんとにこれでいいの？ 変なの。……まあ、あんたが言うなら、いいけど。', '……真的要这身吗？怪人。……嘛，你说要的话，那就这样吧。', '...You really want this one? Weird. ...Well, if you say so. Fine.'), mood: 'shy' },
  [CharacterId.MAKI]:   { ...L('せんぱいのリクエストやで〜？ 高くつくからな、これ♡ ……ちゃんと見ときや。', '这可是前辈点的单哦～？很贵的哦♡……要好好看着。', 'This is your request, senpai. It will cost you. ...So look properly.'), mood: 'tease' }
};

// 你夸过的那一身，她自己又穿来了（没人要求）
export const WEAR_PRAISED_LINES: Record<CharacterId, Line & { mood: Mood }> = {
  [CharacterId.ASUKA]:  { ...L('な、何よ。前に似合うって言ったの、あんたでしょ。……覚えてないとか言ったら許さないから。', '干、干嘛。之前说合适的不就是你吗。……敢说不记得我饶不了你。', 'Wh-what? You are the one who said it suited me. ...Say you do not remember and you are dead.'), mood: 'pout' },
  [CharacterId.HIKARI]: { ...L('前に褒めてくれたやつ！ ……覚えてる？ うちはめっちゃ覚えてるで！', '你上次夸过的这身！……还记得吗？我可是记得清清楚楚！', 'The one you praised last time! ...Remember? I remember it really well!'), mood: 'happy' },
  [CharacterId.REI]:    { ...L('前回、肯定的な評価を得た服装です。……再現性を確かめたくて。', '这是上次得到肯定评价的服装。……我想确认一下可重复性。', 'This outfit received a positive assessment last time. ...I wanted to test reproducibility.'), mood: 'happy' },
  [CharacterId.INARI]:  { ...L('汝が褒めた姿じゃ。……神とて、褒められれば嬉しいのでな。', '这是你夸过的样子。……就算是神，被夸了也是会开心的。', 'The form you praised. ...Even a god is pleased to be praised.'), mood: 'happy' },
  [CharacterId.MIYUKI]: { ...L('……あなたが似合うって言ってくれたから。また、着てみたくなっちゃった。', '……因为你说过合适。所以又想穿了。', '...You said it suited me. So I found myself wanting to wear it again.'), mood: 'shy' },
  [CharacterId.SORA]:   { ...L('……これ、あんたが褒めたやつやろ。べ、別にそれで選んだんちゃうで。たまたまや。', '……这是你夸过的那身吧。我、我可不是因为这个才选的。碰巧而已。', '...This is the one you liked. N-not that that is why I picked it. Coincidence.'), mood: 'shy' },
  [CharacterId.NAO]:    { ...L('……覚えてる？ これ、あんたが似合うって言ったの。……あたしは覚えてた。', '……还记得吗？这身，你说过合适。……我可是记得的。', '...Remember? You said this one suited me. ...I remembered.'), mood: 'shy' },
  [CharacterId.MAKI]:   { ...L('せんぱいが褒めたやつ着てきたったで。……ウチ、ちょろいって思った？ 思ったやろ。', '把前辈夸过的那身穿来了哦。……觉得我很好哄？你肯定这么想了吧。', 'I wore the one you praised. ...You think I am easy, right? You totally do.'), mood: 'tease' }
};
