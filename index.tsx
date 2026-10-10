import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { bootLocalSaves } from './services/localSaveSync';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 💾 先把电脑上的存档文件同步回浏览器，再启动游戏——
// App 一启动就会读存档，晚一步的话它读到的是空的。
const root = ReactDOM.createRoot(rootElement);
// 🧪 开发用：?puppet 打开木偶调试台，不进游戏
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('puppet')) {
  import('./components/PuppetLab').then(({ default: PuppetLab }) => root.render(<PuppetLab />));
} else if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('minigame')) {
  // 🧪 开发用：?minigame=rhythm|haiku 直接打开小游戏，不碰存档
  import('./components/MinigameLab').then(({ default: MinigameLab }) => root.render(<MinigameLab />));
} else if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('story')) {
  // 🧪 开发用：?story=main_ch7 直接试播一章剧本，不碰存档
  import('./components/StoryLab').then(({ default: StoryLab }) => root.render(<StoryLab />));
} else bootLocalSaves().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
