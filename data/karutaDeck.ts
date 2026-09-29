import { CollectedWord } from '../types';

// ==========================================================
// 🎴 歌留多的牌
//
// 牌组先从玩家自己的单词本里抽——那是这个人这一年里一个词一个词攒下来的，
// 用它来打牌，等于在不知不觉中把单词本复习了一遍。
// 单词本不够一副牌的时候，用下面这六十四张 N3 常用词补齐。
// 挑词的原则：这游戏里真的会碰到的（坂道、改札、割り勘、締め切り）。
//
// 每张牌三种"念法"，对应三档：
//   初级  念意思（中文/英文）   → 牌上有假名注音
//   中级  念读音（平假名）       → 牌上只有汉字
//   上级  念一个挖掉这个词的例句 → 牌上只有汉字
// ==========================================================

export interface KarutaCard {
  jp: string;
  reading?: string;
  zh: string;
  en: string;
  // 上级用的例句，"＿＿" 是挖掉的位置；没有的牌上级退回念读音
  ex?: string;
  mine?: boolean;   // 来自玩家自己的单词本
}

export const N3_DECK: KarutaCard[] = [
  { jp: '締め切り', reading: 'しめきり', zh: '截止日期', en: 'deadline', ex: 'レポートの＿＿は金曜日です。' },
  { jp: '予約', reading: 'よやく', zh: '预约', en: 'reservation', ex: 'レストランを＿＿しておいた。' },
  { jp: '行列', reading: 'ぎょうれつ', zh: '排队的人龙', en: 'queue', ex: 'パン屋の前に長い＿＿ができている。' },
  { jp: '迷子', reading: 'まいご', zh: '走失的孩子', en: 'lost child', ex: 'デパートで＿＿になった子を見つけた。' },
  { jp: '景色', reading: 'けしき', zh: '景色', en: 'scenery', ex: '屋上から見る＿＿は最高だ。' },
  { jp: '汗', reading: 'あせ', zh: '汗', en: 'sweat', ex: '坂道を上ったら、＿＿をかいた。' },
  { jp: '湯気', reading: 'ゆげ', zh: '热气', en: 'steam', ex: 'ラーメンから＿＿が立っている。' },
  { jp: '近所', reading: 'きんじょ', zh: '附近、邻里', en: 'neighbourhood', ex: '＿＿のスーパーは夜十時まで開いている。' },
  { jp: '忘れ物', reading: 'わすれもの', zh: '遗忘的东西', en: 'something left behind', ex: '電車に＿＿をしてしまった。' },
  { jp: '両替', reading: 'りょうがえ', zh: '换钱', en: 'currency exchange', ex: '空港で＿＿をした。' },
  { jp: '割り勘', reading: 'わりかん', zh: 'AA制', en: 'splitting the bill', ex: '今日の食事は＿＿にしよう。' },
  { jp: '寝坊', reading: 'ねぼう', zh: '睡过头', en: 'oversleeping', ex: '＿＿して、一時間目に遅れた。' },
  { jp: '留守', reading: 'るす', zh: '不在家', en: 'being out', ex: '電話したけど、＿＿だった。' },
  { jp: '引っ越し', reading: 'ひっこし', zh: '搬家', en: 'moving house', ex: '来月、＿＿をする予定だ。' },
  { jp: '手続き', reading: 'てつづき', zh: '手续', en: 'procedure', ex: '区役所で住所の＿＿をした。' },
  { jp: '天気予報', reading: 'てんきよほう', zh: '天气预报', en: 'weather forecast', ex: '＿＿によると、明日は雨だ。' },
  { jp: '渋滞', reading: 'じゅうたい', zh: '堵车', en: 'traffic jam', ex: '事故のせいで、道が＿＿している。' },
  { jp: '満員', reading: 'まんいん', zh: '满员', en: 'packed full', ex: '朝の電車はいつも＿＿だ。' },
  { jp: '窓口', reading: 'まどぐち', zh: '窗口', en: 'service counter', ex: '切符は二番の＿＿で買ってください。' },
  { jp: '領収書', reading: 'りょうしゅうしょ', zh: '收据', en: 'receipt', ex: '＿＿をください。' },
  { jp: '坂道', reading: 'さかみち', zh: '坡道', en: 'slope', ex: '家まで長い＿＿を上る。' },
  { jp: '夜景', reading: 'やけい', zh: '夜景', en: 'night view', ex: '摩耶山から見る＿＿はとても有名だ。' },
  { jp: '港', reading: 'みなと', zh: '港口', en: 'harbour', ex: '＿＿に大きな船が泊まっている。' },
  { jp: '神社', reading: 'じんじゃ', zh: '神社', en: 'shrine', ex: 'お正月に＿＿へお参りに行く。' },
  { jp: '祭り', reading: 'まつり', zh: '祭典', en: 'festival', ex: '夏の＿＿で金魚すくいをした。' },
  { jp: '花火', reading: 'はなび', zh: '烟花', en: 'fireworks', ex: '海の上に＿＿が上がった。' },
  { jp: '浴衣', reading: 'ゆかた', zh: '浴衣', en: 'yukata', ex: '＿＿を着て夏祭りに行く。' },
  { jp: '自動販売機', reading: 'じどうはんばいき', zh: '自动售货机', en: 'vending machine', ex: '駅前の＿＿でお茶を買った。' },
  { jp: '改札', reading: 'かいさつ', zh: '检票口', en: 'ticket gate', ex: '三宮駅の＿＿で待ち合わせよう。' },
  { jp: '乗り換え', reading: 'のりかえ', zh: '换乘', en: 'transfer', ex: '次の駅で＿＿です。' },
  { jp: '定期券', reading: 'ていきけん', zh: '月票', en: 'commuter pass', ex: '通学用の＿＿を買った。' },
  { jp: '部活', reading: 'ぶかつ', zh: '社团活动', en: 'club activities', ex: '放課後は＿＿で忙しい。' },
  { jp: '宿題', reading: 'しゅくだい', zh: '作业', en: 'homework', ex: '＿＿を出すのを忘れた。' },
  { jp: '成績', reading: 'せいせき', zh: '成绩', en: 'grades', ex: '今学期は＿＿が上がった。' },
  { jp: '自信', reading: 'じしん', zh: '自信', en: 'confidence', ex: '日本語に少し＿＿がついた。' },
  { jp: '緊張', reading: 'きんちょう', zh: '紧张', en: 'nerves', ex: '発表の前は、いつも＿＿する。' },
  { jp: '我慢', reading: 'がまん', zh: '忍耐', en: 'putting up with', ex: '痛いけど、もう少し＿＿して。' },
  { jp: '遠慮', reading: 'えんりょ', zh: '客气', en: 'holding back', ex: '＿＿しないで、たくさん食べてね。' },
  { jp: '約束', reading: 'やくそく', zh: '约定', en: 'promise', ex: '明日会うと＿＿した。' },
  { jp: '相談', reading: 'そうだん', zh: '商量', en: 'consultation', ex: '進路について先生に＿＿した。' },
  { jp: '経験', reading: 'けいけん', zh: '经验', en: 'experience', ex: 'アルバイトはいい＿＿になった。' },
  { jp: '習慣', reading: 'しゅうかん', zh: '习惯', en: 'habit', ex: '早起きは私の＿＿だ。' },
  { jp: '趣味', reading: 'しゅみ', zh: '爱好', en: 'hobby', ex: '私の＿＿は写真を撮ることです。' },
  { jp: '機嫌', reading: 'きげん', zh: '心情', en: 'mood', ex: '今日の明日香は＿＿が悪い。' },
  { jp: '素直', reading: 'すなお', zh: '坦率', en: 'honest, straightforward', ex: 'もっと＿＿になればいいのに。' },
  { jp: '真面目', reading: 'まじめ', zh: '认真', en: 'serious, diligent', ex: '彼は＿＿な学生だ。' },
  { jp: '大切', reading: 'たいせつ', zh: '珍贵', en: 'precious', ex: 'これは祖父からもらった＿＿な手帳だ。' },
  { jp: '懐かしい', reading: 'なつかしい', zh: '怀念的', en: 'nostalgic', ex: 'この歌を聞くと、＿＿気持ちになる。' },
  { jp: '恥ずかしい', reading: 'はずかしい', zh: '难为情', en: 'embarrassing', ex: 'みんなの前で転んで、＿＿。' },
  { jp: '眩しい', reading: 'まぶしい', zh: '耀眼', en: 'dazzling', ex: '朝日が＿＿。' },
  { jp: '詳しい', reading: 'くわしい', zh: '详细、精通', en: 'detailed, well-informed', ex: '神戸のことなら、鈴さんが＿＿。' },
  { jp: '賑やか', reading: 'にぎやか', zh: '热闹', en: 'lively', ex: '週末の商店街は＿＿だ。' },
  { jp: '静か', reading: 'しずか', zh: '安静', en: 'quiet', ex: '図書室はとても＿＿だ。' },
  { jp: '片付ける', reading: 'かたづける', zh: '收拾', en: 'to tidy up', ex: '使った道具を＿＿。' },
  { jp: '間に合う', reading: 'まにあう', zh: '赶得上', en: 'to be in time', ex: '走れば、まだ電車に＿＿。' },
  { jp: '見送る', reading: 'みおくる', zh: '送行', en: 'to see off', ex: '駅で友達を＿＿。' },
  { jp: '迷う', reading: 'まよう', zh: '迷路；犹豫', en: 'to get lost; to hesitate', ex: '初めての町で道に＿＿。' },
  { jp: '慌てる', reading: 'あわてる', zh: '慌张', en: 'to panic', ex: 'そんなに＿＿必要はないよ。' },
  { jp: '諦める', reading: 'あきらめる', zh: '放弃', en: 'to give up', ex: '夢を＿＿のは、まだ早い。' },
  { jp: '励ます', reading: 'はげます', zh: '鼓励', en: 'to encourage', ex: '落ち込んでいる友達を＿＿。' },
  { jp: '覚える', reading: 'おぼえる', zh: '记住', en: 'to memorise', ex: '毎日、単語を十個＿＿。' },
  { jp: '温める', reading: 'あたためる', zh: '加热', en: 'to warm up', ex: 'お弁当をレンジで＿＿。' },
  { jp: '預ける', reading: 'あずける', zh: '寄存', en: 'to leave in someone’s care', ex: '荷物をロッカーに＿＿。' },
  { jp: '詰める', reading: 'つめる', zh: '装满', en: 'to pack in', ex: 'お弁当にご飯を＿＿。' }
];

