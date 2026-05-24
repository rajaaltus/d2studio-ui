"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SWATCH_PRESETS = [
  "#0c0c0c",
  "#1c1c1c",
  "#1f2937",
  "#0b1220",
  "#1a0b2e",
  "#0d1f17",
  "#7c3aed",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#a78bfa",
  "#f5f5f5",
  "#ffffff",
];

function normalizeHex(input: string): string | null {
  const trimmed = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return (
      "#" +
      trimmed
        .split("")
        .map((c) => c + c)
        .join("")
        .toLowerCase()
    );
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return "#" + trimmed.toLowerCase();
  return null;
}

export function ColorPickerPopover({
  value,
  onChange,
  trigger,
  align = "start",
  side = "bottom",
  sideOffset = 8,
  presets = SWATCH_PRESETS,
}: {
  value: string;
  onChange: (next: string) => void;
  trigger: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  presets?: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [hexDraft, setHexDraft] = React.useState(value);

  React.useEffect(() => {
    setHexDraft(value);
  }, [value]);

  const commitHex = (raw: string) => {
    const normalized = normalizeHex(raw);
    if (normalized) onChange(normalized);
    else setHexDraft(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="luminous-spinners w-[232px] border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)] shadow-2xl"
      >
        <div className="ls-color-picker">
          <HexColorPicker color={value} onChange={onChange} />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div
            className="h-7 w-7 shrink-0 rounded-md border border-white/10 ring-1 ring-black/30"
            style={{ backgroundColor: value }}
            aria-hidden
          />
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[var(--ls-muted-foreground)]">
              #
            </span>
            <input
              value={hexDraft.replace(/^#/, "")}
              onChange={(e) => setHexDraft("#" + e.target.value)}
              onBlur={(e) => commitHex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitHex((e.target as HTMLInputElement).value);
                }
              }}
              spellCheck={false}
              maxLength={7}
              className="h-7 w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] pl-5 pr-2 font-mono text-[11px] uppercase text-[var(--ls-foreground)] outline-none transition-colors focus:border-white/40"
            />
          </div>
        </div>

        {presets.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
              Swatches
            </p>
            <div className="grid grid-cols-8 gap-1">
              {presets.map((p) => {
                const active = p.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    aria-label={p}
                    title={p}
                    className={
                      "h-5 w-5 rounded border transition-transform hover:scale-110 " +
                      (active
                        ? "border-white/70 ring-1 ring-white/40"
                        : "border-white/10")
                    }
                    style={{ backgroundColor: p }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
