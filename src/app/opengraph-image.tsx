import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Kota Sandro — portfolio Laksandro Ramadhanu';

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg,#CDEAF3,#EEF3EF)', padding: 72, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#E0704F', letterSpacing: 2 }}>KOTA SANDRO</div>
          <div style={{ fontSize: 76, fontWeight: 800, color: '#1F2A3A', lineHeight: 1.02 }}>Laksandro Ramadhanu</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#3D4759' }}>Product Developer</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {['#F2967A', '#A9A2E8', '#F07C8C', '#F4C25B', '#6CC7B8'].map((c) => (
              <div key={c} style={{ width: 56, height: 56, borderRadius: 16, background: c, display: 'flex' }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', position: 'relative', width: 360, height: 220 }}>
            <div style={{ position: 'absolute', left: 0, top: 20, width: 220, height: 150, borderRadius: 22, background: '#FFFFFF', display: 'flex' }} />
            <div style={{ position: 'absolute', left: 220, top: 60, width: 120, height: 110, borderRadius: '0 40px 22px 0', background: '#E0704F', display: 'flex' }} />
            <div style={{ position: 'absolute', left: 50, top: 150, width: 64, height: 64, borderRadius: 32, background: '#2B3240', display: 'flex' }} />
            <div style={{ position: 'absolute', left: 250, top: 150, width: 64, height: 64, borderRadius: 32, background: '#2B3240', display: 'flex' }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}