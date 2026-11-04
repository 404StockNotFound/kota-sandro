import Link from 'next/link';
import Image from 'next/image';
import { ABOUT } from '@/lib/content';

export default function AboutCard() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {/* kartu utama */}
      <div className="flex w-full min-w-0 flex-col gap-6 rounded-[24px] bg-white p-4 shadow-sm sm:flex-row sm:rounded-[26px] sm:p-6">
        {/* foto — gaya polaroid */}
        <div className="relative mx-auto w-full max-w-[200px] flex-none pt-2 sm:mx-0">
          <div className="-rotate-3 rounded-[10px] bg-white p-2.5 pb-9 shadow-[0_10px_30px_rgba(31,42,58,.15)] transition-transform duration-300 hover:rotate-0">
            <Image
              src="/foto-sandro.jpg"
              alt="Foto Laksandro Ramadhanu"
              width={800}
              height={1000}
              priority
              className="aspect-square w-full rounded-[6px] object-cover object-[50%_30%] brightness-110 contrast-[0.95] saturate-[1.05]"
            />
            <span className="absolute bottom-3.5 left-0 right-0 text-center text-[13px] font-bold text-slate-500">Sandro · dev 🚚</span>
          </div>
          <span className="absolute -right-2 top-0 rotate-12 rounded-full bg-[#F4C25B] px-2.5 py-1 text-xs font-extrabold shadow-md">
            👋 Halo!
          </span>
          <span className="mt-4 flex justify-center">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#1F2A3A] px-3 py-1.5 text-xs font-extrabold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#7CC28C]" /> Terbuka untuk proyek
            </span>
          </span>
        </div>

        {/* teks */}
        <div className="mt-2 flex min-w-0 flex-1 flex-col gap-4 sm:mt-0">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-extrabold text-[#C9603F]">Laksandro Ramadhanu<span className="hidden sm:inline"> · </span><br className="sm:hidden" />Product Developer</span>
            <h3 className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight">{ABOUT.headline}</h3>
          </div>
          <p className="leading-relaxed text-slate-600">{ABOUT.lead}</p>

          <div className="grid grid-cols-3 gap-2">
            {ABOUT.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-[#F5F7F5] px-3 py-3">
                <div className="text-[22px] font-extrabold leading-none tracking-tight">{s.value}</div>
                <div className="mt-1 text-xs font-semibold leading-tight text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            <a href="/cv-laksandro.pdf" download="CV_Laksandro_Ramadhanu.pdf" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1F2A3A] px-4 font-bold text-white transition-transform hover:-translate-y-0.5">
              ↓ Download CV
            </a>
            <Link href="/kantor-pos" className="inline-flex min-h-11 items-center rounded-xl bg-[#F0F3F1] px-4 font-bold transition-transform hover:-translate-y-0.5">
              Ajak ngobrol →
            </Link>
          </div>
        </div>
      </div>

      {/* kenapa aku */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        {ABOUT.highlights.map((h) => (
          <div key={h.title} className="flex flex-col gap-2 rounded-[20px] bg-white p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F7F5] text-xl">{h.icon}</span>
            <span className="font-extrabold">{h.title}</span>
            <span className="text-sm leading-relaxed text-slate-500">{h.body}</span>
          </div>
        ))}
      </div>

      {/* info singkat */}
      <dl className="flex flex-wrap gap-x-6 gap-y-2 rounded-[18px] bg-white/60 px-5 py-3 text-sm">
        {ABOUT.facts.map((f) => (
          <div key={f.label} className="flex gap-1.5">
            <dt className="font-semibold text-slate-400">{f.label}:</dt>
            <dd className="font-bold">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}