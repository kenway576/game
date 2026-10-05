// ---------------------------------------------------------
// 🎎 木偶立绘的"骨骼"标注
//
// 不拆图层：PuppetSprite 在整张立绘上做网格变形，靠这些标注知道
// 哪儿是头（绕脖子转）、哪儿是眼睛（眨眼时压扁）、哪儿是尾巴（左右分组摆）。
//
// 坐标全部是相对整张图的比例（0~1，原点左上），跟图片分辨率无关。
// 每张图单独标：同一套衣服的几张表情是分别生成的，头的位置、手的姿势都不一样。
// 标定方法见 scripts 里用过的网格图；调的时候在网址后面加 ?rig 能看到区域着色。
// ---------------------------------------------------------

import { AUTO_RIGS } from './puppetRigsAuto';
import { AUTO_BLINKS } from './puppetBlinkAuto';
import { AUTO_MASKS } from './puppetMaskAuto';
import { AUTO_LAYERS } from './puppetLayerAuto';

export interface PuppetRig {
  headC: [number, number];          // 头部椭圆中心（含耳朵）
  headR: [number, number];          // 头部椭圆半径
  neck: [number, number];           // 头转动的支点；这条线以下完全不受头影响
  eyes?: [number, number, number, number][]; // 每只眼：中心 x, y，半宽，半高。不写 = 不眨（比如笑眯眼）
  body: [number, number, number, number];    // 身体中线 x、躯干半宽（含垂下的手臂）、腰线 y、脚底 y
  // 尾巴摆动时要绕开的地方（举起来的手、握拳的手）：中心 x, y，半径 rx, ry
  exclude?: [number, number, number, number][];   // 最多 4 个
  // 两侧摆动的东西挂在哪儿。不写 = 尾巴，支点在胯部（稻荷）。
  // 双马尾挂在头上：pivotY 写扎头发的高度，pivotDX 是扎头发的点离身体中线多远，amp 是幅度倍数。
  // maxY：摆动区的下边界（比例）。双马尾到腰就没了，往下是腿，不能跟着晃。不写 = 不限
  sway?: { pivotY: number; pivotDX: number; amp: number; maxY?: number };
  // 眨眼过渡帧（scripts/remake/outfit-pipeline.mjs 生成）：一张小图，上半闭、下全闭，
  // rect 是它在整张立绘上的位置（比例 x, y, w, h）。有它就换图眨眼，没有就压扁 eyes
  blink?: { src: string; rect: [number, number, number, number] };
  // 哪些像素是头发/尾巴、可以摆（灰度图，scripts/remake/sway-masks.mjs 生成）。
  // 有它就只摆头发本身，同一片区域里举起来的手、袖子不跟着弯；没有就按老办法整片区域摆
  mask?: string;
  // 头发/尾巴分层（scripts/remake/hair-layers.mjs）：body = 去掉垂发后补画的身体，hair = 垂发蒙版。
  // 有它就只让头发层摆，身体层只做整体的呼吸、晃动——手和袖子不会被拉弯
  layer?: { body: string; hair: string };
}

const INARI = '/images/characters/inari/';

export const PUPPET_RIGS: Record<string, PuppetRig> = {
  [INARI + 'casual_neutral.webp']: {
    headC: [0.475, 0.12], headR: [0.115, 0.13], neck: [0.47, 0.235],
    eyes: [[0.442, 0.1755, 0.013, 0.0055], [0.497, 0.167, 0.0145, 0.0055]],
    body: [0.475, 0.16, 0.40, 0.975]
  },
  [INARI + 'casual_happy.webp']: {
    headC: [0.46, 0.15], headR: [0.095, 0.13], neck: [0.46, 0.255],
    // 笑眯眼，本来就是闭着的
    body: [0.46, 0.15, 0.42, 0.975],
    exclude: [[0.63, 0.15, 0.09, 0.21]]   // 举起来摇铃的那只手
  },
  [INARI + 'casual_sad.webp']: {
    headC: [0.46, 0.125], headR: [0.115, 0.13], neck: [0.455, 0.235],
    eyes: [[0.434, 0.174, 0.013, 0.0075], [0.496, 0.165, 0.015, 0.007]],
    body: [0.465, 0.16, 0.40, 0.975]
  },
  [INARI + 'casual_surprised.webp']: {
    headC: [0.46, 0.125], headR: [0.115, 0.13], neck: [0.46, 0.235],
    eyes: [[0.4375, 0.168, 0.0145, 0.011], [0.494, 0.1615, 0.013, 0.0105]],
    body: [0.465, 0.16, 0.40, 0.975]
  },
  [INARI + 'casual_angry.webp']: {
    headC: [0.465, 0.125], headR: [0.115, 0.13], neck: [0.465, 0.24],
    eyes: [[0.4425, 0.1705, 0.013, 0.0055], [0.494, 0.165, 0.013, 0.006]],
    body: [0.465, 0.16, 0.40, 0.975],
    exclude: [[0.63, 0.30, 0.07, 0.09], [0.28, 0.405, 0.05, 0.05]]   // 两只拳头
  },
  [INARI + 'casual_jealous.webp']: {
    headC: [0.47, 0.125], headR: [0.115, 0.13], neck: [0.465, 0.24],
    eyes: [[0.443, 0.1715, 0.012, 0.005], [0.497, 0.1645, 0.012, 0.0055]],
    body: [0.47, 0.16, 0.40, 0.975]
  },
  [INARI + 'casual_shy.webp']: {
    headC: [0.47, 0.12], headR: [0.115, 0.13], neck: [0.465, 0.23],
    eyes: [[0.4405, 0.1635, 0.0125, 0.0068], [0.499, 0.1565, 0.0125, 0.0068]],
    body: [0.47, 0.16, 0.40, 0.975]
  }
};

