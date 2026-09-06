import { StoryNode, StoryEffect, StoryFlags, GameCalendar, CharacterId } from '../types';
import { Npc } from './npcData';
import { LUNCH_SCHEDULE, weekdayIndex, isWeekend } from './scheduleData';
import { MAP_LOCATIONS } from '../story/mapLocations';
import { CHARACTERS } from '../constants';

// ---------------------------------------------------------
// 💬 跟 NPC 说话
//
// 【为什么不走 AI】
// 女主角那八个人用 AI 是因为她们要能接住任何话题、要记得你说过什么。
// 这二十个人不需要——他们要的恰恰是**每次都一样**。
// 你第三次去钓场，源老爹还是那句"今天东南风"，
// 这种不变本身就是"这地方是你的地盘"的证据。
// 而且写死的对话可以给东西：情报、钱、属性、一句只有他知道的事。
//
// 【说话要有用，否则没人会点第二次】
// 每个人至少有一条**能换到东西**的话题：
//   葵告诉你今天谁在哪儿（直接接进午休那套作息系统）
//   山田阿姨告诉你明天哪样容易卖光
//   源老爹告诉你今天鱼口好不好
//   高桥告诉你今天哪样打折
// 剩下的话题给的是这个人本身——那也是一种东西。
//
// 【once 的用法】
// 只讲一次的是"他这个人的来历"，可以反复问的是"今天怎么样"。
// 分不清这两种的话，第二次去就只剩重复。
// ---------------------------------------------------------

export interface NpcTopic {
  id: string;
  labelZh: string; labelEn: string;
  // 主角开口那句。和剧情选项一样，说出口的才写日语。
  jp?: string;
  // 只能问一次的（他的来历、他的秘密）
  once?: boolean;
  requiresFlags?: string[];
  lines: { jp?: string; zh: string; en: string }[];
  effects?: StoryEffect[];
  setFlags?: string[];
  // 内容要按当天算出来的：'lunch_tip' = 今天谁在哪儿
  dynamic?: 'lunch_tip' | 'sellout_tip' | 'fish_tip' | 'sale_tip';
}

