// 一次性脚本：把 miyuki / sora / nao 的原始文件名规范化为 outfit_emotion.png
// 默认服装（不带前缀）：miyuki=daily(居家), sora=sport(运动服), nao=school(校服)
// 重复/备选立绘加 _alt 后缀（游戏不引用，保留供替换用）
import fs from 'fs';
import path from 'path';

const root = path.resolve('public/images/characters');

const MAPS = {
  miyuki: {
    'Miyuki  daily  happy.png': 'happy_alt.png',
    'Miyuki  daily happy.png': 'happy.png',
    'Miyuki  daily hate.png': 'angry.png',
    'Miyuki  daily love.png': 'love.png',
    'Miyuki  daily normal (2).png': 'neutral_alt.png',
    'Miyuki  daily normal.png': 'neutral.png',
    'Miyuki  daily shy.png': 'shy.png',
    'Miyuki  daily think.png': 'thinking.png',
    'miyuki school angry.png': 'school_angry.png',
    'miyuki school cute.png': 'school_neutral.png',
    'miyuki school happy.png': 'school_happy.png',
    'miyuki school love.png': 'school_love.png',
    'miyuki school shy.png': 'school_shy.png',
    'miyuki summer angry.png': 'summer_angry.png',
    'miyuki summer cool.png': 'summer_cool.png',
    'miyuki summer happy.png': 'summer_happy.png',
    'miyuki summer normal.png': 'summer_neutral.png',
    'miyuki summer sad.png': 'summer_sad.png',
    'miyuki summer shy (2).png': 'summer_shy.png',
    'miyuki summmer cute.png': 'summer_cute.png'
  },
  sora: {
    'sora sport normal.png': 'neutral.png',
    'sora sport  happy.png': 'happy.png',
    'sora sport angry.png': 'angry.png',
    'sora sport cute.png': 'cute.png',
    'sora sport love.png': 'love.png',
    'sora sport love2.png': 'love_alt.png',
    'sora sport shok.png': 'shock.png',
    'sora sport shy.png': 'shy.png',
    'sora sports normal2.png': 'neutral_alt.png',
    'sora school  normal.png': 'school_neutral.png',
    'sora school.png': 'school_neutral_alt.png',
    'sora school  love.png': 'school_love.png',
    'sora school cool.png': 'school_cool.png',
    'sora school cool2.png': 'school_cool_alt.png',
    'sora school happy.png': 'school_happy.png',
    'sora school sad.png': 'school_sad.png',
    'sora school shy.png': 'school_shy.png',
    'sora summer angry.png': 'summer_angry.png',
    'sora summer cute (2).png': 'summer_cute_alt.png',
    'sora summer cute.png': 'summer_cute.png',
    'sora summer happy.png': 'summer_happy.png',
    'sora summer jealours.png': 'summer_jealous.png',
    'sora summer normal.png': 'summer_neutral.png',
    'sora summer shy.png': 'summer_shy.png',
    'sora swim angry.png': 'swim_angry.png',
    'sora swim cool.png': 'swim_cool.png',
    'sora swim cormal.png': 'swim_neutral.png',
    'sora swim cute.png': 'swim_cute.png',
    'sora swim happy.png': 'swim_happy.png',
    'sora swim shy.png': 'swim_shy.png',
    'sora swim think.png': 'swim_thinking.png',
    'soar autumn angry.png': 'autumn_angry.png',
    'sora autumn happy.png': 'autumn_happy.png',
    'sora autumn love.png': 'autumn_love.png',
    'sora autumn normal.png': 'autumn_neutral.png',
    'sora autumn normal2.png': 'autumn_neutral_alt.png',
    'sora autumn shy.png': 'autumn_shy.png',
    'sora maid  love.png': 'maid_love.png',
    'sora maid  love2.png': 'maid_love_alt.png',
    'sora maid cute.png': 'maid_neutral.png',
    'sora maid cute2.png': 'maid_cute.png',
    'sora maid happy.png': 'maid_happy.png'
  },
  nao: {
    'nao school normal.png': 'neutral.png',
    'nao school angry.png': 'angry.png',
    'nao school curious.png': 'curious.png',
    'nao school good.png': 'smile.png',
    'nao school happy.png': 'happy.png',
    'nao daily normal.png': 'casual_neutral.png',
    'nao daily love.png': 'casual_love.png',
    'nao daily shy.png': 'casual_shy.png',
    'nao daily2 angry.png': 'casual_angry.png',
    'nao daily3 cold.png': 'casual_cold.png',
    'nao daily3 curious.png': 'casual_curious.png',
    'nao daily3 happy.png': 'casual_happy.png',
    'nao gown angry.png': 'gown_angry.png',
    'nao gown happy.png': 'gown_happy.png',
    'nao gown hate.png': 'gown_hate_alt.png',
    'nao gown love.png': 'gown_love.png',
    'nao gown normal.png': 'gown_neutral.png',
    'nao gown normal2.png': 'gown_neutral_alt.png',
    'nao gown normal3.png': 'gown_neutral_alt2.png',
    'nao gown shy.png': 'gown_shy.png',
    'nao kimono angry.png': 'kimono_angry.png',
    'nao kimono curious.png': 'kimono_curious.png',
    'nao kimono cute.png': 'kimono_cute.png',
    'nao kimono love.png': 'kimono_love.png',
    'nao kimono normal (2).png': 'kimono_neutral_alt.png',
    'nao kimono normal.png': 'kimono_neutral.png',
    'nao kimono shy.png': 'kimono_shy.png',
    'nao kimono.png': 'kimono_neutral_alt2.png',
    'nao maid eat.png': 'maid_eat.png',
    'nao maid happy.png': 'maid_happy.png',
    'nao maid normal (2).png': 'maid_neutral_alt.png',
    'nao maid normal 4.png': 'maid_neutral_alt2.png',
    'nao maid normal.png': 'maid_neutral.png',
    'nao maid normal3.png': 'maid_neutral_alt3.png',
    'nao maid normal5 (2).png': 'maid_neutral_alt4.png',
    'nao maid normal5.png': 'maid_neutral_alt5.png',
    'nao maid think.png': 'maid_thinking.png',
    'nao sleep curious.png': 'sleep_curious.png',
    'nao sleep happy.png': 'sleep_happy.png',
    'nao sleep normal.png': 'sleep_neutral.png',
    'nao sleep ok.png': 'sleep_ok_alt.png',
    'nao sleep thinking.png': 'sleep_thinking.png',
    'nao swim angry.png': 'swim_angry.png',
    'nao swim happy.png': 'swim_happy.png',
    'nao swim normal 2.png': 'swim_neutral_alt.png',
    'nao swim normal.png': 'swim_neutral.png',
    'nao swim normal3.png': 'swim_neutral_alt2.png',
    'nao swim shy.png': 'swim_shy.png'
  }
};

for (const [charDir, map] of Object.entries(MAPS)) {
  const dir = path.join(root, charDir);
  let ok = 0, missing = 0;
  for (const [src, dst] of Object.entries(map)) {
    const from = path.join(dir, src);
    if (!fs.existsSync(from)) { console.log(`MISSING: ${charDir}/${src}`); missing++; continue; }
    fs.renameSync(from, path.join(dir, dst));
    ok++;
  }
  console.log(`${charDir}: renamed ${ok}, missing ${missing}`);
  // 报告映射表之外的剩余文件
  const leftovers = fs.readdirSync(dir).filter(f => f.endsWith('.png') && !Object.values(map).includes(f));
  if (leftovers.length) console.log(`  leftovers: ${leftovers.join(', ')}`);
}
