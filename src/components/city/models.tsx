'use client';
import type { PlaceKey } from '@/lib/places';
import type { JSX } from 'react';

type M = { color: string; night: boolean };

const Win = ({ night, ...p }: { night: boolean } & JSX.IntrinsicElements['mesh']) => (
  <mesh {...p}>
    <boxGeometry args={[0.02, 0.12, 0.14]} />
    <meshStandardMaterial color="#FFFFFF" emissive={night ? '#FFE08A' : '#000000'} emissiveIntensity={night ? 1.2 : 0} />
  </mesh>
);

/** depan bangunan = arah +x */
function Garage({ color, night }: M) {
  return (
    <group>
      <mesh position={[0, 0.27, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.54, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* atap datar */}
      <mesh position={[0, 0.57, 0]} castShadow>
        <boxGeometry args={[0.88, 0.06, 0.88]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      {/* rolling door */}
      <mesh position={[0.405, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.38, 0.52]} />
        <meshStandardMaterial color="#D5DAE0" />
      </mesh>
      {[0.06, 0.12, 0.18, 0.24, 0.3, 0.36].map((y) => (
        <mesh key={y} position={[0.418, y, 0]}>
          <boxGeometry args={[0.005, 0.012, 0.52]} />
          <meshStandardMaterial color="#AEB6C0" />
        </mesh>
      ))}
      {/* papan nama */}
      <mesh position={[0.3, 0.72, 0]} castShadow>
        <boxGeometry args={[0.04, 0.2, 0.6]} />
        <meshStandardMaterial color="#1F2A3A" />
      </mesh>
      <mesh position={[0.323, 0.72, 0]}>
        <boxGeometry args={[0.005, 0.07, 0.42]} />
        <meshStandardMaterial color={color} emissive={night ? color : '#000000'} emissiveIntensity={night ? 0.8 : 0} />
      </mesh>
      <Win night={night} position={[0.12, 0.38, 0.405]} rotation={[0, Math.PI / 2, 0]} />
      <Win night={night} position={[-0.18, 0.38, 0.405]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

function Warehouse({ color, night }: M) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.86, 0.6, 0.86]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* atap pelana */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0, 0.7, s * 0.21]} rotation={[s * 0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.94, 0.04, 0.5]} />
          <meshStandardMaterial color="#F4F1EA" />
        </mesh>
      ))}
      {/* segitiga depan-belakang */}
      {[0.43, -0.43].map((x) => (
        <mesh key={x} position={[x, 0.6, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.001, 0.48, 0.24, 3, 1, false]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* pintu besar */}
      <mesh position={[0.435, 0.24, 0]}>
        <boxGeometry args={[0.02, 0.46, 0.46]} />
        <meshStandardMaterial color="#6E64C9" />
      </mesh>
      <mesh position={[0.447, 0.24, 0]}>
        <boxGeometry args={[0.005, 0.46, 0.02]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      {/* kardus */}
      {[[0.55, 0.07, 0.3], [0.55, 0.07, 0.16], [0.55, 0.2, 0.23]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.13, 0.13, 0.13]} />
          <meshStandardMaterial color={i === 2 ? '#C99A64' : '#D9B07A'} />
        </mesh>
      ))}
      <Win night={night} position={[0, 0.42, 0.435]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

function GasStation({ color, night }: M) {
  return (
    <group>
      {/* kios */}
      <mesh position={[-0.27, 0.19, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.38, 0.7]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      <Win night={night} position={[-0.115, 0.22, 0.15]} />
      <Win night={night} position={[-0.115, 0.22, -0.15]} />
      {/* tiang kanopi */}
      {[[0.3, 0.3], [0.3, -0.3], [-0.05, 0.3], [-0.05, -0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.27, z]} castShadow>
          <boxGeometry args={[0.04, 0.54, 0.04]} />
          <meshStandardMaterial color="#F4F1EA" />
        </mesh>
      ))}
      {/* kanopi */}
      <mesh position={[0.12, 0.58, 0]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.84]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      <mesh position={[0.12, 0.58, 0]}>
        <boxGeometry args={[0.61, 0.04, 0.85]} />
        <meshStandardMaterial color={color} emissive={night ? color : '#000000'} emissiveIntensity={night ? 0.6 : 0} />
      </mesh>
      {/* pompa */}
      {[0.17, -0.17].map((z) => (
        <group key={z} position={[0.13, 0, z]}>
          <mesh position={[0, 0.13, 0]} castShadow>
            <boxGeometry args={[0.1, 0.26, 0.12]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0.051, 0.18, 0]}>
            <boxGeometry args={[0.005, 0.06, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" emissive={night ? '#FFFFFF' : '#000000'} emissiveIntensity={night ? 0.8 : 0} />
          </mesh>
        </group>
      ))}
      {/* tiang papan harga */}
      <mesh position={[0.38, 0.45, 0.42]} castShadow>
        <boxGeometry args={[0.03, 0.9, 0.03]} />
        <meshStandardMaterial color="#5B6577" />
      </mesh>
      <mesh position={[0.38, 0.86, 0.42]} castShadow>
        <boxGeometry args={[0.04, 0.2, 0.18]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function TollGate({ color, night }: M) {
  return (
    <group>
      {/* bilik gardu */}
      {[0.28, -0.28].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.34, 0.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <Win night={night} position={[0.121, 0.22, 0]} />
          {/* palang */}
          <mesh position={[0.2, 0.2, -Math.sign(z) * 0.14]} castShadow>
            <boxGeometry args={[0.03, 0.03, 0.28]} />
            <meshStandardMaterial color="#E0704F" />
          </mesh>
          <mesh position={[0.2, 0.2, -Math.sign(z) * 0.06]}>
            <boxGeometry args={[0.032, 0.032, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
      {/* tiang & atap */}
      {[0.42, -0.42].map((z) => (
        <mesh key={z} position={[0, 0.28, z]} castShadow>
          <boxGeometry args={[0.05, 0.56, 0.05]} />
          <meshStandardMaterial color="#F4F1EA" />
        </mesh>
      ))}
      <mesh position={[0, 0.59, 0]} castShadow>
        <boxGeometry args={[0.42, 0.07, 0.98]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      <mesh position={[0.212, 0.59, 0]}>
        <boxGeometry args={[0.005, 0.04, 0.8]} />
        <meshStandardMaterial color={color} emissive={night ? color : '#000000'} emissiveIntensity={night ? 0.8 : 0} />
      </mesh>
    </group>
  );
}

function PostOffice({ color, night }: M) {
  return (
    <group>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.64, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* pita putih fasad + atap */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.82]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      <mesh position={[0, 0.67, 0]} castShadow>
        <boxGeometry args={[0.84, 0.06, 0.86]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      {/* pintu */}
      <mesh position={[0.395, 0.16, 0]}>
        <boxGeometry args={[0.02, 0.3, 0.2]} />
        <meshStandardMaterial color="#2F8F80" />
      </mesh>
      <Win night={night} position={[0.395, 0.38, 0.24]} />
      <Win night={night} position={[0.395, 0.38, -0.24]} />
      {/* kotak surat */}
      <group position={[0.56, 0, 0.3]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.24, 16]} />
          <meshStandardMaterial color="#F08A3C" />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#F08A3C" />
        </mesh>
      </group>
      {/* tiang bendera */}
      <mesh position={[-0.2, 0.92, -0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        <meshStandardMaterial color="#C9D2CC" />
      </mesh>
      <mesh position={[-0.2, 1.1, -0.12]}>
        <boxGeometry args={[0.01, 0.07, 0.14]} />
        <meshStandardMaterial color="#E0704F" />
      </mesh>
      <mesh position={[-0.2, 1.03, -0.12]}>
        <boxGeometry args={[0.01, 0.07, 0.14]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

export const LABEL_Y: Record<PlaceKey, number> = { garasi: 1.05, gudang: 1.15, bensin: 1.2, tol: 0.95, pos: 1.35 };

export function PlaceModel({ kind, color, night }: { kind: PlaceKey } & M) {
  switch (kind) {
    case 'garasi': return <Garage color={color} night={night} />;
    case 'gudang': return <Warehouse color={color} night={night} />;
    case 'bensin': return <GasStation color={color} night={night} />;
    case 'tol': return <TollGate color={color} night={night} />;
    case 'pos': return <PostOffice color={color} night={night} />;
  }
}