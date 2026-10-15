// ---------------------------------------------------------
// 约会和换装亮相的"每个人各自的版本"
//
//   node scripts/grammar/run-ts.mjs scripts/grammar/dump-content.ts   # 先导出上下文
//   node scripts/grammar/gen-variety.mjs dates   [--only rooftop,lab]  # 每个地点 × 8 人 × 2 套
//   node scripts/grammar/gen-variety.mjs reveals [--only asuka]        # 每套衣服 3 个专属选项
//   node scripts/grammar/gen-variety.mjs write                         # → data/dateVariety.ts、data/revealChoices.ts
//
// 以前约会的到场描写、两段情节、中间那个选择都是按地点写的一套，{her} 换个名字——
// 跟谁去天台，读到的都是同一段话。换装亮相的三个回应（夸 / 看呆 / 开玩笑）每个人只有一套，
// 泳衣和和服是同一句。这里让模型按人设和地点写，生成结果存在 .generated/variety/，人工抽查后再写进游戏。
// ---------------------------------------------------------
import fs from 'fs';
import { generate } from '../lib/gemini.mjs';
import { PERSONAS, MOODS } from './personas.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? (process.argv[i + 1] ?? true) : d; };
const STAGE = process.argv[2];
const MODEL = arg('model', 'gemini-2.5-pro');
const DIR = '.generated/variety';
const only = arg('only') ? String(arg('only')).split(',') : null;
const cost = what => fs.appendFileSync('.generated/remake2/_cost.log', `${new Date().toISOString()}\tvariety/${what}\t${MODEL}\ttext\n`);
const parse = t => { const a = t.indexOf('{'), b = t.lastIndexOf('}'); return JSON.parse(t.slice(a, b + 1)); };

const STYLE = `WRITING STYLE (match the existing game exactly):
- Chinese is the primary text; English is a faithful, natural translation. Second person: 你 / you. The heroine is referred to by name (or 她 / she).
- Understated, concrete, observational prose. Small physical details, a dry sense of humour, no purple prose, no clichés, no exclamation-mark narration. 1–3 sentences per beat.
- Her spoken lines are in Japanese in HER OWN voice and level (see persona). The protagonist's Japanese lines are short and natural, about JLPT N3.
- This is a light date between people who are getting closer; affection may still be low. No confessions, no kissing, nothing more romantic than a held glance.
- No real brand names.`;

const GRAMMAR = `For EVERY option that has a "jp" line, also give two WRONG versions of that jp line for a Japanese-learning mini game:
  "minor": the same sentence with exactly ONE realistic learner mistake (particle, conjugation, polite/plain mix-up, transitive/intransitive) — still roughly understandable;
  "minorZh"/"minorEn": one short sentence saying what is wrong and the right form;
  "major": a version that clearly breaks (meaning flipped, giving/receiving reversed, causative/passive confused, wrong verb) but still looks like a sentence;
  "majorZh"/"majorEn": one short sentence saying what it actually means or why it fails.`;

const OPTION_SCHEMA = `{ "labelZh": "what the protagonist does or says (if he speaks Japanese, the Chinese meaning in 「」)", "labelEn": "...", "jp": "(optional) the protagonist's actual Japanese line, only if he speaks", "hintZh": "a few words of tone", "hintEn": "...", "aff": 1-6, "fam": 1-6, "mood": one of ${MOODS.join('|')}, "reply": { "jp": "her reply in her voice", "zh": "...", "en": "..." }, "after": { "zh": "one sentence of what happens next", "en": "..." }, "minor": "...", "minorZh": "...", "minorEn": "...", "major": "...", "majorZh": "...", "majorEn": "..." }`;

