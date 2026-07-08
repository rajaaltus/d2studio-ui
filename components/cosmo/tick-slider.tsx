"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useVelocity,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export function TickSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  editable,
  warnAbove,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  editable?: boolean;
  warnAbove?: number;
}) {
  const isWarn = warnAbove !== undefined && value > warnAbove;
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const decimals = step >= 1 ? 0 : step.toString().split(".")[1]?.length ?? 1;
  const display = value.toFixed(decimals);
  const tickCount = 36;

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(display);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!editing) setDraft(display);
  }, [display, editing]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(clamped.toFixed(decimals));
    } else {
      setDraft(display);
    }
    setEditing(false);
  };

  const pctMV = useMotionValue(pct);
  React.useEffect(() => {
    pctMV.set(pct);
  }, [pct, pctMV]);

  const rawVelocity = useVelocity(pctMV);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 300,
    damping: 18,
    mass: 0.4,
  });

  const indicatorScaleY = useTransform(smoothVelocity, (v) =>
    1 + Math.min(Math.abs(v) / 260, 1) * 0.9
  );

  return (
    <div className="group flex items-center gap-3 rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] px-3.5 py-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.18),0_2px_6px_-3px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.22),0_4px_10px_-4px_rgba(0,0,0,0.22)]">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ls-muted-foreground)]">
        {label}
      </span>
      <div className="relative flex-1 h-5">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex h-3 -translate-y-1/2 items-stretch justify-between">
          {Array.from({ length: tickCount }).map((_, i) => (
            <Tick
              key={i}
              index={i}
              tickCount={tickCount}
              pctMV={pctMV}
              velocity={smoothVelocity}
            />
          ))}
        </div>
        <motion.div
          className="pointer-events-none absolute top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-[1px] transition-[background-color,box-shadow] duration-200"
          style={{
            left: `${pct}%`,
            scale: indicatorScaleY,
            transformOrigin: "50% 50%",
            backgroundColor: isWarn ? "oklch(0.78 0.19 60)" : "oklch(0.72 0.24 5)",
            boxShadow: isWarn
              ? "0 0 4px oklch(0.78 0.19 60 / 0.9), 0 0 10px oklch(0.78 0.19 60 / 0.55)"
              : "0 0 4px oklch(0.72 0.24 5 / 0.9), 0 0 10px oklch(0.72 0.24 5 / 0.55)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
          aria-label={label}
        />
      </div>
      {editable ? (
        editing ? (
          <div className="flex shrink-0 items-center gap-0.5 rounded border border-white/30 bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-foreground)]">
            <input
              ref={inputRef}
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                else if (e.key === "Escape") {
                  setDraft(display);
                  setEditing(false);
                }
              }}
              autoFocus
              className="w-14 bg-transparent text-right tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {unit && <span className="text-[var(--ls-muted-foreground)]">{unit}</span>}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(display);
              setEditing(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            className="shrink-0 cursor-text font-mono text-xs tabular-nums text-[var(--ls-foreground)] hover:underline decoration-dotted underline-offset-2"
            title="Click to edit"
          >
            {display}
            {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
          </button>
        )
      ) : (
        <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--ls-foreground)]">
          {display}
          {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
        </span>
      )}
    </div>
  );
}

function Tick({
  index,
  tickCount,
  pctMV,
  velocity,
}: {
  index: number;
  tickCount: number;
  pctMV: MotionValue<number>;
  velocity: MotionValue<number>;
}) {
  const tickPct = (index / (tickCount - 1)) * 100;

  const scaleY = useTransform<number, number>(
    [pctMV, velocity] as unknown as MotionValue<number>[],
    (latest) => {
      const [p, v] = latest as unknown as [number, number];
      const dist = Math.abs(tickPct - p);
      const intensity = Math.min(Math.abs(v) / 260, 1);
      const sigma = 8 + intensity * 22;
      const envelope = Math.exp(-(dist * dist) / (2 * sigma * sigma));
      return 1 + envelope * intensity * 2.4;
    }
  );

  const opacity = useTransform(pctMV, (p) => (tickPct <= p ? 0.7 : 0.15));

  return (
    <motion.span
      className="w-px origin-center bg-[var(--ls-foreground)]"
      style={{ scaleY, opacity }}
    />
  );
}
