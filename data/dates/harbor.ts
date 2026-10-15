import { D, say, joke, act } from './kit';

// 美利坚公园看港口
export const HARBOR = {
  asuka: D(
    ['明日香在港口的长椅上坐得很端正，手里拿着一本旅游手册，给你讲神户港是哪一年开港的。讲到第三个年份，海风把手册的一页吹翻了，她没去按。', 'Asuka sits primly on a harbour bench with a guidebook, telling you the year Kobe port opened. By the third date the wind flips a page and she doesn\'t hold it down.'],
    ['她看着远处的船，说她小时候想当船长，因为船长\"不用听任何人的\"。说完她自己笑了，说\"现在倒是在管别人\"。', 'She watches a ship and says she wanted to be a captain as a kid — captains \"don\'t have to listen to anyone.\" Then she laughs: \"and now I\'m the one bossing people around.\"'],
    ['汽笛响了一声。她把手册合上，没再翻开。', 'A horn sounds. She closes the guidebook and doesn\'t open it again.'],
    [say('明日香なら、いい船長になれると思う。', '我觉得明日香能当个好船长。', 'I think you\'d make a good captain.', '接住她的梦', 'Take her dream seriously',
      ['shy', '……な、何よ急に。……でも、そうね。乗組員が一人いれば、出航できるかも。', '……干、干嘛突然这样。……不过也是。有一个船员的话，说不定就能出航了。', '...Wh-what\'s this all of a sudden. ...But, well. With one crew member, maybe I could set sail.'],
      ['明日香なら、いい船長になられると思う。', '「なられる」是尊敬语/被动，这里用可能形「なれる」。', 'なられる is honorific/passive; use potential なれる.'],
      ['明日香なら、いい船長にならないと思う。', '\"我觉得你当不了\"，她会把手册砸过来。', '\"I don\'t think you would\" — she\'d throw the book.']),
     joke('「船长不用听人的？那你现在是在管全班的船长。」', '"Captains don\'t listen to anyone? So you\'re captain of the whole class."', '打趣', 'Tease',
      ['tease', '……そうよ。だから、あなたも私の命令に従いなさい。……まずは、隣に座ること。', '……没错。所以你也要服从我的命令。……首先，坐到我旁边。', '...Exactly. So you follow my orders too. ...First: sit next to me.']),
     act('帮她按住被风吹乱的手册', 'Hold down the wind-blown guidebook for her', '风太大了', 'It\'s windy',
      ['happy', '……ありがと。……手、ちょっと、触れたわね。……い、今のは事故よ。', '……谢谢。……手，稍微碰到了呢。……刚、刚才是意外。', '...Thanks. ...Our hands touched a little. ...Th-that was an accident.'])]
  ),
  hikari: D(
    ['光说港口的风是\"海の味\"，张大嘴吸了一口，然后被吹得咳嗽。她指着红色的港塔说像\"鼓\"，指着海洋博物馆说像\"船の骨\"，每样东西都要给它起个外号。', 'Hikari says the harbour wind tastes like the sea, gulps it, and coughs. She calls the red tower \"a drum\" and the maritime museum \"a ship\'s skeleton\" — everything gets a nickname.'],
    ['她在栏杆边找到一只海鸥，蹲下来跟它对视。海鸥一动不动，她也一动不动，直到你笑出声。', 'At the railing she finds a gull and crouches for a staring contest. Neither moves until you laugh.'],
    ['海鸥飞走了。她站起来，拍拍裙子，看着你：\"{name}くんは、何に見える？\"', 'The gull flies off. She stands, brushes her skirt, and asks what YOU think things look like.'],
    [say('光ちゃんが付けた名前のほうが、本物よりいいね。', '你起的名字，比真名还好。', 'Your names are better than the real ones.', '夸她的想象力', 'Praise her imagination',
      ['happy', 'ほんま！？　……じゃあ、{name}くんにも名前つけたろか。……「うちの」とか。……う、うそうそ！', '真的！？……那我也给你起个名字吧。……比如「我的」。……骗、骗你的！', 'Really?! ...Then I\'ll name you too. ...Like \"mine\". ...K-kidding!'],
      ['光ちゃんが付けた名前のほうが、本物よりいいのね。', '「〜のね」是女性语气的确认，男主说略奇怪，直接「いいね」。', '〜のね sounds oddly feminine here; plain いいね.'],
      ['光ちゃんが付けた名前のほうが、本物より悪いね。', '\"比真名还差\"，扫兴。', '\"Worse than the real ones\" — a buzzkill.']),
     joke('「你跟海鸥对视那么久，是在谈恋爱吗？」', '"That long staring contest with the gull — a romance?"', '吐槽', 'Snark',
      ['pout', 'ちゃうわ！　……あの子、ちょっと {name}くんに似とったんや。眉毛の感じが。', '才不是！……那孩子，有点像你。眉毛的感觉。', 'No! ...That bird looked a bit like you. Something about the eyebrows.']),
     act('指着一朵云，说它像她', 'Point at a cloud and say it looks like her', '轮到你起名字', 'Your turn to name things',
      ['shy', 'え、どこが！？　……ふわふわしてるとこ？　……それ、褒めてる？　……褒めてるってことにしとく。', '诶，哪里像！？……软绵绵的地方？……这算夸吗？……就当是夸吧。', 'Huh, how?! ...The fluffy part? ...Is that a compliment? ...I\'ll take it as one.'])]
  ),
  rei: D(
    ['铃站在栏杆前，盯着港口里的起重机看了很久。她说那台起重机的臂长大约是四十二米，误差不超过两米。你问她怎么知道，她说\"影の長さ\"。', 'Rei studies a harbour crane for a long time. About forty-two metres of arm, give or take two. How does she know? \"The length of its shadow.\"'],
    ['夕阳开始落的时候，她不再说数字了。她说，这里的海和她小时候住的地方的海，颜色不一样。', 'As the sun sets she stops giving numbers. The sea here, she says, is a different colour from the sea where she grew up.'],
    ['她转过头，看着你，好像在等你问下去。', 'She turns and looks at you, as if waiting for you to ask more.'],
    [say('鈴の故郷の海、いつか見てみたい。', '想有一天去看看铃故乡的海。', 'Someday I\'d like to see the sea where you grew up.', '想知道她的过去', 'Want to know her past',
      ['shy', '……灰色です。冬は、もっと灰色。……でも、あなたと見たら、別の色に見えるかもしれません。', '……是灰色的。冬天更灰。……不过和你一起看的话，说不定会看起来是别的颜色。', '...It\'s grey. Greyer in winter. ...But seen with you, it might look like another colour.'],
      ['鈴の故郷の海、いつか見られてみたい。', '「見られてみたい」是\"想被看\"，搞混了被动。', '見られてみたい means \"want to be seen\".'],
      ['鈴の故郷の海、いつか忘れてみたい。', '\"想忘掉\"，莫名其妙。', '\"Want to forget it\" — nonsense.']),
     joke('「用影子量起重机，你是古希腊人吗。」', '"Measuring cranes by their shadows — are you an ancient Greek?"', '吐槽', 'Snark',
      ['tease', '……タレスと同じ方法です。……あなたの影も、測ってあげましょうか。身長、ちょっと盛ってますよね。', '……和泰勒斯一样的方法。……要不要也帮你量一下影子？你的身高，稍微虚报了吧。', '...Same method as Thales. ...Shall I measure your shadow too? You\'ve been rounding up your height.']),
     act('不说话，跟她一起看海的颜色变化', 'Say nothing, and watch the sea change colour with her', '陪她看', 'Watch with her',
      ['happy', '……今、ちょうど、オレンジから紫に変わりました。……一緒に見られて、よかったです。', '……现在，正好从橙色变成紫色了。……能一起看到，真好。', '...Just now it shifted from orange to purple. ...I\'m glad we saw it together.'])]
  ),
  inari: D(
    ['稻荷第一次见到这么多钢铁的大船。她站在栏杆前，问你这些\"鉄の鯨\"吃什么。你说吃油，她点头，说\"なるほど、灯明と同じか\"。', 'Inari has never seen so many great steel ships. She asks what these \"iron whales\" eat. Oil, you say. She nods: \"Ah, like the shrine lamps.\"'],
    ['她说一百多年前，她还在山上的时候，就看见港口一天比一天热闹。\"人の子は、すぐに大きなものを作る\"，她说，语气里不知道是骄傲还是寂寞。', 'Over a century ago, from the mountain, she watched the port grow busier every day. \"Human children build big things so quickly,\" she says — proud or lonely, you can\'t tell.'],
    ['一艘渡轮靠岸了。她看着下船的人，看了很久。', 'A ferry docks. She watches the passengers disembark for a long time.'],
    [say('稲荷様が見守ってくれたから、ここまで来られたんですよ。', '因为稻荷大人一直守护着，才走到今天的。', 'It got this far because you watched over it.', '感谢她', 'Thank her',
      ['shy', '……そ、そうか？　……人の子に礼を言われるのは、悪くないのう。……もっと言ってもよいぞ。', '……是、是吗？……被人类道谢，感觉不坏呢。……可以多说几句哦。', '...I-is that so? ...Being thanked by a human isn\'t bad. ...You may say it more.'],
      ['稲荷様が見守ってあげたから、ここまで来られたんですよ。', '「てあげた」是\"给别人\"，对神明说要用「てくれた」。', 'てあげた faces outward; for her favour to us, てくれた.'],
      ['稲荷様が見捨てたから、ここまで来られたんですよ。', '\"因为你抛弃了它\"，她会生气。', '\"Because you abandoned it\" — she\'d be furious.']),
     joke('「铁鲸鱼吃油的话，稻荷大人吃油豆腐，算同类？」', '"Iron whales eat oil, you eat fried tofu — same species?"', '开玩笑', 'Joke',
      ['angry', '一緒にするでない！　……わらわの油揚げは、神聖なのじゃ。……ちょっと、食べたくなってきた。', '别混为一谈！……我的油豆腐是神圣的。……有点想吃了。', 'Don\'t lump us together! ...My fried tofu is sacred. ...Now I want some.']),
     act('跟她一起朝渡轮上的人挥手', 'Wave with her at the ferry passengers', '让她参与', 'Let her join in',
      ['happy', '……振り返してくれた！　……ふふ、人の子は、愛いのう。そなたも含めてじゃ。', '……他们也挥手了！……呵呵，人类真可爱。也包括你哦。', '...They waved back! ...Heh, human children are lovely. You included.'])]
  ),
  miyuki: D(
    ['深雪说她二十出头的时候，经常一个人来这里，坐在同一张长椅上，等一班永远不会来的船。你问是什么船，她笑着说\"比喩よ\"。', 'Miyuki says that in her early twenties she often came here alone, to the same bench, waiting for a ship that would never come. Which ship? She smiles. \"A metaphor.\"'],
    ['她带你去了那张长椅。上面的油漆已经重刷过了，但位置没变。她坐下，拍了拍旁边。', 'She leads you to that bench. Repainted, but in the same spot. She sits and pats the seat beside her.'],
    ['她看着海，好像在跟以前的自己说话。', 'She looks at the sea, as if speaking to her younger self.'],
    [say('もう、待たなくてもいいですよ。', '已经不用再等了。', 'You don\'t have to wait anymore.', '回应那个比喻', 'Answer the metaphor',
      ['shy', '……あら。……ずるいわね、そういう言い方。……そうね。船、来たのかもしれないわ。', '……哎呀。……这种说法，太狡猾了。……也是呢。船，也许已经来了。', '...Oh. ...That\'s unfair, putting it like that. ...Well. Maybe the ship has come.'],
      ['もう、待たれなくてもいいですよ。', '「待たれなくても」是被动，变成\"不用被等\"。', '待たれなくても is passive — \"needn\'t be waited for\".'],
      ['もう、待たなければいけませんよ。', '\"你必须继续等\"，恰好相反。', '\"You must keep waiting\" — the opposite.']),
     joke('「比喻的船……该不会是前男友吧。」', '"A metaphorical ship... an ex-boyfriend?"', '追问', 'Prod',
      ['tease', 'ふふ、どうかしら。……嫉妬した？　かわいいわね。', '呵呵，谁知道呢。……吃醋了？好可爱哦。', 'Hehe, who knows. ...Jealous? How cute.']),
     act('在长椅的扶手上，偷偷刻一个今天的日期', 'Secretly scratch today\'s date into the bench armrest', '留下记号', 'Leave a mark',
      ['happy', '……あら、いたずらっ子。……でも、いいわ。今度ここに来たら、待つんじゃなくて、思い出しに来るわね。', '……哎呀，调皮鬼。……不过，好吧。下次来这里，就不是来等待，而是来回忆的了。', '...Oh, you rascal. ...But fine. Next time I come here, it won\'t be to wait — it\'ll be to remember.'])]
  ),
  sora: D(
    ['空说港口是她晨跑的终点。她每天早上从三宫跑过来，碰到栏杆就算赢。今天她带你走了一遍那条路线，走到一半她就忍不住开始小跑。', 'The harbour is the finish of Sora\'s morning run — from Sannomiya, touch the railing, win. Today she walks you along the route, and halfway she can\'t help breaking into a jog.'],
    ['到了栏杆，她拍了一下，转身对你笑：\"今日もゴール！\"然后她靠着栏杆，看海，难得地安静。', 'At the railing she slaps it and grins: \"Goal again today!\" Then she leans on it and watches the sea, unusually quiet.'],
    ['她说，有时候跑到这里，会突然不知道自己在为什么跑。', 'Sometimes, she says, she reaches here and suddenly doesn\'t know what she\'s running for.'],
    [say('明日の朝、一緒に走ってもいい？', '明天早上，可以一起跑吗？', 'Can I run with you tomorrow morning?', '给她一个理由', 'Give her a reason',
      ['shy', '……お、おう。……ほな、遅れたら置いてくで。……いや、待っとく。……ゴールは、一緒にや。', '……哦、嗯。……那你落后的话我就丢下你了。……不，我等你。……终点，要一起到。', '...O-okay. ...Fall behind and I\'m leaving you. ...No, I\'ll wait. ...We finish together.'],
      ['明日の朝、一緒に走られてもいい？', '「走られて」是被动/尊敬，这里用「走っても」。', '走られて is passive; use 走っても.'],
      ['明日の朝、一緒に走ってはいけない？', '\"不可以一起跑吗\"语气变成质问，而且有点怪。', 'Sounds like an accusation rather than a request.']),
     joke('「碰栏杆算赢——你在跟谁比赛？」', '"Touching the railing counts as winning — against whom?"', '吐槽', 'Snark',
      ['tease', '昨日のウチや。……今日のウチが、一秒速かった。……今日はお前のせいで、遅いけどな。', '跟昨天的我。……今天的我快了一秒。……虽然今天因为你，慢了。', 'Yesterday\'s me. ...Today\'s me was one second faster. ...Slower today, thanks to you.']),
     act('在栏杆上她拍过的地方，也拍一下', 'Slap the railing where she slapped it', '一起到终点', 'Reach the goal too',
      ['happy', '……へへ。ゴール、二人で切ったな。……今日の記録は、これが一番や。', '……嘿嘿。终点线，两个人一起撞的。……今天的记录，这个最好。', '...Heh. We broke the tape together. ...Best record of the day.'])]
  ),
  nao: D(
    ['奈绪很喜欢港口的风，因为风大的时候，别人听不清她说话，她就可以说得大声一点。她站在栏杆边，对着海，说了一句什么。你没听清。', 'Nao likes the harbour wind: when it\'s loud, nobody can hear her, so she can speak a little louder. At the railing she says something to the sea. You don\'t catch it.'],
    ['你问她说了什么，她摇头。风小了一点，她把小本子拿出来，写了一行字，给你看：\"ここ、むかし いっしょに きた\"。', 'You ask. She shakes her head. When the wind drops she writes a line in her notebook and shows you: \"we came here once, long ago.\"'],
    ['你想起来了。小学的远足，你们在这里分了一个饭团。', 'You remember. A primary-school trip; you split a rice ball here.'],
    [say('覚えてるよ。おにぎり、半分こしたよね。', '我记得。我们分了一个饭团。', 'I remember. We split a rice ball.', '让她知道你记得', 'Let her know you remember',
      ['shy', '……おぼえてたんだ。……あのとき、あんた、おおきいほう くれた。……きょうは、あたしが あげる。', '……你还记得啊。……那时候，你把大的那半给了我。……今天，换我给你。', '...You remember. ...Back then you gave me the bigger half. ...Today, it\'s my turn.'],
      ['覚えてるよ。おにぎり、半分こされたよね。', '被动「半分こされた」是\"被分了\"，意思不对。', 'Passive されたよね — \"got split on\" — wrong.'],
      ['忘れたよ。おにぎり、なんだっけ。', '\"忘了\"，她会难过。', '\"Forgot\" — she\'d be sad.']),
     joke('「你刚才对着海说了什么？告白吗？」', '"What did you tell the sea? A confession?"', '逗她', 'Tease her',
      ['pout', '……ないしょ。……かぜが つよいひに、また いう。……あんたに きこえないように。', '……秘密。……风大的日子，再说一次。……让你听不见。', '...Secret. ...I\'ll say it again on a windy day. ...So you can\'t hear.']),
     act('从包里拿出一个饭团，掰成两半', 'Take a rice ball from your bag and break it in two', '像那时一样', 'Like back then',
      ['happy', '……！　……じゅんび、してたの。……ずるい。……おおきいほう、あたしが もらう。', '……！……你准备了啊。……狡猾。……大的那半，我要了。', '...! ...You came prepared. ...Unfair. ...I\'m taking the bigger half.'])]
  ),
  maki: D(
    ['真希说港口是她游戏里某一关的原型，她来\"聖地巡礼\"。她举着手机，找到和游戏画面一模一样的角度，然后要你站在画面中间，摆一个\"ボス\"的姿势。', 'Maki says the harbour inspired a level in her game — she\'s on a pilgrimage. Phone up, she finds the exact in-game angle and makes you stand in the middle doing a \"boss\" pose.'],
    ['拍了十几张，她才满意。然后她蹲在栏杆边，把照片一张张放大看，嘴里念叨着\"せんぱい、ボスの才能ないな\"。', 'A dozen shots later she\'s satisfied. Crouched by the railing, she zooms into each one, muttering that senpai has zero boss talent.'],
    ['最后一张，你没摆姿势，只是在笑。她盯着那张看了很久。', 'In the last one you weren\'t posing, just laughing. She stares at it for a long time.'],
    [say('今度は、真希も一緒に写ろう。', '下次，真希也一起入镜吧。', 'Next time, let\'s be in the photo together.', '把她拉进画面', 'Pull her into the frame',
      ['shy', '……え。……ウチ、写真うつり悪いねんけど。……まあ、せんぱいと一緒なら、ボス戦二人プレイってことで。', '……诶。……我很不上镜的。……算了，跟前辈一起的话，就当是双人打Boss吧。', '...Eh. ...I\'m not photogenic. ...Well, with senpai, call it a two-player boss fight.'],
      ['今度は、真希も一緒に写られよう。', '「写られよう」是被动意志形，不自然；用「写ろう」。', '写られよう is an unnatural passive volitional; use 写ろう.'],
      ['今度は、真希だけで写ろう。', '\"下次你一个人拍\"，把她推开了。', '\"Next time just you\" — pushes her away.']),
     joke('「我没有Boss的才能，那我当什么？」', '"No boss talent? Then what am I?"', '反问', 'Ask back',
      ['tease', '……雑魚敵A。……いや、セーブポイントやな。せんぱいのとこ来たら、なんか回復するし。', '……杂鱼敌人A。……不，是存档点吧。来前辈这里，总觉得能回血。', '...Mook A. ...No — a save point. Coming to you restores my HP somehow.']),
     act('把那张没摆姿势的照片，设成她的手机壁纸', 'Set that unposed photo as her phone wallpaper', '偷偷操作', 'Sneakily',
      ['angry', 'ちょ、何勝手に……！　……戻さへんけどな。……戻し方、忘れただけや。', '喂，你擅自……！……我不会改回去的。……只是忘了怎么改回去而已。', 'Hey, don\'t just...! ...I\'m not changing it back. ...I just forgot how.'])]
  )
};
