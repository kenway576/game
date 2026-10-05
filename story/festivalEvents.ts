import { CharacterId, ChatPick, StoryFlags, StoryNode, StoryOption } from '../types';
import { outfitImg, seenOutfitFlag, Mood } from '../data/outfitContext';
import { OUTFIT_REVEALS } from './outfitReveals';
import { SPEAKER } from '../data/dateData';

// ---------------------------------------------------------
// 🎃 万圣节（10/31）· 🎪 港见祭（11/1 – 11/2）
//
// 这两个日子是专门给"平时没理由穿的衣服"准备的：
//   万圣节 —— 明日香的骑士团长、稻荷的祭神之装（她说这不是变装）、
//             深雪被光逼着穿上的水手服、铃的白大褂（她说这也不是变装）、
//             奈绪的猫耳女仆、光的啦啦队服、真希那件本来就像变装的连帽衫。
//   文化祭 —— 二年B班的女仆咖啡（明日香、光、奈绪）、铃的天象仪、
//             篮球部的女仆咖啡（空猜拳输了三次）、混进来的稻荷、
//             舞台上的真希和光的应援、后夜祭的篝火。
//
// 剧本里出现过的衣服会记"看过了"，以后约会再穿就是一句带过。
// 每一段最后都让玩家挑一个人，接着跟她面对面聊——她还穿着那一身。
//
// 10/31 那天早上还有「文化祭前夜」可以选（一整天的通宵）。
// 选了通宵就去不了万圣节：这是故意的，一天只有一个晚上。
// ---------------------------------------------------------

type C = CharacterId;
const sp = (c: C) => SPEAKER[c];

const say = (c: C, outfit: string, mood: Mood, jp: string, zh: string, en: string): StoryNode => ({
  type: 'speech', speakerZh: sp(c).zh, speakerEn: sp(c).en, color: sp(c).color,
  characterImage: outfitImg(c, outfit, mood), jp, zh, en
});
const nar = (zh: string, en: string, img?: string): StoryNode =>
  ({ type: 'narration', zh, en, ...(img !== undefined ? { characterImage: img } : {}) });

// 衣服的亮相：先描写，再让她开口（用 outfitReveals 里那一句）
const reveal = (c: C, outfit: string, leadZh: string, leadEn: string): StoryNode[] => {
  const r = OUTFIT_REVEALS[c]?.[outfit];
  if (!r) return [];
  return [
    nar(leadZh, leadEn, outfitImg(c, outfit, 'neutral')),
    nar(r.lookZh, r.lookEn),
    say(c, outfit, r.line.mood, r.line.jp, r.line.zh, r.line.en),
    { type: 'effect', setFlags: [seenOutfitFlag(c, outfit)] }
  ];
};

const rel = (c: C, aff: number, fam: number, zh: string, en: string) =>
  ({ char: c, affection: aff, familiarity: fam, reasonZh: zh, reasonEn: en });

export interface FestivalBuild { script: StoryNode[]; picks: Record<string, ChatPick> }

// ==========================================================
// 🎃 北野坂的万圣节
// ==========================================================
const HALLOWEEN_COSTUME: Partial<Record<C, string>> = {
  [CharacterId.HIKARI]: 'sport',
  [CharacterId.ASUKA]: 'fantasy',
  [CharacterId.REI]: 'lab',
  [CharacterId.INARI]: 'goddess',
  [CharacterId.MIYUKI]: 'school',
  [CharacterId.NAO]: 'maid',
  [CharacterId.MAKI]: 'punk'
};

