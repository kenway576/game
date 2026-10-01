const fs = require('fs');
const path = require('path');
global.MPEGMode = require('lamejs/src/js/MPEGMode.js');
global.Lame = require('lamejs/src/js/Lame.js');
global.BitStream = require('lamejs/src/js/BitStream.js');
const lamejs = require('lamejs');

// ============================================================================
// 🎹 Pure Acoustic Grand Piano & Brushed Jazz Drums: "Raindrops in Kobe"
// 100% Pure Acoustic Piano + Soft Brushed Drums (NO Bass, NO Synths, NO Electronic)
// Studio-Grade Physical Modeling Acoustic Grand Piano
// ============================================================================

const SAMPLE_RATE = 44100;
const BPM = 74; // Lyrical, soothing ballad tempo
const BEAT_SEC = 60 / BPM;
const BAR_SEC = BEAT_SEC * 4;
const TOTAL_BARS = 64; // Full 3 min 27 sec complete song
const TOTAL_SEC = TOTAL_BARS * BAR_SEC;
const TOTAL_SAMPLES = Math.floor(TOTAL_SEC * SAMPLE_RATE);

console.log(`Generating Pure Piano & Drums Ballad: ${TOTAL_BARS} bars @ ${BPM} BPM, Duration: ${(TOTAL_SEC / 60).toFixed(2)} mins (${TOTAL_SEC.toFixed(1)}s), Samples: ${TOTAL_SAMPLES}`);

// Stereo Master Buffers
const leftBuf = new Float32Array(TOTAL_SAMPLES);
const rightBuf = new Float32Array(TOTAL_SAMPLES);

// Note to Frequency Helper
const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// Standard Note Names
const N = {
  C1: 24, D1: 26, E1: 28, F1: 29, G1: 31, A1: 33, B1: 35,
  C2: 36, D2: 38, E2: 40, F2: 41, Fs2: 42, G2: 43, Gs2: 44, A2: 45, B2: 47,
  C3: 48, Cs3: 49, D3: 50, Ds3: 51, E3: 52, F3: 53, Fs3: 54, G3: 55, Gs3: 56, A3: 57, As3: 58, B3: 59,
  C4: 60, Cs4: 61, D4: 62, Ds4: 63, E4: 64, F4: 65, Fs4: 66, G4: 67, Gs4: 68, A4: 69, As4: 70, B4: 71,
  C5: 72, Cs5: 73, D5: 74, Ds5: 75, E5: 76, F5: 77, Fs5: 78, G5: 79, Gs5: 80, A5: 81, B5: 83,
  C6: 84, D6: 86, E6: 88, G6: 91
};

// ----------------------------------------------------------------------------
// 1. High-Fidelity Acoustic Grand Piano Physical Modeling Synthesizer
// Multi-string detune (3 strings per note), felt hammer transient, soundboard body
// ----------------------------------------------------------------------------
function renderAcousticPiano(startSample, durationSample, midi, velocity, pan = 0.5) {
  const freq = midiToFreq(midi);
  // Multi-string detuning for natural grand piano warmth
  const detunes = [-0.35, 0.0, 0.35];
  const numHarmonics = Math.min(8, Math.floor(9000 / freq));

  for (let i = 0; i < durationSample; i++) {
    const sIdx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;

    // Wooden felt hammer impact transient (first 18ms)
    const hammer = Math.exp(-t * 110) * Math.sin(2 * Math.PI * 130 * t) * 0.15;

    // Acoustic string envelope: prompt sound + long warm soundboard resonance
    const envPrompt = Math.exp(-t * (1.6 + freq * 0.0018));
    const envSustain = Math.exp(-t * (0.65 + freq * 0.0006));
    const env = envPrompt * 0.45 + envSustain * 0.55;

    let sample = 0;
    // 3 Detuned strings
    for (let s = 0; s < 3; s++) {
      const f0 = freq + detunes[s];
      for (let h = 1; h <= numHarmonics; h++) {
        const hFreq = f0 * h;
        if (hFreq > 11000) break;
        // Natural acoustic physics: higher harmonics decay significantly faster
        const hEnv = Math.exp(-t * (h * 1.5 + freq * 0.0012));
        const hAmp = (1 / Math.pow(h, 1.3)) * (0.65 + 0.35 * velocity);
        sample += Math.sin(2 * Math.PI * hFreq * t) * hAmp * hEnv;
      }
    }

    sample = (sample * 0.33 * env + hammer) * velocity * 0.26;
    // Soft soundboard saturation (Yamaha/Steinway spruce wood response)
    sample = Math.tanh(sample * 1.15);

    leftBuf[sIdx] += sample * pan;
    rightBuf[sIdx] += sample * (1.0 - pan);
  }
}

