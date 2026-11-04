'use client';
import { create } from 'zustand';

export const useGudang = create<{ matched: number[]; addMatch: (i: number) => void; reset: () => void }>((set) => ({
  matched: [],
  addMatch: (i) => set((s) => (s.matched.includes(i) ? s : { matched: [...s.matched, i] })),
  reset: () => set({ matched: [] }),
}));