export const NPC_TOPICS: Record<string, NpcTopic[]> = {
  // ---------------- 学校 ----------------
  yamada: [
    {
      id: 'yamada_tomorrow', labelZh: '问她明天有什么', labelEn: 'Ask what is on tomorrow',
      jp: '明日、なにが出ますか。', dynamic: 'sellout_tip',
      lines: []
    },
    {
      id: 'yamada_years', labelZh: '问她在这儿做了多久', labelEn: 'Ask how long she has been here',
      jp: 'ここ、長いんですか。', once: true,
      lines: [
        { jp: '三十二年', zh: '三十二年。', en: 'Thirty-two years.' },
        { zh: '她说这三个字的时候手上没停，一勺一勺往下扣饭，每一勺分量一模一样。',
          en: 'She says it without her hands stopping, turning out one portion after another, every one identical.' },
        { jp: 'あんたのお祖父さんくらいの子も、ここで食べてったで',
          zh: '跟你外公差不多年纪的孩子，也在这儿吃过饭哦。',
          en: 'Boys about your grandfather’s age ate here too, you know.' },
        { zh: '你愣住了。她没有解释这句话是随口说的还是别的什么，因为后面已经排了四个人。',
          en: 'You freeze. She does not clarify whether that was a figure of speech or something else, because there are four people behind you.' }
      ],
      effects: [{ stat: 'knowledge', amount: 2, reasonZh: '这个食堂比你外公来神户那年还早', reasonEn: 'This canteen predates the year your grandfather came to Kobe' }],
      setFlags: ['npc_yamada_years']
    }
  ],
  aoi: [
    {
      id: 'aoi_where', labelZh: '打听今天谁在哪儿', labelEn: 'Ask her where everyone is today',
      jp: '今日って、誰かどこにおるか知ってる？', dynamic: 'lunch_tip',
      lines: []
    },
    {
      id: 'aoi_you', labelZh: '问她班上怎么看你', labelEn: 'Ask what the class makes of you',
      jp: 'クラスの人、俺のことどう思ってんの。', once: true,
      lines: [
        { zh: '她想都没想就答了，而且一条一条列。', en: 'She answers without pausing, and enumerates.' },
        { jp: '一、意外と日本語できる。二、めっちゃよく歩いてる。三、たぶん明日香と何かある',
          zh: '一、日语意外地不错。二、走路走得特别多。三、大概跟明日香有点什么。',
          en: 'One, better Japanese than expected. Two, walks an enormous amount. Three, probably something going on with Asuka.' },
        { zh: '你想反驳第三条。你发现自己不知道该从哪儿反驳。',
          en: 'You want to argue with the third. You find you do not know where to begin.' }
      ],
      effects: [{ stat: 'charm', amount: 1, reasonZh: '你知道了别人眼里的自己', reasonEn: 'You learned what you look like from outside' }]
    }
  ],
  shiori: [
    {
      id: 'shiori_rec', labelZh: '请她推荐一本能读的', labelEn: 'Ask her for something you could actually read',
      jp: '今の俺でも読める本、ありますか。',
      lines: [
        { zh: '她没有说话，转身从书架抽了一本，放在你面前。', en: 'She says nothing, turns, takes one off the shelf and puts it in front of you.' },
        { zh: '是一本给小学生的神户地方史。全部有注音。', en: 'It is a local history of Kobe for primary schoolers. Every character has its reading.' },
        { jp: '恥ずかしくないよ。私も最初これだった',
          zh: '不用不好意思。我最开始也是这本。',
          en: 'There is nothing to be embarrassed about. This was my first one too.' }
      ],
      effects: [{ stat: 'knowledge', amount: 2, reasonZh: '一本全部带注音的书', reasonEn: 'A book with every reading printed' }]
    }
  ],
  kenta: [
    {
      id: 'kenta_shoot', labelZh: '陪他投两个球', labelEn: 'Shoot a couple with him',
      jp: '一本だけ、付き合うわ。',
      lines: [
        { zh: '他把球扔过来，扔得比你预期的重。你接住了，手有点麻。', en: 'He throws the ball harder than you expected. You catch it. Your hands sting.' },
        { jp: 'おっ、ちゃんと捕れるやん', zh: '哦，接得住嘛。', en: 'Hey, you can actually catch.' },
        { zh: '你们在球场边一来一回地投篮传球，汗水浸湿了衣领。自始至终，他一次都没有追问过你到底是从哪儿来的。', en: 'You pass and shoot back and forth on the edge of the court, sweat dampening your collar. Through it all, he never once asks where you came from.' }
      ],
      effects: [{ stat: 'guts', amount: 1, reasonZh: '有人没把你当外国人', reasonEn: 'Somebody did not treat you as a foreigner' }]
    }
  ],
  hiroki: [
    {
      id: 'hiroki_math', labelZh: '问他那道题', labelEn: 'Ask him about that question',
      jp: 'ここ、どうやって解くん。',
      lines: [
        { zh: '他语速极快地推导了一通，讲完你依然一脸茫然。', en: 'He rattles through the derivation at high speed; when he finishes, you are still utterly lost.' },
        { zh: '他看了你一眼，把纸转过来，重新讲了一遍——这次没有用任何一个你不认识的词。',
          en: 'He looks at you, turns the paper round, and explains again, this time without one word you do not know.' },
        { jp: '……日本語のほう、難しかったんやんな', zh: '……难的是日语那一半吧。', en: '...It was the Japanese half that was hard, was it not.' }
      ],
      effects: [
        { stat: 'knowledge', amount: 1, reasonZh: '你听懂了第二遍', reasonEn: 'You understood the second explanation' },
        { stat: 'proficiency', amount: 1, reasonZh: '有人替你把词换简单了', reasonEn: 'Somebody swapped their words out for easier ones' }
      ]
    }
  ],
  ellen: [
    {
      id: 'ellen_home', labelZh: '问她想不想家', labelEn: 'Ask if she misses home',
      jp: '先生は、ホームシックとかないんですか。', once: true,
      lines: [
        { zh: '她想了一下，然后用英语说了一句，说完自己笑了。',
          en: 'She thinks, says something in English, and then laughs at herself.' },
        { jp: '……あかん、日本語で言わな意味ないわ', zh: '……不行，不用日语说就没意义了。', en: '...No good. It does not count unless I say it in Japanese.' },
        { jp: '八年目。まだたまにある。でも「たまに」になるまで、四年かかった',
          zh: '第八年了。偶尔还是会。不过变成"偶尔"，花了四年。',
          en: 'Eighth year. Still, sometimes. But it took four years for it to become "sometimes".' }
      ],
      effects: [{ stat: 'kindness', amount: 2, reasonZh: '有人告诉了你一个具体的年数', reasonEn: 'Somebody gave you an actual number of years' }],
      setFlags: ['npc_ellen_four_years']
    }
  ],
  fujiwara: [
    {
      id: 'fujiwara_form', labelZh: '问她表格哪一栏最容易填错', labelEn: 'Ask which box people get wrong',
      jp: 'この書類、どこ間違えやすいですか。',
      lines: [
        { zh: '她连看都没看就指了一栏：住所的第二行。', en: 'Without looking she points at one box: the second line of the address.' },
        { jp: '町名の後、番地の前。ここ、みんな一回目は間違える',
          zh: '町名之后、番地之前。这儿，所有人第一次都会填错。',
          en: 'After the district name, before the number. Everyone gets this one wrong the first time.' },
        { zh: '你低头看自己那张。你也填错了。', en: 'You look down at yours. You have also got it wrong.' }
      ],
      effects: [{ stat: 'knowledge', amount: 1, reasonZh: '你学会了写自己的地址', reasonEn: 'You learned to write your own address' }]
    }
  ],
  saeki: [
    {
      id: 'saeki_sleep', labelZh: '躺一会儿', labelEn: 'Lie down for a bit',
      jp: '……ちょっとだけ、いいですか。',
      lines: [
        { zh: '她指了指最里面那张床，然后继续写她的记录。', en: 'She points at the bed at the back and goes back to her notes.' },
        { zh: '你在安静的医务室里沉沉小憩了片刻。醒来时床头柜上多了一杯温水，保健老师已经悄悄离开了。',
          en: 'You nap quietly in the tranquil infirmary. When you wake, a glass of warm water sits on the side table, and the nurse has stepped out.' }
      ],
      effects: [{ stat: 'kindness', amount: 1, reasonZh: '你在医务室小憩片刻，醒来时有一杯温水', reasonEn: 'A restful nap, and a glass of warm water when you woke' }]
    }
  ],
  sakamoto: [
    {
      id: 'sakamoto_run', labelZh: '问他跑多少合适', labelEn: 'Ask how much running is enough',
      jp: 'どんくらい走ったらええですか。',
      lines: [
        { jp: '毎日ちょっと', zh: '每天一点。', en: 'A little, every day.' },
        { zh: '你说这个回答太笼统了。他说不笼统，然后又说了一遍：每天，一点。',
          en: 'You say that is vague. He says it is not vague, and repeats it: every day, a little.' }
      ],
      effects: [{ stat: 'guts', amount: 1, reasonZh: '你得到了一条你其实听得懂的建议', reasonEn: 'You were given advice you actually understood' }]
    }
  ],
  kanzaki: [
    {
      id: 'kanzaki_burn', labelZh: '问刚才烧的是什么', labelEn: 'Ask what that was burning',
      jp: 'さっきの、なんですか。',
      lines: [
        { zh: '神崎老师顿时两眼放光，兴致勃勃地手舞足蹈解说了半天。你连蒙带猜听懂了大概四个词，其中两个是“温度”和“危险”。',
          en: 'Kanzaki’s eyes light up as he launches into an animated explanation. Between guesswork and context, you manage to catch about four words—two being "temperature" and "dangerous".' },
        { zh: '讲完他补了一句：「今のは覚えんでええ」。', en: 'At the end he adds that you do not need to remember any of that.' }
      ],
      effects: [{ stat: 'knowledge', amount: 1, reasonZh: '面对物理老师的狂热解说，你硬是撑着听完了', reasonEn: 'You held your ground through a feverish physics monologue' }]
    }
  ],

  // ---------------- 街上 ----------------
  gensan: [
    {
      id: 'gensan_today', labelZh: '问他今天鱼口怎么样', labelEn: 'Ask how they are biting',
      jp: '今日、どうですか。', dynamic: 'fish_tip',
      lines: []
    },
    {
      id: 'gensan_since', labelZh: '问他在这儿钓了多久', labelEn: 'Ask how long he has fished here',
      jp: 'ここ、長いんですか。', once: true,
      lines: [
        { zh: '他没有回答。过了大概二十秒，他抬手指了指堤防最外面那块石头。',
          en: 'He does not answer. After twenty seconds or so he lifts a hand and points at the outermost stone of the pier.' },
        { jp: 'あれ、わしが積むの手伝うたやつや', zh: '那块，是我帮着砌上去的。', en: 'That one. I helped put that one there.' },
        { zh: '那块石头看上去比你老得多。', en: 'The stone looks considerably older than you.' }
      ],
      effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你知道了这条堤防是谁砌的', reasonEn: 'You learned who built this pier' }]
    }
  ],
  takahashi: [
    {
      id: 'takahashi_sale', labelZh: '问他今天什么划算', labelEn: 'Ask what is worth buying today',
      jp: '今日、なんかお得なやつあります？', dynamic: 'sale_tip',
      lines: []
    }
  ],
  munakata: [
    {
      id: 'munakata_why', labelZh: '问他为什么不放糖', labelEn: 'Ask why no sugar',
      jp: 'なんで砂糖はあかんのですか。', once: true,
      lines: [
        { zh: '他擦杯子，没抬头。', en: 'He polishes a glass without looking up.' },
        { jp: 'うちのは、苦いのが仕事や', zh: '我这儿的，苦是它的工作。', en: 'Here, the bitterness is the job.' },
        { zh: '你又问那为什么柜台上摆着糖罐。他停了一下，说那是给不想听他讲道理的客人的。',
          en: 'You ask why there is a sugar bowl on the counter, then. He pauses and says it is for customers who would rather not hear him explain.' }
      ],
      effects: [{ stat: 'charm', amount: 1, reasonZh: '你成了会听他讲道理的那一种客人', reasonEn: 'You became the kind of customer who hears him out' }]
    }
  ],
  matsumoto: [
    {
      id: 'matsumoto_order', labelZh: '问他该怎么点', labelEn: 'Ask how you are supposed to order',
      jp: 'どう頼んだらええんですか。', once: true,
      lines: [
        { zh: '他在纸上写了三个词，推给你：ヤサイ、アブラ、カラメ。', en: 'He writes three words on a slip and pushes it over: vegetables, fat, sauce.' },
        { jp: '多い少ないは、これに「マシ」つけたらええ', zh: '要多要少，在这后面加个「マシ」就行。', en: 'For more of any of them, put "mashi" after it.' },
        { zh: '你问全都要多会怎么样。他看了你一眼，说：「やめとき」。',
          en: 'You ask what happens if you ask for more of all three. He looks at you and advises against it.' }
      ],
      effects: [{ stat: 'knowledge', amount: 2, reasonZh: '你学会了这家店的暗号', reasonEn: 'You learned this shop’s code' }],
      setFlags: ['npc_matsumoto_code']
    }
  ],
  mina: [
    {
      id: 'mina_tray', labelZh: '问她那个端盘子的手法', labelEn: 'Ask about the way she carries the tray',
      jp: 'あれ、どうやってるんですか。',
      lines: [
        { zh: '她笑了一下，把托盘递给你，上面放了一个空杯子。', en: 'She smiles, hands you the tray with one empty cup on it.' },
        { zh: '你走了三步。杯子倒了。', en: 'You take three steps. The cup falls over.' },
        { jp: '三年かかりました', zh: '我花了三年。', en: 'It took me three years.' }
      ],
      effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你亲手确认了那件事有多难', reasonEn: 'You confirmed by hand how hard that is' }]
    }
  ],
  chen: [
    {
      id: 'chen_two', labelZh: '问他为什么喊两遍', labelEn: 'Ask why he shouts it twice',
      jp: 'なんで二回言うんですか。', once: true,
      lines: [
        { zh: '他笑了，用中文说了一句，又用日语说了一遍。', en: 'He laughs, says something in Chinese, then says it again in Japanese.' },
        { zh: '「因为有两种人在听。」', en: '"Because there are two kinds of people listening."' },
        { zh: '你站在他摊子前面，两种都听懂了一半。', en: 'Standing at his stall, you half understood both.' }
      ],
      effects: [{ stat: 'kindness', amount: 2, reasonZh: '你第一次觉得夹在两种语言中间不是坏事', reasonEn: 'For the first time, being between two languages did not feel like a deficit' }]
    }
  ],
  shizue: [
    {
      id: 'shizue_slow', labelZh: '问她「ゆっくり」是什么意思', labelEn: 'Ask what she meant by "slowly"',
      jp: '「ゆっくり」って、どういう意味ですか。', once: true,
      lines: [
        { zh: '她笑得眼睛都没了，然后指了指浴池。', en: 'She laughs until her eyes disappear, and points at the bath.' },
        { jp: '急いで入るもんちゃうやろ、あれは', zh: '那个东西，不是拿来赶时间的吧。', en: 'That is not a thing you do in a hurry, is it.' },
        { zh: '热气蒸腾的药汤彻底驱散了骨髓深处的寒气与疲惫。这是你来到神户之后，第一次如此奢侈地放空自己，什么都不去想。',
          en: 'The steaming mineral bath dissolves the chill and fatigue deep in your bones. For the first time since arriving in Kobe, you let yourself drift in absolute, unhurried peace.' }
      ],
      effects: [{ stat: 'kindness', amount: 2, reasonZh: '你彻底放空自己，享受了一场毫无杂念的热汤', reasonEn: 'You gave yourself over completely to the quiet warmth of the bath' }]
    }
  ],
  watanabe: [
    {
      id: 'watanabe_two', labelZh: '问他为什么总是差两分钟', labelEn: 'Ask why it is always two minutes',
      jp: 'いつも二分前ですね。', once: true,
      lines: [
        { zh: '他愣了一下，像是第一次意识到有人在看他。', en: 'He blinks, as though only now realising somebody has been watching.' },
        { jp: '……二分あったら、走らんで済むんですわ', zh: '……有两分钟的话，就不用跑了。', en: '...With two minutes, you do not have to run.' },
        { zh: '车来了。他没有跑。', en: 'The train comes. He does not run.' }
      ],
      effects: [{ stat: 'proficiency', amount: 1, reasonZh: '你学会了给自己留两分钟', reasonEn: 'You learned to leave yourself two minutes' }]
    }
  ],
  riko: [
    {
      id: 'riko_buy', labelZh: '问她为什么从来不买', labelEn: 'Ask why she never buys anything',
      jp: '買わへんのですか。', once: true,
      lines: [
        { zh: '她被问得愣了一下，然后老实答了。', en: 'The question stops her, and then she answers honestly.' },
        { jp: '買うたら、読まなあかんでしょ', zh: '买了的话，就得读了嘛。', en: 'If I buy it, then I have to read it.' },
        { zh: '她说完自己也觉得这个理由站不住，笑了，然后从架上抽了一本走去收银台。',
          en: 'She hears how that sounds, laughs, takes one off the shelf and goes to the till.' }
      ],
      effects: [{ stat: 'charm', amount: 1, reasonZh: '你把一个人推过了那条线', reasonEn: 'You pushed somebody over a line' }]
    }
  ],
  yuki: [
    {
      id: 'yuki_lost', labelZh: '给她指路', labelEn: 'Give her directions',
      jp: '……たぶん、こっちです。',
      lines: [
        { zh: '她把地图转过来给你看，指着一个地方问怎么走。', en: 'She turns the map round and asks how to get to a place on it.' },
        { zh: '你熟门熟路地给她指明了捷径，她连声道谢后快步离开。你站在原地回味良久——刚才脱口而出的熟稔，俨然已经是真正的本地人了。',
          en: 'You point out the shortcut with easy familiarity; she thanks you warmly and heads off. You stand there for a quiet moment—the instinctive fluency was that of an actual local.' }
      ],
      effects: [
        { stat: 'knowledge', amount: 1, reasonZh: '你给别人指了一次路', reasonEn: 'You gave somebody directions' },
        { stat: 'charm', amount: 1, reasonZh: '在那个瞬间，你像个真正的神户本地人一样自然', reasonEn: 'For that moment you were indistinguishable from a Kobe local' }
      ],
      setFlags: ['npc_yuki_directions']
    }
  ]
};

