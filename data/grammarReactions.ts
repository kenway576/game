import { CharacterId } from '../types';

// ==========================================================
// 🗣️ 说错了，对方怎么接（剧情里的「日语作答」，见 components/StoryScreen.tsx）
//
// 每个人对"你的日语说错了"的反应，就是她这个人：
//   明日香会纠正你，用红笔批改的那个口气；光不在乎，听懂了就开心；
//   铃会精确地指出哪里错了；稻荷觉得好玩；深雪温柔地替你说一遍；
//   空直来直去；奈绪根本没注意到小错（她自己也常说错）；真希会笑你。
// minor = 小错（意思还猜得出），major = 大错（对方没听懂，或者听成了别的意思）。
// {c} 会换成正确的那句。
// ==========================================================

export interface Reaction { jp: string; zh: string; en: string }
export interface ReactionSet { minor: Reaction; major: Reaction }

export const GRAMMAR_REACTIONS: Partial<Record<CharacterId, ReactionSet>> = {
  [CharacterId.ASUKA]: {
    minor: { jp: '……「{c}」、でしょ。ちゃんと言いなさいよね。', zh: '……是「{c}」吧。给我好好说。', en: '..."{c}", you mean. Say it properly.' },
    major: { jp: 'は？　何言ってるのか全然わかんないんだけど。……もしかして「{c}」ってこと？', zh: '哈？完全听不懂你在说什么。……难道你是想说「{c}」？', en: 'Huh? I have no idea what you just said. ...Do you mean "{c}"?' }
  },
  [CharacterId.HIKARI]: {
    minor: { jp: 'あ、「{c}」やね！　うんうん、伝わった伝わった！', zh: '啊，是「{c}」对吧！嗯嗯，听懂了听懂了！', en: 'Oh, "{c}"! Yep yep, got it!' },
    major: { jp: 'え、えっと……？　あ、もしかして「{c}」って言いたかった？', zh: '诶、那个……？啊，你是不是想说「{c}」？', en: 'Uh, um...? Oh, did you mean to say "{c}"?' }
  },
  [CharacterId.REI]: {
    minor: { jp: '……文法的には「{c}」が正確です。意味は通じますが。', zh: '……从语法上讲，「{c}」才准确。意思倒是能懂。', en: '...Grammatically, "{c}" is correct. The meaning still comes across.' },
    major: { jp: '……その文は成立していません。おそらく「{c}」と言いたいのでしょう。', zh: '……这句话不成立。你大概是想说「{c}」。', en: '...That sentence does not hold together. You probably meant "{c}".' }
  },
  [CharacterId.INARI]: {
    minor: { jp: 'ふふ、「{c}」と申すのじゃ。まあ、意は汲んだぞ。', zh: '呵呵，该说「{c}」才对。罢了，意思我领会了。', en: 'Heh. One says "{c}". Still, I caught your meaning.' },
    major: { jp: '……はて。そなたの言の葉は、わらわにも解せぬ。「{c}」かの？', zh: '……嗯？你这话，连我都解不开。是「{c}」吗？', en: '...Hm? Even I cannot untangle those words of yours. "{c}", perhaps?' }
  },
  [CharacterId.MIYUKI]: {
    minor: { jp: '「{c}」、ですね。ふふ、ちゃんと伝わっていますよ。', zh: '是「{c}」呢。呵呵，我听懂了哦。', en: '"{c}", yes? Don’t worry, it came across.' },
    major: { jp: 'あら……？　ごめんなさい、もう一度……あ、「{c}」ということかしら。', zh: '哎呀……？对不起，再说一遍……啊，是「{c}」的意思吗？', en: 'Oh...? I’m sorry, once more... ah, do you mean "{c}"?' }
  },
  [CharacterId.SORA]: {
    minor: { jp: '「{c}」な！　オッケー、わかったわかった。', zh: '「{c}」是吧！OK，懂了懂了。', en: '"{c}"! Okay, got it, got it.' },
    major: { jp: '……ん？　ごめん、今のどういう意味？　……あー、「{c}」？', zh: '……嗯？抱歉，刚才那句什么意思？……啊——是「{c}」？', en: '...Hm? Sorry, what did that mean? ...Ohh, "{c}"?' }
  },
  [CharacterId.NAO]: {
    // 奈绪自己也常说错，小错她根本听不出来
    minor: { jp: 'うんうん！', zh: '嗯嗯！', en: 'Mm-hm!' },
    major: { jp: 'えっ……？　……？　あ、「{c}」？　たぶん！', zh: '诶……？……？啊，是「{c}」？大概！', en: 'Huh...? ...? Oh, "{c}"? Probably!' }
  },
  [CharacterId.MAKI]: {
    minor: { jp: 'ぷっ、「{c}」やろ？　ざぁこ♡', zh: '噗，是「{c}」吧？杂鱼♡', en: 'Pfft, it’s "{c}", right? Loser♡' },
    major: { jp: 'は？　なんて？　……あー、「{c}」言いたいん？　日本語ヘタすぎやろ。', zh: '哈？说什么呢？……啊——你想说「{c}」？日语也太烂了吧。', en: 'Huh? What? ...Ohh, you mean "{c}"? Your Japanese is so bad.' }
  }
};

// 说话对象不是这八个人（店员、路人、老师……）
export const GENERIC_REACTION = {
  minor: { zh: '对方愣了半拍，还是听懂了。', en: 'They pause for half a beat, then get it.' },
  major: { zh: '对方一脸困惑地看着你，过了一会儿才猜出你想说什么。', en: 'They look at you, puzzled, and only after a moment work out what you meant.' }
};

// 剧本里的说话人名字 → 角色（只认这八个人）
export const SPEAKER_TO_CHAR: Record<string, CharacterId> = {
  '明日香': CharacterId.ASUKA, 'Asuka': CharacterId.ASUKA,
  '光': CharacterId.HIKARI, 'Hikari': CharacterId.HIKARI,
  '铃': CharacterId.REI, 'Rei': CharacterId.REI,
  '稻荷': CharacterId.INARI, 'Inari': CharacterId.INARI,
  '深雪': CharacterId.MIYUKI, 'Miyuki': CharacterId.MIYUKI,
  '空': CharacterId.SORA, 'Sora': CharacterId.SORA,
  '奈绪': CharacterId.NAO, 'Nao': CharacterId.NAO,
  '真希': CharacterId.MAKI, 'Maki': CharacterId.MAKI
};
