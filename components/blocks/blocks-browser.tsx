"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Search,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Columns2,
  Columns3,
  Boxes,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import { BlockCard } from "./block-card";
import { MoreSoonCard } from "./more-soon-card";
import type { Doc } from "@/convex/_generated/dataModel";

type Block = Doc<"blocks">;
type Density = "comfortable" | "compact";
type View = "all" | "category";

const TYPES = [
  { key: "blocks", label: "Blocks", icon: Boxes, href: "/blocks" },
  { key: "pages", label: "Pages", icon: FileText, href: "/templates" },
  {
    key: "illustrations",
    label: "Illustrations",
    icon: ImageIcon,
    href: "/illustration",
  },
] as const;

const PAGE_SIZES = [6, 12, 24];

const ACCESS_OPTIONS = [
  { value: "all", label: "All tiers" },
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
] as const;

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "available", label: "Available" },
  { value: "coming_soon", label: "Coming soon" },
] as const;

export function BlocksBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const blocks = useQuery(api.blocks.listBlocks, { limit: 100 });
  const categories = useQuery(api.categories.get);

  const [filtersOpen, setFiltersOpen] = React.useState(true);
  const [category, setCategory] = React.useState(
    () => searchParams.get("type") || "all",
  );
  const [access, setAccess] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [density, setDensity] = React.useState<Density>("comfortable");
  const [view, setView] = React.useState<View>("all");
  const [pageSize, setPageSize] = React.useState(12);
  const [page, setPage] = React.useState(1);

  const setCategoryAndUrl = React.useCallback(
    (slug: string) => {
      setCategory((prev) => (prev === slug ? "all" : slug));
      const next = category === slug ? "all" : slug;
      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") params.delete("type");
      else params.set("type", next);
      const qs = params.toString();
      router.replace(qs ? `/blocks?${qs}` : "/blocks", { scroll: false });
    },
    [router, searchParams, category],
  );

  const matchesCategory = React.useCallback((b: Block, slug: string) => {
    if (slug === "all") return true;
    if (b.blockType === slug) return true;
    return (b.categories ?? []).some((c) => c.toLowerCase() === slug);
  }, []);

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { all: blocks?.length ?? 0 };
    for (const c of categories ?? []) {
      map[c.slug] = (blocks ?? []).filter((b) =>
        matchesCategory(b, c.slug),
      ).length;
    }
    return map;
  }, [blocks, categories, matchesCategory]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return (blocks ?? []).filter((b: Block) => {
      if (!matchesCategory(b, category)) return false;
      if (access !== "all" && (b.accessTier ?? "free") !== access) return false;
      if (status !== "all" && (b.codeStatus ?? "coming_soon") !== status)
        return false;
      if (q) {
        const haystack = [
          b.title,
          b.description,
          ...(b.categories ?? []),
          ...(b.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [blocks, category, access, status, search, matchesCategory]);

  // Reset to first page whenever the result set changes
  React.useEffect(() => {
    setPage(1);
  }, [category, access, status, search, view, pageSize]);

  const grouped = category === "all" && view === "category";
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);
  const rangeEnd = Math.min(start + pageSize, filtered.length);

  const gridCols =
    density === "comfortable"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col border-x border-b">
        <div className="flex w-full flex-1">
        {/* Filters sidebar */}
        <aside
          className={cn(
            "hidden shrink-0 border-r bg-background transition-[width] duration-200 md:block",
            filtersOpen ? "w-64" : "w-14",
          )}
        >
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto">
            {filtersOpen ? (
              <>
                <div className="flex items-center justify-between border-b px-4 py-3.5">
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <SlidersHorizontal className="size-4" />
                    Filters
                  </span>
                  <button
                    type="button"
                    aria-label="Collapse filters"
                    onClick={() => setFiltersOpen(false)}
                    className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <PanelLeftClose className="size-4" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-5 p-4">
                  <FilterGroup label="Types">
                    <div className="flex flex-wrap gap-1.5">
                      {TYPES.map((t) => {
                        const active = t.key === "blocks";
                        const Icon = t.icon;
                        return (
                          <Link
                            key={t.key}
                            href={t.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors",
                              active
                                ? "border-foreground/30 bg-muted font-medium text-foreground"
                                : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                            )}
                          >
                            <Icon className="size-4" />
                            {t.label}
                          </Link>
                        );
                      })}
                    </div>
                  </FilterGroup>

                  <Divider />

                  <FilterGroup label="View">
                    <div className="flex flex-wrap gap-1.5">
                      <SegBtn
                        active={view === "category"}
                        onClick={() => setView("category")}
                        icon={<LayoutGrid className="size-4" />}
                      >
                        By category
                      </SegBtn>
                      <SegBtn
                        active={view === "all"}
                        onClick={() => setView("all")}
                        icon={<Rows3 className="size-4" />}
                      >
                        All blocks
                      </SegBtn>
                    </div>
                  </FilterGroup>

                  <Divider />

                  <FilterGroup label="Categories">
                    <div className="flex flex-wrap gap-1.5">
                      {(categories ?? []).map((c) => (
                        <CategoryPill
                          key={c.slug}
                          active={category === c.slug}
                          count={counts[c.slug] ?? 0}
                          onClick={() => setCategoryAndUrl(c.slug)}
                        >
                          {c.name}
                        </CategoryPill>
                      ))}
                    </div>
                  </FilterGroup>

                  <Divider />

                  <FilterGroup label="Access">
                    <div className="flex flex-wrap gap-1.5">
                      {ACCESS_OPTIONS.map((o) => (
                        <CategoryPill
                          key={o.value}
                          active={access === o.value}
                          onClick={() => setAccess(o.value)}
                        >
                          {o.label}
                        </CategoryPill>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup label="Status">
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_OPTIONS.map((o) => (
                        <CategoryPill
                          key={o.value}
                          active={status === o.value}
                          onClick={() => setStatus(o.value)}
                        >
                          {o.label}
                        </CategoryPill>
                      ))}
                    </div>
                  </FilterGroup>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-3.5">
                <button
                  type="button"
                  aria-label="Open filters"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <PanelLeftOpen className="size-4" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Toolbar */}
          <div className="sticky top-16 z-20 flex items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blocks..."
                className="h-9 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="flex items-center gap-1 rounded-md border p-0.5">
              <DensityButton
                active={density === "comfortable"}
                onClick={() => setDensity("comfortable")}
                label="Comfortable grid"
              >
                <Columns2 className="size-4" />
              </DensityButton>
              <DensityButton
                active={density === "compact"}
                onClick={() => setDensity("compact")}
                label="Compact grid"
              >
                <Columns3 className="size-4" />
              </DensityButton>
            </div>
          </div>

          {/* Result count */}
          <div className="px-4 pt-4 text-xs text-muted-foreground">
            {blocks === undefined
              ? "Loading blocks…"
              : `${filtered.length} block${filtered.length === 1 ? "" : "s"}`}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {blocks === undefined ? (
              <div className={cn("grid gap-4", gridCols)}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-xl border bg-muted"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border bg-muted/40 p-12 text-center">
                <p className="mb-2 text-lg font-semibold">No blocks found</p>
                <p className="text-sm text-muted-foreground">
                  Try a different category or clear your search.
                </p>
              </div>
            ) : grouped ? (
              <div className="flex flex-col gap-10">
                {(categories ?? []).map((c) => {
                  const items = filtered.filter((b) =>
                    matchesCategory(b, c.slug),
                  );
                  if (items.length === 0) return null;
                  return (
                    <section key={c.slug} className="flex flex-col gap-4">
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-sm font-semibold">{c.name}</h2>
                        <span className="text-xs text-muted-foreground">
                          {items.length}
                        </span>
                      </div>
                      <div className={cn("grid gap-4", gridCols)}>
                        {items.map((block) => (
                          <BlockCard key={block._id} block={block} />
                        ))}
                      </div>
                    </section>
                  );
                })}
                <MoreSoonCard />
              </div>
            ) : (
              <div className={cn("grid gap-4", gridCols)}>
                {paged.map((block) => (
                  <BlockCard key={block._id} block={block} />
                ))}
                {currentPage === totalPages && <MoreSoonCard />}
              </div>
            )}
          </div>
        </main>
        </div>

        {/* Pagination — full-width band, centered on the page axis */}
        {!grouped && filtered.length > 0 && (
          <div className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-5xl flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  aria-label="Blocks per page"
                  className="rounded-md border bg-background px-1.5 py-1 text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span>
                  per page · {start + 1}–{rangeEnd} of {filtered.length}
                </span>
              </div>

              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      disabled={currentPage === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                  {getPageItems(currentPage, totalPages).map((item, i) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`e${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={item === currentPage}
                          onClick={() => setPage(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function getPageItems(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7)
    return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) items.push("ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="border-t border-dashed border-border" aria-hidden />
  );
}

function SegBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors",
        active
          ? "border-transparent bg-muted font-medium text-foreground ring-1 ring-foreground/20"
          : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function CategoryPill({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors",
        active
          ? "border-foreground/30 bg-muted font-medium text-foreground"
          : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <span className="truncate">{children}</span>
      {count !== undefined && (
        <span
          className={cn(
            "rounded px-1 text-[10px] tabular-nums",
            active ? "text-foreground" : "text-muted-foreground/70",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function DensityButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
