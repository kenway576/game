import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 明日香 · 第①段「委員長の放課後」
//
// 触发：親密度 Lv.3「朋友」(90)
// 场景：放学后的图书室
//
// 第①段的职能是"你看见她不表演自己角色时的样子"。
// 明日香表演的角色叫「委員長」——一个只要把事情做对就不需要理由的身份。
// 所以这一段不能让她说心里话，得让玩家自己在一本笔记上看见。
//
// 【为什么把证据放在笔记本上，而不是让她说出来】
// 傲娇这个人设最容易写坏的地方，就是让她在第一段就交代自己。
// 她要是能说，她就不是她了。她能做的只有：在没人看见的时候，
// 花两个小时给一份根本不需要注音的讲义标满假名，然后在被撞破时
// 说这是"顺手"。玩家读到的是那两个小时，她嘴里说的是那两个字。
// 落差就在这儿，不需要任何人点破。
//
// 【那个数字】
// 讲义上她标了三百多个注音，而全班只有一个人需要注音。
// 这句话由玩家自己在心里算出来，剧本一个字都不解释。
//
// 【致敬：和第②段同一条线】
// 第②段借的是 EVA 的明日香 ×《无职转生》的爱丽丝，两个人的交叉点是
// "把自己的价值当成有条件、可撤销的东西"。这一段是那条线的**起点**：
// 她为什么要当委员长。
//
// EVA 那一半在这里的形状是：**有用是被允许留在这儿的租金。**
// 明日香驾驶初号机不是因为喜欢，是因为不驾驶她就没有理由被留下。
// 所以铃她做这些事的时候，用的词是"没办法"、"顺便"、"总得有人做"——
// 她不能承认自己想做，因为一旦是"想做"，就等于承认这件事可以不做，
// 而可以不做的事，做完了也不能换到留下来的资格。
//
// 爱丽丝那一半在这里的形状是：**行动先于语言，功劳一律否认。**
// 她花两小时标三百个假名，然后说那是顺便。
// 玩家看见的是那两个小时，她嘴里说的是那两个字。
// ---------------------------------------------------------

const A = '/images/characters/asuka/';

