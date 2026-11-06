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
  /** speedrun: waktu mulai nyetir & waktu stiker ke-5 didapat (ms) */
  startedAt: number | null;
  finishedAt: number | null;
  startRun: () => void;
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
      startedAt: null,
      finishedAt: null,
      startRun: () => { if (!get().startedAt) set({ startedAt: Date.now() }); },
      collect: (key) => {
        if (get().got.includes(key)) return;
        const got = [...get().got, key];
        const done = got.length === 5 && !get().finishedAt;
        set({ got, justGot: key, ...(done ? { finishedAt: Date.now(), startedAt: get().startedAt ?? Date.now() } : {}) });
      },
      clearToast: () => set({ justGot: null }),
      setTruckColor: (c) => set({ truckColor: c }),
      has: (key) => get().got.includes(key),
reset: () => set({ got: [], justGot: null, truckColor: '#FFFFFF', cabColor: '#E0704F', startedAt: null, finishedAt: null }),
    }),
    { name: 'kota-sandro-stickers', partialize: (s) => ({ got: s.got, truckColor: s.truckColor, cabColor: s.cabColor, seenIntro: s.seenIntro, startedAt: s.startedAt, finishedAt: s.finishedAt }) }
  )
);