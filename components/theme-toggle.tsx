"use client";

import { useTheme } from "@/components/theme-provider";
import { D2Toggle } from "@/components/d2-toggle";
import { D2ToggleLite } from "@/components/d2-toggle-lite";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const onChange = (next: boolean) => setTheme(next ? "dark" : "light");

  return (
    <>
      <D2ToggleLite
        checked={isDark}
        onCheckedChange={onChange}
        aria-label="Toggle theme"
        className="lg:hidden"
      />
      <D2Toggle
        checked={isDark}
        onCheckedChange={onChange}
        width={62}
        height={36}
        animated={mounted}
        aria-label="Toggle theme"
        className="hidden lg:inline-flex"
      />
    </>
  );
}