export const ASUKA_STORY_1: StoryNode[] = [
  {
    type: 'scene',
    scene: 'school_library',
    bgm: 'chat',
    titleZh: '委員長の放課後',
    titleEn: 'The Class President After Hours',
    subtitleZh: '放学后 · 图书室',
    subtitleEn: 'After school · The library'
  },
  {
    type: 'narration',
    zh: '你被叫住的时候，一只脚已经迈出教室门了。',
    en: 'One foot was already out of the classroom door when she called you.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: 'あんた、今日ヒマでしょ。顔に書いてある。',
    words: [{ jp: '暇', reading: 'ひま', zh: '有空、闲', en: 'free time' }],
    zh: '你今天有空吧。脸上写着呢。',
    en: 'You are free today. It is written on your face.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '你想说自己其实有安排。你确实没有。她已经把一摞讲义塞进你怀里了。',
    en: 'You want to say you have plans. You do not have plans. A stack of handouts is already in your arms.'
  },
  {
    type: 'narration',
    zh: '图书室靠西的窗，下午三点以后整间屋子是蜂蜜色的。管理员打了个招呼就走了，说锁交给委员长。',
    en: 'The library window faces west; after three the whole room goes the colour of honey. The librarian says hello, then leaves, saying the class president can lock up.'
  },
  {
    type: 'narration',
    characterImage: `${A}neutral.webp`,
    zh: '「按班级分。三年级的放最上面，他们最急。」她说完就坐下了，动作快得像做过一百次。因为她确实做过一百次。',
    en: '"Sort by class. Third years on top, they are the ones in a hurry." She sits down as she says it, moving like someone who has done this a hundred times, because she has.'
  },
  {
    type: 'narration',
    zh: '有二十分钟，房间里只有纸张摩擦的声音。你偷偷看了她两次。她一次都没看你。',
    en: 'For twenty minutes there is nothing in the room but the sound of paper. You look over at her twice. She does not look over once.'
  },

  // ---- 选择 1：要不要主动开口 ----
  {
    type: 'choice',
    promptZh: '纸摞得差不多了。她还没有要走的意思。',
    promptEn: 'The stacks are nearly done. She shows no sign of leaving.',
    options: [
      {
        id: 'asuka1_ask_why',
        labelZh: '问她：为什么是我',
        labelEn: 'Ask her: why me',
        jp: 'なんで、俺だったんですか。',
        hintZh: '班上三十几个人，她偏偏在门口截住了你',
        hintEn: 'Thirty-odd people in that class, and she waited at the door for you.',
        effects: [{ stat: 'guts', amount: 1, reasonZh: '你问了一个她大概不想回答的问题', reasonEn: 'You asked something she would rather not answer' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 4, affection: 2, reasonZh: '她被问住了一秒', reasonEn: 'It stopped her for a second' }],
        then: [
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}smug.webp`,
            jp: '断らなさそうだったから。',
            zh: '因为你看起来不会拒绝。',
            en: 'Because you looked like someone who would not say no.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '这个回答太快了，快得像早就准备好的。',
            en: 'The answer comes too fast. Fast enough to have been prepared.'
          }
        ]
      },
      {
        id: 'asuka1_quiet',
        labelZh: '什么也不问，继续分',
        labelEn: 'Ask nothing. Keep sorting.',
        hintZh: '她不说话的时候，房间是安静的，不是尴尬的',
        hintEn: 'When she is quiet the room is quiet, not awkward.',
        effects: [{ stat: 'kindness', amount: 1, reasonZh: '你没有硬要她说话', reasonEn: 'You did not make her talk' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 5, affection: 1, reasonZh: '她习惯了别人来找她要话说', reasonEn: 'She is used to people needing her to fill silences' }],
        then: [
          {
            type: 'narration',
            characterImage: `${A}neutral.webp`,
            zh: '又过了十分钟。她忽然开口了，声音比刚才小。',
            en: 'Another ten minutes. Then she speaks, more quietly than before.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}neutral.webp`,
            jp: '……こういうの、静かでいいわね。',
            zh: '……这样挺好的。安静。',
            en: '...This is fine. Quiet.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '你抬起头。她马上补了一句：「纸多的时候说话容易分心。」',
            en: 'You look up. She adds immediately that talking makes you lose count when there is this much paper.'
          }
        ]
      },
      {
        id: 'asuka1_tease',
        labelZh: '「委員長，你每周都干这个？」',
        labelEn: '"Do you do this every week, Madam President?"',
        jp: '委員長って、毎週これやってるんですか。',
        words: [{ jp: '委員長', reading: 'いいんちょう', zh: '班长、委员长', en: 'class president' }],
        hintZh: '你用了敬语，而且故意用了那个头衔',
        hintEn: 'You used polite form, and you used the title on purpose.',
        requires: { stat: 'charm', min: 3 },
        effects: [{ stat: 'charm', amount: 2, reasonZh: '你成功地惹到了她一下', reasonEn: 'You successfully got under her skin, once' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 3, affection: 4, reasonZh: '她瞪了你一眼，但没有反驳', reasonEn: 'She glared, but did not argue' }],
        then: [
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}angry.webp`,
            jp: 'その言い方やめて。',
            zh: '别这么说话。',
            en: 'Do not say it like that.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '她低头继续分纸。耳朵有点红，但也可能是夕阳。你决定认为是夕阳。',
            en: 'She goes back to the paper. Her ears are a little red, though that could be the light. You decide it is the light.'
          }
        ]
      }
    ]
  },

  // ---- 那本笔记 ----
  {
    type: 'narration',
    zh: '最后一摞在她那边。她起身去关西边的窗，桌上摊着的东西你就这么看见了。',
    en: 'The last stack is on her side. She gets up to close the west window, and what is lying open on the desk is simply there.'
  },
  {
    type: 'narration',
    zh: '一份跟你手上一模一样的讲义。区别是：她那份的每一个汉字上面，都用铅笔写了假名。',
    en: 'A copy of the same handout you have been sorting. The difference is that on hers, every single kanji has furigana pencilled above it.'
  },
  {
    type: 'narration',
    zh: '不是几个难字。是每一个。整整两面。',
    en: 'Not the hard ones. Every one. Both sides, all the way down.'
  },
  {
    type: 'narration',
    zh: '你翻了一下——下面还压着上周的、上上周的。都标满了。',
    en: 'You lift the corner. Last week is underneath it, and the week before that. All of them filled in.'
  },
  {
    type: 'narration',
    zh: '这份讲义发给全班三十六个人。这个班上需要注音的人只有一个。',
    en: 'Thirty-six people got this handout. Exactly one person in that class needs the readings.'
  },
  {
    type: 'narration',
    characterImage: `${A}surprised.webp`,
    zh: '她转过身来的时候，你已经来不及装作没看见了。',
    en: 'By the time she turns round, it is far too late to pretend you did not see.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}surprised.webp`,
    jp: '——それ、',
    zh: '——那个，',
    en: '—That is,',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她伸手要把本子抽走。半路上停住了，因为她意识到抽走比放着更像承认。',
    en: 'Her hand goes for the notebook and stops halfway, because taking it back would look more like an admission than leaving it there.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}shy.webp`,
    jp: '……ついで。全部ついでよ。',
    words: [{ jp: 'ついで', reading: 'ついで', zh: '顺便、顺手', en: 'while I was at it' }],
    zh: '……顺便。全都是顺便。',
    en: '...While I was at it. All of it, while I was at it.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '「顺便」两个字，写了三百多个假名。',
    en: 'Three hundred-odd readings, written while she was at it.'
  },
  {
    type: 'narration',
    zh: '窗外操场上有人在收球网。铁架子倒下去的声音传上来，房间里安静了一会儿。',
    en: 'Out on the field someone is taking down a net. The frame comes down with a clatter, and the room is quiet for a moment.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: '委員長って、別にやりたくてやってるわけじゃないから。',
    words: [{ jp: '別に', reading: 'べつに', zh: '并不是、也没什么', en: 'not particularly' }],
    zh: '当委员长，我也不是想当才当的。',
    en: 'It is not as though I do the class president thing because I want to.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '你没有问她这个。她自己说的。',
    en: 'You had not asked. She volunteered it.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: '誰かがやらなきゃいけないでしょ。だったら、いちばん出来る人がやるのが効率的。',
    zh: '总得有人做吧。那就让最能做的人做，这样最有效率。',
    en: 'Somebody has to. So the most capable person doing it is the efficient arrangement.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '这套说法很完整，完整到你听出来它被用过很多次。',
    en: 'It is a complete argument. Complete enough that you can hear it has been used a lot of times.'
  },
  {
    type: 'narration',
    zh: '你注意到她把"想不想"和"能不能"完全分开了，而且只用后一半来解释自己。',
    en: 'You notice she has separated wanting from being able, and explains herself using only the second half.'
  },
  {
    type: 'narration',
    zh: '那么问题是：如果哪天她不是最能做的那个人了呢。',
    en: 'Which raises a question. What happens on the day she is not the most capable person.'
  },
  {
    type: 'narration',
    zh: '这个问题你没有问出口。当时你只是觉得，这个想法有点冷。',
    en: 'You do not ask it. At the time you only think that it is a cold way to arrange a life.'
  },

  // ---- 选择 2：你怎么接 ----
  {
    type: 'choice',
    promptZh: '她站在那儿等你说点什么。你说什么都会被她驳回，但她还是在等。',
    promptEn: 'She stands there waiting for you to say something. She will argue with whatever you say, and she is waiting anyway.',
    options: [
      {
        id: 'asuka1_thanks',
        labelZh: '直接道谢，不绕弯子',
        labelEn: 'Just say thank you',
        jp: 'ありがとう。ずっと、これのおかげで読めてた。',
        words: [{ jp: 'おかげ', reading: 'おかげ', zh: '多亏、托……的福', en: 'thanks to' }],
        hintZh: '这几周你能跟上课，靠的是这个',
        hintEn: 'These few weeks you have been keeping up. This is why.',
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你没有替她把台阶铺好，你直接说了实话', reasonEn: 'You did not give her an out. You just said the true thing' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 5, affection: 10, reasonZh: '她第一次没有把感谢顶回去', reasonEn: 'For once she did not deflect being thanked' }],
        setFlags: ['asuka_story_thanked_furigana'],
        then: [
          {
            type: 'narration',
            characterImage: `${A}shy.webp`,
            zh: '她张嘴要反驳。没反驳出来。',
            en: 'Her mouth opens to argue. Nothing comes out.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}shy.webp`,
            jp: '……別に。あんたが授業についてこられないと、クラスの平均が下がるから。',
            zh: '……没什么。你跟不上的话，班级平均分会掉。',
            en: '...It is nothing. If you cannot follow the lesson the class average drops.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '你没有指出「平均分」这件事和注音之间隔着多远。你只是把本子合上，端端正正放回她桌上。',
            en: 'You do not point out how far apart the class average and three hundred pencilled readings actually are. You just close the notebook and set it back squarely on her desk.'
          }
        ]
      },
      {
        id: 'asuka1_play_along',
        labelZh: '顺着她说：「那顺便帮我看看这个字。」',
        labelEn: 'Play along: "Then while you are at it, what is this one?"',
        jp: 'じゃあ、ついでにこの字も教えてください。',
        hintZh: '给她一个不用承认任何事的出口',
        hintEn: 'Hand her a way out that costs her nothing.',
        effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你学会了怎么跟这个人说话', reasonEn: 'You are learning how to talk to this particular person' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 8, affection: 6, reasonZh: '你替她把台阶铺好了，她走了下来', reasonEn: 'You built her a way down and she took it' }],
        then: [
          {
            type: 'narration',
            characterImage: `${A}neutral.webp`,
            zh: '她愣了半秒，然后整个人放松下来，像是终于回到了一个她知道该怎么做的位置。',
            en: 'Half a second of blankness, then she settles, like someone returned to a job she knows how to do.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}smug.webp`,
            jp: 'それは「委嘱」。いいんちょ、じゃなくて、いしょく。',
            words: [{ jp: '委嘱', reading: 'いしょく', zh: '委托、委任', en: 'to entrust / to commission' }],
            zh: '那个念「委嘱」。不是「委员长」，是「委嘱」。',
            en: 'That one is "ishoku". Not "iinchou". "Ishoku".',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '接下来一个小时，你们把那份讲义从头到尾念了一遍。窗外的光从蜂蜜色变成橘色，又变成灰的。',
            en: 'For the next hour you read the whole handout aloud between you. The light outside goes from honey to orange to grey.'
          },
          {
            type: 'narration',
            zh: '她一次都没有嫌你慢。',
            en: 'Not once does she complain that you are slow.'
          }
        ]
      },
      {
        id: 'asuka1_silent_look',
        labelZh: '什么都不说，只是看着她',
        labelEn: 'Say nothing. Just look at her.',
        hintZh: '有些事一旦说破，她就再也不会做第二次了',
        hintEn: 'Some things, once said out loud, she will never do again.',
        requires: { stat: 'kindness', min: 4 },
        effects: [{ stat: 'kindness', amount: 2, reasonZh: '你选择让这件事继续是"顺便"', reasonEn: 'You let it go on being nothing in particular' }],
        relations: [{ char: CharacterId.ASUKA, familiarity: 6, affection: 8, reasonZh: '她需要这件事不被戳破', reasonEn: 'She needed this one to stay unspoken' }],
        setFlags: ['asuka_story_kept_quiet'],
        then: [
          {
            type: 'narration',
            zh: '你把本子合上，推回她那边，然后继续分你手上那摞。',
            en: 'You close the notebook, push it back to her side, and go on sorting your own stack.'
          },
          {
            type: 'narration',
            characterImage: `${A}neutral.webp`,
            zh: '她站了一会儿才坐下。坐下之后很久没有动。',
            en: 'She stands there a moment before she sits. Once she sits she does not move for a long time.'
          },
          {
            type: 'speech',
            speakerZh: '明日香', speakerEn: 'Asuka',
            characterImage: `${A}neutral.webp`,
            jp: '……来週も、木曜。',
            zh: '……下周也是。星期四。',
            en: '...Next week as well. Thursday.',
            color: 'bg-red-600'
          },
          {
            type: 'narration',
            zh: '这不是邀请。这是排班。你说好。',
            en: 'That is not an invitation, that is a rota. You say all right.'
          }
        ]
      }
    ]
  },

  // ---- 收 ----
  {
    type: 'narration',
    zh: '锁门的是她。她把钥匙串在手指上转了一圈，转得很熟练，接住的时候没看。',
    en: 'She locks up. The keyring spins once around her finger, expertly, and she catches it without looking.'
  },
  {
    type: 'narration',
    characterImage: `${A}neutral.webp`,
    zh: '走廊上没有别人。你们的脚步声一前一后，隔着大概两步。',
    en: 'The corridor is empty. Your footsteps go one after the other, about two paces apart.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}neutral.webp`,
    jp: 'ねえ。日本語、難しい？',
    zh: '喂。日语，难吗？',
    en: 'Hey. Is Japanese hard?',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '你说难。你说很难。',
    en: 'You say yes. You say very.'
  },
  {
    type: 'narration',
    characterImage: `${A}shy.webp`,
    zh: '她"嗯"了一声，然后在鞋柜那儿分开的时候，说了一句你差点没听清的话。',
    en: 'She makes a small noise, and then at the shoe lockers, where you part, she says something you nearly miss.'
  },
  {
    type: 'speech',
    speakerZh: '明日香', speakerEn: 'Asuka',
    characterImage: `${A}shy.webp`,
    jp: '難しいままでいいから、やめないでよ。',
    words: [{ jp: 'やめる', reading: 'やめる', zh: '放弃、停止', en: 'to quit / to stop' }],
    zh: '难就难着吧。别放弃就行。',
    en: 'It can stay hard. Just do not quit.',
    color: 'bg-red-600'
  },
  {
    type: 'narration',
    zh: '她说完就走了，走得很快，跟平时一样。',
    en: 'Then she is gone, walking fast, exactly as usual.'
  },
  {
    type: 'narration',
    zh: '你在鞋柜前站了一会儿。今天你什么日语都没学到，但你知道了一件更要紧的事：',
    en: 'You stand at the lockers a moment. You learned no Japanese today, but you learned something that matters more:'
  },
  {
    type: 'narration',
    zh: '这个人对你好的方式，是不让你知道她对你好。',
    en: 'The way this person is kind to you is by making sure you never find out.'
  },
  {
    type: 'effect',
    setFlags: ['asuka_story_1_done'],
    effects: [
      { stat: 'knowledge', amount: 2, reasonZh: '一份讲义念了两遍，从头到尾', reasonEn: 'One handout, read end to end, twice' },
      { stat: 'proficiency', amount: 1, reasonZh: '你开始能听出她话里被省略的那半句', reasonEn: 'You are starting to hear the half of her sentences she leaves out' }
    ],
    relations: [
      { char: CharacterId.ASUKA, familiarity: 10, affection: 6, reasonZh: '你看见了她不打算给任何人看的那一面', reasonEn: 'You saw the side of her she had no intention of showing anyone' }
    ]
  }
];
