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
        zh: '横杆架得高得离谱。你不太懂田径，但也看得出那个高度已经越过了正常高中生的头顶一大截——那是成年选手的及格线，而且人家手里拿的是能弯成半圆的真杆子。',
        en: 'The bar is unreasonably high. You do not follow athletics, but you can see that mark sits far above a high schooler\'s head—it is an adult standard, cleared by people with flexible glass poles.'
      },
      {
        type: 'narration',
        zh: '而他只往后退了没几步。',
        en: 'His run-up is barely a few paces.'
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
        zh: '你站在软垫边上，脚底踩着干硬的沙土，脑子里只有一句话在转：那个动作不是这么用的。',
        en: 'You stand by the mat with dry grit under your soles and a single sentence going round your head: that is not how that works.'
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
                zh: '你说：高度离谱，助跑没几步，手里拿的还是园艺竹竿。他说：嗯。',
                en: 'You say: impossible height, barely any run-up, bamboo. He says: yes.'
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
                zh: '一根两百日元的竹竿。他用袖口顺着竹节从头揩到尾，慢得像是在擦拭什么传家宝，直到竹皮在落日底下泛起一层温润的旧光。你看着他那双被粗糙磨出厚茧的手，心里忽然冷不丁冒出一句中二台词——『我也想成为正义的伙伴』。……但不知为什么，在这个满头大汗、连跳了十几次不知放弃的红发少年面前，这句原本有些好笑的中二宣言，听起来却格外沉重。',
                en: 'A two-hundred-yen bamboo pole. He wipes it down along the joints with his sleeve, methodical as though cleaning an heirloom, until the bamboo skin takes on a dull sheen in the sunset. Looking at the calluses on his palms, an old anime line suddenly crosses your mind: "I want to become an ally of justice." Yet standing before this sweat-drenched, relentless red-haired boy, that chuuni catchphrase feels surprisingly solemn.'
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
                zh: '走出没多远，身后又是一声沉闷的震响。横杆在软垫边沿弹跳了一下才停住。',
                en: 'A little way off, another heavy thud sounds behind you. The bar rattles against the edge of the mat before settling.'
              },
              {
                type: 'narration',
                zh: '穿过铁丝网拐角时，身后又传来起跑的沙沙声。这一次，没有横杆落地的动静。你回头看了一眼那道在漫天晚霞里倔强跃起的剪影——无论多么不讲道理的墙壁，看来世界上总有笨蛋执意要去做正义的使者啊。',
                en: 'Turning the corner by the chain-link fence, the rasp of running feet comes again. This time the bar does not fall. Looking back at that silhouette leaping stubbornly against the twilight, you think: no matter how impossible the wall, some fools will always insist on being heroes of justice.'
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
      seen('那根怎么看都不讲理的园艺竹竿', 'A tomato stake that defied every law of physics')
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
        promptZh: '微波炉里托盘嗡嗡地转，玻璃窗上蒙着一层热气。他的呼吸忽然屏住了，握着手机的指关节用力得泛白。',
        promptEn: 'The turntable hums softly inside, glass fogged with steam. His breath catches, knuckles gripping the phone going white.',
        options: [
          {
            id: 'egg_mw_play',
            labelZh: '配合他，压低声音问一句「実験は？」',
            labelEn: 'Play along. Ask, quietly, how the experiment is going.',
            jp: '……実験、どうっすか。',
            hintZh: '『这一切都是命运石之门的选择……El Psy Kongroo』',
            hintEn: 'It is the choice of Steins Gate... El Psy Kongroo.',
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
                zh: '他语速极快地往外倒了一长串名词，什么世界线收束、因果律扰动，连珠炮似的撞进你耳朵里。你一个字都没听懂，但那套理论在逻辑上竟然完全自洽。',
                en: 'He unleashes a barrage of rapid-fire jargon about world line convergence and causality divergence. You do not understand a single syllable, yet the whole construct feels unsettlingly consistent.'
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
                zh: '「……今日は、ここまでだ。El Psy Kongroo。」他说完就郑重地转身离去，甚至没有拿走那根胶化香蕉。',
                en: '"That is far enough for today. El Psy Kongroo." He speaks gravely and turns to leave without retrieving the gel-banana.'
              },
              {
                type: 'narration',
                zh: '你在原地站了一会儿，后颈还残留着一股莫名的寒意，然后默默抽了张湿纸巾替他把微波炉擦干净了。店员从头到尾没有抬过头。',
                en: 'You stand there a moment, a strange shiver lingering at the back of your neck, before quietly pulling out a wet wipe to clean the microwave for him. The shop assistant never once looks up.'
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
                zh: '你说：带皮整根进去，等下准得炸。他搭在按键上的手指僵住了，半晌没有出声，末了才极其严肃地推了推眼镜，吐出一句「……そうか」。',
                en: 'You say: whole with the skin on, it is going to blow. His fingers freeze over the keypad; several quiet beats pass before he adjusts his glasses and says, with grave dignity: I see.'
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
        zh: '她长得非常显眼。但周遭的气氛却怪异得让人后颈发凉。',
        en: 'She is strikingly conspicuous. Yet the surrounding air is unsettling enough to chill your spine.'
      },
      {
        type: 'narration',
        zh: '你在书架旁边站了一会儿，慢慢察觉出一丝诡异：阅览室里坐着稀稀落落十几个学生，翻书的翻书，写卷子的写卷子，却没有任何一道视线落在她身上。',
        en: 'You linger by the shelves for a while, slowly picking up the quiet absurdity: a dozen students reading and writing across the room, yet not a single pair of eyes ever drifts toward her.'
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
                zh: '她翻书的手指猛地收紧，脊背绷得笔直，像是被什么突如其来的声音吓到一样盯住你。那种目光沉得让你手心微微发潮，甚至开始怀疑自己是不是认错了人。',
                en: 'Her fingers snap tight against the book, posture going rigid like someone startled by a sudden noise. The gaze is intense enough to make your palms prickle with damp heat.'
              },
              {
                type: 'narration',
                zh: '然后她也点了个头。动作很小，但很确实。',
                en: 'Then she nods back. A small motion, but a definite one.'
              },
              {
                type: 'narration',
                zh: '你在靠门的位置坐下，刚把参考书翻开没几页，一阵极轻微的脚步声从身侧掠过。等到你抬起头，桌面那道木纹裂痕上方已经多了一颗裹着玻璃纸的透明硬糖。',
                en: 'You take a seat near the door, barely a few pages into your workbook, when a whisper of footsteps brushes past. Looking up, a cellophane-wrapped drop sweet rests quietly on the timber.'
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
        zh: '每一个从坡道走上来的人，无一例外全被她一把截住。她横跨两步挡在路中间的架势，活像是在把守某种军事要道。',
        en: 'Every single person coming up the slope is stopped dead in their tracks. The way she plants herself across the path looks like guarding a checkpoint.'
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
                zh: '第二天你听说昨天被她堵在门口的人里，大半现在都稀里糊涂地成了那个古怪社团的挂名成员。',
                en: 'The next day you hear that most of the people cornered at the gate are now bewildered members of whatever that club is.'
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
                zh: '她一口气从宇宙人讲到未来人再到超能力者，语速快得像夏天的暴雨砸在铁皮屋顶上。中间没有任何停顿，也没有留给旁人插话的空隙。',
                en: 'She barrels from aliens to time travellers to espers, sentences pounding down like summer rain on corrugated iron. No pauses, no daylight to wedge a word in.'
              },
              {
                type: 'narration',
                zh: '你到最后也没弄明白那是个什么社团。你只弄明白了一件事：这个社团在找的东西还没有被找到，而她非常确信它存在。',
                en: 'You never do work out what the club is. You work out one thing: whatever it is looking for has not been found, and she is entirely certain it exists.'
              },
              {
                type: 'narration',
                zh: '你签了名。你不记得自己是什么时候拿起笔的。',
                en: 'You sign. You do not remember picking up the pen.'
              },
              {
                type: 'narration', characterImage: E.yuki_nagato,
                zh: '桌子那头一直低头看书的短发女生恰好在这时翻了一页，纸页在微风里发出很轻的刷啦一声。',
                en: 'The short-haired girl at the end turns a page at that precise second, paper whispering softly in the breeze.'
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
        zh: '他双手插在大衣口袋里，一动不动地面朝着深蓝色的水幕。你从水母馆绕了一圈回来，他连站立重心的脚都没换过。',
        en: 'Hands shoved in his coat pockets, he stares into the deep blue waterwall without twitching. Even after you circle the entire jellyfish exhibit, he hasn\'t shifted his weight once.'
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
                zh: '他单膝蹲在玻璃幕墙前，用低沉平稳的嗓音给小孩讲起沙丁鱼侧线的流体感应和集群回转力学。严谨得像是在宣读一篇权威论文，不一会儿旁边就围拢了几个推着婴儿车的游客。',
                en: 'Kneeling by the acrylic pane, he explains the lateral line hydrodynamic sensing and schooling mechanics in a quiet, deadpan baritone. It sounds like an authoritative paper, drawing several stroller-pushing tourists to listen.'
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
                zh: '他说他一直在数。水槽右下角铜牌上标明的鱼群数目，和眼前在水流里游动的数量对不上，少了将近五十条。',
                en: 'He says he has been counting continuously. The figure stamped on the brass plaque doesn\'t match what is swimming in the current—nearly fifty short.'
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
        zh: '那个小孩忽然转过头，一双圆溜溜的大眼睛一瞬不瞬地盯着你。她双手背在身后，奶声奶气却斩钉截铁地来了一句：「バナナのほう。」',
        en: 'The child turns round and fixes you with wide, unblinking eyes. Hands behind her back, she declares in a squeaky yet absolute tone: "The banana one."'
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
                zh: '直到走到街心天桥底下，你才发觉薄饼底下的草莓甜酱早顺着包装纸缝渗了出来，在帆布鞋面上洇开了一小团红渍。',
                en: 'Only when you reach the footbridge do you notice that strawberry syrup had seeped through the paper fold, leaving a sticky red stain on your canvas shoe.'
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
        zh: '门上的铜铃刚响过没两声，那道纤细的身影就又退了出来。她两只手死死抱紧怀里的团子玩偶，胸口剧烈起伏着，重新吸了一大口气。',
        en: 'Barely two chimes after the brass bell rings, the slender figure retreats back outside, clutching the round plush tightly to her chest and taking another desperate breath.'
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
              { stat: 'kindness', amount: 3, reasonZh: '你陪一个陌生人在店门口站了半天', reasonEn: 'You stood outside a door with a stranger for a long time' }
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
                zh: '门帘轻晃，她终于抱着用牛皮纸袋装好的大面包走了出来。看见你还在门口，她冲你鞠了一躬，鞠得很深。',
                en: 'The door curtain sways, and she finally emerges cradling a big loaf in a brown paper bag. Seeing you still by the door, she offers a very deep bow.'
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
        zh: '你从她身侧擦肩而过，走出几步之后，脚下无端端地顿住了。',
        en: 'You walk past her, and stop after just a few paces for no obvious reason.'
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
        zh: '你想不起来在哪儿见过。你甚至想不起来她刚才的面容轮廓——而她就站在几步开外的坡道边，风把她的裙摆吹得轻轻贴在小腿上。',
        en: 'You cannot place where. You cannot even recall the contour of her face just now, and she is standing right there by the slope with the breeze pressing her skirt against her shins.'
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
        zh: '离她几步远的铁丝网边上，另一个穿制服的男生背对着这边席地而坐，正对着手里一张长得夸张的便利店收据发愁。',
        en: 'A few paces off by the chain-link fence, another uniformed boy sits with his back turned, fretting over an absurdly long convenience store receipt.'
      },
      {
        type: 'narration',
        zh: '那张白条长得几乎要拖到水泥地上，密密麻麻印着看不清的条目。',
        en: 'The receipt is so long it nearly touches the concrete, covered in densely printed items.'
      },
      {
        type: 'choice',
        promptZh: '她合上铝制饭盒，空空的盒底被刮得干干净净。她盯着盒盖，喉咙轻轻动了一下，像是还在回味刚才咽下去的分量。',
        promptEn: 'She snaps the aluminium box shut, its bottom scraped clean. Staring at the lid, her throat bobs faintly as if longing for more.',
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
                zh: '她猛地抬起头。眼神亮起来的瞬间，手已经伸了过来。道谢的话含在嘴里含糊不清，你手里的半个面包转眼就只剩下了空空的包装袋。',
                en: 'She snaps her head up. The moment her eyes light up, her hands are already reaching out. The thank-you is mumbled through full cheeks; before you know it, only empty plastic wrapper remains.'
              },
              {
                type: 'narration',
                zh: '然后她非常郑重地对你说了一句：「あなた、いい人ですね」。',
                en: 'Then she tells you, with considerable gravity, that you are a good person.'
              },
              {
                type: 'narration', characterImage: E.nukumizu,
                zh: '铁丝网边上那个男生的脊背无声地僵直了，肩膀微微一沉，却硬是一次都没回头。',
                en: 'The boy by the fence goes rigid, shoulders dropping slightly, yet stubbornly refuses to turn round.'
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
            hintZh: '密密麻麻的一长串。你想知道是买了什么',
            hintEn: 'A dense list. You want to know what it is.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你读了一张不属于你的小票', reasonEn: 'You read a receipt that was not yours' }],
            then: [
              {
                type: 'narration',
                zh: '你装作路过瞥了一眼。密密麻麻的一长串全是热量炸弹，而且全是同一类：能一个人迅速吞下、包装撕开时尽量不出声的那种。',
                en: 'Glancing over as you pass, you see a dense scroll of calorie bombs, all of a kind: easy to inhale solo, wrappers designed to open silently.'
              },
              {
                type: 'narration', characterImage: E.nukumizu,
                zh: '他察觉到了，把小票折起来收进了口袋，动作很快。',
                en: 'He notices, folds the receipt away into his pocket, quickly.'
              },
              {
                type: 'narration',
                zh: '他没有看你。他的余光一直牢牢锁在天台另一头那个空饭盒的方向。',
                en: 'He does not look at you. His side glance stays fixed firmly on the empty lunchbox at the other corner of the roof.'
              }
            ]
          }
        ]
      },
      seen('一个装工具的便当盒，和一张长得过分的小票', 'A toolbox used as a lunchbox, and an unreasonably long receipt')
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
                zh: '余音散去后的空气沉得化不开。对于刚刚合奏完一曲的人来说，这种沉默未免太漫长，也太生硬了。',
                en: 'The silence hanging in the wake of the notes is thick as lead. For three people who had just shared a song, the stillness is far too drawn-out, far too brittle.'
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
  },

  // =========================================================
  // 🥞 舒芙蕾与赤字手帐
  //
  // 幸せのパンケーキ店里的两个女生。
  // 一个金发齐刘海、套着大两号黑色连帽大T恤与粉色短裤，
  // 活泼地比起双剪刀手、两眼盯着松饼放光；另一个留着低发髻、
  // 穿着白色短袖水手服与天蓝百褶裙，挎着大帆布包翻着收支手帐。
  // ---------------------------------------------------------
  {
    id: 'st_egg_cho_kaguya_pancake',
    minDay: 2,
    locationIds: ['pancake_shop', 'sannomiya_arcade'],
    weight: 5,
    timeSlots: ['morning', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '店员端着盘子从你桌旁经过的时候，带起了一股极甜的煎蛋和焦糖味。',
        en: 'As the server passes your table with the tray, a sweet draft of fried egg and warm caramel drifts past.'
      },
      {
        type: 'narration',
        zh: '隔壁桌的松饼搁在桌面上，整张木桌轻微地颤了一下。三块厚得有些过分的舒芙蕾挤在白瓷盘里，顶上那团蜂蜜黄油正在暖气里无声地化开，塌得像某种没有骨气的温顺动物。',
        en: 'The pancake plate settles onto the next table, sending a soft tremor through the timber. Three unreasonably thick soufflés huddle in the ceramic dish, the honey butter melting silently in the warm air like a pliable little creature.'
      },
      {
        type: 'narration', characterImage: E.kaguya,
        zh: '靠窗的金发女生下巴原本搁在手背上，这会儿猛地坐直了。她两只手把袖口往上拽了拽，眼睛直勾勾地盯着盘子，整个人前倾得几乎要栽进去。',
        en: 'The blonde girl by the window, chin previously resting on the back of her hands, jerks upright. She yanks her sleeves back, eyes locked onto the dish, leaning forward so far she nearly tips in.'
      },
      {
        type: 'speech', speakerZh: '金发女生', speakerEn: 'Blonde Girl',
        characterImage: E.kaguya,
        zh: '「……搭档，你看见没有。它刚才自己晃了一下。绝对不是风吹的。」',
        en: '"...Partner. Did you see that? It just wobbled on its own. That was definitely not the wind."'
      },
      {
        type: 'narration', characterImage: E.iroha,
        zh: '对面的水手服女生揉了揉被单肩包带压酸的脖子，把一本黑色活页手账按在桌角。她叹了口气，额前有一绺碎发跟着轻轻飘了一下。',
        en: 'The sailor-suited girl opposite rubs the side of her neck where the heavy strap had bitten in, pinning a black loose-leaf planner to the table. When she sighs, a stray lock of fringe lifts faintly in the breath.'
      },
      {
        type: 'speech', speakerZh: '水手服女生', speakerEn: 'Sailor Uniform Girl',
        characterImage: E.iroha,
        zh: '「我只看见了主机房电费。还有你上星期半夜偷偷加点的特大份披萨。……以及，我们手头的零钱只够结这一单。」',
        en: '"I only see the rig\'s power bill. And the midnight extra-large pizza you sneaked last week. ...Also, the spare change we have left covers exactly this one order."'
      },
      {
        type: 'speech', speakerZh: '金发女生', speakerEn: 'Blonde Girl',
        characterImage: E.kaguya,
        zh: '「那是为了给大脑散热的必要支出！而且你看，盘子里正好是三块——大功臣吃两块，制作人吃一块，剩下的黄油……」',
        en: '"That was essential heat dissipation for my brain! Besides, look, there are three pieces—two for the star, one for the producer, and the butter..."'
      },
      {
        type: 'speech', speakerZh: '水手服女生', speakerEn: 'Sailor Uniform Girl',
        characterImage: E.iroha,
        zh: '「少跟我扯什么大功臣。一人一块半，谁也别想多沾边。」',
        en: '"Don\'t give me that star nonsense. One and a half each. Nobody takes liberties."'
      },
      {
        type: 'choice',
        promptZh: '金发女生鼓着腮帮子，小银叉悬在融化的黄油上方晃来晃去，一副随时准备下嘴却又怕被没收的模样。',
        promptEn: 'Cheeks puffed, the blonde girl hovers her little silver fork indecisively over the melting butter, looking poised to strike yet terrified of having it confiscated.',
        options: [
          {
            id: 'egg_kaguya_syrup',
            labelZh: '把桌角未开封的枫糖浆小壶推过去',
            labelEn: 'Slide over the unopened little maple syrup pitcher',
            hintZh: '这么好的松饼，干放着化掉实在太可惜了',
            hintEn: 'It feels like a waste to let pancakes this good sit and deflate.',
            effects: [
              { stat: 'charm', amount: 2, reasonZh: '你在甜品外交上完成了一次沉默的援护', reasonEn: 'You pulled off a silent piece of dessert diplomacy' }
            ],
            setFlags: ['egg_kaguya_syrup_offered'],
            then: [
              {
                type: 'narration',
                zh: '你的手指碰到冰凉的小金属壶把手，在桌面上轻轻把它推了过去。陶瓷壶底在木桌上滑出极轻微的擦声。',
                en: 'Your fingers brush the chilled metal handle as you slide it gently across the table. The ceramic base makes a faint whisper against the polished timber.'
              },
              {
                type: 'narration', characterImage: E.kaguya,
                zh: '金发女生原本耷拉着的眼角一下子睁圆了，两只脚在桌子底下雀跃地踢了踢横档。',
                en: 'The blonde girl\'s drooping eyes snap wide open, her sneakers giving a series of delighted little taps against the chair rail beneath the table.'
              },
              {
                type: 'speech', speakerZh: '金发女生', speakerEn: 'Blonde Girl',
                characterImage: E.kaguya,
                zh: '「看到了吧！好心人出现了！浇上去，把整座松饼山全淹掉！」',
                en: '"See! A benefactor has appeared! Pour it on, submerge the entire mountain!"'
              },
              {
                type: 'narration', characterImage: E.iroha,
                zh: '对面的女生愣了愣，赶紧把摊开的账本合上，有些局促地向你欠了欠身。',
                en: 'The girl across from her blinks, hurriedly snaps her planner shut, and offers you a slightly flustered nod.'
              },
              {
                type: 'speech', speakerZh: '水手服女生', speakerEn: 'Sailor Uniform Girl',
                characterImage: E.iroha,
                zh: '「……给您添麻烦了。请别太惯着她，这家伙一吃甜的就没完没了。」',
                en: '"...I am sorry for the bother. Please don\'t spoil her, she loses all restraint around sugar."'
              },
              {
                type: 'narration',
                zh: '话虽这么说，但看着同伴嘴里塞满松饼、腮帮子鼓成两团的样子，她顺手抽了张纸巾递过去，嘴角极轻微地松动了一下。',
                en: 'Even as she says it, watching her companion\'s cheeks puff out round around a massive mouthful of pancake, she passes a napkin over, the corners of her mouth loosening almost imperceptibly.'
              },
              {
                type: 'speech', speakerZh: '水手服女生', speakerEn: 'Sailor Uniform Girl',
                characterImage: E.iroha,
                zh: '「……慢点嚼。没人跟你抢。」',
                en: '"...Chew properly. Nobody is taking it."'
              }
            ]
          },
          {
            id: 'egg_kaguya_watch',
            labelZh: '假装低头喝水，在旁边看戏',
            labelEn: 'Pretend to sip your drink and watch',
            hintZh: '谁也没有说话，但桌底下的暗流比暴风雨还汹涌',
            hintEn: 'Neither speaks, but the currents under the table run faster than a storm.',
            effects: [
              { stat: 'knowledge', amount: 2, reasonZh: '你见识了一场毫无章法却极其默契的分食拉锯战', reasonEn: 'You witnessed a messy yet strangely coordinated tug-of-war over food' }
            ],
            setFlags: ['egg_kaguya_watched'],
            then: [
              {
                type: 'narration',
                zh: '你端起自己的冰水杯喝了一口，杯壁上的冷凝水沾在指尖上，凉津津的。',
                en: 'You lift your glass of ice water and take a sip; the cold condensation clings damp and chilling to your fingertips.'
              },
              {
                type: 'narration', characterImage: E.kaguya,
                zh: '金发女生煞有介事地用叉子在两块松饼中间比划了一条线，脸上的神情严肃得像在签停战协定。',
                en: 'The blonde girl draws an ostentatiously solemn line with her fork between two of the cakes, her expression grave as someone signing an armistice.'
              },
              {
                type: 'narration',
                zh: '然而就在对面的女生低头去翻笔的一瞬间，金发女生的叉子一拐，闪电般把最大的一块融化黄油直接挑进了嘴里。',
                en: 'Yet the instant the other girl glances down to fish for her pen, the blonde fork swerves, spearing the lion\'s share of melting butter straight into her mouth.'
              },
              {
                type: 'narration', characterImage: E.iroha,
                zh: '对面的女生手停在半空。圆珠笔在纸角戳出了一个小凹坑。周围忽然安静下来，静得能听见隔壁桌咖啡杯落回托盘的脆响。',
                en: 'The other girl\'s hand stalls in midair. Her ballpoint dents a tiny crater into the corner of the paper. A sudden hush settles, quiet enough to hear a cup clink onto its saucer nearby.'
              },
              {
                type: 'speech', speakerZh: '水手服女生', speakerEn: 'Sailor Uniform Girl',
                characterImage: E.iroha,
                zh: '「……明天的推流体能训练，加跑三圈。」',
                en: '"...Tomorrow\'s conditioning run before the stream: three extra laps."'
              },
              {
                type: 'speech', speakerZh: '金发女生', speakerEn: 'Blonde Girl',
                characterImage: E.kaguya,
                zh: '「唔……咕嘟。凭什么啊！黄油掉在盘子里是会自动挥发的！」',
                en: '"Mmf... gulp. Why! Butter left on the plate naturally evaporates!"'
              }
            ]
          }
        ]
      },
      seen('一场关于松饼黄油与日常开支的荒唐交锋', 'An absurd café skirmish over pancake butter and household accounts')
    ]
  }
];
