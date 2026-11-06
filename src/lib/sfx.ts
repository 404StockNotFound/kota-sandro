'use client';
import { useSound } from '@/store/sound';

type Engine = { o1: OscillatorNode; o2: OscillatorNode; lfo: OscillatorNode; g: GainNode };

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let eng: Engine | null = null;
let unlocked = false;

const isMuted = () => useSound.getState().muted;

function ac() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    // iPhone: tetap bunyi walau tombol silent nyala (Safari 17+)
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) { try { nav.audioSession.type = 'playback'; } catch {} }
    ctx = new C();
    // master: dikerasin + compressor biar kedengeran di speaker HP tanpa pecah
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 10;
    comp.ratio.value = 8;
    comp.attack.value = 0.003;
    comp.release.value = 0.12;
    out = ctx.createGain();
    out.gain.value = 1.8;
    out.connect(comp).connect(ctx.destination);
  }
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  return ctx;
}

/** Panggil di sentuhan/klik pertama — HP baru ngizinin suara setelah ada interaksi. */
export function unlockAudio() {
  if (unlocked || isMuted()) return;
  const a = ac();
  if (!a || !out) return;
  const s = a.createBufferSource();
  s.buffer = a.createBuffer(1, 1, 22050);
  s.connect(out);
  s.start(0);
  unlocked = true;
}

/** Getar HP (Android). iPhone belum dukung, jadi diam aja. */
export function buzz(pattern: number | number[]) {
  if (isMuted() || typeof navigator === 'undefined') return;
  try { navigator.vibrate?.(pattern); } catch {}
}

function beep(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.22, delay = 0) {
  if (isMuted()) return;
  const a = ac();
  if (!a || !out) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.setValueAtTime(vol, t + dur * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  honk(special = false) {
    // klakson truk: dua nada bareng, dibunyiin 2x
    beep(392, 0.2, 'sawtooth', 0.32); beep(494, 0.2, 'square', 0.26);
    beep(392, 0.28, 'sawtooth', 0.32, 0.26); beep(494, 0.28, 'square', 0.26, 0.26);
    if (special) { beep(587, 0.3, 'sawtooth', 0.28, 0.58); beep(740, 0.3, 'square', 0.22, 0.58); }
    buzz(special ? [70, 60, 70, 60, 90] : [70, 60, 90]);
  },
  chime() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.3, 'triangle', 0.3, i * 0.09)); buzz([40, 50, 40, 50, 120]); },
  gate() { beep(330, 0.14, 'triangle', 0.3); beep(440, 0.22, 'triangle', 0.3, 0.12); buzz(30); },
  pop() { beep(660, 0.08, 'triangle', 0.25); },
  engine(on: boolean, turbo = false) {
    const a = on && !isMuted() ? ac() : ctx;
    if (!a || !out) return;
    if (!on || isMuted()) {
      eng?.g.gain.setTargetAtTime(0.0001, a.currentTime, 0.08);
      return;
    }
    if (!eng) {
      const o1 = a.createOscillator(), o2 = a.createOscillator(), lfo = a.createOscillator();
      const f = a.createBiquadFilter(), trem = a.createGain(), lfoGain = a.createGain(), g = a.createGain();
      o1.type = 'sawtooth';
      o2.type = 'square';
      f.type = 'lowpass';
      f.frequency.value = 1100;
      f.Q.value = 1.5;
      // getaran mesin (brrrm)
      trem.gain.value = 0.75;
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain).connect(trem.gain);
      g.gain.value = 0.0001;
      o1.connect(f);
      o2.connect(f);
      f.connect(trem).connect(g).connect(out);
      o1.start(); o2.start(); lfo.start();
      eng = { o1, o2, lfo, g };
    }
    // nada dinaikin: speaker HP nggak bisa bunyiin nada terlalu rendah
    const base = turbo ? 150 : 105;
    const t = a.currentTime;
    eng.o1.frequency.setTargetAtTime(base, t, 0.12);
    eng.o2.frequency.setTargetAtTime(base * 2.02, t, 0.12);
    eng.lfo.frequency.setTargetAtTime(turbo ? 24 : 15, t, 0.12);
    eng.g.gain.setTargetAtTime(turbo ? 0.2 : 0.16, t, 0.08);
  },
};