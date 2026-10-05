import { GameCalendar, StatKey, StoryBgmTrack, StoryWord, TimeSlot } from '../types';
import { Occasion, Mood, isNewYear, isLuminarieSeason } from '../data/outfitContext';

// ---------------------------------------------------------
// 📍 约她去哪儿
//
// 每个地点是一小段戏：到了 → 两拍这个地方本身 → 一次选择 → 她说一句只有她会说的话 →
// 然后坐下来，接自由对话。
//
// 文本里的 {her} 换成她的名字。选择里的反应只写旁白，
// 她自己开口的那一句在 dateScenes 里按人另配（同一个地方，八个人说的话不一样）。
//
// mood 是"这个邀约有多像约会"：
//   1 顺路（咖啡、游戏厅、天台）——认识就能约
//   2 出去玩（卡拉OK、港边、动物园）
//   3 是约会了（海边、夏祭、爵士、来你家做饭）
//   4 很认真的约会（夜景、温泉、光之祭典、铁板烧）
// 好感度不够她会改约一个轻一点的地方，或者直接拒绝。见 data/dateData.ts。
// ---------------------------------------------------------

export type DateTag = 'food' | 'play' | 'scenery' | 'culture' | 'sport' | 'night' | 'formal' | 'home';

interface Txt { zh: string; en: string }
const T = (zh: string, en: string): Txt => ({ zh, en });

export interface DateOption {
  id: string;
  labelZh: string; labelEn: string;
  jp?: string;
  hintZh: string; hintEn: string;
  aff: number; fam: number;
  stat?: StatKey;
  mood?: Mood;               // 她听完这句的表情
  then: Txt[];
  words?: StoryWord[];
}

export interface DateSpot {
  id: string;
  icon: string;
  scene: string;             // 到达时的背景
  endScene?: string;         // 坐下来聊天时的背景（不写 = scene）
  bgm: StoryBgmTrack;
  nameJp: string; nameZh: string; nameEn: string;
  blurbZh: string; blurbEn: string;
  mood: 1 | 2 | 3 | 4;
  minFam: number;            // 親密度等级（1~5）
  tag: DateTag;
  occasion: (cal: GameCalendar) => Occasion;
  slots: TimeSlot[];
  schoolDayOnly?: boolean;   // 只有上学日的放学后（天台、理科室）
  when?: (cal: GameCalendar) => boolean;
  outdoor?: boolean;         // 下雨不去
  yen?: number;              // 主角掏钱
  timeCost?: number;         // 花几格（不写 = 1）
  stamina?: number;
  stat: StatKey;
  arrive: Txt;
  beats: Txt[];
  choice: { prompt: Txt; options: DateOption[] };
}

const summer = (cal: GameCalendar) => cal.month >= 6 && cal.month <= 9;

