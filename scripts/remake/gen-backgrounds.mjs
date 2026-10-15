// ---------------------------------------------------------
// 🏞️ 补背景：剧情里"借别处的图顶着"的那些地方，各画一张自己的
//
//   node scripts/remake/gen-backgrounds.mjs [--only key1,key2] [--n 1]
//
// 盘点用 scripts/audit-backgrounds.mjs + 按剧情时间地点人工核对：
// 不是"没图"，是一张图被拿去顶了很多不该它顶的场面——后夜祭的操场用的是黄昏教室，
// 时间回溯的雾坡用的是热闹的居酒屋街，夜里的体育馆用的是白天的……
//
// 画风对齐现有背景（新海诚式的高饱和、电影光，无人物）。
// 同一个地方的变体（夜晚、下雪）把原图一起送进去当构图参考，保证看得出是同一个地方。
// 输出 .generated/backgrounds/<key>_<n>.png（2K），挑好的再转 webp 装进 public/images/backgrounds/
// ---------------------------------------------------------
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generate, imagePart } from '../lib/gemini.mjs';
sharp.cache(false);

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const BG = 'public/images/backgrounds/';
const OUT = '.generated/backgrounds';
fs.mkdirSync(OUT, { recursive: true });

const STYLE = `ART STYLE: a background illustration for a Japanese visual novel, exactly in the style of the STYLE REFERENCE backgrounds: Makoto Shinkai-like anime background art, clean detailed linework, rich saturated colours, cinematic lighting with volumetric light, soft bloom, reflective surfaces, highly detailed and polished, 16:9.
STRICT RULES: absolutely NO people or characters anywhere (it is an empty stage for characters to be placed on later). NO readable text, NO letters, NO logos, NO watermark — signs, posters and boards may only show blurred, unreadable shapes. Leave the lower-middle part of the frame relatively uncluttered (characters will stand there).`;

// 风格参考：一张室内、一张室外
const STYLE_REFS = [BG + 'bg_classroom_morning.webp', BG + 'bg_kobe_harbor_dusk.webp'];

