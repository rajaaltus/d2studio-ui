"use client";

import * as React from "react";
import { SlidingTabs } from "@/components/ui/sliding-tabs";

const TABS = [
  { value: "cli", label: "CLI" },
  { value: "manual", label: "Manual" },
];

/** CLI or copy-by-hand. Both panes are server-rendered and only toggled here. */
export function InstallTabs({ cli, manual }: { cli: React.ReactNode; manual: React.ReactNode }) {
  const [tab, setTab] = React.useState("cli");
  return (
    <div className="flex flex-col gap-4">
      <SlidingTabs value={tab} onValueChange={setTab} tabs={TABS} aria-label="Install method" className="self-start" />
      <div hidden={tab !== "cli"}>{cli}</div>
      <div hidden={tab !== "manual"}>{manual}</div>
    </div>
  );
}
