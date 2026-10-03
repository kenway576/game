import { GameCalendar, LifeState } from '../types';

// ---------------------------------------------------------
// 🏠 海风庄的房租
//
// 以前钱只进不出：打一天工八千多，商店里最贵的东西两千八，
// 到了后期钱包只是一个越来越大的数字，没有任何决定要做。
//
// 现在每个月 1 号（睡一觉跨进新的一个月那一刻）结一次账：
//   + 家里打来的生活费（仕送り）
//   − 房租（家賃）
//   − 水电煤（光熱費）——按季节变：夏天开空调、冬天开暖炉贵，春秋便宜
// 净支出大约一万出头，也就是**每个月得认真打一两天工**。
// 这正好是想要的那种压力：不至于饿死，但扭蛋多转三次，月底就要算一算了。
//
// 【交不上】
// 有多少扣多少，剩下的记成欠款。之后每天早上，钱包里有钱就先还欠款。
// 欠着房租的人睡不好——睡一觉只回到 RENT_WORRY_STAMINA，不回满。
// 不会被赶出去：这是一个学日语的游戏，不是生存游戏。
// ---------------------------------------------------------

export const RENT = 25000;
export const ALLOWANCE = 15000;
// 从几号开始提醒"月底要交房租了"
export const RENT_WARN_DAY = 25;
// 欠着房租时，睡一觉只能回到这么多体力
export const RENT_WORRY_STAMINA = 80;

// 光熱費（月份 → 日元）。神户：七八月空调、一二月暖炉。
const UTILITIES: Record<number, number> = {
  1: 6500, 2: 6500, 3: 4500, 4: 3500, 5: 3000, 6: 3500,
  7: 5500, 8: 7000, 9: 5000, 10: 3500, 11: 4000, 12: 5500
};

// 这个月 1 号要结的账。光熱費按"刚过去的那个月"用了多少算——
// 账单本来就是后付的：6 月 1 号交的是 5 月的电费。
export const billFor = (month: number) => {
  const used = month === 1 ? 12 : month - 1;
  const utilities = UTILITIES[used] ?? 4000;
  return { rent: RENT, utilities, allowance: ALLOWANCE, net: RENT + utilities - ALLOWANCE, usedMonth: used };
};

// 同一个月不结两次（读档、重开都不会再扣一遍）
export const rentKey = (cal: GameCalendar) => `${cal.year ?? 1}-${cal.month}`;

// 学年从 4 月开始，搬进来那个月的房租已经交过了——第一次结账是 5 月 1 号
const firstBillingDue = (cal: GameCalendar) => (cal.year ?? 1) > 1 || cal.month >= 5 || cal.month < 4;

export interface RentReport {
  month: number;
  allowance: number;
  rent: number;
  utilities: number;
  usedMonth: number;
  paid: number;        // 这次实际从钱包里扣掉的（含补交的旧欠款）
  owedBefore: number;
  owedAfter: number;
  yenAfter: number;
}

// 月初结账。tomorrow = 刚跨进的那一天（必须是 1 号）。
export const settleRent = (life: LifeState, tomorrow: GameCalendar): { life: LifeState; report: RentReport } | null => {
  if (tomorrow.day !== 1 || !firstBillingDue(tomorrow)) return null;
  const key = rentKey(tomorrow);
  if (life.rentPaidFor === key) return null;
  const bill = billFor(tomorrow.month);
  const owedBefore = life.rentOwed ?? 0;
  const wallet = life.yen + bill.allowance;
  const due = owedBefore + bill.rent + bill.utilities;
  const paid = Math.min(wallet, due);
  const next: LifeState = {
    ...life,
    yen: wallet - paid,
    rentOwed: due - paid,
    rentPaidFor: key
  };
  return {
    life: next,
    report: {
      month: tomorrow.month, allowance: bill.allowance, rent: bill.rent, utilities: bill.utilities,
      usedMonth: bill.usedMonth, paid, owedBefore, owedAfter: due - paid, yenAfter: next.yen
    }
  };
};

// 每天早上：欠着的先从钱包里还
export const collectArrears = (life: LifeState): { life: LifeState; paid: number } => {
  const owed = life.rentOwed ?? 0;
  if (owed <= 0 || life.yen <= 0) return { life, paid: 0 };
  const paid = Math.min(owed, life.yen);
  return { life: { ...life, yen: life.yen - paid, rentOwed: owed - paid }, paid };
};

// 大厅里那块小牌子：下一次交多少、几号交、现在欠多少
export const rentStatus = (cal: GameCalendar, life: LifeState) => {
  const nextMonth = cal.month === 12 ? 1 : cal.month + 1;
  const bill = billFor(nextMonth);
  const owed = life.rentOwed ?? 0;
  return {
    nextMonth,
    net: bill.net,
    owed,
    warn: cal.day >= RENT_WARN_DAY,
    short: life.yen < bill.net + owed
  };
};
