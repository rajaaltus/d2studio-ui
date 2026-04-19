"use client";

import * as React from "react";
import {
  Atom,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileCode2,
  Palette,
  Shuffle,
} from "lucide-react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerGradient,
  type SpinnerPattern,
} from "@/components/pixel-spinner";
import { SPINNER_LIBRARY } from "@/lib/spinner-patterns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PRESET_COLOR_CSS: Record<
  SpinnerColor,
  { from: string; to: string; glow: string }
> = {
  crimson: {
    from: "oklch(0.85 0.18 145)",
    to: "oklch(0.65 0.24 140)",
    glow: "oklch(0.75 0.22 145)",
  },
  hotpink: {
    from: "oklch(0.85 0.2 350)",
    to: "oklch(0.65 0.25 10)",
    glow: "oklch(0.72 0.24 5)",
  },
  violet: {
    from: "oklch(0.85 0.18 320)",
    to: "oklch(0.6 0.25 285)",
    glow: "oklch(0.7 0.22 305)",
  },
  blue: {
    from: "oklch(0.85 0.16 240)",
    to: "oklch(0.55 0.24 265)",
    glow: "oklch(0.7 0.2 255)",
  },
};

const PRESET_COLOR_RGB: Record<
  SpinnerColor,
  { from: [number, number, number]; to: [number, number, number]; glow: [number, number, number] }
> = {
  crimson: { from: [146, 224, 146], to: [76, 196, 76], glow: [112, 216, 112] },
  hotpink: { from: [255, 145, 170], to: [240, 70, 90], glow: [255, 70, 120] },
  violet: { from: [220, 160, 240], to: [150, 80, 230], glow: [190, 110, 240] },
  blue: { from: [150, 190, 255], to: [70, 110, 220], glow: [100, 150, 240] },
};

type ColorPreset = {
  id: string;
  label: string;
  swatch: string;
  builtin?: SpinnerColor;
  hex?: string;
};

const PRESETS: ColorPreset[] = [
  { id: "green", label: "Green", builtin: "crimson", swatch: "oklch(0.75 0.22 145)" },
  { id: "hotpink", label: "Hot Pink", builtin: "hotpink", swatch: "oklch(0.72 0.24 5)" },
  { id: "violet", label: "Violet", builtin: "violet", swatch: "oklch(0.7 0.22 305)" },
  { id: "blue", label: "Blue", builtin: "blue", swatch: "oklch(0.7 0.2 255)" },
  { id: "cyan", label: "Cyan", hex: "#22d3ee", swatch: "#22d3ee" },
  { id: "amber", label: "Amber", hex: "#f59e0b", swatch: "#f59e0b" },
  { id: "lime", label: "Lime", hex: "#84cc16", swatch: "#84cc16" },
  { id: "rose", label: "Rose", hex: "#f43f5e", swatch: "#f43f5e" },
  { id: "indigo", label: "Indigo", hex: "#6366f1", swatch: "#6366f1" },
  { id: "teal", label: "Teal", hex: "#14b8a6", swatch: "#14b8a6" },
  { id: "yellow", label: "Yellow", hex: "#facc15", swatch: "#facc15" },
  { id: "pearl", label: "Pearl", hex: "#f8fafc", swatch: "#f8fafc" },
];

type GradientDef = {
  id: string;
  label: string;
  from: string;
  to: string;
  glow: string;
};