export const buildHalloween = (met: C[]): FestivalBuild => {
  const has = (c: C) => met.includes(c);
  const s: StoryNode[] = [
    { type: 'scene', scene: 'kitano_slope_night', bgm: 'festival', titleZh: '万圣节', titleEn: 'Halloween', subtitleZh: '十月三十一日 · 夜 · 北野坂', subtitleEn: '31 October · Night · Kitano-zaka' },
    nar('北野坂从下到上挤满了人。吸血鬼、南瓜、一只穿着西装的鲨鱼、三个一模一样的马里奥。异人馆的窗户里全点着南瓜灯，那些一百多年前的洋房像是终于等到了属于它们的那一天。',
      'Kitano-zaka is packed from bottom to top. Vampires, pumpkins, a shark in a suit, three identical Marios. Every window of the old foreign residences has a jack-o\'-lantern in it, as though those century-old houses have finally been given their day.', ''),
    nar('一个星期之前，光在群聊里发了一条消息：「三十一日、北野坂集合！仮装必須！しなかった人は罰ゲーム！」后面跟了十一个南瓜表情。你一直在想罚的是什么，想到最后决定还是不要知道了。',
      'A week ago Hikari posted in the group chat: Kitano-zaka on the 31st! Costumes compulsory! Anyone who does not dress up gets a forfeit! Followed by eleven pumpkin emoji. You spent a while wondering what the forfeit was, and decided in the end you would rather not know.')
  ];
  if (has(CharacterId.HIKARI)) s.push(
    ...reveal(CharacterId.HIKARI, 'sport', '坡道正中间，有个人在原地蹦，蹦得比周围所有人都高。', 'In the middle of the slope somebody is bouncing on the spot, higher than anyone around her.'),
    nar('你问她这是什么变装。她说是啦啦队。你说啦啦队不是变装。她想了三秒，说"ほな、ゾンビのチアや"，然后往脸上画了一道很假的伤疤。',
      'You ask what she has come as. A cheerleader, she says. You point out that a cheerleader is not a costume. She thinks for three seconds, says fine, a zombie cheerleader, and draws a very unconvincing scar on her cheek.')
  );
  if (has(CharacterId.ASUKA)) s.push(
    ...reveal(CharacterId.ASUKA, 'fantasy', '然后人群自己让开了一条路。', 'Then the crowd parts by itself.'),
    nar('据说这身是光去年在网上买的，买了之后发现自己穿不上——腰太细，靴子太长。明日香说她是"被迫"的，可是从她握剑柄的姿势来看，她在家里对着镜子练过。练过不止一次。',
      'Apparently Hikari bought it online last year and found she could not wear it: the waist too narrow, the boots too long. Asuka says she was forced. Judging by the way she holds the hilt, she has practised in front of a mirror. More than once.'),
    say(CharacterId.ASUKA, 'fantasy', 'shy', '……言っとくけど、写真撮ったら本当に斬るから。……一枚だけなら、まあ。', '……先说好，你要是拍照我真的会砍你。……一张的话，嘛。', '...I am warning you, take a photo and I really will cut you down. ...One. Maybe.')
  );
  if (has(CharacterId.REI)) s.push(
    ...reveal(CharacterId.REI, 'lab', '铃站在一盏路灯底下，白大褂被灯照得发亮。', 'Rei is standing under a street lamp, her lab coat glowing in its light.'),
    say(CharacterId.REI, 'lab', 'tease', 'マッドサイエンティストの仮装です。……普段の白衣と何が違うのか、と聞かれました。三回。答えは、心構えです。', '这是疯狂科学家的变装。……有人问我，这跟平时的白大褂有什么区别。被问了三次。答案是：心态。', 'I have come as a mad scientist. ...I have been asked three times how this differs from my usual lab coat. The answer is: attitude.')
  );
  if (has(CharacterId.INARI)) s.push(
    ...reveal(CharacterId.INARI, 'goddess', '坡道上方突然安静了一片。', 'Further up the slope, a patch of the crowd falls suddenly quiet.'),
    nar('周围的人都在拍她。有人问她是哪个游戏里的角色，有人问衣服在哪儿做的，还有一个外国游客双手合十，对着她鞠了一躬。她很认真地回了礼。',
      'Everybody around is photographing her. Someone asks which game she is from; someone asks where the costume was made; a foreign tourist puts his palms together and bows to her. She bows back, quite seriously.'),
    say(CharacterId.INARI, 'goddess', 'tease', '仮装ではない。……年に一度、人の子が化け物の格好で歩く夜じゃろう？ ならば、化け物が本来の姿で歩いても、誰も咎めまい。', '这不是变装。……一年一度，人类打扮成妖怪满街走的夜晚对吧？那么，妖怪以本来的样子走在街上，也没人会怪罪吧。', 'It is not a costume. ...One night a year, humans walk about dressed as monsters, do they not? Then surely nobody will object if a monster walks about as herself.')
  );
  if (has(CharacterId.MIYUKI)) s.push(
    ...reveal(CharacterId.MIYUKI, 'school', '光拽着一个人的手腕从人群里钻出来，那个人一路都在小声说"ちょっと、ちょっと"。', 'Hikari emerges from the crowd towing somebody by the wrist, somebody saying under her breath the whole way, wait, wait.'),
    nar('是光的主意。光说"大人が制服着るのが一番の仮装やん"，深雪说不出反驳的话，因为在逻辑上这完全成立。',
      'It was Hikari\'s idea. Hikari said a grown-up in a school uniform is the best costume there is, and Miyuki could find no answer, because logically it is entirely sound.')
  );
  if (has(CharacterId.NAO)) s.push(
    ...reveal(CharacterId.NAO, 'maid', '有人从背后拍了一下你的肩膀。', 'Somebody taps you on the shoulder from behind.'),
    nar('奈绪说她是黑猫。你说那为什么是女仆装。她说因为猫耳朵只有这一套配着。说完她自己也觉得这个理由不太充分，把发饰往下按了按。',
      'Nao says she is a black cat. You ask why a maid, then. Because this is the only outfit that came with ears, she says. Then she seems to feel that is not quite a sufficient reason and presses the headpiece down a little.')
  );
  if (has(CharacterId.MAKI)) s.push(
    ...reveal(CharacterId.MAKI, 'punk', '耳机的紫光在人群里一闪一闪地往你这边移。', 'A purple glow of headphones bobs through the crowd towards you.'),
    say(CharacterId.MAKI, 'punk', 'tease', '仮装？ してるやん。「ゲーセンから出てこられへんゾンビ」や。……普段と一緒やろって？ 普段からゾンビやねん、ウチ。', '变装？有啊。"从游戏厅里出不来的僵尸"。……你说跟平时一样？我平时就是僵尸啊。', 'Costume? I am wearing one. Zombie Who Never Left The Arcade. ...Same as usual, you say? I am always a zombie.')
  );
  s.push(
    nar('坡道顶上，风见鸡馆的风向鸡在夜空里转了半圈，停下来，指着海的方向。有人开始往下走，有人往上，人群像一条走不动的河。',
      'At the top of the slope the weathercock on the Kazamidori house turns half round in the night sky, stops, and points towards the sea. Some people start down, some up, and the crowd moves like a river that cannot quite flow.', '')
  );

  const picks: Record<string, ChatPick> = {};
  const opts: StoryOption[] = [];
  for (const c of met) {
    const outfit = HALLOWEEN_COSTUME[c];
    if (!outfit) continue;
    const flag = `halloween_with_${c}`;
    picks[flag] = {
      char: c, outfit, scene: 'kitano_slope_night',
      noteZh: `今天是万圣节，北野坂上全是变装的人。你穿着「${outfit}」那身作为变装，现在和主角两个人一起在坡道上慢慢走。`,
      noteEn: `It is Halloween night on Kitano-zaka, full of people in costume. You are wearing your "${outfit}" outfit as a costume, walking slowly up the slope with the player, just the two of you.`
    };
    opts.push({
      id: flag,
      labelZh: `和${sp(c).zh}一起往坡上走`, labelEn: `Walk up the slope with ${sp(c).en}`,
      hintZh: '人太多了，只能跟着一个人', hintEn: 'Too crowded to keep up with more than one',
      setFlags: [flag],
      relations: [rel(c, 5, 4, '万圣节的夜里，你跟着的是她', 'On Halloween night, she was the one you followed')],
      then: [nar(`你朝${sp(c).zh}那边挤过去。她看见你过来，没有往前走，在原地等你。`, `You push your way towards ${sp(c).en}. She sees you coming and waits where she is.`, outfitImg(c, outfit, 'happy'))]
    });
  }
  if (opts.length) {
    s.push({ type: 'choice', promptZh: '人潮要把你们冲散了。你跟着谁？', promptEn: 'The crowd is about to sweep you apart. Who do you follow?', options: opts });
  } else {
    s.push(nar('你一个人在坡道上走了一圈，买了一杯南瓜拿铁。明年，大概会有人跟你一起来。', 'You walk the slope alone and buy a pumpkin latte. Next year, probably, somebody will come with you.'));
  }
  s.push({ type: 'effect', setFlags: ['halloween_done'], effects: [{ stat: 'charm', amount: 3, reasonZh: '你在北野坂过了一个万圣节', reasonEn: 'You spent Halloween on Kitano-zaka' }] });
  return { script: s, picks };
};

