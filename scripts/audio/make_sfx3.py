"""第三版 UI 音效：从 Lyria 生成的真乐器独奏里切单音，再拼成 galgame 风格的音效。

  python scripts/audio/make_sfx3.py            # 生成 public/audio/sfx/v3/*.wav，并改 manifest
  python scripts/audio/make_sfx3.py --bank     # 只打印每种乐器切出了哪些音

为什么不再纯合成（v2）：合成音没有真乐器的泛音、琴体共鸣和起音的那一下"毛刺"，
听起来就是"电子的、便宜的"。galgame 的 UI 音效几乎都是真乐器的一下：
钢片琴、八音盒、竖琴、钟琴、马林巴、颤音琴……这里用的就是这些（素材见 scripts/audio/gen_raw.sh）。

切音的讲究：延音长的乐器（钢片琴、八音盒、钟琴）前一个音的余音会叠进下一个音里，
所以每个音都量"起音前有多安静"（isolation），只留前一个音已经散干净的那些。
所有音都微调到 C 大调五声音阶上——同一套音效，彼此之间是和谐的。
"""
import json
import sys
from pathlib import Path

import numpy as np
import librosa
import soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / '.generated/sfx3/raw'
OUT = ROOT / 'public/audio/sfx/v3'
SR = 48000
RNG = np.random.default_rng(3)

# 素材 → 文件名（钢片琴用第一次试的那段：第二段太密，切不出单音）
SOURCES = {
    'celesta': ['test_celesta', 'celesta2', 'celesta3'], 'musicbox': ['musicbox', 'musicbox2'], 'harp': ['harp'],
    'glock': ['glock', 'glock2', 'glock3'], 'marimba': ['marimba', 'marimba2', 'marimba3'], 'kalimba': ['kalimba'],
    'felt': ['felt'], 'vibes': ['vibes', 'vibes2', 'vibes3'],
}
PENTA = {0, 2, 4, 7, 9}  # C D E G A


# ---------------------------------------------------------------- 切音
def build_bank():
    bank = {}
    for name, fns in SOURCES.items():
        # 同一种乐器的几段素材首尾相接（中间垫一秒静音），当成一段来切
        gap = np.zeros(SR)
        y = np.concatenate([np.concatenate([librosa.load(RAW / f'{fn}.wav', sr=SR, mono=True)[0], gap]) for fn in fns])
        onsets = librosa.onset.onset_detect(y=y, sr=SR, units='samples', backtrack=True, delta=0.08)
        notes = []
        for i, o in enumerate(onsets):
            nxt = onsets[i + 1] if i + 1 < len(onsets) else len(y)
            length = nxt - o
            if length < int(0.22 * SR) or o < int(0.12 * SR):
                continue
            head = y[o:o + int(0.12 * SR)]
            pre = y[o - int(0.1 * SR):o - int(0.005 * SR)]
            peak = np.max(np.abs(head))
            iso = 20 * np.log10((peak + 1e-9) / (np.sqrt(np.mean(pre ** 2)) + 1e-9))
            # 音高：起音后 30–230ms 里最强的那个频谱峰。钟声类乐器（钢片琴、八音盒、钟琴）泛音不规则，
            # YIN 常常测成低八度；最强峰对槌击乐器就是它听上去的那个音
            win = y[o + int(0.03 * SR):o + int(0.23 * SR)]
            if len(win) < 4096:
                continue
            spec = np.abs(np.fft.rfft(win * np.hanning(len(win)), n=1 << 15))
            freqs = np.fft.rfftfreq(1 << 15, 1 / SR)
            band = (freqs > 180) & (freqs < 5000)
            hz = freqs[band][np.argmax(spec[band])]
            midi = float(librosa.hz_to_midi(hz))
            notes.append({'src': name, 'o': int(o), 'len': int(length), 'iso': float(iso), 'midi': midi, 'peak': float(peak)})
        # 留起音前最安静的那一半里，隔离度 ≥ 14dB 的
        notes = [n for n in notes if n['iso'] >= 14]
        notes.sort(key=lambda n: -n['iso'])
        bank[name] = {'y': y, 'notes': notes}
    return bank


def nearest_penta(m):
    base = int(round(m))
    for d in [0, 1, -1, 2, -2]:
        if (base + d) % 12 in PENTA:
            return base + d
    return base


