"""看一段 Lyria 素材能切出多少个干净的单音：起音时刻、与下一个音的间隔、音高、峰值。

  python scripts/audio/inspect_raw.py .generated/sfx3/raw/celesta.wav
"""
import sys
import numpy as np
import librosa

path = sys.argv[1]
y, sr = librosa.load(path, sr=48000, mono=True)
onsets = librosa.onset.onset_detect(y=y, sr=sr, units='samples', backtrack=True, delta=0.08)
print(f'{path}: {len(y)/sr:.1f}s, {len(onsets)} 个起音')
clean = 0
for i, o in enumerate(onsets):
    nxt = onsets[i + 1] if i + 1 < len(onsets) else len(y)
    gap = (nxt - o) / sr
    seg = y[o:o + min(nxt - o, int(0.4 * sr))]
    if len(seg) < 2048:
        continue
    f0 = librosa.yin(seg, fmin=150, fmax=4200, sr=sr, frame_length=2048)
    hz = float(np.median(f0))
    note = librosa.hz_to_note(hz)
    peak = float(np.max(np.abs(seg)))
    ok = gap >= 0.35
    clean += ok
    print(f'  {o/sr:6.2f}s  间隔 {gap:4.2f}s  {note:>4}  峰值 {peak:.2f}  {"✓" if ok else ""}')
print(f'间隔 ≥0.35s 的干净单音：{clean}')
