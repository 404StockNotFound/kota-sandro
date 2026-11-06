'use client';
import { JOURNEY, type MilestoneKind } from '@/lib/content';
import { useTol } from '@/store/tol';
import { useHydrated } from '@/lib/useHydrated';

const KIND: Record<MilestoneKind, { label: string; color: string; soft: string; ink: string }> = {
  kerja:   { label: 'Kerja',   color: '#4C7FD9', soft: '#E6EEFB', ink: '#2E5DB3' },
  belajar: { label: 'Belajar', color: '#F4C25B', soft: '#FDF0D2', ink: '#8A6414' },
  proyek:  { label: 'Proyek',  color: '#A9A2E8', soft: '#EEECFB', ink: '#5A50B5' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const toIndex = (s: string) => {
  if (s === 'Sekarang') {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  }
  const [m, y] = s.split(' ');
  return Number(y) * 12 + MONTHS.indexOf(m);
};

// gaya LinkedIn: bulan awal & akhir ikut dihitung
const duration = (start: string, end: string) => {
  const total = toIndex(end) - toIndex(start) + 1;
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y && `${y} thn`, m && `${m} bln`].filter(Boolean).join(' ');
};

export default function JourneyList({ showAll = false }: { showAll?: boolean }) {
  const hydrated = useHydrated();
  const tolStage = useTol((s) => s.stage);
  const stage = showAll ? 99 : tolStage;
  // 3 gerbang tol → timeline nyala bertahap sampai penuh
  const litCount = stage >= 3 ? JOURNEY.length : Math.ceil(((stage + 1) / 4) * JOURNEY.length);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap gap-2">
        {Object.values(KIND).map((k) => (
          <span key={k.label} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold" style={{ background: k.soft, color: k.ink }}>
            <span className="h-2 w-2 rounded-full" style={{ background: k.color }} /> {k.label}
          </span>
        ))}
      </div>

      <ol>
        {JOURNEY.map((e, i) => {
          const k = KIND[e.kind];
          const lit = i < litCount;
          const last = i === JOURNEY.length - 1;
          const [month, year] = e.start.split(' ');
          const now = e.end === 'Sekarang';
          return (
            <li key={e.start + e.title} className="grid grid-cols-[48px_22px_minmax(0,1fr)] gap-x-3 sm:grid-cols-[64px_22px_minmax(0,1fr)]">
              <div className={`flex flex-col pt-px leading-none transition-colors ${lit ? '' : 'opacity-40'}`}>
                <span className="text-[17px] font-extrabold tracking-tight sm:text-[19px]">{year}</span>
                <span className="mt-1 text-xs font-bold text-slate-400">{month}</span>
              </div>

              <span aria-hidden className="flex flex-col items-center">
                <span
                  className="mt-[3px] h-3.5 w-3.5 flex-none rounded-full transition-all duration-500"
                  style={lit ? { background: k.color, boxShadow: `0 0 0 4px ${k.soft}` } : { background: '#E3E8E5' }}
                />
                {!last && <span className="mt-1 w-0.5 flex-1 rounded bg-[#EEF1EF]" />}
              </span>

              <div className={`flex min-w-0 flex-col gap-1.5 transition-opacity duration-500 ${last ? 'pb-1' : 'pb-7'} ${lit ? 'opacity-100' : 'opacity-40'}`}>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide" style={{ background: k.soft, color: k.ink }}>
                    {k.label}
                  </span>
                  {now && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F4E8] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[#2F7A50]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3E9B66]" /> Sekarang
                    </span>
                  )}
                </div>

                <span className="text-[17px] font-extrabold leading-snug">{e.title}</span>

                {(e.org || e.end) && (
                  <span className="text-[13px] font-semibold text-slate-500">
                    {e.org}
                    {e.org && e.end && <span className="mx-1.5 text-slate-300">·</span>}
                    {e.end && (
                      <>
                        {e.start} – {e.end}
                        {(e.end !== 'Sekarang' || hydrated) && (
                          <>
                            <span className="mx-1.5 text-slate-300">·</span>
                            {duration(e.start, e.end)}
                          </>
                        )}
                      </>
                    )}
                  </span>
                )}

                <span className="text-sm leading-relaxed text-slate-600">{e.body}</span>

                {e.link && (
                  <a
                    href={e.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-extrabold transition-colors hover:brightness-95"
                    style={{ background: k.soft, color: k.ink }}
                  >
                    🎓 {e.link.label} ↗
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}