const GRADIENTS: GradientDef[] = [
  { id: "sunset", label: "Sunset", from: "#ff9966", to: "#ff5e62", glow: "#ff5e62" },
  { id: "aurora", label: "Aurora", from: "#00f5a0", to: "#00d9f5", glow: "#00d9f5" },
  { id: "ultraviolet", label: "Ultraviolet", from: "#b06ab3", to: "#4568dc", glow: "#7c5cff" },
  { id: "peach", label: "Peach", from: "#f6d365", to: "#fda085", glow: "#fda085" },
  { id: "lava", label: "Lava", from: "#ff416c", to: "#ff4b2b", glow: "#ff416c" },
  { id: "mint", label: "Mint", from: "#43e97b", to: "#38f9d7", glow: "#38f9d7" },
  { id: "ocean", label: "Ocean", from: "#2193b0", to: "#6dd5ed", glow: "#6dd5ed" },
  { id: "neon", label: "Neon", from: "#12c2e9", to: "#f64f59", glow: "#c471ed" },
  { id: "candy", label: "Candy", from: "#ff6a88", to: "#ff99ac", glow: "#ff6a88" },
  { id: "electric", label: "Electric", from: "#4facfe", to: "#00f2fe", glow: "#00f2fe" },
  { id: "dawn", label: "Dawn", from: "#fbc2eb", to: "#a6c1ee", glow: "#a6c1ee" },
  { id: "forest", label: "Forest", from: "#134e5e", to: "#71b280", glow: "#71b280" },
  { id: "royal", label: "Royal", from: "#141e30", to: "#f7971e", glow: "#f7971e" },
  { id: "bubblegum", label: "Bubblegum", from: "#ff9a9e", to: "#fad0c4", glow: "#ff9a9e" },
  { id: "cosmos", label: "Cosmos", from: "#8e2de2", to: "#4a00e0", glow: "#8e2de2" },
];

function useSpring(target: number, stiffness = 170, damping = 22) {
  const [value, setValue] = React.useState(target);
  const ref = React.useRef({ pos: target, vel: 0 });
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const tick = () => {
      const s = ref.current;
      const dt = 1 / 60;
      const force = (target - s.pos) * stiffness - s.vel * damping;
      s.vel += force * dt;
      s.pos += s.vel * dt;
      if (Math.abs(target - s.pos) < 0.01 && Math.abs(s.vel) < 0.05) {
        s.pos = target;
        s.vel = 0;
        setValue(target);
        rafRef.current = null;
        return;
      }
      setValue(s.pos);
      rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, stiffness, damping]);

  return value;
}

