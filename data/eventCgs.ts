import { StoryNode } from '../types';

// ==========================================================
// 🎴 剧情事件 CG（邦多利卡面画风，scripts/remake/gen-event-cg-v3.mjs 出的图）
//
// 第③段那八张直接替换了原来的 cg_<角色>.webp，还挂在 CHARACTER_CGS 里，不在这张表上。
// 这里是其余的：每人①②、主线第 2–6 章和最终章、多人剧情、节日、修学旅行、修了式。
//
// 剧本里用 eventCgNode('asuka1') 插一个全屏 CG 节点；
// constants.ts 的 STORY_CGS 把这张表接进回忆图鉴（播过才解锁）。
// 这个文件不能 import constants——constants 自己 import 了剧本，会绕成一个圈。
// ==========================================================

export interface EventCgDef {
  id: string;
  titleZh: string; titleEn: string;
  captionZh: string; captionEn: string;
  chapterZh: string; chapterEn: string;
  // 图鉴里那一行引言（台词原文）
  quote: string;
}

const ev = (key: string, chapterZh: string, chapterEn: string, titleZh: string, titleEn: string, captionZh: string, captionEn: string, quote = ''): EventCgDef =>
  ({ id: `cg_ev_${key}`, titleZh, titleEn, captionZh, captionEn, chapterZh, chapterEn, quote });

