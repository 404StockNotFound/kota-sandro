'use client';
import { useEffect, useRef, useState } from 'react';
import { SKILLS } from '@/lib/content';
import { useStickers } from '@/store/stickers';
import { useBensin } from '@/store/bensin';

const PUMPS = SKILLS.filter((s) => s.pump);
const ZONE = [70, 90]; // zona hijau (%)

export default function FuelGame() {
  const collect = useStickers((s) => s.collect);
  const { full, fill, reset } = useBensin();
  const [level, setLevel] = useState([0, 0, 0, 0]);
  const [active, setActive] = useState(-1);
  const [msg, setMsg] = useState({ text: 'Siap isi!', bad: false });
  const raf = useRef<number>(0);

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => { if (full.length === PUMPS.length) collect('bensin'); }, [full, collect]);

  // naikin bensin selama pompa aktif
  useEffect(() => {
    if (active < 0) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      setLevel((lv) => {
        const next = [...lv];
        next[active] += dt * 40; // 40% per detik
        if (next[active] >= 100) {
          next[active] = 0;
          setActive(-1);
          setMsg({ text: 'Yah, tumpah! Coba lagi.', bad: true });
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const press = (i: number) => {
    if (active === i) {
      setActive(-1);
      const v = level[i];
      if (v >= ZONE[0] && v <= ZONE[1]) { fill(i); setMsg({ text: `Pas! ${PUMPS[i].name} penuh.`, bad: false }); }
      else setMsg({ text: 'Masih kurang, isi lagi.', bad: true });
    } else {
      setActive(i);
      setMsg({ text: 'Lagi diisi…', bad: false });
    }
  };

  return (
    <>
      <p>Pencet <b>Isi</b>, terus <b>Stop</b> pas bensinnya masuk zona hijau.</p>
      <div className="grid grid-cols-4 gap-2.5">
        {PUMPS.map((p, i) => {
          const ok = full.includes(i), run = active === i;
          return (
            <div key={p.name} className="flex flex-col items-center gap-2">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-[#F0F3F1]">
                <div
                  className="absolute inset-x-0 box-border border-y-2 border-dashed border-[#3E9B66] bg-[#7CC28C]/35"
                  style={{ bottom: `${ZONE[0]}%`, height: `${ZONE[1] - ZONE[0]}%` }}
                />
                <div className="absolute inset-x-0 bottom-0" style={{ height: `${level[i]}%`, background: ok ? '#7CC28C' : '#F07C8C' }} />
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">{p.short}</span>
              <button
                onClick={() => press(i)}
                disabled={ok || (active >= 0 && !run)}
                className={`min-h-[46px] w-full rounded-[14px] font-extrabold disabled:opacity-50 ${ok ? 'bg-[#E3F4E8] text-[#2F7A50]' : run ? 'bg-[#F07C8C] text-white' : 'bg-[#1F2A3A] text-white'}`}
              >
                {ok ? '✓' : run ? 'Stop' : 'Isi'}
              </button>
            </div>
          );
        })}
      </div>
      <span className={`text-sm font-bold ${msg.bad ? 'text-[#C9475A]' : 'text-[#3E9B66]'}`}>{msg.text}</span>
    </>
  );
}