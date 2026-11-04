'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { getPlace } from '@/lib/places';
import { useStickers } from '@/store/stickers';
import { sfx } from '@/lib/sfx';

export default function StickerToast() {
  const justGot = useStickers((s) => s.justGot);
  const clear = useStickers((s) => s.clearToast);

  useEffect(() => {
    if (!justGot) return;
    sfx.chime();
    const t = setTimeout(clear, 5000);
    return () => clearTimeout(t);
  }, [justGot, clear]);

  const p = justGot ? getPlace(justGot) : null;

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          role="status"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="mx-auto mb-2 flex max-w-[1320px] flex-wrap items-center gap-3 rounded-[18px] bg-[#1F2A3A] px-4 py-3 text-white"
        >
          <motion.span
            initial={{ scale: 1.6, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl font-extrabold"
            style={{ background: p.color }}
          >
            ✓
          </motion.span>
          <span className="flex-1 font-bold">
            Stiker {p.name} didapat! <span className="text-[#FFD58A]">{p.unlock} kebuka.</span>
          </span>
          <Link href="/" className="py-2 font-extrabold">Balik ke kota →</Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}