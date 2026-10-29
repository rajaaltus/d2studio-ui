"use client";

import * as React from "react";

import { Rig } from "./hero-container/crate";

import "./hero-container/crate.css";

// One screen, a plain background and a 20ft container hanging from a crane
// hook. It swings on its cable and takes a shove from a passing pointer.
// crate.css paints the resting pose, so before hydration, without script or
// under reduced motion the crate simply hangs still.

// Yaw: three quarters on, matching crate.css.
const YAW = -32;
// Pendulum about a crane far above the screen: period about 3.5s.
const K = 3.2;
const C = 0.22;

export function ContainerHero() {
  const stage = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = stage.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = (s: string) => root.querySelector<HTMLElement>(s)!;
    const rig = q(".hc-rig");
    const yaw = q(".hc-yaw");
    const front = q(".hc-f-front");
    const shadow = q(".hc-crate-shadow");
    const box = q(".hc-box");

    const p = { th: 0, w: 0.035, yaw: 0, yv: 0, bob: 0, bv: 0 };
    // The cable's length to the box's underside, read off the layout once and
    // again whenever the stage changes size.
    let arm = 0;
    const sizes = new ResizeObserver(() => {
      arm = yaw.offsetTop + front.offsetHeight;
    });
    sizes.observe(root);

    // Transforms only, no custom property per frame, so a frame never
    // restyles the box's hundred-odd children. The shadow keeps its floor
    // pose from crate.css and only slides with the swing (`translate` applies
    // before `transform`, so it moves along the stage, not the floor plane).
    const draw = () => {
      rig.style.transform = `translateY(${p.bob}px) rotate(${p.th}rad)`;
      yaw.style.transform = `rotateY(${YAW + p.yaw}deg)`;
      shadow.style.translate = `${Math.sin(p.th) * arm}px 0`;
    };

    // A pointer moving across the crate shoves it along with the pointer's
    // own speed. A crate weighs tons: a shove nudges it, never throws it.
    // The move only records; the frame applies it, so the box's rect is read
    // once a frame on a clean layout rather than on every pointer event.
    let px = 0;
    let py = 0;
    let pt = 0;
    let shove: { x: number; y: number; vx: number; vy: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max((now - pt) / 1000, 1 / 120);
      shove = { x: e.clientX, y: e.clientY, vx: pt ? (e.clientX - px) / dt : 0, vy: pt ? (e.clientY - py) / dt : 0 };
      px = e.clientX;
      py = e.clientY;
      pt = now;
    };
    const applyShove = () => {
      if (!shove) return;
      const { x, y, vx, vy } = shove;
      shove = null;
      const r = box.getBoundingClientRect();
      if (x < r.left - 16 || x > r.right + 16 || y < r.top - 16 || y > r.bottom + 16) return;
      const reach = r.top + r.height / 2 + window.innerHeight;
      p.w += (Math.max(-800, Math.min(800, vx)) / reach - p.w) * 0.035;
      p.yv += Math.max(-5, Math.min(5, -vx * 0.002));
      p.bv += Math.max(-30, Math.min(30, vy * 0.03));
    };

    // A damped pendulum with a little wind, a twist on the cable and a bob as
    // the cable stretches.
    let raf = 0;
    let last = 0;
    let t = 0;
    const tick = (now: number) => {
      applyShove();
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 0;
      last = now;
      t += dt;
      const wind = 0.02 * Math.sin(t * 0.6) + 0.012 * Math.sin(t * 1.7 + 1);
      p.w += (-K * Math.sin(p.th) - C * p.w + wind) * dt;
      p.th += p.w * dt;
      p.yv += (-2 * p.yaw - 0.4 * p.yv + 6 * Math.sin(t * 0.45)) * dt;
      p.yaw += p.yv * dt;
      p.bv += (-60 * p.bob - 4 * p.bv) * dt;
      p.bob += p.bv * dt;
      draw();
      raf = requestAnimationFrame(tick);
    };
    // The loop and the pointer listener exist only while the hero is on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        root.addEventListener("pointermove", onMove, { passive: true });
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(tick);
        }
      } else {
        root.removeEventListener("pointermove", onMove);
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      sizes.disconnect();
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Capped, so a frame that grows to fit its content cannot chase svh.
  return (
    <section className="hc-hero relative h-svh min-h-[26rem] max-h-[56rem] bg-[var(--hc-paper)]">
      <div ref={stage} className="hc-pin relative h-full overflow-hidden">
        <div className="hc-stage pointer-events-none absolute inset-0">
          <Rig />
        </div>
      </div>
    </section>
  );
}
