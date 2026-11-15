// Coffee TV — the chip framed the way the particle illustrations are: one
// square card in a thick token border, centred in the section it ships as.

import CoffeeCard from "./coffee-tv/coffee-card";
import "./coffee-tv/coffee-tv.css";

export default function CoffeeTv({
  href = "https://buymeacoffee.com/",
  label = "Buy me a coffee",
  className = "",
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <section
      className={`grid min-h-screen w-full place-items-center  ${className}`}
    >
      {/* Square card, sized to the chip rather than to the shelf: the chip is
          the picture and a square much wider than it reads as a mount with a
          hole in it. Capped against viewport height as well, for the same
          reason the particle blocks are: width is also height here, so a card
          sized only by width runs off the bottom on a short or landscape
          screen. */}
      <div className="w-full max-w-[min(200px,60vh)]">
        {/* One thick border rather than a padded box around a bordered inner
            one — same mount look, half the boxes, one radius. Theme tokens, so
            the frame follows the host's palette with no dark: twin.

            No fill of its own: the square is a mount, not a plate, so it lets
            whatever surface it is dropped onto through. A `bg-background` here
            reads as a second, slightly-off panel on any host that is not
            drawing on the page ground — a tray, a card, a section tint — and
            the chip is the only thing in the box that should be a surface. */}
        <div className="bg-transparent border-muted grid aspect-square place-items-center overflow-hidden">
          <CoffeeCard href={href} label={label} />
        </div>
      </div>
    </section>
  );
}
