"use client";

import * as React from "react";
import {
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Upload,
} from "lucide-react";

import {
  Divider,
  GroupLabel,
  LIFT,
  PILL,
  Segmented,
} from "@/components/progress-inspector";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import {
  GITHUB_MARK,
  MATT_SIZES,
  MATT_THEME,
  MattButton,
  MattIcon,
  type MattSize,
} from "@/registry/default/components/button-matt";
import { INSTALL_CMD, promptText, usageSnippet, type Config } from "./snippet";

// The button itself lives in registry/default/components/button-matt.tsx — one
// copy, shipped to the registry and rendered here.
const SIZE_LABELS: Record<MattSize, string> = {
  sm: "Small (sm)",
  default: "Medium (default)",
  lg: "Large (lg)",
  xl: "Extra Large (xl)",
};

const STAR_MARK =
  "M12 1.6l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.36l-6.18 3.25L7 13.73l-5-4.87 6.91-1z";

const ICONS: { name: string; node: React.ReactNode }[] = [
  { name: "GitHub", node: GITHUB_MARK },
  { name: "Star", node: STAR_MARK },
  { name: "Download", node: <Download /> },
  { name: "Sparkles", node: <Sparkles /> },
];

const DEFAULT_LABEL = "github";

/** A card on the same spec as the dock pills — same border, same lift, squircle
 *  corners — so the snippets read as part of the same panel, not a code dump. */
function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-background [corner-shape:squircle]",
        LIFT,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 py-1.5 pr-1.5 pl-1.5">
        <GroupLabel>{title}</GroupLabel>
        <CopyButton
          value={code}
          aria-label={`Copy ${title}`}
          className="size-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        />
      </div>
      <pre className="max-h-48 overflow-auto p-3.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
        <code className="whitespace-pre-wrap break-words">{code}</code>
      </pre>
    </div>
  );
}

/** The inspector's pill, squared off and with a wider right lip. `rounded-xl`
 *  over its `rounded-full` puts the dock on the same 12px squircle as the size
 *  boards and the code blocks, so the panel reads as one set of cards. The
 *  padding is asymmetric because the left always opens on a GroupLabel that
 *  carries its own — the two ends only look even when the right gets more. */
const DOCK_PILL = cn(PILL, "rounded-xl pr-3 [corner-shape:squircle]");

/** A round control on the dock: same 32px slug as the inspector's Segmented
 *  pills, so every button on the row lands on one grid. `aria-pressed` is what
 *  draws the selected state — the styling follows the semantics, not a prop. */
const SLUG =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-muted/60 hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground disabled:pointer-events-none disabled:opacity-30";

function Slug({ className, ...props }: React.ComponentProps<"button">) {
  return <button type="button" {...props} className={cn(SLUG, className)} />;
}

