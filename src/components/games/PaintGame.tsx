'use client';
import { useState } from 'react';
import { useStickers } from '@/store/stickers';
import { useHydrated } from '@/lib/useHydrated';

const COLORS = [
  { name: 'Merah', hex: '#F07C8C' },
  { name: 'Biru', hex: '#4C7FD9' },
  { name: 'Kuning', hex: '#F4C25B' },
  { name: 'Hijau', hex: '#7CC28C' },
  { name: 'Ungu', hex: '#A9A2E8' },
  { name: 'Putih', hex: '#FFFFFF' },
];
const ORDER = { cab: '#4C7FD9', box: '#F4C25B' };

export default function PaintGame() {
  const hydrated = useHydrated();
  const { collect, truckColor, cabColor, setTruckColor, setCabColor } = useStickers();
  const [part, setPart] = useState<'cab' | 'box'>('cab');

  const cab = hydrated ? cabColor : '#E0704F';
  const box = hydrated ? truckColor : '#FFFFFF';
  const done = cab === ORDER.cab && box === ORDER.box;

  const apply = (hex: string) => {
    const nextCab = part === 'cab' ? hex : cab;
    const nextBox = part === 'box' ? hex : box;
    if (part === 'cab') setCabColor(hex); else setTruckColor(hex);
    if (nextCab === ORDER.cab && nextBox === ORDER.box) collect('garasi');
  };

  return (
    <>
      <p>
        Pesanan cat: kabin <b className="text-[#4C7FD9]">BIRU</b>, bak <b className="text-[#D9A23B]">KUNING</b>.
        <span className="block text-sm text-slate-500">Warnanya langsung kepakai di truk kamu di kota.</span>
      </p>
      <div className="rounded-[18px] bg-[#F3F6F4] px-2.5 pb-1.5 pt-3.5">
        <svg role="img" aria-label="Truk di garasi" viewBox="0 0 520 230" className="block h-auto w-full">
          <ellipse cx="260" cy="214" rx="230" ry="10" fill="#DDE4DF" />
          <rect x="30" y="40" width="300" height="146" rx="18" fill={box} stroke="#E3E8E5" strokeWidth="3" style={{ transition: 'fill .3s' }} />
          <text x="180" y="122" textAnchor="middle" fontWeight="800" fontSize="28" fill="#1F2A3A" opacity=".55">KOTA SANDRO</text>
          <path d="M338 82h80q12 0 20 9l46 52q6 7 6 16v27H338z" fill={cab} style={{ transition: 'fill .3s' }} />
          <path d="M356 98h60l38 42h-98z" fill="#FFFFFF" opacity=".7" />
          <circle cx="112" cy="194" r="26" fill="#3D4759" /><circle cx="112" cy="194" r="10" fill="#C9D2CC" />
          <circle cx="414" cy="194" r="26" fill="#3D4759" /><circle cx="414" cy="194" r="10" fill="#C9D2CC" />
        </svg>
      </div>
      <div role="group" aria-label="Bagian" className="flex gap-2">
        {(['cab', 'box'] as const).map((k) => (
          <button
            key={k}
            aria-pressed={part === k}
            onClick={() => setPart(k)}
            className={`min-h-12 flex-1 rounded-[14px] font-extrabold ${part === k ? 'bg-[#1F2A3A] text-white' : 'bg-[#F0F3F1]'}`}
          >
            {k === 'cab' ? 'Kabin' : 'Bak'}
          </button>
        ))}
      </div>
      <div role="group" aria-label="Warna" className="flex flex-wrap gap-2.5">
        {COLORS.map((c) => (
          <button
            key={c.hex}
            aria-label={c.name}
            onClick={() => apply(c.hex)}
            className="h-[52px] w-[52px] rounded-full border-4 border-white shadow-[0_0_0_2px_#E3E8E5,0_4px_10px_rgba(31,42,58,.12)]"
            style={{ background: c.hex }}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-slate-500">
        {done ? 'Pesanan beres! Stiker masuk buku.' : 'Pilih bagian, terus warnanya. Cocokin sama pesanan.'}
      </span>
    </>
  );
}