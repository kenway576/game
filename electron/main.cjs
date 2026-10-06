// ==========================================================
// 🖥️ 桌面版外壳（Electron）
//
// 做的事情只有四件：
//   1. 开一个游戏窗口，把 dist/ 里打包好的网页放进去
//   2. 存档：游戏本来就把存档写在 localStorage 里，这里只是把它
//      固定落在 %APPDATA%\KobeStudy\ 下面——卸载重装、换版本都不会丢
//   3. 像个游戏：F11 / Alt+Enter 全屏，记住窗口大小，外部链接用系统浏览器开
//   4. 同一时间只允许开一个（两个窗口同时写存档会把它写坏）
//
// 【为什么用自定义协议 app:// 而不是直接 file://】
// 游戏里所有图片都是以 / 开头的绝对路径（/images/characters/...）。
// 用 file:// 打开的话，/images 会被解析成 C:\images，一张图都显示不出来。
// app://kobe/ 是一个"假的网站根目录"，/images 就对了。
// 而且 localStorage 是按"来源"存的——来源固定是 app://kobe，
// 存档就永远在同一个地方，不会因为换了端口什么的就"消失"。
// ==========================================================
const { app, BrowserWindow, protocol, shell, session } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_NAME = 'KobeStudy';
const SCHEME = 'app';
const HOST = 'kobe';

// 存档目录要在 ready 之前定死。以后改 productName 也不会把存档挪走。
app.setName(APP_NAME);
app.setPath('userData', path.join(app.getPath('appData'), APP_NAME));

// 只开一个
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// BGM 在标题画面就要能响，不等玩家先点一下
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

protocol.registerSchemesAsPrivileged([{
  scheme: SCHEME,
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true }
}]);

const DIST = path.join(__dirname, '..', 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.webm': 'video/webm', '.mp4': 'video/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8'
};

const serve = async (request) => {
  const url = new URL(request.url);
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.normalize(path.join(DIST, rel));
  // 不许跑出 dist 目录
  if (!file.startsWith(DIST)) return new Response('Forbidden', { status: 403 });
  try {
    const data = await fs.promises.readFile(file);
    return new Response(data, { headers: { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' } });
  } catch {
    // 找不到的文件：带扩展名的就是真的没有（缺图）；不带的当作页面路由，回 index.html
    if (path.extname(rel)) return new Response('Not found', { status: 404 });
    const html = await fs.promises.readFile(path.join(DIST, 'index.html'));
    return new Response(html, { headers: { 'Content-Type': MIME['.html'] } });
  }
};

// ---------- 窗口大小记忆 ----------
const STATE_FILE = () => path.join(app.getPath('userData'), 'window.json');
const loadState = () => {
  try { return JSON.parse(fs.readFileSync(STATE_FILE(), 'utf8')); } catch { return {}; }
};
const saveState = (win) => {
  try {
    const fullscreen = win.isFullScreen();
    const bounds = fullscreen ? (loadState().bounds || win.getBounds()) : win.getBounds();
    fs.writeFileSync(STATE_FILE(), JSON.stringify({ bounds, fullscreen, maximized: win.isMaximized() }));
  } catch { /* 写不了就算了，下次用默认大小 */ }
};

let win = null;

const createWindow = () => {
  const st = loadState();
  win = new BrowserWindow({
    width: st.bounds?.width || 1280,
    height: st.bounds?.height || 760,
    x: st.bounds?.x, y: st.bounds?.y,
    minWidth: 960, minHeight: 560,
    backgroundColor: '#000000',
    title: 'Kobe Study',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });
  win.removeMenu();
  if (st.maximized) win.maximize();
  if (st.fullscreen) win.setFullScreen(true);
  win.once('ready-to-show', () => win.show());

  // 开发时可以指向 vite dev server：KOBE_DEV_URL=http://localhost:3000
  win.loadURL(process.env.KOBE_DEV_URL || `${SCHEME}://${HOST}/index.html`);

  // 全屏快捷键；打包后的版本不给开发者工具
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11' || (input.alt && input.key === 'Enter')) {
      win.setFullScreen(!win.isFullScreen());
      e.preventDefault();
    } else if (!app.isPackaged && input.control && input.shift && input.key.toLowerCase() === 'i') {
      win.webContents.toggleDevTools();
    }
  });

  // 外部链接（申请 API key 的网页之类）用系统浏览器打开，不在游戏窗口里跳走
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(`${SCHEME}://`) && !url.startsWith(process.env.KOBE_DEV_URL || '\u0000')) {
      e.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  // 窗口一调整就记（防抖 400ms），关窗时再补一次。
  // 只靠 close 事件不可靠：页面里调 window.close() 时它不一定先触发。
  let t = null;
  const remember = () => { clearTimeout(t); t = setTimeout(() => saveState(win), 400); };
  ['resize', 'move', 'maximize', 'unmaximize', 'enter-full-screen', 'leave-full-screen'].forEach(ev => win.on(ev, remember));
  win.on('close', () => { clearTimeout(t); saveState(win); });
};

app.on('second-instance', () => {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.focus();
});

app.whenReady().then(() => {
  protocol.handle(SCHEME, serve);
  // 调 AI 接口时，有的服务商只认 http(s) 来源的跨域请求。
  // 浏览器版从 localhost 发请求没问题；桌面版的来源是 app://kobe，
  // 这里把响应补上允许跨域的头，让它跟浏览器版表现一致。
  session.defaultSession.webRequest.onHeadersReceived({ urls: ['https://*/*'] }, (details, cb) => {
    const h = details.responseHeaders || {};
    const has = Object.keys(h).some(k => k.toLowerCase() === 'access-control-allow-origin');
    if (!has) {
      h['Access-Control-Allow-Origin'] = ['*'];
      h['Access-Control-Allow-Headers'] = ['*'];
      h['Access-Control-Allow-Methods'] = ['GET, POST, OPTIONS'];
    }
    cb({ responseHeaders: h });
  });
  createWindow();
});

app.on('window-all-closed', () => app.quit());
