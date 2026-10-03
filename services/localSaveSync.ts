// ---------------------------------------------------------
// 💾 浏览器存档 ⇄ 电脑上的存档文件（见 scripts/vite-local-saves.ts）
//
// 游戏里所有地方照旧读写 localStorage，一行都不用改：
// 这里在 localStorage.setItem / removeItem 外面包一层，
// 凡是 kobe_ 开头的键（API Key 除外）写进来，就顺手存一份到磁盘。
//
// 启动的时候反过来：磁盘上有、浏览器里没有的，补回浏览器；
// 两边都有的，谁新用谁（每个键记一个时间戳）。
// 所以换了浏览器、清了缓存、端口变了，打开游戏存档都还在。
//
// 接口不在（比如直接打开 dist 静态文件）就什么也不做，游戏照常跑。
// ---------------------------------------------------------

const ROUTE = '/__local_saves';
const META_KEY = 'kobesync_meta_v1';     // 每个键最后一次写的时间。本身不同步。
const NEVER = new Set(['kobe_study_user_api_key']);
const mirrored = (key: string) => key.startsWith('kobe_') && !NEVER.has(key);

const nativeSet = Storage.prototype.setItem;
const nativeRemove = Storage.prototype.removeItem;

let enabled = false;
const pending = new Map<string, number>();   // key → 计时器
const DEBOUNCE_MS = 400;

const readMeta = (): Record<string, number> => {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch { return {}; }
};
const writeMeta = (m: Record<string, number>) => {
  try { nativeSet.call(localStorage, META_KEY, JSON.stringify(m)); } catch { /* 存不下就算了 */ }
};
const touch = (key: string, at = Date.now()) => {
  const m = readMeta();
  m[key] = at;
  writeMeta(m);
  return at;
};

const push = (key: string) => {
  const value = localStorage.getItem(key);
  const savedAt = readMeta()[key] || Date.now();
  const url = `${ROUTE}/${encodeURIComponent(key)}`;
  if (value === null) {
    fetch(url, { method: 'DELETE' }).catch(() => {});
    return;
  }
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, savedAt })
  }).catch(() => {});
};

const schedule = (key: string) => {
  if (!enabled) return;
  const t = pending.get(key);
  if (t) clearTimeout(t);
  pending.set(key, window.setTimeout(() => { pending.delete(key); push(key); }, DEBOUNCE_MS));
};

// 关页面的时候，还没来得及发出去的那几条用 sendBeacon 送走
const flushOnLeave = () => {
  if (!enabled) return;
  for (const [key, t] of pending) {
    clearTimeout(t);
    const value = localStorage.getItem(key);
    if (value === null) continue;
    const body = new Blob([JSON.stringify({ value, savedAt: readMeta()[key] || Date.now() })], { type: 'application/json' });
    navigator.sendBeacon?.(`${ROUTE}/${encodeURIComponent(key)}`, body);
  }
  pending.clear();
};

const patchStorage = () => {
  Storage.prototype.setItem = function (key: string, value: string) {
    nativeSet.call(this, key, value);
    if (this === window.localStorage && mirrored(key)) { touch(key); schedule(key); }
  };
  Storage.prototype.removeItem = function (key: string) {
    nativeRemove.call(this, key);
    if (this === window.localStorage && mirrored(key)) { touch(key); schedule(key); }
  };
  window.addEventListener('pagehide', flushOnLeave);
};

export const bootLocalSaves = async (): Promise<void> => {
  patchStorage();
  try {
    const res = await fetch(ROUTE, { cache: 'no-store' });
    if (!res.ok) return;
    const { saves } = (await res.json()) as { saves: Record<string, { value: string; savedAt: number }> };
    const meta = readMeta();
    // 磁盘上更新的 → 写回浏览器
    for (const [key, rec] of Object.entries(saves || {})) {
      if (!mirrored(key)) continue;
      const local = localStorage.getItem(key);
      const localAt = meta[key] || 0;
      if (local === null || rec.savedAt > localAt) {
        nativeSet.call(localStorage, key, rec.value);
        meta[key] = rec.savedAt;
      }
    }
    writeMeta(meta);
    enabled = true;
    // 上面已经把磁盘上更新的写回来了；现在还对不上的，就是浏览器这边更新（或者磁盘上还没有）→ 存到磁盘
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && mirrored(key)) keys.push(key);
    }
    for (const key of keys) {
      const disk = saves?.[key];
      if (disk && disk.value === localStorage.getItem(key)) continue;
      if (!meta[key]) touch(key);
      push(key);
    }
  } catch {
    // 没有接口（静态部署、离线）：只用浏览器存档
  }
};
