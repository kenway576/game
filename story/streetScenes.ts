import { StoryNode, StoryFlags, GameCalendar, TimeSlot } from '../types';
// 立绘路径从 constants 那三张表取，不在这儿再抄一遍——
// 抄两遍的代价是换图时漏掉一处，而漏掉的那处不报错，只显示碎图标。
import { SCHOOL_NPC_SPRITES, CITY_NPC_SPRITES, EASTER_EGG_SPRITES } from '../constants';

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
        zh: '她转头看见你，做了个"别说出去"的口型，然后继续用非常生硬的日语跟那两个人说话。',
        en: 'She catches your eye, mouths at you not to tell, and goes back to speaking very stilted Japanese at them.'
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
        zh: '你没有。他说没事，然后徒手把链条装了回去，手上黑了一片，一点不在意。',
        en: 'You do not. He says never mind and puts it back on by hand, gets black to the wrist, and does not care.'
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
        zh: '他做到一半停下来，把橡皮擦得很干净，然后从那一题的第一行重新开始。',
        en: 'Halfway through he stops, rubs it out very cleanly, and starts that question again from the first line.'
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
        zh: '中间有一次没响。他停了半秒，把那一件翻过来重扫，然后节拍就接上了。',
        en: 'One of them does not beep. He stops for half a second, turns it over, scans again, and the rhythm resumes.'
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
  return true;
};

// 按权重抽。彩蛋的权重压到 3，日常小景是 10——
// 撞见彩蛋应该是"哎？"，不是"又来了"。
export const pickStreetScene = (locationId: string, ctx: StreetCtx): StreetScene | null => {
  const pool = STREET_SCENES.filter(s => eligible(s, locationId, ctx));
  if (!pool.length) return null;
  const total = pool.reduce((n, s) => n + (s.weight ?? 10), 0);
  let r = Math.random() * total;
  for (const s of pool) {
    r -= (s.weight ?? 10);
    if (r <= 0) return s;
  }
  return pool[pool.length - 1];
};
