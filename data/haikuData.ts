// ==========================================================
// 🌸 俳句づくり：用词块拼出 5-7-5
//
// 每个词块有表记和读音。音拍（モーラ）数不手填，由读音自动数，
// 所以只要读音写对，评分就不会错：
//   · ゃゅょ（小字）不算一拍，跟前面的假名合成一拍
//   · っ ん ー 各算一拍
// 评分（满分 100）：
//   三行音拍正好 5 / 7 / 5 → 每行 20，共 60
//   有季语，且是这一题要的季节 → 25
//   用了切れ字（や・かな・けり） → 10
//   没有“季重なり”（同时用了两个不同季节的季语） → 5
// ==========================================================

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Chunk {
  id: string;
  t: string;          // 表记
  r: string;          // 读音（平假名）
  kigo?: Season;      // 季语
  cut?: boolean;      // 切れ字
}

export interface HaikuPuzzle {
  id: string;
  season: Season | 'any';
  titleZh: string; titleEn: string;
  sceneZh: string; sceneEn: string;
  chunks: Chunk[];
  // 玲的参考答案（3 行，每行是词块 id 的数组）
  sample: string[][];
  // 参考答案是名句时的出处
  famous?: { author: string; zh: string; en: string };
}

const SMALL = 'ゃゅょぁぃぅぇぉゎ';
export const countMora = (kana: string): number => {
  let n = 0;
  for (const ch of kana) if (!SMALL.includes(ch)) n += 1;
  return n;
};

const c = (id: string, t: string, r: string, extra: Partial<Chunk> = {}): Chunk => ({ id, t, r, ...extra });

export const PUZZLES: HaikuPuzzle[] = [
  {
    id: 'spring_window', season: 'spring',
    titleZh: '春の朝', titleEn: 'A spring morning',
    sceneZh: '早上的窗边，雨刚停，光洒进来。猫在打哈欠。', sceneEn: 'By the window in the morning. The rain has just stopped, light is pouring in, and the cat is yawning.',
    chunks: [
      c('a1', '春の雨', 'はるのあめ', { kigo: 'spring' }), c('a2', '蝉の声', 'せみのこえ', { kigo: 'summer' }),
      c('a3', '雪の朝', 'ゆきのあさ', { kigo: 'winter' }), c('a4', '猫あくび', 'ねこあくび'),
      c('a5', '窓辺にそっと', 'まどべにそっと'), c('a6', '光あつまる', 'ひかりあつまる'),
      c('a7', '眠たげな猫', 'ねむたげなねこ'), c('a8', '駅へ続く道', 'えきへつづくみち'),
      c('a9', '窓辺かな', 'まどべかな', { cut: true }), c('a10', 'や', 'や', { cut: true }),
      c('a11', '桜咲く', 'さくらさく', { kigo: 'spring' })
    ],
    sample: [['a1'], ['a7'], ['a9']]
  },
  {
    id: 'spring_school', season: 'spring',
    titleZh: '新学期', titleEn: 'A new school year',
    sceneZh: '放学路上，樱花一片一片落下来。', sceneEn: 'On the way home from school, cherry petals drift down one by one.',
    chunks: [
      c('b1', '花吹雪', 'はなふぶき', { kigo: 'spring' }), c('b2', '夏休み', 'なつやすみ', { kigo: 'summer' }),
      c('b3', '帰り道', 'かえりみち'), c('b4', '制服の肩', 'せいふくのかた'),
      c('b5', '制服の肩に', 'せいふくのかたに'), c('b6', '友と歩けば', 'ともとあるけば'),
      c('b7', '春の風', 'はるのかぜ', { kigo: 'spring' }), c('b8', '初雪や', 'はつゆきや', { kigo: 'winter', cut: true }),
      c('b9', 'かな', 'かな', { cut: true }), c('b10', '新しき', 'あたらしき'),
      c('b11', '笑い声', 'わらいごえ'), c('b12', '夕空や', 'ゆうぞらや', { cut: true })
    ],
    sample: [['b1'], ['b6'], ['b12']]
  },
  {
    id: 'summer_evening', season: 'summer',
    titleZh: '夏の夕方', titleEn: 'A summer evening',
    sceneZh: '廊下上挂着风铃，远处有雷声，蝉叫得正响。', sceneEn: 'A wind chime on the veranda, thunder far off, cicadas in full voice.',
    chunks: [
      c('c1', '蝉の声', 'せみのこえ', { kigo: 'summer' }), c('c2', '風鈴や', 'ふうりんや', { kigo: 'summer', cut: true }),
      c('c3', '氷水', 'こおりみず', { kigo: 'summer' }), c('c4', '桜散る', 'さくらちる', { kigo: 'spring' }),
      c('c5', '夕立の音', 'ゆうだちのおと', { kigo: 'summer' }), c('c6', '縁側で待つ', 'えんがわでまつ'),
      c('c7', '空は茜に', 'そらはあかねに'), c('c8', '影ながく', 'かげながく'),
      c('c9', '子らの声', 'こらのこえ'), c('c10', '縁側に座る', 'えんがわにすわる'),
      c('c11', 'けり', 'けり', { cut: true })
    ],
    sample: [['c2'], ['c7'], ['c9']]
  },
  {
    id: 'autumn_night', season: 'autumn',
    titleZh: '秋の夜長', titleEn: 'A long autumn night',
    sceneZh: '月亮很亮，虫在叫，窗开着，茶冒着热气。', sceneEn: 'A bright moon, insects singing, the window open, tea steaming.',
    chunks: [
      c('d1', '月明かり', 'つきあかり', { kigo: 'autumn' }), c('d2', '虫の声', 'むしのこえ', { kigo: 'autumn' }),
      c('d3', '初雪や', 'はつゆきや', { kigo: 'winter', cut: true }), c('d4', '栗ご飯', 'くりごはん', { kigo: 'autumn' }),
      c('d5', '月を見上げる', 'つきをみあげる'), c('d6', '窓を開ければ', 'まどをあければ'),
      c('d7', '湯気のむこうに', 'ゆげのむこうに'), c('d8', '紅葉ふる', 'もみじふる', { kigo: 'autumn' }),
      c('d9', 'ひとり言', 'ひとりごと'), c('d10', 'や', 'や', { cut: true }),
      c('d11', 'かな', 'かな', { cut: true }), c('d12', '夜長かな', 'よながかな', { kigo: 'autumn', cut: true })
    ],
    sample: [['d2'], ['d6'], ['d12']]
  },
  {
    id: 'winter_morning', season: 'winter',
    titleZh: '冬の朝', titleEn: 'A winter morning',
    sceneZh: '出门时呼出白色的气，车站的月台冷得发亮。', sceneEn: 'Your breath is white as you leave the house, and the station platform glitters with cold.',
    chunks: [
      c('e1', '息白し', 'いきしろし', { kigo: 'winter' }), c('e2', '初雪や', 'はつゆきや', { kigo: 'winter', cut: true }),
      c('e3', 'こたつ猫', 'こたつねこ', { kigo: 'winter' }), c('e4', '夏休み', 'なつやすみ', { kigo: 'summer' }),
      c('e5', '霜の朝', 'しものあさ', { kigo: 'winter' }), c('e6', '手袋ごしの', 'てぶくろごしの'),
      c('e7', '改札口で', 'かいさつぐちで'), c('e8', '白い息吐く', 'しろいいきはく'),
      c('e9', 'あたたかな部屋', 'あたたかなへや'), c('e10', '君を待つ', 'きみをまつ'),
      c('e11', 'かな', 'かな', { cut: true })
    ],
    sample: [['e2'], ['e7'], ['e10']]
  },
  {
    id: 'famous', season: 'any',
    titleZh: '名句を組み立てよう', titleEn: 'Rebuild the masters',
    sceneZh: '这里的词块，是三首松尾芭蕉的名句拆开后的样子。哪一首都可以。', sceneEn: 'These chunks come from three famous haiku by Matsuo Bashō, all mixed up. Any of the three will do.',
    chunks: [
      c('f1', '古池や', 'ふるいけや', { cut: true }), c('f2', '蛙飛びこむ', 'かわずとびこむ', { kigo: 'spring' }),
      c('f3', '水の音', 'みずのおと'), c('f4', '閑さや', 'しずけさや', { cut: true }),
      c('f5', '岩にしみ入る', 'いわにしみいる'), c('f6', '蝉の声', 'せみのこえ', { kigo: 'summer' }),
      c('f7', '夏草や', 'なつくさや', { kigo: 'summer', cut: true }), c('f8', '兵どもが', 'つわものどもが'),
      c('f9', '夢の跡', 'ゆめのあと')
    ],
    sample: [['f1'], ['f2'], ['f3']],
    famous: { author: '松尾芭蕉', zh: '古池や蛙飛びこむ水の音——寂静的古池塘，一只青蛙跳进去，只有水声。', en: 'The old pond — a frog jumps in, the sound of water.' }
  }
];

