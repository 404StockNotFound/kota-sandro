export const N = 12;

export const isShortcut = (r: number, c: number) => r === 10 && c > 3 && c < 8;

export function isRoad(r: number, c: number, tolOpen: boolean) {
  if (r < 0 || c < 0 || r >= N || c >= N) return false;
  if (r === 5 || c === 3 || c === 8) return true;
  if (isShortcut(r, c)) return tolOpen || c !== 6; // palang di (10,6)
  return false;
}

export const TREES: [number, number][] = [
  [0, 0], [0, 5], [1, 10], [3, 0], [3, 6], [4, 11], [7, 1], [7, 6], [9, 1],
  [9, 5], [11, 2], [11, 6], [0, 9], [7, 11], [4, 6], [11, 11],
];