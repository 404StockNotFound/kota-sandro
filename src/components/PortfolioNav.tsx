'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const LINKS: [string, string][] = [
  ['tentang', 'Tentang'],
  ['proyek', 'Proyek'],
  ['skill', 'Skill'],
  ['perjalanan', 'Perjalanan'],
  ['kontak', 'Kontak'],
];

export default function PortfolioNav() {
  const [open, setOpen] = useState(false);

  // kunci scroll halaman waktu menu kebuka
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#EEF3EF]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#tentang" className="text-base font-extrabold sm:text-lg" onClick={() => setOpen(false)}>
          Laksandro <span className="text-[#E0704F]">Ramadhanu</span>
        </a>

        {/* laptop */}
        <nav className="hidden items-center gap-1 text-sm font-bold md:flex">
          {LINKS.map(([id, l]) => (
            <a key={id} href={`#${id}`} className="rounded-full px-3 py-2 hover:bg-white">{l}</a>
          ))}
          <Link href="/" className="ml-1 rounded-full bg-[#1F2A3A] px-3.5 py-2 text-white">🚚 Main di kota</Link>
        </nav>

        {/* HP */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm md:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-[#1F2A3A] transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-[#1F2A3A] transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-[#1F2A3A] transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      {/* panel menu HP */}
      {open && (
        <>
          <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="fixed inset-0 top-[68px] z-30 bg-[#1F2A3A]/30 md:hidden" />
          <nav className="absolute inset-x-3 top-[calc(100%+8px)] z-40 flex flex-col gap-1 rounded-[22px] bg-white p-3 shadow-2xl md:hidden">
            {LINKS.map(([id, l]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-bold active:bg-[#F0F3F1]"
              >
                {l} <span className="text-slate-300">→</span>
              </a>
            ))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="mt-1 flex min-h-12 items-center justify-center rounded-2xl bg-[#1F2A3A] font-extrabold text-white"
            >
              🚚 Main di Kota Sandro
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}