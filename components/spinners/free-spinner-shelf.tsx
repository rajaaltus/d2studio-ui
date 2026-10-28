"use client";

import * as React from "react";
import { PixelSpinner } from "@/components/pixel-spinner";
import { CopyIconButton } from "@/components/docs/copy-icon-button";
import { InstallCommand } from "@/components/docs/install-command";
import { FREE_SPINNERS, type FreeSpinner } from "@/lib/free-spinners";

// The spinners D2 Pro gives away, running, each with its code a click away.
// The copied code is a small component over the @d2/pixel-spinner engine,
// written the way the published spinner-* presets are.
function snippetFor(s: FreeSpinner) {
  const name = `Spinner${s.label.replace(/[^A-Za-z0-9]/g, "")}`;
  const animation = s.animation ? ` animation="${s.animation}"` : "";
  return `// npx shadcn@latest add @d2/pixel-spinner
import * as React from "react";
import { PixelSpinner, type SpinnerPattern } from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = ${JSON.stringify(s.pattern)};

export function ${name}(
  props: Omit<React.ComponentProps<typeof PixelSpinner>, "pattern" | "color">,
) {
  return <PixelSpinner pattern={pattern} color="${s.color}"${animation} {...props} />;
}
`;
}

// Every spinner is its own interval re-rendering a grid, so forty at once is
// real work. A card mounts its spinner only while it is near the screen; off
// screen it is an empty square of the same size, so nothing shifts.
function useNearScreen<T extends Element>() {
  const ref = React.useRef<T>(null);
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, near] as const;
}

function SpinnerCard({ spinner }: { spinner: FreeSpinner }) {
  const [ref, near] = useNearScreen<HTMLLIElement>();
  const code = React.useMemo(() => snippetFor(spinner), [spinner]);

  return (
    <li
      ref={ref}
      className="relative flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-card,transparent)]"
    >
      {near && (
        <PixelSpinner
          pattern={spinner.pattern}
          color={spinner.color}
          animation={spinner.animation}
          cellSize={10}
          gap={2}
        />
      )}
      <span className="text-[11px] text-[var(--ls-muted-foreground)]">{spinner.label}</span>
      <CopyIconButton value={code} label={`Copy ${spinner.label} spinner code`} className="absolute top-1.5 right-1.5" />
    </li>
  );
}

export function FreeSpinnerShelf() {
  return (
    <section className="w-full max-w-7xl border-x border-[var(--ls-border)] mx-auto px-4 lg:px-8">
      <div className="flex flex-col gap-8 border-t border-[var(--ls-border)] py-12 lg:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ls-muted-foreground)]">Free</p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {FREE_SPINNERS.length} ready-made spinners
            </h2>
            <p className="max-w-xl text-sm text-[var(--ls-muted-foreground)]">
              Install the engine once, then copy any spinner below into your project.
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[22rem]">
            <InstallCommand args="add @d2/pixel-spinner" />
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {FREE_SPINNERS.map((spinner) => (
            <SpinnerCard key={spinner.name} spinner={spinner} />
          ))}
        </ul>
      </div>
    </section>
  );
}
