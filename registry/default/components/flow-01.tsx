import { CircleCheck, Database, LoaderCircle, Search, Send } from "lucide-react";

// An illustration, not a section: it draws one idea at whatever size the card
// gives it, so there is no page layout here and no breakpoint — the wall it
// lives on is what decides how wide it gets.
const STEPS = [
  {
    Icon: Search,
    title: "Query Analysis",
    detail: "Extract intent and entities",
    state: "done",
  },
  {
    Icon: Database,
    title: "Context Retrieval",
    detail: "Searching vector database",
    state: "running",
  },
  {
    Icon: Send,
    title: "Response Generation",
    detail: "Run inference with context",
    state: "pending",
  },
] as const;

export default function Flow01() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-muted p-4 shadow-sm">
      <p className="mb-4 text-sm font-medium text-foreground">Workflow</p>

      <ul className="space-y-3">
        {STEPS.map(({ Icon, title, detail, state }) => (
          <li
            key={title}
            // The whole row dims together rather than each part carrying its own
            // muted variant — a pending step is one thing that has not happened,
            // not three greyed labels.
            data-state={state}
            className="flex items-center gap-3 data-[state=pending]:opacity-40"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
              <Icon className="size-4 text-muted-foreground" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-foreground">
                {title}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {detail}
              </span>
            </span>

            {state === "done" && (
              <CircleCheck className="size-4 shrink-0 text-emerald-500" />
            )}
            {state === "running" && (
              <LoaderCircle className="size-4 shrink-0 animate-spin text-primary motion-reduce:animate-none" />
            )}
            {state === "pending" && (
              <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Pending
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