export function SpinnerPlayground() {
  const [patternName, setPatternName] = React.useState(SPINNER_LIBRARY[0].name);
  const [colorMode, setColorMode] = React.useState<
    "preset" | "custom" | "gradient"
  >("gradient");
  const [color, setColor] = React.useState<SpinnerColor>("blue");
  const [presetId, setPresetId] = React.useState("blue");
  const [customColor, setCustomColor] = React.useState("#7ab7ff");
  const [gradientId, setGradientId] = React.useState(GRADIENTS[0].id);
  const [gradientFrom, setGradientFrom] = React.useState(GRADIENTS[0].from);
  const [gradientTo, setGradientTo] = React.useState(GRADIENTS[0].to);
  const [gradientGlow, setGradientGlow] = React.useState(GRADIENTS[0].glow);
  const [cellSize, setCellSize] = React.useState(24);
  const [gap, setGap] = React.useState(3);
  const [speed, setSpeed] = React.useState(200);
  const [glow, setGlow] = React.useState(1);
  const [gridSize, setGridSize] = React.useState(0);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [gradientPickerOpen, setGradientPickerOpen] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  const pattern = React.useMemo(
    () =>
      SPINNER_LIBRARY.find((s) => s.name === patternName) ?? SPINNER_LIBRARY[0],
    [patternName]
  );

  const springCell = useSpring(cellSize);
  const springGap = useSpring(gap);
  const springGlow = useSpring(glow);

  const effectiveSize = gridSize || pattern.pattern.size || 3;
  const scaledPattern = React.useMemo(
    () => scalePattern(pattern.pattern, effectiveSize),
    [pattern, effectiveSize]
  );

  const activePreset = PRESETS.find((p) => p.id === presetId);
  const activeGradient: SpinnerGradient | undefined =
    colorMode === "gradient"
      ? { from: gradientFrom, to: gradientTo, glow: gradientGlow }
      : undefined;
  const activeCustom =
    colorMode === "custom"
      ? customColor
      : colorMode === "preset" && activePreset?.hex
        ? activePreset.hex
        : undefined;
  const activeColor: SpinnerColor =
    colorMode === "preset" && activePreset?.builtin
      ? activePreset.builtin
      : color;

  const handleRandom = () => {
    const p = SPINNER_LIBRARY[Math.floor(Math.random() * SPINNER_LIBRARY.length)];
    setPatternName(p.name);
  };

  const colorLine =
    colorMode === "gradient"
      ? `\n  gradient={{ from: "${gradientFrom}", to: "${gradientTo}", glow: "${gradientGlow}" }}`
      : activeCustom
        ? `\n  customColor="${activeCustom}"`
        : "";

  const reactSnippet = `<PixelSpinner
  pattern={SPINNER_LIBRARY.find(s => s.name === "${pattern.name}")!.pattern}
  color="${activeColor}"${colorLine}
  cellSize={${cellSize}}
  gap={${gap}}
  intervalOverride={${speed}}
  glow={${glow}}
/>`;

  const { htmlSnippet, cssSnippet } = React.useMemo(
    () =>
      buildStandaloneSnippet({
        pattern: scaledPattern,
        color: activeColor,
        customColor: activeCustom,
        gradient: activeGradient,
        cellSize,
        gap,
        speed,
        glow,
      }),
    [scaledPattern, activeColor, activeCustom, activeGradient, cellSize, gap, speed, glow]
  );

  return (
    <section className="grid gap-2.5 rounded-3xl border border-[var(--ls-border)] bg-[var(--ls-card)] p-1.5 lg:grid-cols-[1fr_360px] lg:p-2.5">
      {/* Preview */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.24_5)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.85_0.18_80)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.22_145)]" />
            <span className="ml-3 font-mono text-xs text-[var(--ls-muted-foreground)]">
              {pattern.name}
            </span>
          </div>
          <button
            onClick={handleRandom}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]"
          >
            <Shuffle size={12} className="text-[#f59e0b]" />
            Random
          </button>
        </div>

        <div className="flex min-h-[260px] flex-1 items-center justify-center p-8">
          <PixelSpinner
            key={`${pattern.name}-${speed}-${effectiveSize}`}
            pattern={scaledPattern}
            color={activeColor}
            customColor={activeCustom}
            gradient={activeGradient}
            cellSize={springCell}
            gap={springGap}
            intervalOverride={speed}
            glow={springGlow}
          />
        </div>

        <div className="grid grid-cols-1 border-t border-[var(--ls-border)] md:grid-cols-3">
          <CodePanel
            label="HTML"
            icon={<FileCode2 size={14} className="text-[#e34c26]" />}
            code={htmlSnippet}
          />
          <CodePanel
            label="CSS"
            icon={<Palette size={14} className="text-[#BF83FB]" />}
            code={cssSnippet}
            className="border-t border-[var(--ls-border)] md:border-l md:border-t-0"
          />
          <CodePanel
            label="React"
            icon={<Atom size={14} className="text-[#61dafb]" />}
            code={reactSnippet}
            className="border-t border-[var(--ls-border)] md:border-l md:border-t-0"
          />
        </div>
      </div>

      {/* Controls */}
      <aside className="space-y-5 rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 p-5 backdrop-blur-sm">
        <ControlGroup label="Pattern">
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 font-mono text-xs text-[var(--ls-foreground)] outline-none transition-colors hover:bg-[var(--ls-border)]/50 focus-visible:border-white/40">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center">
                    <PixelSpinner
                      pattern={pattern.pattern}
                      color={activeColor}
                      customColor={activeCustom}
                      gradient={activeGradient}
                      cellSize={3}
                      gap={1}
                    />
                  </span>
                  {pattern.name}
                </span>
                <ChevronDown size={14} className="opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="luminous-spinners w-[min(560px,calc(100vw-2rem))] border-[var(--ls-border)] bg-[var(--ls-card)] p-0 text-[var(--ls-foreground)]"
            >
              <div className="max-h-[min(60vh,380px)] overflow-y-auto p-3">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {SPINNER_LIBRARY.map((s) => {
                    const active = s.name === pattern.name;
                    return (
                      <button
                        key={s.name}
                        onClick={() => {
                          setPatternName(s.name);
                          setPickerOpen(false);
                        }}
                        className={
                          "group flex flex-col items-center justify-center rounded-xl border p-3 transition-colors " +
                          (active
                            ? "border-white/40 bg-[var(--ls-border)]/40"
                            : "border-[var(--ls-border)] bg-[var(--ls-card)]/60 hover:bg-[var(--ls-border)]/30")
                        }
                      >
                        <div className="flex h-16 items-center justify-center">
                          <PixelSpinner
                            pattern={s.pattern}
                            color={s.color}
                            cellSize={s.pattern.size === 4 ? 8 : 10}
                            gap={2}
                          />
                        </div>
                        <p className="mt-2 truncate font-mono text-[10px] text-[var(--ls-muted-foreground)]">
                          {s.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ControlGroup>

        <ControlGroup label="Color">
          <div className="inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
            {(["gradient", "preset", "custom"] as const).map((m) => {
              const active = colorMode === m;
              return (
                <button
                  key={m}
                  onClick={() => setColorMode(m)}
                  className={
                    "flex-1 rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors " +
                    (active
                      ? "bg-white/10 text-[var(--ls-foreground)]"
                      : "text-[var(--ls-muted-foreground)] hover:text-[var(--ls-foreground)]")
                  }
                >
                  {m}
                </button>
              );
            })}
          </div>

          {colorMode === "preset" && (
            <div className="mt-3 grid grid-cols-6 gap-2">
              {PRESETS.map((p) => {
                const active = presetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPresetId(p.id);
                      if (p.builtin) setColor(p.builtin);
                    }}
                    aria-label={p.label}
                    title={p.label}
                    className={
                      "h-8 w-8 rounded-md transition-transform " +
                      (active
                        ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[var(--ls-card)]"
                        : "opacity-80 hover:opacity-100")
                    }
                    style={{ background: p.swatch }}
                  />
                );
              })}
            </div>
          )}

          {colorMode === "custom" && (
            <div className="mt-3 flex items-center gap-2">
              <label
                className="relative h-8 w-8 shrink-0 cursor-pointer rounded-full border-2 border-white/60"
                style={{ background: customColor }}
              >
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
              <input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                spellCheck={false}
                className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 font-mono text-xs text-[var(--ls-foreground)] outline-none focus:border-white/40"
              />
            </div>
          )}

          {colorMode === "gradient" && (
            <div className="mt-3 space-y-3">
              <Popover
                open={gradientPickerOpen}
                onOpenChange={setGradientPickerOpen}
              >
                <PopoverTrigger asChild>
                  <button className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 text-xs text-[var(--ls-foreground)] outline-none transition-colors hover:bg-[var(--ls-border)]/50 focus-visible:border-white/40">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-4 w-6 rounded"
                        style={{
                          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                        }}
                      />
                      <span className="font-mono">
                        {GRADIENTS.find((g) => g.id === gradientId)?.label ??
                          "Custom"}
                      </span>
                    </span>
                    <ChevronDown size={14} className="opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="luminous-spinners w-[min(360px,calc(100vw-2rem))] border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)]"
                >
                  <div className="grid max-h-[360px] grid-cols-3 gap-2 overflow-y-auto">
                    {GRADIENTS.map((g) => {
                      const active = gradientId === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => {
                            setGradientId(g.id);
                            setGradientFrom(g.from);
                            setGradientTo(g.to);
                            setGradientGlow(g.glow);
                            setGradientPickerOpen(false);
                          }}
                          className={
                            "group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors " +
                            (active
                              ? "border-white/40"
                              : "border-[var(--ls-border)] hover:border-white/20")
                          }
                        >
                          <span
                            className="block h-6 w-full rounded-md"
                            style={{
                              background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                              boxShadow: `0 0 12px ${g.glow}80`,
                            }}
                          />
                          <span className="text-[10px] text-[var(--ls-muted-foreground)]">
                            {g.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="grid grid-cols-3 gap-2">
                <GradientStop
                  label="From"
                  value={gradientFrom}
                  onChange={(v) => {
                    setGradientFrom(v);
                    setGradientId("");
                  }}
                />
                <GradientStop
                  label="To"
                  value={gradientTo}
                  onChange={(v) => {
                    setGradientTo(v);
                    setGradientId("");
                  }}
                />
                <GradientStop
                  label="Glow"
                  value={gradientGlow}
                  onChange={(v) => {
                    setGradientGlow(v);
                    setGradientId("");
                  }}
                />
              </div>
            </div>
          )}
        </ControlGroup>

        <SliderControl
          label="Grid"
          value={effectiveSize}
          min={3}
          max={8}
          step={1}
          unit={`×${effectiveSize}`}
          onChange={setGridSize}
        />
        <SliderControl
          label="Cell size"
          value={cellSize}
          min={3}
          max={48}
          step={1}
          unit="px"
          onChange={setCellSize}
        />
        <SliderControl
          label="Gap"
          value={gap}
          min={0}
          max={12}
          step={1}
          unit="px"
          onChange={setGap}
        />
        <SliderControl
          label="Animation Speed"
          value={speed}
          min={30}
          max={2000}
          step={10}
          unit="ms"
          onChange={setSpeed}
          endLabels={["Fast", "Slow"]}
          editable
        />
        <SliderControl
          label="Glow"
          value={glow}
          min={0}
          max={5}
          step={1}
          unit="x"
          onChange={setGlow}
        />

        <div className="pt-2">
          <button
            onClick={async () => {
              if (exporting) return;
              setExporting(true);
              try {
                await exportGif({
                  pattern: scaledPattern,
                  color,
                  customColor: activeCustom,
                  gradient: activeGradient,
                  cellSize,
                  gap,
                  speed,
                  filename: pattern.name,
                });
              } catch (e) {
                console.error(e);
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--ls-foreground)] transition-colors hover:bg-white/10 disabled:opacity-60"
          >
            <Download size={13} />
            {exporting ? "Encoding…" : "Export GIF"}
          </button>
        </div>
      </aside>
    </section>
  );
}

function CodePanel({
  label,
  code,
  className,
  icon,
}: {
  label: string;
  code: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      className={
        "flex min-w-0 flex-col bg-[var(--ls-code-bg)]/60 p-4 " + (className ?? "")
      }
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--ls-foreground)]">
          {icon}
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-64 overflow-auto font-mono text-[11px] leading-relaxed text-[var(--ls-muted-foreground)]">
        {code}
      </pre>
    </div>
  );
}

