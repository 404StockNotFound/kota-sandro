'use client';
import { useSound } from '@/store/sound';
import { useHydrated } from '@/lib/useHydrated';
import { sfx } from '@/lib/sfx';

export default function SoundToggle({ className = '' }: { className?: string }) {
  const hydrated = useHydrated();
  const { muted, toggle } = useSound();
  const m = hydrated && muted;
  return (
    <button
      onClick={() => { toggle(); if (m) setTimeout(() => sfx.pop(), 30); else sfx.engine(false); }}
      aria-label={m ? 'Nyalakan suara' : 'Matikan suara'}
      aria-pressed={!m}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-lg shadow ${className}`}
    >
      {m ? '🔇' : '🔊'}
    </button>
  );
}