// ---------- 飞鸟 · 校服（2026-10 重制版）----------
// 一套身体、九张脸（scripts/make-expression.mjs 只换脸），所以整套共用一份骨骼。
// 坐标在装进游戏后的图上量（925x2000）。
const ASUKA = '/images/characters/asuka/';
const asukaSchool = (eyes: PuppetRig['eyes']): PuppetRig => ({
  headC: [0.43, 0.095], headR: [0.14, 0.09], neck: [0.43, 0.175],
  eyes,
  body: [0.43, 0.18, 0.44, 0.98],
  exclude: [
    [0.36, 0.225, 0.055, 0.06],   // 竖起来的那根手指和手
    [0.58, 0.39, 0.10, 0.05],     // 叉在腰上的手和手肘
    [0.20, 0.31, 0.06, 0.05],     // 抬手那一侧的手肘
    [0.67, 0.31, 0.07, 0.12]      // 叉腰那一侧的上臂（双马尾就垂在它后面）
  ],
  sway: { pivotY: 0.04, pivotDX: 0.13, amp: 0.45, maxY: 0.42 }   // 双马尾：从扎头发的地方摆，到腰为止
});
const ASUKA_EYES: PuppetRig['eyes'] = [[0.365, 0.114, 0.022, 0.007], [0.473, 0.108, 0.026, 0.007]];
const ASUKA_EYES_WIDE: PuppetRig['eyes'] = [[0.365, 0.113, 0.024, 0.0095], [0.473, 0.107, 0.027, 0.0095]];
for (const f of ['neutral', 'angry', 'sad', 'shy', 'smug', 'pout', 'school_blush']) PUPPET_RIGS[ASUKA + f + '.webp'] = asukaSchool(ASUKA_EYES);
PUPPET_RIGS[ASUKA + 'surprised.webp'] = asukaSchool(ASUKA_EYES_WIDE);
PUPPET_RIGS[ASUKA + 'happy.webp'] = asukaSchool(undefined);   // 笑眯眼，本来就闭着

// ---------- 其余六个半角色（2026-10 重制版）----------
// 坐标量在 4K 底图上（3072x5504，.generated/remake/<角色>/base_v1.png），
// 加载时按 install-expressions.mjs 打印的裁切框换算到游戏里的图上。
// 以后重新装图、裁切框变了，只要改 box，不用重量。
type Quad = [number, number, number, number];
interface BaseRig {
  box: { left: number; top: number; width: number; height: number };
  headC: [number, number]; headR: [number, number]; neck: [number, number];
  eyes: Quad[]; wideEyes?: Quad[];
  body: [number, number, number];          // 中线 x、躯干半宽、腰线 y（脚底固定在图片底部）
  exclude?: Quad[];
  sway?: { pivotY: number; pivotDX: number; amp: number; maxY?: number };
}
const BW = 3072, BH = 5504;
const fromBase = (b: BaseRig, eyes: Quad[] | undefined): PuppetRig => {
  const X = (x: number) => (x * BW - b.box.left) / b.box.width;
  const Y = (y: number) => (y * BH - b.box.top) / b.box.height;
  const RX = (r: number) => r * BW / b.box.width;
  const RY = (r: number) => r * BH / b.box.height;
  const q = ([x, y, rx, ry]: Quad): Quad => [X(x), Y(y), RX(rx), RY(ry)];
  return {
    headC: [X(b.headC[0]), Y(b.headC[1])], headR: [RX(b.headR[0]), RY(b.headR[1])],
    neck: [X(b.neck[0]), Y(b.neck[1])],
    eyes: eyes?.map(q),
    body: [X(b.body[0]), RX(b.body[1]), Y(b.body[2]), 0.985],
    exclude: b.exclude?.map(q),
    sway: b.sway && { pivotY: Y(b.sway.pivotY), pivotDX: RX(b.sway.pivotDX), amp: b.sway.amp, maxY: b.sway.maxY === undefined ? undefined : Y(b.sway.maxY) }
  };
};
const NO_SWAY = { pivotY: 0.1, pivotDX: 0.1, amp: 0 };   // 短发：两侧没有东西可摆
const wide = (e: Quad[]): Quad[] => e.map(([x, y, rx, ry]) => [x, y - 0.001, rx * 1.1, ry * 1.4] as Quad);

