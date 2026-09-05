import { StreetScene } from './streetScenes';
import { SCHOOL_NPC_SPRITES, STREET_NPC_SPRITES } from '../constants';

// ==========================================================
// 🧵 三条多天支线
//
// 【和 streetPeople 的区别】
// 那一批是"同一个人你会再看见"，一条两三段，段与段之间没有情节。
// 这三条是**有情节的**：有开头、有转折、有结果，跨好几个月，
// 而且中间会有一段主角必须做出选择的地方。
//
// 【为什么是健太和广树】
// 这两个人在第一章各露过一句脸，之后就再没出现过。
// 他们是主角班上仅有的两个有名字的男生——这个游戏里
// 主角一年下来一个男性朋友都没有，这件事本身就不对。
//
// 【第三条：她和他】
// 地下偶像（美羽）和那个每周排队的宅男（本来只有编号）之间有一条线，
// 而主角是唯一一个同时看见两边的人。
// 这条线写的时候有一条硬规矩：**不把它写成恐怖故事，也不把它写成美谈**。
// 跟踪就是跟踪，而被跟踪的人怕，这两件事都得写清楚。
// 主角能做的事非常有限——他不是警察也不是主角团，
// 他能做的只有"多看一眼"和"说一句话"，而这一句话确实改变了一点东西。
// ==========================================================

const S = SCHOOL_NPC_SPRITES;
const P = STREET_NPC_SPRITES;
const IDOL = '/images/characters/npc_idol.webp';
const IDOL_OFF = '/images/characters/npc_idol_off.webp';

const seen = (zh: string, en: string) => ({
  type: 'effect' as const,
  effects: [{ stat: 'knowledge' as const, amount: 1, reasonZh: zh, reasonEn: en }]
});

