'use client';
import { useEffect, useState } from 'react';
import { useCity } from '@/store/city';
import { useGuestbook } from '@/store/guestbook';
import { useStickers } from '@/store/stickers';
import { sfx } from '@/lib/sfx';

const SIGNED_KEY = 'kota-sandro-guestbook-signed';
const COLORS = ['#FFF4CC', '#DDF4EF', '#FDE3E7', '#ECEAFB', '#FDEBDD'];

const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'barusan';
  if (s < 3600) return `${Math.floor(s / 60)} mnt lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

export default function GuestbookModal() {
  const open = useCity((s) => s.guestbookOpen);
  const setOpen = useCity((s) => s.setGuestbookOpen);
  const { entries, loaded, load, add } = useGuestbook();
  const all = useStickers((s) => s.got.length === 5);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    try { setSigned(localStorage.getItem(SIGNED_KEY) === '1'); } catch {}
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, setOpen]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSending(true);
    try {
      const r = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, website }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Gagal kirim.');
      if (data.id) add(data);
      try { localStorage.setItem(SIGNED_KEY, '1'); } catch {}
      setSigned(true);
      setMessage('');
      sfx.chime();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Gagal kirim.');
    }
    setSending(false);
  };

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-30 flex items-end justify-center bg-[#1F2A3A]/50 p-3 backdrop-blur-[2px] sm:items-center"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-label="Buku tamu"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88%] w-full max-w-[440px] flex-col gap-3 overflow-hidden rounded-[24px] bg-white p-4 shadow-2xl sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#B9553A]">Papan kota</div>
            <div className="text-xl font-extrabold">📜 Buku Tamu</div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Tutup" className="h-10 w-10 rounded-full bg-[#F0F3F1] font-extrabold">✕</button>
        </div>

        {all && !signed && (
          <form onSubmit={submit} className="flex flex-col gap-2 rounded-2xl bg-[#F5F7F5] p-3">
            <span className="text-sm font-bold text-slate-600">Kamu udah 5/5! Tinggalin pesan buat warga lain 👋</span>
            <input
              value={name} onChange={(e) => setName(e.target.value)} maxLength={24} required
              placeholder="Nama kamu" className="min-h-11 rounded-xl border border-[#E3E8E5] bg-white px-3 text-[15px] outline-none focus:border-[#E0704F]"
            />
            <textarea
              value={message} onChange={(e) => setMessage(e.target.value)} maxLength={140} required rows={2}
              placeholder="Pesan singkat (maks 140 huruf)" className="resize-none rounded-xl border border-[#E3E8E5] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#E0704F]"
            />
            <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-400">{message.length}/140</span>
              <button disabled={sending} className="min-h-11 rounded-xl bg-[#1F2A3A] px-4 font-extrabold text-white disabled:opacity-60">
                {sending ? 'Ngirim…' : 'Tempel di papan'}
              </button>
            </div>
            {err && <span className="text-sm font-bold text-[#C24A3A]">{err}</span>}
          </form>
        )}
        {all && signed && (
          <span className="rounded-2xl bg-[#E3F4E8] px-3 py-2 text-sm font-bold text-[#2F7A50]">✓ Pesanmu udah nempel di papan. Makasih udah mampir!</span>
        )}
        {!all && (
          <span className="rounded-2xl bg-[#FDF0D2] px-3 py-2 text-sm font-bold text-[#8A6414]">🔒 Kumpulin 5 stiker dulu buat nulis di buku tamu.</span>
        )}

        <div className="-mx-1 flex flex-col gap-2 overflow-y-auto px-1 pb-1">
          {!loaded && <span className="py-6 text-center text-sm font-bold text-slate-400">Lagi ngambil pesan…</span>}
          {loaded && entries.length === 0 && (
            <span className="py-6 text-center text-sm font-bold text-slate-400">Belum ada pesan. Jadi yang pertama!</span>
          )}
          {entries.map((e, i) => (
            <div key={e.id} className="rounded-2xl px-3.5 py-2.5" style={{ background: COLORS[i % COLORS.length] }}>
              <p className="text-[15px] leading-snug">{e.message}</p>
              <div className="mt-1 flex justify-between gap-2 text-xs font-bold text-slate-500">
                <span className="truncate">— {e.name}</span>
                <span className="flex-none">{ago(e.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}