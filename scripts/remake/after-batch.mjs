// ---------------------------------------------------------
// ⏳ 等批量跑完再接着做收尾：补白衣服的洞 → 登记骨骼/表情表 → 第一轮校服的眨眼帧
//
//   node scripts/remake/after-batch.mjs      （用 Start-Process 独立启动，不受会话后台时长限制）
//
// 日志：.generated/remake2/_after.out，最后一行写"收尾完成"
// ---------------------------------------------------------
import fs from 'fs';
import { execSync, spawnSync } from 'child_process';

const LOG = '.generated/remake2/_after.out';
const log = m => fs.appendFileSync(LOG, `${new Date().toISOString()} ${m}\n`);
const running = () => {
  try {
    const out = execSync(`powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match 'run-all|outfit-pipeline|blink-installed|fix-clothing-holes' }).ProcessId"`, { encoding: 'utf8' });
    return out.trim().split(/\s+/).filter(Boolean).filter(pid => Number(pid) !== process.pid).length > 0;
  } catch { return true; }
};

log('等批量结束…');
while (running()) await new Promise(r => setTimeout(r, 60000));
for (const [name, args] of [
  ['补白衣服的洞', ['scripts/remake/fix-clothing-holes.mjs']],
  ['登记骨骼和表情表', ['scripts/remake/build-rigs.mjs']],
  ['第一轮校服眨眼帧', ['scripts/remake/blink-installed.mjs', '--jobs', '1']]
]) {
  log(`▶ ${name}`);
  const r = spawnSync(process.execPath, args, { encoding: 'utf8', env: process.env, maxBuffer: 64 * 1024 * 1024 });
  const lines = (r.stdout + r.stderr).split('\n').filter(l => l && !l.startsWith('[gemini]') && !/^\s+at /.test(l));
  fs.appendFileSync(LOG, lines.map(l => '    ' + l).join('\n') + '\n');
  log(`${r.status === 0 ? '✔' : '✘'} ${name}`);
}
log('收尾完成');
