import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, type Level } from "@/lib/levels";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type Cell = { color: string | null; isEndpoint: boolean };
type Path = { color: string; cells: [number, number][] };

const key = (r: number, c: number) => `${r},${c}`;

function buildInitialCells(level: Level): Cell[][] {
  const grid: Cell[][] = Array.from({ length: level.size }, () =>
    Array.from({ length: level.size }, () => ({ color: null, isEndpoint: false })),
  );
  for (const ep of level.endpoints) {
    grid[ep.a[0]][ep.a[1]] = { color: ep.color, isEndpoint: true };
    grid[ep.b[0]][ep.b[1]] = { color: ep.color, isEndpoint: true };
  }
  return grid;
}

export function FlowGame({
  levelIndex,
  onComplete,
  onPrev,
  onNext,
  canNext,
}: {
  levelIndex: number;
  onComplete: () => void;
  onPrev: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  const level = LEVELS[levelIndex];
  const [paths, setPaths] = useState<Record<string, [number, number][]>>({});
  const [drawing, setDrawing] = useState<{ color: string; cells: [number, number][] } | null>(null);
  const [solved, setSolved] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setPaths({});
    setDrawing(null);
    setSolved(false);
  }, []);

  useEffect(() => {
    reset();
  }, [levelIndex, reset]);

  const endpointAt = useCallback(
    (r: number, c: number) => level.endpoints.find((e) => (e.a[0] === r && e.a[1] === c) || (e.b[0] === r && e.b[1] === c)),
    [level],
  );

  // Build occupancy map from committed paths
  const occupancy = useMemo(() => {
    const map = new Map<string, string>(); // "r,c" -> color
    // committed paths
    for (const [color, cells] of Object.entries(paths)) {
      for (const [r, c] of cells) map.set(key(r, c), color);
    }
    return map;
  }, [paths]);

  const cellColor = (r: number, c: number): string | null => {
    if (drawing) {
      for (const [dr, dc] of drawing.cells) if (dr === r && dc === c) return drawing.color;
    }
    if (occupancy.has(key(r, c))) return occupancy.get(key(r, c))!;
    const ep = endpointAt(r, c);
    return ep ? ep.color : null;
  };

  const startDraw = (r: number, c: number) => {
    const ep = endpointAt(r, c);
    if (!ep) {
      // start from existing path cell -> continue that path (truncate to this cell)
      const occ = occupancy.get(key(r, c));
      if (occ) {
        const existing = paths[occ] ?? [];
        const idx = existing.findIndex(([rr, cc]) => rr === r && cc === c);
        if (idx >= 0) {
          const truncated = existing.slice(0, idx + 1);
          setPaths((p) => ({ ...p, [occ]: [] }));
          setDrawing({ color: occ, cells: truncated });
        }
      }
      return;
    }
    // start from endpoint - clear existing path of that color
    setPaths((p) => ({ ...p, [ep.color]: [] }));
    setDrawing({ color: ep.color, cells: [[r, c]] });
  };

  const extendDraw = (r: number, c: number) => {
    if (!drawing) return;
    const cells = drawing.cells;
    const last = cells[cells.length - 1];
    if (!last) return;
    // if hovering back on previous cell -> shrink
    if (cells.length >= 2) {
      const prev = cells[cells.length - 2];
      if (prev[0] === r && prev[1] === c) {
        setDrawing({ color: drawing.color, cells: cells.slice(0, -1) });
        return;
      }
    }
    // must be adjacent to last
    const dr = Math.abs(last[0] - r);
    const dc = Math.abs(last[1] - c);
    if (dr + dc !== 1) return;
    // cannot revisit our own path
    if (cells.some(([rr, cc]) => rr === r && cc === c)) return;
    // cannot enter an endpoint of a different color
    const ep = endpointAt(r, c);
    if (ep && ep.color !== drawing.color) return;
    // cannot enter another color's path — but allow overwriting our own already cleared
    const occ = occupancy.get(key(r, c));
    if (occ && occ !== drawing.color) {
      // overwrite: erase that other color's path from that cell onwards? Simpler: clear it entirely.
      setPaths((p) => ({ ...p, [occ]: [] }));
    }
    setDrawing({ color: drawing.color, cells: [...cells, [r, c]] });
  };

  const endDraw = () => {
    if (!drawing) return;
    const cells = drawing.cells;
    if (cells.length >= 2) {
      const last = cells[cells.length - 1];
      const ep = endpointAt(last[0], last[1]);
      // Commit whatever we have; only counts as "connected" if last is matching endpoint different from first
      setPaths((p) => ({ ...p, [drawing.color]: cells }));
      void ep;
    } else {
      setPaths((p) => ({ ...p, [drawing.color]: [] }));
    }
    setDrawing(null);
  };

  // Check solved: every color connected endpoint-to-endpoint AND every cell filled
  useEffect(() => {
    if (drawing) return;
    const size = level.size;
    let filled = 0;
    const allConnected = level.endpoints.every((ep) => {
      const cells = paths[ep.color];
      if (!cells || cells.length < 2) return false;
      const first = cells[0];
      const last = cells[cells.length - 1];
      const isAB =
        (first[0] === ep.a[0] && first[1] === ep.a[1] && last[0] === ep.b[0] && last[1] === ep.b[1]) ||
        (first[0] === ep.b[0] && first[1] === ep.b[1] && last[0] === ep.a[0] && last[1] === ep.a[1]);
      if (!isAB) return false;
      filled += cells.length;
      return true;
    });
    if (allConnected && filled === size * size) {
      setSolved(true);
      const t = setTimeout(() => onComplete(), 600);
      return () => clearTimeout(t);
    }
  }, [paths, drawing, level, onComplete]);

  // Pointer handlers via delegation for touch/mouse
  const cellFromEvent = (clientX: number, clientY: number): [number, number] | null => {
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    const size = level.size;
    const cellSize = rect.width / size;
    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);
    if (r < 0 || c < 0 || r >= size || c >= size) return null;
    return [r, c];
  };

  const connectedColors = useMemo(() => {
    const set = new Set<string>();
    for (const ep of level.endpoints) {
      const cells = paths[ep.color];
      if (!cells || cells.length < 2) continue;
      const first = cells[0];
      const last = cells[cells.length - 1];
      const isAB =
        (first[0] === ep.a[0] && first[1] === ep.a[1] && last[0] === ep.b[0] && last[1] === ep.b[1]) ||
        (first[0] === ep.b[0] && first[1] === ep.b[1] && last[0] === ep.a[0] && last[1] === ep.a[1]);
      if (isAB) set.add(ep.color);
    }
    return set;
  }, [paths, level]);

  const filledCount = useMemo(() => {
    let n = 0;
    for (const cells of Object.values(paths)) n += cells.length;
    return n;
  }, [paths]);

  const total = level.size * level.size;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-md items-center justify-between px-1 text-sm">
        <div className="font-semibold text-foreground">Level {levelIndex + 1} / {LEVELS.length}</div>
        <div className="text-muted-foreground">
          {connectedColors.size}/{level.endpoints.length} flows · {filledCount}/{total}
        </div>
      </div>

      <div
        ref={boardRef}
        className="relative w-full max-w-md touch-none select-none rounded-lg bg-card p-1 shadow-md"
        style={{ aspectRatio: "1 / 1" }}
        onPointerDown={(e) => {
          const cell = cellFromEvent(e.clientX, e.clientY);
          if (cell) {
            (e.target as Element).setPointerCapture?.(e.pointerId);
            startDraw(cell[0], cell[1]);
          }
        }}
        onPointerMove={(e) => {
          if (!drawing) return;
          const cell = cellFromEvent(e.clientX, e.clientY);
          if (cell) extendDraw(cell[0], cell[1]);
        }}
        onPointerUp={endDraw}
        onPointerCancel={endDraw}
      >
        <div
          className="grid h-full w-full gap-[2px] rounded-md bg-border p-[2px]"
          style={{ gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: level.size }).map((_, r) =>
            Array.from({ length: level.size }).map((__, c) => {
              const color = cellColor(r, c);
              const ep = endpointAt(r, c);
              return (
                <div
                  key={`${r}-${c}`}
                  className="relative flex items-center justify-center bg-background"
                  style={{ backgroundColor: "hsl(var(--background))" }}
                >
                  {color && !ep && (
                    <div
                      className="absolute inset-[15%] rounded-sm"
                      style={{ backgroundColor: color, opacity: 0.85 }}
                    />
                  )}
                  {ep && (
                    <div
                      className="h-[70%] w-[70%] rounded-full shadow-inner"
                      style={{ backgroundColor: ep.color }}
                    />
                  )}
                </div>
              );
            }),
          )}
        </div>
        {solved && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 text-2xl font-bold text-foreground">
            Solved!
          </div>
        )}
      </div>

      <div className="flex w-full max-w-md items-center justify-between gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={levelIndex === 0}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <Button variant="secondary" size="sm" onClick={reset}>
          <RotateCcw className="mr-1 h-4 w-4" /> Reset
        </Button>
        <Button size="sm" onClick={onNext} disabled={!canNext}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
