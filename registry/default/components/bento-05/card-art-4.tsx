"use client";

import * as React from "react";
import type { SVGProps } from "react";
import { grainTile } from "./grain";

const CardArt4 = (props: SVGProps<SVGSVGElement>) => {
  // Empty through the server render and the hydration that has to match it,
  // then filled on the pass straight after. The grain is a whisper over the
  // card — it moves the mean luma by about one part in 255 — so arriving a
  // frame late costs nothing, where a mismatched href would cost a hydration
  // error on every load.
  const [grain, setGrain] = React.useState("");
  React.useEffect(() => setGrain(grainTile()), []);

  return (
    <svg
      width={314}
      height={654}
      viewBox="0 0 314 654"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <g clipPath="url(#clip0_1305_19772)">
        <rect
          x={314}
          y={0.0000152588}
          width={672}
          height={313}
          rx={24}
          transform="rotate(90 314 1.52588e-05)"
          fill="#1C1A41"
        />
        <g
          filter="url(#filter0_f_1305_19772)"
          style={{ mixBlendMode: "darken" }}
        >
          <ellipse
            cx={271.647}
            cy={153.69}
            rx={106.428}
            ry={74.6148}
            transform="rotate(138.979 271.647 153.69)"
            fill="#280DD5"
            fillOpacity={0.7}
          />
        </g>
        <g
          filter="url(#filter1_f_1305_19772)"
          style={{ mixBlendMode: "overlay" }}
        >
          <ellipse
            cx={401.074}
            cy={192.13}
            rx={44.389}
            ry={77.0077}
            transform="rotate(-143.236 401.074 192.13)"
            fill="url(#paint0_linear_1305_19772)"
          />
        </g>
        <g
          filter="url(#filter2_f_1305_19772)"
          style={{ mixBlendMode: "overlay" }}
        >
          <ellipse
            cx={391.557}
            cy={450.709}
            rx={66.0959}
            ry={39.0635}
            transform="rotate(-125.724 391.557 450.709)"
            fill="#13BBB3"
          />
        </g>
        <g filter="url(#filter3_f_1305_19772)">
          <path
            d="M76.3254 -32.7355C103.416 -30.8398 151.833 26.7184 128.775 241.786C99.9519 510.62 99.9848 473.272 120.122 544.242C140.259 615.213 103.622 818.761 178.695 774.801"
            stroke="black"
            strokeOpacity={0.9}
            strokeWidth={70}
          />
        </g>
        <g
          filter="url(#filter4_f_1305_19772)"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <path
            d="M5.89231 802.294C-32.0472 817.478 -55.0023 802.294 -62.9728 756.743C-70.9432 711.191 -78.9137 668.56 -86.8842 628.849C-94.8547 589.137 -86.406 555.655 -61.538 528.402C-36.6701 501.149 -9.72985 465.136 19.2828 420.363C48.2953 375.591 79.3803 372.087 112.538 409.852C145.695 447.616 168.969 485.187 182.359 522.562C195.749 559.938 213.603 601.401 235.921 646.952C258.238 692.504 254.572 734.551 224.921 773.094C195.271 811.638 160.839 822.344 121.624 805.214C82.409 788.084 43.8319 787.11 5.89231 802.294Z"
            fill="#168FFF"
          />
        </g>
        <g
          filter="url(#filter5_f_1305_19772)"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <path
            d="M186.434 708.883C151.292 721.312 130.03 708.883 122.648 671.595C115.265 634.307 107.882 599.409 100.5 566.901C93.1169 534.394 100.943 506.985 123.977 484.676C147.011 462.367 171.964 432.887 198.837 396.237C225.71 359.586 254.503 356.718 285.215 387.632C315.927 418.546 337.484 449.3 349.887 479.896C362.29 510.491 378.827 544.433 399.499 581.721C420.17 619.009 416.774 653.429 389.311 684.98C361.847 716.532 329.954 725.296 293.631 711.273C257.308 697.25 221.576 696.453 186.434 708.883Z"
            fill="#831DC7"
            fillOpacity={0.6}
          />
          <path
            d="M186.434 708.883C151.292 721.312 130.03 708.883 122.648 671.595C115.265 634.307 107.882 599.409 100.5 566.901C93.1169 534.394 100.943 506.985 123.977 484.676C147.011 462.367 171.964 432.887 198.837 396.237C225.71 359.586 254.503 356.718 285.215 387.632C315.927 418.546 337.484 449.3 349.887 479.896C362.29 510.491 378.827 544.433 399.499 581.721C420.17 619.009 416.774 653.429 389.311 684.98C361.847 716.532 329.954 725.296 293.631 711.273C257.308 697.25 221.576 696.453 186.434 708.883Z"
            fill="#1D8DB2"
            fillOpacity={0.6}
          />
        </g>
        <mask
          id="mask0_1305_19772"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x={-61}
          y={-29}
          width={432}
          height={729}
        >
          <rect
            x={370.5}
            y={-27.5002}
            width={727}
            height={431}
            rx={24.5}
            transform="rotate(90 370.5 -27.5002)"
            fill="url(#paint1_radial_1305_19772)"
          />
          <rect
            x={370.5}
            y={-27.5002}
            width={727}
            height={431}
            rx={24.5}
            transform="rotate(90 370.5 -27.5002)"
            stroke="white"
          />
        </mask>
        <g mask="url(#mask0_1305_19772)">
          <mask
            id="mask1_1305_19772"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x={-60}
            y={-21}
            width={430}
            height={715}
          >
            <rect
              x={370}
              y={-20.3398}
              width={713.419}
              height={430}
              transform="rotate(90 370 -20.3398)"
              fill="url(#paint2_linear_1305_19772)"
            />
          </mask>
          <g mask="url(#mask1_1305_19772)">
            <mask
              id="mask2_1305_19772"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x={-68}
              y={-43}
              width={458}
              height={759}
            >
              <rect
                x={389.181}
                y={-42.5418}
                width={757.823}
                height={456.763}
                rx={24}
                transform="rotate(90 389.181 -42.5418)"
                fill="#1C1C1C"
              />
            </mask>
            <g mask="url(#mask2_1305_19772)">
              <rect
                width={322}
                height={702}
                transform="translate(1.00006 -15.9998)"
                fill="#14ABE2"
              />
              <rect
                x={1.00006}
                y={-15.9998}
                width={322}
                height={702}
                fill="url(#pattern0_1305_19772)"
              />
            </g>
          </g>
        </g>
        <g
          filter="url(#filter6_f_1305_19772)"
          style={{ mixBlendMode: "soft-light" }}
        >
          <path
            d="M-17.9346 -4.64969C9.90209 -4.75826 66.4584 41.2371 69.9897 226.087C74.4038 457.15 69.7447 425.302 99.1763 484.534C128.608 543.766 116.859 719.658 187.816 677.395"
            stroke="#96500F"
            strokeWidth={300}
          />
        </g>
        <g filter="url(#filter7_f_1305_19772)">
          <ellipse
            cx={273.235}
            cy={698.817}
            rx={306.326}
            ry={170.181}
            transform="rotate(10.006 273.235 698.817)"
            fill="url(#paint3_linear_1305_19772)"
          />
        </g>
        <g
          filter="url(#filter8_f_1305_19772)"
          style={{ mixBlendMode: "overlay" }}
        >
          <ellipse
            cx={254.5}
            cy={279.499}
            rx={118.5}
            ry={58.5}
            transform="rotate(90 254.5 279.499)"
            fill="#9F2426"
          />
        </g>
        <g
          opacity={0.6}
          filter="url(#filter9_f_1305_19772)"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <ellipse
            cx={298.902}
            cy={520.204}
            rx={26.5118}
            ry={166.451}
            transform="rotate(138.979 298.902 520.204)"
            fill="url(#paint4_linear_1305_19772)"
            fillOpacity={0.9}
          />
        </g>
        <g
          opacity={0.6}
          filter="url(#filter10_f_1305_19772)"
          style={{ mixBlendMode: "hard-light" }}
        >
          <ellipse
            cx={272.978}
            cy={279.594}
            rx={26.5118}
            ry={194.711}
            transform="rotate(153.373 272.978 279.594)"
            fill="url(#paint5_linear_1305_19772)"
            fillOpacity={0.9}
          />
        </g>
        <g
          filter="url(#filter11_f_1305_19772)"
          style={{ mixBlendMode: "lighten" }}
        >
          <ellipse
            cx={265.325}
            cy={289.577}
            rx={29.2337}
            ry={145.048}
            transform="rotate(42.5848 265.325 289.577)"
            fill="#659BFF"
            fillOpacity={0.4}
          />
        </g>
        <g
          filter="url(#filter12_f_1305_19772)"
          style={{ mixBlendMode: "screen" }}
        >
          <ellipse
            cx={263.757}
            cy={150.343}
            rx={47.2878}
            ry={95.9865}
            transform="rotate(-120 263.757 150.343)"
            fill="#2C0E45"
          />
        </g>
        <g
          opacity={0.6}
          filter="url(#filter13_f_1305_19772)"
          style={{ mixBlendMode: "overlay" }}
        >
          <ellipse
            cx={294.848}
            cy={406.139}
            rx={26.5118}
            ry={95.4012}
            transform="rotate(138.979 294.848 406.139)"
            fill="url(#paint6_linear_1305_19772)"
            fillOpacity={0.9}
          />
        </g>
        <g
          opacity={0.6}
          filter="url(#filter14_f_1305_19772)"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <ellipse
            cx={218.319}
            cy={61.2185}
            rx={106.005}
            ry={155.929}
            transform="rotate(138.979 218.319 61.2185)"
            fill="url(#paint7_linear_1305_19772)"
            fillOpacity={0.9}
          />
        </g>
        <g
          filter="url(#filter15_f_1305_19772)"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <ellipse
            cx={188}
            cy={326}
            rx={125}
            ry={79}
            transform="rotate(-180 188 326)"
            fill="#158CC8"
          />
        </g>
        <g
          filter="url(#filter16_f_1305_19772)"
          transform="translate(-54.3 -176.9) scale(1.33)"
        >
          <path
            d="M120.448 656.453L169.34 494.106L85.1645 507.174L228.939 276.129L185.055 438.288L269.228 425.22L120.448 656.453Z"
            fill="black"
            fillOpacity={0.7}
          />
        </g>
        <g
          filter="url(#filter17_f_1305_19772)"
          style={{ mixBlendMode: "soft-light" }}
        >
          <ellipse
            cx={292.452}
            cy={325.797}
            rx={64.7325}
            ry={131.396}
            transform="rotate(174.25 292.452 325.797)"
            fill="#FF0672"
            fillOpacity={0.7}
          />
        </g>
        <linearGradient
          id="bolt_fill_1305_19772"
          x1={0}
          y1={0}
          x2={0}
          y2={1.25}
        >
          <stop offset="0%" stopColor="#F7F7F7" />
          <stop offset="50%" stopColor="#DFDFDF" />
          <stop offset="100%" stopColor="#C3C3C3" />
        </linearGradient>
        <linearGradient
          id="bolt_fade_1305_19772"
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0.35}
          x2={0}
          y2={0.95}
        >
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="bolt_mask_1305_19772" maskContentUnits="objectBoundingBox">
          <rect
            x={-0.2}
            y={-0.2}
            width={1.4}
            height={1.4}
            fill="url(#bolt_fade_1305_19772)"
          />
        </mask>
        <path
          d="M105.36 630.058L154.252 467.711L70.0768 480.78L213.851 249.734L169.968 411.894L254.14 398.826L105.36 630.058Z"
          fill="url(#bolt_fill_1305_19772)"
          stroke="#FAFAFA"
          strokeWidth={2}
          opacity={0.7}
          mask="url(#bolt_mask_1305_19772)"
          transform="translate(-44.7 -160.2) scale(1.33)"
        />
      </g>
      <rect
        x={313}
        y={1.00002}
        width={652}
        height={312}
        rx={23}
        transform="rotate(90 313 1.00002)"
        stroke="url(#paint10_linear_1305_19772)"
        strokeWidth={2}
      />
      <defs>
        <filter
          id="filter0_f_1305_19772"
          x={117.582}
          y={3.97401}
          width={308.131}
          height={299.432}
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
          <feGaussianBlur
            stdDeviation={30}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter1_f_1305_19772"
          x={282.857}
          y={64.9435}
          width={236.434}
          height={254.373}
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
          <feGaussianBlur
            stdDeviation={30}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter2_f_1305_19772"
          x={281.604}
          y={332.389}
          width={219.905}
          height={236.641}
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
          <feGaussianBlur
            stdDeviation={30}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter3_f_1305_19772"
          x={10.4513}
          y={-127.65}
          width={245.929}
          height={1003.62}
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
          <feGaussianBlur
            stdDeviation={30}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter4_f_1305_19772"
          x={-239.786}
          y={233.933}
          width={640.083}
          height={729.187}
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
          <feGaussianBlur
            stdDeviation={75}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter5_f_1305_19772"
          x={-52.1882}
          y={216.417}
          width={615.003}
          height={651.328}
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
          <feGaussianBlur
            stdDeviation={75}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        {/* The card's grain, tiled. The export drew its noise at 0.9 user units per
        pixel; keeping that ratio, a 256px tile is 230.4 units, so the tile is
        230.4/322 by 230.4/702 of the bounding box. The scale on the <use> is
        the same px-to-box factor it always was and does not move with the tile
        size — 256 x 0.002795031 is this width, as 1024 x it was the old one. */}
        <pattern
          id="pattern0_1305_19772"
          patternContentUnits="objectBoundingBox"
          width={0.715528}
          height={0.328205}
        >
          <use
            xlinkHref="#image0_1305_19772"
            transform="scale(0.002795031 0.00128205)"
          />
        </pattern>
        <filter
          id="filter6_f_1305_19772"
          x={-158.129}
          y={-214.65}
          width={495.847}
          height={1108.55}
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
          <feGaussianBlur
            stdDeviation={30}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter7_f_1305_19772"
          x={-119.899}
          y={432.929}
          width={786.268}
          height={531.776}
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
          <feGaussianBlur
            stdDeviation={45}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter8_f_1305_19772"
          x={96}
          y={60.9993}
          width={317}
          height={437}
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
          <feGaussianBlur
            stdDeviation={50}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter9_f_1305_19772"
          x={107.819}
          y={313.407}
          width={382.166}
          height={413.594}
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
          <feGaussianBlur
            stdDeviation={40}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter10_f_1305_19772"
          x={-17.473}
          y={-94.8772}
          width={580.901}
          height={748.943}
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
          <feGaussianBlur
            stdDeviation={100}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter11_f_1305_19772"
          x={94.8195}
          y={110.945}
          width={341.01}
          height={357.263}
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
          <feGaussianBlur
            stdDeviation={35}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter12_f_1305_19772"
          x={97.3104}
          y={7.25142}
          width={332.892}
          height={286.184}
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
          <feGaussianBlur
            stdDeviation={40}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter13_f_1305_19772"
          x={129.097}
          y={232.072}
          width={331.501}
          height={348.135}
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
          <feGaussianBlur
            stdDeviation={50}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter14_f_1305_19772"
          x={-61.572}
          y={-225.48}
          width={559.783}
          height={573.397}
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
          <feGaussianBlur
            stdDeviation={75}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter15_f_1305_19772"
          x={-87}
          y={97}
          width={550}
          height={458}
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
          <feGaussianBlur
            stdDeviation={75}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter16_f_1305_19772"
          x={55.1645}
          y={246.129}
          width={244.063}
          height={440.324}
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
          <feGaussianBlur
            stdDeviation={15}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <filter
          id="filter17_f_1305_19772"
          x={76.7003}
          y={44.8977}
          width={431.503}
          height={561.798}
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
          <feGaussianBlur
            stdDeviation={75}
            result="effect1_foregroundBlur_1305_19772"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1305_19772"
          x1={356.685}
          y1={192.13}
          x2={445.463}
          y2={192.13}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#138CBB" />
          <stop offset={1} stopColor="#094055" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_1305_19772"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(13.556 206.971 -349.444 8.02905 719.444 196.029)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0C0C0C" />
          <stop offset={1} stopColor="#D9D9D9" stopOpacity={0} />
        </radialGradient>
        <linearGradient
          id="paint2_linear_1305_19772"
          x1={726.71}
          y1={-20.3398}
          x2={726.71}
          y2={409.66}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0C0C0C" />
          <stop offset={1} stopColor="#D9D9D9" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1305_19772"
          x1={-33.0905}
          y1={698.817}
          x2={579.561}
          y2={698.817}
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset={1} stopColor="#191919" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1305_19772"
          x1={292.352}
          y1={672.594}
          x2={416.396}
          y2={482.818}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7783F3" />
          <stop offset={1} stopColor="#2B96F9" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_1305_19772"
          x1={266.427}
          y1={457.857}
          x2={419.309}
          y2={257.91}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7783F3" />
          <stop offset={1} stopColor="#2B96F9" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_1305_19772"
          x1={288.297}
          y1={493.482}
          x2={339.297}
          y2={357.347}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7783F3" />
          <stop offset={1} stopColor="#2B96F9" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_1305_19772"
          x1={192.128}
          y1={203.976}
          x2={230.094}
          y2={-43.945}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CEE7FF" />
          <stop offset={1} stopColor="#F377E6" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_1305_19772"
          x1={215.859}
          y1={289.516}
          x2={103.328}
          y2={631.495}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.348437} stopColor="#07FFFF" />
          <stop offset={1} stopColor="#0DD5EF" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_1305_19772"
          x1={141.642}
          y1={307.937}
          x2={204.142}
          y2={608.937}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D0E1FF" />
          <stop offset={1} stopColor="#0971C1" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_1305_19772"
          x1={322.272}
          y1={-7.52394}
          x2={974.459}
          y2={249.084}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset={0.52851} stopColor="#414141" />
        </linearGradient>
        <clipPath id="clip0_1305_19772">
          <rect
            x={314}
            y={0.0000152588}
            width={654}
            height={314}
            rx={24}
            transform="rotate(90 314 1.52588e-05)"
            fill="white"
          />
        </clipPath>
        {/* Generated, not shipped — see grain.ts for what the original image turned
        out to be and why it is three lines of arithmetic. */}
        <image
          id="image0_1305_19772"
          width={256}
          height={256}
          preserveAspectRatio="none"
          xlinkHref={grain}
        />
      </defs>
    </svg>
  );
};
export default CardArt4;
