/**
 * Pagoda Patch — fun Burmese-inspired music + juicy SFX
 * Saung plucks · pat waing drums · hne leads · si/wa claps
 */
window.GardenAudio = (() => {
  "use strict";

  let ctx = null, master, musicGain, sfxGain;
  let enabled = true, musicOn = true, sfxOn = true;
  let currentTheme = "menu";
  let musicTimer = null, groanTimer = null;
  let step = 0, bar = 0;
  let _prevMute = { musicOn: true, sfxOn: true };

  // ── Tuning: slightly bright “hsaing” feel ─────────────────
  const A4 = 442;
  function f(midi) { return A4 * Math.pow(2, (midi - 69) / 12); }

  // Burmese-ish pentatonic-ish sets (fun game-music, not academic)
  // C  D  E  G  A   + leading colors
  const S = {
    // low drums / bass
    C2: 36, D2: 38, E2: 40, F2: 41, G2: 43, A2: 45, B2: 47,
    C3: 48, D3: 50, E3: 52, F3: 53, G3: 55, A3: 57, B3: 59,
    C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71,
    C5: 72, D5: 74, E5: 76, F5: 77, G5: 79, A5: 81, B5: 83, C6: 84,
    // “bent” flavor notes
    Eb3: 51, Eb4: 63, Bb3: 58, Bb4: 70, Fs4: 66, Ab4: 68,
  };

  /**
   * Each theme: catchy hook, call-response, strong groove.
   * steps are 16th notes. Patterns length 16 or 32.
   */
  const THEMES = {
    menu: {
      bpm: 108,
      // bouncing festival intro
      bass:  [S.C3,0,0,S.C3, S.G2,0,S.A2,0, S.F2,0,0,S.F2, S.G2,0,S.E2,0],
      lead:  [S.E4,S.G4,S.C5,0, S.B4,S.A4,0,S.G4, S.A4,0,S.C5,S.E5, S.D5,0,S.C5,0],
      lead2: [0,0,S.C5,S.E5, 0,0,S.G4,0, 0,S.A4,0,S.C5, 0,S.G4,0,S.E4],
      kick:  [1,0,0,0, 1,0,0,1, 1,0,0,0, 1,0,1,0],
      snare: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,0,1],
      hat:   [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
      clap:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,1],
      bell:  [S.C6,0,0,0, 0,0,S.G5,0, S.A5,0,0,0, 0,0,S.E5,0],
      saung: true,
      feel: "bright",
    },
    map: {
      bpm: 100,
      bass:  [S.G2,0,0,S.G2, S.D3,0,0,0, S.E3,0,S.E3,0, S.C3,0,S.D3,0],
      lead:  [S.G4,0,S.B4,S.D5, 0,S.C5,0,S.B4, S.A4,0,S.G4,S.E4, S.G4,0,0,0],
      lead2: [0,S.D5,0,0, S.E5,0,S.D5,0, 0,S.C5,0,S.B4, 0,S.A4,S.G4,0],
      kick:  [1,0,0,0, 1,0,0,0, 1,0,0,1, 1,0,0,0],
      snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
      hat:   [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,1,0],
      clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      bell:  [S.G5,0,0,S.D5, 0,0,S.E5,0, 0,0,S.C5,0, 0,S.D5,0,0],
      saung: true,
      feel: "travel",
    },
    day: {
      bpm: 118,
      // sunny thingyan energy
      bass:  [S.C3,0,S.C3,0, S.G2,0,S.G2,S.A2, S.F2,0,S.F2,0, S.G2,0,S.E2,S.G2],
      lead:  [S.C5,S.D5,S.E5,0, S.G5,0,S.E5,S.D5, S.C5,0,S.A4,S.G4, S.A4,S.C5,0,0],
      lead2: [0,0,0,S.G4, 0,S.E5,0,0, 0,S.C5,0,0, S.D5,0,S.E5,S.G5],
      kick:  [1,0,0,1, 1,0,0,0, 1,0,0,1, 1,0,1,0],
      snare: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,0,1],
      hat:   [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,0,1,1],
      clap:  [0,0,1,0, 0,0,1,1, 0,0,1,0, 0,0,1,0],
      bell:  [0,0,S.E5,0, 0,0,S.G5,0, 0,0,S.C6,0, 0,S.A5,0,S.G5],
      saung: true,
      feel: "party",
    },
    night: {
      bpm: 92,
      bass:  [S.A2,0,0,S.A2, 0,S.E2,0,0, S.F2,0,0,S.F2, S.G2,0,S.E2,0],
      lead:  [S.A4,0,S.C5,0, S.E5,S.D5,S.C5,0, S.B4,0,S.D5,0, S.E5,0,S.C5,0],
      lead2: [0,S.E4,0,S.A4, 0,0,S.C5,S.E5, 0,S.D5,0,S.B4, 0,0,S.A4,0],
      kick:  [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
      snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
      hat:   [1,0,1,0, 1,0,0,1, 1,0,1,0, 1,0,1,0],
      clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      bell:  [S.A5,0,0,0, 0,0,S.E5,0, S.F5,0,0,0, 0,S.G5,0,0],
      saung: true,
      pad: true,
      feel: "moon",
    },
    fog: {
      bpm: 84,
      bass:  [S.D2,0,0,0, S.D2,0,S.A2,0, S.Bb3-12,0,0,0, S.F2,0,S.A2,0].map((x)=>x||0),
      lead:  [S.D4,0,0,S.F4, 0,0,S.A4,0, S.G4,0,S.F4,0, S.E4,0,0,0],
      lead2: [0,0,S.A3,0, 0,S.D4,0,S.F4, 0,0,S.E4,0, 0,S.D4,S.C4,0],
      kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
      snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:   [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      clap:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0],
      bell:  [S.D5,0,0,0, 0,0,0,S.A4, 0,0,0,0, S.F5,0,0,0],
      saung: true,
      pad: true,
      feel: "mist",
    },
    storm: {
      bpm: 132,
      bass:  [S.E2,S.E2,0,S.E2, S.G2,0,S.E2,0, S.A2,S.A2,0,S.A2, S.G2,0,S.B2,0],
      lead:  [S.E5,0,S.G5,S.B5, 0,S.A5,0,S.G5, S.E5,0,S.D5,0, S.E5,S.G5,0,0],
      lead2: [S.B4,0,0,S.E5, S.G5,0,0,S.B4, S.A4,0,0,S.G4, 0,S.E4,S.G4,S.B4],
      kick:  [1,0,1,0, 1,0,0,1, 1,0,1,0, 1,0,1,1],
      snare: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,0,1],
      hat:   [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
      clap:  [0,0,1,0, 0,1,0,1, 0,0,1,0, 0,1,1,0],
      bell:  [0,S.E5,0,0, S.B5,0,0,0, 0,S.A5,0,0, S.G5,0,S.E5,0],
      feel: "storm",
    },
    factory: {
      bpm: 124,
      // night-market clatter
      bass:  [S.C2,0,S.C2,0, S.C2,0,S.G2,S.C2, S.Eb3-12,0,S.Eb3-12,0, S.F2,0,S.G2,0],
      lead:  [S.C5,S.C5,0,S.Eb4+12, 0,S.G5,0,0, S.Bb4,S.Bb4,0,S.C5, 0,S.Eb5,0,0],
      lead2: [0,0,S.G4,0, S.Bb4,0,S.C5,S.Eb5, 0,0,S.F5,0, S.Eb5,S.C5,0,S.Bb4],
      kick:  [1,0,0,0, 1,0,0,1, 1,0,0,0, 1,0,0,0],
      snare: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,1],
      hat:   [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,1,1,0],
      clap:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,0,1],
      bell:  [S.C6,0,0,S.G5, 0,0,S.Bb5,0, 0,S.C6,0,0, S.Eb5+12,0,0,0],
      feel: "market",
    },
    boss: {
      bpm: 144,
      bass:  [33,33,33,0, 33,0,S.C2,0, S.E2,S.E2,S.E2,0, S.D2,0,S.C2,35],
      lead:  [S.A4,0,S.A4,S.C5, 0,S.E5,0,S.D5, S.C5,0,S.B4,0, S.A4,S.G4,0,0],
      lead2: [S.E5,0,0,S.A5, S.C6,0,0,S.B5, S.A5,0,S.G5,0, S.E5,0,S.D5,S.C5],
      kick:  [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1],
      snare: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      hat:   [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,0,1,1],
      clap:  [0,0,1,0, 0,0,1,1, 0,0,1,0, 0,1,0,1],
      bell:  [S.A5,0,0,0, S.E6-12,0,0,0, S.C6,0,0,0, S.A5,0,S.G5,0],
      feel: "boss",
    },
  };

  // fix fog bass Bb
  THEMES.fog.bass = [S.D2,0,0,0, S.D2,0,S.A2,0, S.Bb3 - 12,0,0,0, S.F2,0,S.A2,0];
  THEMES.factory.bass = [S.C2,0,S.C2,0, S.C2,0,S.G2,S.C2, S.Eb3 - 12,0,S.Eb3 - 12,0, S.F2,0,S.G2,0];
  THEMES.factory.lead = [S.C5,S.C5,0,S.Eb4 + 12, 0,S.G5,0,0, S.Bb4,S.Bb4,0,S.C5, 0,S.Eb5,0,0];

  function ensure() {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = musicOn ? 0.9 : 0;
    musicGain.connect(master);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = sfxOn ? 1 : 0;
    sfxGain.connect(master);
    return ctx;
  }

  function outOk(node) {
    if (!enabled) return false;
    if (node === sfxGain && !sfxOn) return false;
    if (node === musicGain && !musicOn) return false;
    return true;
  }

  // ── synth voices ──────────────────────────────────────────
  function noiseBuf(dur) {
    const len = Math.max(1, (ctx.sampleRate * dur) | 0);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function noise({ dur = 0.1, vol = 0.04, freq = 1200, type = "bandpass", q = 0.8, dest, when = 0 }) {
    ensure();
    const out = dest || sfxGain;
    if (!outOk(out)) return;
    const t0 = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf(dur);
    const fil = ctx.createBiquadFilter();
    fil.type = type; fil.frequency.value = freq; fil.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(fil); fil.connect(g); g.connect(out);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }

  function osc({ freq, dur = 0.2, type = "sine", vol = 0.05, slide = 0, dest, when = 0, filt = 0, attack = 0.01, drive = 1 }) {
    ensure();
    const out = dest || sfxGain;
    if (!outOk(out)) return;
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(freq, 20), t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(freq + slide, 20), t0 + dur);

    let node = o;
    if (filt) {
      const fil = ctx.createBiquadFilter();
      fil.type = "lowpass";
      fil.frequency.value = filt;
      o.connect(fil);
      node = fil;
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(vol * drive, 0.0001), t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    node.connect(g); g.connect(out);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }

  /** Saung gauk-ish pluck */
  function saungPluck(midi, vol = 0.05, dur = 0.55) {
    ensure();
    if (!outOk(musicGain)) return;
    const t0 = ctx.currentTime;
    const freq = f(midi);
    // fundamental + gentle overtones
    [1, 2.01, 3.1].forEach((mult, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "triangle" : "sine";
      o.frequency.value = freq * mult;
      const g = ctx.createGain();
      const v = vol * (i === 0 ? 1 : 0.22 / i);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(v, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * (1 - i * 0.15));
      const fil = ctx.createBiquadFilter();
      fil.type = "lowpass";
      fil.frequency.setValueAtTime(3200, t0);
      fil.frequency.exponentialRampToValueAtTime(600, t0 + dur);
      o.connect(fil); fil.connect(g); g.connect(musicGain);
      o.start(t0); o.stop(t0 + dur + 0.02);
    });
    // tiny nail attack
    noise({ dur: 0.025, vol: vol * 0.35, freq: 2500, type: "highpass", q: 0.5, dest: musicGain });
  }

  /** Hne-ish nasal lead */
  function hneNote(midi, vol = 0.045, dur = 0.22) {
    ensure();
    if (!outOk(musicGain)) return;
    const t0 = ctx.currentTime;
    const freq = f(midi);
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(freq, t0);
    // slight pitch scoop — expressive
    o.frequency.setValueAtTime(freq * 0.97, t0);
    o.frequency.exponentialRampToValueAtTime(freq, t0 + 0.04);

    const o2 = ctx.createOscillator();
    o2.type = "square";
    o2.frequency.value = freq * 2.005;

    const fil = ctx.createBiquadFilter();
    fil.type = "bandpass";
    fil.frequency.value = freq * 2.2;
    fil.Q.value = 4;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.03);
    g.gain.setValueAtTime(vol * 0.85, t0 + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    o.connect(fil); o2.connect(fil); fil.connect(g); g.connect(musicGain);
    o.start(t0); o2.start(t0);
    o.stop(t0 + dur + 0.02); o2.stop(t0 + dur + 0.02);
  }

  /** Bright square “game lead” */
  function chiptune(midi, vol = 0.04, dur = 0.16) {
    ensure();
    if (!outOk(musicGain)) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = f(midi);
    const fil = ctx.createBiquadFilter();
    fil.type = "lowpass";
    fil.frequency.value = 2400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(fil); fil.connect(g); g.connect(musicGain);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  function bassHit(midi, vol = 0.08, dur = 0.28) {
    ensure();
    if (!outOk(musicGain)) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(f(midi) * 1.5, t0);
    o.frequency.exponentialRampToValueAtTime(f(midi), t0 + 0.04);
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = f(midi) * 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const fil = ctx.createBiquadFilter();
    fil.type = "lowpass";
    fil.frequency.value = 400;
    o.connect(fil); o2.connect(fil); fil.connect(g); g.connect(musicGain);
    o.start(t0); o2.start(t0);
    o.stop(t0 + dur + 0.02); o2.stop(t0 + dur + 0.02);
  }

  // Pat waing-ish drums
  function kick() {
    ensure();
    if (!outOk(musicGain)) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(160, t0);
    o.frequency.exponentialRampToValueAtTime(42, t0 + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    o.connect(g); g.connect(musicGain);
    o.start(t0); o.stop(t0 + 0.2);
    noise({ dur: 0.04, vol: 0.04, freq: 200, type: "lowpass", dest: musicGain });
  }

  function snare() {
    noise({ dur: 0.1, vol: 0.07, freq: 1800, type: "highpass", q: 0.6, dest: musicGain });
    osc({ freq: 220, dur: 0.07, type: "triangle", vol: 0.05, slide: -90, dest: musicGain });
  }

  function hat(open = false) {
    noise({
      dur: open ? 0.12 : 0.035,
      vol: open ? 0.035 : 0.028,
      freq: open ? 6000 : 8000,
      type: "highpass",
      q: 0.6,
      dest: musicGain,
    });
  }

  /** Si & wa — bright clap / finger cymbal */
  function clap() {
    noise({ dur: 0.06, vol: 0.06, freq: 2200, type: "bandpass", q: 1.4, dest: musicGain });
    noise({ dur: 0.04, vol: 0.04, freq: 4500, type: "highpass", q: 0.7, dest: musicGain, when: 0.01 });
  }

  function bell(midi) {
    ensure();
    if (!outOk(musicGain) || !midi) return;
    const t0 = ctx.currentTime;
    const freq = f(midi);
    [1, 2.76, 5.4].forEach((m, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq * m;
      const g = ctx.createGain();
      const v = 0.035 / (i + 1);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(v, t0 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7 - i * 0.1);
      o.connect(g); g.connect(musicGain);
      o.start(t0); o.stop(t0 + 0.75);
    });
  }

  function padChord(midi) {
    if (!midi) return;
    ensure();
    if (!outOk(musicGain)) return;
    const t0 = ctx.currentTime;
    // open fifth + octave — temple vibe
    [0, 7, 12].forEach((off) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f(midi + off);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(0.02, t0 + 0.2);
      g.gain.linearRampToValueAtTime(0.0001, t0 + 0.7);
      const fil = ctx.createBiquadFilter();
      fil.type = "lowpass";
      fil.frequency.value = 900;
      o.connect(fil); fil.connect(g); g.connect(musicGain);
      o.start(t0); o.stop(t0 + 0.75);
    });
  }

  // ── sequencer ─────────────────────────────────────────────
  function musicTick() {
    if (!enabled || !musicOn || !ctx) return;
    const th = THEMES[currentTheme] || THEMES.day;
    const len = th.bass.length;
    const i = step % len;
    const stepMs = (60 / th.bpm) * 1000 / 4; // 16th notes

    // drums
    if (th.kick[i]) kick();
    if (th.snare[i]) snare();
    if (th.hat[i]) hat(i % 8 === 7);
    if (th.clap && th.clap[i]) clap();

    // bass
    if (th.bass[i]) bassHit(th.bass[i], th.feel === "boss" ? 0.1 : 0.075, 0.26);

    // leads — alternate saung / hne / chiptune for color
    if (th.lead[i]) {
      if (th.saung && bar % 2 === 0) saungPluck(th.lead[i], 0.055, 0.45);
      else if (th.feel === "storm" || th.feel === "boss") hneNote(th.lead[i], 0.05, 0.2);
      else chiptune(th.lead[i], 0.042, 0.15);
    }
    if (th.lead2 && th.lead2[i]) {
      // call-and-response answer
      if (th.saung) saungPluck(th.lead2[i], 0.035, 0.35);
      else chiptune(th.lead2[i], 0.03, 0.12);
    }

    if (th.bell && th.bell[i]) bell(th.bell[i]);
    if (th.pad && i % 8 === 0 && th.bass[i]) padChord(th.bass[i] + 12);

    // festive fill every 4 bars
    if (i === 15 && bar % 4 === 3) {
      clap();
      setTimeout(() => clap(), stepMs * 0.5);
      setTimeout(() => bell(S.C6), stepMs);
    }

    // boss growl
    if (currentTheme === "boss" && i === 0) {
      osc({ freq: 42, dur: 0.45, type: "sawtooth", vol: 0.04, slide: -8, dest: musicGain, filt: 180 });
    }

    step++;
    if (i === len - 1) bar++;
    musicTimer = setTimeout(musicTick, stepMs);
  }

  function stopMusicTimer() {
    if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
  }

  function startMusic(theme) {
    ensure();
    currentTheme = theme && THEMES[theme] ? theme : currentTheme;
    stopMusicTimer();
    step = 0; bar = 0;
    if (enabled && musicOn) musicTick();
  }

  function stopMusic() { stopMusicTimer(); }

  function setTheme(theme) {
    if (!(theme in THEMES)) theme = "day";
    if (theme === currentTheme && musicTimer) return;
    currentTheme = theme;
    if (musicTimer) {
      stopMusicTimer();
      step = 0; bar = 0;
      if (enabled && musicOn) musicTick();
    }
  }

  // ── Zombie voices — goofier ───────────────────────────────
  function zombieGroan(intense = false) {
    if (!enabled || !sfxOn) return;
    ensure();
    const t0 = ctx.currentTime;
    const base = 65 + Math.random() * 55;
    const dur = intense ? 0.75 : 0.4 + Math.random() * 0.35;

    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(base, t0);
    o.frequency.linearRampToValueAtTime(base * (0.65 + Math.random() * 0.5), t0 + dur);

    // vibrato LFO
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5 + Math.random() * 3;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 12;
    lfo.connect(lfoG); lfoG.connect(o.frequency);

    const o2 = ctx.createOscillator();
    o2.type = "square";
    o2.frequency.setValueAtTime(base * 1.4, t0);

    const fil = ctx.createBiquadFilter();
    fil.type = "bandpass";
    fil.frequency.setValueAtTime(350 + Math.random() * 400, t0);
    fil.frequency.linearRampToValueAtTime(180 + Math.random() * 220, t0 + dur);
    fil.Q.value = 2.5;

    const g = ctx.createGain();
    const vol = intense ? 0.09 : 0.045 + Math.random() * 0.03;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.04);
    g.gain.linearRampToValueAtTime(vol * 0.6, t0 + dur * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    noise({ dur: dur * 0.7, vol: vol * 0.45, freq: 500, type: "bandpass", q: 1.1 });

    o.connect(fil); o2.connect(fil); fil.connect(g); g.connect(sfxGain);
    o.start(t0); o2.start(t0); lfo.start(t0);
    o.stop(t0 + dur + 0.02); o2.stop(t0 + dur + 0.02); lfo.stop(t0 + dur + 0.02);

    // silly "brains" blip on intense
    if (intense && Math.random() < 0.5) {
      setTimeout(() => {
        osc({ freq: 180, dur: 0.08, type: "square", vol: 0.03, slide: -40, filt: 800 });
        osc({ freq: 140, dur: 0.1, type: "square", vol: 0.025, slide: -30, when: 0.09, filt: 700 });
      }, dur * 400);
    }
  }

  function startGroans() {
    stopGroans();
    const loop = () => {
      if (!enabled || !sfxOn) return;
      zombieGroan(Math.random() < 0.2);
      if (Math.random() < 0.35) setTimeout(() => zombieGroan(false), 180 + Math.random() * 500);
      groanTimer = setTimeout(loop, 1800 + Math.random() * 2800);
    };
    groanTimer = setTimeout(loop, 1200);
  }
  function stopGroans() {
    if (groanTimer) { clearTimeout(groanTimer); groanTimer = null; }
  }

  // ── Fun SFX ───────────────────────────────────────────────
  function arpeggio(notes, gap, vol, type = "sine") {
    notes.forEach((n, i) => {
      setTimeout(() => osc({ freq: f(n), dur: 0.14, type, vol, filt: 3000 }), i * gap);
    });
  }

  const sfx = {
    plant() {
      // dirt + sprout sparkle
      noise({ dur: 0.07, vol: 0.045, freq: 700, type: "lowpass" });
      osc({ freq: 320, dur: 0.07, type: "triangle", vol: 0.06 });
      arpeggio([S.E4, S.G4, S.C5], 45, 0.04, "sine");
    },
    shoot() {
      osc({ freq: 640, dur: 0.06, type: "square", vol: 0.035, slide: -280, filt: 2200 });
      noise({ dur: 0.03, vol: 0.02, freq: 3500, type: "highpass" });
      osc({ freq: 900, dur: 0.04, type: "sine", vol: 0.02, when: 0.02 });
    },
    hit() {
      noise({ dur: 0.08, vol: 0.05, freq: 900, type: "bandpass", q: 1.2 });
      osc({ freq: 170, dur: 0.07, type: "sawtooth", vol: 0.04, slide: -70, filt: 700 });
    },
    sun() {
      // coin-meets-pagoda-bell
      arpeggio([S.G5, S.C6, S.E6], 55, 0.05, "sine");
      bell(S.C6);
    },
    explode() {
      noise({ dur: 0.4, vol: 0.14, freq: 350, type: "lowpass" });
      noise({ dur: 0.22, vol: 0.09, freq: 1400, type: "bandpass" });
      osc({ freq: 90, dur: 0.4, type: "sawtooth", vol: 0.1, slide: -50, filt: 350 });
      osc({ freq: 48, dur: 0.45, type: "sine", vol: 0.12, slide: -15 });
      setTimeout(() => clap(), 80);
    },
    zombie() { zombieGroan(false); },
    zombieHurt() {
      zombieGroan(false);
      osc({ freq: 220, dur: 0.09, type: "sawtooth", vol: 0.035, slide: -120, filt: 600 });
    },
    mow() {
      noise({ dur: 0.55, vol: 0.09, freq: 1400, type: "bandpass", q: 0.7 });
      osc({ freq: 160, dur: 0.5, type: "sawtooth", vol: 0.07, slide: 280, filt: 2200 });
      // rev-up funny
      for (let i = 0; i < 5; i++) {
        setTimeout(() => osc({ freq: 200 + i * 60, dur: 0.06, type: "square", vol: 0.03, filt: 1800 }), i * 70);
      }
    },
    thunder() {
      noise({ dur: 0.65, vol: 0.16, freq: 180, type: "lowpass" });
      noise({ dur: 0.3, vol: 0.09, freq: 900, type: "bandpass" });
      osc({ freq: 48, dur: 0.6, type: "sawtooth", vol: 0.1, slide: -12, filt: 160 });
    },
    win() {
      // Thingyan celebration cascade
      const notes = [S.C4, S.E4, S.G4, S.C5, S.E5, S.G5, S.C6, S.E6];
      notes.forEach((n, i) => {
        setTimeout(() => {
          saungPluck(n, 0.07, 0.4);
          if (i % 2 === 0) bell(n + 12);
          if (i === notes.length - 1) { clap(); setTimeout(clap, 80); }
        }, i * 95);
      });
    },
    lose() {
      [S.E4, S.Eb4, S.D4, S.Db4 || 61, S.C4].forEach((n, i) => {
        setTimeout(() => hneNote(n, 0.06, 0.32), i * 150);
      });
      setTimeout(() => zombieGroan(true), 250);
      setTimeout(() => zombieGroan(true), 700);
    },
    select() {
      osc({ freq: 620, dur: 0.05, type: "sine", vol: 0.04 });
      osc({ freq: 930, dur: 0.06, type: "triangle", vol: 0.025, when: 0.03 });
    },
    error() {
      osc({ freq: 150, dur: 0.1, type: "square", vol: 0.045 });
      osc({ freq: 110, dur: 0.12, type: "square", vol: 0.035, when: 0.08 });
    },
    grab() {
      osc({ freq: 380, dur: 0.07, type: "triangle", vol: 0.05, slide: 240 });
      arpeggio([S.C5, S.E5], 40, 0.03, "sine");
    },
    star() {
      arpeggio([S.G5, S.B5, S.D6 || 86, S.G6 || 91], 70, 0.05, "sine");
      setTimeout(() => bell(S.G5), 50);
    },
    wave() {
      // hne fanfare
      [S.C4, S.E4, S.G4, S.C5, S.E5].forEach((n, i) => {
        setTimeout(() => {
          hneNote(n, 0.055, 0.16);
          if (i === 4) { clap(); bell(S.C6); }
        }, i * 65);
      });
    },
    gulp() {
      osc({ freq: 95, dur: 0.1, type: "sine", vol: 0.055, slide: -35 });
      noise({ dur: 0.08, vol: 0.03, freq: 400, type: "lowpass" });
    },
    chomp() {
      noise({ dur: 0.07, vol: 0.055, freq: 650, type: "bandpass", q: 2 });
      osc({ freq: 100, dur: 0.08, type: "sawtooth", vol: 0.045, slide: -45, filt: 500 });
      // silly chew
      osc({ freq: 80, dur: 0.06, type: "square", vol: 0.025, when: 0.06, filt: 400 });
    },
    shovel() {
      noise({ dur: 0.09, vol: 0.05, freq: 2200, type: "highpass" });
      osc({ freq: 250, dur: 0.1, type: "triangle", vol: 0.045, slide: -90 });
    },
    mineArm() {
      arpeggio([S.C4, S.E4, S.G4], 50, 0.035, "square");
      osc({ freq: 440, dur: 0.12, type: "sine", vol: 0.04, when: 0.12 });
    },
    balloon() {
      osc({ freq: 280, dur: 0.18, type: "sine", vol: 0.04, slide: 100 });
      osc({ freq: 420, dur: 0.22, type: "triangle", vol: 0.03, when: 0.05, slide: 120 });
      noise({ dur: 0.1, vol: 0.02, freq: 900, type: "bandpass", when: 0.1 });
    },
    boss() {
      zombieGroan(true);
      osc({ freq: 38, dur: 0.7, type: "sawtooth", vol: 0.12, slide: -6, filt: 160 });
      noise({ dur: 0.55, vol: 0.1, freq: 140, type: "lowpass" });
      setTimeout(() => zombieGroan(true), 280);
      setTimeout(() => {
        [S.A3, S.E4, S.A4].forEach((n, i) => setTimeout(() => hneNote(n, 0.06, 0.25), i * 90));
      }, 200);
    },
    click() {
      osc({ freq: 760, dur: 0.03, type: "sine", vol: 0.035 });
      clap();
    },
  };

  // ── Public ────────────────────────────────────────────────
  function unlock() {
    ensure();
    try {
      const b = ctx.createBuffer(1, 1, 22050);
      const s = ctx.createBufferSource();
      s.buffer = b; s.connect(ctx.destination); s.start(0);
    } catch (_) {}
  }

  function setMusic(on) {
    musicOn = on;
    ensure();
    musicGain.gain.setTargetAtTime(on && enabled ? 0.9 : 0, ctx.currentTime, 0.05);
    if (on && enabled && !musicTimer) startMusic(currentTheme);
    if (!on) stopMusicTimer();
  }
  function setSfx(on) {
    sfxOn = on;
    ensure();
    sfxGain.gain.setTargetAtTime(on && enabled ? 1 : 0, ctx.currentTime, 0.02);
  }
  function toggleMute() {
    const bothOn = musicOn || sfxOn;
    if (bothOn) {
      _prevMute = { musicOn, sfxOn };
      setMusic(false); setSfx(false);
      return true;
    }
    setMusic(_prevMute.musicOn !== false);
    setSfx(_prevMute.sfxOn !== false);
    return false;
  }
  function isMuted() { return !musicOn && !sfxOn; }

  return {
    unlock, startMusic, stopMusic, setTheme,
    startGroans, stopGroans, sfx,
    setMusic, setSfx, toggleMute, isMuted,
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
  };
})();
