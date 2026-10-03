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
bootLocalSaves().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