function GradientStop({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] uppercase tracking-wider text-[var(--ls-muted-foreground)]">
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        <label
          className="relative h-6 w-6 shrink-0 cursor-pointer rounded-md border border-white/30"
          style={{ background: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full rounded border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 py-1 font-mono text-[10px] text-[var(--ls-foreground)] outline-none focus:border-white/40"
        />
      </div>
    </div>
  );
}

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
        {label}
      </p>
      {children}
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  endLabels,
  editable,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  endLabels?: [string, string];
  editable?: boolean;
}) {
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(String(clamped));
    } else {
      setDraft(String(value));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
          {label}
        </p>
        {editable ? (
          <div className="flex items-center gap-0.5 rounded border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-foreground)] focus-within:border-white/40">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="w-12 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-[var(--ls-muted-foreground)]">{unit}</span>
          </div>
        ) : (
          <span className="font-mono text-xs text-[var(--ls-foreground)]">
            {value}
            {unit}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--ls-border)] accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
      />
      {endLabels && (
        <div className="flex justify-between text-[10px] text-[var(--ls-muted-foreground)]">
          <span>{endLabels[0]}</span>
          <span>{endLabels[1]}</span>
        </div>
      )}
    </div>
  );
}

/* ============ Pattern scaling ============ */

function scalePattern(
  p: SpinnerPattern,
  targetSize: number
): SpinnerPattern {
  const src = p.size ?? 3;
  if (targetSize === src) return p;
  const newFrames = p.frames.map((frame) => {
    const srcSet = new Set(frame);
    const cells: number[] = [];
    for (let r = 0; r < targetSize; r++) {
      for (let c = 0; c < targetSize; c++) {
        const sr = Math.floor((r * src) / targetSize);
        const sc = Math.floor((c * src) / targetSize);
        if (srcSet.has(sr * src + sc)) {
          cells.push(r * targetSize + c);
        }
      }
    }
    return cells;
  });
  return { ...p, size: targetSize, frames: newFrames };
}

