'use client';
import { create } from 'zustand';

export const useTol = create<{ stage: number; next: () => void; reset: () => void }>((set) => ({
  stage: 0,
  next: () => set((s) => ({ stage: s.stage + 1 })),
  reset: () => set({ stage: 0 }),
}));