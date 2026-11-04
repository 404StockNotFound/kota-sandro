'use client';
import { useEffect, useState } from 'react';

const LINES = ['Lagi ngaspal jalan…', 'Nanem pohon dulu…', 'Ngecat bangunan…', 'Manasin mesin truk…', 'Nempel stiker di buku…'];

export default function CityLoading({ fading = false }: { fading?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % LINES.length), 900); return () => clearInterval(t); }, []);

  return (
    <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#CDEAF3] to-[#EEF3EF] transition-opacity duration-500 ${fading ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
      <div className="relative h-24 w-[min(320px,80%)] overflow-hidden">
        <div className="absolute inset-x-0 bottom-3 h-8 rounded-lg bg-[#9AA3B2]">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 [background:repeating-linear-gradient(90deg,#F3F1E6_0_18px,transparent_18px_36px)] [animation:road_0.6s_linear_infinite]" />
        </div>
        <svg viewBox="0 0 80 44" className="absolute bottom-7 left-1/2 w-24 -translate-x-1/2 [animation:bob_0.5s_ease-in-out_infinite]">
          <rect x="2" y="6" width="46" height="28" rx="5" fill="#FFFFFF" />
          <path d="M48 14h14l14 14v6H48z" fill="#E0704F" />
          <rect x="54" y="17" width="9" height="7" rx="1.5" fill="#BDE7FF" />
          <circle cx="16" cy="36" r="6" fill="#2B3240" /><circle cx="62" cy="36" r="6" fill="#2B3240" />
        </svg>
      </div>
      <p className="font-extrabold text-[#1F2A3A]">{LINES[i]}</p>
    </div>
  );
}