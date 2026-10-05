import { CharacterId, GameCalendar } from '../types';
import { isSchoolDay } from './calendarLife';

// ---------------------------------------------------------
// 👗 她今天穿什么
//
// 以前衣服只有两条路能换：玩家在聊天里亲手打出"换上泳装"，或者 AI 自己想起来换。
// 前一条玩家不知道，后一条提示词明令"默认别换"，于是七十多套衣服里
// 有四十多套从来没有在剧情里露过面。每次进聊天还会被重置回校服——
// 在须磨的海滩上碰见她，她穿的也是校服。
//
// 这个文件把"什么场合穿什么"写成一张表：
//   · 地点决定（海边、祭典、温泉、体育馆、理科室、厨房、她的房间……）
//   · 日子决定（正月、文化祭、万圣节——那几天由剧本直接指定）
//   · 季节决定（放学后约出去、休息日在街上碰见：春夏秋冬各有一套私服）
// 所有选择都只在**已经解锁**的衣服里挑。没解锁的退回默认那套——
// 解锁的意义还在：升级之后，那套衣服马上就有地方穿了。
// ---------------------------------------------------------

// 场合。约会地点直接写场合；路上碰见的由地点推出来。
export type Occasion =
  | 'casual'     // 季节私服
  | 'school'     // 校服（默认那套）
  | 'swim'       // 海边（夏天）
  | 'yukata'     // 夏祭
  | 'onsen'      // 温泉街
  | 'formal'     // 爵士现场、下午茶、铁板烧
  | 'sport'      // 体育馆（放学后）
  | 'gym'        // 体育馆（上课、通宵）
  | 'lab'        // 理科室
  | 'home'       // 在家里（做饭）
  | 'sleepover'  // 夜里来你房间看电影
  | 'newyear'    // 正月
  | 'shrine'     // 神社（平常的日子）
  | 'kyoto';     // 京都（和服租借）

// 每个人在各种场合里会挑的衣服，排在前面的优先；都没解锁就退回季节私服或默认。
const PREFS: Record<CharacterId, Partial<Record<Occasion, string[]>>> = {
  // 睡衣只给住在隔壁的人（奈绪）：别人不会穿着睡衣穿过半个神户来你家。
  // 明日香、光、铃的睡衣在修学旅行的旅馆里。
  [CharacterId.ASUKA]:  { swim: ['swim'], yukata: ['yukata'], onsen: ['yukata'], formal: ['dress'], sport: ['sport', 'gym'], gym: ['gym'], newyear: ['kimono'], kyoto: ['kimono'] },
  [CharacterId.HIKARI]: { swim: ['swim'], yukata: ['yukata'], onsen: ['yukata'], formal: ['dress'], sport: ['gym', 'sport'], gym: ['gym'], newyear: ['kimono'], kyoto: ['kimono'] },
  [CharacterId.REI]:    { swim: ['swim'], yukata: ['yukata'], onsen: ['yukata'], formal: ['dress'], sport: ['gym'], gym: ['gym'], lab: ['lab'], newyear: ['kimono'], kyoto: ['kimono'] },
  [CharacterId.INARI]:  { swim: ['swim'], yukata: ['miko'], onsen: ['home'], formal: ['gown'], home: ['home'], newyear: ['goddess', 'miko'], shrine: ['miko'], kyoto: ['miko'], sleepover: ['home'] },
  [CharacterId.MIYUKI]: { swim: ['sundress', 'summer'], yukata: ['summer', 'sundress'], onsen: ['kimono'], formal: ['gown'], home: ['apron'], newyear: ['kimono'], kyoto: ['kimono'], sleepover: ['cardigan'] },
  [CharacterId.SORA]:   { swim: ['swim'], yukata: ['summer'], formal: ['gown'], newyear: ['kimono'], kyoto: ['kimono'] },
  [CharacterId.NAO]:    { swim: ['swim'], yukata: ['yukata'], onsen: ['yukata'], formal: ['gown'], home: ['knit'], sleepover: ['sleep'], newyear: ['kimono'], kyoto: ['kimono'] },
  [CharacterId.MAKI]:   { swim: ['swim'], yukata: ['punk'], formal: ['gown'], newyear: ['kimono'], kyoto: ['kimono'] }
};

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export const seasonOfMonth = (m: number): Season =>
  m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter';

