// ---------------------------------------------------------
// 🎴 剧情 CG 分镜：读剧本 → 让文字模型挑出每一段"最该画的那一下"
//
//   node scripts/remake/plan-event-cg.mjs [--only hikari1,group_ramen] [--force]
//
// 输出 .generated/event-cg/plan.json（每段一条：谁、穿哪套、在哪、什么光、什么镜头）。
// 人工过一遍再交给 gen-event-cg-v3.mjs 出图。已经有的条目不重跑（--force 重跑）。
// ---------------------------------------------------------
import fs from 'fs';
import { generate } from '../lib/gemini.mjs';
import { CARDS } from './cards.mjs';
import { OUTFITS } from './outfits.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const OUT = '.generated/event-cg/plan.json';
const plan = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};

// 剧本切片：[id, 文件, 起始行, 结束行, 附加说明]
const lines = f => fs.readFileSync(f, 'utf8').split('\n');
const L = 'story/levelStories/';
const JOBS = [];
for (const c of ['asuka', 'hikari', 'rei', 'inari', 'miyuki', 'sora', 'nao', 'maki'])
  for (const n of [1, 2, 3]) JOBS.push([`${c}${n}`, c === 'asuka' && n === 2 ? L + 'asuka.ts' : L + `${c}${n}.ts`, 1, 99999,
    n === 3 ? 'This is her final, romantic story (the confession / "lovers" ending). Pick the most romantic, emotional peak.' : '']);
JOBS.push(
  ['main2', 'story/mainStory.ts', 63, 206, 'Main story chapter. Only Inari is present.'],
  ['main3', 'story/mainStory.ts', 207, 353, 'Main story chapter. Only Inari is present.'],
  ['main4', 'story/mainStory.ts', 354, 517, 'Main story chapter. Only Inari is present.'],
  ['main5', 'story/mainStory.ts', 518, 671, 'Main story chapter. Only Inari is present. Respectful of the 1995 earthquake: quiet, no destruction imagery.'],
  ['main6', 'story/mainStory.ts', 672, 907, 'Final main story chapter. Only Inari is present.'],
  ['group_ramen', 'story/groupEvents.ts', 28, 337, 'Group event: Sora and Maki.'],
  ['group_meriken', 'story/groupEvents.ts', 338, 627, 'Group event: Hikari, Rei and Asuka.'],
  ['group_wheel', 'story/groupEvents.ts', 628, 920, 'Group event: Nao, Miyuki and Inari in a Ferris wheel gondola at night.'],
  ['fest_halloween', 'story/festivalEvents.ts', 1, 141, 'Halloween on Kitano-zaka. Choose the 3 heroines whose costumes make the best picture together.'],
  ['fest_day1', 'story/festivalEvents.ts', 142, 269, 'School festival day one: the class maid cafe. Up to 3 heroines.'],
  ['fest_bonfire', 'story/festivalEvents.ts', 270, 364, 'School festival closing night bonfire (後夜祭). Up to 3 heroines, around the bonfire at night.'],
  ['trip_sea', 'story/schoolTrip.ts', 153, 262, 'School trip to Okinawa, the November sea. Miyuki is not a student and is NOT on the trip. Up to 3 heroines.'],
  ['trip_night', 'story/schoolTrip.ts', 263, 384, 'School trip, night at the hotel. Miyuki is NOT on the trip. Up to 3 heroines.'],
  ['year_end', 'story/yearEnd.ts', 1, 214, 'The closing ceremony / last day. The script names no heroine — make it a picture of the empty-feeling last day, with at most one or two classmates seen from behind, or none.']
);

// 每个人能穿的衣服（键 → 一句话）
const outfitList = c => {
  const uni = CARDS.find(x => x.id === c)?.uniform || '';
  const o = { [c === 'miyuki' ? 'cardigan' : 'school']: uni.slice(0, 160) };
  for (const [k, v] of Object.entries(OUTFITS[c] || {})) o[k] = v.outfit.slice(0, 160);
  return o;
};
const CAST = CARDS.map(c => `- ${c.id}: ${c.identity}\n  outfits: ${Object.entries(outfitList(c.id)).map(([k, v]) => `"${k}" (${v}…)`).join('; ')}`).join('\n');

const INSTR = `You are the art director of a Japanese visual novel set in Kobe. The player character ("you", a male exchange student) is the camera: he is NEVER drawn (at most his hand or sleeve at the frame edge).
For the story script below, choose the ONE moment that most deserves a full-screen event CG — the emotional peak, visually striking, and specific to this story (its props, place, season and time of day).

CAST (exact looks) and the outfits each one owns:
${CAST}

Return ONLY a JSON object:
{
 "titleZh": "short Chinese title of the story",
 "momentZh": "one Chinese sentence: what happens in the picture",
 "chars": [{"id": "hikari", "outfit": "<one of her outfit keys, matching what the script implies for the season/occasion>"}],
 "scene": "English, 4-7 sentences: the place with concrete Kobe/Japanese details, season, time, what each girl is doing, her pose, hands, expression and where she looks (usually at the viewer), key story props",
 "light": "English, 2-3 sentences: a motivated, dramatic, colourful lighting design (key light, colour contrast, rim light, atmosphere such as rain, steam, snow, petals, sparks, bokeh)",
 "camera": "English, 1-2 sentences: angle and framing. The girl(s) must be LARGE in frame (waist-up to thigh-up), with a foreground element and a clear background"
}
Rules: at most 3 characters; use ONLY outfit keys from the list; no text, signs with words, or UI in the picture; keep it tasteful.`;

const MODELS = ['gemini-3.1-pro-preview', 'gemini-2.5-pro', 'gemini-3-flash-preview'];
const only = arg('only') ? String(arg('only')).split(',') : null;
for (const [id, file, a, b, note] of JOBS) {
  if (only && !only.includes(id)) continue;
  if (plan[id] && !arg('force')) continue;
  const text = lines(file).slice(a - 1, b).join('\n');
  let res;
  for (const model of MODELS) {
    try { res = await generate({ model, textOnly: true, parts: [{ text: `${INSTR}\n\nNOTE: ${note || 'Personal story of one heroine.'}\n\nSCRIPT:\n${text}` }] }); break; }
    catch (e) { console.log(`${id} ${model} 失败：${e.message.slice(0, 120)}`); }
  }
  const m = res?.text?.match(/\{[\s\S]*\}/);
  if (!m) { console.log(`${id} 没拿到 JSON`); continue; }
  try { plan[id] = JSON.parse(m[0]); } catch { console.log(`${id} JSON 解析失败`); continue; }
  for (const ch of plan[id].chars) if (!outfitList(ch.id)[ch.outfit]) console.log(`  ⚠️ ${id}: ${ch.id} 没有 ${ch.outfit} 这套`);
  fs.writeFileSync(OUT, JSON.stringify(plan, null, 1));
  console.log(`${id}  ${plan[id].titleZh}  ${plan[id].chars.map(c => c.id + '/' + c.outfit).join(' ')}  —— ${plan[id].momentZh}`);
}
