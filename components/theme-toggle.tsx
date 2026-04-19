"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolved = mounted ? theme : "light";
  const isDark = resolved === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      className="relative inline-flex h-7 w-14 items-center rounded-full border border-border bg-muted transition-colors"
    >
      <span
        className={
          "absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-300 " +
          (isDark ? "translate-x-[28px]" : "translate-x-0.5")
        }
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}