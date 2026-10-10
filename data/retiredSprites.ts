import { StoryNode } from '../types';

// ==========================================================
// 🗃️ 退役的老立绘 → 重制后的立绘
//
// 2026-10-04 重制之前的立绘已经不用了（文件挪到了 .generated/retired-sprites/，不再打包）。
// 源码里的引用已经全部换掉（scripts/remap-old-sprites.mjs，映射和这里一致）。
// 这张表只剩一个用处：老存档里"剧情读到一半"的进度存的是整张节点表，
// 里面可能还写着老路径——读档时用 upgradeNodes 换成新的，免得出现破图。
// ==========================================================
export const RETIRED_SPRITES: Record<string, Record<string, string>> = {
  hikari: { angry: 'school_angry', happy: 'school_happy', neutral: 'school_neutral', sad: 'school_sad', shy: 'school_shy', smug: 'school_smug', surprised: 'school_surprised' },
  inari: {
    angry: 'school_angry', happy: 'school_happy', neutral: 'school_neutral', sad: 'school_sad', shy: 'school_shy',
    sly: 'school_sly', smug: 'school_smug', surprised: 'school_surprised', curious: 'school_surprised', majestic: 'school_smug'
  },
  maki: {
    angry: 'school_angry', angry_alt: 'school_angry', happy: 'school_happy', happy_alt: 'school_happy', laugh: 'school_laugh',
    neutral: 'school_neutral', neutral_alt: 'school_neutral', pout: 'school_pout', shy: 'school_shy', shy_alt: 'school_shy',
    smug: 'school_smug', sleepy_alt: 'school_neutral'
  },
  sora: {
    angry: 'school_angry', happy: 'school_happy', neutral: 'school_neutral', sad: 'school_sad', shy: 'school_shy', love: 'school_love',
    cute: 'school_happy', love_alt: 'school_love', neutral_alt: 'school_neutral_alt', shock: 'school_shock'
  },
  miyuki: { casual_bangdream: 'cardigan_happy', happy_alt: 'cardigan_happy_alt', neutral_alt: 'cardigan_neutral' },
  nao: {
    casual_angry: 'knit_angry', casual_curious: 'knit_curious', casual_happy: 'knit_happy', casual_love: 'knit_love',
    casual_neutral: 'knit_neutral', casual_shy: 'knit_shy', casual_cold: 'knit_neutral', jacket_angry: 'knit_angry'
  },
  rei: { school_bangdream: 'neutral' }
};

const RE = /\/images\/characters\/([a-z]+)\/([a-z0-9_]+)\.webp/g;

export const upgradeSprite = (p: string): string =>
  p.replace(RE, (all, c, f) => (RETIRED_SPRITES[c]?.[f] ? `/images/characters/${c}/${RETIRED_SPRITES[c][f]}.webp` : all));

// 整张节点表过一遍（包括 branch / choice 里嵌套的）
export const upgradeNodes = (nodes: StoryNode[]): StoryNode[] => {
  const s = JSON.stringify(nodes);
  const t = upgradeSprite(s);
  return t === s ? nodes : JSON.parse(t);
};
