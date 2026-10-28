"use client";

import * as React from "react";
import { CopyIconButton } from "@/components/docs/copy-icon-button";
import { InstallCommand } from "@/components/docs/install-command";
import { CssSpinner } from "@/components/spinners/css-spinner";
import { SpinnerDocsSheet } from "@/components/spinners/spinner-docs";
import { SIZE, snippetFor } from "@/components/spinners/spinner-snippet";
import { FREE_SPINNERS, type FreeSpinner } from "@/lib/free-spinners";

// The spinners D2 Pro gives away, drawn the way pro's own wall draws them: a
// small spinner beside the word an agent CLI would print, in one muted paint.

// The word beside each spinner, from pro's gallery. Hashed off the name, so a
// pattern always draws the same word there and here.
const WORDS = [
  "Billowing..", "Accomplishing..", "Channelling...", "Tinkering.", "Boogieing..", "Levitating.",
  "Elucidating..", "Forging...", "Architecting...", "Ebbing...", "Deciphering...", "Zesting...",
  "Swooping...", "Frolicking...", "Spelunking...", "Moseying...", "Perambulating...", "Stewing..",
  "Transmuting...", "Nebulizing...", "Scampering...", "Cascading...", "Noodling...", "Topsy-turvying...",
  "Honking...", "Bunning...", "Flummoxing...", "Fluttering...", "Whirring...", "Sublimating...",
  "Gusting...", "Improvising...", "Orbiting...", "Effecting...", "Dilly-dallying...", "Ping-ponging...",
  "Waddling...", "Forming...", "Cultivating...", "Gitifying...", "Pontificating...", "Hullaballooing...",
  "Ebbing...", "Zesting...", "Swooping...", "Moseying...", "Transmuting...", "Improvising...",
  "Tinkering...", "Boogieing...",
];
const wordFor = (name: string) => WORDS[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % WORDS.length];

// The wall in groups by the shape of the grid each pattern is drawn on, which
// is what decides where a spinner fits: a square beside a word, a wide strip
// in a button, a tall one in a list row.
const rows = (s: FreeSpinner) => s.pattern.rows ?? s.pattern.size ?? 3;
const cols = (s: FreeSpinner) => s.pattern.cols ?? s.pattern.size ?? 3;
// Picked by hand out of the 4 by 4 set: the four that read as weather.
const TEMPEST = new Set(["Mosaic", "Drizzle", "Tide", "Tumble"]);
const GROUPS = [
  { title: "Spire", caption: "taller than wide", test: (s: FreeSpinner) => rows(s) > cols(s) },
  { title: "Petite", caption: "3 by 3", test: (s: FreeSpinner) => rows(s) === 3 && cols(s) === 3 },
  { title: "Quartet", caption: "4 by 4", test: (s: FreeSpinner) => rows(s) === 4 && cols(s) === 4 && !TEMPEST.has(s.label) },
  { title: "Tempest", caption: "4 by 4, weather in motion", test: (s: FreeSpinner) => TEMPEST.has(s.label) },
  { title: "Grand", caption: "5 by 5", test: (s: FreeSpinner) => rows(s) === 5 && cols(s) === 5 },
  { title: "Panorama", caption: "wider than tall", test: (s: FreeSpinner) => cols(s) > rows(s) },
].map(({ test, ...g }) => ({ ...g, spinners: FREE_SPINNERS.filter(test) }));

// This site's card, the one /blocks draws: a bordered card holding a bordered
// preview well and a label row under it.
function SpinnerCard({ spinner }: { spinner: FreeSpinner }) {
  const code = React.useMemo(() => snippetFor(spinner), [spinner]);

  return (
    // content-visibility keeps a card scrolled out of view out of rendering,
    // its keyframes included; the intrinsic size is the card's real height.
    <li className="group relative flex flex-col gap-1.5 rounded-xl border bg-card p-2 transition-colors duration-200 hover:border-foreground/20 [content-visibility:auto] [contain-intrinsic-size:auto_166px]">
      <div className="flex h-[132px] items-center justify-center gap-2 rounded-lg border bg-gradient-to-b from-muted/40 to-muted">
        <span className="inline-flex items-center justify-center" style={{ padding: SIZE / 4 }}>
          <CssSpinner pattern={spinner.pattern} size={SIZE} />
        </span>
        <span className="text-[14px] text-foreground/50">{wordFor(spinner.name)}</span>
      </div>
      <div className="flex items-center gap-2 pl-1">
        <p className="truncate text-[12px] text-foreground/50">{spinner.label}</p>
        {/* Shown on hover where there is hover; always there on touch. */}
        <CopyIconButton
          value={code}
          label={`Copy ${spinner.label} spinner code`}
          className="ml-auto transition-[opacity,color,background-color,transform] focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:opacity-0"
        />
      </div>
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
            <div>
              <SpinnerDocsSheet />
            </div>
          </div>
          <div className="w-full md:w-auto md:min-w-[22rem]">
            <InstallCommand args="add @d2/pixel-spinner" />
          </div>
        </div>

        {/* One paint for the whole wall: a soft white, never pure, that turns
            to the ink in light mode where white would vanish. Unlit cells are
            pro's faint tint of the same. */}
        <div className="flex flex-col gap-10 [--cell-color:var(--foreground)] [--cell-off:oklch(0_0_0/0.05)] dark:[--cell-color:var(--ls-paint-white)] dark:[--cell-off:oklch(1_0_0/0.08)]">
          {GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <div className="flex items-baseline gap-3">
                <h3 className="text-base font-medium text-foreground">{group.title}</h3>
                <span className="text-xs text-[var(--ls-muted-foreground)]">
                  {group.caption} · {group.spinners.length}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {group.spinners.map((spinner) => (
                  <SpinnerCard key={spinner.name} spinner={spinner} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
