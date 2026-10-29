import * as React from "react";

import { cn } from "@/lib/utils";

// A bento scaffold rather than a finished bento: nine slots in the scattered
// arrangement an integration diagram wants, with one emphasised centre. Empty
// slots draw themselves as dashed placeholders, so the layout is legible before
// there is anything in it — which is the point of shipping the frame separately
// from what goes in it.
//
// `DiagramGrid` is headless on purpose: no section, no heading, no background,
// so it drops straight into a hero. The default export is that grid in a padded
// section, which is only how it is shown here.

type SlotSpec = {
  /** 1-based slot number. */
  id: number;
  /** Span classes for the bento arrangement, from lg up. */
  span?: string;
  /** Name the empty slot wears, so the frame reads as a diagram before it is filled. */
  label: string;
  /** Decorative fill for a slot with nothing in it yet. */
  texture?: "dots" | "mesh" | "hatch" | "weave" | "blueprint" | "none";
  /** The one slot the diagram is built around. */
  emphasized?: boolean;
};

const SLOTS: SlotSpec[] = [
  { id: 1, label: "Gateway", texture: "mesh" },
  { id: 2, label: "Ingest stream", span: "lg:col-span-2", texture: "hatch" },
  { id: 3, label: "Beacon", texture: "blueprint" },
  { id: 4, label: "Vault", span: "lg:row-span-2", texture: "weave" },
  {
    id: 5,
    label: "Nucleus",
    span: "lg:col-span-2 lg:row-span-2",
    texture: "blueprint",
    emphasized: true,
  },
  { id: 6, label: "Relay", texture: "blueprint" },
  { id: 7, label: "Ledger", span: "lg:row-span-2", texture: "hatch" },
  { id: 8, label: "Signal mesh", span: "lg:col-span-2", texture: "mesh" },
  { id: 9, label: "Echo", texture: "blueprint" },
];

// Every texture is painted in --border rather than a fixed grey, so the fill
// tracks the same token as the dashed edge it sits inside and inverts with the
// host instead of turning into a light smear on a dark card. Each is a gradient
// rather than inline SVG: it tiles to whatever size the slot ends up, and the
// dense ones are a couple of lines here against a few hundred <path> squares.
const TEXTURES: Record<string, React.CSSProperties> = {
  dots: {
    backgroundImage: "radial-gradient(var(--border) 1.1px, transparent 1.1px)",
    backgroundSize: "12px 12px",
  },
  // Staggered pin dots: one grid plus the same grid pushed half a tile along
  // both axes, which is the offset every other row carries. Scaled up from the
  // source figure's 4px tile — at that pitch a 1px dot in --border is below
  // what a screen actually shows.
  mesh: {
    backgroundImage:
      "radial-gradient(var(--border) 1.4px, transparent 1.4px), radial-gradient(var(--border) 1.4px, transparent 1.4px)",
    backgroundSize: "14px 14px",
    backgroundPosition: "0 0, 7px 7px",
  },
  hatch: {
    backgroundImage:
      "repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 8px)",
  },
  weave: {
    backgroundImage:
      "repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 3px)",
    opacity: 0.4,
  },
};

// The one texture that is not a repeat: a floor plan for the slot the diagram
// is built around. Drawn rather than tiled, so it needs real geometry — thick
// load bearing walls, thin partitions, a stair run, door swings, a bay arc and
// a setting out grid. Every line runs to the frame edge and the shell is drawn
// past it: with `slice` the drawing is cropped rather than fitted, so linework
// that stopped short of the viewBox would leave a blank margin at one aspect
// ratio and read as a detail of a larger sheet at none of them.
// Four different plans off one sheet, not four crops of one drawing: the small
// slots sit side by side, so a shared window is read as a repeat however the
// crop is placed. Each is its own room of the building instead — the centre
// plan, then a stair core, a rotunda and a room bank.
function BlueprintSheet({
  view,
  children,
}: {
  view: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      aria-hidden
      viewBox={view}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full opacity-70"
      fill="none"
      stroke="var(--border)"
      strokeLinecap="square"
    >
      {children}
    </svg>
  );
}

