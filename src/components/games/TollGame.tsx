'use client';
import { useEffect, useState } from 'react';
import { useStickers } from '@/store/stickers';
import { useTol } from '@/store/tol';
import { sfx } from '@/lib/sfx';

const PRICES = [7000, 4000, 9000];
const COINS = [
  { v: 1000, bg: '#F6DFA0' },
  { v: 2000, bg: '#E3E8E5' },
  { v: 5000, bg: '#F4C25B' },
];
const rp = (n: number) => 'Rp' + n.toLocaleString('id-ID');

export default function TollGame() {
  const collect = useStickers((s) => s.collect);
  const { stage, next, reset } = useTol();
  const [paid, setPaid] = useState(0);
  const [msg, setMsg] = useState({ text: 'Bayar pakai uang pas.', bad: false });
  const finished = stage >= PRICES.length;

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => { if (finished) collect('tol'); }, [finished, collect]);

  const pay = () => {
    const price = PRICES[stage];
    if (paid === price) {
      sfx.gate();
      next();
      setPaid(0);
      setMsg({ text: 'Gerbang kebuka!', bad: false });
    } else {
      setMsg({ text: paid > price ? 'Kelebihan! Ulang ya.' : 'Uangnya kurang.', bad: true });
    }
  };

  const truckLeft = ['4%', '36%', '63%', '88%'][Math.min(stage, 3)];

  return (
    <>
      {/* jalan + gerbang */}
      <div className="relative h-[84px] overflow-hidden rounded-2xl bg-[#C9D7CC]">
        <div
          className="absolute inset-x-0 top-[26px] h-10 bg-[#9AA3B2]"
          style={{ backgroundImage: 'linear-gradient(90deg,#F3F1E6 0 50%,transparent 50%)', backgroundSize: '28px 3px', backgroundRepeat: 'repeat-x', backgroundPosition: '0 50%' }}
        />
        {['28%', '55%', '82%'].map((x, i) => (
          <span
            key={x}
            className="absolute top-3 h-[60px] w-1.5 origin-top rounded-sm transition-transform duration-500"
            style={{
              left: x,
              background: 'repeating-linear-gradient(#E0704F 0 10px,#FFFFFF 10px 20px)',
              transform: `rotate(${i < stage ? -80 : 0}deg)`,
            }}
          />
        ))}
        <span
          className="absolute top-8 h-[26px] w-10 rounded-md bg-white transition-[left] duration-1000"
          style={{ left: truckLeft, boxShadow: '10px 0 0 -2px #E0704F' }}
        />
      </div>

      {finished ? (
        <span className="text-lg font-extrabold text-[#3E9B66]">Semua gerbang kebuka! 🎉</span>
      ) : (
        <>
          <div className="flex flex-wrap justify-between gap-2 text-[17px] font-extrabold">
            <span>Gerbang {stage + 1}: <span className="text-[#C9603F]">{rp(PRICES[stage])}</span></span>
            <span className="text-slate-500">Uangmu {rp(paid)}</span>
          </div>
          <div className="flex gap-2">
            {COINS.map((c) => (
              <button
                key={c.v}
                onClick={() => { setPaid((p) => p + c.v); setMsg({ text: 'Bayar pakai uang pas.', bad: false }); }}
                className="min-h-14 flex-1 rounded-full font-extrabold shadow-[inset_0_-4px_0_rgba(0,0,0,.1)] active:scale-95"
                style={{ background: c.bg }}
              >
                +{c.v / 1000}rb
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={pay} className="min-h-[50px] flex-[2] rounded-[14px] bg-[#1F2A3A] font-extrabold text-white">Bayar</button>
            <button onClick={() => { setPaid(0); setMsg({ text: 'Bayar pakai uang pas.', bad: false }); }} className="min-h-[50px] flex-1 rounded-[14px] bg-[#F0F3F1] font-bold">Ulang</button>
          </div>
          <span className={`text-sm font-bold ${msg.bad ? 'text-[#C9475A]' : 'text-slate-500'}`}>{msg.text}</span>
        </>
      )}
    </>
  );
}