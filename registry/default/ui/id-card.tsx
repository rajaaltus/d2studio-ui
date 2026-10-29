"use client";

import * as React from "react";
import { Mail } from "lucide-react";
// An event badge on a strap: the strap hangs from the top of its frame and
// ends in a metal crimp, and a long U of wire from the crimp threads the slot
// punched through the card. Drag the card and it swings;
// a click turns it over, and the strap winds with the turn.
//
// The strap is a light rope of points under gravity with the card as one heavy
// point at its end, solved by verlet integration with distance constraints:
// stable at any frame rate, and the swing, the slack and the pendulum all fall
// out of the same few lines.
//
// The strap and the metal are drawn on one canvas: the strap's print laid
// along the rope in short slices, each narrowed by its share of the card's
// twist, and the metal in layered black chrome strokes that narrow with the
// turn. The card stays a DOM plane turned in CSS 3D, so its type is crisp and
// its links are links. The canvas sits over the card and is cut away round it
// every frame, all but a notch at the top, which is how the ring is seen to
// cross the card's top edge and go through the slot.

interface LanyardProps {
  frontImage: string;
  backImage: string;
  /** One repeat of the strap's print, its height spanning the band. */
  strapImage: string;
  /** Live content laid over each face's art: links stay links. */
  front?: React.ReactNode;
  back?: React.ReactNode;
  className?: string;
}

type Pt = { x: number; y: number; px: number; py: number; w: number };

// Card art is drawn at 320 by 450, its top 50 kept clear for the slot punched
// through the card.
const ART_ASPECT = 450 / 320;
const SEGMENTS = 10;
// Slices drawn per link along the strap's curve.
const SUB = 6;
// Points two links apart stay at least this many links apart: the strap's
// tightest bend, about 83 degrees between neighbouring links.
const BEND = 1.5;
// The share of the whole strap that hangs in frame.
const SEEN = 0.3;
const GRAVITY = 1900;
const STEP = 1 / 120;
// Room for the strap and the badge to swing past the frame's sides and bottom
// without being cut; only the top edge clips, where the strap runs on up to
// the neck.
const MARGIN = 140;
// The strap continues this far above its anchor, out of frame.
const LEAD = 400;

// The loop rides the rope as two links, the upper and lower halves of its
// length, so the solver gives the metal some weight between the strap and the
// card; it is drawn as one rigid piece (see draw). In units of k, from the
// strap's end to the loop's foot in the card's slot.
const UPPER = 16;
const LOWER = 20;
// The metal parts' share of a strap point's lightness: light enough to
// follow the strap and the card, heavy enough not to flutter between them.
const METAL_W = 0.8;

// The light the metal answers to: up and to the left, fixed in the room, so
// highlights stay put on the parts while they swing.
const LIGHT = { x: -0.6, y: -0.8 };

// Black chrome: a polished dark plate still mirrors the room, so it is mostly
// near black with a few hard reflected bands and one bright one, not a flat
// grey. Laid across a flat part's width.
function chrome(ctx: CanvasRenderingContext2D, x0: number, x1: number) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, "#050607");
  g.addColorStop(0.14, "#3a4046");
  g.addColorStop(0.26, "#d4d9de");
  g.addColorStop(0.36, "#2a2f34");
  g.addColorStop(0.55, "#07080a");
  g.addColorStop(0.72, "#30363b");
  g.addColorStop(0.86, "#8a929a");
  g.addColorStop(1, "#0b0c0e");
  return g;
}

// A round bar bent along a path: rim, body, a cool rim light and a dark
// reflection on the shade side, a lit edge and a hard white specular line on
// the light side, each pushed toward or away from the light. Dark metal only
// reads as polished through its reflections; without the rim light it melts
// into a dark page.
function tube(ctx: CanvasRenderingContext2D, path: Path2D, width: number, lx: number, ly: number) {
  const along = (k: number, color: string, w: number) => {
    ctx.save();
    ctx.translate(lx * width * k, ly * width * k);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.stroke(path);
    ctx.restore();
  };
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  along(0, "#08090a", width + 1.1);
  along(0, "#1b1e22", width);
  along(-0.3, "rgb(160 172 190 / 0.5)", width * 0.16);
  along(-0.12, "#0c0e10", width * 0.34);
  along(0.15, "#737b84", width * 0.55);
  along(0.26, "#f4f6f8", width * 0.2);
}

// The room's light turned into a part's own frame, for a part tilted by ang.
function lit(ang: number) {
  return {
    lx: LIGHT.x * Math.cos(-ang) - LIGHT.y * Math.sin(-ang),
    ly: LIGHT.x * Math.sin(-ang) + LIGHT.y * Math.cos(-ang),
  };
}

// The badge loop, in its own frame: +y runs from the strap's end down to the
// loop's foot in the slot, units of k. A long U of round wire whose two ends
// are pressed into a metal crimp over the strap's end. The loop stands across
// the card's plane, which cuts it at its foot, so one leg is in front of the
// card and the other behind. `half` draws one leg and its half of the foot: 1
// the near one, -1 the far.
const LOOP_W = 15;
function loop(ctx: CanvasRenderingContext2D, ang: number, half: 1 | -1) {
  const { lx, ly } = lit(ang);
  const r = LOOP_W / 2;
  const foot = UPPER + LOWER;
  const leg = new Path2D();
  leg.moveTo(half * r, 2);
  leg.lineTo(half * r, foot - r);
  // the quarter of the round foot that belongs to this leg, ending at its middle
  leg.arc(0, foot - r, r, half === 1 ? 0 : Math.PI, Math.PI / 2, half === -1);
  ctx.shadowColor = half === 1 ? "rgb(0 0 0 / 0.4)" : "transparent";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetY = 1;
  tube(ctx, leg, 2.2, lx, ly);
  ctx.shadowColor = "transparent";
}