// 三首芭蕉：原句的 3 行（词块 id）。答对任意一首给“名句”评价。
export const FAMOUS_SETS: { lines: string[][]; zh: string; en: string }[] = [
  { lines: [['f1'], ['f2'], ['f3']], zh: '古池や蛙飛びこむ水の音', en: 'The old pond — a frog jumps in, the sound of water.' },
  { lines: [['f4'], ['f5'], ['f6']], zh: '閑さや岩にしみ入る蝉の声', en: 'Stillness — the cicadas\' cry sinks into the rocks.' },
  { lines: [['f7'], ['f8'], ['f9']], zh: '夏草や兵どもが夢の跡', en: 'Summer grass — all that remains of warriors\' dreams.' }
];

export interface HaikuScore {
  moras: number[];
  lineOk: boolean[];
  hasKigo: boolean;
  seasons: Season[];
  seasonMatch: boolean;
  cut: boolean;
  noOverlap: boolean;
  score: number;
  famous: boolean;
  zh: string; en: string;
}

export const scoreHaiku = (puzzle: HaikuPuzzle, lines: Chunk[][]): HaikuScore => {
  const target = [5, 7, 5];
  const moras = lines.map(l => l.reduce((n, ch) => n + countMora(ch.r), 0));
  const lineOk = moras.map((m, i) => m === target[i]);
  const all = lines.flat();
  const seasons = Array.from(new Set(all.map(ch => ch.kigo).filter((s): s is Season => !!s)));
  const hasKigo = seasons.length > 0;
  const seasonMatch = hasKigo && (puzzle.season === 'any' || seasons.includes(puzzle.season));
  const cut = all.some(ch => ch.cut);
  const noOverlap = seasons.length <= 1;
  const key = lines.map(l => l.map(ch => ch.id).join(',')).join('|');
  const famous = FAMOUS_SETS.some(s => s.lines.map(l => l.join(',')).join('|') === key);

  let score = 0;
  lineOk.forEach(ok => { if (ok) score += 20; });
  if (seasonMatch) score += 25;
  if (cut) score += 10;
  if (noOverlap && hasKigo) score += 5;
  return { moras, lineOk, hasKigo, seasons, seasonMatch, cut, noOverlap, score, famous, zh: '', en: '' };
};
