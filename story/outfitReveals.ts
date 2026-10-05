import { CharacterId } from '../types';
import { Mood } from '../data/outfitContext';

// ---------------------------------------------------------
// 👗 第一次看见她穿这一身
//
// 衣服是解锁来的，可解锁本身只是一行"解锁服装：swim, yukata"。
// 真正的奖励是**那一刻**：她从人群里走过来，你花了半秒才认出她，
// 她看见你在看，先开口的是她——每个人开口的方式都不一样。
//
// 每套衣服只演一次完整的亮相（seen_outfit_<角色>_<衣服>），
// 之后再穿就是一句带过。玩家在这里有一次选择：夸她、说不出话、或者开个玩笑。
// 三种说法每个人各有一种回法。
// ---------------------------------------------------------

export interface RevealLine { jp: string; zh: string; en: string; mood: Mood }
export interface OutfitReveal { lookZh: string; lookEn: string; line: RevealLine }

const R = (lookZh: string, lookEn: string, jp: string, zh: string, en: string, mood: Mood): OutfitReveal =>
  ({ lookZh, lookEn, line: { jp, zh, en, mood } });

export const OUTFIT_REVEALS: Record<CharacterId, Record<string, OutfitReveal>> = {
  // ================= 明日香 =================
  [CharacterId.ASUKA]: {
    casual: R(
      '露肩的黑色针织衫，红黑格纹的短裙，脖子上一条细细的黑色项圈，坠着一颗小小的红心。你花了一点时间，才把这个人和每天早上在校门口查领带的那个人对上号。',
      'A black off-shoulder knit, a red-and-black tartan skirt, a thin black choker with a small red heart. It takes you a moment to reconcile this person with the one who checks ties at the gate every morning.',
      '……何よ。私服くらい、持ってるわよ。普通でしょ、これくらい。',
      '……干嘛。私服我还是有的好吗。很普通吧，这种程度。',
      '...What. I do own clothes, you know. This is perfectly normal.', 'pout'),
    gym: R(
      '红色运动外套的拉链拉到一半，胸前挂着一只银色哨子。她的站姿和查迟到的时候一模一样，只是手里的夹板换成了一瓶水。',
      'A crimson track jacket half-zipped, a silver whistle round her neck. She stands exactly the way she does when she is checking lateness, except the clipboard has become a water bottle.',
      '体操服で悪かったわね。……動くんでしょ？ だったらこれが一番合理的よ。',
      '穿体操服真是抱歉啊。……要动起来的吧？那这身最合理。',
      'Sorry it is the PE kit. ...We are moving, are we not? Then this is the sensible choice.', 'neutral'),
    swim: R(
      '红色的荷叶边比基尼，一条薄薄的红黑花纱笼系在腰侧。她一只手按着那个结，按得很用力，像是它随时会自己解开，而她要第一个知道。',
      'A red frilled bikini, a sheer red-and-black sarong knotted at the hip. She is holding the knot down hard, as if it might come undone by itself and she intends to be the first to know.',
      'じっ……じろじろ見ないでよ！ 海なんだから水着なのは当たり前でしょ！',
      '别、别一直盯着看啦！来海边穿泳装不是天经地义的吗！',
      'D-do not stare! It is the beach. Of course I am wearing a swimsuit!', 'shy'),
    maid: R(
      '黑色长袖女仆装，雪白的荷叶边围裙，胸前那块围兜是心形的，头上一片白色蕾丝发饰。领口一个小小的红色蝴蝶结——这是她自己加的，你很确定。',
      'A long-sleeved black maid dress, a crisp white frilled apron with a heart-shaped bib, a lace headpiece. A small red bow at the collar. She added that herself. You are certain.',
      'お、おかえりなさいませ……ご主人、さま。……今の、録音してたら殺すわよ。',
      '欢、欢迎回来……主、主人。……刚才那句你要是录音了，我杀了你。',
      'W-welcome home... master. ...If you recorded that, you are dead.', 'shy'),
    autumn: R(
      '驼色的牛角扣大衣敞着，里面是一件酒红色的高领毛衣，一条红格子围巾绕了两圈，还剩下很长的一截垂在前面。',
      'A camel duffle coat hanging open over a burgundy turtleneck, a red tartan scarf wound twice with a long tail still hanging down the front.',
      '寒くなったわね。……マフラー、長すぎるって思ったでしょ。いいの、これは長いのがいいのよ。',
      '变冷了呢。……你是不是觉得围巾太长了。没关系，这条就是长的才好。',
      'It has got cold. ...You think the scarf is too long. It is supposed to be long. That is the point of it.', 'neutral'),
    yukata: R(
      '藏青的底子上开着红色的山茶花，零星点缀着白色的小烟火，红腰带在背后系成一个一丝不苟的蝴蝶结。她手里那把红团扇扇得有点快。',
      'Red camellias and small white fireworks on navy cotton, a red obi tied at the back in an immaculate bow. She is fanning herself with a red uchiwa slightly too fast.',
      '……着付け、自分でやったのよ。崩れてないか、ちょっと後ろ見てくれる？',
      '……是我自己穿的。你帮我看看后面，有没有歪？',
      '...I dressed myself. Could you check the back? Make sure it has not slipped.', 'shy'),
    winter: R(
      '藏青的大衣扣到最上面一颗，红格子围巾，一对白色的毛绒耳罩，两只红色的连指手套抱在胸前。看上去暖和得过分，表情却还是零下的。',
      'A navy duffle coat buttoned to the top, a red tartan scarf, fluffy white earmuffs, red mittens folded across her chest. She looks absurdly warm. Her expression is still below zero.',
      '遅いわよ。……三分。三分も待ったんだから。',
      '你迟到了。……三分钟。我足足等了三分钟。',
      'You are late. ...Three minutes. I waited three whole minutes.', 'pout'),
    sleep: R(
      '粉色的长袖睡衣上印着小小的黄色星星，领口一个红色的蝴蝶结，脚上一双白色的兔子拖鞋。双马尾松松地散了一点，怀里死死抱着一个枕头。',
      'Pink pyjamas with small yellow stars, a red ribbon at the collar, white bunny slippers. Her twin tails have come a little loose. She is clutching a pillow as if it were evidence.',
      'な、な、何見てんのよ！ これは、その、見回りよ！ 見回りに来ただけ！',
      '你、你、你看什么看！这是，那个，巡查！我只是来巡查的！',
      'Wh-wh-what are you looking at! This is, um, a patrol! I am only here on patrol!', 'surprised'),
    dress: R(
      '黑与深红的哥特礼裙，蕾丝束腰，一层一层的裙摆底下透出红色的衬裙，手上一双黑色的蕾丝手套。她提起裙边，行了一个非常标准的屈膝礼，标准到有点像是在挑衅。',
      'A black-and-crimson gothic dress, a laced corset bodice, tiers of ruffles over a red underskirt, black lace gloves. She lifts her skirt and curtsies so correctly it is almost a challenge.',
      'どう？ ……あんたのために着てきたんじゃないわよ。たまたま、着たい気分だっただけ。',
      '怎么样？……才不是为了你穿的。只是碰巧，今天想穿而已。',
      'Well? ...I did not wear it for you. I just happened to feel like wearing it.', 'tease'),
    kimono: R(
      '红色的振袖上飞着金色的鹤和白梅，金线织锦的腰带系成一个复杂的结，发间一支金簪垂着红色的流苏。她站在那儿，像一张年画忽然决定自己出来走走。',
      'A crimson furisode with golden cranes and white plum, a gold brocade obi in an elaborate knot, a gold hairpin trailing red tassels. She looks like a New Year print that has decided to go for a walk.',
      'あけまして……おめでとう。……言いなさいよ、あんたも。新年なんだから。',
      '新年……快乐。……你也说啊。都过年了。',
      'Happy... New Year. ...Say it back. It is the New Year.', 'happy'),
    sport: R(
      '白底红领的网球服，红色的百褶短裙，两只手腕上各一条红色护腕，头上一顶白色遮阳帽，球拍扛在肩上。',
      'A white polo with a red collar, a short red pleated tennis skirt, a red sweatband on each wrist, a white visor, a racket resting on her shoulder.',
      'テニス部の助っ人よ、ただの。……打てるの？ あんた。手加減はしないわよ。',
      '只是网球部的外援而已。……你会打吗？我可不会手下留情。',
      'I am just helping out the tennis club. ...Can you even play? I will not go easy on you.', 'tease'),
    summer: R(
      '红底白色扶桑花的无袖连衣裙，腰上一条细细的白皮带，一顶宽檐草帽，帽檐上绕着红色的缎带。风一来，她就把帽檐按紧一点。',
      'A sleeveless red sundress printed with white hibiscus, a thin white belt, a wide straw hat banded in red. Each time the wind comes she holds the brim down a little harder.',
      '暑いから、これにしただけ。……なによ、似合わないって言いたいわけ？',
      '只是因为热才穿这个的。……干嘛，你想说不适合我？',
      'It is hot, that is all. ...What? Are you going to tell me it does not suit me?', 'pout'),
    fantasy: R(
      '深红色的军装大衣，金色的肩章和饰绪，领口一条白色领巾别着一枚红宝石胸针，白手套，过膝的黑色马靴，腰间一柄细剑。她把手搭在剑柄上的样子熟练得让人有点担心。',
      'A crimson military coat with gold epaulettes and braid, a white cravat with a ruby pin, white gloves, black riding boots, a rapier at her hip. The way her hand rests on the hilt is a little too practised.',
      '我が名はアスカ、騎士団長である！……って、笑ったら斬るわよ。本気で。',
      '吾乃明日香，骑士团长是也！……你敢笑我就砍了你。我是认真的。',
      'I am Asuka, Knight Commander! ...Laugh and I will run you through. I mean it.', 'tease')
  },

  // ================= 光 =================
  [CharacterId.HIKARI]: {
    casual: R(
      '一件芥末黄的大号卫衣，胸口绣着一朵小小的向日葵，牛仔短裤，棒球帽反戴，手腕上一条彩虹色的编织手绳。她人还没走到，笑先到了。',
      'An oversized mustard hoodie with a little sunflower on the chest, cut-off denim shorts, a cap on backwards, a rainbow friendship bracelet. Her grin arrives several steps before she does.',
      'おーい{name}！ 待った？ うち、今日めっちゃ気合い入れてきてん！',
      '喂——{name}！等很久了吗？我今天可是超级用心打扮了哦！',
      'Oi, {name}! Been waiting? I made a proper effort today!', 'happy'),
    gym: R(
      '白色无袖运动背心，橙色的跑步短裤，脖子上搭一条毛巾，手里一瓶水已经喝掉一半——她是跑着来的。',
      'A white sleeveless gym top, orange running shorts, a towel round her neck, a water bottle already half gone. She ran here.',
      'ほな体動かそか！ ……あ、うちもう走ってきてん。家からここまで。',
      '那就活动活动身体吧！……啊，我已经跑过来了。从家里一路跑到这儿。',
      'Right, let us get moving! ...Oh, I have already run. All the way here from home.', 'happy'),
    swim: R(
      '黄底白波点的挂脖比基尼，荷叶边，腰上系着一件橙色短衬衫，头发上除了平常的雏菊发夹，还多了一朵向日葵。胳膊底下夹着一只条纹沙滩球。',
      'A yellow polka-dot halter bikini with ruffles, an orange shirt knotted at her waist, a sunflower clip beside the usual daisies. A striped beach ball under one arm.',
      'じゃーん！ 見て見て、新しいやつ！ ……なんか言うてや、黙られたら照れるやん！',
      '锵锵——！快看快看，新买的！……你倒是说句话啊，不说话我会害羞的啦！',
      'Ta-da! Look, look, it is new! ...Say something! If you go quiet I will get embarrassed!', 'shy'),
    yukata: R(
      '奶黄色的浴衣上游着橙色的金鱼和蓝色的水纹，橙色的兵儿带系成一个蓬松的大蝴蝶结，手里已经攥着一串苹果糖了。',
      'A cream yukata with orange goldfish and blue ripples, a bright orange heko obi in a big fluffy bow. She is already holding a candied apple.',
      'りんご飴、もう買うてもた。待ちきれへんかってん。一口いる？',
      '苹果糖我已经买好了。实在等不及嘛。要咬一口吗？',
      'I have already bought a candied apple. I could not wait. Want a bite?', 'happy'),
    autumn: R(
      '橙色的短款羽绒服，里面是奶白色的毛衣，长长的橙棕条纹围巾，毛线帽上的绒球随着她挥手一晃一晃。另一只手里一袋烤红薯还冒着热气。',
      'A short orange puffer over a cream sweater, a long striped scarf, a beanie whose pom-pom bounces as she waves. In her other hand, a paper bag of roasted sweet potato, still steaming.',
      '焼き芋！ 半分こしよ！ ……あ、大きいほうはうちな。',
      '烤红薯！一人一半！……啊，大的那半归我。',
      'Sweet potato! Half each! ...The bigger half is mine, mind.', 'tease'),
    maid: R(
      '黑色的泡泡袖短款女仆装，领口一个黄色的蝴蝶结，白围裙上绣着一朵小雏菊，头上的白色发饰也系着黄色缎带。',
      'A short black puff-sleeved maid dress with a yellow ribbon at the collar, a white apron embroidered with a daisy, a frilled headpiece with a little yellow bow.',
      'おかえりなさいませ、ご主人様っ！ ……あかん、笑ってまう。もう一回やらせて！',
      '欢迎回来，主人大人～！……不行，我要笑场了。再让我来一遍！',
      'Welcome home, Master! ...No, I am going to laugh. Let me do it again!', 'happy'),
    winter: R(
      '亮橙色的羽绒服，帽子边缘一圈毛，奶白的毛线帽顶着一个大得像第二颗脑袋的绒球，白色的连指手套。她远远地把一只手举得很高。',
      'A bright orange down jacket with a fur-trimmed hood, a cream beanie with a pom-pom the size of a second head, white mittens. She has one hand up high from a long way off.',
      'さっむ！ でもええねん、雪降りそうな日って、なんかワクワクせえへん？',
      '好冷！不过没关系，快下雪的日子，不觉得有点让人兴奋吗？',
      'It is freezing! But I do not mind. Days when it might snow, do they not make you excited?', 'happy'),
    sleep: R(
      '淡黄色的摇粒绒小熊睡衣，帽子上两只圆耳朵，胸口绣着一张熊脸，手里拎着一只小熊玩偶的胳膊。',
      'Pale yellow fleece bear pyjamas, two round ears on the hood, a bear face on the chest. She is holding a teddy by one arm.',
      'えへへ……バレた？ 寝られへんくて、ちょっとだけ抜けてきてん。',
      '嘿嘿……被发现了？睡不着，就偷偷溜出来一下。',
      'Hehe... caught me? I could not sleep, so I slipped out for a bit.', 'shy'),
    sport: R(
      '黄白相间的无袖啦啦队服，胸前一个橙色的 K，黄色百褶短裙，侧马尾上一个大大的黄色蝴蝶结。一只金色彩球高高举过头顶。',
      'A yellow-and-white cheer top with an orange K, a pleated yellow skirt, a big yellow bow on her side ponytail. One golden pom-pom held high over her head.',
      'フレー！ フレー！ {name}！ ……どう？ 今日の応援、あんた専用やで！',
      '加油！加油！{name}！……怎么样？今天的应援，是你专属的哦！',
      'Go! Go! {name}! ...Well? Today the cheering is all for you!', 'happy'),
    dress: R(
      '奶黄色的雪纺连衣裙，心形领口，腰间一朵向日葵胸花，裙摆是一层一层绣着小花的薄纱，脚上一双浅金色的芭蕾平底鞋。她提起裙边转了半圈，转到一半自己先笑场了。',
      'A pale yellow chiffon dress with a sweetheart neckline, a sunflower corsage at the waist, layers of embroidered tulle, pale gold ballet flats. She lifts the skirt and turns, and laughs halfway round.',
      'こういうの、着たことないねん。……変ちゃう？ ほんまに？',
      '这种衣服，我从来没穿过。……不奇怪吧？真的？',
      'I have never worn anything like this. ...It is not weird? Really?', 'shy'),
    kimono: R(
      '鲜橙色的振袖上落着金色的枫叶和白菊，肩上一条白色的毛绒披肩，金红两色的腰带系成一个大蝴蝶结。她展开一把金扇，扇得很用力。',
      'A vivid orange furisode scattered with gold maple and white chrysanthemum, a white fur stole, a gold-and-red obi in a large bow. She snaps open a golden fan and uses it vigorously.',
      'あけおめ！ ことよろ！ ……あ、これちゃんと言わなあかんやつ？ あけましておめでとうございます！',
      '新年快乐！今年也请多指教！……啊，这个是不是得好好说？新年快乐！',
      'Happy New Year! ...Oh, should I say it properly? A very happy New Year to you!', 'happy')
  },

  // ================= 铃 =================
  [CharacterId.REI]: {
    casual: R(
      '黑色的修身高领毛衣，米色的长褶裙，脖子上一条细细的银链，坠着一弯小小的月亮。她手里拿着一本打开的书，看到你才合上，一根手指还夹在读到的那一页。',
      'A slim black turtleneck, a long beige pleated skirt, a thin silver chain with a little crescent moon. She is holding an open book and closes it when she sees you, one finger still marking the page.',
      '時間通りです。……私服の感想を求められる状況だと推測しますが、違いますか。',
      '很准时。……我推测现在是需要你对我的私服发表感想的场合，没错吧。',
      'You are on time. ...I infer this is a situation in which my clothes are to be commented on. Am I wrong?', 'neutral'),
    lab: R(
      '雪白的白大褂敞着，里面是校服和红色的领结，胸前口袋里插着一支自动铅笔和一支钢笔，脖子上挂着一张小小的证件卡。夹板被她抱在胸口，像一面盾牌。',
      'A crisp white lab coat open over her uniform, a mechanical pencil and a pen clipped in the breast pocket, an ID badge on a lanyard. She holds the clipboard against her chest like a shield.',
      '白衣は防護のためです。……似合うかどうかは、評価項目に含まれていません。',
      '白大褂是用来防护的。……合不合适，不在评价项目里。',
      'The coat is for protection. ...Whether it suits me is not one of the criteria.', 'neutral'),
    gym: R(
      '藏青色的运动外套，拉链一直拉到下巴，袖子上两道白线，头发在脑后扎了一个很小、很认真的低马尾。',
      'A navy track jacket zipped right up to the chin, two white stripes on each sleeve, her hair in a very small, very serious low ponytail.',
      '運動に適した服装です。……私が運動するとは、言っていません。',
      '这是适合运动的服装。……我可没说我要运动。',
      'This is clothing suitable for exercise. ...I did not say I would be exercising.', 'neutral'),
    swim: R(
      '藏青色的学校指定泳衣，胸口一块写着名字的白色布片，外面套着一件浅蓝色的防晒外套，被她两手拢得紧紧的。手里还拎着一顶白色泳帽。',
      'A navy school swimsuit with a white name patch, a pale blue rash guard she is holding firmly shut with both hands, a white swim cap dangling from her fingers.',
      '学校指定のものしか持っていません。……合理的です。合理的なので、見ないでください。',
      '我只有学校指定的这件。……很合理。因为很合理，所以请不要看。',
      'I own only the school-issue one. ...It is rational. Because it is rational, please do not look.', 'shy'),
    kimono: R(
      '箭羽纹的靛蓝和服配藏青色的袴，脑后一个大大的红色蝴蝶结，脚上一双系带的棕色皮靴，怀里抱着一摞用紫色包袱布包起来的书。像是从一张一百年前的照片里走出来的。',
      'An indigo kimono patterned with arrow feathers, a navy hakama, a large red ribbon at the back of her head, laced brown boots, and a stack of books wrapped in purple cloth. She looks like someone who has stepped out of a photograph a century old.',
      '大正時代の女学生の服装です。……資料で読んだ通りに着てみました。感想を、どうぞ。',
      '这是大正时代女学生的服装。……我照着资料上写的穿的。请发表感想。',
      'This is how girl students dressed in the Taishō era. ...I dressed according to the sources. Your comments, please.', 'happy'),
    maid: R(
      '一件长及脚踝的黑色维多利亚式女仆裙，长长的白围裙，雪白的圆领上系着一个小小的藏青蝴蝶结。她把一本皮面书抱在胸前，站得笔直。',
      'An ankle-length black Victorian maid dress, a long plain apron, a white Peter Pan collar with a small navy ribbon. She holds a leather-bound book to her chest and stands perfectly straight.',
      'お帰りなさいませ。……この台詞の統計的な効果について、後で議論させてください。',
      '欢迎回来。……关于这句台词在统计上的效果，之后请让我跟你讨论一下。',
      'Welcome home. ...I would like to discuss the statistical effect of that phrase with you later.', 'neutral'),
    winter: R(
      '藏青色的牛角扣大衣，一条奶油色的麻花围巾，白色的毛绒耳罩，两只手捧着一杯热茶，杯口的白气一直往她眼镜上飘。',
      'A navy duffle coat, a thick cream cable scarf, white earmuffs. She holds a paper cup of hot tea in both hands and the steam keeps drifting onto her glasses.',
      '気温四度。耳当ては合理的な判断です。……温かいです。',
      '气温四度。戴耳罩是合理的判断。……很暖和。',
      'Four degrees. Earmuffs were the rational choice. ...They are warm.', 'happy'),
    sleep: R(
      '一件长长的薰衣草色棉布睡裙，小圆领，领口系着细细的缎带，眼镜没摘，脚上一双蓝白条纹的短袜。怀里抱着一本小书。',
      'A long lavender cotton nightgown with a little round collar and a thin ribbon at the neck, glasses still on, blue-and-white striped socks. A small book held to her chest.',
      '消灯時刻は過ぎています。……私もあなたも、規則違反ですね。',
      '已经过了熄灯时间。……我和你，都违反规定了呢。',
      'It is past lights-out. ...So we are both breaking the rules.', 'shy'),
    dress: R(
      '午夜蓝的露肩长礼服，裙面上用细细的亮线织着星光，脖子上一条银链坠着一颗小小的蓝宝石，短发规规矩矩地别着一枚银色星形发夹。',
      'A midnight-navy off-shoulder gown with a starry glitter-thread pattern, a single small sapphire on a silver chain, her bob neatly pinned with a silver star.',
      '星図を参考に選びました。……あなたが何か言うまで、ここから動きません。',
      '我是参考星图选的。……在你说点什么之前，我不会从这里挪开。',
      'I chose it with reference to a star chart. ...I am not moving from this spot until you say something.', 'shy'),
    yukata: R(
      '靛蓝的浴衣上开着大朵的白色牵牛花，浅黄色的腰带上挂着一只小小的蓝色玻璃风铃，她每走一步，它就响一声。',
      'An indigo yukata with large white morning glories, a pale yellow obi with a small blue glass wind chime that rings once every step she takes.',
      '朝顔は朝に咲いて昼には萎みます。……夜に着るのは、矛盾しているかもしれません。',
      '牵牛花早上开，中午就谢了。……晚上穿它，或许有点矛盾。',
      'Morning glories open in the morning and wilt by noon. ...Wearing them at night may be a contradiction.', 'angry'),
    autumn: R(
      '人字纹的粗花呢西装外套，白衬衫上系一条细细的黑丝带，墨绿的褶裙，棕色的贝雷帽，脖子上挂着一台老式胶片相机。她举起相机对着你，没有按快门。',
      'A herringbone tweed blazer, a white blouse with a thin black ribbon, a dark green pleated skirt, a brown beret, a vintage film camera on a strap. She raises it at you and does not press the shutter.',
      'フィルムはあと三枚です。……慎重に選びたいので、まだ撮りません。',
      '胶卷还剩三张。……我想慎重地选，所以先不拍。',
      'Three frames left. ...I want to choose carefully, so I will not take it yet.', 'happy')
  },

  // ================= 稻荷 =================
  [CharacterId.INARI]: {
    casual: R(
      '奶油色的宽松针织衫，驼色格纹的高腰长裙，脖子上一枚小小的金色狐狸吊坠，手腕上一只金铃。耳朵和尾巴都不见了——藏得很好，只是她走路的时候，裙摆偶尔会被什么看不见的东西拂一下。',
      'An oversized cream knit, a camel tartan midi skirt, a small gold fox pendant, a gold bell at her wrist. The ears and tails are gone, well hidden, though now and then as she walks something invisible brushes her hem.',
      '人の子の装いじゃ。……どうじゃ、化けるのは得意でな。尾も耳も、ちゃんと仕舞うておる。',
      '人类孩子的打扮。……如何，妾身最擅长幻化了。尾巴和耳朵，都好好收起来了。',
      'Human clothes. ...Well? Disguise is a talent of mine. Ears, tails, all tucked away.', 'tease'),
    school: R(
      '港见高中的校服。她穿得一丝不苟，标准到全校没有第二个人这样穿——领结的角度像是拿量角器量过，裙子的长度正好是校规写的那个数。',
      'The Minatomi High uniform, worn so correctly that nobody else in the school wears it like this: the bow at an angle you could measure, the skirt exactly the length in the rules.',
      'ふふ。今日の妾は、この学び舎の生徒じゃ。……名簿？ そんなもの、少し書き足せば済む話よ。',
      '呵呵。今天的妾身，是这所学堂的学生。……名册？那种东西，稍微添一笔就行了。',
      'Hehe. Today I am a pupil of this school. ...The register? A line added here or there.', 'tease'),
    swim: R(
      '北斋浪花图案的藏青比基尼，外面披着一件薄得透光的、和服式样的罩衫，从肩上滑下来一半。脚踝上一只金色的小铃，一走就响。',
      'A navy-and-white bikini printed with Hokusai\'s great wave, a sheer kimono-style cover-up sliding off her shoulders, a tiny gold bell on her ankle that rings as she walks.',
      '海か。……千年前、ここの浜はもっと広かった。妾が泳いだのも、その頃以来じゃな。',
      '海啊。……千年前，这片海滩还要宽得多。妾身上一次下水，也是那时候的事了。',
      'The sea. ...A thousand years ago this beach was much wider. That was the last time I swam.', 'neutral'),
    home: R(
      '宽松的奶油色毛衣上绣着一只小狐狸，米色的棉短裤，长发松松地编成一条辫子搭在肩上，脚上一双狐狸脸的橙色拖鞋。',
      'A loose cream sweater with a small embroidered fox, beige cotton shorts, her long hair in a loose braid over one shoulder, fluffy orange fox-face slippers.',
      'なんじゃ、その顔は。神とて、家ではくつろぐのじゃ。',
      '干嘛，那副表情。就算是神，在家也是要放松的。',
      'What is that face for? Even a god relaxes at home.', 'shy'),
    knit: R(
      '黑色的超大粗针织毛衣，短短的米色褶裙，腰侧一条细链挂着一枚金色的狐尾坠子，脚上一双灰色麂皮的毛边短靴。',
      'A black oversized chunky knit, a short beige pleated skirt, a gold fox-tail charm on a thin chain at her hip, grey suede ankle boots trimmed with fur.',
      '今年の流行り、というやつらしい。……毎年変わるのう、人の世の流行りは。',
      '据说这是今年的流行。……人世间的流行，每年都在变啊。',
      'This year\'s fashion, apparently. ...It changes every year, the fashion of your world.', 'neutral'),
    gown: R(
      '深藏青的天鹅绒露肩舞会礼服，金线绣着云和浪，发间一支繁复的金簪垂着长长的流苏，耳边一对金色的坠子。她站在那儿，整个房间的光好像都往她那边偏了一点。',
      'A deep navy velvet off-shoulder ball gown embroidered in gold cloud and wave, an elaborate gold kanzashi with long tassels, gold drop earrings. The light in the room seems to lean slightly towards her.',
      '人の世の宴の装いじゃ。……汝のために合わせたのではないぞ。たまたま、気が向いただけじゃ。',
      '这是人世间宴会的装束。……可不是为了配合你。只是碰巧，心血来潮罢了。',
      'The dress of a human banquet. ...I did not wear it for you. It merely took my fancy.', 'tease'),
    summer: R(
      '白色的无袖长裙，裙面印着浅蓝的浪和云，一条编织的细皮带，一只草编包，长发编成一条侧辫。',
      'A white sleeveless sundress printed with pale blue waves and clouds, a thin braided belt, a straw bag, her hair in a long side braid.',
      '夏じゃのう。……この姿なら、汝と並んで歩いても、誰も拝みはせぬじゃろう。',
      '是夏天啊。……这副样子的话，就算和你并肩走，也不会有人对着妾身参拜了吧。',
      'Summer. ...Like this, I can walk beside you and nobody will stop to pray at me.', 'happy'),
    miko: R(
      '白衣绯袴，宽大的袖口用一根细细的红绳束起来，头上一条红白相间的水引发带。',
      'A white kosode with wide sleeves, a scarlet hakama, a thin red cord tying back her sleeves, a red-and-white mizuhiki ribbon in her hair.',
      '巫女の格好じゃ。……神が巫女の真似をしておる。おかしいか？ 妾もそう思う。',
      '巫女的打扮。……神在模仿巫女。很好笑吗？妾身也这么觉得。',
      'Shrine maiden\'s robes. ...A god dressed as her own attendant. Funny? I think so too.', 'happy'),
    goddess: R(
      '金白相间的祭服，层层叠叠的红色衬领，长长的白纱袖，头顶一轮金色的日轮冠，金色的绸带在没有风的地方也在飘。你下意识地想后退一步。',
      'Flowing white-and-gold ceremonial robes over layered red collars, long sheer sleeves, a golden sun-disc crown, gold streamers drifting where there is no wind. Some part of you wants to take a step back.',
      '……驚いたか。これが、本来の祭りの装いじゃ。そう畏まるな、人の子。今日の妾は、ただ汝と歩きたいだけじゃ。',
      '……吓到了？这才是祭典本来的装束。别那么拘谨，人类的孩子。今天的妾身，只是想跟你走走罢了。',
      '...Startled? This is what a festival is really dressed in. Do not be so stiff, child of man. Today I only want to walk with you.', 'neutral')
  },

  // ================= 深雪 =================
  [CharacterId.MIYUKI]: {
    summer: R(
      '奶油色的泡泡袖中长裙，上面开着小小的粉色玫瑰，裙摆是一圈扇贝边，手腕上一串珍珠，手里一只草编手包。',
      'A cream puff-sleeved midi dress scattered with small pink roses, a scalloped hem, a pearl bracelet, a woven straw clutch.',
      '暑いわね。……お洋服、変じゃない？ 久しぶりに、ちょっと頑張っちゃった。',
      '好热呢。……这身衣服，不奇怪吧？好久没这样，稍微用心打扮了一下。',
      'It is hot, is it not. ...Is the dress all right? It has been a while since I made an effort.', 'shy'),
    school: R(
      '水手服。藏青的领子，藏青的领巾，裙子过膝，白色的及膝袜。她站在那儿，两只手不知道该放哪儿，最后决定交握在身前。',
      'A sailor uniform. Navy collar, navy scarf, a skirt past the knee, white knee socks. She stands there not knowing what to do with her hands, and finally folds them in front of her.',
      '……笑わないでね。昔の、なの。……取っておいたのよ。なんでかしら。',
      '……不许笑哦。是以前的，那件。……一直留着呢。为什么呢。',
      '...Do not laugh. It is my old one. ...I kept it. I wonder why.', 'shy'),
    cardigan: R(
      '一件软软的开衫，袖子长到手背，里面是带荷叶边领子的衬衫。是她最常穿的那一身，可今天扣子扣得比平时整齐。',
      'A soft cardigan with sleeves down over the backs of her hands, a frilled-collar blouse underneath. Her usual clothes, except today every button is done up.',
      'ふふ、いつもの格好よ。……あなたの前だと、これが一番落ち着くの。',
      '呵呵，就是平常的打扮哦。……在你面前，这样最自在。',
      'Hehe, just my usual. ...In front of you, this is what feels most at ease.', 'happy'),
    sundress: R(
      '一条长长的象牙白棉布裙，细肩带，裙摆一圈蕾丝，腰上系一条浅绿色的缎带，手腕上一串海玻璃手链。遮阳帽拿在手里，没戴。',
      'A long ivory cotton sundress with thin straps and lace at the hem, a pale green ribbon at the waist, a sea-glass bracelet. A sunhat in her hand rather than on her head.',
      '海、来ちゃった。……水着？ ふふ、それはまだ、お姉さんには早いわ。',
      '来海边了。……泳装？呵呵，那个嘛，对姐姐来说还太早了。',
      'I came to the sea. ...A swimsuit? Hehe, that is a little early for me yet.', 'happy'),
    gown: R(
      '深藏青的长袖裹身裙，一侧开衩，腰间一条细细的银带，一串珍珠项链，一对小小的珍珠耳钉，同色的尖头高跟鞋。她平时那种柔软一下子收紧了，变成了别的什么。',
      'A deep navy long-sleeved wrap dress with a high slit, a thin silver belt, a single strand of pearls, small pearl earrings, navy pointed heels. Her usual softness has drawn in and become something else.',
      '大人の格好、久しぶり。……ちゃんとエスコートしてね？ 今夜は、あなたが。',
      '好久没穿得这么大人了。……要好好护送我哦？今晚，换你来。',
      'It has been a while since I dressed like a grown-up. ...You will escort me properly? Tonight, it is your turn.', 'shy'),
    apron: R(
      '薰衣草色的毛衣，袖子挽到手肘，外面系着一条粉色的荷叶边围裙，口袋上一颗小小的心，头发松松地扎在脑后。',
      'A lavender sweater with the sleeves pushed up, a pale pink frilled apron with a little heart pocket, her hair tied loosely back.',
      'いらっしゃい。……手、洗ってきて。今日は一緒に作るんでしょ？',
      '欢迎。……先去洗手。今天是要一起做饭的吧？',
      'Come in. ...Go and wash your hands. We are cooking together today, are we not?', 'happy'),
    kimono: R(
      '淡薰衣草色的访问着，从下摆往上渐渐褪成奶白，上面开着白梅，奶油色的腰带上织着金线，银白的发间一支粉色的梅花簪。',
      'A pale lavender hōmongi shading to cream, scattered with white plum blossom, a cream obi woven with gold thread, a pink plum-blossom pin in her silver hair.',
      'あけましておめでとう。……着物なんて、何年ぶりかしら。帯、苦しくて。ふふ。',
      '新年快乐。……穿和服是多少年前的事了呢。腰带勒得好紧。呵呵。',
      'Happy New Year. ...How many years since I last wore a kimono. The obi is so tight. Hehe.', 'happy')
  },

  // ================= 空 =================
  [CharacterId.SORA]: {
    school: R(
      '校服。领带歪着，袖子挽到手肘，书包带子被她单肩挎着，另一边肩膀上搭着一件运动外套。',
      'The school uniform, tie crooked, sleeves rolled to the elbow, her bag over one shoulder and a track jacket over the other.',
      'なんや、制服で悪いか。部活終わりや、着替える暇なんかあらへん。',
      '干嘛，穿校服不行啊。刚练完球，哪有空换衣服。',
      'What, something wrong with the uniform? Practice just finished. No time to change.', 'neutral'),
    summer: R(
      '白色的修身短T上印着一个小小的橙色篮球，高腰的橄榄绿工装短裤，腰带扣上挂着一个篮球钥匙扣，手腕上一块黑色运动表。',
      'A fitted white crop tee with a small orange basketball print, high-waisted olive cargo shorts, a basketball keychain on her belt loop, a black sports watch.',
      'よっ。……暑いからこれや。スカート？ 走られへんやん、あんなん。',
      '哟。……天热就穿这个。裙子？那玩意儿怎么跑啊。',
      'Yo. ...It is hot, so this. A skirt? You cannot run in those.', 'tease'),
    autumn: R(
      '一件有点短的藏青麻花毛衣，橄榄色的工装短裙，单肩挎着一只贴满运动徽章的灰色双肩包，刘海上别着一枚橙色发夹。她低头看了一眼自己的裙子，又看了你一眼。',
      'A slightly cropped navy cable-knit, an olive cargo mini skirt, a grey backpack covered in sports pins slung on one shoulder, an orange clip in her fringe. She looks down at her own skirt, then at you.',
      '……スカートや。うちかて、持っとるわ。……なんか言えや。',
      '……是裙子。我也是有裙子的好吗。……你倒是说点什么啊。',
      '...It is a skirt. I do own one. ...Say something.', 'shy'),
    swim: R(
      '藏青配橙色的运动款两件式泳衣，外面套一件白色的无袖连帽衫，墨镜推在头顶，手腕上一块橙色的防水表。',
      'A navy-and-orange sporty two-piece, an open white sleeveless hoodie, sunglasses pushed up on her head, an orange waterproof watch.',
      '泳ぐで！ 沖のブイまで競争や。負けたらかき氷おごりな！',
      '游泳去！比谁先游到外面那个浮标。输了的请刨冰！',
      'Let us swim! Race you to the buoy. Loser buys shaved ice!', 'happy'),
    maid: R(
      '黑色的泡泡袖女仆装，短短的荷叶边裙摆，白围裙，头上一片白色蕾丝发饰，领口一个小小的橙色蝴蝶结。她的表情像是被人从背后推上了罚球线。',
      'A black puff-sleeved maid dress, a short frilled skirt, a white apron, a lace headpiece, a small orange bow at the collar. Her expression is that of someone pushed up to the free-throw line from behind.',
      '……ジャンケンで負けてん。三回勝負で、三回とも。……見んなや。見たら、殴る。',
      '……猜拳输了。三局两胜，三局全输。……别看。看了我就揍你。',
      '...Lost at rock-paper-scissors. Best of three, lost all three. ...Do not look. Look and I hit you.', 'angry'),
    kimono: R(
      '深藏青的振袖上是金色的鹤和红枫，肩上搭着一件黑色绣金的羽织，腰带红金相间。她的站姿还是篮球场上那种，两只脚分得很开。',
      'A dark navy furisode with golden cranes and red maple, a black haori embroidered in gold over her shoulders, a red-and-gold obi. She is still standing the way she stands on court, feet well apart.',
      '着物、走りにくいわ……。でも、まあ、ええやろ？ 正月やし。',
      '和服好难走路……。不过，嘛，还行吧？过年嘛。',
      'Kimono are hard to walk in... But, well, it is all right, yeah? It is New Year.', 'shy'),
    gown: R(
      '白色缎面的露肩礼服，七分袖，一侧开衩开得很高，手里一只藏青色的小手包，脚踝上一条细细的银链。她站得很直，像在等一声哨。',
      'A sleek white satin off-shoulder gown with three-quarter sleeves and a high slit, a small navy clutch, a thin silver anklet. She stands very straight, as if waiting for a whistle.',
      '……こういうの、何て言うたらええかわからん。とりあえず、転ばんようにエスコートしてや。ヒール、慣れてへんねん。',
      '……这种场合，我不知道该说什么。总之，你扶着点别让我摔了。高跟鞋，我穿不惯。',
      '...I do not know what you are meant to say in these. Just escort me so I do not fall over. I am not used to heels.', 'shy')
  },

  // ================= 奈绪 =================
  [CharacterId.NAO]: {
    knit: R(
      '米色的麻花开衫，一排木扣子，里面一件淡粉色的小花T恤，深色牛仔褶裙，开衫口袋里插着那个你从小就见过的小本子和一支铅笔。',
      'A cream cable cardigan with wooden buttons over a pale pink flowered tee, a dark denim pleated skirt, and in the pocket the little notebook and pencil you have been seeing since you were small.',
      '遅い。……って言いたいけど、あたしも今来たとこ。行こ。',
      '慢死了。……本来想这么说，不过我也是刚到。走吧。',
      'You are late. ...Is what I would say, but I only just got here too. Come on.', 'neutral'),
    cat: R(
      '一件超大的藏青毛衣，胸前一张奶油色的大猫脸，藏青色的百褶短裙。猫脸和她的脸都在看着你，表情差不多。',
      'An oversized navy sweater with a huge cream cat face on the front, a navy pleated skirt. The cat and she are both looking at you, with much the same expression.',
      '……なに。猫、好きなの知ってるでしょ。昔から。',
      '……干嘛。我喜欢猫你又不是不知道。从以前就是。',
      '...What. You know I like cats. I always have.', 'shy'),
    sleep: R(
      '粉色的猫咪图案睡衣，抽绳睡裤，马尾解开了，头发披下来——你差一点没认出她。她光着脚，抱着自己的枕头，站在你家门口。',
      'Pink pyjamas printed with little white cats, drawstring trousers, her ponytail undone and her hair down. You almost do not recognise her. She is barefoot on your doorstep, holding her own pillow.',
      '……隣なんだから、いいでしょ。パジャマで来ても。映画、何見るの。',
      '……反正就住隔壁，穿睡衣过来也没关系吧。电影，看什么。',
      '...I live next door. Pyjamas are fine. So what are we watching.', 'shy'),
    kimono: R(
      '珊瑚橙的振袖上是青松、金鹤和奶白的梅花，藏青描金的腰带，马尾上簪着一串垂下来的花。',
      'A coral furisode with green pines, golden cranes and cream plum blossom, a navy-and-gold obi, a dangling flower kanzashi in her ponytail.',
      'あけましておめでと。……おばさんに着せてもらったの。動けないんだけど、これ。',
      '新年快乐。……是阿姨帮我穿的。不过穿上就动不了了，这个。',
      'Happy New Year. ...Auntie dressed me. I cannot actually move in it.', 'happy'),
    swim: R(
      '珊瑚色的挂脖连体泳衣，后背是镂空的，外面一条印着热带鱼的奶白阔腿裤，肩上挎着一只草编沙滩包。',
      'A coral halter one-piece with a cut-out back, wide cream culottes printed with tropical fish, a straw beach bag on her shoulder.',
      '日焼け止め、塗った？ ……塗ってないでしょ。ほら、貸してあげる。',
      '防晒涂了没？……没涂吧。喏，借你。',
      'Sunscreen? ...You have not, have you. Here, use mine.', 'neutral'),
    maid: R(
      '藏青色的女仆裙，白色圆领上一个红蝴蝶结，雪白的荷叶边围裙，头上的白色发饰上竖着两只小小的黑猫耳。',
      'A navy maid dress with a white collar and a red bow, a frilled white apron, a white headpiece with two small black cat ears.',
      'おかえりなさいませ、ご主人様……にゃ。……今の『にゃ』は委員長の指示。あたしの意思じゃない。',
      '欢迎回来，主人……喵。……刚才那个"喵"是班长的指示。不是我自己想说的。',
      'Welcome home, Master... nya. ...The "nya" was the class rep\'s instruction. Not my choice.', 'shy'),
    gown: R(
      '深蓝色的天鹅绒长裙，薄纱长袖，裙摆上绣着细小的、亮晶晶的星星，脖子上一条细细的银链。她不太习惯地拉了拉袖口。',
      'A deep blue velvet dress with sheer long sleeves and tiny sparkling stars embroidered on the full skirt, a thin silver necklace. She tugs at a cuff, not used to it.',
      'こういうの、似合わないって思ってた。……思ってたんだけど。どう？',
      '我一直以为这种衣服不适合我。……一直是这么以为的。怎么样？',
      'I always thought this sort of thing would not suit me. ...I thought so, anyway. Well?', 'shy'),
    yukata: R(
      '红色的浴衣上游着白色的金鱼和水纹，黄色的腰带，马尾上别着一朵花。',
      'A red yukata with white goldfish and ripples, a yellow obi, a flower in her ponytail.',
      '金魚、今年もすくうんでしょ。……あんた、毎年ポイ破るの早すぎ。',
      '金鱼，今年也要捞吧。……你每年纸网都破得太快了。',
      'You are doing the goldfish again this year, right. ...You always tear the paper scoop far too fast.', 'happy')
  },

  // ================= 真希 =================
  [CharacterId.MAKI]: {
    school: R(
      '校服。裙子比校规短一截，衬衫最上面一颗扣子没扣，紫色的猫耳耳机挂在脖子上，发间一枚彩虹色的星星发夹。',
      'The school uniform with the skirt a little shorter than the rules allow, the top button undone, purple cat-ear headphones round her neck, a rainbow star clip in her hair.',
      'なんやせんぱい、制服フェチ？ ……冗談やって。顔赤いで、ざぁこ♡',
      '怎么啦前辈，制服控？……开玩笑的啦。脸红了哦，杂鱼♡',
      'What, senpai, got a thing for uniforms? ...Kidding. You have gone red, loser.', 'tease'),
    cardigan: R(
      '一件大号的亮黄色针织开衫，袖子长到盖住半只手，里面是白衬衫打着藏青领结，藏青百褶短裙，黑色过膝袜。',
      'An oversized bright yellow cardigan with sleeves covering half her hands, a white shirt with a navy bow, a navy pleated skirt, black thigh-high socks.',
      'この袖な、ゲームのときコントローラー持つと、あったかいねん。……かわいいやろ？ 言うてみ？',
      '这个袖子啊，打游戏拿手柄的时候很暖和。……可爱吧？说说看？',
      'These sleeves keep your hands warm on a controller. ...Cute, right? Go on, say it.', 'tease'),
    punk: R(
      '一件黑色的超大连帽外套，上面缝满了复古游戏的布贴——像素幽灵、星星、1UP、一个骷髅——里面一件深灰T恤，破洞牛仔短裤，猫耳耳机亮着紫光。',
      'An oversized black zip hoodie covered in retro game patches, pixel ghosts, stars, a 1UP, a skull, over a dark grey tee and ripped denim shorts. Her cat-ear headphones glow purple.',
      'おっそ！ ウチ、一コイン分待ったで。……今日はウチの縄張り、案内したるわ。',
      '慢死了！我等了一个币的时间。……今天就带你逛逛我的地盘吧。',
      'So slow! I waited a whole credit. ...Today I will show you my turf.', 'tease'),
    kimono: R(
      '深靛蓝的振袖上开满了粉红色的樱花，红金的腰带上挂着一个小小的木芥子，猫耳耳机挂在脖子上——跟这一身完全不搭，又好像只能这样。',
      'A deep indigo furisode thick with pink cherry blossom, a red-and-gold obi with a little kokeshi charm, and the cat-ear headphones round her neck, which do not go with it at all and somehow could not be otherwise.',
      'あけおめ、せんぱい♡ ……お年玉くれるん？ くれへんの？ ケチ〜。',
      '新年快乐，前辈♡……给压岁钱吗？不给吗？小气～',
      'Happy New Year, senpai! ...Any New Year money? No? Cheapskate.', 'tease'),
    gown: R(
      '白色的抹胸束腰舞会礼服，长长的裙摆一直拖到地上，胸前一枚彩虹色的星星胸针，粉色的头发盘成一个优雅的发髻，垂下一条细辫。她看见你，第一次没有马上开口。',
      'A white strapless corset ball gown with a long flowing skirt, a small rainbow star brooch, her pink hair in an elegant bun with one braid. When she sees you, for the first time, she does not speak at once.',
      '……なに黙っとんねん。なんか言えや。……言うてや。',
      '……你沉默个什么劲啊。说点什么啊。……说嘛。',
      '...Why have you gone quiet. Say something. ...Please.', 'shy'),
    swim: R(
      '白色的比基尼上印着粉色的星星和像素爱心，侧边系带，脚踝上一串串珠手链，粉色的头发扎成两个丸子。',
      'A white bikini printed with pink stars and pixel hearts, side ties, a beaded friendship anklet, her pink hair in two buns.',
      'ほらほら〜、せんぱい目ぇ泳いどるで？ 海やからって泳がせんでええねん、目は♡',
      '你看你看～，前辈的眼睛在游泳哦？就算是在海边，眼睛也不用游啦♡',
      'Look at you, senpai, eyes all over the place. It is the sea, but your eyes do not have to swim.', 'tease')
  }
};

