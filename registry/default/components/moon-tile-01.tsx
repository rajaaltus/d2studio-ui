"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

import "./moon-tile-01/moon-tile-01.css";

// A night tile: a crescent moon over a bank of clouds, a sparkle and two stars
// under a blue glow. Dark draws the source icon's own colours; light is a
// daytime palette of the same drawing. Both live in `--mt-*` in the stylesheet.
//
// It plays twice and only once it is on screen, the way the lightning tile
// does. A play is `data-playing` on the root and every animation in the
// stylesheet hangs off it, each ending on its resting frame, so clearing the
// attribute after a play changes nothing and replay restarts them without
// remounting the drawing.
//
// A play opens with the moon rising from behind the clouds, then it holds
// still: it is what the eye reads the rest against, so the clouds drift past it
// in parallax, the sparkle twinkles and the stars blink. Until the first play
// the moon is hidden (`data-waiting`), or a tile scrolled to would show the
// moon up, drop it and raise it again.

/** One lap and how many a play runs. The stylesheet holds the same two numbers
 *  as `--mt-lap` and `--mt-laps`. */
const LAP_MS = 3000;
const LAPS = 2;

/** The tile draws at 83px. */
const TILE = 83;

/** Every drop shadow in the source is the same one, 1 unit up with a 0.9 blur
 *  at 75% black, on its own region: x, y, width, height. */
const LIFTS = {
  sky: [-1.31465, 7.52007, 55.2797, 55.2797],
  moon: [2.59563, 5.2, 21.8633, 32.0778],
  rayLow: [35.6165, 13.4705, 5.34634, 6.49868],
  rayHigh: [35.6165, 8.65996, 5.34634, 6.49868],
  rayRight: [37.4456, 11.6414, 6.49856, 5.34634],
  rayLeft: [32.6352, 11.6414, 6.49844, 5.34634],
  starViolet: [41.0623, 18.617, 5.92849, 5.92935],
  starGold: [-1.96492, 28.136, 5.88186, 5.88247],
  puff: [8.71868, 8.09014, 25.1842, 15.2914],
  bankBack: [15.196, 23.3743, 38.7317, 31.4765],
  bankFront: [-0.68855, 31.7879, 34.8155, 23.7704],
  bankLow: [22.5418, 42.8987, 24.4779, 14.9088],
} as const;

