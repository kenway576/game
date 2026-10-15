// 用 Vite 的 SSR 加载器跑一个 .ts 脚本（游戏的模块之间有循环引用，esbuild 打包后初始化顺序会乱）
//   node scripts/grammar/run-ts.mjs scripts/grammar/dump-content.ts
// configFile: false —— 不加载 vite.config 里那个同步存档的插件
import { createServer } from 'vite';
const file = process.argv[2];
const server = await createServer({ configFile: false, logLevel: 'error', server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
try {
  await server.ssrLoadModule('/' + file.replace(/\\/g, '/'));
} finally {
  await server.close();
}
