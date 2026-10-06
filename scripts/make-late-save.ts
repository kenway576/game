// ---------------------------------------------------------
// 💾 造一份"后期"存档（测试 / 想直接看后期内容用）
//
//   node scripts/make-late-save.mjs [--month 11 --day 21] [--out .generated/late-save.json]
//
// 由 scripts/make-late-save.mjs 用 esbuild 打包后运行——这样日期、星期、CG 列表都用游戏自己的代码算，
// 不会跟游戏对不上。
//
// 内容：
//   · 八个人親密度、好感度都在 Lv.5（服装、表情全解锁），好感度 ≥ 200 → 结局走「相爱」
//   · 每人专属剧情①②已经看过（标上完成 flag 和一条正面的选项），③排在待播队列里，
//     去她剧情的那个地方就会演——八个人的结局都留给玩家自己看
//   · 主线（外公的地图）第二到四章已经看过，第五章 1/17 才会来
//   · 一年级 11 月下旬，五项属性都在 Rank 4 左右，钱够用
// 输出的是 localStorage 里那个键的值（{ meta, data } 的 JSON）。
// ---------------------------------------------------------
import fs from 'fs';
import { weekdayFor, CHARACTER_CGS, VISIBLE_CHARACTER_IDS, SAVE_SLOT_PREFIX } from '../constants';
import { INITIAL_LIFE_STATE } from '../data/lifeData';
import { INITIAL_SOCIAL_STATE } from '../data/socialLimits';
import { CharacterId } from '../types';

const arg = (n: string, d?: string) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const MONTH = Number(arg('month', '11')), DAY = Number(arg('day', '21'));
const OUT = arg('out', '.generated/late-save.json')!;
const PLAYER = arg('name', '王')!;

const ids = VISIBLE_CHARACTER_IDS as CharacterId[];

// 关系：親密度 Lv.5 从 210 起、好感度 Lv.5 从 220 起（满 250）。各人稍微错开一点，看着不像批量改的
const affection: Record<string, number> = { asuka: 228, hikari: 232, rei: 224, inari: 226, miyuki: 230, sora: 225, nao: 236, maki: 227 };
const familiarity: Record<string, number> = { asuka: 236, hikari: 240, rei: 232, inari: 234, miyuki: 238, sora: 233, nao: 250, maki: 235 };

// 专属剧情①②看过：完成 flag + 每段里一条比较正面的选项
const STORY_FLAGS = [
  'asuka_story_thanked_furigana', 'asuka_story_1_done', 'asuka_notebook', 'asuka_story_rank_second', 'asuka_story_2_done',
  'hikari_story_asked_week', 'hikari_story_1_done', 'hikari_story_saw_through', 'hikari_story_waved_first', 'hikari_story_2_done', 'hikari_story_the_wall',
  'inari_story_saw_leaves', 'inari_story_fourth_tree', 'inari_story_1_done', 'inari2_took_mask', 'inari_story_first_name', 'inari_story_2_done', 'inari_story_book_of_names',
  'maki_story_asked_waiting', 'maki_story_1_done', 'maki_story_sat_beside', 'maki2_asked_time', 'maki_story_2_done', 'maki_story_the_steps',
  'miyuki_story_offered_to_cook', 'miyuki_story_1_done', 'miyuki_story_sat_down', 'miyuki_story_made_tea', 'miyuki_story_2_done', 'miyuki_story_the_role',
  'nao_story_called_it', 'nao_story_asked_her_ten_years', 'nao_story_1_done', 'nao_story_teach_me', 'nao_story_2_done', 'nao_story_the_gap',
  'rei_story_took_notes', 'rei_story_showed_journal', 'rei_story_1_done', 'rei_story_named_it', 'rei_story_refused_removal', 'rei_story_2_done', 'rei_story_keeps_recording',
  'sora_story_page_eleven', 'sora_story_saw_shoulder', 'sora_story_1_done', 'sora_story_watched_all', 'sora_story_2_done', 'sora_story_shoulder'
];
// 主线：第二到四章看过
const MAIN_FLAGS = ['been_ikuta_shrine', 'main2_asked_three', 'main_ch2_done', 'main3_asked_why', 'main_ch3_done', 'main4_asked_waiting', 'main_ch4_done'];
// 序章、第一天：照一份正常通关的流程
const PROLOGUE_FLAGS = ['prologue_train_journal', 'prologue_helped_mother', 'prologue_spoke_first', 'prologue_unpack_call', 'prologue_read_journal_deep',
  'prologue_walk_kitano', 'prologue_met_rei', 'prologue_name_given'];

