// js/sounds.js — ACNHEX Sound Engine (Web Audio API, zero audio files)

const NookSounds = (() => {
  let ctx = null;
  let masterGain = null;
  let enabled = false; // off by default, user opts in
  let volume = 0.5;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
  }

  function setVolume(v) {
    volume = v;
    if (masterGain) masterGain.gain.value = v;
  }

  function setEnabled(e) { enabled = e; }
  function isEnabled() { return enabled; }

  // ── Helpers ──

  // Soft oscillator: sine-only, slow 30ms attack, lowpass filtered, long tail
  function softOsc(freq, startTime, duration, gainVal = 0.15) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = 'sine';
    o.frequency.value = freq;
    f.type = 'lowpass';
    f.frequency.value = Math.min(freq * 2.5, 4000);
    f.Q.value = 0.3;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainVal, startTime + 0.03);
    g.gain.setValueAtTime(gainVal, startTime + duration * 0.4);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    o.connect(f);
    f.connect(g);
    g.connect(masterGain);
    o.start(startTime);
    o.stop(startTime + duration + 0.01);
  }

  // Soft filtered noise — lowpass at 1500Hz, very gentle
  function softNoise(startTime, duration, gainVal = 0.03) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 1500;
    f.Q.value = 0.2;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainVal, startTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    src.connect(f);
    f.connect(g);
    g.connect(masterGain);
    src.start(startTime);
    src.stop(startTime + duration + 0.01);
  }

  // Pitch bend helper — sine with frequency sweep
  function softBend(freqStart, freqEnd, startTime, duration, gainVal = 0.12) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = 'sine';
    o.frequency.setValueAtTime(freqStart, startTime);
    o.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
    f.type = 'lowpass';
    f.frequency.value = 2000;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainVal, startTime + 0.025);
    g.gain.setValueAtTime(gainVal * 0.8, startTime + duration * 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    o.connect(f);
    f.connect(g);
    g.connect(masterGain);
    o.start(startTime);
    o.stop(startTime + duration + 0.01);
  }

  // ── Sound Definitions ──

  const sounds = {

    // 🛒 CART
    addToCart() {
      const t = ctx.currentTime;
      softOsc(330, t, 0.25, 0.18);
      softOsc(495, t + 0.06, 0.25, 0.12);
      softOsc(660, t + 0.12, 0.3, 0.08);
    },
    duplicate() {
      const t = ctx.currentTime;
      softOsc(392, t, 0.22, 0.14);
      softOsc(494, t + 0.05, 0.2, 0.08);
      softOsc(415, t + 0.2, 0.22, 0.14);
      softOsc(523, t + 0.25, 0.22, 0.08);
    },
    removeItem() {
      const t = ctx.currentTime;
      softBend(440, 220, t, 0.35, 0.12);
    },
    clearCart() {
      const t = ctx.currentTime;
      [659, 587, 494, 392, 330].forEach((freq, i) => {
        softOsc(freq, t + i * 0.1, 0.35, 0.1);
      });
    },
    cartFull() {
      const t = ctx.currentTime;
      softOsc(200, t, 0.2, 0.1);
      softOsc(180, t + 0.18, 0.22, 0.1);
    },

    // 💚 WISHLIST
    heartAdd() {
      const t = ctx.currentTime;
      softOsc(660, t, 0.3, 0.12);
      softOsc(880, t + 0.08, 0.3, 0.1);
      softOsc(1100, t + 0.16, 0.35, 0.08);
      softOsc(1320, t + 0.22, 0.4, 0.06);
      softNoise(t + 0.1, 0.2, 0.015);
    },
    heartRemove() {
      const t = ctx.currentTime;
      softOsc(1100, t, 0.25, 0.1);
      softOsc(880, t + 0.08, 0.25, 0.08);
      softOsc(660, t + 0.16, 0.3, 0.07);
    },
    newList() {
      const t = ctx.currentTime;
      softOsc(523, t, 0.5, 0.15);
      softOsc(659, t + 0.02, 0.45, 0.12);
      softOsc(784, t + 0.04, 0.5, 0.1);
      softOsc(1047, t + 0.2, 0.45, 0.07);
    },
    deleteList() {
      const t = ctx.currentTime;
      softNoise(t, 0.18, 0.06);
      softNoise(t + 0.04, 0.12, 0.04);
      softBend(250, 120, t, 0.18, 0.03);
    },

    // 🏠 BROWSING
    pullRefresh() {
      const t = ctx.currentTime;
      const melody = [[392,0.2],[494,0.2],[587,0.2],[784,0.3],[587,0.25],[784,0.4]];
      let off = 0;
      melody.forEach(([freq, dur]) => {
        softOsc(freq, t + off, dur * 1.3, 0.12);
        off += dur * 0.85;
      });
    },
    categoryTap() {
      const t = ctx.currentTime;
      softOsc(800, t, 0.08, 0.1);
      softNoise(t, 0.02, 0.03);
    },
    loadMore() {
      const t = ctx.currentTime;
      softBend(250, 600, t, 0.3, 0.08);
      softNoise(t + 0.05, 0.15, 0.015);
    },
    variantSwitch() {
      const t = ctx.currentTime;
      softNoise(t, 0.14, 0.05);
      softBend(500, 700, t, 0.1, 0.04);
    },

    // 📋 CLIPBOARD & SYSTEM
    copyCommand() {
      const t = ctx.currentTime;
      softOsc(1200, t, 0.04, 0.12);
      softNoise(t, 0.025, 0.05);
    },
    prefixChange() {
      const t = ctx.currentTime;
      softOsc(1047, t, 0.6, 0.12);
      softOsc(1319, t + 0.01, 0.5, 0.08);
      softOsc(1568, t + 0.15, 0.5, 0.05);
    },
    toggleSound() {
      const t = ctx.currentTime;
      softOsc(1000, t, 0.04, 0.08);
      softNoise(t, 0.01, 0.04);
    },

    // 🦝 FAKE AD SYSTEM
    interstitial() {
      const t = ctx.currentTime;
      [262, 294, 330, 349, 392, 440].forEach((freq, i) => {
        softOsc(freq, t + i * 0.1, 0.18, 0.06);
      });
      softOsc(523, t + 0.6, 0.35, 0.08);
    },
    notification() {
      const t = ctx.currentTime;
      softOsc(660, t, 0.15, 0.12);
      softOsc(880, t + 0.12, 0.2, 0.1);
    },
    dismissAd() {
      const t = ctx.currentTime;
      softNoise(t, 0.12, 0.06);
      softBend(800, 400, t, 0.15, 0.05);
    },
    adToast() {
      const t = ctx.currentTime;
      softOsc(392, t, 0.25, 0.12);
      softOsc(494, t + 0.15, 0.25, 0.12);
      softOsc(587, t + 0.3, 0.3, 0.1);
      softOsc(784, t + 0.42, 0.4, 0.1);
    },
    hexCopy() {
      const t = ctx.currentTime;
      softOsc(880, t, 0.06, 0.12);
      softBend(880, 1320, t, 0.08, 0.1);
      softNoise(t, 0.02, 0.04);
    },
  };

  function play(name) {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    init();
    if (ctx.state === 'suspended') ctx.resume();
    if (sounds[name]) sounds[name]();
  }

  return { play, init, setVolume, setEnabled, isEnabled };
})();

export default NookSounds;
