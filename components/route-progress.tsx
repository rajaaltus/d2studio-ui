"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

function RouteProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const finishTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }
      if (anchor.hasAttribute("download")) return;

      if (finishTimer.current) {
        window.clearTimeout(finishTimer.current);
        finishTimer.current = null;
      }
      setActive(true);
      setProgress(8);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  React.useEffect(() => {
    if (!active) return;
    if (progress >= 90) return;
    const id = window.setInterval(() => {
      setProgress((p) => Math.min(p + Math.max(1, (90 - p) * 0.12), 90));
    }, 120);
    return () => window.clearInterval(id);
  }, [active, progress]);

  React.useEffect(() => {
    if (!active) return;
    setProgress(100);
    if (finishTimer.current) window.clearTimeout(finishTimer.current);
    finishTimer.current = window.setTimeout(() => {
      setActive(false);
      setProgress(0);
      finishTimer.current = null;
    }, 280);
    return () => {
      if (finishTimer.current) {
        window.clearTimeout(finishTimer.current);
        finishTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
    >
      <div
        className="h-full origin-left transition-[width] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          background: "var(--d2-flash-gradient)",
          boxShadow: "0 0 12px rgba(120, 92, 255, 0.55)",
        }}
      />
    </div>
  );
}

export function RouteProgress() {
  return (
    <React.Suspense fallback={null}>
      <RouteProgressInner />
    </React.Suspense>
  );
}
