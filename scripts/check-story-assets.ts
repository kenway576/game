// 剧本里引用的立绘 / 场景 / CG 是否都存在（开发用）
//   node scripts/check-story-assets.mjs
import fs from 'fs';
import { MAIN_CHAPTERS } from '../story/mainStory';
import { INARI_STORY_1 } from '../story/levelStories/inari1';
import { INARI_STORY_2 } from '../story/levelStories/inari2';
import { INARI_STORY_3 } from '../story/levelStories/inari3';
import { HIKARI_STORY_3 } from '../story/levelStories/hikari3';
import { SCENE_MAP } from '../constants';
import { StoryNode } from '../types';

const bad: string[] = [];
const walk = (nodes: StoryNode[], where: string) => {
  for (const n of nodes) {
    if (!n) { bad.push(`${where}: 空节点`); continue; }
    const img = (n as any).characterImage;
    if (img && !fs.existsSync('public' + img)) bad.push(`${where}: 立绘不存在 ${img}`);
    if (n.type === 'scene' && !(SCENE_MAP as any)[n.scene]) bad.push(`${where}: 场景不存在 ${n.scene}`);
    if (n.type === 'cg' && !fs.existsSync('public' + n.imageUrl)) bad.push(`${where}: CG 还没有 ${n.imageUrl}`);
    if (n.type === 'branch') { walk(n.then, where); walk(n.otherwise || [], where); }
    if (n.type === 'check') { walk(n.then, where); walk(n.otherwise || [], where); }
    if (n.type === 'choice') for (const o of n.options) walk((o as any).then || [], where);
    if (n.type === 'heart') { for (const [c, r] of Object.entries(n.routes)) walk(r as StoryNode[], `${where}/${c}`); walk(n.otherwise || [], where); }
  }
};
for (const ch of MAIN_CHAPTERS) walk(ch.script, ch.id);
walk(INARI_STORY_1, 'inari1'); walk(INARI_STORY_2, 'inari2'); walk(INARI_STORY_3, 'inari3'); walk(HIKARI_STORY_3, 'hikari3');
console.log(bad.length ? bad.join('\n') : '全部存在');
