import { useEffect, useRef } from "react";

/**
 * Adsterra 320x50 banner slot.
 * Replace ADSTERRA_KEY_320x50 with your Adsterra key.
 * Set width/height and script src per your Adsterra dashboard.
 */
const ADSTERRA_KEY_320x50 = "a4e73aa7b810bddbfa148d0e8fc3cc78";

export function AdBanner320x50() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ADSTERRA_KEY_320x50 || !ref.current) return;
    const container = ref.current;
    container.innerHTML = "";
    const config = document.createElement("script");
    config.type = "text/javascript";
    config.innerHTML = `
      atOptions = {
        'key' : '${ADSTERRA_KEY_320x50}',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;
    const invoke = document.createElement("script");
    invoke.type = "text/javascript";
    invoke.src = `//www.highperformanceformat.com/${ADSTERRA_KEY_320x50}/invoke.js`;
    container.appendChild(config);
    container.appendChild(invoke);
  }, []);

  return (
    <div className="flex w-full justify-center border-t border-border bg-card py-2">
      <div
        ref={ref}
        style={{ width: 320, height: 50 }}
        className="flex items-center justify-center rounded bg-muted text-xs text-muted-foreground"
        aria-label="Advertisement"
      >
        {!ADSTERRA_KEY_320x50 && <span>Adsterra 320×50 · add key</span>}
      </div>
    </div>
  );
}
