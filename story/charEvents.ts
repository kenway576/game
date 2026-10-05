import { MapEventDef, CharacterId, StoryNode, StoryOption, StoryWord, StatKey, StoryBgmTrack } from '../types';
import { outfitImg, Mood } from '../data/outfitContext';

// ---------------------------------------------------------
// 🗺️ 人物专属地点剧情（第二批）
//
// 第一批（afterschoolEvents）每人只有一段：拉面店的空、书店的铃、游戏厅的真希……
// 玩家认识她们之后，地图上就再也没有"去那儿会碰上她的什么事"了，
// 剩下的全是随机碰面 + AI 自由对话。
//
// 这一批每人再加三段，分散在她常去、但以前没有戏的地方：
//   ① 熟一点就能撞见（親密度门槛）
//   ② 演过①、再熟一些
//   ③ 演过②、而且好感度够——这一段开始往"喜欢"那边走
// 每段一个选择，选法不同，她给的回应和关系变化也不同。
//
// 写法规矩跟第一批一样：只引用真的发生过的事；每个人的语域不一样；
// 段子之后一定落到人身上。
// ---------------------------------------------------------

type C = CharacterId;
const SP: Record<C, { zh: string; en: string; color: string }> = {
  [CharacterId.ASUKA]:  { zh: '明日香', en: 'Asuka',  color: 'bg-red-600' },
  [CharacterId.HIKARI]: { zh: '光',     en: 'Hikari', color: 'bg-sky-500' },
  [CharacterId.REI]:    { zh: '铃',     en: 'Rei',    color: 'bg-indigo-500' },
  [CharacterId.INARI]:  { zh: '稻荷',   en: 'Inari',  color: 'bg-amber-500' },
  [CharacterId.MIYUKI]: { zh: '深雪',   en: 'Miyuki', color: 'bg-violet-400' },
  [CharacterId.SORA]:   { zh: '空',     en: 'Sora',   color: 'bg-orange-500' },
  [CharacterId.NAO]:    { zh: '奈绪',   en: 'Nao',    color: 'bg-emerald-500' },
  [CharacterId.MAKI]:   { zh: '真希',   en: 'Maki',   color: 'bg-pink-500' }
};

const scene = (s: string, titleZh: string, titleEn: string, subtitleZh?: string, subtitleEn?: string, bgm: StoryBgmTrack = 'chat'): StoryNode =>
  ({ type: 'scene', scene: s, bgm, titleZh, titleEn, ...(subtitleZh ? { subtitleZh, subtitleEn } : {}) });
const nar = (zh: string, en: string, img?: string): StoryNode => ({ type: 'narration', zh, en, ...(img !== undefined ? { characterImage: img } : {}) });
const say = (c: C, outfit: string, mood: Mood, jp: string, zh: string, en: string, words?: StoryWord[]): StoryNode =>
  ({ type: 'speech', speakerZh: SP[c].zh, speakerEn: SP[c].en, color: SP[c].color, characterImage: outfitImg(c, outfit, mood), jp, zh, en, ...(words ? { words } : {}) });
const me = (jp: string, zh: string, en: string): StoryNode =>
  ({ type: 'speech', speakerZh: '你', speakerEn: 'You', color: 'bg-yellow-500', jp, zh, en });