// ----------------------------------------------------------------------------
// 2. Soft Acoustic Jazz Drum Kit (Brushes & Ride, NO electronic elements)
// ----------------------------------------------------------------------------
function renderBrushSweep(startSample, velocity = 0.3) {
  // Gentle circular brush sweep across coated snare drum head
  const duration = Math.floor(0.42 * SAMPLE_RATE);
  for (let i = 0; i < duration; i++) {
    const sIdx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;
    // Soft noise filtered in mid-frequency
    const noise = (Math.random() * 2 - 1) * Math.sin(Math.PI * (i / duration));
    const env = Math.exp(-t * 4.5);
    const s = noise * env * velocity * 0.14;
    leftBuf[sIdx] += s * 0.52;
    rightBuf[sIdx] += s * 0.48;
  }
}

function renderBrushTap(startSample, velocity = 0.25) {
  // Soft brush tap on snare
  const duration = Math.floor(0.25 * SAMPLE_RATE);
  for (let i = 0; i < duration; i++) {
    const sIdx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;
    const noise = (Math.random() * 2 - 1);
    const s = noise * Math.exp(-t * 22) * velocity * 0.16;
    leftBuf[sIdx] += s * 0.5;
    rightBuf[sIdx] += s * 0.5;
  }
}

function renderRideCymbal(startSample, velocity = 0.18, pan = 0.65) {
  // Soft jazz ride cymbal tap with warm ping
  const duration = Math.floor(0.55 * SAMPLE_RATE);
  for (let i = 0; i < duration; i++) {
    const sIdx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;
    const ping = Math.sin(2 * Math.PI * 5800 * t) * Math.exp(-t * 8) * 0.25;
    const wash = (Math.random() * 2 - 1) * Math.exp(-t * 6) * 0.15;
    const s = (ping + wash) * velocity * 0.18;
    leftBuf[sIdx] += s * pan;
    rightBuf[sIdx] += s * (1.0 - pan);
  }
}

function renderAcousticKick(startSample, velocity = 0.35) {
  // Soft, round felt beater acoustic kick (deep, quiet, warm thump)
  const duration = Math.floor(0.28 * SAMPLE_RATE);
  for (let i = 0; i < duration; i++) {
    const sIdx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;
    const pitch = 50 + 35 * Math.exp(-t * 25);
    const s = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 12) * velocity * 0.28;
    leftBuf[sIdx] += s * 0.5;
    rightBuf[sIdx] += s * 0.5;
  }
}

// ----------------------------------------------------------------------------
// 3. Composition: Harmonic & Lyrical Score (64 Bars Full Progression)
// Left hand: rich piano arpeggios & deep resonant chords
// Right hand: singing melodic lines with grace notes and emotional expression
// ----------------------------------------------------------------------------
console.log('Writing piano sheet music & arrangement...');

// 8-Bar Chord Voicings for Left Hand Piano (Root + Tenth + Fifth + Third)
const PIANO_HARMONIES = [
  // 1. Dm9: D2 root, A3 fifth, F4 third, C5 seventh, E5 ninth
  { root: N.D2, arpeggio: [N.D2, N.A2, N.F3, N.C4, N.E4, N.A4] },
  // 2. G13: G1 root, F3 seventh, B3 third, E4 thirteenth
  { root: N.G1, arpeggio: [N.G1, N.D2, N.F3, N.B3, N.E4, N.G4] },
  // 3. Cmaj9: C2 root, G2 fifth, E3 third, B3 seventh, D4 ninth
  { root: N.C2, arpeggio: [N.C2, N.G2, N.E3, N.B3, N.D4, N.G4] },
  // 4. Fmaj7#11: F1 root, C3 fifth, A3 third, E4 seventh, B4 eleventh
  { root: N.F1, arpeggio: [N.F1, N.C2, N.A2, N.E3, N.B3, N.E4] },
  // 5. Bm7b5: B1 root, F2 flat-fifth, D3 third, A3 seventh
  { root: N.B1, arpeggio: [N.B1, N.F2, N.D3, N.A3, N.D4, N.F4] },
  // 6. E7alt: E2 root, G#2 third, D3 seventh, G3/C4 alterations
  { root: N.E2, arpeggio: [N.E2, N.B2, N.Gs3, N.D4, N.G4, N.C5] },
  // 7. Am9: A1 root, E2 fifth, C3 third, G3 seventh, B3 ninth
  { root: N.A1, arpeggio: [N.A1, N.E2, N.C3, N.G3, N.B3, N.E4] },
  // 8. A7b13 / A7sus4: A1 root, G3 seventh, C#4 third, F4 flat-thirteenth
  { root: N.A1, arpeggio: [N.A1, N.E2, N.G3, N.Cs4, N.F4, N.A4] }
];

