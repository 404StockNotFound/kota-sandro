import Link from 'next/link';
import CityLoader from '@/components/city/CityLoader';
import StickerBook from '@/components/StickerBook';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4">
        <span className="text-xl font-extrabold">Kota <span className="text-[#E0704F]">Sandro</span></span>
        <Link href="/portfolio" className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-bold shadow-sm">
          Lihat portfolio tanpa main →
        </Link>
      </header>

      <section className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 sm:px-6 pb-4">
        <p className="text-[13px] font-bold tracking-wide text-slate-500">LAKSANDRO RAMADHANU · PRODUCT DEVELOPER</p>
        <h1 className="text-[clamp(34px,5vw,56px)] font-extrabold leading-[1.02] tracking-tight">Selamat datang di kotaku.</h1>
        <p className="max-w-[640px] text-[17px] text-slate-600">
          Setir truknya, mampir ke 5 tempat, dan kumpulin stikernya. Tiap stiker membuka fitur baru.
        </p>
      </section>

      <section className="mx-auto flex max-w-[1320px] flex-col gap-3.5 px-4 sm:px-6 pb-6">
        <CityLoader />
        <StickerBook />
      </section>
    </div>
  );
}