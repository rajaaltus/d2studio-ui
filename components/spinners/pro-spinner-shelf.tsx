import { PRO_SPINNERS } from "@/lib/pro-spinners";
import { FREE_SPINNERS } from "@/lib/free-spinners";
import { proShelfHref } from "@/lib/pro";
import { ProCta } from "@/components/blocks/pro-grid";

// What pro keeps for itself: its whole spinner library less the ones it gives
// away, which the free shelf above already shows running.
const FREE = new Set(FREE_SPINNERS.map((s) => s.name));
const PRO_ONLY = PRO_SPINNERS.filter((s) => !FREE.has(s.name)).length;

export function ProSpinnerShelf() {
  return (
    <section className="w-full max-w-7xl border-x border-[var(--ls-border)] mx-auto px-4 lg:px-8">
      <div className="flex flex-col gap-6 border-t border-[var(--ls-border)] py-12 sm:flex-row sm:items-center sm:justify-between lg:py-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ls-muted-foreground)]">D2 Pro</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {PRO_ONLY} more spinners
          </h2>
          <p className="max-w-xl text-sm text-[var(--ls-muted-foreground)]">
            Hand-drawn frame tables and spinner packs, the set this page leaves out.
          </p>
        </div>
        <div className="shrink-0">
          <ProCta href={proShelfHref("/spinners", "spinners")}>Check out D2 Pro</ProCta>
        </div>
      </div>
    </section>
  );
}
