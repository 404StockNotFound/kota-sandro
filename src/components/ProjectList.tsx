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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
      {PROJECTS.map((p, i) => {
        const lit = matched.includes(i);
        return (
          <article
            key={p.name}
            className="flex flex-col gap-2 rounded-[20px] bg-white p-4 transition-shadow duration-300"
            style={{ boxShadow: lit ? `0 0 0 3px ${p.color}, 0 12px 30px rgba(31,42,58,.1)` : '0 8px 24px rgba(31,42,58,.06)' }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-extrabold text-white" style={{ background: p.color }}>
                {p.short}
              </span>
              <span className={`text-xs font-extrabold ${p.live ? 'text-[#3E9B66]' : 'text-slate-400'}`}>
                {p.live ? '● Live' : '○ Dibangun'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold">{p.name}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{p.desc}</p>
            {detail ? (
              <ul className="list-disc pl-[18px] text-[13px] leading-relaxed text-slate-600">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            ) : (
              <span className="text-xs font-bold text-slate-400">Detail lengkap kebuka setelah dapat stiker Gudang</span>
            )}
            <div className="mt-auto flex items-center justify-between gap-2 text-xs text-slate-400">
              <span>{p.stack}</span>
              {p.link && <a href={p.link} target="_blank" className="font-bold text-[#6E64C9]">Kunjungi ↗</a>}
            </div>
          </article>
        );
      })}
    </div>
  );
}