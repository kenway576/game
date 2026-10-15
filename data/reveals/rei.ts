import { say, joke, act } from './kit';

// 铃：N2–N1，书面语，敬体。用观测和数据的词谈感受；被夸会"记录下来"。
export const REI_REVEALS = {
  casual: [
    say('月のペンダント、君らしい選択だと思う。', '月亮吊坠，我觉得很像你会选的。', 'The moon pendant seems like a very you choice.', '说中她的趣味', 'Name her taste',
      ['shy', '……観測対象に因んだだけです。ですが、その指摘は正確です。記録しておきます。', '……只是跟观测对象有关罢了。不过，你说得很准确。我会记下来。', '...It merely relates to what I observe. Your remark is accurate, though. I will record it.'],
      ['月のペンダント、君らしいの選択だと思う。', '「らしい」直接修饰名词，不加「の」：「君らしい選択」。', 'らしい modifies the noun directly, without の.'],
      ['月のペンダント、君らしくない選択だと思う。', '\"不像你会选的\"，意思反了。', '\"Not like you\" — reversed.']),
    joke('「感想报告：数据不足，需要继续观测。」', '"Assessment: insufficient data. Further observation required."', '用她的方式回她', 'Answer in her style',
      ['tease', '……妥当な判断です。では、本日の観測時間を延長しましょう。', '……判断很妥当。那么，延长今天的观测时间吧。', '...A reasonable judgement. Then let us extend today\'s observation period.']),
    act('等她把那一页读完再开口', 'Wait for her to finish the page before speaking', '她手指还夹着书', 'Her finger is still in the book',
      ['surprised', '……待っていてくれたのですね。区切りのいい場所まで、あと三行でした。', '……你一直在等我啊。还差三行就到段落结尾了。', '...You waited. There were three lines left to a good stopping point.'])
  ],
  lab: [
    say('白衣、すごく本格的だね。', '白大褂，很专业的样子。', 'The lab coat looks very professional.', '夸她的认真', 'Praise how serious she looks',
      ['neutral', '本格的、という評価は保護具としての機能に対してでしょうか。……それなら、肯定します。', '\"专业\"这个评价，是针对防护功能的吗？……那样的话，我承认。', 'Is \"professional\" an assessment of its protective function? ...Then I accept it.'],
      ['白衣、すごい本格的だね。', '修饰な形容词「本格的」要用副词「すごく」。', 'Before an adjective, use the adverb すごく.'],
      ['白衣、すごく本格的じゃないね。', '\"一点都不专业\"，否定掉了。', '\"Not professional at all\" — negated.']),
    joke('举起手：「实验助手报到。护目镜在哪？」', 'Raise a hand: "Lab assistant reporting. Where are the goggles?"', '主动入伙', 'Volunteer',
      ['happy', '……二番の引き出しです。助手が来ることは、想定していませんでした。歓迎します。', '……在二号抽屉。我没预料到会有助手来。欢迎。', '...Second drawer. I had not anticipated an assistant. You are welcome.']),
    act('替她把胸前口袋里快掉出来的铅笔推回去', 'Push the pencil slipping from her breast pocket back in', '细节', 'A small thing',
      ['shy', '……ありがとうございます。落下のリスクを、見落としていました。', '……谢谢。我漏看了它掉下来的风险。', '...Thank you. I had overlooked the risk of it falling.'])
  ],
  gym: [
    say('小さいポニーテール、新鮮だね。', '小小的低马尾，很新鲜。', 'The little ponytail is a nice change.', '注意到发型', 'Notice the hair',
      ['shy', '……運動時に髪が視界を遮らないための措置です。新鮮かどうかは、副次的な効果です。', '……这是为了运动时头发不挡视线的措施。新不新鲜，只是附带效果。', '...A measure to keep hair out of my vision during exercise. Novelty is a side effect.'],
      ['小さいポニーテール、新鮮のだね。', '「新鮮」是な形容词，直接接「だ」，不加「の」。', '新鮮 is a na-adjective; it takes だ directly, without の.'],
      ['小さいポニーテール、古いね。', '「古い」是\"旧、过时\"，变成了贬低。', '古い means old-fashioned — an insult.']),
    joke('「那今天，铃同学打算运动几分钟？」', '"So how many minutes of exercise is Rei planning today?"', '戳穿她', 'Call it out',
      ['pout', '……ゼロ分の予定です。ですが、あなたが走るなら、記録係は引き受けます。', '……计划是零分钟。不过，你要跑的话，我可以负责记录。', '...Zero minutes is the plan. But if you run, I will keep the records.']),
    act('把她拉到下巴的拉链往下拉一点：「不热吗？」', 'Pull her zip down a little from her chin: "Not hot?"', '有点亲近', 'A little close',
      ['surprised', '……熱効率の観点からは、正しい判断です。……少し、驚きましたが。', '……从热效率的角度看，判断是正确的。……虽然我有点吓一跳。', '...From a thermal standpoint, correct. ...Though I was a little startled.'])
  ],
  swim: [
    say('ちゃんと準備してきたんだね。', '你准备得很周全呢。', 'You came properly prepared.', '夸她准备周到，不看别处', 'Praise the preparation, look nowhere else',
      ['shy', '……日焼け止め、パーカー、水泳帽。必要なものは揃えました。……視線の配慮にも、感謝します。', '……防晒、外套、泳帽。该带的都带了。……也谢谢你注意视线。', '...Sunscreen, hoodie, cap. Everything necessary. ...Thank you for being careful where you look.'],
      ['ちゃんと準備してきたんだな。', '能懂，但「だな」像自言自语；对她说「だね」更自然。', 'Understandable, but だな sounds like musing; だね is better.'],
      ['ちゃんと準備させてきたんだね。', '使役「準備させて」变成\"让别人准备的\"，意思不对。', '準備させて means she had someone else prepare.']),
    joke('「指定泳衣也很合理，那我就合理地看一眼。」', '"The school swimsuit is very rational. So I will rationally take one look."', '用她的逻辑', 'Use her logic',
      ['angry', '……論理の誤用です。却下します。……一回、だけなら、統計的誤差の範囲ですが。', '……这是滥用逻辑。驳回。……只看一次的话，倒也在统计误差范围内。', '...Misuse of logic. Rejected. ...Once might fall within statistical error, though.']),
    act('撑开遮阳伞，给她挡出一块阴凉', 'Open the parasol and make her some shade', '体贴', 'Considerate',
      ['happy', '……紫外線指数、九。合理的な行動です。……そして、とても助かります。', '……紫外线指数九。是合理的行动。……而且，帮了我大忙。', '...UV index nine. A rational action. ...And very helpful.'])
  ],
  kimono: [
    say('大正時代の写真から出てきたみたいだ。', '像是从大正时代的照片里走出来的。', 'Like you stepped out of a Taisho-era photograph.', '用她的资料夸她', 'Praise it in her terms',
      ['happy', '……それは、最も望ましい感想です。資料を三冊読んだ甲斐がありました。', '……这是最理想的感想。读了三本资料，值了。', '...That is the most desirable response. Reading three books of research was worth it.'],
      ['大正時代の写真から出てきたらしいだ。', '「らしい」后面不能接「だ」；这里说\"像是\"用「みたいだ」。', 'らしい cannot take だ; use みたいだ.'],
      ['大正時代の写真に入ってきたみたいだ。', '「入ってきた」是\"走进照片里\"，方向反了。', '入ってきた means walked INTO the photo — reversed.']),
    joke('「那今天，我也得用大正时代的说话方式吗？」', '"So do I have to talk Taisho-style today?"', '陪她玩', 'Play along',
      ['tease', '……ごきげんよう、と言えたら、合格にしましょう。', '……能说出「ごきげんよう」的话，就算你合格。', '...If you can say \"gokigenyou\", you pass.']),
    act('接过她怀里那摞包着的书', 'Take the stack of wrapped books from her arms', '看起来很重', 'They look heavy',
      ['shy', '……ありがとうございます。重量は二・四キロでした。半分、軽くなりました。', '……谢谢。重量是二点四公斤。轻了一半。', '...Thank you. They weighed 2.4 kilograms. Half the weight is gone.'])
  ],
  maid: [
    say('「おかえりなさい」、すごく自然だった。', '「欢迎回来」，说得很自然。', 'Your \"welcome home\" sounded completely natural.', '夸她的台词', 'Praise her line',
      ['shy', '……統計的には、自然に聞こえる確率を上げる練習をしました。四十二回です。', '……从统计上，我为了提高听起来自然的概率，练习过。四十二次。', '...Statistically, I practised to raise the odds of sounding natural. Forty-two times.'],
      ['「おかえりなさい」、すごく自然のだった。', '「自然」是な形容词，过去形是「自然だった」，不加「の」。', '自然 is a na-adjective: 自然だった, without の.'],
      ['「おかえりなさい」、すごく不自然だった。', '\"很不自然\"，夸奖变批评。', '\"Very unnatural\" — praise turned criticism.']),
    joke('「讨论统计效果之前，先再说一遍让我采样。」', '"Before we discuss the statistics, say it again so I can take a sample."', '追加样本', 'Request more data',
      ['shy', '……サンプル数を増やす要求は、正当です。……おかえりなさいませ。……二回目です。', '……增加样本数的要求是正当的。……欢迎回来。……第二次。', '...A request for a larger sample is legitimate. ...Welcome home. ...That is two.']),
    act('认真地回她一句「ただいま」', 'Answer her with a proper \"tadaima\"', '陪她完成', 'Complete the exchange',
      ['happy', '……対になる発話を確認しました。会話が、成立しました。', '……确认到了配对的回应。对话成立了。', '...Paired utterance confirmed. The exchange is complete.'])
  ],
  winter: [
    say('眼鏡、曇ってるよ。', '眼镜起雾了哦。', 'Your glasses are fogging up.', '提醒她', 'Point it out',
      ['surprised', '……！　お茶の湯気でした。……視界が回復するまで、隣にいてください。', '……！是茶的热气。……在视线恢复之前，请待在我旁边。', '...! The steam from the tea. ...Please stay beside me until my vision returns.'],
      ['眼鏡、曇ってるのよ。', '「のよ」是女性化的说法，从主角嘴里说出来很怪。', 'のよ sounds feminine and odd from him.'],
      ['眼鏡、晴れてるよ。', '「晴れる」是天气放晴，眼镜不能用。', '晴れる is for weather, not glasses.']),
    joke('「四度戴耳罩合理的话，五度呢？」', '"If earmuffs are rational at four degrees, what about five?"', '跟她较真', 'Argue the point',
      ['tease', '……五度でも合理的です。閾値は七度に設定しています。根拠は、私の耳です。', '……五度也合理。阈值我定在七度。依据是我的耳朵。', '...Rational at five as well. I set the threshold at seven. The evidence is my ears.']),
    act('掏出手帕替她擦眼镜', 'Take out a handkerchief and wipe her glasses', '很近', 'Very close',
      ['shy', '……眼鏡を外すと、あなたが見えません。……近くに来れば、別ですが。', '……摘了眼镜，我就看不见你了。……如果你靠近一点，就另当别论。', '...Without my glasses I cannot see you. ...Unless you come closer.'])
  ],
  sleep: [
    say('ラベンダー色、落ち着いてていいね。', '薰衣草色，很安静，很好。', 'Lavender. Calm. It suits you.', '夸颜色', 'Praise the colour',
      ['shy', '……睡眠の質を上げる色だと、文献にありました。……あなたに言われると、少し根拠が増えます。', '……文献上说这是能提高睡眠质量的颜色。……被你这么说，依据好像又多了一点。', '...The literature says it improves sleep quality. ...Hearing it from you adds a little evidence.'],
      ['ラベンダー色、落ち着いていいね。', '「落ち着いてて」是「落ち着いていて」的口语缩约；漏掉「て」就成了\"冷静下来就好\"。', '落ち着いてて is short for 落ち着いていて; dropping て changes it to \"calm down and it is fine\".'],
      ['ラベンダー色、落ち着かなくていいね。', '\"让人心神不宁\"，意思反了。', '\"Unsettling\" — the opposite.']),
    joke('「违反规定的两个人，可以互相保密吗？」', '"Two rule-breakers. Mutual secrecy?"', '共犯', 'Partners in crime',
      ['tease', '……相互秘密保持協定を、締結します。……共犯者、ですね。', '……缔结互相保密协定。……我们是共犯了呢。', '...A mutual non-disclosure agreement is concluded. ...Accomplices, then.']),
    act('轻声问她怀里那本小书是什么', 'Quietly ask what the little book in her arms is', '不打扰她', 'Do not disturb her',
      ['happy', '……星座の神話の本です。眠れない夜は、これを読みます。……一緒に、読みますか。', '……是星座神话的书。睡不着的夜里，我会读这个。……要一起读吗？', '...A book of star myths. On sleepless nights I read it. ...Shall we read together?'])
  ],
  dress: [
    say('星図で選んだなら、大正解だと思う。', '如果是参考星图选的，那就是标准答案。', 'If you chose it from a star chart, you chose perfectly.', '顺着她的话夸', 'Praise her method',
      ['shy', '……正解、ですか。……それなら、ここから動いてもいいですね。……隣、いいですか。', '……标准答案吗。……那我可以挪开了。……旁边，可以吗？', '...Perfectly, you say. ...Then I may move now. ...May I stand beside you?'],
      ['星図で選んだなら、大正解のだと思う。', '「大正解」是名词，后面接「だ」，不加「の」。', '大正解 is a noun: 大正解だ, without の.'],
      ['星図で選んだなら、大間違いだと思う。', '「大間違い」是\"大错特错\"，她真的会一动不动。', '大間違い means a huge mistake — she will never move.']),
    joke('「你不挪开的话，我也一直站着。」', '"If you will not move, neither will I."', '比耐心', 'A patience contest',
      ['tease', '……持久戦ですか。……あなたの負けは、統計的に確定しています。ドレスは、重いですけど。', '……持久战吗。……从统计上，你必输。虽然礼服挺重的。', '...A war of attrition. ...Statistically, you lose. Though the dress is heavy.']),
    act('抬头看了看天，再看回她', 'Look up at the sky, then back at her', '像在对照星图', 'As if checking the chart',
      ['shy', '……照合、していますか。……結果は、教えてください。', '……你在对照吗。……结果请告诉我。', '...Are you comparing? ...Please tell me the result.'])
  ],
  yukata: [
    say('矛盾してても、きれいだよ。', '就算矛盾，也很好看。', 'Contradictory or not, it is beautiful.', '回答她的担心', 'Answer her worry',
      ['shy', '……矛盾を許容する判断ですね。……論理的ではありませんが、うれしいです。', '……这是接受矛盾的判断呢。……虽然不合逻辑，但我很高兴。', '...A judgement that tolerates contradiction. ...Not logical. But I am glad.'],
      ['矛盾してるでも、きれいだよ。', '\"即使……也……\"要用「ても」：「矛盾してても」。', '\"Even if\" is ても: 矛盾してても.'],
      ['矛盾してるから、きれいじゃないよ。', '\"因为矛盾所以不好看\"，跟你想说的相反。', '\"It is contradictory so not pretty\" — the opposite.']),
    joke('轻轻碰一下她腰带上的风铃', 'Tap the glass wind-chime on her sash', '让它响一下', 'Make it ring',
      ['surprised', '……鳴らしましたね。……今のは、私が歩いていない音です。記録が、乱れます。', '……你弄响了。……刚才那声不是我走路的声音。记录会乱掉的。', '...You rang it. ...That was not a footstep. It disturbs my records.']),
    act('放慢脚步，配合她风铃响的节奏', 'Slow your pace to match the chime\'s rhythm', '跟着她走', 'Walk in step',
      ['happy', '……歩調が、同期しました。……風鈴の音が、きれいに揃っています。', '……步调同步了。……风铃的声音整整齐齐的。', '...Our pace has synchronised. ...The chimes are perfectly even.'])
  ],
  autumn: [
    say('写真家みたいで、かっこいい。', '像个摄影师，很帅。', 'You look like a photographer. Cool.', '夸她的样子', 'Praise the look',
      ['happy', '……かっこいい、は想定外の評価でした。……残り三枚のうち、一枚使ってもいいです。', '……\"帅\"是我没预料到的评价。……剩下三张里，可以用掉一张。', '...\"Cool\" was an unexpected assessment. ...I may use one of my three remaining frames.'],
      ['写真家みたいで、かっこよい。', '口语里「かっこいい」不变成「かっこよい」，否定和过去才变「かっこよく」。', 'Say かっこいい; かっこよい is not used here.'],
      ['写真家みたいで、かっこ悪い。', '「かっこ悪い」是\"难看、逊\"，意思反了。', 'かっこ悪い means uncool — reversed.']),
    joke('对着她的镜头做了个鬼脸', 'Pull a face at her camera', '捣乱', 'Make mischief',
      ['tease', '……その顔は、記録に値しません。……でも、少しだけ、撮りたくなりました。', '……这张脸不值得记录。……不过，有一点点想拍了。', '...That face is not worth recording. ...But I want to take it, a little.']),
    act('安静地站好，让她慢慢选', 'Stand still and let her take her time', '等她', 'Wait for her',
      ['shy', '……動かないでいてくれるのは、被写体として理想的です。……カシャ。……一枚、使いました。', '……一动不动，是最理想的拍摄对象。……咔嚓。……用掉一张了。', '...Holding still is ideal for a subject. ...Click. ...That is one frame used.'])
  ]
};
