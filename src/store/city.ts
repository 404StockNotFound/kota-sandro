'use client';
import { create } from 'zustand';
import type { PlaceKey } from '@/lib/places';

type CityState = {
  parked: PlaceKey | null;
  cell: [number, number];
  turbo: boolean;
  honk: number;
  /** tujuan autopilot (tap tujuan → truk jalan sendiri) */
  auto: PlaceKey | null;
  guestbookOpen: boolean;
  setAuto: (p: PlaceKey | null) => void;
  setGuestbookOpen: (v: boolean) => void;
  setParked: (p: PlaceKey | null) => void;
  setCell: (c: [number, number]) => void;
  toggleTurbo: () => void;
  doHonk: () => void;
};

export const useCity = create<CityState>((set) => ({
  parked: null,
  cell: [5, 1],
  turbo: false,
  honk: 0,
  auto: null,
  guestbookOpen: false,
  setAuto: (auto) => set({ auto }),
  setGuestbookOpen: (guestbookOpen) => set({ guestbookOpen }),
  setParked: (parked) => set({ parked }),
  setCell: (cell) => set({ cell }),
  toggleTurbo: () => set((s) => ({ turbo: !s.turbo })),
  doHonk: () => set((s) => ({ honk: s.honk + 1 })),
}));