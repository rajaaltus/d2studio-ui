"use client";

// The card art, below lg, as a bitmap instead of a live filter graph.
//
// Each export is eighteen gaussian blurs and as many blend groups, and those are
// not paid once: a browser re-runs the whole graph every time it re-rasters the
// tile the card sits on, which on a phone is every time the section is scrolled
// away from and back. Measured on the 390px layout, with the grid on screen and
// a re-raster forced each frame: 63ms median and 111ms at the worst live, 13ms
// once it is a bitmap. The draw costs ~20ms, once, and it is the only frame that
// pays it.
//
// Nothing is lost by freezing it. Below lg the artwork never moves — no
// entrance, no ambilight, no ripple — and it is the same dark art in both
// themes, so a still picture of it is the picture. Above lg this is a
// passthrough: the desktop keeps the live SVG, which is what its ambilight
// samples and what its entrance animates.
//
// A canvas rather than an <img> of the same SVG. That was the lazier version and
// it was tried: an SVG image re-runs its filters on every raster too, so it
// measured no better than the inline SVG it replaced. The bitmap is the point.

import { useEffect, useRef, useState, type ReactNode } from "react";

import { useStill } from "./load-in";

// One card rasterises at a time, page-wide. The four hosts observe in the same
// frame, so left alone all four decodes are in flight together and the peak is
// four filter graphs' worth of surfaces rather than one. Sequential costs a few
// frames on a page that is already a still picture, and takes the peak to a
// quarter — which on iOS is the difference between a load and a tab kill.
let queue = Promise.resolve();

// A per-card grade, baked into the bitmap rather than hung off it as a CSS
// filter: the draw happens once, so the card carries a graded picture and the
// compositor never sees a filter at all.
//
// It is a phone-only correction and it is per card because the exports do not
// sit at the same place. Measured off the rasters (mean luma / mean saturation
// over the cell): 16+ 66/0.61, globe 63/0.77, bolt 108/0.42, AI 88/0.59. The
// bolt is the one that reads dullest and it is not dark — it is the brightest of
// the four and the least saturated, so it wants colour, not light. The globe
// wants the opposite. 16+ is the one the eye is happy with, so it is the
// reference and takes nothing.
export default function Flat({
  boost,
  children,
}: {
  boost?: string;
  children: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(false);
  const still = useStill();

  useEffect(() => {
    const box = host.current;
    const svg = box?.querySelector<SVGSVGElement>(":scope > svg");
    if (!still || !box || !svg) return;

    let live = true;
    let frame = 0;
    let dirty = true;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 h-full w-full";
    const img = new Image();

    const draw = async () => {
      const { width, height } = box.getBoundingClientRect();
      if (!width || !height) return;
      // 2 is the ceiling on purpose. The art is blurred gradient nearly
      // everywhere and blur has no detail to lose; the one crisp thing in it is
      // the 1px border, which is all a third device pixel would buy. Four
      // canvases at 3x is memory a phone has better uses for.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const [w, h] = [Math.round(width * dpr), Math.round(height * dpr)];
      if (!dirty && canvas.width === w && canvas.height === h) return;
      dirty = false;

      // xMidYMid slice, by hand: the smallest box of the artwork's own aspect
      // that covers the cell, centred — the framing the SVG already does, so the
      // crop is the crop it already had.
      const art = svg.viewBox.baseVal;
      const s = Math.max(w / art.width, h / art.height);
      const [dw, dh] = [Math.round(art.width * s), Math.round(art.height * s)];

      // Serialised at the size it will be drawn at, not at its natural 672x313.
      // An SVG image rasterises at its own width/height and drawImage then
      // resamples, which is bilinear mush over a halftone this fine — the dots
      // are the one part of this artwork with detail to lose. Sized up front it
      // rasterises vector-crisp and the draw is a 1:1 blit.
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", `${dw}`);
      clone.setAttribute("height", `${dh}`);
      img.src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(new XMLSerializer().serializeToString(clone));
      await img.decode();
      if (!live) return;

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Safari only got ctx.filter in 17. Where it is missing the assignment
        // is a no-op and the card draws ungraded, which is the picture this file
        // already shipped — so no fallback beyond letting it happen.
        if (boost) ctx.filter = boost;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2);
      }
      // Appended before the SVG is hidden, so there is no frame with neither.
      if (!canvas.isConnected) box.appendChild(canvas);
      setFlat(true);
    };

    const invalidate = () => {
      dirty = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        queue = queue.then(draw).catch(() => {});
      });
    };

    // Fires once on observe, so this is also the initial draw. After that the
    // only thing that changes the box is an orientation change, and a frame's
    // coalescing keeps a rotation from redrawing four times.
    const ro = new ResizeObserver(invalidate);
    ro.observe(box);

    // The art is not necessarily finished when it first mounts: c4's grain is
    // generated in the browser and lands a render later, and rasterising before
    // it arrives bakes a card with no grain on it. Watching the subtree catches
    // that without this file having to know which card does it. It goes quiet
    // once the art settles, and the redraw is the same coalesced one.
    // The SVG is hidden by a class on the host rather than by its own style
    // attribute, so this observer never sees its own effect.
    const mo = new MutationObserver(invalidate);
    mo.observe(svg, { attributes: true, childList: true, subtree: true });

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      canvas.remove();
      setFlat(false);
    };
  }, [still, boost]);

  // position: absolute with z-index auto is not a stacking context, so the
  // wrapper is invisible to everything painting over it — the glyph, the scrims
  // and the card glow's blends all see the same backdrop they saw before.
  //
  // max-lg hides the SVG from the document's first paint, not from `flat` — and
  // that, not the canvas, is what this file is really for. Freezing the artwork
  // saved the re-rasters, but the phone still paid for the live graph once,
  // before the canvas landed, at full devicePixelRatio: the exports' filter
  // regions run to 3.5x their own viewBox, so on a 390px card at dpr 3 a single
  // gaussian is a 4135x1849 surface (~30MB) and the four cards' eighteen come to
  // ~680MB of them. iOS kills the tab for it — "A problem repeatedly occurred",
  // Safari and Chrome alike, since both are WebKit there. A media query rather
  // than `still`, because it has to be right in the server's HTML: any JS-set
  // flag is a decision taken after that HTML has already painted.
  //
  // The serialised clone still rasterises from a display:none source — the
  // filters run inside the SVG image, which has its own rendering pass — so the
  // canvas is unchanged, and it is drawn at dpr 2, a quarter the area.
  //
  // Reduced motion on a desktop is `still` too and keeps the live SVG: it is
  // above lg, so max-lg does not fire and `flat` swaps it as before.
  return (
    <div
      ref={host}
      className={`absolute inset-0 max-lg:[&>svg]:hidden ${flat ? "[&>svg]:hidden" : ""}`}
    >
      {children}
    </div>
  );
}
