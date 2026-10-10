# ---------------------------------------------------------
# 🎼 Beat Crash 谱面：从游戏自己的 BGM 里扒出来
#
#   python scripts/rhythm/make_charts.py
#
# 每首歌：
#   1. librosa 找拍子（beat_track），在拍子之间插值出 8 分、16 分的格子
#   2. 选整首里最热闹的一段（约 85 秒，从一个四拍的头开始），前面留 2 秒淡入
#   3. 四个频段各算一条起音强度：低音 → 最左轨，高音 → 最右轨
#   4. 格子上起音够强就放一个音符；难度决定用哪层格子、留多少、最小间隔、双押
# 输出 data/rhythmCharts.ts（时间都是相对"从 playFrom 开始播"的秒数）
# ---------------------------------------------------------
import json, os
import numpy as np, librosa

SONGS = [
    # 文件名, 显示标题, 每首的速度倍率修正（librosa 偶尔把慢歌算成两倍速）
    ('Velvet_Pavement.mp3',          'Velvet Pavement',         1.0),
    ('Stroll_through_the_Arcade.mp3', 'Stroll through the Arcade', 1.0),
    ('Opening_the_Blinds.mp3',       'Opening the Blinds',      1.0),
    ('Asphalt_Tip_Off.mp3',          'Asphalt Tip-Off',         1.0),
    ('Three_O_clock_in_Kobe.mp3',    "Three O'clock in Kobe",   1.0),
    ('Arcade_High_Score.mp3',        'Arcade High Score',       1.0),
]
SR = 22050
HOP = 512
SEG = 85.0      # 一局的长度（秒）
LEAD = 2.0      # 第一个音符之前留的淡入
LANES = 4

DIFF = {
    # grid: 用几分音符的格子；keep: 留下最强的多少比例；gap: 同一时刻之外的最小间隔；
    # dbl: 双押的比例（只在最强的拍上）；cap: 每秒最多几个
    1: dict(grid=4,  keep=0.55, gap=0.40, dbl=0.0,  cap=1.7, run=2),
    2: dict(grid=8,  keep=0.42, gap=0.20, dbl=0.04, cap=3.0, run=2),
    3: dict(grid=16, keep=0.40, gap=0.11, dbl=0.08, cap=5.2, run=3),
}

def band_onsets(y):
    S = librosa.feature.melspectrogram(y=y, sr=SR, hop_length=HOP, n_mels=64, fmax=11000)
    S = librosa.power_to_db(S, ref=np.max)
    edges = [0, 10, 24, 40, 64]
    bands = []
    for a, b in zip(edges[:-1], edges[1:]):
        o = librosa.onset.onset_strength(S=S[a:b], sr=SR, hop_length=HOP)
        o = o / (np.percentile(o, 98) + 1e-9)
        bands.append(np.clip(o, 0, 1.5))
    return np.array(bands)  # (4, frames)

def grid_from_beats(beats, div):
    """beats: 拍点时间。div: 4=四分, 8=八分, 16=十六分。返回 (时间, 层级) 层级 0=拍上 1=八分 2=十六分"""
    pts = []
    sub = div // 4
    for i in range(len(beats) - 1):
        a, b = beats[i], beats[i + 1]
        for k in range(sub):
            lvl = 0 if k == 0 else (1 if (k * 2) % sub == 0 else 2)
            pts.append((a + (b - a) * k / sub, lvl))
    pts.append((beats[-1], 0))
    return pts

