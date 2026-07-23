"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type {
  BarTheme,
  Shadow,
} from "@/registry/default/components/progress-bar";

/* ---------- primitives ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-black/8 space-y-3 border-t px-4 py-4 first:border-t-0 dark:border-white/8">
      <h3 className="text-[10px] font-medium tracking-[0.14em] text-black/40 uppercase dark:text-white/40">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] text-black/60 dark:text-white/60">
          {label}
        </span>
        {value && (
          <span className="font-mono text-[10px] tabular-nums text-black/40 dark:text-white/40">
            {value}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <Row label={label} value={`${value}${suffix}`}>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className={cn(
          "[&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-track]]:bg-black/12 dark:[&_[data-slot=slider-track]]:bg-white/15",
          "[&_[data-slot=slider-range]]:bg-black/70 dark:[&_[data-slot=slider-range]]:bg-white/80",
          "[&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-black [&_[data-slot=slider-thumb]]:shadow-[0_1px_4px_rgba(0,0,0,0.35)] dark:[&_[data-slot=slider-thumb]]:bg-white",
        )}
      />
    </Row>
  );
}

function Swatch({
  value,
  onChange,
  title,
}: {
  value: string;
  onChange: (v: string) => void;
  title?: string;
}) {
  return (
    <label
      title={title ?? value}
      className="border-black/12 relative size-7 shrink-0 cursor-pointer overflow-hidden rounded-lg border shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:border-white/15"
      style={{ background: value }}
    >
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="border-black/8 flex gap-0.5 rounded-lg border bg-black/4 p-0.5 dark:border-white/8 dark:bg-white/5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-[6px] px-2 py-1 text-[11px] capitalize transition-colors",
            o === value
              ? "bg-white text-black shadow-sm dark:bg-white/15 dark:text-white"
              : "text-black/45 hover:text-black/70 dark:text-white/45 dark:hover:text-white/70",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function ShadowEditor({
  shadow,
  onChange,
}: {
  shadow: Shadow;
  onChange: (s: Shadow) => void;
}) {
  const set = <K extends keyof Shadow>(k: K, v: Shadow[K]) =>
    onChange({ ...shadow, [k]: v });
  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <Range
          label="X"
          value={shadow.x}
          min={-20}
          max={20}
          onChange={(v) => set("x", v)}
        />
        <Range
          label="Y"
          value={shadow.y}
          min={-20}
          max={20}
          onChange={(v) => set("y", v)}
        />
        <Range
          label="Blur"
          value={shadow.blur}
          min={0}
          max={60}
          onChange={(v) => set("blur", v)}
        />
        <Range
          label="Spread"
          value={shadow.spread}
          min={-10}
          max={30}
          onChange={(v) => set("spread", v)}
        />
      </div>
      <div className="flex items-end gap-3">
        <Swatch value={shadow.color} onChange={(v) => set("color", v)} />
        <div className="flex-1">
          <Range
            label="Opacity"
            value={Math.round(shadow.opacity * 100)}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => set("opacity", v / 100)}
          />
        </div>
      </div>
    </>
  );
}

/* ---------- panel ---------- */

export default function Controls({
  theme,
  onChange,
  value,
  onValueChange,
  onReset,
}: {
  theme: BarTheme;
  onChange: (t: BarTheme) => void;
  value: number;
  onValueChange: (v: number) => void;
  onReset: () => void;
}) {
  const set = <K extends keyof BarTheme>(k: K, v: BarTheme[K]) =>
    onChange({ ...theme, [k]: v });

  const stops = (key: "surface" | "fill") => (
    <div className="flex gap-2">
      {theme[key].stops.map((c, i) => (
        <Swatch
          key={i}
          value={c}
          title={`Stop ${i + 1}`}
          onChange={(v) =>
            set(key, {
              ...theme[key],
              stops: theme[key].stops.map((s, j) => (j === i ? v : s)),
            })
          }
        />
      ))}
    </div>
  );

  const paintSection = (key: "surface" | "fill", title: string) => (
    <Section title={title}>
      <Segmented
        options={["gradient", "solid"] as const}
        value={theme[key].mode}
        onChange={(mode) => set(key, { ...theme[key], mode })}
      />
      {theme[key].mode === "gradient" ? (
        stops(key)
      ) : (
        <Swatch
          value={theme[key].solid}
          onChange={(v) => set(key, { ...theme[key], solid: v })}
        />
      )}
      {key === "surface" && (
        <Range
          label="Opacity"
          value={Math.round(theme.surfaceOpacity * 100)}
          min={0}
          max={100}
          suffix="%"
          onChange={(v) => set("surfaceOpacity", v / 100)}
        />
      )}
    </Section>
  );

  return (
    <aside className="border-black/8 flex h-full w-[280px] flex-col overflow-hidden rounded-2xl border bg-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-16px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/12 dark:bg-[#181818]/85 dark:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)]">
      <header className="border-black/8 flex shrink-0 items-center justify-between border-b px-4 py-3 dark:border-white/8">
        <div>
          <p className="text-[13px] font-medium text-black dark:text-white">
            Progress Bar
          </p>
          <p className="text-[10px] tracking-[0.14em] text-black/35 uppercase dark:text-white/35">
            Inspector
          </p>
        </div>
        <button
          onClick={onReset}
          className="rounded-md px-2 py-1 text-[11px] text-black/45 transition-colors hover:bg-black/5 hover:text-black/80 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white/80"
        >
          Reset
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section title="Progress">
          <Range
            label="Value"
            value={value}
            min={0}
            max={100}
            suffix="%"
            onChange={onValueChange}
          />
        </Section>

        {paintSection("surface", "Surface fill")}
        {paintSection("fill", "Bar fill")}

        <Section title="Stroke">
          <div className="flex items-end gap-3">
            <Swatch
              value={theme.stroke.color}
              onChange={(v) => set("stroke", { ...theme.stroke, color: v })}
            />
            <div className="flex-1">
              <Range
                label="Opacity"
                value={Math.round(theme.stroke.opacity * 100)}
                min={0}
                max={100}
                suffix="%"
                onChange={(v) =>
                  set("stroke", { ...theme.stroke, opacity: v / 100 })
                }
              />
            </div>
          </div>
        </Section>

        <Section title="Backdrop">
          <Range
            label="Blur"
            value={theme.backdropBlur}
            min={0}
            max={60}
            suffix="px"
            onChange={(v) => set("backdropBlur", v)}
          />
        </Section>

        <Section title="Drop shadow">
          <ShadowEditor
            shadow={theme.drop}
            onChange={(s) => set("drop", s)}
          />
        </Section>

        <Section title="Inner shadow">
          <ShadowEditor
            shadow={theme.inner}
            onChange={(s) => set("inner", s)}
          />
        </Section>

        <Section title="Label">
          <div className="flex items-center gap-3">
            <Swatch
              value={theme.text.pct}
              title="Percent"
              onChange={(v) => set("text", { ...theme.text, pct: v })}
            />
            <Swatch
              value={theme.text.label}
              title="Label"
              onChange={(v) => set("text", { ...theme.text, label: v })}
            />
          </div>
        </Section>
      </div>
    </aside>
  );
}
