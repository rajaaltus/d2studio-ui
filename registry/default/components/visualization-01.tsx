import "./visualization-01/visualization-01.css";

// Usage split three ways. The bars share one track rather than sitting in three
// of their own: the point of the picture is that they add up to a budget, and
// three separate rails would only show three unrelated numbers.
//
// The largest share carries a blue to sky gradient; the other two are the host's
// own token at two depths, so the picture reads as one budget with a lit lead
// rather than three unrelated colours.
const ROWS = [
  { label: "User prompt tokens", percent: 43 },
  { label: "Tool results", percent: 31 },
  { label: "System context", percent: 14 },
] as const;

const used = ROWS.reduce((n, r) => n + r.percent, 0);

export default function Visualization01() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-muted p-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-medium text-foreground">Usage</p>
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          {used}%
        </p>
      </div>

      <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-background">
        {ROWS.map(({ label, percent }, i) => (
          <span
            key={label}
            // Opacity rather than three hues for the rest: they are parts of one
            // budget, so they read as one colour at two depths — and it stays
            // correct in whatever palette the host is running.
            style={
              i === 0
                ? { width: `${percent}%` }
                : { width: `${percent}%`, opacity: 1 - i * 0.3 }
            }
            className={
              i === 0 ? "vz-lead block h-full" : "block h-full bg-primary"
            }
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {ROWS.map(({ label, percent }, i) => (
          <li key={label} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden
              style={i === 0 ? undefined : { opacity: 1 - i * 0.3 }}
              className={
                i === 0
                  ? "vz-lead size-2 shrink-0 rounded-sm"
                  : "size-2 shrink-0 rounded-sm bg-primary"
              }
            />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {label}
            </span>
            <span className="font-mono tabular-nums text-foreground">
              {percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