// 64-Bar Left Hand Piano Accomp
for (let bar = 0; bar < TOTAL_BARS; bar++) {
  const barStartSec = bar * BAR_SEC;
  const barStartSample = Math.floor(barStartSec * SAMPLE_RATE);
  const harm = PIANO_HARMONIES[bar % 8];

  // Dynamic intensity by section:
  // Bars 0-7: Solo piano, extra gentle (p)
  // Bars 8-23: Drums join, lyrical flow (mp)
  // Bars 24-47: Climax, rich full voicings (mf)
  // Bars 48-63: Tender resolution into outro (p)
  const isIntro = bar < 8;
  const isOutro = bar >= 56;
  const dyn = isIntro ? 0.75 : (isOutro ? 0.72 : 0.88);

  // Deep Bass Note on Beat 1 (Piano lowest bass string resonance)
  const bassDur = Math.floor(3.5 * BEAT_SEC * SAMPLE_RATE);
  renderAcousticPiano(barStartSample, bassDur, harm.root, 0.95 * dyn, 0.42);

  // Flowing Left-Hand Arpeggio across the 4 beats (like Joe Hisaishi / Chopin Nocturne)
  const arpBeats = [0.0, 1.0, 2.0, 2.75, 3.5];
  harm.arpeggio.forEach((note, idx) => {
    if (idx >= arpBeats.length) return;
    const noteSec = barStartSec + arpBeats[idx] * BEAT_SEC;
    const sSample = Math.floor(noteSec * SAMPLE_RATE);
    const nDur = Math.floor(2.2 * BEAT_SEC * SAMPLE_RATE);
    renderAcousticPiano(sSample, nDur, note, (0.65 + idx * 0.05) * dyn, 0.44 + idx * 0.02);
  });
}

