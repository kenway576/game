import React, { useState } from 'react';
import StoryScreen from './StoryScreen';
import { MAIN_CHAPTERS } from '../story/mainStory';
import { SCENE_MAP } from '../constants';
import { StoryNode } from '../types';

// 🧪 开发用剧本试播台：不读也不写任何存档，直接把一章剧本放出来看。
//   /?story=main_ch7&flags=inari_story_3_done,inari_ending_love&aff=inari:240,hikari:230&name=王
// story 可以是主线章节 id（main_ch2 … main_ch7）。
// 进度键带时间戳，每次打开都是从头开始。
const StoryLab: React.FC = () => {
  const q = new URLSearchParams(window.location.search);
  const id = q.get('story') || 'main_ch7';
  const flags = Object.fromEntries((q.get('flags') || '').split(',').filter(Boolean).map(f => [f, true]));
  const aff = Object.fromEntries((q.get('aff') || '').split(',').filter(Boolean).map(p => { const [c, v] = p.split(':'); return [c, Number(v)]; }));
  const ch = MAIN_CHAPTERS.find(c => c.id === id);
  const script: StoryNode[] = ch?.script || [];
  const [scene, setScene] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const note = (s: string) => setLog(l => [...l.slice(-6), s]);
  const [key] = useState(() => `storylab_${id}_${Date.now()}`);

  if (!script.length) return <div style={{ color: '#fff', padding: 24 }}>没有这一章：{id}</div>;
  const bg = SCENE_MAP[scene];
  return (
    <div className="fixed inset-0 bg-black">
      <StoryScreen
        script={script}
        scriptVersion={`${id}-lab`}
        progressKey={key}
        chapterNameZh={id}
        chapterNameEn={id}
        initialFlags={flags}
        affectionMap={aff}
        language="zh"
        stats={{ knowledge: 60, guts: 60, kindness: 60, charm: 60, proficiency: 60 } as any}
        background={bg ? <img src={bg} className="absolute inset-0 w-full h-full object-cover" alt="" /> : null}
        playerName={q.get('name') || '王'}
        onSetPlayerName={() => {}}
        onOpenSystemMenu={() => {}}
        onEffects={() => {}}
        onRelations={() => {}}
        onFlags={f => note('flags: ' + f.join(','))}
        onSceneChange={setScene}
        onCollectWords={() => {}}
        onUnlockCg={c => note('cg: ' + c)}
        onRestore={() => {}}
        onFinish={() => note('— 播完了 —')}
      />
      <div id="storylab-log" className="fixed top-2 left-2 z-[999] text-[10px] text-lime-300 bg-black/60 px-2 py-1 pointer-events-none whitespace-pre">
        {log.join('\n')}
      </div>
    </div>
  );
};

export default StoryLab;