// 季节私服。空数组 = 默认那套就是她的私服。
const SEASONAL: Record<CharacterId, Record<Season, string[]>> = {
  [CharacterId.ASUKA]:  { spring: ['casual'], summer: ['summer', 'casual'], autumn: ['autumn', 'casual'], winter: ['winter', 'autumn', 'casual'] },
  [CharacterId.HIKARI]: { spring: ['casual'], summer: ['casual'], autumn: ['autumn', 'casual'], winter: ['winter', 'autumn', 'casual'] },
  [CharacterId.REI]:    { spring: ['casual'], summer: ['casual'], autumn: ['autumn', 'casual'], winter: ['winter', 'autumn', 'casual'] },
  // 稻荷不穿私服的时候是神体那一身。出了神社要"化"一下，化成什么看季节。
  [CharacterId.INARI]:  { spring: ['casual'], summer: ['summer', 'casual'], autumn: ['casual', 'knit'], winter: ['knit', 'casual'] },
  [CharacterId.MIYUKI]: { spring: ['cardigan'], summer: ['summer', 'sundress', 'cardigan'], autumn: ['cardigan'], winter: ['cardigan'] },
  [CharacterId.SORA]:   { spring: [], summer: ['summer'], autumn: ['autumn'], winter: ['autumn'] },
  [CharacterId.NAO]:    { spring: ['knit'], summer: ['knit'], autumn: ['cat', 'knit'], winter: ['cat', 'knit'] },
  [CharacterId.MAKI]:   { spring: ['cardigan', 'punk'], summer: ['punk'], autumn: ['cardigan', 'punk'], winter: ['punk'] }
};

// 不是学生的那两位：放学后也不穿校服。
const NOT_STUDENT = new Set<CharacterId>([CharacterId.MIYUKI, CharacterId.INARI]);

const SCHOOL_SCENE = /^(classroom|hallway|library|rooftop|gym$|school_|kaisei_|music_room|art_room|courtyard|basketball_|lab$|international_office)/;
const GYM_SCENE = /^(gym|kaisei_gym_interior|basketball_gym_sunset|basketball_court_hoop|school_gym_storage)$/;
const SHRINE_SCENE = /(shrine|torii|inari_sando|kitano_tenman|fushimi)/;

export const isSchoolScene = (scene: string | null | undefined) => !!scene && SCHOOL_SCENE.test(scene);

const inRange = (cal: GameCalendar, a: [number, number], b: [number, number]) => {
  const cur = cal.month * 100 + cal.day;
  return cur >= a[0] * 100 + a[1] && cur <= b[0] * 100 + b[1];
};
export const isNewYear = (cal: GameCalendar) => cal.month === 1 && cal.day <= 15;

// 从地点推场合（路上碰见、剧情结束后接聊天的时候用）
export const occasionForScene = (charId: CharacterId, scene: string | null | undefined, cal: GameCalendar): Occasion | null => {
  if (!scene) return null;
  if (/beach/.test(scene)) return cal.month >= 6 && cal.month <= 9 ? 'swim' : null;
  if (/summer_festival|ikuta_summer_night|^festival$/.test(scene)) return 'yukata';
  if (/onsen|arima/.test(scene)) return 'onsen';
  if (/jazz_livehouse|teppanyaki|former_settlement_15_salon|former_settlement_salon|grill_ippei/.test(scene)) return 'formal';
  if (GYM_SCENE.test(scene)) return cal.timeSlot === 'lunch' || cal.timeSlot === 'morning' ? 'gym' : 'sport';
  if (/^(lab|school_science_lab)$/.test(scene)) return 'lab';
  if (scene === 'room_inari') return 'home';
  if (charId === CharacterId.MIYUKI && /^(miyuki_dinner_table|miyuki_room_dinner|umikaze_room_kitchen|kitchen|room_miyuki)$/.test(scene)) return 'home';
  if (/^room_/.test(scene) && cal.timeSlot === 'night') return 'sleepover';
  if (/kiyomizu|kyoto_/.test(scene)) return 'kyoto';
  if (SHRINE_SCENE.test(scene)) return isNewYear(cal) ? 'newyear' : 'shrine';
  return null;
};