export default function MoonTile01({ className }: { className?: string }) {
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
      className={cn("mt-root flex flex-col items-center gap-4", className)}
    >
      {/* Isolated, so the two plus-lighter glows add onto the drawing under
            them rather than onto whatever page the tile sits on. The viewBox
            is the tile's own edge, so the svg's box is the tile. */}
      <svg
        viewBox="0 0 51.757 51.757"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="relative isolate"
        style={{ width: TILE, height: TILE }}
      >
        <g clipPath={url("tile")}>
          <g clipPath={url("scene")}>
            <g filter={url("sky")}>
              <path
                d="M8.38781 54.758C13.0353 59.2413 19.3576 61.9999 26.3251 61.9999C32.0384 61.9999 37.3176 60.1442 41.5958 57.0048L52.1278 37.5463C52.1521 37.0872 52.165 36.6251 52.165 36.1599C52.165 21.8889 40.5962 10.3201 26.3252 10.3201C12.0542 10.3201 0.485352 21.8889 0.485352 36.1599C0.485352 38.109 0.702617 40.0072 1.11162 41.8329L8.38781 54.758Z"
                fill="var(--mt-sky)"
              />
            </g>

            {/* The moon, lit face then its shaded limb. It is drawn
                    before the clouds, so it rises from behind them. */}
            <g className="mt-moon">
              <g filter={url("moon")}>
                <path
                  d="M11.7527 34.7682C13.6992 34.7682 15.5831 35.3331 17.2008 36.4017L17.2556 36.4379L17.3207 36.4305C18.1065 36.3413 18.8881 36.3547 19.6497 36.4639C20.2791 36.5541 20.8886 36.2003 21.0998 35.6226C21.4983 34.5325 22.0259 33.5141 22.6589 32.5792C17.2734 29.4347 13.6406 23.5973 13.615 16.967C13.6046 14.2681 14.184 11.7057 15.2312 9.4008C15.6243 8.53553 14.6827 7.66995 13.8487 8.12578C8.17027 11.2302 4.33353 17.2815 4.39639 24.2238C4.43447 28.4235 5.91957 32.2979 8.37625 35.3664C9.44054 34.978 10.5806 34.7682 11.7527 34.7682Z"
                  fill="var(--mt-gold)"
                />
              </g>
              <path
                d="M11.0822 29.5584C8.11459 22.3286 9.59526 14.4 14.2328 8.78172C14.47 8.49431 14.788 8.36944 15.0996 8.37345C14.8187 8.03046 14.3168 7.86994 13.8487 8.1257C8.17027 11.2301 4.33353 17.2814 4.39639 24.2237C4.43447 28.4234 5.91957 32.2977 8.37625 35.3663C9.44075 34.9779 10.5807 34.7682 11.7528 34.7682C12.7053 34.7682 13.6426 34.9043 14.5412 35.1677C13.1228 33.5377 11.9436 31.6573 11.0822 29.5584Z"
                fill="var(--mt-gold-shade)"
              />
            </g>

            {/* The sparkle's four rays, scaled together off their own
                    centre. */}
            <g className="mt-sparkle">
              <g filter={url("rayLow")}>
                <path
                  d="M38.2897 19.1691C37.8074 19.1691 37.4165 18.7781 37.4165 18.2959V17.1437C37.4165 16.6615 37.8075 16.2705 38.2897 16.2705C38.7719 16.2705 39.1629 16.6615 39.1629 17.1437V18.2959C39.163 18.7781 38.772 19.1691 38.2897 19.1691Z"
                  fill="var(--mt-gold)"
                />
              </g>
              <g filter={url("rayHigh")}>
                <path
                  d="M38.2897 14.3586C37.8074 14.3586 37.4165 13.9676 37.4165 13.4854V12.3331C37.4165 11.8509 37.8075 11.46 38.2897 11.46C38.7719 11.46 39.1629 11.8509 39.1629 12.3331V13.4854C39.163 13.9676 38.772 14.3586 38.2897 14.3586Z"
                  fill="var(--mt-gold)"
                />
              </g>
              <g filter={url("rayRight")}>
                <path
                  d="M41.271 16.1878H40.1188C39.6366 16.1878 39.2456 15.7968 39.2456 15.3146C39.2456 14.8324 39.6366 14.4414 40.1188 14.4414H41.271C41.7532 14.4414 42.1442 14.8324 42.1442 15.3146C42.1443 15.7968 41.7533 16.1878 41.271 16.1878Z"
                  fill="var(--mt-gold)"
                />
              </g>
              <g filter={url("rayLeft")}>
                <path
                  d="M36.4605 16.1878H35.3084C34.8262 16.1878 34.4352 15.7968 34.4352 15.3146C34.4352 14.8324 34.8262 14.4414 35.3084 14.4414H36.4605C36.9427 14.4414 37.3337 14.8324 37.3337 15.3146C37.3337 15.7968 36.9427 16.1878 36.4605 16.1878Z"
                  fill="var(--mt-gold)"
                />
              </g>
            </g>

            <g className="mt-star mt-star-violet" filter={url("starViolet")}>
              <path
                d="M44.0266 23.7463C43.395 23.7463 42.8623 23.2334 42.8623 22.582C42.8623 21.8362 43.5484 21.2976 44.2535 21.4399C44.8115 21.553 45.1908 22.0411 45.1908 22.582C45.1908 23.227 44.6614 23.7463 44.0266 23.7463Z"
                fill="var(--mt-violet)"
              />
            </g>
            <g className="mt-star mt-star-gold" filter={url("starGold")}>
              <path
                d="M0.975939 33.2185C0.358103 33.2185 -0.164917 32.7175 -0.164917 32.0776C-0.164917 31.3469 0.507024 30.8192 1.19848 30.9584C1.74481 31.0692 2.1169 31.5461 2.1169 32.0776C2.11679 32.7152 1.59346 33.2185 0.975939 33.2185Z"
                fill="var(--mt-gold)"
              />
            </g>

            {/* The small cloud crossing the moon. It floats free in the
                    sky, so it is the one that travels furthest. */}
            <g className="mt-puff">
              <g filter={url("puff")}>
                <path
                  d="M28.8844 15.0321C28.7085 15.0052 28.5603 14.8886 28.4989 14.7215C27.6782 12.4855 25.5302 10.8901 23.0096 10.8901C20.4862 10.8901 18.3377 12.4895 17.5191 14.7293C17.4426 14.9383 17.2262 15.0573 17.0058 15.0257C16.8289 15.0004 16.6481 14.9872 16.4643 14.9872C14.8835 14.9872 13.5293 15.9535 12.9579 17.3273C12.8941 17.4807 12.7596 17.5934 12.5959 17.6212C11.4132 17.8219 10.5133 18.8535 10.5187 20.0946C10.5248 21.4787 11.6858 22.5816 13.0699 22.5816H28.2362C30.3314 22.5816 32.0841 20.914 32.1028 18.8189C32.1198 16.9031 30.7178 15.3125 28.8844 15.0321Z"
                  fill="var(--mt-cloud-2)"
                />
              </g>
              <path
                d="M17.6892 19.8107C17.8404 19.7422 17.9418 19.5989 17.9645 19.4344C18.1674 17.9604 19.2311 16.6811 20.7597 16.2787C20.9375 16.2318 21.1157 16.1986 21.2932 16.1782C21.5143 16.1526 21.6934 15.9825 21.7141 15.7609C21.894 13.8318 23.0304 12.0882 24.7589 11.1574C24.2064 10.9844 23.6192 10.8904 23.0097 10.8904C20.4863 10.8904 18.3378 12.4897 17.5192 14.7295C17.4427 14.9386 17.2263 15.0576 17.0059 15.0259C16.829 15.0006 16.6482 14.9873 16.4644 14.9873C14.8836 14.9873 13.5294 15.9536 12.958 17.3275C12.8942 17.4808 12.7597 17.5936 12.5959 17.6213C11.4132 17.822 10.5133 18.8536 10.5187 20.0947C10.5248 21.4788 11.6858 22.5817 13.0699 22.5817H16.2772C16.0427 21.4318 16.642 20.2853 17.6892 19.8107Z"
                fill="var(--mt-cloud-3)"
              />
            </g>

            {/* The cloud bank, back to front. Each bank's outer edge is the
                    sky's own edge, so each only ever moves outwards from rest:
                    sliding inwards would open a sliver of empty tile behind
                    it. */}
            <g className="mt-bank-back">
              <g filter={url("bankBack")}>
                <path
                  d="M44.9686 54.0507C49.1267 49.7186 51.7896 43.9411 52.1277 37.5465C51.1039 36.9224 49.9506 36.4898 48.7166 36.301C48.2864 36.2352 47.9242 35.95 47.7743 35.5415C45.7676 30.0748 40.5161 26.1743 34.3536 26.1743C28.1845 26.1743 22.9318 30.0845 20.9303 35.5606C20.7434 36.0717 20.214 36.3624 19.6754 36.2852C19.2431 36.2232 18.8011 36.1909 18.3517 36.1909C17.891 36.1909 17.4386 36.2254 16.996 36.2902C18.824 37.4351 20.2768 39.1672 21.0477 41.2762C21.2065 41.711 21.665 41.9775 22.1375 41.9096C22.4363 41.8668 22.7416 41.8451 23.0448 41.8451C25.623 41.8451 27.9291 43.3841 28.9198 45.766C29.0574 46.0965 29.3443 46.3284 29.6872 46.3867C30.7145 46.561 31.5941 47.1014 32.2052 47.8609C33.2287 46.6294 34.7679 45.8737 36.4241 45.8737C38.7134 45.8737 40.7813 47.317 41.5699 49.4653C41.6501 49.6841 41.8457 49.8424 42.0802 49.8782H42.0803C43.7859 50.139 45.0605 51.6388 45.0451 53.3668C45.0429 53.6009 45.0161 53.8295 44.9686 54.0507Z"
                  fill="var(--mt-cloud-3)"
                />
              </g>
              <path
                d="M27.3948 40.1004C27.6721 40.0177 27.881 39.7941 27.9588 39.5154C28.6565 37.0177 30.7948 35.0592 33.5293 34.7246C33.8474 34.6856 34.1629 34.6701 34.4742 34.6766C34.8622 34.6846 35.2116 34.433 35.2994 34.0552C35.9513 31.2536 37.7705 28.8487 40.2755 27.4556C38.4712 26.633 36.4659 26.1743 34.3535 26.1743C28.1844 26.1743 22.9316 30.0845 20.9302 35.5606C20.7433 36.0717 20.2139 36.3624 19.6753 36.2852C19.243 36.2232 18.8009 36.1909 18.3515 36.1909C17.8909 36.1909 17.4385 36.2254 16.9958 36.2902C18.8238 37.4351 20.2767 39.1672 21.0475 41.2762C21.2064 41.711 21.665 41.9775 22.1373 41.9096C22.4361 41.8668 22.7415 41.8451 23.0447 41.8451C23.673 41.8451 24.2849 41.9371 24.8658 42.1099C25.4095 41.1613 26.3029 40.4261 27.3948 40.1004Z"
                fill="var(--mt-cloud-4)"
              />
            </g>
            <g className="mt-bank-front">
              <g filter={url("bankFront")}>
                <path
                  d="M29.7187 46.2003C29.4362 46.1524 29.2042 45.9578 29.0941 45.6933C28.1082 43.3231 25.7718 41.6561 23.0447 41.6561C22.7275 41.6561 22.4157 41.6789 22.1106 41.7226C21.7305 41.7772 21.3569 41.572 21.2251 41.2113C19.8126 37.3471 16.106 34.5879 11.7528 34.5879C7.40414 34.5879 3.69839 37.3402 2.28247 41.1979C2.17668 41.4862 1.92103 41.6874 1.61738 41.7339C1.44631 41.7601 1.27788 41.7941 1.11145 41.8333C2.23511 46.8487 4.81636 51.3129 8.38784 54.7584H24.5253C24.5214 54.7064 24.5168 54.6545 24.5165 54.6016C24.5117 53.4996 25.2955 52.5662 26.3803 52.3822C26.5961 52.3455 26.7762 52.1999 26.8625 51.9928C27.4072 50.6831 28.6753 49.8368 30.093 49.8368C30.2595 49.8368 30.4274 49.8487 30.592 49.8723C30.8881 49.915 31.177 49.7469 31.2772 49.4728C31.5176 48.8154 31.8778 48.2244 32.3269 47.7198C31.682 46.9328 30.7648 46.3778 29.7187 46.2003Z"
                  fill="var(--mt-cloud-1)"
                />
              </g>
              <path
                d="M5.37735 50.0273C5.35003 46.9597 7.59514 44.4126 10.531 43.9635C10.8127 43.9205 11.05 43.7337 11.1483 43.466C12.3308 40.2444 15.2342 37.8544 18.7443 37.4074C16.932 35.6615 14.4682 34.5876 11.7527 34.5876C7.40403 34.5876 3.69828 37.34 2.28236 41.1977C2.17658 41.4859 1.92092 41.6872 1.61728 41.7337C1.44621 41.7598 1.27777 41.7939 1.11145 41.833C1.91681 45.428 3.47131 48.7398 5.60242 51.5961C5.46109 51.0967 5.3822 50.5712 5.37735 50.0273Z"
                fill="var(--mt-cloud-2)"
              />
            </g>
            <g className="mt-bank-low">
              <g filter={url("bankLow")}>
                <path
                  d="M42.1066 49.7053C41.9363 49.6792 41.793 49.5664 41.7337 49.4048C40.9399 47.2419 38.8621 45.6987 36.424 45.6987C33.9832 45.6987 31.9051 47.2457 31.1132 49.4123C31.0393 49.6145 30.8298 49.7295 30.6167 49.6989C30.4456 49.6744 30.2709 49.6616 30.0929 49.6616C28.5639 49.6616 27.2539 50.5963 26.7012 51.9252C26.6395 52.0735 26.5094 52.1825 26.351 52.2094C25.207 52.4036 24.3365 53.4014 24.3418 54.602C24.3477 55.9408 25.4708 57.0076 26.8096 57.0076H41.4795C41.5185 57.0076 41.557 57.0059 41.5957 57.0048C42.8895 56.0553 44.0914 54.9886 45.1861 53.8198C45.2061 53.6719 45.2182 53.5213 45.2196 53.3681C45.236 51.515 43.8799 49.9765 42.1066 49.7053Z"
                  fill="var(--mt-cloud-2)"
                />
              </g>
              <path
                d="M31.8075 54.948C31.9481 54.8702 32.0348 54.7243 32.044 54.5639C32.1263 53.127 33.0537 51.8118 34.4969 51.3065C34.6647 51.2477 34.8339 51.202 35.0035 51.1686C35.2148 51.127 35.3745 50.9492 35.3773 50.7339C35.4036 48.7967 36.431 46.9724 38.1239 45.9598C37.5873 45.7907 37.0164 45.699 36.4239 45.699C33.9831 45.699 31.905 47.246 31.1131 49.4125C31.0392 49.6147 30.8297 49.7298 30.6166 49.6992C30.4455 49.6746 30.2707 49.6619 30.0928 49.6619C28.5638 49.6619 27.2538 50.5965 26.701 51.9254C26.6393 52.0738 26.5093 52.1829 26.3509 52.2097C25.2069 52.4038 24.3364 53.4017 24.3417 54.6022C24.3476 55.941 25.4706 57.0079 26.8095 57.0079H30.5629C30.5819 56.1613 31.048 55.3677 31.8075 54.948Z"
                fill="var(--mt-cloud-3)"
              />
            </g>
          </g>
          <g filter={url("glow")} className="mt-blend">
            <ellipse
              cx={27.8169}
              cy={53.8169}
              rx={21}
              ry={16}
              fill="var(--mt-glow-deep)"
            />
          </g>
          <g filter={url("glow")} className="mt-blend mt-glow">
            <ellipse
              cx={25.8698}
              cy={8.02623}
              rx={20.8698}
              ry={15.0262}
              fill="var(--mt-glow)"
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
          {Object.entries(LIFTS).map(([name, [x, y, width, height]]) => (
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
              <feOffset dy={-1} />
              <feGaussianBlur stdDeviation={0.9} />
              <feComposite in2="hardAlpha" operator="out" result="edge" />
              {/* The source tints the shadow with a colour matrix, whose
                      values CSS cannot reach. A flood can, so the shade
                      follows the theme from `--mt-lift`. */}
              <feFlood className="mt-lift" />
              <feComposite in2="edge" operator="in" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="shadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="shadow" />
            </filter>
          ))}
          {/* Both glows blur by 10, and the region is wide enough for
                  either ellipse plus its blur. */}
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
            id={ref("rim")}
            x1={25.8785}
            y1={0}
            x2={25.8785}
            y2={51.757}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--mt-rim-top)" />
            <stop offset={1} stopColor="var(--mt-rim-bottom)" />
          </linearGradient>
          <clipPath id={ref("tile")}>
            <rect width={51.757} height={51.757} rx={14} />
          </clipPath>
          <clipPath id={ref("scene")}>
            <rect width={54} height={54} transform="translate(-1 8)" />
          </clipPath>
        </defs>
      </svg>
      {/* Nothing to replay when nothing plays, so reduced motion hides it. The
          button is site chrome rather than part of the drawing, so it keeps
          the host's tokens while the tile stays pinned dark. */}
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
          className={presses ? "mt-turn" : undefined}
        />
      </button>
    </div>
  );
}
