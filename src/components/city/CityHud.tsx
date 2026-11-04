'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { input } from '@/lib/input';
import { PLACES, getPlace } from '@/lib/places';
import { useStickers } from '@/store/stickers';
import { useCity } from '@/store/city';
import { sfx } from '@/lib/sfx';
import SoundToggle from '@/components/SoundToggle';
import IntroGuide from './IntroGuide';

const KEYS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0], w: [-1, 0], W: [-1, 0],
  ArrowDown: [1, 0], s: [1, 0], S: [1, 0],
  ArrowLeft: [0, -1], a: [0, -1], A: [0, -1],
  ArrowRight: [0, 1], d: [0, 1], D: [0, 1],
};

const PADS: { label: string; aria: string; dir: [number, number] }[] = [
  { label: '↖', aria: 'Kiri atas', dir: [0, -1] },
  { label: '↗', aria: 'Kanan atas', dir: [-1, 0] },
  { label: '↙', aria: 'Kiri bawah', dir: [1, 0] },
  { label: '↘', aria: 'Kanan bawah', dir: [0, 1] },
];

export default function CityHud() {
  const got = useStickers((s) => s.got);
  const { parked, cell, turbo, toggleTurbo, honk, doHonk } = useCity();
  const [showHonk, setShowHonk] = useState(false);

  const night = got.includes('pos');
  const hasTurbo = got.includes('bensin');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const d = KEYS[e.key];
      if (d) { e.preventDefault(); input.dir = d; return; }
      if (e.code === 'Space' && !e.repeat) { e.preventDefault(); doHonk(); sfx.honk(night); }
    };
    const up = (e: KeyboardEvent) => { if (KEYS[e.key]) input.dir = null; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      input.dir = null;
      sfx.engine(false);
    };
  }, [doHonk, night]);

  useEffect(() => {
    if (!honk) return;
    setShowHonk(true);
    const t = setTimeout(() => setShowHonk(false), 900);
    return () => clearTimeout(t);
  }, [honk]);

  const onHonk = () => { doHonk(); sfx.honk(night); };
  const onTurbo = () => { toggleTurbo(); if (input.dir) sfx.engine(true, !turbo); };
  const press = (dir: [number, number]) => { input.dir = dir; };
  const release = () => { input.dir = null; };

  const next = PLACES.find((p) => !got.includes(p.key));
  let angle = 0;
  if (next) {
    const [pr, pc] = next.parking, [r, c] = cell;
    const dx = (pc - c) - (pr - r);
    const dy = ((pc + pr) - (c + r)) / 2;
    angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  }
  const place = parked ? getPlace(parked) : null;

  return (
    <div className="pointer-events-none absolute inset-0 select-none text-[#1F2A3A]">
      <div className="flex items-start justify-between gap-2 p-3.5">
        <span className="pointer-events-auto inline-flex min-w-0 items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-bold shadow">
          <span className="inline-block flex-none text-[#E0704F]" style={{ transform: `rotate(${angle}deg)` }}>➜</span>
          <span className="truncate">{next ? `Tujuan berikutnya: ${next.name}` : 'Semua stiker terkumpul! 🏆'}</span>
        </span>
        <SoundToggle className="pointer-events-auto flex-none" />
      </div>

      {showHonk && (
        <span className="absolute left-1/2 top-[22%] -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xl font-extrabold shadow-lg">
          {night ? 'TIN TIN TIIIN ✨' : 'TIN TIIIN!'}
        </span>
      )}

      {place && (
        <div className="pointer-events-auto absolute bottom-[150px] left-1/2 flex w-[min(380px,calc(100%-28px))] -translate-x-1/2 items-center gap-3 rounded-[20px] bg-white px-4 py-3.5 shadow-xl [animation:bob_2s_ease-in-out_infinite] sm:bottom-[112px]">
          <span className="h-11 w-11 flex-none rounded-[14px]" style={{ background: place.color }} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-extrabold">{place.name}</div>
            <div className="text-[13px] text-slate-500">
              {place.what} · {got.includes(place.key) ? 'stiker ✓' : 'ada stiker ★'}
            </div>
          </div>
          <Link
            href={place.href}
            onClick={() => { input.dir = null; sfx.engine(false); }}
            className="inline-flex min-h-[46px] flex-none items-center rounded-[14px] bg-[#1F2A3A] px-4 font-extrabold text-white"
          >
            Masuk
          </Link>
        </div>
      )}

      <div className="pointer-events-auto absolute bottom-3 left-3 grid grid-cols-2 gap-1.5 sm:bottom-4 sm:left-4 sm:gap-2" onContextMenu={(e) => e.preventDefault()}>
        {PADS.map((p) => (
          <button
            key={p.aria}
            aria-label={p.aria}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(p.dir); }}
            onPointerUp={release}
            onPointerCancel={release}
            onLostPointerCapture={release}
            className="h-[54px] w-[54px] touch-none rounded-2xl bg-white/95 text-[20px] font-extrabold shadow-[0_4px_0_#C9D2CC] active:translate-y-[2px] active:shadow-[0_2px_0_#C9D2CC] sm:h-[58px] sm:w-[58px] sm:text-[22px]"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="pointer-events-auto absolute bottom-3 right-3 flex items-end gap-2 sm:bottom-4 sm:right-4 sm:gap-2.5">
        {hasTurbo && (
          <button
            onClick={onTurbo}
            aria-pressed={turbo}
            className={`min-h-[52px] rounded-2xl px-4 font-extrabold transition-colors ${
              turbo ? 'bg-[#F07C8C] text-white shadow-[0_4px_0_#C95E6C]' : 'bg-white text-[#F07C8C] shadow-[0_4px_0_#C9D2CC]'
            }`}
          >
            {turbo ? 'TURBO ON' : 'TURBO'}
          </button>
        )}
        <button
          onClick={onHonk}
          aria-label="Klakson"
          className="h-16 w-16 rounded-full bg-[#E0704F] text-[13px] font-extrabold text-white shadow-[0_5px_0_#B9553A] active:translate-y-[2px] active:shadow-[0_3px_0_#B9553A] sm:h-[72px] sm:w-[72px]"
        >
          {night ? 'TIN!!' : 'TIN'}
        </button>
      </div>

      <IntroGuide />
    </div>
  );
}