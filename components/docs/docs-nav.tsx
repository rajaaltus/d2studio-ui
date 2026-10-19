"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DocsNavGroup = {
  title: string;
  items: { id: string; label: string }[];
};

// How far below the viewport top a heading must pass to count as "reading it":
// the sticky header is 64px, plus a little air.
const READ_LINE = 120;

/**
 * Sidebar with a scroll-spy. The active marker is one bar on the rail that
 * slides between links (transform + height, measured) rather than a border
 * that blinks from one link to the next — the eye can follow where it went.
 */
export function DocsNav({ groups }: { groups: DocsNavGroup[] }) {
  const ids = React.useMemo(
    () => groups.flatMap((g) => g.items.map((i) => i.id)),
    [groups],
  );
  const [active, setActive] = React.useState(ids[0]);
  const navRef = React.useRef<HTMLElement>(null);
  const barRef = React.useRef<HTMLSpanElement>(null);
  const placed = React.useRef(false);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= READ_LINE) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  React.useLayoutEffect(() => {
    const nav = navRef.current;
    const bar = barRef.current;
    const link = nav?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!nav || !bar || !link) return;

    const navTop = nav.getBoundingClientRect().top;
    const { top, height } = link.getBoundingClientRect();
    const write = () => {
      bar.style.transform = `translateY(${top - navTop}px)`;
      bar.style.height = `${height}px`;
      bar.style.opacity = "1";
    };

    // First placement lands without a tween, or the bar flies in from the top.
    if (placed.current) {
      write();
    } else {
      const prev = bar.style.transition;
      bar.style.transition = "none";
      write();
      void bar.offsetHeight;
      bar.style.transition = prev;
      placed.current = true;
    }
  }, [active]);

  return (
    <nav
      ref={navRef}
      aria-label="Documentation"
      className="relative space-y-7 border-l text-sm"
    >
      <span
        ref={barRef}
        aria-hidden
        className="docs-nav-bar pointer-events-none absolute -left-px top-0 w-px bg-foreground opacity-0"
      />
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
            {group.title}
          </p>
          <ul>
            {group.items.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    data-id={item.id}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "block py-1.5 pl-4 pr-2 transition-colors duration-150 ease-out",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
