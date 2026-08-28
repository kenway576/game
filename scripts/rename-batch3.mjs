// 一次性脚本：Maki(新角色) 与 Miyuki(新增服装) 的立绘规范化命名
import fs from 'fs';
import path from 'path';

const root = path.resolve('public/images/characters');
const G = (id) => `Gemini_Generated_Image_${id}.png`;

const MAPS = {
  // 🐱 MAKI（关西腔雌小鬼）
  // 默认服装 = 街头装（牛仔背心+紫猫T+白短裤+猫耳耳机）
  maki: {
    [G('9k3ikp9k3ikp9k3i')]: 'neutral.png',
    [G('r21yelr21yelr21y')]: 'neutral_alt.png',
    [G('phvywbphvywbphvy')]: 'smug.png',            // 居高临下的死鱼眼 ★雌小鬼招牌
    [G('gxce7kgxce7kgxce')]: 'happy.png',
    [G('lh9iymlh9iymlh9i')]: 'happy_alt.png',
    [G('soxx5fsoxx5fsoxx')]: 'laugh.png',
    [G('4zn60n4zn60n4zn6')]: 'angry.png',
    [G('50m9ku50m9ku50m9')]: 'angry_alt.png',
    [G('v8dcgov8dcgov8dc')]: 'shy.png',
    [G('syhm8syhm8syhm8s')]: 'shy_alt.png',
    [G('fn4wfn4wfn4wfn4w')]: 'pout.png',
    [G('3re0eg3re0eg3re0')]: 'sleepy_alt.png',
    // school = 深色西装校服
    [G('ryokphryokphryok')]: 'school_neutral.png',
    [G('ryokphryokphryok') + '#2']: null,
    [G('j1i3flj1i3flj1i3')]: 'school_happy.png',
    [G('lz20o9lz20o9lz20')]: 'school_shy.png',
    [G('vdjjh9vdjjh9vdjj')]: 'school_angry.png',
    // cardigan = 黄色开衫校服
    [G('l5ky4bl5ky4bl5ky')]: 'cardigan_neutral.png',
    [G('j5v121j5v121j5v1')]: 'cardigan_happy.png',
    [G('utsko6utsko6utsk')]: 'cardigan_laugh.png',
    [G('pnam5bpnam5bpnam')]: 'cardigan_angry.png',
    [G('6uuvwx6uuvwx6uuv')]: 'cardigan_smug.png',
    [G('xdyw9qxdyw9qxdyw')]: 'cardigan_shy_alt.png',
    // punk = 黑色涂鸦夹克
    [G('vv9hv4vv9hv4vv9h')]: 'punk_neutral.png',
    [G('vqo1ezvqo1ezvqo1')]: 'punk_laugh.png',
    [G('efyeksefyeksefye')]: 'punk_love.png',
    [G('8vwgox8vwgox8vwg')]: 'punk_angry.png',
    [G('wdn83uwdn83uwdn8')]: 'punk_angry_alt.png',
    [G('v7racpv7racpv7ra')]: 'punk_pout.png',
    [G('tp92tdtp92tdtp92')]: 'punk_game_alt.png',
    // kimono = 紫花浴衣
    [G('go2wlwgo2wlwgo2w')]: 'kimono_neutral.png',
    [G('50hglx50hglx50hg')]: 'kimono_happy.png',
    [G('xk0uwnxk0uwnxk0u')]: 'kimono_happy_alt.png',
    [G('i824gmi824gmi824')]: 'kimono_shy.png',
    [G('yctlsoyctlsoyctl')]: 'kimono_smug.png',
    [G('lg6h1klg6h1klg6h')]: 'kimono_laugh.png',
    // gown = 白色纱裙
    [G('g70ikbg70ikbg70i')]: 'gown_neutral.png',
    [G('3xdxm13xdxm13xdx')]: 'gown_love.png',
    [G('ewojy5ewojy5ewoj')]: 'gown_happy.png',
    [G('fcfv3zfcfv3zfcfv')]: 'gown_happy_alt.png',
    [G('xvky2xvky2xvky2x')]: 'gown_shy.png',
    [G('uwo53uwo53uwo53u')]: 'gown_cold.png',
    // swim = 比基尼
    [G('tmuv1ytmuv1ytmuv')]: 'swim_neutral.png',
    [G('pdakuwpdakuwpdak')]: 'swim_happy.png',
    [G('lt79rklt79rklt79')]: 'swim_shy.png',
    [G('x1tjd2x1tjd2x1tj')]: 'swim_shy_alt.png',
    [G('1mvpty1mvpty1mvp')]: 'swim_pout.png',
    [G('pxh99spxh99spxh9')]: 'swim_angry.png',
  },
  // ☕ MIYUKI 新增服装
  miyuki: {
    // cardigan = 米色针织开衫 + 粉裙
    [G('uzgdk7uzgdk7uzgd')]: 'cardigan_neutral.png',
    [G('n9gxb3n9gxb3n9gx')]: 'cardigan_neutral_alt.png',
    [G('2412yp2412yp2412')]: 'cardigan_shy.png',
    [G('8x3m6o8x3m6o8x3m')]: 'cardigan_sad.png',
    [G('9rb1g39rb1g39rb1')]: 'cardigan_happy.png',
    [G('ylhkmlylhkmlylhk')]: 'cardigan_happy_alt.png',
    [G('ob3y9aob3y9aob3y')]: 'cardigan_love.png',
    // sundress = 奶油色长裙
    [G('ts3sdzts3sdzts3s')]: 'sundress_neutral.png',
    [G('8nmcsc8nmcsc8nmc')]: 'sundress_happy.png',
    [G('bfxm1ebfxm1ebfxm')]: 'sundress_sad.png',
    [G('v9h46cv9h46cv9h4')]: 'sundress_angry.png',
    // gown = 深蓝晚礼服
    [G('uz9yuxuz9yuxuz9y')]: 'gown_neutral.png',
    [G('o4xjvpo4xjvpo4xj')]: 'gown_happy.png',
    [G('c9u2l4c9u2l4c9u2')]: 'gown_shy.png',
    [G('wq2tb5wq2tb5wq2t')]: 'gown_love.png',
    [G('yyzw7xyyzw7xyyzw')]: 'gown_angry.png',
  }
};

for (const [charDir, map] of Object.entries(MAPS)) {
  const dir = path.join(root, charDir);
  let ok = 0, missing = 0;
  for (const [src, dst] of Object.entries(map)) {
    if (!dst) continue;
    const from = path.join(dir, src);
    if (!fs.existsSync(from)) { console.log(`MISSING: ${charDir}/${src}`); missing++; continue; }
    fs.renameSync(from, path.join(dir, dst));
    ok++;
  }
  console.log(`${charDir}: renamed ${ok}, missing ${missing}`);
  const leftovers = fs.readdirSync(dir).filter(f => f.startsWith('Gemini'));
  if (leftovers.length) console.log(`  LEFTOVER (unmapped): ${leftovers.join(', ')}`);
}
