"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CopyIconButton } from "./copy-icon-button";

/**
 * Server-highlighted code (lib/highlight.ts) in the docs' file frame. Long
 * files open clipped with a fade and expand in place; the fade is a gradient,
 * not a mask, so it stays cheap on a page with several of these.
 */
export function CodeFrame({
  html,
  code,
  filename,
  collapsible = false,
  className,
}: {
  html: string;
  code: string;
  filename?: string;
  collapsible?: boolean;
  className?: string;
}) {
  const long = collapsible && code.split("\n").length > 18;
  const [open, setOpen] = React.useState(!long);

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-muted/30", className)}>
      {filename ? (
        <div className="flex items-center justify-between gap-2 border-b py-1.5 pl-4 pr-2">
          <span className="truncate font-mono text-xs text-muted-foreground">{filename}</span>
          <CopyIconButton value={code} label={`Copy ${filename}`} />
        </div>
      ) : (
        <CopyIconButton value={code} label="Copy code" className="float-right m-2" />
      )}
      <div className="relative">
        <div
          className={cn(
            "overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed",
            // shiki emits both palettes as variables (lib/highlight.ts); the
            // theme picks one, so switching it needs no re-highlight.
            "[&_.shiki]:bg-transparent [&_.shiki_span]:text-(--shiki-light) dark:[&_.shiki_span]:text-(--shiki-dark)",
            !open && "max-h-72 overflow-y-hidden",
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {long && (
          <div
            className={cn(
              "flex justify-center",
              open
                ? "border-t py-2"
                : "absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent pb-3 pt-16",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="rounded-md border bg-background px-3 py-1 text-xs font-medium transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.97]"
            >
              {open ? "Collapse" : "Expand code"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
