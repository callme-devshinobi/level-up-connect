// Procedurally generated Flow Connect levels.
// Each level is carved by random walks so every colored pair is guaranteed
// to be connectable end-to-end (the generator itself found a valid path).
export type Endpoint = { color: string; a: [number, number]; b: [number, number] };
export type Level = { size: number; endpoints: Endpoint[] };

const PALETTE = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#a855f7", // purple
  "#84cc16", // lime
  "#14b8a6", // teal
];

// Deterministic PRNG (Mulberry32) — same level index always yields same board.
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Spec = { size: number; colors: number; minLen: number };

function specFor(levelIndex: number): Spec {
  // 40 levels of steady progression.
  if (levelIndex < 8) return { size: 5, colors: 3 + Math.floor(levelIndex / 3), minLen: 3 };
  if (levelIndex < 18) return { size: 6, colors: 4 + Math.floor((levelIndex - 8) / 3), minLen: 3 };
  if (levelIndex < 28) return { size: 7, colors: 5 + Math.floor((levelIndex - 18) / 3), minLen: 4 };
  if (levelIndex < 36) return { size: 8, colors: 6 + Math.floor((levelIndex - 28) / 3), minLen: 4 };
  return { size: 9, colors: 7 + Math.floor((levelIndex - 36) / 2), minLen: 5 };
}

const DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Carve one simple path via randomized DFS on remaining free cells.
function carvePath(
  size: number,
  used: boolean[][],
  minLen: number,
  rng: () => number,
): [number, number][] | null {
  // gather free cells
  const free: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) if (!used[r][c]) free.push([r, c]);
  }
  if (free.length < minLen) return null;

  const start = free[Math.floor(rng() * free.length)];
  // Target path length: random-ish walk, weighted toward longer paths.
  const maxLen = Math.min(free.length, Math.floor(minLen + rng() * (free.length - minLen + 1)));
  const targetLen = Math.max(minLen, maxLen);

  const path: [number, number][] = [start];
  used[start[0]][start[1]] = true;

  while (path.length < targetLen) {
    const [r, c] = path[path.length - 1];
    const dirs = shuffle(DIRS, rng);
    let advanced = false;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
      if (used[nr][nc]) continue;
      path.push([nr, nc]);
      used[nr][nc] = true;
      advanced = true;
      break;
    }
    if (!advanced) break;
  }

  if (path.length < minLen) {
    // rollback
    for (const [r, c] of path) used[r][c] = false;
    return null;
  }
  return path;
}

function generateLevel(levelIndex: number): Level {
  const spec = specFor(levelIndex);
  const colors = Math.min(spec.colors, PALETTE.length);

  for (let attempt = 0; attempt < 200; attempt++) {
    const rng = makeRng(levelIndex * 1000 + attempt + 1);
    const used: boolean[][] = Array.from({ length: spec.size }, () =>
      Array.from({ length: spec.size }, () => false),
    );
    const endpoints: Endpoint[] = [];
    let ok = true;
    for (let i = 0; i < colors; i++) {
      const path = carvePath(spec.size, used, spec.minLen, rng);
      if (!path) {
        ok = false;
        break;
      }
      endpoints.push({
        color: PALETTE[i],
        a: path[0],
        b: path[path.length - 1],
      });
    }
    if (ok && endpoints.length === colors) {
      return { size: spec.size, endpoints };
    }
  }

  // Fallback: single straight-line pair (always solvable).
  const s = spec.size;
  return {
    size: s,
    endpoints: [{ color: PALETTE[0], a: [0, 0], b: [0, s - 1] }],
  };
}

export const LEVELS: Level[] = Array.from({ length: 40 }, (_, i) => generateLevel(i));
