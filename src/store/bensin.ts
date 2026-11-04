'use client';
import { create } from 'zustand';

export const useBensin = create<{ full: number[]; fill: (i: number) => void; reset: () => void }>((set) => ({
  full: [],
  fill: (i) => set((s) => (s.full.includes(i) ? s : { full: [...s.full, i] })),
  reset: () => set({ full: [] }),
}));