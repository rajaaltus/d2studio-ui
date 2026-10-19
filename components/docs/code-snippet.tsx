import { CopyIconButton } from "./copy-icon-button";

/** A static file excerpt with its path in the header and a copy action. */
export function CodeSnippet({
  code,
  filename,
}: {
  code: string;
  filename: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-muted/30">
      <div className="flex items-center justify-between gap-2 border-b py-1.5 pl-4 pr-2">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {filename}
        </span>
        <CopyIconButton value={code} label={`Copy ${filename}`} />
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
