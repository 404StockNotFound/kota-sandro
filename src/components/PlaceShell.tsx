import Link from 'next/link';
import StickerBook from './StickerBook';
import StickerToast from './StickerToast';
import SoundToggle from './SoundToggle';
import { getPlace, PLACES, type PlaceKey } from '@/lib/places';

type Props = { place: PlaceKey; title: string; content: React.ReactNode; game: React.ReactNode; gameFirst?: boolean };

export default function PlaceShell({ place, title, content, game, gameFirst = false }: Props) {
  const p = getPlace(place);
  const idx = PLACES.findIndex((x) => x.key === place);
  const prev = PLACES[idx - 1];
  const next = PLACES[idx + 1];
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-[1320px] items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" aria-label="Balik ke kota" className="inline-flex min-h-11 flex-none items-center rounded-full bg-[#1F2A3A] px-4 text-sm font-bold text-white">
          ←<span className="ml-1 hidden sm:inline">Balik ke kota</span><span className="ml-1 sm:hidden">Kota</span>
        </Link>
        <div className="flex items-center gap-2">
          <StickerBook compact />
          <SoundToggle />
        </div>
      </header>

      <div className="px-4 sm:px-6"><StickerToast /></div>

      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 pb-4 pt-1 sm:px-6">
        <span className="h-12 w-12 flex-none rounded-2xl" style={{ background: p.color }} />
        <div>
          <div className="text-[13px] font-bold uppercase text-slate-500">{p.name} · {p.what}</div>
          <h1 className="text-[clamp(26px,4vw,40px)] font-extrabold leading-tight tracking-tight">{title}</h1>
        </div>
      </div>

      <main className="mx-auto flex max-w-[1320px] flex-wrap items-start gap-5 px-4 pb-8 sm:px-6 sm:pb-10">
        <section className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
          {content}
        </section>

        <aside aria-label="Mini game" className={`flex w-full min-w-0 flex-[1_1_380px] flex-col gap-3.5 rounded-3xl bg-white p-4 shadow-sm sm:p-5 ${gameFirst ? 'order-first md:order-none' : ''}`}>
          <div className="flex items-center justify-between gap-2 text-xs font-extrabold tracking-wide">
            <span className="text-slate-500">MINI GAME · DAPAT STIKER</span>
            <span style={{ color: p.color }}>hadiah: {p.unlock}</span>
          </div>
          {game}
        </aside>
      </main>

      <nav aria-label="Pindah tempat" className="mx-auto flex max-w-[1320px] justify-between gap-2 px-4 pb-8 sm:px-6 sm:pb-10">
        {prev ? (
          <Link href={prev.href} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-4 font-bold shadow-sm">
            ← <span className="h-3 w-3 rounded" style={{ background: prev.color }} /> {prev.name}
          </Link>
        ) : (
          <Link href="/" className="inline-flex min-h-12 items-center rounded-2xl bg-white px-4 font-bold shadow-sm">← Peta kota</Link>
        )}
        {next ? (
          <Link href={next.href} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#1F2A3A] px-4 font-bold text-white">
            <span className="h-3 w-3 rounded" style={{ background: next.color }} /> {next.name} →
          </Link>
        ) : (
          <Link href="/" className="inline-flex min-h-12 items-center rounded-2xl bg-[#1F2A3A] px-4 font-bold text-white">Peta kota →</Link>
        )}
      </nav>
    </div>
  );
}