/* ============ Standalone HTML + CSS snippet ============ */

function buildCellOpacityGrid(pattern: SpinnerPattern) {
  const size = pattern.size ?? 3;
  const F = pattern.frames.length;
  const total = size * size;
  const trail = [1, 0.5, 0.25, 0.15];
  const grid: number[][] = Array.from({ length: total }, () =>
    new Array(F).fill(0)
  );
  for (let f = 0; f < F; f++) {
    for (let t = 0; t < trail.length; t++) {
      const src = (f - t + F) % F;
      const cells = pattern.frames[src] ?? [];
      for (const c of cells) {
        if (grid[c][f] === 0) grid[c][f] = trail[t];
      }
    }
  }
  return { grid, size, F, total };
}

function buildStandaloneSnippet(opts: {
  pattern: SpinnerPattern;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  glow?: number;
}) {
  const {
    pattern,
    color,
    customColor,
    gradient,
    cellSize,
    gap,
    speed,
    glow = 1,
  } = opts;
  const { grid, size, F, total } = buildCellOpacityGrid(pattern);
  const duration = F * speed;

  let gradientCss: string;
  let glowColor: string;
  if (gradient) {
    gradientCss = `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`;
    glowColor = gradient.glow;
  } else if (customColor) {
    gradientCss = `linear-gradient(135deg, color-mix(in oklab, ${customColor} 80%, white), color-mix(in oklab, ${customColor} 85%, black))`;
    glowColor = customColor;
  } else {
    const p = PRESET_COLOR_CSS[color];
    gradientCss = `linear-gradient(135deg, ${p.from}, ${p.to})`;
    glowColor = p.glow;
  }

  let html = `<div class="pixel-spinner">\n`;
  for (let i = 0; i < total; i++) {
    html += `  <div class="cell cell-${i}"></div>\n`;
  }
  html += `</div>`;

  const step = 100 / F;
  let keyframes = "";
  const cellNameRules: string[] = [];
  for (let i = 0; i < total; i++) {
    const fo = grid[i];
    if (fo.every((o) => o === 0)) continue;
    cellNameRules.push(`.pixel-spinner .cell-${i} { animation-name: ps-${i}; }`);
    let k = `@keyframes ps-${i} {\n`;
    for (let f = 0; f < F; f++) {
      const from = (f * step).toFixed(2);
      const to = Math.max(0, (f + 1) * step - 0.01).toFixed(2);
      k += `  ${from}%, ${to}% { opacity: ${fo[f]}; }\n`;
    }
    k += `}\n`;
    keyframes += k;
  }

  const glow1 = Math.round(cellSize * 0.6 * glow);
  const glow2 = Math.round(cellSize * 1.6 * glow);
  const glow3 = Math.round(cellSize * 3.2 * glow);

  const css = `.pixel-spinner {
  display: inline-grid;
  grid-template-columns: repeat(${size}, ${cellSize}px);
  gap: ${gap}px;
}
.pixel-spinner .cell {
  width: ${cellSize}px;
  height: ${cellSize}px;
  background: ${gradientCss};
  box-shadow:
    0 0 ${glow1}px ${glowColor},
    0 0 ${glow2}px ${glowColor}80,
    0 0 ${glow3}px ${glowColor}55;
  opacity: 0;
  animation-duration: ${duration}ms;
  animation-iteration-count: infinite;
  animation-timing-function: steps(1, end);
}
${cellNameRules.join("\n")}

${keyframes}`;

  return { htmlSnippet: html, cssSnippet: css };
}

