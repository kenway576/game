import { CharacterId, GameCalendar, StoryFlags, StoryNode, StoryOption, StoryWord } from '../types';
import { getAffectionLevelIndex, getFamiliarityLevelIndex, getUnlockedOutfits, getWearableOutfits } from '../constants';
import { isSchoolDay } from './calendarLife';
import { dayIndex } from './lifeData';
import { pickContextOutfit, outfitImg, outfitLabel, seenOutfitFlag, Mood } from './outfitContext';
import { DATE_SPOTS, DateSpot } from '../story/dateSpots';
import { INVITE_LINES, TAG_LINES, Line, WEAR_REQUEST_LINES, WEAR_PRAISED_LINES } from '../story/dateLines';
import { OUTFIT_REVEALS, REVEAL_RESPONSES } from '../story/outfitReveals';
import { DATE_INCIDENTS } from '../story/dateIncidents';
import { pickDateEpisode, pastDateCount } from '../story/dateEpisodes';

// ---------------------------------------------------------
// 💌 放学后约她出去
//
// 流程：选人 → 选地方 → 发一条消息 → 她回。
//   · 答应：她回去换一身衣服（什么场合穿什么，见 outfitContext）→ 那个地方的一段戏 →
//     坐下来接自由对话，对话里她还穿着那一身。
//   · 改约：这个地方还太早，她提议一个轻一点的。玩家可以接受，也可以算了。
//   · 没空：今天她有自己的事。今天不能再约她了，可以约别人。
//   · 不去：关系还没到那一步，而且也没有别的地方可以退一步。
//
// 回答按"日子 × 人 × 地方"固定：同一天反复打开面板，她说的还是同一句。
// 一天只能约一次（约成了才算）；被拒绝不扣好感，親密度还会涨一点。
// ---------------------------------------------------------

export const SPEAKER: Record<CharacterId, { zh: string; en: string; color: string }> = {
  [CharacterId.ASUKA]:  { zh: '明日香', en: 'Asuka',  color: 'bg-red-600' },
  [CharacterId.HIKARI]: { zh: '光',     en: 'Hikari', color: 'bg-sky-500' },
  [CharacterId.REI]:    { zh: '铃',     en: 'Rei',    color: 'bg-indigo-500' },
  [CharacterId.INARI]:  { zh: '稻荷',   en: 'Inari',  color: 'bg-amber-500' },
  [CharacterId.MIYUKI]: { zh: '深雪',   en: 'Miyuki', color: 'bg-violet-400' },
  [CharacterId.SORA]:   { zh: '空',     en: 'Sora',   color: 'bg-orange-500' },
  [CharacterId.NAO]:    { zh: '奈绪',   en: 'Nao',    color: 'bg-emerald-500' },
  [CharacterId.MAKI]:   { zh: '真希',   en: 'Maki',   color: 'bg-pink-500' }
};

const CHAR_ORDER = Object.values(CharacterId);