function BlueprintPlan() {
  return (
    <BlueprintSheet view="0 0 200 140">
      {/* Setting out grid, edge to edge, dotted so it sits under everything. */}
      <g strokeWidth="0.3" strokeDasharray="1 3">
        <path d="M56 0v140M96 0v140M148 0v140" />
        <path d="M0 30h200M0 76h200M0 104h200" />
      </g>

      {/* Load bearing shell, stepped so the plan has a corner to turn, and run
          off three sides so nothing floats in the middle of the card. Medium
          thin rather than a solid black wall: the whole sheet is hairlines, so
          the shell only has to be a step heavier than the partitions. */}
      <path
        d="M-4 30h100V-4h108v148H-4Z"
        strokeWidth="0.7"
        strokeLinejoin="miter"
      />
      {/* Bay window, the one curve on the sheet. */}
      <path d="M110 30a32 32 0 0 0 64 0" strokeWidth="0.7" />
      <path d="M118 30a24 24 0 0 0 48 0" strokeWidth="0.3" />

      {/* Partitions. */}
      <g strokeWidth="0.45">
        <path d="M56 30v74M-4 104h100M96 76h108M148 76v68M56 58h40M148 30v46" />
      </g>

      {/* Stair run, with the flight arrow. */}
      <g strokeWidth="0.3">
        <path d="M8 112h40v32H8Z" />
        <path d="M8 118h40M8 124h40M8 130h40M8 136h40" />
        <path d="M28 140v-26l-4 6M28 114l4 6" />
      </g>

      {/* Door swings: a leaf and the quarter arc it sweeps. */}
      <g strokeWidth="0.3">
        <path d="M56 76h14" />
        <path d="M70 76a14 14 0 0 0-14-14" />
        <path d="M96 118h14" />
        <path d="M110 118a14 14 0 0 0-14-14" />
        <path d="M24 104v14" />
        <path d="M24 118a14 14 0 0 0 14-14" />
      </g>

      {/* Columns on the open side, where there is no wall to carry the slab. */}
      <g strokeWidth="0.45">
        <path d="M93 73h6v6h-6ZM145 73h6v6h-6ZM197 73h6v6h-6Z" />
      </g>

      {/* Room tags, on the same dotted register as the grid they sit over. */}
      <g strokeWidth="0.3" strokeDasharray="1 3">
        <circle cx="28" cy="64" r="6" />
        <circle cx="76" cy="88" r="6" />
        <circle cx="122" cy="110" r="6" />
        <circle cx="176" cy="52" r="6" />
      </g>
    </BlueprintSheet>
  );
}

// Stair core: two flights around a shaft, with the corridor they open off.
function BlueprintStair() {
  return (
    <BlueprintSheet view="0 0 140 98">
      <g strokeWidth="0.22" strokeDasharray="1 3">
        <path d="M52 0v98M96 0v98M0 24h140M0 68h140" />
      </g>
      <path d="M-4 12H96V102" strokeWidth="0.5" strokeLinejoin="miter" />
      <path d="M96 56H144" strokeWidth="0.5" />
      <g strokeWidth="0.32">
        <path d="M52 12v44M8 56h88M96 34h48" />
      </g>
      {/* Flights up and down, split by the half landing at x 30. */}
      <g strokeWidth="0.22">
        <path d="M8 20h36v30H8ZM52 20h36v30H52Z" />
        <path d="M8 26h36M8 32h36M8 38h36M8 44h36" />
        <path d="M52 26h36M52 32h36M52 38h36M52 44h36" />
        <path d="M26 50V18l-3 5M26 18l3 5" />
      </g>
      {/* Lift shaft: the crossed square a plan uses for a void. */}
      <g strokeWidth="0.32">
        <path d="M104 66h26v26h-26ZM104 66l26 26M130 66l-26 26" />
      </g>
      <g strokeWidth="0.22">
        <path d="M96 80h12" />
        <path d="M108 80a12 12 0 0 0-12-12" />
      </g>
      <g strokeWidth="0.22" strokeDasharray="1 3">
        <circle cx="30" cy="76" r="6" />
        <circle cx="118" cy="24" r="6" />
      </g>
    </BlueprintSheet>
  );
}

// Rotunda: the drum, its ring of columns and the two walls it sits between.
function BlueprintRotunda() {
  return (
    <BlueprintSheet view="0 0 140 98">
      <g strokeWidth="0.22" strokeDasharray="1 3">
        <path d="M70 0v98M0 49h140" />
        <circle cx="70" cy="49" r="42" />
      </g>
      <path d="M-4 14H144M-4 88H144" strokeWidth="0.5" />
      <circle cx="70" cy="49" r="30" strokeWidth="0.5" />
      <circle cx="70" cy="49" r="18" strokeWidth="0.32" />
      {/* Spokes on the diagonals only, so the drum reads as ribbed, not filled. */}
      <g strokeWidth="0.22">
        <path d="M49 28 91 70M91 28 49 70M70 19v60M40 49h60" />
      </g>
      <g strokeWidth="0.32">
        <path d="M17 46h6v6h-6ZM117 46h6v6h-6ZM67 11h6v6h-6ZM67 81h6v6h-6Z" />
      </g>
      <g strokeWidth="0.22">
        <path d="M40 49H28" />
        <path d="M28 49a12 12 0 0 0 12 12" />
      </g>
    </BlueprintSheet>
  );
}

