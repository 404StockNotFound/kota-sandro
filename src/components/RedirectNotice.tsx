'use client';
import { useSearchParams } from 'next/navigation';

export default function RedirectNotice() {
  const sp = useSearchParams();
  if (sp.get('dari') !== 'kota') return null;
  const webgl = sp.get('alasan') === 'webgl';

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[18px] bg-white p-4 shadow-sm">
      <span className="text-2xl">🚚</span>
      <p className="flex-1 text-sm leading-relaxed text-slate-600">
        {webgl
          ? 'Browser kamu belum support kota 3D, jadi aku tampilin versi biasa dulu ya.'
          : 'Biar perangkatmu tetap enteng, aku tampilin versi tanpa game dulu.'}
      </p>
      {!webgl && (
        <a href="/?paksa=1" className="min-h-10 rounded-xl bg-[#1F2A3A] px-4 py-2.5 text-sm font-bold text-white">
          Tetap buka kota 3D
        </a>
      )}
    </div>
  );
}