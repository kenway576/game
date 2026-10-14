# ---------------------------------------------------------
# 🔊 UI 音效：用合成做出"贵一点"的声音
#
#   python scripts/audio/make_sfx.py
#
# 以前的音效是很短的方波/噪声，听起来像廉价网页。这一版的原则：
#   · 每个声音都有"身体"：木头/玻璃/琴弦的物理共振（衰减正弦叠加、Karplus-Strong 拨弦、FM 钟声），
#     而不是一个纯电子音
#   · 一点点空间：用生成的立体声小房间混响，尾巴很短，不糊
#   · 立体声：干声在正中间，混响左右去相关——外放成单声道也不会互相抵消
#   · 关系提升有两套音色：好感 = 暖的竖琴，親密 = 冷的钢片琴（和以前的设计一致）
# 输出 public/audio/sfx/v2/<名字>.wav，并更新 public/audio/manifest.json 的 sfx 表
# ---------------------------------------------------------
import json, os
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
import soundfile as sf

SR = 44100
OUT = 'public/audio/sfx/v2'
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def t_(dur): return np.arange(int(SR * dur)) / SR

def env(n, a=0.002, d=0.2, curve=4.0):
    """快速起音 + 指数衰减"""
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    return att * np.exp(-t / max(d, 1e-4) * curve / 4)

def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype='band', fs=SR, output='sos'); return sosfilt(sos, x)
def lp(x, f, order=2):
    sos = butter(order, f, btype='low', fs=SR, output='sos'); return sosfilt(sos, x)
def hp(x, f, order=2):
    sos = butter(order, f, btype='high', fs=SR, output='sos'); return sosfilt(sos, x)

def modal(freqs, amps, decays, dur):
    """木头/玻璃这种物体的共振：几组衰减正弦"""
    t = t_(dur); y = np.zeros_like(t)
    for f, a, d in zip(freqs, amps, decays):
        y += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t / d)
    return y

def fm_bell(f, dur, idx=3.0, ratio=1.4, decay=0.6, amp=1.0):
    t = t_(dur)
    mod = idx * np.exp(-t / (decay * 0.5)) * np.sin(2 * np.pi * f * ratio * t)
    return amp * np.sin(2 * np.pi * f * t + mod) * np.exp(-t / decay)

def pluck(f, dur, bright=0.5, amp=1.0):
    """Karplus-Strong 拨弦（竖琴、琴弦）"""
    n = int(SR * dur); N = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, N); buf = lp(buf, 2000 + 6000 * bright)
    y = np.zeros(n); i = 0
    for k in range(n):
        y[k] = buf[i]
        nxt = (i + 1) % N
        buf[i] = 0.996 * 0.5 * (buf[i] + buf[nxt])
        i = nxt
    return amp * y

def noise(dur): return rng.uniform(-1, 1, int(SR * dur))

def place(total, parts):
    """parts: (起始秒, 信号)"""
    y = np.zeros(int(SR * total))
    for t0, s in parts:
        a = int(SR * t0); b = min(len(y), a + len(s)); y[a:b] += s[:b - a]
    return y

# ---- 空间：生成一个立体声小房间的冲激响应 ----
def make_ir(length=0.6, decay=0.18, bright=6000):
    n = int(SR * length); t = np.arange(n) / SR
    irs = []
    for ch in range(2):
        e = rng.standard_normal(n) * np.exp(-t / decay)
        e = lp(e, bright); e[:int(SR * 0.004)] = 0   # 一点点预延迟
        irs.append(e / np.sqrt(np.sum(e ** 2)))
    return irs
IR_SMALL = make_ir(0.5, 0.10, 7000)
IR_HALL = make_ir(1.6, 0.42, 5000)

