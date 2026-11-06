'use client';
import { useState } from 'react';
import { useStickers } from '@/store/stickers';
import { useHydrated } from '@/lib/useHydrated';
import { PLACES } from '@/lib/places';
import { formatRun } from '@/lib/time';

const SITE = 'iamsandro.my.id';

/** Gambar kartu ukuran story IG (1080×1920) */
async function drawCard(time: string | null, date: string) {
  const W = 1080, H = 1920;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d')!;
  const font = getComputedStyle(document.body).fontFamily;
  const f = (w: number, s: number) => `${w} ${s}px ${font}`;
  if (document.fonts?.ready) await document.fonts.ready;

  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#F7D774');
  bg.addColorStop(1, '#F2967A');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  // kartu putih
  const x = 90, y = 360, w = W - 180, h = 1180, r = 56;
  g.fillStyle = 'rgba(31,42,58,0.16)';
  g.beginPath(); g.roundRect(x, y + 24, w, h, r); g.fill();
  g.fillStyle = '#FFFFFF';
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fill();

  g.textAlign = 'center';
  g.fillStyle = '#1F2A3A';
  g.font = f(800, 40);
  g.fillText('KARTU WARGA KEHORMATAN', W / 2, 260);

  g.font = f(800, 96);
  const a = 'Kota ', b = 'Sandro';
  const wa = g.measureText(a).width, wb = g.measureText(b).width;
  g.textAlign = 'left';
  g.fillText(a, W / 2 - (wa + wb) / 2, y + 190);
  g.fillStyle = '#E0704F';
  g.fillText(b, W / 2 - (wa + wb) / 2 + wa, y + 190);
  g.textAlign = 'center';

  g.font = '150px serif';
  g.fillText('🚚', W / 2, y + 400);

  // 5 stiker
  PLACES.forEach((p, i) => {
    const cx = W / 2 + (i - 2) * 130, cy = y + 520;
    g.fillStyle = p.color;
    g.beginPath(); g.arc(cx, cy, 48, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(cx - 20, cy + 2); g.lineTo(cx - 5, cy + 18); g.lineTo(cx + 22, cy - 14); g.stroke();
  });

  g.fillStyle = '#64708A';
  g.font = f(700, 44);
  g.fillText(time ? 'Keliling semua tempat dalam' : '5/5 stiker terkumpul', W / 2, y + 700);

  g.fillStyle = '#1F2A3A';
  g.font = f(800, time ? 200 : 120);
  g.fillText(time ?? '🏆', W / 2, y + (time ? 900 : 880));

  g.fillStyle = '#94A0B4';
  g.font = f(600, 38);
  g.fillText(date, W / 2, y + 1050);

  // ajakan
  g.fillStyle = '#1F2A3A';
  g.font = f(800, 52);
  g.fillText('Bisa lebih cepet?', W / 2, 1690);
  g.beginPath(); g.roundRect(W / 2 - 300, 1730, 600, 100, 50); g.fill();
  g.fillStyle = '#FFFFFF';
  g.font = f(800, 46);
  g.fillText(SITE, W / 2, 1797);

  return new Promise<Blob | null>((res) => cv.toBlob(res, 'image/png'));
}

export default function CitizenCard() {
  const hydrated = useHydrated();
  const all = useStickers((s) => s.got.length === 5);
  const startedAt = useStickers((s) => s.startedAt);
  const finishedAt = useStickers((s) => s.finishedAt);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  if (!hydrated || !all) return null;

  const time = startedAt && finishedAt ? formatRun(finishedAt - startedAt) : null;
  const date = new Date(finishedAt ?? 0).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const text = time
    ? `Aku keliling Kota Sandro dalam ${time} 🚚 Bisa lebih cepet?`
    : 'Aku udah keliling Kota Sandro dan dapat 5/5 stiker! 🚚';

  const shareImage = async () => {
    setBusy(true);
    setStatus('');
    try {
      const blob = await drawCard(time, date);
      if (!blob) throw new Error();
      const file = new File([blob], 'kartu-warga-kota-sandro.png', { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: 'Kota Sandro' });
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        setStatus('Gambar kartu udah ke-download!');
      }
    } catch {
      // user batal share → nggak usah apa-apa
    }
    setBusy(false);
  };

  const shareLink = async () => {
    const url = `https://${SITE}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Kota Sandro', text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); setStatus('Link disalin!'); }
    } catch {}
  };

  return (
    <div className="flex flex-col gap-3 rounded-[22px] bg-gradient-to-br from-[#F7D774] to-[#F2967A] p-5">
      <span className="text-xs font-extrabold tracking-[.08em]">KARTU WARGA KEHORMATAN</span>
      <span className="text-[26px] font-extrabold leading-tight tracking-tight">Kamu udah keliling Kota Sandro!</span>
      {time ? (
        <div className="flex items-end gap-3">
          <span className="text-[44px] font-extrabold leading-none tracking-tight">{time}</span>
          <span className="pb-1 text-sm font-bold">waktu keliling · 5/5 stiker</span>
        </div>
      ) : (
        <span className="text-sm font-semibold">5/5 stiker · truk emas kebuka</span>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={shareImage} disabled={busy} className="min-h-11 rounded-xl bg-[#1F2A3A] px-4 font-extrabold text-white disabled:opacity-60">
          {busy ? 'Bikin kartu…' : '📸 Simpan kartu buat story'}
        </button>
        <button onClick={shareLink} className="min-h-11 rounded-xl bg-white/70 px-4 font-extrabold">
          Tantang teman
        </button>
        {status && <span className="text-sm font-bold">{status}</span>}
      </div>
    </div>
  );
}