import { StoryNode, CharacterId } from '../../types';

// ---------------------------------------------------------
// 铃 · 第③段「星図の余白」
//
// 触发：好感度 Lv.5「挚爱」(220)
// 场景：六甲山夜景台 + cg_rei
//
// 【致敬一：planetarian ～ちいさなほしのゆめ～】
// 借的是ゆめみ的那个核：**一个把"为观众解说"当成存在意义的人，
// 在没有观众的情况下，依然一场不落地把星星讲完。**
// planetarian 最狠的一点不是她被遗弃，是她**从来没有把没人来当成
// 停下来的理由**——她的价值不挂在有没有人听上，
// 但她也从来没被人告诉过"我在听"。
//
// 落到铃身上：她做了三年的建筑调查和天体记录，没有交给任何人。
// 这一段揭开的是：那些记录本一共十九册，从来没有一个读者。
//
// 【致敬二：ほしのこえ 的反用】
// ほしのこえ 是"讯号越来越慢，最后跨越八年才抵达"。
// 这一段把它调转：铃的观测数据是**发出去等着未来的人接收的**，
// 而她第一次遇到一个当场就接收了的人。
//
// 【第③段要解决的是第②段的什么】
// 第②段她决定"记录继续、结论不下"，那是她能给的最高承诺，
// 但那也意味着她永远不会说出口。
// 这一段的转折点是她发现：**她要的不是解释那个数字，
// 是要有人在她解释不出来的时候还坐在旁边。**
//
// 【双结局】
// 相爱：她把第十九册递给你，那一册的最后一页是写给你的。
// 挚友：她请你当"共同观测者"——署名两个人。对她来说，
// 把一份记录的署名让出去一半，比说喜欢难得多。
// ---------------------------------------------------------

const R = '/images/characters/rei/';