// ---------------- 约会 ----------------
async function dates() {
  const spots = JSON.parse(fs.readFileSync(`${DIR}/spots.json`, 'utf8')).filter(s => !only || only.includes(s.id));
  const outFile = `${DIR}/dates.json`;
  const done = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};
  const todo = spots.filter(s => !done[s.id]);
  console.log(`约会地点 ${spots.length}，要生成 ${todo.length}`);
  const run = async s => {
    const prompt = `You are writing content for a Japanese-learning visual novel set in Kobe. The protagonist is a Chinese exchange student. He has invited one of eight girls on a date to this place:

PLACE: ${s.nameZh} / ${s.nameEn} (${s.nameJp}) — ${s.blurbZh}
How the existing generic version reads (for tone and facts about the place; DO NOT copy it):
- arrival: ${s.arrive.zh}
- beat 1: ${s.beats[0]?.zh}
- beat 2: ${s.beats[1]?.zh}
- choice: ${s.choice.prompt.zh} / options: ${s.choice.options.map(o => o.labelZh).join(' | ')}

THE EIGHT GIRLS:
${Object.entries(PERSONAS).map(([k, p]) => `- ${k} (${p.zh} / ${p.en}): ${p.card}`).join('\n')}

For EACH girl write TWO different versions ("v": 1 and 2) of this date, each showing what THIS girl in particular does and notices in THIS place — her habits, her interests, the way she would behave here. The two versions must be clearly different from each other (different moment, different small incident, different choice).
Each version:
{ "char": "<key>", "v": 1|2,
  "beat1": { "zh": "the moment you find her there — what she is doing", "en": "..." },
  "beat2": { "zh": "a small in-character moment during the activity", "en": "..." },
  "choice": { "promptZh": "the situation that calls for the protagonist to act", "promptEn": "...", "options": [three options: ${OPTION_SCHEMA}] }
}
In each choice, the three options must feel genuinely different (e.g. one sincere, one playful, one quiet/an action), and at least one must be a Japanese line ("jp"). Her "reply" must react to that specific option in her own voice and Japanese level.

${STYLE}

${GRAMMAR}

Return ONLY JSON: { "versions": [ 16 objects ] }`;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await generate({ parts: [{ text: prompt }], model: MODEL, textOnly: true });
        cost(`date_${s.id}`);
        const j = parse(r.text);
        const vs = (j.versions || []).filter(v => PERSONAS[v.char] && v.beat1?.zh && v.choice?.options?.length === 3);
        if (vs.length < 12) throw new Error(`只拿到 ${vs.length} 套`);
        done[s.id] = vs;
        fs.writeFileSync(outFile, JSON.stringify(done, null, 1));
        console.log(`${s.id}: ${vs.length} 套`);
        return;
      } catch (e) { console.log(`${s.id} 出错（第 ${attempt + 1} 次）：${String(e.message).slice(0, 160)}`); }
    }
  };
  let next = 0;
  await Promise.all(Array.from({ length: Number(arg('jobs', 2)) }, async () => { while (next < todo.length) await run(todo[next++]); }));
}

// ---------------- 换装亮相 ----------------
async function reveals() {
  const { reveals: R } = JSON.parse(fs.readFileSync(`${DIR}/reveals.json`, 'utf8'));
  const outFile = `${DIR}/reveals_gen.json`;
  const done = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};
  const chars = Object.keys(R).filter(c => (!only || only.includes(c)) && !done[c]);
  console.log(`换装：要生成 ${chars.length} 人`);
  const run = async c => {
    const p = PERSONAS[c];
    const outfits = Object.entries(R[c]);
    const prompt = `You are writing content for a Japanese-learning visual novel set in Kobe. The protagonist (a Chinese exchange student) sees ${p.zh} / ${p.en} in an outfit for the very first time. She has just said her opening line. Now he must respond.

${p.zh} / ${p.en}: ${p.card}

Her outfits (what he sees, and her opening line):
${outfits.map(([k, o]) => `- ${k}: ${o.lookZh} / she says: ${o.line.jp}`).join('\n')}

For EACH outfit write exactly three response options, tailored to THAT outfit and THAT moment (refer to concrete details of the outfit or her line — never generic "it suits you" for every outfit):
- one sincere compliment about something specific (mark it "praise": true),
- one playful or teasing response,
- one quiet response or an action (not speech).
Each option: ${OPTION_SCHEMA} plus "praise": true|false.
At least one option per outfit must be a Japanese line ("jp"). Her "reply" must react to that exact option in her own voice and level. The three replies of one outfit must differ in feeling.

${STYLE}

${GRAMMAR}

Return ONLY JSON: { "${c}": { "<outfitKey>": [3 options], ... } }`;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await generate({ parts: [{ text: prompt }], model: MODEL, textOnly: true });
        cost(`reveal_${c}`);
        const j = parse(r.text)[c];
        const okKeys = outfits.map(([k]) => k).filter(k => j?.[k]?.length === 3);
        if (okKeys.length < outfits.length * 0.8) throw new Error(`只拿到 ${okKeys.length}/${outfits.length} 套`);
        done[c] = Object.fromEntries(okKeys.map(k => [k, j[k]]));
        fs.writeFileSync(outFile, JSON.stringify(done, null, 1));
        console.log(`${c}: ${okKeys.length}/${outfits.length}`);
        return;
      } catch (e) { console.log(`${c} 出错（第 ${attempt + 1} 次）：${String(e.message).slice(0, 160)}`); }
    }
  };
  let next = 0;
  await Promise.all(Array.from({ length: Number(arg('jobs', 2)) }, async () => { while (next < chars.length) await run(chars[next++]); }));
}