interface Opt {
  id: string; zh: string; en: string; jp?: string; hintZh: string; hintEn: string;
  aff: number; fam: number; stat?: StatKey; statZh?: string; statEn?: string; words?: StoryWord[]; setFlags?: string[];
  then: StoryNode[];
}
const choice = (c: C, promptZh: string, promptEn: string, opts: Opt[]): StoryNode => ({
  type: 'choice', promptZh, promptEn,
  options: opts.map<StoryOption>(o => ({
    id: o.id, labelZh: o.zh, labelEn: o.en, ...(o.jp ? { jp: o.jp } : {}), hintZh: o.hintZh, hintEn: o.hintEn,
    ...(o.words ? { words: o.words } : {}), ...(o.setFlags ? { setFlags: o.setFlags } : {}),
    relations: [{ char: c, affection: o.aff, familiarity: o.fam, reasonZh: o.zh.replace(/[「」]/g, ''), reasonEn: o.en.replace(/"/g, '') }],
    ...(o.stat ? { effects: [{ stat: o.stat, amount: 2, reasonZh: o.statZh || o.zh, reasonEn: o.statEn || o.en }] } : {}),
    then: o.then
  }))
});
const end = (c: C, aff: number, fam: number, zh: string, en: string): StoryNode =>
  ({ type: 'effect', relations: [{ char: c, affection: aff, familiarity: fam, reasonZh: zh, reasonEn: en }] });

const A = CharacterId.ASUKA, H = CharacterId.HIKARI, R = CharacterId.REI, I = CharacterId.INARI;
const M = CharacterId.MIYUKI, S = CharacterId.SORA, N = CharacterId.NAO, K = CharacterId.MAKI;

// ==========================================================
// 明日香
// ==========================================================
const EV_ASUKA_TEA: MapEventDef = {
  id: 'ev2_asuka_tea', locationId: 'school_sahoushitsu', chars: [A], priority: 8,
  titleZh: '一碗茶的规矩', titleEn: 'The Rules of One Bowl',
  requiresFlags: ['day1_met_asuka'], minFamiliarity: { [A]: 60 },
  script: [
    scene('school_sahoushitsu', '作法室', 'The Etiquette Room', '放学后 · 作法室', 'After school · The etiquette room'),
    nar('作法室的拉门开着一条缝。里面有人跪坐着，背挺得笔直，正在用一把竹刷子打茶。刷子的声音很轻，沙沙的，像有人在很远的地方扫落叶。', 'The etiquette room door is open a crack. Inside someone kneels, back perfectly straight, whisking tea with a bamboo whisk. The sound is soft and rustling, like someone sweeping leaves a long way off.'),
    say(A, '', 'surprised', '……っ。な、何見てんのよ。茶道部、今日部員が誰も来なくて。部長に頼まれたの。……代わりに。', '……！看、看什么看。茶道部今天一个部员都没来。部长拜托我的。……代班。', '...! Wh-what are you looking at? Nobody from the tea club turned up today. The president asked me to. ...To cover.'),
    nar('她看了你一眼，又看了一眼面前的那只茶碗，像是在做一个很难的决定。', 'She looks at you, then at the bowl in front of her, as if making a difficult decision.', outfitImg(A, '', 'neutral')),
    say(A, '', 'pout', '……座りなさい。せっかく点てたんだから。でも作法はちゃんとしてもらうわよ。', '……坐下吧。难得都打好了。不过礼法你得给我做对。', '...Sit down. I have made it now, after all. But you will do the etiquette properly.', [{ jp: '点てる', reading: 'たてる', zh: '点茶（沏抹茶）', en: 'to make (whisk) matcha' }]),
    nar('你学着她的样子跪坐下来。三十秒以后，你的腿开始提出抗议。', 'You kneel the way she does. Thirty seconds later your legs begin to file complaints.'),
    choice(A, '茶碗推到了你面前。上面的图案正对着你。', 'The bowl is set before you, its pattern facing you.', [
      { id: 'a_tea_turn', zh: '把茶碗转两下，让图案朝外再喝', en: 'Turn the bowl twice so the pattern faces away, then drink', hintZh: '你在书上看过', hintEn: 'You read about it once',
        aff: 6, fam: 6, stat: 'knowledge', words: [{ jp: '正面', reading: 'しょうめん', zh: '（茶碗的）正面', en: 'the front (of a tea bowl)' }],
        then: [
          nar('你把茶碗在掌心里转了两下。她的眼睛一下子睁大了。', 'You turn the bowl twice in your palm. Her eyes go wide.', outfitImg(A, '', 'surprised')),
          say(A, '', 'shy', '……知ってたの？ 正面を避けて飲むの。……ふーん。……悪くないじゃない。', '……你知道？要避开正面喝。……哼。……还不错嘛。', '...You knew? You avoid drinking from the front. ...Hm. ...Not bad.')
        ] },
      { id: 'a_tea_ask', zh: '「どうやって飲むの？」老实问她', en: '"How do I drink it?" Ask honestly', jp: 'どうやって飲むの？', hintZh: '承认自己不会', hintEn: 'Admit you do not know',
        aff: 4, fam: 8, stat: 'kindness',
        then: [
          say(A, '', 'tease', 'しょうがないわね。右手で取って、左手に乗せて、時計回りに二回。……ほら、私の手、見てなさい。', '真拿你没办法。右手拿，放在左手上，顺时针转两下。……喏，看着我的手。', 'Honestly. Pick it up with your right, rest it on your left, turn it clockwise twice. ...Here, watch my hands.'),
          nar('她把手伸过来，覆在你的手上，带着你转了两下。转完了，她才意识到自己在干什么，猛地把手缩了回去。', 'She reaches over, puts her hands on yours and turns the bowl with you. Only when it is done does she realise what she is doing and snatch her hands back.', outfitImg(A, '', 'shy'))
        ] },
      { id: 'a_tea_legs', zh: '「……あの、足が。」腿麻了', en: '"...Um. My legs." They have gone numb', jp: '……あの、足が。', hintZh: '诚实是美德', hintEn: 'Honesty is a virtue',
        aff: 3, fam: 9, stat: 'guts',
        then: [
          nar('你的腿已经完全没有知觉了。你想站起来，结果整个人歪向一边。', 'Your legs have gone completely dead. You try to stand and topple sideways.'),
          say(A, '', 'happy', 'ぷっ……あははは！ ちょ、ちょっと、茶碗！ 茶碗だけは守りなさいよ！', '噗……啊哈哈哈！等、等一下，茶碗！至少把茶碗护住啊！', 'Pff... ahahaha! W-wait, the bowl! At least save the bowl!'),
          nar('这是你第一次听见她笑得这么大声。笑完了她自己好像也吓了一跳，咳了一声，重新跪坐好。', 'It is the first time you have heard her laugh this loudly. Afterwards she seems startled herself, coughs, and kneels properly again.')
        ] }
    ]),
    say(A, '', 'neutral', '……茶道ってね、一回きりの気持ちで点てるの。「一期一会」。同じお茶は二度とない。……だから、ちゃんと味わいなさいよ。', '……茶道啊，是抱着只此一次的心情来点茶的。"一期一会"。同样的茶不会有第二次。……所以，给我好好品尝。', '...Tea is made as if it were the only time. Ichigo ichie. The same tea never happens twice. ...So taste it properly.', [{ jp: '一期一会', reading: 'いちごいちえ', zh: '一期一会（一生只此一次的相遇）', en: 'once-in-a-lifetime encounter' }]),
    nar('茶很苦，苦完之后舌根上留下一点点甜。你说好喝。她说"当たり前でしょ"，然后低头开始洗茶碗，洗得比需要的久。', 'The tea is bitter, and after the bitterness a faint sweetness lingers. You say it is good. Of course it is, she says, and bends to wash the bowl, for longer than it needs.'),
    end(A, 3, 4, '她代班点的那碗茶', 'The bowl of tea she made while covering')
  ]
};

const EV_ASUKA_BENTO: MapEventDef = {
  id: 'ev2_asuka_bento', locationId: 'classroom_morning', chars: [A], priority: 8, timeSlots: ['lunch'],
  titleZh: '做多了的便当', titleEn: 'The Lunch She Made Too Much Of',
  requiresFlags: ['ev2_asuka_tea'], minFamiliarity: { [A]: 90 }, minAffection: { [A]: 30 },
  script: [
    scene('classroom_morning', '教室', 'The Classroom', '午休 · 二年B班', 'Lunch break · Class 2-B'),
    nar('午休的教室里人走了一大半。明日香坐在座位上，面前放着两个便当盒。一个打开了，一个没打开。', 'Most of the class has gone off for lunch. Asuka sits at her desk with two lunchboxes in front of her. One open, one not.'),
    say(A, '', 'pout', '……作りすぎたの。母が。……いや、私が。どっちでもいいでしょ。……食べる？ 捨てるのもったいないし。', '……做多了。我妈做的。……不对，是我做的。是谁都无所谓吧。……吃吗？扔掉太浪费了。', '...I made too much. My mother did. ...No, I did. Does it matter? ...Want it? It would be a waste to throw away.'),
    nar('那个没打开的便当盒是蓝色的，跟她自己那个红色的明显是一对。筷子套上贴着一张很小的便利贴，写了一个字，又用修正液涂掉了。', 'The unopened box is blue, clearly a pair with her red one. On the chopstick case is a tiny sticky note with something written on it and then covered in correction fluid.', outfitImg(A, '', 'neutral')),
    choice(A, '她没看你，看着窗外，耳朵是红的。', 'She is not looking at you but out of the window, and her ears are red.', [
      { id: 'a_bento_eat', zh: '「いただきます。」坐下来吃', en: '"Itadakimasu." Sit down and eat', jp: 'いただきます。', hintZh: '不问那张便利贴', hintEn: 'Do not ask about the sticky note',
        aff: 7, fam: 4, stat: 'kindness',
        then: [
          nar('玉子烧是甜的，煎得有点焦，焦的那一面被小心地翻到了下面。炸鸡块已经凉了，可还是很好吃。', 'The rolled omelette is sweet and a little burnt, the burnt side carefully turned face down. The fried chicken has gone cold and is still good.'),
          say(A, '', 'shy', '……どう？ ……べ、別に感想とかいらないけど。……美味しいなら、美味しいって言いなさいよ。', '……怎么样？……我、我才不需要什么感想。……好吃的话，就说好吃啊。', '...Well? ...N-not that I need your opinion. ...If it is good, say it is good.')
        ] },
      { id: 'a_bento_note', zh: '「この付箋、なんて書いてあったの？」', en: '"What did the sticky note say?"', jp: 'この付箋、何て書いてあったの？', hintZh: '你很好奇', hintEn: 'You are curious',
        aff: 5, fam: 6, stat: 'guts',
        then: [
          say(A, '', 'angry', 'な、何も書いてない！ 最初から何も書いてないわよ！ 修正液は……その、デザイン！', '什、什么都没写！从一开始就什么都没写！修正液是……那个，设计！', 'N-nothing! There was never anything on it! The correction fluid is... um... a design!'),
          nar('她一把抢过筷子套，把那张便利贴撕下来，揉成一团，塞进了自己的口袋。然后又把筷子套还给你。', 'She snatches the case, peels off the note, crumples it and stuffs it in her own pocket. Then hands the case back to you.', outfitImg(A, '', 'pout'))
        ] },
      { id: 'a_bento_trade', zh: '把自己面包里的一半分给她', en: 'Give her half of your own bread in return', hintZh: '交换', hintEn: 'A trade',
        aff: 6, fam: 5, stat: 'charm',
        then: [
          nar('你把便利店买的菠萝包掰了一半递过去。她看了那半个面包很久，像是在看一份她没想到会收到的回信。', 'You break your convenience-store melon bread in half and hold it out. She looks at it a long time, like a reply to a letter she did not expect to be answered.'),
          say(A, '', 'happy', '……交換ね。……メロンパン、好きなの。誰にも言ってないけど。', '……交换是吧。……我喜欢菠萝包。虽然没跟任何人说过。', '...A trade, then. ...I like melon bread. I have never told anyone.')
        ] }
    ]),
    nar('预备铃响的时候，蓝色的便当盒已经空了。她把它收回自己的书包，收得很小心，像是明天还要用。', 'When the bell goes the blue box is empty. She puts it back in her own bag carefully, as if it will be needed again tomorrow.'),
    end(A, 4, 3, '那个蓝色的便当盒', 'The blue lunchbox')
  ]
};

const EV_ASUKA_WINDOW: MapEventDef = {
  id: 'ev2_asuka_window', locationId: 'daimaru_settlement', chars: [A], priority: 8,
  titleZh: '橱窗里的那条裙子', titleEn: 'The Dress in the Window',
  requiresFlags: ['ev2_asuka_bento'], minAffection: { [A]: 100 },
  script: [
    scene('daimaru_settlement', '旧居留地', 'The Old Settlement'),
    nar('旧居留地的石板路上，橱窗一扇接一扇。你在其中一扇前面看见了明日香——她站得离玻璃很近，近到呼出的气在玻璃上留下一小块白雾。', 'Along the Old Settlement\'s paved street the shop windows run one after another. In front of one you find Asuka, standing so close to the glass that her breath leaves a little patch of mist on it.'),
    nar('橱窗里是一条裙子。黑色的，层层叠叠的蕾丝，红色的缎带，跟她平时那种利落的风格完全不一样。', 'In the window is a dress. Black, layered lace, red satin ribbons. Nothing like her usual crisp style.'),
    say(A, '', 'surprised', '……っ！ い、いつからそこに！？ ……違うの、これは、その、通りかかっただけで！', '……！你、你从什么时候在那儿的？！……不是的，这是，那个，只是路过！', '...! H-how long have you been there?! ...It is not what it looks like, I was just passing!'),
    nar('你看了看橱窗，又看了看她。她的视线一直在那条裙子和你之间来回，最后放弃了似的，叹了口气。', 'You look at the window, then at her. Her eyes keep going back and forth between the dress and you, until she gives up and sighs.', outfitImg(A, '', 'sad')),
    say(A, '', 'sad', '……私ね、本当はこういうのが好きなの。可愛いの。フリルとか、リボンとか。……でも、委員長がこんなの着てたら、笑われるでしょ。', '……我啊，其实喜欢这种的。可爱的东西。荷叶边啊，缎带啊。……可是班长要是穿这种，会被笑吧。', '...The truth is I like things like this. Cute things. Frills, ribbons. ...But if the class rep wore something like this, people would laugh.'),
    choice(A, '她说完就低下了头，像是在等一个判决。', 'Having said it she lowers her head, as if waiting for a verdict.', [
      { id: 'a_window_suits', zh: '「笑わない。絶対似合う。」', en: '"Nobody would laugh. It would suit you."', jp: '笑わないよ。絶対似合う。', hintZh: '直说', hintEn: 'Say it plainly',
        aff: 10, fam: 3, stat: 'charm',
        then: [
          say(A, '', 'shy', '……あんたって、ほんと……。……そういうこと、簡単に言わないでよ。信じちゃうじゃない。', '……你这家伙，真是……。……那种话，别说得那么轻松。我会当真的啊。', '...You really... ...Do not say things like that so easily. I will believe you.'),
          nar('她又看了一眼那条裙子。这一次，她看得很久，没有偷偷摸摸的。', 'She looks at the dress again. This time for a long while, not furtively at all.', outfitImg(A, '', 'happy'))
        ] },
      { id: 'a_window_secret', zh: '「じゃあ、俺だけの秘密にする。」', en: '"Then it is a secret, just mine."', jp: '俺だけの秘密にする。', hintZh: '帮她守住', hintEn: 'Keep it for her',
        aff: 8, fam: 6, stat: 'kindness',
        then: [
          say(A, '', 'pout', '……あんただけの、ね。……それ、なんか、ずるい響き。……でも、いいわ。あんたなら。', '……只属于你的，是吧。……这话听起来，有点狡猾。……不过，算了。是你的话。', '...Just yours. ...That sounds a bit sly somehow. ...But fine. If it is you.')
        ] },
      { id: 'a_window_in', zh: '「試着だけ、してみたら？」', en: '"Why not just try it on?"', jp: '試着だけしてみたら？', hintZh: '推她一把', hintEn: 'Give her a push',
        aff: 9, fam: 4, stat: 'guts', setFlags: ['asuka_tried_dress'],
        then: [
          say(A, '', 'surprised', 'は、はぁ！？ 今！？ ここで！？ ……む、無理無理無理！', '哈、哈？！现在？！在这儿？！……不、不行不行不行！', 'Wh-what?! Now?! Here?! ...N-no, no, no!'),
          nar('她说了三个"无理"，然后推开了店门。十五分钟以后试衣间的帘子拉开了一条缝，又马上合上了。你只看见了一角黑色的蕾丝。', 'She says no three times, then pushes the shop door open. Fifteen minutes later the fitting-room curtain opens a crack and snaps shut again. All you see is a corner of black lace.'),
          say(A, '', 'shy', '……今日は見せない。……いつか、ちゃんと見せるから。……それまで、忘れないでよ。', '……今天不给你看。……总有一天，会好好给你看的。……在那之前，不许忘了。', '...Not today. ...One day I will show you properly. ...Until then, do not forget.')
        ] }
    ]),
    end(A, 4, 3, '她说出了自己喜欢可爱的东西', 'She admitted she likes cute things')
  ]
};

// ==========================================================
// 光
// ==========================================================
const EV_HIKARI_ART: MapEventDef = {
  id: 'ev2_hikari_art', locationId: 'art_room', chars: [H], priority: 8,
  titleZh: '向日葵和模特', titleEn: 'Sunflowers and a Model',
  requiresFlags: ['day1_met_hikari'], minFamiliarity: { [H]: 60 },
  script: [
    scene('art_room', '美术室', 'The Art Room', '放学后 · 美术室', 'After school · The art room'),
    nar('美术室里一股松节油的味道。光站在画架前面，脸上蹭了一道黄色的颜料，正对着一幅画皱眉头。画上是向日葵，很多很多向日葵，多到像是要从画布里挤出来。', 'The art room smells of turpentine. Hikari stands at an easel with a streak of yellow paint across her cheek, frowning at a canvas. Sunflowers on it, a great many, so many they seem about to burst out of the frame.'),
    say(H, '', 'surprised', 'あっ、{name}！ ちょうどええとこに！ なあ、ちょっとそこ座って。動かんといてな。', '啊，{name}！来得正好！呐，你在那儿坐一下。别动哦。', 'Ah, {name}! Perfect timing! Sit there a sec. And do not move.'),
    nar('你还没来得及问为什么，就已经被按在了一张椅子上。', 'Before you can ask why, you are already pushed down onto a chair.'),
    say(H, '', 'happy', 'ひまわりの真ん中に、人物入れたいねん。誰か見てる人。……あんた、ひまわり見てる顔、ええと思うねん。', '我想在向日葵中间画个人。一个在看着什么的人。……我觉得你看向日葵的表情，挺好的。', 'I want a person in the middle of the sunflowers. Someone looking at something. ...I think you would have a good sunflower-looking face.'),
    choice(H, '她拿着画笔，等你摆好姿势。', 'Brush in hand, she waits for you to pose.', [
      { id: 'h_art_still', zh: '一动不动地坐好', en: 'Sit perfectly still', hintZh: '当个称职的模特', hintEn: 'Be a proper model',
        aff: 5, fam: 7, stat: 'guts',
        then: [
          nar('你坐了四十分钟，鼻子痒了三次，忍住了三次。她画得很专注，专注到忘了跟你说话，偶尔抬头看你一眼，那一眼比平时安静得多。', 'You sit for forty minutes; your nose itches three times and you hold out three times. She paints with total focus, forgets to talk, and now and then looks up at you, more quietly than she usually looks at anyone.', outfitImg(H, '', 'neutral')),
          say(H, '', 'happy', 'できた！ ……まだ下書きやけど。完成したら、一番に見せたるな。', '画好了！……虽然还只是草稿。完成了第一个给你看哦。', 'Done! ...Well, the rough. When it is finished, you will be the first to see it.')
        ] },
      { id: 'h_art_paint', zh: '「俺も描いていい？」', en: '"Can I paint too?"', jp: '俺も描いていい？', hintZh: '换个角色', hintEn: 'Swap roles',
        aff: 6, fam: 6, stat: 'proficiency',
        then: [
          nar('她把一支笔塞给你。你在画布的角落画了一朵向日葵，画得很难看，像一个被太阳晒晕了的煎蛋。', 'She hands you a brush. In the corner of the canvas you paint a sunflower. It is terrible, like a fried egg that has fainted in the sun.'),
          say(H, '', 'happy', 'あはは！ 何これ、目玉焼き？ ……でも、消さんとこ。これ、この絵で一番好きかもしれん。', '啊哈哈！这是什么，荷包蛋？……不过，不擦掉了。这朵，可能是这幅画里我最喜欢的。', 'Ahaha! What is that, a fried egg? ...But I am keeping it. It might be my favourite thing in the whole painting.')
        ] },
      { id: 'h_art_cheek', zh: '「顔、絵の具ついてるよ。」', en: '"You have paint on your face."', jp: '顔に絵の具ついてるよ。', hintZh: '先说这个', hintEn: 'Mention that first',
        aff: 7, fam: 5, stat: 'kindness',
        then: [
          say(H, '', 'surprised', 'えっ、うそ！ どこどこ！？', '诶，骗人！哪里哪里？！', 'What, no! Where, where?!'),
          nar('她用手背去擦，结果把黄色擦得更开了，整半边脸都变成了向日葵的颜色。你忍不住笑出来，她也笑，笑着笑着把画笔往你脸上点了一下。现在你们是一样的了。', 'She wipes with the back of her hand and only spreads it, until half her face is sunflower-coloured. You laugh, and she laughs, and while laughing dabs her brush on your cheek. Now you match.', outfitImg(H, '', 'happy'))
        ] }
    ]),
    end(H, 3, 4, '美术室的向日葵', 'The sunflowers in the art room')
  ]
};

const EV_HIKARI_BUDDY: MapEventDef = {
  id: 'ev2_hikari_buddy', locationId: 'international_office', chars: [H], priority: 8,
  titleZh: '第一个打招呼的人', titleEn: 'The First to Say Hello',
  requiresFlags: ['ev2_hikari_art'], minFamiliarity: { [H]: 90 },
  script: [
    scene('kaisei_intl_salon', '国际交流室', 'The International Office', '放学后 · 国际交流室', 'After school · The international office'),
    nar('国际交流室的门口贴着一张新的海报：「留学生バディ募集！」。底下的报名表上只有一个名字，字写得很大，大到占了两行。光。', 'A new poster on the international office door: exchange-student buddies wanted! The sign-up sheet has one name, written so big it takes two lines. Hikari.'),
    say(H, '', 'happy', 'あ、見つかってもた。……来月な、新しい留学生来るねん。うち、案内係やりたくて。', '啊，被发现了。……下个月，有新的留学生要来。我想当带路的。', 'Oh, you found it. ...A new exchange student is coming next month. I want to be the one who shows them round.'),
    nar('她看着那张报名表，安静了一会儿。', 'She looks at the sheet and is quiet for a moment.', outfitImg(H, '', 'neutral')),
    say(H, '', 'shy', '……あんたが来た日な、廊下で地図ひっくり返して見てたやろ。逆さまに。……あれ見て、絶対うちが最初に話しかけたろって思ってん。', '……你来的那天，在走廊上把地图拿反了在看吧。倒着拿的。……看到那一幕，我就想，一定要第一个跟你搭话。', '...The day you arrived, you were in the corridor looking at the map. Upside down. ...When I saw that, I decided I would be the first to talk to you.'),
    choice(H, '原来那天她是故意的。', 'So it was on purpose, that day.', [
      { id: 'h_buddy_thanks', zh: '「あの時、すごく助かった。」', en: '"That really helped me, back then."', jp: 'あの時、すごく助かった。', hintZh: '那是真的', hintEn: 'It is true',
        aff: 7, fam: 6, stat: 'kindness',
        then: [
          say(H, '', 'shy', '……ほんま？ ……よかった。うち、うるさかっただけちゃうかって、ちょっと思っててん。', '……真的？……太好了。我还有点担心，那时候是不是只是很吵而已。', '...Really? ...Good. I sort of worried I had just been noisy.')
        ] },
      { id: 'h_buddy_join', zh: '「俺もバディやる。」在报名表上写下自己的名字', en: '"I will be a buddy too." Write your name on the sheet', jp: '俺もバディやる。', hintZh: '这次轮到你', hintEn: 'Your turn now',
        aff: 6, fam: 8, stat: 'charm', setFlags: ['buddy_signed_up'],
        then: [
          nar('你在她的名字下面写上了自己的。字写得很小，挤在她那两行大字的缝里。', 'You write your name under hers, small, squeezed between her two big lines.'),
          say(H, '', 'happy', 'やった！ ほな、二人で最強の案内しよな！ 逆さまの地図の見方も教えたろ！', '太好了！那我们两个来做最强的向导吧！连倒着看地图的方法也教给他！', 'Yes! Then we will be the best guides ever! We can teach them how to read a map upside down too!')
        ] },
      { id: 'h_buddy_tease', zh: '「逆さまじゃなかった。……たぶん。」', en: '"It was not upside down. ...Probably."', jp: '逆さまじゃなかった……たぶん。', hintZh: '嘴硬一下', hintEn: 'Save face',
        aff: 4, fam: 9, stat: 'guts',
        then: [
          say(H, '', 'tease', 'いーや、逆さまやった。北が下やった。うち、写真撮ったもん。見る？', '不——，就是倒着的。北在下面。我拍了照片的。要看吗？', 'Nope, upside down. North was at the bottom. I took a photo. Want to see?'),
          nar('她真的拍了。照片里的你一脸严肃地看着一张倒过来的地图。你们俩对着手机笑了很久。', 'She really did. In the photo you are studying an upside-down map with great seriousness. You both laugh over the phone for a long time.', outfitImg(H, '', 'happy'))
        ] }
    ]),
    end(H, 4, 4, '她是故意第一个跟你说话的', 'She was the first to talk to you, on purpose')
  ]
};

const EV_HIKARI_WHEEL: MapEventDef = {
  id: 'ev2_hikari_wheel', locationId: 'oji_amusement_park', chars: [H], priority: 8,
  titleZh: '小小的摩天轮', titleEn: 'The Little Wheel',
  requiresFlags: ['ev2_hikari_buddy'], minAffection: { [H]: 100 },
  script: [
    scene('oji_amusement_park', '王子动物园 · 游乐区', 'Oji Zoo · The fairground'),
    nar('游乐区的摩天轮前面，光拿着两张票，在原地踱来踱去。看见你，她把票藏到了背后，又马上拿了出来。', 'In front of the fairground wheel Hikari paces with two tickets. Seeing you, she hides them behind her back, then immediately brings them out again.'),
    say(H, '', 'shy', '商店街の福引で当たってん。二枚。……二枚やから、一人で乗るんはもったいないやろ？', '商店街抽奖抽中的。两张。……两张嘛，一个人坐太浪费了吧？', 'I won them in the shopping-street lottery. Two. ...And with two, riding alone would be a waste, right?'),
    scene('oji_zoo_ferris_wheel', '摩天轮', 'The Wheel'),
    nar('轿厢很小，膝盖几乎碰到膝盖。光一路上都在说话，说动物园的河马，说商店街的抽奖，说她妈妈的口头禅。到了最高点，她忽然不说了。', 'The gondola is tiny; your knees nearly touch. Hikari talks all the way up, about the hippo, the lottery, her mother\'s favourite saying. At the top she suddenly stops.', outfitImg(H, '', 'neutral')),
    say(H, '', 'shy', '……なあ。うち、いっつもしゃべってるやん。黙ったら、なんか、心臓の音聞こえそうで。', '……呐。我不是一直在说话嘛。一不说话，总觉得会听见心跳的声音。', '...You know how I am always talking. If I go quiet, I feel like you will hear my heart.'),
    choice(H, '轿厢在最高点轻轻晃了一下。', 'At the top the gondola sways gently.', [
      { id: 'h_wheel_listen', zh: '「聞こえてもいいよ。」', en: '"I do not mind if I hear it."', jp: '聞こえてもいいよ。', hintZh: '让她安静一会儿', hintEn: 'Let her be quiet',
        aff: 10, fam: 3, stat: 'kindness',
        then: [
          nar('她不说话了。轿厢里很安静，安静到你们都能听见对方的呼吸。下降的那两分钟，她一直看着窗外，手放在膝盖上，离你的手只有一点点。', 'She stops talking. It is so quiet in the gondola you can each hear the other breathing. For the two minutes down she looks out of the window, her hand on her knee, a hair\'s breadth from yours.', outfitImg(H, '', 'shy'))
        ] },
      { id: 'h_wheel_mine', zh: '「俺の心臓も、うるさいよ。」', en: '"Mine is pretty loud too."', jp: '俺の心臓も、うるさいよ。', hintZh: '说实话', hintEn: 'Tell the truth',
        aff: 11, fam: 2, stat: 'guts',
        then: [
          say(H, '', 'surprised', '……え。……ほんま？ ……ほな、どっちがうるさいか、勝負やな。', '……诶。……真的？……那就来比比看谁的更吵。', '...Eh. ...Really? ...Then let us see whose is louder.'),
          nar('她把耳朵凑过来，贴在你胸口听了三秒，然后猛地坐直，满脸通红地宣布："……引き分け。"', 'She leans in, puts her ear to your chest for three seconds, then sits bolt upright and announces, scarlet: ...a draw.', outfitImg(H, '', 'shy'))
        ] }
    ]),
    end(H, 5, 3, '摩天轮最高点那一分钟的安静', 'One quiet minute at the top of the wheel')
  ]
};

// ==========================================================
// 铃
// ==========================================================
const EV_REI_CARD: MapEventDef = {
  id: 'ev2_rei_card', locationId: 'school_library', chars: [R], priority: 8,
  titleZh: '借书卡上的名字', titleEn: 'The Names on the Card',
  requiresFlags: ['day1_met_rei'], minFamiliarity: { [R]: 50 },
  script: [
    scene('school_library', '图书室', 'The Library', '放学后 · 图书室', 'After school · The library'),
    nar('你从书架上抽出一本天文学入门。书的最后一页还夹着老式的借书卡——这个学校的图书室大概是全日本最后几个还用纸卡的地方之一。', 'You pull an introduction to astronomy off the shelf. A proper old lending card is still tucked in the back. This must be one of the last school libraries in Japan still using paper.'),
    nar('卡上的名字一行一行往下排。第一行是十二年前。最后五行，全是同一个名字：铃。', 'The names run down the card line by line. The first is from twelve years ago. The last five are all the same name. Rei.'),
    say(R, '', 'neutral', 'その本は、私が五回借りています。……背後に立つのは、驚くのでやめてください。', '那本书，我借了五次。……请不要站在别人背后，会吓到的。', 'I have borrowed that book five times. ...Please do not stand behind people. It is startling.'),
    nar('她就在你身后，抱着三本书，表情一点都没有被吓到的样子。', 'She is right behind you, holding three books, looking not remotely startled.', outfitImg(R, '', 'neutral')),
    choice(R, '她看着你手里那张卡。', 'She is looking at the card in your hand.', [
      { id: 'r_card_why', zh: '「どうして五回も？」', en: '"Why five times?"', jp: 'どうして五回も？', hintZh: '好奇', hintEn: 'Curious',
        aff: 4, fam: 8, stat: 'knowledge',
        then: [
          say(R, '', 'neutral', '読むたびに、分からないところが変わるからです。一回目は数式が分からなかった。五回目は、著者がなぜこれを書いたのかが分からなくなった。', '因为每次读，不懂的地方都会变。第一次是公式看不懂。第五次，变成了看不懂作者为什么要写这本书。', 'Because what I do not understand changes each time. The first time it was the equations. By the fifth, it was why the author wrote it at all.'),
          say(R, '', 'happy', '……六回目は、誰かと読んだら分かるかもしれない、と考えています。', '……我在想，第六次的话，跟别人一起读或许就懂了。', '...I have been thinking the sixth time, it might make sense if I read it with someone.')
        ] },
      { id: 'r_card_write', zh: '把自己的名字写在她的名字下面', en: 'Write your name under hers on the card', hintZh: '第六行', hintEn: 'The sixth line',
        aff: 7, fam: 5, stat: 'charm', setFlags: ['rei_card_signed'],
        then: [
          nar('你借了笔，在第六行写上自己的名字。她看着那一行，看了很久，然后从口袋里拿出那本笔记本，记了点什么。', 'You borrow a pen and write your name on the sixth line. She looks at it for a long time, then takes out her notebook and writes something down.', outfitImg(R, '', 'shy')),
          say(R, '', 'shy', '……この本の貸出記録に、初めて私以外の名前が並びました。……記録的なことです。', '……这本书的借阅记录上，第一次排上了我以外的名字。……这是创纪录的事。', '...For the first time, a name other than mine follows mine in this book\'s record. ...That is a record in itself.')
        ] }
    ]),
    end(R, 3, 4, '借书卡上的第六行', 'The sixth line on the lending card')
  ]
};

const EV_REI_NOTE: MapEventDef = {
  id: 'ev2_rei_note', locationId: 'music_room', chars: [R], priority: 8,
  titleZh: '一个音的寿命', titleEn: 'The Lifespan of One Note',
  requiresFlags: ['ev2_rei_card'], minFamiliarity: { [R]: 90 },
  script: [
    scene('music_room', '音乐室', 'The Music Room', '放学后 · 音乐室', 'After school · The music room'),
    nar('音乐室里传出钢琴声。只有一个音，按下去，等它消失，再按下去。一遍又一遍，像是有人在敲一扇没人应的门。', 'A piano from the music room. One note only: pressed, left to fade, pressed again. Over and over, like knocking on a door nobody answers.'),
    nar('是铃。她一只手按着琴键，另一只手拿着秒表。', 'It is Rei. One hand on the key, the other holding a stopwatch.', outfitImg(R, '', 'neutral')),
    say(R, '', 'tease', 'ラの音の減衰時間を測っています。平均十一・二秒。……音にも寿命がある、ということです。', '我在测"la"这个音的衰减时间。平均十一点二秒。……也就是说，声音也是有寿命的。', 'I am measuring the decay of an A. Eleven point two seconds on average. ...Which means sounds have a lifespan too.'),
    say(R, '', 'neutral', '……でも、二つの音を同時に鳴らすと、少し長く残ります。共鳴するので。……一つだと、短い。', '……不过，两个音同时弹的话，会留得久一点。因为会共鸣。……一个的话，很短。', '...But if two notes sound together they last a little longer. They resonate. ...Alone, it is short.'),
    choice(R, '她把秒表放下，看着你。', 'She sets the stopwatch down and looks at you.', [
      { id: 'r_note_play', zh: '在旁边的琴键上按下另一个音', en: 'Press another key beside hers', hintZh: '共鸣', hintEn: 'Resonance',
        aff: 9, fam: 4, stat: 'proficiency',
        then: [
          nar('你按下旁边的一个键，跟她的音一起响起来。两个音缠在一起，比一个音长了很多。她没有看秒表。', 'You press a neighbouring key and it sounds with hers. The two notes wind together and last far longer than one. She does not look at the stopwatch.', outfitImg(R, '', 'shy')),
          say(R, '', 'shy', '……測り忘れました。……でも、長かったことは、分かります。', '……忘了测。……不过，我知道它很长。', '...I forgot to time it. ...But I know it was long.')
        ] },
      { id: 'r_note_time', zh: '接过秒表：「次は俺が測る。」', en: 'Take the stopwatch: "I will time the next one."', jp: '次は俺が測る。', hintZh: '帮她做实验', hintEn: 'Help her experiment',
        aff: 5, fam: 8, stat: 'knowledge',
        then: [
          nar('你们测了二十次。你按秒表，她弹琴，然后交换。数据记了满满一页。最后她看着那页数据，说了一句跟实验无关的话。', 'You time twenty runs. You on the stopwatch, she on the key, then swap. A whole page of data. At the end she looks at it and says something unrelated to the experiment.'),
          say(R, '', 'happy', '……一人で測るより、楽しかったです。これは、測定誤差ではありません。', '……比一个人测更开心。这个，不是测量误差。', '...It was more enjoyable than timing alone. That is not a measurement error.')
        ] }
    ]),
    end(R, 4, 3, '两个音的共鸣', 'Two notes resonating')
  ]
};

const EV_REI_SCHOOL: MapEventDef = {
  id: 'ev2_rei_school', locationId: 'suma_aquarium', chars: [R], priority: 8,
  titleZh: '沙丁鱼的算法', titleEn: 'The Sardine Algorithm',
  requiresFlags: ['ev2_rei_note'], minAffection: { [R]: 100 },
  script: [
    scene('suma_aquarium', '须磨水族园', 'Suma Aquarium'),
    nar('大水槽前面，铃一个人站着，看着那个银色的旋涡看了很久。你走过去的时候，她没回头，就知道是你。', 'In front of the great tank Rei stands alone, watching the silver spiral. When you come up she does not turn round. She knows it is you.'),
    say(R, '', 'neutral', '沙丁鱼の群れは、指揮する個体がいません。それぞれが、隣の数匹だけを見て動いています。それだけで、あの形になる。', '沙丁鱼群里，没有指挥的个体。每一条只看着旁边的几条在游。就只是这样，就成了那个形状。', 'A school of sardines has no leader. Each fish only watches the few beside it. That alone makes that shape.'),
    nar('她转过头来。眼镜片上映着水槽的蓝光。', 'She turns her head. The blue of the tank shines in her lenses.', outfitImg(R, '', 'shy')),
    say(R, '', 'shy', '……最近、私も同じだと気づきました。全体は分からなくても、隣にいる一人だけ見ていれば、ちゃんと進める。……その一人が、あなたです。', '……最近，我发现自己也一样。就算看不清全局，只要看着旁边那一个人，就能好好往前走。……那一个人，是你。', '...Lately I realised I am the same. Even if I cannot see the whole, if I watch the one beside me, I move forward properly. ...That one is you.'),
    choice(R, '她说完，又转回去看鱼了。耳朵是红的。', 'Having said it she turns back to the fish. Her ears are red.', [
      { id: 'r_school_same', zh: '「俺も、隣の一人しか見てない。」', en: '"I am only watching the one beside me too."', jp: '俺も、隣の一人しか見てない。', hintZh: '回答她', hintEn: 'Answer her',
        aff: 12, fam: 3, stat: 'charm',
        then: [
          say(R, '', 'happy', '……では、二匹の群れですね。……小さいですが、統計的には十分です。', '……那么，就是两条鱼的鱼群了。……虽然很小，但在统计上足够了。', '...Then we are a school of two. ...Small, but statistically sufficient.')
        ] },
      { id: 'r_school_hand', zh: '走到她旁边，并排站着', en: 'Step beside her and stand shoulder to shoulder', hintZh: '用行动', hintEn: 'Act on it',
        aff: 11, fam: 4, stat: 'kindness',
        then: [
          nar('你走到她旁边。她没有动，只是你们的肩膀碰在了一起。水槽里的沙丁鱼转了一个方向，你们也没有动。', 'You stand beside her. She does not move; your shoulders simply touch. The sardines turn as one, and neither of you moves.', outfitImg(R, '', 'shy'))
        ] }
    ]),
    end(R, 5, 3, '两条鱼的鱼群', 'A school of two')
  ]
};

// ==========================================================
// 稻荷
// ==========================================================
const EV_INARI_LOOKOUT: MapEventDef = {
  id: 'ev2_inari_lookout', locationId: 'kitano_lookout', chars: [I], priority: 8,
  titleZh: '港还没有的时候', titleEn: 'Before There Was a Port',
  requiresFlags: ['day1_met_inari'], minFamiliarity: { [I]: 50 },
  script: [
    scene('kitano_tenman_shrine', '北野天满神社', 'Kitano Tenman Shrine'),
    nar('北野天满神社的观景台上，稻荷坐在栏杆上，晃着脚，看着下面的城市。她坐的地方离地面很高，可她看上去一点都不担心。', 'On the lookout at Kitano Tenman Shrine Inari sits on the railing, swinging her feet over the city. It is a long drop, and she looks entirely unconcerned.'),
    say(I, '', 'tease', 'おや、人の子。ここは妾の社ではないぞ。天神殿の家じゃ。……まあ、昔なじみでな。たまに茶を飲みに来る。', '哦，人类的孩子。这里可不是妾身的神社。是天神大人的家。……嘛，老相识了。偶尔来喝杯茶。', 'Oh, child of man. This is not my shrine. It belongs to Tenjin. ...Well, we go back a way. I drop by for tea now and then.'),
    say(I, '', 'neutral', '見よ。あの港のあたり、昔は全部海じゃった。平清盛が島を築こうとしてな。……人柱を立てる話が出た。', '看。那片港口一带，以前全是海。平清盛想在那里筑岛。……还提过要立人柱。', 'Look. All round the port down there was sea, once. Taira no Kiyomori tried to build an island. ...There was talk of a human sacrifice.'),
    choice(I, '她的声音低了下去。', 'Her voice drops.', [
      { id: 'i_look_then', zh: '「それで、どうなったの？」', en: '"What happened?"', jp: 'それで、どうなったの？', hintZh: '听下去', hintEn: 'Hear the rest',
        aff: 5, fam: 8, stat: 'knowledge',
        then: [
          say(I, '', 'sad', '一人の小僧が、自分から名乗り出た。……結局、清盛は人の代わりに石に経を書いて沈めた。経が島。人ではなく、言葉で作った島じゃ。', '一个小和尚自己站了出来。……最后，清盛没有用人，而是在石头上写经文沉了下去。经岛。不是用人，是用文字筑成的岛。', 'A young monk volunteered himself. ...In the end Kiyomori sank stones written with sutras instead of a person. Kyogashima. An island made of words, not a man.', [{ jp: '経', reading: 'きょう', zh: '经文', en: 'sutra' }]),
          say(I, '', 'happy', '……妾は、あの時の人の子が好きでな。言葉で人を救えると、信じた者たちが。', '……妾身啊，喜欢那时候的人类。那些相信能用文字救人的人。', '...I am fond of the humans of that time. The ones who believed words could save a life.')
        ] },
      { id: 'i_look_saw', zh: '「……見てたの？」', en: '"...You saw it?"', jp: '……見てたの？', hintZh: '她是不是在场', hintEn: 'Was she there?',
        aff: 6, fam: 7, stat: 'guts',
        then: [
          say(I, '', 'tease', 'ふふ。どうじゃろうな。……汝が信じたいほうを、信じればよい。', '呵呵。谁知道呢。……你愿意信哪一种，就信哪一种吧。', 'Hehe. Who can say. ...Believe whichever you would like to.'),
          nar('她从栏杆上跳下来，落地没有声音。', 'She hops down from the railing and lands without a sound.', outfitImg(I, '', 'neutral'))
        ] }
    ]),
    end(I, 3, 5, '她给你讲了港口还是海的时候', 'She told you about when the port was still sea')
  ]
};

const EV_INARI_PANCAKE: MapEventDef = {
  id: 'ev2_inari_pancake', locationId: 'pancake_shop', chars: [I], priority: 8,
  titleZh: '神明排队', titleEn: 'A God in the Queue',
  requiresFlags: ['ev2_inari_lookout'], minFamiliarity: { [I]: 90 },
  script: [
    scene('pancake_shop_exterior', '幸福松饼', 'The Happiness Pancake Shop'),
    nar('松饼店门口排着长队。队伍正中间站着一个穿奶油色针织衫的女生，长发，金色狐狸吊坠。你看了三秒才确定那是稻荷。', 'A long queue outside the pancake shop. In the middle stands a girl in a cream knit, long hair, gold fox pendant. It takes you three seconds to be sure it is Inari.'),
    say(I, 'casual', 'surprised', '……っ、見つかったか。……な、なんじゃ。神が甘味を求めて何が悪い。', '……！被发现了吗。……干、干嘛。神明想吃甜食有什么不对。', '...! Found out. ...Wh-what? What is wrong with a god wanting something sweet?'),
    nar('她排了四十分钟。她说千年来从来没有排过队，所有东西都是别人端到她面前的。所以这是第一次。她看上去很享受这件事，享受到有点奇怪。', 'She has queued forty minutes. She says in a thousand years she has never queued; everything was always brought to her. So this is the first time. She seems to be enjoying it, oddly much.', outfitImg(I, 'casual', 'happy')),
    scene('pancake_shop_interior', '幸福松饼', 'The Happiness Pancake Shop'),
    choice(I, '松饼端上来了，在盘子里抖了一下。稻荷盯着它，一动不动。', 'The pancakes arrive and wobble on the plate. Inari stares at them, motionless.', [
      { id: 'i_pan_show', zh: '演示给她看怎么切', en: 'Show her how to cut them', hintZh: '她可能不会用刀叉', hintEn: 'She may not know knife and fork',
        aff: 6, fam: 6, stat: 'kindness',
        then: [
          nar('你切了一小块，叉起来递到她面前。她犹豫了一下，就着你的叉子吃了。嚼了很久。', 'You cut a small piece and hold it out on your fork. She hesitates, then eats it from your fork. Chews a long time.'),
          say(I, 'casual', 'shy', '……ふわふわじゃ。雲を食うておるようじゃ。……ん？ 汝、何をにやにやしておる。……あっ。', '……软乎乎的。像在吃云一样。……嗯？你在傻笑什么。……啊。', '...Fluffy. Like eating a cloud. ...Hm? What are you grinning at? ...Oh.')
        ] },
      { id: 'i_pan_offer', zh: '「お供えです。」双手把盘子推过去', en: '"An offering." Push the plate over with both hands', jp: 'お供えです。', hintZh: '开个神社的玩笑', hintEn: 'A shrine joke',
        aff: 5, fam: 8, stat: 'charm', words: [{ jp: 'お供え', reading: 'おそなえ', zh: '供品', en: 'offering' }],
        then: [
          say(I, 'casual', 'happy', 'あははは！ うむ、苦しゅうない！ ……千年で一番うまい供え物じゃ。来年の汝の願い、一つ聞いてやろう。', '啊哈哈哈！嗯，免礼！……一千年来最好吃的供品。明年你的愿望，妾身听你一个。', 'Ahahaha! Very well, accepted! ...The tastiest offering in a thousand years. I will grant you one wish next year.')
        ] }
    ]),
    end(I, 4, 4, '神明第一次排队', 'A god\'s first queue')
  ]
};

const EV_INARI_TORII: MapEventDef = {
  id: 'ev2_inari_torii', locationId: 'kyoto_torii', chars: [I], priority: 8, timeCost: 2,
  titleZh: '千本鸟居的尽头', titleEn: 'The End of the Thousand Gates',
  requiresFlags: ['ev2_inari_pancake'], minAffection: { [I]: 100 },
  script: [
    scene('kyoto_fushimi_torii', '伏见稻荷大社', 'Fushimi Inari Taisha'),
    nar('伏见稻荷的千本鸟居，一座接一座，朱红色的隧道一直往山上延伸。你在半路上看见了稻荷，她站在两座鸟居中间，在那里看起来比在任何地方都自然。', 'The thousand gates of Fushimi Inari, one after another, a vermilion tunnel climbing the mountain. Halfway up you find Inari between two gates, looking more at home than anywhere you have seen her.'),
    say(I, '', 'neutral', '……来たか。ここは、妾のような者の本家じゃ。全国の稲荷の、な。……人の子をここへ連れてきたのは、初めてじゃ。', '……来了啊。这里是妾身这类存在的本家。全国稻荷的。……带人类的孩子来这里，还是第一次。', '...You came. This is the head house for my kind. For every Inari in the land. ...I have never brought a human here.'),
    nar('你们往上走。鸟居越来越密，光从缝隙里漏下来，一道一道地落在她身上，像是在给她数什么。', 'You climb. The gates grow denser; light falls through the gaps in stripes across her, as if counting something.', outfitImg(I, '', 'neutral')),
    say(I, '', 'shy', '一つ一つの鳥居に、誰かの願いが書いてある。……妾は、千年、他人の願いばかり見てきた。……今日は、妾の願いを言うてもよいか。', '每一座鸟居上，都写着某个人的愿望。……妾身一千年来，看的全是别人的愿望。……今天，妾身可以说出自己的愿望吗。', 'Every gate has someone\'s wish written on it. ...For a thousand years I have only looked at others\' wishes. ...Today, may I say my own?'),
    choice(I, '她停下来，转过身，看着你。', 'She stops, turns, and looks at you.', [
      { id: 'i_torii_listen', zh: '「聞かせて。」', en: '"Tell me."', jp: '聞かせて。', hintZh: '听她说', hintEn: 'Listen',
        aff: 12, fam: 3, stat: 'kindness',
        then: [
          say(I, '', 'shy', '……汝の隣に、もう少しおりたい。人の一生ぶんでよい。……神が人の子に願うなど、笑うか？', '……想在你身边，再多待一会儿。人的一辈子那么长就好。……神明向人类许愿，你会笑吗？', '...I want to stay beside you a little longer. One human lifetime is enough. ...Will you laugh, a god wishing upon a human?'),
          me('笑わない。……叶える。', '不会笑。……我会实现它。', 'I will not laugh. ...I will grant it.'),
          nar('她看了你很久，然后笑了。不是平时那种狡黠的笑，是很小、很安静的，像是千年以来第一次被人回答了。', 'She looks at you a long time, then smiles. Not her usual sly smile; a small, quiet one, like the first time in a thousand years anyone has answered.', outfitImg(I, '', 'happy'))
        ] },
      { id: 'i_torii_write', zh: '「一緒に、鳥居に書こう。」', en: '"Let us write it on a gate together."', jp: '一緒に書こう。', hintZh: '让愿望留下来', hintEn: 'Let the wish stay',
        aff: 11, fam: 4, stat: 'charm',
        then: [
          nar('你们在一座小小的奉纳鸟居上写下了一行字。她写了一半，你写了另一半。她不让你看她写的那半，你也没让她看你的。', 'You write one line on a small votive gate. She writes half, you write the other half. She will not let you see hers, and you do not show her yours.'),
          say(I, '', 'happy', '……ふふ。これで、千年後もここに残る。妾が忘れても、鳥居が覚えておる。……まあ、妾は忘れぬがな。', '……呵呵。这样，一千年后也会留在这里。就算妾身忘了，鸟居也会记得。……嘛，妾身是不会忘的。', '...Hehe. Now it stays here a thousand years. Even if I forget, the gate remembers. ...Not that I will forget.')
        ] }
    ]),
    end(I, 5, 3, '千本鸟居的愿望', 'A wish among the thousand gates')
  ]
};

// ==========================================================
// 深雪
// ==========================================================
const EV_MIYUKI_LAUNDRY: MapEventDef = {
  id: 'ev2_miyuki_laundry', locationId: 'umikaze_exterior', chars: [M], priority: 8, timeSlots: ['afternoon'],
  titleZh: '晾衣绳上的风', titleEn: 'Wind on the Washing Line',
  requiresFlags: ['ev_coffee_miyuki'], minFamiliarity: { [M]: 60 },
  script: [
    scene('umikaze_exterior', '海风庄', 'Umikaze-so'),
    nar('海风庄的院子里，深雪踮着脚在晾床单。风从海那边吹上坡，床单鼓起来，像一张想要启航的帆。', 'In the Umikaze-so yard Miyuki is on tiptoe hanging sheets. The wind comes up the slope from the sea and the sheet bellies out like a sail eager to set off.'),
    nar('一阵大风。一件白衬衫从晾衣绳上挣脱，翻了两个跟头，挂在了你的头上。是你的衬衫。', 'A strong gust. A white shirt tears loose from the line, somersaults twice and lands on your head. It is your shirt.'),
    say(M, '', 'surprised', 'あら……！ ごめんなさい、それ、あなたの。……共用の洗濯機に入ったままだったから、ついでに干しちゃったの。', '哎呀……！对不起，那件是你的。……一直放在公用洗衣机里，我就顺手晾了。', 'Oh...! I am sorry, that is yours. ...It was left in the shared machine, so I hung it out with mine.'),
    choice(M, '衬衫还挂在你头上。', 'The shirt is still on your head.', [
      { id: 'm_laundry_help', zh: '「手伝います。」一起晾剩下的', en: '"Let me help." Hang the rest together', jp: '手伝います。', hintZh: '帮忙', hintEn: 'Help out',
        aff: 6, fam: 7, stat: 'kindness',
        then: [
          nar('你们一个人拉床单的一头，抖开，再挂上去。风一直在捣乱，有两次床单把你们两个一起裹在了里面。第二次的时候，她在床单里面小声笑了。', 'You each take one end of a sheet, shake it out, peg it up. The wind keeps interfering; twice a sheet wraps round you both. The second time, inside it, she laughs softly.', outfitImg(M, '', 'happy')),
          say(M, '', 'happy', 'ふふ……誰かと洗濯物干すの、何年ぶりかしら。……一人だと、洗濯物ってただの作業なのにね。', '呵呵……跟别人一起晾衣服，是多少年没有过了呢。……一个人的话，晾衣服只是件差事而已。', 'Hehe... how many years since I hung washing with someone. ...Alone, washing is just a chore.')
        ] },
      { id: 'm_laundry_thanks', zh: '「……すみません、ありがとうございます。」', en: '"...Sorry. And thank you."', jp: 'すみません、ありがとうございます。', hintZh: '有点不好意思', hintEn: 'A little embarrassed',
        aff: 5, fam: 6, stat: 'charm',
        then: [
          say(M, '', 'tease', 'いいのよ。大家さんの特権。……でも、次は自分で取り出してね？ 下着は、さすがに干せないから。', '没关系哦。房东的特权。……不过，下次要自己拿出来哦？内衣的话，我可就没法帮你晾了。', 'It is fine. A landlady\'s privilege. ...But take it out yourself next time? I really cannot hang your underwear.'),
          nar('你的脸一下子烧了起来。她笑着转回去接着晾，可是你看见她的耳朵也有点红。', 'Your face catches fire. She turns back to the line, laughing, but you notice her ears are a little pink too.', outfitImg(M, '', 'shy'))
        ] }
    ]),
    end(M, 3, 4, '一起晾的床单', 'Sheets hung together')
  ]
};

const EV_MIYUKI_BOOK: MapEventDef = {
  id: 'ev2_miyuki_book', locationId: 'motomachi_arcade', chars: [M], priority: 8,
  titleZh: '旧书店的那本诗集', titleEn: 'The Poetry Book in the Secondhand Shop',
  requiresFlags: ['ev2_miyuki_laundry'], minFamiliarity: { [M]: 100 },
  script: [
    scene('motomachi_arcade', '元町商店街', 'Motomachi Arcade'),
    nar('元町商店街的一家旧书店门口，深雪蹲在打折书的纸箱前面，手里捧着一本很薄的书，一动不动。', 'Outside a secondhand bookshop in the Motomachi arcade, Miyuki crouches by the bargain boxes, holding a very thin book, quite still.'),
    say(M, '', 'surprised', '……あ。見て、これ。高校の時、図書室で毎日読んでた詩集。……絶版になってて、もう二度と会えないと思ってた。', '……啊。你看，这本。高中的时候，我每天在图书室读的诗集。……已经绝版了，我以为再也遇不到了。', '...Oh. Look at this. The poetry book I read in the school library every day in high school. ...Out of print. I thought I would never see it again.'),
    nar('书的价格标签上写着一百日元。她翻到中间某一页，读了两行，声音很轻，像在念给另一个时间里的自己听。', 'The price sticker says a hundred yen. She opens it at a page in the middle and reads two lines aloud, so softly, as if to herself in another time.', outfitImg(M, '', 'sad')),
    choice(M, '她合上书，把它放回了纸箱。', 'She closes the book and puts it back in the box.', [
      { id: 'm_book_buy', zh: '把它拿出来，去收银台付钱', en: 'Take it out again and pay for it', hintZh: '一百日元', hintEn: 'A hundred yen',
        aff: 9, fam: 4, stat: 'kindness', setFlags: ['pay:100'],
        then: [
          nar('你把那本诗集递给她。她看着你，又看着书，过了很久才伸手接过去。', 'You hand her the book. She looks at you, then at the book, and only after a long while reaches out to take it.'),
          say(M, '', 'shy', '……いつもは、私があなたに何かしてあげる側なのに。……これ、ずるいわ。一生、大事にするから。', '……平时都是我为你做点什么。……这样，太狡猾了。我会珍惜一辈子的。', '...I am usually the one doing things for you. ...This is unfair. I will treasure it my whole life.')
        ] },
      { id: 'm_book_why', zh: '「どうして戻したの？」', en: '"Why did you put it back?"', jp: 'どうして戻したの？', hintZh: '问她', hintEn: 'Ask her',
        aff: 6, fam: 7, stat: 'guts',
        then: [
          say(M, '', 'sad', '……あの頃の私に、戻りたくないのかもしれないわね。一人で、この詩だけが友達だった頃に。', '……也许是不想回到那时候的自己吧。一个人，只有这些诗是朋友的那时候。', '...Perhaps I do not want to go back to who I was then. Alone, with only these poems for friends.'),
          me('今は一人じゃないでしょ。', '现在不是一个人了吧。', 'You are not alone now, though.'),
          nar('她愣了一下，然后又把那本书从纸箱里拿了出来。这一次，她自己去付了钱。', 'She pauses, then takes the book out of the box again. This time she goes and pays for it herself.', outfitImg(M, '', 'happy'))
        ] }
    ]),
    end(M, 4, 3, '那本一百日元的诗集', 'The hundred-yen book of poems')
  ]
};

const EV_MIYUKI_RAIN: MapEventDef = {
  id: 'ev2_miyuki_rain', locationId: 'former_settlement_salon', chars: [M], priority: 8, weather: ['rainy', 'cloudy'],
  titleZh: '海风庄是谁的', titleEn: 'Whose House Umikaze Is',
  requiresFlags: ['ev2_miyuki_book'], minAffection: { [M]: 100 },
  script: [
    scene('former_settlement_15_salon', '旧居留地十五番馆', 'The Old Settlement, No. 15'),
    nar('十五番馆的茶室里，深雪一个人坐在窗边，面前的红茶已经凉了。外面开始下起了小雨，雨水沿着那些一百多年的玻璃往下流。', 'In the No. 15 tea room Miyuki sits alone by the window, her tea gone cold. It is raining outside, water running down glass more than a century old.'),
    say(M, '', 'sad', '……今日はね、祖母の命日なの。海風荘、もともと祖母のアパートだったのよ。', '……今天啊，是我奶奶的忌日。海风庄，本来是奶奶的公寓。', '...Today is the anniversary of my grandmother\'s death. Umikaze-so was hers originally.'),
    say(M, '', 'neutral', '祖母は、住む人のことを全部覚えてた。誕生日も、好きなおかずも。……私、それを真似してるだけなの。「優しいお姉さん」は、祖母の真似。', '奶奶记得每一个住户的事。生日啊，喜欢的菜啊。……我只是在模仿她而已。"温柔的姐姐"，是在学奶奶。', 'She remembered everything about her tenants. Birthdays, favourite dishes. ...I am only copying her. The "kind big sister" is an imitation of my grandmother.'),
    choice(M, '她第一次在你面前把那层东西放下了。', 'For the first time she has set that layer down in front of you.', [
      { id: 'm_rain_real', zh: '「真似でも、俺が知ってる深雪さんは本物だよ。」', en: '"Copy or not, the Miyuki I know is real."', jp: '真似でも、俺が知ってる深雪さんは本物だよ。', hintZh: '告诉她', hintEn: 'Tell her',
        aff: 12, fam: 3, stat: 'kindness',
        then: [
          say(M, '', 'shy', '……そんなこと言われたら、泣いちゃうじゃない。……ふふ。だめね、私。年下の子の前で。', '……你这样说，我会哭的啊。……呵呵。我真不行。在比自己小的孩子面前。', '...If you say things like that, I will cry. ...Hehe. Hopeless, me. In front of someone younger.'),
          nar('她没有哭。她把凉掉的红茶喝完了，然后叫了两杯新的。', 'She does not cry. She finishes the cold tea and orders two fresh cups.', outfitImg(M, '', 'happy'))
        ] },
      { id: 'm_rain_tell', zh: '「おばあさんのこと、もっと聞かせて。」', en: '"Tell me more about your grandmother."', jp: 'おばあさんのこと、もっと聞かせて。', hintZh: '让她说', hintEn: 'Let her talk',
        aff: 10, fam: 6, stat: 'charm',
        then: [
          nar('她讲了很久。奶奶的口头禅、奶奶腌的梅干、奶奶在每个房间门口挂的小风铃。雨停的时候，她才发现自己讲了一个小时。', 'She talks a long time. Her grandmother\'s sayings, her pickled plums, the little wind chimes she hung by every door. When the rain stops she realises she has talked for an hour.'),
          say(M, '', 'happy', '……ありがとう。祖母の話、誰かにするの初めて。……海風荘の風鈴、今度一緒に掛け直してくれる？', '……谢谢。第一次跟别人讲奶奶的事。……海风庄的风铃，下次能和我一起重新挂上吗？', '...Thank you. It is the first time I have told anyone about her. ...Will you help me rehang the wind chimes at Umikaze-so?')
        ] }
    ]),
    end(M, 5, 3, '雨天的下午茶和奶奶的故事', 'A rainy afternoon tea and her grandmother\'s story')
  ]
};

// ==========================================================
// 空
// ==========================================================
const EV_SORA_EXTRA: MapEventDef = {
  id: 'ev2_sora_extra', locationId: 'gym', chars: [S], priority: 8,
  titleZh: '加练', titleEn: 'Extra Practice',
  requiresFlags: ['day1_met_sora'], minFamiliarity: { [S]: 50 },
  script: [
    scene('basketball_gym_sunset', '体育馆', 'The Gym', '放学后 · 体育馆', 'After school · The gym'),
    nar('部活结束一个小时了，体育馆里还有球声。空一个人在罚球线上，投一个，捡回来，再投一个。地上的计数板写着：二百一十三。', 'Practice ended an hour ago and there is still a ball bouncing. Sora alone at the free-throw line: shoot, retrieve, shoot. A tally board on the floor reads two hundred and thirteen.'),
    say(S, '', 'surprised', 'おっ、ええとこ来たな。リバウンド拾ってくれ。三百本まであと八十七や。', '哦，来得正好。帮我捡篮板。离三百个还差八十七。', 'Oh, good timing. Grab rebounds for me. Eighty-seven to go till three hundred.'),
    nar('你捡了八十七个球。她投进了七十一个。每投进一个，她就在嘴里小声数一个数，数得很认真，像在念一段咒语。', 'You retrieve eighty-seven balls. She makes seventy-one. With each make she mutters the count under her breath, very seriously, like an incantation.', outfitImg(S, '', 'neutral')),
    choice(S, '最后一个球进了。她喘着气坐在地上，把一瓶水扔给你。', 'The last one drops. She sits down on the floor panting and throws you a bottle of water.', [
      { id: 's_extra_why', zh: '「なんでそんなに練習するの？」', en: '"Why practise so much?"', jp: 'なんでそんなに練習するの？', hintZh: '问她', hintEn: 'Ask her',
        aff: 5, fam: 8, stat: 'guts',
        then: [
          say(S, '', 'neutral', '才能ないからや。……いや、ほんまやで。中学の時、うちより上手いやつなんかなんぼでもおった。そいつらがやめた後も、うちだけ続けた。それだけや。', '因为没天赋。……不，是真的。初中的时候，比我厉害的人多得是。他们放弃之后，只有我还在继续。就这样。', 'Because I have no talent. ...No, really. In middle school plenty were better than me. They quit; I kept going. That is all.'),
          say(S, '', 'happy', '……あんたも、そういうタイプちゃう？ 日本語。毎日やってるやろ。分かるで。', '……你也是那种类型吧？日语。每天都在练吧。我看得出来。', '...You are the same type, right? Japanese. You do it every day. I can tell.')
        ] },
      { id: 's_extra_shoot', zh: '「一本だけ、俺も投げていい？」', en: '"Can I take one shot too?"', jp: '一本だけ投げていい？', hintZh: '试试', hintEn: 'Have a go',
        aff: 6, fam: 6, stat: 'proficiency',
        then: [
          nar('你投了一个。球砸在篮板上弹回来，正好砸在她的脑门上。', 'You take a shot. It bounces off the backboard and lands squarely on her forehead.'),
          say(S, '', 'angry', 'いっ……！ ……あんた、わざとやろ。……ええわ、三百一本目にしといたる。外れやけどな！', '痛……！……你是故意的吧。……行吧，算第三百零一个。不过是没进的！', 'Ow...! ...You did that on purpose. ...Fine, that is number three hundred and one. A miss, mind!'),
          nar('她揉着脑门，可是笑得比投进三百个球的时候还开心。', 'She rubs her forehead, laughing harder than when she made three hundred.', outfitImg(S, '', 'happy'))
        ] }
    ]),
    end(S, 3, 5, '陪她捡了八十七个篮板', 'Eighty-seven rebounds for her')
  ]
};

const EV_SORA_RAMEN2: MapEventDef = {
  id: 'ev2_sora_ramen2', locationId: 'ramen_rekishi', chars: [S], priority: 8,
  titleZh: '第二家店的辩论', titleEn: 'The Second Shop Debate',
  requiresFlags: ['ev2_sora_extra', 'ev_ramen_sora'], minFamiliarity: { [S]: 90 },
  script: [
    scene('ramen_rekishi_exterior', '拉面「历史」', 'Ramen "Rekishi"'),
    nar('空站在另一家拉面店门口，双手抱胸，一脸严肃，像一个在客场比赛前观察对手的队长。', 'Sora stands outside a different ramen shop, arms folded, face grave, like a captain sizing up an away team.'),
    say(S, '', 'neutral', '……ここのスープ、豚骨と魚介のダブルらしいねん。うちの行きつけと、どっちが上か。今日、決着つける。付き合え。', '……听说这家的汤是猪骨加海鲜的双汤底。跟我常去那家，哪家更好。今天，决一胜负。陪我。', '...They say the broth here is a pork-and-seafood double. Which is better, this or my usual place. Today we settle it. You are coming.'),
    scene('ramen_rekishi_bowl', '拉面「历史」', 'Ramen "Rekishi"'),
    nar('拉面端上来。空先喝了一口汤，闭上眼睛，沉默了很久。久到你开始担心她是不是睡着了。', 'The bowls arrive. Sora sips the broth, closes her eyes and goes silent for so long you start to wonder if she has fallen asleep.', outfitImg(S, '', 'neutral')),
    say(S, '', 'sad', '……うまい。……悔しいけど、うまい。……あんたは、どっちがええ？ 正直に言えよ。', '……好吃。……虽然不甘心，但好吃。……你觉得哪家好？老实说。', '...Good. ...Annoyingly good. ...Which do you prefer? Be honest.'),
    choice(S, '她盯着你，像在等裁判吹哨。', 'She watches you like someone waiting for the referee\'s whistle.', [
      { id: 's_ramen2_old', zh: '「いつもの店。……お前と最初に行ったから。」', en: '"Your usual place. ...Because it is where we first went."', jp: 'いつもの店。最初に一緒に行ったから。', hintZh: '不只是味道', hintEn: 'Not only about taste',
        aff: 9, fam: 4, stat: 'charm',
        then: [
          say(S, '', 'shy', '……っ。それ、味の話ちゃうやろ。……反則や。……でも、うちもそう思う。', '……！那不是在说味道吧。……犯规。……不过，我也这么想。', '...! That is not about the taste. ...Foul. ...But I think so too.')
        ] },
      { id: 's_ramen2_new', zh: '「こっち。スープが深い。」老实评价', en: '"This one. The broth is deeper." Judge honestly', jp: 'こっち。スープが深い。', hintZh: '诚实的裁判', hintEn: 'An honest referee',
        aff: 5, fam: 8, stat: 'knowledge',
        then: [
          say(S, '', 'angry', 'くっ……！ ……せやな。認める。負けは負けや。……次、もっとうまい店探したる。あんたも付き合えよ。', '可恶……！……是啊。我承认。输了就是输了。……下次，我找一家更好吃的。你也得陪我。', 'Argh...! ...Yeah. I admit it. A loss is a loss. ...Next time I will find somewhere even better. And you are coming.')
        ] }
    ]),
    end(S, 4, 4, '拉面对决的裁判', 'Judge of the ramen showdown')
  ]
};

const EV_SORA_WALK: MapEventDef = {
  id: 'ev2_sora_walk', locationId: 'ikuta_road', chars: [S], priority: 8, timeSlots: ['night'],
  titleZh: '送她回家的路', titleEn: 'Walking Her Home',
  requiresFlags: ['ev2_sora_ramen2'], minAffection: { [S]: 100 },
  script: [
    scene('ikuta_road_night', '生田路', 'Ikuta Road', '夜 · 生田路', 'Night · Ikuta Road'),
    nar('生田路上，空背着那个大大的运动包，走在你旁边。晚上的路灯把你们的影子拉得很长，两个影子一会儿分开一会儿重叠。', 'On Ikuta Road Sora walks beside you with her big sports bag on her back. The streetlamps stretch your shadows long; they separate, overlap, separate again.'),
    say(S, '', 'neutral', '……送ってくれんでもええのに。うち、そこらの男より強いで。', '……不用送我也行的。我可比一般男生强。', '...You did not have to walk me home. I am stronger than most guys.'),
    nar('她说完，又往你这边靠了一点。运动包碰到了你的胳膊。', 'Having said it, she drifts a little closer. Her bag bumps your arm.', outfitImg(S, '', 'shy')),
    say(S, '', 'shy', '……でもな。こうやって誰かと帰るの、悪くないな。試合の帰り道って、いっつも一人やったから。勝っても、負けても。', '……不过啊。像这样跟谁一起回家，也不坏。比赛完回家的路，一直都是一个人。赢了也好，输了也好。', '...But, you know. Walking home with someone like this is not bad. After matches it was always alone. Win or lose.'),
    choice(S, '她家的楼就在前面了。', 'Her building is just ahead.', [
      { id: 's_walk_next', zh: '「次の試合の帰りも、送る。」', en: '"I will walk you home after the next match too."', jp: '次の試合の帰りも、送る。', hintZh: '约定', hintEn: 'A promise',
        aff: 11, fam: 3, stat: 'kindness',
        then: [
          say(S, '', 'happy', '……ほな、絶対勝たなあかんな。負けて帰る顔、あんたに見せたないし。……約束やで。', '……那就一定得赢了。输了回家的那张脸，不想给你看。……说好了哦。', '...Then I really have to win. I do not want you seeing my losing face. ...It is a promise.')
        ] },
      { id: 's_walk_bag', zh: '「その鞄、持つよ。」', en: '"Let me carry that bag."', jp: 'その鞄、持つよ。', hintZh: '帮她', hintEn: 'Help her',
        aff: 9, fam: 5, stat: 'guts',
        then: [
          nar('她犹豫了一下，把包递给你。包重得惊人，你差点没拿住。她在旁边笑，笑完了小声说："……ありがとな。重いやろ、うちの毎日。"', 'She hesitates, then hands it over. It is shockingly heavy; you nearly drop it. She laughs, then says quietly: ...thanks. Heavy, huh. That is my every day.', outfitImg(S, '', 'shy'))
        ] }
    ]),
    end(S, 5, 3, '送她回家的那段路', 'The walk to her door')
  ]
};

// ==========================================================
// 奈绪
// ==========================================================
const EV_NAO_WEATHERCOCK: MapEventDef = {
  id: 'ev2_nao_weathercock', locationId: 'kitano_kazamidori_square', chars: [N], priority: 8,
  titleZh: '风向鸡指着哪儿', titleEn: 'Where the Weathercock Points',
  requiresFlags: ['ev_slope_nao'],
  script: [
    scene('kitano_kazamidori_square', '风见鸡馆前广场', 'The Weathercock House Square'),
    nar('风见鸡馆前面的广场上，奈绪坐在长椅上，仰着头看屋顶上的那只铜风向鸡。风一吹，它就转，转得有点犹豫。', 'On the square before the Weathercock House, Nao sits on a bench looking up at the copper weathercock on the roof. Each time the wind blows it turns, a little hesitantly.'),
    say(N, '', 'neutral', '……覚えてる？ 小さい頃、ここで「風見鶏が指したほうに引っ越す」って占いしたの。', '……还记得吗？小时候，我们在这里玩过"风向鸡指向哪边就搬去哪边"的占卜。', '...Remember? When we were little, we played "wherever the weathercock points, that is where you will move".'),
    say(N, '', 'sad', 'あんたの時、西を指したの。……で、本当に引っ越しちゃった。あたし、しばらくこの鶏、嫌いだった。', '轮到你的时候，它指向了西边。……然后你真的搬走了。我有一阵子，很讨厌这只鸡。', 'When it was your turn it pointed west. ...And you really did move away. For a while I hated this bird.'),
    nar('风向鸡转了半圈，停下来，指着你们坐的这条长椅。', 'The weathercock turns half round, stops, and points at the very bench you are sitting on.', outfitImg(N, '', 'surprised')),
    choice(N, '奈绪看着那只风向鸡，没说话。', 'Nao looks at the weathercock and says nothing.', [
      { id: 'n_cock_here', zh: '「今度は、ここを指してる。」', en: '"This time it is pointing here."', jp: '今度は、ここを指してる。', hintZh: '说出来', hintEn: 'Say it',
        aff: 8, fam: 3, stat: 'charm',
        then: [
          say(N, '', 'shy', '……偶然でしょ。風なんだから。……でも、まあ。今日はこの鶏、許してあげる。', '……偶然吧。是风嘛。……不过，算了。今天就原谅这只鸡吧。', '...Coincidence. It is the wind. ...But fine. Today I will forgive the bird.')
        ] },
      { id: 'n_cock_sorry', zh: '「あの時、ちゃんとさよなら言えなくてごめん。」', en: '"Sorry I never said goodbye properly back then."', jp: 'ちゃんとさよなら言えなくてごめん。', hintZh: '十年前的事', hintEn: 'Ten years ago',
        aff: 7, fam: 6, stat: 'kindness',
        then: [
          say(N, '', 'neutral', '……いいよ。十年遅れの「ごめん」、受け取った。……その代わり、次は「ただいま」から始めてよね。', '……没事。迟了十年的"对不起"，我收下了。……作为交换，下次就从"我回来了"开始说吧。', '...It is fine. A sorry ten years late, received. ...In exchange, next time start with "I am home".', [{ jp: 'ただいま', zh: '我回来了', en: 'I am home' }])
        ] }
    ]),
    end(N, 3, 2, '风向鸡这一次指着这里', 'This time the weathercock pointed here')
  ]
};

const EV_NAO_BIKE: MapEventDef = {
  id: 'ev2_nao_bike', locationId: 'school_bicycle_parking', chars: [N], priority: 8,
  titleZh: '自行车后座', titleEn: 'On the Back of Her Bike',
  requiresFlags: ['ev2_nao_weathercock'], minAffection: { [N]: 40 },
  script: [
    scene('school_bicycle_parking', '自行车停车场', 'The Bicycle Shed', '放学后 · 自行车停车场', 'After school · The bicycle shed'),
    nar('自行车停车场里，奈绪蹲在一辆自行车旁边，在给轮胎打气。打气筒每压一下，她的马尾就跳一下。', 'In the bike shed Nao crouches by a bicycle, pumping up a tyre. Every stroke of the pump bounces her ponytail.'),
    say(N, '', 'neutral', 'あ。……帰り？ ……乗ってく？ 二人乗り、校則違反だけど。坂の下までなら、誰も見てないし。', '啊。……回家？……要坐吗？虽然两人骑车违反校规。到坡下面的话，没人看见。', 'Oh. ...Heading home? ...Want a lift? Two on a bike is against the rules. But down to the bottom of the hill, nobody will see.'),
    choice(N, '她拍了拍后座。', 'She pats the rear rack.', [
      { id: 'n_bike_ride', zh: '坐上后座', en: 'Get on the back', hintZh: '违反校规', hintEn: 'Against the rules',
        aff: 9, fam: 4, stat: 'guts',
        then: [
          nar('下坡的时候风很大。她骑得很快，快到你不得不抓住她的腰。她没说什么，只是骑得更快了。', 'Downhill the wind is strong. She rides fast, so fast you have to hold her waist. She says nothing, only rides faster.', outfitImg(N, '', 'shy')),
          say(N, '', 'happy', '……昔もこうやって乗せたよね。あんたが泣いて、あたしが漕いで。……今は、あんたのほうが重いけど！', '……以前也这样载过你吧。你在哭，我在蹬。……不过现在，你重多了！', '...I used to give you rides like this. You crying, me pedalling. ...You are a lot heavier now, though!')
        ] },
      { id: 'n_bike_swap', zh: '「俺が漕ぐ。お前が後ろ。」', en: '"I will pedal. You on the back."', jp: '俺が漕ぐ。後ろ乗って。', hintZh: '换过来', hintEn: 'Swap round',
        aff: 10, fam: 3, stat: 'charm',
        then: [
          nar('她愣了一下，然后侧着坐上了后座，两只手抓着你的外套。你骑得摇摇晃晃，她在后面一直在指挥："右、右！ブレーキ！ ……ばか、こわい！"', 'She hesitates, then perches side-saddle on the rack, both hands clutching your jacket. You wobble all the way, and she directs from behind: right, right! Brake! ...Idiot, that was scary!'),
          say(N, '', 'shy', '……あんたの後ろに乗るの、初めて。……悪くない、かも。', '……坐在你后面，还是第一次。……可能，不坏。', '...First time I have ridden behind you. ...Not bad. Maybe.')
        ] }
    ]),
    end(N, 4, 3, '坡道上的二人乘', 'Two on a bike down the hill')
  ]
};

const EV_NAO_BRIDGE: MapEventDef = {
  id: 'ev2_nao_bridge', locationId: 'akashi_bridge', chars: [N], priority: 8, timeCost: 2,
  titleZh: '看得见对岸的地方', titleEn: 'Where You Can See the Other Shore',
  requiresFlags: ['ev2_nao_bike'], minAffection: { [N]: 100 },
  script: [
    scene('akashi_kaikyo_bridge', '明石海峡大桥', 'The Akashi Kaikyō Bridge'),
    nar('明石海峡大桥底下的海滨公园。奈绪站在防波堤的尽头，看着对岸的淡路岛。桥很长，长到对面那一头像是在另一个国家。', 'The seaside park beneath the Akashi bridge. Nao stands at the end of the breakwater looking across at Awaji. The bridge is so long the far end seems to belong to another country.'),
    say(N, '', 'neutral', '三月になったら、あんた帰るんだよね。……海の向こう。この橋より、ずっと遠いとこ。', '到了三月，你就要回去了吧。……海的那边。比这座桥远得多的地方。', 'In March you go back, right. ...Across the sea. Much further than this bridge.'),
    nar('她把手里的小本子打开，又合上。', 'She opens her little notebook and closes it again.', outfitImg(N, '', 'sad')),
    say(N, '', 'sad', '……十年前は、何も言えなかった。子どもだったから。……今度は、ちゃんと言いたいの。行かないで、じゃなくて。……待ってる、って。', '……十年前，什么都没能说。因为是小孩子。……这一次，我想好好说出来。不是"别走"。……是"我等你"。', '...Ten years ago I could not say anything. I was a kid. ...This time I want to say it properly. Not "do not go". ...But "I will wait".'),
    choice(N, '海风把她的马尾吹得乱七八糟。', 'The sea wind blows her ponytail every which way.', [
      { id: 'n_bridge_back', zh: '「今度は、必ず帰ってくる。」', en: '"This time I will definitely come back."', jp: '今度は、必ず帰ってくる。', hintZh: '约定', hintEn: 'A promise',
        aff: 13, fam: 3, stat: 'guts',
        then: [
          say(N, '', 'shy', '……必ず、ね。あたし、メモしとくから。日付も、場所も、あんたの顔も。……破ったら、一生許さない。', '……一定哦。我会记下来的。日期，地点，还有你的脸。……要是食言，一辈子不原谅你。', '...Definitely. I am writing it down. The date, the place, your face. ...Break it and I will never forgive you.')
        ] },
      { id: 'n_bridge_together', zh: '「待たなくていい。一緒に来てほしい。」', en: '"You do not have to wait. I want you to come with me."', jp: '待たなくていい。一緒に来てほしい。', hintZh: '另一种回答', hintEn: 'Another answer',
        aff: 12, fam: 4, stat: 'charm',
        then: [
          say(N, '', 'surprised', '……え。……なにそれ。そんなの、メモ帳に書く欄、ないんだけど。', '……诶。……那是什么啊。这种事，我的本子上没有可以写的栏。', '...Eh. ...What is that. There is no column in my notebook for something like that.'),
          nar('她低下头，在本子的最后一页画了一条新的栏。画得歪歪扭扭的，因为她的手在抖。', 'She bends her head and draws a new column on the last page. It comes out crooked, because her hand is shaking.', outfitImg(N, '', 'shy'))
        ] }
    ]),
    end(N, 5, 3, '海峡边的约定', 'A promise by the strait')
  ]
};

// ==========================================================
// 真希
// ==========================================================
const EV_MAKI_RANK: MapEventDef = {
  id: 'ev2_maki_rank', locationId: 'sannomiya_arcade', chars: [K], priority: 9,
  titleZh: '排行榜保卫战', titleEn: 'Defending the Leaderboard',
  requiresFlags: ['ev_arcade_maki'], minFamiliarity: { [K]: 50 },
  script: [
    scene('sannomiya_arcade', '三宫游戏中心', 'The Sannomiya Arcade'),
    nar('音游机台前面围了一小圈人。真希坐在正中间，耳机亮着紫光，手指快得看不清。旁边站着一个戴帽子的大学生，脸色很难看。', 'A small crowd round the rhythm game. Maki in the middle, headphones glowing purple, fingers too fast to see. Beside her a university student in a cap, looking grim.'),
    say(K, 'punk', 'tease', 'せんぱい、ええとこ来た！ こいつな、ウチのランキング一位抜こうとしてんねん。……ほな、見とき。ウチがざぁこにする瞬間♡', '前辈，来得正好！这家伙想抢我的排行榜第一。……那，看好了。我把他变成杂鱼的瞬间♡', 'Senpai, perfect timing! This guy is trying to take my number one spot. ...So watch. The moment I make him a loser.'),
    nar('最后一首。分数一直在交替领先。最后十秒，真希的手指停了半拍——你看见她往你这边瞟了一眼。', 'Last song. The lead keeps swapping. In the final ten seconds Maki\'s fingers falter for half a beat — you see her glance your way.', outfitImg(K, 'punk', 'surprised')),
    choice(K, '她要输了。', 'She is about to lose.', [
      { id: 'k_rank_cheer', zh: '「真希、いける！」大声喊', en: '"Maki, you have got this!" Shout it', jp: '真希、いける！', hintZh: '喊她的名字', hintEn: 'Call her name',
        aff: 8, fam: 5, stat: 'guts',
        then: [
          nar('你喊出声的瞬间，她的手指又快了起来。最后一个音符落下，分数比对方高了十二分。周围的人都在鼓掌。', 'The moment you shout, her fingers speed up again. The last note lands and she is twelve points ahead. The onlookers applaud.'),
          say(K, 'punk', 'shy', '……今、名前で呼んだやろ。……ずるいわ。あれで勝てたん、ウチの実力ちゃうみたいやん。', '……刚才叫我名字了吧。……太狡猾了。那样赢的话，好像不是我自己的实力一样。', '...You just called me by my name. ...Unfair. Now it is like I did not win on my own.')
        ] },
      { id: 'k_rank_quiet', zh: '安静地看着她，相信她', en: 'Watch quietly and trust her', hintZh: '她能行', hintEn: 'She can do it',
        aff: 6, fam: 7, stat: 'kindness',
        then: [
          nar('你什么都没说。她又瞟了你一眼，你朝她点了点头。她转回去，最后十秒一个音符都没漏。赢了三分。', 'You say nothing. She glances at you again and you nod. She turns back and does not miss a note in the last ten seconds. She wins by three.'),
          say(K, 'punk', 'happy', 'ほらな！ ウチ最強や！ ……せんぱいが黙って見とったから、集中できたわ。……ちょっとだけな。', '看吧！我最强！……因为前辈默默看着，我才能集中。……就一点点。', 'See! I am the best! ...You watching quietly helped me focus. ...A little.')
        ] }
    ]),
    end(K, 3, 4, '排行榜第一保住了', 'The top spot defended')
  ]
};

const EV_MAKI_BUSK: MapEventDef = {
  id: 'ev2_maki_busk', locationId: 'ikuta_road', chars: [K], priority: 8, timeSlots: ['afternoon'],
  titleZh: '路边的三首歌', titleEn: 'Three Songs on the Street',
  requiresFlags: ['ev2_maki_rank'], minFamiliarity: { [K]: 90 },
  script: [
    scene('ikuta_road', '生田路', 'Ikuta Road'),
    nar('生田路的人行道上，真希抱着一把吉他坐在一个琴盒上。琴盒打开着，里面只有两枚十日元的硬币。没有人停下来。', 'On the Ikuta Road pavement Maki sits on a guitar case with a guitar in her lap. The case is open; inside are two ten-yen coins. Nobody is stopping.'),
    say(K, 'punk', 'pout', '……見んといてや。路上ライブ、初めてやねん。……ほんで、誰も聴いてへん。せんぱい以外。', '……别看啦。街头演出，第一次。……然后，没人听。除了前辈。', '...Do not look. First time busking. ...And nobody is listening. Except you.'),
    choice(K, '她的手指放在弦上，没有动。', 'Her fingers rest on the strings, not moving.', [
      { id: 'k_busk_sit', zh: '在她面前的地上坐下来：「一曲目、どうぞ。」', en: 'Sit on the ground in front of her: "First song, please."', jp: '一曲目、どうぞ。', hintZh: '当第一个观众', hintEn: 'Be the first audience',
        aff: 9, fam: 4, stat: 'kindness',
        then: [
          nar('她弹了。一开始很小声，弹到副歌的时候声音大了起来。第二首的时候，一个上班族停下来了。第三首的时候，停下来的有七个人。', 'She plays. Quietly at first; by the chorus louder. During the second song an office worker stops. By the third, seven people have.'),
          say(K, 'punk', 'shy', '……せんぱいが座ったからや。人って、誰か座ってたら、座るねん。……せんぱい、サクラの才能あるわ。', '……因为前辈坐下了。人啊，看到有人坐着，就会跟着坐。……前辈，你有当托儿的天赋。', '...It is because you sat down. People sit when they see someone sitting. ...You have a talent for being a plant, senpai.')
        ] },
      { id: 'k_busk_coin', zh: '往琴盒里放一枚五百日元的硬币', en: 'Put a five-hundred-yen coin in the case', hintZh: '真金白银', hintEn: 'Hard cash',
        aff: 7, fam: 5, stat: 'charm', setFlags: ['pay:500'],
        then: [
          say(K, 'punk', 'surprised', 'ご、五百円！？ ……アホちゃう？ ……ほな、五百円分、ちゃんと弾いたる。耳かっぽじって聴きや。', '五、五百日元？！……你是笨蛋吗？……那，我就好好弹够五百日元的份。洗耳恭听吧。', 'F-five hundred yen?! ...Are you stupid? ...Then I will play five hundred yen\'s worth. Clean out your ears.'),
          nar('她弹了三首。最后一首是一首你没听过的歌，她说是她自己写的，还没有名字。', 'She plays three songs. The last is one you have never heard. She says she wrote it herself, and it does not have a name yet.', outfitImg(K, 'punk', 'shy'))
        ] }
    ]),
    end(K, 4, 4, '街头的三首歌', 'Three songs on the street')
  ]
};

const EV_MAKI_OSAKA: MapEventDef = {
  id: 'ev2_maki_osaka', locationId: 'dotonbori', chars: [K], priority: 8, timeCost: 2,
  titleZh: '她的地盘', titleEn: 'Her Turf',
  requiresFlags: ['ev2_maki_busk'], minAffection: { [K]: 100 },
  script: [
    scene('osaka_dotonbori_canal', '道顿堀', 'Dōtonbori'),
    nar('道顿堀的霓虹灯映在运河里，固力果的跑步人永远在跑。真希在戎桥上等你，靠着栏杆，手里拿着两串章鱼烧。', 'Dōtonbori\'s neon shimmers in the canal; the Glico runner runs forever. Maki waits for you on Ebisu Bridge, leaning on the rail with two portions of takoyaki.'),
    say(K, 'punk', 'tease', 'ようこそ、ウチの地元へ♡ ……神戸の子に、本場のたこ焼き教えたるわ。', '欢迎来到我的地盘♡……让神户的孩子见识一下正宗的章鱼烧。', 'Welcome to my home turf! ...Time to teach a Kobe kid what real takoyaki is.'),
    nar('她带你走过一条又一条小巷，每一家店的老板都认识她，叫她"マキちゃん"。她在这里一点都不嚣张，跟谁都鞠躬，笑得像个小孩。', 'She leads you down alley after alley. Every shopkeeper knows her and calls her Maki-chan. Here she is not cocky at all; she bows to everyone and laughs like a little kid.', outfitImg(K, 'punk', 'happy')),
    say(K, 'punk', 'shy', '……ここの人らはな、ウチが生意気になる前から知ってんねん。……せんぱいに、生意気じゃないウチも見せたかってん。', '……这里的人啊，在我变嚣张之前就认识我了。……我想让前辈也看看，不嚣张的我。', '...People here knew me before I got cheeky. ...I wanted you to see the me who is not cheeky too.'),
    choice(K, '她的耳机没开。今天一次都没开过。', 'Her headphones are off. They have not been on once today.', [
      { id: 'k_osaka_both', zh: '「どっちの真希も、好きだよ。」', en: '"I like both Makis."', jp: 'どっちの真希も、好きだよ。', hintZh: '两个都是她', hintEn: 'Both are her',
        aff: 12, fam: 3, stat: 'charm',
        then: [
          say(K, 'punk', 'shy', '……っ！ ……ずるい。そんなん言われたら、生意気な顔できへんやん。……アホ。……ありがと。', '……！……狡猾。被你这么说，我就摆不出嚣张的脸了。……笨蛋。……谢谢。', '...! ...Unfair. When you say that I cannot do my cheeky face. ...Idiot. ...Thanks.')
        ] },
      { id: 'k_osaka_more', zh: '「もっと案内して。全部見たい。」', en: '"Show me more. I want to see all of it."', jp: 'もっと案内して。全部見たい。', hintZh: '她的全部', hintEn: 'All of her',
        aff: 10, fam: 5, stat: 'guts',
        then: [
          nar('她拉着你的手往下一条巷子走。走到一半，她发现自己在拉你的手，可是没有松开。', 'She pulls you by the hand into the next alley. Halfway down she realises she is holding your hand, and does not let go.', outfitImg(K, 'punk', 'shy')),
          say(K, 'punk', 'happy', 'ほな、終電まで付き合ってもらうで！ ……全部見たいって言うたん、せんぱいやからな！', '那就陪我到末班车！……说想全部看完的，可是前辈你哦！', 'Then you are with me till the last train! ...You are the one who said you wanted to see it all!')
        ] }
    ]),
    end(K, 5, 3, '她带你看了她的地盘', 'She showed you her home turf')
  ]
};

export const CHAR_EVENTS: MapEventDef[] = [
  EV_ASUKA_TEA, EV_ASUKA_BENTO, EV_ASUKA_WINDOW,
  EV_HIKARI_ART, EV_HIKARI_BUDDY, EV_HIKARI_WHEEL,
  EV_REI_CARD, EV_REI_NOTE, EV_REI_SCHOOL,
  EV_INARI_LOOKOUT, EV_INARI_PANCAKE, EV_INARI_TORII,
  EV_MIYUKI_LAUNDRY, EV_MIYUKI_BOOK, EV_MIYUKI_RAIN,
  EV_SORA_EXTRA, EV_SORA_RAMEN2, EV_SORA_WALK,
  EV_NAO_WEATHERCOCK, EV_NAO_BIKE, EV_NAO_BRIDGE,
  EV_MAKI_RANK, EV_MAKI_BUSK, EV_MAKI_OSAKA
];
