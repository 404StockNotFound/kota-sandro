'use client';
import { useState } from 'react';
import { CONTACT, waLink } from '@/lib/content';
   import CitizenCard from './CitizenCard';

const Icon = ({ name }: { name: string }) => {
  const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'wa': return <svg {...p}><path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20l1.3-5A8.4 8.4 0 1 1 21 11.5Z" /><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.2 2 1-.5 1.7c-3.3.4-8-4.3-7.7-7.7L10.2 7l1 2-1.2 1" /></svg>;
    case 'mail': return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case 'linkedin': return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></svg>;
    case 'github': return <svg {...p}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>;
    case 'instagram': return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5v.01" /></svg>;
    default: return null;
  }
};

export default function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(CONTACT.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <>
      <div className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="max-w-[460px] leading-relaxed text-slate-600">
            Sistem internal, marketplace, otomasi WhatsApp — ceritain apa yang bikin timmu repot.
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F4E8] px-3 py-1.5 text-[13px] font-extrabold text-[#2F7A50]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#3E9B66]" /> Terbuka untuk proyek
          </span>
        </div>

        {/* kontak utama */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3">
          <div className="flex flex-col gap-3 rounded-[18px] bg-[#E8F8EE] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#25D366] text-white"><Icon name="wa" /></span>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#2F7A50]">WhatsApp</div>
                <div className="font-extrabold"></div>
              </div>
            </div>
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] font-extrabold text-[#0B3B1E] transition-transform hover:-translate-y-0.5">
              Chat sekarang →
            </a>
          </div>

          <div className="flex flex-col gap-3 rounded-[18px] bg-[#FDF0EA] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#E0704F] text-white"><Icon name="mail" /></span>
              <div className="min-w-0">
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#B9553A]">Email</div>
                <div className="truncate font-extrabold">{CONTACT.email}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${CONTACT.email}`}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#1F2A3A] font-extrabold text-white transition-transform hover:-translate-y-0.5">
                Kirim email
              </a>
              <button onClick={copyEmail} className="min-h-11 rounded-xl bg-white px-4 font-bold">
                {copied ? '✓ Disalin' : 'Salin'}
              </button>
            </div>
          </div>
        </div>

        {/* sosial */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
          {CONTACT.socials.map((s) => (
            <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-[16px] border border-[#EEF1EF] bg-[#F8FAF9] p-3 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-white" style={{ background: s.color }}>
                <Icon name={s.key} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-400">{s.label}</div>
                <div className="truncate text-sm font-extrabold">{s.handle}</div>
              </div>
              <span className="text-slate-300 transition-colors group-hover:text-[#1F2A3A]">↗</span>
            </a>
          ))}
        </div>
      </div>

      <CitizenCard />
    </>
  );
}