import { StoryNode, StoryFlags, GameCalendar, TimeSlot } from '../types';
import { OTAKU_SCENES_2 } from './otakuScenes2';
import { NPC_ARCS } from './npcArcs';
import { OTAKU_SCENES } from './otakuScenes';
import { STREET_PEOPLE } from './streetPeople';
// 立绘路径从 constants 那三张表取，不在这儿再抄一遍——
// 抄两遍的代价是换图时漏掉一处，而漏掉的那处不报错，只显示碎图标。
import { SCHOOL_NPC_SPRITES, CITY_NPC_SPRITES, EASTER_EGG_SPRITES, CLERK_MISAKI_SPRITES, schoolDayNumber } from '../constants';
import { EASTER_SCENES } from './easterScenes';

// ---------------------------------------------------------
// 🚶 街头小景
//
// 去一个地方，如果没有专属剧情、也没有碰到认识的人，
// 以前只有一句空转旁白。这里补的是第三种东西：**你看见了别人**。
//
// 一座城市之所以像城市，是因为你在里面不是唯一一个有事要办的人。
// 所以这些小景全都是"和你无关的事正在发生"：
// 食堂阿姨在跟供货商吵、老钓客一个上午没动过、上班族又差两分钟。
// 你只是路过。
//
// ---------------------------------------------------------
// 【彩蛋角色怎么写】
//
// 有九个是别的作品里的人。写他们有一条硬规矩：
//
//   **一个名字都不出现，主角一个都不认识。**
//
// 他看见的是"一个背着吉他盒、正在往垃圾桶后面躲的粉发女生"，
// 不是某某某。认得出的人会笑，认不出的人只当是路人甲——
// 而这正是彩蛋该有的样子。写成"某某某登场了"就变成了联动，
// 不再是彩蛋，而且也不再好笑。
//
// 附带的好处是：他们不需要台词。他们做的事就是他们本身，
// 一句签名台词都不用抄。
// ---------------------------------------------------------

export interface StreetScene {
  // 同时是"见过了"的 flag
  id: string;
  locationIds: string[];
  timeSlots?: TimeSlot[];
  weather?: GameCalendar['weather'][];
  // 默认只演一次。街上偶尔重复看见同一个人是合理的，
  // 所以少数几条标成可重复。
  repeatable?: boolean;
  requiresFlags?: string[];
  forbidsFlags?: string[];
  // 相对权重。彩蛋压得很低——难得撞见才叫彩蛋。
  weight?: number;
  // 学年的第几天之后才可能撞见（0 = 开学第一天）。
  // 彩蛋全部从第一天就能遇到的话，一周之内就会被撞光，
  // 后面三百天再没有"哎？"可言。所以各自错开。
  minDay?: number;
  script: StoryNode[];
}

// 小景的通用收尾：看见别人也是认识这座城市的一部分
const seen = (zh: string, en: string): StoryNode => ({
  type: 'effect',
  effects: [{ stat: 'knowledge', amount: 1, reasonZh: zh, reasonEn: en }]
});

