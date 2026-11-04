'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text, Line } from '@react-three/drei';

function starShape(outer = 0.07, inner = 0.032) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

export default function PlaceLabel({ name, done, y }: { name: string; done: boolean; y: number }) {
  const badge = useRef<THREE.Group>(null!);
  const star = useMemo(() => starShape(), []);
  const w = name.length * 0.13 + 0.55;

  // badge ★ berdenyut kalau stiker belum diambil
  useFrame(({ clock }) => {
    const s = done ? 1 : 1 + Math.sin(clock.elapsedTime * 4) * 0.12;
    badge.current.scale.setScalar(s);
  });

  return (
    <Billboard position={[0, y, 0]}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[w, 0.36]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
      </mesh>
      <Text position={[-0.12, 0, 0]} fontSize={0.2} color="#1F2A3A" anchorX="center" anchorY="middle">
        {name}
      </Text>
      <group ref={badge} position={[w / 2 - 0.17, 0, 0.01]}>
        <mesh>
          <circleGeometry args={[0.13, 32]} />
          <meshBasicMaterial color={done ? '#4FAE7A' : '#E0704F'} />
        </mesh>
        {done ? (
          <Line points={[[-0.05, 0, 0.01], [-0.012, -0.04, 0.01], [0.055, 0.045, 0.01]]} color="#FFFFFF" lineWidth={3} />
        ) : (
          <mesh position={[0, 0, 0.01]}>
            <shapeGeometry args={[star]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        )}
      </group>
    </Billboard>
  );
}