// ---------------------------------------------------------
// 当天才算得出来的那几条
// ---------------------------------------------------------
const dayHash = (cal: GameCalendar, salt: number) => {
  let h = (cal.month * 31 + cal.day) * 2654435761 + salt * 40503;
  h = (h ^ (h >>> 13)) >>> 0;
  return (h % 1000) / 1000;
};

const locName = (id: string, en: boolean) => {
  const l = MAP_LOCATIONS.find(x => x.id === id);
  return l ? (en ? l.nameEn : l.nameZh) : id;
};

// 葵的情报：今天谁在哪儿。这条把作息表接进了对话——
// 玩家可以自己记那张表，也可以来问她，两条路都通。
export type TalkLine = { jp?: string; zh: string; en: string };

const lunchTip = (cal: GameCalendar, met: CharacterId[], en: boolean): TalkLine[] => {
  if (isWeekend(cal)) {
    return [{ zh: '「今日休みやで」——她指了指窗外。对哦，今天不上学。',
      en: 'She points out of the window and says there is no school today. Right. There is not.' }];
  }
  const d = weekdayIndex(cal);
  const pool = LUNCH_SCHEDULE.filter(s => s.week[d] && met.includes(s.char));
  if (!pool.length) {
    return [{ zh: '她想了半天，最后说今天好像谁都不在固定的地方。',
      en: 'She thinks about it for a while and concludes that nobody seems to be in their usual place today.' }];
  }
  const pick = pool[Math.floor(dayHash(cal, d * 13) * pool.length)];
  const who = en ? CHARACTERS[pick.char].nameEn : CHARACTERS[pick.char].name;
  const where = locName(pick.week[d] as string, en);
  return [
    { zh: '她想都没想：「今日？」然后开始数手指。',
      en: 'She does not pause. "Today?" And starts counting on her fingers.' },
    { zh: `「${who}やったら、${where}やと思うで。だいたいいつもそう」`,
      en: `She reckons ${who} will be at ${where}. That is usually where she is.` },
    { zh: '她说的是"だいたいいつも"。也就是说，这件事是有规律的，而她早就摸清了。',
      en: 'She says "usually". Which is to say there is a pattern, and she worked it out a long time ago.' }
  ];
};