// key：SCENE_MAP 里的新键；base：同一个地方的现有图（变体时给构图参考）
const JOBS = [
  { key: 'field_bonfire_night', prompt: 'A Japanese high school sports ground at night during the closing night of the school festival (後夜祭): a large crackling bonfire in the middle of the dirt field, sparks spiralling up into a deep indigo starry sky, the warm orange glow lighting the ground, the school building behind with a few lit windows, paper lanterns and festival bunting strung along the fence, a cardboard festival sign burning at the edge of the fire.' },
  { key: 'home_ec_room', prompt: 'A Japanese high school home economics room (家庭科室) in the late morning: rows of large cooking-island tables each with a sink and gas hobs, sewing machines on a side table, aprons hanging on hooks, bright window light across stainless steel and pale wood, a few bowls and a cutting board left out.' },
  { key: 'school_track_field', prompt: 'A Japanese high school outdoor sports ground (校庭) on a clear day: a reddish-brown dirt running track with white lane lines curving around the field, a soccer goal, a low concrete step-stand along one side, cherry and zelkova trees along the fence, the four-storey concrete school building in the background, big summer clouds in a blue sky, Kobe mountains in the distance.' },
  { key: 'student_council_room', prompt: 'An empty Japanese high school student council room (生徒会室) on a quiet holiday afternoon: a long meeting table with folding chairs, a whiteboard with faint unreadable notes, steel shelves crammed with binders and boxes of festival supplies, a kettle and mugs on a cabinet, soft slanted sunlight and dust motes from the window.' },
  { key: 'classroom_night', base: 'bg_classroom_morning.webp', prompt: 'The same Japanese high school classroom at night, eight in the evening on the eve of the school festival: desks pushed to the walls, the middle of the room taken up by a half-finished cardboard shop-street facade three tiers tall, paint pots, tape, scissors and paper flowers on the floor, fluorescent lights on, the windows black with the city lights of Kobe far below.' },
  { key: 'rooftop_day', base: 'bg_school_rooftop_sunset.webp', prompt: 'The same school rooftop in the middle of a bright clear day: blue sky with soft white clouds, the green chain-link fence, the benches, and beyond it a wide daytime view of Kobe harbour with the red Port Tower and the Ferris wheel small in the distance, crisp sunlight.' },
  { key: 'rooftop_night', base: 'bg_school_rooftop_sunset.webp', prompt: 'The same school rooftop late on a clear winter night: a sky full of stars over the fence, the glittering night view of Kobe harbour and the lit red Port Tower below, cold blue moonlight on the concrete, a telescope on a tripod standing near the fence.' },
  { key: 'gym_night', base: 'gym.webp', prompt: 'The same school gymnasium at night, almost dark: only one row of ceiling lights on, casting a single pool of warm light on the polished wooden court, the rest of the hall in deep blue shadow, black windows, a lone basketball resting on the floor in the light.' },
  { key: 'school_hallway_festival', base: 'bg_school_hallway.webp', prompt: 'The same school corridor during the school festival: colourful hand-painted signs and paper decorations along the walls and doorways, paper chains and balloons, a cardboard haunted-house entrance, takoyaki stall tables, warm afternoon light, lively but empty of people.' },
  { key: 'ikuta_hill_fog', prompt: 'A narrow sloping street leading up to a shrine in Kobe at about four in the morning, wrapped in an unusually thick fog: streetlamps turned into soft glowing blobs, the outline of a large vermilion torii barely visible at the top of the slope, wet stone paving, silent and dreamlike, blue-grey pre-dawn light.' },
  { key: 'ikuta_forest_1184', prompt: 'A vast ancient forest of huge camphor and cedar trees in the year 1184, the morning after a battle: thin smoke drifting between the trunks in god-rays of pale gold dawn light, broken arrows in the moss, a plain fallen war banner far back in the undergrowth, and in the foreground a half-burned old plum tree still in pink blossom on charred black branches. No modern buildings at all. Dreamlike, hushed, beautiful.' },
  { key: 'apartment_balcony_night', base: 'bg_umikaze_balcony_harbor.webp', prompt: 'The same small apartment balcony overlooking Kobe harbour at two in the morning: dark navy sky, the harbour lights and a lit ship far out on the water, a single warm light from the room behind the glass door, a mug of tea on the railing ledge, quiet and a little lonely.' },
  { key: 'ikuta_shrine_snow', base: 'bg_ikuta_shrine_main.webp', prompt: 'The same Ikuta Shrine main hall at six in the morning after the first snow of the year: a thin unbroken layer of fresh snow on the stone approach with no footprints, snow on the vermilion roof and the lanterns, the trees are BARE winter trees and evergreens with snow on their branches (absolutely no cherry blossoms, no flowers — it is midwinter), light snowflakes still falling, the first pale gold sunlight breaking through between the office buildings behind, blue-violet dawn shadows.' },
  { key: 'ikuta_shrine_night', base: 'bg_ikuta_shrine_main.webp', prompt: 'The same Ikuta Shrine grounds on an October evening just after dark: deep blue sky, three stone lanterns lit and a fourth one dark, warm light on the vermilion hall, long shadows on the stone paving, a few fallen leaves, hushed.' },
  { key: 'ikuta_shrine_gate_night', base: 'bg_ikuta_shrine_gate.webp', prompt: 'The same great vermilion torii of Ikuta Shrine at night in winter: dark sky, stone lanterns glowing warm, the torii lit from below, cold blue shadows, a few stars, the paint at the base of the pillars a shade paler, quiet and solemn.' },
  { key: 'kobe_harbor_fireworks', base: 'bg_kobe_harbor_dusk.webp', prompt: 'The same Kobe harbour view on an August evening during the Minato Kobe fireworks festival: huge colourful fireworks bursting over the sea, their reflections on the water, the lit red Port Tower and the Ferris wheel silhouetted, early-night blue sky with the last orange glow at the horizon, paper lanterns along the promenade.' },
  { key: 'ferris_wheel_gondola', prompt: 'The interior of a small Ferris wheel gondola at night, seen from one bench looking at the empty bench opposite: curved glass windows all round, through them the glittering night view of Kobe harbour with the red Port Tower and the city lights reflected in the sea, the gondola softly lit by the coloured LED lights of the wheel, intimate and quiet.' },
  { key: 'livehouse_entrance', prompt: 'The entrance of a small live music venue under the elevated railway tracks in Kobe Motomachi at night: a short flight of worn concrete steps leading down to a heavy black door covered in band stickers (unreadable), a dim neon sign glow in pink and purple, posters on the wall (unreadable), the steel girders of the overhead railway above, a puddle reflecting the light.' },
  { key: 'trip_hotel_room', prompt: 'A Japanese-style hotel room on a school trip in Okinawa late at night after lights-out: tatami floor with futons laid out in a row, a low table in the middle covered with playing cards, snack bags and canned drinks, a paper floor lamp giving warm light, shoji screens, the window showing a dark night sea.' },
  { key: 'train_interior_night', base: 'bg_jr_train_interior.webp', prompt: 'The same Japanese commuter train carriage at eight in the evening on the way home: long bench seats, warm interior lights, the windows black with the night outside and streaks of passing city lights, hanging straps swaying, a quiet tired atmosphere.' },
  // ---- 宿敌线（story/rivalStory.ts）----
  { key: 'school_auditorium_stage', prompt: 'The stage of a Japanese high school assembly hall (講堂) during a speech contest, seen from the side of the audience seats: a wooden podium with a microphone at centre stage under a bright spotlight, a long deep-red stage curtain drawn back, a blank white banner above the stage with only soft unreadable marks, rows of folding chairs in the dim foreground, warm stage light against the darker hall.' },
  { key: 'kobe_harbor_night', base: 'bg_kobe_harbor_dusk.webp', prompt: 'The same Kobe harbour promenade on a cold November night: deep navy sky, the red Port Tower lit up, the Ferris wheel glowing, city lights reflected in long shimmering lines on the dark water, a ferry with lit decks passing, a few bare trees, the railing in the foreground, wintry and quiet.' },
  { key: 'okinawa_fence_sunset', prompt: 'A long chain-link fence topped with coils of razor wire running alongside a quiet road in Ginowan, Okinawa, at sunset: on the far side of the fence a vast, perfectly mown green lawn with a few low white buildings and a distant runway, on this side cracked pavement, a sugar-cane field edge, a red-tiled Okinawan house roof with a small shisa lion statue, tall fukugi trees, a dramatic orange and purple sky with long clouds, melancholic.' },
  { key: 'kitano_slope_dawn', base: 'bg_kitano_slope_night.webp', prompt: 'The same steep Kitano-zaka slope in Kobe at six in the morning in March: the sky just turning pale gold and pink over the sea at the bottom of the slope, the old western-style houses at the top, streetlamps still faintly lit, empty street, cool clear air, a hopeful beginning-of-the-day light.' },
  { key: 'sannomiya_station_dawn', base: 'bg_sannomiya_ticket_gates.webp', prompt: 'The plaza in front of Sannomiya station in Kobe at half past five in the morning, still dark: streetlamps on, the station building lit, empty pavement, a parked chartered bus with its lights on at the kerb, a faint blue glow of dawn behind the buildings, cold and quiet.' },
  // 布引香草园（新地点）：坐缆车 / 爬山路过布引瀑布 / 园里 / 温室 / 夜里
  { key: 'nunobiki_herb_garden', prompt: 'The Nunobiki Herb Garden on the mountainside above Kobe on a clear late-spring afternoon: terraced flower beds of purple lavender, rosemary, mint and colourful herbs stepping down the slope, a European-style stone rest house with a terracotta roof, a winding gravel path with a wooden railing, a white ropeway gondola gliding past on its cable, and far below the whole city of Kobe and the blue sea stretching to the horizon, bees and butterflies, fresh green mountains.' },
  { key: 'nunobiki_herb_garden_night', prompt: 'The Nunobiki Herb Garden terrace above Kobe on a summer evening after dark: herb beds and lavender softly lit by warm garden lamps and strings of small lights, a stone rest house with glowing windows, a wooden viewing deck, and far below the glittering night view of Kobe city and the harbour lights reflected on the sea, a deep blue sky with a few stars.' },
  { key: 'nunobiki_ropeway', prompt: 'View from inside a small white ropeway gondola climbing the mountain above Shin-Kobe, Kobe: large windows, a simple bench seat, outside the steep green forested slope falling away, a thin white waterfall glimpsed in the valley, and beyond, the dense city of Kobe and the shining sea opening up below, another gondola passing on the parallel cable, bright afternoon light.' },
  { key: 'nunobiki_falls', prompt: 'Nunobiki Ondaki waterfall in the forested mountains just behind Shin-Kobe station in Kobe: a tall white waterfall falling about forty metres down a sheer dark granite rock face into a clear green plunge pool, mist and spray, mossy boulders, a small stone viewing platform with an old wooden railing and a weathered stone monument, maple and cedar trees, dappled sunlight cutting through the spray, cool and sacred.' },
  // 进路线（story/futurePath.ts）：JLPT 考场、神户大学面试
  { key: 'jlpt_exam_hall', prompt: 'A large tiered university lecture hall set up for a national language proficiency exam on a cold December morning: long curved rows of wooden desks rising toward the back, on each desk a small white seat-number card and a face-down exam booklet with an answer sheet and a pencil (all unreadable), a big blackboard at the front with a few chalk lines of unreadable notice, a plain round wall clock, tall windows with pale winter sunlight and bare tree branches outside, quiet and tense, empty of people.' },
  { key: 'kobe_univ_campus', prompt: 'A historic university campus on a hillside above Kobe on a clear cold February morning: a stately 1930s cream-stone main building with a central clock tower and tall arched windows at the top of a long sloping approach lined with bare zelkova trees, stone steps and a lawn with a little frost, and behind the viewer the city of Kobe and the blue sea spread out far below, crisp winter sunlight, hopeful and solemn. No signs, no emblems.' },
  { key: 'nunobiki_glasshouse', prompt: 'Inside the large glasshouse conservatory of the Nunobiki Herb Garden in Kobe: tall glass walls and a curved glass roof, tropical and fragrant plants, potted herbs on wooden shelves for sale with small handwritten tags, a little cafe corner with a few tables and glass teapots of herb tea, sunlight streaming in, a view of the mountains and sea through the glass.' }
];

