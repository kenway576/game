import { Mood } from '../data/outfitContext';

// ---------------------------------------------------------
// 🎲 约会途中的小插曲
//
// 同一个地方约第二次、第三次，地方本身那两拍是一样的——咖啡店还是那家咖啡店。
// 不一样的是**这一次碰上了什么**：隔壁桌的老人、突然下起来的雨、
// 一只不怕人的猫、一个认错人的游客。每个地方三段，每次随机抽一段。
//
// {her} 换成她的名字。mood 是她在这一段里的表情。
// ---------------------------------------------------------

export interface IncidentLine { zh: string; en: string; mood?: Mood }
const I = (zh: string, en: string, mood?: Mood): IncidentLine => ({ zh, en, mood });

export const DATE_INCIDENTS: Record<string, IncidentLine[][]> = {
  rooftop: [
    [I('一只乌鸦落在铁丝网上，歪着头看你们手里的东西。{her}说乌鸦能记住人的脸，记住之后会跟你一辈子。你决定今天对它客气一点。', 'A crow lands on the fence and tilts its head at what you are holding. {her} says crows remember faces and follow you for life once they do. You decide to be polite to it today.', 'tease')],
    [I('楼下吹奏部开始练习，一支小号在同一个音上卡了七八次。{her}跟着小声哼那个音，哼到第九次，小号终于过去了，你们两个都松了口气，好像过去的是自己。', 'The brass band starts practising downstairs and a trumpet catches on the same note seven or eight times. {her} hums it under her breath. On the ninth try the trumpet gets past it and you both breathe out, as if it were you.', 'happy')],
    [I('风把她的发丝吹到了你脸上。她慌忙去抓，抓了好几次都没抓住，最后干脆背过身去，用两只手按着头发，站成了一个很别扭的姿势。', 'The wind blows her hair across your face. She grabs for it several times and misses, and in the end turns her back on the wind with both hands clamped on her head, in a very awkward pose.', 'shy')]
  ],
  lab: [
    [I('门突然被推开，化学老师探进头来看了一眼，又看了看你们的护目镜，说了一句"火の始末だけはしっかりな"就走了。{her}在护目镜后面吐了吐舌头。', 'The door opens and the chemistry teacher looks in, at your goggles, says mind you put the flame out properly, and leaves. Behind her goggles {her} sticks out her tongue.', 'tease')],
    [I('烧杯里的水开了，咕嘟咕嘟地响。{her}说这个声音是她最喜欢的声音之一。你问其他的是什么，她数了三个：雨打在铁皮屋顶上，翻书，还有——她没说第三个。', 'The water in the beaker comes to the boil, bubbling. {her} says it is one of her favourite sounds. You ask what the others are. She lists three: rain on a tin roof, pages turning, and— she does not say the third.', 'shy')],
    [I('你不小心碰倒了一支试管，里面是蒸馏水，什么事都没有。可是你们俩同时扑过去扶，脑袋撞在了一起。护目镜救了你们。', 'You knock over a test tube. Only distilled water; no harm done. But you both lunge for it at the same time and bump heads. The goggles save you.', 'surprised')]
  ],
  gym: [
    [I('篮球滚到了舞台底下。你趴在地上伸手去够，够出来的除了球，还有一只不知道是谁的室内鞋、一个去年的值日表和一颗干掉的柿子。{her}笑到投不了篮。', 'The ball rolls under the stage. You lie flat to reach it and pull out, besides the ball, someone\'s indoor shoe, last year\'s cleaning rota and a dried persimmon. {her} laughs too hard to shoot.', 'happy')],
    [I('值周的老师来锁门，看见你们，叹了口气，说再给十分钟。十分钟里你们投了二十一个球，进了四个。', 'The teacher on duty comes to lock up, sees you, sighs, and gives you ten more minutes. In ten minutes you take twenty-one shots and make four.', 'happy')],
    [I('窗外开始下雨，雨点打在体育馆高高的屋顶上，声音大得像有人在上面撒豆子。你们干脆不投了，坐在地板上听了一会儿雨。', 'It starts to rain, drumming on the high gym roof like somebody scattering beans up there. You give up shooting and sit on the floor listening to it for a while.', 'neutral')]
  ],
  arcade: [
    [I('隔壁机台的小学生连赢了五局，转过头来挑衅地看着你。{her}把袖子一挽，坐了过去。五分钟以后，小学生哭着去找他哥哥了。', 'A primary schooler at the next machine wins five in a row and turns to look at you, challenging. {her} rolls up her sleeve and sits down opposite. Five minutes later the kid has gone crying to find his big brother.', 'tease')],
    [I('音游机台的屏幕上，排行榜第一名的名字是三个字母。{her}盯着那三个字母看了很久，说她知道那是谁。你问是谁，她说"秘密"。', 'On the rhythm game\'s leaderboard, first place is three letters. {her} stares at them a long time and says she knows who it is. You ask who. A secret, she says.', 'tease')],
    [I('一台抓娃娃机的爪子坏了，抓起来就不松开。店员过来修，修好之后为了道歉，送了你们一只小小的企鹅挂件。只有一只。', 'One crane machine\'s claw is broken and will not let go once it grips. An attendant fixes it and, by way of apology, gives you a little penguin keyring. Just the one.', 'happy'),
     I('你们为了企鹅归谁猜了三次拳。最后它挂在了{her}的书包上。', 'You play rock-paper-scissors three times for the penguin. It ends up on {her} bag.')]
  ],
  cafe: [
    [I('隔壁桌的老先生每喝一口咖啡，就在报纸上写一个字。你们观察了半个小时，也没弄明白他在写什么。走的时候他朝你们点了点头，好像知道自己被观察了。', 'The old man at the next table writes one character in his newspaper after every sip of coffee. You watch for half an hour and cannot work out what he is writing. When he leaves he nods to you, as if he knew.', 'tease')],
    [I('外面下起了雨。店员不声不响地在门口放了一个伞架，里面插着三把旧伞，伞柄上贴着"ご自由に"。{her}说下次还来的时候要把伞还回来。', 'It starts raining outside. Without a word the staff put an umbrella stand by the door with three old umbrellas and a sign: help yourself. {her} says you will have to bring one back next time.', 'happy')],
    [I('杯子底下有一张小小的卡片，上面写着今天咖啡豆的产地。{her}念出来，念到"エチオピア"的时候卡了一下，又念了一遍，念得特别清楚。', 'Under the cup is a small card naming today\'s bean. {her} reads it out, stumbles on "Ethiopia", and reads it again extra clearly.', 'shy')]
  ],
  pancake: [
    [I('松饼上的奶油塔倒了，正好倒向她那一边。她看着那一大坨奶油，沉默了三秒，然后很严肃地说："……これは、運命。"', 'The cream tower on the pancake topples, straight towards her side. She looks at the great mound of cream, silent for three seconds, then says gravely: this is fate.', 'tease')],
    [I('邻座是一对头发全白的老夫妇，两个人分一份松饼，老奶奶把草莓一颗一颗挑给老爷爷。{her}看了很久，然后发现你在看她看他们，立刻转过头去。', 'At the next table an old white-haired couple share one pancake, the wife picking out the strawberries one by one for her husband. {her} watches for a long time, then notices you watching her watch them, and looks away at once.', 'shy')],
    [I('店员端来盘子的时候说今天是店庆，送一份冰淇淋。只有一个勺子。', 'The waitress says it is the shop\'s anniversary and brings a free ice cream. With one spoon.', 'surprised'),
     I('你们看着那一个勺子，看了很久。最后{her}去柜台又要了一个，回来的时候脸是红的。', 'You both look at the one spoon for a long time. In the end {her} goes and asks for another, and comes back red in the face.')]
  ],
  nankinmachi: [
    [I('一个举着自拍杆的游客团把整条街堵住了。你们被挤到一家卖杏仁豆腐的店门口，干脆就进去了。杏仁豆腐很好吃，这是今天最大的收获。', 'A tour group with selfie sticks blocks the whole street. You are squeezed up against a shop selling almond tofu, so you go in. It is very good. Today\'s best find.', 'happy')],
    [I('一家店门口挂着一排烤鸭，{her}停下来盯着看，看了很久。你以为她饿了，她说不是，她只是在数。一共十二只。', 'Outside one shop hangs a row of roast ducks and {her} stops to stare. You think she is hungry. No, she says, she is counting. Twelve.', 'neutral')],
    [I('卖糖葫芦的老板认错了人，把{her}当成了常来的客人，多给了一颗草莓。她没有解释，收下了，然后把那颗草莓给了你。', 'The candied-fruit seller mistakes {her} for a regular and gives her an extra strawberry. She does not correct him, takes it, and gives it to you.', 'tease')]
  ],
  karaoke: [
    [I('点歌器出了故障，一直在随机播放演歌。你们放弃了抵抗，跟着唱了一首完全不认识的、关于北国港口和离别的歌，唱得意外地动情。', 'The tablet glitches and keeps playing random enka. You give up resisting and sing along to a song you have never heard, about a northern harbour and parting, with surprising feeling.', 'happy')],
    [I('隔壁包厢有人在唱同一首歌，比你们早半拍。你们干脆跟他们合起来，隔着墙唱完了一整首。出门的时候在走廊上碰到了，是三个上班族，大家互相鞠了一躬。', 'Someone in the next booth is singing the same song half a beat ahead. You join in through the wall and finish it together. In the corridor afterwards you meet them, three office workers, and everybody bows.', 'happy')],
    [I('屏幕上的分数打出了一个一百分。你们俩谁都不相信，又唱了一遍，这次是六十二分。{her}说第一次的不算，第二次的也不算。', 'The screen gives a perfect hundred. Neither of you believes it, so you sing it again and get sixty-two. {her} says the first one does not count, and neither does the second.', 'tease')]
  ],
  harbor: [
    [I('一艘很大的邮轮正在靠岸，甲板上站满了人在挥手。{her}也挥了，挥得很用力。你问她认识谁，她说不认识，但人家在挥手，不挥回去不礼貌。', 'A huge cruise ship is docking, its decks lined with waving passengers. {her} waves back hard. You ask who she knows. Nobody, she says, but it is rude not to wave back.', 'happy')],
    [I('一个钓鱼的老人钓上来一条很小的鱼，看了看，又放回去了，对着海说了一句"大きくなって来いよ"。{her}说她以后也想变成那样的老人。', 'An old man fishing pulls up a tiny fish, looks at it and puts it back, telling the sea: come back when you are bigger. {her} says she would like to be that kind of old person one day.', 'neutral')],
    [I('风把你的帽子还是围巾吹到了栏杆边上，{her}一把抓住了，然后才发现自己整个人都探出去了。她回过头，脸色比你还白。', 'The wind snatches something of yours to the railing and {her} grabs it, then realises she is leaning right out over the water. She turns round paler than you are.', 'surprised')]
  ],
  zoo: [
    [I('长颈鹿把头低下来，从栏杆上方看着{her}，看了很久，像是在确认什么。她一动不敢动，小声问你"これ、どうすればいいの"。', 'A giraffe lowers its head over the fence and studies {her} for a long time, as if checking something. She does not dare move and whispers: what do I do?', 'surprised')],
    [I('考拉馆里所有的考拉都在睡觉。说明牌上写着考拉一天睡二十个小时。{her}看着它们，说了一句"うらやましい"，说得特别真诚。', 'Every koala in the koala house is asleep. The sign says they sleep twenty hours a day. {her} watches them and says, with great sincerity: I envy them.', 'neutral')],
    [I('一个走丢的小孩拉住了{her}的衣角。你们带着他走到问询处，路上他一直在讲企鹅。他妈妈跑过来的时候，他已经跟她拉过钩了，约好下次一起来看企鹅。', 'A lost child grabs {her} by the hem. You walk him to the information desk and he talks about penguins all the way. By the time his mother arrives he has made her pinky-swear to see the penguins together next time.', 'happy')]
  ],
  aquarium: [
    [I('一条翻车鱼慢慢地游过来，停在玻璃前面，用一只眼睛看着你们，看了很久，然后慢慢地游走了。{her}说它刚才一定在想事情。', 'A sunfish drifts up to the glass, stops, and looks at you with one eye for a long time, then drifts away. {her} says it must have been thinking about something.', 'neutral')],
    [I('水母馆里光线变成了紫色。{her}的脸在紫光里看起来不太像她，像另一个更安静的人。她发现你在看，说"……なに"，声音也很安静。', 'In the jellyfish room the light turns violet. In it {her} face does not look quite like hers; it looks like a quieter person. She notices you looking and says, quietly too: what.', 'shy')],
    [I('纪念品店里有一只巨大的海豹玩偶。{her}抱了一下，又放回去，又抱了一下。最后她什么也没买，可是出门的时候回头看了两次。', 'The gift shop has an enormous seal plushie. {her} hugs it, puts it back, hugs it again. In the end she buys nothing, but looks back twice on the way out.', 'shy')]
  ],
  shrine: [
    [I('一对新人正在拍结婚照，白无垢在树荫底下白得发亮。{her}站在远处看了很久，看得很认真，像是在记什么东西。', 'A couple are having wedding photos taken, the bride\'s white kimono glowing under the trees. {her} watches from a distance for a long time, very intently, as if memorising something.', 'shy')],
    [I('一只黑猫从社殿底下钻出来，在你们脚边绕了一圈，又钻回去了。{her}说在神社里见到黑猫是吉兆。你问真的吗，她说不知道，但她决定相信。', 'A black cat slips out from under the shrine, circles your feet, and slips back. {her} says a black cat at a shrine is a good omen. You ask if that is true. She does not know, she says, but she has decided to believe it.', 'happy')],
    [I('风把绘马吹得哗哗响，几百块木牌一起碰撞，声音像下雨。你们站在那面墙前面听了一会儿，谁都没去读上面写的字。', 'The wind sets the votive tablets clattering, hundreds of wooden boards knocking together like rain. You stand in front of the wall listening, and neither of you reads what is written on them.', 'neutral')]
  ],
  beach: [
    [I('一只狗挣脱了主人的绳子，冲过来围着{her}跑了三圈，然后叼走了她的一只鞋。你追了它半个海滩。', 'A dog slips its lead, runs three circles round {her}, then makes off with one of her shoes. You chase it half the length of the beach.', 'surprised'),
     I('鞋拿回来的时候湿透了，还带着一圈牙印。她拿着那只鞋，笑得停不下来。', 'You bring the shoe back soaked, with a ring of teeth marks. She holds it and cannot stop laughing.')],
    [I('沙滩上有人用沙子堆了一座城堡，堆得很精致，还有吊桥。浪一下一下地舔它的边。{her}蹲在旁边，用手给它加了一道墙。', 'Someone has built a sandcastle, a fine one with a drawbridge, and the waves are licking at its edge. {her} crouches and adds a wall with her hands.', 'neutral')],
    [I('一架飞机拖着一条横幅从海上飞过去，上面写着什么，太远了看不清。{her}说一定是求婚。你说也可能是广告。她说不，一定是求婚。', 'A plane flies over the sea towing a banner, too far to read. {her} says it must be a proposal. You say it could be an advert. No, she says, it is definitely a proposal.', 'tease')]
  ],
  summer_festival: [
    [I('射击摊的老板说打中最上面那只熊就送给你。你打了五发，熊纹丝不动。{her}打了一发，熊掉了。她把熊塞给你，说"あげる"。', 'The shooting gallery man says knock down the top bear and it is yours. You fire five shots; the bear does not budge. {her} fires one; down it goes. She shoves it at you: here.', 'tease')],
    [I('一群小孩举着仙女棒从你们身边跑过去，其中一个摔倒了。{her}蹲下去把他扶起来，拍掉他膝盖上的土，他哭都没来得及哭就又跑了。', 'A pack of children run past with sparklers and one falls. {her} crouches to help him up and brush off his knees, and he runs off again before he has time to cry.', 'happy')],
    [I('木屐的带子断了。{her}单脚站着，有点狼狈。你从口袋里摸出一条手帕，撕成条，照着刚才在一个屋台后面看见的样子，把带子临时接上了。', 'The thong of her geta snaps. {her} stands on one foot, a little stranded. You find a handkerchief in your pocket, tear it into strips, and rig the strap the way you saw it done behind a stall earlier.', 'shy'),
     I('她试着走了两步，能走。回去的路上她一直低头看那只木屐。', 'She tries a couple of steps. It holds. All the way back she keeps looking down at that geta.')]
  ],
  settlement: [
    [I('钢琴师开始弹一首很慢的曲子。{her}的手指在桌布上跟着动，像在弹一架看不见的琴。你问她会弹吗，她说小时候学过，后来不学了。没说为什么。', 'The pianist starts something very slow. {her} fingers move on the tablecloth with it, playing an invisible piano. You ask if she plays. She learned as a child, she says, and stopped. She does not say why.', 'sad')],
    [I('隔壁桌的外国老太太听见你们说日语，用很慢的日语问你们从哪里来。聊了十分钟，临走时她说你们看起来"とてもお似合い"。', 'An elderly foreign lady at the next table hears your Japanese and asks, very slowly, where you are from. After ten minutes of chat she leaves saying you look very well matched.', 'shy'),
     I('{her}拿起茶杯，杯子是空的，她还是喝了一口。', '{her} lifts her teacup, finds it empty, and drinks from it anyway.')],
    [I('最上层的小蛋糕只剩一块。你们互相推让了三次，最后切成两半。切得不太平均，{her}把大的那半推了过来。', 'One little cake left on the top tier. You each offer it to the other three times, then cut it in half. Unevenly. {her} pushes the bigger half towards you.', 'happy')]
  ],
  jazz: [
    [I('贝斯手独奏的时候闭上了眼睛，整个人好像不在这间地下室里了。{her}也闭上了眼睛。你没有，你在看她。', 'The bassist closes his eyes for his solo, as if he has left the basement altogether. {her} closes her eyes too. You do not. You are watching her.', 'neutral')],
    [I('萨克斯手下台的时候经过你们桌，拍了拍你的肩膀，用关西腔说"ええ子連れとるな"。{her}低下头，假装在研究杯垫。', 'Passing your table on his way off, the saxophonist claps you on the shoulder and says in Kansai dialect: nice girl you have got there. {her} looks down and pretends to study the coaster.', 'shy')],
    [I('停电了。地下室一片漆黑，可是乐队没有停，在黑暗里接着演奏。没有人说话。三分钟以后灯亮了，所有人都在鼓掌。{her}的手一直抓着你的袖子，灯亮的时候才松开。', 'The power cuts out. The basement goes pitch dark, but the band plays on in the dark. Nobody speaks. Three minutes later the lights return to applause. {her} has been holding your sleeve the whole time, and lets go only when the lights come up.', 'surprised')]
  ],
  cook: [
    [I('锅里的东西突然冒起一大股烟，烟雾报警器响了。你们俩手忙脚乱地开窗、扇风、关火，等它终于停下来，两个人都笑得蹲在了地上。', 'The pan suddenly sends up a cloud of smoke and the alarm goes off. You both scramble to open windows, flap towels and kill the heat. When it finally stops you are both crouched on the floor laughing.', 'surprised')],
    [I('隔壁传来敲墙的声音，三下，很轻。{her}说那是深雪姐在说"好香"。你不知道她是怎么听出来的。', 'Three light knocks on the wall from next door. {her} says that is Miyuki saying it smells good. You have no idea how she can tell.', 'tease')],
    [I('只有一双像样的筷子，另一双是便利店送的一次性筷子。你把像样的那双给了她。她看了看，又换了回来，说"客なのはそっちじゃないでしょ"——然后才想起来，客人其实是她。', 'There is one proper pair of chopsticks; the other is a convenience-store disposable. You give her the good pair. She looks at them, swaps them back, saying you are not the guest here— and then remembers that she is.', 'shy')]
  ],
  movienight: [
    [I('电影放到一半，网断了，画面停在主角一张很奇怪的表情上。你们对着那张脸看了一分钟，笑到喘不过气。', 'Halfway through the wifi drops and the picture freezes on the lead actor pulling a very odd face. You stare at it for a minute and laugh until you cannot breathe.', 'happy')],
    [I('薯片吃完了。你们在柜子里翻出一包不知道什么时候买的仙贝，还没过期——过期了一天。{her}说一天不算。', 'The crisps are gone. You dig a packet of rice crackers out of the cupboard, still in date— well, one day over. One day does not count, says {her}.', 'tease')],
    [I('电影里有一场下雨的戏，窗外也正好开始下雨。你们俩同时看了一眼窗户，又同时看回屏幕，谁都没说话。', 'There is a rain scene in the film just as it begins raining outside. You both glance at the window at the same moment, then back at the screen, and neither of you says anything.', 'shy')]
  ],
  nightview: [
    [I('一颗流星划了过去，很快，快到你不确定自己是不是看见了。{her}说她看见了，而且已经许过愿了。你问许的什么，她说说出来就不灵了。', 'A shooting star, so fast you are not sure you saw it. {her} says she did, and has already made a wish. You ask what. If she told you, she says, it would not come true.', 'tease')],
    [I('观景台上有一对情侣在吵架，吵得很小声但很激烈。吵着吵着，女生突然笑了，男生也笑了。{her}看着他们，说"……いいな"，说完自己也愣了一下。', 'A couple on the platform are arguing, quietly but fiercely. Mid-argument the girl suddenly laughs, and so does he. {her} watches them and says ...that is nice, then seems surprised she said it.', 'shy')],
    [I('最后一班缆车的广播响了。你们俩都没动。广播又响了一遍，{her}才叹了口气，说"……帰ろっか"，可是脚还是没动。', 'The last ropeway is announced. Neither of you moves. It is announced again before {her} sighs: shall we go back. Her feet still do not move.', 'sad')]
  ],
  onsen: [
    [I('温泉街上有一只猫，躺在足汤边上一块被泡暖了的石头上睡觉。{her}说那是全有马最懂享受的家伙。', 'On the hot-spring street a cat is asleep on a stone warmed by the footbath. {her} calls it the best-informed resident of Arima.', 'happy')],
    [I('煎饼店的老奶奶说今天的煎饼烤坏了一锅，碎了，便宜卖。你们买了一大袋碎煎饼，一路走一路吃，吃得比完整的还香。', 'The old woman at the cracker shop says a batch broke today, so she is selling the pieces cheap. You buy a big bag and eat them walking, and they taste better than whole ones.', 'happy')],
    [I('开始下小雪了。雪落在温泉冒出来的热气里，还没碰到地面就化了。{her}伸出手去接，接了半天一片都没接到。', 'It starts to snow, lightly. The flakes fall into the steam rising from the springs and melt before they touch the ground. {her} holds out her hand to catch one and catches nothing for ages.', 'neutral')]
  ],
  luminarie: [
    [I('人群里有人在拉小提琴，拉的是一首很老的曲子。{her}停下来听，听完往琴盒里放了一枚一百日元，然后又放了一枚——替你放的。', 'Someone in the crowd is playing an old tune on the violin. {her} stops to listen and drops a hundred yen in the case, then another — on your behalf.', 'happy')],
    [I('一个老人站在灯下，一动不动地看了很久，眼睛是红的。{her}没有说话，只是把脚步放慢了，等你们走过去以后才小声说："……来てよかったね。"', 'An old man stands motionless under the lights for a long time, his eyes red. {her} says nothing, only slows her step, and when you are past says quietly: I am glad we came.', 'sad')],
    [I('太挤了，你们被人潮推着走，几乎被冲散。{her}从人缝里伸过手来，抓住了你外套的下摆，抓了一路。', 'It is so crowded the current of people nearly separates you. {her} reaches through the gap and catches the hem of your coat, and holds it all the way.', 'shy')]
  ],
  teppanyaki: [
    [I('厨师表演的时候把一片洋葱抛起来，用铲子接住，叠成了一座小火山，往里倒了一点酒，火苗窜起来。{her}吓了一跳，抓住了你的手腕，然后假装是在扶桌子。', 'The chef flips onion rings into a little volcano and pours in a splash of spirit; the flame shoots up. {her} jumps and grabs your wrist, then pretends she was steadying the table.', 'surprised')],
    [I('厨师问你们是不是在庆祝什么。你们对视了一眼，谁都没回答。厨师笑了笑，什么也没再问，最后端上来的甜点上用巧克力写了一行小字："おめでとう"。', 'The chef asks whether you are celebrating something. You look at each other and neither answers. He smiles and asks nothing more, but the dessert arrives with a line written in chocolate: congratulations.', 'shy')],
    [I('账单来的时候，{her}先伸手去拿。你按住了。两个人的手都按在那张小小的账单上，谁都不松开，厨师在铁板后面装作在擦锅。', 'When the bill comes {her} reaches for it first. You pin it down. Both your hands are on the little slip and neither will let go, while behind the hotplate the chef pretends to be cleaning.', 'tease')]
  ]
};
