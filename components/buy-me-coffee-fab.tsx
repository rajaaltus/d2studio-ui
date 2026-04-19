export function BuyMeCoffeeFab() {
  return (
    <a
      href="https://buymeacoffee.com/godwindev"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2"
    >
      <span className="pointer-events-none inline-flex rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-md">
        Buy me a coffee!
      </span>
      <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#ffdd00] shadow-lg shadow-black/20 ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:scale-105">
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
