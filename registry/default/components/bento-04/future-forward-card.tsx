// Future Forward card.
//
// The three pill rows are marquees: on card hover each row scrolls in one
// direction forever, a pill leaving one edge re-entering the other. Each row
// carries all nine brands (rotated so no two rows line up) and is rendered
// twice — the second copy sits one tile-width away, so translating by exactly
// one tile width loops seamlessly.
//
// Labels live in the DOM, not as outlined glyph paths in the svg. The svg
// scales by a fractional factor (viewBox 337×532 drawn at h-full), so outlined
// text lands on subpixel boundaries and re-rasterises — that read as a shiver
// whenever the hover filter repainted the layer. The svg row moves in user
// units, the DOM label row in % of the card width; same distance either way,
// so they stay locked together at any card size.

"use client"

import { useEffect, useRef } from "react"
import type { CSSProperties, ReactNode } from "react"
import { onCardHover } from "./card-hover"

const PILL_H = 26
const GAP = 31
const ROW_X = 0.5 // first pill's left edge
const LABEL_X = 33.5 // label inset from the pill's left edge
const VB_W = 337
const SPEED = 45 // user units per second, same for every row

// Icons added after the Figma export are authored in a plain 0 0 24 24 box and
// dropped into the pill's 16×16 icon slot by this wrapper, so their paths need
// no absolute-coordinate bookkeeping (origin [0, 0] below).
const box24 = (children: ReactNode) => (
    <g transform="translate(8.5 5) scale(0.666667)">{children}</g>
)

const D2_GLYPH =
    "M9.86 22V7.8H13.52C14.8533 7.8 15.9867 8.07333 16.92 8.62C17.8667 9.16667 18.5933 9.97333 19.1 11.04C19.6067 12.0933 19.86 13.38 19.86 14.9C19.86 16.42 19.6067 17.7067 19.1 18.76C18.5933 19.8133 17.8667 20.62 16.92 21.18C15.9867 21.7267 14.8533 22 13.52 22H9.86ZM12.72 19.44H13.54C14.6467 19.44 15.4867 19.0667 16.06 18.32C16.6467 17.56 16.94 16.42 16.94 14.9C16.94 13.3933 16.6467 12.26 16.06 11.5C15.4867 10.74 14.6467 10.36 13.54 10.36H12.72V19.44ZM20.5722 22C20.5722 20.8533 20.7189 19.8467 21.0122 18.98C21.3189 18.1 21.8455 17.3 22.5922 16.58C23.3522 15.86 24.3855 15.16 25.6922 14.48C26.1855 14.2267 26.5922 13.98 26.9122 13.74C27.2322 13.5 27.4722 13.2333 27.6322 12.94C27.7922 12.6467 27.8722 12.2867 27.8722 11.86C27.8722 11.4733 27.7989 11.1467 27.6522 10.88C27.5055 10.6 27.2922 10.3867 27.0122 10.24C26.7322 10.08 26.3789 10 25.9522 10C25.2322 10 24.6855 10.2067 24.3122 10.62C23.9522 11.02 23.7055 11.6 23.5722 12.36L20.6322 12.18C20.7789 10.7267 21.2989 9.58 22.1922 8.74C23.0989 7.9 24.3655 7.48 25.9922 7.48C27.0589 7.48 27.9455 7.66 28.6522 8.02C29.3722 8.36667 29.9122 8.85333 30.2722 9.48C30.6322 10.1067 30.8122 10.8467 30.8122 11.7C30.8122 12.46 30.6922 13.1133 30.4522 13.66C30.2122 14.2067 29.8189 14.7067 29.2722 15.16C28.7255 15.6133 27.9789 16.1 27.0322 16.62C26.2722 17.0333 25.6589 17.4133 25.1922 17.76C24.7389 18.0933 24.4055 18.4 24.1922 18.68C23.9789 18.9467 23.8589 19.2 23.8322 19.44H30.8122V22H20.5722Z"

