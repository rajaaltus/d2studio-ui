// The Buy Me a Coffee chip: a bolted metal plate around a tiny CRT playing the
// cup as a pure-CSS pixel grid, steam and all.
//
// Drawn twice: the second pass is the same grid at 60% under plus-lighter,
// which is what gives the amber its bloom. Two stacked grids beat a filter
// here — opacity stays the only animated property, so it stays on the
// compositor.

const MASK_CELLS = new Set<number>([
  19, 20, 22, 25, 35, 36, 38, 41, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
  92, 93, 97, 98, 107, 109, 110, 113, 114, 123, 126, 129, 130, 139, 142, 145,
  146, 155, 157, 158, 161, 162, 171, 172, 173, 177, 178, 187, 193, 194, 202,
  203, 210, 211, 212, 213, 214, 215, 216, 217, 218, 227, 228, 229, 230, 231,
  232, 233,
]);

// 16 cells of 2px + 15 gaps of 1px = 47px square. Unlit cells still render:
// they hold the grid's shape.
//
// `pxc-<i>` and not `px-<i>`: Tailwind v4 mints numeric spacing utilities on
// demand, so a `px-` class with a cell number after it becomes padding-inline (the last cell would get 58rem) and
// the grid blows out sideways.
const cells = (pass: string) =>
  Array.from({ length: 256 }, (_, i) => (
    <span
      key={`${pass}-${i}`}
      className={MASK_CELLS.has(i) ? `px on pxc-${i}` : "px"}
    />
  ));

// Four corner screws on the chip shell.
const pins = ["left-1 top-1", "right-1 top-1", "left-1 bottom-1", "right-1 bottom-1"];

// Two side bolts on the label plate.
const bolts = ["left-1", "right-1"];

export default function CoffeeCard({
  href = "https://buymeacoffee.com/godwindev",
  label = "Buy me a coffee",
}: {
  href?: string;
  label?: string;
}) {
  // zoom and not `scale`: zoom scales the layout box too, so the chip and its
  // name plate grow together and keep the gap between them.
  //
  // Hover is two things on one 200ms beat — the bloom behind the chip comes up
  // and the screen's shadow spreads. Press is a scale, not the lift this used
  // to do, because a link that jumps on hover moves the target out from under
  // the cursor. The steam itself is not a hover state: it runs on its own in
  // coffee-tv.css, which is why there is no (hover: hover) gate here.
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
          aria-label="Buy me a coffee"
          className="group relative inline-flex items-center justify-center rounded-[12px] bg-neutral-400/80 transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] select-none active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none dark:bg-neutral-950"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-[14px] bg-gradient-to-b from-white/5 via-amber-200/8 to-yellow-300/5 opacity-0 blur-xl transition-[opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100"
          />
          <svg
            width={56}
            height={56}
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-neutral-400 dark:text-border block drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-[filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:drop-shadow-[0_4px_14px_rgba(250,204,21,0.22)]"
          >
            <rect
              x={0.5}
              y={0.5}
              width={55}
              height={55}
              rx={11.5}
              fill="url(#bmc_tv_body)"
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
            <g filter="url(#bmc_tv_inner)">
              <rect
                x={4}
                y={4}
                width={48}
                height={48}
                rx={8}
                fill="url(#bmc_tv_screen)"
                fillOpacity={0.5}
              />
            </g>
            <defs>
              <filter
                id="bmc_tv_inner"
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
                id="bmc_tv_body"
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
                id="bmc_tv_screen"
                x1={52}
                y1={4}
                x2={4}
                y2={52}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFE9A8" />
                <stop offset={0.569024} stopColor="#2A2A2A" stopOpacity={0.5} />
                <stop offset={1} stopColor="#FDB08C" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </svg>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <span className="relative block h-[47px] w-[47px] translate-x-px scale-[0.8]">
              <span className="pixel-icon--coffee absolute inset-0">
                {cells("base")}
              </span>
              <span className="pixel-icon--coffee absolute inset-0 opacity-60 [mix-blend-mode:plus-lighter]">
                {cells("bloom")}
              </span>
            </span>
          </span>
        </a>
      </div>
      <span className="relative rounded-md bg-gradient-to-b from-white to-neutral-300 px-5 py-1.5 text-xs font-medium tracking-wide text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_-2px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06] ring-inset dark:from-neutral-800/90 dark:to-neutral-950 dark:font-normal dark:tracking-normal dark:text-muted-foreground dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_8px_-2px_rgba(0,0,0,0.5)] dark:ring-white/5">
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
