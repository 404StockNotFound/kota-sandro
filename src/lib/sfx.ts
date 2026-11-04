'use client';
import { useSound } from '@/store/sound';

let ctx: AudioContext | null = null;
let eng: { o: OscillatorNode; g: GainNode } | null = null;

const isMuted = () => useSound.getState().muted;

function ac() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function beep(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.07, delay = 0) {
  if (isMuted()) return;
  const a = ac(); if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

export const sfx = {
  honk(special = false) {
    beep(392, 0.18); beep(494, 0.18);
    beep(392, 0.22, 'square', 0.07, 0.24); beep(494, 0.22, 'square', 0.07, 0.24);
    if (special) { beep(587, 0.25, 'square', 0.06, 0.5); beep(740, 0.25, 'square', 0.06, 0.5); }
  },
  chime() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.25, 'sine', 0.09, i * 0.09)); },
  gate() { beep(330, 0.12, 'triangle', 0.07); beep(440, 0.2, 'triangle', 0.07, 0.12); },
  pop() { beep(660, 0.07, 'triangle', 0.05); },
  engine(on: boolean, turbo = false) {
    const a = on && !isMuted() ? ac() : ctx;
    if (!a) return;
    if (!on || isMuted()) { eng?.g.gain.setTargetAtTime(0.0001, a.currentTime, 0.08); return; }
    if (!eng) {
      const o = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain();
      o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 380; g.gain.value = 0.0001;
      o.connect(f).connect(g).connect(a.destination); o.start();
      eng = { o, g };
    }
    eng.o.frequency.setTargetAtTime(turbo ? 95 : 62, a.currentTime, 0.1);
    eng.g.gain.setTargetAtTime(0.04, a.currentTime, 0.08);
  },
};