// Room bank: cells off a corridor, the plan a wing repeats.
function BlueprintRooms() {
  return (
    <BlueprintSheet view="0 0 140 98">
      <g strokeWidth="0.22" strokeDasharray="1 3">
        <path d="M0 40h140M0 62h140M34 0v98M70 0v98M106 0v98" />
      </g>
      <path d="M-4 8H144M-4 90H144" strokeWidth="0.5" />
      <g strokeWidth="0.32">
        <path d="M-4 40H144M-4 62H144" />
        <path d="M16 8v32M52 8v32M88 8v32M124 8v32" />
        <path d="M34 62v28M70 62v28M106 62v28" />
      </g>
      {/* One swing per cell, alternating side, which is how a wing is drawn. */}
      <g strokeWidth="0.22">
        <path d="M6 40v-10" />
        <path d="M6 30a10 10 0 0 1 10 10" />
        <path d="M42 40v-10" />
        <path d="M42 30a10 10 0 0 1 10 10" />
        <path d="M78 40v-10" />
        <path d="M78 30a10 10 0 0 1 10 10" />
        <path d="M24 62v10" />
        <path d="M24 72a10 10 0 0 0 10-10" />
        <path d="M60 62v10" />
        <path d="M60 72a10 10 0 0 0 10-10" />
      </g>
      <g strokeWidth="0.22" strokeDasharray="1 3">
        <circle cx="88" cy="76" r="6" />
        <circle cx="124" cy="24" r="6" />
      </g>
    </BlueprintSheet>
  );
}

const BLUEPRINTS: Record<number, () => React.JSX.Element> = {
  3: BlueprintStair,
  5: BlueprintPlan,
  6: BlueprintRotunda,
  9: BlueprintRooms,
};

function SlotTexture({ kind, id }: { kind: SlotSpec["texture"]; id: number }) {
  if (kind === "blueprint") {
    const Plan = BLUEPRINTS[id] ?? BlueprintPlan;
    return <Plan />;
  }
  const style = kind && TEXTURES[kind];
  if (!style) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60"
      style={style}
    />
  );
}

function DiagramSlot({
  id,
  span,
  label,
  texture = "none",
  emphasized = false,
  children,
}: SlotSpec & { children?: React.ReactNode }) {
  const empty = !children;

  return (
    <div
      data-slot={id}
      className={cn(
        "relative flex min-h-[120px] items-center justify-center overflow-hidden rounded-2xl border p-5 transition-colors",
        // A filled slot is a card; an empty one is the outline of where a card
        // will go, which is why only the empty state is dashed and translucent.
        emphasized
          ? // The one place in the file that names palette colours rather than
            // tokens, so it is also the one place that needs a dark twin: the
            // 50s would sit as a pale slab on a dark page. The 950s at 75% are
            // the same three hues read back at the other end of the ramp.
            "bg-gradient-to-r from-sky-50/50 via-blue-50/50 to-emerald-50/50 shadow-xl dark:from-sky-200/50 dark:via-blue-200/50 dark:to-emerald-200/50"
          : empty
            ? "bg-card/50 hover:bg-card/80 border-dashed"
            : "bg-card shadow-md",
        span,
      )}
    >
      {empty && <SlotTexture kind={texture} id={id} />}
      {empty ? (
        <div className="text-muted-foreground relative flex flex-col items-center gap-2 text-center">
          <span className="flex size-8 items-center justify-center rounded-lg border border-dashed text-xs font-medium">
            {id}
          </span>
          <span className="text-xs font-medium tracking-wide">{label}</span>
        </div>
      ) : (
        <div className="relative w-full">{children}</div>
      )}
    </div>
  );
}

export function DiagramGrid({
  /** Content per slot, keyed by slot id (1–9). Anything left out stays a placeholder. */
  slots,
  className,
}: {
  slots?: Partial<Record<number, React.ReactNode>>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // grid-flow-dense so a slot that spans two columns does not leave the
        // hole before it empty — the scatter is the layout, not a side effect.
        "grid auto-rows-[minmax(120px,1fr)] grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {SLOTS.map((slot) => (
        <DiagramSlot key={slot.id} {...slot}>
          {slots?.[slot.id]}
        </DiagramSlot>
      ))}
    </div>
  );
}

export default function DiagramGridSection({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section className={cn("bg-background w-full px-6 py-16", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            One core, nine moving parts
          </h2>
          <p className="text-muted-foreground mt-3 text-base text-pretty sm:text-lg">
            The frame your architecture diagram sits in. Fill the slots you have
            content for and the rest keep holding their place.
          </p>
        </div>
        <DiagramGrid />
      </div>
    </section>
  );
}
