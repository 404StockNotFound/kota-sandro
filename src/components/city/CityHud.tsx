'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { input } from '@/lib/input';
import { PLACES, getPlace } from '@/lib/places';
import { useStickers } from '@/store/stickers';
import { useCity } from '@/store/city';
import { sfx, unlockAudio } from '@/lib/sfx';
import Joystick from './Joystick';
import SoundToggle from '@/components/SoundToggle';
import IntroGuide from './IntroGuide';
import GuestbookModal from './GuestbookModal';
import { formatRun } from '@/lib/time';

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
  const { parked, cell, turbo, toggleTurbo, honk, doHonk, auto, setAuto, setGuestbookOpen } = useCity();
  const startedAt = useStickers((s) => s.startedAt);
  const finishedAt = useStickers((s) => s.finishedAt);
  const runTime = startedAt && finishedAt ? formatRun(finishedAt - startedAt) : null;
  const [showHonk, setShowHonk] = useState(false);
  const [picking, setPicking] = useState(false);

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
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
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
        {auto ? (
          <button
            onClick={() => { setAuto(null); setPicking(false); }}
            className="pointer-events-auto inline-flex min-w-0 items-center gap-2 rounded-full bg-[#1F2A3A] px-3.5 py-2 text-[13px] font-bold text-white shadow"
          >
            <span className="animate-pulse">🚚</span>
            <span className="truncate">Otw ke {getPlace(auto).name}…</span>
            <span className="flex-none rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-extrabold">Stop ✕</span>
          </button>
        ) : (
          <div className="pointer-events-auto relative min-w-0">
            <button
              onClick={() => setPicking((v) => !v)}
              aria-expanded={picking}
              className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-bold shadow"
            >
              <span className="inline-block flex-none text-[#E0704F]" style={{ transform: `rotate(${angle}deg)` }}>➜</span>
              <span className="truncate">{next ? `Tujuan: ${next.name}` : `Semua stiker terkumpul! 🏆${runTime ? ` · ${runTime}` : ''}`}</span>
              <span className="flex-none rounded-full bg-[#E0704F] px-2 py-0.5 text-[11px] font-extrabold text-white">
                Antar {picking ? '▲' : '▼'}
              </span>
            </button>

            {picking && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-[250px] flex-col gap-1 rounded-2xl bg-white p-2 shadow-xl">
                <span className="px-2 pb-1 pt-0.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Antar aku ke…</span>
                {PLACES.map((p) => {
                  const done = got.includes(p.key);
                  const isNext = next?.key === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => { setAuto(p.key); setPicking(false); }}
                      className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#F5F7F5] ${isNext ? 'bg-[#FDF0EA]' : ''}`}
                    >
                      <span className="h-7 w-7 flex-none rounded-lg" style={{ background: p.color }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold">{p.name}</span>
                        <span className="block truncate text-xs font-semibold text-slate-500">{p.what}</span>
                      </span>
                      <span className="flex-none text-xs font-extrabold">
                        {done ? <span className="text-[#3E9B66]">✓</span> : isNext ? <span className="text-[#E0704F]">Berikutnya</span> : <span className="text-slate-300">★</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="pointer-events-auto flex flex-none gap-2">
          <button
            onClick={() => setGuestbookOpen(true)}
            aria-label="Buka buku tamu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-lg shadow"
          >
            📜
          </button>
          <SoundToggle className="flex-none" />
        </div>
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

      {/* HP / layar sentuh: analog */}
      <div className="pointer-events-auto absolute bottom-3 left-3 hidden pointer-coarse:block">
        <Joystick onStart={unlockAudio} />
      </div>

      {/* laptop / mouse: tombol panah */}
      <div className="pointer-events-auto absolute bottom-3 left-3 grid grid-cols-2 gap-1.5 sm:bottom-4 sm:left-4 sm:gap-2 pointer-coarse:hidden" onContextMenu={(e) => e.preventDefault()}>
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

      <GuestbookModal />
      <IntroGuide />
    </div>
  );
}