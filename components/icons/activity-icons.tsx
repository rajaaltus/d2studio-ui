/* Filled activity icons pulled from Iconify (Lets Icons + Phosphor, both MIT)
   and inlined so they render without the runtime plugin. currentColor fill →
   follows the row tint. */
type IconProps = React.SVGProps<SVGSVGElement>;

export function ChatFill(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3a9 9 0 0 0 0 18h4.5c1.398 0 2.097 0 2.648-.228a3 3 0 0 0 1.624-1.624C21 18.597 21 17.898 21 16.5V12a9 9 0 0 0-9-9m-4 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"
      />
    </svg>
  );
}

export function RocketFill(props: IconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M101.85 191.14C97.34 201 82.29 224 40 224a8 8 0 0 1-8-8c0-42.29 23-57.34 32.86-61.85a8 8 0 0 1 6.64 14.56c-6.43 2.93-20.62 12.36-23.12 38.91c26.55-2.5 36-16.69 38.91-23.12a8 8 0 1 1 14.56 6.64m122-144a16 16 0 0 0-15-15c-12.58-.75-44.73.4-71.4 27.07L88 108.7a8 8 0 0 1-11.33-11.31l26.56-26.57a4 4 0 0 0-2.82-6.82H74.35A15.9 15.9 0 0 0 63 68.68L28.7 103a16 16 0 0 0 9.07 27.16l38.47 5.37l44.21 44.21l5.37 38.49a15.94 15.94 0 0 0 10.78 12.92a16.1 16.1 0 0 0 5.1.83a15.9 15.9 0 0 0 11.3-4.68l34.32-34.3a16 16 0 0 0 4.68-11.35v-26.06a4 4 0 0 0-6.83-2.82l-26.57 26.56a8 8 0 0 1-11.71-.42a8.2 8.2 0 0 1 .6-11.1l49.27-49.27c26.69-26.68 27.84-58.83 27.09-71.42Z" />
    </svg>
  );
}

export function EnvelopeFill(props: IconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8M98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z" />
    </svg>
  );
}
