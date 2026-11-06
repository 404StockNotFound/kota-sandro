'use client';
import { PROJECTS } from '@/lib/content';
import { useStickers } from '@/store/stickers';
import { useGudang } from '@/store/gudang';
import { useHydrated } from '@/lib/useHydrated';

export default function ProjectList({ showAll = false }: { showAll?: boolean }) {
  const hydrated = useHydrated();
  const has = useStickers((s) => s.got.includes('gudang'));
  const matched = useGudang((s) => s.matched);
  const detail = showAll || (hydrated && has);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
      {PROJECTS.map((p, i) => {
        const lit = matched.includes(i);
        return (
          <article
            key={p.name}
            className="relative flex flex-col gap-3 overflow-hidden rounded-[22px] bg-white p-5 pt-6 transition-all duration-300 hover:-translate-y-0.5"
            style={{ boxShadow: lit ? `0 0 0 3px ${p.color}, 0 12px 30px rgba(31,42,58,.1)` : '0 8px 24px rgba(31,42,58,.06)' }}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: p.color }} />

            <div className="flex items-start justify-between gap-2">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-extrabold text-white shadow-sm"
                style={{ background: p.color }}
              >
                {p.short}
              </span>
              {p.live ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3F4E8] px-2.5 py-1 text-xs font-extrabold text-[#2F7A50]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3E9B66]" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF0D2] px-2.5 py-1 text-xs font-extrabold text-[#8A6414]">
                  🔨 Lagi dibangun
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-extrabold tracking-tight">{p.name}</h2>
              <p className="text-sm leading-relaxed text-slate-600">{p.desc}</p>
            </div>

            {detail ? (
              <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-slate-600">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span aria-hidden className="mt-[5px] h-1.5 w-1.5 flex-none rounded-full" style={{ background: p.color }} />
                    {pt}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="rounded-xl bg-[#F5F7F5] px-3 py-2 text-xs font-bold text-slate-400">
                🔒 Detail kebuka setelah dapat stiker Gudang
              </span>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-[#F0F3F1] pt-3">
              {p.stack.split('·').map((t) => (
                <span key={t} className="rounded-full bg-[#F3F5F4] px-2 py-0.5 text-[11px] font-bold text-slate-500">
                  {t.trim()}
                </span>
              ))}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center rounded-full bg-[#1F2A3A] px-3 py-1 text-xs font-extrabold text-white transition-transform hover:-translate-y-0.5"
                >
                  Kunjungi ↗
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}