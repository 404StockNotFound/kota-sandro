'use client';
import { create } from 'zustand';

export type GuestEntry = { id: number; name: string; message: string; created_at: string };

type GuestbookState = {
  entries: GuestEntry[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (e: GuestEntry) => void;
};

export const useGuestbook = create<GuestbookState>((set, get) => ({
  entries: [],
  loaded: false,
  load: async () => {
    if (get().loaded) return;
    try {
      const r = await fetch('/api/guestbook');
      if (r.ok) set({ entries: await r.json(), loaded: true });
    } catch {}
  },
  add: (e) => set({ entries: [e, ...get().entries] }),
}));