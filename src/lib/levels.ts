// Flow Connect levels.
// Each level: grid size + list of colored endpoint pairs.
// Coordinates are [row, col], 0-indexed.
export type Endpoint = { color: string; a: [number, number]; b: [number, number] };
export type Level = { size: number; endpoints: Endpoint[] };

const C = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  cyan: "#06b6d4",
  pink: "#ec4899",
  purple: "#a855f7",
  lime: "#84cc16",
  teal: "#14b8a6",
};

// Helper for compact declaration
const L = (size: number, ...eps: [string, number, number, number, number][]): Level => ({
  size,
  endpoints: eps.map(([c, r1, c1, r2, c2]) => ({
    color: (C as Record<string, string>)[c],
    a: [r1, c1],
    b: [r2, c2],
  })),
});

export const LEVELS: Level[] = [
  // 5x5 — easy intro (1-8)
  L(5, ["red", 0, 0, 1, 4], ["blue", 1, 1, 4, 4], ["green", 2, 1, 3, 2], ["yellow", 2, 0, 4, 3]),
  L(5, ["red", 0, 0, 4, 1], ["blue", 0, 2, 3, 3], ["green", 2, 1, 4, 4], ["yellow", 0, 4, 2, 4]),
  L(5, ["red", 0, 1, 4, 3], ["blue", 1, 3, 3, 1], ["green", 2, 2, 4, 4], ["yellow", 0, 4, 4, 0]),
  L(5, ["red", 0, 0, 2, 3], ["blue", 1, 1, 4, 4], ["green", 2, 0, 3, 3], ["yellow", 0, 4, 4, 2], ["orange", 3, 0, 4, 1]),
  L(5, ["red", 0, 2, 3, 2], ["blue", 1, 1, 4, 1], ["green", 1, 3, 4, 3], ["yellow", 2, 0, 2, 4], ["orange", 0, 0, 4, 4]),
  L(5, ["red", 0, 0, 4, 4], ["blue", 0, 4, 4, 0], ["green", 1, 1, 3, 3], ["yellow", 1, 3, 3, 1], ["orange", 2, 2, 0, 2]),
  L(5, ["red", 0, 0, 1, 2], ["blue", 0, 2, 3, 4], ["green", 0, 4, 4, 4], ["yellow", 2, 1, 4, 3], ["orange", 3, 0, 4, 0], ["cyan", 4, 1, 4, 2]),
  L(5, ["red", 0, 1, 2, 3], ["blue", 1, 0, 4, 3], ["green", 1, 2, 3, 4], ["yellow", 2, 0, 4, 1], ["orange", 0, 3, 3, 3], ["cyan", 0, 4, 4, 4]),

  // 6x6 — building (9-18)
  L(6, ["red", 0, 0, 5, 5], ["blue", 0, 5, 5, 0], ["green", 1, 1, 4, 4], ["yellow", 1, 4, 4, 1], ["orange", 2, 2, 3, 3]),
  L(6, ["red", 0, 1, 5, 4], ["blue", 1, 0, 4, 5], ["green", 2, 2, 3, 3], ["yellow", 0, 4, 5, 1], ["orange", 1, 3, 4, 2], ["cyan", 0, 0, 5, 5]),
  L(6, ["red", 0, 0, 3, 3], ["blue", 0, 3, 3, 0], ["green", 1, 1, 4, 4], ["yellow", 2, 5, 5, 5], ["orange", 5, 0, 5, 2], ["cyan", 0, 5, 4, 1]),
  L(6, ["red", 0, 2, 5, 3], ["blue", 1, 1, 4, 4], ["green", 2, 0, 3, 5], ["yellow", 0, 0, 5, 5], ["orange", 0, 5, 5, 0], ["cyan", 1, 3, 4, 2]),
  L(6, ["red", 0, 0, 2, 2], ["blue", 0, 5, 2, 3], ["green", 3, 2, 5, 0], ["yellow", 3, 3, 5, 5], ["orange", 1, 2, 4, 3], ["cyan", 1, 3, 4, 2], ["pink", 0, 2, 5, 2]),
  L(6, ["red", 0, 0, 5, 0], ["blue", 0, 5, 5, 5], ["green", 1, 1, 4, 4], ["yellow", 1, 4, 4, 1], ["orange", 2, 2, 3, 3], ["cyan", 0, 2, 5, 3], ["pink", 2, 0, 3, 5]),
  L(6, ["red", 0, 1, 4, 4], ["blue", 0, 4, 4, 1], ["green", 1, 2, 3, 3], ["yellow", 2, 1, 3, 4], ["orange", 0, 0, 5, 5], ["cyan", 0, 5, 5, 0], ["pink", 5, 1, 5, 4]),
  L(6, ["red", 0, 0, 5, 5], ["blue", 0, 5, 5, 0], ["green", 2, 2, 3, 3], ["yellow", 2, 3, 3, 2], ["orange", 1, 0, 0, 1], ["cyan", 4, 0, 5, 1], ["pink", 0, 4, 1, 5], ["purple", 4, 5, 5, 4]),
  L(6, ["red", 0, 0, 5, 0], ["blue", 0, 5, 5, 5], ["green", 0, 2, 5, 3], ["yellow", 1, 1, 4, 4], ["orange", 1, 4, 4, 1], ["cyan", 2, 2, 3, 3], ["pink", 0, 1, 5, 4], ["purple", 0, 4, 5, 1]),
  L(6, ["red", 1, 1, 4, 4], ["blue", 1, 4, 4, 1], ["green", 2, 2, 3, 3], ["yellow", 0, 0, 5, 5], ["orange", 0, 5, 5, 0], ["cyan", 0, 2, 5, 3], ["pink", 2, 0, 3, 5], ["purple", 0, 3, 5, 2]),

  // 7x7 — intermediate (19-28)
  L(7, ["red", 0, 0, 6, 6], ["blue", 0, 6, 6, 0], ["green", 1, 1, 5, 5], ["yellow", 1, 5, 5, 1], ["orange", 2, 2, 4, 4], ["cyan", 2, 4, 4, 2], ["pink", 3, 3, 0, 3]),
  L(7, ["red", 0, 0, 3, 3], ["blue", 0, 6, 3, 3 - 3], ["green", 6, 0, 3, 4], ["yellow", 6, 6, 4, 3], ["orange", 1, 3, 5, 3], ["cyan", 3, 1, 3, 5], ["pink", 0, 3, 6, 3]),
  L(7, ["red", 0, 0, 6, 0], ["blue", 0, 6, 6, 6], ["green", 0, 3, 6, 3], ["yellow", 3, 0, 3, 6], ["orange", 1, 1, 5, 5], ["cyan", 1, 5, 5, 1], ["pink", 2, 2, 4, 4], ["purple", 2, 4, 4, 2]),
  L(7, ["red", 0, 1, 6, 5], ["blue", 1, 0, 5, 6], ["green", 0, 5, 6, 1], ["yellow", 1, 6, 5, 0], ["orange", 2, 2, 4, 4], ["cyan", 2, 4, 4, 2], ["pink", 3, 3, 0, 3], ["purple", 3, 0, 3, 6]),
  L(7, ["red", 0, 0, 6, 6], ["blue", 0, 6, 6, 0], ["green", 1, 2, 5, 4], ["yellow", 2, 1, 4, 5], ["orange", 1, 4, 5, 2], ["cyan", 2, 5, 4, 1], ["pink", 3, 3, 0, 3], ["purple", 6, 3, 3, 0], ["lime", 3, 6, 6, 3]),
  L(7, ["red", 0, 0, 3, 6], ["blue", 0, 6, 6, 3], ["green", 6, 6, 3, 0], ["yellow", 6, 0, 0, 3], ["orange", 1, 1, 5, 5], ["cyan", 1, 5, 5, 1], ["pink", 2, 2, 4, 4], ["purple", 2, 4, 4, 2], ["lime", 3, 3, 0, 0 + 0]),
  L(7, ["red", 0, 0, 6, 0], ["blue", 0, 6, 6, 6], ["green", 0, 1, 6, 1], ["yellow", 0, 5, 6, 5], ["orange", 1, 2, 5, 4], ["cyan", 1, 4, 5, 2], ["pink", 2, 3, 4, 3], ["purple", 3, 0, 3, 6], ["lime", 0, 3, 6, 3]),
  L(7, ["red", 0, 0, 6, 6], ["blue", 6, 0, 0, 6], ["green", 1, 1, 5, 5], ["yellow", 5, 1, 1, 5], ["orange", 2, 2, 4, 4], ["cyan", 4, 2, 2, 4], ["pink", 3, 0, 3, 6], ["purple", 0, 3, 6, 3], ["lime", 3, 3, 3, 2]),
  L(7, ["red", 0, 0, 6, 6], ["blue", 0, 6, 6, 0], ["green", 0, 2, 6, 4], ["yellow", 0, 4, 6, 2], ["orange", 2, 0, 4, 6], ["cyan", 4, 0, 2, 6], ["pink", 1, 3, 5, 3], ["purple", 3, 1, 3, 5], ["lime", 3, 3, 0, 0 + 0]),
  L(7, ["red", 0, 0, 6, 0], ["blue", 0, 6, 6, 6], ["green", 0, 3, 6, 3], ["yellow", 3, 0, 3, 6], ["orange", 1, 1, 5, 5], ["cyan", 5, 1, 1, 5], ["pink", 2, 2, 4, 4], ["purple", 4, 2, 2, 4], ["lime", 3, 3, 3, 2]),

  // 8x8 — challenging (29-36)
  L(8, ["red", 0, 0, 7, 7], ["blue", 0, 7, 7, 0], ["green", 1, 1, 6, 6], ["yellow", 1, 6, 6, 1], ["orange", 2, 2, 5, 5], ["cyan", 2, 5, 5, 2], ["pink", 3, 3, 4, 4], ["purple", 3, 4, 4, 3], ["lime", 0, 3, 7, 4], ["teal", 3, 0, 4, 7]),
  L(8, ["red", 0, 0, 7, 0], ["blue", 0, 7, 7, 7], ["green", 0, 1, 7, 6], ["yellow", 0, 6, 7, 1], ["orange", 1, 2, 6, 5], ["cyan", 1, 5, 6, 2], ["pink", 2, 3, 5, 4], ["purple", 2, 4, 5, 3], ["lime", 3, 3, 4, 4], ["teal", 3, 4, 4, 3]),
  L(8, ["red", 0, 0, 7, 7], ["blue", 7, 0, 0, 7], ["green", 1, 1, 6, 6], ["yellow", 6, 1, 1, 6], ["orange", 2, 2, 5, 5], ["cyan", 5, 2, 2, 5], ["pink", 3, 3, 4, 4], ["purple", 4, 3, 3, 4], ["lime", 0, 4, 7, 3], ["teal", 4, 0, 3, 7]),
  L(8, ["red", 0, 0, 3, 7], ["blue", 0, 7, 7, 3], ["green", 7, 7, 4, 0], ["yellow", 7, 0, 0, 4], ["orange", 1, 1, 6, 6], ["cyan", 1, 6, 6, 1], ["pink", 2, 2, 5, 5], ["purple", 2, 5, 5, 2], ["lime", 3, 3, 4, 4], ["teal", 3, 4, 4, 3]),
  L(8, ["red", 0, 2, 7, 5], ["blue", 0, 5, 7, 2], ["green", 2, 0, 5, 7], ["yellow", 2, 7, 5, 0], ["orange", 0, 0, 7, 7], ["cyan", 0, 7, 7, 0], ["pink", 3, 3, 4, 4], ["purple", 3, 4, 4, 3], ["lime", 1, 3, 6, 4], ["teal", 3, 1, 4, 6]),
  L(8, ["red", 0, 1, 6, 7], ["blue", 1, 0, 7, 6], ["green", 0, 6, 6, 0], ["yellow", 1, 7, 7, 1], ["orange", 2, 2, 5, 5], ["cyan", 2, 5, 5, 2], ["pink", 3, 3, 4, 4], ["purple", 3, 4, 4, 3], ["lime", 0, 3, 7, 4], ["teal", 3, 0, 4, 7]),
  L(8, ["red", 0, 0, 7, 7], ["blue", 0, 7, 7, 0], ["green", 0, 3, 7, 4], ["yellow", 3, 0, 4, 7], ["orange", 1, 1, 6, 6], ["cyan", 1, 6, 6, 1], ["pink", 2, 2, 5, 5], ["purple", 2, 5, 5, 2], ["lime", 3, 3, 4, 4], ["teal", 3, 4, 4, 3]),
  L(8, ["red", 0, 0, 7, 0], ["blue", 0, 7, 7, 7], ["green", 0, 3, 7, 3], ["yellow", 0, 4, 7, 4], ["orange", 3, 0, 3, 7], ["cyan", 4, 0, 4, 7], ["pink", 1, 1, 6, 6], ["purple", 1, 6, 6, 1], ["lime", 2, 2, 5, 5], ["teal", 2, 5, 5, 2]),

  // 9x9 — expert (37-40)
  L(9, ["red", 0, 0, 8, 8], ["blue", 0, 8, 8, 0], ["green", 1, 1, 7, 7], ["yellow", 1, 7, 7, 1], ["orange", 2, 2, 6, 6], ["cyan", 2, 6, 6, 2], ["pink", 3, 3, 5, 5], ["purple", 3, 5, 5, 3], ["lime", 4, 0, 4, 8], ["teal", 0, 4, 8, 4]),
  L(9, ["red", 0, 0, 8, 0], ["blue", 0, 8, 8, 8], ["green", 0, 4, 8, 4], ["yellow", 4, 0, 4, 8], ["orange", 1, 1, 7, 7], ["cyan", 7, 1, 1, 7], ["pink", 2, 2, 6, 6], ["purple", 6, 2, 2, 6], ["lime", 3, 3, 5, 5], ["teal", 5, 3, 3, 5]),
  L(9, ["red", 0, 0, 8, 8], ["blue", 8, 0, 0, 8], ["green", 1, 2, 7, 6], ["yellow", 2, 1, 6, 7], ["orange", 1, 6, 7, 2], ["cyan", 2, 7, 6, 1], ["pink", 3, 3, 5, 5], ["purple", 3, 5, 5, 3], ["lime", 0, 4, 8, 4], ["teal", 4, 0, 4, 8]),
  L(9, ["red", 0, 1, 8, 7], ["blue", 1, 0, 7, 8], ["green", 0, 7, 8, 1], ["yellow", 1, 8, 7, 0], ["orange", 0, 4, 8, 4], ["cyan", 4, 0, 4, 8], ["pink", 2, 2, 6, 6], ["purple", 2, 6, 6, 2], ["lime", 3, 3, 5, 5], ["teal", 3, 5, 5, 3]),
];
