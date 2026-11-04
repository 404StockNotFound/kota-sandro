'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { N } from '@/lib/cityMap';

/* ---------- Lampu jalan ---------- */
const LAMPS: [number, number][] = [
  [5 - 0.46, 1], [5 - 0.46, 6], [5 + 0.46, 10], // pinggir jalan horizontal (x=col, z=row)
];
const LAMPS_V: [number, number][] = [
  [1, 3 + 0.46], [8, 3 - 0.46], [3, 8 + 0.46], [11, 8 - 0.46], // pinggir jalan vertikal (row, x)
];

function Lamp({ x, z, night }: { x: number; z: number; night: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#5B6577" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#FFF6D8" emissive="#FFD978" emissiveIntensity={night ? 2.2 : 0.1} />
      </mesh>
    </group>
  );
}

export function Lamps({ night }: { night: boolean }) {
  return (
    <>
      {LAMPS.map(([z, x], i) => <Lamp key={`h${i}`} x={x} z={z} night={night} />)}
      {LAMPS_V.map(([z, x], i) => <Lamp key={`v${i}`} x={x} z={z} night={night} />)}
    </>
  );
}

/* ---------- Semak & bunga ---------- */
const BUSHES: [number, number, string][] = [
  [1, 1, '#F2967A'], [3, 2, '#F4C25B'], [1, 7, '#A9A2E8'], [4, 10, '#F07C8C'],
  [7, 4, '#F4C25B'], [9, 10, '#F2967A'], [11, 4, '#A9A2E8'], [6, 1, '#F07C8C'],
];

export function Bushes() {
  return (
    <>
      {BUSHES.map(([r, c, flower], i) => (
        <group key={i} position={[c + 0.15, 0, r - 0.1]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color="#6DB97A" flatShading />
          </mesh>
          <mesh position={[0.12, 0.06, 0.08]} castShadow>
            <sphereGeometry args={[0.08, 10, 8]} />
            <meshStandardMaterial color="#5FAE6E" flatShading />
          </mesh>
          {[[-0.04, 0.17, 0.05], [0.06, 0.15, -0.06], [0.14, 0.12, 0.12]].map(([x, y, z], j) => (
            <mesh key={j} position={[x, y, z]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color={flower} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/* ---------- Mobil NPC ---------- */
function Car({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.24]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.03, 0.22, 0]} castShadow>
        <boxGeometry args={[0.22, 0.1, 0.2]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      {[[-0.13, 0.12], [-0.13, -0.12], [0.13, 0.12], [0.13, -0.12]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
          <meshStandardMaterial color="#2B3240" />
        </mesh>
      ))}
    </group>
  );
}

type Route = { axis: 'x' | 'z'; fixed: number; lane: number; dir: 1 | -1; speed: number; offset: number; color: string };

const ROUTES: Route[] = [
  { axis: 'x', fixed: 5, lane: 0.2, dir: 1, speed: 1.1, offset: 0, color: '#4C7FD9' },
  { axis: 'x', fixed: 5, lane: -0.2, dir: -1, speed: 0.9, offset: 6, color: '#F4C25B' },
  { axis: 'z', fixed: 8, lane: -0.2, dir: -1, speed: 1, offset: 3, color: '#7CC28C' },
  { axis: 'z', fixed: 3, lane: 0.2, dir: 1, speed: 0.8, offset: 8, color: '#A9A2E8' },
];

function NpcCar({ route }: { route: Route }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const len = N + 2;
    const t = ((clock.elapsedTime * route.speed + route.offset) % len) - 1; // -1 .. N+1
    const along = route.dir === 1 ? t : N - 1 - t;
    if (route.axis === 'x') {
      ref.current.position.set(along, 0, route.fixed + route.lane);
      ref.current.rotation.y = route.dir === 1 ? 0 : Math.PI;
    } else {
      ref.current.position.set(route.fixed + route.lane, 0, along);
      ref.current.rotation.y = route.dir === 1 ? -Math.PI / 2 : Math.PI / 2;
    }
    // hilang di ujung peta
    ref.current.visible = along > -0.4 && along < N - 0.6;
  });
  return <group ref={ref}><Car color={route.color} /></group>;
}

export function NpcCars() {
  return <>{ROUTES.map((r, i) => <NpcCar key={i} route={r} />)}</>;
}

/* ---------- Awan ---------- */
function Cloud({ z, y, speed, offset, s }: { z: number; y: number; speed: number; offset: number; s: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const span = N + 8;
    ref.current.position.x = ((clock.elapsedTime * speed + offset) % span) - 4;
  });
  return (
    <group ref={ref} position={[0, y, z]} scale={s}>
      {[[0, 0, 0, 0.45], [0.45, -0.05, 0.1, 0.35], [-0.42, -0.08, -0.05, 0.32], [0.15, 0.2, -0.1, 0.32]].map(([x, yy, zz, r], i) => (
        <mesh key={i} position={[x, yy, zz]} castShadow>
          <sphereGeometry args={[r, 16, 12]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  );
}

export function Clouds() {
  return (
    <>
      <Cloud z={2} y={3.2} speed={0.25} offset={0} s={1} />
      <Cloud z={7} y={3.6} speed={0.18} offset={9} s={1.3} />
      <Cloud z={10} y={3} speed={0.22} offset={4} s={0.8} />
    </>
  );
}

/* ---------- Pulau + air ---------- */
export function Island() {
  const mid = (N - 1) / 2;
  return (
    <>
      <mesh position={[mid, -0.45, mid]} receiveShadow>
        <boxGeometry args={[N + 0.2, 0.7, N + 0.2]} />
        <meshStandardMaterial color="#C9A27A" />
      </mesh>
      <mesh position={[mid, -0.82, mid]}>
        <boxGeometry args={[N - 0.4, 0.2, N - 0.4]} />
        <meshStandardMaterial color="#A9825C" />
      </mesh>
      <mesh position={[mid, -0.6, mid]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#A8DCEB" />
      </mesh>
    </>
  );
}