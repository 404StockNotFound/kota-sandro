'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { isRoad } from '@/lib/cityMap';
import { input } from '@/lib/input';
import { PLACES } from '@/lib/places';
import { useStickers } from '@/store/stickers';
import { useCity } from '@/store/city';
import { sfx } from '@/lib/sfx';

const CAM_OFFSET = new THREE.Vector3(20, 20, 20);

export default function Truck() {
  const ref = useRef<THREE.Group>(null!);
  const puffs = useRef<THREE.Mesh[]>([]);
  const wasMoving = useRef(false);
  const pos = useRef({ r: 5, c: 1 });
  const facing = useRef<[number, number]>([0, 1]);
  const camTarget = useRef(new THREE.Vector3());
  // kamera diambil langsung per frame (lihat useFrame)

  const got = useStickers((s) => s.got);
  const truckColor = useStickers((s) => s.truckColor);
  const cabColor = useStickers((s) => s.cabColor);
  const turbo = useCity((s) => s.turbo);

  const tolOpen = got.includes('tol');
  const gold = got.length === 5;
  const night = got.includes('pos');
  const body = gold ? '#F2C14E' : truckColor;

  useFrame((state, delta) => {
    const camera = state.camera;
    const p = pos.current;
    const d = input.dir;
    const sp = (turbo && got.includes('bensin') ? 7 : 3.5) * Math.min(delta, 0.05);

    if (d) {
      const [dr, dc] = d;
      if (dc !== 0) {
        const R = Math.round(p.r);
        if (Math.abs(p.r - R) > 0.01) p.r += Math.sign(R - p.r) * Math.min(sp, Math.abs(R - p.r));
        else {
          p.r = R;
          const nc = p.c + dc * sp;
          if (isRoad(R, Math.round(nc + dc * 0.45), tolOpen)) p.c = nc;
          else p.c = Math.round(p.c);
        }
      } else {
        const C = Math.round(p.c);
        if (Math.abs(p.c - C) > 0.01) p.c += Math.sign(C - p.c) * Math.min(sp, Math.abs(C - p.c));
        else {
          p.c = C;
          const nr = p.r + dr * sp;
          if (isRoad(Math.round(nr + dr * 0.45), C, tolOpen)) p.r = nr;
          else p.r = Math.round(p.r);
        }
      }
      facing.current = d;
    }

    // asap knalpot (cuma kelihatan pas jalan)
    const moving = !!input.dir;
    if (moving !== wasMoving.current) {
      wasMoving.current = moving;
      sfx.engine(moving, turbo && got.includes('bensin'));
    }
    puffs.current.forEach((m, i) => {
      if (!m) return;
      const t = (state.clock.elapsedTime * 1.6 + i / 3) % 1;
      m.visible = moving;
      m.position.set(-0.42 - t * 0.35, 0.12 + t * 0.25, 0.12);
      m.scale.setScalar(0.4 + t * 0.9);
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.6 * (1 - t);
      mat.color.set(got.includes('garasi') ? ['#F07C8C', '#F4C25B', '#7CC28C', '#4C7FD9', '#A9A2E8'][(i + Math.floor(state.clock.elapsedTime * 3)) % 5] : '#E6E9EC');
    });

    // posisi & arah truk (col = x, row = z)
    ref.current.position.set(p.c, 0, p.r);
    const [fr, fc] = facing.current;
    const targetY = Math.atan2(-fr, fc);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.25);

    // kamera ngikutin
    camTarget.current.set(p.c, 0, p.r);
    camera.position.lerp(camTarget.current.clone().add(CAM_OFFSET), 0.08);
    camera.lookAt(camTarget.current);

    // cek parkir & sel (update state cuma kalau berubah)
    const R = Math.round(p.r), C = Math.round(p.c);
    const st = useCity.getState();
    if (st.cell[0] !== R || st.cell[1] !== C) st.setCell([R, C]);
    const near = Math.abs(p.r - R) < 0.2 && Math.abs(p.c - C) < 0.2;
    const at = near ? PLACES.find((pl) => pl.parking[0] === R && pl.parking[1] === C)?.key ?? null : null;
    if (st.parked !== at) st.setParked(at);
  });

  return (
    <group ref={ref}>
      {/* bak */}
      <mesh position={[-0.1, 0.33, 0]} castShadow>
        <boxGeometry args={[0.56, 0.44, 0.44]} />
        <meshStandardMaterial color={body} metalness={gold ? 0.6 : 0} roughness={gold ? 0.3 : 0.8} />
      </mesh>
      {/* kabin */}
      <mesh position={[0.3, 0.27, 0]} castShadow>
        <boxGeometry args={[0.26, 0.32, 0.42]} />
        <meshStandardMaterial color={gold ? '#E0A82E' : cabColor} />
      </mesh>
      {/* kaca */}
      <mesh position={[0.435, 0.33, 0]}>
        <boxGeometry args={[0.01, 0.12, 0.32]} />
        <meshStandardMaterial color="#BDE7FF" emissive={night ? '#FFE08A' : '#000000'} emissiveIntensity={night ? 0.6 : 0} />
      </mesh>
      {/* roda */}
      {[[-0.22, 0.22], [-0.22, -0.22], [0.26, 0.22], [0.26, -0.22]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.09, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
          <meshStandardMaterial color="#2B3240" />
        </mesh>
      ))}
      {night && <pointLight position={[0.6, 0.3, 0]} intensity={2} distance={2.5} color="#FFE08A" />}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { if (m) puffs.current[i] = m; }}>
          <sphereGeometry args={[0.06, 10, 8]} />
          <meshStandardMaterial color="#E6E9EC" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}