export const EVENT_CGS: EventCgDef[] = [
  // ---- 专属剧情 ①② ----
  ev('asuka1', '明日香 · 第①段', 'Asuka · Part 1', '三百个假名', 'Three Hundred Furigana',
    '「只是顺手」——这几个字她说得很快，伸出去抢讲义的手却停在了半空。',
    '"I was doing it anyway," she says, much too fast, and the hand reaching for the handout stops in mid-air.', '「ついでよ、ついで！」'),
  ev('asuka2', '明日香 · 第②段', 'Asuka · Part 2', '第二名', 'Second Place',
    '雨里，她把那张写着「第二」的成绩单攥得发皱，眼眶红着，偏不肯掉一滴眼泪。',
    'In the rain she crushes the sheet that says second, eyes red, refusing to let a single tear fall.', '「……二位。」'),
  ev('hikari1', '光 · 第①段', 'Hikari · Part 1', '同一条船', 'The Same Boat',
    '她指着海的那一边，说家其实离这儿不远。她指的方向什么都没有，只有海和更远的海。',
    'She points across the water and says home is not that far. Where she points there is nothing but sea, and more sea.', '「大丈夫！すぐそこだよ！」'),
  ev('hikari2', '光 · 第②段', 'Hikari · Part 2', '先挥手的人', 'The One Who Waved First',
    '摩天轮转到最高处，你先朝她挥了手。她愣住了，眼泪比笑容先掉下来。',
    'At the top of the wheel you wave first. She freezes, and the tears arrive before the smile can.'),
  ev('rei1', '铃 · 第①段', 'Rei · Part 1', '一九〇四年', 'Nineteen Hundred and Four',
    '铅笔停在那一格上。重建过的东西还算不算原来那个——她第一次没能马上写下答案。',
    'The pencil rests on one box. Does a rebuilt thing still count as the original? For the first time, she cannot write the answer straight away.'),
  ev('rei2', '铃 · 第②段', 'Rei · Part 2', '九十八', 'Ninety-Eight',
    '她数了自己的心跳。九十八。这个读数，她解释不了。',
    'She counts her own pulse. Ninety-eight. It is a reading she cannot explain.', '「……九十八。」'),
  ev('inari1', '稻荷 · 第①段', 'Inari · Part 1', '千年的消遣', 'A Thousand Years to Kill',
    '林子里的石头上，九条尾巴不再藏了。她看着你，像在看一样很久没见过的东西。',
    'On the rock in the wood the nine tails are no longer hidden. She looks at you like something she has not seen in a very long time.', '「おや。今日は早いのう。」'),
  ev('inari2', '稻荷 · 第②段', 'Inari · Part 2', '会破的纸网', 'The Net That Tears',
    '一千年里她看过几万个孩子捞金鱼。她第一次伸手，网就破了。',
    'In a thousand years she has watched tens of thousands of children scoop for goldfish. The first time she tries, the paper tears.', '「……おい。これは、破れるものなのか。」'),
  ev('miyuki1', '深雪 · 第①段', 'Miyuki · Part 1', '门框上的手', 'The Hand on the Door Frame',
    '她送你到门口。扶着门框的那只手，紧了一下。',
    'She sees you to the door. The hand on the door frame tightens, just once.'),
  ev('miyuki2', '深雪 · 第②段', 'Miyuki · Part 2', '空着的那一栏', 'The Empty Line',
    '凌晨两点的阳台，一只凉掉的碗。她自己的紧急联络人那一栏，一直空着。',
    'Two in the morning on the balcony, a bowl gone cold. The emergency contact on her own form has always been blank.', '「……空欄。ずっとね。」'),
  ev('sora1', '空 · 第①段', 'Sora · Part 1', '交换条件', 'The Trade',
    '体育馆的地板上，她翻着单词书，第一次说出「也许我也学得会」。',
    'On the gym floor, leafing through the vocabulary book, she says for the first time that maybe she could learn this.', '「……できるようになるかも。」'),
  ev('sora2', '空 · 第②段', 'Sora · Part 2', '差五公分', 'Five Centimetres Short',
    '夜里的体育馆只亮着一盏灯。她说早就不疼了，只是够不到。',
    'One light on in the gym at night. It stopped hurting long ago, she says. She just cannot reach any more.', '「……治ってんのに、届かへん。」'),
  ev('nao1', '奈绪 · 第①段', 'Nao · Part 1', '过期的清单', 'The Expired List',
    '坡顶的矮墙上，她把关于你的事一条一条报出来。全对，全是十年前的。',
    'On the low wall at the top of the slope she recites everything she knows about you. All correct. All ten years old.'),
  ev('nao2', '奈绪 · 第②段', 'Nao · Part 2', '先笑的那个人', 'The One Who Laughed First',
    '那个关西腔的笑话，你先笑了。她没有笑。她没听懂。',
    'You laughed first at the Kansai joke. She did not laugh. She had not understood it.'),
  ev('maki1', '真希 · 第①段', 'Maki · Part 1', '第三局', 'The Third Round',
    '三局两胜，她已经赢了两局。第三局在规则上不存在。',
    'Best of three, and she has already won two. By the rules there is no third round.', '「……三戦目、やる？」'),
  ev('maki2', '真希 · 第②段', 'Maki · Part 2', '只是路过', 'Just Passing',
    'Live House 门口的台阶上，手机屏幕早就暗了。她说她只是路过。',
    'On the steps outside the live house, her phone screen long since gone dark. She was just passing, she says.'),

  // ---- 主线 ----
  ev('main2', '主线 · 第 2 章', 'Main Story · Chapter 2', '描了三遍的鸟居', 'The Torii Traced Three Times',
    '她在石阶上坐下，指着地图上一个已经不存在的地方。',
    'She sits down on the step and points to a place on the map that no longer exists.', '「ここな。うどん屋。もう無い。」'),
  ev('main3', '主线 · 第 3 章', 'Main Story · Chapter 3', '名字的帐', 'The Ledger of Names',
    '她把册子合上，放在膝盖上，两只手压着。',
    'She closes the book, rests it on her knees, and holds it down with both hands.', '「ある日から来なくなった。」'),
  ev('main4', '主线 · 第 4 章', 'Main Story · Chapter 4', '他在等谁', 'Who He Was Waiting For',
    '她把手伸出来，掌心朝上，要那本手账。',
    'She holds out her hand, palm up, for the journal.', '「お主も、いずれこれを書く。」'),
  ev('main5', '主线 · 第 5 章', 'Main Story · Chapter 5', '一九九五', 'Nineteen Ninety-Five',
    '鸟居底下，她一动不动地站着。柱脚那一圈接缝，颜色浅了一点点。',
    'She stands perfectly still under the torii. The seam around the base of the post is a shade paler.', '「この鳥居はな、一度倒れておる。」'),
  ev('main6', '主线 · 第 6 章', 'Main Story · Chapter 6', '同一条坡', 'The Same Hill',
    '她合上册子，站起来，第一次把手伸了出来。',
    'She closes the book, stands, and for the first time holds out her hand.', '「また来い。六十年以内にな。」'),
  ev('main_finale_1184', '主线 · 最终章', 'Main Story · Final Chapter', '寿永三年的梅', 'The Plum, 1184',
    '烧了一半的梅树底下，一条尾巴的小狐狸把一页单词本，夹进了还没有一个字的册子里。',
    'Under a half-burned plum tree, a fox with a single tail tucks a page from a vocabulary notebook into a book with no writing in it yet.', '「……そなた、名は。」'),
  ev('main_finale_inari', '主线 · 最终章', 'Main Story · Final Chapter', '待つ', 'To Wait',
    '天快亮的鸟居底下，她把八百年前的那张纸翻过来给你看。背面写着「待つ」。',
    'Under the torii just before dawn, she turns over the slip from eight hundred years ago. On the back it says: to wait.', '「……遅いぞ。」'),

  // ---- 多人 ----
  ev('group_ramen', '多人剧情 · 空 × 真希', 'Together · Sora × Maki', '八个座位，两个笨蛋', 'Eight Seats, Two Idiots',
    '八个座位的拉面店，两个都不肯输的人，中间那个空位是你的。',
    'A ramen shop with eight seats, two people who refuse to lose, and the empty seat between them is yours.'),
  ev('group_meriken', '多人剧情 · 光 × 铃 × 明日香', 'Together · Hikari × Rei × Asuka', '第二十七张', 'The Twenty-Seventh Shot',
    '拍了二十七次。这一张，四个人都在，港塔也在，而且没有人是黑的。',
    'Twenty-seven attempts. In this one all four of you are in it, the Port Tower too, and nobody is in shadow.'),
  ev('group_wheel', '多人剧情 · 奈绪 × 深雪 × 稻荷', 'Together · Nao × Miyuki × Inari', '一圈十分钟', 'Ten Minutes a Turn',
    '三个人，三种「等」的办法，看着山坡上同一扇亮着的窗。',
    'Three people, three ways of waiting, all looking at the same lit window on the hillside.'),

  // ---- 节日 / 修学旅行 / 修了式 ----
  ev('fest_halloween', '节日 · 万圣节', 'Festivals · Halloween', '北野坂的万圣夜', 'Halloween on Kitano-zaka',
    '异人馆的窗户里全是南瓜灯。有一个人坚持说，她这身不是变装。',
    'Every window in the old houses has a pumpkin lantern in it. One of them insists that hers is not a costume.'),
  ev('fest_day1', '节日 · 港见祭', 'Festivals · Minatomi Festival', '全手工的星空', 'A Handmade Sky',
    '打满小孔的黑色纸球，几百个光点落在天花板、墙上，和她的白大褂上。',
    'A black paper globe full of holes; hundreds of points of light on the ceiling, the walls and her lab coat.', '「……観客は、あなた一人でした。」'),
  ev('fest_bonfire', '节日 · 后夜祭', 'Festivals · Closing Night', '后夜祭', 'The Closing Night',
    '篝火把纸箱和海报一样一样吞下去。最后一支舞，要跟一个人跳到底。',
    'The bonfire swallows the cardboard and the posters one by one. The last dance is with one partner, all the way through.'),
  ev('trip_sea', '修学旅行 · 第二天', 'School Trip · Day Two', '十一月的海', 'The Sea in November',
    '冲绳的太阳落得比神户早。云的下面全是金的。',
    'The sun sets earlier in Okinawa than in Kobe. Everything under the clouds is gold.'),
  ev('trip_night', '修学旅行 · 第三天', 'School Trip · Day Three', '十点零四分', 'Four Minutes Past Ten',
    '有人问「那明年呢」，扑克牌停在了半空。',
    'Someone asks "and next year?", and the cards stop in mid-air.', '「じゃあ、来年は？」'),
  ev('year_end', '修了式', 'Closing Ceremony', '课桌上的刻痕', 'The Scratch on the Desk',
    '第二个月手滑划的那道痕，一直没有人修。',
    'The scratch you made by accident in your second month. Nobody ever fixed it.')
];

export const eventCgUrl = (id: string) => `/images/cg/${id}.webp`;

// 剧本里插一张：eventCgNode('asuka1')
export const eventCgNode = (key: string): StoryNode => {
  const d = EVENT_CGS.find(c => c.id === `cg_ev_${key}`);
  if (!d) throw new Error(`没有这张事件 CG：${key}`);
  return { type: 'cg', cgId: d.id, imageUrl: eventCgUrl(d.id), titleZh: d.titleZh, titleEn: d.titleEn, captionZh: d.captionZh, captionEn: d.captionEn };
};
