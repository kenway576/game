import React, { useRef, useState } from 'react';
import { ProtagonistStats, StatKey, Language, StoryFlags, GoalRecord } from '../types';
import { STAT_METADATA, getStatRankInfo } from '../constants';
import { goalStatus, schoolEval, N1_PASS, N1_SECTION_MIN, KOBE_DOC_MIN, EXAM_DATE_LABEL, INTERVIEW_DATE_LABEL } from '../story/futurePath';

// ---------------------------------------------------------
// 🪪 主人公档案：一张真的学生证 + 五维人格参数
//
// 学生证不再是一整张图片，而是用 HTML 画的：名字是玩家在序章里自己输的，
// 烤进图片就写死了；字段、校印、反光都要能跟着数据变。
// 证件照是 public/images/ui/student_photo.webp（scripts/icons/gen-profile-art.mjs photo）：
// 寸头、朴素、体格壮硕的中国交换生——和旧学生证同一个人，画成立绘的画风。
//
// 正面是学生证，点一下翻到背面：背面是五维的雷达图和综合评级。
// 鼠标在卡上移动，卡会跟着倾斜，镀膜的反光会跟着走——拿在手里的那种感觉。
// ---------------------------------------------------------

interface Props {
  stats: ProtagonistStats;
  playerName: string;
  language: Language;
  storyFlags?: StoryFlags;
  goal?: GoalRecord;
  onClose: () => void;
}

const STAT_KEYS: StatKey[] = ['knowledge', 'guts', 'kindness', 'charm', 'proficiency'];
const RANK_LETTER = ['', 'D', 'C', 'B', 'A', 'S'];

