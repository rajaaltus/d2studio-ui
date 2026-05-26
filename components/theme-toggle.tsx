"use client";

import { useTheme } from "@/components/theme-provider";
import { D2Toggle } from "@/components/d2-toggle";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <D2Toggle
      checked={isDark}
      onCheckedChange={(next) => setTheme(next ? "dark" : "light")}
      width={62}
      height={36}
      animated={mounted}
      aria-label="Toggle theme"
    />
  );
}
