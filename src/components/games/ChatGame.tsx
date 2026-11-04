'use client';
import { useEffect, useRef, useState } from 'react';
import { useStickers } from '@/store/stickers';

import { waLink } from '@/lib/content';

const REPLIES: Record<string, { label: string; reply: string }> = {
  hi: { label: 'Halo Sandro!', reply: 'Halo! Makasih udah mampir ke kotaku. Ada yang bisa aku bantu?' },
  build: { label: 'Mau bikin web / aplikasi', reply: 'Siap! Ceritain apa yang bikin timmu repot — sistem internal, marketplace, otomasi WA, apa aja.' },
  cv: { label: 'Boleh lihat CV?', reply: 'Boleh banget — ada di Garasi, tinggal klik Download CV.' },
  main: { label: 'Cuma iseng main', reply: 'Hehe asik. Udah coba Turbo di Pom Bensin belum?' },
};

type Msg = { me: boolean; text: string };

export default function ChatGame({ reward = true }: { reward?: boolean }) {
  const collect = useStickers((s) => s.collect);
  const [msgs, setMsgs] = useState<Msg[]>([{ me: false, text: 'Halo, aku Sandro. Pilih pesan di bawah ya ↓' }]);
  const [used, setUsed] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing]);

  const send = (k: string) => {
    const r = REPLIES[k];
    setMsgs((m) => [...m, { me: true, text: r.label }]);
    setUsed((u) => [...u, k]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { me: false, text: r.reply }]);
      if (reward) collect('pos');
    }, 1100);
  };

  return (
    <>
      {reward && <p>Kirim 1 pesan ke aku buat dapat stiker.</p>}
      <div className="mx-auto h-[500px] w-full max-w-[330px] rounded-[40px] bg-[#1F2A3A] p-2.5 sm:h-[560px] sm:rounded-[44px]">
        <div className="flex h-full flex-col overflow-hidden rounded-[36px] bg-[#EFE7DD]">
          <div className="flex items-center gap-2.5 bg-[#2F8F80] px-4 pb-3 pt-5 text-white">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F2967A] font-extrabold">S</span>
            <div className="flex flex-col">
              <span className="font-extrabold">Sandro</span>
              <span className="text-xs opacity-85">{typing ? 'mengetik…' : 'online'}</span>
            </div>
          </div>

          <div ref={box} className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3.5">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-snug ${m.me ? 'self-end rounded-tr-sm bg-[#D3F4C1]' : 'self-start rounded-tl-sm bg-white'}`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 self-start rounded-xl bg-white px-3.5 py-3">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-[7px] w-[7px] animate-pulse rounded-full bg-slate-400" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 bg-[#F7F2EA] px-2.5 pb-4 pt-2.5">
            {Object.keys(REPLIES).filter((k) => !used.includes(k)).map((k) => (
              <button
                key={k}
                onClick={() => send(k)}
                disabled={typing}
                className="min-h-10 rounded-full border border-[#2F8F80] bg-white px-3 text-[13px] font-bold text-[#2F8F80] disabled:opacity-50"
              >
                {REPLIES[k].label}
              </button>
            ))}
            {used.length > 0 && !typing && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex min-h-[46px] w-full items-center justify-center rounded-xl bg-[#25D366] font-extrabold text-[#0B3B1E]">
                Lanjut di WhatsApp asli →
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}