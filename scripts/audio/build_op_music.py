# -*- coding: utf-8 -*-
"""
🎸 把 Lyria 的 30 秒素材拼成一首完整的 OP 曲

  python scripts/audio/build_op_music.py analyze            # 每段的速度、调性、能量 → .generated/op_music/analysis.json + 能量曲线图
  python scripts/audio/build_op_music.py build A B          # 用 raw_A 当前半（主歌）、raw_B 当后半（副歌）
                                                            # → public/audio/op/op_theme.mp3 + .generated/op_music/op_beats.json

拼法：两段都对齐到同一个速度（B 按 A 的速度做时间伸缩）、同一个调（B 移调到 A），
从各自的第一个重拍开始按整小节截，在小节线上做一拍长的交叉淡化；结尾让最后一个和弦自然衰减。
op_beats.json 里是成品时间轴上的拍点和小节线，gen-op.mjs 按它切镜头。
"""
import sys, os, json
import numpy as np
import librosa, soundfile as sf

D = '.generated/op_music'
SR = 48000
MAJOR = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
MINOR = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']


def key_of(y, sr):
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr).mean(axis=1)
    best = None
    for i in range(12):
        for mode, prof in (('maj', MAJOR), ('min', MINOR)):
            c = np.corrcoef(np.roll(prof, i), chroma)[0, 1]
            if best is None or c > best[0]:
                best = (c, i, mode)
    return best  # (相关度, 主音, 大小调)


def beats_of(y, sr):
    tempo, b = librosa.beat.beat_track(y=y, sr=sr, units='time', tightness=200)
    tempo = float(np.atleast_1d(tempo)[0])
    # 第一个重拍：前 8 拍里起音最强的那一拍；之后每 4 拍一个小节
    env = librosa.onset.onset_strength(y=y, sr=sr)
    times = librosa.times_like(env, sr=sr)
    strength = [env[np.argmin(np.abs(times - t))] for t in b[:8]]
    first = int(np.argmax(strength[:4])) if len(strength) >= 4 else 0
    return tempo, b, first


