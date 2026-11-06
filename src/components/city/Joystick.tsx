'use client';
import { useRef, useState } from 'react';
import { input } from '@/lib/input';

const MAX = 42;  // jarak maksimal kenop dari tengah (px)
const DEAD = 12; // geser dikit belum jalan

type Dir = [number, number];

// kota isometrik: jalannya diagonal, jadi analog dibagi 4 arah diagonal
const toDir = (x: number, y: number): Dir =>
  x < 0 ? (y < 0 ? [0, -1] : [1, 0]) : (y < 0 ? [-1, 0] : [0, 1]);

const MARKS: { label: string; dir: Dir; pos: string }[] = [
  { label: '↖', dir: [0, -1], pos: 'left-[16%] top-[16%]' },
  { label: '↗', dir: [-1, 0], pos: 'right-[16%] top-[16%]' },
  { label: '↙', dir: [1, 0], pos: 'left-[16%] bottom-[16%]' },
  { label: '↘', dir: [0, 1], pos: 'right-[16%] bottom-[16%]' },
];

export default function Joystick({ onStart }: { onStart?: () => void }) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<{ x: number; y: number; active: boolean; dir: Dir | null }>({ x: 0, y: 0, active: false, dir: null });

  const move = (clientX: number, clientY: number) => {
    const r = base.current?.getBoundingClientRect();
    if (!r) return;
    let x = clientX - (r.left + r.width / 2);
    let y = clientY - (r.top + r.height / 2);
    const d = Math.hypot(x, y);
    if (d > MAX) { x = (x / d) * MAX; y = (y / d) * MAX; }
    const dir = d < DEAD ? null : toDir(x, y);
    input.dir = dir;
    setKnob({ x, y, active: true, dir });
  };

  const end = () => {
    input.dir = null;
    setKnob({ x: 0, y: 0, active: false, dir: null });
  };

  return (
    <div
      ref={base}
      role="application"
      aria-label="Analog: geser buat nyetir truk"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onStart?.(); move(e.clientX, e.clientY); }}
      onPointerMove={(e) => { if (knob.active) move(e.clientX, e.clientY); }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
      onContextMenu={(e) => e.preventDefault()}
      className="relative h-[136px] w-[136px] touch-none rounded-full bg-white/85 shadow-[inset_0_2px_12px_rgba(31,42,58,.14),0_8px_20px_rgba(31,42,58,.2)] backdrop-blur-sm"
    >
      <span aria-hidden className="absolute inset-[18px] rounded-full border-2 border-dashed border-[#DDE3DF]" />
      {MARKS.map((m) => {
        const on = knob.dir?.[0] === m.dir[0] && knob.dir?.[1] === m.dir[1];
        return (
          <span
            key={m.label}
            aria-hidden
            className={`absolute ${m.pos} text-[15px] font-extrabold transition-colors ${on ? 'text-[#E0704F]' : 'text-slate-300'}`}
          >
            {m.label}
          </span>
        );
      })}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#1F2A3A] shadow-[0_6px_14px_rgba(31,42,58,.35)]"
        style={{
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px)) scale(${knob.active ? 0.94 : 1})`,
          transition: knob.active ? 'none' : 'transform .18s ease-out',
        }}
      >
        <span className="h-5 w-5 rounded-full bg-white/20" />
      </span>
    </div>
  );
}