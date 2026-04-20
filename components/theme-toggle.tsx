"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function readInitialIsDark(): boolean | null {
  if (typeof document === "undefined") return null;
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [transitionReady, setTransitionReady] = useState(false);
  const firstPaintRef = useRef(true);

  useEffect(() => {
    if (resolvedTheme) setIsDark(resolvedTheme === "dark");
    else setIsDark(readInitialIsDark() ?? false);
  }, [resolvedTheme]);

  useEffect(() => {
    if (firstPaintRef.current) {
      firstPaintRef.current = false;
      const id = requestAnimationFrame(() => setTransitionReady(true));
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const dark = isDark ?? false;

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle theme"
      suppressHydrationWarning
      className="relative inline-flex h-7 w-14 items-center rounded-full border border-border bg-muted transition-colors"
    >
      <span
        suppressHydrationWarning
        className={
          "absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm " +
          (transitionReady ? "transition-transform duration-300 " : "") +
          (dark ? "translate-x-[28px]" : "translate-x-0.5")
        }
      >
        {isDark === null ? null : dark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}