const selloutTip = (cal: GameCalendar, en: boolean): TalkLine[] => {
  const hot = dayHash(cal, 71) < 0.5;
  return [
    { zh: hot ? '「明日は唐揚げ多めに揚げるわ」——她说完补了一句：「でも、どうせ十二時五分で終わるけどな」。'
              : '「明日は日替わり、カツやで」——她说这句话的时候语气里有一点得意。',
      en: hot ? 'She says she is frying extra chicken tomorrow, and then adds that it will be gone by five past twelve regardless.'
              : 'She says tomorrow’s set is the cutlet, with a note of pride.' },
    { zh: '你记下了。这是这个学校里最实用的一条情报。',
      en: 'You make a note. It is the single most actionable piece of information in this school.' }
  ];
};

const fishTip = (cal: GameCalendar, en: boolean): TalkLine[] => {
  const good = dayHash(cal, 37) < 0.45;
  return [
    { zh: good ? '他难得开口了：「今日はええで。潮が動いとる」。'
               : '他摇了摇头：「あかん。潮が止まっとる」。',
      en: good ? 'Unusually, he speaks: it is a good day, the tide is moving.'
               : 'He shakes his head. No good. The tide has stopped.' },
    { zh: '你不知道潮动不动该怎么看。但你决定信他。',
      en: 'You have no idea how one can tell whether a tide is moving. You decide to believe him.' }
  ];
};

