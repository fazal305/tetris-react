// All sound effects are synthesized via the Web Audio API — no external audio files.
// This keeps the game fully offline and avoids bundling copyrighted assets.

let audioContext = null;
let masterGain = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
}

function playTone({ frequency, duration, type = 'sine', gain = 0.6, sweepTo = null }) {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  if (sweepTo !== null) {
    osc.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + duration);
  }

  envelope.gain.setValueAtTime(0, ctx.currentTime);
  envelope.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(envelope);
  envelope.connect(masterGain);

  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

const SOUND_DEFS = {
  move: () => playTone({ frequency: 220, duration: 0.05, type: 'square', gain: 0.15 }),
  rotate: () => playTone({ frequency: 330, duration: 0.06, type: 'square', gain: 0.18 }),
  softDrop: () => playTone({ frequency: 150, duration: 0.04, type: 'square', gain: 0.12 }),
  hardDrop: () => playTone({ frequency: 100, duration: 0.12, type: 'sawtooth', gain: 0.3, sweepTo: 50 }),
  lock: () => playTone({ frequency: 180, duration: 0.08, type: 'triangle', gain: 0.2 }),
  lineClear: () => playTone({ frequency: 440, duration: 0.18, type: 'square', gain: 0.25, sweepTo: 660 }),
  tetris: () => {
    [523, 659, 784, 1046].forEach((freq, i) => {
      setTimeout(() => playTone({ frequency: freq, duration: 0.15, type: 'square', gain: 0.28 }), i * 60);
    });
  },
  levelUp: () => {
    [392, 523, 659].forEach((freq, i) => {
      setTimeout(() => playTone({ frequency: freq, duration: 0.14, type: 'triangle', gain: 0.25 }), i * 80);
    });
  },
  hold: () => playTone({ frequency: 280, duration: 0.07, type: 'sine', gain: 0.18 }),
  gameOver: () => {
    [392, 330, 262, 196].forEach((freq, i) => {
      setTimeout(() => playTone({ frequency: freq, duration: 0.25, type: 'sawtooth', gain: 0.22 }), i * 140);
    });
  },
  menuSelect: () => playTone({ frequency: 300, duration: 0.05, type: 'sine', gain: 0.15 }),
};

let soundEnabled = true;

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

export function playSound(name) {
  if (!soundEnabled) return;
  const play = SOUND_DEFS[name];
  if (!play) return;
  try {
    play();
  } catch {
    // Audio unavailable (autoplay policy, unsupported browser) — fail silently.
  }
}

export function primeAudioContext() {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}