def make(file, title, fix):
    y, _ = librosa.load('public/audio/bgm/' + file, sr=SR, mono=True)
    dur = len(y) / SR
    oenv = librosa.onset.onset_strength(y=y, sr=SR, hop_length=HOP)
    tempo, bf = librosa.beat.beat_track(onset_envelope=oenv, sr=SR, hop_length=HOP, start_bpm=120)
    beats = librosa.frames_to_time(bf, sr=SR, hop_length=HOP)
    bpm = float(np.atleast_1d(tempo)[0]) * fix
    B = band_onsets(y)
    frames = B.shape[1]
    t2f = lambda t: min(frames - 1, max(0, int(round(t * SR / HOP))))

    # 选段：每 4 拍一个候选起点，挑窗口里起音最密的一段
    best, bstart = -1, 0
    for i in range(0, len(beats), 4):
        s = beats[i]
        if s < LEAD or s + SEG > dur - 1: continue
        sc = oenv[t2f(s):t2f(s + SEG)].mean()
        if sc > best: best, bstart = sc, i
    seg0 = beats[bstart]
    play_from = seg0 - LEAD
    seg_beats = [b for b in beats if seg0 - 1e-6 <= b <= seg0 + SEG]

    charts = {}
    for d, P in DIFF.items():
        pts = grid_from_beats(seg_beats, P['grid'])
        # 每个格子的起音：前后各 1 帧取最大
        cand = []
        for t, lvl in pts:
            f = t2f(t)
            v = B[:, max(0, f - 1):f + 2].max(axis=1)
            w = v.max() * (1.25 if lvl == 0 else 1.0 if lvl == 1 else 0.85)
            cand.append((t, lvl, w, v))
        ws = np.array([c[2] for c in cand])
        thr = np.quantile(ws, 1 - P['keep'])
        dbl_thr = np.quantile(ws, 1 - P['dbl']) if P['dbl'] > 0 else 9
        notes, last_t, last_lane, run = [], -9, -1, 0
        for t, lvl, w, v in cand:
            if w < thr or t - last_t < P['gap'] - 1e-6: continue
            order = list(np.argsort(-v))
            lane = int(order[0])
            # 同一条轨连续太多就换到第二强的频段
            if lane == last_lane and run >= P['run']: lane = int(order[1])
            run = run + 1 if lane == last_lane else 1
            notes.append([round(t - play_from, 3), lane])
            if w >= dbl_thr and lvl == 0:
                l2 = (lane + 2) % LANES
                notes.append([round(t - play_from, 3), l2])
            last_t, last_lane = t, lane
        # 密度上限：超了就从最弱的开始删（按秒分桶）
        cap = P['cap']
        by_sec = {}
        for n in notes: by_sec.setdefault(int(n[0]), []).append(n)
        keep = []
        for sec, ns in by_sec.items():
            if len(ns) > cap + 0.5:
                ns = sorted(ns, key=lambda n: -B[n[1], t2f(n[0] + play_from)])[:int(round(cap))]
            keep += ns
        charts[d] = sorted(keep, key=lambda n: (n[0], n[1]))
    rel_beats = [round(b - play_from, 3) for b in seg_beats]
    out = dict(id=os.path.splitext(file)[0].lower(), file='bgm/' + file, title=title, bpm=round(bpm),
               playFrom=round(play_from, 3), length=round(SEG + LEAD + 1.5, 2), beats=rel_beats,
               charts={str(k): v for k, v in charts.items()})
    print(f"{title:28s} bpm {bpm:5.1f}  段落 {seg0:6.1f}s 起  " + '  '.join(f"{k}:{len(v)}个({len(v)/SEG:.2f}/s)" for k, v in charts.items()), flush=True)
    return out

if __name__ == '__main__':
    data = [make(*s) for s in SONGS]
    body = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    head = [
        '// 自动生成：python scripts/rhythm/make_charts.py —— 别手改，改脚本重跑',
        '// 时间单位秒，从 playFrom 开始播放算起；notes = [时间, 轨道 0-3]',
        'export interface RhythmSong { id: string; file: string; title: string; bpm: number; playFrom: number; length: number; beats: number[]; charts: Record<string, [number, number][]> }',
        'export const RHYTHM_SONGS: RhythmSong[] = ' + body + ';',
    ]
    with open('data/rhythmCharts.ts', 'w', encoding='utf-8') as f:
        f.write(chr(10).join(head) + chr(10))
    print('写好了 data/rhythmCharts.ts')
