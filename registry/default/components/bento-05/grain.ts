"use client";

// The grain the c4 card is dusted with, generated instead of downloaded.
//
// The Figma export shipped it as a 1024² PNG inlined as base64 — 2.1MB of
// string in the page's JS bundle. Nothing could compress it, because the file
// was a field of per-pixel random noise and the bytes *were* the randomness:
// greyscale-lossless still came to 718KB.
//
// So the image was measured rather than re-encoded, and it turned out to be one
// line of arithmetic. Two facts fell out of it:
//
//   correlation between neighbouring pixels: -0.0023, i.e. none. There is no
//   spatial structure to reproduce, only a distribution — which is why
//   feTurbulence is the wrong tool here despite being the obvious one. Perlin
//   noise is smooth by construction and tops out near a third of uncorrelated
//   noise's per-pixel contrast, so it renders visibly softer than this.
//
//   above a floor of zeros, the quantiles are dead linear — 4, 32, 60, 88, 115,
//   143, 171, 199, 227, 255, in steps of 28. A clamped uniform, in other words,
//   over a range running below zero, with 43.05% of it landing on the floor.
//
// Solving those two for the range gives the line below, which reproduces the
// original to within 0.07%: mean 72.61 against 72.66, sd 84.09 against 83.94,
// zeros 43.05% against 43.05%.
//
// The image's RGB equalled its alpha exactly, which reads as premultiplied
// white — but PNG is decoded as straight alpha, so what it actually paints is
// grey level `a` at alpha `a`, not white at alpha `a`. That distinction is the
// whole look: white at alpha `a` contributes `a` to the result where this
// contributes `a²/255`, which is a far softer dusting. Setting RGB to full
// white here instead measured 2.06 luma too bright over the card.
const SPAN = 447.8;
const FLOOR = -192.8;

// 256², to tile. The export drew its noise at 0.9 user units per pixel, so this
// spans 230.4 units and repeats about 1.4 times across the card and 3 down —
// invisible in a field this fine, where there is no structure to line up.
const TILE = 256;

// Generated once for the page, not once per card: the export renders twice, as
// the card and again as the blurred glow behind it, and one field does for
// both. Cached at module scope rather than in a hook for the same reason —
// nothing about it depends on a component.
let cached: string | undefined;

export function grainTile(): string {
  if (cached !== undefined) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TILE;
  const image = new ImageData(TILE, TILE);

  // One 32-bit write per pixel rather than four byte writes. Measured, that is
  // the fill down from 5.6ms to under 2 — worth it for a loop this hot, and the
  // packing is the only thing it costs in clarity. Little-endian, so the bytes
  // read R,G,B,A but pack as 0xAABBGGRR — and all four channels carry the same
  // value, per the note above.
  const px = new Uint32Array(image.data.buffer);
  for (let i = 0; i < px.length; i++) {
    const a = Math.max(0, Math.random() * SPAN + FLOOR) | 0;
    px[i] = (a << 24) | (a << 16) | (a << 8) | a;
  }

  canvas.getContext("2d")!.putImageData(image, 0, 0);
  cached = canvas.toDataURL();
  return cached;
}
