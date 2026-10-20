"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

import "./moon-tile-03/moon-tile-03.css";

// A night card, tipped a few degrees: a crescent moon behind a small cloud, a
// bank of clouds along the bottom, a sparkle and two stars, all over dashed
// layout guides. Dark draws the source icon's own night colours on a dark
// rim; light is a daytime palette of the same drawing on the source's light
// rim. Both live in `--mt3-*` in the stylesheet.
//
// It plays the way Moon Tile does: twice, and only once it is on screen. A
// play is `data-playing` on the root and every animation hangs off it, each
// ending on its resting frame, so clearing the attribute after a play changes
// nothing and replay restarts them without remounting the drawing.
//
// A play opens with the moon rising from behind the clouds, then it holds
// still while the clouds drift past it in parallax, the sparkle twinkles and
// the stars blink. Until the first play the moon is hidden (`data-waiting`).

/** One lap and how many a play runs. The stylesheet holds the same two numbers
 *  as `--mt3-lap` and `--mt3-laps`. */
const LAP_MS = 3000;
const LAPS = 2;

/** The card draws at one and a half times its 87 by 62 viewBox, so it holds
 *  its own beside the square tiles, rounded to whole pixels: a half pixel box
 *  centres on a half pixel and every edge in the drawing smears. */
const WIDTH = 131;
const HEIGHT = 93;

/** Every drop shadow in the source is the same one, 1 unit up with a 0.9 blur,
 *  on its own region: x, y, width, height. */
const LIFTS = {
  sky: [5.24407, 7.01348, 70.0613, 70.0622],
  moon: [11.6359, 2.83037, 26.1391, 40.7084],
  rayLow: [54.6637, 16.0877, 5.97384, 7.32192],
  rayHigh: [55.198, 9.92461, 5.97384, 7.32192],
  rayRight: [57.3384, 13.9476, 7.32211, 5.97378],
  rayLeft: [51.175, 13.4131, 7.32198, 5.97378],
  starViolet: [61.1636, 23.3169, 6.59445, 6.59536],
  starGold: [4.98418, 30.731, 6.53445, 6.5353],
  puff: [19.9977, 7.47344, 31.4275, 19.2064],
  bankBack: [26.5082, 28.2732, 48.4697, 40.5626],
  bankFront: [5.54137, 36.5625, 42.9381, 30.9093],
  bankLow: [33.8747, 53.5594, 30.5168, 18.6869],
} as const;

/** The three glows blur by 10, each on its own region. */
const GLOWS = {
  "glow-deep": [-9.2757, 18.2278, 101.497, 70.0474],
  "glow-violet": [-16.8423, 3.99072, 118.754, 72.6091],
  "glow-plum": [-14.6671, 9.98047, 109.794, 72.4546],
} as const;

