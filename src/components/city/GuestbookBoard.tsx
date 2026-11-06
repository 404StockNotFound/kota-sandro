'use client';
import { useState } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { GUESTBOOK_CELL } from '@/lib/cityMap';
import { useCity } from '@/store/city';

/** Papan buku tamu di pinggir jalan — ketuk buat baca & nulis pesan */
export default function GuestbookBoard({ count, night }: { count: number; night: boolean }) {
  const open = useCity((s) => s.setGuestbookOpen);
  const [hover, setHover] = useState(false);
  const [r, c] = GUESTBOOK_CELL;

  return (
    <group
      position={[c, 0, r]}
      onClick={(e) => { e.stopPropagation(); open(true); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
      scale={hover ? 1.06 : 1}
    >
      {/* tiang */}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]} castShadow>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshStandardMaterial color="#8A5A3C" />
        </mesh>
      ))}
      {/* papan */}
      <group rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[0.78, 0.42, 0.06]} />
          <meshStandardMaterial color="#C98B5E" emissive={night ? '#5A3A20' : '#000000'} emissiveIntensity={night ? 0.5 : 0} />
        </mesh>
        <mesh position={[0, 0.62, 0.035]}>
          <planeGeometry args={[0.68, 0.32]} />
          <meshStandardMaterial color="#FFF6E6" />
        </mesh>
        {/* kertas-kertas kecil */}
        {[[-0.2, 0.66, '#F7D774'], [0.02, 0.6, '#A9E3D8'], [0.21, 0.67, '#F6B9C3']].map(([x, y, col]) => (
          <mesh key={String(col)} position={[x as number, y as number, 0.04]} rotation={[0, 0, (x as number) * 0.6]}>
            <planeGeometry args={[0.14, 0.12]} />
            <meshStandardMaterial color={col as string} />
          </mesh>
        ))}
      </group>
      <Billboard position={[0, 1.15, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.35, 0.34]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
        </mesh>
        <Text fontSize={0.17} color="#1F2A3A" anchorX="center" anchorY="middle">
          {`Buku Tamu${count ? ` · ${count}` : ''}`}
        </Text>
      </Billboard>
    </group>
  );
}