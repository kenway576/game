import { StreetScene } from './streetScenes';
import { EASTER_EGG_SPRITES, STREET_NPC_SPRITES, SCHOOL_NPC_SPRITES } from '../constants';

// ==========================================================
// 🎌 主角是个二次元 · 第二批
//
// 第一批十条立住了写法，这一批把密度加上去。规矩不变：
//   一、梗由主角自己接，不是旁白解释
//   二、"忍住没说"永远是一个选项，而且经常更好笑
//   三、被吐槽的人不知道自己被吐槽了
//   四、不写原作名，只写那个场面
//
// 【这一批多了一条】
// 有几条的笑点是**主角接错了**——他把一个普通场面认成了名场面，
// 然后发现不是。这比每次都接对更像一个真的宅：
// 认错的次数总是比认对的多。
// ==========================================================

const E = EASTER_EGG_SPRITES;
const P = STREET_NPC_SPRITES;
const S = SCHOOL_NPC_SPRITES;

const seen = (zh: string, en: string) => ({
  type: 'effect' as const,
  effects: [{ stat: 'knowledge' as const, amount: 1, reasonZh: zh, reasonEn: en }]
});

export const OTAKU_SCENES_2: StreetScene[] = [
  // ---------------------------------------------------------
  // ⚡ 「我要成为海贼王」：卡拉OK 隔壁包厢
  // ---------------------------------------------------------
  {
    id: 'ot2_karaoke', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade'],
    weight: 4, minDay: 60, timeSlots: ['night'],
    script: [
      {
        type: 'narration',
        zh: '走廊里隔壁包厢的隔音不太行。你听见有人在唱一首你非常熟的动画片头曲，唱得非常投入，也非常不准。',
        en: 'The soundproofing on the next karaoke room is not good. Somebody in there is singing an anime opening you know extremely well, with total commitment and no accuracy whatsoever.'
      },
      {
        type: 'narration',
        zh: '唱到副歌的时候，房间里所有人一起喊了那句台词。喊完是一阵爆笑，然后有人开始咳嗽。',
        en: 'At the chorus everybody in the room shouts the line together. Then there is a burst of laughing and somebody starts coughing.'
      },
      {
        type: 'choice',
        promptZh: '你站在走廊上，手里端着两杯从饮料吧接来的乌龙茶。',
        promptEn: 'You are standing in the corridor with two cups of oolong from the drink bar.',
        options: [
          {
            id: 'ot2_kara_join',
            labelZh: '在走廊上跟着喊了那句',
            labelEn: 'Shout the line, in the corridor',
            hintZh: '你比里面那些人还熟这一句', hintEn: 'You know that line better than they do.',
            effects: [
              { stat: 'guts', amount: 3, reasonZh: '你对着一扇陌生的门喊了一句台词', reasonEn: 'You shouted a line at a stranger\'s door' },
              { stat: 'charm', amount: 2, reasonZh: '而且喊得比里面准', reasonEn: 'And you were more in tune than they were' }
            ],
            setFlags: ['ot2_karaoke_shout'],
            then: [
              {
                type: 'narration',
                zh: '里面安静了一秒。然后门开了一条缝，一个人探出头来，看见走廊上端着两杯茶的你。',
                en: 'One second of silence. Then the door opens a crack and somebody puts their head out, and finds you in the corridor holding two cups of tea.'
              },
              {
                type: 'narration',
                zh: '他朝你竖了个大拇指，把门关上了。你端着两杯茶回自己包厢，一路上心情非常好。',
                en: 'He gives you a thumbs up and shuts the door. You carry the tea back to your own room in an extremely good mood.'
              }
            ]
          },
          {
            id: 'ot2_kara_pass',
            labelZh: '装作没听见，走回自己包厢',
            labelEn: 'Pretend not to have heard, and go back to your own room',
            hintZh: '茶要凉了', hintEn: 'The tea is getting cold.',
            effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有去打断别人的高兴', reasonEn: 'You did not interrupt somebody else’s good time' }],
            then: [
              {
                type: 'narration',
                zh: '你走回去的一路上都在心里跟着唱。第二段你也会。',
                en: 'You sing along in your head the whole way back. You know the second verse too.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🍜 「我开动了」：食堂那一声
  // ---------------------------------------------------------
  {
    id: 'ot2_itadakimasu', locationIds: ['school_terrace', 'ramen_shop_interior'],
    weight: 4, minDay: 40, timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '你端着托盘坐下。旁边那桌一个男生把手合在一起，说了一声「いただきます」。',
        en: 'You sit down with your tray. At the next table a boy puts his hands together and says the word for beginning a meal.'
      },
      {
        type: 'narration',
        zh: '不是随口说的那种。是完整的、清楚的、双手合十的那种。',
        en: 'Not the offhand version. The full one: clear, both hands together.'
      },
      {
        type: 'choice',
        promptZh: '你的手停在筷子上。',
        promptEn: 'Your hand stops on the chopsticks.',
        options: [
          {
            id: 'ot2_ita_do',
            labelZh: '也把手合起来，说一遍',
            labelEn: 'Put your hands together and say it too',
            jp: 'いただきます。',
            hintZh: '你在动画里看过一千遍这个动作', hintEn: 'You have seen that gesture a thousand times, on a screen.',
            effects: [
              { stat: 'kindness', amount: 2, reasonZh: '你开始做这里的人做的事', reasonEn: 'You have started doing what people here do' }
            ],
            setFlags: ['ot2_itadakimasu'],
            then: [
              {
                type: 'narration',
                zh: '说完你自己愣了一下。这个动作你在屏幕上见过一千次，但这是你第一次真的做。',
                en: 'You pause afterwards. You have seen that a thousand times on a screen. That was the first time you have done it.'
              },
              {
                type: 'narration',
                zh: '旁边那个男生朝你看了一眼，然后什么也没说，开始吃了。这件事在这里根本不值得一提。',
                en: 'The boy at the next table glances over, says nothing, and starts eating. Here it is not worth remarking on at all.'
              }
            ]
          },
          {
            id: 'ot2_ita_skip',
            labelZh: '直接开吃',
            labelEn: 'Just start eating',
            hintZh: '你饿了', hintEn: 'You are hungry.',
            effects: [{ stat: 'guts', amount: 1, reasonZh: '你没有为了像本地人而演一遍', reasonEn: 'You did not perform it in order to look local' }],
            then: [
              {
                type: 'narration',
                zh: '你吃到一半才想起来。想起来之后你把筷子放下，补了一遍，非常小声。',
                en: 'It comes back to you halfway through. You put the chopsticks down and do it retrospectively, very quietly.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🌀 「不是这个世界的常识吗」：认错了的名场面
  // ---------------------------------------------------------
  {
    id: 'ot2_misfire', locationIds: ['kitano_slope', 'ikuta_road', 'school_bicycle_parking'],
    weight: 4, minDay: 82,
    script: [
      {
        type: 'narration',
        zh: '坡道上有个女生蹲在自行车旁边，链条掉了，手上已经黑了一片。',
        en: 'A girl is crouched beside a bicycle on the slope. The chain is off and her hands are already black.'
      },
      {
        type: 'narration',
        zh: '你脑子里立刻响起了一整套流程：走过去、蹲下、三下装好、她抬头、慢镜头、片头曲。',
        en: 'A complete sequence assembles itself in your head: walk over, crouch, three motions, she looks up, slow motion, opening theme.'
      },
      {
        type: 'choice',
        promptZh: '你走过去了。',
        promptEn: 'You go over.',
        options: [
          {
            id: 'ot2_mis_try',
            labelZh: '「手伝おうか。」',
            labelEn: '"Want a hand?"',
            jp: '手伝おか？',
            hintZh: '你没修过自行车链条', hintEn: 'You have never put a bicycle chain back on.',
            effects: [
              { stat: 'guts', amount: 2, reasonZh: '你在完全不会的情况下开了口', reasonEn: 'You offered while having no idea' },
              { stat: 'proficiency', amount: 1, reasonZh: '而且你学会了', reasonEn: 'And you did learn it' }
            ],
            setFlags: ['ot2_chain'],
            then: [
              {
                type: 'narration',
                zh: '她抬头看了你两秒，然后往旁边挪了一点，把位置让出来。',
                en: 'She looks up at you for two seconds and shifts over, making room.'
              },
              {
                type: 'narration',
                zh: '你蹲下去，弄了六分钟。中间链条弹开两次，第二次抽到了你的手指。',
                en: 'You crouch down and spend six minutes on it. The chain comes off twice more and the second time it catches your finger.'
              },
              {
                type: 'narration',
                zh: '最后是她自己装好的。她三下就装好了。她一直知道怎么装，她只是手太脏想歇一下。',
                en: 'In the end she does it herself, in three motions. She knew how the whole time. Her hands were just filthy and she wanted a moment.'
              },
              {
                type: 'narration',
                zh: '「ありがと。」她说完就骑走了。没有慢镜头，没有片头曲。你的手指在流血。',
                en: 'She thanks you and rides off. No slow motion, no opening theme. Your finger is bleeding.'
              },
              {
                type: 'effect',
                effects: [{ stat: 'kindness', amount: 2, reasonZh: '你帮的忙没有用，但你确实蹲下去了', reasonEn: 'The help was no help, but you did crouch down' }]
              }
            ]
          },
          {
            id: 'ot2_mis_watch',
            labelZh: '想了一下，还是走了',
            labelEn: 'Think about it and keep walking',
            hintZh: '你确实不会修', hintEn: 'You genuinely cannot do it.',
            effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你知道自己不会什么', reasonEn: 'You know what you cannot do' }],
            then: [
              {
                type: 'narration',
                zh: '你走出二十米回头看了一眼。她已经装好了，正在用纸巾擦手。',
                en: 'Twenty metres on you look back. She has already fixed it and is wiping her hands on a tissue.'
              },
              {
                type: 'narration',
                zh: '三下。你数了。',
                en: 'Three motions. You counted.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🕶 「やれやれ」的另一半：图书室里的读书人
  // ---------------------------------------------------------
  {
    id: 'ot2_bookclub', locationIds: ['school_library', 'junkudo_bookstore'],
    weight: 4, minDay: 95, timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration', characterImage: E.yukino,
        zh: '窗边那个位子上有人在看书。她看书的姿势非常直，一个小时没换过。',
        en: 'Somebody is reading at the seat by the window. She sits extremely straight and has not changed position in an hour.'
      },
      {
        type: 'narration', characterImage: E.hachiman,
        zh: '斜对面那个人也在看书。他看书的姿势正好相反——整个人陷在椅子里，手里还捏着一罐咖啡。',
        en: 'The one diagonally opposite is also reading, in exactly the opposite way: sunk into the chair with a can of coffee in one hand.'
      },
      {
        type: 'narration',
        zh: '一个小时里他们没有说过一句话，也没有看过对方一眼。但他们翻页的时机，有四次是同时的。',
        en: 'In an hour they do not say a word or look at each other once. Their page turns coincide four times.'
      },
      {
        type: 'choice',
        promptZh: '你在他们中间那张桌子上写作业，一个字都没写进去。',
        promptEn: 'You are doing homework at the table between them and have written nothing.',
        options: [
          {
            id: 'ot2_book_count',
            labelZh: '继续数他们同时翻页的次数',
            labelEn: 'Keep counting the simultaneous page turns',
            hintZh: '这比作业有意思', hintEn: 'More interesting than the homework.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你观察了一小时，作业一个字没写', reasonEn: 'An hour of observation and not one word of homework' }],
            setFlags: ['ot2_page_count'],
            then: [
              {
                type: 'narration',
                zh: '第七次的时候，那个男生忽然抬头看了她一眼。她没有抬头，但翻页的手停了半秒。',
                en: 'On the seventh, the boy suddenly looks up at her. She does not look up. Her hand stops for half a second.'
              },
              {
                type: 'narration',
                zh: '你收拾东西走了。这种事你不该继续看下去。',
                en: 'You pack up and go. That is not something you should keep watching.'
              }
            ]
          },
          {
            id: 'ot2_book_work',
            labelZh: '低头把作业做完',
            labelEn: 'Put your head down and do the homework',
            hintZh: '明天要交', hintEn: 'It is due tomorrow.',
            effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你在一个非常有意思的场面旁边做完了作业', reasonEn: 'You finished your homework next to something extremely interesting' }],
            then: [
              {
                type: 'narration',
                zh: '你做完了。抬头的时候两个人都不在了，桌上留着一罐没开的咖啡，和一本反扣着的书。',
                en: 'You finish. When you look up both of them have gone. There is an unopened can of coffee on the table, and a book face down beside it.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🔬 「エル・プサイ・コングルゥ」：白大褂
  // ---------------------------------------------------------
  {
    id: 'ot2_labcoat', locationIds: ['school_science_lab', 'pia_kobe_arcade'],
    weight: 4, minDay: 105, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: E.okabe,
        zh: '理科室门口站着一个穿白大褂的人。他在打电话，声音大得整条走廊都听得见，内容你一个字也听不懂。',
        en: 'Somebody in a lab coat is standing outside the science room on the phone, loudly enough for the whole corridor, and you cannot follow a word of it.'
      },
      {
        type: 'narration',
        zh: '不是因为日语。是因为那些词单独拿出来你都认得，连在一起完全不成立。',
        en: 'Not because of the Japanese. Because you know all of the words individually and they do not go together.'
      },
      {
        type: 'narration', characterImage: E.kurisu,
        zh: '理科室里面有个女生把门推开一条缝，看了他三秒，把门关上了。',
        en: 'Inside the science room a girl pushes the door open a crack, looks at him for three seconds, and shuts it again.'
      },
      {
        type: 'choice',
        promptZh: '他挂了电话，转过身，正好看见你。',
        promptEn: 'He hangs up, turns round, and sees you.',
        options: [
          {
            id: 'ot2_lab_play',
            labelZh: '配合他，压低声音说一句「……了解した」',
            labelEn: 'Play along. Lower your voice: "...Understood."',
            jp: '……了解した。',
            hintZh: '他等的就是有人接', hintEn: 'Somebody taking it is exactly what he is waiting for.',
            requires: { stat: 'charm', min: 8 },
            effects: [
              { stat: 'charm', amount: 3, reasonZh: '你接住了一个没有人接的梗', reasonEn: 'You took a bit that nobody takes' },
              { stat: 'guts', amount: 1, reasonZh: '在走廊上，当着别人的面', reasonEn: 'In a corridor, in front of people' }
            ],
            setFlags: ['ot2_labcoat_played'],
            then: [
              {
                type: 'narration',
                zh: '他整个人亮了一下。他非常严肃地朝你点了点头，然后大步走了，白大褂在身后甩开。',
                en: 'His whole face changes. He nods at you with enormous gravity and strides off, coat swinging.'
              },
              {
                type: 'narration', characterImage: E.kurisu,
                zh: '理科室的门又开了。那个女生看着他的背影，然后转向你，说了一句：「……あんたも同類か。」',
                en: 'The science room door opens again. The girl watches him go, then turns to you and says: so you are one of them as well.'
              }
            ]
          },
          {
            id: 'ot2_lab_pass',
            labelZh: '点个头走过去',
            labelEn: 'Nod and walk past',
            hintZh: '你今天没这个精力', hintEn: 'You do not have it in you today.',
            effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有笑话他', reasonEn: 'You did not laugh at him' }],
            then: [
              {
                type: 'narration',
                zh: '你走过去的时候他还在原地站着，像是在等什么。你回头看了一眼，他已经开始打第二个电话了。',
                en: 'He is still standing there as you pass, as if waiting for something. You look back once. He has started a second call.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🎸 「结束バンド」：练团室外面
  // ---------------------------------------------------------
  {
    id: 'ot2_band_shy', locationIds: ['music_room', 'pia_kobe_arcade'],
    weight: 4, minDay: 120, timeSlots: ['afternoon'],
    script: [
      {
        type: 'narration', characterImage: E.bocchi,
        zh: '音乐室门口站着一个粉头发的女生，抱着吉他盒，已经站了不知道多久。她没有推门。',
        en: 'A pink-haired girl is standing outside the music room holding a guitar case, and has been for an unknown length of time. She has not opened the door.'
      },
      {
        type: 'narration',
        zh: '门里有人在调音。调了大概两分钟。她的手一直搭在门把上。',
        en: 'Somebody inside is tuning up. It goes on for about two minutes. Her hand stays on the handle.'
      },
      {
        type: 'choice',
        promptZh: '你从她后面走过。',
        promptEn: 'You come up behind her.',
        options: [
          {
            id: 'ot2_band_open',
            labelZh: '什么也不说，替她把门推开',
            labelEn: 'Say nothing, and push the door open for her',
            hintZh: '她推不动那扇门，不是因为门重', hintEn: 'It is not the weight of the door.',
            effects: [
              { stat: 'kindness', amount: 3, reasonZh: '你没有问她为什么不进去', reasonEn: 'You did not ask her why she was not going in' }
            ],
            setFlags: ['ot2_band_door'],
            then: [
              {
                type: 'narration',
                zh: '门开了。里面三个人同时抬头，其中一个立刻喊了一声她的名字，语气非常自然，像是已经喊了很多次。',
                en: 'The door opens. Three people look up at once and one of them says her name immediately, in a completely ordinary way, as if she has said it many times before.'
              },
              {
                type: 'narration', characterImage: E.nijika,
                zh: '「おっそーい！」那个人说。她被拽了进去，门在你面前关上了。',
                en: '"You took ages!" She is pulled inside and the door shuts in front of you.'
              },
              {
                type: 'narration',
                zh: '你在走廊上站了两秒才走。你什么也没做，你只是推了一下门。',
                en: 'You stand in the corridor for two seconds before moving on. You did not do anything. You pushed a door.'
              }
            ]
          },
          {
            id: 'ot2_band_wait',
            labelZh: '停下来，跟她一起站着',
            labelEn: 'Stop, and stand there with her',
            hintZh: '不催她', hintEn: 'Do not hurry her.',
            effects: [{ stat: 'guts', amount: 2, reasonZh: '陪一个陌生人站在一扇门前面', reasonEn: 'Standing in front of a door with a stranger' }],
            then: [
              {
                type: 'narration',
                zh: '你站了大概四十秒。她一直没有看你，但呼吸慢慢平下来了。',
                en: 'You stand there about forty seconds. She never looks at you. Her breathing settles.'
              },
              {
                type: 'narration',
                zh: '然后她自己推开了门。进去之前她朝你的方向很快地低了一下头，快到你不确定那算不算一个鞠躬。',
                en: 'Then she opens it herself. On the way in she dips her head very fast in your direction, fast enough that you are not sure it counted as a bow.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🥟 「面对疾风吧」：南京町的蒸笼
  // ---------------------------------------------------------
  {
    id: 'ot2_steam', locationIds: ['nankinmachi', 'motomachi_arcade'],
    weight: 4, minDay: 68,
    script: [
      {
        type: 'narration',
        zh: '南京町的蒸笼一掀，白气整个糊了过来，两米之内什么都看不见。',
        en: 'The lid comes off a steamer in Nankinmachi and the white cloud swallows everything within two metres.'
      },
      {
        type: 'narration',
        zh: '你在那团白气里站了两秒，脑子里冒出来一句非常不合时宜的台词。',
        en: 'You stand in it for two seconds and an extremely inappropriate line surfaces in your head.'
      },
      {
        type: 'choice',
        promptZh: '白气正在散。',
        promptEn: 'The steam is clearing.',
        options: [
          {
            id: 'ot2_steam_say',
            labelZh: '（在心里）「……面对疾风吧。」',
            labelEn: '(internally) "...Face the gale."',
            hintZh: '这是蒸汽不是疾风', hintEn: 'It is steam, not a gale.',
            effects: [{ stat: 'charm', amount: 2, reasonZh: '你在一团肉包的热气里想起了一句台词', reasonEn: 'A line came to you inside a cloud of pork-bun steam' }],
            setFlags: ['ot2_steam_line'],
            then: [
              {
                type: 'narration',
                zh: '白气散了。摊主正在看你，手里还举着蒸笼盖。',
                en: 'The steam clears. The stallholder is looking at you with the lid still in his hand.'
              },
              {
                type: 'narration',
                zh: '「兄ちゃん、二個でええ？」他问。你说好。你买了两个。',
                en: '"Two, mate?" You say yes. You buy two.'
              }
            ]
          },
          {
            id: 'ot2_steam_buy',
            labelZh: '直接买两个',
            labelEn: 'Just buy two',
            hintZh: '你饿了', hintEn: 'You are hungry.',
            effects: [{ stat: 'kindness', amount: 1, reasonZh: '你把第二个留到了晚上', reasonEn: 'You saved the second one for the evening' }],
            then: [
              {
                type: 'narration',
                zh: '烫得没法拿。你在两只手之间倒了三次才咬第一口。',
                en: 'Too hot to hold. You move it between your hands three times before the first bite.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🐟 「なんでもは知らないわよ」：问路
  // ---------------------------------------------------------
  {
    id: 'ot2_knowall', locationIds: ['school_library', 'junkudo_bookstore', 'juku'],
    weight: 4, minDay: 140, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: E.yuki_nagato,
        zh: '你在书架间找一本书，找了十五分钟。转身的时候差点撞上一个人——她站在那儿不知道多久了，手里也拿着一本书。',
        en: 'Fifteen minutes looking for one book between the shelves. Turning round you nearly walk into somebody who has been standing there for an unknown length of time, also holding a book.'
      },
      {
        type: 'narration',
        zh: '你把书名报给她。她想都没想就抬起手，指了斜后方第三个书架的第二层。',
        en: 'You give her the title. Without any pause she raises a hand and points at the second shelf of the third stack behind her.'
      },
      {
        type: 'narration',
        zh: '书在那儿。第二层，从左边数第七本。',
        en: 'It is there. Second shelf, seventh from the left.'
      },
      {
        type: 'choice',
        promptZh: '你回头想说声谢谢。',
        promptEn: 'You turn to thank her.',
        options: [
          {
            id: 'ot2_know_ask',
            labelZh: '「……你什么都知道吗？」',
            labelEn: '"...Do you know everything?"',
            jp: '……なんでも知ってるんですか。',
            hintZh: '这句话你想说很久了', hintEn: 'You have wanted to ask that for a while.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你问了一个你其实知道答案的问题', reasonEn: 'You asked a question you already knew the answer to' }],
            setFlags: ['ot2_knowall_asked'],
            then: [
              {
                type: 'narration',
                zh: '她没有立刻回答。她把手里那本书翻了一页，然后说：「昨日、その本を戻したのは私です。」',
                en: 'She does not answer at once. She turns a page of her own book, then says: I was the one who reshelved it yesterday.'
              },
              {
                type: 'narration',
                zh: '你笑出了声。这是这个图书室里最不该出声的地方，你还是笑出了声。',
                en: 'You laugh out loud. This is the worst possible place in the library to do that, and you do it anyway.'
              }
            ]
          },
          {
            id: 'ot2_know_thanks',
            labelZh: '好好说声谢谢',
            labelEn: 'Just thank her properly',
            hintZh: '她帮了你十五分钟的忙', hintEn: 'She saved you fifteen minutes.',
            effects: [{ stat: 'kindness', amount: 2, reasonZh: '你把那句谢谢说完整了', reasonEn: 'You said the whole thank-you' }],
            then: [
              {
                type: 'narration',
                zh: '她点了一下头，幅度非常小，然后继续看自己的书。你走的时候她还在原地。',
                en: 'She nods, by a very small amount, and goes back to her own book. She is still there when you leave.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // ☂️ 「一起打伞」的现实版
  // ---------------------------------------------------------
  {
    id: 'ot2_umbrella', locationIds: ['kitano_slope', 'sannomiya_station', 'ikuta_road'],
    weight: 5, minDay: 88, weather: ['rainy'],
    script: [
      {
        type: 'narration',
        zh: '雨下得很急。屋檐下站了四个人，都在等它小一点，谁也没说话。',
        en: 'The rain comes down hard. Four people are under the awning waiting for it to ease, none of them talking.'
      },
      {
        type: 'narration',
        zh: '你有伞。你旁边那个女生没有。',
        en: 'You have an umbrella. The girl beside you does not.'
      },
      {
        type: 'narration',
        zh: '你想到的那个画面是：撑开伞，往她那边倾一点，两个人默默走完一条街。',
        en: 'The image that comes to you is: open it, tilt it her way, and walk a street in silence.'
      },
      {
        type: 'choice',
        promptZh: '你的手已经握在伞柄上了。',
        promptEn: 'Your hand is already on the handle.',
        options: [
          {
            id: 'ot2_umb_offer',
            labelZh: '「駅まで、入りますか。」',
            labelEn: '"As far as the station, if you like."',
            jp: '駅まで、入りますか。',
            hintZh: '说出口比想象中难', hintEn: 'Saying it is harder than imagining it.',
            requires: { stat: 'guts', min: 10 },
            effects: [
              { stat: 'guts', amount: 4, reasonZh: '你在四个陌生人面前说了这句话', reasonEn: 'You said it in front of four strangers' }
            ],
            setFlags: ['ot2_umbrella_offered'],
            then: [
              {
                type: 'narration',
                zh: '她愣了一下，然后从包里掏出一把折叠伞，撑开了。「あ、持ってます。ありがとうございます。」',
                en: 'She blinks, produces a folding umbrella from her bag and opens it. "Ah — I have one. Thank you though."'
              },
              {
                type: 'narration',
                zh: '她走了。屋檐下剩下的三个人里，有两个也掏出了伞。',
                en: 'She goes. Of the three people left under the awning, two also produce umbrellas.'
              },
              {
                type: 'narration',
                zh: '这个国家的人包里都有伞。这件事你到今天才知道。',
                en: 'People in this country carry umbrellas in their bags. You did not know that until today.'
              },
              {
                type: 'effect',
                effects: [{ stat: 'knowledge', amount: 2, reasonZh: '一条在这里根本不成立的桥段', reasonEn: 'A scene that simply does not work here' }]
              }
            ]
          },
          {
            id: 'ot2_umb_silent',
            labelZh: '撑开伞，自己走',
            labelEn: 'Open it and go on your own',
            hintZh: '她也许有伞', hintEn: 'She might have one.',
            effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你没有假设别人需要你', reasonEn: 'You did not assume somebody needed you' }],
            then: [
              {
                type: 'narration',
                zh: '你走出十米回头看了一眼。她已经撑着自己的伞往反方向去了。',
                en: 'Ten metres on you look back. She is already going the other way under her own umbrella.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🍙 「便当交换」：真的发生了
  // ---------------------------------------------------------
  {
    id: 'ot2_bento_swap', locationIds: ['rooftop_sunset', 'school_terrace'],
    weight: 4, minDay: 155, requiresFlags: ['day1_done'], timeSlots: ['lunch'],
    script: [
      {
        type: 'narration', characterImage: S.kenta,
        zh: '健太在天台上打开便当盒，看了三秒，然后把盒子转了一百八十度，又看了三秒。',
        en: 'Kenta opens his lunch on the roof, looks at it for three seconds, rotates the box a hundred and eighty degrees and looks again.'
      },
      {
        type: 'narration',
        zh: '「なあ、」他说，「これ、何やと思う。」',
        en: '"Hey," he says. "What do you reckon this is."'
      },
      {
        type: 'narration',
        zh: '盒子里有一样东西是紫色的，形状是方的，上面插着一根牙签。',
        en: 'There is something purple in the box. It is square. There is a cocktail stick in it.'
      },
      {
        type: 'choice',
        promptZh: '他把盒子往你这边推了推。',
        promptEn: 'He pushes the box your way.',
        options: [
          {
            id: 'ot2_bento_eat',
            labelZh: '拿起来吃了',
            labelEn: 'Take it and eat it',
            hintZh: '经典桥段就是这么开始的', hintEn: 'This is how the classic version starts.',
            effects: [
              { stat: 'guts', amount: 3, reasonZh: '你吃了一个双方都不认识的东西', reasonEn: 'You ate a thing neither of you could identify' }
            ],
            setFlags: ['ot2_purple_thing'],
            then: [
              {
                type: 'narration',
                zh: '是甜的。非常甜。甜到你怀疑它本来是不是不该出现在便当里。',
                en: 'It is sweet. Extremely sweet. Sweet enough that you wonder whether it was meant to be in a lunchbox at all.'
              },
              {
                type: 'narration', characterImage: S.kenta,
                zh: '「うまい？」他问。你说甜。他说「ほな一個ちょうだい」，然后从你的便当里夹走了一块炸鸡。',
                en: '"Good?" You say it is sweet. He says in that case he will have one, and takes a piece of fried chicken out of yours.'
              },
              {
                type: 'narration',
                zh: '便当交换在现实里就是这样发生的：没有人脸红，没有人说什么，一块炸鸡换一个紫色的东西。',
                en: 'That is how the lunch swap actually happens: nobody blushes, nobody says anything, one piece of fried chicken for one purple thing.'
              }
            ]
          },
          {
            id: 'ot2_bento_guess',
            labelZh: '认真猜一下那是什么',
            labelEn: 'Have a serious go at identifying it',
            hintZh: '你在日本待了半年了', hintEn: 'You have been here six months.',
            effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你猜对了，而且他不信', reasonEn: 'You got it right and he did not believe you' }],
            then: [
              {
                type: 'narration',
                zh: '你说那是紫薯。他说不可能。你们查了手机。是紫薯。',
                en: 'You say purple sweet potato. He says no chance. You look it up. It is purple sweet potato.'
              },
              {
                type: 'narration', characterImage: S.kenta,
                zh: '「……留学生に負けた。」他说完把那块吃了，一边吃一边摇头。',
                en: '"...Beaten by the exchange student." He eats it, shaking his head throughout.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🌸 「转学生的自我介绍」：一年后的回响
  // ---------------------------------------------------------
  {
    id: 'ot2_new_transfer', locationIds: ['classroom_morning', 'school_terrace'],
    weight: 6, minDay: 300, timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '三月，班里来了一个插班生。一年级的，从东京转过来的，站在讲台上做自我介绍。',
        en: 'March, and there is a transfer student. A first-year from Tokyo, standing at the front doing the self-introduction.'
      },
      {
        type: 'narration',
        zh: '他紧张得声音发抖，名字说了两遍，第二遍才说清楚。全班笑了，是那种善意的笑。',
        en: 'His voice shakes. He says his name twice and only the second one is audible. The class laughs, and it is the friendly kind.'
      },
      {
        type: 'narration',
        zh: '你想起十一个月前你站在同一个位置。你当时数了地板上的木纹，数到第三十七条。',
        en: 'You remember standing in the same spot eleven months ago. You counted the boards in the floor and got to thirty-seven.'
      },
      {
        type: 'choice',
        promptZh: '下课之后，他一个人坐在座位上，谁也没搭话。',
        promptEn: 'After the bell he sits at his desk on his own and nobody speaks to him.',
        options: [
          {
            id: 'ot2_transfer_go',
            labelZh: '走过去，坐在他前排的椅子上转过来',
            labelEn: 'Go over, sit in the chair in front of him and turn round',
            hintZh: '当初有人这么对你', hintEn: 'Somebody did that for you.',
            effects: [
              { stat: 'kindness', amount: 5, reasonZh: '你做了别人当初对你做的那件事', reasonEn: 'You did the thing that was done for you' },
              { stat: 'charm', amount: 2, reasonZh: '而且你是用日语做的', reasonEn: 'And you did it in Japanese' }
            ],
            setFlags: ['ot2_transfer_helped'],
            then: [
              {
                type: 'narration',
                zh: '你问他知不知道食堂的乌冬多少钱。他说不知道。你说两百八，量少，会饿。',
                en: 'You ask if he knows what the cafeteria udon costs. He does not. You tell him: two hundred and eighty, not much of it, you stay hungry.'
              },
              {
                type: 'narration',
                zh: '他愣了一下，然后笑了。「……先輩、めっちゃ日本語うまいっすね。」',
                en: 'He blinks and then grins. "...Your Japanese is really good, senpai."'
              },
              {
                type: 'narration',
                zh: '你没有告诉他你是交换生。这一整年里，这是第一次有人默认你不是外国人。',
                en: 'You do not tell him you are the exchange student. In a whole year, that is the first time somebody has assumed by default that you are not foreign.'
              },
              {
                type: 'effect',
                effects: [{ stat: 'guts', amount: 3, reasonZh: '你走过去坐下了', reasonEn: 'You walked over and sat down' }]
              }
            ]
          },
          {
            id: 'ot2_transfer_watch',
            labelZh: '看着，没有过去',
            labelEn: 'Watch, and do not go over',
            hintZh: '会有人过去的', hintEn: 'Somebody will.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你在看一件你经历过的事', reasonEn: 'You were watching something that has happened to you' }],
            then: [
              {
                type: 'narration',
                zh: '三分钟后有人过去了。是健太。他一屁股坐在前排的椅子上，转过来就开始说话。',
                en: 'Three minutes later somebody does. It is Kenta. He drops into the chair in front and turns round already talking.'
              },
              {
                type: 'narration',
                zh: '你想起来了：一年前坐在你前面那张椅子上转过来的，也是他。',
                en: 'It comes back to you: a year ago, the person who turned round in the chair in front of you was also him.'
              }
            ]
          }
        ]
      }
    ]
  }
];
