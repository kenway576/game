import { StoryNode } from '../types';
import type { StreetScene } from './streetScenes';
import { EASTER_EGG_SPRITES } from '../constants';

// ---------------------------------------------------------
// 🥚 彩蛋 · 有下文的那一批
//
// 街头小景里本来就有一批彩蛋，但那些全是"看一眼就走"：
// 三句旁白，一个 flag，结束。认得出的人笑一下，认不出的人
// 连发生过都不知道。
//
// 这一批不一样。规矩还是老规矩——
//
//   **一个名字都不出现，主角一个都不认识。**
//
// 但多了两样东西：
//   ① 主角会吐槽。他不认识这些人，所以他的反应就是一个普通人
//      撞见这种场面时该有的反应——困惑、想帮忙、或者纯粹想笑。
//   ② 有选择。你可以搭话，可以装作没看见，也可以掺和进去。
//      掺和进去的那一条通常最有意思，而且往往有代价。
//
// 台词一句都不抄原作。他们做的事就是他们本身。
// ---------------------------------------------------------

const E = EASTER_EGG_SPRITES;

const seen = (zh: string, en: string): StoryNode => ({
  type: 'effect',
  effects: [{ stat: 'knowledge', amount: 1, reasonZh: zh, reasonEn: en }]
});

export const EASTER_SCENES: StreetScene[] = [
  // =========================================================
  // 🏃 撑杆跳
  //
  // 这一段是这批里最重要的一条，所以写得最长。
  //
  // 梗在于那一跳本身：高度不合理、助跑不够、竿子是竹的、
  // 落地的姿势像是被人按了暂停再拖过去的——但他**过去了**。
  // 主角是唯一一个在意物理学的人，而物理学在这个场地上不生效。
  //
  // 底下垫的是他为什么练：他练的不是撑杆跳。
  // ---------------------------------------------------------
  {
    id: 'st_egg_shirou_vault',
    minDay: 3,
    locationIds: ['gym', 'school_terrace', 'school_bicycle_parking'],
    weight: 4,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: E.shirou,
        zh: '操场角落有个红头发的男生，手里握着一根竹竿。',
        en: 'There is a red-haired boy in the corner of the grounds holding a bamboo pole.'
      },
      {
        type: 'narration',
        zh: '竹竿。不是撑杆跳用的那种玻璃纤维杆——是园艺店里绑番茄藤用的那种，两百日元一根的竹竿。',
        en: 'A bamboo pole. Not a fibreglass vaulting pole. The kind a garden centre sells for staking tomatoes, two hundred yen each.'
      },
      {
        type: 'narration',
        zh: '横杆架在大概三米二。你不太懂田径，但你知道三米二是什么概念——那是成年男子的水平，而且是拿真杆子的成年男子。',
        en: 'The bar is at something like three metres twenty. You do not follow athletics, but you know what three-twenty means: that is an adult mark, and adults use actual poles.'
      },
      {
        type: 'narration',
        zh: '他的助跑距离大约是六步。',
        en: 'His run-up is about six paces.'
      },
      {
        type: 'narration', characterImage: E.shirou,
        zh: '他跑了。他起跳了。',
        en: 'He runs. He takes off.'
      },
      {
        type: 'narration',
        zh: '他过去了。',
        en: 'He clears it.'
      },
      {
        type: 'narration',
        zh: '你在垫子边上站了大概五秒钟，脑子里只有一句话在转：那个动作不是这么用的。',
        en: 'You stand by the mat for about five seconds with a single sentence going round your head: that is not how that works.'
      },
      {
        type: 'narration',
        zh: '而且他在空中的姿势……很难形容。像是有人按了暂停，再用手把他拖到了横杆那一边。',
        en: 'And his shape in the air is hard to describe. As if somebody had hit pause and then dragged him over the bar by hand.'
      },
      {
        type: 'narration',
        zh: '你在心里给这一跳打了个分。动作三分，物理零分。',
        en: 'You score the jump privately. Three for form. Zero for physics.'
      },
      {
        type: 'narration', characterImage: E.shirou,
        zh: '他从垫子上爬起来，拍了拍身上的土，把横杆架回去——又往上抬了一格。',
        en: 'He gets off the mat, knocks the dust off, resets the bar, and raises it one more notch.'
      },

      {
        type: 'choice',
        promptZh: '他往手心里哈了口气，走回起跑点。',
        promptEn: 'He breathes onto his palms and walks back to the mark.',
        options: [
          {
            id: 'egg_vault_ask',
            labelZh: '「那根杆子是竹子的吧。」',
            labelEn: '"That pole is bamboo, isn\'t it."',
            jp: 'その棒、竹やんな。',
            hintZh: '你只是想确认一下这个世界还讲不讲道理',
            hintEn: 'You just want to confirm that the world still works.',
            effects: [
              { stat: 'knowledge', amount: 2, reasonZh: '你得到了一个不能解释任何事的解释', reasonEn: 'You obtained an explanation that explains nothing' }
            ],
            setFlags: ['egg_shirou_talked'],
            then: [
              {
                type: 'narration', characterImage: E.shirou,
                zh: '他回头看了你一眼，很自然地点了点头，好像你问的是天气。',
                en: 'He glances back and nods quite naturally, as though you had asked about the weather.'
              },
              {
                type: 'narration',
                zh: '你说：三米二，六步助跑，竹竿。他说：嗯。',
                en: 'You say: three-twenty, a six-pace run-up, bamboo. He says: yes.'
              },
              {
                type: 'narration',
                zh: '你说这在物理上说不通。他想了一下，然后给了你一个回答。',
                en: 'You say that does not work physically. He thinks about it, and then answers you.'
              },
              {
                type: 'narration', characterImage: E.shirou,
                zh: '「跳得过去，就说明跳得过去。」',
                en: '"If it goes over, then it goes over."'
              },
              {
                type: 'narration',
                zh: '这句话在逻辑上是成立的。这句话在逻辑上什么都没有说。你居然一时反驳不了。',
                en: 'That is logically valid. That is also logically empty. You find you cannot immediately argue with it.'
              }
            ]
          },
          {
            id: 'egg_vault_hold',
            labelZh: '过去帮他扶横杆',
            labelEn: 'Go and steady the bar for him',
            hintZh: '一个人架横杆要走两趟',
            hintEn: 'Resetting it alone means two trips.',
            effects: [
              { stat: 'kindness', amount: 2, reasonZh: '你替一个陌生人省了两趟路', reasonEn: 'You saved a stranger two walks' },
              { stat: 'guts', amount: 1, reasonZh: '你站在了一根即将被人越过的横杆旁边', reasonEn: 'You stood next to a bar somebody was about to clear' }
            ],
            setFlags: ['egg_shirou_helped'],
            then: [
              {
                type: 'narration',
                zh: '他愣了一下。说谢谢的时候他鞠了半个躬，认真得有点过头。',
                en: 'He blanks for a second. When he thanks you he goes into half a bow, rather more seriously than the occasion calls for.'
              },
              {
                type: 'narration',
                zh: '接下来一个小时你就一直在架横杆。他跳了十一次，掉了三次，你没有一次看清他是怎么过去的。',
                en: 'You spend the next hour resetting the bar. He jumps eleven times, drops it three, and you do not once see how he gets over.'
              },
              {
                type: 'narration', characterImage: E.shirou,
                zh: '第十二次他停下来，说今天就到这儿。竹竿他擦了一遍才收，从头擦到尾，两遍。',
                en: 'On the twelfth he stops and says that is enough for today. He wipes the bamboo pole down before putting it away. End to end. Twice.'
              },
              {
                type: 'narration',
                zh: '一根两百日元的竹竿。他擦了大概四十秒。',
                en: 'A two-hundred-yen bamboo pole. He spends about forty seconds on it.'
              }
            ]
          },
          {
            id: 'egg_vault_leave',
            labelZh: '什么都不说，走',
            labelEn: 'Say nothing. Walk away.',
            hintZh: '有些事看见了就够了',
            hintEn: 'Some things are enough to have seen.',
            effects: [{ stat: 'charm', amount: 1, reasonZh: '你没有去打断一件正在进行的事', reasonEn: 'You did not interrupt something in progress' }],
            then: [
              {
                type: 'narration',
                zh: '你走出二十米，身后又是一声闷响。隔了大概一秒，横杆才落地。',
                en: 'Twenty metres on there is another thud behind you. About a second after it, the bar comes down.'
              },
              {
                type: 'narration',
                zh: '再走二十米，又是一声。这一次横杆没有响。',
                en: 'Twenty more, and another thud. This time the bar makes no sound.'
              }
            ]
          }
        ]
      },

      {
        // 这张 CG 早就在 STORY_CGS 里注册了，但一直没有任何地方解锁它。
        // 它画的就是这一场：夕阳、操场、一次又一次的助跑。挂在这儿最合适。
        type: 'cg',
        cgId: 'cg_shirou_high_jump_sunset',
        imageUrl: '/images/cg/cg_shirou_high_jump_sunset.webp',
        titleZh: '黄昏操场的撑杆跳',
        titleEn: 'The Pole Vault at Dusk',
        captionZh: '夕阳把横杆的影子拉得比横杆本身长很多。他又走回了起跑点——第几次，你已经数不清了。',
        captionEn: 'The sunset draws the bar’s shadow far longer than the bar. He walks back to the mark again. You have lost count of which attempt this is.'
      },
      {
        type: 'narration',
        zh: '你临走前问了最后一个问题：练撑杆跳干嘛，学校又没有田径队的撑杆项目。',
        en: 'Before you go you ask one last thing: why train for the pole vault at all, when the school does not even run the event.'
      },
      {
        type: 'narration', characterImage: E.shirou,
        zh: '他说他练的不是撑杆跳。他说他练的是"翻墙"。',
        en: 'He says he is not training for the pole vault. He is training to get over a wall.'
      },
      {
        type: 'narration',
        zh: '你问哪面墙。',
        en: 'You ask which wall.'
      },
      {
        type: 'narration',
        zh: '他说他还没找到。他说等找到的时候再练就来不及了。',
        en: 'He says he has not found it yet. He says that once he has, it will be too late to start.'
      },
      {
        type: 'narration',
        zh: '你走出操场的时候天已经全黑了。身后还有声音。',
        en: 'It is fully dark by the time you leave the ground. There is still a sound behind you.'
      },
      seen('三米二、六步助跑、一根竹竿', 'Three-twenty, six paces, and one bamboo pole')
    ]
  },

  // =========================================================
  // 🍌 微波炉
  // 便利店后面那台微波炉。一个穿白大褂的人在跟它讲道理。
  // =========================================================
  {
    id: 'st_egg_microwave',
    minDay: 12,
    locationIds: ['convenience_store', 'hyakkin_store', 'sannomiya_station'],
    weight: 4,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: E.okabe,
        zh: '便利店的微波炉前面站着一个穿白大褂的男的。这个点、这个地方、白大褂。',
        en: 'A man in a lab coat is standing at the convenience store microwave. This hour, this place, a lab coat.'
      },
      {
        type: 'narration',
        zh: '他正在往里面放一根香蕉。没有拆皮，没有装盘，就是一根香蕉。',
        en: 'He is putting a banana into it. Not peeled, not on a plate. Just a banana.'
      },
      {
        type: 'narration',
        zh: '他按了一分钟。手机贴到耳朵上的时候另一只手还按着，他开始跟电话那头汇报进度。',
        en: 'He presses for a minute. The phone goes to his ear with the other hand still pressing, and he starts giving somebody a progress report.'
      },
      {
        type: 'narration',
        zh: '你从他左侧走过的时候瞥了一眼那个手机屏幕。是黑的。',
        en: 'Passing on his left you glance at the screen. It is off.'
      },
      {
        type: 'choice',
        promptZh: '微波炉转到第四十秒。他的语气开始变得很紧张。',
        promptEn: 'The microwave reaches forty seconds. His tone becomes noticeably tense.',
        options: [
          {
            id: 'egg_mw_play',
            labelZh: '配合他，压低声音问一句「実験は？」',
            labelEn: 'Play along. Ask, quietly, how the experiment is going.',
            jp: '……実験、どうっすか。',
            hintZh: '他等这句已经等很久了',
            hintEn: 'He has been waiting a long time for somebody to ask.',
            effects: [
              { stat: 'charm', amount: 3, reasonZh: '你接住了一个没人接的梗', reasonEn: 'You caught a bit that nobody else was catching' },
              { stat: 'guts', amount: 1, reasonZh: '你在便利店里跟陌生人演了一场戏', reasonEn: 'You did a scene with a stranger in a convenience store' }
            ],
            setFlags: ['egg_okabe_played'],
            then: [
              {
                type: 'narration', characterImage: E.okabe,
                zh: '他猛地转过来，眼睛亮得吓人。',
                en: 'He wheels round with alarmingly bright eyes.'
              },
              {
                type: 'narration',
                zh: '接下来的四分钟他给你讲了一套东西。你一个字都没听懂，但你注意到那套东西**内部是自洽的**。',
                en: 'For the next four minutes he explains something to you. You do not understand a word, but you notice that it is internally consistent.'
              },
              {
                type: 'narration',
                zh: '微波炉"叮"了一声。他停下来，打开门，看了一眼。',
                en: 'The microwave dings. He stops, opens it, and looks.'
              },
              {
                type: 'narration', characterImage: E.okabe,
                zh: '香蕉变成了一团绿色的东西。他非常严肃地把门关上了。',
                en: 'The banana has become a green mass. He closes the door very seriously.'
              },
              {
                type: 'narration',
                zh: '「……今日は、ここまでだ。」他说完就走了，没有拿走那根香蕉。',
                en: '"That is far enough for today," he says, and leaves without retrieving it.'
              },
              {
                type: 'narration',
                zh: '你在原地站了一会儿，然后替他把微波炉擦干净了。店员从头到尾没有抬过头。',
                en: 'You stand there a moment and then wipe the microwave out for him. The shop assistant never once looks up.'
              }
            ]
          },
          {
            id: 'egg_mw_stop',
            labelZh: '按停微波炉',
            labelEn: 'Stop the microwave',
            hintZh: '整根香蕉进微波炉是会爆的',
            hintEn: 'A whole banana in a microwave does explode.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你阻止了一次便利店事故', reasonEn: 'You prevented a convenience store incident' }],
            then: [
              {
                type: 'narration',
                zh: '你按了停止。他转过来看你，表情像是刚被打断了一件世界级的大事。',
                en: 'You hit stop. He turns to you with the expression of a man interrupted mid-world-event.'
              },
              {
                type: 'narration',
                zh: '你说：整根进去会爆。他沉默了三秒，然后非常郑重地说了一句「……そうか」。',
                en: 'You say: whole, it explodes. Three seconds of silence, and then, with great gravity, he says: I see.'
              },
              {
                type: 'narration',
                zh: '他拿出第二根香蕉。剥皮，放回去，位置和刚才一模一样。',
                en: 'He produces a second banana. Peels it, puts it back, in exactly the same position as before.'
              },
              {
                type: 'narration',
                zh: '你放弃了。',
                en: 'You give up.'
              }
            ]
          },
          {
            id: 'egg_mw_ignore',
            labelZh: '当作没看见，去结账',
            labelEn: 'See nothing. Go and pay.',
            hintZh: '这是便利店，这种事每周都有',
            hintEn: 'This is a convenience store. This happens weekly.',
            effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你学会了神户人的那种视而不见', reasonEn: 'You are learning the local art of not seeing things' }],
            then: [
              {
                type: 'narration',
                zh: '你排队、结账、出门。整个过程里店员和你都非常有默契地没有往微波炉那边看。',
                en: 'You queue, pay and leave. Throughout, neither you nor the assistant looks towards the microwave.'
              },
              {
                type: 'narration',
                zh: '你走到门口的时候，身后传来"砰"的一声。你没有回头。',
                en: 'At the door there is a bang behind you. You do not turn round.'
              }
            ]
          }
        ]
      },
      seen('一根没剥皮的香蕉，和一个关着机的手机', 'One unpeeled banana and one switched-off phone')
    ]
  },

  // =========================================================
  // 👀 没有人看见她
  // 图书馆里的那位学姐。问题不在于她好不好看。
  // =========================================================
  {
    id: 'st_egg_invisible_senpai',
    minDay: 25,
    locationIds: ['school_library', 'junkudo_bookstore', 'retro_kissaten'],
    weight: 4,
    script: [
      {
        type: 'narration', characterImage: E.mai,
        zh: '靠窗那张桌子坐着一个高个子的学姐，头发很长，手边放着一副墨镜。',
        en: 'At the window table sits a tall upperclassman with very long hair and a pair of sunglasses beside her.'
      },
      {
        type: 'narration',
        zh: '她长得非常显眼。图书馆里大概有二十个人。',
        en: 'She is extremely conspicuous. There are about twenty people in the library.'
      },
      {
        type: 'narration',
        zh: '你花了三分钟确认了一件事：这二十个人里，没有一个人看她。',
        en: 'It takes you three minutes to establish something: not one of those twenty people looks at her.'
      },
      {
        type: 'narration',
        zh: '不是"礼貌地不看"。是有个人从她椅子后面挤过去的时候，说了句「すみません」——对着空气说的。',
        en: 'Not politely not looking. Somebody squeezing behind her chair says "excuse me" — to the air.'
      },
      {
        type: 'choice',
        promptZh: '她抬起头，正好和你对上眼。',
        promptEn: 'She looks up, and meets your eyes.',
        options: [
          {
            id: 'egg_mai_greet',
            labelZh: '点个头',
            labelEn: 'Nod',
            hintZh: '就是一个普通的点头',
            hintEn: 'An entirely ordinary nod.',
            effects: [
              { stat: 'kindness', amount: 3, reasonZh: '你看见了一个别人看不见的人', reasonEn: 'You saw somebody nobody else could' }
            ],
            setFlags: ['egg_mai_nodded'],
            then: [
              {
                type: 'narration', characterImage: E.mai,
                zh: '她愣住了。愣了很久——久到你开始怀疑自己是不是认错了人。',
                en: 'She freezes. Long enough that you start wondering whether you have mistaken her for somebody.'
              },
              {
                type: 'narration',
                zh: '然后她也点了个头。动作很小，但很确实。',
                en: 'Then she nods back. A small motion, but a definite one.'
              },
              {
                type: 'narration',
                zh: '你坐下之后过了大概十分钟，她起身走了。经过你桌子的时候放下了一颗糖。',
                en: 'About ten minutes after you sit down she gets up and leaves. Passing your table she puts down a sweet.'
              },
              {
                type: 'narration',
                zh: '你抬头的时候她已经走到门口了。图书馆里没有一个人抬头。',
                en: 'By the time you look up she is at the door. Nobody in the library looks up.'
              }
            ]
          },
          {
            id: 'egg_mai_test',
            labelZh: '找个人问「那边那位是谁」',
            labelEn: 'Ask somebody who that is over there',
            hintZh: '你想验证一下',
            hintEn: 'You want to check.',
            effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你做了一次很小的、结果很吓人的实验', reasonEn: 'You ran a very small experiment with an alarming result' }],
            setFlags: ['egg_mai_tested'],
            then: [
              {
                type: 'narration',
                zh: '你问旁边一个正在写作业的男生：那边靠窗那位学姐是几年级的？',
                en: 'You ask a boy doing homework beside you which year the girl at the window table is in.'
              },
              {
                type: 'narration',
                zh: '他抬头看了一眼那个方向，然后转回来问你：哪位？',
                en: 'He looks over, then turns back and asks you: which girl?'
              },
              {
                type: 'narration',
                zh: '他的表情是真诚的。他不是在开玩笑。',
                en: 'His expression is sincere. He is not joking.'
              },
              {
                type: 'narration', characterImage: E.mai,
                zh: '你再看过去，她正低头看书，一页都没有翻过。',
                en: 'You look back. She is reading, and has not turned a page.'
              }
            ]
          }
        ]
      },
      seen('一个二十个人里只有一个人看得见的人', 'Somebody visible to one person in twenty')
    ]
  },

  // =========================================================
  // 📣 招人
  // 校门口的那个社团招新。你只是路过。
  // =========================================================
  {
    id: 'st_egg_recruit',
    minDay: 8,
    locationIds: ['school_terrace', 'school_bicycle_parking', 'international_office'],
    weight: 4,
    timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration', characterImage: E.haruhi,
        zh: '校门口摆了一张桌子。桌子后面站着一个戴着黄色臂章的女生，臂章上写了两个字，你没看清。',
        en: 'There is a table at the school gate. Behind it stands a girl wearing a yellow armband with two characters on it that you cannot make out.'
      },
      {
        type: 'narration',
        zh: '她拦下了从她面前经过的每一个人。你数了一下，十四个人里有十四个人被拦下了。',
        en: 'She stops everybody who passes. You count: fourteen out of fourteen.'
      },
      {
        type: 'narration',
        zh: '桌子的另一头坐着一个戴眼镜的女生，从头到尾在看书，一次都没有抬头。她面前也摆着一份报名表，一个人都没有填。',
        en: 'At the other end of the table sits a girl in glasses reading, who has not looked up once. There is a sign-up sheet in front of her too. Nobody has filled it in.'
      },
      {
        type: 'choice',
        promptZh: '轮到你了。她已经看见你了，而且已经开始往你这边走了。',
        promptEn: 'It is your turn. She has seen you and has already started walking over.',
        options: [
          {
            id: 'egg_haruhi_run',
            labelZh: '掉头就走',
            labelEn: 'Turn around and go',
            hintZh: '来得及',
            hintEn: 'There is time.',
            effects: [{ stat: 'guts', amount: 2, reasonZh: '你在正确的时刻做出了正确的判断', reasonEn: 'You made the correct judgement at the correct moment' }],
            then: [
              {
                type: 'narration',
                zh: '你走得非常快。快到你自己都觉得有点丢人。',
                en: 'You walk very fast. Fast enough that you are slightly ashamed of yourself.'
              },
              {
                type: 'narration',
                zh: '身后传来一句「ちょっと待って！」。你没有停。',
                en: 'A "wait a moment!" follows you. You do not stop.'
              },
              {
                type: 'narration',
                zh: '第二天你听说昨天被拦下的那十四个人里，有九个现在是那个社团的成员了。',
                en: 'The next day you hear that nine of those fourteen are now members of whatever that club is.'
              }
            ]
          },
          {
            id: 'egg_haruhi_sign',
            labelZh: '停下来，问一句这是什么社团',
            labelEn: 'Stop. Ask what club it is.',
            hintZh: '这是个错误的问题',
            hintEn: 'This is the wrong question.',
            effects: [
              { stat: 'guts', amount: 3, reasonZh: '你在明知道会发生什么的情况下停了下来', reasonEn: 'You stopped despite knowing what would happen' },
              { stat: 'knowledge', amount: 1, reasonZh: '你得到了一份你完全不需要的活动章程', reasonEn: 'You acquired a club charter you have no use for' }
            ],
            setFlags: ['egg_haruhi_caught'],
            then: [
              {
                type: 'narration', characterImage: E.haruhi,
                zh: '她讲了六分钟。中间没有停顿，也没有让你插话的位置。',
                en: 'She talks for six minutes without a pause or a gap for you to speak into.'
              },
              {
                type: 'narration',
                zh: '你到最后也没弄明白那是个什么社团。你只弄明白了一件事：**这个社团在找的东西还没有被找到**，而她非常确信它存在。',
                en: 'You never do work out what the club is. You work out one thing: whatever it is looking for has not been found, and she is entirely certain it exists.'
              },
              {
                type: 'narration',
                zh: '你签了名。你不记得自己是什么时候拿起笔的。',
                en: 'You sign. You do not remember picking up the pen.'
              },
              {
                type: 'narration', characterImage: E.yuki_nagato,
                zh: '桌子那头看书的女生翻了一页。就在你签完名的那一秒。',
                en: 'The girl at the other end of the table turns a page. In the same second that you finish signing.'
              },
              {
                type: 'narration',
                zh: '你不确定这两件事有没有关系。你后来想起这一天的时候，总觉得有。',
                en: 'You are not sure the two things are related. Whenever you think back on this day, you feel that they were.'
              }
            ]
          }
        ]
      },
      seen('一份你签了名但看不懂的报名表', 'A sign-up sheet you signed and cannot read')
    ]
  },

  // =========================================================
  // 🐟 水族馆
  // 须磨水族馆。那个人在鱼缸前面站了很久。
  // =========================================================
  {
    id: 'st_egg_aquarium',
    minDay: 40,
    locationIds: ['suma_aquarium', 'suma_beach', 'suma_fishing_pier'],
    weight: 4,
    script: [
      {
        type: 'narration', characterImage: E.jotaro,
        zh: '有个非常高的男的站在鱼缸前面。他戴着一顶帽子，帽檐和头发看上去像是长在一起的。',
        en: 'A very tall man is standing in front of the tank. His cap and his hair appear to be a single continuous object.'
      },
      {
        type: 'narration',
        zh: '他一动不动地看了大概十分钟。你路过的时候他还在那儿。你逛完一圈回来，他还在那儿。',
        en: 'He watches without moving for about ten minutes. He is there when you pass. He is still there when you have done a lap.'
      },
      {
        type: 'narration',
        zh: '鱼缸里是一群沙丁鱼。就是沙丁鱼。',
        en: 'The tank contains sardines. Just sardines.'
      },
      {
        type: 'choice',
        promptZh: '一个小孩跑过来敲了一下玻璃。',
        promptEn: 'A child runs up and raps on the glass.',
        options: [
          {
            id: 'egg_jotaro_watch',
            labelZh: '看他会怎么样',
            labelEn: 'See what he does',
            hintZh: '敲鱼缸是不行的',
            hintEn: 'You are not supposed to tap the glass.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你旁听了一堂关于沙丁鱼的课', reasonEn: 'You sat in on a lecture about sardines' }],
            setFlags: ['egg_jotaro_lecture'],
            then: [
              {
                type: 'narration', characterImage: E.jotaro,
                zh: '他低下头，看了那个小孩一眼。小孩的手停在半空。',
                en: 'He looks down at the child. The child\'s hand stops in mid-air.'
              },
              {
                type: 'narration',
                zh: '他蹲了下来，蹲到和小孩一样高，说了一句什么。语气跟刚才对你说话时一模一样。',
                en: 'He crouches down, all the way down to the child, and says something. In exactly the tone he used on you.'
              },
              {
                type: 'narration',
                zh: '接下来的三分钟，他给那个小孩讲了沙丁鱼群为什么会同时转向。讲得非常细，细到旁边围了六个大人。',
                en: 'For the next three minutes he explains to the child why a sardine school turns as one. In such detail that six adults gather to listen.'
              },
              {
                type: 'narration',
                zh: '讲完他站起来，把帽檐往下压了压，走了。小孩追着他妈妈说了一路的沙丁鱼。',
                en: 'When he has finished he stands, pulls the cap down, and goes. The child talks about sardines to its mother the entire way out.'
              }
            ]
          },
          {
            id: 'egg_jotaro_ask',
            labelZh: '等小孩走了，问他在看什么',
            labelEn: 'Wait for the child to go, then ask what he is looking at',
            hintZh: '那是一缸沙丁鱼',
            hintEn: 'It is a tank of sardines.',
            effects: [{ stat: 'charm', amount: 2, reasonZh: '你问了一个很短的问题，得到了一个很长的答案', reasonEn: 'You asked a short question and received a long answer' }],
            then: [
              {
                type: 'narration',
                zh: '他没有转头。他说了两个字，你没听清。你问了第二遍。',
                en: 'He does not turn his head. He says two words that you do not catch. You ask again.'
              },
              {
                type: 'narration', characterImage: E.jotaro,
                zh: '「数だ。」',
                en: '"The count."'
              },
              {
                type: 'narration',
                zh: '他说他从进馆开始就在数。他说这一缸的数量和牌子上写的对不上，差了四十七条。',
                en: 'He says he has been counting since he came in. He says the number in this tank does not match the sign. Forty-seven short.'
              },
              {
                type: 'narration',
                zh: '你说也许是牌子旧了。他说牌子是上个月换的。',
                en: 'You say the sign might be out of date. He says the sign was replaced last month.'
              },
              {
                type: 'narration',
                zh: '你在回去的电车上想了这件事一路。',
                en: 'You think about it the whole way back on the train.'
              }
            ]
          }
        ]
      },
      seen('一缸对不上数的沙丁鱼', 'A tank of sardines that does not add up')
    ]
  },

  // =========================================================
  // 🥞 可丽饼
  // 三宫的可丽饼摊。排在你前面的那个小孩。
  // =========================================================
  {
    id: 'st_egg_crepe',
    minDay: 18,
    locationIds: ['sannomiya_arcade', 'nankinmachi', 'mosaic_night', 'kobe_harbor'],
    weight: 4,
    script: [
      {
        type: 'narration', characterImage: E.anya,
        zh: '可丽饼摊前面排着队。你前面是一个很小的粉头发小孩，踮着脚看菜单。',
        en: 'There is a queue at the crepe stand. In front of you is a very small pink-haired child on tiptoe reading the menu.'
      },
      {
        type: 'narration',
        zh: '你还在犹豫要草莓还是香蕉巧克力。',
        en: 'You are still deciding between the strawberry and the banana chocolate.'
      },
      {
        type: 'narration', characterImage: E.anya,
        zh: '那个小孩忽然转过头，非常认真地看着你。看了三秒，说：「バナナのほう。」',
        en: 'The child turns round and looks at you with total seriousness. Three seconds of it. Then: "The banana one."'
      },
      {
        type: 'narration',
        zh: '你没有说过一个字。',
        en: 'You have not said a word.'
      },
      {
        type: 'choice',
        promptZh: '她已经转回去了，好像刚才什么都没发生。',
        promptEn: 'She has already turned back, as though nothing happened.',
        options: [
          {
            id: 'egg_anya_follow',
            labelZh: '就点香蕉巧克力',
            labelEn: 'Order the banana chocolate',
            hintZh: '她说得很确定',
            hintEn: 'She sounded certain.',
            effects: [{ stat: 'kindness', amount: 2, reasonZh: '你听了一个小孩的建议', reasonEn: 'You took a small child\'s advice' }],
            setFlags: ['egg_anya_obeyed'],
            then: [
              {
                type: 'narration',
                zh: '你点了香蕉巧克力。很好吃。',
                en: 'You order the banana chocolate. It is very good.'
              },
              {
                type: 'narration', characterImage: E.anya,
                zh: '你回头找那个小孩，她正站在几米外，冲你竖了个大拇指，笑得整张脸都皱起来了。',
                en: 'You look round for the child. She is a few metres away giving you a thumbs up with her whole face creased up.'
              },
              {
                type: 'narration',
                zh: '她旁边站着一个很高的黑发男人和一个很高的黑发女人，两个人都在看别的方向。',
                en: 'Beside her stand a very tall dark-haired man and a very tall dark-haired woman, both looking in different directions.'
              }
            ]
          },
          {
            id: 'egg_anya_defy',
            labelZh: '偏点草莓',
            labelEn: 'Order the strawberry out of spite',
            hintZh: '你只是想验证一下',
            hintEn: 'You just want to check something.',
            effects: [
              { stat: 'guts', amount: 2, reasonZh: '你跟一个小孩较了一次劲', reasonEn: 'You took a stand against a small child' },
              { stat: 'proficiency', amount: 1, reasonZh: '草莓那个也不难吃', reasonEn: 'The strawberry one is fine too' }
            ],
            then: [
              {
                type: 'narration',
                zh: '你点了草莓。也很好吃。',
                en: 'You order the strawberry. Also very good.'
              },
              {
                type: 'narration', characterImage: E.anya,
                zh: '你转身的时候，那个小孩正站在原地看着你，表情非常复杂。',
                en: 'As you turn, the child is standing there watching you with a very complicated expression.'
              },
              {
                type: 'narration',
                zh: '她好像想说什么，最后什么都没说，转身跑了。',
                en: 'She looks as though she wants to say something, says nothing, and runs off.'
              },
              {
                type: 'narration',
                zh: '五分钟后你才发现草莓那个的酱汁漏了，滴在你的鞋上。',
                en: 'Five minutes later you notice that the strawberry sauce has leaked onto your shoe.'
              }
            ]
          }
        ]
      },
      seen('一个在你开口之前就知道你要什么的小孩', 'A child who knew what you wanted before you said it')
    ]
  },

  // =========================================================
  // 🍞 面包店
  // 商店街那家。你其实来过三次了。
  // =========================================================
  {
    id: 'st_egg_bakery',
    minDay: 30,
    locationIds: ['sannomiya_arcade', 'nankinmachi', 'convenience_store'],
    weight: 4,
    script: [
      {
        type: 'narration', characterImage: E.nagisa,
        zh: '商店街那家面包店门口，一个女生站在那儿，怀里抱着一个很大的、看不出是什么的毛绒玩偶。',
        en: 'Outside the bakery in the shotengai stands a girl holding a very large plush of indeterminate species.'
      },
      {
        type: 'narration',
        zh: '她好像在给自己打气。深吸一口气，嘴唇动了几下，声音小得连你都听不见。',
        en: 'She seems to be talking herself into something. A deep breath, her lips moving, at a volume even you cannot pick up.'
      },
      {
        type: 'narration',
        zh: '然后她推门进去了。门上的铃响了一下。',
        en: 'Then she pushes the door open. The bell over it rings once.'
      },
      {
        type: 'narration',
        zh: '过了大概三秒，她又出来了。她站在门口，重新深吸了一口气。',
        en: 'About three seconds later she comes back out, stands by the door, and takes another breath.'
      },
      {
        type: 'choice',
        promptZh: '她进去出来了四次。第五次的时候，你和她对上了眼。',
        promptEn: 'She goes in and comes out four times. On the fifth, she catches your eye.',
        options: [
          {
            id: 'egg_nagisa_wait',
            labelZh: '什么都不说，跟她一起站着',
            labelEn: 'Say nothing. Stand there with her.',
            hintZh: '有些台阶是别人替不了的',
            hintEn: 'Some steps cannot be taken on somebody\'s behalf.',
            effects: [
              { stat: 'kindness', amount: 3, reasonZh: '你陪一个陌生人在门口站了十分钟', reasonEn: 'You stood outside a door with a stranger for ten minutes' }
            ],
            setFlags: ['egg_nagisa_waited'],
            then: [
              {
                type: 'narration',
                zh: '你就在旁边站着，也不看她，装作在看橱窗里的面包。',
                en: 'You stand nearby without looking at her, pretending to study the bread in the window.'
              },
              {
                type: 'narration',
                zh: '第六次她进去了，而且没有出来。',
                en: 'On the sixth she goes in and does not come out.'
              },
              {
                type: 'narration', characterImage: E.nagisa,
                zh: '五分钟后她出来了，手里拎着一个纸袋。她冲你鞠了一躬，鞠得很深。',
                en: 'Five minutes later she emerges with a paper bag and bows to you. Deeply.'
              },
              {
                type: 'narration',
                zh: '你什么都没做。你只是站在那儿。但她好像不这么认为。',
                en: 'You did nothing. You merely stood there. She appears to disagree.'
              }
            ]
          },
          {
            id: 'egg_nagisa_open',
            labelZh: '替她把门推开',
            labelEn: 'Hold the door open for her',
            hintZh: '有时候难的只是那扇门',
            hintEn: 'Sometimes the hard part really is the door.',
            effects: [{ stat: 'charm', amount: 3, reasonZh: '你替一个人省了第五次深呼吸', reasonEn: 'You saved somebody a fifth deep breath' }],
            then: [
              {
                type: 'narration',
                zh: '你走过去把门推开，然后往旁边让了一步。',
                en: 'You walk over, push the door open and step aside.'
              },
              {
                type: 'narration', characterImage: E.nagisa,
                zh: '她愣住了。道谢的时候话都撞在一起，人已经进门了。',
                en: 'She freezes. The thank-you comes out with the words on top of each other, and she is already through the door.'
              },
              {
                type: 'narration',
                zh: '你在外面听见她说话的声音——很小，但一句话说完了，中间没有停。',
                en: 'From outside you hear her speaking. Quietly, but a whole sentence, without stopping in the middle.'
              },
              {
                type: 'narration',
                zh: '你走的时候面包店的老板正在把一个大纸箱递给她。她抱不动，但她抱了。',
                en: 'As you leave, the baker is handing her a large box. She cannot carry it. She carries it.'
              }
            ]
          }
        ]
      },
      seen('一扇被推开了五次的门', 'A door pushed open five times')
    ]
  },

  // =========================================================
  // 📖 记不住的人
  // 这一条的梗只有在你**第二次**碰见的时候才成立。
  // =========================================================
  {
    id: 'st_egg_forgettable',
    minDay: 55,
    locationIds: ['kitano_slope', 'kitano_lookout', 'sannomiya_station', 'meriken_park'],
    weight: 4,
    repeatable: true,
    script: [
      {
        type: 'narration', characterImage: E.megumi,
        zh: '坡道上有个女生站在那儿看风景。白色的贝雷帽，粉色开衫。',
        en: 'A girl is standing on the slope looking at the view. White beret, pink cardigan.'
      },
      {
        type: 'narration',
        zh: '你从她旁边走过去，走出十几米之后停了下来。',
        en: 'You walk past her, and stop about fifteen metres on.'
      },
      {
        type: 'narration',
        zh: '你有一种很强烈的感觉：你以前见过她。',
        en: 'You have a strong feeling that you have seen her before.'
      },
      {
        type: 'narration',
        zh: '你回头看。她还站在那儿。',
        en: 'You look back. She is still standing there.'
      },
      {
        type: 'narration',
        zh: '你想不起来在哪儿见过。你甚至想不起来她刚才是什么样子——而她就在你眼前，十几米远。',
        en: 'You cannot place where. You cannot even recall what she looked like just now, and she is fifteen metres away in plain sight.'
      },
      {
        type: 'choice',
        promptZh: '她转过头，看见你在看她。',
        promptEn: 'She turns and sees you looking.',
        options: [
          {
            id: 'egg_megumi_ask',
            labelZh: '「我们是不是见过？」',
            labelEn: '"Have we met?"',
            jp: 'あの、前にどこかで会いました？',
            hintZh: '这句话听起来像搭讪。你也知道',
            hintEn: 'That is a chat-up line. You are aware.',
            effects: [{ stat: 'guts', amount: 2, reasonZh: '你用了一句听起来很像搭讪的开场白', reasonEn: 'You opened with something that sounds exactly like a chat-up line' }],
            setFlags: ['egg_megumi_asked'],
            then: [
              {
                type: 'narration', characterImage: E.megumi,
                zh: '她想了一下，然后说：「三回目です」。',
                en: 'She thinks about it and says: this is the third time.'
              },
              {
                type: 'narration',
                zh: '第三次。她记得清清楚楚，包括前两次分别是在哪儿、你穿的什么。',
                en: 'The third. She remembers precisely, including where the first two were and what you were wearing.'
              },
              {
                type: 'narration',
                zh: '她说的时候语气一点都不生气，也一点都不难过。她好像早就习惯了。',
                en: 'She says it without the slightest annoyance and without the slightest hurt. She appears to be long used to it.'
              },
              {
                type: 'narration',
                zh: '你道了歉。她说没关系，然后说了一句：「よく言われます」。',
                en: 'You apologise. She says it is fine, and adds that people say that to her a lot.'
              },
              {
                type: 'narration',
                zh: '你走下坡道的时候努力记了一遍她的样子。第二天早上你已经想不起来了。',
                en: 'Going down the slope you make an effort to memorise her face. By the next morning it is gone.'
              }
            ]
          },
          {
            id: 'egg_megumi_pass',
            labelZh: '算了，继续走',
            labelEn: 'Never mind. Keep walking.',
            hintZh: '大概是认错了',
            hintEn: 'Probably a mistake.',
            effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你把一件事归给了错觉', reasonEn: 'You filed something under imagination' }],
            then: [
              {
                type: 'narration',
                zh: '你继续往下走。走到坡底的时候，你已经不记得刚才为什么停下来了。',
                en: 'You carry on down. By the bottom of the slope you no longer remember why you stopped.'
              }
            ]
          }
        ]
      },
      seen('一个你第三次没认出来的人', 'Somebody you failed to recognise for the third time')
    ]
  },

  // =========================================================
  // 🍱 便当
  // 天台。一个人，一个特别大的便当盒。
  // =========================================================
  {
    id: 'st_egg_big_bento',
    minDay: 20,
    locationIds: ['school_terrace', 'rooftop_sunset', 'school_library'],
    weight: 4,
    timeSlots: ['lunch'],
    script: [
      {
        type: 'narration', characterImage: E.anna,
        zh: '天台角落坐着一个女生，膝盖上放着一个便当盒。那个便当盒的尺寸不太对。',
        en: 'A girl is sitting in the corner of the roof with a lunchbox on her knees. The lunchbox is the wrong size.'
      },
      {
        type: 'narration',
        zh: '不是"女生的便当有点大"的那种不对，是"这个盒子原本是用来装工具的"的那种不对。',
        en: 'Not "a slightly large lunch" wrong. "That box was manufactured to hold tools" wrong.'
      },
      {
        type: 'narration',
        zh: '她吃得很认真，也很快。中间一次都没有停下来看手机。',
        en: 'She eats seriously and fast, and does not once stop to look at her phone.'
      },
      {
        type: 'narration', characterImage: E.nukumizu,
        zh: '离她大概八米的地方，另一个男生背对着她坐着，手里拿着一张很长的便利店小票在看。',
        en: 'About eight metres off, a boy sits with his back to her, studying a very long convenience store receipt.'
      },
      {
        type: 'narration',
        zh: '那张小票长得有点过分。你估计上面至少有二十项。',
        en: 'The receipt is unreasonably long. You estimate at least twenty items.'
      },
      {
        type: 'choice',
        promptZh: '她吃完了。她看着空掉的便当盒，看了大概十秒钟。',
        promptEn: 'She finishes. She looks at the empty box for about ten seconds.',
        options: [
          {
            id: 'egg_anna_offer',
            labelZh: '把自己那半个面包递过去',
            labelEn: 'Offer her half your bread',
            hintZh: '她刚吃完，但她的表情不像吃完了',
            hintEn: 'She has just finished, and does not look finished.',
            effects: [
              { stat: 'kindness', amount: 3, reasonZh: '你把自己的午饭分出去了一半', reasonEn: 'You gave away half your lunch' }
            ],
            setFlags: ['egg_anna_fed'],
            then: [
              {
                type: 'narration', characterImage: E.anna,
                zh: '她抬头看了你两秒钟。眼睛亮起来和伸手是同一个动作。谢谢是嚼着说的，三口就没了。',
                en: 'She looks up at you for two seconds. Her eyes lighting up and her hand coming out are the same motion. The thank-you is said around a mouthful. Three bites and it is gone.'
              },
              {
                type: 'narration',
                zh: '然后她非常郑重地对你说了一句：「あなた、いい人ですね」。',
                en: 'Then she tells you, with considerable gravity, that you are a good person.'
              },
              {
                type: 'narration', characterImage: E.nukumizu,
                zh: '八米之外那个男生的肩膀抖了一下。他没有回头。',
                en: 'Eight metres away the boy\'s shoulders twitch. He does not turn round.'
              },
              {
                type: 'narration',
                zh: '你后来才反应过来：那句话不像是夸奖，更像是一个诊断。',
                en: 'It occurs to you later that this was less a compliment than a diagnosis.'
              }
            ]
          },
          {
            id: 'egg_anna_receipt',
            labelZh: '去看那张小票',
            labelEn: 'Go and look at the receipt',
            hintZh: '二十项。你想知道是哪二十项',
            hintEn: 'Twenty items. You want to know which twenty.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你读了一张不属于你的小票', reasonEn: 'You read a receipt that was not yours' }],
            then: [
              {
                type: 'narration',
                zh: '你装作路过瞥了一眼。二十三项，全是零食，而且全是同一类：能一个人吃完、包装能不出声打开的那种。',
                en: 'You glance over as you pass. Twenty-three items, all snacks, and all of the same category: single-portion, and openable without noise.'
              },
              {
                type: 'narration', characterImage: E.nukumizu,
                zh: '他察觉到了，把小票折起来收进了口袋，动作很快。',
                en: 'He notices, folds the receipt away into his pocket, quickly.'
              },
              {
                type: 'narration',
                zh: '他没有看你。他一直在看八米之外那个方向。',
                en: 'He does not look at you. He has been looking eight metres in the other direction the whole time.'
              }
            ]
          }
        ]
      },
      seen('一个装工具的便当盒，和一张二十三项的小票', 'A toolbox used as a lunchbox, and a twenty-three item receipt')
    ]
  },

  // =========================================================
  // 🎹 三个人的音乐室
  // 一次三个人的彩蛋。走廊上听见的。
  // =========================================================
  {
    id: 'st_egg_three_music',
    minDay: 70,
    // 只放音乐室。之前还挂了美术室和天台 —— 三个人围着一台钢琴，
    // 在美术室里是不成立的。
    locationIds: ['music_room'],
    weight: 3,
    timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: '音乐室里有钢琴声。你路过的时候停了一下——弹得很好，好到不像是社团活动。',
        en: 'There is a piano in the music room. You stop as you pass. It is good. Too good for a club activity.'
      },
      {
        type: 'narration', characterImage: E.kazusa,
        zh: '你从门缝往里看。弹琴的是个高个子的女生，黑色大衣搭在椅背上。',
        en: 'You look in through the gap. The player is a tall girl with a black coat over the chair back.'
      },
      {
        type: 'narration', characterImage: E.setsuna,
        zh: '窗边站着另一个女生，米白色大衣，红围巾。她在跟着哼，声音很小，但和钢琴严丝合缝。',
        en: 'By the window stands another girl in a cream coat and red scarf, humming along too quietly to hear properly, and exactly with the piano.'
      },
      {
        type: 'narration', characterImage: E.haruki,
        zh: '还有一个背着吉他包的男生站在门内侧，一只手搭在门把上，好像随时准备出去。',
        en: 'A boy with a guitar case stands just inside the door, one hand on the handle, as though ready to leave at any moment.'
      },
      {
        type: 'narration',
        zh: '三个人，一首曲子。听起来非常好。看起来非常不对。',
        en: 'Three people, one piece. It sounds extremely good. It looks extremely wrong.'
      },
      {
        type: 'choice',
        promptZh: '曲子快结束了。',
        promptEn: 'The piece is nearly over.',
        options: [
          {
            id: 'egg_wa2_listen',
            labelZh: '听完再走',
            labelEn: 'Stay until it finishes',
            hintZh: '就当是一次免费的演出',
            hintEn: 'Take it as a free performance.',
            effects: [
              { stat: 'charm', amount: 2, reasonZh: '你在走廊上听完了一整首', reasonEn: 'You heard a whole piece out, standing in a corridor' }
            ],
            setFlags: ['egg_wa2_listened'],
            then: [
              {
                type: 'narration',
                zh: '最后一个音落下之后，三个人谁都没有说话。',
                en: 'After the last note, none of the three says anything.'
              },
              {
                type: 'narration',
                zh: '安静持续了大概八秒。八秒对三个刚一起演完一首曲子的人来说，太长了。',
                en: 'The silence runs about eight seconds. For three people who have just played something together, eight seconds is a long time.'
              },
              {
                type: 'narration', characterImage: E.haruki,
                zh: '然后那个背吉他的男生说了句"じゃあ、また"，出来了。他没有看见门外的你。',
                en: 'Then the boy with the guitar says "see you", and comes out. He does not see you outside.'
              },
              {
                type: 'narration',
                zh: '门关上之后，钢琴又响了一个音。就一个。',
                en: 'After the door shuts, the piano sounds one more note. Just one.'
              }
            ]
          },
          {
            id: 'egg_wa2_go',
            labelZh: '走开',
            labelEn: 'Move on',
            hintZh: '这个房间里正在发生的事和你无关',
            hintEn: 'Whatever is happening in there is not yours.',
            effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有在门外多站', reasonEn: 'You did not linger at the door' }],
            then: [
              {
                type: 'narration',
                zh: '你走了。走到楼梯口的时候，钢琴还在响。',
                en: 'You go. The piano is still going when you reach the stairs.'
              },
              {
                type: 'narration',
                zh: '走到一楼的时候，停了。',
                en: 'By the ground floor, it has stopped.'
              }
            ]
          }
        ]
      },
      seen('一首听起来很好、看起来很不对的曲子', 'A piece that sounded very good and looked very wrong')
    ]
  }
];
