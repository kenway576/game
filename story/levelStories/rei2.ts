import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 铃 · 第②段「観測できない値」
//
// 触发：好感度 Lv.3「心动」(140)
// 场景：学校天台 · 夜（天体观测）
//
// 【致敬：涼宮ハルヒの消失 的長門有希】
// 借的不是"外星人"（那个梗主角在放学后已经拿来开过玩笑了），
// 借的是《消失》真正的那一下：
// **一个以"不产生误差"为存在前提的人，产生了一个误差，
//   而她做的不是修正它，是把它留下来。**
// 長門改写世界不是为了得到什么，是因为她第一次有了一个
// 无法用信息处理来解释的输出，而她想知道那是什么。
//
// 落到铃身上：她的自我认同是"我能解释任何事"。
// 这一段她遇到了一个解释不了的读数——她自己的心率。
// 她的第一反应完全符合她的人设：把它当成故障，去找病因。
//
// 【第②段的墙】
// 不是"她不懂感情"。是**她把感情归类成了误差**，
// 而对一个靠精确活着的人来说，误差是要被消除的东西。
// 玩家撞上的墙是：她正在认真地准备把这件事"修好"，
// 而修好的意思是不再和你一起观测。
//
// 【为什么用心率】
// 她随身带着的是一支记录笔和一块秒表——她量任何东西。
// 所以她量自己是完全符合她行为逻辑的，而"量出来的数字自己解释不了"
// 这件事，对她来说等同于世界观塌了一角。
//
// 【结尾】
// 她不接受安慰，也不接受"这就是喜欢"这种命名——被命名等于被归档，
// 归档等于不用再观测。她选择的是：继续观测，不下结论。
// 那对她来说不是回避，是她能给出的最高级别的承诺。
// ---------------------------------------------------------

const R = '/images/characters/rei/';

