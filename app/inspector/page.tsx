"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import ProgressInspector, {
  type Variant,
  useProgressRun,
} from "@/components/progress-inspector";
import ProgressBar, {
  type BarTheme,
  DARK_THEME,
  FANCY_DARK_THEME,
  FANCY_THEME,
  LIGHT_THEME,
} from "@/registry/default/components/progress-bar";

const BASES = {
  glass: { light: LIGHT_THEME, dark: DARK_THEME },
  fancy: { light: FANCY_THEME, dark: FANCY_DARK_THEME },
};

// One centred column: the bar, the two looks under it, then the panel. No
// install/usage blocks here — this page is just the thing and its controls.
export default function Page() {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const [variant, setVariant] = useState<Variant>("glass");
  const [drafts, setDrafts] = useState<Record<string, BarTheme>>({});
  const run = useProgressRun();

  const key = `${variant}:${mode}`;
  const base = BASES[variant][mode];
  const theme = drafts[key] ?? base;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#cbcbcb] px-6 py-20 dark:bg-[#0b0b0b]">
      <header className="text-center">
        <h1 className="text-lg font-medium tracking-tight text-black dark:text-white">
          Theme Inspector
        </h1>
        <p className="mt-1 text-[11px] text-black/45 dark:text-white/45">
          Pick a look, then tune its colours.
        </p>
      </header>

      <ProgressBar value={run.value} label={run.label} theme={theme} />

      <ProgressInspector
        theme={theme}
        onChange={(t) => setDrafts((d) => ({ ...d, [key]: t }))}
        variant={variant}
        onVariantChange={setVariant}
        mode={mode}
        run={run}
      />
    </main>
  );
}