const flags: Record<string, boolean> = {};
for (const f of [...PROLOGUE_FLAGS, ...STORY_FLAGS, ...MAIN_FLAGS]) flags[f] = true;

// 第③段：亲密度轴 Lv.5（奈绪挂在好感度轴上）
const pendingLevelUps = ids.map(id => ({ charId: id, axis: id === 'nao' ? 'affection' : 'familiarity', level: 5 }));

const MEMORY: Record<string, string> = {
  asuka: '委員長。最初は日本語のできない編入生として見ていたが、今は一番近くで支えてくれる人だと認めている。二番でいいと初めて言えた相手。素直になるのはまだ苦手。',
  hikari: '同じ船に乗った留学生仲間。一週間先に来た先輩として張り合っていたが、今は隣にいるのが当たり前。弱音を見せられる唯一の人。',
  rei: '一九〇四年の資料から始まった付き合い。観測できない値——自分の気持ち——を、この人の前でだけ記録し続けている。',
  inari: '千年生きた狐。面の下を見せた人の子。名前の帳に、この人の名は消えない字で書いてある。人の時間の短さを、初めて惜しいと思っている。',
  miyuki: '隣の二〇二号室。お姉さんの役をやめて、名前で呼んでほしいと思い始めている。夕飯はほぼ毎晩一緒。',
  sora: 'バスケ部のエース。肩の話を全部知っている唯一の人。試合中にも観客席を探してしまう。',
  nao: '十年来の幼馴染。知らない顔を見せ合って、距離が少しずつ縮んできた。もう「ただの幼馴染」とは言えない。',
  maki: 'ゲーム好きの後輩。待ち伏せの理由はとっくにバレている。センパイの前でだけ、本音が漏れる。'
};

const save = {
  meta: {
    timestamp: Date.now(),
    playerName: PLAYER,
    topic: 'General (综合练习)',
    charId: 'hikari',
    previewText: `【後期データ】${MONTH}月${DAY}日 · 全員 Lv.5`,
    isAutoSave: false
  },
  data: {
    userState: { learningGoal: '', grammarTopic: 'General (综合练习)', playerName: PLAYER, email: '', collectedWords: [], language: 'zh' },
    gameMode: 'LOBBY',
    selectedCharId: 'hikari',
    chatMode: 'FREE_TALK',
    messages: [],
    chatHistories: Object.fromEntries(ids.map(id => [id, []])),
    customAssets: { backgroundImage: null, characters: Object.fromEntries(ids.map(id => [id, null])) },
    affectionMap: affection,
    familiarityMap: familiarity,
    memoryMap: MEMORY,
    protagonistStats: { knowledge: 74, guts: 68, kindness: 77, charm: 66, proficiency: 70 },
    gameCalendar: { year: 1, month: MONTH, day: DAY, dayOfWeek: weekdayFor(MONTH, DAY), timeSlot: 'afternoon', weather: 'sunny' },
    storyFlags: flags,
    prologueDone: true,
    day1Done: true,
    unlockedCgs: ['cg_prologue_grandfather_journal', 'cg_student_id', 'cg_nao_shopping_dusk', ...Object.values(CHARACTER_CGS).map(c => c.id)],
    life: { ...INITIAL_LIFE_STATE, yen: 80000 },
    metChars: ids,
    pendingLevelUps,
    phoneChats: {},
    social: INITIAL_SOCIAL_STATE,
    prologueProgress: null,
    playingDay1: false,
    day1Progress: null
  }
};
fs.writeFileSync(OUT, JSON.stringify(save));
console.log(`${OUT}  键名前缀 ${SAVE_SLOT_PREFIX}  日期 ${MONTH}/${DAY} ${save.data.gameCalendar.dayOfWeek}  CG ${save.data.unlockedCgs.length} 张`);
