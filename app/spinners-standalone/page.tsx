"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerGradient,
} from "@/components/pixel-spinner";
import { CopyButton } from "@/components/ui/copy-button";
import { PREMIUM_LIBRARY } from "@/lib/spinner-patterns";
import {
  PRESETS,
  SAVED_PATTERNS_STORAGE_KEY,
  effectiveRotation,
  rotatePattern,
  scalePattern,
  type SavedPattern,
} from "@/components/spinners/playground";

// Gallery renders every spinner at 75% of its authored size.
const SCALE = 0.75;
const DEFAULT_CELL = 14;
const DEFAULT_GAP = 2;

// Presets each ship as their own registry item; saved patterns exist only in
// this browser, so they install the base engine and supply their own frames.
const PRESET_COMMAND = (name: string) =>
  `npx shadcn@latest add @d2/spinner-${name}`;
const BASE_COMMAND = "npx shadcn@latest add @d2/pixel-spinner";

function readSavedPatterns(): SavedPattern[] {
  try {
    const raw = window.localStorage.getItem(SAVED_PATTERNS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPattern[]) : [];
  } catch {
    return [];
  }
}

function SavedSpinner({ saved }: { saved: SavedPattern }) {
  const p = saved.prefs;
  const rotated = rotatePattern(
    { rows: saved.rows, cols: saved.cols, frames: saved.frames },
    // Saved patterns have no natural direction, so "e" is the identity.
    effectiveRotation("e", p?.direction ?? "e")
  );
  const rows = p?.gridRows || rotated.rows || saved.rows;
  const cols = p?.gridCols || rotated.cols || saved.cols;
  const pattern = scalePattern(rotated, rows, cols);

  const preset = PRESETS.find((x) => x.id === p?.presetId);
  const gradient: SpinnerGradient | undefined =
    p?.colorMode === "gradient"
      ? { from: p.gradientFrom, to: p.gradientTo, glow: p.gradientGlow }
      : undefined;
  const customColor =
    p?.colorMode === "custom"
      ? p.customColor
      : p?.colorMode === "preset"
        ? preset?.hex
        : undefined;
  const color: SpinnerColor =
    (p?.colorMode === "preset" && preset?.builtin) || p?.color || "blue";

  return (
    <PixelSpinner
      pattern={pattern}
      color={color}
      customColor={customColor}
      gradient={gradient}
      cellSize={(p?.cellSize ?? DEFAULT_CELL) * SCALE}
      gap={(p?.gap ?? DEFAULT_GAP) * SCALE}
      intervalOverride={p?.speed}
      glow={p?.glow}
      shape={p?.shape}
      animation={p?.animation}
      pop={p?.popOnPeak}
      popStrength={p?.popStrength}
      popDuration={p?.popDuration}
    />
  );
}

function Cell({
  name,
  command,
  children,
}: {
  name: string;
  command: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20 hover:bg-white/[0.04]">
      <CopyButton
        value={command}
        title={command}
        aria-label={`Copy install command for ${name}`}
        className="absolute right-2 top-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      />
      <div
        className="flex items-center justify-center"
        style={{ height: 176 }}
      >
        {children}
      </div>
      <p className="truncate border-t border-white/[0.06] px-4 py-2.5 font-mono text-[11px] text-white/50">
        {name}
      </p>
    </div>
  );
}

export default function SpinnersStandalonePage() {
  const [saved, setSaved] = React.useState<SavedPattern[]>([]);

  // Re-read on mount, on writes from the /spinners tab, and on refocus
  // (the storage event does not fire in the tab that wrote it).
  React.useEffect(() => {
    const sync = () => setSaved(readSavedPatterns());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return (
    // .luminous-spinners scopes every .cell / .spinner-grid rule in globals.css
    <main className="luminous-spinners min-h-screen bg-black px-8 py-12 text-white">
      <h1 className="text-2xl font-bold">Spinners</h1>

      <h2 className="mt-10 text-xs uppercase tracking-[0.3em] text-white/40">
        Saved ({saved.length})
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((s) => (
          <Cell key={s.id} name={s.name} command={BASE_COMMAND}>
            <SavedSpinner saved={s} />
          </Cell>
        ))}
        {saved.length === 0 && (
          <p className="col-span-full text-sm text-white/40">
            Nothing saved yet — save a pattern on /spinners and it shows up here.
          </p>
        )}
      </div>

      <h2 className="mt-12 text-xs uppercase tracking-[0.3em] text-white/40">
        Presets ({PREMIUM_LIBRARY.length})
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PREMIUM_LIBRARY.map((s) => (
          <Cell key={s.name} name={s.name} command={PRESET_COMMAND(s.name)}>
            <PixelSpinner
              pattern={s.pattern}
              color={s.color}
              cellSize={DEFAULT_CELL * SCALE}
              gap={DEFAULT_GAP * SCALE}
            />
          </Cell>
        ))}
      </div>
    </main>
  );
}