// 单词本里的一条 → 一张牌。格式是「温める（あたためる）」或者直接一个词。
// 玩家自己划选收藏的那种长句子不能做牌——牌上放不下，也不是"一个词"。
export const cardFromWordbook = (w: CollectedWord): KarutaCard | null => {
  const m = w.original.match(/^(.+?)（(.+?)）$/);
  const jp = (m ? m[1] : w.original).trim();
  const reading = m ? m[2].trim() : undefined;
  if (!jp || jp.length > 7 || /[\s、。！？!?.,a-zA-Z0-9]/.test(jp)) return null;
  if (!w.translation || w.translation.length > 24) return null;
  return { jp, reading, zh: w.translation, en: w.translation, mine: true };
};

export const buildDeck = (wordbook: CollectedWord[], size: number): KarutaCard[] => {
  const mine: KarutaCard[] = [];
  const seen = new Set<string>();
  for (const w of wordbook) {
    const c = cardFromWordbook(w);
    if (c && !seen.has(c.jp)) { seen.add(c.jp); mine.push(c); }
  }
  // 单词本里的词先上，但也不全用它——一半就够，另一半是这游戏认为你该认识的词
  const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const fromMine = shuffle(mine).slice(0, Math.ceil(size / 2));
  const rest = shuffle(N3_DECK.filter(c => !seen.has(c.jp))).slice(0, size - fromMine.length);
  return shuffle([...fromMine, ...rest]);
};