const firstUnlocked = (list: string[] | undefined, unlocked: string[]) =>
  (list || []).find(o => unlocked.includes(o));

export interface OutfitPickCtx {
  scene?: string | null;
  cal: GameCalendar;
  unlocked: string[];
  // 主角约她出来的：她回去换过衣服了
  date?: boolean;
  occasion?: Occasion | null;
}

// 空和真希的默认立绘不是校服，校服是衣柜里单独的一套
const UNIFORM: Partial<Record<CharacterId, string>> = { [CharacterId.SORA]: 'school', [CharacterId.MAKI]: 'school' };
const schoolLook = (charId: CharacterId, unlocked: string[]) => {
  const u = UNIFORM[charId];
  return u && unlocked.includes(u) ? u : '';
};

// 主函数。返回衣柜键，'' = 默认那套。
export const pickContextOutfit = (charId: CharacterId, o: OutfitPickCtx): string => {
  const occasion = o.occasion ?? occasionForScene(charId, o.scene, o.cal);
  if (occasion === 'school') return schoolLook(charId, o.unlocked);
  // 稻荷在神社里就是她自己——神体那一身。被约到神社才换巫女服给你看。
  if (charId === CharacterId.INARI && !o.date && o.scene && SHRINE_SCENE.test(o.scene) && occasion !== 'newyear') return '';
  if (occasion && occasion !== 'casual') {
    const hit = firstUnlocked(PREFS[charId][occasion], o.unlocked);
    if (hit) return hit;
  }
  // 上学日、学校里、还没回过家：穿着校服
  const atSchool = isSchoolScene(o.scene);
  const offDuty = o.date || NOT_STUDENT.has(charId) || !isSchoolDay(o.cal) || o.cal.timeSlot === 'night';
  if (atSchool && !NOT_STUDENT.has(charId)) return schoolLook(charId, o.unlocked);
  if (!offDuty) return schoolLook(charId, o.unlocked);
  return firstUnlocked(SEASONAL[charId][seasonOfMonth(o.cal.month)], o.unlocked) || '';
};

