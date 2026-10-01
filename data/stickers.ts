import { CharacterId } from '../types';

// ---------------------------------------------------------
// 📱 表情包（スタンプ）
//
// 两种：
//   · 角色贴图 —— 从她自己的表情差分裁出来的胸像（scripts/make-stickers.mjs），
//     只有她本人会发。字是她的口头禅，所以一看就知道是谁的。
//   · 通用贴图 —— 一个大 emoji 加一句话。玩家手里就是这一套，
//     她们偶尔也会用。
//
// jp 是贴在图上的那句话；zh / en 是意思。模型挑贴图的时候看的是 id + 意思，
// 玩家发贴图的时候，传给模型的也是这句话本身。
// ---------------------------------------------------------

export interface StickerDef {
  id: string;
  char?: CharacterId;
  img?: string;          // 角色贴图
  emoji?: string;        // 通用贴图
  tint?: string;         // 通用贴图的底色
  jp: string;
  zh: string;
  en: string;
}

const C = (char: CharacterId, expr: string, jp: string, zh: string, en: string): StickerDef =>
  ({ id: `${char}_${expr}`, char, img: `/images/stickers/${char}_${expr}.webp`, jp, zh, en });

const G = (id: string, emoji: string, tint: string, jp: string, zh: string, en: string): StickerDef =>
  ({ id, emoji, tint, jp, zh, en });

export const CHARACTER_STICKERS: StickerDef[] = [
  C(CharacterId.ASUKA, 'angry', 'はぁ！？', '哈啊！？', 'Excuse me!?'),
  C(CharacterId.ASUKA, 'happy', 'まあ、いいんじゃない', '……还行吧', 'I suppose that is fine'),
  C(CharacterId.ASUKA, 'sad', '……別に。', '……没什么。', '...It is nothing.'),
  C(CharacterId.ASUKA, 'shy', 'べ、別に！', '才、才不是！', 'I-it is not like that!'),
  C(CharacterId.ASUKA, 'smug', '当然でしょ', '那当然', 'Obviously'),
  C(CharacterId.ASUKA, 'surprised', 'ちょっ…！？', '喂……！？', 'Wh-what!?'),

  C(CharacterId.HIKARI, 'angry', 'むーっ！', '唔——！', 'Hmph!'),
  C(CharacterId.HIKARI, 'happy', 'やったー！', '太好啦！', 'Yay!'),
  C(CharacterId.HIKARI, 'sad', 'ぴえん…', '呜呜……', 'Sniff...'),
  C(CharacterId.HIKARI, 'shy', 'えへへ…', '嘿嘿……', 'Hehe...'),
  C(CharacterId.HIKARI, 'smug', 'ふふーん♪', '哼哼～♪', 'Heh heh~'),
  C(CharacterId.HIKARI, 'surprised', 'えぇーっ！？', '诶——！？', 'Whaaat!?'),

  C(CharacterId.REI, 'lecturing', '補足します', '我补充一下', 'Allow me to add'),
  C(CharacterId.REI, 'neutral', '了解', '收到', 'Understood'),
  C(CharacterId.REI, 'shy', '観測対象外です', '不在观测范围内', 'Outside the scope of observation'),
  C(CharacterId.REI, 'smile', '興味深い', '有意思', 'Interesting'),
  C(CharacterId.REI, 'thinking', '検討中…', '研究中……', 'Considering...'),

  C(CharacterId.INARI, 'angry', '無礼者！', '无礼之徒！', 'Insolence!'),
  C(CharacterId.INARI, 'curious', 'ほう？', '哦？', 'Oh?'),
  C(CharacterId.INARI, 'happy', '愉快じゃ♪', '有趣有趣♪', 'How delightful♪'),
  C(CharacterId.INARI, 'sly', '汝もワルよのう', '你也是个坏家伙呢', 'You are a wicked one too'),
  C(CharacterId.INARI, 'smug', '当然じゃ', '那是自然', 'Naturally'),
  C(CharacterId.INARI, 'surprised', 'なんと！', '什么！', 'What!'),
  C(CharacterId.INARI, 'sad', '寂しいのう', '真寂寞啊', 'How lonely'),

  C(CharacterId.MIYUKI, 'angry', 'めっ、よ', '不可以哦', 'No, no'),
  C(CharacterId.MIYUKI, 'happy', 'おつかれさま♪', '辛苦啦♪', 'Good work today♪'),
  C(CharacterId.MIYUKI, 'love', 'ありがとね♡', '谢谢你呀♡', 'Thank you♡'),
  C(CharacterId.MIYUKI, 'shy', 'あらあら…', '哎呀哎呀……', 'Oh my...'),
  C(CharacterId.MIYUKI, 'thinking', 'ちゃんと食べてる？', '有好好吃饭吗？', 'Are you eating properly?'),

  C(CharacterId.SORA, 'angry', 'なんでやねん！', '为什么啊！', 'Why though!'),
  C(CharacterId.SORA, 'cute', 'いけるいける！', '行的行的！', 'You got this!'),
  C(CharacterId.SORA, 'happy', 'ナイッシュー！', '好球！', 'Nice shot!'),
  C(CharacterId.SORA, 'love', '……サンキュな', '……谢啦', '...Thanks'),
  C(CharacterId.SORA, 'sad', 'しょぼーん', '垂头丧气', 'Bummed out'),
  C(CharacterId.SORA, 'shock', 'マジで！？', '真的假的！？', 'For real!?'),
  C(CharacterId.SORA, 'shy', '見んなや！', '别看啦！', 'Do not look!'),

  C(CharacterId.NAO, 'angry', 'アホか', '笨蛋吗你', 'Are you stupid'),
  C(CharacterId.NAO, 'curious', 'ほんで？', '然后呢？', 'And then?'),
  C(CharacterId.NAO, 'happy', 'ええやん！', '不错嘛！', 'Nice one!'),
  C(CharacterId.NAO, 'shy', '……知らん', '……不知道', '...Dunno'),
  C(CharacterId.NAO, 'smile', 'おつー', '辛苦～', 'Good job~'),

  C(CharacterId.MAKI, 'angry', 'は？ざこ', '哈？杂鱼', 'Huh? Weakling'),
  C(CharacterId.MAKI, 'happy', 'センパイ♡', '前辈♡', 'Senpai♡'),
  C(CharacterId.MAKI, 'laugh', 'ぷぷっ', '噗噗', 'Pfft'),
  C(CharacterId.MAKI, 'pout', 'むすー', '哼', 'Hmph'),
  C(CharacterId.MAKI, 'shy', 'ちゃ、ちゃうし！', '才、才不是！', 'I-it is not!'),
  C(CharacterId.MAKI, 'smug', 'ざぁこ♡', '杂～鱼♡', 'Weakling♡')
];

