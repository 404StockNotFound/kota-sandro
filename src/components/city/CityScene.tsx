'use client';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrthographicCamera, Sparkles } from '@react-three/drei';
import { Lamps, Bushes, NpcCars, Clouds, Island } from './Decor';
import PlaceLabel from './PlaceLabel';
import { PlaceModel, LABEL_Y } from './models';
import { N, isRoad, isShortcut, TREES } from '@/lib/cityMap';
import { PLACES } from '@/lib/places';
import { useStickers } from '@/store/stickers';
import { useCity } from '@/store/city';
import { useGuestbook } from '@/store/guestbook';
import GuestbookBoard from './GuestbookBoard';
import Truck from './Truck';

function Cam() {
  const { size } = useThree();
  return <OrthographicCamera makeDefault position={[21, 20, 22]} zoom={size.width < 640 ? 42 : 70} near={0.1} far={200} />;
}

function Ground({ tolOpen, night }: { tolOpen: boolean; night: boolean }) {
  const tiles = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const road = isRoad(r, c, true);
    const closed = isShortcut(r, c) && !tolOpen;
    const grass = (r + c) % 2 ? '#BFE3B4' : '#B4DCA8';
    const color = road ? (closed ? '#B7BDC7' : '#9AA3B2') : night ? '#7FA77A' : grass;
    const horiz = r === 5 || r === 10, vert = c === 3 || c === 8, cross = horiz && vert;
    tiles.push(
      <group key={`${r}-${c}`} position={[c, 0, r]}>
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {road && !cross && (
          <mesh position={[0, 0.006, 0]}>
            <boxGeometry args={horiz ? [0.35, 0.01, 0.05] : [0.05, 0.01, 0.35]} />
            <meshStandardMaterial color="#F3F1E6" />
          </mesh>
        )}
      </group>
    );
  }
  return <>{tiles}</>;
}
function Buildings({ got, night }: { got: string[]; night: boolean }) {
  const setAuto = useCity((st) => st.setAuto);
  return (
    <>
      {PLACES.map((p) => {
        const [r, c] = p.building;
        const done = got.includes(p.key);
        // hadapkan bangunan ke kotak parkir (jalan)
        const rotY = Math.atan2(-(p.parking[0] - r), p.parking[1] - c);
        return (
          <group key={p.key}>
            {/* kotak parkir */}
            <mesh position={[p.parking[1], 0.004, p.parking[0]]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.8, 0.8]} />
              <meshStandardMaterial color={p.color} transparent opacity={0.45} />
            </mesh>
            <group
              position={[c, 0, r]}
              onClick={(e) => { e.stopPropagation(); setAuto(p.key); }}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = ''; }}
            >
              <group rotation={[0, rotY, 0]} scale={1.15}>
                <PlaceModel kind={p.key} color={p.color} night={night} />
              </group>
              {!done && <Sparkles count={14} scale={[1.1, 1, 1.1]} position={[0, 0.6, 0]} size={4} speed={0.5} color={p.color} />}
              <PlaceLabel name={p.name} done={done} y={LABEL_Y[p.key]} />
            </group>
          </group>
        );
      })}
    </>
  );
}

function Trees({ night }: { night: boolean }) {
  return (
    <>
      {TREES.map(([r, c], i) => (
        <group key={i} position={[c, 0, r]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.3, 8]} />
            <meshStandardMaterial color="#8A6A4A" />
          </mesh>
          <mesh position={[0, 0.42 + (i % 3) * 0.04, 0]} castShadow>
            <icosahedronGeometry args={[0.24 + (i % 3) * 0.03, 0]} />
            <meshStandardMaterial color={night ? '#3E7A50' : '#5FAE6E'} flatShading />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Barrier() {
  return (
    <group position={[6, 0, 10]}>
      <mesh position={[-0.4, 0.2, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#5B6577" />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#E0704F" />
      </mesh>
    </group>
  );
}

export default function CityScene({ onReady }: { onReady?: () => void }) {
  const got = useStickers((s) => s.got);
  const night = got.includes('pos');
  const tolOpen = got.includes('tol');
  const guestCount = useGuestbook((st) => st.entries.length);

  return (
    <Canvas shadows="percentage" dpr={[1, 2]} onCreated={() => setTimeout(() => onReady?.(), 900)}>
      <color attach="background" args={[night ? '#1E2846' : '#CDEAF3']} />
      <Cam />
      <ambientLight intensity={night ? 0.3 : 0.45} color={night ? '#9FB0FF' : '#FFFFFF'} />
      <hemisphereLight args={[night ? '#5A6BA8' : '#FFFFFF', night ? '#2A3557' : '#B4DCA8', night ? 0.4 : 0.7]} />
      <directionalLight
        position={[8, 14, 4]}
        intensity={night ? 0.35 : 1.3}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <Suspense fallback={null}>
        <Island />
        <Ground tolOpen={tolOpen} night={night} />
        <Lamps night={night} />
        <Bushes />
        <NpcCars />
        <Clouds />
        <Buildings got={got} night={night} />
        <Trees night={night} />
        {!tolOpen && <Barrier />}
        <GuestbookBoard count={guestCount} night={night} />
        <Truck />
      </Suspense>
    </Canvas>
  );
}