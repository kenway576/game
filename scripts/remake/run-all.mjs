// ---------------------------------------------------------
// 🏭 批量跑 outfit-pipeline：所有角色的所有换装
//
//   node scripts/remake/run-all.mjs [--jobs 3] [--until install] [--only asuka,hikari]
//
// 一套失败（网络、模型偶尔不出图）就排到队尾重试，最多 4 次。
// 配额用完（429 / RESOURCE_EXHAUSTED 重试也不行）：整队停 5 分钟再继续——
// 额度重置后自己接着做，不用人看着。每套衣服各自断点续跑，重复跑不重复花钱。
// 日志：.generated/remake2/_batch.log
// ---------------------------------------------------------
import fs from 'fs';
import { spawn } from 'child_process';
import { OUTFITS } from './outfits.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const JOBS = Number(arg('jobs', 3));
const UNTIL = arg('until', 'install');
const ONLY = arg('only') ? String(arg('only')).split(',') : null;
const LOG = '.generated/remake2/_batch.log';
fs.mkdirSync('.generated/remake2', { recursive: true });
const log = m => { const line = `${new Date().toISOString()} ${m}`; console.log(line); fs.appendFileSync(LOG, line + '\n'); };

// 先做最常见的：日常私服（親密度 Lv.2 就解锁），再做其它
const FIRST = ['casual', 'knit', 'cat', 'cardigan', 'apron', 'home', 'summer', 'sleep', 'gym', 'punk'];
let queue = [];
for (const [c, outfits] of Object.entries(OUTFITS)) {
  if (ONLY && !ONLY.includes(c)) continue;
  for (const o of Object.keys(outfits)) queue.push({ c, o, tries: 0 });
}
queue.sort((a, b) => {
  const ra = FIRST.indexOf(a.o), rb = FIRST.indexOf(b.o);
  return (ra < 0 ? 99 : ra) - (rb < 0 ? 99 : rb);
});
log(`开始：${queue.length} 套，并发 ${JOBS}，做到 ${UNTIL}`);

let pausedUntil = 0;
let registering = Promise.resolve();
const runOne = job => new Promise(resolve => {
  const p = spawn(process.execPath, ['scripts/remake/outfit-pipeline.mjs', '--char', job.c, '--outfit', job.o, '--until', UNTIL], { env: process.env });
  let out = '';
  p.stdout.on('data', d => { out += d; fs.appendFileSync(LOG, String(d).split('\n').filter(l => l && !l.startsWith('[gemini]')).map(l => '    ' + l + '\n').join('')); });
  p.stderr.on('data', d => { out += d; fs.appendFileSync(LOG, '    ERR ' + d); });
  p.on('close', code => resolve({ code, out }));
});

const worker = async id => {
  while (queue.length) {
    const wait = pausedUntil - Date.now();
    if (wait > 0) { await new Promise(r => setTimeout(r, wait)); continue; }
    const job = queue.shift();
    job.tries++;
    log(`[w${id}] ▶ ${job.c}/${job.o}（第 ${job.tries} 次）`);
    const t0 = Date.now();
    const { code, out } = await runOne(job);
    if (code === 0) {
      log(`[w${id}] ✔ ${job.c}/${job.o} ${((Date.now() - t0) / 60000).toFixed(1)} 分钟`);
      // 装好一套就登记一套（emotionMap + 骨骼），游戏里马上能用；串行跑，免得两路同时改 constants.ts
      if (UNTIL === 'install') {
        registering = registering.then(() => new Promise(res => {
          const p = spawn(process.execPath, ['scripts/remake/build-rigs.mjs'], { env: process.env });
          let o = ''; p.stdout.on('data', d => o += d); p.stderr.on('data', d => o += d);
          p.on('close', c => { log(`    登记 ${job.c}/${job.o}：${c === 0 ? 'OK' : '失败 ' + o.slice(-200)}`); res(); });
        })).then(() => new Promise(res => {
          // 摆动蒙版：只让头发/尾巴摆，手和袖子不被拉弯（sway-masks.mjs 只做还没做过的那几套）
          const p = spawn(process.execPath, ['scripts/remake/sway-masks.mjs', '--only', job.c], { env: process.env });
          let o = ''; p.stdout.on('data', d => o += d); p.stderr.on('data', d => o += d);
          p.on('close', c => { log(`    蒙版 ${job.c}/${job.o}：${c === 0 ? 'OK' : '失败 ' + o.slice(-200)}`); res(); });
        }));
      }
      continue;
    }
    const quota = /429|RESOURCE_EXHAUSTED|quota|billing/i.test(out);
    log(`[w${id}] ✘ ${job.c}/${job.o}：${out.split('\n').filter(Boolean).slice(-2).join(' | ').slice(0, 300)}`);
    if (quota) {
      pausedUntil = Date.now() + 5 * 60000;
      log(`配额用完，全体暂停 5 分钟`);
      job.tries--;   // 配额问题不算失败次数
    }
    if (job.tries < 4) queue.push(job); else log(`[w${id}] 放弃 ${job.c}/${job.o}`);
  }
};
await Promise.all(Array.from({ length: JOBS }, (_, i) => worker(i + 1)));
await registering;
log('全部结束');
