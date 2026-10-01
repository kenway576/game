const fs = require('fs');
const path = require('path');
global.MPEGMode = require('lamejs/src/js/MPEGMode.js');
global.Lame = require('lamejs/src/js/Lame.js');
global.BitStream = require('lamejs/src/js/BitStream.js');
const lamejs = require('lamejs');

const SAMPLE_RATE = 44100;

// Acoustic Piano Note Synthesizer with 3-string detuning and hammer impulse
function renderAcousticPianoNote(bufferL, bufferR, startSample, durationSample, freq, velocity, pan = 0.5) {
  const totalSamples = bufferL.length;
  // 3 strings detuned slightly (-0.35 Hz, 0 Hz, +0.35 Hz) for natural grand piano warmth
  const detunes = [-0.35, 0.0, 0.35];
  
  // Harmonics amplitude based on velocity (piano vs forte)
  const numHarmonics = Math.min(10, Math.floor(12000 / freq));

  for (let i = 0; i < durationSample; i++) {
    const sIdx = (startSample + i) % totalSamples;
    const t = i / SAMPLE_RATE;

    // Felt hammer knock (short percussive wooden transient ~15ms)
    const hammer = Math.exp(-t * 140) * Math.sin(2 * Math.PI * 160 * t) * 0.25;

    // Two-stage string vibration: prompt decay and slow soundboard sustain
    const envPrompt = Math.exp(-t * (2.2 + freq * 0.002));
    const envSustain = Math.exp(-t * (0.8 + freq * 0.0008)) * 0.7;
    const env = envPrompt * 0.5 + envSustain * 0.5;

    let sample = 0;
    // Sum over 3 strings
    for (let s = 0; s < 3; s++) {
      const f0 = freq + detunes[s];
      // Harmonics
      for (let h = 1; h <= numHarmonics; h++) {
        const hFreq = f0 * h;
        if (hFreq > 14000) break;
        // Higher harmonics decay faster
        const hEnv = Math.exp(-t * (h * 1.8 + freq * 0.0015));
        const hAmp = (1 / Math.pow(h, 1.35)) * (0.7 + 0.3 * velocity);
        sample += Math.sin(2 * Math.PI * hFreq * t) * hAmp * hEnv;
      }
    }
    sample = (sample * 0.33 * env + hammer * 0.3) * velocity * 0.25;

    // Soft soundboard saturation
    sample = Math.tanh(sample * 1.2);

    bufferL[sIdx] += sample * pan;
    bufferR[sIdx] += sample * (1 - pan);
  }
}

console.log('Testing acoustic piano engine...');
const testLen = SAMPLE_RATE * 5;
const bL = new Float32Array(testLen);
const bR = new Float32Array(testLen);

// Play a Cmaj9 chord
[261.63, 329.63, 392.00, 493.88, 587.33].forEach((f, idx) => {
  renderAcousticPianoNote(bL, bR, Math.floor(idx * 0.02 * SAMPLE_RATE), Math.floor(3.5 * SAMPLE_RATE), f, 0.8, 0.4 + idx * 0.04);
});

console.log('Piano rendered without error, peak:', Math.max(...bL));