/* ============ GIF export ============ */

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const full =
    m.length === 3
      ? m.split("").map((c) => c + c).join("")
      : m.padEnd(6, "0");
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function parseColorToRgb(c: string): [number, number, number] {
  if (c.startsWith("#")) return hexToRgb(c);
  if (typeof document !== "undefined") {
    const el = document.createElement("span");
    el.style.color = c;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    const m = computed.match(/\d+(\.\d+)?/g);
    if (m && m.length >= 3) {
      return [Math.round(+m[0]), Math.round(+m[1]), Math.round(+m[2])];
    }
  }
  return [255, 255, 255];
}

async function exportGif(opts: {
  pattern: SpinnerPattern;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  filename: string;
}) {
  const { pattern, color, customColor, gradient, cellSize, gap, speed, filename } = opts;
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

  const size = pattern.size ?? 3;
  const F = pattern.frames.length;
  const { grid } = buildCellOpacityGrid(pattern);

  const padding = Math.max(16, Math.round(cellSize * 2));
  const inner = size * cellSize + (size - 1) * gap;
  const W = inner + padding * 2;
  const H = inner + padding * 2;

  let fromRgb: [number, number, number];
  let toRgb: [number, number, number];
  let glowRgb: [number, number, number];
  if (gradient) {
    fromRgb = parseColorToRgb(gradient.from);
    toRgb = parseColorToRgb(gradient.to);
    glowRgb = parseColorToRgb(gradient.glow);
  } else if (customColor) {
    const base = parseColorToRgb(customColor);
    fromRgb = base.map((v) => Math.min(255, Math.round(v * 0.8 + 255 * 0.2))) as [number, number, number];
    toRgb = base.map((v) => Math.round(v * 0.85)) as [number, number, number];
    glowRgb = base;
  } else {
    const p = PRESET_COLOR_RGB[color];
    fromRgb = p.from;
    toRgb = p.to;
    glowRgb = p.glow;
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no ctx");

  const encoder = GIFEncoder();

  for (let f = 0; f < F; f++) {
    // background
    ctx.fillStyle = "#141824";
    ctx.fillRect(0, 0, W, H);

    for (let cy = 0; cy < size; cy++) {
      for (let cx = 0; cx < size; cx++) {
        const idx = cy * size + cx;
        const op = grid[idx][f];
        const x = padding + cx * (cellSize + gap);
        const y = padding + cy * (cellSize + gap);

        if (op > 0) {
          // Glow layers
          for (const [radius, alpha] of [
            [cellSize * 0.8, 0.6],
            [cellSize * 1.8, 0.35],
            [cellSize * 3.2, 0.18],
          ] as const) {
            const g = ctx.createRadialGradient(
              x + cellSize / 2,
              y + cellSize / 2,
              0,
              x + cellSize / 2,
              y + cellSize / 2,
              radius
            );
            g.addColorStop(
              0,
              `rgba(${glowRgb[0]}, ${glowRgb[1]}, ${glowRgb[2]}, ${alpha * op})`
            );
            g.addColorStop(1, `rgba(${glowRgb[0]}, ${glowRgb[1]}, ${glowRgb[2]}, 0)`);
            ctx.fillStyle = g;
            ctx.fillRect(
              x - radius,
              y - radius,
              cellSize + radius * 2,
              cellSize + radius * 2
            );
          }

          // Cell fill (linear gradient)
          const lg = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
          lg.addColorStop(
            0,
            `rgba(${fromRgb[0]}, ${fromRgb[1]}, ${fromRgb[2]}, ${op})`
          );
          lg.addColorStop(
            1,
            `rgba(${toRgb[0]}, ${toRgb[1]}, ${toRgb[2]}, ${op})`
          );
          ctx.fillStyle = lg;
          ctx.fillRect(x, y, cellSize, cellSize);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.03)";
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }

    const imageData = ctx.getImageData(0, 0, W, H);
    const palette = quantize(imageData.data, 256);
    const index = applyPalette(imageData.data, palette);
    encoder.writeFrame(index, W, H, { palette, delay: speed });
  }

  encoder.finish();
  const bytes = encoder.bytes();
  const buf = new Uint8Array(bytes.length);
  buf.set(bytes);
  const blob = new Blob([buf.buffer], { type: "image/gif" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.gif`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
