import MetallicShimmer from "@/registry/default/components/metallic-shimmer";

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-black">
      <MetallicShimmer className="text-xs tracking-[0.2em] uppercase" />
    </main>
  );
}
