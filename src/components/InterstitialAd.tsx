import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/** Adsterra 160x300 (portrait) interstitial. Replace key below. */
const ADSTERRA_KEY_160x300 = ""; // <-- paste your Adsterra 160x300 key here

export function InterstitialAd({
  onClose,
  seconds = 5,
  label = "Ad",
}: {
  onClose: () => void;
  seconds?: number;
  label?: string;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ADSTERRA_KEY_160x300 || !adRef.current) return;
    const container = adRef.current;
    container.innerHTML = "";
    const config = document.createElement("script");
    config.type = "text/javascript";
    config.innerHTML = `
      atOptions = {
        'key' : '${ADSTERRA_KEY_160x300}',
        'format' : 'iframe',
        'height' : 300,
        'width' : 160,
        'params' : {}
      };
    `;
    const invoke = document.createElement("script");
    invoke.type = "text/javascript";
    invoke.src = `//www.highperformanceformat.com/${ADSTERRA_KEY_160x300}/invoke.js`;
    container.appendChild(config);
    container.appendChild(invoke);
  }, []);

  const canClose = remaining === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement"
    >
      <div className="relative rounded-lg bg-card p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
          {canClose ? (
            <button
              onClick={onClose}
              aria-label="Close ad"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background transition hover:opacity-80"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">
              {remaining}
            </span>
          )}
        </div>
        <div
          ref={adRef}
          style={{ width: 160, height: 300 }}
          className="flex items-center justify-center rounded bg-muted text-center text-xs text-muted-foreground"
        >
          {!ADSTERRA_KEY_160x300 && (
            <span className="px-2">Adsterra 160×300 · add key</span>
          )}
        </div>
      </div>
    </div>
  );
}
