import { DrillPack, DrillRound, PracticeProgress, PracticeTier } from '../types';
import { MIYUKI_PACK } from './drills/miyuki';
import { ASUKA_PACK } from './drills/asuka';
import { REI_PACK } from './drills/rei';
import { SORA_PACK } from './drills/sora';
import { MINH_PACK } from './drills/minh';
import { KONBINI_PACK } from './drills/konbini';

// ==========================================================
// 🗣️ 情景对答 · 题库总表 + 出题 / 升档规则
//
// 六包题，每包三档、每档十题，一共一百八十题。
// 每次坐下来练八题：先五道本档的，再三道下一档的——
// 所以同一次练习里也是越往后越难，最后三题是在"偷看"下一档。
// 到了三档，八题全是三档。
// ==========================================================

export const DRILL_PACKS: Record<string, DrillPack> = {
  konbini: KONBINI_PACK,
  miyuki: MIYUKI_PACK,
  asuka: ASUKA_PACK,
  rei: REI_PACK,
  sora: SORA_PACK,
  minh: MINH_PACK
};

export const SESSION_SIZE = 8;
const SESSION_CURRENT = 5;          // 本档几题，剩下的是下一档
export const CLEAR_RATE = 0.75;     // 答对多少算这一次达标
export const PROMOTE_AFTER = 2;     // 达标几次升一档
const RECENT_KEEP = 16;             // 记住最近出过的多少题

// 每一档的规矩：时限、题目要不要给译文
export const TIER_RULES: Record<PracticeTier, { ms: number; showPromptTranslation: boolean; labelZh: string; labelEn: string }> = {
  1: { ms: 16000, showPromptTranslation: true,  labelZh: '初级', labelEn: 'Beginner' },
  2: { ms: 12000, showPromptTranslation: false, labelZh: '中级', labelEn: 'Intermediate' },
  3: { ms: 9000,  showPromptTranslation: false, labelZh: '上级', labelEn: 'Advanced' }
};

export const freshProgress = (): PracticeProgress => ({ tier: 1, clears: 0, plays: 0, best: 0, recent: [] });

const shuffle = <T,>(a: T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

// 从某一档里挑 n 题，最近出过的往后排（不够的时候才用它们）
const pick = (rounds: DrillRound[], tier: PracticeTier, n: number, recent: string[]): DrillRound[] => {
  const pool = rounds.filter(r => r.tier === tier);
  const fresh = shuffle(pool.filter(r => !recent.includes(r.id)));
  const stale = shuffle(pool.filter(r => recent.includes(r.id)));
  return [...fresh, ...stale].slice(0, n);
};

export const buildSession = (pack: DrillPack, prog: PracticeProgress | undefined, size = SESSION_SIZE): DrillRound[] => {
  const p = prog || freshProgress();
  if (p.tier >= 3) return pick(pack.rounds, 3, size, p.recent);
  const cur = Math.min(SESSION_CURRENT, size);
  const next = (p.tier + 1) as PracticeTier;
  return [
    ...pick(pack.rounds, p.tier, cur, p.recent),
    ...pick(pack.rounds, next, size - cur, p.recent)
  ];
};

export interface PracticeOutcome {
  progress: PracticeProgress;
  cleared: boolean;
  promoted: boolean;
  rate: number;
}

// 练完一次，结算进度。达标 = 正确率到 CLEAR_RATE；达标满 PROMOTE_AFTER 次升一档。
// 不降档：这游戏不因为你今天状态不好就把你打回去。
export const settlePractice = (
  prev: PracticeProgress | undefined, correct: number, total: number, seenIds: string[] = []
): PracticeOutcome => {
  const p = prev || freshProgress();
  const rate = total ? correct / total : 0;
  const cleared = rate >= CLEAR_RATE;
  let tier = p.tier;
  let clears = cleared ? p.clears + 1 : p.clears;
  let promoted = false;
  if (tier < 3 && clears >= PROMOTE_AFTER) {
    tier = (tier + 1) as PracticeTier;
    clears = 0;
    promoted = true;
  }
  return {
    cleared, promoted, rate,
    progress: {
      tier, clears,
      plays: p.plays + 1,
      best: Math.max(p.best, Math.round(rate * 100)),
      recent: [...seenIds, ...p.recent.filter(id => !seenIds.includes(id))].slice(0, RECENT_KEEP)
    }
  };
};

// 地图卡片上那一行小字："中级 · 再达标 1 次升上级"
export const progressLine = (prog: PracticeProgress | undefined, en: boolean): string => {
  const p = prog || freshProgress();
  const label = en ? TIER_RULES[p.tier].labelEn : TIER_RULES[p.tier].labelZh;
  if (p.tier >= 3) return en ? `${label} · best ${p.best}%` : `${label} · 最好 ${p.best}%`;
  const need = PROMOTE_AFTER - p.clears;
  return en ? `${label} · ${need} more clear${need > 1 ? 's' : ''} to level up` : `${label} · 再达标 ${need} 次升档`;
};
