import { StoryNode } from '../types';
import type { StreetScene } from './streetScenes';

// ---------------------------------------------------------
// 🥚 彩蛋 · 雨夜、电子羊、多脚战车、月亮
//
// 《仿生人会梦见电子羊吗？》（连同它的电影）、《攻壳机动队》、
// 《赛博朋克：边缘行者》——三部都是讲"人到底是什么"的，
// 放在一座港口城市的夜里刚好合适：神户也有霓虹、雨、和看得见月亮的防波堤。
//
// 规矩跟 easterScenes.ts 一样：
//   一个名字都不出现，主角一个都不认识，台词一句都不抄。
// 这一批连人都尽量不让他们开口——留下来的是东西：
// 一只电子羊、一只锡纸折的独角兽、一个蓝色扭蛋、一张去月亮的传单。
// 带回家的那几样会躺在持ち物里（data/itemCatalog.ts 的纪念品）。
//
// 「pay:金额」是剧情里花钱（App.applyStoryFlags 负责从钱包里扣）。
// ---------------------------------------------------------

const seen = (zh: string, en: string): StoryNode => ({
  type: 'effect',
  effects: [{ stat: 'knowledge', amount: 1, reasonZh: zh, reasonEn: en }]
});

export const SCIFI_EASTER_SCENES: StreetScene[] = [
  // =========================================================
  // 🐑 二手店里的电子羊
  // 梗：它会不会做梦。前一个主人每晚都在问。
  // 后续：铃会发来一条消息，问你一个关于沙漠和乌龟的问题。
  // =========================================================
  {
    id: 'st_egg_electric_sheep',
    minDay: 4,
    locationIds: ['surugaya_sannomiya'],
    weight: 6,
    script: [
      { type: 'narration', zh: '駿河屋最里面那排玻璃柜，平时放的是旧掌机和缺了零件的模型。今天最上层多了一只巴掌大的羊。', en: 'The glass case at the very back of the shop usually holds old handhelds and model kits missing parts. Today, on the top shelf, there is a sheep about the size of your hand.' },
      { type: 'narration', zh: '毛是真的羊毛，摸上去有点扎手。可是翻过来，肚子底下有一个拧螺丝的电池盖。价签上写着：「電気羊（動作品）¥300」。', en: 'The wool is real and a little scratchy. Turn it over, though, and there is a screw-down battery cover on its belly. The tag says: ELECTRIC SHEEP (WORKING) ¥300.' },
      {
        type: 'speech', speakerZh: '店员', speakerEn: 'Clerk',
        jp: '前の持ち主さん、毎晩これを枕元に置いてたらしいですよ。「こいつ、夢見るのかな」ってずっと気にしてたって。',
        words: [{ jp: '枕元', reading: 'まくらもと', zh: '枕边', en: 'bedside' }],
        zh: '听说前一个主人每天晚上都把它放在枕头边。一直在纠结「这家伙会不会做梦」。',
        en: 'The previous owner kept it by their pillow every night, apparently. Always wondering whether it dreams.'
      },
      { type: 'narration', zh: '你不知道羊会不会做梦。说实话，你连自己今晚会不会做梦都不知道。', en: 'You have no idea whether sheep dream. Honestly, you do not know whether you will tonight.' },
      {
        type: 'choice',
        promptZh: '它的玻璃眼睛正对着你。', promptEn: 'Its glass eyes are pointed straight at you.',
        options: [
          {
            id: 'egg_sheep_buy', labelZh: '买下来（¥300）', labelEn: 'Buy it (¥300)',
            jp: 'これ、ください。',
            hintZh: '你房间里还缺一个会动的东西', hintEn: 'Your room could use something that moves',
            setFlags: ['egg_sheep_bought', 'pay:300'],
            effects: [{ stat: 'kindness', amount: 1, reasonZh: '你给一只不知道会不会做梦的羊找了个新枕头', reasonEn: 'You found a new pillow for a sheep that may or may not dream' }],
            then: [
              { type: 'narration', zh: '店员用旧报纸把它包起来。纸包里传出很轻的一声「咩」——电池还活着。', en: 'The clerk wraps it in old newspaper. From inside the parcel comes a very small "baa". The battery is still alive.' },
              { type: 'speech', speakerZh: '店员', speakerEn: 'Clerk', jp: '電池は生きてますね。羊のほうは、どうだか。', zh: '电池倒是还活着。羊嘛，就不好说了。', en: 'The battery is alive, anyway. The sheep, who can say.' }
            ]
          },
          {
            id: 'egg_sheep_switch', labelZh: '按一下它背上的开关', labelEn: 'Press the switch on its back',
            hintZh: '就试一下', hintEn: 'Just to see',
            then: [
              { type: 'narration', zh: '「咩——」。合成出来的声音，尾音有一点点抖。两只眼睛亮了一下绿光，又暗下去。', en: '"Baaa." A synthesised bleat, with a tiny wobble at the end. Its eyes flash green once and go dark.' },
              { type: 'narration', zh: '你把它放回去的时候，觉得它好像比刚才更像一只羊了。你说不清是哪里变了。', en: 'Putting it back, you feel it looks more like a sheep than it did a moment ago. You cannot say what changed.' }
            ]
          }
        ]
      },
      seen('一只电子羊，和一个关于做梦的问题', 'An electric sheep, and a question about dreaming')
    ]
  },

  // =========================================================
  // 🦄 雨夜，长椅上的锡纸独角兽
  // 只在下雨的夜里。男人一句话都不留，留下的是那只折纸。
  // =========================================================
  {
    id: 'st_egg_rain_unicorn',
    minDay: 6,
    locationIds: ['sannomiya_station', 'ikuta_road'],
    timeSlots: ['night'],
    weather: ['rainy'],
    weight: 8,
    script: [
      { type: 'narration', zh: '雨下得很密。霓虹招牌的光被雨水拉成一条一条，日文、英文、汉字的广告在积水里倒着闪。', en: 'The rain is thick. Neon signs smear into long streaks, ads in Japanese, English and kanji flickering upside down in the puddles.' },
      { type: 'narration', zh: '站前的长椅上坐着一个穿长风衣的男人。雨顺着他的头发往下淌，他好像根本没打算躲。手里在慢慢折着一张锡纸——口香糖的包装纸。', en: 'On the bench outside the station sits a man in a long coat. Rain runs down his hair and he seems to have no intention of moving out of it. In his hands he is slowly folding a scrap of foil. A gum wrapper.' },
      { type: 'narration', zh: '折好之后，他把它放在长椅上，站起来，竖起衣领，走进了人群。没有回头。', en: 'When it is done he sets it down on the bench, stands, turns up his collar and walks into the crowd. He does not look back.' },
      { type: 'narration', zh: '长椅上是一只小小的锡纸独角兽。雨点打在上面，嗒、嗒，它没有倒。', en: 'On the bench is a tiny foil unicorn. The rain taps on it, tap, tap, and it does not fall over.' },
      {
        type: 'choice',
        promptZh: '雨还在下。', promptEn: 'The rain keeps coming.',
        options: [
          {
            id: 'egg_unicorn_take', labelZh: '把独角兽捡起来，揣进口袋', labelEn: 'Pick up the unicorn and pocket it',
            hintZh: '放在这儿，明天早上就被扫掉了', hintEn: 'Leave it and it will be swept away by morning',
            setFlags: ['egg_unicorn_kept'],
            effects: [{ stat: 'kindness', amount: 1, reasonZh: '你留下了一件别人不打算留下的东西', reasonEn: 'You kept something someone else meant to leave behind' }],
            then: [
              { type: 'narration', zh: '锡纸被雨打得冰凉。你小心地把它放进胸口的口袋，生怕把角压弯。', en: 'The foil is cold from the rain. You slip it into your breast pocket carefully, afraid of bending the horn.' }
            ]
          },
          {
            id: 'egg_unicorn_follow', labelZh: '追上去，问他这是什么意思', labelEn: 'Go after him and ask what it means',
            hintZh: '你追不上的', hintEn: 'You will not catch him',
            effects: [{ stat: 'guts', amount: 1, reasonZh: '你冲进了雨里', reasonEn: 'You ran out into the rain' }],
            then: [
              { type: 'narration', zh: '你挤过两把伞、三个上班族，风衣的背影就在前面，然后在一个路口拐了个弯，就不在了。', en: 'You squeeze past two umbrellas and three office workers. The coat is just ahead — then it turns a corner, and it is not there.' },
              { type: 'narration', zh: '雨声里你好像听见有人低声说了一句：「見てきたことを全部話しても、誰も信じない」。你不确定那是不是对你说的。', en: 'Through the rain you think you hear someone murmur that nobody would believe the things they have seen. You are not sure it was meant for you.' },
              { type: 'narration', zh: '回到长椅，独角兽已经被雨打塌了一半。', en: 'Back at the bench, the unicorn has half collapsed in the rain.' }
            ]
          }
        ]
      },
      seen('一个雨夜，和一只锡纸独角兽', 'A rainy night and a foil unicorn')
    ]
  },

  // =========================================================
  // 🕷 扭蛋墙上的蓝色多脚战车
  // 它会问问题。问得很多，问得很认真。
  // =========================================================
  {
    id: 'st_egg_blue_spider',
    minDay: 3,
    locationIds: ['sannomiya_arcade'],
    weight: 6,
    script: [
      { type: 'narration', zh: '中央街的扭蛋墙最边上，多了一台新机器。贴纸上写着：「AI搭載！しゃべる多脚戦車 全5種」，一次三百日元。', en: 'At the far end of the Center Gai capsule wall there is a new machine. The sticker reads: AI-POWERED! TALKING MULTI-LEGGED TANKS, 5 TYPES. Three hundred yen a go.' },
      { type: 'narration', zh: '样品就摆在旁边：圆滚滚的蓝色身体，四条腿，前面两颗大大的眼球，像一只吃得太饱的蜘蛛。', en: 'The sample sits beside it: a round blue body, four legs, two big eye-pods at the front, like a spider that has eaten too much.' },
      { type: 'narration', zh: '旁边的小学生按了一下样品的背。它用一种很高、很快活的合成音说：「ねえねえ！ボクにも、ゴーストってあるのかな？」', en: 'A primary schooler next to you presses the sample’s back. In a high, delighted synthetic voice it asks whether it, too, might have a ghost.' },
      { type: 'narration', zh: '小学生被问住了，转头看你。', en: 'The kid has no answer and turns to look at you.' },
      {
        type: 'choice',
        promptZh: '小学生在等你说点什么。', promptEn: 'The kid is waiting for you to say something.',
        options: [
          {
            id: 'egg_spider_buy', labelZh: '自己扭一个（¥300）', labelEn: 'Get one yourself (¥300)',
            hintZh: '五种，希望是蓝的', hintEn: 'Five kinds. Hoping for blue',
            setFlags: ['egg_spider_got', 'pay:300'],
            effects: [{ stat: 'charm', amount: 1, reasonZh: '小学生羡慕地看着你的扭蛋', reasonEn: 'The kid looked at your capsule with open envy' }],
            then: [
              { type: 'narration', zh: '咔哒、咔哒。滚出来的是蓝色的那只——五分之一的概率，你今天运气不错。', en: 'Click, click. Out rolls the blue one. One in five. Your luck is in today.' },
              { type: 'narration', zh: '你按了一下它的背。「天然オイル、ちょうだい！」它说。你不知道该上哪儿给它找天然机油。', en: 'You press its back. It asks you for natural oil. You have no idea where to get any.' }
            ]
          },
          {
            id: 'egg_spider_answer', labelZh: '「……あるんじゃない？聞いてくるくらいだし」', labelEn: '"...Probably? It asked, after all."',
            jp: '……あるんじゃない？聞いてくるくらいだし。',
            hintZh: '会问这种问题的，大概都有', hintEn: 'Anything that asks that probably does',
            effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你用日语回答了一个哲学问题', reasonEn: 'You answered a philosophical question in Japanese' }],
            then: [
              { type: 'narration', zh: '小学生想了想，很认真地点了点头，然后又按了一下。扭蛋说：「やったー！じゃあ、今日からボクたち友だちだね！」', en: 'The kid thinks about it, nods very seriously and presses it again. The toy cheers that, in that case, you are all friends from today.' }
            ]
          }
        ]
      },
      seen('一只想知道自己有没有灵魂的扭蛋', 'A capsule toy that wanted to know if it had a soul')
    ]
  },

  // =========================================================
  // 🌃 楼顶边缘的女人
  // 她往后一仰就掉下去了。然后下面什么都没有——
  // 只有空气扭了一下，像夏天柏油路上的热浪。
  // =========================================================
  {
    id: 'st_egg_shell_dive',
    minDay: 10,
    locationIds: ['mosaic_night', 'kobe_harbor'],
    timeSlots: ['night'],
    weight: 5,
    script: [
      { type: 'narration', zh: '港口那栋高楼的楼顶边缘，站着一个人。', en: 'At the edge of the roof of the tall building by the harbour, someone is standing.' },
      { type: 'narration', zh: '短发，深色的长外套，海风把下摆吹得猎猎作响。她低头看着脚下整座城市的灯——一格一格、一条一条地连起来，像一张没有边的网。', en: 'Short hair, a long dark coat snapping in the sea wind. She is looking down at the lights of the whole city beneath her — square after square, line after line, joined up like a net with no edge.' },
      { type: 'narration', zh: '然后她张开手臂，往后一仰，就那么掉了下去。', en: 'Then she spreads her arms, leans back, and simply falls.' },
      {
        type: 'choice',
        promptZh: '你的心脏漏跳了一拍。', promptEn: 'Your heart skips.',
        options: [
          {
            id: 'egg_dive_run', labelZh: '跑到楼底下去看', labelEn: 'Run to the foot of the building',
            effects: [{ stat: 'guts', amount: 1, reasonZh: '你第一个冲了过去', reasonEn: 'You were the first to run' }],
            then: [
              { type: 'narration', zh: '楼底下什么都没有。没有人，没有声音，地砖干干净净。', en: 'There is nothing at the bottom. No one, no sound. The paving is spotless.' },
              { type: 'narration', zh: '只有你面前半空里的一块空气轻轻扭曲了一下，像夏天柏油路上的热浪，然后朝人群的方向"走"开了。连那个也看不见了。', en: 'Only a patch of air in front of you ripples faintly, like a heat haze over summer asphalt — and then moves off towards the crowd. Then even that is gone.' }
            ]
          },
          {
            id: 'egg_dive_phone', labelZh: '掏出手机想拍下来', labelEn: 'Get your phone out to film it',
            effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你的手机看见了你没看见的东西', reasonEn: 'Your phone saw something you did not' }],
            then: [
              { type: 'narration', zh: '屏幕一亮，画面里只有空荡荡的楼顶。', en: 'The screen lights up on an empty rooftop.' },
              { type: 'narration', zh: '下一秒，取景框上闪过一行绿色的小字：「――広いな」。然后手机自己回到了主屏幕，相册里什么都没存下来。', en: 'A second later a line of small green text flickers across the viewfinder — just a word about how wide it all is — and the phone drops back to the home screen. Nothing was saved to the album.' }
            ]
          }
        ]
      },
      seen('一个从楼顶掉进夜色里、然后不见了的人', 'Someone who fell off a roof into the night and was not there')
    ]
  },

  // =========================================================
  // 🌕 防波堤上的两个人，和去月亮的传单
  // 一件大得不合身的黄外套，一头发梢通了电似的银色短发。
  // 不说名字，不说结局。他们骑着那辆破摩托走了，留下一张传单。
  // =========================================================
  {
    id: 'st_egg_moon_flyer',
    minDay: 12,
    locationIds: ['meriken_park', 'kitano_lookout'],
    timeSlots: ['night'],
    weather: ['sunny', 'cloudy', 'sunset'],
    weight: 6,
    script: [
      { type: 'narration', zh: '今晚的月亮又大又亮，低低地挂在海面上，像有人把它往下拉了一截。', en: 'The moon is huge and bright tonight, hanging low over the water as if someone had pulled it down a little.' },
      { type: 'narration', zh: '栏杆边并排坐着两个人。男生穿一件大得不合身的黄色夹克，领口和袖口镶着荧光绿——看上去像是别人的衣服，他穿得很小心。', en: 'Two people sit side by side at the railing. The boy wears a yellow jacket far too big for him, trimmed in fluorescent green at the collar and cuffs — it looks like someone else’s, and he wears it carefully.' },
      { type: 'narration', zh: '女生一头银色的短发，发梢染成粉色和蓝色，在路灯底下像是通了电。她抬起手，指着月亮。', en: 'The girl has a silver bob with the tips dyed pink and blue, which look electric under the street lamp. She lifts a hand and points at the moon.' },
      {
        type: 'speech', speakerZh: '银发的女生', speakerEn: 'Silver-haired Girl',
        jp: '……いつか、あそこ行くの。',
        zh: '……总有一天，要去那里。', en: '...Someday I am going up there.'
      },
      {
        type: 'speech', speakerZh: '穿黄夹克的男生', speakerEn: 'Boy in the Yellow Jacket',
        jp: '連れてく。絶対。',
        zh: '我带你去。一定。', en: 'I will take you. Definitely.'
      },
      { type: 'narration', zh: '女生笑了一下，说他的约定太轻了。可她把头靠到了他肩膀上。', en: 'She laughs and says his promises are too light. But she leans her head on his shoulder.' },
      { type: 'narration', zh: '过了一会儿，两个人跨上一辆改得乱七八糟的小摩托。排气管喷出一串火星，引擎声撕开夜色，消失在港口的车流里。', en: 'After a while they climb onto a scooter modified to within an inch of its life. The exhaust spits a string of sparks, the engine tears through the night, and they vanish into the harbour traffic.' },
      { type: 'narration', zh: '风把一张传单吹到你脚边：「月面旅行・片道チケット 抽選受付中」。一看就是骗人的。背面用荧光笔写着两个字母。', en: 'The wind blows a flyer to your feet: MOON TRAVEL — ONE-WAY TICKETS, LOTTERY NOW OPEN. Obviously a scam. On the back, two initials in highlighter.' },
      {
        type: 'choice',
        promptZh: '月亮还在那儿。', promptEn: 'The moon is still there.',
        options: [
          {
            id: 'egg_moon_keep', labelZh: '把传单叠好收起来', labelEn: 'Fold the flyer and keep it',
            hintZh: '万一他们回来找', hintEn: 'In case they come back for it',
            setFlags: ['egg_moon_flyer_kept'],
            effects: [{ stat: 'kindness', amount: 1, reasonZh: '你替两个陌生人保管了一个约定', reasonEn: 'You are keeping a promise safe for two strangers' }],
            then: [
              { type: 'narration', zh: '你把它对折了两次，放进钱包最里面那一层。后来你再也没见过那两个人。月亮倒是每晚都在。', en: 'You fold it twice and tuck it into the innermost pocket of your wallet. You never see the two of them again. The moon, though, is there every night.' }
            ]
          },
          {
            id: 'egg_moon_bin', labelZh: '扔进旁边的垃圾箱', labelEn: 'Drop it in the bin',
            hintZh: '骗人的东西', hintEn: 'It is a scam',
            then: [
              { type: 'narration', zh: '传单落进垃圾箱的时候，你不知道为什么有点后悔。你抬头看了一眼月亮，它很近，近得好像真的能去。', en: 'As it drops into the bin you feel, for no reason you can name, a little sorry. You look up at the moon. It is close. Close enough that it seems you really could go.' }
            ]
          }
        ]
      },
      seen('两个想去月亮的人', 'Two people who wanted to go to the moon')
    ]
  }
];