// Pill width and the icon's authored origin, per brand. The icons keep their
// original coordinates and are moved by a wrapping translate, so their
// userSpaceOnUse gradients ride along instead of snapping to the viewBox.
const BRANDS: Record<string, { w: number; origin: [number, number]; icon: ReactNode }> = {
    react: {
        w: 80,
        origin: [0.5, 226.5],
        icon: (
            <>
                <path
                    d="M18.3394 239.488C18.3394 238.771 17.7398 238.189 17 238.189C16.2603 238.189 15.6606 238.771 15.6606 239.488C15.6606 240.205 16.2603 240.787 17 240.787C17.7398 240.787 18.3394 240.205 18.3394 239.488Z"
                    fill="#53C1DE"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.3502 237.077C21.6331 235.962 21.9886 233.896 20.7352 233.195C19.4877 232.497 17.8642 233.834 17.007 234.637C16.1522 233.842 14.4832 232.511 13.2308 233.214C11.9838 233.914 12.3683 235.946 12.6575 237.068C11.4942 237.388 9.5 238.078 9.5 239.488C9.5 240.894 11.4921 241.644 12.6485 241.964C12.3583 243.092 11.993 245.095 13.2416 245.794C14.4986 246.497 16.1625 245.197 17.0277 244.386C17.8904 245.193 19.4983 246.501 20.7461 245.801C21.9978 245.098 21.6718 243.059 21.3826 241.931C22.5036 241.61 24.5 240.876 24.5 239.488C24.5 238.092 22.4952 237.396 21.3502 237.077ZM21.2081 241.333C21.0183 240.751 20.762 240.131 20.4485 239.491C20.7477 238.866 20.994 238.254 21.1786 237.675C22.0179 237.911 23.8593 238.451 23.8593 239.488C23.8593 240.535 22.0923 241.079 21.2081 241.333ZM20.425 245.263C19.494 245.785 18.1111 244.535 17.4739 243.94C17.8966 243.492 18.319 242.971 18.7312 242.392C19.4564 242.33 20.1415 242.228 20.7628 242.089C20.9663 242.887 21.3601 244.738 20.425 245.263ZM13.5618 245.256C12.6307 244.735 13.0563 242.947 13.2698 242.117C13.8842 242.248 14.5643 242.343 15.2912 242.4C15.7062 242.967 16.1408 243.487 16.5788 243.943C16.0376 244.45 14.4973 245.779 13.5618 245.256ZM10.1407 239.488C10.1407 238.437 11.971 237.902 12.8295 237.666C13.0173 238.258 13.2635 238.877 13.5606 239.503C13.2596 240.138 13.0099 240.767 12.8204 241.366C12.0018 241.139 10.1407 240.54 10.1407 239.488ZM13.5519 233.752C14.4868 233.227 15.9374 234.505 16.5579 235.08C16.1222 235.534 15.6916 236.05 15.2802 236.613C14.5747 236.677 13.8994 236.778 13.2785 236.915C13.0456 236.01 12.618 234.276 13.5519 233.752ZM19.1896 237.289C19.6683 237.347 20.1268 237.425 20.5574 237.52C20.4281 237.922 20.267 238.342 20.0773 238.773C19.8022 238.267 19.5069 237.771 19.1896 237.289ZM17.0072 235.524C17.3027 235.834 17.5987 236.181 17.8899 236.557C17.2993 236.53 16.7077 236.53 16.117 236.557C16.4084 236.184 16.707 235.838 17.0072 235.524ZM13.9283 238.772C13.7416 238.343 13.582 237.921 13.4516 237.514C13.8796 237.421 14.336 237.345 14.8115 237.287C14.4933 237.769 14.1985 238.264 13.9283 238.772ZM14.8252 241.733C14.3339 241.68 13.8706 241.608 13.4428 241.517C13.5752 241.103 13.7384 240.672 13.929 240.233C14.203 240.747 14.5022 241.247 14.8252 241.733ZM17.0249 243.496C16.7212 243.178 16.4183 242.827 16.1224 242.449C16.7164 242.471 17.3116 242.471 17.9055 242.446C17.6134 242.83 17.3184 243.182 17.0249 243.496ZM20.0834 240.211C20.2838 240.654 20.4529 241.083 20.5871 241.49C20.1521 241.587 19.6826 241.664 19.1878 241.722C19.5075 241.23 19.8074 240.727 20.0834 240.211ZM18.3736 241.797C17.4651 241.86 16.5508 241.859 15.6419 241.802C15.1254 241.071 14.6657 240.301 14.2689 239.503C14.6638 238.706 15.1202 237.938 15.6342 237.208C16.5438 237.141 17.4589 237.141 18.3685 237.208C18.878 237.939 19.3338 238.704 19.7378 239.494C19.3385 240.291 18.8798 241.06 18.3736 241.797ZM20.4152 233.733C21.3503 234.256 20.934 236.114 20.7298 236.921C20.1075 236.782 19.4317 236.678 18.7241 236.614C18.312 236.045 17.8849 235.528 17.4562 235.08C18.0848 234.492 19.489 233.215 20.4152 233.733Z"
                    fill="#53C1DE"
                />
            </>
        ),
    },
    tailwind: {
        w: 129,
        origin: [111.5, 226.5],
        icon: (
            <path
                d="M128 234.7C125.867 234.7 124.533 235.767 124 237.9C124.8 236.833 125.733 236.433 126.8 236.7C127.409 236.852 127.844 237.294 128.325 237.782C129.109 238.578 130.017 239.5 132 239.5C134.133 239.5 135.467 238.433 136 236.3C135.2 237.367 134.267 237.767 133.2 237.5C132.591 237.348 132.156 236.906 131.675 236.418C130.891 235.621 129.983 234.7 128 234.7ZM124 239.5C121.867 239.5 120.533 240.567 120 242.7C120.8 241.633 121.733 241.233 122.8 241.5C123.409 241.652 123.844 242.094 124.325 242.582C125.109 243.378 126.017 244.3 128 244.3C130.133 244.3 131.467 243.233 132 241.1C131.2 242.167 130.267 242.567 129.2 242.3C128.591 242.148 128.156 241.706 127.675 241.218C126.891 240.421 125.983 239.5 124 239.5Z"
                fill="url(#paint3_linear_8189_3102)"
            />
        ),
    },
    vercel: {
        w: 83,
        origin: [271.5, 226.5],
        icon: (
            <path
                d="M287.998 232.574L295.996 246.426H280L287.998 232.574Z"
                fill="url(#paint5_linear_8189_3102)"
            />
        ),
    },
    shift: {
        w: 73,
        origin: [0.5, 271.5],
        icon: (
            <path
                d="M20.0678 289.136C18.4175 290.085 16.1483 290.183 13.8654 289.208C12.0169 288.425 10.4832 287.055 9.5 285.488C9.97194 285.88 10.5225 286.193 11.1124 286.467C13.47 287.568 15.8272 287.492 17.486 286.47C15.1263 284.669 13.1181 282.316 11.6237 280.398C11.309 280.084 11.073 279.693 10.8371 279.34C12.6461 280.985 15.5172 283.06 16.5395 283.648C14.3768 281.377 12.4495 278.557 12.5281 278.636C15.9496 282.082 19.1354 284.04 19.1354 284.04C19.2407 284.099 19.3221 284.148 19.3875 284.192C19.4565 284.017 19.5169 283.836 19.5678 283.648C20.1184 281.651 19.4893 279.38 18.1127 277.5C21.2981 279.419 23.186 283.021 22.3992 286.037C22.3787 286.118 22.3565 286.198 22.3324 286.277C23.9053 288.235 23.5004 290.344 23.3038 289.953C22.4505 288.29 20.8709 288.798 20.0678 289.136Z"
                fill="url(#paint7_linear_8189_3102)"
            />
        ),
    },
    angular: {
        w: 93,
        origin: [104.5, 271.5],
        icon: (
            <>
                <path
                    d="M121 277.5L114.5 280L115.5 288.5L121 291.5L126.5 288.5L127.5 280L121 277.5Z"
                    fill="#DD0031"
                />
                <path d="M121 277.5V291.5L126.5 288.5L127.5 280L121 277.5Z" fill="#C3002F" />
                <path
                    d="M121 279.047L116.937 288.182H118.452L119.269 286.138H122.718L123.534 288.182H125.049L121 279.047ZM122.187 284.878H119.813L121 282.015L122.187 284.878Z"
                    fill="white"
                />
            </>
        ),
    },
    java: {
        w: 73,
        origin: [228.5, 271.5],
        icon: (
            <>
                <path
                    d="M245.025 280.72C248.319 278.163 246.628 276.5 246.628 276.5C246.88 279.144 243.906 279.768 243.109 281.585C242.565 282.824 243.482 283.91 245.024 285.278C244.887 284.975 244.677 284.68 244.464 284.382C243.738 283.366 242.982 282.307 245.025 280.72Z"
                    fill="#E76F00"
                />
                <path
                    d="M245.55 285.839C245.55 285.839 246.542 285.039 245.757 284.15C243.096 281.136 248.666 279.768 248.666 279.768C245.266 281.406 245.773 282.379 246.628 283.56C247.543 284.827 245.55 285.839 245.55 285.839Z"
                    fill="#E76F00"
                />
                <path
                    d="M248.469 288.223C251.521 286.663 250.11 285.164 249.125 285.366C248.883 285.415 248.775 285.458 248.775 285.458C248.775 285.458 248.865 285.32 249.036 285.26C250.985 284.586 252.484 287.247 248.407 288.301C248.407 288.301 248.454 288.26 248.469 288.223Z"
                    fill="#5382A1"
                />
                <path
                    d="M242.117 286.248C240.207 285.998 243.164 285.307 243.164 285.307C243.164 285.307 242.015 285.231 240.603 285.902C238.933 286.697 244.734 287.058 247.737 286.281C248.049 286.072 248.481 285.89 248.481 285.89C248.481 285.89 247.252 286.106 246.028 286.207C244.531 286.331 242.923 286.355 242.117 286.248Z"
                    fill="#5382A1"
                />
                <path
                    d="M242.843 287.738C241.778 287.63 242.475 287.122 242.475 287.122C239.719 288.021 244.009 289.041 247.86 287.934C247.451 287.792 247.19 287.533 247.19 287.533C245.308 287.889 244.22 287.878 242.843 287.738Z"
                    fill="#5382A1"
                />
                <path
                    d="M243.307 289.35C242.243 289.229 242.865 288.874 242.865 288.874C240.363 289.561 244.386 290.981 247.572 289.639C247.05 289.439 246.676 289.209 246.676 289.209C245.256 289.473 244.597 289.494 243.307 289.35Z"
                    fill="#5382A1"
                />
                <path
                    d="M249.969 290.169C249.969 290.169 250.429 290.542 249.463 290.831C247.624 291.378 241.81 291.544 240.195 290.852C239.615 290.604 240.704 290.259 241.046 290.187C241.403 290.111 241.607 290.125 241.607 290.125C240.962 289.678 237.434 291.003 239.816 291.383C246.31 292.419 251.654 290.917 249.969 290.169Z"
                    fill="#5382A1"
                />
                <path
                    d="M251 290.984C250.893 292.347 246.394 292.634 243.464 292.45C241.552 292.329 241.169 292.028 241.163 292.023C242.993 292.32 246.077 292.374 248.578 291.911C250.795 291.501 251 290.984 251 290.984Z"
                    fill="#5382A1"
                />
            </>
        ),
    },
    vscode: {
        w: 95,
        origin: [0.5, 316.5],
        icon: (
            <>
                <path
                    d="M19.5009 323.058C19.5009 322.619 19.0089 322.619 18.7902 322.674C19.0963 322.432 19.4554 322.491 19.5829 322.564L22.5396 324.014C22.8213 324.152 23 324.439 23 324.754V334.292C23 334.611 22.8166 334.901 22.5291 335.037L19.747 336.353C19.5556 336.435 19.1401 336.638 18.7902 336.353C19.2276 336.435 19.4645 336.124 19.5009 335.913V323.058Z"
                    fill="url(#paint11_linear_8189_3102)"
                />
                <path
                    d="M18.8256 322.666C19.0577 322.62 19.5009 322.641 19.5009 323.058V326.341L10.5368 333.123C10.3801 333.241 10.1596 333.222 10.0261 333.077L9.10227 332.077C8.95753 331.921 8.96766 331.676 9.12481 331.532L18.7901 322.674L18.8256 322.666Z"
                    fill="url(#paint12_linear_8189_3102)"
                />
                <path
                    d="M19.5009 332.685L10.5368 325.904C10.3801 325.785 10.1596 325.805 10.0261 325.949L9.10227 326.949C8.95753 327.106 8.96766 327.351 9.12481 327.495L18.7901 336.353V336.353C19.2275 336.435 19.4644 336.124 19.5009 335.913V332.685Z"
                    fill="url(#paint13_linear_8189_3102)"
                />
            </>
        ),
    },
    vue: {
        w: 83,
        origin: [126.5, 316.5],
        icon: (
            <>
                <path d="M136 323.5L143 335.5L150 323.5H147.25L143 330.75L138.75 323.5H136Z" fill="#41B883" />
                <path
                    d="M138.75 323.5L143 330.75L147.25 323.5H144.75L143.033 326.506L141.25 323.5H138.75Z"
                    fill="#35495E"
                />
            </>
        ),
    },
    docker: {
        w: 89,
        origin: [240.5, 316.5],
        icon: (
            <>
                <circle cx={257} cy={329.5} r={8} fill="#1794D4" />
                <path d="M257.455 325.5H256.545V326.409H257.455V325.5Z" fill="white" />
                <path d="M253.818 326.864H254.727V327.773H253.818V326.864Z" fill="white" />
                <path
                    d="M252.001 330.019C252.078 331.338 252.864 333.227 255.636 333.227C258.727 333.227 260.106 330.955 260.409 329.818C260.788 329.818 261.636 329.591 262 328.682C261.773 328.455 260.864 328.455 260.409 328.682C260.409 328.318 260.182 327.545 259.727 327.318C259.424 327.621 258.955 328.409 259.5 329.136C259.273 329.591 258.667 329.591 258.364 329.591H252.429C252.188 329.591 251.987 329.779 252.001 330.019Z"
                    fill="white"
                />
                <path d="M253.364 328.227H252.455V329.136H253.364V328.227Z" fill="white" />
                <path d="M253.818 328.227H254.727V329.136H253.818V328.227Z" fill="white" />
                <path d="M256.091 328.227H255.182V329.136H256.091V328.227Z" fill="white" />
                <path d="M256.545 328.227H257.455V329.136H256.545V328.227Z" fill="white" />
                <path d="M258.818 328.227H257.909V329.136H258.818V328.227Z" fill="white" />
                <path d="M256.091 326.864H255.182V327.773H256.091V326.864Z" fill="white" />
                <path d="M256.545 326.864H257.455V327.773H256.545V326.864Z" fill="white" />
            </>
        ),
    },

    // — added after the export. Figma's mark is exact; the rest are simplified
    //   marks that read at 16px. Paste the official svgs if you want them exact.
    claude: {
        w: 88,
        origin: [0, 0],
        icon: box24(
            <g stroke="#D97757" strokeWidth={2.4} strokeLinecap="round">
                <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36" />
            </g>
        ),
    },
    codex: {
        w: 85,
        origin: [0, 0],
        icon: box24(
            <g stroke="#ECECEC" strokeWidth={1.6} fill="none">
                <ellipse cx={12} cy={12} rx={4.4} ry={9.4} />
                <ellipse cx={12} cy={12} rx={4.4} ry={9.4} transform="rotate(60 12 12)" />
                <ellipse cx={12} cy={12} rx={4.4} ry={9.4} transform="rotate(120 12 12)" />
            </g>
        ),
    },
    figma: {
        w: 82,
        origin: [0, 0],
        icon: box24(
            <>
                <path d="M12 0H8a4 4 0 0 0 0 8h4V0Z" fill="#F24E1E" />
                <path d="M12 0h4a4 4 0 0 1 0 8h-4V0Z" fill="#A259FF" />
                <path d="M12 8H8a4 4 0 0 0 0 8h4V8Z" fill="#FF7262" />
                <circle cx={16} cy={12} r={4} fill="#1ABCFE" />
                <circle cx={8} cy={20} r={4} fill="#0ACF83" />
            </>
        ),
    },
    antigravity: {
        w: 113,
        origin: [0, 0],
        icon: box24(
            <>
                <path d="M12 2.5 20 12h-4.6v9.5H8.6V12H4l8-9.5Z" fill="#4285F4" />
            </>
        ),
    },
    kimi: {
        w: 71,
        origin: [0, 0],
        icon: box24(
            <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                fill="none"
                stroke="#E9E9E9"
                strokeWidth={2}
                strokeLinejoin="round"
            />
        ),
    },
    grok: {
        w: 74,
        origin: [0, 0],
        icon: box24(
            <g fill="#E9E9E9">
                <path d="M6 20 16.5 4H20L9.5 20H6Z" />
                <path d="M13.2 20 20 10.2V20h-6.8Z" />
            </g>
        ),
    },
    // The D2 mark straight out of public/d2-dark.svg — its own glyph coords,
    // scaled to the icon slot and kept centred, holographic overlay included.
    d2: {
        w: 106,
        origin: [0, 0],
        icon: (
            <g transform="translate(8.5 7.33) scale(0.7637) translate(-9.86 -7.48)">
                <path d={D2_GLYPH} fill="url(#b4-d2-base)" />
                <path d={D2_GLYPH} fill="url(#b4-d2-holo)" style={{ mixBlendMode: "overlay" }} />
            </g>
        ),
    },
}

