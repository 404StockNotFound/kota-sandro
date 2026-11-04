'use client';
import { useState } from 'react';
import { useStickers } from '@/store/stickers';
import { useHydrated } from '@/lib/useHydrated';

const STEPS = [
  { icon: '🚚', title: 'Setir truknya', body: 'Pakai tombol panah di kiri bawah, atau keyboard (panah / WASD). Spasi buat klakson.' },
  { icon: '🅿️', title: 'Parkir di kotak berwarna', body: 'Tiap bangunan punya kotak parkir. Berhenti di situ, terus klik "Masuk".' },
  { icon: '⭐', title: 'Kumpulin 5 stiker', body: 'Selesaikan mini game di tiap tempat. Tiap stiker membuka fitur baru di kota.' },
];

export default function IntroGuide() {
  const hydrated = useHydrated();
  const seenIntro = useStickers((s) => s.seenIntro);
  const setSeenIntro = useStickers((s) => s.setSeenIntro);
  const [step, setStep] = useState(0);

  if (!hydrated || seenIntro) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center bg-[#1F2A3A]/35 p-4 backdrop-blur-[2px]">
      <div role="dialog" aria-label="Cara main" className="flex w-full max-w-[360px] flex-col gap-4 rounded-[24px] bg-white p-6 text-center shadow-2xl">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#F5F7F5] text-3xl">{s.icon}</span>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-extrabold tracking-wide text-slate-400">CARA MAIN · {step + 1}/{STEPS.length}</span>
          <h2 className="text-xl font-extrabold">{s.title}</h2>
          <p className="text-[15px] leading-relaxed text-slate-600">{s.body}</p>
        </div>
        <div className="flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-[#E0704F]' : 'w-2 bg-[#E3E8E5]'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSeenIntro(true)} className="min-h-12 flex-1 rounded-2xl bg-[#F0F3F1] font-bold">
            Lewati
          </button>
          <button
            onClick={() => (last ? setSeenIntro(true) : setStep(step + 1))}
            className="min-h-12 flex-[2] rounded-2xl bg-[#1F2A3A] font-extrabold text-white"
          >
            {last ? 'Gas main! 🚚' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}