// 五边形雷达图
const Radar: React.FC<{ stats: ProtagonistStats; en: boolean; active: StatKey; onPick: (k: StatKey) => void }> = ({ stats, en, active, onPick }) => {
  const R = 78, C = 100;
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  };
  const ratio = (k: StatKey) => {
    const ranks = STAT_METADATA[k].ranks;
    const top = ranks[ranks.length - 1].threshold * 1.15;
    return Math.max(0.06, Math.min(1, stats[k] / top));
  };
  const poly = STAT_KEYS.map((k, i) => pt(i, R * ratio(k)).join(',')).join(' ');
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={STAT_KEYS.map((_, i) => pt(i, R * f).join(',')).join(' ')}
          fill={f === 1 ? 'rgba(255,255,255,0.55)' : 'none'} stroke="rgba(31,36,64,0.14)" strokeWidth={0.8} />
      ))}
      {STAT_KEYS.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="rgba(31,36,64,0.12)" strokeWidth={0.8} />; })}
      <polygon points={poly} fill="rgba(255,107,139,0.28)" stroke="#ff6b8b" strokeWidth={1.8} strokeLinejoin="round" />
      {STAT_KEYS.map((k, i) => {
        const [x, y] = pt(i, R * ratio(k));
        const [lx, ly] = pt(i, R + 17);
        const meta = STAT_METADATA[k];
        return (
          <g key={k} className="cursor-pointer" onClick={e => { e.stopPropagation(); onPick(k); }}>
            <circle cx={x} cy={y} r={active === k ? 4.2 : 3} fill={meta.color} stroke="#fff" strokeWidth={1.4} />
            <image href={meta.badgeUrl} x={lx - 11} y={ly - 15} width={22} height={22} />
            <text x={lx} y={ly + 14} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={active === k ? '#ff6b8b' : '#4b5375'}>
              {en ? meta.nameEn : meta.nameZh.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// 🎯 申请表上的那两行字：N1 和神户大学推荐（story/futurePath.ts）
const STAGE_LABEL: Record<string, [string, string, string]> = {
  pass: ['合格', 'Passed', 'bg-emerald-100 text-emerald-700'],
  fail: ['未达成', 'Not this time', 'bg-rose-100 text-rose-600'],
  waiting: ['等结果', 'Waiting', 'bg-amber-100 text-amber-700'],
  todo: ['进行中', 'In progress', 'bg-sky-100 text-sky-700'],
  locked: ['—', '—', 'bg-slate-100 text-slate-500']
};
const GoalPanel: React.FC<{ en: boolean; stats: ProtagonistStats; flags: StoryFlags; goal: GoalRecord }> = ({ en, stats, flags, goal }) => {
  const g = goalStatus(flags, goal);
  const doc = schoolEval(stats);
  const n1Line = g.jlpt
    ? `${g.jlpt.total}/180 · ${en ? 'lang' : '言语'} ${g.jlpt.lang} · ${en ? 'reading' : '阅读'} ${g.jlpt.read} · ${en ? 'listening' : '听力'} ${g.jlpt.listen}`
    : g.n1 === 'waiting' ? (en ? 'Taken. Results in late January.' : '考完了 · 一月下旬放榜')
    : g.mock ? (en ? `September mock: ${g.mock.total}/180 (pass ${N1_PASS}, every section ${N1_SECTION_MIN}+)` : `九月模拟考 ${g.mock.total}/180（合格线 ${N1_PASS}，每科 ≥${N1_SECTION_MIN}）`)
    : (en ? 'Mock exam in September.' : '九月有一次模拟考');
  const n1Hint = en
    ? 'Language ← Knowledge + wordbook · Reading ← Knowledge + Guts · Listening ← Kindness + Knowledge'
    : '言语知识 ← 知识 + 单词本 · 阅读 ← 知识 + 勇气 · 听力 ← 体贴 + 知识';
  const kobeLine = g.kobeScore
    ? (en ? `Interview ${g.kobeScore.interview} · essay ${g.kobeScore.essay} · school ${g.kobeScore.doc}` : `面试 ${g.kobeScore.interview} · 小论文 ${g.kobeScore.essay} · 校内评定 ${g.kobeScore.doc}`)
    : g.recDenied ? (en ? 'The school’s one place went to someone else.' : '学校唯一的推荐名额给了别人')
    : g.n1 === 'fail' ? (en ? 'Needs N1.' : '没有 N1，就没有推荐')
    : g.recommended ? (en ? `Recommended. Interview and essay on ${INTERVIEW_DATE_LABEL.en}.` : `已获推荐 · ${INTERVIEW_DATE_LABEL.zh}面试 + 小论文`)
    : (en ? `School assessment now: ${doc} (needs ${KOBE_DOC_MIN})` : `现在的校内评定 ${doc}（推荐要 ${KOBE_DOC_MIN}）`);
  const kobeHint = en
    ? 'N1 → school assessment (average of all five) → interview (Guts, Charm) + essay (Knowledge, Kindness)'
    : 'N1 合格 → 校内评定（五维平均）→ 面试（勇气、魅力）+ 小论文（知识、体贴）';
  const rows = [
    { k: 'n1', title: 'JLPT N1', date: en ? EXAM_DATE_LABEL.en : EXAM_DATE_LABEL.zh, st: g.n1, line: n1Line, hint: n1Hint },
    { k: 'kobe', title: en ? 'Kobe University · recommended entry' : '神户大学 · 推荐入学', date: en ? 'Feb–Mar' : '二月面试', st: g.kobe, line: kobeLine, hint: kobeHint }
  ];
  return (
    <div className="w-full max-w-[520px] rounded-2xl bg-white/75 border border-white shadow-[0_6px_18px_rgba(16,20,44,0.08)] p-4">
      <div className="font-ui text-[10px] font-bold tracking-[0.3em] text-pink-500 mb-2">{en ? 'WHAT YOU CAME FOR' : '申请表上的两行字'}</div>
      <div className="flex flex-col gap-3">
        {rows.map(r => (
          <div key={r.k}>
            <div className="flex items-center gap-2">
              <span className="font-ui font-black text-[#1f2440] text-sm">{r.title}</span>
              <span className="text-[10px] text-[#7a7fa0]">{r.date}</span>
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${STAGE_LABEL[r.st][2]}`}>{en ? STAGE_LABEL[r.st][1] : STAGE_LABEL[r.st][0]}</span>
            </div>
            <div className="text-xs text-[#2b3152] mt-1">{r.line}</div>
            <div className="text-[10px] text-[#7a7fa0] mt-0.5 leading-relaxed">{r.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProtagonistProfileModal: React.FC<Props> = ({ stats, playerName, language, storyFlags = {}, goal = {}, onClose }) => {
  const en = language === 'en';
  const [selected, setSelected] = useState<StatKey>('knowledge');
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const info = getStatRankInfo(selected, stats[selected]);
  const meta = STAT_METADATA[selected];
  const name = playerName || (en ? 'Protagonist' : '主人公');

  // 综合评级：五维的平均段位
  const avg = STAT_KEYS.reduce((n, k) => n + getStatRankInfo(k, stats[k]).rank, 0) / STAT_KEYS.length;
  const overall = RANK_LETTER[Math.max(1, Math.min(5, Math.round(avg)))];

  const onMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 12, gx: px * 100, gy: py * 100 });
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#141a33]/60 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200" onClick={onClose}>
      <style>{`
        @keyframes id-shine { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
        .id-foil { background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.0) 30%, rgba(255,180,220,0.35) 40%, rgba(160,220,255,0.35) 48%, rgba(255,240,170,0.3) 56%, rgba(255,255,255,0) 66%, transparent 80%); background-size: 200% 100%; mix-blend-mode: overlay; animation: id-shine 6s linear infinite; }
      `}</style>
      <div className="ui-panel w-full max-w-5xl max-h-[92dvh] overflow-y-auto p-5 md:p-8" onClick={e => e.stopPropagation()}>
        {/* 标题 */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="font-ui text-[10px] md:text-xs font-bold tracking-[0.4em] text-pink-500">{en ? 'PROFILE' : 'PROFILE · 主人公档案'}</div>
            <h2 className="font-ui text-2xl md:text-3xl font-black text-[#1f2440] tracking-wide">{name}</h2>
          </div>
          <button onClick={onClose} className="ui-chip !px-5">{en ? 'Close' : '关闭'}</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ---------- 左：学生证（可翻面） ---------- */}
          <div className="lg:col-span-6 flex flex-col items-center gap-3">
            <div
              ref={cardRef}
              className="relative w-full max-w-[520px] cursor-pointer select-none"
              style={{ aspectRatio: '85.6 / 54', perspective: 1200, containerType: 'inline-size' }}
              onMouseMove={onMove}
              onMouseLeave={() => setTilt({ x: 0, y: 0, gx: 50, gy: 50 })}
              onClick={() => setFlipped(f => !f)}
            >
              <div
                className="absolute inset-0 transition-transform duration-500"
                style={{ transformStyle: 'preserve-3d', transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (flipped ? 180 : 0)}deg)` }}
              >
                {/* 正面 */}
                <div className="absolute inset-0 rounded-[18px] overflow-hidden shadow-[0_18px_40px_rgba(16,20,44,0.35)] border border-white"
                     style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(160deg,#fffdf8 0%,#f6f1ff 55%,#eef6ff 100%)' }}>
                  {/* 底纹：细斜线 + 淡淡的锚 */}
                  <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'repeating-linear-gradient(135deg,#1f2440 0 1px,transparent 1px 9px)' }} />
                  {/* 抬头 */}
                  <div className="relative h-[22%] flex items-center justify-between px-[4.5%]" style={{ background: 'linear-gradient(100deg,#1f2a5c,#2f3f86 60%,#3d4f9e)' }}>
                    <div className="flex items-center" style={{ gap: '2.2cqw' }}>
                      {/* 校徽：锚 + 樱花 */}
                      <svg viewBox="0 0 40 40" className="shrink-0" style={{ width: '9.5cqw', height: '9.5cqw' }}>
                        <circle cx="20" cy="20" r="18" fill="#fff" fillOpacity="0.15" stroke="#ffd7e2" strokeWidth="1.5" />
                        <path d="M20 9v20M13 15h14M11 24c2 5 6 7 9 7s7-2 9-7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                        <circle cx="20" cy="9" r="2.6" fill="#ffb3c6" />
                      </svg>
                      <div className="leading-tight whitespace-nowrap">
                        <div className="text-pink-100/90 tracking-[0.3em]" style={{ fontSize: '1.9cqw' }}>兵庫県立</div>
                        <div className="font-story font-bold text-white tracking-[0.18em]" style={{ fontSize: '3.7cqw' }}>港見高等学校</div>
                      </div>
                    </div>
                    <div className="text-right leading-tight">
                      <div className="font-story text-white/95 tracking-[0.4em]" style={{ fontSize: '2.9cqw' }}>学生証</div>
                      <div className="font-ui text-pink-200/90 tracking-[0.25em]" style={{ fontSize: '1.55cqw' }}>STUDENT ID</div>
                    </div>
                  </div>
                  {/* 身体 */}
                  <div className="relative flex h-[78%] px-[4.5%] py-[4%] gap-[4.5%]">
                    <div className="h-full aspect-[3/4] rounded-lg overflow-hidden border-[3px] border-white shadow-[0_4px_14px_rgba(16,20,44,0.25)] bg-sky-100 shrink-0">
                      <img src="/images/ui/student_photo.webp" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-[1%]">
                      <div>
                        <div className="text-[#7a7fa0] tracking-[0.35em]" style={{ fontSize: '1.75cqw' }}>氏　名</div>
                        <div className="font-story font-bold text-[#1f2440] truncate border-b border-[#1f2440]/20 pb-[2%]" style={{ fontSize: '5cqw', letterSpacing: '0.06em' }}>{name}</div>
                      </div>
                      {[
                        ['学年・組', '二年 B 組'],
                        ['生徒番号', '2 - B - 34'],
                        ['住　　所', '神戸市中央区 海風荘 201'],
                        ['有効期限', '令和八年三月三十一日']
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline gap-[4%] border-b border-dashed border-[#1f2440]/15 pb-[1%]">
                          <span className="text-[#7a7fa0] tracking-[0.2em] shrink-0" style={{ fontSize: '1.65cqw' }}>{k}</span>
                          <span className="font-story text-[#2b3152] truncate" style={{ fontSize: '2.35cqw' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    {/* 校印：红色的方章，盖歪一点 */}
                    <div className="absolute right-[5%] bottom-[9%] rotate-[-12deg] opacity-80 pointer-events-none" style={{ width: '15%', aspectRatio: '1' }}>
                      <svg viewBox="0 0 60 60" className="w-full h-full">
                        <rect x="4" y="4" width="52" height="52" rx="6" fill="none" stroke="#d6334f" strokeWidth="3.2" />
                        <rect x="9" y="9" width="42" height="42" rx="3" fill="none" stroke="#d6334f" strokeWidth="1.2" />
                        <text x="30" y="27" textAnchor="middle" fontSize="14" fontWeight="700" fill="#d6334f" fontFamily="'Noto Serif JP',serif">港見</text>
                        <text x="30" y="45" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d6334f" fontFamily="'Noto Serif JP',serif">高校印</text>
                      </svg>
                    </div>
                    {/* 综合评级 */}
                    <div className="absolute left-[4.5%] bottom-[6%] ui-chip !py-0.5 !px-2.5" style={{ fontSize: '2.1cqw' }}>
                      ✦ {en ? 'Overall' : '综合评级'} <b className="text-pink-500 ml-1">{overall}</b>
                    </div>
                  </div>
                  {/* 镀膜反光：跟着鼠标走 + 慢慢流动 */}
                  <div className="absolute inset-0 id-foil pointer-events-none" />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.45), transparent 45%)`, mixBlendMode: 'soft-light' }} />
                </div>

                {/* 背面：五维雷达 */}
                <div className="absolute inset-0 rounded-[18px] overflow-hidden shadow-[0_18px_40px_rgba(16,20,44,0.35)] border border-white"
                     style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(200deg,#fff6fa 0%,#f3f0ff 60%,#e9f3ff 100%)' }}>
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#1f2440 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                  <div className="relative h-full flex items-center px-[5%] gap-[3%]">
                    <div className="h-[92%] aspect-square"><Radar stats={stats} en={en} active={selected} onPick={setSelected} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-ui text-pink-500 font-bold tracking-[0.3em]" style={{ fontSize: '1.9cqw' }}>PERSONA PARAMETERS</div>
                      <div className="font-story font-bold text-[#1f2440]" style={{ fontSize: '3.5cqw' }}>{en ? 'Five Traits' : '五维人格参数'}</div>
                      <div className="mt-[6%] flex items-baseline gap-2">
                        <span className="font-ui font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-amber-300" style={{ fontSize: '12cqw', lineHeight: 1 }}>{overall}</span>
                        <span className="text-[#5b6286]" style={{ fontSize: '2.1cqw' }}>{en ? 'overall' : '综合评级'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 id-foil pointer-events-none" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#7a7fa0]">{en ? 'Tap the card to turn it over' : '点一下卡片可以翻面'}</p>
            <GoalPanel en={en} stats={stats} flags={storyFlags} goal={goal} />
          </div>

          {/* ---------- 右：五维 ---------- */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="grid grid-cols-5 gap-2">
              {STAT_KEYS.map(key => {
                const m = STAT_METADATA[key];
                const r = getStatRankInfo(key, stats[key]);
                const on = selected === key;
                return (
                  <button key={key} onClick={() => setSelected(key)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all ${on ? 'bg-white border-pink-300 shadow-[0_6px_18px_rgba(255,107,139,0.25)] -translate-y-0.5' : 'bg-white/60 border-transparent hover:bg-white hover:border-[#1f2440]/10'}`}>
                    <img src={m.badgeUrl} alt="" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                    <span className="font-ui text-[11px] font-bold text-[#1f2440]">{en ? m.nameEn : m.nameZh.split(' ')[0]}</span>
                    <span className="font-ui text-[10px] font-black px-2 rounded-full" style={{ background: `${m.color}22`, color: m.color }}>{RANK_LETTER[r.rank] || r.rank} · {r.rank}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-white/75 border border-white p-4 md:p-5 shadow-[0_6px_20px_rgba(16,20,44,0.08)]">
              <div className="flex items-center gap-3">
                <img src={meta.badgeUrl} alt="" className="w-14 h-14 object-contain shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-ui text-lg font-black text-[#1f2440]">{en ? meta.nameEn : meta.nameZh}</h3>
                    <span className="font-ui text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${meta.color}20`, color: meta.color }}>
                      Rank {info.rank} · {en ? info.nameEn : info.nameZh}
                    </span>
                  </div>
                  <p className="text-xs text-[#5b6286] mt-0.5">{en ? info.descEn : info.descZh}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#5b6286] font-bold">{en ? 'Growth' : '成长经验'}</span>
                  <span className="font-mono text-[#1f2440] font-bold">{info.currentValue} / {info.nextThreshold}</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#1f2440]/8 overflow-hidden" style={{ background: 'rgba(31,36,64,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${info.progressPercent}%`, background: `linear-gradient(90deg, ${meta.color}aa, ${meta.color})` }} />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <span className="font-ui text-[11px] font-bold text-[#7a7fa0] tracking-widest">{en ? 'RANKS' : '阶梯称号'}</span>
                {meta.ranks.map(r => {
                  const got = stats[selected] >= r.threshold;
                  return (
                    <div key={r.rank} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs ${got ? 'bg-pink-50 text-[#1f2440]' : 'text-[#1f2440]/35'}`}>
                      <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center font-black text-[10px] ${got ? 'text-white' : 'bg-[#1f2440]/8'}`} style={got ? { background: meta.color } : undefined}>{r.rank}</span>
                      <span className="font-bold shrink-0">{en ? r.nameEn : r.nameZh}</span>
                      <span className="truncate text-[11px] opacity-80">{en ? r.descEn : r.descZh}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
