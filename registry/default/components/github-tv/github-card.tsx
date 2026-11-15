// The GitHub chip: a bolted metal plate around a tiny CRT playing the Octocat
// as a pure-CSS pixel grid.
//
// The cell keeps its own --col/--row so the hover rainbow can be one gradient
// painted across the whole grid and sampled per cell, rather than 71
// separately-coloured squares.

import type { CSSProperties } from "react";

const MASK_CELLS = new Set<number>([
  22, 23, 24, 25, 36, 37, 38, 39, 40, 41, 42, 43, 51, 52, 53, 54, 55, 56, 57,
  58, 59, 60, 66, 67, 76, 77, 82, 83, 92, 93, 97, 98, 99, 108, 109, 110, 113,
  114, 125, 126, 129, 130, 141, 142, 145, 146, 147, 156, 157, 158, 162, 163,
  164, 171, 172, 173, 178, 180, 181, 186, 187, 188, 189, 195, 202, 203, 204,
  212, 213, 218, 219,
]);

// Which of the four ripple frames a cell peaks on — written as groups because
// that is how the wave was drawn, then inverted to a per-cell lookup.
const PEAK_FRAME_BY_CELL: Record<number, 0 | 1 | 2 | 3> = (() => {
  const map: Record<number, 0 | 1 | 2 | 3> = {};
  const groups: ReadonlyArray<readonly [0 | 1 | 2 | 3, readonly number[]]> = [
    [0, [164, 171, 181, 186]],
    [
      1,
      [
        53, 54, 55, 56, 57, 58, 83, 92, 99, 108, 147, 156, 163, 172, 180, 187,
        202,
      ],
    ],
    [
      2,
      [
        37, 38, 39, 40, 41, 42, 51, 52, 59, 60, 67, 76, 82, 93, 98, 109, 114,
        125, 130, 141, 146, 157, 162, 173, 188, 195, 203, 204, 213, 218,
      ],
    ],
    [
      3,
      [
        22, 23, 24, 25, 36, 43, 66, 77, 97, 110, 113, 126, 129, 142, 145, 158,
        178, 189, 212, 219,
      ],
    ],
  ];
  for (const [frame, cells] of groups) {
    for (const cell of cells) map[cell] = frame;
  }
  return map;
})();

// Four corner screws on the chip shell.
const pins = ["left-1 top-1", "right-1 top-1", "left-1 bottom-1", "right-1 bottom-1"];

// Two side bolts on the label plate.
const bolts = ["left-1", "right-1"];

export default function GithubCard({
  href = "https://github.com/godwin159",
  label = "Github",
}: {
  href?: string;
  label?: string;
}) {
  // zoom and not `scale`: zoom scales the layout box too, so the chip and its
  // name plate grow together and keep the gap between them.
  //
  // Hover is three things on one beat — the pixels take the rainbow and start
  // rippling (github-tv.css), the bloom behind the chip comes up, and the
  // screen's shadow spreads — all at 200ms on one ease-out curve, and only the
  // ripple loops. Press is the fourth: a scale, not the lift this used to do,
  // because a link that jumps on hover moves the target out from under the
  // cursor.
  return (
    <div
      style={{ zoom: 1.03 }}
      className="flex flex-col items-center justify-center gap-3"
    >
      <div
        className="relative rounded-xl bg-neutral-200 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.06),0_8px_22px_-10px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.06] ring-inset dark:bg-transparent dark:bg-gradient-to-br dark:from-neutral-800/90 dark:via-neutral-900 dark:to-neutral-950 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.6),0_6px_18px_-8px_rgba(0,0,0,0.6)] dark:ring-white/5"
      >
        {pins.map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`pointer-events-none absolute ${pos} size-1 rounded-full bg-black/15 dark:bg-white/15`}
          />
        ))}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub repository"
          className="group relative inline-flex items-center justify-center rounded-[12px] bg-neutral-400/80 transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] select-none active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none dark:bg-neutral-950"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-[14px] bg-gradient-to-b from-white/10 via-fuchsia-300/10 to-cyan-300/10 opacity-0 blur-xl transition-[opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100"
          />
          <svg
            width={56}
            height={56}
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-neutral-400 dark:text-border block drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-[filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:drop-shadow-[0_4px_14px_rgba(149,120,200,0.45)]"
          >
            <rect
              x={0.5}
              y={0.5}
              width={55}
              height={55}
              rx={11.5}
              fill="url(#gh_tv_body)"
              fillOpacity={0.2}
              className="hidden dark:block"
            />
            <rect
              x={0.5}
              y={0.5}
              width={55}
              height={55}
              rx={11.5}
              stroke="currentColor"
            />
            {/* Light theme: a smoked-glass backing under the screen tint, so
                the pixels read on the light body; dark sits on neutral-950. */}
            <rect
              x={4}
              y={4}
              width={48}
              height={48}
              rx={8}
              className="fill-neutral-800 dark:fill-transparent"
            />
            <g filter="url(#gh_tv_inner)">
              <rect
                x={4}
                y={4}
                width={48}
                height={48}
                rx={8}
                fill="url(#gh_tv_screen)"
                fillOpacity={0.5}
              />
            </g>
            <defs>
              <filter
                id="gh_tv_inner"
                x={4}
                y={4}
                width={49}
                height={48}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx={1} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2={-1}
                  k3={1}
                />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" result="inner1" />
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha2"
                />
                <feOffset />
                <feGaussianBlur stdDeviation={1.65} />
                <feComposite
                  in2="hardAlpha2"
                  operator="arithmetic"
                  k2={-1}
                  k3={1}
                />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
                <feBlend in2="inner1" />
              </filter>
              <linearGradient
                id="gh_tv_body"
                x1={28}
                y1={0}
                x2={28}
                y2={56}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#DEDEDE" />
                <stop offset={0.5} stopColor="#5E517A" />
                <stop offset={1} stopColor="#9578C8" />
              </linearGradient>
              <linearGradient
                id="gh_tv_screen"
                x1={52}
                y1={4}
                x2={4}
                y2={52}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#B9CEFF" />
                <stop offset={0.569024} stopColor="#2A2A2A" stopOpacity={0.5} />
                <stop offset={1} stopColor="#FDB08C" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </svg>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <span className="gh-pixel-grid translate-x-px">
              {Array.from({ length: 256 }, (_, i) => {
                if (!MASK_CELLS.has(i)) return <span key={i} />;
                return (
                  <span
                    key={i}
                    className={`gh-pixel-cell gh-pixel-cell--f${PEAK_FRAME_BY_CELL[i]}`}
                    style={
                      {
                        "--col": i % 16,
                        "--row": Math.floor(i / 16),
                      } as CSSProperties
                    }
                  />
                );
              })}
            </span>
          </span>
        </a>
      </div>
      <span className="relative rounded-md bg-gradient-to-b from-white to-neutral-50 px-5 py-1.5 text-xs font-medium tracking-wide text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_-2px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06] ring-inset dark:from-neutral-800/90 dark:to-neutral-950 dark:font-normal dark:tracking-normal dark:text-muted-foreground dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_8px_-2px_rgba(0,0,0,0.5)] dark:ring-white/5">
        {bolts.map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`pointer-events-none absolute ${pos} top-1/2 size-1 -translate-y-1/2 rounded-full bg-black/20 shadow-[inset_0_-0.5px_0_rgba(255,255,255,0.7),0_0.5px_0_rgba(0,0,0,0.15)] dark:bg-white/20 dark:shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.4),0_0.5px_0_rgba(255,255,255,0.06)]`}
          />
        ))}
        {label}
      </span>
    </div>
  );
}
