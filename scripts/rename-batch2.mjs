// 一次性脚本：第二批新增立绘（inari daily/daily2/gown/summer, sora kimono/gown）规范化命名
import fs from 'fs';
import path from 'path';

const root = path.resolve('public/images/characters');

const MAPS = {
  inari: {
    // daily（米色毛衣居家）→ home
    'inari daily normal.png': 'home_neutral.png',
    'inari daily happy.png': 'home_happy.png',
    'inari daily cold.png': 'home_cold.png',
    'inari daily shy.png': 'home_shy.png',
    'inari daily  cute.png': 'home_cute.png',
    'inari daily normal 2.png': 'home_neutral_alt.png',
    'inari daily normal2.png': 'home_neutral_alt2.png',
    'inari daily normal3.png': 'home_neutral_alt3.png',
    'inari daily normal4.png': 'home_neutral_alt4.png',
    // daily2（黑毛衣）→ knit
    'inari daily2 normal.png': 'knit_neutral.png',
    'inari daily2 angry.png': 'knit_angry.png',
    'inari daily2 sad.png': 'knit_sad.png',
    'inari daily2 think.png': 'knit_thinking.png',
    // gown（深蓝晚礼服）
    'inari gown normal.png': 'gown_neutral.png',
    'inari gown normal2.png': 'gown_neutral_alt.png',
    'inari gown happy.png': 'gown_happy.png',
    'inari gown cold.png': 'gown_cold.png',
    'inari gown angry.png': 'gown_angry.png',
    'inari gown serious.png': 'gown_serious.png',
    // summer（白色连衣裙）
    'inari summer normal.png': 'summer_neutral.png',
    'summer_sheet_part1.png': 'summer_happy.png',
    'summer_sheet_part2.png': 'summer_neutral_alt.png',
    'summer_sheet_part3.png': 'summer_curious.png',
    'summer_sheet_part4.png': 'summer_shy.png'
  },
  sora: {
    'sora kimono normal.png': 'kimono_neutral.png',
    'sora kimono angry.png': 'kimono_angry.png',
    'sora kimono shy.png': 'kimono_shy.png',
    'sora kimono cute.png': 'kimono_cute.png',
    'kimono_sheet_part1.png': 'kimono_laugh.png',
    'kimono_sheet_part2.png': 'kimono_angry_alt.png',
    'kimono_sheet_part3.png': 'kimono_sad.png',
    'kimono_sheet_part4.png': 'kimono_neutral_alt.png',
    'kimono_sheet_part5.png': 'kimono_love.png',
    'sora gown normal.png': 'gown_neutral.png',
    'sora gown shy.png': 'gown_shy.png',
    'sora gown shy2.png': 'gown_shy_alt.png',
    'sora gown happy.png': 'gown_happy.png',
    'sora gown hate.png': 'gown_angry.png',
    'sora gown cool.png': 'gown_cool.png',
    'sora gown sad.png': 'gown_sad.png'
  }
};

// 已拆分完毕的拼图源文件：删除（git 历史里有原图）
const DELETE = {
  inari: ['inari summer.png'],
  sora: ['sora kimono 综合.png', 'sora kimono 综合 (2).png']
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
  for (const f of (DELETE[charDir] || [])) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`DELETED sheet source: ${charDir}/${f}`); }
  }
  console.log(`${charDir}: renamed ${ok}, missing ${missing}`);
}
