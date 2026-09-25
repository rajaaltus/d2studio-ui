"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRO_LINK_PROPS } from "@/lib/pro";
import type { ComponentGroup } from "@/lib/components-docs";

export type ProLink = { name: string; title: string; href: string };

/**
 * The /components index: search, the grouped primitives, then pro.
 *
 * The active row is marked by one pill that slides to whichever link matches
 * the route, rather than a background that blinks off one row and on another.
 * The nav sits in a layout, so it survives navigation and the pill has
 * somewhere to slide from. First placement lands without a tween.
 */
export function ComponentsNav({
  groups,
  pro,
  onNavigate,
  autoFocusSearch = false,
}: {
  groups: ComponentGroup[];
  pro: ProLink[];
  /** Lets the mobile sheet close itself once a link is chosen. */
  onNavigate?: () => void;
  autoFocusSearch?: boolean;
}) {
  const pathname = usePathname() ?? "/components";
  const [query, setQuery] = React.useState("");
  const [proOpen, setProOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const pillRef = React.useRef<HTMLSpanElement>(null);
  const placed = React.useRef(false);

  const q = query.trim().toLowerCase();
  const visible = React.useMemo(
    () =>
      groups
        .map((g) => ({ ...g, items: g.items.filter((i) => i.title.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0),
    [groups, q],
  );
  const visiblePro = pro.filter((p) => p.title.toLowerCase().includes(q));
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  // "/" jumps to the filter from anywhere on the page, as in most docs sites.
  // No animation on it: a keyboard shortcut is used too often to wait for one.
  React.useEffect(() => {
    if (!autoFocusSearch) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoFocusSearch]);

  // The rail and frame persist across pages, so Next sees the new page as
  // already on screen and keeps the old scroll offset. A new component page
  // should open at its title.
  const lastPath = React.useRef(pathname);
  React.useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (!window.location.hash) window.scrollTo({ top: 0 });
  }, [pathname]);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const link = list.querySelector<HTMLElement>('[aria-current="page"]');
    if (!link) {
      pill.style.opacity = "0";
      return;
    }
    const write = () => {
      pill.style.transform = `translateY(${link.offsetTop}px)`;
      pill.style.height = `${link.offsetHeight}px`;
      pill.style.opacity = "1";
    };
    if (placed.current) {
      write();
      return;
    }
    const prev = pill.style.transition;
    pill.style.transition = "none";
    write();
    void pill.offsetHeight;
    pill.style.transition = prev;
    placed.current = true;
    // Deep links land with their row in view, not 40 rows down a scrolled rail.
    link.scrollIntoView({ block: "nearest" });
  }, [pathname, q]);

  return (
    <div className="flex flex-col gap-4">
      <label className="relative block">
        <span className="sr-only">Filter components</span>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder={`Filter ${total} components`}
          className="h-8 w-full rounded-md border bg-transparent pl-8 pr-8 text-sm outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
        />
        {autoFocusSearch && !query && (
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border px-1.5 font-mono text-[10px] text-muted-foreground">
            /
          </kbd>
        )}
      </label>

      <div ref={listRef} className="relative flex flex-col gap-5">
        <span
          ref={pillRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 rounded-md bg-muted opacity-0 transition-[transform,height,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        />

        {!q && (
          <NavLink href="/components" current={pathname === "/components"} onNavigate={onNavigate}>
            Overview
          </NavLink>
        )}

        {visible.map((group) => (
          <div key={group.slug} className="flex flex-col gap-0.5">
            <GroupLabel>{group.label}</GroupLabel>
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                href={`/components/${item.name}`}
                current={pathname === `/components/${item.name}`}
                onNavigate={onNavigate}
              >
                {item.title}
              </NavLink>
            ))}
          </div>
        ))}

        {visiblePro.length > 0 && (
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              aria-expanded={proOpen || !!q}
              onClick={() => setProOpen((o) => !o)}
              className="group flex items-center justify-between rounded-md px-2 py-1 text-left"
            >
              <GroupLabel className="px-0">
                Pro <span className="ml-1 tabular-nums text-muted-foreground/60">{visiblePro.length}</span>
              </GroupLabel>
              <ChevronRight
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
                  (proOpen || q) && "rotate-90",
                )}
              />
            </button>
            {/* 0fr → 1fr lets the list open to its own height without measuring it. */}
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                proOpen || q ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="flex min-h-0 flex-col gap-0.5 overflow-hidden" inert={!(proOpen || q)}>
                {visiblePro.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    {...PRO_LINK_PROPS}
                    className="group/pro flex items-center justify-between rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    <span className="truncate">{p.title}</span>
                    <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover/pro:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {visible.length === 0 && visiblePro.length === 0 && (
          <p className="px-2 text-sm text-muted-foreground">No components match “{query}”.</p>
        )}
      </div>
    </div>
  );
}

function GroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

function NavLink({
  href,
  current,
  onNavigate,
  children,
}: {
  href: string;
  current: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "relative rounded-md px-2 py-1 text-sm transition-colors duration-150",
        current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