const saleTip = (cal: GameCalendar, en: boolean): TalkLine[] => [
  { zh: '他压低声音，像在通报军情：「今日は、種のとこ」。',
    en: 'He lowers his voice like someone passing on intelligence: today it is the seeds.' },
  { zh: '你顺着他手指的方向看过去，那一排确实贴着新的标签。',
    en: 'You follow where he is pointing. That row does have new labels on it.' }
];

// ---------------------------------------------------------
// 拼出"跟这个人说话"那一段
//
// 【一趟只碰到一个人】
// 教室这种地方常驻了四个 NPC（藤原、艾伦、葵、广树）。
// 每个都摆一个选择的话，一趟出门要连着点四轮对话——
// 那不是热闹，是排队。所以按日期挑一个：今天教室里是藤原老师，
// 明天可能是葵。跟午休那套一样，按日期定，重开也换不了。
// ---------------------------------------------------------
export interface TalkCtx {
  flags: StoryFlags;
  calendar: GameCalendar;
  met: CharacterId[];
  en: boolean;
}

export const topicSeenFlag = (topicId: string) => `npctalk_${topicId}`;

// 这条话题实际会说出来的几句。动态的先算，再接上写死的。
// 剧本引擎和食堂/店铺那两个自建界面都从这儿取，避免两边各写一遍。
export const topicLines = (t: NpcTopic, ctx: TalkCtx): TalkLine[] => [
  ...(t.dynamic === 'lunch_tip' ? lunchTip(ctx.calendar, ctx.met, ctx.en)
    : t.dynamic === 'sellout_tip' ? selloutTip(ctx.calendar, ctx.en)
    : t.dynamic === 'fish_tip' ? fishTip(ctx.calendar, ctx.en)
    : t.dynamic === 'sale_tip' ? saleTip(ctx.calendar, ctx.en)
    : []),
  ...t.lines
];