const LABELS: Record<string, string> = {
    react: "React",
    tailwind: "Tailwind CSS",
    vercel: "Vercel",
    shift: "Shift",
    angular: "Angular",
    java: "Java",
    vscode: "Vs code",
    vue: "Vue js",
    docker: "Docker",
    claude: "Claude",
    codex: "Codex",
    figma: "Figma",
    antigravity: "Antigravity",
    kimi: "Kimi",
    grok: "Grok",
    d2: "D2 Studio",
}

// Every row carries every brand, rotated so the rows never line up.
const ORDER = Object.keys(BRANDS)
const rotate = (n: number) => [...ORDER.slice(n), ...ORDER.slice(0, n)]
const STEP = Math.floor(ORDER.length / 3)

const ROWS = [
    { y: 226.5, order: rotate(0), dir: -1 },
    { y: 271.5, order: rotate(STEP), dir: 1 },
    { y: 316.5, order: rotate(STEP * 2), dir: -1 },
]

// One tile = every pill plus its trailing gap. Translating by exactly this
// distance puts the duplicate copy where the original was — a seamless loop.
const TILE = ORDER.reduce((sum, b) => sum + BRANDS[b].w + GAP, 0)
const DURATION = TILE / SPEED // hovered
const SLOW = DURATION * 4 // idle drift
const HOVER_RATE = SLOW / DURATION
const DAMPING = 0.09 // per frame approach to the target rate — the settle