export const REI_STORY_3: StoryNode[] = [
  {
    type: 'scene',
    scene: 'rokko_night',
    bgm: 'night',
    titleZh: '星図の余白',
    titleEn: 'The Margin of the Star Chart',
    subtitleZh: '夜 · 六甲山',
    subtitleEn: 'Night · Mount Rokko',
  },
  {
    type: 'narration',
    zh: '她提前一周就把路线发给你了：几点的巴士、在哪一站换乘、末班车几点、如果错过怎么办（走下山，三小时十七分）。',
    en: 'She sent you the route a week in advance: which bus, where to change, when the last one goes, and what to do if you miss it (walk down, three hours seventeen minutes).'
  },
  {
    type: 'narration',
    zh: '她还附了一句：「今夜は月齢二。地上光を除けば、今年で最も暗い。」',
    en: 'She added one line: tonight the moon is two days old; discounting ground light, the darkest night of the year.'
  },
  {
    type: 'narration',
    zh: '山上很冷。整个神户在你们脚下，从须磨一直铺到大阪，像有人把星空翻了个面按在地上。',
    en: 'It is cold up here. The whole of Kobe lies underneath, from Suma all the way to Osaka, as though someone had turned the sky over and pressed it into the ground.'
  },
  {
    type: 'narration',
    characterImage: `${R}winter_thinking.webp`,
    zh: '她带了两个包。一个装器材。另一个很重，你帮她拎上来的，她一路都没说里面是什么。',
    en: 'She has brought two bags. One is equipment. The other is heavy - you carried it up - and she did not say what was in it the whole way.'
  },

  // ---- 那十九册 ----
  {
    type: 'narration',
    zh: '架好设备之后她打开了第二个包。里面是十九本一模一样的黑色笔记本，用橡皮筋捆成三摞。',
    en: 'With the equipment set up she opens the second bag. Nineteen identical black notebooks, in three stacks held with elastic bands.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}winter_thinking.webp`,
    jp: '中学一年の四月から。全部で十九冊ある。',
    words: [{ jp: '冊', reading: 'さつ', zh: '（书本的量词）册', en: 'volumes (counter for books)' }],
    zh: '从初一四月开始。一共十九册。',
    en: 'From April of my first year of middle school. Nineteen volumes.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '建筑调查、天体记录、潮汐、地震前后的路面裂缝走向、每年樱花开的日期。她记了六年。',
    en: 'Building surveys, astronomical logs, tides, the direction of pavement cracks before and after earthquakes, the date the cherry opened each year. Six years of it.'
  },
  {
    type: 'narration',
    zh: '你随手翻开一本，中间夹着一张便签，上面是她的字：「読者：なし」。',
    en: 'You open one at random. There is a slip inside in her handwriting: readers, none.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}winter_thinking.webp`,
    jp: '見せる相手がいなかった。それは、記録しない理由にはならない。',
    zh: '没有可以给谁看的人。但那不构成不记录的理由。',
    en: 'There was nobody to show them to. That does not constitute a reason not to record.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '她说这句话的语气跟报气温一样平。六年，十九册，零个读者，而她连一次都没有想过要停。',
    en: 'She says it as flatly as she would give a temperature. Six years, nineteen volumes, zero readers, and it never once occurred to her to stop.'
  },
  {
    type: 'narration',
    zh: '你想起她说过的那句话：没有记录的东西，会变成不存在过。',
    en: 'You think of the thing she said: a thing with no record becomes a thing that never was.'
  },
  {
    type: 'narration',
    zh: '她记了整整六年的这座城市。而没有人记录过她。',
    en: 'She has recorded this city for six solid years. Nobody has recorded her.'
  },

  // ---- 选择 1 ----
  {
    type: 'choice',
    promptZh: '她把十九本摊在防潮垫上，一本一本地按顺序摆好，像在整理什么要交出去的东西。',
    promptEn: 'She lays all nineteen out on the groundsheet in order, like someone squaring up a thing that is about to be handed over.',
    options: [
      {
        id: 'rei3_read_them',
        labelZh: '「我读。全部十九本。」',
        labelEn: '"I will read them. All nineteen."',
        jp: '読む。十九冊、全部。',
        hintZh: '不是安慰。是接收',
        hintEn: 'Not comfort. Reception.',
        effects: [
          { stat: 'knowledge', amount: 3, reasonZh: '你答应了读完六年的观测记录', reasonEn: 'You agreed to read six years of observations' },
          { stat: 'kindness', amount: 2, reasonZh: '你做的是她一直缺的那件事：当读者', reasonEn: 'You did the thing she had always lacked: you became the reader' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 6, affection: 18, reasonZh: '十九册第一次有了收件人', reasonEn: 'Nineteen volumes acquired an addressee' }],
        setFlags: ['rei_story_will_read'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}winter_shy.webp`,
            zh: '她抬起头，很快。这是你见过她动作最快的一次。',
            en: 'Her head comes up fast. It is the fastest you have ever seen her move.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_shy.webp`,
            jp: '……全部で、たぶん四千ページある。',
            zh: '……全部加起来，大概四千页。',
            en: '...That is somewhere around four thousand pages.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '你说：那我一天读十页，一年零一个月读完。',
            en: 'You say: ten pages a day, and it takes a year and a month.'
          },
          {
            type: 'narration',
            zh: '她低头算了一下。她真的算了。算完她说「三百九十九日」，然后不说话了。',
            en: 'She actually does the arithmetic. Three hundred and ninety-nine days, she says, and then she says nothing.'
          },
          {
            type: 'narration',
            characterImage: `${R}winter_shy.webp`,
            zh: '你后来才明白她算的不是页数。她算的是"这个人打算在这儿待多久"。',
            en: 'You understand later that she was not calculating pages. She was calculating how long this person intends to be around.'
          }
        ]
      },
      {
        id: 'rei3_who_for',
        labelZh: '「你记这些，是为了谁？」',
        labelEn: '"Who are you recording these for?"',
        jp: 'これ、誰のために書いてるの。',
        hintZh: '六年，零个读者。这个问题她一定回答过自己',
        hintEn: 'Six years, no readers. She has certainly answered this for herself already.',
        effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你问到了这十九本存在的理由', reasonEn: 'You asked what the nineteen volumes are for' }],
        relations: [{ char: CharacterId.REI, familiarity: 8, affection: 12, reasonZh: '她把那个答案说出了口', reasonEn: 'She said that answer out loud' }],
        then: [
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_thinking.webp`,
            jp: '……いつか、必要になる人のため。',
            zh: '……为了将来某个会需要它的人。',
            en: '...For whoever eventually needs it.',
            color: 'bg-indigo-500'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_thinking.webp`,
            jp: 'その人が、私が死んだ後の人でも、構わない。記録はそういうもの。',
            zh: '就算那个人是我死了以后的人，也没关系。记录就是这种东西。',
            en: 'It does not matter if that person comes after I am dead. That is what a record is.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她十七岁。她已经把自己的观测安排到了自己不在的那一段时间。',
            en: 'She is seventeen. She has already scheduled her observations into the period after she is gone.'
          }
        ]
      },
      {
        id: 'rei3_record_her',
        labelZh: '掏出外公的手账，翻到空白页，开始写她',
        labelEn: "Take out your grandfather's journal, turn to a blank page, and start recording her",
        jp: '……こっちも、記録することにする。',
        hintZh: '她记了这座城市六年。没有人记过她',
        hintEn: 'She has recorded this city for six years. Nobody has recorded her.',
        requires: { stat: 'kindness', min: 6 },
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你开始记录一个只记录别人的人', reasonEn: 'You began recording the person who only ever records' },
          { stat: 'charm', amount: 1, reasonZh: '你用她的方式做了一件她没想到的事', reasonEn: 'You used her method to do something she had not anticipated' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 4, affection: 20, reasonZh: '她第一次成为被观测的那一方', reasonEn: 'For the first time she was the one being observed' }],
        setFlags: ['rei_story_recorded_her'],
        then: [
          {
            type: 'narration',
            zh: '你翻开外公那本手账最后几页的空白，开始写。日期、地点、气温、月龄。',
            en: 'You open the blank pages at the back of your grandfather’s journal and start writing. Date, place, temperature, age of the moon.'
          },
          {
            type: 'narration',
            zh: '然后你写：「観測対象：伊吹 鈴。第八段の階段で、いつも半歩遅くなる。」',
            en: 'Then you write: subject, Ibuki Rei. Slows by half a pace at the eighth step, every time.'
          },
          {
            type: 'narration',
            characterImage: `${R}winter_shy.webp`,
            zh: '她凑过来看，看完之后整个人僵住了。',
            en: 'She leans over to look, and having looked, goes completely still.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_shy.webp`,
            jp: '……それ、私も気づいてなかった。',
            zh: '……那件事，我自己都没注意到。',
            en: '...I had not noticed that about myself.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '你说：因为记录的人不会记录自己。',
            en: 'You say: because the one keeping the record does not appear in it.'
          },
          {
            type: 'narration',
            zh: '她很久没有说话。你继续写。写到第三条的时候，她把手放在那一页上，压住了。',
            en: 'She is quiet for a long while. You keep writing. At the third entry she puts her hand flat on the page and holds it down.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_shy.webp`,
            jp: '……待って。心拍が、また。',
            zh: '……等一下。心跳，又。',
            en: '...Wait. The pulse. Again.',
            color: 'bg-indigo-500'
          }
        ]
      }
    ]
  },

  // ---- 中段：她讲星星 ----
  {
    type: 'narration',
    zh: '云开了。她把望远镜转过去，然后开始讲——不是对你讲，是那种讲了很多年、对着空气也讲的讲法。',
    en: 'The cloud opens. She swings the telescope round and begins to talk - not to you, but in the manner of someone who has been doing this for years and would do it to an empty roof.'
  },
  {
    type: 'narration',
    characterImage: `${R}winter_thinking.webp`,
    zh: '春季大三角、狮子座的镰刀、北斗七星第二颗其实是双星、那颗星的光走了八十三年才到这儿。',
    en: 'The spring triangle, the sickle of Leo, the fact that the second star of the Plough is a double, that the light from it has been travelling eighty-three years to get here.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}winter_thinking.webp`,
    jp: '八十三年前に出た光を、今、私たちが受け取っている。',
    words: [{ jp: '受け取る', reading: 'うけとる', zh: '接收、收下', en: 'to receive' }],
    zh: '八十三年前发出的光，现在，被我们接收到了。',
    en: 'Light that left eighty-three years ago is being received by us, now.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '她讲到这里停了一下。你没有接话。她自己接了下去，声音低了很多。',
    en: 'She stops there. You do not fill it. She carries on herself, much lower.'
  },
  {
    type: 'speech',
    speakerZh: '铃', speakerEn: 'Rei',
    characterImage: `${R}winter_thinking.webp`,
    jp: '……発信した側は、受け取られたことを知らない。それが、普通。',
    zh: '……发出的那一方，不会知道它被接收了。这是常态。',
    en: '...The transmitting end never learns that it was received. That is the normal case.',
    color: 'bg-indigo-500'
  },
  {
    type: 'narration',
    zh: '她讲的是星星。她讲的不是星星。',
    en: 'She is talking about stars. She is not talking about stars.'
  },

  // ---- 关键选择 ----
  {
    type: 'choice',
    promptZh: '她还在看目镜。她已经很久没有调焦了。',
    promptEn: 'She is still at the eyepiece. She has not adjusted the focus for some time.',
    options: [
      {
        id: 'rei3_received',
        labelZh: '「我收到了。八十三年那句，还有这六年。」',
        labelEn: '"It was received. That line about eighty-three years, and these six years."',
        jp: '受け取ったよ。ちゃんと、こっちに届いてる。',
        words: [{ jp: '届く', reading: 'とどく', zh: '送达、抵达', en: 'to arrive / to reach' }],
        hintZh: '她说发信的那一方不会知道。那就告诉她',
        hintEn: 'She said the transmitting end never learns. So tell it.',
        effects: [
          { stat: 'kindness', amount: 3, reasonZh: '你给了一个六年没有回音的信号一个回执', reasonEn: 'You sent a receipt back down six years of silence' },
          { stat: 'guts', amount: 1, reasonZh: '你回答了一句她没敢当成问题问出来的话', reasonEn: 'You answered something she had not dared to phrase as a question' }
        ],
        relations: [{ char: CharacterId.REI, familiarity: 5, affection: 20, reasonZh: '发信的那一方第一次知道了它被收到', reasonEn: 'The transmitting end learned, for once, that it had been received' }],
        setFlags: ['rei_story_received'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}winter_shy.webp`,
            zh: '她从目镜上抬起头。夜里看不清她的表情，但你听见她吸了一口气。',
            en: 'She lifts her head from the eyepiece. You cannot see her face in the dark, but you hear her take a breath.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_shy.webp`,
            jp: '……そういうことを、言う人だとは、',
            zh: '……我没有想到，你是会说这种话的人，',
            en: '...I had not predicted that you would be a person who says that sort of thing,',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她没有把句子说完。她的句子从来不会说不完。',
            en: 'She does not finish the sentence. Her sentences always finish.'
          }
        ]
      },
      {
        id: 'rei3_stay_anyway',
        labelZh: '「就算解释不出来，我也会坐在这儿。」',
        labelEn: '"Even if it never explains, I will still be sitting here."',
        jp: '説明つかんでも、こっちはここにおるから。',
        hintZh: '第②段她要的是"记录继续"。她没敢要第二样东西',
        hintEn: 'What she asked for last time was that the record continue. She did not dare ask for the second thing.',
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你承诺了一件没有结论也要继续的事', reasonEn: 'You promised to continue something that will never conclude' }],
        relations: [{ char: CharacterId.REI, familiarity: 7, affection: 17, reasonZh: '她要的其实一直是这个', reasonEn: 'This was the thing she had actually wanted all along' }],
        then: [
          {
            type: 'narration',
            characterImage: `${R}winter_shy.webp`,
            zh: '她慢慢地转过来。',
            en: 'She turns round slowly.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_shy.webp`,
            jp: '……それは、観測を続けるという意味？　それとも、',
            zh: '……那是"继续观测"的意思？还是说，',
            en: '...Do you mean you will keep observing? Or do you mean,',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她停在这儿。她非常清楚"还是说"后面是什么，她只是不肯自己说出来。',
            en: 'She stops there. She knows perfectly well what comes after "or", she simply will not be the one to say it.'
          }
        ]
      },
      {
        id: 'rei3_ask_the_number',
        labelZh: '「今天那一栏，多少。」',
        labelEn: '"That column. What is it tonight."',
        jp: '今日のあの項目、いくつ。',
        hintZh: '她一定量了。她每次都量',
        hintEn: 'She has certainly taken it. She takes it every time.',
        requires: { stat: 'proficiency', min: 6 },
        effects: [{ stat: 'proficiency', amount: 2, reasonZh: '你现在知道该问她哪一栏', reasonEn: 'You now know which column to ask about' }],
        relations: [{ char: CharacterId.REI, familiarity: 3, affection: 16, reasonZh: '她被问了那个数字，而且答了', reasonEn: 'She was asked for the number, and she gave it' }],
        setFlags: ['rei_story_asked_number'],
        then: [
          {
            type: 'narration',
            characterImage: `${R}winter_shy.webp`,
            zh: '她没有翻本子。她背下来了。',
            en: 'She does not open the notebook. She has it by heart.'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_shy.webp`,
            jp: '……百六。今夜が、最高値。',
            zh: '……一百零六。今晚是最高值。',
            en: '...One hundred and six. Tonight is the maximum.',
            color: 'bg-indigo-500'
          },
          {
            type: 'narration',
            zh: '她说完之后补了一句，非常小声，像是在给自己做注释：',
            en: 'Then she adds something, very quietly, the way she would annotate a reading:'
          },
          {
            type: 'speech',
            speakerZh: '铃', speakerEn: 'Rei',
            characterImage: `${R}winter_shy.webp`,
            jp: '……気温は、今年でいちばん低いのに。',
            zh: '……明明气温是今年最低的。',
            en: '...Even though the temperature is the lowest of the year.',
            color: 'bg-indigo-500'
          }
        ]
      }
    ]
  },

  {
    type: 'narration',
    zh: '风停了。山下那片灯一动不动。',
    en: 'The wind drops. The field of lights below does not move.'
  },
  {
    type: 'narration',
    characterImage: `${R}winter_shy.webp`,
    zh: '她从那十九本里抽出最上面那一本——第十九册，最新的那本。',
    en: 'She takes the top one off the stack: volume nineteen, the current one.'
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
        zh: '她把第十九册递过来，翻到最后一页。',
        en: 'She holds volume nineteen out, opened to the last page.'
      },
      {
        type: 'narration',
        zh: '那一页不是数据。那一页是一段字，写得很小很密，和她所有的字一样。',
        en: 'That page is not data. It is a paragraph, small and dense, in the same hand as everything else.'
      },
      {
        type: 'narration',
        zh: '开头是：「本記録の読者へ。」',
        en: 'It begins: to the reader of this record.'
      },
      {
        type: 'speech',
        speakerZh: '铃', speakerEn: 'Rei',
        characterImage: `${R}winter_shy.webp`,
        jp: '……三週間前に書いた。渡す相手がいるとは、思ってなかった。',
        zh: '……三周前写的。当时没想到会有可以交给的人。',
        en: '...I wrote it three weeks ago. I did not expect there to be anyone to give it to.',
        color: 'bg-indigo-500'
      },
      {
        type: 'narration',
        zh: '你读了。那一段没有一个形容词——她不用形容词。全篇都是观测记录的写法：',
        en: 'You read it. There is not one adjective in it; she does not use adjectives. The whole thing is written as an observation log:'
      },
      {
        type: 'narration',
        zh: '「第七回以降、心拍数の異常が継続。原因は特定済み。修正は行わない。」',
        en: '"From session seven onward, anomalous pulse persists. Cause identified. No correction will be applied."'
      },
      {
        type: 'narration',
        zh: '「本項目は、対象者が同席する限り継続して記録する。」',
        en: '"This entry will continue to be recorded for as long as the subject is present."'
      },
      {
        type: 'narration',
        zh: '最后一行的字迹比前面重，笔尖压得很深：「対象者が、そばにいてくれることを希望する。」',
        en: 'The last line is pressed harder into the paper than the rest: "It is hoped that the subject will remain nearby."'
      },
      {
        type: 'narration',
        characterImage: `${R}winter_shy.webp`,
        zh: '这是她的告白。她用了六年的格式，写了一句只对你有意义的话。',
        en: 'This is her confession. Six years of format, and one sentence that means something to exactly one person.'
      },
      {
        type: 'cg',
        cgId: 'cg_rei',
        imageUrl: '/images/cg/cg_rei.webp',
        titleZh: '星海下的轻语', titleEn: 'A Whisper Under the Star-Sea',
        captionZh: '她把眼镜摘了下来，折好，放在记录本上。然后她抬起头，第一次直接看着你的眼睛。',
        captionEn: 'She takes her glasses off, folds them, and sets them on the notebook. Then she looks up, and for the first time looks directly into your eyes.'
      },
      {
        type: 'speech',
        speakerZh: '铃', speakerEn: 'Rei',
        characterImage: `${R}winter_shy.webp`,
        jp: '……返事は、記録に残していい？',
        words: [{ jp: '返事', reading: 'へんじ', zh: '回答、答复', en: 'a reply' }],
        zh: '……你的回答，可以记进记录里吗？',
        en: '...May I enter your reply into the record?',
        color: 'bg-indigo-500'
      },
      {
        type: 'narration',
        zh: '你说可以。她拿起笔，然后手抖得写不了字——这是六年里第一次。',
        en: 'You say she may. She picks up the pen, and her hand shakes too much to write. It is the first time in six years.'
      },
      {
        type: 'narration',
        zh: '你把笔接过来，替她写了那一行。她在旁边看着，一个字都没有纠正。',
        en: 'You take the pen and write the line for her. She watches, and does not correct a single character.'
      },
      {
        type: 'effect',
        setFlags: ['rei_ending_love', 'rei_story_3_done'],
        effects: [
          { stat: 'knowledge', amount: 3, reasonZh: '你成了十九册记录唯一的读者', reasonEn: 'You became the sole reader of nineteen volumes' },
          { stat: 'charm', amount: 2, reasonZh: '一个从不失手的人在你面前手抖了', reasonEn: 'Someone whose hands never shake shook, in front of you' }
        ],
        relations: [
          { char: CharacterId.REI, familiarity: 12, affection: 24, reasonZh: '她把那一页写好了三周，等一个收件人', reasonEn: 'She had that page written for three weeks, waiting for an addressee' }
        ]
      }
    ],

    // ============ 挚友 ============
    otherwise: [
      {
        type: 'narration',
        zh: '她翻开第十九册的扉页，那里有一栏她一直空着没填：「観測者」。',
        en: 'She opens volume nineteen to the flyleaf, where there is a field she has always left blank: observer.'
      },
      {
        type: 'narration',
        zh: '前十八册的这一栏都写着她一个人的名字。',
        en: 'In the previous eighteen, that field has her name in it and nothing else.'
      },
      {
        type: 'speech',
        speakerZh: '铃', speakerEn: 'Rei',
        characterImage: `${R}winter_thinking.webp`,
        jp: '提案がある。第十九冊から、観測者を二名にしたい。',
        words: [{ jp: '提案', reading: 'ていあん', zh: '提议', en: 'a proposal' }],
        zh: '我有一个提议。从第十九册开始，观测者写两个人。',
        en: 'I have a proposal. From volume nineteen, I would like the observer field to carry two names.',
        color: 'bg-indigo-500'
      },
      {
        type: 'narration',
        zh: '你问为什么。',
        en: 'You ask why.'
      },
      {
        type: 'speech',
        speakerZh: '铃', speakerEn: 'Rei',
        characterImage: `${R}winter_thinking.webp`,
        jp: '記録は、書いた人のものじゃない。立ち会った人のもの。',
        zh: '记录不属于写它的人。属于在场的人。',
        en: 'A record does not belong to whoever wrote it. It belongs to whoever was present.',
        color: 'bg-indigo-500'
      },
      {
        type: 'narration',
        zh: '你签了名。她看着那两个名字并排在一起，看了很久。',
        en: 'You sign. She looks at the two names side by side for a long time.'
      },
      {
        type: 'speech',
        speakerZh: '铃', speakerEn: 'Rei',
        characterImage: `${R}winter_shy.webp`,
        jp: '……六年で、初めて余白が埋まった。',
        words: [{ jp: '余白', reading: 'よはく', zh: '空白处、留白', en: 'blank space / margin' }],
        zh: '……六年了，这块留白第一次被填上。',
        en: '...Six years, and that margin is filled in for the first time.',
        color: 'bg-indigo-500'
      },
      {
        type: 'narration',
        zh: '她没有说喜欢。她把一份记了六年的东西的署名让出去了一半。对她来说，这是更大的事。',
        en: 'She does not say that she likes you. She has given away half the authorship of six years of work. For her, that is the larger act.'
      },
      {
        type: 'narration',
        characterImage: `${R}winter_thinking.webp`,
        zh: '下山的巴士摇摇晃晃，她抱着沉甸甸装满十九本书的帆布包沉沉睡去。到站刹车的瞬间，她却宛如生物钟鸣响般准时睁开双眼，分毫不差。',
        en: 'The bus sways gently down the mountain road as she falls into deep sleep hugging the heavy canvas bag of nineteen books. The instant the brakes hiss at the stop, she wakes with clockwork precision.'
      },
      {
        type: 'speech',
        speakerZh: '铃', speakerEn: 'Rei',
        characterImage: `${R}winter_thinking.webp`,
        jp: '次は新月の週。同じ時刻。……観測者、二名。',
        zh: '下次是新月那一周。同一时刻。……观测者，两名。',
        en: 'Next is the new-moon week. Same hour. ...Observers: two.',
        color: 'bg-indigo-500'
      },
      {
        type: 'narration',
        zh: '她把"两名"这两个字念得比别的字重。这是她的语气，你现在听得出来了。',
        en: 'She says "two" with more weight than the rest of it. That is her tone of voice. You can hear it now.'
      },
      {
        type: 'effect',
        setFlags: ['rei_ending_friend', 'rei_story_3_done'],
        effects: [
          { stat: 'knowledge', amount: 3, reasonZh: '你的名字进了一份六年的观测记录', reasonEn: 'Your name went into six years of observations' }
        ],
        relations: [
          { char: CharacterId.REI, familiarity: 24, affection: 8, reasonZh: '她把署名让出去了一半', reasonEn: 'She gave away half the authorship' }
        ]
      }
    ]
  }
];
