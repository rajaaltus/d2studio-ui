import { RevealCard } from "@/components/pixel-reveal";

export default function PixelRevealPreview() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="flex items-center gap-12">
        {/* Half-size (4px) card on the left, 48px gap from the current one */}
        <RevealCard beforeSrc="/23.jpg" afterSrc="/17.jpg" block={4} className="max-w-xs" />
        <RevealCard beforeSrc="/23.jpg" afterSrc="/17.jpg" block={8} />
        {/* Rectangle (16:9) card on the right */}
        <RevealCard beforeSrc="/23.jpg" afterSrc="/17.jpg" block={8} aspect="aspect-video" />
      </div>
    </div>
  );
}