// ==========================================================
// 🎪 港见祭 · 第一天
// ==========================================================
export const buildFestivalDay1 = (met: C[], flags: StoryFlags): FestivalBuild => {
  const has = (c: C) => met.includes(c);
  const s: StoryNode[] = [
    { type: 'scene', scene: 'kaisei_classroom_morning', bgm: 'festival', titleZh: '港见祭 · 第一天', titleEn: 'Minatomi Festival · Day One', subtitleZh: '十一月一日 · 二年B班 · 早上', subtitleEn: '1 November · Class 2-B · Morning' },
    {
      type: 'branch', ifFlag: 'restday_group_festival_eve',
      then: [nar('那条歪歪的纸箱商店街还立在教室中间。第三层用胶带缠了一圈又一圈，看上去像是受过伤、又被好好包扎过。你看着它，想起了凌晨三点。', 'The crooked cardboard shopping street is still standing in the middle of the classroom, its third tier wound round and round with tape, like something that was hurt and then properly bandaged. Looking at it you remember three in the morning.', '')],
      otherwise: [nar('教室中间立着一条纸箱糊成的商店街，有点歪。听说是几个人通宵做出来的，第三层塌过一次。', 'A shopping street made of cardboard boxes stands in the middle of the classroom, slightly crooked. Apparently a few people stayed up all night on it, and the third tier collapsed once.', '')]
    },
    nar('二年B班的摊位叫「みなとみ亭」：纸箱商店街的尽头，是一间女仆咖啡。菜单是明日香定的，价格是铃算的，装饰是光贴的——贴得太多了，墙上已经看不出原来的颜色。',
      'Class 2-B\'s stall is called Minatomi-tei: at the end of the cardboard street there is a maid café. Asuka set the menu, Rei worked out the prices, Hikari did the decorations, far too many, so that you can no longer tell what colour the walls used to be.')
  ];
  if (has(CharacterId.ASUKA)) s.push(
    ...reveal(CharacterId.ASUKA, 'maid', '帘子后面传来一声很小的"……準備できた"。帘子拉开了。', 'From behind the curtain, a very small voice: ...ready. The curtain opens.'),
    say(CharacterId.ASUKA, 'maid', 'angry', 'ほら、あんたは会計！ ぼーっとしてないで！ ……お、お客様に聞こえるでしょ、大きい声出させないでよ。', '喏，你负责收银！别发呆！……会、会被客人听到的，别让我大声说话啊。', 'You, on the till! Stop gawping! ...The c-customers will hear, do not make me raise my voice.')
  );
  if (has(CharacterId.HIKARI)) s.push(
    ...reveal(CharacterId.HIKARI, 'maid', '光从帘子后面直接跳了出来，裙摆还没落下去，人已经转了一圈。', 'Hikari bounds straight out from behind the curtain and is round in a full turn before her skirt has settled.')
  );
  if (has(CharacterId.NAO)) s.push(
    ...reveal(CharacterId.NAO, 'maid', '最后出来的是奈绪，出来之前在帘子后面站了很久。', 'Last out is Nao, after standing behind the curtain for a long time.')
  );
  if (has(CharacterId.REI)) s.push(
    ...reveal(CharacterId.REI, 'maid', '还有一个人没有出来。帘子后面传来很平的一句："計算上、このサイズは私に合いません。"明日香说那是长款，就是给你准备的。', 'One more has not come out. From behind the curtain, a very level voice: by my calculations this size does not fit me. Asuka says it is the long one, and it was chosen for her.'),
    nar('铃只在上午当班。下午她要回理科室，天文部的天象仪一点开演——她说两件事的时间她已经算好了，误差在三分钟以内。', 'Rei is only on the morning shift. In the afternoon she has to get back to the science lab; the astronomy club planetarium opens at one. She says she has worked out the timing of both, to within three minutes.')
  );
  s.push({
    type: 'choice',
    promptZh: '开门十分钟，门口就排起了队。你被分到——', promptEn: 'Ten minutes after opening there is a queue at the door. You have been assigned to—',
    options: [
      {
        id: 'fest1_till', labelZh: '收银台', labelEn: 'The till', jp: 'いらっしゃいませ。何名様ですか。',
        hintZh: '找零的时候要说敬语', hintEn: 'Change has to be given in keigo',
        words: [{ jp: '何名様', reading: 'なんめいさま', zh: '几位（客人）', en: 'how many in your party' }],
        effects: [{ stat: 'knowledge', amount: 3, reasonZh: '你用敬语找了一上午的零钱', reasonEn: 'A whole morning of giving change in keigo' }],
        relations: met.includes(CharacterId.ASUKA) ? [rel(CharacterId.ASUKA, 5, 4, '收银台一次都没算错', 'The till balanced, every time')] : [],
        then: [nar('一上午你说了大概两百遍"いらっしゃいませ"，到最后舌头已经自己会动了。中午结账，钱一分不差。明日香看了账本，什么都没说，但是给你倒了一杯咖啡——用的是招待客人的那种杯子。', 'You say welcome perhaps two hundred times in the morning, until your tongue does it on its own. At noon the takings balance to the yen. Asuka looks at the book and says nothing, but pours you a coffee, in one of the cups meant for customers.')]
      },
      {
        id: 'fest1_kitchen', labelZh: '后面的厨房做松饼', labelEn: 'The kitchen at the back, on pancakes',
        hintZh: '一块电烤盘，四十份订单', hintEn: 'One hotplate, forty orders',
        effects: [{ stat: 'proficiency', amount: 3, reasonZh: '四十块松饼，只烤焦了三块', reasonEn: 'Forty pancakes, only three burnt' }],
        relations: met.includes(CharacterId.NAO) ? [rel(CharacterId.NAO, 4, 5, '你烤焦的那三块，她偷偷吃掉了', 'She quietly ate the three you burnt')] : [],
        then: [nar('厨房是用两张课桌拼出来的，一块电烤盘，一个电风扇对着吹。你翻了四十块松饼，烤焦了三块。那三块后来不见了——奈绪说她什么都不知道，嘴角上沾着一点焦渣。', 'The kitchen is two desks pushed together, one hotplate and an electric fan pointed at it. You turn forty pancakes and burn three. The three later disappear. Nao says she knows nothing about it, with a fleck of charred batter at the corner of her mouth.')]
      },
      {
        id: 'fest1_sign', labelZh: '举着牌子在走廊上拉客', labelEn: 'Carry the sign up and down the corridor', jp: 'メイド喫茶、いかがですか！',
        hintZh: '要大声喊', hintEn: 'You will have to shout',
        effects: [{ stat: 'guts', amount: 3, reasonZh: '你在走廊上喊了一上午', reasonEn: 'You shouted up and down the corridor all morning' }],
        relations: met.includes(CharacterId.HIKARI) ? [rel(CharacterId.HIKARI, 5, 4, '你喊得比她还大声', 'You shouted louder than she does')] : [],
        then: [nar('牌子是光做的，上面画着一个女仆，长得有点像明日香，明日香没有发现。你一开始喊得很小声，后来光跑出来陪你一起喊，到中午，整条走廊都知道二年B班卖的是什么了。', 'Hikari made the sign. It has a maid on it who looks a little like Asuka; Asuka has not noticed. You start off quiet, then Hikari comes out and shouts with you, and by noon the whole corridor knows what 2-B is selling.')]
      }
    ]
  });

  s.push(
    { type: 'scene', scene: 'school_hallway_new' },
    nar('下午轮班结束。你把围裙还回去，走廊上全是人：卖章鱼烧的、算命的、鬼屋门口排队的。学校在这两天里变成了另一个地方，一个所有人都同意暂时不当学校的地方。',
      'The afternoon shift ends. You hand back your apron. The corridors are full: takoyaki, fortune-telling, a queue for the haunted house. For these two days the school has become another place, a place everybody has agreed for the time being not to treat as school.', '')
  );

  const picks: Record<string, ChatPick> = {};
  const opts: StoryOption[] = [];
  if (has(CharacterId.REI)) {
    picks.fest1_with_rei = {
      char: CharacterId.REI, outfit: 'lab', scene: 'school_science_lab',
      noteZh: '今天是港见祭（文化祭）第一天。你在理科室办了天文部的手工天象仪，穿着白大褂讲解。主角下午专门来看了，现在演出刚结束，理科室里只剩你们两个。',
      noteEn: 'It is day one of the school festival. You ran the astronomy club\'s handmade planetarium in the science lab, in your lab coat. The player came specially in the afternoon; the show has just ended and only the two of you are left in the lab.'
    };
    opts.push({
      id: 'fest1_with_rei', labelZh: '去理科室看天文部的天象仪', labelEn: 'The astronomy club planetarium in the science lab',
      hintZh: '门口写着"全手工"', hintEn: 'The sign says entirely handmade', setFlags: ['fest1_with_rei'],
      relations: [rel(CharacterId.REI, 6, 4, '你来看了她的天象仪', 'You came to see her planetarium')],
      then: [
        { type: 'scene', scene: 'school_science_lab' },
        ...reveal(CharacterId.REI, 'lab', '理科室的窗帘全拉上了，门口有人在发入场券。发券的人是铃。', 'Every curtain in the science lab is drawn and somebody at the door is handing out tickets. It is Rei.'),
        nar('天象仪是一个打满了小孔的黑色纸球，里面放着一只灯泡。灯一关，几百个光点落满了天花板、墙壁和观众的脸。铃站在中间，用很平的声音讲十一月的星空：飞马座、仙女座、还有一颗她说"目视很难看到、但确实在那里"的星。',
          'The planetarium is a black paper globe pricked full of holes with a bulb inside. When the lights go off, hundreds of points of light settle over the ceiling, the walls, the audience\'s faces. Rei stands in the middle and describes the November sky in a level voice: Pegasus, Andromeda, and a star she says is hard to see with the naked eye but is definitely there.', ''),
        say(CharacterId.REI, 'lab', 'shy', '……今日の最後の回です。観客は、あなた一人でした。……問題ありません。むしろ、好都合です。', '……这是今天最后一场。观众，只有你一个。……没有问题。倒不如说，正合适。', '...That was the last show today. The audience was you alone. ...That is no problem. If anything, it is convenient.')
      ]
    });
  }
  if (has(CharacterId.SORA)) {
    picks.fest1_with_sora = {
      char: CharacterId.SORA, outfit: 'maid', scene: 'kaisei_gym_interior',
      noteZh: '今天是港见祭第一天。篮球部办了女仆咖啡，你猜拳输了三次，被迫穿着女仆装接待客人。主角来了，你很不好意思但又有点高兴。',
      noteEn: 'Day one of the school festival. The basketball club is running a maid café and you lost rock-paper-scissors three times, so you are serving in a maid dress. The player has come; you are mortified and a little bit glad.'
    };
    opts.push({
      id: 'fest1_with_sora', labelZh: '去体育馆，篮球部好像也开了咖啡店', labelEn: 'The gym. The basketball club has a café too, apparently',
      hintZh: '听说有人猜拳输了', hintEn: 'Somebody lost at rock-paper-scissors, you hear', setFlags: ['fest1_with_sora'],
      relations: [rel(CharacterId.SORA, 6, 4, '你看见了她最不想被你看见的样子，而且没有笑', 'You saw her the way she least wanted you to, and did not laugh')],
      then: [
        { type: 'scene', scene: 'kaisei_gym_interior' },
        nar('篮球部的咖啡店开在体育馆一角，菜单只有两样：宝矿力，和"运动饮料（宝矿力）"。门口挂着一块牌子：「女子バスケ部 メイド喫茶」。', 'The basketball club café is in a corner of the gym. The menu has two items: Pocari Sweat, and "Sports Drink (Pocari Sweat)". The sign at the door says: Girls\' Basketball Club Maid Café.', ''),
        ...reveal(CharacterId.SORA, 'maid', '一个女仆背对着门，正在用一种投三分的姿势往杯子里倒饮料。她回过头，看见是你，整个人僵住了。', 'A maid with her back to the door is pouring a drink in the stance of somebody shooting a three. She turns, sees it is you, and freezes completely.'),
        say(CharacterId.SORA, 'maid', 'shy', '……ご、ご注文は。……ポカリか、ポカリや。早よ決めえ。', '……请、请问要点什么。……宝矿力，或者宝矿力。快点决定。', '...Wh-what will it be. ...Pocari, or Pocari. Hurry up.')
      ]
    });
  }
  if (has(CharacterId.MAKI)) {
    picks.fest1_with_maki = {
      char: CharacterId.MAKI, outfit: 'punk', scene: 'music_room',
      noteZh: '今天是港见祭第一天。你在音乐室的小舞台上弹了吉他，主角在最前排看完了整场。演出刚结束，你还很兴奋。',
      noteEn: 'Day one of the school festival. You played guitar on the little stage in the music room and the player watched the whole set from the front row. It has just finished and you are still buzzing.'
    };
    opts.push({
      id: 'fest1_with_maki', labelZh: '去音乐室，轻音部有演出', labelEn: 'The music room. The light-music club is playing',
      hintZh: '海报上写着"ウチを見に来い"', hintEn: 'The poster says: come and watch me', setFlags: ['fest1_with_maki'],
      relations: [rel(CharacterId.MAKI, 6, 4, '你站在第一排', 'You stood in the front row')],
      then: [
        { type: 'scene', scene: 'music_room' },
        ...reveal(CharacterId.MAKI, 'punk', '音乐室里挤了三十几个人，最前面的舞台是用几张课桌拼的。灯一暗，耳机的紫光先亮了起来。', 'Thirty-odd people crammed into the music room, a stage of pushed-together desks at the front. The lights drop and the purple glow of headphones comes up first.'),
        nar('真希弹得比你想象的好得多。第三首歌弹到一半，她的拨片飞了出去，正好落在你脚边。她没停，用手指弹完了剩下的半首，弹完朝你伸出手，意思是：还给我。', 'Maki plays far better than you expected. Halfway through the third song her pick flies off and lands right at your feet. She does not stop, finishes the song with her fingers, then holds out her hand to you: give it back.', ''),
        say(CharacterId.MAKI, 'punk', 'happy', '……見とった？ 最初から最後まで？ ……ふ、ふーん。まあ、当然やけどな！', '……看到了？从头到尾？……哼、哼——。嘛，当然的啦！', '...You watched? Start to finish? ...Hm, hmph. Well, obviously you did!')
      ]
    });
  }
  if (opts.length) {
    s.push({ type: 'choice', promptZh: '下午还有一点时间。去哪儿看看？', promptEn: 'A little of the afternoon left. Where to?', options: opts });
  }
  s.push({ type: 'effect', setFlags: ['festival_day1_done'] });
  return { script: s, picks };
};

