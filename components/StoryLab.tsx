import React, { useState } from 'react';
import StoryScreen from './StoryScreen';
import { MAIN_CHAPTERS } from '../story/mainStory';
import { RIVAL_CHAPTERS, KAI_DAY1 } from '../story/rivalStory';
import { NUNOBIKI_EVENTS, nunobikiApproach } from '../story/nunobikiStory';
import { SCENE_MAP, LEVEL_STORIES } from '../constants';
import { EPILOGUES } from '../story/epilogue';
import { futureLabScript } from '../story/futurePath';
import { EPILOGUE_FILMS } from '../data/epilogueFilms';
import OpeningMovie from './OpeningMovie';
import { CharacterId } from '../types';
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
  const ch = [...MAIN_CHAPTERS, ...RIVAL_CHAPTERS].find(c => c.id === id);
  // ?story=kai_day1：开学第一天金城登场那一段
  // ?story=ev_nunobiki_*：先走上山那一段，再演到了以后的事件（&slot=night 试夜里只能坐缆车）
  const nb = NUNOBIKI_EVENTS.find(e => e.id === id);
  // ?story=asuka_4 之类：任意一段专属剧情（LEVEL_STORIES 的 id）
  const lv = Object.values(LEVEL_STORIES).flat().find(d => d?.id === id);
  // ?story=epilogue_asuka：后日谈的剧本部分（动画另放）
  const ep = id.startsWith('epilogue_') ? EPILOGUES[id.slice(9) as CharacterId] : null;
  // ?story=goal_result&stats=75,40,40,35,30&words=900：进路线（story/futurePath.ts）按给定五维试播
  const st = (q.get('stats') || '60,60,60,60,60').split(',').map(Number);
  const goalStats = { knowledge: st[0], guts: st[1], kindness: st[2], charm: st[3], proficiency: st[4] };
  const script: StoryNode[] = id.startsWith('goal_') ? futureLabScript(id, goalStats, Number(q.get('words') || 800))
    : id === 'kai_day1' ? KAI_DAY1
    : lv ? lv.script || []
    : ep ? ep.script
    : nb ? [...nunobikiApproach({ timeSlot: q.get('slot') || 'afternoon' } as any, flags), ...nb.script]
    : ch?.script || [];
  const [scene, setScene] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const note = (s: string) => setLog(l => [...l.slice(-6), s]);
  const [key] = useState(() => `storylab_${id}_${Date.now()}`);

  // ?op：直接放开场动画（data/opening.ts）
  if (q.has('op')) return <OpeningMovie language="zh" onClose={() => {}} />;
  // ?story=epilogue_asuka&film（&flags=asuka_ending_love）：直接放后日谈那一分钟动画
  if (ep && q.has('film')) {
    const c = id.slice(9);
    const film = EPILOGUE_FILMS[c];
    return (
      <OpeningMovie
        language="zh"
        shots={film.shots}
        music={film.music}
        subtitles={flags[`${c}_ending_love`] ? ep.love : ep.friend}
        playerName={q.get('name') || ''}
        playLabelZh="播放后日谈"
        onClose={() => {}}
      />
    );
  }
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