// 玩家手里那一套。顺序就是贴图面板里的顺序：最常用的在前面。
export const COMMON_STICKERS: StickerDef[] = [
  G('g_ok', '👌', 'from-emerald-400 to-teal-500', 'りょ！', '收到！', 'Got it!'),
  G('g_thanks', '🙏', 'from-amber-300 to-orange-400', 'ありがと！', '谢谢！', 'Thanks!'),
  G('g_sorry', '🙇', 'from-sky-300 to-indigo-400', 'ごめん！', '对不起！', 'Sorry!'),
  G('g_lol', '🤣', 'from-yellow-300 to-lime-400', '草', '笑死', 'LOL'),
  G('g_cry', '😭', 'from-blue-300 to-cyan-500', 'ぴえん', '呜呜', 'Waah'),
  G('g_yes', '🙆', 'from-pink-300 to-rose-400', 'いいよ！', '好呀！', 'Sure!'),
  G('g_no', '🙅', 'from-slate-300 to-slate-500', 'むり', '不行', 'Nope'),
  G('g_cheer', '💪', 'from-orange-400 to-red-500', 'がんばれ！', '加油！', 'You can do it!'),
  G('g_wow', '✨', 'from-fuchsia-300 to-purple-500', 'すごっ！', '好厉害！', 'Wow!'),
  G('g_what', '❓', 'from-zinc-300 to-zinc-500', 'え？', '诶？', 'Huh?'),
  G('g_think', '🤔', 'from-teal-300 to-emerald-500', 'うーん', '嗯……', 'Hmm'),
  G('g_hungry', '🍙', 'from-amber-200 to-yellow-400', '腹へった', '饿了', 'Starving'),
  G('g_sleepy', '😴', 'from-indigo-300 to-violet-500', 'ねむい…', '困了……', 'Sleepy...'),
  G('g_gm', '☀️', 'from-yellow-200 to-orange-300', 'おはよ', '早安', 'Morning'),
  G('g_gn', '🌙', 'from-indigo-400 to-slate-700', 'おやすみ', '晚安', 'Good night'),
  G('g_love', '💕', 'from-rose-300 to-pink-500', 'すき', '喜欢', 'Love it')
];

export const STICKERS: StickerDef[] = [...CHARACTER_STICKERS, ...COMMON_STICKERS];

export const stickerById = (id: string | undefined): StickerDef | undefined =>
  id ? STICKERS.find(s => s.id === id) : undefined;

// 她能发的：自己那一套 + 通用的。别人的脸她发不了。
export const stickersFor = (char: CharacterId): StickerDef[] =>
  [...CHARACTER_STICKERS.filter(s => s.char === char), ...COMMON_STICKERS];