// ----------------------------------------------------------------------------
// Right-Hand Piano Singing Melody (Lyrical, emotive, heartfelt Japanese anime ballad)
// ----------------------------------------------------------------------------
const RIGHT_HAND_MELODY = [
  // --- Section 1: Intro Melody (Bars 2-7) ---
  [2, 2.0, N.E5, 1.2, 0.75],
  [2, 3.25, N.D5, 0.8, 0.7],
  [3, 1.0, N.C5, 1.5, 0.8],
  [3, 2.75, N.B4, 0.9, 0.7],
  [3, 3.75, N.A4, 1.4, 0.8],
  [4, 2.0, N.G4, 0.9, 0.75],
  [4, 3.0, N.A4, 1.8, 0.85],

  [6, 2.0, N.C5, 0.8, 0.75],
  [6, 2.75, N.B4, 0.8, 0.7],
  [6, 3.5, N.A4, 1.0, 0.8],
  [7, 1.0, N.Gs4, 1.4, 0.8],
  [7, 2.5, N.A4, 2.0, 0.85],

  // --- Section 2: Main Theme A (Bars 10-23) ---
  [10, 2.0, N.A4, 0.8, 0.8],
  [10, 2.75, N.C5, 0.8, 0.85],
  [10, 3.5, N.E5, 1.4, 0.9],
  [11, 1.0, N.D5, 1.0, 0.8],
  [11, 2.0, N.C5, 0.7, 0.75],
  [11, 2.75, N.A4, 0.9, 0.8],
  [11, 3.75, N.G4, 1.2, 0.75],
  [12, 1.5, N.A4, 0.8, 0.8],
  [12, 2.25, N.B4, 0.8, 0.85],
  [12, 3.0, N.C5, 1.6, 0.9],

  [14, 2.0, N.D5, 0.8, 0.8],
  [14, 2.75, N.C5, 0.7, 0.75],
  [14, 3.5, N.B4, 0.9, 0.8],
  [15, 1.0, N.Gs4, 1.2, 0.8],
  [15, 2.25, N.A4, 1.8, 0.9],
  [16, 1.0, N.E5, 1.2, 0.85],
  [16, 2.5, N.D5, 0.8, 0.8],
  [16, 3.25, N.C5, 1.5, 0.85],

  // Variations & Dialogue (Bars 18-23)
  [18, 2.0, N.G5, 1.2, 0.9],
  [18, 3.25, N.E5, 1.4, 0.85],
  [19, 1.0, N.D5, 1.0, 0.8],
  [19, 2.25, N.C5, 1.5, 0.85],
  [20, 1.5, N.A4, 0.8, 0.8],
  [20, 2.5, N.C5, 1.2, 0.85],
  [20, 3.75, N.E5, 1.6, 0.9],
  [22, 2.0, N.D5, 0.8, 0.8],
  [22, 2.75, N.C5, 0.8, 0.8],
  [22, 3.5, N.B4, 1.0, 0.85],
  [23, 1.0, N.A4, 2.2, 0.9],

  // --- Section 3: Emotional Theme B / Grand Climax (Bars 26-40) ---
  [26, 2.0, N.F5, 1.2, 0.95],
  [26, 3.25, N.E5, 1.6, 0.9],
  [27, 1.0, N.D5, 1.0, 0.85],
  [27, 2.0, N.C5, 0.8, 0.8],
  [27, 2.75, N.A4, 1.0, 0.85],
  [27, 3.75, N.G4, 1.2, 0.8],
  [28, 1.5, N.G4, 0.8, 0.8],
  [28, 2.25, N.A4, 0.8, 0.85],
  [28, 3.0, N.B4, 1.5, 0.9],
  [29, 1.0, N.C5, 1.0, 0.85],
  [29, 2.0, N.B4, 0.8, 0.8],
  [29, 2.75, N.A4, 1.8, 0.9],

  [31, 2.0, N.E5, 1.0, 0.9],
  [31, 3.0, N.D5, 1.4, 0.85],
  [32, 1.0, N.C5, 1.0, 0.8],
  [32, 2.0, N.A4, 0.9, 0.85],
  [32, 3.0, N.C5, 1.4, 0.9],
  [33, 1.0, N.D5, 1.6, 0.85],
  [33, 2.75, N.C5, 2.0, 0.9],

  // --- Section 4: Pure Piano Jazz Lyrical Improvisation (Bars 42-55) ---
  [42, 2.0, N.A4, 0.7, 0.8],
  [42, 2.75, N.C5, 0.8, 0.85],
  [42, 3.5, N.D5, 0.8, 0.85],
  [43, 1.0, N.E5, 1.4, 0.9],
  [43, 2.5, N.G5, 1.0, 0.9],
  [43, 3.5, N.E5, 1.2, 0.85],
  [44, 1.0, N.D5, 0.9, 0.8],
  [44, 2.0, N.C5, 1.5, 0.85],
  [45, 1.0, N.B4, 1.2, 0.8],
  [45, 2.5, N.C5, 1.8, 0.9],

  [47, 2.0, N.D5, 0.8, 0.8],
  [47, 2.75, N.C5, 0.8, 0.8],
  [47, 3.5, N.B4, 1.0, 0.85],
  [48, 1.0, N.A4, 2.0, 0.9],
  [49, 1.0, N.E5, 1.2, 0.85],
  [49, 2.5, N.C5, 1.8, 0.9],

  // --- Section 5: Outro Resolution (Bars 57-64) ---
  [58, 2.0, N.E5, 1.2, 0.8],
  [58, 3.25, N.D5, 0.9, 0.75],
  [59, 1.0, N.C5, 1.4, 0.8],
  [59, 2.5, N.A4, 1.8, 0.85],
  [61, 2.0, N.C5, 1.0, 0.75],
  [61, 3.0, N.B4, 1.2, 0.7],
  [62, 1.0, N.A4, 2.4, 0.8]
];

RIGHT_HAND_MELODY.forEach(([bar, beat, midi, durBeats, vel]) => {
  const noteSec = (bar - 1) * BAR_SEC + (beat - 1) * BEAT_SEC;
  const startSample = Math.floor(noteSec * SAMPLE_RATE);
  const durSample = Math.floor(durBeats * BEAT_SEC * SAMPLE_RATE);
  // Melody played with natural touch and subtle right-hand stereo positioning (pan 0.58)
  renderAcousticPiano(startSample, durSample, midi, vel, 0.58);
});