// Running x for each pill in a row.
const layout = (order: string[]) => {
    let x = ROW_X
    return order.map((b) => {
        const at = x
        x += BRANDS[b].w + GAP
        return { b, x: at }
    })
}

function Pill({ b, x, y }: { b: string; x: number; y: number }) {
    const { w, origin, icon } = BRANDS[b]
    return (
        <g>
            <rect x={x} y={y} width={w} height={PILL_H} rx={8.5} fill="var(--b4-surface)" />
            <rect x={x} y={y} width={w} height={PILL_H} rx={8.5} stroke="var(--b4-border)" />
            <g transform={`translate(${x - origin[0]} ${y - origin[1]})`}>{icon}</g>
        </g>
    )
}

// Hover eases every row's playbackRate up to HOVER_RATE and back down to 1.
// Ramping the rate keeps the rows exactly where they are at the moment the
// speed changes (swapping animation-duration would jump them) and gives the
// pick-up and the slow-down their damping.
function useHoverSpeed(root: React.RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        const el = root.current
        if (!el) return

        let rate = 1
        let target = 1
        let raf = 0

        const marquees = () =>
            el
                .getAnimations({ subtree: true })
                .filter((a): a is CSSAnimation => (a as CSSAnimation).animationName === "b4-marquee")

        const tick = () => {
            rate += (target - rate) * DAMPING
            if (Math.abs(target - rate) < 0.005) rate = target
            marquees().forEach((a) => a.updatePlaybackRate(rate))
            raf = rate === target ? 0 : requestAnimationFrame(tick)
        }
        const to = (t: number) => {
            target = t
            if (!raf) raf = requestAnimationFrame(tick)
        }

        const unbind = onCardHover(
            el,
            () => to(HOVER_RATE),
            () => to(1),
        )
        return () => {
            cancelAnimationFrame(raf)
            unbind()
        }
    }, [root])
}