// ---------------------------------------------------------
// 🏷️ 衣服叫什么（邀约面板上"她会穿：……"、给 AI 的那句"你现在穿着……"）
// ---------------------------------------------------------
const L = (zh: string, en: string, desc: string) => ({ zh, en, desc });
export const OUTFIT_LABEL: Record<CharacterId, Record<string, { zh: string; en: string; desc: string }>> = {
  [CharacterId.ASUKA]: {
    '': L('校服', 'School uniform', 'school uniform'),
    casual: L('黑针织与格纹裙', 'Black knit & tartan', 'off-shoulder black knit, tartan mini skirt, choker, ankle boots'),
    gym: L('体操服', 'PE kit', 'crimson track jacket and gym clothes, whistle'),
    swim: L('红色比基尼', 'Red bikini', 'red frilled bikini with a floral sarong'),
    maid: L('女仆装', 'Maid dress', 'classic black-and-white maid uniform'),
    autumn: L('驼色大衣', 'Duffle coat', 'camel duffle coat, burgundy turtleneck, tartan scarf'),
    yukata: L('山茶花浴衣', 'Camellia yukata', 'navy yukata with red camellias, red obi'),
    winter: L('冬装与耳罩', 'Winter coat & earmuffs', 'navy duffle coat, red scarf, white earmuffs, mittens'),
    sleep: L('星星睡衣', 'Star pyjamas', 'pink star-print pyjamas, bunny slippers'),
    dress: L('哥特礼裙', 'Gothic dress', 'black-and-red gothic lolita party dress'),
    kimono: L('红色振袖', 'Crimson furisode', 'crimson furisode with gold cranes'),
    sport: L('网球服', 'Tennis whites', 'white-and-red tennis uniform, visor, racket'),
    summer: L('扶桑花连衣裙', 'Hibiscus sundress', 'red hibiscus sundress and a straw hat'),
    fantasy: L('骑士团长', 'Knight commander', 'crimson knight-commander coat with a rapier')
  },
  [CharacterId.HIKARI]: {
    '': L('校服', 'School uniform', 'school uniform'),
    casual: L('黄色卫衣', 'Yellow hoodie', 'mustard sunflower hoodie, denim shorts, backwards cap'),
    gym: L('运动服', 'Gym kit', 'white gym top, orange running shorts, towel round her neck'),
    swim: L('波点比基尼', 'Polka-dot bikini', 'yellow polka-dot bikini, beach ball'),
    yukata: L('金鱼浴衣', 'Goldfish yukata', 'cream yukata with orange goldfish'),
    autumn: L('橙色羽绒与毛线帽', 'Puffer & beanie', 'orange puffer jacket, striped scarf, pom-pom beanie'),
    maid: L('咖啡店女仆装', 'Café maid', 'short black café maid dress with a daisy apron'),
    winter: L('雪地装', 'Snow jacket', 'orange down jacket with fur hood, big pom-pom hat'),
    sleep: L('小熊睡衣', 'Bear pyjamas', 'pale yellow bear-ear hoodie pyjamas'),
    sport: L('啦啦队服', 'Cheer uniform', 'yellow-and-white cheerleader uniform with pom-poms'),
    dress: L('花园派对裙', 'Garden party dress', 'cream chiffon dress with a sunflower corsage'),
    kimono: L('橙色振袖', 'Orange furisode', 'vivid orange furisode with maple leaves, fur stole')
  },
  [CharacterId.REI]: {
    '': L('校服', 'School uniform', 'school uniform'),
    casual: L('高领与长裙', 'Turtleneck & midi', 'black turtleneck, long beige skirt, crescent pendant'),
    lab: L('白大褂', 'Lab coat', 'white lab coat over her uniform, clipboard'),
    gym: L('运动外套', 'Tracksuit', 'navy tracksuit zipped to the chin'),
    swim: L('学校泳衣', 'School swimsuit', 'navy school swimsuit with a name tag, rash guard'),
    kimono: L('大正袴装', 'Taishō hakama', 'yagasuri kimono and navy hakama, big red ribbon'),
    maid: L('长裙女仆装', 'Victorian maid', 'ankle-length Victorian maid dress'),
    winter: L('藏青大衣', 'Navy duffle', 'navy duffle coat, cream scarf, earmuffs'),
    sleep: L('薰衣草睡裙', 'Lavender nightgown', 'long lavender nightgown, glasses still on'),
    dress: L('星空晚礼服', 'Starry gown', 'midnight-navy off-shoulder gown with star thread'),
    yukata: L('牵牛花浴衣', 'Morning-glory yukata', 'indigo yukata with white morning glories'),
    autumn: L('粗花呢与贝雷帽', 'Tweed & beret', 'tweed blazer, beret, film camera')
  },
  [CharacterId.INARI]: {
    '': L('神体', 'Her true form', 'her divine robes, nine tails out'),
    casual: L('人间打扮', 'Human disguise', 'cream knit, camel tartan skirt, fox pendant — tails hidden'),
    school: L('混进来的校服', 'Borrowed uniform', 'a school uniform she has no business wearing'),
    swim: L('浮世绘泳装', 'Great-wave bikini', 'Hokusai wave-print bikini with a sheer cover-up'),
    home: L('居家毛衣', 'Loungewear', 'loose fox-embroidered sweater, shorts, fox slippers'),
    knit: L('黑色粗针织', 'Black chunky knit', 'black oversized knit, beige skirt, fox-tail charm'),
    gown: L('天鹅绒礼服', 'Velvet gown', 'navy velvet ball gown with gold embroidery'),
    summer: L('白色夏裙', 'White sundress', 'white sundress with a wave print, straw bag'),
    miko: L('巫女服', 'Miko robes', 'white kosode and scarlet hakama'),
    goddess: L('祭神之装', 'Ceremonial regalia', 'white-and-gold ceremonial robes, sun-disc crown')
  },
  [CharacterId.MIYUKI]: {
    '': L('平常的开衫', 'Her usual cardigan', 'cream cable cardigan and a pleated skirt'),
    summer: L('玫瑰碎花裙', 'Rose-print dress', 'cream rose-print midi dress, pearl bracelet'),
    school: L('水手服', 'Sailor uniform', 'a sailor uniform — on a grown woman'),
    cardigan: L('开衫', 'Cardigan', 'soft cardigan over a blouse'),
    sundress: L('白色长裙', 'Ivory sundress', 'long ivory sundress, sunhat in hand'),
    gown: L('藏青裹身裙', 'Navy wrap dress', 'navy wrap dress with a single strand of pearls'),
    apron: L('围裙', 'Apron', 'lavender sweater, pink frilled apron'),
    kimono: L('访问着', 'Hōmongi', 'pale lavender hōmongi with plum blossoms')
  },
  [CharacterId.SORA]: {
    '': L('平常那身', 'Her usual gear', 'her usual sporty clothes'),
    school: L('校服', 'School uniform', 'school uniform'),
    summer: L('短T与工装裤', 'Crop tee & cargos', 'white crop tee with a basketball print, cargo shorts'),
    autumn: L('藏青针织', 'Navy knit', 'cropped navy cable-knit, olive mini skirt, backpack'),
    swim: L('运动泳装', 'Sport swimsuit', 'navy-and-orange racerback two-piece, sunglasses up'),
    maid: L('女仆装', 'Maid dress', 'black maid dress — she lost a bet'),
    kimono: L('藏青振袖', 'Navy furisode', 'navy furisode with a black haori'),
    gown: L('白色缎面礼服', 'White satin gown', 'white satin off-shoulder gown with a side slit')
  },
  [CharacterId.NAO]: {
    '': L('校服', 'School uniform', 'school uniform'),
    knit: L('米色开衫', 'Cream cardigan', 'cream cable cardigan, pink tee, denim skirt'),
    cat: L('猫咪毛衣', 'Cat sweater', 'navy sweater with a big cat face'),
    sleep: L('猫咪睡衣', 'Cat pyjamas', 'pink cat-print pyjamas, hair down'),
    kimono: L('珊瑚色振袖', 'Coral furisode', 'coral furisode with pines and cranes'),
    swim: L('珊瑚连体泳衣', 'Coral one-piece', 'coral halter one-piece, tropical-fish culottes'),
    maid: L('猫耳女仆', 'Cat-ear maid', 'navy maid dress with cat-ear headpiece'),
    gown: L('星光天鹅绒裙', 'Starry velvet', 'deep blue velvet dress with star embroidery'),
    yukata: L('红金鱼浴衣', 'Red goldfish yukata', 'red yukata with white goldfish')
  },
  [CharacterId.MAKI]: {
    '': L('平常那身', 'Her usual look', 'her usual look'),
    school: L('校服', 'School uniform', 'school uniform'),
    cardigan: L('黄色开衫', 'Yellow cardigan', 'oversized yellow cardigan, sleeves over her hands'),
    punk: L('贴满徽章的连帽衫', 'Patch hoodie', 'black hoodie covered in retro game patches, glowing cat-ear headphones'),
    kimono: L('樱花振袖', 'Cherry furisode', 'indigo furisode with cherry blossoms, headphones round her neck'),
    gown: L('白色礼服', 'White ball gown', 'white strapless ball gown, rainbow star brooch'),
    swim: L('像素爱心比基尼', 'Pixel-heart bikini', 'white bikini with pink pixel hearts, hair in two buns')
  }
};