const only = arg('only') ? String(arg('only')).split(',') : null;
const N = Number(arg('n', 1));
const small = async (f, w = 1280) => {
  const out = path.join(OUT, '_ref_' + path.basename(f).replace(/\.[a-z]+$/i, '.jpg'));
  if (!fs.existsSync(out)) await sharp(f).resize({ width: w, withoutEnlargement: true }).jpeg({ quality: 90 }).toFile(out);
  return out;
};

const run = async (j) => {
  const parts = [{ text: 'STYLE REFERENCE backgrounds (match this drawing and colour style):' }];
  for (const f of STYLE_REFS) parts.push(imagePart(await small(f)));
  if (j.base) parts.push({ text: 'LAYOUT REFERENCE — this is the SAME PLACE; keep its architecture, layout and viewpoint recognisable, only change time of day, weather and the details described:' }, imagePart(await small(BG + j.base)));
  parts.push({ text: `${STYLE}\n\nSCENE: ${j.prompt}` });
  for (let i = 0; i < N; i++) {
    const k = fs.readdirSync(OUT).filter(f => f.startsWith(j.key + '_') && f.endsWith('.png')).length + 1;
    try {
      const r = await generate({ parts, aspectRatio: '16:9', imageSize: '2K' });
      fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tbackground/${j.key}\tgemini-3-pro-image\t2K\n`);
      if (!r.images.length) { console.log(`${j.key} 没拿到图：${r.finishReason} ${JSON.stringify(r.raw?.promptFeedback || {})}`); continue; }
      const out = path.join(OUT, `${j.key}_${k}.png`);
      await sharp(r.images[0]).png().toFile(out);
      console.log(out);
    } catch (e) { console.log(`${j.key} 出错：${e.message.slice(0, 160)}`); }
  }
};

const list = JOBS.filter(j => !only || only.includes(j.key));
let next = 0;
await Promise.all(Array.from({ length: Number(arg('jobs', 3)) }, async () => { while (next < list.length) await run(list[next++]); }));
