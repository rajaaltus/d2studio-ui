import { RevealCard } from "@/components/pixel-reveal";

export default function PixelRevealPreview() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <RevealCard beforeSrc="/23.jpg" afterSrc="/17.jpg" block={8} />
        <p className="text-sm text-muted-foreground">Drag the handle to reveal</p>
      </div>
    </div>
  );
}
