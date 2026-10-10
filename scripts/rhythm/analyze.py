# 盘点游戏里的 BGM：速度、拍点强度、起音密度——挑适合做音游的曲子
#   python scripts/rhythm/analyze.py
import glob, os, json
import numpy as np, librosa
rows = []
for f in sorted(glob.glob('public/audio/bgm/*.mp3')):
    y, sr = librosa.load(f, sr=22050, mono=True)
    oenv = librosa.onset.onset_strength(y=y, sr=sr)
    tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=sr)
    tempo = float(np.atleast_1d(tempo)[0])
    onsets = librosa.onset.onset_detect(onset_envelope=oenv, sr=sr)
    dur = len(y) / sr
    # 拍点清晰度：拍上的起音强度 / 平均起音强度
    pulse = float(oenv[beats].mean() / (oenv.mean() + 1e-9)) if len(beats) else 0
    rms = float(librosa.feature.rms(y=y).mean())
    rows.append(dict(file=os.path.basename(f), dur=round(dur, 1), bpm=round(tempo, 1), onsets_per_s=round(len(onsets) / dur, 2), pulse=round(pulse, 2), rms=round(rms, 3)))
    print(f"{os.path.basename(f):40s} {dur:6.1f}s  {tempo:6.1f}bpm  onset/s {len(onsets)/dur:4.2f}  pulse {pulse:4.2f}  rms {rms:.3f}", flush=True)
json.dump(rows, open('.generated/bgm-analysis.json', 'w'), indent=1)
