import React, { useState } from 'react';
import RhythmArcadeModal from './RhythmArcadeModal';
import HaikuKukaiModal from './HaikuKukaiModal';
import { PracticeTier } from '../types';

// 🧪 开发用小游戏试玩台：不读也不写存档，直接把小游戏打开
//   /?minigame=rhythm&tier=2      /?minigame=haiku&tier=1      加 &intro 从规则说明开始
const MinigameLab: React.FC = () => {
  const q = new URLSearchParams(window.location.search);
  const which = q.get('minigame') || 'rhythm';
  const tier = Math.min(3, Math.max(1, Number(q.get('tier') || 1))) as PracticeTier;
  const [seen, setSeen] = useState<Record<string, boolean>>(q.has('intro') ? {} : { minigame_intro_rhythm: true, minigame_intro_hyakunin: true, minigame_intro_haiku: true });
  const [log, setLog] = useState('');
  const [key, setKey] = useState(0);
  const done = (r: unknown) => { setLog(JSON.stringify(r)); setKey(k => k + 1); };
  const props = { language: 'zh' as const, tier, introSeen: seen, onSeenIntro: (k: string) => setSeen(s => ({ ...s, [k]: true })), onFinish: done, onCancel: () => { setLog('cancel'); setKey(k => k + 1); } };
  return (
    <div className="fixed inset-0 bg-black">
      {which === 'haiku' ? <HaikuKukaiModal key={key} {...(props as any)} /> : <RhythmArcadeModal key={key} {...props} />}
      <div id="minigame-log" className="fixed bottom-1 right-1 z-[999] text-[10px] text-lime-300 pointer-events-none">{log}</div>
    </div>
  );
};

export default MinigameLab;
