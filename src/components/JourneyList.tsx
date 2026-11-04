'use client';
import { JOURNEY } from '@/lib/content';
import { useTol } from '@/store/tol';

export default function JourneyList({ showAll = false }: { showAll?: boolean }) {
  const tolStage = useTol((s) => s.stage);
  const stage = showAll ? 99 : tolStage;
  return (
    <ol className="rounded-[22px] bg-white p-5 shadow-sm">
      {JOURNEY.map((e, i) => {
        const litCount = stage >= 3 ? JOURNEY.length : 1 + stage * 2;
        const lit = i < litCount;
        return (
          <li key={e.title} className="grid grid-cols-[84px_22px_minmax(0,1fr)] gap-3">
            <span className={`text-[15px] font-extrabold transition-colors ${lit ? 'text-[#B8861F]' : 'text-slate-300'}`}>{e.year}</span>
            <span aria-hidden className="flex flex-col items-center">
              <span
                className="mt-[3px] h-3.5 w-3.5 rounded-full transition-all duration-500"
                style={lit ? { background: '#F4C25B', boxShadow: '0 0 0 4px #FDF0D2' } : { background: '#E3E8E5' }}
              />
              <span className="w-0.5 flex-1 bg-[#F0F3F1]" />
            </span>
            <div className={`flex flex-col gap-1 pb-[22px] transition-opacity ${lit ? 'opacity-100' : 'opacity-50'}`}>
              <span className="text-[17px] font-extrabold">{e.title}</span>
              <span className="text-sm leading-relaxed text-slate-500">{e.body}</span>
              {e.link && (
                <a
                  href={e.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FDF0D2] px-3 py-1.5 text-[13px] font-extrabold text-[#8A6414] hover:bg-[#F9E3AE]"
                >
                  🎓 {e.link.label} ↗
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}