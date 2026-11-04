import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="relative h-40 w-[min(360px,90%)]">
        <div className="absolute inset-x-0 bottom-6 h-10 rounded-xl bg-[#B7BDC7]" />
        <div className="absolute bottom-6 right-6 h-24 w-3 rounded bg-[#5B6577]" />
        <div className="absolute bottom-[110px] right-0 rounded-lg bg-[#E0704F] px-3 py-1.5 text-sm font-extrabold text-white">Jalan buntu</div>
        <svg viewBox="0 0 80 44" className="absolute bottom-12 left-6 w-28 -rotate-6">
          <rect x="2" y="6" width="46" height="28" rx="5" fill="#FFFFFF" stroke="#E3E8E5" strokeWidth="2" />
          <path d="M48 14h14l14 14v6H48z" fill="#E0704F" />
          <rect x="54" y="17" width="9" height="7" rx="1.5" fill="#BDE7FF" />
          <circle cx="16" cy="36" r="6" fill="#2B3240" /><circle cx="62" cy="36" r="6" fill="#2B3240" />
        </svg>
        <span className="absolute left-32 top-2 text-3xl">❓</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-extrabold tracking-wide text-slate-400">404</span>
        <h1 className="text-[clamp(30px,5vw,44px)] font-extrabold tracking-tight">Waduh, truknya nyasar.</h1>
        <p className="max-w-[420px] text-slate-600">Jalan yang kamu cari nggak ada di Kota Sandro. Yuk balik ke jalan yang benar.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <Link href="/" className="inline-flex min-h-12 items-center rounded-2xl bg-[#1F2A3A] px-5 font-extrabold text-white">🚚 Balik ke kota</Link>
        <Link href="/portfolio" className="inline-flex min-h-12 items-center rounded-2xl bg-white px-5 font-bold shadow-sm">Lihat portfolio</Link>
      </div>
    </div>
  );
}