// 这个人现在还能聊的话题
export const openTopics = (npcId: string, flags: StoryFlags): NpcTopic[] =>
  (NPC_TOPICS[npcId] || []).filter(t => {
    if (t.once && flags[topicSeenFlag(t.id)]) return false;
    if (t.requiresFlags && !t.requiresFlags.every(f => flags[f])) return false;
    return true;
  });

// 这地方今天由谁在。没人有话可说就返回 null。
export const npcOnDutyAt = (npcs: Npc[], ctx: TalkCtx): Npc | null => {
  const withTopics = npcs.filter(n => {
    const all = NPC_TOPICS[n.id] || [];
    return all.some(t => {
      if (t.once && ctx.flags[topicSeenFlag(t.id)]) return false;
      if (t.requiresFlags && !t.requiresFlags.every(f => ctx.flags[f])) return false;
      return true;
    });
  });
  if (!withTopics.length) return null;
  return withTopics[Math.floor(dayHash(ctx.calendar, 53) * withTopics.length)];
};

export const npcTalkNodes = (npc: Npc, ctx: TalkCtx): StoryNode[] => {
  const all = NPC_TOPICS[npc.id] || [];
  const topics = all.filter(t => {
    if (t.once && ctx.flags[topicSeenFlag(t.id)]) return false;
    if (t.requiresFlags && !t.requiresFlags.every(f => ctx.flags[f])) return false;
    return true;
  });
  if (!topics.length) return [];

  return [
    {
      type: 'narration',
      characterImage: npc.sprite,
      zh: `${npc.nameZh}在这儿。`,
      en: `${npc.nameEn} is here.`
    },
    {
      type: 'choice',
      promptZh: ctx.en ? npc.roleEn : npc.roleZh,
      promptEn: npc.roleEn,
      options: [
        ...topics.map(t => ({
          id: t.id,
          labelZh: t.labelZh, labelEn: t.labelEn,
          jp: t.jp,
          effects: t.effects,
          setFlags: [...(t.setFlags || []), ...(t.once ? [topicSeenFlag(t.id)] : [])],
          then: [
            ...topicLines(t, ctx).map(l => ({
              type: 'narration' as const,
              characterImage: npc.sprite,
              zh: l.jp ? `「${l.jp}」\n${l.zh}` : l.zh,
              en: l.jp ? `"${l.jp}"  ${l.en}` : l.en
            }))
          ]
        })),
        {
          id: `${npc.id}_leave`,
          labelZh: '点个头就走', labelEn: 'Nod and move on',
          then: []
        }
      ]
    }
  ];
};
