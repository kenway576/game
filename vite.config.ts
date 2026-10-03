import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { localSaves } from './scripts/vite-local-saves';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        // 默认 3000（start_game.bat / npm run dev 照旧）；预览工具会通过 PORT 指定另一个端口，
        // 这样你自己开着的那个 dev server 和预览可以同时跑，不抢端口。
        port: Number(process.env.PORT) || 3000,
        // 端口被占就报错，而不是悄悄换成 3001：网址一变，浏览器里的存档就"不见了"。
        // （启动脚本会先看游戏是不是已经开着，开着就直接打开浏览器。）
        strictPort: true,
        host: '0.0.0.0',
        watch: {
          ignored: ['**/release/**', '**/dist-desktop/**', '**/dist/**', '**/.backup-originals/**', '**/.git/**']
        }
      },
      plugins: [react(), localSaves()],
      define: {
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