// ---------------- 写进游戏 ----------------
const clean = o => {
  const mood = MOODS.includes(o.mood) ? o.mood : 'happy';
  const n = v => Math.max(0, Math.min(6, Math.round(Number(v) || 3)));
  const x = { labelZh: o.labelZh, labelEn: o.labelEn, hintZh: o.hintZh || '', hintEn: o.hintEn || '', aff: n(o.aff), fam: n(o.fam), mood,
    reply: o.reply, after: o.after };
  if (o.jp && o.jp.trim()) {
    x.jp = o.jp.trim();
    if (o.minor && o.major && o.minor !== x.jp && o.major !== x.jp)
      x.variant = { minor: o.minor, minorZh: o.minorZh, minorEn: o.minorEn, major: o.major, majorZh: o.majorZh, majorEn: o.majorEn };
  }
  if (o.praise) x.praise = true;
  return x;
};
function write() {
  const d = fs.existsSync(`${DIR}/dates.json`) ? JSON.parse(fs.readFileSync(`${DIR}/dates.json`, 'utf8')) : {};
  const out = {};
  for (const [spot, vs] of Object.entries(d)) for (const v of vs) {
    (out[spot] ||= {})[v.char] ||= [];
    out[spot][v.char].push({ beat1: v.beat1, beat2: v.beat2, promptZh: v.choice.promptZh, promptEn: v.choice.promptEn, options: v.choice.options.map(clean) });
  }
  fs.writeFileSync('data/dateVariety.ts', `// 自动生成：node scripts/grammar/gen-variety.mjs write —— 别手改（改 .generated/variety/dates.json 再写）
// 约会：每个地点 × 每个人的专属版本（她在这儿会做什么、一个只属于这次的选择）。用法见 data/dateData.ts。
import { VarietyOption } from './varietyTypes';
export interface DateVariant { beat1: { zh: string; en: string }; beat2: { zh: string; en: string }; promptZh: string; promptEn: string; options: VarietyOption[] }
export const DATE_VARIETY: Record<string, Record<string, DateVariant[]>> = ${JSON.stringify(out)};
`);
  const r = fs.existsSync(`${DIR}/reveals_gen.json`) ? JSON.parse(fs.readFileSync(`${DIR}/reveals_gen.json`, 'utf8')) : {};
  const rv = {};
  for (const [c, outfits] of Object.entries(r)) for (const [k, opts] of Object.entries(outfits)) (rv[c] ||= {})[k] = opts.map(clean);
  fs.writeFileSync('data/revealChoices.ts', `// 自动生成：node scripts/grammar/gen-variety.mjs write —— 别手改（改 .generated/variety/reveals_gen.json 再写）
// 第一次看见她穿这一身：每套衣服三个专属的回应。用法见 data/dateData.ts。
import { VarietyOption } from './varietyTypes';
export const REVEAL_CHOICES: Record<string, Record<string, VarietyOption[]>> = ${JSON.stringify(rv)};
`);
  console.log('约会', Object.keys(out).length, '个地点；换装', Object.values(rv).reduce((n, o) => n + Object.keys(o).length, 0), '套');
}

if (STAGE === 'dates') await dates();
else if (STAGE === 'reveals') await reveals();
else if (STAGE === 'write') write();
else console.log('用法：dates | reveals | write');