export const NPC_ARCS: StreetScene[] = [
  // =========================================================
  // 🏃 健太：跑不动的那条腿
  //
  // 他是那种跟谁都能聊上的人。这条线讲的是——
  // 跟谁都能聊上的人，没有一个人可以说真话。
  // =========================================================
  {
    id: 'arc_kenta_1', locationIds: ['school_bicycle_parking', 'gym', 'school_terrace'],
    weight: 8, minDay: 16,
    script: [
      {
        type: 'narration', characterImage: S.kenta,
        zh: '车棚里健太在给别人的自行车打气。不是他的车——他一边打一边跟车主说着什么，两个人都在笑。',
        en: 'Kenta is pumping up somebody else\'s bicycle in the shed. Not his own. He talks to the owner while he does it and they are both laughing.'
      },
      {
        type: 'narration',
        zh: '他看见你，直接就说话了：「お、留学生。自転車ある？なかったら俺の貸すで。」你们只在教室里对过一次眼。',
        en: 'He sees you and starts straight in: oh, the exchange student, have you got a bike, borrow mine if you have not. You have made eye contact with him exactly once, in a classroom.'
      },
      {
        type: 'narration',
        zh: '你说不用。他说「そか」，然后继续打气，没有半点尴尬。',
        en: 'You say you are all right. He says fair enough and carries on pumping, without a trace of awkwardness.'
      },
      {
        type: 'narration',
        zh: '你走出十米才发现：这是你来日本以后，第一次有人默认你听得懂。',
        en: 'Ten metres on you realise: that is the first time since you arrived that somebody has assumed, by default, that you would understand.'
      },
      seen('班上有个人不把你当外国人', 'Somebody in your class does not treat you as a foreigner')
    ]
  },
  {
    id: 'arc_kenta_2', locationIds: ['gym', 'school_terrace', 'courtyard_rain'],
    weight: 8, minDay: 70, requiresFlags: ['arc_kenta_1'],
    script: [
      {
        type: 'narration', characterImage: S.kenta,
        zh: '体育馆后面，健太一个人在做单腿的深蹲。做到第六个的时候他停了，扶着墙站了很久。',
        en: 'Behind the gym, Kenta is doing single-leg squats on his own. On the sixth he stops and stands holding the wall for a while.'
      },
      {
        type: 'narration',
        zh: '他右膝上有一圈很旧的手术疤，颜色已经淡了。你在他站起来之前把视线移开了。',
        en: 'There is an old surgical scar around his right knee, long faded. You look away before he straightens up.'
      },
      {
        type: 'narration', characterImage: S.kenta,
        zh: '「見た？」他问的时候还是那个语气，跟打气那天一模一样。「ええで、隠しとらんし。」',
        en: '"See that?" He asks it in exactly the tone he used at the bicycle pump. "It is fine. I am not hiding it."'
      },
      {
        type: 'choice',
        promptZh: '他在等你说点什么。',
        promptEn: 'He is waiting for you to say something.',
        options: [
          {
            id: 'arc_kenta_ask',
            labelZh: '「まだ痛い？」',
            labelEn: '"Does it still hurt?"',
            jp: 'まだ痛い？',
            hintZh: '你问的是现在，不是当年', hintEn: 'You are asking about now, not then.',
            effects: [{ stat: 'kindness', amount: 3, reasonZh: '别人问的都是"怎么弄的"', reasonEn: 'What everybody else asks is how it happened' }],
            setFlags: ['arc_kenta_asked'],
            then: [
              {
                type: 'narration',
                zh: '他愣了一下。「……そこ聞くん、初めてやわ。」',
                en: 'He blanks for a second. "...Nobody has ever asked me that one."'
              },
              {
                type: 'narration',
                zh: '他说下雨前会疼。他说这句话的时候声音低了一点，但表情完全没变——他是笑着说的。',
                en: 'He says it aches before rain. His voice drops a little when he says it; his face does not change at all. He says it smiling.'
              }
            ]
          },
          {
            id: 'arc_kenta_nothing',
            labelZh: '不说话，把水递给他',
            labelEn: 'Say nothing, and hand him your water',
            hintZh: '他刚才没喝水', hintEn: 'He has not had any water.',
            effects: [{ stat: 'charm', amount: 2, reasonZh: '你没有把它变成一个话题', reasonEn: 'You did not turn it into a topic' }],
            setFlags: ['arc_kenta_water'],
            then: [
              {
                type: 'narration',
                zh: '他接过去喝了两口，还给你，说了句「サンキュ」。然后他又做了四个。',
                en: 'He takes two mouthfuls, hands it back and says thanks. Then he does another four.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'arc_kenta_3', locationIds: ['gym', 'school_terrace'],
    weight: 8, minDay: 160, requiresFlags: ['arc_kenta_2'],
    script: [
      {
        type: 'narration', characterImage: S.kenta,
        zh: '选拔名单贴出来了。健太站在公告栏前面，手插在口袋里，看了大概两分钟。',
        en: 'The squad list has gone up. Kenta is standing in front of the noticeboard with his hands in his pockets, for about two minutes.'
      },
      {
        type: 'narration',
        zh: '名单上没有他。他把手从口袋里拿出来，拍了一下旁边那个人的背——那个人在名单上。',
        en: 'He is not on it. He takes his hands out of his pockets and slaps the back of the person beside him, who is.'
      },
      {
        type: 'narration',
        zh: '「おめでとうさん。」他说得非常自然。那个人高兴得要命，完全没听出来什么。',
        en: '"Congratulations." He says it perfectly naturally. The other one is delighted and does not hear anything in it at all.'
      },
      {
        type: 'narration',
        zh: '人散了以后他还站在那儿。他没有再看名单，他在看公告栏最下面那张纸——下学期的社团招新表。',
        en: 'When the others have gone he is still there. He is not looking at the list any more. He is looking at the sheet at the very bottom of the board: next term\'s club sign-up form.'
      },
      {
        type: 'choice',
        promptZh: '他知道你在。',
        promptEn: 'He knows you are there.',
        options: [
          {
            id: 'arc_kenta_stay',
            labelZh: '走过去，跟他一起看那张招新表',
            labelEn: 'Go over and look at the sign-up sheet with him',
            hintZh: '不问名单的事', hintEn: 'Do not mention the list.',
            effects: [
              { stat: 'kindness', amount: 4, reasonZh: '你看的是他在看的那张纸', reasonEn: 'You looked at the sheet he was looking at' },
              { stat: 'guts', amount: 2, reasonZh: '这种时候站过去是需要一点东西的', reasonEn: 'Walking over at that moment takes something' }
            ],
            setFlags: ['arc_kenta_stayed', 'arc_kenta_done'],
            then: [
              {
                type: 'narration',
                zh: '你站到他旁边。招新表上有十几个社团，他的手指停在「陸上」和「マネージャー」中间那一栏。',
                en: 'You stand next to him. There are a dozen clubs on the sheet. His finger is resting between "athletics" and "manager".'
              },
              {
                type: 'narration', characterImage: S.kenta,
                zh: '「なあ、」他说，眼睛没离开那张纸，「マネージャーって、かっこ悪いと思う？」',
                en: '"Hey," he says, without looking away from the paper. "Do you think being a manager is a bit pathetic?"'
              },
              {
                type: 'narration',
                zh: '你说不觉得。他说「そか」，然后就笑了——是那种打气那天的笑，但这次里面有点别的。',
                en: 'You say you do not. He says fair enough, and grins. It is the bicycle-pump grin, with something else in it this time.'
              },
              {
                type: 'narration',
                zh: '两周后你在体育馆看见他，脖子上挂着秒表，在给别人计时。',
                en: 'Two weeks later you see him in the gym with a stopwatch round his neck, timing somebody else.'
              },
              {
                type: 'effect',
                effects: [{ stat: 'kindness', amount: 2, reasonZh: '他把秒表挂上了自己的脖子', reasonEn: 'He put the stopwatch round his own neck' }]
              }
            ]
          },
          {
            id: 'arc_kenta_go',
            labelZh: '悄悄走开',
            labelEn: 'Quietly leave',
            hintZh: '有些事不该被看见', hintEn: 'Some things should not be witnessed.',
            effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有站在那儿看他站着', reasonEn: 'You did not stand there watching him stand there' }],
            setFlags: ['arc_kenta_left', 'arc_kenta_done'],
            then: [
              {
                type: 'narration',
                zh: '第二天他还是那个健太，在车棚给别人打气，一句话都没提。',
                en: 'The next day he is the same Kenta, pumping somebody\'s tyres in the shed, and says nothing about any of it.'
              },
              {
                type: 'narration',
                zh: '两周后你在体育馆看见他，脖子上挂着秒表。他看见你，举起秒表晃了晃，那个动作的意思是：看，我还在这儿。',
                en: 'Two weeks later you see him in the gym with a stopwatch round his neck. He sees you, holds it up and shakes it. What the gesture means is: look, I am still here.'
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================
  // 📐 广树：第一排那个位子
  //
  // 他数学永远第一，永远坐第一排。
  // 这条线讲的是他为什么坐第一排——理由和成绩没有关系。
  // =========================================================
  {
    id: 'arc_hiroki_1', locationIds: ['school_library', 'classroom_morning'],
    weight: 8, minDay: 24,
    script: [
      {
        type: 'narration', characterImage: S.hiroki,
        zh: '图书室最里面那张桌子，广树在做题。他做题的姿势很奇怪：脸离本子只有二十厘米。',
        en: 'Hiroki is working at the furthest table in the library. His posture is odd: his face is twenty centimetres from the page.'
      },
      {
        type: 'narration',
        zh: '你路过的时候他抬起头，看了你两秒才认出来，然后点了下头。',
        en: 'He looks up as you pass, takes two seconds to place you, and nods.'
      },
      seen('班上第一排那个人，眼睛离本子很近', 'The one in the front row holds the page very close')
    ]
  },
  {
    id: 'arc_hiroki_2', locationIds: ['school_library', 'classroom_morning', 'juku'],
    weight: 8, minDay: 88, requiresFlags: ['arc_hiroki_1'],
    script: [
      {
        type: 'narration', characterImage: S.hiroki,
        zh: '他把眼镜摘下来擦了很久。擦完戴上，又摘下来，换了一个角度再擦一遍。',
        en: 'He takes his glasses off and cleans them for a long time. Puts them on, takes them off, changes the angle and does it again.'
      },
      {
        type: 'narration',
        zh: '你注意到那副眼镜的镜片非常厚，而且左右不一样厚。',
        en: 'You notice the lenses are very thick, and that they are not the same thickness as each other.'
      },
      {
        type: 'choice',
        promptZh: '他发现你在看。',
        promptEn: 'He notices you looking.',
        options: [
          {
            id: 'arc_hiroki_ask',
            labelZh: '「黑板、見える？」',
            labelEn: '"Can you see the board?"',
            jp: '黒板、見える？',
            hintZh: '你问的是一个非常具体的问题', hintEn: 'A very specific question.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你注意到了别人没注意的一件事', reasonEn: 'You noticed something nobody else had' }],
            setFlags: ['arc_hiroki_asked'],
            then: [
              {
                type: 'narration', characterImage: S.hiroki,
                zh: '他很长时间没说话。然后他说：「一番前なら、見える。」',
                en: 'He says nothing for a long time. Then: "From the front row, I can."'
              },
              {
                type: 'narration',
                zh: '你这才明白，他坐第一排跟成绩没有关系。他成绩好也跟坐第一排没有关系——是先有的眼睛，后有的成绩。',
                en: 'It lands: the front row has nothing to do with his marks. And his marks have nothing to do with the front row. The eyes came first and the marks came after.'
              },
              {
                type: 'narration', characterImage: S.hiroki,
                zh: '「言わんといて。」他说。不是求你，是通知你。你点了头。',
                en: '"Do not tell anybody." He does not ask it; he informs you of it. You nod.'
              }
            ]
          },
          {
            id: 'arc_hiroki_lend',
            labelZh: '什么也不问，把自己的笔记推过去',
            labelEn: 'Ask nothing, and push your notes across',
            hintZh: '今天你抄了黑板', hintEn: 'You copied the board today.',
            effects: [{ stat: 'kindness', amount: 3, reasonZh: '你把答案给了他，没有把问题给他', reasonEn: 'You gave him the answer without giving him the question' }],
            setFlags: ['arc_hiroki_lent'],
            then: [
              {
                type: 'narration',
                zh: '他看了看那本笔记，又看了看你，什么也没问就翻开了。',
                en: 'He looks at the notebook, then at you, and opens it without asking anything.'
              },
              {
                type: 'narration',
                zh: '还回来的时候，最后一页多了三行字：那是你今天上课没听懂的那道题，他给你写完了。',
                en: 'When it comes back there are three extra lines on the last page: the question you did not follow in class today, worked through for you.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'arc_hiroki_3', locationIds: ['school_library', 'classroom_morning'],
    weight: 8, minDay: 195, requiresFlags: ['arc_hiroki_2'],
    script: [
      {
        type: 'narration',
        zh: '座位换了。学期中的抽签，广树抽到了倒数第二排。',
        en: 'The seating has been redrawn. In the mid-term draw Hiroki has come out in the second row from the back.'
      },
      {
        type: 'narration', characterImage: S.hiroki,
        zh: '他一句话都没说。整整两周，他每节课都在下课后留下来抄别人的黑板照片，用手机放到最大。',
        en: 'He says nothing at all. For two full weeks he stays behind after every lesson copying other people\'s photographs of the board, zoomed all the way in on his phone.'
      },
      {
        type: 'narration',
        zh: '第三周的周一，他的成绩掉了。掉得不多，但是第一次不是第一。',
        en: 'On the Monday of the third week his marks drop. Not by much. It is the first time he has not been top.'
      },
      {
        type: 'choice',
        promptZh: '你手上有一张空的座位调换申请表——上周老师发的，全班都有。',
        promptEn: 'You have a blank seat-change request form. The teacher gave them out last week; everybody has one.',
        options: [
          {
            id: 'arc_hiroki_swap',
            labelZh: '写上自己的名字，申请跟他换',
            labelEn: 'Put your own name on it and ask to swap with him',
            hintZh: '你坐在第二排。你不需要坐第二排', hintEn: 'You sit in the second row. You do not need to.',
            requires: { stat: 'kindness', min: 10 },
            effects: [
              { stat: 'kindness', amount: 5, reasonZh: '你没有替他说，你只是换了个位子', reasonEn: 'You did not speak for him. You changed seats' },
              { stat: 'guts', amount: 2, reasonZh: '你也没跟他商量', reasonEn: 'And you did not consult him about it either' }
            ],
            setFlags: ['arc_hiroki_swapped', 'arc_hiroki_done'],
            then: [
              {
                type: 'narration',
                zh: '老师问理由。你写的是「後ろの方が落ち着くので」。老师看了你一眼，批了。',
                en: 'The teacher asks for a reason. You write that you find the back calmer. She looks at you once and approves it.'
              },
              {
                type: 'narration', characterImage: S.hiroki,
                zh: '换座位那天他一句话都没说。第二节课下课的时候，他把一张纸放在了你桌上。',
                en: 'On the day of the change he says nothing. At the end of second period he puts a sheet of paper on your desk.'
              },
              {
                type: 'narration',
                zh: '那是一整页的题，每一题都写了三种解法，最后一行是：「これで、貸し借りなし。」',
                en: 'It is a full page of questions, each worked three different ways. The last line reads: that makes us even.'
              },
              {
                type: 'effect',
                effects: [{ stat: 'knowledge', amount: 3, reasonZh: '一整页，三种解法', reasonEn: 'A full page, three methods each' }]
              }
            ]
          },
          {
            id: 'arc_hiroki_tell',
            labelZh: '去跟老师说他的眼睛',
            labelEn: 'Go and tell the teacher about his eyes',
            hintZh: '你答应过不说', hintEn: 'You promised you would not.',
            effects: [
              { stat: 'guts', amount: 3, reasonZh: '你做了一件对的事，用的是错的方法', reasonEn: 'You did a right thing by a wrong route' }
            ],
            setFlags: ['arc_hiroki_told', 'arc_hiroki_done'],
            then: [
              {
                type: 'narration',
                zh: '老师第二天就把他调到了第一排。她说的理由是抽签有误，全班都信了。',
                en: 'The teacher moves him to the front the next day, saying the draw had been miscounted. The class believes it.'
              },
              {
                type: 'narration', characterImage: S.hiroki,
                zh: '他没有谢你。整整一个月他没跟你说过话。',
                en: 'He does not thank you. He does not speak to you for a month.'
              },
              {
                type: 'narration',
                zh: '一个月后他在图书室坐到你对面，把一张纸推过来，上面是一整页的题。他还是没说话，但他坐下了。',
                en: 'A month later he sits down opposite you in the library and pushes across a full page of worked questions. He still does not say anything. He does sit down.'
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================
  // 🎤 美羽与那个每周都来的人
  //
  // 主角是唯一一个同时看见两边的人。
  // =========================================================
  {
    id: 'arc_idol_1', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade'],
    weight: 6, minDay: 50, requiresFlags: ['sp_otaku_1'], timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: IDOL,
        zh: 'Live House 门口摆着一块小白板，上面是手写的当日出演名单。有个女生蹲在那儿改自己的名字——写错了一个假名。',
        en: 'There is a small whiteboard by the live-house door with the day\'s line-up written on it by hand. A girl is crouched at it correcting her own name: one kana wrong.'
      },
      {
        type: 'narration',
        zh: '她穿着舞台服，但那身衣服是自己做的——袖口的缎带两边不一样长，白靴子有一只磕掉了一块漆。',
        en: 'She is in stage costume, and the costume is homemade: the ribbons at the wrists are different lengths and one white boot has a chip out of the toe.'
      },
      {
        type: 'narration',
        zh: '她改完站起来，深吸了一口气，脸上那个笑容是一瞬间挂上去的。然后她进去了。',
        en: 'She finishes, stands, takes a breath, and the smile arrives on her face in one motion. Then she goes in.'
      },
      seen('那个笑是一秒钟之内挂上去的', 'That smile went on inside one second')
    ]
  },
  {
    id: 'arc_idol_2', locationIds: ['convenience_store', 'sannomiya_arcade', 'pia_kobe_arcade'],
    weight: 6, minDay: 125, requiresFlags: ['arc_idol_1'], timeSlots: ['night'],
    script: [
      {
        type: 'narration', characterImage: IDOL_OFF,
        zh: '便利店里那个女生你差点没认出来。头发扎起来了，灰色卫衣大两号，手里拎着一个装演出服的袋子。',
        en: 'You almost fail to recognise the girl in the convenience store. Hair up, grey hoodie two sizes too big, a garment bag with a costume in it in one hand.'
      },
      {
        type: 'narration',
        zh: '她在关东煮柜台前面站着，一直没有拿夹子。你顺着她的视线看过去——她在看玻璃门的倒影。',
        en: 'She stands at the oden counter without picking up the tongs. You follow her line of sight. She is looking at the reflection in the glass door.'
      },
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '倒影里，店外站着一个人。塑料文件夹，大背包，那个人你认得——排队那位。',
        en: 'In the reflection there is somebody outside. Clear plastic file, large rucksack. You know him: the one from the queue.'
      },
      {
        type: 'narration',
        zh: '他没有进来。他就站在自动门够不到的那个位置，看着里面。',
        en: 'He does not come in. He is standing exactly outside the range of the automatic door, looking in.'
      },
      {
        type: 'choice',
        promptZh: '她还在看倒影，手一直没动。',
        promptEn: 'She is still watching the reflection. Her hand has not moved.',
        options: [
          {
            id: 'arc_idol_stand',
            labelZh: '走到她和门之间，装作在挑关东煮',
            labelEn: 'Move between her and the door, and pretend to be choosing oden',
            hintZh: '不说话，只是站过去', hintEn: 'Not speaking. Just standing there.',
            effects: [
              { stat: 'kindness', amount: 4, reasonZh: '你挡住的不是他，是那条视线', reasonEn: 'What you blocked was not him, it was the line of sight' },
              { stat: 'guts', amount: 2, reasonZh: '你插进了一件跟你没关系的事', reasonEn: 'You put yourself into something that was not yours' }
            ],
            setFlags: ['arc_idol_blocked'],
            then: [
              {
                type: 'narration',
                zh: '你站过去，拿起夹子，认认真真地挑了三串。你挑的时候她动了——她开始拿东西了。',
                en: 'You go and stand there, take the tongs and pick out three skewers with great care. While you are doing it she moves. She starts choosing things.'
              },
              {
                type: 'narration',
                zh: '你们两个前后脚结账。她走的时候没有看你，但走的是店里面那个出口，不是自动门。',
                en: 'You pay one after the other. She does not look at you on the way out, and she goes through the interior exit rather than the automatic door.'
              },
              {
                type: 'narration', characterImage: P.idol_otaku,
                zh: '你出来的时候他还站在原地。他看见你了。他很快低下头，走了。',
                en: 'He is still standing there when you come out. He sees you. He looks down very quickly and goes.'
              }
            ]
          },
          {
            id: 'arc_idol_clerk',
            labelZh: '去跟店员说门口有人',
            labelEn: 'Tell the clerk there is somebody outside',
            hintZh: '这不是你能处理的事', hintEn: 'This is not yours to handle.',
            effects: [
              { stat: 'guts', amount: 3, reasonZh: '你把它交给了该处理的人', reasonEn: 'You handed it to somebody whose job it is' }
            ],
            setFlags: ['arc_idol_told'],
            then: [
              {
                type: 'narration', characterImage: P.conbini_night,
                zh: '通宵班那个店员听完点了点头，说了句「あー、あの人ね」。他知道。',
                en: 'The night-shift clerk listens, nods, and says: ah, that one. He knows.'
              },
              {
                type: 'narration',
                zh: '他走出柜台，到门口去整理了一下伞架，整理了大概一分钟。那个人走了。',
                en: 'He comes out from behind the counter and tidies the umbrella stand by the door for about a minute. The man leaves.'
              },
              {
                type: 'narration',
                zh: '「毎週やねん。」店员回来之后跟你说，「でも、何もしてへんから、こっちも何も言えんくてな。」',
                en: '"Every week," the clerk says when he comes back. "But he never actually does anything, so there is nothing anybody can say to him either."'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'arc_idol_3', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade'],
    weight: 7, minDay: 215, requiresFlags: ['arc_idol_2'], timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: 'Live House 门口的白板今天写着「本日 卒業ライブ」。名单上只有一个名字。',
        en: 'Today the whiteboard by the live-house door says: graduation show. There is one name on the list.'
      },
      {
        type: 'narration', characterImage: IDOL,
        zh: '她在门口发传单。看见你的时候她愣了一下——你们从来没说过话，但她认得你。',
        en: 'She is handing out flyers at the door. She pauses when she sees you. You have never spoken, and she knows your face.'
      },
      {
        type: 'narration',
        zh: '她递了一张给你。传单是自己打印的，边上还有裁歪的白边。',
        en: 'She gives you one. She has printed them herself and the edges are cut crooked.'
      },
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '队伍最前面那个人还是他。塑料文件夹，票，一点折痕都没有。',
        en: 'The first person in the queue is still him. Plastic file, ticket, not one bent corner.'
      },
      {
        type: 'narration',
        zh: '他站在那儿，离她三米，一次都没有往前走。整整一年他从来没有走近过。',
        en: 'He stands there, three metres from her, and does not close any of it. He has not, in a whole year, ever come closer.'
      },
      {
        type: 'choice',
        promptZh: '门快开了。',
        promptEn: 'The doors are about to open.',
        options: [
          {
            id: 'arc_idol_in',
            labelZh: '买票，进去看',
            labelEn: 'Buy a ticket and go in',
            hintZh: '两千五百円，包括一杯饮料', hintEn: 'Twenty-five hundred yen, drink included.',
            effects: [
              { stat: 'charm', amount: 3, reasonZh: '你成了那天在场的三十七个人之一', reasonEn: 'You became one of the thirty-seven people who were there' },
              { stat: 'kindness', amount: 2, reasonZh: '多一个人在场，对那天的她是有意义的', reasonEn: 'One more body in the room mattered to her that day' }
            ],
            setFlags: ['arc_idol_attended', 'arc_idol_done'],
            then: [
              {
                type: 'narration',
                zh: '场子里三十七个人。她唱了六首，第四首唱到一半的时候她停了两秒，然后接了下去。',
                en: 'Thirty-seven people inside. She sings six songs. Halfway through the fourth she stops for two seconds and then carries on.'
              },
              {
                type: 'narration',
                zh: '最后她说了一段话。你听懂了大概七成。你听懂的那七成里有一句是：「見ててくれて、ありがとう。」',
                en: 'At the end she says something. You follow about seventy per cent of it. In the seventy per cent there is: thank you for watching.'
              },
              {
                type: 'narration', characterImage: P.idol_otaku,
                zh: '散场的时候你在门口看见他。他没有排握手的队——那天有握手环节，他没排。他直接走了。',
                en: 'You see him at the door on the way out. There was a handshake session that day. He did not queue for it. He went straight out.'
              },
              {
                type: 'narration',
                zh: '你后来想了很久这件事。你没有想明白，而且你觉得自己不该想明白。',
                en: 'You think about that for a long time afterwards. You do not work it out, and you suspect you are not supposed to.'
              }
            ]
          },
          {
            id: 'arc_idol_pass',
            labelZh: '把传单折好收进口袋，走了',
            labelEn: 'Fold the flyer, put it in your pocket, and go',
            hintZh: '你不认识她', hintEn: 'You do not know her.',
            effects: [{ stat: 'guts', amount: 2, reasonZh: '你承认了自己只是个路过的人', reasonEn: 'You conceded that you were only somebody passing' }],
            setFlags: ['arc_idol_flyer', 'arc_idol_done'],
            then: [
              {
                type: 'narration',
                zh: '那张传单一直在你书包侧袋里，到三月都没扔。上面印着一个你不会念的艺名。',
                en: 'The flyer stays in the side pocket of your bag until March. There is a stage name printed on it that you cannot pronounce.'
              },
              {
                type: 'narration',
                zh: '一个月后你路过那家 Live House，白板上是别人的名字了。',
                en: 'A month later you pass the live house. There are other names on the whiteboard.'
              }
            ]
          }
        ]
      }
    ]
  }
];