export const outfitLabel = (charId: CharacterId, outfit: string, en: boolean) => {
  const l = OUTFIT_LABEL[charId]?.[outfit];
  return l ? (en ? l.en : l.zh) : outfit;
};

// ---------------------------------------------------------
// 🖼️ 立绘路径：衣服 × 心情
//
// 八个人的表情词表不一样（铃没有 happy，她的笑叫 smile；空没有 surprised），
// 剧本里只写"心情"，这里替每个人翻译成她真有的那张图。
// ---------------------------------------------------------
export type Mood = 'neutral' | 'happy' | 'shy' | 'surprised' | 'sad' | 'tease' | 'angry' | 'pout';

const MOOD_MAP: Record<CharacterId, Record<Mood, string[]>> = {
  [CharacterId.ASUKA]:  { neutral: ['neutral'], happy: ['happy'], shy: ['shy'], surprised: ['surprised'], sad: ['sad'], tease: ['smug'], angry: ['angry'], pout: ['pout', 'angry'] },
  [CharacterId.HIKARI]: { neutral: ['neutral'], happy: ['happy'], shy: ['shy'], surprised: ['surprised'], sad: ['sad'], tease: ['smug'], angry: ['angry'], pout: ['pout', 'angry'] },
  [CharacterId.REI]:    { neutral: ['neutral'], happy: ['smile'], shy: ['shy'], surprised: ['surprised'], sad: ['sad'], tease: ['lecturing'], angry: ['thinking'], pout: ['thinking'] },
  [CharacterId.INARI]:  { neutral: ['neutral'], happy: ['happy'], shy: ['shy'], surprised: ['surprised'], sad: ['sad'], tease: ['sly'], angry: ['angry'], pout: ['jealous', 'angry'] },
  [CharacterId.MIYUKI]: { neutral: ['neutral'], happy: ['happy'], shy: ['shy', 'love'], surprised: ['surprised', 'shy'], sad: ['sad'], tease: ['happy'], angry: ['angry', 'sad'], pout: ['thinking', 'sad'] },
  [CharacterId.SORA]:   { neutral: ['neutral'], happy: ['happy'], shy: ['shy'], surprised: ['shock', 'shy'], sad: ['sad'], tease: ['cool', 'cute'], angry: ['angry'], pout: ['angry'] },
  [CharacterId.NAO]:    { neutral: ['neutral'], happy: ['happy'], shy: ['shy'], surprised: ['surprised', 'curious'], sad: ['sad'], tease: ['curious'], angry: ['angry'], pout: ['angry'] },
  [CharacterId.MAKI]:   { neutral: ['neutral'], happy: ['happy', 'laugh'], shy: ['shy'], surprised: ['laugh'], sad: ['pout'], tease: ['smug'], angry: ['angry'], pout: ['pout'] }
};

