"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CopyIconButton } from "./copy-icon-button";
import { DownloadIconButton } from "./download-icon-button";

/**
 * Server-highlighted code (lib/highlight.ts) in the docs' file frame. Long
 * files open clipped with a fade and expand in place; the fade is a gradient,
 * not a mask, so it stays cheap on a page with several of these. `scroll`
 * caps the height instead and scrolls inside the frame. A frame with a
 * `filename` also gets a save-as-file button beside copy; `downloadable={false}`
 * turns it off. `title` replaces the filename in the top bar (the code sheet
 * puts its file switcher there); download and copy still use `filename`.
 */
export function CodeFrame({
  html,
  code,
  filename,
  collapsible = false,
  scroll = false,
  downloadable = true,
  title,
  className,
}: {
  html: string;
  code: string;
  filename?: string;
  collapsible?: boolean;
  scroll?: boolean;
  downloadable?: boolean;
  title?: React.ReactNode;
  className?: string;
}) {
  const long = collapsible && code.split("\n").length > 18;
  const [open, setOpen] = React.useState(!long);

  return (
    // 15px to match the install frame (install-command.tsx), which takes it
    // from its concentric bar; the code sheet's file tabs derive from this.
    <div className={cn("overflow-hidden rounded-[15px] border bg-muted/30", className)}>
      {filename ? (
        <div className="flex items-center justify-between gap-2 border-b bg-neutral-200/60 py-1.5 pl-4 pr-2 dark:bg-neutral-800/80">
          {title ?? (
            <span className="truncate font-mono text-xs text-muted-foreground">{filename}</span>
          )}
          <div className="flex shrink-0 items-center gap-0.5">
            {downloadable && <DownloadIconButton value={code} filename={filename} />}
            <CopyIconButton value={code} label={`Copy ${filename}`} />
          </div>
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
            scroll && "max-h-80 overflow-y-auto overscroll-contain",
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
