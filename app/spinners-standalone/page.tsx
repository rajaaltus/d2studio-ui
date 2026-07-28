"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerGradient,
} from "@/components/pixel-spinner";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { PREMIUM_LIBRARY } from "@/lib/spinner-patterns";
import {
  GRADIENTS,
  PRESETS,
  SAVED_PATTERNS_STORAGE_KEY,
  effectiveRotation,
  rotatePattern,
  scalePattern,
  type SavedPattern,
} from "@/components/spinners/playground";

const SIZES = [16, 24, 32] as const;
// Gallery shows four paints only; the full set lives on /spinners.
const STANDARD_IDS = ["pearl", "blue", "orange", "green"];
const STANDARD_PRESETS = STANDARD_IDS.map(
  (id) => PRESETS.find((p) => p.id === id)!
);
const STANDARD_GRADIENT_IDS = ["mint", "neon", "dawn", "bubblegum"];
const STANDARD_GRADIENTS = STANDARD_GRADIENT_IDS.map(
  (id) => GRADIENTS.find((g) => g.id === id)!
);
const DEFAULT_CELL = 14;
const DEFAULT_GAP = 2;
// Cells keep the authored 14:2 cell-to-gap ratio, so a pattern of any grid
// width ends up exactly `size` pixels across.
const GAP_RATIO = DEFAULT_GAP / DEFAULT_CELL;

function metrics(size: number, cols: number) {
  const cellSize = size / (cols + (cols - 1) * GAP_RATIO);
  return { cellSize, gap: cellSize * GAP_RATIO };
}

// One paint for the whole gallery: a PRESETS id, or "grad:<GRADIENTS id>".
type Paint = {
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
};

function paintFor(id: string): Paint {
  if (id.startsWith("grad:")) {
    return {
      color: "blue",
      gradient: GRADIENTS.find((g) => g.id === id.slice(5)),
    };
  }
  const p = PRESETS.find((x) => x.id === id);
  return { color: p?.builtin ?? "blue", customColor: p?.hex };
}

// Display names only — the pattern id stays the registry/install name.
const FANCY: Record<string, string> = {
  "spiral-in-5": "Helix",
  "ring-4-cw": "Halo",
  "dual-ring-5": "Binary",
  "vortex-in": "Vortex",
  "col-wave-5": "Cascade",
  "rain-4": "Drizzle",
  "tide-roll": "Tide",
  "billboard-tiles": "Mosaic",
};
// Hidden from this gallery; both still ship in the registry.
const HIDDEN = new Set(["swell-roll", "ripple-out"]);
const SHOWN = PREMIUM_LIBRARY.filter((s) => !HIDDEN.has(s.name));

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

function Swatch({
  active,
  background,
  label,
  onClick,
}: {
  active: boolean;
  background: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      style={{ background }}
      className={cn(
        "size-5 rounded-full ring-offset-2 ring-offset-black transition",
        active ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
      )}
    />
  );
}

function Panel({
  size,
  setSize,
  paintId,
  setPaintId,
}: {
  size: number;
  setSize: (s: number) => void;
  paintId: string;
  setPaintId: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-8 mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-white/10 bg-black/80 px-8 py-4 backdrop-blur">
      <div className="flex items-center gap-1">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[11px] transition",
              size === s
                ? "bg-white/15 text-white"
                : "text-white/45 hover:text-white"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STANDARD_PRESETS.map((p) => (
          <Swatch
            key={p.id}
            active={paintId === p.id}
            background={p.swatch}
            label={p.label}
            onClick={() => setPaintId(p.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STANDARD_GRADIENTS.map((g) => (
          <Swatch
            key={g.id}
            active={paintId === `grad:${g.id}`}
            background={`linear-gradient(135deg, ${g.from}, ${g.to})`}
            label={g.label}
            onClick={() => setPaintId(`grad:${g.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

function SavedSpinner({
  saved,
  size,
  paint,
}: {
  saved: SavedPattern;
  size: number;
  paint: Paint;
}) {
  const p = saved.prefs;
  const rotated = rotatePattern(
    { rows: saved.rows, cols: saved.cols, frames: saved.frames },
    // Saved patterns have no natural direction, so "e" is the identity.
    effectiveRotation("e", p?.direction ?? "e")
  );
  const rows = p?.gridRows || rotated.rows || saved.rows;
  const cols = p?.gridCols || rotated.cols || saved.cols;
  const pattern = scalePattern(rotated, rows, cols);

  return (
    <PixelSpinner
      pattern={pattern}
      {...paint}
      {...metrics(size, cols)}
      intervalOverride={p?.speed}
      glow={0}
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
        className="flex items-center justify-center gap-3"
        style={{ height: 132 }}
      >
        {children}
        <span className="font-mono text-[14px] text-white/50">loading...</span>
      </div>
      <p className="truncate border-t border-white/[0.06] px-4 py-2.5 font-mono text-[11px] text-white/50">
        {name}
      </p>
    </div>
  );
}

export default function SpinnersStandalonePage() {
  const [saved, setSaved] = React.useState<SavedPattern[]>([]);
  const [size, setSize] = React.useState<number>(16);
  const [paintId, setPaintId] = React.useState("pearl");
  const paint = paintFor(paintId);

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

      <Panel
        size={size}
        setSize={setSize}
        paintId={paintId}
        setPaintId={setPaintId}
      />

      <h2 className="mt-10 text-xs uppercase tracking-[0.3em] text-white/40">
        Saved ({saved.length})
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {saved.map((s) => (
          <Cell key={s.id} name={s.name} command={BASE_COMMAND}>
            <SavedSpinner saved={s} size={size} paint={paint} />
          </Cell>
        ))}
        {saved.length === 0 && (
          <p className="col-span-full text-sm text-white/40">
            Nothing saved yet — save a pattern on /spinners and it shows up here.
          </p>
        )}
      </div>

      <h2 className="mt-12 text-xs uppercase tracking-[0.3em] text-white/40">
        Presets ({SHOWN.length})
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {SHOWN.map((s) => (
          <Cell
            key={s.name}
            name={FANCY[s.name] ?? s.name}
            command={PRESET_COMMAND(s.name)}
          >
            <PixelSpinner
              pattern={s.pattern}
              {...paint}
              {...metrics(size, s.pattern.cols ?? s.pattern.size ?? 3)}
              glow={0}
            />
          </Cell>
        ))}
      </div>
    </main>
  );
}
