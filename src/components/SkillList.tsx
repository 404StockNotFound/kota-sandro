'use client';
import { SKILLS, SKILL_GROUPS } from '@/lib/content';
import { useBensin } from '@/store/bensin';

const PUMP_NAMES = SKILLS.filter((s) => s.pump).map((s) => s.name);

export default function SkillList() {
  const full = useBensin((s) => s.full);
  const filled = full.map((i) => PUMP_NAMES[i]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
      {SKILL_GROUPS.map((g) => (
        <div key={g.title} className="flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded" style={{ background: g.color }} />
            <span className="font-extrabold">{g.title}</span>
            <span className="ml-auto text-xs font-bold text-slate-400">{g.items.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((it) => {
              const ok = filled.includes(it);
              return (
                <span
                  key={it}
                  className="rounded-full px-2.5 py-1 text-[13px] font-semibold transition-colors"
                  style={ok ? { background: '#E3F4E8', color: '#2F7A50' } : { background: '#F3F5F4', color: '#3D4759' }}
                >
                  {ok && '⛽ '}{it}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}