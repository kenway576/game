// 打包并运行 scripts/audit-backgrounds.ts
import { buildSync } from 'esbuild';
import { spawnSync } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';
const out = path.join(os.tmpdir(), `check-story-${Date.now()}.cjs`);
buildSync({ entryPoints: ['scripts/audit-backgrounds.ts'], bundle: true, platform: 'node', format: 'cjs', outfile: out, logLevel: 'error',
  loader: { '.png': 'empty', '.jpg': 'empty', '.webp': 'empty', '.css': 'empty' } });
const r = spawnSync(process.execPath, [out, ...process.argv.slice(2)], { stdio: 'inherit' });
fs.unlinkSync(out);
process.exit(r.status ?? 1);
