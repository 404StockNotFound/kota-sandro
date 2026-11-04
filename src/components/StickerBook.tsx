'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PLACES } from '@/lib/places';
import { useStickers } from '@/store/stickers';
import { useHydrated } from '@/lib/useHydrated';

export default function StickerBook({ compact = false }: { compact?: boolean }) {
  const hydrated = useHydrated();
  const stored = useStickers((s) => s.got);
  const reset = useStickers((s) => s.reset);
  const got = hydrated ? stored : [];
  const [confirm, setConfirm] = useState(false);

  const onReset = () => {
    if (confirm) {
      reset();
      setConfirm(false);
    } else {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-white py-1.5 pl-2 pr-1.5 shadow-sm sm:gap-1.5 sm:pl-3.5 sm:pr-2">
        <span className="mr-1 hidden text-[13px] font-extrabold sm:inline">Stiker {got.length}/5</span>
        {PLACES.map((p, i) => {
          const done = got.includes(p.key);
          return (
            <Link
              key={p.key}
              href={p.href}
              title={`${p.name} → ${p.unlock}`}
              aria-label={`Ke ${p.name}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] text-xs font-extrabold transition-transform hover:scale-110 sm:h-[30px] sm:w-[30px] sm:rounded-[10px]"
              style={done ? { background: p.color, color: '#fff' } : { background: '#F0F3F1', color: '#8A93A3' }}
            >
              {done ? '✓' : i + 1}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <section aria-label="Buku stiker" className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-extrabold">
          Buku Stiker <span className="text-[#E0704F]">{got.length}/5</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-slate-500">
            {got.length === 5 ? 'Lengkap! Truk emas kebuka.' : 'Cari tanda ★ di atas bangunan'}
          </span>
          {got.length > 0 && (
            <button
              onClick={onReset}
              className={`min-h-9 rounded-full px-3 text-[13px] font-bold transition-colors ${
                confirm ? 'bg-[#E0704F] text-white' : 'bg-[#F0F3F1] hover:bg-[#E3E8E5]'
              }`}
            >
              {confirm ? 'Yakin? Klik lagi' : '↺ Mulai ulang'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
        {PLACES.map((p, i) => {
          const done = got.includes(p.key);
          return (
            <Link
              key={p.key}
              href={p.href}
              className="flex items-center gap-2.5 rounded-2xl border-2 p-2.5 transition-transform hover:-translate-y-0.5"
              style={
                done
                  ? { background: p.color + '22', borderColor: p.color }
                  : { background: '#F5F7F5', borderColor: '#CBD3CE', borderStyle: 'dashed' }
              }
            >
              <span
                className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl font-extrabold text-white"
                style={{ background: done ? p.color : '#D6DDD8' }}
              >
                {done ? '✓' : i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-extrabold">{p.name}</div>
                <div className="text-xs text-slate-500">→ {p.unlock}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}