// 每个角色：底图骨骼 + 哪些文件用它。closed 是闭着眼的表情（笑眯眼、大笑），不眨
const REMAKE: { dir: string; rig: BaseRig; files: string[]; closed?: string[]; wideFiles?: string[] }[] = [
  {
    dir: 'hikari', files: ['school_neutral', 'school_happy', 'school_angry', 'school_sad', 'school_shy', 'school_smug', 'school_surprised', 'school_pout'],
    wideFiles: ['school_surprised'],
    rig: {
      box: { left: 262, top: 102, width: 2509, height: 5321 },
      headC: [0.43, 0.155], headR: [0.115, 0.10], neck: [0.43, 0.245],
      eyes: [[0.365, 0.181, 0.022, 0.008], [0.468, 0.178, 0.022, 0.008]],
      body: [0.44, 0.12, 0.45],
      exclude: [[0.17, 0.23, 0.06, 0.05], [0.22, 0.31, 0.05, 0.04], [0.73, 0.40, 0.06, 0.05], [0.67, 0.32, 0.07, 0.09]],
      sway: { pivotY: 0.09, pivotDX: 0.11, amp: 0.5, maxY: 0.46 }     // 右边的侧马尾
    }
  },
  {
    dir: 'rei', files: ['neutral', 'lecturing', 'school_lecturing', 'smile', 'shy', 'thinking', 'surprised', 'sad', 'angry'],
    wideFiles: ['surprised'],
    rig: {
      box: { left: 736, top: 68, width: 2308, height: 5384 },
      headC: [0.47, 0.135], headR: [0.115, 0.095], neck: [0.47, 0.225],
      // 眼镜框贴着眼睛上下，眨眼的范围收窄，免得把镜框一起拉弯
      eyes: [[0.419, 0.156, 0.02, 0.0055], [0.52, 0.145, 0.02, 0.0055]],
      body: [0.47, 0.12, 0.45],
      exclude: [[0.51, 0.275, 0.035, 0.05], [0.33, 0.37, 0.08, 0.08]],
      sway: NO_SWAY
    }
  },
  {
    dir: 'nao', files: ['neutral', 'happy', 'smile', 'angry', 'curious', 'shy', 'sad', 'surprised'],
    closed: [], wideFiles: ['surprised'],
    rig: {
      box: { left: 453, top: 269, width: 2152, height: 5117 },
      headC: [0.50, 0.145], headR: [0.11, 0.10], neck: [0.49, 0.225],
      eyes: [[0.436, 0.163, 0.022, 0.008], [0.529, 0.158, 0.022, 0.008]],
      body: [0.50, 0.12, 0.45],
      exclude: [[0.18, 0.24, 0.05, 0.05], [0.24, 0.31, 0.05, 0.04], [0.42, 0.34, 0.09, 0.05], [0.29, 0.33, 0.05, 0.08]],
      sway: { pivotY: 0.08, pivotDX: 0.11, amp: 0.5, maxY: 0.42 }     // 右边的马尾
    }
  },
  {
    dir: 'sora', files: ['school_neutral', 'school_neutral_alt', 'school_happy', 'school_angry', 'school_sad', 'school_shy', 'school_shock', 'school_love', 'school_cool', 'school_cool_alt'],
    wideFiles: ['school_shock'],
    rig: {
      box: { left: 207, top: 28, width: 2653, height: 5432 },
      headC: [0.49, 0.125], headR: [0.135, 0.085], neck: [0.50, 0.205],
      eyes: [[0.453, 0.132, 0.022, 0.008], [0.538, 0.125, 0.022, 0.008]],
      body: [0.48, 0.14, 0.46],
      exclude: [[0.18, 0.35, 0.09, 0.07]],
      sway: NO_SWAY
    }
  },
  {
    dir: 'maki', files: ['school_neutral', 'school_smug', 'school_happy', 'school_angry', 'school_laugh', 'school_pout', 'school_shy', 'school_surprised'],
    closed: ['school_happy', 'school_laugh'], wideFiles: ['school_surprised'],
    rig: {
      box: { left: 470, top: 129, width: 2330, height: 5298 },
      headC: [0.48, 0.15], headR: [0.13, 0.10], neck: [0.48, 0.24],
      eyes: [[0.427, 0.188, 0.022, 0.008], [0.532, 0.183, 0.022, 0.008]],
      body: [0.48, 0.12, 0.46],
      exclude: [[0.69, 0.31, 0.08, 0.05], [0.70, 0.35, 0.05, 0.04], [0.33, 0.44, 0.05, 0.04]],
      sway: { pivotY: 0.10, pivotDX: 0.15, amp: 0.6, maxY: 0.27 }     // 两束短马尾
    }
  },
  {
    dir: 'inari', files: ['school_neutral', 'school_sly', 'school_smug', 'school_happy', 'school_angry', 'school_sad', 'school_surprised', 'school_jealous', 'school_shy'],
    closed: ['school_happy'], wideFiles: ['school_surprised'],
    rig: {
      box: { left: 26, top: 17, width: 3033, height: 5435 },
      headC: [0.45, 0.13], headR: [0.12, 0.11], neck: [0.45, 0.225],
      eyes: [[0.404, 0.175, 0.02, 0.006], [0.489, 0.168, 0.02, 0.006]],
      body: [0.47, 0.13, 0.48],
      // 九条尾巴走默认的胯部支点（不写 sway）。拿铃铛的那条胳膊和垂下的手不能跟着摆
      exclude: [[0.805, 0.335, 0.05, 0.06], [0.73, 0.35, 0.06, 0.07], [0.28, 0.41, 0.05, 0.14], [0.235, 0.53, 0.045, 0.05]]
    }
  },
  {
    dir: 'miyuki', files: ['cardigan_neutral', 'cardigan_neutral_alt', 'cardigan_happy', 'cardigan_happy_alt', 'cardigan_love', 'cardigan_sad', 'cardigan_shy',
      'neutral', 'happy', 'love', 'shy', 'angry', 'thinking', 'sad', 'surprised'],
    closed: ['cardigan_happy', 'cardigan_happy_alt', 'happy'], wideFiles: ['surprised'],
    rig: {
      box: { left: 596, top: 187, width: 1744, height: 5214 },
      headC: [0.51, 0.135], headR: [0.115, 0.09], neck: [0.51, 0.205],
      eyes: [[0.47, 0.143, 0.022, 0.008], [0.554, 0.14, 0.022, 0.008]],
      body: [0.50, 0.15, 0.46],
      sway: { pivotY: 0.12, pivotDX: 0.10, amp: 0.3, maxY: 0.27 }     // 及肩的卷发，轻轻晃
    }
  }
];
for (const r of REMAKE) {
  for (const f of r.files) {
    const eyes = r.closed?.includes(f) ? undefined : r.wideFiles?.includes(f) ? (r.rig.wideEyes ?? wide(r.rig.eyes)) : r.rig.eyes;
    PUPPET_RIGS[`/images/characters/${r.dir}/${f}.webp`] = fromBase(r.rig, eyes);
  }
}

