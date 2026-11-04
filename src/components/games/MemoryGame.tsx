'use client';
import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '@/lib/content';
import { useStickers } from '@/store/stickers';
import { useGudang } from '@/store/gudang';

const shuffle = () => [0, 0, 1, 1, 2, 2, 3, 3].sort(() => Math.random() - 0.5);

export default function MemoryGame() {
  const collect = useStickers((s) => s.collect);
  const { matched, addMatch, reset } = useGudang();
  const [deck, setDeck] = useState<number[]>([0, 2, 1, 3, 2, 0, 3, 1]);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const lock = useRef(false);

  // acak ulang tiap masuk halaman
  useEffect(() => { setDeck(shuffle()); reset(); }, [reset]);

  useEffect(() => { if (matched.length === 4) collect('gudang'); }, [matched, collect]);

  const flip = (i: number) => {
    if (lock.current || open.includes(i) || matched.includes(deck[i])) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    if (deck[next[0]] === deck[next[1]]) {
      addMatch(deck[i]);
      setOpen([]);
    } else {
      lock.current = true;
      setTimeout(() => { setOpen([]); lock.current = false; }, 800);
    }
  };

  return (
    <>
      <p>Buka 2 kotak. Kalau kembar, proyeknya menyala.</p>
      <div className="grid grid-cols-4 gap-2.5">
        {deck.map((pi, i) => {
          const p = PROJECTS[pi];
          const isMatched = matched.includes(pi);
          const shown = isMatched || open.includes(i);
          return (
            <button
              key={i}
              onClick={() => flip(i)}
              aria-label={shown ? p.name : 'Kotak tertutup'}
              className="aspect-square rounded-2xl text-lg font-extrabold transition-transform active:scale-95"
              style={
                shown
                  ? { background: p.color, color: '#fff', boxShadow: isMatched ? `0 0 0 3px #fff, 0 0 0 5px ${p.color}` : undefined }
                  : { background: '#E8DCC8', color: '#B49A72', boxShadow: 'inset 0 -6px 0 #D9C8AC' }
              }
            >
              {shown ? p.short : '?'}
            </button>
          );
        })}
      </div>
      <span className="text-sm font-bold text-slate-500">Langkah {moves} · ketemu {matched.length}/4</span>
    </>
  );
}