def analyze():
    rows = []
    for f in sorted(os.listdir(D)):
        if not (f.startswith('raw_') and f.endswith('.wav')):
            continue
        y, sr = librosa.load(os.path.join(D, f), sr=22050, mono=True)
        tempo, b, first = beats_of(y, sr)
        iv = np.diff(b)
        corr, tonic, mode = key_of(y, sr)
        rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=sr // 2)[0]
        flat = float(librosa.feature.spectral_flatness(y=y).mean())
        rows.append({
            'file': f, 'seconds': round(len(y) / sr, 1), 'tempo': round(tempo, 1),
            'beatJitter': round(float(iv.std() / iv.mean()), 3) if len(iv) else 1,
            'key': f'{NOTES[tonic]} {mode}', 'keyConf': round(float(corr), 2), 'tonic': tonic, 'mode': mode,
            'rmsFirstHalf': round(float(rms[:len(rms) // 2].mean()), 4), 'rmsSecondHalf': round(float(rms[len(rms) // 2:].mean()), 4),
            'flatness': round(flat, 4), 'firstDownbeat': round(float(b[first]), 2) if len(b) else 0,
            'rms': [round(float(v), 4) for v in rms]
        })
    json.dump(rows, open(os.path.join(D, 'analysis.json'), 'w'), indent=1)
    for r in rows:
        print(f"{r['file']:12s} {r['seconds']:5.1f}s  {r['tempo']:6.1f} BPM  jitter {r['beatJitter']:.3f}  {r['key']:7s} ({r['keyConf']:.2f})  rms {r['rmsFirstHalf']:.3f}->{r['rmsSecondHalf']:.3f}  flat {r['flatness']:.3f}")
    # 能量曲线图：看哪一段有起伏（主歌 → 副歌）
    try:
        from PIL import Image, ImageDraw
        W, H = 900, 70 * len(rows)
        im = Image.new('RGB', (W, H), (20, 20, 28)); d = ImageDraw.Draw(im)
        mx = max(max(r['rms']) for r in rows) or 1
        for i, r in enumerate(rows):
            y0 = i * 70
            d.text((4, y0 + 2), f"{r['file']} {r['tempo']}BPM {r['key']}", fill=(255, 220, 120))
            pts = [(120 + k * (W - 130) / max(1, len(r['rms']) - 1), y0 + 66 - 50 * v / mx) for k, v in enumerate(r['rms'])]
            d.line(pts, fill=(120, 200, 255), width=2)
        im.save(os.path.join(D, 'analysis.png'))
    except Exception as e:
        print('画图失败', e)


def load48(f):
    y, sr = librosa.load(os.path.join(D, f), sr=SR, mono=False)
    if y.ndim == 1:
        y = np.stack([y, y])
    return y


def bar_cut(y, sr, tempo, beats, first):
    """从第一个重拍开始，截到最后一个完整小节（4 拍一小节）"""
    spb = 60.0 / tempo
    start = beats[first]
    n_bars = int((len(y[0]) / sr - start) / (4 * spb))
    end = start + n_bars * 4 * spb
    return y[:, int(start * sr):int(end * sr)], n_bars


def build(a, b):
    A = load48(f'raw_{a}.wav'); B = load48(f'raw_{b}.wav')
    ya = librosa.to_mono(A); yb = librosa.to_mono(B)
    ta, ba, fa = beats_of(librosa.resample(ya, orig_sr=SR, target_sr=22050), 22050)
    tb, bb, fb = beats_of(librosa.resample(yb, orig_sr=SR, target_sr=22050), 22050)
    _, ka, ma = key_of(librosa.resample(ya, orig_sr=SR, target_sr=22050), 22050)
    _, kb, mb = key_of(librosa.resample(yb, orig_sr=SR, target_sr=22050), 22050)
    # B 对齐到 A：速度（时间伸缩）和调（移调，取最近的方向）
    rate = ta / tb
    shift = ((ka - kb + 6) % 12) - 6
    print(f'A {ta:.1f}BPM {NOTES[ka]} {ma} | B {tb:.1f}BPM {NOTES[kb]} {mb} → B 伸缩 x{rate:.3f}，移调 {shift:+d}')
    if abs(rate - 1) > 0.002:
        B = np.stack([librosa.effects.time_stretch(ch, rate=rate) for ch in B])
        bb = bb / rate
    if shift:
        B = np.stack([librosa.effects.pitch_shift(ch, sr=SR, n_steps=shift) for ch in B])
    A1, na = bar_cut(A, SR, ta, ba, fa)
    B1, nb = bar_cut(B, SR, ta, bb, fb)
    spb = 60.0 / ta
    xf = int(spb * SR)  # 一拍的交叉淡化
    fade_out = np.linspace(1, 0, xf); fade_in = np.linspace(0, 1, xf)
    head = A1.copy()
    head[:, -xf:] *= fade_out
    tail = B1.copy()
    tail[:, :xf] *= fade_in
    out = np.concatenate([head[:, :-xf], head[:, -xf:] + tail[:, :xf], tail[:, xf:]], axis=1)
    # 结尾：最后一拍半自然衰减
    k = int(spb * 1.5 * SR)
    out[:, -k:] *= np.linspace(1, 0, k) ** 1.5
    # 响度：峰值压到 -1 dBFS
    out = out / (np.abs(out).max() + 1e-9) * 0.89
    os.makedirs('public/audio/op', exist_ok=True)
    wav = os.path.join(D, 'op_theme.wav')
    sf.write(wav, out.T, SR)
    total = out.shape[1] / SR
    # 成品时间轴上的拍点和小节线
    bars = [round(i * 4 * spb, 3) for i in range(na + nb)]
    beats = [round(i * spb, 3) for i in range(int(total / spb))]
    json.dump({'bpm': round(ta, 2), 'seconds': round(total, 2), 'bars': bars, 'beats': beats,
               'chorusAt': round(na * 4 * spb - spb, 3), 'barsA': na, 'barsB': nb, 'src': [a, b]},
              open(os.path.join(D, 'op_beats.json'), 'w'), indent=1)
    print(f'op_theme.wav {total:.1f}s，{na}+{nb} 小节，副歌从 {na * 4 * spb - spb:.1f}s 开始')


if __name__ == '__main__':
    if sys.argv[1] == 'analyze':
        analyze()
    elif sys.argv[1] == 'build':
        build(sys.argv[2], sys.argv[3])
