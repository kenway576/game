import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 深雪 · 第③段「名前で呼んで」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：海风庄的阳台 + cg_miyuki
//
// 【第②段留下的题】
// 她说"当姐姐最轻松"。那是一句拒绝，而且是最难反驳的那一种——
// 因为她没有说自己不快乐，她说的是这样省事。
//
// 【这一段怎么解：一个称呼】
// 薇尔莉特那条线的落点不是"她学会了爱"，是**她第一次为自己写了一封信**。
// 深雪的对应物是一个称呼。
//
// 全楼的人叫她「２０２号室の人」「お姉さん」「深雪さん」。
// 这些称呼有一个共同点：**都是她的功能，不是她的名字。**
// 而"深雪"这两个字，最后一次有人这样叫她，是很久以前的事了。
//
// 所以这一段的关键动作非常小：直呼其名，不加任何后缀。
// 小到玩家可能会觉得这算什么——而这正是它有效的原因，
// 因为对她来说这件事大到她会当场愣住。
//
// 【为什么是雨后】
// 她的 CG 是《雨过天晴的红茶》。雨停了，天亮了，
// 而她终于是被端茶的那一个。
// ---------------------------------------------------------

const M = '/images/characters/miyuki/';

export const MIYUKI_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'apartment_balcony',
    bgm: 'lobby',
    titleZh: '名前で呼んで',
    titleEn: 'Call Me by My Name',
    subtitleZh: '雨后 · 海风庄的阳台',
    subtitleEn: 'After the rain · The balcony at Umikaze-so'
  },
  {
    type: 'narration',
    zh: '下了两天雨，今天早上停了。整栋楼的走廊都在滴水。',
    en: 'It rained for two days and stopped this morning. The whole corridor is dripping.'
  },
  {
    type: 'narration',
    zh: '203 的小孩昨晚发烧。她整夜没睡，陪着那家人去了两趟诊所。',
    en: 'The child in 203 had a fever last night. She did not sleep, and went to the clinic with the family twice.'
  },
  {
    type: 'narration',
    characterImage: `${M}cardigan_sad.webp`,
    zh: '现在是早上七点。她坐在阳台上，还穿着昨天那件开衫。',
    en: 'It is seven in the morning. She is sitting on the balcony, still in yesterday’s cardigan.'
  },
  {
    type: 'narration',
    zh: '你敲了门。她开门的时候第一句话是「あら、朝ごはんは？」。',
    en: 'You knock. The first thing she says on opening the door is to ask whether you have had breakfast.'
  },
  {
    type: 'narration',
    zh: '她一夜没睡，照顾了别人一整晚，开门第一句问的是你吃了没有。',
    en: 'She has been up all night looking after somebody else, and the first thing out of her mouth is whether you have eaten.'
  },

  // ---- 你把她按在椅子上 ----
  {
    type: 'narration',
    zh: '你说你已经吃过了。然后你走进厨房。',
    en: 'You say you have. Then you go into the kitchen.'
  },
  {
    type: 'narration',
    characterImage: `${M}neutral.webp`,
    zh: '她跟进来要拦。你把她请回阳台的椅子上，她拦了三次，你请了三次。',
    en: 'She follows to stop you. You steer her back to the chair on the balcony. She objects three times and you steer three times.'
  },
  {
    type: 'narration',
    zh: '第四次她没有再站起来。她坐在那儿，两只手放在膝盖上，像一个不知道该干什么的人。',
    en: 'The fourth time she does not get up. She sits with her hands on her knees, like somebody with nothing to do.'
  },
  {
    type: 'narration',
    zh: '你煮了红茶。用的是那两个杯子里的一个——另一个你也拿了出来。',
    en: 'You make tea. You use one of the pair, and take the other one out as well.'
  },
  {
    type: 'narration',
    characterImage: `${M}cardigan_shy.webp`,
    zh: '你把两个杯子都端出去，一个放在她面前，一个放在自己面前。',
    en: 'You bring both out, one in front of her and one in front of you.'
  },
  {
    type: 'narration',
    zh: '那口两人份的锅，第一次真的有两个人。',
    en: 'The two-person kitchen has, for the first time, two people in it.'
  },
  {
    type: 'speech',
    speakerZh: '深雪', speakerEn: 'Miyuki',
    characterImage: `${M}cardigan_shy.webp`,
    jp: '……お砂糖、入れちゃった？',
    zh: '……放糖了吗？',
    en: '...Did you put sugar in it?',
    color: 'bg-violet-400'
  },
  {
    type: 'narration',
    zh: '你说放了两块。她说她平常不放。你说你知道，但她今天该放。',
    en: 'You say two lumps. She says she does not normally. You say you know, and that today she should.'
  },
  {
    type: 'narration',
    characterImage: `${M}shy.webp`,
    zh: '她没有争。她端起杯子，喝了一口，然后就那样捧着，很久没有放下。',
    en: 'She does not argue. She lifts the cup, drinks, and then holds it without putting it down for a long time.'
  },

  // ---- 关键选择：那个称呼 ----
  {
    type: 'choice',
    promptZh: '雨后的太阳照到阳台上。她还没有说话。',
    promptEn: 'The sun after the rain reaches the balcony. She has not said anything.',
    options: [
      {
        id: 'miyuki3_name',
        labelZh: '叫她的名字。不加任何称呼。',
        labelEn: 'Say her name. Nothing attached to it.',
        jp: '深雪。',
        words: [{ jp: '呼ぶ', reading: 'よぶ', zh: '称呼、叫', en: 'to call (someone something)' }],
        hintZh: '这栋楼里所有人叫的都是她的功能',
        hintEn: 'Everybody in this building calls her by her function.',
        effects: [
          { stat: 'guts', amount: 3, reasonZh: '你去掉了那两个字后面的所有东西', reasonEn: 'You removed everything that usually follows those two syllables' },
          { stat: 'charm', amount: 1, reasonZh: '你说得很轻，但没有含糊', reasonEn: 'You said it quietly, and did not blur it' }
        ],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 6, affection: 22, reasonZh: '有人叫了她的名字，只有名字', reasonEn: 'Somebody said her name, and only her name' }],
        setFlags: ['miyuki_story_called_name'],
        then: [
          {
            type: 'narration',
            characterImage: `${M}shy.webp`,
            zh: '杯子在她手里晃了一下。有一点茶洒在了手背上，她没有擦。',
            en: 'The cup moves in her hands. A little tea goes over the back of one of them. She does not wipe it.'
          },
          {
            type: 'narration',
            zh: '这栋楼里所有人叫她：「２０２号室の人」「お姉さん」「深雪さん」。',
            en: 'In this building she is called: the person in 202, the older sister, Miyuki-san.'
          },
          {
            type: 'narration',
            zh: '这些称呼有一个共同点：都是她的用处，不是她。',
            en: 'All of those have one thing in common. They are her use, not her.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}shy.webp`,
            jp: '……その呼び方、',
            zh: '……那个叫法，',
            en: '...That way of saying it,',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她停了很久。久到你以为自己做错了。',
            en: 'She stops for long enough that you think you have made a mistake.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}cardigan_sad.webp`,
            jp: '……最後に言われたの、いつだったかしら。',
            zh: '……上一次被这样叫，是什么时候来着。',
            en: '...When was the last time somebody said it like that, I wonder.',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她真的在想。她想了很久，最后没有想起来。',
            en: 'She genuinely tries to remember. It takes a while, and she does not manage it.'
          }
        ]
      },
      {
        id: 'miyuki3_sleep',
        labelZh: '「今天什么都别做。我在这儿。」',
        labelEn: '"Do nothing today. I am here."',
        jp: '今日は何もせんといてください。俺、おるんで。',
        hintZh: '她一夜没睡，而今天是周六',
        hintEn: 'She has not slept, and it is Saturday.',
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你把"什么都不做"变成了一件被允许的事', reasonEn: 'You made doing nothing into a permitted thing' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 8, affection: 16, reasonZh: '有人替她把那一天空了出来', reasonEn: 'Somebody cleared a day on her behalf' }],
        then: [
          {
            type: 'narration',
            characterImage: `${M}neutral.webp`,
            zh: '她说不行，今天要洗床单、要去买 101 的药、要给 103 留门。',
            en: 'She says she cannot: sheets, the prescription for 101, leaving the door for 103.'
          },
          {
            type: 'narration',
            zh: '你说这三件你来。她说那怎么行。你说为什么不行。',
            en: 'You say you will do all three. She says she could not possibly. You ask why not.'
          },
          {
            type: 'narration',
            characterImage: `${M}cardigan_sad.webp`,
            zh: '她答不上来。',
            en: 'She has no answer.'
          },
          {
            type: 'narration',
            zh: '那一整天她真的什么都没做。下午三点你回来的时候，她在沙发上睡着了，茶只喝了一半。',
            en: 'She does nothing at all that day. When you come back at three she is asleep on the sofa with half the tea left.'
          }
        ]
      },
      {
        id: 'miyuki3_ask_name',
        labelZh: '问她：想被怎么叫',
        labelEn: 'Ask her how she would like to be called',
        jp: 'どう呼ばれたいですか。',
        hintZh: '她这辈子大概没被问过这个',
        hintEn: 'Nobody has likely asked her that in her life.',
        requires: { stat: 'kindness', min: 6 },
        effects: [{ stat: 'kindness', amount: 3, reasonZh: '你把选择权交了出去', reasonEn: 'You handed over the choice' }],
        relations: [{ char: CharacterId.MIYUKI, familiarity: 5, affection: 19, reasonZh: '她第一次被问自己想要什么', reasonEn: 'For the first time she was asked what she wanted' }],
        setFlags: ['miyuki_story_asked_name'],
        then: [
          {
            type: 'narration',
            characterImage: `${M}neutral.webp`,
            zh: '她第一反应是笑着说「どちらでも」。',
            en: 'Her first response is to smile and say either is fine.'
          },
          {
            type: 'narration',
            zh: '你说这不是答案。她说她知道。',
            en: 'You say that is not an answer. She says she knows.'
          },
          {
            type: 'narration',
            characterImage: `${M}cardigan_sad.webp`,
            zh: '然后她安静了很长时间，长到茶都凉了。',
            en: 'Then she is quiet for long enough that the tea goes cold.'
          },
          {
            type: 'speech',
            speakerZh: '深雪', speakerEn: 'Miyuki',
            characterImage: `${M}shy.webp`,
            jp: '……「さん」、なしで。',
            zh: '……不要加「さん」。',
            en: '...Without the "san".',
            color: 'bg-violet-400'
          },
          {
            type: 'narration',
            zh: '她自己说了出来。这是她这辈子第一次要一样东西，而那样东西是两个字。',
            en: 'She says it herself. It is the first thing she has asked for in her life, and it is two syllables.'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '楼下有人在收晾了两天的被子。太阳把整条走廊晒得发白。',
    en: 'Downstairs somebody is taking in bedding that has hung for two days. The sun has bleached the whole corridor.'
  },

  // ---- 双结局 ----
  {
    type: 'check',
    metric: 'affection',
    min: 200,

    // ============ 相爱 ============
    then: [
      {
        type: 'narration',
        characterImage: `${M}cardigan_shy.webp`,
        zh: '她把杯子放下，两只手放在膝盖上，坐得很直——像要说一件正式的事。',
        en: 'She puts the cup down, puts her hands on her knees and sits up straight, as though about to say something formal.'
      },
      {
        type: 'speech',
        speakerZh: '深雪', speakerEn: 'Miyuki',
        characterImage: `${M}cardigan_shy.webp`,
        jp: 'あのね。ひとつ、白状させてもらってもいい？',
        words: [{ jp: '白状', reading: 'はくじょう', zh: '坦白', en: 'to confess' }],
        zh: '那个啊。能让我坦白一件事吗？',
        en: 'Listen. May I confess something?',
        color: 'bg-violet-400'
      },
      {
        type: 'narration',
        zh: '你说可以。',
        en: 'You say she may.'
      },
      {
        type: 'speech',
        speakerZh: '深雪', speakerEn: 'Miyuki',
        characterImage: `${M}cardigan_sad.webp`,
        jp: '「作りすぎちゃった」って、一度も本当じゃなかったの。',
        zh: '「做多了」这句话，一次都不是真的。',
        en: 'Not once was it true that I had made too much.',
        color: 'bg-violet-400'
      },
      {
        type: 'narration',
        zh: '你早就知道了。你从第一次数到第七次的时候就知道了。',
        en: 'You already knew. You knew somewhere between the first time and the seventh.'
      },
      {
        type: 'speech',
        speakerZh: '深雪', speakerEn: 'Miyuki',
        characterImage: `${M}shy.webp`,
        jp: '最初から二人分。ずっと、あなたの分。',
        zh: '从一开始就是两人份。一直，都是你的那一份。',
        en: 'Two portions from the start. All of it, your portion.',
        color: 'bg-violet-400'
      },
      {
        type: 'narration',
        zh: '她说完之后立刻低下头，像是说完就想收回。',
        en: 'She looks down the instant it is out, like somebody who would take it back if she could.'
      },
      {
        type: 'cg',
        cgId: 'cg_miyuki',
        imageUrl: '/images/cg/cg_miyuki.webp',
        titleZh: '雨过天晴的红茶', titleEn: 'Tea After the Rain',
        captionZh: '她抬起头。晨光从落地窗照进来，落在两个杯子中间。她伸出手，把你那杯往自己这边挪了一点点，挪到两个杯子挨在一起。',
        captionEn: 'She looks up. The morning comes through the window and lands between the two cups. She reaches over and moves yours a little towards her, until the two are touching.'
      },
      {
        type: 'narration',
        zh: '你叫了她的名字。这一次她抬起头看着你，没有躲。',
        en: 'You say her name. This time she looks up and does not look away.'
      },
      {
        type: 'speech',
        speakerZh: '深雪', speakerEn: 'Miyuki',
        characterImage: `${M}love.webp`,
        jp: '……もう一回、呼んで。',
        zh: '……再叫一次。',
        en: '...Say it again.',
        color: 'bg-violet-400'
      },
      {
        type: 'narration',
        zh: '你叫了很多次。到第五次的时候她终于哭了，而且是笑着哭的——这是她第一次在别人面前不忙着解释自己在干什么。',
        en: 'You say it many times. At the fifth she finally cries, and she is laughing while she does. It is the first time she has been in front of somebody without explaining herself.'
      },
      {
        type: 'effect',
        setFlags: ['miyuki_ending_love', 'miyuki_story_3_done'],
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你端了一次茶，端给那个只端给别人的人', reasonEn: 'You carried tea to the person who only ever carries it' },
          { stat: 'charm', amount: 2, reasonZh: '你把一个称呼变回了一个名字', reasonEn: 'You turned a form of address back into a name' }
        ],
        relations: [
          { char: CharacterId.MIYUKI, familiarity: 12, affection: 24, reasonZh: '那口锅从一开始就是为两个人配的', reasonEn: 'The two-person kitchen had been for two people from the start' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'narration',
        characterImage: `${M}cardigan_neutral.webp`,
        zh: '她从围裙口袋里拿出一样东西，放在桌上——一把钥匙。',
        en: 'She takes something out of her apron pocket and puts it on the table. A key.'
      },
      {
        type: 'speech',
        speakerZh: '深雪', speakerEn: 'Miyuki',
        characterImage: `${M}cardigan_neutral.webp`,
        jp: '２０２の合鍵。持っといて',
        zh: '202 的备用钥匙。你拿着吧。',
        en: 'The spare for 202. Keep it.',
        color: 'bg-violet-400'
      },
      {
        type: 'narration',
        zh: '你说这不合适。她说合适。',
        en: 'You say that is not appropriate. She says it is.'
      },
      {
        type: 'speech',
        speakerZh: '深雪', speakerEn: 'Miyuki',
        characterImage: `${M}cardigan_sad.webp`,
        jp: 'この前の、緊急連絡先の話。あれ、書き換えたの',
        zh: '之前那个紧急联络人的事。我改了。',
        en: 'That business about the emergency contact. I changed mine.',
        color: 'bg-violet-400'
      },
      {
        type: 'narration',
        zh: '你问改成了谁。她没有回答，只是把钥匙又往你那边推了一点。',
        en: 'You ask to whom. She does not answer, and pushes the key a little further towards you.'
      },
      {
        type: 'narration',
        zh: '那一栏空了很多年。现在有人了，而且那个人有备用钥匙。',
        en: 'That field was blank for years. It has somebody in it now, and that somebody has a spare key.'
      },
      {
        type: 'speech',
        speakerZh: '深雪', speakerEn: 'Miyuki',
        characterImage: `${M}happy.webp`,
        jp: 'あと、これからは呼び捨てでいいわよ。「さん」、いらない',
        zh: '还有，以后直接叫就行了。不用「さん」。',
        en: 'And from now on you can just say it. You do not need the "san".',
        color: 'bg-violet-400'
      },
      {
        type: 'narration',
        zh: '你叫了一声。她"はい"了一句，声音很轻，然后转身去洗那两个杯子。',
        en: 'You say it. She answers, very quietly, and turns to wash the two cups.'
      },
      {
        type: 'narration',
        zh: '你们没有在一起。但从这天起，那口两人份的锅，两份都有人吃了。',
        en: 'You are not together. But from this day, both portions out of that two-person pot get eaten.'
      },
      {
        type: 'effect',
        setFlags: ['miyuki_ending_friend', 'miyuki_story_3_done'],
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你让一个只会给的人收下了一次', reasonEn: 'You got somebody who only gives to accept something once' }
        ],
        relations: [
          { char: CharacterId.MIYUKI, familiarity: 24, affection: 8, reasonZh: '她改了那一栏，而且给了你钥匙', reasonEn: 'She changed the field, and gave you the key' }
        ]
      }
    ]
  }
];
