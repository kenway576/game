// 把约会地点、换装亮相导出成 JSON，给 gen-variety.mjs 当上下文（esbuild 打包后用 node 跑）
import fs from 'fs';
import '../../constants';
import { DATE_SPOTS } from '../../story/dateSpots';
import { OUTFIT_REVEALS, REVEAL_RESPONSES } from '../../story/outfitReveals';

fs.mkdirSync('.generated/variety', { recursive: true });
fs.writeFileSync('.generated/variety/spots.json', JSON.stringify(DATE_SPOTS.map(s => ({
  id: s.id, nameZh: s.nameZh, nameEn: s.nameEn, nameJp: s.nameJp, blurbZh: s.blurbZh, tag: s.tag, mood: s.mood, slots: s.slots,
  arrive: s.arrive, beats: s.beats, choice: { prompt: s.choice.prompt, options: s.choice.options.map(o => ({ labelZh: o.labelZh, jp: o.jp, hintZh: o.hintZh })) }
})), null, 1));
fs.writeFileSync('.generated/variety/reveals.json', JSON.stringify({ reveals: OUTFIT_REVEALS, responses: REVEAL_RESPONSES }, null, 1));
console.log('spots', DATE_SPOTS.length, 'reveal outfits', Object.values(OUTFIT_REVEALS).reduce((n, o) => n + Object.keys(o).length, 0));
