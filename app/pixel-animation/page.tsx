import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { PixelAnimationPlayground } from "@/components/pixel-animation/playground";
import { PixelTextParticles } from "@/components/pixel-animation/pixel-text-particles";
import { SiteFooter } from "@/components/site-footer";

// Pixel-style display font for the page title only — keeps the rest of the
// page in the regular sans/mono stack and avoids loading another weight
// globally.
const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pixel Animation",
  description:
    "Upload any SVG and turn it into a glowing, animated pixel-grid icon. Tune color, glow, animation style, then copy the HTML/CSS or AI prompt.",
};

export default function PixelAnimationPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />

      <div className="luminous-spinners bg-background">
        <section className="w-full max-w-6xl border-x border-[var(--ls-border)] mx-auto px-4 lg:px-8">
          <header className="py-10 lg:py-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--ls-muted-foreground)]">
              Icon Studio
            </p>
            <PixelTextParticles
              text="Pixel Animation"
              className={`${pixelifySans.className} text-5xl font-bold tracking-tight text-[var(--ls-foreground)] sm:text-6xl`}
            />
            <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--ls-muted-foreground)] sm:text-base">
              Drop in any SVG and we turn it into a glowing, animated pixel-grid
              icon. Pick a color, an animation, and copy the HTML, CSS, or AI
              prompt.
            </p>
          </header>

          <div className="pb-10">
            <PixelAnimationPlayground />
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