def finish(mono, wet=0.18, ir=IR_SMALL, width=0.6, gain_db=-3.0, tail=0.0):
    """单声道 → 立体声 + 混响 + 归一化 + 首尾淡入淡出"""
    if tail: mono = np.concatenate([mono, np.zeros(int(SR * tail))])
    # 干声放正中间（单声道外放也不会抵消）；只让混响的尾巴左右分开，空间感来自它
    L = R = mono
    wl = fftconvolve(mono, ir[0])[:len(mono)]; wr = fftconvolve(mono, ir[1])[:len(mono)]
    out = np.stack([L + wet * wl * 3, R + wet * wr * 3], axis=1)
    out -= out.mean(axis=0)
    peak = np.max(np.abs(out)) + 1e-9
    out = out / peak * (10 ** (gain_db / 20))
    fade = int(SR * 0.004); out[:fade] *= np.linspace(0, 1, fade)[:, None]
    fo = int(SR * 0.03); out[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return out

def note(m): return 440 * 2 ** ((m - 69) / 12)

SFX = {}

# 点击：木质的"嗒"，短、干净、有一点点房间
def click():
    body = modal([1850, 2780, 4100, 760], [1.0, 0.5, 0.25, 0.35], [0.018, 0.012, 0.008, 0.03], 0.09)
    tr = bp(noise(0.012), 2500, 9000) * np.linspace(1, 0, int(SR * 0.012)) * 0.6
    return finish(place(0.12, [(0, body), (0, tr)]), wet=0.12, gain_db=-6)
SFX['click'] = click

# 确认：两个音的木琴/钟（向上五度），明亮、短
def confirm():
    a = fm_bell(note(84), 0.7, idx=1.6, ratio=3.5, decay=0.25) + 0.5 * modal([note(84) * 4], [0.3], [0.05], 0.7)
    b = fm_bell(note(91), 0.9, idx=1.4, ratio=3.5, decay=0.32)
    tap = modal([2400, 3600], [0.4, 0.2], [0.01, 0.008], 0.05)
    return finish(place(1.0, [(0, a * 0.8), (0, tap), (0.07, b)]), wet=0.22, ir=IR_SMALL, gain_db=-4)
SFX['confirm'] = confirm

# 翻页：纸的沙沙声，两段
def page():
    def rustle(dur, lo, hi):
        n = int(SR * dur); e = np.sin(np.linspace(0, np.pi, n)) ** 1.5
        return bp(noise(dur), lo, hi) * e * (0.6 + 0.4 * np.abs(lp(noise(dur), 30)) * 4)
    return finish(place(0.42, [(0, rustle(0.16, 2000, 9000) * 0.8), (0.12, rustle(0.24, 1500, 7000))]), wet=0.1, gain_db=-7)
SFX['page'] = page

# 打字：极短的、柔软的按键声
def type_():
    body = modal([3200, 5100], [0.6, 0.3], [0.006, 0.004], 0.03)
    return finish(place(0.04, [(0, body), (0, bp(noise(0.006), 4000, 10000) * 0.4)]), wet=0.04, gain_db=-10)
SFX['type'] = type_

# 弹窗开 / 关：空气感的扫频 + 一个玻璃质的音
def whoosh(dur, up=True):
    n = int(SR * dur); x = noise(dur); y = np.zeros(n)
    fs = np.linspace(500, 5000, n) if up else np.linspace(5000, 500, n)
    # 分段带通扫频
    seg = 512
    for i in range(0, n, seg):
        f = fs[i]; y[i:i + seg] = bp(x[i:i + seg + 0], max(100, f * 0.6), min(18000, f * 1.6))[:len(y[i:i + seg])]
    return y * np.sin(np.linspace(0, np.pi, n)) ** 1.2
def modal_open():
    return finish(place(0.6, [(0, whoosh(0.22, True) * 0.5), (0.12, fm_bell(note(88), 0.45, idx=1.0, ratio=2.0, decay=0.2) * 0.6)]), wet=0.25, gain_db=-7)
def modal_close():
    return finish(place(0.4, [(0, whoosh(0.18, False) * 0.5), (0.02, modal([1300, 1950], [0.6, 0.3], [0.03, 0.02], 0.1))]), wet=0.15, gain_db=-8)
SFX['modal_open'] = modal_open
SFX['modal_close'] = modal_close

# 发送 / 收到：气泡一样的"啵"
def bubble(f0, f1, dur=0.12):
    t = t_(dur); f = np.linspace(f0, f1, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(len(t), 0.003, dur * 0.5)
SFX['send'] = lambda: finish(place(0.35, [(0, bubble(500, 1300) * 0.8), (0.07, bubble(900, 1900, 0.1) * 0.5)]), wet=0.15, gain_db=-6)
SFX['receive'] = lambda: finish(place(0.45, [(0, fm_bell(note(86), 0.4, 1.2, 2.0, 0.18)), (0.09, fm_bell(note(81), 0.5, 1.2, 2.0, 0.22))]), wet=0.2, gain_db=-6)

# 收集：两颗亮晶晶的铃
SFX['collect'] = lambda: finish(place(0.7, [(0, fm_bell(note(88), 0.5, 2.0, 3.0, 0.2)), (0.06, fm_bell(note(93), 0.6, 2.0, 3.0, 0.25)), (0.12, fm_bell(note(100), 0.6, 1.5, 3.0, 0.2) * 0.5)]), wet=0.25, gain_db=-5)

# 错误：柔和的低两音，不刺耳
SFX['error'] = lambda: finish(place(0.45, [(0, modal([note(62), note(62) * 2.7], [1, 0.3], [0.12, 0.05], 0.3)), (0.12, modal([note(58), note(58) * 2.7], [1, 0.3], [0.15, 0.06], 0.32))]), wet=0.12, gain_db=-7)

# 好感：暖的竖琴上行琶音；親密：冷的钢片琴；下降：小三度往下
def harp_arp(ms, gap=0.07, dur=1.2, amp=0.8):
    return [(i * gap, pluck(note(m), dur, bright=0.55, amp=amp)) for i, m in enumerate(ms)]
SFX['affection_up'] = lambda: finish(place(1.4, harp_arp([72, 76, 79, 84]) + [(0.3, fm_bell(note(96), 0.6, 1.5, 3.0, 0.25) * 0.25)]), wet=0.3, ir=IR_HALL, gain_db=-4)
SFX['familiarity_up'] = lambda: finish(place(1.3, [(i * 0.065, fm_bell(note(m), 0.9, 2.2, 3.5, 0.35) * 0.8) for i, m in enumerate([76, 79, 83, 88])]), wet=0.3, ir=IR_HALL, gain_db=-5)
SFX['relation_down'] = lambda: finish(place(0.9, [(0, pluck(note(69), 0.8, 0.3)), (0.14, pluck(note(66), 0.8, 0.25)), (0.28, pluck(note(62), 0.9, 0.2))]), wet=0.25, ir=IR_HALL, gain_db=-6)

# 升级：长一点的和弦，有空间
def levelup(warm=True):
    ms = [60, 64, 67, 72, 76, 79, 84] if warm else [62, 66, 69, 74, 78, 81, 86]
    parts = []
    for i, m in enumerate(ms):
        s = pluck(note(m), 2.0, 0.6, 0.7) if warm else fm_bell(note(m), 2.0, 2.0, 3.5, 0.7) * 0.6
        parts.append((i * 0.055, s))
    chord = sum(fm_bell(note(m), 2.2, 1.2, 2.0, 0.9) for m in (ms[3], ms[4], ms[5])) * 0.25
    parts.append((0.42, chord))
    parts.append((0.42, hp(noise(1.2), 7000) * np.exp(-t_(1.2) / 0.4) * 0.05))   # 一层很细的沙沙光
    return finish(place(2.8, parts), wet=0.35, ir=IR_HALL, gain_db=-3)
SFX['levelup_affection'] = lambda: levelup(True)
SFX['levelup_familiarity'] = lambda: levelup(False)

# 解锁：向上的扫频 + 和弦
SFX['unlock'] = lambda: finish(place(1.8, [(0, whoosh(0.4, True) * 0.4)] + [(0.3 + i * 0.05, fm_bell(note(m), 1.4, 1.8, 3.0, 0.5) * 0.6) for i, m in enumerate([79, 84, 88, 91])]), wet=0.35, ir=IR_HALL, gain_db=-4)

# 答题：对 = 明亮的叮咚；错 = 木头的"咚"
SFX['quiz_correct'] = lambda: finish(place(1.0, [(0, fm_bell(note(84), 0.8, 1.5, 3.5, 0.3)), (0.11, fm_bell(note(88), 0.9, 1.5, 3.5, 0.35)), (0.11, fm_bell(note(91), 0.9, 1.0, 3.5, 0.35) * 0.6)]), wet=0.25, gain_db=-4)
SFX['quiz_wrong'] = lambda: finish(place(0.5, [(0, modal([180, 420, 610], [1, 0.4, 0.2], [0.09, 0.04, 0.03], 0.3)), (0, lp(noise(0.03), 900) * 0.4)]), wet=0.1, gain_db=-6)

# 进入 / 离开聊天：轻轻的风声 + 一个音
SFX['enter_chat'] = lambda: finish(place(0.8, [(0, whoosh(0.3, True) * 0.4), (0.18, pluck(note(79), 0.6, 0.5) * 0.6), (0.25, pluck(note(84), 0.6, 0.5) * 0.5)]), wet=0.25, gain_db=-6)
SFX['leave_chat'] = lambda: finish(place(0.7, [(0, whoosh(0.3, False) * 0.4), (0.1, pluck(note(79), 0.6, 0.4) * 0.5), (0.18, pluck(note(72), 0.6, 0.4) * 0.5)]), wet=0.25, gain_db=-6)

if __name__ == '__main__':
    files = {}
    for name, fn in SFX.items():
        y = fn()
        path = f'{OUT}/{name}.wav'
        sf.write(path, y.astype(np.float32), SR, subtype='PCM_16')
        files[name] = f'sfx/v2/{name}.wav'
        print(f'{name:22s} {len(y)/SR:5.2f}s')
    # manifest：只改 sfx 这一张表，bgm 不动
    mp = 'public/audio/manifest.json'
    m = json.load(open(mp, encoding='utf-8'))
    m.setdefault('sfx', {}).update(files)
    json.dump(m, open(mp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('manifest 更新了', len(files), '个音效')
