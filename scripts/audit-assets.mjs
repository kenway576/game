// ============================================================================
// 哪些图片素材还没被用起来
//
// 素材是一批一批上传的，而引用它们的代码是一处一处写的，两边很容易对不上：
// 传了三十五张背景，代码里只挂上二十张，剩下十五张就一直躺在文件夹里。
// 这个脚本把两边对一遍，列出「有图没人用」和「有人用但图不在」。
//
// 【怎么算"被用了"】
// 代码里引用图片有三种写法：
//   完整路径写死在字符串里
//   `${DIR}happy.webp`                  模板拼接，只出现文件名
//   id 当文件名（ItemIcon、立绘目录）    连文件名都不出现，只有 id
// 所以判据放宽成：**文件名（去掉扩展名）在源码里任何地方出现过**就算用了。
// 宁可漏报几个"其实没用"的，也不要误报一堆逼人去核对。
//
// 用法：
//   node scripts/audit-assets.mjs              列没用上的
//   node scripts/audit-assets.mjs --missing    列代码引用了但文件不存在的
//   node scripts/audit-assets.mjs --all        两样都列
// ============================================================================
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const IMG = path.join(ROOT, 'public', 'images');
const args = process.argv.slice(2);
const WANT_MISSING = args.includes('--missing') || args.includes('--all');
const WANT_UNUSED = !args.includes('--missing') || args.includes('--all');

// ---- 把所有源码读成一坨，用来做包含判断 ----
const SRC_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.html', '.json', '.md']);
const SKIP_DIR = new Set(['node_modules', '.git', 'dist', '.generated', 'public']);
let blob = '';
const srcFiles = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    if (SKIP_DIR.has(f)) continue;
    const p = path.join(d, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (SRC_EXT.has(path.extname(f))) { srcFiles.push(p); blob += fs.readFileSync(p, 'utf8') + '\n'; }
  }
})(ROOT);

// ---- 所有图片 ----
const images = [];
(function walk(d) {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(webp|png|jpe?g|gif|svg)$/i.test(f)) images.push(p);
  }
})(IMG);

if (WANT_UNUSED) {
  const byDir = {};
  let unused = 0;
  for (const p of images) {
    const rel = path.relative(IMG, p).replace(/\\/g, '/');
    const base = path.basename(p).replace(/\.[^.]+$/, '');
    if (blob.includes(base)) continue;
    const dir = path.dirname(rel);
    (byDir[dir] = byDir[dir] || []).push(path.basename(p));
    unused++;
  }
  console.log(`${images.length} 张图，${unused} 张没有被任何代码提到\n`);
  for (const [dir, list] of Object.entries(byDir).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`── ${dir}  (${list.length})`);
    for (const f of list) console.log('   ' + f);
    console.log('');
  }
}

if (WANT_MISSING) {
  // 代码里写死的 /images/... 路径，检查文件在不在
  const refs = new Set();
  for (const m of blob.matchAll(/['"`](\/images\/[^'"`\s${}]+\.(?:webp|png|jpe?g|gif|svg))['"`]/g)) {
    refs.add(m[1]);
  }
  const missing = [...refs].filter(r => !fs.existsSync(path.join(ROOT, 'public', r))).sort();
  console.log(`代码里写死了 ${refs.size} 个图片路径，其中 ${missing.length} 个文件不存在`);
  for (const r of missing) console.log('   ' + r);
}
