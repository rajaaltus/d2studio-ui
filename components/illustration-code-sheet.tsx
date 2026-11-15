"use client";

import * as React from "react";
import { Code } from "lucide-react";
import { CodeFrame } from "@/components/docs/code-frame";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// The /illustration cards keep their code out of the page: a button opens the
// files in a side sheet. A client component so the trigger and the sheet
// hydrate together rather than across the server boundary. A block with more
// than one file shows one frame and switches between them from its top bar.
export function IllustrationCodeSheet({
  title,
  files,
}: {
  title: string;
  files: { html: string; code: string; filename: string }[];
}) {
  const [active, setActive] = React.useState(0);
  const file = files[active] ?? files[0];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Code />
          View code
        </Button>
      </SheetTrigger>
      {/* Floats as a card inset from the viewport rather than a full-height
          panel; tailwind-merge replaces the sheet's edge-pinned defaults. */}
      <SheetContent className="inset-y-2 right-2 h-auto w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45),0_8px_20px_-8px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:max-w-2xl dark:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="text-base font-medium">{title}</SheetTitle>
          <SheetDescription className="text-xs">
            {files.length === 1 ? "1 file" : `${files.length} files`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4">
          <CodeFrame
            html={file.html}
            code={file.code}
            filename={file.filename}
            title={
              files.length > 1 ? (
                <FileTabs files={files} active={active} onSelect={setActive} />
              ) : undefined
            }
            className="min-w-0 shrink-0"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

const basename = (path: string) => path.slice(path.lastIndexOf("/") + 1);

// Tabs named by file (`moon-tile-01.tsx`, `moon-tile-01.css`). One pill sits
// under the labels and slides to the selected tab on click (transitions.dev
// "tabs sliding": transform and width, 200ms, strong ease-out). Arrow keys
// move between tabs the way a tablist should, and snap: a keyboard action
// never animates. First paint and resizes snap too, so the pill never slides
// in from the left edge.
function FileTabs({
  files,
  active,
  onSelect,
}: {
  files: { filename: string }[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const pillRef = React.useRef<HTMLSpanElement>(null);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const animateNext = React.useRef(false);

  // The observer reads the live index from a ref and subscribes once: a new
  // ResizeObserver fires on observe, which would snap a click's slide.
  const activeRef = React.useRef(active);

  const place = React.useCallback((animate: boolean) => {
    const tab = refs.current[activeRef.current];
    const pill = pillRef.current;
    if (!tab || !pill) return;
    const list = listRef.current;
    if (!list) return;
    // Client rects, not offsetLeft/offsetWidth, which round to whole pixels
    // and leave the pill up to ~0.75px off a fractional-width tab.
    const l = list.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    // Layout width from computed style: fractional and untransformed.
    const layoutW = parseFloat(getComputedStyle(list).width);
    const scale = layoutW ? l.width / layoutW : 1;
    if (!animate) pill.style.transition = "none";
    pill.style.transform = `translateX(${(t.left - l.left) / scale - list.clientLeft + list.scrollLeft}px)`;
    pill.style.width = `${t.width / scale}px`;
    if (!animate) {
      void pill.offsetWidth;
      pill.style.transition = "";
    }
  }, []);

  React.useLayoutEffect(() => {
    activeRef.current = active;
    place(animateNext.current);
    animateNext.current = false;
  }, [active, place]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => place(false));
    ro.observe(list);
    return () => ro.disconnect();
  }, [place]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + files.length) % files.length;
    animateNext.current = false;
    onSelect(next);
    refs.current[next]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Files"
      onKeyDown={onKeyDown}
      className="relative -my-0.5 -ml-3 flex min-w-0 items-center gap-0.5 overflow-x-auto p-0.5"
    >
      {/* Concentric corners: the frame is 15px (code-frame.tsx) and the pill
          sits 7px in from its outer top and left edges (1px border, header
          py-1.5, the list's -my-0.5 and -ml-3 against pl-4, plus its p-0.5),
          so pill and tabs take 15 - 7 = 8px. Change one of those and
          recompute the other.

          The pill: neutral-50 with a hairline and a tight, close shadow so it
          lifts off the neutral-200 bar. Dark mirrors it a step lighter than its
          neutral-800 bar, with a light hairline. */}
      <span
        ref={pillRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0.5 left-0 w-0 rounded-[8px] bg-neutral-50 shadow-[0_0_0_1px_rgb(23_23_23/0.08),0_1px_1px_0_rgb(23_23_23/0.10)] transition-[transform,width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,width] motion-reduce:transition-none dark:bg-neutral-700/60 dark:shadow-[0_0_0_1px_rgb(250_250_250/0.08),0_1px_1px_0_rgb(10_10_10/0.4)]"
      />
      {files.map((f, i) => {
        const selected = i === active;
        return (
          <button
            key={f.filename}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => {
              animateNext.current = true;
              onSelect(i);
            }}
            className={
              "relative z-[1] shrink-0 rounded-[8px] px-2.5 py-1.5 font-mono text-xs transition-[color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none " +
              (selected ? "text-foreground" : "text-muted-foreground hover:text-foreground")
            }
          >
            {basename(f.filename)}
          </button>
        );
      })}
    </div>
  );
}