// The crimp, in the same frame: a short metal sleeve pressed over the strap's
// end, as wide as the strap, with the loop's ends going into its foot. sw is
// the strap's width in units of k.
function crimp(ctx: CanvasRenderingContext2D, sw: number) {
  const h = sw / 2 + 0.6;
  ctx.shadowColor = "rgb(0 0 0 / 0.4)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1.5;
  ctx.fillStyle = chrome(ctx, -h, h);
  ctx.beginPath();
  ctx.roundRect(-h, -7, h * 2, 10, [1.5, 1.5, 3.5, 3.5]);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgb(0 0 0 / 0.65)";
  ctx.lineWidth = 0.5;
  ctx.stroke();
  // the pressed seam across it, a dark groove over a lit lip
  ctx.strokeStyle = "rgb(0 0 0 / 0.55)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(-h + 1.2, -2.2);
  ctx.lineTo(h - 1.2, -2.2);
  ctx.stroke();
  ctx.strokeStyle = "rgb(255 255 255 / 0.28)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(-h + 1.2, -1.5);
  ctx.lineTo(h - 1.2, -1.5);
  ctx.stroke();
}

function Lanyard({ frontImage, backImage, strapImage, front, back, className }: LanyardProps) {
  const host = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const card = React.useRef<HTMLDivElement>(null);
  const shade = React.useRef<HTMLDivElement>(null);
  const print = React.useRef<HTMLImageElement | null>(null);
  const [size, setSize] = React.useState<{ cw: number; ch: number; mask: string; rim: number; tab: number } | null>(null);

  React.useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    let dpr = 1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let cw = 0;
    let ch = 0;
    let k = 1;
    let sw = 0;
    let seg = 0;
    let rope = 0;
    // From the loop's foot to the card's centre, held rigid by the slot.
    let hang = 0;
    // The highest the card's centre may go, dragged or thrown.
    let top = 0;
    // The furthest the card's centre may be pulled from the strap's anchor.
    let reach = 0;
    let tabW = 0;
    // The slot's top edge down the card, its bottom edge, and how far into
    // the slot the ring's foot sits.
    let slotTop = 0;
    let slotBottom = 0;
    let slotOff = 0;
    let slotX = 0;
    let slotW = 0;
    let tabH = 0;
    let pts: Pt[] = [];
    let yaw = 0;
    let spin = 0;
    // Which face the strap settles on: 0 the front, 180 the back.
    let side = 0;
    let t = 0;

    const layout = (intro: boolean) => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      // Up to 3x: browser zoom raises the ratio past a screen's own 2x, and
      // the metal's highlight lines are finer than a pixel at 2x there.
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      cv.width = Math.round((W + MARGIN * 2) * dpr);
      cv.height = Math.round((H + MARGIN) * dpr);
      // A bare card, the slot the loop threads punched through it in the
      // clear band above the art. No holder, so no tab and no rim.
      cw = Math.max(150, Math.min(240, W * 0.58));
      k = cw / 200;
      sw = 40 * k;
      const rim = 0;
      const tab = 0;
      ch = cw * ART_ASPECT;
      slotTop = cw * 0.045;
      const slotH = cw * 0.05;
      slotBottom = slotTop + slotH;
      // The strip above the slot rests on the inside of the ring's foot, so the
      // foot sits just under the slot's top edge.
      slotOff = slotH * 0.72;
      slotW = cw * 0.3;
      // The notch the loop crosses in front through is the slot's own width.
      tabW = slotW;
      tabH = tab;
      hang = ch / 2 - (slotTop + slotOff);
      // The strap takes whatever the metal does not, so the badge rests at
      // the same height whatever size the hardware is.
      const metal = (UPPER + LOWER) * k;
      rope = Math.max(30, H - 16 - metal - hang - ch / 2);
      // The card never rises above where it rests, so the strap cannot fold
      // over and the clip is never cut off by the card; and it stretches the
      // strap to twice its length at most, so the card can be dragged a long
      // way with the strap following it, and eases back when let go.
      top = H - 16 - ch / 2;
      reach = (rope + metal + hang) * 2;
      seg = rope / SEGMENTS;
      // Hung straight: any lead-in from the side would start above the
      // ceiling. The intro is the turn below.
      const a = 0;
      const ax = W / 2;
      pts = [];
      // The strap's points, then the loop's middle, its foot and the card.
      const down = [...Array.from({ length: SEGMENTS + 1 }, (_, i) => i * seg), rope + UPPER * k, rope + metal, rope + metal + hang];
      down.forEach((d, i) => {
        const x = ax + Math.sin(a) * d;
        const y = Math.cos(a) * d;
        pts.push({ x, y, px: x, py: y, w: i === 0 ? 0 : i <= SEGMENTS ? 1 : i < down.length - 1 ? METAL_W : 0.18 });
      });
      yaw = intro && !reduce ? 160 : 0;
      spin = 0;
      const rr = slotH / 2;
      const sx = (cw - slotW) / 2;
      slotX = sx;
      const outline = `M0 0H${cw}V${ch}H0Z`;
      const slot = `M${sx + rr} ${slotTop}H${sx + slotW - rr}A${rr} ${rr} 0 0 1 ${sx + slotW - rr} ${slotTop + slotH}H${sx + rr}A${rr} ${rr} 0 0 1 ${sx + rr} ${slotTop}Z`;
      const mask = `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='${cw}' height='${ch}'><path fill-rule='evenodd' d='${outline} ${slot}'/></svg>`,
      )}")`;
      setSize({ cw, ch, mask, rim, tab });
    };

    let drag: { id: number; ox: number; oy: number; x: number; y: number; vx: number; vy: number; at: number } | null = null;
    // Stretch the strap still holds after a drag, as a share of its length.
    // Taking it all back in one step would fling the card at the speed of the
    // whole stretch over 8ms; let go, it eases back to nothing instead.
    let give = 0;

    const step = () => {
      t += STEP;
      const c = pts[pts.length - 1];
      const breeze = reduce ? 0 : 24 * Math.sin(t * 0.7) + 12 * Math.sin(t * 1.9 + 1);
      for (const p of pts) {
        if (!p.w) continue;
        const vx = (p.x - p.px) * 0.98;
        const vy = (p.y - p.py) * 0.98;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + (p === c ? breeze : 0) * STEP * STEP;
        p.y += vy + GRAVITY * STEP * STEP;
      }
      // Let go, the stretch eases out over a third of a second rather than
      // snapping, so a pull settles instead of springing back.
      if (!drag) give *= 0.97;
      if (drag) {
        // Held, the card goes exactly where the pointer is and the strap
        // stretches after it, as far as the frame: its centre never leaves,
        // so at most half the badge does.
        c.px = c.x;
        c.py = c.y;
        c.x = Math.min(W, Math.max(0, drag.x - drag.ox));
        c.y = Math.min(H, Math.max(top, drag.y - drag.oy));
        const dx = c.x - pts[0].x;
        const dy = c.y - pts[0].y;
        const d = Math.hypot(dx, dy);
        if (d > reach) {
          c.x = pts[0].x + (dx / d) * reach;
          c.y = Math.max(top, pts[0].y + (dy / d) * reach);
        }
      }
      // Strap links keep their length; then the loop's two halves, and the
      // rigid hang from the loop's foot to the card's centre.
      for (let n = 0; n < 24; n++) {
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const wa = a.w;
          const wb = b === c && drag ? 0 : b.w;
          if (!wa && !wb) continue;
          const len = i < SEGMENTS ? seg * (1 + give) : i === SEGMENTS ? UPPER * k : i === SEGMENTS + 1 ? LOWER * k : hang;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = (d - len) / d / (wa + wb);
          a.x += dx * f * wa;
          a.y += dy * f * wa;
          b.x -= dx * f * wb;
          b.y -= dy * f * wb;
        }
        // Woven tape resists a sharp fold: points two apart are kept at
        // least BEND links apart, so the strap rounds into curves and waves
        // instead of kinking.
        for (let i = 0; i < SEGMENTS - 1; i++) {
          const a = pts[i];
          const b = pts[i + 2];
          const wa = a.w;
          const wb = b.w;
          if (!wa && !wb) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const min = seg * BEND;
          if (d >= min) continue;
          const f = ((d - min) / d / (wa + wb)) * 0.5;
          a.x += dx * f * wa;
          a.y += dy * f * wa;
          b.x -= dx * f * wb;
          b.y -= dy * f * wb;
        }
      }
      // Thrown, the card's centre stays inside the frame too: a soft wall,
      // moving the point and not its last position, so it bounces off
      // rather than sticking.
      const keep = (v: number, min: number, max: number) => (v < min ? min + (v - min) * 0.5 : v > max ? max + (v - max) * 0.5 : v);
      c.x = keep(c.x, 0, W);
      c.y = keep(c.y, -Infinity, H);
      // The ceiling is hard: the card stops there, its upward speed spent.
      if (c.y < top) c.y = c.py = top;
      // The strap twists back to the face showing: a torsion spring toward
      // the nearest turn that lands on it. Swinging and throwing never turn
      // the card; only a click flips it.
      const home = Math.round((yaw - side) / 360) * 360 + side;
      spin += (-(yaw - home) * 22 - spin * 4) * STEP;
      yaw += spin * STEP;
      // A non-number anywhere would stop every transform from applying and
      // freeze the badge where it was; hang it afresh instead.
      if (!Number.isFinite(c.x + c.y + yaw + spin)) layout(false);
    };

    const draw = () => {
      const c = pts[pts.length - 1];
      // Each part's tilt off straight down, from its own link.
      const tilt = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.atan2(-(b.x - a.x), b.y - a.y);
      const ang = tilt(pts[SEGMENTS + 2], c);
      // The metal is drawn as one rigid chain hung up from the card, not at
      // the solver's own points: while the card is dragged or thrown the
      // links stretch a few pixels, and parts drawn where they were solved
      // came apart, the metal floating between the strap and the slot. So the
      // loop's foot is the card's slot, the crimp is the loop's length above
      // it toward the strap, and the strap's last point meets the crimp. Only
      // the drawing moves; the physics keeps its own state.
      const toward = (from: { x: number; y: number }, to: { x: number; y: number }, len: number): Pt => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const d = Math.hypot(dx, dy) || 1;
        return { x: from.x + (dx / d) * len, y: from.y + (dy / d) * len, px: 0, py: 0, w: 0 };
      };
      const tip: Pt = { x: c.x + Math.sin(ang) * hang, y: c.y - Math.cos(ang) * hang, px: 0, py: 0, w: 0 };
      const end = toward(tip, pts[SEGMENTS], (UPPER + LOWER) * k);
      const ringAng = tilt(end, tip);
      const twist = (yaw * Math.PI) / 180;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W + MARGIN * 2, H + MARGIN);
      ctx.translate(MARGIN, 0);

      // Everything but the card, with the slot punched back in: the strap,
      // the crimp and the loop's far leg are clipped to it. The notch cut
      // below lets this canvas show over the card's top band so the near leg
      // can cross in front, and without this the strap and the crimp showed
      // there too whenever the card turned under them. Same projection as
      // that cut, in this canvas's own space.
      const cxL = c.x;
      const cosT = Math.cos(twist);
      const sinT = Math.sin(twist);
      const caL = Math.cos(ang);
      const saL = Math.sin(ang);
      const proj = (x: number, y: number): [number, number] => {
        const px0 = x - cw / 2;
        const py0 = y - ch / 2;
        const s0 = 1 / (1 + (px0 * sinT) / 900);
        const X = px0 * cosT * s0;
        const Y = py0 * s0;
        return [cxL + X * caL - Y * saL, c.y + X * saL + Y * caL];
      };
      const shape = (pts2: [number, number][], into: Path2D) => {
        pts2.forEach(([x, y], i) => (i ? into.lineTo(...proj(x, y)) : into.moveTo(...proj(x, y))));
        into.closePath();
      };
      const behind = new Path2D();
      behind.rect(-MARGIN, -LEAD, W + MARGIN * 2, H + MARGIN + LEAD);
      const t0 = (cw - tabW) / 2;
      const t1 = t0 + tabW;
      shape([[0, tabH], [t0, tabH], [t0, 0], [t1, 0], [t1, tabH], [cw, tabH], [cw, ch], [0, ch]], behind);
      shape([[slotX, slotTop], [slotX + slotW, slotTop], [slotX + slotW, slotBottom], [slotX, slotBottom]], behind);
      ctx.save();
      ctx.clip(behind, "evenodd");
      // The strap: one continuous ribbon down a curve through the rope's
      // points, its print laid along it, then shading across the band so it
      // reads as cloth curving away at its edges. Neighbouring pieces share
      // their edge points, and each edge sits square to the curve's own
      // direction there, so a tight bend narrows on the inside and opens on
      // the outside without a seam, a fan or a wedge. It runs on from out of
      // frame above the anchor, so it never shows a cut end. The card's turn
      // winds the whole strap, most of it out of frame up to the neck, so the
      // stretch on screen carries only the last share of the twist, each
      // piece narrowed by what reaches it. The print is on both sides, so a
      // piece turned past a quarter still reads the right way.
      const img = print.current;
      const scale = sw / 96;
      const px = img ? img.width / 300 : 1;
      type P = { x: number; y: number; f: number };
      // The lead runs straight up to the neck, never back along the first
      // link: once a throw folds the strap over its anchor, that line points
      // down into frame and draws a second, cut-off tail.
      const line: P[] = [
        { x: pts[0].x, y: pts[0].y - LEAD, f: 0 },
        { x: pts[0].x, y: pts[0].y, f: 0 },
      ];
      // Catmull-Rom through the rope's points. It leaves the anchor heading up
      // into the lead, and meets the crimp along the loop's own line.
      const at = (i: number) =>
        i < 0
          ? { x: pts[0].x, y: pts[0].y - seg }
          : i > SEGMENTS
            ? { x: end.x - Math.sin(ringAng) * seg, y: end.y + Math.cos(ringAng) * seg }
            : i === SEGMENTS
              ? end
              : pts[i];
      for (let i = 0; i < SEGMENTS; i++) {
        const p0 = at(i - 1);
        const p1 = at(i);
        const p2 = at(i + 1);
        const p3 = at(i + 2);
        for (let j = 1; j <= SUB; j++) {
          const s = j / SUB;
          const s2 = s * s;
          const s3 = s2 * s;
          const cr = (a: number, b: number, c2: number, d: number) =>
            0.5 * (2 * b + (c2 - a) * s + (2 * a - 5 * b + 4 * c2 - d) * s2 + (3 * b - a - 3 * c2 + d) * s3);
          line.push({ x: cr(p0.x, p1.x, p2.x, p3.x), y: cr(p0.y, p1.y, p2.y, p3.y), f: (i + s) / SEGMENTS });
        }
      }
      // Each point's two edges, square to the curve, and how far along the
      // print it sits.
      const edges = line.map((p, i) => {
        const a = line[Math.max(0, i - 1)];
        const b = line[Math.min(line.length - 1, i + 1)];
        const tl = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const tx = (b.x - a.x) / tl;
        const ty = (b.y - a.y) / tl;
        const turn = Math.cos(twist * (1 - SEEN + SEEN * p.f));
        const hw = (sw / 2) * Math.max(0.04, Math.abs(turn));
        return { l: { x: p.x + ty * hw, y: p.y - tx * hw }, r: { x: p.x - ty * hw, y: p.y + tx * hw }, tx, ty, turn };
      });
      const pattern = img ? ctx.createPattern(img, "repeat") : null;
      let run = 0;
      for (let i = 0; i < line.length - 1; i++) {
        const A = edges[i];
        const B = edges[i + 1];
        const len = Math.hypot(line[i + 1].x - line[i].x, line[i + 1].y - line[i].y);
        // Each piece reaches a pixel into the next, which is drawn over it,
        // so antialiased edges never leave a hairline between them.
        const o = 0.8;
        const bl = { x: B.l.x + B.tx * o, y: B.l.y + B.ty * o };
        const br = { x: B.r.x + B.tx * o, y: B.r.y + B.ty * o };
        ctx.beginPath();
        ctx.moveTo(A.l.x, A.l.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(A.r.x, A.r.y);
        ctx.closePath();
        if (pattern) {
          // Affine map from the print (u along, v across, in image pixels) to
          // this piece: three corners pin it, the fourth is near enough.
          const u0 = (run / scale) * px;
          const u1 = ((run + len) / scale) * px;
          const vh = 96 * px;
          const sx1 = u1 - u0;
          const sy2 = vh;
          const ax = B.l.x - A.l.x;
          const ay = B.l.y - A.l.y;
          const bx = A.r.x - A.l.x;
          const by = A.r.y - A.l.y;
          const ma = ax / sx1;
          const mb = ay / sx1;
          const mc = bx / sy2;
          const md = by / sy2;
          pattern.setTransform(new DOMMatrix([ma, mb, mc, md, A.l.x - ma * u0, A.l.y - mb * u0]));
          ctx.fillStyle = pattern;
          ctx.fill();
        }
        const mid = (p: { x: number; y: number }, q: { x: number; y: number }) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
        const ml = mid(A.l, B.l);
        const mr = mid(A.r, B.r);
        const g = ctx.createLinearGradient(ml.x, ml.y, mr.x, mr.y);
        g.addColorStop(0, "rgb(0 0 0 / 0.35)");
        g.addColorStop(0.18, "rgb(0 0 0 / 0)");
        g.addColorStop(0.5, "rgb(255 255 255 / 0.05)");
        g.addColorStop(0.82, "rgb(0 0 0 / 0)");
        g.addColorStop(1, "rgb(0 0 0 / 0.4)");
        ctx.fillStyle = g;
        ctx.fill();
        // Turned edge on, the band falls out of the light.
        ctx.fillStyle = `rgb(0 0 0 / ${(1 - Math.abs((A.turn + B.turn) / 2)) * 0.55})`;
        ctx.fill();
        run += len;
      }
      ctx.restore();

      // The hardware, hung from the strap's end on the loop's line and narrowed
      // by the card's turn, which the loop takes in the slot. Never to nothing,
      // since wire edge on still shows its thickness.
      const part = (at: Pt, a: number, deg: number, paint: () => void) => {
        const ty = Math.cos((deg * Math.PI) / 180);
        ctx.save();
        ctx.translate(at.x, at.y);
        ctx.rotate(a);
        ctx.scale(k * (ty < 0 ? -1 : 1) * Math.max(0.12, Math.abs(ty)), k);
        paint();
        ctx.restore();
      };
      // The loop's far leg goes behind the card.
      ctx.save();
      ctx.clip(behind, "evenodd");
      part(end, ringAng, yaw, () => loop(ctx, ringAng, -1));
      ctx.restore();
      // The near leg in front of everything but its own crimp, which is drawn
      // last over the loop's two ends, and behind the card like the strap.
      part(end, ringAng, yaw, () => loop(ctx, ringAng, 1));
      ctx.save();
      ctx.clip(behind, "evenodd");
      part(end, ringAng, yaw, () => crimp(ctx, sw / k));
      ctx.restore();

      // The card, hung on the same line, turned in 3D by its twist.
      // The holder's shadow on the page, narrowed as it turns.
      if (shade.current) {
        shade.current.style.transform = `translate(${c.x - cw / 2}px, ${c.y - ch / 2 + 10}px) rotate(${ang}rad) scaleX(${Math.max(0.05, Math.abs(Math.cos(twist)))})`;
      }
      const node = card.current;
      if (node) {
        node.style.transform = `translate(${c.x - cw / 2}px, ${c.y - ch / 2}px) rotate(${ang}rad) perspective(900px) rotateY(${yaw}deg)`;
        // A laminate catches the light in a band that slides as it turns,
        // and the face darkens as it turns edge on. Held inside the band's
        // own travel, so its far side never wraps back onto the card.
        node.style.setProperty("--glint", `${Math.min(100, Math.max(0, 50 + Math.sin(twist) * 60 + ang * 60))}%`);
        node.style.setProperty("--shade", `${Math.abs(Math.sin(twist)) * 0.35}`);
      }

      // Cut the canvas away where the card is, so the card covers the strap
      // and the loop, except a notch down the tab to the slot's bottom edge:
      // there the loop crosses in front of the card and through the slot. The
      // card's outline is projected the way CSS projects it: turned about its
      // centre, perspective, then the tilt.
      const cx = c.x + MARGIN;
      const cy = c.y;
      const cos = Math.cos(twist);
      const sin = Math.sin(twist);
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const project = (x: number, y: number) => {
        const px = x - cw / 2;
        const py = y - ch / 2;
        const s = 1 / (1 + (px * sin) / 900);
        const X = px * cos * s;
        const Y = py * s;
        return `${(cx + X * ca - Y * sa).toFixed(1)}px ${(cy + X * sa + Y * ca).toFixed(1)}px`;
      };
      const n0 = (cw - tabW) / 2;
      const n1 = n0 + tabW;
      const quad = [
        project(0, 0),
        project(n0, 0),
        project(n0, slotBottom),
        project(n1, slotBottom),
        project(n1, 0),
        project(cw, 0),
        project(cw, ch),
        project(0, ch),
        project(0, 0),
      ];
      const clip = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${quad.join(", ")})`;
      cv.style.clipPath = clip;
    };

    let raf = 0;
    let last = 0;
    let acc = 0;
    let visible = true;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.05) : STEP;
      last = now;
      acc += dt;
      while (acc >= STEP) {
        step();
        acc -= STEP;
      }
      draw();
    };

    layout(true);
    raf = requestAnimationFrame(frame);

    // Observing reports the first size at once; only a real change re-hangs
    // the badge, or the lead-in swing would be cut off on mount.
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) layout(false);
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    // Dragging takes the card, and a throw keeps the pointer's speed.
    let press: { x: number; y: number; at: number } | null = null;
    const node = card.current!;
    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      // A link on the card is pressed, not the card picked up.
      if ((e.target as Element).closest("a, button")) return;
      const p = local(e);
      const c = pts[pts.length - 1];
      drag = { id: e.pointerId, ox: p.x - c.x, oy: p.y - c.y, x: p.x, y: p.y, vx: 0, vy: 0, at: performance.now() };
      press = { x: e.clientX, y: e.clientY, at: drag.at };
      node.setPointerCapture(e.pointerId);
      node.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const p = local(e);
      const now = performance.now();
      const dt = Math.max((now - drag.at) / 1000, 1 / 240);
      drag.vx = drag.vx * 0.5 + ((p.x - drag.x) / dt) * 0.5;
      drag.vy = drag.vy * 0.5 + ((p.y - drag.y) / dt) * 0.5;
      drag.x = p.x;
      drag.y = p.y;
      drag.at = now;
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const c = pts[pts.length - 1];
      // Held still before letting go, it drops rather than taking the speed
      // of a move that ended a while ago.
      if (performance.now() - drag.at > 50) drag.vx = drag.vy = 0;
      const cap = (n: number) => Math.max(-3000, Math.min(3000, n));
      c.px = c.x - cap(drag.vx) * STEP;
      c.py = c.y - cap(drag.vy) * STEP;
      let run = 0;
      for (let i = 0; i < SEGMENTS; i++) run += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
      give = Math.max(0, run / rope - 1);
      drag = null;
      // A click, not a drag: turn the card over. The spring does the turn,
      // so a flip mid swing or mid spin carries on from wherever it is.
      if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6 && performance.now() - press.at < 350) {
        side = side ? 0 : 180;
        spin += side ? 240 : -240;
      }
      press = null;
      node.style.cursor = "";
    };
    node.addEventListener("pointerdown", down);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", up);
    node.addEventListener("pointercancel", up);
    // Capture lost without a pointerup on the card (released outside the
    // window, focus taken): end the drag, or the card stays pinned there.
    node.addEventListener("lostpointercapture", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", up);
      node.removeEventListener("pointercancel", up);
      node.removeEventListener("lostpointercapture", up);
      print.current = null;
    };
  }, []);

  // The print follows the theme: a new image swaps in without re-hanging
  // the badge.
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      print.current = img;
    };
    img.src = strapImage;
  }, [strapImage]);

  // One side of the card: the art with its slot punched out, and the gloss
  // over it. No filter on the card itself: a filter flattens
  // its 3D, and the back face would never turn into view.
  const face = (src: string, isBack?: boolean) => (
    <div
      className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
      style={{
        background: "var(--idc-badge)",
        // Corners from the radius, not the mask, so the edge ring follows them.
        borderRadius: size ? size.cw * 0.06 : undefined,
        maskImage: size?.mask,
        WebkitMaskImage: size?.mask,
        transform: isBack ? "rotateY(180deg)" : undefined,
      }}
    >
      {size && (
        <div
          className="absolute"
          style={{
            left: size.rim,
            right: size.rim,
            top: size.tab + size.rim,
            bottom: size.rim,
            backgroundImage: `url(${src})`,
            backgroundSize: "100% 100%",
            // On the art, not the card: a child's background would cover the
            // card's own inset ring.
            borderRadius: "inherit",
            boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--idc-ink) 10%, transparent)",
            containerType: "inline-size",
          }}
        >
          {isBack ? back : front}
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          // One broad sheen with a bell's falloff, eased in stops so it has
          // no edge to read as a stripe: a lamp's reflection on a laminate,
          // not a streak painted on it.
          background:
            "linear-gradient(105deg, transparent 22%, rgb(255 255 255 / 0.02) 30%, rgb(255 255 255 / 0.06) 37%, rgb(255 255 255 / 0.11) 44%, rgb(255 255 255 / 0.13) 48%, rgb(255 255 255 / 0.11) 52%, rgb(255 255 255 / 0.06) 59%, rgb(255 255 255 / 0.02) 66%, transparent 74%) no-repeat",
          backgroundSize: "300% 100%",
          backgroundPosition: "var(--glint) 0",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[oklch(0.13_0_0)]" style={{ opacity: "var(--shade)" }} />
    </div>
  );

  return (
    <div ref={host} className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        ref={shade}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-[8%/6%] bg-[oklch(0.13_0_0/0.3)] blur-[12px]"
        // The card's footprint, turned about its centre, so it still swings
        // with the card.
        style={
          size
            ? {
                width: size.cw,
                height: size.ch - size.tab,
                marginTop: size.tab,
                transformOrigin: `50% ${size.ch / 2 - size.tab}px`,
              }
            : undefined
        }
      />
      <div
        ref={card}
        aria-hidden
        className="absolute top-0 left-0 cursor-grab touch-none [transform-style:preserve-3d]"
        style={{
          width: size?.cw,
          height: size?.ch,
          pointerEvents: "auto",
        }}
      >
        {face(frontImage)}
        {face(backImage, true)}
      </div>
      {/* Over the card, and cut away round it every frame. Wider than the
          frame on three sides and level with it at the top. */}
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute top-0"
        style={{ left: -MARGIN, width: `calc(100% + ${MARGIN * 2}px)`, height: `calc(100% + ${MARGIN}px)` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// The badge: card faces painted on a canvas and handed to the lanyard as
// images, so type stays crisp when the card turns.

export type IdCardContact = {
  label: string;
  href: string;
  /** A 24 by 24 icon path. Null draws an envelope. */
  path: string | null;
  color?: string;
};

// 1024 wide at the lanyard's portrait proportions (1.6 by 2.25), laid out on a
// 320 by 450 grid and scaled up.
const W = 320;
const H = 450;
const SCALE = 1024 / W;
const FONT = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

// The card's own palette, so it inverts with the host and never reads a host
// token. The canvas reads these off the element when it paints.
const TOKENS =
  "[--idc-badge:oklch(0.99_0_0)] [--idc-ink:oklch(0.2_0_0)] [--idc-ink-2:oklch(0.5_0.006_60)] [--idc-page:oklch(0.965_0.012_85)] [--idc-well:oklch(0_0_0/0.05)] [--idc-strap:oklch(0.38_0.01_270)] [--idc-strap-weave:oklch(1_0_0/0.07)] dark:[--idc-badge:oklch(0.3_0.01_270)] dark:[--idc-ink:oklch(0.97_0_0)] dark:[--idc-ink-2:oklch(0.7_0.01_260)] dark:[--idc-page:oklch(0.19_0.045_262)] dark:[--idc-well:oklch(1_0_0/0.07)] dark:[--idc-strap:oklch(0.36_0.01_270)]";

function load(src: string) {
  return new Promise<HTMLImageElement | null>((done) => {
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = () => done(null);
    img.src = src;
  });
}

// How many lines wrap() breaks text into, capped like wrap() caps it.
function lineCount(ctx: CanvasRenderingContext2D, text: string, max: number, lines = 99) {
  let line = "";
  let n = 1;
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      line = word;
      n++;
    } else line = next;
  }
  return Math.min(n, lines);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number, lines = 99) {
  let line = "";
  let n = 0;
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      ctx.fillText(line, x, y + n * lh);
      line = word;
      if (++n >= lines) return y + n * lh;
    } else line = next;
  }
  ctx.fillText(line, x, y + n * lh);
  return y + (n + 1) * lh;
}

type Art = { front: string; back: string; strap: string };

/** An event badge hanging on a strap from the top of its parent. Drag it and
 *  it swings; click it and it turns over. Give the parent a height. */
export function IdCard({
  name,
  role,
  bio,
  photo,
  contacts = [],
  logo = { light: "/icon-light.png", dark: "/icon-dark.png" },
  brand = "Studio",
  className,
}: {
  name: string;
  role: string;
  bio: string;
  photo: string;
  contacts?: IdCardContact[];
  /** The mark on the card and strap, one file per theme. */
  logo?: { light: string; dark: string };
  /** The word printed beside the mark on the strap and the back. */
  brand?: string;
  className?: string;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const [art, setArt] = React.useState<Art | null>(null);

  React.useEffect(() => {
    const root = host.current!;
    let images: (HTMLImageElement | null)[] | null = null;

    const paint = () => {
      if (!images) return;
      const [photoImg, markLight, markDark] = images;
      const css = getComputedStyle(root);
      const v = (n: string) => css.getPropertyValue(n).trim();
      const dark = document.documentElement.classList.contains("dark");
      const mark = dark ? markDark : markLight;
      const [bg, ink, ink2, well] = [v("--idc-badge"), v("--idc-ink"), v("--idc-ink-2"), v("--idc-page")];
      const pad = 26;
      const pw = W - pad * 2;

      const sheet = () => {
        const c = document.createElement("canvas");
        c.width = W * SCALE;
        c.height = H * SCALE;
        const ctx = c.getContext("2d")!;
        ctx.scale(SCALE, SCALE);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        return [c, ctx] as const;
      };

      // Front: the mark, a portrait with the name and role beside it, and
      // About under them. The contact icons at the foot are live links laid
      // over the art. The top 50px stay clear for the slot.
      const [front, f] = sheet();
      if (mark) f.drawImage(mark, pad, 52, 26, 26);
      const py = 98;
      const ps = 92;
      f.save();
      f.beginPath();
      f.roundRect(pad, py, ps, ps, 16);
      f.clip();
      f.fillStyle = well;
      f.fillRect(pad, py, ps, ps);
      if (photoImg) {
        const s = Math.max(ps / photoImg.width, ps / photoImg.height);
        const iw = photoImg.width * s;
        const ih = photoImg.height * s;
        f.drawImage(photoImg, pad + (ps - iw) / 2, py + (ps - ih) / 2, iw, ih);
      }
      f.restore();
      const tx = pad + ps + 16;
      const tw = W - pad - tx;
      // Name and role centred as one block on the portrait, measured from the
      // name's cap height to the role's last baseline, which is what the eye
      // reads as the block's edges.
      const NAME = `650 22px ${FONT}`;
      const ROLE = `400 15px ${FONT}`;
      f.font = NAME;
      const nameLines = lineCount(f, name, tw, 2);
      f.font = ROLE;
      const roleLines = lineCount(f, role, tw, 3);
      const cap = 22 * 0.72;
      const block = cap + (nameLines - 1) * 26 + 24 + (roleLines - 1) * 19;
      const first = py + (ps - block) / 2 + cap;
      f.fillStyle = ink;
      f.font = NAME;
      wrap(f, name, tx, first, tw, 26, 2);
      f.fillStyle = ink2;
      f.font = ROLE;
      wrap(f, role, tx, first + (nameLines - 1) * 26 + 24, tw, 19, 3);
      f.fillStyle = ink;
      f.font = `600 17px ${FONT}`;
      f.fillText("About", pad, py + ps + 40);
      f.fillStyle = ink2;
      f.font = `400 18px ${FONT}`;
      wrap(f, bio, pad, py + ps + 66, pw, 25, 5);

      // Back: a print of corner brackets at 7% ink, stepped up by the card's
      // roughly 0.6 scale so it does not shimmer, and over it the mark and
      // the brand word on one rounded tile.
      const [back, b] = sheet();
      b.save();
      b.fillStyle = ink;
      b.globalAlpha = 0.07;
      const corners = new Path2D("M1 8H3V9H0V6H1ZM9 9H6V8H8V6H9ZM3 1H1V3H0V0H3ZM9 3H8V1H6V0H9Z");
      for (let y = -3; y < H / 1.6; y += 12)
        for (let x = -3; x < W / 1.6; x += 12)
          for (const d of [0, 3]) {
            b.setTransform(1.6 * SCALE, 0, 0, 1.6 * SCALE, (x + d) * 1.6 * SCALE, (y + d) * 1.6 * SCALE);
            b.fill(corners);
          }
      b.restore();
      const ts = 150;
      const tx0 = (W - ts) / 2;
      const ty0 = 160;
      b.beginPath();
      b.roundRect(tx0, ty0, ts, ts, 30);
      b.fillStyle = bg;
      b.fill();
      b.fillStyle = ink;
      b.globalAlpha = 0.06;
      b.fill();
      b.globalAlpha = 1;
      const ms = 80;
      if (mark) b.drawImage(mark, (W - ms) / 2, ty0 + 24, ms, ms);
      b.fillStyle = ink;
      b.font = `600 19px ${FONT}`;
      b.textAlign = "center";
      b.fillText(brand, W / 2, ty0 + 128);
      b.textAlign = "left";

      // Strap: one repeat of the print, the mark and the brand word over a
      // weave, drawn at four times its layout size since the ribbon magnifies
      // it wherever it faces the eye.
      const strap = document.createElement("canvas");
      strap.width = 1200;
      strap.height = 384;
      const s = strap.getContext("2d")!;
      s.scale(4, 4);
      s.fillStyle = v("--idc-strap");
      s.fillRect(0, 0, 300, 96);
      s.strokeStyle = v("--idc-strap-weave");
      s.lineWidth = 2;
      for (let i = -96; i < 300; i += 6) {
        s.beginPath();
        s.moveTo(i, 0);
        s.lineTo(i + 96, 96);
        s.stroke();
      }
      if (markDark) s.drawImage(markDark, 18, 24, 48, 48);
      s.fillStyle = "rgb(255 255 255 / 0.9)";
      s.font = `600 34px ${FONT}`;
      s.fillText(brand, 78, 60);

      setArt({
        front: front.toDataURL("image/png"),
        back: back.toDataURL("image/png"),
        strap: strap.toDataURL("image/png"),
      });
    };

    void Promise.all([load(photo), load(logo.light), load(logo.dark)]).then((loaded) => {
      images = loaded;
      paint();
    });
    // Repainted when the theme flips.
    const mo = new MutationObserver(paint);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [name, role, bio, photo, logo.light, logo.dark, brand]);

  return (
    <div ref={host} className={`relative h-full w-full ${TOKENS} ${className ?? ""}`}>
      {art && (
        <Lanyard
          frontImage={art.front}
          backImage={art.back}
          strapImage={art.strap}
          front={
            // Sized off the card's own width. Out of the tab order: the same
            // links sit in the layer below for the keyboard and screen readers.
            <div aria-hidden className="absolute inset-x-[8%] bottom-[7%] flex gap-[2.6cqw]">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  title={c.label}
                  tabIndex={-1}
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="grid size-[12cqw] place-items-center rounded-[3.2cqw] bg-[var(--idc-well)] text-[var(--idc-ink)] transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none"
                  style={c.color ? { color: c.color } : undefined}
                >
                  {c.path ? (
                    <svg viewBox="0 0 24 24" className="size-[5.6cqw]" fill="currentColor">
                      <path d={c.path} />
                    </svg>
                  ) : (
                    <Mail className="size-[5.6cqw]" />
                  )}
                </a>
              ))}
            </div>
          }
        />
      )}
      {/* The card is a picture to assistive tech and the keyboard, so its
          words and links are here as well: hidden until focus lands in them,
          then shown on a plate under the card. */}
      <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:inset-x-3 focus-within:bottom-3 focus-within:z-10 focus-within:flex focus-within:flex-wrap focus-within:gap-1.5 focus-within:rounded-2xl focus-within:bg-popover focus-within:p-2 focus-within:shadow-lg">
        <p className="sr-only">
          {name}, {role}. {bio}
        </p>
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-full bg-[var(--idc-well)] px-3 py-1.5 text-xs font-semibold outline-none transition-[scale] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:transition-none"
          >
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}