/** The icon pick, as one pill: the marks, an upload slot, and the on/off. */
function IconPill({
  icons,
  pick,
  showIcon,
  onPick,
  onToggle,
  onUpload,
}: {
  icons: { name: string; node: React.ReactNode }[];
  pick: number;
  showIcon: boolean;
  onPick: (index: number) => void;
  onToggle: () => void;
  onUpload: (file: File | undefined) => void;
}) {
  return (
    // The swatches take the slug's own text colour rather than the ink sweep:
    // pastel marks on a white pill would be a picker you can't read, and the
    // pressed state is what has to be obvious here, not the gradient.
    <div
      className={cn(
        DOCK_PILL,
        "[--ink:linear-gradient(currentColor,currentColor)] [--ink-solid:currentColor]",
      )}
    >
      <GroupLabel>Icon</GroupLabel>
      {icons.map((option, i) => (
        <Slug
          key={option.name}
          onClick={() => onPick(i)}
          aria-label={option.name}
          aria-pressed={showIcon && pick === i}
        >
          <MattIcon icon={option.node} box="size-4" />
        </Slug>
      ))}

      <label
        aria-label="Upload an SVG icon"
        className={cn(SLUG, "border border-dashed border-border/70")}
      >
        <Upload className="size-3.5" />
        <input
          type="file"
          accept="image/svg+xml,.svg"
          className="sr-only"
          onChange={(e) => {
            onUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>

      <Divider />
      <Slug
        onClick={onToggle}
        aria-pressed={!showIcon}
        aria-label={showIcon ? "Hide icon" : "Show icon"}
      >
        {showIcon ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
      </Slug>
    </div>
  );
}

function LabelPill({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={DOCK_PILL}>
      <GroupLabel>Label</GroupLabel>
      {/* Borderless on purpose: inside a pill, a second box around the field
          would read as a control within a control. */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={DEFAULT_LABEL}
        aria-label="Button label"
        className="h-8 w-32 rounded-full bg-transparent px-2.5 text-sm outline-none placeholder:text-foreground/40 focus-visible:bg-muted"
      />
    </div>
  );
}

/** The size pick — plus the reset for the whole panel, on the last pill rather
 *  than in a header the dock lost. */
function SizePill({
  value,
  onChange,
  onReset,
  canReset,
}: {
  value: MattSize;
  onChange: (size: MattSize) => void;
  onReset: () => void;
  canReset: boolean;
}) {
  return (
    <div className={DOCK_PILL}>
      <GroupLabel>Size</GroupLabel>
      <Segmented<MattSize>
        options={{ SM: "sm", MD: "default", LG: "lg", XL: "xl" } as const}
        value={value}
        onChange={onChange}
        className="text-xs"
      />

      <Divider />
      <Slug onClick={onReset} disabled={!canReset} aria-label="Reset">
        <RotateCcw className="size-3.5" />
      </Slug>
    </div>
  );
}

/** One size, drawn and named. Stays a plain box rather than a second way to
 *  pick — the sample inside is itself a button, and nesting one in another is
 *  invalid. The pill picks; the board only shows which pick is live. */
function SizeBoard({
  size,
  icon,
  label,
  active,
}: {
  size: MattSize;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        // A flat fill, not the old fade to transparent: a white metal chip needs
        // an even ground to sit on, and a gradient board reads as a second
        // surface competing with the one on the button.
        "flex min-h-[120px] flex-1 basis-[180px] flex-col items-center justify-center gap-3 rounded-2xl border bg-muted/60 p-5 transition-colors [corner-shape:squircle]",
        active ? "border-foreground/25 bg-muted" : "border-border/60",
      )}
    >
      <MattButton size={size} icon={icon}>
        {label}
      </MattButton>
      <span
        className={cn(
          "text-[11px] tracking-wide",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {SIZE_LABELS[size]}
      </span>
    </div>
  );
}

// An upload is inlined as a data: URL and masked, so it never leaves the page.
// Capped because the string ends up in the DOM — a 4MB logo would be inlined
// four times over once every size box renders it.
const MAX_UPLOAD = 512 * 1024;

export default function Page() {
  const [label, setLabel] = React.useState("");
  const [pick, setPick] = React.useState(0);
  const [showIcon, setShowIcon] = React.useState(true);
  const [size, setSize] = React.useState<MattSize>("default");
  const [upload, setUpload] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const untouched =
    label === "" && pick === 0 && showIcon && size === "default" && !upload;

  const icons = upload
    ? [...ICONS, { name: "Custom", node: upload }]
    : ICONS;
  const current = icons[Math.min(pick, icons.length - 1)];

  const onUpload = (file: File | undefined) => {
    if (!file) return;
    // SVG only: a raster mark masked to the ink sweep loses its own colour and
    // goes soft the moment it's scaled to the xl box. Vector is the only source
    // that survives both.
    if (file.type !== "image/svg+xml") {
      setUploadError("SVG only.");
      return;
    }
    if (file.size > MAX_UPLOAD) {
      setUploadError("Keep it under 512 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUpload(String(reader.result));
      setUploadError(null);
      setPick(ICONS.length);
      setShowIcon(true);
    };
    reader.onerror = () => setUploadError("Could not read that file.");
    reader.readAsDataURL(file);
  };

  // Every snippet below is written from this — change a control and the prompt,
  // the usage and the highlighted board all move together.
  const cfg: Config = {
    size,
    label: label || DEFAULT_LABEL,
    icon: showIcon ? current.name : null,
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-6 py-16">
      {/* Wrapping flex, not a grid: the boxes are content-sized (min-width:auto
          on a flex child), so a long label widens its box instead of clipping. */}
      <div className="flex w-full max-w-4xl flex-wrap justify-center gap-3">
        {(Object.keys(MATT_SIZES) as MattSize[]).map((s) => (
          <SizeBoard
            key={s}
            size={s}
            active={s === size}
            icon={showIcon ? current.node : null}
            label={label || DEFAULT_LABEL}
          />
        ))}
      </div>

      {/* Each question gets its own pill, on the same dock spec as the progress
          inspector — icon, label, size. MATT_THEME rides along so the icon swatches
          resolve the same ink tokens the buttons do. */}
      <div
        className={`${MATT_THEME} flex w-full max-w-4xl flex-wrap items-center justify-center gap-2`}
      >
        <IconPill
          icons={icons}
          pick={pick}
          showIcon={showIcon}
          onPick={(i) => {
            setPick(i);
            setShowIcon(true);
          }}
          onToggle={() => setShowIcon((v) => !v)}
          onUpload={onUpload}
        />

        <LabelPill value={label} onChange={setLabel} />

        <SizePill
          value={size}
          onChange={setSize}
          canReset={!untouched}
          onReset={() => {
            setLabel("");
            setPick(0);
            setShowIcon(true);
            setSize("default");
            setUpload(null);
            setUploadError(null);
          }}
        />
      </div>

      {uploadError ? (
        <p className="-mt-4 text-xs text-destructive">{uploadError}</p>
      ) : upload ? (
        <p className="-mt-4 max-w-md text-center text-xs text-muted-foreground">
          Uploaded mark is masked to the ink sweep and fitted to each size — any
          source dimension works.
        </p>
      ) : null}

      {/* The prompt is written from the live config, so the icon and label
          picked above are already in it — copy and paste it at an agent. */}
      <div className="w-full max-w-4xl">
        <CodeBlock title="Prompt" code={promptText(cfg)} />
      </div>

      <div className="grid w-full max-w-4xl items-start gap-3 sm:grid-cols-2">
        <CodeBlock title="Usage" code={usageSnippet(cfg)} />
        <CodeBlock title="CLI" code={INSTALL_CMD} />
      </div>
    </div>
  );
}
