import { X } from "lucide-react";

// A single upload row, mid-flight. The bar is a plain width, not a transition:
// an illustration is a still of a moment, and a bar that animated to 24% every
// time the card scrolled into view would be telling a story it does not have.
const PERCENT = 24;

// bi:filetype-doc, inlined rather than pulled from an icon package: it is one
// path, and a registry item that reaches for a second icon dependency to draw
// a single glyph makes every install carry it.
function FileTypeDoc({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="currentColor" fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zm-7.839 9.166v.522q0 .384-.117.641a.86.86 0 0 1-.322.387a.9.9 0 0 1-.469.126a.9.9 0 0 1-.471-.126a.87.87 0 0 1-.32-.386a1.55 1.55 0 0 1-.117-.642v-.522q0-.386.117-.641a.87.87 0 0 1 .32-.387a.87.87 0 0 1 .471-.129q.264 0 .469.13a.86.86 0 0 1 .322.386q.117.255.117.641m.803.519v-.513q0-.565-.205-.972a1.46 1.46 0 0 0-.589-.63q-.381-.22-.917-.22q-.533 0-.92.22a1.44 1.44 0 0 0-.589.627q-.204.406-.205.975v.513q0 .563.205.973q.205.406.59.627q.386.216.92.216q.535 0 .916-.216q.383-.22.59-.627q.204-.41.204-.973M0 11.926v4h1.459q.603 0 .999-.238a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084q0-.63-.196-1.075a1.43 1.43 0 0 0-.59-.68q-.395-.234-1.004-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592a1.1 1.1 0 0 1-.196.422a.8.8 0 0 1-.334.252a1.3 1.3 0 0 1-.483.082H.79V12.57Zm7.422.483a1.7 1.7 0 0 0-.103.633v.495q0 .369.103.627a.83.83 0 0 0 .298.393a.85.85 0 0 0 .478.131a.9.9 0 0 0 .401-.088a.7.7 0 0 0 .273-.248a.8.8 0 0 0 .117-.364h.765v.076a1.27 1.27 0 0 1-.226.674q-.205.29-.55.454a1.8 1.8 0 0 1-.786.164q-.54 0-.914-.216a1.4 1.4 0 0 1-.571-.627q-.194-.408-.194-.976v-.498q0-.568.197-.978q.195-.411.571-.633q.378-.223.911-.223q.328 0 .607.097q.28.093.489.272a1.33 1.33 0 0 1 .466.964v.073H9.78a.85.85 0 0 0-.12-.38a.7.7 0 0 0-.273-.261a.8.8 0 0 0-.398-.097a.8.8 0 0 0-.475.138a.87.87 0 0 0-.301.398" />
    </svg>
  );
}

export default function Document01() {
  return (
    <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-muted p-3 shadow-sm">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800">
        <FileTypeDoc className="size-6 text-destructive" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-foreground">
          react-visualizations.pdf
        </span>

        <span
          role="progressbar"
          aria-valuenow={PERCENT}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Upload progress"
          className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-background"
        >
          <span
            className="block h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-sky-400"
            style={{ width: `${PERCENT}%` }}
          />
        </span>

        <span className="mt-1.5 block text-xs text-muted-foreground">
          29 KB / 120 KB
        </span>
      </span>

      <button
        type="button"
        aria-label="Cancel upload"
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-[color,background-color,scale] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-accent hover:text-accent-foreground active:scale-[0.92] motion-reduce:transition-[color,background-color] motion-reduce:active:scale-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
