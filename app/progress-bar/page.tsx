"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { CodeBlock } from "@/components/ui/code-block";
import ProgressBar, {
  type BarTheme,
  DARK_THEME,
  FANCY_DARK_THEME,
  FANCY_THEME,
  LIGHT_THEME,
} from "@/registry/default/components/progress-bar";
import ProgressInspector, {
  type Chrome,
  comboOf,
  type Fill,
  type Variant,
  useProgressRun,
} from "@/components/progress-inspector";
import { copyText } from "@/lib/utils";
import { designPrompt, INSTALL_CMD, usageSnippet } from "./snippet";

// Two looks, each with a light and a dark base. The page follows the app theme;
// the only choice it offers is which look you're editing. Name + value together
// so the usage snippet can spell the import instead of dumping every key.
const BASES = {
  glass: {
    light: ["LIGHT_THEME", LIGHT_THEME],
    dark: ["DARK_THEME", DARK_THEME],
  },
  fancy: {
    light: ["FANCY_THEME", FANCY_THEME],
    dark: ["FANCY_DARK_THEME", FANCY_DARK_THEME],
  },
} as const;

const TARGET = 83;

export default function Page() {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const [variant, setVariant] = useState<Variant>("glass");
  const [fill, setFill] = useState<Fill>("beam");
  const [chrome, setChrome] = useState<Chrome>("full");
  // One draft per look-and-mode, so switching looks doesn't clobber your tweaks.
  const [drafts, setDrafts] = useState<Record<string, BarTheme>>({});
  // The bar's own value is animated; the snippet keeps quoting the target, so
  // a run doesn't rewrite the code block sixty times a second.
  const run = useProgressRun(TARGET);

  const key = `${variant}:${mode}`;
  const [baseName, base] = BASES[variant][mode];
  const theme = drafts[key] ?? base;
  const snippet = usageSnippet(
    theme,
    base,
    baseName,
    TARGET,
    "Progress..",
    fill,
    chrome,
  );

  return (
    <main className="relative min-h-screen bg-[#cbcbcb] px-8 dark:bg-[#0b0b0b]">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center justify-center gap-10 py-24">
        <div className="flex flex-col items-center gap-6">
          {/* Component first, controls under it — same pill as the site dock,
              so the page has one control language. */}
          <ProgressBar
            value={run.value}
            label={run.label}
            theme={theme}
            fill={fill}
            chrome={chrome}
            fillFilter={run.fillFilter(theme.fill.solid)}
          />
          <ProgressInspector
            theme={theme}
            onChange={(t) => setDrafts((d) => ({ ...d, [key]: t }))}
            variant={variant}
            onVariantChange={setVariant}
            fill={fill}
            onFillChange={setFill}
            chrome={chrome}
            onChromeChange={setChrome}
            mode={mode}
            run={run}
          />
        </div>

        <div className="w-full space-y-6">
          <Block label="Install">
            <CodeBlock code={INSTALL_CMD} language="bash" />
          </Block>
          <Block label="Usage">
            {/* Fixed height, not auto: the snippet gains a line for every key
                you tune, and a card that grows shoves the page around while
                you're picking colours. Longer snippets scroll inside it. */}
            <CodeBlock code={snippet} className="h-[248px] overflow-y-scroll" />
          </Block>
          {/* The same design as the snippet above, written for an assistant
              rather than for a compiler — the picks, their real values, and the
              usage that goes with them. */}
          <PromptButton
            value={designPrompt({
              theme,
              variant,
              fill,
              chrome,
              motion: run.motionName,
              mode,
              combo: comboOf(theme, mode),
              snippet,
            })}
          />
        </div>
      </div>
    </main>
  );
}

function PromptButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await copyText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="h-11 w-full cursor-pointer rounded-full border border-black/10 bg-white/60 text-xs font-medium text-black/70 transition-colors hover:bg-white dark:border-white/12 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
    >
      {copied ? "Copied" : "Copy prompt"}
    </button>
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