// 三种回应：夸她 / 说不出话 / 开玩笑
export const REVEAL_RESPONSES: Record<CharacterId, { praise: RevealLine; stare: RevealLine; tease: RevealLine }> = {
  [CharacterId.ASUKA]: {
    praise: { jp: 'に、似合ってるとか……当たり前でしょ。私が選んだんだから。……ありがと。', zh: '合、合适什么的……那是当然的吧。是我自己挑的嘛。……谢谢。', en: 'O-of course it suits me... I chose it. ...Thanks.', mood: 'shy' },
    stare: { jp: '……ちょっと。黙って見てるの、一番タチ悪いわよ。', zh: '……喂。一声不吭地盯着看，是最恶劣的。', en: '...Hey. Staring without saying anything is the worst thing you could do.', mood: 'pout' },
    tease: { jp: 'はぁ!? 何よそれ！ ……もういい、帰る。……嘘よ、帰らないわよ。', zh: '哈？！什么意思啊！……算了，我回去了。……骗你的，才不回去。', en: 'Excuse me?! What is that supposed to mean! ...Fine, I am going home. ...Lie. I am not going anywhere.', mood: 'angry' }
  },
  [CharacterId.HIKARI]: {
    praise: { jp: 'ほんま!? やった！ ……あかん、顔あっつい。うち今、変な顔してるやろ。', zh: '真的吗？！太好了！……糟了，脸好烫。我现在表情一定很怪吧。', en: 'Really?! Yes! ...Oh no, my face is burning. I must look so weird right now.', mood: 'shy' },
    stare: { jp: '……え、なになに？ なんか付いてる？ そんな見られたら、うち溶けてまうって。', zh: '……诶，怎么啦怎么啦？脸上沾了什么吗？被你这样看着，我会融化的啦。', en: '...Eh, what, what? Is there something on me? If you look at me like that I will melt.', mood: 'surprised' },
    tease: { jp: 'ひどっ！ ……でも、笑ってくれたからええわ。今日の目標、達成や！', zh: '过分！……不过，你笑了就好。今天的目标，达成！', en: 'Mean! ...But you laughed, so it is fine. Today\'s goal: achieved!', mood: 'happy' }
  },
  [CharacterId.REI]: {
    praise: { jp: '……そうですか。……その評価は、記録しておきます。重要なデータなので。', zh: '……是吗。……这个评价，我会记录下来。因为是很重要的数据。', en: '...I see. ...I will record that assessment. It is important data.', mood: 'shy' },
    stare: { jp: '観察されていますね。……私も、あなたを観察しています。条件は対等です。', zh: '我在被观察呢。……我也在观察你。条件是对等的。', en: 'I am being observed. ...I am observing you as well. The conditions are equal.', mood: 'tease' },
    tease: { jp: '冗談、と分類します。……ですが、少しだけ、傷つきました。少しだけです。', zh: '我把它归类为玩笑。……不过，有一点点，受伤了。只有一点点。', en: 'I will classify that as a joke. ...But it hurt, a little. Only a little.', mood: 'sad' }
  },
  [CharacterId.INARI]: {
    praise: { jp: 'ふふ、千年生きておっても、そう言われるのは悪うない。……もう一度、言うてみよ。', zh: '呵呵，活了一千年，被人这么说也还是不坏。……再说一遍听听。', en: 'Hehe. A thousand years old, and it is still pleasant to hear. ...Say it again.', mood: 'happy' },
    stare: { jp: 'ほう、見惚れたか。……よいよい、存分に見るがよい。減るものでもなし。', zh: '哦，看呆了？……好好好，尽管看吧。又不会少块肉。', en: 'Oh? Entranced? ...Very well, look your fill. It costs me nothing.', mood: 'tease' },
    tease: { jp: '……汝。神をからかうとは、なかなかの度胸じゃ。罰として、今日は妾の荷物持ちじゃな。', zh: '……你啊。敢戏弄神明，胆子不小。作为惩罚，今天你就给妾身拎东西吧。', en: '...You. Teasing a god takes nerve. As punishment, you carry my things today.', mood: 'pout' }
  },
  [CharacterId.MIYUKI]: {
    praise: { jp: 'あら……。ふふ、ありがとう。お姉さん、それだけで今日一日がんばれちゃう。', zh: '哎呀……。呵呵，谢谢你。就凭这一句，姐姐今天一整天都有干劲了。', en: 'Oh... Hehe, thank you. That alone will get me through the whole day.', mood: 'shy' },
    stare: { jp: '……そんなに見られたら、恥ずかしいわ。ね、何か言って？', zh: '……被你这样看着，好害羞啊。呐，说点什么嘛？', en: '...If you look at me like that I will get embarrassed. Say something?', mood: 'shy' },
    tease: { jp: 'もう。……いじわる。大人をからかうと、あとで怖いのよ？', zh: '真是的。……坏心眼。戏弄大人的话，之后可是很可怕的哦？', en: 'Honestly. ...Mean. Tease a grown-up and there will be consequences, you know.', mood: 'tease' }
  },
  [CharacterId.SORA]: {
    praise: { jp: '……っ！ な、なに言うてんねん急に！ ……ま、まあ、悪い気はせんけど。', zh: '……！你、你突然说什么呢！……嘛、嘛，感觉倒是不坏。', en: '...! Wh-what are you saying all of a sudden! ...W-well, I do not mind hearing it.', mood: 'shy' },
    stare: { jp: '……見すぎや。ファウル取るで。', zh: '……看太久了。判你犯规。', en: '...You are staring. That is a foul.', mood: 'angry' },
    tease: { jp: 'よう言うたな。表出ぇ、一対一や。……冗談や。でも次言うたらほんまにやるで。', zh: '你很敢说嘛。出来，单挑。……开玩笑的。不过下次再说我真的会动手。', en: 'Big talk. Outside, one-on-one. ...Kidding. Say it again and I will mean it.', mood: 'tease' }
  },
  [CharacterId.NAO]: {
    praise: { jp: '……そ。ありがと。……あんたにそう言われるの、なんか、変な感じ。', zh: '……是吗。谢谢。……被你这么说，总觉得，怪怪的。', en: '...Right. Thanks. ...It feels strange, hearing that from you.', mood: 'shy' },
    stare: { jp: 'なに。……昔から知ってる顔でしょ。今さら珍しくもないでしょ。', zh: '干嘛。……从小看到大的脸吧。事到如今有什么稀奇的。', en: 'What. ...You have known this face forever. It is hardly news.', mood: 'pout' },
    tease: { jp: 'はいはい。あんたのそういうとこ、十年前から変わんないよね。', zh: '是是是。你这种地方，十年前就一点没变。', en: 'Yes, yes. You have not changed that about yourself in ten years.', mood: 'happy' }
  },
  [CharacterId.MAKI]: {
    praise: { jp: '…………え。……な、なんやねん、急に素直になんなや！ ウチの調子狂うやろ、ざぁこ……。', zh: '…………诶。……干、干嘛啊，突然这么坦率！我会乱了节奏的啦，杂鱼……', en: '.........Eh. ...Wh-what is with you, being all honest suddenly! You will throw me off, you loser...', mood: 'shy' },
    stare: { jp: 'にしし、見とれとる見とれとる〜。せんぱい、わっかりやす〜♡', zh: '嘻嘻，看入迷了看入迷了～。前辈，好好懂哦～♡', en: 'Heehee, you are gawping, you are gawping. So easy to read, senpai.', mood: 'tease' },
    tease: { jp: 'はぁ〜？ センスないのはせんぱいのほうやろ。……ちょっと傷ついたやんけ。', zh: '哈～？没品位的是前辈你吧。……有点受伤了啦。', en: 'Hah? You are the one with no taste, senpai. ...That actually stung a bit.', mood: 'pout' }
  }
};