export default function MoonTile03({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  // Counts presses only, so the icon turns for a press and not for the play
  // that starts on its own when the card scrolls into view.
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

  // Ids are per instance: two cards on one page would otherwise both point at
  // whichever card's filters and clips happened to be defined first.
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = (name: string) => `${id}-${name}`;
  const url = (name: string) => `url(#${ref(name)})`;

  return (
    <div
      ref={root}
      data-playing={playing || undefined}
      data-waiting={!started || undefined}
      className={cn("mt3-root flex flex-col items-center gap-4", className)}
    >
      {/* Isolated, so the plus-lighter glows add onto the drawing under them
          rather than onto whatever page the card sits on. */}
      <svg
        viewBox="0 0 87 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="relative isolate"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        <g filter={url("card-shadow")}>
          <g clipPath={url("card-clip")}>
            <rect
              x={5.0896}
              width={76}
              height={48}
              rx={14}
              transform="rotate(4.95465 5.0896 0)"
              fill={url("card")}
            />
            {/* The dashed guides: two across, two down, as if the tile were
              laid out on a cutting mat. They stay put. */}
            <path
              d="M78.2039 22.3824L77.1862 22.2942M4.93032 16.0302L5.948 16.1185M75.1508 22.1177L73.1154 21.9413M71.0801 21.7648L69.0447 21.5884M67.0093 21.4119L64.9739 21.2355M62.9386 21.059L60.9032 20.8826M58.8678 20.7061L56.8324 20.5297M54.7971 20.3532L52.7617 20.1768M50.7263 20.0003L48.6909 19.8239M46.6555 19.6474L44.6202 19.471M42.5848 19.2945L40.5494 19.1181M38.514 18.9416L36.4787 18.7652M34.4433 18.5887L32.4079 18.4123M30.3725 18.2358L28.3372 18.0594M26.3018 17.8829L24.2664 17.7065M22.231 17.53L20.1956 17.3536M18.1603 17.1771L16.1249 17.0007M14.0895 16.8243L12.0541 16.6478M10.0188 16.4714L7.98337 16.2949"
              stroke="var(--mt3-line)"
            />
            <path
              d="M76.7329 39.3509L75.7152 39.2627M3.45931 32.9987L4.47699 33.087M73.6798 39.0862L71.6444 38.9098M69.6091 38.7333L67.5737 38.5569M65.5383 38.3804L63.5029 38.204M61.4676 38.0275L59.4322 37.8511M57.3968 37.6746L55.3614 37.4982M53.326 37.3217L51.2907 37.1453M49.2553 36.9688L47.2199 36.7924M45.1845 36.6159L43.1492 36.4395M41.1138 36.263L39.0784 36.0866M37.043 35.9102L35.0077 35.7337M32.9723 35.5573L30.9369 35.3808M28.9015 35.2044L26.8661 35.0279M24.8308 34.8515L22.7954 34.675M20.76 34.4986L18.7246 34.3221M16.6893 34.1457L14.6539 33.9692M12.6185 33.7928L10.5831 33.6163M8.54775 33.4399L6.51237 33.2634"
              stroke="var(--mt3-line-low)"
            />
            <path
              d="M28.7241 2.8259L28.6406 3.79002M24.7122 49.1039L24.7958 48.1398M28.4734 5.71828L28.3062 7.64653M28.1391 9.57478L27.9719 11.503M27.8048 13.4313L27.6376 15.3595M27.4704 17.2878L27.3033 19.216M27.1361 21.1443L26.9689 23.0725M26.8018 25.0008L26.6346 26.929M26.4674 28.8573L26.3003 30.7855M26.1331 32.7138L25.966 34.6421M25.7988 36.5703L25.6316 38.4986M25.4645 40.4268L25.2973 42.3551M25.1301 44.2833L24.963 46.2116"
              stroke="var(--mt3-line)"
            />
            <path
              d="M55.5911 5.15524L55.5076 6.11937M51.5792 51.4333L51.6628 50.4692M55.3404 8.04762L55.1732 9.97587M55.0061 11.9041L54.8389 13.8324M54.6718 15.7606L54.5046 17.6889M54.3374 19.6171L54.1703 21.5454M54.0031 23.4736L53.8359 25.4019M53.6688 27.3301L53.5016 29.2584M53.3345 31.1866L53.1673 33.1149M53.0001 35.0431L52.833 36.9714M52.6658 38.8997L52.4986 40.8279M52.3315 42.7562L52.1643 44.6844M51.9972 46.6127L51.83 48.5409"
              stroke="var(--mt3-line)"
            />
            <g filter={url("glow-deep")} className="mt3-blend">
              <ellipse
                cx={41.4727}
                cy={53.2515}
                rx={30.8364}
                ry={14.8386}
                transform="rotate(4.95465 41.4727 53.2515)"
                fill="var(--mt3-glow-deep)"
              />
            </g>
            <g filter={url("sky")}>
              <path
                d="M15.2282 64.8793C20.6844 71.1394 28.4779 75.3757 37.4043 76.1495C44.724 76.7841 51.6935 74.9931 57.5233 71.4461L73.1775 47.6865C73.2596 47.101 73.3275 46.5105 73.3792 45.9145C74.9642 27.6311 61.4276 11.5247 43.1443 9.93972C24.8609 8.35472 8.75453 21.8913 7.16953 40.1747C6.95306 42.6717 7.02058 45.1278 7.34182 47.5122L15.2282 64.8793Z"
                fill="var(--mt3-sky)"
              />
            </g>

            {/* The moon, lit face then its shaded limb. It is drawn before
              the clouds, so it rises from behind them. */}
            <g className="mt3-moon">
              <g filter={url("moon")}>
                <path
                  d="M21.7593 39.6431C24.253 39.8593 26.604 40.7923 28.5578 42.341L28.6239 42.3934L28.7082 42.3912C29.7248 42.3641 30.7247 42.4681 31.6883 42.6926C32.4846 42.8781 33.3048 42.4925 33.6395 41.7759C34.271 40.4235 35.0602 39.1774 35.975 38.05C29.4245 33.4232 25.4187 25.5411 26.1223 17.0438C26.4087 13.5849 27.4356 10.3665 29.0332 7.52983C29.6329 6.46494 28.5227 5.25142 27.4037 5.74279C19.7839 9.08929 14.1964 16.4159 13.5058 25.317C13.0882 30.7017 14.5605 35.8303 17.3671 40.0344C18.7738 39.6551 20.2576 39.5129 21.7593 39.6431Z"
                  fill="var(--mt3-gold)"
                />
              </g>
              <path
                d="M21.4789 32.8941C18.4799 23.302 21.2575 13.3087 27.8229 6.6258C28.1587 6.28394 28.58 6.15928 28.9787 6.19901C28.657 5.7284 28.0317 5.467 27.4037 5.74268C19.7839 9.08919 14.1964 16.4158 13.5059 25.3169C13.0882 30.7016 14.5606 35.8301 17.3671 40.0343C18.774 39.655 20.2577 39.5128 21.7595 39.643C22.9798 39.7488 24.1655 40.0274 25.2875 40.4646C23.6512 38.2187 22.3494 35.6787 21.4789 32.8941Z"
                fill="var(--mt3-gold-shade)"
              />
            </g>

            {/* The sparkle's four rays, scaled together off their own
              centre. */}
            <g className="mt3-sparkle">
              <g filter={url("rayLow")}>
                <path
                  d="M57.4897 22.6055C56.8718 22.5519 56.4144 22.0076 56.468 21.3898L56.596 19.9136C56.6495 19.2958 57.1938 18.8383 57.8116 18.8919C58.4294 18.9455 58.8869 19.4898 58.8333 20.1076L58.7053 21.5838C58.6519 22.2015 58.1076 22.659 57.4897 22.6055Z"
                  fill="var(--mt3-gold)"
                />
              </g>
              <g filter={url("rayHigh")}>
                <path
                  d="M58.024 16.4424C57.4061 16.3888 56.9487 15.8445 57.0023 15.2267L57.1303 13.7505C57.1838 13.1327 57.7281 12.6753 58.3459 12.7288C58.9637 12.7824 59.4212 13.3267 59.3676 13.9445L59.2396 15.4207C59.1862 16.0385 58.6419 16.4959 58.024 16.4424Z"
                  fill="var(--mt3-gold)"
                />
              </g>
              <g filter={url("rayRight")}>
                <path
                  d="M61.6405 19.1171L60.1643 18.9891C59.5466 18.9356 59.0891 18.3912 59.1426 17.7735C59.1962 17.1557 59.7405 16.6982 60.3583 16.7518L61.8345 16.8797C62.4523 16.9333 62.9098 17.4776 62.8562 18.0954C62.8028 18.7132 62.2585 19.1707 61.6405 19.1171Z"
                  fill="var(--mt3-gold)"
                />
              </g>
              <g filter={url("rayLeft")}>
                <path
                  d="M55.477 18.5827L54.0009 18.4547C53.3832 18.4011 52.9257 17.8568 52.9793 17.239C53.0328 16.6213 53.5771 16.1638 54.1949 16.2173L55.671 16.3453C56.2888 16.3989 56.7462 16.9432 56.6927 17.561C56.6391 18.1787 56.0948 18.6362 55.477 18.5827Z"
                  fill="var(--mt3-gold)"
                />
              </g>
            </g>

            <g className="mt3-star mt3-star-violet" filter={url("starViolet")}>
              <path
                d="M64.3315 29.1066C63.5224 29.0365 62.8969 28.3202 62.9692 27.4857C63.0521 26.5302 63.9909 25.9164 64.8785 26.177C65.5807 26.3839 66.0125 27.0514 65.9525 27.7443C65.8808 28.5707 65.1448 29.1771 64.3315 29.1066Z"
                fill="var(--mt3-violet)"
              />
            </g>
            <g className="mt3-star mt3-star-gold" filter={url("starGold")}>
              <path
                d="M8.12468 36.4608C7.33313 36.3922 6.71871 35.6922 6.78977 34.8725C6.87093 33.9363 7.79041 33.3348 8.6608 33.59C9.34842 33.7927 9.77217 34.4449 9.71313 35.1259C9.64219 35.9427 8.91582 36.5294 8.12468 36.4608Z"
                fill="var(--mt3-gold)"
              />
            </g>

            {/* The cloud across the moon, drawn a quarter larger than the
                source off its own centre. It floats free in the sky, so on a
                play it drifts out past the left edge and the next one drifts
                in from the right to take its place. */}
            <g className="mt3-puff">
              <g transform="translate(35.75 18) scale(1.25) translate(-35.75 -18)">
                <g filter={url("puff")}>
                  <path
                    d="M45.9 16.2608C45.6776 16.2068 45.5007 16.0409 45.4406 15.8201C44.6375 12.8642 42.0627 10.5818 38.8335 10.3019C35.6007 10.0216 32.6705 11.832 31.3729 14.6106C31.2517 14.8699 30.9612 14.9983 30.6823 14.9333C30.4586 14.8812 30.2284 14.8443 29.9929 14.8238C27.9677 14.6483 26.1254 15.7359 25.2407 17.4325C25.142 17.6219 24.9572 17.7514 24.7444 17.7687C23.2068 17.8945 21.9394 19.1162 21.8084 20.7069C21.6625 22.4808 23.0275 24.0227 24.8007 24.1764L44.2311 25.8609C46.9154 26.0936 49.3461 24.1518 49.6027 21.4697C49.8372 19.0172 48.2177 16.8238 45.9 16.2608Z"
                    fill="var(--mt3-puff)"
                  />
                </g>
                <path
                  d="M31.026 21.1395C31.2273 21.0685 31.3731 20.8963 31.4204 20.688C31.8441 18.8221 33.3489 17.3013 35.352 16.9555C35.5851 16.9152 35.817 16.8924 36.0467 16.8859C36.3328 16.8778 36.5812 16.6797 36.6323 16.3981C37.077 13.9466 38.7265 11.839 41.0444 10.8385C40.3558 10.5554 39.6139 10.3698 38.8331 10.3021C35.6003 10.0219 32.6701 11.8322 31.3725 14.6109C31.2513 14.8702 30.9608 14.9986 30.6819 14.9336C30.4581 14.8815 30.228 14.8444 29.9925 14.824C27.9673 14.6484 26.125 15.736 25.2403 17.4326C25.1416 17.622 24.9568 17.7515 24.7438 17.7688C23.2063 17.8946 21.9388 19.1163 21.8079 20.707C21.662 22.4809 23.0269 24.0228 24.8001 24.1765L28.9092 24.5328C28.7365 23.0335 29.6316 21.6313 31.026 21.1395Z"
                  fill="var(--mt3-puff-shade)"
                />
              </g>
            </g>

            {/* The cloud bank, back to front. The back bank sits right and the
              front one left, so each sways outwards from rest and the nearer
              one further. */}
            <g className="mt3-bank-back">
              <g filter={url("bankBack")}>
                <path
                  d="M62.173 68.0358C67.9813 62.9476 72.0345 55.8414 73.1779 47.6865C71.9356 46.7733 70.5061 46.0909 68.9461 45.712C68.4023 45.5799 67.9698 45.1743 67.8232 44.6343C65.8595 37.4077 59.5647 31.8274 51.6696 31.1429C43.766 30.4577 36.6021 34.8839 33.4297 41.6774C33.1335 42.3114 32.4231 42.625 31.7416 42.4663C31.1946 42.3388 30.6319 42.2484 30.0561 42.1984C29.4659 42.1473 28.8825 42.1412 28.3082 42.1752C30.523 43.8449 32.1919 46.2254 32.9453 49.0129C33.1005 49.5877 33.6583 49.98 34.2712 49.9455C34.6587 49.9238 35.0523 49.9299 35.4408 49.9636C38.7439 50.2499 41.5274 52.4777 42.5321 55.6394C42.6716 56.0781 43.0134 56.4071 43.4464 56.5198C44.7431 56.8572 45.81 57.6473 46.5085 58.6882C47.9565 57.224 50.0124 56.4268 52.1342 56.6108C55.0672 56.865 57.5562 58.9439 58.3279 61.7837C58.4065 62.073 58.6394 62.2974 58.9359 62.3694L58.9361 62.3694C61.0921 62.893 62.5585 64.956 62.3469 67.1681C62.318 67.4679 62.2583 67.7577 62.173 68.0358Z"
                  fill="var(--mt3-cloud-3)"
                />
              </g>
              <path
                d="M41.2066 48.2115C41.5712 48.1364 41.8636 47.8731 41.9942 47.5247C43.1655 44.4022 46.1225 42.1306 49.6631 42.0056C50.0749 41.991 50.4808 42.0062 50.8789 42.049C51.375 42.1024 51.8506 41.8189 52.0052 41.3445C53.1515 37.8277 55.7492 34.9487 59.1133 33.4421C56.893 32.1879 54.3749 31.3775 51.6685 31.1429C43.765 30.4577 36.6011 34.8839 33.4287 41.6774C33.1325 42.3114 32.422 42.625 31.7405 42.4663C31.1936 42.3388 30.6308 42.2484 30.0551 42.1984C29.4649 42.1473 28.8815 42.1412 28.3072 42.1752C30.522 43.8449 32.1909 46.2254 32.9443 49.0129C33.0995 49.5877 33.6574 49.98 34.2701 49.9455C34.6577 49.9238 35.0513 49.9299 35.4398 49.9636C36.2447 50.0334 37.0184 50.2193 37.7435 50.5051C38.5454 49.3502 39.7717 48.5075 41.2066 48.2115Z"
                fill="var(--mt3-cloud-4)"
              />
            </g>
            <g className="mt3-bank-front">
              <g filter={url("bankFront")}>
                <path
                  d="M43.5066 56.2846C43.1501 56.1918 42.8744 55.9168 42.7627 55.5657C41.7629 52.4196 38.9548 50.0243 35.461 49.7215C35.0545 49.6862 34.6526 49.6808 34.2568 49.703C33.7638 49.7306 33.3079 49.4263 33.1791 48.9495C31.7987 43.8419 27.3565 39.8954 21.7793 39.4119C16.208 38.9289 11.1546 42.0434 8.91217 46.8285C8.74463 47.1861 8.39474 47.4155 8.00056 47.4413C7.77849 47.4559 7.55892 47.4808 7.34135 47.5124C8.2239 54.0628 11.0351 60.0688 15.228 64.8796L35.9026 66.6719C35.9034 66.6049 35.9032 66.5379 35.9088 66.4702C36.025 65.0578 37.1329 63.949 38.543 63.8337C38.8236 63.8106 39.0705 63.6442 39.2041 63.3884C40.0474 61.7709 41.766 60.8275 43.5823 60.985C43.7957 61.0035 44.0094 61.0374 44.2176 61.0859C44.5923 61.1736 44.9811 60.9903 45.1399 60.6502C45.5208 59.8347 46.048 59.1175 46.6794 58.5209C45.9406 57.441 44.8272 56.6282 43.5066 56.2846Z"
                  fill="var(--mt3-cloud-1)"
                />
              </g>
              <path
                d="M11.8965 58.4841C12.2022 54.551 15.3615 51.5371 19.1726 51.2878C19.5383 51.264 19.8631 51.0511 20.0187 50.719C21.8915 46.7229 25.8767 43.9835 30.4234 43.8006C28.2953 41.3627 25.2582 39.7132 21.7792 39.4116C16.2078 38.9286 11.1545 42.0432 8.91204 46.8283C8.74449 47.1858 8.39461 47.4152 8.00043 47.4411C7.77835 47.4556 7.55878 47.4805 7.34135 47.5122C7.97386 52.2074 9.59761 56.6229 12.0106 60.5189C11.885 59.8634 11.8423 59.1815 11.8965 58.4841Z"
                fill="var(--mt3-cloud-2)"
              />
            </g>
            <g className="mt3-bank-low" filter={url("bankLow")}>
              <path
                d="M58.9883 62.1512C58.7731 62.0989 58.602 61.9384 58.544 61.7248C57.7671 58.8657 55.2766 56.6579 52.153 56.3871C49.026 56.116 46.1918 57.8671 44.9366 60.5549C44.8195 60.8057 44.5383 60.9298 44.2686 60.867C44.0522 60.8165 43.8297 60.7807 43.6018 60.761C41.6429 60.5912 39.8608 61.6431 39.005 63.2843C38.9095 63.4674 38.7308 63.5927 38.5248 63.6095C37.0376 63.7312 35.8116 64.9129 35.685 66.4516C35.5439 68.1675 36.8642 69.659 38.5794 69.8077L57.3739 71.437C57.4238 71.4413 57.4733 71.4434 57.523 71.4463C59.286 70.3736 60.9443 69.1405 62.4767 67.7646C62.5187 67.5773 62.5509 67.3858 62.5697 67.1896C62.7966 64.8173 61.2301 62.6957 58.9883 62.1512Z"
                fill="var(--mt3-cloud-2)"
              />
            </g>

            <g filter={url("glow-violet")} className="mt3-blend mt3-glow">
              <ellipse
                cx={42.5348}
                cy={40.2953}
                rx={39.5}
                ry={16}
                transform="rotate(4.95465 42.5348 40.2953)"
                fill="var(--mt3-glow)"
              />
            </g>
            <g filter={url("glow-plum")} className="mt3-blend">
              <ellipse
                cx={40.2301}
                cy={46.2077}
                rx={35}
                ry={16}
                transform="rotate(4.95465 40.2301 46.2077)"
                fill="var(--mt3-glow-plum)"
                fillOpacity={0.6}
              />
            </g>
          </g>
          <rect
            x={5.9995}
            y={1.08263}
            width={74}
            height={46}
            rx={13}
            transform="rotate(4.95465 5.9995 1.08263)"
            stroke={url("rim")}
            strokeWidth={2}
          />
        </g>
        <defs>
          {/* The card's own shadow, 2 across and 3 down. */}
          <filter
            id={ref("card-shadow")}
            x={-1.15603}
            y={-1.1}
            width={88.0616}
            height={62.5845}
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
            <feOffset dx={2} dy={3} />
            <feGaussianBlur stdDeviation={2.05} />
            <feComposite in2="hardAlpha" operator="out" result="edge" />
            <feFlood className="mt3-drop" />
            <feComposite in2="edge" operator="in" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="shadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="shadow" />
          </filter>
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
                  values CSS cannot reach. A flood can, so the shade follows
                  the theme from `--mt3-lift`. */}
              <feFlood className="mt3-lift" />
              <feComposite in2="edge" operator="in" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="shadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="shadow" />
            </filter>
          ))}
          {Object.entries(GLOWS).map(([name, [x, y, width, height]]) => (
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
              <feGaussianBlur stdDeviation={10} />
            </filter>
          ))}
          <linearGradient
            id={ref("card")}
            x1={43.0896}
            y1={0}
            x2={43.0896}
            y2={48}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--mt3-card-top)" />
            <stop offset={1} stopColor="var(--mt3-card-bottom)" />
          </linearGradient>
          <linearGradient
            id={ref("rim")}
            x1={43.0896}
            y1={0}
            x2={43.0896}
            y2={48}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--mt3-rim-top)" />
            <stop offset={1} stopColor="var(--mt3-rim-bottom)" />
          </linearGradient>
          <clipPath id={ref("card-clip")}>
            <rect
              x={5.0896}
              width={76}
              height={48}
              rx={14}
              transform="rotate(4.95465 5.0896 0)"
            />
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
          className={presses ? "mt3-turn" : undefined}
        />
      </button>
    </div>
  );
}