// 实际存在的图（衣服 → 表情）。'' = 默认那套（根目录）。
const ROOT_EXPR: Record<CharacterId, string[]> = {
  [CharacterId.ASUKA]:  ['angry', 'happy', 'neutral', 'pout', 'sad', 'shy', 'smug', 'surprised'],
  [CharacterId.HIKARI]: ['angry', 'happy', 'neutral', 'sad', 'shy', 'smug', 'surprised'],
  [CharacterId.REI]:    ['angry', 'lecturing', 'neutral', 'sad', 'shy', 'smile', 'surprised', 'thinking'],
  [CharacterId.INARI]:  ['angry', 'curious', 'happy', 'majestic', 'neutral', 'sad', 'shy', 'sly', 'smug', 'surprised'],
  [CharacterId.MIYUKI]: ['angry', 'happy', 'love', 'neutral', 'sad', 'shy', 'surprised', 'thinking'],
  [CharacterId.SORA]:   ['angry', 'cute', 'happy', 'love', 'neutral', 'sad', 'shock', 'shy'],
  [CharacterId.NAO]:    ['angry', 'curious', 'happy', 'neutral', 'sad', 'shy', 'smile', 'surprised'],
  [CharacterId.MAKI]:   ['angry', 'happy', 'laugh', 'neutral', 'pout', 'shy', 'smug']
};
const OUTFIT_EXPR: Record<CharacterId, string[]> = {
  [CharacterId.ASUKA]:  ['neutral', 'happy', 'angry', 'sad', 'shy', 'smug', 'surprised', 'pout'],
  [CharacterId.HIKARI]: ['neutral', 'happy', 'angry', 'sad', 'shy', 'smug', 'surprised'],
  [CharacterId.REI]:    ['neutral', 'smile', 'shy', 'thinking', 'lecturing', 'surprised', 'sad'],
  [CharacterId.INARI]:  ['neutral', 'happy', 'sly', 'shy', 'jealous', 'angry', 'sad', 'surprised'],
  [CharacterId.MIYUKI]: ['neutral', 'happy', 'love', 'shy', 'sad', 'angry', 'thinking'],
  [CharacterId.SORA]:   ['neutral', 'happy', 'cool', 'shy', 'love', 'angry', 'sad'],
  [CharacterId.NAO]:    ['neutral', 'happy', 'curious', 'shy', 'love', 'angry', 'sad'],
  [CharacterId.MAKI]:   ['neutral', 'smug', 'laugh', 'pout', 'shy', 'angry', 'happy']
};
// 个别缺图的套装
const EXPR_EXCEPTIONS: Record<string, string[]> = {
  'miyuki/cardigan': ['neutral', 'happy', 'love', 'sad', 'shy'],
  'nao/cat': ['neutral', 'happy', 'curious', 'shy', 'love', 'angry', 'sad'],
  'sora/school': ['angry', 'cool', 'happy', 'love', 'neutral', 'sad', 'shock', 'shy'],
  'inari/school': ['angry', 'happy', 'jealous', 'neutral', 'sad', 'shy', 'sly', 'smug', 'surprised'],
  'hikari/school': ['angry', 'happy', 'neutral', 'pout', 'sad', 'shy', 'smug', 'surprised'],
  'maki/school': ['angry', 'happy', 'laugh', 'neutral', 'pout', 'shy', 'smug', 'surprised']
};

export const outfitImg = (charId: CharacterId, outfit: string, mood: Mood = 'neutral'): string => {
  const have = outfit ? (EXPR_EXCEPTIONS[`${charId}/${outfit}`] || OUTFIT_EXPR[charId]) : ROOT_EXPR[charId];
  const want = [...MOOD_MAP[charId][mood], 'neutral'];
  const expr = want.find(e => have.includes(e)) || 'neutral';
  return `/images/characters/${charId}/${outfit ? `${outfit}_` : ''}${expr}.webp`;
};

// 看过她穿哪套。第一次看见有一段"亮相"，之后就是一句带过。
export const seenOutfitFlag = (charId: CharacterId, outfit: string) => `seen_outfit_${charId}_${outfit}`;

// 这一段是不是在"文化祭/万圣节"这种剧本指定衣服的日子里（日期本身定义在 calendarLife）
export { isHalloween, cultureFestivalDay, CULTURE_FESTIVAL_DAYS } from './calendarLife';
export const isLuminarieSeason = (cal: GameCalendar) => inRange(cal, [12, 5], [12, 14]);