def note(bank, src, target_midi, dur, decay=None, pick=0):
    """从 src 里挑一个离目标音高最近、最干净的音，移调到 target_midi，截成 dur 秒。"""
    notes = bank[src]['notes']
    near = [n for n in notes if abs(n['midi'] - target_midi) <= 3.5]
    if not near:
        raise SystemExit(f'{src} 里没有 {librosa.midi_to_note(target_midi)} ±3.5 半音以内的干净音（音域见 --bank）')
    cand = sorted(near, key=lambda n: abs(n['midi'] - target_midi) + (20 - min(n['iso'], 20)) * 0.15)
    n = cand[min(pick, len(cand) - 1)]
    y = bank[src]['y']
    start = max(0, n['o'] - int(0.004 * SR))
    steps = target_midi - n['midi']
    ratio = 2 ** (steps / 12)
    # 像采样器那样变速移调（相位声码器会把起音的那一下抹糊）：
    # 多取 ratio 倍的原始素材，重采样之后时长正好是 dur
    seg = y[start:start + min(n['len'], int(dur * ratio * SR) + int(0.004 * SR))].copy()
    if abs(steps) > 0.05:
        seg = librosa.resample(seg, orig_sr=SR, target_sr=int(round(SR / ratio)), res_type='soxr_hq')
    # 包络：2ms 淡入；尾巴按 decay 再压一道（短促的按键音要更短）
    env = np.ones(len(seg))
    fi = int(0.002 * SR)
    env[:fi] = np.linspace(0, 1, fi)
    if decay:
        t = np.arange(len(seg)) / SR
        env *= np.exp(-t / decay)
    fo = int(min(0.06, dur * 0.35) * SR)
    env[-fo:] *= np.linspace(1, 0, fo) ** 2
    seg = seg * env
    return seg / (np.max(np.abs(seg)) + 1e-9)


def mix(length, *layers):
    """layers: (signal, start_sec, gain_db, pan[-1..1])"""
    out = np.zeros((int(length * SR), 2))
    for sig, at, gdb, pan in layers:
        g = 10 ** (gdb / 20)
        s = int(at * SR)
        e = min(len(out), s + len(sig))
        if e <= s:
            continue
        l = np.cos((pan + 1) * np.pi / 4)
        r = np.sin((pan + 1) * np.pi / 4)
        out[s:e, 0] += sig[:e - s] * g * l * 1.414
        out[s:e, 1] += sig[:e - s] * g * r * 1.414
    return out


# ---------------------------------------------------------------- 空间
def make_ir(seconds=1.6, tone=7000):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        noise = RNG.standard_normal(n)
        sos = butter(2, tone, 'lowpass', fs=SR, output='sos')
        noise = sosfilt(sos, noise)
        ir[:, ch] = noise * np.exp(-t / (seconds / 6.5))
        # 几个早期反射，让空间有"房间"而不是"雾"
        for d, g in [(0.011, 0.5), (0.019, 0.35), (0.031, 0.25), (0.047, 0.18)]:
            k = int((d + ch * 0.0023) * SR)
            ir[k, ch] += g
    ir[:int(0.006 * SR)] = 0
    return ir / np.max(np.abs(ir))


IR_ROOM = make_ir(1.4, 6500)
IR_HALL = make_ir(2.6, 5200)
# 按键、打字这种会被连点的音：短混响，不然连点起来糊成一片
IR_TIGHT = make_ir(0.45, 7500)


