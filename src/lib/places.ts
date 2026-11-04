export type PlaceKey = 'garasi' | 'gudang' | 'bensin' | 'tol' | 'pos';

export type Place = {
  key: PlaceKey;
  name: string;
  what: string;
  unlock: string;
  color: string;
  href: string;
  building: [number, number]; // [row, col] di peta
  parking: [number, number];
};

export const PLACES: Place[] = [
  { key: 'garasi', name: 'Garasi',     what: 'Tentang aku', unlock: 'Asap warna-warni',   color: '#F2967A', href: '/garasi',     building: [2, 2],  parking: [2, 3] },
  { key: 'gudang', name: 'Gudang',     what: 'Proyek',      unlock: 'Detail proyek', color: '#A9A2E8', href: '/gudang',     building: [2, 9],  parking: [2, 8] },
  { key: 'bensin', name: 'Pom Bensin', what: 'Skill',       unlock: 'Turbo',         color: '#F07C8C', href: '/pom-bensin', building: [6, 5],  parking: [5, 5] },
  { key: 'tol',    name: 'Jalan Tol',  what: 'Perjalanan',  unlock: 'Jalan pintas',  color: '#F4C25B', href: '/jalan-tol',  building: [6, 10], parking: [5, 10] },
  { key: 'pos',    name: 'Kantor Pos', what: 'Kontak',      unlock: 'Lampu malam',   color: '#6CC7B8', href: '/kantor-pos', building: [8, 9],  parking: [8, 8] },
];

export const getPlace = (key: PlaceKey) => PLACES.find((p) => p.key === key)!;