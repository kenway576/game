import { StreetScene } from './streetScenes';
import { EASTER_EGG_SPRITES, STREET_NPC_SPRITES } from '../constants';

// ==========================================================
// 🎌 主角是个二次元
//
// 【为什么这一批要单独写】
// 前面那些彩蛋是"你看见了某个角色"，主角基本不出声。
// 但主角自己就是个宅——他背了三千个单词来日本，那些单词有一半
// 是从字幕里学的。所以他看见这些东西的时候脑子里有话，
// 而这个游戏一直没让他说出来。
//
// 【这一批的规矩】
// 一、**梗要主角自己接**，不是旁白解释。选项就是他脑子里那句吐槽。
// 二、**接不上也是一种选项**。有些选项是"忍住了没说"，而且往往更好笑。
// 三、被吐槽的对象**不知道自己被吐槽了**。这是全部笑点的来源。
// 四、不写原作名字，只写那个场面。认得的人自己会笑，不认得的
//     读到的也是一段正常的街头小景——这条是硬规矩。
// ==========================================================

const E = EASTER_EGG_SPRITES;
const P = STREET_NPC_SPRITES;

const seen = (zh: string, en: string) => ({
  type: 'effect' as const,
  effects: [{ stat: 'knowledge' as const, amount: 1, reasonZh: zh, reasonEn: en }]
});