// ==========================================================
// 🎪 港见祭 · 第二天（一般公开）+ 后夜祭
// ==========================================================
export const buildFestivalDay2 = (met: C[]): FestivalBuild => {
  const has = (c: C) => met.includes(c);
  const s: StoryNode[] = [
    { type: 'scene', scene: 'kaisei_courtyard_spring', bgm: 'festival', titleZh: '港见祭 · 第二天', titleEn: 'Minatomi Festival · Day Two', subtitleZh: '十一月二日 · 一般公开', subtitleEn: '2 November · Open to the public' },
    nar('第二天对外开放。校门口挂着一道气球拱门，拱门底下进来的人里有家长、有附近的小学生、有拿着相机的老人，还有一些你怎么看都不像应该出现在这里的人。',
      'Day two is open to the public. There is a balloon arch over the gate and through it come parents, local primary schoolers, old men with cameras, and a few people who by no stretch of the imagination ought to be here.', '')
  ];
  if (has(CharacterId.INARI)) s.push(
    ...reveal(CharacterId.INARI, 'school', '比如说，排在章鱼烧摊前面的那个女生。', 'For example, the girl at the front of the takoyaki queue.'),
    nar('没有人觉得奇怪。班主任从她身边走过去，还跟她点了点头。你很想知道名簿上现在到底写了什么。', 'Nobody finds it odd. Your form teacher walks past and nods to her. You would very much like to know what the register now says.')
  );
  if (has(CharacterId.MIYUKI)) s.push(
    nar('深雪是以"监护人"的身份来的。她拎着一大盒自己烤的饼干，说是慰问二年B班，然后在みなとみ亭坐下来，点了一杯咖啡，喝了整整一个小时。', 'Miyuki has come as a "guardian". She brings a big box of home-baked biscuits for 2-B, sits down in Minatomi-tei, orders one coffee and makes it last a full hour.', outfitImg(CharacterId.MIYUKI, '', 'happy')),
    say(CharacterId.MIYUKI, '', 'happy', 'ふふ、学園祭なんて何年ぶりかしら。……ね、あとで案内してくれる？ お姉さん、迷子になっちゃいそう。', '呵呵，学园祭是多少年没来过了呢。……呐，待会儿带我逛逛好吗？姐姐好像会迷路。', 'Hehe, how many years since I was at a school festival. ...Will you show me round later? I think I might get lost.')
  );
  if (has(CharacterId.HIKARI)) s.push(
    { type: 'scene', scene: 'kaisei_gym_interior' },
    ...reveal(CharacterId.HIKARI, 'sport', '体育馆的舞台上，应援部的表演正要开始。音乐响起来的时候，站在最前面中间那个位置的人，你认识。', 'On the gym stage the cheer squad is about to begin. When the music starts, the person in the front centre spot is someone you know.'),
    nar('表演的最后，三个人把她抛了起来。她在空中转了一圈，落下来的时候正好对着你的方向，喊了一声你的名字。全场的人都回头看你。', 'At the end three of them throw her into the air. She turns once, and when she comes down she is facing your way and shouts your name. The whole gym turns to look at you.')
  );

  const picks: Record<string, ChatPick> = {};
  const opts: StoryOption[] = [];
  const add = (c: C, outfit: string, label: [string, string], tour: StoryNode[]) => {
    const flag = `fest2_with_${c}`;
    picks[flag] = {
      char: c, outfit, scene: 'rooftop_sunset',
      noteZh: '今天是港见祭第二天，你和主角一起逛了一下午，又一起在后夜祭的篝火边跳了土风舞。现在篝火快熄了，你们俩在天台上往下看着操场。',
      noteEn: 'It is day two of the school festival. You spent the afternoon going round it with the player, then danced the folk dance together by the closing bonfire. The fire is dying down; the two of you are up on the roof looking down at the field.'
    };
    opts.push({
      id: flag, labelZh: label[0], labelEn: label[1], setFlags: [flag],
      hintZh: '后夜祭的土风舞，大概也会是她', hintEn: 'The closing folk dance will probably be with her too',
      relations: [rel(c, 6, 5, '文化祭的下午和后夜祭，你都跟她在一起', 'You spent the festival afternoon and the closing night with her')],
      then: tour
    });
  };
  if (has(CharacterId.INARI)) add(CharacterId.INARI, 'school', ['陪"新同学"稻荷逛一圈', 'Show the "new pupil" Inari around'], [
    nar('稻荷对每一个摊位都很感兴趣。她在鬼屋里笑出了声，把扮鬼的一年级生吓哭了；在占卜摊上，她替占卜的人算了一卦，算得对方脸色发白。', 'Inari is fascinated by every stall. In the haunted house she laughs aloud and makes the first-year playing the ghost cry. At the fortune-telling booth she reads the fortune-teller\'s fortune, and the girl goes pale.', outfitImg(CharacterId.INARI, 'school', 'tease')),
    say(CharacterId.INARI, 'school', 'happy', '人の子の祭りは、神を祀らぬ祭りじゃな。……ふふ、それがよい。今日の妾は、ただの生徒じゃからの。', '人类的祭典，是不祭神的祭典呢。……呵呵，这样很好。今天的妾身，只是一个普通学生。', 'A human festival that worships no god. ...Hehe, I like that. Today I am only a pupil.')
  ]);
  if (has(CharacterId.MIYUKI)) add(CharacterId.MIYUKI, '', ['带深雪逛文化祭', 'Take Miyuki round the festival'], [
    nar('深雪在每一个班的摊位前都停下来，买一点东西，说一句"がんばってね"。走了一圈，她两只手上全是袋子：章鱼烧、手工书签、一只歪歪扭扭的陶杯。', 'Miyuki stops at every class\'s stall, buys something and says do your best. By the end of a circuit her hands are full of bags: takoyaki, a handmade bookmark, a lopsided ceramic cup.', outfitImg(CharacterId.MIYUKI, '', 'happy')),
    say(CharacterId.MIYUKI, '', 'shy', '……高校生の頃ね、文化祭、誰とも回らなかったの。だから今日は、ちょっと取り返してる気分。', '……高中的时候啊，文化祭我没跟任何人一起逛过。所以今天，有种把它补回来的感觉。', '...When I was at school, I never went round the festival with anyone. So today it feels a little like getting it back.')
  ]);
  if (has(CharacterId.HIKARI)) add(CharacterId.HIKARI, 'sport', ['表演结束后去找光', 'Find Hikari after the performance'], [
    nar('光没换衣服，就那么穿着应援服拉着你满校园跑：先去吃了三班的炒面，又去看了一班的鬼屋，在鬼屋里她叫得比谁都响，出来以后说一点都不可怕。', 'Hikari does not change. She drags you all over the school still in her cheer uniform: yakisoba at class 3, the haunted house at class 1, where she screams louder than anybody and afterwards says it was not scary at all.', outfitImg(CharacterId.HIKARI, 'sport', 'happy')),
    say(CharacterId.HIKARI, 'sport', 'shy', 'さっき名前呼んだん、聞こえた？ ……あれな、練習ではやってへんねん。本番で、勝手に出てもうた。', '刚才叫你名字，听到了吗？……那个啊，练习的时候没有的。是正式表演时，自己喊出来的。', 'Did you hear me shout your name earlier? ...That was not in rehearsal. It just came out, on the day.')
  ]);
  if (has(CharacterId.ASUKA)) add(CharacterId.ASUKA, 'maid', ['等明日香换班，一起逛', 'Wait for Asuka\'s shift to end and go round together'], [
    nar('明日香换班的时候忘了换衣服。走到一半才发现，脸一下子红到耳朵，可是回去换又太远了，只好就这样走完了剩下的半圈。走廊上有人叫她"メイドの委員長"，她假装没听见。', 'Asuka forgets to change at the end of her shift. Halfway round she realises, goes red to the ears, but it is too far to go back, so she finishes the circuit as she is. Somebody in the corridor calls her the maid class rep. She pretends not to hear.', outfitImg(CharacterId.ASUKA, 'maid', 'shy')),
    say(CharacterId.ASUKA, 'maid', 'pout', '……笑いたければ笑えば。……笑わないの？ ……変なやつ。', '……想笑就笑吧。……不笑吗？……怪人。', '...Laugh if you want to. ...You are not laughing? ...Weirdo.')
  ]);
  if (has(CharacterId.NAO)) add(CharacterId.NAO, 'maid', ['拉奈绪出来透透气', 'Get Nao out for some air'], [
    nar('奈绪说她只出来十分钟，结果走了一个小时。她在每一个摊位前面都掏出那个小本子记点什么，你问她记什么，她说记"来年うちのクラスがやるときの参考"。', 'Nao says she will only come out for ten minutes and walks for an hour. At every stall she takes out the little notebook and writes something down. You ask what. Notes for when our class does it next year, she says.', outfitImg(CharacterId.NAO, 'maid', 'tease')),
    say(CharacterId.NAO, 'maid', 'shy', '……来年、あんたいないんだっけ。……じゃあこのメモ、誰に見せればいいんだろ。', '……明年，你就不在了吧。……那这些笔记，要给谁看才好呢。', '...You will not be here next year, will you. ...Then who am I supposed to show these notes to.')
  ]);
  if (has(CharacterId.MAKI)) add(CharacterId.MAKI, 'punk', ['陪真希把所有游戏摊位都打一遍', 'Help Maki clear every game stall'], [
    nar('射击、套圈、打地鼠、一年级做的手工电子游戏。真希每一个都打通了，奖品抱了满怀，最后全塞给了路过的小学生。', 'Shooting gallery, ring toss, whack-a-mole, a homemade video game the first-years built. Maki clears every one, ends up with an armful of prizes, and hands the lot to passing primary schoolers.', outfitImg(CharacterId.MAKI, 'punk', 'tease')),
    say(CharacterId.MAKI, 'punk', 'shy', '景品はどうでもええねん。……勝つとこ、せんぱいに見せたかっただけや。', '奖品什么的无所谓啦。……只是想让前辈看到我赢的样子而已。', 'I do not care about the prizes. ...I just wanted you to see me win.')
  ]);

  if (opts.length) s.push({ type: 'choice', promptZh: '下午，和谁一起逛？', promptEn: 'Who do you spend the afternoon with?', options: opts });

  s.push(
    { type: 'scene', scene: 'classroom_sunset', bgm: 'reflective', titleZh: '后夜祭', titleEn: 'The Closing Night', subtitleZh: '十一月二日 · 夜 · 操场', subtitleEn: '2 November · Night · The field' },
    nar('天黑以后，操场中间点起了一堆篝火。所有的纸箱、招牌、写坏了的海报，都被一样一样地放进火里。你看见那条纸箱商店街的第三层也进去了，烧得很快，像是终于可以休息了。',
      'After dark a bonfire is lit in the middle of the field. All the cardboard, the signs, the spoilt posters go into it one by one. You see the third tier of the cardboard street go in too. It burns quickly, as if it has finally been allowed to rest.', ''),
    nar('广播里放起了《Oklahoma Mixer》。按照港见高中不知道哪一年定下来的传统，后夜祭的最后一支土风舞，要跟一个人跳到底，不换舞伴。',
      'The speakers start playing the Oklahoma Mixer. By a Minatomi High tradition nobody can date, the last folk dance of the closing night is danced with one partner all the way through, no changing.')
  );
  // 跟谁跳：就是下午一起逛的那个人。每个选项的 flag 都挂一段，branch 一个个判
  for (const op of opts) {
    const c = (picks[op.id] as ChatPick).char;
    const outfit = (picks[op.id] as ChatPick).outfit;
    s.push({
      type: 'branch', ifFlag: op.id,
      then: [
        nar(`${sp(c).zh}走到你面前，伸出了手。火光在她身上一晃一晃的。`, `${sp(c).en} comes over and holds out her hand. The firelight sways across her.`, outfitImg(c, outfit, 'shy')),
        nar('舞步很简单，你在体育课上学过，可是第一个转身你就踩到了她的脚。她没说话，只是把你的手握紧了一点，让你跟着她的节奏。第二圈的时候，你们终于踩在了同一个拍子上。',
          'The steps are simple; you learned them in PE. But on the first turn you tread on her foot. She says nothing, only grips your hand a little tighter so you follow her timing. By the second time round you are finally on the same beat.')
      ]
    });
  }
  s.push(
    { type: 'scene', scene: 'rooftop_sunset' },
    nar('音乐停了以后，你们俩谁都没回教室，爬上了天台。从这儿看下去，篝火只剩下一小团橘红色，围着它的人影小得像一圈慢慢散开的蚂蚁。',
      'When the music stops neither of you goes back to the classroom. You climb up to the roof. From here the bonfire is a small orange glow, and the figures around it look like a ring of ants slowly drifting apart.', ''),
    { type: 'effect', setFlags: ['festival_day2_done'], effects: [{ stat: 'charm', amount: 3, reasonZh: '港见祭的两天', reasonEn: 'Two days of the Minatomi Festival' }, { stat: 'kindness', amount: 2, reasonZh: '后夜祭最后一支舞', reasonEn: 'The last dance of the closing night' }] }
  );
  return { script: s, picks };
};
