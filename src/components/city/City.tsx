'use client';
import { useState } from 'react';
import CityScene from './CityScene';
import CityHud from './CityHud';
import CityLoading from './CityLoading';

export default function City() {
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  return (
    <div className="relative h-[min(72svh,620px)] min-h-[460px] overflow-hidden rounded-[24px] shadow-xl sm:h-[clamp(460px,62vw,640px)] sm:rounded-[28px]">
      <div className="absolute inset-0 z-0">
        <CityScene onReady={() => { setReady(true); setTimeout(() => setGone(true), 600); }} />
      </div>
      <div className="absolute inset-0 z-10">
        <CityHud />
      </div>
      {!gone && (
        <div className="absolute inset-0 z-30">
          <CityLoading fading={ready} />
        </div>
      )}
    </div>
  );
}