// Panel CTA — one inverted card, centred copy, two actions. The plainest of
// the four, and the one that drops into a page without an opinion about it.

export default function Cta04({
  heading = "Ready to build a thriving community?",
  note = "Join hundreds of forward-thinking teams already transforming how they work.",
  action = "Get Started Now",
  href = "#",
  secondaryAction = "Schedule a Demo",
  secondaryHref = "#",
  className = "",
}: {
  heading?: string;
  note?: string;
  action?: string;
  href?: string;
  secondaryAction?: string;
  secondaryHref?: string;
  className?: string;
}) {
  return (
    <section className={`w-full px-4 py-20 ${className}`}>
      {/* Inverted against the page — foreground as the plate — so the panel
          reads as a block of colour in either theme with no dark: twin. */}
      <div
        /* Inverted on purpose: dark ink on the page in light, a light panel in dark. Dark takes neutral-50 rather than --foreground, which is a tinted 0.90 that reads as dull grey; same call as the Card Fan band. */
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-foreground dark:bg-neutral-50 px-6 py-20 text-center text-background md:px-20 md:py-24">
        {/* Two blurred lobes bleeding in from opposite corners. Sized past the
            panel and clipped by it, so what shows is the falloff rather than a
            circle with an edge. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl">{heading}</h2>
          <p className="mb-10 text-lg text-background/70 md:text-xl">{note}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={href}
              className="rounded-full bg-background px-8 py-4 text-base font-medium text-foreground transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.97] motion-reduce:active:scale-100"
            >
              {action}
            </a>
            <a
              href={secondaryHref}
              className="group inline-flex items-center gap-2 px-4 py-4 text-base font-medium underline-offset-4 transition-[text-decoration-color] hover:underline"
            >
              {secondaryAction}
              <span className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