export const DATE_SPOTS: DateSpot[] = [
  // ================= mood 1 =================
  {
    id: 'rooftop', icon: '🏫', scene: 'rooftop_sunset', bgm: 'afternoon',
    nameJp: '屋上', nameZh: '放学后的天台', nameEn: 'The roof after school',
    blurbZh: '不用出校门。铁丝网外面是整片的海。', blurbEn: 'No need to leave school. Past the fence, the whole sea.',
    mood: 1, minFam: 1, tag: 'scenery', occasion: () => 'school',
    slots: ['afternoon'], schoolDayOnly: true, outdoor: true, stat: 'charm', stamina: 8,
    arrive: T(
      '天台的门其实是不让开的，锁坏了大概三年，所有人都知道，所有人都默契地不去报修。你推开它的时候，风从海那边一下子灌进来，把你的领带吹到了肩膀后面。',
      'The roof door is not supposed to open. The lock has been broken for about three years and everyone knows, and everyone has silently agreed not to report it. When you push it open the wind off the sea pours in and flips your tie over your shoulder.'),
    beats: [
      T('{her}已经在了，背靠着铁丝网坐着，书包放在脚边。楼下操场上有人在喊口令，声音传到这里已经被风削掉了一半，只剩下"一、二"的"一"。',
        '{her} is already there, sitting with her back to the fence, bag at her feet. Down on the field somebody is calling a drill, and by the time it reaches the roof the wind has taken half of it away, leaving only the "one" of "one, two".'),
      T('从这儿能看见港口的起重机，一排红白相间，像一群站在水边、等着谁先开口的长颈鹿。你们俩看了一会儿，谁也没先开口。',
        'From here you can see the cranes at the port, a red-and-white row of them, like giraffes standing at the water\'s edge waiting for somebody else to speak first. The two of you watch them for a while. Neither speaks first.')
    ],
    choice: {
      prompt: T('风停了一下。这种时候总得有个人说点什么。', 'The wind drops for a moment. At times like this somebody has to say something.'),
      options: [
        { id: 'sky', labelZh: '「空、高いね。」', labelEn: '"The sky is high today."', jp: '空、高いね。', hintZh: '最没有意义、也最安全的一句', hintEn: 'The safest, least meaningful thing to say',
          aff: 3, fam: 5, stat: 'charm', mood: 'happy', words: [{ jp: '空が高い', reading: 'そらがたかい', zh: '天很高（秋高气爽的说法）', en: 'the sky is high (said of clear autumn days)' }],
          then: [T('{her}抬头看了一眼，说是啊。然后你们俩又看了一会儿天。说了等于没说，可没说的那部分好像也被听见了。', '{her} looks up and agrees. Then the two of you look at the sky some more. It was nothing to say, and somehow the part you did not say was heard as well.')] },
        { id: 'snack', labelZh: '把书包里那袋饼干拿出来分', labelEn: 'Share the biscuits in your bag', hintZh: '书包底下压了三天的那袋', hintEn: 'The packet that has been at the bottom of your bag for three days',
          aff: 4, fam: 4, stat: 'kindness', mood: 'happy',
          then: [T('饼干碎了一半。{her}专挑碎的那些吃，说完整的留给你。你不知道这算是体贴还是挑食，大概两样都有。', 'Half the biscuits are broken. {her} eats only the broken ones and says the whole ones are for you. You cannot tell if this is kindness or fussiness. Probably both.')] },
        { id: 'quiet', labelZh: '什么都不说，坐到她旁边', labelEn: 'Say nothing and sit down beside her', hintZh: '有时候安静就是回答', hintEn: 'Sometimes quiet is the answer',
          aff: 5, fam: 3, stat: 'guts', mood: 'shy',
          then: [T('铁丝网被你们两个人靠得往外弯了一点。{her}没有挪开。远处有一艘渡轮拉了一声汽笛，很长，长到你开始数它。', 'The fence bows out a little under the two of you. {her} does not move away. Far off a ferry sounds its horn, long enough that you start counting it.')] }
      ]
    }
  },
  {
    id: 'lab', icon: '🔬', scene: 'school_science_lab', bgm: 'study',
    nameJp: '理科室', nameZh: '理科室的小实验', nameEn: 'An experiment in the science lab',
    blurbZh: '放学后的理科室，借来的钥匙，一个不在课本上的实验。', blurbEn: 'The science lab after hours, a borrowed key, an experiment not in the textbook.',
    mood: 1, minFam: 1, tag: 'culture', occasion: () => 'lab',
    slots: ['afternoon'], schoolDayOnly: true, stat: 'knowledge', stamina: 8,
    arrive: T(
      '理科室在走廊的尽头，门口贴着一张手写的"实验中，勿入"。你敲了门，里面有人说请进——好像这张纸贴出来，本来就是为了等你来敲。',
      'The science lab is at the end of the corridor with a handwritten notice on the door: EXPERIMENT IN PROGRESS, DO NOT ENTER. You knock, and somebody says come in, as if the notice had been put up precisely so that you would knock on it.'),
    beats: [
      T('窗帘拉了一半，下午的光斜斜地落在实验台上，照亮了一排烧杯和一只看起来年纪比你还大的酒精灯。空气里有一点点硫磺的味道，还有一点点橘子的味道，你决定不去追究为什么。',
        'The curtains are half drawn and the afternoon light falls slantwise across the bench, over a row of beakers and a spirit lamp that looks older than you. The air smells faintly of sulphur and faintly of oranges, and you decide not to ask why.'),
      T('{her}递给你一副护目镜。今天的实验是焰色反应：把不同的盐撒进火里，火会变成不同的颜色。钠是黄的，铜是绿的，锂是一种你没见过的红。',
        '{her} hands you a pair of goggles. Today it is flame tests: sprinkle different salts into the flame and the flame changes colour. Sodium is yellow. Copper is green. Lithium is a red you have never seen before.')
    ],
    choice: {
      prompt: T('还剩最后一小撮盐。标签被水洇了，看不清写的是什么。', 'One last pinch of salt left. The label has run and you cannot read it.'),
      options: [
        { id: 'guess', labelZh: '先猜颜色再撒', labelEn: 'Guess the colour first', jp: '紫だと思う。', hintZh: '赌一把', hintEn: 'Take a punt',
          aff: 3, fam: 5, stat: 'knowledge', mood: 'surprised', words: [{ jp: '炎色反応', reading: 'えんしょくはんのう', zh: '焰色反应', en: 'flame test' }],
          then: [T('你猜紫色。火焰变成了淡淡的紫。{her}看着你，像是你刚刚解出了一道她出了很久的题。其实是钾，其实你只是蒙的，你决定把这件事带进坟墓。', 'You guess violet. The flame turns a pale violet. {her} looks at you as though you have just solved a problem she set long ago. It was potassium and it was a guess, and you resolve to take that to your grave.')] },
        { id: 'together', labelZh: '让她来撒，你来记录', labelEn: 'Let her do it; you take notes', hintZh: '分工合作', hintEn: 'Division of labour',
          aff: 4, fam: 4, stat: 'proficiency', mood: 'happy',
          then: [T('你在本子上一笔一笔地记：时间、颜色、持续了几秒。{her}偶尔探过头来看你写的字，你的字从来没有被人这么认真地看过。', 'You write it down line by line: the time, the colour, how long it lasted. Now and then {her} leans over to look at your handwriting. Nobody has ever read your handwriting this carefully.')] },
        { id: 'lights', labelZh: '把窗帘全拉上再撒', labelEn: 'Close all the curtains first', hintZh: '黑一点，颜色才看得清', hintEn: 'Darker, so the colour shows',
          aff: 5, fam: 3, stat: 'guts', mood: 'shy',
          then: [T('窗帘拉上以后，理科室暗得像傍晚提前到了。火焰一下子变成了很亮的绿，把两个人的护目镜都映成了绿色。你们俩在那片绿里互相看了一眼，同时笑了出来。', 'With the curtains shut the lab goes dark as if evening had come early. The flame flares a bright green and turns both your goggles green. You look at each other through it and laugh at the same moment.')] }
      ]
    }
  },
  {
    id: 'gym', icon: '🏀', scene: 'basketball_gym_sunset', bgm: 'basketball',
    nameJp: '体育館', nameZh: '体育馆投篮', nameEn: 'Shooting hoops in the gym',
    blurbZh: '部活结束之后的空体育馆，一只球，两个人。', blurbEn: 'The empty gym after club practice. One ball, two people.',
    mood: 1, minFam: 1, tag: 'sport', occasion: () => 'sport',
    slots: ['lunch', 'afternoon'], stat: 'guts', stamina: 22,
    arrive: T(
      '部活刚结束，体育馆里还留着一股橡胶和汗的味道。夕阳从高高的窗户里斜插进来，在地板上画出几块金色的长方形，像有人忘了收的地毯。',
      'Club practice has just finished and the gym still smells of rubber and sweat. The setting sun slants in through the high windows and lays long gold rectangles on the floor, like rugs somebody forgot to roll up.'),
    beats: [
      T('{her}从器材室里滚出一只球，球在地板上弹了三下，声音在空馆里来回撞，撞了很久才停。',
        '{her} rolls a ball out of the equipment room. It bounces three times and the sound goes back and forth in the empty hall for a long time before it stops.'),
      T('你投了第一个，砸在篮筐上弹飞了。第二个连篮板都没碰到。到第五个，你开始认真怀疑篮筐是不是比规定的高。',
        'Your first shot hits the rim and flies off. The second does not reach the backboard. By the fifth you are seriously wondering whether the hoop is higher than regulation.')
    ],
    choice: {
      prompt: T('{her}在罚球线上看着你。最后一球。', '{her} watches you from the free-throw line. Last shot.'),
      options: [
        { id: 'teach', labelZh: '「教えて。」请她教你', labelEn: '"Teach me."', jp: '教えて。', hintZh: '承认自己不会', hintEn: 'Admit you cannot',
          aff: 4, fam: 5, stat: 'proficiency', mood: 'happy', words: [{ jp: 'シュート', zh: '投篮', en: 'shot (basketball)' }],
          then: [T('{her}站到你身后，把你的手肘往里推了一点，说就这样。你投出去，球在篮筐上转了一圈半，掉了进去。你们俩都愣了一下，然后一起叫出声。', '{her} stands behind you and nudges your elbow in a little and says, like that. You shoot. The ball circles the rim one and a half times and drops in. You both freeze, then both shout.')] },
        { id: 'bet', labelZh: '「入ったら、ジュース。」打个赌', labelEn: '"If it goes in, you buy the drinks."', jp: '入ったら、ジュースおごって。', hintZh: '给自己加点压力', hintEn: 'Raise the stakes',
          aff: 3, fam: 4, stat: 'guts', mood: 'tease',
          then: [T('没进。球砸在篮板角上，弹到了观众席。{her}笑得蹲了下去。回去的路上你买了两罐宝矿力，她喝的时候一直在笑。', 'It misses. It hits the corner of the backboard and bounces into the stands. {her} laughs so hard she has to crouch. On the way home you buy two cans of Pocari, and she laughs the whole time she drinks hers.')] },
        { id: 'pass', labelZh: '把球传给她', labelEn: 'Pass the ball to her', hintZh: '让她来', hintEn: 'Let her take it',
          aff: 5, fam: 3, stat: 'kindness', mood: 'surprised',
          then: [T('{her}接住球，愣了半秒，然后随手一抛。球划了一道很高的弧，从夕阳那块金色的长方形里穿过去，空心入网。"……今の、なしな。"她说。你说不行，你看见了。', '{her} catches it, hesitates half a second, and lobs it casually. It goes up in a high arc through one of the gold rectangles of sunlight and drops clean through. "...That one does not count," she says. You say it does. You saw it.')] }
      ]
    }
  },
  {
    id: 'arcade', icon: '🕹️', scene: 'sannomiya_arcade', bgm: 'arcade',
    nameJp: 'ゲーセン', nameZh: '三宫的游戏厅', nameEn: 'The Sannomiya arcade',
    blurbZh: '抓娃娃、太鼓、贴纸照。一百日元一次。', blurbEn: 'Crane games, taiko drums, photo booths. A hundred yen a go.',
    mood: 1, minFam: 1, tag: 'play', occasion: () => 'casual',
    slots: ['lunch', 'afternoon', 'night'], yen: 600, stat: 'proficiency',
    arrive: T(
      '游戏厅的自动门一开，声音就像一面墙一样倒过来：太鼓、音游、抓娃娃机的音乐、不知道哪台机器在一遍遍地喊"ラッキー！"。你在门口站了两秒，让耳朵适应一下。',
      'When the arcade doors slide open the noise falls on you like a wall: taiko, rhythm games, crane-machine jingles, some machine somewhere shouting LUCKY over and over. You stand at the entrance for two seconds to let your ears adjust.'),
    beats: [
      T('{her}在抓娃娃机前面站定了。玻璃后面堆着一山软乎乎的海豹，每一只都长着一张"我很好抓"的脸。你知道这是谎言。全世界都知道这是谎言。',
        '{her} has stopped in front of a crane machine. Behind the glass is a heap of soft seals, every one with a face that says I am easy to catch. You know this is a lie. The whole world knows it is a lie.'),
      T('第一个一百日元，爪子碰到了海豹的头，然后很温柔地松开了，像是在跟它道别。第二个一百日元，爪子根本没下到底。',
        'The first hundred yen: the claw touches a seal on the head and lets go very gently, as if saying goodbye. The second: the claw does not even reach the bottom.')
    ],
    choice: {
      prompt: T('还剩最后一枚硬币。', 'One coin left.'),
      options: [
        { id: 'claw', labelZh: '再抓一次', labelEn: 'One more go at the crane', hintZh: '这次瞄准尾巴', hintEn: 'Aim for the tail this time',
          aff: 5, fam: 3, stat: 'proficiency', mood: 'surprised', words: [{ jp: 'UFOキャッチャー', zh: '抓娃娃机', en: 'crane game' }],
          then: [T('爪子勾住了海豹的尾巴，把它倒着提起来，晃了两下，在出口边上停住，然后——掉了下去。{her}发出了一声你从来没听过的声音。海豹现在在她怀里，倒着的。', 'The claw hooks a seal by the tail and lifts it upside down, swings twice, pauses at the chute and drops in. {her} makes a sound you have never heard her make. The seal is now in her arms, upside down.')] },
        { id: 'taiko', labelZh: '两个人打一局太鼓', labelEn: 'A round of taiko for two', jp: '一緒にやろう。', hintZh: '比赛，或者合作', hintEn: 'Compete, or cooperate',
          aff: 3, fam: 5, stat: 'guts', mood: 'happy',
          then: [T('你选了简单难度，她选了困难。曲子是一首你在便利店听过一百遍的动画歌。打到副歌，你们俩的鼓点终于对上了一次，就那么一次，响得整排机器都好像回头看了一眼。', 'You pick easy; she picks hard. The song is an anime theme you have heard a hundred times in convenience stores. In the chorus your beats line up, just once, loud enough that the whole row of machines seems to turn and look.')] },
        { id: 'purikura', labelZh: '去拍贴纸照', labelEn: 'Go into the photo booth', jp: 'プリ、撮ろうよ。', hintZh: '那个小隔间有点挤', hintEn: 'The booth is a bit cramped',
          aff: 6, fam: 2, stat: 'charm', mood: 'shy', words: [{ jp: 'プリクラ', zh: '大头贴', en: 'photo sticker booth' }],
          then: [T('机器用一种过分开朗的声音指挥你们摆姿势。第三张的时候它说"もっと近づいて！"，你们俩都假装没听见，又都往中间挪了一点。贴纸出来的时候，你们的眼睛都被修得大得像外星人。她把其中一半剪下来，递给你。', 'The machine directs your poses in an unreasonably cheerful voice. On the third shot it says closer! and you both pretend not to hear, and both move a little closer. When the stickers come out your eyes have been edited enormous, like aliens. She cuts the sheet in half and gives you one.')] }
      ]
    }
  },
  {
    id: 'cafe', icon: '☕', scene: 'nishimura_coffee_salon', bgm: 'town',
    nameJp: 'にしむら珈琲', nameZh: '北野坂的西村咖啡', nameEn: 'Nishimura Coffee on Kitano-zaka',
    blurbZh: '法兰绒手冲，一杯一杯地冲。慢得像一种修行。', blurbEn: 'Flannel drip, one cup at a time. Slow enough to count as a discipline.',
    mood: 1, minFam: 2, tag: 'food', occasion: () => 'casual',
    slots: ['lunch', 'afternoon'], yen: 1300, stat: 'charm',
    arrive: T(
      '北野坂上的西村咖啡，门口那块木招牌上的字已经被几十年的手摸得发亮。你推门的时候门铃响了一声，声音很旧，像是从另一个年代借来的，用完了还要还回去。',
      'Nishimura Coffee, halfway up Kitano-zaka, its wooden sign worn bright by decades of hands. The bell on the door rings when you push it, an old sound, as if borrowed from another era and due back.'),
    beats: [
      T('{her}坐在靠窗的位置，面前的水杯已经少了一半。看见你进来，她抬了一下手——不是挥手，是那种"在这儿"的手势，像在拍卖会上出价。',
        '{her} is at a window table and her glass of water is half gone. When she sees you she raises a hand. Not a wave. The kind of gesture you make to place a bid at an auction.'),
      T('咖啡是用法兰绒滤布一杯一杯冲的。店员冲得很慢，慢到你开始怀疑这是一种修行，而你们俩是来看他修行的。',
        'The coffee is made one cup at a time through flannel. The man behind the counter does it so slowly that you begin to suspect it is a spiritual practice and you have both come to watch.')
    ],
    choice: {
      prompt: T('菜单很短。{her}看着你，等你先点。', 'The menu is short. {her} watches you, waiting for you to order first.'),
      options: [
        { id: 'blend', labelZh: '「ブレンドを二つ。」', labelEn: '"Two house blends."', jp: 'ブレンドを二つ、お願いします。', hintZh: '不用想太多', hintEn: 'Do not overthink it',
          aff: 3, fam: 5, stat: 'charm', mood: 'neutral', words: [{ jp: 'ブレンド', zh: '综合咖啡（店里的招牌混合豆）', en: 'house blend' }],
          then: [T('{her}点了点头，好像你通过了一个她没说出口的小测验。咖啡来了，苦得很干净，像一句没有修饰的实话。', '{her} nods, as though you have passed a small test she did not mention. The coffee arrives, cleanly bitter, like a plain true statement.')] },
        { id: 'same', labelZh: '「同じのを。」跟她点一样的', labelEn: '"The same as her."', jp: '同じのを。', hintZh: '让她先选', hintEn: 'Let her choose',
          aff: 5, fam: 3, stat: 'kindness', mood: 'shy',
          then: [T('她点了一杯维也纳咖啡。你也是。奶油在杯子上堆得像一小座雪山，你们俩低头看着各自的那座山，都有点不知道从哪里下嘴。', 'She orders a Vienna coffee. So do you. The cream is piled on top like a small snowy mountain, and the two of you look down at your mountains, neither quite sure where to begin.')] },
        { id: 'ask', labelZh: '「おすすめは？」问她推荐什么', labelEn: '"What do you recommend?"', jp: 'おすすめは？', hintZh: '把选择交给她', hintEn: 'Hand her the choice',
          aff: 4, fam: 4, stat: 'charm', mood: 'happy', words: [{ jp: 'おすすめ', zh: '推荐', en: 'recommendation' }],
          then: [T('{her}认真地想了很久，久到店员冲完了一杯。最后她推荐的是一块芝士蛋糕，理由是"这里的叉子很好用"。你吃了，叉子确实很好用。', '{her} thinks about it for so long that the man behind the counter finishes a whole cup. In the end she recommends the cheesecake, on the grounds that the forks here are very good. You have some. The forks are very good.')] }
      ]
    }
  },
  {
    id: 'pancake', icon: '🥞', scene: 'pancake_shop_interior', bgm: 'town',
    nameJp: '幸せのパンケーキ', nameZh: '幸福松饼', nameEn: 'The happiness pancake shop',
    blurbZh: '排队四十分钟，松饼抖得像布丁。', blurbEn: 'Forty minutes in the queue, pancakes that wobble like pudding.',
    mood: 1, minFam: 2, tag: 'food', occasion: () => 'casual',
    slots: ['lunch', 'afternoon'], yen: 1400, stat: 'kindness',
    arrive: T(
      '店门口排着一条队，队伍里几乎都是两个人两个人的。你站进去的时候，突然意识到在别人眼里你们也是这样的两个人，然后决定不去想这件事。',
      'There is a queue outside, nearly all of it in pairs. As you join it you realise that to everybody else you are also a pair, and decide not to think about that.'),
    beats: [
      T('等了很久。久到你和{her}已经把这条街上每一块招牌都评论了一遍，久到前面那对情侣吵了一架又和好了。',
        'It is a long wait. Long enough that you and {her} have critiqued every shop sign on the street, long enough that the couple in front have had a row and made up.'),
      T('松饼端上来的时候在盘子里抖了一下，像是刚睡醒。上面的黄油正在慢慢化开，枫糖浆装在一个小小的玻璃壶里，壶嘴细得像一根问号。',
        'When the pancakes arrive they wobble on the plate as if they have just woken up. The butter on top is slowly melting. The maple syrup comes in a tiny glass jug with a spout as thin as a question mark.')
    ],
    choice: {
      prompt: T('只有一壶糖浆。', 'There is only one jug of syrup.'),
      options: [
        { id: 'pour', labelZh: '先给她倒', labelEn: 'Pour hers first', hintZh: '礼貌', hintEn: 'Manners',
          aff: 4, fam: 4, stat: 'kindness', mood: 'happy', words: [{ jp: 'お先にどうぞ', zh: '您先请', en: 'after you' }],
          then: [T('你倒得太多了。糖浆从松饼边上流下去，在盘子里积成一个小湖。{her}看着那个湖，说这样刚刚好。你很确定她在说谎，而且是为了你。', 'You pour too much. The syrup runs off the edge and makes a small lake on the plate. {her} looks at the lake and says it is just right. You are fairly sure she is lying, and that it is for your sake.')] },
        { id: 'share', labelZh: '两种口味各点一份，换着吃', labelEn: 'Order two flavours and swap', jp: '半分こしよう。', hintZh: '一份变两份', hintEn: 'One becomes two',
          aff: 5, fam: 3, stat: 'charm', mood: 'shy', words: [{ jp: '半分こ', reading: 'はんぶんこ', zh: '一人一半', en: 'splitting half and half' }],
          then: [T('一份原味，一份抹茶红豆。你们把盘子推来推去推了三次，最后干脆放到了桌子正中间，两把叉子在上面偶尔碰到，叮的一声。', 'One plain, one matcha with red bean. You push the plates back and forth three times and in the end just put them in the middle of the table, where now and then your forks touch with a small clink.')] },
        { id: 'photo', labelZh: '先拍照', labelEn: 'Photograph it first', hintZh: '排了四十分钟，得留个证据', hintEn: 'Forty minutes of queueing deserves evidence',
          aff: 3, fam: 5, stat: 'proficiency', mood: 'tease',
          then: [T('你拍了一张，{her}突然把脸凑进了画面。照片里松饼是虚的，她是清楚的。你后来一直没删那张照片。', 'You take one and {her} suddenly leans into the frame. In the picture the pancakes are blurred and she is in focus. You never do delete it.')] }
      ]
    }
  },
  {
    id: 'nankinmachi', icon: '🥟', scene: 'nankinmachi', bgm: 'town',
    nameJp: '南京町', nameZh: '南京町边走边吃', nameEn: 'Eating your way through Nankinmachi',
    blurbZh: '猪肉包、小笼包、芝麻球。一条街走完，肚子是圆的。', blurbEn: 'Pork buns, soup dumplings, sesame balls. One street, one round stomach.',
    mood: 1, minFam: 2, tag: 'food', occasion: () => 'casual',
    slots: ['lunch', 'afternoon', 'night'], yen: 900, stat: 'charm',
    arrive: T(
      '南京町的牌楼底下挂着一排红灯笼，风一吹，它们就一起往同一个方向点头，像是同意了什么。空气里全是蒸笼的白气和八角的味道。',
      'Under the Nankinmachi gate a row of red lanterns nods in the same direction every time the wind blows, as if agreeing to something. The air is all steamer vapour and star anise.'),
    beats: [
      T('老祥记门口照例排着队，队伍从店门口拐过街角，又拐回来一点。{her}说排这个是礼仪，不排的话会被这条街看不起。',
        'As usual the queue at Roshoki runs from the door round the corner and a bit back again. {her} says queuing here is a courtesy; if you do not, the street will look down on you.'),
      T('猪肉包小小的一个，烫得要用两只手来回倒。你们站在路边吃，吃完第一个，谁都没说话，都去排了第二次。',
        'The pork buns are small and so hot you have to toss them from hand to hand. You eat standing at the kerb. After the first one neither of you says anything. You both go and queue again.')
    ],
    choice: {
      prompt: T('下一家卖小笼包。汤汁很烫，招牌上写着。', 'The next stall sells soup dumplings. The sign warns that the soup is very hot.'),
      options: [
        { id: 'blow', labelZh: '替她吹凉', labelEn: 'Blow on hers to cool it', hintZh: '有点像照顾小孩', hintEn: 'A bit like looking after a child',
          aff: 5, fam: 3, stat: 'kindness', mood: 'shy', words: [{ jp: 'ふーふーする', zh: '（吹凉食物）呼呼地吹', en: 'to blow on food to cool it' }],
          then: [T('{her}盯着你吹了半天，然后说"子供扱いしないで"，但还是等你吹完才吃。', '{her} watches you blow on it for ages, then says do not treat me like a child, and still waits until you have finished before she eats it.')] },
        { id: 'brave', labelZh: '一口吞下去', labelEn: 'Eat it in one go', hintZh: '招牌是写给别人看的', hintEn: 'Signs are for other people',
          aff: 2, fam: 6, stat: 'guts', mood: 'surprised',
          then: [T('招牌没有骗你。你在南京町的正中间无声地跳了一小段舞。{her}笑得扶住了旁边的灯柱，路过的游客以为是街头表演，有一个差点给钱。', 'The sign did not lie. You perform a small silent dance in the middle of Nankinmachi. {her} laughs so hard she has to hold on to a lamp post. A passing tourist takes it for street theatre and almost tips you.')] },
        { id: 'sesame', labelZh: '跳过小笼包，去买芝麻球', labelEn: 'Skip the dumplings and get sesame balls', hintZh: '甜的', hintEn: 'Something sweet',
          aff: 4, fam: 4, stat: 'charm', mood: 'happy',
          then: [T('芝麻球外面脆，里面是空的，只有一层薄薄的豆沙贴在壁上。{her}说这就像某些人，你问是谁，她不说。', 'The sesame balls are crisp outside and hollow inside, just a thin layer of bean paste on the wall. {her} says they are like certain people. You ask who. She does not say.')] }
      ]
    }
  },

  // ================= mood 2 =================
  {
    id: 'karaoke', icon: '🎤', scene: 'karaoke_room', bgm: 'town',
    nameJp: 'カラオケ', nameZh: '两个人的卡拉OK', nameEn: 'Karaoke for two',
    blurbZh: '学生价，一小时三百日元。包厢很小。', blurbEn: 'Student rate, three hundred yen an hour. The booth is small.',
    mood: 2, minFam: 2, tag: 'play', occasion: () => 'casual',
    slots: ['lunch', 'afternoon', 'night'], yen: 700, stat: 'guts',
    arrive: T(
      '包厢小得只放得下一张沙发和一张桌子，墙上的屏幕在放一支你没听过的乐队的宣传片。门一关，外面走廊上别的包厢的歌声就变成了很远的、闷闷的鼓点，像隔壁有人在搬家。',
      'The booth holds one sofa and one table. The screen on the wall is playing a promo for a band you have never heard of. When the door closes, the singing from the other booths becomes a distant muffled thud, like somebody next door moving house.'),
    beats: [
      T('{her}先拿起了点歌器，翻得很快，像是早就想好了要唱什么，只是在确认它还在。',
        '{her} takes the song tablet first and scrolls fast, as if she decided long ago what she would sing and is just checking it is still there.'),
      T('第一首唱完，屏幕上打出一个分数：八十七。她看了一眼，说这台机器打分很严。你点了第二首，八十一。她说这台机器打分很松。',
        'After the first song a score comes up: eighty-seven. She glances at it and says this machine marks hard. You sing the second and get eighty-one. She says this machine marks soft.')
    ],
    choice: {
      prompt: T('点歌器又回到了你手里。', 'The tablet comes back to you.'),
      options: [
        { id: 'duet', labelZh: '点一首对唱', labelEn: 'Choose a duet', jp: 'デュエット、しない？', hintZh: '另一只话筒在她手边', hintEn: 'The other mic is by her hand',
          aff: 6, fam: 2, stat: 'charm', mood: 'shy', words: [{ jp: 'デュエット', zh: '对唱', en: 'duet' }],
          then: [T('是一首老情歌。唱到"きみと"那一句的时候，你们俩同时停了一拍，然后又同时接上。分数是七十二，你们俩谁都没看。', 'An old love song. At the line "with you" you both stop for a beat, then both come back in together. The score is seventy-two. Neither of you looks at it.')] },
        { id: 'anime', labelZh: '点一首谁都会唱的动画歌', labelEn: 'An anime song everybody knows', hintZh: '安全牌', hintEn: 'The safe card',
          aff: 3, fam: 5, stat: 'guts', mood: 'happy',
          then: [T('前奏一响，{her}就站了起来。到副歌的时候你们两个都在吼，吼得包厢的门都在震。唱完两个人都喘着气坐回沙发上，笑了很久。', 'At the first bar of the intro {her} is on her feet. By the chorus you are both bellowing loud enough to rattle the door. Afterwards you collapse on the sofa, out of breath, laughing for a long time.')] },
        { id: 'listen', labelZh: '把话筒递给她：「もっと聴きたい」', labelEn: 'Hand her the mic: "I want to hear more."', jp: 'もっと聴きたい。', hintZh: '当听众', hintEn: 'Be the audience',
          aff: 5, fam: 3, stat: 'kindness', mood: 'happy',
          then: [T('她愣了一下，然后点了一首很安静的歌。唱的时候她一直看着屏幕，没有看你。唱完了，她才看过来，问你干嘛不鼓掌。你鼓了，鼓得很响。', 'She blinks, then picks a very quiet song. She keeps her eyes on the screen the whole time she sings. Only when it ends does she look over and ask why you are not clapping. You clap, loudly.')] }
      ]
    }
  },
  {
    id: 'harbor', icon: '🌊', scene: 'meriken_park', endScene: 'kobe_harbor', bgm: 'harbor',
    nameJp: 'メリケンパーク', nameZh: '美利坚公园看港口', nameEn: 'Watching the harbour at Meriken Park',
    blurbZh: '红色的港塔、白色的海洋博物馆、一直在动的海。', blurbEn: 'The red Port Tower, the white museum, the sea that never sits still.',
    mood: 2, minFam: 2, tag: 'scenery', occasion: () => 'casual',
    slots: ['afternoon', 'night'], outdoor: true, stat: 'charm',
    arrive: T(
      '美利坚公园的风总是从海那边来的。红色的神户港塔站在那儿，腰身细得像一只沙漏，有人说它是倒过来的鼓。你一直觉得它更像一个在思考问题的人。',
      'At Meriken Park the wind always comes off the sea. The red Port Tower stands there, waisted like an hourglass. Some people say it is an upside-down drum. You have always thought it looks more like somebody thinking hard about a problem.'),
    beats: [
      T('{her}走在你前面一点，沿着岸边那条栏杆，用手指一根一根地敲过去。栏杆是铁的，每一根的声音都差不多，可她敲得很认真，像是在找其中不一样的那一根。',
        '{her} walks a little ahead of you along the railing by the water, tapping each upright with a finger. They are iron and they all sound much the same, but she taps them carefully, as if looking for the one that is different.'),
      T('一艘游船开过去，船尾拖出一道白色的浪，浪一直走到你们脚下的岸边，拍了一下，然后很有礼貌地退回去了。',
        'A pleasure boat goes past trailing a white wake. The wake travels all the way to the wall below your feet, slaps it once, and politely withdraws.')
    ],
    choice: {
      prompt: T('长椅上空出了一个位置。只有一个。', 'A space has come free on a bench. Just the one.'),
      options: [
        { id: 'sit_her', labelZh: '让她坐，你站着', labelEn: 'Let her sit; you stand', hintZh: '绅士', hintEn: 'Gentlemanly',
          aff: 4, fam: 4, stat: 'kindness', mood: 'happy',
          then: [T('{her}坐下来，抬头看你。从这个角度看，你挡住了一半的港塔。她说没关系，她更想看这一半。', '{her} sits and looks up at you. From there you block half the Port Tower. She says that is fine, she would rather look at this half.')] },
        { id: 'squeeze', labelZh: '「詰めれば座れるよ。」挤一挤', labelEn: '"We can both fit if we squeeze."', jp: '詰めれば二人座れるよ。', hintZh: '长椅本来就是两个人的', hintEn: 'Benches are made for two',
          aff: 6, fam: 2, stat: 'guts', mood: 'shy', words: [{ jp: '詰める', reading: 'つめる', zh: '挤一挤、往里挪', en: 'to squeeze up, move along' }],
          then: [T('挤得下。只是两个人的肩膀从头到尾都贴在一起。风从海那边吹过来的时候，你能感觉到她那边的肩膀稍微缩了一下，然后又没有挪开。', 'It fits. Only your shoulders are touching from start to finish. When the wind comes off the sea you feel her shoulder flinch a little, and then not move away.')] },
        { id: 'railing', labelZh: '都不坐，靠在栏杆上', labelEn: 'Neither of you sits; lean on the railing', hintZh: '站着看得远', hintEn: 'You see further standing',
          aff: 3, fam: 5, stat: 'charm', mood: 'neutral',
          then: [T('你们并排趴在栏杆上看海，看对岸的灯一盏一盏亮起来。{her}数着，数到第二十几盏就放弃了，说反正明天还会亮。', 'You lean side by side on the railing and watch the lights come on across the water one by one. {her} counts them, gives up somewhere past twenty, and says they will come on again tomorrow anyway.')] }
      ]
    }
  },
  {
    id: 'zoo', icon: '🎡', scene: 'oji_zoo', endScene: 'oji_zoo_ferris_wheel', bgm: 'weekend',
    nameJp: '王子動物園', nameZh: '王子动物园和摩天轮', nameEn: 'Oji Zoo and its Ferris wheel',
    blurbZh: '大熊猫走了以后，人气第一是一只很胖的河马。园里还有一座小小的摩天轮。', blurbEn: 'Since the panda left, the star is a very fat hippo. There is a little Ferris wheel too.',
    mood: 2, minFam: 3, tag: 'play', occasion: () => 'casual',
    slots: ['lunch', 'afternoon'], yen: 1200, outdoor: true, stat: 'kindness', stamina: 22,
    arrive: T(
      '王子动物园的入口有一块很旧的牌子，上面画着一只笑得过分开心的大象。你买了两张票，售票的阿姨说"摩天轮五点停哦"，好像她已经知道你们最后会去哪里。',
      'At the entrance to Oji Zoo there is an old sign with an elephant on it that looks far too pleased with itself. You buy two tickets and the woman at the window says the wheel stops at five, as if she already knows where you will end up.'),
    beats: [
      T('河马在水里一动不动，只露出两只鼻孔和两只耳朵，像一块会呼吸的石头。{her}在它面前看了很久，说它的人生大概没什么烦恼，然后又说，也可能有，只是不说。',
        'The hippo lies motionless in the water with only its nostrils and ears showing, like a breathing rock. {her} watches it for a long time and says its life probably has no worries in it. Then she says, or maybe it does, and just does not mention them.'),
      T('摩天轮很小，转一圈只要四分钟，最高的地方也就比旁边的树高一点。可是轿厢晃了一下的时候，你们俩都抓住了同一根扶手。',
        'The Ferris wheel is small. One turn takes four minutes and at the top you are only a little above the trees. But when the gondola sways, you both grab the same rail.')
    ],
    choice: {
      prompt: T('轿厢到了最高点。整个神户在下面，海在更下面。', 'The gondola reaches the top. All of Kobe below, and the sea below that.'),
      options: [
        { id: 'point', labelZh: '指给她看你住的地方', labelEn: 'Point out where you live', jp: 'あそこ、うちの近く。', hintZh: '小得看不见', hintEn: 'Too small to see',
          aff: 3, fam: 5, stat: 'knowledge', mood: 'neutral', words: [{ jp: '見下ろす', reading: 'みおろす', zh: '俯瞰', en: 'to look down on' }],
          then: [T('你指的方向其实全是屋顶。{her}顺着你的手指看了半天，说"あ、見えた"。你很确定她什么都没看见，可她说得那么认真，你就当她看见了。', 'Where you point is nothing but rooftops. {her} follows your finger for ages and says oh, I see it. You are sure she sees nothing, but she says it so seriously that you decide she did.')] },
        { id: 'photo', labelZh: '两个人一起自拍', labelEn: 'Take a selfie together', hintZh: '轿厢很窄', hintEn: 'The gondola is narrow',
          aff: 6, fam: 2, stat: 'charm', mood: 'shy',
          then: [T('镜头装不下两个人，只好凑近。照片里你们身后是一整片海，海上有一道光，你们俩都在眯着眼睛笑。', 'The lens will not fit both of you, so you lean in. Behind you in the photo is the whole sea with a path of light across it, and you are both squinting and smiling.')] },
        { id: 'quiet', labelZh: '什么都不说，看风景', labelEn: 'Say nothing; watch the view', hintZh: '四分钟很短', hintEn: 'Four minutes is not long',
          aff: 4, fam: 4, stat: 'kindness', mood: 'happy',
          then: [T('轿厢慢慢往下降。到了底下，工作人员打开门的时候，{her}小声说了一句"もう一周"。你装作没听见，然后去又买了两张票。', 'The gondola sinks slowly. At the bottom, as the attendant opens the door, {her} says under her breath, one more go. You pretend not to hear, then go and buy two more tickets.')] }
      ]
    }
  },
  {
    id: 'aquarium', icon: '🐟', scene: 'suma_aquarium', bgm: 'reflective',
    nameJp: '須磨の水族園', nameZh: '须磨水族园', nameEn: 'Suma Aquarium',
    blurbZh: '大水槽前面那一排长椅，可以坐一个下午。', blurbEn: 'The bench in front of the great tank, where you can sit an entire afternoon.',
    mood: 2, minFam: 3, tag: 'culture', occasion: () => 'casual',
    slots: ['lunch', 'afternoon'], yen: 1800, stat: 'knowledge',
    arrive: T(
      '一进水族园，外面的声音就被关在了门外。里面是蓝的，那种很深的、让人说话会不自觉压低声音的蓝。',
      'Inside the aquarium the noise of outside is shut out behind the door. Everything is blue, the deep kind of blue that makes people lower their voices without noticing.'),
    beats: [
      T('大水槽里有一群沙丁鱼，几千条，转成一个银色的旋涡。它们转的方向一直在变，可永远没有一条撞到另一条。{her}站在玻璃前面，看它们看得出了神。',
        'In the great tank a shoal of sardines, thousands of them, turns in a silver spiral. The direction keeps changing and not one ever collides with another. {her} stands at the glass, lost in them.'),
      T('一条鳐鱼从你们面前滑过去，白色的肚子贴着玻璃，上面那张脸像是在笑，又像是在很礼貌地表示惊讶。',
        'A ray glides past, its white belly against the glass. The face on its underside seems to be smiling, or perhaps expressing surprise very politely.')
    ],
    choice: {
      prompt: T('海豚表演还有十分钟开始。', 'The dolphin show starts in ten minutes.'),
      options: [
        { id: 'show', labelZh: '去占前排', labelEn: 'Grab front-row seats', hintZh: '前排有溅水区', hintEn: 'The front row is the splash zone',
          aff: 3, fam: 5, stat: 'guts', mood: 'surprised', words: [{ jp: 'びしょ濡れ', reading: 'びしょぬれ', zh: '湿透了', en: 'soaked' }],
          then: [T('最后一个节目，海豚用尾巴拍了一下水面。前排全湿了。你们俩坐在那儿，头发往下滴水，互相看了一眼，然后同时笑出了声。', 'In the final act a dolphin slaps the water with its tail. The whole front row is drenched. You sit there dripping, look at each other and laugh at the same moment.')] },
        { id: 'stay', labelZh: '留在大水槽前面', labelEn: 'Stay at the great tank', jp: 'もうちょっとここにいよう。', hintZh: '人都走了，这里会很安静', hintEn: 'Everyone will leave; it will be quiet',
          aff: 5, fam: 3, stat: 'kindness', mood: 'shy',
          then: [T('人都去看表演了，大水槽前面只剩下你们俩和几千条沙丁鱼。蓝色的光在{her}脸上一晃一晃的。远处传来掌声，听上去像下雨。', 'Everybody has gone to the show. In front of the great tank there is only the two of you and several thousand sardines. Blue light ripples across {her} face. Far off there is applause, which sounds like rain.')] },
        { id: 'read', labelZh: '一块一块读说明牌', labelEn: 'Read every information panel', hintZh: '日语练习', hintEn: 'Japanese practice',
          aff: 3, fam: 4, stat: 'knowledge', mood: 'neutral', words: [{ jp: '群れ', reading: 'むれ', zh: '（鱼、鸟）群', en: 'school, flock' }],
          then: [T('你一个字一个字地读，读到不认识的汉字就停下来。{her}一开始只是在旁边等，后来开始替你念，念到最后，你们俩变成了一个人读、一个人解释，后面排了一小队听讲解的小学生。', 'You read word by word, stopping at every kanji you do not know. At first {her} just waits. Then she starts reading them out for you, and by the end one of you reads and the other explains, and a small line of primary schoolers has formed behind you to listen.')] }
      ]
    }
  },
  {
    id: 'shrine', icon: '⛩️', scene: 'ikuta_shrine', bgm: 'reflective',
    nameJp: '生田神社', nameZh: '去生田神社参拜', nameEn: 'A visit to Ikuta Shrine',
    blurbZh: '三宫正中间的一片森林。正月里全是穿和服的人。', blurbEn: 'A forest in the middle of Sannomiya. At New Year, full of kimono.',
    mood: 2, minFam: 2, tag: 'culture', occasion: cal => isNewYear(cal) ? 'newyear' : 'shrine',
    slots: ['lunch', 'afternoon'], when: cal => !(cal.month === 7 || cal.month === 8) || cal.timeSlot !== 'night', stat: 'knowledge',
    arrive: T(
      '从三宫的十字路口拐进去，走不了几步，车声就被一排朱红色的鸟居挡在了外面。你一直觉得这件事有点不可思议：一座城市的正中间，有人留了一块地方，什么都不建，只种树。',
      'Turn in from the Sannomiya crossing and within a few steps a row of vermilion gates shuts out the traffic. You have always found this slightly miraculous: right in the middle of a city, somebody kept a piece of ground and built nothing on it but trees.'),
    beats: [
      T('{her}在手水舍前面停下来，先洗左手，再洗右手，再用左手接一点水漱口。每一步都做得很规矩。你跟着学，学到漱口那一步的时候不小心咽了下去。',
        '{her} stops at the water basin and washes her left hand, then her right, then cups a little water in her left to rinse her mouth. Every step done properly. You copy her and at the rinsing step accidentally swallow.'),
      T('投了五日元的香钱，两次鞠躬，两次拍手。你闭着眼睛，想了一下要许什么愿，想了很久，久到睁开眼睛的时候，{her}已经在旁边等你了。',
        'Five yen in the offering box, two bows, two claps. You close your eyes and think about what to wish for, for so long that when you open them {her} is already waiting beside you.')
    ],
    choice: {
      prompt: T('社务所在卖签。一百日元一张。', 'The shrine office is selling fortunes. A hundred yen each.'),
      options: [
        { id: 'omikuji', labelZh: '两个人各抽一张签', labelEn: 'Draw a fortune each', jp: 'おみくじ、引こうよ。', hintZh: '看运气', hintEn: 'Leave it to luck',
          aff: 4, fam: 4, stat: 'charm', mood: 'surprised', words: [{ jp: 'おみくじ', zh: '神签', en: 'fortune slip' }],
          then: [T('你抽到"末吉"，她抽到"大吉"。她看了看你的签，把自己的签折起来，系在了你那张旁边的绳子上。"分けてあげる"，她说，好像运气是可以这样分的。也许真的可以。', 'You draw "small luck to come". She draws "great luck". She looks at yours, folds hers and ties it to the rope right next to yours. I will share it, she says, as if luck can be shared like that. Perhaps it can.')] },
        { id: 'ema', labelZh: '一起写一块绘马', labelEn: 'Write a votive tablet together', hintZh: '要写什么呢', hintEn: 'What to write?',
          aff: 6, fam: 2, stat: 'guts', mood: 'shy', words: [{ jp: '絵馬', reading: 'えま', zh: '绘马（许愿木牌）', en: 'wooden votive tablet' }],
          then: [T('你写了"日本語がうまくなりますように"。她写了什么，你没看到，她写完就翻过来挂上去了，挂在一大片别人的愿望中间，很快就分不出是哪一块了。', 'You write: may my Japanese improve. You do not see what she writes. She turns it face down as soon as she has finished and hangs it among a great crowd of other people\'s wishes, and soon you cannot tell which one is hers.')] },
        { id: 'forest', labelZh: '去后面的森林走走', labelEn: 'Walk into the forest behind', hintZh: '城市正中间的一片林子', hintEn: 'A wood in the heart of the city',
          aff: 4, fam: 4, stat: 'kindness', mood: 'neutral',
          then: [T('生田之森很小，走一圈用不了十分钟。可是走在里面，三宫好像离得很远。{her}说这片林子以前比现在大得多。你问她怎么知道，她说书上写的。', 'The Ikuta forest is small; you can walk round it in ten minutes. But inside it Sannomiya seems far away. {her} says the wood used to be much larger. You ask how she knows and she says she read it somewhere.')] }
      ]
    }
  },

  // ================= mood 3 =================
  {
    id: 'beach', icon: '🏖️', scene: 'suma_beach', bgm: 'harbor',
    nameJp: '須磨海岸', nameZh: '须磨海滩', nameEn: 'Suma beach',
    blurbZh: '夏天是泳衣和海之家，冬天是空荡荡的沙滩和明石海峡大桥。', blurbEn: 'In summer, swimsuits and beach huts. In winter, an empty shore and the Akashi bridge.',
    mood: 3, minFam: 3, tag: 'scenery', occasion: cal => summer(cal) ? 'swim' : 'casual',
    slots: ['lunch', 'afternoon'], outdoor: true, stat: 'guts', stamina: 24,
    arrive: T(
      '从须磨站出来，海就在那儿，近得有点不讲道理——像是车站本来就是为了把人直接倒进海里才建的。沙子被太阳晒得发白，踩上去会往下陷一点，然后把脚轻轻地托住。',
      'Out of Suma station the sea is right there, almost unreasonably close, as though the station was built to tip people straight into it. The sand is bleached by the sun and gives a little underfoot, then holds you up gently.'),
    beats: [
      T('远处是明石海峡大桥，白色的，很长，长得像是有人用一把尺子在海上画了一条线，然后忘了擦掉。',
        'In the distance the Akashi Kaikyō bridge, white and very long, as if somebody had ruled a line across the sea and forgotten to rub it out.'),
      T('{her}把鞋脱了，拎在手里，往水边走。浪涌上来，漫过她的脚背，又退回去，带走了一点沙子。她低头看着自己的脚，像是在确认它们还在。',
        '{her} takes off her shoes and carries them towards the water. A wave comes up over her feet and slides back, taking a little sand with it. She looks down at her feet as if checking they are still there.')
    ],
    choice: {
      prompt: T('浪又来了一次，比刚才的大。', 'Another wave, bigger than the last.'),
      options: [
        { id: 'splash', labelZh: '往她那边泼水', labelEn: 'Splash her', hintZh: '开战', hintEn: 'Declare war',
          aff: 4, fam: 5, stat: 'guts', mood: 'surprised', words: [{ jp: 'やったな', zh: '你敢！（被捉弄后的反击）', en: 'you asked for it' }],
          then: [T('{her}愣了一秒，说"やったな"，然后反击。五分钟以后两个人都湿透了，躺在沙滩上喘气，天很蓝，蓝得像什么都没发生过。', '{her} freezes for a second, says you asked for it, and retaliates. Five minutes later you are both soaked, lying on the sand catching your breath under a sky so blue it is as if nothing happened.')] },
        { id: 'shells', labelZh: '陪她一起捡贝壳', labelEn: 'Collect shells with her', hintZh: '慢慢沿着水边走', hintEn: 'Walk slowly along the waterline',
          aff: 5, fam: 3, stat: 'kindness', mood: 'happy', words: [{ jp: '貝殻', reading: 'かいがら', zh: '贝壳', en: 'seashell' }],
          then: [T('捡了一小把，大多是碎的。{her}挑了一片最完整的、粉色的，放进你的手心里，说这个给你，"失くしたら怒るから"。', 'You gather a small handful, mostly broken. {her} picks out the most complete one, a pink one, and puts it in your palm. This is yours, she says. Lose it and I will be cross.')] },
        { id: 'sit', labelZh: '坐在沙滩上看大桥', labelEn: 'Sit on the sand and watch the bridge', hintZh: '什么都不做', hintEn: 'Do nothing at all',
          aff: 4, fam: 4, stat: 'charm', mood: 'neutral',
          then: [T('你们坐了很久，久到太阳往西边挪了一大截。大桥上的灯亮了，一颗一颗，像有人在海上串一串珠子。{her}说她以前从来没有这样坐过这么久。', 'You sit a long time, long enough for the sun to move a good way west. The lights on the bridge come on one by one, as if somebody were threading beads across the sea. {her} says she has never sat this long anywhere before.')] }
      ]
    }
  },
  {
    id: 'summer_festival', icon: '🏮', scene: 'ikuta_summer_festival', bgm: 'festival',
    nameJp: '夏祭り', nameZh: '生田神社的夏祭', nameEn: 'The Ikuta summer festival',
    blurbZh: '捞金鱼、苹果糖、刨冰。浴衣和团扇。', blurbEn: 'Goldfish scooping, candied apples, shaved ice. Yukata and paper fans.',
    mood: 3, minFam: 2, tag: 'night', occasion: () => 'yukata',
    slots: ['afternoon', 'night'], when: cal => cal.month === 7 || cal.month === 8, stat: 'charm', yen: 800,
    arrive: T(
      '参道两边一路排着屋台，灯笼一盏挨一盏，把夜里照成了一种暖洋洋的橙色。空气里是炒面、烤玉米和蚊香混在一起的味道——你后来发现，那就是日本夏天的味道。',
      'Stalls line both sides of the approach and the lanterns, one after another, turn the night a warm orange. The air is fried noodles and grilled corn and mosquito coils all at once. Later you will realise that this is what a Japanese summer smells like.'),
    beats: [
      T('人很多，多到你必须一直盯着{her}的后脑勺才不会走散。木屐踩在石板上的声音此起彼伏，像一场不太守拍子的合奏。',
        'It is crowded, so crowded you have to keep your eyes on the back of {her} head not to lose her. Geta clatter on the paving stones all around, an ensemble that cannot quite keep time.'),
      T('捞金鱼的摊子前面，她蹲下来，挽起袖子，盯着水盆里那几十条红色的小鱼，表情认真得像是在参加考试。',
        'At the goldfish stall she crouches down, rolls back her sleeve and stares into the tub of little red fish with an expression as serious as an exam.')
    ],
    choice: {
      prompt: T('人群突然往一个方向涌过去。花火要开始了。', 'The crowd surges suddenly in one direction. The fireworks are starting.'),
      options: [
        { id: 'hand', labelZh: '「はぐれないように。」牵住她的手', labelEn: '"So we do not get separated." Take her hand.', jp: 'はぐれないように。', hintZh: '理由很充分', hintEn: 'A perfectly good reason',
          aff: 7, fam: 1, stat: 'guts', mood: 'shy', words: [{ jp: 'はぐれる', zh: '走散', en: 'to get separated' }],
          then: [T('她的手比你想的凉。第一发花火炸开的时候，你感觉到那只手轻轻地握紧了一下，然后就一直没有松开，一直到最后一发。', 'Her hand is cooler than you expected. When the first firework bursts you feel it tighten a little, and it does not let go again until the last.')] },
        { id: 'spot', labelZh: '带她去人少的石阶上看', labelEn: 'Take her to the quiet stone steps', hintZh: '看得没那么清楚，但安静', hintEn: 'A worse view, but quiet',
          aff: 5, fam: 3, stat: 'kindness', mood: 'happy',
          then: [T('石阶上只有你们和一只猫。花火被树挡住了一半，另一半照亮了{her}的侧脸，红的，绿的，金的。你后来想不起来那天的花火是什么样子，只记得那半张脸。', 'On the steps there is only the two of you and a cat. The trees hide half the fireworks; the other half lights up the side of {her} face, red, green, gold. Later you will not remember what the fireworks looked like, only that half of a face.')] },
        { id: 'goldfish', labelZh: '先把金鱼捞完', labelEn: 'Finish the goldfish first', hintZh: '纸网还没破', hintEn: 'The paper scoop has not torn yet',
          aff: 3, fam: 5, stat: 'proficiency', mood: 'happy', words: [{ jp: '金魚すくい', reading: 'きんぎょすくい', zh: '捞金鱼', en: 'goldfish scooping' }],
          then: [T('你捞到了一条。很小，尾巴是黑的。摊主把它装进一个灌了水的塑料袋里递给你，你转手递给了她。花火在你们头上炸开，袋子里那条鱼被映得一会儿红一会儿绿。', 'You catch one, a tiny one with a black tail. The stallholder bags it in water and hands it over and you pass it straight to her. Fireworks burst overhead and the fish in its bag turns red, then green, then red.')] }
      ]
    }
  },
  {
    id: 'settlement', icon: '🫖', scene: 'former_settlement_15_salon', bgm: 'reflective',
    nameJp: '旧居留地十五番館', nameZh: '旧居留地的下午茶', nameEn: 'Afternoon tea in the Old Settlement',
    blurbZh: '一百五十年前的洋馆，三层的点心架，一壶红茶。', blurbEn: 'A Western house a century and a half old, a three-tier stand, a pot of tea.',
    mood: 3, minFam: 3, tag: 'formal', occasion: () => 'formal',
    slots: ['lunch', 'afternoon'], yen: 2400, stat: 'charm',
    arrive: T(
      '十五番馆是神户开港时外国领事馆留下来的房子，砖墙，木窗框，屋檐下一排小小的雕花。推门进去，地板会响，响得很有分寸，像一个上了年纪的管家在清嗓子。',
      'No. 15 was a consulate when Kobe opened its port: brick walls, wooden window frames, a row of small carvings under the eaves. When you push the door the floor creaks, discreetly, like an elderly butler clearing his throat.'),
    beats: [
      T('三层的点心架端上来：最下面是三明治，中间是司康，最上面是小蛋糕。{her}说要从下往上吃，这是规矩。你问是谁定的规矩，她说是英国人。',
        'The three-tier stand arrives: sandwiches at the bottom, scones in the middle, little cakes on top. {her} says you eat from the bottom up; it is the rule. You ask whose rule. The English, she says.'),
      T('红茶是用一只很重的银壶倒的。倒的时候茶水拉出一条细细的、琥珀色的线，落进杯子里一点声音都没有。',
        'The tea is poured from a heavy silver pot. It falls in a fine amber thread and lands in the cup without a sound.')
    ],
    choice: {
      prompt: T('司康要配果酱和奶油。先抹哪个，据说会吵起来。', 'Scones come with jam and cream. Which goes on first is, apparently, a matter for argument.'),
      options: [
        { id: 'jam', labelZh: '先果酱', labelEn: 'Jam first', hintZh: '康沃尔派', hintEn: 'The Cornish way',
          aff: 4, fam: 4, stat: 'knowledge', mood: 'tease',
          then: [T('{her}先抹奶油。你们看着对方的司康，像两个不同国家的外交官。最后她说"今日は休戦"，把自己那块分了一半给你。', '{her} puts the cream on first. You regard each other\'s scones like diplomats from rival nations. Finally she says, a truce for today, and gives you half of hers.')] },
        { id: 'cream', labelZh: '先奶油', labelEn: 'Cream first', hintZh: '德文派', hintEn: 'The Devon way',
          aff: 4, fam: 4, stat: 'charm', mood: 'happy',
          then: [T('{her}也是先奶油。你们俩同时发现了这件事，同时停了一下，然后像是确认了什么重要的事情一样，各自点了点头。', '{her} does cream first as well. You both notice at the same time, both pause, and then each nod as though something important has been confirmed.')] },
        { id: 'pour', labelZh: '替她续茶', labelEn: 'Refill her cup', jp: 'お注ぎしましょうか。', hintZh: '银壶很重', hintEn: 'The silver pot is heavy',
          aff: 6, fam: 2, stat: 'kindness', mood: 'shy', words: [{ jp: '注ぐ', reading: 'つぐ', zh: '倒（茶、酒）', en: 'to pour' }],
          then: [T('壶比你想的重，你的手腕抖了一下，可茶还是一滴没洒地落进了她的杯子。{her}说你倒茶的样子像个管家。你决定把这当成夸奖。', 'The pot is heavier than you expected and your wrist wobbles, but not a drop misses her cup. {her} says you pour like a butler. You decide to take this as a compliment.')] }
      ]
    }
  },
  {
    id: 'jazz', icon: '🎷', scene: 'jazz_livehouse', bgm: 'night',
    nameJp: 'ジャズライブ', nameZh: '北野的爵士现场', nameEn: 'Live jazz in Kitano',
    blurbZh: '地下室，二十个座位，学生票一千五。', blurbEn: 'A basement, twenty seats, fifteen hundred yen for students.',
    mood: 3, minFam: 3, tag: 'formal', occasion: () => 'formal',
    slots: ['night'], yen: 3000, stat: 'charm',
    arrive: T(
      '爵士俱乐部在一栋老洋楼的地下，楼梯很窄，墙上贴满了几十年来在这儿演出过的人的照片，越往下照片越旧，走到底的时候，照片已经是黑白的了。',
      'The jazz club is in the basement of an old Western-style building. The stairs are narrow and the walls are covered with photographs of everyone who has played there over the decades, older the further down you go, until at the bottom they are black and white.'),
    beats: [
      T('二十个座位，坐了十几个人，大多是上了年纪的、一个人来的客人。你们俩是全场最年轻的，年轻得有点显眼。{her}挺直了背，好像这样就能老几岁。',
        'Twenty seats and a dozen or so taken, mostly older people who have come alone. The two of you are by far the youngest, conspicuously so. {her} straightens her back, as if that might age her a few years.'),
      T('萨克斯响起来的时候，你感觉到那声音不是从前面传过来的，而是从地板底下、从椅子腿里、从你自己的胸口里一起冒出来的。',
        'When the saxophone starts you feel the sound arrive not from the stage but up through the floor, through the legs of the chair, out of your own chest.')
    ],
    choice: {
      prompt: T('中场休息。{her}问你，刚才那首叫什么。', 'The interval. {her} asks what that last number was called.'),
      options: [
        { id: 'honest', labelZh: '「わからない。でも好きだった。」', labelEn: '"I do not know. But I liked it."', jp: 'わからない。でも、好きだった。', hintZh: '老实说', hintEn: 'Be honest',
          aff: 5, fam: 3, stat: 'kindness', mood: 'happy',
          then: [T('{her}笑了，说她也不知道。坐在旁边的一位老先生转过头来，告诉你们那首叫《My Foolish Heart》。你们俩谢过他，然后在桌子底下偷偷查了那个词是什么意思。', '{her} laughs and says she does not know either. An old gentleman at the next table turns and tells you it was "My Foolish Heart". You thank him, then secretly look up what "foolish" means under the table.')] },
        { id: 'guess', labelZh: '随便编一个名字', labelEn: 'Make up a title', hintZh: '反正她也不知道', hintEn: 'She will not know anyway',
          aff: 3, fam: 5, stat: 'charm', mood: 'tease',
          then: [T('你说那首叫《三宫的雨》。{her}认真地点了点头，说难怪，难怪听着像下雨。后半场每一首，她都让你起一个名字。', 'You say it was called "Rain on Sannomiya". {her} nods seriously and says that explains it, it did sound like rain. For every number in the second half she makes you give it a name.')] },
        { id: 'drink', labelZh: '去吧台给她点一杯无酒精的', labelEn: 'Get her something non-alcoholic from the bar', hintZh: '酒保会看你的学生证', hintEn: 'The barman will check your student card',
          aff: 6, fam: 2, stat: 'guts', mood: 'shy', words: [{ jp: 'ノンアルコール', zh: '无酒精', en: 'non-alcoholic' }],
          then: [T('酒保看了看你，又看了看坐在那边的她，什么也没问，调了两杯蓝色的东西，杯沿插着一片柠檬。她接过去的时候说"大人っぽい"，然后喝了一口，被柠檬酸得眯起了眼睛。', 'The barman looks at you, then at her, asks nothing and mixes two blue things with a slice of lemon on the rim. When she takes hers she says how grown-up, sips it, and screws up her eyes at the lemon.')] }
      ]
    }
  },
  {
    id: 'cook', icon: '🍳', scene: 'umikaze_room_kitchen', bgm: 'lobby',
    nameJp: 'うちでごはん', nameZh: '来我家一起做饭', nameEn: 'Cooking together at yours',
    blurbZh: '海风庄那间小厨房。两个人站着就满了。', blurbEn: 'The tiny kitchen at Umikaze-so. Two people fill it.',
    mood: 3, minFam: 3, tag: 'home', occasion: () => 'home',
    slots: ['afternoon', 'night'], yen: 800, stat: 'proficiency',
    arrive: T(
      '回海风庄的路上，你们在超市买了菜：一盒鸡蛋、一把葱、一块豆腐、一小包肉。{her}拎着袋子，一直在算钱，算到最后比收银机还早一秒说出了总价。',
      'On the way back to Umikaze-so you stop at the supermarket for eggs, spring onions, a block of tofu, a small pack of meat. {her} carries the bag and keeps a running total, and in the end announces the price a second before the till does.'),
    beats: [
      T('你的厨房小得只能站一个人，两个人站进去就得侧着身。{her}环顾了一圈，说"思ったより片付いてる"——你决定不告诉她，你昨天晚上为了这句话收拾到了一点。',
        'Your kitchen is built for one; two have to stand sideways. {her} looks round and says it is tidier than she expected. You decide not to tell her you were up until one last night making sure she would say that.'),
      T('锅里的油开始响的时候，你们俩同时伸手去拿锅铲，手背碰了一下。两个人都缩了回去，锅铲留在原地，油继续响。',
        'When the oil starts to spit you both reach for the spatula and your knuckles brush. Both of you pull back. The spatula stays where it is. The oil keeps spitting.')
    ],
    choice: {
      prompt: T('做什么呢。', 'What are you making?'),
      options: [
        { id: 'oyako', labelZh: '亲子丼', labelEn: 'Oyakodon', jp: '親子丼にしよう。', hintZh: '鸡肉和鸡蛋，名字有点残忍', hintEn: 'Chicken and egg. A slightly cruel name',
          aff: 4, fam: 4, stat: 'proficiency', mood: 'happy', words: [{ jp: '親子丼', reading: 'おやこどん', zh: '亲子丼（鸡肉鸡蛋盖饭）', en: 'chicken and egg rice bowl' }],
          then: [T('蛋液倒下去的时候，她说"今！"，你关了火。蛋是半熟的，滑的，像一块软软的云盖在饭上。你们站在灶台边上就吃了，没来得及坐下。', 'As the egg goes in she says now! and you turn off the heat. It is just set, soft, a cloud lying on the rice. You eat it standing at the stove before either of you thinks to sit down.')] },
        { id: 'curry', labelZh: '咖喱', labelEn: 'Curry', hintZh: '做多了可以明天再吃', hintEn: 'Make too much and there is tomorrow\'s',
          aff: 3, fam: 5, stat: 'kindness', mood: 'neutral', words: [{ jp: '一晩寝かせる', reading: 'ひとばんねかせる', zh: '放一晚上（让味道更好）', en: 'to leave overnight' }],
          then: [T('咖喱做了一大锅，够吃三天。{her}说第二天的咖喱比第一天好吃，"一晩寝かせると"。你问那她明天还来吗。她没回答，只是把锅盖盖好了。', 'You make a huge pot of curry, three days\' worth. {her} says it tastes better on the second day, once it has rested overnight. You ask whether she will come back tomorrow, then. She does not answer, only settles the lid on the pot.')] },
        { id: 'her_dish', labelZh: '「得意料理、教えて。」让她教你她的拿手菜', labelEn: '"Teach me your best dish."', jp: '得意料理、教えて。', hintZh: '交给她', hintEn: 'Leave it to her',
          aff: 6, fam: 2, stat: 'proficiency', mood: 'shy', words: [{ jp: '得意料理', reading: 'とくいりょうり', zh: '拿手菜', en: 'signature dish' }],
          then: [T('{her}犹豫了一下，然后挽起了袖子。她教得很慢，每一步都要你先做一遍给她看。做完了，她尝了一口你做的那份，说"……合格"，声音很小。', '{her} hesitates, then rolls up her sleeves. She teaches slowly, making you do each step yourself first. When it is done she tastes yours and says, quietly, ...pass.')] }
      ]
    }
  },
  {
    id: 'movienight', icon: '🎬', scene: 'apartment_room_night', bgm: 'night',
    nameJp: '映画の夜', nameZh: '来我房间看电影', nameEn: 'A film at your place',
    blurbZh: '一台旧笔记本，一袋薯片，一条毯子。', blurbEn: 'An old laptop, a bag of crisps, one blanket.',
    mood: 3, minFam: 4, tag: 'home', occasion: () => 'sleepover',
    slots: ['night'], stat: 'kindness', stamina: 6,
    arrive: T(
      '你把笔记本架在一摞教科书上，调了半天角度，让屏幕不反光。薯片倒进一只碗里，又觉得太刻意，倒回了袋子里。门铃响的时候，你刚好把它们又倒回碗里。',
      'You prop the laptop on a stack of textbooks and spend ages adjusting the angle so the screen does not glare. You tip the crisps into a bowl, decide that looks too deliberate, tip them back into the bag. When the doorbell goes you have just tipped them into the bowl again.'),
    beats: [
      T('房间里只有一条毯子。这件事你直到{her}坐下来的时候才意识到。',
        'There is only one blanket in the room. You do not realise this until {her} sits down.'),
      T('电影是一部很老的片子，讲一个人在一座海边小镇上等一封信。画面很暗，台词很少，你看到一半开始担心选错了。可是{her}看得很认真，认真到薯片都忘了吃。',
        'The film is very old, about somebody in a seaside town waiting for a letter. It is dark and there is very little dialogue and halfway through you start worrying you chose badly. But {her} is watching intently, so intently she has forgotten the crisps.')
    ],
    choice: {
      prompt: T('电影进行到三分之二，她的头开始一点一点地往下沉。', 'Two-thirds of the way through, her head begins to dip.'),
      options: [
        { id: 'blanket', labelZh: '把毯子都给她盖上', labelEn: 'Put the whole blanket over her', hintZh: '你自己就冷着吧', hintEn: 'You can be cold',
          aff: 6, fam: 3, stat: 'kindness', mood: 'shy', words: [{ jp: '毛布', reading: 'もうふ', zh: '毯子', en: 'blanket' }],
          then: [T('她没睡着。毯子盖上去的时候她睁开了一只眼睛，看了你一下，然后把毯子的一角掀起来，往你这边推了推。最后半个小时，你们俩是在同一条毯子底下看完的。', 'She is not asleep. When the blanket goes over her she opens one eye, looks at you, then lifts one corner and pushes it your way. You watch the last half hour under the same blanket.')] },
        { id: 'wake', labelZh: '轻轻叫醒她：「最後まで観よう」', labelEn: 'Wake her gently: "Let us see the end."', jp: '最後まで観よう。', hintZh: '结局很好', hintEn: 'The ending is good',
          aff: 4, fam: 4, stat: 'guts', mood: 'surprised',
          then: [T('{her}一下子坐直了，说她没睡，只是在用耳朵看。结局那封信终于到了，信里只写了一句话。看完了，你们俩都没说话，片尾字幕滚了很久。', '{her} sits bolt upright and says she was not asleep, she was watching with her ears. At the end the letter finally comes, with one line in it. Afterwards neither of you speaks, and the credits roll for a long time.')] },
        { id: 'pause', labelZh: '按下暂停，去泡两杯热可可', labelEn: 'Pause it and make two cocoas', hintZh: '中场休息', hintEn: 'An interval',
          aff: 4, fam: 4, stat: 'proficiency', mood: 'happy',
          then: [T('你从厨房回来的时候，她已经醒透了，正在看暂停画面里那个人的脸。你们捧着热可可聊了半天那个人到底在等谁，聊完了，电影还没继续放。', 'By the time you come back from the kitchen she is wide awake, studying the face of the man on the paused screen. You drink your cocoa and argue for ages about who he is waiting for, and when you have finished the film has still not been restarted.')] }
      ]
    }
  },

  // ================= mood 4 =================
  {
    id: 'nightview', icon: '🌃', scene: 'rokko_kikuseidai_night_view', bgm: 'late_night',
    nameJp: '掬星台', nameZh: '摩耶山掬星台的夜景', nameEn: 'The night view from Kikuseidai',
    blurbZh: '千万美元的夜景。缆车上去，"掬星"是把星星捧在手里的意思。', blurbEn: 'The ten-million-dollar view. Up by ropeway; the name means scooping stars in your hands.',
    mood: 4, minFam: 3, tag: 'night', occasion: () => 'casual',
    slots: ['night'], outdoor: true, yen: 1600, stat: 'charm', stamina: 26,
    arrive: T(
      '缆车一点一点往山上爬，脚底下的神户慢慢变小，灯慢慢变多。到了山顶，风很冷，冷得有点干净，像是刚从冰箱里拿出来的空气。',
      'The ropeway creeps up the mountain and Kobe shrinks beneath your feet as the lights multiply. At the top the wind is cold, a clean kind of cold, like air just taken out of the fridge.'),
    beats: [
      T('掬星台的观景台上，整座城市铺在你们面前：港口、高楼、一条一条亮着的街道，一直铺到海边，然后突然断掉，变成一片什么都没有的黑——那是海。',
        'From the Kikuseidai platform the whole city is laid out before you: the port, the towers, street after lit street running down to the shore, where it stops abruptly and becomes a black with nothing in it. That is the sea.'),
      T('{her}把手伸出栏杆，五指张开，然后合拢，像是想把下面的灯捧起来一捧。她说"掬星"就是这个意思。你说你知道，你查过。她说那你为什么不做。',
        '{her} reaches out over the railing with her fingers spread, then closes them, as if trying to scoop up a handful of the lights below. That is what Kikusei means, she says. You say you know, you looked it up. She asks why you are not doing it, then.')
    ],
    choice: {
      prompt: T('风更大了。她把手缩回袖子里。', 'The wind picks up. She pulls her hands back into her sleeves.'),
      options: [
        { id: 'scoop', labelZh: '也把手伸出去，捧一捧星星', labelEn: 'Reach out and scoop the stars too', jp: '掬えた。', hintZh: '做一件傻事', hintEn: 'Do a silly thing',
          aff: 5, fam: 4, stat: 'charm', mood: 'happy', words: [{ jp: '掬う', reading: 'すくう', zh: '（用双手）捧起、舀起', en: 'to scoop up with the hands' }],
          then: [T('你把手伸出去，合拢，然后很郑重地把那一捧什么都没有的东西放进了她的手心。{her}低头看着自己空空的手心，看了很久，然后把手握成了拳头，像是怕它们跑掉。', 'You reach out, close your hands, and very solemnly tip the handful of nothing into her palm. {her} looks down at her empty hand for a long time, then closes it into a fist, as if afraid they might escape.')] },
        { id: 'coat', labelZh: '把外套披到她肩上', labelEn: 'Put your jacket round her shoulders', hintZh: '你会冷', hintEn: 'You will be cold',
          aff: 7, fam: 1, stat: 'kindness', mood: 'shy',
          then: [T('外套对她来说有点大，袖子空空地垂下来。她没说谢谢，只是把领子往上拉了拉，把半张脸埋了进去。你冷得发抖，觉得很值。', 'The jacket is too big for her and the sleeves hang empty. She does not say thank you; she only pulls the collar up and buries half her face in it. You shiver, and think it was worth it.')] },
        { id: 'say', labelZh: '「来年も、ここに来たい。」', labelEn: '"I want to come back here next year."', jp: '来年も、ここに来たい。', hintZh: '你三月就要回去了', hintEn: 'You go home in March',
          aff: 6, fam: 3, stat: 'guts', mood: 'sad', words: [{ jp: '来年', reading: 'らいねん', zh: '明年', en: 'next year' }],
          then: [T('{her}没有马上回答。下面的城市在闪，一闪一闪的，像是在替她想答案。过了很久，她说"……じゃあ、約束ね"。你们俩都知道这个约定有多难，所以谁都没有再说什么。', '{her} does not answer at once. The city below flickers as if thinking it over on her behalf. After a long while she says ...a promise, then. You both know how hard a promise it is, so neither of you says anything more.')] }
      ]
    }
  },
  {
    id: 'onsen', icon: '♨️', scene: 'arima_onsen_street_slope', endScene: 'arima_onsen_kin_no_yu', bgm: 'reflective',
    nameJp: '有馬温泉', nameZh: '有马温泉的温泉街', nameEn: 'The hot-spring streets of Arima',
    blurbZh: '日本最古老的温泉之一。金汤是铁锈色的。', blurbEn: 'One of Japan\'s oldest hot springs. The "gold" water is the colour of rust.',
    mood: 4, minFam: 4, tag: 'scenery', occasion: () => 'onsen',
    slots: ['lunch', 'afternoon'], yen: 1800, timeCost: 2, stat: 'kindness', stamina: -10,
    arrive: T(
      '从三宫坐了半个多小时的车，下车的时候空气里有一股淡淡的铁的味道。有马的坡很陡，石板路两边是一间挨一间的老铺子，卖炭酸煎饼、卖竹篮、卖一种你叫不出名字的、看起来很贵的木雕。',
      'Half an hour and more from Sannomiya, and when you step off there is a faint taste of iron in the air. The slopes of Arima are steep, the stone lanes lined shop after old shop: tansan crackers, bamboo baskets, expensive-looking carvings you have no name for.'),
    beats: [
      T('{her}在旅馆租了一件浴衣，出来的时候还在跟腰带较劲。你们沿着坡往上走，木屐在石板上嗒嗒地响，一阶一阶的，像是在数台阶。',
        '{her} has hired a yukata from one of the inns and comes out still wrestling with the sash. You walk up the slope together, her geta clacking on the stones, one step at a time as if counting them.'),
      T('金汤真的是铁锈色的，混得看不见底。你们泡了足汤，两个人坐在一排，八只——不，四只脚泡在同一个池子里。热气一直往上冒，冒到你们脸上，把两个人都蒸得有点红。',
        'The gold water really is the colour of rust, too cloudy to see the bottom. You sit side by side at the footbath with your four feet in the same pool. The steam keeps rising into your faces and turns you both a little pink.')
    ],
    choice: {
      prompt: T('回去的末班巴士还有一个小时。', 'An hour until the last bus back.'),
      options: [
        { id: 'senbei', labelZh: '买刚烤好的炭酸煎饼', labelEn: 'Buy freshly baked tansan crackers', hintZh: '薄得能透光', hintEn: 'Thin enough to see light through',
          aff: 4, fam: 4, stat: 'charm', mood: 'happy', words: [{ jp: '焼きたて', reading: 'やきたて', zh: '刚烤好的', en: 'freshly baked' }],
          then: [T('煎饼刚出炉，薄得能透光，一咬就碎，碎得到处都是。{her}笑你吃得一身渣，然后她自己咬了一口，渣掉得比你还多。', 'The crackers come straight off the iron, thin enough to see light through, and shatter at the first bite. {her} laughs at the crumbs all down your front, then takes a bite herself and drops even more.')] },
        { id: 'stairs', labelZh: '爬到坡顶看温泉街的灯', labelEn: 'Climb to the top to see the lanterns', hintZh: '坡很陡', hintEn: 'The slope is steep',
          aff: 6, fam: 2, stat: 'guts', mood: 'shy',
          then: [T('爬到一半，{her}穿着木屐踩空了一下，你伸手扶住了她。到了坡顶，温泉街的灯笼一路亮下去，你才发现你一直没有松手，她也没有。', 'Halfway up, {her} misses her footing in the geta and you catch her arm. At the top, with the lanterns of the hot-spring street glowing all the way down, you realise you have not let go, and neither has she.')] },
        { id: 'rest', labelZh: '就在足汤边上多坐一会儿', labelEn: 'Stay a while longer at the footbath', jp: 'もうちょっとだけ。', hintZh: '不急', hintEn: 'No hurry',
          aff: 5, fam: 3, stat: 'kindness', mood: 'neutral',
          then: [T('你们又坐了一会儿。{her}说泡温泉的时候，人会说真话。你问那她要说什么。她想了很久，说"……今日、来てよかった"。你说这不算真话，这谁都看得出来。她把一捧水泼在了你的脚上。', 'You stay a while. {her} says people tell the truth in hot springs. You ask what she will tell, then. She thinks for a long time and says ...I am glad I came today. You say that does not count, anyone could see that. She splashes a handful of water over your feet.')] }
      ]
    }
  },
  {
    id: 'luminarie', icon: '✨', scene: 'luminarie', bgm: 'night',
    nameJp: 'ルミナリエ', nameZh: '神户光之祭典', nameEn: 'Kobe Luminarie',
    blurbZh: '为了震灾而点亮的灯。一年只有十天。', blurbEn: 'Lights first lit in memory of the earthquake. Ten days a year.',
    mood: 4, minFam: 3, tag: 'night', occasion: () => 'casual',
    slots: ['night'], when: isLuminarieSeason, stat: 'kindness',
    arrive: T(
      '队伍从元町一直排到旧居留地，所有人都在慢慢地往前挪，没有人着急。这些灯第一次点亮，是在大地震那一年的冬天。你知道这件事，所以走在队伍里的时候，你说话的声音也不自觉地放轻了。',
      'The queue runs all the way from Motomachi to the Old Settlement and everybody shuffles forward slowly, nobody in a hurry. These lights were first lit in the winter after the great earthquake. You know that, and walking in the line you find yourself speaking more quietly.'),
    beats: [
      T('拐过最后一个街角，光一下子铺满了整条街。几十万颗灯泡拼成一道一道的拱门，一直延伸到你看不见的地方。人群里有人轻轻地"あ"了一声，然后是另一个人，然后是很多人。',
        'Round the last corner the light floods the entire street. Hundreds of thousands of bulbs in arch after arch, running further than you can see. Somebody in the crowd lets out a soft "ah", then somebody else, then many people.'),
      T('{her}在光底下停下来，仰着头。光落在她的脸上，落在她的睫毛上，你从来没见过一个人被这么多光同时照着。',
        '{her} stops beneath it all with her head tipped back. The light falls on her face, on her eyelashes. You have never seen anyone lit by so much light at once.')
    ],
    choice: {
      prompt: T('出口那边有一个募捐箱，旁边有人在放鸽子形状的纸灯。', 'By the exit there is a donation box, and people are setting out paper lanterns shaped like doves.'),
      options: [
        { id: 'donate', labelZh: '两个人一起投一点钱', labelEn: 'Make a donation together', hintZh: '这些灯是这么点亮的', hintEn: 'This is how the lights stay lit',
          aff: 4, fam: 4, stat: 'kindness', mood: 'neutral', words: [{ jp: '募金', reading: 'ぼきん', zh: '募捐', en: 'fundraising donation' }],
          then: [T('{her}投了一百日元，你也投了一百日元。硬币落进箱子里，声音很小，被人群的声音盖过去了。可是你们俩都听见了。', '{her} puts in a hundred yen and so do you. The coins drop into the box with a tiny sound swallowed by the crowd. But you both hear it.')] },
        { id: 'wish', labelZh: '「来年も一緒に見よう。」', labelEn: '"Let us see it together next year too."', jp: '来年も一緒に見よう。', hintZh: '你三月就要回去了', hintEn: 'You go home in March',
          aff: 7, fam: 2, stat: 'guts', mood: 'sad',
          then: [T('{her}没有看你，一直看着那些灯。过了很久，她说"……灯りって、毎年ちゃんと点くのね"。你不知道这算不算回答。后来你想了很多遍，觉得那大概就是回答。', '{her} does not look at you, only at the lights. After a long time she says ...the lights do come on every year, do they not. You do not know if that is an answer. Later, after thinking about it many times, you decide it probably was.')] },
        { id: 'photo', labelZh: '替她拍一张照片', labelEn: 'Take a photo of her', hintZh: '人太多了，只能拍到半张脸', hintEn: 'Too crowded; you only get half her face',
          aff: 5, fam: 3, stat: 'charm', mood: 'happy',
          then: [T('照片里她只有半张脸，另外半张被一个路人的帽子挡住了，背后的灯全糊成了一片金色。她看了说"ひどい"，然后让你发给她。', 'In the photo there is only half her face; the other half is blocked by a stranger\'s hat, and the lights behind are smeared into a golden blur. She looks at it, says terrible, and tells you to send it to her.')] }
      ]
    }
  },
  {
    id: 'teppanyaki', icon: '🥩', scene: 'kobe_beef_teppanyaki', bgm: 'night',
    nameJp: '神戸牛の鉄板焼き', nameZh: '神户牛铁板烧', nameEn: 'Kobe beef teppanyaki',
    blurbZh: '主角这个月的生活费会疼。可是到了神户，总得吃一次。', blurbEn: 'This will hurt your monthly budget. But you are in Kobe; once, you must.',
    mood: 4, minFam: 4, tag: 'formal', occasion: () => 'formal',
    slots: ['night'], yen: 9000, stat: 'charm',
    arrive: T(
      '店里很安静，安静得能听见铁板上一滴油跳起来的声音。厨师戴着一顶很高的白帽子，对着你们鞠了一躬，鞠得比你这辈子收到过的所有鞠躬都深。',
      'The restaurant is so quiet you can hear a drop of oil jump on the hotplate. The chef, in a very tall white hat, bows to you more deeply than anyone has ever bowed to you in your life.'),
    beats: [
      T('牛肉被端上来给你们过目，雪花纹细得像一张地图，标出了一个你永远去不了的国家。{her}看了一眼价格表，又看了一眼你，眼神里写着"本当にいいの"。',
        'The beef is brought out for your inspection, its marbling as fine as a map of a country you will never visit. {her} glances at the price list, then at you, and her eyes say are you sure about this.'),
      T('铁板上的火一下子窜起来，又一下子灭了。厨师把肉切成小块，用两把铲子把其中一块推到你们面前，动作轻得像是在放一只睡着的猫。',
        'Flame leaps off the hotplate and is gone. The chef cuts the meat into small pieces and slides one in front of each of you with two spatulas, as gently as setting down a sleeping cat.')
    ],
    choice: {
      prompt: T('第一块。{her}在等你先吃。', 'The first piece. {her} is waiting for you to go first.'),
      options: [
        { id: 'first', labelZh: '「いただきます。」先吃', labelEn: '"Itadakimasu." Eat first.', jp: 'いただきます。', hintZh: '这顿你请', hintEn: 'It is your treat',
          aff: 4, fam: 4, stat: 'charm', mood: 'happy', words: [{ jp: 'とろける', zh: '入口即化', en: 'to melt in the mouth' }],
          then: [T('肉在嘴里化开了。不是嚼碎的，是自己化开的，像一块雪落在舌头上。你说不出话，只好看着{her}。她也吃了一口，然后也说不出话。你们俩就那么看着对方，很久。', 'The meat melts. Not chewed: it simply melts, like snow on the tongue. You cannot speak, so you look at {her}. She takes a bite and cannot speak either. You look at each other like that for a long time.')] },
        { id: 'give', labelZh: '把你那块也给她', labelEn: 'Give her your piece too', hintZh: '看她吃就够了', hintEn: 'Watching her eat is enough',
          aff: 6, fam: 2, stat: 'kindness', mood: 'shy',
          then: [T('{her}不肯收，推回来，你又推过去。厨师看着你们推了三个来回，什么也没说，又切了一块放在你面前，鞠了一躬。那一块，后来没有算在账单上。', '{her} will not take it and pushes it back. You push it over again. The chef watches three rounds of this, says nothing, cuts another piece, sets it in front of you and bows. That piece never appears on the bill.')] },
        { id: 'ask_chef', labelZh: '请厨师讲讲这块肉', labelEn: 'Ask the chef about the beef', jp: 'この肉について、教えてください。', hintZh: '日语练习', hintEn: 'Japanese practice',
          aff: 3, fam: 5, stat: 'knowledge', mood: 'neutral', words: [{ jp: '霜降り', reading: 'しもふり', zh: '雪花（肉的大理石纹）', en: 'marbling' }],
          then: [T('厨师讲了很久：哪个町的牧场、几岁的牛、喂的是什么。你听懂了七成，{her}在旁边替你补上了剩下的三成。讲完了，厨师说"お二人とも、日本語お上手ですね"，你们俩都笑了。', 'The chef talks for a long time: which village, how old, what it was fed. You understand seventy per cent and {her} fills in the rest beside you. When he finishes he says how good both your Japanese is, and you both laugh.')] }
      ]
    }
  }
];

export const findDateSpot = (id: string) => DATE_SPOTS.find(s => s.id === id) || null;
