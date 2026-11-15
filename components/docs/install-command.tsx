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
    <div className="overflow-hidden rounded-xl border bg-muted/30">
      <div className="flex items-center justify-between gap-2 border-b bg-neutral-200/60 px-2 py-1.5 dark:bg-neutral-800/80">
        <SlidingTabs
          value={manager}
          onValueChange={choose}
          tabs={MANAGERS.map(({ value, label }) => ({ value, label }))}
          aria-label="Package manager"
          className="bg-neutral-100/80! shadow-[inset_0_0_0_1px_rgb(23_23_23/0.10)]! dark:bg-[oklch(1_0_0/0.05)]! dark:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06)]! [&_.t-tab]:rounded-[4px]! [&_.t-tab]:px-2 [&_.t-tab]:py-0.5 [&_.t-tab]:font-mono [&_.t-tab]:text-xs [&_.t-tabs-pill]:rounded-[4px]! [&_.t-tabs-pill]:bg-neutral-50! [&_.t-tabs-pill]:shadow-[0_0_0_1px_rgb(23_23_23/0.08),0_1px_1px_0_rgb(23_23_23/0.10)]! dark:[&_.t-tabs-pill]:bg-neutral-700/60! dark:[&_.t-tabs-pill]:shadow-[0_0_0_1px_rgb(250_250_250/0.08),0_1px_1px_0_rgb(10_10_10/0.4)]!"
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