export default function FutureForwardCard() {
    const root = useRef<HTMLDivElement>(null)
    useHoverSpeed(root)

    return (
        // `@container`: the pill labels are DOM text over an svg that scales with
        // the card, so their size is expressed in cqw (below) to stay locked to
        // the pills they sit in at any card width.
        <div ref={root} className="b4-ff @container relative h-full overflow-hidden rounded-2xl">
            {/* Outline lives in the DOM so it tracks the wrapper box exactly. The
                svg fills the width and is cropped at the bottom by the wrapper,
                which would clip an svg-drawn border off two sides. */}
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl border border-[var(--b4-border)]" />
        <svg
    viewBox="0 0 337 532"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="block h-auto w-full"
  >
    <g clipPath="url(#clip0_8189_3102)">
      <rect width={337} height={532} rx={16} fill="var(--b4-surface)" />
      <rect x={20.5} y={20.5} width={55} height={55} rx={27.5} fill="var(--b4-tile)" />
      <rect
        x={20.5}
        y={20.5}
        width={55}
        height={55}
        rx={27.5}
        stroke="var(--b4-border)"
      />
      {/* -10%, scaled about the glyph's own centre (48,48): translate = 48 × 0.1.
          The scale also shrinks the stroke, so 2.22 renders at the same ~2.2 the
          other three cards use. */}
      <g transform="translate(4.8 4.8) scale(0.9)">
      <path
        d="M48 49C48.5523 49 49 48.5523 49 48C49 47.4477 48.5523 47 48 47C47.4477 47 47 47.4477 47 48C47 48.5523 47.4477 49 48 49Z"
        stroke="#41A4D2"
        strokeWidth={2.22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56.2 56.2C58.24 54.17 56.22 48.84 51.7 44.3C47.16 39.78 41.83 37.76 39.8 39.8C37.76 41.83 39.78 47.16 44.3 51.7C48.84 56.22 54.17 58.24 56.2 56.2Z"
        stroke="#41A4D2"
        strokeWidth={2.22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M51.7 51.7C56.22 47.16 58.24 41.83 56.2 39.8C54.17 37.76 48.84 39.78 44.3 44.3C39.78 48.84 37.76 54.17 39.8 56.2C41.83 58.24 47.16 56.22 51.7 51.7Z"
        stroke="#41A4D2"
        strokeWidth={2.22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      </g>
      <mask
        id="mask0_8189_3102"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={-85}
        y={279}
        width={496}
        height={258}
      >
        <rect
          x={410.5}
          y={536.5}
          width={495}
          height={257}
          transform="rotate(-180 410.5 536.5)"
          fill="#D9D9D9"
          stroke="var(--b4-rings)"
        />
      </mask>
      <g mask="url(#mask0_8189_3102)">
        <circle
          cx={169.5}
          cy={523.5}
          r={129}
          transform="rotate(-180 169.5 523.5)"
          stroke="var(--b4-rings)"
        />
        <circle
          cx={169.5}
          cy={523.5}
          r={164}
          transform="rotate(-180 169.5 523.5)"
          stroke="var(--b4-rings)"
        />
        <circle
          cx={169.5}
          cy={523.5}
          r={199}
          transform="rotate(-180 169.5 523.5)"
          stroke="var(--b4-rings)"
        />
        <circle
          cx={169.5}
          cy={523.5}
          r={234}
          transform="rotate(-180 169.5 523.5)"
          stroke="var(--b4-rings)"
        />
        <circle
          cx={169.5}
          cy={523.5}
          r={97}
          transform="rotate(-180 169.5 523.5)"
          stroke="var(--b4-rings)"
        />
        <circle
          cx={169.5}
          cy={523.5}
          r={65}
          transform="rotate(-180 169.5 523.5)"
          stroke="var(--b4-rings)"
        />
      </g>
      <g filter="url(#filter0_f_8189_3102)">
        <path
          d="M317.5 479C317.5 552.73 235.73 616.751 162 616.751C88.27 616.751 14 528.73 14 455C14 381.27 150 310.748 220.5 357C298.5 373.749 317.5 405.27 317.5 479Z"
          fill="var(--b4-glow)"
          fillOpacity={0.36}
        />
      </g>

      {/* Pill rows. `shift` is one tile in the scroll direction; the duplicate
          sits at -shift so it slides into the gap the original leaves behind. */}
      {ROWS.map(({ y, order, dir }) => {
        const shift = dir * TILE
        return (
          <g
            key={y}
            opacity={0.6}
            className="b4-ff-row opacity-60 transition-opacity duration-500 [.b4-card:hover_&]:opacity-90 [.b4-card.b4-on_&]:opacity-90"
            style={
              {
                "--b4-shift": `${shift}px`,
                "--b4-dur-idle": `${SLOW}s`,
              } as CSSProperties
            }
          >
            <g id={`b4-ff-tile-${y}`}>
              {layout(order).map(({ b, x }) => (
                <Pill key={b} b={b} x={x} y={y} />
              ))}
            </g>
            <use href={`#b4-ff-tile-${y}`} x={-shift} />
          </g>
        )
      })}

      <path
        d="M64.2968 384.5H274.297C276.23 384.5 277.797 386.067 277.797 388V400.5H60.7968V388C60.7968 386.127 62.2676 384.598 64.1171 384.505L64.2968 384.5Z"
        fill="#151313"
      />
      <path
        d="M64.2968 384.5H274.297C276.23 384.5 277.797 386.067 277.797 388V400.5H60.7968V388C60.7968 386.127 62.2676 384.598 64.1171 384.505L64.2968 384.5Z"
        stroke="#222222"
      />
      <circle cx={70.7968} cy={392.5} r={3.5} fill="#8B090E" />
      <circle cx={81.7968} cy={392.5} r={3.5} fill="#85878A" />
      <circle cx={92.797} cy={392.5} r={3.5} fill="#0F7A42" />
      <g opacity={0.99}>
        <rect
          x={60.7968}
          y={401.5}
          width={217}
          height={130}
          fill="#161616"
        />
        <rect
          x={60.7968}
          y={401.5}
          width={217}
          height={130}
          fill="url(#paint17_linear_8189_3102)"
          fillOpacity={0.3}
        />
        <rect x={60.7968} y={401.5} width={217} height={130} stroke="#342F2F" />
      </g>
      <rect
        x={141.297}
        y={454}
        width={56}
        height={56}
        rx={28}
        fill="url(#paint18_linear_8189_3102)"
      />
      <path
        d="M164.297 481L166.297 479L164.297 477"
        stroke="#299420"
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M168.297 483H172.297"
        stroke="#299420"
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M176.297 473H162.297C161.192 473 160.297 473.895 160.297 475V489C160.297 490.105 161.192 491 162.297 491H176.297C177.401 491 178.297 490.105 178.297 489V475C178.297 473.895 177.401 473 176.297 473Z"
        stroke="#299420"
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_8189_3102"
        x={-66}
        y={262.219}
        width={463.5}
        height={434.532}
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
          result="effect1_foregroundBlur_8189_3102"
        />
      </filter>
      <linearGradient
        id="paint1_linear_8189_3102"
        x1={168.5}
        y1={115}
        x2={168.5}
        y2={155}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F9FAFB" />
        <stop offset={1} stopColor="#949495" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_8189_3102"
        x1={75.5556}
        y1={541.9}
        x2={1457.42}
        y2={1338.65}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2298BD" />
        <stop offset={1} stopColor="#0ED7B5" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_8189_3102"
        x1={287.998}
        y1={232.574}
        x2={287.998}
        y2={246.426}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F8EEEE" />
        <stop offset={1} stopColor="#CBC9C9" />
      </linearGradient>
      <linearGradient
        id="paint7_linear_8189_3102"
        x1={16.5051}
        y1={277.5}
        x2={16.5051}
        y2={290.001}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F88A36" />
        <stop offset={1} stopColor="#FD2020" />
      </linearGradient>
      <linearGradient
        id="paint11_linear_8189_3102"
        x1={20.8951}
        y1={322.5}
        x2={20.8951}
        y2={336.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#32B5F1" />
        <stop offset={1} stopColor="#2B9FED" />
      </linearGradient>
      <linearGradient
        id="paint12_linear_8189_3102"
        x1={19.5009}
        y1={324.267}
        x2={9.51085}
        y2={332.653}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0F6FB3" />
        <stop offset={0.270551} stopColor="#1279B7" />
        <stop offset={0.421376} stopColor="#1176B5" />
        <stop offset={0.618197} stopColor="#0E69AC" />
        <stop offset={0.855344} stopColor="#0F70AF" />
        <stop offset={1} stopColor="#0F6DAD" />
      </linearGradient>
      <linearGradient
        id="paint13_linear_8189_3102"
        x1={9.57761}
        y1={326.492}
        x2={19.5396}
        y2={334.74}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1791D2" />
        <stop offset={1} stopColor="#1173C5" />
      </linearGradient>
      <linearGradient
        id="paint17_linear_8189_3102"
        x1={278.297}
        y1={466.5}
        x2={60.2968}
        y2={466.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#307BBC" />
        <stop offset={1} stopColor="#7D5608" />
      </linearGradient>
      <linearGradient
        id="paint18_linear_8189_3102"
        x1={169.297}
        y1={454}
        x2={169.297}
        y2={510}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#383737" />
        <stop offset={1} stopColor="#1D1C1C" />
      </linearGradient>
      {/* D2 mark — lifted from public/d2-dark.svg, coords unchanged. */}
      <radialGradient
        id="b4-d2-base"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(16.5 8) rotate(74.0546) scale(14.5602 24.9604)"
      >
        <stop stopColor="white" />
        <stop offset={1} stopColor="#999999" />
      </radialGradient>
      <radialGradient
        id="b4-d2-holo"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-24 14 -8.14149 -9.00653 30 8)"
      >
        <stop stopColor="#12D132" />
        <stop offset={0.270574} stopColor="#785CFF" />
        <stop offset={0.569454} stopColor="#FF683A" />
        <stop offset={0.746911} stopColor="#DC28AF" />
        <stop offset={1} stopColor="#15588B" />
      </radialGradient>
      <clipPath id="clip0_8189_3102">
        <rect width={337} height={532} rx={16} fill="white" />
      </clipPath>
    </defs>
  </svg>

            {/* Title/subtitle live in the DOM, not as outlined glyph paths in the svg
                above. Percentage insets are the viewBox coords the paths used (20.5 / 85). */}
            <div className="absolute left-[6.08%] right-[6.08%] top-[15.98%]">
                <h3 className="bg-gradient-to-b from-[var(--b4-title-from)] to-[var(--b4-title-to)] bg-clip-text text-[18px] font-semibold leading-tight text-transparent">
                    Future Forward
                </h3>
                <p className="mt-2 max-w-[250px] text-[13px] leading-relaxed text-[var(--b4-body)]">
                    Pushing boundaries with emerging technologies
                </p>
            </div>

            {/* Label rows — same tile/duplicate/shift as the svg rows, but measured
                in % of the card width so both halves stay locked while scaling. */}
            {ROWS.map(({ y, order, dir }) => (
                <div
                    key={y}
                    className="b4-ff-row absolute inset-x-0"
                    style={
                        {
                            "--b4-shift": `${((dir * TILE) / VB_W) * 100}%`,
                            "--b4-dur-idle": `${SLOW}s`,
                            top: `${(y / 532) * 100}%`,
                            height: `${(PILL_H / 532) * 100}%`,
                        } as CSSProperties
                    }
                >
                    {[0, -dir * TILE].map((offset) =>
                        layout(order).map(({ b, x }) => (
                            <div
                                key={`${offset}-${b}`}
                                className="absolute inset-y-0 flex items-center whitespace-nowrap bg-gradient-to-b from-[var(--b4-label-from)] to-[var(--b4-label-to)] bg-clip-text text-[4.134cqw] font-medium text-transparent opacity-60 transition-opacity duration-500 [.b4-card:hover_&]:opacity-90 [.b4-card.b4-on_&]:opacity-90"
                                style={{ left: `${((x + offset + LABEL_X) / VB_W) * 100}%` }}
                            >
                                {LABELS[b]}
                            </div>
                        ))
                    )}
                </div>
            ))}
        </div>
    )
}
