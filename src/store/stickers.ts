'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlaceKey } from '@/lib/places';

type StickerState = {
  got: PlaceKey[];
  justGot: PlaceKey | null;
  truckColor: string;
  cabColor: string;
  setCabColor: (c: string) => void;
  seenIntro: boolean;
  setSeenIntro: (v: boolean) => void;
  collect: (key: PlaceKey) => void;
  clearToast: () => void;
  setTruckColor: (c: string) => void;
  has: (key: PlaceKey) => boolean;
  reset: () => void;
};

export const useStickers = create<StickerState>()(
  persist(
    (set, get) => ({
      got: [],
      justGot: null,
      truckColor: '#FFFFFF',
      cabColor: '#E0704F',
      setCabColor: (c) => set({ cabColor: c }),
      seenIntro: false,
      setSeenIntro: (v) => set({ seenIntro: v }),
      collect: (key) => {
        if (get().got.includes(key)) return;
        set({ got: [...get().got, key], justGot: key });
      },
      clearToast: () => set({ justGot: null }),
      setTruckColor: (c) => set({ truckColor: c }),
      has: (key) => get().got.includes(key),
      reset: () => set({ got: [], justGot: null, truckColor: '#FFFFFF', cabColor: '#E0704F' }),
    }),
    { name: 'kota-sandro-stickers', partialize: (s) => ({ got: s.got, truckColor: s.truckColor, cabColor: s.cabColor, seenIntro: s.seenIntro }) }
  )
);