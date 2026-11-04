'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import CityLoading from './CityLoading';

const Shell = () => (
  <div className="relative h-[min(72svh,620px)] min-h-[460px] overflow-hidden rounded-[24px] sm:h-[clamp(460px,62vw,640px)] sm:rounded-[28px]"><CityLoading /></div>
);

const City = dynamic(() => import('./City'), { ssr: false, loading: Shell });

export default function CityLoader() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('paksa') === '1') { setOk(true); return; }
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2);
    if (!gl) { router.replace('/portfolio?dari=kota&alasan=webgl'); return; }
    if (weak) { router.replace('/portfolio?dari=kota&alasan=ringan'); return; }
    setOk(true);
  }, [router]);

  return ok ? <City /> : <Shell />;
}