"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

import "./moon-tile-02/moon-tile-02.css";

// A night window: a round pane of starry sky over dark hills, a pale moon with
// its halo, all set in a tile over a far ridge. Dark draws the source icon's
// own colours; light is a dusk palette of the same drawing. Both live in
// `--mt2-*` in the stylesheet.
//
// It plays the way Moon Tile does: twice, and only once it is on screen. A
// play is `data-playing` on the root and every animation hangs off it, each
// ending on its resting frame, so clearing the attribute after a play changes
// nothing and replay restarts them without remounting the drawing.
//
// A play opens with the moon rising from behind the hills, then it holds still
// while the hills roll like a slow swell against the far ridge, the stars
// twinkle in three sets and the halo and sky glow breathe.
// Until the first play the moon is hidden (`data-waiting`), so a tile scrolled
// to never shows it up, drops it and raises it again.

/** One lap and how many a play runs. The stylesheet holds the same two numbers
 *  as `--mt2-lap` and `--mt2-laps`. */
const LAP_MS = 3000;
const LAPS = 2;

/** The tile draws at 83px. */
const TILE = 83;

/** The stars, dealt into three sets that blink a third of a beat apart. */
const STARS = [
  [
    "M31.636 17.2935L31.8216 17.6794L32.2358 17.7415L31.9356 18.0414L32.0066 18.4656L31.636 18.2654L31.2655 18.4656L31.3365 18.0414L31.0363 17.7415L31.4504 17.6794L31.636 17.2935Z",
    "M25.4358 14.1738L25.5216 14.3523L25.7128 14.3812L25.5743 14.52L25.6074 14.7165L25.4358 14.6233L25.2643 14.7165L25.2973 14.52L25.1581 14.3812L25.35 14.3523L25.4358 14.1738Z",
    "M39.1468 26.3867L39.2325 26.5652L39.4245 26.5941L39.2853 26.7329L39.3183 26.9287L39.1468 26.8362L38.9752 26.9287L39.0082 26.7329L38.869 26.5941L39.061 26.5652L39.1468 26.3867Z",
    "M27.925 16.1062L28.0107 16.2847L28.202 16.3136L28.0635 16.4524L28.0965 16.6482L27.925 16.5557L27.7534 16.6482L27.7864 16.4524L27.6472 16.3136L27.8392 16.2847L27.925 16.1062Z",
    "M31.0018 12.7798L31.1509 13.0912L31.4856 13.1411L31.2437 13.3832L31.3006 13.7257L31.0018 13.5639L30.703 13.7257L30.7599 13.3832L30.5181 13.1411L30.8521 13.0912L31.0018 12.7798Z",
    "M34.8894 16.9265L35.0251 17.2091L35.3289 17.2546L35.1095 17.475L35.1608 17.7858L34.8894 17.6391L34.6173 17.7858L34.6693 17.475L34.45 17.2546L34.7537 17.2091L34.8894 16.9265Z",
    "M12.4414 15.2144L12.5363 15.4131L12.7494 15.4442L12.5954 15.5988L12.6319 15.8163L12.4414 15.7137L12.2508 15.8163L12.2874 15.5988L12.1334 15.4442L12.3465 15.4131L12.4414 15.2144Z",
    "M11.3867 21.9351L11.4816 22.1331L11.6947 22.1649L11.5407 22.3195L11.5765 22.537L11.3867 22.4344L11.1962 22.537L11.2327 22.3195L11.0787 22.1649L11.2918 22.1331L11.3867 21.9351Z",
  ],
  [
    "M37.5282 18.0603L37.6569 18.3284L37.9444 18.371L37.7363 18.5799L37.7855 18.874L37.5282 18.7353L37.2708 18.874L37.3201 18.5799L37.1119 18.371L37.3995 18.3284L37.5282 18.0603Z",
    "M28.178 10.5605L28.2638 10.739L28.4557 10.7679L28.3165 10.9067L28.3496 11.1033L28.178 11.01L28.0064 11.1033L28.0395 10.9067L27.9003 10.7679L28.0922 10.739L28.178 10.5605Z",
    "M30.4983 28.2656L30.5841 28.4441L30.776 28.473L30.6368 28.6118L30.6699 28.8076L30.4983 28.7151L30.3268 28.8076L30.3598 28.6118L30.2206 28.473L30.4125 28.4441L30.4983 28.2656Z",
    "M29.1736 24.614L29.2594 24.7925L29.4506 24.8207L29.3121 24.9602L29.3452 25.156L29.1736 25.0635L29.002 25.156L29.0351 24.9602L28.8959 24.8207L29.0878 24.7925L29.1736 24.614Z",
    "M36.0151 14.325L36.11 14.523L36.3231 14.5548L36.1691 14.7094L36.205 14.9269L36.0151 14.8236L35.8246 14.9269L35.8611 14.7094L35.7072 14.5548L35.9202 14.523L36.0151 14.325Z",
    "M32.6914 21.646L32.7863 21.844L32.9994 21.8758L32.8454 22.0304L32.8819 22.248L32.6914 22.1454L32.5008 22.248L32.5374 22.0304L32.3834 21.8758L32.5965 21.844L32.6914 21.646Z",
    "M10.6133 28.5112L10.7082 28.71L10.9212 28.741L10.7673 28.8957L10.8031 29.1132L10.6133 29.0106L10.4227 29.1132L10.4593 28.8957L10.3053 28.741L10.5183 28.71L10.6133 28.5112Z",
  ],
  [
    "M37.1324 22.2185L37.2182 22.397L37.4101 22.4259L37.2716 22.5647L37.3039 22.7605L37.1324 22.668L36.9608 22.7605L36.9939 22.5647L36.8553 22.4259L37.0466 22.397L37.1324 22.2185Z",
    "M33.8733 11.1387L33.9591 11.3172L34.151 11.3461L34.0118 11.4848L34.0449 11.6814L33.8733 11.5882L33.7018 11.6814L33.7348 11.4848L33.5956 11.3461L33.7875 11.3172L33.8733 11.1387Z",
    "M41.1858 20.3887L41.2716 20.5672L41.4635 20.5961L41.3243 20.7348L41.3574 20.9314L41.1858 20.8382L41.0143 20.9314L41.0473 20.7348L40.9081 20.5961L41.1 20.5672L41.1858 20.3887Z",
    "M35.3295 25.8245L35.4146 26.003L35.6065 26.0311L35.468 26.1706L35.5011 26.3665L35.3295 26.274L35.1579 26.3665L35.1903 26.1706L35.0518 26.0311L35.2437 26.003L35.3295 25.8245Z",
    "M25.4541 21.1865L25.5969 21.4843L25.9161 21.5312L25.6848 21.7625L25.7396 22.0891L25.4541 21.9352L25.1687 22.0891L25.2235 21.7625L24.9922 21.5312L25.3114 21.4843L25.4541 21.1865Z",
    "M15.2539 11.3843L15.3488 11.583L15.5619 11.6141L15.4079 11.7687L15.4444 11.9863L15.2539 11.8836L15.0633 11.9863L15.0999 11.7687L14.9459 11.6141L15.159 11.583L15.2539 11.3843Z",
    "M16.0976 30.3901L16.1926 30.5889L16.4056 30.6199L16.2516 30.7746L16.2882 30.9921L16.0976 30.8895L15.9071 30.9921L15.9437 30.7746L15.7897 30.6199L16.0027 30.5889L16.0976 30.3901Z",
  ],
] as const;

