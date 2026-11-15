"use client";

import * as React from "react";
import { Check, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { zipFiles } from "@/lib/zip";

/**
 * Saves `value` as a file, with the same transitions.dev icon swap as
 * CopyIconButton: the download glyph cross-fades with a blur into a check in
 * the same cell, so the pair reads as one control family in a file frame.
 *
 * The file is built in the browser from the code already on the page, so
 * nothing is fetched. One file saves under its own basename; pass `files` with
 * more than one entry and they save together as `<filename>.zip`, each at its
 * path inside the archive.
 */
export function DownloadIconButton({
  value,
  files,
  filename,
  label,
  className,
}: {
  value?: string;
  files?: { path: string; content: string }[];
  filename: string;
  label?: string;
  className?: string;
}) {
  const [done, setDone] = React.useState(false);
  const archive = files && files.length > 1;
  const base = filename.split("/").pop() || filename;
  const name = archive ? `${base.replace(/\.[^.]+$/, "")}.zip` : base;

  React.useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);

  const onDownload = () => {
    const blob =
      archive && files
        ? zipFiles(files)
      : new Blob([value ?? files?.[0]?.content ?? ""], {
          type: "text/plain;charset=utf-8",
        });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoked on the next tick: some browsers start the download after click()
    // returns, and an already-revoked URL saves an empty file.
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setDone(true);
  };

  return (
    <button
      type="button"
      onClick={onDownload}
      aria-label={done ? "Downloaded" : (label ?? `Download ${name}`)}
      title={`Download ${name}`}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:bg-foreground/5 hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="t-icon-swap" data-state={done ? "b" : "a"} aria-hidden>
        <Download className="t-icon size-3.5" data-icon="a" />
        <Check className="t-icon size-3.5" data-icon="b" />
      </span>
      <span className="sr-only" aria-live="polite">
        {done ? `${name} downloaded` : ""}
      </span>
    </button>
  );
}
