import { useSyncExternalStore } from 'react';
import { audioManager, AudioSettings } from '../services/audioManager';

// 订阅 audioManager 的音量 / 静音状态。仅设置面板（SystemMenu）需要用到，
// 其它组件不订阅，避免无谓重渲染。
export function useAudioSettings(): AudioSettings {
  return useSyncExternalStore(audioManager.subscribe, audioManager.getSnapshot, audioManager.getSnapshot);
}
