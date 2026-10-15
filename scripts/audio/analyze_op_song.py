# -*- coding: utf-8 -*-
"""
分析用户上传的 OP 曲：时长、速度、拍点、调性、段落（按能量和音色的突变找边界）
  python scripts/audio/analyze_op_song.py <file> [<file> ...]
→ 打印摘要；每首写 .generated/op_music/<名字>.json（beats / downbeats / sections / rms）和一张能量图
"""
import sys, os, json
import numpy as np
import librosa

NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
MAJOR = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
MINOR = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
OUT = '.generated/op_music'


def analyze(path):
    y, sr = librosa.load(path, sr=22050, mono=True)
    dur = len(y) / sr
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time', tightness=300)
    tempo = float(np.atleast_1d(tempo)[0])
    iv = np.diff(beats)
    # 重拍：每 4 拍一组，挑起音最强的那个相位
    env = librosa.onset.onset_strength(y=y, sr=sr)
    t_env = librosa.times_like(env, sr=sr)
    st = np.array([env[np.argmin(np.abs(t_env - b))] for b in beats])
    phase = int(np.argmax([st[p::4].mean() for p in range(4)]))
    downbeats = beats[phase::4]
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr).mean(axis=1)
    best = max(((np.corrcoef(np.roll(p, i), chroma)[0, 1], i, m) for i in range(12) for m, p in (('maj', MAJOR), ('min', MINOR))))
    # 段落：按小节聚合 RMS + MFCC，找相邻小节差异最大的地方
    hop = 512
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, hop_length=hop)
    t = librosa.times_like(rms, sr=sr, hop_length=hop)
    bar_feats = []
    for i in range(len(downbeats) - 1):
        m = (t >= downbeats[i]) & (t < downbeats[i + 1])
        bar_feats.append(np.concatenate([[rms[m].mean() * 50], mfcc[:, m].mean(axis=1) / 20]))
    bar_feats = np.array(bar_feats)
    nov = np.r_[0, np.linalg.norm(np.diff(bar_feats, axis=0), axis=1)]
    bar_rms = [round(float(f[0] / 50), 4) for f in bar_feats]
    # 取突变最大的几处当段落边界（至少隔 4 小节）
    cand = np.argsort(-nov)
    bounds = []
    for c in cand:
        if all(abs(c - b) >= 4 for b in bounds) and c > 0:
            bounds.append(int(c))
        if len(bounds) >= 7:
            break
    bounds = sorted(bounds)
    name = os.path.splitext(os.path.basename(path))[0]
    info = {
        'file': path, 'seconds': round(dur, 2), 'tempo': round(tempo, 2), 'beatJitter': round(float(iv.std() / iv.mean()), 4),
        'key': f'{NOTES[best[1]]} {best[2]}', 'keyConf': round(float(best[0]), 2),
        'firstBeat': round(float(beats[0]), 3), 'beats': [round(float(b), 3) for b in beats],
        'downbeats': [round(float(b), 3) for b in downbeats],
        'sectionBars': bounds, 'sectionTimes': [round(float(downbeats[b]), 2) for b in bounds],
        'barRms': bar_rms
    }
    os.makedirs(OUT, exist_ok=True)
    json.dump(info, open(os.path.join(OUT, 'song_' + ('vocal' if '人声' in name else 'inst') + '.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print(f"\n== {name}")
    print(f"  {dur:.1f}s  {tempo:.1f} BPM  jitter {info['beatJitter']}  {info['key']} ({info['keyConf']})  {len(downbeats)} 小节，第一拍 {beats[0]:.2f}s")
    print('  段落边界（小节→秒）:', ', '.join(f'{b}→{downbeats[b]:.1f}s' for b in bounds))
    print('  每小节能量:', ' '.join(f'{v:.2f}' for v in bar_rms))
    return info


if __name__ == '__main__':
    for p in sys.argv[1:]:
        analyze(p)