// 第二轮重制的换装：骨骼是流水线自动标的（scripts/remake/build-rigs.mjs 汇总），
// 同名的旧手标条目一律被盖掉——图换了，旧坐标也就作废了
Object.assign(PUPPET_RIGS, AUTO_RIGS);

// 第一轮重制（手标骨骼）的立绘补上的眨眼过渡帧（scripts/remake/blink-installed.mjs）
for (const [src, blink] of Object.entries(AUTO_BLINKS)) {
  if (PUPPET_RIGS[src] && !PUPPET_RIGS[src].blink) PUPPET_RIGS[src] = { ...PUPPET_RIGS[src], blink };
}
// 头发/尾巴分层
for (const [src, layer] of Object.entries(AUTO_LAYERS)) {
  if (PUPPET_RIGS[src]) PUPPET_RIGS[src] = { ...PUPPET_RIGS[src], layer };
}
// 摆动蒙版：只让头发/尾巴本身摆
for (const [src, mask] of Object.entries(AUTO_MASKS)) {
  if (PUPPET_RIGS[src]) PUPPET_RIGS[src] = { ...PUPPET_RIGS[src], mask };
}

// 剧本里这个角色的 speakerEn：判断"现在说话的是不是她"，说话时头才会一点一点
const PUPPET_SPEAKERS: Record<string, string> = {
  inari: 'Inari', asuka: 'Asuka', hikari: 'Hikari', rei: 'Rei', nao: 'Nao', sora: 'Sora', maki: 'Maki', miyuki: 'Miyuki'
};
export const puppetSpeakerOf = (src: string | null | undefined): string | null => {
  const m = src?.match(/\/images\/characters\/([^/]+)\//);
  return m ? PUPPET_SPEAKERS[m[1]] ?? null : null;
};

export const puppetRigFor = (src: string | null | undefined): PuppetRig | null =>
  (src && PUPPET_RIGS[src]) || null;
