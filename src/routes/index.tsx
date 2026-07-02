import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FlowGame } from "@/components/FlowGame";
import { AdBanner320x50 } from "@/components/AdBanner";
import { InterstitialAd } from "@/components/InterstitialAd";
import { LEVELS } from "@/lib/levels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flow Connect · 40 Level Puzzle Game" },
      {
        name: "description",
        content:
          "Play Flow Connect — connect the colored dots without crossing lines. 40 handcrafted levels of increasing difficulty.",
      },
      { property: "og:title", content: "Flow Connect · 40 Level Puzzle Game" },
      {
        property: "og:description",
        content: "Connect the dots, fill the grid, beat 40 puzzles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "flow-connect-progress";

function Index() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingNext, setPendingNext] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { levelIndex?: number; maxUnlocked?: number };
        if (typeof data.maxUnlocked === "number") setMaxUnlocked(data.maxUnlocked);
        if (typeof data.levelIndex === "number") setLevelIndex(data.levelIndex);
      }
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ levelIndex, maxUnlocked }));
  }, [levelIndex, maxUnlocked]);

  const handleComplete = () => {
    const next = Math.min(levelIndex + 1, LEVELS.length - 1);
    setMaxUnlocked((m) => Math.max(m, next));
    if (levelIndex >= LEVELS.length - 1) return; // last level
    setPendingNext(next);
    setShowInterstitial(true);
  };

  const closeInterstitial = () => {
    setShowInterstitial(false);
    if (pendingNext !== null) {
      setLevelIndex(pendingNext);
      setPendingNext(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border/60 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <h1 className="neon-text text-lg font-bold uppercase tracking-[0.25em]">Flow ∙ Connect</h1>
          <div className="text-xs text-muted-foreground">
            {maxUnlocked + 1}/{LEVELS.length}
          </div>
        </div>
      </header>


      <main className="flex flex-1 flex-col items-center justify-center px-3 py-4">
        <FlowGame
          levelIndex={levelIndex}
          onComplete={handleComplete}
          onPrev={() => setLevelIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLevelIndex((i) => Math.min(maxUnlocked, i + 1))}
          canNext={levelIndex < maxUnlocked}
        />

        <details className="mt-4 w-full max-w-md rounded-md border border-border bg-card p-2 text-sm">
          <summary className="cursor-pointer px-1 py-1 font-medium">Level Select</summary>
          <div className="mt-2 grid grid-cols-8 gap-1">
            {LEVELS.map((_, i) => {
              const locked = i > maxUnlocked;
              const active = i === levelIndex;
              return (
                <button
                  key={i}
                  onClick={() => !locked && setLevelIndex(i)}
                  disabled={locked}
                  className={`aspect-square rounded text-xs font-semibold transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : locked
                        ? "bg-muted text-muted-foreground opacity-50"
                        : "bg-secondary text-secondary-foreground hover:opacity-80"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </details>

        <p className="mt-3 max-w-md px-2 text-center text-xs text-muted-foreground">
          Drag from a colored dot to its twin. Fill every square, don't cross lines.
        </p>
      </main>

      <AdBanner320x50 />

      {showInterstitial && <InterstitialAd onClose={closeInterstitial} />}
    </div>
  );
}
