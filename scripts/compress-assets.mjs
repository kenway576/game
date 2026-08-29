/**
 * 🗜️ 素材压缩：把 public/images 下的立绘与背景转成 WebP。
 *
 * 为什么需要：原始素材是 AI 出图的全分辨率输出（立绘 ~2300px 高、背景 2752px 宽），
 * 但游戏里立绘最高只显示到 80vh、背景铺满 1920 宽。玩家每换一次表情要下载 3MB
 * 却只用得到十几分之一的像素——仓库和加载速度同时受害。
 *
 * 用法：
 *   node scripts/compress-assets.mjs              # 预演，只报告不写文件
 *   node scripts/compress-assets.mjs --write      # 就地转换（原文件移到 .backup-originals/）
 *   node scripts/compress-assets.mjs --write --keep   # 转换但保留原文件在原处
 *
 * 转换后记得把代码里的 .png/.jpg 引用改成 .webp（见 --write 结束时的提示）。
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGES = path.resolve('public/images');
const BACKUP = path.resolve('.backup-originals');
const WRITE = process.argv.includes('--write');
const KEEP = process.argv.includes('--keep');

// 背景铺满屏幕 → 1920 宽足够（含高分屏也够用，再大肉眼无差别）
// 立绘最高显示 ~80vh → 1400 高，给 2x 高分屏留了余量
const PRESETS = {
  backgrounds: { resize: { width: 1920, withoutEnlargement: true }, webp: { quality: 82 } },
  characters:  { resize: { height: 1400, withoutEnlargement: true }, webp: { quality: 86, alphaQuality: 90 } },
  cg:          { resize: { width: 1920, withoutEnlargement: true }, webp: { quality: 88 } },
};

const presetFor = (rel) => {
  const top = rel.split(path.sep)[0];
  return PRESETS[top] || PRESETS.backgrounds;
};

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full) : (/\.(png|jpe?g)$/i.test(e.name) ? [full] : []);
});

const files = fs.existsSync(IMAGES) ? walk(IMAGES) : [];
if (!files.length) {
  console.error(`没有找到图片：${IMAGES}`);
  process.exit(1);
}

console.log(`${WRITE ? '转换' : '预演（不写任何文件，加 --write 才真正转换）'}：${files.length} 个文件\n`);

let totalIn = 0, totalOut = 0, failed = 0;
const byKind = {};

for (const src of files) {
  const rel = path.relative(IMAGES, src);
  const preset = presetFor(rel);
  const kind = rel.split(path.sep)[0];
  try {
    const inSize = fs.statSync(src).size;
    const buf = await sharp(src).resize(preset.resize).webp(preset.webp).toBuffer();

    totalIn += inSize;
    totalOut += buf.length;
    byKind[kind] ??= { n: 0, in: 0, out: 0 };
    byKind[kind].n++; byKind[kind].in += inSize; byKind[kind].out += buf.length;

    if (WRITE) {
      fs.writeFileSync(src.replace(/\.(png|jpe?g)$/i, '.webp'), buf);
      if (!KEEP) {
        // 原文件移到备份目录而不是删除——转换是不可逆的，先留一手
        const dest = path.join(BACKUP, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
      }
    }
  } catch (e) {
    failed++;
    console.warn(`  ⚠️  跳过 ${rel}: ${e.message}`);
  }
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log('\n分类                 文件数        原始 →      WebP     压缩比');
for (const [k, v] of Object.entries(byKind)) {
  console.log(`${k.padEnd(20)} ${String(v.n).padStart(5)}  ${mb(v.in).padStart(9)} MB → ${mb(v.out).padStart(7)} MB   ${(v.in / v.out).toFixed(1)}x`);
}
console.log(`${'合计'.padEnd(19)} ${String(files.length - failed).padStart(5)}  ${mb(totalIn).padStart(9)} MB → ${mb(totalOut).padStart(7)} MB   ${(totalIn / totalOut).toFixed(1)}x`);
if (failed) console.log(`(${failed} 个文件失败)`);

if (WRITE) {
  console.log(`\n✅ 已写入 .webp。${KEEP ? '原文件保留在原处。' : `原文件已移到 ${path.relative(process.cwd(), BACKUP)}/`}`);
  console.log('⚠️  下一步：把代码里的图片路径后缀改成 .webp');
  console.log('    constants.ts 的 emotionMap / SCENE_MAP / CHARACTER_ROOMS 都有引用。');
} else {
  console.log('\n预演结束，没有改动任何文件。确认数字合适后再跑：node scripts/compress-assets.mjs --write');
}