export const REI_STORY_2: StoryNode[] = [
  {
    type: 'scene',
    scene: 'rooftop_sunset',
    bgm: 'night',
    titleZh: '観測できない値',
    titleEn: 'The Value That Will Not Read',
    subtitleZh: '夜 · 天台',
    subtitleEn: 'Night · The rooftop'
  },
  {
    type: 'narration',
    zh: '这是第十一次。每周三晚上，天台，她带三脚架和记录本，你带两罐热咖啡。',
    en: 'This is the eleventh time. Wednesday nights, the roof, she brings the tripod and the notebook, you bring two hot coffees.'
  },
  {
    type: 'narration',
    zh: '规矩是她定的：观测时不说话，记录时可以说，收器材时必须说——因为收器材要两个人配合。',
    en: 'The rules are hers. No talking while observing, talking permitted while recording, talking required while packing up, because packing up takes two.'
  },
  {
    type: 'narration',
    characterImage: `${R}thinking.webp`,
    zh: '今天她不太对。她已经把同一栏数字擦掉重写了三次。',
    en: 'Something is off tonight. She has rubbed out and rewritten the same column three times.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: '……先週から、記録に一つ、説明できない項目がある。',
    words: [{ jp: '説明', reading: 'せつめい', zh: '说明、解释', en: 'explanation' }],
    zh: '……从上周开始，记录里有一项，我解释不了。',
    en: '...Since last week there is one entry in the record I cannot account for.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '你以为是星等或者云量。她把本子转过来给你看。',
    en: 'You assume magnitude, or cloud cover. She turns the notebook round.'
  },
  {
    type: 'narration',
    zh: '最右边那一栏你从来没注意过。标题写着「心拍」，下面是一串数字：72、74、71、73……然后从第七次开始，全部跳到九十以上。',
    en: 'There is a column on the far right you had never noticed. It is headed "pulse", and under it: 72, 74, 71, 73... and then, from the seventh session, everything is above ninety.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: '観測条件は同じ。気温、湿度、睡眠時間、カフェイン摂取量、全部そろえてある。',
    zh: '观测条件相同。气温、湿度、睡眠时间、咖啡因摄入量，全都对齐了。',
    en: 'Conditions identical. Temperature, humidity, hours of sleep, caffeine intake, all controlled for.',
    color: 'bg-indigo-500'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}thinking.webp`,
    jp: 'それでも、第七回以降だけ上がる。原因が特定できない。',
    zh: '即使这样，也只有第七次之后升高。原因无法确定。',
    en: 'And still it only rises from the seventh session on. I cannot isolate the cause.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '第七次是三周前。三周前那次收器材的时候，你替她拿了三脚架，两个人的手碰了一下。',
    en: 'The seventh session was three weeks ago. Packing up that night you took the tripod off her, and your hands touched.'
  },
  {
    type: 'narration',
    zh: '你记得这件事。她显然也记得——她记得所有事。',
    en: 'You remember that. She evidently does too. She remembers everything.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她在等你给一个假设。她一直是这么用你的——你是那个提出假设的人，她是那个验证的人。',
    promptEn: 'She is waiting for you to supply a hypothesis. That is what she uses you for: you propose, she tests.',
    options: [
      {
        id: 'rei2_name_it',
        labelZh: '「那个数字有个名字。」',
        labelEn: '"That number has a name."',
        jp: 'その数字、名前あるよ。',
        hintZh: '最直接的一句。但她最讨厌的就是被命名',
        hintEn: 'The most direct thing you could say. Being named is the thing she likes least.',
        effects: [{ stat: 'guts', amount: 2, reasonZh: '你把话挑明了', reasonEn: 'You said it plainly' }],
        relations: [{ char: CharacterId.REI, familiarity: 2, affection: 8, reasonZh: '她立刻开始反驳，但没有走', reasonEn: 'She started arguing immediately, and did not leave' }],
        setFlags: ['rei_story_named_it'],
        then: [
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '名前は説明じゃない。命名は、分類であって、解明ではない。',
            words: [{ jp: '分類', reading: 'ぶんるい', zh: '分类', en: 'classification' }],
            zh: '名字不是解释。命名是分类，不是解明。',
            en: 'A name is not an explanation. Naming is classification. It is not understanding.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她说得很快，快得像是准备好的。她大概自己已经想过这个可能性，并且提前写好了驳回的理由。',
            en: 'It comes fast, prepared-fast. She has evidently considered this possibility already and drafted the rejection in advance.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}thinking.webp`,
            jp: '……それに、名前をつけたら、観測をやめる理由になる。',
            zh: '……而且，一旦命名，就有了停止观测的理由。',
            en: '...Besides. Once a thing is named, that becomes a reason to stop observing it.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '这句话你当时没听懂。后来你懂了：她不想停止观测。',
            en: 'You do not follow that at the time. Later you do. She does not want to stop observing.'
          }
        ]
      },
      {
        id: 'rei2_control',
        labelZh: '「你有没有做过对照组。」',
        labelEn: '"Have you run a control."',
        jp: '対照実験は、やった？',
        words: [{ jp: '対照', reading: 'たいしょう', zh: '对照', en: 'control (in an experiment)' }],
        hintZh: '用她的语言问她。她只接受这一种提问方式',
        hintEn: 'Ask in her language. It is the only kind of question she accepts.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你学会了用她的方法反问她', reasonEn: 'You learned to turn her own method back on her' }],
        relations: [{ char: CharacterId.REI, familiarity: 6, affection: 11, reasonZh: '她被自己的方法论逼到了墙角', reasonEn: 'Her own methodology backed her into a corner' }],
        setFlags: ['rei_story_control_group'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}thinking.webp`,
            zh: '她沉默了。这是一个非常好的问题，好到她无法回避。',
            en: 'She goes quiet. It is a very good question, good enough that she cannot go round it.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '……やった。先週の土曜、同じ時刻、同じ場所、一人で。',
            zh: '……做了。上周六，同一时刻，同一地点，一个人。',
            en: '...I did. Last Saturday. Same hour, same place, alone.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她翻到本子后面。那一页只有一行：土曜 二十一時 心拍 七十三。',
            en: 'She turns to the back of the notebook. There is one line on the page: Saturday, 21:00, pulse 73.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}thinking.webp`,
            jp: '変数は一つしかない。分かってる。',
            zh: '变量只有一个。我知道。',
            en: 'There is exactly one variable. I know that.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她做了对照组。她一个人在天台上坐到二十一点，就为了确认那个变量是你。',
            en: 'She ran the control. She sat alone on this roof until nine at night to confirm that the variable was you.'
          }
        ]
      },
      {
        id: 'rei2_check_mine',
        labelZh: '把手腕伸过去：「量我的。」',
        labelEn: 'Hold out your wrist. "Take mine."',
        jp: 'こっちも測って。',
        hintZh: '她要数据。给她数据',
        hintEn: 'She wants data. Give her data.',
        requires: { stat: 'charm', min: 5 },
        effects: [
          { stat: 'charm', amount: 3, reasonZh: '你用她唯一相信的东西回答了她', reasonEn: 'You answered her with the only thing she trusts' },
          { stat: 'guts', amount: 1, reasonZh: '你把自己的读数交了出去', reasonEn: 'You handed over your own reading' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 4, affection: 16, reasonZh: '她第一次量到了别人身上的同一个异常', reasonEn: 'It is the first time she has measured the same anomaly in someone else' }],
        setFlags: ['rei_story_measured_you'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}shy.webp`,
            zh: '她愣了一下，然后非常自然地照做了——她是那种"有数据就先取"的人。',
            en: 'She hesitates, then does it, entirely naturally. She is the sort of person who takes a reading first and thinks afterwards.'
          },
          {
            type: 'narration',
            zh: '微凉的指尖轻触在你手腕内侧的脉搏上，秒表的滴答声按下去。整整十五秒，她的呼吸清浅地拂过手背，目光专注地锁定在表盘上，自始至终不敢抬头看你。',
            en: 'Cool fingertips press against your inner wrist pulse as the stopwatch starts. For fifteen seconds, her faint breath brushes your skin, eyes intently on the dial, never once meeting yours.'
          },
          {
            type: 'narration',
            characterImage: `${R}shy.webp`,
            zh: '秒表咔哒停下。她半晌没有报出数字。',
            en: 'The stopwatch clicks stop. For a long pause she does not speak the number.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}shy.webp`,
            jp: '……九十八。',
            zh: '……九十八。',
            en: '...Ninety-eight.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她把手收回去，收得很慢。然后她做了一件很不像她的事：她没有把这个数字记进本子。',
            en: 'She takes her hand back, slowly. Then she does something very unlike her: she does not write the number down.'
          }
        ]
      }
    ]
  },

  // ---- 墙：她准备把它修好 ----
  {
    type: 'narration',
    zh: '她合上本子，从包里拿出另一样东西——一张打印出来的表。',
    en: 'She closes the notebook and takes something else out of her bag: a printed sheet.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: '来週から、観測は隔週にする。',
    words: [{ jp: '隔週', reading: 'かくしゅう', zh: '隔周、每两周一次', en: 'every other week' }],
    zh: '从下周开始，观测改成隔周一次。',
    en: 'From next week the observations move to fortnightly.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '表上是新的排期。第一列是日期，第二列是"参加人数"。后面几行的第二列全部写着「一」。',
    en: 'The sheet is a new schedule. First column the date, second column the number of participants. In the rows further down, the second column reads "1" all the way.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: '変数を一つずつ外していけば、原因は分かる。それが正しい手順。',
    zh: '一个一个把变量去掉，就能确定原因。这是正确的步骤。',
    en: 'Remove the variables one at a time and the cause becomes identifiable. That is the correct procedure.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '她说的是正确的步骤。她要去掉的那个变量是你。',
    en: 'It is the correct procedure. The variable she is proposing to remove is you.'
  },
  {
    type: 'narration',
    characterImage: `${R}neutral.webp`,
    zh: '她把表递过来的时候，手很稳。她这个人的手一直很稳。',
    en: 'Her hand is steady as she passes it over. Her hands are always steady.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '天台上很冷。她在等你签收那张表——她连"确认"那一栏都画好了。',
    promptEn: 'It is cold up here. She is waiting for you to accept the schedule. She has drawn a box for you to sign.',
    options: [
      {
        id: 'rei2_not_error',
        labelZh: '「那不是故障。那是数据。」',
        labelEn: '"That is not a fault. That is data."',
        jp: 'それ、エラーちゃう。データや。',
        words: [{ jp: '誤差', reading: 'ごさ', zh: '误差', en: 'margin of error' }],
        hintZh: '她把它归类成了要消除的东西。这一步归错了',
        hintEn: 'She has filed it under things to be eliminated. That filing is the mistake.',
        effects: [
          { stat: 'knowledge', amount: 3, reasonZh: '你指出了她整个方法论里唯一的漏洞', reasonEn: 'You found the one hole in her entire methodology' },
          { stat: 'guts', amount: 1, reasonZh: '你反驳了一个从来没被反驳过的人', reasonEn: 'You contradicted someone who never gets contradicted' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 5, affection: 18, reasonZh: '她的分类被推翻了，而她接受了', reasonEn: 'Her classification was overturned, and she accepted it' }],
        setFlags: ['rei_story_not_an_error'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}thinking.webp`,
            zh: '她停住了。',
            en: 'She stops.'
          },
          {
            type: 'narration',
            zh: '你说：你记录了七十几栋房子的年份，因为没有记录的东西会变成不存在过。那这一栏呢。',
            en: 'You say: she recorded the dates of seventy-odd buildings because a thing with no record becomes a thing that never was. So what about this column.'
          },
          {
            type: 'narration',
            zh: '你说：你要是把它当成误差消掉，它就真的没发生过了。',
            en: 'You say: if she eliminates it as error, then it really will never have happened.'
          },
          {
            type: 'narration',
            characterImage: `${R}shy.webp`,
            zh: '她看着那张排期表，看了很久很久。',
            en: 'She looks at the schedule for a very long time.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}shy.webp`,
            jp: '……私は、消したくない。',
            zh: '……我不想消掉它。',
            en: '...I do not want to delete it.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '这是她第一次说"我不想"。她说过"我判断"、"我认为"、"我确认"，从来没有说过"我不想"。',
            en: 'It is the first time she has said "I do not want". She has said I judge, I conclude, I confirm. Never I do not want.'
          }
        ]
      },
      {
        id: 'rei2_accept_schedule',
        labelZh: '接过那张表，签了',
        labelEn: 'Take the schedule and sign it',
        hintZh: '她说这是正确的步骤。她一向是对的',
        hintEn: 'She says it is the correct procedure. She is generally right.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你尊重了她的方法', reasonEn: 'You respected her method' }],
        relations: [{ char: CharacterId.REI, familiarity: 4, affection: 4, reasonZh: '她拿到了她要的东西，然后不太高兴', reasonEn: 'She got what she asked for, and was not pleased' }],
        then: [
          {
            type: 'narration',
            zh: '你签了。她收起表，动作比平常慢。',
            en: 'You sign. She puts the sheet away, more slowly than usual.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: '……そう。',
            zh: '……这样啊。',
            en: '...I see.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '收器材的时候你们按规矩说了话，但说的全是器材。',
            en: 'You talk while packing up, as the rules require. All of it is about equipment.'
          },
          {
            type: 'narration',
            characterImage: `${R}neutral.webp`,
            zh: '走到楼梯口，她忽然停下来。',
            en: 'At the top of the stairs she stops.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}thinking.webp`,
            jp: '……訂正する。隔週は、非効率だった。',
            zh: '……更正。隔周是低效的。',
            en: '...Correction. Fortnightly was inefficient.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她把表从包里拿出来，撕了，撕得很整齐——对折，再对折，然后沿折痕撕。',
            en: 'She takes the sheet back out and tears it up, very neatly: fold, fold again, tear along the crease.'
          }
        ]
      },
      {
        id: 'rei2_i_will_come',
        labelZh: '「那我照样来。你记你的，我坐我的。」',
        labelEn: '"Then I will come anyway. You record, I will just sit."',
        jp: 'ほな、勝手に来る。記録は好きにしたらええ。',
        hintZh: '不跟她辩。直接让那个变量赖着不走',
        hintEn: 'Do not argue with her. Just refuse to be removed.',
        requires: { stat: 'guts', min: 5 },
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你拒绝当一个可以被去掉的变量', reasonEn: 'You declined to be a removable variable' }],
        relations: [{ char: CharacterId.REI, familiarity: 7, affection: 14, reasonZh: '她的实验设计被一个人赖掉了', reasonEn: 'Her experimental design was defeated by somebody simply not leaving' }],
        setFlags: ['rei_story_refused_removal'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}neutral.webp`,
            zh: '她抬起头。',
            en: 'She looks up.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}neutral.webp`,
            jp: 'それだと、対照実験にならない。',
            zh: '那样的话，就构不成对照实验了。',
            en: 'In that case it does not constitute a control.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '你说：对。',
            en: 'You say: correct.'
          },
          {
            type: 'narration',
            characterImage: `${R}shy.webp`,
            zh: '她怔怔地看了你片刻，然后——你几乎可以笃定——她的嘴角极轻微地上扬了一下。那抹笑意转瞬即逝，微小到你甚至怀疑是自己眼花的幻觉。',
            en: 'She gazes at you in quiet surprise, and then — you are almost certain — the corners of her lips curve upward slightly. It vanishes so quickly you wonder if it was an illusion.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}shy.webp`,
            jp: '……困る。',
            zh: '……那我很为难。',
            en: '...That is inconvenient.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她说"为难"的时候，把那张排期表折起来收进了包最里面那一层——不是扔掉，是收好。',
            en: 'Saying inconvenient, she folds the schedule and puts it in the innermost pocket of her bag. Not thrown away. Put away.'
          }
        ]
      }
    ]
  },

  // ---- 收：她选择继续观测，不下结论 ----
  {
    type: 'narration',
    zh: '收器材。三脚架的第二节永远卡住，每次都是你来拧。',
    en: 'Packing up. The second section of the tripod always jams, and every time it is you who frees it.'
  },
  {
    type: 'narration',
    characterImage: `${R}neutral.webp`,
    zh: '拧完你把它递过去。她接的时候，两个人的手又碰了一下。',
    en: 'You free it and hand it over. Taking it, her hand touches yours again.'
  },
  {
    type: 'narration',
    zh: '这一次她没有躲，也没有记录。她只是把三脚架收进了套子里。',
    en: 'This time she does not flinch and she does not write it down. She just puts the tripod in its bag.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: '一つ、決めた。',
    zh: '我决定了一件事。',
    en: 'I have decided one thing.',
    color: 'bg-indigo-500'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}neutral.webp`,
    jp: 'あの項目は、記録は続ける。結論は、出さない。',
    words: [{ jp: '結論', reading: 'けつろん', zh: '结论', en: 'conclusion' }],
    zh: '那一栏，记录继续。结论，不下。',
    en: 'That column: I will go on recording it. I will not draw a conclusion.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '你问为什么不下结论。',
    en: 'You ask why not.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}shy.webp`,
    jp: '……結論を出すと、観測を続ける理由がなくなる。',
    zh: '……一旦下了结论，就没有继续观测的理由了。',
    en: '...Once a conclusion is drawn, there is no longer a reason to keep observing.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '这个人一辈子都在追求把事情解释清楚。今天她第一次决定，有一件事她要一直解释不清楚下去。',
    en: 'This person has spent her whole life trying to account for things. Today, for the first time, she has decided that there is one thing she intends to go on failing to account for.'
  },
  {
    type: 'narration',
    zh: '下楼的时候她走在前面。走到第八级台阶，她放慢了半步。',
    en: 'She goes down first. At the eighth step she drops half a pace.'
  },
  {
    type: 'narration',
    zh: '你现在知道那半步是什么了。',
    en: 'You know what that half pace is now.'
  },
  {
    type: 'effect',
    setFlags: ['rei_story_2_done', 'rei_story_keeps_recording'],
    effects: [
      { stat: 'knowledge', amount: 2, reasonZh: '你学会了一件她教不了的事：有些数据不需要结论', reasonEn: 'You learned the thing she cannot teach: some data does not need a conclusion' },
      { stat: 'proficiency', amount: 1, reasonZh: '你现在能听懂她那种没有语气的句子里的语气', reasonEn: 'You can now hear the tone inside her toneless sentences' }
    ],
    relations: [
      { char: CharacterId.REI, familiarity: 8, affection: 14, reasonZh: '她决定不去修好那个误差', reasonEn: 'She decided not to correct the error' }
    ]
  }
];
