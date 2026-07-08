import { RevealCard } from "@/components/reveal-card";

export default function RevealCardPreview() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <RevealCard beforeSrc="/17.jpg" afterSrc="/17.jpg" grid={160} />
        <p className="text-sm text-muted-foreground">Drag the handle to reveal</p>
      </div>
    </div>
  );
}
