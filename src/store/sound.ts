'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSound = create<{ muted: boolean; toggle: () => void }>()(
  persist((set) => ({ muted: false, toggle: () => set((s) => ({ muted: !s.muted })) }), { name: 'kota-sandro-sound' })
);