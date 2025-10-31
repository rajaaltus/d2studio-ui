import React from "react";

const TemplatesPage = () => {
  return (
    <div className="h-full min-h-screen w-full bg-gray-200 font-sans">
      <div className="grid-rows-auto grid h-full min-h-screen w-full grid-cols-[1fr_auto_1fr] grid-rows-[64px_450px_500px_auto_96px] gap-[1px]">
        {/* Header */}
        <div className=" col-start-1 row-start-1 min-w-4 rounded-br-lg  bg-white"></div>
        <div className="sticky top-0 rounded-b-lg  col-start-2 row-start-1 mx-auto h-16 w-full min-w-md  bg-white">
          <div className="flex h-full w-full items-center gap-8 px-4 text-sm font-light text-gray-600">
            <span className="w-24 font-semibold">D2 Studio</span>
            <span>Home</span>
            <span>About</span>
            <span>Blog</span>
            <span>Contact</span>
          </div>
        </div>
        <div className="col-start-3 row-start-1 min-w-4 rounded-bl-lg bg-white"></div>

        {/* hero */}
        <div className="col-start-1 row-start-2 min-w-4 rounded-r-lg bg-white"></div>
        <div className="col-start-2 row-start-2  w-full xl:w-5xl rounded-lg bg-white">
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <span className="rounded-full border border-gray-400 px-4 py-1 text-xs">
              Billing 2.0 is live
            </span>
            <h1 className="text-5xl font-bold tracking-tight">
              Integrate <span className="text-orange-600">Billing</span> Once.
            </h1>
            <h1 className="text-5xl font-bold tracking-tight">
              Never touch it Again.
            </h1>
            <p className="text-md max-w-xl text-center leading-7 font-light text-gray-500">
              Launch usage-based billing, localized pricing, and any other model
              you can imagine. Ship pricing changes in minutes without touching
              your code.
            </p>
            <button className="mt-4 border-2 cursor-pointer active:scale-95 duration-200  rounded-2xl bg-gradient-to-b from-yellow-400 to-yellow-500 px-4 py-3 text-black border-popover shadow-[inset_0_1px_8px_1px_rgba(255,255,255,1),0_3px_6px_0_rgba(0,0,0,0.1)] hover:brightness-110">
              Get started - free
            </button>
          </div>
        </div>
        <div className="col-start-3 row-start-2 min-w-4 rounded-l-lg bg-white"></div>

        {/* Features */}
        <div className="col-start-1 row-start-3 min-w-4 rounded-r-lg bg-white"></div>
        <div className="col-start-2 row-start-3 w-full min-w-md rounded-lg bg-white">
          <div className="h-full w-4xl"></div>
        </div>
        <div className="col-start-3 row-start-3 min-w-4 rounded-l-lg bg-white"></div>

        {/* Auto Section */}
        <div className="col-start-1 row-start-4 min-w-4 rounded-r-lg bg-white"></div>
        <div className="col-start-2 row-start-4 flex h-full min-w-md flex-col overflow-x-hidden rounded-lg bg-white">
          <div className="h-96 w-full"></div>
          <div className="h-96 w-full"></div>
          <div className="h-48 w-full bg-gray-50"></div>
          <div className="h-96 w-full"></div>
        </div>
        <div className="col-start-3 row-start-4 min-w-4 rounded-l-lg bg-white"></div>

        {/* footer */}
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
