import { GameCalendar, MapLocation, MapEventDef } from '../types';

// ==========================================================
// 🔋 体力
//
// 游戏里已经有一套"时段"了（早晨 / 午休 / 放学后 / 夜里），那是**什么时候**。
// 体力管的是另一件事：**你还撑不撑得住**。
//
// 两者不重复的地方在于：一格时间可以拿去便利店买瓶水，也可以拿去
// 打四个小时工。时段算下来都是一格，人回来的状态完全不一样。
// 所以体力按"这件事有多累"收费，而不是按占了多久收费——
// 于是"今天还剩两格，但只够干一件轻的"是个真实的处境，
// 而不是又一个和时段一模一样的进度条。
//
// 【数值】
// 满 100。一格轻松的行程 18，去远处 30，打工 45，部活 35。
// 一天四格全用在轻行程上是 72，撑得住；
// 但打工加部活就是 80，第三件事只能是回家。
// 所以"今天干什么"是个选择，而不是把四格填满。
//
// 【怎么恢复】
// 睡觉全满。中间要补只有两个办法：吃东西，或者回房间躺一下（花一格）。
// 这两条都写在体力条的提示里，不让玩家去猜。
// ==========================================================

export const STAMINA_MAX = 100;

// 累到这个数以下，出门的选项会先劝一句
export const STAMINA_TIRED = 30;

// 每种去处有多累。没列的按时段数 × 18 估，所以远门天然就是 36。
// 负数是**回**体力的地方——温泉和保健室在这套系统里才有了用处：
// 它们不是又一个景点，是你撑不住的时候会想起来的地方。
const TIRING: Record<string, number> = {
  // 动起来的
  gym: 35,
  koshien: 40,
  oji_amusement_park: 42,
  suma_beach: 32,
  // 千本鳥居是爬山，清水寺是爬坡，姬路城是爬楼
  kyoto_torii: 42,
  kiyomizu_stage: 38,
  himeji_castle: 40,
  // 坐着的，但是在海风里坐几个钟头
  suma_fishing_pier: 26,
  akashi_bridge: 30,
  // 顺路拐一下，不算出门
  convenience_store: 8,
  hyakkin_store: 10,
  ikuta_shrine: 12,
  // 回体力的
  nada_onsen: -25,
  arima_onsen: -35,
  school_infirmary: -15
};

export const staminaCostOf = (
  loc: MapLocation, ev: MapEventDef | null | undefined, cal: GameCalendar
): number => {
  const base = TIRING[loc.id] ?? ((ev?.timeCost ?? loc.timeCost ?? (loc.district === 'far' ? 2 : 1)) * 18);
  // 下雨天走一趟更费劲。这是唯一一个天气真正影响到玩法的地方。
  // 但泡温泉不会因为下雨变累。
  const wet = cal.weather === 'rainy' && base > 0 ? 6 : 0;
  return base + wet;
};

// 体力条的颜色和那句提示。分四档而不是渐变，
// 是因为玩家要的是"还能不能再来一趟"这个是非题。
export const staminaBand = (cur: number): {
  key: 'fresh' | 'ok' | 'tired' | 'spent';
  zh: string; en: string; color: string;
} => {
  if (cur >= 70) return { key: 'fresh', zh: '精神', en: 'Fresh',  color: '#4ade80' };
  if (cur >= STAMINA_TIRED) return { key: 'ok', zh: '还行', en: 'Fine',   color: '#facc15' };
  if (cur > 0)  return { key: 'tired', zh: '有点累', en: 'Tired', color: '#fb923c' };
  return { key: 'spent', zh: '走不动了', en: 'Spent', color: '#f87171' };
};

// 吃东西回多少。做出来的饭比买的管用——
// 这样厨房那套系统就不只是给好感度加分用的了。
export const MEAL_RESTORE = { cooked: 35, cafeteria: 25, bought: 15 };