def finish(x, wet=0.18, ir=None, peak_db=-6.0, hp=90):
    ir = IR_ROOM if ir is None else ir
    tail = int(len(ir) * 0.8)
    x = np.vstack([x, np.zeros((tail, 2))])
    w = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], axis=1)
    w /= (np.max(np.abs(w)) + 1e-9)
    dry_peak = np.max(np.abs(x)) + 1e-9
    y = x / dry_peak + w * wet * 1.6
    sos = butter(2, hp, 'highpass', fs=SR, output='sos')
    y = sosfilt(sos, y, axis=0)
    # 软限幅 + 归一到目标峰值
    y = np.tanh(y * 1.15) / np.tanh(1.15)
    y *= 10 ** (peak_db / 20) / (np.max(np.abs(y)) + 1e-9)
    # 尾巴静下来就截掉
    env = np.max(np.abs(y), axis=1)
    last = np.nonzero(env > 10 ** (-62 / 20))[0]
    end = (last[-1] + int(0.02 * SR)) if len(last) else len(y)
    y = y[:end]
    fo = min(len(y), int(0.03 * SR))
    y[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return y


def C(o, pc=0):  # 音名 → midi：C(6)=C6, C(6,7)=G6
    return 12 * (o + 1) + pc


def build(bank):
    n = lambda *a, **k: note(bank, *a, **k)
    S = {}
    # 按键：马林巴的一下，软木头的"咚"，配一点钢片琴的亮
    S['click'] = finish(mix(0.25, (n('marimba', C(5, 9), 0.2, decay=0.07), 0, 0, 0), (n('celesta', C(6, 4), 0.15, decay=0.05), 0.002, -16, 0.1)), wet=0.10, ir=IR_TIGHT, peak_db=-9)
    # 打字：非常轻的卡林巴尖
    S['type'] = finish(mix(0.1, (n('kalimba', C(5, 4), 0.07, decay=0.025), 0, 0, 0)), wet=0.05, ir=IR_TIGHT, peak_db=-16)
    # 确认：钢片琴五度上行 + 竖琴垫底
    S['confirm'] = finish(mix(0.9, (n('celesta', C(6), 0.5), 0, -2, -0.15), (n('celesta', C(6, 7), 0.7), 0.075, 0, 0.15), (n('harp', C(5), 0.6), 0, -9, 0)), wet=0.2, peak_db=-6)
    # 翻页：竖琴极短的拨弦 + 纸声（滤过的噪声，短）
    paper = RNG.standard_normal(int(0.16 * SR))
    paper = sosfilt(butter(2, [1800, 7000], 'bandpass', fs=SR, output='sos'), paper)
    paper *= np.sin(np.linspace(0, np.pi, len(paper))) ** 2
    paper /= np.max(np.abs(paper))
    S['page'] = finish(mix(0.4, (paper, 0, -6, 0.2), (n('harp', C(5, 7), 0.3, decay=0.12), 0.04, -8, -0.1)), wet=0.12, ir=IR_TIGHT, peak_db=-12)
    # 弹窗开/关：八音盒两音上行 / 下行，轻
    S['modal_open'] = finish(mix(0.7, (n('musicbox', C(5, 4), 0.4), 0, -2, -0.2), (n('musicbox', C(5, 9), 0.55), 0.06, 0, 0.2)), wet=0.2, peak_db=-10)
    S['modal_close'] = finish(mix(0.6, (n('musicbox', C(5, 9), 0.35), 0, -3, 0.2), (n('musicbox', C(5, 4), 0.45), 0.06, -1, -0.2)), wet=0.18, peak_db=-12)
    # 发送 / 收到消息：卡林巴上行 / 颤音琴"叮咚"
    S['send'] = finish(mix(0.6, (n('kalimba', C(4, 7), 0.3), 0, -1, -0.15), (n('kalimba', C(5), 0.45), 0.07, 0, 0.15)), wet=0.15, peak_db=-9)
    S['receive'] = finish(mix(1.1, (n('vibes', C(6, 4), 0.6), 0, 0, 0.1), (n('vibes', C(6), 0.8), 0.16, -1, -0.1)), wet=0.25, peak_db=-8)
    # 收集（生词入本）：钟琴三音琶音
    S['collect'] = finish(mix(1.0, (n('glock', C(6), 0.4), 0, -2, -0.3), (n('glock', C(6, 4), 0.4), 0.06, -1, 0), (n('glock', C(6, 7), 0.7), 0.12, 0, 0.3)), wet=0.22, peak_db=-7)
    # 出错：马林巴低音两下，轻，不吓人
    S['error'] = finish(mix(0.5, (n('marimba', C(3, 9), 0.18, decay=0.08), 0, 0, -0.1), (n('marimba', C(3, 9), 0.25, decay=0.1), 0.11, -1, 0.1)), wet=0.08, ir=IR_TIGHT, peak_db=-13)
    # 好感度 +：竖琴上行三音 + 八音盒高音收尾
    S['affection_up'] = finish(mix(1.4, (n('harp', C(5), 0.4), 0, -3, -0.3), (n('harp', C(5, 4), 0.4), 0.05, -3, -0.1), (n('harp', C(5, 7), 0.5), 0.1, -2, 0.1), (n('celesta', C(7), 0.9), 0.16, 0, 0.3)), wet=0.25, ir=IR_HALL, peak_db=-7)
    # 親密度 +：颤音琴，冷一点的颜色
    S['familiarity_up'] = finish(mix(1.3, (n('vibes', C(5, 7), 0.6), 0, -2, -0.2), (n('vibes', C(6, 2), 0.9), 0.1, 0, 0.2)), wet=0.25, ir=IR_HALL, peak_db=-8)
    # 关系变差：柔音钢琴缓缓下行
    S['relation_down'] = finish(mix(1.4, (n('felt', C(5, 4), 0.6), 0, 0, 0.1), (n('felt', C(5, 2), 0.6), 0.22, -1, 0), (n('felt', C(4, 9), 0.9), 0.44, -2, -0.1)), wet=0.28, ir=IR_HALL, peak_db=-10)
    # 关系升级：完整的一句——竖琴琶音上去，八音盒高音落在顶上
    harp_run = [(n('harp', C(4, p) if i < 3 else C(5, p), 0.6), 0.055 * i, -4 + i * 0.4, -0.5 + i * 0.15) for i, p in enumerate([0, 4, 7, 0, 4, 7])]
    S['levelup_affection'] = finish(mix(2.6, *harp_run, (n('celesta', C(7), 1.4), 0.36, 0, 0.2), (n('glock', C(6, 7), 1.2), 0.52, -4, -0.2), (n('celesta', C(6, 4), 1.0), 0.7, -6, 0.4)), wet=0.3, ir=IR_HALL, peak_db=-5)
    vib_run = [(n('vibes', p, 0.9), 0.09 * i, -3 + i, -0.4 + i * 0.25) for i, p in enumerate([C(5, 2), C(5, 7), C(5, 9), C(6, 2)])]
    S['levelup_familiarity'] = finish(mix(2.4, *vib_run, (n('glock', C(6, 9), 1.0), 0.42, -4, 0.3)), wet=0.3, ir=IR_HALL, peak_db=-6)
    # 解锁（CG、地点）：八音盒四音琶音
    S['unlock'] = finish(mix(1.5, *[(n('musicbox' if i < 3 else 'celesta', p, 0.7), 0.08 * i, -2 + i * 0.5, -0.3 + i * 0.2) for i, p in enumerate([C(5), C(5, 4), C(5, 7), C(6)])]), wet=0.25, ir=IR_HALL, peak_db=-6)
    # 答对 / 答错
    S['quiz_correct'] = finish(mix(1.1, (n('glock', C(6, 4), 0.4), 0, -2, -0.2), (n('glock', C(7), 0.8), 0.09, 0, 0.2)), wet=0.22, peak_db=-6)
    S['quiz_wrong'] = finish(mix(0.8, (n('marimba', C(4, 2), 0.3, decay=0.12), 0, 0, 0.1), (n('marimba', C(3, 9), 0.45, decay=0.15), 0.15, -1, -0.1)), wet=0.12, ir=IR_TIGHT, peak_db=-12)
    # 进入 / 离开对话：卡林巴三音
    S['enter_chat'] = finish(mix(0.9, *[(n('kalimba', p, 0.45), 0.06 * i, -2 + i, -0.3 + i * 0.3) for i, p in enumerate([C(4, 7), C(5), C(5, 4)])]), wet=0.2, peak_db=-8)
    S['leave_chat'] = finish(mix(0.9, *[(n('kalimba', p, 0.45), 0.07 * i, -1 - i, 0.3 - i * 0.3) for i, p in enumerate([C(5, 4), C(5), C(4, 7)])]), wet=0.2, peak_db=-10)
    return S


def main():
    bank = build_bank()
    if '--bank' in sys.argv:
        for k, v in bank.items():
            ms = sorted(round(n['midi']) for n in v['notes'])
            print(f'{k:9s} {len(v["notes"]):3d} 个干净的音  音域 {librosa.midi_to_note(ms[0]) if ms else "-"} – {librosa.midi_to_note(ms[-1]) if ms else "-"}')
        return
    OUT.mkdir(parents=True, exist_ok=True)
    sounds = build(bank)
    for k, v in sounds.items():
        sf.write(OUT / f'{k}.wav', v.astype(np.float32), SR, subtype='PCM_16')
        print(f'{k:20s} {len(v)/SR:5.2f}s')
    mp = ROOT / 'public/audio/manifest.json'
    m = json.loads(mp.read_text(encoding='utf-8'))
    m['sfx'] = {**m.get('sfx', {}), **{k: f'sfx/v3/{k}.wav' for k in sounds}}
    mp.write_text(json.dumps(m, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('manifest 已更新')


if __name__ == '__main__':
    main()
