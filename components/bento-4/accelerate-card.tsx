// Accelerate your project — converted from the Figma SVG export. Text is now
// real HTML (card4 type style); the green lightning bolt on the right is kept
// as a faithful inline SVG (exact paths, gradients and blur from the export).

export default function AccelerateCard() {
    return (
        <div className="relative flex h-full min-h-[236px] w-full flex-col overflow-hidden rounded-2xl border border-[var(--b4-border)] bg-[var(--b4-surface)] p-5">
            {/* Lightning bolt decoration (right) */}
            <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 337 236"
                fill="none"
                preserveAspectRatio="xMaxYMid slice"
            >
                <g filter="url(#c5blur0)">
                    <path
                        d="M286.699 -48L114.69 244.224L139.451 261.535L323.198 -22.4823L286.699 -48Z"
                        fill="url(#c5p1)"
                        fillOpacity={0.06}
                    />
                </g>
                <path
                    d="M201.643 242.703L233.488 136.478L178.575 145.043L272.301 -6.14495L243.723 99.9564L298.634 91.3913L201.643 242.703Z"
                    fill="url(#c5p2)"
                    fillOpacity={0.15}
                />
                <path
                    d="M243.482 99.8909L243.382 100.262L243.761 100.204L298.123 91.7236L202.393 241.069L233.727 136.549L233.841 136.17L233.449 136.231L179.074 144.712L271.618 -4.57016L243.482 99.8909Z"
                    stroke="#A9A9A9"
                    strokeOpacity={0.15}
                    strokeWidth={0.5}
                />
                <g filter="url(#c5blur1)">
                    <ellipse cx={112} cy={280.5} rx={101} ry={68.5} fill="url(#c5p3)" fillOpacity={0.12} />
                </g>
                <defs>
                    <filter id="c5blur0" x={34.69} y={-128} width={368.5} height={469.5} filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation={40} />
                    </filter>
                    <filter id="c5blur1" x={-69} y={132} width={362} height={297} filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation={40} />
                    </filter>
                    <linearGradient id="c5p1" x1={305.03} y1={-35.18} x2={404.1} y2={84.69} gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4CD241" />
                        <stop offset={1} stopColor="#373539" />
                    </linearGradient>
                    <linearGradient id="c5p2" x1={203} y1={58} x2={296} y2={204} gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4CD241" />
                        <stop offset={0.654} stopColor="#212121" />
                    </linearGradient>
                    <linearGradient id="c5p3" x1={112} y1={212} x2={112} y2={349} gradientUnits="userSpaceOnUse">
                        <stop stopColor="#595757" />
                        <stop offset={0.825} stopColor="#0C043B" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Lightning icon tile */}
            <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--b4-border)] bg-[var(--b4-tile)]">
                <svg width="24" height="24" viewBox="37 37 22 22" fill="none" aria-hidden>
                    <path
                        d="M40 50C39.8108 50.0007 39.6252 49.9476 39.4649 49.847C39.3047 49.7464 39.1762 49.6024 39.0945 49.4317C39.0129 49.261 38.9813 49.0706 39.0035 48.8827C39.0257 48.6948 39.1008 48.517 39.22 48.37L49.12 38.17C49.1943 38.0843 49.2955 38.0264 49.407 38.0058C49.5185 37.9852 49.6337 38.0031 49.7337 38.0565C49.8337 38.11 49.9126 38.1959 49.9573 38.3001C50.0021 38.4044 50.0101 38.5207 49.98 38.63L48.06 44.65C48.0034 44.8016 47.9844 44.9646 48.0046 45.125C48.0248 45.2855 48.0837 45.4387 48.1761 45.5715C48.2685 45.7042 48.3918 45.8126 48.5353 45.8872C48.6788 45.9618 48.8382 46.0006 49 46H56C56.1892 45.9994 56.3748 46.0525 56.535 46.1531C56.6953 46.2537 56.8238 46.3977 56.9054 46.5684C56.9871 46.7391 57.0187 46.9295 56.9965 47.1174C56.9743 47.3053 56.8992 47.4831 56.78 47.63L46.88 57.83C46.8057 57.9158 46.7045 57.9737 46.593 57.9943C46.4815 58.0149 46.3663 57.997 46.2663 57.9435C46.1663 57.89 46.0874 57.8041 46.0427 57.6999C45.9979 57.5957 45.9899 57.4794 46.02 57.37L47.94 51.35C47.9966 51.1985 48.0156 51.0355 47.9954 50.875C47.9752 50.7145 47.9163 50.5614 47.8239 50.4286C47.7315 50.2959 47.6082 50.1875 47.4647 50.1129C47.3212 50.0382 47.1617 49.9995 47 50H40Z"
                        stroke="#41A4D2"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <h3 className="relative mt-[17px] max-w-[190px] bg-gradient-to-b from-[var(--b4-title-from)] to-[var(--b4-title-to)] bg-clip-text text-[18px] font-semibold leading-tight text-transparent">
                Accelerate your project
            </h3>
            <p className="relative mt-2 max-w-[230px] text-[13px] leading-relaxed text-[var(--b4-body)]">
                Bring your ideas to life faster with our rapid development services.
            </p>
        </div>
    )
}
