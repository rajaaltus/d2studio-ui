import React from "react";

/**
 * Marketing page template.
 *
 * Layout trick: the gray page background is only ever visible through the
 * 1px grid gaps. Every cell is white, so the gaps read as thin dividers and
 * the rounded corners on the side cells carve out the "notched" seams.
 *
 * Columns: [1fr | auto | 1fr] — the side columns are empty filler (min-w-4)
 * that squeeze the auto-sized center column into the middle at any width.
 * Rows: header / hero / features / auto section / footer. Fixed heights kick
 * in at md; below that rows are auto so content can grow on mobile.
 */
const TemplatesPage = () => {
  return (
    <div className="h-full min-h-screen w-full bg-gray-200 font-sans">
      <div className="grid-rows-auto grid h-full min-h-screen w-full grid-cols-[1fr_auto_1fr] grid-rows-[64px_auto_auto_auto_96px] md:grid-rows-[64px_450px_500px_auto_96px] gap-[1px]">
        {/* Header — 64px nav bar, sticky so it stays put on scroll */}
        <div className=" col-start-1 row-start-1 min-w-4 rounded-br-lg  bg-white"></div>
        <div className="sticky top-0 rounded-b-lg  col-start-2 row-start-1 mx-auto h-16 w-full md:min-w-md  bg-white">
          {/* Nav links scroll horizontally instead of wrapping on narrow screens */}
          <div className="flex h-full w-full items-center gap-4 px-4 text-sm font-light text-gray-600 overflow-x-auto sm:gap-8">
            <span className="w-24 font-semibold shrink-0">D2 Studio</span>
            <span className="shrink-0">Home</span>
            <span className="shrink-0">About</span>
            <span className="shrink-0">Blog</span>
            <span className="shrink-0">Contact</span>
          </div>
        </div>
        <div className="col-start-3 row-start-1 min-w-4 rounded-bl-lg bg-white"></div>

        {/* Hero — headline, subcopy, CTA. Widens to 5xl only on xl */}
        <div className="col-start-1 row-start-2 min-w-4 rounded-r-lg bg-white"></div>
        <div className="col-start-2 row-start-2  w-full xl:w-5xl rounded-lg bg-white">
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-10 md:py-0 text-center">
            <span className="rounded-full border border-gray-400 px-4 py-1 text-xs">
              Billing 2.0 is live
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Integrate <span className="text-orange-600">Billing</span> Once.
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Never touch it Again.
            </h1>
            <p className="text-sm sm:text-md max-w-xl text-center leading-7 font-light text-gray-500">
              Launch usage-based billing, localized pricing, and any other model
              you can imagine. Ship pricing changes in minutes without touching
              your code.
            </p>
            {/* CTA: inset white shadow fakes the top-edge gloss, outer shadow lifts it */}
            <button className="mt-4 border-2 cursor-pointer active:scale-95 duration-200  rounded-2xl bg-gradient-to-b from-yellow-400 to-yellow-500 px-4 py-3 text-black border-popover shadow-[inset_0_1px_8px_1px_rgba(255,255,255,1),0_3px_6px_0_rgba(0,0,0,0.1)] hover:brightness-110">
              Get started - free
            </button>
          </div>
        </div>
        <div className="col-start-3 row-start-2 min-w-4 rounded-l-lg bg-white"></div>

        {/* Features — empty placeholder block, 500px tall from md up */}
        <div className="col-start-1 row-start-3 min-w-4 rounded-r-lg bg-white"></div>
        <div className="col-start-2 row-start-3 w-full md:min-w-md rounded-lg bg-white">
          <div className="h-full w-4xl"></div>
        </div>
        <div className="col-start-3 row-start-3 min-w-4 rounded-l-lg bg-white"></div>

        {/* Auto section — stack of empty content slots; this row sizes to them */}
        <div className="col-start-1 row-start-4 min-w-4 rounded-r-lg bg-white"></div>
        <div className="col-start-2 row-start-4 flex h-full md:min-w-md flex-col overflow-x-hidden rounded-lg bg-white">
          <div className="h-96 w-full"></div>
          <div className="h-96 w-full"></div>
          <div className="h-48 w-full bg-gray-50"></div>
          <div className="h-96 w-full"></div>
        </div>
        <div className="col-start-3 row-start-4 min-w-4 rounded-l-lg bg-white"></div>

        {/* Footer — 96px, corners rounded on top only to close the seam */}
        <div className="col-start-1 row-start-5 min-w-4 rounded-tr-lg bg-white"></div>
        <div className="col-start-2 row-start-5 flex h-full w-full items-center justify-center rounded-t-lg bg-white">
          <div className="text-sm text-gray-500">
            &copy; Copyrights D2 Studio. All Rights Reserverd. 2025
          </div>
        </div>
        <div className="col-start-3 row-start-5 min-w-4 rounded-tl-lg bg-white"></div>
      </div>
    </div>
  );
};

export default TemplatesPage;