export const OTAKU_SCENES: StreetScene[] = [
  // ---------------------------------------------------------
  // 🏍 路过的假面骑士
  // ---------------------------------------------------------
  {
    id: 'ot_rider', locationIds: ['sannomiya_station', 'ikuta_road', 'motomachi_arcade', 'kobe_harbor'],
    weight: 4, minDay: 22, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: '红灯。旁边停下一辆摩托：黑皮衣、全盔，整条街的霓虹和车灯全都倒映在面罩原本该是眼睛的位置。',
        en: 'Red light. There is a motorcycle beside you: black leathers, full-face helmet, and the whole street reflected in the part of the visor where the eyes would be.'
      },
      {
        type: 'narration',
        zh: '腰上那条带子绝非普通的皮带。正中央嵌着一枚金属圆轮，里面的装置还在高速旋转。',
        en: 'The belt is not an ordinary belt. There is a round thing in the middle of it, and it is turning.'
      },
      {
        type: 'choice',
        promptZh: '斑马线对面的行人倒计时还在闪动。',
        promptEn: 'The pedestrian countdown across the street is ticking.',
        options: [
          {
            id: 'ot_rider_name',
            labelZh: '在心里默默摆出姿势：「我只是个路过的假面骑士罢了一一」',
            labelEn: 'Strike a pose in your mind: "Just a passing-through Kamen Rider—"',
            hintZh: '「通りすがりの仮面ライダーだ、覚えておけ」', hintEn: 'You know which silhouette this is.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '中二之魂狠狠共鸣了', reasonEn: 'You even remembered the year' }],
            setFlags: ['ot_rider_named'],
            then: [
              {
                type: 'narration',
                zh: '你想起来了，顺带连变身腰带的转动音效、当年的专属插入曲和剧场版名场面都一股脑涌了上来。',
                en: 'You get it, and along with it the insert song, the first line of the opening, and what time you used to stay up to watch it.'
              },
              {
                type: 'narration',
                zh: '信号灯转绿。排气管吐出一串低沉干净的轰鸣，骑手绝尘而去。你站在原地，心里忽然一阵发痒，很想找同好大聊三百回合，可惜这条街上的路人步伐匆匆，没人能接住这个梗。',
                en: 'Green. He goes, and the exhaust note is not in the least dramatic. You stand there wanting very much to say something to somebody, and there is nobody on this street who could take it.'
              }
            ]
          },
          {
            id: 'ot_rider_belt',
            labelZh: '「……那个腰带能买到吗。」',
            labelEn: '"...Can you buy that belt anywhere."',
            jp: '……あのベルト、売っとるんかな。',
            hintZh: '你不是在开玩笑', hintEn: 'You are not being funny.',
            effects: [{ stat: 'charm', amount: 2, reasonZh: '你把一个念头说出了口', reasonEn: 'You said a thought out loud' }],
            setFlags: ['ot_rider_belt'],
            then: [
              {
                type: 'narration',
                zh: '你说出口了。虽然只是自言自语的小声嘟囔，但前面骑手的头盔微微侧转，镜片折射过一道刺眼的霞光。',
                en: 'You say it. Not loudly. The helmet rotates fifteen degrees.'
              },
              {
                type: 'narration',
                zh: '他单手扶把，另一只手极其帅气地朝斜后方比了个手势——那个方向是三宫的駿河屋。紧接着绿灯放行。',
                en: 'He raises one hand and points back over his shoulder. That direction is Surugaya. Then the light goes green.'
              },
              {
                type: 'narration',
                zh: '你站在原地愣了一瞬，暗下决心明天放学就去店里掘地三尺。',
                en: 'You think about it for a moment and decide to go tomorrow.'
              }
            ]
          },
          {
            id: 'ot_rider_nothing',
            labelZh: '什么也不想，正常过马路',
            labelEn: 'Think nothing, cross the road like a person',
            hintZh: '你今天很累', hintEn: 'You are tired today.',
            effects: [{ stat: 'guts', amount: 1, reasonZh: '你成功地忍住了', reasonEn: 'You successfully did not' }],
            then: [
              {
                type: 'narration',
                zh: '你混在人流里快步穿过了马路。踏上对面步道时，到底还是没忍住回头瞄了一眼。',
                en: 'You cross. Once on the other side, you look back.'
              },
              {
                type: 'narration',
                zh: '摩托车早就汇入街角车海不见踪影。你在心里暗自承认：刚才在斑马线前，你心里其实蠢蠢欲动地想冲上去问他借腰带把玩一下。',
                en: 'The bike has gone. You concede, privately, that you had wanted to run over.'
              }
            ]
          }
        ]
      },
      seen('这座城市里有人骑着那种摩托上下班', 'Somebody in this city commutes on that kind of motorcycle')
    ]
  },

  // ---------------------------------------------------------
  // 😭 「你那个眼泪能守护地球吗」
  // ---------------------------------------------------------
  {
    id: 'ot_tears', locationIds: ['school_terrace', 'rooftop_sunset', 'courtyard_rain'],
    weight: 4, minDay: 55, timeSlots: ['lunch', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '天台的角落里有个一年级的男生在哭。不是抽泣，是那种憋着不出声、肩膀一抖一抖的哭法。',
        en: 'There is a first-year crying in the corner of the roof. Not sobbing: the kind where you hold it in and only the shoulders move.'
      },
      {
        type: 'narration',
        zh: '旁边站着他的同伴，手里攥着两罐热咖啡，一罐已经开了，另一罐在掌心里攥了许久，铝罐都被捏得有些凹陷。',
        en: 'His friend is standing there with two cans of coffee. One is open. The other has been in his fist for a long while.'
      },
      {
        type: 'choice',
        promptZh: '你在门口，进也不是退也不是。',
        promptEn: 'You are in the doorway, and neither going in nor going back is right.',
        options: [
          {
            id: 'ot_tears_meme',
            labelZh: '「……你那个眼泪，能守护地球吗。」',
            labelEn: '"...Will those tears of yours protect the earth."',
            jp: '……その涙で、地球守れるんか。',
            hintZh: '你知道这句话出自哪儿。你也知道现在说不合适', hintEn: 'You know where the line is from. You also know this is not the moment.',
            requires: { stat: 'guts', min: 8 },
            effects: [
              { stat: 'guts', amount: 3, reasonZh: '你在一个绝对不该说的时机说了一句绝对不该说的话', reasonEn: 'You said an extremely wrong thing at an extremely wrong moment' },
              { stat: 'charm', amount: 2, reasonZh: '而它奇迹般地成功了', reasonEn: 'And it miraculously worked' }
            ],
            setFlags: ['ot_tears_line'],
            then: [
              {
                type: 'narration',
                zh: '天台的风声仿佛忽然停滞了一瞬。哭着的男生吸了吸鼻子抬起头，脸上一塌糊涂，眼睛却因为震惊而瞪得滚圆。',
                en: 'Two seconds of nothing. The crying one looks up, face a complete mess, eyes wide.'
              },
              {
                type: 'narration',
                zh: '「……なんでそれ知ってんの。」他说这句话的时候还在哭，但已经在笑了。',
                en: '"...How do you even know that." He is still crying while he says it, and also laughing.'
              },
              {
                type: 'narration',
                zh: '旁边那个终于把第二罐咖啡递了出去。你转身下楼，一句话都没多说。',
                en: 'The friend finally hands over the second can. You turn and go back down without saying anything else.'
              }
            ]
          },
          {
            id: 'ot_tears_leave',
            labelZh: '退回楼梯间，把门轻轻带上',
            labelEn: 'Step back into the stairwell and close the door quietly',
            hintZh: '有些场合不需要第三个人', hintEn: 'Some occasions do not need a third person.',
            effects: [{ stat: 'kindness', amount: 3, reasonZh: '你没有把自己塞进别人的时刻里', reasonEn: 'You did not insert yourself into somebody else\'s moment' }],
            then: [
              {
                type: 'narration',
                zh: '门合上的时候你听见里面有人笑了一声。不是你说的什么，是他朋友说的。',
                en: 'As the door closes you hear a laugh from inside. Not at anything you said; at something the friend said.'
              },
              {
                type: 'narration',
                zh: '你在楼梯上站了一会儿才下去。这句台词你憋了一整个下午。',
                en: 'You stand on the stairs a moment before going down. You keep that line in for the rest of the afternoon.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 💀 「人被杀就会死」
  // ---------------------------------------------------------
  {
    id: 'ot_obvious', locationIds: ['school_library', 'juku', 'retro_kissaten'],
    weight: 4, minDay: 75, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: '隔壁桌两个人在小声吵，吵的是一道题。吵到一半其中一个说了一句：',
        en: 'Two people at the next table are arguing quietly about a question. Halfway through, one of them says:'
      },
      {
        type: 'narration',
        zh: '「だから、答えが合ってへんかったら、点数もらわれへんやろ。」',
        en: '"Look. If the answer is wrong, you do not get the marks."'
      },
      {
        type: 'choice',
        promptZh: '你手里的笔停住了。',
        promptEn: 'Your pen stops.',
        options: [
          {
            id: 'ot_obvious_meme',
            labelZh: '在心里默默反驳：「異議あり！难道不是人被杀就会死吗！」',
            labelEn: '(internally) "Objection! People die if they are killed!"',
            hintZh: '同一种哲学句式。同一种中二直觉', hintEn: 'The same tautological gravity. You cannot help it.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你用士郎名言化解了邻桌的逻辑循环', reasonEn: 'You countered tautology with anime tautology' }],
            setFlags: ['ot_obvious_line'],
            then: [
              {
                type: 'narration',
                zh: '你死死咬住嘴唇没念出声。但你憋笑的肩膀抖动得太夸张，隔壁桌两个人同时一脸莫名其妙地转过来看你。',
                en: 'You do not say it. You do, however, laugh visibly enough that both of them turn round.'
              },
              {
                type: 'narration',
                zh: '你赶紧清了清嗓子摆手说「なんでもない」，接着埋头死磕课本。那一整页的课后习题你全做串行了。',
                en: 'You have to say it is nothing and go back to your work. You get that entire page wrong.'
              }
            ]
          },
          {
            id: 'ot_obvious_help',
            labelZh: '转过去，指出他们两个都算错了',
            labelEn: 'Turn round and point out that they are both wrong',
            hintZh: '你刚好会这一题', hintEn: 'You happen to know this one.',
            effects: [
              { stat: 'knowledge', amount: 2, reasonZh: '数学是你唯一不用翻译的科目', reasonEn: 'Maths is the only subject you do not have to translate' },
              { stat: 'charm', amount: 1, reasonZh: '他们把椅子挪过来了', reasonEn: 'They moved their chairs over' }
            ],
            then: [
              {
                type: 'narration',
                zh: '你把两个人的错处各指了一遍，用的日语很烂，但公式是通用的。',
                en: 'You point out where each of them went wrong. Your Japanese is bad; the equations are not language.'
              },
              {
                type: 'narration',
                zh: '他们索性把椅子扯了过来。接下来大半节自习，三个人挤在一张课桌前轮流推演公式，连正经的自我介绍都给忘到九霄云外了。',
                en: 'They pull their chairs across. For the next forty minutes the three of you work at one table, and nobody introduces themselves.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🏃 「逃げちゃダメだ」
  // ---------------------------------------------------------
  {
    id: 'ot_runaway', locationIds: ['sannomiya_station', 'sannomiya_station', 'portliner_platform'],
    weight: 4, minDay: 130, timeSlots: ['night'],
    script: [
      {
        type: 'narration',
        zh: '夜色已深，接近末班车时段的站台。有个穿西装的上班族静静立在黄线边缘，一动不动地凝视着空荡荡的钢轨。',
        en: 'The platform not long before the last train. Somebody in a suit is standing beyond the yellow line, looking at the track, and has been for a while.'
      },
      {
        type: 'narration',
        zh: '你后来发现他不是在看轨道。他在看对面站台的时刻表，那是回家反方向的车。',
        en: 'You work out that he is not looking at the track. He is looking at the timetable on the opposite platform, which is the train going the other way.'
      },
      {
        type: 'choice',
        promptZh: '广播说列车即将进站。',
        promptEn: 'The announcement says the train is approaching.',
        options: [
          {
            id: 'ot_runaway_meme',
            labelZh: '（在心里）「不能逃避、不能逃避……」',
            labelEn: '(internally) "I mustn\'t run away, I mustn\'t run away..."',
            hintZh: '这句话你念了三遍，念的是自己', hintEn: 'You say it three times, and you are saying it to yourself.',
            effects: [{ stat: 'guts', amount: 3, reasonZh: '你念这句话的时候想的不是他', reasonEn: 'You were not thinking about him while you said it' }],
            setFlags: ['ot_runaway_line'],
            then: [
              {
                type: 'narration',
                zh: '你在心里默默念了三遍。念到第三遍的时候你意识到，这句话你不是替他念的。',
                en: 'You say it three times in your head. On the third it occurs to you that you are not saying it on his behalf.'
              },
              {
                type: 'narration',
                zh: '车来了。他上了车，回家的方向。你也上了车。整个车厢没有人说话。',
                en: 'The train comes. He gets on it, going home. So do you. Nobody in the carriage says anything.'
              }
            ]
          },
          {
            id: 'ot_runaway_stand',
            labelZh: '走过去，站在他旁边等车',
            labelEn: 'Go and stand next to him to wait',
            hintZh: '不说话，就是站在旁边', hintEn: 'Not talking. Just standing there.',
            effects: [{ stat: 'kindness', amount: 3, reasonZh: '黄线外面少了一个人站着', reasonEn: 'One fewer person standing beyond the yellow line' }],
            then: [
              {
                type: 'narration',
                zh: '你默默走过去，在离他不远的地方一同等车。他没有侧头看你，但靴子悄无声息地向后退回了安全线以内。',
                en: 'You go and stand near him. He does not look at you. He does step back inside the yellow line.'
              },
              {
                type: 'narration',
                zh: '车来了。你们上了同一节车厢，坐在对角。他在三站之后下的，下车前朝你这边点了一下头。',
                en: 'The train comes. You board the same carriage and sit diagonally apart. He gets off three stops later, and nods in your direction on his way out.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🎮 駿河屋：跟店员对上暗号
  // ---------------------------------------------------------
  {
    id: 'ot_surugaya_clerk', locationIds: ['surugaya_sannomiya', 'pia_kobe_arcade'],
    weight: 6, minDay: 45, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: '/images/characters/clerk_surugaya.webp',
        zh: '你在中古手办区蹲着挑了半天，从最底层的特价箱一个一个往上翻。店员搬着货箱从你背后走了几个来回，第三次终于忍不住停下了脚步。',
        en: 'A long time crouched in the second-hand section, working up from the bottom row. The clerk goes past behind you several times. On the third she stops.'
      },
      {
        type: 'narration',
        zh: '「それ、箱潰れやけど中身は無傷ですよ。」她说的是你手里那个。',
        en: '"Box is crushed but the contents are perfect." She means the one in your hands.'
      },
      {
        type: 'choice',
        promptZh: '她在等你的反应。',
        promptEn: 'She is waiting to see how you react.',
        options: [
          {
            id: 'ot_sur_pro',
            labelZh: '「知ってます。だから見てるんです。」',
            labelEn: '"I know. That is why I am looking at it."',
            jp: '知ってます。だから見てるんです。',
            hintZh: '你在另一个国家蹲过一模一样的架子', hintEn: 'You have crouched at exactly this shelf in another country.',
            effects: [
              { stat: 'charm', amount: 3, reasonZh: '你们两个都不用再解释什么了', reasonEn: 'Neither of you has to explain anything further' }
            ],
            setFlags: ['ot_surugaya_pro'],
            then: [
              {
                type: 'narration', characterImage: '/images/characters/clerk_surugaya.webp',
                zh: '她「あー」了一声，那一声里有一种"原来是同类"的东西。然后她蹲下来，从最里面抽出一个盒子。',
                en: 'She goes "ah", and there is something in the "ah" that means: one of us, then. She crouches down and pulls a box from right at the back.'
              },
              {
                type: 'narration',
                zh: '「これ、値札貼り忘れてました。」她说的时候脸上一点表情都没有。价签是刚贴上去的，比架子上便宜一千二。',
                en: '"We forgot to price this one." She says it with a completely straight face. The label has just gone on, and it is twelve hundred under the shelf price.'
              }
            ]
          },
          {
            id: 'ot_sur_shy',
            labelZh: '「あ、いえ、その、見てただけで……」',
            labelEn: '"Ah, no, I was just, um, looking..."',
            jp: 'あ、いえ、その、見てただけで……',
            hintZh: '被抓包了', hintEn: 'Caught.',
            effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你至少是用日语慌的', reasonEn: 'At least you panicked in Japanese' }],
            then: [
              {
                type: 'narration',
                zh: '她笑了一下就走了。你在原地又踌躇了片刻，最后还是咬牙把那个盒子抱到了收银台。',
                en: 'She laughs and moves on. You crouch there a moment longer and take the box to the till anyway.'
              },
              {
                type: 'narration',
                zh: '结账的时候她一句话也没说，但多给了你一个店家的纸袋——大的那种，装得下盒子。',
                en: 'She says nothing at the till, but gives you the larger size of the shop\'s paper bags. The one a box fits into.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 📚 Book Off：一百一十円架上的偶遇
  // ---------------------------------------------------------
  {
    id: 'ot_bookoff_shelf', locationIds: ['bookoff_sannomiya'],
    weight: 6, minDay: 35, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: '/images/characters/clerk_bookoff.webp',
        zh: '一百一十円那一排最下面，你和另一只手同时按在了同一本书上。',
        en: 'At the bottom of the hundred-and-ten-yen row, your hand and another hand land on the same book at the same time.'
      },
      {
        type: 'narration',
        zh: '你抬头。是这儿的店员，他手里还拿着价签枪，明显是在补货，不是在买。',
        en: 'You look up. It is the shop\'s own staff, still holding the price gun. Clearly restocking, not buying.'
      },
      {
        type: 'narration', characterImage: '/images/characters/clerk_bookoff.webp',
        zh: '「あ、どうぞどうぞ。」他把手收回去了，收得非常快。「……それ、最終巻だけずっと売れ残るんですよね。」',
        en: '"Oh, go ahead, go ahead." He withdraws his hand extremely fast. "...It is always the final volume of that one that sits here."'
      },
      {
        type: 'choice',
        promptZh: '他说的是实话：这一排只有最后一卷，前面十七卷一本都没有。',
        promptEn: 'He is telling the truth: the row has only the last volume. None of the seventeen before it.',
        options: [
          {
            id: 'ot_bo_buy',
            labelZh: '还是买了',
            labelEn: 'Buy it anyway',
            hintZh: '你没看过前十七卷', hintEn: 'You have not read the first seventeen.',
            effects: [
              { stat: 'guts', amount: 2, reasonZh: '从最后一卷开始看一部漫画', reasonEn: 'Starting a series at its final volume' },
              { stat: 'knowledge', amount: 1, reasonZh: '你查了很多词', reasonEn: 'You looked up a great many words' }
            ],
            setFlags: ['ot_bookoff_lastvol'],
            then: [
              {
                type: 'narration',
                zh: '你当晚就看完了。你不知道前面发生了什么，但最后一页那句话你看懂了，而且看懂之后你在床上坐了很久。',
                en: 'You read it that night. You have no idea what happened before it. You understand the line on the last page, and having understood it you sit up in bed for a while.'
              }
            ]
          },
          {
            id: 'ot_bo_ask',
            labelZh: '问他前面十七卷去哪儿了',
            labelEn: 'Ask him where the other seventeen went',
            hintZh: '这是个正经问题', hintEn: 'It is a serious question.',
            effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你现在知道二手书的流向了', reasonEn: 'You now know how second-hand books move' }],
            then: [
              {
                type: 'narration', characterImage: '/images/characters/clerk_bookoff.webp',
                zh: '「全部まとめて売る人が多いんですよ。で、最終巻だけ手元に残す。」',
                en: '"Most people sell the lot in one go," he says. "And keep just the final volume."'
              },
              {
                type: 'narration',
                zh: '「だから、ここに最終巻があるってことは……」他没说完，把价签枪往回一转，走了。',
                en: '"So if the final volume is sitting here, that means—" He does not finish. He flips the price gun round and walks off.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🧙 药妆店：抽卡玄学
  // ---------------------------------------------------------
  {
    id: 'ot_gacha_ritual', locationIds: ['drugstore_sannomiya', 'convenience_store', 'pia_kobe_arcade'],
    weight: 5, minDay: 65, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration',
        zh: '结账队伍里前面那个人在盯着手机，屏幕上是一个你非常眼熟的界面：十连抽的确认按钮。',
        en: 'The person ahead of you in the queue is staring at a phone. What is on it is an interface you recognise immediately: the confirm button on a ten-pull.'
      },
      {
        type: 'narration',
        zh: '他没有按。他先把手机转了一圈，换了一只手，深吸了一口气。',
        en: 'He does not press it. He rotates the phone through a full turn, switches hands, and takes a breath.'
      },
      {
        type: 'choice',
        promptZh: '轮到他结账了，他还没按。',
        promptEn: 'It is his turn at the till and he still has not pressed it.',
        options: [
          {
            id: 'ot_gacha_understand',
            labelZh: '（在心里）「懂。这个时候不能按。」',
            labelEn: '(internally) "Understood. You do not press it now."',
            hintZh: '你也有一套自己的规矩', hintEn: 'You have a set of rules of your own.',
            effects: [{ stat: 'charm', amount: 2, reasonZh: '你在一个陌生人身上认出了自己', reasonEn: 'You recognised yourself in a stranger' }],
            setFlags: ['ot_gacha_ritual_seen'],
            then: [
              {
                type: 'narration',
                zh: '他结完账走到店门口的大理石立柱旁，深吸一口气，郑重按了下去。你站在几步开外的货架旁，也下意识屏住了呼吸。',
                en: 'He pays, walks to the pillar by the door, plants his feet, and only then presses it. You stop too, a few steps behind him, holding your breath.'
              },
              {
                type: 'narration',
                zh: '屏幕亮了一下。他把手机塞回口袋，走了，全程没有任何表情。',
                en: 'The screen flashes once. He puts the phone in his pocket and goes, with no expression at any point.'
              },
              {
                type: 'narration',
                zh: '你不知道他抽到了什么。但你知道那个动作的意思，而且你知道自己也会那样。',
                en: 'You do not know what he got. You know what that motion means, and you know you would do the same.'
              }
            ]
          },
          {
            id: 'ot_gacha_none',
            labelZh: '低头看自己的手机',
            labelEn: 'Look down at your own phone',
            hintZh: '你的今天也还没抽', hintEn: 'Yours is also unpulled today.',
            effects: [{ stat: 'guts', amount: 1, reasonZh: '你决定回家再说', reasonEn: 'You decide it can wait until you are home' }],
            then: [
              {
                type: 'narration',
                zh: '你的界面上也有一个一模一样的按钮。你把手机扣了回去，往前挪了一步。',
                en: 'There is an identical button on yours. You put the phone face down and shuffle forward a step.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🎧 高架下：那个宅男在听什么
  // ---------------------------------------------------------
  {
    id: 'ot_otaku_headphones', locationIds: ['pia_kobe_arcade', 'sannomiya_arcade'],
    weight: 5, minDay: 145, requiresFlags: ['sp_otaku_1'], timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: P.idol_otaku,
        zh: '排队那老兄今天戴着复古大耳麦，漏音的音量隔着老远都能清晰入耳。',
        en: 'The man from the queue has big vintage headphones on today, at a volume you can hear clearly from steps away.'
      },
      {
        type: 'narration',
        zh: '你听出来了。那不是他排队要看的那个团——那是一首二十年前的动画片头曲，而且是电视尺寸的版本。',
        en: 'You place it. It is not the group he queues for. It is an anime opening from twenty years ago, and it is the TV-size cut.'
      },
      {
        type: 'choice',
        promptZh: '他没注意到你在旁边。',
        promptEn: 'He has not noticed you beside him.',
        options: [
          {
            id: 'ot_hp_hum',
            labelZh: '跟着哼了两句',
            labelEn: 'Hum a couple of bars along with it',
            hintZh: '这首你也会', hintEn: 'You know this one too.',
            effects: [
              { stat: 'charm', amount: 3, reasonZh: '两个人在高架下哼同一首二十年前的歌', reasonEn: 'Two people under a viaduct humming the same twenty-year-old song' }
            ],
            setFlags: ['ot_hummed'],
            then: [
              {
                type: 'narration', characterImage: P.idol_otaku,
                zh: '他愣愣地摘下一边耳罩，转头打量了你两眼，然后顺势把那半边耳机朝你递了过来。',
                en: 'He takes one side off, looks at you, and holds that side out.'
              },
              {
                type: 'narration',
                zh: '你顺手接过来贴在耳边。热血激昂的副歌响彻耳膜，你们俩谁都没吭声，只是默默踩着鼓点。直到整首播完，他才收回耳机，咧嘴问了句「ええやろ」。',
                en: 'You put it on. Neither of you says anything through the chorus. When it ends, he takes the headphone back, and says: good, isn\'t it.'
              },
              {
                type: 'narration',
                zh: '你说ええ。这是你这一年里说得最自然的一句关西话。',
                en: 'You say it is. It is the most natural piece of Kansai-ben you have produced all year.'
              }
            ]
          },
          {
            id: 'ot_hp_quiet',
            labelZh: '什么也不做，站在旁边听完',
            labelEn: 'Do nothing, and stay until it finishes',
            hintZh: '站在旁边也能听得一清二楚', hintEn: 'You can hear it clearly from right beside him.',
            effects: [{ stat: 'kindness', amount: 2, reasonZh: '有些歌不需要两个人一起听才成立', reasonEn: 'Some songs do not require two people to work' }],
            then: [
              {
                type: 'narration',
                zh: '你站着听完了。他一直没发现你。歌结束的时候他自己点了一下头，然后按了重播。',
                en: 'You stay until it ends. He never notices you. At the end he nods once to himself and hits repeat.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🍞 转角撞人：主角自己知道这是什么桥段
  // ---------------------------------------------------------
  {
    id: 'ot_corner_toast', locationIds: ['kitano_slope', 'ikuta_road', 'motomachi_arcade'],
    weight: 4, minDay: 100, timeSlots: ['morning', 'lunch', 'afternoon'],
    script: [
      {
        type: 'narration',
        zh: '前面那个拐角视野是死的。你放慢了脚步——这一年你养成了这个习惯，理由你不打算告诉任何人。',
        en: 'The corner ahead is blind. You slow down. You have picked up this habit over the year and you do not intend to explain it to anybody.'
      },
      {
        type: 'narration',
        zh: '结果拐角出来的是一辆自行车，车筐里一整袋葱，骑车的是个七十岁的爷爷。',
        en: 'What comes round the corner is a bicycle with a whole bag of spring onions in the basket, ridden by a man of about seventy.'
      },
      {
        type: 'choice',
        promptZh: '你们两个都刹住了，在巷口大眼瞪小眼。',
        promptEn: 'You both stop, looking at each other.',
        options: [
          {
            id: 'ot_toast_disappoint',
            labelZh: '（在心里）「……等等，叼着烤吐司撞上来的美少女呢？！」',
            labelEn: '(internally) "...Wait, where is the girl with toast in her mouth?!"',
            hintZh: '你在期待什么，你自己清楚', hintEn: 'You know perfectly well what you were expecting.',
            effects: [{ stat: 'guts', amount: 2, reasonZh: '你承认了自己刚才在期待什么', reasonEn: 'You admitted to yourself what you had been expecting' }],
            setFlags: ['ot_corner_admitted'],
            then: [
              {
                type: 'narration',
                zh: '大爷咕哝了一句「あぶないで」，蹬着脚踏车摇摇晃晃骑远了。你在死角处的斜坡前迎风凌乱。',
                en: 'He says to watch out and cycles off. You stand at the corner shaking your head at yourself.'
              },
              {
                type: 'narration',
                zh: '你今年在这个拐角减速了大概两百次。你决定明天开始不减了。你知道自己做不到。',
                en: 'You have slowed at this corner roughly two hundred times this year. You resolve to stop doing it from tomorrow. You know you will not.'
              }
            ]
          },
          {
            id: 'ot_toast_help',
            labelZh: '帮他把颠出来的葱捡起来',
            labelEn: 'Pick up the onions that bounced out',
            hintZh: '刹车的时候掉了两根', hintEn: 'Two of them came out when he braked.',
            effects: [{ stat: 'kindness', amount: 2, reasonZh: '你蹲下去捡了两根葱', reasonEn: 'You crouched and picked up two spring onions' }],
            then: [
              {
                type: 'narration',
                zh: '你把两根颠出来的大葱拾起来递回车筐。大爷连声道谢，尾音还没飘散，车把已经拐向了窄巷深处。',
                en: 'You put them back in the basket. He thanks you repeatedly as he cycles into the alley.'
              },
              {
                type: 'narration',
                zh: '你继续往前走。拐角的桥段没有发生，但你手上有葱味，一路都是。',
                en: 'You carry on. The scene at the corner did not happen, but your hands smell of spring onion the whole way.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------
  // 🌀 「ヤレヤレだぜ」：便利店门口的姿势
  // ---------------------------------------------------------
  {
    id: 'ot_yareyare', locationIds: ['convenience_store', 'sannomiya_arcade', 'meriken_park'],
    weight: 4, minDay: 115, timeSlots: ['afternoon', 'night'],
    script: [
      {
        type: 'narration', characterImage: E.jotaro,
        zh: '便利店门口站着一个高得离谱的人，学生服，帽檐压得很低，正在把一罐咖啡喝完。',
        en: 'There is an absurdly tall person outside the convenience store in a school jacket with the cap pulled low, finishing a can of coffee.'
      },
      {
        type: 'narration',
        zh: '他把空罐扔进垃圾桶，扔得很准。然后他抬了一下帽檐。',
        en: 'He puts the empty in the bin with unnecessary accuracy. Then he adjusts the cap.'
      },
      {
        type: 'choice',
        promptZh: '就是那个动作。一模一样的那个动作。',
        promptEn: 'It is that gesture. Exactly that gesture.',
        options: [
          {
            id: 'ot_yare_copy',
            labelZh: '你也抬了一下自己不存在的帽檐',
            labelEn: 'Adjust your own, non-existent, cap',
            hintZh: '你没有戴帽子', hintEn: 'You are not wearing a hat.',
            effects: [{ stat: 'charm', amount: 2, reasonZh: '你对着空气做了一个只有一部分人看得懂的动作', reasonEn: 'You made, at the air, a gesture only some people can read' }],
            setFlags: ['ot_yareyare'],
            then: [
              {
                type: 'narration',
                zh: '你的手停在额头前面。你没有帽子。这个动作在你身上什么也没构成。',
                en: 'Your hand stops in front of your forehead. There is no cap. On you the gesture composes into nothing at all.'
              },
              {
                type: 'narration',
                zh: '那个高个子已经走了，从头到尾没有看你一眼。这一点让整件事变得更好笑，也更好一点。',
                en: 'The tall one has gone, and did not look at you once at any point. That makes the whole thing funnier, and also slightly better.'
              }
            ]
          },
          {
            id: 'ot_yare_buy',
            labelZh: '进店，买一罐一样的咖啡',
            labelEn: 'Go in and buy the same coffee',
            hintZh: '你看清了那个牌子', hintEn: 'You got a clear look at the brand.',
            effects: [
              { stat: 'proficiency', amount: 1, reasonZh: '你一眼记住了罐子的配色', reasonEn: 'You memorised the can\'s colours at a glance' },
              { stat: 'guts', amount: 1, reasonZh: '一百三十円买一个心情', reasonEn: 'A hundred and thirty yen for a mood' }
            ],
            then: [
              {
                type: 'narration',
                zh: '你买了。站在同一个位置喝完，扔进同一个垃圾桶。',
                en: 'You buy it, drink it standing in the same spot, and put the empty in the same bin.'
              },
              {
                type: 'narration',
                zh: '没进。你走过去把它捡起来，重新放了进去。',
                en: 'You miss. You go over, pick it up, and put it in properly.'
              }
            ]
          }
        ]
      }
    ]
  }
];