// ----------------------------------------------------------------------------
// 4. Acoustic Jazz Drums (Gentle Brushes only, Bars 8 to 56)
// NO drum machines, NO loud snares, just soft brush sweeps and ride ticks
// ----------------------------------------------------------------------------
console.log('Adding soft acoustic jazz brush drums...');
for (let bar = 8; bar < 56; bar++) {
  const barStartSec = bar * BAR_SEC;

  for (let b = 0; b < 4; b++) {
    const beatSec = barStartSec + b * BEAT_SEC;
    const bSample = Math.floor(beatSec * SAMPLE_RATE);

    // Ultra-soft acoustic kick on beat 1 only
    if (b === 0) {
      renderAcousticKick(bSample, 0.32);
    }

    // Brush sweep on beat 2 and beat 4
    if (b === 1 || b === 3) {
      renderBrushSweep(bSample, 0.28);
    } else {
      // Soft brush tap on beat 1 and 3
      renderBrushTap(bSample, 0.18);
    }

    // Swung gentle ride cymbal tick
    renderRideCymbal(bSample, 0.14, 0.62);
    // Swung upbeat (58% swing)
    const swingSec = beatSec + 0.58 * BEAT_SEC;
    renderRideCymbal(Math.floor(swingSec * SAMPLE_RATE), 0.09, 0.65);
  }
}

// ----------------------------------------------------------------------------
// 5. Master Limiter & Lossless Normalization
// ----------------------------------------------------------------------------
console.log('Mastering acoustic piano and drums...');
let maxPeak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const absL = Math.abs(leftBuf[i]);
  const absR = Math.abs(rightBuf[i]);
  if (absL > maxPeak) maxPeak = absL;
  if (absR > maxPeak) maxPeak = absR;
}
console.log(`Peak amplitude before mastering: ${maxPeak.toFixed(3)}`);

const targetPeak = 0.88;
const gain = targetPeak / Math.max(0.01, maxPeak);

const pcmL = new Int16Array(TOTAL_SAMPLES);
const pcmR = new Int16Array(TOTAL_SAMPLES);

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  let l = Math.tanh(leftBuf[i] * gain);
  let r = Math.tanh(rightBuf[i] * gain);
  pcmL[i] = Math.max(-32768, Math.min(32767, Math.round(l * 32767)));
  pcmR[i] = Math.max(-32768, Math.min(32767, Math.round(r * 32767)));
}

// ----------------------------------------------------------------------------
// 6. Export MP3 (192 kbps)
// ----------------------------------------------------------------------------
function writeMp3(filename) {
  const mp3encoder = new lamejs.Mp3Encoder(2, SAMPLE_RATE, 192);
  const mp3Data = [];
  const chunkSize = 1152;

  for (let i = 0; i < TOTAL_SAMPLES; i += chunkSize) {
    const leftChunk = pcmL.subarray(i, i + chunkSize);
    const rightChunk = pcmR.subarray(i, i + chunkSize);
    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(Buffer.from(mp3buf));
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(Buffer.from(endBuf));
  }

  const finalMp3 = Buffer.concat(mp3Data);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, finalMp3);
  console.log(`Saved MP3: ${filename} (${(finalMp3.length / 1024 / 1024).toFixed(2)} MB)`);
}

// ----------------------------------------------------------------------------
// 7. Export WAV (44.1kHz 16-bit Stereo)
// ----------------------------------------------------------------------------
function writeWav(filename) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = TOTAL_SAMPLES * blockAlign;
  const headerSize = 44;
  const wavBuf = Buffer.alloc(headerSize + dataSize);

  wavBuf.write('RIFF', 0);
  wavBuf.writeUInt32LE(36 + dataSize, 4);
  wavBuf.write('WAVE', 8);
  wavBuf.write('fmt ', 12);
  wavBuf.writeUInt32LE(16, 16);
  wavBuf.writeUInt16LE(1, 20);
  wavBuf.writeUInt16LE(numChannels, 22);
  wavBuf.writeUInt32LE(SAMPLE_RATE, 24);
  wavBuf.writeUInt32LE(byteRate, 28);
  wavBuf.writeUInt16LE(blockAlign, 32);
  wavBuf.writeUInt16LE(bytesPerSample * 8, 34);
  wavBuf.write('data', 36);
  wavBuf.writeUInt32LE(dataSize, 40);

  let offset = headerSize;
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    wavBuf.writeInt16LE(pcmL[i], offset);
    wavBuf.writeInt16LE(pcmR[i], offset + 2);
    offset += 4;
  }

  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, wavBuf);
  console.log(`Saved WAV: ${filename} (${(wavBuf.length / 1024 / 1024).toFixed(2)} MB)`);
}

// Destinations
writeMp3('public/audio/bgm/night.mp3');
writeMp3('public/audio/bgm/chat.mp3');
writeMp3('public/audio/bgm/beneath_the_mask_jazz.mp3');
writeWav('public/audio/bgm/night.wav');

console.log('✅ Pure Piano & Jazz Drums Ballad generated successfully!');