export default function MoonTile02({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  // Counts presses only, so the icon turns for a press and not for the play
  // that starts on its own when the tile scrolls into view.
  const [presses, setPresses] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const done = setTimeout(() => setPlaying(false), LAP_MS * LAPS);
    return () => clearTimeout(done);
  }, [playing]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        setStarted(true);
        setPlaying(true);
      },
      { threshold: 0.2 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  // Ids are per instance: two tiles on one page would otherwise both point at
  // whichever tile's filters and clips happened to be defined first.
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = (name: string) => `${id}-${name}`;
  const url = (name: string) => `url(#${ref(name)})`;

  return (
    <div
      ref={root}
      data-playing={playing || undefined}
      data-waiting={!started || undefined}
      className={cn("mt2-root flex flex-col items-center gap-4", className)}
    >
      {/* Isolated, so the two plus-lighter glows add onto the drawing under
          them rather than onto whatever page the tile sits on. */}
      <svg
        viewBox="0 0 51.757 51.757"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="relative isolate"
        style={{ width: TILE, height: TILE }}
      >
        <g clipPath={url("tile")}>
          <rect width={51.757} height={51.757} rx={14} fill={url("sky")} />
          <path
            className="mt2-ridge"
            d="M65.3586 23.735C60.9065 42.2271 44.172 55.9711 24.2182 55.9711H23.8232C7.1234 55.8166 -7.26602 46.0379 -14.0071 31.9404C-9.28553 28.9121 -2.2536 26.737 4.74858 33.2013C4.74858 33.2013 7.03085 35.914 12.9803 34.27C18.9298 32.6259 24.2182 20.9533 35.9518 26.7074C35.9518 26.7074 41.075 28.0226 45.7023 32.1327C45.7023 32.1327 49.2786 35.6476 53.3573 31.0131C57.0096 26.8718 60.3231 22.8703 65.3586 23.735Z"
            fill="var(--mt2-ridge)"
          />
          {/* The window: one clip for everything in it. The hills are a
              band wider than the pane, so a sway never opens a sliver at the
              rim, and they take their edge from this clip alone. Clipped a
              second time to the pane's own outline, the two anti-aliased
              edges let the pale pane bleed through as a line down the left
              rim at tile size. */}
          <g clipPath={url("pane-shape")}>
            <path
              filter={url("pane")}
              d="M44.0616 26.1411C44.0628 27.5996 43.8961 29.053 43.5652 30.4713C41.671 38.5997 34.5512 44.6411 26.0617 44.6411H25.8936C18.7885 44.5732 12.6664 40.2748 9.79838 34.078C8.65112 31.5985 8.05774 28.8867 8.06166 26.1411C8.06166 15.9242 16.1209 7.64111 26.0617 7.64111C36.0024 7.64111 44.0616 15.9242 44.0616 26.1411Z"
              fill="var(--mt2-pane)"
            />

            {STARS.map((set, i) => (
              <g key={i} className={`mt2-stars mt2-stars-${i + 1}`}>
                {set.map((d) => (
                  <path key={d} d={d} fill="var(--mt2-star)" />
                ))}
              </g>
            ))}

            {/* The moon and its halo, drawn before the hills so it rises
                  from behind them. */}
            <g className="mt2-moon">
              <g className="mt2-halo" filter={url("halo")}>
                <path
                  d="M18.2921 25.2739C20.9133 25.2739 23.0382 23.09 23.0382 20.396C23.0382 17.702 20.9133 15.5181 18.2921 15.5181C15.6709 15.5181 13.546 17.702 13.546 20.396C13.546 23.09 15.6709 25.2739 18.2921 25.2739Z"
                  fill="var(--mt2-halo)"
                />
              </g>
              <g filter={url("disc")}>
                <path
                  d="M18.2921 24.3345C20.4085 24.3345 22.1241 22.5712 22.1241 20.396C22.1241 18.2208 20.4085 16.4575 18.2921 16.4575C16.1757 16.4575 14.4601 18.2208 14.4601 20.396C14.4601 22.5712 16.1757 24.3345 18.2921 24.3345Z"
                  fill="var(--mt2-moon)"
                />
              </g>
            </g>

            <path
              className="mt2-wave"
              d="M4 34.0779H9.79834C11.8072 32.7468 14.799 31.7907 17.7781 34.6322C17.7781 34.6322 18.7491 35.8246 21.2804 35.1019C23.8116 34.3793 26.0616 29.2484 31.0538 31.7777C31.0538 31.7777 33.2335 32.3559 35.2022 34.1625C35.2022 34.1625 36.7238 35.7075 38.4591 33.6704C40.013 31.85 41.4228 30.091 43.5652 30.4712H48V48H4Z"
              fill={url("hills")}
            />
          </g>
          <g filter={url("glow")} className="mt2-blend">
            <ellipse
              cx={27.8169}
              cy={53.8169}
              rx={21}
              ry={16}
              fill="var(--mt2-glow-deep)"
            />
          </g>
          <g filter={url("glow")} className="mt2-blend mt2-glow">
            <ellipse
              cx={25.8698}
              cy={8.02623}
              rx={20.8698}
              ry={15.0262}
              fill="var(--mt2-glow)"
            />
          </g>
        </g>
        <rect
          x={1}
          y={1}
          width={49.757}
          height={49.757}
          rx={13}
          stroke={url("rim")}
          strokeWidth={2}
        />
        <defs>
          {/* The pane's inner shadow: a pale blue edge 4 units down off its
              top rim, as the source draws it. */}
          <filter
            id={ref("pane")}
            x={8.06165}
            y={7.64111}
            width={36}
            height={41}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={4} />
            <feGaussianBlur stdDeviation={2} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.863995 0 0 0 0 0.954665 0 0 0 0 1 0 0 0 0.25 0"
            />
            <feBlend mode="normal" in2="shape" />
          </filter>
          {/* The halo lifts 1 unit, the disc not at all; both blur by 0.9.
              The source tints the shadow with a colour matrix, whose values
              CSS cannot reach. A flood can, so the shade follows the theme
              from `--mt2-lift`. */}
          {(
            [
              ["halo", -1, 11.746, 12.7181, 13.0922, 13.3559],
              ["disc", 0, 12.6601, 14.6575, 11.2641, 11.477],
            ] as const
          ).map(([name, dy, x, y, width, height]) => (
            <filter
              key={name}
              id={ref(name)}
              x={x}
              y={y}
              width={width}
              height={height}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={dy} />
              <feGaussianBlur stdDeviation={0.9} />
              <feComposite in2="hardAlpha" operator="out" result="edge" />
              <feFlood className="mt2-lift" />
              <feComposite in2="edge" operator="in" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="shadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="shadow" />
            </filter>
          ))}
          {/* Both glows blur by 10, and the region is wide enough for either
              ellipse plus its blur. */}
          <filter
            id={ref("glow")}
            x={-20}
            y={-30}
            width={92}
            height={120}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={10} />
          </filter>
          <linearGradient
            id={ref("sky")}
            x1={25.8785}
            y1={0}
            x2={25.8785}
            y2={51.757}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--mt2-sky-top)" />
            <stop offset={1} stopColor="var(--mt2-sky-bottom)" />
          </linearGradient>
          <linearGradient
            id={ref("hills")}
            x1={26.6818}
            y1={30.4189}
            x2={26.6818}
            y2={44.641}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--mt2-hills-top)" />
            <stop offset={1} stopColor="var(--mt2-hills-bottom)" />
          </linearGradient>
          <linearGradient
            id={ref("rim")}
            x1={25.8785}
            y1={0}
            x2={25.8785}
            y2={51.757}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--mt2-rim-top)" />
            <stop offset={1} stopColor="var(--mt2-rim-bottom)" />
          </linearGradient>
          <clipPath id={ref("tile")}>
            <rect width={51.757} height={51.757} rx={14} />
          </clipPath>
          <clipPath id={ref("pane-shape")}>
            <path d="M44.0616 26.1411C44.0628 27.5996 43.8961 29.053 43.5652 30.4713C41.671 38.5997 34.5512 44.6411 26.0617 44.6411H25.8936C18.7885 44.5732 12.6664 40.2748 9.79838 34.078C8.65112 31.5985 8.05774 28.8867 8.06166 26.1411C8.06166 15.9242 16.1209 7.64111 26.0617 7.64111C36.0024 7.64111 44.0616 15.9242 44.0616 26.1411Z" />
          </clipPath>
        </defs>
      </svg>
      {/* Nothing to replay when nothing plays, so reduced motion hides it. */}
      <button
        type="button"
        onClick={() => {
          if (playing) return;
          setPresses((n) => n + 1);
          setPlaying(true);
        }}
        aria-disabled={playing || undefined}
        aria-label="Replay animation"
        className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-[scale,color,opacity] duration-150 ease-out hover:text-foreground active:scale-[0.97] aria-disabled:cursor-default aria-disabled:opacity-50 aria-disabled:hover:text-muted-foreground aria-disabled:active:scale-100 motion-reduce:hidden"
      >
        {/* Keyed on presses, so each press mounts a fresh icon and its turn
            plays from the start; the first render has none to play. */}
        <RotateCcw
          key={presses}
          size={14}
          className={presses ? "mt2-turn" : undefined}
        />
      </button>
    </div>
  );
}
