"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";
// `lucide-react` has no `exports` map, so deep-imports work at runtime. The
// package doesn't ship `.d.ts` files alongside these subpaths so we silence
// the implicit-any complaint locally — the modules themselves are typed in
// the file body via the `IconLoaderMap` and component-prop type below.
// @ts-expect-error — runtime-only deep import; no sibling .d.ts shipped.
import dynamicIconImports from "lucide-react/dist/esm/dynamicIconImports";
// @ts-expect-error — runtime-only deep import; no sibling .d.ts shipped.
import DynamicIcon from "lucide-react/dist/esm/DynamicIcon";

type IconNode = Array<[string, Record<string, string | number>]>;
type IconLoader = () => Promise<{
  __iconNode: IconNode;
  default: React.ComponentType<unknown>;
}>;
type IconLoaderMap = Record<string, IconLoader>;

const LOADERS = dynamicIconImports as unknown as IconLoaderMap;
const ALL_ICON_NAMES: string[] = Object.keys(LOADERS).sort();

/** Cache iconNode lookups so a search → click → search round-trip doesn't
 * re-fetch the chunk each time. */
const iconNodeCache = new Map<string, IconNode>();

/** Convert a camelCase attribute name (e.g. `strokeWidth`) to its kebab-case
 * SVG equivalent (`stroke-width`). Lucide stores attrs as React-friendly camel
 * case; SVG strings need kebab. */
function attrToKebab(name: string): string {
  return name.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** Inflate a lucide iconNode array into a complete, currentColor-friendly SVG
 * string the rasterizer can rasterize. */
function nodesToSvgString(nodes: IconNode): string {
  const inner = nodes
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${attrToKebab(k)}="${v}"`)
        .join(" ");
      return `<${tag} ${a}/>`;
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ` +
    `viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    inner +
    `</svg>`
  );
}

/** Load a Lucide icon by name and return its SVG markup string. */
export async function loadLucideSvg(name: string): Promise<string> {
  const cached = iconNodeCache.get(name);
  if (cached) return nodesToSvgString(cached);
  const loader = LOADERS[name];
  if (!loader) throw new Error(`Unknown Lucide icon: ${name}`);
  const mod = await loader();
  iconNodeCache.set(name, mod.__iconNode);
  return nodesToSvgString(mod.__iconNode);
}

export interface LucidePickerProps {
  onSelect: (name: string, svg: string) => void;
  /** Cap on how many search results render at once. Lucide has thousands of
   * icons — listing all of them at once stalls the popover. */
  resultLimit?: number;
}

/**
 * Searchable grid of every Lucide icon. Thumbnails are rendered via Lucide's
 * own DynamicIcon component (which lazy-loads each icon's chunk) so we don't
 * statically import the whole library.
 */
export function LucidePicker({ onSelect, resultLimit = 96 }: LucidePickerProps) {
  const [query, setQuery] = React.useState("");
  const [loadingName, setLoadingName] = React.useState<string | null>(null);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ICON_NAMES.slice(0, resultLimit);
    return ALL_ICON_NAMES.filter((n) => n.includes(q)).slice(0, resultLimit);
  }, [query, resultLimit]);

  const handlePick = async (name: string) => {
    setLoadingName(name);
    try {
      const svg = await loadLucideSvg(name);
      onSelect(name, svg);
    } catch (e) {
      console.error("Failed to load Lucide icon", name, e);
    } finally {
      setLoadingName(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search
          size={12}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--ls-muted-foreground)]"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Lucide icons…"
          spellCheck={false}
          className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] py-1.5 pl-7 pr-2.5 text-xs text-[var(--ls-foreground)] outline-none focus:border-white/40"
        />
      </div>

      <div className="grid max-h-[320px] grid-cols-6 gap-1 overflow-y-auto pr-0.5">
        {results.map((name) => {
          const isLoading = loadingName === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => handlePick(name)}
              title={name}
              aria-label={name}
              disabled={isLoading}
              className="group flex aspect-square items-center justify-center rounded-md border border-[var(--ls-border)] text-[var(--ls-foreground)] transition-colors hover:border-white/40 hover:bg-[var(--ls-border)]/30 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin opacity-70" />
              ) : (
                <DynamicIcon
                  name={name as Parameters<typeof DynamicIcon>[0]["name"]}
                  size={16}
                  className="opacity-80 transition-opacity group-hover:opacity-100"
                />
              )}
            </button>
          );
        })}
        {results.length === 0 && (
          <p className="col-span-6 py-6 text-center text-[11px] text-[var(--ls-muted-foreground)]">
            No icons match &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      <p className="text-[10px] text-[var(--ls-muted-foreground)]">
        Showing {results.length} of {ALL_ICON_NAMES.length} icons from{" "}
        <span className="text-[var(--ls-foreground)]">Lucide</span>.
      </p>
    </div>
  );
}