// 当天稳定的随机数
const hash01 = (...parts: (string | number)[]): number => {
  let h = 2166136261;
  for (const ch of parts.join('|')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
};

// ---- flag ----
export const datedTodayFlag = (cal: GameCalendar) => `dated_d${dayIndex(cal)}`;
export const askedTodayFlag = (char: CharacterId, cal: GameCalendar) => `inv_${char}_d${dayIndex(cal)}`;
export const datedWithFlag = (char: CharacterId) => `dated_${char}`;
export const datedSpotFlag = (char: CharacterId, spot: string) => `date_${char}_${spot}`;

// ---- 这个时候能去哪儿 ----
export interface SpotCtx {
  calendar: GameCalendar;
  stamina: number;
  yen: number;
}

export const spotOpenNow = (s: DateSpot, c: SpotCtx): boolean => {
  const cal = c.calendar;
  const school = isSchoolDay(cal);
  if (!s.slots.includes(cal.timeSlot)) return false;
  // 上学日的午休人在学校里，出不去
  if (school && cal.timeSlot === 'lunch') return false;
  if (s.schoolDayOnly && !school) return false;
  if (cal.timeSlot === 'night' && cal.nightUsed) return false;
  if (s.outdoor && cal.weather === 'rainy') return false;
  if (s.when && !s.when(cal)) return false;
  return true;
};

// 去不起 / 走不动：面板上灰着并写原因
export const spotBlockedReason = (s: DateSpot, c: SpotCtx, en: boolean): string | null => {
  if (s.yen && c.yen < s.yen) return en ? `Costs about ¥${s.yen}. Not enough money.` : `大概要花 ¥${s.yen}，钱不够。`;
  const need = (s.stamina ?? 18 * (s.timeCost ?? 1));
  if (need > 0 && c.stamina < Math.min(need, 30)) return en ? 'Too tired for this one.' : '这一趟太累了，走不动。';
  return null;
};

// 她熟到可以约去这儿了吗（不熟的地方不列出来）
export const spotKnownEnough = (s: DateSpot, familiarity: number) =>
  getFamiliarityLevelIndex(familiarity) + 1 >= s.minFam;

// ---- 她会穿什么 ----
export const dateOutfitFor = (char: CharacterId, s: DateSpot, cal: GameCalendar, familiarity: number, affection: number, flags?: StoryFlags): string =>
  dateOutfitPlan(char, s, cal, familiarity, affection, flags).outfit;

// 你夸过"似合ってる"的那一身。她记得。
export const praisedOutfitFlag = (char: CharacterId, outfit: string) => `praised_outfit_${char}_${outfit}`;

export type WearReason = 'request' | 'praised';

// 她自己挑的那一身。普通的约会（咖啡、游戏厅、港边……），
// 偶尔会穿你上次夸过的那套来——哪怕那是一套文化祭的女仆装。
// 按日子固定：面板上预告的和到了那儿看见的是同一身。
export const dateOutfitPlan = (
  char: CharacterId, s: DateSpot, cal: GameCalendar, familiarity: number, affection: number, flags?: StoryFlags
): { outfit: string; reason?: WearReason } => {
  const wearable = getWearableOutfits(char, familiarity, affection, flags);
  const ctx = pickContextOutfit(char, {
    scene: s.scene, cal, date: true, occasion: s.occasion(cal),
    unlocked: getUnlockedOutfits(char, familiarity, affection)
  });
  if (flags && s.occasion(cal) === 'casual' && !s.schoolDayOnly) {
    const praised = wearable.filter(o => o !== ctx && flags[praisedOutfitFlag(char, o)]);
    if (praised.length && hash01('praised', dayIndex(cal), char, s.id) < 0.35) {
      return { outfit: praised[Math.floor(hash01('praisedpick', dayIndex(cal), char) * praised.length) % praised.length], reason: 'praised' };
    }
  }
  return { outfit: ctx };
};

// 能点名让她穿的：等级解锁的 + 剧情里穿过的
export const requestableOutfits = (char: CharacterId, familiarity: number, affection: number, flags: StoryFlags): string[] =>
  getWearableOutfits(char, familiarity, affection, flags);

// ---- 她愿意去多"像约会"的地方 ----
const requiredAffLevel = (char: CharacterId, mood: number): number => {
  let need = mood <= 2 ? 1 : mood === 3 ? 2 : 3;
  // 深雪是大人：太像约会的地方，她比同龄人更谨慎
  if (char === CharacterId.MIYUKI && mood >= 3) need += 1;
  // 奈绪从小一起长大：出去玩这件事本来就不需要理由
  if (char === CharacterId.NAO && mood === 3) need -= 1;
  // 稻荷觉得人类的约会很有趣
  if (char === CharacterId.INARI && mood === 3) need -= 1;
  return Math.max(1, need);
};

export type InviteKind = 'yes' | 'counter' | 'busy' | 'no';
export interface InviteReply {
  kind: InviteKind;
  line: Line;               // 她回的那句（{spot} 已替换）
  counter?: DateSpot;       // 改约的地方
}

export interface InviteCtx extends SpotCtx {
  flags: StoryFlags;
  familiarity: number;
  affection: number;
}

const pickLine = (list: Line[], seed: number): Line => list[Math.floor(seed * list.length) % list.length];

export const inviteReply = (char: CharacterId, spot: DateSpot, ctx: InviteCtx): InviteReply => {
  const cal = ctx.calendar;
  const day = dayIndex(cal);
  const lines = INVITE_LINES[char];
  const affLv = getAffectionLevelIndex(ctx.affection) + 1;
  const firstTime = !ctx.flags[datedWithFlag(char)];

  // 一、今天她有没有空。只看日子和人，跟约去哪儿无关——换个地方再问，她照样没空。
  let busyChance = 0.2 - affLv * 0.02;
  if (char === CharacterId.SORA && isSchoolDay(cal) && cal.timeSlot === 'afternoon' && spot.id !== 'gym') busyChance = 0.38;
  if (char === CharacterId.ASUKA && isSchoolDay(cal) && cal.timeSlot === 'afternoon') busyChance += 0.08;
  if (firstTime) busyChance *= 0.4;   // 第一次约她，别让玩家一上来就吃闭门羹
  const busyRoll = hash01('busy', day, CHAR_ORDER.indexOf(char));
  if (busyRoll < busyChance) {
    return { kind: 'busy', line: pickLine(lines.busy, hash01('busyline', day, char)) };
  }

  // 二、这个地方她愿不愿意去
  const need = requiredAffLevel(char, spot.mood);
  if (affLv >= need) {
    return { kind: 'yes', line: pickLine(lines.yes, hash01('yes', day, char, spot.id)) };
  }

  // 三、差得太远（还只是"无意"就约去看夜景、吃铁板烧）：直接不去，也不给台阶
  if (need - affLv >= 2) {
    return { kind: 'no', line: pickLine(lines.no, hash01('no', day, char, spot.id)) };
  }

  // 四、只差一步：有没有一个轻一点、现在也能去的地方可以改约
  const fallback = DATE_SPOTS
    .filter(s => s.id !== spot.id && s.mood < spot.mood && affLv >= requiredAffLevel(char, s.mood)
      && spotOpenNow(s, ctx) && spotKnownEnough(s, ctx.familiarity) && !spotBlockedReason(s, ctx, false))
    .sort((a, b) => {
      // 同一类的优先（想去海边被拒，改成港口；想吃铁板烧被拒，改成南京町）
      const ta = a.tag === spot.tag ? 1 : 0, tb = b.tag === spot.tag ? 1 : 0;
      if (ta !== tb) return tb - ta;
      if (a.mood !== b.mood) return b.mood - a.mood;
      return hash01(day, a.id) - hash01(day, b.id);
    })[0];
  if (fallback) {
    const l = pickLine(lines.counter, hash01('counter', day, char, spot.id));
    const fill = (t: string) => t.replace('{spot}', fallback.nameJp);
    return {
      kind: 'counter', counter: fallback,
      line: { jp: fill(l.jp), zh: l.zh.replace('{spot}', fallback.nameZh), en: l.en.replace('{spot}', fallback.nameEn) }
    };
  }
  return { kind: 'no', line: pickLine(lines.no, hash01('no', day, char, spot.id)) };
};

// ---------------------------------------------------------
// 🎬 约会这一段戏
// ---------------------------------------------------------
const NOT_STUDENT = new Set<CharacterId>([CharacterId.MIYUKI, CharacterId.INARI]);

export interface DateScriptOpts {
  char: CharacterId;
  spot: DateSpot;
  outfit: string;
  calendar: GameCalendar;
  flags: StoryFlags;
  // 这身衣服是主角点名要的，还是她记得你夸过、自己穿来的
  wearReason?: WearReason;
  // 她现在的好感度（约会专属剧情的第三段要够才演）
  affection?: number;
}

export const buildDateScript = (o: DateScriptOpts): StoryNode[] => {
  const { char, spot, outfit, calendar: cal, flags } = o;
  const sp = SPEAKER[char];
  const day = dayIndex(cal);
  const her = (t: { zh: string; en: string }) => ({ zh: t.zh.split('{her}').join(sp.zh), en: t.en.split('{her}').join(sp.en) });
  const img = (m: Mood) => outfitImg(char, outfit, m);
  const say = (l: { jp: string; zh: string; en: string }, m: Mood, words?: StoryWord[]): StoryNode => ({
    type: 'speech', speakerZh: sp.zh, speakerEn: sp.en, color: sp.color, characterImage: img(m),
    jp: l.jp, zh: l.zh, en: l.en, ...(words ? { words } : {})
  });
  const rel = (aff: number, fam: number, zh: string, en: string) =>
    [{ char, affection: aff, familiarity: fam, reasonZh: zh, reasonEn: en }];

  const school = isSchoolDay(cal);
  const slotZh = cal.timeSlot === 'night' ? '夜' : cal.timeSlot === 'lunch' ? '白天' : (school ? '放学后' : '下午');
  const slotEn = cal.timeSlot === 'night' ? 'Night' : cal.timeSlot === 'lunch' ? 'Daytime' : (school ? 'After school' : 'Afternoon');

  const nodes: StoryNode[] = [
    {
      type: 'scene', scene: spot.scene, bgm: spot.bgm,
      titleZh: spot.nameZh, titleEn: spot.nameEn,
      subtitleZh: `${slotZh} · 和${sp.zh}一起`, subtitleEn: `${slotEn} · with ${sp.en}`
    },
    { type: 'narration', ...her(spot.arrive), characterImage: '' },
    // 地方的第一拍：大多数写的就是"她已经在那儿了"
    { type: 'narration', ...her(spot.beats[0]), characterImage: img('neutral') }
  ];

  // 主角在邀约消息里点名要了这一身
  const wearLabel = outfitLabel(char, outfit, false), wearLabelEn = outfitLabel(char, outfit, true);
  if (o.wearReason === 'request') {
    nodes.splice(2, 0, {
      type: 'narration',
      zh: `出门前，你在那条消息的最后多加了一句：「${wearLabel}那一身，穿来好不好？」她隔了很久才回，只回了一个「……」。你一路上都在想那个省略号是什么意思。`,
      en: `Before you set out you added one more line to the message: would she wear the ${wearLabelEn.toLowerCase()}? Her reply took a long time and was just an ellipsis. You spend the whole way there wondering what it meant.`
    });
  }

  // ---- 走近了才看清：她今天穿的是什么 ----
  const seenKey = seenOutfitFlag(char, outfit || 'default');
  const reveal = outfit ? OUTFIT_REVEALS[char]?.[outfit] : undefined;
  if (reveal && !flags[seenKey]) {
    const resp = REVEAL_RESPONSES[char];
    nodes.push(
      { type: 'narration', characterImage: img('neutral'), zh: `你走近了，这才好好看了她一眼——有那么半秒钟，你没认出来那是${sp.zh}。`, en: `You get closer and take a proper look at her, and for half a second you do not recognise ${sp.en}.` },
      { type: 'narration', zh: reveal.lookZh, en: reveal.lookEn },
      say(reveal.line, reveal.line.mood),
      {
        type: 'choice',
        promptZh: `${sp.zh}在等你说点什么。`, promptEn: `${sp.en} is waiting for you to say something.`,
        options: [
          {
            id: 'reveal_praise', labelZh: '「似合ってる。」', labelEn: '"It suits you."', jp: '似合ってる。',
            hintZh: '直球', hintEn: 'Straight to the point',
            words: [{ jp: '似合う', reading: 'にあう', zh: '合适、相配', en: 'to suit' }],
            relations: rel(6, 2, '你说她穿这身很好看', 'You told her it suits her'),
            // 她会记得。以后普通的约会，有时会自己穿这一身来
            setFlags: [praisedOutfitFlag(char, outfit)],
            then: [say(resp.praise, resp.praise.mood)]
          },
          {
            id: 'reveal_stare', labelZh: '说不出话，就那么看着她', labelEn: 'Lose the words and just look at her',
            hintZh: '有时候不说比说更清楚', hintEn: 'Sometimes silence says more',
            relations: rel(4, 3, '你看她看得忘了说话', 'You forgot to speak, looking at her'),
            then: [say(resp.stare, resp.stare.mood)]
          },
          {
            id: 'reveal_tease', labelZh: '「……どちら様？」开个玩笑', labelEn: '"...And you are?" Make a joke of it', jp: '……どちら様ですか？',
            hintZh: '假装认不出来', hintEn: 'Pretend not to recognise her',
            words: [{ jp: 'どちら様', reading: 'どちらさま', zh: '哪位（礼貌地问对方是谁）', en: 'who (polite)' }],
            relations: rel(1, 6, '你拿她的打扮开了个玩笑', 'You made a joke about her outfit'),
            then: [say(resp.tease, resp.tease.mood)]
          }
        ] as StoryOption[]
      },
      { type: 'effect', setFlags: [seenKey] }
    );
  } else if (outfit) {
    const label = outfitLabel(char, outfit, false), labelEn = outfitLabel(char, outfit, true);
    nodes.push({
      type: 'narration', characterImage: img('happy'),
      zh: `${sp.zh}今天穿的是那身${label}——你已经见过一次了，可还是多看了一眼。她发现了，没说什么，只是把头偏开了一点。`,
      en: `${sp.en} is in the ${labelEn.toLowerCase()} again. You have seen it before and you still look twice. She notices, says nothing, and turns her head slightly away.`
    });
  } else if (!NOT_STUDENT.has(char) && school && cal.timeSlot === 'afternoon') {
    nodes.push({
      type: 'narration', characterImage: img('happy'),
      zh: `${sp.zh}没回去换衣服，还是一身校服，书包斜挎着——像是一出校门就直接过来了，连鞋带都是边走边系的。`,
      en: `${sp.en} has not been home to change. Still in uniform, bag slung across her, as if she came straight out of the gate, tying a shoelace on the way.`
    });
  } else {
    nodes.push({
      type: 'narration', characterImage: img('happy'),
      zh: `${sp.zh}穿着平常那一身，看见你，抬了抬手。`,
      en: `${sp.en} is in her usual clothes. She sees you and raises a hand.`
    });
  }

  // 那个省略号的意思：她穿来了
  if (o.wearReason === 'request' && outfit) {
    const l = WEAR_REQUEST_LINES[char];
    nodes.push(say(l, l.mood));
  } else if (o.wearReason === 'praised' && outfit) {
    const l = WEAR_PRAISED_LINES[char];
    nodes.push(
      { type: 'narration', zh: `那是上次你说「似合ってる」的那一身。没有人要求她，她自己穿来了。`, en: `It is the one you told her suited her last time. Nobody asked her to. She wore it anyway.` },
      say(l, l.mood)
    );
  }

  // ---- 这个地方的第二拍 ----
  nodes.push({ type: 'narration', ...her(spot.beats[1]), characterImage: img('happy') });

  // ---- 这一次碰上的小插曲（每次去都可能不一样） ----
  const incidents = DATE_INCIDENTS[spot.id];
  if (incidents?.length) {
    nodes.push({
      type: 'random',
      pick: incidents.map(inc => inc.map((t, i) => ({ type: 'narration', ...her(t), ...(i === 0 ? { characterImage: img(t.mood || 'happy') } : {}) }) as StoryNode))
    });
  }

  // ---- 一次选择 ----
  nodes.push({
    type: 'choice',
    promptZh: her(spot.choice.prompt).zh, promptEn: her(spot.choice.prompt).en,
    options: spot.choice.options.map<StoryOption>(op => ({
      id: `date_${spot.id}_${op.id}`,
      labelZh: op.labelZh, labelEn: op.labelEn,
      ...(op.jp ? { jp: op.jp } : {}),
      hintZh: op.hintZh, hintEn: op.hintEn,
      ...(op.words ? { words: op.words } : {}),
      relations: rel(op.aff, op.fam, `${spot.nameZh}：${op.labelZh}`, `${spot.nameEn}: ${op.labelEn}`),
      ...(op.stat ? { effects: [{ stat: op.stat, amount: 2, reasonZh: `和${sp.zh}在${spot.nameZh}`, reasonEn: `With ${sp.en} at ${spot.nameEn}` }] } : {}),
      then: op.then.map((t, i) => ({ type: 'narration', ...her(t), ...(i === 0 ? { characterImage: img(op.mood || 'happy') } : {}) }) as StoryNode)
    }))
  });

  // ---- 她只会在这种地方说的那句话 ----
  const tl = TAG_LINES[char][spot.tag];
  nodes.push(say(tl, tl.mood));

  // ---- 约会专属剧情：约到第三次、第六次……她会说一些平时不说的话 ----
  const ep = pickDateEpisode(char, pastDateCount(char, flags), flags, o.affection);
  if (ep) nodes.push(...ep.build({ say: (l, m) => say(l, m), img, her }), { type: 'effect', setFlags: [ep.id] });

  if (spot.endScene) nodes.push({ type: 'scene', scene: spot.endScene });

  // ---- 收尾：坐下来，接面对面的对话 ----
  const outro = OUTROS[spot.tag];
  const v = outro[Math.floor(hash01('outro', day, char) * outro.length) % outro.length];
  nodes.push({ type: 'narration', ...her(v), characterImage: img('happy') });
  nodes.push({
    type: 'effect',
    // 钱在这里扣（pay: 不进 flag 表）。约会途中退出的话不扣——那一趟本来就没成。
    setFlags: [datedWithFlag(char), datedSpotFlag(char, spot.id), datedTodayFlag(cal), ...(spot.yen ? [`pay:${spot.yen}`] : [])],
    relations: rel(3, 6, `放学后一起去了${spot.nameZh}`, `Went to ${spot.nameEn} together`),
    effects: [{ stat: spot.stat, amount: 2, reasonZh: `${spot.nameZh}的一段时间`, reasonEn: `Time at ${spot.nameEn}` }]
  });
  return nodes;
};

const OUTROS: Record<string, { zh: string; en: string }[]> = {
  food: [
    { zh: '盘子空了，可谁也没提要走。{her}托着腮看着窗外，过了一会儿，又看回你这边。', en: 'The plates are empty but nobody suggests leaving. {her} rests her chin on her hand and looks out of the window, then back at you.' },
    { zh: '吃完了。你们俩都靠在椅背上，那种吃饱了以后什么都不想动的安静，慢慢地落了下来。', en: 'Finished. You both lean back, and the quiet of being full and not wanting to move settles slowly over you.' }
  ],
  play: [
    { zh: '玩到手都酸了，你们找了个角落坐下来，各自握着一罐饮料。外面的声音还在响，可这个角落好像被谁调小了音量。', en: 'When your hands ache from it you find a corner and sit, each with a can. The noise carries on, but somebody seems to have turned the volume down in this corner.' }
  ],
  scenery: [
    { zh: '风小了一点。{her}在你旁边坐下来，两个人看着同一个方向。这种时候，话好像也会自己找上门来。', en: 'The wind drops a little. {her} sits down beside you and you both look the same way. At times like this, the words tend to come by themselves.' },
    { zh: '天色一点一点地变。你们谁都没提回去的事。', en: 'The sky changes, little by little. Neither of you mentions going home.' }
  ],
  culture: [
    { zh: '出来的时候，外面的光亮得有点刺眼。你们在门口的长椅上坐下来，{her}还在回想刚才看到的东西。', en: 'Outside, the light is almost too bright. You sit on the bench by the entrance, {her} still turning over what you just saw.' }
  ],
  sport: [
    { zh: '两个人都出了一身汗，坐在场边喘气。{her}把一瓶水递过来，瓶身上全是水珠。', en: 'You are both sweating, sitting at the side to get your breath back. {her} passes you a bottle of water beaded with condensation.' }
  ],
  night: [
    { zh: '夜深了，人慢慢少了。你们找了个地方停下来，{her}的声音也跟着夜色一起放低了。', en: 'It is late and the crowd thins. You stop somewhere, and {her} voice drops with the night.' }
  ],
  formal: [
    { zh: '最后上来的是一小杯热茶。{her}双手捧着杯子，坐得比来的时候放松多了。', en: 'Last comes a small cup of hot tea. {her} holds it in both hands, sitting far more at ease than when you arrived.' }
  ],
  home: [
    { zh: '碗洗完了，两个人坐在矮桌两边。屋子很小，小到她一抬头，就正好看见你。', en: 'The washing-up is done and you sit either side of the low table. The room is so small that whenever she looks up, she is looking straight at you.' }
  ]
};

// 给自由对话的那一句"现在是什么情况"
export const dateOccasionNote = (char: CharacterId, spot: DateSpot, outfit: string, en: boolean): string => {
  const lab = outfitLabel(char, outfit, true);
  return en
    ? `This is a date. The player invited you out and you said yes. You are at ${spot.nameEn} together right now, and you came dressed in: ${lab}. You have just done the activity there together; now you are sitting and talking. Act like someone who agreed to come.`
    : `这是一次约会：主角约你出来，你答应了。你们现在正一起在「${spot.nameZh}」，你特意穿了「${outfitLabel(char, outfit, false)}」（${lab}）。刚刚一起逛/玩过了，现在坐下来聊天。要演出"是你自己答应来的"那种状态。`;
};
