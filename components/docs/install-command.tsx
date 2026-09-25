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

  return (
    <div className="overflow-hidden rounded-xl border bg-muted/30">
      <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
        <SlidingTabs
          value={manager}
          onValueChange={choose}
          tabs={MANAGERS.map(({ value, label }) => ({ value, label }))}
          aria-label="Package manager"
          className="bg-transparent [&_.t-tab]:px-2 [&_.t-tab]:py-0.5 [&_.t-tab]:font-mono [&_.t-tab]:text-xs [&_.t-tabs-pill]:bg-foreground/[0.07] [&_.t-tabs-pill]:shadow-none"
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
