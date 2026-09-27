"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn, copyText } from "@/lib/utils";

/**
 * Copy with the transitions.dev icon swap: both glyphs share one grid cell and
 * `data-state` cross-fades them with a blur, so the confirmation replaces the
 * copy glyph in place instead of popping in beside it.
 */
export function CopyIconButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    try {
      await copyText(value);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:bg-foreground/5 hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="t-icon-swap" data-state={copied ? "b" : "a"} aria-hidden>
        <Copy className="t-icon size-3.5" data-icon="a" />
        <Check className="t-icon size-3.5" data-icon="b" />
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
