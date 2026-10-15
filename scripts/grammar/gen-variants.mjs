// ---------------------------------------------------------
// 给每条日语选项造两个"说错了"的版本（剧情里的"怎么用日语说"那一步用）
//
//   node scripts/grammar/extract-choices.mjs        # 先抽选项
//   node scripts/grammar/gen-variants.mjs [--jobs 3] # 生成，已有的跳过
//   → .generated/grammar/variants.json → data/grammarChoices.ts
//
// minor：只错一处、学日语的人真会犯的错（助词、活用、敬体/常体、自他动词……），意思还猜得出来
// major：错得离谱（句型用反、动词错、意思变了），一看就不对劲
// ---------------------------------------------------------
import fs from 'fs';
import { generate } from '../lib/gemini.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const MODEL = arg('model', 'gemini-2.5-pro');
const BATCH = 25;
const list = JSON.parse(fs.readFileSync('.generated/grammar/choices.json', 'utf8'));
const OUT = '.generated/grammar/variants.json';
const done = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const todo = list.filter(x => !done[x.jp]);
console.log(`共 ${list.length} 条，已有 ${list.length - todo.length}，要生成 ${todo.length}`);

const PROMPT = items => `You are writing a Japanese-learning mechanic for a visual novel. The player (a Chinese exchange student, about JLPT N3) has decided WHAT to say; now he must pick HOW to say it in Japanese from three versions. One is the correct line (given). You write the two wrong ones.

For EACH item write:
- "minor": the SAME sentence with exactly ONE realistic learner mistake — a wrong particle (は/が, に/で, を/が), a wrong conjugation (te-form, past, potential, volitional), polite/plain mixed up in a way that sounds off for the situation, a transitive/intransitive verb mix-up, a wrong counter, or a near-synonym used wrongly. It must look plausible and still be roughly understandable. Change as little as possible; keep everything else character-for-character identical.
- "major": a version with a mistake that clearly breaks it — a grammar pattern used in the wrong place, the meaning flipped (e.g. negative/positive, giving/receiving reversed, causative/passive confused), or the wrong verb entirely. It must still look like a sentence at a glance, similar length, same register.
- "minorZh" / "minorEn": ONE short sentence saying what is wrong in "minor" and what the right form is (Chinese / English).
- "majorZh" / "majorEn": ONE short sentence saying what "major" actually means or why it does not work (Chinese / English).

Rules: never output the correct line as a variant; the two variants must differ from each other; no furigana, no 「」, no romaji; keep names, numbers and punctuation style of the original; if the original is very short (1–3 words), still make a realistic small error.

Return ONLY a JSON array, one object per item, in the same order, each with "i" (the item index) and the six fields.

ITEMS:
${items.map((x, i) => `${i}. JP: ${x.jp}\n   meaning: ${x.zh}${x.en ? ` / ${x.en}` : ''}`).join('\n')}`;

const parse = text => {
  const a = text.indexOf('['), b = text.lastIndexOf(']');
  return JSON.parse(text.slice(a, b + 1));
};

const batches = [];
for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
let next = 0;
const save = () => fs.writeFileSync(OUT, JSON.stringify(done, null, 1));
const run = async bi => {
  const items = batches[bi];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await generate({ parts: [{ text: PROMPT(items) }], model: MODEL, textOnly: true });
      fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tgrammar/variants_${bi}\t${MODEL}\ttext\n`);
      const arr = parse(r.text);
      let ok = 0;
      for (const v of arr) {
        const x = items[v.i];
        if (!x || !v.minor || !v.major || v.minor === x.jp || v.major === x.jp || v.minor === v.major) continue;
        done[x.jp] = { minor: v.minor, minorZh: v.minorZh, minorEn: v.minorEn, major: v.major, majorZh: v.majorZh, majorEn: v.majorEn };
        ok++;
      }
      save();
      console.log(`batch ${bi}: ${ok}/${items.length}`);
      return;
    } catch (e) { console.log(`batch ${bi} 出错（第 ${attempt + 1} 次）：${String(e.message).slice(0, 160)}`); }
  }
};
await Promise.all(Array.from({ length: Number(arg('jobs', 3)) }, async () => { while (next < batches.length) await run(next++); }));

// 写进游戏（跟 write-variants.mjs 同一套：补齐字段、缺中文解释的不收）
import('./write-variants.mjs');
