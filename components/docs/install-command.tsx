"use client";

import * as React from "react";
import { SlidingTabs } from "@/components/ui/sliding-tabs";
import { CopyIconButton } from "./copy-icon-button";

const MANAGERS = [
  { value: "pnpm", label: "pnpm", runner: "pnpm dlx", add: "pnpm add" },
  { value: "npm", label: "npm", runner: "npx", add: "npm install" },
  { value: "yarn", label: "yarn", runner: "yarn dlx", add: "yarn add" },
  { value: "bun", label: "bun", runner: "bunx --bun", add: "bun add" },
] as const;

type Manager = (typeof MANAGERS)[number]["value"];

const STORAGE_KEY = "d2-docs-pm";
const SYNC_EVENT = "d2-docs-pm-change";

function readStored(): Manager {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (MANAGERS.some((m) => m.value === v)) return v as Manager;
  } catch {
    /* storage blocked */
  }
  return "pnpm";
}

/**
 * Every command block on the page follows one package-manager choice: picking
 * npm in Installation should not leave the Registry examples on pnpm. The
 * choice is remembered per browser and broadcast to the other blocks.
 */
function useManager() {
  const [manager, setManager] = React.useState<Manager>("pnpm");

  React.useEffect(() => {
    setManager(readStored());
    const onChange = (e: Event) =>
      setManager((e as CustomEvent<Manager>).detail);
    window.addEventListener(SYNC_EVENT, onChange);
    return () => window.removeEventListener(SYNC_EVENT, onChange);
  }, []);

  const choose = React.useCallback((next: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked */
    }
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
  }, []);

  return [manager, choose] as const;
}

/** A `shadcn@latest <args>` command, rendered for the reader's package manager. */
export function InstallCommand({ args }: { args: string }) {
  const [manager] = useManager();
  const runner = MANAGERS.find((m) => m.value === manager)!.runner;
  return <CommandFrame prefix={`${runner} shadcn@latest `} args={args} />;
}

/** `pnpm add <packages>` and its equivalents, on the same shared choice. */
export function PackageInstall({ packages }: { packages: string[] }) {
  const [manager] = useManager();
  const add = MANAGERS.find((m) => m.value === manager)!.add;
  return <CommandFrame prefix={`${add} `} args={packages.join(" ")} />;
}

function CommandFrame({ prefix, args }: { prefix: string; args: string }) {
  const [manager, choose] = useManager();
  const command = `${prefix}${args}`;

  // Same bar and chip as the code frame and the illustration file tabs. The
  // pill overrides carry `!`: the `.t-tabs-*` rules in globals.css are
  // unlayered, so they beat layered utilities on specificity alone.
  return (
    // Concentric corners, measured from the frame's outer edge: the bar sits
    // 7px in on top and left (1px border + py-1.5 / pl-1.5), its .t-tabs
    // radius is 8px and the pill's 5px (8 - 3px track padding), so the frame
    // takes 8 + 7 = 15px. Change an inset and recompute the chain.
    <div className="overflow-hidden rounded-[15px] border bg-muted/30">
      <div className="flex items-center justify-between gap-2 border-b bg-neutral-200/60 py-1.5 pl-1.5 pr-2 dark:bg-neutral-800/80">
        {/* Every tab is a whole 54px (the widest label, "pnpm", is 53.6px).
            Sized to their labels the bar came out 212.625px, so on a 2x screen
            its right edge fell between device pixels while the pill, a
            composited layer, snapped to whole ones: the gap right of "bun"
            read wider than the 3px everywhere else. Whole widths put every
            edge of bar, tab and pill on the pixel grid. */}
        <SlidingTabs
          value={manager}
          onValueChange={choose}
          tabs={MANAGERS.map(({ value, label }) => ({ value, label }))}
          aria-label="Package manager"
          className="bg-neutral-100/80! shadow-[inset_0_0_0_1px_oklch(0.205_0_0/0.10)]! dark:bg-[oklch(1_0_0/0.05)]! dark:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06)]! [&_.t-tab]:rounded-[5px]! [&_.t-tab]:w-[54px] [&_.t-tab]:justify-center [&_.t-tab]:px-0 [&_.t-tab]:py-0.5 [&_.t-tab]:font-mono [&_.t-tab]:text-xs [&_.t-tabs-pill]:rounded-[5px]! [&_.t-tabs-pill]:bg-neutral-50! [&_.t-tabs-pill]:shadow-[0_0_0_1px_oklch(0.205_0_0/0.08),0_1px_1px_0_oklch(0.205_0_0/0.10)]! dark:[&_.t-tabs-pill]:bg-neutral-700/60! dark:[&_.t-tabs-pill]:shadow-[0_0_0_1px_oklch(0.985_0_0/0.08),0_1px_1px_0_oklch(0.145_0_0/0.4)]!"
        />
        <CopyIconButton value={command} label="Copy command" />
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
        <code>
          <span className="select-none text-muted-foreground/60">$ </span>
          <span className="text-muted-foreground">{prefix}</span>
          <span className="text-foreground">{args}</span>
        </code>
      </pre>
    </div>
  );
}
