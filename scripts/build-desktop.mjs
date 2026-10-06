/**
 * 🖥️ 打包桌面版
 *
 *   npm run desktop          自己玩：保留 .env.local 里的 API key，打成免安装的文件夹，
 *                            并在桌面放一个「Kobe Study」快捷方式
 *   npm run desktop:release  发给别人：清空所有 API key，打成安装包（带桌面/开始菜单快捷方式）
 *
 * 【为什么发给别人的版本一定要清空 key】
 * Vite 会把 VITE_ 开头的环境变量原样写进打包后的 JS。
 * 安装包里的 JS 谁都能解压出来看——发出去等于把你的 DeepSeek / Google key 公开了，
 * 别人可以拿它随便刷你的账单。清空之后，玩家在游戏的「系统菜单」里填自己的 key。
 * 这个脚本打完会把 dist/ 里每个文件扫一遍，只要还能找到你的 key 就直接报错退出，不出安装包。
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const RELEASE = process.argv.includes('--release');
const root = process.cwd();
const node = process.execPath;

const run = (args, env) => {
  const r = spawnSync(node, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  if (r.status !== 0) { console.error(`\n✗ 失败：node ${args.join(' ')}`); process.exit(r.status || 1); }
};

// 读 .env.local 里所有会进前端包的 key（VITE_ 开头、名字里带 KEY）
const envFile = path.join(root, '.env.local');
const keys = {};
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(VITE_[A-Z0-9_]*KEY[A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) keys[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// 1. 打网页包
const stripped = Object.fromEntries(Object.keys(keys).map(k => [k, '']));
console.log(RELEASE
  ? `\n▶ 发布版：清空 ${Object.keys(keys).join(', ') || '（没有 key）'}`
  : '\n▶ 自用版：保留 .env.local 里的 key');
run([path.join('node_modules', 'vite', 'bin', 'vite.js'), 'build'], RELEASE ? stripped : {});

// 2. 发布版：确认 key 真的没进包
if (RELEASE) {
  const secrets = Object.values(keys).filter(v => v && v.length >= 12);
  const leaks = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(js|html|css|json|map|txt)$/i.test(e.name)) {
        const text = fs.readFileSync(p, 'utf8');
        for (const s of secrets) if (text.includes(s)) leaks.push(path.relative(root, p));
      }
    }
  };
  walk(path.join(root, 'dist'));
  if (leaks.length) {
    console.error(`\n✗ 在打包结果里找到了你的 API key，已停止，不生成安装包：\n  ${[...new Set(leaks)].join('\n  ')}`);
    process.exit(1);
  }
  console.log('✓ 已确认：打包结果里没有你的 API key');
}

// 3. 打 Electron 包。两个版本各用各的目录：
// 以前都输出到 release/win-unpacked，打一次发布版就会把桌面快捷方式指向的自用版
// 覆盖成没有 key 的版本。
const OUT = path.join('release', RELEASE ? 'public' : 'personal');
const builder = path.join('node_modules', 'electron-builder', 'cli.js');
run(RELEASE
  ? [builder, '--win', 'nsis', `-c.directories.output=${OUT}`]
  : [builder, '--win', '--dir', `-c.directories.output=${OUT}`]);

// 4. 自用版：在桌面放快捷方式，指向免安装文件夹里的 exe
if (!RELEASE) {
  const exe = path.join(root, OUT, 'win-unpacked', 'KobeStudy.exe');
  if (!fs.existsSync(exe)) { console.error(`✗ 没找到 ${exe}`); process.exit(1); }
  const desktop = spawnSync('powershell', ['-NoProfile', '-Command', '[Environment]::GetFolderPath("Desktop")'], { encoding: 'utf8' }).stdout.trim()
    || path.join(os.homedir(), 'Desktop');
  const lnk = path.join(desktop, 'Kobe Study.lnk');
  const ps = [
    '$s = (New-Object -ComObject WScript.Shell).CreateShortcut($env:KS_LNK)',
    '$s.TargetPath = $env:KS_EXE',
    '$s.WorkingDirectory = Split-Path $env:KS_EXE',
    '$s.IconLocation = "$env:KS_EXE,0"',
    '$s.Description = "Kobe Study"',
    '$s.Save()'
  ].join('; ');
  const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], { stdio: 'inherit', env: { ...process.env, KS_LNK: lnk, KS_EXE: exe } });
  if (r.status === 0) console.log(`\n✓ 桌面快捷方式：${lnk}`);
  else console.log(`\n（快捷方式没建成，可以直接双击 ${exe}）`);
} else {
  const out = fs.readdirSync(path.join(root, OUT)).filter(f => f.endsWith('.exe'));
  console.log(`\n✓ 安装包：${out.map(f => path.join(OUT, f)).join(', ')}`);
}
