// ==========================================================
// 💾 桌面版存档小工具（开发用）：读 / 写桌面版 localStorage 里的存档
//
//   npx electron electron/save-tool.cjs list
//   npx electron electron/save-tool.cjs write <槽位 1-5> <存档.json>
//
// 桌面版的存档在 %APPDATA%\KobeStudy 的 localStorage 里（来源 app://kobe，见 main.cjs）。
// 这里用同样的 userData 目录和同一个来源开一个看不见的窗口，直接读写那份 localStorage。
// 运行前先把游戏关掉（Chromium 不让两个进程同时开同一份存储）。
// 槽位 0 是自动存档，不让写。写之前会把那个槽位原来的内容备份到 %APPDATA%\KobeStudy\save-tool-backup\。
// ==========================================================
const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('KobeStudy');
app.setPath('userData', path.join(app.getPath('appData'), 'KobeStudy'));
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true }
}]);

const PREFIX = 'kobe_study_save_v5_slot_';
const [mode, slotArg, file] = process.argv.slice(process.argv.findIndex(a => a.endsWith('save-tool.cjs')) + 1);

app.whenReady().then(async () => {
  protocol.handle('app', () => new Response('<!doctype html><title>save-tool</title>', { headers: { 'Content-Type': 'text/html' } }));
  const win = new BrowserWindow({ show: false });
  await win.loadURL('app://kobe/save-tool.html');
  const run = js => win.webContents.executeJavaScript(js);
  try {
    if (mode === 'list') {
      const rows = await run(`Array.from({ length: 6 }, (_, i) => { const v = localStorage.getItem('${PREFIX}' + i); if (!v) return i + ': (空)'; try { const m = JSON.parse(v).meta; return i + ': ' + new Date(m.timestamp).toLocaleString() + '  ' + (m.playerName || '') + '  ' + (m.isAutoSave ? '[自动]' : '') + '  ' + String(m.previewText || '').replace(/<[^>]+>/g, '').slice(0, 30); } catch { return i + ': (读不懂)'; } }).join('\\n')`);
      console.log(rows);
    } else if (mode === 'write') {
      const slot = Number(slotArg);
      if (!(slot >= 1 && slot <= 5)) throw new Error('槽位只能是 1-5（0 是自动存档）');
      const json = fs.readFileSync(file, 'utf8');
      JSON.parse(json);
      const old = await run(`localStorage.getItem('${PREFIX}${slot}')`);
      if (old) {
        const dir = path.join(app.getPath('userData'), 'save-tool-backup');
        fs.mkdirSync(dir, { recursive: true });
        const bk = path.join(dir, `slot${slot}-${Date.now()}.json`);
        fs.writeFileSync(bk, old);
        console.log(`原来的槽位 ${slot} 备份到 ${bk}`);
      }
      await run(`localStorage.setItem('${PREFIX}${slot}', ${JSON.stringify(json)}); 'ok'`);
      const back = await run(`localStorage.getItem('${PREFIX}${slot}').length`);
      console.log(`写好了：槽位 ${slot}（${back} 字节）`);
    } else {
      console.log('用法：list | write <1-5> <存档.json>');
    }
  } catch (e) {
    console.error('出错：' + e.message);
    process.exitCode = 1;
  }
  // 让 localStorage 落盘再退出
  await win.webContents.session.flushStorageData();
  setTimeout(() => app.quit(), 500);
});