export const STREET_SCENES: StreetScene[] = [
  // ================= 学校 =================
  {
    id: 'st_yamada_delivery', locationIds: ['school_terrace'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.yamada,
        zh: '食堂后门开着。山田阿姨正拿着那把长勺，隔着门跟送货的人理论今天的葱。',
        en: 'The kitchen door is open. Mrs Yamada, ladle in hand, is disputing today’s spring onions with the delivery man through it.'
      },
      {
        type: 'narration',
        zh: '「これで三百人分やで」——她说这句话的时候没有提高音量，但送货的人明显矮了半截。',
        en: 'She says this has to feed three hundred, without raising her voice at all. The delivery man visibly loses height.'
      },
      {
        type: 'narration',
        zh: '你端着自己那份走过去。她看见你，勺子朝你那盘比划了一下：「食べや」。',
        en: 'You walk past with your tray. She sees you, gestures at it with the ladle, and tells you to eat.'
      },
      seen('你知道了今天那把葱是怎么来的', 'You now know how today’s spring onion got here')
    ]
  },
  {
    id: 'st_sakamoto_stopwatch', locationIds: ['gym', 'courtyard_rain'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.sakamoto,
        zh: '坂本老师站在跑道边，一只手举着秒表，另一只手插在运动服口袋里，一动不动。',
        en: 'Mr Sakamoto stands at the edge of the track, stopwatch up in one hand, the other in his tracksuit pocket, motionless.'
      },
      {
        type: 'narration',
        zh: '跑道上一个人都没有。他在给一个不存在的人计时——或者他只是忘了按停。',
        en: 'There is nobody on the track. He is timing somebody who is not there, or he simply forgot to stop it.'
      },
      seen('你没有去打扰他', 'You did not interrupt')
    ]
  },
  {
    id: 'st_saeki_nap', locationIds: ['school_infirmary'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.saeki,
        zh: '保健室的帘子拉着一半。佐伯老师坐在桌前写记录，头也不抬地说了一句「奥、空いてるよ」。',
        en: 'The curtain is half drawn. Dr Saeki, writing up notes without looking up, says the bed at the back is free.'
      },
      {
        type: 'narration',
        zh: '你说你没有不舒服。她"嗯"了一声，还是没抬头：「そういう子ほど寝てくで」。',
        en: 'You say you are not unwell. She makes a noise, still not looking up, and remarks that those are the ones who end up sleeping.'
      },
      seen('全校最好睡的那张床，你现在知道在哪儿了', 'You now know where the best sleeping in the school is')
    ]
  },
  {
    id: 'st_shiori_overdue', locationIds: ['school_library'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.shiori,
        zh: '借还台后面那个女生把一张卡片推过来，上面是你的名字，还有一个红色的日期。',
        en: 'The girl behind the desk slides a card across. Your name is on it, and a date in red.'
      },
      {
        type: 'narration',
        zh: '她什么都没说，只是看着你，一直看到你把书从包里拿出来。',
        en: 'She says nothing and just looks at you, until you take the book out of your bag.'
      },
      seen('你学会了这个学校真正重要的截止日期', 'You have learned which of this school’s deadlines actually matter')
    ]
  },
  {
    id: 'st_ellen_kansai', locationIds: ['international_office', 'classroom_morning'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.ellen,
        zh: '英语外教在走廊上被两个一年级拦住，让她说一句关西腔。',
        en: 'Two first-years have cornered the English teacher in the corridor and are asking her to say something in Kansai-ben.'
      },
      {
        type: 'narration',
        zh: '她想了想，说了一句「知らんけど」，语调准得那两个人当场愣住。',
        en: 'She considers, and produces the local shrug-phrase with an intonation so exact that both of them freeze.'
      },
      {
        type: 'narration',
        zh: '她转头看见你，做了个"别说出去"的口型。做完就转回去了，继续用非常生硬的日语跟那两个人说话。',
        en: 'She turns, sees you, and mouths at you not to say anything. Then she turns back and carries on in her extremely stiff Japanese with the other two.'
      },
      seen('你握住了这所学校的一个秘密', 'You are now holding one of this school’s secrets')
    ]
  },
  {
    id: 'st_aoi_gossip', locationIds: ['classroom_morning', 'school_terrace'], weight: 10, repeatable: true,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.aoi,
        zh: '葵从后面拍你的肩，还没等你转过去就已经开始讲了——三班有人在天台被抓、自动售货机换了新品、下周可能有小测。',
        en: 'Aoi taps your shoulder from behind and has started talking before you have turned round: somebody got caught on the roof, the vending machine has a new line, there may be a test next week.'
      },
      {
        type: 'narration',
        zh: '三件事里有两件后来被证明是真的。你一直没搞清楚是哪两件。',
        en: 'Two of those three later turn out to be true. You never establish which two.'
      },
      seen('你接入了这个学校的情报网', 'You have been connected to the school’s information network')
    ]
  },
  {
    id: 'st_kanzaki_boom', locationIds: ['school_science_lab'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.kanzaki,
        zh: '理科室里有一股烧焦的味道。神崎老师举着一支试管对着光看，非常满意的样子。',
        en: 'The science room smells of burning. Mr Kanzaki holds a test tube up to the light, looking extremely satisfied.'
      },
      {
        type: 'narration',
        zh: '你问是不是出了什么问题。他说没有，这次是预期之内的。',
        en: 'You ask if something went wrong. He says no. This time it was anticipated.'
      },
      { type: 'narration', zh: '「今回は」——他强调了这三个字。', en: 'He puts weight on "this time".' },
      seen('你决定以后从这间屋子外面绕过去', 'You resolve to walk around this room in future')
    ]
  },
  {
    id: 'st_kenta_bike', locationIds: ['school_bicycle_parking'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.kenta,
        zh: '健太蹲在自己的车前面，链条掉了。他抬头看见你，第一句话是「工具、持ってへん？」',
        en: 'Kenta is crouched over his bike with the chain off. He looks up and the first thing he says is whether you have tools.'
      },
      {
        type: 'narration',
        zh: '你没有。他说没事，徒手就把链条挂了回去。装完他看了看自己的手，两只手都黑了，他在裤子上抹了两下。',
        en: 'You do not. He says never mind and puts the chain back on with his bare hands. Afterwards he looks at them, both black, and wipes them twice on his trousers.'
      },
      seen('你学会了一句只在需要工具时才用得上的日语', 'You learned a Japanese sentence that is only useful when you need a tool')
    ]
  },
  {
    id: 'st_hiroki_frontrow', locationIds: ['classroom_morning', 'school_library'], weight: 8,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.hiroki,
        zh: '广树在第一排，面前摊着一本你在书店见过的题集，最厚的那本。',
        en: 'Hiroki is in the front row with a problem book open in front of him. You have seen it in the shop. It is the thick one.'
      },
      {
        type: 'narration',
        zh: '他做到一半停下来。橡皮擦过的地方擦得很干净，干净到看不出写过。他从那一题的第一行重新开始。',
        en: 'Halfway through he stops. What the eraser has been over is clean, clean enough that nothing shows. He starts that question again from its first line.'
      },
      seen('你看了一分钟别人怎么念书', 'You watched somebody study, for a minute')
    ]
  },
  {
    id: 'st_fujiwara_form', locationIds: ['international_office'], weight: 8,
    script: [
      {
        type: 'narration', characterImage: SCHOOL_NPC_SPRITES.fujiwara,
        zh: '藤原老师从一摞纸里抽出一张，递给你：「これ、去年の分。書き方が同じやから」。',
        en: 'Ms Fujiwara pulls a sheet from a stack and hands it over: last year’s, because it is filled in the same way.'
      },
      {
        type: 'narration',
        zh: '那是去年某个留学生填的表，字迹很工整。她连你会卡在哪一栏都知道。',
        en: 'It is a form filled in by some exchange student last year, very neatly. She knows in advance which box you will get stuck on.'
      },
      seen('你少填错了一次表', 'You got one form right that you would otherwise have got wrong')
    ]
  },

  // ================= 街上 =================
  {
    id: 'st_chen_steamer', locationIds: ['nankinmachi'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.chen,
        zh: '陈师傅掀开蒸笼，一团白汽冲出来，整条街的人同时朝这边看了一眼。',
        en: 'Chef Chen lifts the steamer and a cloud goes up, and everyone on the street looks over at the same moment.'
      },
      {
        type: 'narration',
        zh: '他用中文喊了一句，又用日语喊了一句，两句的意思完全一样，语气完全不一样。',
        en: 'He shouts something in Chinese, then the same thing in Japanese. Identical meaning, entirely different tone.'
      },
      seen('你在这条街上听见了两种自己都不太懂的语言', 'You heard two languages you half understand, on the same street')
    ]
  },
  {
    id: 'st_matsumoto_bowl', locationIds: ['ramen_shop_interior', 'ramen_rekishi'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.matsumoto,
        zh: '老板把一碗端到你面前，碗沿高出面汤只有一指。他退开半步，抱着手看你。',
        en: 'The boss sets a bowl down in front of you with barely a finger of rim above the broth, steps back, folds his arms and watches.'
      },
      {
        type: 'narration',
        zh: '你不知道该先说什么。他先说了：「冷めるで」。',
        en: 'You do not know what you are supposed to say first. He says it first: it will go cold.'
      },
      seen('你学会了这家店唯一的规矩', 'You learned this shop’s only rule')
    ]
  },
  {
    id: 'st_munakata_siphon', locationIds: ['retro_kissaten'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.munakata,
        zh: '老板在吧台后面弄那个虹吸壶。整个过程十二分钟，他一句话都没说，你也不敢说。',
        en: 'The master works the siphon behind the counter. The whole thing takes twelve minutes, in which he says nothing and you do not dare to either.'
      },
      {
        type: 'narration',
        zh: '端上来的时候他终于开口了，说的是「砂糖は入れんといて」。不是建议。',
        en: 'When it arrives he finally speaks, to say not to put sugar in it. It is not a suggestion.'
      },
      seen('你喝到了不放糖的那一种', 'You drank the kind that does not take sugar')
    ]
  },
  {
    id: 'st_mina_tray', locationIds: ['nishimura_coffee_salon', 'former_settlement_salon'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.mina,
        zh: '服务生端着六杯东西从你旁边过去，手腕一动都没动，杯子里的液面也一动没动。',
        en: 'The waitress passes you carrying six of something. Her wrist does not move and neither do the surfaces in the cups.'
      },
      {
        type: 'narration',
        zh: '你盯着看了太久，被她发现了。她笑了一下，什么都没说，继续走。',
        en: 'You watch too long and get caught. She smiles, says nothing, and keeps going.'
      },
      seen('你见识了一种非常具体的手艺', 'You watched a very specific skill being performed')
    ]
  },
  {
    id: 'st_gensan_still', locationIds: ['suma_fishing_pier', 'meriken_park'], weight: 10, repeatable: true,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.gensan,
        zh: '堤防最外面那个位置永远是同一个老头。他上次也在这儿，姿势和现在一模一样。',
        en: 'The far end of the pier is the same old man it always is. He was here last time, in exactly this posture.'
      },
      {
        type: 'narration',
        zh: '你看了他一会儿。他的浮标一次都没动。他也一次都没动。',
        en: 'You watch him for a while. His float does not move once. Neither does he.'
      },
      seen('你开始明白钓鱼这件事到底在钓什么', 'You are beginning to understand what fishing is for')
    ]
  },
  {
    id: 'st_shizue_basin', locationIds: ['nada_onsen', 'arima_onsen'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.shizue,
        zh: '前台那个老太太把一个脸盆推过来，盆底写着一个「ゆ」。',
        en: 'The old lady at the desk pushes a basin across. There is one character on the bottom of it.'
      },
      {
        type: 'narration',
        zh: '她说了一句很长的话，语速很快，方言很重。你只听懂了最后两个字：「ゆっくり」。',
        en: 'She says something long, fast and heavily accented. You catch the last word only: slowly.'
      },
      seen('你听懂了整句话里最要紧的那两个字', 'You caught the only part of that sentence that mattered')
    ]
  },
  // 🏪 便利店店员美咲。序章里她给主角结了第一次账，
  // 从那以后她一直在那儿，而主角一直没跟她说过第二句话。
  // 三条，按学年往后排：认出你 → 记住你买什么 → 那句一直没说出口的话。
  // 这是这个游戏里唯一一条不属于任何"角色"的关系线，
  // 也是唯一一条**只靠反复出现在同一个地方**建立起来的。
  {
    id: 'st_misaki_again', locationIds: ['convenience_store'], weight: 6, minDay: 12,
    script: [
      {
        type: 'narration', characterImage: CLERK_MISAKI_SPRITES.welcome,
        zh: '「いらっしゃいませ。」是同一个人。名牌上写着「みさき」，你上次没看清。',
        en: '"Welcome." It is the same person. The badge says Misaki. You did not get a good look at it last time.'
      },
      {
        type: 'narration', characterImage: CLERK_MISAKI_SPRITES.smile,
        zh: '结账的时候她多看了你一眼，看的是你那身制服。她没说什么，但那一眼里有个"哦"。',
        en: 'At the till she glances at you a second longer, at the uniform. She does not say anything, but there is an "ah" in the glance.'
      },
      seen('你成了一家便利店的常客，虽然还没有人这么说', 'You have become a regular somewhere, though nobody has said so')
    ]
  },
  {
    id: 'st_misaki_usual', locationIds: ['convenience_store'], weight: 6, minDay: 90,
    requiresFlags: ['st_misaki_again'],
    script: [
      {
        type: 'narration', characterImage: CLERK_MISAKI_SPRITES.think,
        zh: '你把东西放上柜台。她扫到一半停了一下，看了看那盒饭团，又看了看你。',
        en: 'You put your things on the counter. Halfway through scanning she pauses, looks at the onigiri, then at you.'
      },
      {
        type: 'narration', characterImage: CLERK_MISAKI_SPRITES.laugh,
        zh: '「いつもの、ですね。」她说完自己先笑了，像是也没想到自己会说这句。',
        en: '"The usual, then." She laughs at herself for saying it, as if she had not planned to.'
      },
      {
        type: 'narration',
        zh: '你其实没意识到自己每次买的是同一样东西。走出自动门以后你想了一路。',
        en: 'You had not registered that you buy the same thing every time. You think about it the whole way out.'
      },
      seen('有人替你记住了你自己没注意的事', 'Somebody has been keeping track of something you had not noticed yourself'),
      {
        type: 'effect',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '被人记住是一件会往回还的事', reasonEn: 'Being remembered is a thing that comes back around' }]
      }
    ]
  },
  {
    id: 'st_misaki_last', locationIds: ['convenience_store'], weight: 8, minDay: 300,
    requiresFlags: ['st_misaki_usual'],
    script: [
      {
        type: 'narration', characterImage: CLERK_MISAKI_SPRITES.bag,
        zh: '她装袋的时候动作比平时慢。袋口折了两次，第二次是多余的。',
        en: 'She bags it more slowly than usual. She folds the top over twice, and the second fold is not necessary.'
      },
      {
        type: 'narration', characterImage: CLERK_MISAKI_SPRITES.shy,
        zh: '「あの……三月で、帰るんですか。」她问完就低下头去理收银台上的东西，那上面本来也没什么好理的。',
        en: '"Um... are you going back, in March?" Having asked, she looks down and starts tidying the counter, which did not need tidying.'
      },
      {
        type: 'narration',
        zh: '你说是。她「そうですか」了一声，把袋子递过来，说了句「ありがとうございました」。',
        en: 'You say yes. She says "I see", passes the bag over, and thanks you for your custom.'
      },
      {
        type: 'narration',
        zh: '和第一次一模一样的一句。你在自动门外面站了一会儿。',
        en: 'Word for word what she said the first time. You stand outside the automatic door for a moment.'
      },
      seen('这一年里你最常见到的人，你连她的姓都不知道', 'The person you saw most this year, and you never learned her surname')
    ]
  },
  {
    id: 'st_takahashi_scan', locationIds: ['hyakkin_store', 'convenience_store'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.takahashi,
        zh: '店员正在给一整排货扫码，速度快得像在打节拍。滴、滴、滴、滴。',
        en: 'The shop assistant is scanning a whole row of stock at a speed that has turned into a rhythm. Beep, beep, beep, beep.'
      },
      {
        type: 'narration',
        zh: '中间有一次没响。他停了半秒，把那一件翻过来重扫。第二下响了，节拍就接上了。',
        en: 'One of them does not beep. He stops for half a second, turns it over and runs it again. The second pass beeps, and the rhythm picks back up.'
      },
      seen('你在一个便利店里看见了一种奇怪的完美', 'You saw a strange kind of perfection in a convenience store')
    ]
  },
  {
    id: 'st_watanabe_watch', locationIds: ['sannomiya_station', 'portliner_platform'], weight: 10, repeatable: true,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.watanabe,
        zh: '一个西装男在检票口前面看表，看完抬头看发车牌，又低头看表。',
        en: 'A man in a suit checks his watch at the gate, looks up at the departure board, and checks his watch again.'
      },
      {
        type: 'narration',
        zh: '他离下一班还有两分钟。他上次也是两分钟。你怀疑他这辈子都是两分钟。',
        en: 'He has two minutes. He had two minutes last time. You suspect he has had two minutes his entire life.'
      },
      seen('你学会了看那块发车牌', 'You learned to read the departure board')
    ]
  },
  {
    id: 'st_riko_shelf', locationIds: ['junkudo_bookstore'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.riko,
        zh: '文库本那一排前面站着一个戴贝雷帽的女人。她抽出一本，翻两页，放回去，再抽下一本。',
        en: 'A woman in a beret is standing at the paperbacks. She takes one out, reads two pages, puts it back, takes the next.'
      },
      {
        type: 'narration',
        zh: '你在这儿见过她三次。三次她都站在同一排，三次她都空着手走。',
        en: 'You have seen her here three times. Same shelf all three times, and all three times she left empty-handed.'
      },
      seen('你也抽了一本，翻了两页', 'You took one out too, and read two pages')
    ]
  },
  {
    id: 'st_yuki_photo', locationIds: ['meriken_park', 'kitano_slope', 'kitano_kazamidori_square'], weight: 10,
    script: [
      {
        type: 'narration', characterImage: CITY_NPC_SPRITES.yuki,
        zh: '一个拿着相机和纸质地图的女人蹲在地上，正对着一块很普通的路面拍照。',
        en: 'A woman with a camera and a paper map is crouched on the pavement, photographing a completely ordinary bit of it.'
      },
      {
        type: 'narration',
        zh: '你走过去看了一眼。地上是一块旧的排水盖，上面铸着一艘船和一个年份。',
        en: 'You go and look. It is an old drain cover with a ship cast into it, and a year.'
      },
      {
        type: 'narration',
        zh: '你在这条路上走过至少二十次。这是第一次看见它。',
        en: 'You have walked this road at least twenty times. It is the first time you have seen it.'
      },
      seen('你开始用看不懂这座城市的人的眼睛看它', 'You started looking at this city the way somebody who does not know it looks at it')
    ]
  },
  {
    id: 'st_motomachi_tea', locationIds: ['motomachi_arcade'], weight: 10,
    script: [
      {
        type: 'narration',
        zh: '元町拱廊街的老茶铺门前摆着一台巨大的焙茶机，铁筒缓缓转动，烘焙绿茶的醇厚焦香弥漫了整整半条街。',
        en: 'Outside the vintage tea merchant in Motomachi stands a large roasting drum, revolving slowly, filling half the arcade with the warm aroma of hojicha.'
      },
      {
        type: 'narration',
        zh: '一位穿和服的老太太正捧着试饮的小瓷杯与店主用温和的关西腔闲聊，店里的茶筒已经泛着擦拭了数十年的温润木光。',
        en: 'An elderly lady in kimono sips from a tasting cup, chatting with the owner in quiet Kansai dialect amidst polished wooden canisters.'
      },
      seen('你在老茶香里闻到了神户慢下来的时间', 'You smelled time slowing down in the fragrance of roasted tea')
    ]
  },
  {
    id: 'st_settlement_gaslamp', locationIds: ['daimaru_settlement'], weight: 10,
    timeSlots: ['night'],
    script: [
      {
        type: 'narration',
        zh: '大丸百货石柱回廊外的煤气路灯在一声微弱的轻响中一盏接一盏亮起，发出温暖柔和的暖黄光芒。',
        en: 'The gas lamps along the stone colonnade of Daimaru flicker to life one by one with a faint click, casting a warm amber glow.'
      },
      {
        type: 'narration',
        zh: '露天咖啡座的白伞在晚风中轻轻晃动。服务生动作轻柔地收起菜单，街角的旧式建筑在夜色下透着百年未变的从容。',
        en: 'White terrace umbrellas sway in the night breeze. The waiter clears menus with practiced quiet under buildings that have stood poised for a century.'
      },
      seen('你驻足看了一盏真正的煤气灯亮起', 'You paused to watch a real gas streetlamp light up')
    ]
  },
  {
    id: 'st_ikuta_lanterns', locationIds: ['ikuta_road'], weight: 10,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: '东门街与生田路的巷口，居酒屋的师傅正把一串红提灯挂上屋檐。炭火已经烧得通红，秘制酱汁浇在烤鸡串上激起一阵浓郁的白烟。',
        en: 'At the alley entrance of Higashimon and Ikuta Road, a tavern master hangs a string of red lanterns. Charcoal glows white-hot as tare sauce sizzles over yakitori skewers.'
      },
      {
        type: 'narration',
        zh: '刚刚下班的年轻白领们正说笑着钻进布帘。热腾腾的市井气息让你忽然觉得特别饿。',
        en: 'Young office workers, newly off the shift, slip behind the noren curtains with easy laughter. The warm street atmosphere suddenly makes you very hungry.'
      },
      seen('你撞进了神户最鲜活滚烫的市井夜色', 'You stepped right into Kobe’s most vibrant, sizzling night scene')
    ]
  },
  {
    id: 'st_himeji_painter', locationIds: ['himeji_castle'], weight: 10,
    timeSlots: ['morning', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '护城河边的樱花树下支着一个画架。一位戴贝雷帽的老爷爷正用极细的水彩笔描摹着白鹭城飞檐上的瓦当。',
        en: 'Beside the moat beneath cherry trees stands an easel. An elderly painter with a beret traces the roof tile crests of the White Heron with a fine brush.'
      },
      {
        type: 'narration',
        zh: '几瓣樱花落在他的调色盘上，他没有拂开，只是蘸了点水，顺着花瓣的粉色在画纸上晕开了一抹春光。',
        en: 'A few sakura petals land on his palette. He leaves them be, dips his brush in water, and washes their pale pink right into the paper.'
      },
      seen('你在天守阁下见证了一幅水彩画的完成', 'You watched a watercolour come to life beneath the keep')
    ]
  },
  {
    id: 'st_akashi_fisherman', locationIds: ['akashi_bridge'], weight: 10,
    timeSlots: ['morning', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '舞子海滨公园的防波石上坐着一个戴草帽的老渔民，正在给海钓竿绑八字环。巨大的钢缆在他头顶百米高空划破长空。',
        en: 'On the seawall at Maiko Park sits an old fisherman in a straw hat rigging a swivel. A hundred metres above him, giant steel cables span the sky.'
      },
      {
        type: 'narration',
        zh: '「明石海峡的水流急得很，底下的鲷鱼肉质紧实得像打过架一样。」他指了指对岸的淡路岛，笑呵呵地对你说。',
        en: '"Currents in Akashi Strait run fierce; the sea bream down there have meat as tight as fighters," he chuckles, pointing toward Awaji.'
      },
      seen('你从老渔夫那里听来了一条关于潮汐的秘诀', 'You caught a veteran fisherman’s secret about the straits')
    ]
  },
  {
    id: 'st_awaji_flower_breeze', locationIds: ['awaji_hanasajiki'], weight: 10,
    timeSlots: ['morning', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '淡路花手敷的高原木栈道上，风吹过金黄的油菜花田，一层层花浪像海潮般向着山下真正的大海涌去。',
        en: 'Along the high wooden boardwalk of Awaji Hanasajiki, wind sweeps across fields of yellow blossoms, rolling down toward the sea like waves.'
      },
      {
        type: 'narration',
        zh: '小卖部窗口飘来烤淡路岛甜洋葱和枇杷冰淇淋的甜香。你坐在看海的长椅上，感觉整个人都被融化在了蓝天与花田里。',
        en: 'The aroma of grilled sweet Awaji onions and loquat soft-serve drifts from the kiosk. Sitting on the ocean bench, you feel dissolved in sky and blossom.'
      },
      seen('你在海景花丘上吹了一整个下午的海风', 'You caught an entire afternoon of sea breeze on the flower hills')
    ]
  },

  // ================= 彩蛋 =================
  // 一个名字都不出现。主角谁都不认识，他只是看见了。
  {
    id: 'st_egg_band', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade'], weight: 3,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: '高架下的一家 Live House 门口摆着易拉宝。四个女生正在往外搬器材，其中三个在搬，第四个在躲。',
        en: 'There is a banner outside a live house under the tracks. Four girls are moving gear out of it. Three of them are moving gear. The fourth is hiding.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.bocchi,
        zh: '躲着的那个背着一个比她还大的吉他盒，正试图让自己整个人消失在一个垃圾桶后面。她做得意外地好。',
        en: 'The hiding one has a guitar case bigger than she is, and is attempting to disappear entirely behind a wheelie bin. She is unexpectedly good at it.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.nijika,
        zh: '金发那个把她从垃圾桶后面拽出来，一边拽一边笑，声音很亮。',
        en: 'The blonde one hauls her out from behind the bin, laughing, in a very bright voice.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.ryo,
        zh: '穿军绿外套那个抱着贝斯站在旁边，全程没说话，也没帮忙。',
        en: 'The one in the olive parka stands there holding a bass, saying nothing and helping with nothing.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.kita,
        zh: '红头发那个塞给你一张传单，笑得非常好看：「よかったら、今度」。',
        en: 'The red-haired one presses a flyer into your hand with a very good smile and says, if you are free, some time.'
      },
      {
        type: 'narration',
        zh: '传单上是四个人的乐队名。你不认识她们。你把传单折好放进了口袋。',
        en: 'The flyer has a four-piece band’s name on it. You do not know who they are. You fold it and put it in your pocket.'
      },
      { type: 'effect', setFlags: ['egg_band_flyer'], effects: [
        { stat: 'charm', amount: 1, reasonZh: '你收下了一张传单', reasonEn: 'You accepted a flyer' }
      ] }
    ]
  },
  {
    id: 'st_egg_teatime', locationIds: ['suma_beach', 'meriken_park'], weight: 3,
    timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.yui,
        zh: '一个戴草帽的女生举着西瓜冰棒往这边跑，跑得太快，冰棒开始往下滑。',
        en: 'A girl in a straw hat comes running this way holding a watermelon ice lolly, running fast enough that the lolly begins to slide.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.mio,
        zh: '后面那个黑长直的女生喊了一句「走らないで」，然后也开始跑。',
        en: 'The tall dark-haired one behind her shouts at her not to run, and then also starts running.'
      },
      {
        type: 'narration',
        zh: '冰棒最后掉在了沙子上。两个人蹲下来看了它三秒钟，然后一起笑了。',
        en: 'The lolly ends up in the sand. They crouch and look at it for three seconds, and then both laugh.'
      },
      {
        type: 'narration',
        zh: '你不知道她们是谁。但你后来想起这一幕的次数，比你以为的多。',
        en: 'You do not know who they are. You think about this afterwards more often than you would have expected.'
      },
      seen('你看见了一个和你无关的夏天', 'You saw a summer that had nothing to do with you')
    ]
  },
  {
    id: 'st_egg_bread', locationIds: ['meriken_park', 'kobe_harbor'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.denji,
        zh: '长椅上坐着一个金色乱发的男生，正在吃一片抹了果酱的面包，吃得非常郑重。',
        en: 'On the bench there is a boy with messy blond hair eating a slice of bread with jam on it, and eating it with enormous ceremony.'
      },
      {
        type: 'narration',
        zh: '他吃完之后靠在椅背上，望着海，说了一句「うまかった」，声音大得旁边的鸽子飞了。',
        en: 'When it is gone he leans back, looks at the sea, and declares that it was good, loudly enough that the pigeons leave.'
      },
      {
        type: 'narration',
        zh: '你想起自己这一周吃过的所有东西，忽然觉得自己吃得太不认真了。',
        en: 'You think about everything you have eaten this week and are struck by how little attention you paid to any of it.'
      },
      seen('你决定明天认真吃早饭', 'You resolve to take tomorrow’s breakfast seriously')
    ]
  },
  {
    id: 'st_egg_cafe', locationIds: ['retro_kissaten', 'nishimura_coffee_salon'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.reze,
        zh: '吧台最里面坐着一个短发女生，两只手捧着杯子，正在看窗外。',
        en: 'At the far end of the counter a short-haired girl is holding a cup in both hands, looking out of the window.'
      },
      {
        type: 'narration',
        zh: '她注意到你在看，转过头来笑了一下，笑得非常自然。',
        en: 'She notices you looking, turns, and smiles. It is a very natural smile.'
      },
      {
        type: 'narration',
        zh: '你莫名其妙地觉得后颈发凉，虽然完全说不出为什么。你低头喝自己的咖啡。',
        en: 'For no reason you can name, the back of your neck goes cold. You look down at your own coffee.'
      },
      seen('你的直觉说了句什么，你没听清', 'Something in you said something. You did not catch it')
    ]
  },
  {
    id: 'st_egg_shrine', locationIds: ['ikuta_shrine', 'kitano_lookout'], weight: 3,
    timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.rin,
        zh: '神社的石阶上站着一个黑色双马尾的女生，红毛衣，抱着手，正皱着眉看向本殿后面那片林子。',
        en: 'On the shrine steps stands a girl with black twin tails in a red sweater, arms folded, frowning at the trees behind the main hall.'
      },
      {
        type: 'narration',
        zh: '她小声说了一句什么，像是在骂人，又像是在算什么。',
        en: 'She says something under her breath that sounds like swearing, or possibly like arithmetic.'
      },
      {
        type: 'narration',
        zh: '你顺着她的视线看过去。林子里什么都没有。你再回头，石阶上也什么都没有了。',
        en: 'You follow her line of sight. There is nothing in the trees. You look back, and there is nothing on the steps either.'
      },
      {
        type: 'narration',
        zh: '你决定这件事以后不要跟稻荷提。你有种感觉，她会知道得太清楚。',
        en: 'You decide not to mention this to Inari. You have a feeling she would know altogether too much about it.'
      },
      seen('你在这座城市里撞见了一件不归你管的事', 'You walked into something in this city that was not yours to walk into')
    ]
  },
  {
    // 花生。一个把心思写在脸上的小孩，而且好像还听得见别人的心思。
    id: 'st_egg_peanuts', locationIds: ['convenience_store', 'hyakkin_store'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.anya,
        zh: '零食架前面站着一个很小的小孩，粉色头发，抱着一大袋花生，抱得像抱着一件贵重物品。',
        en: 'In front of the snack shelf there is a very small child with pink hair, holding a large bag of peanuts the way one holds something valuable.'
      },
      {
        type: 'narration',
        zh: '她抬头看了你一眼。你什么都没说，但她的表情忽然变了——变成一种"我知道你在想什么"的、非常得意的笑。',
        en: 'She looks up at you. You have said nothing, but her expression changes into a very smug one, of the sort worn by somebody who knows what you are thinking.'
      },
      {
        type: 'narration',
        zh: '你当时正在想今天到底该不该买那盒打折的布丁。你莫名其妙地觉得被看穿了，于是买了。',
        en: 'You had been weighing up whether to buy the discounted pudding. You feel inexplicably read, and buy it.'
      },
      seen('你被一个小孩看穿了', 'You were seen through by a small child')
    ]
  },
  {
    // 神社里哭得最大声的那一个，偏偏不是来许愿的。
    id: 'st_egg_goddess', locationIds: ['ikuta_shrine', 'kitano_lookout'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.aqua,
        zh: '本殿前面有个蓝头发的女生正抱着头哭，哭得非常大声，一点都不打算收敛。',
        en: 'In front of the main hall a blue-haired girl is holding her head and crying, extremely loudly, with no intention of moderating it.'
      },
      {
        type: 'narration',
        zh: '她一边哭一边喊，大意是这个月一个人都没有来拜她。',
        en: 'Through it she is shouting something to the effect that not one person has come to worship her this month.'
      },
      {
        type: 'narration',
        zh: '你往功德箱里投了五円，合掌拜了一下。她立刻不哭了，非常自然地摆出一副宽厚的表情。',
        en: 'You put five yen in the box and put your hands together. She stops crying instantly and arranges her face into an expression of great magnanimity.'
      },
      {
        type: 'narration',
        zh: '五円。ご縁。你后来才反应过来自己为什么偏偏投了这一枚。',
        en: 'Five yen. The coin you throw for a connection. It occurs to you afterwards that this is why that is the coin.'
      },
      seen('你花五円买了一个神的好心情', 'Five yen bought a deity’s good mood')
    ]
  },
  {
    // 拉面店那两个。一个能吃，一个在等她吃完。
    id: 'st_egg_detective', locationIds: ['ramen_shop_interior', 'ramen_rekishi', 'school_terrace'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.chika,
        zh: '隔壁座位那个粉发女生面前摆着一碗堆得很高的东西，她正在非常认真地吃，速度快得不像在吃。',
        en: 'The pink-haired girl at the next seat has a bowl in front of her stacked improbably high, and is eating it with great seriousness, at a speed that does not look like eating.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.hayasaka,
        zh: '她旁边那个金发的双手抱在胸前，低头看手机，一口都没动。',
        en: 'The blonde beside her has her arms folded and is looking at her phone. She has not touched anything.'
      },
      {
        type: 'narration',
        zh: '粉发那个吃完之后抬起头，非常严肃地对着空气说了一句"我推理出来了"。金发那个头都没抬。',
        en: 'The pink-haired one finishes, looks up and announces to the air, with total gravity, that she has worked it out. The blonde does not look up.'
      },
      seen('你见识了一种非常高效的进食方式', 'You witnessed an extremely efficient method of eating')
    ]
  },
  {
    // 拿着写字板的人，在一个只有游客的地方做记录。
    id: 'st_egg_marine', locationIds: ['suma_aquarium', 'meriken_park', 'suma_beach'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.jotaro,
        zh: '一个穿白色长外套、戴着帽子的高个子男人站在水槽前面，拿着写字板在记东西。',
        en: 'A very tall man in a long white coat and a cap stands at the tank with a clipboard, writing things down.'
      },
      {
        type: 'narration',
        zh: '周围全是拿着手机拍鱼的游客。只有他在看鱼本身，而且看得非常久。',
        en: 'Everyone around him is photographing the fish with their phones. He is the only one looking at the fish, and he looks for a very long time.'
      },
      {
        type: 'narration',
        zh: '你也试着看了一分钟。一分钟之后你发现那条鱼一直在同一条路线上游，一圈都没有偏过。',
        en: 'You try it for a minute. After a minute you notice that the fish has been swimming the same line the whole time, and has not once deviated.'
      },
      {
        type: 'narration',
        zh: '他"やれやれ"了一声，翻过一页，继续写。',
        en: 'He makes a short weary noise, turns the page, and goes on writing.'
      },
      seen('你学会了看一样东西超过一分钟', 'You learned to look at one thing for longer than a minute')
    ]
  },
  {
    // 只想过平静生活的人。你完全不知道自己躲开了什么。
    id: 'st_egg_quiet_life', locationIds: ['kitano_slope', 'sannomiya_station'], weight: 3,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.kira,
        zh: '一个穿紫色西装的男人从你旁边走过去，一只手拎着纸袋，另一只手抬起来看表。',
        en: 'A man in a purple suit passes you, a paper bag in one hand, the other lifted to check his watch.'
      },
      {
        type: 'narration',
        zh: '他走得不快也不慢，路线笔直，从头到尾没有看任何人一眼。',
        en: 'He walks neither fast nor slow, in a straight line, and does not glance at a single person the entire way.'
      },
      {
        type: 'narration',
        zh: '你莫名其妙地往旁边让了半步，虽然他离你还有三米远。',
        en: 'For no reason you can identify you take half a step aside, although he is still three metres away.'
      },
      {
        type: 'narration',
        zh: '他从你身边过去了。你回头看了一眼，他已经拐进了另一条巷子。你没有再想这件事。',
        en: 'He goes past. You look back and he has already turned into another lane. You do not think about it again.'
      },
      seen('你的身体替你做了一个决定', 'Your body made a decision on your behalf')
    ]
  },
  {
    // 南京町的陈师傅隔壁摊。这一段专门排在陈师傅那条旁边。
    id: 'st_egg_golden_rice', locationIds: ['nankinmachi'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.mao,
        zh: '南京町最里面那个摊子前面围了一圈人。一个系着头巾的少年正把一盘炒饭举过头顶。',
        en: 'There is a ring of people round the stall at the far end of Nankinmachi. A boy in a bandana is holding a plate of fried rice above his head.'
      },
      {
        type: 'narration',
        zh: '那盘炒饭在发光。不是被灯照的——你看了三遍，它自己在发光。',
        en: 'The fried rice is glowing. Not lit from somewhere: you check three times, and it is glowing on its own.'
      },
      {
        type: 'narration',
        zh: '围观的人齐声"おおおお"了一下，非常整齐，像是排练过。',
        en: 'The crowd goes up in one voice, very much together, as though rehearsed.'
      },
      {
        type: 'narration',
        zh: '你后来问陈师傅那是什么。陈师傅想了很久，说：「アレはな……ああいうもんや」。',
        en: 'You ask Chef Chen about it afterwards. He thinks for a long time and says that it is, well, one of those.'
      },
      seen('你亲眼见过一次会发光的炒饭', 'You have personally seen fried rice glow')
    ]
  },
  {
    // 值日生。你什么都没看清，但地扫完了。
    id: 'st_egg_class_duty', locationIds: ['classroom_morning', 'school_bicycle_parking'], weight: 3,
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.sakamoto,
        zh: '放学后的教室里只剩一个男生在值日。黑色立领制服，眼镜，动作慢得像有背景音乐。',
        en: 'There is one boy left doing the after-school cleaning. Black high-collared uniform, glasses, moving slowly enough to imply background music.'
      },
      {
        type: 'narration',
        zh: '他把扫帚转了半圈，接住，同一个动作里顺手推了一下眼镜。窗外正好有风把樱花吹进来。',
        en: 'He spins the broom half a turn, catches it, and in the same motion adjusts his glasses. Outside, the wind happens to blow cherry petals in.'
      },
      {
        type: 'narration',
        zh: '花瓣全部落进了他手里那个簸箕。你确认了一下，一片都没有落在地上。',
        en: 'Every petal lands in the dustpan he is holding. You check. Not one of them reaches the floor.'
      },
      {
        type: 'narration',
        zh: '你决定不去想这件事是怎么做到的。',
        en: 'You decide not to think about how that was done.'
      },
      seen('你目击了一次不该发生的扫地', 'You witnessed a sweeping that should not have been possible')
    ]
  },
  {
    // 黄昏操场的撑杆跳。一次又一次跃不过的高度。
    // 这一条留着当「只是路过瞥了一眼」的版本，权重压到 1；
    // 有选择、有下文的那一场在 easterScenes.ts 的 st_egg_shirou_vault。
    id: 'st_egg_high_jump', locationIds: ['school_terrace', 'gym'], weight: 1,
    timeSlots: ['afternoon'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.shirou,
        zh: '操场角落的跳高垫旁，一个穿着沾着泥巴体操服的红发男生正握着一根竹竿。',
        en: 'By the high-jump mats in the corner of the grounds, a red-haired boy in mud-streaked gym clothes holds a bamboo pole.'
      },
      {
        type: 'narration',
        zh: '横杆架在一个以他的身高明显不可能跃过去的高度。他往手心里吐了口气，起跑、起跳、重重摔在垫子上。',
        en: 'The bar is set at a height plainly impossible for his stature. He breathes onto his palms, runs up, takes off, and hits the mat heavily.'
      },
      {
        type: 'narration',
        zh: '横杆掉了。他爬起来，把横杆重新架好，走回起跑点。夕阳把他的影子拉得很长。',
        en: 'The bar comes down. He gets up, resets it, and walks back to the mark. The sunset draws his shadow out very long.'
      },
      {
        type: 'narration',
        zh: '你不知道他已经跳了多少次，但你有种感觉，即使到了天黑，他也不会停下。',
        en: 'You have no idea how many times he has jumped, but you have a feeling that even when night falls, he will not stop.'
      },
      seen('你目击了一场注定失败却不愿停下的尝试', 'You witnessed an attempt destined to fail that refused to halt')
    ]
  },
  {
    // 自动售货机前的那罐黄罐咖啡。
    id: 'st_egg_max_coffee', locationIds: ['school_bicycle_parking', 'sannomiya_station'], weight: 3,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.hachiman,
        zh: '自动贩卖机前站着一个头发微翘、顶着一双无精打采死鱼眼的男生，手里握着一罐黄色的MAX咖啡。',
        en: 'In front of the vending machine stands a boy with slightly messy hair and thoroughly dead-fish eyes, clutching a yellow can of MAX Coffee.'
      },
      {
        type: 'narration',
        zh: '他慢吞吞地拉开拉环喝了一小口，眼神空洞地看着路过的成双成对的学生，嘴角挂着一丝冷笑。',
        en: 'He pulls the tab at a crawl, takes a sip, and gazes blankly at pairs of passing students with a faint sneer.'
      },
      {
        type: 'narration',
        zh: '「人生は甘くないから、せめてコーヒーくらいは甘くていい……」他似乎自言自语了一句。',
        en: '"Life isn\'t sweet, so at least the coffee should be..." he seems to mutter under his breath.'
      },
      seen('你领悟了甜咖啡背后的深沉哲学', 'You grasped the solemn philosophy behind overly sweet coffee')
    ]
  },
  {
    // 图书馆角落的安静读者。
    id: 'st_egg_ice_queen', locationIds: ['school_library', 'junkudo_bookstore'], weight: 3,
    timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.yukino,
        zh: '靠窗的阳光下坐着一位黑长直发的女生，姿态端正得像从画里走出来的一样，正在静静翻阅一本文库本。',
        en: 'Under the window sunlight sits a girl with long straight black hair, seated with painterly posture, quietly leafing through a paperback.'
      },
      {
        type: 'narration',
        zh: '书页中间露出一枚圆滚滚的黑猫书签。偶尔有路过的学生想跟她搭话，都被她周身若隐若现的冷气逼退了。',
        en: 'Between the pages peeks a round black cat bookmark. Passing students who consider speaking to her are held off by the faint frost in her aura.'
      },
      seen('你见识了真正让人不敢靠近的阅读姿态', 'You observed a reading posture so immaculate it kept the world at bay')
    ]
  },
  {
    // 白大褂、拉面与叹息。
    id: 'st_egg_cool_teacher', locationIds: ['ramen_shop_interior', 'ramen_rekishi'], weight: 3,
    timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.shizuka,
        zh: '拉面店柜台最内侧，一位披着白色大褂、身材高挑的黑发女性正豪迈地端着大碗豚骨拉面大口喝汤。',
        en: 'At the far end of the ramen counter, a tall dark-haired woman in a white coat hefts a heavy tonkotsu bowl with both hands and drinks deeply.'
      },
      {
        type: 'narration',
        zh: '吃完后她放下碗，满足地擦了擦嘴，随即看着手机上的日历深深叹了口气，低声喃喃着关于相亲和年龄的沉重字眼。',
        en: 'She sets the bowl down with satisfaction, wipes her lips, checks a calendar on her phone, and lets out a long sigh about matchmaking.'
      },
      seen('你目睹了一位帅气大人难以言说的烦恼', 'You witnessed the unspoken sorrow of an otherwise formidable adult')
    ]
  },
  {
    // 关东煮、超大便当与很长的小票。
    id: 'st_egg_makeine_lunch', locationIds: ['school_terrace', 'convenience_store'], weight: 3,
    timeSlots: ['lunch'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.anna,
        zh: '长椅上坐着一个水蓝色短发的女生，膝盖上放着一个大得离谱的双层便当盒，手里还抓着一串烤丸子。',
        en: 'On the bench sits a girl with aqua-blue hair, an absurdly massive two-tiered bento on her lap and a skewer of grilled dango in hand.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.nukumizu,
        zh: '旁边一个表情平淡的男生手里拉着一条快要垂到地面的便利店长收据，正极其绝望地盯着自己的零钱包。',
        en: 'Beside her, an unobtrusive boy holds a receipt trailing nearly to the floor, staring in quiet despair at his coin purse.'
      },
      {
        type: 'narration',
        zh: '女生嚼着丸子含糊不清地安慰他：「下次我一定少吃点……真的！」男生完全没有看她。',
        en: 'Munching her dango, the girl mumbles assurances that she will eat less next time. The boy does not look at her.'
      },
      seen('你目击了一场关于钱包厚度的单方面掠夺', 'You witnessed a one-sided attrition of somebody\'s pocket money')
    ]
  },
  {
    // 小麦色皮肤与飞奔的田径少女。
    id: 'st_egg_track_lemon', locationIds: ['suma_beach', 'meriken_park'], weight: 3,
    timeSlots: ['afternoon'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.lemon,
        zh: '迎面刮来一阵带着柑橘香气的风。一个皮肤晒成健康小麦色、穿着短裤运动服的少女像小鹿一样飞奔而过。',
        en: 'A breeze carrying a faint citrus scent sweeps past as an athletic girl with sun-tanned skin dashes by like a gazelle.'
      },
      {
        type: 'narration',
        zh: '她单手拧开运动饮料猛灌了一大口，路过你时甚至元气满满地朝你露齿一笑，速度完全没有减慢。',
        en: 'She twists open a sports drink one-handed for a generous gulp, flashed a radiant grin as she passed, and never slowed down.'
      },
      seen('你被一阵迎面吹来的夏日元气撞了一下', 'You were brushed by a gust of pure summer energy')
    ]
  },
  {
    // 届かない恋的旋律。
    id: 'st_egg_white_album', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade'], weight: 3,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.setsuna,
        zh: '高架桥通道里回荡着一阵清澈又微带忧伤的歌声。系着红围巾的少女握着麦克风，正唱着一段熟悉的旋律。',
        en: 'A clear, slightly plaintive singing voice echoes through the arcade under the viaduct, a red-scarfed girl holding a mic.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.haruki,
        zh: '旁边一个戴眼镜、背着吉他琴包的男生正认真地调整着谱架，神情紧张又专注。',
        en: 'Beside her, a boy in glasses with a guitar gig bag adjusts a music stand with tense concentration.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.kazusa,
        zh: '几米外的柱子阴影下，一个身穿黑色大衣、长发及腰的高挑女生抱着琴谱文件夹静静站着，默默听着那段旋律。',
        en: 'In the shadow of a pillar a few paces back, a tall girl in a long black coat holds a sheet-music folder, listening in silence.'
      },
      {
        type: 'narration',
        zh: '虽然是三个人的乐声，不知为何空气中却弥漫着一丝让人心头微紧的寒意。',
        en: 'Though three people share the music, the air carries a chill that tugs inexplicably at the heart.'
      },
      seen('你听到了一段无法传达的冬日序曲', 'You heard a winter prelude that seemed unable to reach its destination')
    ]
  },
  {
    // 团长与资讯统合体。
    id: 'st_egg_sos_brigade', locationIds: ['sannomiya_station', 'kitano_slope'], weight: 3,
    timeSlots: ['afternoon'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.haruhi,
        zh: '车站前的小广场上，一个戴着红黄头带、手臂上别着"团长"红色袖标的女生正叉着腰指着天空。',
        en: 'In the small station plaza, a girl with an orange-yellow headband and a crimson "Brigade Chief" armband points boldly at the sky.'
      },
      {
        type: 'narration',
        zh: '她大声宣布着今天一定要在神户找到外星人、未来人和超能力者的紧急探索计划。',
        en: 'She announces with total authority an urgent expedition across Kobe to locate aliens, time travellers, and espers.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.yuki_nagato,
        zh: '她身后那位戴着无框眼镜、身材娇小的紫短发女生，正端着一本厚厚的精装书面无表情地翻过一页，仿佛自成一个维度。',
        en: 'Behind her, a petite girl with lilac hair and rimless glasses turns a page in a thick hardcover book without expression, as if in a dimension of her own.'
      },
      seen('你差点被卷入一场拯救世界级别的非日常', 'You narrowly escaped being drafted into an unscheduled anomaly')
    ]
  },
  {
    // 坡道上飞落的白色贝雷帽。
    id: 'st_egg_beret_slope', locationIds: ['kitano_slope', 'kitano_lookout'], weight: 3,
    timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '北野坂一阵微风吹过，路旁樱花花瓣飘落，一顶白色的贝雷帽骨碌碌滚到了你的脚边。',
        en: 'A gust of wind sweeps down the Kitano slope, scattering cherry petals, and rolls a white beret right up to your feet.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.megumi,
        zh: '你弯腰捡起来。坡道上方一个穿着粉色开衫毛衣的少女正轻轻按着头发回过头来。',
        en: 'You pick it up. Up the hill, a girl in a pink cardigan holding down her dark bob turns around.'
      },
      {
        type: 'narration',
        zh: '她从你手里接过帽子，说了声谢谢，声音不大。说完她就转身继续上坡了。',
        en: 'She takes the hat from you and says thank you, not loudly. Then she turns and carries on up the slope.'
      },
      {
        // 备用那张立绘用在这儿：她走上去、停住、回头。
        // 第一张是接帽子的正面，这一张是隔着二十级台阶的那个回头，
        // 两张分开才对得上"四秒"这个说法。
        type: 'narration', characterImage: EASTER_EGG_SPRITES.megumi_alt,
        zh: '走出二十级台阶她停了一下，回头看了看你手里那顶已经空了的手。她没有再说什么，帽子按在头上继续走了。',
        en: 'Twenty steps up she stops and looks back at the hand you are still holding out, empty now. She does not say anything else. The hat goes on and she carries on.'
      },
      {
        type: 'narration',
        zh: '她走了以后你还站在原地。刚才那件事一共花了四秒，而你打算记很久。',
        en: 'You are still standing there after she has gone. The whole thing took four seconds and you intend to keep it for a while.'
      },
      seen('你在坂道上经历了一次宿命般的回眸', 'You experienced a fateful glance back along a sloping road')
    ]
  },
  {
    // 疯狂科学家与狂气助手。
    id: 'st_egg_mad_scientist', locationIds: ['pia_kobe_arcade', 'meriken_park'], weight: 3,
    timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.okabe,
        zh: '高架下的一根立柱旁，一个披着敞开白大褂的男人把根本没亮屏的翻盖手机贴在耳边，手里紧握着一罐Dr Pepper。',
        en: 'By a viaduct pillar, a man in an unbuttoned white lab coat holds a dark flip phone to his ear, clutching a can of Dr Pepper in the other hand.'
      },
      {
        type: 'narration',
        zh: '「……是我。机关的特工似乎已经跟踪我到了关西。哼，一切都是命运石之门的选择。El Psy Kongroo。」',
        en: '"...It\'s me. The Organisation\'s hounds appear to have tracked me to Kansai. Heh. This is the choice of Steins Gate. El Psy Kongroo."'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.kurisu,
        zh: '旁边双手抱胸、一头酒红色长发的女生翻了个白眼，叹了口气：「バカ岡部……别在公众场合犯中二了，快点去赶电车。」',
        en: 'Beside him, a red-haired girl in tights folds her arms, rolls her eyes, and mutters: "Idiot Okabe... stop embarrassing us and catch the train."'
      },
      seen('你偷听了一通跨越世界线的秘密通话', 'You eavesdropped on a top-secret phone call across world lines')
    ]
  },
  {
    // 兔耳发夹与墨镜。
    id: 'st_egg_bunny_actress', locationIds: ['meriken_park', 'suma_beach'], weight: 3,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.mai,
        zh: '海边长椅上坐着一位身材高挑、气质出众的女生，长发上别着一枚精致的兔耳发夹。她正摘下一副大号墨镜。',
        en: 'On a coastal bench sits a remarkably elegant girl with a delicate bunny-ear barrette in her dark hair, sliding off oversized sunglasses.'
      },
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.sakuta,
        zh: '旁边一个双手插兜、校服领带略微松垮的男生走过来，顺手把一罐刚买的温热奶茶递到她手心。',
        en: 'A boy with his hands in his trouser pockets and loose necktie strolls over, dropping a warm can of milk tea into her palm.'
      },
      {
        type: 'narration',
        zh: '「明明大家都看不见我，你买两罐给谁喝啊？」女生挑眉看着他。男生只是打了个哈欠：「因为我想看你喝。」',
        en: '"Nobody else can see me anyway, who did you buy two for?" she arches an eyebrow. The boy merely yawns: "Because I wanted to see you drink it."'
      },
      {
        // 备用那张用在这儿：她没有反驳，只是把拉环拉开了。
        type: 'narration', characterImage: EASTER_EGG_SPRITES.mai_alt,
        zh: '她没有反驳。拉环拉开的时候「啵」了一声，海风把那个声音带得很远。她喝了一口，没有看他。',
        en: 'She does not argue. The ring-pull gives a small pop and the sea wind carries the sound a long way. She takes a mouthful without looking at him.'
      },
      seen('你隐隐察觉到了某种不被常理所束缚的默契', 'You sensed an unspoken understanding unconstrained by ordinary logic')
    ]
  },
  {
    // 坡道下面抱着团子玩偶的女孩。
    id: 'st_egg_dango_family', locationIds: ['convenience_store', 'sannomiya_arcade'], weight: 3,
    timeSlots: ['afternoon'],
    script: [
      {
        type: 'narration', characterImage: EASTER_EGG_SPRITES.nagisa,
        zh: '面包店门外的长椅上，坐着一个双手紧紧抱着粉色团子玩偶的女孩。头顶的两根呆毛随风微微晃动。',
        en: 'On the bench outside a bakery sits a girl hugging a plush pink dango with both hands. Her twin ahoge sway gently in the breeze.'
      },
      {
        type: 'narration',
        zh: '她正微微摇晃着身子，小声哼唱着一首非常轻柔温暖的儿歌：「だんご、だんご、だんご……だんご大家族……」',
        en: 'She sways gently side to side, humming an extraordinarily sweet melody: "Dango, dango, dango... dango daikazoku..."'
      },
      {
        type: 'narration',
        zh: '听到那旋律的瞬间，不知为何，心里忽然莫名涌上一股想要流泪的温柔。',
        en: 'The moment the tune catches your ear, an inexplicable wave of tender warmth wells up in your chest.'
      },
      seen('你被一首古老温柔的儿歌抚平了疲惫', 'You were soothed by an ancient, gentle nursery rhyme')
    ]
  }
];

