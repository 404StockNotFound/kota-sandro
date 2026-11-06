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


/** Cari rute terpendek lewat jalan (BFS). Hasilnya daftar sel, termasuk sel awal. */
export function findPath(from: [number, number], to: [number, number], tolOpen: boolean): [number, number][] | null {
  const key = (r: number, c: number) => r * N + c;
  const prev = new Map<number, number>();
  const start = key(from[0], from[1]);
  const goal = key(to[0], to[1]);
  prev.set(start, -1);
  const queue: [number, number][] = [from];
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (key(r, c) === goal) break;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc, k = key(nr, nc);
      if (prev.has(k) || !isRoad(nr, nc, tolOpen)) continue;
      prev.set(k, key(r, c));
      queue.push([nr, nc]);
    }
  }
  if (!prev.has(goal)) return null;
  const path: [number, number][] = [];
  for (let k = goal; k !== -1; k = prev.get(k)!) path.unshift([Math.floor(k / N), k % N]);
  return path;
}

/** Papan buku tamu di kota */
export const GUESTBOOK_CELL: [number, number] = [4, 4];