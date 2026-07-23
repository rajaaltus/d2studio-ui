"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { CodeBlock } from "@/components/ui/code-block";
import ProgressBar, {
  DARK_THEME,
  LIGHT_THEME,
} from "@/registry/default/components/progress-bar";
import Controls from "./controls";
import { INSTALL_CMD, usageSnippet } from "./snippet";

export default function Page() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const mode = isDark ? "dark" : "light";
  // One editable draft per mode, so flipping the toggle doesn't clobber your tweaks.
  const [drafts, setDrafts] = useState({
    light: LIGHT_THEME,
    dark: DARK_THEME,
  });
  const [value, setValue] = useState(83);

  const theme = drafts[mode];
  const base = isDark ? DARK_THEME : LIGHT_THEME;
  const snippet = usageSnippet(
    theme,
    base,
    isDark ? "DARK_THEME" : "LIGHT_THEME",
    value,
    "Progress..",
  );

  return (
    <main className="relative min-h-screen bg-[#cbcbcb] px-8 pr-[344px] dark:bg-[#0b0b0b]">
      <div className="absolute top-8 left-8 z-10">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center justify-center gap-10 py-24">
        <ProgressBar value={value} theme={theme} />

        <div className="w-full space-y-6">
          <Block label="Install">
            <CodeBlock code={INSTALL_CMD} language="bash" />
          </Block>
          <Block label="Usage">
            <CodeBlock code={snippet} />
          </Block>
        </div>
      </div>

      <div className="fixed top-8 right-8 bottom-8">
        <Controls
          theme={theme}
          onChange={(t) => setDrafts((d) => ({ ...d, [mode]: t }))}
          value={value}
          onValueChange={setValue}
          onReset={() => setDrafts((d) => ({ ...d, [mode]: base }))}
        />
      </div>
    </main>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-medium tracking-[0.14em] text-black/40 uppercase dark:text-white/40">
        {label}
      </p>
      {children}
    </div>
  );
}