// ---------------------------------------------------------
// 挑一条来演
// ---------------------------------------------------------
export interface StreetCtx {
  flags: StoryFlags;
  calendar: GameCalendar;
}

const eligible = (s: StreetScene, locationId: string, ctx: StreetCtx): boolean => {
  if (!s.locationIds.includes(locationId)) return false;
  if (!s.repeatable && ctx.flags[s.id]) return false;
  if (s.timeSlots && !s.timeSlots.includes(ctx.calendar.timeSlot)) return false;
  if (s.weather && !s.weather.includes(ctx.calendar.weather)) return false;
  if (s.requiresFlags && !s.requiresFlags.every(f => ctx.flags[f])) return false;
  if (s.forbidsFlags && s.forbidsFlags.some(f => ctx.flags[f])) return false;
  if (s.minDay !== undefined && schoolDayNumber(ctx.calendar) < s.minDay) return false;
  return true;
};

// 按权重抽。彩蛋的权重压到 3，日常小景是 10——
// 撞见彩蛋应该是"哎？"，不是"又来了"。
// 有下文的那一批彩蛋（带选择、带主角吐槽）单独放一个文件，
// 但走的是同一个池子——玩家不该感觉到「这是另一套系统」。
// 街上那几个会反复遇到的人（占卜的、看地下偶像的、遛狗的…）也进同一个池子。
export const ALL_STREET_SCENES: StreetScene[] = [...STREET_SCENES, ...EASTER_SCENES, ...STREET_PEOPLE, ...OTAKU_SCENES, ...OTAKU_SCENES_2, ...NPC_ARCS];

export const pickStreetScene = (locationId: string, ctx: StreetCtx): StreetScene | null => {
  const pool = ALL_STREET_SCENES.filter(s => eligible(s, locationId, ctx));
  if (!pool.length) return null;
  const total = pool.reduce((n, s) => n + (s.weight ?? 10), 0);
  let r = Math.random() * total;
  for (const s of pool) {
    r -= (s.weight ?? 10);
    if (r <= 0) return s;
  }
  return pool[pool.length - 1];
};
