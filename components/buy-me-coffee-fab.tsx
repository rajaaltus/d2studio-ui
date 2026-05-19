"use client";

import { usePathname } from "next/navigation";

export function BuyMeCoffeeFab() {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/preview")) return null;

  return (
    <a
      href="https://buymeacoffee.com/godwindev"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      className="group fixed bottom-10 right-5 z-40 hidden items-center gap-3 sm:inline-flex"
    >
      <span className="pointer-events-none relative inline-flex flex-col items-end overflow-hidden rounded-2xl bg-zinc-900 px-3.5 py-2 text-right text-zinc-50 shadow-lg shadow-black/20 ring-1 ring-black/10 opacity-0 translate-x-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 dark:bg-zinc-200 dark:text-zinc-900 dark:ring-white/10 dark:shadow-black/40">
        <span className="relative z-10 text-xs font-semibold leading-tight">Buy me a coffee!</span>
        <span className="relative z-10 text-[10px] font-normal leading-tight opacity-75">
          Your support truly makes a difference.
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full animate-bmc-shimmer bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.3)_50%,transparent_65%)] dark:hidden"
        />
        <span
          aria-hidden="true"
          className="absolute right-[-4px] top-1/2 z-10 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-zinc-900 dark:bg-zinc-200"
        />
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#ffdd00] shadow-lg shadow-black/20 ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:scale-105">
        <img
          src="/registry/assets/bmc.gif"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </span>
    </a>
  );
}
